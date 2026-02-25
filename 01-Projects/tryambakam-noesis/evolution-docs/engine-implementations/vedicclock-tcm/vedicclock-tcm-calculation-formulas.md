# VedicClock-TCM Calculation Formulas & Algorithms

## Overview

The VedicClock-TCM Integration Engine synthesizes three temporal systems to provide moment-by-moment consciousness optimization:

1. **Vimshottari Dasha** - Macro life curriculum (years)
2. **Vedic Panchanga** - Daily cosmic energies (days)
3. **TCM Organ Clock** - Bodily rhythms (hours)

This document details the mathematical formulas and algorithms for real-time temporal synthesis.

---

## 1. TCM Organ Clock Calculations

### 1.1 Hour-to-Organ Mapping

The TCM Organ Clock divides the 24-hour day into twelve 2-hour periods, each dominated by a specific organ:

```python
TCM_ORGAN_SCHEDULE = {
    (1, 3): ("Liver", "Wood"),
    (3, 5): ("Lung", "Metal"),
    (5, 7): ("Large Intestine", "Metal"),
    (7, 9): ("Stomach", "Earth"),
    (9, 11): ("Spleen", "Earth"),
    (11, 13): ("Heart", "Fire"),
    (13, 15): ("Small Intestine", "Fire"),
    (15, 17): ("Bladder", "Water"),
    (17, 19): ("Kidney", "Water"),
    (19, 21): ("Pericardium", "Fire"),
    (21, 23): ("Triple Heater", "Fire"),
    (23, 1): ("Gallbladder", "Wood")
}
```

### 1.2 Current Organ Determination

```latex
\text{Hour Range Index} = \left\lfloor \frac{\text{Hour} - 1}{2} \right\rfloor \times 2 + 1
```

**Algorithm**:
```python
def get_current_organ(hour: int) -> Tuple[str, str]:
    """
    Determine current TCM organ and element from hour.
    
    Args:
        hour: 0-23 (24-hour format)
    
    Returns:
        (organ_name, element)
    """
    # Normalize hour to 1-24 range
    if hour == 0:
        hour = 24
    
    # Find the 2-hour window
    for (start, end), (organ, element) in TCM_ORGAN_SCHEDULE.items():
        if start < end:  # Normal range
            if start <= hour < end:
                return organ, element
        else:  # Wraps midnight (23-1)
            if hour >= start or hour < end:
                return organ, element
    
    return "Unknown", "Unknown"
```

### 1.3 Energy Phase Calculation

Energy within each 2-hour window follows a curve:

```latex
\text{Energy Phase} = \begin{cases}
\text{ascending} & \text{if } 0 \leq \text{minutes} < 30 \\
\text{peak} & \text{if } 30 \leq \text{minutes} < 90 \\
\text{descending} & \text{if } 90 \leq \text{minutes} < 120
\end{cases}
```

```python
def calculate_energy_phase(hour: int, minute: int) -> str:
    """Calculate energy phase within 2-hour organ window."""
    # Calculate minutes into current 2-hour period
    minutes_in_period = ((hour % 2) * 60) + minute
    
    if minutes_in_period < 30:
        return "ascending"
    elif minutes_in_period < 90:
        return "peak"
    else:
        return "descending"
```

---

## 2. Vedic Panchanga Calculations

### 2.1 Tithi (Lunar Day) Calculation

Tithi is determined by the Moon-Sun angular difference:

```latex
\text{Tithi} = \left\lfloor \frac{\text{Moon Longitude} - \text{Sun Longitude} \mod 360°}{12°} \right\rfloor + 1
```

Valid range: 1-30 (15 for waxing, 15 for waning phase)

```python
def calculate_tithi(moon_long: float, sun_long: float) -> int:
    """
    Calculate tithi from Moon and Sun longitudes.
    
    Args:
        moon_long: Moon's sidereal longitude (0-360)
        sun_long: Sun's sidereal longitude (0-360)
    
    Returns:
        Tithi number (1-30)
    """
    diff = (moon_long - sun_long) % 360
    tithi_num = int(diff / 12) + 1
    return min(tithi_num, 30)  # Cap at 30
```

