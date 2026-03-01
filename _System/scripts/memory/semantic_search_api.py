#!/usr/bin/env python3
"""
semantic_search_api.py — FastAPI wrapper for Meru semantic retrieval.

Issue #61 acceptance:
- Exposes HTTP endpoints so other tools can query vault search results.
"""

from __future__ import annotations

import json
import os
import sys
import threading
import time
from collections import defaultdict, deque
from dataclasses import dataclass
from datetime import datetime
from typing import Any
from urllib.parse import quote
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

SCRIPTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from export_project_dependency_graph import (  # type: ignore  # noqa: E402
    build_edges,
    build_nodes_and_centroids,
    compute_centrality_rankings,
    collect_project_samples,
)
from incremental import load_embeddings  # type: ignore  # noqa: E402
from knowledge_summary import synthesize_summary  # type: ignore  # noqa: E402
from query_vault import (
    _DEFAULT_HYBRID_ALPHA,
    _DEFAULT_HNSW_EF_SEARCH,
    LazySentenceModel,
    load_index,
    load_metadata,
    load_metadata_lazy,
    run_query,
)
from recommend_tags_from_index import build_recommendations  # type: ignore  # noqa: E402
from shard_router import load_sharded_router
from suggest_semantic_folder_route import (  # type: ignore  # noqa: E402
    build_move_plan,
    collect_centroids,
    rank_routes,
)


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(BASE_DIR, "_System", "memory")
DEFAULT_MODEL = "all-MiniLM-L6-v2"


@dataclass
class SearchServiceState:
    index_dir: str
    meta: Any | None = None
    index: Any | None = None
    model: LazySentenceModel | None = None
    startup_error: str | None = None


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=200)
    search_mode: str = Field(default="hybrid", pattern="^(vector|hybrid|lexical)$")
    para: str | None = None
    domain: str | None = None
    format: str | None = None
    exclude_archives: bool = True
    enneagram: str | None = None
    expand_context: int = Field(default=0, ge=0, le=3)
    use_priority: bool = True
    hybrid_alpha: float = Field(default=_DEFAULT_HYBRID_ALPHA, ge=0.0, le=1.0)


class SearchResponse(BaseModel):
    query: str
    top_k: int
    search_mode: str
    hit_count: int
    duration_ms: float
    results: list[dict]
    info: dict


class TagRecommendationRequest(BaseModel):
    text: str = Field(..., min_length=1)
    top_k: int = Field(default=20, ge=1, le=200)
    search_mode: str = Field(default="hybrid", pattern="^(vector|hybrid|lexical)$")
    min_domain_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    min_enneagram_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    min_tag_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    abstain_mode: str = Field(default="report", pattern="^(off|report)$")


class FolderRecommendationRequest(BaseModel):
    text: str = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=50)
    folder_depth: int = Field(default=2, ge=1, le=8)
    min_chunks_per_folder: int = Field(default=8, ge=1, le=10000)
    exclude_archives: bool = True
    max_records: int | None = Field(default=None, ge=1)
    current_path: str | None = None
    dry_run_plan: bool = True


class SummaryRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    top_chunks: int = Field(default=12, ge=3, le=200)
    search_mode: str = Field(default="hybrid", pattern="^(vector|hybrid|lexical)$")
    exclude_archives: bool = True
    template: str = Field(default="research", pattern="^(research|executive|action)$")


class ProjectGraphRequest(BaseModel):
    max_projects: int = Field(default=60, ge=2, le=500)
    max_chunks_per_project: int = Field(default=64, ge=1, le=2000)
    top_links_per_project: int = Field(default=5, ge=1, le=50)
    min_similarity: float = Field(default=0.45, ge=0.0, le=1.0)
    max_records: int | None = Field(default=None, ge=1)


class CurationEnqueueRequest(BaseModel):
    queue_type: str = Field(..., pattern="^(tag_recommendation|folder_recommendation|summary_recommendation)$")
    payload: dict
    source: str | None = None
    note: str | None = None


class CurationStatusRequest(BaseModel):
    status: str = Field(..., pattern="^(pending|approved|rejected)$")
    reviewer: str = Field(..., min_length=1, max_length=120)
    note: str | None = None


app = FastAPI(title="Meru Semantic Search API", version="1.0.0")

