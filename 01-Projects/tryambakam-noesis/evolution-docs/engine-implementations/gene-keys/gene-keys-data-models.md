# Gene Keys Data Models

**Source:** WitnessOS `gene_keys_models.py`

---

## Overview

Complete data structures for Gene Keys Compass Engine input, output, and internal representations using Pydantic models for type safety and validation.

---

## Input Models

### GeneKeysInput

**Primary input model for Gene Keys calculations**

```python
class GeneKeysInput(BirthDataInput):
    """Input model for Gene Keys Compass."""
    
    # Birth data is required for Gene Keys (same as Human Design)
    birth_time: time = Field(..., description="Exact birth time is required for Gene Keys calculations")
    birth_location: Tuple[float, float] = Field(..., description="Birth coordinates (latitude, longitude)")
    timezone: str = Field(..., description="Birth timezone (e.g., 'America/New_York')")
    
    focus_sequence: Optional[Literal["activation", "venus", "pearl", "all"]] = Field(
        default="activation",
        description="Which sequence to focus on"
    )
    
    include_programming_partner: bool = Field(
        default=True,
        description="Whether to include programming partner analysis"
    )
    
    pathworking_focus: Optional[str] = Field(
        None,
        description="Specific area for pathworking guidance"
    )
```

**Field Details:**

1. **birth_time** (required)
   - Type: `time` object
   - Format: hours, minutes, seconds
   - Example: `time(14, 30, 0)` for 2:30 PM
   - Critical for accurate gate calculations

2. **birth_location** (required)
   - Type: Tuple of two floats
   - Format: `(latitude, longitude)`
   - Example: `(40.7128, -74.0060)` for NYC
   - Used for astronomical calculations

3. **timezone** (required)
   - Type: String
   - Format: IANA timezone name
   - Examples: "America/New_York", "Europe/London", "Asia/Tokyo"
   - Ensures correct local solar time

4. **focus_sequence** (optional)
   - Type: Literal string enum
   - Options: "activation", "venus", "pearl", "all"
   - Default: "activation"
   - Determines which sequences to calculate

5. **include_programming_partner** (optional)
   - Type: Boolean
   - Default: `True`
   - Whether to include programming partner Gene Key
   - Usually kept True for complete reading

6. **pathworking_focus** (optional)
   - Type: Optional string
   - Default: `None`
   - Specific area for contemplation guidance
   - Examples: "relationships", "career", "purpose"

---

### Validators

```python
@field_validator('focus_sequence')
@classmethod
def validate_focus_sequence(cls, v):
    if v is not None:
        valid_sequences = ["activation", "venus", "pearl", "all"]
        if v not in valid_sequences:
            raise ValueError(f"Focus sequence must be one of: {valid_sequences}")
    return v
```

**Validation:**
- Ensures focus_sequence is valid option
- Raises clear error if invalid value provided
- Prevents downstream calculation errors

---

### Cloudflare Integration Methods

```python
def get_engine_kv_keys(self) -> Dict[str, str]:
    """Generate KV keys for genekeys engine data."""
    engine_name = "genekeys"
    return {
        'reading': self.generate_user_key(engine_name, 'reading'),
        'analysis': self.generate_user_key(engine_name, 'analysis'),
        'cache': self.generate_cache_key(engine_name),
        'metadata': f"user:{self.user_id}:{engine_name}:metadata"
    }

def get_d1_table_name(self) -> str:
    """Get D1 table name for this engine."""
    return "engine_genekeys_readings"
```

**Purpose:**
- Integration with WitnessOS Cloudflare infrastructure
- KV storage key generation
- D1 database table routing
- User-specific data management

---

## Core Data Models

### GeneKey

**Represents a single Gene Key with its three frequencies**

```python
class GeneKey(BaseModel):
    """Represents a single Gene Key with its three frequencies."""
    
    number: int = Field(..., ge=1, le=64, description="Gene Key number (1-64)")
    name: str = Field(..., description="Name of the Gene Key")
    shadow: str = Field(..., description="Shadow frequency (victim consciousness)")
    gift: str = Field(..., description="Gift frequency (genius consciousness)")
    siddhi: str = Field(..., description="Siddhi frequency (divine consciousness)")
    codon: str = Field(..., description="Genetic codon")
    amino_acid: str = Field(..., description="Associated amino acid")
    programming_partner: int = Field(..., description="Programming partner Gene Key number")
    physiology: str = Field(..., description="Associated body system")
    
    shadow_description: str = Field(..., description="Detailed shadow description")
    gift_description: str = Field(..., description="Detailed gift description")
    siddhi_description: str = Field(..., description="Detailed siddhi description")
    keywords: List[str] = Field(default_factory=list, description="Key themes")
    life_theme: str = Field(..., description="Core life theme")
```