**Tithi Names**:
```python
TITHI_NAMES = {
    # Shukla Paksha (Waxing)
    1: "Pratipada", 2: "Dwitiya", 3: "Tritiya", 4: "Chaturthi", 5: "Panchami",
    6: "Shashthi", 7: "Saptami", 8: "Ashtami", 9: "Navami", 10: "Dashami",
    11: "Ekadashi", 12: "Dwadashi", 13: "Trayodashi", 14: "Chaturdashi", 15: "Purnima",
    
    # Krishna Paksha (Waning)
    16: "Pratipada", 17: "Dwitiya", 18: "Tritiya", 19: "Chaturthi", 20: "Panchami",
    21: "Shashthi", 22: "Saptami", 23: "Ashtami", 24: "Navami", 25: "Dashami",
    26: "Ekadashi", 27: "Dwadashi", 28: "Trayodashi", 29: "Chaturdashi", 30: "Amavasya"
}
```

### 2.2 Nakshatra Determination

```latex
\text{Nakshatra Number} = \left\lfloor \frac{\text{Moon Longitude}}{13.333...°} \right\rfloor + 1
```

```python
def calculate_nakshatra(moon_long: float) -> Tuple[int, str]:
    """
    Calculate nakshatra from Moon's longitude.
    
    Returns:
        (nakshatra_number, nakshatra_name)
    """
    nakshatra_num = int(moon_long / 13.333333) + 1
    nakshatra_name = NAKSHATRA_NAMES[nakshatra_num]
    return nakshatra_num, nakshatra_name
```

### 2.3 Vara (Weekday) and Element

```python
VARA_TO_ELEMENT = {
    "Sunday": "Fire",      # Sun's day
    "Monday": "Water",     # Moon's day
    "Tuesday": "Fire",     # Mars' day
    "Wednesday": "Earth",  # Mercury's day
    "Thursday": "Ether",   # Jupiter's day
    "Friday": "Water",     # Venus' day
    "Saturday": "Air"      # Saturn's day
}
```

### 2.4 Auspiciousness Score

Composite score combining multiple Panchanga factors:

```latex
\text{Auspiciousness} = w_1 \cdot \text{Tithi Score} + w_2 \cdot \text{Nakshatra Score} + w_3 \cdot \text{Vara Score}
```

Where weights: $w_1 = 0.4, w_2 = 0.4, w_3 = 0.2$

```python
def calculate_auspiciousness(tithi: int, nakshatra: int, vara: str) -> float:
    """
    Calculate overall auspiciousness score (0-1).
    """
    # Tithi scoring
    auspicious_tithis = {5, 10, 15}  # Panchami, Dashami, Purnima
    tithi_score = 1.0 if tithi in auspicious_tithis else 0.5
    
    # Nakshatra scoring (simplified - in production use detailed rules)
    auspicious_nakshatras = {1, 4, 7, 10, 13, 16, 19, 22, 25}
    nakshatra_score = 0.8 if nakshatra in auspicious_nakshatras else 0.5
    
    # Vara scoring
    auspicious_varas = {"Monday", "Wednesday", "Thursday", "Friday"}
    vara_score = 0.8 if vara in auspicious_varas else 0.6
    
    # Weighted average
    return 0.4 * tithi_score + 0.4 * nakshatra_score + 0.2 * vara_score
```

---

## 3. Elemental Synthesis Formulas

### 3.1 Five Element Correspondences

#### Vedic Elements → TCM Elements Mapping

