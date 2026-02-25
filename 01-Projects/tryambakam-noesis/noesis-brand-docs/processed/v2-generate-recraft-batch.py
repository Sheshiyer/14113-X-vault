#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - Recraft V3 illustrations + remaining Nano Banana (7A)
Recraft V3 has 1000 char prompt limit — prompts condensed.
V2 "Bioluminescent Architecture" theme.
"""
import os, sys, subprocess, requests
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

# ═══════ RECRAFT PROMPTS (condensed to <1000 chars each) ═══════

PROMPT_5A = """Tryambakam Noesis "Bio-Digital Art Nouveau Heritage" logomark. Art Nouveau engraving meets circuit-trace filigree. Thin delicate hairlines in organic Mucha-inspired curves with botanical cross-hatching. Airy and precise, no heavy borders or shields.

Central sigil: three converging fiber-optic filaments (source, witness, ground) as Art Nouveau botanical-scientific diagram. Flowing glass tubes with circuit-trace micro detail. Surrounding: Art Nouveau copper-wire curves, Fibonacci annotations, sacred geometry as botanical growth patterns. No mystical imagery, no chakras.

"TRYAMBAKAM NOESIS" in geometric futuristic serif (Exo 2 style), wide spacing. Below: "EST. MMXXVI -- MEANING ARCHITECTURE" lighter weight.

