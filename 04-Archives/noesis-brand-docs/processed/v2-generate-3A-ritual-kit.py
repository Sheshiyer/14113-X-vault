#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - 3A Inquiry Kit Generation via FAL.AI
Uses Nano Banana Pro with bento grid V1 as color/style anchor.
V2 "Bioluminescent Architecture" theme.

Usage:
  source .venv/bin/activate
  python3 v2-generate-3A-ritual-kit.py
  # FAL_KEY auto-loaded from ~/.claude/.env
"""

import os
import sys
import requests
from dotenv import load_dotenv
import fal_client

# --- Load API keys from ~/.claude/.env ---
load_dotenv(os.path.expanduser("~/.claude/.env"))

# --- Configuration ---
BRAND_DOCS = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(BRAND_DOCS, "prompt-cookbook-images")
OUT_DIR = os.path.join(REF_DIR, "generated-v2")
os.makedirs(OUT_DIR, exist_ok=True)

# Verify API key
if not os.environ.get("FAL_KEY"):
    print("ERROR: Set FAL_KEY environment variable first.")
    print("  export FAL_KEY='your-key-here'")
    sys.exit(1)

# --- TN V2 Inquiry Kit Prompt (3A from V2 cookbook) ---
PROMPT_3A = """Tryambakam Noesis, conceptualized as a cohesive, premium "capsule collection" of inquiry tools and bio-digital objects. Curated set of physical objects: small borosilicate glass terrarium with oxidized copper lid containing living moss and crystalline quartz, hand-crafted bio-resin symbolic object (3-5 inches, translucent amber with embedded fern frond), practice journal with mycelium-substrate pages and titanium spine, copper-wire incense holder with Art Nouveau organic curves, small etched glass essential oil bottle with circuit-trace label in Fira Code. Every item uses Void Teal (#0A1628) and Phosphor Cream (#F0EDE3) palette with Solar Bronze (#C4873B) copper accents. Clean organized knolling composition on polished terrazzo surface with Void Teal aggregate chips. Inside an Art Nouveau greenhouse conservatory -- oxidized copper framework and stained-glass panes visible in background, living plants soft-focused. Warm Solar Bronze accent lighting from upper left, cool phosphorescent fill from below. Wide framing with significant negative space. Materials: glass, titanium, oxidized copper, bio-resin, living moss, crystalline quartz, mycelium -- all precision-engineered yet organic. The aesthetic is "bioluminescent architecture" -- regenerative, luminous, bio-digital craft."""

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit"""

# Style anchor: V2 bento grid output (color/palette consistency)
STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")

# Composition reference: capsule collection layout
COMP_REF = os.path.join(REF_DIR, "ref-capsule-collection.jpg")


def download_image(url, filepath):
    """Download image from URL to local file."""
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")


def main():
    print("=" * 60)
    print("TRYAMBAKAM NOESIS V2 - Bioluminescent Architecture")
    print("3A Inquiry Kit Capsule -- Nano Banana Pro")
    print("=" * 60)
    print(f"\nStyle anchor: {STYLE_ANCHOR}")
    print(f"Comp reference: {COMP_REF}")

    # Step 1: Upload style anchor (V2 bento grid)
    print("\nUploading style anchor (V2 bento grid)...")
    if not os.path.exists(STYLE_ANCHOR):
        print(f"ERROR: Style anchor not found: {STYLE_ANCHOR}")
        print("  Run v2-generate-bento-grid.py first to generate the 2A bento grid.")
        sys.exit(1)
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)
    print(f"  Anchor: {anchor_url[:80]}...")

    # Step 2: Upload composition reference
    print("Uploading composition reference (capsule collection)...")
    if not os.path.exists(COMP_REF):
        print(f"ERROR: Composition reference not found: {COMP_REF}")
        sys.exit(1)
    comp_url = fal_client.upload_file(COMP_REF)
    print(f"  Comp ref: {comp_url[:80]}...")

    # Combine prompt with negative guidance
    full_prompt = f"{PROMPT_3A}\n\nAvoid: {NEGATIVE}"

    # Step 3: Generate two variations with dual image references
    for seed, variant in [(42, "v1"), (137, "v2")]:
        print(f"\n{'=' * 60}")
        print(f"VARIATION {variant.upper()}: Nano Banana Pro + Dual Refs (seed {seed})")
        print("=" * 60)

        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": full_prompt,
                "image_urls": [anchor_url, comp_url],
                "aspect_ratio": "4:3",
                "resolution": "2K",
                "output_format": "png",
                "seed": seed,
                "num_images": 1,
            },
        )

        out_path = os.path.join(OUT_DIR, f"3A-inquiry-kit-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)

    # Summary
    print("\n" + "=" * 60)
    print("V2 GENERATION COMPLETE - 3A Inquiry Kit")
    print("=" * 60)
    print(f"\n  Variation A: {os.path.join(OUT_DIR, '3A-inquiry-kit-nanobananapro-v1.png')}")
    print(f"  Variation B: {os.path.join(OUT_DIR, '3A-inquiry-kit-nanobananapro-v2.png')}")
    print(f"\n  Style anchor: {STYLE_ANCHOR}")
    print(f"  Comp ref:     {COMP_REF}")
    print(f"\nBoth use V2 'Bioluminescent Architecture' prompt with dual refs.")
    print("Style anchor cascades V2 palette; comp ref guides knolling layout.")


if __name__ == "__main__":
    main()