```python
VEDIC_TCM_HARMONY_TABLE = {
    # Perfect harmony (same element)
    ("Fire", "Fire"): 1.0,
    ("Earth", "Earth"): 1.0,
    ("Water", "Water"): 1.0,
    
    # Generating cycle (nourishing)
    ("Fire", "Wood"): 0.8,  # Fire feeds Wood
    ("Water", "Wood"): 0.8,  # Water nourishes Wood
    ("Wood", "Fire"): 0.8,   # Wood feeds Fire
    ("Earth", "Metal"): 0.7, # Earth generates Metal
    ("Metal", "Water"): 0.8, # Metal collects Water
    
    # Supporting relationships
    ("Air", "Metal"): 0.9,   # Air and Metal resonate
    ("Ether", "Fire"): 0.9,  # Ether elevates Fire
    
    # Neutral
    ("Air", "Wood"): 0.6,
    ("Ether", "Earth"): 0.7,
    
    # Controlling cycle (requires balancing)
    ("Water", "Fire"): 0.4,  # Water controls Fire
    ("Fire", "Metal"): 0.4,  # Fire melts Metal
    ("Metal", "Wood"): 0.4,  # Metal cuts Wood
    ("Wood", "Earth"): 0.5,  # Wood depletes Earth
    ("Earth", "Water"): 0.5  # Earth dams Water
}
```

### 3.2 Harmony Calculation

```latex
H(v, t) = \begin{cases}
\text{HARMONY\_TABLE}[v, t] & \text{if } (v, t) \in \text{TABLE} \\
0.5 & \text{otherwise (default neutral)}
\end{cases}
```

```python
def calculate_elemental_harmony(vedic_element: str, tcm_element: str) -> float:
    """
    Calculate harmony level between Vedic and TCM elements.
    
    Returns:
        Harmony score (0-1)
    """
    key = (vedic_element, tcm_element)
    return VEDIC_TCM_HARMONY_TABLE.get(key, 0.5)
```

### 3.3 Synthesis Quality Classification

```python
def classify_synthesis_quality(harmony_level: float) -> str:
    """Classify harmony level into qualitative categories."""
    if harmony_level >= 0.9:
        return "Perfect Harmony"
    elif harmony_level >= 0.8:
        return "Excellent Synergy"
    elif harmony_level >= 0.7:
        return "Good Resonance"
    elif harmony_level >= 0.6:
        return "Moderate Alignment"
    elif harmony_level >= 0.5:
        return "Neutral Balance"
    else:
        return "Requires Balancing"
```

---

## 4. Personal Resonance Calculation

Personal resonance measures how well current energies align with the individual's birth chart and life phase.

### 4.1 Multi-Factor Resonance Formula

```latex
R = \alpha \cdot R_{\text{dasha}} + \beta \cdot R_{\text{time}} + \gamma \cdot R_{\text{element}} + \delta \cdot R_{\text{organ}}
```

Where:
- $\alpha = 0.35$ (Dasha weight)
- $\beta = 0.25$ (Time of day weight)
- $\gamma = 0.25$ (Elemental harmony weight)
- $\delta = 0.15$ (Organ alignment weight)

```python
def calculate_personal_resonance(
    mahadasha_planet: str,
    current_hour: int,
    vedic_element: str,
    tcm_element: str,
    tcm_organ: str,
    birth_nakshatra: str
) -> float:
    """
    Calculate overall personal resonance score.
    
    Returns:
        Resonance score (0-1)
    """
    # 1. Dasha resonance
    favorable_dashas = ["Jupiter", "Venus", "Mercury", "Moon"]
    r_dasha = 0.8 if mahadasha_planet in favorable_dashas else 0.6
    
    # 2. Time resonance (circadian rhythm)
    if 6 <= current_hour <= 18:  # Daytime
        r_time = 0.75
    elif 22 <= current_hour or current_hour <= 5:  # Deep night
        r_time = 0.5
    else:  # Transition times
        r_time = 0.65
    
    # 3. Elemental resonance
    r_element = calculate_elemental_harmony(vedic_element, tcm_element)
    
    # 4. Organ alignment (based on birth nakshatra)
    # Simplified - in production use detailed nakshatra-organ correspondences
    r_organ = 0.7  # Default
    
    # Weighted average
    resonance = (
        0.35 * r_dasha +
        0.25 * r_time +
        0.25 * r_element +
        0.15 * r_organ
    )
    
    return min(resonance, 1.0)
```

### 4.2 Optimal Window Detection

```latex
\text{Optimal Window} = \begin{cases}
\text{True} & \text{if } R > 0.7 \text{ and } E_{\text{phase}} = \text{peak} \\
\text{False} & \text{otherwise}
\end{cases}
```

