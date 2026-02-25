"""Stage 1: File discovery and cataloging."""

import logging
from pathlib import Path
from typing import Dict, List
import json

from extractors.metadata_extractor import MetadataExtractor
from core.state_manager import StateManager


class DiscoveryStage:
    """Discover and catalog files for processing."""

    def __init__(self, config: Dict, state_manager: StateManager):
        """
        Initialize discovery stage.

        Args:
            config: Configuration dictionary
            state_manager: State manager instance
        """
        self.config = config
        self.state_manager = state_manager
        self.metadata_extractor = MetadataExtractor()
        self.logger = logging.getLogger(__name__)

    def run(self, inputs: Dict) -> Dict:
        """
        Run discovery stage.

        Args:
            inputs: Dictionary with source_folder, file_types, batch_size, batch_id

        Returns:
            Dictionary with discovered files
        """
        source_folder = Path(inputs['source_folder'])
        file_types = inputs['file_types']
        batch_size = inputs['batch_size']
        batch_id = inputs['batch_id']

        self.logger.info(f"Discovering files in {source_folder}")

        results = {
            'files_found': 0,
            'new_files': 0,
            'duplicates': 0,
            'files': []
        }

        # Walk directory tree
        discovered_files = []
        for file_type in file_types:
            pattern = f"**/*{file_type}"
            for file_path in source_folder.glob(pattern):
                if file_path.is_file() and self._should_process(file_path):
                    discovered_files.append(file_path)

                    if len(discovered_files) >= batch_size:
                        break

            if len(discovered_files) >= batch_size:
                break

        results['files_found'] = len(discovered_files)
        self.logger.info(f"Found {results['files_found']} files")

        # Process each file
        for file_path in discovered_files:
            try:
                # Extract metadata
                metadata = self.metadata_extractor.extract(file_path)

                # Check if already in database
                existing = self.state_manager.get_file_by_hash(metadata['file_hash'])

                # For testing: Always process if it's a new batch, even if it exists
                # In production, we would skip duplicates
                if existing:
                    # Update batch ID for existing file to re-process
                    file_id = existing['id']
                    
                    # Record discovery stage for this new batch
                    self.state_manager.add_stage_record(
                        file_id=file_id,
                        batch_id=batch_id,
                        stage_name='discovery',
                        status='completed'
                    )
                    
                    results['new_files'] += 1
                    results['files'].append({
                        'file_id': file_id,
                        'file_path': str(file_path),
                        'metadata': metadata
                    })
                    self.logger.info(f"Re-processing existing file: {file_path.name}")
                    
                else:
                    # Add to database
                    file_id = self.state_manager.add_file(
                        file_path=str(file_path),
                        file_hash=metadata['file_hash'],
                        file_size=metadata['file_size'],
                        file_type=metadata['file_type'],
                        metadata=metadata
                    )

                    if file_id:
                        results['new_files'] += 1
                        results['files'].append({
                            'file_id': file_id,
                            'file_path': str(file_path),
                            'metadata': metadata
                        })

                        # Record discovery stage
                        self.state_manager.add_stage_record(
                            file_id=file_id,
                            batch_id=batch_id,
                            stage_name='discovery',
                            status='completed'
                        )

            except Exception as e:
                self.logger.error(f"Error processing {file_path}: {str(e)}")
                continue

        self.logger.info(f"Discovery complete: {results['new_files']} new, {results['duplicates']} duplicates")
        return results

    def _should_process(self, file_path: Path) -> bool:
        """Check if file should be processed."""
        # Check ignore patterns
        ignore_patterns = self.config['filesystem']['ignore_patterns']
        for pattern in ignore_patterns:
            if file_path.match(pattern.replace('*', '')):
                return False

        # Check file size (skip empty files)
        if file_path.stat().st_size == 0:
            return False

        return True
