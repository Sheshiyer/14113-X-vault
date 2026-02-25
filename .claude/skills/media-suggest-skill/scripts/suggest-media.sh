#!/usr/bin/env bash
# Media Suggest Skill — Rule-based implementation

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT_FILE="${1:-}"

if [[ ! -f "$INPUT_FILE" ]]; then
    echo "Usage: suggest-media.sh <content-draft.md>" >&2
    exit 1
fi

# Extract content characteristics
CONTENT=$(cat "$INPUT_FILE")
TITLE=$(echo "$CONTENT" | grep -m1 "^title:" | cut -d'"' -f2)
PILLAR=$(echo "$CONTENT" | grep -m1 "^pillar:" | cut -d'"' -f2)

# Detect content patterns
IS_QUOTE=$(echo "$CONTENT" | grep -c '"' | head -1)
HAS_TECHNICAL=$(echo "$CONTENT" | grep -c -E "(engine|code|system|API|Rust)" | head -1)
HAS_PHILOSOPHY=$(echo "$CONTENT" | grep -c -E "(consciousness|witness|authorship|Kha-Ba-La)" | head -1)
HAS_NUMBERS=$(echo "$CONTENT" | grep -c -E "[0-9]+" | head -1)

# Output recommendations
cat <<EOF
# Media Suggestions for: $TITLE
# Generated: $(date -Iseconds)

content_id: $(basename "$INPUT_FILE" .md)
pillar: $PILLAR

suggestions:
EOF

# Quote cards for single powerful lines
if [[ $IS_QUOTE -gt 0 ]]; then
    echo "  - type: animated_quote_card"
    echo "    for: hook"
    echo "    style: dark_background_gold_text"
    echo "    motion: subtle_glow_or_typing"
    echo "    priority: high"
    echo ""
fi

# Screenshots for technical content
if [[ $HAS_TECHNICAL -gt 2 ]]; then
    echo "  - type: tui_screenshot"
    echo "    for: technical_section"
    echo "    source: frame_0010.jpg"
    echo "    overlay: highlight_relevant_section"
    echo "    priority: medium"
    echo ""
fi

# Diagrams for philosophy
if [[ $HAS_PHILOSOPHY -gt 2 ]]; then
    echo "  - type: symbolic_diagram"
    echo "    for: philosophical_concept"
    echo "    concept: Kha-Ba-La_model"
    echo "    style: three_circle_venn"
    echo "    priority: medium"
    echo ""
fi

# GIF for reactions
if [[ $HAS_TECHNICAL -lt 2 && $HAS_PHILOSOPHY -lt 2 ]]; then
    echo "  - type: curated_gif"
    echo "    for: engagement"
    echo "    search_terms: [consciousness, pattern, code]"
    echo "    priority: low"
    echo ""
fi

echo "# Next: Run visual-prompt-skill for generation details"
