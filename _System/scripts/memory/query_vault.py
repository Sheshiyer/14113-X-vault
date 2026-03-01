#!/usr/bin/env python3
"""
query_vault.py — Semantic search REPL for the PARA Vault Memory Index.

Usage:
    python query_vault.py                                  # interactive REPL
    python query_vault.py --query "sacred geometry"        # one-shot
    python query_vault.py --para Projects --top 5          # filtered REPL
    python query_vault.py --domain "Health/*" --top 10     # domain glob
    python query_vault.py --format pdf --query "biogeometry" # filter by format
    python query_vault.py --json --query "kriya yoga"      # JSON output
    python query_vault.py --exclude-archives -q "notes"    # skip Archives
    python query_vault.py --batch queries.txt              # batch mode
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import fnmatch
import heapq
import json
import os
import re
import sys
import time
from typing import TYPE_CHECKING, Any

# Ensure sibling imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import faiss
import numpy as np
from shard_router import load_sharded_router

MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384

if TYPE_CHECKING:
    from sentence_transformers import SentenceTransformer
else:
    SentenceTransformer = Any  # type: ignore[misc,assignment]

_ST_CLS = None


def _sentence_transformer_cls():
    """Lazy import to keep REPL startup fast when no vector query is executed."""
    global _ST_CLS
    if _ST_CLS is None:
        from sentence_transformers import SentenceTransformer as _SentenceTransformer
        _ST_CLS = _SentenceTransformer
    return _ST_CLS


def _set_hnsw_ef_search(index, ef_search: int | None) -> None:
    if ef_search is None:
        return
    ef = max(1, int(ef_search))
    try:
        ps = faiss.ParameterSpace()
        ps.set_index_parameter(index, "efSearch", ef)
        return
    except Exception:
        pass
    try:
        if hasattr(index, "hnsw"):
            index.hnsw.efSearch = ef
    except Exception:
        return


def load_index(path: str, hnsw_ef_search: int | None = None):
    """Load FAISS index from disk."""
    index = faiss.read_index(path)
    _set_hnsw_ef_search(index, hnsw_ef_search)
    return index


def load_metadata(path: str) -> list[dict]:
    """Load metadata JSON array from disk."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

_DEFAULT_INDEX_DIR = os.path.join(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")),
    "_System", "memory",
)
_DEFAULT_TOP_K = 8
_SNIPPET_LEN = 220
_SESSION_DIRNAME = "query_sessions"
_DEFAULT_HYBRID_ALPHA = 0.65
_DEFAULT_HNSW_EF_SEARCH = 64


class LazyMetaStore:
    """Random-access metadata reader backed by jsonl + offsets sidecars."""

    def __init__(self, jsonl_path: str, offsets_path: str):
        self.jsonl_path = jsonl_path
        self.offsets = np.load(offsets_path, mmap_mode="r")
        self._fh = open(jsonl_path, "rb")
        self._cache: dict[int, dict] = {}
        self._cache_limit = 4096

    def __len__(self) -> int:
        return max(int(self.offsets.shape[0]) - 1, 0)

    def __getitem__(self, idx: int) -> dict:
        if idx < 0:
            idx += len(self)
        if idx < 0 or idx >= len(self):
            raise IndexError(idx)
        cached = self._cache.get(idx)
        if cached is not None:
            return cached

        start = int(self.offsets[idx])
        end = int(self.offsets[idx + 1])
        self._fh.seek(start)
        raw = self._fh.read(max(0, end - start))
        if raw.endswith(b"\n"):
            raw = raw[:-1]
        rec = json.loads(raw.decode("utf-8"))
        if len(self._cache) >= self._cache_limit:
            # Simple bounded cache: drop arbitrary old entry.
            self._cache.pop(next(iter(self._cache)))
        self._cache[idx] = rec
        return rec

    def close(self) -> None:
        try:
            self._fh.close()
        except Exception:
            return


def load_metadata_lazy(meta_path: str) -> LazyMetaStore | None:
    stem, _ = os.path.splitext(meta_path)
    jsonl_path = f"{stem}.jsonl"
    offsets_path = f"{stem}.offsets.npy"
    if not (os.path.exists(jsonl_path) and os.path.exists(offsets_path)):
        return None
    try:
        return LazyMetaStore(jsonl_path=jsonl_path, offsets_path=offsets_path)
    except Exception:
        return None


class LazySentenceModel:
    """Defer sentence-transformer initialization until first use."""

    def __init__(self, model_name: str, verbose: bool = True):
        self.model_name = model_name
        self.verbose = verbose
        self._model: SentenceTransformer | None = None

    def get(self) -> SentenceTransformer:
        if self._model is None:
            if self.verbose:
                print("Loading model...", end=" ", flush=True, file=sys.stderr)
            self._model = _sentence_transformer_cls()(self.model_name)
            if self.verbose:
                print("ready.", file=sys.stderr)
        return self._model


def _resolve_model(model: SentenceTransformer | LazySentenceModel | None) -> SentenceTransformer | None:
    if model is None:
        return None
    if isinstance(model, LazySentenceModel):
        return model.get()
    return model


class LazyFaissIndex:
    """Defer FAISS index load until first vector operation."""

    def __init__(
        self,
        path: str,
        verbose: bool = True,
        estimated_ntotal: int = 0,
        hnsw_ef_search: int | None = None,
    ):
        self.path = path
        self.verbose = verbose
        self.estimated_ntotal = int(max(0, estimated_ntotal))
        self.hnsw_ef_search = hnsw_ef_search
        self._index = None

    def _get(self):
        if self._index is None:
            if self.verbose:
                print("Loading index...", end=" ", flush=True, file=sys.stderr)
            self._index = load_index(self.path, hnsw_ef_search=self.hnsw_ef_search)
            if self.verbose:
                print(f"{self._index.ntotal:,} chunks loaded.", file=sys.stderr)
        return self._index

    @property
    def ntotal(self) -> int:
        if self._index is None:
            return self.estimated_ntotal
        return int(self._index.ntotal)

    @property
    def d(self) -> int:
        return int(self._get().d)

    def search(self, *args, **kwargs):
        return self._get().search(*args, **kwargs)

    def reconstruct(self, idx: int):
        return self._get().reconstruct(idx)

    def __getattr__(self, name: str):
        return getattr(self._get(), name)


# ---------------------------------------------------------------------------
# A-W6-02: Query embedding encoder
# ---------------------------------------------------------------------------

def encode_query(model: SentenceTransformer, text: str) -> np.ndarray:
    """Encode a single query string into a normalized (1, 384) FP32 vector."""
    vec = model.encode(
        [text],
        normalize_embeddings=True,
        convert_to_numpy=True,
        show_progress_bar=False,
    )
    return vec.astype(np.float32)


def _tokenize(text: str) -> list[str]:
    """Lowercase tokenization for lightweight lexical scoring."""
    if not text:
        return []
    return re.findall(r"[a-z0-9]+", text.lower())


def _normalize_phrase(text: str) -> str:
    """Normalize whitespace/casing for phrase matching."""
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def _extract_query_phrases(query_text: str) -> list[str]:
    """Extract quoted phrases, plus full-query phrase fallback, for explicit boosts."""
    q_norm = _normalize_phrase(query_text)
    if not q_norm:
        return []

    phrases: list[str] = []
    seen: set[str] = set()

    for quoted in re.findall(r'"([^"]+)"', query_text or ""):
        phrase = _normalize_phrase(quoted)
        if len(_tokenize(phrase)) < 2 or phrase in seen:
            continue
        seen.add(phrase)
        phrases.append(phrase)

    full_phrase = _normalize_phrase(re.sub(r'["“”]', " ", query_text or ""))
    if len(_tokenize(full_phrase)) >= 2 and full_phrase not in seen:
        phrases.append(full_phrase)

    return phrases


def _phrase_match_boost(phrases: list[str], doc_text: str) -> float:
    """Positive lexical boost when an exact phrase appears in the candidate text."""
    if not phrases or not doc_text:
        return 0.0

    text = _normalize_phrase(doc_text)
    if not text:
        return 0.0

    boost = 0.0
    for phrase in phrases:
        if not phrase:
            continue
        hits = text.count(phrase)
        if hits <= 0:
            continue
        phrase_len = min(len(_tokenize(phrase)), 6)
        per_hit = 0.35 + (0.1 * phrase_len)
        boost += per_hit * min(hits, 3)
    return boost


