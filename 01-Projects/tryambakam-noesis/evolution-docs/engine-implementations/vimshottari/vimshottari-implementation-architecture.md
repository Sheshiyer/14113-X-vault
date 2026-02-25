# Vimshottari Dasha Implementation Architecture

## System Overview

The Vimshottari Timeline Mapper Engine implements a three-layer architecture for calculating, caching, and interpreting Vedic Dasha periods within the WitnessOS consciousness framework.

```
┌─────────────────────────────────────────────────────────────┐
│                    WitnessOS Interface Layer                 │
│  (BaseEngine protocol, standardized I/O, field signatures)  │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Vimshottari Timeline Mapper Engine              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Input Validation & Processing Layer                 │   │
│  │  • VimshottariInput model validation                 │   │
│  │  • Coordinate & datetime validation                  │   │
│  │  • Timezone normalization                            │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Calculation Engine Core                             │   │
│  │  • Swiss Ephemeris integration                       │   │
│  │  • Nakshatra determination                           │   │
│  │  • Dasha timeline generation                         │   │
│  │  • Period finder algorithms                          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Interpretation & Synthesis Layer                    │   │
│  │  • Karmic theme analysis                             │   │
│  │  • Archetypal pattern recognition                    │   │
│  │  • Reality patch generation                          │   │
│  │  • Formatted output rendering                        │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Shared Infrastructure Layer                     │
│  • AstrologyCalculator (Swiss Ephemeris wrapper)            │
│  • Data models (Pydantic schemas)                           │
│  • Static data (NAKSHATRA_DATA, DASHA_PERIODS)             │
│  • Logging & monitoring                                      │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Engine Class: `VimshottariTimelineMapper`

**Inheritance**: `BaseEngine` → `VimshottariTimelineMapper`

**Responsibilities**:
- Implement WitnessOS engine protocol
- Coordinate calculation pipeline
- Manage data loading and caching
- Generate standardized outputs

```python
class VimshottariTimelineMapper(BaseEngine):
    """
    Primary engine class implementing the Vimshottari Dasha system.
    """
    
    def __init__(self, config=None):
        super().__init__(config)
        self.astro_calc = AstrologyCalculator()
        self._load_dasha_data()
    
    # Abstract method implementations
    @property
    def engine_name(self) -> str
    @property
    def description(self) -> str
    @property
    def input_model(self) -> Type[BaseEngineInput]
    @property
    def output_model(self) -> Type[BaseEngineOutput]
    
    # Core calculation pipeline
    def _calculate(self, validated_input: VimshottariInput) -> Dict[str, Any]
    def _interpret(self, calculation_results: Dict[str, Any], 
                   input_data: VimshottariInput) -> str
    def _generate_recommendations(self, ...) -> List[str]
    def _generate_reality_patches(self, ...) -> List[str]
    def _identify_archetypal_themes(self, ...) -> List[str]
```

### 2. Data Models (Pydantic Schemas)

#### Input Model

```python
class VimshottariInput(BaseEngineInput):
    """
    Validated input data for Vimshottari calculations.
    """
    birth_date: date
    birth_time: time
    birth_location: Tuple[float, float]  # (latitude, longitude)
    timezone: str                         # IANA timezone
    current_date: Optional[date] = None
    years_forecast: int = 10              # Forecast horizon
```

#### Output Model

```python
class VimshottariOutput(BaseEngineOutput):
    """
    Structured output containing timeline and interpretations.
    """
    # Standard BaseEngineOutput fields
    engine_name: str
    calculation_time: float
    confidence_score: float
    field_signature: str
    formatted_output: str
    recommendations: List[str]
    
    # Vimshottari-specific fields
    timeline: DashaTimeline
    birth_info: Dict[str, Any]
    calculation_date: date
```

#### Domain Models

```python
class NakshatraInfo(BaseModel):
    """Birth nakshatra details."""
    name: str
    pada: int
    ruling_planet: str
    degrees_in_nakshatra: float
    symbol: str
    deity: str
    nature: str
    meaning: str
    characteristics: List[str]

class DashaPeriod(BaseModel):
    """Single Dasha period."""
    planet: str
    period_type: Literal["Mahadasha", "Antardasha", "Pratyantardasha"]
    start_date: date
    end_date: date
    duration_years: float
    general_theme: str
    is_current: bool = False
    is_upcoming: bool = False

