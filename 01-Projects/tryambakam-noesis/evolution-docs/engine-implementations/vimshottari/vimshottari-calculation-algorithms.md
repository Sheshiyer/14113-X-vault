# Vimshottari Dasha - Calculation Algorithms

**Documentation Type:** Mathematical Implementation  
**Last Updated:** 2026-01-26

---

## Table of Contents
1. [120-Year Cycle Foundation](#120-year-cycle-foundation)
2. [Mahadasha Timeline Algorithm](#mahadasha-timeline-algorithm)
3. [Antardasha Calculation](#antardasha-calculation)
4. [Pratyantardasha Calculation](#pratyantardasha-calculation)
5. [Current Period Determination](#current-period-determination)
6. [Balance Calculation](#balance-calculation)
7. [Date Arithmetic](#date-arithmetic)

---

## 120-Year Cycle Foundation

### The Complete Vimshottari Cycle

The Vimshottari Dasha system divides 120 years into 9 planetary periods:

```
DASHA_PERIODS = {
    "Ketu":    7 years   (5.83%)
    "Venus":  20 years  (16.67%)
    "Sun":     6 years   (5.00%)
    "Moon":   10 years   (8.33%)
    "Mars":    7 years   (5.83%)
    "Rahu":   18 years  (15.00%)
    "Jupiter": 16 years  (13.33%)
    "Saturn":  19 years  (15.83%)
    "Mercury": 17 years  (14.17%)
    ─────────────────────────────
    TOTAL:   120 years (100.00%)
```

### Cycle Sequence Order

```python
DASHA_SEQUENCE = [
    "Ketu",     # 1. 7 years
    "Venus",    # 2. 20 years
    "Sun",      # 3. 6 years
    "Moon",     # 4. 10 years
    "Mars",     # 5. 7 years
    "Rahu",     # 6. 18 years
    "Jupiter",  # 7. 16 years
    "Saturn",   # 8. 19 years
    "Mercury"   # 9. 17 years
]
# After Mercury, cycle returns to Ketu
```

### Mathematical Properties

**Total Years:**
```
∑(i=1 to 9) DASHA_PERIODS[planet_i] = 120 years
```

**Proportional Weights:**
```
weight_planet = DASHA_PERIODS[planet] / 120
```

**Cycle Invariance:**
```
For any starting point n:
  Cycle(n) = [planet_n, planet_(n+1), ..., planet_9, planet_1, ..., planet_(n-1)]
  ∑ Cycle(n) = 120 years
```

---

## Mahadasha Timeline Algorithm

### Complete Implementation

```python
def _calculate_dasha_timeline(
    self, 
    birth_date: date, 
    nakshatra_info: NakshatraInfo,
    current_date: date
) -> List[DashaPeriod]:
    """
    Calculate complete Dasha timeline from birth.
    
    Args:
        birth_date: Date of birth
        nakshatra_info: Processed birth nakshatra data
        current_date: Reference date for calculation
    
    Returns:
        List of DashaPeriod objects spanning 120 years
    """
    timeline = []
    
    # ═══════════════════════════════════════════════════════════
    # STEP 1: Calculate Balance of First Mahadasha
    # ═══════════════════════════════════════════════════════════
    
    first_planet = nakshatra_info.ruling_planet
    first_period_years = self.dasha_periods[first_planet]
    
    # Calculate completed fraction of nakshatra
    # Each nakshatra = 360° / 27 = 13.333...°
    NAKSHATRA_DEGREES = 360.0 / 27.0  # 13.333333...
    completed_fraction = (
        nakshatra_info.degrees_in_nakshatra / NAKSHATRA_DEGREES
    )
    
    # Remaining years in first Mahadasha
    remaining_years = first_period_years * (1 - completed_fraction)
    
    # ═══════════════════════════════════════════════════════════
    # STEP 2: Add First (Partial) Mahadasha
    # ═══════════════════════════════════════════════════════════
    
    current_start_date = birth_date
    first_end_date = birth_date + timedelta(days=remaining_years * 365.25)
    
    timeline.append(DashaPeriod(
        planet=first_planet,
        period_type="Mahadasha",
        start_date=current_start_date,
        end_date=first_end_date,
        duration_years=remaining_years,
        general_theme=self._get_planet_theme(first_planet)
    ))
    
    current_start_date = first_end_date
    years_calculated = remaining_years
    
    # ═══════════════════════════════════════════════════════════
    # STEP 3: Add Subsequent Complete Mahadashas (120-year cycle)
    # ═══════════════════════════════════════════════════════════
    
    # Start with next planet in sequence
    planet_index = (
        self.dasha_sequence.index(first_planet) + 1
    ) % len(self.dasha_sequence)
    
    # Continue until 120-year cycle complete
    while years_calculated < 120:
        planet = self.dasha_sequence[planet_index]
        period_years = self.dasha_periods[planet]
        
        end_date = current_start_date + timedelta(
            days=period_years * 365.25
        )
        
        timeline.append(DashaPeriod(
            planet=planet,
            period_type="Mahadasha",
            start_date=current_start_date,
            end_date=end_date,
            duration_years=period_years,
            general_theme=self._get_planet_theme(planet)
        ))
        
        # Advance to next period
        current_start_date = end_date
        years_calculated += period_years
        planet_index = (planet_index + 1) % len(self.dasha_sequence)
    
    return timeline
```

### Example Calculation

**Given:**
- Birth Date: May 15, 1990
- Moon Nakshatra: Ashwini (ruled by Ketu)
- Degrees in Nakshatra: 8.5°

**Step 1: Calculate Balance**
```
Nakshatra span = 360° / 27 = 13.333°
Completed fraction = 8.5° / 13.333° = 0.6375 (63.75%)
Remaining fraction = 1 - 0.6375 = 0.3625 (36.25%)

Ketu full period = 7 years
Ketu remaining = 7 × 0.3625 = 2.5375 years
```

**Step 2: First Period**
```
Period: Ketu Mahadasha (partial)
Start: May 15, 1990
Duration: 2.5375 years = 927 days
End: January 10, 1993
```

**Step 3: Subsequent Periods**
```
Period 2: Venus Mahadasha
  Start: January 10, 1993
  Duration: 20 years
  End: January 10, 2013

Period 3: Sun Mahadasha
  Start: January 10, 2013
  Duration: 6 years
  End: January 10, 2019

Period 4: Moon Mahadasha
  Start: January 10, 2019
  Duration: 10 years
  End: January 10, 2029

... (continues for 120 years total)
```

---

## Antardasha Calculation

### Antardasha Sequence Logic

Each Mahadasha is divided into 9 Antardashas following the same planetary sequence, **starting with the Mahadasha planet itself**.

**Sequence Generation:**
```python
def _generate_antardasha_sequence(mahadasha_planet: str) -> List[str]:
    """
    Generate Antardasha sequence for a Mahadasha.
    
    Args:
        mahadasha_planet: The Mahadasha ruling planet
    
    Returns:
        List of 9 planets starting with mahadasha_planet
    """
    dasha_sequence = [
        "Ketu", "Venus", "Sun", "Moon", "Mars", 
        "Rahu", "Jupiter", "Saturn", "Mercury"
    ]
    
    # Find starting index
    start_index = dasha_sequence.index(mahadasha_planet)
    
    # Rotate sequence to start with mahadasha_planet
    antardasha_sequence = (
        dasha_sequence[start_index:] + 
        dasha_sequence[:start_index]
    )
    
    return antardasha_sequence

# Example: Jupiter Mahadasha
# → ["Jupiter", "Saturn", "Mercury", "Ketu", "Venus", 
#    "Sun", "Moon", "Mars", "Rahu"]
```

### Proportional Duration Calculation

```python
def _calculate_current_antardasha(
    self, 
    mahadasha: DashaPeriod, 
    current_date: date
) -> Optional[DashaPeriod]:
    """
    Calculate current Antardasha within Mahadasha.
    
    Args:
        mahadasha: The current Mahadasha period
        current_date: Date to find Antardasha for
    
    Returns:
        Current DashaPeriod for Antardasha, or None
    """
    mahadasha_planet = mahadasha.planet
    antardasha_sequence = self.antardasha_sequences[mahadasha_planet]
    
    # ═══════════════════════════════════════════════════════════
    # Calculate Total Ratio (always = 120)
    # ═══════════════════════════════════════════════════════════
    total_antardasha_ratio = sum(
        self.dasha_periods[planet] 
        for planet in antardasha_sequence
    )
    # = 7 + 20 + 6 + 10 + 7 + 18 + 16 + 19 + 17 = 120
    
    mahadasha_duration = mahadasha.duration_years
    current_start = mahadasha.start_date
    
    # ═══════════════════════════════════════════════════════════
    # Iterate Through Antardashas
    # ═══════════════════════════════════════════════════════════
    for antardasha_planet in antardasha_sequence:
        # Calculate this Antardasha's proportion
        antardasha_ratio = self.dasha_periods[antardasha_planet]
        antardasha_proportion = antardasha_ratio / total_antardasha_ratio
        
        # Duration = Mahadasha duration × proportion
        antardasha_duration = mahadasha_duration * antardasha_proportion
        
        # Calculate end date
        antardasha_end = current_start + timedelta(
            days=antardasha_duration * 365.25
        )
        
        # Check if current_date falls in this period
        if current_start <= current_date <= antardasha_end:
            return DashaPeriod(
                planet=antardasha_planet,
                period_type="Antardasha",
                start_date=current_start,
                end_date=antardasha_end,
                duration_years=antardasha_duration,
                is_current=True,
                general_theme=self._get_planet_theme(antardasha_planet)
            )
        
        # Move to next Antardasha
        current_start = antardasha_end
    
    return None
```

### Mathematical Formula

**Antardasha Duration:**
```
D_antardasha(p) = D_mahadasha × (DASHA_PERIODS[p] / 120)
```

**Where:**
- `D_antardasha(p)` = Duration of planet p's Antardasha
- `D_mahadasha` = Total duration of the Mahadasha
- `DASHA_PERIODS[p]` = Standard period for planet p (in years)
- `120` = Total cycle years (constant)

### Example Calculation

**Given:**
- Current Mahadasha: Venus (20 years)
- Start Date: January 10, 1993
- End Date: January 10, 2013

**Antardasha Sequence:**
```
Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury → Ketu
```

**Duration Calculations:**

| Planet  | Ratio | Proportion | Duration in Venus Maha |
|---------|-------|------------|------------------------|
| Venus   | 20/120 | 0.1667 | 20 × 0.1667 = 3.33 years |
| Sun     | 6/120  | 0.0500 | 20 × 0.0500 = 1.00 years |
| Moon    | 10/120 | 0.0833 | 20 × 0.0833 = 1.67 years |
| Mars    | 7/120  | 0.0583 | 20 × 0.0583 = 1.17 years |
| Rahu    | 18/120 | 0.1500 | 20 × 0.1500 = 3.00 years |
| Jupiter | 16/120 | 0.1333 | 20 × 0.1333 = 2.67 years |
| Saturn  | 19/120 | 0.1583 | 20 × 0.1583 = 3.17 years |
| Mercury | 17/120 | 0.1417 | 20 × 0.1417 = 2.83 years |
| Ketu    | 7/120  | 0.0583 | 20 × 0.0583 = 1.17 years |

**Timeline:**
```
1. Venus-Venus:   Jan 10, 1993 - Apr 18, 1996  (3.33 years)
2. Venus-Sun:     Apr 18, 1996 - Apr 18, 1997  (1.00 years)
3. Venus-Moon:    Apr 18, 1997 - Dec 21, 1998  (1.67 years)
4. Venus-Mars:    Dec 21, 1998 - Feb  3, 2000  (1.17 years)
5. Venus-Rahu:    Feb  3, 2000 - Feb  3, 2003  (3.00 years)
6. Venus-Jupiter: Feb  3, 2003 - Oct  4, 2005  (2.67 years)
7. Venus-Saturn:  Oct  4, 2005 - Dec  4, 2008  (3.17 years)
8. Venus-Mercury: Dec  4, 2008 - Oct  4, 2011  (2.83 years)
9. Venus-Ketu:    Oct  4, 2011 - Jan 10, 2013  (1.17 years)
```

---

## Pratyantardasha Calculation

### Algorithm (Same Logic as Antardasha)

```python
def _calculate_current_pratyantardasha(
    self, 
    mahadasha: DashaPeriod, 
    antardasha: DashaPeriod,
    current_date: date
) -> Optional[DashaPeriod]:
    """
    Calculate current Pratyantardasha within Antardasha.
    
    Args:
        mahadasha: The current Mahadasha period
        antardasha: The current Antardasha period
        current_date: Date to find Pratyantardasha for
    
    Returns:
        Current DashaPeriod for Pratyantardasha, or None
    """
    antardasha_planet = antardasha.planet
    
    # Generate Pratyantardasha sequence starting with Antardasha planet
    pratyantardasha_sequence = self.antardasha_sequences[antardasha_planet]
    
    # Calculate total ratio (always 120)
    total_pratyantardasha_ratio = sum(
        self.dasha_periods[planet] 
        for planet in pratyantardasha_sequence
    )
    
    antardasha_duration = antardasha.duration_years
    current_start = antardasha.start_date
    
    # Iterate through Pratyantardashas
    for pratyantardasha_planet in pratyantardasha_sequence:
        pratyantardasha_ratio = self.dasha_periods[pratyantardasha_planet]
        pratyantardasha_proportion = (
            pratyantardasha_ratio / total_pratyantardasha_ratio
        )
        
        # Duration = Antardasha duration × proportion
        pratyantardasha_duration = (
            antardasha_duration * pratyantardasha_proportion
        )
        
        pratyantardasha_end = current_start + timedelta(
            days=pratyantardasha_duration * 365.25
        )
        
        if current_start <= current_date <= pratyantardasha_end:
            return DashaPeriod(
                planet=pratyantardasha_planet,
                period_type="Pratyantardasha",
                start_date=current_start,
                end_date=pratyantardasha_end,
                duration_years=pratyantardasha_duration,
                is_current=True,
                general_theme=self._get_planet_theme(pratyantardasha_planet)
            )
        
        current_start = pratyantardasha_end
    
    return None
```

### Mathematical Formula

**Pratyantardasha Duration:**
```
D_pratyantar(p) = D_antardasha × (DASHA_PERIODS[p] / 120)
                = D_mahadasha × (DASHA_PERIODS[antar] / 120) 
                              × (DASHA_PERIODS[p] / 120)
```

### Example Calculation

**Given:**
- Mahadasha: Venus (20 years)
- Antardasha: Venus-Sun (1.00 years = 365.25 days)
- Start Date: April 18, 1996

**Pratyantardasha Sequence:**
```
Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury → Ketu → Venus
```

**Duration Calculations:**

| Planet  | Duration Formula | Days | Dates |
|---------|-----------------|------|-------|
| Sun     | 1.0 × (6/120)   | 18.26 days | Apr 18 - May 6, 1996 |
| Moon    | 1.0 × (10/120)  | 30.44 days | May 6 - Jun 6, 1996 |
| Mars    | 1.0 × (7/120)   | 21.31 days | Jun 6 - Jun 27, 1996 |
| Rahu    | 1.0 × (18/120)  | 54.79 days | Jun 27 - Aug 21, 1996 |
| Jupiter | 1.0 × (16/120)  | 48.70 days | Aug 21 - Oct 9, 1996 |
| Saturn  | 1.0 × (19/120)  | 57.83 days | Oct 9 - Dec 6, 1996 |
| Mercury | 1.0 × (17/120)  | 51.74 days | Dec 6, 1996 - Jan 27, 1997 |
| Ketu    | 1.0 × (7/120)   | 21.31 days | Jan 27 - Feb 17, 1997 |
| Venus   | 1.0 × (20/120)  | 60.88 days | Feb 17 - Apr 18, 1997 |

**Total:** 365.26 days ≈ 1.00 years ✓

---

## Current Period Determination

### Complete Algorithm

```python
def _find_current_periods(
    self, 
    timeline: List[DashaPeriod], 
    current_date: date
) -> Dict[str, DashaPeriod]:
    """
    Find current Mahadasha, Antardasha, and Pratyantardasha.
    
    Args:
        timeline: Complete timeline of Mahadashas
        current_date: Date to find periods for
    
    Returns:
        Dictionary with 'mahadasha', 'antardasha', 'pratyantardasha'
    """
    current_periods = {}
    
    # ═══════════════════════════════════════════════════════════
    # LEVEL 1: Find Current Mahadasha
    # ═══════════════════════════════════════════════════════════
    for period in timeline:
        if period.start_date <= current_date <= period.end_date:
            period.is_current = True
            current_periods['mahadasha'] = period
            break
    
    if 'mahadasha' not in current_periods:
        return current_periods  # Date outside timeline
    
    # ═══════════════════════════════════════════════════════════
    # LEVEL 2: Calculate Current Antardasha
    # ═══════════════════════════════════════════════════════════
    mahadasha = current_periods['mahadasha']
    antardasha = self._calculate_current_antardasha(
        mahadasha, 
        current_date
    )
    
    if antardasha:
        current_periods['antardasha'] = antardasha
        
        # ═══════════════════════════════════════════════════════
        # LEVEL 3: Calculate Current Pratyantardasha
        # ═══════════════════════════════════════════════════════
        pratyantardasha = self._calculate_current_pratyantardasha(
            mahadasha, 
            antardasha, 
            current_date
        )
        
        if pratyantardasha:
            current_periods['pratyantardasha'] = pratyantardasha
    
    return current_periods
```

### Binary Search Optimization

For large timelines, use binary search for Mahadasha:

```python
def _find_current_mahadasha_binary(
    timeline: List[DashaPeriod], 
    current_date: date
) -> Optional[DashaPeriod]:
    """Find current Mahadasha using binary search."""
    left, right = 0, len(timeline) - 1
    
    while left <= right:
        mid = (left + right) // 2
        period = timeline[mid]
        
        if period.start_date <= current_date <= period.end_date:
            return period
        elif current_date < period.start_date:
            right = mid - 1
        else:
            left = mid + 1
    
    return None
```

**Complexity:**
- Linear Search: O(n) where n ≈ 9 Mahadashas
- Binary Search: O(log n) ≈ 3 comparisons

---

## Balance Calculation

### Core Formula

```python
def calculate_balance(
    degrees_in_nakshatra: float, 
    mahadasha_years: int
) -> float:
    """
    Calculate remaining years in first Mahadasha.
    
    Args:
        degrees_in_nakshatra: Moon's position (0.0 - 13.333°)
        mahadasha_years: Full duration of Mahadasha
    
    Returns:
        Remaining years in first Mahadasha
    """
    NAKSHATRA_SPAN_DEGREES = 360.0 / 27.0  # 13.333...°
    
    # Calculate how much of nakshatra is completed
    completed_fraction = degrees_in_nakshatra / NAKSHATRA_SPAN_DEGREES
    
    # Remaining fraction
    remaining_fraction = 1.0 - completed_fraction
    
    # Apply to Mahadasha duration
    remaining_years = mahadasha_years * remaining_fraction
    
    return remaining_years
```

### Mathematical Derivation

**Given:**
- 27 nakshatras divide 360° zodiac
- Each nakshatra = 360° / 27 = 13.333...° = 13°20'
- Moon's position = x° within current nakshatra (0 ≤ x < 13.333)

**Calculate:**
```
Completed Fraction (f_c) = x / 13.333

Remaining Fraction (f_r) = 1 - f_c
                         = (13.333 - x) / 13.333

Remaining Years (Y_r) = Y_total × f_r
                      = Y_total × (13.333 - x) / 13.333
```

### Example Calculations

**Example 1: Moon at 0° (Nakshatra beginning)**
```
degrees = 0.0
completed_fraction = 0.0 / 13.333 = 0.0
remaining_fraction = 1.0 - 0.0 = 1.0

If Ketu Mahadasha (7 years):
  remaining_years = 7 × 1.0 = 7.0 years (full period)
```

**Example 2: Moon at 6.666° (Nakshatra midpoint)**
```
degrees = 6.666
completed_fraction = 6.666 / 13.333 = 0.5
remaining_fraction = 1.0 - 0.5 = 0.5

If Venus Mahadasha (20 years):
  remaining_years = 20 × 0.5 = 10.0 years (half period)
```

**Example 3: Moon at 13.0° (Nakshatra end)**
```
degrees = 13.0
completed_fraction = 13.0 / 13.333 = 0.975
remaining_fraction = 1.0 - 0.975 = 0.025

If Jupiter Mahadasha (16 years):
  remaining_years = 16 × 0.025 = 0.4 years (2.5% remaining)
```

### Edge Cases

```python
# Exact nakshatra boundary
if degrees_in_nakshatra >= 13.333:
    # Move to next nakshatra
    nakshatra_index = (nakshatra_index + 1) % 27
    degrees_in_nakshatra = 0.0

# Negative degrees (shouldn't happen)
if degrees_in_nakshatra < 0:
    raise ValueError("Degrees cannot be negative")

# Retrograde motion considerations
# (Swiss Ephemeris handles this automatically)
```

---

## Date Arithmetic

### Days to Years Conversion

```python
DAYS_PER_YEAR = 365.25  # Accounts for leap years

def years_to_days(years: float) -> float:
    """Convert years to days (accounting for leap years)."""
    return years * DAYS_PER_YEAR

def days_to_years(days: float) -> float:
    """Convert days to years (accounting for leap years)."""
    return days / DAYS_PER_YEAR
```

### Date Addition

```python
from datetime import date, timedelta

def add_years_to_date(start_date: date, years: float) -> date:
    """
    Add fractional years to a date.
    
    Args:
        start_date: Starting date
        years: Years to add (can be fractional)
    
    Returns:
        Resulting date
    """
    days = years * 365.25
    return start_date + timedelta(days=days)

# Example
start = date(1990, 5, 15)
end = add_years_to_date(start, 2.5375)
# → date(1993, 1, 10)
```

### Date Difference

```python
def date_difference_years(start_date: date, end_date: date) -> float:
    """
    Calculate years between two dates.
    
    Args:
        start_date: Earlier date
        end_date: Later date
    
    Returns:
        Years between dates (fractional)
    """
    delta = end_date - start_date
    return delta.days / 365.25

# Example
start = date(1990, 5, 15)
end = date(2010, 5, 15)
years = date_difference_years(start, end)
# → 20.0 years
```

### Leap Year Precision

**Standard Approach (used in code):**
```python
# Simple average: 365.25 days/year
days = years * 365.25

# Pros: Simple, good approximation
# Cons: Accumulates slight error over centuries
```

**High-Precision Approach (optional):**
```python
def precise_years_to_days(years: float) -> float:
    """
    Convert years to days with high precision.
    
    Gregorian calendar: 365.2425 days/year average
    (97 leap years per 400 years)
    """
    return years * 365.2425

# Difference over 120 years:
# Simple:  120 × 365.25   = 43,830 days
# Precise: 120 × 365.2425 = 43,829.1 days
# Error: ~0.9 days over 120 years
```

### Date Validation

```python
def validate_date_range(
    start_date: date, 
    end_date: date, 
    current_date: date
) -> bool:
    """
    Validate that a date falls within a range.
    
    Args:
        start_date: Period start
        end_date: Period end
        current_date: Date to check
    
    Returns:
        True if current_date is within range (inclusive)
    """
    return start_date <= current_date <= end_date

# Example
mahadasha_start = date(1993, 1, 10)
mahadasha_end = date(2013, 1, 10)
current = date(2000, 6, 15)

is_current = validate_date_range(
    mahadasha_start, 
    mahadasha_end, 
    current
)
# → True (2000-06-15 is within Venus Mahadasha)
```

---

## Algorithm Complexity Analysis

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Balance calculation | O(1) | Arithmetic only |
| Mahadasha timeline | O(n) | n = 9 planets |
| Antardasha calculation | O(m) | m = 9 sub-periods |
| Pratyantardasha calc | O(m²) | Nested iteration |
| Period search (linear) | O(n) | n = 9 Mahadashas |
| Period search (binary) | O(log n) | Binary search |
| Complete calculation | O(m²) | Dominated by Pratyantardasha |

### Space Complexity

| Data Structure | Space | Notes |
|----------------|-------|-------|
| Timeline storage | O(n) | n = 9 Mahadashas |
| Antardasha sequences | O(m²) | m = 9 planets |
| Current periods | O(1) | Fixed size dict |
| Total | O(m²) | Dominated by sequences |

### Optimization Opportunities

**1. Memoization**
```python
# Cache Antardasha sequences (computed once)
@lru_cache(maxsize=9)
def get_antardasha_sequence(planet: str) -> List[str]:
    # Computed once, cached for subsequent calls
```

**2. Lazy Evaluation**
```python
# Only calculate Pratyantardasha if requested
if input_data.include_sub_periods:
    pratyantardasha = self._calculate_current_pratyantardasha(...)
```

**3. Timeline Truncation**
```python
# Don't generate full 120 years if only need current + forecast
max_years = years_since_birth + years_forecast + buffer
timeline = generate_timeline(max_years=max_years)
```

---

## Testing & Validation

### Unit Tests

```python
def test_balance_calculation():
    """Test Mahadasha balance calculation."""
    # Test case: Moon at 8.5° in Ketu nakshatra (7 years)
    remaining = calculate_balance(8.5, 7)
    expected = 7 * (1 - 8.5/13.333)
    assert abs(remaining - expected) < 0.001

def test_proportional_division():
    """Test Antardasha proportions sum to 1."""
    total_ratio = sum(DASHA_PERIODS.values())
    assert total_ratio == 120
    
    proportions = [
        DASHA_PERIODS[p] / 120 
        for p in DASHA_SEQUENCE
    ]
    assert abs(sum(proportions) - 1.0) < 0.001

def test_timeline_continuity():
    """Test no gaps in timeline."""
    timeline = generate_timeline(...)
    
    for i in range(len(timeline) - 1):
        assert timeline[i].end_date == timeline[i+1].start_date
```

### Integration Tests

```python
def test_known_dasha_periods():
    """Test against known Dasha calculations."""
    # Known test case from Vedic astrology texts
    birth_data = {
        'date': date(1990, 5, 15),
        'time': time(14, 30),
        'location': (28.6139, 77.2090),
        'timezone': 'Asia/Kolkata'
    }
    
    expected_maha = "Ketu"
    expected_balance = 2.54  # years
    
    result = calculate_dasha_timeline(birth_data)
    
    assert result['first_mahadasha']['planet'] == expected_maha
    assert abs(result['first_mahadasha']['remaining'] - expected_balance) < 0.1
```

---

**Next:** [Nakshatra System](./vimshottari-nakshatra-system.md)  
**See also:** [Planetary Periods](./vimshottari-planetary-periods.md)
