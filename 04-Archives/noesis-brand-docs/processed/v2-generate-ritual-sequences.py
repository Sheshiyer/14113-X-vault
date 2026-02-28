#!/usr/bin/env python3
"""
Tryambakam Noesis V2 - 10A/10B/10C: Sequential Practice Narrative Contact Sheets
Three 3x3 contact sheets showing hands-only practice moments.
V2 "Bioluminescent Architecture" theme.

Model: Nano Banana Pro (photorealistic + style anchor)
Output: prompt-cookbook-images/generated-v2/

Usage:
  source .venv/bin/activate
  python3 v2-generate-ritual-sequences.py [morning|evening|initiation|all]
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
COMP_REF = os.path.join(REF_DIR, "ref-contact-sheet.jpg")

NEGATIVE = """steampunk cliche, cyberpunk neon excess, dystopian decay, grungy, retro-futurism kitsch, generic sci-fi, lens flare, overblown HDR, chrome excess, tron-lines, wireframe hologram, Matrix green text, stock photo, posed faces, glossy plastic, rounded corners, gradient backgrounds, wellness aesthetic, soft lighting, pastel colors, vaporwave, synthwave, glitch art, anime, manga, cartoon, pixel art, low poly, 8-bit, face visible, frontal view"""

PROMPT_10A_MORNING = """Tryambakam Noesis -- "The Morning Ritual" sequential practice narrative. 3x3 grid of 9 panels showing hands-only progression inside Art Nouveau greenhouse conservatory. No face visible -- only hands and forearms in dark structured technical linen (Void Teal #0A1628). Same hands across all 9 panels. Each panel tells the next moment in a morning practice ritual.

9 PANELS — SEQUENTIAL NARRATIVE:
1. Right hand reaching for copper incense holder on polished terrazzo shelf — dawn light through stained glass
2. Match flame touching incense tip in Art Nouveau copper holder — first wisps of smoke rising
3. Both hands opening the Somatic Codex on terrazzo desk — bio-resin spine catching warm light
4. Index finger tracing a circuit-trace diagram on mycelium page — the first study of the day
5. Right hand dipping copper-nib pen into Solar Bronze ink well — preparing to annotate
6. Pen mid-stroke writing a geometric annotation on mycelium paper — ink still wet
7. Both hands arranging three small bio-digital objects in a row on terrazzo — morning inventory
8. Left hand placing a borosilicate terrarium with living moss next to the codex — establishing the workspace
9. Forearms resting flat on terrazzo, palms down, all objects arranged — the settled moment before practice begins

Camera: Phase One XF, 80mm, f/8. Morning greenhouse light — warm Solar Bronze (#C4873B) through stained glass creating long shadows. Polished terrazzo desk. Art Nouveau copper-wire greenhouse structure visible. 2px Titanium (#8A9BA8) borders. Ultra-photorealistic 8K detail."""

PROMPT_10B_EVENING = """Tryambakam Noesis -- "The Evening Integration" sequential practice narrative. 3x3 grid of 9 panels showing hands-only progression inside Art Nouveau greenhouse conservatory at dusk. No face -- only hands and forearms in dark structured technical linen (Void Teal #0A1628). Same hands across all 9 panels. Each panel captures the next moment in an evening review ritual.

9 PANELS — SEQUENTIAL NARRATIVE:
1. Both hands lifting the Somatic Codex from a copper book stand — the day's pages marked with a gold ribbon
2. Right hand turning codex pages backward — reviewing the day's annotations in Solar Bronze ink
3. Left hand pulling a small amber glass essential oil bottle from a copper tray — preparing
4. Fingertip touching oil to wrist — the ritual of sensory grounding
5. Both hands arranging 13 small engine diagram cards in a grid on terrazzo — the evening audit
6. Right hand hovering over one card (Enneagram) — deliberating, choosing the night's focus
7. Index finger pressing an oxidized copper wax seal onto folded mycelium paper — sealing the day
8. Both hands closing the Somatic Codex gently — bio-resin spine aligned with desk edge
9. Single hand resting on closed codex, other hand cupping last wisps of incense smoke — integration complete

Camera: Phase One XF, 80mm, f/5.6. Dusk greenhouse light — cooler Void Teal (#0A1628) shadows with pockets of warm Solar Bronze from a single copper desk lamp. Polished terrazzo. 2px Titanium borders. 8K detail."""

PROMPT_10C_INITIATION = """Tryambakam Noesis -- "The Initiation" sequential practice narrative. 3x3 grid of 9 panels showing hands-only progression of discovering the inquiry kit for the first time. No face -- only hands and forearms in dark structured technical linen (Void Teal #0A1628). Same hands across all 9 panels. The narrative arc: from sealed package to assembled practice space.

9 PANELS — SEQUENTIAL NARRATIVE:
1. Both hands receiving a wrapped package in Deep Ink (#0A1628) matte paper with Solar Bronze wax seal — the box arrives
2. Thumbs breaking the oxidized copper wax seal — Solar Bronze patina flecks scattering on terrazzo
3. Hands unfolding the wrapping to reveal a wooden inquiry kit box with copper corner brackets
4. Right hand lifting the lid of the box — inside: objects nested in Phosphor Cream linen dividers
5. Both hands lifting out the Somatic Codex — first contact with the bio-resin spine
6. Left hand holding up a small borosilicate terrarium with living moss to greenhouse light
7. Right hand examining the copper incense holder — turning it, feeling the Art Nouveau curves
8. Both hands arranging all objects from the kit on polished terrazzo — knolling layout
9. Overhead view of the complete arrangement — every object in its place, hands at edges of frame, the practice space born

Camera: Phase One XF, 80mm, f/8. Bright greenhouse light from above — Solar Bronze (#C4873B) highlights, Void Teal deep shadows. Polished terrazzo desk. Art Nouveau greenhouse ironwork visible. 2px Titanium borders. Ultra-photorealistic 8K."""


SEQUENCES = {
    "morning": {
        "id": "10A",
        "name": "The Morning Ritual",
        "prompt": PROMPT_10A_MORNING,
    },
    "evening": {
        "id": "10B",
        "name": "The Evening Integration",
        "prompt": PROMPT_10B_EVENING,
    },
    "initiation": {
        "id": "10C",
        "name": "The Initiation",
        "prompt": PROMPT_10C_INITIATION,
    },
}


def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {os.path.basename(filepath)} ({size_kb:.0f} KB)")


def generate_sequence(seq_key, seq_data, anchor_url, comp_url):
    sid = seq_data["id"]
    name = seq_data["name"]
    prompt = seq_data["prompt"]
    full_prompt = f"{prompt}\n\nAvoid: {NEGATIVE}"

    print(f"\n{'='*60}")
    print(f"  {sid}: {name.upper()}")
    print(f"{'='*60}")

    for seed, variant in [(42, "v1"), (137, "v2")]:
        print(f"\n  [{sid}] Nano Banana Pro seed={seed}...")
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": full_prompt,
                "image_urls": [anchor_url, comp_url],
                "aspect_ratio": "1:1",
                "resolution": "2K",
                "output_format": "png",
                "seed": seed,
                "num_images": 1,
            },
        )
        slug = name.lower().replace(" ", "-")
        out_path = os.path.join(OUT_DIR, f"{sid}-{slug}-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)


def main():
    print("=" * 60)
    print("10A-C: SEQUENTIAL PRACTICE NARRATIVES")
    print("Model: Nano Banana Pro | Bioluminescent Architecture")
    print("=" * 60)

    batch_arg = sys.argv[1] if len(sys.argv) > 1 else "all"

    if batch_arg == "all":
        seq_keys = list(SEQUENCES.keys())
    elif batch_arg in SEQUENCES:
        seq_keys = [batch_arg]
    else:
        print(f"Usage: python3 {sys.argv[0]} [morning|evening|initiation|all]")
        sys.exit(1)

    print(f"\nSequences: {', '.join(seq_keys)}")

    print("\nUploading style anchor (V2 bento)...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)
    print(f"  Anchor: {anchor_url[:60]}...")

    print("Uploading composition reference (contact sheet)...")
    comp_url = fal_client.upload_file(COMP_REF)
    print(f"  Comp ref: {comp_url[:60]}...")

    for key in seq_keys:
        generate_sequence(key, SEQUENCES[key], anchor_url, comp_url)

    print(f"\n{'='*60}")
    print(f"  SEQUENTIAL NARRATIVES — {len(seq_keys)} COMPLETE")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