class DashaTimeline(BaseModel):
    """Complete timeline structure."""
    birth_nakshatra: NakshatraInfo
    current_mahadasha: Optional[DashaPeriod]
    current_antardasha: Optional[DashaPeriod]
    current_pratyantardasha: Optional[DashaPeriod]
    all_mahadashas: List[DashaPeriod]
    upcoming_periods: List[DashaPeriod]
    karmic_themes: List[str]
```

### 3. Calculation Pipeline

#### Phase 1: Input Validation & Preparation

```python
def _calculate(self, validated_input: VimshottariInput) -> Dict[str, Any]:
    # 1. Combine date and time
    birth_datetime = datetime.combine(
        validated_input.birth_date, 
        validated_input.birth_time
    )
    
    # 2. Extract and validate coordinates
    lat, lon = validated_input.birth_location
    validate_coordinates(lat, lon)
    validate_datetime(birth_datetime)
    
    # 3. Normalize timezone
    tz = pytz.timezone(validated_input.timezone)
```

#### Phase 2: Astronomical Calculation

```python
    # 4. Calculate Vedic astronomical data via Swiss Ephemeris
    vedic_data = self.astro_calc.calculate_vedic_data(
        birth_datetime, lat, lon, validated_input.timezone
    )
    
    # Returns:
    # {
    #   'moon_nakshatra': {
    #       'name': 'Rohini',
    #       'pada': 2,
    #       'degrees_in_nakshatra': 7.5
    #   },
    #   'ayanamsa': 24.12,
    #   'sidereal_positions': {...}
    # }
```

#### Phase 3: Nakshatra Processing

```python
    # 5. Process Moon nakshatra into structured data
    nakshatra_info = self._process_nakshatra(vedic_data['moon_nakshatra'])
    
    # Enriches astronomical data with:
    # - Ruling planet lookup
    # - Symbolic meaning
    # - Deity associations
    # - Characteristic traits
```

#### Phase 4: Timeline Generation

```python
    # 6. Calculate complete Dasha timeline (120 years)
    timeline = self._calculate_dasha_timeline(
        birth_datetime.date(), 
        nakshatra_info, 
        current_date
    )
    
    # Algorithm:
    # a. Calculate balance of first Mahadasha
    # b. Generate subsequent Mahadashas in sequence
    # c. Validate timeline integrity
```

#### Phase 5: Period Identification

```python
    # 7. Find current active periods
    current_periods = self._find_current_periods(timeline, current_date)
    
    # Returns:
    # {
    #   'mahadasha': DashaPeriod(...),
    #   'antardasha': DashaPeriod(...),
    #   'pratyantardasha': DashaPeriod(...)
    # }
    
    # 8. Generate upcoming period list
    upcoming_periods = self._generate_upcoming_periods(
        timeline, current_date, validated_input.years_forecast
    )
```

#### Phase 6: Interpretation & Analysis

```python
    # 9. Analyze karmic themes
    karmic_themes = self._analyze_karmic_themes(
        current_periods, 
        upcoming_periods
    )
    
    # Synthesizes:
    # - Current planetary influences
    # - Life lesson themes
    # - Upcoming transitions
```

### 4. Data Management

#### Static Data Loading

```python
def _load_dasha_data(self):
    """Load reference data at initialization."""
    self.dasha_periods = DASHA_PERIODS  # From vimshottari_models.py
    self.nakshatra_data = NAKSHATRA_DATA
    self.planet_characteristics = PLANET_CHARACTERISTICS
    
    # Build Dasha sequence
    self.dasha_sequence = [
        "Ketu", "Venus", "Sun", "Moon", "Mars", 
        "Rahu", "Jupiter", "Saturn", "Mercury"
    ]
    
    # Build Antardasha sequences (one per Mahadasha planet)
    self.antardasha_sequences = {}
    for planet in self.dasha_sequence:
        start_index = self.dasha_sequence.index(planet)
        sequence = (self.dasha_sequence[start_index:] + 
                    self.dasha_sequence[:start_index])
        self.antardasha_sequences[planet] = sequence
