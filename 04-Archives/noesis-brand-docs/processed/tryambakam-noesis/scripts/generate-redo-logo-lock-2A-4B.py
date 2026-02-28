#!/usr/bin/env python3
import os, requests
from dotenv import load_dotenv
import fal_client

load_dotenv(os.path.expanduser("~/.claude/.env"))
if not os.environ.get("FAL_KEY"):
    raise SystemExit("FAL_KEY missing")

OUT_DIR = "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/generated-v3/redo-logo-lock"
os.makedirs(OUT_DIR, exist_ok=True)

REF_DIR = "/Volumes/madara/2026/brandmint/references/images"
LOGO_REFS = [
    "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/8x/Asset 1@8x.png",
    "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/8x/Asset 2@8x.png",
    "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/8x/Asset 3@8x.png",
]
REFS = {
    "2A": "ref-2A-bento-grid.jpg",
    "2B": "ref-2B-brand-seal.jpg",
    "2C": "ref-2C-logo-emboss.jpg",
    "3A": "ref-3A-capsule-collection.jpg",
    "3B": "ref-3B-hero-product.jpg",
    "3C": "ref-3C-essence-vial.jpg",
    "4A": "ref-4A-catalog-layout.jpg",
    "4B": "ref-4B-flatlay.jpg",
}

NEG = "random logos, unrelated symbols, fake brand names, placeholder gibberish text, wrong products, clutter, cartoon, anime"

PROMPTS = {
    "2A": """Tryambakam Noesis V3 brand identity bento board. Must use the exact canonical logo form from reference images. 6 blocks: hero scene, typography sample, quote card, palette card, sigil card, manifesto card. Palette lock: Void Black #070B1D, Flow Indigo #0B50FB, Sacred Gold #C5A017, Coherence Emerald #10B5A7, Witness Violet #2D0050. Typography style: Panchang + Satoshi. Premium editorial product design quality.""",
    "2B": """Tryambakam Noesis embossed bronze brand seal. Use canonical logo exactly as provided, no reinterpretation. Circular seal medallion on dark matte surface, micro-engraved line details, premium material realism, controlled rim light, clean composition.""",
    "2C": """Tryambakam Noesis logo emboss composition. Use canonical logo exactly from references, pressed/etched into frosted glass + metal plaque system. No random mark invention. Strong logo legibility, high-end editorial lighting, minimal background.""",
    "3A": """Tryambakam Noesis capsule collection grounded in actual product stack: Somatic Canticles codex, Essential Oil Attar vial, Orgonite/Crystal ritual object, Resonance pendant. Show only these product directions, no unrelated consumer products. Premium tabletop lineup, engineered ritual aesthetic.""",
    "3B": """Tryambakam Noesis hero product shot: Somatic Canticles physical codex artifact with canonical logo lockup on cover/spine. Sacred geometry diagrams, copper + glass accents, museum-grade product photography, no random symbols.""",
    "3C": """Tryambakam Noesis essence vial hero: Essential Oil Attar bottle from product list, canonical logo lock on etched label, SF Mono micro type details, clean background, accurate premium packshot style.""",
    "4A": """Tryambakam Noesis catalog layout using actual products only: top lifestyle shot of Somatic Canticles + Attar + ritual object; bottom technical specification panel for these same products. Must retain canonical logo and real product family coherence. Avoid fabricated unknown products.""",
    "4B": """Tryambakam Noesis ritual flatlay of real product ecosystem: Somatic Canticles, Essential Oil Attar, Sacred Burnable holder, Crystal Array/Orgonite, Resonance pendant. Canonical logo appears on at least two objects. Clean layout, high legibility, editorial consistency.""",
}

ASPECT = {
    "2A": "16:9",
    "2B": "1:1",
    "2C": "16:9",
    "3A": "4:3",
    "3B": "1:1",
    "3C": "1:1",
    "4A": "3:4",
    "4B": "1:1",
}

SLUG = {
    "2A": "brand-kit-bento",
    "2B": "brand-seal",
    "2C": "logo-emboss",
    "3A": "capsule-collection",
    "3B": "hero-book",
    "3C": "essence-vial",
    "4A": "catalog-layout",
    "4B": "flatlay",
}

def save(url, out):
    r = requests.get(url, timeout=240)
    r.raise_for_status()
    with open(out, "wb") as f:
        f.write(r.content)
    print("  saved", os.path.basename(out))


def upload_refs(pid, anchor_url=None):
    urls = []
    if anchor_url:
        urls.append(anchor_url)
    for lp in LOGO_REFS:
        if os.path.exists(lp):
            urls.append(fal_client.upload_file(lp))
    rp = os.path.join(REF_DIR, REFS[pid])
    if os.path.exists(rp):
        urls.append(fal_client.upload_file(rp))
    return urls


def gen(pid, seed, anchor_url=None):
    prompt = PROMPTS[pid] + "\nAvoid: " + NEG
    image_urls = upload_refs(pid, anchor_url=anchor_url)
    res = fal_client.subscribe("fal-ai/nano-banana-pro", arguments={
        "prompt": prompt,
        "image_urls": image_urls,
        "aspect_ratio": ASPECT[pid],
        "resolution": "2K",
        "output_format": "png",
        "seed": seed,
        "num_images": 1,
    })
    variant = "v1" if seed == 42 else f"v{seed}"
    out = os.path.join(OUT_DIR, f"{pid}-{SLUG[pid]}-nanobananapro-logo-lock-{variant}.png")
    save(res["images"][0]["url"], out)


def main():
    print("Redo 2A-4B with canonical logo lock + product-grounded prompts")

    # 2A first as new anchor for this redo set
    for seed in (42, 137):
        print(f"\\n[2A] seed={seed}")
        gen("2A", seed)

    redo_anchor = os.path.join(OUT_DIR, "2A-brand-kit-bento-nanobananapro-logo-lock-v1.png")
    anchor_url = fal_client.upload_file(redo_anchor) if os.path.exists(redo_anchor) else None

    for pid in ["2B", "2C", "3A", "3B", "3C", "4A", "4B"]:
        for seed in (42, 137):
            print(f"\\n[{pid}] seed={seed}")
            gen(pid, seed, anchor_url=anchor_url)

    print("\\nDone. Output:", OUT_DIR)

if __name__ == "__main__":
    main()
