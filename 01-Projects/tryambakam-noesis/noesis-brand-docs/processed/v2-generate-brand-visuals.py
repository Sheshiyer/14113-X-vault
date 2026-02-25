#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - 2B Oxidized Copper Seal Generation via FAL.AI
V2 "Bioluminescent Architecture" theme.

Routing: Prompt 2B -> Flux 2 Pro (upgraded from V1 Nano Banana Pro)
Output:  prompt-cookbook-images/generated-v2/

Usage:
  source .venv/bin/activate
  python3 v2-generate-brand-visuals.py
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

# --- V2 TN Brand Oxidized Copper Seal Prompt (2B from V2 cookbook) ---
PROMPT_2B = """An oxidized copper disc seal depicting the Tryambakam Noesis fiber-optic sigil -- three converging bioluminescent filaments representing source, witness, and ground -- lying flat on plain Phosphor Cream (#F0EDE3) terrazzo surface. Thick oxidized copper with Art Nouveau patina -- green verdigris accents on the edges, warm Solar Bronze (#C4873B) on the raised surfaces. Clear relief impression of the three-filament convergence sigil in center, with "TRYAMBAKAM NOESIS" lettering around the rim in Exo 2 Light. Tiny stained-glass inlay segments at each filament origin point -- one Void Teal (#0A1628), one Solar Bronze, one Chlorophyll (#4A7C59). Soft diffuse lighting from above, warm Solar Bronze specular highlights on curved copper edges. Minimal shadow. The disc has the weight and patina of Art Nouveau architectural metalwork -- substantial, earned, precision-engineered yet organic."""

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit"""

# Reference image path (same as V1)
REF_IMAGE = os.path.join(REF_DIR, "ref-wax-seal-3d.jpg")


def download_image(url, filepath):
    """Download image from URL to local file."""
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")


def generate_with_flux_pro(prompt, seed, output_name):
    """Generate with Flux 2 Pro (square_hd, high-fidelity)."""
    print(f"\n--- Flux 2 Pro (seed={seed}) ---")

    result = fal_client.subscribe(
        "fal-ai/flux-2-pro",
        arguments={
            "prompt": prompt,
            "image_size": "square_hd",
            "num_inference_steps": 40,
            "guidance_scale": 7.5,
            "seed": seed,
            "num_images": 1,
            "output_format": "png",
        },
    )

    img_url = result["images"][0]["url"]
    out_path = os.path.join(OUT_DIR, output_name)
    download_image(img_url, out_path)
    return out_path


def main():
    print("=" * 60)
    print("TRYAMBAKAM NOESIS V2 - Brand Visual Generation")
    print("Model: Flux 2 Pro | Theme: Bioluminescent Architecture")
    print("=" * 60)
    print(f"\nPrompt: 2B Oxidized Copper Seal")
    print(f"Reference image: {REF_IMAGE}")
    print(f"Output directory: {OUT_DIR}")

    # Verify reference image exists
    if not os.path.exists(REF_IMAGE):
        print(f"\nWARNING: Reference image not found: {REF_IMAGE}")
        print("  (Flux 2 Pro is text-only, proceeding without reference)")

    # Combine prompt with negative guidance
    full_prompt = f"{PROMPT_2B}\n\nAvoid: {NEGATIVE}"

    # Step 1: Generate Variation 1 (seed 42)
    print("\n" + "=" * 60)
    print("VARIATION 1: Flux 2 Pro (seed 42)")
    print("=" * 60)
    path_v1 = generate_with_flux_pro(
        full_prompt,
        seed=42,
        output_name="2B-copper-seal-flux2pro-v1.png",
    )

    # Step 2: Generate Variation 2 (seed 137)
    print("\n" + "=" * 60)
    print("VARIATION 2: Flux 2 Pro (seed 137)")
    print("=" * 60)
    path_v2 = generate_with_flux_pro(
        full_prompt,
        seed=137,
        output_name="2B-copper-seal-flux2pro-v2.png",
    )

    # Summary
    print("\n" + "=" * 60)
    print("V2 GENERATION COMPLETE")
    print("=" * 60)
    print(f"\n  Variation 1: {path_v1}")
    print(f"  Variation 2: {path_v2}")
    print(f"\n  Reference:   {REF_IMAGE}")
    print(f"\nCompare V2 oxidized copper seal against V1 wax seal variants.")
    print("V2 uses Flux 2 Pro with Bioluminescent Architecture theme.")


if __name__ == "__main__":
    main()
