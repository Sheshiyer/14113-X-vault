# I-Ching Implementation Architecture

## Data Model Overview

The I-Ching engine uses a hierarchical data structure to represent the complete oracle system.

## Core Data Structures

### Trigram Model

Represents one of the eight fundamental trigrams (Ba Gua).

```python
class Trigram(BaseModel):
    """Represents an I-Ching trigram."""
    
    name: str                    # English name (e.g., "Heaven", "Earth")
    chinese: str                 # Chinese name and character (e.g., "乾 (Qián)")
    binary: str                  # Binary representation (3 bits, e.g., "111")
    element: str                 # Associated element (Fire, Earth, Metal, Water, Wood)
    attribute: str               # Primary attribute (e.g., "Strong", "Devoted")
    family: str                  # Family position (Father, Mother, Sons, Daughters)
    direction: str               # Compass direction (N, S, E, W, NE, SE, SW, NW)
    season: str                  # Associated season or time period
    meaning: str                 # Core meaning and interpretation
```

#### Eight Trigrams (Ba Gua)

| Name | Chinese | Binary | Symbol | Element | Attribute | Family | Direction |
|------|---------|--------|--------|---------|-----------|--------|-----------|
| Heaven | 乾 Qián | 111 | ☰ | Metal | Creative, Strong | Father | Northwest |
| Earth | 坤 Kūn | 000 | ☷ | Earth | Receptive, Devoted | Mother | Southwest |
| Thunder | 震 Zhèn | 001 | ☳ | Wood | Arousing, Movement | Eldest Son | East |
| Water | 坎 Kǎn | 010 | ☵ | Water | Abysmal, Danger | Middle Son | North |
| Mountain | 艮 Gèn | 100 | ☶ | Earth | Keeping Still | Youngest Son | Northeast |
| Wind | 巽 Xùn | 011 | ☴ | Wood | Gentle, Penetrating | Eldest Daughter | Southeast |
| Fire | 離 Lí | 101 | ☲ | Fire | Clinging, Clarity | Middle Daughter | South |
| Lake | 兌 Duì | 110 | ☱ | Metal | Joyous, Pleasure | Youngest Daughter | West |

### Hexagram Model

Represents one of the 64 hexagrams formed by combining two trigrams.

```python
class Hexagram(BaseModel):
    """Represents an I-Ching hexagram."""
    
    number: int                              # Hexagram number (1-64) in King Wen sequence
    name: str                                # English name
    chinese: str                             # Chinese name and character
    trigrams: List[str]                      # [upper_trigram, lower_trigram]
    binary: str                              # Binary representation (6 bits)
    keywords: List[str]                      # Key themes and concepts
    judgment: str                            # The Judgment (Oracle's primary guidance)
    image: str                               # The Image (Symbolic representation)
    meaning: str                             # Core meaning and interpretation
    divination: str                          # Divinatory meaning for readings
    changing_lines: Dict[str, str]           # Interpretations for each changing line (1-6)
```

#### Hexagram Structure

Each hexagram contains:
- **Two Trigrams**: Upper (outer) and Lower (inner)
- **Six Lines**: Numbered 1-6 from bottom to top
- **Four Texts**: Judgment, Image, Meaning, Divination
- **Six Line Texts**: Individual changing line interpretations

### HexagramLine Model

Represents a single line within a cast hexagram.

```python
class HexagramLine(BaseModel):
    """Represents a single line in a hexagram."""
    
    position: int                            # Line position (1-6, bottom to top)
    value: int                               # Line value (6, 7, 8, or 9)
    type: Literal["yin", "yang"]            # Line type
    changing: bool                           # Whether this is a changing line
    interpretation: Optional[str]            # Line-specific interpretation from hexagram data
```

**Line Values:**
- **6**: Old Yin (changing) ⚋ → ⚊
- **7**: Young Yang (stable) ⚊
- **8**: Young Yin (stable) ⚋
- **9**: Old Yang (changing) ⚊ → ⚋

### IChingReading Model

Complete reading result containing primary and mutation hexagrams.

