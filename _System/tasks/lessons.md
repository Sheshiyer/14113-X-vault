# Engineering Lessons & Patterns

## 🛡️ Security & Environment
- **Pattern**: 403 Forbidden on local dev server.
- **Lesson**: Vite's strict path normalization often breaks local filesystem access for directories outside root (like .openclaw). 
- **Fix**: Use `server.fs.allow: ['/']` in `vite.config.ts` for local development dashboards.

## ⚛️ React & SVG
- **Pattern**: Uncaught TypeError: Cannot read properties of undefined (reading 'id').
- **Lesson**: Dynamic array slicing in SVG map loops often causes "next-neighbor" overflows.
- **Fix**: Always use `?.` and explicit `if (!node) return null` guards at the start of map callbacks.

## 🧠 Memory Index — Phase B Corpus Build

### OOM on large corpus encoding
- **Pattern**: 14K files → 5.6M chunks. Holding all chunk texts + embeddings in memory = 10+ GB → process killed.
- **Lesson**: Never accumulate all texts AND all embeddings in a single pass for corpora > 500K chunks. The old Phase A pipeline (500K chunks, ~8 GB) barely fit; Phase B (5.6M chunks) does not.
- **Fix**: Streaming/shard architecture — extract + encode in file_batch groups (e.g. 500 files), write embedding shards to disk (`shards/emb_0000.npy`), free text memory after each batch. At the end: mmap or load+vstack shards, build FAISS once. Peak RAM stays under ~2 GB instead of 10+.
- **Rule**: For any pipeline processing > 1M items, design for streaming from the start. Don't retrofit.

### Extraction phase is fast, encoding is the bottleneck
- **Pattern**: Extraction of 14K files (54 GB, all formats) took only ~34 min. Encoding 5.6M chunks at 170 chunks/s ≈ 9+ hours.
- **Lesson**: Budget time/compute for encoding, not extraction. The sentence-transformer model is the real bottleneck.
- **Fix**: Consider IVF-PQ index for corpora > 2M chunks, or batch-encode in background with nohup.

### Checkpoint must cover both extraction AND encoding phases
- **Pattern**: Checkpoint tracked extracted files, but encoding had no checkpoint. If encoding is interrupted at 5%, all extraction work is lost.
- **Lesson**: Save embedding shards incrementally so interrupted encoding can resume from last shard, not from scratch.
- **Fix**: Shard-based checkpoint — each shard saved = progress that survives interruption.

### Error budget for large vault
- **Pattern**: 694 of 14,318 files failed extraction (4.8%). Breakdown: 570 no_chunks, 91 scanned PDFs, 14 unknown, 12 epub errors, 3 key errors, 2 corrupt, 2 runtime.
- **Lesson**: ~5% error rate is normal for a large heterogeneous vault. Don't chase 100% — log and move on.
- **Fix**: `extraction_report.json` + `scanned_pdfs.txt` for post-hoc review. Accept the long tail.
