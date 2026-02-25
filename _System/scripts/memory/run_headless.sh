#!/bin/bash

# Configuration
PID_FILE="_System/memory/indexer.pid"
LOG_FILE="_System/memory/nightly.log"
SCRIPT_PATH="_System/scripts/memory/index_full.py"

# Ensure directory exists
mkdir -p _System/memory

# Check if indexer is already running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "Indexer is already running with PID $PID."
        exit 1
    else
        echo "Stale PID file found. Removing it."
        rm "$PID_FILE"
    fi
fi

echo "Starting Headless Runner for Meru memory system..."
# Launching with --resume and --file-batch 250 as requested
nohup python3 "$SCRIPT_PATH" --resume --file-batch 250 > "$LOG_FILE" 2>&1 &
NEW_PID=$!

# Save PID and provide status
echo $NEW_PID > "$PID_FILE"
echo "Indexer started in background with PID $NEW_PID."
echo "Logs are being written to $LOG_FILE."
