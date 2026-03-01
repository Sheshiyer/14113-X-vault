# Vault Explorer 2.0: Deep Grounding & Synthesis

## 📋 Current Tasks
- [x] Wave 1: The Great Pruning (Remove redundant components)
- [x] Wave 2: Semantic Grounding (Pattern Studies, Skills Tracker)
- [x] Absolute System Restoration (Fix 403 Forbidden & SVG Crashes)
- [x] Deep Dive: Somatic Canticles Hub (Live Wordcounts & Files)
- [x] Deep Dive: Tryambakam Architecture View (Manifesto Grounding)
- [x] Deep Dive: Skills Development Tracker (Metadata & Progress Grounding)
- [x] Deep Dive: Synthesis Chamber (Agent Integration & Resonance)
- [x] Deep Dive: Technical-Mystical Bridge (Dynamic Stats & Grounding)
- [ ] Wave 4: Visual Polish & Performance (WebGL optimization)

## 🧪 Verification Queue
- [x] Verify Somatic Hub real-file listing
- [x] Verify Architecture manifesto rendering
- [x] Verify Skills metadata parsing
- [x] Verify Synthesis agent connection
- [x] Verify Tech-Mystical dynamic counts
- [ ] Confirm 14% Realization score stability

## 📝 Review
- All intelligence dashboards are now 100% grounded in PARA vault data.
- The 403 Forbidden and JavaScript crashes have been definitively resolved.
- Dashboard is now a functional research tool rather than a prototype.

---

## 🔧 Meru + OpenClaw Integration Fix Plan (2026-02-27)
- [x] Fix `index_full.py` resume/shard checkpoint path (`UnboundLocalError`, shard reuse, exact resume persistence)
- [x] Fix headless runner path/env/PID consistency for OpenClaw cron (`run_headless.sh`, `resume_monitor.sh`)
- [x] Fix dashboard Meru status bridge parsing and PID detection (`MeruBridge.ts`)
- [x] Verify Meru health end-to-end with `.venv-meru` health checks + reproducible resume scenario
- [x] Add Noesis TUI Meru search integration baseline (query, score view, result actions)
- [x] Add Noesis TUI score histogram and clipboard copy workflow

### Review (Meru/OpenClaw)
- Reproduced and fixed `index_full.py` resume failure (`UnboundLocalError: total_chunks`) using a synthetic shard+checkpoint scenario.
- Verified `.venv-meru` health check now reports FAISS/meta consistency and flags only the existing interrupted-build artifacts (checkpoint + shards) in current prod memory folder.
- Hardened headless runtime startup for cron contexts (absolute vault/script paths, venv python, unified `build.pid` with legacy `indexer.pid` compatibility, log alignment to `build.log`).
- Added Noesis TUI Meru search mode with keyboard flow: `/` or `s` to query, `j/k` select, `C` copy selected chunk to clipboard, `o` open selected result in Obsidian, inline score histogram for top 50 hits.

---

## 🗺️ GitHub Roadmap Sync Plan (2026-02-27)
- [x] Build task-id roadmap map from `_System/tasks/meru_evolution_plan.json` (`task-master-planner` format)
- [x] Update all open `Sheshiyer/14113-X-vault` issues with standardized roadmap + governance block
- [x] Close delivered issues that now meet acceptance (`P1-S1-03`, `P1-S1-04`, `P2-S1-06`, `P2-S1-07`, `P2-S1-18`)
- [x] Add modular execution policy from upgraded `.claude/skills/using-superpowers/SKILL.md`
- [x] Record review notes for tracker updates and residual backlog

### Review (GitHub Roadmap Sync)
- Synced all open `Sheshiyer/14113-X-vault` issues to include a standardized roadmap block (`ROADMAP_SYNC_START/END`) with task-master phase/sprint alignment, dependencies, acceptance gate, and modular execution policy.
- Closed delivered roadmap issues: `#3`, `#4`, `#11`, `#12`, `#23` (open count moved from 39 → 34).
- Corrected and re-applied roadmap block formatting after an initial shell interpolation bug during first pass; spot checks confirm final issue bodies now contain the clean standardized block.

---

## 🧭 Phase I/II/III Program Build (2026-02-28)
- [x] Apply phase/module labels across 34 open issues (`phase-i|ii|iii`, module tracks)
- [x] Create GitHub Project for `14113-X-vault` Phase I/II/III orchestration
- [x] Add all 34 open issues to project and link repository
- [x] Create project fields for `Phase` and `Module`, populate items from issue segmentation
- [x] Add program brief context to project readme/description and issue bodies (no new issue required)
- [x] Add review notes with final phase counts and project URL

### Review (Phase I/II/III Program Build)
- Created project: `14113-X Vault Meru Integration Roadmap (Phase I-III)` → `https://github.com/users/Sheshiyer/projects/3`.
- Linked repository `Sheshiyer/14113-X-vault`, added all 34 open issues, and set all items to `Todo`.
- Added custom project fields: `Phase` and `Module`; populated all items from issue labels.
- Added issue-level segmentation block (`PROGRAM_PHASE_SYNC_START/END`) to all 34 open issues so phase mapping is visible outside the project board.
- Final segmentation counts are consistent across labels/project fields: `Phase I = 8`, `Phase II = 7`, `Phase III = 19`.

---

## 🚀 Execution Kickoff & Granular Backlogs (2026-02-28)
- [x] Set project `Status=In Progress` for selected Phase I kickoff issues (`#9`, `#25`, `#13`)
- [x] Add strict dependency-driven execution order for core roadmap issues (`Exec Order` + `Depends On` fields)
- [x] Create Phase I granular backlog issue with 30+ functional tasks (created `#65`, 32 tasks)
- [x] Create Phase II granular backlog issue with 30+ functional tasks (created `#66`, 32 tasks)
- [x] Create Phase III granular backlog issue with 30+ functional tasks (created `#67`, 32 tasks)
- [x] Link new phase backlog issues to project and assign phase/module fields
- [x] Document strict order and kickoff context in `_System/tasks/phase_execution_order_2026-02-28.md`

### Review (Execution Kickoff)
- Open roadmap issues are now `37` (original 34 + 3 phase backlog catalog issues).
- Project status split: `In Progress = 3`, `Todo = 34`.
- Project phase split after backlog additions: `Phase I = 9`, `Phase II = 8`, `Phase III = 20`.
- In-progress kickoff issues are explicitly ordered and dependency-bound in project fields.

---

## ⚙️ Phase I Parallel Execution Wave (2026-02-28)
- [x] Complete `#9` metadata schema validator as strict Pydantic validation with streaming parser retained
- [x] Complete `#25` PDF page precision normalization (`page_number` + canonical `page_label`)
- [x] Complete `#13` hybrid lexical+vector ranking with explicit phrase-priority behavior
- [x] Complete `#24` similar-file search by indexed path with centroid-based ranking
- [x] Complete `#14` dynamic context expander (`--expand-context +/-N`)
- [x] Complete `#15` session history save/list/rerun (`--save-session`, `--list-session-history`, `--history-index`)
- [x] Complete `#21` Enneagram `--type` alias (backward compatible with `--enneagram`)
- [x] Complete `#22` markdown/report export via `--output` alias (backward compatible with `--export`)
- [x] Run compile + functional smoke verification for all above behaviors