Phosphor Cream (#F0EDE3) paper. Void Teal (#0A1628) lines. Solar Bronze (#C4873B) accent on copper-wire borders."""

PROMPT_5C = """Art Nouveau panel of The Plumber -- solitary figure from behind, at base of vast vertebral column rising through Art Nouveau greenhouse conservatory into sky. Mucha-inspired flowing organic lines, flat color planes in Void Teal (#0A1628), Solar Bronze (#C4873B), Chlorophyll (#4A7C59). Art Nouveau border of copper-wire curves and vine tendrils. Figure grounded on polished terrazzo in structured technical linen. Vertebral column: bio-digital structure -- vertebrae part organic bone, part circuit-board trace, fiber-optic filaments through spinal canal glowing Phosphor Cream. Moss and ferns growing on lower vertebrae, more engineered toward top. Stained-glass panes at edges. No mystical imagery. Mycelium-substrate cream paper texture, fibrous."""

PROMPT_5D_1 = """4 minimalist Art Nouveau flat vector icons, "Vedic Engines" 2x2 grid. Flowing organic curves with circuit-trace precision. Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3), no gradients.

Icons: 1.Vimshottari Dasha: concentric orbital rings with Art Nouveau curves 2.Nakshatra: crescent moon with star field in flowing pattern 3.Chakra-Kosha: layered concentric body silhouette with circuit-trace meridians 4.Human Design: bodygraph diamond form with organic connecting lines

Phosphor Cream background. Square frames, Art Nouveau corner accents. Fira Code labels."""

PROMPT_5D_2 = """4 minimalist Art Nouveau flat vector icons, "Western Engines" 2x2 grid. Flowing curves with circuit-trace precision. Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3), no gradients.

Icons: 5.Gene Keys: spectrum wave three tiers as Art Nouveau flowing layers 6.Astrocartography: globe with organic meridian curves 7.Enneagram: nine-pointed figure with Art Nouveau curved connections 8.Numerology: digits in Fibonacci spiral column

Phosphor Cream background. Square frames, Art Nouveau corner accents. Fira Code labels."""

PROMPT_5D_3 = """3 minimalist Art Nouveau flat vector icons, "Bridge Engines" 2-top 1-bottom layout. Flowing curves with circuit-trace precision. Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3), no gradients.

Icons: 9.Tarot: card silhouette with Art Nouveau decorative interior 10.TCM Organ Clock: 12-segment circle with Art Nouveau sector borders 11.Biorhythm: three overlapping sine waves as organic curves

Phosphor Cream background. Square frames, Art Nouveau corner accents. Fira Code labels."""

PROMPT_5D_4 = """2 minimalist Art Nouveau flat vector icons, "Biofield Engines" side-by-side. Flowing curves with circuit-trace precision. Only Void Teal (#0A1628) and Phosphor Cream (#F0EDE3), no gradients.

Icons: 12.HRV Engine: ECG heart rhythm waveform through Art Nouveau vine pattern 13.Biofield & Raga: ascending frequency sound wave as Art Nouveau flowering forms

Phosphor Cream background. Square frames. Art Nouveau corner accents. Fira Code labels."""

PROMPT_7A = """Tryambakam Noesis "The Cartographer" editorial contact sheet. 3x3 grid, 9 panels, hands-only lifestyle photography inside Art Nouveau greenhouse conservatory. No face -- only hands and forearms in dark structured technical linen (Void Teal #0A1628). Same hands all panels.

Panels: 1.Hands on open Somatic Codex with bio-resin spine on mycelium pages 2.Copper-nib pen hovering over geometric-organic diagram 3.Placing borosilicate terrarium next to bio-resin object on terrazzo 4.Page-turn with fibrous mycelium edge in Solar Bronze light 5.Cradling oxidized copper Art Nouveau instrument from behind 6.Finger tracing fiber-optic convergence pattern on glass 7.Breaking oxidized copper seal, Solar Bronze patina flecks 8.Forearms resting, 13 engine cards in grid on terrazzo 9.Lighting incense in copper-wire Art Nouveau holder

Phase One XF 80mm f/8. Greenhouse light through stained glass, Solar Bronze (#C4873B) highlights. Polished terrazzo desk. 2px Titanium borders. 8K detail."""


def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")


def gen_recraft(prompt_id, name, prompt, style, colors, size, seeds=(42, 137)):
    """Generate with Recraft V3. Auto-detects SVG vs WebP output and converts to PNG."""
    for seed in seeds:
        variant = "v1" if seed == 42 else "v2"
        print(f"\n  [{prompt_id}] Recraft V3 ({style}) seed={seed}...")
        print(f"  Prompt length: {len(prompt)} chars")

        args = {
            "prompt": prompt,
            "image_size": size,
            "style": style,
            "seed": seed,
        }
        if colors:
            args["colors"] = [{"rgb": c} for c in colors]

        result = fal_client.subscribe(
            "fal-ai/recraft/v3/text-to-image",
            arguments=args,
        )
        img_url = result["images"][0]["url"]
        slug = name.lower().replace(" ", "-").replace("--", "-")
        base_name = f"{prompt_id}-{slug}-recraft-{variant}"

        # Detect actual format: vector_illustration → SVG, digital_illustration → WebP
        is_svg = img_url.endswith(".svg") or "vector" in style
        if is_svg:
            native_path = os.path.join(OUT_DIR, f"{base_name}.svg")
            download_image(img_url, native_path)
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


def gen_nano_banana(prompt_id, name, prompt, aspect, ref_file, anchor_url, seeds=(42, 137)):
    comp_url = fal_client.upload_file(os.path.join(REF_DIR, ref_file))
    full_prompt = f"{prompt}\n\nAvoid: {NEGATIVE}"

    for seed in seeds:
        variant = "v1" if seed == 42 else "v2"
        print(f"\n  [{prompt_id}] Nano Banana Pro seed={seed}...")
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": full_prompt,
                "image_urls": [anchor_url, comp_url],
                "aspect_ratio": aspect,
                "resolution": "2K",
                "output_format": "png",
                "seed": seed,
                "num_images": 1,
            },
        )
        slug = name.lower().replace(" ", "-").replace("--", "-")
        out_path = os.path.join(OUT_DIR, f"{prompt_id}-{slug}-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)


def main():
    print("=" * 60)
    print("V2 RECRAFT + REMAINING BATCH (Bioluminescent Architecture)")
    print("=" * 60)

    # Verify all prompts under 1000 chars
    prompt_checks = {
        "5A": PROMPT_5A, "5C": PROMPT_5C,
        "5D-1": PROMPT_5D_1, "5D-2": PROMPT_5D_2,
        "5D-3": PROMPT_5D_3, "5D-4": PROMPT_5D_4,
        "7A": PROMPT_7A,
    }
    all_ok = True
    for pid, p in prompt_checks.items():
        count = len(p)
        status = "OK" if count < 1000 else "OVER LIMIT"
        if count >= 1000:
            all_ok = False
        print(f"  {pid}: {count} chars [{status}]")
    if not all_ok:
        print("\nERROR: One or more prompts exceed the 1000 char Recraft V3 limit.")
        sys.exit(1)
    print()

    # Upload anchor for 7A
    print("Uploading style anchor...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)

    # 5A Bio-Digital Art Nouveau Heritage Engraving
    print(f"\n{'='*60}\n  5A BIO-DIGITAL ART NOUVEAU HERITAGE ENGRAVING\n{'='*60}")
    gen_recraft("5A", "heritage-engraving", PROMPT_5A,
                "digital_illustration", ["#0A1628", "#F0EDE3", "#C4873B"], "square_hd")

    # 5C Art Nouveau Plumber Panel
    print(f"\n{'='*60}\n  5C ART NOUVEAU PLUMBER PANEL\n{'='*60}")
    gen_recraft("5C", "art-nouveau-plumber", PROMPT_5C,
                "digital_illustration", ["#0A1628", "#C4873B", "#4A7C59"], "portrait_4_3")

    # 5D-1 Vedic Engines Icons
    print(f"\n{'='*60}\n  5D-1 VEDIC ENGINE ICONS\n{'='*60}")
    gen_recraft("5D-1", "vedic-engine-icons", PROMPT_5D_1,
                "vector_illustration/line_circuit", ["#0A1628", "#F0EDE3"], "square_hd")

    # 5D-2 Western Engines Icons
    print(f"\n{'='*60}\n  5D-2 WESTERN ENGINE ICONS\n{'='*60}")
    gen_recraft("5D-2", "western-engine-icons", PROMPT_5D_2,
                "vector_illustration/line_circuit", ["#0A1628", "#F0EDE3"], "square_hd")

    # 5D-3 Bridge Engines Icons
    print(f"\n{'='*60}\n  5D-3 BRIDGE ENGINE ICONS\n{'='*60}")
    gen_recraft("5D-3", "bridge-engine-icons", PROMPT_5D_3,
                "vector_illustration/line_circuit", ["#0A1628", "#F0EDE3"], "square_hd")

    # 5D-4 Biofield Engines Icons
    print(f"\n{'='*60}\n  5D-4 BIOFIELD ENGINE ICONS\n{'='*60}")
    gen_recraft("5D-4", "biofield-engine-icons", PROMPT_5D_4,
                "vector_illustration/line_circuit", ["#0A1628", "#F0EDE3"], "square_hd")

    # 7A Cartographer Contact Sheet
    print(f"\n{'='*60}\n  7A CARTOGRAPHER CONTACT SHEET\n{'='*60}")
    gen_nano_banana("7A", "cartographer-contact-sheet", PROMPT_7A,
                    "1:1", "ref-contact-sheet.jpg", anchor_url)

    print(f"\n{'='*60}")
    print("  V2 ALL REMAINING — COMPLETE")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
