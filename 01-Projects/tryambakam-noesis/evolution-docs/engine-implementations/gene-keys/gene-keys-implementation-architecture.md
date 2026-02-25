# Gene Keys Implementation Architecture

**System Design and Data Flow Documentation**  
*Extracted from WitnessOS Source Code*

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Data Models](#data-models)
4. [Processing Pipeline](#processing-pipeline)
5. [Sequence Calculation Logic](#sequence-calculation-logic)
6. [Pathworking Engine](#pathworking-engine)
7. [Caching Strategy](#caching-strategy)
8. [Error Handling](#error-handling)
9. [Type Conversions](#type-conversions)
10. [Performance Optimization](#performance-optimization)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  (CloudflareEngineInput → GeneKeysInput validation)         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Engine Layer                                │
│         (GeneKeysCompass - Business Logic)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼─────────────┐
│  Astrology       │    │  Divination          │
│  Calculator      │    │  Calculator          │
│  (Positions)     │    │  (Resonance)         │
└───────┬──────────┘    └────────┬─────────────┘
        │                         │
        └────────────┬────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Sequence Calculation Layer                      │
│  (Activation, Venus, Pearl → Gate assignments)              │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│             Pathworking Guidance Layer                       │
│  (Shadow→Gift→Siddhi frequency shifting guidance)           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Output Layer                                 │
│     (GeneKeysOutput → Formatted Interpretation)             │
└─────────────────────────────────────────────────────────────┘
```

### Design Philosophy

Gene Keys engine focuses on:
- **Sequence-Based Analysis**: Activation, Venus, and Pearl sequences
- **Frequency Shifting**: Shadow → Gift → Siddhi pathworking
- **Astronomical Precision**: Uses same planetary positions as Human Design
- **Archetypal Guidance**: Life purpose and spiritual evolution pathways

---

## Architecture Layers

### 1. Input Validation Layer

**File**: `gene_keys_models.py`

```python
from pydantic import BaseModel, Field, field_validator
from shared.base.data_models import BirthDataInput
from datetime import date, time
from typing import Optional, Literal, Tuple

class GeneKeysInput(BirthDataInput):
    """
    Input model with comprehensive validation.
    
    Inherits from:
    - BirthDataInput: Provides birth_date validation
    """
    
    # Required fields - Birth data needed for astronomical calculations
    birth_time: time = Field(
        ..., 
        description="Exact birth time required for Gene Keys calculations"
    )
    birth_location: Tuple[float, float] = Field(
        ..., 
        description="Birth coordinates (latitude, longitude)"
    )
    timezone: str = Field(
        ..., 
        description="Birth timezone (e.g., 'America/New_York')"
    )
    
    # Optional fields - Customize calculation focus
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
    
    @field_validator('focus_sequence')
    @classmethod
    def validate_focus_sequence(cls, v):
        """Ensure focus_sequence is valid."""
        if v is not None:
            valid_sequences = ["activation", "venus", "pearl", "all"]
            if v not in valid_sequences:
                raise ValueError(f"Focus sequence must be one of: {valid_sequences}")
        return v
```

**Validation Rules**:
- Birth time must be in `HH:MM` format (required)
- Birth location coordinates validated (latitude: -90 to 90, longitude: -180 to 180)
- Timezone must be valid IANA timezone string
- Focus sequence must be one of predefined options

### 2. Engine Core Layer

**File**: `gene_keys.py`

```python
from typing import Dict, List, Any, Type, Optional
from datetime import datetime, date, time

from shared.base.engine_interface import BaseEngine
from shared.base.data_models import BaseEngineInput, BaseEngineOutput
from shared.calculations.astrology import AstrologyCalculator
from shared.calculations.divination import DivinationCalculator

class GeneKeysCompass(BaseEngine):
    """
    Gene Keys Compass Engine
    
    Provides Gene Keys archetypal analysis based on birth data,
    calculating the Activation, Venus, and Pearl sequences.
    """
    
    def __init__(self):
        super().__init__()
        self.gene_keys_data: Optional[GeneKeysData] = None
        self.divination_calc = DivinationCalculator()
        self.astro_calc = AstrologyCalculator()
        self._load_gene_keys_data()
    
    @property
    def engine_name(self) -> str:
        return "Gene Keys Compass"
    
    @property
    def description(self) -> str:
        return "Provides Gene Keys archetypal analysis with sequences"
    
    @property
    def input_model(self) -> Type[BaseEngineInput]:
        return GeneKeysInput
    
    @property
    def output_model(self) -> Type[BaseEngineOutput]:
        return GeneKeysOutput
```

**Core Methods**:
- `_load_gene_keys_data()`: Load archetypal data from JSON
- `_calculate()`: Main calculation orchestration
- `_interpret()`: Format results for human reading

---

## Data Models

### Core Data Structures

#### 1. GeneKey Model

```python
class GeneKey(BaseModel):
    """Represents a single Gene Key with its three frequencies."""
    
    number: int = Field(..., ge=1, le=64, description="Gene Key number (1-64)")
    name: str = Field(..., description="Name of the Gene Key")
    
    # Three Frequencies
    shadow: str = Field(..., description="Shadow frequency (victim consciousness)")
    gift: str = Field(..., description="Gift frequency (genius consciousness)")
    siddhi: str = Field(..., description="Siddhi frequency (divine consciousness)")
    
    # Genetic Correlation
    codon: str = Field(..., description="Genetic codon")
    amino_acid: str = Field(..., description="Associated amino acid")
    
    # Structural Relationships
    programming_partner: int = Field(..., description="Programming partner Gene Key number")
    physiology: str = Field(..., description="Associated body system")
    
    # Detailed Descriptions
    shadow_description: str = Field(..., description="Detailed shadow description")
    gift_description: str = Field(..., description="Detailed gift description")
    siddhi_description: str = Field(..., description="Detailed siddhi description")
    
    # Metadata
    keywords: List[str] = Field(default_factory=list, description="Key themes")
    life_theme: str = Field(..., description="Core life theme")
```

**Example Instance**:
```json
{
  "number": 1,
  "name": "The Creative",
  "shadow": "Entropy",
  "gift": "Freshness",
  "siddhi": "Beauty",
  "codon": "ATG-CCC",
  "amino_acid": "Methionine-Proline",
  "programming_partner": 2,
  "physiology": "Pineal Gland",
  "shadow_description": "The Shadow of Entropy manifests as creative stagnation...",
  "gift_description": "The Gift of Freshness brings spontaneous innovation...",
  "siddhi_description": "The Siddhi of Beauty reveals divine perfection...",
  "keywords": ["creativity", "innovation", "renewal"],
  "life_theme": "Creative Expression"
}
```

#### 2. SequenceGate Model

```python
class SequenceGate(BaseModel):
    """Represents a gate within a Gene Keys sequence."""
    
    name: str = Field(..., description="Name of the gate")
    description: str = Field(..., description="Description of the gate's purpose")
    gene_key: GeneKey = Field(..., description="The Gene Key for this gate")
    calculation_method: str = Field(..., description="How this gate is calculated")
```

**Example Instance**:
```json
{
  "name": "Life's Work",
  "description": "Your core life purpose and creative expression",
  "gene_key": { /* GeneKey object */ },
  "calculation_method": "Sun position at birth"
}
```

#### 3. GeneKeysSequence Model

```python
class GeneKeysSequence(BaseModel):
    """Represents a complete Gene Keys sequence."""
    
    name: str = Field(..., description="Name of the sequence")
    description: str = Field(..., description="Description of the sequence")
    gates: List[SequenceGate] = Field(..., description="Gates in this sequence")
```

**Three Primary Sequences**:

1. **Activation Sequence** (4 gates):
   - Life's Work (Personality Sun)
   - Evolution (Personality Earth)
   - Radiance (Design Sun)
   - Purpose (Design Earth)

2. **Venus Sequence** (2 gates):
   - Attraction (Personality Venus)
   - Magnetism (Design Venus)

3. **Pearl Sequence** (3 gates):
   - Vocation (Personality Jupiter)
   - Culture (Personality Saturn)
   - Brand (Personality Uranus)

#### 4. GeneKeysProfile Model

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

### TypeScript Equivalents

#### TypeScript Type Definitions

```typescript
// gene-keys.types.ts

/**
 * Gene Key with three frequency levels
 */
export interface GeneKey {
  number: number;              // 1-64
  name: string;
  
  // Three Frequencies
  shadow: string;              // Victim consciousness
  gift: string;                // Genius consciousness
  siddhi: string;              // Divine consciousness
  
  // Genetic Correlation
  codon: string;
  amino_acid: string;
  
  // Relationships
  programming_partner: number;
  physiology: string;
  
  // Descriptions
  shadow_description: string;
  gift_description: string;
  siddhi_description: string;
  
  // Metadata
  keywords: string[];
  life_theme: string;
}

/**
 * Gate within a sequence
 */
export interface SequenceGate {
  name: string;
  description: string;
  gene_key: GeneKey;
  calculation_method: string;
}

/**
 * Complete sequence (Activation/Venus/Pearl)
 */
export interface GeneKeysSequence {
  name: string;
  description: string;
  gates: SequenceGate[];
}

/**
 * Full profile for an individual
 */
export interface GeneKeysProfile {
  activation_sequence: GeneKeysSequence;
  venus_sequence: GeneKeysSequence;
  pearl_sequence: GeneKeysSequence;
  
  birth_date: string;          // ISO date
  primary_gene_key: GeneKey;
  programming_partner: GeneKey;
}

/**
 * Input for Gene Keys calculation
 */
export interface GeneKeysInput {
  user_id: string;
  birth_date: string;          // YYYY-MM-DD
  birth_time: string;          // HH:MM
  birth_location: [number, number];  // [lat, lon]
  timezone: string;            // IANA timezone
  
  focus_sequence?: 'activation' | 'venus' | 'pearl' | 'all';
  include_programming_partner?: boolean;
  pathworking_focus?: string;
}

/**
 * Output from Gene Keys calculation
 */
export interface GeneKeysOutput {
  engine_name: string;
  calculation_time: number;
  confidence_score: number;
  timestamp: string;
  
  profile: GeneKeysProfile;
  key_insights: string[];
  pathworking_guidance: string[];
  guidance_summary: string;
  primary_life_theme: string;
  programming_partnership: string;
  
  field_resonance: number;
  field_signature: string;
  
  raw_data: Record<string, any>;
  formatted_output: string;
}
```

#### TypeScript Validation with Zod

```typescript
import { z } from 'zod';

// Input validation schema
export const GeneKeysInputSchema = z.object({
  user_id: z.string().uuid(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birth_time: z.string().regex(/^\d{2}:\d{2}$/),
  birth_location: z.tuple([
    z.number().min(-90).max(90),   // latitude
    z.number().min(-180).max(180)  // longitude
  ]),
  timezone: z.string(),
  
  focus_sequence: z.enum(['activation', 'venus', 'pearl', 'all']).optional(),
  include_programming_partner: z.boolean().default(true),
  pathworking_focus: z.string().optional()
});

// Gene Key validation schema
export const GeneKeySchema = z.object({
  number: z.number().int().min(1).max(64),
  name: z.string(),
  shadow: z.string(),
  gift: z.string(),
  siddhi: z.string(),
  codon: z.string(),
  amino_acid: z.string(),
  programming_partner: z.number().int().min(1).max(64),
  physiology: z.string(),
  shadow_description: z.string(),
  gift_description: z.string(),
  siddhi_description: z.string(),
  keywords: z.array(z.string()),
  life_theme: z.string()
});
```

---

## Processing Pipeline

### Calculation Flow Diagram

```
Input Validation
      ↓
Birth Data Processing
      ↓
Astronomical Calculations
      ↓
┌─────┴────────────────────────────────────────┐
│                                               │
Activation Sequence    Venus Sequence    Pearl Sequence
      ↓                     ↓                   ↓
4 Gates (Sun/Earth)    2 Gates (Venus)    3 Gates (Jupiter/Saturn/Uranus)
      ↓                     ↓                   ↓
└─────┬────────────────────────────────────────┘
      ↓
Profile Assembly
      ↓
Programming Partner Lookup
      ↓
Pathworking Guidance Generation
      ↓
Archetypal Resonance Calculation
      ↓
Output Formatting
```

### Step-by-Step Processing

#### Step 1: Input Validation

```python
def _calculate(self, validated_input: GeneKeysInput) -> Dict[str, Any]:
    """Process the Gene Keys calculation."""
    
    # Extract validated input
    birth_date = validated_input.birth_date
    birth_time = validated_input.birth_time
    birth_location = validated_input.birth_location
    timezone = validated_input.timezone
```

#### Step 2: Astronomical Data Retrieval

```python
def _calculate_gene_keys_from_astronomy(
    self, 
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> Dict[str, int]:
    """
    Calculate Gene Key numbers using proper astronomical calculations.
    
    Gene Keys use the same I-Ching gates as Human Design, 
    based on planetary positions.
    """
    
    # Combine birth date and time
    birth_datetime = datetime.combine(birth_date, birth_time)
    lat, lon = birth_location

    # Calculate Human Design astronomical data (Gene Keys use same positions)
    hd_data = self.astro_calc.calculate_human_design_data(
        birth_datetime, lat, lon, timezone
    )

    # Extract the four primary gates for Activation Sequence
    activation_gates = {
        'lifes_work': hd_data['personality_gates']['sun'],    # Personality Sun
        'evolution': hd_data['personality_gates']['earth'],   # Personality Earth
        'radiance': hd_data['design_gates']['sun'],           # Design Sun
        'purpose': hd_data['design_gates']['earth']           # Design Earth
    }

    # For Venus Sequence, we need Venus positions
    venus_gates = {
        'attraction': hd_data['personality_gates'].get('venus', 1),
        'magnetism': hd_data['design_gates'].get('venus', 1)
    }

    # For Pearl Sequence, we need outer planet positions
    pearl_gates = {
        'vocation': hd_data['personality_gates'].get('jupiter', 1),
        'culture': hd_data['personality_gates'].get('saturn', 1),
        'brand': hd_data['personality_gates'].get('uranus', 1)
    }

    return {
        **activation_gates,
        **venus_gates,
        **pearl_gates
    }
```

**Astronomical Calculation Details**:
- Uses `AstrologyCalculator` for precise planetary positions
- Calculates both Personality (birth time) and Design (88 days before birth)
- Maps planetary positions to I-Ching gates (1-64)
- Same astronomical basis as Human Design system

#### Step 3: Sequence Creation

##### Activation Sequence

```python
def _create_activation_sequence(
    self, 
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> GeneKeysSequence:
    """Create the Activation Sequence using astronomical calculations."""

    # Calculate the four gates using proper astronomy
    gene_keys = self._calculate_gene_keys_from_astronomy(
        birth_date, birth_time, birth_location, timezone
    )

    lifes_work_num = gene_keys['lifes_work']
    evolution_num = gene_keys['evolution']
    radiance_num = gene_keys['radiance']
    purpose_num = gene_keys['purpose']
    
    gates = [
        SequenceGate(
            name="Life's Work",
            description="Your core life purpose and creative expression",
            gene_key=self._get_gene_key_by_number(lifes_work_num),
            calculation_method="Sun position at birth"
        ),
        SequenceGate(
            name="Evolution",
            description="Your path of personal development and growth",
            gene_key=self._get_gene_key_by_number(evolution_num),
            calculation_method="Earth position at birth"
        ),
        SequenceGate(
            name="Radiance",
            description="Your gift to humanity and how you shine",
            gene_key=self._get_gene_key_by_number(radiance_num),
            calculation_method="Sun position 88 days before birth"
        ),
        SequenceGate(
            name="Purpose",
            description="Your deepest calling and spiritual mission",
            gene_key=self._get_gene_key_by_number(purpose_num),
            calculation_method="Earth position 88 days before birth"
        )
    ]
    
    return GeneKeysSequence(
        name="Activation Sequence",
        description="The four primary gates that form your core genetic blueprint",
        gates=gates
    )
```

##### Venus Sequence

```python
def _create_venus_sequence(
    self, 
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> GeneKeysSequence:
    """Create the Venus Sequence using astronomical calculations."""

    gene_keys = self._calculate_gene_keys_from_astronomy(
        birth_date, birth_time, birth_location, timezone
    )

    attraction_num = gene_keys['attraction']
    magnetism_num = gene_keys['magnetism']
    
    gates = [
        SequenceGate(
            name="Attraction",
            description="What draws you to others and others to you",
            gene_key=self._get_gene_key_by_number(attraction_num),
            calculation_method="Venus position at birth"
        ),
        SequenceGate(
            name="Magnetism",
            description="Your natural charisma and appeal",
            gene_key=self._get_gene_key_by_number(magnetism_num),
            calculation_method="Venus position 88 days before birth"
        )
    ]
    
    return GeneKeysSequence(
        name="Venus Sequence",
        description="The pathway of love and relationships",
        gates=gates
    )
```

##### Pearl Sequence

```python
def _create_pearl_sequence(
    self, 
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> GeneKeysSequence:
    """Create the Pearl Sequence using astronomical calculations."""

    gene_keys = self._calculate_gene_keys_from_astronomy(
        birth_date, birth_time, birth_location, timezone
    )

    vocation_num = gene_keys['vocation']
    culture_num = gene_keys['culture']
    brand_num = gene_keys['brand']
    
    gates = [
        SequenceGate(
            name="Vocation",
            description="Your natural career path and work style",
            gene_key=self._get_gene_key_by_number(vocation_num),
            calculation_method="Jupiter position at birth"
        ),
        SequenceGate(
            name="Culture",
            description="Your contribution to collective evolution",
            gene_key=self._get_gene_key_by_number(culture_num),
            calculation_method="Saturn position at birth"
        ),
        SequenceGate(
            name="Brand",
            description="Your unique signature in the world",
            gene_key=self._get_gene_key_by_number(brand_num),
            calculation_method="Uranus position at birth"
        )
    ]
    
    return GeneKeysSequence(
        name="Pearl Sequence",
        description="The pathway of prosperity and material manifestation",
        gates=gates
    )
```

#### Step 4: Profile Assembly

```python
# Get primary Gene Key and programming partner
primary_gene_key = activation_sequence.gates[0].gene_key  # Life's Work
programming_partner = self._get_gene_key_by_number(
    primary_gene_key.programming_partner
)

# Create profile
profile = GeneKeysProfile(
    activation_sequence=activation_sequence,
    venus_sequence=venus_sequence,
    pearl_sequence=pearl_sequence,
    birth_date=birth_date,
    primary_gene_key=primary_gene_key,
    programming_partner=programming_partner
)
```

#### Step 5: Pathworking Guidance Generation

```python
def _generate_pathworking_guidance(
    self, 
    profile: GeneKeysProfile, 
    focus: Optional[str]
) -> List[str]:
    """Generate pathworking guidance based on the profile."""
    
    guidance = []
    primary_key = profile.primary_gene_key
    
    # Core pathworking guidance
    guidance.append(
        f"Begin with contemplation of your Life's Work Gene Key {primary_key.number}: "
        f"{primary_key.name}"
    )
    guidance.append(
        f"Notice when you operate from the Shadow of {primary_key.shadow} "
        f"and practice shifting to the Gift of {primary_key.gift}"
    )
    guidance.append(
        f"Your programming partner is Gene Key {primary_key.programming_partner}, "
        f"study both keys together for balance"
    )
    
    # Sequence-specific guidance
    if focus == "activation" or focus == "all":
        guidance.append(
            "Focus on your Activation Sequence to understand your core life purpose "
            "and creative expression"
        )
    
    if focus == "venus" or focus == "all":
        guidance.append(
            "Explore your Venus Sequence to understand your patterns "
            "in love and relationships"
        )
    
    if focus == "pearl" or focus == "all":
        guidance.append(
            "Work with your Pearl Sequence to align your vocation "
            "with your highest purpose"
        )
    
    # Frequency shifting guidance
    guidance.append(
        "Practice the art of frequency shifting: awareness of Shadow, "
        "embodiment of Gift, surrender to Siddhi"
    )
    guidance.append(
        "Remember that all three frequencies serve the evolution of consciousness"
    )
    
    return guidance
```

#### Step 6: Archetypal Resonance Calculation

```python
# Calculate archetypal resonance using divination calculator
gene_key_names = [gate.gene_key.name for gate in activation_sequence.gates]
field_resonance = self.divination_calc.calculate_archetypal_resonance(
    gene_key_names,
    {"birth_date": str(birth_date)}
)
```

---

## Sequence Calculation Logic

### Planetary Position to Gate Mapping

Gene Keys uses the same astronomical calculations as Human Design:

```python
# Mapping planetary positions to Gene Key numbers

def planet_position_to_gate(planet_longitude: float) -> int:
    """
    Convert planetary longitude (0-360°) to Gene Key number (1-64).
    
    Same logic as Human Design gate calculation:
    - 360° divided into 64 segments
    - Each segment = 5.625°
    """
    
    # Adjust for I-Ching wheel starting point (58° offset)
    adjusted_longitude = (planet_longitude + 58) % 360
    
    # Calculate gate number
    gate = int(adjusted_longitude / 5.625) + 1
    
    # Ensure within 1-64 range
    if gate > 64:
        gate = gate - 64
    
    return gate
```

### Gate Order Mapping

The order of gates on the I-Ching wheel (same for Human Design and Gene Keys):

```python
GATE_ORDER = [
    1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19,
    13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24,
    2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33,
    7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44
]

def get_gate_from_wheel_position(position: int) -> int:
    """Get gate number from position on I-Ching wheel (0-63)."""
    return GATE_ORDER[position % 64]
```

### Design Calculation (88 Days Before Birth)

```python
from datetime import timedelta

def calculate_design_time(birth_datetime: datetime) -> datetime:
    """
    Calculate Design time (approximately 88 days before birth).
    
    This represents the moment of soul incarnation according to 
    both Human Design and Gene Keys.
    """
    return birth_datetime - timedelta(days=88)
```

---

## Pathworking Engine

### Frequency Shifting Framework

Gene Keys operates on three frequency levels:

```python
class FrequencyLevel:
    """Represents a consciousness frequency level."""
    
    SHADOW = "shadow"      # Victim consciousness (reactive)
    GIFT = "gift"          # Genius consciousness (creative)
    SIDDHI = "siddhi"      # Divine consciousness (transcendent)

# Frequency progression pathway
FREQUENCY_PROGRESSION = {
    "shadow_to_gift": {
        "method": "Awareness and acceptance",
        "practice": "Notice shadow patterns without judgment",
        "timeframe": "Months to years of practice"
    },
    "gift_to_siddhi": {
        "method": "Surrender and letting go",
        "practice": "Release attachment to personal will",
        "timeframe": "Years to lifetime of devotion"
    }
}
```

### Pathworking Stages

```python
class PathworkingStage:
    """Defines stages of Gene Keys pathworking."""
    
    # Stage 1: Shadow Work (Awareness)
    RECOGNITION = {
        "name": "Recognition",
        "description": "Becoming aware of shadow patterns",
        "practices": [
            "Daily contemplation",
            "Shadow journaling",
            "Pattern recognition"
        ]
    }
    
    # Stage 2: Gift Embodiment (Integration)
    EMBODIMENT = {
        "name": "Embodiment",
        "description": "Living from the gift frequency",
        "practices": [
            "Creative expression",
            "Service to others",
            "Gift cultivation"
        ]
    }
    
    # Stage 3: Siddhi Realization (Transcendence)
    TRANSMISSION = {
        "name": "Transmission",
        "description": "Radiating the siddhi frequency",
        "practices": [
            "Meditation and stillness",
            "Presence cultivation",
            "Spontaneous service"
        ]
    }
```

### Programming Partner Dynamics

```python
# Programming partners are complementary Gene Keys
# that balance and complete each other

PROGRAMMING_PARTNER_MAP = {
    1: 2,    2: 1,    3: 50,   4: 49,   5: 35,   6: 36,   7: 13,   8: 14,
    9: 16,   10: 15,  11: 12,  13: 7,   14: 8,   15: 10,  16: 9,   17: 18,
    18: 17,  19: 33,  20: 34,  21: 48,  22: 47,  23: 43,  24: 44,  25: 46,
    26: 45,  27: 28,  28: 27,  29: 30,  30: 29,  31: 41,  32: 42,  33: 19,
    34: 20,  35: 5,   36: 6,   37: 40,  38: 39,  39: 38,  40: 37,  41: 31,
    42: 32,  43: 23,  44: 24,  45: 26,  46: 25,  47: 22,  48: 21,  49: 4,
    50: 3,   51: 57,  52: 58,  53: 54,  54: 53,  55: 59,  56: 60,  57: 51,
    58: 52,  59: 55,  60: 56,  61: 62,  62: 61,  63: 64,  64: 63
}

def get_programming_partner(gene_key_number: int) -> int:
    """Get the programming partner for a Gene Key."""
    return PROGRAMMING_PARTNER_MAP.get(gene_key_number, gene_key_number)
```

### Contemplation Practices

```python
def generate_contemplation_prompt(gene_key: GeneKey) -> str:
    """Generate a contemplation prompt for a Gene Key."""
    
    return f"""
    Gene Key {gene_key.number}: {gene_key.name}
    
    SHADOW INQUIRY:
    When do I experience {gene_key.shadow} in my life?
    How does this pattern limit my expression?
    
    GIFT CULTIVATION:
    What would it feel like to embody {gene_key.gift}?
    How can I practice this gift today?
    
    SIDDHI CONTEMPLATION:
    Imagine the frequency of {gene_key.siddhi}.
    How does this ultimate expression manifest through me?
    
    PROGRAMMING PARTNER:
    Study Gene Key {gene_key.programming_partner} to understand 
    the complementary force that balances your primary key.
    """
```

---

## Caching Strategy

### Cache Key Structure

```python
def generate_cache_keys(input_data: GeneKeysInput) -> Dict[str, str]:
    """Generate cache keys for Gene Keys data."""
    
    # Create birth data hash
    birth_hash = hashlib.md5(
        f"{input_data.birth_date}{input_data.birth_time}"
        f"{input_data.birth_location}{input_data.timezone}".encode()
    ).hexdigest()[:12]
    
    return {
        # Full profile cache (all sequences)
        'profile': f"gk:profile:{input_data.user_id}:{birth_hash}",
        
        # Individual sequence caches
        'activation': f"gk:activation:{input_data.user_id}:{birth_hash}",
        'venus': f"gk:venus:{input_data.user_id}:{birth_hash}",
        'pearl': f"gk:pearl:{input_data.user_id}:{birth_hash}",
        
        # Pathworking guidance cache
        'guidance': f"gk:guidance:{input_data.user_id}:{birth_hash}",
        
        # Astronomical data cache (shared with Human Design)
        'astro': f"astro:hd:{birth_hash}"
    }
```

### Cache Storage Strategy

```python
class GeneKeysCacheManager:
    """Manages caching for Gene Keys calculations."""
    
    def __init__(self, kv_store):
        self.kv = kv_store
        self.TTL_PROFILE = 86400 * 365      # 1 year (birth data doesn't change)
        self.TTL_GUIDANCE = 86400 * 30      # 30 days (guidance can evolve)
        self.TTL_ASTRO = 86400 * 365 * 5    # 5 years (astronomical data stable)
    
    async def cache_profile(self, cache_key: str, profile: GeneKeysProfile):
        """Cache complete Gene Keys profile."""
        await self.kv.put(
            cache_key,
            profile.model_dump_json(),
            expiration_ttl=self.TTL_PROFILE
        )
    
    async def get_profile(self, cache_key: str) -> Optional[GeneKeysProfile]:
        """Retrieve cached profile."""
        data = await self.kv.get(cache_key)
        if data:
            return GeneKeysProfile.model_validate_json(data)
        return None
    
    async def cache_sequence(
        self, 
        cache_key: str, 
        sequence: GeneKeysSequence
    ):
        """Cache individual sequence."""
        await self.kv.put(
            cache_key,
            sequence.model_dump_json(),
            expiration_ttl=self.TTL_PROFILE
        )
```

### Cache Invalidation Rules

```python
# Cache should be invalidated when:

INVALIDATION_TRIGGERS = {
    "profile_data": [
        "birth_date_correction",
        "birth_time_rectification",
        "birth_location_update"
    ],
    "archetypal_data": [
        "gene_keys_data_update",
        "new_archetype_version"
    ],
    "guidance_data": [
        "pathworking_focus_change",
        "user_progress_update"
    ]
}
```

---

## Error Handling

### Exception Hierarchy

```python
class GeneKeysError(Exception):
    """Base exception for Gene Keys engine."""
    pass

class InvalidBirthDataError(GeneKeysError):
    """Raised when birth data is invalid or incomplete."""
    pass

class AstronomicalCalculationError(GeneKeysError):
    """Raised when astronomical calculations fail."""
    pass

class DataLoadingError(GeneKeysError):
    """Raised when Gene Keys archetypal data fails to load."""
    pass

class SequenceCalculationError(GeneKeysError):
    """Raised when sequence calculation fails."""
    pass
```

### Error Handling Strategy

```python
def _calculate(self, validated_input: GeneKeysInput) -> Dict[str, Any]:
    """Process Gene Keys calculation with comprehensive error handling."""
    
    try:
        # Step 1: Validate astronomical data availability
        if not self.astro_calc:
            raise AstronomicalCalculationError(
                "Astrology calculator not initialized"
            )
        
        # Step 2: Validate Gene Keys data loaded
        if not self.gene_keys_data:
            raise DataLoadingError(
                "Gene Keys archetypal data not loaded"
            )
        
        # Step 3: Calculate sequences with fallback
        try:
            activation_sequence = self._create_activation_sequence(
                validated_input.birth_date,
                validated_input.birth_time,
                validated_input.birth_location,
                validated_input.timezone
            )
        except Exception as e:
            self.logger.error(f"Activation sequence calculation failed: {e}")
            raise SequenceCalculationError(
                f"Failed to calculate Activation Sequence: {str(e)}"
            )
        
        # Step 4: Return results or graceful degradation
        return calculation_results
        
    except GeneKeysError:
        # Re-raise known errors
        raise
    except Exception as e:
        # Wrap unexpected errors
        self.logger.exception("Unexpected error in Gene Keys calculation")
        raise GeneKeysError(f"Calculation failed: {str(e)}")
```

### Validation Error Messages

```python
VALIDATION_MESSAGES = {
    "birth_time_required": {
        "error": "Birth time is required for Gene Keys calculations",
        "suggestion": "Provide exact birth time in HH:MM format"
    },
    "birth_location_required": {
        "error": "Birth location coordinates required",
        "suggestion": "Provide [latitude, longitude] coordinates"
    },
    "invalid_timezone": {
        "error": "Invalid timezone format",
        "suggestion": "Use IANA timezone (e.g., 'America/New_York')"
    },
    "invalid_focus_sequence": {
        "error": "Invalid focus sequence specified",
        "suggestion": "Choose: 'activation', 'venus', 'pearl', or 'all'"
    }
}
```

---

## Type Conversions

### Python to JSON

```python
def profile_to_json(profile: GeneKeysProfile) -> str:
    """Convert GeneKeysProfile to JSON string."""
    return profile.model_dump_json(indent=2)

def profile_from_json(json_str: str) -> GeneKeysProfile:
    """Parse GeneKeysProfile from JSON string."""
    return GeneKeysProfile.model_validate_json(json_str)
```

### Python to TypeScript

```python
# Export TypeScript interfaces from Python models

def generate_typescript_interfaces():
    """Generate TypeScript interfaces from Pydantic models."""
    
    from pydantic2ts import generate_typescript_defs
    
    generate_typescript_defs(
        "gene_keys_models.py",
        "gene-keys.types.ts",
        json2ts_cmd="json2ts"
    )
```

### Date/Time Handling

```python
from datetime import date, time, datetime

# Python date → ISO string
birth_date = date(1990, 5, 15)
iso_date = birth_date.isoformat()  # "1990-05-15"

# Python time → string
birth_time = time(14, 30)
time_str = birth_time.strftime("%H:%M")  # "14:30"

# ISO string → Python date
birth_date = date.fromisoformat("1990-05-15")

# Time string → Python time
birth_time = datetime.strptime("14:30", "%H:%M").time()
```

---

## Performance Optimization

### Lazy Loading Strategy

```python
class GeneKeysCompass(BaseEngine):
    """Gene Keys engine with optimized data loading."""
    
    def __init__(self):
        super().__init__()
        self._gene_keys_data: Optional[GeneKeysData] = None
        self._astro_calc: Optional[AstrologyCalculator] = None
        self._divination_calc: Optional[DivinationCalculator] = None
    
    @property
    def gene_keys_data(self) -> GeneKeysData:
        """Lazy load Gene Keys data."""
        if self._gene_keys_data is None:
            self._load_gene_keys_data()
        return self._gene_keys_data
    
    @property
    def astro_calc(self) -> AstrologyCalculator:
        """Lazy load astrology calculator."""
        if self._astro_calc is None:
            self._astro_calc = AstrologyCalculator()
        return self._astro_calc
```

### Batch Processing Optimization

```python
def calculate_multiple_profiles(
    inputs: List[GeneKeysInput]
) -> List[GeneKeysOutput]:
    """
    Calculate multiple Gene Keys profiles efficiently.
    
    Optimizations:
    - Reuse astronomical calculator
    - Batch cache lookups
    - Parallel sequence calculations
    """
    
    # Batch cache lookup
    cache_keys = [generate_cache_key(inp) for inp in inputs]
    cached_profiles = await batch_cache_get(cache_keys)
    
    # Calculate only missing profiles
    to_calculate = [
        inp for i, inp in enumerate(inputs)
        if cached_profiles[i] is None
    ]
    
    # Process in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [
            executor.submit(calculate_single_profile, inp)
            for inp in to_calculate
        ]
        new_profiles = [f.result() for f in futures]
    
    # Merge cached and new results
    return merge_results(cached_profiles, new_profiles)
```

### Memory Management

```python
# Limit Gene Keys data in memory
MAX_GENE_KEYS_IN_MEMORY = 64  # All Gene Keys

# Use slots for memory efficiency
class GeneKey(BaseModel):
    """Memory-efficient Gene Key model."""
    
    class Config:
        # Enable slots for reduced memory footprint
        use_enum_values = True
        validate_assignment = True
```

### Query Optimization

```python
def _get_gene_key_by_number(self, number: int) -> GeneKey:
    """
    Get Gene Key by number with optimizations.
    
    - Range validation
    - Fallback handling
    - Cached lookups
    """
    
    # Ensure number is within valid range
    if number < 1 or number > 64:
        number = ((number - 1) % 64) + 1
    
    # Check cache first
    cache_key = f"gk:key:{number}"
    cached = self._key_cache.get(cache_key)
    if cached:
        return cached
    
    # Load from data
    if str(number) not in self.gene_keys_data.gene_keys:
        number = 1  # Use Gene Key 1 as fallback
    
    key_data = self.gene_keys_data.gene_keys[str(number)]
    gene_key = GeneKey(**key_data)
    
    # Cache for future use
    self._key_cache[cache_key] = gene_key
    
    return gene_key
```

---

## Appendix

### Complete Data Flow Example

```python
# Example: Complete calculation flow

# 1. Input
input_data = GeneKeysInput(
    user_id="usr_abc123",
    birth_date=date(1990, 5, 15),
    birth_time=time(14, 30),
    birth_location=(40.7128, -74.0060),  # New York
    timezone="America/New_York",
    focus_sequence="all",
    include_programming_partner=True
)

# 2. Validation (automatic via Pydantic)
# - Birth date format checked
# - Birth time format checked
# - Coordinates validated
# - Timezone validated

# 3. Calculation
engine = GeneKeysCompass()
output = engine.process(input_data)

# 4. Output
{
    "engine_name": "Gene Keys Compass",
    "calculation_time": 0.15,
    "confidence_score": 0.99,
    "profile": {
        "activation_sequence": {
            "gates": [
                {
                    "name": "Life's Work",
                    "gene_key": {
                        "number": 25,
                        "name": "The Gene Key of Universal Love",
                        "shadow": "Constriction",
                        "gift": "Acceptance",
                        "siddhi": "Universal Love"
                    }
                },
                # ... more gates
            ]
        },
        # ... venus_sequence, pearl_sequence
    },
    "key_insights": [
        "Your Life's Work is Gene Key 25: Universal Love",
        "Transform Constriction (Shadow) into Acceptance (Gift)",
        "Programming partner Gene Key 46 provides balance"
    ],
    "pathworking_guidance": [
        "Begin with contemplation of Gene Key 25",
        "Notice patterns of constriction",
        "Practice acceptance in daily life"
    ]
}
```

### Related Documentation

- [Gene Keys API Specification](./gene-keys-api-specification.md)
- [Gene Keys Cross-Engine Mappings](./gene-keys-cross-engine-mappings.md)
- [Gene Keys Calculation Formulas](./gene-keys-calculation-formulas.md)
- [Human Design Implementation Architecture](../human-design/human-design-implementation-architecture.md)

---

*Document Version: 1.0*  
*Last Updated: 2026-01-25*  
*Source: WitnessOS Gene Keys Engine*
