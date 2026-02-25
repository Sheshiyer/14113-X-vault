"""
docx_extractor.py — DOCX text extraction and chunking
for the PARA Vault Memory Index.

Uses python-docx for paragraph-by-paragraph extraction.

Functions:
    extract_docx(path)       → ExtractedDoc
    chunk_docx(doc)          → list[Chunk]
    safe_extract_docx(path)  → (ExtractedDoc | None, error | None)
"""

from __future__ import annotations

import os
import sys
from typing import Optional

import docx

# Allow imports from parent package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from chunker import Chunk, split_paragraphs, MAX_CHUNK_CHARS
from extractors import ExtractedDoc


# ---------------------------------------------------------------------------
# B-W4-01: DOCX text extractor
# ---------------------------------------------------------------------------

def extract_docx(path: str) -> ExtractedDoc:
    """Extract text from a DOCX file, paragraph by paragraph.

    Parameters
    ----------
    path : str
        Absolute path to the DOCX file.

    Returns
    -------
    ExtractedDoc
        Plain text with metadata from core properties.
    """
    doc = docx.Document(path)

    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    full_text = "\n\n".join(paragraphs)

    # Extract metadata from core properties
    meta: dict = {}
    cp = doc.core_properties
    if cp:
        meta["title"] = (cp.title or "").strip()
        meta["author"] = (cp.author or "").strip()
        meta["subject"] = (cp.subject or "").strip()

    return ExtractedDoc(
        text=full_text,
        source_path=path,
        format="docx",
        page_count=0,  # DOCX doesn't expose page count easily
        extraction_quality=1.0 if len(full_text) > 50 else 0.0,
        metadata=meta,
    )


# ---------------------------------------------------------------------------
# B-W4-02: DOCX chunker (reuses paragraph splitter)
# ---------------------------------------------------------------------------

def chunk_docx(doc: ExtractedDoc) -> list[Chunk]:
    """Chunk extracted DOCX text using the standard paragraph splitter."""
    text = doc.text.strip()
    if not text:
        return []

    paras = split_paragraphs(text, MAX_CHUNK_CHARS)
    chunks: list[Chunk] = []
    offset = 0

    for para in paras:
        if para.strip():
            chunks.append(Chunk(
                heading=None,
                text=para,
                char_offset=offset,
            ))
        offset += len(para)

    return chunks


# ---------------------------------------------------------------------------
# B-W4-03: Error-safe wrapper
# ---------------------------------------------------------------------------

def safe_extract_docx(path: str) -> tuple[Optional[ExtractedDoc], Optional[str]]:
    """Extract a DOCX with error handling."""
    try:
        doc = extract_docx(path)
        return doc, None
    except docx.opc.exceptions.PackageNotFoundError:
        return None, "not_found"
    except Exception as e:
        return None, f"unknown: {type(e).__name__}: {e}"


__all__ = [
    "extract_docx",
    "chunk_docx",
    "safe_extract_docx",
]
