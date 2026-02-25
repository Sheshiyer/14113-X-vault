# Enneagram Core Architecture

## Engine Class Structure

```python
class EnneagramResonator(BaseEngine):
    """
    Enneagram Resonator Engine
    
    Provides comprehensive Enneagram personality analysis including:
    - Type identification (3 methods)
    - Wing influences
    - Integration/disintegration patterns
    - Instinctual variants
    - Growth guidance
    """
```

### Initialization

```python
def __init__(self):
    super().__init__()
    self.enneagram_data: Optional[EnneagramData] = None
    self.divination_calc = DivinationCalculator()
    self._load_enneagram_data()
```

**Components:**
- `enneagram_data`: Complete type system loaded from JSON
- `divination_calc`: For archetypal resonance calculations and randomization
- Automatic data loading on initialization

---

## Data Loading System

### Load Enneagram Data

```python
def _load_enneagram_data(self) -> None:
    """Load Enneagram data from JSON files."""
    try:
        enneagram_json = load_json_data("enneagram", "types.json")
        self.enneagram_data = EnneagramData(**enneagram_json)
        self.logger.info("Loaded Enneagram personality data")
    except Exception as e:
        self.logger.error(f"Failed to load Enneagram data: {e}")
        raise
```

**Process:**
1. Load JSON from `data/enneagram/types.json`
2. Parse into EnneagramData model
3. Validate structure with Pydantic
4. Store in instance variable
5. Log success/failure

**Data Structure:**
```json
{
  "enneagram_info": {...},
  "types": {
    "1": {...complete type data...},
    "2": {...},
    ...
    "9": {...}
  },
  "centers": {
    "body": {...},
    "heart": {...},
    "head": {...}
  },
  "assessment_questions": [...]
}
```

---

## Type Retrieval System

### Get Type by Number

```python
def _get_type_by_number(self, number: int) -> EnneagramType:
    """Get Enneagram type by its number."""
    if number < 1 or number > 9:
        raise ValueError(f"Type number must be between 1 and 9, got {number}")
    
    type_data = self.enneagram_data.types[str(number)]
    
    # Convert nested dictionaries to proper models
    wings = {}
    for wing_num, wing_data in type_data.get("wings", {}).items():
        wings[wing_num] = EnneagramWing(**wing_data)
    
    arrows = {}
    for arrow_type, arrow_data in type_data.get("arrows", {}).items():
        arrows[arrow_type] = EnneagramArrow(**arrow_data)
    
    instinctual_variants = {}
    for variant_name, variant_data in type_data.get("instinctual_variants", {}).items():
        instinctual_variants[variant_name] = InstinctualVariant(**variant_data)
    
    # Create the type with converted models
    type_dict = type_data.copy()
    type_dict["wings"] = wings
    type_dict["arrows"] = arrows
    type_dict["instinctual_variants"] = instinctual_variants
    
    return EnneagramType(**type_dict)
```

**Process:**
1. Validate type number (1-9)
2. Retrieve type data from storage
3. Convert nested dicts to models:
   - Wings → EnneagramWing objects
   - Arrows → EnneagramArrow objects
   - Variants → InstinctualVariant objects
4. Reconstruct complete EnneagramType model
5. Return validated type object

**Key Insight:** Type data stored as nested dictionaries, converted to typed models on retrieval for type safety and validation.

---

## Type Identification Algorithms

### Method 1: Assessment-Based Identification

```python
def _identify_type_from_assessment(self, assessment_responses: Dict[str, str]) -> tuple[int, float]:
    """
    Identify type from assessment responses.
    
    Returns:
        Tuple of (type_number, confidence_score)
    """
    # Simple scoring algorithm - count responses for each type
    type_scores = {i: 0 for i in range(1, 10)}
    
    for question_id, response in assessment_responses.items():
        # Extract type number from response (assuming response format like "1", "2", etc.)
        try:
            type_num = int(response)
            if 1 <= type_num <= 9:
                type_scores[type_num] += 1
        except (ValueError, KeyError):
            continue
    
    # Find the type with highest score
    if not any(type_scores.values()):
        # Default to type 9 if no valid responses
        return 9, 0.1
    
    max_score = max(type_scores.values())
    primary_type = max(type_scores, key=type_scores.get)
    
    # Calculate confidence based on score distribution
    total_responses = sum(type_scores.values())
    confidence = max_score / total_responses if total_responses > 0 else 0.1
    
    return primary_type, confidence
```

**Algorithm:**
1. Initialize score counter for all 9 types
2. Parse each assessment response
3. Extract type number from response
4. Increment score for that type
5. Find type with highest score
6. Calculate confidence as percentage of total responses
7. Return (type_number, confidence)

**Fallback:** Defaults to Type 9 with 0.1 confidence if no valid responses

**Confidence Calculation:**
```
confidence = max_score / total_responses
```

