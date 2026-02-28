#!/usr/bin/env python3
"""
update_index.py — Incremental updater for the PARA Vault Memory Index.

Detects new, modified, and deleted files since the last index build.
Re-chunks and re-embeds only changed files, then merges with the
existing index.  Use ``--full-rebuild`` to force a complete re-index.

Usage:
    python update_index.py                      # incremental
    python update_index.py --full-rebuild       # full re-index
    python update_index.py --vault-path /path
"""

from __future__ import annotations

import argparse
import os
import sys
import time

# Ensure this script can import sibling modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chunker import chunk_markdown, chunk_txt, extract_frontmatter
from walker import walk_vault, safe_read, is_noisy, prepend_context, build_meta, ProgressTracker, ALL_EXTENSIONS
from embedder import (
    encode_chunked,
    build_faiss_index,
    save_index,
    load_index,
    save_metadata,
    load_metadata,
    save_stats,
    MODEL_NAME,
    MEGA_BATCH_SIZE,
    DEFAULT_BATCH_SIZE,
    EMBEDDING_DIM,
    SUPPORTED_INDEX_TYPES,
    DEFAULT_INDEX_TYPE,
    DEFAULT_HNSW_M,
    DEFAULT_HNSW_EF_CONSTRUCTION,
    DEFAULT_HNSW_EF_SEARCH,
)
from incremental import (
    save_file_mtimes,
    load_file_mtimes,
    collect_mtimes,
    diff_files,
    save_embeddings,
    load_embeddings,
    merge_index,
    compact_incremental_index,
    iter_meta_records,
)
from batch_processor import ErrorAggregator, process_file

from sentence_transformers import SentenceTransformer


# ---------------------------------------------------------------------------
# Simple SkipLogger
# ---------------------------------------------------------------------------

class SkipLogger:
    def __init__(self, path: str):
        self.path = path
        self.file = open(path, "w")
        self.count = 0

    def log(self, rel_path: str, reason: str) -> None:
        self.file.write(f"{rel_path}: {reason}\n")
        self.count += 1

    def close(self) -> None:
        self.file.close()


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
# A-W7-03: Selective re-chunking for changed files
# ---------------------------------------------------------------------------

def rechunk_files(
    vault_path: str,
    rel_paths: list[str],
    skip_log: SkipLogger,
    extensions: set[str] | None = None,
) -> tuple[list[str], list[dict]]:
    """Chunk a specific set of files and return texts + metadata."""
    all_texts: list[str] = []
    all_meta: list[dict] = []

    errors = ErrorAggregator()
    scanned_pdfs: list[str] = []

    for rel_path in rel_paths:
        abs_path = os.path.join(vault_path, rel_path)
        texts, meta = process_file(abs_path, rel_path, vault_path, errors, scanned_pdfs)
        
        if not texts:
            skip_log.log(rel_path, "skipped_or_error")
            continue
            
        all_texts.extend(texts)
        all_meta.extend(meta)

    return all_texts, all_meta


# ---------------------------------------------------------------------------
# A-W7-06: Full rebuild pipeline (reuses index_vault logic)
# ---------------------------------------------------------------------------

