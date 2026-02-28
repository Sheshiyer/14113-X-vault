#!/usr/bin/env python3
"""
export_smart_connections_bridge.py — Build Obsidian Smart Connections JSON bridge.

Issue #63 acceptance:
- Exports Meru semantic relationships in a plugin-friendly JSON bridge so Obsidian UI
  features can consume index intelligence locally.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone

import faiss
import numpy as np


VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(VAULT_ROOT, "_System", "memory")
DEFAULT_OUTPUT = os.path.join(DEFAULT_INDEX_DIR, "obsidian_smart_connections_bridge.json")
MEMORY_SCRIPTS_DIR = os.path.join(VAULT_ROOT, "_System", "scripts", "memory")
sys.path.insert(0, MEMORY_SCRIPTS_DIR)

from incremental import load_embeddings  # type: ignore  # noqa: E402


def iter_meta_records(index_dir: str):
    jsonl_path = os.path.join(index_dir, "meta.jsonl")
    if os.path.exists(jsonl_path):
        with open(jsonl_path, "r", encoding="utf-8", errors="replace") as f:
            for idx, line in enumerate(f):
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

    with open(os.path.join(index_dir, "meta.json"), "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        for idx, rec in enumerate(data):
            if isinstance(rec, dict):
                yield idx, rec


def build_note_centroids(
    index_dir: str,
    *,
    min_chunks_per_note: int,
    max_notes: int | None,
) -> tuple[list[dict], np.ndarray]:
    emb_path = os.path.join(index_dir, "embeddings.npy")
    embeddings = load_embeddings(emb_path, expected_rows=None)

    sums: dict[str, np.ndarray] = {}
    counts: Counter[str] = Counter()
    para_counts: dict[str, Counter[str]] = defaultdict(Counter)
    domain_counts: dict[str, Counter[str]] = defaultdict(Counter)

    for idx, rec in iter_meta_records(index_dir):
        if idx < 0 or idx >= embeddings.shape[0]:
            continue
        path = str(rec.get("path") or "")
        if not path:
            continue

        vec = np.asarray(embeddings[idx], dtype=np.float32)
        if path not in sums:
            sums[path] = np.zeros_like(vec, dtype=np.float32)
        sums[path] += vec
        counts[path] += 1

        para = str(rec.get("para") or "").strip()
        domain = str(rec.get("domain") or "").strip()
        if para:
            para_counts[path][para] += 1
        if domain:
            domain_counts[path][domain] += 1

    paths = [p for p, c in counts.items() if c >= max(1, int(min_chunks_per_note))]
    paths.sort(key=lambda p: counts[p], reverse=True)
    if max_notes is not None and max_notes > 0:
        paths = paths[: int(max_notes)]

    notes: list[dict] = []
    vecs: list[np.ndarray] = []

    for p in paths:
        centroid = sums[p] / float(counts[p])
        norm = float(np.linalg.norm(centroid))
        if norm <= 1e-9:
            continue
        unit = centroid / norm

        title = os.path.splitext(os.path.basename(p))[0]
        dominant_para = para_counts[p].most_common(1)
        top_domains = [d for d, _ in domain_counts[p].most_common(3)]

        notes.append(
            {
                "id": p,
                "path": p,
                "title": title,
                "chunk_count": int(counts[p]),
                "para": dominant_para[0][0] if dominant_para else "",
                "domains": top_domains,
            }
        )
        vecs.append(unit.astype(np.float32))

    if not vecs:
        return notes, np.zeros((0, 0), dtype=np.float32)

    return notes, np.vstack(vecs).astype(np.float32)


def attach_neighbors(notes: list[dict], unit_vectors: np.ndarray, *, top_neighbors: int) -> None:
    if unit_vectors.shape[0] == 0:
        return

    index = faiss.IndexFlatIP(unit_vectors.shape[1])
    index.add(unit_vectors)
    k = max(2, int(top_neighbors) + 1)
    scores, ids = index.search(unit_vectors, k)

    for i, note in enumerate(notes):
        neighbors = []
        for score, j in zip(scores[i], ids[i]):
            jj = int(j)
            if jj < 0 or jj >= len(notes) or jj == i:
                continue
            neighbors.append(
                {
                    "id": notes[jj]["id"],
                    "path": notes[jj]["path"],
                    "title": notes[jj]["title"],
                    "similarity": round(float(score), 4),
                }
            )
            if len(neighbors) >= top_neighbors:
                break
        note["neighbors"] = neighbors


def main() -> int:
    parser = argparse.ArgumentParser(description="Export Smart Connections compatibility bridge JSON from Meru index.")
    parser.add_argument("--index-dir", default=DEFAULT_INDEX_DIR, help="Directory containing embeddings/meta.")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Destination bridge JSON path.")
    parser.add_argument("--top-neighbors", type=int, default=8, help="Semantic neighbors per note.")
    parser.add_argument("--min-chunks-per-note", type=int, default=1, help="Minimum chunk count required for a note.")
    parser.add_argument("--max-notes", type=int, help="Optional cap on exported note count.")
    parser.add_argument("--include-embeddings", action="store_true", help="Include 384-d vectors per note in bridge.")
    parser.add_argument("--json", action="store_true", help="Print summary JSON to stdout.")
    args = parser.parse_args()

    index_dir = os.path.abspath(args.index_dir)
    if not os.path.isdir(index_dir):
        print(f"Error: index directory not found: {index_dir}", file=sys.stderr)
        return 1

    notes, unit_vectors = build_note_centroids(
        index_dir,
        min_chunks_per_note=max(1, int(args.min_chunks_per_note)),
        max_notes=args.max_notes if args.max_notes and args.max_notes > 0 else None,
    )
    attach_neighbors(notes, unit_vectors, top_neighbors=max(1, int(args.top_neighbors)))

    if args.include_embeddings and unit_vectors.shape[0] == len(notes):
        for i, note in enumerate(notes):
            note["embedding"] = [round(float(v), 7) for v in unit_vectors[i].tolist()]

    bridge = {
        "schema": "smart-connections-bridge/v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": {
            "system": "Meru Vault Index",
            "index_dir": index_dir,
            "model": "all-MiniLM-L6-v2",
            "embedding_dim": int(unit_vectors.shape[1]) if unit_vectors.ndim == 2 and unit_vectors.size else 0,
        },
        "summary": {
            "note_count": len(notes),
            "top_neighbors": int(args.top_neighbors),
            "min_chunks_per_note": int(args.min_chunks_per_note),
        },
        "notes": notes,
    }

    output_path = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(bridge, f, indent=2, ensure_ascii=False)

    summary = {
        "output": output_path,
        "note_count": len(notes),
        "embedding_dim": bridge["source"]["embedding_dim"],
        "top_neighbors": int(args.top_neighbors),
    }

    if args.json:
        print(json.dumps(summary, indent=2, ensure_ascii=False))
    else:
        print("Smart Connections Bridge Export")
        print(f"- Output: {output_path}")
        print(f"- Notes: {len(notes)}")
        print(f"- Top neighbors per note: {int(args.top_neighbors)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
