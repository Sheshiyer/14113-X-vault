#!/usr/bin/env python3
"""Strict quality gate for content briefs/drafts before approval."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except Exception:  # pragma: no cover
    yaml = None

VAULT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_BRIEF_DIR = (
    VAULT_ROOT / "01-Projects" / "Content-Engine" / "_processing" / "content-briefs"
)


class GateError(Exception):
    """Raised for usage and recoverable processing errors."""


class GateArgumentParser(argparse.ArgumentParser):
    """Argument parser that raises GateError instead of exiting with code 2."""

    def error(self, message: str) -> None:  # pragma: no cover - exercised via CLI
        raise GateError(message)


def _resolve_path(raw_path: str, base_dir: Path | None = None) -> Path:
    p = Path(os.path.expanduser(raw_path))
    if p.is_absolute():
        return p.resolve()
    if base_dir is not None:
        return (base_dir / p).resolve()
    return p.resolve()


def _read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")


def _normalize_list_count(value: Any) -> int:
    if value is None:
        return 0
    if isinstance(value, list):
        return len(value)
    if isinstance(value, tuple | set):
        return len(value)
    if isinstance(value, dict):
        return len(value)
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return 0
        if stripped == "[]":
            return 0
        if stripped.startswith("[") and stripped.endswith("]"):
            inner = stripped[1:-1].strip()
            if not inner:
                return 0
            return len([chunk for chunk in inner.split(",") if chunk.strip()])
        return 1
    return 1


def _extract_counts_from_brief_dict(data: dict[str, Any]) -> dict[str, int] | None:
    lattice: dict[str, Any] | None = None
    source_lattice = data.get("source_lattice")
    if isinstance(source_lattice, dict):
        lattice = source_lattice

    sources = data.get("sources")
    if lattice is None and isinstance(sources, dict):
        lattice = sources

    if lattice is None:
        return None

    return {
        "areas": _normalize_list_count(lattice.get("areas")),
        "resources": _normalize_list_count(lattice.get("resources")),
    }


def _extract_counts_from_yaml_like_text(text: str) -> dict[str, int] | None:
    lines = text.splitlines()
    counts: dict[str, int | None] = {"areas": None, "resources": None}

    idx = 0
    while idx < len(lines):
        line = lines[idx]
        match = re.match(r"^(\s*)(areas|resources)\s*:\s*(.*)$", line)
        if not match:
            idx += 1
            continue

        indent = len(match.group(1))
        key = match.group(2)
        remainder = match.group(3).strip()

        if remainder:
            if remainder.startswith("[") and remainder.endswith("]"):
                inner = remainder[1:-1].strip()
                value = 0 if not inner else len([part for part in inner.split(",") if part.strip()])
            else:
                value = 1
            counts[key] = value
            idx += 1
            continue

        value = 0
        probe = idx + 1
        while probe < len(lines):
            next_line = lines[probe]
            if not next_line.strip():
                probe += 1
                continue

            next_indent = len(re.match(r"^(\s*)", next_line).group(1))
            if next_indent <= indent:
                break
            if re.match(r"^\s*-\s+\S", next_line):
                value += 1
            probe += 1

        counts[key] = value
        idx += 1

    if counts["areas"] is None and counts["resources"] is None:
        return None

    return {
        "areas": int(counts["areas"] or 0),
        "resources": int(counts["resources"] or 0),
    }


def _extract_counts_from_brief(path: Path) -> tuple[dict[str, int], str]:
    text = _read_text(path)

    if yaml is not None:
        try:
            parsed = yaml.safe_load(text)
            if isinstance(parsed, dict):
                counts = _extract_counts_from_brief_dict(parsed)
                if counts is not None:
                    return counts, "yaml"
        except Exception:
            pass

    fallback = _extract_counts_from_yaml_like_text(text)
    if fallback is not None:
        return fallback, "text-fallback"

    raise GateError("Could not parse Areas/Resources counts from brief")


def _parse_frontmatter(markdown_text: str) -> dict[str, Any]:
    lines = markdown_text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}

    end_idx = None
    for idx in range(1, len(lines)):
        if lines[idx].strip() == "---":
            end_idx = idx
            break

    if end_idx is None:
        return {}

    frontmatter_raw = "\n".join(lines[1:end_idx])

    if yaml is not None:
        try:
            parsed = yaml.safe_load(frontmatter_raw)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            pass

    parsed: dict[str, Any] = {}
    for line in frontmatter_raw.splitlines():
        match = re.match(r"^\s*brief_path\s*:\s*(.+)\s*$", line)
        if match:
            parsed["brief_path"] = match.group(1).strip().strip("\"'")
    return parsed


def _extract_counts_from_draft_text(text: str) -> dict[str, int]:
    lines = text.splitlines()
    counts = {"areas": 0, "resources": 0}

    section_for_key = {"Areas": "areas", "Resources": "resources"}
    idx = 0
    while idx < len(lines):
        line = lines[idx].strip()
        heading_match = re.match(r"^\*\*(Areas|Resources)\*\*\s*:\s*$", line)
        if not heading_match:
            idx += 1
            continue

        key = section_for_key[heading_match.group(1)]
        probe = idx + 1
        while probe < len(lines):
            candidate = lines[probe].strip()
            if re.match(r"^\*\*(Areas|Resources|Projects)\*\*\s*:\s*$", candidate):
                break
            if candidate.startswith("### ") or candidate.startswith("## "):
                break
            if candidate.startswith("- "):
                counts[key] += 1
            probe += 1

        idx = probe

    return counts


def _find_processing_root(path: Path) -> Path | None:
    for candidate in [path.parent, *path.parents]:
        if candidate.name == "_processing":
            return candidate
    return None


def _draft_slug(draft_path: Path) -> str:
    slug = draft_path.stem
    if slug.endswith("-draft"):
        slug = slug[:-6]
    return slug


def _resolve_companion_brief(draft_path: Path, frontmatter: dict[str, Any]) -> tuple[Path | None, str | None]:
    draft_dir = draft_path.parent

    brief_path_raw = frontmatter.get("brief_path")
    if isinstance(brief_path_raw, str) and brief_path_raw.strip():
        for candidate in (
            _resolve_path(brief_path_raw, draft_dir),
            _resolve_path(brief_path_raw, VAULT_ROOT),
        ):
            if candidate.exists() and candidate.is_file():
                return candidate, "frontmatter:brief_path"

    slug = _draft_slug(draft_path)
    search_roots: list[Path] = []

    processing_root = _find_processing_root(draft_path)
    if processing_root is not None:
        search_roots.append(processing_root / "content-briefs")

    if DEFAULT_BRIEF_DIR not in search_roots:
        search_roots.append(DEFAULT_BRIEF_DIR)

    for root in search_roots:
        if not root.exists() or not root.is_dir():
            continue

        for ext in (".yaml", ".yml"):
            direct = root / f"{slug}{ext}"
            if direct.is_file():
                return direct, f"slug:{slug}"

        matches = [*root.rglob(f"{slug}.yaml"), *root.rglob(f"{slug}.yml")]
        if len(matches) == 1:
            return matches[0], f"slug:{slug}"
        if len(matches) > 1:
            raise GateError(
                f"Multiple companion briefs matched slug '{slug}': "
                + ", ".join(str(p) for p in matches)
            )

    return None, None


def _move_draft_to_approved(draft_path: Path) -> Path:
    parts = list(draft_path.parts)
    try:
        index = parts.index("_processing")
    except ValueError as exc:
        raise GateError("--approve-move requires draft path to be under an '_processing' directory") from exc

    parts[index] = "_approved"
    destination = Path(*parts)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(draft_path), str(destination))
    return destination


def _build_parser() -> argparse.ArgumentParser:
    parser = GateArgumentParser(
        description="Strict quality gate for content briefs and drafts"
    )
    parser.add_argument("--brief", help="Path to brief YAML")
    parser.add_argument("--draft", help="Path to draft Markdown")
    parser.add_argument(
        "--min-areas",
        type=int,
        default=2,
        help="Minimum required Areas lattice count (default: 2)",
    )
    parser.add_argument(
        "--min-resources",
        type=int,
        default=1,
        help="Minimum required Resources lattice count (default: 1)",
    )
    parser.add_argument(
        "--approve-move",
        action="store_true",
        help="If gate passes and draft provided, move draft from _processing to _approved",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON output")
    return parser


def _print_human(result: dict[str, Any]) -> None:
    print(f"Quality Gate: {result['status'].upper()}")
    print(f"Areas: {result['counts']['areas']} (min {result['thresholds']['min_areas']})")
    print(
        "Resources: "
        f"{result['counts']['resources']} (min {result['thresholds']['min_resources']})"
    )
    print(f"Counts Source: {result['counts']['source']}")

    print(f"Brief: {result['inputs'].get('brief') or 'not provided'}")
    print(f"Draft: {result['inputs'].get('draft') or 'not provided'}")

    resolution = result.get("companion_resolution")
    if resolution:
        print(f"Companion Brief Resolution: {resolution}")

    approve = result.get("approve_move", {})
    if approve.get("requested"):
        if approve.get("moved"):
            print(f"Approve Move: moved to {approve.get('destination')}")
        else:
            print(f"Approve Move: skipped ({approve.get('reason')})")


def run(argv: list[str]) -> int:
    try:
        parser = _build_parser()
        args = parser.parse_args(argv)

        if not args.brief and not args.draft:
            raise GateError("At least one input is required: --brief and/or --draft")

        if args.min_areas < 0 or args.min_resources < 0:
            raise GateError("--min-areas and --min-resources must be non-negative")

        brief_path: Path | None = None
        draft_path: Path | None = None

        if args.brief:
            brief_path = _resolve_path(args.brief)
            if not brief_path.is_file():
                raise GateError(f"Brief not found: {brief_path}")

        frontmatter: dict[str, Any] = {}
        draft_text: str | None = None
        companion_resolution: str | None = None

        if args.draft:
            draft_path = _resolve_path(args.draft)
            if not draft_path.is_file():
                raise GateError(f"Draft not found: {draft_path}")
            draft_text = _read_text(draft_path)
            frontmatter = _parse_frontmatter(draft_text)

        if brief_path is None and draft_path is not None:
            resolved, reason = _resolve_companion_brief(draft_path, frontmatter)
            if resolved is not None:
                brief_path = resolved
                companion_resolution = reason

        counts: dict[str, int] | None = None
        counts_source = "unknown"
        brief_parse_mode: str | None = None

        if brief_path is not None:
            try:
                counts, brief_parse_mode = _extract_counts_from_brief(brief_path)
                counts_source = "brief"
            except GateError:
                counts = None

        draft_counts: dict[str, int] | None = None
        if draft_text is not None:
            draft_counts = _extract_counts_from_draft_text(draft_text)
            if counts is None:
                counts = draft_counts
                counts_source = "draft"

        if counts is None:
            raise GateError("Unable to determine Areas/Resources counts from provided input(s)")

        areas_ok = counts["areas"] >= args.min_areas
        resources_ok = counts["resources"] >= args.min_resources
        passed = areas_ok and resources_ok

        move_result: dict[str, Any] = {
            "requested": bool(args.approve_move),
            "moved": False,
            "destination": None,
            "reason": None,
        }

        if args.approve_move:
            if draft_path is None:
                raise GateError("--approve-move requires --draft")

            if passed:
                destination = _move_draft_to_approved(draft_path)
                move_result["moved"] = True
                move_result["destination"] = str(destination)
                move_result["reason"] = "gate_passed"
            else:
                move_result["reason"] = "gate_failed"

        result = {
            "status": "pass" if passed else "fail",
            "exit_code": 0 if passed else 2,
            "inputs": {
                "brief": str(brief_path) if brief_path is not None else None,
                "draft": str(draft_path) if draft_path is not None else None,
            },
            "companion_resolution": companion_resolution,
            "counts": {
                "areas": counts["areas"],
                "resources": counts["resources"],
                "source": counts_source,
                "brief_parse_mode": brief_parse_mode,
                "draft_counts": draft_counts,
            },
            "thresholds": {
                "min_areas": args.min_areas,
                "min_resources": args.min_resources,
            },
            "checks": {
                "areas": areas_ok,
                "resources": resources_ok,
            },
            "approve_move": move_result,
        }

        if args.json:
            print(json.dumps(result, indent=2, sort_keys=True))
        else:
            _print_human(result)

        return int(result["exit_code"])

    except GateError as exc:
        args = locals().get("args")
        error = {"status": "error", "exit_code": 1, "error": str(exc)}
        if getattr(args, "json", False):
            print(json.dumps(error, indent=2, sort_keys=True))
        else:
            print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(run(sys.argv[1:]))
