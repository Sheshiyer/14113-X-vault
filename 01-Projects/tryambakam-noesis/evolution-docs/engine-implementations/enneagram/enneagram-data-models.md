# Enneagram Data Models

## Model Hierarchy

```
EnneagramInput (request)
    ├─ identification_method
    ├─ assessment_responses / selected_type / behavioral_description
    └─ preferences (wings, arrows, instincts, focus_area)

EnneagramOutput (response)
    ├─ profile (EnneagramProfile)
    ├─ analysis_timestamp
    ├─ key_insights
    ├─ growth_guidance
    └─ metadata

EnneagramProfile
    ├─ primary_type (EnneagramType)
    ├─ wing (EnneagramWing)
    ├─ instinctual_variant (InstinctualVariant)
    ├─ integration_direction (EnneagramArrow)
    ├─ disintegration_direction (EnneagramArrow)
    └─ center (EnneagramCenter)

EnneagramType
    ├─ core attributes (number, name, center)
    ├─ dynamics (motivation, fear, desire)
    ├─ traditional elements (vice, virtue, passion, fixation)
    ├─ wings (Dict[str, EnneagramWing])
    ├─ arrows (Dict[str, EnneagramArrow])
    ├─ instinctual_variants (Dict[str, InstinctualVariant])
    ├─ levels_of_development
    └─ growth_recommendations
```

---

## Input Models

### EnneagramInput

```python
class EnneagramInput(CloudflareEngineInput):
    """Input model for Enneagram Resonator."""
    
    # Type identification method
    identification_method: Literal["assessment", "self_select", "intuitive"] = Field(
        default="assessment",
        description="Method for type identification"
    )
    
    # For assessment method
    assessment_responses: Optional[Dict[str, str]] = Field(
        None,
        description="Responses to assessment questions"
    )
    
    # For self-selection method
    selected_type: Optional[int] = Field(
        None,
        ge=1,
        le=9,
        description="Self-selected type number"
    )
    
    # For intuitive method
    behavioral_description: Optional[str] = Field(
        None,
        description="Description of behavioral patterns"
    )
    
    # Analysis preferences
    include_wings: bool = Field(
        default=True,
        description="Include wing analysis"
    )
    
    include_instincts: bool = Field(
        default=True,
        description="Include instinctual variant analysis"
    )
    
    include_arrows: bool = Field(
        default=True,
        description="Include integration/disintegration analysis"
    )
    
    focus_area: Optional[Literal["growth", "relationships", "career", "spirituality"]] = Field(
        None,
        description="Specific area to focus analysis on"
    )
```

**Validation Rules:**
- `identification_method == "assessment"` → requires `assessment_responses`
- `identification_method == "self_select"` → requires `selected_type` (1-9)
- `identification_method == "intuitive"` → requires `behavioral_description`

---

## Core Type Models

### EnneagramType

```python
class EnneagramType(BaseModel):
    """Represents a complete Enneagram type."""
    
    # Basic identification
    number: int = Field(..., ge=1, le=9, description="Type number (1-9)")
    name: str = Field(..., description="Primary type name")
    alternative_names: List[str] = Field(default_factory=list, description="Alternative names")
    center: Literal["Body", "Heart", "Head"] = Field(..., description="Center of intelligence")
    
    # Core dynamics - The psychological structure
    core_motivation: str = Field(..., description="Core motivation")
    core_fear: str = Field(..., description="Core fear")
    core_desire: str = Field(..., description="Core desire")
    basic_proposition: str = Field(..., description="Basic proposition")
    
    # Traditional Enneagram elements - The spiritual structure
    vice: str = Field(..., description="Vice/passion")
    virtue: str = Field(..., description="Virtue")
    passion: str = Field(..., description="Emotional passion")
    fixation: str = Field(..., description="Mental fixation")
    holy_idea: str = Field(..., description="Holy idea")
    trap: str = Field(..., description="Trap")
    
    # Wings and arrows - Movement and influence
    wings: Dict[str, EnneagramWing] = Field(default_factory=dict, description="Wing influences")
    arrows: Dict[str, EnneagramArrow] = Field(default_factory=dict, description="Integration/disintegration arrows")
    
    # Instinctual variants - Subtype expressions
    instinctual_variants: Dict[str, InstinctualVariant] = Field(
        default_factory=dict, 
        description="Instinctual variants"
    )
    
    # Development and growth - Health spectrum
    levels_of_development: Dict[str, Dict[str, str]] = Field(
        default_factory=dict,
        description="Levels of development"
    )
    growth_recommendations: List[str] = Field(
        default_factory=list,
        description="Growth recommendations"
    )
    
    # Keywords for identification
    keywords: List[str] = Field(default_factory=list, description="Key descriptive words")
```

