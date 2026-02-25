#!/usr/bin/env python3
"""
weekly_maintenance.py — Robust Vault Maintenance & Semantic Bridging.

Features:
- Per-step health checks and error handling.
- Graceful fallbacks and retry logic for transient failures.
- JSON-based atomic state reporting.
- Integration with Noesis Prana Telemetry.
- Idempotent execution.
"""

import os
import sys
import json
import subprocess
import time
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

# Setup paths
SCRIPT_DIR = Path(__file__).resolve().parent
VAULT_ROOT = SCRIPT_DIR.parent.parent.parent
PYTHON_BIN = VAULT_ROOT / ".venv-meru" / "bin" / "python3"
REPORT_DIR = VAULT_ROOT / ".planning" / "reports"
REPORT_FILE = REPORT_DIR / "maintenance_status.json"

# Maintenance Scripts
SCRIPTS = {
    "index_update": VAULT_ROOT / "_System/scripts/memory/update_index.py",
    "vault_stats": VAULT_ROOT / "_System/10865xseed/koshas/annamaya/scripts/vault_stats.py",
    "semantic_bridger": VAULT_ROOT / "_System/scripts/memory/semantic_bridger.py",
    "skeleton": VAULT_ROOT / "_System/10865xseed/tasks/generate_skeleton.py",
    "witness_pulse": VAULT_ROOT / "_System/10865xseed/koshas/annamaya/scripts/witness-pulse.py",
    "kosha_health": VAULT_ROOT / "_System/10865xseed/koshas/annamaya/scripts/kosha_health.py"
}

# ---------------------------------------------------------------------------
# Telemetry Integration
# ---------------------------------------------------------------------------

def emit_telemetry(event_type: str, payload: Dict[str, Any], status: str = "sattvic"):
    """Attempt to emit telemetry to the Noesis Prana Stream."""
    try:
        # Add Noesis paths to sys.path
        noesis_path = VAULT_ROOT / "_System" / "10865xseed"
        if str(noesis_path) not in sys.path:
            sys.path.insert(0, str(noesis_path))
        
        from noesis.telemetry import emitter
        emitter.emit(
            event_type=f"maintenance.{event_type}",
            payload=payload,
            kosha_layer="annamaya",
            guna_state=status
        )
    except Exception as e:
        # Silently fail if telemetry isn't available
        pass

# ---------------------------------------------------------------------------
# Reporting System
# ---------------------------------------------------------------------------

def update_report(step_name: str, status: str, duration_ms: int, error: Optional[str] = None, fallback: bool = False):
    """Atomically update the JSON reporting file."""
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    
    report = {
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "steps": {}
    }
    
    if REPORT_FILE.exists():
        try:
            with open(REPORT_FILE, 'r') as f:
                report = json.load(f)
        except Exception:
            pass
            
    report["steps"][step_name] = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": status,
        "duration_ms": duration_ms,
        "error": error,
        "fallback_used": fallback
    }
    
    # Save atomically
    temp_file = REPORT_FILE.with_suffix(".tmp")
    with open(temp_file, 'w') as f:
        json.dump(report, f, indent=2)
    temp_file.replace(REPORT_FILE)

# ---------------------------------------------------------------------------
# Execution Engine
# ---------------------------------------------------------------------------

def run_step(name: str, path: Path, args: List[str] = None, retries: int = 2) -> bool:
    """Run a maintenance step with retry logic and reporting."""
    print(f"🛠️  Step: {name}...")
    start_time = time.time()
    
    attempt = 0
    while attempt <= retries:
        try:
            cmd = [str(PYTHON_BIN), str(path)]
            if args:
                cmd.extend(args)
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            duration = int((time.time() - start_time) * 1000)
            
            print(f"✅ {name} complete ({duration}ms)")
            update_report(name, "success", duration)
            emit_telemetry(name, {"duration_ms": duration, "output_preview": result.stdout[:200]})
            return True
            
        except subprocess.CalledProcessError as e:
            attempt += 1
            if attempt <= retries:
                wait_time = 2 ** attempt
                print(f"⚠️  {name} failed. Retrying in {wait_time}s... (Attempt {attempt}/{retries})")
                time.sleep(wait_time)
            else:
                duration = int((time.time() - start_time) * 1000)
                print(f"❌ {name} failed after {retries} retries: {e.stderr[:200]}")
                update_report(name, "failed", duration, error=e.stderr)
                emit_telemetry(name, {"error": e.stderr}, status="tamasic")
                return False
        except Exception as e:
            duration = int((time.time() - start_time) * 1000)
            print(f"❌ {name} encountered an unexpected error: {str(e)}")
            update_report(name, "error", duration, error=str(e))
            return False
    return False

# ---------------------------------------------------------------------------
# Main Ritual
# ---------------------------------------------------------------------------

def run_maintenance(patch_test: bool = False):
    """
    Execute the unified maintenance ritual.
    
    If patch_test is True, only runs lightweight checks.
    """
    print(f"📅 VAULT MAINTENANCE {'(PATCH TEST)' if patch_test else ''} — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("="*70)
    
    steps_to_run = []
    if patch_test:
        # Patch test runs lightweight, read-only checks
        steps_to_run = [
            ("Kosha Health Check", SCRIPTS["kosha_health"], ["--quick"]),
            ("Vault Structural Stats", SCRIPTS["vault_stats"], []),
            ("Drift Audit", SCRIPTS["witness_pulse"], [])
        ]
    else:
        # Full maintenance run
        steps_to_run = [
            ("Semantic Index Update", SCRIPTS["index_update"], []),
            ("Kosha Health Check", SCRIPTS["kosha_health"], ["--quick"]),
            ("Vault Structural Stats", SCRIPTS["vault_stats"], []),
            ("Taxonomy-Aware Bridging", SCRIPTS["semantic_bridger"], []),
            ("Structural Skeleton Rebuild", SCRIPTS["skeleton"], []),
            ("Drift Audit", SCRIPTS["witness_pulse"], [])
        ]
    
    overall_success = True
    for name, path, args in steps_to_run:
        if not run_step(name, path, args):
            overall_success = False
            # Graceful Fallback: Continue to next step even if one fails
            # unless it's a critical dependency (none currently marked critical)
            print(f"⏩ Skipping {name} and continuing with remaining ritual...")

    # Final summary update
    log_path = VAULT_ROOT / "_System/10865xseed/tasks/lessons.md"
    summary = f"\n### Maintenance Ritual: {datetime.now().isoformat()}\n"
    summary += f"- Mode: {'Patch Test' if patch_test else 'Full Run'}\n"
    summary += f"- Result: {'SUCCESS' if overall_success else 'PARTIAL FAILURE'}\n"
    summary += f"- Report: .planning/reports/maintenance_status.json\n"
    
    try:
        with open(log_path, 'a') as f:
            f.write(summary)
    except Exception:
        pass
        
    print("="*70)
    print(f"🏁 Ritual Complete. Result: {'✅' if overall_success else '⚠️'}")
    print(f"📊 Live Status JSON: {REPORT_FILE.relative_to(VAULT_ROOT)}")

if __name__ == "__main__":
    # Check for patch test flag
    is_patch = "--patch" in sys.argv
    run_maintenance(patch_test=is_patch)
