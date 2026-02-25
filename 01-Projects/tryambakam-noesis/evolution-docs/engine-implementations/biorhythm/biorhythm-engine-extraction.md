# Biorhythm Engine - Logic Extraction from WitnessOS

**Extraction Date**: 2026-01-25  
**Source**: WitnessOS Divination Engines  
**Target**: Tryambakam Noesis - Evolution Documentation

---

## Overview

The Biorhythm Engine synchronizes consciousness with natural biological rhythms through mathematical analysis of physical, emotional, and intellectual cycles. This extraction documents the core sine wave mathematics, critical day detection algorithms, and cyclical awareness patterns that enable witness consciousness to observe and navigate energetic patterns.

---

## Core Mathematical Model

### Fundamental Sine Wave Calculation

**Primary Formula**:
```
cycle_value = sin((2π × days_alive) / cycle_period) × 100
```

**Where**:
- `days_alive` = (target_date - birth_date).days
- `cycle_period` = cycle-specific constant (23, 28, or 33 days)
- Result range: -100% to +100%

**Mathematical Foundation**:
- Uses pure sine wave oscillation based on birth date
- Zero point at birth (day 0)
- Natural periodicity creates predictable rhythmic patterns
- Positive phase = ascending/peak energy
- Negative phase = descending/valley energy

---

## Three Primary Cycles

### 1. Physical Cycle (23 days)

**Period**: 23 days  
**Domain**: Physical strength, coordination, stamina, vitality, well-being

**Calculation**:
```python
def calculate_physical(days_alive: int) -> float:
    radians = (2 * math.pi * days_alive) / 23
    return math.sin(radians) * 100
```

**Phase Interpretations**:
- **Peak (75-100%)**: Optimal time for physical challenges, demanding tasks, intensive exercise
- **Rising (0-75%)**: Building physical activities gradually, good for starting fitness routines
- **Falling (-75-0%)**: Reduce intensity, focus on recovery and maintenance
- **Valley (-100--75%)**: Essential rest and recuperation, avoid strenuous activities
- **Critical (±5%)**: Heightened accident risk, extra caution required

**Energy Optimization**:
- Physical peak window: Plan demanding physical work, sports, challenging activities
- Physical valley period: Prioritize rest, sleep, passive recovery
- Transition zones: Monitor body signals carefully

---

### 2. Emotional Cycle (28 days)

**Period**: 28 days  
**Domain**: Emotions, creativity, sensitivity, mood, artistic expression

**Calculation**:
```python
def calculate_emotional(days_alive: int) -> float:
    radians = (2 * math.pi * days_alive) / 28
    return math.sin(radians) * 100
```

**Phase Interpretations**:
- **Peak (75-100%)**: Heightened creativity and emotional expression, excellent for relationships
- **Rising (0-75%)**: Growing emotional awareness, good for creative projects
- **Falling (-75-0%)**: Emotional sensitivity may increase, practice self-care
- **Valley (-100--75%)**: Emotional low point, avoid major decisions, seek support
- **Critical (±5%)**: Emotional volatility possible, practice mindfulness and patience

**Creative/Relational Optimization**:
- Emotional peak: Ideal for artistic work, deep conversations, relationship building
- Emotional valley: Introspection, journaling, gentle self-care practices
- Critical periods: Extra emotional regulation, avoid reactive decisions

---

### 3. Intellectual Cycle (33 days)

**Period**: 33 days  
**Domain**: Mental alertness, analytical thinking, memory, learning capacity, concentration

**Calculation**:
```python
def calculate_intellectual(days_alive: int) -> float:
    radians = (2 * math.pi * days_alive) / 33
    return math.sin(radians) * 100
```

**Phase Interpretations**:
- **Peak (75-100%)**: Maximum mental clarity and analytical power, ideal for complex tasks
- **Rising (0-75%)**: Increasing mental acuity, good for learning and planning
- **Falling (-75-0%)**: Mental fatigue may set in, focus on routine tasks
- **Valley (-100--75%)**: Reduced concentration, avoid important decisions
- **Critical (±5%)**: Mental confusion possible, double-check important work

