"""Pipeline stages for processing."""

from .stage1_discovery import DiscoveryStage
from .stage2_extraction import ExtractionStage

__all__ = ['DiscoveryStage', 'ExtractionStage']
