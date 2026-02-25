# TheWhyChromosome System Directory
**Version 3.0.0** | Skills-Based Architecture | 2026-01-26

> 🎯 **Major Update**: Migrated from Python orchestrator (2,428 lines) to Skills-based architecture with Enneagram+PARA taxonomy proven on 3,565 files.

---

## Overview

The `_System/` directory serves as the **documentation and template hub** for the TheWhyChromosome vault's content management system. All content processing now uses the **Skills-based architecture** located in `.claude/skills/`.

### What Changed (v3.0.0)

**Removed**:
- ❌ Python orchestrator (~2,428 lines of code)
- ❌ Old 68-tag domain taxonomy  
- ❌ Field pattern tagging system
- ❌ keywords.json and legacy configs

**Replaced With**:
- ✅ 7 modular skills (discovery → integration)
- ✅ Enneagram+PARA taxonomy (9 types + 35 domains)
- ✅ Reality-tested vocabulary (3,565 files, 100% success rate)
- ✅ Native Claude processing (no external APIs)

---

## Skills-Based Architecture

All content processing uses **7 modular skills** in `.claude/skills/`:

| Stage | Skill | Function |
|-------|-------|----------|
| **1** | `discovery-skill` | File inventory + SHA-256 hashing |
| **2** | `extraction-skill` | Text extraction (PDF/EPUB) |
| **3** | `analysis-skill` | Enneagram+PARA classification |
| **4** | `routing-skill` | Destination path mapping |
| **5** | `processing-skill` | Markdown wrapper generation |
| **6** | `integration-skill` | MOC updates |
| **Meta** | `orchestrator-skill` | Coordinates all 6 stages |

**Single Source of Truth**: `.claude/skills/shared/controlled-vocabulary.yaml`

📖 **Full Details**: See [SKILLS-REFERENCE.md](SKILLS-REFERENCE.md)

---

## Memory & Retrieval Layer (Meru)

While Skills handle content **integration**, the Meru layer handles semantic **discovery** over the 54GB+ vault corpus.

| Component | Function |
|-----------|----------|
| `vmem` | Unified CLI wrapper for semantic search |
| `index_full.py` | Shard-based streaming pipeline for large datasets |
| `query_vault.py` | PARA-aware search engine with metadata filters |

📖 **Architecture**: See [scripts/memory/ARCHITECTURE.md](scripts/memory/ARCHITECTURE.md)

---

## Core Documentation

### System Documentation
- 📚 **[SKILLS-REFERENCE.md](SKILLS-REFERENCE.md)** - Guide to 7 skills pipeline
- 📚 **[TAXONOMY-REFERENCE.md](TAXONOMY-REFERENCE.md)** - Enneagram+PARA quick reference
- 📚 **[MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)** - Transition from old system

### External References
- 🔧 **Skills Architecture**: `.claude/skills/README.md`
- 🔧 **Controlled Vocabulary**: `.claude/skills/shared/controlled-vocabulary.yaml`

#system #skills-architecture #enneagram-para