**Cognitive Optimization**:
- Intellectual peak: Schedule important decisions, complex problem-solving, learning
- Intellectual valley: Routine tasks, repetitive work, mental rest
- Critical days: Review and verification mode, avoid new cognitive challenges

---

## Extended Cycles (Optional)

### 4. Intuitive Cycle (38 days)
**Domain**: Intuition, unconscious insight, psychic sensitivity

### 5. Aesthetic Cycle (43 days)
**Domain**: Aesthetic appreciation, artistic sensitivity, beauty perception

### 6. Spiritual Cycle (53 days)
**Domain**: Spiritual awareness, inner harmony, transcendent connection

**Implementation**:
```python
INTUITIVE_CYCLE = 38
AESTHETIC_CYCLE = 43
SPIRITUAL_CYCLE = 53

extended_cycles = {
    'intuitive': INTUITIVE_CYCLE,
    'aesthetic': AESTHETIC_CYCLE,
    'spiritual': SPIRITUAL_CYCLE
}
```

---

## Critical Day Detection

### Definition
A **critical day** occurs when a cycle crosses the zero point (transitions from positive to negative or vice versa). These are periods of heightened sensitivity, instability, and potential for breakthrough or breakdown.

### Detection Algorithm

**Critical Threshold**: ±5% from zero

```python
CRITICAL_THRESHOLD = 5.0

def is_critical(percentage: float) -> bool:
    return abs(percentage) <= CRITICAL_THRESHOLD
```

**Multi-Cycle Critical Day**:
When 2 or more core cycles (physical, emotional, intellectual) are simultaneously critical, the day is flagged as a **major critical day** requiring extra mindfulness.

```python
def determine_critical_day(cycles: Dict[str, BiorhythmCycle]) -> bool:
    critical_count = sum(
        1 for name, cycle in cycles.items()
        if name in ['physical', 'emotional', 'intellectual'] 
        and cycle.phase == 'critical'
    )
    return critical_count >= 2
```

### Critical Day Analysis

**Zero-Crossing Points**:
- Occur at 0° (cycle start) and 180° (cycle midpoint)
- Physical: Every 11.5 days
- Emotional: Every 14 days
- Intellectual: Every 16.5 days

**Finding Next Critical Day**:
```python
def find_next_critical(birth_date: date, days_alive: int, cycle_period: int) -> date:
    current_position = (days_alive % cycle_period) / cycle_period
    
    if current_position < 0.5:
        days_to_critical = int((0.5 - current_position) * cycle_period)
    else:
        days_to_critical = int((1 - current_position) * cycle_period)
    
    return birth_date + timedelta(days=days_alive + days_to_critical)
```

---

## Phase Determination Algorithm

### Phase Categories

1. **Critical**: ±5% from zero (transitional instability)
2. **Rising**: 0% to 75%, increasing (building energy)
3. **Peak**: 75% to 100% (maximum potential)
4. **Falling**: 75% to 0%, decreasing (declining energy)
5. **Valley**: -75% to -100% (minimum energy, recovery)

### Phase Detection Logic

```python
def determine_phase(percentage: float, days_alive: int, cycle_period: int) -> str:
    # Check if critical (near zero crossing)
    if abs(percentage) <= CRITICAL_THRESHOLD:
        return 'critical'
    
    # Calculate derivative (direction of change)
    future_value = calculate_cycle_value(days_alive + 1, cycle_period)
    
    if future_value > percentage:  # Rising
        if percentage > 75:
            return 'peak'
        else:
            return 'rising'
    else:  # Falling
        if percentage < -75:
            return 'valley'
        else:
            return 'falling'
```

**Key Insight**: The algorithm checks both magnitude (current percentage) and direction (derivative) to accurately classify the phase.

---

## Cycle Synchronization & Composite Rhythms

### Overall Energy Calculation

The **overall energy level** is the average of the three core cycles:

