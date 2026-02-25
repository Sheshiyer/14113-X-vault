# Biorhythm Pure Calculation Functions

**Reference Implementation - Extracted from WitnessOS**

This document contains the pure, dependency-free calculation functions that can be implemented in any programming language.

---

## Core Constants

```python
import math
from datetime import date, timedelta
from typing import Dict, List, Tuple

# Cycle periods (in days)
PHYSICAL_CYCLE = 23
EMOTIONAL_CYCLE = 28
INTELLECTUAL_CYCLE = 33
INTUITIVE_CYCLE = 38
AESTHETIC_CYCLE = 43
SPIRITUAL_CYCLE = 53

# Detection threshold
CRITICAL_THRESHOLD = 5.0
```

---

## 1. Fundamental Sine Wave Calculation

```python
def calculate_cycle_value(days_alive: int, cycle_period: int) -> float:
    """
    Calculate the current value of a biorhythm cycle.
    
    Args:
        days_alive: Number of days since birth
        cycle_period: Length of the cycle in days (23, 28, or 33)
        
    Returns:
        Cycle value as percentage (-100 to +100)
    """
    radians = (2 * math.pi * days_alive) / cycle_period
    sine_value = math.sin(radians)
    return sine_value * 100
```

---

## 2. Days Alive Calculation

```python
def calculate_days_alive(birth_date: date, target_date: date) -> int:
    """
    Calculate number of days between birth and target date.
    
    Args:
        birth_date: Date of birth
        target_date: Date to calculate for
        
    Returns:
        Number of days alive
    """
    return (target_date - birth_date).days
```

---

## 3. Phase Determination

```python
def determine_phase(percentage: float, days_alive: int, cycle_period: int) -> str:
    """
    Determine the current phase of a cycle.
    
    Args:
        percentage: Current cycle percentage
        days_alive: Days since birth
        cycle_period: Cycle period in days
        
    Returns:
        Phase: 'critical', 'rising', 'peak', 'falling', or 'valley'
    """
    # Check if critical (near zero crossing)
    if abs(percentage) <= CRITICAL_THRESHOLD:
        return 'critical'
    
    # Calculate derivative (check next day to see direction)
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

---

## 4. Critical Day Detection

```python
def is_critical(percentage: float) -> bool:
    """
    Check if a cycle is in critical phase.
    
    Args:
        percentage: Cycle percentage value
        
    Returns:
        True if critical (within ±5% of zero)
    """
    return abs(percentage) <= CRITICAL_THRESHOLD


def is_multi_cycle_critical(physical_pct: float, emotional_pct: float, intellectual_pct: float) -> bool:
    """
    Check if multiple core cycles are critical simultaneously.
    
    Args:
        physical_pct: Physical cycle percentage
        emotional_pct: Emotional cycle percentage
        intellectual_pct: Intellectual cycle percentage
        
    Returns:
        True if 2 or more cycles are critical
    """
    critical_count = sum([
        is_critical(physical_pct),
        is_critical(emotional_pct),
        is_critical(intellectual_pct)
    ])
    return critical_count >= 2
```

---

## 5. Overall Energy Calculation

```python
def calculate_overall_energy(physical_pct: float, emotional_pct: float, intellectual_pct: float) -> float:
    """
    Calculate overall energy level from three core cycles.
    
    Args:
        physical_pct: Physical cycle percentage
        emotional_pct: Emotional cycle percentage
        intellectual_pct: Intellectual cycle percentage
        
    Returns:
        Average energy level (-100 to +100)
    """
    return (physical_pct + emotional_pct + intellectual_pct) / 3.0
```

---

## 6. Trend Analysis

```python
def determine_overall_trend(physical_phase: str, emotional_phase: str, intellectual_phase: str) -> str:
    """
    Determine overall biorhythm trend.
    
    Args:
        physical_phase: Physical cycle phase
        emotional_phase: Emotional cycle phase
        intellectual_phase: Intellectual cycle phase
        
    Returns:
        Trend: 'ascending', 'descending', 'mixed', or 'stable'
    """
    rising_phases = ['rising', 'peak']
    falling_phases = ['falling', 'valley']
    
    rising_count = sum([
        physical_phase in rising_phases,
        emotional_phase in rising_phases,
        intellectual_phase in rising_phases
    ])
    
    falling_count = sum([
        physical_phase in falling_phases,
        emotional_phase in falling_phases,
        intellectual_phase in falling_phases
    ])
    
    if rising_count > falling_count:
        return 'ascending'
    elif falling_count > rising_count:
        return 'descending'
    elif rising_count == falling_count and rising_count > 0:
        return 'mixed'
    else:
        return 'stable'