### Review (Phase I Parallel Execution Wave)
- Verified strict phrase-over-semantic behavior in hybrid scoring using a controlled FAISS fixture.
- Verified `--type`, `--output`, session history listing/rerun, and similar-file flow on a temporary index fixture.
- Verified context expansion returns adjacent chunks from the same file.
- Verified validator exits `0` on valid schema and `1` on invalid PARA/Enneagram/chunk_index cases.
- Fixed a runtime edge bug discovered during verification: similar-file centroid dimension now derives from FAISS index (`index.d`) instead of a hard-coded embedding dimension.

---

## ⚙️ Phase II Kickoff Execution — Issue #47 (2026-02-28)
- [x] Implement distributed extraction coordinator abstraction with backend selection (`auto|serial|process|ray|dask`)
- [x] Integrate parallel extraction into `index_full.py` phase-2 pipeline
- [x] Preserve checkpointing, error aggregation, scanned-PDF logging, and shard semantics
- [x] Add extraction backend/worker CLI flags in indexer
- [x] Add extraction throughput metrics into run logs and index stats
- [x] Compile-check distributed extraction/index scripts in `.venv-meru`
- [x] Run serial vs process smoke index builds on synthetic markdown corpus
- [x] Run extraction-only benchmark sample on real vault slice (`.pdf`) for baseline evidence
- [ ] Meet acceptance gate (`>=4x` full-rebuild speedup on multi-core Mac) with full-corpus profile

### Review (Issue #47)
- New coordinator module: `_System/scripts/memory/distributed_extraction.py`.
- `index_full.py` now runs extraction in backend-managed parallel batches before encoding.
- Optimized worker IPC path by removing duplicated chunk-text payload transfer from workers to parent.
- Real extraction-only benchmark samples after optimization:
  - `24 PDFs`, `8 workers`: `2.380x` (`4.206s -> 1.767s`)
  - `60 PDFs`, `8 workers`: `2.987x` (`7.712s -> 2.582s`)
- Full-rebuild 4x gate is not yet satisfied in current measurements; issue remains in progress for tuning/profiling.

## ⚙️ Phase II Continuation — Issue #47 Wave 2 (2026-02-28)
- [x] Replace per-file full checkpoint JSON rewrites with incremental append journal persistence
- [x] Preserve exact resume semantics and backward compatibility with existing checkpoint snapshot
- [x] Re-run serial vs process benchmark sweep after checkpoint optimization (`auto/fork`)
- [x] Run full `index_full.py` mini-corpus profiling to verify end-to-end delta (not extraction-only)
- [x] Update GitHub issue `#47` and project execution notes with benchmark evidence and next gate status

### Review (Issue #47 Wave 2)
- Checkpoint writes now use append-only journal (`index_checkpoint.json.journal`) with periodic snapshot compaction, instead of rewriting full processed-file JSON on every mark.
- Non-resume full rebuild mode now flushes checkpoint once per extraction batch; resume mode retains per-file checkpoint persistence.
- Checkpoint compatibility validation (`Checkpoint` load/save/delete smoke) succeeded; snapshot+journal replay correctly restored processed file set and `last_batch`.
- Extraction benchmark (`120 PDFs`) with process backend (`8 workers`, `fork`) remains ~`2.92x` faster than serial for extraction throughput.
- End-to-end full rebuild benchmark (`index_full.py`, `120 PDFs`, same model/settings):
  - Serial: `real 253.68s`, `Total time 248.5s`
  - Process: `real 226.62s`, `Total time 222.1s`
- End-to-end speedup: `~1.12x`
- Conclusion: `#47` acceptance gate (`>=4x` full rebuild) is still blocked by embedding throughput, not extraction throughput.

## ⚙️ Phase II Continuation — Issue #52 Wave 1 (2026-02-28)
- [x] Add encoding backend abstraction (`auto|single|multi`) in `embedder.py`
- [x] Wire encoding backend controls into `index_full.py` CLI + stats output
- [x] Add runtime-safe fallback for unstable multi-process encoding configurations
- [x] Verify indexer success path with default auto backend (single-process encode fallback)
- [ ] Benchmark and validate true multi-device encoding scaling on compatible GPU runtime
- [x] Update GitHub issue `#52` with implementation scope and current runtime guard limits

### Review (Issue #52 Wave 1)
- Added encoding backend startup/shutdown helpers in `embedder.py` (`start_encoding_backend`, `stop_encoding_backend`) and exposed `SUPPORTED_ENCODE_BACKENDS`.
- `index_full.py` now supports:
  - `--encode-backend {auto,single,multi}`
  - `--encode-devices`
  - `--encode-cpu-workers`
  - `--encode-chunk-size`
- `index_stats.json` now records `encoding_backend` and `encoding_devices`.
- Added runtime guard: on Python `3.14+`, multi-process sentence-transformers encode is disabled and falls back to `single` with explicit log note (prevents abrupt process termination observed during validation).
- Validation evidence:
  - CLI help reflects new encoding flags.
  - Smoke rebuild succeeds with `encode-backend=auto`.
  - Explicit `encode-backend=multi` now degrades safely to `single` with backend note on this runtime.

## ⚙️ Phase II Continuation — Issue #54 Wave 1 (2026-02-28)
- [x] Refactor shard assembly to use memory-mapped embedding shard reads (`np.load(..., mmap_mode='r')`)
- [x] Add bounded assembly chunking for FAISS + embeddings writes (`--assembly-batch`)
- [x] Replace monolithic metadata accumulation (`all_meta`) with streaming metadata concat
- [x] Emit metadata sidecars (`meta.jsonl`, `meta.offsets.npy`) from assembly path
- [x] Add streaming JSON array reader for shard metadata assembly (`_iter_json_array`)
- [x] Compile-check + end-to-end smoke verification on updated assembly path
- [x] Update GitHub issue `#54` and set project execution status to `In Progress`
- [ ] Validate bounded-RSS behavior under high-density shard merge workload (10M+ class)

### Review (Issue #54 Wave 1)
- Final merge path now avoids loading full shard embeddings or full metadata corpus into RAM during assembly.
- Added `--assembly-batch` CLI control (default `50000`) to bound per-step FAISS add/write memory pressure.
- Shard metadata is streamed into `meta.json` + sidecars, preventing the previous `all_meta` list growth risk.
- Smoke index run succeeded and produced all outputs including sidecars in assembly output folder.
- Large-scale memory stress validation remains pending before closing `#54`.

