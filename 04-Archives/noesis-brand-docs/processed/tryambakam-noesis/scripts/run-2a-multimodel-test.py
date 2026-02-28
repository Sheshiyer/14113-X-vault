#!/usr/bin/env python3
"""
Focused 2A bento-grid model sweep.
Goal: find which fal.ai model best preserves layout and places canonical logo
inside the dedicated logo/sigil panel (no floating overlay).
"""

import os
import json
import traceback
from datetime import datetime

import requests
from dotenv import load_dotenv
import fal_client


load_dotenv(os.path.expanduser("~/.claude/.env"))
if not os.environ.get("FAL_KEY"):
    raise SystemExit("FAL_KEY missing")

BASE_2A = "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/generated-v3/2A-logo3-test/2A-brand-kit-bento-nanobananapro-logo3-test-v1.png"
LOGO = "/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/Brand Visual Identity/logo/1x/Asset 3.png"

ts = datetime.now().strftime("%Y%m%d-%H%M%S")
OUT_DIR = f"/Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/brand-docs-final/generated-v3/2A-model-sweep-{ts}"
os.makedirs(OUT_DIR, exist_ok=True)

PROMPT = (
    "Edit this exact 2A Tryambakam Noesis bento board.\n"
    "Keep existing full layout, color palette, and text structure unchanged.\n"
    "Only update the LOGO/SIGIL panel (bottom-center panel): replace its current random sigil with the exact provided Asset 3 logo geometry.\n"
    "Do not redesign logo. Do not add any extra symbols. Do not place logo anywhere else.\n"
    "Logo treatment: thin sacred-gold linework on deep navy panel background, centered, clean, high legibility.\n"
    "No floating sticker, no overlay card, no obstruction over neighboring panels."
)


def download_image(url: str, path: str):
    r = requests.get(url, timeout=240)
    r.raise_for_status()
    with open(path, "wb") as f:
        f.write(r.content)


def extract_first_image_url(result: dict) -> str:
    if isinstance(result, dict):
        if "images" in result and isinstance(result["images"], list) and result["images"]:
            first = result["images"][0]
            if isinstance(first, dict) and "url" in first:
                return first["url"]
            if isinstance(first, str):
                return first
        if "image" in result:
            img = result["image"]
            if isinstance(img, dict) and "url" in img:
                return img["url"]
            if isinstance(img, str):
                return img
        if "output" in result:
            out = result["output"]
            if isinstance(out, list) and out:
                first = out[0]
                if isinstance(first, dict) and "url" in first:
                    return first["url"]
                if isinstance(first, str):
                    return first
            if isinstance(out, dict) and "url" in out:
                return out["url"]
            if isinstance(out, str):
                return out
    raise ValueError(f"Could not extract image URL from result keys={list(result.keys()) if isinstance(result, dict) else type(result)}")


def try_model(model_id: str, payload_candidates: list, run_name: str):
    print(f"\n=== {run_name} :: {model_id} ===")
    for idx, payload in enumerate(payload_candidates, start=1):
        try:
            print(f"  -> payload#{idx} keys={sorted(payload.keys())}")
            result = fal_client.subscribe(model_id, arguments=payload)
            image_url = extract_first_image_url(result)
            out_path = os.path.join(OUT_DIR, f"{run_name}__payload{idx}.png")
            download_image(image_url, out_path)
            print(f"  ✅ success: {out_path}")
            return {"ok": True, "model": model_id, "payload_index": idx, "output": out_path}
        except Exception as e:
            print(f"  ❌ payload#{idx} failed: {e}")
            # Save detailed error snapshot for debugging
            err_path = os.path.join(OUT_DIR, f"{run_name}__payload{idx}.error.txt")
            with open(err_path, "w", encoding="utf-8") as f:
                f.write(str(e) + "\n\n")
                f.write(traceback.format_exc())
    return {"ok": False, "model": model_id}


def main():
    if not os.path.exists(BASE_2A):
        raise SystemExit(f"Base 2A not found: {BASE_2A}")
    if not os.path.exists(LOGO):
        raise SystemExit(f"Logo not found: {LOGO}")

    base_url = fal_client.upload_file(BASE_2A)
    logo_url = fal_client.upload_file(LOGO)

    # Candidate payload templates (to handle schema differences across models)
    payload_a = {
        "prompt": PROMPT,
        "image_urls": [base_url, logo_url],
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "output_format": "png",
        "seed": 42,
        "num_images": 1,
    }
    payload_b = {
        "prompt": PROMPT,
        "image_url": base_url,
        "image_urls": [logo_url],
        "output_format": "png",
        "seed": 42,
        "num_images": 1,
    }
    payload_c = {
        "prompt": PROMPT,
        "image_url": base_url,
        "reference_image_url": logo_url,
        "output_format": "png",
        "seed": 42,
        "num_images": 1,
    }
    payload_d = {
        "prompt": PROMPT,
        "image_url": base_url,
        "image_urls": [base_url, logo_url],
        "image_size": "landscape_16_9",
        "seed": 42,
        "num_images": 1,
    }

    runs = [
        ("nano_banana_pro", "fal-ai/nano-banana-pro", [payload_a, payload_b, payload_c, payload_d]),
        ("flux_kontext", "fal-ai/flux-pro/kontext", [payload_b, payload_a, payload_c, payload_d]),
        ("flux_kontext_max", "fal-ai/flux-pro/kontext/max", [payload_b, payload_a, payload_c, payload_d]),
        ("bria_fibo_edit", "bria/fibo-edit/edit", [payload_b, payload_c, payload_a, payload_d]),
    ]

    summary = []
    for run_name, model_id, candidates in runs:
        summary.append(try_model(model_id, candidates, run_name))

    summary_path = os.path.join(OUT_DIR, "summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print(f"\nSaved summary: {summary_path}")
    print(f"Output dir: {OUT_DIR}")


if __name__ == "__main__":
    main()