**Key Fields:**
- **number:** 1-9 type identifier
- **core_motivation/fear/desire:** Psychological driving forces
- **vice/virtue:** Spiritual transformation axis
- **center:** Body/Heart/Head classification
- **wings:** Dict with keys "9", "2", etc. → EnneagramWing
- **arrows:** Dict with keys "integration", "disintegration" → EnneagramArrow
- **instinctual_variants:** Dict with keys "self_preservation", "social", "sexual" → InstinctualVariant

---

### EnneagramWing

```python
class EnneagramWing(BaseModel):
    """Represents an Enneagram wing influence."""
    
    name: str = Field(..., description="Wing name (e.g., '1w9 - The Idealist')")
    description: str = Field(..., description="Wing description")
    traits: List[str] = Field(default_factory=list, description="Wing traits")
```

**Example:**
```json
{
  "name": "1w9 - The Idealist",
  "description": "More withdrawn, objective, and principled...",
  "traits": ["methodical", "reserved", "principled", "systematic"]
}
```

---

### EnneagramArrow

```python
class EnneagramArrow(BaseModel):
    """Represents integration or disintegration arrow."""
    
    direction: int = Field(..., ge=1, le=9, description="Target type number")
    name: str = Field(..., description="Arrow name")
    description: str = Field(..., description="Arrow description")
    traits: List[str] = Field(default_factory=list, description="Traits when moving in this direction")
```

**Example:**
```json
{
  "direction": 7,
  "name": "Integration to Seven",
  "description": "When healthy, Ones become more spontaneous...",
  "traits": ["spontaneous", "joyful", "optimistic", "accepting"]
}
```

**Arrow Dictionary Structure:**
```python
arrows = {
    "integration": EnneagramArrow(...),
    "disintegration": EnneagramArrow(...)
}
```

---

### InstinctualVariant

```python
class InstinctualVariant(BaseModel):
    """Represents an instinctual variant."""
    
    name: str = Field(..., description="Variant name")
    description: str = Field(..., description="Variant description")
    traits: List[str] = Field(default_factory=list, description="Variant traits")
```

**Example:**
```json
{
  "name": "SP One - Anxiety",
  "description": "Focuses on personal security and getting things right...",
  "traits": ["anxious", "worried", "controlling", "perfectionistic about details"]
}
```

**Variant Dictionary Structure:**
```python
instinctual_variants = {
    "self_preservation": InstinctualVariant(...),
    "social": InstinctualVariant(...),
    "sexual": InstinctualVariant(...)
}
```

---

### EnneagramCenter

```python
class EnneagramCenter(BaseModel):
    """Represents one of the three centers of intelligence."""
    
    name: str = Field(..., description="Center name")
    types: List[int] = Field(..., description="Types in this center")
    core_emotion: str = Field(..., description="Core emotion of this center")
    focus: str = Field(..., description="Primary focus")
    description: str = Field(..., description="Center description")
```

**Example:**
```json
{
  "name": "Body",
  "types": [8, 9, 1],
  "core_emotion": "Anger",
  "focus": "Control, boundaries, and action",
  "description": "Instinctive intelligence..."
}
```

---

### EnneagramProfile

```python
class EnneagramProfile(BaseModel):
    """Complete Enneagram profile for an individual."""
    
    primary_type: EnneagramType = Field(..., description="Primary type")
    wing: Optional[EnneagramWing] = Field(None, description="Dominant wing")
    instinctual_variant: Optional[InstinctualVariant] = Field(None, description="Primary instinctual variant")
    
    # Current state analysis
    integration_direction: Optional[EnneagramArrow] = Field(None, description="Integration arrow")
    disintegration_direction: Optional[EnneagramArrow] = Field(None, description="Disintegration arrow")
    current_level: Optional[int] = Field(None, ge=1, le=9, description="Current level of development")
    
    # Center analysis
    center: EnneagramCenter = Field(..., description="Center of intelligence")
    
    # Assessment results
    assessment_confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Confidence in type identification")
    secondary_types: List[int] = Field(default_factory=list, description="Other possible types")
```

