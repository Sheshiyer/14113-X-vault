"""
pdf_extractor.py — PDF text extraction, quality scoring, and chunking
for the PARA Vault Memory Index.

Uses PyMuPDF (fitz) for page-by-page text extraction.

Functions:
    extract_pdf(path)        → ExtractedDoc
    extract_pdf_meta(path)   → dict
    score_pdf_quality(doc)   → float
    is_scanned(path)         → bool
    chunk_pdf(doc)           → list[Chunk]
"""

from __future__ import annotations

import os
import sys
from typing import Optional

import fitz  # PyMuPDF

# Allow imports from parent package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from chunker import Chunk, split_paragraphs, sliding_window, MAX_CHUNK_CHARS
from extractors import ExtractedDoc


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

_SCANNED_CHARS_PER_PAGE = 50   # below this = likely scanned/image PDF
_MIN_QUALITY_THRESHOLD = 0.10  # quality score below this = skip


# ---------------------------------------------------------------------------
# B-W2-02: PDF metadata extractor
# ---------------------------------------------------------------------------

def extract_pdf_meta(path: str) -> dict:
    """Extract metadata from a PDF file (title, author, page count).

    Returns a dict with keys: title, author, subject, creator, pages.
    Missing fields are empty strings.
    """
    try:
        with fitz.open(path) as doc:
            meta = doc.metadata or {}
            return {
                "title": (meta.get("title") or "").strip(),
                "author": (meta.get("author") or "").strip(),
                "subject": (meta.get("subject") or "").strip(),
                "creator": (meta.get("creator") or "").strip(),
                "pages": doc.page_count,
            }
    except Exception:
        return {"title": "", "author": "", "subject": "", "creator": "", "pages": 0}


# ---------------------------------------------------------------------------
# B-W2-01: PDF text extractor (page-by-page)
# ---------------------------------------------------------------------------

def extract_pdf(path: str) -> ExtractedDoc:
    """Extract text from a PDF file, page by page.

    Parameters
    ----------
    path : str
        Absolute path to the PDF file.

    Returns
    -------
    ExtractedDoc
        With ``page_texts`` populated for page-aware chunking.

    Raises
    ------
    Exception
        On corrupt or password-protected files — caller should handle.
    """
    page_texts: list[str] = []

    with fitz.open(path) as doc:
        meta = extract_pdf_meta(path)
        for page in doc:
            text = page.get_text("text")
            page_texts.append(text)

    full_text = "\n\n".join(page_texts)

    extracted = ExtractedDoc(
        text=full_text,
        source_path=path,
        format="pdf",
        page_count=len(page_texts),
        metadata=meta,
        page_texts=page_texts,
    )
    extracted.extraction_quality = score_pdf_quality(extracted)
    return extracted


# ---------------------------------------------------------------------------
# B-W2-03: PDF quality scorer
# ---------------------------------------------------------------------------

def score_pdf_quality(doc: ExtractedDoc) -> float:
    """Score extraction quality based on text density per page.

    Returns a float 0.0–1.0:
    - 0.0 = no text at all (fully scanned/image)
    - < 0.2 = likely scanned (sparse OCR artifacts)
    - > 0.7 = good text extraction
    - 1.0 = dense text content
    """
    if doc.page_count == 0:
        return 0.0

    total_chars = sum(len(t.strip()) for t in doc.page_texts)
    chars_per_page = total_chars / doc.page_count

    if chars_per_page == 0:
        return 0.0
    elif chars_per_page < _SCANNED_CHARS_PER_PAGE:
        return round(chars_per_page / _SCANNED_CHARS_PER_PAGE * 0.2, 3)
    elif chars_per_page < 500:
        return round(0.2 + (chars_per_page - _SCANNED_CHARS_PER_PAGE) / 450 * 0.5, 3)
    else:
        # Cap at 1.0
        return round(min(0.7 + (chars_per_page - 500) / 2000 * 0.3, 1.0), 3)


# ---------------------------------------------------------------------------
# B-W2-05: Scanned-PDF detector
# ---------------------------------------------------------------------------

def is_scanned(path: str) -> bool:
    """Detect whether a PDF is likely scanned (image-only).

    Returns ``True`` if average text per page is below threshold.
    """
    try:
        with fitz.open(path) as doc:
            if doc.page_count == 0:
                return True
            # Sample first 10 pages for speed
            sample_pages = min(doc.page_count, 10)
            total_chars = 0
            for i in range(sample_pages):
                total_chars += len(doc[i].get_text("text").strip())
            avg = total_chars / sample_pages
            return avg < _SCANNED_CHARS_PER_PAGE
    except Exception:
        return True


# ---------------------------------------------------------------------------
# B-W2-04: Page-aware PDF chunker
# ---------------------------------------------------------------------------

def chunk_pdf(doc: ExtractedDoc) -> list[Chunk]:
    """Chunk extracted PDF text, preserving page boundary info.

    Strategy:
    1. Process each page's text through paragraph splitting.
    2. Tag each chunk with its source page number.
    3. Oversized paragraphs fall back to sliding window.

    Parameters
    ----------
    doc : ExtractedDoc
        Result from ``extract_pdf()``.

    Returns
    -------
    list[Chunk]
        Chunks with ``heading`` set to ``"Page N"`` for page reference.
    """
    chunks: list[Chunk] = []
    offset = 0

    for page_idx, page_text in enumerate(doc.page_texts):
        page_text = page_text.strip()
        if not page_text:
            offset += len(doc.page_texts[page_idx]) + 2  # account for \n\n join
            continue

        page_label = f"Page {page_idx + 1}"

        # Split page text into paragraph-sized chunks
        paras = split_paragraphs(page_text, MAX_CHUNK_CHARS)

        for para in paras:
            if para.strip():
                chunks.append(Chunk(
                    heading=page_label,
                    text=para,
                    char_offset=offset,
                ))
            offset += len(para)

        offset += 2  # \n\n between pages

    return chunks


# ---------------------------------------------------------------------------
# B-W2-06: Error-safe wrapper
# ---------------------------------------------------------------------------

def safe_extract_pdf(path: str) -> tuple[Optional[ExtractedDoc], Optional[str]]:
    """Extract a PDF with error handling.

    Returns
    -------
    (doc, error) : tuple
        ``doc`` is the ExtractedDoc on success (error=None),
        or ``None`` on failure (error=reason string).
    """
    try:
        doc = extract_pdf(path)
        return doc, None
    except fitz.FileDataError:
        return None, "corrupt"
    except fitz.FileNotFoundError:
        return None, "not_found"
    except RuntimeError as e:
        if "password" in str(e).lower() or "encrypted" in str(e).lower():
            return None, "password_protected"
        return None, f"runtime_error: {e}"
    except Exception as e:
        return None, f"unknown: {type(e).__name__}: {e}"


# ---------------------------------------------------------------------------
# Module exports
# ---------------------------------------------------------------------------

__all__ = [
    "extract_pdf",
    "extract_pdf_meta",
    "score_pdf_quality",
    "is_scanned",
    "chunk_pdf",
    "safe_extract_pdf",
]
