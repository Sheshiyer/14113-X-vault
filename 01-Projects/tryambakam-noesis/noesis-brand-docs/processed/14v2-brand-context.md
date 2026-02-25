# Tryambakam Noesis V2 — Visual Identity: "Bioluminescent Architecture"

> Tech-Sci-Fi-Solarpunk meets Art-Nouveau with Art-Deco-Techno-Futuristic

---

## Theme Overview

V2 of the Tryambakam Noesis visual identity shifts from **"Grounded Depth"** (v1: stone, leather, manuscript) to **"Bioluminescent Architecture"** — a fusion of:

- **Solarpunk**: Living systems, regenerative growth, organic integration with technology
- **Art Nouveau**: Organic curves, natural forms as structural elements, Mucha-inspired compositions
- **Art Deco**: Geometric precision, symmetrical patterns, metallic surfaces, architectural confidence
- **Techno-Futuristic**: Circuit-trace precision, phosphorescent surfaces, engineered materials

The brand's **core identity remains unchanged**: Tryambakam Noesis is still "The Anatomist Who Sees Fractals" — grounded, direct, respectfully-challenging. V2 changes the **visual substrate**, not the voice.

**Metaphor shift:** V1 was "ancient philosopher's workshop." V2 is "Art Nouveau conservatory where living systems grow through engineered structures."

---

## 1. Color Palette

### Primary Colors

| Color Name | Hex | RGB | Role | Rationale |
|-----------|-----|-----|------|-----------|
| **Void Teal** | `#0A1628` | 10, 22, 40 | Primary (60%) | Deep blue-black with teal undertone. Sci-fi depth meets Art Nouveau twilight. Not pure black (absence) but deep oceanic potential. |
| **Phosphor Cream** | `#F0EDE3` | 240, 237, 227 | Secondary (30%) | Warm luminous off-white. Organic warmth of Art Nouveau on technical substrate. The illuminated page, the phosphorescent surface. |
| **Solar Bronze** | `#C4873B` | 196, 135, 59 | Accent (10%) | Oxidized copper-gold. Art Deco metallic meets solarpunk patina. Earned warmth on engineered surfaces — the color of Art Nouveau copper after decades of rain. |
| **Titanium** | `#8A9BA8` | 138, 155, 168 | Support | Cool blue-grey metal. Tech-futuristic structural element. Neutral ground between organic and engineered. |
| **Chlorophyll** | `#4A7C59` | 74, 124, 89 | Signal | Living green. Solarpunk life-force. Used sparingly for "alive" indicators — moss, growth, vitality signals. |

### 60-30-10 Distribution

```
Void Teal  (#0A1628) — 60% — Backgrounds, large surfaces, primary containers
Phosphor Cream (#F0EDE3) — 30% — Text, cards, secondary surfaces, breathing space
Solar Bronze (#C4873B) — 10% — CTAs, highlights, interactive states, accent lines
Titanium (#8A9BA8) — Support — Borders, secondary text, structural lines
Chlorophyll (#4A7C59) — Signal — "Alive" states, growth indicators, sparingly
```

### Contrast Ratios (WCAG Compliance)

| Pair | Ratio | WCAG Level | Use |
|------|-------|-----------|-----|
| Void Teal on Phosphor Cream | **15.5:1** | AAA | Body text, all text sizes |
| Phosphor Cream on Void Teal | **15.5:1** | AAA | Reversed text on dark |
| Solar Bronze on Void Teal | **5.9:1** | AA | Accent text, headings |
| Titanium on Void Teal | **6.3:1** | AA | Secondary text, borders |
| Chlorophyll on Void Teal | **3.7:1** | AA-Large | Large text only (18px+) |
| Phosphor Cream on Chlorophyll | **4.2:1** | AA-Large | Large text on green |

### CSS Color Tokens

```css
--color-void-teal: #0A1628;
--color-void-teal-90: rgba(10, 22, 40, 0.9);
--color-void-teal-70: rgba(10, 22, 40, 0.7);
--color-void-teal-50: rgba(10, 22, 40, 0.5);
--color-void-teal-10: rgba(10, 22, 40, 0.1);

--color-phosphor-cream: #F0EDE3;
--color-phosphor-cream-90: rgba(240, 237, 227, 0.9);
--color-phosphor-cream-50: rgba(240, 237, 227, 0.5);

--color-solar-bronze: #C4873B;
--color-titanium: #8A9BA8;
--color-chlorophyll: #4A7C59;
```

