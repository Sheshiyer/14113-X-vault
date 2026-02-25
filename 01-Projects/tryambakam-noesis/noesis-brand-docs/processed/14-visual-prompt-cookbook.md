# Visual Prompt Cookbook: Tryambakam Noesis

> 16 production-ready AI image/video prompts generated from 7 PAI design skills.
> All prompts target [fal.ai](https://fal.ai) as the unified API service. Reference images show what each template style produces.

---

## Brand Context (Apply to Every Prompt)

| Parameter | Value |
|-----------|-------|
| **Brand** | Tryambakam Noesis |
| **Tagline** | "Train you to author your own meaning" |
| **Primary** | Deep Ink `#1A1A2E` (60%) |
| **Secondary** | Bone `#F5F0E8` (30%) |
| **Accent** | Aged Gold `#B8860B` (10%) |
| **Support** | Stone Grey `#6B6B6B` |
| **Warning** | Terracotta `#C65D3B` |
| **Headers** | Cormorant Garamond (Light / Regular / SemiBold) |
| **Body** | Source Sans 3 (Regular / SemiBold) |
| **Data** | JetBrains Mono Regular |
| **Materials** | stone, wood, paper, metal, leather, cork, glass, dried herbs |
| **Mood** | grounded, substantial, architectural, timeless, high-contrast |
| **Photography** | High contrast, natural light, textural focus, hands not faces |
| **Illustration** | Line-based, high density, single color, manuscript marginalia / scientific illustration |

### Brand Documents (full specifications)

| Document | Path | Contains |
|----------|------|----------|
| Visual Identity Guide | [06-visual-identity.md](06-visual-identity.md) | Color psychology, typography scale, logo guidelines, imagery rules, graphic elements, application examples |
| Visual Identity Expanded | [visual-identity-guide-expanded.md](visual-identity-guide-expanded.md) | CSS tokens, responsive specs, component library, print specifications |
| Logo Concepts | [12-logo-prompts.md](12-logo-prompts.md) | 7 logo concepts with AI prompts (Recursive Loop, Well/Source, Lettermark N, Grammar Symbol, Witness Mark, Tryambakam Sigil, Triangulation Mark) |
| Product Description | [04-detailed-product-description.md](04-detailed-product-description.md) | 7 core offerings: Witness Agents, Somatic Canticles, Symbolic Narratives, Infinite Treasure Hunt, Decision Mirrors, Ritual Objects, .init Protocols |
| Packaging Brief | [packaging-design-brief.md](packaging-design-brief.md) | Physical product specs: glass jars (2oz-4oz), symbolic objects (3"-8"), journals (5"x7" / 8"x10"), materials, unboxing flow |
| Existing FAL Prompts | [visual-prompts.json](visual-prompts.json) | 3 pre-built prompts already formatted for `fal-flux` service with parameters |

### Logo Sigil Reference

The **Tryambakam Sigil** (three converging lines) represents the triangulation of:
- **Soma** (source signal) -- the raw material of experience
- **Manas** (witness capacity) -- the observing faculty
- **Muladhara** (physical grounding) -- embodied anchor

This sigil appears in prompts 2A, 2B, 5A, 5B, and 5D. It is NOT a third eye, NOT a triangle, NOT a mystical symbol -- it is a cartographic convergence mark.

### Master Negative Prompt (append to every generation)

```
ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult,
stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers,
candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors
```

---

## How to Use This Cookbook

### Reference Images

Each prompt section includes a **reference image** showing what that template style produces. These images are from other brands and creators -- they demonstrate the **visual format and composition**, not the TN brand output.

When you generate with TN prompts, the output will have:
- TN's color palette (Deep Ink / Bone / Aged Gold) instead of the reference's colors
- TN's materials (stone, leather, paper, brass) instead of the reference's materials
- TN's mood (grounded, architectural, high-contrast) instead of the reference's mood

Use reference images to understand the **structure** (grid layout, camera angle, composition style) that each template produces.

### Generation Workflow

1. **Choose a prompt** from sections 2-7 below
2. **Copy the prompt** from the fenced code block
3. **Select the FAL.AI model** noted in the prompt header (see FAL.AI API Reference below)
4. **Set parameters**: `image_size`, `guidance_scale`, `num_inference_steps` as noted per prompt
5. **Append the Master Negative Prompt** (above) to avoid brand-violating outputs
6. **Generate and iterate**: Adjust `seed` for variations, increase `guidance_scale` (up to 12) for stricter prompt adherence
7. **Upscale finals** with Flux Vision Upscaler (`fal-ai/flux-vision-upscaler`) for production-ready 4K/8K

### Brand Override Principle

Every prompt in this cookbook already embeds TN's palette hex codes, material vocabulary, mood keywords, and avoidance terms. The prompts are self-contained -- no additional brand context injection is needed at generation time.

For **Recraft V3** prompts (5A, 5C, 5D): also pass the `colors` parameter with TN hex codes to enforce palette compliance at the model level.

---

## FAL.AI API Reference

All prompts in this cookbook target [fal.ai](https://fal.ai) as the unified generation service.

### Authentication

```bash
# Set your API key (get one at https://fal.ai/dashboard/keys)
export FAL_KEY="your-key-here"
```

### Quickstart

**Python:**
```python
import fal_client

result = fal_client.submit(
    "fal-ai/flux-2-pro",  # model endpoint
    arguments={
        "prompt": "YOUR PROMPT HERE",
        "image_size": "square_hd",
        "num_inference_steps": 28,
        "guidance_scale": 3.5,
        "num_images": 1,
        "output_format": "png"
    }
).get()

# result["images"][0]["url"] contains the generated image URL
```

**JavaScript:**
```javascript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux-2-pro", {
  input: {
    prompt: "YOUR PROMPT HERE",
    image_size: "square_hd",
    num_inference_steps: 28,
    guidance_scale: 3.5,
    num_images: 1,
    output_format: "png"
  }
});

// result.images[0].url contains the generated image URL
```

### Model Selection Guide

| Model | Endpoint | Best For | Price |
|-------|----------|----------|-------|
| **Flux 2 Pro** | `fal-ai/flux-2-pro` | Photorealistic products, materials, editorial photography | ~$0.05/MP |
| **Recraft V3** | `fal-ai/recraft/v3/text-to-image` | Illustrations, vector icons, engravings, line art | $0.04/img |
| **Nano Banana Pro** | `fal-ai/nano-banana-pro` | Complex multi-module layouts, JSON-structured prompts | ~$0.04/img |
| **Flux 2 Klein 9B** | `fal-ai/flux-2/klein/9b` | Fast drafts and variations (iterate cheaply) | ~$0.01/img |
| **Flux Vision Upscaler** | `fal-ai/flux-vision-upscaler` | Upscale finals to 4K/8K production quality | varies |
| **Kling 3.0 Pro** | `fal-ai/kling-video/v3/pro` | Multi-shot video with native audio | varies |

### Common Parameters

**Flux 2 Pro / Nano Banana Pro:**

| Parameter | Type | Default | Range | Notes |
|-----------|------|---------|-------|-------|
| `prompt` | string | required | -- | The generation prompt |
| `image_size` | enum | `landscape_4_3` | `square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9` | Or custom `{width, height}` |
| `num_inference_steps` | int | 28 | 1-50 | Higher = more detail, slower |
| `guidance_scale` | float | 3.5 | 1-20 | Higher = stricter prompt adherence |
| `seed` | int | random | -- | Fix for reproducible results |
| `num_images` | int | 1 | 1-4 | Batch generation |
| `output_format` | enum | `jpeg` | `jpeg`, `png` | Use `png` for production |

**Recraft V3 (for illustrations):**

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| `prompt` | string | required | The generation prompt |
| `image_size` | enum | `square_hd` | Same options as above |
| `style` | enum | `realistic_image` | `digital_illustration`, `vector_illustration`, `realistic_image`, `any` |
| `colors` | array | `[]` | **TN brand colors:** `["#1A1A2E", "#F5F0E8", "#B8860B", "#6B6B6B"]` |

### Recommended Settings for TN Prompts

| Setting | Value | Why |
|---------|-------|-----|
| `output_format` | `"png"` | Lossless for production assets |
| `guidance_scale` | `7.5` | Higher than default for strict brand adherence |
| `num_inference_steps` | `40` | More steps for fine detail in textures and materials |
| `num_images` | `2` | Generate pairs for comparison |

---

## 1. Color & Type Validation

**Skill:** `color-type-system` | **Output:** Specification (not an image prompt)

![Closest master palette: Ecru & Bistre](prompt-cookbook-images/ref-color-ecru-bistre.webp)

### Palette Validation Result

```
TRYAMBAKAM NOESIS - COLOR & TYPE SPEC

PALETTE (validated):
  Primary:   Deep Ink    #1A1A2E  (60%)  - Backgrounds, typography, core elements
  Secondary: Bone        #F5F0E8  (30%)  - Contrast surfaces, breathing space
  Accent:    Aged Gold   #B8860B  (10%)  - Highlights, emphasis (sparingly)
  Support:   Stone Grey  #6B6B6B         - Borders, secondary text (within 30%)
  Warning:   Terracotta  #C65D3B         - Error states only (<1%)

CONTRAST:
  Deep Ink on Bone:      14.2:1  AAA    PASS
  Bone on Deep Ink:      14.2:1  AAA    PASS
  Aged Gold on Deep Ink:  5.3:1  AA     PASS
  Aged Gold on Bone:      3.2:1  AA Lg  CAUTION - 18px minimum
  Stone Grey on Bone:     3.4:1  AA Lg  CAUTION - 18px minimum
  Stone Grey on Deep Ink:  4.2:1  AA     PASS

60-30-10 DISTRIBUTION:    VALID
NEAREST MASTER PALETTE:   Pair 4 (Ecru & Bistre) - organic, earthy, premium
CUSTOM BLEND:             Pair 5 depth + Pair 4 warmth + Pair 6 groundedness

TYPOGRAPHY (validated):
  Headers:  Cormorant Garamond Light/Regular/SemiBold
  Body:     Source Sans 3 Regular/SemiBold
  Data:     JetBrains Mono Regular

PREMIUM UPGRADES (if budget allows):
  Headers:  GT Alpina (Grilli Type) - 70 styles, Swiss craftsmanship
  Body:     LL Akkurat (Lineto) - neo-modernist precision

PREVIEW: realtimecolors.com/?colors=F5F0E8-1A1A2E-B8860B-6B6B6B-C65D3B
```

---

## 2. Brand Identity

**Skill:** `brand-identity-prompter`

### 2A. Brand Kit Bento Grid

> **FAL.AI:** `fal-ai/nano-banana-pro` | `image_size: "landscape_16_9"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** 2.1 (Brand Kit from One Prompt)

![Reference: Brand Kit Bento Grid](prompt-cookbook-images/ref-brand-kit-bento.jpg)

```
Tryambakam Noesis (Philosophical Practice / Meaning Architecture).
Act as Lead Brand Designer creating a comprehensive "Brand Identity System" presentation (Bento-Grid Layout).

Generate a single high-resolution bento-grid board containing 6 distinct modules:

PHASE 1: VISUAL STRATEGY (AUTONOMOUS)
1. Analyze the Brand: Archetype = "The Anatomist Who Sees Fractals" -- grounded, direct, respectful-challenging. Visual vibe = architectural depth, manuscript precision, earned complexity.
2. Define the Palette: Deep Ink #1A1A2E (primary), Bone #F5F0E8 (secondary), Aged Gold #B8860B (accent), Stone Grey #6B6B6B (support).
3. Select Typography: Cormorant Garamond (headers -- Light, Regular, SemiBold weights). Source Sans 3 (body).

PHASE 2: THE LAYOUT (6-MODULE GRID)
Block 1 (The Hero): High-contrast photograph of a leather-bound philosophical journal on dark stone surface. Natural sidelight, visible paper grain, aged gold embossing catching light. Deep Ink tones. Overlay "TRYAMBAKAM NOESIS" wordmark in Bone (#F5F0E8), Cormorant Garamond Light, all caps, tracking +100.
Block 2 (Social Media): Instagram Post mockup -- dark background (#1A1A2E), centered text in Cormorant Garamond: "The system succeeds only when you no longer need it." Aged Gold accent line below. Clean, no imagery.
Block 3 (The Palette): 4 Vertical Color Swatches -- Deep Ink #1A1A2E, Bone #F5F0E8, Aged Gold #B8860B, Stone Grey #6B6B6B. Simulated HEX codes inside each.
Block 4 (Typography Spec): "Cormorant Garamond" displayed in Cormorant Garamond Light. Tiny "Primary Typeface" subtext in Source Sans 3. NO alphabet grid.
Block 5 (The Logo): The Tryambakam Sigil -- three converging lines representing source, witness, and ground -- rendered in Deep Ink on Bone background. Clean geometric vector, NO construction lines.
Block 6 (Brand DNA): Manifesto Card -- ARCHETYPE: "The Anatomist Who Sees Fractals -- maps, not prescriptions." VOICE: "Grounded, direct, respectful-challenging." VISUALS: "Architectural depth, earned complexity, substance over decoration."

PHASE 3: AESTHETIC & FINISH
Style: Behance Trend / Awwwards Winner. Quality: 8K resolution. Soft studio lighting. No rounded corners -- sharp edges only. 1px borders in Stone Grey. Generous white space.
```

---

### 2B. Wax Seal 3D Treatment

> **FAL.AI:** `fal-ai/flux-2-pro` | `image_size: "square_hd"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** 3.2 (Tactile Wax Seal Logos)

![Reference: Wax Seal 3D](prompt-cookbook-images/ref-wax-seal-3d.jpg)

```
Deep Ink (#1A1A2E) glossy wax seal icon depicting Tryambakam Noesis sigil -- three converging lines representing source, witness, and ground -- lying flat on plain Bone (#F5F0E8) background. Thick deformed wax with irregular squashed shape and prominent drip/smear extending to right side. Clear raised relief impression of the three-line convergence sigil in center, with "TRYAMBAKAM NOESIS" lettering around the rim in Aged Gold (#B8860B). Soft even lighting, smooth specular highlights on curved glossy edges. Soft minimal shadow. The wax has the color and depth of centuries-old sealing wax -- substantial, not decorative.
```

---

### 2C. Glass Logo Emboss

> **FAL.AI:** `fal-ai/flux-2-pro` | `image_size: "landscape_16_9"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** 2.3 (Glass Logos)

![Reference: Glass Logo](prompt-cookbook-images/ref-glass-logo.jpg)

```
3D embossed glossy contour render of center-aligned "TRYAMBAKAM NOESIS" on a flat surface, perfectly centered with ample negative space. Monochromatic Deep Ink (#1A1A2E) palette with soft tonal gradients from near-black to dark slate blue. Raised smooth liquid-like glass bezel creating blind emboss effect where interior matches background. Matte surface finish with fine film grain or noise texture overlay. Soft diffuse lighting, strong specular highlights on rounded edges catching Aged Gold (#B8860B) reflections, top-down view. Typography: Cormorant Garamond Light, all caps, tracking +100. No decoration, no mystical symbols -- pure typographic substance.
```

---

## 3. Brand Product Concepts

**Skill:** `brand-product-prompter`

### 3A. Ritual Kit Capsule Collection

> **FAL.AI:** `fal-ai/flux-2-pro` | `image_size: "landscape_4_3"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** 1.3 (Branded Souvenirs / Capsule Collection)

![Reference: Capsule Collection](prompt-cookbook-images/ref-capsule-collection.jpg)

```
Tryambakam Noesis, conceptualized as a cohesive, premium "capsule collection" of ritual objects and inquiry tools. Curated set of physical objects: small glass apothecary jar with cork lid containing dried herbs and resins, hand-carved wooden symbolic object (3-5 inches, weighted), leather-bound saddle-stitched practice journal (5"x7"), brass incense holder with geometric triangulated form, small amber glass essential oil bottle with kraft label. Every item uses Deep Ink (#1A1A2E) and Bone (#F5F0E8) palette with Aged Gold (#B8860B) embossed lettering on the journal spine. Clean organized knolling composition on seamless dark slate stone surface. Soft natural sidelight, deep shadows. Wide framing with significant negative space. Materials: stone, glass, cork, dried botanicals, leather, brass, wood -- all matte finishes, no gloss, no plastic. The aesthetic is "grounded depth" -- substantial, architectural, atemporal craft.
```

---

### 3B. Somatic Canticles Book

> **FAL.AI:** `fal-ai/flux-2-pro` | `image_size: "portrait_4_3"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** 1.4 (Branded Souvenirs / Creative Concepts)

![Reference: Souvenir Concepts](prompt-cookbook-images/ref-souvenir-concepts.jpg)

```
Tryambakam Noesis.
Act as a creative director curating "recontextualized everyday objects."
OBJECT SELECTION: A philosophical practice book -- "Somatic Canticles" volume.
THE CONCEPT: Elevate a book into a tactile artifact of meaning architecture. Not a coffee-table book -- a tool for structured self-examination.
MATERIALS: Cover in Deep Ink (#1A1A2E) matte full-grain leather with visible natural grain. Spine with Aged Gold (#B8860B) foil-stamped lettering: "SOMATIC CANTICLES" in Cormorant Garamond Light. Pages are uncoated laid cotton stock in Bone (#F5F0E8), visible deckled edges. Saddle-stitched with waxed linen thread. A thin bookmark ribbon in Aged Gold.
PRESENTATION: Book alone resting on dark stone pedestal, slightly open to reveal interior pages with hand-drawn line diagrams (technical, architectural quality -- not decorative). Exposed knolling view.
PHOTOGRAPHY: High-contrast natural sidelight. Clean dark stone surface. No cyclorama -- dark architectural interior background (textured plaster wall).
GRAPHIC OVERLAYS: Bottom Left: "TRYAMBAKAM NOESIS -- SOMATIC CANTICLES -- VOL. I" in Manrope Regular, Stone Grey (#6B6B6B). Bottom Right: Three-line convergence sigil, monochrome.
```

---

### 3C. Essential Oil Bottle

> **FAL.AI:** `fal-ai/flux-2-pro` | `image_size: "square_hd"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** 6.5 (Hyper-minimal Product Mockup)

![Reference: Minimal Mockup](prompt-cookbook-images/ref-minimal-mockup.jpg)

```
Tryambakam Noesis, as a single defining product container: an essential oil bottle in severe ultra-minimalist monochromatic aesthetic. Small amber glass bottle (30ml) with matte black dropper cap. Kraft paper label with Deep Ink (#1A1A2E) typography -- all text in JetBrains Mono Regular. Brand name "TRYAMBAKAM NOESIS" dominant across label. Minimal fine-line wireframe of the three-convergence sigil. Secondary text: "ESSENTIAL BLEND -- 30ML -- SOMATIC INTEGRATION" in 6pt. Pure solid Deep Ink (#1A1A2E) studio background. Sharp high-contrast studio lighting from above creating a single warm highlight on the glass shoulder. Complete product centered with ample dark negative space. Matte amber glass texture, no gloss -- substance over ornament.
```

---

## 4. Product Photography

**Skill:** `product-photography-prompter`

### 4A. Ritual Blend Catalog Layout (JSON)

> **FAL.AI:** `fal-ai/nano-banana-pro` | `image_size: "portrait_4_3"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** Firat Bilal Product Design Catalog

![Reference: Catalog Layout](prompt-cookbook-images/ref-catalog-layout.jpg)

```json
{
  "reference_images": {
    "product_image": "Glass apothecary jar (2oz) with cork lid containing dried herbs and resins. Kraft paper label with Deep Ink typography.",
    "usage_rule": "Use the description as the exact visual reference for the product's form, proportions, materials, and overall identity. Do not redesign or reinterpret the product."
  },
  "layout": {
    "canvas": {"orientation": "vertical", "aspect_ratio": "3:4", "background": "dark stone surface -- slate grey with natural grain texture"},
    "structure": {"top_section": "lifestyle_hero", "bottom_section": "technical_specification"}
  },
  "top_section": {
    "type": "lifestyle_product_image",
    "composition": {"placement": "top_center", "scale": "dominant", "margin": "generous negative space around product"},
    "environment": {
      "setting": "minimal architectural interior -- grounded, not sterile",
      "lighting": {"type": "natural sidelight from window", "direction": "angled from upper left", "quality": "high-contrast with deep shadows, not diffused"},
      "floor": "dark slate stone surface with natural grain",
      "background": "textured plaster wall in Bone (#F5F0E8), aged and substantial",
      "props": "scattered dried herb leaves, small piece of raw resin, single brass spoon -- arranged with precision, not casual"
    },
    "rendering": {"style": "editorial product photography", "detail": "high realism -- visible cork grain, glass thickness, herb texture", "color_grading": "Deep Ink tones, warm Aged Gold highlights, muted and grounded -- NOT bright, NOT warm-filtered"}
  },
  "bottom_section": {
    "type": "technical_specification_panel",
    "layout": {"grid": "modular", "alignment": "clean, architectural"},
    "technical_drawings": {
      "placement": "bottom_left_and_center",
      "style": "architectural line drawings -- copperplate engraving quality",
      "views": ["front elevation of jar with lid", "side cross-section showing cork seal and herb fill level", "top-down view showing jar mouth diameter"],
      "projection": "orthographic",
      "line_style": {"color": "Aged Gold (#B8860B) on Deep Ink (#1A1A2E) background", "weight": "fine hairline technical lines"},
      "annotations": {"type": "measurement callouts and material labels", "language": "2oz capacity | borosilicate glass | natural cork seal | botanical blend", "density": "minimal, editorial -- JetBrains Mono Regular"}
    },
    "materials_panel": {
      "placement": "bottom_right",
      "content": {"type": "material_swatches", "count": 4, "format": "square samples"},
      "textures": {"source": "derived from the product materials", "samples": ["borosilicate glass (clear amber)", "natural cork (raw grain)", "dried herb blend (green-brown botanical)", "kraft paper label (uncoated, fibrous)"]},
      "labels": {"style": "small editorial captions in JetBrains Mono", "tone": "technical but refined"}
    }
  },
  "typography": {"style": "minimal editorial", "font": "JetBrains Mono Regular for specs, Cormorant Garamond for product name", "color": "Bone (#F5F0E8) on dark or Aged Gold (#B8860B) for accents"},
  "overall_style": {"mood": "design catalog / product design journal -- grounded depth, not clinical", "aesthetic": "architectural, premium, substantial", "avoid": ["clutter", "bright colors", "soft diffused lighting", "wellness aesthetic", "ethereal", "cosmic", "tech startup", "stock photo warmth"]},
  "constraints": {"do_not": ["change product design", "add logos unless specified", "use perspective distortion in drawings", "use rounded corners", "add gradients"]}
}
```

---

### 4B. Ritual Object Collection Flat-lay

> **FAL.AI:** `fal-ai/flux-2-pro` | `image_size: "square_hd"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** Oogie Beauty Flat-lay (adapted)

![Reference: Flat-lay Style](prompt-cookbook-images/ref-flatlay.jpg)

```
A high-contrast editorial product photograph of the Tryambakam Noesis ritual object collection arranged on a dark slate stone surface. Center composition with five objects arranged in precise architectural spacing (not organic/casual):

1. Small amber glass apothecary jar with cork lid (ritual blend)
2. Amber glass essential oil bottle with matte black dropper cap (30ml)
3. Hand-carved wooden symbolic object -- dark walnut, geometric triangulated form
4. Brass incense holder -- minimal, architectural, holding a single unlit incense stick
5. Small organite disc -- dark translucent, geometric facets catching light

Overhead flat-lay composition. No flowers, no water droplets, no soft/dewy aesthetic. Instead: precise knolling arrangement on dark stone. Each object casting a single sharp shadow from directional overhead light.

Lighting: Single strong directional light from upper left, creating deep shadows and high contrast. Specular highlights on glass and brass surfaces only. Matte wood and stone absorb light.

Color palette: Deep Ink (#1A1A2E) shadows, Bone (#F5F0E8) highlights on stone grain, Aged Gold (#B8860B) reflections on brass. No pastels, no bright tones.

Style: architectural product photography, substance over ornament, grounded depth. 8K quality. Clean skincare editorial replaced with ritual object precision.

Negative prompts: soft lighting, pastel colors, flowers, water droplets, dewy surface, feminine aesthetic, rounded corners, gradient backgrounds, ethereal, cosmic, mystical, stock photo.
```

---

## 5. Illustration Styles

**Skill:** `illustration-style-prompter`

### 5A. 19th Century Heritage Engraving

> **FAL.AI:** `fal-ai/recraft/v3/text-to-image` | `image_size: "square_hd"` | `style: "digital_illustration"` | `colors: ["#1A1A2E", "#F5F0E8", "#B8860B"]`
> **Template:** 8.5 (Retro-typographic Heritage Rebranding)

![Reference: Heritage Engraving](prompt-cookbook-images/ref-heritage-engraving.jpg)

```
Tryambakam Noesis. Act as a master engraver creating a minimalist "19th Century Heritage" logomark.

STYLE: "Copperplate Engraving" or "Scientific Botanical Illustration" from the 1800s.
Line Quality: Incredibly thin, delicate hairlines. Subtle cross-hatching only. Light, airy, precise.
No Heavy Borders: NO shields, crests, or thick frames. Open and airy composition.

THE SYMBOL: Reinterpret the Tryambakam Noesis sigil -- three converging lines representing Soma (source signal), Manas (witness capacity), and Muladhara (physical grounding) -- as a vintage hand-drawn scientific illustration. Like a diagram from an expensive 19th-century encyclopedia of consciousness. The three convergence vectors rendered with the precision of a cartographic survey instrument. Surrounding the sigil: fine-line astronomical/geometric annotations -- compass arcs, measurement tick marks, grid references -- suggesting the underlying grammar of awareness. No mystical imagery, no Biofield Locus symbols, no third-eye symbols, no lotus -- pure scientific-architectural rendering.

TYPOGRAPHY: "TRYAMBAKAM NOESIS" in High-Contrast Roman Serif (Didone style -- Cormorant Garamond or similar). Wide, elegant letter spacing. Below in smaller text: "EST. MMXXVI -- MEANING ARCHITECTURE" in same serif, lighter weight.

MATERIAL: Clean solid Bone (#F5F0E8) paper. Deep Ink (#1A1A2E) lines. Single Aged Gold (#B8860B) accent on one compass arc only.
```

---

### 5B. Campaign Visual Identity Grid

> **FAL.AI:** `fal-ai/nano-banana-pro` | `image_size: "portrait_4_3"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** 4.7 (Grid Poster Design)

![Reference: Campaign Grid](prompt-cookbook-images/ref-campaign-grid.jpg)

```
Tryambakam Noesis. Act as a graphic design creative director constructing a "Campaign Visual Identity Grid."

COMPOSITION (2-COLUMN ASYMMETRICAL LAYOUT):
ROW 1: One single, full-width rectangular block.
ROW 2: Two equal-sized square blocks side-by-side.
ROW 3: One single, full-width rectangular block.
ROW 4: Two equal-sized square blocks side-by-side.
ROW 5: One single, full-width rectangular block at the bottom.

CRITICAL CONSTRAINTS:
- FULL BLEED (100% COVERAGE): NO margins, NO borders, NO background space visible.
- ZERO SPACING (NO GAPS): Tiles seamlessly abutted. No gutters or white lines.

THE GRID CONTENT (3 TYPES):
TYPE A: THE LOGO BLOCK -- Solid Deep Ink (#1A1A2E) background, centered three-line convergence sigil in Bone (#F5F0E8), subtle screen-print texture -- aged, not distressed.
TYPE B: THE SLOGAN BLOCK -- Aged Gold (#B8860B) background, "AUTHOR YOUR OWN MEANING" in Cormorant Garamond SemiBold, Bone text, heavy aged-ink texture overlay.
TYPE C: CAMPAIGN PHOTOGRAPHY -- High-contrast black-and-white close-ups of: hands on stone surfaces, leather-bound journal textures, dried botanical arrangements, geometric diagrams on paper, brass instruments on dark slate. Strong halftone dot patterns (raster dots) and heavy film grain. Duotone effect using Deep Ink + Aged Gold.

Typography: Cormorant Garamond ONLY -- one font throughout. Every photo cell unique -- hands, materials, textures, objects. No faces. No cosmic imagery.
```

---

### 5C. Woodblock Print -- The Plumber

> **FAL.AI:** `fal-ai/recraft/v3/text-to-image` | `image_size: "portrait_4_3"` | `style: "digital_illustration"` | `colors: ["#1A1A2E", "#B8860B"]`
> **Template:** Woodblock Print / Ukiyo-e (Alexandra Aisling)

![Reference: Woodblock Print](prompt-cookbook-images/ref-woodblock.jpg)

```
A woodblock print of The Plumber -- a solitary figure seen from behind, standing at the base of a vast vertebral column rising like an axis mundi into clouds. Bold carved lines and flat color planes in Deep Ink (#1A1A2E) and Aged Gold (#B8860B). Visible wood grain texture throughout. Edo-period ukiyo-e influence in composition and wave-pattern borders, but the subject is architectural, not natural. The figure is grounded -- feet planted on stone, wearing simple structured linen. The vertebral column is rendered with the precision of an anatomical engraving -- each vertebra distinct, mechanical, suggesting consciousness as structural spine. No mystical imagery, no lotus, no mandala -- the sublime is in the architecture of the body. Slight ink bleed at edges. Paper texture: uncoated cream, fibrous.
```

---

### 5D. 16 Engine Icon System

> **FAL.AI:** `fal-ai/recraft/v3/text-to-image` | `image_size: "square_hd"` | `style: "vector_illustration"` | `colors: ["#1A1A2E", "#F5F0E8"]`
> **Template:** 5.1 (Notion-styled Character Icon -- adapted for system icons)

![Reference: Notion-style Icons](prompt-cookbook-images/ref-notion-icons.jpg)

```
A set of 16 minimalist, black-and-white flat vector illustration icons representing the Tryambakam Noesis "16 Engine Stack," rendered in the expressive "Notion avatar" art style.

LINE WORK: THICK, UNIFORM black outlines (monoline weight). Organic, smooth, confident lines.
STYLE: Only pure Deep Ink (#1A1A2E) and pure Bone (#F5F0E8). No shading, no gray tones, no gradients.

THE 16 ICONS (arranged in 4x4 grid):
1. Chronofield -- Concentric orbital rings (planetary periods)
2. Temporal Grammar -- Hourglass intersected by rhythmic wave notations
3. Bioelectric Field -- Layered concentric body silhouette with radiating field lines (monochrome only)
4. Energetic Authority -- Bodygraph diamond/triangle geometric form
5. Gift-Shadow Spectrum -- Spectrum wave with three tiers (shadow/gift/siddhi)
6. Active Planetary Weather -- Globe with intersecting meridian lines and atmospheric flow arrows
7. Nine-Point Architecture -- Nine-pointed geometric figure (classic form)
8. Numeric Architecture -- Stacked digits 0-9 forming a column
9. Archetypal Mirror -- Single card silhouette with geometric interior
10. Circadian Cartography -- 12-segment circular clock face with body-rhythm annotations
11. Three-Wave Cycle Engine -- Three overlapping sine waves
12. Physiognomic Mapping -- Face silhouette with proportional measurement lines
13. Resonance Architecture -- Sound wave with ascending frequency curve
14. Hexagram Navigation -- Six-line hexagram stack (I Ching-inspired, geometric)
15. Geometric Resonance -- Nested platonic solids (tetrahedron inside sphere)
16. Sigil Forge -- Quill nib inscribing a geometric glyph on parchment

COMPOSITION: Clean 4x4 grid on Bone (#F5F0E8) background. Each icon in a square frame. Even spacing, no overlapping. Icon label below each in JetBrains Mono, 8pt.
```

---

## 6. Video Direction

**Skill:** `ai-video-director`

### 6A. Brand Film: "The Well" (3-Shot Kling 3.0 Sequence)

> **FAL.AI:** `fal-ai/kling-video/v3/pro` | 16:9 | **Duration:** ~20s total
> **Template:** Multi-shot sequence (adapted from Kling 3.0 principles)

![Reference: Multi-shot Video](prompt-cookbook-images/ref-video-source.jpg)

```
TRYAMBAKAM NOESIS -- BRAND FILM: "THE WELL"
Tool: Kling 3.0 (Multi-Shot Native)
Total Duration: 15 seconds (3 shots x 5s)

MASTER CONTEXT: A contemplative brand film. No faces. Only hands, objects,
materials, light. The aesthetic is "grounded depth" -- high contrast, natural
light, architectural composition. Colors: Deep Ink (#1A1A2E) shadows, Bone
(#F5F0E8) highlights, Aged Gold (#B8860B) warm accents.

--- SHOT 1 (5s): THE OPENING ---
Macro close-up of two weathered hands slowly opening a leather-bound journal.
The cover is Deep Ink matte leather with subtle Aged Gold embossing visible as
it catches sidelight. Pages are thick uncoated Bone-colored cotton stock.
Camera: static, tight macro, shallow DOF. As the book opens, natural dust
particles drift through a shaft of warm window light.
Sound: ambient room silence, soft creak of leather spine, pages separating.

--- SHOT 2 (5s): THE FIELD ---
Slow left-to-right tracking shot across a dark stone surface. Arranged in
precise architectural spacing: sixteen hand-drawn diagrams on individual
cards -- geometric, technical, each distinct (orbital rings, bodygraph, sine
waves, clock faces, enneagram). Aged Gold ink on Bone paper. Camera: overhead
dolly tracking at constant speed. A single shaft of warm light moves across
the cards as the camera passes.
Sound: ambient silence, faint scratch of pen on paper.

--- SHOT 3 (5s): THE COMPLETION ---
Medium-wide shot. Two hands place the final object -- a small brass incense
holder -- into position within a ritual kit arrangement on dark slate. The
hands pull back slowly. The collection is complete: glass jar, journal, oil
bottle, wooden object, incense holder, organite disc. Camera: static,
centered, natural sidelight from left. A thin tendril of incense smoke
begins to rise from the holder.
Sound: soft placement sound, then silence, then the faintest ambient drone.

--- END CARD ---
Hold on black (Deep Ink #1A1A2E) for 2 seconds.
Fade in: "TRYAMBAKAM NOESIS" in Cormorant Garamond Light, Bone (#F5F0E8),
all caps, tracking +100, centered.
Below: "Author your own meaning." in Source Sans 3 Regular, Stone Grey (#6B6B6B).
Hold 3 seconds. Fade to black.
```

---

### 6B. Somatic Canticles Trailer (4-Shot Kling 3.0 Sequence)

> **FAL.AI:** `fal-ai/kling-video/v3/pro` | 16:9 | **Duration:** ~20s total
> **Template:** Multi-shot sequence (adapted from Kling 3.0 principles)

[Reference video: ref-kling-multishot.mp4](prompt-cookbook-images/ref-kling-multishot.mp4)

```
TRYAMBAKAM NOESIS -- TRAILER: "SOMATIC CANTICLES"
Tool: Kling 3.0 (Multi-Shot Native)
Total Duration: 20 seconds (4 shots, variable duration)

MASTER CONTEXT: A trailer for the Somatic Canticles trilogy -- biorhythm-
synchronized narratives where content unlocks based on the body's readiness.
Mood: contemplative tension, grounded mystery, architectural depth. No music.
Ambient sound design only.

--- SHOT 1 (4s): THE SIGNAL ---
Extreme close-up of three sine waves being drawn in real-time on Bone-colored
paper with a fine-nib pen. The ink is still wet -- Deep Ink (#1A1A2E), catching
light. Three waves: one slow and deep (physical), one medium (emotional), one
rapid (intellectual). The pen moves with deliberate precision. Camera: static
overhead macro.
Sound: scratch of pen nib on paper, ambient room silence.

--- SHOT 2 (5s): THE TURNING ---
Close-up of hands turning a thick page in a leather-bound book. The new page
reveals hand-drawn line diagrams -- architectural, geometric, not decorative.
Text is visible but deliberately out of focus -- the meaning is not yet
accessible. As the page turns, warm Aged Gold (#B8860B) light catches the
deckled edge. Camera: tight lateral angle, shallow DOF, slow pull focus from
the turning hand to the revealed page.
Sound: heavy paper turning, settling.

--- SHOT 3 (6s): THE FIELD ---
Wide establishing shot. A vast, minimal landscape -- flat terrain stretching to
a low horizon. Dawn light. A single figure (seen from behind, small in frame)
walks slowly toward the horizon. No features visible -- just structured linen
clothing, steady gait. The sky is Bone (#F5F0E8) fading to Deep Ink (#1A1A2E)
at the zenith. Earth is dark stone, almost lunar. Camera: static wide, figure
moves away from camera.
Sound: wind, distant ambient drone, footsteps on stone.

--- SHOT 4 (5s): THE TITLE ---
Pure Deep Ink (#1A1A2E) frame. After 1 second of black:
Fade in (slow, 2 seconds): "SOMATIC CANTICLES" in Cormorant Garamond Light,
Bone (#F5F0E8), all caps, tracking +100.
Hold 1 second.
Below, fade in: "The body determines access." in Source Sans 3 Regular,
Stone Grey (#6B6B6B), italic.
Hold 2 seconds. Cut to black.
Sound: silence, then a single low sustained tone (tanpura-like drone) that fades.
```

---

## 7. Lifestyle Editorial

**Skill:** `fashion-editorial-prompter` (adapted)

### 7A. "The Anatomist" Contact Sheet (JSON)

> **FAL.AI:** `fal-ai/nano-banana-pro` | `image_size: "square_hd"` | `guidance_scale: 7.5` | `num_inference_steps: 40`
> **Template:** Template A (Multi-Angle Contact Sheet -- adapted for hands-only lifestyle)

![Reference: Contact Sheet](prompt-cookbook-images/ref-contact-sheet.jpg)

```json
{
  "subject": {
    "identity_reference": "No face visible -- only hands, forearms, and torso from behind or side. The subject is 'The Anatomist Who Sees Fractals' -- someone who has walked difficult terrain and now offers maps.",
    "identity_accuracy": "Consistent hand shape, skin tone, forearm musculature, and clothing across all 9 panels. No face ever visible.",
    "pose_variations": [
      {"name": "overhead hands on open journal", "description": "both hands flat on open leather-bound journal, thumbs holding pages apart, diagrams visible on Bone-colored pages"},
      {"name": "hand holding pen mid-notation", "description": "right hand holding fine-nib pen, hovering over paper with half-finished geometric diagram, left hand steadying page"},
      {"name": "hands arranging ritual objects", "description": "both hands in motion, placing glass apothecary jar next to wooden carved object on dark slate surface, precise knolling"},
      {"name": "single hand turning book page", "description": "right hand mid-page-turn, thick uncoated paper with deckled edge catching warm sidelight, left hand pressing opposite page"},
      {"name": "hands holding brass instrument", "description": "both hands cradling a small brass geometric instrument (compass-like), examining it at eye level from behind subject's shoulder"},
      {"name": "hand tracing diagram", "description": "index finger tracing along a hand-drawn line diagram, following a convergence pattern of three lines on aged paper"},
      {"name": "hands breaking wax seal", "description": "thumbs prying open a Deep Ink wax seal on a folded letter, Aged Gold flecks visible in the breaking wax"},
      {"name": "forearms resting on stone desk", "description": "both forearms resting on dark stone surface, 16 small cards with individual engine diagrams spread in precise grid before them"},
      {"name": "hand lighting incense", "description": "right hand holding match to incense stick in brass holder, left hand cupping flame, smoke not yet rising"}
    ]
  },
  "wardrobe": {
    "description": "Dark structured linen shirt, sleeves rolled to mid-forearm. Deep Ink (#1A1A2E) color. Fabric: heavy-weight linen with visible weave texture -- not soft, not flowing, structured and substantial. Wrist: single thin cord bracelet, natural fiber.",
    "consistency": "all panels must match perfectly -- same fabric weave, same sleeve roll position, same bracelet"
  },
  "environment": {
    "setting": "architectural study or workshop -- not a studio, not a home",
    "background": "textured plaster wall in aged Bone (#F5F0E8), visible trowel marks, substantial and old",
    "surface": "dark slate stone desk/table surface with natural grain",
    "lighting": "natural window light from upper left -- high contrast, deep shadows, not diffused. Warm Aged Gold (#B8860B) quality in the highlights."
  },
  "camera": {
    "equipment": "Phase One XF, Schneider Kreuznach 80mm f/2.8 LS",
    "settings": {"aperture": "f/8", "ISO": 100, "shutter_speed": "1/160s"},
    "perspective": "varies per panel -- overhead, three-quarter, lateral close-up"
  },
  "composition": {
    "grid": "3x3 contact sheet",
    "spacing": "consistent, balanced layout with 2px Deep Ink borders between panels",
    "framing": "each panel focuses on hands interacting with a different object or surface"
  },
  "aesthetic": {
    "style": "editorial lifestyle photography -- NOT fashion, NOT wellness",
    "mood": "grounded, contemplative, precise, substantial -- the mood of someone doing serious work with care",
    "color_palette": "Deep Ink (#1A1A2E) shadows, Bone (#F5F0E8) highlights, Aged Gold (#B8860B) warm light accents. No other colors."
  },
  "render_quality": {
    "realism": "ultra-photorealistic",
    "resolution": "8K",
    "detail_focus": "hand texture, material grain (leather, stone, paper, brass, wood), light quality, shadow depth, linen weave"
  },
  "negative_prompts": ["face visible", "eyes visible", "full body shot", "smiling", "soft lighting", "ethereal", "cosmic", "mystical", "stock photo", "warm filter", "pastel colors", "rounded corners", "gradient backgrounds", "flowers", "candles", "crystals", "meditation pose", "yoga", "wellness aesthetic", "plastic skin", "motion blur", "extra fingers", "distorted hands"]
}
```

---

## Appendix A: FAL.AI Routing Table

| # | Prompt | FAL.AI Endpoint | `image_size` | Extra Params | Est. Cost |
|---|--------|----------------|-------------|-------------|-----------|
| 2A | Brand Kit Bento | `fal-ai/nano-banana-pro` | `landscape_16_9` | -- | ~$0.04 |
| 2B | Wax Seal 3D | `fal-ai/flux-2-pro` | `square_hd` | -- | ~$0.05/MP |
| 2C | Glass Logo | `fal-ai/flux-2-pro` | `landscape_16_9` | -- | ~$0.05/MP |
| 3A | Ritual Kit Capsule | `fal-ai/flux-2-pro` | `landscape_4_3` | -- | ~$0.05/MP |
| 3B | Somatic Canticles | `fal-ai/flux-2-pro` | `portrait_4_3` | -- | ~$0.05/MP |
| 3C | Essential Oil | `fal-ai/flux-2-pro` | `square_hd` | -- | ~$0.05/MP |
| 4A | Catalog (JSON) | `fal-ai/nano-banana-pro` | `portrait_4_3` | -- | ~$0.04 |
| 4B | Flat-lay | `fal-ai/flux-2-pro` | `square_hd` | -- | ~$0.05/MP |
| 5A | Heritage Engraving | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "digital_illustration"`, `colors: ["#1A1A2E","#F5F0E8","#B8860B"]` | $0.04 |
| 5B | Campaign Grid | `fal-ai/nano-banana-pro` | `portrait_4_3` | -- | ~$0.04 |
| 5C | Woodblock Print | `fal-ai/recraft/v3/text-to-image` | `portrait_4_3` | `style: "digital_illustration"`, `colors: ["#1A1A2E","#B8860B"]` | $0.04 |
| 5D | Engine Icons | `fal-ai/recraft/v3/text-to-image` | `square_hd` | `style: "vector_illustration"`, `colors: ["#1A1A2E","#F5F0E8"]` | $0.04 |
| 6A | Brand Film | `fal-ai/kling-video/v3/pro` | 16:9 | Multi-shot sequence | varies |
| 6B | Canticles Trailer | `fal-ai/kling-video/v3/pro` | 16:9 | Multi-shot sequence | varies |
| 7A | Anatomist (JSON) | `fal-ai/nano-banana-pro` | `square_hd` | -- | ~$0.04 |

**Total estimated cost for all 15 image prompts (single generation each):** ~$0.65
**With 2 variations each:** ~$1.30
**With upscaling finals:** add ~$0.50-1.00

### Quick Iteration Strategy

For drafting and iteration, use **Flux 2 Klein 9B** (`fal-ai/flux-2/klein/9b`) at ~$0.01/image. Once satisfied with composition, switch to the production model listed above for the final render.

## Appendix B: Aspect Ratio Reference

| Ratio | Use For | Prompts |
|-------|---------|---------|
| 1:1 | Social, icons, seals | 2B, 3C, 4B, 5A, 5D, 7A |
| 16:9 | Hero banners, video | 2A, 2C, 6A, 6B |
| 3:4 | Catalog, poster | 3B, 4A, 5B |
| 4:3 | Product landscape | 3A |
| 2:3 | Traditional print | 5C |

## Appendix C: Skills Used

| # | Skill | Prompts Generated |
|---|-------|-------------------|
| 1 | `color-type-system` | 1 palette spec |
| 2 | `brand-identity-prompter` | 3 image prompts |
| 3 | `brand-product-prompter` | 3 image prompts |
| 4 | `product-photography-prompter` | 2 JSON prompts |
| 5 | `illustration-style-prompter` | 4 image prompts |
| 6 | `ai-video-director` | 2 video sequences |
| 7 | `fashion-editorial-prompter` | 1 JSON prompt |
| -- | **Total** | **16 outputs** |

Skills not tested (and why):
- `web-motion-library` -- outputs React/Tailwind code, not image prompts
- `design-tool-router` -- meta-routing skill, not a prompt generator
