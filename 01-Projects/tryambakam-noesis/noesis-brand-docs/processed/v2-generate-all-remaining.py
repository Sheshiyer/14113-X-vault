#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - Generate ALL remaining cookbook prompts via FAL.AI
Batch 1: 3C, 4A, 4B, 5A  |  Batch 2: 5B, 5C, 5D-1, 5D-2, 5D-3, 5D-4, 7A
Each prompt gets 2 variations (seeds 42, 137).
V2 "Bioluminescent Architecture" theme.

Usage:
  source .venv/bin/activate
  python3 v2-generate-all-remaining.py [batch1|batch2|all]
  # FAL_KEY auto-loaded from ~/.claude/.env
"""
import os, sys, time, subprocess, requests
from dotenv import load_dotenv
import fal_client

# Load API keys from ~/.claude/.env
load_dotenv(os.path.expanduser("~/.claude/.env"))

BRAND_DOCS = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(BRAND_DOCS, "prompt-cookbook-images")
OUT_DIR = os.path.join(REF_DIR, "generated-v2")
os.makedirs(OUT_DIR, exist_ok=True)

if not os.environ.get("FAL_KEY"):
    print("ERROR: Set FAL_KEY environment variable first.")
    sys.exit(1)

STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit"""

# ===============================================================
# PROMPT DEFINITIONS — V2 Bioluminescent Architecture
# ===============================================================

