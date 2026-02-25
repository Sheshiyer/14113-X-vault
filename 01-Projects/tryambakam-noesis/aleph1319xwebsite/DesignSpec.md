# Tryambakam Noesis Experiential Website Design Spec

| Field | Value |
|---|---|
| Version | 1.2 |
| Last Updated | 2026-02-16 |
| Source Inputs | Ecosystem architecture + `tryambhakam-oasis` motion language + `infinite-canvas` interaction model |

## 1. Product Intent

Build a purely experiential, narrative-first website with two integrated modes:
1. Infinite canvas storytelling space.
2. Terminal-style AI preview interface (cloud-prebuilt agent experience).

This website is not a platform dashboard and does not present engine calculators.

## 2. Non-Negotiables (Drift Lock)

- No engine showcase pages as product centerpieces.
- No engine calculator UI in this repo.
- No user auth flows.
- No heavy backend dependency for core browsing experience.
- Mobile-first touch interaction is required.
- Aesthetic research and direction lock happens before implementation skeleton.

## 3. Experience Modes

### Mode A: Infinite Canvas Narrative
- Infinite 2.5D/3D spatial navigation.
- Story nodes across the Noesis tapestry (field, rituals, narratives, `.init`, mentorship, physical layer).
- Tap/click on node triggers a cinematic transition (glitch/distortion + text frame motion).
- Deep overlays are content/story scenes, not app forms.

### Mode B: Terminal TUI AI Preview
- Rich-text terminal aesthetic surface embedded as an experiential preview.
- User interacts with a prebuilt cloud agent session (preview, not full product ops).
- No login required.
- Fallback mode supports scripted transcript/demo if agent backend unavailable.

## 4. Interaction Rules

- Desktop: drag pan, wheel zoom, keyboard navigation.
- Mobile: one-finger pan, two-finger pinch zoom, tap to focus/open.
- Touch targets >= 44px, with readable focus-state overlays.
- Motion uses inertia and controlled glitch transitions; reduced-motion path available.

## 5. Content Principles

- Narrative progression over feature listing.
- Reveal sequence and easter eggs for depth.
- Cross-links between layers to communicate one coherent field.
- Language remains grounded, precise, and non-gimmicky.

## 6. Functional Scope

- Canvas navigation, chunking, and culling.
- Transition system (visual distortions + GSAP text framing).
- Terminal preview UI shell with mode adapter (live or scripted).
- Local content graph (JSON/MD) to keep core experience functional without backend.
- Mobile-responsive layout with touch-first controls.

## 7. Out of Scope

- Engine frontend build.
- Authenticated user accounts.
- Full workflow automation or multi-service orchestration in v1.

## 8. Performance and Accessibility

- Target FPS: 50+ desktop, 30+ mid-tier mobile.
- Fast initial paint with progressive enhancement.
- Keyboard and screen-reader fallback path (`/index` linear mode).
- No critical WCAG AA violations.

## 9. Primary Routes (v1)

- `/` infinite canvas experience.
- `/terminal` TUI preview entry.
- `/index` linear accessible fallback.
- `/scene/[slug]` deep narrative overlays.