**Purpose:** Combines all elements into complete individual profile.

---

## Output Models

### EnneagramOutput

```python
class EnneagramOutput(CloudflareEngineOutput):
    """Output model for Enneagram Resonator."""
    
    # Inherited from CloudflareEngineOutput:
    # - engine_name: str
    # - calculation_time: float
    # - confidence_score: float
    # - timestamp: datetime
    # - raw_data: Dict[str, Any]
    # - formatted_output: str
    # - recommendations: List[str]
    # - field_signature: str
    # - reality_patches: List[str]
    # - archetypal_themes: List[str]
```

**Raw Data Contents:**
```python
{
    "profile": EnneagramProfile,
    "identification_method": str,
    "analysis_timestamp": datetime,
    "key_insights": List[str],
    "growth_guidance": List[str],
    "guidance_summary": str,
    "center_analysis": str,
    "integration_path": str,
    "field_resonance": float,
    "field_signature": str
}
```

---

## Data Loading Model

### EnneagramData

```python
class EnneagramData(BaseModel):
    """Complete Enneagram data definition."""
    
    enneagram_info: Dict[str, Any] = Field(..., description="Enneagram metadata")
    types: Dict[str, Dict[str, Any]] = Field(..., description="All 9 types")
    centers: Dict[str, Dict[str, Any]] = Field(..., description="Three centers")
    assessment_questions: List[Dict[str, Any]] = Field(..., description="Assessment questions")
```

**JSON Structure:**
```json
{
  "enneagram_info": {
    "name": "Enneagram Personality System",
    "description": "...",
    "total_types": 9,
    "source": "...",
    "centers": ["Body", "Heart", "Head"]
  },
  "types": {
    "1": { ...complete type 1 data... },
    "2": { ...complete type 2 data... },
    ...
    "9": { ...complete type 9 data... }
  },
  "centers": {
    "body": { ...body center data... },
    "heart": { ...heart center data... },
    "head": { ...head center data... }
  },
  "assessment_questions": [
    { ...question data... }
  ]
}
```

---

## Complete Type Data Structure

### JSON Format for One Type

```json
{
  "number": 1,
  "name": "The Perfectionist",
  "alternative_names": ["The Reformer", "The Idealist"],
  "center": "Body",
  
  "core_motivation": "To be good, right, perfect...",
  "core_fear": "Being corrupt, evil, or defective",
  "core_desire": "To be good, to have integrity...",
  "basic_proposition": "You are good or okay if you do what is right",
  
  "vice": "Anger",
  "virtue": "Serenity",
  "passion": "Resentment",
  "fixation": "Perfectionism",
  "holy_idea": "Holy Perfection",
  "trap": "Perfection",
  
  "wings": {
    "9": {
      "name": "1w9 - The Idealist",
      "description": "More withdrawn, objective...",
      "traits": ["methodical", "reserved", "principled"]
    },
    "2": {
      "name": "1w2 - The Advocate",
      "description": "More interpersonal, helpful...",
      "traits": ["helpful", "critical", "interpersonal"]
    }
  },
  
  "arrows": {
    "integration": {
      "direction": 7,
      "name": "Integration to Seven",
      "description": "When healthy, Ones become...",
      "healthy_traits": ["spontaneous", "joyful", "optimistic"]
    },
    "disintegration": {
      "direction": 4,
      "name": "Disintegration to Four",
      "description": "When stressed, Ones become...",
      "stress_traits": ["moody", "irrational", "self-pitying"]
    }
  },
  
  "levels_of_development": {
    "healthy": {
      "1": "The Wise Realist - Discerning, noble...",
      "2": "The Reasonable Person - Rational, principled...",
      "3": "The Principled Teacher - Orderly, well-organized..."
    },
    "average": {
      "4": "The Idealistic Reformer - Dissatisfied...",
      "5": "The Orderly Person - Highly controlled...",
      "6": "The Judgmental Perfectionist - Critical..."
    },
    "unhealthy": {
      "7": "The Intolerant Misanthrope - Highly critical...",
      "8": "The Obsessive Hypocrite - Obsessive...",
      "9": "The Punitive Avenger - Severe depression..."
    }
  },
  
  "instinctual_variants": {
    "self_preservation": {
      "name": "SP One - Anxiety",
      "description": "Focuses on personal security...",
      "traits": ["anxious", "worried", "controlling"]
    },
    "social": {
      "name": "SO One - Inadaptability",
      "description": "Focuses on being perfect member...",
      "traits": ["rigid", "critical of others", "reforming"]
    },
    "sexual": {
      "name": "SX One - Jealousy",
      "description": "Focuses on perfecting relationships...",
      "traits": ["jealous", "possessive", "intense"]
    }
  },
  
  "growth_recommendations": [
    "Practice accepting 'good enough' rather than perfect",
    "Learn to express anger directly...",
    "Develop spontaneity and playfulness",
    "Practice self-compassion and forgiveness",
    "Embrace the beauty of imperfection"
  ],
  
  "keywords": ["perfectionist", "principled", "reformer", "critical"]
}
```