```

#### Static Data Structures

**DASHA_PERIODS** (vimshottari_models.py):
```python
DASHA_PERIODS = {
    "Ketu": 7,
    "Venus": 20,
    "Sun": 6,
    "Moon": 10,
    "Mars": 7,
    "Rahu": 18,
    "Jupiter": 16,
    "Saturn": 19,
    "Mercury": 17
}
```

**NAKSHATRA_DATA** (27 nakshatras):
```python
NAKSHATRA_DATA = {
    "Ashwini": {
        "ruling_planet": "Ketu",
        "symbol": "Horse's Head",
        "deity": "Ashwini Kumaras",
        "nature": "Swift, healing",
        "meaning": "Born of a female horse",
        "characteristics": ["Quick action", "Healing abilities", "Pioneering"]
    },
    # ... 26 more nakshatras
}
```

### 5. Integration with Swiss Ephemeris

#### AstrologyCalculator Wrapper

```python
class AstrologyCalculator:
    """
    Wrapper for Swiss Ephemeris providing Vedic calculations.
    """
    
    def calculate_vedic_data(self, dt, lat, lon, timezone):
        """
        Calculate sidereal positions using Lahiri ayanamsa.
        """
        # Convert to Julian Day
        jd = self._to_julian_day(dt)
        
        # Set sidereal mode
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        
        # Calculate Moon position
        moon_data = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
        moon_longitude = moon_data[0][0]
        
        # Determine nakshatra
        nakshatra_info = self._longitude_to_nakshatra(moon_longitude)
        
        return {
            'moon_nakshatra': nakshatra_info,
            'ayanamsa': swe.get_ayanamsa_ut(jd),
            'julian_day': jd
        }
```

### 6. Output Formatting & Interpretation

#### Structured Text Generation

```python
def _interpret(self, calculation_results, input_data) -> str:
    """
    Generate human-readable interpretation.
    """
    return f"""
🌙 VIMSHOTTARI DASHA TIMELINE ANALYSIS 🌙

═══════════════════════════════════════════════════

🌟 BIRTH NAKSHATRA FOUNDATION
Nakshatra: {nakshatra_info.name} (Pada {nakshatra_info.pada})
Ruling Planet: {nakshatra_info.ruling_planet}
Symbol: {nakshatra_info.symbol}
...

⏰ CURRENT PLANETARY PERIODS
🔥 MAHADASHA: {mahadasha.planet}
Duration: {mahadasha.start_date} to {mahadasha.end_date}
Theme: {mahadasha.general_theme}
...

🔮 UPCOMING MAJOR TRANSITIONS
...

🎭 KARMIC THEMES & LIFE LESSONS
...
"""
```

#### Reality Patches (WitnessOS Protocol)

```python
def _generate_reality_patches(self, calculation_results, input_data) -> List[str]:
    """
    Generate consciousness field adjustment codes.
    """
    patches = []
    
    if 'mahadasha' in current_periods:
        planet = current_periods['mahadasha'].planet
        patches.append(f"PATCH_DASHA_{planet.upper()}: Alignment with {planet} Mahadasha frequency")
    
    patches.extend([
        "PATCH_KARMIC_TIMING: Synchronization with karmic timeline",
        "PATCH_PLANETARY_AWARENESS: Enhanced sensitivity to planetary influences",
        "PATCH_DASHA_NAVIGATION: Improved ability to navigate life transitions"
    ])
    
    return patches
```

### 7. Error Handling & Validation

#### Input Validation Chain

```python
def _validate_input(self, input_data: Any) -> VimshottariInput:
    """
    Validate and normalize input data.
    """
    # Pydantic automatic validation
    validated = self.input_model(**input_data)
    
    # Additional business logic validation
    validate_coordinates(validated.birth_location[0], validated.birth_location[1])
    validate_datetime(datetime.combine(validated.birth_date, validated.birth_time))
    
    # Timezone validation
    try:
        pytz.timezone(validated.timezone)
    except pytz.exceptions.UnknownTimeZoneError:
        raise ValueError(f"Invalid timezone: {validated.timezone}")
    
    return validated
```

#### Calculation Integrity Checks

```python
def _validate_timeline(self, timeline: List[DashaPeriod]):
    """
    Validate timeline integrity.
    """
    # Check total duration
    total_years = sum(p.duration_years for p in timeline)
    assert abs(total_years - 120.0) < 0.01, "Timeline must span 120 years"
    
    # Check continuity
    for i in range(len(timeline) - 1):
        assert timeline[i].end_date == timeline[i+1].start_date, \
            "Timeline must be continuous"
    
    # Check all planets present
    planets = {p.planet for p in timeline}
    assert len(planets) == 9, "All 9 planets must appear"