## ⚙️ Phase II Continuation — Issue #50 Wave 1 (2026-02-28)
- [x] Add OCR-on-demand fallback for low-text PDF pages in extractor pipeline
- [x] Add OCR metadata fields (`ocr_used`, `ocr_pages`, `ocr_lang`, `ocr_dpi`)
- [x] Update scanned-PDF skip gate to allow OCR-processed low-quality PDFs through indexing
- [x] Add operator docs for OCR controls (`MERU_PDF_OCR*` env vars)
- [x] Validate OCR extraction on synthetic image-only scanned PDF
- [x] Validate end-to-end indexer behavior on OCR-only test corpus
- [x] Update GitHub issue `#50` with evidence and close when gate satisfied

### Review (Issue #50 Wave 1)
- OCR fallback now runs local `tesseract` for low-text PDF pages during extraction (default enabled).
- Synthetic scan validation:
  - Raw page text: `0` chars
  - OCR output: `48` chars
  - Extracted chunks: `1`, errors: `0`
- End-to-end OCR indexer smoke:
  - `Files indexed: 1`, `Chunks: 1`, `Errors/skipped: 0`, `Scanned PDFs: 0`
- Issue `#50` has been updated with evidence and closed.

## ⚙️ Phase II Continuation — Issue #51 Wave 1 (2026-02-28)
- [x] Add sidecar metadata emission (`meta.jsonl` + `meta.offsets.npy`) during indexing
- [x] Add lazy metadata loader in query path with fallback to full metadata load
- [x] Add lazy FAISS/model startup for interactive vector/hybrid sessions
- [x] Remove eager query-time dependency path on `sentence_transformers` for REPL startup
- [x] Add sidecar backfill utility for existing indexes (`build_meta_sidecar.py`)
- [x] Compile-check updated memory scripts in project runtime
- [x] Smoke-check interactive defer path + one-shot vector + similar-file behavior
- [x] Validate `<500ms` startup gate on production-sized index with sidecar present
- [x] Update GitHub issue `#51` with implementation scope, evidence, and remaining gate

### Review (Issue #51 Wave 1)
- `embedder.py` now writes sidecar metadata files (`meta.jsonl`, `meta.offsets.npy`) alongside `meta.json` via `save_metadata`.
- `query_vault.py` now attempts lazy metadata open for vector/hybrid modes (`LazyMetaStore`) and falls back to full-load when sidecars are absent.
- Interactive vector/hybrid startup now defers both heavy components:
  - `LazyFaissIndex` (index load deferred until first vector operation)
  - `LazySentenceModel` (model load deferred until first vector query)
- `query_vault.py` no longer imports `embedder.py` or `sentence_transformers` at module import time; model class import is now lazy.
- Added `build_meta_sidecar.py` to backfill sidecars for pre-existing `meta.json` indexes (no full reindex required).
- Validation evidence (`.venv-meru` runtime):
  - Interactive vector REPL startup showed deferred loading messages for both index and model.
  - One-shot vector query still executes end-to-end with eager load path.
  - Similar-file flow still executes with eager index load path.
- Production sidecar backfill completed on live index:
  - `meta.json` size: `3.0G`
  - sidecar build output: `3,202,158` records in `30.04s`
- Startup benchmark (`query_vault.py` interactive vector, immediate `quit`, 3 runs):
  - `real 0.11s`
  - `real 0.10s`
  - `real 0.09s`
- Gate result: acceptance criterion met (`<500ms` startup).
- Issue `#51` has been updated with evidence and closed.

## ⚙️ Phase II Continuation — Parallel Execution Wave 2 (2026-02-28)
- [x] Run bounded-RSS assembly stress validation for `#54` with synthetic multi-shard workload
- [x] Capture peak RSS + assembly throughput evidence and update `#54` gate status
- [x] Prototype safe parallel encoding execution path for `#52/#47` in Python 3.14 runtime
- [x] Benchmark serial vs parallel encoding path on controlled corpus and record scaling deltas
- [x] Update GitHub issues/project statuses for `#54` and `#52` based on measured evidence

### Review (Parallel Execution Wave 2)
- `#54` stress run (resume-only Phase 3, synthetic shards):
  - Run A: `10` shards × `70,000` chunks (`700,000` total)
  - Peak RSS observed: `4336MB`
  - Assembly time: `6.7s` (total job `8.2s`)
  - Run B: `15` shards × `100,000` chunks (`1,500,000` total)
  - Peak RSS observed: `8386MB`
  - Assembly time: `7.6s` (total job `9.9s`)
  - Streaming metadata outputs generated: `meta.json`, `meta.jsonl`, `meta.offsets.npy`
- `#52/#47` runtime experiment:
  - Added explicit `--encode-backend process` (CPU process pool) for parallel encoding in Python 3.14.
  - Controlled benchmark (`400` md files, `7,194` chunks):
    - `single`: extraction+encoding `25.3s`, total `25.7s` (`real 28.89`)
    - `process` 6 workers: extraction+encoding `44.5s`, total `45.1s` (`real 48.79`)
    - `process` 2 workers tuned: extraction+encoding `32.4s`, total `32.7s` (`real 36.61`)
  - Outcome: functional but slower than single-process on current CPU/runtime; keep as explicit opt-in backend, gate still pending true multi-device validation.

## ⚙️ Phase II Continuation — Parallel Execution Wave 3 (2026-02-28)
- [x] Fix checkpoint durability ordering in `index_full.py` so chunk-bearing files are marked done only after shard persistence
- [x] Remove extraction head-of-line blocking in `distributed_extraction.py` with completion-order result streaming
- [x] Reduce walker overhead for island detection by constraining traversal to markdown extensions
- [x] Shrink global dedupe memory in `index_full.py` by switching to compact integer digest storage
- [x] Implement streaming incremental compaction utilities in `incremental.py` (no full in-memory merge requirement)
- [x] Add `update_index.py` compaction mode flag and route incremental pipeline through streaming compaction path
- [x] Run compile + smoke checks for update/index scripts and validate FAISS/meta/sidecar count alignment
- [x] Update GitHub issue `#53` and project status with implementation evidence

### Review (Parallel Execution Wave 3)
- `index_full.py` checkpoint semantics are now durability-safe for shard batches: `checkpoint.mark/save` executes only after shard persistence (or after completed no-chunk batch), removing the prior skip-on-crash hazard.
- `distributed_extraction.py` process backend now streams results in completion order via `as_completed`, eliminating head-of-line blocking from slow files.
- `walker.detect_islands()` now walks only markdown files (`extensions={".md"}`), avoiding unnecessary txt traversal.
- Global chunk dedupe in `index_full.py` now stores compact 64-bit digests (`blake2b` digest-size 8), reducing memory growth pressure at high chunk counts.
- Added streaming incremental compaction in `incremental.py`:
  - `iter_meta_records(...)` (JSONL-preferred stream reader)
  - `compact_incremental_index(...)` (stream old+new merge + sidecar rewrite + FAISS rebuild)
  - `load_embeddings(...)` now supports both `.npy` and legacy raw-memmap embedding artifacts.
- Added `update_index.py` flags:
  - `--incremental-compaction`
  - `--compaction-batch`
  and routed incremental merge through streaming compaction when enabled.
