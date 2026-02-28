#!/usr/bin/env python3
"""
suggest_semantic_folder_route.py — Suggest PARA folder routes from index centroids.

Issue #59 acceptance:
- Incoming text is matched against centroid vectors derived from existing indexed folders.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter, defaultdict
from pathlib import PurePosixPath

import numpy as np


VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(VAULT_ROOT, "_System", "memory")
MEMORY_SCRIPTS_DIR = os.path.join(VAULT_ROOT, "_System", "scripts", "memory")
sys.path.insert(0, MEMORY_SCRIPTS_DIR)

from incremental import load_embeddings  # type: ignore  # noqa: E402
from query_vault import MODEL_NAME, encode_query  # type: ignore  # noqa: E402


def _sentence_transformer_cls():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer


def iter_meta_records(index_dir: str, max_records: int | None = None):
    jsonl_path = os.path.join(index_dir, "meta.jsonl")
    if os.path.exists(jsonl_path):
        with open(jsonl_path, "r", encoding="utf-8", errors="replace") as f:
            for idx, line in enumerate(f):
                if max_records is not None and idx >= max_records:
                    return
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                if isinstance(rec, dict):
                    yield idx, rec
        return

    json_path = os.path.join(index_dir, "meta.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        return
    for idx, rec in enumerate(data):
        if max_records is not None and idx >= max_records:
            return
        if isinstance(rec, dict):
            yield idx, rec


def folder_bucket(rel_path: str, depth: int) -> str | None:
    parts = list(PurePosixPath(str(rel_path or "")).parts)
    if not parts:
        return None

    # Keep PARA bucket root + one semantic level by default.
    limit = max(1, min(int(depth), len(parts) - 1 if len(parts) > 1 else 1))
    if len(parts) > 1:
        return "/".join(parts[:limit])
    return parts[0]


def collect_centroids(
    index_dir: str,
    *,
    depth: int,
    min_chunks_per_bucket: int,
    max_records: int | None,
    exclude_archives: bool,
) -> tuple[list[dict], np.ndarray, int]:
    emb_path = os.path.join(index_dir, "embeddings.npy")
    embeddings = load_embeddings(emb_path, expected_rows=None)

    sums: dict[str, np.ndarray] = {}
    counts: Counter[str] = Counter()
    para_counts: dict[str, Counter[str]] = defaultdict(Counter)
    domain_counts: dict[str, Counter[str]] = defaultdict(Counter)
    sample_paths: dict[str, list[str]] = defaultdict(list)

    scanned_records = 0
    for idx, rec in iter_meta_records(index_dir, max_records=max_records):
        scanned_records += 1
        if idx < 0 or idx >= embeddings.shape[0]:
            continue

        path = str(rec.get("path") or "")
        bucket = folder_bucket(path, depth=depth)
        if not bucket:
            continue

        para = str(rec.get("para") or "").strip()
        if exclude_archives and para.lower() == "archives":
            continue

        vec = np.asarray(embeddings[idx], dtype=np.float32)
        if vec.ndim != 1:
            continue

        if bucket not in sums:
            sums[bucket] = np.zeros_like(vec, dtype=np.float32)
        sums[bucket] += vec
        counts[bucket] += 1

        if para:
            para_counts[bucket][para] += 1

        domain = str(rec.get("domain") or "").strip()
        if domain:
            domain_counts[bucket][domain] += 1

        if len(sample_paths[bucket]) < 3 and path and path not in sample_paths[bucket]:
            sample_paths[bucket].append(path)

    bucket_rows = []
    unit_centroids = []
    for bucket, count in counts.items():
        if count < max(1, int(min_chunks_per_bucket)):
            continue

        centroid = sums[bucket] / float(count)
        norm = float(np.linalg.norm(centroid))
        if norm <= 1e-9:
            continue
        centroid = centroid / norm

        dominant_para = para_counts[bucket].most_common(1)
        top_domains = [d for d, _ in domain_counts[bucket].most_common(3)]
        row = {
            "folder": bucket,
            "chunk_count": int(count),
            "dominant_para": dominant_para[0][0] if dominant_para else "",
            "top_domains": top_domains,
            "sample_paths": sample_paths[bucket],
        }
        bucket_rows.append(row)
        unit_centroids.append(centroid)

    if not unit_centroids:
        return bucket_rows, np.zeros((0, 0), dtype=np.float32), scanned_records

    return bucket_rows, np.vstack(unit_centroids).astype(np.float32), scanned_records


def rank_routes(
    text: str,
    *,
    buckets: list[dict],
    unit_centroids: np.ndarray,
    top_k: int,
) -> list[dict]:
    model = _sentence_transformer_cls()(MODEL_NAME)
    query_vec = encode_query(model, text)
    q = np.asarray(query_vec[0], dtype=np.float32)
    q_norm = float(np.linalg.norm(q))
    if q_norm > 1e-9:
        q = q / q_norm

    scores = np.matmul(unit_centroids, q)
    order = np.argsort(scores)[::-1][: max(1, int(top_k))]

    out = []
    for rank, i in enumerate(order, start=1):
        row = buckets[int(i)]
        score = float(scores[int(i)])
        out.append(
            {
                "rank": rank,
                "folder": row["folder"],
                "similarity": round(score, 4),
                "chunk_count": row["chunk_count"],
                "dominant_para": row["dominant_para"],
                "top_domains": row["top_domains"],
                "sample_paths": row["sample_paths"],
            }
        )
    return out


def _print_human(report: dict) -> None:
    print("Semantic Folder Routing Suggestions")
    print(f"- Candidate folders: {report['summary']['candidate_folders']}")
    print(f"- Records scanned: {report['summary']['records_scanned']}")
    print(f"- Folder depth: {report['summary']['folder_depth']}")
    print("")
    for row in report["recommendations"]:
        domains = ", ".join(row.get("top_domains") or []) or "n/a"
        print(
            f"{row['rank']}. {row['folder']} | sim={row['similarity']} | "
            f"chunks={row['chunk_count']} | para={row['dominant_para']} | domains={domains}"
        )


def main() -> int:
    parser = argparse.ArgumentParser(description="Suggest PARA folder routing from semantic centroids.")
    parser.add_argument("--text", help="Incoming note text to route.")
    parser.add_argument("--file", help="Path to a note file to route.")
    parser.add_argument("--index-dir", default=DEFAULT_INDEX_DIR, help="Index directory with embeddings/meta.")
    parser.add_argument("--folder-depth", type=int, default=2, help="Path depth for folder buckets (default: 2).")
    parser.add_argument("--min-chunks-per-folder", type=int, default=8, help="Minimum chunks for a folder centroid.")
    parser.add_argument("--exclude-archives", action="store_true", help="Exclude Archives chunks from centroid pool.")
    parser.add_argument("--max-records", type=int, help="Optional metadata scan cap.")
    parser.add_argument("--top", type=int, default=8, help="Top folder suggestions to return.")
    parser.add_argument("--json", action="store_true", help="Emit JSON output.")
    args = parser.parse_args()

    if not args.text and not args.file:
        print("Error: provide --text or --file", file=sys.stderr)
        return 1
    if args.text and args.file:
        print("Error: use only one of --text or --file", file=sys.stderr)
        return 1

    payload = args.text or ""
    mode = "text"
    if args.file:
        mode = "file"
        path = os.path.abspath(args.file)
        if not os.path.exists(path):
            print(f"Error: file not found: {path}", file=sys.stderr)
            return 1
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            payload = f.read()

    index_dir = os.path.abspath(args.index_dir)
    if not os.path.isdir(index_dir):
        print(f"Error: index dir not found: {index_dir}", file=sys.stderr)
        return 1

    buckets, unit_centroids, records_scanned = collect_centroids(
        index_dir,
        depth=max(1, int(args.folder_depth)),
        min_chunks_per_bucket=max(1, int(args.min_chunks_per_folder)),
        max_records=args.max_records if args.max_records and args.max_records > 0 else None,
        exclude_archives=bool(args.exclude_archives),
    )
    if unit_centroids.shape[0] == 0:
        print("Error: no centroid buckets available (adjust depth/min-chunks).", file=sys.stderr)
        return 2

    recommendations = rank_routes(
        payload,
        buckets=buckets,
        unit_centroids=unit_centroids,
        top_k=max(1, int(args.top)),
    )

    report = {
        "summary": {
            "mode": mode,
            "index_dir": index_dir,
            "records_scanned": int(records_scanned),
            "candidate_folders": len(buckets),
            "folder_depth": int(args.folder_depth),
            "min_chunks_per_folder": int(args.min_chunks_per_folder),
            "exclude_archives": bool(args.exclude_archives),
        },
        "recommendations": recommendations,
    }

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        _print_human(report)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
