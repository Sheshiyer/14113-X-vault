"""
Intelligent Model Rotation Manager

Manages model selection and rotation to:
1. Avoid rate limits by rotating through model pools
2. Select appropriate models based on content type
3. Track usage and implement cooldown periods
4. Optimize API call distribution
"""

import logging
import time
import random
import json
from pathlib import Path
from typing import Dict, List, Optional, Set
from collections import defaultdict, deque
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class ModelRotationManager:
    """Manages intelligent model selection and rotation"""
    
    def __init__(self, config: Dict):
        """
        Initialize model rotation manager.
        
        Args:
            config: OpenRouter configuration with model pools
        """
        self.config = config
        self.model_pools = config.get('model_pools', {})
        self.rotation_config = config.get('rotation', {})
        self.selection_rules = config.get('selection_rules', {})
        
        # Rotation settings
        self.enabled = self.rotation_config.get('enabled', True)
        self.strategy = self.rotation_config.get('strategy', 'round_robin')
        self.max_requests_per_model = self.rotation_config.get('max_requests_per_model', 10)
        self.cooldown_period = self.rotation_config.get('cooldown_period', 60)
        
        # Track model usage
        self.model_request_counts = defaultdict(int)
        self.model_last_used = {}
        self.model_error_counts = defaultdict(int)
        
        # Round-robin state
        self.current_pool_indices = defaultdict(int)
        
        # Model performance tracking
        self.model_success_rate = defaultdict(lambda: {'success': 0, 'total': 0})
        
        # Persistence
        self.stats_file = Path(config.get('stats_file', 'data/rotation_stats.json'))
        self._load_stats()
        
        logger.info(f"ModelRotationManager initialized: {self.strategy} strategy")
        logger.info(f"Model pools: {list(self.model_pools.keys())}")
        
    def _load_stats(self):
        """Load statistics from disk"""
        try:
            if self.stats_file.exists():
                with open(self.stats_file, 'r') as f:
                    data = json.load(f)
                    self.model_request_counts.update(data.get('request_counts', {}))
                    self.model_last_used.update(data.get('last_used', {}))
                    self.model_error_counts.update(data.get('error_counts', {}))
                    
                    # Restore success rates
                    rates = data.get('success_rates', {})
                    for model, stats in rates.items():
                        self.model_success_rate[model] = stats
        except Exception as e:
            logger.error(f"Failed to load stats: {e}")

    def _save_stats(self):
        """Save statistics to disk"""
        try:
            self.stats_file.parent.mkdir(parents=True, exist_ok=True)
            data = {
                'request_counts': dict(self.model_request_counts),
                'last_used': dict(self.model_last_used),
                'error_counts': dict(self.model_error_counts),
                'success_rates': dict(self.model_success_rate),
                'updated_at': datetime.now().isoformat()
            }
            with open(self.stats_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save stats: {e}")

    def select_model(self, content_tags: Optional[List[str]] = None, 
                    file_metadata: Optional[Dict] = None) -> str:
        """
        Select the best model based on content and rotation strategy.
        
        Args:
            content_tags: List of content tags
            file_metadata: File metadata for context
            
        Returns:
            Selected model ID
        """
        if not self.enabled:
            # Use first general model if rotation disabled
            return self.model_pools['general'][0]
        
        # Determine which pool to use
        pool_name = self._select_pool(content_tags, file_metadata)
        pool = self.model_pools.get(pool_name, self.model_pools['general'])
        
        logger.debug(f"Selected pool: {pool_name} (tags: {content_tags})")
        
        # Apply rotation strategy
        if self.strategy == 'round_robin':
            model = self._round_robin_selection(pool_name, pool)
        elif self.strategy == 'random':
            model = self._random_selection(pool)
        elif self.strategy == 'least_used':
            model = self._least_used_selection(pool)
        else:
            model = pool[0]
        
        # Check cooldown
        if self._is_in_cooldown(model):
            logger.debug(f"Model {model} in cooldown, selecting alternative")
            model = self._select_alternative(pool, model)
        
        # Check request limit
        if self.model_request_counts[model] >= self.max_requests_per_model:
            logger.debug(f"Model {model} hit request limit, rotating")
            model = self._select_alternative(pool, model)
            self.model_request_counts[model] = 0  # Reset counter
        
        # Update tracking
        self.model_request_counts[model] += 1
        self.model_last_used[model] = time.time()
        self._save_stats()
        
        logger.info(f"✓ Selected model: {model} (pool: {pool_name}, requests: {self.model_request_counts[model]})")
        return model
    
    def _select_pool(self, content_tags: Optional[List[str]], 
                    file_metadata: Optional[Dict]) -> str:
        """Determine which model pool to use based on content"""
        
        if not content_tags:
            return 'general'
        
        # Check for uncensored content
        uncensored_tags = set(self.selection_rules.get('uncensored_tags', []))
        if any(tag.lower() in uncensored_tags for tag in content_tags):
            logger.info("🔓 Detected sensitive content, using uncensored model pool")
            return 'uncensored'
        
        # Check for reasoning-heavy content
        reasoning_tags = set(self.selection_rules.get('reasoning_tags', []))
        if any(tag.lower() in reasoning_tags for tag in content_tags):
            logger.info("🧠 Detected complex content, using reasoning model pool")
            return 'reasoning'
        
        return 'general'
    
    def _round_robin_selection(self, pool_name: str, pool: List[str]) -> str:
        """Select next model in round-robin fashion"""
        idx = self.current_pool_indices[pool_name]
        model = pool[idx % len(pool)]
        self.current_pool_indices[pool_name] = (idx + 1) % len(pool)
        return model
    
    def _random_selection(self, pool: List[str]) -> str:
        """Select random model from pool"""
        # Weight by success rate
        weights = []
        for model in pool:
            stats = self.model_success_rate[model]
            if stats['total'] == 0:
                weights.append(1.0)  # New model, give it a chance
            else:
                success_rate = stats['success'] / stats['total']
                weights.append(max(success_rate, 0.1))  # Min weight 0.1
        
        return random.choices(pool, weights=weights)[0]
    
    def _least_used_selection(self, pool: List[str]) -> str:
        """Select least-used model from pool"""
        # Sort by request count, then by last used time
        available = [
            (model, self.model_request_counts[model], self.model_last_used.get(model, 0))
            for model in pool
        ]
        available.sort(key=lambda x: (x[1], x[2]))
        return available[0][0]
    
    def _is_in_cooldown(self, model: str) -> bool:
        """Check if model is in cooldown period"""
        if model not in self.model_last_used:
            return False
        
        time_since_use = time.time() - self.model_last_used[model]
        return time_since_use < self.cooldown_period
    
    def _select_alternative(self, pool: List[str], exclude_model: str) -> str:
        """Select alternative model from pool, excluding specified model"""
        available = [m for m in pool if m != exclude_model and not self._is_in_cooldown(m)]
        
        if not available:
            # All models in cooldown, use the one with earliest cooldown expiry
            logger.warning("All models in cooldown, using least recently used")
            available = [m for m in pool if m != exclude_model]
            if not available:
                return exclude_model  # No choice
            available.sort(key=lambda m: self.model_last_used.get(m, 0))
            return available[0]
        
        if self.strategy == 'random':
            return random.choice(available)
        else:
            return available[0]
    
    def record_success(self, model: str):
        """Record successful API call"""
        self.model_success_rate[model]['success'] += 1
        self.model_success_rate[model]['total'] += 1
        self.model_error_counts[model] = 0  # Reset error count
        self._save_stats()
        logger.debug(f"✓ Success recorded for {model}")
    
    def record_failure(self, model: str, error_type: str):
        """Record failed API call"""
        self.model_success_rate[model]['total'] += 1
        self.model_error_counts[model] += 1
        
        # If model consistently fails, increase cooldown
        if self.model_error_counts[model] >= 3:
            logger.warning(f"Model {model} has {self.model_error_counts[model]} errors, extended cooldown")
            # Force longer cooldown by setting last_used to future
            self.model_last_used[model] = time.time() + self.cooldown_period * 2
            
        self._save_stats()
    
    def get_statistics(self) -> Dict:
        """Get usage statistics"""
        stats = {
            'total_requests': sum(self.model_request_counts.values()),
            'models_used': len(self.model_request_counts),
            'model_usage': dict(self.model_request_counts),
            'success_rates': {}
        }
        
        for model, data in self.model_success_rate.items():
            if data['total'] > 0:
                stats['success_rates'][model] = {
                    'rate': data['success'] / data['total'],
                    'total_requests': data['total']
                }
        
        return stats
    
    def get_next_available_pool(self, pool_name: str) -> List[str]:
        """Get list of available models from a pool (not in cooldown)"""
        pool = self.model_pools.get(pool_name, self.model_pools['general'])
        return [m for m in pool if not self._is_in_cooldown(m)]
    
    def reset_model(self, model: str):
        """Reset tracking for a specific model"""
        self.model_request_counts[model] = 0
        self.model_error_counts[model] = 0
        if model in self.model_last_used:
            del self.model_last_used[model]
        logger.info(f"Reset tracking for model: {model}")
    
    def get_recommended_model(self, content_type: str = "general") -> str:
        """Get recommended model for content type"""
        pool_name = 'general'
        
        if content_type == 'sensitive':
            pool_name = 'uncensored'
        elif content_type in ['complex', 'reasoning']:
            pool_name = 'reasoning'
        
        pool = self.model_pools.get(pool_name, self.model_pools['general'])
        
        # Get model with best success rate
        best_model = None
        best_rate = 0
        
        for model in pool:
            stats = self.model_success_rate[model]
            if stats['total'] == 0:
                return model  # New model, give it a try
            
            rate = stats['success'] / stats['total']
            if rate > best_rate:
                best_rate = rate
                best_model = model
        
        return best_model or pool[0]
