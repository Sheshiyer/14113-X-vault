"""Generic metadata extraction from files."""

from pathlib import Path
from typing import Dict
import logging
import hashlib


class MetadataExtractor:
    """Extract metadata from various file types."""

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def extract(self, file_path: Path) -> Dict:
        """
        Extract metadata from file.

        Args:
            file_path: Path to file

        Returns:
            Dictionary with metadata
        """
        metadata = {
            'filename': file_path.name,
            'file_path': str(file_path),
            'file_size': file_path.stat().st_size,
            'file_type': file_path.suffix.lower(),
            'created_at': file_path.stat().st_ctime,
            'modified_at': file_path.stat().st_mtime,
            'file_hash': self.compute_hash(file_path)
        }

        # Extract title from filename
        metadata['title'] = self._extract_title_from_filename(file_path.name)

        return metadata

    def compute_hash(self, file_path: Path, algorithm: str = 'sha256') -> str:
        """
        Compute file hash.

        Args:
            file_path: Path to file
            algorithm: Hash algorithm (md5, sha1, sha256)

        Returns:
            Hexadecimal hash string
        """
        hash_func = hashlib.new(algorithm)

        try:
            with open(file_path, 'rb') as f:
                # Read in chunks to handle large files
                for chunk in iter(lambda: f.read(4096), b''):
                    hash_func.update(chunk)
            return hash_func.hexdigest()
        except Exception as e:
            self.logger.error(f"Hash computation failed for {file_path}: {str(e)}")
            return ""

    def _extract_title_from_filename(self, filename: str) -> str:
        """Extract a clean title from filename."""
        # Remove extension
        name = Path(filename).stem

        # Replace common separators with spaces
        for separator in ['-', '_', '.']:
            name = name.replace(separator, ' ')

        # Clean up multiple spaces
        name = ' '.join(name.split())

        # Capitalize words
        name = name.title()

        return name