PROMPTS = {
    "3C": {
        "name": "Essence Vial",
        "model": "nano-banana",
        "aspect": "1:1",
        "ref": "ref-minimal-mockup.jpg",
        "text": """Tryambakam Noesis, as a single defining product container: an essence vial in precision-engineered ultra-minimalist bio-digital aesthetic. Small borosilicate glass bottle (30ml) with oxidized copper dropper cap -- Art Nouveau organic curve on the cap form. Etched circuit-trace label directly into the glass surface (no paper label) -- all text in Fira Code Regular, filled with Solar Bronze (#C4873B) pigment. Brand name "TRYAMBAKAM NOESIS" etched dominant across bottle. Minimal fiber-optic sigil -- three converging lines etched below brand name. Secondary text: "ESSENTIAL BLEND -- 30ML -- SOMATIC INTEGRATION" in 6pt. Pure solid Void Teal (#0A1628) studio background. Sharp high-contrast studio lighting from above creating a warm Solar Bronze highlight on the glass shoulder and a cool Phosphor Cream (#F0EDE3) edge-glow along the bottle silhouette. Single living moss sprig at the bottle's base. Complete product centered with ample dark negative space. Borosilicate glass transparency, oxidized copper patina on cap -- precision-engineered yet organic.""",
    },
    "4A": {
        "name": "Inquiry Vial Catalog Layout",
        "model": "nano-banana",
        "aspect": "3:4",
        "ref": "ref-catalog-layout.jpg",
        "text": """Tryambakam Noesis product design catalog page. Top section: lifestyle product image of a borosilicate glass terrarium (2oz) with oxidized copper Art Nouveau lid containing living moss and crystalline quartz, circuit-trace etched label in Fira Code. Set on polished terrazzo surface inside Art Nouveau greenhouse conservatory -- oxidized copper framework, stained-glass panes filtering Solar Bronze (#C4873B) light, living ferns in background. Natural light from upper left through greenhouse glass, high-contrast with deep shadows, warm copper highlights. Bottom section: technical specification panel with architectural line drawings in Solar Bronze (#C4873B) on Void Teal (#0A1628) background -- front elevation of terrarium with lid, side cross-section showing copper seal and moss layer, top-down view of crystalline arrangement. Fine hairline technical lines with measurement callouts in Fira Code. Art Nouveau decorative copper-wire border framing the spec panel. Material swatches panel: borosilicate glass, oxidized copper, living moss, crystalline quartz. Overall: design catalog aesthetic, bioluminescent architecture, precision-engineered organic. No rounded corners, no gradients, no clutter.""",
    },
    "4B": {
        "name": "Bio-Digital Object Collection Flat-lay",
        "model": "nano-banana",
        "aspect": "1:1",
        "ref": "ref-flatlay.jpg",
        "text": """A high-contrast editorial product photograph of the Tryambakam Noesis bio-digital object collection arranged on a polished terrazzo surface with Void Teal aggregate chips. Center composition with five objects arranged in precise architectural spacing:

1. Small borosilicate glass terrarium with oxidized copper Art Nouveau lid (living moss + crystalline quartz inside)
2. Etched borosilicate essence vial with oxidized copper dropper cap (30ml)
3. Bio-resin symbolic object -- translucent amber with embedded fern frond, geometric triangulated form
4. Copper-wire incense holder -- Art Nouveau organic curves, holding a single unlit incense stick
5. Small crystalline quartz disc -- clear with internal fractures catching light

Overhead flat-lay composition. Living moss border running along one edge of the terrazzo surface -- solarpunk life element. Each object casting a single sharp shadow from directional overhead light. Fine oxidized copper wire connecting objects in an Art Nouveau curve pattern on the surface (like a circuit-board trace rendered in organic copper).

Lighting: Strong directional light from upper left with warm Solar Bronze (#C4873B) temperature. Cool Phosphor Cream (#F0EDE3) fill from below. Specular highlights on glass and copper surfaces. Bio-resin glows translucent where light passes through.

Color palette: Void Teal (#0A1628) deep shadows, Phosphor Cream (#F0EDE3) highlights on terrazzo grain, Solar Bronze (#C4873B) reflections on copper. Chlorophyll (#4A7C59) from living moss accents.

Style: precision-engineered product photography, bioluminescent architecture, bio-digital craft. 8K quality.""",
    },
    "5A": {
        "name": "Art Nouveau Heritage Engraving",
        "model": "recraft",
        "style": "digital_illustration",
        "colors": ["#0A1628", "#F0EDE3", "#C4873B"],
        "size": "square_hd",
        "text": """Tryambakam Noesis. Act as a master engraver creating a "Bio-Digital Art Nouveau Heritage" logomark.

STYLE: Art Nouveau engraving meets circuit-trace filigree. Thin delicate hairlines flowing in organic Mucha-inspired curves. Cross-hatching follows Art Nouveau botanical patterns -- not mechanical, organic. Light, airy, precise.
No Heavy Borders: NO shields, crests, or thick frames. Open and airy composition. Art Nouveau copper-wire decorative borders only -- thin, flowing, organic.

THE SYMBOL: Reinterpret the Tryambakam Noesis fiber-optic sigil -- three converging bioluminescent filaments representing Soma (source signal), Manas (witness capacity), and Muladhara (physical grounding) -- as an Art Nouveau botanical-scientific illustration. Like a diagram from an Art Nouveau architect's sketchbook of consciousness. The three convergence filaments rendered as flowing organic glass tubes with circuit-trace precision at micro level. Surrounding the sigil: Art Nouveau decorative elements -- flowering copper-wire curves, Fibonacci spiral annotations, sacred geometry grid references rendered as botanical growth patterns. No mystical imagery, no chakras, no third-eye -- pure Art Nouveau organic architecture rendered with engineering precision.

TYPOGRAPHY: "TRYAMBAKAM NOESIS" in geometric futuristic serif (Exo 2 style). Wide, elegant letter spacing. Below: "EST. MMXXVI -- MEANING ARCHITECTURE" in lighter weight.

MATERIAL: Clean solid Phosphor Cream (#F0EDE3) paper. Void Teal (#0A1628) lines. Solar Bronze (#C4873B) accent on Art Nouveau copper-wire border curves.""",
    },
    "5B": {
        "name": "Campaign Visual Identity Grid",
        "model": "nano-banana",
        "aspect": "3:4",
        "ref": "ref-campaign-grid.jpg",
        "text": """Tryambakam Noesis Campaign Visual Identity Grid. 2-column asymmetrical layout. Full bleed, zero spacing between tiles.

THE GRID CONTENT (3 TYPES):
TYPE A: THE SIGIL BLOCK -- Solid Void Teal (#0A1628) background with subtle circuit-board trace pattern at 5% opacity, centered fiber-optic convergence sigil in Phosphor Cream (#F0EDE3), Art Deco geometric frame around the sigil -- sharp, symmetrical, gold.
TYPE B: THE SLOGAN BLOCK -- Solar Bronze (#C4873B) background with Art Deco geometric sunburst pattern, "AUTHOR YOUR OWN MEANING" in Exo 2 SemiBold, Phosphor Cream text, terrazzo texture overlay at 10% opacity.
TYPE C: CAMPAIGN PHOTOGRAPHY -- High-contrast duotone photographs of: hands on polished terrazzo surfaces, bio-resin objects catching light, living moss terrariums, circuit-trace copper patterns on glass, borosilicate vessels on oxidized copper stands. Duotone effect using Void Teal + Solar Bronze. Art Deco geometric overlay lines (thin, precise, gold) intersecting each photo. Strong halftone dot patterns and film grain.

Layout: ROW 1 full-width block, ROW 2 two squares, ROW 3 full-width, ROW 4 two squares, ROW 5 full-width.
Typography: Exo 2 ONLY -- one font throughout. Every photo cell unique -- hands, materials, glass, copper, moss, terrazzo. No faces. No cyberpunk neon. Art Deco precision meets solarpunk vitality.""",
    },
    "5C": {
        "name": "Art Nouveau Panel - The Plumber",
        "model": "recraft",
        "style": "digital_illustration",
        "colors": ["#0A1628", "#C4873B", "#4A7C59"],
        "size": "portrait_4_3",
        "text": """An Art Nouveau panel illustration of The Plumber -- a solitary figure seen from behind, standing at the base of a vast vertebral column rising like an axis mundi through an Art Nouveau greenhouse conservatory ceiling into sky. The figure rendered in Mucha-inspired style -- flowing organic lines, flat color planes in Void Teal (#0A1628), Solar Bronze (#C4873B), and Chlorophyll (#4A7C59). Art Nouveau organic border of flowering copper-wire curves and living vine tendrils framing the composition. The figure is grounded -- feet planted on polished terrazzo, wearing structured technical linen. The vertebral column rendered as a bio-digital structure -- each vertebra distinct, part organic bone and part circuit-board trace, with fiber-optic filaments threading through the spinal canal, glowing faint Phosphor Cream. Living moss and ferns growing on the vertebrae at lower levels, becoming more engineered and precise toward the top. Art Nouveau stained-glass panes of the greenhouse visible at edges. No mystical imagery, no mandala -- the sublime is in the architecture of the bio-digital body. Paper texture: mycelium-substrate cream, fibrous, warm.""",
    },
    "5D-1": {
        "name": "Vedic Engine Icons",
        "model": "recraft",
        "style": "vector_illustration/line_circuit",
        "colors": ["#0A1628", "#F0EDE3"],
        "size": "square_hd",
        "text": """4 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Vedic Engines" in 2x2 grid layout.

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision details. Uniform weight monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients. Art Nouveau organic curves, not mechanical straight lines.

THE 4 ICONS:
1. Vimshottari Dasha -- Concentric orbital rings with Art Nouveau flowing curves (planetary period cycles)
2. Nakshatra Engine -- Crescent moon with star field arranged in Art Nouveau flowing pattern
3. Chakra-Kosha Mapping -- Layered concentric body silhouette with circuit-trace meridian lines (monochrome only)
4. Human Design -- Bodygraph diamond/triangle form with Art Nouveau organic connecting lines

Clean 2x2 grid on Phosphor Cream background. Each icon in a square frame with thin Art Nouveau copper-wire corner accents. Even spacing. Icon label below each in Fira Code, 8pt.""",
    },
    "5D-2": {
        "name": "Western Engine Icons",
        "model": "recraft",
        "style": "vector_illustration/line_circuit",
        "colors": ["#0A1628", "#F0EDE3"],
        "size": "square_hd",
        "text": """4 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Western Engines" in 2x2 grid layout.

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision details. Uniform weight monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients.

THE 4 ICONS:
5. Gene Keys -- Spectrum wave with three tiers (shadow/gift/siddhi) rendered as Art Nouveau flowing layers
6. Astrocartography -- Globe with intersecting meridian lines flowing in organic curves
7. Enneagram -- Nine-pointed geometric figure with Art Nouveau curved connecting lines
8. Numerology -- Digits 0-9 arranged in Fibonacci spiral column

Clean 2x2 grid on Phosphor Cream background. Each icon in square frame with Art Nouveau corner accents. Even spacing. Fira Code labels.""",
    },
    "5D-3": {
        "name": "Bridge Engine Icons",
        "model": "recraft",
        "style": "vector_illustration/line_circuit",
        "colors": ["#0A1628", "#F0EDE3"],
        "size": "square_hd",
        "text": """3 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Bridge Engines" in 2x1+1 layout (2 top, 1 bottom center).

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision. Uniform monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients.

THE 3 ICONS:
9. Tarot -- Single card silhouette with Art Nouveau decorative interior pattern
10. TCM Organ Clock -- 12-segment circular clock face with flowing Art Nouveau sector borders
11. Biorhythm Engine -- Three overlapping sine waves rendered as flowing Art Nouveau organic curves

Clean grid on Phosphor Cream background. Square frames with Art Nouveau corner accents. Fira Code labels.""",
    },
    "5D-4": {
        "name": "Biofield Engine Icons",
        "model": "recraft",
        "style": "vector_illustration/line_circuit",
        "colors": ["#0A1628", "#F0EDE3"],
        "size": "square_hd",
        "text": """2 minimalist Art Nouveau-styled flat vector icons for Tryambakam Noesis "Biofield Engines" side-by-side.

LINE WORK: Flowing organic Art Nouveau curves with circuit-trace precision. Uniform monoline outlines.
STYLE: Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3). No shading, no gradients.

THE 2 ICONS:
12. HRV Engine -- Heart rhythm waveform (ECG-style line) flowing through Art Nouveau vine pattern
13. Biofield & Raga Engine -- Sound wave with ascending frequency curve, notes rendered as Art Nouveau flowering forms

Clean side-by-side on Phosphor Cream background. Square frames. Art Nouveau corner accents. Fira Code labels.""",
    },
    "7A": {
        "name": "The Cartographer Contact Sheet",
        "model": "nano-banana",
        "aspect": "1:1",
        "ref": "ref-contact-sheet.jpg",
        "text": """Tryambakam Noesis -- "The Cartographer" editorial contact sheet. 3x3 grid of 9 panels showing hands-only lifestyle photography inside an Art Nouveau greenhouse conservatory. No face visible -- only hands and forearms in dark structured technical linen (Void Teal #0A1628). Same hands across all 9 panels for consistency.

9 PANELS:
1. Overhead hands on open Somatic Codex with bio-resin spine, Art Nouveau circuit-trace diagrams visible on mycelium pages
2. Right hand holding copper-nib pen, hovering over half-finished geometric-organic diagram on mycelium paper
3. Both hands placing borosilicate terrarium next to bio-resin symbolic object on polished terrazzo
4. Right hand mid-page-turn, thick mycelium-substrate paper with fibrous edge catching warm Solar Bronze sidelight
5. Both hands cradling small oxidized copper instrument at shoulder level from behind -- Art Nouveau decorative form
6. Index finger tracing along a fiber-optic convergence pattern etched into glass surface, light following the trace
7. Thumbs breaking open an oxidized copper wax seal on folded letter, Solar Bronze (#C4873B) patina flecks visible
8. Forearms resting on polished terrazzo surface, 13 small engine diagram cards spread in grid, printed on mycelium paper in Art Nouveau style
9. Right hand lighting incense in copper-wire Art Nouveau holder, left hand cupping the first wisps of smoke

Camera: Phase One XF, 80mm, f/8. Natural greenhouse light from upper left through stained-glass panes -- warm Solar Bronze highlights, Void Teal (#0A1628) deep shadows. Polished terrazzo desk. Art Nouveau greenhouse structure (oxidized copper + stained glass) visible in background. 2px Titanium (#8A9BA8) borders between panels. Ultra-photorealistic, 8K detail on hand texture, material grain, copper patina, moss texture.""",
    },
}


