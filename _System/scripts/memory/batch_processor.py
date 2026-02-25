"""
batch_processor.py — Memory-safe batch processing with checkpoint/resume
for indexing large document corpora (47+ GB of PDFs, EPUBs, DOCX).

Classes:
    BatchProcessor  — main processor with configurable batch size
    ErrorAggregator — counts errors by type
    Checkpoint      — save/load progress for resume after interruption
"""

from __future__ import annotations

import json
import os
import resource
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chunker import Chunk, chunk_markdown, chunk_txt, extract_frontmatter, MAX_CHUNK_CHARS
from walker import walk_vault, safe_read, is_noisy, prepend_context, build_meta, ALL_EXTENSIONS
from extractors import chunk_file, ExtractedDoc
from extractors.pdf_extractor import is_scanned as pdf_is_scanned


# ---------------------------------------------------------------------------
# B-W6-03: Error aggregator
# ---------------------------------------------------------------------------

class ErrorAggregator:
    """Collect and summarize extraction errors by type."""

    def __init__(self):
        self.counts: dict[str, int] = {}
        self.examples: dict[str, list[str]] = {}  # first 3 per type

    def add(self, rel_path: str, error: str) -> None:
        # Normalize error type
        err_type = error.split(":")[0] if ":" in error else error
        self.counts[err_type] = self.counts.get(err_type, 0) + 1
        examples = self.examples.setdefault(err_type, [])
        if len(examples) < 3:
            examples.append(rel_path)

    @property
    def total(self) -> int:
        return sum(self.counts.values())

    def summary(self) -> dict:
        return {
            "total_errors": self.total,
            "by_type": dict(self.counts),
            "examples": dict(self.examples),
        }

    def print_summary(self) -> None:
        if not self.counts:
            print("  No extraction errors.")
            return
        print(f"  Extraction errors: {self.total} total")
        for err_type, count in sorted(self.counts.items(), key=lambda x: -x[1]):
            print(f"    {err_type}: {count}")


# ---------------------------------------------------------------------------
# B-W6-04: Checkpoint for resume
# ---------------------------------------------------------------------------

class Checkpoint:
    """Save and load batch processing progress for resume after interruption."""

    def __init__(self, path: str):
        self.path = path
        self.processed_files: set[str] = set()
        self.last_batch: int = 0

    def save(self) -> None:
        data = {
            "processed_files": sorted(self.processed_files),
            "last_batch": self.last_batch,
            "saved_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        }
        with open(self.path, "w") as f:
            json.dump(data, f, indent=2)

    def load(self) -> bool:
        """Load checkpoint. Returns True if loaded, False if no checkpoint."""
        if not os.path.exists(self.path):
            return False
        with open(self.path) as f:
            data = json.load(f)
        self.processed_files = set(data.get("processed_files", []))
        self.last_batch = data.get("last_batch", 0)
        return True

    def mark(self, rel_path: str) -> None:
        self.processed_files.add(rel_path)

    def is_done(self, rel_path: str) -> bool:
        return rel_path in self.processed_files

    def delete(self) -> None:
        if os.path.exists(self.path):
            os.unlink(self.path)


# ---------------------------------------------------------------------------
# B-W6-05: Memory monitor
# ---------------------------------------------------------------------------

def get_rss_mb() -> float:
    """Get current process RSS in MB (macOS/Linux)."""
    usage = resource.getrusage(resource.RUSAGE_SELF)
    # macOS reports in bytes, Linux in KB
    if sys.platform == "darwin":
        return usage.ru_maxrss / (1024 * 1024)
    return usage.ru_maxrss / 1024


_MEMORY_WARN_MB = 6000  # warn if RSS > 6 GB


def check_memory(label: str = "") -> bool:
    """Log warning if memory usage exceeds threshold. Returns True if OK."""
    rss = get_rss_mb()
    if rss > _MEMORY_WARN_MB:
        print(f"  ⚠ Memory warning{' (' + label + ')' if label else ''}: "
              f"RSS = {rss:.0f} MB (threshold {_MEMORY_WARN_MB} MB)",
              file=sys.stderr)
        return False
    return True


# ---------------------------------------------------------------------------
# B-W6-01 + B-W6-02: Batch file processor with progress
# ---------------------------------------------------------------------------

def process_file(
    abs_path: str,
    rel_path: str,
    vault_path: str,
    errors: ErrorAggregator,
    scanned_log: list[str],
) -> tuple[list[str], list[dict]]:
    """Process a single file into texts + metadata for embedding.

    Returns (texts, meta) parallel lists. Empty on skip/error.
    """
    ext = os.path.splitext(rel_path)[1].lower()

    # --- Markdown / TXT: existing Phase A pipeline ---
    if ext in (".md", ".txt"):
        content = safe_read(abs_path)
        if not content:
            errors.add(rel_path, "encoding_error")
            return [], []
        if is_noisy(content):
            errors.add(rel_path, "noisy")
            return [], []

        is_md = ext == ".md"
        frontmatter = None
        body = content
        if is_md:
            frontmatter, body = extract_frontmatter(content)

        if len(body.strip()) < 50:
            errors.add(rel_path, "too_short_body")
            return [], []

        chunks = chunk_markdown(body) if is_md else chunk_txt(body)
        if not chunks:
            errors.add(rel_path, "no_chunks")
            return [], []

        texts = []
        meta = []
        for ci, chunk in enumerate(chunks):
            texts.append(prepend_context(chunk.text, rel_path, chunk.heading))
            m = build_meta(rel_path, chunk.heading, frontmatter, ci)
            m["file_format"] = ext.lstrip(".")
            meta.append(m)
        return texts, meta

    # --- Binary formats: PDF / EPUB / DOCX ---
    if ext in (".pdf", ".epub", ".docx"):
        chunks_list, doc, err = chunk_file(abs_path)
        if err:
            errors.add(rel_path, err)
            return [], []

        if not chunks_list:
            errors.add(rel_path, "no_chunks")
            return [], []

        # Flag scanned PDFs
        if ext == ".pdf" and doc and doc.extraction_quality < 0.2:
            scanned_log.append(rel_path)
            errors.add(rel_path, "scanned_pdf")
            return [], []

        texts = []
        meta = []
        fmt_label = ext.lstrip(".")
        for ci, chunk in enumerate(chunks_list):
            texts.append(prepend_context(chunk.text, rel_path, chunk.heading))
            m = build_meta(rel_path, chunk.heading, None, ci)
            m["file_format"] = fmt_label
            # Add format-specific metadata
            if doc and doc.metadata:
                if doc.metadata.get("title"):
                    m["doc_title"] = doc.metadata["title"]
                if doc.metadata.get("author"):
                    m["doc_author"] = doc.metadata["author"]
            if ext == ".pdf" and chunk.heading and chunk.heading.startswith("Page"):
                m["page"] = chunk.heading
            elif ext == ".epub" and chunk.heading:
                m["chapter"] = chunk.heading
            meta.append(m)
        return texts, meta

    errors.add(rel_path, f"unsupported_format:{ext}")
    return [], []


# ---------------------------------------------------------------------------
# B-W6-06: Scanned PDF logger
# ---------------------------------------------------------------------------

def save_scanned_log(scanned: list[str], path: str) -> None:
    """Write list of scanned PDFs to a text file."""
    with open(path, "w") as f:
        for p in sorted(scanned):
            f.write(p + "\n")


__all__ = [
    "ErrorAggregator",
    "Checkpoint",
    "check_memory",
    "get_rss_mb",
    "process_file",
    "save_scanned_log",
]
