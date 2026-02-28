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


def build_recommendations(similar: list[dict]) -> dict:
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

    def top_items(score_map: dict[str, float], limit: int) -> list[dict]:
        items = sorted(score_map.items(), key=lambda kv: kv[1], reverse=True)[:limit]
        total = sum(v for _, v in items) or 1.0
        return [
            {
                "value": key,
                "score": round(val, 4),
                "confidence": round(val / total, 4),
            }
            for key, val in items
        ]

    return {
        "recommended_domains": top_items(domain_scores, limit=5),
        "recommended_enneagram_types": top_items(enneagram_scores, limit=3),
        "recommended_tags": top_items(tag_scores, limit=10),
        "evidence": evidence,
    }


def _print_human(result: dict) -> None:
    print("Auto-tag Recommendations")
    print(f"- Input mode: {result['input']['mode']}")
    print(f"- Similar chunks used: {result['input']['similar_chunks']}")
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
        "recommendations": build_recommendations(similar),
    }

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        _print_human(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

