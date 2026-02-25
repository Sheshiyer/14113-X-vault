# Biorhythm Quick Implementation Guide

**Purpose**: Fast-track biorhythm implementation in any project

---

## Minimal Implementation (3 Functions)

If you only implement three functions, make it these:

### 1. Calculate Cycle Value
```python
import math

def biorhythm(birth_date, target_date, cycle_days):
    """Core sine wave calculation"""
    days_alive = (target_date - birth_date).days
    radians = (2 * math.pi * days_alive) / cycle_days
    return math.sin(radians) * 100

# Usage:
physical = biorhythm(birth, today, 23)
emotional = biorhythm(birth, today, 28)
intellectual = biorhythm(birth, today, 33)
```

### 2. Determine Phase
```python
def phase(percentage):
    """Simple phase classification"""
    if abs(percentage) <= 5:
        return "critical"
    elif percentage > 75:
        return "peak"
    elif percentage > 0:
        return "rising"
    elif percentage < -75:
        return "valley"
    else:
        return "falling"
```

### 3. Overall Energy
```python
def overall(physical, emotional, intellectual):
    """Average of three core cycles"""
    return (physical + emotional + intellectual) / 3
```

**That's it!** You now have a working biorhythm calculator.

---

## Complete Implementation Checklist

Use this checklist to track your implementation:

### Core Functions
- [ ] `calculate_cycle_value(days_alive, cycle_period)` → float
- [ ] `calculate_days_alive(birth_date, target_date)` → int
- [ ] `determine_phase(percentage, days_alive, cycle_period)` → str
- [ ] `calculate_overall_energy(physical, emotional, intellectual)` → float

### Detection Functions
- [ ] `is_critical(percentage)` → bool
- [ ] `is_multi_cycle_critical(phys, emot, intel)` → bool
- [ ] `determine_trend(phys_phase, emot_phase, intel_phase)` → str

### Prediction Functions
- [ ] `find_next_peak(days_alive, cycle_period)` → int
- [ ] `find_next_valley(days_alive, cycle_period)` → int
- [ ] `find_next_critical_date(birth, days_alive, cycle_period)` → date

### High-Level Functions
- [ ] `calculate_biorhythm(birth_date, target_date)` → dict
- [ ] `generate_forecast(birth_date, start_date, days_ahead)` → list
- [ ] `find_all_critical_days(birth_date, start_date, days_ahead)` → list
- [ ] `analyze_forecast_periods(birth_date, start_date, days_ahead)` → dict

### Optional Functions
- [ ] `calculate_compatibility(birth1, birth2, target_date)` → dict
- [ ] `validate_birth_date(birth_date)` → (bool, str)
- [ ] `interpret_energy_level(energy_percentage)` → str
- [ ] `get_phase_guidance(cycle_name, phase)` → str

---

## Constants to Define

```python
# Core cycles (days)
PHYSICAL_CYCLE = 23
EMOTIONAL_CYCLE = 28
INTELLECTUAL_CYCLE = 33

# Extended cycles (optional)
INTUITIVE_CYCLE = 38
AESTHETIC_CYCLE = 43
SPIRITUAL_CYCLE = 53

# Thresholds
CRITICAL_THRESHOLD = 5.0
```

---

## Data Structures

### Minimal Output Structure
```python
{
    'target_date': date,
    'days_alive': int,
    'physical': float,           # -100 to 100
    'emotional': float,          # -100 to 100
    'intellectual': float,       # -100 to 100
    'overall_energy': float,     # -100 to 100
    'critical_day': bool
}
```

### Full Output Structure
```python
{
    'target_date': date,
    'days_alive': int,
    'cycles': {
        'physical': {
            'percentage': float,
            'phase': str,
            'days_to_peak': int,
            'days_to_valley': int,
            'next_critical': date
        },
        'emotional': { ... },
        'intellectual': { ... }
    },
    'overall_energy': float,
    'critical_day': bool,
    'trend': str
}
```

---

## Testing Your Implementation

### Test Case 1: First Cycle Completion
```python
birth = date(1990, 1, 1)
target = date(1990, 1, 24)  # Day 23 - physical cycle completes

physical = biorhythm(birth, target, 23)
# Expected: ~100% (completing first 23-day cycle)

emotional = biorhythm(birth, target, 28)
# Expected: ~57% (23/28 through first cycle)

intellectual = biorhythm(birth, target, 33)
# Expected: ~43% (23/33 through first cycle)
```

### Test Case 2: Critical Day
```python
birth = date(1990, 1, 1)
target = date(1990, 1, 12)  # Day 11.5 - half of physical cycle

physical = biorhythm(birth, target, 23)
# Expected: ~0% (critical - halfway through 23-day cycle)
```

### Test Case 3: Valley Phase
```python
birth = date(1990, 1, 1)
target = date(1990, 1, 18)  # Day 17.25 - three-quarters of physical cycle

physical = biorhythm(birth, target, 23)
# Expected: ~-100% (valley - 75% through 23-day cycle)
```