---

## 2. Typography System

### Fonts

| Role | Font | Weights | Rationale |
|------|------|---------|-----------|
| **Headers** | **Exo 2** | Light (300), Regular (400), SemiBold (600) | Geometric futuristic with organic softness. Art Deco meets sci-fi without losing readability. The letterforms suggest engineered precision with just enough curve to feel alive. |
| **Body** | **Space Grotesk** | Regular (400), Medium (500), SemiBold (600) | Geometric sans-serif from Florian Karsten. Futuristic precision without coldness. Open counters ensure legibility at all sizes. |
| **Data/Technical** | **Fira Code** | Regular (400) | Mozilla's monospace with coding ligatures. Circuit-board aesthetics for technical content. Ligatures for arrows, comparisons, and operators. |

### Type Scale (Desktop)

```css
--font-size-h1: 48px / 1.1 line-height (Exo 2 Light)
--font-size-h2: 36px / 1.2 line-height (Exo 2 Regular)
--font-size-h3: 24px / 1.3 line-height (Exo 2 SemiBold)
--font-size-body: 18px / 1.6 line-height (Space Grotesk Regular)
--font-size-small: 14px / 1.5 line-height (Space Grotesk Regular)
--font-size-code: 16px / 1.4 line-height (Fira Code Regular)
```

### Wordmark Specification

