#!/usr/bin/env python3
"""
health_check.py — Verify PARA Vault Memory Index integrity and freshness.

Reports:
    - Index file existence and sizes
    - Chunk count, file count, format breakdown
    - Index age and staleness vs vault modifications
    - FAISS dimension and vector count consistency
"""

from __future__ import annotations

import json
import os
import sys
import time
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

_DEFAULT_VAULT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_DEFAULT_OUTPUT = os.path.join(_DEFAULT_VAULT, "_System", "memory")


def _size_mb(path: str) -> float:
    return os.path.getsize(path) / (1024 * 1024) if os.path.exists(path) else 0.0


def _count_jsonl_lines(path: str) -> int:
    count = 0
    with open(path, "rb") as f:
        for _ in f:
            count += 1
    return count


def _age_str(ts_iso: str) -> str:
    try:
        dt = datetime.fromisoformat(ts_iso)
        delta = datetime.now(timezone.utc) - dt
        hours = delta.total_seconds() / 3600
        if hours < 1:
            return f"{delta.total_seconds()/60:.0f}m ago"
        if hours < 48:
            return f"{hours:.1f}h ago"
        return f"{hours/24:.1f}d ago"
    except Exception:
        return "unknown"


def health_check(output_dir: str = _DEFAULT_OUTPUT) -> dict:
    """Run health checks and return a report dict."""
    report: dict = {"status": "OK", "issues": []}

    # --- File existence ---
    files = {
        "vault.faiss": os.path.join(output_dir, "vault.faiss"),
        "meta.json": os.path.join(output_dir, "meta.json"),
        "embeddings.npy": os.path.join(output_dir, "embeddings.npy"),
        "file_hashes.json": os.path.join(output_dir, "file_hashes.json"),
        "index_stats.json": os.path.join(output_dir, "index_stats.json"),
    }

    for name, path in files.items():
        exists = os.path.exists(path)
        mb = _size_mb(path) if exists else 0.0
        report[name] = {"exists": exists, "size_mb": round(mb, 1)}
        if not exists:
            report["issues"].append(f"Missing: {name}")
            report["status"] = "ERROR"

    # --- Stats ---
    stats_path = files["index_stats.json"]
    if os.path.exists(stats_path):
        with open(stats_path) as f:
            stats = json.load(f)
        report["file_count"] = stats.get("file_count", 0)
        report["chunk_count"] = stats.get("chunk_count", 0)
        report["model"] = stats.get("model_name", "")
        report["indexed_at"] = stats.get("indexed_at", "")
        report["age"] = _age_str(stats.get("indexed_at", ""))
        report["chunks_by_format"] = stats.get("chunks_by_format", {})
        report["mode"] = stats.get("mode", "")
        report["shards"] = stats.get("shards", "")
    else:
        report["file_count"] = 0
        report["chunk_count"] = 0

    # --- FAISS consistency ---
    faiss_path = files["vault.faiss"]
    meta_path = files["meta.json"]
    meta_jsonl_path = os.path.join(output_dir, "meta.jsonl")
    meta_offsets_path = os.path.join(output_dir, "meta.offsets.npy")
    if os.path.exists(faiss_path) and os.path.exists(meta_path):
        try:
            import faiss
            index = faiss.read_index(faiss_path)
            report["faiss_vectors"] = index.ntotal
            report["faiss_dim"] = index.d

            if os.path.exists(meta_offsets_path):
                import numpy as np
                offsets = np.load(meta_offsets_path, mmap_mode="r")
                report["meta_records"] = max(int(offsets.shape[0]) - 1, 0)
                report["meta_records_source"] = "meta.offsets.npy"
            elif os.path.exists(meta_jsonl_path):
                report["meta_records"] = _count_jsonl_lines(meta_jsonl_path)
                report["meta_records_source"] = "meta.jsonl"
            else:
                with open(meta_path) as f:
                    meta = json.load(f)
                report["meta_records"] = len(meta)
                report["meta_records_source"] = "meta.json"

            if index.ntotal != report["meta_records"]:
                report["issues"].append(
                    f"FAISS/meta mismatch: {index.ntotal} vectors vs {report['meta_records']} records"
                )
                report["status"] = "WARNING"
        except Exception as e:
            report["issues"].append(f"FAISS load error: {e}")
            report["status"] = "ERROR"

    # --- Checkpoint (interrupted build?) ---
    ckpt_path = os.path.join(output_dir, "index_checkpoint.json")
    ckpt_journal_path = f"{ckpt_path}.journal"
    if os.path.exists(ckpt_path):
        report["issues"].append("Checkpoint file exists — interrupted build? Use --resume")
        if report["status"] == "OK":
            report["status"] = "WARNING"
    if os.path.exists(ckpt_journal_path):
        report["issues"].append("Checkpoint journal exists — resume residue detected")
        if report["status"] == "OK":
            report["status"] = "WARNING"

    # --- Shards dir (incomplete assembly?) ---
    shards_dir = os.path.join(output_dir, "shards")
    shard_manifest = os.path.join(output_dir, "shard_manifest.json")
    if os.path.isdir(shards_dir):
        import glob
        n_shards = len(glob.glob(os.path.join(shards_dir, "emb_*.npy")))
        if n_shards > 0:
            if os.path.exists(shard_manifest):
                report["router_shards"] = n_shards
            else:
                report["issues"].append(f"Shards dir has {n_shards} unassembled shards")
                if report["status"] == "OK":
                    report["status"] = "WARNING"

    if not report["issues"]:
        report["issues"] = ["None"]

    return report