# ===============================================================
# GENERATION FUNCTIONS
# ===============================================================


def download_image(url, filepath):
    """Download image from URL to local file."""
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
        slug = prompt_data["name"].lower().replace(" ", "-").replace("/", "-")
        out_name = f"{prompt_id}-{slug}-nanobananapro-{variant}.png"
        out_name = out_name.replace("---", "-").replace("--", "-")
        out_path = os.path.join(OUT_DIR, out_name)
        download_image(result["images"][0]["url"], out_path)


def generate_recraft(prompt_id, prompt_data, seeds=(42, 137)):
    """Generate with Recraft V3 (illustration/vector -- no image_urls needed, uses colors param).
    Recraft V3 returns SVG for vector_illustration styles and WebP for digital_illustration.
    This function saves the native format and auto-converts to PNG for preview compatibility.
    """
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
        img_url = result["images"][0]["url"]
        slug = prompt_data["name"].lower().replace(" ", "-").replace("/", "-")
        base_name = f"{prompt_id}-{slug}-recraft-{variant}"
        base_name = base_name.replace("---", "-").replace("--", "-")

        # Detect actual format from URL or content-type
        is_svg = img_url.endswith(".svg") or "vector" in prompt_data["style"]
        if is_svg:
            native_path = os.path.join(OUT_DIR, f"{base_name}.svg")
            download_image(img_url, native_path)
            # Convert SVG → PNG using rsvg-convert
            png_path = os.path.join(OUT_DIR, f"{base_name}.png")
            try:
                subprocess.run(
                    ["rsvg-convert", "-w", "2048", "-h", "2048", "--keep-aspect-ratio",
                     native_path, "-o", png_path],
                    check=True, capture_output=True,
                )
                size_kb = os.path.getsize(png_path) / 1024
                print(f"  Converted SVG → PNG: {png_path} ({size_kb:.0f} KB)")
            except (subprocess.CalledProcessError, FileNotFoundError) as e:
                print(f"  WARNING: SVG→PNG conversion failed: {e}")
        else:
            # digital_illustration returns WebP — save native + convert
            native_path = os.path.join(OUT_DIR, f"{base_name}.webp")
            download_image(img_url, native_path)
            png_path = os.path.join(OUT_DIR, f"{base_name}.png")
            try:
                subprocess.run(
                    ["sips", "-s", "format", "png", native_path, "--out", png_path],
                    check=True, capture_output=True,
                )
                size_kb = os.path.getsize(png_path) / 1024
                print(f"  Converted WebP → PNG: {png_path} ({size_kb:.0f} KB)")
            except (subprocess.CalledProcessError, FileNotFoundError) as e:
                print(f"  WARNING: WebP→PNG conversion failed: {e}")