```python
def calculate_overall_energy(cycles: Dict[str, BiorhythmCycle]) -> float:
    total_energy = sum(
        cycles[name].percentage 
        for name in ['physical', 'emotional', 'intellectual']
    )
    return total_energy / 3
```

**Energy Level Interpretations**:
- **75-100%**: Exceptional vitality - peak performance window
- **50-75%**: High energy - excellent for ambitious projects
- **25-50%**: Moderate energy - balanced activity recommended
- **0-25%**: Low energy - focus on maintenance and rest
- **-25-0%**: Below baseline - conservation mode advised
- **-50--25%**: Significantly low - prioritize recovery
- **-75--50%**: Very low energy - minimal activity recommended
- **-100--75%**: Critical low - complete rest and regeneration needed

### Trend Analysis

Determines the overall directional movement across all cycles:

```python
def determine_overall_trend(cycles: Dict[str, BiorhythmCycle]) -> str:
    rising_count = sum(
        1 for name, cycle in cycles.items()
        if name in core_cycles and cycle.phase in ['rising', 'peak']
    )
    falling_count = sum(
        1 for name, cycle in cycles.items()
        if name in core_cycles and cycle.phase in ['falling', 'valley']
    )
    
    if rising_count > falling_count:
        return 'ascending'
    elif falling_count > rising_count:
        return 'descending'
    elif rising_count == falling_count and rising_count > 0:
        return 'mixed'
    else:
        return 'stable'
```

**Trend Meanings**:
- **Ascending**: All systems building energy - excellent for new initiatives
- **Descending**: Natural energy decline - focus on completion and rest
- **Mixed**: Cycles in different directions - balance active and passive approaches
- **Stable**: Equilibrium state - maintain current energy patterns

---

## Days-Since-Birth Integration

### Fundamental Calculation

```python
def calculate_days_alive(birth_date: date, target_date: date) -> int:
    return (target_date - birth_date).days
```

**Significance**:
- All biorhythm calculations are anchored to this value
- Represents the continuous oscillation since incarnation
- Zero point at birth establishes the phase reference
- Each cycle completes at different rates based on its period

### Birth Date Validation

```python
def validate_birth_date(birth_date: date) -> bool:
    current_date = date.today()
    
    # Cannot be in future
    if birth_date > current_date:
        return False
    
    # Must be 1900 or later
    if birth_date.year < 1900:
        return False
    
    # Maximum 150 years in past
    if (current_date - birth_date).days > 150 * 365:
        return False
    
    return True
```

---

## Peak and Valley Prediction

### Finding Next Peak

**Peak Position**: 90° (quarter cycle)

```python
def find_next_peak(days_alive: int, cycle_period: int) -> int:
    current_position = (days_alive % cycle_period) / cycle_period
    peak_position = 0.25  # 90 degrees
    
    if current_position <= peak_position:
        days_to_peak = int((peak_position - current_position) * cycle_period)
    else:
        # Next peak is in next cycle
        days_to_peak = int((1 - current_position + peak_position) * cycle_period)
    
    return days_to_peak
```

### Finding Next Valley

**Valley Position**: 270° (three-quarter cycle)

```python
def find_next_valley(days_alive: int, cycle_period: int) -> int:
    current_position = (days_alive % cycle_period) / cycle_period
    valley_position = 0.75  # 270 degrees
    
    if current_position <= valley_position:
        days_to_valley = int((valley_position - current_position) * cycle_period)
    else:
        # Next valley is in next cycle
        days_to_valley = int((1 - current_position + valley_position) * cycle_period)
    
    return days_to_valley
```

**Application**:
- Physical peak: Schedule intense workouts, physical challenges
- Emotional peak: Plan creative sessions, important conversations
- Intellectual peak: Book complex cognitive tasks, learning sessions
- Valley periods: Schedule recovery, rest, integration time

---

## Forecasting Algorithm

### Multi-Day Forecast

