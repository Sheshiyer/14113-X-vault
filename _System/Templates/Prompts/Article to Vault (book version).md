# Article/Book to Vault Integration Protocol

**Version**: 2.0.0 (Skills-Based)  
**Updated**: 2026-01-26

---

## 🚀 Recommended: Use analysis-skill + transcript-processor-skill

**For Books/Articles, use the skills workflow**:

```
# Step 1: Extract text (if needed)
Use extraction-skill for PDF/EPUB files

# Step 2: Analyze content
Analyze [book/article] for Enneagram type and PARA routing

# Step 3: Process into vault note
Process [book/article text] with key insights extraction
```

**See**: 
- `.claude/skills/analysis-skill/SKILL.md` - Classification
- `.claude/skills/transcript-processor-skill/SKILL.md` - Note generation

---

## Manual Integration Framework

### 1. Content Analysis

**Enneagram Classification**:
- **Type 5** (Investigator): Research, technical analysis, knowledge (75.5% of vault)
- **Type 4** (Individualist): Creative, mystical, unique perspectives
- **Type 9** (Peacemaker): Integrative, peaceful, harmonizing
- **Type 8** (Challenger): Action-oriented, systems-critical
- **Type 1** (Reformer): Principled, structured, perfectionist
- **Type 3** (Achiever): Goal-oriented, performance-focused
- **Type 2** (Helper): Supportive, interpersonal
- **Type 6** (Loyalist): Security-focused, analytical
- **Type 7** (Enthusiast): Exploratory, multi-interested

**PARA Routing** (default for books/articles: **Resources**):
- **Resources** (89%): Reference material, general knowledge
- **Areas** (9.4%): If book informs active practice
- **Projects** (1.6%): If book is project-specific research

**Domain Mapping** (35 proven paths):
- Knowledge/Research, Philosophy/Consciousness
- Technology/MEMS, Health/Medicinal-Mushrooms
- Occult/Hermetic-Alchemy, Critical-Thinking/Logic
- See `_System/TAXONOMY-REFERENCE.md` for complete list

### 2. Key Elements Extraction

**Required**:
- [ ] Title and author
- [ ] Main thesis/argument
- [ ] Key insights (minimum 3)
- [ ] Enneagram type classification
- [ ] Domain/subdomain mapping
- [ ] MOC links (at least 1)

**Optional**:
- [ ] Narrative structure (if fiction)
- [ ] Character development (if applicable)
- [ ] Technical-spiritual integration points
- [ ] Pattern recognition elements
- [ ] Cross-references to existing vault content

### 3. Frontmatter Creation

```yaml
---
title: "{{Book/Article Title}}"
author: "{{Author Name}}"
created: "{{YYYY-MM-DD}}"
source_type: "book" # or "article"
enneagram_type: "Type 5" # Classify based on content
greek_muse: "Melpomene" # From controlled-vocabulary.yaml
hormone: "Cortisol"
para_bucket: "Resources" # Usually Resources for books
domain: "Knowledge/Research" # Map to appropriate domain
subdomain: "{{specific area}}"
moc_links:
  - "Books-Master-Index.md"
  - "{{Relevant-Library-Index}}.md"
key_insights:
  - "{{Insight 1}}"
  - "{{Insight 2}}"
  - "{{Insight 3}}"
themes:
  - "{{theme 1}}"
  - "{{theme 2}}"
status: "{{reading|completed|reference}}"
---
```

### 4. Note Structure