def print_report(report: dict) -> None:
    """Pretty-print the health report."""
    status = report["status"]
    icon = {"OK": "✅", "WARNING": "⚠️", "ERROR": "❌"}.get(status, "?")

    print(f"\n{icon}  Vault Memory Index — {status}")
    print(f"{'─' * 45}")

    if report.get("chunk_count"):
        print(f"  Chunks:      {report['chunk_count']:,}")
        print(f"  Files:       {report['file_count']:,}")
        print(f"  Model:       {report.get('model', '?')}")
        print(f"  Indexed:     {report.get('age', '?')} ({report.get('indexed_at', '')[:19]})")
        if report.get("mode"):
            print(f"  Mode:        {report['mode']}")

    # Format breakdown
    fmt = report.get("chunks_by_format", {})
    if fmt:
        print(f"  Formats:")
        for k, v in sorted(fmt.items()):
            print(f"    {k:6s}: {v:>10,} chunks")
    if report.get("router_shards"):
        print(f"  Router shards: {int(report['router_shards']):,}")

    # File sizes
    print(f"\n  Files:")
    for name in ["vault.faiss", "meta.json", "meta.jsonl", "meta.offsets.npy", "embeddings.npy", "file_hashes.json"]:
        info = report.get(name, {})
        if info.get("exists"):
            print(f"    {name:20s} {info['size_mb']:>8.1f} MB")
        elif name in {"vault.faiss", "meta.json", "embeddings.npy", "file_hashes.json"}:
            print(f"    {name:20s}  MISSING")

    # FAISS consistency
    if "faiss_vectors" in report:
        match = "✓" if report.get("faiss_vectors") == report.get("meta_records") else "✗ MISMATCH"
        src = report.get("meta_records_source", "meta")
        print(
            f"\n  FAISS: {report['faiss_vectors']:,} vectors, dim={report.get('faiss_dim', '?')}, "
            f"meta={report.get('meta_records', 0):,} ({src})  {match}"
        )

    # Issues
    issues = report.get("issues", [])
    if issues and issues != ["None"]:
        print(f"\n  Issues:")
        for issue in issues:
            print(f"    • {issue}")

    print()


def main() -> None:
    import argparse
    parser = argparse.ArgumentParser(description="Check vault memory index health")
    parser.add_argument("--index-dir", default=_DEFAULT_OUTPUT)
    parser.add_argument("--json", action="store_true", dest="json_output")
    args = parser.parse_args()

    report = health_check(args.index_dir)

    if args.json_output:
        print(json.dumps(report, indent=2))
    else:
        print_report(report)

    sys.exit(0 if report["status"] == "OK" else 1)


if __name__ == "__main__":
    main()
