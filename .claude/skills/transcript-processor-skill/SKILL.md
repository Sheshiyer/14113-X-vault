---
name: transcript-processor-skill
description: Process conversational content (chat logs, transcripts, articles) into structured vault notes with Enneagram+PARA classification. Uses parallel agent dispatch for efficient processing of multiple transcripts or complex pattern extraction.
version: 1.1
stage: standalone
dependencies:
  - analysis-skill
  - routing-skill
  - shared/controlled-vocabulary.yaml
  - dispatching-parallel-agents (embedded capability)
outputs:
  - structured-notes/*.md
  - transcript-metadata.json
quality_gates:
  - min_insights: 3
  - classification_confidence: 0.600
  - moc_links: 1
---

# 📝 Transcript Processor Skill

**Pipeline Stage**: Standalone (can integrate with orchestrator)  
**Role**: Convert conversational content into structured, classified vault notes  
**Innovation**: Built-in parallel agent dispatch for batch processing

---

## Overview

> 💡 **Purpose**: The Transcript Processor Skill transforms raw conversational content (chat logs, video transcripts, audio transcripts, articles) into rich, structured vault notes with full Enneagram+PARA classification.

This skill addresses a critical gap: valuable insights from conversations often get lost in raw transcript form. By extracting key patterns, classifying content, and generating properly structured notes, this skill ensures conversational wisdom integrates seamlessly into your vault's knowledge graph.

**Key Innovation**: Uses **parallel agent dispatch** to process multiple transcripts simultaneously or break complex transcripts into independent processing tasks (pattern extraction, classification, insight generation).

**Proven Approach**: Leverages existing analysis-skill for Enneagram classification and controlled-vocabulary.yaml for taxonomy consistency.

---

## When to Use

Use this skill when:
- ✅ Processing chat logs from AI conversations
- ✅ Converting video/audio transcripts to vault notes
- ✅ Extracting insights from article text
- ✅ Batch processing multiple conversation files
- ✅ Need automatic Enneagram+PARA classification
- ✅ Want MOC integration for conversational content

**Prerequisites**:
- Text file(s) with conversational content
- Content should have clear topics/themes (for classification)
- `.claude/skills/analysis-skill` available
- `controlled-vocabulary.yaml` loaded

**Not Suitable For**:
- ❌ Already-structured content (use processing-skill instead)
- ❌ Binary files without text extraction
- ❌ Content already in vault with proper classification
- ❌ Real-time streaming conversations (designed for completed transcripts)

---

## Core Process

> 🔍 **Input**: Raw text file(s) with conversational content  
> 📝 **Output**: Structured markdown notes with Enneagram+PARA classification + MOC links

### Standard Workflow (Single Transcript)

**Step 1: Parse & Structure**
- Load transcript file
- Detect format (AIPRM, Claude, ChatGPT, generic)
- Identify structure (speakers, timestamps, topics)
- Detect conversation type (technical, philosophical, practical)
- Clean and normalize text

**AIPRM Format Parsing** (Auto-detected):

When processing AIPRM ChatGPT exports, use specialized parsing:

```yaml
aiprm_parsing:
  enabled: true  # Auto-detected by format signature
  timestamp_format: "ISO 8601 UTC"
  speaker_pattern: "\\*\\*(User|ChatGPT) \\((\\d{4}-\\d{2}-\\d{2}T[\\d:\\.Z]+)\\):\\*\\*"
  separator: "---"
  citation_pattern: "\\(\\[(.+?)\\]\\((.+?)\\)\\)"
  metadata_extraction:
    - turn_count              # Total conversation turns
    - timestamp_range         # Start → End dates
    - citation_count          # Web source citations
    - speaker_distribution    # User vs AI percentage
  spiral_annotation: true     # Mark recursive cycles
  cycle_detection:
    method: "thematic_shift"
    markers: ["new domain introduction", "integration synthesis", "emergence events"]
```

**AIPRM-Specific Features**:
- **Turn Tracking**: Number and index each conversation turn
- **Citation Extraction**: Preserve web source links inline
- **Spiral Cycle Markers**: Detect thematic evolution boundaries (e.g., Cycle 1: Gematria → Cycle 2: Vedic Astrology)
- **Speaker Distribution**: Track User vs ChatGPT contribution percentages
- **Temporal Context**: Full timestamp range preserved in frontmatter

**Step 2: Pattern Extraction** (Can run in parallel)
- Extract key insights (3+ minimum)
- Identify "aha moments" and breakthrough concepts
- Detect recurring themes
- Recognize technical-mystical patterns
- Tag consciousness architecture elements

**Step 3: Enneagram Classification** (Uses analysis-skill)
- Analyze content themes and tone
- Classify primary Enneagram type (1-9)
- Map to Greek Muse archetype
- Assign hormone mapping
- Calculate confidence score (min 0.600)

**Step 4: PARA & Domain Routing** (Uses routing-skill)
- Determine PARA bucket (Resources/Areas/Projects)
- Map to one of 35 domain subdomain paths
- Suggest MOC links (min 1, target 2-3)

**Step 5: Note Generation**
- Create structured markdown with YAML frontmatter
- Format key insights as bullet points
- Add pattern recognition notes
- Include conversation flow summary
- Embed or link original transcript
- Add technical-mystical integration notes

**Step 6: Validation**
- Check quality gates pass
- Verify classification confidence
- Ensure MOC links present
- Validate destination path exists

---

## Parallel Processing Modes

### Mode 1: Batch Processing (Multiple Transcripts)

When processing 2+ independent transcripts, dispatch parallel agents:

```
Agent 1 → Process transcript-2024-01-15-consciousness.txt
Agent 2 → Process transcript-2024-01-16-biofields.txt  
Agent 3 → Process transcript-2024-01-17-sacred-geometry.txt
```

**Each agent**:
- Runs full pipeline independently
- Returns structured note + metadata
- No shared state between agents

**Coordinator (you)**:
- Review all outputs
- Verify no conflicts
- Integrate all notes into vault
- Update MOCs in batch

**Benefits**:
- 3 transcripts processed in time of 1
- Independent classification decisions
- Parallel pattern extraction

---

### Mode 2: Complex Transcript (Single File, Parallel Tasks)

For long, complex transcripts with multiple topics, dispatch parallel extraction agents:

```
Agent 1 → Extract technical patterns and insights
Agent 2 → Extract philosophical/spiritual themes
Agent 3 → Identify consciousness architecture elements
Agent 4 → Classify Enneagram type (via analysis-skill)
```

**Each agent**:
- Works on same transcript, different aspect
- Returns specialized extraction
- No dependencies between tasks

**Coordinator (you)**:
- Synthesize all extractions
- Combine insights into single note
- Use Enneagram result for frontmatter
- Generate unified output

**Benefits**:
- Deep multi-dimensional analysis
- Faster processing of complex content
- Captures patterns that sequential read might miss

---

## Example Usage

### Example 1: Processing a Chat Log

**Input**: `chat-consciousness-runtime-2024-01-15.txt`

**Command**:
```
Use transcript-processor-skill to process chat-consciousness-runtime-2024-01-15.txt
```

**Output**: `Chat-Consciousness-Runtime-2024-01-15.md` with:
- Type 5 (Investigator) classification
- Knowledge/Research domain
- 4 key insights extracted
- 2 MOC links (General-Knowledge, Consciousness)
- Technical-mystical pattern tags

**Time**: ~2-3 minutes

---

### Example 2: Batch Processing 3 Transcripts

**Input**: 3 transcript files from different conversations

**Command**:
```
Use transcript-processor-skill in batch mode with parallel dispatch:
- transcript-jan-15-consciousness.txt
- transcript-jan-16-biofields.txt  
- transcript-jan-17-sacred-geometry.txt
```

**Parallel Dispatch**:
```
Agent 1 → Process transcript-jan-15-consciousness.txt
Agent 2 → Process transcript-jan-16-biofields.txt
Agent 3 → Process transcript-jan-17-sacred-geometry.txt
```

**Output**: 3 structured notes + 3 metadata files

**Time**: ~3-4 minutes (vs ~9 minutes sequential)

---

## Quality Gates

This skill enforces the following quality gates:

| Gate | Threshold | Action on Failure |
|------|-----------|-------------------|
| Key Insights | ≥ 3 insights | WARN - continue but flag for review |
| Classification Confidence | ≥ 0.600 | STOP - cannot proceed without valid classification |
| MOC Links | ≥ 1 link | WARN - continue but flag for manual MOC assignment |
| Pattern Tags | ≥ 1 tag | WARN - continue but recommend manual tagging |
| Enneagram Type | Must be 1-9 | STOP - invalid classification |

**Validation Steps**:
1. ✅ Check min 3 key insights extracted
2. ✅ Verify Enneagram confidence ≥ 0.600
3. ✅ Validate PARA bucket is Resources/Areas/Projects
4. ✅ Confirm domain is one of 35 valid paths
5. ✅ Check at least 1 MOC link assigned

**Pass Criteria**: Gates 2 & 5 MUST pass. Gates 1, 3, 4 trigger warnings but allow proceed.

---

## Troubleshooting

### Issue 1: Low Confidence Classification (< 0.600)

**Symptoms**: Classification completes but confidence below threshold

**Solution**:
1. Review extracted text quality
2. Check if transcript is multi-topic
3. Manually review key insights
4. Use General/Uncategorized if ambiguous
5. Override confidence if manual review confirms

---

### Issue 2: No Clear Insights Extracted

**Symptoms**: Pattern extraction returns < 3 insights

**Solution**:
1. Review original transcript substantiveness
2. Lower insight extraction threshold temporarily
3. Look for implicit insights
4. Consider if transcript warrants vault inclusion

---

### Issue 3: Parallel Agents Conflict

**Symptoms**: Conflicting Enneagram classifications or duplicate notes

**Solution**:
1. Verify agent tasks are independent
2. Ensure unique files per agent (batch mode)
3. Ensure unique aspects per agent (extraction mode)
4. Review outputs for conflicts before integration

---

## Related Skills

**Upstream Skills**: None (standalone input skill)

**Downstream Consumers**:
- **routing-skill** - Physical path determination
- **integration-skill** - MOC updates
- **analysis-skill** - Enneagram classification (called by this skill)

**Parallel Skills**:
- **extraction-skill** - Similar role for PDF/EPUB
- **content-generator-skill** - Can consume transcript notes
- **pattern-synthesizer-skill** - Can analyze multiple transcripts

---

## Resources

**Shared Resources**:
- `shared/controlled-vocabulary.yaml` - Taxonomy source of truth
- `shared/quality-thresholds.yaml` - Validation gates

**Skill Dependencies**:
- **analysis-skill** - Enneagram classification (CRITICAL)
- **routing-skill** - Destination mapping (IMPORTANT)
- **dispatching-parallel-agents** - Parallel processing (OPTIMIZATION)

**Templates Referenced**:
- `_System/Templates/Prompts/Chat-to-Vault Sync Prompt.md`
- `_System/Templates/Prompts/transcript to vault.md`
- `_System/Templates/frontmatter-template.md`

---

## Notes

**Design Decisions**:
- Parallel processing built-in for efficiency
- Uses existing analysis-skill (not reimplemented)
- Generates markdown + JSON metadata
- Prioritizes "aha moments" in extraction

**Performance Targets**:
- Single transcript: ~2-3 minutes
- Batch (3 in parallel): ~3-4 minutes  
- Complex multi-agent: ~4-5 minutes
- Target: 3x speedup via parallelization

**Innovation**:
- First skill with embedded parallel dispatch
- Bridges conversations → structured knowledge
- Technical-mystical pattern recognition built-in

---

## Version History

### v1.1 (2026-02-01) - AIPRM Format Support
- Added AIPRM ChatGPT export format detection and parsing
- Timestamp extraction (ISO 8601 UTC)
- Citation parsing for web sources
- Turn counting and speaker distribution tracking
- Spiral cycle detection via thematic shift
- Extended metadata extraction

### v1.0 (2026-01-26) - Initial Release
- Core transcript processing pipeline
- Enneagram+PARA classification integration
- Parallel agent dispatch (batch + multi-agent modes)
- Quality gates enforcement
- Comprehensive documentation

**Status**: ✅ READY FOR USE

---

*This skill bridges the gap between conversational wisdom and structured knowledge, ensuring no insight is lost in translation.*

#transcript-processor #conversational-intelligence #parallel-processing #enneagram-para