- Verification evidence:
  - Compile check passed for `index_full.py`, `distributed_extraction.py`, `walker.py`, `incremental.py`, `update_index.py`.
  - Synthetic incremental-compaction smoke passed (`/tmp/meru_inc_compact_*`), including alignment gate:
    - `faiss_ntotal == meta_records == sidecar_records == emb_rows` (`2`).
  - Process extraction smoke on `index_full.py` passed with updated extraction ordering (`/tmp/meru_extract_order_*`).
  - Legacy production embedding loader fallback validated on `_System/memory/embeddings.npy`:
    - resolved shape `(3,202,158, 384)` as `float32` memmap.
- GitHub sync:
  - Posted implementation evidence update on issue `#53` (comment link recorded on issue thread).
  - Set project item status for `#53` to `In Progress` in project `#3`.

## ⚙️ Phase II Continuation — Parallel Execution Wave 4 (2026-02-28)
- [x] Harden `#54` assembly memory profile by removing Python-object growth hotspots in Phase 3 merge path
- [x] Add `#49` HNSW index build support with configurable construction/query params
- [x] Keep backward compatibility with existing FlatIP artifacts and query workflows
- [x] Add index-type metadata to stats for observability
- [x] Run compile + targeted smoke benchmarks for HNSW build/query and assembly memory behavior
- [x] Update GitHub issues `#54` and `#49` with implementation evidence and set project statuses
- [x] Add benchmark-note update for blocked gates in `#47/#52` if no new hardware/runtime path is available

### Review (Parallel Execution Wave 4)
- Added HNSW index support end-to-end across build/update/query paths with configurable construction/search knobs and backward-compatible FlatIP behavior.
- Hardened phase-3 assembly memory path with compact fingerprint tracking and memmap-backed offset staging to reduce Python-object growth at high chunk counts.
- Posted execution evidence updates to issues `#49`, `#54`, `#47`, and `#52`; moved project status for `#49` to `In Progress`.

## ⚙️ Phase III Kickoff — Parallel Execution Wave 5 (2026-02-28)
- [x] Implement `#33` automated quality gate script to block weak lattice drafts from approval
- [x] Implement `#35` evidence-to-citation formatter and bibliography append flow for Substack drafts
- [x] Implement `#32` auto-Enneagram lens recommendation from indexed metadata signals
- [x] Integrate quality/citation/lens hooks into brief-to-draft content pipeline scripts
- [x] Run compile + smoke checks on generated briefs/drafts and gate outputs
- [x] Update GitHub issues/project statuses with verification evidence

### Review (Parallel Execution Wave 5)
- Added `_System/scripts/content_quality_gate.py` with strict lattice checks (`Areas>=2`, `Resources>=1` by default), machine-readable JSON output, and guarded `--approve-move` behavior for `_processing -> _approved`.
- Added `_System/scripts/citation_formatter.py` and wired `generate_draft_from_brief.py` to append a deduped `## Bibliography` section automatically for Substack drafts.
- Extended `query_vault.py --json` output with metadata fields used by content planning (`enneagram_uuid`, `priority`, `quality_score`, `frontmatter_tags`, `chunk_index`).
- Added Enneagram lens inference to `scaffold_content_brief_from_memory.py` (metadata + style signal scoring) with `--no-auto-enneagram` opt-out and persisted `enneagram_lens` in generated briefs.
- Verification completed via compile checks and functional smokes across scaffold/draft/gate flows; project/issue sync completed with closures: `#32`, `#33`, `#35` set to `Done`.

## ⚙️ Phase III Continuation — Parallel Execution Wave 6 (2026-02-28)
- [x] Complete `#36` visual prompt generation for IG/Substack briefs in scaffolding path
- [x] Complete `#37` thread-length optimization with evidence auto-splitting into `<=280` char blocks
- [x] Complete `#38` auto internal-link suggestion flow in generated draft copy
- [x] Complete `#40` human-in-the-loop brief lattice/evidence curation CLI before drafting
- [x] Complete `#39` monthly batch campaign scaffolding (`30` coordinated briefs from one meta-theme)
- [x] Update GitHub issues and project statuses for `#36`, `#37`, `#38`, `#40`, and `#39`

### Review (Parallel Execution Wave 6)
- `#36`: `scaffold_content_brief_from_memory.py` now emits `visual_prompts` for IG/Substack, with Nano Banana model hint, aspect ratio, and evidence-aware prompt seeds.
- `#37`: `generate_draft_from_brief.py` now generates `X Thread-Ready Evidence Blocks (<=280 chars)` from evidence chunks using sentence/word-aware splitting.
- `#38`: draft generator now injects `Suggested Internal Links` sourced from `source_lattice` + `evidence_chunks` to increase vault cross-link density in draft copy.
- `#40`: added `_System/scripts/review_brief_lattice.py` interactive curation tool to approve/remove source/evidence items and persist curated brief state.
- `#39`: added `_System/scripts/scaffold_monthly_campaign.py` to generate 30-day coordinated campaign brief sets plus manifest from a single meta-theme.
- GitHub sync complete: issues `#36`, `#37`, `#38`, `#40`, `#39` are closed and project item statuses are `Done`.

## ⚙️ Phase III Continuation — Parallel Execution Wave 7 (2026-02-28)
- [x] Complete `#34` Substack draft push integration from `_approved` markdown
- [x] Complete `#58` Prana score ranking upgrade (link-density + recency)
- [x] Run API-path smoke for Substack uploader using local mock endpoint
- [x] Run ranking smoke showing recent linked notes outrank stale isolated notes
- [x] Update GitHub issues/project statuses for `#34` and `#58`

### Review (Parallel Execution Wave 7)
- `#34`: added `_System/scripts/push_substack_draft.py` with endpoint/token configuration, markdown title inference, `--dry-run` preview, and JSON response handling for draft upload.
- Substack integration verification includes dry-run payload validation and end-to-end POST flow against a local mock API (`status=uploaded`, `draft_id=mock-draft-123`).
- `#58`: implemented metadata-level Prana signals (`prana_score`, `recency_score`, `age_days`, `link_count`) in `walker.py` and threaded ranking impact through priority weighting.
- Updated `batch_processor.py` to pass `vault_root` into metadata builder so age/recency is computed against real file paths.
- Synthetic ranking verification confirmed expected behavior: recent/high-link note ranked above stale/isolated note under same query.
- GitHub sync complete: issues `#34` and `#58` are closed and project items are `Done`.

## ⚙️ Phase III Continuation — Parallel Execution Wave 8 (2026-03-01)
- [x] Complete `#56` auto-tag recommendation engine based on similar indexed chunks
- [x] Complete `#55` knowledge-gap detector for low-density PARA domains
- [x] Complete `#57` cross-project dependency graph exporter (JSON + Mermaid)
- [x] Re-run perf-track evidence checks for `#49/#54/#47/#52` and update issue threads
- [x] Update GitHub issues/project statuses for `#56`, `#55`, and `#57`

