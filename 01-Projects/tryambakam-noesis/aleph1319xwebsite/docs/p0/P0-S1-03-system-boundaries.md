# P0-S1-03 System Boundaries

Date: 2026-02-16
Owner: Tech Lead
Status: Complete

## In Scope
- Infinite-canvas ecosystem map and narrative layers
- Layer nodes, overlays, and conversion pathways
- Integration-link registry to existing Noesis compute surfaces
- Content publishing/admin workflows
- Analytics and funnel instrumentation

## Out of Scope
- Engine web calculators or engine-specific frontend workflows
- Reimplementation of Selemene computational logic
- TUI replacement or API core rewrite

## Integration Surfaces
- API references: Selemene endpoints
- Tooling references: TUI command pathways
- Web references: 1319 webapp links

## Interface Contract
Website nodes can:
- Describe what a layer does
- Show prerequisites and outcomes
- Offer explicit handoff actions

Website nodes cannot:
- Execute engine calculations directly
- Present form-based engine query UIs

## Architectural Principle
The website is the field map and initiation shell. Computation remains in specialized compute surfaces.
