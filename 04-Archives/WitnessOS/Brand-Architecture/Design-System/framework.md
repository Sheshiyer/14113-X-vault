---
tags: [design-system, visual, framework]
aliases: [Visual Framework, UI System]
created: 2024-12-05
---

# Visual Design System Framework
![[design-system-overview]]

## Typography
```css
--font-display: "Roshage"          /* Hero text */
--font-nav: "Monument Extended"     /* Navigation */
--font-body: "JetBrains Mono"      /* Technical */
--font-ui: "Inter"                 /* Interface */
--font-accent: "Syncopate"         /* Mystical */
```

## Colors
See: [[Colors/framework|Color System]]

## Components
- [[Button System]]
- [[Card Components]]
- [[Navigation Elements]]
- [[Form Controls]]

## Animation Patterns
See: [[Animation Guidelines]]

### Core Patterns
```typescript
interface AnimationSystem {
  entry: "bottom-up" | "opacity-fade",
  hover: "glow" | "scale" | "transition",
  scroll: "parallax" | "fadeIn"
}
```

## Related
- [[Implementation Guide]]
- [[Component Library]]
- [[Animation System]]