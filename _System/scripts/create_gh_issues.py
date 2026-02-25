#!/usr/bin/env python3
"""
create_gh_issues.py — Batch create GitHub issues from the Meru Evolution Plan.
"""

import json
import subprocess
import os
import time

PLAN_FILE = "_System/tasks/meru_evolution_plan.json"

def create_issue(task):
    title = f"[{task['id']}] {task['title']}"
    body = f"""### Objective
{task['deliverable']}

### Acceptance Criteria
- {task['acceptance']}

### Metadata
- **Area**: {task['area']}
- **Owner Role**: {task['owner_role']}
- **Estimated Hours**: {task['est_hours']}
- **Dependencies**: {', '.join(task['dependencies']) if task['dependencies'] else 'None'}
"""
    
    cmd = [
        "gh", "issue", "create",
        "--title", title,
        "--body", body,
        "--label", task['area']
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"Created issue for {task['id']}: {result.stdout.strip()}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to create issue for {task['id']}: {e.stderr}")

def main():
    if not os.path.exists(PLAN_FILE):
        print(f"Error: Plan file not found at {PLAN_FILE}")
        return

    with open(PLAN_FILE, "r") as f:
        plan = json.load(f)

    # Gather all tasks from all phases/sprints
    tasks_dict = {}
    for phase in plan.get("phases", []):
        for sprint in phase.get("sprints", []):
            for task in sprint.get("tasks", []):
                tasks_dict[task['id']] = task

    all_tasks = sorted(tasks_dict.values(), key=lambda x: x['id'])
    print(f"Found {len(all_tasks)} unique tasks. Starting batch creation...")

    # We'll create the first 5 now to demonstrate, then ask if the user wants all 50.
    # Actually, the user asked for 40 to 50, so I'll do them in batches of 10 to avoid rate limits.
    
    for i, task in enumerate(all_tasks):
        create_issue(task)
        # Small sleep to be nice to the API
        time.sleep(1)
        if (i + 1) % 10 == 0:
            print(f"--- Batch { (i+1)//10 }/5 Complete ---")

if __name__ == "__main__":
    main()
