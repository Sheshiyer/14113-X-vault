# Figma Token System Principles v1

Date: 2026-02-16
Status: Frozen

## 1. Token Architecture Layers
1. Global tokens (raw, immutable primitives).
2. Semantic tokens (intent-based aliases).
3. Component tokens (component-level overrides).
4. Mode tokens (theme/context variants, e.g., canvas, overlay, terminal).

## 2. Naming Convention
Format: `category.group.item.state`

Examples:
- `color.ink.900`
- `semantic.surface.canvas`
- `component.node.bg.default`
- `motion.duration.base`
- `typography.heading.l.size`

## 3. Governance Rules
- Never use hex values directly in components.
- Semantic tokens must reference global tokens.
- Component tokens must reference semantic tokens.
- State tokens (`hover`, `focus`, `active`, `disabled`) are explicit.
- Breaking changes require token version increment.

## 4. Required Token Families
- Color
- Typography
- Space
- Radius
- Border
- Shadow
- Opacity
- Motion duration/easing
- Z-index/elevation

## 5. Mode Strategy
Modes for this project:
- `canvas`
- `overlay`
- `terminal`
- `mobile-compact`

Each mode modifies semantic tokens only, preserving global consistency.

## 6. Figma Setup Structure
- Collection: `Noesis Global`
- Collection: `Noesis Semantic`
- Collection: `Noesis Component`
- Collection: `Noesis Modes`

## 7. Component Tokenization Pattern
Each component defines:
- Container: bg, border, radius, shadow
- Content: title, body, metadata text tokens
- Interaction: hover/focus/active tokens
- Motion: enter/exit duration and easing tokens

## 8. Anti-Drift Checklist
- Tokens synced from source JSON before each design sprint.
- New component cannot be added without component tokens.
- Visual QA checks for token violations before handoff.
- Token diff review required before merging design baseline updates.
