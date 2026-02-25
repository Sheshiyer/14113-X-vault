# Enneagram Engine Implementation Architecture

## System Overview

The Enneagram Resonator Engine provides comprehensive personality analysis using the Enneagram system, including type identification, wing analysis, integration/disintegration patterns, and growth guidance.

## Core Architecture

### Class Hierarchy

```
BaseEngine (abstract)
    └── EnneagramResonator
            ├── DivinationCalculator
            ├── EnneagramData
            └── EnneagramProfile
```

### Primary Components

**1. EnneagramResonator (Main Engine)**
```python
class EnneagramResonator(BaseEngine):
    """
    Main engine class for Enneagram personality analysis.
    
    Properties:
    - engine_name: "Enneagram Resonator"
    - input_model: EnneagramInput
    - output_model: EnneagramOutput
    
    Core Methods:
    - _calculate(): Process analysis
    - _interpret(): Generate interpretation
    - _load_enneagram_data(): Load type definitions
    """
```

**2. Data Models Module (enneagram_models.py)**
- EnneagramType
- EnneagramWing
- EnneagramArrow
- InstinctualVariant
- EnneagramCenter
- EnneagramProfile
- EnneagramInput
- EnneagramOutput
- EnneagramData

## Data Model Specifications

### EnneagramType

Complete representation of one of the 9 personality types.

**Fields:**
```python
class EnneagramType(BaseModel):
    number: int (1-9)
    name: str
    alternative_names: List[str]
    center: Literal["Body", "Heart", "Head"]
    
    # Core dynamics
    core_motivation: str
    core_fear: str
    core_desire: str
    basic_proposition: str
    
    # Traditional Enneagram elements
    vice: str
    virtue: str
    passion: str
    fixation: str
    holy_idea: str
    trap: str
    
    # Related structures
    wings: Dict[str, EnneagramWing]
    arrows: Dict[str, EnneagramArrow]
    instinctual_variants: Dict[str, InstinctualVariant]
    
    # Development
    levels_of_development: Dict[str, Dict[str, str]]
    growth_recommendations: List[str]
    keywords: List[str]
```

**Example Type Structure:**
```json
{
  "number": 5,
  "name": "The Investigator",
  "alternative_names": ["The Observer", "The Thinker"],
  "center": "Head",
  "core_motivation": "To understand the environment",
  "core_fear": "Being useless, incompetent, or incapable",
  "core_desire": "To be capable and competent",
  "vice": "Avarice",
  "virtue": "Detachment",
  "passion": "Greed",
  "holy_idea": "Holy Omniscience",
  "wings": {
    "4": {...},
    "6": {...}
  }
}
```

### EnneagramWing

Represents adjacent type influence.

**Fields:**
```python
class EnneagramWing(BaseModel):
    name: str  # e.g., "1w9 - The Idealist"
    description: str
    traits: List[str]
```

**Example:**
```json
{
  "name": "5w4 - The Iconoclast",
  "description": "Combines Five's analytical depth with Four's creativity",
  "traits": ["Creative", "Introspective", "Sensitive", "Original"]
}
```

### EnneagramArrow

Represents integration or disintegration direction.

**Fields:**
```python
class EnneagramArrow(BaseModel):
    direction: int (1-9)  # Target type number
    name: str
    description: str
    traits: List[str]
```

**Example:**
```json
{
  "direction": 8,
  "name": "Integration to Eight",
  "description": "When healthy, Fives access Eight's assertiveness",
  "traits": ["Confident", "Decisive", "Action-oriented", "Assertive"]
}
```

### InstinctualVariant

One of three survival instincts (SP/SX/SO).

**Fields:**
```python
class InstinctualVariant(BaseModel):
    name: str  # "Self-Preservation", "Sexual", "Social"
    description: str
    traits: List[str]
```

**Variants:**
1. **Self-Preservation (SP)**: Safety, comfort, resources
2. **Sexual/One-to-One (SX)**: Intensity, connection, chemistry
3. **Social (SO)**: Group dynamics, belonging, contribution

