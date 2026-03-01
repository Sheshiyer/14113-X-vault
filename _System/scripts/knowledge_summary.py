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


VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(VAULT_ROOT, "_System", "memory")
DEFAULT_QUERY_SCRIPT = os.path.join(VAULT_ROOT, "_System", "scripts", "memory", "query_vault.py")
DEFAULT_PYTHON = os.path.join(VAULT_ROOT, ".venv-meru", "bin", "python3")
TEMPLATE_CHOICES = ("research", "executive", "action")
TEMPLATE_SECTION_TITLES = {
    "research": ["Research Context", "Signal Synthesis", "Implications"],
    "executive": ["Executive Snapshot", "Key Signals", "Decision Implications"],
    "action": ["Situation", "Recommended Actions", "Risks and Follow-ups"],
}


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


def _build_trace(hit: dict, *, score: float) -> dict:
    return {
        "path": str(hit.get("path") or ""),
        "heading": str(hit.get("heading") or ""),
        "score": round(float(score), 4),
        "chunk_index": hit.get("chunk_index"),
        "para": str(hit.get("para") or ""),
        "domain": str(hit.get("domain") or ""),
        "file_format": str(hit.get("file_format") or ""),
        "page": hit.get("page"),
        "chapter": hit.get("chapter"),
        "doc_title": hit.get("doc_title"),
        "modified_at": hit.get("modified_at"),
    }


def _select_summary_sentences(topic: str, chunks: list[dict], *, target_sentences: int = 9) -> list[dict]:
    query_tokens = set(_tokenize(topic))
    ranked: list[tuple[float, str, dict]] = []
    seen: set[str] = set()

    for hit in chunks:
        if _is_low_signal_chunk(hit):
            continue
        score = float(hit.get("score") or 0.0)
        text = str(hit.get("text") or "")
        heading = str(hit.get("heading") or "").strip()
        trace = _build_trace(hit, score=score)

        for sent in _split_sentences(text):
            key = sent.lower()
            if key in seen:
                continue
            seen.add(key)
            sent_score = _score_sentence(sent, query_tokens, score)
            if heading:
                sent_score += 0.03
            ranked.append((sent_score, sent, trace))

    ranked.sort(key=lambda x: x[0], reverse=True)

    selected_rows = [{"text": s, "trace": dict(ev)} for _, s, ev in ranked[:target_sentences]]

    if len(selected_rows) < target_sentences:
        for hit in chunks:
            snippet = re.sub(r"\s+", " ", str(hit.get("text") or "")).strip()
            if not snippet:
                continue
            selected_rows.append(
                {
                    "text": snippet[:240].rstrip() + ("..." if len(snippet) > 240 else ""),
                    "trace": _build_trace(hit, score=float(hit.get("score") or 0.0)),
                }
            )
            if len(selected_rows) >= target_sentences:
                break

    while len(selected_rows) < target_sentences:
        selected_rows.append(
            {
                "text": f"The indexed material captures additional context for '{topic}' that should be reviewed in source notes.",
                "trace": {},
            }
        )
    return selected_rows


def _compile_provenance(selected_rows: list[dict]) -> tuple[list[dict], list[list[str]]]:
    source_ids: dict[tuple, str] = {}
    source_traces: list[dict] = []
    paragraph_citations: list[set[str]] = [set(), set(), set()]

    for idx, row in enumerate(selected_rows):
        para_idx = min(2, idx // 3)
        trace = row.get("trace") if isinstance(row, dict) else None
        if not isinstance(trace, dict):
            continue
        path = str(trace.get("path") or "").strip()
        if not path:
            continue
        key = (
            path,
            str(trace.get("heading") or "").strip(),
            trace.get("chunk_index"),
            str(trace.get("page") or ""),
            str(trace.get("chapter") or ""),
        )
        source_id = source_ids.get(key)
        if source_id is None:
            source_id = f"S{len(source_ids) + 1:02d}"
            source_ids[key] = source_id
            source_trace = dict(trace)
            source_trace["source_id"] = source_id
            source_traces.append(source_trace)
        paragraph_citations[para_idx].add(source_id)

    return source_traces, [sorted(c) for c in paragraph_citations]


def synthesize_summary(topic: str, chunks: list[dict], *, template: str = "research") -> dict:
    selected_rows = _select_summary_sentences(topic, chunks, target_sentences=9)
    selected_sentences = [str(r.get("text") or "").strip() for r in selected_rows]
    p1 = " ".join(selected_sentences[0:3]).strip()
    p2 = " ".join(selected_sentences[3:6]).strip()
    p3 = " ".join(selected_sentences[6:9]).strip()

    paragraphs = [
        p if p else f"Summary context for '{topic}' is available in the top retrieved chunks."
        for p in (p1, p2, p3)
    ]

    source_traces, paragraph_citations = _compile_provenance(selected_rows)
    selected_template = template if template in TEMPLATE_CHOICES else "research"
    section_titles = TEMPLATE_SECTION_TITLES.get(selected_template, TEMPLATE_SECTION_TITLES["research"])
    sections = []
    for i in range(3):
        sections.append(
            {
                "id": f"section_{i + 1}",
                "title": section_titles[i],
                "text": paragraphs[i],
                "citations": paragraph_citations[i],
            }
        )

    evidence = [dict(r.get("trace") or {}) for r in selected_rows if isinstance(r, dict) and r.get("trace")]
    return {
        "template": selected_template,
        "summary_paragraphs": paragraphs,
        "summary_paragraph_count": len(paragraphs),
        "sections": sections,
        "source_traces": source_traces,
        "evidence": evidence[:9],
    }


def synthesize_three_paragraphs(topic: str, chunks: list[dict]) -> tuple[list[str], list[dict]]:
    summary = synthesize_summary(topic, chunks, template="research")
    return list(summary["summary_paragraphs"]), list(summary["evidence"])


def _render_text(topic: str, summary: dict) -> str:
    lines = [f"Knowledge Summary ({summary.get('template', 'research')}): {topic}", ""]
    for sec in summary.get("sections", []):
        lines.append(f"{sec.get('title', 'Section')}:")
        lines.append(str(sec.get("text") or "").strip())
        cites = ", ".join(sec.get("citations") or [])
        lines.append(f"Citations: {cites if cites else 'none'}")
        lines.append("")

    lines.append("Source Traces:")
    traces = summary.get("source_traces") or []
    if not traces:
        lines.append("- [none]")
    for src in traces:
        heading = src.get("heading") or "(no heading)"
        lines.append(
            f"- {src.get('source_id', 'S??')}: {src.get('path', '')} :: {heading} "
            f"(score={src.get('score', 0)})"
        )
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
    parser.add_argument(
        "--template",
        choices=list(TEMPLATE_CHOICES),
        default="research",
        help="Summary template style.",
    )
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

    summary = synthesize_summary(topic, chunks, template=args.template)

    payload = {
        "topic": topic,
        "template": summary["template"],
        "summary_paragraphs": summary["summary_paragraphs"],
        "summary_paragraph_count": summary["summary_paragraph_count"],
        "retrieval": {
            "search_mode": args.search_mode,
            "top_chunks": len(chunks),
            "index_dir": os.path.abspath(args.index_dir),
            "exclude_archives": not bool(args.include_archives),
        },
        "sections": summary["sections"],
        "source_traces": summary["source_traces"],
        "evidence": summary["evidence"],
    }

    rendered = json.dumps(payload, indent=2, ensure_ascii=False) if args.json else _render_text(topic, summary)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(rendered)
        print(f"Wrote summary to: {os.path.abspath(args.output)}")
    else:
        print(rendered)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
