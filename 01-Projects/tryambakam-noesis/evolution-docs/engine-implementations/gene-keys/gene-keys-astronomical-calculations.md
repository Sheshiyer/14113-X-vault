# Gene Keys Astronomical Calculations

**Source:** WitnessOS `gene_keys.py` lines 77-118

---

## Overview

Gene Keys use **identical astronomical calculations** as Human Design to determine gate numbers (1-64). Planetary positions in the zodiac are mapped to I-Ching hexagrams, which correspond directly to Gene Keys.

**Key Principle:** Same astronomy, different interpretation framework

---

## Calculation Method

### Core Function

```python
def _calculate_gene_keys_from_astronomy(
    self, 
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> Dict[str, int]:
    """
    Calculate Gene Key numbers using proper astronomical calculations.
    
    Gene Keys use the same I-Ching gates as Human Design, 
    based on planetary positions.
    """
```

---

## Step-by-Step Process

### Step 1: Prepare Birth Data

```python
# Combine birth date and time into datetime object
birth_datetime = datetime.combine(birth_date, birth_time)

# Extract coordinates
lat, lon = birth_location
```

**Required Inputs:**
- `birth_date`: Date object (year, month, day)
- `birth_time`: Time object (hour, minute, second)
- `birth_location`: Tuple of (latitude, longitude) as floats
- `timezone`: String (e.g., "America/New_York", "Europe/London")

---

### Step 2: Calculate Human Design Data

```python
# Calculate Human Design astronomical data (which Gene Keys are based on)
hd_data = self.astro_calc.calculate_human_design_data(
    birth_datetime, lat, lon, timezone
)
```

**What This Does:**

1. **Personality Calculation** (Birth moment)
   - Sun position → Zodiac degree → Gate number (1-64)
   - Earth position (opposite Sun) → Gate number
   - Venus, Mars, Jupiter, Saturn, etc. → Gate numbers

2. **Design Calculation** (88 days before birth)
   - Same planetary calculations at conception moment (~3 months pre-birth)
   - All planets positioned at design time
   - Creates "unconscious" or "body" layer

**Output Structure:**
```python
hd_data = {
    'personality_gates': {
        'sun': int,      # 1-64
        'earth': int,    # 1-64
        'venus': int,    # 1-64
        'mars': int,     # 1-64
        'jupiter': int,  # 1-64
        'saturn': int,   # 1-64
        'uranus': int,   # 1-64
        'neptune': int,  # 1-64
        'pluto': int,    # 1-64
        'moon_north': int,  # North Node
        'moon_south': int   # South Node
    },
    'design_gates': {
        # Same structure, calculated 88 days before birth
        'sun': int,
        'earth': int,
        'venus': int,
        # ... etc
    }
}
```

---

### Step 3: Extract Activation Sequence Gates

```python
# Extract the four primary gates for Activation Sequence
activation_gates = {
    'lifes_work': hd_data['personality_gates']['sun'],    # Personality Sun
    'evolution': hd_data['personality_gates']['earth'],   # Personality Earth
    'radiance': hd_data['design_gates']['sun'],          # Design Sun
    'purpose': hd_data['design_gates']['earth']          # Design Earth
}
```

**Activation Sequence Mapping:**

| Gate Name | Planetary Position | Time Layer | Consciousness |
|-----------|-------------------|------------|---------------|
| **Life's Work** | Sun at birth | Personality | Conscious creative expression |
| **Evolution** | Earth at birth | Personality | Conscious growth path |
| **Radiance** | Sun 88 days before | Design | Unconscious gift to humanity |
| **Purpose** | Earth 88 days before | Design | Unconscious spiritual mission |

**Why These Four?**
- **Sun/Earth axis** represents core purpose (creative/grounding)
- **Personality/Design layers** create conscious/unconscious dynamic
- Together form the "Hologenetic Profile" foundation

---

### Step 4: Extract Venus Sequence Gates

```python
# For Venus Sequence, we need Venus positions
venus_gates = {
    'attraction': hd_data['personality_gates'].get('venus', 1),
    'magnetism': hd_data['design_gates'].get('venus', 1)
}
```

**Venus Sequence Mapping:**

