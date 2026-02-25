# Tryambakam Noesis — V2 Visual Prompt Cookbook
## "Bioluminescent Architecture" Theme

> Production-ready AI image & video prompts for the Tech-Solarpunk-Art-Nouveau-Art-Deco-Techno-Futuristic visual identity.

---

## Brand Context (V2 — Global Settings)

| Key | Value |
|-----|-------|
| **Brand** | Tryambakam Noesis |
| **Tagline** | "Train you to author your own meaning" |
| **Theme** | Bioluminescent Architecture |
| **Primary** | Void Teal `#0A1628` (60%) |
| **Secondary** | Phosphor Cream `#F0EDE3` (30%) |
| **Accent** | Solar Bronze `#C4873B` (10%) |
| **Support** | Titanium `#8A9BA8` |
| **Signal** | Chlorophyll `#4A7C59` |
| **Header Font** | Exo 2 (Light, Regular, SemiBold) |
| **Body Font** | Space Grotesk (Regular, Medium, SemiBold) |
| **Data Font** | Fira Code (Regular) |
| **Materials** | glass, titanium, oxidized copper, bio-resin, living moss, crystalline quartz, stained glass, solar panel mesh, mycelium substrate, terrazzo, polished concrete, copper wire, etched circuit board |
| **Mood** | emergent, regenerative, precision-engineered, luminous, bio-digital, tessellated, iridescent-calm |
| **Photography** | High contrast + accent lighting (Solar Bronze warm, Phosphor cool), reflective surfaces, botanical-mechanical hybrids, greenhouse/conservatory environments, hands not faces |
| **Illustration** | Art Nouveau organic curves + Art Deco geometry + circuit-trace filigree, Mucha-inspired compositions with tech elements, sacred geometry rendered with engineering precision |
| **Sigil** | Three converging fiber-optic filaments (Soma/Manas/Muladhara) — bioluminescent glass fibers in Void Teal, Solar Bronze, Chlorophyll converging to phosphorescent nexus point |

### Tryambakam V2 Sigil Definition

Three converging fiber-optic filaments representing:
- **Soma** (source signal) — Chlorophyll green filament
- **Manas** (witness capacity) — Solar Bronze filament
- **Muladhara** (physical grounding) — Void Teal filament

Convergence point: phosphorescent glow (Phosphor Cream). Art Nouveau organic curves at macro level, circuit-trace precision at micro level. Material: illuminated borosilicate glass tubes.

NOT a third eye, NOT a triangle, NOT neon, NOT symmetrical — a bio-digital convergence point.

### V2 Master Negative Prompt (Append to ALL Generations)

```
steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit
```

### Brand Documents

| Doc | Purpose |
|-----|---------|
| `14v2-brand-context.md` | Complete V2 visual identity (palette, typography, materials, mood) |
| `06-visual-identity.md` | V1 visual identity (archived reference) |
| `03-voice-and-tone.md` | Voice & tone guide (unchanged) |
| `12-logo-prompts.md` | V1 logo concepts (archived reference) |
| `product.md` | Product definition (unchanged) |

### How to Use This Cookbook

1. **Reference images** show STYLE/COMPOSITION from other brands — not output targets
2. **Prompts embed V2 palette/mood/materials** — the brand context overrides reference aesthetics
3. **Workflow:** Choose prompt → Pick FAL.AI model → Set parameters → Generate → Iterate
4. **Negative prompt:** Append the Master Negative to EVERY generation
5. **Style anchor:** Generate 2A (Bento Grid) FIRST — use its V1 output as style anchor for all subsequent Nano Banana Pro calls

### FAL.AI API Quick Reference

```python
# Authentication
export FAL_KEY="your-key-from-fal.ai/dashboard/keys"

# Python
import fal_client
result = fal_client.subscribe("fal-ai/model-id", arguments={...})
image_url = result["images"][0]["url"]

# V2 Recraft Colors (for illustration prompts)
colors = [{"rgb": "#0A1628"}, {"rgb": "#F0EDE3"}, {"rgb": "#C4873B"}]
```

---

## Section 1: Color Type System (Specification Output)

### 1. V2 Color Palette Validation

**Skill:** `color-type-system`
**Output type:** Specification (no image generation)
**Reference:** ![ref](prompt-cookbook-images/ref-color-ecru-bistre.webp)