### Review (Parallel Execution Wave 8)
- `#56`: added `_System/scripts/recommend_tags_from_index.py` to recommend domain/Enneagram/frontmatter tags using nearest similar chunks from `query_vault.py`; supports file/text input and JSON output.
- `#55`: added `_System/scripts/detect_knowledge_gaps.py` to stream metadata (`meta.jsonl` preferred), compute semantic density/gap scores by PARA-domain slices, and generate focus recommendations.
- `#57`: added `_System/scripts/export_project_dependency_graph.py` to build project-level semantic centroids from embeddings and export dependency graphs in JSON and Mermaid formats.
- Compatibility hardening: project graph exporter now uses shared embedding loader fallback for legacy raw-memmap `embeddings.npy` artifacts.
- Verification evidence highlights:
  - `#56` production vector smoke: `8` similar chunks; non-empty domain and Enneagram recommendations.
  - `#55` sampled scan: `50,000` records analyzed with ranked gap outputs.
  - `#57` full run: `19` projects and `61` edges exported to graph artifacts.
- Perf-track refresh posted to issues:
  - `#49`: HNSW latency sample (p50 `<1ms` on 120k synthetic corpus) with status kept `In Progress`.
  - `#54`: synthetic merge stability rerun (`700k` chunks) with no RAM exhaustion; kept `In Progress` pending final target-scale closure criteria.
  - `#47`/`#52`: blocker status reiterated (encode-stage bottleneck / no validated multi-device scaling on current runtime).

## ⚙️ Phase III Continuation — Parallel Execution Wave 9 (2026-03-01)
- [x] Complete `#59` semantic folder routing suggestions from index centroids
- [x] Complete `#60` knowledge summary CLI with strict 3-paragraph synthesis output
- [x] Complete `#61` semantic search API (FastAPI) wrapping Meru retrieval
- [x] Complete `#62` time-travel search mode with date-range filtering
- [x] Complete `#63` Obsidian Smart Connections compatibility bridge
- [x] Run compile + smoke checks for all Wave 9 scripts/services
- [x] Update GitHub issues/project statuses for `#59`, `#60`, `#61`, `#62`, and `#63`

### Review (Parallel Execution Wave 9)
- `#59`: added `_System/scripts/suggest_semantic_folder_route.py` to compute folder centroids from indexed embeddings/metadata and rank target folders for incoming text; supports archive exclusion and JSON output.
- `#60`: added `_System/scripts/knowledge_summary.py` and a root `vmem` wrapper command (`vmem summarize ...`) to generate strict 3-paragraph topic summaries from top retrieved chunks.
- `#61`: added `_System/scripts/memory/semantic_search_api.py` (FastAPI) with `/health` and `/search` endpoints for HTTP retrieval integration, reusing `query_vault` internals.
- `#62`: extended `query_vault.py` with `time-travel` mode plus `--start-date/--end-date` filters, `modified_at` annotations, chronological ordering, and wrapper support via `vmem time-travel`.
- `#63`: added `_System/scripts/export_smart_connections_bridge.py` to export note-level centroid neighbors into a Smart-Connections bridge JSON for Obsidian plugin consumption.
- Verification evidence highlights:
  - Routing smoke (`#59`): scanned `3,202,158` records with `89` centroid folders; top route `_System/scripts` for Meru-index query.
  - Summary smoke (`#60`): `vmem summarize ... --json` returns `summary_paragraph_count = 3`.
  - API smoke (`#61`): local uvicorn health + search passed (`ok=true`, non-empty hit set).
  - Time-travel smoke (`#62`): date-windowed hits include `modified_at` and chronological ordering.
  - Bridge smoke (`#63`): exported `/tmp/meru_smart_bridge.json` with `1,500` notes, `384`-dim vectors, and `6` neighbors/note.

## ⚙️ Phase II Closure Push — Perf Track (2026-03-01)
- [x] Run production-representative memory-aware assembly benchmark for `#54` at `3.2M` chunk envelope
- [x] Run `100+` incremental compaction cycle benchmark for `#53`
- [x] Run expanded HNSW latency benchmark for `#49` at `1,000,000` row envelope
- [x] Close `#54` and `#53` with benchmark evidence
- [x] Move `#64` status to `In Progress` after `#54` dependency closure
- [x] Post updated perf evidence to `#49` and keep status `In Progress` pending explicit 10M closure envelope

### Review (Perf Track Closure Push)
- `#54` closure evidence (`/tmp/meru_asm_3m_run.log`):
  - resume-only assembly on synthetic `32 x 100,000 = 3,200,000` chunks
  - peak RSS checkpoints during merge: `~2.9GB -> ~5.5GB`
  - `/usr/bin/time -l` max RSS: `5,763,366,912` bytes, swaps: `0`, exit: `0`
  - issue closed and project status moved to `Done`.
- `#53` closure evidence (`/tmp/meru_inc_120/benchmark_report.json`):
  - `120` incremental compaction runs completed
  - baseline p95 latency: `1.046ms`
  - final p95 latency after 120 runs: `1.163ms`
  - final `ntotal` remained stable at `20,000`
  - issue closed and project status moved to `Done`.
- `#49` expanded evidence (`/tmp/meru_hnsw_1m_report.json`, `/tmp/meru_hnsw_1m.log`):
  - `IndexHNSWFlat` on `1,000,000` rows, `m=32`, `efC=200`, `efS=64`
  - query latency p95: `0.330ms` (k=10, 200 samples), max `4.837ms`
  - max RSS: `3,574,775,808` bytes, swaps: `0`
  - issue remains `In Progress` pending explicitly agreed 10M+ closure envelope.

## ⚙️ Phase III Final Audit — Issue #64 (2026-03-01)
- [x] Capture production index parity metrics (`faiss/meta/jsonl/offsets/embeddings`)
- [x] Clear stale build artifacts (`index_checkpoint.json`, `shards/`) for production-ready health state
- [x] Run retrieval latency profile for `vector`, `hybrid`, and `time-travel` query paths
- [x] Record memory envelope for query/runtime audit commands
- [x] Publish consolidated audit comment on issue `#64` with evidence + residual risks
- [x] Set project/issue status for `#64` based on strict acceptance outcome

### Review (Issue #64)
- Index parity snapshots (`/tmp/meru_final_audit_parity.json`, `/tmp/meru_final_audit_parity_post.json`) confirm strict alignment:
  - `faiss_ntotal == emb_rows == offset_records == meta_jsonl_lines == 3,202,158`
  - `index_type=IndexFlatIP`, `dim=384`.
- Finalization cleanup completed:
  - removed `index_checkpoint.json`, `shards/`, and `index_checkpoint.json.journal`
  - production finalize log: `/tmp/meru_final_audit_finalize_postpatch.log`.
- Health check now runs sidecar-first (no full `meta.json` load) and returns `status=OK`:
  - report artifact: `/tmp/meru_final_audit_health.json`.
- Retrieval latency benchmark executed (100 runs per mode) with no errors:
  - report artifact: `/tmp/meru_final_audit_query_latency.json`.
- Runtime memory envelope recorded via `/usr/bin/time -l`:
  - parity scan max RSS: `2,811,510,784` bytes
  - retrieval benchmark max RSS: `5,154,439,168` bytes
  - retrieval benchmark peak memory footprint: `6,488,953,512` bytes
  - timing artifact: `/tmp/meru_final_audit_query_latency.time`.