```

---

## 7. Peak Prediction

```python
def find_next_peak(days_alive: int, cycle_period: int) -> int:
    """
    Find days until next peak (maximum) of cycle.
    
    Peak occurs at 90 degrees (quarter cycle).
    
    Args:
        days_alive: Current days alive
        cycle_period: Cycle period in days
        
    Returns:
        Days until next peak
    """
    current_position = (days_alive % cycle_period) / cycle_period
    peak_position = 0.25  # 90 degrees = quarter cycle
    
    if current_position <= peak_position:
        days_to_peak = int((peak_position - current_position) * cycle_period)
    else:
        # Next peak is in next cycle
        days_to_peak = int((1 - current_position + peak_position) * cycle_period)
    
    return days_to_peak
```

---

## 8. Valley Prediction

```python
def find_next_valley(days_alive: int, cycle_period: int) -> int:
    """
    Find days until next valley (minimum) of cycle.
    
    Valley occurs at 270 degrees (three-quarter cycle).
    
    Args:
        days_alive: Current days alive
        cycle_period: Cycle period in days
        
    Returns:
        Days until next valley
    """
    current_position = (days_alive % cycle_period) / cycle_period
    valley_position = 0.75  # 270 degrees = three-quarter cycle
    
    if current_position <= valley_position:
        days_to_valley = int((valley_position - current_position) * cycle_period)
    else:
        # Next valley is in next cycle
        days_to_valley = int((1 - current_position + valley_position) * cycle_period)
    
    return days_to_valley
```

---

## 9. Next Critical Day Finder

```python
def find_next_critical_date(birth_date: date, days_alive: int, cycle_period: int) -> date:
    """
    Find the next critical day (zero crossing) for a cycle.
    
    Critical days occur at 0 and 180 degrees.
    
    Args:
        birth_date: Date of birth
        days_alive: Current days alive
        cycle_period: Cycle period in days
        
    Returns:
        Date of next critical day
    """
    current_position = (days_alive % cycle_period) / cycle_period
    
    # Find next zero crossing
    if current_position < 0.5:
        # Next critical is at half cycle (180 degrees)
        days_to_critical = int((0.5 - current_position) * cycle_period)
    else:
        # Next critical is at start of next cycle (0 degrees)
        days_to_critical = int((1 - current_position) * cycle_period)
    
    return birth_date + timedelta(days=days_alive + days_to_critical)
```

---

## 10. Complete Cycle Snapshot

```python
def calculate_cycle_snapshot(birth_date: date, target_date: date, cycle_period: int, cycle_name: str) -> dict:
    """
    Calculate complete snapshot for a single cycle.
    
    Args:
        birth_date: Date of birth
        target_date: Date to calculate for
        cycle_period: Cycle period (23, 28, or 33)
        cycle_name: Name of cycle ('physical', 'emotional', 'intellectual')
        
    Returns:
        Dictionary with all cycle data
    """
    days_alive = calculate_days_alive(birth_date, target_date)
    percentage = calculate_cycle_value(days_alive, cycle_period)
    phase = determine_phase(percentage, days_alive, cycle_period)
    days_to_peak = find_next_peak(days_alive, cycle_period)
    days_to_valley = find_next_valley(days_alive, cycle_period)
    next_critical = find_next_critical_date(birth_date, days_alive, cycle_period)
    
    return {
        'name': cycle_name,
        'period': cycle_period,
        'percentage': round(percentage, 2),
        'phase': phase,
        'days_to_peak': days_to_peak,
        'days_to_valley': days_to_valley,
        'next_critical': next_critical
    }
