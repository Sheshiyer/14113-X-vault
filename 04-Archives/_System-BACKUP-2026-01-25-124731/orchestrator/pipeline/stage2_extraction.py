"""Stage 2: Content extraction from files."""

import logging
from pathlib import Path
from typing import Dict, List
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

from extractors.pdf_extractor import PDFExtractor
from extractors.epub_extractor import EPUBExtractor
from core.state_manager import StateManager


class ExtractionStage:
    """Extract content from PDF and EPUB files."""

    def __init__(self, config: Dict, state_manager: StateManager):
        """
        Initialize extraction stage.

        Args:
            config: Configuration dictionary
            state_manager: State manager instance
        """
        self.config = config
        self.state_manager = state_manager
        self.logger = logging.getLogger(__name__)

        # Initialize extractors
        self.pdf_extractor = PDFExtractor(
            max_pages=config['extraction']['pdf']['pages_to_extract'],
            include_last_page=config['extraction']['pdf']['include_last_page'],
            max_text_length=config['extraction']['pdf']['max_text_length'],
            fallback_to_pdfplumber=config['extraction']['pdf']['fallback_to_pdfplumber']
        )

        self.epub_extractor = EPUBExtractor(
            max_chapters=config['extraction']['epub']['chapters_to_extract'],
            include_toc=config['extraction']['epub']['include_toc'],
            max_text_length=config['extraction']['epub']['max_text_length']
        )

        self.output_dir = Path(config['output']['extractions_dir'])
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def run(self, inputs: Dict) -> Dict:
        """
        Run extraction stage.

        Args:
            inputs: Dictionary with files list and batch_id

        Returns:
            Dictionary with extraction results
        """
        files = inputs['files']
        batch_id = inputs['batch_id']

        self.logger.info(f"Extracting content from {len(files)} files")

        results = {
            'successful': 0,
            'failed': 0,
            'extractions': []
        }

        # Use thread pool for parallel extraction
        max_workers = self.config['processing']['parallel_workers']

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {
                executor.submit(self._extract_file, file_info, batch_id): file_info
                for file_info in files
            }

            for future in as_completed(future_to_file):
                file_info = future_to_file[future]
                try:
                    extraction_result = future.result()
                    if extraction_result['success']:
                        results['successful'] += 1
                        results['extractions'].append(extraction_result)
                    else:
                        results['failed'] += 1
                        self.logger.warning(f"Extraction failed: {extraction_result.get('error')}")

                except Exception as e:
                    results['failed'] += 1
                    self.logger.error(f"Extraction error for {file_info['file_path']}: {str(e)}")

        self.logger.info(f"Extraction complete: {results['successful']} successful, {results['failed']} failed")
        return results

    def _extract_file(self, file_info: Dict, batch_id: str) -> Dict:
        """
        Extract content from a single file.

        Args:
            file_info: File information dictionary
            batch_id: Batch ID

        Returns:
            Extraction result dictionary
        """
        file_id = file_info['file_id']
        file_path = Path(file_info['file_path'])
        metadata = file_info['metadata']

        result = {
            'file_id': file_id,
            'file_path': str(file_path),
            'success': False,
            'error': None,
            'extracted_text': '',
            'extraction_metadata': {}
        }

        try:
            # Extract based on file type
            file_type = metadata['file_type']
            allow_empty_text = self.config['extraction'].get('allow_empty_text', False)

            if file_type == '.pdf':
                extraction = self.pdf_extractor.extract(file_path)
                result['extracted_text'] = extraction['text']
                result['extraction_metadata'] = {
                    'page_count': extraction.get('page_count', 0),
                    'extraction_method': extraction.get('extraction_method'),
                }

                # Also extract PDF metadata
                pdf_metadata = self.pdf_extractor.extract_metadata(file_path)
                result['extraction_metadata'].update(self._sanitize_metadata(pdf_metadata))

                result['success'] = extraction['success']
                result['error'] = extraction.get('error')

            elif file_type == '.epub':
                extraction = self.epub_extractor.extract(file_path)
                result['extracted_text'] = extraction['text']
                result['extraction_metadata'] = {
                    'chapter_count': extraction.get('chapter_count', 0),
                    'toc': extraction.get('toc', ''),
                }

                # Also extract EPUB metadata
                epub_metadata = self.epub_extractor.extract_metadata(file_path)
                result['extraction_metadata'].update(epub_metadata)

                result['success'] = extraction['success']
                result['error'] = extraction.get('error')

            else:
                result['error'] = f"Unsupported file type: {file_type}"

            if allow_empty_text and not result['success']:
                result['success'] = True
                result['error'] = None
                result['extraction_metadata']['empty_text'] = True

            # Save extraction to JSON file
            if result['success']:
                output_file = self.output_dir / f"{metadata['file_hash']}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump({
                        'file_path': str(file_path),
                        'metadata': metadata,
                        'extracted_text': result['extracted_text'],
                        'extraction_metadata': result['extraction_metadata']
                    }, f, indent=2, ensure_ascii=False)

                # Update state
                self.state_manager.add_stage_record(
                    file_id=file_id,
                    batch_id=batch_id,
                    stage_name='extraction',
                    status='completed',
                    output_data={'output_file': str(output_file)}
                )
            else:
                # Record failure
                self.state_manager.add_stage_record(
                    file_id=file_id,
                    batch_id=batch_id,
                    stage_name='extraction',
                    status='failed',
                    error_message=result['error']
                )

        except Exception as e:
            result['error'] = str(e)
            self.logger.error(f"Extraction failed for {file_path}: {str(e)}")

        return result

    def _sanitize_metadata(self, metadata: Dict) -> Dict:
        """Ensure metadata values are JSON-serializable."""
        sanitized = {}
        for key, value in metadata.items():
            try:
                json.dumps(value)
                sanitized[key] = value
            except TypeError:
                sanitized[key] = str(value)
        return sanitized
