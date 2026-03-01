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
    model=None,
) -> list[dict]:
    model = model or _sentence_transformer_cls()(MODEL_NAME)
    query_vec = encode_query(model, text)
    q = np.asarray(query_vec[0], dtype=np.float32)
    q_norm = float(np.linalg.norm(q))
    if q_norm > 1e-9:
        q = q / q_norm

    scores = np.matmul(unit_centroids, q)
    order = np.argsort(scores)[::-1][: max(1, int(top_k))]

    max_chunk_count = max((int(row.get("chunk_count") or 0) for row in buckets), default=1)
    top_score = float(scores[int(order[0])]) if len(order) else 0.0
    second_score = float(scores[int(order[1])]) if len(order) > 1 else top_score
    score_gap = max(0.0, top_score - second_score)

    def _clamp01(v: float) -> float:
        return max(0.0, min(1.0, float(v)))

    out = []
    for rank, i in enumerate(order, start=1):
        row = buckets[int(i)]
        score = float(scores[int(i)])
        # Risk is higher when similarity is low, candidate support is sparse,
        # or the top recommendation is ambiguous against the second-best match.
        sim_norm = _clamp01((score + 1.0) / 2.0)
        similarity_risk = 1.0 - sim_norm
        support_risk = 1.0 - _clamp01(float(row["chunk_count"]) / float(max_chunk_count or 1))
        ambiguity_risk = _clamp01(1.0 - (score_gap / 0.20))
        archive_penalty = 1.0 if str(row.get("dominant_para") or "").lower() == "archives" else 0.0

        risk_score = _clamp01(
            (0.45 * similarity_risk)
            + (0.25 * support_risk)
            + (0.20 * ambiguity_risk)
            + (0.10 * archive_penalty)
        )
        risk_level = "low" if risk_score < 0.33 else ("medium" if risk_score < 0.66 else "high")
        risk_factors = [
            {"factor": "similarity", "value": round(similarity_risk, 4)},
            {"factor": "support_sparsity", "value": round(support_risk, 4)},
            {"factor": "top_match_ambiguity", "value": round(ambiguity_risk, 4)},
        ]
        if archive_penalty > 0:
            risk_factors.append({"factor": "archives_penalty", "value": 1.0})

        out.append(
            {
                "rank": rank,
                "folder": row["folder"],
                "similarity": round(score, 4),
                "chunk_count": row["chunk_count"],
                "dominant_para": row["dominant_para"],
                "top_domains": row["top_domains"],
                "sample_paths": row["sample_paths"],
                "risk_score": round(risk_score, 4),
                "risk_level": risk_level,
                "risk_factors": risk_factors,
            }
        )
    return out


def build_move_plan(
    recommendations: list[dict],
    *,
    current_path: str | None,
    inferred_filename: str | None,
) -> dict | None:
    if not recommendations:
        return None
    top = recommendations[0]
    target_folder = str(top.get("folder") or "").strip("/")
    if not target_folder:
        return None

    src = str(current_path or "").strip()
    filename = ""
    source_folder = ""
    if src:
        filename = os.path.basename(src)
        source_folder = str(PurePosixPath(src).parent).strip(".")
    elif inferred_filename:
        filename = os.path.basename(inferred_filename)
    if not filename:
        filename = "incoming-note.md"

    suggested_path = f"{target_folder}/{filename}".strip("/")
    would_move = bool(src) and PurePosixPath(src).as_posix() != suggested_path
    folder_change = bool(source_folder) and source_folder != target_folder
    reasons = [
        f"top semantic route: {target_folder}",
        f"risk={top.get('risk_level')} ({top.get('risk_score')})",
    ]
    if folder_change:
        reasons.append(f"folder change: {source_folder} -> {target_folder}")
    if not src:
        reasons.append("source path not provided; planner inferred filename only")

    return {
        "mode": "dry_run",
        "current_path": src,
        "suggested_path": suggested_path,
        "target_folder": target_folder,
        "would_move": would_move,
        "risk_score": top.get("risk_score"),
        "risk_level": top.get("risk_level"),
        "risk_factors": top.get("risk_factors") or [],
        "reasons": reasons,
    }


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
            f"chunks={row['chunk_count']} | para={row['dominant_para']} | domains={domains} | "
            f"risk={row.get('risk_level')}({row.get('risk_score')})"
        )
    move_plan = report.get("move_plan")
    if move_plan:
        print("")
        print("Dry-run move plan")
        print(f"- Current: {move_plan.get('current_path') or '[not provided]'}")
        print(f"- Suggested: {move_plan.get('suggested_path')}")
        print(f"- Risk: {move_plan.get('risk_level')} ({move_plan.get('risk_score')})")


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
    parser.add_argument("--current-path", help="Current vault-relative path for dry-run move planning.")
    parser.add_argument("--dry-run-plan", action="store_true", help="Emit a non-mutating move plan for the top suggestion.")
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
    file_hint = os.path.basename(args.file) if args.file else None

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
    if args.dry_run_plan:
        report["move_plan"] = build_move_plan(
            recommendations,
            current_path=args.current_path,
            inferred_filename=file_hint,
        )

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        _print_human(report)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
