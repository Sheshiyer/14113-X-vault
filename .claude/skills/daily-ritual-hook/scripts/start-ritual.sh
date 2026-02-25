#!/usr/bin/env bash
# Daily Ritual Hook — Trigger the 6 Questions
# Usage: Run when you're ready for your morning ritual

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT="/Volumes/madara/2026/twc-vault"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M)

# Check if ritual prep exists
PREP_FILE="$HOME/.openclaw/workspace-noesis-vishwakarma/memory/koshas/manomaya/ritual-inbox/daily-emergent-themes-$DATE.md"
VOICE_DIR="$VAULT/01-Projects/Content-Engine/_inbox/voice-memos"

if [[ ! -f "$PREP_FILE" ]]; then
    echo "⚠️  Ritual preparation not found."
    echo "The Samskara Scanner cron runs at 3 AM. If it's past 3 AM, run:"
    echo "  cron run b8962e8a-14d0-45d7-9c23-41f39ee955e1"
    echo ""
    echo "Or continue with manual vault scan..."
fi

# Create daily log from template
LOG_FILE="$VAULT/01-Projects/Content-Engine/_processing/daily-log-$DATE.md"

if [[ -f "$LOG_FILE" ]]; then
    echo "Daily log already exists: $LOG_FILE"
    echo "Opening for review..."
    cat "$LOG_FILE"
    exit 0
fi

# Copy template and customize
cp "$VAULT/01-Projects/Content-Engine/_templates/daily-ritual-template.md" "$LOG_FILE"

# Replace placeholders
sed -i '' "s/{{DATE}}/$DATE/g" "$LOG_FILE"
sed -i '' "s/{{TIME}}/$TIME/g" "$LOG_FILE"

# Check for voice memos
VOICE_COUNT=$(find "$VOICE_DIR" -name "*$DATE*" -type f 2>/dev/null | wc -l)
if [[ $VOICE_COUNT -gt 0 ]]; then
    LATEST_VOICE=$(find "$VOICE_DIR" -name "*$DATE*" -type f -exec ls -t {} + | head -1)
    VOICE_BASENAME=$(basename "$LATEST_VOICE")
    sed -i '' "s|{{voice-memo-file}}|$VOICE_BASENAME|g" "$LOG_FILE"
    echo "🎙️  Found voice memo: $VOICE_BASENAME"
else
    sed -i '' "s|{{voice-memo-file}}|None yet|g" "$LOG_FILE"
fi

echo "✅ Daily Ritual Log created: $LOG_FILE"
echo ""
echo "🌅 THE 6 QUESTIONS FRAMEWORK"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. WHAT STIRRED?        → Voice memo or morning thought"
echo "2. WHAT PATTERN?        → Select from vault themes"
echo "3. TECHNICAL METAPHOR?  → OS, debugging, compilation..."
echo "4. WHO IS THIS FOR?     → Seeker Simon recognition"
echo "5. WHAT FORM?           → Media suggestion"
echo "6. FIRST LINE?          → The hook"
echo ""
echo "Open the log and answer each question."
echo "Save when ready for agent synthesis."
echo ""
echo "📁 Location: $LOG_FILE"
