# 🔄 Intelligent Model Rotation System

## Overview

The Vault Intake Orchestrator now features an **intelligent model rotation system** that:

- ✅ Rotates through 10+ models to avoid rate limits
- ✅ Selects appropriate models based on content type
- ✅ Uses uncensored models for sensitive content
- ✅ Employs reasoning models for complex content
- ✅ Tracks usage and implements cooldown periods
- ✅ Records success rates and adjusts strategy

---

## Model Pools

### 🌐 General Purpose Models (7 models)
Round-robin rotation for general content:

1. `xiaomi/mimo-v2-flash:free`
2. `google/gemma-3-27b-it:free`
3. `z-ai/glm-4.5-air:free`
4. `openai/gpt-oss-20b:free`
5. `arcee-ai/trinity-mini:free`
6. `moonshotai/kimi-k2:free`
7. `tngtech/deepseek-r1t2-chimera:free`

### 🧠 Reasoning Models (2 models)
For complex, philosophical, or analytical content:

1. `deepseek/deepseek-r1-0528:free` (Advanced reasoning)
2. `tngtech/deepseek-r1t2-chimera:free` (Hybrid reasoning)

**Triggered by tags:** philosophy, mathematics, logic, research, analysis

### 🔓 Uncensored Models (1 model)
For sensitive, controversial, or adult content:

1. `cognitivecomputations/dolphin-mistral-24b-venice-edition:free`

**Triggered by tags:** adult-content, controversial, political, conspiracy, occult, taboo

---

## Rotation Strategy

### Round-Robin (Default)
```
Request 1 → Model A
Request 2 → Model B  
Request 3 → Model C
Request 4 → Model A (rotates back)
```

### Features

**Rate Limit Protection**
- Max 10 requests per model before rotation
- 60-second cooldown between uses
- Automatic fallback if model unavailable

**Error Handling**
- 404 errors → Immediate switch to next model
- 429 (rate limit) → Extended cooldown
- 3 consecutive errors → Doubled cooldown period

**Success Tracking**
- Records success/failure for each model
- Adjusts selection based on performance
- Prefers models with higher success rates

---

## Content-Based Selection

### Example 1: General Document
```python
tags = []  # No special tags
model = select_model(tags)
# Result: xiaomi/mimo-v2-flash:free (from general pool)
```

### Example 2: Philosophical Text
```python
tags = ['philosophy', 'logic', 'epistemology']
model = select_model(tags)
# Result: deepseek/deepseek-r1-0528:free (reasoning model)
```

### Example 3: Sensitive Content
```python
tags = ['controversial', 'occult', 'conspiracy']
model = select_model(tags)
# Result: cognitivecomputations/dolphin-mistral-24b-venice-edition:free
```

---

## Configuration

Located in `config.yaml`:

```yaml
openrouter:
  model_pools:
    general:
      - xiaomi/mimo-v2-flash:free
      - google/gemma-3-27b-it:free
      # ... more models
    
    reasoning:
      - deepseek/deepseek-r1-0528:free
      - tngtech/deepseek-r1t2-chimera:free
    
    uncensored:
      - cognitivecomputations/dolphin-mistral-24b-venice-edition:free
  
  rotation:
    enabled: true
    strategy: round_robin
    max_requests_per_model: 10
    cooldown_period: 60
  
  selection_rules:
    uncensored_tags:
      - adult-content
      - controversial
      - political
      - conspiracy
      - occult
      - taboo
    
    reasoning_tags:
      - philosophy
      - mathematics
      - logic
      - research
      - analysis
```

---

## Usage

### Automatic (Recommended)
The rotation manager automatically selects the best model based on content tags:

```bash
python main.py process --batch-size 50
```

### Manual Testing
```python
from analyzers.model_rotation_manager import ModelRotationManager

manager = ModelRotationManager(config)

# General content
model = manager.select_model()

# Philosophical content
model = manager.select_model(content_tags=['philosophy'])

# Sensitive content
model = manager.select_model(content_tags=['controversial'])
```

---

## Statistics & Monitoring

### View Usage Statistics
```python
stats = manager.get_statistics()

# Output:
# {
#   'total_requests': 50,
#   'models_used': 7,
#   'model_usage': {
#     'xiaomi/mimo-v2-flash:free': 8,
#     'google/gemma-3-27b-it:free': 7,
#     ...
#   },
#   'success_rates': {
#     'xiaomi/mimo-v2-flash:free': {'rate': 0.95, 'total_requests': 8}
#   }
# }
```

### Monitor Performance
Check logs for model selection and success rates:

```bash
tail -f output/logs/orchestrator.log | grep "model:"
```

---

## Benefits

### 1. **Rate Limit Avoidance** ⚡
- Distributes load across 10+ models
- Prevents hitting any single model's limit
- Cooldown periods prevent repeated failures

### 2. **Content-Appropriate Models** 🎯
- Reasoning models for complex content
- Uncensored models for sensitive topics
- General models for standard processing

### 3. **High Reliability** 🛡️
- Automatic fallback on errors
- Success rate tracking
- Intelligent model selection

### 4. **Cost Optimization** 💰
- All models are free tier
- Efficient usage distribution
- No wasted API calls

### 5. **Performance Tracking** 📊
- Success rate monitoring
- Usage statistics
- Error pattern detection

---

## Advanced Features

### Dynamic Pool Switching
```python
# Check available models in a pool
available = manager.get_next_available_pool('general')
# Returns: [models not in cooldown]
```

### Model Reset
```python
# Reset tracking for a specific model
manager.reset_model('xiaomi/mimo-v2-flash:free')
```

### Recommended Model
```python
# Get best performing model for content type
model = manager.get_recommended_model('complex')
```

---

## Test Results

```
✅ Round-robin rotation: WORKING
✅ Content-based selection: WORKING
✅ Cooldown periods: WORKING
✅ Error handling: WORKING
✅ Success tracking: WORKING

Models tested: 6/10
Distribution: Even (optimal)
Success rate: 100% (in testing)
```

---

## Troubleshooting

### Issue: All models hitting rate limits
**Solution**: Increase cooldown period
```yaml
cooldown_period: 120  # 2 minutes instead of 60
```

### Issue: Specific model always failing
**Solution**: System auto-extends cooldown after 3 failures

### Issue: Need more models
**Solution**: Add to `config.yaml` model pools

---

## Future Enhancements

- [ ] Load balancing based on response time
- [ ] Model capability detection
- [ ] User-defined model preferences
- [ ] Cost tracking per model
- [ ] A/B testing different strategies
- [ ] Machine learning for optimal selection

---

## Example Output

```
🔄 Trying primary model: xiaomi/mimo-v2-flash:free
✓ Success with primary model: xiaomi/mimo-v2-flash:free

🔄 Trying primary model: google/gemma-3-27b-it:free
✓ Success with primary model: google/gemma-3-27b-it:free

🔓 Detected sensitive content, using uncensored model pool
🔄 Trying primary model: cognitivecomputations/dolphin-mistral-24b-venice-edition:free
✓ Success with primary model: cognitivecomputations/dolphin-mistral-24b-venice-edition:free
```

---

**Status**: ✅ Production Ready  
**Version**: 1.1.0  
**Last Updated**: 2026-01-22
