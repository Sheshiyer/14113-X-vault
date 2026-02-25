# Migration Guide: Old System → Skills-Based Architecture
**Transition Guide** | Version 1.0 | 2026-01-26

> 🎯 **Purpose**: Help users transition from the deprecated Python orchestrator and 68-tag system to the new Skills-based architecture.

---

## What Changed & Why

### The Old System (v2.0.0)

**Problems**:
- 🐌 2,428 lines of Python code to maintain
- 🐌 68 domain tags (theoretical, not reality-tested)
- 🐌 External API calls (OpenRouter) costing money
- 🐌 Complex dependencies (pip packages, SQLite databases)
- 🐌 Field pattern taxonomy that was inconsistently applied

**Architecture**:
- Python orchestrator with 6-stage pipeline
- Tag-based classification system
- keywords.json for vocabulary
- API-based LLM calls for analysis

### The New System (v3.0.0)

**Advantages**:
- ✅ 7 modular skills (no Python maintenance)
- ✅ 9 Enneagram types + 35 domains (reality-tested on 3,565 files)
- ✅ Native Claude processing (no API costs)
- ✅ No external dependencies
- ✅ Proven taxonomy with 100% success rate

**Architecture**:
- Interactive Skills-based workflow
- Enneagram+PARA classification
- controlled-vocabulary.yaml (single source of truth)
- Native Claude reasoning

---

## Mapping: Old Tags → New Taxonomy

### Domain Tags (68 → 9 Enneagram Types)

The old system used 68 domain tags. The new system uses **9 Enneagram types** + **35 domain paths**.

| Old Tag Category | New Enneagram Type | Domain Path |
|------------------|-------------------|-------------|
| #ConsciousnessArchitecture | Type 9 (Peacemaker) | Consciousness/Altered-States |
| #PatternRecognition | Type 5 (Investigator) | Knowledge/Research |
| #TechnicalMystic | Type 4 (Individualist) | Occult/Esoteric-Knowledge |
| #EnergyDynamics | Type 9 (Peacemaker) | Spirituality/Mysticism |
| #BiofieldMapping | Type 3 (Achiever) | Health/Wellness |
| #SystemArchitecture | Type 5 (Investigator) | Knowledge/Research |
| #SacredGeometry | Type 1 (Reformer) | Alternative-Science/Sacred-Geometry |
| #AncientTechnology | Type 7 (Enthusiast) | Alternative-Science/Hidden-History |
| #EsotericWisdom | Type 4 (Individualist) | Occult/Esoteric-Knowledge |
| #Psychology | Type 5 (Investigator) | Knowledge/Research |
| #BioelectricSystems | Type 8 (Challenger) | Technology/Engineering |
| #ArchetypalSystems | Type 5 (Investigator) | Knowledge/Research |

**General Mapping Rule**:
- Research/knowledge content → **Type 5** (75.5% of vault)
- Health/wellness content → **Type 3**
- Power/systems content → **Type 8**
- Occult/mysticism content → **Type 4**
- Sacred geometry → **Type 1**
- Consciousness/meditation → **Type 9**

### Operational Tags → Status Fields

| Old Tag | New Field | Values |
|---------|-----------|--------|
| #WorkInProgress | `status:` | draft |
| #NeedsReview | `status:` | draft |
| #KeyInsight | `status:` | active |
| #Init | `status:` | draft |
| #Debug | `status:` | active |
| #Optimize | `status:` | active |

### Content Type Tags → Unchanged

| Old Tag | New Usage |
|---------|-----------|
| #Framework | Still use as tag |
| #Analysis | Still use as tag |
| #Protocol | Still use as tag |
| #Research | Still use as tag |
| #Implementation | Still use as tag |

---

## Mapping: Python Pipeline → Skills

### Stage Mapping

| Old Python Stage | New Skill | Changes |
|------------------|-----------|---------|
| `stage1_discovery.py` | `discovery-skill` | Same function, no Python code |
| `stage2_extraction.py` | `extraction-skill` | Same function, no Python code |
| `stage3_analysis.py` | `analysis-skill` | ⭐ New taxonomy (Enneagram+PARA) |
| `stage4_routing.py` | `routing-skill` | Uses 35 domains, not 26 |
| `stage5_processing.py` | `processing-skill` | New frontmatter format |
| `stage6_integration.py` | `integration-skill` | Same function |
| `orchestrator.py` | `orchestrator-skill` | Interactive with approval gates |

### Key Differences

**Stage 3 (Analysis) - CRITICAL CHANGE**:
- Old: 68 domain tags, flat taxonomy
- New: 9 Enneagram types + 35 hierarchical domain paths
- Old: Theoretical tag assignments
- New: Reality-tested with 75.5% Type 5 prior for research content

**Stage 4 (Routing)**:
- Old: 26 theoretical categories
- New: 35 proven subdomain paths from 4 migrations

**Stage 5 (Processing)**:
- Old: Basic frontmatter with tags
- New: Rich frontmatter with Enneagram, PARA, domain, MOC links

---

## Updating Existing Content

### Frontmatter Migration

**Old Format**:
```yaml
---
title: "My Note"
created: "2024-01-01"
tags:
  - ConsciousnessArchitecture
  - PatternRecognition
  - WorkInProgress
type: "research"
---
```