**Field Details:**

1. **number** (1-64)
   - Constrained: `ge=1, le=64` (greater-or-equal 1, less-or-equal 64)
   - Corresponds to I-Ching hexagram number
   - Maps to Human Design gate number

2. **name**
   - Archetypal name
   - Examples: "The Creative", "The Orientation", "The Innovation"
   - Often from I-Ching tradition

3. **shadow, gift, siddhi**
   - Single-word frequency descriptors
   - Core transformation pathway
   - Example: "Entropy" → "Freshness" → "Beauty"

4. **codon**
   - Three-letter DNA code
   - Examples: "CCG", "GGC", "AAG"
   - Maps 64 codons to 64 Gene Keys

5. **amino_acid**
   - Protein building block
   - Examples: "Proline", "Glycine", "Lysine"
   - Links to genetic biology

6. **programming_partner**
   - Complementary Gene Key number
   - Creates codon pair
   - Dynamic balance relationship

7. **physiology**
   - Body system association
   - Example: "Physiology 1", "Physiology 2"
   - Links archetype to physical form

8. **shadow_description, gift_description, siddhi_description**
   - Detailed explanations of each frequency
   - Used in interpretations
   - Provides context for pathworking

9. **keywords**
   - List of thematic terms
   - Common themes: "transformation", "consciousness", "evolution", "awakening"
   - Used for resonance calculations

10. **life_theme**
    - Core life lesson
    - Synthesizes the transformation pathway
    - Example: "Breaking free from entropy through creative spontaneity"

---

### SequenceGate

**Represents a gate within a Gene Keys sequence**

```python
class SequenceGate(BaseModel):
    """Represents a gate within a Gene Keys sequence."""
    
    name: str = Field(..., description="Name of the gate")
    description: str = Field(..., description="Description of the gate's purpose")
    gene_key: GeneKey = Field(..., description="The Gene Key for this gate")
    calculation_method: str = Field(..., description="How this gate is calculated")
```

**Field Details:**

1. **name**
   - Gate name within sequence
   - Examples: "Life's Work", "Evolution", "Attraction"
   - Sequence-specific naming

2. **description**
   - Purpose of this gate
   - Example: "Your core life purpose and creative expression"
   - Contextualizes the Gene Key

3. **gene_key**
   - Full GeneKey object
   - Contains all frequency data
   - Nested model for complete information

4. **calculation_method**
   - Explains astronomical basis
   - Examples: "Sun position at birth", "Venus position 88 days before birth"
   - Educational and transparency

**Example Structure:**
```python
SequenceGate(
    name="Life's Work",
    description="Your core life purpose and creative expression",
    gene_key=GeneKey(
        number=51,
        name="The Awakening",
        shadow="Agitation",
        gift="Initiative",
        siddhi="Awakening",
        # ... other fields
    ),
    calculation_method="Sun position at birth"
)
```

---

### GeneKeysSequence

**Represents a complete Gene Keys sequence**

```python
class GeneKeysSequence(BaseModel):
    """Represents a complete Gene Keys sequence."""
    
    name: str = Field(..., description="Name of the sequence")
    description: str = Field(..., description="Description of the sequence")
    gates: List[SequenceGate] = Field(..., description="Gates in this sequence")
```

**Field Details:**

1. **name**
   - Sequence identifier
   - Values: "Activation Sequence", "Venus Sequence", "Pearl Sequence"

2. **description**
   - Sequence purpose
   - Examples:
     - "The four primary gates that form your core genetic blueprint"
     - "The pathway of love and relationships"
     - "The pathway of prosperity and material manifestation"

3. **gates**
   - List of SequenceGate objects
   - Length varies by sequence:
     - Activation: 4 gates
     - Venus: 2 gates
     - Pearl: 3 gates

**Example Structure:**
```python
GeneKeysSequence(
    name="Activation Sequence",
    description="The four primary gates that form your core genetic blueprint",
    gates=[
        SequenceGate(...),  # Life's Work
        SequenceGate(...),  # Evolution
        SequenceGate(...),  # Radiance
        SequenceGate(...)   # Purpose
    ]
)
```

---

### GeneKeysProfile

**Complete Gene Keys profile for an individual**

```python
class GeneKeysProfile(BaseModel):
    """Complete Gene Keys profile for an individual."""
    
    activation_sequence: GeneKeysSequence = Field(..., description="Activation Sequence")
    venus_sequence: GeneKeysSequence = Field(..., description="Venus Sequence")
    pearl_sequence: GeneKeysSequence = Field(..., description="Pearl Sequence")
    
    birth_date: date = Field(..., description="Birth date used for calculation")
    primary_gene_key: GeneKey = Field(..., description="Primary Life's Work Gene Key")
    programming_partner: GeneKey = Field(..., description="Programming partner Gene Key")
```

