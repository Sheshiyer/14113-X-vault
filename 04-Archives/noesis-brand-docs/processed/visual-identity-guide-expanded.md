# Visual Identity Guide (Expanded): Tryambakam Noesis
## Comprehensive Design System for Self-Authored Meaning

**Version**: 2.0 (Expanded)  
**Date**: 2026-01-25  
**Purpose**: Implementation-ready design system for all Tryambakam Noesis touchpoints

---

## 1. Design Tokens (CSS Variables)

### Color Tokens
```css
:root {
  /* Primary Palette */
  --color-deep-ink: #1A1A2E;
  --color-bone: #F5F0E8;
  --color-aged-gold: #B8860B;
  --color-stone-grey: #6B6B6B;
  --color-terracotta: #C65D3B;
  
  /* Opacity Variants */
  --color-deep-ink-90: rgba(26, 26, 46, 0.9);
  --color-deep-ink-70: rgba(26, 26, 46, 0.7);
  --color-deep-ink-50: rgba(26, 26, 46, 0.5);
  --color-deep-ink-10: rgba(26, 26, 46, 0.1);
  
  --color-bone-90: rgba(245, 240, 232, 0.9);
  --color-bone-50: rgba(245, 240, 232, 0.5);
  
  /* Semantic Colors */
  --color-background-dark: var(--color-deep-ink);
  --color-background-light: var(--color-bone);
  --color-text-dark: var(--color-deep-ink);
  --color-text-light: var(--color-bone);
  --color-accent: var(--color-aged-gold);
  --color-border: var(--color-stone-grey);
  --color-attention: var(--color-terracotta);
}
```

### Typography Tokens
```css
:root {
  /* Font Families */
  --font-header: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  
  /* Font Sizes */
  --font-size-h1: 48px;
  --font-size-h2: 36px;
  --font-size-h3: 24px;
  --font-size-body: 18px;
  --font-size-small: 14px;
  --font-size-code: 16px;
  
  /* Line Heights */
  --line-height-tight: 1.1;
  --line-height-snug: 1.2;
  --line-height-normal: 1.3;
  --line-height-relaxed: 1.6;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  
  /* Letter Spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.1em;
}
```

### Spacing Tokens
```css
:root {
  /* Spacing Scale (8px base) */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 96px;
  
  /* Layout Constraints */
  --max-width-text: 680px;
  --max-width-content: 1200px;
  --margin-page: 48px;
}
```

---

## 2. Component Specifications

### Buttons

#### Primary Button
```css
.button-primary {
  background: var(--color-aged-gold);
  color: var(--color-deep-ink);
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  padding: 12px 32px;
  border: 1px solid var(--color-aged-gold);
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: var(--color-deep-ink);
  color: var(--color-aged-gold);
}
```

#### Secondary Button
```css
.button-secondary {
  background: transparent;
  color: var(--color-deep-ink);
  border: 1px solid var(--color-deep-ink);
  padding: 12px 32px;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  transition: all 0.2s ease;
}

.button-secondary:hover {
  background: var(--color-deep-ink);
  color: var(--color-bone);
}
```

#### Ghost Button (for dark backgrounds)
```css
.button-ghost {
  background: transparent;
  color: var(--color-bone);
  border: 1px solid var(--color-bone);
  padding: 12px 32px;
}

.button-ghost:hover {
  background: var(--color-bone);
  color: var(--color-deep-ink);
}
```

---

### Cards

#### Content Card
```css
.card {
  background: var(--color-bone);
  border: 1px solid var(--color-deep-ink-10);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.card-dark {
  background: var(--color-deep-ink);
  color: var(--color-bone);
  border: 1px solid var(--color-bone-50);
}
```

#### Quote Card (for social media)
```css
.quote-card {
  background: var(--color-deep-ink);
  color: var(--color-bone);
  padding: var(--space-xl);
  width: 1080px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.quote-card::before {
  content: '';
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  width: 40px;
  height: 2px;
  background: var(--color-aged-gold);
}
```

---

### Forms

#### Input Fields
```css
.input-text {
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  padding: 12px 16px;
  border: 1px solid var(--color-stone-grey);
  background: var(--color-bone);
  color: var(--color-deep-ink);
  width: 100%;
}

.input-text:focus {
  outline: none;
  border-color: var(--color-aged-gold);
}
```

