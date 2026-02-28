# Dirty Tree Inventory — 2026-03-01

Issue: `#68` ([P4-S2-DirtyTree] Repository Dirty-Tree Remediation & Hygiene Baseline)

## Snapshot
- Command: `git status --porcelain=v1`
- Total dirty entries: `136`
- Status split:
  - ` D` deleted tracked files: `76`
  - ` M` modified tracked files: `18`
  - `??` untracked files/dirs: `42`

## Top-Level Distribution
- `01-Projects`: `80`
- `_System`: `29`
- `processing`: `23`
- `04-Archives`: `2`
- `.claude`: `1`
- `README.md`: `1`

## Source Classification
### 1) Archive-Move Drift
- `76` tracked deletions under `01-Projects/tryambakam-noesis/...`
- `2` untracked archive destinations:
  - `04-Archives/noesis-brand-docs/`
  - `04-Archives/selemene-engine/`
- Interpretation: likely incomplete move/relocation sequence (delete side staged by working tree, add side untracked).

### 2) Feature/Manual WIP (Tracked Modifications)
- `18` tracked modifications, concentrated in:
  - `13` under `_System/...` (memory/content tooling and runtime files)
  - `3` under `01-Projects/reddit-cli/...`
  - `1` `.claude/skills/retrieval-skill/SKILL.md`
  - `1` repository `README.md`

### 3) Feature/Manual WIP (Untracked New Assets)
- `16` untracked under `_System/...`:
  - new scripts/tasks artifacts from recent roadmap execution.
- `1` untracked in `01-Projects/reddit-cli/.readme-gen.json`.

### 4) Generated Runtime Drift
- `23` untracked files under `processing/x-bookmarks/...` (state, items, raw dumps, reports).
- `1` modified runtime artifact: `_System/memory/index_stats.json`.

## Non-Destructive Remediation Plan
1. Freeze and separate by concern:
   - Archive move stream (`01-Projects` deletions + `04-Archives` additions).
   - Feature/WIP stream (`_System`, `reddit-cli`, docs/skills edits).
   - Generated stream (`processing/x-bookmarks`, runtime artifacts).
2. Validate archive move intent:
   - Confirm relocation is intentional.
   - Stage paired delete+add in one commit if intentional.
   - Revert unintended delete side only when explicitly approved.
3. Establish generated-artifact policy:
   - Add ignore rules for `processing/x-bookmarks/.state` and output-only report/raw dumps if these are machine-generated.
   - Keep intentional content notes tracked if required by product flow.
4. Document hygiene baseline commands:
   - `git status --porcelain=v1`
   - `git diff --name-only`
   - `git add <scoped files>`
   - `git commit --only <scoped files>` (or explicit add list)
   - final verification: `git status --short`

## Safety Rules Applied
- No destructive reset commands used.
- No bulk revert applied to unrelated files.
- Inventory only; no cleanup actions executed in this pass.
