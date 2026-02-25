# Tryambakam Noesis Experiential Website Architecture

| Field | Value |
|---|---|
| Version | 1.2 |
| Last Updated | 2026-02-16 |
| Delivery Model | Frontend-first experiential site with optional cloud-preview adapter |

## 1. Architecture Summary

The architecture is dual-surface and narrative-driven:
- Surface A: Infinite canvas storytelling runtime.
- Surface B: Terminal-like AI preview interface.

Core browsing and storytelling must function without auth and without external integrations.

## 2. Core Modules

1. Canvas Runtime (`frontend/canvas`)
2. Scene and Overlay System (`frontend/scenes`)
3. Transition and Motion Layer (`frontend/motion`)
4. TUI Preview Surface (`frontend/terminal`)
5. Content Graph (`content/graph`)
6. Easter Egg Engine (`frontend/easter-eggs`)
7. Adapter Interface (`frontend/adapters/agent-preview`)

## 3. Data and State Model

- Local content source (JSON/MD) for scenes, links, and progression.
- Client state for camera, active scene, and revealed easter eggs.
- Terminal adapter state:
  - `mode = scripted | live`
  - `status = connecting | ready | degraded`

No auth tables or user identity model in v1 architecture.

## 4. TUI Preview Integration Strategy

- v1 requirement: terminal UI works in scripted mode by default.
- Optional live mode: connects to a single cloud preview endpoint for prebuilt agent.
- If live mode fails, degrade instantly to scripted mode.
- No user auth required for either mode.

## 5. Touch and Mobile Strategy

- Pointer unification for mouse/touch.
- One-finger pan and two-finger pinch gesture handling.
- Reduced density defaults on mobile.
- Performance knobs: lower DPR cap, fewer active chunks, lower shader complexity.

## 6. Performance Pattern (from infinite-canvas reference)

- Chunk-based rendering.
- Distance and depth culling.
- Progressive texture loading with cache.
- Throttled chunk updates during zoom.

## 7. Security and Privacy

- No auth or account surfaces in v1.
- No PII collection in default mode.
- Minimal telemetry only if explicitly enabled later.

## 8. Delivery Phases

1. Aesthetic research and direction lock.
2. Interaction prototype (canvas + touch behaviors).
3. Narrative scene system + transition language.
4. Terminal scripted mode.
5. Optional live cloud-preview adapter.