#### Textarea
```css
.textarea {
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
  padding: 16px;
  border: 1px solid var(--color-stone-grey);
  background: var(--color-bone);
  min-height: 150px;
  resize: vertical;
}
```

---

### Navigation

#### Header Navigation
```css
.nav-header {
  background: var(--color-bone);
  border-bottom: 1px solid var(--color-deep-ink-10);
  padding: var(--space-md) var(--margin-page);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-link {
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  color: var(--color-deep-ink);
  text-decoration: none;
  margin-left: var(--space-md);
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-aged-gold);
}
```

---

## 3. Layout Grid System

### 12-Column Grid
```css
.container {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--margin-page);
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-md);
}

/* Column Spans */
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }
```

### Reading Layout (Long-Form Content)
```css
.content-reading {
  max-width: var(--max-width-text);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-md);
  line-height: var(--line-height-relaxed);
}

.content-reading h1,
.content-reading h2,
.content-reading h3 {
  margin-top: var(--space-xl);
  margin-bottom: var(--space-md);
}

.content-reading p {
  margin-bottom: var(--space-md);
}
```

---

## 4. Animation Principles

### Timing
```css
:root {
  --transition-fast: 0.15s;
  --transition-base: 0.2s;
  --transition-slow: 0.4s;
  
  --easing-standard: ease;
  --easing-in: ease-in;
  --easing-out: ease-out;
}
```

### Micro-Interactions
```css
/* Hover state for interactive elements */
.interactive {
  transition: all var(--transition-base) var(--easing-standard);
}

/* Fade in on load */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s var(--easing-out);
}
```

### Movement Philosophy
- **No bouncing** - Movements are grounded, not playful
- **Subtle transforms** - Max 20px translateY, never excessive
- **Opacity over scale** - Fade in/out preferred, minimal scaling
- **Purposeful motion** - Only animate for functional feedback

---

## 5. Icon System

### Style Guidelines
- **Line-based icons** only (no filled/solid icons)
- **Stroke width**: 1.5px-2px
- **Size**: 24px × 24px (scalable SVG)
- **Color**: Inherit from parent (monochrome)
- **No rounded corners** on icon shapes

### Required Icons
```
• Arrow-right (for CTAs)
• Arrow-left (for navigation back)
• External-link (for outbound links)
• Download (for resources)
• Menu (for mobile nav)
• Close (for modals/mobile nav)
• Check (for completion states)
• Alert-circle (for warnings)
• Email (for contact)
• Quote (for testimonials)
```

### Icon Usage
```html
<svg class="icon" width="24" height="24" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-width="2" fill="none" d="..." />
</svg>
```

```css
.icon {
  display: inline-block;
  vertical-align: middle;
  stroke: currentColor;
  fill: none;
}
```

---

## 6. Responsive Breakpoints

```css
:root {
  --breakpoint-mobile: 640px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1280px;
}

/* Mobile First Approach */
@media (min-width: 640px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### Typography Scale (Responsive)
```css
/* Mobile */
h1 { font-size: 32px; }
h2 { font-size: 24px; }
body { font-size: 16px; }

/* Desktop */
@media (min-width: 1024px) {
  h1 { font-size: 48px; }
  h2 { font-size: 36px; }
  body { font-size: 18px; }
}
```

---

## 7. Image Treatment

### Photography Filters
```css
.image-tryambakam-noesis {
  filter: contrast(1.15) saturate(0.85);
}

.image-vignette {
  position: relative;
}

.image-vignette::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(26, 26, 46, 0.3) 100%
  );
}
```

### Image Borders
```css
.image-bordered {
  border: 1px solid var(--color-deep-ink-10);
}
```

### Background Image Treatment
```css
.hero-image {
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 46, 0.7); /* Overlay for text readability */
}
```

---

## 8. Print Specifications

### Business Card
- **Size**: 3.5" × 2" (standard US)
- **Paper**: 110lb uncoated cotton cardstock
- **Front**: Wordmark centered, Deep Ink on Bone
- **Back**: Contact info in Source Sans 3, minimal

### Letterhead
- **Size**: 8.5" × 11"
- **Paper**: 24lb uncoated laid paper (textured)
- **Header**: Small wordmark top-left
- **Footer**: 1px Deep Ink line, contact info in small type
- **Margins**: 1" all sides

### Packaging Labels
- **Material**: Kraft paper adhesive labels
- **Printing**: Single color (Deep Ink) letterpress or screen print
- **Content**: Product name, ingredients/materials, handling instructions
- **Style**: Minimal, functional, JetBrains Mono for technical specs

---

## 9. Email Templates

### Plain Text Default
Tryambakam Noesis emails should default to **plain text** with minimal HTML:

```
From: [Name] <contact@tryambakam-noesis.example>
Subject: [Subject - always descriptive]

