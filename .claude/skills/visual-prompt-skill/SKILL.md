---
name: visual-prompt-skill
description: Convert text content into image generation prompts for Recraft, Stable Diffusion, or DALL-E.
version: 1.0.0
author: noesis-vishwakarma
---

# Visual Prompt Skill

Generate image prompts from text content.

## When to Use

- After media-suggest-skill recommends "animated_quote_card" or "symbolic_diagram"
- Before calling image generation API
- For consistent brand visual style

## Input

Quote or concept text

## Output

Structured prompt for image generation

## Brand Visual Parameters

**Colors:**
- Primary: Deep Ink (#0A0A0F)
- Secondary: Bone (#E8E6E1)
- Accent: Aged Gold (#B8A88A)

**Mood:**
- Grounded depth
- Technical-spiritual fusion
- Sparse, dense, no decoration

**Style:**
- Dark backgrounds with gold accents
- Circuit patterns meeting organic forms
- Cinematic lighting
- Symbolic surrealism

## Usage

```bash
./scripts/generate-prompt.sh "Your quote here"
```

## Example

Input:
```
"Most people think consciousness is a journey. It's not."
```

Output:
```yaml
concept: Consciousness as OS/runtime
style: dark_mystical_technology
prompt: |
  Dark void background, deep ink navy (#0A0A0F), 
  glowing aged gold text floating in center,
  subtle circuit board patterns emerging from darkness,
  binary code dissolving into light,
  ethereal gold particles,
  cinematic lighting from below,
  shallow depth of field,
  8k detail, 
  minimal composition, 
  negative space,
  symbolic surrealism,
  --ar 16:9

type: animated_quote_card
motion_suggestion: |
  Subtle text glow pulse,
  circuit patterns slowly animating,
  particles floating upward
```
