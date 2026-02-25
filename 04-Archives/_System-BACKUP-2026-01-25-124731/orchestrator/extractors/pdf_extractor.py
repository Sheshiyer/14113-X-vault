"""PDF text extraction."""

from pathlib import Path
from typing import Dict, Optional
import logging

try:
    from PyPDF2 import PdfReader
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False


class PDFExtractor:
    """Extract text content from PDF files."""

    def __init__(self, max_pages: int = 5, include_last_page: bool = True,
                 max_text_length: int = 10000, fallback_to_pdfplumber: bool = True):
        """
        Initialize PDF extractor.

        Args:
            max_pages: Maximum number of pages to extract from start
            include_last_page: Whether to include the last page
            max_text_length: Maximum text length to extract
            fallback_to_pdfplumber: Use pdfplumber if PyPDF2 fails
        """
        self.max_pages = max_pages
        self.include_last_page = include_last_page
        self.max_text_length = max_text_length
        self.fallback_to_pdfplumber = fallback_to_pdfplumber
        self.logger = logging.getLogger(__name__)

    def extract(self, pdf_path: Path) -> Dict[str, any]:
        """
        Extract text from PDF file.

        Args:
            pdf_path: Path to PDF file

        Returns:
            Dictionary with extracted text and metadata
        """
        result = {
            'success': False,
            'text': '',
            'page_count': 0,
            'extraction_method': None,
            'error': None
        }

        try:
            # Try PyPDF2 first
            if PYPDF2_AVAILABLE:
                result = self._extract_with_pypdf2(pdf_path)
                if result['success']:
                    return result

            # Fallback to pdfplumber
            if self.fallback_to_pdfplumber and PDFPLUMBER_AVAILABLE:
                self.logger.info(f"Falling back to pdfplumber for {pdf_path.name}")
                result = self._extract_with_pdfplumber(pdf_path)
                if result['success']:
                    return result

            # If both failed
            result['error'] = "No extraction method succeeded"
            return result

        except Exception as e:
            self.logger.error(f"PDF extraction failed for {pdf_path}: {str(e)}")
            result['error'] = str(e)
            return result

    def _extract_with_pypdf2(self, pdf_path: Path) -> Dict:
        """Extract using PyPDF2."""
        result = {
            'success': False,
            'text': '',
            'page_count': 0,
            'extraction_method': 'pypdf2',
            'error': None
        }

        try:
            reader = PdfReader(str(pdf_path))
            result['page_count'] = len(reader.pages)

            # Extract from first N pages
            pages_to_extract = min(self.max_pages, result['page_count'])
            text_parts = []

            for i in range(pages_to_extract):
                page = reader.pages[i]
                text = page.extract_text()
                if text:
                    text_parts.append(text)

            # Extract from last page if different
            if self.include_last_page and result['page_count'] > pages_to_extract:
                last_page = reader.pages[-1]
                last_text = last_page.extract_text()
                if last_text:
                    text_parts.append("\n\n[... Last Page ...]\n\n")
                    text_parts.append(last_text)

            result['text'] = '\n\n'.join(text_parts)[:self.max_text_length]
            result['success'] = len(result['text']) > 0

            return result

        except Exception as e:
            result['error'] = str(e)
            self.logger.warning(f"PyPDF2 extraction failed: {str(e)}")
            return result

    def _extract_with_pdfplumber(self, pdf_path: Path) -> Dict:
        """Extract using pdfplumber."""
        result = {
            'success': False,
            'text': '',
            'page_count': 0,
            'extraction_method': 'pdfplumber',
            'error': None
        }

        try:
            with pdfplumber.open(str(pdf_path)) as pdf:
                result['page_count'] = len(pdf.pages)
                pages_to_extract = min(self.max_pages, result['page_count'])
                text_parts = []

                for i in range(pages_to_extract):
                    page = pdf.pages[i]
                    text = page.extract_text()
                    if text:
                        text_parts.append(text)

                # Extract from last page if different
                if self.include_last_page and result['page_count'] > pages_to_extract:
                    last_page = pdf.pages[-1]
                    last_text = last_page.extract_text()
                    if last_text:
                        text_parts.append("\n\n[... Last Page ...]\n\n")
                        text_parts.append(last_text)

                result['text'] = '\n\n'.join(text_parts)[:self.max_text_length]
                result['success'] = len(result['text']) > 0

            return result

        except Exception as e:
            result['error'] = str(e)
            self.logger.warning(f"pdfplumber extraction failed: {str(e)}")
            return result

    def extract_metadata(self, pdf_path: Path) -> Dict:
        """Extract metadata from PDF."""
        metadata = {}

        try:
            if PYPDF2_AVAILABLE:
                reader = PdfReader(str(pdf_path))
                if reader.metadata:
                    metadata = {
                        'title': reader.metadata.get('/Title'),
                        'author': reader.metadata.get('/Author'),
                        'subject': reader.metadata.get('/Subject'),
                        'creator': reader.metadata.get('/Creator'),
                        'producer': reader.metadata.get('/Producer'),
                        'creation_date': reader.metadata.get('/CreationDate')
                    }
                    # Remove None values
                    metadata = {k: v for k, v in metadata.items() if v}

        except Exception as e:
            self.logger.warning(f"Metadata extraction failed: {str(e)}")

        return metadata
