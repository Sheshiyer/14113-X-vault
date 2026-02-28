#!/usr/bin/env python3
"""
detect_knowledge_gaps.py — Identify low-density PARA domains and suggest next focus.

Issue #55 acceptance:
- Detect weak semantic density zones and suggest where research should be directed.
"""

from __future__ import annotations

import argparse
import json
import math
import os
from collections import defaultdict


VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(VAULT_ROOT, "_System", "memory")
EXPECTED_PARA = ("Projects", "Areas", "Resources", "Archives")


def _domain_root(domain: str) -> str:
    raw = (domain or "").strip()
    if not raw:
        return "Unknown"
    return raw.split("/", 1)[0].strip() or "Unknown"


def iter_meta_records(index_dir: str, max_records: int | None = None):
    jsonl_path = os.path.join(index_dir, "meta.jsonl")
    if os.path.exists(jsonl_path):
        with open(jsonl_path, "r", encoding="utf-8", errors="replace") as f:
            for i, line in enumerate(f):
                if max_records is not None and i >= max_records:
                    return
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                if isinstance(rec, dict):
                    yield rec
        return

    json_path = os.path.join(index_dir, "meta.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        return
    for i, rec in enumerate(data):
        if max_records is not None and i >= max_records:
            return
        if isinstance(rec, dict):
            yield rec


def build_gap_report(index_dir: str, *, top_gaps: int = 10, max_records: int | None = None) -> dict:
    stats = defaultdict(lambda: {
        "chunks": 0,
        "files": set(),
        "prana_sum": 0.0,
        "recency_sum": 0.0,
        "paths": [],
    })
    para_totals = defaultdict(int)
    total = 0

    for rec in iter_meta_records(index_dir, max_records=max_records):
        total += 1
        para = str(rec.get("para") or "Unknown")
        domain = _domain_root(str(rec.get("domain") or "Unknown"))
        key = (para, domain)

        s = stats[key]
        s["chunks"] += 1
        path = str(rec.get("path") or "")
        if path:
            s["files"].add(path)
            if len(s["paths"]) < 3 and path not in s["paths"]:
                s["paths"].append(path)

        prana = float(rec.get("prana_score") or 0.0)
        recency = float(rec.get("recency_score") or 0.0)
        s["prana_sum"] += prana
        s["recency_sum"] += recency
        para_totals[para] += 1

    if not total:
        return {
            "summary": {
                "records_scanned": 0,
                "index_dir": os.path.abspath(index_dir),
                "note": "No metadata records found.",
            },
            "gaps": [],
            "para_coverage": {},
        }

    counts = [v["chunks"] for v in stats.values()] or [1]
    max_count = max(counts)
    max_log = math.log1p(max_count) or 1.0
    max_files = max((len(v["files"]) for v in stats.values()), default=1)

    scored = []
    for (para, domain), v in stats.items():
        chunks = v["chunks"]
        unique_files = len(v["files"])
        avg_prana = (v["prana_sum"] / chunks) if chunks else 0.0
        avg_recency = (v["recency_sum"] / chunks) if chunks else 0.0

        chunk_signal = math.log1p(chunks) / max_log
        file_signal = unique_files / max_files if max_files else 0.0
        density = (0.62 * chunk_signal) + (0.23 * file_signal) + (0.15 * avg_prana)
        gap_score = max(0.0, 1.0 - density)

        scored.append({
            "para": para,
            "domain": domain,
            "chunks": chunks,
            "unique_files": unique_files,
            "avg_prana_score": round(avg_prana, 4),
            "avg_recency_score": round(avg_recency, 4),
            "semantic_density": round(density, 4),
            "gap_score": round(gap_score, 4),
            "example_paths": v["paths"],
            "suggestion": (
                f"Increase research in {para}/{domain}: add new source notes and link them to active Projects notes."
            ),
        })

    gaps = sorted(scored, key=lambda x: (x["gap_score"], -x["chunks"]), reverse=True)[:max(1, top_gaps)]

    para_coverage = {p: int(para_totals.get(p, 0)) for p in EXPECTED_PARA}
    missing_para = [p for p in EXPECTED_PARA if para_coverage.get(p, 0) == 0]
    if missing_para:
        for p in missing_para:
            gaps.append({
                "para": p,
                "domain": "ALL",
                "chunks": 0,
                "unique_files": 0,
                "avg_prana_score": 0.0,
                "avg_recency_score": 0.0,
                "semantic_density": 0.0,
                "gap_score": 1.0,
                "example_paths": [],
                "suggestion": f"Seed foundational notes for PARA bucket '{p}' to restore coverage balance.",
            })

    return {
        "summary": {
            "records_scanned": total,
            "index_dir": os.path.abspath(index_dir),
            "domains_analyzed": len(stats),
            "expected_para": list(EXPECTED_PARA),
        },
        "para_coverage": para_coverage,
        "gaps": gaps,
    }


def _print_human(report: dict) -> None:
    summary = report["summary"]
    print("Knowledge Gap Detection")
    print(f"- Records scanned: {summary['records_scanned']}")
    print(f"- Domains analyzed: {summary.get('domains_analyzed', 0)}")
    print("")

    print("PARA coverage:")
    for para, count in report.get("para_coverage", {}).items():
        print(f"  - {para}: {count} chunks")
    print("")

    print("Top knowledge gaps:")
    for i, row in enumerate(report.get("gaps", []), start=1):
        print(
            f"  {i}. {row['para']}/{row['domain']} "
            f"(gap={row['gap_score']}, density={row['semantic_density']}, chunks={row['chunks']})"
        )
        print(f"     Suggestion: {row['suggestion']}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect low-density knowledge domains in Meru metadata.")
    parser.add_argument("--index-dir", default=DEFAULT_INDEX_DIR, help="Index directory with meta.json/meta.jsonl.")
    parser.add_argument("--top-gaps", type=int, default=10, help="Number of top gaps to report.")
    parser.add_argument("--max-records", type=int, help="Optional cap for scanned records (faster sampling).")
    parser.add_argument("--json", action="store_true", help="Emit JSON output.")
    args = parser.parse_args()

    if not os.path.isdir(args.index_dir):
        print(f"Error: index dir not found: {args.index_dir}", file=os.sys.stderr)
        return 1

    report = build_gap_report(
        args.index_dir,
        top_gaps=max(1, int(args.top_gaps)),
        max_records=args.max_records if args.max_records and args.max_records > 0 else None,
    )

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        _print_human(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