**Field Details:**

1. **activation_sequence**
   - Core purpose and creative expression
   - Always calculated (mandatory)
   - Contains 4 gates

2. **venus_sequence**
   - Love and relationship patterns
   - Optional based on focus
   - Contains 2 gates

3. **pearl_sequence**
   - Prosperity and vocation
   - Optional based on focus
   - Contains 3 gates

4. **birth_date**
   - Date used for calculations
   - Used for reference and caching
   - Type: Python `date` object

5. **primary_gene_key**
   - Life's Work Gene Key (first gate of Activation)
   - Primary focus for pathworking
   - Full GeneKey object

6. **programming_partner**
   - Complementary balance key
   - Retrieved based on primary_gene_key.programming_partner
   - Full GeneKey object for study

**Complete Profile Example:**
```python
GeneKeysProfile(
    activation_sequence=GeneKeysSequence(...),  # 4 gates
    venus_sequence=GeneKeysSequence(...),       # 2 gates
    pearl_sequence=GeneKeysSequence(...),       # 3 gates
    birth_date=date(1985, 4, 15),
    primary_gene_key=GeneKey(number=51, ...),
    programming_partner=GeneKey(number=19, ...)
)
```

---

## Output Models

### GeneKeysOutput

**Output model for Gene Keys Compass**

```python
class GeneKeysOutput(CloudflareEngineOutput):
    """Output model for Gene Keys Compass."""
    
    # The base class provides: 
    #   engine_name, calculation_time, confidence_score, 
    #   timestamp, raw_data, formatted_output, recommendations, 
    #   field_signature, reality_patches, archetypal_themes
    
    # Additional Gene Keys-specific fields can be accessed via raw_data
    # This keeps the model simple and compatible with the base engine interface
```

**Inherited Fields from CloudflareEngineOutput:**

1. **engine_name**: "Gene Keys Compass"
2. **calculation_time**: Duration of calculation
3. **confidence_score**: Reading reliability
4. **timestamp**: When calculated
5. **raw_data**: Dict containing all calculation results
6. **formatted_output**: Human-readable interpretation
7. **recommendations**: Pathworking guidance list
8. **field_signature**: "gene_keys_archetypal_compass"
9. **reality_patches**: Optional consciousness shifts
10. **archetypal_themes**: Key themes extracted

**raw_data Contents:**
```python
{
    "profile": GeneKeysProfile,              # Complete profile object
    "birth_date": date,                      # Birth data
    "calculation_timestamp": datetime,        # When calculated
    "focus_sequence": str,                   # Which sequence focused
    "key_insights": List[str],               # Summary insights
    "pathworking_guidance": List[str],       # Practice guidance
    "guidance_summary": str,                 # One-line summary
    "primary_life_theme": str,               # Core theme
    "programming_partnership": str,          # Partnership description
    "field_resonance": float,                # Archetypal strength
    "field_signature": str                   # Engine identifier
}
```

**formatted_output Structure:**
```
🧬 Gene Keys Compass Reading

👤 Birth Date: {date}
🎯 Focus: {sequence} Sequence
🕐 Reading Time: {timestamp}

🌟 Life's Work: Gene Key {number} - {name}
🌑 Shadow: {shadow}
🎁 Gift: {gift}
✨ Siddhi: {siddhi}
🧬 Codon: {codon} ({amino_acid})
🎭 Life Theme: {life_theme}

🤝 Programming Partner: Gene Key {number} - {name}
   Shadow: {shadow} | Gift: {gift} | Siddhi: {siddhi}

🔥 Activation Sequence:
   Life's Work: Gene Key {number} - {name}
   Evolution: Gene Key {number} - {name}
   Radiance: Gene Key {number} - {name}
   Purpose: Gene Key {number} - {name}

🎯 Core Guidance: {guidance_summary}

🛤️ Pathworking Steps:
   1. {guidance_1}
   2. {guidance_2}
   ...
```

---

## Data Loading Models

### GeneKeysData

**Complete Gene Keys data definition for JSON loading**

```python
class GeneKeysData(BaseModel):
    """Complete Gene Keys data definition."""
    
    gene_keys_info: Dict[str, Any] = Field(..., description="Gene Keys metadata")
    gene_keys: Dict[str, Dict[str, Any]] = Field(..., description="All 64 Gene Keys")
    sequences: Dict[str, Dict[str, Any]] = Field(..., description="Sequence definitions")
    frequencies: Dict[str, Dict[str, Any]] = Field(..., description="Frequency descriptions")
    pathworking: Dict[str, Dict[str, Any]] = Field(..., description="Pathworking methods")
```