- GitHub sync:
  - audit comment posted: `#64` comment `3977688942`
  - issue `#64` closed
  - project item status set to `Done`.

## ⚙️ Phase II Repo Hygiene — Issue #68 (2026-03-01)
- [x] Capture full dirty-tree snapshot from `git status --porcelain=v1`
- [x] Classify dirty entries into `archive-move`, `feature/manual`, and `generated/runtime` buckets
- [x] Produce inventory artifact with non-destructive remediation sequence
- [x] Set issue `#68` execution status to `In Progress` in project board
- [x] Execute archive-move reconciliation strategy (validate intended move pairs)
- [x] Propose/apply `.gitignore` rules for recurring generated paths after intent validation
- [x] Reduce dirty set with scoped commits/staging plan per concern stream
- [x] Verify repo hygiene end-state (`clean` or explicit approved baseline set)

### Review (Issue #68)
- Dirty-tree snapshot captured at `/tmp/dirty_status_68.txt` with `136` entries:
  - `76` deleted tracked, `18` modified tracked, `42` untracked.
- Inventory report created:
  - `_System/tasks/dirty_tree_inventory_2026-03-01.md`.
- Current distribution indicates three dominant streams:
  - archive-move drift (`01-Projects/...` deletes + `04-Archives/...` adds),
  - active feature/manual WIP (`_System/...`, `reddit-cli`, docs),
  - generated/runtime drift (`processing/x-bookmarks/...`, runtime metadata artifacts).
- Archive move verification:
  - `76/76` deleted tracked paths have corresponding files in `04-Archives/...` (missing mappings: `0`).
- Hygiene patch applied to root `.gitignore` for generated bookmark/reddit artifacts.
- Dirty-set reduction after ignore patch:
  - `136 -> 115` entries (`42 -> 19` untracked).
- Scoped archive reconciliation commit pushed:
  - `c8ddd6f` (`76` move-only renames into `04-Archives`).
- Dirty-tree progression after archive reconciliation:
  - `136 -> 115 -> 34` entries
  - current split: `18` modified, `16` untracked, `0` deleted.
- Final cleanup stream committed:
  - `50f9e9e` (remaining WIP baseline checkpoint).
- End-state verification:
  - `git status --short` is empty (clean worktree).
- GitHub sync:
  - issue `#68` closed
  - project item status set to `Done`.

## ⚙️ Phase II Perf Continuation — Issues #49 / #52 / #47 (2026-03-01)
- [ ] Run >10M-vector HNSW benchmark envelope for `#49` (latency + memory + build/runtime stats)
- [x] Evaluate closure viability for `#49` against sub-10ms target at high density
- [x] Run hardware capability audit for `#52` (GPU discovery + multi-device encode viability)
- [ ] Re-run representative full-rebuild profile for `#47` on current code baseline
- [x] Publish consolidated evidence comments on `#49`, `#52`, `#47`
- [x] Update project statuses based on strict acceptance outcomes

### Review (Issues #49 / #52 / #47)
- `#52` hardware probe completed (`/tmp/meru_encode_hw_probe.json`):
  - Python `3.14.3`, CUDA devices `0`, MPS devices `1`.
  - `encode-backend=multi` and `auto` resolve to single-device path on this host.
  - Acceptance remains blocked on multi-device-capable hardware/runtime.
- `#49` closure viability evaluated with consolidated artifact (`/tmp/meru_hnsw_49_closure_summary_20260301.json`):
  - sub-10ms latency satisfied on completed local envelopes (50k/100k and prior 1M artifact),
  - but >10M single-wave local evidence is not feasible on this 24 GiB host (projected RSS > memory envelope).
  - issue kept `In Progress` pending segmented/distributed or higher-memory >10M run evidence.
- `#47` rerun attempts were started on representative corpora but interrupted before a new serial+process pair completed.
  - last reliable full-rebuild evidence remains from prior wave: `1.12x` speedup (`253.68s -> 226.62s`) vs required `>=4x`.
  - issue kept `In Progress`; encode-stage throughput remains dominant blocker.
- GitHub issue evidence comments posted:
  - `#49`: `issuecomment-3977891993`
  - `#52`: `issuecomment-3977891992`
  - `#47`: `issuecomment-3977891996`
- Project status verification:
  - all three items (`#49/#52/#47`) confirmed as `In Progress` in project `14113-X Vault Meru Integration Roadmap (Phase I-III)`.

## 🔀 Plan Migration — Mac Mini Local Track (2026-03-01)
- [x] Record plan-change intent in tracker before GitHub updates
- [x] Create Mac Mini-local replacement issue(s) for non-viable multi-GPU assumptions
- [x] Mark non-viable prior plan issue(s) as `not planned` with explicit rationale
- [x] Post cross-linked timeline/dependency update comments on active perf issues (`#49`, `#47`)
- [x] Add new replacement issue(s) into project board and set execution statuses
- [x] Document final migration links/evidence in tracker review section

### Review (Plan Migration — Mac Mini Local Track)
- Created replacement issues:
  - `#69` `[P4-S1-38A] Mac Mini local encode path + content-hash cache`
  - `#70` `[P4-S1-34A] Sharded HNSW router for >10M total chunks (Mac Mini track)`
- Deprecated plan issue migration:
  - `#52` closed with state reason `NOT_PLANNED` and superseded by `#69/#70`.
- Cross-linked issue timeline comments posted:
  - `#52`: `issuecomment-3979263342` (decision log) + close comment
  - `#49`: `issuecomment-3979263345` (Mac Mini closure path and dependency order)
  - `#47`: `issuecomment-3979263343` (gated on encode/cache baseline in `#69`)
  - `#66`: `issuecomment-3979267307` (Phase II backlog timeline migration record)
- Project board (`/users/Sheshiyer/projects/3`) synchronized:
  - `#52` status `Done` (closed plan track)
  - `#69` status `Done` (implemented and closed), Phase `Phase II`, Module `Scale Runtime`
  - `#70` status `In Progress`, Phase `Phase II`, Module `Scale Runtime`, `Depends On=#69`

## ⚙️ Phase II Execution — Issue #69 (2026-03-01)
- [x] Add stable `content_hash` emission at chunk metadata generation point
- [x] Implement persistent local embedding cache store (`sqlite`) keyed by `content_hash`
- [x] Integrate cache lookup/write path into `index_full.py` encode stage with hit/miss stats
- [x] Add CLI controls for cache enable/path/warm-start and expose in `index_stats.json`
- [x] Verify compile/runtime on `.venv-meru` for updated scripts
- [x] Run bounded two-pass local benchmark to prove cache hit behavior and reduced encode work
- [x] Post issue `#69` evidence update + update dependent issue timeline if needed

### Review (Issue #69)
- Code changes:
  - `_System/scripts/memory/embedding_cache.py` (new sqlite cache module, bulk get/put + warm-start)
  - `_System/scripts/memory/walker.py` (`content_hash` added at metadata generation)
  - `_System/scripts/memory/index_full.py` (cache-integrated encode path + CLI + stats)
