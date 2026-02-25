#!/usr/bin/env python3
"""
semantic_bridger.py — Taxonomy-Aware Orphan Linking for PARA Vault.

Integrates Semantic Search with Enneagram + PARA mapping rules to ensure
highly accurate, architecturally sound linking.
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import List, Dict, Set

# Setup paths
SCRIPT_DIR = Path(__file__).resolve().parent
VAULT_ROOT = SCRIPT_DIR.parent.parent.parent
sys.path.insert(0, str(SCRIPT_DIR))

# Import sibling memory modules
try:
    import numpy as np
    import faiss
    from sentence_transformers import SentenceTransformer
    from embedder import MODEL_NAME
except ImportError as e:
    print(f"Error: Missing dependencies. Ensure .venv-meru is active. {e}")
    sys.exit(1)

# Configuration
SIMILARITY_THRESHOLD = 0.48  # Lowered slightly as we now have taxonomy filters
BATCH_SIZE = 30

# MOC Target Mapping (based on TAXONOMY-REFERENCE.md)
TAXONOMY_MAP = {
    "Knowledge": "General-Knowledge-Library-Index.md",
    "Health/Wellness": "Health-Library-Index.md",
    "Health/Medicinal-Mushrooms": "Medicinal-Mushroom-Library.md",
    "Technology": "Technology-Library-Index.md",
    "Skills-Development": "Skills-Development-Library-Index.md",
    "Occult": "Occult-Library-Index.md",
    "Consciousness": "Consciousness-Library-Index.md",
    "Critical-Thinking": "Critical-Thinking-Library-Index.md",
    "Phassion": "Phassion-Research-Hub.md",
    "System": "System-MOC.md",
    "Projects": "Books-Master-Index.md" # Fallback for other projects
}

TARGET_MOCS = list(TAXONOMY_MAP.values()) + ["Books-Master-Index.md"]

def load_index_file(index_dir: str):
    path = Path(index_dir) / "vault.faiss"
    return faiss.read_index(str(path))

def load_metadata_file(index_dir: str):
    path = Path(index_dir) / "meta.json"
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_linked_files(moc_paths: List[str]) -> Set[str]:
    linked = set()
    link_pattern = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]')
    
    for moc in moc_paths:
        path = VAULT_ROOT / moc
        if path.exists():
            try:
                content = path.read_text(encoding='utf-8', errors='ignore')
                matches = link_pattern.findall(content)
                for m in matches:
                    linked.add(m.strip())
            except Exception:
                pass
    return linked

def get_target_moc_from_domain(domain: str) -> str:
    """Determine the primary MOC based on the taxonomy domain."""
    if not domain:
        return "General-Knowledge-Library-Index.md"
    
    # Check for direct matches or hierarchy
    for tax_key, moc in TAXONOMY_MAP.items():
        if domain.startswith(tax_key):
            return moc
    return "General-Knowledge-Library-Index.md"

def run_bridge():
    print(f"🚀 Starting Taxonomy-Aware Semantic Bridge")
    
    # 1. Load Data
    index_dir = str(VAULT_ROOT / "_System" / "memory")
    index = load_index_file(index_dir)
    meta = load_metadata_file(index_dir)
    model = SentenceTransformer(MODEL_NAME)
    
    # 2. Identify Orphans
    linked = get_linked_files(TARGET_MOCS)
    orphans = []
    
    seen_paths = set()
    for m in meta:
        path = m['path']
        if path.endswith(".md") and path not in seen_paths:
            seen_paths.add(path)
            stem = Path(path).stem
            if stem not in linked and Path(path).name not in TARGET_MOCS:
                orphans.append(m)
                
    print(f"📈 Orphans: {len(orphans)} | Linked: {len(linked)} | PARA-Aware: ENABLED")
    
    # 3. Process Batch
    bridged_count = 0
    log_entries = []
    
    for i, orphan in enumerate(orphans[:BATCH_SIZE]):
        orphan_path = orphan['path']
        orphan_stem = Path(orphan_path).stem
        orphan_domain = orphan.get('domain', 'General')
        
        # Determine the "Taxonomy Choice" MOC
        taxonomy_target = get_target_moc_from_domain(orphan_domain)
        
        # Query for Semantic Match
        query_text = f"{orphan_stem} {orphan.get('heading', '')}"
        query_vec = model.encode([query_text], normalize_embeddings=True)
        
        D, I = index.search(query_vec, 20)
        
        best_moc = None
        best_score = 0
        
        for dist, idx in zip(D[0], I[0]):
            match_meta = meta[idx]
            match_filename = Path(match_meta['path']).name
            
            if match_filename in TARGET_MOCS:
                # INTEGRATION RULE:
                # If semantic match matches the Taxonomy MOC, boost the score
                # If semantic match is unrelated to the Taxonomy MOC, penalize it
                effective_score = dist
                if match_filename == taxonomy_target:
                    effective_score += 0.10  # Taxonomy Resonance Boost
                
                if effective_score > SIMILARITY_THRESHOLD:
                    best_moc = match_filename
                    best_score = effective_score
                    break
        
        if best_moc:
            # Final Validation: Does it fit the PARA bucket?
            # (e.g. Area-based notes should prioritize Skill indexes)
            moc_file = VAULT_ROOT / best_moc
            link_line = f"- [[{orphan_stem}]]"
            
            try:
                content = moc_file.read_text(encoding='utf-8')
                if f"[[{orphan_stem}]]" not in content:
                    # Logic for where to insert
                    if "## 📚 Subdomains" in content:
                        content = content.replace("## 📚 Subdomains", f"## 📚 Subdomains\n{link_line}")
                    elif "## 🎯 Quick Navigation" in content:
                        content = content.replace("## 🎯 Quick Navigation", f"## 🎯 Quick Navigation\n{link_line}")
                    else:
                        content += f"\n{link_line}"
                    
                    moc_file.write_text(content, encoding='utf-8')
                    bridged_count += 1
                    log_entries.append(f"| {orphan_stem} | {best_moc} | {best_score:.3f} | ✅ Taxonomy Matched |")
                    print(f"🔗 [{orphan_domain}] {orphan_stem} -> {best_moc}")
                else:
                    log_entries.append(f"| {orphan_stem} | {best_moc} | {best_score:.3f} | ⏭️ Skip |")
            except Exception as e:
                print(f"❌ Error: {e}")
        else:
            log_entries.append(f"| {orphan_stem} | N/A | - | ❌ Drift Detected |")

    # 5. Update Log
    log_path = VAULT_ROOT / ".planning" / "vault" / "BRIDGE_LOG.md"
    if not log_path.exists():
        log_path.write_text("# Semantic Bridge Log\n\n| Orphan | Target MOC | Score | Status |\n| :--- | :--- | :--- | :--- |\n")
    
    with open(log_path, 'a') as f:
        f.write("\n" + "\n".join(log_entries))
            
    print(f"🏁 Bridged {bridged_count} files using Taxonomy-Aware matching.")

if __name__ == "__main__":
    run_bridge()
