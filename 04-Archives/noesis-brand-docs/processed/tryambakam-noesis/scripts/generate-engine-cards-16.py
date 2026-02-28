#!/usr/bin/env python3
import os, sys, requests
from dotenv import load_dotenv
import fal_client

load_dotenv(os.path.expanduser("~/.claude/.env"))
if not os.environ.get("FAL_KEY"):
    print("ERROR: FAL_KEY missing")
    sys.exit(1)

ROOT = "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/generated-v3"
OUT = os.path.join(ROOT, "engine-cards")
os.makedirs(OUT, exist_ok=True)
ANCHOR = os.path.join(ROOT, "2A-brand-kit-bento-nanobananapro-v1.png")
if not os.path.exists(ANCHOR):
    alt = "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/noesis-brand-docs/processed/tryambakam-noesis/generated-v3/2A-brand-kit-bento-nanobananapro-v1.png"
    if os.path.exists(alt):
        ANCHOR = alt

LOGO_REFS = [
    "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/8x/Asset 1@8x.png",
    "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/8x/Asset 2@8x.png",
    "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/8x/Asset 3@8x.png",
]

NEG = "random logos, unrelated symbols, cluttered UI, anime style, low-detail, text artifacts"

ENGINES = [
    ("vedic", "Vimshottari Dasha", "Planetary time-cycle navigation compass"),
    ("vedic", "Nakshatra", "Lunar mansion star-field orientation"),
    ("vedic", "Chakra-Kosha", "Layered body-field cartography"),
    ("vedic", "Human Design", "Bodygraph as decision architecture"),
    ("western", "Gene Keys", "Shadow to gift to siddhi transformation"),
    ("western", "Astrocartography", "Geographic destiny and relocation map"),
    ("western", "Enneagram", "Nine attention architectures"),
    ("western", "Numerology", "Pattern mathematics of becoming"),
    ("bridge", "Tarot", "Symbolic mirrors for choice architecture"),
    ("bridge", "TCM Organ Clock", "Chronobiological qi-flow timing"),
    ("bridge", "Biorhythm", "Physical emotional intellectual cycles"),
    ("somatic", "HRV", "Nervous system coherence signal"),
    ("somatic", "Biofield & Raga", "Subtle-field tuning through resonance"),
    ("synthetic", "Birth Blueprint", "Integrated constitutional baseline"),
    ("synthetic", "Daily Practice", "Adaptive ritual protocol synthesis"),
    ("synthetic", "Decision Support", "Context-aware choice guidance"),
]

BATCH = {
    "vedic": [0,1,2,3],
    "western": [4,5,6,7],
    "bridge": [8,9,10],
    "somatic": [11,12],
    "synthetic": [13,14,15],
    "all": list(range(16)),
}


def download(url, out):
    r=requests.get(url, timeout=180)
    r.raise_for_status()
    with open(out,'wb') as f:
        f.write(r.content)
    print('  saved', os.path.basename(out))


def gen_card(idx, category, name, function, image_urls):
    prompt = f'''Tryambakam Noesis engine system card, category {category}. Vertical premium card render for one engine.
Engine title: "{name}" in Panchang bold, all caps.
Subtitle in Satoshi: "{function}".
Use canonical brand motif language: sacred geometry, precise linework, restrained glow.
Color system: Void Black #070B1D base, Flow Indigo #0B50FB structural light, Sacred Gold #C5A017 accents, Coherence Emerald #10B5A7 signal details.
Center object: one symbolic engineered artifact representing this engine.
No random new logos. Keep layout modular and export-ready for social crops.
Crisp typography, high legibility, editorial product-poster quality.
Avoid: {NEG}'''
    res = fal_client.subscribe('fal-ai/nano-banana-pro', arguments={
        'prompt': prompt,
        'image_urls': image_urls,
        'aspect_ratio': '3:4',
        'resolution': '2K',
        'output_format': 'png',
        'seed': 42,
        'num_images': 1,
    })
    slug = name.lower().replace('&','and').replace(' ','-')
    out = os.path.join(OUT, f'EC-{idx+1:02d}-{slug}-card-v1.png')
    download(res['images'][0]['url'], out)


def main():
    group = sys.argv[1] if len(sys.argv)>1 else 'vedic'
    if group not in BATCH:
        print('Usage: generate-engine-cards-16.py [vedic|western|bridge|somatic|synthetic|all]')
        sys.exit(1)
    image_urls = []
    if os.path.exists(ANCHOR):
        image_urls.append(fal_client.upload_file(ANCHOR))
    for lp in LOGO_REFS:
        if os.path.exists(lp):
            image_urls.append(fal_client.upload_file(lp))
    ids = BATCH[group]
    print(f'Generating {len(ids)} cards for group={group}')
    for i in ids:
        c,n,f = ENGINES[i]
        print(f'[{i+1:02d}] {n}')
        gen_card(i,c,n,f,image_urls)
    print('done')

if __name__ == '__main__':
    main()
