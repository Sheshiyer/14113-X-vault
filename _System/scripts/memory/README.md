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

# Validate metadata schema
python _System/scripts/memory/validate_meta_schema.py
python _System/scripts/memory/validate_meta_schema.py --json
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
incremental.py     → mtime tracking, diff detection, streaming compaction merge
index_full.py      → streaming shard pipeline (extract→encode→shard→assemble)
query_vault.py     → REPL + one-shot + batch search with filters
health_check.py    → index integrity verification
validate_meta_schema.py → chunk metadata schema validator (Pydantic + streaming parser)
vmem               → shell wrapper CLI
```

## Indexing

Full corpus build (all formats):
```bash
./vmem index                          # all formats
./vmem index --formats pdf,epub       # specific formats
./vmem index --resume                 # resume interrupted build
./vmem index --file-batch 250         # smaller shards (less RAM)
./vmem index --extract-backend process --extract-workers 8
./vmem index --extract-backend serial # force single-process extraction
./vmem index --encode-backend auto
./vmem index --encode-backend multi --encode-devices cuda:0,cuda:1
./vmem index --assembly-batch 50000   # bounded FAISS/memmap add chunk size
./vmem index --index-type hnsw --hnsw-m 32 --hnsw-ef-construction 200 --hnsw-ef-search 64

# Backfill lazy metadata sidecars for an existing index (no full reindex)
python _System/scripts/memory/build_meta_sidecar.py \
  --meta-path _System/memory/meta.json
```

The streaming shard pipeline processes files in batches:
1. Extract text + chunk (serial or multi-core backend, 500 files at a time)
2. Encode chunks with sentence-transformers
3. Save shard to disk (emb + meta)
4. Free memory, repeat
5. Assemble FAISS index from shards using bounded add-batches + memory-mapped embedding writes + streaming metadata concat

Extraction backend options:
- `auto` (default): uses local process backend when worker count > 1, else serial
- `process`: local multi-core extraction with `ProcessPoolExecutor`
- `serial`: baseline in-process extraction
- `ray` / `dask`: optional hooks; gracefully fall back to local process backend if unavailable

Encoding backend options:
- `auto` (default): uses multi-process encoding only when 2+ CUDA devices are detected
- `multi`: explicit multi-process encode (CUDA multi-device targets)
- `process`: CPU process-pool encoding backend (experimental; can be slower on small corpora)
- `single`: baseline in-process encode
- `--encode-devices`: comma-separated device list (for example `cuda:0,cuda:1`)
- `--encode-cpu-workers`: CPU worker count for auto device resolution
- `--encode-chunk-size`: optional sentence-transformers multi-process chunk size

Notes:
- On Python `3.14+`, multi-process sentence-transformers encoding is auto-disabled due runtime instability; the indexer falls back to `single` and prints a backend note.
  - `MERU_ENCODE_CPU_THREADS=1` (default on Python `3.14+`) can be overridden to tune CPU threading.
- Scanned PDF OCR-on-demand is enabled by default (requires `tesseract` binary on PATH). Low-text pages are OCR'd during extraction.
  - `MERU_PDF_OCR=0` disables OCR fallback.
  - `MERU_PDF_OCR_LANG=eng` sets OCR language(s) for Tesseract.
  - `MERU_PDF_OCR_DPI=220` controls render DPI used before OCR (clamped 120-400).
  - `MERU_PDF_OCR_PAGE_LIMIT=0` limits OCR pages per PDF (`0` = no limit).

Build logs include extraction throughput (`files/s`, `chunks/s`) and resolved extraction/encoding backends.
Index backend options:
- `--index-type flatip` (default): exact brute-force cosine via `IndexFlatIP`
- `--index-type hnsw`: graph ANN index (`IndexHNSWFlat`) for lower-latency large-corpus retrieval
- `--hnsw-m`, `--hnsw-ef-construction`, `--hnsw-ef-search`: HNSW tuning controls

Incremental updates (markdown only):
```bash
python update_index.py
python update_index.py --incremental-compaction
python update_index.py --incremental-compaction --compaction-batch 50000
python update_index.py --index-type hnsw --hnsw-m 32 --hnsw-ef-construction 200 --hnsw-ef-search 64
```

## Search

```bash
# One-shot
./vmem search "sacred geometry"
./vmem search -f pdf "biogeometry"     # only PDFs
./vmem search --para Projects "timeline"
./vmem search --exclude-archives "notes"
./vmem search --json "kriya yoga"      # JSON output
./vmem search --hnsw-ef-search 96 "checkpoint compaction"

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
| `meta.jsonl` | Line-delimited metadata sidecar for lazy random access |
| `meta.offsets.npy` | Byte offsets for `meta.jsonl` entries (zero-copy lookup) |
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

Dependencies: sentence-transformers, faiss-cpu, numpy, torch, pydantic, PyMuPDF, ebooklib, python-docx, beautifulsoup4, lxml
