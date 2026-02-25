# Vault Memory Index (Meru)

Local semantic search over the full PARA vault — markdown, PDF, EPUB, and DOCX.

## Quick Start

```bash
# Search (uses existing index)
./vmem "sacred geometry"
./vmem search -f pdf "biogeometry"
./vmem search --json "kriya yoga"

# Interactive REPL
./vmem repl
./vmem repl --para Projects --domain "Health/*"

# Check index health
./vmem status
```

## Architecture

```
walker.py          → walks vault, yields (abs_path, rel_path)
chunker.py         → markdown/txt chunking (heading, paragraph, sliding-window)
extractors/
  pdf_extractor.py   → PyMuPDF page-by-page extraction + quality scoring
  epub_extractor.py  → ebooklib chapter-by-chapter extraction
  docx_extractor.py  → python-docx paragraph extraction
  __init__.py        → format router: extract_file(), chunk_file()
batch_processor.py → unified process_file(), checkpoint, memory monitor
embedder.py        → sentence-transformers encoding, FAISS index builder
incremental.py     → mtime tracking, diff detection, index merging
index_full.py      → streaming shard pipeline (extract→encode→shard→assemble)
query_vault.py     → REPL + one-shot + batch search with filters
health_check.py    → index integrity verification
vmem               → shell wrapper CLI
```

## Indexing

Full corpus build (all formats):
```bash
./vmem index                          # all formats
./vmem index --formats pdf,epub       # specific formats
./vmem index --resume                 # resume interrupted build
./vmem index --file-batch 250         # smaller shards (less RAM)
```

The streaming shard pipeline processes files in batches:
1. Extract text + chunk (500 files at a time)
2. Encode chunks with sentence-transformers
3. Save shard to disk (emb + meta)
4. Free memory, repeat
5. Assemble FAISS index from all shards

Incremental updates (markdown only):
```bash
python update_index.py
```

## Search

```bash
# One-shot
./vmem search "sacred geometry"
./vmem search -f pdf "biogeometry"     # only PDFs
./vmem search --para Projects "timeline"
./vmem search --exclude-archives "notes"
./vmem search --json "kriya yoga"      # JSON output

# Batch
./vmem batch queries.txt --json

# REPL
./vmem repl --domain "Health/*" -n 10
```

## Output Files

All in `_System/memory/`:

| File | Description |
|---|---|
| `vault.faiss` | FAISS IndexFlatIP (cosine similarity) |
| `meta.json` | Chunk metadata aligned with FAISS index |
| `embeddings.npy` | Raw embedding matrix for incremental updates |
| `file_hashes.json` | mtime snapshot for change detection |
| `index_stats.json` | Build stats (counts, timing, format breakdown) |
| `scanned_pdfs.txt` | Image-only PDFs that yielded no text |
| `extraction_report.json` | Error summary from last build |

## Key Parameters

- Model: `all-MiniLM-L6-v2` (384-dim, L2-normalized → cosine via inner product)
- Max chunk: 1,200 chars
- Sliding window: 1,000 chars, 200 overlap
- Encoding batch: 256 (sentence-transformers), 5,000 (mega-batch)
- File batch: 500 files per shard

## Requirements

```bash
python3 -m venv .venv-meru
source .venv-meru/bin/activate
pip install -r _System/scripts/memory/requirements-memory.txt
```

Dependencies: sentence-transformers, faiss-cpu, numpy, torch, PyMuPDF, ebooklib, python-docx, beautifulsoup4, lxml