### EnneagramCenter

One of three centers of intelligence.

**Fields:**
```python
class EnneagramCenter(BaseModel):
    name: str  # "Body", "Heart", "Head"
    types: List[int]  # Types in this center
    core_emotion: str
    focus: str
    description: str
```

**Three Centers:**
```json
{
  "body": {
    "types": [8, 9, 1],
    "core_emotion": "Anger/Rage",
    "focus": "Instinct and autonomy"
  },
  "heart": {
    "types": [2, 3, 4],
    "core_emotion": "Shame",
    "focus": "Identity and image"
  },
  "head": {
    "types": [5, 6, 7],
    "core_emotion": "Fear/Anxiety",
    "focus": "Security and guidance"
  }
}
```

### EnneagramProfile

Complete analysis result for an individual.

**Fields:**
```python
class EnneagramProfile(BaseModel):
    primary_type: EnneagramType
    wing: Optional[EnneagramWing]
    instinctual_variant: Optional[InstinctualVariant]
    integration_direction: Optional[EnneagramArrow]
    disintegration_direction: Optional[EnneagramArrow]
    current_level: Optional[int] (1-9)
    center: EnneagramCenter
    assessment_confidence: float (0.0-1.0)
    secondary_types: List[int]
```

## Input/Output Models

### EnneagramInput

**Identification Methods:**
1. **assessment**: Structured questionnaire
2. **self_select**: User selects their type
3. **intuitive**: Description-based keyword matching

**Fields:**
```python
class EnneagramInput(CloudflareEngineInput):
    # Identification
    identification_method: Literal["assessment", "self_select", "intuitive"]
    assessment_responses: Optional[Dict[str, str]]
    selected_type: Optional[int]
    behavioral_description: Optional[str]
    
    # Analysis options
    include_wings: bool = True
    include_instincts: bool = True
    include_arrows: bool = True
    focus_area: Optional[Literal["growth", "relationships", "career", "spirituality"]]
```

**Validation Rules:**
- `assessment` method requires `assessment_responses`
- `self_select` method requires `selected_type` (1-9)
- `intuitive` method requires `behavioral_description`

### EnneagramOutput

**Fields:**
```python
class EnneagramOutput(CloudflareEngineOutput):
    # Inherits from base:
    engine_name: str
    calculation_time: float
    confidence_score: float
    timestamp: datetime
    raw_data: Dict[str, Any]
    formatted_output: str
    recommendations: List[str]
    field_signature: str
    reality_patches: List[str]
    archetypal_themes: List[str]
```

**raw_data Structure:**
```json
{
  "profile": EnneagramProfile,
  "identification_method": "assessment",
  "analysis_timestamp": "2024-01-15T10:30:00",
  "key_insights": [...],
  "growth_guidance": [...],
  "guidance_summary": "...",
  "center_analysis": "...",
  "integration_path": "...",
  "field_resonance": 0.7234,
  "field_signature": "enneagram_type_5_head"
}
```

## Processing Pipeline

### Main Calculation Flow

```
1. INPUT VALIDATION
   ├── Validate identification method
   ├── Check required fields
   └── Validate type numbers and options

2. TYPE IDENTIFICATION
   ├── Assessment Method
   │   ├── Score responses by type
   │   ├── Find highest score
   │   └── Calculate confidence
   │
   ├── Self-Select Method
   │   └── Use provided type (confidence: 0.9)
   │
   └── Intuitive Method
       ├── Keyword matching
       ├── Score core dynamics
       └── Calculate confidence (max: 0.8)

3. PROFILE BUILDING
   ├── Load primary type data
   ├── Get center information
   ├── Determine wing (if requested)
   ├── Identify instinctual variant (if requested)
   └── Get integration/disintegration arrows (if requested)

4. ANALYSIS GENERATION
   ├── Create EnneagramProfile object
   ├── Generate key insights
   ├── Generate growth guidance
   ├── Calculate field resonance
   └── Create field signature

5. INTERPRETATION
   ├── Format profile information
   ├── Include center analysis
   ├── Add wing and arrow information
   ├── Provide growth recommendations
   └── Generate human-readable output

6. OUTPUT PACKAGING
   ├── Create EnneagramOutput
   ├── Add recommendations
   ├── Include reality patches
   └── Return structured result
```

