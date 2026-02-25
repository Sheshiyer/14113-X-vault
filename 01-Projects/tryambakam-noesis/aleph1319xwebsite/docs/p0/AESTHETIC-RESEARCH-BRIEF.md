# Aesthetic Research Brief (Pre-Skeleton)

Date: 2026-02-16
Status: Active

## Objective
Choose a unique and executable visual language before implementation skeleton, while preserving touch-first usability.

## Reference Signals Extracted

### From `infinite-canvas`
- Strong spatial immersion with chunk-based performance controls.
- Practical touch model (drag + pinch).
- Progressive asset loading and render culling.

### From `tryambhakam-oasis`
- High-impact cinematic transitions (mask morph, distortion filters).
- GSAP/Flip rhythm for text and composition shifts.
- Glitch/decode micro-interactions for titles.

## Direction Candidates

### Direction A: Monastic Signal
- Mood: sparse, disciplined, architectural, high-contrast.
- Motion: restrained inertia + occasional controlled glitch reveal.
- Risk: may feel too austere without rich transition moments.

### Direction B: Ritual-Tech Noir
- Mood: dark field + technical overlays + subtle shader atmosphere.
- Motion: layered distortion transitions between scenes and terminal mode.
- Risk: can become noisy on mobile if shader load is not constrained.

### Direction C: Archaeology of the Future
- Mood: manuscript precision + system-diagram overlays + tactile textures.
- Motion: page-to-space transitions, decode text reveals, low-frequency glitch.
- Risk: requires strict typography discipline to avoid visual clutter.

## Mobile Touch Feasibility

It will work if we enforce:
- One-finger pan, two-finger zoom, tap-to-focus interactions.
- Lower default node density on mobile.
- Shader and post-processing quality tiers by device class.
- Full-screen readable overlay cards after node tap.

## Recommended Starting Direction

Direction B (Ritual-Tech Noir), constrained by Direction A's discipline.

Reason:
- Best fit for dual mode (canvas + terminal).
- Supports cinematic transitions you requested.
- Compatible with oasis-style glitch/morph moments while remaining unique.

## Lock Before Skeleton

1. Final color system and type scale.
2. Transition grammar (enter, focus, expand, terminal-switch, exit).
3. Mobile interaction contract.
4. Component primitives (node glyph, overlay shell, terminal panel, easter egg indicator).