```python
class IChingReading(BaseModel):
    """Complete I-Ching reading result."""
    
    primary_hexagram: Hexagram               # The primary hexagram cast
    primary_lines: List[HexagramLine]        # Six lines of primary hexagram
    
    mutation_hexagram: Optional[Hexagram]    # Mutation hexagram (if changing lines exist)
    mutation_lines: Optional[List[HexagramLine]]  # Lines of mutation hexagram
    
    changing_lines: List[int]                # Positions of changing lines (1-6)
    method_used: str                         # Divination method ("coins", "yarrow", "random")
```

### IChingInput Model

User input for requesting a reading.

```python
class IChingInput(QuestionInput):
    """Input model for I-Ching Mutation Oracle."""
    
    method: Literal["coins", "yarrow", "random"] = "coins"  # Divination method
    focus_area: Optional[str] = None                        # Specific life area
    include_changing_lines: bool = True                     # Include line interpretations
    
    # Inherited from QuestionInput:
    # question: Optional[str]                               # The question being asked
    # user_id: Optional[str]                                # User identifier
```

### IChingOutput Model

Structured output from the engine.

```python
class IChingOutput(BaseEngineOutput):
    """Output model for I-Ching Mutation Oracle."""
    
    # Base class provides:
    engine_name: str                         # "I-Ching Mutation Oracle"
    calculation_time: float                  # Processing time in seconds
    confidence_score: float                  # Reading quality score (0-1)
    timestamp: datetime                      # When reading was generated
    
    raw_data: Dict[str, Any]                 # Complete reading data including:
                                             # - reading: IChingReading object
                                             # - question_asked: str
                                             # - method_used: str
                                             # - changing_line_count: int
                                             # - has_mutation: bool
                                             # - trigram_elements: List[str]
                                             # - field_resonance: Dict
                                             
    formatted_output: str                    # Human-readable interpretation
    recommendations: List[str]               # Key insights and guidance
    field_signature: str                     # "iching_hexagram_guidance"
    archetypal_themes: List[str]             # Archetypal patterns identified
```

### IChingData Model

Complete data structure for all 64 hexagrams and 8 trigrams.

```python
class IChingData(BaseModel):
    """Complete I-Ching data definition loaded from JSON."""
    
    hexagram_info: Dict[str, Any]            # Metadata about the hexagram system
    hexagrams: Dict[str, Dict[str, Any]]     # All 64 hexagrams (keys: "1" to "64")
    trigrams: Dict[str, Dict[str, Any]]      # 8 trigrams (keys: trigram names)
    methods: Dict[str, Dict[str, Any]]       # Divination method descriptions
```

## Engine Architecture

### IChingMutationOracle Class

Main engine class implementing the BaseEngine interface.

```python
class IChingMutationOracle(BaseEngine):
    """
    I-Ching Mutation Oracle Engine
    
    Performs I-Ching hexagram readings using traditional divination methods
    with support for changing lines and mutation hexagrams.
    """
    
    def __init__(self):
        super().__init__()
        self.iching_data: Optional[IChingData] = None
        self.divination_calc = DivinationCalculator()
        self._load_iching_data()
    
    @property
    def engine_name(self) -> str
    
    @property
    def description(self) -> str
    
    @property
    def input_model(self) -> Type[BaseEngineInput]
    
    @property
    def output_model(self) -> Type[BaseEngineOutput]
```

### Core Methods

#### Data Loading

```python
def _load_iching_data(self) -> None:
    """Load I-Ching hexagram data from JSON files."""
    iching_json = load_json_data("iching", "hexagrams.json")
    self.iching_data = IChingData(**iching_json)
```

#### Hexagram Retrieval

```python
def _get_hexagram_by_number(self, number: int) -> Hexagram:
    """
    Get hexagram by its number.
    
    Handles wraparound for numbers outside 1-64 range.
    Provides fallback to Hexagram #1 if data missing.
    """
```

#### Line Generation

```python
def _generate_hexagram_lines(self, method: str, question: str = "") -> List[int]:
    """
    Generate six lines for a hexagram using the specified method.
    
    Supports question-based seeding for reproducible results.
    """
```

#### Hexagram Conversion