```

## Performance Considerations

### Caching Strategy

```python
from functools import lru_cache

# Cache Antardasha sequences (deterministic)
@lru_cache(maxsize=9)
def get_antardasha_sequence(mahadasha_planet):
    start_index = DASHA_SEQUENCE.index(mahadasha_planet)
    return DASHA_SEQUENCE[start_index:] + DASHA_SEQUENCE[:start_index]

# Cache nakshatra lookups
@lru_cache(maxsize=27)
def get_nakshatra_data(nakshatra_name):
    return NAKSHATRA_DATA[nakshatra_name]
```

### Lazy Loading

```python
def _calculate_dasha_timeline(self, ...):
    """
    Only calculate timeline once, cache for session.
    """
    if hasattr(self, '_cached_timeline'):
        return self._cached_timeline
    
    timeline = self._generate_timeline(...)
    self._cached_timeline = timeline
    return timeline
```

### Batch Calculations

```python
def calculate_antardashas_batch(mahadasha):
    """
    Calculate all Antardashas in one pass.
    """
    sequence = self.antardasha_sequences[mahadasha.planet]
    total_years = sum(DASHA_PERIODS[p] for p in sequence)
    
    # Vectorized calculation
    durations = [(mahadasha.duration_years * DASHA_PERIODS[p]) / total_years
                 for p in sequence]
    
    # Generate periods
    current_date = mahadasha.start_date
    antardashas = []
    for planet, duration in zip(sequence, durations):
        antardashas.append(create_period(planet, current_date, duration))
        current_date = antardashas[-1].end_date
    
    return antardashas
```

## Extensibility Points

### Custom Interpretation Engines

```python
class CustomInterpretationEngine:
    """
    Plugin for custom interpretation logic.
    """
    def interpret_mahadasha(self, mahadasha: DashaPeriod) -> str:
        pass
    
    def interpret_antardasha(self, antardasha: DashaPeriod) -> str:
        pass

# Integration point
engine.interpretation_engine = CustomInterpretationEngine()
```

### External Data Sources

```python
def _load_dasha_data(self):
    """
    Load from external database if available.
    """
    if self.config.get('use_database'):
        self.nakshatra_data = load_from_database('nakshatra')
    else:
        self.nakshatra_data = NAKSHATRA_DATA
```

## Testing Architecture

### Unit Tests

```python
def test_balance_calculation():
    """Test balance of birth Dasha calculation."""
    nakshatra_info = NakshatraInfo(
        degrees_in_nakshatra=7.5,
        ruling_planet="Moon"
    )
    balance = calculate_balance(nakshatra_info)
    assert abs(balance - 4.375) < 0.001

def test_antardasha_durations():
    """Test Antardasha duration calculations."""
    mahadasha = DashaPeriod(planet="Jupiter", duration_years=16)
    antardashas = calculate_antardashas(mahadasha)
    total = sum(a.duration_years for a in antardashas)
    assert abs(total - 16.0) < 0.001
```

### Integration Tests

```python
def test_full_timeline_generation():
    """Test complete timeline generation."""
    input_data = VimshottariInput(
        birth_date=date(1990, 1, 15),
        birth_time=time(10, 30),
        birth_location=(28.6139, 77.2090),
        timezone="Asia/Kolkata"
    )
    
    engine = VimshottariTimelineMapper()
    output = engine.calculate(input_data)
    
    assert len(output.timeline.all_mahadashas) > 0
    assert output.timeline.current_mahadasha is not None
    assert abs(sum(p.duration_years for p in output.timeline.all_mahadashas) - 120.0) < 0.01
```

## Deployment Considerations

- **Memory**: ~10 MB for loaded data structures
- **CPU**: Minimal after initialization (cached calculations)
- **Dependencies**: Swiss Ephemeris library, Pydantic, pytz
- **Initialization**: ~100ms for data loading
- **Per-calculation**: ~50-200ms depending on forecast years

## Future Enhancements

1. **Database integration** for personalized chart storage
2. **Real-time notification system** for Dasha transitions
3. **Graphical timeline visualization** endpoints
4. **Multi-user caching** with Redis
5. **Advanced interpretation AI** using LLMs
