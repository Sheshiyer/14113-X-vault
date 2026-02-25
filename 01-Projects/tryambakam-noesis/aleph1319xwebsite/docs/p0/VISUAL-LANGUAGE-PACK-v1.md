# Visual Language Pack v1 (Frozen Pre-Skeleton Baseline)

Date: 2026-02-16
Status: Frozen
Direction: Ritual-Tech Noir constrained by Monastic Signal

## 1. Design Intent
The interface should feel like entering an intelligent field, not opening an app. It must be cinematic without becoming ornamental, dense without becoming cluttered, and touch-first without losing depth.

## 2. Color System

### Core Palette
- Deep Ink `#1A1A2E`
- Bone `#F5F0E8`
- Aged Gold `#B8860B`
- Stone Grey `#6B6B6B`
- Terracotta `#C65D3B`

### Extended Utility Palette
- Night 900 `#0E1020`
- Night 800 `#14172A`
- Mist 300 `#C6C7CE`
- Mist 200 `#DADBE1`
- Signal Cyan `#3EA7A3`

### Surface Rules
- Base canvas uses Night 900 -> Night 800 planes.
- Overlays use elevated Night 800 with subtle stroke contrast.
- Gold is reserved for interactive emphasis and progression moments.
- Terracotta is reserved for warnings and friction states.

## 3. Typography
- Display: Cormorant Garamond
- Body/UI: Source Sans 3
- Mono/Terminal: JetBrains Mono

### Type Scale
- Display XL: 72/1.0
- Display L: 56/1.05
- Heading L: 40/1.1
- Heading M: 32/1.15
- Heading S: 24/1.2
- Body L: 18/1.5
- Body M: 16/1.55
- Body S: 14/1.5
- Meta XS: 12/1.4

## 4. Spatial and Composition Grammar
- Infinite canvas is the primary plane.
- Scene overlays are secondary planes, never full app dashboards.
- Content aligns to an 8pt spacing base.
- Use sharp or low-radius corners (2-8px), never pill-heavy UI.
- Use subtle grid and signal-line motifs for atmosphere.

## 5. Motion Grammar

### Motion Verbs
- Drift: ambient camera and node movement.
- Focus: camera settle and node amplification.
- Distort: glitch/mask transition between narrative states.
- Reveal: text frame and content emergence.
- Resolve: terminal entry and readable resting state.

### Timing Tokens
- Instant: 80ms
- Fast: 160ms
- Base: 240ms
- Slow: 360ms
- Deep: 520ms

### Easing Tokens
- Standard: `cubic-bezier(0.22, 1, 0.36, 1)`
- Exit: `cubic-bezier(0.4, 0, 1, 1)`
- Enter: `cubic-bezier(0, 0, 0.2, 1)`
- Glitch snap: `steps(6, end)` for micro bursts only

## 6. Transition Rules

### Canvas -> Scene Overlay
1. Node pulse and halo (120ms)
2. Short distortion wipe (180ms)
3. Overlay frame rise + text stagger (240ms)
4. Read state lock

### Scene -> Terminal Mode
1. Overlay recedes to mono frame
2. Scanline + decode text pass
3. Terminal prompt appears in mono baseline
4. Adapter status badge resolves (`scripted` or `live`)

### Terminal -> Canvas
1. Prompt fades to command artifact
2. Artifact collapses into selected node
3. Camera restores previous coordinate and zoom

## 7. Mobile Interaction Contract
- One-finger pan to move field.
- Two-finger pinch for zoom.
- Tap on node to focus.
- Second tap opens scene.
- Long-press opens quick actions.
- Min target size: 44px.
- Edge-safe controls avoid iOS/Android gesture conflicts.

### Mobile Performance Contract
- DPR cap at 1.25 on touch devices.
- Reduced active chunk radius on small screens.
- Disable heavy post effects below device capability threshold.
- Use low-frequency shader animation and static grain fallback.

## 8. Easter Egg Rules
- Tier 1: visual anomalies (glyph pulse, hidden phrase).
- Tier 2: interaction secrets (gesture sequence unlock).
- Tier 3: narrative unlock (terminal phrase reveals hidden scene).
- Easter eggs must never block primary flow.

## 9. Accessibility Contract
- WCAG AA contrast minimum for all text and controls.
- Keyboard parity for all core interactions on desktop.
- Reduced motion setting disables distort/glitch bursts.
- `/index` linear fallback for non-WebGL and assistive use.

## 10. Freeze Governance
- Any change to color, type, motion, or interaction requires a version bump.
- Baseline freeze version: `v1.0-pre-skeleton`.
