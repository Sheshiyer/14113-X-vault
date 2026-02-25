# Layered Context Stack for All Brand Content
**Created:** 2026-02-24 02:58 IST
**Purpose:** Ensure all outbound content (Substack, X, LinkedIn, Threads, IG scripts) is generated from 02-Areas + 03-Resources depth, not shallow branching.

## Stack Order (Use in this sequence)

1. **Runtime Lens (Core framing)**
   - `/Volumes/madara/2026/twc-vault/01-Projects/Content-Engine/_approved/ready-to-post/thread-the-runtime.md`
   - Use for: authorship vs user-mode framing.

2. **Architecture Lens (02-Areas)**
   - `/Volumes/madara/2026/twc-vault/02-Areas/Consciousness-Models/_consciousness-architecture-hub.md`
   - Use for: state/process/resource metaphors, bioelectric + information processing vocabulary.

3. **Pattern Lens (02-Areas)**
   - `/Volumes/madara/2026/twc-vault/02-Areas/Pattern-Studies/_pattern-recognition-hub.md`
   - Use for: repeatability, loop detection, intervention logic.

4. **Enneagram Lens (02-Areas)**
   - `/Volumes/madara/2026/twc-vault/02-Areas/Muse-Enneagram-Framework/muse-enneagram-matrix.md`
   - Use for: attention strategy, shadow tax, movement and integration narratives.

5. **Tech-Mystical Lens (02-Areas)**
   - `/Volumes/madara/2026/twc-vault/02-Areas/Technical-Mystical-Integration/_index.md`
   - Use for: debug protocol language, system implementation framing.

6. **Deep Resource Lens (03-Resources)**
   - `/Volumes/madara/2026/twc-vault/03-Resources/Content/Articles/Substack/runtime-of-god-ancient-debug-protocols.md`
   - `/Volumes/madara/2026/twc-vault/03-Resources/Synthesis/Mythic-Journey-HD-Integration-Map.md`
   - Use for: symbolic depth + lived integration case texture.

## Quality Rule (Mandatory)
Every publishable piece must include:
- 1 runtime claim
- 1 pattern claim
- 1 embodied intervention
- 1 non-pitch reflective closure

## Channel Adaptation
- **Substack:** full stack (all 6 lenses)
- **LinkedIn:** lenses 1,2,3,4 + concise implementation block
- **X threads:** lenses 1,3,4 + one sharp pattern interrupt
- **IG captions/carousels:** lenses 1,4 + embodied micro-protocol

## Anti-Shallow Guardrail
If a draft cannot cite at least 2 files from 02-Areas and 1 file from 03-Resources, keep it in `_processing/`.

## Hook Automation (Upgraded 2026-02-24)

### Enabled Workspace Hooks
- **SessionStart** → runs Content-Engine consistency audit
- **Daily 08:15 IST** (`SchedulerTick`) → runs audit + posts prompt summary task
- **Monday 08:45 IST** (`SchedulerTick`) → bootstraps briefs + runs audit + prompts weekly depth-fix workflow

Hook config:
- `/Users/sheshnarayaniyer/.craft-agent/workspaces/my-workspace/hooks.json`

Audit script:
- `/Users/sheshnarayaniyer/.craft-agent/workspaces/my-workspace/scripts/content-engine-consistency-audit.py`

Brief bootstrap script:
- `/Users/sheshnarayaniyer/.craft-agent/workspaces/my-workspace/scripts/content-engine-brief-bootstrap.py`

Latest report output:
- `/Volumes/madara/2026/twc-vault/01-Projects/Content-Engine/editorial/performance-reports/content-consistency-latest.md`

### Manual Run
```bash
python3 /Users/sheshnarayaniyer/.craft-agent/workspaces/my-workspace/scripts/content-engine-consistency-audit.py
python3 /Users/sheshnarayaniyer/.craft-agent/workspaces/my-workspace/scripts/content-engine-brief-bootstrap.py --overwrite
```
