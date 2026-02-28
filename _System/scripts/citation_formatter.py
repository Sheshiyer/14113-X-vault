#!/usr/bin/env python3
"""
citation_formatter.py — Format brief sources/evidence into bibliography lines.
"""

import os


def _normalize_path(path):
    if not path:
        return ""
    return os.path.normpath(str(path)).replace("\\", "/").lower()


def _coerce_score(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _clean_heading(value):
    if value is None:
        return ""
    return " ".join(str(value).split()).strip()


def _infer_title(path):
    filename = os.path.basename(str(path))
    stem, _ = os.path.splitext(filename)
    return stem.replace("_", " ").replace("-", " ").strip() or "Untitled Source"


def _iter_source_lattice_entries(brief):
    source_lattice = brief.get("source_lattice", {})
    if not isinstance(source_lattice, dict):
        return

    for sources in source_lattice.values():
        if not isinstance(sources, list):
            continue
        for source in sources:
            if isinstance(source, dict):
                yield {
                    "path": source.get("path"),
                    "heading": source.get("heading"),
                    "score": source.get("score"),
                }
            else:
                yield {"path": source}


def _iter_legacy_source_entries(brief):
    sources = brief.get("sources", {})
    if not isinstance(sources, dict):
        return

    for source_list in sources.values():
        if not isinstance(source_list, list):
            continue
        for source in source_list:
            if isinstance(source, dict):
                yield {
                    "path": source.get("path"),
                    "heading": source.get("heading"),
                    "score": source.get("score"),
                }
            else:
                yield {"path": source}


def _iter_evidence_entries(brief):
    for entry in brief.get("evidence_chunks", []) or []:
        if isinstance(entry, dict):
            yield {
                "path": entry.get("path"),
                "heading": entry.get("heading"),
            }


def build_bibliography_lines(brief):
    """
    Build academic-style bibliography lines from source lattice, legacy sources, and evidence.
    Deduplicates entries by normalized path.
    """
    by_path = {}

    all_entries = []
    all_entries.extend(list(_iter_source_lattice_entries(brief) or []))
    all_entries.extend(list(_iter_legacy_source_entries(brief) or []))
    all_entries.extend(list(_iter_evidence_entries(brief) or []))

    for entry in all_entries:
        path = entry.get("path")
        normalized = _normalize_path(path)
        if not normalized:
            continue

        record = by_path.setdefault(
            normalized,
            {
                "path": str(path),
                "heading": "",
                "score": None,
            },
        )

        heading = _clean_heading(entry.get("heading"))
        if heading and not record["heading"]:
            record["heading"] = heading

        score = _coerce_score(entry.get("score"))
        if score is not None:
            if record["score"] is None or score > record["score"]:
                record["score"] = score

    bibliography_lines = []
    for key in sorted(by_path.keys()):
        record = by_path[key]
        title = _infer_title(record["path"])

        parts = [f"*{title}*.", "(n.d.)."]
        if record["heading"]:
            parts.append(f'Section: "{record["heading"]}".')
        if record["score"] is not None:
            parts.append(f"Relevance score: {record['score']:.4f}.")
        parts.append(f"Source: `{record['path']}`.")

        bibliography_lines.append("- " + " ".join(parts))

    return bibliography_lines