**Field Details:**

1. **gene_keys_info**
   - Metadata about system
   - Contains: name, description, total_keys, source, sequences list
   - Used for system identification

2. **gene_keys**
   - Dictionary of all 64 Gene Keys
   - Key: String number ("1" to "64")
   - Value: Dict with GeneKey fields
   - Loaded into GeneKey objects

3. **sequences**
   - Definitions of three sequences
   - Keys: "activation", "venus", "pearl"
   - Contains gate names, descriptions, calculations

4. **frequencies**
   - Descriptions of three frequencies
   - Keys: "shadow", "gift", "siddhi"
   - Contains characteristics and purposes

5. **pathworking**
   - Contemplation methods
   - Keys: method names (e.g., "contemplation", "programming_partners", "frequency_shifting")
   - Contains practices and techniques

**JSON Structure Example:**
```json
{
  "gene_keys_info": {
    "name": "Gene Keys Archetypal System",
    "description": "The 64 Gene Keys with Shadow, Gift, and Siddhi frequencies",
    "total_keys": 64,
    "source": "Gene Keys synthesis by Richard Rudd",
    "sequences": ["Activation", "Venus", "Pearl"]
  },
  "gene_keys": {
    "1": { /* GeneKey 1 data */ },
    "2": { /* GeneKey 2 data */ },
    // ... through 64
  },
  "sequences": {
    "activation": { /* Sequence definition */ },
    "venus": { /* Sequence definition */ },
    "pearl": { /* Sequence definition */ }
  },
  "frequencies": {
    "shadow": { /* Frequency description */ },
    "gift": { /* Frequency description */ },
    "siddhi": { /* Frequency description */ }
  },
  "pathworking": {
    "contemplation": { /* Method description */ },
    "programming_partners": { /* Method description */ },
    "frequency_shifting": { /* Method description */ }
  }
}
```

---

## Data Flow

### Input to Output Flow

```
1. User provides GeneKeysInput
   ├── birth_date, birth_time, birth_location, timezone
   ├── focus_sequence
   └── pathworking_focus
   
2. Engine calculates astronomical positions
   └── Returns Dict[str, int] of gate numbers
   
3. Engine loads GeneKey objects for each gate
   └── From GeneKeysData (loaded from JSON)
   
4. Engine constructs GeneKeysProfile
   ├── activation_sequence: GeneKeysSequence
   ├── venus_sequence: GeneKeysSequence
   ├── pearl_sequence: GeneKeysSequence
   ├── primary_gene_key: GeneKey
   └── programming_partner: GeneKey
   
5. Engine generates insights and guidance
   ├── key_insights: List[str]
   ├── pathworking_guidance: List[str]
   └── guidance_summary: str
   
6. Engine formats interpretation
   └── formatted_output: str (human-readable)
   
7. Engine returns GeneKeysOutput
   ├── raw_data: Dict (complete calculation results)
   ├── formatted_output: str (interpretation)
   └── recommendations: List[str] (guidance)
```

---

## Type Safety and Validation

### Pydantic Features Used

1. **Field Constraints**
   ```python
   number: int = Field(..., ge=1, le=64)
   ```
   - Ensures Gene Key number always 1-64
   - Validation at model instantiation

2. **Required vs Optional**
   ```python
   birth_time: time = Field(...)  # Required
   pathworking_focus: Optional[str] = Field(None)  # Optional
   ```
   - Clear distinction in type hints
   - Prevents missing required data

3. **Type Hints**
   ```python
   gates: List[SequenceGate]
   primary_gene_key: GeneKey
   ```
   - IDE autocomplete support
   - Type checking with mypy
   - Self-documenting code

4. **Field Descriptions**
   ```python
   Field(..., description="Your core life purpose and creative expression")
   ```
   - Auto-generated API documentation
   - Clear parameter purposes
   - User-facing descriptions

5. **Custom Validators**
   ```python
   @field_validator('focus_sequence')
   @classmethod
   def validate_focus_sequence(cls, v):
       # Custom validation logic
   ```
   - Domain-specific validation
   - Clear error messages
   - Prevents invalid states

---

## Summary

Gene Keys data models provide:

1. **Type-safe input/output** through Pydantic models
2. **Nested structures** (Profile → Sequences → Gates → Gene Keys)
3. **Clear validation** at all levels
4. **Flexible focus** through sequence selection
5. **Complete data capture** in output
6. **JSON compatibility** for data loading
7. **Cloudflare integration** for WitnessOS infrastructure

**Result:** Robust, type-safe data flow from user input through astronomical calculations to formatted interpretations.
