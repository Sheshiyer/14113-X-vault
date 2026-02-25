# Enneagram Calculation Formulas & Algorithms

## Type Determination Algorithm

### Assessment-Based Type Identification

**Scoring Algorithm:**
```python
def identify_type_from_assessment(assessment_responses: Dict[str, str]) -> tuple[int, float]:
    """
    Identify Enneagram type from assessment responses.
    
    Returns:
        Tuple of (type_number, confidence_score)
    """
    # Initialize scores for all 9 types
    type_scores = {i: 0 for i in range(1, 10)}
    
    # Count responses for each type
    for question_id, response in assessment_responses.items():
        try:
            type_num = int(response)
            if 1 <= type_num <= 9:
                type_scores[type_num] += 1
        except (ValueError, KeyError):
            continue
    
    # Find the type with highest score
    if not any(type_scores.values()):
        return 9, 0.1  # Default to type 9 if no valid responses
    
    max_score = max(type_scores.values())
    primary_type = max(type_scores, key=type_scores.get)
    
    # Calculate confidence based on score distribution
    total_responses = sum(type_scores.values())
    confidence = max_score / total_responses if total_responses > 0 else 0.1
    
    return primary_type, confidence
```

**Confidence Score Formula:**
```
confidence = max_score / total_responses

where:
- max_score = highest number of responses for any single type
- total_responses = sum of all valid type responses
- Range: [0.0, 1.0]
```

### Description-Based Type Identification

**Keyword Matching Algorithm:**
```python
def identify_type_from_description(description: str) -> tuple[int, float]:
    """
    Identify type from behavioral description using keyword matching.
    
    Scoring weights:
    - Keyword match: +2 points
    - Core motivation match: +3 points
    - Core fear match: +3 points
    - Core desire match: +3 points
    """
    description_lower = description.lower()
    type_scores = {}
    
    for type_num in range(1, 10):
        enneagram_type = get_type_by_number(type_num)
        score = 0
        
        # Check keywords
        for keyword in enneagram_type.keywords:
            if keyword.lower() in description_lower:
                score += 2
        
        # Check core motivation, fear, desire
        if any(word in description_lower for word in enneagram_type.core_motivation.lower().split()):
            score += 3
        if any(word in description_lower for word in enneagram_type.core_fear.lower().split()):
            score += 3
        if any(word in description_lower for word in enneagram_type.core_desire.lower().split()):
            score += 3
        
        type_scores[type_num] = score
    
    max_score = max(type_scores.values())
    primary_type = max(type_scores, key=type_scores.get)
    
    # Calculate confidence (capped at 0.8 for description-based)
    total_score = sum(type_scores.values())
    confidence = min(max_score / total_score, 0.8) if total_score > 0 else 0.1
    
    return primary_type, confidence
```

**Confidence Calculation:**
```
confidence = min(max_score / total_score, 0.8)

where:
- max_score = highest score achieved by any type
- total_score = sum of all type scores
- Capped at 0.8 for intuitive methods
```

## Wing Theory Formulas

### Wing Determination

**Adjacent Wing Formula:**
```
For type N (where 1 ≤ N ≤ 9):
- Left wing: (N - 1) mod 9, or 9 if N = 1
- Right wing: (N + 1) mod 9, or 1 if N = 9

Example for Type 5:
- Left wing: Type 4 (5w4)
- Right wing: Type 6 (5w6)
```

**Wing Influence Calculation:**
```python
def determine_wing(primary_type: int, assessment_data: Dict) -> Optional[EnneagramWing]:
    """
    Determine dominant wing for a type.
    
    In full implementation, calculated from:
    1. Secondary type scores from assessment
    2. Behavioral trait analysis
    3. Self-reported wing preference
    """
    # Calculate adjacent types
    left_wing = (primary_type - 2) % 9 + 1
    right_wing = primary_type % 9 + 1
    
    # Compare secondary scores
    left_score = assessment_data.get(left_wing, 0)
    right_score = assessment_data.get(right_wing, 0)
    
    dominant_wing = left_wing if left_score > right_score else right_wing
    wing_strength = max(left_score, right_score) / sum([left_score, right_score])
    
    return EnneagramWing(
        number=dominant_wing,
        strength=wing_strength
    )
```