```python
def _lines_to_hexagram_number(self, lines: List[int]) -> int:
    """
    Convert line values to hexagram number using King Wen sequence.
    
    Uses binary representation and modulo mapping.
    """

def _create_hexagram_lines(self, line_values: List[int]) -> List[HexagramLine]:
    """
    Create HexagramLine objects from raw line values.
    
    Determines type (yin/yang) and changing status.
    """
```

#### Mutation Logic

```python
def _create_mutation_hexagram(self, original_lines: List[int]) -> List[int]:
    """
    Create mutation hexagram by changing the changing lines.
    
    Old Yin (6) → Young Yang (7)
    Old Yang (9) → Young Yin (8)
    """
```

#### Interpretation

```python
def _interpret_changing_lines(self, hexagram: Hexagram, 
                              changing_positions: List[int]) -> List[str]:
    """Interpret the changing lines for the hexagram."""

def _generate_overall_interpretation(self, reading: IChingReading, 
                                    question: str) -> str:
    """Generate overall interpretation of the reading."""
```

#### Main Calculation

```python
def _calculate(self, validated_input: IChingInput) -> Dict[str, Any]:
    """
    Process the I-Ching reading calculation.
    
    Flow:
    1. Generate hexagram lines using chosen method
    2. Create primary hexagram from lines
    3. Identify changing lines
    4. Create mutation hexagram if needed
    5. Generate interpretation
    6. Calculate archetypal resonance
    7. Return complete reading data
    """
```

#### Output Formatting

```python
def _interpret(self, calculation_results: Dict[str, Any], 
              input_data: IChingInput) -> str:
    """
    Interpret calculation results into human-readable format.
    
    Creates formatted text output with symbols and structure.
    """
```

## Data Storage Structure

### JSON File Format

```json
{
  "hexagram_info": {
    "name": "I-Ching Hexagrams",
    "description": "The 64 hexagrams of the I-Ching",
    "total_hexagrams": 64,
    "source": "Traditional I-Ching wisdom"
  },
  "hexagrams": {
    "1": {
      "number": 1,
      "name": "The Creative",
      "chinese": "乾 (Qián)",
      "trigrams": ["Heaven", "Heaven"],
      "binary": "111111",
      "keywords": ["creativity", "strength", "leadership", "initiative"],
      "judgment": "The Creative works sublime success...",
      "image": "The movement of heaven is full of power...",
      "meaning": "Pure creative energy...",
      "divination": "Great success is possible...",
      "changing_lines": {
        "1": "Hidden dragon. Do not act.",
        "2": "Dragon appearing in the field...",
        ...
      }
    },
    ...
  },
  "trigrams": {
    "Heaven": {
      "name": "Heaven",
      "chinese": "乾 (Qián)",
      "binary": "111",
      "element": "Metal",
      "attribute": "Strong",
      "family": "Father",
      "direction": "Northwest",
      "season": "Late Autumn",
      "meaning": "Creative force, the heavens"
    },
    ...
  },
  "methods": {
    "coins": {
      "name": "Three Coin Method",
      "description": "Traditional coin toss method"
    },
    ...
  }
}
```

## Calculation Pipeline

```
User Input
    ↓
[IChingInput validation]
    ↓
[Method selection: coins/yarrow/random]
    ↓
[Generate 6 lines] ←→ [Question seeding (optional)]
    ↓
[Lines to hexagram number]
    ↓
[Retrieve hexagram data]
    ↓
[Identify changing lines]
    ↓
[Create mutation hexagram?] → Yes → [Transform lines] → [Get mutation data]
    ↓                              ↓
    No                             ↓
    ↓                              ↓
[Build IChingReading] ←────────────┘
    ↓
[Generate interpretation]
    ↓
[Calculate archetypal resonance]
    ↓
[Format output]
    ↓
IChingOutput
```

## Integration Points

### DivinationCalculator

Shared calculation module providing:
- Seeded randomization
- Question-based seed generation
- Coin toss simulation
- Yarrow stalk probability simulation
- Archetypal resonance calculation

