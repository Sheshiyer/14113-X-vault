"""Domain detection and PARA categorization."""

import logging
from typing import Dict, List


class DomainDetector:
    """Detect content domain and suggest PARA categorization."""

    # Resource categories from vault structure
    RESOURCE_CATEGORIES = [
        "Authors", "Business", "Career", "Content", "Creative-Ideas", "Design",
        "Diagrams", "Entertainment", "Health", "Lifestyle", "Media",
        "People", "Productivity", "Psychology", "Quotes-Collections",
        "Reference", "Research", "Research-Notes", "Sacred-Science",
        "Self-Improvement", "Skills", "Society-Culture", "Spirituality-Esoteric",
        "Technical", "Unsorted", "Video-Analysis"
    ]

    def __init__(self, openrouter_client):
        """
        Initialize domain detector.

        Args:
            openrouter_client: OpenRouter API client instance
        """
        self.client = openrouter_client
        self.logger = logging.getLogger(__name__)

    def detect(self, text: str, filename: str, metadata: Dict, domain_tags: List[str]) -> Dict:
        """
        Detect domain and suggest PARA bucket and category.

        Args:
            text: Content text
            filename: Original filename
            metadata: File metadata
            domain_tags: Classified domain tags

        Returns:
            Domain detection results
        """
        prompt = f"""Analyze this content and determine its PARA categorization and resource category.

Filename: {filename}
File Type: {metadata.get('file_type', 'unknown')}
Domain Tags: {', '.join(domain_tags)}

PARA BUCKETS:
- 01-Projects: Active projects and initiatives (current development work)
- 02-Areas: Ongoing areas of responsibility and expertise
- 03-Resources: Reference materials, research, knowledge base
- 04-Archives: Completed or inactive materials

RESOURCE CATEGORIES (for 03-Resources):
{', '.join(self.RESOURCE_CATEGORIES)}

INSTRUCTIONS:
1. Determine if this is active work (Projects), ongoing focus (Areas), reference (Resources), or archived (Archives)
2. If Resources, select the most appropriate category
3. Suggest a topic cluster for grouping related content
4. Respond with valid JSON only

Required JSON format:
{{
  "para_bucket": "03-Resources",
  "resource_category": "Sacred-Science",
  "topic_cluster": "consciousness-studies",
  "content_type": "book",
  "confidence": "high",
  "reasoning": "brief explanation"
}}

Content types: book, paper, presentation, image, audio, video, dataset, software, note, archive, unknown

Content excerpt:
{text[:1500]}
"""

        result = {
            'para_bucket': '03-Resources',
            'resource_category': 'Unsorted',
            'topic_cluster': '',
            'content_type': 'unknown',
            'confidence': 'low',
            'reasoning': '',
            'error': None
        }

        if self.client is None:
            result.update(self._fallback_detection(filename, metadata, domain_tags))
            result['error'] = 'Local mode: using fallback detection'
            return result

        try:
            response = self.client.analyze_content(text, prompt, response_format="json")

            if response:
                # Validate PARA bucket
                para_bucket = response.get('para_bucket', '03-Resources')
                if para_bucket not in ['01-Projects', '02-Areas', '03-Resources', '04-Archives']:
                    para_bucket = '03-Resources'

                # Validate resource category
                resource_category = response.get('resource_category', 'Unsorted')
                if resource_category not in self.RESOURCE_CATEGORIES:
                    resource_category = self._infer_category(domain_tags)

                result['para_bucket'] = para_bucket
                result['resource_category'] = resource_category
                result['topic_cluster'] = response.get('topic_cluster', '')
                result['content_type'] = response.get('content_type', self._infer_content_type(metadata))
                result['confidence'] = response.get('confidence', 'med')
                result['reasoning'] = response.get('reasoning', '')
            else:
                # Fallback
                result.update(self._fallback_detection(filename, metadata, domain_tags))
                result['error'] = 'API request failed, using fallback'

        except Exception as e:
            self.logger.error(f"Domain detection failed: {str(e)}")
            result.update(self._fallback_detection(filename, metadata, domain_tags))
            result['error'] = str(e)

        return result

    def _fallback_detection(self, filename: str, metadata: Dict, domain_tags: List[str]) -> Dict:
        """Fallback domain detection."""
        # Infer content type from file extension
        content_type = self._infer_content_type(metadata)

        # Infer category from tags
        category = self._infer_category(domain_tags)

        # Default to Resources
        return {
            'para_bucket': '03-Resources',
            'resource_category': category,
            'topic_cluster': '',
            'content_type': content_type,
            'confidence': 'low',
            'reasoning': 'Fallback detection based on file type and tags'
        }

    def _infer_content_type(self, metadata: Dict) -> str:
        """Infer content type from metadata."""
        file_type = metadata.get('file_type', '').lower()

        type_map = {
            '.pdf': 'book',
            '.epub': 'book',
            '.md': 'note',
            '.html': 'note',
            '.mp3': 'audio',
            '.mp4': 'video',
            '.png': 'image',
            '.jpg': 'image',
            '.jpeg': 'image'
        }

        return type_map.get(file_type, 'unknown')

    def _infer_category(self, domain_tags: List[str]) -> str:
        """Infer resource category from domain tags."""
        # Tag to category mapping
        tag_category_map = {
            'SacredScience': 'Sacred-Science',
            'SacredGeometry': 'Sacred-Science',
            'SacredMathematics': 'Sacred-Science',
            'Psychology': 'Psychology',
            'Jungian': 'Psychology',
            'VideoAnalysis': 'Video-Analysis',
            'AudioAnalysis': 'Media',
            'Research': 'Research',
            'ResearchNotes': 'Research-Notes',
            'DesignSystems': 'Design',
            'BrandArchitecture': 'Business',
            'BrandIdentity': 'Business',
            'Technical': 'Technical',
            'TechnicalMystic': 'Technical',
            'TechnicalSpiritual': 'Spirituality-Esoteric',
            'EsotericWisdom': 'Spirituality-Esoteric',
            'Diagramming': 'Diagrams'
        }

        for tag in domain_tags:
            if tag in tag_category_map:
                return tag_category_map[tag]

        # Default
        return 'Unsorted'
