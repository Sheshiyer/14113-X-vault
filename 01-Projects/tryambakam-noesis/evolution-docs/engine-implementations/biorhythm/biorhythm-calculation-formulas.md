# Biorhythm Calculation Formulas & Mathematical Foundation

> **Complete mathematical specification for WitnessOS Biorhythm Synchronizer Engine**  
> Extracted from: `biorhythm.py` & `biorhythm_models.py`

---

## Table of Contents

1. [Core Mathematical Principles](#core-mathematical-principles)
2. [Sine Wave Cycle Formulas](#sine-wave-cycle-formulas)
3. [Phase Classification Algorithm](#phase-classification-algorithm)
4. [Critical Day Detection](#critical-day-detection)
5. [Energy Level Computation](#energy-level-computation)
6. [Compatibility Algorithms](#compatibility-algorithms)
7. [Forecast Generation](#forecast-generation)
8. [Extended Cycle Mathematics](#extended-cycle-mathematics)
9. [Synchronization Scoring](#synchronization-scoring)
10. [Trend Analysis](#trend-analysis)

---

## 1. Core Mathematical Principles

### 1.1 Foundational Theory

Biorhythm theory posits that human life follows predictable sine wave patterns from birth. Each cycle has a fixed period and oscillates between +100% (peak) and -100% (valley).

**Universal Biorhythm Formula:**

$$
R(t) = 100 \times \sin\left(\frac{2\pi(t - t_0)}{P}\right)
$$

Where:
- $R(t)$ = Rhythm value at time $t$ (percentage: -100 to +100)
- $t$ = Target date (days since epoch)
- $t_0$ = Birth date (days since epoch)
- $P$ = Period of the cycle (days)
- $(t - t_0)$ = Days alive

### 1.2 Time Calculation

**Days Alive Calculation:**

$$
\Delta t = (t_{\text{target}} - t_{\text{birth}})
$$

Where:
- $\Delta t$ = Total days alive
- $t_{\text{target}}$ = Target date for calculation
- $t_{\text{birth}}$ = Birth date

**Epoch Conversion (Python implementation):**
```python
from datetime import date

def calculate_days_alive(birth_date: date, target_date: date) -> int:
    """
    Calculate total days alive from birth to target date.
    
    Args:
        birth_date: Date of birth
        target_date: Date to calculate for
        
    Returns:
        Integer number of days alive
    """
    return (target_date - birth_date).days
```

---

## 2. Sine Wave Cycle Formulas

### 2.1 Physical Cycle

**Formula:**

$$
P_{\text{physical}}(t) = 100 \times \sin\left(\frac{2\pi(t - t_0)}{23}\right)
$$

**Characteristics:**
- **Period:** 23 days
- **Governs:** Physical strength, stamina, coordination, immune system
- **Peak Performance:** At +100%
- **Recovery Needed:** At -100%

**Mathematical Properties:**
```
Frequency (f) = 1/23 cycles per day
Angular frequency (ω) = 2π/23 ≈ 0.273 radians/day
Complete cycles per year ≈ 365/23 ≈ 15.87 cycles
```

### 2.2 Emotional Cycle

**Formula:**

$$
E_{\text{emotional}}(t) = 100 \times \sin\left(\frac{2\pi(t - t_0)}{28}\right)
$$

**Characteristics:**
- **Period:** 28 days
- **Governs:** Mood, creativity, emotional sensitivity, artistic expression
- **Peak:** Maximum emotional awareness and creative output
- **Valley:** Emotional withdrawal and introspection

**Mathematical Properties:**
```
Frequency (f) = 1/28 cycles per day
Angular frequency (ω) = 2π/28 ≈ 0.224 radians/day
Complete cycles per year ≈ 365/28 ≈ 13.04 cycles
```

### 2.3 Intellectual Cycle

**Formula:**

$$
I_{\text{intellectual}}(t) = 100 \times \sin\left(\frac{2\pi(t - t_0)}{33}\right)
$$

**Characteristics:**
- **Period:** 33 days
- **Governs:** Mental clarity, analytical ability, memory, judgment
- **Peak:** Maximum cognitive performance
- **Valley:** Mental fatigue and reduced concentration

**Mathematical Properties:**
```
Frequency (f) = 1/33 cycles per day
Angular frequency (ω) = 2π/33 ≈ 0.190 radians/day
Complete cycles per year ≈ 365/33 ≈ 11.06 cycles
```

### 2.4 Unified Cycle Calculation

**Implementation:**

```python
import math
from typing import Dict

def calculate_cycle_value(days_alive: int, period: int) -> float:
    """
    Calculate sine wave value for a given cycle.
    
    Args:
        days_alive: Total days since birth
        period: Cycle period in days
        
    Returns:
        Cycle percentage value (-100 to +100)
    """
    radians = (2 * math.pi * days_alive) / period
    return 100 * math.sin(radians)

def calculate_all_core_cycles(days_alive: int) -> Dict[str, float]:
    """
    Calculate all three core biorhythm cycles.
    
    Args:
        days_alive: Total days since birth
        
    Returns:
        Dictionary with physical, emotional, intellectual percentages
    """
    return {
        'physical': calculate_cycle_value(days_alive, 23),
        'emotional': calculate_cycle_value(days_alive, 28),
        'intellectual': calculate_cycle_value(days_alive, 33)
    }
```

---

## 3. Phase Classification Algorithm

### 3.1 Phase Definitions

Each cycle is classified into one of five phases based on its current percentage and derivative:

| Phase | Value Range | Description |
|-------|-------------|-------------|
| **Critical** | -2% to +2% | Zero-crossing transition zone |
| **Rising** | +2% to +85% | Ascending toward peak |
| **Peak** | +85% to +100% | Maximum energy zone |
| **Falling** | +2% to -85% | Descending toward valley |
| **Valley** | -85% to -100% | Minimum energy zone |

### 3.2 Phase Classification Formula

**Mathematical Definition:**

$$
\text{Phase}(R) = \begin{cases}
\text{critical} & \text{if } |R| \leq 2 \\
\text{peak} & \text{if } R > 85 \\
\text{valley} & \text{if } R < -85 \\
\text{rising} & \text{if } 2 < R \leq 85 \text{ and } \frac{dR}{dt} > 0 \\
\text{falling} & \text{if } -85 \leq R < -2 \text{ and } \frac{dR}{dt} < 0
\end{cases}
$$

### 3.3 Derivative Calculation

To determine if a cycle is rising or falling:

$$
\frac{dR}{dt} = \frac{200\pi}{P} \cos\left(\frac{2\pi(t - t_0)}{P}\right)
$$

**Implementation:**

```python
import math

def calculate_phase(percentage: float, days_alive: int, period: int) -> str:
    """
    Classify the current phase of a biorhythm cycle.
    
    Args:
        percentage: Current cycle percentage (-100 to +100)
        days_alive: Days since birth
        period: Cycle period in days
        
    Returns:
        Phase name: 'critical', 'peak', 'valley', 'rising', or 'falling'
    """
    # Critical phase (near zero crossing)
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
    
    # Rising or falling based on derivative
    if percentage > 2:
        return 'rising' if derivative > 0 else 'falling'
    else:
        return 'falling' if derivative < 0 else 'rising'
```

---

## 4. Critical Day Detection

### 4.1 Critical Day Definition

A **critical day** occurs when two or more cycles cross the zero point (critical phase) simultaneously. These days represent heightened sensitivity and potential instability.

### 4.2 Critical Day Detection Algorithm

**Mathematical Condition:**

$$
\text{Critical Day} = \sum_{i=1}^{n} \mathbb{1}_{|R_i(t)| \leq 2} \geq 2
$$

Where:
- $\mathbb{1}$ = Indicator function (1 if condition true, 0 otherwise)
- $R_i(t)$ = Value of cycle $i$ at time $t$
- $n$ = Number of cycles being tracked

**Implementation:**

```python
from typing import List, Dict

def is_critical_day(cycles: Dict[str, float], threshold: float = 2.0) -> bool:
    """
    Determine if current day is a critical day.
    
    A critical day occurs when 2+ cycles are within threshold of zero.
    
    Args:
        cycles: Dictionary of cycle names to percentages
        threshold: Critical zone threshold (default: 2%)
        
    Returns:
        True if critical day, False otherwise
    """
    core_cycles = ['physical', 'emotional', 'intellectual']
    critical_count = sum(
        1 for cycle_name in core_cycles
        if cycle_name in cycles and abs(cycles[cycle_name]) <= threshold
    )
    return critical_count >= 2
```

### 4.3 Finding Critical Days in Date Range

**Algorithm:**

For each day $t$ in range $[t_{\text{start}}, t_{\text{end}}]$:
1. Calculate all cycle values
2. Count cycles in critical phase
3. If count ≥ 2, mark as critical day

**Implementation:**

```python
from datetime import date, timedelta
from typing import List

def find_critical_days(
    birth_date: date,
    start_date: date,
    forecast_days: int,
    threshold: float = 2.0
) -> List[date]:
    """
    Find all critical days within a forecast period.
    
    Args:
        birth_date: Date of birth
        start_date: Start of forecast period
        forecast_days: Number of days to forecast
        threshold: Critical zone threshold (default: 2%)
        
    Returns:
        List of dates that are critical days
    """
    critical_dates = []
    
    for day_offset in range(forecast_days):
        target = start_date + timedelta(days=day_offset)
        days_alive = (target - birth_date).days
        
        # Calculate core cycles
        cycles = calculate_all_core_cycles(days_alive)
        
        # Check if critical day
        if is_critical_day(cycles, threshold):
            critical_dates.append(target)
    
    return critical_dates
```

### 4.4 Next Critical Day Prediction

**For Individual Cycle:**

The next zero-crossing occurs when:

$$
\sin\left(\frac{2\pi(t_{\text{next}} - t_0)}{P}\right) = 0
$$

Solving for $t_{\text{next}}$:

$$
t_{\text{next}} = t_0 + \frac{P \cdot n}{2}
$$

Where $n$ is the next integer making $t_{\text{next}} > t_{\text{current}}$

**Implementation:**

```python
import math
from datetime import date, timedelta

def calculate_next_critical(
    birth_date: date,
    current_date: date,
    period: int
) -> date:
    """
    Calculate the next critical day for a specific cycle.
    
    Args:
        birth_date: Date of birth
        current_date: Current date
        period: Cycle period in days
        
    Returns:
        Date of next zero-crossing
    """
    days_alive = (current_date - birth_date).days
    
    # Calculate current position in cycle
    cycle_position = days_alive % period
    
    # Calculate days until next zero crossing
    # Zero crossings occur at 0, P/2, P, 3P/2, etc.
    half_period = period / 2
    
    if cycle_position < half_period:
        days_until = half_period - cycle_position
    else:
        days_until = period - cycle_position
    
    return current_date + timedelta(days=int(days_until))
```

---

## 5. Energy Level Computation

### 5.1 Overall Energy Formula

The overall energy level is the average of all active cycles:

$$
E_{\text{overall}} = \frac{1}{n} \sum_{i=1}^{n} R_i(t)
$$

Where:
- $E_{\text{overall}}$ = Overall energy percentage
- $n$ = Number of active cycles (3 for core, up to 6 with extended)
- $R_i(t)$ = Value of cycle $i$ at time $t$

**For Core Cycles Only:**

$$
E_{\text{overall}} = \frac{P(t) + E(t) + I(t)}{3}
$$

### 5.2 Implementation

```python
from typing import Dict

def calculate_overall_energy(cycles: Dict[str, float]) -> float:
    """
    Calculate overall energy level from all cycles.
    
    Args:
        cycles: Dictionary of cycle names to percentages
        
    Returns:
        Average energy percentage across all cycles
    """
    if not cycles:
        return 0.0
    
    return sum(cycles.values()) / len(cycles)
```

### 5.3 Energy Rating Classification

**Energy Rating Ranges:**

| Rating | Range | Description |
|--------|-------|-------------|
| **Exceptional** | 75% to 100% | Peak performance window |
| **High** | 50% to 75% | Excellent for ambitious projects |
| **Moderate** | 25% to 50% | Balanced activity recommended |
| **Low** | 0% to 25% | Focus on maintenance and rest |
| **Below Baseline** | -25% to 0% | Conservation mode advised |
| **Significantly Low** | -50% to -25% | Prioritize recovery |
| **Very Low** | -75% to -50% | Minimal activity recommended |
| **Critical Low** | -100% to -75% | Complete rest needed |

**Classification Function:**

```python
def classify_energy_level(overall_energy: float) -> str:
    """
    Classify overall energy level into descriptive rating.
    
    Args:
        overall_energy: Overall energy percentage (-100 to +100)
        
    Returns:
        Energy rating description
    """
    if overall_energy >= 75:
        return "Exceptional vitality - peak performance window"
    elif overall_energy >= 50:
        return "High energy - excellent for ambitious projects"
    elif overall_energy >= 25:
        return "Moderate energy - balanced activity recommended"
    elif overall_energy >= 0:
        return "Low energy - focus on maintenance and rest"
    elif overall_energy >= -25:
        return "Below baseline - conservation mode advised"
    elif overall_energy >= -50:
        return "Significantly low - prioritize recovery"
    elif overall_energy >= -75:
        return "Very low energy - minimal activity recommended"
    else:
        return "Critical low - complete rest and regeneration needed"
```

---

## 6. Compatibility Algorithms

### 6.1 Dual Biorhythm Theory

Biorhythm compatibility measures the synchronization between two individuals' cycles. High compatibility indicates similar energy patterns, while low compatibility suggests complementary or conflicting rhythms.

### 6.2 Cycle Compatibility Score

**Formula for Single Cycle Compatibility:**

$$
C_i = 1 - \frac{|R_{1,i}(t) - R_{2,i}(t)|}{200}
$$

Where:
- $C_i$ = Compatibility score for cycle $i$ (0 to 1)
- $R_{1,i}(t)$ = Person 1's cycle $i$ value at time $t$
- $R_{2,i}(t)$ = Person 2's cycle $i$ value at time $t$

**Properties:**
- Score = 1.0 when both cycles are identical
- Score = 0.0 when cycles are opposite extremes (+100 vs -100)
- Score = 0.5 when cycles differ by 100 points

### 6.3 Overall Compatibility Score

**Average Method:**

$$
C_{\text{overall}} = \frac{1}{n} \sum_{i=1}^{n} C_i
$$

**Weighted Method (optional):**

$$
C_{\text{weighted}} = w_P \cdot C_P + w_E \cdot C_E + w_I \cdot C_I
$$

Default weights:
- $w_P = 0.33$ (Physical)
- $w_E = 0.33$ (Emotional)
- $w_I = 0.34$ (Intellectual)

**Relationship-Specific Weights:**

| Relationship Type | Physical | Emotional | Intellectual |
|-------------------|----------|-----------|--------------|
| Romantic | 0.40 | 0.45 | 0.15 |
| Friendship | 0.20 | 0.50 | 0.30 |
| Business | 0.15 | 0.25 | 0.60 |
| Family | 0.30 | 0.40 | 0.30 |
| General | 0.33 | 0.33 | 0.34 |

### 6.4 Implementation

```python
from typing import Dict, Tuple

def calculate_cycle_compatibility(
    person1_value: float,
    person2_value: float
) -> float:
    """
    Calculate compatibility score for a single cycle.
    
    Args:
        person1_value: Person 1's cycle percentage
        person2_value: Person 2's cycle percentage
        
    Returns:
        Compatibility score (0.0 to 1.0)
    """
    difference = abs(person1_value - person2_value)
    return 1.0 - (difference / 200.0)

def calculate_overall_compatibility(
    person1_cycles: Dict[str, float],
    person2_cycles: Dict[str, float],
    weights: Dict[str, float] = None
) -> Tuple[Dict[str, float], float]:
    """
    Calculate overall biorhythm compatibility between two people.
    
    Args:
        person1_cycles: Person 1's cycle percentages
        person2_cycles: Person 2's cycle percentages
        weights: Optional cycle weights (defaults to equal)
        
    Returns:
        Tuple of (individual compatibility scores, overall score)
    """
    if weights is None:
        weights = {
            'physical': 0.33,
            'emotional': 0.33,
            'intellectual': 0.34
        }
    
    compatibility_scores = {}
    core_cycles = ['physical', 'emotional', 'intellectual']
    
    # Calculate individual cycle compatibility
    for cycle_name in core_cycles:
        if cycle_name in person1_cycles and cycle_name in person2_cycles:
            compatibility_scores[cycle_name] = calculate_cycle_compatibility(
                person1_cycles[cycle_name],
                person2_cycles[cycle_name]
            )
    
    # Calculate weighted overall score
    overall = sum(
        compatibility_scores[cycle] * weights[cycle]
        for cycle in core_cycles
        if cycle in compatibility_scores
    )
    
    return compatibility_scores, overall
```

### 6.5 Compatibility Interpretation

**Score Interpretation:**

| Score Range | Interpretation |
|-------------|----------------|
| 0.90 - 1.00 | Exceptional synchronization - natural harmony |
| 0.75 - 0.89 | High compatibility - strong alignment |
| 0.60 - 0.74 | Good compatibility - balanced interaction |
| 0.45 - 0.59 | Moderate compatibility - requires adjustment |
| 0.30 - 0.44 | Low compatibility - significant differences |
| 0.00 - 0.29 | Poor compatibility - opposing rhythms |

---

## 7. Forecast Generation

### 7.1 Time Series Generation

Generate biorhythm values for a range of dates:

**Algorithm:**

For each day $t$ in $[t_{\text{start}}, t_{\text{start}} + n]$:
1. Calculate $\Delta t = t - t_0$
2. Compute all cycle values using sine formulas
3. Calculate overall energy
4. Determine critical day status
5. Classify trend (ascending/descending/mixed)

### 7.2 Trend Classification

**Trend Formula:**

$$
\text{Trend}(t) = \begin{cases}
\text{ascending} & \text{if } \sum \text{sign}(\frac{dR_i}{dt}) > 0 \\
\text{descending} & \text{if } \sum \text{sign}(\frac{dR_i}{dt}) < 0 \\
\text{mixed} & \text{if } \sum \text{sign}(\frac{dR_i}{dt}) = 0 \\
\text{stable} & \text{otherwise}
\end{cases}
$$

### 7.3 Implementation

```python
from datetime import date, timedelta
from typing import List, Dict

class BiorhythmSnapshot:
    """Data class for biorhythm snapshot."""
    def __init__(
        self,
        target_date: date,
        days_alive: int,
        cycles: Dict[str, float],
        overall_energy: float,
        critical_day: bool,
        trend: str
    ):
        self.target_date = target_date
        self.days_alive = days_alive
        self.cycles = cycles
        self.overall_energy = overall_energy
        self.critical_day = critical_day
        self.trend = trend

def generate_forecast(
    birth_date: date,
    start_date: date,
    forecast_days: int
) -> List[BiorhythmSnapshot]:
    """
    Generate biorhythm forecast for specified number of days.
    
    Args:
        birth_date: Date of birth
        start_date: Start date for forecast
        forecast_days: Number of days to forecast
        
    Returns:
        List of BiorhythmSnapshot objects
    """
    forecast = []
    
    for day_offset in range(forecast_days):
        target = start_date + timedelta(days=day_offset)
        days_alive = (target - birth_date).days
        
        # Calculate cycles
        cycles = calculate_all_core_cycles(days_alive)
        
        # Calculate overall energy
        overall_energy = calculate_overall_energy(cycles)
        
        # Determine critical day
        critical_day = is_critical_day(cycles)
        
        # Determine trend
        trend = calculate_trend(days_alive)
        
        snapshot = BiorhythmSnapshot(
            target_date=target,
            days_alive=days_alive,
            cycles=cycles,
            overall_energy=overall_energy,
            critical_day=critical_day,
            trend=trend
        )
        forecast.append(snapshot)
    
    return forecast
```

---

## 8. Extended Cycle Mathematics

### 8.1 Extended Cycle Definitions

Beyond the three core cycles, extended biorhythm theory includes:

**Intuitive Cycle:**
$$
R_{\text{intuitive}}(t) = 100 \times \sin\left(\frac{2\pi(t - t_0)}{38}\right)
$$
- **Period:** 38 days
- **Governs:** Intuition, sixth sense, unconscious perception

**Aesthetic Cycle:**
$$
R_{\text{aesthetic}}(t) = 100 \times \sin\left(\frac{2\pi(t - t_0)}{43}\right)
$$
- **Period:** 43 days
- **Governs:** Artistic appreciation, beauty perception, harmony sense

**Spiritual Cycle:**
$$
R_{\text{spiritual}}(t) = 100 \times \sin\left(\frac{2\pi(t - t_0)}{53}\right)
$$
- **Period:** 53 days
- **Governs:** Spiritual awareness, inner peace, transcendence

### 8.2 Extended Cycle Implementation

```python
def calculate_all_extended_cycles(days_alive: int) -> Dict[str, float]:
    """
    Calculate all six biorhythm cycles (core + extended).
    
    Args:
        days_alive: Total days since birth
        
    Returns:
        Dictionary with all six cycle percentages
    """
    return {
        # Core cycles
        'physical': calculate_cycle_value(days_alive, 23),
        'emotional': calculate_cycle_value(days_alive, 28),
        'intellectual': calculate_cycle_value(days_alive, 33),
        
        # Extended cycles
        'intuitive': calculate_cycle_value(days_alive, 38),
        'aesthetic': calculate_cycle_value(days_alive, 43),
        'spiritual': calculate_cycle_value(days_alive, 53)
    }
```

---

## 9. Synchronization Scoring

### 9.1 Cycle Alignment Detection

**Alignment Definition:**

Cycles are considered **aligned** when they are in the same polarity (both positive or both negative).

**Alignment Score:**

$$
A(t) = \frac{1}{3} \sum_{i \in \{P,E,I\}} \text{sign}(R_i(t))
$$

Where:
- $A(t) \in \{-1, -0.33, 0.33, 1\}$
- $A(t) = 1$ : All cycles positive (maximum alignment)
- $A(t) = -1$ : All cycles negative (maximum alignment)
- $A(t) = 0.33$ or $-0.33$ : Mixed alignment

### 9.2 Synchronization Score

**Formula:**

$$
S(t) = \frac{|n_+ - n_-|}{n}
$$

Where:
- $n_+$ = Number of positive cycles
- $n_-$ = Number of negative cycles
- $n$ = Total number of cycles
- $S(t) \in [0, 1]$

**Interpretation:**
- $S = 1.0$ : Perfect synchronization (all same polarity)
- $S = 0.0$ : No synchronization (equal split)

### 9.3 Implementation

```python
from typing import Dict, Tuple, List

def analyze_cycle_synchronization(
    cycles: Dict[str, float]
) -> Dict[str, any]:
    """
    Analyze synchronization between biorhythm cycles.
    
    Args:
        cycles: Dictionary of cycle names to percentages
        
    Returns:
        Dictionary with synchronization analysis
    """
    core_cycles = ['physical', 'emotional', 'intellectual']
    
    positive_cycles = [
        name for name in core_cycles
        if name in cycles and cycles[name] > 0
    ]
    negative_cycles = [
        name for name in core_cycles
        if name in cycles and cycles[name] < 0
    ]
    
    aligned_cycles = []
    if len(positive_cycles) >= 2:
        aligned_cycles = positive_cycles
    elif len(negative_cycles) >= 2:
        aligned_cycles = negative_cycles
    
    # Calculate synchronization score
    n_pos = len(positive_cycles)
    n_neg = len(negative_cycles)
    n_total = len(core_cycles)
    sync_score = abs(n_pos - n_neg) / n_total
    
    return {
        'aligned_cycles': aligned_cycles,
        'positive_cycles': positive_cycles,
        'negative_cycles': negative_cycles,
        'synchronization_score': sync_score,
        'is_synchronized': sync_score >= 0.67  # 2 out of 3 same polarity
    }
```

---

## 10. Trend Analysis

### 10.1 Derivative-Based Trend

**Individual Cycle Trend:**

$$
T_i(t) = \text{sign}\left(\frac{dR_i}{dt}\right) = \text{sign}\left(\cos\left(\frac{2\pi(t - t_0)}{P_i}\right)\right)
$$

Where:
- $T_i(t) = +1$ : Cycle ascending
- $T_i(t) = -1$ : Cycle descending
- $T_i(t) = 0$ : Cycle at peak or valley

### 10.2 Overall Trend Classification

**Aggregate Trend:**

$$
T_{\text{overall}}(t) = \sum_{i=1}^{n} T_i(t)
$$

**Classification:**

$$
\text{Trend}(t) = \begin{cases}
\text{ascending} & \text{if } T_{\text{overall}} > 0 \\
\text{descending} & \text{if } T_{\text{overall}} < 0 \\
\text{mixed} & \text{if } T_{\text{overall}} = 0 \\
\end{cases}
$$

### 10.3 Implementation

```python
import math
from typing import Dict

def calculate_cycle_trend(days_alive: int, period: int) -> int:
    """
    Calculate trend direction for a specific cycle.
    
    Args:
        days_alive: Days since birth
        period: Cycle period in days
        
    Returns:
        +1 for ascending, -1 for descending, 0 for peak/valley
    """
    radians = (2 * math.pi * days_alive) / period
    cosine_value = math.cos(radians)
    
    if abs(cosine_value) < 0.01:  # Near peak or valley
        return 0
    return 1 if cosine_value > 0 else -1

def calculate_overall_trend(days_alive: int) -> str:
    """
    Calculate overall biorhythm trend across all core cycles.
    
    Args:
        days_alive: Days since birth
        
    Returns:
        Trend classification: 'ascending', 'descending', 'mixed', or 'stable'
    """
    periods = {
        'physical': 23,
        'emotional': 28,
        'intellectual': 33
    }
    
    trends = {
        name: calculate_cycle_trend(days_alive, period)
        for name, period in periods.items()
    }
    
    trend_sum = sum(trends.values())
    
    if trend_sum > 0:
        return 'ascending'
    elif trend_sum < 0:
        return 'descending'
    elif all(t == 0 for t in trends.values()):
        return 'stable'
    else:
        return 'mixed'
```

---

## Mathematical Validation

### Correctness Verification

**Key Properties to Verify:**

1. **Periodicity:** $R(t + P) = R(t)$
2. **Symmetry:** $R(t_0 + P/4) = -R(t_0 + 3P/4)$
3. **Zero Crossings:** $R(t_0 + nP/2) = 0$ for integer $n$
4. **Peak/Valley:** $|R(t)| \leq 100$ for all $t$

**Test Implementation:**

```python
import math

def verify_biorhythm_properties(period: int, tolerance: float = 0.001):
    """
    Verify mathematical properties of biorhythm calculations.
    
    Args:
        period: Cycle period to test
        tolerance: Acceptable error margin
    """
    days_alive_test = 1000
    
    # Test periodicity
    value_t = calculate_cycle_value(days_alive_test, period)
    value_t_plus_period = calculate_cycle_value(days_alive_test + period, period)
    assert abs(value_t - value_t_plus_period) < tolerance, "Periodicity failed"
    
    # Test zero crossing at half-period
    value_half_period = calculate_cycle_value(period // 2, period)
    assert abs(value_half_period) < tolerance, "Zero crossing failed"
    
    # Test bounds
    for days in range(0, period * 2):
        value = calculate_cycle_value(days, period)
        assert -100 <= value <= 100, "Bounds check failed"
    
    print(f"✓ All mathematical properties verified for period {period}")

# Run verification
verify_biorhythm_properties(23)
verify_biorhythm_properties(28)
verify_biorhythm_properties(33)
```

---

## References & Further Reading

1. **Fliess, Wilhelm** (1906) - *Der Ablauf des Lebens* - Original biorhythm theory
2. **Swoboda, Hermann** (1904) - *Die Perioden des menschlichen Organismus*
3. **Teltscher, Alfred** (1920s) - Introduction of intellectual cycle
4. **Thommen, George S.** (1973) - *Is This Your Day?* - Popularization of biorhythm theory
5. **Gittelson, Bernard** (1975) - *Biorhythm: A Personal Science*

---

## Appendix: Complete Cycle Periods

| Cycle | Period (Days) | Origin |
|-------|---------------|---------|
| Physical | 23 | Fliess (1906) |
| Emotional | 28 | Swoboda (1904) |
| Intellectual | 33 | Teltscher (1920s) |
| Intuitive | 38 | Modern extension |
| Aesthetic | 43 | Modern extension |
| Spiritual | 53 | Modern extension |

---

**Document Version:** 1.0  
**Last Updated:** 2026  
**Source:** WitnessOS Biorhythm Engine  
**Extracted From:** `biorhythm.py`, `biorhythm_models.py`
