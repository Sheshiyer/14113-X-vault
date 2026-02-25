# Standardized Frontmatter Templates
**Updated for Skills-Based Architecture** | Version 2.0 | 2026-01-26

> 🎯 **Note**: This template uses the Enneagram+PARA taxonomy from `.claude/skills/shared/controlled-vocabulary.yaml` (reality-tested on 3,565 files).

---

## Basic Document Template
```yaml
---
title: "Document Title"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
author: "Author Name"
status: "draft|active|archived"

# Skills-Based Classification (see .claude/skills/)
enneagram_type: "Type 5"  # 1-9, see taxonomy reference
greek_muse: "Melpomene"  # Associated muse archetype
hormone: "Cortisol"  # Primary hormone mapping
para_bucket: "Resources"  # Resources|Areas|Projects|Archives
domain: "Knowledge/Research"  # One of 35 proven subdomain paths
moc_links:
  - "General-Knowledge-Library-Index.md"  # Links to relevant MOCs

# Legacy tags (optional, for backward compatibility)
tags: 
  - content-type
type: "framework|analysis|protocol|research|guide"
---
```

## Project Document Template
```yaml
---
title: "Project Title"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
project: "project-name"
phase: "planning|development|testing|complete"
priority: "high|medium|low"
status: "active|paused|complete|archived"
tags:
  - project-tag
  - domain-tag
  - methodology-tag
dependencies:
  - dependency-1
  - dependency-2
---
```

## Framework Document Template
```yaml
---
title: "Framework Name"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
framework-type: "consciousness|technical|integration"
maturity: "experimental|stable|deprecated"
implementation-status: "concept|prototype|production"
tags:
  - framework
  - domain-tag
  - implementation-tag
related-frameworks:
  - framework-1
  - framework-2
---
```

## Analysis Document Template
```yaml
---
title: "Analysis Title"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
analysis-type: "pattern|system|comparative|diagnostic"
subject: "subject-being-analyzed"
methodology: "methodology-used"
confidence: "high|medium|low"
tags:
  - analysis
  - subject-tag
  - methodology-tag
data-sources:
  - source-1
  - source-2
---
```

## Usage Guidelines

1. **Always include**: title, version, created, updated, enneagram_type, para_bucket, domain
2. **Choose appropriate type**: Select the template that best fits your content
3. **Use skills for classification**: Run `orchestrator-skill` or `analysis-skill` for automatic Enneagram+PARA classification
4. **Update versions**: Increment version numbers for significant changes
5. **Maintain dates**: Keep created/updated dates current
6. **Link to MOCs**: Always specify moc_links for proper vault integration (target >85% coverage)

## How to Classify New Content

**Automatic (Recommended)**:
```bash
# Use orchestrator-skill for full 6-stage pipeline
# Or use analysis-skill directly for classification
```

**Manual (Quick Reference)**:
1. Determine Enneagram type based on content theme (see reference above)
2. Choose PARA bucket: Resources (reference), Areas (actionable), Projects (active work)
3. Map to one of 35 domain paths from controlled-vocabulary.yaml
4. Select relevant MOC links (at least 1, usually 2-3)
5. Calculate confidence if needed (min 0.600, target 0.623+)

## Enneagram Type Reference (Quick Lookup)
- **Type 5** - Melpomene (Investigator) → Cortisol | 75.5% of vault
- **Type 3** - Euterpe (Achiever/Healer) → Endorphins | Health/Wellness
- **Type 8** - Terpsichore (Challenger) → Adrenaline | Power/Critical Thinking
- **Type 1** - Polymnia (Reformer) → Melatonin | Sacred Geometry
- **Type 4** - Thalia (Individualist) → Dopamine | Occult/Mysticism
- **Type 7** - Calliope (Enthusiast) → Testosterone | Hidden History
- **Type 6** - Erato (Loyalist) → Estrogen | Law/Security
- **Type 9** - Urania (Peacemaker) → Serotonin | Consciousness
- **Type 2** - Clio (Helper) → Oxytocin | Personal Development

## Common Domain Paths (Top 10 of 35)
1. `Knowledge/Research` (50.6%) - General knowledge, analysis
2. `Skills-Development` (9.4%) - Actionable guides (in Areas)
3. `Health/Wellness` (4.0%) - Health optimization
4. `Occult/Esoteric-Knowledge` (3.8%) - Mysticism, esotericism
5. `General/Uncategorized` (3.5%) - Catch-all
6. `Health/Medicinal-Mushrooms` (3.4%) - Specialized health
7. `Technology/Engineering` (2.9%) - Technical content
8. `Alternative-Science/Hidden-History` (2.6%) - Alternative research
9. `Critical-Thinking/Hidden-Knowledge` (1.9%) - Power analysis
10. `Phassion/Research` (1.6%) - Active project (in Projects)

**Full taxonomy**: See `.claude/skills/shared/controlled-vocabulary.yaml` or `_System/TAXONOMY-REFERENCE.md`

---

#Templates #Frontmatter #SkillsBasedArchitecture #EnneagramPARA