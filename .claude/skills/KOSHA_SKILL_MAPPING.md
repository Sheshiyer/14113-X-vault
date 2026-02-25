# Kosha-Skill Mapping for TWC Vault

**Location**: `/Volumes/madara/2026/twc-vault/.claude/skills`
**Purpose**: Map vault intake pipeline skills to the kosha system for agent orchestration
**Date**: 2026-02-16
**Version**: 1.0

---

## 🧬 Skill-to-Kosha Mapping

| Skill | Stage | Primary Kosha | Secondary Kosha | Vayu | Guna | Faculty | Purpose |
|-------|-------|---------------|-----------------|------|------|---------|---------|
| **discovery-skill** | 1 | Annamaya | — | Vyana | Tamas→Rajas | Chitta (storage) | File inventory, SHA-256 hashing |
| **extraction-skill** | 2 | Annamaya | Pranamaya | Prana | Rajas | Prana (vitality) | Text extraction from PDF/EPUB |
| **analysis-skill** ⭐ | 3 | Manomaya | Vijnanamaya | Samana | Sattva | Buddhi (discernment) | Enneagram + PARA classification |
| **routing-skill** | 4 | Vijnanamaya | — | Vyana | Sattva | Mana (coordination) | Destination path mapping |
| **processing-skill** | 5 | Pranamaya | Annamaya | Apana | Rajas | Aham (action) | Markdown generation, file copy |
| **integration-skill** | 6 | Vijnanamaya | Anandamaya | Udana | Sattva | Chitta (memory) | MOC updates, linking |
| **orchestrator-skill** | Meta | Vijnanamaya | — | Vyana | Sattva | Buddhi→Mana→Chitta | Coordinates all 6 stages |

### Supplementary Skills

| Skill | Kosha | Vayu | Purpose |
|-------|-------|------|---------|
| **pattern-synthesizer-skill** | Vijnanamaya | Vyana | Identify patterns across content |
| **polymath-compass-skill** | Anandamaya | Udana | Multi-domain convergence detection |
| **transcript-processor-skill** | Manomaya | Samana | Process transcripts to structured content |
| **content-generator-skill** | Manomaya | Prana | Generate new content from patterns |

---

## 🔄 Pipeline Flow Through Koshas

```
Stage 1: DISCOVERY (Annamaya)
    ↓ SHA-256 hashing, file inventory
Stage 2: EXTRACTION (Annamaya→Pranamaya)
    ↓ Text extraction, vitality of content revealed
Stage 3: ANALYSIS ⭐ (Manomaya→Vijnanamaya)
    ↓ Enneagram classification, PARA routing
Stage 4: ROUTING (Vijnanamaya)
    ↓ Discriminative path selection
Stage 5: PROCESSING (Pranamaya→Annamaya)
    ↓ Manifestation into vault structure
Stage 6: INTEGRATION (Vijnanamaya→Anandamaya)
    ↓ Wholeness through linking, MOC harmony
```

---

## ⏰ Cron Integration

The following crons can invoke these skills based on their kosha alignment:

| Cron | Primary Kosha | Can Invoke Skills |
|------|---------------|-------------------|
| **Chitta-Weaver Heartbeat** | Manomaya→Vijnanamaya | `analysis-skill`, `pattern-synthesizer-skill` |
| **Prana-Sadhana Heartbeat** | Pranamaya→Manomaya | `extraction-skill`, `processing-skill` |
| **Weekly Memory Distillation** | Vijnanamaya | `integration-skill`, `orchestrator-skill` |
| **Lunar Resonance Orchestrator** | Vijnanamaya | `orchestrator-skill`, `routing-skill` |
| **Sankalpa Listener** | Manomaya | `content-generator-skill` |
| **Samskara Hunter** | Manomaya | `transcript-processor-skill`, `pattern-synthesizer-skill` |

---

## 📋 Usage Patterns

### Pattern 1: Full Vault Intake (Orchestrated)
```
Trigger: User drops files into /incoming
Agent: orchestrator-skill
Kosha Path: Annamaya → Pranamaya → Manomaya → Vijnanamaya → Anandamaya
Result: Files processed through all 6 stages, integrated into vault
```

### Pattern 2: Content Analysis (Single Skill)
```
Trigger: Cron detects new extraction ready
Agent: analysis-skill
Kosha: Manomaya→Vijnanamaya
Faculty: Buddhi (discriminative classification)
Result: Enneagram type + PARA bucket assigned
```

### Pattern 3: Pattern Recognition (Background)
```
Trigger: Weekly Memory Distillation cron
Agent: pattern-synthesizer-skill
Kosha: Vijnanamaya
Faculty: Buddhi→Chitta
Result: Cross-content patterns identified, added to MEMORY.md
```

### Pattern 4: Polymath Convergence Detection
```
Trigger: Analysis detects multi-type document
Agent: polymath-compass-skill
Kosha: Anandamaya (Layer 0 / bliss sheath)
Vayu: Udana (upward/transcendent)
Result: Multi-type weighted classification, special document type assigned
```

---

## 🔗 File Locations

| Resource | Path |
|----------|------|
| Skills root | `/Volumes/madara/2026/twc-vault/.claude/skills` |
| Shared vocabulary | `/Volumes/madara/2026/twc-vault/.claude/skills/shared/controlled-vocabulary.yaml` |
| Quality thresholds | `/Volumes/madara/2026/twc-vault/.claude/skills/shared/quality-thresholds.yaml` |
| This mapping | `/Volumes/madara/2026/twc-vault/.claude/skills/KOSHA_SKILL_MAPPING.md` |
| Vault target | `/Volumes/madara/2026/twc-vault` |

---

## 🎯 Integration Notes

1. **Skill invocation** happens through Claude Code when working in twc-vault
2. **No OpenClaw dependency** — these skills work directly with Claude
3. **Kosha awareness** — each skill knows its kosha layer and operates accordingly
4. **Vayu timing** — skills respect optimal Vayu for their operation:
   - Discovery/Processing: Prana/Apana (action-oriented)
   - Analysis/Routing: Samana/Vyana (integration)
   - Integration: Udana (completion/transcendence)

---

## 📊 Usage Statistics

### 2026-W08 Weekly Distillation Update
- **Last Weekly Distillation Invocation:** 2026-02-22 00:00 IST
- **orchestrator-skill Triggered:** ✅ Yes (queued via `pipeline-status.json` + `trigger-2026-W08.md`)
- **Detected New/Unprocessed Files Since Last Intake Scan:** 5,776 (filtered; excludes cache/noise patterns)
- **Primary New Content Cluster:** `01-Projects/tryambakam-noesis/brand-docs-final/`
- **Current Action State:** Awaiting orchestrator execution of full 6-stage pipeline

| Skill | Last Used | Invocation Source | Notes |
|------|-----------|-------------------|------|
| orchestrator-skill | 2026-02-22 | weekly-memory-distillation | Queue trigger created for 6-stage run |
| integration-skill | 2026-02-22 | weekly-memory-distillation | Memory/integration bookkeeping updated |

---

*Part of the Tryambakam Noesis system | Kosha-integrated vault processing pipeline*