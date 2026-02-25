# I-Ching Data Models

**Document Purpose:** Complete extraction of data structures, input/output models, and type definitions from WitnessOS I-Ching engine

---

## Overview

The I-Ching engine uses Pydantic models for type-safe data validation and clear structure definition. All models inherit from base engine interfaces for consistency across WitnessOS.

---

## Core Data Models

### 1. Trigram Model

```python
class Trigram(BaseModel):
    """Represents an I-Ching trigram."""
    
    name: str = Field(..., description="Name of the trigram")
    chinese: str = Field(..., description="Chinese name and character")
    binary: str = Field(..., description="Binary representation (3 bits)")
    element: str = Field(..., description="Associated element")
    attribute: str = Field(..., description="Primary attribute")
    family: str = Field(..., description="Family position")
    direction: str = Field(..., description="Compass direction")
    season: str = Field(..., description="Associated season")
    meaning: str = Field(..., description="Core meaning")
```

**Example Instance:**
```python
heaven = Trigram(
    name="Heaven",
    chinese="乾 (Qián)",
    binary="111",
    element="Metal",
    attribute="Strong",
    family="Father",
    direction="Northwest",
    season="Late Autumn",
    meaning="Creative force, strength, leadership"
)
```

### 2. Hexagram Model

```python
class Hexagram(BaseModel):
    """Represents an I-Ching hexagram."""
    
    number: int = Field(..., ge=1, le=64, description="Hexagram number (1-64)")
    name: str = Field(..., description="English name")
    chinese: str = Field(..., description="Chinese name and character")
    trigrams: List[str] = Field(..., description="Upper and lower trigrams")
    binary: str = Field(..., description="Binary representation (6 bits)")
    keywords: List[str] = Field(default_factory=list, description="Key themes")
    judgment: str = Field(..., description="The Judgment text")
    image: str = Field(..., description="The Image text")
    meaning: str = Field(..., description="Core meaning and interpretation")
    divination: str = Field(..., description="Divinatory meaning")
    changing_lines: Dict[str, str] = Field(
        default_factory=dict, 
        description="Changing line interpretations (positions 1-6)"
    )
```

**Example Instance:**
```python
hexagram_1 = Hexagram(
    number=1,
    name="The Creative",
    chinese="乾 (Qián)",
    trigrams=["Heaven", "Heaven"],
    binary="111111",
    keywords=["creativity", "strength", "leadership", "initiative"],
    judgment="The Creative works sublime success, furthering through perseverance.",
    image="The movement of heaven is full of power. Thus the superior man makes himself strong and untiring.",
    meaning="Pure creative energy, the power of the heavens, leadership and initiative. This hexagram represents the masculine principle, strength, and the ability to create and lead.",
    divination="Great success is possible through persistent effort. Take the lead and act with confidence.",
    changing_lines={
        "1": "Hidden dragon. Do not act.",
        "2": "Dragon appearing in the field. It furthers one to see the great man.",
        "3": "All day long the superior man is creatively active. At nightfall his mind is still beset with cares. Danger. No blame.",
        "4": "Wavering flight over the depths. No blame.",
        "5": "Flying dragon in the heavens. It furthers one to see the great man.",
        "6": "Arrogant dragon will have cause to repent."
    }
)
```

### 3. HexagramLine Model

```python
class HexagramLine(BaseModel):
    """Represents a single line in a hexagram."""
    
    position: int = Field(..., ge=1, le=6, description="Line position (1-6, bottom to top)")
    value: int = Field(..., description="Line value (6, 7, 8, or 9)")
    type: Literal["yin", "yang"] = Field(..., description="Line type")
    changing: bool = Field(..., description="Whether this is a changing line")
    interpretation: Optional[str] = Field(None, description="Line-specific interpretation")
```

**Line Type Determination:**
```python
# Odd values (7, 9) = Yang
# Even values (6, 8) = Yin
line_type = "yang" if value % 2 == 1 else "yin"

# Values 6 and 9 = Changing
changing = value in [6, 9]
```