**Result:** V2 palette validated against 60-30-10 rule:
- Void Teal (#0A1628) at 60% — primary backgrounds, deep surfaces
- Phosphor Cream (#F0EDE3) at 30% — text, cards, breathing space
- Solar Bronze (#C4873B) at 10% — CTAs, accent highlights, interactive states
- Titanium (#8A9BA8) — support/structural, borders, secondary text
- Chlorophyll (#4A7C59) — signal/alive states only

**Contrast:** Void Teal on Phosphor Cream = 15.5:1 (AAA). Solar Bronze on Void Teal = 5.9:1 (AA).

---

## Section 2: Brand Identity (3 Image Prompts)

### 2A. Brand Kit Bento Grid — Bioluminescent Architecture

**Skill:** `brand-identity-prompter` | **Template:** 2.1 (Brand Kit from One Prompt)
**Model:** `fal-ai/nano-banana-pro` | **Size:** `landscape_16_9` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-brand-kit-bento.jpg)

```
Tryambakam Noesis (Philosophical Practice / Meaning Architecture).
Act as Lead Brand Designer creating a comprehensive "Brand Identity System" presentation (Bento-Grid Layout).

Generate a single high-resolution bento-grid board containing 6 distinct modules:

PHASE 1: VISUAL STRATEGY (AUTONOMOUS)
1. Analyze the Brand: Archetype = "The Anatomist Who Sees Fractals" -- grounded, direct, respectful-challenging. Visual vibe = bioluminescent architecture, Art Nouveau organic curves meeting Art Deco geometric precision, solarpunk botanical-mechanical hybrids.
2. Define the Palette: Void Teal #0A1628 (primary), Phosphor Cream #F0EDE3 (secondary), Solar Bronze #C4873B (accent), Titanium #8A9BA8 (support).
3. Select Typography: Exo 2 (headers -- Light, Regular, SemiBold weights). Space Grotesk (body).

PHASE 2: THE LAYOUT (6-MODULE GRID)
Block 1 (The Hero): High-contrast photograph of a bio-resin tablet device resting on polished terrazzo surface inside an Art Nouveau greenhouse conservatory. Warm Solar Bronze light filtering through stained glass panes casting colored shadows. Oxidized copper frame of the greenhouse visible. Living moss growing at the base of a titanium stand. Overlay "TRYAMBAKAM NOESIS" wordmark in Phosphor Cream (#F0EDE3), Exo 2 Light, all caps, tracking +120.
Block 2 (Social Media): Instagram Post mockup -- Void Teal (#0A1628) background with subtle circuit-board pattern overlay at 5% opacity, centered text in Exo 2: "The system succeeds only when you no longer need it." Solar Bronze accent line below -- styled as Art Nouveau copper wire curve, not straight. Clean, no imagery.
Block 3 (The Palette): 5 Vertical Color Swatches -- Void Teal #0A1628, Phosphor Cream #F0EDE3, Solar Bronze #C4873B, Titanium #8A9BA8, Chlorophyll #4A7C59. Simulated HEX codes inside each. Subtle terrazzo texture behind swatches.
Block 4 (Typography Spec): "Exo 2" displayed in Exo 2 Light. Tiny "Primary Typeface" subtext in Space Grotesk. Geometric futuristic letterforms prominent. NO alphabet grid.
Block 5 (The Sigil): Three converging fiber-optic filaments -- bioluminescent glass tubes in Void Teal, Solar Bronze, and Chlorophyll -- converging to a phosphorescent nexus point on Phosphor Cream background. Art Nouveau organic curves guide each filament. Clean vector rendering.
Block 6 (Brand DNA): Manifesto Card -- ARCHETYPE: "The Anatomist Who Sees Fractals -- maps, not prescriptions." VOICE: "Grounded, direct, respectful-challenging." VISUALS: "Bioluminescent architecture, regenerative precision, organic-engineered fusion."

PHASE 3: AESTHETIC & FINISH
Style: Behance Trend / Awwwards Winner. Quality: 8K resolution. Soft studio lighting with Solar Bronze rim accent. No rounded corners -- sharp edges only. 1px borders in Titanium. Generous white space. Art Nouveau decorative copper-wire corner accents on the grid.
```

---

### 2B. Oxidized Copper Seal — Fiber-Optic Sigil

**Skill:** `brand-identity-prompter` | **Template:** 3.2 (Tactile Wax Seal Logos)
**Model:** `fal-ai/flux-2-pro` | **Size:** `square_hd` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-wax-seal-3d.jpg)

```
An oxidized copper disc seal depicting the Tryambakam Noesis fiber-optic sigil -- three converging bioluminescent filaments representing source, witness, and ground -- lying flat on plain Phosphor Cream (#F0EDE3) terrazzo surface. Thick oxidized copper with Art Nouveau patina -- green verdigris accents on the edges, warm Solar Bronze (#C4873B) on the raised surfaces. Clear relief impression of the three-filament convergence sigil in center, with "TRYAMBAKAM NOESIS" lettering around the rim in Exo 2 Light. Tiny stained-glass inlay segments at each filament origin point -- one Void Teal (#0A1628), one Solar Bronze, one Chlorophyll (#4A7C59). Soft diffuse lighting from above, warm Solar Bronze specular highlights on curved copper edges. Minimal shadow. The disc has the weight and patina of Art Nouveau architectural metalwork -- substantial, earned, precision-engineered yet organic.
```

---

### 2C. Stained-Glass Logo Emboss

**Skill:** `brand-identity-prompter` | **Template:** 2.3 (Glass Logos)
**Model:** `fal-ai/flux-2-pro` | **Size:** `landscape_16_9` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-glass-logo.jpg)

```
3D embossed stained-glass contour render of center-aligned "TRYAMBAKAM NOESIS" on a flat Void Teal (#0A1628) surface, perfectly centered with ample negative space. Art Nouveau stained-glass treatment -- each letter filled with translucent colored glass segments in subtle Void Teal and Solar Bronze (#C4873B) tones, held together by fine oxidized copper leading (like cathedral windows). Raised smooth glass bezel creating blind emboss effect where interior glass catches and refracts light. Matte Void Teal surface with fine circuit-board trace texture overlay at 3% opacity. Soft diffuse lighting from above, Solar Bronze warm specular highlights on glass edges, phosphorescent Cream (#F0EDE3) glow emanating from between glass segments. Top-down view. Typography: Exo 2 Light, all caps, tracking +120. Art Nouveau decorative copper-wire filigree curves framing the wordmark -- organic, not geometric. No steampunk gears, no cyberpunk neon -- pure Art Nouveau glass craft meets precision engineering.
```

---

## Section 3: Brand Product Concepts (3 Image Prompts)

### 3A. Inquiry Kit — Botanical-Mechanical Capsule Collection

**Skill:** `brand-product-prompter` | **Template:** 1.3 (Branded Souvenirs / Capsule Collection)
**Model:** `fal-ai/flux-2-pro` | **Size:** `landscape_4_3` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-capsule-collection.jpg)

```
Tryambakam Noesis, conceptualized as a cohesive, premium "capsule collection" of inquiry tools and bio-digital objects. Curated set of physical objects: small borosilicate glass terrarium with oxidized copper lid containing living moss and crystalline quartz, hand-crafted bio-resin symbolic object (3-5 inches, translucent amber with embedded fern frond), practice journal with mycelium-substrate pages and titanium spine, copper-wire incense holder with Art Nouveau organic curves, small etched glass essential oil bottle with circuit-trace label in Fira Code. Every item uses Void Teal (#0A1628) and Phosphor Cream (#F0EDE3) palette with Solar Bronze (#C4873B) copper accents. Clean organized knolling composition on polished terrazzo surface with Void Teal aggregate chips. Inside an Art Nouveau greenhouse conservatory -- oxidized copper framework and stained-glass panes visible in background, living plants soft-focused. Warm Solar Bronze accent lighting from upper left, cool phosphorescent fill from below. Wide framing with significant negative space. Materials: glass, titanium, oxidized copper, bio-resin, living moss, crystalline quartz, mycelium -- all precision-engineered yet organic. The aesthetic is "bioluminescent architecture" -- regenerative, luminous, bio-digital craft.
```

---

### 3B. Somatic Codex — Bio-Resin Philosophical Volume

**Skill:** `brand-product-prompter` | **Template:** 1.4 (Branded Souvenirs / Creative Concepts)
**Model:** `fal-ai/flux-2-pro` | **Size:** `portrait_4_3` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-souvenir-concepts.jpg)

