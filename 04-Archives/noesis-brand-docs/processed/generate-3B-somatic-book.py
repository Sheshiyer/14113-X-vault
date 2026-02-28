#!/usr/bin/env python3
"""
Tryambakam Noesis - 3B Somatic Canticles Book Generation via FAL.AI
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

PROMPT_3B = """Tryambakam Noesis.
Act as a creative director curating "recontextualized everyday objects."
OBJECT SELECTION: A philosophical practice book -- "Somatic Canticles" volume.
THE CONCEPT: Elevate a book into a tactile artifact of meaning architecture. Not a coffee-table book -- a tool for structured self-examination.
MATERIALS: Cover in Deep Ink (#1A1A2E) matte full-grain leather with visible natural grain. Spine with Aged Gold (#B8860B) foil-stamped lettering: "SOMATIC CANTICLES" in Cormorant Garamond Light. Pages are uncoated laid cotton stock in Bone (#F5F0E8), visible deckled edges. Saddle-stitched with waxed linen thread. A thin bookmark ribbon in Aged Gold.
PRESENTATION: Book alone resting on dark stone pedestal, slightly open to reveal interior pages with hand-drawn line diagrams (technical, architectural quality -- not decorative). Exposed knolling view.
PHOTOGRAPHY: High-contrast natural sidelight. Clean dark stone surface. No cyclorama -- dark architectural interior background (textured plaster wall).
GRAPHIC OVERLAYS: Bottom Left: "TRYAMBAKAM NOESIS -- SOMATIC CANTICLES -- VOL. I" in Manrope Regular, Stone Grey (#6B6B6B). Bottom Right: Three-line convergence sigil, monochrome."""

NEGATIVE = """ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult, stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers, candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors"""

STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")
COMP_REF = os.path.join(REF_DIR, "ref-souvenir-concepts.jpg")

def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")

def main():
    print("=" * 60)
    print("3B SOMATIC CANTICLES BOOK — Nano Banana Pro")
    print("=" * 60)

    print("\nUploading style anchor (bento V1)...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)
    print(f"  Anchor: {anchor_url[:60]}...")

    print("Uploading composition reference (souvenir concepts)...")
    comp_url = fal_client.upload_file(COMP_REF)
    print(f"  Comp ref: {comp_url[:60]}...")

    full_prompt = f"{PROMPT_3B}\n\nAvoid: {NEGATIVE}"

    for seed, variant in [(42, "v1"), (137, "v2")]:
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
        out_path = os.path.join(OUT_DIR, f"3B-somatic-book-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)

    print("\n✅ 3B Somatic Book — DONE")

if __name__ == "__main__":
    main()
