#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - 3B Somatic Codex Book Generation via FAL.AI
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

PROMPT_3B = """Tryambakam Noesis.
Act as a creative director curating "recontextualized everyday objects."
OBJECT SELECTION: A philosophical practice book -- "Somatic Canticles" volume.
THE CONCEPT: Elevate a book into a bio-digital artifact of meaning architecture. Not a coffee-table book -- a tool for structured self-examination.
MATERIALS: Spine in translucent bio-resin (amber-to-clear gradient) with embedded copper wire traces visible inside, like a cross-section of a living circuit. Cover in Void Teal (#0A1628) matte technical textile with subtle woven circuit-board pattern. Solar Bronze (#C4873B) copper foil-stamped lettering on spine: "SOMATIC CANTICLES" in Exo 2 Light. Pages are mycelium-substrate paper in Phosphor Cream (#F0EDE3), soft fibrous texture with visible mushroom-root structure. Saddle-stitched with oxidized copper wire. A thin bookmark ribbon in Chlorophyll (#4A7C59) -- living green.
PRESENTATION: Book alone resting on polished terrazzo pedestal, slightly open to reveal interior pages with bio-digital schematic diagrams (Art Nouveau curves meeting circuit-trace precision -- not decorative, functional). Inside Art Nouveau greenhouse, oxidized copper framing visible.
PHOTOGRAPHY: High-contrast with Solar Bronze warm accent light from left. Cool phosphorescent fill. Polished terrazzo surface. Art Nouveau greenhouse background (stained glass, copper frame, living plants soft-focused).
GRAPHIC OVERLAYS: Bottom Left: "TRYAMBAKAM NOESIS -- SOMATIC CANTICLES -- VOL. I" in Space Grotesk Regular, Titanium (#8A9BA8). Bottom Right: Fiber-optic convergence sigil, monochrome Phosphor Cream."""

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit"""

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
    print("3B SOMATIC CODEX BOOK V2 — Nano Banana Pro")
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
        out_path = os.path.join(OUT_DIR, f"3B-somatic-codex-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)

    print("\n✅ 3B Somatic Codex V2 — DONE")

if __name__ == "__main__":
    main()