```
Tryambakam Noesis.
Act as a creative director curating "recontextualized everyday objects."
OBJECT SELECTION: A philosophical practice book -- "Somatic Canticles" volume.
THE CONCEPT: Elevate a book into a bio-digital artifact of meaning architecture. Not a coffee-table book -- a tool for structured self-examination.
MATERIALS: Spine in translucent bio-resin (amber-to-clear gradient) with embedded copper wire traces visible inside, like a cross-section of a living circuit. Cover in Void Teal (#0A1628) matte technical textile with subtle woven circuit-board pattern. Solar Bronze (#C4873B) copper foil-stamped lettering on spine: "SOMATIC CANTICLES" in Exo 2 Light. Pages are mycelium-substrate paper in Phosphor Cream (#F0EDE3), soft fibrous texture with visible mushroom-root structure. Saddle-stitched with oxidized copper wire. A thin bookmark ribbon in Chlorophyll (#4A7C59) -- living green.
PRESENTATION: Book alone resting on polished terrazzo pedestal, slightly open to reveal interior pages with bio-digital schematic diagrams (Art Nouveau curves meeting circuit-trace precision -- not decorative, functional). Inside Art Nouveau greenhouse, oxidized copper framing visible.
PHOTOGRAPHY: High-contrast with Solar Bronze warm accent light from left. Cool phosphorescent fill. Polished terrazzo surface. Art Nouveau greenhouse background (stained glass, copper frame, living plants soft-focused).
GRAPHIC OVERLAYS: Bottom Left: "TRYAMBAKAM NOESIS -- SOMATIC CANTICLES -- VOL. I" in Space Grotesk Regular, Titanium (#8A9BA8). Bottom Right: Fiber-optic convergence sigil, monochrome Phosphor Cream.
```

---

### 3C. Essence Vial — Etched Borosilicate

**Skill:** `brand-product-prompter` | **Template:** 6.5 (Hyper-minimal Product Mockup)
**Model:** `fal-ai/flux-2-pro` | **Size:** `square_hd` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-minimal-mockup.jpg)

```
Tryambakam Noesis, as a single defining product container: an essence vial in precision-engineered ultra-minimalist bio-digital aesthetic. Small borosilicate glass bottle (30ml) with oxidized copper dropper cap -- Art Nouveau organic curve on the cap form. Etched circuit-trace label directly into the glass surface (no paper label) -- all text in Fira Code Regular, filled with Solar Bronze (#C4873B) pigment. Brand name "TRYAMBAKAM NOESIS" etched dominant across bottle. Minimal fiber-optic sigil -- three converging lines etched below brand name. Secondary text: "ESSENTIAL BLEND -- 30ML -- SOMATIC INTEGRATION" in 6pt. Pure solid Void Teal (#0A1628) studio background. Sharp high-contrast studio lighting from above creating a warm Solar Bronze highlight on the glass shoulder and a cool Phosphor Cream (#F0EDE3) edge-glow along the bottle silhouette. Single living moss sprig at the bottle's base. Complete product centered with ample dark negative space. Borosilicate glass transparency, oxidized copper patina on cap -- precision-engineered yet organic.
```

