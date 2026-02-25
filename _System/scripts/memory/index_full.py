#!/usr/bin/env python3
"""
index_full.py — Full corpus indexer for the PARA Vault Memory Index.

Indexes markdown, TXT, PDF, EPUB, and DOCX files. Supports:
  --formats      Select file types (default: all)
  --resume       Resume from last checkpoint
  --batch-size   Files per extraction batch (checkpoint interval)

Usage:
    python index_full.py                              # index all formats
    python index_full.py --formats pdf,epub           # only PDFs and EPUBs
    python index_full.py --resume                     # resume interrupted run
    python index_full.py --formats md,txt             # Phase A only
"""

from __future__ import annotations

import argparse
import gc
import glob
import json
import os
import shutil
import sys
import time

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from walker import walk_vault, ALL_EXTENSIONS, DEFAULT_EXTENSIONS
from embedder import (
    encode_chunked,
    build_faiss_index,
    save_index,
    save_metadata,
    save_stats,
    MODEL_NAME,
    MEGA_BATCH_SIZE,
    DEFAULT_BATCH_SIZE,
    EMBEDDING_DIM,
)
from incremental import save_file_mtimes, collect_mtimes
from batch_processor import (
    ErrorAggregator,
    Checkpoint,
    check_memory,
    get_rss_mb,
    process_file,
    save_scanned_log,
)

import faiss
from sentence_transformers import SentenceTransformer

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

_DEFAULT_VAULT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_DEFAULT_OUTPUT = os.path.join(_DEFAULT_VAULT, "_System", "memory")

_FORMAT_MAP = {
    "md": ".md",
    "txt": ".txt",
    "pdf": ".pdf",
    "epub": ".epub",
    "docx": ".docx",
}


def parse_formats(fmt_str: str) -> set[str]:
    """Parse comma-separated format string into extensions set."""
    if fmt_str.lower() == "all":
        return ALL_EXTENSIONS
    exts = set()
    for f in fmt_str.split(","):
        f = f.strip().lower()
        if f in _FORMAT_MAP:
            exts.add(_FORMAT_MAP[f])
        elif f.startswith("."):
            exts.add(f)
    return exts or ALL_EXTENSIONS


# ---------------------------------------------------------------------------
# B-W7-01: Main indexing pipeline
# ---------------------------------------------------------------------------

