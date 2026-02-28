#!/usr/bin/env python3
"""
build_meta_sidecar.py — Generate lazy metadata sidecars for query_vault.

Creates:
  - meta.jsonl
  - meta.offsets.npy

This is intended for existing indexes that were built before sidecar emission
was added to embedder.save_metadata().
"""

from __future__ import annotations

import argparse
import json
import os
import tempfile
import time
from json import JSONDecodeError

import numpy as np


def _iter_json_array(path: str, chunk_size: int = 2 * 1024 * 1024):
    """Stream a top-level JSON array without loading entire file into memory."""
    decoder = json.JSONDecoder()
    with open(path, "r", encoding="utf-8") as f:
        # Seek opening '['
        while True:
            ch = f.read(1)
            if ch == "":
                raise ValueError(f"Unexpected EOF while seeking '[' in {path}")
            if ch.isspace():
                continue
            if ch != "[":
                raise ValueError(f"Expected '[' at top-level in {path}")
            break

        buf = ""
        eof = False
        while True:
            if not eof:
                chunk = f.read(chunk_size)
                if chunk == "":
                    eof = True
                else:
                    buf += chunk

            pos = 0
            while True:
                # Skip whitespace and optional commas.
                while pos < len(buf) and buf[pos].isspace():
                    pos += 1
                if pos < len(buf) and buf[pos] == ",":
                    pos += 1
                    while pos < len(buf) and buf[pos].isspace():
                        pos += 1

                if pos >= len(buf):
                    break

                # End of top-level array.
                if buf[pos] == "]":
                    return

                try:
                    obj, end = decoder.raw_decode(buf, pos)
                except JSONDecodeError:
                    # Need more bytes.
                    break

                yield obj
                pos = end

            if pos > 0:
                buf = buf[pos:]

            if eof:
                trailer = buf.strip()
                if trailer in ("", "]"):
                    return
                raise ValueError(f"Unexpected trailing content near EOF in {path}")


def build_sidecar(meta_path: str, force: bool = False, progress_every: int = 100_000) -> dict:
    stem, _ = os.path.splitext(meta_path)
    jsonl_path = f"{stem}.jsonl"
    offsets_path = f"{stem}.offsets.npy"

    if (os.path.exists(jsonl_path) or os.path.exists(offsets_path)) and not force:
        raise FileExistsError(
            f"Sidecar exists. Use --force to overwrite: {jsonl_path} / {offsets_path}"
        )

    os.makedirs(os.path.dirname(os.path.abspath(jsonl_path)) or ".", exist_ok=True)

    t0 = time.monotonic()
    count = 0
    bytes_written = 0
    offsets: list[int] = [0]

    out_dir = os.path.dirname(os.path.abspath(jsonl_path)) or "."

    with tempfile.NamedTemporaryFile(
        "wb",
        delete=False,
        dir=out_dir,
        prefix="meta.",
        suffix=".jsonl",
    ) as tf_jsonl:
        tmp_jsonl = tf_jsonl.name
    with tempfile.NamedTemporaryFile(
        "wb",
        delete=False,
        dir=out_dir,
        prefix="meta.",
        suffix=".offsets.npy",
    ) as tf_off:
        tmp_offsets = tf_off.name

    try:
        with open(tmp_jsonl, "wb") as out:
            for obj in _iter_json_array(meta_path):
                rec = json.dumps(obj, ensure_ascii=False, separators=(",", ":")).encode("utf-8") + b"\n"
                out.write(rec)
                bytes_written += len(rec)
                offsets.append(bytes_written)
                count += 1
                if progress_every > 0 and (count % progress_every == 0):
                    elapsed = max(time.monotonic() - t0, 1e-9)
                    rate = count / elapsed
                    print(
                        f"[build_meta_sidecar] records={count:,} rate={rate:,.0f}/s "
                        f"written={bytes_written / (1024**3):.2f}GiB"
                    )

        np.save(tmp_offsets, np.asarray(offsets, dtype=np.int64))
        os.replace(tmp_jsonl, jsonl_path)
        os.replace(tmp_offsets, offsets_path)
    except Exception:
        for p in (tmp_jsonl, tmp_offsets):
            try:
                if os.path.exists(p):
                    os.remove(p)
            except Exception:
                pass
        raise

    elapsed = time.monotonic() - t0
    return {
        "meta_path": os.path.abspath(meta_path),
        "jsonl_path": os.path.abspath(jsonl_path),
        "offsets_path": os.path.abspath(offsets_path),
        "records": count,
        "bytes_written": bytes_written,
        "elapsed_sec": elapsed,
        "records_per_sec": (count / elapsed) if elapsed > 0 else 0.0,
    }


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Build jsonl+offsets sidecars from meta.json")
    p.add_argument(
        "--meta-path",
        required=True,
        help="Path to meta.json (top-level JSON array).",
    )
    p.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing sidecar files if present.",
    )
    p.add_argument(
        "--progress-every",
        type=int,
        default=100_000,
        help="Print progress every N records (0 disables).",
    )
    return p.parse_args()


def main() -> None:
    args = _parse_args()
    if not os.path.exists(args.meta_path):
        raise SystemExit(f"ERROR: meta path not found: {args.meta_path}")

    result = build_sidecar(
        meta_path=args.meta_path,
        force=bool(args.force),
        progress_every=max(0, int(args.progress_every)),
    )
    print(
        "[build_meta_sidecar] done "
        f"records={result['records']:,} "
        f"elapsed={result['elapsed_sec']:.2f}s "
        f"rate={result['records_per_sec']:,.0f}/s"
    )
    print(f"[build_meta_sidecar] jsonl={result['jsonl_path']}")
    print(f"[build_meta_sidecar] offsets={result['offsets_path']}")


if __name__ == "__main__":
    main()