def _searchable_text(record: dict) -> str:
    """Build a lightweight searchable text blob for lexical retrieval."""
    parts = [
        str(record.get("path", "")),
        str(record.get("heading", "")),
        str(record.get("domain", "")),
        str(record.get("para", "")),
        str(record.get("doc_title", "")),
        str(record.get("chapter", "")),
        str(record.get("page", "")),
        str(record.get("text", "")),
    ]
    tags = record.get("frontmatter_tags", []) or []
    if isinstance(tags, list):
        parts.extend(str(t) for t in tags)
    elif tags:
        parts.append(str(tags))
    return " ".join(p for p in parts if p).lower()


def _lexical_score(query_terms: list[str], doc_text: str) -> float:
    """Compute a simple BM25-like lexical score without external dependencies."""
    if not query_terms or not doc_text:
        return 0.0

    doc_terms = _tokenize(doc_text)
    if not doc_terms:
        return 0.0

    freqs: dict[str, int] = {}
    for tok in doc_terms:
        freqs[tok] = freqs.get(tok, 0) + 1

    # Simple BM25-style TF component with fixed avgdl for robustness.
    k1 = 1.2
    b = 0.75
    avgdl = 280.0
    dl = float(len(doc_terms))
    tf_score = 0.0
    matched = 0
    for term in query_terms:
        tf = freqs.get(term, 0)
        if tf <= 0:
            continue
        matched += 1
        denom = tf + k1 * (1 - b + b * (dl / avgdl))
        tf_score += (tf * (k1 + 1)) / max(denom, 1e-9)

    if matched == 0:
        return 0.0

    coverage = matched / max(len(query_terms), 1)
    return tf_score * (0.5 + 0.5 * coverage)


def _normalize_path(path: str) -> str:
    return path.replace("\\", "/").strip().lstrip("./")


def _sanitize_session_name(name: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9_.-]+", "-", name.strip())
    return safe or "default"


def _session_path(index_dir: str, session_name: str) -> str:
    session_dir = os.path.join(index_dir, _SESSION_DIRNAME)
    os.makedirs(session_dir, exist_ok=True)
    return os.path.join(session_dir, f"{_sanitize_session_name(session_name)}.json")


