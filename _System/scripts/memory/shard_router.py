#!/usr/bin/env python3
"""Shard-aware FAISS router for top-N shard query dispatch + global merge."""

from __future__ import annotations

from collections import OrderedDict
from dataclasses import dataclass
import bisect
import fnmatch
import json
import os
import time
from typing import Any

import faiss
import numpy as np


_DEFAULT_MANIFEST = "shard_manifest.json"


@dataclass(frozen=True)
class ShardEntry:
    shard_seq: int
    shard_tag: str
    para: str
    emb_path: str
    meta_path: str
    faiss_path: str
    chunk_count: int
    global_start: int
    global_end: int
    formats: tuple[str, ...]
    domains: tuple[str, ...]
    centroid: np.ndarray


def _set_hnsw_ef_search(index: Any, ef_search: int | None) -> None:
    if ef_search is None:
        return
    ef = max(1, int(ef_search))
    try:
        ps = faiss.ParameterSpace()
        ps.set_index_parameter(index, "efSearch", ef)
        return
    except Exception:
        pass
    try:
        if hasattr(index, "hnsw"):
            index.hnsw.efSearch = ef
    except Exception:
        return


def _norm_path(index_dir: str, p: str) -> str:
    if os.path.isabs(p):
        return p
    return os.path.abspath(os.path.join(index_dir, p))


def load_shard_manifest(index_dir: str, manifest_name: str = _DEFAULT_MANIFEST) -> dict | None:
    manifest_path = os.path.join(index_dir, manifest_name)
    if not os.path.exists(manifest_path):
        return None
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            payload = json.load(f)
    except Exception:
        return None
    if not isinstance(payload, dict):
        return None
    shards = payload.get("shards")
    if not isinstance(shards, list) or not shards:
        return None
    payload["_manifest_path"] = manifest_path
    return payload


