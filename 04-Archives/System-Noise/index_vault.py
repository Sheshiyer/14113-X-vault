#!/usr/bin/env python3
"""
index_vault.py — Full indexer for the PARA Vault Memory Index.

Walks the vault, chunks markdown/TXT files, encodes with
sentence-transformers, and writes a FAISS index + metadata JSON.

Usage:
    python index_vault.py                          # defaults
    python index_vault.py --vault-path /path/to/vault
    python index_vault.py --batch-size 128 --model all-MiniLM-L6-v2
"""

from __future__ import annotations

import argparse
import os
import sys
import time

# Ensure this script can import sibling modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chunker import chunk_markdown, chunk_txt, extract_frontmatter
from walker import walk_vault, safe_read, is_noisy, prepend_context, build_meta, ProgressTracker
from embedder import (
    encode_chunked,
    build_faiss_index,
    save_index,
    save_metadata,
    save_stats,
    MODEL_NAME,
    MEGA_BATCH_SIZE,
    DEFAULT_BATCH_SIZE,
)
from incremental import save_file_mtimes, save_embeddings, collect_mtimes

from sentence_transformers import SentenceTransformer


# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

_DEFAULT_VAULT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_DEFAULT_OUTPUT = os.path.join(_DEFAULT_VAULT, "_System", "memory")


# ---------------------------------------------------------------------------
# A-W5-04: Skip logger
# ---------------------------------------------------------------------------

class SkipLogger:
    """Writes skipped files and reasons to a log file."""

    def __init__(self, path: str):
        self._path = path
        self._fh = open(path, "w", encoding="utf-8")
        self.count = 0

    def log(self, rel_path: str, reason: str) -> None:
        self._fh.write(f"{reason}\t{rel_path}\n")
        self.count += 1

    def close(self) -> None:
        self._fh.close()


# ---------------------------------------------------------------------------
# A-W5-01: Main indexing pipeline
# ---------------------------------------------------------------------------