def full_rebuild(
    vault_path: str,
    output_dir: str,
    model_name: str,
    batch_size: int,
    mega_batch: int,
    extensions: set[str] | None = None,
    index_type: str = DEFAULT_INDEX_TYPE,
    hnsw_m: int = DEFAULT_HNSW_M,
    hnsw_ef_construction: int = DEFAULT_HNSW_EF_CONSTRUCTION,
    hnsw_ef_search: int = DEFAULT_HNSW_EF_SEARCH,
) -> dict:
    """Run a complete re-index (same as index_vault but saves embeddings + mtimes)."""
    os.makedirs(output_dir, exist_ok=True)
    
    errors = ErrorAggregator()
    scanned_pdfs: list[str] = []

    # Phase 1: Walk + Chunk
    print("Phase 1/3: Walking vault and chunking files...")
    t0 = time.monotonic()

    if extensions is None:
        extensions = ALL_EXTENSIONS
    file_list = list(walk_vault(vault_path, extensions=extensions))
    total_files = len(file_list)
    print(f"  Found {total_files:,} files to process")

    tracker = ProgressTracker(total=total_files, every=500)

    all_texts: list[str] = []
    all_meta: list[dict] = []
    files_indexed = 0

    for idx, (abs_path, rel_path) in enumerate(file_list):
        texts, meta = process_file(abs_path, rel_path, vault_path, errors, scanned_pdfs)
        
        if texts:
            all_texts.extend(texts)
            all_meta.extend(meta)
            files_indexed += 1
            
        tracker.update(idx + 1)

    tracker.finish()

    chunk_count = len(all_texts)
    t1 = time.monotonic()
    print(f"  Chunking done: {files_indexed:,} files → {chunk_count:,} chunks "
          f"({errors.total} errors/skipped) in {t1 - t0:.1f}s")

    if chunk_count == 0:
        print("ERROR: No chunks produced. Aborting.")
        return {}

    # Phase 2: Encode
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

    # Phase 3: Build FAISS index and write all outputs
    print("Phase 3/3: Building FAISS index and saving...")

    index = build_faiss_index(
        embeddings,
        index_type=index_type,
        hnsw_m=hnsw_m,
        hnsw_ef_construction=hnsw_ef_construction,
        hnsw_ef_search=hnsw_ef_search,
    )

    faiss_path = os.path.join(output_dir, "vault.faiss")
    meta_path = os.path.join(output_dir, "meta.json")
    stats_path = os.path.join(output_dir, "index_stats.json")
    emb_path = os.path.join(output_dir, "embeddings.npy")
    hashes_path = os.path.join(output_dir, "file_hashes.json")

    save_index(index, faiss_path)
    save_metadata(all_meta, meta_path)
    save_embeddings(embeddings, emb_path)

    # Save mtime snapshot for future incremental updates
    mtime_map = collect_mtimes(file_list)
    save_file_mtimes(mtime_map, hashes_path)

    if scanned_pdfs:
        from batch_processor import save_scanned_log
        save_scanned_log(scanned_pdfs, os.path.join(output_dir, "scanned_pdfs.txt"))

    total_time = time.monotonic() - t0
    stats = save_stats(
        file_count=files_indexed,
        chunk_count=chunk_count,
        model_name=model_name,
        extra={
            "total_files_walked": total_files,
            "files_skipped": errors.total,
            "total_time_seconds": round(total_time, 1),
            "index_type": (index_type or DEFAULT_INDEX_TYPE).lower(),
            "hnsw_m": int(max(8, hnsw_m)) if (index_type or "").lower() == "hnsw" else None,
            "hnsw_ef_construction": int(max(max(8, hnsw_m), hnsw_ef_construction)) if (index_type or "").lower() == "hnsw" else None,
            "hnsw_ef_search": int(max(1, hnsw_ef_search)) if (index_type or "").lower() == "hnsw" else None,
            "mode": "full_rebuild",
        },
        path=stats_path,
    )

    _print_summary(
        files_indexed, chunk_count, errors.total,
        faiss_path, meta_path, emb_path, output_dir, total_time,
    )
    return stats


# ---------------------------------------------------------------------------
# A-W7-06: Incremental update pipeline
# ---------------------------------------------------------------------------