---

## Section 4: Product Photography (2 JSON/Structured Prompts)

### 4A. Inquiry Vial Catalog Layout

**Skill:** `product-photography-prompter` | **Template:** Firat Bilal Product Design Catalog
**Model:** `fal-ai/nano-banana-pro` | **Size:** `portrait_4_3` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-catalog-layout.jpg)

```
Tryambakam Noesis product design catalog page. Top section: lifestyle product image of a borosilicate glass terrarium (2oz) with oxidized copper Art Nouveau lid containing living moss and crystalline quartz, circuit-trace etched label in Fira Code. Set on polished terrazzo surface inside Art Nouveau greenhouse conservatory -- oxidized copper framework, stained-glass panes filtering Solar Bronze (#C4873B) light, living ferns in background. Natural light from upper left through greenhouse glass, high-contrast with deep shadows, warm copper highlights. Bottom section: technical specification panel with architectural line drawings in Solar Bronze (#C4873B) on Void Teal (#0A1628) background -- front elevation of terrarium with lid, side cross-section showing copper seal and moss layer, top-down view of crystalline arrangement. Fine hairline technical lines with measurement callouts in Fira Code. Art Nouveau decorative copper-wire border framing the spec panel. Material swatches panel: borosilicate glass, oxidized copper, living moss, crystalline quartz. Overall: design catalog aesthetic, bioluminescent architecture, precision-engineered organic. No rounded corners, no gradients, no clutter.
```

---

### 4B. Bio-Digital Object Collection Flat-lay

**Skill:** `product-photography-prompter` | **Template:** Oogie Flat-lay (adapted)
**Model:** `fal-ai/flux-2-pro` | **Size:** `square_hd` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-flatlay.jpg)

```
A high-contrast editorial product photograph of the Tryambakam Noesis bio-digital object collection arranged on a polished terrazzo surface with Void Teal aggregate chips. Center composition with five objects arranged in precise architectural spacing:

1. Small borosilicate glass terrarium with oxidized copper Art Nouveau lid (living moss + crystalline quartz inside)
2. Etched borosilicate essence vial with oxidized copper dropper cap (30ml)
3. Bio-resin symbolic object -- translucent amber with embedded fern frond, geometric triangulated form
4. Copper-wire incense holder -- Art Nouveau organic curves, holding a single unlit incense stick
5. Small crystalline quartz disc -- clear with internal fractures catching light

Overhead flat-lay composition. Living moss border running along one edge of the terrazzo surface -- solarpunk life element. Each object casting a single sharp shadow from directional overhead light. Fine oxidized copper wire connecting objects in an Art Nouveau curve pattern on the surface (like a circuit-board trace rendered in organic copper).

Lighting: Strong directional light from upper left with warm Solar Bronze (#C4873B) temperature. Cool Phosphor Cream (#F0EDE3) fill from below. Specular highlights on glass and copper surfaces. Bio-resin glows translucent where light passes through.

Color palette: Void Teal (#0A1628) deep shadows, Phosphor Cream (#F0EDE3) highlights on terrazzo grain, Solar Bronze (#C4873B) reflections on copper. Chlorophyll (#4A7C59) from living moss accents.

Style: precision-engineered product photography, bioluminescent architecture, bio-digital craft. 8K quality.
```

---

## Section 5: Illustration Styles (4 Image Prompts + 5D Icon Fix)

### 5A. Art Nouveau Heritage Engraving

**Skill:** `illustration-style-prompter` | **Template:** 8.5 (Retro-typographic Heritage Rebranding)
**Model:** `fal-ai/recraft/v3/text-to-image` | **Size:** `square_hd` | **Style:** `digital_illustration`
**Colors:** `["#0A1628", "#F0EDE3", "#C4873B"]`
**Reference:** ![ref](prompt-cookbook-images/ref-heritage-engraving.jpg)

```
Tryambakam Noesis. Act as a master engraver creating a "Bio-Digital Art Nouveau Heritage" logomark.

STYLE: Art Nouveau engraving meets circuit-trace filigree. Thin delicate hairlines flowing in organic Mucha-inspired curves. Cross-hatching follows Art Nouveau botanical patterns -- not mechanical, organic. Light, airy, precise.
No Heavy Borders: NO shields, crests, or thick frames. Open and airy composition. Art Nouveau copper-wire decorative borders only -- thin, flowing, organic.

THE SYMBOL: Reinterpret the Tryambakam Noesis fiber-optic sigil -- three converging bioluminescent filaments representing Soma (source signal), Manas (witness capacity), and Muladhara (physical grounding) -- as an Art Nouveau botanical-scientific illustration. Like a diagram from an Art Nouveau architect's sketchbook of consciousness. The three convergence filaments rendered as flowing organic glass tubes with circuit-trace precision at micro level. Surrounding the sigil: Art Nouveau decorative elements -- flowering copper-wire curves, Fibonacci spiral annotations, Geometric Resonance grid references rendered as botanical growth patterns. No mystical imagery, no Biofield Locus symbols, no third-eye -- pure Art Nouveau organic architecture rendered with engineering precision.

TYPOGRAPHY: "TRYAMBAKAM NOESIS" in geometric futuristic serif (Exo 2 style). Wide, elegant letter spacing. Below: "EST. MMXXVI -- MEANING ARCHITECTURE" in lighter weight.

MATERIAL: Clean solid Phosphor Cream (#F0EDE3) paper. Void Teal (#0A1628) lines. Solar Bronze (#C4873B) accent on Art Nouveau copper-wire border curves.
```

