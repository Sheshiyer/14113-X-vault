#!/usr/bin/env python3
"""
Tryambakam Noesis - 2C Glass Logo Emboss Generation via FAL.AI
Uses Nano Banana Pro with bento grid V1 as color/style anchor for palette consistency.
"""
import os, sys, requests, fal_client

BRAND_DOCS = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(BRAND_DOCS, "prompt-cookbook-images")
OUT_DIR = os.path.join(REF_DIR, "generated")
os.makedirs(OUT_DIR, exist_ok=True)

if not os.environ.get("FAL_KEY"):
    print("ERROR: Set FAL_KEY environment variable first.")
    sys.exit(1)

PROMPT_2C = """3D embossed glossy contour render of center-aligned "TRYAMBAKAM NOESIS" on a flat surface, perfectly centered with ample negative space. Monochromatic Deep Ink (#1A1A2E) palette with soft tonal gradients from near-black to dark slate blue. Raised smooth liquid-like glass bezel creating blind emboss effect where interior matches background. Matte surface finish with fine film grain or noise texture overlay. Soft diffuse lighting, strong specular highlights on rounded edges catching Aged Gold (#B8860B) reflections, top-down view. Typography: Cormorant Garamond Light, all caps, tracking +100. No decoration, no mystical symbols -- pure typographic substance."""

NEGATIVE = """ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult, stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers, candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors"""

# Style anchor: our successful bento grid V1 for palette consistency
STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")
# Composition reference: the glass logo reference from cookbook
COMP_REF = os.path.join(REF_DIR, "ref-glass-logo.jpg")

def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")

def main():
    print("=" * 60)
    print("2C GLASS LOGO EMBOSS — Nano Banana Pro")
    print("=" * 60)

    # Upload both reference images
    print("\nUploading style anchor (bento V1)...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)
    print(f"  Anchor: {anchor_url[:60]}...")

    print("Uploading composition reference (glass logo)...")
    comp_url = fal_client.upload_file(COMP_REF)
    print(f"  Comp ref: {comp_url[:60]}...")

    full_prompt = f"{PROMPT_2C}\n\nAvoid: {NEGATIVE}"

    for seed, variant in [(42, "v1"), (137, "v2")]:
        print(f"\n--- Generating seed={seed} ---")
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": full_prompt,
                "image_urls": [anchor_url, comp_url],
                "aspect_ratio": "16:9",
                "resolution": "2K",
                "output_format": "png",
                "seed": seed,
                "num_images": 1,
            },
        )
        out_path = os.path.join(OUT_DIR, f"2C-glass-logo-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)

    print("\n✅ 2C Glass Logo — DONE")

if __name__ == "__main__":
    main()
