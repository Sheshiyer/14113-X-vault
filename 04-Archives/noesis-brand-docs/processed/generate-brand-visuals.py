#!/usr/bin/env python3
"""
Tryambakam Noesis - Brand Visual Generation via FAL.AI
Generates 2 variations of brand identity prompt with style reference image.

Usage:
  export FAL_KEY="your-key-here"
  python3 generate-brand-visuals.py
"""

import os
import sys
import json
import requests
import fal_client

# --- Configuration ---
BRAND_DOCS = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(BRAND_DOCS, "prompt-cookbook-images")
OUT_DIR = os.path.join(REF_DIR, "generated")
os.makedirs(OUT_DIR, exist_ok=True)

# Verify API key
if not os.environ.get("FAL_KEY"):
    print("ERROR: Set FAL_KEY environment variable first.")
    print("  export FAL_KEY='your-key-here'")
    sys.exit(1)

# --- TN Brand Wax Seal Prompt (2B from cookbook) ---
PROMPT_2B = """Deep Ink (#1A1A2E) glossy wax seal icon depicting Tryambakam Noesis sigil -- three converging lines representing source, witness, and ground -- lying flat on plain Bone (#F5F0E8) background. Thick deformed wax with irregular squashed shape and prominent drip/smear extending to right side. Clear raised relief impression of the three-line convergence sigil in center, with "TRYAMBAKAM NOESIS" lettering around the rim in Aged Gold (#B8860B). Soft even lighting, smooth specular highlights on curved glossy edges. Soft minimal shadow. The wax has the color and depth of centuries-old sealing wax -- substantial, not decorative."""

NEGATIVE = """ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult, stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers, candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors"""

# Reference image path
REF_IMAGE = os.path.join(REF_DIR, "ref-wax-seal-3d.jpg")


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
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "output_format": "png",
            "seed": seed,
            "num_images": 1,
        },
    )

    img_url = result["images"][0]["url"]
    out_path = os.path.join(OUT_DIR, output_name)
    download_image(img_url, out_path)
    return out_path


def generate_with_flux_pro(prompt, seed, output_name):
    """Generate with Flux 2 Pro (text-only, photorealistic)."""
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
    print("TRYAMBAKAM NOESIS - Brand Visual Generation")
    print("=" * 60)
    print(f"\nPrompt: 2B Wax Seal 3D Treatment")
    print(f"Reference image: {REF_IMAGE}")

    # Step 1: Upload reference image to FAL storage
    print(f"\nUploading reference image...")
    if not os.path.exists(REF_IMAGE):
        print(f"ERROR: Reference image not found: {REF_IMAGE}")
        sys.exit(1)

    ref_url = fal_client.upload_file(REF_IMAGE)
    print(f"  Uploaded: {ref_url[:80]}...")

    # Combine prompt with negative guidance
    full_prompt = f"{PROMPT_2B}\n\nAvoid: {NEGATIVE}"

    # Step 2: Generate Variation A (Nano Banana Pro with reference)
    print("\n" + "=" * 60)
    print("VARIATION A: Nano Banana Pro + Style Reference")
    print("=" * 60)
    path_a = generate_with_nano_banana(full_prompt, ref_url, seed=42, output_name="2B-wax-seal-nanobananapro-v1.png")

    # Step 3: Generate Variation B (Nano Banana Pro, different seed)
    print("\n" + "=" * 60)
    print("VARIATION B: Nano Banana Pro + Style Reference (seed 137)")
    print("=" * 60)
    path_b = generate_with_nano_banana(full_prompt, ref_url, seed=137, output_name="2B-wax-seal-nanobananapro-v2.png")

    # Summary
    print("\n" + "=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"\n  Variation A: {path_a}")
    print(f"  Variation B: {path_b}")
    print(f"\n  Reference:   {REF_IMAGE}")
    print(f"\nCompare the two variations against the reference image.")
    print("Both use the same prompt but different seeds for variation.")


if __name__ == "__main__":
    main()
