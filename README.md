# PARA Knowledge Management System (TWC Vault v3.0)

A high-speed, text-focused knowledge management system optimized for AI-driven synthesis and semantic retrieval.

## 🧠 System Architecture

This vault uses a **PARA (Projects, Areas, Resources, Archives)** methodology augmented with a custom **Enneagram-based taxonomy**.

### 1. Samskara (The Heavy Lift)
To keep the main vault lean, all large binaries (PDFs, EPUBs, Videos, Archives) are offloaded to:
` /Volumes/madara/2026/samskara/`
The vault contains **symbolic links** back to these files, allowing seamless access in Obsidian while maintaining a lightweight Git repository.

### 2. Meru (The Semantic Layer)
The vault is powered by a high-performance semantic index:
- **Engine**: FAISS (Facebook AI Similarity Search)
- **Model**: `all-MiniLM-L6-v2` (384-dimensional embeddings)
- **Scale**: **3,202,158 high-quality chunks** semanticized.
- **Deduplication**: SHA-256 deterministic deduplication applied.
- **Quality Scorer**: Chunks are ranked by information density and boilerplate detection.

## Structure

```
/Volumes/madara/2026/twc-vault/
├── 01-Projects/          # Active projects with specific goals
├── 02-Areas/            # Ongoing responsibilities
├── 03-Resources/        # Reference materials (Offloaded to Samskara)
├── 04-Archives/         # Inactive items (Offloaded to Samskara)
├── _System/             # Core system logic, scripts, and Meru memory
└── 90-Templates/        # Reusable templates
```

## Core Workflows

### 🏎️ Semantic Search
Run instant queries across the 3.2M chunk library:
```bash
.venv-meru/bin/python3 _System/scripts/memory/query_vault.py
```

### ✍️ Content Engine
Automatically scaffold content briefs with explicit evidence tracing:
```bash
.venv-meru/bin/python3 _System/scripts/scaffold_content_brief_from_memory.py --topic "Your Topic"
```

## Git Strategy

This repository follows a **text-first, lean** approach:
- **Repository Size**: Reduced from 3.6 GB to ~120 MB after binary offloading.
- **Status**: Synchronized with `Sheshiyer/14113-X-vault`.

---
*This vault prioritizes "the understanding" (text) over "the impressions" (heavy data).*