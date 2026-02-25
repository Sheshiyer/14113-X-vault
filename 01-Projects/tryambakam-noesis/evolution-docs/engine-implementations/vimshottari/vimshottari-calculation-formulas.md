# Vimshottari Dasha Calculation Formulas

## Overview
Vimshottari Dasha is the most widely used Vedic astrology system for timing life events. It divides a 120-year cycle into nine planetary periods (Mahadashas), each subdivided into Antardashas and Pratyantardashas.

## Core Mathematical Framework

### 1. Birth Nakshatra Determination

The Moon's position at birth determines the starting Dasha:

```latex
\text{Nakshatra Position} = \frac{\text{Moon Longitude} \mod 360°}{13.333...°}
```

Where:
- Each Nakshatra spans: `13°20'` = `13.333...°`
- Total Nakshatras: 27
- Moon Longitude: Sidereal longitude of Moon at birth

### 2. Nakshatra-to-Planet Mapping

```python
NAKSHATRA_RULING_PLANETS = {
    1: "Ketu",     # Ashwini
    2: "Venus",    # Bharani
    3: "Sun",      # Krittika
    4: "Moon",     # Rohini
    5: "Mars",     # Mrigashira
    6: "Rahu",     # Ardra
    7: "Jupiter",  # Punarvasu
    8: "Saturn",   # Pushya
    9: "Mercury",  # Ashlesha
    # Pattern repeats every 9 nakshatras
}
```

### 3. Mahadasha Period Durations

Fixed periods for each planetary ruler (in years):

```latex
\begin{aligned}
\text{Ketu} &= 7 \text{ years} \\
\text{Venus} &= 20 \text{ years} \\
\text{Sun} &= 6 \text{ years} \\
\text{Moon} &= 10 \text{ years} \\
\text{Mars} &= 7 \text{ years} \\
\text{Rahu} &= 18 \text{ years} \\
\text{Jupiter} &= 16 \text{ years} \\
\text{Saturn} &= 19 \text{ years} \\
\text{Mercury} &= 17 \text{ years} \\
\hline
\text{Total} &= 120 \text{ years}
\end{aligned}
```

### 4. Balance of Birth Dasha

The critical calculation determining remaining time in first Mahadasha:

```latex
\text{Balance Factor} = 1 - \frac{\text{Degrees Traversed in Nakshatra}}{13.333...°}
```

```latex
\text{Remaining Years} = \text{Total Mahadasha Years} \times \text{Balance Factor}
```

**Example Calculation:**
```
Moon at: 47.5° (Rohini nakshatra, ruled by Moon)
Rohini starts at: 40° (4th nakshatra × 13.333...°)
Degrees in nakshatra: 47.5° - 40° = 7.5°
Balance factor: 1 - (7.5 / 13.333...) = 0.4375
Moon Mahadasha total: 10 years
Remaining at birth: 10 × 0.4375 = 4.375 years
```

### 5. Antardasha (Sub-Period) Calculation

Antardashas follow the same 9-planet sequence, starting with the Mahadasha lord:

```latex
\text{Antardasha Duration} = \frac{\text{Mahadasha Years} \times \text{Antardasha Planet Years}}{\text{Total Cycle Years}}
```

```latex
\text{Antardasha Years} = \frac{\text{Mahadasha Years} \times \text{Antardasha Planet Years}}{120}
```

**Example:**
```
During Jupiter Mahadasha (16 years):
Jupiter-Jupiter Antardasha = (16 × 16) / 120 = 2.133 years
Jupiter-Saturn Antardasha = (16 × 19) / 120 = 2.533 years
Jupiter-Mercury Antardasha = (16 × 17) / 120 = 2.267 years
```

### 6. Pratyantardasha (Sub-Sub-Period) Calculation

Third-level subdivision using the same proportional formula:

```latex
\text{Pratyantardasha Years} = \frac{\text{Antardasha Years} \times \text{Pratyantardasha Planet Years}}{120}
```

**Example:**
```
During Jupiter-Saturn Antardasha (2.533 years):
Jupiter-Saturn-Saturn = (2.533 × 19) / 120 = 0.401 years = 146.5 days
Jupiter-Saturn-Mercury = (2.533 × 17) / 120 = 0.358 years = 130.7 days
```

## Timeline Generation Algorithm

### Full Dasha Sequence

