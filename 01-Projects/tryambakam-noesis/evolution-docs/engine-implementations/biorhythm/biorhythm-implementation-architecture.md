# Biorhythm Implementation Architecture

> **Complete architectural specification for WitnessOS Biorhythm Synchronizer Engine**  
> Extracted from: `biorhythm.py` & `biorhythm_models.py`

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Core Components](#core-components)
3. [Data Flow Pipeline](#data-flow-pipeline)
4. [Calculation Engine](#calculation-engine)
5. [Data Models & Type System](#data-models--type-system)
6. [Visualization Data Structure](#visualization-data-structure)
7. [Timeline Calculation System](#timeline-calculation-system)
8. [Interpretation Layer](#interpretation-layer)
9. [Caching & Performance](#caching--performance)
10. [Error Handling & Validation](#error-handling--validation)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATION                        │
│  (Frontend, API Consumer, CLI Interface)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BIORHYTHM ENGINE API                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Input Validation & Sanitization              │  │
│  │         (BiorhythmInput, Pydantic Models)            │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BIORHYTHM ENGINE (Core Logic)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Sine Wave Calculator (BiorhythmCalculator)          │  │
│  │    • Physical Cycle (23 days)                        │  │
│  │    • Emotional Cycle (28 days)                       │  │
│  │    • Intellectual Cycle (33 days)                    │  │
│  │    • Extended Cycles (optional)                      │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │  Analysis Pipeline                                   │  │
│  │    • Phase Classification                            │  │
│  │    • Critical Day Detection                          │  │
│  │    • Energy Level Computation                        │  │
│  │    • Trend Analysis                                  │  │
│  │    • Synchronization Scoring                         │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │  Interpretation Engine                               │  │
│  │    • Mystical Narrative Generation                   │  │
│  │    • Actionable Recommendations                      │  │
│  │    • Reality Patches (WitnessOS)                     │  │
│  │    • Archetypal Theme Mapping                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                OUTPUT LAYER (BiorhythmOutput)                │
│  • Structured Data (JSON-serializable)                      │
│  • Formatted Interpretation Text                            │
│  • Visualization Data (Chart Coordinates)                   │
│  • Metadata & Confidence Scores                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Dependencies

```
BiorhythmEngine
    ├── BaseEngine (shared.base.engine_interface)
    ├── BiorhythmCalculator (shared.calculations.biorhythm)
    │   ├── Core Cycle Calculator
    │   └── Extended Cycle Calculator
    ├── BiorhythmInput (biorhythm_models.py)
    ├── BiorhythmOutput (biorhythm_models.py)
    └── Interpretation System
        ├── Phase Meanings
        ├── Cycle Guidance
        └── Energy Interpretations
```

### 1.3 Design Principles

1. **Separation of Concerns:** Calculation, interpretation, and formatting are distinct layers
2. **Type Safety:** Pydantic models ensure data integrity throughout pipeline
3. **Composability:** Calculator can be used standalone or within engine
4. **Extensibility:** Easy to add new cycles or interpretation methods
5. **Performance:** Calculations optimized for batch processing

---

## 2. Core Components

### 2.1 BiorhythmEngine Class

**Primary Interface for Biorhythm Calculations**

```python
class BiorhythmEngine(BaseEngine):
    """
    WitnessOS Biorhythm Synchronizer Engine
    
    Synchronizes consciousness with natural biological rhythms through 
    mathematical analysis of physical, emotional, and intellectual cycles.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the Biorhythm engine.
        
        Args:
            config: Optional configuration dictionary
        """
        super().__init__(config)
        
        # Initialize calculators
        self.core_calc = BiorhythmCalculator(include_extended_cycles=False)
        self.extended_calc = BiorhythmCalculator(include_extended_cycles=True)
        
        # Load interpretation data
        self._load_interpretations()
    
    @property
    def engine_name(self) -> str:
        return "biorhythm"
    
    @property
    def description(self) -> str:
        return "Biological rhythm synchronization and energy field optimization"
    
    @property
    def input_model(self):
        return BiorhythmInput
    
    @property
    def output_model(self):
        return BiorhythmOutput
```

**Key Responsibilities:**
- Input validation and sanitization
- Calculator orchestration
- Interpretation generation
- Output formatting
- Error handling

### 2.2 BiorhythmCalculator

**Mathematical Engine for Sine Wave Calculations**

```python
class BiorhythmCalculator:
    """
    Core calculator for biorhythm sine wave generation.
    Handles both core and extended cycles.
    """
    
    def __init__(self, include_extended_cycles: bool = False):
        self.include_extended_cycles = include_extended_cycles
        
        # Define cycle periods
        self.core_periods = {
            'physical': 23,
            'emotional': 28,
            'intellectual': 33
        }
        
        self.extended_periods = {
            'intuitive': 38,
            'aesthetic': 43,
            'spiritual': 53
        }
    
    def calculate_biorhythm_snapshot(
        self, 
        birth_date: date, 
        target_date: date
    ) -> BiorhythmSnapshot:
        """
        Calculate complete biorhythm state for a single date.
        
        Returns:
            BiorhythmSnapshot with all cycle data
        """
        pass
    
    def generate_forecast(
        self,
        birth_date: date,
        start_date: date,
        forecast_days: int
    ) -> List[BiorhythmSnapshot]:
        """
        Generate time-series forecast for specified days.
        
        Returns:
            List of BiorhythmSnapshot objects
        """
        pass
    
    def find_critical_days(
        self,
        birth_date: date,
        start_date: date,
        forecast_days: int
    ) -> List[date]:
        """
        Identify all critical days in date range.
        
        Returns:
            List of critical day dates
        """
        pass
```

### 2.3 Interpretation System

**Mystical Narrative Generator**

```python
class InterpretationSystem:
    """
    Generates human-readable biorhythm interpretations.
    Converts mathematical data into actionable insights.
    """
    
    def __init__(self):
        self.phase_meanings = {
            'critical': "Zero-point transition - heightened sensitivity",
            'rising': "Ascending energy - building strength",
            'peak': "Maximum potential - optimal performance",
            'falling': "Descending energy - natural decline",
            'valley': "Minimum energy - recovery period"
        }
        
        self.cycle_guidance = {
            'physical': {...},
            'emotional': {...},
            'intellectual': {...}
        }
        
        self.energy_interpretations = {
            (75, 100): "Exceptional vitality",
            (50, 75): "High energy",
            # ... more ranges
        }
```

---

## 3. Data Flow Pipeline

### 3.1 Complete Execution Flow

```
1. INPUT STAGE
   ┌──────────────────────────────────────┐
   │ User provides:                       │
   │  • birth_date                        │
   │  • target_date (optional)            │
   │  • include_extended_cycles           │
   │  • forecast_days                     │
   └────────────┬─────────────────────────┘
                │
                ▼
2. VALIDATION STAGE
   ┌──────────────────────────────────────┐
   │ Pydantic validation:                 │
   │  • Date range checks                 │
   │  • Birth date < today                │
   │  • Forecast days: 1-90               │
   │  • Target date max 1 year future     │
   └────────────┬─────────────────────────┘
                │
                ▼
3. CALCULATION STAGE
   ┌──────────────────────────────────────┐
   │ A. Calculate Days Alive              │
   │    days_alive = target - birth       │
   │                                      │
   │ B. Sine Wave Generation              │
   │    physical = sin(2π·days/23)        │
   │    emotional = sin(2π·days/28)       │
   │    intellectual = sin(2π·days/33)    │
   │    [+ extended if enabled]           │
   │                                      │
   │ C. Phase Classification              │
   │    Determine: critical/peak/valley/  │
   │              rising/falling          │
   │                                      │
   │ D. Critical Day Detection            │
   │    Check if 2+ cycles near zero      │
   │                                      │
   │ E. Overall Energy Calculation        │
   │    avg(all_cycle_percentages)        │
   │                                      │
   │ F. Trend Analysis                    │
   │    Determine: ascending/descending/  │
   │              mixed/stable            │
   └────────────┬─────────────────────────┘
                │
                ▼
4. FORECAST STAGE
   ┌──────────────────────────────────────┐
   │ For each day in forecast:            │
   │  • Repeat calculations 3.A-3.F       │
   │  • Store in snapshot list            │
   │                                      │
   │ Analyze forecast:                    │
   │  • Identify best days (energy>50)    │
   │  • Identify challenging days (<-25)  │
   │  • List all critical days            │
   └────────────┬─────────────────────────┘
                │
                ▼
5. INTERPRETATION STAGE
   ┌──────────────────────────────────────┐
   │ A. Generate Mystical Narrative       │
   │    • Energy field analysis           │
   │    • Cycle harmonics description     │
   │    • Synchronization status          │
   │    • Critical day warnings           │
   │    • Optimization guidance           │
   │                                      │
   │ B. Generate Recommendations          │
   │    • Phase-specific actions          │
   │    • Energy management tips          │
   │    • Timing suggestions              │
   │                                      │
   │ C. Generate Reality Patches          │
   │    • WitnessOS-specific upgrades     │
   │    • Consciousness protocol patches  │
   │                                      │
   │ D. Identify Archetypal Themes        │
   │    • Warrior/Artist/Sage mapping     │
   │    • Transformer/Phoenix themes      │
   └────────────┬─────────────────────────┘
                │
                ▼
6. OUTPUT STAGE
   ┌──────────────────────────────────────┐
   │ BiorhythmOutput object containing:   │
   │  • Raw calculation data              │
   │  • Formatted interpretation text     │
   │  • Cycle percentages & phases        │
   │  • Critical days list                │
   │  • Forecast summary                  │
   │  • Recommendations list              │
   │  • Reality patches                   │
   │  • Archetypal themes                 │
   │  • Metadata (confidence, timing)     │
   └──────────────────────────────────────┘
```

### 3.2 Processing Timeline

```
┌────────────────────────────────────────────────────┐
│ STAGE                    │ TYPICAL DURATION        │
├────────────────────────────────────────────────────┤
│ Input Validation         │ < 1ms                   │
│ Days Alive Calculation   │ < 1ms                   │
│ Sine Wave Calculation    │ 1-5ms (per day)         │
│ Phase Classification     │ < 1ms (per cycle)       │
│ Critical Day Detection   │ 1-10ms (per day range)  │
│ Energy Computation       │ < 1ms                   │
│ Forecast Generation      │ 10-100ms (7-90 days)    │
│ Interpretation Gen       │ 5-20ms                  │
│ Output Serialization     │ 1-5ms                   │
├────────────────────────────────────────────────────┤
│ TOTAL (typical)          │ 20-150ms                │
└────────────────────────────────────────────────────┘
```

---

## 4. Calculation Engine

### 4.1 Sine Wave Generation Pipeline

**Step-by-Step Process:**

```python
def calculate_cycle_value(days_alive: int, period: int) -> float:
    """
    Core sine wave calculation function.
    
    Mathematical Formula:
        value = 100 * sin(2π * days_alive / period)
    
    Args:
        days_alive: Days from birth to target date
        period: Cycle period in days (23/28/33/etc)
    
    Returns:
        Percentage value from -100 to +100
    """
    import math
    
    # Calculate radians
    radians = (2 * math.pi * days_alive) / period
    
    # Calculate sine and scale to percentage
    sine_value = math.sin(radians)
    percentage = 100 * sine_value
    
    return percentage
```

**Optimization Notes:**
- Uses native Python `math.sin()` for precision
- No caching needed - calculation is fast (< 1μs)
- Can be vectorized for batch processing

### 4.2 Phase Classification Engine

**Algorithm Implementation:**

```python
def classify_phase(
    percentage: float, 
    days_alive: int, 
    period: int
) -> str:
    """
    Classify cycle phase based on percentage and derivative.
    
    Phase Thresholds:
        Critical: |percentage| ≤ 2
        Peak: percentage > 85
        Valley: percentage < -85
        Rising/Falling: determined by derivative
    
    Returns:
        Phase name: 'critical', 'peak', 'valley', 'rising', 'falling'
    """
    import math
    
    # Critical phase (near zero)
    if abs(percentage) <= 2:
        return 'critical'
    
    # Peak phase
    if percentage > 85:
        return 'peak'
    
    # Valley phase
    if percentage < -85:
        return 'valley'
    
    # Calculate derivative to determine rising or falling
    radians = (2 * math.pi * days_alive) / period
    derivative = (200 * math.pi / period) * math.cos(radians)
    
    # Determine direction
    if derivative > 0:
        return 'rising'
    else:
        return 'falling'
```

### 4.3 Critical Day Detection Engine

**Multi-Cycle Analysis:**

```python
def is_critical_day(cycle_percentages: Dict[str, float]) -> bool:
    """
    Detect if current day is a critical day.
    
    Critical Day Criteria:
        2 or more cycles are within ±2% of zero
    
    Args:
        cycle_percentages: Dict of cycle names to percentages
    
    Returns:
        True if critical day, False otherwise
    """
    core_cycles = ['physical', 'emotional', 'intellectual']
    critical_threshold = 2.0
    
    # Count cycles in critical zone
    critical_count = sum(
        1 for cycle_name in core_cycles
        if cycle_name in cycle_percentages 
        and abs(cycle_percentages[cycle_name]) <= critical_threshold
    )
    
    return critical_count >= 2
```

**Batch Critical Day Finding:**

```python
def find_critical_days_batch(
    birth_date: date,
    start_date: date,
    end_date: date
) -> List[date]:
    """
    Efficiently find all critical days in date range.
    
    Uses optimized batch processing to minimize overhead.
    """
    critical_dates = []
    current_date = start_date
    
    while current_date <= end_date:
        days_alive = (current_date - birth_date).days
        
        # Calculate all core cycles
        cycles = {
            'physical': calculate_cycle_value(days_alive, 23),
            'emotional': calculate_cycle_value(days_alive, 28),
            'intellectual': calculate_cycle_value(days_alive, 33)
        }
        
        # Check if critical
        if is_critical_day(cycles):
            critical_dates.append(current_date)
        
        current_date += timedelta(days=1)
    
    return critical_dates
```

### 4.4 Energy Level Computation

**Aggregate Energy Calculator:**

```python
def calculate_overall_energy(
    cycle_percentages: Dict[str, float]
) -> float:
    """
    Calculate overall energy level from all active cycles.
    
    Formula:
        energy = average(all_cycle_percentages)
    
    Args:
        cycle_percentages: Dictionary of cycle percentages
    
    Returns:
        Overall energy percentage (-100 to +100)
    """
    if not cycle_percentages:
        return 0.0
    
    total = sum(cycle_percentages.values())
    count = len(cycle_percentages)
    
    return total / count
```

---

## 5. Data Models & Type System

### 5.1 Input Model: BiorhythmInput

**Complete TypeScript Interface:**

```typescript
interface BiorhythmInput {
  // User identification (from CloudflareEngineInput)
  user_id: string;
  session_id?: string;
  
  // Core biorhythm parameters
  birth_date: string;  // ISO 8601 date format: "YYYY-MM-DD"
  target_date?: string | null;  // Defaults to today
  include_extended_cycles: boolean;  // Default: false
  forecast_days: number;  // Range: 1-90, Default: 7
  
  // Optional metadata
  timezone?: string;
  request_timestamp?: string;
}
```

**Validation Rules:**

```python
class BiorhythmInput(CloudflareEngineInput):
    """Pydantic model with automatic validation."""
    
    birth_date: date = Field(..., description="Date of birth")
    target_date: Optional[date] = Field(None, description="Target date")
    include_extended_cycles: bool = Field(default=False)
    forecast_days: int = Field(default=7, ge=1, le=90)
    
    @field_validator('birth_date')
    @classmethod
    def validate_birth_date(cls, v):
        current_date = date.today()
        
        # Cannot be in future
        if v > current_date:
            raise ValueError("Birth date cannot be in the future")
        
        # Minimum year 1900
        if v.year < 1900:
            raise ValueError("Birth year must be 1900 or later")
        
        # Maximum age 150 years
        if (current_date - v).days > 150 * 365:
            raise ValueError("Birth date too far in the past (max 150 years)")
        
        return v
    
    @field_validator('target_date')
    @classmethod
    def validate_target_date(cls, v):
        if v is not None:
            current_date = date.today()
            max_future = current_date + timedelta(days=365)
            
            # Cannot be more than 1 year in future
            if v > max_future:
                raise ValueError("Target date cannot be > 1 year in future")
            
            # Minimum year 1900
            if v.year < 1900:
                raise ValueError("Target date must be 1900 or later")
        
        return v
```

### 5.2 Output Model: BiorhythmOutput

**Complete TypeScript Interface:**

```typescript
interface BiorhythmOutput {
  // Base engine output fields
  engine_name: string;  // "biorhythm"
  calculation_time: number;  // Seconds
  confidence_score: number;  // 0.0 - 1.0
  raw_data: any;  // Complete calculation results
  formatted_output: string;  // Mystical interpretation text
  recommendations: string[];
  field_signature: string;  // Unique identifier
  reality_patches: string[];  // WitnessOS patches
  archetypal_themes: string[];
  
  // Biorhythm-specific fields
  birth_date: string;  // ISO 8601
  target_date: string;  // ISO 8601
  days_alive: number;
  
  // Core cycle percentages
  physical_percentage: number;  // -100 to +100
  emotional_percentage: number;
  intellectual_percentage: number;
  
  // Extended cycle percentages (nullable)
  intuitive_percentage?: number | null;
  aesthetic_percentage?: number | null;
  spiritual_percentage?: number | null;
  
  // Cycle phases
  physical_phase: PhaseType;
  emotional_phase: PhaseType;
  intellectual_phase: PhaseType;
  
  // Overall metrics
  overall_energy: number;  // -100 to +100
  critical_day: boolean;
  trend: TrendType;
  
  // Detailed information
  cycle_details: Record<string, CycleDetail>;
  critical_days_ahead: string[];  // ISO 8601 dates
  forecast_summary: ForecastSummary;
  best_days_ahead: string[];
  challenging_days_ahead: string[];
  
  // Energy optimization
  energy_optimization: Record<string, string>;
  cycle_synchronization: SynchronizationData;
}

// Supporting types
type PhaseType = 'critical' | 'rising' | 'peak' | 'falling' | 'valley';
type TrendType = 'ascending' | 'descending' | 'mixed' | 'stable';

interface CycleDetail {
  percentage: number;
  phase: PhaseType;
  days_to_peak: number;
  days_to_valley: number;
  next_critical: string;  // ISO 8601 date
}

interface ForecastSummary {
  total_days: number;
  critical_days_count: number;
  best_days_count: number;
  challenging_days_count: number;
  average_energy: number;
}

interface SynchronizationData {
  aligned_cycles: string[];
  conflicting_cycles: string[];
  synchronization_score: number;  // 0.0 - 1.0
}
```

### 5.3 Internal Data Models

**BiorhythmSnapshot:**

```python
class BiorhythmSnapshot(BaseModel):
    """Complete biorhythm state for a single moment in time."""
    
    target_date: date
    days_alive: int
    
    # Cycle data
    cycles: Dict[str, CycleData]
    
    # Aggregate metrics
    overall_energy: float
    critical_day: bool
    trend: str
    
    # Metadata
    calculation_timestamp: datetime
```

**CycleData:**

```python
class CycleData(BaseModel):
    """Data for a single biorhythm cycle."""
    
    name: str  # "physical", "emotional", etc.
    period: int  # Cycle period in days
    percentage: float  # Current value: -100 to +100
    phase: str  # "critical", "rising", "peak", "falling", "valley"
    days_to_peak: int
    days_to_valley: int
    next_critical_date: date
```

---

## 6. Visualization Data Structure

### 6.1 Chart Data Format

**Time Series Data for Plotting:**

```typescript
interface BiorhythmChartData {
  // Date range
  start_date: string;  // ISO 8601
  end_date: string;
  
  // Data points array
  data_points: BiorhythmDataPoint[];
  
  // Chart metadata
  chart_config: ChartConfig;
}

interface BiorhythmDataPoint {
  date: string;  // ISO 8601
  day_index: number;  // 0, 1, 2, ... for x-axis
  
  // Cycle values
  physical: number;  // -100 to +100
  emotional: number;
  intellectual: number;
  intuitive?: number;
  aesthetic?: number;
  spiritual?: number;
  
  // Aggregate
  overall_energy: number;
  
  // Markers
  is_critical_day: boolean;
  is_best_day: boolean;
  is_challenging_day: boolean;
}

interface ChartConfig {
  // Cycle display settings
  cycles: {
    physical: { color: string; visible: boolean };
    emotional: { color: string; visible: boolean };
    intellectual: { color: string; visible: boolean };
  };
  
  // Axis configuration
  x_axis: {
    label: string;
    date_format: string;
  };
  
  y_axis: {
    label: string;
    min: number;  // -100
    max: number;  // +100
    zero_line: boolean;  // Show horizontal line at y=0
  };
  
  // Markers
  critical_day_markers: boolean;
  phase_shading: boolean;
}
```

### 6.2 Generating Visualization Data

**Conversion Function:**

```python
def generate_chart_data(
    forecast: List[BiorhythmSnapshot],
    birth_date: date,
    include_extended: bool = False
) -> Dict[str, Any]:
    """
    Convert forecast snapshots to chart-ready format.
    
    Returns:
        Dictionary with chart data and configuration
    """
    data_points = []
    
    for idx, snapshot in enumerate(forecast):
        point = {
            'date': snapshot.target_date.isoformat(),
            'day_index': idx,
            'physical': snapshot.cycles['physical'].percentage,
            'emotional': snapshot.cycles['emotional'].percentage,
            'intellectual': snapshot.cycles['intellectual'].percentage,
            'overall_energy': snapshot.overall_energy,
            'is_critical_day': snapshot.critical_day,
            'is_best_day': snapshot.overall_energy > 50,
            'is_challenging_day': snapshot.overall_energy < -25
        }
        
        # Add extended cycles if present
        if include_extended:
            for cycle_name in ['intuitive', 'aesthetic', 'spiritual']:
                if cycle_name in snapshot.cycles:
                    point[cycle_name] = snapshot.cycles[cycle_name].percentage
        
        data_points.append(point)
    
    return {
        'start_date': forecast[0].target_date.isoformat(),
        'end_date': forecast[-1].target_date.isoformat(),
        'data_points': data_points,
        'chart_config': get_default_chart_config()
    }
```

### 6.3 Frontend Rendering Example

**React Component with Recharts:**

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

function BiorhythmChart({ chartData }: { chartData: BiorhythmChartData }) {
  return (
    <LineChart
      width={800}
      height={400}
      data={chartData.data_points}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      
      <XAxis 
        dataKey="day_index" 
        label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
      />
      
      <YAxis 
        domain={[-100, 100]}
        label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
      />
      
      {/* Zero reference line */}
      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
      
      {/* Tooltip and Legend */}
      <Tooltip />
      <Legend />
      
      {/* Cycle lines */}
      <Line 
        type="monotone" 
        dataKey="physical" 
        stroke="#ff0000" 
        name="Physical"
        strokeWidth={2}
      />
      <Line 
        type="monotone" 
        dataKey="emotional" 
        stroke="#ffaa00" 
        name="Emotional"
        strokeWidth={2}
      />
      <Line 
        type="monotone" 
        dataKey="intellectual" 
        stroke="#0000ff" 
        name="Intellectual"
        strokeWidth={2}
      />
    </LineChart>
  );
}
```

---

## 7. Timeline Calculation System

### 7.1 Past/Present/Future Analysis

**Temporal Range Processor:**

```python
class TimelineAnalyzer:
    """Analyzes biorhythms across past, present, and future."""
    
    def generate_timeline(
        self,
        birth_date: date,
        current_date: date,
        past_days: int = 30,
        future_days: int = 30
    ) -> Dict[str, List[BiorhythmSnapshot]]:
        """
        Generate complete timeline analysis.
        
        Args:
            birth_date: Date of birth
            current_date: Reference date (usually today)
            past_days: Days to analyze backward
            future_days: Days to analyze forward
        
        Returns:
            Dictionary with 'past', 'present', 'future' keys
        """
        # Calculate date ranges
        past_start = current_date - timedelta(days=past_days)
        future_end = current_date + timedelta(days=future_days)
        
        # Generate snapshots
        past_snapshots = self._generate_range(
            birth_date, past_start, current_date
        )
        
        current_snapshot = self.calculator.calculate_biorhythm_snapshot(
            birth_date, current_date
        )
        
        future_snapshots = self._generate_range(
            birth_date, current_date + timedelta(days=1), future_end
        )
        
        return {
            'past': past_snapshots,
            'present': current_snapshot,
            'future': future_snapshots
        }
    
    def _generate_range(
        self,
        birth_date: date,
        start_date: date,
        end_date: date
    ) -> List[BiorhythmSnapshot]:
        """Generate snapshots for date range."""
        snapshots = []
        current = start_date
        
        while current <= end_date:
            snapshot = self.calculator.calculate_biorhythm_snapshot(
                birth_date, current
            )
            snapshots.append(snapshot)
            current += timedelta(days=1)
        
        return snapshots
```

### 7.2 Best/Worst Day Identification

**Optimal Day Finder:**

```python
def identify_optimal_days(
    forecast: List[BiorhythmSnapshot],
    criteria: str = 'energy'
) -> Dict[str, List[date]]:
    """
    Identify best and worst days in forecast.
    
    Args:
        forecast: List of biorhythm snapshots
        criteria: 'energy', 'physical', 'emotional', 'intellectual'
    
    Returns:
        Dictionary with 'best_days' and 'worst_days' lists
    """
    if criteria == 'energy':
        values = [(s.target_date, s.overall_energy) for s in forecast]
    else:
        values = [
            (s.target_date, s.cycles[criteria].percentage) 
            for s in forecast
        ]
    
    # Sort by value
    sorted_values = sorted(values, key=lambda x: x[1], reverse=True)
    
    # Top 20% are best days
    best_count = max(1, len(sorted_values) // 5)
    best_days = [date for date, _ in sorted_values[:best_count]]
    
    # Bottom 20% are worst days
    worst_days = [date for date, _ in sorted_values[-best_count:]]
    
    return {
        'best_days': best_days,
        'worst_days': worst_days
    }
```

---

## 8. Interpretation Layer

### 8.1 Narrative Generation System

**Template-Based Interpretation:**

```python
def generate_interpretation(snapshot: BiorhythmSnapshot) -> str:
    """
    Generate mystical biorhythm interpretation.
    
    Uses template system with dynamic content insertion.
    """
    template = """
⚡ BIORHYTHM SYNCHRONIZATION - {date} ⚡

═══ ENERGY FIELD ANALYSIS ═══

Days in Current Incarnation: {days_alive}
Overall Energy Resonance: {energy:.1f}%

Your biological field oscillates in sacred mathematical harmony with cosmic rhythms.
Today's energy signature reveals the following consciousness-body synchronization:

═══ CYCLE HARMONICS ═══

🔴 PHYSICAL FIELD ({physical:.1f}%): {physical_meaning}
{physical_guidance}

🟡 EMOTIONAL FIELD ({emotional:.1f}%): {emotional_meaning}
{emotional_guidance}

🔵 INTELLECTUAL FIELD ({intellectual:.1f}%): {intellectual_meaning}
{intellectual_guidance}

═══ FIELD SYNCHRONIZATION STATUS ═══

{synchronization_analysis}

═══ CRITICAL AWARENESS ═══

{critical_analysis}

═══ ENERGY OPTIMIZATION PROTOCOL ═══

{optimization_guidance}

Remember: These rhythms are navigation tools for conscious embodiment 
and optimal energy management in your reality field.
    """
    
    # Fill template with data
    return template.format(
        date=snapshot.target_date.strftime('%B %d, %Y').upper(),
        days_alive=snapshot.days_alive,
        energy=snapshot.overall_energy,
        physical=snapshot.cycles['physical'].percentage,
        physical_meaning=get_phase_meaning('physical', snapshot),
        physical_guidance=get_cycle_guidance('physical', snapshot),
        # ... more fields
    )
```

### 8.2 Recommendation Engine

**Context-Aware Advice Generator:**

```python
def generate_recommendations(snapshot: BiorhythmSnapshot) -> List[str]:
    """
    Generate actionable recommendations based on current state.
    
    Returns:
        List of recommendation strings
    """
    recommendations = []
    
    # Phase-specific recommendations
    for cycle_name in ['physical', 'emotional', 'intellectual']:
        cycle = snapshot.cycles[cycle_name]
        
        if cycle.phase == 'critical':
            recommendations.append(
                f"Practice extra mindfulness with {cycle_name} activities today"
            )
        elif cycle.phase == 'peak':
            recommendations.append(
                f"Leverage your {cycle_name} peak for important tasks"
            )
        elif cycle.phase == 'valley':
            recommendations.append(
                f"Allow {cycle_name} recovery and avoid overexertion"
            )
    
    # Energy-based recommendations
    if snapshot.overall_energy > 50:
        recommendations.append("High energy day - tackle challenging projects")
    elif snapshot.overall_energy < -25:
        recommendations.append("Low energy period - prioritize rest and self-care")
    
    # Critical day recommendations
    if snapshot.critical_day:
        recommendations.append(
            "Critical day active - practice patience and avoid major decisions"
        )
    
    # Trend-based recommendations
    if snapshot.trend == 'ascending':
        recommendations.append("Energy building - good time to start new initiatives")
    elif snapshot.trend == 'descending':
        recommendations.append("Energy declining - focus on completing existing projects")
    
    return recommendations
```

---

## 9. Caching & Performance

### 9.1 Caching Strategy

**Cloudflare KV Integration:**

```python
class BiorhythmCache:
    """Cache manager for biorhythm calculations."""
    
    def __init__(self, kv_namespace):
        self.kv = kv_namespace
        self.ttl_seconds = 86400  # 24 hours
    
    def get_cache_key(
        self,
        birth_date: date,
        target_date: date,
        include_extended: bool
    ) -> str:
        """Generate unique cache key."""
        return f"biorhythm:{birth_date}:{target_date}:{include_extended}"
    
    async def get_cached_result(
        self,
        birth_date: date,
        target_date: date,
        include_extended: bool
    ) -> Optional[BiorhythmOutput]:
        """Retrieve cached calculation if available."""
        key = self.get_cache_key(birth_date, target_date, include_extended)
        
        try:
            cached_data = await self.kv.get(key, type="json")
            if cached_data:
                return BiorhythmOutput(**cached_data)
        except Exception as e:
            logger.warning(f"Cache retrieval failed: {e}")
        
        return None
    
    async def cache_result(
        self,
        birth_date: date,
        target_date: date,
        include_extended: bool,
        result: BiorhythmOutput
    ):
        """Cache calculation result."""
        key = self.get_cache_key(birth_date, target_date, include_extended)
        
        try:
            await self.kv.put(
                key,
                result.model_dump_json(),
                expiration_ttl=self.ttl_seconds
            )
        except Exception as e:
            logger.error(f"Cache write failed: {e}")
```

### 9.2 Performance Optimization

**Batch Processing:**

```python
def calculate_forecast_optimized(
    birth_date: date,
    start_date: date,
    num_days: int
) -> List[BiorhythmSnapshot]:
    """
    Optimized forecast generation using vectorization.
    
    Significantly faster than sequential calculation for large ranges.
    """
    import numpy as np
    
    # Pre-calculate day offsets
    day_offsets = np.arange(num_days)
    days_alive_array = np.array([
        (start_date + timedelta(days=int(offset)) - birth_date).days
        for offset in day_offsets
    ])
    
    # Vectorized sine wave calculation
    physical = 100 * np.sin(2 * np.pi * days_alive_array / 23)
    emotional = 100 * np.sin(2 * np.pi * days_alive_array / 28)
    intellectual = 100 * np.sin(2 * np.pi * days_alive_array / 33)
    
    # Convert to snapshots
    snapshots = []
    for i in range(num_days):
        target = start_date + timedelta(days=i)
        
        snapshot = BiorhythmSnapshot(
            target_date=target,
            days_alive=int(days_alive_array[i]),
            cycles={
                'physical': CycleData(
                    name='physical',
                    period=23,
                    percentage=float(physical[i]),
                    # ... more fields
                ),
                # ... more cycles
            },
            overall_energy=float((physical[i] + emotional[i] + intellectual[i]) / 3),
            critical_day=is_critical_day_vectorized(physical[i], emotional[i], intellectual[i]),
            trend=calculate_trend(int(days_alive_array[i]))
        )
        
        snapshots.append(snapshot)
    
    return snapshots
```

---

## 10. Error Handling & Validation

### 10.1 Error Hierarchy

```python
class BiorhythmError(Exception):
    """Base exception for biorhythm engine errors."""
    pass

class ValidationError(BiorhythmError):
    """Input validation failed."""
    pass

class CalculationError(BiorhythmError):
    """Calculation process failed."""
    pass

class InterpretationError(BiorhythmError):
    """Interpretation generation failed."""
    pass
```

### 10.2 Validation Pipeline

```python
def validate_and_sanitize_input(raw_input: Dict[str, Any]) -> BiorhythmInput:
    """
    Comprehensive input validation and sanitization.
    
    Raises:
        ValidationError: If input is invalid
    """
    try:
        # Pydantic validation
        validated = BiorhythmInput(**raw_input)
        
        # Additional business logic validation
        if validated.target_date is None:
            validated.target_date = date.today()
        
        # Sanitize forecast_days
        if validated.forecast_days < 1:
            validated.forecast_days = 7
        elif validated.forecast_days > 90:
            validated.forecast_days = 90
        
        return validated
        
    except Exception as e:
        raise ValidationError(f"Input validation failed: {str(e)}")
```

### 10.3 Graceful Degradation

```python
def calculate_with_fallback(
    input_data: BiorhythmInput
) -> BiorhythmOutput:
    """
    Calculate with fallback mechanisms for robustness.
    """
    try:
        # Try full calculation with extended cycles
        if input_data.include_extended_cycles:
            return calculate_full(input_data)
        else:
            return calculate_core(input_data)
            
    except CalculationError:
        # Fallback: calculate core cycles only
        logger.warning("Extended cycle calculation failed, using core only")
        input_data.include_extended_cycles = False
        return calculate_core(input_data)
    
    except Exception as e:
        # Ultimate fallback: minimal calculation
        logger.error(f"Calculation failed: {e}")
        return calculate_minimal(input_data)
```

---

**Document Version:** 1.0  
**Last Updated:** 2026  
**Source:** WitnessOS Biorhythm Engine  
**Architecture Extracted From:** `biorhythm.py`, `biorhythm_models.py`
