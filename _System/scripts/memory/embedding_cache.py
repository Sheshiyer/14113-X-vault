#!/usr/bin/env python3
"""
embedding_cache.py — Persistent local embedding cache keyed by content hash.

This cache is designed for local rebuild acceleration:
  - key: deterministic hash of chunk text
  - value: float32 embedding vector bytes
  - store: sqlite (single-file, durable, local-friendly)
"""

from __future__ import annotations

import hashlib
import os
import sqlite3
import time
from pathlib import Path
from typing import Iterable

import numpy as np

from incremental import iter_meta_records, load_embeddings


_MAX_SQL_IN = 900  # keep under sqlite variable limit
_UPSERT_BATCH = 512


def hash_chunk_text(text: str) -> str:
    """Return deterministic content hash for a chunk body."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


class EmbeddingCache:
    """SQLite-backed embedding cache keyed by content hash."""

    def __init__(self, path: str | Path, embedding_dim: int):
        self.path = str(path)
        self.embedding_dim = int(embedding_dim)
        os.makedirs(os.path.dirname(self.path) or ".", exist_ok=True)
        self._conn = sqlite3.connect(self.path, timeout=120.0)
        self._init_db()

    def _init_db(self) -> None:
        cur = self._conn.cursor()
        cur.execute("PRAGMA journal_mode=WAL")
        cur.execute("PRAGMA synchronous=NORMAL")
        cur.execute("PRAGMA temp_store=MEMORY")
        cur.execute("PRAGMA cache_size=-20000")
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS cache_entries (
                content_hash TEXT PRIMARY KEY,
                embedding BLOB NOT NULL,
                embedding_dim INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS cache_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
            """
        )
        row = cur.execute(
            "SELECT value FROM cache_meta WHERE key='embedding_dim'"
        ).fetchone()
        if row is None:
            cur.execute(
                "INSERT INTO cache_meta(key, value) VALUES('embedding_dim', ?)",
                (str(self.embedding_dim),),
            )
        else:
            existing = int(row[0])
            if existing != self.embedding_dim:
                raise ValueError(
                    f"Embedding cache dim mismatch: cache={existing}, requested={self.embedding_dim}"
                )
        self._conn.commit()

    def count_entries(self) -> int:
        row = self._conn.execute("SELECT COUNT(*) FROM cache_entries").fetchone()
        return int(row[0]) if row else 0

    def get_many(self, hashes: list[str]) -> dict[str, np.ndarray]:
        if not hashes:
            return {}
        # Preserve first-seen order while removing duplicates.
        unique_hashes = list(dict.fromkeys(h for h in hashes if h))
        if not unique_hashes:
            return {}

        out: dict[str, np.ndarray] = {}
        for start in range(0, len(unique_hashes), _MAX_SQL_IN):
            chunk = unique_hashes[start:start + _MAX_SQL_IN]
            placeholders = ",".join("?" for _ in chunk)
            query = (
                "SELECT content_hash, embedding, embedding_dim "
                f"FROM cache_entries WHERE content_hash IN ({placeholders})"
            )
            rows = self._conn.execute(query, chunk).fetchall()
            for content_hash, blob, emb_dim in rows:
                if int(emb_dim) != self.embedding_dim:
                    continue
                vec = np.frombuffer(blob, dtype=np.float32)
                if vec.size != self.embedding_dim:
                    continue
                out[str(content_hash)] = vec.copy()
        return out

    def put_many(self, entries: Iterable[tuple[str, np.ndarray]]) -> int:
        payload: list[tuple[str, sqlite3.Binary, int, int]] = []
        now = int(time.time())
        for content_hash, emb in entries:
            if not content_hash:
                continue
            vec = np.asarray(emb, dtype=np.float32).reshape(-1)
            if vec.size != self.embedding_dim:
                continue
            payload.append(
                (
                    str(content_hash),
                    sqlite3.Binary(vec.tobytes(order="C")),
                    self.embedding_dim,
                    now,
                )
            )

        if not payload:
            return 0

        sql = (
            "INSERT OR REPLACE INTO cache_entries "
            "(content_hash, embedding, embedding_dim, updated_at) "
            "VALUES (?, ?, ?, ?)"
        )
        with self._conn:
            for start in range(0, len(payload), _UPSERT_BATCH):
                self._conn.executemany(sql, payload[start:start + _UPSERT_BATCH])
        return len(payload)

    def warm_from_existing_index(
        self,
        meta_path: str | Path,
        embeddings_path: str | Path,
        *,
        limit: int | None = None,
    ) -> dict[str, int]:
        """Prime cache from an existing aligned meta+embedding index."""
        meta_path = str(meta_path)
        embeddings_path = str(embeddings_path)
        stats = {
            "records_seen": 0,
            "records_loaded": 0,
            "records_skipped_missing_text": 0,
        }
        if not os.path.exists(meta_path) or not os.path.exists(embeddings_path):
            return stats

        emb = load_embeddings(embeddings_path, embedding_dim=self.embedding_dim)
        total_rows = int(emb.shape[0]) if emb.ndim == 2 else 0
        if total_rows <= 0:
            return stats

        pending: list[tuple[str, np.ndarray]] = []
        for idx, rec in enumerate(iter_meta_records(meta_path)):
            if idx >= total_rows:
                break
            if limit is not None and limit > 0 and stats["records_seen"] >= limit:
                break
            stats["records_seen"] += 1
            if not isinstance(rec, dict):
                stats["records_skipped_missing_text"] += 1
                continue
            content_hash = str(rec.get("content_hash") or "").strip()
            if not content_hash:
                text = str(rec.get("text") or "")
                if not text:
                    stats["records_skipped_missing_text"] += 1
                    continue
                content_hash = hash_chunk_text(text)
            pending.append((content_hash, np.asarray(emb[idx], dtype=np.float32)))
            if len(pending) >= _UPSERT_BATCH:
                stats["records_loaded"] += self.put_many(pending)
                pending.clear()

        if pending:
            stats["records_loaded"] += self.put_many(pending)
        return stats

    def close(self) -> None:
        try:
            self._conn.close()
        except Exception:
            return


__all__ = ["EmbeddingCache", "hash_chunk_text"]