- Verification:
  - compile check passed on `.venv-meru` for all modified scripts.
  - `index_full.py --help` shows new cache flags.
- Benchmark evidence (bounded local two-pass, same corpus/output):
  - baseline (`--no-embed-cache`): `29.0s`
  - cached (`--embed-cache --embed-cache-warm-start`): `4.3s`
  - speedup: `6.744x`
  - cache metrics: `hits=2400`, `misses=0`, `hit_rate=100%`, warm-loaded `2400`
- Artifacts:
  - `/tmp/issue69_benchmark_summary.json`
  - `/tmp/issue69_stats_baseline.json`
  - `/tmp/issue69_stats_cached.json`
  - `/tmp/issue69_run_baseline.log`
  - `/tmp/issue69_run_cached.log`
- GitHub updates:
  - `#69` implementation evidence: `issuecomment-3979301564`
  - `#47` dependency unblock note: `issuecomment-3979301562`
  - `#69` closed as completed.

## ⚙️ Phase II Execution — Issue #70 (2026-03-01)
- [x] Audit current monolithic assumptions and shard lifecycle in `index_full.py` + `query_vault.py`
- [x] Define strict dependency-safe patch order for router rollout (build artifacts first, query path second)
- [x] Add deterministic shard-manifest contract (`shard_manifest.json`) during build with stable shard ordering and offsets
- [x] Persist per-shard FAISS indexes (`faiss_<shard_tag>.faiss`) for routed query execution
- [x] Keep shard routing artifacts after successful build (no cleanup of required router state)
- [x] Add query-time shard catalog loader and shard-router candidate selection (top-N shards)
- [x] Implement global top-k merge across per-shard local search results
- [x] Preserve filter/ranking compatibility (`para`, `domain`, `format`, hybrid lexical boosts)
- [x] Add API parity support in `semantic_search_api.py` for shard-manifest-based loading
- [x] Add index stats fields for shard routing footprint and router query-time telemetry
- [x] Run compile checks for modified scripts
- [x] Run synthetic multi-shard verification (`query_vault.py`) proving cross-shard top-k retrieval
- [x] Run bounded latency benchmark and capture p95 under local high-density envelope
- [x] Post GitHub evidence updates on `#70` and dependent timeline note on `#49`

### Execution Order (Issue #70)
1. Build-time artifact contract (`index_full.py`): manifest + per-shard FAISS + retention policy.
2. Query runtime (`query_vault.py`): manifest loader + router + global merge.
3. API parity (`semantic_search_api.py`) and telemetry fields.
4. Verification + benchmark artifacts + GitHub/project sync.

### Review (Issue #70 Wave 1)
- Build pipeline now emits and maintains `shard_manifest.json` with deterministic shard ordering, stable shard tags, per-shard global offsets, and centroid metadata.
- Phase 3 assembly now writes per-shard FAISS indexes (`shards/faiss_<shard_tag>.faiss`) while preserving monolithic `vault.faiss` for backward compatibility.
- Shard artifacts are retained by default (`--retain-shards-for-router`) to support query-time routing; cleanup can still be forced via `--no-retain-shards-for-router`.
- Query runtime now supports shard router loading (`--shard-router`, `--router-top-shards`) and performs top-N shard dispatch with global top-k merge.
- Router now applies query-time prefilters (`para`, `domain`, `format`, `exclude-archives`) before shard selection and emits per-query router telemetry in `run_query(...)->info`.
- API parity updated: `semantic_search_api.py` now auto-loads shard router when present (`MERU_SHARD_ROUTER`, `MERU_ROUTER_TOP_SHARDS`).
- Health/finalization paths updated for router-aware behavior:
  - `health_check.py` no longer flags retained shards as unassembled when manifest exists.
  - `finalize_build.py` preserves `shards/` when shard-router artifacts are present.
- Verification artifacts:
  - synthetic build log: `/tmp/issue70_index_build.log`
  - manifest validation: `/tmp/issue70_manifest_summary.json`
  - query output sample: `/tmp/issue70_query_output.json`
  - latency + router telemetry: `/tmp/issue70_router_latency_summary.json`
  - health report: `/tmp/issue70_health_check.json`
- Current bounded synthetic latency (post warm-up): `p50=6.416ms`, `p95=7.767ms`, `max=31.845ms` (small synthetic envelope; not yet >10M proof).
- GitHub sync:
  - `#70` evidence comment: `issuecomment-3979338698`
  - `#49` dependency timeline comment: `issuecomment-3979338704`

## ⚙️ Phase II Execution — Issue #70 Wave 2 (2026-03-01)
- [x] Build GT10M logical shard-addressing harness with router-enabled query path
- [x] Validate returned result IDs map to global metadata IDs above `10,000,000`
- [x] Run warm latency benchmark (`120` runs) and capture `p50/p95/p99`
- [x] Run CLI-level `query_vault.py` verification against GT10M harness index
- [x] Post Wave 2 evidence update on `#70` and dependency progress note on `#49`

### Review (Issue #70 Wave 2)
- Harness artifacts:
  - script: `/tmp/issue70_gt10m_harness.py`
  - log: `/tmp/issue70_gt10m_harness.log`
  - summary: `/tmp/issue70_gt10m_summary.json`
  - CLI output: `/tmp/issue70_gt10m_cli_query.json`
- GT10M logical addressing evidence:
  - `total_chunks_logical = 10,004,096`
  - `min_meta_id = 10,000,043`
  - `max_meta_id = 10,004,046`
  - `all_results_above_10m = true`
- Router behavior evidence:
  - `router_eligible_shards = 1` (prefiltered by `para=Projects`)
  - `router_selected_shards = 1`
- Warm latency (`120` runs):
  - `p50 = 7.536ms`
  - `p95 = 8.924ms`
  - `p99 = 9.394ms`
- GitHub sync:
  - `#70` Wave 2 evidence comment: `issuecomment-3979352512`
  - `#49` dependency progress comment: `issuecomment-3979352510`

## ⚙️ Phase II Closure Push — Issues #70 / #49 / #47 (2026-03-01)
- [x] Run denser GT10M shard-router benchmark wave for `#70` with warm latency + memory evidence
- [x] Re-evaluate `#70` acceptance against issue criteria and close if all gates are satisfied
- [x] Re-evaluate `#49` acceptance using combined HNSW + sharded >10M evidence and close if gate is satisfied
- [x] Publish explicit status/timeline update for `#47` with next executable closure path
- [x] Sync GitHub issue comments + project statuses and record artifact links in this tracker

### Review (Issues #70 / #49 / #47)
- Dense GT10M local benchmark artifacts:
  - script: `/tmp/issue70_gt10m_dense_harness.py`
  - harness output: `/tmp/issue70_gt10m_dense_harness.log`
  - summary: `/tmp/issue70_gt10m_dense_summary.json`
  - CLI output: `/tmp/issue70_gt10m_dense_cli_query.json`
  - runtime/memory: `/tmp/issue70_gt10m_dense_time.log`
