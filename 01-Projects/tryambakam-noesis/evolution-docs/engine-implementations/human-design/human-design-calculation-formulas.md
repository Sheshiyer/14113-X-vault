# Human Design Calculation Formulas

**Complete Mathematical and Astronomical Reference**  
*Extracted from WitnessOS Source Code*

---

## Table of Contents

1. [Overview](#overview)
2. [Core Constants](#core-constants)
3. [Astronomical Calculations](#astronomical-calculations)
4. [Gate Calculations](#gate-calculations)
5. [Line Calculations](#line-calculations)
6. [Color, Tone, Base Calculations](#color-tone-base-calculations)
7. [Type Determination](#type-determination)
8. [Profile Calculation](#profile-calculation)
9. [Center Definitions](#center-definitions)
10. [Channel Definitions](#channel-definitions)
11. [Definition Types](#definition-types)
12. [Incarnation Cross](#incarnation-cross)
13. [Lookup Tables](#lookup-tables)

---

## Overview

Human Design uses astronomical calculations based on the exact positions of celestial bodies at two critical moments:
1. **Personality (Conscious)**: Birth moment
2. **Design (Unconscious)**: 88 days (approximately 88° of solar arc) before birth

### Calculation Pipeline

```
Birth Data → Swiss Ephemeris → Planetary Positions → Gates/Lines → Centers → Type/Authority → Chart
```

---

## Core Constants

### I-Ching Wheel Division

```python
TOTAL_GATES = 64
DEGREES_PER_GATE = 360.0 / 64  # 5.625°
LINES_PER_GATE = 6
DEGREES_PER_LINE = DEGREES_PER_GATE / 6  # 0.9375°
```

### Mathematical Constants

```latex
$\text{Gate Degrees} = \frac{360°}{64} = 5.625°$

$\text{Line Degrees} = \frac{5.625°}{6} = 0.9375°$

$\text{Color Divisions} = \frac{0.9375°}{6} = 0.15625°$

$\text{Tone Divisions} = \frac{0.15625°}{6} = 0.026041\overline{6}°$

$\text{Base Divisions} = \frac{0.026041\overline{6}°}{5} = 0.005208\overline{3}°$
```

---

## Astronomical Calculations

### Design Time Calculation (88° Solar Arc)

The Design calculation uses an **88° solar arc** (approximately 88 days before birth):

```python
def calculate_design_datetime(birth_datetime: datetime, latitude: float, 
                              longitude: float, timezone: str) -> datetime:
    """
    Calculate Design time using 88-degree solar arc.
    
    This is the OFFICIAL Human Design method:
    - Go back in time from birth until the Sun has moved 88 degrees
    - This is approximately 88 days but varies due to Earth's elliptical orbit
    """
    from pyswisseph import julday, calc_ut, revjul
    
    # Convert birth time to Julian Day
    birth_jd = julday(
        birth_datetime.year,
        birth_datetime.month,
        birth_datetime.day,
        birth_datetime.hour + birth_datetime.minute/60.0
    )
    
    # Get Sun position at birth
    sun_birth = calc_ut(birth_jd, SE_SUN)[0]  # Longitude at birth
    
    # Target Sun position (88 degrees earlier in the zodiac)
    target_sun = (sun_birth - 88.0) % 360.0
    
    # Iterate backwards to find when Sun was at target position
    design_jd = birth_jd - 88.0  # Start approximately 88 days before
    
    for iteration in range(100):  # Safety limit
        sun_position = calc_ut(design_jd, SE_SUN)[0]
        diff = (sun_position - target_sun + 180) % 360 - 180  # Signed difference
        
        if abs(diff) < 0.01:  # Within 0.01 degrees = precise enough
            break
        
        # Adjust: roughly 1 degree per day
        design_jd -= diff
    
    # Convert back to datetime
    year, month, day, hour = revjul(design_jd)
    design_datetime = datetime(year, month, day, int(hour), int((hour % 1) * 60))
    
    return design_datetime
```

### Formula Summary

```latex
$\text{Design Time} = \text{Birth Time} - \Delta t$

\text{where } \Delta t \text{ satisfies: } \lambda_{\odot}(\text{birth}) - \lambda_{\odot}(\text{design}) = 88°

$\lambda_{\odot}$ = solar longitude
```

### Planetary Position Calculation

Uses **Swiss Ephemeris** for precise positions:

```python
def calculate_planetary_positions(julian_day: float) -> Dict[str, Dict]:
    """
    Calculate positions for all planets used in Human Design.
    
    Planets used:
    - Sun, Earth, Moon, North Node, South Node
    - Mercury, Venus, Mars, Jupiter, Saturn
    - Uranus, Neptune, Pluto
    """
    import swisseph as swe
    
    planets = {
        'sun': swe.SUN,
        'moon': swe.MOON,
        'mercury': swe.MERCURY,
        'venus': swe.VENUS,
        'mars': swe.MARS,
        'jupiter': swe.JUPITER,
        'saturn': swe.SATURN,
        'uranus': swe.URANUS,
        'neptune': swe.NEPTUNE,
        'pluto': swe.PLUTO,
        'north_node': swe.MEAN_NODE,
    }
    
    positions = {}
    for planet_name, planet_id in planets.items():
        result = swe.calc_ut(julian_day, planet_id)
        longitude = result[0]
        
        # Earth is opposite Sun
        if planet_name == 'sun':
            positions['earth'] = {
                'longitude': (longitude + 180.0) % 360.0,
                'latitude': -result[1],
                'distance': result[2]
            }
        
        positions[planet_name] = {
            'longitude': longitude,
            'latitude': result[1],
            'distance': result[2],
            'speed': result[3]
        }
    
    # South Node is opposite North Node
    positions['south_node'] = {
        'longitude': (positions['north_node']['longitude'] + 180.0) % 360.0,
        'latitude': -positions['north_node']['latitude'],
        'distance': positions['north_node']['distance']
    }
    
    return positions
```

---

## Gate Calculations

### Longitude to Gate Number

The I-Ching wheel starts at **58° Aries** (not 0° Aries):

```python
def calculate_gate_from_longitude(longitude: float) -> int:
    """
    Convert ecliptic longitude to Human Design gate number.
    
    The I-Ching wheel has a specific ordering (Rave Mandala).
    Gate 41 starts at 58° Aries (58° absolute).
    """
    
    # Apply the 58° offset for Human Design wheel
    adjusted_longitude = (longitude + 58.0) % 360.0
    
    # Use I-Ching wheel sequence
    RAVE_WHEEL_SEQUENCE = [
        41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
        27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
        31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
        28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
    ]
    
    gate_index = int(adjusted_longitude / DEGREES_PER_GATE)
    gate_number = RAVE_WHEEL_SEQUENCE[gate_index]
    
    return gate_number
```

### Formula

```latex
$\text{Adjusted Longitude} = (\lambda + 58°) \mod 360°$

$\text{Gate Index} = \lfloor \frac{\text{Adjusted Longitude}}{5.625°} \rfloor$

$\text{Gate Number} = \text{RAVE\_WHEEL\_SEQUENCE}[\text{Gate Index}]$
```

---

## Line Calculations

### Line Number from Longitude

```python
def calculate_line(longitude: float, gate_num: int) -> int:
    """
    Calculate line number (1-6) from longitude.
    
    Each line covers 0.9375 degrees within a gate.
    Uses modulo to get position within current gate.
    """
    gate_degrees = 360.0 / 64.0  # 5.625 degrees per gate
    line_degrees = gate_degrees / 6.0  # 0.9375 degrees per line
    
    # Get position within current gate using modulo
    position_in_gate = longitude % gate_degrees
    
    # Calculate line number (1-6)
    line_number = int(position_in_gate / line_degrees) + 1
    
    # Clamp to valid range
    return min(6, max(1, line_number))
```

### Formula

```latex
$\text{Position in Gate} = \lambda \mod 5.625°$

$\text{Line Number} = \lfloor \frac{\text{Position in Gate}}{0.9375°} \rfloor + 1$

$\text{Line Number} \in [1, 6]$
```

---

## Color, Tone, Base Calculations

### Color Calculation (1-6)

```python
def calculate_color(longitude: float, gate_num: int) -> int:
    """
    Calculate color (1-6) from longitude.
    
    Each line has 6 colors.
    Color divisions = 0.15625 degrees.
    """
    line_degrees = 0.9375  # degrees per line
    color_degrees = line_degrees / 6.0  # 0.15625 degrees per color
    
    position_in_gate = longitude % (360.0 / 64.0)
    position_in_line = position_in_gate % line_degrees
    
    color_number = int(position_in_line / color_degrees) + 1
    return min(6, max(1, color_number))
```

### Tone Calculation (1-6)

```python
def calculate_tone(longitude: float, gate_num: int) -> int:
    """
    Calculate tone (1-6) from longitude.
    
    Each color has 6 tones.
    Tone divisions = 0.026041666... degrees.
    """
    color_degrees = 0.15625
    tone_degrees = color_degrees / 6.0  # ~0.026041666 degrees per tone
    
    position_in_gate = longitude % (360.0 / 64.0)
    position_in_line = position_in_gate % 0.9375
    position_in_color = position_in_line % color_degrees
    
    tone_number = int(position_in_color / tone_degrees) + 1
    return min(6, max(1, tone_number))
```

### Base Calculation (1-5)

```python
def calculate_base(longitude: float, gate_num: int) -> int:
    """
    Calculate base (1-5) from longitude.
    
    Each tone has 5 bases.
    Base divisions = 0.00520833... degrees.
    """
    tone_degrees = 0.026041666
    base_degrees = tone_degrees / 5.0  # ~0.00520833 degrees per base
    
    position_in_gate = longitude % (360.0 / 64.0)
    position_in_line = position_in_gate % 0.9375
    position_in_color = position_in_line % 0.15625
    position_in_tone = position_in_color % tone_degrees
    
    base_number = int(position_in_tone / base_degrees) + 1
    return min(5, max(1, base_number))
```

### Formulas Summary

```latex
$\text{Color} = \lfloor \frac{\lambda \mod 0.9375°}{0.15625°} \rfloor + 1, \quad \text{Color} \in [1,6]$

$\text{Tone} = \lfloor \frac{\lambda \mod 0.15625°}{0.026041\overline{6}°} \rfloor + 1, \quad \text{Tone} \in [1,6]$

$\text{Base} = \lfloor \frac{\lambda \mod 0.026041\overline{6}°}{0.005208\overline{3}°} \rfloor + 1, \quad \text{Base} \in [1,5]$
```

---

## Type Determination

### Type Logic

```python
def determine_type(personality_gates: Dict, design_gates: Dict, 
                   centers: Dict) -> str:
    """
    Determine Human Design type based on center definitions.
    
    Type hierarchy:
    1. Reflector: No defined centers
    2. Manifestor: Motor to Throat, no Sacral
    3. Generator: Sacral defined
    4. Manifesting Generator: Sacral + Motor to Throat
    5. Projector: No Sacral, no Motor to Throat
    """
    
    # Check center definitions
    sacral_defined = centers['Sacral'].defined
    motor_to_throat = has_motor_to_throat_connection(centers)
    no_defined_centers = all(not c.defined for c in centers.values())
    
    # Type determination logic
    if no_defined_centers:
        return "Reflector"
    elif motor_to_throat and not sacral_defined:
        return "Manifestor"
    elif sacral_defined and motor_to_throat:
        return "Manifesting Generator"
    elif sacral_defined:
        return "Generator"
    else:
        return "Projector"
```

### Motor to Throat Connection

```python
def has_motor_to_throat_connection(centers: Dict) -> bool:
    """
    Check if any motor center connects to Throat.
    
    Motor Centers: Sacral, Solar Plexus, Heart (Ego), Root
    Throat Center: Communication/Manifestation
    """
    motor_centers = ['Sacral', 'Solar Plexus', 'Heart', 'Root']
    
    # Check for defined channels connecting motors to throat
    motor_throat_channels = [
        (20, 34),  # Root to Throat
        (12, 22),  # Solar Plexus to Throat
        (35, 36),  # Solar Plexus to Throat
        (16, 48),  # Throat to Spleen (via Solar Plexus)
        # ... and more
    ]
    
    # Implementation depends on channel analysis
    return False  # Simplified
```

---

## Profile Calculation

### Profile from Sun Lines

```python
def calculate_profile(personality_sun: HumanDesignGate, 
                      design_sun: HumanDesignGate) -> HumanDesignProfile:
    """
    Calculate profile from Personality Sun and Design Sun lines.
    
    Profile = Personality Line / Design Line
    Example: 1/3, 2/4, 6/2, etc.
    """
    personality_line = personality_sun.line  # 1-6
    design_line = design_sun.line  # 1-6
    
    # Profile line meanings
    line_names = {
        1: "Investigator",
        2: "Hermit",
        3: "Martyr",
        4: "Opportunist",
        5: "Heretic",
        6: "Role Model"
    }
    
    p_name = line_names[personality_line]
    d_name = line_names[design_line]
    
    profile_name = f"{personality_line}/{design_line} {p_name}/{d_name}"
    
    return HumanDesignProfile(
        personality_line=personality_line,
        design_line=design_line,
        profile_name=profile_name,
        description=get_profile_description(personality_line, design_line),
        life_theme=get_profile_theme(personality_line, design_line),
        role=get_profile_role(personality_line, design_line)
    )
```

### Profile Types

There are **12 unique profiles** (some line combinations are identical):

```python
PROFILE_DESCRIPTIONS = {
    (1, 3): "Investigator/Martyr - Foundation through experimentation",
    (1, 4): "Investigator/Opportunist - Foundation through network",
    (2, 4): "Hermit/Opportunist - Natural talent meets opportunity",
    (2, 5): "Hermit/Heretic - Natural solutions for others",
    (3, 5): "Martyr/Heretic - Trial and error leading to solutions",
    (3, 6): "Martyr/Role Model - Experimentation leading to wisdom",
    (4, 6): "Opportunist/Role Model - Network influence with wisdom",
    (4, 1): "Opportunist/Investigator - Network built on foundation",
    (5, 1): "Heretic/Investigator - Universal solutions from foundation",
    (5, 2): "Heretic/Hermit - Projection onto natural talent",
    (6, 2): "Role Model/Hermit - Wisdom from natural gift",
    (6, 3): "Role Model/Martyr - Wisdom through experimentation"
}
```

---

## Center Definitions

### Nine Centers and Their Gates

```python
CENTER_GATE_MAPPING = {
    "Head": [64, 61, 63],
    
    "Ajna": [47, 24, 4, 17, 43, 11],
    
    "Throat": [62, 23, 56, 35, 12, 45, 33, 8, 31, 16, 20],
    
    "G": [7, 1, 13, 10, 25, 15, 46, 2],
    
    "Heart": [51, 21, 40, 26],
    
    "Sacral": [5, 14, 29, 59, 9, 3, 42, 27, 34],
    
    "Solar Plexus": [6, 37, 22, 36, 30, 55, 49],
    
    "Spleen": [48, 57, 44, 50, 32, 28, 18],
    
    "Root": [53, 60, 52, 19, 39, 41, 38, 54, 58]
}
```

### Center Definition Logic

```python
def is_center_defined(center_name: str, personality_gates: Dict, 
                      design_gates: Dict) -> bool:
    """
    A center is defined if:
    1. At least one gate in the center is activated, OR
    2. A complete channel (gate pair) defines it through connection
    
    For full definition, you need BOTH gates of at least one channel.
    """
    center_gates = CENTER_GATE_MAPPING[center_name]
    
    # Collect all activated gates
    all_gates = set()
    for gate in personality_gates.values():
        all_gates.add(gate.number)
    for gate in design_gates.values():
        all_gates.add(gate.number)
    
    # Check if any gate in this center is activated
    activated_gates = all_gates.intersection(set(center_gates))
    
    # For true definition, need complete channels (simplified here)
    return len(activated_gates) > 0
```

---

## Channel Definitions

### 36 Channels

Each channel connects two gates between centers:

```python
CHANNELS = {
    # Format: (gate1, gate2): {"name": "Channel Name", "circuit": "Circuit"}
    
    # Individual Circuitry
    (1, 8): {
        "name": "The Channel of Inspiration",
        "circuit": "Individual - Knowing",
        "centers": ["Throat", "G"]
    },
    (10, 20): {
        "name": "The Channel of Awakening",
        "circuit": "Individual - Integration",
        "centers": ["Throat", "G"]
    },
    (10, 34): {
        "name": "The Channel of Exploration",
        "circuit": "Individual - Centering",
        "centers": ["Sacral", "G"]
    },
    (10, 57): {
        "name": "The Channel of Perfected Form",
        "circuit": "Individual - Centering",
        "centers": ["Spleen", "G"]
    },
    (12, 22): {
        "name": "The Channel of Openness",
        "circuit": "Individual - Knowing",
        "centers": ["Throat", "Solar Plexus"]
    },
    (13, 33): {
        "name": "The Channel of the Prodigal",
        "circuit": "Collective - Logic",
        "centers": ["Throat", "G"]
    },
    (16, 48): {
        "name": "The Channel of Wavelength",
        "circuit": "Collective - Logic",
        "centers": ["Throat", "Spleen"]
    },
    (17, 62): {
        "name": "The Channel of Acceptance",
        "circuit": "Collective - Logic",
        "centers": ["Throat", "Ajna"]
    },
    (18, 58): {
        "name": "The Channel of Judgment",
        "circuit": "Collective - Logic",
        "centers": ["Root", "Spleen"]
    },
    (19, 49): {
        "name": "The Channel of Synthesis",
        "circuit": "Tribal - Ego",
        "centers": ["Root", "Solar Plexus"]
    },
    (20, 34): {
        "name": "The Channel of Charisma",
        "circuit": "Individual - Integration",
        "centers": ["Throat", "Sacral"]
    },
    (20, 57): {
        "name": "The Channel of The Brainwave",
        "circuit": "Individual - Integration",
        "centers": ["Throat", "Spleen"]
    },
    (21, 45): {
        "name": "The Channel of Money",
        "circuit": "Tribal - Ego",
        "centers": ["Throat", "Heart"]
    },
    (23, 43): {
        "name": "The Channel of Structuring",
        "circuit": "Individual - Knowing",
        "centers": ["Throat", "Ajna"]
    },
    (24, 61): {
        "name": "The Channel of Awareness",
        "circuit": "Individual - Knowing",
        "centers": ["Head", "Ajna"]
    },
    (25, 51): {
        "name": "The Channel of Initiation",
        "circuit": "Individual - Centering",
        "centers": ["Heart", "G"]
    },
    (26, 44): {
        "name": "The Channel of Surrender",
        "circuit": "Tribal - Ego",
        "centers": ["Heart", "Spleen"]
    },
    (27, 50): {
        "name": "The Channel of Preservation",
        "circuit": "Tribal - Defense",
        "centers": ["Sacral", "Spleen"]
    },
    (28, 38): {
        "name": "The Channel of Struggle",
        "circuit": "Individual - Knowing",
        "centers": ["Root", "Spleen"]
    },
    (29, 46): {
        "name": "The Channel of Discovery",
        "circuit": "Collective - Abstract",
        "centers": ["Sacral", "G"]
    },
    (30, 41): {
        "name": "The Channel of Recognition",
        "circuit": "Collective - Abstract",
        "centers": ["Root", "Solar Plexus"]
    },
    (32, 54): {
        "name": "The Channel of Transformation",
        "circuit": "Tribal - Ego",
        "centers": ["Root", "Spleen"]
    },
    (34, 57): {
        "name": "The Channel of Power",
        "circuit": "Individual - Centering",
        "centers": ["Sacral", "Spleen"]
    },
    (35, 36): {
        "name": "The Channel of Transitoriness",
        "circuit": "Collective - Abstract",
        "centers": ["Throat", "Solar Plexus"]
    },
    (37, 40): {
        "name": "The Channel of Community",
        "circuit": "Tribal - Ego",
        "centers": ["Heart", "Solar Plexus"]
    },
    (39, 55): {
        "name": "The Channel of Emoting",
        "circuit": "Individual - Knowing",
        "centers": ["Root", "Solar Plexus"]
    },
    (42, 53): {
        "name": "The Channel of Maturation",
        "circuit": "Collective - Abstract",
        "centers": ["Root", "Sacral"]
    },
    (47, 64): {
        "name": "The Channel of Abstraction",
        "circuit": "Collective - Abstract",
        "centers": ["Head", "Ajna"]
    },
    (52, 9): {
        "name": "The Channel of Concentration",
        "circuit": "Collective - Logic",
        "centers": ["Root", "Sacral"]
    },
    (59, 6): {
        "name": "The Channel of Intimacy",
        "circuit": "Tribal - Defense",
        "centers": ["Sacral", "Solar Plexus"]
    },
    (63, 4): {
        "name": "The Channel of Logic",
        "circuit": "Collective - Logic",
        "centers": ["Head", "Ajna"]
    },
}
```

### Channel Definition Check

```python
def find_defined_channels(personality_gates: Dict, 
                         design_gates: Dict) -> List[str]:
    """
    A channel is defined when BOTH gates are activated 
    (from either personality or design).
    """
    # Collect all activated gate numbers
    all_gates = set()
    for gate in personality_gates.values():
        all_gates.add(gate.number)
    for gate in design_gates.values():
        all_gates.add(gate.number)
    
    defined_channels = []
    
    for (gate1, gate2), channel_info in CHANNELS.items():
        if gate1 in all_gates and gate2 in all_gates:
            defined_channels.append(channel_info['name'])
    
    return defined_channels
```

---

## Definition Types

### Definition Classification

```python
def determine_definition_type(centers: Dict, 
                               defined_channels: List[str]) -> str:
    """
    Definition types based on how centers connect:
    
    1. No Definition: No defined centers
    2. Single Definition: All defined centers connected
    3. Split Definition: 2 separate groups of connected centers
    4. Triple Split: 3 separate groups
    5. Quadruple Split: 4 separate groups (rare)
    """
    defined_centers = [name for name, center in centers.items() 
                       if center.defined]
    
    if len(defined_centers) == 0:
        return "No Definition"
    
    # Build connection graph
    connections = build_center_connections(defined_channels)
    
    # Find connected components using graph algorithm
    groups = find_connected_components(defined_centers, connections)
    
    if len(groups) == 1:
        return "Single Definition"
    elif len(groups) == 2:
        return "Split Definition"
    elif len(groups) == 3:
        return "Triple Split Definition"
    else:
        return "Quadruple Split Definition"
```

---

## Incarnation Cross

### Cross Calculation

```python
def calculate_incarnation_cross(personality_gates: Dict, 
                                design_gates: Dict) -> Dict:
    """
    Incarnation Cross is formed by 4 gates:
    - Conscious Sun (Personality Sun)
    - Conscious Earth (Personality Earth)
    - Unconscious Sun (Design Sun)
    - Unconscious Earth (Design Earth)
    """
    conscious_sun = personality_gates['sun'].number
    conscious_earth = personality_gates['earth'].number
    unconscious_sun = design_gates['sun'].number
    unconscious_earth = design_gates['earth'].number
    
    # Determine cross type based on line positions
    p_line = personality_gates['sun'].line
    d_line = design_gates['sun'].line
    
    # Cross angle types
    if p_line in [1, 2, 3]:
        cross_type = "Right Angle"
        cross_angle = "Personal Destiny"
    elif p_line in [4]:
        cross_type = "Juxtaposition"
        cross_angle = "Fixed Fate"
    else:  # p_line in [5, 6]
        cross_type = "Left Angle"
        cross_angle = "Transpersonal Karma"
    
    # Look up cross name from database
    cross_name = lookup_cross_name(
        conscious_sun, conscious_earth, 
        unconscious_sun, unconscious_earth, 
        cross_type
    )
    
    return {
        "name": cross_name,
        "type": cross_type,
        "angle": cross_angle,
        "gates": {
            "conscious_sun": conscious_sun,
            "conscious_earth": conscious_earth,
            "unconscious_sun": unconscious_sun,
            "unconscious_earth": unconscious_earth
        }
    }
```

### Cross Angle Determination

```latex
\text{Cross Angle} = \begin{cases}
\text{Right Angle} & \text{if } p_{line} \in \{1, 2, 3\} \\
\text{Juxtaposition} & \text{if } p_{line} = 4 \\
\text{Left Angle} & \text{if } p_{line} \in \{5, 6\}
\end{cases}
```

---

## Lookup Tables

### Profile Line Meanings

```python
PROFILE_LINES = {
    1: {
        "name": "Investigator",
        "description": "Foundation, introspection, security",
        "theme": "I investigate to feel secure"
    },
    2: {
        "name": "Hermit",
        "description": "Natural talent, projection, being called out",
        "theme": "I have natural gifts that need to be called out"
    },
    3: {
        "name": "Martyr",
        "description": "Trial and error, experimentation, discovery",
        "theme": "I learn through trial and error"
    },
    4: {
        "name": "Opportunist",
        "description": "Network, friendship, influence",
        "theme": "I influence through my network"
    },
    5: {
        "name": "Heretic",
        "description": "Projection, universalization, practical solutions",
        "theme": "I project solutions onto the universal"
    },
    6: {
        "name": "Role Model",
        "description": "Transition, objectivity, wisdom",
        "theme": "I transition through life to embody wisdom"
    }
}
```

### Type Statistics

```python
HUMAN_DESIGN_TYPES = {
    "Generator": {
        "strategy": "To Respond",
        "authority": "Sacral Authority",
        "signature": "Satisfaction",
        "not_self": "Frustration",
        "percentage": 37.0,
        "description": "Pure builders with sustainable energy"
    },
    "Manifesting Generator": {
        "strategy": "To Respond (then Inform)",
        "authority": "Sacral Authority",
        "signature": "Satisfaction",
        "not_self": "Frustration",
        "percentage": 33.0,
        "description": "Multi-passionate builders who manifest quickly"
    },
    "Projector": {
        "strategy": "Wait for Invitation",
        "authority": "Various (Splenic, Emotional, Ego, Self, Mental)",
        "signature": "Success",
        "not_self": "Bitterness",
        "percentage": 20.0,
        "description": "Natural guides designed to see others"
    },
    "Manifestor": {
        "strategy": "To Inform",
        "authority": "Emotional or Splenic",
        "signature": "Peace",
        "not_self": "Anger",
        "percentage": 9.0,
        "description": "Initiators designed to impact"
    },
    "Reflector": {
        "strategy": "Wait a Lunar Cycle",
        "authority": "Lunar Authority",
        "signature": "Surprise",
        "not_self": "Disappointment",
        "percentage": 1.0,
        "description": "Mirrors of the environment"
    }
}
```

### I-Ching Rave Wheel Sequence

```python
RAVE_WHEEL_SEQUENCE = [
    # Starting at 58° Aries (Gate 41)
    41, 19, 13, 49, 30, 55, 37, 63,  # Aries
    22, 36, 25, 17, 21, 51, 42, 3,   # Taurus
    27, 24, 2, 23, 8, 20, 16, 35,    # Gemini
    45, 12, 15, 52, 39, 53, 62, 56,  # Cancer
    31, 33, 7, 4, 29, 59, 40, 64,    # Leo
    47, 6, 46, 18, 48, 57, 32, 50,   # Virgo
    28, 44, 1, 43, 14, 34, 9, 5,     # Libra
    26, 11, 10, 58, 38, 54, 61, 60   # Scorpio
]
```

---

## Implementation Notes

### Dependencies

```python
# Required packages
import swisseph as swe  # Swiss Ephemeris for astronomical calculations
from datetime import datetime, timedelta
import pytz  # For timezone handling
from typing import Dict, List, Tuple, Any
```

### Precision Requirements

- **Planetary positions**: ±0.01° accuracy
- **Gate calculations**: Integer precision (1-64)
- **Line calculations**: Integer precision (1-6)
- **Design time**: ±88° solar arc (typically 86-90 days)

### Validation

```python
def validate_coordinates(lat: float, lon: float):
    """Validate geographic coordinates."""
    if not (-90 <= lat <= 90):
        raise ValueError(f"Latitude must be between -90 and 90, got {lat}")
    if not (-180 <= lon <= 180):
        raise ValueError(f"Longitude must be between -180 and 180, got {lon}")

def validate_datetime(dt: datetime):
    """Validate birth datetime."""
    if dt > datetime.now():
        raise ValueError("Birth date cannot be in the future")
    if dt.year < 1900:
        raise ValueError("Birth year must be after 1900")
```

---

## References

1. Ra Uru Hu - *The Rave I'Ching*
2. Ra Uru Hu - *The Rave Bodygraph*
3. Swiss Ephemeris Documentation
4. Human Design International Standards
5. WitnessOS Source Code (2026)

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Source**: WitnessOS/docs/engines/human_design.py  
**Lines of Code**: 756
