# Skills Reference Guide
**Quick Reference** | Version 1.0 | 2026-01-26

> 🎯 **Purpose**: Quick guide to the 7-skill architecture for content processing in TheWhyChromosome vault.

---

## Overview

The vault uses a **6-stage pipeline** coordinated by a meta-orchestrator. Each stage is handled by a specialized skill that can run independently or as part of the automated workflow.

**Location**: All skills live in `.claude/skills/` directory

---

## The 7 Skills

### 1. discovery-skill (Stage 1)
**Purpose**: File inventory + duplicate detection  
**Input**: Source folder path  
**Output**: `discovery-manifest.json`  

**What it does**:
- Scans folders for PDF/EPUB files
- Calculates SHA-256 hashes for each file
- Detects duplicates against existing vault
- Creates inventory manifest

**When to use**: Start of any new migration to inventory files

---

### 2. extraction-skill (Stage 2)
**Purpose**: Extract text from PDF/EPUB files  
**Input**: `discovery-manifest.json`  
**Output**: `extractions/*.txt` files

**What it does**:
- Extracts first 5 pages + last page from PDFs
- Extracts first chapter + TOC from EPUBs
- Handles timeouts and corruption gracefully
- Creates text files for analysis

**When to use**: After discovery, before classification

---

### 3. analysis-skill (Stage 3) ⭐ CRITICAL
**Purpose**: Enneagram + PARA classification  
**Input**: Extracted text files  
**Output**: `analysis-results.json`

**What it does**:
- Assigns Enneagram type (1-9) with Greek Muse and hormone
- Determines PARA bucket (Resources/Areas/Projects)
- Maps to one of 35 domain subdomain paths
- Calculates confidence scores (min 0.600)
- Suggests MOC links

**When to use**: Core classification step—loads controlled-vocabulary.yaml

**Key Algorithm**:
1. Apply Type 5 prior (75.5% weight for research content)
2. Keyword/theme matching across 9 types
3. PARA determination (89% Resources, 9.4% Areas, 1.6% Projects)
4. Domain mapping to 35 proven destinations
5. MOC link suggestions (target >85% coverage)

---

### 4. routing-skill (Stage 4)
**Purpose**: Convert classification → physical vault paths  
**Input**: `analysis-results.json`  
**Output**: `routing-manifest.json`

**What it does**:
- Maps PARA bucket + domain to actual folder paths
- Handles conflicts and duplicate strategies
- Validates destination paths exist
- Creates routing manifest for processing

**When to use**: After analysis, before file generation

---

### 5. processing-skill (Stage 5)
**Purpose**: Generate markdown wrappers + copy files  
**Input**: `routing-manifest.json`  
**Output**: `*.md` wrappers + copied files in vault

**What it does**:
- Creates markdown files with YAML frontmatter
- Embeds Enneagram, PARA, domain metadata
- Copies original files to destination paths
- Preserves originals in processing folder

**When to use**: Final processing step before integration

---

### 6. integration-skill (Stage 6)
**Purpose**: Update MOCs with new entries  
**Input**: Processed files in vault  
**Output**: Updated MOC files

**What it does**:
- Updates 10 library index MOCs
- Creates bidirectional links
- Establishes cross-references
- Calculates coverage metrics (target >85%)

**When to use**: Final step to integrate content into knowledge graph

---

### 7. orchestrator-skill (Meta-Coordinator)
**Purpose**: Coordinates all 6 stages  
**Input**: Source folder path  
**Output**: Complete migration with quality gates

**What it does**:
- Runs stages 1-6 in sequence
- Implements quality gates between stages
- Progress tracking and user approval checkpoints
- Error handling and recovery

**When to use**: For complete end-to-end migrations

**Quality Gates**:
- Stage 1→2: Files discovered successfully
- Stage 2→3: Text extracted (not empty)
- Stage 3→4: Confidence ≥ 0.600, all fields assigned
- Stage 4→5: Valid destination paths
- Stage 5→6: Files copied successfully
- Stage 6→Done: MOC coverage ≥ 85%

---

## Common Workflows

### Full Migration (Automated)
```bash
# Use orchestrator-skill
# Input: Source folder path
# Output: Complete migration through all 6 stages
# User approval gates at key checkpoints
```

### Manual Classification Only
```bash
# Use analysis-skill directly
# Input: Extracted text file
# Output: Enneagram+PARA classification JSON
```

### Re-classify Existing Content
```bash
# Use analysis-skill on existing file text
# Update frontmatter manually with new classification
```

---

## Key Concepts

### Enneagram Types (9 Types)
- **Type 5** (75.5%) - Melpomene (Investigator) → Cortisol
- **Type 3** (5.5%) - Euterpe (Achiever) → Endorphins
- **Type 8** (4.9%) - Terpsichore (Challenger) → Adrenaline
- See [TAXONOMY-REFERENCE.md](TAXONOMY-REFERENCE.md) for full list

### PARA Buckets
- **Resources** (89.0%) - Reference material, passive accumulation
- **Areas** (9.4%) - Skills-Development, actionable work
- **Projects** (1.6%) - Phassion research, active projects
- **Archives** (0.0%) - Not currently used

### Domain Paths (35 Total)
Top destinations:
1. `Knowledge/Research` (50.6%)
2. `Skills-Development` (9.4%)
3. `Health/Wellness` (4.0%)
4. `Occult/Esoteric-Knowledge` (3.8%)
5. `General/Uncategorized` (3.5%)

**Full list**: See `.claude/skills/shared/controlled-vocabulary.yaml`

---

## Quality Thresholds

From `.claude/skills/shared/quality-thresholds.yaml`:

| Metric | Threshold | Notes |
|--------|-----------|-------|
| Success Rate | ≥ 95% | Files processed successfully |
| Confidence | ≥ 0.600 | Classification confidence (avg 0.623) |
| MOC Coverage | ≥ 85% | Files linked to MOCs (proven 92.8%) |
| Link Validity | ≥ 98% | Links functional |

---

## Troubleshooting

### Low Confidence Scores
- Review extracted text quality
- Check for mixed-content (anthologies)
- Manually review themes
- Use General/Uncategorized if truly ambiguous

### Type 5 Over-Classification
- Validate collection is genuinely research-heavy
- Temporarily reduce Type 5 prior if needed
- Review sample classifications manually

### Missing MOC Links
- Check domain mapping aligns with MOC structure
- Add missing MOC mappings to vocabulary
- Ensure Books-Master-Index.md always included

---

## Skill Documentation

Each skill has detailed documentation:
- `.claude/skills/[skill-name]/SKILL.md` - Full implementation guide
- Examples, troubleshooting, edge cases
- Input/output formats
- Quality gates and validation

---

## Single Source of Truth

**controlled-vocabulary.yaml** contains:
- 9 Enneagram types with proven distribution
- 35 domain subdomain paths (reality-tested)
- PARA structure distribution
- MOC mappings
- Quality thresholds

**Location**: `.claude/skills/shared/controlled-vocabulary.yaml`

This file drives ALL classification decisions. Never hardcode taxonomy values—always reference the vocabulary.

---

## Proven Results

- ✅ 3,565 files processed across 4 migrations
- ✅ 100% success rate
- ✅ 92.8% MOC coverage (exceeds 85% target)
- ✅ Average 0.623 confidence (above 0.600 threshold)
- ✅ 35 actual destinations (not theoretical)

---

#skills-reference #pipeline #enneagram-para #orchestrator