- **Font:** Exo 2 Light
- **Case:** ALL CAPS
- **Tracking:** +120 (wider than v1's +100 for futuristic spacing)
- **Text:** "TRYAMBAKAM NOESIS"

---

## 3. Material Vocabulary

### V2 Materials (13)

| Material | Description | Use In Prompts |
|----------|------------|---------------|
| **Glass** | Borosilicate, etched, stained — Art Nouveau colored panes | Containers, surfaces, sigil elements |
| **Titanium** | Brushed, matte — structural frames and housings | Frames, stands, architectural elements |
| **Oxidized Copper** | Green-patina copper — Art Nouveau weathering | Borders, filigree, decorative structural |
| **Bio-Resin** | Translucent amber-to-clear resin with embedded botanical elements | Book spines, containers, surfaces |
| **Living Moss** | Preserved or living moss — solarpunk life element | Terrariums, surface accents, borders |
| **Crystalline Quartz** | Clear or milky quartz — light-conducting natural geometry | Accent objects, light elements |
| **Stained Glass** | Art Nouveau colored glass panels — Void Teal + Solar Bronze | Windows, sigil treatments, logo |
| **Solar Panel Mesh** | Thin-film solar cells as textile/surface — solarpunk energy | Background texture, surface accents |
| **Mycelium Substrate** | Mushroom-root material — organic tech substrate | Paper replacement, book pages, surfaces |
| **Terrazzo** | Polished composite stone — Art Deco flooring | Primary surface in product photography |
| **Polished Concrete** | Smooth architectural concrete — brutalist-futuristic | Backgrounds, architectural elements |
| **Copper Wire** | Fine gauge copper — circuit-trace organic patterns | Border details, connections, patterns |
| **Etched Circuit Board** | PCB patterns as decorative element — tech-organic fusion | Illustrations, borders, backgrounds |

### V1 → V2 Material Mapping

| V1 Material | V2 Replacement |
|-------------|---------------|
| Stone | Terrazzo / Polished Concrete |
| Wood | Bio-Resin / Mycelium Substrate |
| Paper | Mycelium Substrate |
| Metal | Titanium / Oxidized Copper |
| Leather | Bio-Resin (translucent) |
| Cork | Living Moss |
| Glass | Stained Glass / Borosilicate |
| Dried herbs | Living Moss / Embedded Botanicals |

---

## 4. Mood & Photography Direction

### Mood Keywords

V2: **emergent, regenerative, precision-engineered, luminous, bio-digital, tessellated, iridescent-calm**

### Photography Style

- **High contrast** with **accent lighting** (warm Solar Bronze from above, cool Phosphor glow from below)
- **Reflective surfaces**: glass, polished terrazzo, wet concrete, copper catching light
- **Botanical-mechanical hybrids**: living moss growing on copper frames, ferns emerging through circuit boards, terrariums integrated with tech
- **Greenhouse/conservatory environments**: Art Nouveau ironwork + living plants + engineered glass
- **Still no faces** — hands interacting with bio-digital objects
- **Camera specs remain**: natural light dominant, high-contrast, textural focus
- **New lighting element**: phosphorescent edge-glow on glass objects, Solar Bronze warm highlights

### Environment Palette

| Environment | V1 | V2 |
|-------------|----|----|
| Primary surface | Dark slate stone | Polished terrazzo (Void Teal aggregate) |
| Background | Textured plaster wall (Bone) | Art Nouveau greenhouse glass + iron frame |
| Accent surface | Dark stone pedestal | Oxidized copper stand / living moss base |
| Lighting | Natural sidelight | Natural + Solar Bronze accent rim light |

---

## 5. Illustration Style Guide

### Core Principles

- **Art Nouveau organic curves** meeting **Art Deco geometric precision**
- **Circuit-board patterns** as decorative borders (replacing manuscript marginalia)
- **Mucha-inspired compositions** with tech elements: flowing botanical forms integrated with data streams and structural geometry
- **Geometric Resonance** rendered with engineering precision: Fibonacci spirals, Metatron's cube, Flower of Life
- **Solarpunk botanical-mechanical** hybrids: living systems growing through and around technology

### V1 → V2 Illustration Mapping

| V1 Style | V2 Replacement |
|----------|---------------|
| Manuscript marginalia | Circuit-board border patterns with Art Nouveau curves |
| Scientific illustration (18th c.) | Bio-digital schematic (Art Nouveau + engineering drawing) |
| Cartographic survey | Holographic terrain mapping with organic contour lines |
| Copperplate engraving | Art Nouveau copper-plate etching with circuit filigree |
| Woodblock print (ukiyo-e) | Art Nouveau panel (Mucha-style with bio-digital elements) |

### Icon Style

- **Art Nouveau linework**: flowing organic curves, NOT straight technical lines
- **Circuit-trace accents**: thin copper-colored lines integrated with organic forms
- **Monochrome base**: Void Teal + Phosphor Cream (same two-tone principle as v1)
- **Geometric Resonance substructure**: each icon built on geometric foundation visible as faint grid

---

## 6. V2 Sigil Specification

### Concept

V1 sigil: Three converging lines (cartographic convergence mark)
V2 sigil: Three converging **fiber-optic filaments**

### Description

Same meaning — Soma (source signal), Manas (witness capacity), Muladhara (physical grounding) — but rendered as:

- Three bioluminescent glass fibers converging to a single nexus point
- Each filament carries a different hue: Void Teal, Solar Bronze, Chlorophyll
- The convergence point emits a soft phosphorescent glow (Phosphor Cream)
- Art Nouveau organic curves guide each filament's path — not straight, but flowing
- Circuit-trace precision at micro level (visible up close, organic at distance)
- Glass material: the fibers appear to be actual illuminated glass tubes

### What It Is NOT

- NOT a third eye, NOT a triangle, NOT mystical
- NOT neon/glowing (subtle phosphorescence, not LED brightness)
- NOT symmetrical (organic curves = asymmetric convergence)
- A **bio-digital convergence point** — where living signal meets engineered witness meets grounded structure

---

## 7. Master Negative Prompt (V2)

Append to ALL image generation prompts:

```
steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi,
lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text,
stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds,
wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art,
anime, manga, cartoon, pixel art, low poly, 8-bit
```

---

## 8. Avoidance List (V2)

### Visual Avoidance

- NO "cyberpunk" neon dystopia
- NO steampunk gears/clockwork cliche
- NO tron-grid / Tron Legacy aesthetic
- NO chrome-everything surfaces
- NO holographic/rainbow iridescence
- NO anime/manga style
- NO stock photo warmth/diversity theater
- NO soft/diffused lighting
- NO cosmic/floating/ethereal imagery

### What IS Allowed

- YES organic + engineered fusion (the core of the theme)
- YES patina and age on metal (Art Nouveau weathering on copper)
- YES living elements (moss, fern, lichen) integrated with technology
- YES geometric precision (Art Deco) combined with organic flow (Art Nouveau)
- YES phosphorescent/bioluminescent glow (subtle, not neon)
- YES Geometric Resonance as structural element (not decoration)
- YES glass as primary material (stained, etched, borosilicate)

---

## 9. Voice-Visual Alignment

The voice remains identical. How V2 visuals map to the same voice:

| Voice Principle | V1 Visual Expression | V2 Visual Expression |
|-----------------|---------------------|---------------------|
| Grounded | Deep stone colors, no floating | Deep teal foundation, rooted botanical elements |
| Direct | Sharp edges, clear typography | Geometric precision, clean circuit traces |
| Respectful-Challenging | Dense information, rewards study | Layered complexity (organic + geometric + tech) |
| Earned authority | Classical serif typography | Futuristic geometry with Art Nouveau gravitas |
| Protects ambiguity | Negative space, not everything explained | Organic forms partially obscured by structure |

---

## 10. V1 → V2 Comparison Table

| Token | V1 ("Grounded Depth") | V2 ("Bioluminescent Architecture") |
|-------|----------------------|-----------------------------------|
| **Primary** | Deep Ink `#1A1A2E` | Void Teal `#0A1628` |
| **Secondary** | Bone `#F5F0E8` | Phosphor Cream `#F0EDE3` |
| **Accent** | Aged Gold `#B8860B` | Solar Bronze `#C4873B` |
| **Support** | Stone Grey `#6B6B6B` | Titanium `#8A9BA8` |
| **Signal** | Terracotta `#C65D3B` | Chlorophyll `#4A7C59` |
| **Header Font** | Cormorant Garamond | Exo 2 |
| **Body Font** | Source Sans 3 | Space Grotesk |
| **Data Font** | JetBrains Mono | Fira Code |
| **Materials** | stone, wood, paper, leather | glass, titanium, copper, bio-resin, moss |
| **Mood** | grounded, substantial, architectural | emergent, regenerative, luminous, bio-digital |
| **Illustration** | manuscript marginalia, cartographic | Art Nouveau curves + circuit-trace filigree |
| **Photography** | natural sidelight, matte surfaces | accent lighting, reflective + organic surfaces |
| **Environment** | dark stone surface, plaster wall | terrazzo surface, Art Nouveau greenhouse |
| **Sigil** | cartographic convergence mark | fiber-optic filament convergence |
| **Borders** | 1px crisp lines | Art Nouveau copper-wire curves |

---

## 11. Component Specifications (V2)

### Buttons

**Primary Button**
- Background: Solar Bronze (`#C4873B`)
- Text: Void Teal (`#0A1628`)
- Font: Space Grotesk SemiBold, 18px
- Padding: 12px 32px
- Border: 1px solid Solar Bronze
- Hover: Background Void Teal, Text Solar Bronze

**Secondary Button**
- Background: Transparent
- Border: 1px solid Phosphor Cream
- Text: Phosphor Cream
- Hover: Background Phosphor Cream, Text Void Teal

### Cards

- **Light Card**: Phosphor Cream background, 1px Titanium border
- **Dark Card**: Void Teal background, Phosphor Cream text, Solar Bronze accent line (2px top)
- **Glass Card**: Void Teal background at 80% opacity, 1px Solar Bronze border, backdrop-blur

### Navigation

- Header background: Void Teal
- Links: Phosphor Cream, hover to Solar Bronze
- Active: Solar Bronze underline (2px)
- 1px border-bottom: Titanium

---

## Appendix: Brand Documents Cross-Reference

All V2 visual changes are **additive** — they don't replace the following V1 documents, which remain canonical for brand voice, positioning, and product:

| Doc | Status |
|-----|--------|
| `01-buyer-persona.md` | Unchanged |
| `02-product-positioning.md` | Unchanged |
| `03-voice-and-tone.md` | Unchanged |
| `04-detailed-product-description.md` | Unchanged |
| `05-messaging-direction-summary.md` | Unchanged |
| `06-visual-identity.md` | V1 visual identity — archived |
| `12-logo-prompts.md` | V1 logo concepts — archived |
| `14-visual-prompt-cookbook.md` | V1 prompt cookbook — archived |
| **`14v2-brand-context.md`** | **THIS FILE — V2 visual identity** |
| **`14v2-visual-prompt-cookbook.md`** | **V2 prompt cookbook** |
