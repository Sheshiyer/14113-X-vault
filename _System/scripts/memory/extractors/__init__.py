"""
extractors — Text extraction modules for PDF, EPUB, and DOCX files.

Provides a unified interface for extracting text from binary document
formats, chunking the extracted text, and routing by file extension.

Classes:
    ExtractedDoc  — common result type from all extractors
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass(slots=True)
class ExtractedDoc:
    """Result of extracting text from a binary document.

    Attributes
    ----------
    text : str
        Full extracted plain text.
    source_path : str
        Absolute path to the source file.
    format : str
        File format identifier: ``"pdf"``, ``"epub"``, ``"docx"``.
    page_count : int
        Number of pages (PDF) or chapters (EPUB). 0 if unknown.
    extraction_quality : float
        Quality score 0.0–1.0 (text density). 1.0 = perfect text extraction.
    metadata : dict
        Format-specific metadata (title, author, language, etc.).
    chapters : list[str]
        Chapter/section titles for EPUBs, empty for other formats.
    page_texts : list[str]
        Per-page text for PDFs (for page-aware chunking). Empty for other formats.
    """

    text: str
    source_path: str
    format: str
    page_count: int = 0
    extraction_quality: float = 1.0
    metadata: dict = field(default_factory=dict)
    chapters: list[str] = field(default_factory=list)
    page_texts: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# B-W5-01: Format router
# ---------------------------------------------------------------------------

_EXTRACTOR_MAP: dict[str, str] = {
    ".pdf": "pdf",
    ".epub": "epub",
    ".docx": "docx",
}


def extract_file(path: str) -> tuple[Optional["ExtractedDoc"], Optional[str]]:
    """Route extraction to the correct format handler.

    Returns ``(doc, None)`` on success or ``(None, error)`` on failure.
    """
    import os
    ext = os.path.splitext(path)[1].lower()

    if ext == ".pdf":
        from extractors.pdf_extractor import safe_extract_pdf
        return safe_extract_pdf(path)
    elif ext == ".epub":
        from extractors.epub_extractor import safe_extract_epub
        return safe_extract_epub(path)
    elif ext == ".docx":
        from extractors.docx_extractor import safe_extract_docx
        return safe_extract_docx(path)
    else:
        return None, f"unsupported_format: {ext}"


# ---------------------------------------------------------------------------
# B-W5-02: Unified chunk_file()
# ---------------------------------------------------------------------------

def chunk_file(path: str) -> tuple[list, Optional["ExtractedDoc"], Optional[str]]:
    """Extract and chunk a binary document in one call.

    Returns ``(chunks, doc, None)`` on success or ``([], None, error)`` on failure.
    Chunks are ``Chunk`` dataclass instances from ``chunker.py``.
    """
    doc, err = extract_file(path)
    if doc is None:
        return [], None, err

    import os
    ext = os.path.splitext(path)[1].lower()

    if ext == ".pdf":
        from extractors.pdf_extractor import chunk_pdf
        return chunk_pdf(doc), doc, None
    elif ext == ".epub":
        from extractors.epub_extractor import chunk_epub
        return chunk_epub(doc), doc, None
    elif ext == ".docx":
        from extractors.docx_extractor import chunk_docx
        return chunk_docx(doc), doc, None
    else:
        return [], doc, f"no_chunker_for: {ext}"


__all__ = [
    "ExtractedDoc",
    "extract_file",
    "chunk_file",
]