# ===============================================================
# BATCH RUNNER
# ===============================================================


def run_batch(prompt_ids):
    """Run a batch of prompts sequentially (parallelism at the script level)."""
    # Upload style anchor once for all Nano Banana calls
    anchor_url = None
    needs_anchor = any(PROMPTS[pid]["model"] == "nano-banana" for pid in prompt_ids)
    if needs_anchor:
        print("\nUploading style anchor (V2 bento)...")
        anchor_url = fal_client.upload_file(STYLE_ANCHOR)
        print(f"  Anchor: {anchor_url[:60]}...")

    for pid in prompt_ids:
        p = PROMPTS[pid]
        print(f"\n{'='*60}")
        print(f"  GENERATING: {pid} -- {p['name']}")
        print(f"{'='*60}")

        if p["model"] == "nano-banana":
            generate_nano_banana(pid, p, anchor_url)
        elif p["model"] == "recraft":
            generate_recraft(pid, p)

        print(f"\n  [OK] {pid} {p['name']} -- DONE")

    print(f"\n{'='*60}")
    print(f"  BATCH COMPLETE: {', '.join(prompt_ids)}")
    print(f"{'='*60}")


# ===============================================================
# MAIN
# ===============================================================


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"

    # 5A and 5C prompts exceed Recraft's 1000-char limit in full form
    # Use v2-generate-recraft-batch.py for condensed 5A/5C instead
    batch1 = ["3C", "4A", "4B"]
    batch2 = ["5B", "5D-1", "5D-2", "5D-3", "5D-4", "7A"]

    print("=" * 60)
    print("TRYAMBAKAM NOESIS V2 - Bioluminescent Architecture")
    print("Generate ALL Remaining Cookbook Prompts")
    print("=" * 60)
    print(f"\n  Mode:        {mode}")
    print(f"  Output dir:  {OUT_DIR}")
    print(f"  Anchor:      {STYLE_ANCHOR}")
    print(f"  Batch 1:     {', '.join(batch1)}")
    print(f"  Batch 2:     {', '.join(batch2)}")

    if mode == "batch1":
        run_batch(batch1)
    elif mode == "batch2":
        run_batch(batch2)
    elif mode == "all":
        run_batch(batch1 + batch2)
    else:
        print(f"\nUsage: python3 {sys.argv[0]} [batch1|batch2|all]")
        sys.exit(1)

    print(f"\n{'='*60}")
    print("  ALL DONE -- V2 Bioluminescent Architecture")
    print(f"  Output: {OUT_DIR}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
