#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - 2C Stained-Glass Logo Emboss Generation via FAL.AI
Uses Nano Banana Pro with bento grid V1 as color/style anchor.
V2 "Bioluminescent Architecture" theme.
"""
import os, sys, requests
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

PROMPT_2C = """3D embossed stained-glass contour render of center-aligned "TRYAMBAKAM NOESIS" on a flat Void Teal (#0A1628) surface, perfectly centered with ample negative space. Art Nouveau stained-glass treatment -- each letter filled with translucent colored glass segments in subtle Void Teal and Solar Bronze (#C4873B) tones, held together by fine oxidized copper leading (like cathedral windows). Raised smooth glass bezel creating blind emboss effect where interior glass catches and refracts light. Matte Void Teal surface with fine circuit-board trace texture overlay at 3% opacity. Soft diffuse lighting from above, Solar Bronze warm specular highlights on glass edges, phosphorescent Cream (#F0EDE3) glow emanating from between glass segments. Top-down view. Typography: Exo 2 Light, all caps, tracking +120. Art Nouveau decorative copper-wire filigree curves framing the wordmark -- organic, not geometric. No steampunk gears, no cyberpunk neon -- pure Art Nouveau glass craft meets precision engineering."""

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit"""

# Style anchor: V2 bento grid for palette consistency
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
    print("2C STAINED-GLASS LOGO EMBOSS V2 — Nano Banana Pro")
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
        out_path = os.path.join(OUT_DIR, f"2C-stained-glass-logo-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)

    print("\n2C Stained-Glass Logo V2 — DONE")

if __name__ == "__main__":
    main()