def incremental_update(
    vault_path: str,
    output_dir: str,
    model_name: str,
    batch_size: int,
    mega_batch: int,
    extensions: set[str] | None = None,
    use_compaction: bool = False,
    compaction_batch: int = 50_000,
    index_type: str = DEFAULT_INDEX_TYPE,
    hnsw_m: int = DEFAULT_HNSW_M,
    hnsw_ef_construction: int = DEFAULT_HNSW_EF_CONSTRUCTION,
    hnsw_ef_search: int = DEFAULT_HNSW_EF_SEARCH,
) -> dict:
    """Run an incremental update: detect changes, re-embed only diffs."""
    t0 = time.monotonic()

    hashes_path = os.path.join(output_dir, "file_hashes.json")
    emb_path = os.path.join(output_dir, "embeddings.npy")
    meta_path = os.path.join(output_dir, "meta.json")

    # Check prerequisites
    for required, label in [
        (hashes_path, "file_hashes.json"),
        (emb_path, "embeddings.npy"),
        (meta_path, "meta.json"),
    ]:
        if not os.path.exists(required):
            print(f"Missing {label} — cannot do incremental update.")
            print("Run with --full-rebuild first.")
            return {}

    # Step 1: Walk vault and collect current mtimes
    print("Step 1/5: Walking vault...")
    if extensions is None:
        extensions = ALL_EXTENSIONS
    file_list = list(walk_vault(vault_path, extensions=extensions))
    current_map = collect_mtimes(file_list)
    print(f"  Found {len(file_list):,} files")

    # Step 2: Diff against previous snapshot
    print("Step 2/5: Detecting changes...")
    old_map = load_file_mtimes(hashes_path)
    new_files, modified_files, deleted_files = diff_files(old_map, current_map)

    n_new = len(new_files)
    n_mod = len(modified_files)
    n_del = len(deleted_files)
    total_changed = n_new + n_mod + n_del

    print(f"  New: {n_new}  Modified: {n_mod}  Deleted: {n_del}")

    if total_changed == 0:
        print("No changes detected. Index is up to date.")
        return {"changes": 0, "mode": "incremental_noop"}

    # Step 3: Re-chunk changed files
    print(f"Step 3/5: Re-chunking {n_new + n_mod} changed files...")
    skip_log = SkipLogger(os.path.join(output_dir, "skipped.log"))
    changed_rel_paths = new_files + modified_files
    new_texts, new_meta = rechunk_files(vault_path, changed_rel_paths, skip_log, extensions=extensions)
    skip_log.close()
    print(f"  Produced {len(new_texts):,} chunks from {n_new + n_mod} files "
          f"({skip_log.count} skipped)")

    # Step 4: Encode new chunks
    new_embeddings = None
    if new_texts:
        print(f"Step 4/5: Encoding {len(new_texts):,} new chunks...")
        t_enc = time.monotonic()
        model = SentenceTransformer(model_name)

        def embed_progress(done, total):
            pct = done / total * 100
            print(f"  Encoded {done:,}/{total:,} ({pct:.1f}%)", file=sys.stderr)

        new_embeddings = encode_chunked(
            model, new_texts,
            mega_batch=mega_batch,
            batch_size=batch_size,
            progress_cb=embed_progress,
        )
        t_enc_done = time.monotonic()
        print(f"  Encoding done in {t_enc_done - t_enc:.1f}s")
    else:
        print("Step 4/5: No new chunks to encode (only deletions).")
        import numpy as np
        new_embeddings = np.empty((0, EMBEDDING_DIM), dtype=np.float32)

    # Step 5: Merge with existing index
    print("Step 5/5: Merging index...")
    faiss_path = os.path.join(output_dir, "vault.faiss")
    stats_path = os.path.join(output_dir, "index_stats.json")
    # All paths that changed (new + modified + deleted) need their old chunks removed
    all_changed_paths = set(new_files + modified_files + deleted_files)

    if use_compaction:
        compact_summary = compact_incremental_index(
            old_embeddings_path=emb_path,
            old_meta_path=meta_path,
            new_embeddings=new_embeddings,
            new_meta=new_meta,
            changed_paths=all_changed_paths,
            output_dir=output_dir,
            batch_size=max(1, int(compaction_batch)),
            embedding_dim=EMBEDDING_DIM,
            index_type=index_type,
            hnsw_m=hnsw_m,
            hnsw_ef_construction=hnsw_ef_construction,
            hnsw_ef_search=hnsw_ef_search,
        )
        merged_chunk_count = int(compact_summary["merged_total"])
        files_in_index = len(
            {
                str(rec.get("path"))
                for rec in iter_meta_records(meta_path)
                if isinstance(rec, dict) and rec.get("path")
            }
        )
    else:
        old_embeddings = load_embeddings(emb_path)
        old_meta = load_metadata(meta_path)
        merged_emb, merged_meta = merge_index(
            old_embeddings, old_meta,
            new_embeddings, new_meta,
            all_changed_paths,
        )

        # Rebuild FAISS and save everything
        index = build_faiss_index(
            merged_emb,
            index_type=index_type,
            hnsw_m=hnsw_m,
            hnsw_ef_construction=hnsw_ef_construction,
            hnsw_ef_search=hnsw_ef_search,
        )
        save_index(index, faiss_path)
        save_metadata(merged_meta, meta_path)
        save_embeddings(merged_emb, emb_path)
        files_in_index = len({m["path"] for m in merged_meta})
        merged_chunk_count = len(merged_meta)

    save_file_mtimes(current_map, hashes_path)

    total_time = time.monotonic() - t0
    stats = save_stats(
        file_count=files_in_index,
        chunk_count=merged_chunk_count,
        model_name=model_name,
        extra={
            "total_files_walked": len(file_list),
            "files_new": n_new,
            "files_modified": n_mod,
            "files_deleted": n_del,
            "chunks_reembedded": len(new_texts),
            "incremental_compaction": bool(use_compaction),
            "compaction_batch": int(max(1, compaction_batch)),
            "index_type": (index_type or DEFAULT_INDEX_TYPE).lower(),
            "hnsw_m": int(max(8, hnsw_m)) if (index_type or "").lower() == "hnsw" else None,
            "hnsw_ef_construction": int(max(max(8, hnsw_m), hnsw_ef_construction)) if (index_type or "").lower() == "hnsw" else None,
            "hnsw_ef_search": int(max(1, hnsw_ef_search)) if (index_type or "").lower() == "hnsw" else None,
            "total_time_seconds": round(total_time, 1),
            "mode": "incremental",
        },
        path=stats_path,
    )

    _print_summary(
        files_in_index, merged_chunk_count, skip_log.count,
        faiss_path, meta_path, emb_path, output_dir, total_time,
        extra_lines=[
            f"  Files new:      {n_new}",
            f"  Files modified: {n_mod}",
            f"  Files deleted:  {n_del}",
            f"  Chunks re-embedded: {len(new_texts):,}",
            f"  Index type: {(index_type or DEFAULT_INDEX_TYPE).lower()}",
            f"  Compaction mode: {'streaming' if use_compaction else 'classic'}",
        ],
    )
    return stats


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _print_summary(
    files: int,
    chunks: int,
    skipped: int,
    faiss_path: str,
    meta_path: str,
    emb_path: str,
    output_dir: str,
    total_time: float,
    extra_lines: list[str] | None = None,
) -> None:
    faiss_mb = os.path.getsize(faiss_path) / (1024 * 1024)
    meta_mb = os.path.getsize(meta_path) / (1024 * 1024)
    emb_mb = os.path.getsize(emb_path) / (1024 * 1024)

    print(f"\n{'=' * 50}")
    print(f"  Update complete!")
    print(f"  Files in index: {files:,}")
    print(f"  Chunks:         {chunks:,}")
    print(f"  Skipped:        {skipped}")
    if extra_lines:
        for line in extra_lines:
            print(line)
    print(f"  FAISS index:    {faiss_path} ({faiss_mb:.1f} MB)")
    print(f"  Metadata:       {meta_path} ({meta_mb:.1f} MB)")
    print(f"  Embeddings:     {emb_path} ({emb_mb:.1f} MB)")
    print(f"  Total time:     {total_time:.1f}s")
    print(f"{'=' * 50}")