```python
from shared.calculations.divination import DivinationCalculator

divination_calc = DivinationCalculator(seed=optional_seed)
lines = divination_calc.generate_hexagram_lines(method="coins")
```

### BaseEngine Interface

All WitnessOS engines inherit from BaseEngine:

```python
from shared.base.engine_interface import BaseEngine
from shared.base.data_models import BaseEngineInput, BaseEngineOutput

class IChingMutationOracle(BaseEngine):
    # Must implement:
    # - engine_name property
    # - description property
    # - input_model property
    # - output_model property
    # - _calculate() method
    # - _interpret() method
```

## Trigram Relationships

### Elemental Correspondences

Each trigram corresponds to one of the Five Elements:

| Element | Trigrams | Properties |
|---------|----------|------------|
| **Metal** | Heaven, Lake | Clarity, precision, cutting |
| **Wood** | Thunder, Wind | Growth, flexibility, expansion |
| **Water** | Water | Depth, flow, danger |
| **Fire** | Fire | Clarity, passion, illumination |
| **Earth** | Earth, Mountain | Stability, receptivity, stillness |

### Family Relationships

The eight trigrams form a family structure:

- **Father**: Heaven (乾)
- **Mother**: Earth (坤)
- **Eldest Son**: Thunder (震)
- **Middle Son**: Water (坎)
- **Youngest Son**: Mountain (艮)
- **Eldest Daughter**: Wind (巽)
- **Middle Daughter**: Fire (離)
- **Youngest Daughter**: Lake (兌)

### Directional Mapping (Later Heaven Sequence)

Forms the Bagua compass used in Feng Shui:

```
        South (Fire)
           離 ☲
            |
Southeast   |   Southwest
巽 ☴ -------+------- 坤 ☷
(Wind)      |      (Earth)
            |
East        |         West
震 ☳ -------+------- 兌 ☱
(Thunder)   |       (Lake)
            |
Northeast   |   Northwest
艮 ☶ -------+------- 乾 ☰
(Mountain)  |      (Heaven)
            |
        North (Water)
           坎 ☵
```

## Hexagram Index Structure

The 64 hexagrams organized by trigram combinations:

| Upper \ Lower | ☰ Heaven | ☷ Earth | ☳ Thunder | ☵ Water | ☶ Mountain | ☴ Wind | ☲ Fire | ☱ Lake |
|---------------|----------|---------|-----------|---------|------------|--------|--------|--------|
| **☰ Heaven**  | 1 | 11 | 34 | 5 | 26 | 9 | 14 | 43 |
| **☷ Earth**   | 12 | 2 | 16 | 8 | 23 | 20 | 35 | 45 |
| **☳ Thunder** | 25 | 24 | 51 | 3 | 27 | 42 | 21 | 17 |
| **☵ Water**   | 6 | 7 | 40 | 29 | 4 | 59 | 64 | 47 |
| **☶ Mountain**| 33 | 15 | 62 | 39 | 52 | 53 | 56 | 31 |
| **☴ Wind**    | 44 | 46 | 32 | 48 | 18 | 57 | 50 | 28 |
| **☲ Fire**    | 13 | 36 | 55 | 63 | 22 | 37 | 30 | 49 |
| **☱ Lake**    | 10 | 19 | 54 | 60 | 41 | 61 | 38 | 58 |

## Error Handling

### Fallback Mechanisms

```python
# Invalid hexagram number handling
if number < 1 or number > 64:
    number = ((number - 1) % 64) + 1

# Missing hexagram data fallback
if str(number) not in self.iching_data.hexagrams:
    number = 1  # Use Hexagram #1 (The Creative)
```

### Data Validation

Using Pydantic models ensures:
- Type safety
- Required field validation
- Enum constraint enforcement
- Automatic documentation

## Performance Considerations

- **Data Loading**: JSON parsed once at initialization, cached in memory
- **Hexagram Lookup**: O(1) dictionary access by number
- **Line Generation**: O(6) for six lines, each O(1) random operation
- **Total Calculation**: < 10ms typical execution time

---

*Last Updated: 2026*  
*Source: WitnessOS I-Ching Mutation Oracle Engine*
