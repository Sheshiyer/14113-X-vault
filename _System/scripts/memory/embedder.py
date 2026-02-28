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

from concurrent.futures import ProcessPoolExecutor, as_completed
import json
import os
import sys
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
SUPPORTED_INDEX_TYPES = {"flatip", "hnsw"}
DEFAULT_INDEX_TYPE = "flatip"
DEFAULT_HNSW_M = 32
DEFAULT_HNSW_EF_CONSTRUCTION = 200
DEFAULT_HNSW_EF_SEARCH = 64
SUPPORTED_ENCODE_BACKENDS = {"auto", "single", "multi", "process"}
DEFAULT_ENCODE_CPU_WORKERS = min(8, max(2, (os.cpu_count() or 2) - 1))
DEFAULT_PROCESS_TASK_CHUNK = 512
CPU_THREAD_GUARD_ENV = "MERU_ENCODE_CPU_THREADS"

_CPU_THREAD_GUARD_APPLIED = False


def _detect_cuda_devices() -> list[str]:
    try:
        import torch
    except Exception:
        return []
    try:
        if torch.cuda.is_available():
            return [f"cuda:{i}" for i in range(torch.cuda.device_count())]
    except Exception:
        return []
    return []


def _detect_mps_device() -> list[str]:
    try:
        import torch
    except Exception:
        return []
    try:
        if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return ["mps"]
    except Exception:
        return []
    return []


def _parse_target_devices(
    devices: str = "auto",
    cpu_workers: int = DEFAULT_ENCODE_CPU_WORKERS,
) -> list[str]:
    spec = (devices or "auto").strip().lower()
    if spec == "auto":
        cuda_devices = _detect_cuda_devices()
        if cuda_devices:
            return cuda_devices
        mps_devices = _detect_mps_device()
        if mps_devices:
            return mps_devices
        return ["cpu"] * max(1, int(cpu_workers))
    parsed = [d.strip() for d in devices.split(",") if d.strip()]
    return parsed or ["cpu"]


def resolve_model_device(
    devices: str = "auto",
    cpu_workers: int = DEFAULT_ENCODE_CPU_WORKERS,
) -> str:
    target_devices = _parse_target_devices(devices=devices, cpu_workers=cpu_workers)
    if not target_devices:
        return "cpu"
    primary = target_devices[0].strip().lower()
    return primary or "cpu"


def _model_device_is_cpu(model: SentenceTransformer | None) -> bool:
    if model is None:
        return False
    model_device = str(getattr(model, "device", "cpu")).strip().lower()
    return model_device.startswith("cpu")


def _resolve_cpu_thread_guard_limit() -> int | None:
    raw = os.getenv(CPU_THREAD_GUARD_ENV, "").strip()
    if raw:
        try:
            return max(1, int(raw))
        except ValueError:
            return 1
    # Python 3.14 + torch/libomp can segfault on repeated CPU encode calls.
    if sys.version_info >= (3, 14):
        return 1
    return None


def _apply_cpu_thread_guard(model: SentenceTransformer | None) -> str | None:
    global _CPU_THREAD_GUARD_APPLIED
    if _CPU_THREAD_GUARD_APPLIED:
        return None
    if not _model_device_is_cpu(model):
        return None

    thread_limit = _resolve_cpu_thread_guard_limit()
    if thread_limit is None:
        return None

    try:
        import torch
    except Exception:
        return None

    notes: list[str] = []
    try:
        current_threads = int(torch.get_num_threads())
    except Exception:
        current_threads = 0
    if current_threads != thread_limit:
        try:
            torch.set_num_threads(thread_limit)
            notes.append(f"cpu_threads={thread_limit}")
        except Exception as exc:
            notes.append(f"cpu_threads_set_failed={type(exc).__name__}")
    else:
        notes.append(f"cpu_threads={thread_limit}")

    interop_threads = max(1, min(thread_limit, 2))
    try:
        current_interop = int(torch.get_num_interop_threads())
    except Exception:
        current_interop = 0
    if current_interop != interop_threads:
        try:
            torch.set_num_interop_threads(interop_threads)
            notes.append(f"cpu_interop_threads={interop_threads}")
        except Exception as exc:
            # set_num_interop_threads can fail if parallel work already started.
            notes.append(f"cpu_interop_set_skipped={type(exc).__name__}")
    else:
        notes.append(f"cpu_interop_threads={interop_threads}")

    _CPU_THREAD_GUARD_APPLIED = True
    return ", ".join(notes)


_PROC_ENCODER_MODEL: SentenceTransformer | None = None


def _proc_encoder_init(model_name: str) -> None:
    global _PROC_ENCODER_MODEL
    _PROC_ENCODER_MODEL = SentenceTransformer(model_name)
    _apply_cpu_thread_guard(_PROC_ENCODER_MODEL)


