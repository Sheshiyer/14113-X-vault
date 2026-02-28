#!/usr/bin/env bash
set -euo pipefail
# resume_monitor.sh — Watchdog to ensure the Meru indexer survives reboots/crashes.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
RUNNER="$VAULT_ROOT/_System/scripts/memory/run_headless.sh"
MEM_DIR="$VAULT_ROOT/_System/memory"
PID_FILE="$MEM_DIR/build.pid"
LEGACY_PID_FILE="$MEM_DIR/indexer.pid"
MONITOR_LOG="$MEM_DIR/monitor.log"

mkdir -p "$MEM_DIR"

active_pid=""
for candidate in "$PID_FILE" "$LEGACY_PID_FILE"; do
  if [ -f "$candidate" ]; then
    pid="$(cat "$candidate" 2>/dev/null || true)"
    if [ -n "${pid:-}" ] && ps -p "$pid" > /dev/null 2>&1; then
      active_pid="$pid"
      break
    fi
  fi
done

if [ -n "$active_pid" ]; then
  exit 0
fi

echo "$(date): Indexer crash or reboot detected. Restarting..." >> "$MONITOR_LOG"
bash "$RUNNER"
