#!/usr/bin/env python3
"""
Tryambakam Noesis - 3A Ritual Kit Capsule Collection Generation via FAL.AI
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

PROMPT_3A = """Tryambakam Noesis, conceptualized as a cohesive, premium "capsule collection" of ritual objects and inquiry tools. Curated set of physical objects: small glass apothecary jar with cork lid containing dried herbs and resins, hand-carved wooden symbolic object (3-5 inches, weighted), leather-bound saddle-stitched practice journal (5"x7"), brass incense holder with geometric triangulated form, small amber glass essential oil bottle with kraft label. Every item uses Deep Ink (#1A1A2E) and Bone (#F5F0E8) palette with Aged Gold (#B8860B) embossed lettering on the journal spine. Clean organized knolling composition on seamless dark slate stone surface. Soft natural sidelight, deep shadows. Wide framing with significant negative space. Materials: stone, glass, cork, dried botanicals, leather, brass, wood -- all matte finishes, no gloss, no plastic. The aesthetic is "grounded depth" -- substantial, architectural, atemporal craft."""

NEGATIVE = """ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult, stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers, candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors"""

STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")
COMP_REF = os.path.join(REF_DIR, "ref-capsule-collection.jpg")

def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")

def main():
    print("=" * 60)
    print("3A RITUAL KIT CAPSULE — Nano Banana Pro")
    print("=" * 60)

    print("\nUploading style anchor (bento V1)...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)
    print(f"  Anchor: {anchor_url[:60]}...")

    print("Uploading composition reference (capsule collection)...")
    comp_url = fal_client.upload_file(COMP_REF)
    print(f"  Comp ref: {comp_url[:60]}...")

    full_prompt = f"{PROMPT_3A}\n\nAvoid: {NEGATIVE}"

    for seed, variant in [(42, "v1"), (137, "v2")]:
        print(f"\n--- Generating seed={seed} ---")
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
        out_path = os.path.join(OUT_DIR, f"3A-ritual-kit-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)

    print("\n✅ 3A Ritual Kit — DONE")

if __name__ == "__main__":
    main()