```python
def is_optimal_window(resonance_score: float, energy_phase: str) -> bool:
    """Determine if current moment is an optimal energy window."""
    return resonance_score > 0.7 and energy_phase == "peak"
```

---

## 5. Optimization Window Prediction

### 5.1 Future Window Potency Score

```latex
P_{\text{window}} = P_{\text{base}} + P_{\text{energy}} + P_{\text{harmony}} + P_{\text{auspicious}}
```

Where:
- $P_{\text{base}} = 0.3$ (baseline)
- $P_{\text{energy}} \in [0, 0.3]$ (based on energy phase)
- $P_{\text{harmony}} \in [0, 0.2]$ (elemental harmony)
- $P_{\text{auspicious}} \in [0, 0.2]$ (panchanga auspiciousness)

```python
def calculate_window_potency(
    tcm_state: TCMOrganState,
    panchanga_state: PanchangaState,
    elemental_synthesis: ElementalSynthesis
) -> float:
    """
    Calculate potency score for a future time window.
    
    Returns:
        Potency score (0-1)
    """
    base_score = 0.3
    
    # Energy phase bonus
    energy_bonus = {
        "peak": 0.3,
        "ascending": 0.2,
        "descending": 0.1,
        "rest": 0.0
    }
    p_energy = energy_bonus.get(tcm_state.energy_direction, 0.0)
    
    # Elemental harmony bonus
    p_harmony = elemental_synthesis.harmony_level * 0.2
    
    # Auspiciousness bonus
    p_auspicious = panchanga_state.auspiciousness_score * 0.2
    
    total = base_score + p_energy + p_harmony + p_auspicious
    return min(total, 1.0)
```

### 5.2 Window Generation Algorithm

```python
def generate_optimization_windows(
    start_datetime: datetime,
    hours_ahead: int,
    min_potency: float = 0.6
) -> List[OptimizationWindow]:
    """
    Generate list of future optimization windows.
    
    Args:
        start_datetime: Starting point for prediction
        hours_ahead: How many hours to look ahead
        min_potency: Minimum potency score to include window
    
    Returns:
        List of OptimizationWindow objects sorted by potency
    """
    windows = []
    
    for hours_offset in range(0, hours_ahead, 2):  # 2-hour increments
        future_time = start_datetime + timedelta(hours=hours_offset)
        
        # Calculate future states
        tcm_state = calculate_tcm_organ_state(future_time)
        panchanga_state = calculate_panchanga_state(future_time)
        elemental_synthesis = synthesize_elements(panchanga_state, tcm_state)
        
        # Calculate potency
        potency = calculate_window_potency(tcm_state, panchanga_state, elemental_synthesis)
        
        # Include only windows above threshold
        if potency >= min_potency:
            windows.append(OptimizationWindow(
                start_time=future_time.isoformat(),
                end_time=(future_time + timedelta(hours=2)).isoformat(),
                opportunity_type=f"{tcm_state.element} Element Work",
                energy_quality=f"{tcm_state.energy_direction} - {tcm_state.primary_organ}",
                recommended_activities=tcm_state.optimal_activities[:3],
                potency_score=potency
            ))
    
    # Sort by potency (highest first) and return top 5
    return sorted(windows, key=lambda w: w.potency_score, reverse=True)[:5]
```

---

## 6. Timezone Handling

### 6.1 Local to Universal Time Conversion

```python
from datetime import datetime, timezone
import pytz

def convert_to_utc(local_dt: datetime, tz_str: str) -> datetime:
    """Convert local datetime to UTC for astronomical calculations."""
    tz = pytz.timezone(tz_str)
    local = tz.localize(local_dt) if local_dt.tzinfo is None else local_dt
    return local.astimezone(timezone.utc)

def convert_from_utc(utc_dt: datetime, tz_str: str) -> datetime:
    """Convert UTC datetime to local timezone for display."""
    tz = pytz.timezone(tz_str)
    return utc_dt.astimezone(tz)
```