**Example Instances:**
```python
line1 = HexagramLine(
    position=1,
    value=7,
    type="yang",
    changing=False
)

line3 = HexagramLine(
    position=3,
    value=9,
    type="yang",
    changing=True,  # Old Yang
    interpretation="All day long the superior man is creatively active..."
)
```

### 4. IChingReading Model

```python
class IChingReading(BaseModel):
    """Complete I-Ching reading result."""
    
    primary_hexagram: Hexagram = Field(..., description="The primary hexagram")
    primary_lines: List[HexagramLine] = Field(..., description="Lines of primary hexagram")
    
    mutation_hexagram: Optional[Hexagram] = Field(
        None, 
        description="Mutation hexagram (if changing lines)"
    )
    mutation_lines: Optional[List[HexagramLine]] = Field(
        None, 
        description="Lines of mutation hexagram"
    )
    
    changing_lines: List[int] = Field(
        default_factory=list, 
        description="Positions of changing lines"
    )
    method_used: str = Field(..., description="Divination method used")
```

**Example Instance:**
```python
reading = IChingReading(
    primary_hexagram=hexagram_1,
    primary_lines=[line1, line2, line3, line4, line5, line6],
    mutation_hexagram=hexagram_43,  # If lines 3 changes
    mutation_lines=[...],  # Transformed lines
    changing_lines=[3],  # Position 3 is changing
    method_used="coins"
)
```

---

## Input Model

### IChingInput

```python
class IChingInput(QuestionInput):
    """Input model for I-Ching Mutation Oracle."""
    
    method: Literal["coins", "yarrow", "random"] = Field(
        default="coins",
        description="Divination method to use"
    )
    
    focus_area: Optional[str] = Field(
        None,
        description="Specific life area to focus on"
    )
    
    include_changing_lines: bool = Field(
        default=True,
        description="Whether to include changing line interpretations"
    )
    
    @field_validator('method')
    @classmethod
    def validate_method(cls, v):
        valid_methods = ["coins", "yarrow", "random"]
        if v not in valid_methods:
            raise ValueError(f"Method must be one of: {valid_methods}")
        return v
```

**Inherits from QuestionInput:**
```python
class QuestionInput(BaseEngineInput):
    """Base input for divination engines that accept questions."""
    
    question: Optional[str] = Field(
        None,
        description="The question to ask the oracle"
    )
```

**Example Usage:**
```python
input_data = IChingInput(
    question="What is the nature of my current challenge?",
    method="coins",
    focus_area="career",
    include_changing_lines=True
)
```

---

## Output Model

### IChingOutput

```python
class IChingOutput(BaseEngineOutput):
    """Output model for I-Ching Mutation Oracle."""
    
    # Inherits from BaseEngineOutput:
    # - engine_name: str
    # - calculation_time: float
    # - confidence_score: float
    # - timestamp: datetime
    # - raw_data: Dict[str, Any]
    # - formatted_output: str
    # - recommendations: List[str]
    # - field_signature: str
    # - reality_patches: Optional[List[Dict]]
    # - archetypal_themes: Optional[List[str]]
    
    # All I-Ching-specific data accessible via raw_data
```

**Raw Data Structure in Output:**
```python
raw_data = {
    "reading": IChingReading,  # Complete reading object
    "question_asked": str,
    "reading_timestamp": datetime,
    "method_used": str,
    "overall_interpretation": str,
    "key_insights": List[str],
    "guidance_summary": str,
    "changing_line_count": int,
    "has_mutation": bool,
    "trigram_elements": List[str],
    "field_resonance": float,
    "field_signature": str
}
```

**Example Output:**
```python
output = IChingOutput(
    engine_name="I-Ching Mutation Oracle",
    calculation_time=0.045,
    confidence_score=0.85,
    timestamp=datetime.now(),
    raw_data={
        "reading": reading_object,
        "question_asked": "What is my path?",
        "method_used": "coins",
        "changing_line_count": 2,
        "has_mutation": True,
        # ... more fields
    },
    formatted_output="☯️ I-Ching Reading for: What is my path?\n\n...",
    recommendations=[
        "Embrace creative energy of The Creative",
        "Pay attention to changing lines at positions 2, 5",
        "Prepare for transformation toward Breakthrough"
    ],
    field_signature="iching_hexagram_guidance"
)
```