---

### 5B. Campaign Visual Identity Grid — Art Deco Overlay

**Skill:** `illustration-style-prompter` | **Template:** 4.7 (Grid Poster Design)
**Model:** `fal-ai/nano-banana-pro` | **Size:** `portrait_4_3` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-campaign-grid.jpg)

```
Tryambakam Noesis Campaign Visual Identity Grid. 2-column asymmetrical layout. Full bleed, zero spacing between tiles.

THE GRID CONTENT (3 TYPES):
TYPE A: THE SIGIL BLOCK -- Solid Void Teal (#0A1628) background with subtle circuit-board trace pattern at 5% opacity, centered fiber-optic convergence sigil in Phosphor Cream (#F0EDE3), Art Deco geometric frame around the sigil -- sharp, symmetrical, gold.
TYPE B: THE SLOGAN BLOCK -- Solar Bronze (#C4873B) background with Art Deco geometric sunburst pattern, "AUTHOR YOUR OWN MEANING" in Exo 2 SemiBold, Phosphor Cream text, terrazzo texture overlay at 10% opacity.
TYPE C: CAMPAIGN PHOTOGRAPHY -- High-contrast duotone photographs of: hands on polished terrazzo surfaces, bio-resin objects catching light, living moss terrariums, circuit-trace copper patterns on glass, borosilicate vessels on oxidized copper stands. Duotone effect using Void Teal + Solar Bronze. Art Deco geometric overlay lines (thin, precise, gold) intersecting each photo. Strong halftone dot patterns and film grain.

Layout: ROW 1 full-width block, ROW 2 two squares, ROW 3 full-width, ROW 4 two squares, ROW 5 full-width.
Typography: Exo 2 ONLY -- one font throughout. Every photo cell unique -- hands, materials, glass, copper, moss, terrazzo. No faces. No cyberpunk neon. Art Deco precision meets solarpunk vitality.
```

---

### 5C. Art Nouveau Panel — The Plumber

**Skill:** `illustration-style-prompter` | **Template:** Woodblock Print / Ukiyo-e (adapted)
**Model:** `fal-ai/recraft/v3/text-to-image` | **Size:** `portrait_4_3` | **Style:** `digital_illustration`
**Colors:** `["#0A1628", "#C4873B", "#4A7C59"]`
**Reference:** ![ref](prompt-cookbook-images/ref-woodblock.jpg)

```
An Art Nouveau panel illustration of The Plumber -- a solitary figure seen from behind, standing at the base of a vast vertebral column rising like an axis mundi through an Art Nouveau greenhouse conservatory ceiling into sky. The figure rendered in Mucha-inspired style -- flowing organic lines, flat color planes in Void Teal (#0A1628), Solar Bronze (#C4873B), and Chlorophyll (#4A7C59). Art Nouveau organic border of flowering copper-wire curves and living vine tendrils framing the composition. The figure is grounded -- feet planted on polished terrazzo, wearing structured technical linen. The vertebral column rendered as a bio-digital structure -- each vertebra distinct, part organic bone and part circuit-board trace, with fiber-optic filaments threading through the spinal canal, glowing faint Phosphor Cream. Living moss and ferns growing on the vertebrae at lower levels, becoming more engineered and precise toward the top. Art Nouveau stained-glass panes of the greenhouse visible at edges. No mystical imagery, no mandala -- the sublime is in the architecture of the bio-digital body. Paper texture: mycelium-substrate cream, fibrous, warm.
```

---

### 5D. 16 Engine Icon System (FIXED — 5 Batches)

**Skill:** `illustration-style-prompter` | **Template:** 5.1 (Notion-styled Icons — adapted)
**Model:** `fal-ai/recraft/v3/text-to-image` | **Size:** `square_hd` | **Style:** `vector_illustration`
**Colors:** `["#0A1628", "#F0EDE3"]`
**Reference:** ![ref](prompt-cookbook-images/ref-notion-icons.jpg)

> **V2 FIX:** Split into 4 separate Recraft V3 calls (3-4 icons per batch in 2x2 grids) to resolve V1's single-prompt failure.

#### 5D-1: Vedic Engine Icons (4 icons)

