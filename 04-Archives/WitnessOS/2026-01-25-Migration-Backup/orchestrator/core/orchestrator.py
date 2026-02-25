"""Main orchestrator for vault intake processing."""

import yaml
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import uuid

from .logger import setup_logger, get_logger
from .state_manager import StateManager


class VaultOrchestrator:
    """Main orchestrator coordinating all processing stages."""

    def __init__(self, config_path: Path):
        """
        Initialize the vault orchestrator.

        Args:
            config_path: Path to configuration YAML file
        """
        self.config_path = config_path
        self.config = self._load_config()

        # Setup logging
        log_file = Path(self.config['logging']['log_dir']) / self.config['logging']['log_file']
        self.logger = setup_logger(
            name="vault_orchestrator",
            log_file=log_file,
            level=self.config['logging']['level'],
            rotation=self.config['logging']['rotation'],
            max_bytes=self.config['logging']['max_bytes'],
            backup_count=self.config['logging']['backup_count'],
            log_format=self.config['logging']['format']
        )

        self.logger.info("Initializing Vault Orchestrator")

        # Initialize state manager
        self.state_manager = StateManager(Path(self.config['database']['inventory_db']))

        # Initialize pipeline stages (will be imported later)
        self.stages = {}
        self._initialize_pipeline_stages()

        self.logger.info("Vault Orchestrator initialized successfully")

    def _initialize_pipeline_stages(self):
        """Initialize and register all pipeline stages."""
        stage_count = 0

        try:
            from pipeline.stage1_discovery import DiscoveryStage
            self.register_stage('discovery', DiscoveryStage(self.config, self.state_manager))
            stage_count += 1
        except ImportError as e:
            self.logger.warning(f"Discovery stage not available: {str(e)}")

        try:
            from pipeline.stage2_extraction import ExtractionStage
            self.register_stage('extraction', ExtractionStage(self.config, self.state_manager))
            stage_count += 1
        except ImportError as e:
            self.logger.warning(f"Extraction stage not available: {str(e)}")

        try:
            from pipeline.stage3_analysis import AnalysisStage
            self.register_stage('analysis', AnalysisStage(self.config, self.state_manager))
            stage_count += 1
        except ImportError as e:
            self.logger.warning(f"Analysis stage not available: {str(e)}")

        try:
            from pipeline.stage4_routing import Stage4Routing
            self.register_stage('routing', Stage4Routing(self.state_manager, self.config))
            stage_count += 1
        except ImportError as e:
            self.logger.warning(f"Routing stage not available: {str(e)}")

        try:
            from pipeline.stage5_processing import Stage5Processing
            self.register_stage('processing', Stage5Processing(self.state_manager, self.config))
            stage_count += 1
        except ImportError as e:
            self.logger.warning(f"Processing stage not available: {str(e)}")

        try:
            from pipeline.stage6_integration import Stage6Integration
            self.register_stage('integration', Stage6Integration(self.state_manager, self.config))
            stage_count += 1
        except ImportError as e:
            self.logger.warning(f"Integration stage not available: {str(e)}")

        if stage_count:
            self.logger.info(f"Initialized {stage_count} pipeline stages")
        else:
            self.logger.warning("No pipeline stages initialized")

    def _load_config(self) -> Dict:
        """Load configuration from YAML file."""
        with open(self.config_path, 'r') as f:
            return yaml.safe_load(f)

    def register_stage(self, stage_name: str, stage_instance):
        """Register a pipeline stage."""
        self.stages[stage_name] = stage_instance
        self.logger.debug(f"Registered pipeline stage: {stage_name}")

    def process_batch(
        self,
        batch_size: Optional[int] = None,
        file_types: Optional[List[str]] = None,
        source_folder: Optional[str] = None,
        dry_run: bool = False
    ) -> Dict[str, Any]:
        """
        Process a batch of files through the complete pipeline.

        Args:
            batch_size: Number of files to process (default from config)
            file_types: File types to process (default from config)
            source_folder: Source folder path (default from config)
            dry_run: If True, simulate processing without making changes

        Returns:
            Processing results dictionary
        """
        batch_id = f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
        self.logger.info(f"Starting batch processing: {batch_id}")

        # Use config defaults if not provided
        batch_size = batch_size or self.config['processing']['batch_size']
        source_folder = source_folder or self.config['vault']['processing_folder']
        file_types = file_types or self.config['filesystem']['supported_formats']

        # Create batch record
        batch_config = {
            'batch_size': batch_size,
            'file_types': file_types,
            'source_folder': source_folder,
            'dry_run': dry_run
        }
        self.state_manager.create_batch(batch_id, batch_config)

        results = {
            'batch_id': batch_id,
            'started_at': datetime.now().isoformat(),
            'total_files': 0,
            'successful': 0,
            'failed': 0,
            'skipped': 0,
            'errors': [],
            'stage_results': {}
        }

        try:
            # Stage 1: Discovery
            self.logger.info("Stage 1: Discovery - Scanning for files")
            discovery_results = self._run_stage('discovery', {
                'source_folder': source_folder,
                'file_types': file_types,
                'batch_size': batch_size,
                'batch_id': batch_id
            })
            results['stage_results']['discovery'] = discovery_results
            results['total_files'] = discovery_results.get('files_found', 0)

            if results['total_files'] == 0:
                self.logger.warning("No files found to process")
                return results

            # Stage 2: Extraction
            self.logger.info(f"Stage 2: Extraction - Processing {results['total_files']} files")
            extraction_results = self._run_stage('extraction', {
                'files': discovery_results.get('files', []),
                'batch_id': batch_id
            })
            results['stage_results']['extraction'] = extraction_results

            # Stage 3: Analysis
            self.logger.info("Stage 3: Analysis - AI-powered classification")
            analysis_results = self._run_stage('analysis', {
                'extracted_data': extraction_results.get('extractions', []),
                'batch_id': batch_id
            })
            results['stage_results']['analysis'] = analysis_results

            # Stage 4: Routing
            self.logger.info("Stage 4: Routing - PARA bucket assignment")
            routing_results = self._run_stage('routing', {
                'analyses': analysis_results.get('analyses', []),
                'batch_id': batch_id
            })
            results['stage_results']['routing'] = routing_results

            # Stage 5: Processing
            if not dry_run:
                self.logger.info("Stage 5: Processing - Creating files and metadata")
                processing_results = self._run_stage('processing', {
                    'routing_manifest': routing_results.get('manifest', []),
                    'batch_id': batch_id
                })
                results['stage_results']['processing'] = processing_results

                # Stage 6: Integration
                self.logger.info("Stage 6: Integration - Updating MOCs and indices")
                integration_results = self._run_stage('integration', {
                    'processed_files': processing_results.get('processed', []),
                    'batch_id': batch_id
                })
                results['stage_results']['integration'] = integration_results

                results['successful'] = processing_results.get('successful', 0)
                results['failed'] = processing_results.get('failed', 0)
                results['skipped'] = processing_results.get('skipped', 0)
            else:
                self.logger.info("Dry run mode - skipping file operations")
                results['successful'] = results['total_files']

            # Update batch statistics
            self.state_manager.update_batch_stats(batch_id, {
                'total': results['total_files'],
                'successful': results['successful'],
                'failed': results['failed'],
                'skipped': results['skipped'],
                'status': 'completed'
            })

            results['completed_at'] = datetime.now().isoformat()
            self.logger.info(f"Batch processing completed: {batch_id}")
            return results

        except Exception as e:
            self.logger.error(f"Batch processing failed: {str(e)}", exc_info=True)
            results['errors'].append(str(e))
            results['status'] = 'failed'
            self.state_manager.update_batch_stats(batch_id, {
                'status': 'failed'
            })
            raise

    def scan_files(self, source_folder: Optional[str] = None, force: bool = False) -> int:
        """
        Scan directory and populate inventory without processing.
        
        Args:
            source_folder: Optional override for source folder
            force: Whether to force re-scan of existing files
            
        Returns:
            Total number of files in inventory
        """
        # Use discovery stage logic but for all files
        if 'discovery' not in self.stages:
            self.logger.error("Discovery stage not available")
            return 0
            
        discovery_stage = self.stages['discovery']
        
        # Prepare inputs mimicking a massive batch run
        inputs = {
            'source_folder': source_folder or self.config['vault']['processing_folder'],
            'file_types': self.config['filesystem']['supported_formats'],
            'batch_size': 1000000,  # Large number to catch all
            'batch_id': 'scan_only',
            'scan_only': True  # Hint to stage to skip some overhead if possible
        }
        
        self.logger.info("Starting full inventory scan...")
        results = discovery_stage.run(inputs)
        
        # Get total count from DB
        stats = self.state_manager.get_statistics()
        return stats['files']['total_files']

    def _run_stage(self, stage_name: str, inputs: Dict) -> Dict:
        """
        Run a pipeline stage.

        Args:
            stage_name: Name of the stage to run
            inputs: Input data for the stage

        Returns:
            Stage results dictionary
        """
        if stage_name not in self.stages:
            self.logger.warning(f"Stage '{stage_name}' not registered, skipping")
            return {}

        try:
            stage = self.stages[stage_name]
            self.logger.debug(f"Running stage: {stage_name}")
            results = stage.run(inputs)
            self.logger.debug(f"Stage {stage_name} completed successfully")
            return results
        except Exception as e:
            self.logger.error(f"Stage {stage_name} failed: {str(e)}", exc_info=True)
            raise

    def verify(self, check_type: str = 'all') -> Dict[str, Any]:
        """
        Verify vault integrity.

        Args:
            check_type: Type of check (duplicates, broken_links, missing_metadata, all)

        Returns:
            Verification results
        """
        self.logger.info(f"Running verification: {check_type}")
        results = {
            'check_type': check_type,
            'timestamp': datetime.now().isoformat(),
            'issues': []
        }

        # TODO: Implement verification logic
        self.logger.info("Verification completed")
        return results

    def generate_inventory(self, output_path: Optional[Path] = None) -> Dict[str, Any]:
        """
        Generate inventory report.

        Args:
            output_path: Path to save inventory report

        Returns:
            Inventory statistics
        """
        self.logger.info("Generating inventory")
        stats = self.state_manager.get_statistics()

        if output_path:
            # Generate markdown report
            report = self._format_inventory_report(stats)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(report)
            self.logger.info(f"Inventory report saved to: {output_path}")

        return stats

    def _format_inventory_report(self, stats: Dict) -> str:
        """Format inventory statistics as markdown."""
        report = f"""# Vault Inventory Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## File Statistics

- **Total Files:** {stats['files']['total_files']}
- **Completed:** {stats['files']['completed']}
- **Failed:** {stats['files']['failed']}
- **Pending:** {stats['files']['pending']}
- **Skipped:** {stats['files']['skipped']}

## Batch Statistics

- **Total Batches:** {stats['batches']['total_batches']}
- **Completed Batches:** {stats['batches']['completed_batches']}
- **Running Batches:** {stats['batches']['running_batches']}

## Duplicates

- **Duplicate Files Found:** {stats['duplicates']['duplicate_count']}

---
*Generated by Vault Intake Orchestrator*
"""
        return report

    def get_status(self, detail_level: str = 'summary') -> Dict[str, Any]:
        """
        Get current processing status.

        Args:
            detail_level: Level of detail (summary, detailed, errors_only)

        Returns:
            Status information
        """
        stats = self.state_manager.get_statistics()
        pipeline_stats = self.state_manager.get_pipeline_stats()
        
        result = {
            'timestamp': datetime.now().isoformat(),
            'detail_level': detail_level,
            'statistics': stats,
            'pipeline_stats': pipeline_stats
        }
        
        if detail_level in ['detailed', 'errors_only']:
            result['active_batches'] = self.state_manager.get_active_batches()
            result['pending_files'] = self.state_manager.get_pending_files(limit=20)
        
        if detail_level == 'detailed':
            result['recent_files'] = self.state_manager.get_recent_files(limit=10)
            result['failed_files'] = self.state_manager.get_failed_files(limit=10)
            result['error_summary'] = self.state_manager.get_error_summary()
        
        if detail_level == 'errors_only':
            result['failed_files'] = self.state_manager.get_failed_files(limit=50)
            result['error_summary'] = self.state_manager.get_error_summary()
        
        return result
