---
name: layered-context-content-skill
description: Generate brand content from layered vault context (02-Areas + 03-Resources + project docs) with mandatory depth gates for Substack, X threads, LinkedIn, and Instagram captions.
version: 1.0.0
stage: standalone
dependencies:
  - content-generator-skill
  - analysis-skill
  - pattern-synthesizer-skill
outputs:
  - _processing/*.md
  - content-briefs/*.yaml
quality_gates:
  - min_area_sources: 2
  - min_resource_sources: 1
  - includes_runtime_claim: true
  - includes_pattern_claim: true
  - includes_embodied_intervention: true
  - non_pitch_closure: true
---

# Layered Context Content Skill

Use this skill when the goal is **structure-first content generation**, not one-off writing.

## When to Use
- User asks for depth from `02-Areas` + `03-Resources`
- Content feels shallow/branching without source lattice
- Need repeatable pipeline for Substack/X/LinkedIn/IG

## Required Inputs
1. Brand/project target (e.g. `01-Projects/Content-Engine`)
2. Topic seed (runtime, enneagram, authorship, etc.)
3. Channel target (Substack/X/LinkedIn/IG)

## Workflow

### Step 1 — Build Source Lattice (mandatory)
Load source files in this minimum ratio:
- `02-Areas`: at least **2** files
- `03-Resources`: at least **1** file
- Project docs (`01-Projects/...`): at least **1** file

Use [references/source-lattice.md](references/source-lattice.md).

### Step 2 — Create Content Brief
Run the Meru semantic scaffolder to pull evidence from the vault index:
- **Command**: `.venv-meru/bin/python3 _System/scripts/scaffold_content_brief_from_memory.py --topic "[TOPIC]" --channel "[CHANNEL]"`
- **Result**: Generates a brief YAML in `content-briefs/` with pre-filled sources and direct evidence chunks.

### Step 3 — Draft by Channel
Use channel recipe from [references/channel-recipes.md](references/channel-recipes.md).

### Step 4 — Apply Depth Gates
Validate against [references/quality-gates.md](references/quality-gates.md).
If gates fail, keep draft in `_processing/`.

### Step 5 — Handoff
Output:
- draft file in `_processing/`
- brief YAML in `content-briefs/`
- cited source list

## Non-Negotiables
- Never publish strategy/meta language as reader-facing copy.
- Every piece must be traceable to explicit source files.
- Favor **protocol + lived pattern evidence** over abstract claims.