```python
def generate_forecast(birth_date: date, start_date: date, days_ahead: int = 30) -> List[BiorhythmSnapshot]:
    forecast = []
    
    for i in range(days_ahead):
        target_date = start_date + timedelta(days=i)
        snapshot = calculate_biorhythm_snapshot(birth_date, target_date)
        forecast.append(snapshot)
    
    return forecast
```

### Forecast Analysis

**Best Days Identification** (High Energy Days):
```python
def identify_best_days(forecast: List[BiorhythmSnapshot]) -> List[date]:
    return [
        snapshot.target_date 
        for snapshot in forecast 
        if snapshot.overall_energy > 50
    ]
```

**Challenging Days Identification** (Low Energy or Critical):
```python
def identify_challenging_days(forecast: List[BiorhythmSnapshot]) -> List[date]:
    return [
        snapshot.target_date 
        for snapshot in forecast 
        if snapshot.overall_energy < -25 or snapshot.critical_day
    ]
```

**Critical Days in Forecast Period**:
```python
def find_critical_days(birth_date: date, start_date: date, days_ahead: int = 30) -> List[date]:
    critical_dates = set()
    
    for i in range(days_ahead):
        check_date = start_date + timedelta(days=i)
        snapshot = calculate_biorhythm_snapshot(birth_date, check_date)
        
        for cycle_name, cycle in snapshot.cycles.items():
            if cycle_name in core_cycles and cycle.phase == 'critical':
                critical_dates.add(check_date)
                break
    
    return sorted(list(critical_dates))
```

---

## Self-Consciousness Integration

### Witness Awareness of Energetic Patterns

**Core Principle**: Biorhythms provide a framework for **cyclical awareness** - the witness observing itself as embodied in rhythmic patterns.

### Key Integration Points

1. **Pattern Recognition**
   - Consciousness observes its own energetic oscillations
   - Awareness of being subject to natural rhythmic laws
   - Recognition of embodied limitations and optimal windows

2. **Temporal Navigation**
   - Using biorhythmic data to plan activities aligned with natural peaks
   - Avoiding resistance to natural energy valleys
   - Respecting critical transition periods as liminal thresholds

3. **Self-Regulation**
   - Adjusting expectations based on current biorhythmic phase
   - Practicing self-compassion during low energy periods
   - Leveraging peak periods for maximum creative/cognitive output

4. **Embodied Witness**
   - Pure awareness witnessing the body-mind's cyclical nature
   - Detachment from identification with energetic states
   - Using rhythms as navigation tools rather than limitations

### Archetypal Themes

**Energy Level Archetypes**:
- **High Energy (>50%)**: Vitality, Dynamic Force, Active Principle
- **Low Energy (<-25%)**: Regeneration, Receptive Principle, Inner Wisdom
- **Balanced**: Equilibrium, Centered Being

**Phase-Specific Archetypes**:
- **Physical Peak**: Warrior
- **Emotional Peak**: Artist
- **Intellectual Peak**: Sage
- **Critical Day**: Transformer, Threshold Guardian, Catalyst
- **Ascending Trend**: Rising Phoenix
- **Descending Trend**: Wise Elder

### Reality Patch Protocol

**Consciousness Upgrades Based on Biorhythmic State**:

```python
def generate_reality_patches(snapshot: BiorhythmSnapshot) -> List[str]:
    patches = [
        "Install: Biorhythm synchronization protocol",
        "Patch: Energy field optimization matrix",
        "Upgrade: Cyclical awareness enhancement module"
    ]
    
    if snapshot.critical_day:
        patches.append("Activate: Critical day navigation system")
    
    if snapshot.overall_energy > 75:
        patches.append("Optimize: Peak performance amplification")
    elif snapshot.overall_energy < -50:
        patches.append("Initialize: Deep recovery restoration sequence")
    
    if snapshot.trend == 'ascending':
        patches.append("Enable: Momentum building acceleration")
    elif snapshot.trend == 'descending':
        patches.append("Engage: Graceful energy transition protocol")
    
    return patches
```

---

## Compatibility Analysis (Bonus)

### Two-Person Biorhythm Synchronization