---

## Common Implementation Patterns

### Pattern 1: Simple Daily Report
```python
def daily_report(birth_date):
    today = date.today()
    phys = biorhythm(birth_date, today, 23)
    emot = biorhythm(birth_date, today, 28)
    intel = biorhythm(birth_date, today, 33)
    
    print(f"Physical: {phys:.1f}% ({phase(phys)})")
    print(f"Emotional: {emot:.1f}% ({phase(emot)})")
    print(f"Intellectual: {intel:.1f}% ({phase(intel)})")
    print(f"Overall: {overall(phys, emot, intel):.1f}%")
```

### Pattern 2: Weekly Calendar View
```python
def weekly_calendar(birth_date):
    today = date.today()
    for i in range(7):
        day = today + timedelta(days=i)
        result = calculate_biorhythm(birth_date, day)
        print(f"{day}: Energy {result['overall_energy']:.0f}%")
```

### Pattern 3: Find Next Peak Day
```python
def next_peak_day(birth_date, cycle_name='physical'):
    cycles = {'physical': 23, 'emotional': 28, 'intellectual': 33}
    period = cycles[cycle_name]
    
    days_alive = (date.today() - birth_date).days
    days_to_peak = find_next_peak(days_alive, period)
    
    return date.today() + timedelta(days=days_to_peak)
```

### Pattern 4: Best Day This Month
```python
def best_day_this_month(birth_date):
    today = date.today()
    forecast = generate_forecast(birth_date, today, 30)
    
    best = max(forecast, key=lambda x: x['overall_energy'])
    return best['target_date'], best['overall_energy']
```

---

## API Endpoint Examples

### REST API
```python
# GET /api/biorhythm?birth=1990-01-01&target=2026-01-25
{
    "target_date": "2026-01-25",
    "days_alive": 13176,
    "physical": -84.7,
    "emotional": 23.9,
    "intellectual": 56.6,
    "overall_energy": -1.4,
    "critical_day": false,
    "trend": "mixed"
}

# GET /api/biorhythm/forecast?birth=1990-01-01&days=7
[
    { "date": "2026-01-25", "energy": -1.4, ... },
    { "date": "2026-01-26", "energy": 5.2, ... },
    ...
]

# GET /api/biorhythm/critical-days?birth=1990-01-01&days=30
{
    "critical_days": [
        "2026-01-27",
        "2026-02-03",
        "2026-02-11"
    ],
    "count": 3
}
```

### GraphQL Schema
```graphql
type Biorhythm {
    targetDate: Date!
    daysAlive: Int!
    physical: Float!
    emotional: Float!
    intellectual: Float!
    overallEnergy: Float!
    criticalDay: Boolean!
    trend: String!
}

type Query {
    biorhythm(birthDate: Date!, targetDate: Date): Biorhythm!
    forecast(birthDate: Date!, startDate: Date, daysAhead: Int!): [Biorhythm!]!
    criticalDays(birthDate: Date!, startDate: Date, daysAhead: Int!): [Date!]!
}
```

---

## UI Component Patterns

### Pattern 1: Gauge Visualization
```
Physical:   [=========>      ] 84.7% PEAK
Emotional:  [===>            ] 23.9% RISING
Intellectual:[=====>          ] 56.6% RISING
Overall:    [=>              ] -1.4% MIXED
```

### Pattern 2: Calendar Heatmap
```
       Mo  Tu  We  Th  Fr  Sa  Su
Week 1 🟢  🟢  🟡  🟡  🔴  🔴  🟠
Week 2 🟠  🟡  🟡  🟢  🟢  🟢  🟡
Week 3 🟡  🟠  🔴  🔴  🔴  🟠  🟠
Week 4 🟡  🟡  🟢  🟢  🟢  🟢  🟡

🟢 High Energy  🟡 Moderate  🔴 Low Energy  🟠 Critical
```

### Pattern 3: Line Chart
```
 100|     /\        /\
    |    /  \      /  \
  50|   /    \    /    \
    |  /      \  /      \
   0|_/________\/_________\_
    | |   |   |   |   |   |
  -50 |   |   |   |   |   |
    | |   |   |   |   |   |
-100 |   |   |   |   |   |
     Day 1 2 3 4 5 6 7 ...

—— Physical  ·· Emotional  -- Intellectual
```

---

## Performance Optimization Tips

### 1. Memoization
```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def biorhythm_cached(birth_tuple, target_tuple, cycle_days):
    birth = date(*birth_tuple)
    target = date(*target_tuple)
    return biorhythm(birth, target, cycle_days)
```

### 2. Batch Calculation
```python
def batch_biorhythm(birth_date, date_list):
    """Calculate for multiple dates in one pass"""
    birth_days = birth_date.toordinal()
    results = []
    
    for target in date_list:
        days_alive = target.toordinal() - birth_days
        results.append({
            'date': target,
            'physical': calculate_cycle_value(days_alive, 23),
            'emotional': calculate_cycle_value(days_alive, 28),
            'intellectual': calculate_cycle_value(days_alive, 33)
        })
    
    return results
```