### 6.2 TCM Clock Timezone Adjustment

TCM Organ Clock is based on **local solar time**, not clock time:

```latex
\text{Solar Hour} = \text{Local Hour} + \frac{\text{Longitude} - \text{Standard Meridian}}{15°}
```

```python
def calculate_solar_hour(local_dt: datetime, longitude: float, tz_str: str) -> int:
    """
    Calculate solar hour (body's internal clock time).
    
    Args:
        local_dt: Local datetime
        longitude: Location longitude
        tz_str: Timezone string
    
    Returns:
        Solar hour (0-23)
    """
    # Get timezone's standard meridian
    tz_offset_hours = get_timezone_offset(tz_str)
    standard_meridian = tz_offset_hours * 15
    
    # Calculate solar time adjustment
    solar_adjustment = (longitude - standard_meridian) / 15
    
    # Apply to local time
    solar_hour = (local_dt.hour + solar_adjustment) % 24
    
    return int(solar_hour)
```

---

## 7. Implementation Constants

### Precision and Tolerances

```python
# Temporal precision
MINUTE_PRECISION = 1  # Minutes
SECOND_PRECISION = 60  # Seconds for astronomical calculations

# Calculation tolerances
NAKSHATRA_DEGREE_TOLERANCE = 0.001  # Degrees
TITHI_ANGLE_TOLERANCE = 0.01  # Degrees
HARMONY_EPSILON = 0.001  # Harmony score precision

# Thresholds
MIN_RESONANCE_FOR_OPTIMAL = 0.7
MIN_POTENCY_FOR_WINDOW = 0.6
MAX_PREDICTION_HOURS = 168  # 1 week
```

### Reference Tables

Complete reference data located in:
- `/data/tcm_organ_clock.json` - Full organ schedule with practices
- `/data/vedic_tcm_correspondences.json` - Elemental mappings
- `/data/panchanga_qualities.json` - Tithi, nakshatra, yoga qualities

---

## Performance Optimization

### Caching Strategy

```python
from functools import lru_cache

@lru_cache(maxsize=24)
def get_tcm_organ_for_hour(hour: int) -> Tuple[str, str]:
    """Cache organ lookups (24 possible hours)."""
    return calculate_tcm_organ(hour)

@lru_cache(maxsize=128)
def get_elemental_harmony(vedic: str, tcm: str) -> float:
    """Cache harmony calculations."""
    return VEDIC_TCM_HARMONY_TABLE.get((vedic, tcm), 0.5)
```

### Batch Calculations

```python
def batch_calculate_windows(datetimes: List[datetime]) -> List[OptimizationWindow]:
    """Vectorized calculation for multiple time points."""
    # Use NumPy for vectorized operations when available
    import numpy as np
    
    hours = np.array([dt.hour for dt in datetimes])
    # ... vectorized calculations
    
    return windows
```

---

## Validation & Testing

### Unit Test Examples

```python
def test_organ_clock_continuity():
    """Verify organ clock has no gaps."""
    for hour in range(24):
        organ, element = get_current_organ(hour)
        assert organ != "Unknown"
        assert element in ["Wood", "Fire", "Earth", "Metal", "Water"]

def test_elemental_harmony_symmetry():
    """Verify harmony calculations are consistent."""
    for (v, t), score in VEDIC_TCM_HARMONY_TABLE.items():
        assert 0 <= score <= 1.0
        # Verify generating cycle logic
        if score > 0.7:
            assert (t, v) in VEDIC_TCM_HARMONY_TABLE  # Reciprocal exists

def test_resonance_bounds():
    """Verify resonance always in valid range."""
    for _ in range(1000):  # Random sampling
        resonance = calculate_personal_resonance(...)
        assert 0 <= resonance <= 1.0
```

---

## References

- **Traditional Chinese Medicine**: *Yellow Emperor's Classic of Internal Medicine*
- **Vedic Astrology**: *Brihat Parashara Hora Shastra*
- **Five Element Theory**: Classical TCM texts
- **Swiss Ephemeris**: Astronomical calculations
- **Panchanga**: Traditional Vedic calendar systems
