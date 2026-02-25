# Content Migration Template
**Updated for Skills-Based Architecture** | Version 2.0 | 2026-01-26

> 🎯 **Note**: Use `orchestrator-skill` for automated 6-stage migration pipeline. This template is for manual reference only.

## Source Format (CSV)
```csv
Title, URL, ID, Document tags, Saved date, Reading progress, Location, Seen
```

## Target Format (Markdown) - Skills-Based
```markdown
---
runtime_id: {{ID}}
url: {{URL}}
saved_date: {{Saved date}}
read_progress: {{Reading progress}}
location: {{Location}}
status: "draft|active|archived"
original_tags: {{Document tags}}

# Skills-Based Classification (use orchestrator-skill)
enneagram_type: "Type 5"  # Auto-classified via analysis-skill
greek_muse: "Melpomene"  # From Enneagram mapping
hormone: "Cortisol"  # From Enneagram mapping
para_bucket: "Resources"  # Resources|Areas|Projects
domain: "Knowledge/Research"  # One of 35 subdomain paths
moc_links:
  - "General-Knowledge-Library-Index.md"
classification_confidence: 0.650  # Min 0.600
---

# {{Title}}

## Field Analysis
- **Pattern Type**: [To be determined during migration]
- **Core Matrix**: [Primary system/framework]
- **Field Resonance**: [Connection points]

## Implementation Notes
- **System State**: Reading Progress: {{Reading progress}}
- **Location**: {{Location}}
- **Debug Status**: {{Seen}}

## Related Patterns
[To be populated during migration]

## Source
[{{Title}}]({{URL}})

#{{primary_category_tag}} #{{implementation_stage}} #pattern-recognition
```

## Migration Protocol (Automated via orchestrator-skill)

### Recommended: Use Skills Pipeline
```bash
# Full 6-stage automated migration:
# 1. discovery-skill → File inventory + SHA-256 hashing
# 2. extraction-skill → Text extraction (PDF/EPUB)
# 3. analysis-skill → Enneagram+PARA classification
# 4. routing-skill → Destination path mapping
# 5. processing-skill → Markdown wrapper generation
# 6. integration-skill → MOC updates
```

### Manual Migration (Legacy)
If you must migrate manually without skills:

**1. Enneagram Classification**
- Analyze content theme and keywords
- Assign Type 1-9 (default: Type 5 for research content)
- Map to Greek Muse and hormone

**2. PARA Bucket Assignment**
- Resources: Reference material (89% default)
- Areas: Actionable skills (9.4%)
- Projects: Active work (1.6%)

**3. Domain Mapping**
- Choose from 35 proven subdomain paths
- See `.claude/skills/shared/controlled-vocabulary.yaml`

**4. MOC Linking**
- Minimum 1 MOC link (target 2-3 for better coverage)
  - 0%: #init
  - 1-99%: #debug
  - 100%: #optimize

### 4. Directory Placement
- Tools & Implementation → 01-Projects/Core Framework/Tools/
- Technical Architecture → 01-Projects/Core Framework/Architecture/
- System Architecture → 02-Areas/Tech Parallels/
- Research & Analysis → 03-Resources/Technical/
- Field Dynamics → 02-Areas/Consciousness Models/
- Spiritual Integration → 03-Resources/Spiritual/
- Implementation Methods → 01-Projects/Labs/
- Consciousness Development → 02-Areas/Consciousness Models/

### 5. Cross-Reference Protocol
- Scan for related concepts
- Create bidirectional links
- Update index files

## Debug Notes
- Maintain consistent naming conventions
- Preserve original metadata
- Enable easy backtracking
- Support pattern recognition
- Facilitate future updates

#system-architecture #implementation-protocol