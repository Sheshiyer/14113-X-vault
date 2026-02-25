"""Tag classification using controlled vocabulary."""

import logging
from pathlib import Path
from typing import Dict, List, Optional


class TagClassifier:
    """Classify content using controlled vocabulary tags."""

    # Domain tags from controlled vocabulary
    DOMAIN_TAGS = [
        "ConsciousnessArchitecture", "ConsciousnessDebug", "PatternRecognition",
        "EnergyDynamics", "BiofieldMapping", "SystemArchitecture", "TechnicalMystic",
        "TechnicalSpiritual", "RuntimeOptimization", "SystemicThinking", "EmergentStrategy",
        "AdaptiveFramework", "IntegralThinking", "MorphicResonance", "EsotericWisdom",
        "AncientTechnology", "FieldCoherence", "Implementation", "Protocol", "Framework",
        "Research", "Analysis", "Visualization", "ResourceGuide", "ContentCreation",
        "MediaAnalysis", "DesignSystems", "BrandArchitecture", "BrandIdentity",
        "ProductDevelopment", "CommunityFrameworks", "SymbolicSystems", "SacredScience",
        "SacredGeometry", "SacredMathematics", "QuantumSpiritual", "ComparativeReligion",
        "AlternativeHistory", "Psychology", "Jungian", "Linguistics", "LogicGates",
        "BioelectricSystems", "EndocrineMapping", "ArchetypalSystems", "PatternStudies",
        "ResearchNotes", "VideoAnalysis", "AudioAnalysis", "Diagramming", "FieldTesting",
        "SystemIntegration", "DebugProtocol"
    ]

    OPERATIONAL_TAGS = [
        "WorkInProgress", "NeedsReview", "KeyInsight", "ImplementationNote",
        "Init", "Debug", "Optimize"
    ]

    def __init__(self, openrouter_client):
        """
        Initialize tag classifier.

        Args:
            openrouter_client: OpenRouter API client instance
        """
        self.client = openrouter_client
        self.logger = logging.getLogger(__name__)

    def classify(self, text: str, filename: str, metadata: Dict,
                 min_tags: int = 2, max_tags: int = 5) -> Dict:
        """
        Classify content and assign tags.

        Args:
            text: Content text
            filename: Original filename
            metadata: File metadata
            min_tags: Minimum number of tags
            max_tags: Maximum number of tags

        Returns:
            Classification results
        """
        prompt = f"""Analyze this content and classify it with appropriate tags from the controlled vocabulary.

Filename: {filename}
Author: {metadata.get('author', 'unknown')}
Type: {metadata.get('file_type', 'unknown')}

CONTROLLED VOCABULARY - Domain Tags (select {min_tags}-{max_tags}):
{', '.join(self.DOMAIN_TAGS)}

INSTRUCTIONS:
1. Read the content carefully
2. Select {min_tags} to {max_tags} most relevant tags from the domain tags list above
3. Tags should accurately represent the main themes and topics
4. Respond with valid JSON only

Required JSON format:
{{
  "domain_tags": ["Tag1", "Tag2", "Tag3"],
  "confidence": "high",
  "primary_theme": "brief description",
  "reasoning": "why these tags were selected"
}}

Content excerpt to analyze:
{text[:2000]}
"""

        result = {
            'domain_tags': [],
            'confidence': 'low',
            'primary_theme': '',
            'reasoning': '',
            'error': None
        }

        if self.client is None:
            result['domain_tags'] = self._fallback_classification(text, filename)
            result['error'] = 'Local mode: using fallback classification'
            return result

        try:
            response = self.client.analyze_content(text, prompt, response_format="json")

            if response:
                # Validate tags are from controlled vocabulary
                suggested_tags = response.get('domain_tags', [])
                valid_tags = [tag for tag in suggested_tags if tag in self.DOMAIN_TAGS]

                if len(valid_tags) < min_tags:
                    # Fallback: basic keyword matching
                    valid_tags = self._fallback_classification(text, filename)

                result['domain_tags'] = valid_tags[:max_tags]
                result['confidence'] = response.get('confidence', 'med')
                result['primary_theme'] = response.get('primary_theme', '')
                result['reasoning'] = response.get('reasoning', '')
            else:
                # Fallback if API fails
                result['domain_tags'] = self._fallback_classification(text, filename)
                result['confidence'] = 'low'
                result['error'] = 'API request failed, using fallback'

        except Exception as e:
            self.logger.error(f"Tag classification failed: {str(e)}")
            result['domain_tags'] = self._fallback_classification(text, filename)
            result['error'] = str(e)

        return result

    def _fallback_classification(self, text: str, filename: str) -> List[str]:
        """Fallback keyword-based classification."""
        text_lower = (text + " " + filename).lower()
        matched_tags = []

        # Keyword mapping
        keyword_map = {
            'consciousness': ['ConsciousnessArchitecture'],
            'pattern': ['PatternRecognition', 'PatternStudies'],
            'sacred': ['SacredScience', 'SacredGeometry'],
            'spiritual': ['TechnicalSpiritual', 'QuantumSpiritual'],
            'system': ['SystemArchitecture', 'SystemIntegration'],
            'brand': ['BrandArchitecture', 'BrandIdentity'],
            'psychology': ['Psychology', 'Jungian'],
            'research': ['Research', 'ResearchNotes'],
            'video': ['VideoAnalysis', 'MediaAnalysis'],
            'audio': ['AudioAnalysis', 'MediaAnalysis'],
            'design': ['DesignSystems'],
            'framework': ['Framework', 'AdaptiveFramework'],
            'protocol': ['Protocol'],
            'esoteric': ['EsotericWisdom'],
            'bioelectric': ['BioelectricSystems'],
            'enneagram': ['ArchetypalSystems'],
            'hormone': ['EndocrineMapping']
        }

        for keyword, tags in keyword_map.items():
            if keyword in text_lower:
                matched_tags.extend(tags)

        # Remove duplicates and limit
        matched_tags = list(dict.fromkeys(matched_tags))[:3]

        # Default if no matches
        if not matched_tags:
            matched_tags = ['Research', 'ResourceGuide']

        return matched_tags
