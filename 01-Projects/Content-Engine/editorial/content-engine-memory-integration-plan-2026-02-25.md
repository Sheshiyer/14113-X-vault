# Content Engine × Skills × Memory Index Integration Plan

Date: 2026-02-25
Context scanned:
- `/Volumes/madara/2026/twc-vault/.claude/skills`
- `/Volumes/madara/2026/twc-vault/04-Archives/System-Architecture-History/Hybrid_PARA_System_Implementation_Plan.md` (Archived)
- `/Volumes/madara/2026/twc-vault/_System/scripts/memory/*`

---

## 1) What You Already Have (Leverage Map)

### A. Skill-layer (strategy + routing)
- Strong 6-stage ingestion pipeline (`discovery → extraction → analysis → routing → processing → integration`).
- `layered-context-content-skill` already enforces high-quality content constraints:
  - minimum source lattice (`02-Areas` + `03-Resources` + project docs)
  - depth gates (runtime claim, pattern claim, embodied intervention, non-pitch closure)
  - channel recipes (Substack / X / LinkedIn / IG)

### B. Memory-layer (semantic retrieval)
- Working local semantic stack in `_System/scripts/memory`:
  - walker (`walker.py`)
  - chunking + extractors (md/txt/pdf/epub/docx)
  - embeddings (`all-MiniLM-L6-v2`, 384-dim)
  - FAISS index + metadata
  - query CLI (`query_vault.py` / `vmem`)
- Architecture is already read-only against vault content and side-loaded into `_System/memory`.

### C. Hybrid PARA plan (Historical reference)
- The XTDB + Chroma plan (now archived) is strong for potential long-term temporal + semantic graphing.
- Current Status: Superseded by the v3.0.0 Skills + Meru (FAISS) pipeline which is operational now and treated as the execution baseline.

---

## 2) Core Integration Opportunity

### Current gap
Content generation flow and semantic retrieval flow are adjacent but not tightly coupled.

### Target state
Every content brief should be generated from semantic retrieval first, not manual source picking.

**Integration contract:**
1. Topic seed enters Content Engine.
2. `vmem`/`query_vault.py` retrieves top evidence chunks (filtered by PARA/domain/format).
3. Source lattice is auto-filled into brief YAML.
4. Layered depth gates run.
5. Draft gets generated with explicit evidence trace.

Result: Better reuse, less hallucinated abstraction, faster consistency.

---

## 3) Immediate Improvements (High ROI)

## 3.1 Memory indexing improvements

1. **Fix incremental scope mismatch**
- `index_full.py` supports multi-format indexing.
- `update_index.py` currently walks with default extension behavior (md/txt bias).
- Improvement: pass explicit extension set in incremental mode so PDF/EPUB/DOCX changes are included.

2. **Fix undefined emitter path**
- In `update_index.py` full rebuild loop, `emitter.emit(...)` is referenced without local definition.
- Improvement: remove or guard with optional no-op emitter.

3. **Add deterministic dedupe before embedding**
- Dedupe by file hash + near-duplicate chunk signatures to avoid repeated chunks (especially ritual drafts and repeated wrappers).

4. **Promote quality signals into ranking**
- You already use priority by PARA and MOC links in metadata.
- Add penalties for:
  - tiny chunks
  - low-information boilerplate
  - duplicate heading windows

5. **Harden walker configurability**
- Move skip dirs / min bytes / extension set to config file.
- Add include/exclude path prefixes for content-engine-specific runs.

## 3.2 Content Engine leverage improvements

1. **Auto-brief from semantic retrieval**
- Add script: `scaffold_content_brief_from_memory.py`
- Inputs: topic, channel, para/domain filters.
- Output: brief YAML with `sources.areas/resources/project` prefilled from top K results.

2. **Evidence block in each draft**
- Add a non-publish section in `_processing` drafts:
  - `Evidence Used` (path + heading + score)
- This aligns with layered-context non-negotiable traceability.

3. **Channel-specific retrieval profiles**
- X threads: favor `Projects + Areas`, recent docs.
- Substack: favor deep `Resources` + foundational `Areas`.
- LinkedIn: mix practical project docs + selected resources.

4. **Promotion gates from _processing → _approved**
- Require brief to include:
  - min 2 area sources
  - min 1 resource source
  - at least 1 direct quote chunk from retrieval

---

## 4) Suggested Workflow (Operational)

1. `vmem search --para Areas <topic>`
2. `vmem search --para Resources <topic>`
3. `vmem search --para Projects <topic>`
4. Feed top results into brief YAML.
5. Generate draft using layered-context-content-skill rules.
6. Validate gates.
7. Promote to `_approved/ready-to-post` only if gates pass.

---

## 5) 7-Day Execution Plan

### Day 1-2: Reliability fixes
- Patch `update_index.py` emitter guard.
- Align incremental format coverage to match full index.
- Add small test runs on sample folders.

### Day 3-4: Integration glue
- Build `scaffold_content_brief_from_memory.py`.
- Add source-trace schema to brief YAML.

### Day 5: Ranking and dedupe
- Add pre-embedding dedupe pass.
- Add scoring adjustments for low-signal chunks.

### Day 6: Workflow gates
- Add promotion checks (`_processing` → `_approved`).

### Day 7: Pilot
- Run 5-topic pilot and compare:
  - drafting time
  - source depth
  - publish readiness

---

## 6) Strategic Note on XTDB + Chroma Plan

This plan has been moved to `04-Archives/System-Architecture-History/`. Keep it as a potential Phase-2 architecture, not an immediate blocker.

Recommended approach:
- Continue production on current v3.0.0 Skills + Meru (FAISS/MiniLM) stack (already working).
- Add clean interfaces (`retrieve_sources`, `write_brief`, `validate_gates`) so storage backend can be swapped later.
- Move to XTDB/Chroma only when query complexity (history + graph joins) becomes a real bottleneck.

---

## 7) Definition of Done for “Reusable Content Engine”

- Every new piece has machine-traceable evidence.
- Briefs are auto-scaffolded from semantic retrieval.
- Quality gates are enforced before approval.
- Incremental indexing catches all supported formats.
- Duplicate/low-signal chunks are reduced.
- Human edit effort shifts from “finding sources” to “sharpening message.”