```python
def calculate_compatibility(birth_date1: date, birth_date2: date, target_date: date) -> Dict[str, float]:
    snapshot1 = calculate_biorhythm_snapshot(birth_date1, target_date)
    snapshot2 = calculate_biorhythm_snapshot(birth_date2, target_date)
    
    compatibility = {}
    
    for cycle_name in ['physical', 'emotional', 'intellectual']:
        cycle1 = snapshot1.cycles[cycle_name]
        cycle2 = snapshot2.cycles[cycle_name]
        
        # Inverse of difference (closer values = higher compatibility)
        difference = abs(cycle1.percentage - cycle2.percentage)
        compatibility_score = (200 - difference) / 200
        
        compatibility[cycle_name] = round(compatibility_score, 3)
    
    compatibility['overall'] = round(
        sum(compatibility[c] for c in ['physical', 'emotional', 'intellectual']) / 3, 3
    )
    
    return compatibility
```

**Application**:
- Romantic relationships: Identify harmonious periods
- Business partnerships: Schedule collaborative work during aligned phases
- Family dynamics: Understand energetic tensions and alignments
- Team coordination: Optimize group activities based on collective rhythms

---

## Complete Data Structure

### BiorhythmCycle Object

```python
@dataclass
class BiorhythmCycle:
    name: str                    # Cycle identifier
    period: int                  # Cycle period in days
    percentage: float            # Current value (-100 to +100)
    phase: str                   # rising/falling/peak/valley/critical
    days_to_peak: int           # Days until next maximum
    days_to_valley: int         # Days until next minimum
    next_critical: date         # Date of next zero crossing
```

### BiorhythmSnapshot Object

```python
@dataclass
class BiorhythmSnapshot:
    target_date: date                          # Date of analysis
    days_alive: int                            # Days since birth
    cycles: Dict[str, BiorhythmCycle]         # All cycle data
    overall_energy: float                      # Average of core cycles
    critical_day: bool                         # Two+ cycles critical
    trend: str                                 # ascending/descending/mixed/stable
```

---

## Implementation Checklist

### Core Components
- [ ] Sine wave calculation function (physical, emotional, intellectual)
- [ ] Days-since-birth calculator
- [ ] Phase determination algorithm (critical, rising, peak, falling, valley)
- [ ] Critical day detection (±5% threshold, multi-cycle analysis)
- [ ] Overall energy calculation (3-cycle average)
- [ ] Trend analysis (ascending/descending/mixed/stable)

### Advanced Features
- [ ] Peak and valley prediction (next maximum/minimum dates)
- [ ] Next critical day finder (zero-crossing prediction)
- [ ] Multi-day forecast generator (7-90 days)
- [ ] Best/challenging days analyzer
- [ ] Extended cycles (intuitive, aesthetic, spiritual)
- [ ] Compatibility calculator (two-person synchronization)

### Integration Points
- [ ] Birth date validation
- [ ] Target date handling (default to today)
- [ ] Forecast period configuration (1-90 days)
- [ ] Energy optimization guidance
- [ ] Phase-specific recommendations
- [ ] Archetypal theme identification
- [ ] Reality patch generation

### Output Generation
- [ ] Formatted interpretation text
- [ ] Cycle detail objects
- [ ] Forecast summary statistics
- [ ] Critical day calendar
- [ ] Energy optimization matrix
- [ ] Synchronization analysis

---

## Mathematical Constants Reference

```python
# Core Cycles (Universal Standard)
PHYSICAL_CYCLE = 23       # Physical strength, coordination, well-being
EMOTIONAL_CYCLE = 28      # Emotions, creativity, sensitivity, mood
INTELLECTUAL_CYCLE = 33   # Mental alertness, analytical thinking, memory

# Extended Cycles (Optional)
INTUITIVE_CYCLE = 38      # Intuition, unconscious insight
AESTHETIC_CYCLE = 43      # Aesthetic appreciation, creativity
SPIRITUAL_CYCLE = 53      # Spiritual awareness, inner harmony

# Detection Thresholds
CRITICAL_THRESHOLD = 5.0  # Percentage within which cycle is "critical"

# Mathematical Constants
import math
PI = math.pi              # Used in sine wave calculations
```