state = SearchServiceState(index_dir=os.environ.get("MERU_INDEX_DIR", DEFAULT_INDEX_DIR))
SHARD_ROUTER_ENABLED = os.environ.get("MERU_SHARD_ROUTER", "1").strip().lower() not in {"0", "false", "no"}
SHARD_ROUTER_TOP_SHARDS = int(os.environ.get("MERU_ROUTER_TOP_SHARDS", "8") or "8")
API_TOKEN = os.environ.get("MERU_API_TOKEN", "").strip()
RATE_LIMIT_REQUESTS = int(os.environ.get("MERU_RATE_LIMIT_REQUESTS", "120") or "120")
RATE_LIMIT_WINDOW_SECONDS = int(os.environ.get("MERU_RATE_LIMIT_WINDOW_SECONDS", "60") or "60")
OBSIDIAN_VAULT = os.environ.get("MERU_OBSIDIAN_VAULT", os.path.basename(BASE_DIR)).strip() or os.path.basename(BASE_DIR)
CURATION_QUEUE_FILE = os.environ.get(
    "MERU_CURATION_QUEUE_FILE",
    os.path.join(DEFAULT_INDEX_DIR, "curation_queue.jsonl"),
)
_RATE_LIMIT_LOCK = threading.Lock()
_RATE_LIMIT_BUCKETS: dict[str, deque[float]] = defaultdict(deque)


