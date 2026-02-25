# Vimshottari Dasha - Core Architecture

**Documentation Type:** System Design & Implementation  
**Last Updated:** 2026-01-26

---

## Table of Contents
1. [Class Structure](#class-structure)
2. [Data Flow Architecture](#data-flow-architecture)
3. [Algorithm Components](#algorithm-components)
4. [Processing Pipeline](#processing-pipeline)
5. [Data Models](#data-models)
6. [Integration Interfaces](#integration-interfaces)
7. [Performance Characteristics](#performance-characteristics)

---

## Class Structure

### VimshottariTimelineMapper (Main Engine)

```python
class VimshottariTimelineMapper(BaseEngine):
    """
    Vimshottari Dasha Timeline Mapper Engine
    
    Calculates Vedic astrology Dasha periods including:
    - Current Mahadasha, Antardasha, Pratyantardasha
    - Birth nakshatra analysis
    - Timeline of all major periods
    - Karmic themes and guidance
    """
    
    # Core Properties
    engine_name: str = "vimshottari_timeline_mapper"
    description: str = "Calculates Vedic Dasha periods with karmic guidance"
    input_model: Type = VimshottariInput
    output_model: Type = VimshottariOutput
    
    # Calculation Components
    astro_calc: AstrologyCalculator
    dasha_periods: Dict[str, int]          # Planetary period durations
    nakshatra_data: Dict[str, Dict]         # 27 nakshatra characteristics
    planet_characteristics: Dict[str, Dict] # 9 planetary themes
    dasha_sequence: List[str]               # 9-planet cycle order
    antardasha_sequences: Dict[str, List]   # Per-planet sub-sequences
```

### Key Initialization

```python
def __init__(self, config=None):
    """Initialize the Vimshottari Timeline Mapper."""
    super().__init__(config)
    self.astro_calc = AstrologyCalculator()
    self._load_dasha_data()

def _load_dasha_data(self):
    """Load Dasha calculation data."""
    # Load period durations
    self.dasha_periods = DASHA_PERIODS
    self.nakshatra_data = NAKSHATRA_DATA
    self.planet_characteristics = PLANET_CHARACTERISTICS
    
    # Establish 120-year cycle sequence
    self.dasha_sequence = [
        "Ketu", "Venus", "Sun", "Moon", "Mars", 
        "Rahu", "Jupiter", "Saturn", "Mercury"
    ]
    
    # Generate antardasha sequences for each planet
    self.antardasha_sequences = {}
    for planet in self.dasha_sequence:
        start_index = self.dasha_sequence.index(planet)
        sequence = (self.dasha_sequence[start_index:] + 
                   self.dasha_sequence[:start_index])
        self.antardasha_sequences[planet] = sequence
```

---

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         INPUT LAYER                                   │
├──────────────────────────────────────────────────────────────────────┤
│  VimshottariInput                                                     │
│  ├─ birth_date: date                                                  │
│  ├─ birth_time: time                                                  │
│  ├─ birth_location: (lat, lon)                                        │
│  ├─ timezone: str                                                     │
│  ├─ current_date: Optional[date]                                      │
│  └─ years_forecast: int (default: 10)                                 │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                   VALIDATION & PREPARATION                            │
├──────────────────────────────────────────────────────────────────────┤
│  1. Combine birth_date + birth_time → datetime                        │
│  2. Validate coordinates (lat: -90 to 90, lon: -180 to 180)          │
│  3. Validate datetime format                                          │
│  4. Set current_date to today() if None                               │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                 ASTRONOMICAL CALCULATION                              │
├──────────────────────────────────────────────────────────────────────┤
│  AstrologyCalculator.calculate_vedic_data()                           │
│  ├─ Swiss Ephemeris: Moon position in sidereal zodiac                │
│  ├─ Nakshatra determination (27 divisions)                            │
│  ├─ Pada calculation (1-4 within nakshatra)                           │
│  └─ Degrees within nakshatra (0-13.333°)                              │
│                                                                        │
│  Output: moon_nakshatra = {                                           │
│    'name': str,                                                        │
│    'pada': int,                                                        │
│    'degrees_in_nakshatra': float                                      │
│  }                                                                     │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                   NAKSHATRA PROCESSING                                │
├──────────────────────────────────────────────────────────────────────┤
│  _process_nakshatra(moon_nakshatra)                                   │
│  ├─ Lookup nakshatra in NAKSHATRA_DATA                                │
│  ├─ Extract ruling_planet, symbol, deity, nature                      │
│  └─ Create NakshatraInfo object                                       │
│                                                                        │
│  NakshatraInfo:                                                        │
│  ├─ name, pada, ruling_planet                                         │
│  ├─ degrees_in_nakshatra                                              │
│  └─ characteristics, meaning, symbol, deity                           │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                   TIMELINE GENERATION                                 │
├──────────────────────────────────────────────────────────────────────┤
│  _calculate_dasha_timeline(birth_date, nakshatra_info, current_date) │
│                                                                        │
│  STEP 1: Calculate Balance of First Mahadasha                         │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ first_planet = nakshatra_info.ruling_planet                     │  │
│  │ first_period_years = DASHA_PERIODS[first_planet]               │  │
│  │                                                                  │  │
│  │ completed_fraction = degrees_in_nakshatra / 13.333...          │  │
│  │ remaining_years = first_period_years * (1 - completed_fraction)│  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  STEP 2: Generate First (Partial) Period                              │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ start_date = birth_date                                         │  │
│  │ end_date = birth_date + (remaining_years × 365.25 days)        │  │
│  │ timeline.append(DashaPeriod(...))                               │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  STEP 3: Generate Subsequent Complete Periods (120-year cycle)        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ planet_index = (first_planet_index + 1) % 9                    │  │
│  │ while years_calculated < 120:                                   │  │
│  │   planet = dasha_sequence[planet_index]                        │  │
│  │   period_years = DASHA_PERIODS[planet]                         │  │
│  │   end_date = start_date + (period_years × 365.25 days)         │  │
│  │   timeline.append(DashaPeriod(...))                             │  │
│  │   planet_index = (planet_index + 1) % 9                        │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  Output: List[DashaPeriod] (all Mahadashas)                           │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                  CURRENT PERIOD DETERMINATION                         │
├──────────────────────────────────────────────────────────────────────┤
│  _find_current_periods(timeline, current_date)                        │
│                                                                        │
│  LEVEL 1: Find Current Mahadasha                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ for period in timeline:                                         │  │
│  │   if period.start_date <= current_date <= period.end_date:     │  │
│  │     current_mahadasha = period                                  │  │
│  │     period.is_current = True                                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  LEVEL 2: Calculate Current Antardasha                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ antardasha_sequence = antardasha_sequences[mahadasha.planet]   │  │
│  │ total_antardasha_years = sum(DASHA_PERIODS[p] for p in seq)   │  │
│  │                                                                  │  │
│  │ for antardasha_planet in antardasha_sequence:                  │  │
│  │   proportion = DASHA_PERIODS[planet] / total_antardasha_years  │  │
│  │   duration = mahadasha.duration_years * proportion             │  │
│  │   end_date = start_date + (duration × 365.25 days)             │  │
│  │   if start_date <= current_date <= end_date:                   │  │
│  │     current_antardasha = DashaPeriod(...)                      │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  LEVEL 3: Calculate Current Pratyantardasha                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ (Same logic as Antardasha, subdividing Antardasha period)      │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  Output: Dict {                                                        │
│    'mahadasha': DashaPeriod,                                           │
│    'antardasha': DashaPeriod,                                          │
│    'pratyantardasha': DashaPeriod                                      │
│  }                                                                     │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                  UPCOMING PERIODS GENERATION                          │
├──────────────────────────────────────────────────────────────────────┤
│  _generate_upcoming_periods(timeline, current_date, years_forecast)   │
│  ├─ forecast_end = current_date + (years_forecast × 365.25 days)     │
│  ├─ Filter timeline: start_date > current_date AND ≤ forecast_end    │
│  └─ Mark periods as is_upcoming = True                                │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    KARMIC THEME ANALYSIS                              │
├──────────────────────────────────────────────────────────────────────┤
│  _analyze_karmic_themes(current_periods, upcoming_periods)            │
│  ├─ Extract themes from current Mahadasha, Antardasha                │
│  ├─ Identify upcoming major transitions (next 3 periods)             │
│  └─ Generate karmic guidance strings                                 │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                      INTERPRETATION LAYER                             │
├──────────────────────────────────────────────────────────────────────┤
│  _interpret(calculation_results, input_data)                          │
│  ├─ Format birth nakshatra analysis                                  │
│  ├─ Format current periods (Maha/Antar/Pratyantar)                   │
│  ├─ Format upcoming transitions                                      │
│  └─ Format karmic themes & life lessons                              │
│                                                                        │
│  Output: Formatted text interpretation                                │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    RECOMMENDATIONS & PATCHES                          │
├──────────────────────────────────────────────────────────────────────┤
│  _generate_recommendations()                                          │
│  ├─ Planet-specific recommendations from PLANET_CHARACTERISTICS      │
│  └─ General Dasha navigation guidance                                │
│                                                                        │
│  _generate_reality_patches()                                          │
│  ├─ PATCH_DASHA_{PLANET}: Alignment patches                          │
│  └─ PATCH_KARMIC_TIMING: Temporal synchronization                    │
│                                                                        │
│  _identify_archetypal_themes()                                        │
│  └─ Extract archetypal patterns from periods                         │
└──────────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────────┐
│                          OUTPUT LAYER                                 │
├──────────────────────────────────────────────────────────────────────┤
│  VimshottariOutput                                                    │
│  ├─ timeline: DashaTimeline                                           │
│  │   ├─ birth_nakshatra: NakshatraInfo                               │
│  │   ├─ current_mahadasha: DashaPeriod                               │
│  │   ├─ current_antardasha: DashaPeriod                              │
│  │   ├─ current_pratyantardasha: DashaPeriod                         │
│  │   ├─ all_mahadashas: List[DashaPeriod]                            │
│  │   └─ upcoming_periods: List[DashaPeriod]                          │
│  ├─ formatted_output: str (interpretation)                            │
│  ├─ recommendations: List[str]                                        │
│  ├─ reality_patches: List[str]                                        │
│  ├─ archetypal_themes: List[str]                                      │
│  ├─ calculation_time: float                                           │
│  └─ field_signature: str                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Algorithm Components

### 1. Balance Calculation

**Purpose:** Determine remaining duration of first Mahadasha at birth

**Formula:**
```
completed_fraction = moon_degrees_in_nakshatra / (360° / 27 nakshatras)
                   = moon_degrees_in_nakshatra / 13.333...°

remaining_years = full_mahadasha_duration × (1 - completed_fraction)
```

**Example:**
```python
# Moon at 8.5° in Ashwini nakshatra
# Ashwini ruled by Ketu (7-year period)

completed_fraction = 8.5 / 13.333 = 0.6375  # 63.75% complete
remaining_years = 7 × (1 - 0.6375) = 2.54 years

# Person born with 2.54 years of Ketu Dasha remaining
```

### 2. Proportional Subdivision

**Purpose:** Divide major periods into sub-periods maintaining harmonic ratios

**Antardasha Duration Formula:**
```
total_ratio = sum(DASHA_PERIODS[p] for p in antardasha_sequence)
            = 7 + 20 + 6 + 10 + 7 + 18 + 16 + 19 + 17 = 120

antardasha_proportion = DASHA_PERIODS[antardasha_planet] / total_ratio

antardasha_duration = mahadasha_duration × antardasha_proportion
```

**Example:**
```python
# Venus Mahadasha = 20 years
# Sun Antardasha within Venus Mahadasha

sun_proportion = 6 / 120 = 0.05
sun_antardasha_duration = 20 × 0.05 = 1.0 year

# Venus-Sun period lasts 1 year within 20-year Venus Mahadasha
```

### 3. Sequence Generation

**Purpose:** Create cyclic sub-period sequences for each planet

**Logic:**
```python
def generate_antardasha_sequence(mahadasha_planet):
    """Generate Antardasha sequence starting from Mahadasha planet."""
    dasha_sequence = ["Ketu", "Venus", "Sun", "Moon", "Mars", 
                     "Rahu", "Jupiter", "Saturn", "Mercury"]
    
    start_index = dasha_sequence.index(mahadasha_planet)
    
    # Rotate sequence to start with mahadasha_planet
    sequence = (dasha_sequence[start_index:] + 
               dasha_sequence[:start_index])
    
    return sequence

# Example: Jupiter Mahadasha
# Sequence: Jupiter, Saturn, Mercury, Ketu, Venus, Sun, Moon, Mars, Rahu
```

---

## Processing Pipeline

### Main Calculation Flow

```python
def _calculate(self, validated_input: VimshottariInput) -> Dict[str, Any]:
    """Calculate Vimshottari Dasha timeline."""
    
    # 1. PREPARE INPUT
    birth_datetime = datetime.combine(
        validated_input.birth_date, 
        validated_input.birth_time
    )
    lat, lon = validated_input.birth_location
    current_date = validated_input.current_date or date.today()
    
    # 2. ASTRONOMICAL CALCULATION
    vedic_data = self.astro_calc.calculate_vedic_data(
        birth_datetime, lat, lon, validated_input.timezone
    )
    
    # 3. NAKSHATRA PROCESSING
    nakshatra_info = self._process_nakshatra(
        vedic_data['moon_nakshatra']
    )
    
    # 4. TIMELINE GENERATION (120-year cycle)
    timeline = self._calculate_dasha_timeline(
        birth_datetime.date(), 
        nakshatra_info, 
        current_date
    )
    
    # 5. CURRENT PERIOD DETERMINATION
    current_periods = self._find_current_periods(timeline, current_date)
    
    # 6. UPCOMING PERIODS
    upcoming_periods = self._generate_upcoming_periods(
        timeline, 
        current_date, 
        validated_input.years_forecast
    )
    
    # 7. KARMIC ANALYSIS
    karmic_themes = self._analyze_karmic_themes(
        current_periods, 
        upcoming_periods
    )
    
    # 8. RETURN RESULTS
    return {
        'birth_info': {...},
        'calculation_date': current_date,
        'nakshatra_info': nakshatra_info,
        'timeline': timeline,
        'current_periods': current_periods,
        'upcoming_periods': upcoming_periods,
        'karmic_themes': karmic_themes,
        'raw_vedic_data': vedic_data
    }
```

---

## Data Models

### VimshottariInput (Pydantic Model)

```python
class VimshottariInput(BaseEngineInput, BirthDataInput):
    """Input model for Vimshottari Dasha calculations."""
    
    # Required Fields
    birth_date: date
    birth_time: time  # REQUIRED for Dasha
    birth_location: Tuple[float, float]  # (lat, lon)
    timezone: str  # e.g., 'America/New_York'
    
    # Optional Fields
    current_date: Optional[date] = None
    include_sub_periods: bool = True
    years_forecast: int = Field(default=10, ge=1, le=50)
    
    # Validators
    @field_validator('birth_time')
    def validate_birth_time(cls, v):
        if v is None:
            raise ValueError("Birth time required")
        return v
    
    @field_validator('birth_location')
    def validate_birth_location(cls, v):
        lat, lon = v
        if not (-90 <= lat <= 90):
            raise ValueError("Invalid latitude")
        if not (-180 <= lon <= 180):
            raise ValueError("Invalid longitude")
        return v
```

### DashaPeriod (Core Data Structure)

```python
class DashaPeriod(BaseModel):
    """Represents a Dasha period with timing and characteristics."""
    
    # Period Identification
    planet: str                  # "Sun", "Moon", "Mars", etc.
    period_type: str             # "Mahadasha", "Antardasha", "Pratyantardasha"
    
    # Timing
    start_date: date
    end_date: date
    duration_years: float
    
    # Status Flags
    is_current: bool = False
    is_upcoming: bool = False
    
    # Interpretation
    general_theme: str = ""
    opportunities: List[str] = []
    challenges: List[str] = []
    recommendations: List[str] = []
```

### NakshatraInfo (Birth Foundation)

```python
class NakshatraInfo(BaseModel):
    """Information about the birth nakshatra."""
    
    # Core Data
    name: str                           # "Ashwini", "Bharani", etc.
    pada: int                           # 1-4 (quarter within nakshatra)
    ruling_planet: str                  # Determines starting Mahadasha
    degrees_in_nakshatra: float         # 0.0 - 13.333°
    
    # Characteristics
    symbol: str                         # "Horse's head", etc.
    deity: str                          # "Ashwini Kumaras", etc.
    nature: str                         # "Rajas", "Sattva", "Tamas"
    meaning: str                        # Nakshatra meaning
    characteristics: List[str]          # Key traits
```

### DashaTimeline (Complete Result)

```python
class DashaTimeline(BaseModel):
    """Complete Dasha timeline with all periods."""
    
    # Foundation
    birth_nakshatra: NakshatraInfo
    
    # Current State (3 levels)
    current_mahadasha: DashaPeriod
    current_antardasha: Optional[DashaPeriod]
    current_pratyantardasha: Optional[DashaPeriod]
    
    # Timeline Data
    all_mahadashas: List[DashaPeriod]       # Full 120-year cycle
    upcoming_periods: List[DashaPeriod]      # Next N years
    
    # Analysis
    life_phase_analysis: str
    karmic_themes: List[str]
```

### VimshottariOutput (Final Output)

```python
class VimshottariOutput(BaseEngineOutput):
    """Output model for Vimshottari Dasha Timeline Mapper."""
    
    # Core Results
    timeline: DashaTimeline
    calculation_date: date
    birth_info: Dict[str, Any]
    
    # Interpretations
    formatted_output: str                    # Formatted text
    current_period_analysis: str
    upcoming_opportunities: str
    karmic_guidance: str
    
    # Guidance
    recommendations: List[str]
    favorable_periods: List[str]
    challenging_periods: List[str]
    
    # WitnessOS Integration
    reality_patches: List[str]
    archetypal_themes: List[str]
    field_signature: str
    
    # Metadata
    engine_name: str
    calculation_time: float
    confidence_score: float
```

---

## Integration Interfaces

### 1. AstrologyCalculator Interface

```python
# Required dependency for astronomical calculations
class AstrologyCalculator:
    def calculate_vedic_data(
        self, 
        datetime: datetime,
        latitude: float,
        longitude: float,
        timezone: str
    ) -> Dict[str, Any]:
        """
        Calculate Vedic astrological data using Swiss Ephemeris.
        
        Returns:
        {
            'moon_nakshatra': {
                'name': str,           # Nakshatra name
                'pada': int,           # 1-4
                'degrees_in_nakshatra': float,  # 0.0 - 13.333
                'sidereal_longitude': float
            },
            'planets': {...},          # Other planetary positions
            'houses': {...}            # House cusps
        }
        """
```

### 2. BaseEngine Interface

```python
# Inherited from WitnessOS base architecture
class BaseEngine:
    def calculate(self, input_data: Any) -> BaseEngineOutput:
        """Main entry point for calculations."""
        
    def _validate_input(self, input_data: Any) -> BaseEngineInput:
        """Validate and convert input."""
        
    def _calculate(self, validated_input: BaseEngineInput) -> Dict:
        """Core calculation logic (override)."""
        
    def _interpret(self, results: Dict, input_data: Any) -> str:
        """Generate interpretation (override)."""
```

### 3. External API Endpoints

```python
# RESTful API interface (if deployed as service)
POST /api/vimshottari/calculate
{
    "birth_date": "1990-05-15",
    "birth_time": "14:30:00",
    "birth_location": [28.6139, 77.2090],
    "timezone": "Asia/Kolkata",
    "years_forecast": 10
}

Response:
{
    "timeline": {...},
    "current_periods": {...},
    "upcoming_periods": [...],
    "interpretation": "...",
    "recommendations": [...]
}
```

---

## Performance Characteristics

### Computational Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Nakshatra lookup | O(1) | Dictionary access |
| Balance calculation | O(1) | Simple arithmetic |
| Timeline generation | O(n) | n ≈ 9 Mahadashas |
| Antardasha calculation | O(m) | m = 9 planets |
| Pratyantardasha | O(m²) | Nested subdivision |
| Period search | O(log n) | Binary search possible |
| Full calculation | O(m²) | Dominated by Pratyantardasha |

### Typical Execution Times

- **Nakshatra Processing:** < 1ms
- **Timeline Generation:** < 5ms
- **Current Period Determination:** < 10ms
- **Complete Calculation:** < 50ms
- **Interpretation Generation:** < 100ms

**Total End-to-End:** ~150ms (excluding Swiss Ephemeris call)

### Memory Usage

- **Input Data:** ~1 KB
- **Timeline Storage:** ~10 KB (120-year cycle)
- **Output Data:** ~50 KB (with full interpretation)
- **Peak Memory:** < 1 MB

### Scaling Characteristics

- **Single Calculation:** Sub-second response
- **Batch Processing:** Linear scaling (parallelizable)
- **Caching Potential:** High (birth data unchanging)
- **Database Storage:** Efficient (structured relational data)

---

## Error Handling & Edge Cases

### Input Validation

```python
# Coordinate validation
if not (-90 <= latitude <= 90):
    raise ValueError("Latitude must be between -90 and 90")

if not (-180 <= longitude <= 180):
    raise ValueError("Longitude must be between -180 and 180")

# Time validation
if birth_time is None:
    raise ValueError("Birth time is required for Dasha calculations")

# Date validation
if birth_date > current_date:
    raise ValueError("Birth date cannot be in the future")
```

### Calculation Edge Cases

```python
# Handle dates beyond 120-year cycle
if (current_date - birth_date).days / 365.25 > 120:
    # Wrap around to second cycle
    cycles_elapsed = int((current_date - birth_date).days / (365.25 * 120))
    adjusted_date = current_date - timedelta(days=cycles_elapsed * 120 * 365.25)

# Handle nakshatra boundary conditions
if degrees_in_nakshatra == 13.333:  # Exact boundary
    # Use next nakshatra with 0° position
    
# Handle leap year precision
days = duration_years * 365.25  # Account for leap years
```

### Fallback Strategies

```python
# If Swiss Ephemeris unavailable
try:
    vedic_data = self.astro_calc.calculate_vedic_data(...)
except EphemerisError:
    # Fall back to approximate calculation
    vedic_data = self._approximate_moon_position(...)
    self.logger.warning("Using approximate calculation")

# If nakshatra data incomplete
nakshatra_data = self.nakshatra_data.get(
    nakshatra_name, 
    DEFAULT_NAKSHATRA_DATA
)
```

---

## Dependencies

### Required Libraries

```python
# Core Python
from datetime import datetime, date, time, timedelta
from typing import Dict, List, Any, Type, Optional
import logging

# External Dependencies
from pydantic import BaseModel, Field, field_validator

# WitnessOS Framework
from shared.base.engine_interface import BaseEngine
from shared.base.data_models import BaseEngineInput, BaseEngineOutput
from shared.calculations.astrology import AstrologyCalculator

# Swiss Ephemeris (via AstrologyCalculator)
# - pyswisseph: Swiss Ephemeris Python bindings
```

### Configuration

```python
# config.yaml (or environment variables)
vimshottari:
  timezone_default: "UTC"
  forecast_years_default: 10
  forecast_years_max: 50
  enable_sub_sub_periods: true
  cache_astronomical_data: true
  ephemeris_path: "/path/to/ephe"
```

---

## Testing Considerations

### Unit Tests

```python
def test_balance_calculation():
    """Test first Mahadasha balance calculation."""
    # Known test case
    degrees = 8.5
    mahadasha_years = 7
    expected_remaining = 2.5375
    
    result = calculate_balance(degrees, mahadasha_years)
    assert abs(result - expected_remaining) < 0.01

def test_antardasha_sequence():
    """Test Antardasha sequence generation."""
    sequence = generate_antardasha_sequence("Jupiter")
    assert sequence[0] == "Jupiter"
    assert len(sequence) == 9
    assert sequence[-1] == "Rahu"
```

### Integration Tests

```python
def test_full_calculation_pipeline():
    """Test complete Dasha calculation."""
    input_data = VimshottariInput(
        birth_date=date(1990, 5, 15),
        birth_time=time(14, 30),
        birth_location=(28.6139, 77.2090),
        timezone="Asia/Kolkata"
    )
    
    engine = VimshottariTimelineMapper()
    output = engine.calculate(input_data)
    
    assert output.timeline is not None
    assert output.timeline.current_mahadasha is not None
    assert len(output.timeline.all_mahadashas) > 0
```

### Validation Tests

```python
def test_timeline_continuity():
    """Ensure no gaps in timeline."""
    timeline = generate_timeline(...)
    
    for i in range(len(timeline) - 1):
        assert timeline[i].end_date == timeline[i+1].start_date

def test_120_year_cycle():
    """Verify complete 120-year cycle."""
    timeline = generate_timeline(...)
    
    total_years = sum(p.duration_years for p in timeline)
    assert abs(total_years - 120) < 0.01  # Within 1% tolerance
```

---

## Extension Points

### 1. Additional Period Levels

```python
# Add Sookshma (sub-sub-sub-period)
def _calculate_current_sookshma(
    self, 
    mahadasha, 
    antardasha, 
    pratyantardasha, 
    current_date
):
    """Calculate 4th-level subdivision."""
    # Same proportional logic
```

### 2. Transit Integration

```python
# Overlay current transits on Dasha periods
def _integrate_transits(self, timeline, current_date):
    """Add current planetary transits to Dasha analysis."""
    current_transits = self.astro_calc.get_transits(current_date)
    # Combine Dasha + Transit themes
```

### 3. Custom Dasha Systems

```python
# Support alternative Dasha systems
class AshtottariDashaEngine(VimshottariTimelineMapper):
    """108-year Ashtottari Dasha system."""
    
    def _load_dasha_data(self):
        self.dasha_sequence = ["Sun", "Moon", "Mars", 
                              "Mercury", "Saturn", "Jupiter", 
                              "Rahu", "Venus"]
        # 108-year total cycle
```

### 4. AI-Enhanced Interpretation

```python
def _generate_ai_interpretation(self, periods, context):
    """Use LLM for personalized interpretation."""
    prompt = f"""
    Analyze Dasha periods:
    Current: {periods['mahadasha'].planet}
    Context: {context}
    Generate personalized guidance...
    """
    return llm.complete(prompt)
```

---

**Next:** [Calculation Algorithms](./vimshottari-calculation-algorithms.md)  
**See also:** [Nakshatra System](./vimshottari-nakshatra-system.md)