def index_vault(
    vault_path: str,
    output_dir: str,
    model_name: str = MODEL_NAME,
    batch_size: int = DEFAULT_BATCH_SIZE,
    mega_batch: int = MEGA_BATCH_SIZE,
) -> dict:
    """Run the full indexing pipeline.

    Returns the stats dict on completion.
    """
    os.makedirs(output_dir, exist_ok=True)

    skip_log = SkipLogger(os.path.join(output_dir, "skipped.log"))

    # ------------------------------------------------------------------
    # Phase 1: Walk + Chunk
    # ------------------------------------------------------------------
    print("Phase 1/3: Walking vault and chunking files...")
    t0 = time.monotonic()

    # Collect file list first for progress tracking
    file_list = list(walk_vault(vault_path))
    total_files = len(file_list)
    print(f"  Found {total_files:,} files to process")

    tracker = ProgressTracker(total=total_files, every=500)

    all_texts: list[str] = []     # context-prepended chunk texts for embedding
    all_meta: list[dict] = []     # parallel metadata records
    files_indexed = 0

    for idx, (abs_path, rel_path) in enumerate(file_list):
        # Read file
        content = safe_read(abs_path)
        if not content:
            skip_log.log(rel_path, "encoding_error")
            tracker.update(idx + 1)
            continue

        # Noise check
        if is_noisy(content):
            skip_log.log(rel_path, "noisy")
            tracker.update(idx + 1)
            continue

        # Extract frontmatter (markdown only)
        is_md = rel_path.lower().endswith(".md")
        frontmatter = None
        body = content
        if is_md:
            frontmatter, body = extract_frontmatter(content)

        # Skip if body is too short after frontmatter removal
        if len(body.strip()) < 50:
            skip_log.log(rel_path, "too_short_body")
            tracker.update(idx + 1)
            continue

        # Chunk
        if is_md:
            chunks = chunk_markdown(body)
        else:
            chunks = chunk_txt(body)

        if not chunks:
            skip_log.log(rel_path, "no_chunks")
            tracker.update(idx + 1)
            continue

        # Build texts + metadata for each chunk
        for ci, chunk in enumerate(chunks):
            text_with_ctx = prepend_context(chunk.text, rel_path, chunk.heading)
            all_texts.append(text_with_ctx)
            all_meta.append(build_meta(rel_path, chunk.heading, frontmatter, ci))

        files_indexed += 1
        tracker.update(idx + 1)

    tracker.finish()
    skip_log.close()

    chunk_count = len(all_texts)
    t1 = time.monotonic()
    print(f"  Chunking done: {files_indexed:,} files → {chunk_count:,} chunks "
          f"({skip_log.count} skipped) in {t1 - t0:.1f}s")

    if chunk_count == 0:
        print("ERROR: No chunks produced. Aborting.")
        return {}

    # ------------------------------------------------------------------
    # Phase 2: Encode
    # ------------------------------------------------------------------
    print(f"Phase 2/3: Encoding {chunk_count:,} chunks with {model_name}...")
    t2 = time.monotonic()

    model = SentenceTransformer(model_name)

    def embed_progress(done, total):
        pct = done / total * 100
        print(f"  Encoded {done:,}/{total:,} chunks ({pct:.1f}%)", file=sys.stderr)

    embeddings = encode_chunked(
        model, all_texts,
        mega_batch=mega_batch,
        batch_size=batch_size,
        progress_cb=embed_progress,
    )

    t3 = time.monotonic()
    print(f"  Encoding done in {t3 - t2:.1f}s ({chunk_count / (t3 - t2):.0f} chunks/s)")

    # ------------------------------------------------------------------
    # Phase 3: Build FAISS index and write outputs
    # ------------------------------------------------------------------
    print("Phase 3/3: Building FAISS index and saving...")

    index = build_faiss_index(embeddings)

    faiss_path = os.path.join(output_dir, "vault.faiss")
    meta_path = os.path.join(output_dir, "meta.json")
    stats_path = os.path.join(output_dir, "index_stats.json")

    save_index(index, faiss_path)
    save_metadata(all_meta, meta_path)

    # Save embeddings.npy and file_hashes.json for incremental updates
    emb_path = os.path.join(output_dir, "embeddings.npy")
    save_embeddings(embeddings, emb_path)

    hashes_path = os.path.join(output_dir, "file_hashes.json")
    mtime_map = collect_mtimes(file_list)
    save_file_mtimes(mtime_map, hashes_path)

    total_time = time.monotonic() - t0
    stats = save_stats(
        file_count=files_indexed,
        chunk_count=chunk_count,
        model_name=model_name,
        extra={
            "total_files_walked": total_files,
            "files_skipped": skip_log.count,
            "total_time_seconds": round(total_time, 1),
        },
        path=stats_path,
    )

    faiss_mb = os.path.getsize(faiss_path) / (1024 * 1024)
    meta_mb = os.path.getsize(meta_path) / (1024 * 1024)

    print(f"\n{'=' * 50}")
    print(f"  Index complete!")
    print(f"  Files indexed:  {files_indexed:,}")
    print(f"  Chunks:         {chunk_count:,}")
    print(f"  Skipped:        {skip_log.count}")
    print(f"  FAISS index:    {faiss_path} ({faiss_mb:.1f} MB)")
    print(f"  Metadata:       {meta_path} ({meta_mb:.1f} MB)")
    print(f"  Stats:          {stats_path}")
    print(f"  Skip log:       {os.path.join(output_dir, 'skipped.log')}")
    print(f"  Total time:     {total_time:.1f}s")
    print(f"{'=' * 50}")

    return stats


# ---------------------------------------------------------------------------
# A-W5-02: CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Index PARA vault for semantic search",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--vault-path",
        default=_DEFAULT_VAULT,
        help="Root directory of the Obsidian vault",
    )
    parser.add_argument(
        "--output-dir",
        default=_DEFAULT_OUTPUT,
        help="Directory for index output files (vault.faiss, meta.json, etc.)",
    )
    parser.add_argument(
        "--model",
        default=MODEL_NAME,
        help="Sentence-transformer model name",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help="Encoding batch size for sentence-transformers",
    )
    parser.add_argument(
        "--mega-batch",
        type=int,
        default=MEGA_BATCH_SIZE,
        help="Chunks per mega-batch (memory-efficiency control)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    print(f"PARA Vault Indexer")
    print(f"  Vault:    {args.vault_path}")
    print(f"  Output:   {args.output_dir}")
    print(f"  Model:    {args.model}")
    print(f"  Batch:    {args.batch_size}")
    print()

    stats = index_vault(
        vault_path=args.vault_path,
        output_dir=args.output_dir,
        model_name=args.model,
        batch_size=args.batch_size,
        mega_batch=args.mega_batch,
    )

    if not stats:
        sys.exit(1)


if __name__ == "__main__":
    main()
