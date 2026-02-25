#!/usr/bin/env python3
"""
Tryambakam Noesis - Brand Kit Bento Grid Generation via FAL.AI
Generates 2 variations of prompt 2A (Brand Kit Bento Grid) with style reference image.

Usage:
  export FAL_KEY="your-key-here"
  python3 generate-bento-grid.py
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

# --- TN Brand Kit Bento Grid Prompt (2A from cookbook) ---
PROMPT_2A = """Tryambakam Noesis (Philosophical Practice / Meaning Architecture).
Act as Lead Brand Designer creating a comprehensive "Brand Identity System" presentation (Bento-Grid Layout).

Generate a single high-resolution bento-grid board containing 6 distinct modules:

PHASE 1: VISUAL STRATEGY (AUTONOMOUS)
1. Analyze the Brand: Archetype = "The Seasoned Cartographer" -- grounded, direct, respectful-challenging. Visual vibe = architectural depth, manuscript precision, earned complexity.
2. Define the Palette: Deep Ink #1A1A2E (primary), Bone #F5F0E8 (secondary), Aged Gold #B8860B (accent), Stone Grey #6B6B6B (support).
3. Select Typography: Cormorant Garamond (headers -- Light, Regular, SemiBold weights). Source Sans 3 (body).

PHASE 2: THE LAYOUT (6-MODULE GRID)
Block 1 (The Hero): High-contrast photograph of a leather-bound philosophical journal on dark stone surface. Natural sidelight, visible paper grain, aged gold embossing catching light. Deep Ink tones. Overlay "TRYAMBAKAM NOESIS" wordmark in Bone (#F5F0E8), Cormorant Garamond Light, all caps, tracking +100.
Block 2 (Social Media): Instagram Post mockup -- dark background (#1A1A2E), centered text in Cormorant Garamond: "The system succeeds only when you no longer need it." Aged Gold accent line below. Clean, no imagery.
Block 3 (The Palette): 4 Vertical Color Swatches -- Deep Ink #1A1A2E, Bone #F5F0E8, Aged Gold #B8860B, Stone Grey #6B6B6B. Simulated HEX codes inside each.
Block 4 (Typography Spec): "Cormorant Garamond" displayed in Cormorant Garamond Light. Tiny "Primary Typeface" subtext in Source Sans 3. NO alphabet grid.
Block 5 (The Logo): The Tryambakam Sigil -- three converging lines representing source, witness, and ground -- rendered in Deep Ink on Bone background. Clean geometric vector, NO construction lines.
Block 6 (Brand DNA): Manifesto Card -- ARCHETYPE: "The Seasoned Cartographer -- maps, not prescriptions." VOICE: "Grounded, direct, respectful-challenging." VISUALS: "Architectural depth, earned complexity, substance over decoration."

PHASE 3: AESTHETIC & FINISH
Style: Behance Trend / Awwwards Winner. Quality: 8K resolution. Soft studio lighting. No rounded corners -- sharp edges only. 1px borders in Stone Grey. Generous white space."""

NEGATIVE = """ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult, stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers, candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors"""

# Reference image path (Smash Tennis Club bento - for LAYOUT/COMPOSITION style only)
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
    print("TRYAMBAKAM NOESIS - Brand Kit Bento Grid Generation")
    print("=" * 60)
    print(f"\nPrompt: 2A Brand Kit Bento Grid")
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
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"\n  Variation A: {path_a}")
    print(f"  Variation B: {path_b}")
    print(f"\n  Reference:   {REF_IMAGE}")
    print(f"\nCompare the two bento grid variations against the reference.")
    print("Both use the same prompt but different seeds for variation.")
    print("Reference provides LAYOUT/COMPOSITION guidance only.")
    print("Content is fully Tryambakam Noesis branded.")


if __name__ == "__main__":
    main()