---

### Method 2: Description-Based Identification

```python
def _identify_type_from_description(self, description: str) -> tuple[int, float]:
    """
    Identify type from behavioral description using keyword matching.
    
    Returns:
        Tuple of (type_number, confidence_score)
    """
    description_lower = description.lower()
    type_scores = {}
    
    # Score each type based on keyword matches
    for type_num in range(1, 10):
        enneagram_type = self._get_type_by_number(type_num)
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
    
    if not any(type_scores.values()):
        # Default to type 9 if no matches
        return 9, 0.1
    
    max_score = max(type_scores.values())
    primary_type = max(type_scores, key=type_scores.get)
    
    # Calculate confidence
    total_score = sum(type_scores.values())
    confidence = max_score / total_score if total_score > 0 else 0.1
    confidence = min(confidence, 0.8)  # Cap at 0.8 for description-based identification
    
    return primary_type, confidence
```

**Algorithm:**
1. Convert description to lowercase for matching
2. For each of 9 types:
   - Check if type keywords present (+2 points each)
   - Check if core motivation words present (+3 points)
   - Check if core fear words present (+3 points)
   - Check if core desire words present (+3 points)
3. Sum scores for all types
4. Find type with highest score
5. Calculate confidence as percentage
6. **Cap confidence at 0.8** (description less certain than assessment)
7. Return (type_number, confidence)

**Scoring Weights:**
- Keyword match: +2 points
- Core motivation match: +3 points
- Core fear match: +3 points
- Core desire match: +3 points

**Fallback:** Type 9 with 0.1 confidence if no matches

---

### Method 3: Self-Selection

```python
# In main calculation flow:
elif validated_input.identification_method == "self_select":
    primary_type_num = validated_input.selected_type
    confidence = 0.9  # High confidence for self-selection
```

**Algorithm:**
1. User directly provides their type number
2. No calculation needed
3. Assign high confidence (0.9)
4. Assumes user has prior Enneagram knowledge

**Use Case:** For users already familiar with their type

---

## Wing Determination

```python
def _determine_wing(self, primary_type: int) -> Optional[EnneagramWing]:
    """Determine the dominant wing for a type."""
    enneagram_type = self._get_type_by_number(primary_type)
    
    # For simplicity, randomly choose one of the available wings
    # In a full implementation, this would be based on additional assessment
    if enneagram_type.wings:
        wing_keys = list(enneagram_type.wings.keys())
        chosen_wing_key = self.divination_calc.random.choice(wing_keys)
        return enneagram_type.wings[chosen_wing_key]
    
    return None
```

**Current Implementation:**
- Random selection from available wings
- Each type has 2 wings (adjacent types)

**Full Implementation Would:**
- Use additional assessment questions
- Score which wing is more dominant
- Base on behavioral patterns in description
- Allow wing intensity specification (e.g., strong 1w9 vs. balanced 1w2)

**Wing Options by Type:**
| Type | Wing 1 | Wing 2 |
|------|--------|--------|
| 1 | 1w9 | 1w2 |
| 2 | 2w1 | 2w3 |
| 3 | 3w2 | 3w4 |
| 4 | 4w3 | 4w5 |
| 5 | 5w4 | 5w6 |
| 6 | 6w5 | 6w7 |
| 7 | 7w6 | 7w8 |
| 8 | 8w7 | 8w9 |
| 9 | 9w8 | 9w1 |

---

## Instinctual Variant Determination

```python
def _determine_instinctual_variant(self, primary_type: int) -> Optional[InstinctualVariant]:
    """Determine the primary instinctual variant."""
    enneagram_type = self._get_type_by_number(primary_type)
    
    # For simplicity, randomly choose one of the available variants
    # In a full implementation, this would be based on additional assessment
    if enneagram_type.instinctual_variants:
        variant_keys = list(enneagram_type.instinctual_variants.keys())
        chosen_variant_key = self.divination_calc.random.choice(variant_keys)
        return enneagram_type.instinctual_variants[chosen_variant_key]
    
    return None
```

**Current Implementation:**
- Random selection from 3 variants
- Each type has all 3 variants available

**Three Variants:**
1. **Self-Preservation (SP)** - Security, comfort, physical needs
2. **Social (SO)** - Group belonging, status, contribution
3. **Sexual (SX)** - One-to-one intensity, attraction, energy

**Full Implementation Would:**
- Separate instinct assessment questionnaire
- Score all 3 instincts
- Identify dominant and secondary
- Create instinct stack (e.g., SX/SO/SP)

---

## Center Retrieval

```python
def _get_center_by_name(self, center_name: str) -> EnneagramCenter:
    """Get center by name."""
    center_data = self.enneagram_data.centers[center_name.lower()]
    return EnneagramCenter(**center_data)
```