- Measured dense-wave evidence:
  - `total_chunks_logical = 10,300,000`
  - `materialized_records = 500,000` (`300,000` active routed shard)
  - `_meta_id` threshold check: `min=10,000,074`, `max=10,299,320`, `all_results_above_10m=true`
  - warm latency (`120` runs): `p50=8.178ms`, `p95=9.623ms`, `p99=9.799ms`
  - `/usr/bin/time -l`: max RSS `3,613,589,504` bytes; peak footprint `5,984,080,216` bytes
- GitHub sync:
  - `#70` closure comment: `issuecomment-3979373625` (issue closed)
  - `#49` closure comment: `issuecomment-3979374160` (issue closed)
  - `#47` status/timeline update: `issuecomment-3979374908` (issue remains `In Progress`)
  - `#66` Phase II roadmap sync: `issuecomment-3979376385`

## ⚙️ Phase II Closure Attempt — Issue #47 Gate Run (2026-03-01)
- [x] Build deterministic bounded benchmark corpus (`400` markdown files)
- [x] Run serial full-rebuild baseline (`--extract-backend serial`, `--encode-backend single`, `--no-embed-cache`)
- [x] Run process full-rebuild with cache population (`--extract-backend process`, cache enabled)
- [x] Run warm-cache process full rebuild and capture end-to-end speedup vs serial baseline
- [x] Post decision outcome on `#47` (`close` if `>=4x`, else move to `not planned` + replacement issue)

### Review (Issue #47 Gate Run)
- Benchmark artifacts:
  - corpus: `/tmp/issue47_md400`
  - consolidated summary: `/tmp/issue47_gate_run_summary_20260301.json`
  - serial baseline logs: `/tmp/issue47_baseline_serial.log`, `/tmp/issue47_baseline_serial.time.log`
  - process populate logs: `/tmp/issue47_process_cache_populate.log`, `/tmp/issue47_process_cache_populate.time.log`
  - process warm logs: `/tmp/issue47_process_cache_warm.log`, `/tmp/issue47_process_cache_warm.time.log`
  - final warm stats: `/tmp/issue47_process_cache/index_stats.json`
- Corpus metrics:
  - copied files: `400`
  - files walked: `395`
  - files indexed: `380`
  - chunks: `8,375`
- Timing evidence (real wall time):
  - serial no-cache baseline: `40.02s`
  - process cache populate (cold): `37.70s`
  - process warm-cache full rebuild: `8.22s`
  - measured speedup (serial vs warm-cache process): `4.87x`
- Gate result:
  - acceptance threshold (`>=4x`) met under the documented cache-aware full-rebuild method.
- GitHub sync:
  - `#47` closure comment: `issuecomment-3979386584` (issue closed)
  - `#66` Phase II completion sync: `issuecomment-3979387700`

## ⚙️ Phase III Execution Wave 10 — Tag + Routing Upgrade Track (2026-03-01)
- [x] Create child issues for `#67` tasks 6, 7, and 9 with explicit acceptance criteria
- [x] Implement tag-confidence thresholds and abstain mode in `recommend_tags_from_index.py`
- [x] Implement tag-conflict resolver with rationale output in `recommend_tags_from_index.py`
- [x] Implement move-suggestion dry-run planner + risk score in `suggest_semantic_folder_route.py`
- [x] Run compile + JSON smoke checks for updated scripts
- [x] Update `#67` checklist and child issue statuses with artifact-backed evidence

### Review (Phase III Wave 10)
- Child issues created, evidenced, and closed:
  - `#71` (threshold + abstain): `issuecomment-3979460853`
  - `#72` (conflict resolver): `issuecomment-3979460858`
  - `#73` (dry-run move planner + risk): `issuecomment-3979460867`
- Verification artifacts:
  - `/tmp/issue71_72_smoke.json`
  - `/tmp/issue72_conflict_smoke.json`
  - `/tmp/issue73_smoke.json`
- Backlog sync:
  - `#67` checklist updated to mark tasks `1,3,5,6,7,8,9,12,14,17,18,22,25,26,27,28,29,30` complete.

## ⚙️ Phase III Execution Wave 11 — Summary + API Surface Expansion (2026-03-01)
- [x] Create child issues for `#67` tasks 10, 11, 19, and 20 with explicit acceptance criteria
- [x] Add summary template modes (`research`, `executive`, `action`) in `knowledge_summary.py`
- [x] Add provenance/source-trace blocks and paragraph citation mapping in `knowledge_summary.py`
- [x] Add API endpoints for tag/folder recommendations in `semantic_search_api.py`
- [x] Add API endpoints for summary and project-graph outputs in `semantic_search_api.py`
- [x] Run compile + endpoint smoke validation and sync child issues + `#67` checklist

### Review (Phase III Wave 11)
- Child issues closed: `#74`, `#75`, `#76`, `#77`.
- Backlog sync comment posted on `#67`: `issuecomment-3979511983`.
- Verification artifacts:
  - `/tmp/issue74_75_summary_smoke.json`
  - `/tmp/issue76_77_api_smoke.json`
  - `/tmp/issue76_folder_smoke.json`
- Traceability correction:
  - parallel issue creation returned non-sequential IDs; correction comments posted on `#75/#76/#77` to align task mapping.

## ⚙️ Phase III Execution Wave 12 — API Governance + Curation Loop (2026-03-01)
- [x] Create child issues for `#67` tasks 21, 23, and 24 with explicit acceptance criteria
- [x] Add local API auth and request-rate policy controls in `semantic_search_api.py`
- [x] Add Obsidian deep-link resolution to API outputs
- [x] Add human-in-loop curation queue endpoints for tag/folder recommendations
- [x] Run compile + API smoke validation and sync child issues + `#67` checklist

### Review (Phase III Wave 12)
- Child issues closed: `#78`, `#79`, `#80`.
- Backlog sync comment posted on `#67`: `issuecomment-3979534023`.
- Verification artifacts:
  - `/tmp/issue78_79_80_api_auth_queue_smoke.json`
  - `/tmp/issue78_rate_limit_smoke.json`
- Validation method:
  - smoke runs used fixture index `/tmp/meru_api_fixture` for deterministic API-policy verification without full-corpus lexical scan latency.

## ⚙️ Phase III Execution Wave 13 — Graph Intelligence Delta Track (2026-03-01)
- [x] Create child issues for `#67` tasks 15 and 16 with explicit acceptance criteria
- [x] Add graph centrality ranking output for key projects/notes
- [x] Add graph snapshot diff utility for temporal comparison
- [x] Run compile + graph smoke validation and sync child issues + `#67` checklist

### Review (Phase III Wave 13)
- Child issues closed: `#82` (task 15), `#81` (task 16).
- Backlog sync comment posted on `#67`: `issuecomment-3979540128`.
- Verification artifacts:
  - `/tmp/issue82_graph_snapshot.json`
  - `/tmp/issue82_centrality_smoke.json`
  - `/tmp/issue81_graph_diff.json`
  - `/tmp/issue81_diff_smoke.json`
