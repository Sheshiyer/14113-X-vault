"""
epub_extractor.py — EPUB text extraction, HTML cleaning, and chunking
for the PARA Vault Memory Index.

Uses ebooklib for chapter-by-chapter extraction and BeautifulSoup
for HTML-to-text cleaning.

Functions:
    extract_epub(path)       → ExtractedDoc
    extract_epub_meta(path)  → dict
    clean_html(html)         → str
    chunk_epub(doc)          → list[Chunk]
    safe_extract_epub(path)  → (ExtractedDoc | None, error | None)
"""

from __future__ import annotations

import os
import re
import sys
from typing import Optional

import warnings

from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning
from ebooklib import epub, ITEM_DOCUMENT

warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

# Allow imports from parent package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from chunker import Chunk, split_paragraphs, MAX_CHUNK_CHARS
from extractors import ExtractedDoc


# ---------------------------------------------------------------------------
# B-W3-04: HTML-to-text cleaner
# ---------------------------------------------------------------------------

_WS_RE = re.compile(r"\n{3,}")
_SPACE_RE = re.compile(r"[ \t]{2,}")


def clean_html(html: str) -> str:
    """Strip HTML tags and normalize whitespace.

    Uses BeautifulSoup to extract visible text, then collapses
    excessive whitespace while preserving paragraph breaks.
    """
    if not html:
        return ""

    soup = BeautifulSoup(html, "lxml")

    # Remove script and style elements
    for tag in soup(["script", "style", "head"]):
        tag.decompose()

    text = soup.get_text(separator="\n")

    # Normalize whitespace
    text = _SPACE_RE.sub(" ", text)
    text = _WS_RE.sub("\n\n", text)

    return text.strip()


# ---------------------------------------------------------------------------
# B-W3-02: EPUB metadata extractor
# ---------------------------------------------------------------------------

def extract_epub_meta(path: str) -> dict:
    """Extract metadata from an EPUB file.

    Returns a dict with keys: title, author, language.
    """
    try:
        book = epub.read_epub(path, options={"ignore_ncx": True})
        title = ""
        author = ""
        language = ""

        t = book.get_metadata("DC", "title")
        if t:
            title = t[0][0] if isinstance(t[0], tuple) else str(t[0])

        a = book.get_metadata("DC", "creator")
        if a:
            author = a[0][0] if isinstance(a[0], tuple) else str(a[0])

        l = book.get_metadata("DC", "language")
        if l:
            language = l[0][0] if isinstance(l[0], tuple) else str(l[0])

        return {
            "title": title.strip(),
            "author": author.strip(),
            "language": language.strip(),
        }
    except Exception:
        return {"title": "", "author": "", "language": ""}


# ---------------------------------------------------------------------------
# B-W3-01: EPUB text extractor (chapter-by-chapter)
# ---------------------------------------------------------------------------

def extract_epub(path: str) -> ExtractedDoc:
    """Extract text from an EPUB file, chapter by chapter.

    Parameters
    ----------
    path : str
        Absolute path to the EPUB file.

    Returns
    -------
    ExtractedDoc
        With ``chapters`` populated for chapter-aware chunking.
    """
    book = epub.read_epub(path, options={"ignore_ncx": True})
    meta = extract_epub_meta(path)

    chapter_texts: list[str] = []
    chapter_names: list[str] = []

    items = list(book.get_items_of_type(ITEM_DOCUMENT))

    for idx, item in enumerate(items):
        raw_html = item.get_content().decode("utf-8", errors="replace")
        text = clean_html(raw_html)

        if not text.strip():
            continue

        # Try to extract chapter title from first heading in HTML
        soup = BeautifulSoup(raw_html, "lxml")
        heading_tag = soup.find(["h1", "h2", "h3"])
        if heading_tag and heading_tag.get_text(strip=True):
            chapter_name = heading_tag.get_text(strip=True)[:100]
        else:
            chapter_name = f"Chapter {len(chapter_texts) + 1}"

        chapter_texts.append(text)
        chapter_names.append(chapter_name)

    full_text = "\n\n".join(chapter_texts)

    return ExtractedDoc(
        text=full_text,
        source_path=path,
        format="epub",
        page_count=len(chapter_texts),
        extraction_quality=1.0 if len(full_text) > 100 else 0.0,
        metadata=meta,
        chapters=chapter_names,
        page_texts=chapter_texts,  # reuse page_texts for chapter texts
    )


# ---------------------------------------------------------------------------
# B-W3-03: Chapter-aware EPUB chunker
# ---------------------------------------------------------------------------

def chunk_epub(doc: ExtractedDoc) -> list[Chunk]:
    """Chunk extracted EPUB text, preserving chapter info.

    Each chunk is tagged with its chapter name via the ``heading`` field.
    """
    chunks: list[Chunk] = []
    offset = 0

    for ch_idx, (ch_text, ch_name) in enumerate(zip(doc.page_texts, doc.chapters)):
        ch_text = ch_text.strip()
        if not ch_text:
            offset += len(doc.page_texts[ch_idx]) + 2
            continue

        paras = split_paragraphs(ch_text, MAX_CHUNK_CHARS)

        for para in paras:
            if para.strip():
                chunks.append(Chunk(
                    heading=ch_name,
                    text=para,
                    char_offset=offset,
                ))
            offset += len(para)

        offset += 2  # \n\n between chapters

    return chunks


# ---------------------------------------------------------------------------
# B-W3-05: Error-safe wrapper
# ---------------------------------------------------------------------------

def safe_extract_epub(path: str) -> tuple[Optional[ExtractedDoc], Optional[str]]:
    """Extract an EPUB with error handling.

    Returns ``(doc, None)`` on success or ``(None, error_reason)`` on failure.
    """
    try:
        doc = extract_epub(path)
        return doc, None
    except epub.EpubException as e:
        return None, f"epub_error: {e}"
    except UnicodeDecodeError:
        return None, "encoding_error"
    except KeyError as e:
        if "drm" in str(e).lower() or "encrypt" in str(e).lower():
            return None, "drm_protected"
        return None, f"key_error: {e}"
    except Exception as e:
        return None, f"unknown: {type(e).__name__}: {e}"


# ---------------------------------------------------------------------------
# Module exports
# ---------------------------------------------------------------------------

__all__ = [
    "extract_epub",
    "extract_epub_meta",
    "clean_html",
    "chunk_epub",
    "safe_extract_epub",
]
