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
import re
from datetime import datetime

# Path Configuration
VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
QUERY_SCRIPT = os.path.join(VAULT_ROOT, "_System", "scripts", "memory", "query_vault.py")
VENV_PYTHON = os.path.join(VAULT_ROOT, ".venv-meru", "bin", "python3")
BRIEF_DIR = os.path.join(VAULT_ROOT, "01-Projects", "Content-Engine", "_processing", "content-briefs")

_ENNEAGRAM_KEYWORDS = {
    "1": {"discipline", "integrity", "order", "principle", "improve", "refine", "correct"},
    "2": {"care", "support", "help", "service", "empathy", "relationship", "nurture"},
    "3": {"performance", "results", "impact", "success", "ship", "execution", "optimize"},
    "4": {"identity", "depth", "authentic", "meaning", "art", "emotion", "inner"},
    "5": {"model", "system", "framework", "analysis", "theory", "research", "architecture"},
    "6": {"risk", "safety", "trust", "protocol", "reliability", "guardrail", "secure"},
    "7": {"possibility", "explore", "novel", "curiosity", "future", "experiments", "creative"},
    "8": {"power", "assert", "decisive", "lead", "control", "challenge", "force"},
    "9": {"integrate", "harmony", "balance", "synthesis", "coherence", "whole", "unify"},
}

_PARA_BIASES = {
    "Projects": {"3": 0.90, "8": 0.55, "1": 0.30},
    "Areas": {"1": 0.70, "2": 0.50, "6": 0.50, "9": 0.35},
    "Resources": {"5": 0.90, "4": 0.45, "7": 0.30},
    "Archives": {"9": 0.50, "4": 0.25},
}

_LENS_TONE = {
    "1": "clean geometric precision, ethical systems visual language",
    "2": "human warmth, connective relational framing, compassionate details",
    "3": "high-clarity performance motifs, momentum, directional composition",
    "4": "symbolic depth, expressive atmosphere, poetic textures",
    "5": "diagrammatic intelligence, architectural forms, analytical clarity",
    "6": "resilience motifs, protective patterns, trusted-system aesthetics",
    "7": "exploratory imagination, energetic novelty, expansive framing",
    "8": "bold authority, decisive contrasts, structural force",
    "9": "harmonic balance, integrative symmetry, coherent whole-system feel",
}

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


def _extract_type_from_metadata(result):
    raw_candidates = [
        result.get("enneagram_type"),
        result.get("enneagram"),
        result.get("enneagram_uuid"),
    ]
    for raw in raw_candidates:
        if raw is None:
            continue
        match = re.search(r"([1-9])", str(raw))
        if match:
            return match.group(1)
    return None


def infer_enneagram_lens(results):
    scores = {str(i): 0.0 for i in range(1, 10)}
    signals = {str(i): [] for i in range(1, 10)}

    for r in results:
        weight = float(r.get("score") or 0.0)
        if weight <= 0:
            weight = 0.1
        para = str(r.get("para") or "").strip()
        domain = str(r.get("domain") or "").strip()
        heading = str(r.get("heading") or "")
        text = str(r.get("text") or "")
        tags = " ".join(str(t) for t in (r.get("frontmatter_tags") or []))
        blob = f"{heading} {text} {domain} {tags}".lower()

        meta_type = _extract_type_from_metadata(r)
        if meta_type:
            scores[meta_type] += weight * 1.4
            signals[meta_type].append(f"metadata:{r.get('enneagram_uuid', 'direct')}")

        for etype, bias in _PARA_BIASES.get(para, {}).items():
            delta = weight * bias
            scores[etype] += delta
            signals[etype].append(f"para:{para}")

        for etype, words in _ENNEAGRAM_KEYWORDS.items():
            hits = [w for w in words if w in blob]
            if not hits:
                continue
            delta = weight * (0.18 * len(hits))
            scores[etype] += delta
            signals[etype].append(f"keywords:{','.join(hits[:3])}")

    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    best_type, best_score = ranked[0]
    positive_total = sum(v for v in scores.values() if v > 0)
    confidence = (best_score / positive_total) if positive_total > 0 else 0.0

    return {
        "recommended_type": best_type if best_score > 0 else None,
        "confidence": round(confidence, 4),
        "top_candidates": [
            {"type": t, "score": round(s, 4)}
            for t, s in ranked[:3]
            if s > 0
        ],
        "signal_summary": {
            t: sorted(set(v))[:5]
            for t, v in signals.items()
            if v and t in {best_type, ranked[1][0] if len(ranked) > 1 else best_type}
        },
        "input_records": len(results),
    }


