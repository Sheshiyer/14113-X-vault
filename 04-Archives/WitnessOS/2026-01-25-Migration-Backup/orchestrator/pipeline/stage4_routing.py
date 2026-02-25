"""
Stage 4: PARA Routing

Routes analyzed files to appropriate PARA buckets based on:
- Domain classification from Stage 3
- Content analysis
- MOC matching
- Duplicate detection
"""

import logging
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)


class Stage4Routing:
    """Routes files to PARA structure based on analysis results"""
    
    def __init__(self, db_manager, config: Dict):
        self.db = db_manager
        self.config = config
        self.para_structure = config['vault']['para_structure']
        self.default_bucket = config['routing']['default_bucket']
        self.duplicate_strategy = config['routing']['duplicate_strategy']
        self.conflict_resolution = config['routing']['conflict_resolution']
        
        # PARA bucket mappings
        self.para_buckets = {
            '01-Projects': Path(self.para_structure['projects']),
            '02-Areas': Path(self.para_structure['areas']),
            '03-Resources': Path(self.para_structure['resources']),
            '04-Archives': Path(self.para_structure['archives'])
        }
        
        # Domain to PARA mappings (from analysis stage)
        self.domain_para_map = {
            'wellness': '02-Areas',
            'meditation': '02-Areas',
            'health': '02-Areas',
            'finance': '02-Areas',
            'productivity': '02-Areas',
            'psychology': '03-Resources',
            'philosophy': '03-Resources',
            'science': '03-Resources',
            'technology': '03-Resources',
            'business': '03-Resources',
            'education': '03-Resources',
            'art': '03-Resources',
            'literature': '03-Resources',
            'history': '03-Resources',
            'biography': '03-Resources',
            'reference': '03-Resources',
            'fiction': '03-Resources',
            'travel': '03-Resources',
            'cooking': '03-Resources',
            'sports': '03-Resources',
            'music': '03-Resources',
            'language': '03-Resources',
            'spirituality': '02-Areas',
            'relationships': '02-Areas',
            'parenting': '02-Areas',
            'career': '02-Areas'
        }
    
    def run(self, inputs: Dict) -> Dict:
        """
        Execute Stage 4: Routing
        
        Args:
            inputs: Dictionary containing:
                - batch_id: Batch identifier
                - analyses: Analysis results from Stage 3
            
        Returns:
            Dict with routing statistics
        """
        batch_id = inputs.get('batch_id')
        dry_run = inputs.get('dry_run', self.config['processing'].get('dry_run', False))
        
        logger.info(f"Stage 4: Starting PARA routing for batch {batch_id}")
        
        stats = {
            'total_files': 0,
            'routed': 0,
            'duplicates_skipped': 0,
            'conflicts_renamed': 0,
            'errors': 0,
            'routing_decisions': {}
        }
        
        try:
            # Get files from previous stage
            files = self._get_analyzed_files(batch_id)
            stats['total_files'] = len(files)
            
            logger.info(f"Processing {len(files)} analyzed files")
            
            for file_record in files:
                try:
                    file_id = file_record['id']
                    source_path = Path(file_record['file_path'])
                    
                    # Get analysis results
                    analysis_data = self._get_analysis_results(file_id)
                    
                    if not analysis_data:
                        logger.warning(f"No analysis data for file {file_id}")
                        self._mark_stage_error(file_id, "Missing analysis data")
                        stats['errors'] += 1
                        continue
                    
                    # Determine PARA bucket and destination path
                    routing_decision = self._route_file(
                        source_path,
                        analysis_data,
                        file_record
                    )
                    
                    # Check for duplicates
                    if self._is_duplicate(routing_decision['destination_path']):
                        if self.duplicate_strategy == 'skip':
                            logger.info(f"Skipping duplicate: {source_path.name}")
                            self._mark_stage_complete(file_id, batch_id, routing_decision, 'duplicate_skipped')
                            stats['duplicates_skipped'] += 1
                            continue
                        elif self.duplicate_strategy == 'rename':
                            routing_decision['destination_path'] = self._resolve_conflict(
                                routing_decision['destination_path']
                            )
                            stats['conflicts_renamed'] += 1
                    
                    # Store routing decision
                    if not dry_run:
                        self._save_routing_decision(file_id, routing_decision)
                    
                    self._mark_stage_complete(file_id, batch_id, routing_decision, 'routed')
                    stats['routed'] += 1
                    
                    # Track routing by bucket
                    bucket = routing_decision['para_bucket']
                    stats['routing_decisions'][bucket] = stats['routing_decisions'].get(bucket, 0) + 1
                    
                    logger.debug(f"Routed {source_path.name} -> {routing_decision['para_bucket']}")
                    
                except Exception as e:
                    logger.error(f"Error routing file {file_id}: {e}")
                    self._mark_stage_error(file_id, batch_id, str(e))
                    stats['errors'] += 1
            
            logger.info(f"Stage 4 complete: {stats['routed']} routed, {stats['errors']} errors")
            return stats
            
        except Exception as e:
            logger.error(f"Stage 4 failed: {e}", exc_info=True)
            raise
    
    def _get_analyzed_files(self, batch_id: int) -> List[Dict]:
        """Get files that completed Stage 3 analysis"""
        query = """
            SELECT f.* FROM files f
            JOIN processing_stages ps ON f.id = ps.file_id
            WHERE ps.batch_id = ? 
            AND ps.stage_name = 'stage3_analysis'
            AND ps.status = 'completed'
        """
        return self.db.execute(query, (batch_id,))
    
    def _get_analysis_results(self, file_id: int) -> Optional[Dict]:
        """Retrieve analysis results from Stage 3"""
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
    
    def _route_file(self, source_path: Path, analysis: Dict, file_record: Dict) -> Dict:
        """
        Determine routing decision for a file
        
        Returns routing decision with:
        - para_bucket: Target PARA bucket
        - destination_path: Full destination path
        - subdomain: Subdomain folder within bucket
        - moc_links: MOCs to link to
        - reasoning: Why this routing was chosen
        """
        # Extract domain info from analysis
        domain_info = analysis.get('domain_classification', {})
        primary_domain = domain_info.get('primary_domain', 'general')
        resource_category = domain_info.get('resource_category', 'Uncategorized')
        suggested_bucket = domain_info.get('suggested_para_bucket', self.default_bucket)
        
        # Map domain to PARA bucket
        para_bucket = self._determine_para_bucket(primary_domain, suggested_bucket)
        
        # Determine subdomain folder
        subdomain = self._determine_subdomain(primary_domain, resource_category)
        
        # Build destination path
        bucket_path = self.para_buckets[para_bucket]
        destination_path = bucket_path / subdomain / source_path.name
        
        # Get MOC links from analysis
        moc_links = analysis.get('tags', {}).get('moc_suggestions', [])
        
        # Reasoning
        reasoning = (
            f"Domain: {primary_domain} -> {para_bucket}, "
            f"Category: {resource_category}, "
            f"Suggested: {suggested_bucket}"
        )
        
        routing_decision = {
            'para_bucket': para_bucket,
            'destination_path': str(destination_path),
            'subdomain': subdomain,
            'moc_links': moc_links[:3],  # Limit to top 3 MOCs
            'resource_category': resource_category,
            'reasoning': reasoning,
            'timestamp': datetime.now().isoformat()
        }
        
        logger.debug(f"Routing decision for {source_path.name}: {reasoning}")
        return routing_decision
    
    def _determine_para_bucket(self, primary_domain: str, suggested_bucket: str) -> str:
        """Determine which PARA bucket to use"""
        # Check domain mapping first
        if primary_domain in self.domain_para_map:
            mapped_bucket = self.domain_para_map[primary_domain]
            logger.debug(f"Domain {primary_domain} mapped to {mapped_bucket}")
            return mapped_bucket
        
        # Use suggested bucket from analysis
        if suggested_bucket in self.para_buckets:
            logger.debug(f"Using suggested bucket {suggested_bucket}")
            return suggested_bucket
        
        # Fallback to default
        logger.debug(f"Using default bucket {self.default_bucket}")
        return self.default_bucket
    
    def _determine_subdomain(self, primary_domain: str, resource_category: str) -> str:
        """Determine subdomain folder within PARA bucket"""
        # Use resource category as subdomain, normalized
        subdomain = resource_category.replace(' & ', '-').replace(' ', '-').lower()
        
        # Ensure valid folder name
        subdomain = ''.join(c for c in subdomain if c.isalnum() or c in '-_')
        
        return subdomain or 'general'
    
    def _is_duplicate(self, destination_path: str) -> bool:
        """Check if file already exists at destination"""
        return Path(destination_path).exists()
    
    def _resolve_conflict(self, destination_path: str) -> str:
        """Resolve naming conflict by adding counter"""
        dest_path = Path(destination_path)
        stem = dest_path.stem
        suffix = dest_path.suffix
        parent = dest_path.parent
        
        counter = 1
        while True:
            new_path = parent / f"{stem}_{counter}{suffix}"
            if not new_path.exists():
                logger.debug(f"Resolved conflict: {dest_path.name} -> {new_path.name}")
                return str(new_path)
            counter += 1
            
            if counter > 100:  # Safety limit
                raise ValueError(f"Could not resolve naming conflict for {destination_path}")
    
    def _save_routing_decision(self, file_id: int, routing_decision: Dict):
        """Save routing decision to metadata"""
        metadata_json = json.dumps(routing_decision)
        
        update_query = """
            UPDATE files 
            SET metadata = json_patch(COALESCE(metadata, '{}'), ?)
            WHERE id = ?
        """
        
        self.db.execute(update_query, (metadata_json, file_id), fetch=False)
        logger.debug(f"Saved routing decision for file {file_id}")
    
    def _mark_stage_complete(self, file_id: int, batch_id: str, output_data: Dict, status: str = 'completed'):
        """Mark Stage 4 as complete for a file"""
        insert_query = """
            INSERT INTO processing_stages 
            (file_id, batch_id, stage_name, status, output_data, started_at, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        
        now = datetime.now().isoformat()
        self.db.execute(insert_query, (
            file_id,
            batch_id,
            'stage4_routing',
            status,
            json.dumps(output_data),
            now,
            now
        ), fetch=False)
    
    def _mark_stage_error(self, file_id: int, batch_id: str, error_message: str):
        """Mark Stage 4 as failed for a file"""
        insert_query = """
            INSERT INTO processing_stages 
            (file_id, batch_id, stage_name, status, error_message, started_at, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        
        now = datetime.now().isoformat()
        self.db.execute(insert_query, (
            file_id,
            batch_id,
            'stage4_routing',
            'failed',
            error_message,
            now,
            now
        ), fetch=False)