---

## Data Container Model

### IChingData

```python
class IChingData(BaseModel):
    """Complete I-Ching data definition."""
    
    hexagram_info: Dict[str, Any] = Field(..., description="Hexagram metadata")
    hexagrams: Dict[str, Dict[str, Any]] = Field(..., description="All 64 hexagrams")
    trigrams: Dict[str, Dict[str, Any]] = Field(..., description="8 trigrams")
    methods: Dict[str, Dict[str, Any]] = Field(..., description="Divination methods")
```

**Structure:**
```python
iching_data = IChingData(
    hexagram_info={
        "name": "I-Ching Hexagrams",
        "description": "The 64 hexagrams of the I-Ching with meanings and interpretations",
        "total_hexagrams": 64,
        "source": "Traditional I-Ching wisdom"
    },
    hexagrams={
        "1": {...},  # Hexagram 1 data
        "2": {...},  # Hexagram 2 data
        # ... through "64"
    },
    trigrams={
        "Heaven": {...},
        "Earth": {...},
        # ... 8 total
    },
    methods={
        "coins": {
            "name": "Three Coins Method",
            "description": "Traditional method using three coins",
            "probabilities": {"6": 0.125, "7": 0.375, "8": 0.375, "9": 0.125}
        },
        "yarrow": {
            "name": "Yarrow Stalks Method",
            "description": "Traditional method using 50 yarrow stalks",
            "probabilities": {"6": 0.0625, "7": 0.4375, "8": 0.4375, "9": 0.0625}
        }
    }
)
```

---

## Type Definitions

### Line Values
```python
LineValue = Literal[6, 7, 8, 9]
```

### Line Types
```python
LineType = Literal["yin", "yang"]
```

### Divination Methods
```python
DivinationMethod = Literal["coins", "yarrow", "random"]
```

### Hexagram Numbers
```python
HexagramNumber = int  # 1-64 range validated by Pydantic
```

---

## Data Validation

### Hexagram Number Validation
```python
class Hexagram(BaseModel):
    number: int = Field(..., ge=1, le=64)
    
    @field_validator('number')
    @classmethod
    def validate_number(cls, v):
        if v < 1 or v > 64:
            raise ValueError("Hexagram number must be between 1 and 64")
        return v
```

### Line Position Validation
```python
class HexagramLine(BaseModel):
    position: int = Field(..., ge=1, le=6)
    
    @field_validator('position')
    @classmethod
    def validate_position(cls, v):
        if v < 1 or v > 6:
            raise ValueError("Line position must be between 1 and 6")
        return v
```

### Binary String Validation
```python
class Hexagram(BaseModel):
    binary: str
    
    @field_validator('binary')
    @classmethod
    def validate_binary(cls, v):
        if len(v) != 6:
            raise ValueError("Binary must be 6 characters")
        if not all(c in '01' for c in v):
            raise ValueError("Binary must contain only 0 and 1")
        return v
```

---

## JSON Serialization

### Hexagram to JSON
```python
hexagram_json = hexagram.model_dump()
# or
hexagram_json = hexagram.dict()  # Pydantic v1
```

### JSON to Hexagram
```python
hexagram = Hexagram(**hexagram_json)
```

### Reading to JSON
```python
reading_json = reading.model_dump()

# With mutation hexagram handling
if reading.mutation_hexagram:
    reading_json["mutation_hexagram"] = reading.mutation_hexagram.model_dump()
```

---

## Database Schema Considerations

### Storing Readings

**PostgreSQL/MongoDB:**
```python
{
    "id": "uuid",
    "user_id": "user_uuid",
    "timestamp": "2026-01-26T12:00:00Z",
    "question": "What is my path?",
    "method": "coins",
    "primary_hexagram_number": 1,
    "mutation_hexagram_number": 43,
    "changing_lines": [2, 5],
    "line_values": [7, 9, 8, 7, 6, 8],
    "interpretation": "Full text...",
    "raw_data": {...}  # Full reading JSON
}
```