def _proc_encode_payload(payload: tuple[int, list[str], int]) -> tuple[int, np.ndarray]:
    idx, texts, batch_size = payload
    if _PROC_ENCODER_MODEL is None:
        raise RuntimeError("process encoder worker is uninitialized")
    if not texts:
        return idx, np.empty((0, EMBEDDING_DIM), dtype=np.float32)
    embs = _PROC_ENCODER_MODEL.encode(
        texts,
        batch_size=int(max(1, batch_size)),
        show_progress_bar=False,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )
    return idx, embs.astype(np.float32)


def start_encoding_backend(
    model: SentenceTransformer,
    backend: str = "auto",
    devices: str = "auto",
    cpu_workers: int = DEFAULT_ENCODE_CPU_WORKERS,
    model_name: str = MODEL_NAME,
) -> tuple[str, dict | None, list[str], str | None]:
    requested = (backend or "auto").strip().lower()
    if requested not in SUPPORTED_ENCODE_BACKENDS:
        raise ValueError(
            f"Unsupported encode backend '{backend}'. "
            f"Valid options: {sorted(SUPPORTED_ENCODE_BACKENDS)}"
        )

    target_devices = _parse_target_devices(devices=devices, cpu_workers=cpu_workers)
    resolved = requested
    cuda_devices = [d for d in target_devices if d.startswith("cuda")]
    cpu_only = bool(target_devices) and all(d == "cpu" for d in target_devices)
    runtime_note = _apply_cpu_thread_guard(model)

    if requested == "auto":
        # Auto mode scales across true accelerator fan-out; CPU defaults to stable single-process.
        resolved = "multi" if len(cuda_devices) >= 2 else "single"
    elif requested == "process":
        resolved = "process" if cpu_workers > 1 else "single"
    elif requested == "multi" and len(target_devices) <= 1:
        resolved = "single"

    if resolved == "single":
        note = None
        if requested == "multi" and len(target_devices) <= 1:
            note = "encode backend requested=multi but only one device resolved; falling back to single"
        elif requested == "process" and cpu_workers <= 1:
            note = "encode backend requested=process but cpu_workers<=1; falling back to single"
        if runtime_note:
            note = f"{note}; {runtime_note}" if note else runtime_note
        return resolved, None, target_devices, note

    if resolved == "process":
        if not cpu_only:
            return (
                "single",
                None,
                target_devices,
                "encode backend process is CPU-only; falling back to single for accelerator target",
            )
        workers = max(2, int(cpu_workers))
        try:
            executor = ProcessPoolExecutor(
                max_workers=workers,
                initializer=_proc_encoder_init,
                initargs=(model_name,),
            )
            return (
                resolved,
                {
                    "backend": "process",
                    "executor": executor,
                    "workers": workers,
                    "task_chunk": DEFAULT_PROCESS_TASK_CHUNK,
                },
                target_devices,
                runtime_note,
            )
        except Exception as exc:
            note = f"encode backend process init failed ({type(exc).__name__}); falling back to single"
            if runtime_note:
                note = f"{note}; {runtime_note}"
            return "single", None, target_devices, note

    # Guard known-instability configurations.
    if sys.version_info >= (3, 14):
        return (
            "single",
            None,
            target_devices,
            "encode backend multi-process disabled on Python 3.14+ (runtime instability); using single",
        )
    if cpu_only:
        return (
            "single",
            None,
            target_devices,
            "encode backend multi-process disabled for CPU targets in this runtime; using single",
        )

    try:
        pool = model.start_multi_process_pool(target_devices=target_devices)
        return resolved, pool, target_devices, runtime_note
    except Exception as exc:
        note = f"encode backend multi-process init failed ({type(exc).__name__}); falling back to single"
        if runtime_note:
            note = f"{note}; {runtime_note}"
        return "single", None, target_devices, note


def stop_encoding_backend(
    model: SentenceTransformer,
    pool: dict | None,
) -> None:
    if pool is None:
        return
    if pool.get("backend") == "process":
        executor = pool.get("executor")
        if executor is not None:
            try:
                executor.shutdown(wait=True, cancel_futures=False)
            except Exception:
                pass
        return
    try:
        model.stop_multi_process_pool(pool)
    except Exception:
        return


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

    _apply_cpu_thread_guard(model)

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

def _encode_with_process_pool(
    pool: dict,
    texts: list[str],
    batch_size: int,
    chunk_size: int | None = None,
) -> np.ndarray:
    executor = pool.get("executor")
    if executor is None:
        raise RuntimeError("process encode backend missing executor")

    task_chunk = int(chunk_size or pool.get("task_chunk") or DEFAULT_PROCESS_TASK_CHUNK)
    task_chunk = max(64, task_chunk)
    payloads = [
        (i, texts[i:i + task_chunk], int(max(1, batch_size)))
        for i in range(0, len(texts), task_chunk)
    ]
    if not payloads:
        return np.empty((0, EMBEDDING_DIM), dtype=np.float32)

    futures = {
        executor.submit(_proc_encode_payload, payload): pos
        for pos, payload in enumerate(payloads)
    }
    ordered: list[np.ndarray | None] = [None] * len(payloads)
    for fut in as_completed(futures):
        pos = futures[fut]
        _, embs = fut.result()
        ordered[pos] = embs.astype(np.float32)

    parts = [p for p in ordered if p is not None]
    if not parts:
        return np.empty((0, EMBEDDING_DIM), dtype=np.float32)
    return np.vstack(parts)


