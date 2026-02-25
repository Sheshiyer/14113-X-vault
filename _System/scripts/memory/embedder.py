"""
embedder.py — Embedding encoder, FAISS index builder, and persistence
for the PARA Vault Memory Index.

Functions:
    encode_chunks(model, texts, batch_size)  → np.ndarray
    encode_chunked(model, texts, mega_batch)  → np.ndarray  (memory-safe)
    build_faiss_index(embeddings)             → faiss.IndexFlatIP
    save_index(index, path)
    save_metadata(records, path)
    save_stats(stats, path)
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
DEFAULT_BATCH_SIZE = 256
MEGA_BATCH_SIZE = 5000  # chunks per mega-batch for memory-efficient encoding


# ---------------------------------------------------------------------------
# A-W4-01: Batch embedding encoder with normalization
# ---------------------------------------------------------------------------

def encode_chunks(
    model: SentenceTransformer,
    texts: list[str],
    batch_size: int = DEFAULT_BATCH_SIZE,
) -> np.ndarray:
    """Encode a list of text chunks into normalized FP32 embeddings.

    Parameters
    ----------
    model : SentenceTransformer
        Loaded sentence-transformer model.
    texts : list[str]
        Text chunks to encode.
    batch_size : int
        Encoding batch size (passed to model.encode).

    Returns
    -------
    np.ndarray
        Float32 array of shape ``(len(texts), EMBEDDING_DIM)`` with
        L2-normalized rows (so inner-product ≡ cosine similarity).
    """
    if not texts:
        return np.empty((0, EMBEDDING_DIM), dtype=np.float32)

    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=False,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )
    return embeddings.astype(np.float32)


# ---------------------------------------------------------------------------
# A-W4-06: Memory-efficient chunked encoding
# ---------------------------------------------------------------------------

def encode_chunked(
    model: SentenceTransformer,
    texts: list[str],
    mega_batch: int = MEGA_BATCH_SIZE,
    batch_size: int = DEFAULT_BATCH_SIZE,
    progress_cb=None,
) -> np.ndarray:
    """Encode texts in mega-batches to limit peak memory usage.

    Processes *mega_batch* chunks at a time, concatenates the resulting
    numpy arrays, and optionally calls *progress_cb(n_done, n_total)*
    after each mega-batch.

    Parameters
    ----------
    model : SentenceTransformer
        Loaded sentence-transformer model.
    texts : list[str]
        All text chunks to encode.
    mega_batch : int
        Number of chunks per mega-batch (default 5000).
    batch_size : int
        Inner batch size for model.encode.
    progress_cb : callable, optional
        ``progress_cb(done, total)`` called after each mega-batch.

    Returns
    -------
    np.ndarray
        Float32 array of shape ``(len(texts), EMBEDDING_DIM)``, normalized.
    """
    if not texts:
        return np.empty((0, EMBEDDING_DIM), dtype=np.float32)

    total = len(texts)
    parts: list[np.ndarray] = []

    for start in range(0, total, mega_batch):
        end = min(start + mega_batch, total)
        batch_texts = texts[start:end]
        embs = encode_chunks(model, batch_texts, batch_size=batch_size)
        parts.append(embs)

        if progress_cb:
            progress_cb(end, total)

    return np.vstack(parts)


# ---------------------------------------------------------------------------
# A-W4-02: FAISS IndexFlatIP builder
# ---------------------------------------------------------------------------

def build_faiss_index(embeddings: np.ndarray) -> faiss.IndexFlatIP:
    """Build a FAISS inner-product index from an embedding matrix.

    Since embeddings are L2-normalized, inner-product search is
    equivalent to cosine similarity.

    Parameters
    ----------
    embeddings : np.ndarray
        Float32 array of shape ``(n, EMBEDDING_DIM)``.

    Returns
    -------
    faiss.IndexFlatIP
        Populated FAISS index ready for search.
    """
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)
    return index


# ---------------------------------------------------------------------------
# A-W4-03: FAISS index writer
# ---------------------------------------------------------------------------

def save_index(index: faiss.IndexFlatIP, path: str | Path) -> None:
    """Write a FAISS index to disk.

    Parameters
    ----------
    index : faiss.IndexFlatIP
        The FAISS index to save.
    path : str or Path
        Destination file path (e.g. ``_System/memory/vault.faiss``).
    """
    path = str(path)
    faiss.write_index(index, path)


def load_index(path: str | Path) -> faiss.IndexFlatIP:
    """Read a FAISS index from disk."""
    return faiss.read_index(str(path))


# ---------------------------------------------------------------------------
# A-W4-04: Metadata JSON writer
# ---------------------------------------------------------------------------

def save_metadata(records: list[dict], path: str | Path) -> None:
    """Write chunk metadata records to a JSON file.

    The file contains a JSON array with one dict per chunk, aligned
    by index with the FAISS index.
    """
    path = str(path)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=None, separators=(",", ":"))


def load_metadata(path: str | Path) -> list[dict]:
    """Read chunk metadata from a JSON file."""
    with open(str(path), encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# A-W4-05: Index stats writer
# ---------------------------------------------------------------------------

def save_stats(
    file_count: int,
    chunk_count: int,
    model_name: str = MODEL_NAME,
    *,
    extra: dict[str, Any] | None = None,
    path: str | Path = "",
) -> dict:
    """Build and optionally write an index stats dict.

    Parameters
    ----------
    file_count : int
        Number of files indexed.
    chunk_count : int
        Total number of chunks stored in the FAISS index.
    model_name : str
        Name of the sentence-transformer model used.
    extra : dict, optional
        Additional key-value pairs to include.
    path : str or Path
        If non-empty, write the stats dict to this JSON file.

    Returns
    -------
    dict
        The stats dictionary (always returned regardless of *path*).
    """
    stats: dict[str, Any] = {
        "file_count": file_count,
        "chunk_count": chunk_count,
        "model_name": model_name,
        "indexed_at": datetime.now(timezone.utc).isoformat(),
    }
    if extra:
        stats.update(extra)

    if path:
        with open(str(path), "w", encoding="utf-8") as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)

    return stats


# ---------------------------------------------------------------------------
# Module exports
# ---------------------------------------------------------------------------

__all__ = [
    "encode_chunks",
    "encode_chunked",
    "build_faiss_index",
    "save_index",
    "load_index",
    "save_metadata",
    "load_metadata",
    "save_stats",
    "MODEL_NAME",
    "EMBEDDING_DIM",
    "DEFAULT_BATCH_SIZE",
    "MEGA_BATCH_SIZE",
]
