#!/usr/bin/env python3
"""
Tryambakam Noesis - Generate ALL remaining cookbook prompts via FAL.AI
Batch 1: 3C, 4A, 4B, 5A  |  Batch 2: 5B, 5C, 5D, 7A
Each prompt gets 2 variations (seeds 42, 137).
Uses bento V1 as style anchor for Nano Banana Pro calls.
Uses Recraft V3 for illustration prompts (5A, 5C, 5D).

Usage:
  export FAL_KEY="your-key-here"
  python3 generate-all-remaining.py [batch1|batch2|all]
"""
import os, sys, time, requests, fal_client

BRAND_DOCS = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(BRAND_DOCS, "prompt-cookbook-images")
OUT_DIR = os.path.join(REF_DIR, "generated")
os.makedirs(OUT_DIR, exist_ok=True)

if not os.environ.get("FAL_KEY"):
    print("ERROR: Set FAL_KEY environment variable first.")
    sys.exit(1)

STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")

NEGATIVE = """ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult, stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers, candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors"""

# ═══════════════════════════════════════════════════════
# PROMPT DEFINITIONS
# ═══════════════════════════════════════════════════════

PROMPTS = {
    "3C": {
        "name": "Essential Oil Bottle",
        "model": "nano-banana",
        "aspect": "1:1",
        "ref": "ref-minimal-mockup.jpg",
        "text": """Tryambakam Noesis, as a single defining product container: an essential oil bottle in severe ultra-minimalist monochromatic aesthetic. Small amber glass bottle (30ml) with matte black dropper cap. Kraft paper label with Deep Ink (#1A1A2E) typography -- all text in JetBrains Mono Regular. Brand name "TRYAMBAKAM NOESIS" dominant across label. Minimal fine-line wireframe of the three-convergence sigil. Secondary text: "ESSENTIAL BLEND -- 30ML -- SOMATIC INTEGRATION" in 6pt. Pure solid Deep Ink (#1A1A2E) studio background. Sharp high-contrast studio lighting from above creating a single warm highlight on the glass shoulder. Complete product centered with ample dark negative space. Matte amber glass texture, no gloss -- substance over ornament.""",
    },
    "4A": {
        "name": "Ritual Blend Catalog Layout",
        "model": "nano-banana",
        "aspect": "3:4",
        "ref": "ref-catalog-layout.jpg",
        "text": """Tryambakam Noesis product design catalog page. Top section: lifestyle product image of a glass apothecary jar (2oz) with cork lid containing dried herbs and resins, kraft paper label with Deep Ink typography. Set on dark stone surface with scattered dried herb leaves, small piece of raw resin, single brass spoon. Natural sidelight from upper left, high-contrast with deep shadows. Textured plaster wall in Bone (#F5F0E8) background. Bottom section: technical specification panel with architectural line drawings in Aged Gold (#B8860B) on Deep Ink (#1A1A2E) background -- front elevation of jar with lid, side cross-section showing cork seal and herb fill level, top-down view of jar mouth. Fine hairline technical lines with measurement callouts in JetBrains Mono. Material swatches panel: borosilicate glass, natural cork, dried herb blend, kraft paper. Overall: design catalog aesthetic, grounded depth, architectural premium. No rounded corners, no gradients, no clutter.""",
    },
    "4B": {
        "name": "Ritual Object Flat-lay",
        "model": "nano-banana",
        "aspect": "1:1",
        "ref": "ref-flatlay.jpg",
        "text": """A high-contrast editorial product photograph of the Tryambakam Noesis ritual object collection arranged on a dark slate stone surface. Center composition with five objects arranged in precise architectural spacing (not organic/casual):

1. Small amber glass apothecary jar with cork lid (ritual blend)
2. Amber glass essential oil bottle with matte black dropper cap (30ml)
3. Hand-carved wooden symbolic object -- dark walnut, geometric triangulated form
4. Brass incense holder -- minimal, architectural, holding a single unlit incense stick
5. Small organite disc -- dark translucent, geometric facets catching light

Overhead flat-lay composition. No flowers, no water droplets, no soft/dewy aesthetic. Instead: precise knolling arrangement on dark stone. Each object casting a single sharp shadow from directional overhead light.

Lighting: Single strong directional light from upper left, creating deep shadows and high contrast. Specular highlights on glass and brass surfaces only. Matte wood and stone absorb light.

Color palette: Deep Ink (#1A1A2E) shadows, Bone (#F5F0E8) highlights on stone grain, Aged Gold (#B8860B) reflections on brass. No pastels, no bright tones.

Style: architectural product photography, substance over ornament, grounded depth. 8K quality.""",
    },
    "5A": {
        "name": "Heritage Engraving",
        "model": "recraft",
        "style": "digital_illustration",
        "colors": ["#1A1A2E", "#F5F0E8", "#B8860B"],
        "size": "square_hd",
        "text": """Tryambakam Noesis. A minimalist "19th Century Heritage" logomark in Copperplate Engraving style. Incredibly thin, delicate hairlines. Subtle cross-hatching only. Light, airy, precise. No heavy borders, no shields, no crests.

THE SYMBOL: The Tryambakam Noesis sigil -- three converging lines representing Soma (source signal), Manas (witness capacity), and Muladhara (physical grounding) -- rendered as a vintage hand-drawn scientific illustration. Like a diagram from an expensive 19th-century encyclopedia of consciousness. Three convergence vectors rendered with cartographic survey precision. Surrounding: fine-line astronomical/geometric annotations -- compass arcs, measurement tick marks, grid references. No mystical imagery, no chakras, no third-eye, no lotus -- pure scientific-architectural rendering.

TYPOGRAPHY: "TRYAMBAKAM NOESIS" in High-Contrast Roman Serif (Didone style). Wide elegant letter spacing. Below: "EST. MMXXVI -- MEANING ARCHITECTURE" in lighter weight.

MATERIAL: Clean solid Bone (#F5F0E8) paper background. Deep Ink (#1A1A2E) lines. Single Aged Gold (#B8860B) accent on one compass arc only.""",
    },
    "5B": {
        "name": "Campaign Visual Identity Grid",
        "model": "nano-banana",
        "aspect": "3:4",
        "ref": "ref-campaign-grid.jpg",
        "text": """Tryambakam Noesis Campaign Visual Identity Grid. 2-column asymmetrical layout. Full bleed, zero spacing between tiles.

THE GRID CONTENT (3 TYPES):
TYPE A: THE LOGO BLOCK -- Solid Deep Ink (#1A1A2E) background, centered three-line convergence sigil in Bone (#F5F0E8), subtle screen-print texture.
TYPE B: THE SLOGAN BLOCK -- Aged Gold (#B8860B) background, "AUTHOR YOUR OWN MEANING" in Cormorant Garamond SemiBold, Bone text, heavy aged-ink texture overlay.
TYPE C: CAMPAIGN PHOTOGRAPHY -- High-contrast black-and-white close-ups of: hands on stone surfaces, leather-bound journal textures, dried botanical arrangements, geometric diagrams on paper, brass instruments on dark slate. Strong halftone dot patterns and heavy film grain. Duotone effect using Deep Ink + Aged Gold.

Layout: ROW 1 full-width block, ROW 2 two squares, ROW 3 full-width, ROW 4 two squares, ROW 5 full-width.
Typography: Cormorant Garamond ONLY. Every photo cell unique -- hands, materials, textures, objects. No faces. No cosmic imagery.""",
    },
    "5C": {
        "name": "Woodblock Print - The Plumber",
        "model": "recraft",
        "style": "digital_illustration",
        "colors": ["#1A1A2E", "#B8860B"],
        "size": "1024x1365",
        "text": """A woodblock print of The Plumber -- a solitary figure seen from behind, standing at the base of a vast vertebral column rising like an axis mundi into clouds. Bold carved lines and flat color planes in Deep Ink (#1A1A2E) and Aged Gold (#B8860B). Visible wood grain texture throughout. Edo-period ukiyo-e influence in composition and wave-pattern borders, but the subject is architectural, not natural. The figure is grounded -- feet planted on stone, wearing simple structured linen. The vertebral column is rendered with the precision of an anatomical engraving -- each vertebra distinct, mechanical, suggesting consciousness as structural spine. No mystical imagery, no lotus, no mandala -- the sublime is in the architecture of the body. Slight ink bleed at edges. Paper texture: uncoated cream, fibrous.""",
    },
    "5D": {
        "name": "13 Engine Icon System",
        "model": "recraft",
        "style": "vector_illustration",
        "colors": ["#1A1A2E", "#F5F0E8"],
        "size": "square_hd",
        "text": """A set of 13 minimalist, black-and-white flat vector illustration icons representing the Tryambakam Noesis "13 Engine Stack," rendered in the expressive "Notion avatar" art style.

LINE WORK: THICK, UNIFORM black outlines (monoline weight). Organic, smooth, confident lines.
STYLE: Only pure Deep Ink (#1A1A2E) and pure Bone (#F5F0E8). No shading, no gray tones, no gradients.

THE 13 ICONS (arranged in 4x4 grid, last row has 1):
1. Vimshottari Dasha -- Concentric orbital rings
2. Nakshatra Engine -- Crescent moon with star field grid
3. Chakra-Kosha Mapping -- Layered concentric body silhouette (monochrome only)
4. Human Design -- Bodygraph diamond/triangle geometric form
5. Gene Keys -- Spectrum wave with three tiers
6. Astrocartography -- Globe with intersecting meridian lines
7. Enneagram -- Nine-pointed geometric figure
8. Numerology -- Stacked digits forming a column
9. Tarot -- Single card silhouette with geometric interior
10. TCM Organ Clock -- 12-segment circular clock face
11. Biorhythm Engine -- Three overlapping sine waves
12. HRV Engine -- Heart rhythm waveform ECG-style
13. Biofield & Raga Engine -- Sound wave with ascending frequency curve

COMPOSITION: Clean grid on Bone (#F5F0E8) background. Each icon in a square frame. Even spacing. Icon label below each in small text.""",
    },
    "7A": {
        "name": "The Cartographer Contact Sheet",
        "model": "nano-banana",
        "aspect": "1:1",
        "ref": "ref-contact-sheet.jpg",
        "text": """Tryambakam Noesis -- "The Cartographer" editorial contact sheet. 3x3 grid of 9 panels showing hands-only lifestyle photography. No face visible -- only hands, forearms in dark structured linen shirt (Deep Ink #1A1A2E). Same hands across all 9 panels for consistency.

9 PANELS:
1. Overhead hands on open leather-bound journal, diagrams visible on Bone pages
2. Right hand holding fine-nib pen, hovering over half-finished geometric diagram
3. Both hands placing glass apothecary jar next to wooden carved object on dark slate
4. Right hand mid-page-turn, thick uncoated paper with deckled edge catching warm sidelight
5. Both hands cradling small brass geometric instrument at shoulder level from behind
6. Index finger tracing along a hand-drawn convergence pattern on aged paper
7. Thumbs prying open a Deep Ink wax seal on folded letter, Aged Gold flecks visible
8. Forearms resting on dark stone surface, 13 small engine diagram cards spread in grid
9. Right hand holding match to incense stick in brass holder, left hand cupping flame

Camera: Phase One XF, 80mm, f/8. Natural window light from upper left -- high contrast, deep shadows. Warm Aged Gold (#B8860B) highlights. Dark slate stone desk. Textured plaster wall in aged Bone (#F5F0E8). 2px Deep Ink borders between panels. Ultra-photorealistic, 8K detail on hand texture, material grain.""",
    },
}


