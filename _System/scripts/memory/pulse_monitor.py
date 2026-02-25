#!/usr/bin/env python3
import os
import json
import argparse
import sys
import tempfile
from datetime import datetime, timezone

def is_pid_running(pid: int) -> bool:
    """Check if a process with the given PID is running."""
    if pid <= 0:
        return False
    try:
        os.kill(pid, 0)
    except PermissionError:
        # Process exists but we don't have permission to send signal
        return True
    except OSError:
        return False
    return True

def main():
    parser = argparse.ArgumentParser(description="Meru Memory Pulse Monitor")
    parser.add_argument("--memory-dir", default=os.path.join("_System", "memory"), 
                        help="Path to the memory directory containing pid and stats files")
    args = parser.parse_args()

    # Define paths
    pid_file = os.path.join(args.memory_dir, "indexer.pid")
    stats_file = os.path.join(args.memory_dir, "index_stats.json")
    pulse_file = os.path.join(args.memory_dir, "pulse.json")

    # Default pulse values
    pulse = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "is_running": False,
        "pid": None,
        "progress_pct": 0,
        "files_processed": 0,
        "eta_minutes": 0
    }

    # 1. Check PID status
    if os.path.exists(pid_file):
        try:
            with open(pid_file, "r") as f:
                content = f.read().strip()
                if content:
                    pid = int(content)
                    pulse["pid"] = pid
                    pulse["is_running"] = is_pid_running(pid)
        except (ValueError, IOError):
            pass

    # 2. Read indexing progress
    if os.path.exists(stats_file):
        try:
            with open(stats_file, "r") as f:
                stats = json.load(f)
                # Map stats fields to pulse fields (using defaults if missing)
                pulse["progress_pct"] = stats.get("progress_pct", 0)
                pulse["files_processed"] = stats.get("file_count", 0)
                pulse["eta_minutes"] = stats.get("eta_minutes", 0)
        except (json.JSONDecodeError, IOError):
            pass

    # 3. Output consolidated JSON pulse atomically
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(pulse_file), exist_ok=True)
        
        # Write to temporary file first
        fd, temp_path = tempfile.mkstemp(dir=os.path.dirname(pulse_file), prefix="pulse_")
        with os.fdopen(fd, 'w') as f:
            json.dump(pulse, f, indent=2)
        
        # Atomic rename
        os.replace(temp_path, pulse_file)
    except IOError as e:
        print(f"Error writing pulse file: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
