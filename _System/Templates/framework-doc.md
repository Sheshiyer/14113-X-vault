# {{framework_name}} Documentation
`Version {{version}} | Updated: 2026-01-26`  
`Enneagram+PARA Classification`

---

## Frontmatter

```yaml
---
title: "{{framework_name}}"
version: "{{version}}"
created: "{{date}}"
enneagram_type: "{{Type 5|8|9|etc}}" # Classify framework by nature
greek_muse: "{{Melpomene|Urania|etc}}"
para_bucket: "{{Resources|Areas|Projects}}"
domain: "{{Knowledge/Frameworks}}" # Or appropriate domain
moc_links:
  - "{{Relevant-Library-Index}}.md"
framework_type: "{{technical|mystical|integrated}}"
status: "{{planning|active|complete}}"
---
```

**See**: `_System/Templates/frontmatter-template.md` for complete field reference

---

## Framework Overview

**Connected to**: [[system-architecture]] [[implementation-protocol]]

### Core Features
1. 
2. 
3. 

### Enneagram Classification

**Framework Type** (choose one):
- **Type 5** (Investigator): Analytical, research-based frameworks
- **Type 8** (Challenger): Action-oriented, systems-critical
- **Type 9** (Peacemaker): Integrative, harmonizing
- **Type 4** (Individualist): Creative, unique approaches
- **Type 1** (Reformer): Principled, structured

**This affects**:
- Voice/tone of documentation
- Implementation approach
- Integration patterns

---

## Technical Architecture

```python
class FrameworkImplementation:
    def __init__(self):
        self.name = "{{framework_name}}"
        self.version = "{{version}}"
        self.enneagram_type = "Type 5"  # Classification
        self.para_bucket = "Resources"   # Or Areas/Projects
        self.state = "initialization"
    
    def classify_content(self):
        """Use analysis-skill for automated classification"""
        pass
```

---

## Implementation Protocol

### Setup Requirements
1. 
2. 
3. 

### Integration Steps
1. 
2. 
3. 

### Usage Examples
```python
# Example implementation with Enneagram awareness
```

---

## System Integration

### Connection Points
- [[system-1]] (Type 5: Analytical integration)
- [[system-2]] (Type 9: Harmonizing integration)
- [[system-3]] (Type 4: Creative synthesis)

### PARA Routing

**If Resources** (89% of vault):
- Reference material
- Learning frameworks
- Knowledge accumulation

**If Areas** (9.4%):
- Active practice frameworks
- Ongoing development
- Skills being developed

**If Projects** (1.6%):
- Time-bound implementation
- Specific deliverables
- Active work frameworks

### Cross-Domain Connections

Use pattern-synthesizer-skill to discover:
```
Synthesize patterns related to "{{framework_name}}" across vault
```

---

## Debug Protocol

1. **Common issues**
2. **Resolution steps**
3. **Optimization methods**
4. **Integration validation**
   - MOC links functional?
   - Enneagram classification appropriate?
   - PARA bucket correct?

---

## Related Documentation

- [[framework-overview]]
- [[implementation-guide]]
- [[debug-protocol]]
- `_System/TAXONOMY-REFERENCE.md` (Enneagram+PARA reference)
- `_System/SKILLS-REFERENCE.md` (Skills workflow)

---

## Skills Integration

**Automated Classification**:
```
Analyze [this framework document] for Enneagram type and PARA routing
```

**Pattern Discovery**:
```
Synthesize patterns related to "{{framework_name}}"
```

**Content Generation**:
```
Generate documentation for "{{framework_name}}" using deepfieldarchitect agent with Type 5 voice
```

**See**: `.claude/skills/README.md`

---

## Taxonomy

**Old Tags** (deprecated):
~~#framework #documentation #implementation #system-integration~~

**New Classification**:
```yaml
enneagram_type: "{{Type based on framework nature}}"
para_bucket: "{{Resources|Areas|Projects}}"
domain: "{{appropriate domain path}}"
moc_links: ["{{relevant MOC}}"]
```

**Single source of truth**: `.claude/skills/shared/controlled-vocabulary.yaml`