def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")


def generate_nano_banana(prompt_id, prompt_data, anchor_url, seeds=(42, 137)):
    """Generate with Nano Banana Pro + style anchor + composition reference."""
    ref_path = os.path.join(REF_DIR, prompt_data["ref"])
    comp_url = fal_client.upload_file(ref_path)
    full_prompt = f"{prompt_data['text']}\n\nAvoid: {NEGATIVE}"

    for seed in seeds:
        variant = "v1" if seed == 42 else "v2"
        print(f"\n  [{prompt_id}] Nano Banana Pro seed={seed}...")
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": full_prompt,
                "image_urls": [anchor_url, comp_url],
                "aspect_ratio": prompt_data["aspect"],
                "resolution": "2K",
                "output_format": "png",
                "seed": seed,
                "num_images": 1,
            },
        )
        out_name = f"{prompt_id}-{prompt_data['name'].lower().replace(' ', '-').replace('/', '-').replace('--', '-')}-nanobananapro-{variant}.png"
        # Clean up filename
        out_name = out_name.replace("---", "-").replace("--", "-")
        out_path = os.path.join(OUT_DIR, out_name)
        download_image(result["images"][0]["url"], out_path)


def generate_recraft(prompt_id, prompt_data, seeds=(42, 137)):
    """Generate with Recraft V3 (illustration/vector — no image_urls needed, uses colors param)."""
    for seed in seeds:
        variant = "v1" if seed == 42 else "v2"
        print(f"\n  [{prompt_id}] Recraft V3 ({prompt_data['style']}) seed={seed}...")

        args = {
            "prompt": prompt_data["text"],
            "image_size": prompt_data["size"],
            "style": prompt_data["style"],
            "seed": seed,
        }
        if "colors" in prompt_data:
            args["colors"] = [{"rgb": c} for c in prompt_data["colors"]]

        result = fal_client.subscribe(
            "fal-ai/recraft/v3/text-to-image",
            arguments=args,
        )
        out_name = f"{prompt_id}-{prompt_data['name'].lower().replace(' ', '-').replace('/', '-').replace('--', '-')}-recraft-{variant}.png"
        out_name = out_name.replace("---", "-").replace("--", "-")
        out_path = os.path.join(OUT_DIR, out_name)
        download_image(result["images"][0]["url"], out_path)


