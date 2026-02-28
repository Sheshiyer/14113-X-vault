#!/usr/bin/env bash
set -euo pipefail

# Resolve vault root from script location so cron callers don't depend on CWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

MEM_DIR="$VAULT_ROOT/_System/memory"
SCRIPT_PATH="$VAULT_ROOT/_System/scripts/memory/index_full.py"
PYTHON_BIN="$VAULT_ROOT/.venv-meru/bin/python"
PID_FILE="$MEM_DIR/build.pid"
LEGACY_PID_FILE="$MEM_DIR/indexer.pid"
LOG_FILE="$MEM_DIR/build.log"
FILE_BATCH="${MERU_FILE_BATCH:-250}"

mkdir -p "$MEM_DIR"

if [ ! -x "$PYTHON_BIN" ]; then
  echo "Missing Meru venv python: $PYTHON_BIN" >&2
  exit 1
fi

if [ ! -f "$SCRIPT_PATH" ]; then
  echo "Missing indexer script: $SCRIPT_PATH" >&2
  exit 1
fi

# Check if a prior runner PID is still alive.
for candidate in "$PID_FILE" "$LEGACY_PID_FILE"; do
  if [ -f "$candidate" ]; then
    PID="$(cat "$candidate" 2>/dev/null || true)"
    if [ -n "${PID:-}" ] && ps -p "$PID" > /dev/null 2>&1; then
      echo "Indexer is already running with PID $PID ($candidate)."
      exit 1
    fi
  fi
done

# Clean stale PID files.
rm -f "$PID_FILE" "$LEGACY_PID_FILE"

echo "[$(date)] Starting headless Meru runner (resume, file-batch=$FILE_BATCH)..." >> "$LOG_FILE"
nohup "$PYTHON_BIN" "$SCRIPT_PATH" --resume --file-batch "$FILE_BATCH" >> "$LOG_FILE" 2>&1 &
NEW_PID=$!

# Maintain both PID filenames for backward compatibility.
echo "$NEW_PID" > "$PID_FILE"
echo "$NEW_PID" > "$LEGACY_PID_FILE"

echo "Indexer started in background with PID $NEW_PID."
echo "Logs are being written to $LOG_FILE."