## Integration/Disintegration Paths

### Arrow Direction Formulas

**Integration (Growth) Arrows:**
```
Type 1 → Type 7
Type 2 → Type 4
Type 3 → Type 6
Type 4 → Type 1
Type 5 → Type 8
Type 6 → Type 9
Type 7 → Type 5
Type 8 → Type 2
Type 9 → Type 3
```

**Mathematical Pattern:**
```python
def get_integration_arrow(type_num: int) -> int:
    """Calculate integration direction using the Law of Seven."""
    integration_map = {
        1: 7, 2: 4, 3: 6, 4: 1, 5: 8,
        6: 9, 7: 5, 8: 2, 9: 3
    }
    return integration_map[type_num]
```

**Disintegration (Stress) Arrows:**
```
Type 1 → Type 4
Type 2 → Type 8
Type 3 → Type 9
Type 4 → Type 2
Type 5 → Type 7
Type 6 → Type 3
Type 7 → Type 1
Type 8 → Type 5
Type 9 → Type 6
```

**Mathematical Pattern:**
```python
def get_disintegration_arrow(type_num: int) -> int:
    """Calculate disintegration direction (reverse of integration)."""
    disintegration_map = {
        1: 4, 2: 8, 3: 9, 4: 2, 5: 7,
        6: 3, 7: 1, 8: 5, 9: 6
    }
    return disintegration_map[type_num]
```

### Arrow Influence Score

**Stress/Growth State Calculation:**
```
Current State = (1 - stress_level) × Integration_Traits + stress_level × Disintegration_Traits

where:
- stress_level ∈ [0, 1]
- 0 = pure integration state
- 1 = pure disintegration state
- 0.5 = balanced state
```

## Instinctual Variants (Subtypes)

### Three Instinctual Drives

**Self-Preservation (SP):**
- Focus: Physical safety, comfort, security
- Energy: Conservation and resource management
- Symbol: 🛡️

**Sexual/One-to-One (SX):**
- Focus: Intense connections, chemistry, passion
- Energy: Intensity and fusion
- Symbol: ⚡

**Social (SO):**
- Focus: Group dynamics, belonging, contribution
- Energy: Awareness of social hierarchy
- Symbol: 👥

### Stacking Order Formula

**Primary-Secondary-Tertiary:**
```
Full Instinctual Stack = [Primary, Secondary, Tertiary]

Example stackings:
- SP/SX: Self-preservation primary, sexual secondary
- SX/SO: Sexual primary, social secondary
- SO/SP: Social primary, self-preservation secondary
```

**Dominant Variant Identification:**
```python
def identify_instinctual_variant(assessment_data: Dict) -> str:
    """
    Identify primary instinctual variant from behavioral patterns.
    
    Scoring categories:
    - SP questions: Focus on safety, comfort, health
    - SX questions: Focus on intensity, connection, chemistry  
    - SO questions: Focus on groups, belonging, contribution
    """
    variant_scores = {
        'sp': sum(score for q, score in assessment_data.items() if 'safety' in q or 'comfort' in q),
        'sx': sum(score for q, score in assessment_data.items() if 'intensity' in q or 'connection' in q),
        'so': sum(score for q, score in assessment_data.items() if 'group' in q or 'belonging' in q)
    }
    
    # Sort by score
    sorted_variants = sorted(variant_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Return stacking notation
    return f"{sorted_variants[0][0]}/{sorted_variants[1][0]}"
```

## Riso-Hudson Levels of Development

### Nine-Level Scale

**Level Distribution Formula:**
```
Levels 1-3: Healthy (Integration)
Levels 4-6: Average (Autopilot)
Levels 7-9: Unhealthy (Disintegration)

Level Score = 9 - (integration_score × 8)

where:
- integration_score ∈ [0, 1]
- 0 = Level 9 (most unhealthy)
- 1 = Level 1 (most healthy)
```

