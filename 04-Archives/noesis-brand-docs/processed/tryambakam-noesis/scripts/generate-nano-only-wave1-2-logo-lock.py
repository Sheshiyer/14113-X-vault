#!/usr/bin/env python3
import os, requests
from dotenv import load_dotenv
import fal_client

load_dotenv(os.path.expanduser('~/.claude/.env'))
if not os.environ.get('FAL_KEY'):
    raise SystemExit('FAL_KEY missing')

OUT_DIR = '/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/generated-v3/nano-logo-rerun'
os.makedirs(OUT_DIR, exist_ok=True)

LOGO_PATH = '/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/1x/Asset 3.png'
REF_DIR = '/Volumes/madara/2026/brandmint/references/images'
REFS = {
    '2A':'ref-2A-bento-grid.jpg','2B':'ref-2B-brand-seal.jpg','2C':'ref-2C-logo-emboss.jpg',
    '3A':'ref-3A-capsule-collection.jpg','3B':'ref-3B-hero-product.jpg','3C':'ref-3C-essence-vial.jpg'
}
ASPECT = {'2A':'16:9','2B':'1:1','2C':'16:9','3A':'4:3','3B':'1:1','3C':'1:1'}
SLUG = {'2A':'brand-kit-bento','2B':'brand-seal','2C':'logo-emboss','3A':'capsule-collection','3B':'hero-book','3C':'essence-vial'}

NEG = 'random logos, fake brand marks, wrong products, gibberish text, unrelated consumer items, cartoon, anime'

PROMPTS = {
    '2A': '''Tryambakam Noesis V3 brand identity bento board. Use the exact logo from provided image reference (do not redesign it). 6 modules: hero, quote, palette, typography, sigil/logo panel, manifesto. Palette lock: #070B1D #0B50FB #C5A017 #10B5A7 #2D0050. Premium editorial system board.''',
    '2B': '''Tryambakam Noesis embossed bronze seal study. Preserve exact canonical logo geometry from reference image. No reinterpretation. High-fidelity metal emboss, clean dark background, strong legibility.''',
    '2C': '''Tryambakam Noesis glass/foil emboss lockup. Preserve exact canonical logo from reference image. No new symbol invention. Premium material realism, minimal composition.''',
    '3A': '''Tryambakam Noesis capsule collection using only real product directions: Somatic Canticles codex, Essential Oil Attar vial, ritual crystal/orgonite object, resonance pendant. Canonical logo appears correctly on artifacts. No unrelated products.''',
    '3B': '''Tryambakam Noesis hero product shot: Somatic Canticles codex with exact canonical logo on cover/spine, sacred geometry interior pages, engineered ritual aesthetic, museum-grade photography.''',
    '3C': '''Tryambakam Noesis Essential Oil Attar vial hero shot. Exact canonical logo on label/etching, SF Mono micro-details, clean premium packshot, no random marks.'''
}


def save(url, out):
    r = requests.get(url, timeout=240)
    r.raise_for_status()
    with open(out, 'wb') as f:
        f.write(r.content)
    print('  saved', os.path.basename(out))


def gen(pid, seed, anchor_url=None, logo_url=None):
    urls = []
    if anchor_url:
        urls.append(anchor_url)
    if logo_url:
        urls.append(logo_url)
    rp = os.path.join(REF_DIR, REFS[pid])
    if os.path.exists(rp):
        urls.append(fal_client.upload_file(rp))

    prompt = PROMPTS[pid] + '\nAvoid: ' + NEG
    res = fal_client.subscribe('fal-ai/nano-banana-pro', arguments={
        'prompt': prompt,
        'image_urls': urls,
        'aspect_ratio': ASPECT[pid],
        'resolution': '2K',
        'output_format': 'png',
        'seed': seed,
        'num_images': 1,
    })
    variant = 'v1' if seed == 42 else f'v{seed}'
    out = os.path.join(OUT_DIR, f'{pid}-{SLUG[pid]}-nanobananapro-logo3-{variant}.png')
    save(res['images'][0]['url'], out)


def main():
    if not os.path.exists(LOGO_PATH):
        raise SystemExit(f'Logo missing: {LOGO_PATH}')
    logo_url = fal_client.upload_file(LOGO_PATH)

    print('Wave 1: 2A-2C')
    for pid in ['2A','2B','2C']:
        for seed in (42,137):
            print(f'[{pid}] seed={seed}')
            gen(pid, seed, anchor_url=None, logo_url=logo_url)

    anchor = os.path.join(OUT_DIR, '2A-brand-kit-bento-nanobananapro-logo3-v1.png')
    anchor_url = fal_client.upload_file(anchor) if os.path.exists(anchor) else None

    print('Wave 2: 3A-3C')
    for pid in ['3A','3B','3C']:
        for seed in (42,137):
            print(f'[{pid}] seed={seed}')
            gen(pid, seed, anchor_url=anchor_url, logo_url=logo_url)

    print('Done:', OUT_DIR)

if __name__ == '__main__':
    main()