def _json_ready(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(k): _json_ready(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_json_ready(v) for v in value]
    if hasattr(value, "item"):
        try:
            return value.item()
        except Exception:
            pass
    if isinstance(value, (datetime,)):
        return value.isoformat()
    return value


def _obsidian_deep_link(path: str, heading: str | None = None) -> str | None:
    rel_path = str(path or "").strip().replace("\\", "/")
    if not rel_path:
        return None
    target = rel_path
    clean_heading = str(heading or "").strip()
    if clean_heading:
        target = f"{target}#{clean_heading}"
    return f"obsidian://open?vault={quote(OBSIDIAN_VAULT, safe='')}&file={quote(target, safe='')}"


def _attach_obsidian_links(value: Any) -> Any:
    if isinstance(value, list):
        return [_attach_obsidian_links(v) for v in value]
    if isinstance(value, dict):
        out = {str(k): _attach_obsidian_links(v) for k, v in value.items()}
        deep_link = _obsidian_deep_link(str(out.get("path") or ""), str(out.get("heading") or ""))
        if deep_link:
            out["obsidian_url"] = deep_link
        return out
    return value


def _policy_key(request: Request) -> str:
    auth = (request.headers.get("authorization") or "").strip()
    if auth.startswith("Bearer "):
        return f"token:{auth[7:].strip()}"
    forwarded = (request.headers.get("x-forwarded-for") or "").strip()
    if forwarded:
        return f"ip:{forwarded.split(',')[0].strip()}"
    host = request.client.host if request.client else "unknown"
    return f"ip:{host}"


def _enforce_api_policy(request: Request) -> None:
    if API_TOKEN:
        auth = (request.headers.get("authorization") or "").strip()
        supplied = auth[7:].strip() if auth.startswith("Bearer ") else ""
        if supplied != API_TOKEN:
            raise HTTPException(status_code=401, detail="Unauthorized: valid Bearer token required.")

    if RATE_LIMIT_REQUESTS <= 0:
        return

    now = time.monotonic()
    window = max(1, int(RATE_LIMIT_WINDOW_SECONDS))
    retry_after = 1
    key = _policy_key(request)

    with _RATE_LIMIT_LOCK:
        bucket = _RATE_LIMIT_BUCKETS[key]
        cutoff = now - float(window)
        while bucket and bucket[0] <= cutoff:
            bucket.popleft()

        if len(bucket) >= int(RATE_LIMIT_REQUESTS):
            retry_after = max(1, int(window - (now - bucket[0])))
            raise HTTPException(
                status_code=429,
                detail=(
                    f"Rate limit exceeded: max {int(RATE_LIMIT_REQUESTS)} "
                    f"requests/{window}s for caller key {key}."
                ),
                headers={"Retry-After": str(retry_after)},
            )

        bucket.append(now)


def _utc_now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _iter_queue_events(path: str):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except Exception:
                continue
            if isinstance(event, dict):
                yield event


def _append_queue_event(path: str, event: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")


def _materialize_queue(path: str) -> list[dict]:
    items: dict[str, dict] = {}
    for event in _iter_queue_events(path):
        event_type = str(event.get("event") or "")
        item_id = str(event.get("item_id") or "").strip()
        if not item_id:
            continue
        if event_type == "enqueue":
            items[item_id] = {
                "item_id": item_id,
                "queue_type": event.get("queue_type"),
                "payload": event.get("payload") or {},
                "source": event.get("source"),
                "note": event.get("note"),
                "status": "pending",
                "created_at": event.get("created_at"),
                "updated_at": event.get("created_at"),
                "reviewer": None,
                "review_note": None,
            }
            continue
        if event_type == "status_update" and item_id in items:
            items[item_id]["status"] = event.get("status") or items[item_id].get("status")
            items[item_id]["updated_at"] = event.get("updated_at") or items[item_id].get("updated_at")
            items[item_id]["reviewer"] = event.get("reviewer")
            items[item_id]["review_note"] = event.get("note")
    rows = list(items.values())
    rows.sort(key=lambda r: str(r.get("created_at") or ""), reverse=True)
    return rows

def _init_state() -> None:
    index_dir = os.path.abspath(state.index_dir)
    meta_path = os.path.join(index_dir, "meta.json")
    faiss_path = os.path.join(index_dir, "vault.faiss")

    if not os.path.exists(meta_path):
        raise RuntimeError(f"meta.json not found in {index_dir}")

    lazy_meta = load_metadata_lazy(meta_path)
    state.meta = lazy_meta if lazy_meta is not None else load_metadata(meta_path)

    routed_index = None
    if SHARD_ROUTER_ENABLED:
        routed_index = load_sharded_router(
            index_dir=index_dir,
            top_shards=max(0, int(SHARD_ROUTER_TOP_SHARDS)),
            hnsw_ef_search=_DEFAULT_HNSW_EF_SEARCH,
        )
    if routed_index is not None:
        state.index = routed_index
    elif os.path.exists(faiss_path):
        state.index = load_index(faiss_path, hnsw_ef_search=_DEFAULT_HNSW_EF_SEARCH)
    else:
        state.index = None

    state.model = LazySentenceModel(DEFAULT_MODEL, verbose=False)


@app.on_event("startup")
def startup() -> None:
    try:
        _init_state()
        state.startup_error = None
    except Exception as exc:
        state.startup_error = str(exc)


@app.get("/health")
def health() -> dict:
    ok = state.startup_error is None and state.meta is not None
    return {
        "ok": ok,
        "index_dir": os.path.abspath(state.index_dir),
        "meta_loaded": state.meta is not None,
        "index_loaded": state.index is not None,
        "auth_required": bool(API_TOKEN),
        "rate_limit_requests": int(RATE_LIMIT_REQUESTS),
        "rate_limit_window_seconds": int(RATE_LIMIT_WINDOW_SECONDS),
        "obsidian_vault": OBSIDIAN_VAULT,
        "curation_queue_file": os.path.abspath(CURATION_QUEUE_FILE),
        "startup_error": state.startup_error,
    }


def _ensure_service_ready(*, require_index: bool = False) -> None:
    if state.startup_error:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {state.startup_error}")
    if state.meta is None:
        raise HTTPException(status_code=503, detail="Metadata is not loaded.")
    if require_index and state.index is None:
        raise HTTPException(status_code=503, detail="FAISS index not loaded for vector/hybrid search.")


def _run_search(req: SearchRequest | SummaryRequest | TagRecommendationRequest) -> tuple[list[dict], dict, float]:
    search_mode = getattr(req, "search_mode", "hybrid")
    require_index = search_mode in {"vector", "hybrid"}
    _ensure_service_ready(require_index=require_index)

    top_k = int(getattr(req, "top_k", getattr(req, "top_chunks", 8)))
    query = str(getattr(req, "query", getattr(req, "topic", getattr(req, "text", ""))))
    exclude_archives = bool(getattr(req, "exclude_archives", True))

    start = datetime.now()
    try:
        results, info = run_query(
            model=state.model,
            index=state.index,
            meta=state.meta,
            query_text=query,
            top_k=top_k,
            para_filter=getattr(req, "para", None),
            domain_filter=getattr(req, "domain", None),
            format_filter=getattr(req, "format", None),
            exclude_archives=exclude_archives,
            enneagram_filter=getattr(req, "enneagram", None),
            search_mode=search_mode,
            use_priority=bool(getattr(req, "use_priority", True)),
            hybrid_alpha=float(getattr(req, "hybrid_alpha", _DEFAULT_HYBRID_ALPHA)),
            expand_context=int(getattr(req, "expand_context", 0)),
            index_dir=state.index_dir,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    elapsed_ms = (datetime.now() - start).total_seconds() * 1000.0
    return results, info, elapsed_ms


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest, request: Request) -> SearchResponse:
    _enforce_api_policy(request)
    results, info, elapsed_ms = _run_search(req)

    return SearchResponse(
        query=req.query,
        top_k=req.top_k,
        search_mode=req.search_mode,
        hit_count=len(results),
        duration_ms=round(elapsed_ms, 2),
        results=_json_ready(_attach_obsidian_links(results)),
        info=_json_ready(info),
    )


@app.get("/search")
def search_get(
    request: Request,
    q: str,
    top_k: int = 8,
    mode: str = "hybrid",
    exclude_archives: bool = True,
) -> dict:
    req = SearchRequest(
        query=q,
        top_k=top_k,
        search_mode=mode,
        exclude_archives=exclude_archives,
    )
    return search(req, request=request).model_dump()


@app.post("/recommend/tags")
def recommend_tags(req: TagRecommendationRequest, request: Request) -> dict:
    _enforce_api_policy(request)
    results, info, elapsed_ms = _run_search(req)
    recommendations = build_recommendations(
        results,
        min_domain_confidence=float(req.min_domain_confidence),
        min_enneagram_confidence=float(req.min_enneagram_confidence),
        min_tag_confidence=float(req.min_tag_confidence),
        abstain_mode=req.abstain_mode,
    )
    return {
        "input": {
            "mode": "text",
            "search_mode": req.search_mode,
            "index_dir": os.path.abspath(state.index_dir),
            "similar_chunks": len(results),
            "duration_ms": round(elapsed_ms, 2),
        },
        "recommendations": _json_ready(_attach_obsidian_links(recommendations)),
        "info": _json_ready(info),
    }


@app.post("/recommend/folders")
def recommend_folders(req: FolderRecommendationRequest, request: Request) -> dict:
    _enforce_api_policy(request)
    _ensure_service_ready(require_index=False)
    index_dir = os.path.abspath(state.index_dir)
    try:
        buckets, unit_centroids, records_scanned = collect_centroids(
            index_dir,
            depth=int(req.folder_depth),
            min_chunks_per_bucket=int(req.min_chunks_per_folder),
            max_records=req.max_records if req.max_records else None,
            exclude_archives=bool(req.exclude_archives),
        )
        if unit_centroids.shape[0] == 0:
            raise HTTPException(status_code=400, detail="No centroid buckets available; adjust folder-depth/min-chunks.")
        recommendations = rank_routes(
            req.text,
            buckets=buckets,
            unit_centroids=unit_centroids,
            top_k=int(req.top_k),
            model=state.model.get() if state.model else None,
        )
    except HTTPException:
        raise
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    report = {
        "summary": {
            "mode": "text",
            "index_dir": index_dir,
            "records_scanned": int(records_scanned),
            "candidate_folders": len(buckets),
            "folder_depth": int(req.folder_depth),
            "min_chunks_per_folder": int(req.min_chunks_per_folder),
            "exclude_archives": bool(req.exclude_archives),
        },
        "recommendations": recommendations,
    }
    for row in report["recommendations"]:
        sample_paths = [str(p) for p in (row.get("sample_paths") or []) if str(p).strip()]
        row["sample_links"] = [
            {"path": p, "obsidian_url": _obsidian_deep_link(p)}
            for p in sample_paths
            if _obsidian_deep_link(p)
        ]
    if req.dry_run_plan:
        report["move_plan"] = build_move_plan(
            recommendations,
            current_path=req.current_path,
            inferred_filename=None,
        )
        if isinstance(report.get("move_plan"), dict):
            move_plan = report["move_plan"]
            current_path = str(move_plan.get("current_path") or "")
            suggested_path = str(move_plan.get("suggested_path") or "")
            if current_path:
                move_plan["current_obsidian_url"] = _obsidian_deep_link(current_path)
            if suggested_path:
                move_plan["suggested_obsidian_url"] = _obsidian_deep_link(suggested_path)
    return _json_ready(_attach_obsidian_links(report))


@app.post("/summary")
def summary(req: SummaryRequest, request: Request) -> dict:
    _enforce_api_policy(request)
    results, _, _ = _run_search(req)
    summary_payload = synthesize_summary(req.topic, results, template=req.template)
    out = {
        "topic": req.topic,
        "template": summary_payload["template"],
        "summary_paragraphs": summary_payload["summary_paragraphs"],
        "summary_paragraph_count": summary_payload["summary_paragraph_count"],
        "sections": summary_payload["sections"],
        "source_traces": summary_payload["source_traces"],
        "evidence": summary_payload["evidence"],
        "retrieval": {
            "search_mode": req.search_mode,
            "top_chunks": len(results),
            "index_dir": os.path.abspath(state.index_dir),
            "exclude_archives": bool(req.exclude_archives),
        },
    }
    return _json_ready(_attach_obsidian_links(out))


@app.post("/graph/projects")
def project_graph(req: ProjectGraphRequest, request: Request) -> dict:
    _enforce_api_policy(request)
    _ensure_service_ready(require_index=False)
    index_dir = os.path.abspath(state.index_dir)
    emb_path = os.path.join(index_dir, "embeddings.npy")
    if not os.path.exists(emb_path):
        raise HTTPException(status_code=503, detail=f"embeddings.npy not found in {index_dir}")

    try:
        project_rows = collect_project_samples(
            index_dir,
            max_projects=max(2, int(req.max_projects)),
            max_chunks_per_project=max(1, int(req.max_chunks_per_project)),
            max_records=req.max_records if req.max_records else None,
        )
        embeddings = load_embeddings(emb_path, expected_rows=None)
        nodes, unit_vecs = build_nodes_and_centroids(project_rows, embeddings)
        edges = build_edges(
            nodes,
            unit_vecs,
            min_similarity=float(req.min_similarity),
            top_links_per_project=max(1, int(req.top_links_per_project)),
        )
        centrality_ranking = compute_centrality_rankings(
            nodes,
            edges,
            top_n=max(5, min(50, int(req.max_projects))),
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "summary": {
            "index_dir": index_dir,
            "projects_considered": len(project_rows),
            "projects_in_graph": len(nodes),
            "edges": len(edges),
            "min_similarity": float(req.min_similarity),
            "centrality_ranked": len(centrality_ranking),
        },
        "nodes": _json_ready(nodes),
        "edges": _json_ready(edges),
        "centrality_ranking": _json_ready(centrality_ranking),
    }


@app.post("/curation/queue")
def enqueue_curation(req: CurationEnqueueRequest, request: Request) -> dict:
    _enforce_api_policy(request)
    _ensure_service_ready(require_index=False)

    item_id = f"cq_{uuid4().hex[:12]}"
    now = _utc_now_iso()
    event = {
        "event": "enqueue",
        "item_id": item_id,
        "queue_type": req.queue_type,
        "payload": req.payload,
        "source": req.source,
        "note": req.note,
        "created_at": now,
    }
    _append_queue_event(CURATION_QUEUE_FILE, event)
    return {
        "ok": True,
        "item_id": item_id,
        "status": "pending",
        "created_at": now,
        "queue_file": os.path.abspath(CURATION_QUEUE_FILE),
    }


@app.get("/curation/queue")
def list_curation_queue(
    request: Request,
    status: str | None = None,
    limit: int = 100,
) -> dict:
    _enforce_api_policy(request)
    _ensure_service_ready(require_index=False)
    rows = _materialize_queue(CURATION_QUEUE_FILE)
    if status:
        rows = [r for r in rows if str(r.get("status") or "") == status]
    rows = rows[: max(1, min(int(limit), 500))]
    return {
        "count": len(rows),
        "items": _json_ready(_attach_obsidian_links(rows)),
        "queue_file": os.path.abspath(CURATION_QUEUE_FILE),
    }


@app.post("/curation/queue/{item_id}/status")
def update_curation_status(
    item_id: str,
    req: CurationStatusRequest,
    request: Request,
) -> dict:
    _enforce_api_policy(request)
    _ensure_service_ready(require_index=False)

    rows = _materialize_queue(CURATION_QUEUE_FILE)
    target = next((r for r in rows if str(r.get("item_id") or "") == item_id), None)
    if target is None:
        raise HTTPException(status_code=404, detail=f"Curation item not found: {item_id}")

    now = _utc_now_iso()
    event = {
        "event": "status_update",
        "item_id": item_id,
        "status": req.status,
        "reviewer": req.reviewer,
        "note": req.note,
        "updated_at": now,
    }
    _append_queue_event(CURATION_QUEUE_FILE, event)
    return {
        "ok": True,
        "item_id": item_id,
        "status": req.status,
        "reviewer": req.reviewer,
        "updated_at": now,
    }
