---
name: media-suggest-skill
description: Analyze content drafts and suggest optimal media types (image, GIF, video) based on text characteristics, platform, and brand voice.
version: 1.0.0
author: noesis-vishwakarma
---

# Media Suggest Skill

Intelligent media type recommendation for social content.

## When to Use

- After drafting text content
- Before finalizing content for approval
- When deciding between static, motion, or curated media

## Input

Content draft (markdown file with YAML frontmatter)

## Output

YAML file with media recommendations

## Usage

```bash
./scripts/suggest-media.sh /path/to/content-draft.md
```

## Suggestion Logic

### Decision Matrix

| Content Pattern | Media Type | Rationale |
|-----------------|------------|-----------|
| Single powerful quote | Animated quote card | Scroll-stopping, shareable |
| Technical explanation | Screenshot/GIF | Shows don't tell |
| Philosophical concept | Symbolic diagram | Visualizes abstract |
| Build announcement | Bento grid | Credibility through craft |
| Personal story | Photo + text | Humanizes |
| Data/numbers | Infographic | Concrete |
| Reaction/response | Curated GIF | Cultural resonance |

### Platform-Specific Rules

**Twitter/X:**
- GIFs perform best for engagement
- Single image for quote cards
- Video under 60s for demos

**Instagram:**
- Carousels for threads
- Stories for behind-scenes
- Reels for motion content

**Threads:**
- Casual photos
- Screenshots acceptable
- Less polished = more authentic

## Example

Input:
```markdown
---
title: "The Runtime"
---

Most people think consciousness is a journey. It's not.
```

Output:
```yaml
content_id: the-runtime
suggestions:
  - type: animated_quote_card
    for_section: hook
    concept: "Most people think consciousness is a journey. It's not."
    style: dark_background_gold_text
    motion: subtle_glow
    priority: high
    platform: [twitter, instagram]
```

## Integration

Called by content-generator-skill after text draft completion.
