# Figma Frame Map v1 (Pre-Skeleton)

Date: 2026-02-16
Status: Frozen
Applies To: `v1.0-pre-skeleton`

## 1. Figma File Structure

### Page 00 - Cover and Governance
- `00.01 Project Cover`
- `00.02 Version + Changelog`
- `00.03 Freeze Rules`
- `00.04 Review Checklist`

### Page 01 - Foundations
- `01.01 Color Tokens (Global)`
- `01.02 Semantic Color Modes (canvas/overlay/terminal/mobile-compact)`
- `01.03 Typography Scale`
- `01.04 Spacing/Radius/Border/Shadow`
- `01.05 Motion Duration + Easing Tokens`

### Page 02 - Motion and Transition Grammar
- `02.01 Motion Verbs (drift/focus/distort/reveal/resolve)`
- `02.02 Canvas -> Scene transition timeline`
- `02.03 Scene -> Terminal transition timeline`
- `02.04 Terminal -> Canvas transition timeline`
- `02.05 Reduced Motion variants`

### Page 03 - Information Architecture and Journey
- `03.01 Narrative map (canvas clusters)`
- `03.02 Entry and conversion paths`
- `03.03 Easter egg reveal ladder`
- `03.04 Route map (/, /scene/[slug], /terminal, /index)`

### Page 04 - Desktop Experience Frames
- `04.01 Home Canvas (idle)`
- `04.02 Home Canvas (focused node)`
- `04.03 Scene Overlay (read state)`
- `04.04 Scene Overlay (transition state)`
- `04.05 Terminal Preview (scripted)`
- `04.06 Terminal Preview (live)`
- `04.07 Terminal Preview (degraded fallback)`

### Page 05 - Mobile Experience Frames
- `05.01 Mobile Canvas (idle)`
- `05.02 Mobile Canvas (tap focus)`
- `05.03 Mobile Scene Overlay`
- `05.04 Mobile Terminal Preview`
- `05.05 Mobile Long-Press Quick Actions`
- `05.06 Mobile Reduced Motion`

### Page 06 - Component Library (Foundations to Atoms)
- `06.01 Canvas Primitives`
- `06.02 Nav and Controls`
- `06.03 Scene Components`
- `06.04 Terminal Components`
- `06.05 Conversion Components`

### Page 07 - Component Library (Molecules to Organisms)
- `07.01 Node Cluster Patterns`
- `07.02 Overlay Composition Patterns`
- `07.03 Terminal Session Patterns`
- `07.04 CTA + Journey Patterns`

### Page 08 - Responsive Specs
- `08.01 Breakpoint behavior matrix`
- `08.02 Touch interaction maps`
- `08.03 Density shifts`
- `08.04 Performance tiers`

### Page 09 - QA and Handoff
- `09.01 Token compliance audit`
- `09.02 Variant completeness audit`
- `09.03 Accessibility audit frames`
- `09.04 Engineering handoff checklist`

## 2. Frame Sizes and Layout Grids

### Desktop Core Frames
- `1440 x 1024` (default canvas working frame)
- `1920 x 1080` (presentation and cinematic checks)
- Grid: 12 columns, 80px margins, 24px gutters

### Tablet Frames
- `1024 x 768`
- Grid: 8 columns, 40px margins, 20px gutters

### Mobile Frames
- `390 x 844` (primary)
- `430 x 932` (large phone)
- `360 x 800` (compact phone)
- Grid: 4 columns, 16px margins, 12px gutters

### Spacing Base
- 8pt system with 4pt micro-step allowed for icon/text optical adjustments.

## 3. Variable Collections in Figma

Create these collections in order:
1. `Noesis Global`
2. `Noesis Semantic`
3. `Noesis Component`
4. `Noesis Modes`

Modes to define:
- `default`
- `canvas`
- `overlay`
- `terminal`
- `mobile-compact`

## 4. Component Publishing Order

1. Canvas primitives
2. Navigation and control set
3. Scene overlay set
4. Terminal set
5. Conversion and journey set
6. Pattern assemblies

## 5. Required Prototype Flows

1. `Canvas idle -> focus -> scene -> back`
2. `Scene -> terminal (scripted)`
3. `Scene -> terminal (live)`
4. `Terminal degraded -> scripted fallback`
5. `Mobile tap/tap/long-press interactions`
6. `Reduced-motion path`

## 6. Freeze Criteria

The frame map is considered locked when:
- All pages above exist.
- All key flows are prototyped.
- Token references are variable-based (no hardcoded style drift).
- Component variant matrix is fully represented in component sets.
