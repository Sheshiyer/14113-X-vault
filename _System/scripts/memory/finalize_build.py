import os
import json
import time
import shutil
from pathlib import Path

MEM_DIR = "/Volumes/madara/2026/twc-vault/_System/memory"
LOG_FILE = os.path.join(MEM_DIR, "build.log")
STATS_FILE = os.path.join(MEM_DIR, "index_stats.json")
SHARDS_DIR = os.path.join(MEM_DIR, "shards")
CHECKPOINT = os.path.join(MEM_DIR, "index_checkpoint.json")

def finalize():
    print("🚀 Finalizing Meru v3.0 Production Build...")
    
    faiss_path = os.path.join(MEM_DIR, "vault.faiss")
    meta_path = os.path.join(MEM_DIR, "meta.json")
    emb_path = os.path.join(MEM_DIR, "embeddings.npy")
    
    stats = {}
    if os.path.exists(STATS_FILE):
        try:
            with open(STATS_FILE, 'r') as f:
                stats = json.load(f)
        except:
            pass
            
    stats.update({
        "status": "production",
        "faiss_size_gb": round(os.path.getsize(faiss_path) / (1024**3), 2),
        "meta_size_gb": round(os.path.getsize(meta_path) / (1024**3), 2),
        "embeddings_size_gb": round(os.path.getsize(emb_path) / (1024**3), 2),
        "finalized_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "architecture": "FAISS-MiniLM-v3.0",
        "optimization": "Day 5 (Quality Scorer + SHA-256 Dedupe)"
    })
    
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r') as f:
                lines = f.readlines()
                for line in reversed(lines):
                    if "Extraction+encoding done" in line:
                        stats["extraction_time_info"] = line.strip()
                        break
        except:
            pass

    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f, indent=2)
    print(f"✅ Updated {STATS_FILE}")

    print("🧹 Cleaning up temporary build artifacts...")
    if os.path.exists(SHARDS_DIR):
        shutil.rmtree(SHARDS_DIR)
        print("  - Deleted shards/")
    if os.path.exists(CHECKPOINT):
        os.remove(CHECKPOINT)
        print("  - Deleted index_checkpoint.json")
    
    print("\n🎉 Meru v3.0 is now officially in PRODUCTION.")

if __name__ == "__main__":
    finalize()