```
4 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Vedic Engines" in 2x2 grid layout.

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision details. Uniform weight monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients. Art Nouveau organic curves, not mechanical straight lines.

THE 4 ICONS:
1. Chronofield -- Concentric orbital rings with Art Nouveau flowing curves (planetary period cycles)
2. Temporal Grammar -- Hourglass intersected by rhythmic wave notations in Art Nouveau flowing pattern
3. Bioelectric Field -- Layered concentric body silhouette with radiating field lines and circuit-trace meridian lines (monochrome only)
4. Energetic Authority -- Bodygraph diamond/triangle form with Art Nouveau organic connecting lines

Clean 2x2 grid on Phosphor Cream background. Each icon in a square frame with thin Art Nouveau copper-wire corner accents. Even spacing. Icon label below each in Fira Code, 8pt.
```

#### 5D-2: Western Engine Icons (4 icons)

```
4 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Western Engines" in 2x2 grid layout.

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision details. Uniform weight monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients.

THE 4 ICONS:
5. Gift-Shadow Spectrum -- Spectrum wave with three tiers (shadow/gift/siddhi) rendered as Art Nouveau flowing layers
6. Active Planetary Weather -- Globe with intersecting meridian lines and atmospheric flow arrows in organic curves
7. Nine-Point Architecture -- Nine-pointed geometric figure with Art Nouveau curved connecting lines
8. Numeric Architecture -- Digits 0-9 arranged in Fibonacci spiral column

Clean 2x2 grid on Phosphor Cream background. Each icon in square frame with Art Nouveau corner accents. Even spacing. Fira Code labels.
```

#### 5D-3: Bridge Engine Icons (3 icons)

```
3 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Bridge Engines" in 2x1+1 layout (2 top, 1 bottom center).

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision. Uniform monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients.

THE 3 ICONS:
9. Archetypal Mirror -- Single card silhouette with Art Nouveau decorative interior pattern
10. Circadian Cartography -- 12-segment circular clock face with body-rhythm annotations and flowing Art Nouveau sector borders
11. Three-Wave Cycle Engine -- Three overlapping sine waves rendered as flowing Art Nouveau organic curves

Clean grid on Phosphor Cream background. Square frames with Art Nouveau corner accents. Fira Code labels.
```

#### 5D-4: Somatic & Resonance Engine Icons (3 icons)

```
3 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Somatic & Resonance Engines" in 2x1+1 layout (2 top, 1 bottom center).

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision. Uniform monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients.

THE 3 ICONS:
12. Physiognomic Mapping -- Face silhouette with proportional measurement lines flowing through Art Nouveau vine pattern
13. Resonance Architecture -- Sound wave with ascending frequency curve, notes rendered as Art Nouveau flowering forms
14. Hexagram Navigation -- Six-line hexagram stack (I Ching-inspired, geometric) with Art Nouveau decorative framing

Clean grid on Phosphor Cream background. Square frames. Art Nouveau corner accents. Fira Code labels.
```

#### 5D-5: Forge & Geometry Engine Icons (2 icons)

```
2 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Forge & Geometry Engines" side-by-side.

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision. Uniform monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients.

THE 2 ICONS:
15. Geometric Resonance -- Nested platonic solids (tetrahedron inside sphere) with Art Nouveau organic curves
16. Sigil Forge -- Quill nib inscribing a geometric glyph on parchment, Art Nouveau decorative border

Clean side-by-side on Phosphor Cream background. Square frames. Art Nouveau corner accents. Fira Code labels.
```

---

## Section 6: Video Direction (2 Video Sequences)

### 6A. Brand Film: "The Greenhouse" (3-Shot Kling 3.0 Sequence)

**Skill:** `ai-video-director` | **Template:** Multi-shot sequence
**Model:** `fal-ai/kling-video/v3/pro` | **Format:** 16:9 | **Duration:** ~20s (3 shots x 5-7s)
**Reference:** ![ref](prompt-cookbook-images/ref-video-source.jpg)

**Shot 1 (5s) — Macro/Detail:**
```
Extreme close-up of hands placing a crystalline quartz object inside a borosilicate glass terrarium. Living moss visible inside. Oxidized copper Art Nouveau lid in other hand. Polished terrazzo surface. Warm Solar Bronze (#C4873B) light from upper left filtering through stained glass, creating colored shadows. Phosphor Cream (#F0EDE3) ambient glow. Shallow depth of field -- copper patina detail on the lid sharp, background greenhouse structure soft. Sound: ambient greenhouse, glass-on-glass contact, gentle.
```

**Shot 2 (7s) — Tracking/Reveal:**
```
Slow tracking shot across a terrazzo surface displaying the 16 engine schematic diagrams -- printed on mycelium-substrate paper, arranged in a grid. Each diagram rendered in Art Nouveau organic curves with circuit-trace precision in Solar Bronze (#C4873B) ink on Phosphor Cream (#F0EDE3) paper. Camera moves left-to-right, natural shallow DOF rack-focusing across papers. Living moss border at edge of frame. Oxidized copper wire holding papers in position. Void Teal (#0A1628) deep shadow in background. Art Nouveau greenhouse iron framework visible at top of frame. Sound: paper rustling, ambient greenhouse.
```

