#!/usr/bin/env python3
"""
push_substack_draft.py — Push approved markdown to Substack draft API.

Environment:
  SUBSTACK_API_URL      Full drafts endpoint URL (preferred)
  SUBSTACK_PUBLICATION  Publication slug (used to derive endpoint when API URL omitted)
  SUBSTACK_API_TOKEN    Bearer token for authenticated draft creation
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path


def infer_title(markdown_text: str, fallback: str) -> str:
    for line in markdown_text.splitlines():
        cleaned = line.strip()
        if cleaned.startswith("# "):
            return cleaned[2:].strip()
    return fallback


def resolve_api_url(cli_url: str | None, publication: str | None) -> str:
    if cli_url:
        return cli_url

    env_url = os.environ.get("SUBSTACK_API_URL", "").strip()
    if env_url:
        return env_url

    pub = publication or os.environ.get("SUBSTACK_PUBLICATION", "").strip()
    if pub:
        return f"https://{pub}.substack.com/api/v1/drafts"

    raise ValueError(
        "Missing Substack API endpoint. Set --api-url or SUBSTACK_API_URL "
        "(or provide --publication / SUBSTACK_PUBLICATION)."
    )


def build_payload(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    title = infer_title(text, fallback=path.stem.replace("-", " ").strip().title())
    return {
        "title": title,
        "body_markdown": text,
        "is_draft": True,
        "source_path": str(path),
    }


def post_json(url: str, payload: dict, token: str | None) -> dict:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url=url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=45) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        return json.loads(raw) if raw else {}


def main() -> int:
    parser = argparse.ArgumentParser(description="Push _approved markdown to Substack as draft.")
    parser.add_argument("--file", required=True, help="Markdown file under _approved to upload")
    parser.add_argument("--api-url", help="Substack draft endpoint URL")
    parser.add_argument("--publication", help="Substack publication slug (fallback URL builder)")
    parser.add_argument("--token", help="Bearer token (fallback: SUBSTACK_API_TOKEN)")
    parser.add_argument("--dry-run", action="store_true", help="Print request payload and exit")
    args = parser.parse_args()

    file_path = Path(args.file).expanduser().resolve()
    if not file_path.exists() or not file_path.is_file():
        print(f"Error: file not found: {file_path}", file=sys.stderr)
        return 1

    try:
        api_url = resolve_api_url(args.api_url, args.publication)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    token = args.token or os.environ.get("SUBSTACK_API_TOKEN", "").strip() or None
    payload = build_payload(file_path)

    if args.dry_run:
        preview = dict(payload)
        if len(preview.get("body_markdown", "")) > 500:
            preview["body_markdown"] = preview["body_markdown"][:500] + "... [truncated]"
        print(json.dumps({
            "api_url": api_url,
            "auth": "bearer" if token else "none",
            "payload": preview,
        }, indent=2, ensure_ascii=False))
        return 0

    try:
        result = post_json(api_url, payload, token)
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        print(f"HTTPError {exc.code}: {error_body}", file=sys.stderr)
        return 2
    except urllib.error.URLError as exc:
        print(f"URLError: {exc}", file=sys.stderr)
        return 2
    except Exception as exc:  # pragma: no cover
        print(f"Unexpected upload error: {exc}", file=sys.stderr)
        return 2

    print(json.dumps({
        "status": "uploaded",
        "file": str(file_path),
        "api_url": api_url,
        "response": result,
    }, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

