#!/usr/bin/env python3
"""
knowledge_summary.py — Build 3-paragraph topic summaries from top Meru chunks.

Issue #60 acceptance:
- Synthesizes a strict 3-paragraph summary using top retrieved chunks.
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


def query_top_chunks(
    topic: str,
    *,
    top_k: int,
    index_dir: str,
    query_script: str,
    python_bin: str,
    search_mode: str,
    exclude_archives: bool,
) -> list[dict]:
    cmd = [
        python_bin,
        query_script,
        "--index-dir",
        index_dir,
        "--query",
        topic,
        "--top",
        str(top_k),
        "--json",
        "--search-mode",
        search_mode,
    ]
    if exclude_archives:
        cmd.append("--exclude-archives")

    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or f"query_vault failed with code {proc.returncode}")
    return _parse_json_array(proc.stdout)


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", (text or "").lower())


def _split_sentences(text: str) -> list[str]:
    if not text:
        return []
    raw = re.split(r"(?<=[.!?])\s+", text.replace("\n", " "))
    out = []
    for s in raw:
        s = re.sub(r"\s+", " ", s).strip(" -\t\n\r")
        if len(s) < 40:
            continue
        # Skip low-signal URL/status dumps from crawler output.
        if len(re.findall(r"https?://", s)) >= 2:
            continue
        alpha_chars = sum(ch.isalpha() for ch in s)
        if alpha_chars / max(1, len(s)) < 0.45:
            continue
        if s.count("[") + s.count("]") > 6:
            continue
        if len(s) > 320:
            s = s[:317].rstrip() + "..."
        out.append(s)
    return out


def _score_sentence(sentence: str, query_tokens: set[str], chunk_score: float) -> float:
    stoks = set(_tokenize(sentence))
    overlap = len(stoks.intersection(query_tokens)) / max(1, len(query_tokens))
    lexical_density = min(len(stoks) / 24.0, 1.0)
    return (0.6 * overlap) + (0.25 * lexical_density) + (0.15 * max(0.0, chunk_score))


def _is_low_signal_chunk(hit: dict) -> bool:
    path = str(hit.get("path") or "").lower()
    if any(marker in path for marker in ("urls_by_section", "crawl_report", "sitemap", "robots")):
        return True

    text = str(hit.get("text") or "")
    if len(re.findall(r"https?://", text)) >= 4:
        return True

    quality = hit.get("quality_score")
    if quality is not None:
        try:
            if float(quality) < 0.45:
                return True
        except Exception:
            pass
    return False


def synthesize_three_paragraphs(topic: str, chunks: list[dict]) -> tuple[list[str], list[dict]]:
    query_tokens = set(_tokenize(topic))
    ranked: list[tuple[float, str, dict]] = []
    seen = set()

    for hit in chunks:
        if _is_low_signal_chunk(hit):
            continue
        score = float(hit.get("score") or 0.0)
        text = str(hit.get("text") or "")
        heading = str(hit.get("heading") or "")
        path = str(hit.get("path") or "")

        for sent in _split_sentences(text):
            key = sent.lower()
            if key in seen:
                continue
            seen.add(key)
            sent_score = _score_sentence(sent, query_tokens, score)
            if heading:
                sent_score += 0.03
            ranked.append((sent_score, sent, {"path": path, "heading": heading, "score": round(score, 4)}))

    ranked.sort(key=lambda x: x[0], reverse=True)

    selected_sentences = [s for _, s, _ in ranked[:9]]
    selected_evidence = [ev for _, _, ev in ranked[:9]]

    if len(selected_sentences) < 9:
        fallback = []
        for hit in chunks:
            snippet = re.sub(r"\s+", " ", str(hit.get("text") or "")).strip()
            if snippet:
                fallback.append(snippet[:240].rstrip() + ("..." if len(snippet) > 240 else ""))
            if len(fallback) >= (9 - len(selected_sentences)):
                break
        selected_sentences.extend(fallback)

    while len(selected_sentences) < 9:
        selected_sentences.append(f"The indexed material captures additional context for '{topic}' that should be reviewed in source notes.")

    p1 = " ".join(selected_sentences[0:3]).strip()
    p2 = " ".join(selected_sentences[3:6]).strip()
    p3 = " ".join(selected_sentences[6:9]).strip()

    # Ensure exactly three non-empty paragraphs.
    paragraphs = [p if p else f"Summary context for '{topic}' is available in the top retrieved chunks." for p in (p1, p2, p3)]

    return paragraphs, selected_evidence


def _render_text(topic: str, paragraphs: list[str], evidence: list[dict]) -> str:
    lines = [f"Knowledge Summary: {topic}", ""]
    lines.extend([paragraphs[0], "", paragraphs[1], "", paragraphs[2], "", "Top Evidence Chunks:"])
    for i, ev in enumerate(evidence[:8], start=1):
        heading = ev.get("heading") or "(no heading)"
        lines.append(f"- {i}. {ev.get('path', '')} :: {heading} (score={ev.get('score', 0)})")
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Synthesize a strict 3-paragraph knowledge summary from Meru index chunks.")
    parser.add_argument("topic", nargs="?", help="Topic to summarize.")
    parser.add_argument("--topic", dest="topic_opt", help="Topic to summarize (flag form).")
    parser.add_argument("--index-dir", default=DEFAULT_INDEX_DIR, help="Index directory path.")
    parser.add_argument("--query-script", default=DEFAULT_QUERY_SCRIPT, help="Path to query_vault.py.")
    parser.add_argument("--python-bin", default=DEFAULT_PYTHON, help="Python used to execute query_vault.py.")
    parser.add_argument("--top-chunks", type=int, default=12, help="Number of retrieved chunks to summarize.")
    parser.add_argument("--search-mode", choices=["vector", "hybrid", "lexical"], default="hybrid")
    parser.add_argument("--include-archives", action="store_true", help="Include Archives in retrieval pool.")
    parser.add_argument("--json", action="store_true", help="Emit JSON output.")
    parser.add_argument("--output", help="Write output to a file.")
    args = parser.parse_args()

    topic = (args.topic_opt or args.topic or "").strip()
    if not topic:
        print("Error: provide a topic (positional or --topic).", file=sys.stderr)
        return 1

    try:
        chunks = query_top_chunks(
            topic,
            top_k=max(3, int(args.top_chunks)),
            index_dir=os.path.abspath(args.index_dir),
            query_script=os.path.abspath(args.query_script),
            python_bin=os.path.abspath(args.python_bin),
            search_mode=args.search_mode,
            exclude_archives=not bool(args.include_archives),
        )
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    paragraphs, evidence = synthesize_three_paragraphs(topic, chunks)

    payload = {
        "topic": topic,
        "summary_paragraphs": paragraphs,
        "summary_paragraph_count": len(paragraphs),
        "retrieval": {
            "search_mode": args.search_mode,
            "top_chunks": len(chunks),
            "index_dir": os.path.abspath(args.index_dir),
            "exclude_archives": not bool(args.include_archives),
        },
        "evidence": evidence,
    }

    rendered = json.dumps(payload, indent=2, ensure_ascii=False) if args.json else _render_text(topic, paragraphs, evidence)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(rendered)
        print(f"Wrote summary to: {os.path.abspath(args.output)}")
    else:
        print(rendered)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
