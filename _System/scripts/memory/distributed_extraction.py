#!/usr/bin/env python3
"""
distributed_extraction.py — Backend-coordinated file extraction runners.

Provides a single extraction coordinator abstraction with backend selection:
  - serial: baseline in-process extraction
  - process: local multi-core extraction via ProcessPoolExecutor
  - ray/dask: optional hooks with graceful fallback to local process backend
"""

from __future__ import annotations

import multiprocessing as mp
import os
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import dataclass
from collections.abc import Iterator
from typing import Sequence

from batch_processor import ErrorAggregator, process_file


SUPPORTED_BACKENDS = {"auto", "serial", "process", "ray", "dask"}
SUPPORTED_START_METHODS = {"auto", "spawn", "fork", "forkserver"}
DEFAULT_WORKERS = max(1, (os.cpu_count() or 1) - 1)


@dataclass
class ExtractionResult:
    rel_path: str
    meta: list[dict]
    error_types: list[str]
    scanned_pdfs: list[str]


def default_worker_count() -> int:
    return DEFAULT_WORKERS


def _extract_file_worker(task: tuple[str, str, str]) -> ExtractionResult:
    abs_path, rel_path, vault_path = task
    local_errors = ErrorAggregator()
    scanned: list[str] = []
    try:
        _texts, meta = process_file(
            abs_path,
            rel_path,
            vault_path,
            local_errors,
            scanned,
            dedupe=False,
        )
        error_types: list[str] = []
        for err_type, count in local_errors.counts.items():
            error_types.extend([err_type] * count)
        return ExtractionResult(
            rel_path=rel_path,
            meta=meta,
            error_types=error_types,
            scanned_pdfs=scanned,
        )
    except Exception as exc:
        return ExtractionResult(
            rel_path=rel_path,
            meta=[],
            error_types=[f"worker_exception:{type(exc).__name__}"],
            scanned_pdfs=[],
        )


class DistributedExtractionCoordinator:
    """Coordinate file extraction across serial or parallel backends."""

    def __init__(
        self,
        backend: str = "auto",
        workers: int | None = None,
        start_method: str = "auto",
    ):
        requested = (backend or "auto").strip().lower()
        if requested not in SUPPORTED_BACKENDS:
            raise ValueError(
                f"Unsupported extraction backend '{backend}'. "
                f"Valid options: {sorted(SUPPORTED_BACKENDS)}"
            )
        requested_start = (start_method or "auto").strip().lower()
        if requested_start not in SUPPORTED_START_METHODS:
            raise ValueError(
                f"Unsupported start method '{start_method}'. "
                f"Valid options: {sorted(SUPPORTED_START_METHODS)}"
            )

        self.requested_backend = requested
        self.requested_start_method = requested_start
        if workers is None or workers <= 0:
            self.workers = DEFAULT_WORKERS
        else:
            self.workers = workers

        self.backend_note: str | None = None
        self.backend = self._resolve_backend(requested)
        self.start_method = self._resolve_start_method(requested_start)
        self._executor: ProcessPoolExecutor | None = None

    def _resolve_backend(self, requested: str) -> str:
        if requested == "auto":
            return "process" if self.workers > 1 else "serial"

        if requested == "process":
            if self.workers <= 1:
                self.backend_note = "workers <= 1, falling back to serial backend"
                return "serial"
            return "process"

        if requested == "ray":
            fallback_backend = "process" if self.workers > 1 else "serial"
            try:
                import ray  # noqa: F401

                self.backend_note = f"ray backend hook detected; using local {fallback_backend} backend"
            except Exception:
                self.backend_note = f"ray not available; falling back to local {fallback_backend} backend"
            return fallback_backend

        if requested == "dask":
            fallback_backend = "process" if self.workers > 1 else "serial"
            try:
                import dask  # noqa: F401

                self.backend_note = f"dask backend hook detected; using local {fallback_backend} backend"
            except Exception:
                self.backend_note = f"dask not available; falling back to local {fallback_backend} backend"
            return fallback_backend

        return "serial"

    def _get_executor(self) -> ProcessPoolExecutor:
        if self._executor is None:
            kwargs: dict = {"max_workers": self.workers}
            if self.start_method:
                kwargs["mp_context"] = mp.get_context(self.start_method)
            self._executor = ProcessPoolExecutor(**kwargs)
        return self._executor

    def _resolve_start_method(self, requested: str) -> str | None:
        if self.backend != "process":
            return None

        if requested != "auto":
            return requested

        # Prefer fork on POSIX for lower startup overhead; fallback to spawn.
        if os.name == "posix":
            return "fork"
        return "spawn"

    def prime(self) -> None:
        """Eagerly initialize process pool so startup cost is paid upfront."""
        if self.backend == "process":
            self._get_executor()

    def extract_batch(
        self,
        files: Sequence[tuple[str, str]],
        vault_path: str,
    ) -> list[ExtractionResult]:
        return list(self.iter_extract_batch(files=files, vault_path=vault_path))

    def iter_extract_batch(
        self,
        files: Sequence[tuple[str, str]],
        vault_path: str,
    ) -> Iterator[ExtractionResult]:
        if not files:
            return iter(())

        payload = [(abs_path, rel_path, vault_path) for abs_path, rel_path in files]

        if self.backend == "serial":
            def serial_iter() -> Iterator[ExtractionResult]:
                for task in payload:
                    yield _extract_file_worker(task)
            return serial_iter()

        executor = self._get_executor()
        # Process results in completion order so one slow file does not stall
        # the whole batch (head-of-line blocking).
        def process_iter() -> Iterator[ExtractionResult]:
            futures = [executor.submit(_extract_file_worker, task) for task in payload]
            for fut in as_completed(futures):
                yield fut.result()

        return process_iter()

    def shutdown(self) -> None:
        if self._executor is not None:
            self._executor.shutdown(wait=True, cancel_futures=False)
            self._executor = None

    def __enter__(self) -> "DistributedExtractionCoordinator":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:  # pragma: no cover
        self.shutdown()


__all__ = [
    "DistributedExtractionCoordinator",
    "ExtractionResult",
    "SUPPORTED_BACKENDS",
    "SUPPORTED_START_METHODS",
    "default_worker_count",
]
