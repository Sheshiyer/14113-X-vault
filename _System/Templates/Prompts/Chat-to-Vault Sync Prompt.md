# Chat-to-Vault Sync Protocol

## Version History
- **1.0.0**: Initial Sync Framework
- **1.1.0**: Enhanced Integration Approach (2024-12-11)
- **2.0.0**: Skills-Based Architecture (2026-01-26)

---

## 🚀 Recommended: Use transcript-processor-skill

**This template is now automated by transcript-processor-skill**

Simply invoke:
```
Process chat transcript from [today's session] with key_insights_min=3
```

The skill will automatically:
- Extract key insights and patterns
- Classify with Enneagram type
- Route to PARA bucket (Resources/Areas/Projects)
- Map to domain subdomain
- Generate structured note with MOC links
- Embed or link original transcript

**See**: `.claude/skills/transcript-processor-skill/SKILL.md`

---

## Manual Sync Protocol (If Not Using Skill)

### 1. Pattern Recognition
- Identify emerging themes
- Map to existing frameworks
- Detect new conceptual territories

### 2. Enneagram Classification
Classify conversation dominant type:
- **Type 5** (Investigator): Analytical, research-focused
- **Type 4** (Individualist): Creative, mystical insights
- **Type 9** (Peacemaker): Integrative, peaceful synthesis
- **Type 8** (Challenger): Action-oriented, decisive
- **Type 1** (Reformer): Principled, structured

### 3. PARA Routing
- **Resources**: General knowledge, reference material (89% of vault)
- **Areas**: Active practices, ongoing learning (9.4%)
- **Projects**: Active work, time-bound goals (1.6%)

### 4. Domain Mapping
Map to one of 35 proven subdomain paths:
- Knowledge/Research, Technology/MEMS, Health/Medicinal-Mushrooms
- Occult/Hermetic-Alchemy, Consciousness/Practices, etc.

**See**: `_System/TAXONOMY-REFERENCE.md` for complete list

### 5. Technical Integration
- Capture technical parallels
- Update system metaphors
- Refine conceptual translations

### 6. Create Note
Use `_System/Templates/frontmatter-template.md` with:
- Title, source_type: "chat_transcript"
- Enneagram type, PARA bucket, domain
- MOC links (reference controlled-vocabulary.yaml)
- Key insights (min 3)
- Pattern tags

### 7. Cross-References
- Update existing documents
- Create semantic links
- Maintain knowledge graph integrity

---

## Tagging Integration (Deprecated)

~~#SyncProtocol #KnowledgeEvolution #SystemicIntegration~~

**New**: Use Enneagram types + PARA + domains (single source of truth: `controlled-vocabulary.yaml`)

---

## Implementation Notes
- **Preferred**: Use transcript-processor-skill (automated)
- **Manual**: Follow steps 1-7 above
- Flexible, adaptive approach
- Semantic-aware linking
- Continuous refinement
