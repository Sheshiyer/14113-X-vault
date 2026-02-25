#!/usr/bin/env python3
"""
generate_draft_from_brief.py — Turn a content brief into a Markdown draft with evidence tracing.
"""

import argparse
import os
import yaml
from datetime import datetime

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

    slug = os.path.splitext(os.path.basename(args.brief))[0]
    filepath = os.path.join(DRAFT_DIR, slug + "-draft.md")
    
    os.makedirs(DRAFT_DIR, exist_ok=True)
    with open(filepath, "w") as f:
        f.write("\n".join(draft_content))

    print("\n✅ Draft generated with evidence block: " + os.path.relpath(filepath, VAULT_ROOT))

if __name__ == "__main__":
    main()