| Gate Name | Planetary Position | Time Layer | Theme |
|-----------|-------------------|------------|-------|
| **Attraction** | Venus at birth | Personality | Conscious relationship patterns |
| **Magnetism** | Venus 88 days before | Design | Unconscious charisma |

**Fallback Behavior:**
- Uses `.get('venus', 1)` to default to Gene Key 1 if Venus data missing
- Ensures calculation never crashes

---

### Step 5: Extract Pearl Sequence Gates

```python
# For Pearl Sequence, we need outer planet positions
pearl_gates = {
    'vocation': hd_data['personality_gates'].get('jupiter', 1),
    'culture': hd_data['personality_gates'].get('saturn', 1),
    'brand': hd_data['personality_gates'].get('uranus', 1)
}
```

**Pearl Sequence Mapping:**

| Gate Name | Planetary Position | Time Layer | Theme |
|-----------|-------------------|------------|-------|
| **Vocation** | Jupiter at birth | Personality | Career path and expansion |
| **Culture** | Saturn at birth | Personality | Social responsibility |
| **Brand** | Uranus at birth | Personality | Unique signature |

**Why Outer Planets?**
- **Jupiter:** Expansion, growth, opportunity
- **Saturn:** Structure, responsibility, mastery
- **Uranus:** Innovation, revolution, uniqueness
- Represent material/worldly manifestation

**Design Note:**
- Pearl sequence uses **only Personality** (birth moment)
- Does not include Design layer gates
- Focuses on conscious worldly expression

---

### Step 6: Return Combined Gate Dictionary

```python
return {
    **activation_gates,  # 4 gates
    **venus_gates,       # 2 gates
    **pearl_gates        # 3 gates
}
```

**Complete Return Structure:**
```python
{
    # Activation Sequence
    'lifes_work': int,    # 1-64
    'evolution': int,     # 1-64
    'radiance': int,      # 1-64
    'purpose': int,       # 1-64
    
    # Venus Sequence
    'attraction': int,    # 1-64
    'magnetism': int,     # 1-64
    
    # Pearl Sequence
    'vocation': int,      # 1-64
    'culture': int,       # 1-64
    'brand': int          # 1-64
}
```

---

## Zodiac to Gate Mapping Logic

### How Planetary Positions Become Gate Numbers

**Human Design uses the 64 I-Ching hexagrams mapped around the 360° zodiac:**

```
360° zodiac ÷ 64 gates = 5.625° per gate
```

**Mapping Process:**

1. **Calculate planet's exact zodiac position**
   - Example: Sun at 15° Aries
   - Aries starts at 0°, so absolute position = 0° + 15° = 15°

2. **Determine which gate contains that degree**
   - 15° ÷ 5.625° = 2.66
   - This falls in Gate 3 (spans approximately 11.25° to 16.875°)

3. **Return gate number**
   - Gate number = 3
   - This becomes the Gene Key number

**Note:** Actual HD gate boundaries are non-uniform due to traditional I-Ching ordering, not simple division. The astrology calculator handles this complexity.

---

## Design Time: The 88-Day Mystery

### Why 88 Days Before Birth?

**Three Explanations:**

1. **Human Gestation Timeline**
   - ~3 months (88 days) is approximate differentiation point
   - When fetal consciousness "enters" the body
   - Esoteric tradition from Human Design

2. **Solar-Lunar Cycle**
   - 3 lunar months
   - Significant in many ancient systems
   - Harmonizes solar and lunar rhythms

3. **Empirical Observation**
   - Richard Rudd (Gene Keys) and Ra Uru Hu (Human Design) found this timing significant
   - Anecdotal validation from thousands of readings

**Technical Implementation:**
```python
design_datetime = birth_datetime - timedelta(days=88)
# Calculate all planetary positions at this earlier moment
```

---

## Personality vs Design Layer

### Dual Time Calculation

| Layer | Time | Consciousness | Gene Keys Role |
|-------|------|---------------|----------------|
| **Personality** | Birth moment | Conscious | What we're aware of |
| **Design** | 88 days before | Unconscious | What operates through us |

**Integration:**
- Both layers influence expression
- Design often felt as "authentic" but unconscious
- Personality felt as "chosen" but sometimes forced
- Gene Keys work integrates both