### 3. Precompute Constants
```python
TWO_PI = 2 * math.pi
PHYS_FACTOR = TWO_PI / 23
EMOT_FACTOR = TWO_PI / 28
INTEL_FACTOR = TWO_PI / 33

def fast_biorhythm(days_alive):
    return {
        'physical': math.sin(days_alive * PHYS_FACTOR) * 100,
        'emotional': math.sin(days_alive * EMOT_FACTOR) * 100,
        'intellectual': math.sin(days_alive * INTEL_FACTOR) * 100
    }
```

---

## Common Pitfalls to Avoid

### ❌ Don't: Use floating-point days
```python
# WRONG - will cause precision issues
days_alive = (target_date - birth_date).total_seconds() / 86400
```

### ✅ Do: Use integer days
```python
# CORRECT - precise integer arithmetic
days_alive = (target_date - birth_date).days
```

### ❌ Don't: Forget to validate dates
```python
# WRONG - no validation
result = calculate_biorhythm(birth_date, target_date)
```

### ✅ Do: Always validate inputs
```python
# CORRECT - validate first
if birth_date > date.today():
    raise ValueError("Birth date cannot be in future")
result = calculate_biorhythm(birth_date, target_date)
```

### ❌ Don't: Treat as absolute truth
```python
# WRONG - deterministic prediction
if biorhythm < 0:
    return "You will have a bad day"
```

### ✅ Do: Present as guidance
```python
# CORRECT - informational guidance
if biorhythm < 0:
    return "Lower energy phase - consider rest and recovery"
```

---

## Integration Checklist

### Phase 1: Core Implementation
- [ ] Implement three cycle calculations
- [ ] Add phase determination
- [ ] Create overall energy calculator
- [ ] Write basic tests

### Phase 2: User Interface
- [ ] Daily biorhythm display
- [ ] 7-day forecast view
- [ ] Calendar integration
- [ ] Visual graphs/charts

### Phase 3: Advanced Features
- [ ] Critical day alerts
- [ ] Best day finder
- [ ] Email/SMS notifications
- [ ] Historical tracking

### Phase 4: Optimization
- [ ] Add caching layer
- [ ] Batch calculations
- [ ] API rate limiting
- [ ] Database storage

---

## Language-Specific Notes

### Python
- Use `datetime.date` for dates
- Use `math.sin` and `math.pi`
- Consider `dataclasses` for output structures

### JavaScript
- Use `Date` objects or date libraries (date-fns, moment.js)
- Use `Math.sin()` and `Math.PI`
- Consider TypeScript for type safety

### Go
- Use `time.Time` from standard library
- Use `math.Sin()` and `math.Pi`
- Create structs for output data

### Rust
- Use `chrono` crate for dates
- Use `f64::sin()` from std
- Use `std::f64::consts::PI`

### Swift
- Use Foundation `Date`
- Use Darwin `sin()` and `.pi`
- Create Codable structs for JSON

---

## Resources

### Mathematical Verification
- Online calculator: biorhythm-calculator.net
- Verify your implementation matches established calculators
- Test with known birth dates and check consistency

### Extended Reading
- "The Biorhythm Theory" by George S. Thommen
- "Is This Your Day?" by George S. Thommen
- Academic papers on circadian and infradian rhythms

### Code Examples
- See `pure-calculation-functions.md` for complete Python reference
- See `biorhythm-engine-extraction.md` for algorithm details
- Check WitnessOS source for production implementation

---

## Quick Start Template

```python
import math
from datetime import date, timedelta

# Constants
PHYSICAL, EMOTIONAL, INTELLECTUAL = 23, 28, 33
CRITICAL_THRESHOLD = 5.0

# Core function
def biorhythm(birth_date, target_date=None):
    if target_date is None:
        target_date = date.today()
    
    days = (target_date - birth_date).days
    
    phys = math.sin(2 * math.pi * days / PHYSICAL) * 100
    emot = math.sin(2 * math.pi * days / EMOTIONAL) * 100
    intel = math.sin(2 * math.pi * days / INTELLECTUAL) * 100
    
    return {
        'date': target_date,
        'physical': round(phys, 1),
        'emotional': round(emot, 1),
        'intellectual': round(intel, 1),
        'overall': round((phys + emot + intel) / 3, 1),
        'critical': any(abs(x) < CRITICAL_THRESHOLD for x in [phys, emot, intel])
    }

# Usage
if __name__ == '__main__':
    my_birth = date(1990, 1, 1)
    result = biorhythm(my_birth)
    print(result)
```

**That's it!** Copy this template and start building.

---

**End of Quick Implementation Guide**

*Get started fast, iterate as needed, and remember: implementation should serve user needs, not mathematical perfection.*
