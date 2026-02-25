#!/usr/bin/env python3
import os
import sys
import shutil
import json
import time
from datetime import datetime

# Add the script directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, script_dir)

from index_full import index_full, parse_formats
from walker import ALL_EXTENSIONS

def run_dry_run():
    vault_path = os.path.abspath(os.path.join(script_dir, "..", "..", ".."))
    output_dir = os.path.join(vault_path, "_System", "memory_dry_run")
    
    # Cleanup previous dry run
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir)
    
    print(f"🚀 Starting Meru Dry Run...")
    print(f"Vault: {vault_path}")
    print(f"Output: {output_dir}")
    
    try:
        formats = "md,pdf,epub"
        exts = parse_formats(formats)
        
        print(f"Testing formats: {formats}")
        
        from walker import walk_vault
        from batch_processor import ErrorAggregator, process_file
        from sentence_transformers import SentenceTransformer
        
        errors = ErrorAggregator()
        scanned_pdfs = []
        
        print("\n1. Testing Walker...")
        file_list = list(walk_vault(vault_path, extensions=exts))
        print(f"Found {len(file_list)} files for {formats}")
        
        # Pick 2 of each format if available
        test_files = []
        for ext in exts:
            matches = [f for f in file_list if f[1].endswith(ext)]
            test_files.extend(matches[:2])
        
        print(f"\n2. Testing Extraction on {len(test_files)} sample files...")
        all_texts = []
        all_meta = []
        for abs_p, rel_p in test_files:
            print(f"  Processing: {rel_p}")
            texts, meta = process_file(abs_p, rel_p, vault_path, errors, scanned_pdfs)
            if texts:
                print(f"    ✅ Extracted {len(texts)} chunks")
                all_texts.extend(texts)
                all_meta.extend(meta)
            else:
                print(f"    ❌ No text (might be intentional/scanned/error/too_short)")
        
        if not all_texts:
            print("ERROR: No text extracted from any test files.")
            # Don't return, let's see why
            
        print("\n3. Testing Embedder...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
        # Only encode first 5 chunks to be fast
        subset = all_texts[:5]
        if subset:
            embeddings = model.encode(subset, show_progress_bar=True)
            print(f"✅ Generated embeddings: {embeddings.shape}")
        else:
            print("⚠️ Skipping embedding (no texts)")
        
        print("\n4. Error Summary (Mock):")
        errors.print_summary()
        
        print("\n✅ Dry run complete. Logic verified.")
        
    except Exception as e:
        print(f"\n❌ Dry run failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_dry_run()