```markdown
# {{Title}}

**Author**: {{Author}}  
**Type**: {{Book/Article}}  
**Enneagram**: {{Type X}} - {{Greek Muse}}

## Overview
[Brief summary of main thesis/argument]

## Key Insights

### Insight 1: {{Title}}
[Description with page references if available]

### Insight 2: {{Title}}
[Description]

### Insight 3: {{Title}}
[Description]

## Technical-Spiritual Integration (if applicable)
- **Technical Concepts**: 
- **Spiritual Principles**: 
- **Pattern Parallels**: 

## Cross-Domain Connections
[Links to related vault content]

## Implementation Notes
[Practical applications or next steps]

## Quotes (optional)
> "Notable quote" (p. XX)

## References
[Related vault notes, external links]

## Status
- [ ] Read
- [ ] Notes extracted
- [ ] Integrated with vault
- [ ] MOCs updated
```

### 5. Vault Organization

**Projects (01-Projects/)** - If book is project-specific research:
- Link to active project folder
- Create implementation guide

**Areas (02-Areas/)** - If book informs ongoing practice:
- Link to practice area (Consciousness-Practice, Skills-Development)
- Create protocols or frameworks

**Resources (03-Resources/)** - Default for most books:
- Map to domain subdomain (e.g., `Knowledge/Philosophy/`)
- Add to appropriate Library Index MOC

### 6. MOC Updates (Use integration-skill)

```
Update relevant MOCs with new book entry:
- Books-Master-Index.md (always)
- {{Domain}}-Library-Index.md (specific to content)
```

**Manual Alternative**: Add entry to MOC files with:
- Link to book note
- Brief description
- Enneagram type indicator

### 7. Cross-Reference Creation

**Link to Related Content**:
- [ ] Find related vault notes (use pattern-synthesizer-skill)
- [ ] Create bidirectional links
- [ ] Update related frameworks/templates
- [ ] Document connections

---

## Example: Three Body Kingdom Analysis

```yaml
---
title: "Three Body Kingdom - [Specific Document]"
author: "{{Author}}"
source_type: "book"
enneagram_type: "Type 4" # Creative/mystical narrative
greek_muse: "Euterpe"
para_bucket: "Resources"
domain: "Knowledge/Narrative-Systems"
moc_links:
  - "Books-Master-Index.md"
  - "Consciousness-Library-Index.md"
key_insights:
  - "Narrative structure mirrors sacred geometry"
  - "Character arcs follow Enneagram patterns"
  - "Realm interactions map to consciousness states"
themes:
  - consciousness-architecture
  - sacred-geometry
  - narrative-systems
---

# Three Body Kingdom Analysis

## Narrative Structure
- Enneagram Elements: [Analysis]
- Sacred Geometry Integration: [Connections]
- Realm Connections: [Mapping]

## Character Development
[Character arcs mapped to Enneagram types]

## Technical-Spiritual Integration
[Pattern parallels between technical and mystical elements]

## Cross-References
- [[consciousness-architecture]]
- [[sacred-geometry-patterns]]
- [[narrative-consciousness-models]]
```

---

## Quality Control

### Pre-Integration Checklist
- [ ] Content classified (Enneagram + PARA)
- [ ] Minimum 3 key insights extracted
- [ ] Domain/subdomain mapped
- [ ] At least 1 MOC link assigned
- [ ] Frontmatter complete

### Post-Integration Validation
- [ ] Note created in correct PARA location
- [ ] MOC updated (Books-Master-Index minimum)
- [ ] Cross-references functional
- [ ] Related content linked
- [ ] Status tracking in place

---

## Skills Automation

**Full Pipeline** (Recommended):
```
# For complete book processing:
Use orchestrator-skill for full 6-stage pipeline:
1. Discovery (file scan)
2. Extraction (text extraction from PDF/EPUB)
3. Analysis (Enneagram+PARA classification)
4. Routing (destination mapping)
5. Processing (markdown generation)
6. Integration (MOC updates)
```

**See**: `.claude/skills/orchestrator-skill/SKILL.md`

---

## Migration from Old System

**Old Framework** → **New Taxonomy**
- Tag-based system → Enneagram+PARA classification
- Manual categorization → Skills-based automation
- Scattered organization → PARA structure with MOC integration

**See**: `_System/MIGRATION-GUIDE.md`