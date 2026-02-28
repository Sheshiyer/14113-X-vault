"""
incremental.py — Incremental update utilities for the PARA Vault Memory Index.

Provides mtime snapshot tracking, file change detection, embedding cache
persistence, and index merging for efficient incremental re-indexing.

Functions:
    save_file_mtimes(file_map, path)     → write file_hashes.json
    load_file_mtimes(path)               → dict[rel_path, mtime_float]
    diff_files(old_map, current_walk)    → (new, modified, deleted)
    save_embeddings(embeddings, path)    → write embeddings.npy
    load_embeddings(path)                → np.ndarray
    merge_index(old_embs, old_meta, new_embs, new_meta, deleted_paths)
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from collections.abc import Iterator

import faiss
import numpy as np


# ---------------------------------------------------------------------------
# A-W7-01: mtime snapshot writer / loader
# ---------------------------------------------------------------------------

def save_file_mtimes(
    file_map: dict[str, float],
    path: str | Path,
) -> None:
    """Write a mapping of relative_path → mtime_float to JSON.

    Parameters
    ----------
    file_map : dict[str, float]
        Mapping of vault-relative file paths to their last-modified time
        (as returned by ``os.path.getmtime``).
    path : str or Path
        Destination JSON file (e.g. ``_System/memory/file_hashes.json``).
    """
    with open(str(path), "w", encoding="utf-8") as f:
        json.dump(file_map, f, ensure_ascii=False, indent=None, separators=(",", ":"))


def load_file_mtimes(path: str | Path) -> dict[str, float]:
    """Load a previously saved mtime snapshot from JSON.

    Returns an empty dict if the file does not exist.
    """
    p = str(path)
    if not os.path.exists(p):
        return {}
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def collect_mtimes(
    file_list: list[tuple[str, str]],
) -> dict[str, float]:
    """Build a rel_path → mtime map from walk results.

    Parameters
    ----------
    file_list : list of (abs_path, rel_path)
        As yielded by ``walk_vault()``.
    """
    result: dict[str, float] = {}
    for abs_path, rel_path in file_list:
        try:
            result[rel_path] = os.path.getmtime(abs_path)
        except OSError:
            pass
    return result


# ---------------------------------------------------------------------------
# A-W7-02: mtime diff detector
# ---------------------------------------------------------------------------

def diff_files(
    old_map: dict[str, float],
    current_map: dict[str, float],
) -> tuple[list[str], list[str], list[str]]:
    """Compare old and current mtime snapshots to detect changes.

    Parameters
    ----------
    old_map : dict[str, float]
        Previous mtime snapshot (from ``file_hashes.json``).
    current_map : dict[str, float]
        Current mtime snapshot (from ``collect_mtimes()``).

    Returns
    -------
    (new, modified, deleted) : tuple of lists of relative paths
        - new: paths in current but not in old
        - modified: paths in both but with different mtime
        - deleted: paths in old but not in current
    """
    old_keys = set(old_map)
    cur_keys = set(current_map)

    new_files = sorted(cur_keys - old_keys)
    deleted_files = sorted(old_keys - cur_keys)

    modified_files = sorted(
        p for p in (cur_keys & old_keys)
        if current_map[p] != old_map[p]
    )

    return new_files, modified_files, deleted_files


# ---------------------------------------------------------------------------
# A-W7-05: Embedding cache (save / load raw numpy)
# ---------------------------------------------------------------------------

def save_embeddings(embeddings: np.ndarray, path: str | Path) -> None:
    """Save the raw embedding matrix as a .npy file.

    Parameters
    ----------
    embeddings : np.ndarray
        Float32 array of shape ``(N, dim)``.
    path : str or Path
        Destination file (e.g. ``_System/memory/embeddings.npy``).
    """
    np.save(str(path), embeddings)


def load_embeddings(
    path: str | Path,
    *,
    embedding_dim: int = 384,
    expected_rows: int | None = None,
) -> np.ndarray:
    """Load embeddings from ``.npy`` or raw float32 memmap fallback.

    Some historical index builds wrote ``embeddings.npy`` using plain memmap
    (raw float32 bytes, no NumPy header). This loader supports both formats.
    """
    p = str(path)
    try:
        arr = np.load(p, mmap_mode="r")
        if arr.dtype != np.float32:
            arr = arr.astype(np.float32)
        return arr
    except Exception:
        file_size = os.path.getsize(p)
        row_width = int(embedding_dim) * 4
        if expected_rows is not None:
            expected_size = int(expected_rows) * row_width
            if file_size != expected_size:
                raise ValueError(
                    f"Raw embeddings size mismatch: bytes={file_size}, "
                    f"expected={expected_size} for rows={expected_rows}, dim={embedding_dim}"
                )
            rows = int(expected_rows)
        else:
            if file_size % row_width != 0:
                raise ValueError(
                    f"Cannot infer raw embedding rows from {p}: "
                    f"bytes={file_size}, dim={embedding_dim}"
                )
            rows = file_size // row_width
        return np.memmap(p, dtype=np.float32, mode="r", shape=(rows, int(embedding_dim)))


# ---------------------------------------------------------------------------
# A-W7-04: Index merge (old unchanged + new, excluding deleted)
# ---------------------------------------------------------------------------

def merge_index(
    old_embeddings: np.ndarray,
    old_meta: list[dict],
    new_embeddings: np.ndarray,
    new_meta: list[dict],
    changed_paths: set[str],
) -> tuple[np.ndarray, list[dict]]:
    """Merge old index data with new chunks, excluding changed/deleted files.

    Parameters
    ----------
    old_embeddings : np.ndarray
        Embedding matrix from the previous index, shape ``(N_old, dim)``.
    old_meta : list[dict]
        Metadata records aligned with *old_embeddings*.
    new_embeddings : np.ndarray
        Embeddings for newly chunked files (new + modified), shape ``(N_new, dim)``.
    new_meta : list[dict]
        Metadata records for the new chunks.
    changed_paths : set[str]
        Set of relative paths that were new, modified, or deleted.
        All old chunks from these paths are excluded before merging.

    Returns
    -------
    (merged_embeddings, merged_meta) : tuple
        Combined embeddings array and metadata list, ready for FAISS indexing.
    """
    # Filter out old chunks whose file was changed or deleted
    keep_mask = np.array(
        [m["path"] not in changed_paths for m in old_meta],
        dtype=bool,
    )

    kept_embeddings = old_embeddings[keep_mask]
    kept_meta = [m for m, keep in zip(old_meta, keep_mask) if keep]

    # Concatenate kept old + new
    if new_embeddings.size > 0:
        merged_emb = np.vstack([kept_embeddings, new_embeddings])
        merged_meta = kept_meta + new_meta
    else:
        merged_emb = kept_embeddings
        merged_meta = kept_meta

    return merged_emb, merged_meta


# ---------------------------------------------------------------------------
# P4-S1-39: Streaming incremental compaction for large indexes
# ---------------------------------------------------------------------------

def _iter_json_array(path: str | Path, chunk_size: int = 2 * 1024 * 1024):
    """Stream records from a top-level JSON array file."""
    decoder = json.JSONDecoder()
    with open(str(path), "r", encoding="utf-8") as f:
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


def iter_meta_records(meta_path: str | Path) -> Iterator[dict]:
    """Yield metadata records preferring JSONL sidecar when available."""
    p = str(meta_path)
    stem, _ = os.path.splitext(p)
    jsonl_path = f"{stem}.jsonl"
    if os.path.exists(jsonl_path):
        with open(jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                yield json.loads(line)
        return
    yield from _iter_json_array(p)


def compact_incremental_index(
    old_embeddings_path: str | Path,
    old_meta_path: str | Path,
    new_embeddings: np.ndarray,
    new_meta: list[dict],
    changed_paths: set[str],
    output_dir: str | Path,
    *,
    batch_size: int = 50_000,
    embedding_dim: int = 384,
    index_type: str = "flatip",
    hnsw_m: int = 32,
    hnsw_ef_construction: int = 200,
    hnsw_ef_search: int = 64,
) -> dict[str, int]:
    """Stream-compact old+new records and rebuild index without full in-memory merge."""
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Pass 1: count kept old records.
    old_total = 0
    kept_old = 0
    for rec in iter_meta_records(old_meta_path):
        old_total += 1
        rec_path = rec.get("path") if isinstance(rec, dict) else None
        if rec_path not in changed_paths:
            kept_old += 1

    if int(new_embeddings.shape[0]) != len(new_meta):
        raise ValueError(
            f"New embeddings/metadata mismatch "
            f"(emb={new_embeddings.shape[0]}, meta={len(new_meta)})"
        )

    old_embeddings = load_embeddings(
        old_embeddings_path,
        embedding_dim=int(embedding_dim),
        expected_rows=old_total,
    )
    if old_embeddings.ndim != 2:
        raise ValueError("Invalid embeddings matrix shape")
    if old_total != int(old_embeddings.shape[0]):
        raise ValueError(
            f"Metadata/embedding count mismatch before compaction "
            f"(meta={old_total}, emb={old_embeddings.shape[0]})"
        )
    dim = int(old_embeddings.shape[1])
    if dim != int(embedding_dim):
        raise ValueError(f"Embedding dimension mismatch: {dim} != {embedding_dim}")

    merged_total = kept_old + len(new_meta)

    faiss_path = out_dir / "vault.faiss"
    emb_path = out_dir / "embeddings.npy"
    meta_path = out_dir / "meta.json"
    meta_jsonl_path = out_dir / "meta.jsonl"
    meta_offsets_path = out_dir / "meta.offsets.npy"

    emb_tmp = out_dir / "embeddings.npy.tmp"
    faiss_tmp = out_dir / "vault.faiss.tmp"
    meta_tmp = out_dir / "meta.json.tmp"
    meta_jsonl_tmp = out_dir / "meta.jsonl.tmp"
    meta_offsets_tmp = out_dir / "meta.offsets.npy.tmp.npy"

    merged_emb = np.lib.format.open_memmap(
        str(emb_tmp),
        mode="w+",
        dtype=np.float32,
        shape=(merged_total, dim),
    )
    idx_type = (index_type or "flatip").strip().lower()
    if idx_type == "hnsw":
        m = max(8, int(hnsw_m))
        ef_c = max(m, int(hnsw_ef_construction))
        ef_s = max(1, int(hnsw_ef_search))
        index = faiss.IndexHNSWFlat(dim, m, faiss.METRIC_INNER_PRODUCT)
        index.hnsw.efConstruction = ef_c
        index.hnsw.efSearch = ef_s
    else:
        idx_type = "flatip"
        index = faiss.IndexFlatIP(dim)

    offsets: list[int] = [0]
    written = 0
    first_meta = True

    with open(meta_tmp, "w", encoding="utf-8") as meta_out, open(meta_jsonl_tmp, "wb") as meta_jsonl_out:
        meta_out.write("[\n")

        # Pass 2: stream unchanged old rows.
        meta_idx = 0
        for rec in iter_meta_records(old_meta_path):
            rec_path = rec.get("path") if isinstance(rec, dict) else None
            if rec_path in changed_paths:
                meta_idx += 1
                continue

            row = np.asarray(old_embeddings[meta_idx], dtype=np.float32)
            merged_emb[written] = row

            rec_json = json.dumps(rec, ensure_ascii=False, separators=(",", ":"))
            if not first_meta:
                meta_out.write(",\n")
            meta_out.write(rec_json)
            first_meta = False

            rec_line = (rec_json + "\n").encode("utf-8")
            meta_jsonl_out.write(rec_line)
            offsets.append(offsets[-1] + len(rec_line))

            written += 1
            meta_idx += 1

        # Append new/modified rows.
        if len(new_meta) > 0:
            new_embeddings = np.asarray(new_embeddings, dtype=np.float32)
            merged_emb[written:written + len(new_meta)] = new_embeddings
            for rec in new_meta:
                rec_json = json.dumps(rec, ensure_ascii=False, separators=(",", ":"))
                if not first_meta:
                    meta_out.write(",\n")
                meta_out.write(rec_json)
                first_meta = False

                rec_line = (rec_json + "\n").encode("utf-8")
                meta_jsonl_out.write(rec_line)
                offsets.append(offsets[-1] + len(rec_line))
                written += 1

        meta_out.write("\n]\n")

    if written != merged_total:
        raise ValueError(f"Compaction write mismatch: written={written}, expected={merged_total}")

    merged_emb.flush()
    del merged_emb

    np.save(str(meta_offsets_tmp), np.asarray(offsets, dtype=np.int64))

    emb_reader = np.load(str(emb_tmp), mmap_mode="r")
    step = max(1, int(batch_size))
    for start in range(0, int(emb_reader.shape[0]), step):
        part = np.asarray(emb_reader[start:start + step], dtype=np.float32)
        if part.size == 0:
            continue
        index.add(part)
    faiss.write_index(index, str(faiss_tmp))

    os.replace(str(emb_tmp), str(emb_path))
    os.replace(str(faiss_tmp), str(faiss_path))
    os.replace(str(meta_tmp), str(meta_path))
    os.replace(str(meta_jsonl_tmp), str(meta_jsonl_path))
    os.replace(str(meta_offsets_tmp), str(meta_offsets_path))

    return {
        "old_total": old_total,
        "kept_old": kept_old,
        "new_chunks": len(new_meta),
        "merged_total": merged_total,
        "index_type": idx_type,
    }


# ---------------------------------------------------------------------------
# Module exports
# ---------------------------------------------------------------------------

__all__ = [
    "save_file_mtimes",
    "load_file_mtimes",
    "collect_mtimes",
    "diff_files",
    "save_embeddings",
    "load_embeddings",
    "merge_index",
    "iter_meta_records",
    "compact_incremental_index",
]
