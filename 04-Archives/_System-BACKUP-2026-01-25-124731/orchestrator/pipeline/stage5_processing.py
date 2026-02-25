"""
Stage 5: Processing

Generates markdown wrappers and moves files to their PARA destinations.
Creates frontmatter, links to MOCs, and organizes files.
"""

import logging
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
try:
    from jinja2 import Environment, FileSystemLoader, Template
except ImportError:
    Environment = None
    FileSystemLoader = None
    Template = None

logger = logging.getLogger(__name__)


class Stage5Processing:
    """Processes files by generating markdown wrappers and moving to PARA structure"""
    
    def __init__(self, db_manager, config: Dict):
        self.db = db_manager
        self.config = config
        self.dry_run = config['processing'].get('dry_run', False)
        self.preserve_originals = config['processing'].get('preserve_originals', True)
        self.normalize_filenames = config['processing'].get('normalize_filenames', True)
        self.logger = logger
        
        # Setup Jinja2 templates if available
        if Environment and FileSystemLoader:
            template_dir = Path(__file__).parent.parent / 'templates'
            self.jinja_env = Environment(loader=FileSystemLoader(str(template_dir)))
        else:
            self.jinja_env = None
        
        logger.info(f"Stage5Processing initialized (dry_run={self.dry_run})")
    
    def run(self, inputs: Dict) -> Dict:
        """
        Execute Stage 5: Processing
        
        Args:
            inputs: Dictionary containing:
                - batch_id: Batch identifier
                - routing_manifest: Routing decisions from Stage 4
                - dry_run: Optional dry run override
            
        Returns:
            Dict with processing statistics
        """
        batch_id = inputs.get('batch_id')
        dry_run = inputs.get('dry_run', self.dry_run)
        
        logger.info(f"Stage 5: Starting file processing for batch {batch_id}")
        
        stats = {
            'total_files': 0,
            'processed': 0,
            'successful': 0,
            'failed': 0,
            'skipped': 0,
            'markdown_generated': 0,
            'files_moved': 0,
            'errors': 0,
            'processed_files': []
        }
        
        try:
            # Get routed files
            files = self._get_routed_files(batch_id)
            stats['total_files'] = len(files)
            
            logger.info(f"Processing {len(files)} routed files")
            
            for file_record in files:
                try:
                    file_id = file_record['id']
                    source_path = Path(file_record['file_path'])
                    
                    # Verify source path is within processing folder
                    if not self._is_safe_source(source_path):
                        logger.warning(f"Skipping unsafe file path: {source_path}")
                        stats['skipped'] += 1
                        continue

                    # Get routing decision and analysis
                    routing_data = self._get_routing_data(file_id)
                    analysis_data = self._get_analysis_data(file_id)
                    
                    if not routing_data:
                        logger.warning(f"No routing data for file {file_id}")
                        stats['skipped'] += 1
                        continue
                    
                    destination_path = Path(routing_data['destination_path'])
                    
                    # Generate markdown wrapper
                    markdown_content = self._generate_markdown_wrapper(
                        source_path,
                        destination_path,
                        routing_data,
                        analysis_data,
                        file_record
                    )
                    
                    markdown_path = destination_path.with_suffix('.md')
                    
                    # Write markdown wrapper
                    if not dry_run:
                        # Ensure parent dir exists
                        destination_path.parent.mkdir(parents=True, exist_ok=True)
                        markdown_path.write_text(markdown_content, encoding='utf-8')
                        logger.debug(f"Created markdown wrapper: {markdown_path}")
                        stats['markdown_generated'] += 1
                    else:
                        logger.info(f"[DRY RUN] Would create: {markdown_path}")
                    
                    # Move/copy original file
                    move_success = self._move_file(source_path, destination_path, dry_run)
                    if move_success and not dry_run:
                        stats['files_moved'] += 1
                        stats['successful'] += 1
                    elif not move_success:
                        stats['failed'] += 1
                    
                    # Update file record
                    if not dry_run:
                        self._update_file_location(file_id, str(destination_path), str(markdown_path))
                    
                    # Record result for reporting
                    processing_result = {
                        'source_path': str(source_path),
                        'destination_path': str(destination_path),
                        'markdown_path': str(markdown_path),
                        'para_bucket': routing_data['para_bucket'],
                        'success': move_success,
                        'moved': not dry_run
                    }
                    
                    if not dry_run:
                        self._mark_stage_complete(file_id, processing_result)
                    
                    stats['processed'] += 1
                    stats['processed_files'].append(processing_result)
                    
                    logger.info(f"Processed {source_path.name} -> {destination_path.parent.name}/{destination_path.name}")
                    
                except Exception as e:
                    logger.error(f"Error processing file {file_id}: {e}")
                    self._mark_stage_error(file_id, str(e))
                    stats['errors'] += 1
            
            # Generate and save movement report
            report_path = self._save_movement_report(stats['processed_files'], batch_id)
            stats['report_path'] = str(report_path)
            
            logger.info(f"Stage 5 complete: {stats['processed']} processed, {stats['errors']} errors")
            logger.info(f"Movement report saved to: {report_path}")
            
            return stats
            
        except Exception as e:
            logger.error(f"Stage 5 failed: {e}", exc_info=True)
            raise

    def _is_safe_source(self, path: Path) -> bool:
        """Verify file is in allowed source directory"""
        try:
            processing_folder = Path(self.config['vault']['processing_folder']).resolve()
            file_path = path.resolve()
            return str(file_path).startswith(str(processing_folder))
        except Exception:
            return False

    def _move_file(self, source_path: Path, dest_path: Path, dry_run: bool = False) -> bool:
        """
        Move file to destination with duplicate handling.
        """
        try:
            if dry_run:
                self.logger.info(f"[DRY RUN] Would move: {source_path} -> {dest_path}")
                return True

            # Handle filename collisions
            final_dest = dest_path
            if final_dest.exists():
                stem = final_dest.stem
                suffix = final_dest.suffix
                counter = 1
                while final_dest.exists():
                    final_dest = final_dest.with_name(f"{stem}_{counter}{suffix}")
                    counter += 1
            
            self.logger.info(f"Moving file: {source_path.name} -> {final_dest}")
            
            # Create directory if needed
            final_dest.parent.mkdir(parents=True, exist_ok=True)

            if self.preserve_originals:
                cmd = ["cp", "-p", str(source_path), str(final_dest)]
            else:
                cmd = ["mv", str(source_path), str(final_dest)]

            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                self.logger.error(
                    "File operation failed: %s (stdout=%s, stderr=%s)",
                    " ".join(cmd),
                    result.stdout.strip(),
                    result.stderr.strip()
                )
                return False
                
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to move file {source_path}: {str(e)}")
            return False

    def _save_movement_report(self, processed_files: List[Dict], batch_id: str) -> Path:
        """Generate and save a detailed report of file movements."""
        report = ["# 📦 File Movement Report\n"]
        report.append(f"**Batch ID:** {batch_id}")
        report.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        report.append("| Original File | PARA Destination | Status |")
        report.append("|---------------|------------------|--------|")
        
        for file in processed_files:
            status = "✅ Moved" if file.get('success') else "❌ Failed"
            original = Path(file['source_path']).name
            dest = file.get('destination_path', 'N/A')
            try:
                dest_display = str(Path(dest).relative_to(Path(self.config['vault']['root'])))
            except ValueError:
                dest_display = dest
            
            report.append(f"| {original} | {dest_display} | {status} |")
            
        report_content = "\n".join(report)
        
        # Save to reports directory
        report_dir = Path(self.config['vault']['system']['reports']) / 'movements'
        report_dir.mkdir(parents=True, exist_ok=True)
        report_path = report_dir / f"movement_report_{batch_id}.md"
        
        report_path.write_text(report_content, encoding='utf-8')
        return report_path
    
    def _get_routed_files(self, batch_id: int) -> List[Dict]:
        """Get files that completed Stage 4 routing"""
        query = """
            SELECT f.* FROM files f
            JOIN processing_stages ps ON f.id = ps.file_id
            WHERE ps.batch_id = ? 
            AND ps.stage_name = 'stage4_routing'
            AND ps.status IN ('completed', 'routed')
        """
        return self.db.execute(query, (batch_id,))
    
    def _get_routing_data(self, file_id: int) -> Optional[Dict]:
        """Get routing decision from Stage 4"""
        query = """
            SELECT output_data FROM processing_stages
            WHERE file_id = ? AND stage_name = 'stage4_routing'
            AND status IN ('completed', 'routed')
            ORDER BY completed_at DESC LIMIT 1
        """
        result = self.db.execute(query, (file_id,))
        
        if result:
            output_data = result[0].get('output_data')
            if output_data:
                return json.loads(output_data) if isinstance(output_data, str) else output_data
        return None
    
    def _get_analysis_data(self, file_id: int) -> Optional[Dict]:
        """Get analysis results from Stage 3"""
        query = """
            SELECT output_data FROM processing_stages
            WHERE file_id = ? AND stage_name = 'stage3_analysis'
            AND status = 'completed'
            ORDER BY completed_at DESC LIMIT 1
        """
        result = self.db.execute(query, (file_id,))
        
        if result:
            output_data = result[0].get('output_data')
            if output_data:
                return json.loads(output_data) if isinstance(output_data, str) else output_data
        return None
    
    def _generate_markdown_wrapper(
        self,
        source_path: Path,
        destination_path: Path,
        routing_data: Dict,
        analysis_data: Dict,
        file_record: Dict
    ) -> str:
        """Generate markdown wrapper with frontmatter and links"""
        
        # Extract metadata
        title = self._extract_title(source_path, analysis_data)
        tags = self._extract_tags(analysis_data)
        moc_links = routing_data.get('moc_links', [])
        
        # Build frontmatter
        frontmatter = self._build_frontmatter(
            title=title,
            source_path=str(source_path),
            destination_path=str(destination_path),
            para_bucket=routing_data['para_bucket'],
            resource_category=routing_data.get('resource_category', 'Uncategorized'),
            tags=tags,
            moc_links=moc_links,
            analysis_data=analysis_data,
            file_record=file_record
        )
        
        # Build body content
        body = self._build_body_content(
            destination_path=destination_path,
            moc_links=moc_links,
            analysis_data=analysis_data,
            routing_data=routing_data
        )
        
        # Combine
        markdown = f"{frontmatter}\n\n{body}"
        
        return markdown
    
    def _extract_title(self, source_path: Path, analysis_data: Optional[Dict]) -> str:
        """Extract or generate title for the document"""
        # Try to get title from analysis
        if analysis_data:
            # Check tags for title
            tags_data = analysis_data.get('tags', {})
            if 'title' in tags_data:
                return tags_data['title']
        
        # Fallback to filename
        return source_path.stem.replace('_', ' ').replace('-', ' ').title()
    
    def _extract_tags(self, analysis_data: Optional[Dict]) -> List[str]:
        """Extract tags from analysis data"""
        if not analysis_data:
            return []
        
        tags = []
        
        # Get tags from tag classification
        tags_data = analysis_data.get('tags', {})
        classified_tags = tags_data.get('classified_tags', [])
        tags.extend(classified_tags)
        
        # Get domain tags
        domain_data = analysis_data.get('domain_classification', {})
        if 'primary_domain' in domain_data:
            tags.append(domain_data['primary_domain'])
        
        # Get Enneagram type
        enneagram_data = analysis_data.get('enneagram_mapping', {})
        if 'enneagram_type' in enneagram_data:
            tags.append(f"enneagram-{enneagram_data['enneagram_type']}")
        
        # Deduplicate and return
        return list(set(tags))
    
    def _build_frontmatter(self, **kwargs) -> str:
        """Build YAML frontmatter"""
        title = kwargs.get('title', 'Untitled')
        source_path = kwargs.get('source_path', '')
        destination_path = kwargs.get('destination_path', '')
        para_bucket = kwargs.get('para_bucket', '')
        resource_category = kwargs.get('resource_category', '')
        tags = kwargs.get('tags', [])
        moc_links = kwargs.get('moc_links', [])
        analysis_data = kwargs.get('analysis_data', {})
        file_record = kwargs.get('file_record', {})
        
        # Extract additional metadata
        enneagram_data = analysis_data.get('enneagram_mapping', {})
        domain_data = analysis_data.get('domain_classification', {})
        
        frontmatter_lines = [
            "---",
            f"title: \"{title}\"",
            f"source_path: \"{source_path}\"",
            f"destination_path: \"{destination_path}\"",
            f"para_bucket: \"{para_bucket}\"",
            f"resource_category: \"{resource_category}\"",
            f"content_type: \"{file_record.get('file_type', 'unknown')}\"",
            f"processed_date: \"{datetime.now().strftime('%Y-%m-%d')}\"",
        ]
        
        # Add tags
        if tags:
            frontmatter_lines.append("tags:")
            for tag in sorted(tags):
                frontmatter_lines.append(f"  - {tag}")
        
        # Add MOC links
        if moc_links:
            frontmatter_lines.append("moc_links:")
            for moc in moc_links:
                frontmatter_lines.append(f"  - \"[[{moc}]]\"")
        
        # Add Enneagram info if available
        if enneagram_data:
            frontmatter_lines.append("enneagram:")
            if 'enneagram_type' in enneagram_data:
                frontmatter_lines.append(f"  type: {enneagram_data['enneagram_type']}")
            if 'muse_archetype' in enneagram_data:
                frontmatter_lines.append(f"  muse: \"{enneagram_data['muse_archetype']}\"")
            if 'hormone_mapping' in enneagram_data:
                frontmatter_lines.append(f"  hormone: \"{enneagram_data['hormone_mapping']}\"")
        
        # Add domain classification
        if domain_data:
            if 'primary_domain' in domain_data:
                frontmatter_lines.append(f"domain: \"{domain_data['primary_domain']}\"")
        
        frontmatter_lines.append("---")
        
        return '\n'.join(frontmatter_lines)
    
    def _build_body_content(
        self,
        destination_path: Path,
        moc_links: List[str],
        analysis_data: Optional[Dict],
        routing_data: Dict
    ) -> str:
        """Build markdown body content"""
        lines = []
        
        # Title
        title = destination_path.stem.replace('_', ' ').replace('-', ' ').title()
        lines.append(f"# {title}\n")
        
        # MOC Links section
        if moc_links:
            lines.append("## Related MOCs\n")
            for moc in moc_links:
                lines.append(f"- [[{moc}]]")
            lines.append("")
        
        # Quick metadata section
        lines.append("## Metadata\n")
        lines.append(f"- **PARA Bucket**: {routing_data['para_bucket']}")
        lines.append(f"- **Category**: {routing_data.get('resource_category', 'N/A')}")
        
        if analysis_data:
            domain_data = analysis_data.get('domain_classification', {})
            if 'primary_domain' in domain_data:
                lines.append(f"- **Domain**: {domain_data['primary_domain']}")
        
        lines.append("")
        
        # Link to original file
        lines.append("## Source File\n")
        lines.append(f"![[{destination_path.name}]]\n")
        
        # Notes section
        lines.append("## Notes\n")
        lines.append("*Add your notes here*\n")
        
        return '\n'.join(lines)
    
    def _update_file_location(self, file_id: int, new_path: str, markdown_path: str):
        """Update file location in database"""
        update_query = """
            UPDATE files 
            SET file_path = ?,
                metadata = json_set(COALESCE(metadata, '{}'), '$.markdown_wrapper', ?)
            WHERE id = ?
        """
        self.db.execute(update_query, (new_path, markdown_path, file_id), fetch=False)
    
    def _mark_stage_complete(self, file_id: int, output_data: Dict):
        """Mark Stage 5 as complete"""
        insert_query = """
            INSERT INTO processing_stages 
            (file_id, batch_id, stage_name, status, output_data, started_at, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        
        now = datetime.now().isoformat()
        self.db.execute(insert_query, (
            file_id,
            None,
            'stage5_processing',
            'completed',
            json.dumps(output_data),
            now,
            now
        ), fetch=False)
    
    def _mark_stage_error(self, file_id: int, error_message: str):
        """Mark Stage 5 as failed"""
        insert_query = """
            INSERT INTO processing_stages 
            (file_id, batch_id, stage_name, status, error_message, started_at, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        
        now = datetime.now().isoformat()
        self.db.execute(insert_query, (
            file_id,
            None,
            'stage5_processing',
            'failed',
            error_message,
            now,
            now
        ), fetch=False)
