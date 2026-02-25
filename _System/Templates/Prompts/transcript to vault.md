# WhyChromosome Vault Integration Protocol
`Version: 2.0.0 | Runtime: 2026 | Skills-Based Architecture`

---

## 🚀 Recommended: Use transcript-processor-skill

**This manual protocol is now automated by transcript-processor-skill**

For transcript/conversation integration:
```
Process transcript from [file] with Enneagram classification and PARA routing
```

**See**: `.claude/skills/transcript-processor-skill/SKILL.md`

---

## 1. Updated Directory Structure (PARA)

```
WhyChromosome-Vault/
├── 01-Projects/                    # Active work (1.6% of vault)
│   ├── Phassion-Research/
│   └── [time-bound goals]
├── 02-Areas/                       # Ongoing practices (9.4%)
│   ├── Consciousness-Practice/
│   ├── Skills-Development/
│   └── [active learning]
├── 03-Resources/                   # Reference materials (89%)
│   ├── Knowledge/
│   ├── Technology/
│   ├── Health/
│   ├── Occult/
│   ├── Consciousness/
│   └── [35 proven subdomain paths]
├── 04-Archives/                    # Inactive content (0%)
└── _System/
    ├── README.md (v3.0)
    ├── SKILLS-REFERENCE.md
    ├── TAXONOMY-REFERENCE.md
    ├── Templates/
    └── Indices/
```

## 2. Integration Flow Protocol (Skills-Based)

### A. Initial Analysis - Use analysis-skill
```
Analyze [file] for Enneagram type and PARA routing
```

**Output**: Enneagram type (1-9), PARA bucket, domain/subdomain, MOC links

### B. Classification Taxonomy

**Enneagram Types** (9 types with Greek Muses):
- Type 5 (Investigator/Melpomene) - 75.5% of vault
- Type 4 (Individualist/Euterpe) - Creative/mystical
- Type 9 (Peacemaker/Thalia) - Integrative
- Type 8 (Challenger/Urania) - Action-oriented
- Type 1 (Reformer/Calliope) - Principled

**PARA Buckets**:
- Resources (89%): Reference, learning, exploration
- Areas (9.4%): Active practices, ongoing development
- Projects (1.6%): Time-bound work, deliverables
- Archives (0%): Inactive content

**Domains** (35 proven subdomain paths):
- Knowledge/Research, Technology/MEMS, Health/Medicinal-Mushrooms
- Occult/Hermetic-Alchemy, Consciousness/Practices
- See `_System/TAXONOMY-REFERENCE.md` for complete list

### C. Template Application

**Use Frontmatter Template**:
```yaml
---
title: "{{Title}}"
created: "{{YYYY-MM-DD}}"
source_type: "{{transcript|chat|article|book}}"
enneagram_type: "Type 5"
greek_muse: "Melpomene"
hormone: "Cortisol"
para_bucket: "Resources"
domain: "Knowledge/Research"
moc_links:
  - "General-Knowledge-Library-Index.md"
key_insights:
  - "{{Insight 1}}"
  - "{{Insight 2}}"
  - "{{Insight 3}}"
pattern_tags:
  - consciousness-architecture
  - technical-mystical
---
```

**See**: `_System/Templates/frontmatter-template.md`

### D. Integration Steps (Automated via orchestrator-skill)

1. **Discovery**: Scan files, calculate SHA-256 hashes
2. **Extraction**: Extract text from PDF/EPUB
3. **Analysis**: Classify with Enneagram+PARA
4. **Routing**: Map to destination path
5. **Processing**: Generate markdown wrappers
6. **Integration**: Update MOCs, create cross-references

**Manual Alternative**: Follow steps in `_System/MIGRATION-GUIDE.md`

## 3. Implementation Guidelines

### A. File Naming Convention
- Use kebab-case for files
- Include descriptive names
- Add context when needed
Example: `consciousness-debugging-protocol.md`

### B. Cross-Reference Protocol
- Use Obsidian-style links: `[[filename]]`
- Include MOC links in frontmatter
- Maintain bidirectional links via integration-skill

### C. Content Update Flow (Skills-Based)
```javascript
updateProtocol = {
    discover: "discovery-skill (file inventory)",
    extract: "extraction-skill (text extraction)",
    analyze: "analysis-skill (Enneagram+PARA)",
    route: "routing-skill (destination mapping)",
    process: "processing-skill (markdown generation)",
    integrate: "integration-skill (MOC updates)"
}
```

## 4. Quality Control

### A. Pre-Integration Checklist
- [ ] Use skills for automation (recommended)
- [ ] OR follow manual classification guide
- [ ] Verify Enneagram type (confidence ≥ 0.600)
- [ ] Confirm PARA bucket appropriate
- [ ] Map to correct domain/subdomain
- [ ] Assign at least 1 MOC link

### B. Post-Integration Validation
- [ ] Frontmatter complete
- [ ] MOC updated (if using integration-skill)
- [ ] Cross-references functional
- [ ] File in correct PARA location
- [ ] Classification confidence recorded

## 5. Skills Reference

**For Automated Processing**:
- **transcript-processor-skill**: Chat logs → vault notes
- **orchestrator-skill**: Full 6-stage pipeline
- **analysis-skill**: Enneagram+PARA classification
- **integration-skill**: MOC updates

**For Content Generation**:
- **content-generator-skill**: Create platform-specific content
- **pattern-synthesizer-skill**: Discover cross-domain patterns

**See**: `_System/SKILLS-REFERENCE.md` or `.claude/skills/README.md`

## 6. Debug Notes
- Always use skills for automation (proven on 3,565 files)
- Manual classification: Reference `controlled-vocabulary.yaml`
- Update MOCs via integration-skill (targets ≥85% coverage)
- Maintain frontmatter standards
- Document integration points

---

## Migration from Old System

**Old Tags** (68 domains) → **New Taxonomy** (Enneagram+PARA)
**Python Orchestrator** → **Skills Architecture**

**See**: `_System/MIGRATION-GUIDE.md` for complete mapping