**New Format**:
```yaml
---
title: "My Note"
created: "2024-01-01"
updated: "2026-01-26"

# Skills-based classification
enneagram_type: "Type 5"
greek_muse: "Melpomene"
hormone: "Cortisol"
para_bucket: "Resources"
domain: "Knowledge/Research"
moc_links:
  - "General-Knowledge-Library-Index.md"

# Legacy tags (optional)
tags:
  - research
  - pattern-recognition
status: "draft"
type: "research"
---
```

### Semi-Automated Conversion

You can use `analysis-skill` to re-classify existing content:

1. Extract text from existing note
2. Run analysis-skill on the text
3. Get Enneagram+PARA classification
4. Update frontmatter manually with new fields

---

## File Organization Changes

### PARA Structure (Unchanged)

The PARA structure remains the same:
- `01-Projects/` - Active projects
- `02-Areas/` - Ongoing responsibilities
- `03-Resources/` - Reference material
- `04-Archives/` - Inactive content

### Domain Paths (Updated)

**Old**: 26 theoretical categories under Resources  
**New**: 35 proven subdomain paths

Examples of new paths:
- `03-Resources/Knowledge/Research/` (50.6% of content)
- `02-Areas/Skills-Development/` (9.4% of content)
- `03-Resources/Health/Wellness/` (4.0%)
- `03-Resources/Health/Medicinal-Mushrooms/` (3.4%)
- `01-Projects/Phassion/Research/` (1.6%)

**See**: `.claude/skills/shared/controlled-vocabulary.yaml` for full list

---

## Workflow Changes

### Old Workflow (Python Orchestrator)

```
1. Place files in input folder
2. Run: python orchestrator/main.py
3. API calls process files automatically
4. Review output in vault
5. Manual MOC updates
```

### New Workflow (Skills-Based)

```
1. Place files in source folder
2. Invoke: orchestrator-skill
3. Review Stage 1 discovery manifest → approve
4. Review Stage 3 classifications → approve
5. Stage 6 automatically updates MOCs
6. Validate >85% MOC coverage
```

**Key Difference**: Interactive approval gates, no batch automation

---

## Configuration Changes

### Removed Files

These are no longer needed:
- ❌ `keywords.json` - Replaced by controlled-vocabulary.yaml
- ❌ `config.yaml` - Skills use inline configuration
- ❌ `requirements.txt` - No Python dependencies
- ❌ `_System/Tags/controlled-vocabulary.md` - Replaced by skills taxonomy
- ❌ `_System/Tags/taxonomy.md` - Replaced by Enneagram+PARA

### New Configuration

**Single source of truth**:
- `.claude/skills/shared/controlled-vocabulary.yaml` - All taxonomy data
- `.claude/skills/shared/quality-thresholds.yaml` - Quality gates
- `.claude/skills/shared/modernized-principles.md` - Philosophy

---

## Quality Metrics Comparison

| Metric | Old System | New System |
|--------|-----------|------------|
| Success Rate | ~90% | 100% (3,565 files) |
| Confidence Avg | N/A | 0.623 |
| MOC Coverage | ~75% | 92.8% |
| API Cost | $50-100/migration | $0 (native Claude) |
| Maintenance | High (Python code) | Low (markdown docs) |
| Classification Time | ~30 min | ~20 min |

---

## Common Questions

### Q: What happened to my 68 domain tags?

**A**: They were consolidated into 9 Enneagram types + 35 domain paths based on reality-tested data from 3,565 files. The old tags were theoretical; the new taxonomy reflects actual content distribution.

### Q: Can I still use the old tags?

**A**: Yes, you can add them to the `tags:` field in frontmatter for backward compatibility. However, the Enneagram+PARA fields are now primary.

### Q: Do I need to re-classify all my existing content?

**A**: No, but it's recommended for better vault integration. You can re-classify gradually using `analysis-skill`.

### Q: Why Type 5 dominance (75.5%)?

**A**: Reality-tested from 4 migrations. Your collection is genuinely research-heavy, reflecting "The Eclectic Scholar" archetype (Type 5→4→7). This isn't a bug—it's an accurate pattern.

### Q: What if I don't like the new taxonomy?

**A**: The taxonomy is data-driven, not prescriptive. If your collection evolves, the controlled-vocabulary.yaml can be updated. But the current taxonomy has 100% success rate on 3,565 files.

### Q: Where's the Python code?

**A**: Deleted from `_System/orchestrator/`. The old implementation is preserved in your backup (`_System-BACKUP-*`). Skills-based architecture requires no Python.

---

## Migration Checklist

If you're transitioning from the old system:

- [ ] Backup existing `_System/` (done if you followed instructions)
- [ ] Review new [SKILLS-REFERENCE.md](SKILLS-REFERENCE.md)
- [ ] Review [TAXONOMY-REFERENCE.md](TAXONOMY-REFERENCE.md)
- [ ] Update your content templates to use new frontmatter
- [ ] Try `orchestrator-skill` on a small test migration
- [ ] Optionally re-classify existing content with `analysis-skill`
- [ ] Update any custom scripts to reference `.claude/skills/`

---

## Getting Help

- **Skills documentation**: `.claude/skills/[skill-name]/SKILL.md`
- **Taxonomy questions**: [TAXONOMY-REFERENCE.md](TAXONOMY-REFERENCE.md)
- **General questions**: [SKILLS-REFERENCE.md](SKILLS-REFERENCE.md)

---

#migration-guide #system-transition #enneagram-para