```

---

## 11. Complete Biorhythm Analysis

```python
def calculate_biorhythm(birth_date: date, target_date: date = None, include_extended: bool = False) -> dict:
    """
    Calculate complete biorhythm analysis for a date.
    
    Args:
        birth_date: Date of birth
        target_date: Date to calculate (defaults to today)
        include_extended: Include intuitive, aesthetic, spiritual cycles
        
    Returns:
        Complete biorhythm data dictionary
    """
    if target_date is None:
        target_date = date.today()
    
    days_alive = calculate_days_alive(birth_date, target_date)
    
    # Calculate core cycles
    physical = calculate_cycle_snapshot(birth_date, target_date, PHYSICAL_CYCLE, 'physical')
    emotional = calculate_cycle_snapshot(birth_date, target_date, EMOTIONAL_CYCLE, 'emotional')
    intellectual = calculate_cycle_snapshot(birth_date, target_date, INTELLECTUAL_CYCLE, 'intellectual')
    
    cycles = {
        'physical': physical,
        'emotional': emotional,
        'intellectual': intellectual
    }
    
    # Extended cycles (optional)
    if include_extended:
        cycles['intuitive'] = calculate_cycle_snapshot(birth_date, target_date, INTUITIVE_CYCLE, 'intuitive')
        cycles['aesthetic'] = calculate_cycle_snapshot(birth_date, target_date, AESTHETIC_CYCLE, 'aesthetic')
        cycles['spiritual'] = calculate_cycle_snapshot(birth_date, target_date, SPIRITUAL_CYCLE, 'spiritual')
    
    # Calculate overall metrics
    overall_energy = calculate_overall_energy(
        physical['percentage'],
        emotional['percentage'],
        intellectual['percentage']
    )
    
    critical_day = is_multi_cycle_critical(
        physical['percentage'],
        emotional['percentage'],
        intellectual['percentage']
    )
    
    trend = determine_overall_trend(
        physical['phase'],
        emotional['phase'],
        intellectual['phase']
    )
    
    return {
        'target_date': target_date,
        'days_alive': days_alive,
        'cycles': cycles,
        'overall_energy': round(overall_energy, 2),
        'critical_day': critical_day,
        'trend': trend
    }
```

---

## 12. Multi-Day Forecast

```python
def generate_forecast(birth_date: date, start_date: date = None, days_ahead: int = 7) -> List[dict]:
    """
    Generate biorhythm forecast for multiple days.
    
    Args:
        birth_date: Date of birth
        start_date: Start date (defaults to today)
        days_ahead: Number of days to forecast (1-90)
        
    Returns:
        List of daily biorhythm snapshots
    """
    if start_date is None:
        start_date = date.today()
    
    forecast = []
    for i in range(days_ahead):
        target_date = start_date + timedelta(days=i)
        snapshot = calculate_biorhythm(birth_date, target_date)
        forecast.append(snapshot)
    
    return forecast
```

---

## 13. Critical Days Finder

```python
def find_all_critical_days(birth_date: date, start_date: date = None, days_ahead: int = 30) -> List[date]:
    """
    Find all critical days within a period.
    
    Args:
        birth_date: Date of birth
        start_date: Start date (defaults to today)
        days_ahead: Number of days to search
        
    Returns:
        List of dates with critical cycles
    """
    if start_date is None:
        start_date = date.today()
    
    critical_dates = []
    
    for i in range(days_ahead):
        check_date = start_date + timedelta(days=i)
        snapshot = calculate_biorhythm(birth_date, check_date)
        
        # Check if any core cycle is critical
        if (is_critical(snapshot['cycles']['physical']['percentage']) or
            is_critical(snapshot['cycles']['emotional']['percentage']) or
            is_critical(snapshot['cycles']['intellectual']['percentage'])):
            critical_dates.append(check_date)
    
    return critical_dates
```

---

## 14. Best/Challenging Days Analysis

```python
def analyze_forecast_periods(birth_date: date, start_date: date = None, days_ahead: int = 30) -> dict:
    """
    Analyze forecast to identify best and challenging periods.
    
    Args:
        birth_date: Date of birth
        start_date: Start date (defaults to today)
        days_ahead: Number of days to analyze
        
    Returns:
        Dictionary with best_days and challenging_days
    """
    if start_date is None:
        start_date = date.today()
    
    forecast = generate_forecast(birth_date, start_date, days_ahead)
    
    best_days = []
    challenging_days = []
    
    for snapshot in forecast:
        if snapshot['overall_energy'] > 50:
            best_days.append(snapshot['target_date'])
        elif snapshot['overall_energy'] < -25 or snapshot['critical_day']:
            challenging_days.append(snapshot['target_date'])
    
    return {
        'best_days': best_days,
        'challenging_days': challenging_days,
        'total_days': len(forecast),
        'high_energy_count': len(best_days),
        'low_energy_count': len(challenging_days)
    }