**Three Centers:**
- **Body**: Types 8, 9, 1
- **Heart**: Types 2, 3, 4
- **Head**: Types 5, 6, 7

**Center Data Includes:**
- Name
- Types in center
- Core emotion
- Primary focus
- Description

---

## Growth Guidance Generation

```python
def _generate_growth_guidance(self, profile: EnneagramProfile, focus_area: Optional[str]) -> List[str]:
    """Generate personalized growth guidance."""
    guidance = []
    primary_type = profile.primary_type
    
    # Core growth recommendations
    guidance.extend(primary_type.growth_recommendations[:3])  # Top 3 recommendations
    
    # Wing-specific guidance
    if profile.wing:
        guidance.append(f"Integrate your {profile.wing.name} wing by embracing {', '.join(profile.wing.traits[:2])}")
    
    # Arrow-specific guidance
    if profile.integration_direction:
        guidance.append(f"Move toward integration by developing {', '.join(profile.integration_direction.traits[:2])}")
    
    # Focus area specific guidance
    if focus_area == "relationships":
        guidance.append(f"In relationships, be aware of your {primary_type.core_fear.lower()} and practice {primary_type.virtue.lower()}")
    elif focus_area == "career":
        guidance.append(f"In your career, leverage your {primary_type.core_motivation.lower()} while avoiding {primary_type.vice.lower()}")
    elif focus_area == "spirituality":
        guidance.append(f"For spiritual growth, contemplate the {primary_type.holy_idea} and embody {primary_type.virtue}")
    
    return guidance
```

**Guidance Sources:**
1. **Core Type Recommendations** - Top 3 from type's growth list
2. **Wing Integration** - Traits from wing to develop
3. **Arrow Direction** - Qualities from integration type
4. **Focus Area Customization**:
   - Relationships: Fear awareness + virtue practice
   - Career: Motivation leverage + vice avoidance
   - Spirituality: Holy idea contemplation + virtue embodiment

---

## Main Calculation Flow

```python
def _calculate(self, validated_input: EnneagramInput) -> Dict[str, Any]:
    """Process the Enneagram analysis calculation."""
    
    # 1. IDENTIFY PRIMARY TYPE
    if validated_input.identification_method == "assessment":
        primary_type_num, confidence = self._identify_type_from_assessment(
            validated_input.assessment_responses
        )
    elif validated_input.identification_method == "self_select":
        primary_type_num = validated_input.selected_type
        confidence = 0.9
    else:  # intuitive
        primary_type_num, confidence = self._identify_type_from_description(
            validated_input.behavioral_description
        )
    
    # 2. GET TYPE DATA
    primary_type = self._get_type_by_number(primary_type_num)
    center = self._get_center_by_name(primary_type.center)
    
    # 3. DETERMINE WING (if requested)
    wing = None
    if validated_input.include_wings:
        wing = self._determine_wing(primary_type_num)
    
    # 4. DETERMINE INSTINCTUAL VARIANT (if requested)
    instinctual_variant = None
    if validated_input.include_instincts:
        instinctual_variant = self._determine_instinctual_variant(primary_type_num)
    
    # 5. GET ARROWS (if requested)
    integration_direction = None
    disintegration_direction = None
    if validated_input.include_arrows:
        integration_direction = primary_type.arrows.get("integration")
        disintegration_direction = primary_type.arrows.get("disintegration")
    
    # 6. CREATE PROFILE
    profile = EnneagramProfile(
        primary_type=primary_type,
        wing=wing,
        instinctual_variant=instinctual_variant,
        integration_direction=integration_direction,
        disintegration_direction=disintegration_direction,
        center=center,
        assessment_confidence=confidence
    )
    
    # 7. GENERATE GROWTH GUIDANCE
    growth_guidance = self._generate_growth_guidance(profile, validated_input.focus_area)
    
    # 8. CREATE KEY INSIGHTS
    key_insights = [
        f"Your core type is {primary_type.number} - {primary_type.name}",
        f"Your core motivation: {primary_type.core_motivation}",
        f"Your core fear: {primary_type.core_fear}",
        f"You operate from the {center.name} center of intelligence"
    ]
    
    if wing:
        key_insights.append(f"Your {wing.name} wing adds {', '.join(wing.traits[:2])} qualities")
    
    if instinctual_variant:
        key_insights.append(f"Your {instinctual_variant.name} instinct focuses on {instinctual_variant.description.lower()}")
    
    # 9. CALCULATE ARCHETYPAL RESONANCE
    type_names = [primary_type.name]
    if wing:
        type_names.append(wing.name)
    
    field_resonance = self.divination_calc.calculate_archetypal_resonance(
        type_names,
        {"type": primary_type_num, "center": primary_type.center}
    )
    
    # 10. RETURN RESULTS
    return {
        "profile": profile,
        "identification_method": validated_input.identification_method,
        "analysis_timestamp": datetime.now(),
        "key_insights": key_insights,
        "growth_guidance": growth_guidance,
        "guidance_summary": f"As a Type {primary_type.number} {primary_type.name}, focus on transforming {primary_type.vice} into {primary_type.virtue}.",
        "center_analysis": f"Operating from the {center.name}, you focus on {center.focus.lower()}",
        "integration_path": f"Growth comes through moving toward Type {integration_direction.direction} qualities" if integration_direction else "Focus on your core type development",
        "field_resonance": field_resonance,
        "field_signature": f"enneagram_type_{primary_type_num}_{primary_type.center.lower()}"
    }
```

