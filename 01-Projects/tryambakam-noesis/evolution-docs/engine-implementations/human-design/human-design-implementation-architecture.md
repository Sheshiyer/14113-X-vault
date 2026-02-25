# Human Design Implementation Architecture

**System Design and Data Flow Documentation**  
*Extracted from WitnessOS Source Code*

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Data Models](#data-models)
4. [Processing Pipeline](#processing-pipeline)
5. [Astronomical Calculation Layer](#astronomical-calculation-layer)
6. [Engine Implementation](#engine-implementation)
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
│  (CloudflareEngineInput → HumanDesignInput validation)      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Engine Layer                                │
│         (HumanDesignScanner - Business Logic)               │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼─────────────┐
│  Astrology       │    │  Swiss Ephemeris     │
│  Calculator      │    │  Service (optional)  │
│  (Fallback)      │    │  (High Precision)    │
└───────┬──────────┘    └────────┬─────────────┘
        │                         │
        └────────────┬────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Calculation Layer                               │
│  (Gate/Line/Color/Tone, Type, Profile, Centers, Channels)  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Output Layer                                 │
│     (HumanDesignOutput → Formatted Interpretation)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Layers

### 1. Input Validation Layer

**File**: `human_design_models.py`

```python
from pydantic import BaseModel, Field, field_validator
from shared.base.data_models import CloudflareEngineInput, BirthDataInput

class HumanDesignInput(CloudflareEngineInput, BirthDataInput):
    """
    Input model with comprehensive validation.
    
    Inherits from:
    - CloudflareEngineInput: Provides user_id, engine metadata
    - BirthDataInput: Provides birth_date validation
    """
    
    # Required fields
    birth_time: time = Field(
        ..., 
        description="Exact birth time required"
    )
    birth_location: Tuple[float, float] = Field(
        ..., 
        description="[latitude, longitude]"
    )
    timezone: str = Field(
        ..., 
        description="IANA timezone (e.g., 'America/New_York')"
    )
    
    # Optional fields
    include_design_calculation: bool = Field(
        default=True,
        description="Calculate Design (88 days before)"
    )
    detailed_gates: bool = Field(
        default=True,
        description="Include color/tone/base"
    )
    
    @field_validator('birth_time')
    @classmethod
    def validate_birth_time(cls, v):
        if v is None:
            raise ValueError("Birth time required")
        return v
    
    @field_validator('birth_location')
    @classmethod
    def validate_birth_location(cls, v):
        if isinstance(v, (tuple, list)) and len(v) == 2:
            lat, lon = float(v[0]), float(v[1])
            if not (-90 <= lat <= 90):
                raise ValueError("Latitude: -90 to 90")
            if not (-180 <= lon <= 180):
                raise ValueError("Longitude: -180 to 180")
            return (lat, lon)
        raise ValueError("Format: [latitude, longitude]")
```

### 2. Engine Layer

**File**: `human_design.py`

```python
class HumanDesignScanner(BaseEngine):
    """
    Core engine implementing Human Design calculations.
    
    Responsibilities:
    - Input validation
    - Astronomical calculations coordination
    - Gate/Line/Profile/Type determination
    - Output generation
    """
    
    def __init__(self, config=None):
        super().__init__(config)
        
        # Initialize calculators with fallback
        self.astro_calc = AstrologyCalculator()
        
        # Try Swiss Ephemeris (more precise)
        if SWISS_EPHEMERIS_AVAILABLE:
            try:
                self.swiss_calc = SwissEphemerisService()
                logger.info("✅ Swiss Ephemeris initialized")
            except Exception as e:
                logger.warning(f"⚠️ Swiss init failed: {e}")
                self.swiss_calc = None
        else:
            self.swiss_calc = None
            logger.info("ℹ️ Using AstrologyCalculator")
        
        self._load_human_design_data()
    
    @property
    def engine_name(self) -> str:
        return "human_design_scanner"
    
    @property
    def input_model(self) -> Type[BaseEngineInput]:
        return HumanDesignInput
    
    @property
    def output_model(self) -> Type[BaseEngineOutput]:
        return HumanDesignOutput
```

### 3. Calculation Coordination Layer

```python
def _calculate(self, validated_input: HumanDesignInput) -> Dict[str, Any]:
    """
    Main calculation coordinator.
    
    Flow:
    1. Combine birth date + time
    2. Calculate astronomical data (with fallback)
    3. Process personality gates
    4. Process design gates
    5. Determine type/profile/centers
    6. Calculate channels and definition
    7. Compute incarnation cross
    8. Return structured results
    """
    birth_datetime = datetime.combine(
        validated_input.birth_date, 
        validated_input.birth_time
    )
    lat, lon = validated_input.birth_location
    
    # Validate inputs
    validate_coordinates(lat, lon)
    validate_datetime(birth_datetime)
    
    # Calculate with fallback strategy
    if self.swiss_calc is not None:
        try:
            hd_data = self._calculate_with_swiss(
                birth_datetime, lat, lon, validated_input.timezone
            )
            logger.info("✅ Using Swiss Ephemeris")
        except Exception as e:
            logger.warning(f"⚠️ Swiss failed: {e}, using fallback")
            hd_data = self.astro_calc.calculate_human_design_data(
                birth_datetime, lat, lon, validated_input.timezone
            )
    else:
        hd_data = self.astro_calc.calculate_human_design_data(
            birth_datetime, lat, lon, validated_input.timezone
        )
    
    # Extract design datetime (already calculated by AstrologyCalculator)
    design_datetime = hd_data.get('design_datetime')
    
    # Process gates
    personality_gates = self._process_gates(
        hd_data['personality_gates'],
        hd_data['personality_positions'],
        "personality"
    )
    design_gates = self._process_gates(
        hd_data['design_gates'],
        hd_data['design_positions'],
        "design"
    )
    
    # Determine characteristics
    type_info = self._determine_type(personality_gates, design_gates)
    profile = self._calculate_profile(personality_gates, design_gates)
    centers = self._analyze_centers(personality_gates, design_gates)
    defined_channels = self._find_defined_channels(
        personality_gates, design_gates
    )
    definition_type = self._determine_definition_type(
        centers, defined_channels
    )
    incarnation_cross = self._calculate_incarnation_cross(
        personality_gates, design_gates
    )
    
    # Create chart object
    chart = HumanDesignChart(
        type_info=type_info,
        profile=profile,
        personality_gates=personality_gates,
        design_gates=design_gates,
        centers=centers,
        defined_channels=defined_channels,
        definition_type=definition_type,
        incarnation_cross=incarnation_cross
    )
    
    return {
        'birth_info': {...},
        'design_info': {...},
        'chart': chart,
        # ... additional data
    }
```

---

## Data Models

### Python Models (Pydantic)

#### Core Gate Model

```python
class HumanDesignGate(BaseModel):
    """Represents a single gate activation."""
    
    # Position data
    number: int = Field(..., ge=1, le=64)
    name: str = Field(...)
    planet: str = Field(...)
    
    # Subdivisions
    line: int = Field(..., ge=1, le=6)
    color: int = Field(..., ge=1, le=6)
    tone: int = Field(..., ge=1, le=6)
    base: int = Field(..., ge=1, le=5)
    
    # Interpretive data
    keynote: str = Field(default="")
    description: str = Field(default="")
    gift: str = Field(default="")
    shadow: str = Field(default="")
```

#### Center Model

```python
class HumanDesignCenter(BaseModel):
    """Represents one of the nine centers."""
    
    name: str = Field(...)
    defined: bool = Field(...)
    gates: List[int] = Field(default_factory=list)
    
    # Interpretive data
    function: str = Field(default="")
    when_defined: str = Field(default="")
    when_undefined: str = Field(default="")
```

#### Profile Model

```python
class HumanDesignProfile(BaseModel):
    """Represents the profile (conscious/unconscious line combo)."""
    
    personality_line: int = Field(..., ge=1, le=6)
    design_line: int = Field(..., ge=1, le=6)
    profile_name: str = Field(...)
    
    description: str = Field(default="")
    life_theme: str = Field(default="")
    role: str = Field(default="")
```

#### Type Model

```python
class HumanDesignType(BaseModel):
    """Represents the Human Design type."""
    
    type_name: str = Field(...)
    strategy: str = Field(...)
    authority: str = Field(...)
    signature: str = Field(...)
    not_self: str = Field(...)
    percentage: float = Field(...)
    
    description: str = Field(default="")
    life_purpose: str = Field(default="")
```

#### Complete Chart Model

```python
class HumanDesignChart(BaseModel):
    """Complete chart structure."""
    
    type_info: HumanDesignType
    profile: HumanDesignProfile
    
    personality_gates: Dict[str, HumanDesignGate] = Field(
        default_factory=dict
    )
    design_gates: Dict[str, HumanDesignGate] = Field(
        default_factory=dict
    )
    centers: Dict[str, HumanDesignCenter] = Field(
        default_factory=dict
    )
    
    defined_channels: List[str] = Field(default_factory=list)
    definition_type: str = Field(default="")
    incarnation_cross: Dict[str, Any] = Field(default_factory=dict)
    variables: Dict[str, str] = Field(default_factory=dict)
```

#### Output Model

```python
class HumanDesignOutput(CloudflareEngineOutput):
    """Complete output structure."""
    
    # Core chart
    chart: HumanDesignChart = Field(...)
    
    # Metadata
    birth_info: Dict[str, Any] = Field(default_factory=dict)
    design_info: Dict[str, Any] = Field(default_factory=dict)
    
    # Interpretations
    type_analysis: str = Field(default="")
    profile_analysis: str = Field(default="")
    centers_analysis: str = Field(default="")
    gates_analysis: str = Field(default="")
    
    # Guidance
    strategy_guidance: str = Field(default="")
    authority_guidance: str = Field(default="")
    deconditioning_guidance: str = Field(default="")
```

### TypeScript Models (Target)

```typescript
// Gate interface
interface HumanDesignGate {
  number: number;  // 1-64
  name: string;
  planet: string;
  line: number;    // 1-6
  color: number;   // 1-6
  tone: number;    // 1-6
  base: number;    // 1-5
  keynote: string;
  description: string;
  gift: string;
  shadow: string;
}

// Center interface
interface HumanDesignCenter {
  name: string;
  defined: boolean;
  gates: number[];
  function: string;
  when_defined: string;
  when_undefined: string;
}

// Profile interface
interface HumanDesignProfile {
  personality_line: number;
  design_line: number;
  profile_name: string;
  description: string;
  life_theme: string;
  role: string;
}

// Type interface
interface HumanDesignType {
  type_name: string;
  strategy: string;
  authority: string;
  signature: string;
  not_self: string;
  percentage: number;
  description: string;
  life_purpose: string;
}

// Complete Chart
interface HumanDesignChart {
  type_info: HumanDesignType;
  profile: HumanDesignProfile;
  personality_gates: Record<string, HumanDesignGate>;
  design_gates: Record<string, HumanDesignGate>;
  centers: Record<string, HumanDesignCenter>;
  defined_channels: string[];
  definition_type: string;
  incarnation_cross: {
    name: string;
    type: string;
    gates: {
      conscious_sun: number;
      conscious_earth: number;
      unconscious_sun: number;
      unconscious_earth: number;
    };
    theme: string;
    description: string;
  };
  variables: Record<string, string>;
}

// Input interface
interface HumanDesignInput {
  birth_date: string;      // ISO 8601 date
  birth_time: string;      // HH:MM format
  birth_location: [number, number];  // [lat, lon]
  timezone: string;        // IANA timezone
  include_design_calculation?: boolean;
  detailed_gates?: boolean;
}

// Output interface
interface HumanDesignOutput {
  engine_name: string;
  calculation_time: number;
  confidence_score: number;
  chart: HumanDesignChart;
  birth_info: {
    datetime: string;
    location: [number, number];
    timezone: string;
  };
  design_info: {
    datetime: string;
    calculation_method: string;
  };
  type_analysis: string;
  profile_analysis: string;
  centers_analysis: string;
  gates_analysis: string;
  strategy_guidance: string;
  authority_guidance: string;
  deconditioning_guidance: string;
}
```

---

## Processing Pipeline

### Full Calculation Flow

```python
def calculate(self, input_data: Any) -> HumanDesignOutput:
    """
    Complete calculation pipeline.
    
    Steps:
    1. Validate input
    2. Start timing
    3. Calculate astronomical data
    4. Process gates
    5. Determine type/profile/centers
    6. Generate interpretation
    7. Generate recommendations
    8. Create output
    9. Update statistics
    """
    start_time = start_timer()
    
    try:
        # Step 1: Validate
        validated_input = self._validate_input(input_data)
        logger.info(f"Starting calculation for {self.engine_name}")
        
        # Step 2-5: Core calculation
        calculation_results = self._calculate(validated_input)
        
        # Step 6: Interpretation
        interpretation = self._interpret(
            calculation_results, 
            validated_input
        )
        
        # Step 7: Additional insights
        recommendations = self._generate_recommendations(
            calculation_results, 
            validated_input
        )
        reality_patches = self._generate_reality_patches(
            calculation_results,
            validated_input
        )
        archetypal_themes = self._identify_archetypal_themes(
            calculation_results,
            validated_input
        )
        
        # Calculate confidence
        confidence = self._calculate_confidence(
            calculation_results,
            validated_input
        )
        
        # Step 8: Timing
        calculation_time = end_timer(start_time)
        
        # Generate field signature
        field_signature = create_field_signature(
            self.engine_name,
            str(validated_input),
            datetime.now().isoformat()
        )
        
        # Step 9: Create output
        output = HumanDesignOutput(
            engine_name=self.engine_name,
            calculation_time=calculation_time,
            confidence_score=confidence,
            raw_data=calculation_results,
            formatted_output=interpretation,
            recommendations=recommendations,
            field_signature=field_signature,
            reality_patches=reality_patches,
            archetypal_themes=archetypal_themes,
            chart=calculation_results['chart'],
            birth_info=calculation_results['birth_info'],
            design_info=calculation_results['design_info']
        )
        
        # Update stats
        self._last_calculation_time = calculation_time
        self._total_calculations += 1
        
        logger.info(f"Completed in {calculation_time:.4f}s")
        return output
        
    except Exception as e:
        calculation_time = end_timer(start_time)
        logger.error(f"Failed after {calculation_time:.4f}s: {e}")
        raise EngineError(f"Calculation failed: {e}")
```

### Gate Processing Pipeline

```python
def _process_gates(
    self, 
    gate_numbers: Dict[str, int],
    positions: Dict[str, Dict], 
    gate_type: str
) -> Dict[str, HumanDesignGate]:
    """
    Process planetary positions into gate objects.
    
    For each planet:
    1. Get gate number (from calculator)
    2. Get position data
    3. Calculate line from longitude
    4. Calculate color/tone/base
    5. Load gate interpretive data
    6. Create HumanDesignGate object
    """
    processed_gates = {}
    
    for planet, gate_num in gate_numbers.items():
        if gate_num not in self.gate_data:
            continue
            
        if planet not in positions:
            continue
        
        # Get adjusted longitude
        longitude = positions[planet]['longitude']
        
        # Calculate subdivisions
        line = self._calculate_line(longitude, gate_num)
        color = self._calculate_color(longitude, gate_num)
        tone = self._calculate_tone(longitude, gate_num)
        base = self._calculate_base(longitude, gate_num)
        
        # Load interpretive data
        gate_data = self.gate_data[gate_num]
        
        # Create gate object
        processed_gates[planet] = HumanDesignGate(
            number=gate_num,
            name=gate_data['name'],
            planet=planet,
            line=line,
            color=color,
            tone=tone,
            base=base,
            keynote=gate_data['keynote'],
            description=gate_data['description'],
            gift=gate_data['gift'],
            shadow=gate_data['shadow']
        )
    
    return processed_gates
```

---

## Astronomical Calculation Layer

### Dual Calculator System

#### Primary: Swiss Ephemeris (High Precision)

```python
class SwissEphemerisService:
    """
    High-precision astronomical calculations using Swiss Ephemeris.
    
    Precision: ±0.0001°
    Source: JPL ephemeris data
    """
    
    def calculate_positions(
        self, 
        birth_date: str, 
        birth_time: str,
        location: List[float]
    ) -> Dict[str, Any]:
        """Calculate planetary positions at exact moment."""
        import swisseph as swe
        
        # Parse input
        dt = datetime.strptime(
            f"{birth_date} {birth_time}", 
            "%Y-%m-%d %H:%M"
        )
        lat, lon = location
        
        # Convert to Julian Day
        jd = swe.julday(
            dt.year, dt.month, dt.day,
            dt.hour + dt.minute / 60.0
        )
        
        # Calculate for each planet
        planets = {
            'SUN': swe.SUN,
            'MOON': swe.MOON,
            'MERCURY': swe.MERCURY,
            'VENUS': swe.VENUS,
            'MARS': swe.MARS,
            'JUPITER': swe.JUPITER,
            'SATURN': swe.SATURN,
            'URANUS': swe.URANUS,
            'NEPTUNE': swe.NEPTUNE,
            'PLUTO': swe.PLUTO,
            'NORTH_NODE': swe.MEAN_NODE,
        }
        
        results = {}
        for planet_name, planet_id in planets.items():
            # Calculate position
            position = swe.calc_ut(jd, planet_id)
            longitude = position[0]
            
            # Calculate Human Design gate
            gate_info = self._calculate_gate(longitude)
            
            results[planet_name] = {
                'longitude': longitude,
                'latitude': position[1],
                'distance': position[2],
                'speed': position[3],
                'human_design_gate': gate_info
            }
        
        # Calculate Earth (opposite Sun)
        results['EARTH'] = {
            'longitude': (results['SUN']['longitude'] + 180) % 360,
            'human_design_gate': self._calculate_gate(
                (results['SUN']['longitude'] + 180) % 360
            )
        }
        
        return {
            'personality': results,
            'design': self._calculate_design(dt, location),
            'success': True
        }
```

#### Fallback: AstrologyCalculator

```python
class AstrologyCalculator:
    """
    Fallback astronomical calculator.
    
    Precision: ±0.01°
    Uses simplified orbital mechanics
    """
    
    def calculate_human_design_data(
        self,
        birth_datetime: datetime,
        latitude: float,
        longitude: float,
        timezone: str
    ) -> Dict[str, Any]:
        """Calculate HD data with fallback method."""
        
        # Calculate personality (birth moment)
        personality_data = self._calculate_moment(
            birth_datetime, latitude, longitude
        )
        
        # Calculate design (88° solar arc before)
        design_datetime = self._calculate_design_time(
            birth_datetime, latitude, longitude
        )
        design_data = self._calculate_moment(
            design_datetime, latitude, longitude
        )
        
        return {
            'personality_gates': personality_data['gates'],
            'personality_positions': personality_data['positions'],
            'design_gates': design_data['gates'],
            'design_positions': design_data['positions'],
            'design_datetime': design_datetime,
            'solar_arc_details': {
                'method': '88_degree_solar_arc',
                'days_difference': (
                    birth_datetime - design_datetime
                ).days,
                'actual_degrees': self._calculate_solar_arc(
                    birth_datetime, design_datetime
                )
            }
        }
```

---

## Caching Strategy

### Multi-Level Cache

```python
class HumanDesignInput(CloudflareEngineInput):
    """Input with cache key generation."""
    
    def get_engine_kv_keys(self) -> Dict[str, str]:
        """Generate KV store keys."""
        engine_name = "humandesign"
        return {
            'reading': self.generate_user_key(
                engine_name, 'reading'
            ),
            'analysis': self.generate_user_key(
                engine_name, 'analysis'
            ),
            'cache': self.generate_cache_key(engine_name),
            'metadata': f"user:{self.user_id}:{engine_name}:metadata"
        }
    
    def generate_cache_key(self, engine_name: str) -> str:
        """
        Generate deterministic cache key.
        
        Key format: engine:hash(birth_data)
        
        Same birth data = same key = cache hit
        """
        import hashlib
        
        # Normalize birth data to seconds precision
        cache_data = f"{self.birth_date}|{self.birth_time}|" \
                    f"{self.birth_location[0]:.4f}|" \
                    f"{self.birth_location[1]:.4f}|" \
                    f"{self.timezone}"
        
        hash_key = hashlib.sha256(
            cache_data.encode()
        ).hexdigest()[:16]
        
        return f"{engine_name}:cache:{hash_key}"
```

### Cache Lookup Flow

```
Request → Check KV Cache → [HIT] Return cached result
                         → [MISS] Calculate → Store in KV → Return result
```

### Cache Implementation

```python
async def get_cached_reading(
    self, 
    cache_key: str
) -> Optional[HumanDesignOutput]:
    """
    Retrieve cached reading from Cloudflare KV.
    
    Cache TTL: 30 days (birth data doesn't change)
    """
    try:
        cached_data = await self.kv_store.get(cache_key)
        if cached_data:
            logger.info(f"Cache HIT: {cache_key}")
            return HumanDesignOutput(**json.loads(cached_data))
        logger.info(f"Cache MISS: {cache_key}")
        return None
    except Exception as e:
        logger.warning(f"Cache error: {e}")
        return None

async def store_reading(
    self, 
    cache_key: str, 
    output: HumanDesignOutput
):
    """Store reading in KV cache."""
    try:
        await self.kv_store.put(
            cache_key,
            output.json(),
            expiration_ttl=2592000  # 30 days
        )
        logger.info(f"Cached: {cache_key}")
    except Exception as e:
        logger.error(f"Cache store error: {e}")
```

---

## Error Handling

### Exception Hierarchy

```python
class EngineError(Exception):
    """Base exception for engine errors."""
    pass

class ValidationError(EngineError):
    """Input validation failed."""
    pass

class CalculationError(EngineError):
    """Calculation failed."""
    pass

class AstronomicalDataError(CalculationError):
    """Astronomical calculation failed."""
    pass
```

### Error Handling Strategy

```python
def _calculate(self, validated_input: HumanDesignInput) -> Dict:
    """Calculate with comprehensive error handling."""
    
    try:
        # Attempt Swiss Ephemeris
        if self.swiss_calc:
            try:
                hd_data = self._calculate_with_swiss(...)
            except Exception as swiss_error:
                logger.warning(
                    f"Swiss Ephemeris failed: {swiss_error}, "
                    f"falling back to AstrologyCalculator"
                )
                # Fallback to AstrologyCalculator
                hd_data = self.astro_calc.calculate_human_design_data(...)
        else:
            hd_data = self.astro_calc.calculate_human_design_data(...)
        
        # Validate calculation results
        if not hd_data or not hd_data.get('personality_gates'):
            raise CalculationError("Invalid astronomical data")
        
        # Process with validation at each step
        personality_gates = self._process_gates(...)
        if not personality_gates:
            raise CalculationError("Failed to process personality gates")
        
        # ... continue with validated data
        
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        raise
    except CalculationError as e:
        logger.error(f"Calculation error: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise EngineError(f"Calculation failed: {e}")
```

---

## Type Conversions

### Python to TypeScript

```python
# Python datetime → ISO 8601 string
birth_datetime: datetime = datetime(2000, 1, 1, 12, 30)
iso_string: str = birth_datetime.isoformat()  # "2000-01-01T12:30:00"

# Python tuple → JSON array
location: Tuple[float, float] = (40.7128, -74.0060)
json_location: str = json.dumps(location)  # "[40.7128, -74.006]"

# Pydantic model → JSON
chart: HumanDesignChart = ...
json_chart: str = chart.json()  # Serialized JSON
dict_chart: dict = chart.dict()  # Python dict
```

### TypeScript to Python

```typescript
// TypeScript request
const request: HumanDesignInput = {
  birth_date: "2000-01-01",
  birth_time: "12:30",
  birth_location: [40.7128, -74.0060],
  timezone: "America/New_York"
};

// Send to Python API
const response = await fetch('/api/human-design', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});

const output: HumanDesignOutput = await response.json();
```

---

## Performance Optimization

### Calculation Time Breakdown

```
Total Time: ~200-500ms
├── Input validation: 5-10ms
├── Astronomical calculation: 100-300ms
│   ├── Swiss Ephemeris: 100-150ms (precise)
│   └── AstrologyCalculator: 200-300ms (fallback)
├── Gate processing: 20-40ms
├── Type/Profile/Centers: 10-20ms
├── Channel analysis: 15-25ms
├── Interpretation generation: 30-50ms
└── Output serialization: 10-20ms
```

### Optimization Strategies

#### 1. Pre-load Reference Data

```python
def __init__(self):
    """Load data once at initialization."""
    self._load_human_design_data()  # Load gates, channels, crosses
    self._cache_wheel_sequence()    # Pre-compute wheel lookups
```

#### 2. Batch Calculations

```python
def _process_all_gates(self, positions: Dict) -> Dict:
    """Process all planetary positions in one pass."""
    # Instead of calculating line/color/tone separately,
    # calculate all subdivisions at once
    pass
```

#### 3. Lazy Loading

```python
@property
def gate_data(self) -> Dict:
    """Load gate data on first access."""
    if not hasattr(self, '_gate_data_cache'):
        self._gate_data_cache = load_json_data(...)
    return self._gate_data_cache
```

#### 4. Parallel Processing

```python
import asyncio

async def calculate_both_moments(self, birth, design):
    """Calculate personality and design in parallel."""
    personality_task = asyncio.create_task(
        self._calculate_moment(birth)
    )
    design_task = asyncio.create_task(
        self._calculate_moment(design)
    )
    
    personality, design = await asyncio.gather(
        personality_task, design_task
    )
    return personality, design
```

---

## Dependencies

### Required Packages

```python
# Core
pydantic >= 2.0.0          # Data validation
python-dateutil >= 2.8.0   # Date parsing
pytz >= 2023.3             # Timezone handling

# Astronomical calculations
pyswisseph >= 2.10.0       # Swiss Ephemeris (optional, recommended)
skyfield >= 1.46           # Fallback astronomy library

# Utilities
typing-extensions >= 4.0.0  # Type hints
```

### Installation

```bash
# Minimal (uses fallback calculator)
pip install pydantic python-dateutil pytz skyfield

# Recommended (uses Swiss Ephemeris)
pip install pydantic python-dateutil pytz pyswisseph

# Full development
pip install -r requirements.txt
```

---

## Deployment Architecture

### Cloudflare Workers

```javascript
// worker.js
export default {
  async fetch(request, env) {
    // Parse request
    const input = await request.json();
    
    // Check cache
    const cacheKey = generateCacheKey(input);
    const cached = await env.KV.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Call Python engine (via Durable Object or external API)
    const result = await calculateHumanDesign(input);
    
    // Store in cache
    await env.KV.put(cacheKey, JSON.stringify(result), {
      expirationTtl: 2592000  // 30 days
    });
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

---

## References

1. WitnessOS Source Code - `human_design.py`, `human_design_models.py`
2. Pydantic Documentation - Data validation
3. Swiss Ephemeris Documentation - Astronomical calculations
4. Cloudflare Workers KV - Caching layer

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Source**: WitnessOS Engine Architecture  
**Lines of Code**: 756 (human_design.py) + 273 (models)