## Questionnaire Scoring Engine

### Question Design

**Sample Question Structure:**
```python
{
  "id": "q1",
  "text": "I am most motivated by:",
  "responses": [
    {"id": "1", "text": "Doing things correctly", "scores": {"1": 3}},
    {"id": "2", "text": "Helping others", "scores": {"2": 3}},
    {"id": "3", "text": "Achieving success", "scores": {"3": 3}},
    # ... etc for all 9 types
  ]
}
```

### Scoring Algorithm

**Response Collection:**
```python
assessment_responses = {
    "q1": "1",  # Selected response ID
    "q2": "5",
    "q3": "1",
    # ... etc
}
```

**Type Score Calculation:**
```python
def calculate_type_scores(responses: Dict[str, str], 
                         questions: List[Dict]) -> Dict[int, int]:
    """
    Calculate scores for each type from assessment responses.
    """
    type_scores = {i: 0 for i in range(1, 10)}
    
    for question_id, response_id in responses.items():
        # Find the question
        question = next(q for q in questions if q['id'] == question_id)
        
        # Find the selected response
        response = next(r for r in question['responses'] if r['id'] == response_id)
        
        # Add scores for each type
        for type_num, score in response.get('scores', {}).items():
            type_scores[int(type_num)] += score
    
    return type_scores
```

**Confidence Calculation:**
```python
def calculate_confidence(type_scores: Dict[int, int]) -> float:
    """
    Calculate confidence based on score distribution.
    Higher = more clear distinction
    Lower = ambiguous results
    """
    sorted_scores = sorted(type_scores.values(), reverse=True)
    
    if len(sorted_scores) < 2 or sorted_scores[0] == 0:
        return 0.1
    
    # Confidence based on margin between first and second place
    margin = (sorted_scores[0] - sorted_scores[1]) / sorted_scores[0]
    base_confidence = 0.5 + (margin * 0.5)
    
    # Bonus for clear winner
    if sorted_scores[0] > 2 * sorted_scores[1]:
        base_confidence = min(1.0, base_confidence + 0.1)
    
    return round(base_confidence, 2)
```

## Riso-Hudson Levels Integration

### Level Structure

**Nine Levels per Type:**
```
HEALTHY:
  Level 1: Liberation (Best Self)
  Level 2: Psychological Capacity
  Level 3: Social Value

AVERAGE:
  Level 4: Imbalance/Social Role
  Level 5: Interpersonal Control
  Level 6: Overcompensation

UNHEALTHY:
  Level 7: Violation
  Level 8: Obsession and Compulsion
  Level 9: Pathological Destructiveness
```

### Level Determination

**Behavioral Indicators:**
```python
def assess_development_level(type_num: int, 
                            behavioral_data: Dict) -> int:
    """
    Assess current level of development.
    
    Indicators:
    - Self-awareness practices
    - Growth work engagement
    - Stress response patterns
    - Vice vs. virtue expression
    - Integration arrow access
    """
    indicators = {
        'self_awareness': behavioral_data.get('awareness_score', 0.5),
        'growth_work': behavioral_data.get('growth_engagement', 0.5),
        'stress_management': behavioral_data.get('stress_handling', 0.5),
        'virtue_expression': behavioral_data.get('virtue_frequency', 0.5)
    }
    
    # Weighted composite
    health_score = sum(
        indicators[key] * weight 
        for key, weight in [
            ('self_awareness', 0.3),
            ('growth_work', 0.3),
            ('stress_management', 0.2),
            ('virtue_expression', 0.2)
        ]
    )
    
    # Map to level (1-9, inverted)
    level = max(1, min(9, int(9 - (health_score * 8))))
    
    return level
```

