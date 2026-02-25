#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - Brand Kit Bento Grid Generation via FAL.AI
Generates 2 variations of prompt 2A (Brand Kit Bento Grid) with style reference image.
V2 "Bioluminescent Architecture" theme.

Usage:
  source .venv/bin/activate
  python3 v2-generate-bento-grid.py
  # FAL_KEY auto-loaded from ~/.claude/.env
"""

import os
import sys
import json
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

# --- TN V2 Brand Kit Bento Grid Prompt (2A from V2 cookbook) ---
PROMPT_2A = """Tryambakam Noesis (Philosophical Practice / Meaning Architecture).
Act as Lead Brand Designer creating a comprehensive "Brand Identity System" presentation (Bento-Grid Layout).

Generate a single high-resolution bento-grid board containing 6 distinct modules:

PHASE 1: VISUAL STRATEGY (AUTONOMOUS)
1. Analyze the Brand: Archetype = "The Seasoned Cartographer" -- grounded, direct, respectful-challenging. Visual vibe = bioluminescent architecture, Art Nouveau organic curves meeting Art Deco geometric precision, solarpunk botanical-mechanical hybrids.
2. Define the Palette: Void Teal #0A1628 (primary), Phosphor Cream #F0EDE3 (secondary), Solar Bronze #C4873B (accent), Titanium #8A9BA8 (support).
3. Select Typography: Exo 2 (headers -- Light, Regular, SemiBold weights). Space Grotesk (body).

PHASE 2: THE LAYOUT (6-MODULE GRID)
Block 1 (The Hero): High-contrast photograph of a bio-resin tablet device resting on polished terrazzo surface inside an Art Nouveau greenhouse conservatory. Warm Solar Bronze light filtering through stained glass panes casting colored shadows. Oxidized copper frame of the greenhouse visible. Living moss growing at the base of a titanium stand. Overlay "TRYAMBAKAM NOESIS" wordmark in Phosphor Cream (#F0EDE3), Exo 2 Light, all caps, tracking +120.
Block 2 (Social Media): Instagram Post mockup -- Void Teal (#0A1628) background with subtle circuit-board pattern overlay at 5% opacity, centered text in Exo 2: "The system succeeds only when you no longer need it." Solar Bronze accent line below -- styled as Art Nouveau copper wire curve, not straight. Clean, no imagery.
Block 3 (The Palette): 5 Vertical Color Swatches -- Void Teal #0A1628, Phosphor Cream #F0EDE3, Solar Bronze #C4873B, Titanium #8A9BA8, Chlorophyll #4A7C59. Simulated HEX codes inside each. Subtle terrazzo texture behind swatches.
Block 4 (Typography Spec): "Exo 2" displayed in Exo 2 Light. Tiny "Primary Typeface" subtext in Space Grotesk. Geometric futuristic letterforms prominent. NO alphabet grid.
Block 5 (The Sigil): Three converging fiber-optic filaments -- bioluminescent glass tubes in Void Teal, Solar Bronze, and Chlorophyll -- converging to a phosphorescent nexus point on Phosphor Cream background. Art Nouveau organic curves guide each filament. Clean vector rendering.
Block 6 (Brand DNA): Manifesto Card -- ARCHETYPE: "The Seasoned Cartographer -- maps, not prescriptions." VOICE: "Grounded, direct, respectful-challenging." VISUALS: "Bioluminescent architecture, regenerative precision, organic-engineered fusion."

PHASE 3: AESTHETIC & FINISH
Style: Behance Trend / Awwwards Winner. Quality: 8K resolution. Soft studio lighting with Solar Bronze rim accent. No rounded corners -- sharp edges only. 1px borders in Titanium. Generous white space. Art Nouveau decorative copper-wire corner accents on the grid."""

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit"""

# Reference image path (for LAYOUT/COMPOSITION style only)
REF_IMAGE = os.path.join(REF_DIR, "ref-brand-kit-bento.jpg")


def download_image(url, filepath):
    """Download image from URL to local file."""
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")


def generate_with_nano_banana(prompt, ref_url, seed, output_name):
    """Generate with Nano Banana Pro (supports image_urls for reference)."""
    print(f"\n--- Nano Banana Pro (seed={seed}) ---")
    print(f"  Reference: {ref_url[:80]}...")

    result = fal_client.subscribe(
        "fal-ai/nano-banana-pro",
        arguments={
            "prompt": prompt,
            "image_urls": [ref_url],
            "aspect_ratio": "16:9",
            "resolution": "2K",
            "output_format": "png",
            "seed": seed,
            "num_images": 1,
        },
    )

    img_url = result["images"][0]["url"]
    out_path = os.path.join(OUT_DIR, output_name)
    download_image(img_url, out_path)
    return out_path


def main():
    print("=" * 60)
    print("TRYAMBAKAM NOESIS V2 - Bioluminescent Architecture")
    print("Brand Kit Bento Grid Generation")
    print("=" * 60)
    print(f"\nPrompt: 2A Brand Kit Bento Grid (V2)")
    print(f"Reference image: {REF_IMAGE}")

    # Step 1: Upload reference image to FAL storage
    print(f"\nUploading reference image...")
    if not os.path.exists(REF_IMAGE):
        print(f"ERROR: Reference image not found: {REF_IMAGE}")
        sys.exit(1)

    ref_url = fal_client.upload_file(REF_IMAGE)
    print(f"  Uploaded: {ref_url[:80]}...")

    # Combine prompt with negative guidance
    full_prompt = f"{PROMPT_2A}\n\nAvoid: {NEGATIVE}"

    # Step 2: Generate Variation A (seed 42)
    print("\n" + "=" * 60)
    print("VARIATION A: Nano Banana Pro + Style Reference (seed 42)")
    print("=" * 60)
    path_a = generate_with_nano_banana(
        full_prompt, ref_url, seed=42,
        output_name="2A-brand-kit-bento-nanobananapro-v1.png"
    )

    # Step 3: Generate Variation B (seed 137)
    print("\n" + "=" * 60)
    print("VARIATION B: Nano Banana Pro + Style Reference (seed 137)")
    print("=" * 60)
    path_b = generate_with_nano_banana(
        full_prompt, ref_url, seed=137,
        output_name="2A-brand-kit-bento-nanobananapro-v2.png"
    )

    # Summary
    print("\n" + "=" * 60)
    print("V2 GENERATION COMPLETE - Bioluminescent Architecture")
    print("=" * 60)
    print(f"\n  Variation A: {path_a}")
    print(f"  Variation B: {path_b}")
    print(f"\n  Reference:   {REF_IMAGE}")
    print(f"\nCompare the two V2 bento grid variations against the reference.")
    print("Both use the same V2 prompt but different seeds for variation.")
    print("Reference provides LAYOUT/COMPOSITION guidance only.")
    print("Content is fully Tryambakam Noesis V2 branded.")


if __name__ == "__main__":
    main()
