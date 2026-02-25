"""OpenRouter API client for AI analysis."""

import requests
import logging
import time
import json
from typing import Dict, Optional, List


class OpenRouterClient:
    """Client for OpenRouter API with intelligent model rotation."""

    def __init__(self, api_key: str, model: str = None, base_url: str = "https://openrouter.ai/api/v1",
                 rate_limit: int = 10, timeout: int = 60, max_retries: int = 3, retry_delay: int = 2,
                 fallback_models: Optional[List[str]] = None, rotation_manager=None):
        """
        Initialize OpenRouter client.

        Args:
            api_key: OpenRouter API key
            model: Default model ID (optional if using rotation manager)
            base_url: Base URL for API
            rate_limit: Maximum requests per second
            timeout: Request timeout in seconds
            max_retries: Maximum retry attempts
            retry_delay: Delay between retries in seconds
            fallback_models: List of fallback model IDs (legacy support)
            rotation_manager: ModelRotationManager instance for intelligent rotation
        """
        self.api_key = api_key
        self.default_model = model
        self.fallback_models = fallback_models or []
        self.base_url = base_url
        self.rate_limit = rate_limit
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.logger = logging.getLogger("vault_orchestrator.openrouter")
        
        # Model rotation manager
        self.rotation_manager = rotation_manager

        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 1.0 / rate_limit
        
        if rotation_manager:
            self.logger.info("OpenRouter client initialized with intelligent model rotation")
        else:
            self.logger.info(f"OpenRouter client initialized with model: {model}")
            if self.fallback_models:
                self.logger.info(f"Fallback models: {', '.join(self.fallback_models)}")

    def _wait_for_rate_limit(self):
        """Wait if necessary to respect rate limit."""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time

        if time_since_last < self.min_request_interval:
            sleep_time = self.min_request_interval - time_since_last
            time.sleep(sleep_time)

        self.last_request_time = time.time()

    def chat_completion(self, messages: List[Dict], temperature: float = 0.7,
                       max_tokens: Optional[int] = None, content_tags: Optional[List[str]] = None) -> Optional[str]:
        """
        Send chat completion request with intelligent model selection.

        Args:
            messages: List of message dictionaries
            temperature: Sampling temperature
            max_tokens: Maximum tokens in response
            content_tags: Content tags for intelligent model selection

        Returns:
            Response text or None if all models failed
        """
        # Use rotation manager if available
        if self.rotation_manager:
            models_to_try = [self.rotation_manager.select_model(content_tags=content_tags)]
            # Get pool as fallback
            pool_models = self.rotation_manager.get_next_available_pool('general')
            if pool_models:
                models_to_try.extend([m for m in pool_models if m not in models_to_try][:2])
        else:
            # Legacy fallback system
            models_to_try = [self.default_model] + self.fallback_models if self.default_model else self.fallback_models
        
        for model_idx, model in enumerate(models_to_try):
            model_type = "primary" if model_idx == 0 else f"fallback {model_idx}"
            self.logger.info(f"🔄 Trying {model_type} model: {model}")
            
            self._wait_for_rate_limit()

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/vault-intake-orchestrator",
                "X-Title": "Vault Intake Orchestrator"
            }

            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature
            }

            if max_tokens:
                payload["max_tokens"] = max_tokens

            for attempt in range(self.max_retries):
                try:
                    response = requests.post(
                        f"{self.base_url}/chat/completions",
                        headers=headers,
                        json=payload,
                        timeout=self.timeout
                    )

                    response.raise_for_status()
                    data = response.json()

                    if 'choices' in data and len(data['choices']) > 0:
                        result = data['choices'][0]['message']['content']
                        
                        # Record success with rotation manager
                        if self.rotation_manager:
                            self.rotation_manager.record_success(model)
                        
                        self.logger.info(f"✓ Success with {model_type} model: {model}")
                        return result
                    else:
                        self.logger.error(f"Unexpected response format: {data}")
                        if self.rotation_manager:
                            self.rotation_manager.record_failure(model, 'invalid_response')
                        break  # Try next model

                except requests.exceptions.HTTPError as e:
                    error_type = f"http_{e.response.status_code}"
                    self.logger.warning(f"HTTP error with {model} (attempt {attempt + 1}/{self.max_retries}): {e}")
                    
                    if self.rotation_manager:
                        self.rotation_manager.record_failure(model, error_type)
                    
                    if e.response.status_code == 404:
                        self.logger.warning(f"Model {model} not found (404), trying next model...")
                        break  # Don't retry 404s, try next model
                    elif e.response.status_code == 429:
                        self.logger.warning(f"Rate limit hit for {model}, extended cooldown...")
                        break  # Try next model immediately
                    
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay * (attempt + 1))
                    else:
                        self.logger.warning(f"Model {model} failed after {self.max_retries} attempts")
                        break  # Try next model

                except requests.exceptions.RequestException as e:
                    self.logger.warning(f"Request failed with {model} (attempt {attempt + 1}/{self.max_retries}): {str(e)}")
                    
                    if self.rotation_manager:
                        self.rotation_manager.record_failure(model, 'request_error')

                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay * (attempt + 1))
                    else:
                        self.logger.warning(f"Model {model} failed after {self.max_retries} attempts")
                        break  # Try next model

                except Exception as e:
                    self.logger.error(f"Unexpected error with {model}: {str(e)}")
                    if self.rotation_manager:
                        self.rotation_manager.record_failure(model, 'unknown_error')
                    break  # Try next model
        
        self.logger.error(f"All models failed (tried {len(models_to_try)} models)")
        return None

    def analyze_content(self, text: str, prompt: str, response_format: str = "json",
                       content_tags: Optional[List[str]] = None) -> Optional[Dict]:
        """
        Analyze content with a specific prompt and intelligent model selection.

        Args:
            text: Content text to analyze
            prompt: Analysis prompt
            response_format: Expected response format (json or text)
            content_tags: Content tags for model selection (e.g., ['philosophy', 'adult-content'])

        Returns:
            Analysis result dictionary or None
        """
        messages = [
            {
                "role": "system",
                "content": "You are an expert at analyzing and categorizing content. Provide structured, accurate analysis."
            },
            {
                "role": "user",
                "content": f"{prompt}\n\nContent to analyze:\n{text[:3000]}"  # Truncate to avoid token limits
            }
        ]

        response = self.chat_completion(messages, temperature=0.3, content_tags=content_tags)

        if not response:
            return None

        if response_format == "json":
            try:
                # Try to extract JSON from response
                # Sometimes models wrap JSON in markdown code blocks
                if "```json" in response:
                    start = response.find("```json") + 7
                    end = response.find("```", start)
                    json_str = response[start:end].strip()
                elif "```" in response:
                    start = response.find("```") + 3
                    end = response.find("```", start)
                    json_str = response[start:end].strip()
                else:
                    json_str = response.strip()

                return json.loads(json_str)

            except json.JSONDecodeError as e:
                self.logger.error(f"Failed to parse JSON response: {str(e)}\nResponse: {response}")
                return None
        else:
            return {"text": response}
