"""EPUB text extraction."""

from pathlib import Path
from typing import Dict
import logging

try:
    import ebooklib
    from ebooklib import epub
    EBOOKLIB_AVAILABLE = True
except ImportError:
    EBOOKLIB_AVAILABLE = False

try:
    from bs4 import BeautifulSoup
    BS4_AVAILABLE = True
except ImportError:
    BS4_AVAILABLE = False


class EPUBExtractor:
    """Extract text content from EPUB files."""

    def __init__(self, max_chapters: int = 1, include_toc: bool = True,
                 max_text_length: int = 10000):
        """
        Initialize EPUB extractor.

        Args:
            max_chapters: Maximum number of chapters to extract
            include_toc: Whether to include table of contents
            max_text_length: Maximum text length to extract
        """
        self.max_chapters = max_chapters
        self.include_toc = include_toc
        self.max_text_length = max_text_length
        self.logger = logging.getLogger(__name__)

    def extract(self, epub_path: Path) -> Dict:
        """
        Extract text from EPUB file.

        Args:
            epub_path: Path to EPUB file

        Returns:
            Dictionary with extracted text and metadata
        """
        result = {
            'success': False,
            'text': '',
            'chapter_count': 0,
            'toc': '',
            'error': None
        }

        if not EBOOKLIB_AVAILABLE or not BS4_AVAILABLE:
            result['error'] = "ebooklib or BeautifulSoup4 not available"
            return result

        try:
            book = epub.read_epub(str(epub_path))
            text_parts = []

            # Extract TOC if requested
            if self.include_toc:
                toc_text = self._extract_toc(book)
                if toc_text:
                    text_parts.append("=== TABLE OF CONTENTS ===\n")
                    text_parts.append(toc_text)
                    text_parts.append("\n=== CONTENT ===\n")
                    result['toc'] = toc_text

            # Extract chapters
            chapters_extracted = 0
            for item in book.get_items():
                if item.get_type() == ebooklib.ITEM_DOCUMENT:
                    if chapters_extracted >= self.max_chapters:
                        break

                    content = item.get_content()
                    text = self._html_to_text(content)
                    if text and len(text.strip()) > 100:  # Skip very short sections
                        text_parts.append(text)
                        chapters_extracted += 1

            result['chapter_count'] = chapters_extracted
            result['text'] = '\n\n'.join(text_parts)[:self.max_text_length]
            result['success'] = len(result['text']) > 0

            return result

        except Exception as e:
            self.logger.error(f"EPUB extraction failed for {epub_path}: {str(e)}")
            result['error'] = str(e)
            return result

    def _extract_toc(self, book) -> str:
        """Extract table of contents."""
        toc_parts = []
        try:
            for item in book.toc:
                if isinstance(item, tuple):
                    # Nested TOC structure
                    section, children = item
                    toc_parts.append(f"• {section.title}")
                    for child in children:
                        if hasattr(child, 'title'):
                            toc_parts.append(f"  - {child.title}")
                elif hasattr(item, 'title'):
                    toc_parts.append(f"• {item.title}")
        except Exception as e:
            self.logger.warning(f"TOC extraction failed: {str(e)}")

        return '\n'.join(toc_parts)

    def _html_to_text(self, content: bytes) -> str:
        """Convert HTML content to plain text."""
        try:
            soup = BeautifulSoup(content, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()

            # Get text
            text = soup.get_text()

            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)

            return text

        except Exception as e:
            self.logger.warning(f"HTML to text conversion failed: {str(e)}")
            return ""

    def extract_metadata(self, epub_path: Path) -> Dict:
        """Extract metadata from EPUB."""
        metadata = {}

        if not EBOOKLIB_AVAILABLE:
            return metadata

        try:
            book = epub.read_epub(str(epub_path))

            # Extract Dublin Core metadata
            for key in ['title', 'creator', 'language', 'publisher', 'date', 'identifier']:
                value = book.get_metadata('DC', key)
                if value:
                    # ebooklib returns tuples, get first element
                    metadata[key] = value[0][0] if isinstance(value[0], tuple) else value[0]

            # Extract author (creator is the DC term)
            if 'creator' in metadata:
                metadata['author'] = metadata['creator']

        except Exception as e:
            self.logger.warning(f"EPUB metadata extraction failed: {str(e)}")

        return metadata