```python
def calculate_dasha_timeline(birth_date, nakshatra_info):
    """
    Generate complete 120-year Dasha timeline from birth.
    """
    # 1. Determine starting planet from birth nakshatra
    first_planet = nakshatra_info.ruling_planet
    
    # 2. Calculate balance of first Mahadasha
    completed_fraction = nakshatra_info.degrees_in_nakshatra / 13.333...
    remaining_years = DASHA_PERIODS[first_planet] * (1 - completed_fraction)
    
    # 3. Generate timeline
    timeline = []
    current_date = birth_date
    
    # Add partial first Mahadasha
    timeline.append({
        'planet': first_planet,
        'start': current_date,
        'duration': remaining_years,
        'end': current_date + timedelta(days=remaining_years * 365.25)
    })
    
    # 4. Add subsequent complete Mahadashas
    planet_index = (DASHA_SEQUENCE.index(first_planet) + 1) % 9
    current_date = timeline[-1]['end']
    
    while sum_years < 120:
        planet = DASHA_SEQUENCE[planet_index]
        duration = DASHA_PERIODS[planet]
        
        timeline.append({
            'planet': planet,
            'start': current_date,
            'duration': duration,
            'end': current_date + timedelta(days=duration * 365.25)
        })
        
        current_date = timeline[-1]['end']
        planet_index = (planet_index + 1) % 9
    
    return timeline
```

### Antardasha Sequence Generator

```python
def calculate_antardasha_sequence(mahadasha_planet, mahadasha_start, mahadasha_duration):
    """
    Calculate all Antardashas within a Mahadasha period.
    """
    # Get Antardasha sequence starting with Mahadasha planet
    start_index = DASHA_SEQUENCE.index(mahadasha_planet)
    antardasha_sequence = DASHA_SEQUENCE[start_index:] + DASHA_SEQUENCE[:start_index]
    
    antardashas = []
    current_date = mahadasha_start
    
    for antardasha_planet in antardasha_sequence:
        # Calculate proportional duration
        duration = (mahadasha_duration * DASHA_PERIODS[antardasha_planet]) / 120.0
        
        antardashas.append({
            'planet': antardasha_planet,
            'start': current_date,
            'duration': duration,
            'end': current_date + timedelta(days=duration * 365.25)
        })
        
        current_date = antardashas[-1]['end']
    
    return antardashas
```

## Time Conversion Utilities

### Years to Days Conversion

```latex
\text{Days} = \text{Years} \times 365.25
```

Using 365.25 accounts for leap years over long periods.

### Date Arithmetic with Timezone Handling

```python
from datetime import datetime, timedelta
import pytz

def add_years_to_date(start_date, years, timezone_str):
    """
    Add fractional years to date with timezone awareness.
    """
    tz = pytz.timezone(timezone_str)
    local_date = tz.localize(start_date) if start_date.tzinfo is None else start_date
    
    days = years * 365.25
    end_date = local_date + timedelta(days=days)
    
    return end_date
```

## Current Period Finder

### Algorithm for Finding Active Dasha

```python
def find_current_periods(timeline, current_date):
    """
    Find Mahadasha, Antardasha, and Pratyantardasha active on current_date.
    """
    # 1. Find current Mahadasha
    current_mahadasha = None
    for period in timeline:
        if period['start'] <= current_date <= period['end']:
            current_mahadasha = period
            break
    
    if not current_mahadasha:
        return None
    
    # 2. Calculate and find current Antardasha
    antardashas = calculate_antardasha_sequence(
        current_mahadasha['planet'],
        current_mahadasha['start'],
        current_mahadasha['duration']
    )
    
    current_antardasha = None
    for antardasha in antardashas:
        if antardasha['start'] <= current_date <= antardasha['end']:
            current_antardasha = antardasha
            break
    
    # 3. Calculate and find current Pratyantardasha
    if current_antardasha:
        pratyantardashas = calculate_antardasha_sequence(
            current_antardasha['planet'],
            current_antardasha['start'],
            current_antardasha['duration']
        )
        
        for pratyantar in pratyantardashas:
            if pratyantar['start'] <= current_date <= pratyantar['end']:
                current_pratyantardasha = pratyantar
                break
    
    return {
        'mahadasha': current_mahadasha,
        'antardasha': current_antardasha,
        'pratyantardasha': current_pratyantardasha
    }
```

## Astronomical Calculations

### Moon Position from Swiss Ephemeris

