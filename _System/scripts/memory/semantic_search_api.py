#!/usr/bin/env python3
"""
semantic_search_api.py — FastAPI wrapper for Meru semantic retrieval.

Issue #61 acceptance:
- Exposes HTTP endpoints so other tools can query vault search results.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from query_vault import (
    _DEFAULT_HYBRID_ALPHA,
    _DEFAULT_HNSW_EF_SEARCH,
    LazySentenceModel,
    load_index,
    load_metadata,
    load_metadata_lazy,
    run_query,
)
from shard_router import load_sharded_router


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(BASE_DIR, "_System", "memory")
DEFAULT_MODEL = "all-MiniLM-L6-v2"


@dataclass
class SearchServiceState:
    index_dir: str
    meta: Any | None = None
    index: Any | None = None
    model: LazySentenceModel | None = None
    startup_error: str | None = None


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=200)
    search_mode: str = Field(default="hybrid", pattern="^(vector|hybrid|lexical)$")
    para: str | None = None
    domain: str | None = None
    format: str | None = None
    exclude_archives: bool = True
    enneagram: str | None = None
    expand_context: int = Field(default=0, ge=0, le=3)
    use_priority: bool = True
    hybrid_alpha: float = Field(default=_DEFAULT_HYBRID_ALPHA, ge=0.0, le=1.0)


class SearchResponse(BaseModel):
    query: str
    top_k: int
    search_mode: str
    hit_count: int
    duration_ms: float
    results: list[dict]
    info: dict


app = FastAPI(title="Meru Semantic Search API", version="1.0.0")

state = SearchServiceState(index_dir=os.environ.get("MERU_INDEX_DIR", DEFAULT_INDEX_DIR))
SHARD_ROUTER_ENABLED = os.environ.get("MERU_SHARD_ROUTER", "1").strip().lower() not in {"0", "false", "no"}
SHARD_ROUTER_TOP_SHARDS = int(os.environ.get("MERU_ROUTER_TOP_SHARDS", "8") or "8")


def _json_ready(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(k): _json_ready(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_json_ready(v) for v in value]
    if hasattr(value, "item"):
        try:
            return value.item()
        except Exception:
            pass
    if isinstance(value, (datetime,)):
        return value.isoformat()
    return value


def _init_state() -> None:
    index_dir = os.path.abspath(state.index_dir)
    meta_path = os.path.join(index_dir, "meta.json")
    faiss_path = os.path.join(index_dir, "vault.faiss")

    if not os.path.exists(meta_path):
        raise RuntimeError(f"meta.json not found in {index_dir}")

    lazy_meta = load_metadata_lazy(meta_path)
    state.meta = lazy_meta if lazy_meta is not None else load_metadata(meta_path)

    routed_index = None
    if SHARD_ROUTER_ENABLED:
        routed_index = load_sharded_router(
            index_dir=index_dir,
            top_shards=max(0, int(SHARD_ROUTER_TOP_SHARDS)),
            hnsw_ef_search=_DEFAULT_HNSW_EF_SEARCH,
        )
    if routed_index is not None:
        state.index = routed_index
    elif os.path.exists(faiss_path):
        state.index = load_index(faiss_path, hnsw_ef_search=_DEFAULT_HNSW_EF_SEARCH)
    else:
        state.index = None

    state.model = LazySentenceModel(DEFAULT_MODEL, verbose=False)


@app.on_event("startup")
def startup() -> None:
    try:
        _init_state()
        state.startup_error = None
    except Exception as exc:
        state.startup_error = str(exc)


@app.get("/health")
def health() -> dict:
    ok = state.startup_error is None and state.meta is not None
    return {
        "ok": ok,
        "index_dir": os.path.abspath(state.index_dir),
        "meta_loaded": state.meta is not None,
        "index_loaded": state.index is not None,
        "startup_error": state.startup_error,
    }


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest) -> SearchResponse:
    if state.startup_error:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {state.startup_error}")
    if state.meta is None:
        raise HTTPException(status_code=503, detail="Metadata is not loaded.")

    if req.search_mode in {"vector", "hybrid"} and state.index is None:
        raise HTTPException(status_code=503, detail="FAISS index not loaded for vector/hybrid search.")

    start = datetime.now()
    try:
        results, info = run_query(
            model=state.model,
            index=state.index,
            meta=state.meta,
            query_text=req.query,
            top_k=req.top_k,
            para_filter=req.para,
            domain_filter=req.domain,
            format_filter=req.format,
            exclude_archives=req.exclude_archives,
            enneagram_filter=req.enneagram,
            search_mode=req.search_mode,
            use_priority=req.use_priority,
            hybrid_alpha=req.hybrid_alpha,
            expand_context=req.expand_context,
            index_dir=state.index_dir,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    elapsed_ms = (datetime.now() - start).total_seconds() * 1000.0

    return SearchResponse(
        query=req.query,
        top_k=req.top_k,
        search_mode=req.search_mode,
        hit_count=len(results),
        duration_ms=round(elapsed_ms, 2),
        results=_json_ready(results),
        info=_json_ready(info),
    )


@app.get("/search")
def search_get(
    q: str,
    top_k: int = 8,
    mode: str = "hybrid",
    exclude_archives: bool = True,
) -> dict:
    req = SearchRequest(
        query=q,
        top_k=top_k,
        search_mode=mode,
        exclude_archives=exclude_archives,
    )
    return search(req).model_dump()