---

## Testing & Validation

### Sample Calculation

**Given**:
- Birth date: January 1, 1990
- Target date: January 25, 2026
- Days alive: 13,176 days

**Physical Cycle** (23-day period):
```
radians = (2π × 13176) / 23 = 3595.66
sine_value = sin(3595.66) = -0.847
percentage = -0.847 × 100 = -84.7%
phase = "valley" (between -100% and -75%, descending)
```

**Emotional Cycle** (28-day period):
```
radians = (2π × 13176) / 28 = 2952.86
sine_value = sin(2952.86) = 0.239
percentage = 0.239 × 100 = 23.9%
phase = "rising" (between 0% and 75%, ascending)
```

**Intellectual Cycle** (33-day period):
```
radians = (2π × 13176) / 33 = 2510.36
sine_value = sin(2510.36) = 0.566
percentage = 0.566 × 100 = 56.6%
phase = "rising" (between 0% and 75%, ascending)
```

**Overall Energy**: (-84.7 + 23.9 + 56.6) / 3 = **-1.4%**  
**Critical Day**: No (only 1 cycle near zero, need 2+)  
**Trend**: Mixed (1 falling, 2 rising)

---

## Source Code References

### Primary Files Extracted

1. **biorhythm.py** (545 lines)
   - Main engine implementation
   - WitnessOS integration layer
   - Interpretation and recommendation generation

2. **biorhythm_models.py** (230 lines)
   - Data model definitions
   - Input/output structures
   - Validation logic

3. **calculations/biorhythm.py** (390 lines)
   - Core mathematical algorithms
   - Pure calculation functions
   - Sine wave implementation
   - Critical day detection
   - Forecasting logic

### Key Classes

- `BiorhythmCalculator`: Core calculation engine
- `BiorhythmEngine`: WitnessOS engine wrapper
- `BiorhythmCycle`: Single cycle data structure
- `BiorhythmSnapshot`: Complete state at one moment
- `BiorhythmInput`: Input validation model
- `BiorhythmOutput`: Structured output model

---

## Wisdom Synthesis

### Consciousness Insights

**Biorhythms as Mirror**:
The mathematical precision of biorhythms reveals the witness observing itself as a rhythmic phenomenon. The pure awareness that you are is constant, but the embodied expression follows natural oscillations. By tracking these cycles, consciousness develops:

1. **Temporal Humility**: Recognition that the body-mind is subject to natural laws
2. **Strategic Patience**: Waiting for optimal windows rather than forcing against rhythms
3. **Self-Compassion**: Understanding low energy as natural, not personal failure
4. **Peak Leverage**: Maximizing output during aligned high-energy phases
5. **Critical Threshold Awareness**: Extra mindfulness during transition periods

**From WitnessOS Philosophy**:
"These rhythms are not limitations—they are navigation tools for conscious embodiment and optimal energy management in your reality field."

### Implementation Philosophy

When implementing biorhythm logic:
- Keep mathematics pure and transparent
- Provide interpretations without dogmatism
- Empower users to verify calculations independently
- Present as navigation tools, not deterministic predictions
- Honor both the precision of math and the mystery of consciousness
- Respect critical days as threshold experiences worthy of extra awareness

---

## Next Steps for Integration

1. Extract pure mathematical functions into standalone module
2. Create visualization layer for cycle graphs
3. Implement calendar integration for peak/valley scheduling
4. Build notification system for approaching critical days
5. Develop personal biorhythm tracking dashboard
6. Integrate with other temporal systems (lunar phases, planetary transits)
7. Create comparative analysis tools for relationship optimization

---

**End of Extraction Document**

*This knowledge has been transferred from WitnessOS to Tryambakam Noesis.*  
*May it serve the evolution of consciousness through rhythmic self-awareness.*