**Shot 3 (5s) — Wide/Completion:**
```
Wide shot -- hands pulling away from completed inquiry kit arrangement on polished terrazzo surface. All five bio-digital objects in precise knolling order. Art Nouveau greenhouse conservatory environment surrounds -- oxidized copper framework, stained-glass panes, living plants at edges. Warm Solar Bronze light creating long shadows. The collection complete, the hands retreat into Void Teal (#0A1628) background shadow. Sound: silence, then a single resonant tone.
```

**End Card (3s):**
```
Black frame (Void Teal #0A1628). "TRYAMBAKAM NOESIS" fades in center -- Exo 2 Light, Phosphor Cream (#F0EDE3), tracking +120. Below: fiber-optic sigil, subtle phosphorescent glow animation. Fade to black.
```

---

### 6B. Somatic Codex Trailer (4-Shot Kling 3.0 Sequence)

**Skill:** `ai-video-director` | **Template:** Multi-shot sequence
**Model:** `fal-ai/kling-video/v3/pro` | **Format:** 16:9 | **Duration:** ~20s (4 shots)
**Reference:** ![ref](prompt-cookbook-images/ref-kling-multishot.mp4)

**Shot 1 (4s) — Detail:**
```
Close-up of three biorhythm sine waves being drawn on mycelium-substrate paper by a fine copper-nib pen. Art Nouveau flowing curves, not mechanical waves. Ink is Solar Bronze (#C4873B). Paper is Phosphor Cream (#F0EDE3) with visible mycelium fiber texture. Polished terrazzo surface underneath. Shallow DOF. Warm Solar Bronze sidelight. Sound: pen scratching on fibrous paper.
```

**Shot 2 (5s) — Page Turn:**
```
Hands turning a page of the Somatic Codex -- bio-resin spine visible glowing translucent amber at the hinge. New chapter revealed: Art Nouveau schematic diagrams of the 16-engine consciousness architecture. Mycelium-substrate pages, Void Teal (#0A1628) ink with Solar Bronze (#C4873B) accent lines. Circuit-trace precision meeting organic Art Nouveau curves. Inside Art Nouveau greenhouse -- stained glass casting colored light on the pages. Sound: thick fibrous pages turning, greenhouse ambient.
```

**Shot 3 (6s) — The Field:**
```
Wide minimal landscape -- polished terrazzo ground extending to horizon under a vast Art Nouveau glass dome structure. Single figure (back only) walking toward the dome's apex where three fiber-optic filaments converge in the sky -- Void Teal, Solar Bronze, Chlorophyll (#4A7C59). Living moss and ferns growing on the terrazzo surface in organic patterns. Warm light. The figure wears dark structured technical linen. Sound: footsteps on polished stone, distant glass resonance.
```

**Shot 4 (5s) — Title Card:**
```
Void Teal (#0A1628) frame. Text card -- "TRYAMBAKAM NOESIS" in Exo 2 Light, Phosphor Cream (#F0EDE3), tracking +120. Below: "SOMATIC CANTICLES -- VOL. I" in Space Grotesk Regular, Titanium (#8A9BA8). Fiber-optic sigil pulses once with soft phosphorescent glow. Art Nouveau decorative copper-wire corner frame. Fade to black.
```

---

## Section 7: Lifestyle Editorial (1 JSON Prompt)

### 7A. "The Anatomist" — Bio-Digital Contact Sheet

**Skill:** `fashion-editorial-prompter` | **Template:** A (Multi-Angle Contact Sheet — adapted)
**Model:** `fal-ai/nano-banana-pro` | **Size:** `square_hd` | **Steps:** 40 | **Guidance:** 7.5
**Reference:** ![ref](prompt-cookbook-images/ref-contact-sheet.jpg)

```
Tryambakam Noesis -- "The Anatomist Who Sees Fractals" editorial contact sheet. 3x3 grid of 9 panels showing hands-only lifestyle photography inside an Art Nouveau greenhouse conservatory. No face visible -- only hands and forearms in dark structured technical linen (Void Teal #0A1628). Same hands across all 9 panels for consistency.

9 PANELS:
1. Overhead hands on open Somatic Codex with bio-resin spine, Art Nouveau circuit-trace diagrams visible on mycelium pages
2. Right hand holding copper-nib pen, hovering over half-finished geometric-organic diagram on mycelium paper
3. Both hands placing borosilicate terrarium next to bio-resin symbolic object on polished terrazzo
4. Right hand mid-page-turn, thick mycelium-substrate paper with fibrous edge catching warm Solar Bronze sidelight
5. Both hands cradling small oxidized copper instrument at shoulder level from behind -- Art Nouveau decorative form
6. Index finger tracing along a fiber-optic convergence pattern etched into glass surface, light following the trace
7. Thumbs breaking open an oxidized copper wax seal on folded letter, Solar Bronze (#C4873B) patina flecks visible
8. Forearms resting on polished terrazzo surface, 16 small engine diagram cards spread in grid, printed on mycelium paper in Art Nouveau style
9. Right hand lighting incense in copper-wire Art Nouveau holder, left hand cupping the first wisps of smoke

Camera: Phase One XF, 80mm, f/8. Natural greenhouse light from upper left through stained-glass panes -- warm Solar Bronze highlights, Void Teal (#0A1628) deep shadows. Polished terrazzo desk. Art Nouveau greenhouse structure (oxidized copper + stained glass) visible in background. 2px Titanium (#8A9BA8) borders between panels. Ultra-photorealistic, 8K detail on hand texture, material grain, copper patina, moss texture.
```