[Greeting]

[Body text - direct, no fluff]

[Clear next step or question]

[Signature]
—
Tryambakam Noesis
A Living System for Self-Authored Meaning
tryambakam-noesis.example
```

### HTML Email (when necessary)
```html
<div style="font-family: 'Source Sans 3', Arial, sans-serif; 
            font-size: 18px; 
            line-height: 1.6; 
            color: #1A1A2E; 
            max-width: 600px; 
            margin: 0 auto;">
  
  <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; 
             font-size: 36px; 
             font-weight: 300; 
             margin-bottom: 24px;">
    [Headline]
  </h1>
  
  <p style="margin-bottom: 16px;">
    [Body text]
  </p>
  
  <a href="[URL]" 
     style="display: inline-block; 
            background: #B8860B; 
            color: #1A1A2E; 
            padding: 12px 32px; 
            text-decoration: none; 
            font-weight: 600; 
            margin: 24px 0;">
    [CTA Text]
  </a>
  
</div>
```

---

## 10. Social Media Specifications

### Profile Images
- **Format**: PNG with transparency
- **Size**: 400px × 400px
- **Content**: Sigil mark centered, Deep Ink on transparent

### Cover Images
- **Twitter**: 1500px × 500px
- **Facebook**: 820px × 312px
- **LinkedIn**: 1584px × 396px
- **Background**: Deep Ink
- **Content**: Tagline in Cormorant Garamond Light, Bone text

### Post Templates (Square - 1080px × 1080px)
```
Type 1: Quote Card
- Background: Deep Ink
- Text: Bone, Cormorant Garamond, centered
- Accent: Single Aged Gold line (40px, 2px thick)

Type 2: Announcement Card
- Background: Bone
- Title: Deep Ink, Cormorant Garamond
- Body: Deep Ink, Source Sans 3
- Accent: Aged Gold for key word

