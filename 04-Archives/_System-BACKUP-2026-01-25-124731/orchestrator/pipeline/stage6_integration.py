"""
Stage 6: MOC Integration

Updates MOC (Map of Content) files and index pages with new file links.
Manages cross-references and maintains vault structure.
"""

import logging
import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Set
from datetime import datetime
from collections import defaultdict

logger = logging.getLogger(__name__)


class Stage6Integration:
    """Integrates processed files into MOC structure"""
    
    def __init__(self, db_manager, config: Dict):
        self.db = db_manager
        self.config = config
        self.vault_root = Path(config['vault']['root'])
        self.para_structure = config['vault']['para_structure']
        self.dry_run = config['processing'].get('dry_run', False)
        
        # MOC patterns
        self.moc_pattern = re.compile(r'\[\[([^\]]+)\]\]')
        
        logger.info("Stage6Integration initialized")
    
    def run(self, inputs: Dict) -> Dict:
        """
        Execute Stage 6: MOC Integration
        
        Args:
            inputs: Dictionary containing:
                - batch_id: Batch identifier
                - processed_files: Files processed in Stage 5
            
        Returns:
            Dict with integration statistics
        """
        batch_id = inputs.get('batch_id')
        dry_run = inputs.get('dry_run', self.dry_run)
        
        logger.info(f"Stage 6: Starting MOC integration for batch {batch_id}")
        
        stats = {
            'total_files': 0,
            'mocs_updated': 0,
            'indices_updated': 0,
            'links_created': 0,
            'errors': 0
        }
        
        try:
            # Get processed files
            files = self._get_processed_files(batch_id)
            stats['total_files'] = len(files)
            
            logger.info(f"Integrating {len(files)} processed files")
            
            # Group files by MOC
            moc_files_map = self._group_files_by_moc(files)
            
            # Update each MOC
            for moc_name, file_list in moc_files_map.items():
                try:
                    if self._update_moc(moc_name, file_list, dry_run):
                        stats['mocs_updated'] += 1
                        stats['links_created'] += len(file_list)
                except Exception as e:
                    logger.error(f"Error updating MOC {moc_name}: {e}")
                    stats['errors'] += 1
            
            # Update PARA indices
            try:
                indices_updated = self._update_para_indices(files, dry_run)
                stats['indices_updated'] = indices_updated
            except Exception as e:
                logger.error(f"Error updating indices: {e}")
                stats['errors'] += 1
            
            # Mark all files as integrated
            for file_record in files:
                self._mark_stage_complete(file_record['id'])
            
            logger.info(f"Stage 6 complete: {stats['mocs_updated']} MOCs updated, {stats['errors']} errors")
            return stats
            
        except Exception as e:
            logger.error(f"Stage 6 failed: {e}", exc_info=True)
            raise
    
    def _get_processed_files(self, batch_id: int) -> List[Dict]:
        """Get files that completed Stage 5 processing"""
        query = """
            SELECT f.*, ps.output_data as processing_data
            FROM files f
            JOIN processing_stages ps ON f.id = ps.file_id
            WHERE ps.batch_id = ? 
            AND ps.stage_name = 'stage5_processing'
            AND ps.status = 'completed'
        """
        return self.db.execute(query, (batch_id,))
    
    def _group_files_by_moc(self, files: List[Dict]) -> Dict[str, List[Dict]]:
        """Group files by their MOC links"""
        moc_files_map = defaultdict(list)
        
        for file_record in files:
            # Get MOC links from routing data
            routing_data = self._get_routing_data(file_record['id'])
            
            if routing_data:
                moc_links = routing_data.get('moc_links', [])
                
                for moc in moc_links:
                    moc_files_map[moc].append({
                        'id': file_record['id'],
                        'file_path': file_record['file_path'],
                        'markdown_path': self._get_markdown_path(file_record),
                        'title': self._get_title(file_record),
                        'para_bucket': routing_data.get('para_bucket', ''),
                        'resource_category': routing_data.get('resource_category', '')
                    })
        
        logger.info(f"Grouped files into {len(moc_files_map)} MOCs")
        return dict(moc_files_map)
    
    def _get_routing_data(self, file_id: int) -> Optional[Dict]:
        """Get routing data from Stage 4"""
        query = """
            SELECT output_data FROM processing_stages
            WHERE file_id = ? AND stage_name = 'stage4_routing'
            AND status IN ('completed', 'routed')
            ORDER BY ended_at DESC LIMIT 1
        """
        result = self.db.execute(query, (file_id,))
        
        if result:
            output_data = result[0].get('output_data')
            if output_data:
                return json.loads(output_data) if isinstance(output_data, str) else output_data
        return None
    
    def _get_markdown_path(self, file_record: Dict) -> str:
        """Get markdown wrapper path from file metadata"""
        metadata = file_record.get('metadata', {})
        if isinstance(metadata, str):
            metadata = json.loads(metadata)
        return metadata.get('markdown_wrapper', '')
    
    def _get_title(self, file_record: Dict) -> str:
        """Extract title from file"""
        file_path = Path(file_record['file_path'])
        return file_path.stem.replace('_', ' ').replace('-', ' ').title()
    
    def _update_moc(self, moc_name: str, file_list: List[Dict], dry_run: bool) -> bool:
        """
        Update a MOC file with new links
        
        Returns True if MOC was updated successfully
        """
        # Find MOC file
        moc_path = self._find_moc_file(moc_name)
        
        if not moc_path:
            logger.warning(f"MOC not found: {moc_name} - creating new MOC")
            moc_path = self._create_moc(moc_name, dry_run)
            
            if not moc_path:
                logger.error(f"Failed to create MOC: {moc_name}")
                return False
        
        if dry_run:
            logger.info(f"[DRY RUN] Would update MOC: {moc_path}")
            return True
        
        # Read current MOC content
        try:
            content = moc_path.read_text(encoding='utf-8')
        except Exception as e:
            logger.error(f"Error reading MOC {moc_path}: {e}")
            return False
        
        # Add new links
        updated_content = self._add_links_to_moc(content, file_list, moc_name)
        
        # Write updated MOC
        try:
            moc_path.write_text(updated_content, encoding='utf-8')
            logger.info(f"Updated MOC {moc_name} with {len(file_list)} new links")
            return True
        except Exception as e:
            logger.error(f"Error writing MOC {moc_path}: {e}")
            return False
    
    def _find_moc_file(self, moc_name: str) -> Optional[Path]:
        """Find MOC file in vault"""
        # Common MOC locations
        search_locations = [
            self.vault_root / "01-Projects",
            self.vault_root / "02-Areas",
            self.vault_root / "03-Resources",
            self.vault_root / "_System" / "MOCs"
        ]
        
        # Try exact match
        for location in search_locations:
            if location.exists():
                moc_file = location / f"{moc_name}.md"
                if moc_file.exists():
                    return moc_file
                
                # Try recursive search
                for moc_file in location.rglob(f"{moc_name}.md"):
                    return moc_file
        
        return None
    
    def _create_moc(self, moc_name: str, dry_run: bool) -> Optional[Path]:
        """Create a new MOC file"""
        # Create in Resources by default
        moc_dir = Path(self.para_structure['resources']) / "MOCs"
        
        if not dry_run:
            moc_dir.mkdir(parents=True, exist_ok=True)
        
        moc_path = moc_dir / f"{moc_name}.md"
        
        if dry_run:
            logger.info(f"[DRY RUN] Would create MOC at: {moc_path}")
            return moc_path
        
        # Create MOC template
        moc_content = f"""---
title: "{moc_name}"
type: moc
created: {datetime.now().strftime('%Y-%m-%d')}
tags:
  - moc
---

# {moc_name}

## Overview

*Add description of this Map of Content*

## Related Notes

<!-- New entries will be added below -->

## See Also

- 

---
*This MOC was auto-generated by Vault Intake Orchestrator*
"""
        
        try:
            moc_path.write_text(moc_content, encoding='utf-8')
            logger.info(f"Created new MOC: {moc_path}")
            return moc_path
        except Exception as e:
            logger.error(f"Error creating MOC {moc_path}: {e}")
            return None
    
    def _add_links_to_moc(self, content: str, file_list: List[Dict], moc_name: str) -> str:
        """Add new file links to MOC content"""
        lines = content.split('\n')
        
        # Find "Related Notes" section or create it
        related_notes_index = -1
        for i, line in enumerate(lines):
            if '## Related Notes' in line or '## Related Content' in line:
                related_notes_index = i
                break
        
        if related_notes_index == -1:
            # Add section before the end
            lines.append("\n## Related Notes\n")
            related_notes_index = len(lines) - 2
        
        # Build new links
        new_links = []
        for file_info in file_list:
            title = file_info['title']
            markdown_path = file_info.get('markdown_path', '')
            
            if markdown_path:
                # Use relative link to markdown wrapper
                link_name = Path(markdown_path).stem
                new_links.append(f"- [[{link_name}]] - {title}")
            else:
                # Fallback to title
                new_links.append(f"- [[{title}]]")
        
        # Insert new links after "Related Notes" header
        insert_index = related_notes_index + 1
        
        # Skip any existing content or comments
        while insert_index < len(lines) and (lines[insert_index].strip().startswith('<!--') or not lines[insert_index].strip()):
            insert_index += 1
        
        # Insert new links
        for link in new_links:
            lines.insert(insert_index, link)
            insert_index += 1
        
        return '\n'.join(lines)
    
    def _update_para_indices(self, files: List[Dict], dry_run: bool) -> int:
        """Update index files in each PARA bucket"""
        updated_count = 0
        
        # Group files by PARA bucket
        bucket_files = defaultdict(list)
        
        for file_record in files:
            routing_data = self._get_routing_data(file_record['id'])
            if routing_data:
                bucket = routing_data.get('para_bucket', '03-Resources')
                bucket_files[bucket].append(file_record)
        
        # Update each bucket's index
        for bucket, file_list in bucket_files.items():
            try:
                if self._update_bucket_index(bucket, file_list, dry_run):
                    updated_count += 1
            except Exception as e:
                logger.error(f"Error updating index for {bucket}: {e}")
        
        return updated_count
    
    def _update_bucket_index(self, bucket: str, file_list: List[Dict], dry_run: bool) -> bool:
        """Update index file for a PARA bucket"""
        # Get bucket path
        bucket_path = Path(self.para_structure.get(bucket.split('-')[1].lower(), ''))
        
        if not bucket_path.exists():
            logger.warning(f"Bucket path not found: {bucket_path}")
            return False
        
        index_path = bucket_path / "INDEX.md"
        
        if dry_run:
            logger.info(f"[DRY RUN] Would update index: {index_path}")
            return True
        
        # Create or update index
        if index_path.exists():
            content = index_path.read_text(encoding='utf-8')
        else:
            content = self._create_index_template(bucket)
        
        # Add new entries
        updated_content = self._add_entries_to_index(content, file_list, bucket)
        
        # Write index
        try:
            index_path.write_text(updated_content, encoding='utf-8')
            logger.info(f"Updated index {bucket} with {len(file_list)} entries")
            return True
        except Exception as e:
            logger.error(f"Error writing index {index_path}: {e}")
            return False
    
    def _create_index_template(self, bucket: str) -> str:
        """Create index template for a bucket"""
        return f"""---
title: "{bucket} Index"
type: index
updated: {datetime.now().strftime('%Y-%m-%d')}
---

# {bucket} Index

## Recent Additions

<!-- Auto-generated entries below -->

---
*Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*
"""
    
    def _add_entries_to_index(self, content: str, file_list: List[Dict], bucket: str) -> str:
        """Add new entries to index"""
        lines = content.split('\n')
        
        # Find "Recent Additions" section
        insert_index = -1
        for i, line in enumerate(lines):
            if '## Recent Additions' in line or '<!-- Auto-generated entries below -->' in line:
                insert_index = i + 1
                break
        
        if insert_index == -1:
            # Append at end
            insert_index = len(lines)
        
        # Build entries
        date_str = datetime.now().strftime('%Y-%m-%d')
        
        # Group by category
        categorized = defaultdict(list)
        for file_record in file_list:
            routing_data = self._get_routing_data(file_record['id'])
            category = routing_data.get('resource_category', 'Uncategorized') if routing_data else 'Uncategorized'
            categorized[category].append(file_record)
        
        # Add entries by category
        new_lines = [f"\n### {date_str}\n"]
        
        for category, files in sorted(categorized.items()):
            new_lines.append(f"\n**{category}**\n")
            for file_record in files:
                title = self._get_title(file_record)
                markdown_path = self._get_markdown_path(file_record)
                
                if markdown_path:
                    link_name = Path(markdown_path).stem
                    new_lines.append(f"- [[{link_name}]]")
                else:
                    new_lines.append(f"- [[{title}]]")
        
        # Insert new lines
        for line in reversed(new_lines):
            lines.insert(insert_index, line)
        
        return '\n'.join(lines)
    
    def _mark_stage_complete(self, file_id: int):
        """Mark Stage 6 as complete"""
        insert_query = """
            INSERT INTO processing_stages 
            (file_id, batch_id, stage_name, status, started_at, ended_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        
        now = datetime.now().isoformat()
        self.db.execute(insert_query, (
            file_id,
            None,
            'stage6_integration',
            'completed',
            now,
            now
        ), fetch=False)
