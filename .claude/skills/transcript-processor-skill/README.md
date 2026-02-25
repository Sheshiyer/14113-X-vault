# Transcript Processor Skill

**Version**: 1.0  
**Status**: ✅ Ready for Use  
**Created**: 2026-01-26

## Quick Start

Process a chat log or transcript into a structured vault note:

```bash
# Single transcript
Use transcript-processor-skill on my-chat-log.txt

# Batch processing (parallel)
Use transcript-processor-skill in batch mode:
- transcript-1.txt
- transcript-2.txt
- transcript-3.txt
```

## What It Does

Transforms conversational content into structured notes with:
- ✅ Enneagram+PARA classification (via analysis-skill)
- ✅ Key insights extraction (min 3)
- ✅ Pattern recognition and tagging
- ✅ MOC links for vault integration
- ✅ **Parallel processing** for batch or complex transcripts

## Innovation

**First skill with embedded parallel agent dispatch** - can process multiple transcripts simultaneously or decompose complex transcripts into parallel extraction tasks.

## Documentation

See [SKILL.md](SKILL.md) for complete documentation including:
- Core process flow
- Parallel processing modes
- Quality gates
- Troubleshooting
- Examples

## Dependencies

- `analysis-skill` - Enneagram classification
- `routing-skill` - Destination mapping
- `shared/controlled-vocabulary.yaml` - Taxonomy
- `dispatching-parallel-agents` - Parallel capability

## Output Example

```yaml
---
title: "Chat: Consciousness as Runtime"
enneagram_type: "Type 5"
greek_muse: "Melpomene"
para_bucket: "Resources"
domain: "Knowledge/Research"
moc_links:
  - "General-Knowledge-Library-Index.md"
key_insights:
  - "Consciousness as programmable system"
  - "Debug protocols apply to awareness"
---

# Chat: Consciousness as Runtime

## Key Insights
[Extracted insights]

## Pattern Recognition
[Identified patterns]

## Conversation Flow
[Summary]
```

---

#transcript-processor #parallel-processing #enneagram-para