def run_batch(prompt_ids):
    """Run a batch of prompts sequentially (parallelism at the script level)."""
    # Upload style anchor once for all Nano Banana calls
    anchor_url = None
    needs_anchor = any(PROMPTS[pid]["model"] == "nano-banana" for pid in prompt_ids)
    if needs_anchor:
        print("\nUploading style anchor (bento V1)...")
        anchor_url = fal_client.upload_file(STYLE_ANCHOR)
        print(f"  Anchor: {anchor_url[:60]}...")

    for pid in prompt_ids:
        p = PROMPTS[pid]
        print(f"\n{'='*60}")
        print(f"  GENERATING: {pid} — {p['name']}")
        print(f"{'='*60}")

        if p["model"] == "nano-banana":
            generate_nano_banana(pid, p, anchor_url)
        elif p["model"] == "recraft":
            generate_recraft(pid, p)

        print(f"\n  ✅ {pid} {p['name']} — DONE")

    print(f"\n{'='*60}")
    print(f"  BATCH COMPLETE: {', '.join(prompt_ids)}")
    print(f"{'='*60}")


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"

    batch1 = ["3C", "4A", "4B", "5A"]
    batch2 = ["5B", "5C", "5D", "7A"]

    if mode == "batch1":
        run_batch(batch1)
    elif mode == "batch2":
        run_batch(batch2)
    elif mode == "all":
        run_batch(batch1 + batch2)
    else:
        print(f"Usage: python3 {sys.argv[0]} [batch1|batch2|all]")
        sys.exit(1)


if __name__ == "__main__":
    main()