**Indexes:**
```sql
CREATE INDEX idx_user_readings ON readings(user_id, timestamp DESC);
CREATE INDEX idx_hexagram ON readings(primary_hexagram_number);
CREATE INDEX idx_question_hash ON readings(md5(question));  -- For reproducibility lookup
```

---

## Model Relationships Diagram

```
IChingInput
    ├─ question: str
    ├─ method: DivinationMethod
    └─ focus_area: Optional[str]
            ↓
    [Engine Processing]
            ↓
IChingReading
    ├─ primary_hexagram: Hexagram
    │   ├─ number: int (1-64)
    │   ├─ name: str
    │   ├─ trigrams: List[str]
    │   ├─ keywords: List[str]
    │   └─ changing_lines: Dict[str, str]
    ├─ primary_lines: List[HexagramLine]
    │   ├─ position: int (1-6)
    │   ├─ value: int (6-9)
    │   ├─ type: "yin" | "yang"
    │   └─ changing: bool
    ├─ mutation_hexagram: Optional[Hexagram]
    ├─ mutation_lines: Optional[List[HexagramLine]]
    └─ changing_lines: List[int]
            ↓
IChingOutput
    ├─ engine_name: str
    ├─ formatted_output: str
    ├─ raw_data: Dict
    │   └─ reading: IChingReading
    └─ recommendations: List[str]
```

---

## Model Usage Examples

### Creating a Reading Programmatically

```python
# Step 1: Generate lines
line_values = [7, 9, 8, 7, 6, 8]

# Step 2: Create line objects
primary_lines = [
    HexagramLine(position=i+1, value=val, type="yang" if val%2==1 else "yin", changing=val in [6,9])
    for i, val in enumerate(line_values)
]

# Step 3: Look up hexagrams
primary_hex = get_hexagram_by_number(calculate_hex_number(line_values))
mutation_hex = get_hexagram_by_number(calculate_hex_number([7,8,8,7,7,8]))

# Step 4: Create reading
reading = IChingReading(
    primary_hexagram=primary_hex,
    primary_lines=primary_lines,
    mutation_hexagram=mutation_hex,
    mutation_lines=create_mutation_lines([7,8,8,7,7,8]),
    changing_lines=[2, 5],
    method_used="coins"
)
```

---

## Model Export Formats

### To Dict
```python
data = reading.model_dump()
```

### To JSON String
```python
json_str = reading.model_dump_json(indent=2)
```

### To Python Dataclass
```python
from dataclasses import asdict
reading_dict = asdict(reading)
```

---

## Pydantic Configuration

### Model Config
```python
class Hexagram(BaseModel):
    model_config = {
        "frozen": False,  # Allow mutation
        "validate_assignment": True,  # Validate on attribute change
        "arbitrary_types_allowed": False,
        "use_enum_values": True
    }
```

---

## Error Handling with Models

### Validation Errors
```python
try:
    hexagram = Hexagram(**data)
except ValidationError as e:
    print(f"Validation failed: {e.errors()}")
    # Handle invalid data
```

### Missing Fields
```python
try:
    hexagram = Hexagram(number=1, name="Creative")
except ValidationError as e:
    # Missing required fields: chinese, trigrams, binary, etc.
    print(e.errors())
```

---

## Summary

### Core Models
1. **Trigram** - 8 fundamental trigrams
2. **Hexagram** - 64 hexagram definitions
3. **HexagramLine** - Individual line in reading
4. **IChingReading** - Complete reading result
5. **IChingInput** - User input structure
6. **IChingOutput** - Engine output structure
7. **IChingData** - Complete data container

### Key Features
- ✅ Type-safe with Pydantic
- ✅ Validation on construction
- ✅ JSON serialization built-in
- ✅ Clear field descriptions
- ✅ Optional fields handled gracefully
- ✅ Nested model support
- ✅ Enum/Literal type constraints

---

**Next:** See `QUICK-REFERENCE.md` for lookup tables and formulas
