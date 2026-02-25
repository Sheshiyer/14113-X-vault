# Figma Handoff Checklist v1

Date: 2026-02-16
Status: Frozen

## Token Setup
- [ ] Import `design-system/tokens/noesis.tokens.json` into Tokens Studio.
- [ ] Create collections: Global, Semantic, Component, Modes.
- [ ] Verify mode aliases resolve without broken references.

## Page Setup
- [ ] Create pages from `FIGMA-FRAME-MAP-v1.md`.
- [ ] Add desktop/tablet/mobile frame templates.
- [ ] Attach layout grids to all core frame templates.

## Components
- [ ] Build component sets for all entries in `COMPONENT-VARIANT-MATRIX-v1.md`.
- [ ] Add required state variants per component.
- [ ] Publish library after variant completeness audit.

## Prototypes
- [ ] Canvas -> Scene flow.
- [ ] Scene -> Terminal (scripted/live/degraded) flow.
- [ ] Mobile tap/tap/long-press and pinch navigation flow.
- [ ] Reduced motion flow.

## QA
- [ ] Color and type usage only through tokens.
- [ ] Contrast checks meet WCAG AA.
- [ ] Touch targets >= 44px on mobile.
- [ ] No engine calculator UI introduced.
- [ ] No auth surface introduced.