Type 3: Diagram/Illustration
- Background: Bone
- Line art: Deep Ink, single color
- Minimal text, JetBrains Mono for labels
```

---

## 11. Accessibility Checklist

### Color Contrast
- ✅ All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- ✅ Interactive elements have clear focus states
- ✅ Never rely on color alone for meaning

### Typography
- ✅ Min font size 14px on web, 18px for body
- ✅ Line height 1.5+ for readability
- ✅ Sufficient letter spacing on all-caps text

### Interaction
- ✅ All buttons/links keyboard accessible
- ✅ Focus indicators visible and high-contrast
- ✅ Skip navigation links for screen readers
- ✅ Alt text for all meaningful images

### Motion
- ✅ Respect `prefers-reduced-motion` user preference
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Brand Don'ts (Expanded)

### Visual Don'ts
- ❌ Never use gradients (exception: photo vignettes)
- ❌ Never use rounded corners on UI elements
- ❌ Never use drop shadows or glows
- ❌ Never use stock photography with fake diversity
- ❌ Never use decorative script fonts
- ❌ Never use emoji in formal communications
- ❌ Never use "inspire" or "journey" visual clichés
- ❌ Never use cosmic/ethereal imagery (floating, glowing, halos)

### Tone Don'ts (Visual Expression)
- ❌ Never playful or whimsical typography
- ❌ Never warm/nurturing color temperature
- ❌ Never soft edges or organic shapes without intention
- ❌ Never trendy design patterns (won't age well)

---

## 13. File Naming Conventions

### Images
```
tryambakam-noesis-logo-primary.svg
tryambakam-noesis-logo-reversed.svg
tryambakam-noesis-sigil-dark.svg
tryambakam-noesis-social-quote-001.png
tryambakam-noesis-product-blend-hero.jpg
```

### Documents
```
tryambakam-noesis-visual-identity-guide.pdf
tryambakam-noesis-brand-guidelines.pdf
tryambakam-noesis-packaging-specs-v2.pdf
```

### Pattern
- Always lowercase
- Hyphen-separated
- Descriptive, not generic
- Version suffix when iterating (`-v2`, `-v3`)

---

## 14. Collaboration Tools

### Design Tool Recommendations
- **Figma**: For web/UI design (collaborative)
- **Adobe Illustrator**: For logo/vector work
- **Procreate/iPad**: For hand-drawn illustrations
- **Notion**: For documentation and specs

### Sharing Specifications
- Export CSS variables as `.css` file
- Export color palette as `.ase` (Adobe Swatch) for designers
- Provide Google Fonts links in all handoff docs

---

## 15. Implementation Checklist

### Website Launch
- [ ] Load Google Fonts (Cormorant Garamond, Source Sans 3, JetBrains Mono)
- [ ] Implement CSS variables from Section 1
- [ ] Set dark mode as default
- [ ] Add light/dark mode toggle
- [ ] Test contrast ratios in both modes
- [ ] Ensure responsive typography scaling
- [ ] Add focus states to all interactive elements
- [ ] Test with screen reader
- [ ] Verify `prefers-reduced-motion` works

### Social Media Setup
- [ ] Create profile images (sigil mark, 400×400px)
- [ ] Design cover images for each platform
- [ ] Create 5 quote card templates
- [ ] Schedule first 3 posts using templates
- [ ] Verify branding consistency across platforms

### Print Materials
- [ ] Order uncoated cardstock samples
- [ ] Test Deep Ink color match with printer
- [ ] Design business card layout
- [ ] Design packaging label templates
- [ ] Create letterhead template

---

## JSON Export (Extended)

```json
{
  "tryambakam_noesis_visual_system": {
    "version": "2.0",
    "colors": {
      "primary": {
        "deep_ink": { "hex": "#1A1A2E", "rgb": [26, 26, 46] },
        "bone": { "hex": "#F5F0E8", "rgb": [245, 240, 232] },
        "aged_gold": { "hex": "#B8860B", "rgb": [184, 134, 11] },
        "stone_grey": { "hex": "#6B6B6B", "rgb": [107, 107, 107] },
        "terracotta": { "hex": "#C65D3B", "rgb": [198, 93, 59] }
      }
    },
    "typography": {
      "fonts": {
        "header": { "family": "Cormorant Garamond", "weights": [300, 400, 600] },
        "body": { "family": "Source Sans 3", "weights": [400, 600] },
        "mono": { "family": "JetBrains Mono", "weights": [400] }
      },
      "scale": {
        "h1": { "size": "48px", "line_height": 1.1 },
        "h2": { "size": "36px", "line_height": 1.2 },
        "h3": { "size": "24px", "line_height": 1.3 },
        "body": { "size": "18px", "line_height": 1.6 },
        "small": { "size": "14px", "line_height": 1.5 },
        "code": { "size": "16px", "line_height": 1.4 }
      }
    },
    "spacing": {
      "scale": [8, 16, 24, 32, 48, 64, 96],
      "max_widths": {
        "text": "680px",
        "content": "1200px"
      }
    },
    "components": {
      "buttons": ["primary", "secondary", "ghost"],
      "cards": ["content", "quote", "dark"],
      "forms": ["input", "textarea", "select"],
      "navigation": ["header", "footer", "sidebar"]
    },
    "breakpoints": {
      "mobile": "640px",
      "tablet": "768px",
      "desktop": "1024px",
      "wide": "1280px"
    },
    "accessibility": {
      "wcag_level": "AA",
      "contrast_ratios": {
        "deep_ink_on_bone": 14.2,
        "bone_on_deep_ink": 14.2,
        "aged_gold_on_deep_ink": 5.3
      },
      "motion_sensitivity": true
    }
  }
}
```

---

## Conclusion

This expanded visual identity system provides implementation-ready specifications for:
- ✅ Web development (CSS tokens, components, responsive)
- ✅ Print design (specifications for materials, processes)
- ✅ Social media (templates, dimensions, formats)
- ✅ Physical products (packaging, labels, objects)
- ✅ Accessibility (contrast, motion, screen readers)

**All touchpoints now have clear visual guidelines aligned with Tryambakam Noesis philosophy: grounded depth, earned complexity, timeless quality.**

Next: Apply to packaging design + unboxing experience.
