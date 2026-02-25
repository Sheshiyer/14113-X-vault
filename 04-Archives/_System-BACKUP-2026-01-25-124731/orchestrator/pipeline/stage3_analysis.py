"""Stage 3: AI-powered content analysis."""

import logging
from pathlib import Path
from typing import Dict, List
import json

from analyzers.tag_classifier import TagClassifier
from analyzers.enneagram_mapper import EnneagramMapper
from analyzers.domain_detector import DomainDetector
from core.state_manager import StateManager


class AnalysisStage:
    """AI-powered content analysis and classification."""

    def __init__(self, config: Dict, state_manager: StateManager):
        """
        Initialize analysis stage.

        Args:
            config: Configuration dictionary
            state_manager: State manager instance
        """
        self.config = config
        self.state_manager = state_manager
        self.logger = logging.getLogger(__name__)

        analysis_mode = config.get('analysis', {}).get('mode', '').lower()
        use_local = analysis_mode == 'local' or not config.get('openrouter', {}).get('api_key')

        if use_local:
            self.logger.info("Analysis mode set to local; skipping OpenRouter")
            self.rotation_manager = None
            self.openrouter_client = None
        else:
            from analyzers.openrouter_client import OpenRouterClient
            # Initialize model rotation manager
            from analyzers.model_rotation_manager import ModelRotationManager
            self.rotation_manager = ModelRotationManager(config['openrouter'])

            # Initialize OpenRouter client with rotation manager
            self.openrouter_client = OpenRouterClient(
                api_key=config['openrouter']['api_key'],
                base_url=config['openrouter']['base_url'],
                rate_limit=config['openrouter']['rate_limit'],
                timeout=config['openrouter']['timeout'],
                max_retries=config['openrouter']['max_retries'],
                retry_delay=config['openrouter']['retry_delay'],
                rotation_manager=self.rotation_manager
            )

        # Initialize analyzers
        self.tag_classifier = TagClassifier(self.openrouter_client)
        self.enneagram_mapper = EnneagramMapper(self.openrouter_client)
        self.domain_detector = DomainDetector(self.openrouter_client)

        self.output_dir = Path(config['output']['analyses_dir'])
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def run(self, inputs: Dict) -> Dict:
        """
        Run analysis stage.

        Args:
            inputs: Dictionary with extracted_data list and batch_id

        Returns:
            Analysis results
        """
        extracted_data = inputs['extracted_data']
        batch_id = inputs['batch_id']

        self.logger.info(f"Analyzing {len(extracted_data)} files with AI")

        results = {
            'successful': 0,
            'failed': 0,
            'analyses': []
        }

        for extraction in extracted_data:
            if not extraction.get('success'):
                results['failed'] += 1
                continue

            try:
                analysis = self._analyze_content(extraction, batch_id)

                if analysis['success']:
                    results['successful'] += 1
                    results['analyses'].append(analysis)
                else:
                    results['failed'] += 1

            except Exception as e:
                self.logger.error(f"Analysis failed for {extraction['file_path']}: {str(e)}")
                results['failed'] += 1

        self.logger.info(f"Analysis complete: {results['successful']} successful, {results['failed']} failed")
        return results

    def _analyze_content(self, extraction: Dict, batch_id: str) -> Dict:
        """
        Analyze a single extracted content.

        Args:
            extraction: Extraction result dictionary
            batch_id: Batch ID

        Returns:
            Analysis result
        """
        file_id = extraction['file_id']
        file_path = extraction['file_path']
        text = extraction['extracted_text']
        extraction_metadata = extraction.get('extraction_metadata', {})

        result = {
            'file_id': file_id,
            'file_path': file_path,
            'success': False,
            'error': None,
            'domain_tags': [],
            'ennea_type': None,
            'muse_archetype': None,
            'endocrine_mapping': None,
            'para_bucket': '03-Resources',
            'resource_category': 'Unsorted',
            'topic_cluster': '',
            'content_type': 'unknown',
            'confidence': 'low',
            'suggested_mocs': []
        }

        try:
            # Get filename from path
            filename = Path(file_path).name

            # Step 1: Tag Classification
            self.logger.debug(f"Classifying tags for {filename}")
            tag_result = self.tag_classifier.classify(
                text=text,
                filename=filename,
                metadata=extraction_metadata,
                min_tags=self.config['analysis']['min_tags'],
                max_tags=self.config['analysis']['max_tags']
            )

            result['domain_tags'] = tag_result['domain_tags']
            tag_confidence = tag_result['confidence']

            # Step 2: Enneagram Mapping (if enabled)
            if self.config['analysis']['enable_enneagram_mapping']:
                self.logger.debug(f"Mapping Enneagram type for {filename}")
                enneagram_result = self.enneagram_mapper.map_type(
                    text=text,
                    filename=filename,
                    domain_tags=result['domain_tags']
                )

                result['ennea_type'] = enneagram_result['ennea_type']
                result['muse_archetype'] = enneagram_result['muse_archetype']
                result['endocrine_mapping'] = enneagram_result['endocrine_mapping']
                enneagram_confidence = enneagram_result['confidence']
            else:
                enneagram_confidence = 'n/a'

            # Step 3: Domain Detection and PARA Routing
            self.logger.debug(f"Detecting domain for {filename}")
            domain_result = self.domain_detector.detect(
                text=text,
                filename=filename,
                metadata=extraction_metadata,
                domain_tags=result['domain_tags']
            )

            result['para_bucket'] = domain_result['para_bucket']
            result['resource_category'] = domain_result['resource_category']
            result['topic_cluster'] = domain_result['topic_cluster']
            result['content_type'] = domain_result['content_type']
            domain_confidence = domain_result['confidence']

            # Step 4: Suggest MOCs based on tags and category
            result['suggested_mocs'] = self._suggest_mocs(
                domain_tags=result['domain_tags'],
                resource_category=result['resource_category'],
                para_bucket=result['para_bucket']
            )

            # Overall confidence (lowest of all confidences)
            confidences = [tag_confidence, domain_confidence]
            if enneagram_confidence != 'n/a':
                confidences.append(enneagram_confidence)

            confidence_order = {'low': 0, 'med': 1, 'high': 2}
            min_confidence = min(confidences, key=lambda x: confidence_order.get(x, 0))
            result['confidence'] = min_confidence

            # Save analysis to JSON
            output_file = self.output_dir / f"{Path(file_path).stem}_analysis.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)

            # Update state
            self.state_manager.add_stage_record(
                file_id=file_id,
                batch_id=batch_id,
                stage_name='stage3_analysis',
                status='completed',
                output_data={
                    'output_file': str(output_file),
                    'confidence': result['confidence']
                }
            )

            result['success'] = True

        except Exception as e:
            result['error'] = str(e)
            self.logger.error(f"Analysis failed for {file_path}: {str(e)}")

            self.state_manager.add_stage_record(
                file_id=file_id,
                batch_id=batch_id,
                stage_name='stage3_analysis',
                status='failed',
                error_message=str(e)
            )

        return result

    def _suggest_mocs(self, domain_tags: List[str], resource_category: str, para_bucket: str) -> List[str]:
        """Suggest relevant MOCs based on tags and category."""
        suggested_mocs = []

        # Map tags to likely MOCs
        tag_moc_map = {
            'ConsciousnessArchitecture': ['Consciousness-Models/_index'],
            'SacredScience': ['03-Resources/Sacred-Science/_index'],
            'Psychology': ['03-Resources/Psychology/_index'],
            'VideoAnalysis': ['03-Resources/Video-Analysis/_index'],
            'BrandArchitecture': ['02-Areas/Brand-Architecture/_index'],
            'TechnicalMystic': ['02-Areas/Technical-Mystical-Integration/_index']
        }

        for tag in domain_tags:
            if tag in tag_moc_map:
                suggested_mocs.extend(tag_moc_map[tag])

        # Add category index
        if para_bucket == '03-Resources':
            suggested_mocs.append(f"03-Resources/{resource_category}/_index")

        # Remove duplicates
        suggested_mocs = list(dict.fromkeys(suggested_mocs))

        # Limit to max MOCs
        max_mocs = self.config['analysis']['max_mocs']
        return suggested_mocs[:max_mocs]