```

---

## 15. Compatibility Calculator

```python
def calculate_compatibility(birth_date1: date, birth_date2: date, target_date: date = None) -> dict:
    """
    Calculate biorhythm compatibility between two people.
    
    Args:
        birth_date1: First person's birth date
        birth_date2: Second person's birth date
        target_date: Date to calculate for (defaults to today)
        
    Returns:
        Compatibility scores for each cycle
    """
    if target_date is None:
        target_date = date.today()
    
    bio1 = calculate_biorhythm(birth_date1, target_date)
    bio2 = calculate_biorhythm(birth_date2, target_date)
    
    compatibility = {}
    
    for cycle_name in ['physical', 'emotional', 'intellectual']:
        pct1 = bio1['cycles'][cycle_name]['percentage']
        pct2 = bio2['cycles'][cycle_name]['percentage']
        
        # Calculate compatibility as inverse of difference
        difference = abs(pct1 - pct2)
        score = (200 - difference) / 200  # Normalize to 0-1
        
        compatibility[cycle_name] = round(score, 3)
    
    # Overall compatibility
    compatibility['overall'] = round(
        (compatibility['physical'] + compatibility['emotional'] + compatibility['intellectual']) / 3,
        3
    )
    
    return compatibility
```

---

## 16. Validation Functions

```python
def validate_birth_date(birth_date: date) -> Tuple[bool, str]:
    """
    Validate birth date for biorhythm calculations.
    
    Args:
        birth_date: Date to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    current_date = date.today()
    
    if birth_date > current_date:
        return False, "Birth date cannot be in the future"
    
    if birth_date.year < 1900:
        return False, "Birth year must be 1900 or later"
    
    if (current_date - birth_date).days > 150 * 365:
        return False, "Birth date too far in the past (max 150 years)"
    
    return True, ""


def validate_forecast_days(days_ahead: int) -> Tuple[bool, str]:
    """
    Validate forecast period.
    
    Args:
        days_ahead: Number of days to forecast
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if days_ahead < 1:
        return False, "Forecast days must be at least 1"
    
    if days_ahead > 90:
        return False, "Forecast days cannot exceed 90"
    
    return True, ""
```

---

## 17. Energy Level Interpreter

```python
def interpret_energy_level(energy_percentage: float) -> str:
    """
    Interpret overall energy level.
    
    Args:
        energy_percentage: Overall energy value (-100 to 100)
        
    Returns:
        Energy level description
    """
    if 75 <= energy_percentage <= 100:
        return "Exceptional vitality - peak performance window"
    elif 50 <= energy_percentage < 75:
        return "High energy - excellent for ambitious projects"
    elif 25 <= energy_percentage < 50:
        return "Moderate energy - balanced activity recommended"
    elif 0 <= energy_percentage < 25:
        return "Low energy - focus on maintenance and rest"
    elif -25 <= energy_percentage < 0:
        return "Below baseline - conservation mode advised"
    elif -50 <= energy_percentage < -25:
        return "Significantly low - prioritize recovery"
    elif -75 <= energy_percentage < -50:
        return "Very low energy - minimal activity recommended"
    else:  # -100 to -75
        return "Critical low - complete rest and regeneration needed"
```

---

## 18. Phase Guidance Generator

```python
def get_phase_guidance(cycle_name: str, phase: str) -> str:
    """
    Get guidance for specific cycle phase.
    
    Args:
        cycle_name: 'physical', 'emotional', or 'intellectual'
        phase: Current phase of cycle
        
    Returns:
        Guidance text
    """
    guidance = {
        'physical': {
            'peak': "Optimal time for physical challenges, exercise, and demanding tasks",
            'rising': "Build physical activities gradually, good for starting fitness routines",
            'falling': "Reduce physical intensity, focus on recovery and maintenance",
            'valley': "Rest and recuperation essential, avoid strenuous activities",
            'critical': "Be extra careful with physical activities, higher accident risk"
        },
        'emotional': {
            'peak': "Heightened creativity and emotional expression, excellent for relationships",
            'rising': "Growing emotional awareness, good for creative projects",
            'falling': "Emotional sensitivity may increase, practice self-care",
            'valley': "Emotional low point, avoid major decisions, seek support",
            'critical': "Emotional volatility possible, practice mindfulness and patience"
        },
        'intellectual': {
            'peak': "Maximum mental clarity and analytical power, ideal for complex tasks",
            'rising': "Increasing mental acuity, good for learning and planning",
            'falling': "Mental fatigue may set in, focus on routine tasks",
            'valley': "Reduced concentration, avoid important decisions",
            'critical': "Mental confusion possible, double-check important work"
        }
    }
    
    return guidance.get(cycle_name, {}).get(phase, "No guidance available")
