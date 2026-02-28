#!/usr/bin/env python3
"""
review_brief_lattice.py — Human-in-the-loop brief curation before draft generation.

Usage:
  python review_brief_lattice.py --brief path/to/brief.yaml
  python review_brief_lattice.py --brief path/to/brief.yaml --output curated.yaml
"""

from __future__ import annotations

import argparse
import os
import sys

import yaml


def _parse_id_selection(raw: str, valid_ids: set[int]) -> set[int]:
    picked: set[int] = set()
    cleaned = (raw or "").strip()
    if not cleaned:
        return picked

    for token in cleaned.split(","):
        token = token.strip()
        if not token:
            continue
        try:
            idx = int(token)
        except ValueError:
            continue
        if idx in valid_ids:
            picked.add(idx)
    return picked


def _flatten_sources(source_lattice: dict) -> list[dict]:
    rows = []
    row_id = 1
    for category, items in (source_lattice or {}).items():
        if not isinstance(items, list):
            continue
        for item in items:
            if not isinstance(item, dict):
                item = {"path": str(item)}
            rows.append({
                "id": row_id,
                "category": category,
                "item": item,
            })
            row_id += 1
    return rows


def _filter_source_lattice(source_lattice: dict, remove_ids: set[int]) -> dict:
    filtered = {}
    row_id = 1
    for category, items in (source_lattice or {}).items():
        if not isinstance(items, list):
            filtered[category] = items
            continue
        kept = []
        for item in items:
            if row_id not in remove_ids:
                kept.append(item)
            row_id += 1
        filtered[category] = kept
    return filtered


def _print_sources(rows: list[dict]) -> None:
    print("\nSource lattice candidates:")
    if not rows:
        print("  [none]")
        return
    for row in rows:
        item = row["item"]
        path = str(item.get("path", ""))
        heading = str(item.get("heading", ""))
        score = item.get("score")
        score_txt = f"{float(score):.4f}" if isinstance(score, (int, float)) else str(score or "-")
        print(f"  [{row['id']}] ({row['category']}) {path} | heading={heading or '-'} | score={score_txt}")


def _print_evidence(evidence_chunks: list[dict]) -> None:
    print("\nEvidence chunk candidates:")
    if not evidence_chunks:
        print("  [none]")
        return
    for idx, ec in enumerate(evidence_chunks, start=1):
        path = str(ec.get("path", ""))
        heading = str(ec.get("heading", ""))
        chunk = " ".join(str(ec.get("chunk", "")).split())
        preview = chunk[:120] + ("..." if len(chunk) > 120 else "")
        print(f"  [{idx}] {path} | heading={heading or '-'}")
        print(f"      {preview}")


def _confirm(prompt: str, default_yes: bool = True) -> bool:
    suffix = " [Y/n]: " if default_yes else " [y/N]: "
    raw = input(prompt + suffix).strip().lower()
    if not raw:
        return default_yes
    return raw in {"y", "yes"}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Review and curate source lattice/evidence chunks before draft generation."
    )
    parser.add_argument("--brief", required=True, help="Path to brief YAML")
    parser.add_argument("--output", help="Optional output path for curated brief")
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip final confirmation and save directly",
    )
    args = parser.parse_args()

    brief_path = os.path.abspath(args.brief)
    if not os.path.exists(brief_path):
        print(f"Error: brief not found: {brief_path}", file=sys.stderr)
        return 1

    with open(brief_path, "r", encoding="utf-8") as f:
        brief = yaml.safe_load(f) or {}
    if not isinstance(brief, dict):
        print("Error: brief YAML must be a mapping/object.", file=sys.stderr)
        return 1

    source_lattice = brief.get("source_lattice", {}) or {}
    evidence_chunks = brief.get("evidence_chunks", []) or []

    source_rows = _flatten_sources(source_lattice)
    _print_sources(source_rows)
    src_remove = _parse_id_selection(
        input("\nEnter source IDs to remove (comma-separated, blank=keep all): "),
        {row["id"] for row in source_rows},
    )

    _print_evidence(evidence_chunks)
    ev_remove = _parse_id_selection(
        input("\nEnter evidence IDs to remove (comma-separated, blank=keep all): "),
        set(range(1, len(evidence_chunks) + 1)),
    )

    curated_source_lattice = _filter_source_lattice(source_lattice, src_remove)
    curated_evidence = [
        ec for idx, ec in enumerate(evidence_chunks, start=1)
        if idx not in ev_remove
    ]

    print("\nCuration summary:")
    print(f"  Sources: {len(source_rows) - len(src_remove)} kept / {len(source_rows)} total")
    print(f"  Evidence: {len(curated_evidence)} kept / {len(evidence_chunks)} total")

    output_path = os.path.abspath(args.output) if args.output else brief_path
    if not args.yes:
        if not _confirm(f"Save curated brief to {output_path}?"):
            print("Aborted without changes.")
            return 0

    brief["source_lattice"] = curated_source_lattice
    brief["evidence_chunks"] = curated_evidence
    brief["curation"] = {
        "reviewed": True,
        "sources_removed": sorted(src_remove),
        "evidence_removed": sorted(ev_remove),
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        yaml.dump(brief, f, sort_keys=False, allow_unicode=True)

    print(f"✅ Curated brief saved: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

