"""
batch_processor.py — Memory-safe batch processing with checkpoint/resume
for indexing large document corpora.
"""

from __future__ import annotations

import json
import os
import resource
import sys
import time
import re
import hashlib
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, TextIO

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chunker import Chunk, chunk_markdown, chunk_txt, extract_frontmatter, MAX_CHUNK_CHARS, QualityScorer
from walker import walk_vault, safe_read, is_noisy, prepend_context, build_meta, ALL_EXTENSIONS
from extractors import chunk_file, ExtractedDoc
from extractors.pdf_extractor import parse_page_heading


# ---------------------------------------------------------------------------
# B-W6-03: Error aggregator
# ---------------------------------------------------------------------------

class ErrorAggregator:
    """Collect and summarize extraction errors by type."""

    def __init__(self):
        self.counts: dict[str, int] = {}
        self.examples: dict[str, list[str]] = {}  # first 3 per type

    def add(self, rel_path: str, error: str) -> None:
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
        self.journal_path = f"{path}.journal"
        self.processed_files: set[str] = set()
        self.last_batch: int = 0
        self._dirty_paths: list[str] = []
        self._journal_handle: TextIO | None = None

    def _open_journal(self) -> TextIO:
        if self._journal_handle is None:
            os.makedirs(os.path.dirname(self.journal_path), exist_ok=True)
            self._journal_handle = open(self.journal_path, "a", encoding="utf-8", buffering=1)
        return self._journal_handle

    def _write_snapshot(self) -> None:
        data = {
            "processed_files": sorted(self.processed_files),
            "last_batch": self.last_batch,
            "saved_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        }
        tmp_path = f"{self.path}.tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        os.replace(tmp_path, self.path)

        # Snapshot is authoritative; truncate journal to keep resume fast.
        if self._journal_handle is not None:
            self._journal_handle.seek(0)
            self._journal_handle.truncate()
            self._journal_handle.flush()
        elif os.path.exists(self.journal_path):
            with open(self.journal_path, "w", encoding="utf-8"):
                pass

    def save(self, snapshot_interval: int = 2000) -> None:
        # Fast path: append only newly marked files for exact per-file resume.
        if self._dirty_paths:
            fh = self._open_journal()
            batch_marker = self.last_batch
            for rel_path in self._dirty_paths:
                rec = {"rel_path": rel_path, "last_batch": batch_marker}
                fh.write(json.dumps(rec, ensure_ascii=False, separators=(",", ":")) + "\n")
            fh.flush()
            self._dirty_paths.clear()

        # Periodically compact to snapshot + empty journal.
        if snapshot_interval > 0 and (self.last_batch % snapshot_interval == 0):
            self._write_snapshot()

    def load(self) -> bool:
        loaded_any = False
        if os.path.exists(self.path):
            with open(self.path, encoding="utf-8") as f:
                data = json.load(f)
            self.processed_files = set(data.get("processed_files", []))
            self.last_batch = data.get("last_batch", 0)
            loaded_any = True

        if os.path.exists(self.journal_path):
            with open(self.journal_path, encoding="utf-8") as jf:
                for line in jf:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        rec = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    rel_path = rec.get("rel_path")
                    if isinstance(rel_path, str) and rel_path:
                        self.processed_files.add(rel_path)
                        loaded_any = True
                    lb = rec.get("last_batch")
                    if isinstance(lb, int) and lb > self.last_batch:
                        self.last_batch = lb
        return loaded_any

    def mark(self, rel_path: str) -> None:
        if rel_path in self.processed_files:
            return
        self.processed_files.add(rel_path)
        self._dirty_paths.append(rel_path)

    def is_done(self, rel_path: str) -> bool:
        return rel_path in self.processed_files

    def delete(self) -> None:
        self.close()
        if os.path.exists(self.path):
            os.unlink(self.path)
        if os.path.exists(self.journal_path):
            os.unlink(self.journal_path)

    def close(self) -> None:
        if self._dirty_paths:
            # Persist any pending marks before closing.
            self.save(snapshot_interval=0)
        if self._journal_handle is not None:
            self._journal_handle.close()
            self._journal_handle = None


# ---------------------------------------------------------------------------
# B-W6-05: Memory monitor
# ---------------------------------------------------------------------------

def get_rss_mb() -> float:
    usage = resource.getrusage(resource.RUSAGE_SELF)
    if sys.platform == "darwin":
        return usage.ru_maxrss / (1024 * 1024)
    return usage.ru_maxrss / 1024


def check_memory(label: str = "") -> bool:
    rss = get_rss_mb()
    if rss > 6000:
        print(f"  ⚠ Memory warning ({label}): RSS = {rss:.0f} MB", file=sys.stderr)
        return False
    return True


# ---------------------------------------------------------------------------
# B-W6-07: Deduplicator (Day 5)
# ---------------------------------------------------------------------------

class Deduplicator:
    """Track chunk hashes to avoid near-duplicate indexing."""
    def __init__(self):
        self.seen_hashes: set[str] = set()

    def is_duplicate(self, text: str) -> bool:
        normalized = "".join(re.findall(r"\w+", text.lower()))
        if not normalized: return True
        h = hashlib.sha256(normalized.encode()).hexdigest()
        if h in self.seen_hashes:
            return True
        self.seen_hashes.add(h)
        return False

_DEDUPE = Deduplicator()


# ---------------------------------------------------------------------------
# B-W6-01 + B-W6-02: Batch file processor with progress
# ---------------------------------------------------------------------------

def process_file(
    abs_path: str,
    rel_path: str,
    vault_path: str,
    errors: ErrorAggregator,
    scanned_log: list[str],
    dedupe: bool = True,
) -> tuple[list[str], list[dict]]:
    ext = os.path.splitext(rel_path)[1].lower()

    if ext in (".md", ".txt"):
        content = safe_read(abs_path)
        if not content:
            errors.add(rel_path, "encoding_error")
            return [], []
        if is_noisy(content):
            errors.add(rel_path, "noisy")
            return [], []

        is_md = ext == ".md"
        frontmatter, body = extract_frontmatter(content) if is_md else (None, content)

        if len(body.strip()) < 50:
            errors.add(rel_path, "too_short_body")
            return [], []

        chunks = chunk_markdown(body) if is_md else chunk_txt(body)
        if not chunks:
            errors.add(rel_path, "no_chunks")
            return [], []

        texts, meta = [], []
        for ci, chunk in enumerate(chunks):
            q_score = QualityScorer.score(chunk.text, chunk.heading)
            if q_score < 0.3: continue
            if dedupe and _DEDUPE.is_duplicate(chunk.text): continue

            texts.append(prepend_context(chunk.text, rel_path, chunk.heading))
            m = build_meta(
                rel_path,
                chunk.heading,
                frontmatter,
                ci,
                vault_root=vault_path,
                text=chunk.text,
                quality_score=q_score,
            )
            m["file_format"] = ext.lstrip(".")
            meta.append(m)
        return texts, meta

    if ext in (".pdf", ".epub", ".docx"):
        chunks_list, doc, err = chunk_file(abs_path)
        if err:
            errors.add(rel_path, err)
            return [], []
        if not chunks_list:
            errors.add(rel_path, "no_chunks")
            return [], []

        if ext == ".pdf" and doc and doc.extraction_quality < 0.2:
            ocr_used = bool((doc.metadata or {}).get("ocr_used"))
            if not ocr_used:
                scanned_log.append(rel_path)
                errors.add(rel_path, "scanned_pdf")
                return [], []

        texts, meta = [], []
        fmt_label = ext.lstrip(".")
        for ci, chunk in enumerate(chunks_list):
            q_score = QualityScorer.score(chunk.text, chunk.heading)
            if q_score < 0.3: continue
            if dedupe and _DEDUPE.is_duplicate(chunk.text): continue

            texts.append(prepend_context(chunk.text, rel_path, chunk.heading))
            m = build_meta(
                rel_path,
                chunk.heading,
                None,
                ci,
                vault_root=vault_path,
                text=chunk.text,
                quality_score=q_score,
            )
            m["file_format"] = fmt_label
            if doc and doc.metadata:
                if doc.metadata.get("title"): m["doc_title"] = doc.metadata["title"]
                if doc.metadata.get("author"): m["doc_author"] = doc.metadata["author"]
            if ext == ".pdf":
                page_number, page_label = parse_page_heading(chunk.heading)
                if page_label:
                    m["page"] = page_label  # backward-compatible key
                    m["page_label"] = page_label
                if page_number is not None:
                    m["page_number"] = page_number
            elif ext == ".epub" and chunk.heading:
                m["chapter"] = chunk.heading
            meta.append(m)
        return texts, meta

    errors.add(rel_path, f"unsupported_format:{ext}")
    return [], []


def save_scanned_log(scanned: list[str], path: str) -> None:
    with open(path, "w") as f:
        for p in sorted(scanned): f.write(p + "\n")


__all__ = ["ErrorAggregator", "Checkpoint", "check_memory", "get_rss_mb", "process_file", "save_scanned_log"]
