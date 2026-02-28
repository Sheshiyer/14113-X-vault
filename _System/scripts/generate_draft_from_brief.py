#!/usr/bin/env python3
"""
generate_draft_from_brief.py — Turn a content brief into a Markdown draft with evidence tracing.
"""

import argparse
import os
import re
import yaml
from datetime import datetime
from citation_formatter import build_bibliography_lines

# Path Configuration
VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DRAFT_DIR = os.path.join(VAULT_ROOT, "01-Projects", "Content-Engine", "_processing", "drafts")

def generate_placeholder_copy(topic, channel):
    if channel == "X":
        return "# [Draft] X Thread: " + topic + "\n\n1/ Thread hook about " + topic + "...\n\n2/ The problem with our current understanding...\n\n3/ A protocol for intervention..."
    elif channel == "Substack":
        return "# [Draft] Substack: " + topic + "\n\n## Introduction\n\nExploring the depths of " + topic + " through the lens of the WhyChromosome framework..."
    else:
        return "# [Draft] " + channel + " Post: " + topic + "\n\nKey insights on " + topic + "..."


def _normalize_text_block(text):
    return re.sub(r"\s+", " ", str(text or "")).strip()


def _split_sentence_chunks(text, max_chars=280):
    normalized = _normalize_text_block(text)
    if not normalized:
        return []

    sentences = re.split(r"(?<=[.!?])\s+", normalized)
    chunks = []
    current = ""

    def flush():
        nonlocal current
        if current:
            chunks.append(current.strip())
            current = ""

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        if len(sentence) > max_chars:
            flush()
            words = sentence.split()
            piece = ""
            for word in words:
                candidate = (piece + " " + word).strip()
                if len(candidate) <= max_chars:
                    piece = candidate
                else:
                    if piece:
                        chunks.append(piece)
                    piece = word
            if piece:
                chunks.append(piece)
            continue

        candidate = (current + " " + sentence).strip() if current else sentence
        if len(candidate) <= max_chars:
            current = candidate
        else:
            flush()
            current = sentence

    flush()
    return chunks


def build_thread_ready_blocks(brief, max_chars=280, max_blocks=12):
    blocks = []
    for ec in brief.get("evidence_chunks", []) or []:
        if not isinstance(ec, dict):
            continue
        path = ec.get("path", "")
        heading = ec.get("heading", "")
        for chunk in _split_sentence_chunks(ec.get("chunk", ""), max_chars=max_chars):
            blocks.append({
                "text": chunk,
                "path": path,
                "heading": heading,
                "length": len(chunk),
            })
            if len(blocks) >= max_blocks:
                return blocks
    return blocks


def collect_internal_links(brief, limit=8):
    seen = set()
    links = []

    def push(path, heading):
        norm = str(path or "").strip()
        if not norm or norm in seen:
            return
        seen.add(norm)
        links.append({"path": norm, "heading": str(heading or "").strip()})

    source_lattice = brief.get("source_lattice", {}) or {}
    if isinstance(source_lattice, dict):
        for entries in source_lattice.values():
            if not isinstance(entries, list):
                continue
            for item in entries:
                if isinstance(item, dict):
                    push(item.get("path"), item.get("heading"))
                else:
                    push(item, "")
                if len(links) >= limit:
                    return links

    for ec in brief.get("evidence_chunks", []) or []:
        if isinstance(ec, dict):
            push(ec.get("path"), ec.get("heading"))
        if len(links) >= limit:
            break
    return links

def main():
    parser = argparse.ArgumentParser(description="Generate a draft with evidence block")
    parser.add_argument("--brief", required=True, help="Path to the brief YAML")
    args = parser.parse_args()

    if not os.path.exists(args.brief):
        print("Error: Brief not found")
        return

    with open(args.brief, "r") as f:
        brief = yaml.safe_load(f)

    topic = brief.get("topic", "Unknown")
    channel = brief.get("channel", "X")
    
    print("Generating draft for: " + topic + " (" + channel + ")")

    draft_content = []
    draft_content.append("---")
    draft_content.append("topic: " + topic)
    draft_content.append("channel: " + channel)
    draft_content.append("generated_at: " + datetime.now().strftime("%Y-%m-%d %H:%M"))
    draft_content.append("status: draft")
    draft_content.append("---\n")
    
    draft_content.append(generate_placeholder_copy(topic, channel))

    internal_links = collect_internal_links(brief, limit=8)
    if internal_links:
        draft_content.append("\n\n## Suggested Internal Links")
        draft_content.append("Use these vault links to increase connective density in the final draft:")
        for item in internal_links:
            heading = item["heading"] if item["heading"] else "Related section"
            draft_content.append(f"- [[{item['path']}]] — {heading}")
    
    draft_content.append("\n\n---\n\n## 🛡 Evidence Used (Non-Publish Section)")
    draft_content.append("This section tracks the source lattice for quality assurance.")
    
    draft_content.append("\n### Source Lattice")
    for cat, sources in brief.get("source_lattice", {}).items():
        if sources:
            draft_content.append("\n**" + cat.capitalize() + "**:")
            for s in sources:
                draft_content.append("- [[" + s["path"] + "]] | Heading: " + str(s.get("heading", "N/A")) + " | Score: " + str(s.get("score", 0.0)))

    draft_content.append("\n### Top Evidence Chunks")
    for ec in brief.get("evidence_chunks", []):
        draft_content.append("\n> **Path**: [[" + ec["path"] + "]] (" + str(ec["heading"]) + ")")
        draft_content.append("> " + ec["chunk"] + "\n")

    if str(channel).strip().lower() == "x":
        thread_blocks = build_thread_ready_blocks(brief, max_chars=280, max_blocks=12)
        draft_content.append("\n### X Thread-Ready Evidence Blocks (<=280 chars)")
        if thread_blocks:
            for idx, block in enumerate(thread_blocks, start=1):
                draft_content.append(
                    f"- Block {idx} ({block['length']} chars): {block['text']}\n"
                    f"  Source: [[{block['path']}]] | Heading: {block['heading']}"
                )
        else:
            draft_content.append("- [No evidence blocks available for thread splitting]")

    if str(channel).strip().lower() == "substack":
        draft_content.append("\n## Bibliography")
        bibliography_lines = build_bibliography_lines(brief)
        if bibliography_lines:
            draft_content.extend(bibliography_lines)
        else:
            draft_content.append("- [No eligible sources found in brief]")

    slug = os.path.splitext(os.path.basename(args.brief))[0]
    filepath = os.path.join(DRAFT_DIR, slug + "-draft.md")
    
    os.makedirs(DRAFT_DIR, exist_ok=True)
    with open(filepath, "w") as f:
        f.write("\n".join(draft_content))

    print("\n✅ Draft generated with evidence block: " + os.path.relpath(filepath, VAULT_ROOT))

if __name__ == "__main__":
    main()