**Complete Processing Steps:**
1. Identify primary type using selected method
2. Get full type data from storage
3. Get center information
4. Determine wing if requested
5. Determine instinctual variant if requested
6. Get integration/disintegration arrows if requested
7. Create complete profile
8. Generate growth guidance
9. Create key insights list
10. Calculate archetypal resonance
11. Return comprehensive results dictionary

---

## Output Interpretation

```python
def _interpret(self, calculation_results: Dict[str, Any], input_data: EnneagramInput) -> str:
    """Interpret calculation results into human-readable format."""
    
    profile = calculation_results["profile"]
    primary_type = profile.primary_type
    
    interpretation = f"🎭 Enneagram Resonator Analysis\n\n"
    interpretation += f"🔍 Method: {calculation_results['identification_method'].title()}\n"
    interpretation += f"🕐 Analysis Time: {calculation_results['analysis_timestamp'].strftime('%Y-%m-%d %H:%M')}\n\n"
    
    # Primary type information
    interpretation += f"🌟 Core Type: {primary_type.number} - {primary_type.name}\n"
    interpretation += f"🏛️ Center: {profile.center.name} (Focus: {profile.center.focus})\n"
    interpretation += f"💫 Core Motivation: {primary_type.core_motivation}\n"
    interpretation += f"😰 Core Fear: {primary_type.core_fear}\n"
    interpretation += f"❤️ Core Desire: {primary_type.core_desire}\n\n"
    
    # Traditional elements
    interpretation += f"⚡ Vice: {primary_type.vice} | Virtue: {primary_type.virtue}\n"
    interpretation += f"🔥 Passion: {primary_type.passion} | Holy Idea: {primary_type.holy_idea}\n\n"
    
    # Wing analysis
    if profile.wing:
        interpretation += f"🪶 Wing: {profile.wing.name}\n"
        interpretation += f"   Adds: {', '.join(profile.wing.traits)}\n\n"
    
    # Instinctual variant
    if profile.instinctual_variant:
        interpretation += f"🧬 Instinctual Variant: {profile.instinctual_variant.name}\n"
        interpretation += f"   Focus: {profile.instinctual_variant.description}\n\n"
    
    # Arrows
    if profile.integration_direction:
        interpretation += f"⬆️ Integration (Growth): Move toward Type {profile.integration_direction.direction}\n"
        interpretation += f"   Develop: {', '.join(profile.integration_direction.traits)}\n"
    
    if profile.disintegration_direction:
        interpretation += f"⬇️ Disintegration (Stress): Watch for Type {profile.disintegration_direction.direction} patterns\n"
        interpretation += f"   Avoid: {', '.join(profile.disintegration_direction.traits)}\n\n"
    
    interpretation += f"🎯 Core Guidance: {calculation_results['guidance_summary']}\n\n"
    
    interpretation += "🌱 Growth Steps:\n"
    for i, guidance in enumerate(calculation_results['growth_guidance'][:5], 1):
        interpretation += f"   {i}. {guidance}\n"
    
    return interpretation
```

**Formatted Output Includes:**
- Analysis metadata (method, timestamp)
- Core type identification
- Center and focus
- Motivation, fear, desire
- Vice-virtue pair
- Passion and holy idea
- Wing analysis
- Instinctual variant
- Integration and disintegration arrows
- Core guidance summary
- Top 5 growth steps

---

## Engine Properties

```python
@property
def engine_name(self) -> str:
    return "Enneagram Resonator"

@property
def description(self) -> str:
    return "Provides comprehensive Enneagram personality analysis with type identification, wings, arrows, and growth guidance"

@property
def input_model(self) -> Type[BaseEngineInput]:
    return EnneagramInput

@property
def output_model(self) -> Type[BaseEngineOutput]:
    return EnneagramOutput
```

---

## Summary

The Enneagram Engine provides:
- 3 type identification methods
- Complete 9-type system access
- Wing determination
- Instinctual variant mapping
- Integration/disintegration arrows
- Center-based analysis
- Personalized growth guidance
- Archetypal resonance calculation
- Comprehensive formatted output

**Architecture Pattern:** Data-driven type system with algorithmic identification and rule-based guidance generation.
