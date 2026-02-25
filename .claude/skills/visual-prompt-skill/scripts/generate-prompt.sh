#!/usr/bin/env bash
# Visual Prompt Skill — Generate image prompts from text

set -euo pipefail

QUOTE="${1:-}"

if [[ -z "$QUOTE" ]]; then
    echo "Usage: generate-prompt.sh 'Your quote here'" >&2
    exit 1
fi

# Brand colors
DEEP_INK="#0A0A0F"
BONE="#E8E6E1"
AGED_GOLD="#B8A88A"

cat <<EOF
# Visual Prompt Generation
# Source: "$QUOTE"
# Generated: $(date -Iseconds)

concept: |
  $(echo "$QUOTE" | cut -c1-50)...

style: dark_mystical_technology

base_parameters:
  background: "Deep void, ${DEEP_INK}"
  text_color: "${AGED_GOLD}, glowing"
  accent: "${BONE} for secondary elements"
  lighting: "cinematic, from below, dramatic shadows"
  composition: "centered, vast negative space, minimal"
  quality: "8k, highly detailed, photorealistic textures"

prompt: |
  Dark mystical technology aesthetic, ${DEEP_INK} background,
  glowing ${AGED_GOLD} text "$(echo "$QUOTE" | sed 's/"//g')" floating in center,
  subtle circuit board patterns and binary code emerging from darkness,
  ethereal particles of light, cosmic void atmosphere,
  cinematic lighting, shallow depth of field, 8k detail,
  minimal composition with vast negative space,
  symbolic surrealism, grounded depth,
  --ar 16:9 --style raw --v 6

negative_prompt: |
  bright colors, busy, cluttered, cartoon, anime,
  text errors, blurry, low quality, oversaturated

motion_suggestion: |
  If animating (Grok/Runway):
  - Subtle text glow pulse (2s cycle)
  - Circuit patterns slowly animating (flowing data)
  - Particles floating upward (gentle, ethereal)
  - Camera: Very slow zoom in (5% over 10s)

generation_options:
  - recraft: "v3, style:photography, colors:${DEEP_INK},${AGED_GOLD}"
  - stable_diffusion: "model:SDXL, lora:minimal-tech"
  - midjourney: "--ar 16:9 --style raw --no bright,cluttered"

# Next Steps:
# 1. Copy prompt to Recraft/SD/Midjourney
# 2. Generate image
# 3. Save to: _assets/images/generated/
# 4. Optional: Upload to Grok for motion
EOF
