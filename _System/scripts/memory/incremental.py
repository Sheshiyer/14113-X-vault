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
from typing import Any

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


def load_embeddings(path: str | Path) -> np.ndarray:
    """Load a previously saved embedding matrix.

    Returns
    -------
    np.ndarray
        Float32 array of shape ``(N, dim)``.
    """
    return np.load(str(path)).astype(np.float32)


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
]
