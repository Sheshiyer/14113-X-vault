#!/usr/bin/env python3
"""
scaffold_content_brief_from_memory.py — Auto-generate content briefs using semantic retrieval.

Usage:
    python scaffold_content_brief_from_memory.py --topic "Consciousness" --channel "X"
"""

import argparse
import os
import sys
import yaml
import subprocess
import json
from datetime import datetime

# Path Configuration
VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
QUERY_SCRIPT = os.path.join(VAULT_ROOT, "_System", "scripts", "memory", "query_vault.py")
VENV_PYTHON = os.path.join(VAULT_ROOT, ".venv-meru", "bin", "python3")
BRIEF_DIR = os.path.join(VAULT_ROOT, "01-Projects", "Content-Engine", "_processing", "content-briefs")

def search_memory(query, para=None, top=3):
    cmd = [VENV_PYTHON, QUERY_SCRIPT, "--query", query, "--top", str(top), "--json"]
    if para:
        cmd.extend(["--para", para])
    
    try:
        # Redirect stderr to devnull to hide loading noise
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        stdout = result.stdout.strip()
        
        # Extract the JSON part (starts with [ and ends with ])
        start = stdout.find("[")
        end = stdout.rfind("]") + 1
        if start != -1 and end > start:
            json_str = stdout[start:end]
            return json.loads(json_str)
        else:
            print(f"  Warning: No JSON found in output for para={para}")
            return []
    except Exception as e:
        print(f"Error searching memory: {e}")
        return []

def main():
    parser = argparse.ArgumentParser(description="Scaffold a content brief from memory index")
    parser.add_argument("--topic", required=True, help="Main topic for retrieval")
    parser.add_argument("--channel", default="X", choices=["X", "Substack", "LinkedIn", "IG"], help="Target channel")
    parser.add_argument("--name", help="Optional filename (slug)")
    args = parser.parse_args()

    print(f"Scaffolding brief for: {args.topic} ({args.channel})")

    # 1. Retrieve sources from memory
    print("  Retrieving source lattice...")
    areas = search_memory(args.topic, para="Areas", top=2)
    resources = search_memory(args.topic, para="Resources", top=2)
    projects = search_memory(args.topic, para="Projects", top=2)

    # 2. Extract paths and snippets
    def format_source(results):
        return [{"path": r["path"], "score": r["score"], "heading": r["heading"]} for r in results]

    source_lattice = {
        "areas": format_source(areas),
        "resources": format_source(resources),
        "projects": format_source(projects)
    }

    # 3. Build Brief YAML
    brief = {
        "topic": args.topic,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "channel": args.channel,
        "status": "draft",
        "source_lattice": source_lattice,
        "depth_gates": {
            "runtime_claim": "pending",
            "pattern_claim": "pending",
            "embodied_intervention": "pending",
            "non_pitch_closure": "pending"
        },
        "evidence_chunks": []
    }

    # Add top 3 chunks as direct evidence
    all_results = sorted(areas + resources + projects, key=lambda x: x["score"], reverse=True)[:3]
    for r in all_results:
        chunk_text = r.get("text", "")
        if not chunk_text and r["path"].endswith((".md", ".txt")):
            # Fallback: Read from file if text not in index yet
            try:
                abs_p = os.path.join(VAULT_ROOT, r["path"])
                with open(abs_p, "r", errors="ignore") as f:
                    # This is a very rough snippet since we don't have the char_offset here
                    # But better than nothing. For now, just take the first 500 chars.
                    chunk_text = f.read(1000)
            except:
                chunk_text = "[Text retrieval failed]"

        brief["evidence_chunks"].append({
            "path": r["path"],
            "heading": r["heading"],
            "chunk": chunk_text[:500] + "..." if len(chunk_text) > 500 else chunk_text
        })

    # 4. Save to disk
    slug = args.name or args.topic.lower().replace(" ", "-")
    filepath = os.path.join(BRIEF_DIR, f"{slug}.yaml")
    
    os.makedirs(BRIEF_DIR, exist_ok=True)
    with open(filepath, "w") as f:
        yaml.dump(brief, f, sort_keys=False, allow_unicode=True)

    print(f"\n✅ Brief generated: {os.path.relpath(filepath, VAULT_ROOT)}")
    print("Next: Generate draft using layered-context-content-skill.")

if __name__ == "__main__":
    main()