**Level Determination Algorithm:**
```python
def calculate_development_level(type_num: int, behavioral_indicators: Dict) -> int:
    """
    Calculate Riso-Hudson level of development (1-9).
    
    Level indicators:
    - Self-awareness score
    - Integration practices
    - Stress response patterns
    - Growth behaviors
    """
    # Score behavioral indicators
    self_awareness = behavioral_indicators.get('self_awareness', 0.5)
    growth_work = behavioral_indicators.get('growth_work', 0.5)
    stress_management = behavioral_indicators.get('stress_management', 0.5)
    virtue_expression = behavioral_indicators.get('virtue_expression', 0.5)
    
    # Calculate composite health score
    health_score = (
        self_awareness * 0.3 +
        growth_work * 0.3 +
        stress_management * 0.2 +
        virtue_expression * 0.2
    )
    
    # Map to level (1-9, inverted so 1 is healthiest)
    level = max(1, min(9, int(9 - (health_score * 8))))
    
    return level
```

### Health Range Formulas

**Healthy Range (Levels 1-3):**
```
health_index = 1.0 - ((level - 1) / 8)

Level 1: health_index = 1.0 (Liberation)
Level 2: health_index = 0.875 (Psychological Capacity)
Level 3: health_index = 0.75 (Social Value)
```

**Average Range (Levels 4-6):**
```
Level 4: health_index = 0.625 (Imbalance/Social Role)
Level 5: health_index = 0.5 (Interpersonal Control)
Level 6: health_index = 0.375 (Overcompensation)
```

**Unhealthy Range (Levels 7-9):**
```
Level 7: health_index = 0.25 (Violation)
Level 8: health_index = 0.125 (Obsession and Compulsion)
Level 9: health_index = 0.0 (Pathological Destructiveness)
```

## Center of Intelligence

### Triadic Distribution

**Body/Gut Center (Types 8, 9, 1):**
```
Center Focus: Instinct, anger/rage, control
Core Issue: Autonomy and resistance
Processing Mode: Kinesthetic/visceral
```

**Heart/Feeling Center (Types 2, 3, 4):**
```
Center Focus: Emotions, shame, identity
Core Issue: Recognition and value
Processing Mode: Emotional/relational
```

**Head/Thinking Center (Types 5, 6, 7):**
```
Center Focus: Thinking, fear/anxiety, security
Core Issue: Support and guidance
Processing Mode: Cognitive/analytical
```

### Center Identification Formula

```python
def identify_center(type_num: int) -> str:
    """Map type number to center of intelligence."""
    center_map = {
        8: 'body', 9: 'body', 1: 'body',
        2: 'heart', 3: 'heart', 4: 'heart',
        5: 'head', 6: 'head', 7: 'head'
    }
    return center_map[type_num]
```

## Archetypal Resonance Calculation

### Field Resonance Formula

```python
def calculate_archetypal_resonance(type_names: List[str], type_data: Dict) -> float:
    """
    Calculate archetypal field resonance for Enneagram type.
    
    Factors:
    - Type number harmonics
    - Center alignment
    - Wing integration
    - Historical archetype match
    """
    base_resonance = type_data['type'] / 9.0  # Normalize to [0, 1]
    
    # Center multiplier
    center_multipliers = {
        'body': 1.0,
        'heart': 1.1,
        'head': 0.9
    }
    center = type_data.get('center', 'body').lower()
    center_bonus = center_multipliers.get(center, 1.0)
    
    # Wing harmony (if wings present)
    wing_bonus = 1.05 if len(type_names) > 1 else 1.0
    
    # Calculate final resonance
    field_resonance = base_resonance * center_bonus * wing_bonus
    
    # Normalize to [0, 1] range
    field_resonance = min(1.0, field_resonance)
    
    return round(field_resonance, 4)
```

**Resonance Components:**
```
total_resonance = base_type_resonance × center_multiplier × wing_multiplier

where:
- base_type_resonance = type_number / 9
- center_multiplier ∈ {0.9, 1.0, 1.1}
- wing_multiplier ∈ {1.0, 1.05}
```

## Summary of Key Formulas

| Calculation | Formula | Range |
|------------|---------|-------|
| Type Confidence | `max_score / total_responses` | [0.0, 1.0] |
| Description Confidence | `min(max_score / total_score, 0.8)` | [0.0, 0.8] |
| Wing Position | `(N ± 1) mod 9` | [1, 9] |
| Development Level | `9 - (health_score × 8)` | [1, 9] |
| Field Resonance | `(type/9) × center × wing` | [0.0, 1.0] |
| Health Index | `1.0 - ((level - 1) / 8)` | [0.0, 1.0] |