class ShardedFaissRouter:
    """Routes vector queries to top-N shards, then merges global top-k results."""

    def __init__(
        self,
        *,
        index_dir: str,
        manifest: dict,
        top_shards: int = 8,
        hnsw_ef_search: int | None = None,
        max_loaded_shards: int | None = None,
    ):
        self.index_dir = os.path.abspath(index_dir)
        self.manifest = manifest
        self.manifest_path = str(manifest.get("_manifest_path") or os.path.join(self.index_dir, _DEFAULT_MANIFEST))
        self.hnsw_ef_search = hnsw_ef_search
        self.top_shards = int(top_shards)
        self._max_loaded = int(max_loaded_shards or max(8, (abs(self.top_shards) if self.top_shards != 0 else 8) * 2))
        self._loaded_indexes: OrderedDict[int, Any] = OrderedDict()
        self._last_route_info: dict | None = None
        self._route_filters: dict[str, Any] = {}

        raw_shards = list(self.manifest.get("shards") or [])
        entries: list[ShardEntry] = []
        for raw in raw_shards:
            try:
                shard_seq = int(raw.get("shard_seq"))
                shard_tag = str(raw.get("shard_tag") or "").strip()
                para = str(raw.get("para") or "")
                emb_path = _norm_path(self.index_dir, str(raw.get("emb_path") or ""))
                meta_path = _norm_path(self.index_dir, str(raw.get("meta_path") or ""))
                faiss_path = _norm_path(self.index_dir, str(raw.get("faiss_path") or ""))
                chunk_count = int(raw.get("chunk_count") or 0)
                global_start = int(raw.get("global_start") or 0)
                global_end = int(raw.get("global_end") or (global_start + chunk_count))
                if global_end <= global_start:
                    continue
                if not shard_tag or not os.path.exists(faiss_path):
                    continue

                formats = tuple(
                    sorted(
                        {
                            str(fmt).lower().lstrip(".")
                            for fmt in (raw.get("formats") or [])
                            if str(fmt).strip()
                        }
                    )
                )
                domains = tuple(
                    sorted(
                        {
                            str(dom)
                            for dom in (raw.get("domains") or [])
                            if str(dom).strip()
                        }
                    )
                )

                centroid_raw = raw.get("centroid")
                centroid_arr = np.asarray(centroid_raw, dtype=np.float32)
                if centroid_arr.ndim != 1 or centroid_arr.size == 0:
                    continue
                norm = float(np.linalg.norm(centroid_arr))
                if norm > 0.0:
                    centroid_arr = centroid_arr / norm

                entries.append(
                    ShardEntry(
                        shard_seq=shard_seq,
                        shard_tag=shard_tag,
                        para=para,
                        emb_path=emb_path,
                        meta_path=meta_path,
                        faiss_path=faiss_path,
                        chunk_count=chunk_count,
                        global_start=global_start,
                        global_end=global_end,
                        formats=formats,
                        domains=domains,
                        centroid=centroid_arr,
                    )
                )
            except Exception:
                continue

        entries.sort(key=lambda e: (e.global_start, e.shard_seq, e.shard_tag))
        if not entries:
            raise ValueError("No valid shard entries found in manifest")

        # Build lookup tables.
        self.entries = entries
        self._starts = [e.global_start for e in self.entries]
        self._total = max(e.global_end for e in self.entries)

        first_dim = int(self.entries[0].centroid.shape[0])
        for e in self.entries:
            if int(e.centroid.shape[0]) != first_dim:
                raise ValueError("Shard centroid dimension mismatch in manifest")
        self._dim = first_dim
        self._centroid_matrix = np.vstack([e.centroid for e in self.entries]).astype(np.float32)

    @property
    def ntotal(self) -> int:
        return int(self._total)

    @property
    def d(self) -> int:
        return int(self._dim)

    def set_route_filters(
        self,
        *,
        para_filter: str | None = None,
        domain_filter: str | None = None,
        format_filter: str | None = None,
        exclude_archives: bool = False,
    ) -> None:
        self._route_filters = {
            "para": str(para_filter or "").strip().lower() or None,
            "domain": str(domain_filter or "").strip() or None,
            "format": str(format_filter or "").strip().lower().lstrip(".") or None,
            "exclude_archives": bool(exclude_archives),
        }

    def get_last_route_info(self, *, clear: bool = False) -> dict | None:
        if self._last_route_info is None:
            return None
        out = dict(self._last_route_info)
        if clear:
            self._last_route_info = None
        return out

    def _load_shard_index(self, shard_idx: int):
        cached = self._loaded_indexes.get(shard_idx)
        if cached is not None:
            self._loaded_indexes.move_to_end(shard_idx)
            return cached

        entry = self.entries[shard_idx]
        index = faiss.read_index(entry.faiss_path)
        _set_hnsw_ef_search(index, self.hnsw_ef_search)

        self._loaded_indexes[shard_idx] = index
        self._loaded_indexes.move_to_end(shard_idx)

        while len(self._loaded_indexes) > self._max_loaded:
            self._loaded_indexes.popitem(last=False)

        return index

    def _eligible_shards(self) -> list[int]:
        para_filter = self._route_filters.get("para")
        domain_filter = self._route_filters.get("domain")
        format_filter = self._route_filters.get("format")
        exclude_archives = bool(self._route_filters.get("exclude_archives"))

        eligible: list[int] = []
        for idx, entry in enumerate(self.entries):
            para_l = (entry.para or "").lower()
            if exclude_archives and para_l == "archives":
                continue
            if para_filter and para_l != para_filter:
                continue
            if format_filter and format_filter not in entry.formats:
                continue
            if domain_filter and entry.domains:
                if not any(fnmatch.fnmatch(dom, domain_filter) for dom in entry.domains):
                    continue
            eligible.append(idx)

        if not eligible:
            return list(range(len(self.entries)))
        return eligible

    def _resolve_selected_shards(self, query_vec: np.ndarray, eligible: list[int]) -> list[int]:
        if not eligible:
            return []
        if self.top_shards == 0:
            return list(eligible)

        k = min(max(1, int(abs(self.top_shards))), len(eligible))
        if k >= len(eligible):
            return list(eligible)

        eligible_arr = np.asarray(eligible, dtype=np.int32)
        scores = np.dot(self._centroid_matrix[eligible_arr], query_vec[0])
        top_local = np.argpartition(scores, -k)[-k:]
        ranked = sorted(top_local, key=lambda i: float(scores[i]), reverse=True)
        return [int(eligible_arr[i]) for i in ranked]

    def search(self, query_vec: np.ndarray, k: int):
        t0 = time.monotonic()

        q = np.asarray(query_vec, dtype=np.float32)
        if q.ndim == 1:
            q = q.reshape(1, -1)
        if q.shape[0] == 0:
            raise ValueError("Empty query vector")
        if int(q.shape[1]) != self.d:
            raise ValueError(f"Query dimension mismatch: expected {self.d}, got {q.shape[1]}")

        fetch_k = max(1, int(k))
        eligible = self._eligible_shards()
        selected = self._resolve_selected_shards(q, eligible)

        merged: list[tuple[float, int, int]] = []  # score, global_id, shard_idx
        selected_debug: list[dict[str, Any]] = []

        for shard_idx in selected:
            entry = self.entries[shard_idx]
            index = self._load_shard_index(shard_idx)
            local_fetch = min(fetch_k, int(index.ntotal))
            if local_fetch <= 0:
                continue

            dists, ids = index.search(q, local_fetch)
            returned = 0
            for score, local_id in zip(dists[0], ids[0], strict=False):
                lid = int(local_id)
                if lid < 0:
                    continue
                gid = int(entry.global_start + lid)
                merged.append((float(score), gid, shard_idx))
                returned += 1

            selected_debug.append(
                {
                    "shard_tag": entry.shard_tag,
                    "para": entry.para,
                    "chunk_count": int(entry.chunk_count),
                    "returned": int(returned),
                }
            )

        merged.sort(key=lambda x: x[0], reverse=True)
        top = merged[:fetch_k]

        scores = np.full((1, fetch_k), -np.inf, dtype=np.float32)
        ids = np.full((1, fetch_k), -1, dtype=np.int64)
        for i, (score, gid, _) in enumerate(top):
            scores[0, i] = float(score)
            ids[0, i] = int(gid)

        self._last_route_info = {
            "router_mode": "sharded",
            "router_manifest": self.manifest_path,
            "router_total_shards": len(self.entries),
            "router_eligible_shards": len(eligible),
            "router_selected_shards": len(selected),
            "router_top_shards_requested": int(self.top_shards),
            "router_fetch_k": int(fetch_k),
            "router_selected": selected_debug,
            "router_latency_ms": round((time.monotonic() - t0) * 1000.0, 3),
        }

        return scores, ids

    def reconstruct(self, idx: int):
        gid = int(idx)
        if gid < 0 or gid >= self.ntotal:
            raise IndexError(gid)

        pos = bisect.bisect_right(self._starts, gid) - 1
        if pos < 0:
            raise IndexError(gid)
        entry = self.entries[pos]
        if gid >= entry.global_end:
            raise IndexError(gid)

        local_id = gid - entry.global_start
        shard_index = self._load_shard_index(pos)
        return shard_index.reconstruct(int(local_id))


def load_sharded_router(
    index_dir: str,
    *,
    top_shards: int = 8,
    hnsw_ef_search: int | None = None,
    manifest_name: str = _DEFAULT_MANIFEST,
) -> ShardedFaissRouter | None:
    manifest = load_shard_manifest(index_dir, manifest_name=manifest_name)
    if manifest is None:
        return None
    try:
        return ShardedFaissRouter(
            index_dir=index_dir,
            manifest=manifest,
            top_shards=top_shards,
            hnsw_ef_search=hnsw_ef_search,
        )
    except Exception:
        return None


__all__ = [
    "ShardedFaissRouter",
    "load_shard_manifest",
    "load_sharded_router",
]
