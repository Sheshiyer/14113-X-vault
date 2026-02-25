#!/bin/bash
# resume_monitor.sh — Watchdog to ensure the Meru indexer survives reboots/crashes.

CWD="/Volumes/madara/2026/twc-vault"
RUNNER="_System/scripts/memory/run_headless.sh"
PID_FILE="_System/memory/indexer.pid"

cd "$CWD"

# Check if indexer is running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "$(date): Indexer crash or reboot detected. Restarting..." >> _System/memory/monitor.log
        bash "$RUNNER"
    fi
else
    # If build was in progress but PID file is missing, we could auto-resume here,
    # but we'll stick to PID-check for safety unless we find a 'build_active' flag.
    pass
fi