```python
import swisseph as swe

def calculate_moon_nakshatra(birth_datetime, lat, lon):
    """
    Calculate Moon's nakshatra at birth using Swiss Ephemeris.
    """
    # Convert to Julian Day
    jd = swe.julday(
        birth_datetime.year,
        birth_datetime.month,
        birth_datetime.day,
        birth_datetime.hour + birth_datetime.minute/60.0
    )
    
    # Calculate Moon position (sidereal zodiac)
    swe.set_sid_mode(swe.SIDM_LAHIRI)  # Lahiri ayanamsa
    moon_pos = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)[0][0]
    
    # Calculate nakshatra
    nakshatra_num = int(moon_pos / 13.333...) + 1
    degrees_in_nakshatra = moon_pos % 13.333...
    pada = int(degrees_in_nakshatra / 3.333...) + 1
    
    return {
        'longitude': moon_pos,
        'nakshatra_number': nakshatra_num,
        'nakshatra_name': NAKSHATRA_NAMES[nakshatra_num],
        'pada': pada,
        'degrees_in_nakshatra': degrees_in_nakshatra
    }
```

### Ayanamsa Correction

```latex
\text{Sidereal Longitude} = \text{Tropical Longitude} - \text{Ayanamsa}
```

Lahiri Ayanamsa (most common):
```latex
\text{Ayanamsa}_{2000} \approx 23.85°
\text{Annual increment} \approx 0.0139°/\text{year}
```

## Validation and Edge Cases

### Boundary Validation

```python
def validate_dasha_calculation(timeline):
    """
    Validate Dasha timeline for consistency.
    """
    # Check total duration equals 120 years
    total_years = sum(period['duration'] for period in timeline)
    assert abs(total_years - 120.0) < 0.01, "Timeline must span 120 years"
    
    # Check no gaps between periods
    for i in range(len(timeline) - 1):
        assert timeline[i]['end'] == timeline[i+1]['start'], "Timeline must be continuous"
    
    # Check all 9 planets appear
    planets = {period['planet'] for period in timeline}
    assert len(planets) == 9, "All 9 planets must appear in timeline"
    
    return True
```

### Leap Year Handling

```python
def accurate_date_addition(start_date, years):
    """
    Add years accounting for actual calendar including leap years.
    """
    # Use dateutil.relativedelta for calendar-aware arithmetic
    from dateutil.relativedelta import relativedelta
    
    whole_years = int(years)
    fractional_year = years - whole_years
    
    # Add whole years
    date = start_date + relativedelta(years=whole_years)
    
    # Add fractional year as days
    days = fractional_year * 365.25
    date = date + timedelta(days=days)
    
    return date
```

## Performance Optimization

### Caching Strategy

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_antardasha_sequence(mahadasha_planet):
    """
    Cache Antardasha sequences as they're deterministic.
    """
    start_index = DASHA_SEQUENCE.index(mahadasha_planet)
    return DASHA_SEQUENCE[start_index:] + DASHA_SEQUENCE[:start_index]
```

### Precomputed Tables

```python
# Precompute all Antardasha durations
ANTARDASHA_DURATION_TABLE = {}
for maha_planet in DASHA_SEQUENCE:
    maha_years = DASHA_PERIODS[maha_planet]
    ANTARDASHA_DURATION_TABLE[maha_planet] = {}
    
    for antar_planet in DASHA_SEQUENCE:
        antar_years = DASHA_PERIODS[antar_planet]
        duration = (maha_years * antar_years) / 120.0
        ANTARDASHA_DURATION_TABLE[maha_planet][antar_planet] = duration
```

## References

- **Brihat Parashara Hora Shastra**: Classical text defining Vimshottari Dasha system
- **Swiss Ephemeris**: High-precision astronomical calculations
- **Lahiri Ayanamsa**: Standard ayanamsa for Indian astrology
- **Calculation precision**: Use `float64` (Python `float`) for sub-second accuracy over 120 years

## Implementation Notes

1. **Timezone Handling**: Always store birth time in local timezone, convert to UTC for astronomical calculations
2. **Date Range**: Calculations accurate for dates 3000 BC to 3000 AD (Swiss Ephemeris range)
3. **Precision**: Use `365.25` days/year for long-term accuracy; calendar-aware arithmetic for date display
4. **Validation**: Always validate nakshatra number (1-27) and planet sequence integrity
