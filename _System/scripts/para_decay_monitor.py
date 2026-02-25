#!/usr/bin/env python3
"""
para_decay_monitor.py — Detects stagnant projects in the PARA vault.
"""
import os
import time
from pathlib import Path

VAULT_ROOT = "/Volumes/madara/2026/twc-vault"
PROJECTS_DIR = os.path.join(VAULT_ROOT, "01-Projects")
REPORT_PATH = os.path.join(VAULT_ROOT, "01-Projects/_inbox/PARA-Decay-Report.md")
THRESHOLD_DAYS = 30

def get_last_modified(dir_path):
    """Recursively find the most recent mtime in a directory."""
    latest = 0
    for root, _, files in os.walk(dir_path):
        for f in files:
            if f.startswith('.'): continue
            mtime = os.path.getmtime(os.path.join(root, f))
            if mtime > latest:
                latest = mtime
    return latest

def run_monitor():
    now = time.time()
    stagnant = []
    
    if not os.path.exists(PROJECTS_DIR):
        print("Projects directory not found.")
        return

    # Scan top-level folders in 01-Projects
    for item in os.listdir(PROJECTS_DIR):
        item_path = os.path.join(PROJECTS_DIR, item)
        if os.path.isdir(item_path) and not item.startswith('_') and not item.startswith('.'):
            last_mod = get_last_modified(item_path)
            days_inactive = (now - last_mod) / (24 * 3600)
            
            if days_inactive > THRESHOLD_DAYS:
                stagnant.append((item, int(days_inactive)))

    if not stagnant:
        print("No stagnant projects found.")
        return

    # Generate Report
    report = [
        "# 📉 PARA Decay Report",
        f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        f"The following projects in `01-Projects` have had no file activity for over {THRESHOLD_DAYS} days. Consider moving them to `04-Archives` or updating their status.",
        "",
        "| Project Name | Days Inactive | Suggested Action |",
        "| :--- | :--- | :--- |"
    ]
    
    for name, days in sorted(stagnant, key=lambda x: x[1], reverse=True):
        report.append(f"| [[{name}]] | {days} | Move to Archives? |")

    with open(REPORT_PATH, "w") as f:
        f.write("
".join(report))
    
    print(f"Report generated: {REPORT_PATH}")

if __name__ == "__main__":
    run_monitor()