def encode_chunked(
    model: SentenceTransformer,
    texts: list[str],
    mega_batch: int = MEGA_BATCH_SIZE,
    batch_size: int = DEFAULT_BATCH_SIZE,
    pool: dict | None = None,
    chunk_size: int | None = None,
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
        backend = (pool or {}).get("backend") if isinstance(pool, dict) else None
        if pool is None:
            embs = encode_chunks(model, batch_texts, batch_size=batch_size)
        elif backend == "process":
            embs = _encode_with_process_pool(
                pool=pool,
                texts=batch_texts,
                batch_size=batch_size,
                chunk_size=chunk_size,
            )
        else:
            embs = model.encode_multi_process(
                batch_texts,
                pool=pool,
                batch_size=batch_size,
                chunk_size=chunk_size,
                show_progress_bar=False,
                precision="float32",
                normalize_embeddings=True,
            ).astype(np.float32)
        parts.append(embs)

        if progress_cb:
            progress_cb(end, total)

    return np.vstack(parts)


# ---------------------------------------------------------------------------
# A-W4-02: FAISS IndexFlatIP builder
# ---------------------------------------------------------------------------

def make_faiss_index(
    dim: int,
    *,
    index_type: str = DEFAULT_INDEX_TYPE,
    hnsw_m: int = DEFAULT_HNSW_M,
    hnsw_ef_construction: int = DEFAULT_HNSW_EF_CONSTRUCTION,
    hnsw_ef_search: int = DEFAULT_HNSW_EF_SEARCH,
):
    """Create an empty FAISS index for normalized inner-product vectors."""
    normalized_type = (index_type or DEFAULT_INDEX_TYPE).strip().lower()
    if normalized_type not in SUPPORTED_INDEX_TYPES:
        raise ValueError(
            f"Unsupported index type '{index_type}'. "
            f"Valid options: {sorted(SUPPORTED_INDEX_TYPES)}"
        )

    if normalized_type == "hnsw":
        m = max(8, int(hnsw_m))
        ef_c = max(m, int(hnsw_ef_construction))
        ef_s = max(1, int(hnsw_ef_search))
        index = faiss.IndexHNSWFlat(int(dim), m, faiss.METRIC_INNER_PRODUCT)
        index.hnsw.efConstruction = ef_c
        index.hnsw.efSearch = ef_s
        return index
    return faiss.IndexFlatIP(int(dim))


def build_faiss_index(
    embeddings: np.ndarray,
    *,
    index_type: str = DEFAULT_INDEX_TYPE,
    hnsw_m: int = DEFAULT_HNSW_M,
    hnsw_ef_construction: int = DEFAULT_HNSW_EF_CONSTRUCTION,
    hnsw_ef_search: int = DEFAULT_HNSW_EF_SEARCH,
):
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
    index = make_faiss_index(
        dim,
        index_type=index_type,
        hnsw_m=hnsw_m,
        hnsw_ef_construction=hnsw_ef_construction,
        hnsw_ef_search=hnsw_ef_search,
    )
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

    # Sidecar for lazy metadata reads in query-time paths.
    stem, _ = os.path.splitext(path)
    jsonl_path = f"{stem}.jsonl"
    offsets_path = f"{stem}.offsets.npy"
    offsets = np.zeros(len(records) + 1, dtype=np.int64)
    cursor = 0
    with open(jsonl_path, "wb") as jf:
        for i, rec in enumerate(records):
            line = json.dumps(rec, ensure_ascii=False, separators=(",", ":")).encode("utf-8") + b"\n"
            offsets[i] = cursor
            jf.write(line)
            cursor += len(line)
    offsets[len(records)] = cursor
    np.save(offsets_path, offsets)


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
    "make_faiss_index",
    "MODEL_NAME",
    "EMBEDDING_DIM",
    "DEFAULT_BATCH_SIZE",
    "MEGA_BATCH_SIZE",
    "SUPPORTED_INDEX_TYPES",
    "DEFAULT_INDEX_TYPE",
    "DEFAULT_HNSW_M",
    "DEFAULT_HNSW_EF_CONSTRUCTION",
    "DEFAULT_HNSW_EF_SEARCH",
    "SUPPORTED_ENCODE_BACKENDS",
    "DEFAULT_ENCODE_CPU_WORKERS",
    "resolve_model_device",
    "start_encoding_backend",
    "stop_encoding_backend",
]
