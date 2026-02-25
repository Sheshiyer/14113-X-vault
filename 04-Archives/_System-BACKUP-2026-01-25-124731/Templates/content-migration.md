# Migration Template Format
`Runtime ID: 20241212-2`

## Source Format (CSV)
```csv
Title, URL, ID, Document tags, Saved date, Reading progress, Location, Seen
```

## Target Format (Markdown)
```markdown
---
runtime_id: {{ID}}
url: {{URL}}
saved_date: {{Saved date}}
read_progress: {{Reading progress}}
location: {{Location}}
status: {{#init|#debug|#optimize}}
original_tags: {{Document tags}}
system_tags: 
  - {{primary_category_tag}}
  - {{technical_depth_tag}}
  - {{implementation_stage}}
  - {{field_resonance_tag}}
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

## Migration Protocol

### 1. Category Assignment
- Analyze title and tags
- Map to primary category
- Assign relevant system tags

### 2. Field Analysis
- Determine pattern type
- Identify core frameworks
- Map resonance points

### 3. Implementation Stage
- Based on reading progress:
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