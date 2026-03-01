#!/usr/bin/env python3
"""
recommend_tags_from_index.py — Auto-tag recommendations from similar indexed chunks.

Issue #56 acceptance:
- Suggestions are derived from nearest similar chunks in the existing Meru index.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from collections import defaultdict


VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(VAULT_ROOT, "_System", "memory")
DEFAULT_QUERY_SCRIPT = os.path.join(VAULT_ROOT, "_System", "scripts", "memory", "query_vault.py")
DEFAULT_PYTHON = os.path.join(VAULT_ROOT, ".venv-meru", "bin", "python3")


def _parse_json_array(stdout: str) -> list[dict]:
    start = stdout.find("[")
    end = stdout.rfind("]") + 1
    if start == -1 or end <= start:
        return []
    try:
        data = json.loads(stdout[start:end])
    except Exception:
        return []
    return data if isinstance(data, list) else []


def query_similar_chunks(
    text: str,
    *,
    top_k: int,
    index_dir: str,
    query_script: str,
    python_bin: str,
    search_mode: str,
) -> list[dict]:
    cmd = [
        python_bin,
        query_script,
        "--index-dir",
        index_dir,
        "--query",
        text,
        "--top",
        str(top_k),
        "--json",
        "--search-mode",
        search_mode,
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or f"query_vault failed with code {proc.returncode}")
    return _parse_json_array(proc.stdout)


def _extract_enneagram_type(record: dict) -> str | None:
    fields = [
        record.get("enneagram_type"),
        record.get("enneagram"),
        record.get("enneagram_uuid"),
    ]
    for value in fields:
        if value is None:
            continue
        m = re.search(r"([1-9])", str(value))
        if m:
            return m.group(1)
    return None


def _as_list(value) -> list[str]:
    if isinstance(value, list):
        return [str(v) for v in value if str(v).strip()]
    if value is None:
        return []
    val = str(value).strip()
    return [val] if val else []


def _top_items(score_map: dict[str, float], limit: int) -> list[dict]:
    total_all = sum(float(v) for v in score_map.values()) or 1.0
    items = sorted(score_map.items(), key=lambda kv: (-float(kv[1]), str(kv[0]).lower()))[:limit]
    return [
        {
            "value": key,
            "score": round(float(val), 4),
            "confidence": round(float(val) / total_all, 4),
        }
        for key, val in items
    ]


def _apply_threshold(
    rows: list[dict],
    *,
    min_confidence: float,
    category: str,
    abstain_mode: str,
) -> tuple[list[dict], list[dict]]:
    if abstain_mode == "off":
        return rows, []

    kept = []
    abstained = []
    for row in rows:
        conf = float(row.get("confidence") or 0.0)
        if conf >= min_confidence:
            kept.append(row)
            continue
        abstained.append(
            {
                "category": category,
                "value": row.get("value", ""),
                "confidence": round(conf, 4),
                "threshold": round(float(min_confidence), 4),
                "reason": "below_confidence_threshold",
            }
        )
    return kept, abstained


def _conflict_key(tag_value: str) -> str:
    val = str(tag_value or "").strip().lower()
    if not val:
        return ""
    if "/" in val:
        return val.split("/", 1)[0]
    normalized = re.sub(r"[^a-z0-9]+", "", val)
    if len(normalized) > 4 and normalized.endswith("s"):
        normalized = normalized[:-1]
    return normalized or val


def _resolve_tag_conflicts(tag_rows: list[dict]) -> tuple[list[dict], list[dict], list[dict]]:
    groups = defaultdict(list)
    for row in tag_rows:
        key = _conflict_key(str(row.get("value") or ""))
        groups[key].append(row)

    resolved = []
    conflict_resolution = []
    conflict_rejections = []
    for key, rows in groups.items():
        ordered = sorted(
            rows,
            key=lambda r: (
                -float(r.get("score") or 0.0),
                -float(r.get("confidence") or 0.0),
                str(r.get("value") or "").lower(),
            ),
        )
        winner = ordered[0]
        resolved.append(winner)
        if len(ordered) <= 1:
            continue

        rejected = [str(r.get("value") or "") for r in ordered[1:]]
        winner_score = float(winner.get("score") or 0.0)
        second_score = float(ordered[1].get("score") or 0.0)
        conflict_resolution.append(
            {
                "conflict_group": key,
                "winner": str(winner.get("value") or ""),
                "rejected": rejected,
                "reason": (
                    f"winner has strongest support in group "
                    f"(score={winner_score:.4f}, margin={max(0.0, winner_score - second_score):.4f})"
                ),
            }
        )
        for row in ordered[1:]:
            conflict_rejections.append(
                {
                    "category": "tags",
                    "value": row.get("value", ""),
                    "confidence": round(float(row.get("confidence") or 0.0), 4),
                    "threshold": None,
                    "reason": f"conflict_lost_to:{winner.get('value', '')}",
                }
            )

    resolved = sorted(
        resolved,
        key=lambda r: (
            -float(r.get("score") or 0.0),
            -float(r.get("confidence") or 0.0),
            str(r.get("value") or "").lower(),
        ),
    )
    return resolved, conflict_resolution, conflict_rejections


def build_recommendations(
    similar: list[dict],
    *,
    min_domain_confidence: float,
    min_enneagram_confidence: float,
    min_tag_confidence: float,
    abstain_mode: str,
) -> dict:
    domain_scores = defaultdict(float)
    enneagram_scores = defaultdict(float)
    tag_scores = defaultdict(float)
    evidence = []

    for idx, rec in enumerate(similar, start=1):
        score = float(rec.get("score") or 0.0)
        weight = max(score, 0.01)

        domain = str(rec.get("domain") or "").strip()
        if domain:
            domain_scores[domain] += weight

        etype = _extract_enneagram_type(rec)
        if etype:
            enneagram_scores[etype] += weight

        for tag in _as_list(rec.get("frontmatter_tags")):
            tag_scores[tag] += weight

        evidence.append({
            "rank": idx,
            "score": round(score, 4),
            "path": rec.get("path", ""),
            "heading": rec.get("heading", ""),
            "domain": domain,
            "enneagram_uuid": rec.get("enneagram_uuid", ""),
        })

    domain_rows = _top_items(domain_scores, limit=5)
    enneagram_rows = _top_items(enneagram_scores, limit=3)
    tag_rows = _top_items(tag_scores, limit=10)

    domain_rows, abstained_domains = _apply_threshold(
        domain_rows,
        min_confidence=max(0.0, min(1.0, float(min_domain_confidence))),
        category="domains",
        abstain_mode=abstain_mode,
    )
    enneagram_rows, abstained_enneagram = _apply_threshold(
        enneagram_rows,
        min_confidence=max(0.0, min(1.0, float(min_enneagram_confidence))),
        category="enneagram_types",
        abstain_mode=abstain_mode,
    )
    tag_rows, abstained_tags = _apply_threshold(
        tag_rows,
        min_confidence=max(0.0, min(1.0, float(min_tag_confidence))),
        category="tags",
        abstain_mode=abstain_mode,
    )
    tag_rows, conflict_resolution, conflict_rejections = _resolve_tag_conflicts(tag_rows)
    abstained_tags.extend(conflict_rejections)

    return {
        "recommended_domains": domain_rows,
        "recommended_enneagram_types": enneagram_rows,
        "recommended_tags": tag_rows,
        "thresholds": {
            "domain_confidence": round(float(min_domain_confidence), 4),
            "enneagram_confidence": round(float(min_enneagram_confidence), 4),
            "tag_confidence": round(float(min_tag_confidence), 4),
            "abstain_mode": abstain_mode,
        },
        "abstained": {
            "domains": abstained_domains,
            "enneagram_types": abstained_enneagram,
            "tags": abstained_tags,
        },
        "conflict_resolution": conflict_resolution,
        "evidence": evidence,
    }


def _print_human(result: dict) -> None:
    print("Auto-tag Recommendations")
    print(f"- Input mode: {result['input']['mode']}")
    print(f"- Similar chunks used: {result['input']['similar_chunks']}")
    thresholds = result["recommendations"].get("thresholds", {})
    if thresholds:
        print(
            "- Thresholds: "
            f"domain>={thresholds.get('domain_confidence', 0)}, "
            f"enneagram>={thresholds.get('enneagram_confidence', 0)}, "
            f"tag>={thresholds.get('tag_confidence', 0)}, "
            f"abstain_mode={thresholds.get('abstain_mode', 'report')}"
        )
    print("")

    print("Domain suggestions:")
    for row in result["recommendations"]["recommended_domains"]:
        print(f"  - {row['value']} (score={row['score']}, confidence={row['confidence']})")
    if not result["recommendations"]["recommended_domains"]:
        print("  - [none]")

    print("\nEnneagram suggestions:")
    for row in result["recommendations"]["recommended_enneagram_types"]:
        print(f"  - Type {row['value']} (score={row['score']}, confidence={row['confidence']})")
    if not result["recommendations"]["recommended_enneagram_types"]:
        print("  - [none]")

    print("\nTag suggestions:")
    for row in result["recommendations"]["recommended_tags"]:
        print(f"  - {row['value']} (score={row['score']}, confidence={row['confidence']})")
    if not result["recommendations"]["recommended_tags"]:
        print("  - [none]")

    conflicts = result["recommendations"].get("conflict_resolution") or []
    if conflicts:
        print("\nConflict resolution:")
        for row in conflicts:
            rejected = ", ".join(row.get("rejected") or [])
            print(f"  - group={row.get('conflict_group')} winner={row.get('winner')} rejected=[{rejected}]")

    abstained = result["recommendations"].get("abstained") or {}
    total_abstained = sum(len(v) for v in abstained.values() if isinstance(v, list))
    if total_abstained:
        print(f"\nAbstained suggestions: {total_abstained}")
        for key in ("domains", "enneagram_types", "tags"):
            rows = abstained.get(key) or []
            if not rows:
                continue
            print(f"  - {key}: {len(rows)}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Recommend domain/Enneagram/tags from similar chunks.")
    parser.add_argument("--text", help="Raw note text to analyze.")
    parser.add_argument("--file", help="Path to note file to analyze.")
    parser.add_argument("--top", type=int, default=20, help="Top similar chunks to inspect (default: 20).")
    parser.add_argument(
        "--search-mode",
        default="hybrid",
        choices=["vector", "hybrid", "lexical"],
        help="Retrieval mode passed to query_vault.",
    )
    parser.add_argument("--index-dir", default=DEFAULT_INDEX_DIR, help="Index directory (vault.faiss/meta.json).")
    parser.add_argument("--query-script", default=DEFAULT_QUERY_SCRIPT, help="Path to query_vault.py.")
    parser.add_argument("--python-bin", default=DEFAULT_PYTHON, help="Python binary used to run query_vault.")
    parser.add_argument("--min-domain-confidence", type=float, default=0.0, help="Minimum confidence for domain suggestions.")
    parser.add_argument("--min-enneagram-confidence", type=float, default=0.0, help="Minimum confidence for Enneagram suggestions.")
    parser.add_argument("--min-tag-confidence", type=float, default=0.0, help="Minimum confidence for tag suggestions.")
    parser.add_argument(
        "--abstain-mode",
        choices=["off", "report"],
        default="report",
        help="When enabled, below-threshold suggestions are excluded and returned in abstained output.",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON output.")
    args = parser.parse_args()

    if not args.text and not args.file:
        print("Error: provide --text or --file", file=sys.stderr)
        return 1
    if args.text and args.file:
        print("Error: use only one of --text or --file", file=sys.stderr)
        return 1

    mode = "text"
    payload = args.text or ""
    if args.file:
        mode = "file"
        path = os.path.abspath(args.file)
        if not os.path.exists(path):
            print(f"Error: file not found: {path}", file=sys.stderr)
            return 1
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            payload = f.read()

    try:
        similar = query_similar_chunks(
            payload,
            top_k=max(1, int(args.top)),
            index_dir=args.index_dir,
            query_script=args.query_script,
            python_bin=args.python_bin,
            search_mode=args.search_mode,
        )
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    result = {
        "input": {
            "mode": mode,
            "similar_chunks": len(similar),
            "search_mode": args.search_mode,
            "index_dir": os.path.abspath(args.index_dir),
        },
        "recommendations": build_recommendations(
            similar,
            min_domain_confidence=float(args.min_domain_confidence),
            min_enneagram_confidence=float(args.min_enneagram_confidence),
            min_tag_confidence=float(args.min_tag_confidence),
            abstain_mode=args.abstain_mode,
        ),
    }

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        _print_human(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