---

## Practical Example

### Example Calculation

**Input:**
- Birth Date: April 15, 1985
- Birth Time: 14:30:00
- Location: 40.7128° N, 74.0060° W (New York City)
- Timezone: "America/New_York"

**Step 1: Prepare**
```python
birth_datetime = datetime(1985, 4, 15, 14, 30, 0)
lat, lon = 40.7128, -74.0060
```

**Step 2: Calculate HD Data**
```python
# Internal calculation by astrology calculator
personality_sun_degree = 25.5° Aries  # Example
personality_sun_gate = 51              # Maps to Gate 51

personality_earth_degree = 25.5° Libra  # Opposite
personality_earth_gate = 57             # Maps to Gate 57

# Design time: January 16, 1985 (88 days earlier)
design_sun_degree = 26.2° Capricorn
design_sun_gate = 61

design_earth_degree = 26.2° Cancer
design_earth_gate = 62
```

**Step 3: Extract Gates**
```python
activation_gates = {
    'lifes_work': 51,   # Life's Work: Gene Key 51 (Shock)
    'evolution': 57,    # Evolution: Gene Key 57 (Intuition)
    'radiance': 61,     # Radiance: Gene Key 61 (Inspiration)
    'purpose': 62       # Purpose: Gene Key 62 (Detail)
}
```

**Step 4: Interpret**
- Life's Work (GK 51): Transform Agitation → Initiative → Awakening
- Evolution (GK 57): Transform Unease → Intuition → Clarity
- Radiance (GK 61): Transform Psychosis → Inspiration → Sanctity
- Purpose (GK 62): Transform Intellect → Precision → Impeccability

---

## Integration with Human Design

### Shared Calculations

| Aspect | Human Design | Gene Keys | Difference |
|--------|--------------|-----------|------------|
| **Astronomy** | ✅ Planetary positions | ✅ Planetary positions | None |
| **Gate Numbers** | ✅ 1-64 from zodiac | ✅ 1-64 from zodiac | None |
| **Design Time** | ✅ 88 days before | ✅ 88 days before | None |
| **Interpretation** | Type, Authority, Centers | Shadow, Gift, Siddhi | **Different** |

**Key Insight:** 
- Same astronomy, different lens
- HD focuses on decision-making mechanics
- Gene Keys focus on consciousness evolution
- Both are valid, complementary systems

---

## Error Handling and Edge Cases

### 1. Missing Planetary Data

```python
hd_data['personality_gates'].get('venus', 1)
```
- Falls back to Gene Key 1 if Venus not calculated
- Prevents crashes from incomplete data

### 2. Out-of-Range Gate Numbers

```python
# In _get_gene_key_by_number():
if number < 1 or number > 64:
    number = ((number - 1) % 64) + 1
```
- Wraps invalid numbers into 1-64 range
- Handles calculation errors gracefully

### 3. Timezone Handling

```python
# Astrology calculator handles timezone conversion
# Ensures calculations in correct local solar time
```
- Critical for accurate gate positions
- Sun moves ~1° per day → changes gates every 5-6 days
- Time errors can shift gates incorrectly

---

## Performance Optimization

### Single Calculation Reuse

```python
# Calculate once
gene_keys = self._calculate_gene_keys_from_astronomy(
    birth_date, birth_time, birth_location, timezone
)

# Use for all three sequences
activation = self._create_activation_sequence(...)  # Reuses gene_keys
venus = self._create_venus_sequence(...)            # Reuses gene_keys  
pearl = self._create_pearl_sequence(...)            # Reuses gene_keys
```

**Benefit:**
- Expensive astronomy calculation done once
- All sequences reference same gate dictionary
- Ensures consistency across sequences

---

## Summary

Gene Keys astronomical calculations:

1. **Leverage Human Design astrology** for gate determination
2. **Use two time layers** (Personality at birth, Design 88 days before)
3. **Map planetary positions** to 64 I-Ching gates
4. **Extract specific gates** for each sequence (Activation, Venus, Pearl)
5. **Handle errors gracefully** with fallbacks
6. **Optimize performance** through single calculation reuse

**Result:** Reliable, astronomically accurate gate numbers for archetypal interpretation through the Gene Keys framework.