# ---------------------------------------------------------------------------
# A-W7-06 + A-W7-07: CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Incrementally update the PARA vault semantic index",
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
        help="Directory for index output files",
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
        help="Encoding batch size",
    )
    parser.add_argument(
        "--mega-batch",
        type=int,
        default=MEGA_BATCH_SIZE,
        help="Chunks per mega-batch",
    )
    parser.add_argument(
        "--full-rebuild",
        action="store_true",
        help="Force complete re-index (ignore mtime state)",
    )
    parser.add_argument(
        "--formats",
        default="all",
        help="Comma-separated formats: md,txt,pdf,epub,docx or all",
    )
    parser.add_argument(
        "--index-type",
        default=DEFAULT_INDEX_TYPE,
        choices=sorted(SUPPORTED_INDEX_TYPES),
        help="FAISS index type: flatip or hnsw",
    )
    parser.add_argument(
        "--hnsw-m",
        type=int,
        default=DEFAULT_HNSW_M,
        help="HNSW graph M parameter (used when --index-type=hnsw)",
    )
    parser.add_argument(
        "--hnsw-ef-construction",
        type=int,
        default=DEFAULT_HNSW_EF_CONSTRUCTION,
        help="HNSW efConstruction parameter (used when --index-type=hnsw)",
    )
    parser.add_argument(
        "--hnsw-ef-search",
        type=int,
        default=DEFAULT_HNSW_EF_SEARCH,
        help="HNSW efSearch parameter baked into built index (used when --index-type=hnsw)",
    )
    parser.add_argument(
        "--incremental-compaction",
        action="store_true",
        help="Use streaming compaction path for incremental updates (memory-safe on large indexes)",
    )
    parser.add_argument(
        "--compaction-batch",
        type=int,
        default=50_000,
        help="Batch size for FAISS add during streaming compaction",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    mode = "FULL REBUILD" if args.full_rebuild else "INCREMENTAL"
    print(f"PARA Vault Index Updater ({mode})")
    print(f"  Vault:    {args.vault_path}")
    print(f"  Output:   {args.output_dir}")
    print(f"  Model:    {args.model}")
    print(f"  Batch:    {args.batch_size}")
    if (args.index_type or DEFAULT_INDEX_TYPE).lower() == "hnsw":
        print(
            "  Index:    "
            f"hnsw (m={max(8, int(args.hnsw_m))}, "
            f"efC={max(max(8, int(args.hnsw_m)), int(args.hnsw_ef_construction))}, "
            f"efS={max(1, int(args.hnsw_ef_search))})"
        )
    else:
        print("  Index:    flatip")
    print()

    extensions = parse_formats(args.formats)

    if args.full_rebuild:
        stats = full_rebuild(
            vault_path=args.vault_path,
            output_dir=args.output_dir,
            model_name=args.model,
            batch_size=args.batch_size,
            mega_batch=args.mega_batch,
            extensions=extensions,
            index_type=(args.index_type or DEFAULT_INDEX_TYPE).lower(),
            hnsw_m=max(8, int(args.hnsw_m)),
            hnsw_ef_construction=max(max(8, int(args.hnsw_m)), int(args.hnsw_ef_construction)),
            hnsw_ef_search=max(1, int(args.hnsw_ef_search)),
        )
    else:
        stats = incremental_update(
            vault_path=args.vault_path,
            output_dir=args.output_dir,
            model_name=args.model,
            batch_size=args.batch_size,
            mega_batch=args.mega_batch,
            extensions=extensions,
            use_compaction=args.incremental_compaction,
            compaction_batch=max(1, int(args.compaction_batch)),
            index_type=(args.index_type or DEFAULT_INDEX_TYPE).lower(),
            hnsw_m=max(8, int(args.hnsw_m)),
            hnsw_ef_construction=max(max(8, int(args.hnsw_m)), int(args.hnsw_ef_construction)),
            hnsw_ef_search=max(1, int(args.hnsw_ef_search)),
        )

    if not stats:
        sys.exit(1)


if __name__ == "__main__":
    main()