def _save_session(index_dir: str, session_name: str, payload: dict) -> None:
    path = _session_path(index_dir, session_name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def _load_session(index_dir: str, session_name: str) -> dict | None:
    path = _session_path(index_dir, session_name)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _session_history_entries(payload: dict | None) -> list[dict]:
    """Return normalized session history entries with backward-compatible fallback."""
    if not isinstance(payload, dict):
        return []

    history = payload.get("history")
    if isinstance(history, list):
        return [h for h in history if isinstance(h, dict)]

    # Backward compatibility: legacy payloads may only store last_query.
    last_query = str(payload.get("last_query") or "").strip()
    if not last_query:
        return []
    result_count = None
    last_results = payload.get("last_results")
    if isinstance(last_results, list):
        result_count = len(last_results)
    return [{
        "saved_at": payload.get("saved_at"),
        "query": last_query,
        "result_count": result_count,
    }]


def _make_history_entry(
    *,
    query: str | None = None,
    similar_file: str | None = None,
    result_count: int | None = None,
    saved_at: str | None = None,
) -> dict:
    """Create one session history entry."""
    entry: dict = {"saved_at": saved_at or datetime.now(timezone.utc).isoformat()}
    q = str(query or "").strip()
    s = str(similar_file or "").strip()
    if q:
        entry["query"] = q
    if s:
        entry["similar_file"] = s
    if result_count is not None:
        try:
            entry["result_count"] = int(result_count)
        except Exception:
            pass
    return entry


def _extend_session_history(
    existing_payload: dict | None,
    new_entries: list[dict],
    *,
    limit: int = 50,
) -> list[dict]:
    """Append entries to session history while preserving existing history."""
    history = _session_history_entries(existing_payload)
    for item in new_entries:
        if not isinstance(item, dict):
            continue
        q = str(item.get("query") or "").strip()
        s = str(item.get("similar_file") or "").strip()
        if not q and not s:
            continue
        history.append(item)
    return history[-max(int(limit), 1):]


def _result_preview(results: list[dict], limit: int = 10) -> list[dict]:
    out = []
    for i, r in enumerate(results[:limit]):
        out.append({
            "rank": i + 1,
            "score": round(float(r.get("score", 0.0)), 4),
            "path": r.get("path", ""),
            "heading": r.get("heading") or "",
            "chunk_index": r.get("chunk_index"),
            "para": r.get("para", ""),
            "domain": r.get("domain", ""),
            "enneagram_uuid": r.get("enneagram_uuid", ""),
        })
    return out


def _write_export(path: str | None, content: str) -> None:
    if not path:
        return
    abs_path = os.path.abspath(path)
    parent = os.path.dirname(abs_path)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(abs_path, "w", encoding="utf-8") as f:
        f.write(content)
        if not content.endswith("\n"):
            f.write("\n")


# ---------------------------------------------------------------------------
# A-W6-03: FAISS search wrapper
# ---------------------------------------------------------------------------

def _set_router_filters(
    index: Any,
    *,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
) -> None:
    setter = getattr(index, "set_route_filters", None)
    if setter is None:
        return
    try:
        setter(
            para_filter=para_filter,
            domain_filter=domain_filter,
            format_filter=format_filter,
            exclude_archives=exclude_archives,
        )
    except Exception:
        return


def _capture_router_info(index: Any, info: dict) -> None:
    getter = getattr(index, "get_last_route_info", None)
    if getter is None:
        return
    try:
        route_info = getter(clear=True)
    except TypeError:
        route_info = getter()
    except Exception:
        route_info = None
    if isinstance(route_info, dict):
        info["router"] = route_info


def search(
    index,
    meta: list[dict],
    query_vec: np.ndarray,
    top_k: int = _DEFAULT_TOP_K,
    use_priority: bool = True,
    fetch_multiplier: int = 10,
):
    """Search the FAISS index and return ranked results.

    Returns a list of dicts, each containing:
        score, path, para, domain, heading, frontmatter_tags, chunk_index, rank
    """
    if index is None or query_vec is None:
        return []

    # Over-fetch to allow for post-retrieval filtering and re-ranking
    fetch_k = min(max(top_k * max(fetch_multiplier, 1), top_k), index.ntotal)
    scores, ids = index.search(query_vec, fetch_k)

    results = []
    for score, idx in zip(scores[0], ids[0]):
        if idx < 0:
            continue
        record = dict(meta[idx])
        record["_meta_id"] = int(idx)

        # Apply priority weighting if enabled
        raw_score = float(score)
        if use_priority:
            priority = record.get("priority", 1.0)
            # Weighted score: boost Projects/Areas, penalize Archives
            weighted_score = raw_score * priority
            record["score"] = weighted_score
            record["raw_score"] = raw_score
        else:
            record["score"] = raw_score
            record["raw_score"] = raw_score

        results.append(record)

    # Re-sort by weighted score if priority was used
    if use_priority:
        results.sort(key=lambda x: x["score"], reverse=True)

    return results


def search_lexical(
    meta: list[dict],
    query_text: str,
    top_k: int = _DEFAULT_TOP_K,
    use_priority: bool = True,
    fetch_multiplier: int = 10,
) -> list[dict]:
    """Search metadata using a lightweight lexical scorer."""
    terms = _tokenize(query_text)
    if not terms:
        return []
    phrases = _extract_query_phrases(query_text)

    fetch_k = max(top_k * max(fetch_multiplier, 1), top_k)
    heap: list[tuple[float, int, float, float]] = []  # (score, idx, lexical_raw, phrase_boost)

    for idx, rec in enumerate(meta):
        doc_text = _searchable_text(rec)
        lex_raw = _lexical_score(terms, doc_text)
        phrase_boost = _phrase_match_boost(phrases, doc_text)
        lex_total = lex_raw + phrase_boost
        if lex_total <= 0.0:
            continue
        score = lex_total
        if use_priority:
            score *= float(rec.get("priority", 1.0))

        item = (float(score), int(idx), float(lex_raw), float(phrase_boost))
        if len(heap) < fetch_k:
            heapq.heappush(heap, item)
        elif score > heap[0][0]:
            heapq.heapreplace(heap, item)

    if not heap:
        return []

    ranked = sorted(heap, key=lambda x: x[0], reverse=True)
    results: list[dict] = []
    for score, idx, lex_raw, phrase_boost in ranked:
        record = dict(meta[idx])
        record["_meta_id"] = int(idx)
        record["score"] = float(score)
        record["raw_score"] = float(lex_raw)
        record["lexical_score"] = float(lex_raw + phrase_boost)
        record["phrase_boost"] = float(phrase_boost)
        results.append(record)
    return results


def search_hybrid(
    index,
    meta: list[dict],
    query_vec: np.ndarray,
    query_text: str,
    top_k: int = _DEFAULT_TOP_K,
    use_priority: bool = True,
    alpha: float = _DEFAULT_HYBRID_ALPHA,
) -> list[dict]:
    """Blend vector search with lexical rescoring over vector candidates."""
    candidates = search(
        index,
        meta,
        query_vec,
        top_k=top_k,
        use_priority=use_priority,
        fetch_multiplier=30,
    )
    if not candidates:
        return search_lexical(meta, query_text, top_k=top_k, use_priority=use_priority)

    terms = _tokenize(query_text)
    if not terms:
        return candidates
    phrases = _extract_query_phrases(query_text)

    vector_scores = [float(r.get("score", 0.0)) for r in candidates]
    v_min = min(vector_scores) if vector_scores else 0.0
    v_max = max(vector_scores) if vector_scores else 0.0
    v_span = max(v_max - v_min, 1e-9)

    lexical_raw_scores = []
    phrase_boosts = []
    lexical_scores = []
    for rec in candidates:
        doc_text = _searchable_text(rec)
        lex_raw = float(_lexical_score(terms, doc_text))
        phrase_boost = float(_phrase_match_boost(phrases, doc_text))
        lexical_raw_scores.append(lex_raw)
        phrase_boosts.append(phrase_boost)
        lexical_scores.append(lex_raw + phrase_boost)
    l_max = max(lexical_scores) if lexical_scores else 0.0
    l_den = max(l_max, 1e-9)

    alpha = max(0.0, min(1.0, float(alpha)))
    for rec, lex_raw, phrase_boost, lex in zip(candidates, lexical_raw_scores, phrase_boosts, lexical_scores):
        vec = float(rec.get("score", 0.0))
        vec_norm = (vec - v_min) / v_span
        lex_norm = lex / l_den if l_max > 0.0 else 0.0
        combined = (alpha * vec_norm) + ((1.0 - alpha) * lex_norm)

        # Keep priority influence without double-counting weighted vector score.
        if use_priority:
            priority = float(rec.get("priority", 1.0))
            combined *= (0.75 + (0.25 * priority))

        rec["vector_score"] = vec
        rec["lexical_score"] = lex
        rec["lexical_raw_score"] = lex_raw
        rec["phrase_boost"] = phrase_boost
        rec["_phrase_hit"] = bool(phrase_boost > 0.0)
        rec["score"] = float(combined)
        rec["raw_score"] = vec

    if phrases:
        # Enforce phrase-first ranking when explicit phrase candidates exist.
        candidates.sort(
            key=lambda x: (1 if x.get("_phrase_hit") else 0, float(x.get("score", 0.0))),
            reverse=True,
        )
    else:
        candidates.sort(key=lambda x: x.get("score", 0.0), reverse=True)
    return candidates


def _find_file_chunk_ids(meta: list[dict], file_path: str) -> list[int]:
    """Resolve user path to chunk ids for the indexed file."""
    target = _normalize_path(file_path).lower()
    if not target:
        return []

    exact: list[int] = []
    suffix: list[int] = []
    basename = os.path.basename(target)

    for idx, rec in enumerate(meta):
        rec_path = _normalize_path(str(rec.get("path", ""))).lower()
        if not rec_path:
            continue
        if rec_path == target:
            exact.append(idx)
            continue
        if rec_path.endswith("/" + target) or rec_path.endswith(target):
            suffix.append(idx)
            continue
        if basename and os.path.basename(rec_path) == basename:
            suffix.append(idx)

    return exact if exact else suffix


def _centroid_from_ids(index, ids: list[int], sample_cap: int = 256) -> np.ndarray | None:
    """Build a normalized centroid vector from index ids."""
    if not ids:
        return None

    if len(ids) > sample_cap:
        step = max(1, len(ids) // sample_cap)
        sampled = ids[::step][:sample_cap]
    else:
        sampled = ids

    dim = int(getattr(index, "d", EMBEDDING_DIM))
    vectors = np.zeros((len(sampled), dim), dtype=np.float32)
    for i, idx in enumerate(sampled):
        vectors[i] = index.reconstruct(int(idx))

    centroid = vectors.mean(axis=0, keepdims=True).astype(np.float32)
    norm = float(np.linalg.norm(centroid))
    if norm > 0.0:
        centroid /= norm
    return centroid


def search_similar_file(
    index,
    meta: list[dict],
    file_path: str,
    top_k: int = _DEFAULT_TOP_K,
    use_priority: bool = True,
) -> tuple[list[dict], str | None, int]:
    """Find files similar to the target file path."""
    ids = _find_file_chunk_ids(meta, file_path)
    if not ids:
        return [], None, 0

    source_path = str(meta[ids[0]].get("path", "")) if ids else None
    centroid = _centroid_from_ids(index, ids)
    if centroid is None:
        return [], source_path, len(ids)

    candidate_chunks = search(
        index,
        meta,
        centroid,
        top_k=max(top_k * 6, top_k),
        use_priority=use_priority,
        fetch_multiplier=40,
    )
    source_norm = _normalize_path(source_path or "").lower()

    # Collapse chunk hits into best-hit-per-file ranking.
    by_file: dict[str, dict] = {}
    for hit in candidate_chunks:
        p = str(hit.get("path", ""))
        if not p:
            continue
        if _normalize_path(p).lower() == source_norm:
            continue
        if p not in by_file:
            collapsed = dict(hit)
            collapsed["match_chunks"] = 1
            by_file[p] = collapsed
        else:
            by_file[p]["match_chunks"] = int(by_file[p].get("match_chunks", 0)) + 1
            if float(hit.get("score", 0.0)) > float(by_file[p].get("score", 0.0)):
                keep_count = by_file[p]["match_chunks"]
                by_file[p] = dict(hit)
                by_file[p]["match_chunks"] = keep_count

    results = sorted(
        by_file.values(),
        key=lambda r: (float(r.get("score", 0.0)), int(r.get("match_chunks", 0))),
        reverse=True,
    )
    return results, source_path, len(ids)


# ---------------------------------------------------------------------------
# A-W6-04: PARA filter
# ---------------------------------------------------------------------------

def filter_para(results: list[dict], para_category: str) -> list[dict]:
    """Filter results to only those matching a PARA category.

    Case-insensitive match (e.g. 'projects' matches 'Projects').
    """
    target = para_category.lower()
    return [r for r in results if r.get("para", "").lower() == target]


# ---------------------------------------------------------------------------
# A-W6-05: Domain filter with wildcard support
# ---------------------------------------------------------------------------

def filter_domain(results: list[dict], pattern: str) -> list[dict]:
    """Filter results by domain, supporting glob patterns.

    Examples:
        'Health/*'              → Health/Wellness, Health/Medicinal-Mushrooms, etc.
        'Health/Wellness'       → exact match
        'Alternative-Science/*' → all Alternative-Science subdomains
    """
    return [
        r for r in results
        if fnmatch.fnmatch(r.get("domain", ""), pattern)
    ]


# ---------------------------------------------------------------------------
# B-W9: Format filter
# ---------------------------------------------------------------------------

def filter_format(results: list[dict], fmt: str) -> list[dict]:
    """Filter results by file_format (md, pdf, epub, docx)."""
    target = fmt.lower().lstrip(".")
    return [r for r in results if r.get("file_format", "").lower() == target]


def filter_exclude_archives(results: list[dict]) -> list[dict]:
    """Exclude results from the Archives PARA category."""
    return [r for r in results if r.get("para", "").lower() != "archives"]


def _match_enneagram(record: dict, query: str) -> bool:
    """Flexible Enneagram matching against metadata fields and text."""
    q = (query or "").strip().lower()
    if not q:
        return True

    # Canonicalize "5" -> "type 5" style matching.
    m = re.search(r"\b([1-9])\b", q)
    type_digit = m.group(1) if m else None

    search_values: list[str] = []
    for k, v in record.items():
        key_l = str(k).lower()
        if "ennea" not in key_l:
            continue
        if isinstance(v, list):
            search_values.extend(str(x) for x in v if x is not None)
        elif v is not None:
            search_values.append(str(v))

    tags = record.get("frontmatter_tags", [])
    if isinstance(tags, list):
        search_values.extend(str(t) for t in tags)
    elif tags:
        search_values.append(str(tags))

    # Fallback context fields in case Enneagram is embedded in prose/title.
    search_values.extend([
        str(record.get("heading", "")),
        str(record.get("path", "")),
        str(record.get("text", "")),
    ])
    haystack = " | ".join(search_values).lower()
    if not haystack:
        return False

    if q in haystack:
        return True
    if type_digit:
        if re.search(rf"\btype[\s:_-]*{re.escape(type_digit)}\b", haystack):
            return True
    return False


def filter_enneagram(results: list[dict], enneagram_query: str) -> list[dict]:
    """Filter results by Enneagram metadata or mentions."""
    return [r for r in results if _match_enneagram(r, enneagram_query)]


def _resolve_vault_root(index_dir: str) -> str:
    # index_dir points to <vault>/_System/memory in standard layout.
    return os.path.abspath(os.path.join(index_dir, "..", ".."))


def _file_modified_date(rel_path: str, vault_root: str) -> datetime | None:
    abs_path = os.path.join(vault_root, rel_path)
    try:
        ts = os.path.getmtime(abs_path)
    except OSError:
        return None
    return datetime.fromtimestamp(ts, tz=timezone.utc)


def filter_date_range(
    results: list[dict],
    *,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    vault_root: str,
) -> list[dict]:
    """Filter results by file modified date (UTC) and annotate modified_at."""
    if start_date is None and end_date is None:
        return results

    start = start_date.date() if start_date else None
    end = end_date.date() if end_date else None

    out: list[dict] = []
    for r in results:
        rel_path = str(r.get("path") or "")
        if not rel_path:
            continue
        modified = _file_modified_date(rel_path, vault_root=vault_root)
        if modified is None:
            continue
        d = modified.date()
        if start and d < start:
            continue
        if end and d > end:
            continue
        rec = dict(r)
        rec["modified_at"] = modified.isoformat()
        out.append(rec)
    return out


def _context_preview(record: dict) -> dict:
    return {
        "path": record.get("path", ""),
        "chunk_index": record.get("chunk_index"),
        "heading": record.get("heading") or "",
        "text": str(record.get("text", ""))[:_SNIPPET_LEN],
    }


def expand_result_context(meta: list[dict], result: dict, window: int) -> dict:
    """Attach +/- nearby chunks from the same file."""
    if window <= 0:
        return result
    idx = result.get("_meta_id")
    if idx is None:
        return result
    try:
        idx = int(idx)
    except Exception:
        return result

    path = result.get("path")
    if not path:
        return result

    before: list[dict] = []
    after: list[dict] = []

    budget = max(250, window * 50)

    # Walk backward for preceding chunks in same file.
    i = idx - 1
    steps = 0
    while i >= 0 and len(before) < window and steps < budget:
        rec = meta[i]
        if rec.get("path") == path:
            before.append(_context_preview(rec))
        i -= 1
        steps += 1
    before.reverse()

    # Walk forward for following chunks in same file.
    i = idx + 1
    steps = 0
    meta_len = len(meta)
    while i < meta_len and len(after) < window and steps < budget:
        rec = meta[i]
        if rec.get("path") == path:
            after.append(_context_preview(rec))
        i += 1
        steps += 1

    enriched = dict(result)
    enriched["context_before"] = before
    enriched["context_after"] = after
    return enriched


def expand_results_context(meta: list[dict], results: list[dict], window: int) -> list[dict]:
    if window <= 0:
        return results
    return [expand_result_context(meta, r, window) for r in results]


# ---------------------------------------------------------------------------
# A-W6-06: Result formatter
# ---------------------------------------------------------------------------

def format_results(
    results: list[dict],
    top_k: int = _DEFAULT_TOP_K,
    as_json: bool = False,
    as_markdown: bool = False,
) -> str:
    """Format search results for terminal or JSON output."""
    if not results:
        if as_json:
            return "[]"
        if as_markdown:
            return "# Query Results\n\n_No results found._"
        return "  No results found."

    display = results[:top_k]

    if as_json:
        out = []
        for i, r in enumerate(display):
            out.append({
                "rank": i + 1,
                "score": round(r.get("score", 0.0), 4),
                "path": r.get("path", ""),
                "heading": r.get("heading") or "",
                "chunk_index": r.get("chunk_index"),
                "para": r.get("para", ""),
                "domain": r.get("domain", ""),
                "file_format": r.get("file_format", ""),
                "is_archive": bool(r.get("is_archive", False)),
                "priority": r.get("priority"),
                "quality_score": r.get("quality_score"),
                "prana_score": r.get("prana_score"),
                "recency_score": r.get("recency_score"),
                "age_days": r.get("age_days"),
                "link_count": r.get("link_count"),
                "frontmatter_tags": r.get("frontmatter_tags", []),
                "enneagram_uuid": r.get("enneagram_uuid", ""),
                "page": r.get("page", ""),
                "chapter": r.get("chapter", ""),
                "doc_title": r.get("doc_title", ""),
                "modified_at": r.get("modified_at"),
                "text": r.get("text", ""),
                "match_chunks": r.get("match_chunks"),
                "context_before": r.get("context_before", []),
                "context_after": r.get("context_after", []),
            })
        return json.dumps(out, indent=2, ensure_ascii=False)

    if as_markdown:
        lines = ["# Query Results", ""]
        for i, r in enumerate(display):
            rank = i + 1
            score = float(r.get("score", 0.0))
            path = r.get("path", "?")
            heading = r.get("heading") or "(no heading)"
            para = r.get("para", "?")
            domain = r.get("domain", "?")
            fmt = (r.get("file_format", "") or "").upper()

            lines.append(f"## {rank}. `{path}`")
            lines.append(f"- Score: `{score:.3f}`")
            lines.append(f"- Context: `{para} > {domain} > {heading}`")
            if fmt:
                lines.append(f"- Format: `{fmt}`")
            if r.get("modified_at"):
                lines.append(f"- Modified: `{r.get('modified_at')}`")

            match_chunks = r.get("match_chunks")
            if match_chunks:
                lines.append(f"- Matched chunks: `{match_chunks}`")

            text = (r.get("text") or "").strip()
            if text:
                lines.append("- Snippet:")
                lines.append("")
                lines.append(f"> {text[:_SNIPPET_LEN].replace(chr(10), ' ')}")

            before = r.get("context_before", []) or []
            after = r.get("context_after", []) or []
            if before or after:
                lines.append("")
                lines.append("### Nearby Chunks")
                for ctx in before:
                    h = ctx.get("heading") or "(no heading)"
                    cidx = ctx.get("chunk_index")
                    ctext = (ctx.get("text") or "").replace("\n", " ").strip()
                    lines.append(f"- `-` chunk `{cidx}` {h}: {ctext[:120]}")
                for ctx in after:
                    h = ctx.get("heading") or "(no heading)"
                    cidx = ctx.get("chunk_index")
                    ctext = (ctx.get("text") or "").replace("\n", " ").strip()
                    lines.append(f"- `+` chunk `{cidx}` {h}: {ctext[:120]}")

            lines.append("")
        return "\n".join(lines).strip()

    lines = []
    for i, r in enumerate(display):
        rank = i + 1
        score = r.get("score", 0.0)
        path = r.get("path", "?")
        heading = r.get("heading") or "(no heading)"
        para = r.get("para", "?")
        domain = r.get("domain", "?")
        fmt = r.get("file_format", "")

        lines.append(f"  {rank}. [{score:.3f}]  {path}")

        # Context line: PARA > domain > heading + format badge
        ctx = f"     {para} › {domain} › {heading}"
        if fmt and fmt not in ("md", "txt"):
            ctx += f"  [{fmt.upper()}]"
        lines.append(ctx)

        # Page/chapter for binary formats
        page = r.get("page", "")
        chapter = r.get("chapter", "")
        doc_title = r.get("doc_title", "")
        loc_parts = []
        if doc_title:
            loc_parts.append(doc_title)
        if chapter:
            loc_parts.append(chapter)
        if page:
            loc_parts.append(page)
        if loc_parts:
            lines.append(f"     📄 {' › '.join(loc_parts)}")
        if r.get("modified_at"):
            lines.append(f"     🕒 {r.get('modified_at')}")

        # Tags if any
        tags = r.get("frontmatter_tags", [])
        if tags:
            lines.append(f"     tags: {', '.join(tags[:6])}")

        match_chunks = r.get("match_chunks")
        if match_chunks:
            lines.append(f"     similar chunks: {match_chunks}")

        before = r.get("context_before", []) or []
        after = r.get("context_after", []) or []
        for ctx in before:
            h = ctx.get("heading") or "(no heading)"
            cidx = ctx.get("chunk_index")
            ctext = (ctx.get("text") or "").replace("\n", " ").strip()
            lines.append(f"     - chunk {cidx} | {h}: {ctext[:110]}")
        for ctx in after:
            h = ctx.get("heading") or "(no heading)"
            cidx = ctx.get("chunk_index")
            ctext = (ctx.get("text") or "").replace("\n", " ").strip()
            lines.append(f"     + chunk {cidx} | {h}: {ctext[:110]}")

        lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# A-W6-07: Interactive REPL loop
# ---------------------------------------------------------------------------

def _apply_filters(
    results: list[dict],
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    enneagram_filter: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    vault_root: str | None = None,
) -> list[dict]:
    """Apply all post-retrieval filters in sequence."""
    if para_filter:
        results = filter_para(results, para_filter)
    if domain_filter:
        results = filter_domain(results, domain_filter)
    if format_filter:
        results = filter_format(results, format_filter)
    if exclude_archives:
        results = filter_exclude_archives(results)
    if enneagram_filter:
        results = filter_enneagram(results, enneagram_filter)
    if start_date is not None or end_date is not None:
        if not vault_root:
            raise RuntimeError("Date filtering requires vault_root resolution.")
        results = filter_date_range(
            results,
            start_date=start_date,
            end_date=end_date,
            vault_root=vault_root,
        )
    return results


def run_query(
    model: SentenceTransformer | LazySentenceModel | None,
    index,
    meta: list[dict],
    *,
    query_text: str | None = None,
    top_k: int = _DEFAULT_TOP_K,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    enneagram_filter: str | None = None,
    search_mode: str = "vector",
    use_priority: bool = True,
    hybrid_alpha: float = _DEFAULT_HYBRID_ALPHA,
    similar_file: str | None = None,
    expand_context: int = 0,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    index_dir: str = _DEFAULT_INDEX_DIR,
) -> tuple[list[dict], dict]:
    """Execute one retrieval call with the configured mode + filters."""
    info: dict = {}
    mode = (search_mode or "vector").lower()
    if index is not None:
        _set_router_filters(
            index,
            para_filter=para_filter,
            domain_filter=domain_filter,
            format_filter=format_filter,
            exclude_archives=exclude_archives,
        )

    if similar_file:
        if index is None:
            raise RuntimeError("Similar-file search requires an index.")
        results, source_path, source_chunks = search_similar_file(
            index,
            meta,
            file_path=similar_file,
            top_k=top_k,
            use_priority=use_priority,
        )
        info["similar_file_source"] = source_path
        info["similar_file_chunks"] = source_chunks
    else:
        q = (query_text or "").strip()
        if not q:
            return [], info

        if mode == "lexical":
            results = search_lexical(
                meta,
                q,
                top_k=top_k,
                use_priority=use_priority,
            )
        elif mode == "hybrid":
            if index is None:
                raise RuntimeError("Hybrid search requires index loading.")
            resolved_model = _resolve_model(model)
            if resolved_model is None:
                raise RuntimeError("Hybrid search requires model loading.")
            query_vec = encode_query(resolved_model, q)
            results = search_hybrid(
                index,
                meta,
                query_vec,
                query_text=q,
                top_k=top_k,
                use_priority=use_priority,
                alpha=hybrid_alpha,
            )
        else:
            effective_mode = mode
            if mode == "time-travel":
                effective_mode = "hybrid"
            if index is None:
                if effective_mode == "vector":
                    raise RuntimeError("Vector search requires index loading.")
                raise RuntimeError("Time-travel search requires index loading.")
            resolved_model = _resolve_model(model)
            if resolved_model is None:
                if effective_mode == "vector":
                    raise RuntimeError("Vector search requires model loading.")
                raise RuntimeError("Time-travel search requires model loading.")
            query_vec = encode_query(resolved_model, q)
            if mode == "time-travel":
                results = search_hybrid(
                    index,
                    meta,
                    query_vec,
                    query_text=q,
                    top_k=top_k,
                    use_priority=use_priority,
                    alpha=hybrid_alpha,
                )
            else:
                results = search(
                    index,
                    meta,
                    query_vec,
                    top_k=top_k,
                    use_priority=use_priority,
                )

    _capture_router_info(index, info)
    results = _apply_filters(
        results,
        para_filter=para_filter,
        domain_filter=domain_filter,
        format_filter=format_filter,
        exclude_archives=exclude_archives,
        enneagram_filter=enneagram_filter,
        start_date=start_date,
        end_date=end_date,
        vault_root=_resolve_vault_root(index_dir),
    )
    if mode == "time-travel":
        results.sort(
            key=lambda r: (
                str(r.get("modified_at") or ""),
                float(r.get("score", 0.0)),
            )
        )
    results = expand_results_context(meta, results, expand_context)
    return results, info


def run_repl(
    model: SentenceTransformer | LazySentenceModel | None,
    index,
    meta: list[dict],
    top_k: int = _DEFAULT_TOP_K,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    enneagram_filter: str | None = None,
    as_json: bool = False,
    as_markdown: bool = False,
    export_path: str | None = None,
    search_mode: str = "vector",
    hybrid_alpha: float = _DEFAULT_HYBRID_ALPHA,
    expand_context: int = 0,
    use_priority: bool = True,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    save_session: bool = False,
    session_name: str = "default",
    index_dir: str = _DEFAULT_INDEX_DIR,
):
    """Interactive search REPL."""
    filters = []
    if para_filter:
        filters.append(f"para={para_filter}")
    if domain_filter:
        filters.append(f"domain={domain_filter}")
    if format_filter:
        filters.append(f"format={format_filter}")
    if exclude_archives:
        filters.append("exclude-archives")
    if enneagram_filter:
        filters.append(f"enneagram={enneagram_filter}")
    if expand_context > 0:
        filters.append(f"context±{expand_context}")
    if not use_priority:
        filters.append("no-priority")
    if start_date:
        filters.append(f"start={start_date.date().isoformat()}")
    if end_date:
        filters.append(f"end={end_date.date().isoformat()}")
    if search_mode != "vector":
        filters.append(f"mode={search_mode}")
    filter_str = f"  Filters: {', '.join(filters)}" if filters else ""

    indexed_chunks = index.ntotal if index is not None else len(meta)
    print(f"\n🔍 PARA Vault Search  ({indexed_chunks:,} chunks indexed)")
    if filter_str:
        print(filter_str)
    print(f"  Type your query, or 'exit'/'quit' to stop.\n")

    while True:
        try:
            query = input("Ask> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye!")
            break

        if not query:
            continue
        if query.lower() in ("exit", "quit", "q"):
            print("Bye!")
            break

        t0 = time.monotonic()
        results, info = run_query(
            model,
            index,
            meta,
            query_text=query,
            top_k=top_k,
            para_filter=para_filter,
            domain_filter=domain_filter,
            format_filter=format_filter,
            exclude_archives=exclude_archives,
            enneagram_filter=enneagram_filter,
            search_mode=search_mode,
            use_priority=use_priority,
            hybrid_alpha=hybrid_alpha,
            expand_context=expand_context,
            start_date=start_date,
            end_date=end_date,
            index_dir=index_dir,
        )

        elapsed = (time.monotonic() - t0) * 1000
        print(f"\n  ({len(results)} hits, {elapsed:.0f}ms)\n")
        rendered = format_results(results, top_k, as_json=as_json, as_markdown=as_markdown)
        print(rendered)
        _write_export(export_path, rendered)

        if save_session:
            existing = _load_session(index_dir, session_name) or {}
            history = _extend_session_history(
                existing,
                [_make_history_entry(query=query, result_count=len(results))],
            )
            payload = {
                "saved_at": datetime.now(timezone.utc).isoformat(),
                "mode": "repl",
                "params": {
                    "top": top_k,
                    "para": para_filter,
                    "domain": domain_filter,
                    "format": format_filter,
                    "exclude_archives": exclude_archives,
                    "enneagram": enneagram_filter,
                    "search_mode": search_mode,
                    "expand_context": expand_context,
                    "use_priority": use_priority,
                    "hybrid_alpha": hybrid_alpha,
                    "start_date": start_date.date().isoformat() if start_date else None,
                    "end_date": end_date.date().isoformat() if end_date else None,
                },
                "last_query": query,
                "last_info": info,
                "last_results": _result_preview(results),
                "history": history,
            }
            _save_session(index_dir, session_name, payload)


# ---------------------------------------------------------------------------
# One-shot query (A-W6-09)
# ---------------------------------------------------------------------------

def run_one_shot(
    model: SentenceTransformer | LazySentenceModel | None,
    index,
    meta: list[dict],
    query: str | None = None,
    similar_file: str | None = None,
    top_k: int = _DEFAULT_TOP_K,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    enneagram_filter: str | None = None,
    as_json: bool = False,
    as_markdown: bool = False,
    export_path: str | None = None,
    search_mode: str = "vector",
    hybrid_alpha: float = _DEFAULT_HYBRID_ALPHA,
    expand_context: int = 0,
    use_priority: bool = True,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    save_session: bool = False,
    session_name: str = "default",
    index_dir: str = _DEFAULT_INDEX_DIR,
) -> list[dict]:
    """Run a single query and print results."""
    results, info = run_query(
        model,
        index,
        meta,
        query_text=query,
        top_k=top_k,
        para_filter=para_filter,
        domain_filter=domain_filter,
        format_filter=format_filter,
        exclude_archives=exclude_archives,
        enneagram_filter=enneagram_filter,
        search_mode=search_mode,
        use_priority=use_priority,
        hybrid_alpha=hybrid_alpha,
        similar_file=similar_file,
        expand_context=expand_context,
        start_date=start_date,
        end_date=end_date,
        index_dir=index_dir,
    )

    rendered = format_results(results, top_k, as_json=as_json, as_markdown=as_markdown)
    if similar_file and not as_json:
        src = info.get("similar_file_source")
        chunk_cnt = info.get("similar_file_chunks", 0)
        if src:
            print(f"Similar-file source: {src} ({chunk_cnt} chunks)\n")
        else:
            print(f"No indexed chunks found for path: {similar_file}\n")

    print(rendered)
    _write_export(export_path, rendered)

    if save_session:
        existing = _load_session(index_dir, session_name) or {}
        history = _extend_session_history(
            existing,
            [_make_history_entry(query=query, similar_file=similar_file, result_count=len(results))],
        )
        payload = {
            "saved_at": datetime.now(timezone.utc).isoformat(),
            "mode": "one-shot",
            "params": {
                "query": query,
                "similar_file": similar_file,
                "top": top_k,
                "para": para_filter,
                "domain": domain_filter,
                "format": format_filter,
                "exclude_archives": exclude_archives,
                "enneagram": enneagram_filter,
                "search_mode": search_mode,
                "expand_context": expand_context,
                "use_priority": use_priority,
                "hybrid_alpha": hybrid_alpha,
                "start_date": start_date.date().isoformat() if start_date else None,
                "end_date": end_date.date().isoformat() if end_date else None,
            },
            "last_query": query,
            "last_info": info,
            "last_results": _result_preview(results),
            "history": history,
        }
        _save_session(index_dir, session_name, payload)

    return results


# ---------------------------------------------------------------------------
# B-W9: Batch query mode
# ---------------------------------------------------------------------------

def run_batch(
    model: SentenceTransformer | LazySentenceModel | None,
    index,
    meta: list[dict],
    queries_file: str,
    top_k: int = _DEFAULT_TOP_K,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    enneagram_filter: str | None = None,
    as_json: bool = False,
    as_markdown: bool = False,
    export_path: str | None = None,
    search_mode: str = "vector",
    hybrid_alpha: float = _DEFAULT_HYBRID_ALPHA,
    expand_context: int = 0,
    use_priority: bool = True,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    save_session: bool = False,
    session_name: str = "default",
    index_dir: str = _DEFAULT_INDEX_DIR,
) -> list[dict]:
    """Run multiple queries from a file (one per line)."""
    with open(queries_file, "r") as f:
        queries = [line.strip() for line in f if line.strip()]

    if not queries:
        print("No queries found in file.", file=sys.stderr)
        return []

    all_results = []
    history_entries: list[dict] = []
    rendered_blocks: list[str] = ["# Batch Query Results", ""] if as_markdown else []
    for qi, query in enumerate(queries):
        results, _ = run_query(
            model,
            index,
            meta,
            query_text=query,
            top_k=top_k,
            para_filter=para_filter,
            domain_filter=domain_filter,
            format_filter=format_filter,
            exclude_archives=exclude_archives,
            enneagram_filter=enneagram_filter,
            search_mode=search_mode,
            use_priority=use_priority,
            hybrid_alpha=hybrid_alpha,
            expand_context=expand_context,
            start_date=start_date,
            end_date=end_date,
            index_dir=index_dir,
        )
        history_entries.append(_make_history_entry(query=query, result_count=len(results)))
        top = results[:top_k]

        if as_json:
            all_results.append({
                "query": query,
                "results": [
                    {
                        "rank": i + 1,
                        "score": round(r.get("score", 0.0), 4),
                        "path": r.get("path", ""),
                        "heading": r.get("heading") or "",
                        "chunk_index": r.get("chunk_index"),
                        "para": r.get("para", ""),
                        "domain": r.get("domain", ""),
                        "file_format": r.get("file_format", ""),
                        "priority": r.get("priority"),
                        "quality_score": r.get("quality_score"),
                        "prana_score": r.get("prana_score"),
                        "recency_score": r.get("recency_score"),
                        "age_days": r.get("age_days"),
                        "link_count": r.get("link_count"),
                        "frontmatter_tags": r.get("frontmatter_tags", []),
                        "enneagram_uuid": r.get("enneagram_uuid", ""),
                        "modified_at": r.get("modified_at"),
                    }
                    for i, r in enumerate(top)
                ],
            })
        elif as_markdown:
            rendered_blocks.append(f"## Query {qi + 1}: {query}\n")
            block = format_results(top, top_k, as_markdown=True)
            block = re.sub(r"^# Query Results\s*", "", block).strip()
            rendered_blocks.append(block)
        else:
            rendered_blocks.append(f"\n{'─' * 50}")
            rendered_blocks.append(f"  Query {qi+1}: {query}")
            rendered_blocks.append(f"{'─' * 50}")
            rendered_blocks.append(format_results(top, top_k))

    if as_json:
        rendered = json.dumps(all_results, indent=2, ensure_ascii=False)
    else:
        rendered = "\n".join(rendered_blocks).strip()

    print(rendered)
    _write_export(export_path, rendered)

    if save_session:
        existing = _load_session(index_dir, session_name) or {}
        history = _extend_session_history(existing, history_entries)
        payload = {
            "saved_at": datetime.now(timezone.utc).isoformat(),
            "mode": "batch",
            "params": {
                "queries_file": queries_file,
                "top": top_k,
                "para": para_filter,
                "domain": domain_filter,
                "format": format_filter,
                "exclude_archives": exclude_archives,
                "enneagram": enneagram_filter,
                "search_mode": search_mode,
                "expand_context": expand_context,
                "use_priority": use_priority,
                "hybrid_alpha": hybrid_alpha,
                "start_date": start_date.date().isoformat() if start_date else None,
                "end_date": end_date.date().isoformat() if end_date else None,
            },
            "query_count": len(queries),
            "last_results": all_results[:10] if as_json else [],
            "history": history,
        }
        _save_session(index_dir, session_name, payload)

    return all_results


# ---------------------------------------------------------------------------
# A-W6-08: CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Semantic search over PARA vault index",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--index-dir",
        default=_DEFAULT_INDEX_DIR,
        help="Directory containing meta.json plus vault.faiss and/or shard router artifacts",
    )
    parser.add_argument(
        "--model",
        default=MODEL_NAME,
        help="Sentence-transformer model name",
    )
    parser.add_argument(
        "--top", "-n",
        type=int,
        default=_DEFAULT_TOP_K,
        help="Number of results to return",
    )
    parser.add_argument(
        "--para",
        default=None,
        help="Filter by PARA category (Projects, Areas, Resources, Archives)",
    )
    parser.add_argument(
        "--domain",
        default=None,
        help="Filter by domain (supports glob, e.g. 'Health/*')",
    )
    parser.add_argument(
        "--query", "-q",
        default=None,
        help="One-shot query (prints results and exits, no REPL)",
    )
    parser.add_argument(
        "--format", "-f",
        default=None,
        help="Filter by file format: md, txt, pdf, epub, docx",
    )
    parser.add_argument(
        "--exclude-archives",
        action="store_true",
        help="Exclude results from the Archives PARA category",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="json_output",
        help="Output results as JSON",
    )
    parser.add_argument(
        "--batch",
        default=None,
        help="Path to a file with one query per line (batch mode)",
    )
    parser.add_argument(
        "--no-priority",
        action="store_false",
        dest="use_priority",
        default=True,
        help="Disable priority-based weighting (Projects > Areas > Resources > Archives)",
    )
    parser.add_argument(
        "--search-mode",
        choices=["vector", "hybrid", "lexical", "time-travel"],
        default="vector",
        help="Retrieval mode: vector, lexical, hybrid lexical+vector, or time-travel (hybrid + date filter)",
    )
    parser.add_argument(
        "--start-date",
        default=None,
        help="UTC date lower bound (YYYY-MM-DD) for time-scoped retrieval",
    )
    parser.add_argument(
        "--end-date",
        default=None,
        help="UTC date upper bound (YYYY-MM-DD) for time-scoped retrieval",
    )
    parser.add_argument(
        "--hnsw-ef-search",
        type=int,
        default=_DEFAULT_HNSW_EF_SEARCH,
        help="FAISS HNSW efSearch override for query-time recall/latency tuning",
    )
    parser.add_argument(
        "--shard-router",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Use shard_manifest.json + per-shard FAISS router when available",
    )
    parser.add_argument(
        "--router-top-shards",
        type=int,
        default=8,
        help="Top-N shards to search per vector/hybrid query (0 = all eligible shards)",
    )
    parser.add_argument(
        "--hybrid-alpha",
        type=float,
        default=_DEFAULT_HYBRID_ALPHA,
        help="Hybrid blend weight for vector score (0-1); lexical weight is (1-alpha)",
    )
    parser.add_argument(
        "--similar-file",
        default=None,
        help="Find similar files by indexed path (exact, suffix, or basename match)",
    )
    parser.add_argument(
        "--expand-context",
        type=int,
        default=0,
        help="Include +/- N nearby chunks from the same file for each hit",
    )
    parser.add_argument(
        "--enneagram", "--type",
        dest="enneagram",
        default=None,
        help="Filter by Enneagram marker (e.g. 'Type 5', '5', or custom tag); --type is an alias",
    )
    parser.add_argument(
        "--markdown",
        action="store_true",
        dest="markdown_output",
        help="Output results in Markdown format",
    )
    parser.add_argument(
        "--export", "--output",
        dest="export",
        default=None,
        help="Write rendered output to file (supports txt/json/md based on mode flags); --output is an alias",
    )
    parser.add_argument(
        "--save-session",
        action="store_true",
        help="Save latest query parameters and result preview to a session file",
    )
    parser.add_argument(
        "--recall-session",
        action="store_true",
        help="Recall the saved session and reuse its last query/similar-file when absent",
    )
    parser.add_argument(
        "--list-session-history",
        action="store_true",
        help="List saved session history entries with 1-based indices and exit",
    )
    parser.add_argument(
        "--history-index",
        type=int,
        default=None,
        help="Rerun a saved 1-based session history index (from --list-session-history)",
    )
    parser.add_argument(
        "--session-name",
        default="default",
        help="Session identifier used by --save-session/--recall-session",
    )
    return parser.parse_args()


def _parse_date_arg(label: str, raw: str | None) -> datetime | None:
    if raw is None:
        return None
    txt = str(raw).strip()
    if not txt:
        return None
    try:
        dt = datetime.strptime(txt, "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError(f"{label} must be YYYY-MM-DD (got: {txt})") from exc
    return dt.replace(tzinfo=timezone.utc)


def main() -> None:
    args = parse_args()

    if args.json_output and args.markdown_output:
        print("ERROR: --json and --markdown cannot be used together.", file=sys.stderr)
        sys.exit(2)
    if args.expand_context < 0:
        print("ERROR: --expand-context must be >= 0.", file=sys.stderr)
        sys.exit(2)
    if int(args.router_top_shards) < 0:
        print("ERROR: --router-top-shards must be >= 0.", file=sys.stderr)
        sys.exit(2)
    if args.query and args.similar_file:
        print("ERROR: Use either --query or --similar-file, not both.", file=sys.stderr)
        sys.exit(2)
    if args.batch and args.similar_file:
        print("ERROR: --batch cannot be combined with --similar-file.", file=sys.stderr)
        sys.exit(2)
    if args.history_index is not None and args.history_index < 1:
        print("ERROR: --history-index must be >= 1.", file=sys.stderr)
        sys.exit(2)
    if args.history_index is not None and (args.query or args.batch or args.similar_file):
        print(
            "ERROR: --history-index cannot be combined with --query, --batch, or --similar-file.",
            file=sys.stderr,
        )
        sys.exit(2)
    try:
        start_date = _parse_date_arg("start-date", args.start_date)
        end_date = _parse_date_arg("end-date", args.end_date)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)
    if start_date and end_date and start_date > end_date:
        print("ERROR: --start-date must be <= --end-date.", file=sys.stderr)
        sys.exit(2)
    if args.search_mode == "time-travel" and not (start_date or end_date):
        print(
            "ERROR: --search-mode time-travel requires --start-date and/or --end-date.",
            file=sys.stderr,
        )
        sys.exit(2)

    recalled: dict | None = None
    if args.recall_session or args.list_session_history or args.history_index is not None:
        recalled = _load_session(args.index_dir, args.session_name)
        if not recalled:
            print(
                f"ERROR: No session found for '{args.session_name}' in {args.index_dir}/{_SESSION_DIRNAME}",
                file=sys.stderr,
            )
            sys.exit(1)

    if args.list_session_history:
        history = _session_history_entries(recalled)
        if not history:
            print(f"No session history entries found for '{args.session_name}'.")
        else:
            print(f"Session history: {args.session_name} ({len(history)} entries)")
            for idx, item in enumerate(history, start=1):
                ts = str(item.get("saved_at") or "-")
                query = str(item.get("query") or "").strip()
                similar = str(item.get("similar_file") or "").strip()
                if query and similar:
                    desc = f"{query} [similar-file: {similar}]"
                elif query:
                    desc = query
                elif similar:
                    desc = f"[similar-file] {similar}"
                else:
                    desc = "(empty entry)"
                print(f"{idx:>3}. {ts}  {desc}")
        if args.history_index is None:
            return

    if args.history_index is not None:
        history = _session_history_entries(recalled)
        if not history:
            print(
                f"ERROR: No history entries found for session '{args.session_name}'.",
                file=sys.stderr,
            )
            sys.exit(1)
        if args.history_index > len(history):
            print(
                f"ERROR: --history-index {args.history_index} is out of range (1..{len(history)}).",
                file=sys.stderr,
            )
            sys.exit(1)
        selected = history[args.history_index - 1]
        if not args.query and not args.batch and not args.similar_file:
            q = str(selected.get("query") or "").strip()
            s = str(selected.get("similar_file") or "").strip()
            args.query = q or None
            args.similar_file = s or None
        if not args.query and not args.similar_file:
            print(
                f"ERROR: Session history index {args.history_index} has no query/similar-file to rerun.",
                file=sys.stderr,
            )
            sys.exit(1)

    # Session recall can hydrate missing query/similar-file and filters.
    if args.recall_session or args.history_index is not None:
        saved = recalled.get("params", {}) if isinstance(recalled, dict) else {}
        if not args.query and not args.batch and not args.similar_file:
            args.query = saved.get("query") or recalled.get("last_query")
            args.similar_file = saved.get("similar_file")

        if args.para is None:
            args.para = saved.get("para")
        if args.domain is None:
            args.domain = saved.get("domain")
        if args.format is None:
            args.format = saved.get("format")
        if args.enneagram is None:
            args.enneagram = saved.get("enneagram")
        if args.search_mode == "vector" and saved.get("search_mode"):
            args.search_mode = saved.get("search_mode")
        if args.expand_context == 0 and saved.get("expand_context"):
            try:
                args.expand_context = int(saved.get("expand_context", 0))
            except Exception:
                pass
        if args.start_date is None and saved.get("start_date"):
            args.start_date = str(saved.get("start_date"))
            start_date = _parse_date_arg("start-date", args.start_date)
        if args.end_date is None and saved.get("end_date"):
            args.end_date = str(saved.get("end_date"))
            end_date = _parse_date_arg("end-date", args.end_date)

    faiss_path = os.path.join(args.index_dir, "vault.faiss")
    meta_path = os.path.join(args.index_dir, "meta.json")
    shard_manifest_path = os.path.join(args.index_dir, "shard_manifest.json")

    if not os.path.exists(meta_path):
        print(f"ERROR: Metadata not found at {meta_path}", file=sys.stderr)
        print("  Run index_full.py first.", file=sys.stderr)
        sys.exit(1)

    interactive_mode = not bool(args.batch or args.query or args.similar_file)
    need_index = bool(args.similar_file) or args.search_mode in ("vector", "hybrid", "time-travel")

    meta_store: LazyMetaStore | None = None
    prefer_lazy_meta = (not args.similar_file) and args.search_mode in ("vector", "hybrid", "time-travel")
    if not args.json_output:
        if prefer_lazy_meta:
            print("Loading metadata (lazy)...", end=" ", flush=True, file=sys.stderr)
        else:
            print("Loading metadata...", end=" ", flush=True, file=sys.stderr)
    if prefer_lazy_meta:
        meta_store = load_metadata_lazy(meta_path)
    if meta_store is not None:
        meta = meta_store
        if not args.json_output:
            print(f"{len(meta):,} records ready (sidecar).", file=sys.stderr)
    else:
        meta = load_metadata(meta_path)
        if not args.json_output:
            if prefer_lazy_meta:
                print(f"{len(meta):,} records loaded (sidecar unavailable, fallback full-load).", file=sys.stderr)
            else:
                print(f"{len(meta):,} records loaded.", file=sys.stderr)

    index = None
    routed_index = None
    if need_index and args.shard_router:
        routed_index = load_sharded_router(
            args.index_dir,
            top_shards=int(args.router_top_shards),
            hnsw_ef_search=max(1, int(args.hnsw_ef_search)),
        )
    if need_index:
        if routed_index is not None:
            index = routed_index
            if not args.json_output:
                selected = int(getattr(routed_index, "top_shards", int(args.router_top_shards)))
                print(
                    "Shard router active: "
                    f"{len(getattr(routed_index, 'entries', [])):,} shards, "
                    f"top={selected if selected != 0 else 'all'} "
                    f"(manifest={shard_manifest_path}).",
                    file=sys.stderr,
                )
        else:
            if not os.path.exists(faiss_path):
                print(f"ERROR: Index not found at {faiss_path}", file=sys.stderr)
                if args.shard_router and not os.path.exists(shard_manifest_path):
                    print("  Neither monolithic index nor shard manifest found.", file=sys.stderr)
                else:
                    print("  Run index_full.py first.", file=sys.stderr)
                sys.exit(1)
            if interactive_mode and not args.similar_file:
                index = LazyFaissIndex(
                    faiss_path,
                    verbose=not args.json_output,
                    estimated_ntotal=len(meta),
                    hnsw_ef_search=max(1, int(args.hnsw_ef_search)),
                )
                if not args.json_output:
                    print("Index loading deferred until first vector query.", file=sys.stderr)
            else:
                if not args.json_output:
                    print("Loading index...", end=" ", flush=True, file=sys.stderr)
                index = load_index(
                    faiss_path,
                    hnsw_ef_search=max(1, int(args.hnsw_ef_search)),
                )
                if not args.json_output:
                    print(f"{index.ntotal:,} chunks loaded.", file=sys.stderr)

    need_model = (not args.similar_file) and args.search_mode in ("vector", "hybrid", "time-travel")
    model: SentenceTransformer | LazySentenceModel | None = None
    if need_model:
        if interactive_mode:
            model = LazySentenceModel(args.model, verbose=not args.json_output)
            if not args.json_output:
                print("Model loading deferred until first vector query.", file=sys.stderr)
        else:
            if not args.json_output:
                print("Loading model...", end=" ", flush=True, file=sys.stderr)
            model = _sentence_transformer_cls()(args.model)
            if not args.json_output:
                print("ready.", file=sys.stderr)

    if (args.recall_session or args.history_index is not None) and not args.query and not args.batch and not args.similar_file:
        # Recall requested but no runnable query stored.
        payload = json.dumps(recalled or {}, indent=2, ensure_ascii=False)
        print(payload)
        return

    if not args.json_output:
        mode_desc = f"mode={args.search_mode}"
        if args.similar_file:
            mode_desc = f"mode=similar-file ({args.similar_file})"
        if start_date or end_date:
            sd = start_date.date().isoformat() if start_date else "..."
            ed = end_date.date().isoformat() if end_date else "..."
            mode_desc += f", window={sd}..{ed}"
        print(f"Search settings: {mode_desc}", file=sys.stderr)

    try:
        if args.batch:
            # B-W9: Batch mode
            run_batch(
                model, index, meta,
                queries_file=args.batch,
                top_k=args.top,
                para_filter=args.para,
                domain_filter=args.domain,
                format_filter=args.format,
                exclude_archives=args.exclude_archives,
                enneagram_filter=args.enneagram,
                as_json=args.json_output,
                as_markdown=args.markdown_output,
                export_path=args.export,
                search_mode=args.search_mode,
                hybrid_alpha=args.hybrid_alpha,
                expand_context=args.expand_context,
                use_priority=args.use_priority,
                start_date=start_date,
                end_date=end_date,
                save_session=args.save_session,
                session_name=args.session_name,
                index_dir=args.index_dir,
            )
        elif args.query or args.similar_file:
            # One-shot mode
            run_one_shot(
                model, index, meta,
                query=args.query,
                similar_file=args.similar_file,
                top_k=args.top,
                para_filter=args.para,
                domain_filter=args.domain,
                format_filter=args.format,
                exclude_archives=args.exclude_archives,
                enneagram_filter=args.enneagram,
                as_json=args.json_output,
                as_markdown=args.markdown_output,
                export_path=args.export,
                search_mode=args.search_mode,
                hybrid_alpha=args.hybrid_alpha,
                expand_context=args.expand_context,
                use_priority=args.use_priority,
                start_date=start_date,
                end_date=end_date,
                save_session=args.save_session,
                session_name=args.session_name,
                index_dir=args.index_dir,
            )
        else:
            # Interactive REPL
            run_repl(
                model, index, meta,
                top_k=args.top,
                para_filter=args.para,
                domain_filter=args.domain,
                format_filter=args.format,
                exclude_archives=args.exclude_archives,
                enneagram_filter=args.enneagram,
                as_json=args.json_output,
                as_markdown=args.markdown_output,
                export_path=args.export,
                search_mode=args.search_mode,
                hybrid_alpha=args.hybrid_alpha,
                expand_context=args.expand_context,
                use_priority=args.use_priority,
                start_date=start_date,
                end_date=end_date,
                save_session=args.save_session,
                session_name=args.session_name,
                index_dir=args.index_dir,
            )
    finally:
        if meta_store is not None:
            meta_store.close()


if __name__ == "__main__":
    main()
