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
import hashlib
import json
import os
import re
import shutil
import sys
import time

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from walker import walk_vault, ALL_EXTENSIONS, DEFAULT_EXTENSIONS, prepend_context
from embedder import (
    encode_chunked,
    make_faiss_index,
    save_index,
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
    SUPPORTED_ENCODE_BACKENDS,
    DEFAULT_ENCODE_CPU_WORKERS,
    resolve_model_device,
    start_encoding_backend,
    stop_encoding_backend,
)
from incremental import save_file_mtimes, collect_mtimes
from batch_processor import (
    ErrorAggregator,
    Checkpoint,
    check_memory,
    get_rss_mb,
    save_scanned_log,
)
from distributed_extraction import (
    DistributedExtractionCoordinator,
    SUPPORTED_BACKENDS,
    SUPPORTED_START_METHODS,
    default_worker_count,
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
_DEFAULT_ASSEMBLY_BATCH = 50_000


def _iter_json_array(path: str, chunk_size: int = 2 * 1024 * 1024):
    """Stream records from a top-level JSON array file."""
    decoder = json.JSONDecoder()
    with open(path, "r", encoding="utf-8") as f:
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
                while pos < len(buf) and buf[pos].isspace():
                    pos += 1
                if pos < len(buf) and buf[pos] == ",":
                    pos += 1
                    while pos < len(buf) and buf[pos].isspace():
                        pos += 1
                if pos >= len(buf):
                    break
                if buf[pos] == "]":
                    return
                try:
                    obj, end = decoder.raw_decode(buf, pos)
                except json.JSONDecodeError:
                    break
                yield obj
                pos = end

            if pos > 0:
                buf = buf[pos:]
            if eof:
                tail = buf.strip()
                if tail in ("", "]"):
                    return
                raise ValueError(f"Unexpected trailing content near EOF in {path}")


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


def _fingerprint64(value: str) -> int:
    return int.from_bytes(
        hashlib.blake2b(value.encode("utf-8"), digest_size=8).digest(),
        byteorder="little",
        signed=False,
    )


class ChunkDeduplicator:
    """Global chunk dedupe with the same normalization used in batch_processor."""

    def __init__(self):
        # Use compact 64-bit fingerprints to reduce resident memory overhead.
        self.seen_hashes: set[int] = set()

    def is_duplicate(self, text: str) -> bool:
        normalized = "".join(re.findall(r"\w+", text.lower()))
        if not normalized:
            return True
        digest = _fingerprint64(normalized)
        if digest in self.seen_hashes:
            return True
        self.seen_hashes.add(digest)
        return False


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
    extraction_backend: str = "auto",
    extraction_workers: int | None = None,
    extraction_start_method: str = "auto",
    encode_backend: str = "auto",
    encode_devices: str = "auto",
    encode_cpu_workers: int = DEFAULT_ENCODE_CPU_WORKERS,
    encode_chunk_size: int | None = None,
    assembly_batch: int = _DEFAULT_ASSEMBLY_BATCH,
    index_type: str = DEFAULT_INDEX_TYPE,
    hnsw_m: int = DEFAULT_HNSW_M,
    hnsw_ef_construction: int = DEFAULT_HNSW_EF_CONSTRUCTION,
    hnsw_ef_search: int = DEFAULT_HNSW_EF_SEARCH,
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
    extraction_backend : str
        Extraction backend: auto, serial, process, ray, dask.
    extraction_workers : int or None
        Worker count used by process-style extraction backends.
    extraction_start_method : str
        Multiprocessing start method for process backend.
    encode_backend : str
        Encoding backend: auto, single, multi.
    encode_devices : str
        Comma-separated encoding devices, or auto.
    encode_cpu_workers : int
        CPU worker count used when auto-resolving CPU encoding devices.
    encode_chunk_size : int or None
        Optional sentence-transformers chunk size for multi-process encode.
    assembly_batch : int
        Chunk count per FAISS/memmap add operation during shard assembly.
    index_type : str
        FAISS index type: flatip or hnsw.
    """
    if extensions is None:
        extensions = ALL_EXTENSIONS
    if extraction_workers is None or extraction_workers <= 0:
        extraction_workers = default_worker_count()
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
    files_indexed = 0          # files that yielded chunks
    files_processed = len(checkpoint.processed_files)
    total_chunks = 0
    fmt_chunks: dict[str, int] = {}
    indexed_file_fingerprints: set[int] = set()
    shard_id = 0
    resolved_backend = extraction_backend
    resolved_workers = extraction_workers
    resolved_start_method: str | None = None
    resolved_encode_backend = encode_backend
    resolved_encode_devices: list[str] = []
    encode_backend_note: str | None = None
    extraction_seconds = 0.0
    extraction_files = 0
    extraction_chunks = 0

    if resume and os.path.exists(shards_dir):
        print(f"  Resuming: keeping existing shards in {shards_dir}")
    else:
        if os.path.exists(shards_dir):
            print(f"  Cleaning up old shards in {shards_dir}")
            shutil.rmtree(shards_dir)
        os.makedirs(shards_dir, exist_ok=True)

    existing_shard_emb_files = sorted(glob.glob(os.path.join(shards_dir, "emb_*.npy")))
    existing_shard_meta_files = sorted(glob.glob(os.path.join(shards_dir, "meta_*.json")))
    if resume and existing_shard_emb_files:
        shard_id = len(existing_shard_emb_files)
        for emb_file in existing_shard_emb_files:
            embs_temp = np.load(emb_file, mmap_mode="r")
            total_chunks += embs_temp.shape[0]
            del embs_temp
        print(f"  Found {shard_id:,} existing shards ({total_chunks:,} chunks)")
        # Recover prior chunk-by-format counts from existing shard metadata.
        for mf in existing_shard_meta_files:
            try:
                with open(mf, "r") as f:
                    shard_meta = json.load(f)
                for m in shard_meta:
                    fmt = m.get("file_format", "unknown")
                    fmt_chunks[fmt] = fmt_chunks.get(fmt, 0) + 1
                    p = m.get("path") if isinstance(m, dict) else None
                    if p:
                        indexed_file_fingerprints.add(_fingerprint64(str(p)))
            except Exception:
                continue

    if resume and len(pending_files) == 0 and shard_id > 0:
        print("\nPhase 2/3: Skipping (all files already processed).")
    elif len(pending_files) == 0 and shard_id == 0:
        print("ERROR: No pending files and no shard data found. Aborting.")
        checkpoint.close()
        return {}
    else:
        print("\nPhase 2/3: Grouping files by PARA category...")
        grouped_files: dict[str, list[tuple[str, str]]] = {}
        for abs_p, rel_p in pending_files:
            from chunker import infer_para
            para = infer_para(rel_p)
            grouped_files.setdefault(para, []).append((abs_p, rel_p))

        # Sort groups by PARA order (Projects, Areas, Resources, Archives, System, Root, Annamaya)
        para_order = ["Projects", "Areas", "Resources", "Archives", "System", "Root", "Annamaya"]
        sorted_groups = sorted(
            grouped_files.keys(),
            key=lambda x: para_order.index(x) if x in para_order else 99
        )

        model_device = resolve_model_device(
            devices=encode_devices,
            cpu_workers=encode_cpu_workers,
        )
        print(f"  Loading model: {model_name} (device={model_device})")
        chunk_deduper = ChunkDeduplicator()

        with DistributedExtractionCoordinator(
            backend=extraction_backend,
            workers=extraction_workers,
            start_method=extraction_start_method,
        ) as extractor:
            resolved_backend = extractor.backend
            resolved_workers = extractor.workers
            resolved_start_method = extractor.start_method
            if extractor.backend_note:
                print(f"  Extraction backend note: {extractor.backend_note}")
            if resolved_start_method:
                print(
                    f"  Extraction backend: {resolved_backend} "
                    f"({resolved_workers} workers, start={resolved_start_method})"
                )
            else:
                print(f"  Extraction backend: {resolved_backend} ({resolved_workers} workers)")

            # Initialize extraction workers before loading embedding model.
            extractor.prime()
            model = SentenceTransformer(model_name, device=model_device)
            encode_pool: dict | None = None
            (
                resolved_encode_backend,
                encode_pool,
                resolved_encode_devices,
                encode_backend_note,
            ) = start_encoding_backend(
                model=model,
                backend=encode_backend,
                devices=encode_devices,
                cpu_workers=encode_cpu_workers,
                model_name=model_name,
            )
            if encode_backend_note:
                print(f"  Encode backend note: {encode_backend_note}")
            if resolved_encode_backend == "multi":
                print(
                    f"  Encode backend: {resolved_encode_backend} "
                    f"(devices={','.join(resolved_encode_devices)})"
                )
            elif resolved_encode_backend == "process":
                proc_workers = int((encode_pool or {}).get("workers", encode_cpu_workers))
                print(f"  Encode backend: {resolved_encode_backend} ({proc_workers} workers)")
            else:
                print(f"  Encode backend: {resolved_encode_backend}")

            try:
                for para_name in sorted_groups:
                    files_in_group = sorted(grouped_files[para_name])
                    print(f"\n  Processing category: {para_name} ({len(files_in_group):,} files)")

                    for batch_start in range(0, len(files_in_group), file_batch):
                        batch_files = files_in_group[batch_start:batch_start + file_batch]
                        batch_texts: list[str] = []
                        batch_meta: list[dict] = []
                        batch_processed_rel_paths: list[str] = []

                        extract_t0 = time.monotonic()
                        for result in extractor.iter_extract_batch(batch_files, vault_path=vault_path):
                            extraction_files += 1
                            files_processed += 1
                            batch_processed_rel_paths.append(result.rel_path)

                            for err_type in result.error_types:
                                errors.add(result.rel_path, err_type)
                            scanned_pdfs.extend(result.scanned_pdfs)

                            if not result.meta:
                                continue

                            dedup_texts: list[str] = []
                            dedup_meta: list[dict] = []
                            for meta_item in result.meta:
                                dedupe_source = str(meta_item.get("text", ""))
                                if chunk_deduper.is_duplicate(dedupe_source):
                                    continue
                                dedup_texts.append(
                                    prepend_context(
                                        dedupe_source,
                                        str(meta_item.get("path", result.rel_path)),
                                        meta_item.get("heading"),
                                    )
                                )
                                dedup_meta.append(meta_item)

                            if dedup_texts:
                                batch_texts.extend(dedup_texts)
                                batch_meta.extend(dedup_meta)
                                files_indexed += 1
                                extraction_chunks += len(dedup_texts)
                                for m in dedup_meta:
                                    fmt = m.get("file_format", "unknown")
                                    fmt_chunks[fmt] = fmt_chunks.get(fmt, 0) + 1
                                    p = m.get("path") if isinstance(m, dict) else None
                                    if p:
                                        indexed_file_fingerprints.add(_fingerprint64(str(p)))
                        extraction_seconds += time.monotonic() - extract_t0

                        if batch_texts:
                            # --- Encode this batch ---
                            batch_embs = encode_chunked(
                                model,
                                batch_texts,
                                mega_batch=mega_batch,
                                batch_size=batch_size,
                                pool=encode_pool,
                                chunk_size=encode_chunk_size,
                            )

                            # --- Save shard to disk ---
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
                            gc.collect()

                            # --- Progress ---
                            group_progress = batch_start + len(batch_files)
                            print(
                                f"    Shard {shard_id}: [{group_progress:,}/{len(files_in_group):,}] "
                                f"{shard_chunks:,} chunks (total {total_chunks:,}) | "
                                f"RSS {get_rss_mb():.0f}MB"
                            )
                            check_memory(f"shard {shard_id}")

                        if batch_processed_rel_paths:
                            # Durability ordering: mark checkpoint only after shard persistence
                            # for this batch (or after fully processed no-chunk batch).
                            for rel_path in batch_processed_rel_paths:
                                checkpoint.mark(rel_path)
                            checkpoint.last_batch = files_processed
                            checkpoint.save()
            finally:
                stop_encoding_backend(model, encode_pool)

        if extraction_seconds > 0:
            print(
                "  Extraction throughput: "
                f"{(extraction_files / extraction_seconds):.1f} files/s, "
                f"{(extraction_chunks / extraction_seconds):.1f} chunks/s"
            )

        t1 = time.monotonic()
        print(
            f"  Extraction+encoding done: processed {files_processed:,} files "
            f"({files_indexed:,} yielded chunks) → {total_chunks:,} chunks "
            f"in {shard_id} shards ({t1 - t0:.1f}s)"
        )
        errors.print_summary()

        # Free model to reclaim memory before assembly.
        del model
        gc.collect()

    if total_chunks == 0:
        print("ERROR: No chunks produced. Aborting.")
        checkpoint.close()
        return {}
    # ------------------------------------------------------------------
    # Phase 3/3: Assemble FAISS index from shards
    #
    # Load shards one at a time → add to FAISS + write to embeddings.npy
    # via memmap. Metadata is concatenated from shard JSONs.
    # ------------------------------------------------------------------
    shard_emb_files = sorted(glob.glob(os.path.join(shards_dir, "emb_*.npy")))
    
    # Recalculate total_chunks from shards to ensure consistency
    total_chunks_in_shards = 0
    for emb_file in shard_emb_files:
        embs_temp = np.load(emb_file, mmap_mode='r')
        total_chunks_in_shards += embs_temp.shape[0]
        del embs_temp

    if total_chunks_in_shards != total_chunks:
        print(f"  WARNING: total_chunks mismatch. Recalculated: {total_chunks_in_shards}, Expected: {total_chunks}")
        total_chunks = total_chunks_in_shards

    print(f"\nPhase 3/3: Assembling FAISS from {len(shard_emb_files)} shards ({total_chunks:,} chunks)...")
    t2 = time.monotonic()

    faiss_path = os.path.join(output_dir, "vault.faiss")
    meta_path = os.path.join(output_dir, "meta.json")
    meta_jsonl_path = os.path.join(output_dir, "meta.jsonl")
    meta_offsets_path = os.path.join(output_dir, "meta.offsets.npy")
    stats_path = os.path.join(output_dir, "index_stats.json")
    emb_path = os.path.join(output_dir, "embeddings.npy")
    hashes_path = os.path.join(output_dir, "file_hashes.json")

    # Pre-allocate embeddings.npy as memory-mapped file
    emb_mmap = np.memmap(emb_path, dtype=np.float32, mode="w+",
                         shape=(total_chunks, EMBEDDING_DIM))

    index = make_faiss_index(
        EMBEDDING_DIM,
        index_type=index_type,
        hnsw_m=hnsw_m,
        hnsw_ef_construction=hnsw_ef_construction,
        hnsw_ef_search=hnsw_ef_search,
    )
    offsets_tmp_path = os.path.join(output_dir, "meta.offsets.tmp.raw")
    offsets_mmap = np.memmap(
        offsets_tmp_path,
        dtype=np.int64,
        mode="w+",
        shape=(max(1, total_chunks + 1),),
    )
    offsets_mmap[0] = 0
    meta_records = 0
    first_meta = True
    offset = 0
    byte_offset = 0

    shard_emb_files = sorted(glob.glob(os.path.join(shards_dir, "emb_*.npy")))

    with open(meta_path, "w", encoding="utf-8") as meta_out, open(meta_jsonl_path, "wb") as meta_jsonl_out:
        meta_out.write("[\n")

        for si, emb_file in enumerate(shard_emb_files):
            # Extract the tag (e.g. Projects_0000) from emb_Projects_0000.npy
            fname = os.path.basename(emb_file)
            shard_tag = fname.replace("emb_", "").replace(".npy", "")

            embs = np.load(emb_file, mmap_mode="r")
            n = int(embs.shape[0])

            # Add to FAISS and write embeddings with bounded assembly batches.
            add_step = max(1, int(assembly_batch))
            for start in range(0, n, add_step):
                part = np.asarray(embs[start:start + add_step], dtype=np.float32)
                if part.size == 0:
                    continue
                pn = int(part.shape[0])
                index.add(part)
                emb_mmap[offset:offset + pn] = part
                offset += pn

            # Stream corresponding metadata into meta.json + sidecars.
            meta_file = os.path.join(shards_dir, f"meta_{shard_tag}.json")
            if os.path.exists(meta_file):
                for rec in _iter_json_array(meta_file):
                    rec_json = json.dumps(rec, ensure_ascii=False, separators=(",", ":"))
                    if not first_meta:
                        meta_out.write(",\n")
                    meta_out.write(rec_json)
                    first_meta = False

                    rec_line = (rec_json + "\n").encode("utf-8")
                    meta_jsonl_out.write(rec_line)
                    byte_offset += len(rec_line)
                    meta_records += 1
                    if meta_records >= offsets_mmap.shape[0]:
                        raise RuntimeError(
                            "Metadata record count exceeded preallocated offsets capacity"
                        )
                    offsets_mmap[meta_records] = byte_offset

            del embs
            if (si + 1) % 5 == 0 or si == len(shard_emb_files) - 1:
                print(f"  Assembled shard {si+1}/{len(shard_emb_files)} ({shard_tag}) "
                      f"({offset:,}/{total_chunks:,} chunks, RSS {get_rss_mb():.0f}MB)")

        meta_out.write("\n]\n")

    emb_mmap.flush()
    del emb_mmap
    offsets_mmap.flush()
    valid_offsets = np.asarray(offsets_mmap[:meta_records + 1], dtype=np.int64)
    del offsets_mmap
    np.save(meta_offsets_path, valid_offsets)
    try:
        os.unlink(offsets_tmp_path)
    except OSError:
        pass

    t3 = time.monotonic()
    print(f"  Assembly done in {t3 - t2:.1f}s")

    # --- Save outputs ---
    print("  Saving FAISS index...")
    save_index(index, faiss_path)
    del index
    gc.collect()

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
    files_in_index = len(indexed_file_fingerprints)
    if meta_records != chunk_count:
        print(
            f"  WARNING: metadata/chunk mismatch after assembly "
            f"(meta={meta_records:,}, chunks={chunk_count:,})"
        )

    stats = save_stats(
        file_count=files_in_index,
        chunk_count=chunk_count,
        model_name=model_name,
        extra={
            "total_files_walked": total_files,
            "files_skipped": errors.total,
            "scanned_pdfs": len(scanned_pdfs),
            "chunks_by_format": fmt_chunks,
            "extensions": sorted(extensions),
            "total_time_seconds": round(total_time, 1),
            "extraction_time_seconds": round(extraction_seconds, 3),
            "extraction_files_per_second": round(extraction_files / extraction_seconds, 3) if extraction_seconds > 0 else 0.0,
            "extraction_chunks_per_second": round(extraction_chunks / extraction_seconds, 3) if extraction_seconds > 0 else 0.0,
            "extraction_backend": resolved_backend,
            "extraction_workers": resolved_workers,
            "extraction_start_method": resolved_start_method if resolved_backend == "process" else None,
            "encoding_backend": resolved_encode_backend,
            "encoding_devices": resolved_encode_devices,
            "encoding_model_device": model_device if "model_device" in locals() else "cpu",
            "assembly_batch": max(1, int(assembly_batch)),
            "index_type": (index_type or DEFAULT_INDEX_TYPE).lower(),
            "hnsw_m": int(max(8, hnsw_m)) if (index_type or "").lower() == "hnsw" else None,
            "hnsw_ef_construction": int(max(max(8, hnsw_m), hnsw_ef_construction)) if (index_type or "").lower() == "hnsw" else None,
            "hnsw_ef_search": int(max(1, hnsw_ef_search)) if (index_type or "").lower() == "hnsw" else None,
            "metadata_sidecar": True,
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
    print(f"  Files indexed:   {files_in_index:,}")
    print(f"  Chunks:          {chunk_count:,}")
    print(f"  Shards:          {shard_id}")
    print(f"  Errors/skipped:  {errors.total}")
    print(f"  Scanned PDFs:    {len(scanned_pdfs)}")
    for fmt, cnt in sorted(fmt_chunks.items()):
        print(f"    {fmt:6s}: {cnt:,} chunks")
    print(f"  FAISS index:     {faiss_path} ({faiss_mb:.1f} MB)")
    print(f"  Metadata:        {meta_path} ({meta_mb:.1f} MB)")
    print(f"  Embeddings:      {emb_path} ({emb_mb:.1f} MB)")
    idx_desc = (index_type or DEFAULT_INDEX_TYPE).lower()
    if idx_desc == "hnsw":
        idx_desc += (
            f" (m={max(8, int(hnsw_m))}, "
            f"efC={max(max(8, int(hnsw_m)), int(hnsw_ef_construction))}, "
            f"efS={max(1, int(hnsw_ef_search))})"
        )
    print(f"  Index type:      {idx_desc}")
    extra_extract = f"{resolved_backend} ({resolved_workers} workers)"
    if resolved_backend == "process" and resolved_start_method:
        extra_extract += f", start={resolved_start_method}"
    extra_encode = resolved_encode_backend
    if resolved_encode_backend == "multi" and resolved_encode_devices:
        extra_encode += f" ({','.join(resolved_encode_devices)})"
    print(f"  Extraction:      {extra_extract}")
    print(f"  Encoding:        {extra_encode}")
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
    parser.add_argument(
        "--extract-backend",
        default="auto",
        choices=sorted(SUPPORTED_BACKENDS),
        help="Extraction backend: auto, serial, process, ray, dask",
    )
    parser.add_argument(
        "--extract-workers",
        type=int,
        default=default_worker_count(),
        help="Worker count for process-style extraction backends",
    )
    parser.add_argument(
        "--extract-start-method",
        default="auto",
        choices=sorted(SUPPORTED_START_METHODS),
        help="Multiprocessing start method for process backend",
    )
    parser.add_argument(
        "--encode-backend",
        default="auto",
        choices=sorted(SUPPORTED_ENCODE_BACKENDS),
        help="Encoding backend: auto, single, multi",
    )
    parser.add_argument(
        "--encode-devices",
        default="auto",
        help="Comma-separated encoding devices (e.g. cuda:0,cuda:1 or cpu,cpu), or auto",
    )
    parser.add_argument(
        "--encode-cpu-workers",
        type=int,
        default=DEFAULT_ENCODE_CPU_WORKERS,
        help="CPU worker count when encode devices are auto-resolved to CPU",
    )
    parser.add_argument(
        "--encode-chunk-size",
        type=int,
        default=0,
        help="Optional sentence-transformers chunk_size for multi-process encoding (0 disables)",
    )
    parser.add_argument(
        "--assembly-batch",
        type=int,
        default=_DEFAULT_ASSEMBLY_BATCH,
        help="Chunk add batch size used during shard assembly (FAISS + embeddings memmap writes)",
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
    print(
        "  Extract:  "
        f"{args.extract_backend} ({args.extract_workers} workers, start={args.extract_start_method})"
    )
    print(
        "  Encode:   "
        f"{args.encode_backend} (devices={args.encode_devices}, cpu_workers={args.encode_cpu_workers}, "
        f"chunk_size={args.encode_chunk_size if args.encode_chunk_size > 0 else 'auto'})"
    )
    print(f"  Assemble: batch={max(1, int(args.assembly_batch))}")
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
        extraction_backend=args.extract_backend,
        extraction_workers=args.extract_workers,
        extraction_start_method=args.extract_start_method,
        encode_backend=args.encode_backend,
        encode_devices=args.encode_devices,
        encode_cpu_workers=args.encode_cpu_workers,
        encode_chunk_size=args.encode_chunk_size if args.encode_chunk_size > 0 else None,
        assembly_batch=max(1, int(args.assembly_batch)),
        index_type=(args.index_type or DEFAULT_INDEX_TYPE).lower(),
        hnsw_m=max(8, int(args.hnsw_m)),
        hnsw_ef_construction=max(max(8, int(args.hnsw_m)), int(args.hnsw_ef_construction)),
        hnsw_ef_search=max(1, int(args.hnsw_ef_search)),
    )

    if not stats:
        sys.exit(1)


if __name__ == "__main__":
    main()