---

## Model Conversion Process

### Loading JSON to Models

```python
# 1. Load raw JSON
enneagram_json = load_json_data("enneagram", "types.json")

# 2. Create EnneagramData model
enneagram_data = EnneagramData(**enneagram_json)

# 3. Get specific type (converts nested dicts to models)
def _get_type_by_number(self, number: int) -> EnneagramType:
    type_data = self.enneagram_data.types[str(number)]
    
    # Convert wings
    wings = {}
    for wing_num, wing_data in type_data.get("wings", {}).items():
        wings[wing_num] = EnneagramWing(**wing_data)
    
    # Convert arrows
    arrows = {}
    for arrow_type, arrow_data in type_data.get("arrows", {}).items():
        arrows[arrow_type] = EnneagramArrow(**arrow_data)
    
    # Convert instinctual variants
    instinctual_variants = {}
    for variant_name, variant_data in type_data.get("instinctual_variants", {}).items():
        instinctual_variants[variant_name] = InstinctualVariant(**variant_data)
    
    # Create complete type
    type_dict = type_data.copy()
    type_dict["wings"] = wings
    type_dict["arrows"] = arrows
    type_dict["instinctual_variants"] = instinctual_variants
    
    return EnneagramType(**type_dict)
```

---

## Model Validation

### Pydantic Validators

```python
class EnneagramInput(CloudflareEngineInput):
    @field_validator('identification_method')
    @classmethod
    def validate_identification_method(cls, v):
        valid_methods = ["assessment", "self_select", "intuitive"]
        if v not in valid_methods:
            raise ValueError(f"Must be one of: {valid_methods}")
        return v
    
    @field_validator('assessment_responses')
    @classmethod
    def validate_assessment_responses(cls, v, info):
        if info.data.get('identification_method') == 'assessment' and not v:
            raise ValueError("Assessment responses required")
        return v
    
    @field_validator('selected_type')
    @classmethod
    def validate_selected_type(cls, v, info):
        if info.data.get('identification_method') == 'self_select' and not v:
            raise ValueError("Selected type required")
        return v
```

---

## KV Storage Keys

```python
def get_engine_kv_keys(self) -> Dict[str, str]:
    """Generate KV keys for enneagram engine data."""
    engine_name = "enneagram"
    return {
        'reading': self.generate_user_key(engine_name, 'reading'),
        'analysis': self.generate_user_key(engine_name, 'analysis'),
        'cache': self.generate_cache_key(engine_name),
        'metadata': f"user:{self.user_id}:{engine_name}:metadata"
    }

def get_d1_table_name(self) -> str:
    """Get D1 table name for this engine."""
    return "engine_enneagram_readings"
```

---

## Export Structure

```python
__all__ = [
    "EnneagramWing",
    "EnneagramArrow",
    "InstinctualVariant",
    "EnneagramType",
    "EnneagramCenter",
    "EnneagramProfile",
    "EnneagramInput",
    "EnneagramOutput",
    "EnneagramData"
]
```

---

## Summary

**Data Flow:**
1. JSON file → EnneagramData model
2. Type retrieval → EnneagramType (with nested models)
3. User input → EnneagramInput (validated)
4. Processing → EnneagramProfile (complete analysis)
5. Output → EnneagramOutput (formatted response)

**Key Models:**
- **EnneagramType:** Complete type definition
- **EnneagramWing:** Adjacent type influence
- **EnneagramArrow:** Integration/disintegration direction
- **InstinctualVariant:** Subtype expression
- **EnneagramCenter:** Body/Heart/Head classification
- **EnneagramProfile:** Complete individual analysis
- **EnneagramInput/Output:** Request/response structures

**All models use Pydantic for validation, type safety, and JSON serialization.**