def index_full(
    vault_path: str,
    output_dir: str,
    model_name: str = MODEL_NAME,
    batch_size: int = DEFAULT_BATCH_SIZE,
    mega_batch: int = MEGA_BATCH_SIZE,
    extensions: set[str] | None = None,
    file_batch: int = 500,
    resume: bool = False,
    external_path: str | None = None,
) -> dict:
    """Run the full multi-format indexing pipeline.

    Parameters
    ----------
    extensions : set[str]
        File extensions to index. None = ALL_EXTENSIONS.
    file_batch : int
        Number of files per extraction batch (checkpoint interval).
    resume : bool
        If True, resume from last checkpoint.
    external_path : str or None
        Optional external path to index alongside the vault.
    """
    if extensions is None:
        extensions = ALL_EXTENSIONS
    os.makedirs(output_dir, exist_ok=True)

    checkpoint = Checkpoint(os.path.join(output_dir, "index_checkpoint.json"))
    errors = ErrorAggregator()
    scanned_pdfs: list[str] = []

    if resume and checkpoint.load():
        print(f"  Resuming from checkpoint: {len(checkpoint.processed_files):,} files already done")
    else:
        checkpoint = Checkpoint(os.path.join(output_dir, "index_checkpoint.json"))

    # ------------------------------------------------------------------
    # Phase 1: Walk vault (and external path)
    # ------------------------------------------------------------------
    print("Phase 1/3: Walking vault...")
    t0 = time.monotonic()

    file_list = list(walk_vault(vault_path, extensions=extensions))
    
    if external_path and os.path.exists(external_path):
        print(f"  Including external path: {external_path}")
        ext_files = list(walk_vault(external_path, extensions=extensions))
        # Tag external files to distinguish them
        file_list.extend([(a, f"EXTERNAL/{r}") for a, r in ext_files])

    total_files = len(file_list)

    # Filter out already-checkpointed files
    if checkpoint.processed_files:
        remaining = [(a, r) for a, r in file_list if not checkpoint.is_done(r)]
        print(f"  Found {total_files:,} files, {len(remaining):,} remaining after checkpoint")
        pending_files = remaining
    else:
        pending_files = file_list
        print(f"  Found {total_files:,} files to process")

    # Extension breakdown
    ext_counts: dict[str, int] = {}
    for _, r in file_list:
        ext = os.path.splitext(r)[1].lower()
        ext_counts[ext] = ext_counts.get(ext, 0) + 1
    for ext, cnt in sorted(ext_counts.items()):
        print(f"    {ext}: {cnt:,}")

    # ------------------------------------------------------------------
    # Phase 2/3: Group by PARA → Streaming extract → encode → save shards
    # ------------------------------------------------------------------
    shards_dir = os.path.join(output_dir, "shards")
    os.makedirs(shards_dir, exist_ok=True)

    # Enhancement #3: Group by PARA and sort alphabetically
    print("\nPhase 2/3: Grouping files by PARA category...")
    grouped_files: dict[str, list[tuple[str, str]]] = {}
    for abs_p, rel_p in pending_files:
        from chunker import infer_para
        para = infer_para(rel_p)
        if para not in grouped_files:
            grouped_files[para] = []
        grouped_files[para].append((abs_p, rel_p))
    
    # Sort groups by PARA order (Projects, Areas, Resources, Archives, System, Root)
    para_order = ["01-Projects", "02-Areas", "03-Resources", "04-Archives", "_System", "Root"]
    sorted_groups = sorted(grouped_files.keys(), 
                           key=lambda x: para_order.index(x) if x in para_order else 99)

    print(f"  Loading model: {model_name}")
    model = SentenceTransformer(model_name)

    files_indexed = 0
    total_chunks = 0
    fmt_chunks: dict[str, int] = {}
    shard_id = 0

    for para_name in sorted_groups:
        files_in_group = sorted(grouped_files[para_name])
        print(f"\n  Processing category: {para_name} ({len(files_in_group):,} files)")
        
        batch_texts: list[str] = []
        batch_meta: list[dict] = []

        for i, (abs_path, rel_path) in enumerate(files_in_group):
            texts, meta = process_file(abs_path, rel_path, vault_path, errors, scanned_pdfs)

            if texts:
                batch_texts.extend(texts)
                batch_meta.extend(meta)
                files_indexed += 1
                for m in meta:
                    fmt = m.get("file_format", "unknown")
                    fmt_chunks[fmt] = fmt_chunks.get(fmt, 0) + 1

            checkpoint.mark(rel_path)

            # Flush shard every file_batch files or at the end of the category
            is_batch_boundary = (i + 1) % file_batch == 0
            is_last_in_group = (i + 1) == len(files_in_group)

            if (is_batch_boundary or is_last_in_group) and batch_texts:
                # --- Encode this batch ---
                batch_embs = encode_chunked(
                    model, batch_texts,
                    mega_batch=mega_batch,
                    batch_size=batch_size,
                )

                # --- Save shard to disk ---
                # Naming: PARA_ID.npy (e.g. Projects_0000.npy)
                para_tag = para_name.replace("/", "_").replace(" ", "_")
                shard_tag = f"{para_tag}_{shard_id:04d}"
                np.save(os.path.join(shards_dir, f"emb_{shard_tag}.npy"), batch_embs)
                with open(os.path.join(shards_dir, f"meta_{shard_tag}.json"), "w") as f:
                    json.dump(batch_meta, f, ensure_ascii=False, separators=(",", ":"))

                shard_chunks = len(batch_texts)
                total_chunks += shard_chunks
                shard_id += 1

                # --- Free batch memory ---
                del batch_texts, batch_meta, batch_embs
                batch_texts = []
                batch_meta = []
                gc.collect()

                # --- Progress ---
                elapsed = time.monotonic() - t0
                print(f"    Shard {shard_id}: [{i+1:,}/{len(files_in_group):,}] "
                      f"{shard_chunks:,} chunks (total {total_chunks:,}) | "
                      f"RSS {get_rss_mb():.0f}MB")

                checkpoint.last_batch = files_indexed
                checkpoint.save()
                check_memory(f"shard {shard_id}")

    t1 = time.monotonic()
    print(f"  Extraction+encoding done: {files_indexed:,} files → {total_chunks:,} chunks "
          f"in {shard_id} shards ({t1 - t0:.1f}s)")
    errors.print_summary()

    # Free model to reclaim ~100 MB before assembly
    del model
    gc.collect()

    if total_chunks == 0:
        print("ERROR: No chunks produced. Aborting.")
        return {}

    # ------------------------------------------------------------------
    # Phase 3/3: Assemble FAISS index from shards
    #
    # Load shards one at a time → add to FAISS + write to embeddings.npy
    # via memmap. Metadata is concatenated from shard JSONs.
    # ------------------------------------------------------------------
    print(f"\nPhase 3/3: Assembling FAISS from {shard_id} shards ({total_chunks:,} chunks)...")
    t2 = time.monotonic()

    faiss_path = os.path.join(output_dir, "vault.faiss")
    meta_path = os.path.join(output_dir, "meta.json")
    stats_path = os.path.join(output_dir, "index_stats.json")
    emb_path = os.path.join(output_dir, "embeddings.npy")
    hashes_path = os.path.join(output_dir, "file_hashes.json")

    # Pre-allocate embeddings.npy as memory-mapped file
    emb_mmap = np.memmap(emb_path, dtype=np.float32, mode="w+",
                         shape=(total_chunks, EMBEDDING_DIM))

    index = faiss.IndexFlatIP(EMBEDDING_DIM)
    all_meta: list[dict] = []
    offset = 0

    shard_emb_files = sorted(glob.glob(os.path.join(shards_dir, "emb_*.npy")))

    for si, emb_file in enumerate(shard_emb_files):
        # Extract the tag (e.g. Projects_0000) from emb_Projects_0000.npy
        fname = os.path.basename(emb_file)
        shard_tag = fname.replace("emb_", "").replace(".npy", "")
        
        embs = np.load(emb_file).astype(np.float32)
        n = embs.shape[0]

        # Add to FAISS
        index.add(embs)

        # Write to memmap
        emb_mmap[offset:offset + n] = embs
        offset += n

        # Load corresponding metadata
        meta_file = os.path.join(shards_dir, f"meta_{shard_tag}.json")
        if os.path.exists(meta_file):
            with open(meta_file, "r") as f:
                shard_meta = json.load(f)
            all_meta.extend(shard_meta)

        del embs
        if (si + 1) % 5 == 0 or si == len(shard_emb_files) - 1:
            print(f"  Assembled shard {si+1}/{len(shard_emb_files)} ({shard_tag}) "
                  f"({offset:,}/{total_chunks:,} chunks, RSS {get_rss_mb():.0f}MB)")

    emb_mmap.flush()
    del emb_mmap

    t3 = time.monotonic()
    print(f"  Assembly done in {t3 - t2:.1f}s")

    # --- Save outputs ---
    print("  Saving FAISS index...")
    save_index(index, faiss_path)
    del index
    gc.collect()

    save_metadata(all_meta, meta_path)

    mtime_map = collect_mtimes(file_list)
    save_file_mtimes(mtime_map, hashes_path)

    if scanned_pdfs:
        scanned_path = os.path.join(output_dir, "scanned_pdfs.txt")
        save_scanned_log(scanned_pdfs, scanned_path)
        print(f"  Scanned PDFs: {len(scanned_pdfs)} (logged to scanned_pdfs.txt)")

    if errors.total > 0:
        err_path = os.path.join(output_dir, "extraction_report.json")
        with open(err_path, "w") as f:
            json.dump(errors.summary(), f, indent=2)

    total_time = time.monotonic() - t0
    chunk_count = total_chunks

    stats = save_stats(
        file_count=files_indexed,
        chunk_count=chunk_count,
        model_name=model_name,
        extra={
            "total_files_walked": total_files,
            "files_skipped": errors.total,
            "scanned_pdfs": len(scanned_pdfs),
            "chunks_by_format": fmt_chunks,
            "extensions": sorted(extensions),
            "total_time_seconds": round(total_time, 1),
            "shards": shard_id,
            "mode": "full_corpus_streaming",
        },
        path=stats_path,
    )

    # Clean up checkpoint + shards on success
    checkpoint.delete()
    shutil.rmtree(shards_dir, ignore_errors=True)

    # --- Summary ---
    faiss_mb = os.path.getsize(faiss_path) / (1024 * 1024)
    meta_mb = os.path.getsize(meta_path) / (1024 * 1024)
    emb_mb = os.path.getsize(emb_path) / (1024 * 1024)

    print(f"\n{'=' * 55}")
    print(f"  Full corpus index complete!")
    print(f"  Files indexed:   {files_indexed:,}")
    print(f"  Chunks:          {chunk_count:,}")
    print(f"  Shards:          {shard_id}")
    print(f"  Errors/skipped:  {errors.total}")
    print(f"  Scanned PDFs:    {len(scanned_pdfs)}")
    for fmt, cnt in sorted(fmt_chunks.items()):
        print(f"    {fmt:6s}: {cnt:,} chunks")
    print(f"  FAISS index:     {faiss_path} ({faiss_mb:.1f} MB)")
    print(f"  Metadata:        {meta_path} ({meta_mb:.1f} MB)")
    print(f"  Embeddings:      {emb_path} ({emb_mb:.1f} MB)")
    print(f"  Total time:      {total_time:.1f}s")
    print(f"{'=' * 55}")

    return stats


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Index full PARA vault corpus (md + txt + pdf + epub + docx)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--vault-path", default=_DEFAULT_VAULT)
    parser.add_argument("--output-dir", default=_DEFAULT_OUTPUT)
    parser.add_argument("--model", default=MODEL_NAME)
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE,
                        help="Encoding batch size for sentence-transformers")
    parser.add_argument("--mega-batch", type=int, default=MEGA_BATCH_SIZE)
    parser.add_argument("--formats", default="all",
                        help="Comma-separated formats: md,txt,pdf,epub,docx or 'all'")
    parser.add_argument("--file-batch", type=int, default=500,
                        help="Files per extraction batch (checkpoint interval)")
    parser.add_argument("--resume", action="store_true",
                        help="Resume from last checkpoint")
    parser.add_argument("--external-path", help="Optional external path to index (Annamaya layer)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    extensions = parse_formats(args.formats)

    print(f"PARA Vault Full Corpus Indexer")
    print(f"  Vault:    {args.vault_path}")
    if args.external_path:
        print(f"  External: {args.external_path}")
    print(f"  Output:   {args.output_dir}")
    print(f"  Model:    {args.model}")
    print(f"  Formats:  {sorted(extensions)}")
    print(f"  Resume:   {args.resume}")
    print()

    stats = index_full(
        vault_path=args.vault_path,
        output_dir=args.output_dir,
        model_name=args.model,
        batch_size=args.batch_size,
        mega_batch=args.mega_batch,
        extensions=extensions,
        file_batch=args.file_batch,
        resume=args.resume,
        external_path=args.external_path,
    )

    if not stats:
        sys.exit(1)


if __name__ == "__main__":
    main()
