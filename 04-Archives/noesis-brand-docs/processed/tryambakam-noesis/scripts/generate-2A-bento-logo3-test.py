#!/usr/bin/env python3
import os, requests
from dotenv import load_dotenv
import fal_client

load_dotenv(os.path.expanduser('~/.claude/.env'))
if not os.environ.get('FAL_KEY'):
    raise SystemExit('FAL_KEY missing')

OUT_DIR = '/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/generated-v3/2A-logo3-test'
os.makedirs(OUT_DIR, exist_ok=True)

LOGO = '/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/1x/Asset 3.png'
REF_2A = '/Volumes/madara/2026/brandmint/references/images/ref-2A-bento-grid.jpg'

prompt = '''Tryambakam Noesis brand kit bento grid (2A). Use the exact logo from provided reference image Asset 3, no redesign. Six-panel bento layout: hero panel, quote panel, palette panel, typography panel, logo/sigil panel, brand DNA panel. Color lock: #070B1D #0B50FB #C5A017 #10B5A7 #2D0050. Premium editorial style, clean spacing, high legibility. Avoid random symbols or alternate logos.'''


def save(url, path):
    r = requests.get(url, timeout=240)
    r.raise_for_status()
    with open(path, 'wb') as f:
        f.write(r.content)
    print('saved', path)


def run(seed):
    image_urls = []
    if os.path.exists(LOGO):
        image_urls.append(fal_client.upload_file(LOGO))
    if os.path.exists(REF_2A):
        image_urls.append(fal_client.upload_file(REF_2A))

    res = fal_client.subscribe('fal-ai/nano-banana-pro', arguments={
        'prompt': prompt,
        'image_urls': image_urls,
        'aspect_ratio': '16:9',
        'resolution': '2K',
        'output_format': 'png',
        'seed': seed,
        'num_images': 1,
    })
    variant = 'v1' if seed == 42 else f'v{seed}'
    out = os.path.join(OUT_DIR, f'2A-brand-kit-bento-nanobananapro-logo3-test-{variant}.png')
    save(res['images'][0]['url'], out)


if __name__ == '__main__':
    run(42)
    run(137)
    print('done:', OUT_DIR)