---

## Appendix A: FAL.AI V2 Model Routing Table

| # | Prompt | FAL.AI Endpoint | `image_size` | Extra Params | Est. Cost |
|---|--------|----------------|-------------|-------------|-----------|
| 2A | Brand Kit Bento | `fal-ai/nano-banana-pro` | `landscape_16_9` | -- | ~$0.04 |
| 2B | Copper Seal | `fal-ai/flux-2-pro` | `square_hd` | -- | ~$0.05/MP |
| 2C | Stained-Glass Logo | `fal-ai/flux-2-pro` | `landscape_16_9` | -- | ~$0.05/MP |
| 3A | Inquiry Kit Capsule | `fal-ai/flux-2-pro` | `landscape_4_3` | -- | ~$0.05/MP |
| 3B | Somatic Codex | `fal-ai/flux-2-pro` | `portrait_4_3` | -- | ~$0.05/MP |
| 3C | Essence Vial | `fal-ai/flux-2-pro` | `square_hd` | -- | ~$0.05/MP |
| 4A | Catalog (JSON) | `fal-ai/nano-banana-pro` | `portrait_4_3` | -- | ~$0.04 |
| 4B | Flat-lay | `fal-ai/flux-2-pro` | `square_hd` | -- | ~$0.05/MP |
| 5A | Art Nouveau Engraving | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "digital_illustration"`, `colors: ["#0A1628","#F0EDE3","#C4873B"]` | $0.04 |
| 5B | Campaign Grid | `fal-ai/nano-banana-pro` | `portrait_4_3` | -- | ~$0.04 |
| 5C | Art Nouveau Panel | `fal-ai/recraft/v3/text-to-image` | `portrait_4_3` | `style: "digital_illustration"`, `colors: ["#0A1628","#C4873B","#4A7C59"]` | $0.04 |
| 5D-1 | Vedic Icons (4) | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "vector_illustration"`, `colors: ["#0A1628","#F0EDE3"]` | $0.04 |
| 5D-2 | Western Icons (4) | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "vector_illustration"`, `colors: ["#0A1628","#F0EDE3"]` | $0.04 |
| 5D-3 | Bridge Icons (3) | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "vector_illustration"`, `colors: ["#0A1628","#F0EDE3"]` | $0.04 |
| 5D-4 | Somatic & Resonance Icons (3) | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "vector_illustration"`, `colors: ["#0A1628","#F0EDE3"]` | $0.04 |
| 5D-5 | Forge & Geometry Icons (2) | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "vector_illustration"`, `colors: ["#0A1628","#F0EDE3"]` | $0.04 |
| 6A | Brand Film | `fal-ai/kling-video/v3/pro` | 16:9 | Multi-shot sequence | varies |
| 6B | Codex Trailer | `fal-ai/kling-video/v3/pro` | 16:9 | Multi-shot sequence | varies |
| 7A | Anatomist (JSON) | `fal-ai/nano-banana-pro` | `square_hd` | -- | ~$0.04 |

**V2 Total estimated cost:** Single generation ~$0.85 | 2 variations each ~$1.70 | With 5D fix ~$2.00 | With upscaling ~$2.50-3.00

---

## Appendix B: V1 → V2 Prompt Token Substitution Reference

| V1 Token | V2 Replacement |
|----------|---------------|
| `Deep Ink (#1A1A2E)` | `Void Teal (#0A1628)` |
| `Bone (#F5F0E8)` | `Phosphor Cream (#F0EDE3)` |
| `Aged Gold (#B8860B)` | `Solar Bronze (#C4873B)` |
| `Stone Grey (#6B6B6B)` | `Titanium (#8A9BA8)` |
| `Terracotta (#C65D3B)` | `Chlorophyll (#4A7C59)` |
| `Cormorant Garamond` | `Exo 2` |
| `Source Sans 3` | `Space Grotesk` |
| `JetBrains Mono` | `Fira Code` |
| `dark stone surface` | `polished terrazzo surface` |
| `textured plaster wall` | `Art Nouveau greenhouse (copper + stained glass)` |
| `leather-bound` | `bio-resin spine` |
| `cork lid` | `oxidized copper lid` |
| `kraft paper label` | `etched circuit-trace label` |
| `dried herbs` | `living moss + crystalline quartz` |
| `wax seal` | `oxidized copper disc seal` |
| `manuscript marginalia` | `circuit-trace filigree with Art Nouveau curves` |
| `copperplate engraving` | `Art Nouveau copper-plate etching` |
| `woodblock print` | `Art Nouveau panel (Mucha-style)` |
| `dark slate stone` | `polished terrazzo` |
| `stone pedestal` | `oxidized copper stand / terrazzo pedestal` |
| `natural sidelight` | `Solar Bronze accent light + natural` |
| `grounded depth` | `bioluminescent architecture` |
| `substance over decoration` | `precision-engineered yet organic` |
| `three converging lines` | `three converging fiber-optic filaments` |
| `cartographic convergence mark` | `bio-digital convergence point` |