def generate_visual_prompts(topic, channel, evidence_chunks, enneagram_lens):
    channel_key = str(channel or "").strip().lower()
    if channel_key not in {"ig", "substack"}:
        return []

    lens_type = (enneagram_lens or {}).get("recommended_type")
    tone_hint = _LENS_TONE.get(str(lens_type), "balanced systems-thinking visual style")

    headings = [
        str(ec.get("heading") or "").strip()
        for ec in (evidence_chunks or [])
        if isinstance(ec, dict) and str(ec.get("heading") or "").strip()
    ][:3]
    evidence_signal = "; ".join(headings) if headings else f"topic:{topic}"

    if channel_key == "ig":
        aspect_ratio = "4:5"
        rendering_style = "high-impact editorial illustration, cinematic color grading"
    else:
        aspect_ratio = "16:9"
        rendering_style = "thought-leadership hero image, polished longform cover aesthetic"

    base_style = (
        "Bioluminescent consciousness aesthetic, sacred geometry, deep indigo + gold palette, "
        "high detail, no text overlay"
    )

    concepts = [
        (
            "Hero Insight Visual",
            f"Create a hero visual for '{topic}' using {tone_hint}. Reflect these source signals: {evidence_signal}.",
        ),
        (
            "Systems Diagram Concept",
            f"Design a symbolic systems diagram for '{topic}' that conveys layered causality and runtime feedback loops; "
            f"anchor composition to: {evidence_signal}.",
        ),
        (
            "Embodied Practice Scene",
            f"Depict an embodied practice moment for '{topic}' with contemplative technical-mystical balance, "
            f"grounded in: {evidence_signal}.",
        ),
    ]

    prompts = []
    for rank, (name, prompt_seed) in enumerate(concepts, start=1):
        prompts.append({
            "rank": rank,
            "concept": name,
            "model": "nano-banana",
            "aspect_ratio": aspect_ratio,
            "style": rendering_style,
            "prompt": f"{prompt_seed} {base_style}.",
            "source_signals": headings,
        })
    return prompts

def main():
    parser = argparse.ArgumentParser(description="Scaffold a content brief from memory index")
    parser.add_argument("--topic", required=True, help="Main topic for retrieval")
    parser.add_argument("--channel", default="X", choices=["X", "Substack", "LinkedIn", "IG"], help="Target channel")
    parser.add_argument("--name", help="Optional filename (slug)")
    parser.add_argument("--no-auto-enneagram", action="store_true", help="Disable Enneagram lens inference")
    args = parser.parse_args()

    print(f"Scaffolding brief for: {args.topic} ({args.channel})")

    # 1. Retrieve sources from memory
    print("  Retrieving source lattice...")
    areas = search_memory(args.topic, para="Areas", top=2)
    resources = search_memory(args.topic, para="Resources", top=2)
    projects = search_memory(args.topic, para="Projects", top=2)

    # 2. Extract paths and snippets
    def format_source(results):
        return [
            {
                "path": r.get("path", ""),
                "score": r.get("score", 0.0),
                "heading": r.get("heading", ""),
                "para": r.get("para", ""),
                "domain": r.get("domain", ""),
                "enneagram_uuid": r.get("enneagram_uuid", ""),
                "frontmatter_tags": r.get("frontmatter_tags", []),
            }
            for r in results
        ]

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

    if not args.no_auto_enneagram:
        lens = infer_enneagram_lens(areas + resources + projects)
        brief["enneagram_lens"] = lens

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
            "enneagram_uuid": r.get("enneagram_uuid", ""),
            "chunk": chunk_text[:500] + "..." if len(chunk_text) > 500 else chunk_text
        })

    brief["visual_prompts"] = generate_visual_prompts(
        topic=args.topic,
        channel=args.channel,
        evidence_chunks=brief["evidence_chunks"],
        enneagram_lens=brief.get("enneagram_lens"),
    )

    # 4. Save to disk
    slug = args.name or args.topic.lower().replace(" ", "-")
    filepath = os.path.join(BRIEF_DIR, f"{slug}.yaml")
    
    os.makedirs(BRIEF_DIR, exist_ok=True)
    with open(filepath, "w") as f:
        yaml.dump(brief, f, sort_keys=False, allow_unicode=True)

    print(f"\n✅ Brief generated: {os.path.relpath(filepath, VAULT_ROOT)}")
    print("Optional: Curate lattice/evidence with review_brief_lattice.py before drafting.")
    print("Next: Generate draft using layered-context-content-skill.")

if __name__ == "__main__":
    main()
