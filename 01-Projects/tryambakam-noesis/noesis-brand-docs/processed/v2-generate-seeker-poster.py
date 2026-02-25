#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - 8A Split-Silhouette "Inner Architecture" Poster
The Seeker: figure from behind, split between material reality & inner architecture.
V2 "Bioluminescent Architecture" theme.

Model: Nano Banana Pro (photorealistic + style anchor)
Output: prompt-cookbook-images/generated-v2/

Usage:
  source .venv/bin/activate
  python3 v2-generate-seeker-poster.py
  # FAL_KEY auto-loaded from ~/.claude/.env
"""
import os, sys, requests
from dotenv import load_dotenv
import fal_client

load_dotenv(os.path.expanduser("~/.claude/.env"))

BRAND_DOCS = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(BRAND_DOCS, "prompt-cookbook-images")
OUT_DIR = os.path.join(REF_DIR, "generated-v2")
os.makedirs(OUT_DIR, exist_ok=True)

if not os.environ.get("FAL_KEY"):
    print("ERROR: Set FAL_KEY environment variable first.")
    sys.exit(1)

STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")
COMP_REF = os.path.join(REF_DIR, "ref-capsule-collection.jpg")

PROMPT_8A = """Tryambakam Noesis -- "The Seeker: Inner Architecture" conceptual portrait poster. A solitary figure seen from behind -- standing still, contemplative posture, wearing structured technical linen in Void Teal (#0A1628). No face visible. Full body, centered in frame.

SPLIT COMPOSITION: The image is divided vertically down the figure's spine. LEFT HALF shows material reality -- the figure's left side rendered in ultra-photorealistic detail: hand texture, fabric weave, polished terrazzo floor beneath feet, Art Nouveau greenhouse conservatory structure with oxidized copper ironwork and stained glass visible behind. RIGHT HALF shows inner architecture -- the figure's right side dissolves into a translucent technical blueprint revealing: circuit-trace diagrams flowing along the body's meridian lines, fiber-optic filaments glowing Phosphor Cream (#F0EDE3) tracing the spinal column, 13 small engine sigils floating at key body points (chakra positions rendered as engineering nodes not mystical symbols), mycelium network patterns spreading from the feet, sacred geometry annotations in Fira Code typeface.

The split line down the spine glows faint Solar Bronze (#C4873B) -- a luminous seam between outer and inner. Background: Art Nouveau greenhouse conservatory with tropical botanical specimens and copper-wire structural elements.

COLOR: Void Teal dominant, Solar Bronze highlights on the seam and copper elements, Phosphor Cream for inner architecture glow, Chlorophyll (#4A7C59) for living botanical elements. High contrast, dramatic sidelight from left creating deep shadows. Film grain.

Typography at bottom: "THE SEEKER -- INNER ARCHITECTURE SERIES" in Exo 2 Light, wide tracking, Titanium (#8A9BA8) on dark ground."""

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit, face visible, frontal view"""


def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")


def main():
    print("=" * 60)
    print("8A THE SEEKER — Inner Architecture Poster")
    print("Model: Nano Banana Pro | Bioluminescent Architecture")
    print("=" * 60)

    print("\nUploading style anchor (V2 bento)...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)
    print(f"  Anchor: {anchor_url[:60]}...")

    print("Uploading composition reference...")
    comp_url = fal_client.upload_file(COMP_REF)
    print(f"  Comp ref: {comp_url[:60]}...")

    full_prompt = f"{PROMPT_8A}\n\nAvoid: {NEGATIVE}"

    for seed, variant in [(42, "v1"), (137, "v2"), (256, "v3")]:
        print(f"\n--- Generating seed={seed} ---")
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": full_prompt,
                "image_urls": [anchor_url, comp_url],
                "aspect_ratio": "3:4",
                "resolution": "2K",
                "output_format": "png",
                "seed": seed,
                "num_images": 1,
            },
        )
        out_path = os.path.join(OUT_DIR, f"8A-seeker-inner-architecture-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)

    print("\n✅ 8A The Seeker — DONE")


if __name__ == "__main__":
    main()