## Growth Guidance Generation

### Guidance Algorithm

```python
def generate_growth_guidance(profile: EnneagramProfile, 
                            focus_area: Optional[str]) -> List[str]:
    """
    Generate personalized growth recommendations.
    
    Sources:
    1. Type-specific growth recommendations
    2. Wing integration guidance
    3. Integration arrow development
    4. Focus area specific advice
    """
    guidance = []
    primary_type = profile.primary_type
    
    # Core growth recommendations (top 3)
    guidance.extend(primary_type.growth_recommendations[:3])
    
    # Wing-specific guidance
    if profile.wing:
        guidance.append(
            f"Integrate your {profile.wing.name} wing by embracing "
            f"{', '.join(profile.wing.traits[:2])}"
        )
    
    # Integration arrow guidance
    if profile.integration_direction:
        guidance.append(
            f"Move toward integration by developing "
            f"{', '.join(profile.integration_direction.traits[:2])}"
        )
    
    # Focus area specific
    if focus_area == "relationships":
        guidance.append(
            f"In relationships, be aware of your {primary_type.core_fear.lower()} "
            f"and practice {primary_type.virtue.lower()}"
        )
    elif focus_area == "career":
        guidance.append(
            f"In your career, leverage your {primary_type.core_motivation.lower()} "
            f"while avoiding {primary_type.vice.lower()}"
        )
    elif focus_area == "spirituality":
        guidance.append(
            f"For spiritual growth, contemplate the {primary_type.holy_idea} "
            f"and embody {primary_type.virtue}"
        )
    
    return guidance
```

## Data Storage Structure

### JSON Data Format

**types.json Structure:**
```json
{
  "enneagram_info": {
    "version": "1.0",
    "tradition": "Riso-Hudson",
    "levels_system": true
  },
  "types": {
    "1": { /* Type One data */ },
    "2": { /* Type Two data */ },
    ...
    "9": { /* Type Nine data */ }
  },
  "centers": {
    "body": { /* Body center data */ },
    "heart": { /* Heart center data */ },
    "head": { /* Head center data */ }
  },
  "assessment_questions": [
    { /* Question 1 */ },
    { /* Question 2 */ },
    ...
  ]
}
```

## Integration with WitnessOS Ecosystem

### Cloudflare KV Storage

**Key Generation:**
```python
def get_engine_kv_keys(user_id: str, engine_name: str = "enneagram") -> Dict[str, str]:
    return {
        'reading': f"user:{user_id}:{engine_name}:reading",
        'analysis': f"user:{user_id}:{engine_name}:analysis",
        'cache': f"cache:{engine_name}:{hash(user_id)}",
        'metadata': f"user:{user_id}:{engine_name}:metadata"
    }
```

### D1 Database Table

**Table: engine_enneagram_readings**
```sql
CREATE TABLE engine_enneagram_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type_number INTEGER NOT NULL,
    wing TEXT,
    instinctual_variant TEXT,
    confidence_score REAL,
    identification_method TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Considerations

**Optimization Strategies:**
1. **Cache type data** after initial load
2. **Lazy-load** wing/arrow/variant details
3. **Batch scoring** for assessment questions
4. **Pre-compute** arrow mappings
5. **Index** user readings by type and date

**Memory Footprint:**
- Type data: ~50KB (all 9 types)
- Assessment questions: ~20KB
- Single analysis: ~5KB output

## Error Handling

**Common Edge Cases:**
1. Empty assessment responses → Default to Type 9, confidence 0.1
2. Invalid type number → Raise ValueError
3. Missing type data → Log error and raise exception
4. Ambiguous results → Return secondary types list
5. Network issues → Fallback to cached data

## Testing Strategy

**Unit Tests:**
- Type identification algorithms
- Wing determination
- Arrow calculations
- Confidence scoring

**Integration Tests:**
- Full analysis pipeline
- Data loading
- Output generation

**Test Data:**
- Sample assessment responses for each type
- Edge cases (ties, empty responses)
- Invalid inputs
