#!/usr/bin/env python3
"""
validate_vault_integrity.py — Check for broken symlinks and missing offloaded data.
"""

import os
from pathlib import Path

VAULT_ROOT = "/Volumes/madara/2026/twc-vault"

def check_integrity():
    broken_links = []
    total_links = 0
    
    print(f"Checking integrity of {VAULT_ROOT}...")
    
    for root, dirs, files in os.walk(VAULT_ROOT):
        # Skip git and hidden dirs
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        
        for file in files:
            path = Path(root) / file
            if path.is_symlink():
                total_links += 1
                target = path.readlink()
                if not os.path.exists(target):
                    broken_links.append((str(path), str(target)))

    print(f"Scanned {total_links} symlinks.")
    
    if broken_links:
        print(f"❌ Found {len(broken_links)} broken symlinks:")
        for source, target in broken_links:
            print(f"  Source: {source}")
            print(f"  Target: {target}")
            print("-" * 20)
        return False
    else:
        print("✅ All symlinks are valid.")
        return True

if __name__ == "__main__":
    if check_integrity():
        exit(0)
    else:
        exit(1)
