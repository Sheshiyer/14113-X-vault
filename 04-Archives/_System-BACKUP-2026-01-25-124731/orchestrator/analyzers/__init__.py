"""AI-powered analysis modules."""

try:
    from .openrouter_client import OpenRouterClient
except ImportError:  # Allows local-only usage without requests installed
    OpenRouterClient = None
from .tag_classifier import TagClassifier
from .enneagram_mapper import EnneagramMapper
from .domain_detector import DomainDetector

__all__ = ['OpenRouterClient', 'TagClassifier', 'EnneagramMapper', 'DomainDetector']
