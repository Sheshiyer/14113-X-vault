#!/usr/bin/env bash
# Full corpus build launcher — run with: bash run_build.sh &
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VAULT="/Volumes/madara/2026/twc-vault"
VENV="$VAULT/.venv-meru/bin/python"
LOG="$VAULT/_System/memory/build.log"

echo "[$(date)] Starting full corpus build..." | tee "$LOG"
exec "$VENV" "$SCRIPT_DIR/index_full.py" --formats all --file-batch 500 >> "$LOG" 2>&1