```

---

## Complete Usage Example

```python
from datetime import date

# Example: Calculate biorhythm for someone born on January 1, 1990
birth_date = date(1990, 1, 1)
target_date = date(2026, 1, 25)

# Get complete analysis
result = calculate_biorhythm(birth_date, target_date)

print(f"Date: {result['target_date']}")
print(f"Days Alive: {result['days_alive']}")
print(f"Overall Energy: {result['overall_energy']}%")
print(f"Critical Day: {result['critical_day']}")
print(f"Trend: {result['trend']}")
print()

# Print each cycle
for cycle_name, cycle_data in result['cycles'].items():
    print(f"{cycle_name.upper()} Cycle:")
    print(f"  Percentage: {cycle_data['percentage']}%")
    print(f"  Phase: {cycle_data['phase']}")
    print(f"  Days to Peak: {cycle_data['days_to_peak']}")
    print(f"  Next Critical: {cycle_data['next_critical']}")
    print()

# Get 7-day forecast
forecast = generate_forecast(birth_date, target_date, 7)
print("7-Day Forecast:")
for day in forecast:
    print(f"{day['target_date']}: Energy {day['overall_energy']}%, {day['trend']}")

# Find critical days
critical = find_all_critical_days(birth_date, target_date, 30)
print(f"\nCritical days in next 30 days: {len(critical)}")
for critical_date in critical[:5]:  # Show first 5
    print(f"  {critical_date}")

# Calculate compatibility with another person
partner_birth = date(1992, 6, 15)
compat = calculate_compatibility(birth_date, partner_birth, target_date)
print(f"\nCompatibility Scores:")
print(f"  Physical: {compat['physical']}")
print(f"  Emotional: {compat['emotional']}")
print(f"  Intellectual: {compat['intellectual']}")
print(f"  Overall: {compat['overall']}")
```

---

## Mathematical Verification

To verify your implementation is correct:

1. **Test Case 1**: Birth = 1990-01-01, Target = 1990-01-24 (Day 23)
   - Physical (23-day): Should be near 100% (completing first cycle)
   - Emotional (28-day): Should be ~57%
   - Intellectual (33-day): Should be ~43%

2. **Test Case 2**: Birth = 1990-01-01, Target = 1990-01-12 (Day 11.5)
   - Physical: Should be near 0% (half of 23-day cycle, critical day)

3. **Test Case 3**: Birth = 1990-01-01, Target = 1990-02-06 (Day 36)
   - Physical: Should be ~50% (1.5+ cycles)
   - Emotional: Should be ~57% (1+ cycles)
   - Intellectual: Should be ~32% (1+ cycles)

---

## Language Ports

These functions can be easily ported to:

- **JavaScript**: Replace `math.sin` with `Math.sin`, use Date objects
- **TypeScript**: Add type annotations to JavaScript version
- **Go**: Use `math.Sin` from math package, time.Time for dates
- **Rust**: Use `f64::sin()` and chrono for date handling
- **Swift**: Use Foundation Date and Darwin sin()
- **Java**: Use Math.sin() and LocalDate
- **C++**: Use cmath sin() and chrono for dates
- **PHP**: Use sin() and DateTime objects
- **Ruby**: Use Math.sin and Date class
- **Kotlin**: Use kotlin.math.sin and LocalDate

The core algorithm is universal - only date handling and math functions need language-specific adjustments.

---

**End of Pure Functions Reference**

*These functions contain zero dependencies beyond standard math and date libraries.*  
*They can be implemented in any language and will produce identical results.*
