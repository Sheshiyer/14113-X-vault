"""Muse-Enneagram type mapping."""

import logging
from typing import Dict, Optional


class EnneagramMapper:
    """Map content to Muse-Enneagram types."""

    # Enneagram type mappings
    ENNEAGRAM_TYPES = {
        1: {
            'name': 'The Reformer',
            'muse': 'Polymnia',
            'muse_meaning': 'Sacred Poetry',
            'hormone': 'Melatonin',
            'function': 'Circadian Rhythm/Sacred Timing',
            'shadow': 'Wrath',
            'virtue': 'Wisdom',
            'constellation': 'Hercules/Ophiuchus',
            'keywords': ['perfection', 'reform', 'timing', 'sacred', 'wisdom', 'order', 'discipline']
        },
        2: {
            'name': 'The Helper',
            'muse': 'Clio',
            'muse_meaning': 'History',
            'hormone': 'Oxytocin',
            'function': 'Bonding/Memory Formation',
            'shadow': 'Pride',
            'virtue': 'Humility',
            'constellation': 'Pavo',
            'keywords': ['helping', 'service', 'bonding', 'connection', 'memory', 'care', 'giving']
        },
        3: {
            'name': 'The Achiever',
            'muse': 'Euterpe',
            'muse_meaning': 'Music',
            'hormone': 'Endorphins',
            'function': 'Pain Relief/Pleasure/Healing',
            'shadow': 'Deceit',
            'virtue': 'Authenticity',
            'keywords': ['achievement', 'success', 'healing', 'music', 'authenticity', 'performance']
        },
        4: {
            'name': 'The Individualist',
            'muse': 'Thalia',
            'muse_meaning': 'Comedy',
            'hormone': 'Dopamine',
            'function': 'Pleasure/Reward',
            'shadow': 'Envy',
            'virtue': 'Equanimity',
            'constellation': 'Lyra',
            'keywords': ['individual', 'unique', 'creative', 'pleasure', 'joy', 'expression', 'emotion']
        },
        5: {
            'name': 'The Investigator',
            'muse': 'Melpomene',
            'muse_meaning': 'Tragedy',
            'hormone': 'Cortisol',
            'function': 'Stress Response/Growth',
            'shadow': 'Avarice',
            'virtue': 'Non-attachment',
            'constellation': 'Monoceros',
            'keywords': ['knowledge', 'investigation', 'research', 'analysis', 'understanding', 'observer']
        },
        6: {
            'name': 'The Loyalist',
            'muse': 'Erato',
            'muse_meaning': 'Love',
            'hormone': 'Estrogen',
            'function': 'Creation/Nurture',
            'shadow': 'Fear',
            'virtue': 'Courage',
            'keywords': ['loyalty', 'security', 'love', 'protection', 'trust', 'devotion']
        },
        7: {
            'name': 'The Enthusiast',
            'muse': 'Calliope',
            'muse_meaning': 'Epic Poetry',
            'hormone': 'Testosterone',
            'function': 'Growth/Development/Drive',
            'shadow': 'Gluttony',
            'virtue': 'Sobriety',
            'keywords': ['enthusiasm', 'adventure', 'growth', 'drive', 'epic', 'excitement']
        },
        8: {
            'name': 'The Challenger',
            'muse': 'Terpsichore',
            'muse_meaning': 'Dance',
            'hormone': 'Adrenaline',
            'function': 'Fight/Flight/Movement',
            'shadow': 'Lust',
            'virtue': 'Innocence',
            'constellation': 'Leonids',
            'keywords': ['power', 'challenge', 'movement', 'action', 'strength', 'intensity']
        },
        9: {
            'name': 'The Peacemaker',
            'muse': 'Urania',
            'muse_meaning': 'Astronomy',
            'hormone': 'Serotonin',
            'function': 'Mood/Balance Regulation',
            'shadow': 'Sloth',
            'virtue': 'Action',
            'keywords': ['peace', 'harmony', 'balance', 'astronomy', 'universal', 'unity']
        }
    }

    def __init__(self, openrouter_client):
        """
        Initialize Enneagram mapper.

        Args:
            openrouter_client: OpenRouter API client instance
        """
        self.client = openrouter_client
        self.logger = logging.getLogger(__name__)

    def map_type(self, text: str, filename: str, domain_tags: list) -> Dict:
        """
        Map content to Enneagram type.

        Args:
            text: Content text
            filename: Original filename
            domain_tags: Already classified domain tags

        Returns:
            Enneagram mapping results
        """
        # Build type descriptions for prompt
        type_descriptions = []
        for type_num, type_info in self.ENNEAGRAM_TYPES.items():
            desc = f"Type {type_num} - {type_info['name']} | Muse: {type_info['muse']} ({type_info['muse_meaning']}) | Hormone: {type_info['hormone']} | Function: {type_info['function']} | Shadow: {type_info['shadow']} | Virtue: {type_info['virtue']}"
            type_descriptions.append(desc)

        prompt = f"""Analyze this content and map it to the most appropriate Muse-Enneagram type.

Filename: {filename}
Domain Tags: {', '.join(domain_tags)}

MUSE-ENNEAGRAM FRAMEWORK:
{chr(10).join(type_descriptions)}

INSTRUCTIONS:
1. Read the content and consider the themes
2. Select the most appropriate Enneagram type (1-9)
3. Provide confidence level (low/med/high)
4. Respond with valid JSON only

Required JSON format:
{{
  "ennea_type": 5,
  "muse_archetype": "Melpomene",
  "endocrine_mapping": "Cortisol",
  "confidence": "med",
  "reasoning": "brief explanation why this type fits"
}}

Content excerpt:
{text[:1500]}
"""

        result = {
            'ennea_type': None,
            'muse_archetype': None,
            'endocrine_mapping': None,
            'confidence': 'low',
            'reasoning': '',
            'error': None
        }

        if self.client is None:
            result.update(self._fallback_mapping(text, filename, domain_tags))
            result['error'] = 'Local mode: using fallback mapping'
            return result

        try:
            response = self.client.analyze_content(text, prompt, response_format="json")

            if response:
                type_num = response.get('ennea_type')

                # Validate type number
                if type_num and 1 <= type_num <= 9:
                    type_info = self.ENNEAGRAM_TYPES[type_num]
                    result['ennea_type'] = type_num
                    result['muse_archetype'] = type_info['muse']
                    result['endocrine_mapping'] = type_info['hormone']
                    result['confidence'] = response.get('confidence', 'med')
                    result['reasoning'] = response.get('reasoning', '')
                else:
                    # Fallback
                    fallback = self._fallback_mapping(text, filename, domain_tags)
                    result.update(fallback)
                    result['error'] = 'Invalid type number from API, using fallback'
            else:
                # Fallback if API fails
                fallback = self._fallback_mapping(text, filename, domain_tags)
                result.update(fallback)
                result['error'] = 'API request failed, using fallback'

        except Exception as e:
            self.logger.error(f"Enneagram mapping failed: {str(e)}")
            fallback = self._fallback_mapping(text, filename, domain_tags)
            result.update(fallback)
            result['error'] = str(e)

        return result

    def _fallback_mapping(self, text: str, filename: str, domain_tags: list) -> Dict:
        """Fallback keyword-based Enneagram mapping."""
        text_lower = (text + " " + filename + " " + " ".join(domain_tags)).lower()

        # Score each type based on keyword matches
        scores = {i: 0 for i in range(1, 10)}

        for type_num, type_info in self.ENNEAGRAM_TYPES.items():
            for keyword in type_info['keywords']:
                if keyword in text_lower:
                    scores[type_num] += 1

        # Get type with highest score
        best_type = max(scores, key=scores.get)

        # Default to Type 5 (Investigator) if no clear match
        if scores[best_type] == 0:
            best_type = 5

        type_info = self.ENNEAGRAM_TYPES[best_type]

        return {
            'ennea_type': best_type,
            'muse_archetype': type_info['muse'],
            'endocrine_mapping': type_info['hormone'],
            'confidence': 'low',
            'reasoning': 'Fallback keyword matching'
        }
