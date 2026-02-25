#!/usr/bin/env python3
"""
Tryambakam Noesis - Recraft V3 illustrations + remaining Nano Banana (7A)
Recraft V3 has 1000 char prompt limit — prompts condensed.
"""
import os, sys, requests, fal_client

BRAND_DOCS = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(BRAND_DOCS, "prompt-cookbook-images")
OUT_DIR = os.path.join(REF_DIR, "generated")
os.makedirs(OUT_DIR, exist_ok=True)

if not os.environ.get("FAL_KEY"):
    print("ERROR: Set FAL_KEY environment variable first.")
    sys.exit(1)

STYLE_ANCHOR = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-v1.png")

NEGATIVE = """ethereal, floating, cosmic, soft, warm colors, nurturing, tech startup, mystical, occult, stock photo, posed faces, glossy, plastic, rounded corners, gradient backgrounds, flowers, candles, crystals, meditation pose, yoga, wellness aesthetic, soft lighting, pastel colors"""

# ═══════ RECRAFT PROMPTS (condensed to <1000 chars each) ═══════

PROMPT_5A = """Tryambakam Noesis 19th Century Heritage logomark. Copperplate engraving style with thin delicate hairlines and subtle cross-hatching. Airy and precise, no heavy borders or shields.

Central sigil: three converging lines (source, witness, ground) as vintage scientific diagram from 1800s encyclopedia. Cartographic precision with compass arcs, measurement ticks, grid references surrounding the sigil. No mystical imagery, no chakras, no lotus.

"TRYAMBAKAM NOESIS" in Didone serif, wide letter spacing. Below: "EST. MMXXVI -- MEANING ARCHITECTURE" lighter weight.

Clean Bone (#F5F0E8) paper. Deep Ink (#1A1A2E) lines. Single Aged Gold (#B8860B) accent on one compass arc."""

PROMPT_5C = """Woodblock print of The Plumber -- solitary figure from behind, standing at base of vast vertebral column rising like axis mundi into clouds. Bold carved lines, flat color planes in Deep Ink (#1A1A2E) and Aged Gold (#B8860B). Visible wood grain texture. Edo-period ukiyo-e composition with wave-pattern borders. Subject is architectural not natural. Figure grounded on stone in structured linen. Vertebral column rendered with anatomical engraving precision -- each vertebra distinct, mechanical. No mystical imagery, no lotus, no mandala. Slight ink bleed at edges. Uncoated cream fibrous paper texture."""

PROMPT_5D = """13 minimalist flat vector icons for Tryambakam Noesis "13 Engine Stack" in Notion avatar style. Thick uniform black monoline outlines. Only Deep Ink (#1A1A2E) and Bone (#F5F0E8), no shading or gradients.

4x4 grid (last row 1 icon): 1.Orbital rings 2.Crescent moon+stars 3.Concentric body silhouette 4.Diamond bodygraph 5.Three-tier wave 6.Globe with meridians 7.Enneagram 8.Stacked digits 9.Card silhouette 10.12-segment clock 11.Three sine waves 12.ECG heartbeat 13.Ascending frequency curve

Clean grid on Bone background. Square frames, even spacing."""

PROMPT_7A = """Tryambakam Noesis "The Cartographer" editorial contact sheet. 3x3 grid, 9 panels, hands-only lifestyle photography. No face -- only hands and forearms in dark structured linen (Deep Ink #1A1A2E). Same hands all panels.

Panels: 1.Hands on open journal with diagrams 2.Pen hovering over geometric diagram 3.Placing glass jar next to carved wood on slate 4.Page-turn with deckled edge in warm light 5.Cradling brass instrument from behind shoulder 6.Finger tracing convergence pattern on paper 7.Breaking Deep Ink wax seal, gold flecks 8.Forearms resting, 13 engine cards in grid 9.Lighting incense in brass holder

Phase One XF 80mm f/8. Natural window light upper-left, high contrast, deep shadows. Aged Gold (#B8860B) highlights. Dark slate desk. Bone (#F5F0E8) plaster wall. 2px borders. 8K detail."""


def download_image(url, filepath):
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(resp.content)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved: {filepath} ({size_kb:.0f} KB)")


def gen_recraft(prompt_id, name, prompt, style, colors, size, seeds=(42, 137)):
    for seed in seeds:
        variant = "v1" if seed == 42 else "v2"
        print(f"\n  [{prompt_id}] Recraft V3 ({style}) seed={seed}...")
        print(f"  Prompt length: {len(prompt)} chars")

        args = {
            "prompt": prompt,
            "image_size": size,
            "style": style,
            "seed": seed,
        }
        if colors:
            args["colors"] = [{"rgb": c} for c in colors]

        result = fal_client.subscribe(
            "fal-ai/recraft/v3/text-to-image",
            arguments=args,
        )
        slug = name.lower().replace(" ", "-").replace("--", "-")
        out_path = os.path.join(OUT_DIR, f"{prompt_id}-{slug}-recraft-{variant}.png")
        download_image(result["images"][0]["url"], out_path)


def gen_nano_banana(prompt_id, name, prompt, aspect, ref_file, anchor_url, seeds=(42, 137)):
    comp_url = fal_client.upload_file(os.path.join(REF_DIR, ref_file))
    full_prompt = f"{prompt}\n\nAvoid: {NEGATIVE}"

    for seed in seeds:
        variant = "v1" if seed == 42 else "v2"
        print(f"\n  [{prompt_id}] Nano Banana Pro seed={seed}...")
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": full_prompt,
                "image_urls": [anchor_url, comp_url],
                "aspect_ratio": aspect,
                "resolution": "2K",
                "output_format": "png",
                "seed": seed,
                "num_images": 1,
            },
        )
        slug = name.lower().replace(" ", "-").replace("--", "-")
        out_path = os.path.join(OUT_DIR, f"{prompt_id}-{slug}-nanobananapro-{variant}.png")
        download_image(result["images"][0]["url"], out_path)


def main():
    print("=" * 60)
    print("RECRAFT + REMAINING BATCH")
    print("=" * 60)

    # Upload anchor for 7A
    print("\nUploading style anchor...")
    anchor_url = fal_client.upload_file(STYLE_ANCHOR)

    # 5A Heritage Engraving
    print(f"\n{'='*60}\n  5A HERITAGE ENGRAVING\n{'='*60}")
    gen_recraft("5A", "heritage-engraving", PROMPT_5A,
                "digital_illustration", ["#1A1A2E", "#F5F0E8", "#B8860B"], "square_hd")

    # 5C Woodblock Print
    print(f"\n{'='*60}\n  5C WOODBLOCK PRINT\n{'='*60}")
    gen_recraft("5C", "woodblock-plumber", PROMPT_5C,
                "digital_illustration", ["#1A1A2E", "#B8860B"], "portrait_4_3")

    # 5D Icon System
    print(f"\n{'='*60}\n  5D 13 ENGINE ICONS\n{'='*60}")
    gen_recraft("5D", "engine-icons", PROMPT_5D,
                "vector_illustration", ["#1A1A2E", "#F5F0E8"], "square_hd")

    # 7A Cartographer Contact Sheet
    print(f"\n{'='*60}\n  7A CARTOGRAPHER CONTACT SHEET\n{'='*60}")
    gen_nano_banana("7A", "cartographer-contact-sheet", PROMPT_7A,
                    "1:1", "ref-contact-sheet.jpg", anchor_url)

    print(f"\n{'='*60}")
    print("  ALL REMAINING — COMPLETE")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
