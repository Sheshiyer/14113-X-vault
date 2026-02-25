#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - 9A-9M: 13 Engine Individual Campaign Posters
One hero poster per engine — minimalist symbolic object, bold typography, brand color bg.
V2 "Bioluminescent Architecture" theme.

Model: Nano Banana Pro (photorealistic objects + style anchor)
Output: prompt-cookbook-images/generated-v2/

Usage:
  source .venv/bin/activate
  python3 v2-generate-engine-posters.py [vedic|western|bridge|biofield|all]
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

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit"""

# ═══════ 13 ENGINE POSTER PROMPTS ═══════
# Each poster: symbolic object on brand-color background, Exo 2 typography, Art Deco frame

BASE_POSTER = """Tryambakam Noesis campaign poster. Single {object} centered on {bg_color} ({bg_hex}) background. The object rendered as a physical bio-digital artifact — part {material_a}, part {material_b}, with fiber-optic filaments glowing Phosphor Cream (#F0EDE3) threading through. Art Deco geometric border frame in Solar Bronze (#C4873B) — thin precise lines, corner ornaments.

Typography — bottom third:
"{engine_name}" in Exo 2 Bold, all caps, wide tracking, Phosphor Cream (#F0EDE3)
Below: "{tagline}" in Exo 2 Light, smaller, Titanium (#8A9BA8)
Bottom edge: "TRYAMBAKAM NOESIS — THE 13 ENGINES" in Manrope Regular, 8pt, Titanium

The object has weight and presence — it sits on a thin polished terrazzo shelf casting a soft shadow. Dramatic top-down spotlight. No mystical symbols. Clean, architectural, precision-engineered. Film grain. 8K detail on material textures."""

ENGINES = {
    "9A-01": {
        "name": "Vimshottari Dasha",
        "engine_name": "VIMSHOTTARI DASHA",
        "tagline": "The compass of planetary time cycles",
        "object": "oxidized copper orrery with concentric orbital rings",
        "material_a": "patinated copper", "material_b": "etched circuit-board",
        "bg_color": "deep Void Teal", "bg_hex": "#0A1628",
    },
    "9A-02": {
        "name": "Nakshatra Engine",
        "engine_name": "NAKSHATRA",
        "tagline": "Star-field navigation of the lunar mansions",
        "object": "crystalline star-map sphere with 27 etched constellation points",
        "material_a": "borosilicate glass", "material_b": "copper wire armature",
        "bg_color": "deep Void Teal", "bg_hex": "#0A1628",
    },
    "9A-03": {
        "name": "Chakra-Kosha Mapping",
        "engine_name": "CHAKRA-KOSHA",
        "tagline": "Layered body cartography from core to periphery",
        "object": "nested translucent bio-resin shells arranged concentrically like a matryoshka",
        "material_a": "amber bio-resin", "material_b": "fiber-optic meridian traces",
        "bg_color": "warm Solar Bronze", "bg_hex": "#C4873B",
    },
    "9A-04": {
        "name": "Human Design",
        "engine_name": "HUMAN DESIGN",
        "tagline": "The bodygraph as architectural blueprint",
        "object": "diamond-shaped copper-and-glass bodygraph wireframe model on stand",
        "material_a": "oxidized copper nodes", "material_b": "glass connecting tubes",
        "bg_color": "deep Void Teal", "bg_hex": "#0A1628",
    },
    "9A-05": {
        "name": "Gene Keys",
        "engine_name": "GENE KEYS",
        "tagline": "Shadow to gift to siddhi — the spectrum of transformation",
        "object": "three-tiered crystal prism splitting light into spectral bands",
        "material_a": "crystalline quartz tiers", "material_b": "copper-wire binding",
        "bg_color": "Phosphor Cream", "bg_hex": "#F0EDE3",
    },
    "9A-06": {
        "name": "Astrocartography",
        "engine_name": "ASTROCARTOGRAPHY",
        "tagline": "Where on Earth your stars align",
        "object": "small terrestrial globe with copper meridian lines and pinpoint lights",
        "material_a": "etched glass surface", "material_b": "copper-wire latitude bands",
        "bg_color": "deep Void Teal", "bg_hex": "#0A1628",
    },
    "9A-07": {
        "name": "Enneagram",
        "engine_name": "ENNEAGRAM",
        "tagline": "Nine architectures of attention and desire",
        "object": "nine-pointed copper wireframe geometric sculpture on terrazzo base",
        "material_a": "oxidized copper", "material_b": "glass node connectors",
        "bg_color": "warm Solar Bronze", "bg_hex": "#C4873B",
    },
    "9A-08": {
        "name": "Numerology",
        "engine_name": "NUMEROLOGY",
        "tagline": "The hidden mathematics of becoming",
        "object": "brass typographic block set with digits 0-9 arranged in Fibonacci spiral",
        "material_a": "aged brass letterpress blocks", "material_b": "circuit-trace inlay",
        "bg_color": "deep Void Teal", "bg_hex": "#0A1628",
    },
    "9A-09": {
        "name": "Tarot",
        "engine_name": "TAROT",
        "tagline": "Symbolic mirrors for the architecture of choice",
        "object": "single oversized card made of copper-framed stained glass panel",
        "material_a": "stained glass segments", "material_b": "copper leading",
        "bg_color": "Phosphor Cream", "bg_hex": "#F0EDE3",
    },
    "9A-10": {
        "name": "TCM Organ Clock",
        "engine_name": "TCM ORGAN CLOCK",
        "tagline": "The body's circadian architecture of qi flow",
        "object": "twelve-segment circular clock with Art Nouveau copper sector dividers",
        "material_a": "patinated copper frame", "material_b": "glass face with etched meridians",
        "bg_color": "Chlorophyll green", "bg_hex": "#4A7C59",
    },
    "9A-11": {
        "name": "Biorhythm Engine",
        "engine_name": "BIORHYTHM",
        "tagline": "Three overlapping waves of physical, emotional, intellectual cycle",
        "object": "oscilloscope-like device with three copper sine wave traces frozen in glass",
        "material_a": "copper wave traces", "material_b": "borosilicate glass housing",
        "bg_color": "deep Void Teal", "bg_hex": "#0A1628",
    },
    "9A-12": {
        "name": "HRV Engine",
        "engine_name": "HRV ENGINE",
        "tagline": "Heart rhythm as the pulse of coherent consciousness",
        "object": "anatomical heart sculpture with ECG waveform trace etched into surface",
        "material_a": "bio-resin translucent form", "material_b": "copper-wire ECG trace",
        "bg_color": "warm Solar Bronze", "bg_hex": "#C4873B",
    },
    "9A-13": {
        "name": "Biofield and Raga",
        "engine_name": "BIOFIELD & RAGA",
        "tagline": "Sound frequency as the tuning fork of the subtle body",
        "object": "copper tuning fork with ascending frequency wave etched into bio-resin base",
        "material_a": "oxidized copper tines", "material_b": "bio-resin resonance chamber",
        "bg_color": "Chlorophyll green", "bg_hex": "#4A7C59",
    },
}

# Group into batches matching the engine categories
BATCHES = {
    "vedic": ["9A-01", "9A-02", "9A-03", "9A-04"],
    "western": ["9A-05", "9A-06", "9A-07", "9A-08"],
    "bridge": ["9A-09", "9A-10", "9A-11"],
    "biofield": ["9A-12", "9A-13"],
}


def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {os.path.basename(filepath)} ({size_kb:.0f} KB)")


def generate_poster(engine_id, engine_data, anchor_url, seed=42):
    variant = "v1" if seed == 42 else "v2"
    prompt = BASE_POSTER.format(**engine_data)
    full_prompt = f"{prompt}\n\nAvoid: {NEGATIVE}"

    print(f"\n  [{engine_id}] {engine_data['name']} (seed={seed})...")
    result = fal_client.subscribe(
        "fal-ai/nano-banana-pro",
        arguments={
            "prompt": full_prompt,
            "image_urls": [anchor_url],
            "aspect_ratio": "3:4",
            "resolution": "2K",
            "output_format": "png",
            "seed": seed,
            "num_images": 1,
        },
    )
    slug = engine_data["name"].lower().replace(" ", "-").replace("&", "and")
    out_path = os.path.join(OUT_DIR, f"{engine_id}-{slug}-poster-{variant}.png")
    download_image(result["images"][0]["url"], out_path)


def main():
    print("=" * 60)
    print("9A: 13-ENGINE INDIVIDUAL CAMPAIGN POSTERS")
    print("Model: Nano Banana Pro | Bioluminescent Architecture")
    print("=" * 60)

    batch_arg = sys.argv[1] if len(sys.argv) > 1 else "all"

    if batch_arg == "all":
        engine_ids = list(ENGINES.keys())
    elif batch_arg in BATCHES:
        engine_ids = BATCHES[batch_arg]
    else:
        print(f"Usage: python3 {sys.argv[0]} [vedic|western|bridge|biofield|all]")
        sys.exit(1)

    print(f"\nBatch: {batch_arg} ({len(engine_ids)} engines)")

    print("\nUploading style anchor (V2 bento)...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)
    print(f"  Anchor: {anchor_url[:60]}...")

    for eid in engine_ids:
        data = ENGINES[eid]
        print(f"\n{'='*60}")
        print(f"  {eid}: {data['name'].upper()}")
        print(f"{'='*60}")
        # One variation per engine (seed 42) to keep cost manageable for 13 posters
        generate_poster(eid, data, anchor_url, seed=42)

    print(f"\n{'='*60}")
    print(f"  9A ENGINE POSTERS — {len(engine_ids)} COMPLETE")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
