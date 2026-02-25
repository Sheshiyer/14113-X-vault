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
import fnmatch
import json
import os
import sys
import time

# Ensure sibling imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np
from sentence_transformers import SentenceTransformer

from embedder import load_index, load_metadata, MODEL_NAME, EMBEDDING_DIM

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

_DEFAULT_INDEX_DIR = os.path.join(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")),
    "_System", "memory",
)
_DEFAULT_TOP_K = 8
_SNIPPET_LEN = 220


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


# ---------------------------------------------------------------------------
# A-W6-03: FAISS search wrapper
# ---------------------------------------------------------------------------

def search(
    index,
    meta: list[dict],
    query_vec: np.ndarray,
    top_k: int = _DEFAULT_TOP_K,
    use_priority: bool = True
):
    """Search the FAISS index and return ranked results.

    Returns a list of dicts, each containing:
        score, path, para, domain, heading, frontmatter_tags, chunk_index, rank
    """
    # Over-fetch to allow for post-retrieval filtering and re-ranking
    fetch_k = min(top_k * 10, index.ntotal)
    scores, ids = index.search(query_vec, fetch_k)

    results = []
    for score, idx in zip(scores[0], ids[0]):
        if idx < 0:
            continue
        record = dict(meta[idx])
        
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

        results.append(record)

    # Re-sort by weighted score if priority was used
    if use_priority:
        results.sort(key=lambda x: x["score"], reverse=True)

    return results


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


# ---------------------------------------------------------------------------
# A-W6-06: Result formatter
# ---------------------------------------------------------------------------

def format_results(
    results: list[dict],
    top_k: int = _DEFAULT_TOP_K,
    as_json: bool = False,
) -> str:
    """Format search results for terminal or JSON output."""
    if not results:
        return "[]" if as_json else "  No results found."

    display = results[:top_k]

    if as_json:
        out = []
        for i, r in enumerate(display):
            out.append({
                "rank": i + 1,
                "score": round(r.get("score", 0.0), 4),
                "path": r.get("path", ""),
                "heading": r.get("heading") or "",
                "para": r.get("para", ""),
                "domain": r.get("domain", ""),
                "file_format": r.get("file_format", ""),
                "page": r.get("page", ""),
                "chapter": r.get("chapter", ""),
                "doc_title": r.get("doc_title", ""),
                "text": r.get("text", ""),
            })
        return json.dumps(out, indent=2, ensure_ascii=False)

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

        # Tags if any
        tags = r.get("frontmatter_tags", [])
        if tags:
            lines.append(f"     tags: {', '.join(tags[:6])}")

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
    return results


def run_repl(
    model: SentenceTransformer,
    index,
    meta: list[dict],
    top_k: int = _DEFAULT_TOP_K,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    as_json: bool = False,
    use_priority: bool = True,
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
    if not use_priority:
        filters.append("no-priority")
    filter_str = f"  Filters: {', '.join(filters)}" if filters else ""

    print(f"\n🔍 PARA Vault Search  ({index.ntotal:,} chunks indexed)")
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
        query_vec = encode_query(model, query)
        results = search(index, meta, query_vec, top_k=top_k, use_priority=use_priority)
        results = _apply_filters(results, para_filter, domain_filter,
                                 format_filter, exclude_archives)

        elapsed = (time.monotonic() - t0) * 1000
        print(f"\n  ({len(results)} hits, {elapsed:.0f}ms)\n")
        print(format_results(results, top_k, as_json=as_json))


# ---------------------------------------------------------------------------
# One-shot query (A-W6-09)
# ---------------------------------------------------------------------------

def run_one_shot(
    model: SentenceTransformer,
    index,
    meta: list[dict],
    query: str,
    top_k: int = _DEFAULT_TOP_K,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    as_json: bool = False,
    use_priority: bool = True,
):
    """Run a single query and print results."""
    query_vec = encode_query(model, query)
    results = search(index, meta, query_vec, top_k=top_k, use_priority=use_priority)
    results = _apply_filters(results, para_filter, domain_filter,
                             format_filter, exclude_archives)
    print(format_results(results, top_k, as_json=as_json))


# ---------------------------------------------------------------------------
# B-W9: Batch query mode
# ---------------------------------------------------------------------------

def run_batch(
    model: SentenceTransformer,
    index,
    meta: list[dict],
    queries_file: str,
    top_k: int = _DEFAULT_TOP_K,
    para_filter: str | None = None,
    domain_filter: str | None = None,
    format_filter: str | None = None,
    exclude_archives: bool = False,
    as_json: bool = False,
    use_priority: bool = True,
):
    """Run multiple queries from a file (one per line)."""
    with open(queries_file, "r") as f:
        queries = [line.strip() for line in f if line.strip()]

    if not queries:
        print("No queries found in file.", file=sys.stderr)
        return

    all_results = []
    for qi, query in enumerate(queries):
        query_vec = encode_query(model, query)
        results = search(index, meta, query_vec, top_k=top_k, use_priority=use_priority)
        results = _apply_filters(results, para_filter, domain_filter,
                                 format_filter, exclude_archives)
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
                        "file_format": r.get("file_format", ""),
                    }
                    for i, r in enumerate(top)
                ],
            })
        else:
            print(f"\n{'─' * 50}")
            print(f"  Query {qi+1}: {query}")
            print(f"{'─' * 50}")
            print(format_results(top, top_k))

    if as_json:
        print(json.dumps(all_results, indent=2, ensure_ascii=False))


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
        help="Directory containing vault.faiss and meta.json",
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
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    faiss_path = os.path.join(args.index_dir, "vault.faiss")
    meta_path = os.path.join(args.index_dir, "meta.json")

    if not os.path.exists(faiss_path):
        print(f"ERROR: Index not found at {faiss_path}", file=sys.stderr)
        print("  Run index_vault.py first.", file=sys.stderr)
        sys.exit(1)

    if not args.json_output:
        print("Loading index...", end=" ", flush=True, file=sys.stderr)
    
    index = load_index(faiss_path)
    meta = load_metadata(meta_path)
    
    if not args.json_output:
        print(f"{index.ntotal:,} chunks loaded.", file=sys.stderr)
        print("Loading model...", end=" ", flush=True, file=sys.stderr)
    
    model = SentenceTransformer(args.model)
    
    if not args.json_output:
        print("ready.", file=sys.stderr)

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
            as_json=args.json_output,
            use_priority=args.use_priority,
        )
    elif args.query:
        # One-shot mode
        run_one_shot(
            model, index, meta,
            query=args.query,
            top_k=args.top,
            para_filter=args.para,
            domain_filter=args.domain,
            format_filter=args.format,
            exclude_archives=args.exclude_archives,
            as_json=args.json_output,
            use_priority=args.use_priority,
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
            as_json=args.json_output,
            use_priority=args.use_priority,
        )


if __name__ == "__main__":
    main()
