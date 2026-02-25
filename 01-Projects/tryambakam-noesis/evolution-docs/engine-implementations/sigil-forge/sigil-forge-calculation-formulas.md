# Sigil Forge Engine - Calculation Formulas & Mathematical Foundations

## Document Overview

**Engine:** Sigil Forge Synthesizer  
**Version:** 1.0.0  
**Domain:** Symbolic Manifestation & Consciousness Programming  
**Last Updated:** 2026  

This document contains the complete mathematical and symbolic formulas used in the Sigil Forge engine for converting intentions into geometric sigils through traditional letter elimination, sacred geometry, and modern algorithmic approaches.

---

## Table of Contents

1. [Letter Reduction Methods](#letter-reduction-methods)
2. [Numerical Conversion Formulas](#numerical-conversion-formulas)
3. [Geometric Generation Algorithms](#geometric-generation-algorithms)
4. [Glyph Connection Methods](#glyph-connection-methods)
5. [Sacred Geometry Integration](#sacred-geometry-integration)
6. [Intention Encoding Formulas](#intention-encoding-formulas)
7. [Charging & Activation Methods](#charging-activation-methods)
8. [Symbol Combination Rules](#symbol-combination-rules)
9. [Planetary Correspondence Tables](#planetary-correspondence-tables)
10. [Elemental Attribution System](#elemental-attribution-system)

---

## 1. Letter Reduction Methods

### 1.1 Traditional Letter Elimination

The foundational method for sigil creation, originating from Austin Osman Spare's chaos magic tradition.

#### Algorithm

```python
def eliminate_duplicate_letters(intention: str) -> str:
    """
    Traditional sigil method: eliminate duplicate letters.
    
    Process:
    1. Convert to uppercase
    2. Remove spaces, punctuation, and non-alphabetic characters
    3. Remove duplicate letters, keeping first occurrence
    4. Return unique letter sequence
    """
    # Convert to uppercase and remove spaces/punctuation
    cleaned = ''.join(c.upper() for c in intention if c.isalpha())
    
    # Remove duplicate letters, keeping first occurrence
    seen = set()
    result = []
    for char in cleaned:
        if char not in seen:
            seen.add(char)
            result.append(char)
    
    return ''.join(result)
```

#### Mathematical Formula

Given intention string `I = {c₁, c₂, c₃, ..., cₙ}` where cᵢ ∈ Alphabet:

```
UNIQUE(I) = {cᵢ | cᵢ ∈ I ∧ ∀j < i: cⱼ ≠ cᵢ}
```

#### Example

```
Intention: "I WILL FIND MY TRUE LOVE"
Cleaned:   "IWILLFINDMYTRUELOVE"
Unique:    "IWLFNDMYTRUEO"
```

#### Order Preservation

The algorithm preserves first occurrence order, which is significant in manifestation work:
- First letters carry primary intention energy
- Later letters add supporting frequencies
- Order affects geometric layout in final sigil

### 1.2 Rose Cross Letter Reduction

Based on the Rose Cross lamen from Golden Dawn tradition, mapping letters to specific points on a geometric rose.

#### Rose Cross Mapping

```python
ROSE_CROSS_POSITIONS = {
    # Petals (Primary positions)
    'A': (0.5, 0.95),  'H': (0.95, 0.5),
    'O': (0.5, 0.05),  'V': (0.05, 0.5),
    
    # Inner ring (Secondary positions)
    'B': (0.65, 0.85), 'I': (0.85, 0.65),
    'P': (0.65, 0.15), 'W': (0.15, 0.35),
    
    'C': (0.75, 0.75), 'J': (0.75, 0.75),
    'Q': (0.75, 0.25), 'X': (0.25, 0.25),
    
    # Outer ring (Tertiary positions)
    'D': (0.80, 0.70), 'K': (0.90, 0.60),
    'R': (0.80, 0.20), 'Y': (0.20, 0.30),
    
    'E': (0.85, 0.60), 'L': (0.95, 0.50),
    'S': (0.85, 0.15), 'Z': (0.15, 0.25),
    
    'F': (0.75, 0.50), 'M': (0.90, 0.40),
    'T': (0.75, 0.10), 
    
    'G': (0.70, 0.45), 'N': (0.85, 0.35),
    'U': (0.70, 0.10)
}

def rose_cross_reduction(letters: str) -> List[Tuple[float, float]]:
    """Map unique letters to Rose Cross positions."""
    return [ROSE_CROSS_POSITIONS[letter] for letter in letters if letter in ROSE_CROSS_POSITIONS]
```

#### Formula

```
RC(L) = {(xᵢ, yᵢ) | L[i] → ROSE_CROSS_POSITIONS[L[i]]}
```

### 1.3 Numerical Letter Reduction

Converts letters to numbers using various systems for mathematical sigil generation.

#### Standard Alphabetical Position

```python
def letters_to_numbers(letters: str) -> List[int]:
    """
    Convert letters to their alphabetical position numbers (A=1, B=2, ..., Z=26).
    """
    alphabet_positions = {chr(i): i - ord('A') + 1 for i in range(ord('A'), ord('Z') + 1)}
    return [alphabet_positions.get(letter, 0) for letter in letters.upper()]
```

#### Formula

```
N(L[i]) = ord(L[i]) - ord('A') + 1

where:
  L[i] = letter at position i
  ord() = Unicode code point function
  N(L[i]) ∈ [1, 26]
```

#### Example

```
Letters:  "IWLFND"
Numbers:  [9, 23, 12, 6, 14, 4]
```

#### Pythagorean Numerology Reduction

For deeper numerological integration:

```python
def pythagorean_reduction(number: int) -> int:
    """Reduce number to single digit (1-9) except master numbers 11, 22, 33."""
    if number in [11, 22, 33]:
        return number
    
    while number > 9:
        number = sum(int(digit) for digit in str(number))
    
    return number

def letters_to_pythagorean(letters: str) -> List[int]:
    """Convert letters to Pythagorean single-digit values."""
    numbers = letters_to_numbers(letters)
    return [pythagorean_reduction(n) for n in numbers]
```

#### Formula

```
P(n) = n                           if n ∈ {11, 22, 33}
P(n) = Σ(digits(n))               if n > 9
P(n) = n                           if 1 ≤ n ≤ 9

Recursive until single digit achieved.
```

#### Example

```
Letters:    "IWLFND"
Numbers:    [9, 23, 12, 6, 14, 4]
Pythagorean:[9, 5,  3,  6, 5,  4]
            (23 → 2+3=5, 12 → 1+2=3, 14 → 1+4=5)
```

### 1.4 Gematria-Based Reduction

Using Hebrew Gematria values for Western alphabet:

```python
GEMATRIA_VALUES = {
    'A': 1,  'B': 2,  'C': 3,  'D': 4,  'E': 5,
    'F': 6,  'G': 7,  'H': 8,  'I': 9,  'J': 10,
    'K': 20, 'L': 30, 'M': 40, 'N': 50, 'O': 60,
    'P': 70, 'Q': 80, 'R': 90, 'S': 100,'T': 200,
    'U': 300,'V': 400,'W': 500,'X': 600,'Y': 700,
    'Z': 800
}

def gematria_reduction(letters: str) -> int:
    """Calculate total Gematria value of word."""
    return sum(GEMATRIA_VALUES.get(letter, 0) for letter in letters.upper())
```

---

## 2. Numerical Conversion Formulas

### 2.1 Letter-to-Number Mapping

Complete alphabetical position system:

```
A=1   B=2   C=3   D=4   E=5   F=6   G=7   H=8   I=9
J=10  K=11  L=12  M=13  N=14  O=15  P=16  Q=17  R=18
S=19  T=20  U=21  V=22  W=23  X=24  Y=25  Z=26
```

### 2.2 Number-to-Angle Conversion

For radial sigil placement:

```python
def number_to_angle(number: int, max_number: int = 26) -> float:
    """
    Convert number to angle in radians.
    
    Formula: θ = (n / max) × 2π
    """
    return (number / max_number) * 2 * math.pi
```

#### Formula

```
θ(n) = (n / N_max) × 2π

where:
  θ(n) = angle in radians for number n
  N_max = maximum number in system (26 for alphabet)
  2π = full circle (360°)
```

### 2.3 Golden Ratio Spiral Conversion

Using φ (phi) = 1.618... for natural spiraling:

```python
GOLDEN_RATIO = (1 + math.sqrt(5)) / 2  # φ ≈ 1.618033988749

def golden_spiral_position(index: int, letter_value: int) -> Tuple[float, float]:
    """
    Calculate position on golden ratio spiral.
    
    Formula:
      θ = index × φ × 2π
      r = r₀ + (index × increment)
      x = center_x + r × cos(θ)
      y = center_y + r × sin(θ)
    """
    angle = index * GOLDEN_RATIO * 2 * math.pi
    radius = 0.1 + (index * 0.05)
    
    x = 0.5 + radius * math.cos(angle)
    y = 0.5 + radius * math.sin(angle)
    
    return (x, y)
```

#### Formula

```
θ(i) = i × φ × 2π
r(i) = r₀ + (i × Δr)
x(i) = x_c + r(i) × cos(θ(i))
y(i) = y_c + r(i) × sin(θ(i))

where:
  i = index position
  φ = golden ratio (1.618...)
  r₀ = initial radius
  Δr = radius increment per step
  (x_c, y_c) = center point (usually 0.5, 0.5)
```

### 2.4 Fibonacci Sequence Integration

```python
def fibonacci(n: int) -> int:
    """Generate nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def fibonacci_spiral_position(index: int) -> Tuple[float, float]:
    """Position based on Fibonacci spiral."""
    fib = fibonacci(index + 1)
    angle = (fib % 360) * (math.pi / 180)
    radius = 0.1 + (index * 0.03)
    
    x = 0.5 + radius * math.cos(angle)
    y = 0.5 + radius * math.sin(angle)
    
    return (x, y)
```

---

## 3. Geometric Generation Algorithms

### 3.1 Radial Placement Algorithm

Places points around a circle based on letter numbers:

```python
def numbers_to_geometry_radial(numbers: List[int]) -> List[Tuple[float, float]]:
    """
    Convert numbers to geometric coordinates using radial placement.
    
    Each number determines angular position around a circle.
    Radius increases with index for spiral effect.
    """
    points = []
    
    for i, num in enumerate(numbers):
        # Calculate angle based on letter position in alphabet
        angle = (num * 360 / 26) * (math.pi / 180)
        
        # Increasing radius for each subsequent point
        radius = 0.3 + (i * 0.1)
        
        # Convert polar to Cartesian coordinates
        x = 0.5 + radius * math.cos(angle)
        y = 0.5 + radius * math.sin(angle)
        
        points.append((x, y))
    
    return points
```

#### Formula

```
For each letter number nᵢ at index i:

θᵢ = (nᵢ / 26) × 360° × (π/180)     [angle in radians]
rᵢ = r₀ + (i × Δr)                   [expanding radius]
xᵢ = 0.5 + rᵢ × cos(θᵢ)              [x coordinate]
yᵢ = 0.5 + rᵢ × sin(θᵢ)              [y coordinate]

where:
  r₀ = 0.3 (base radius)
  Δr = 0.1 (radius increment)
  0.5 = center offset (normalized coordinates)
```

### 3.2 Spiral Placement Algorithm

Creates organic spiral patterns using golden ratio:

```python
def numbers_to_geometry_spiral(numbers: List[int]) -> List[Tuple[float, float]]:
    """
    Arrange points in a golden ratio spiral pattern.
    Creates natural, organic-looking sigils.
    """
    points = []
    golden_ratio = (1 + math.sqrt(5)) / 2
    
    for i, num in enumerate(numbers):
        # Golden angle for natural spiral
        angle = i * golden_ratio * 2 * math.pi
        
        # Gradually expanding radius
        radius = 0.1 + (i * 0.05)
        
        x = 0.5 + radius * math.cos(angle)
        y = 0.5 + radius * math.sin(angle)
        
        points.append((x, y))
    
    return points
```

#### Formula

```
θᵢ = i × φ × 2π                      [golden angle]
rᵢ = r₀ + (i × Δr)                   [expanding radius]
xᵢ = 0.5 + rᵢ × cos(θᵢ)
yᵢ = 0.5 + rᵢ × sin(θᵢ)

where:
  φ = (1 + √5) / 2 ≈ 1.618 (golden ratio)
  r₀ = 0.1 (initial radius)
  Δr = 0.05 (radius increment)
```

### 3.3 Grid Placement Algorithm

Arranges points in a regular grid pattern:

```python
def numbers_to_geometry_grid(numbers: List[int]) -> List[Tuple[float, float]]:
    """
    Arrange points in a grid pattern.
    Creates structured, geometric sigils.
    """
    points = []
    grid_size = math.ceil(math.sqrt(len(numbers)))
    
    for i, num in enumerate(numbers):
        row = i // grid_size
        col = i % grid_size
        
        # Center points in grid cells
        x = (col + 0.5) / grid_size
        y = (row + 0.5) / grid_size
        
        points.append((x, y))
    
    return points
```

#### Formula

```
grid_size = ⌈√n⌉                     [ceiling of square root]
row(i) = ⌊i / grid_size⌋             [integer division]
col(i) = i mod grid_size             [modulo operation]

xᵢ = (col(i) + 0.5) / grid_size      [normalized x]
yᵢ = (row(i) + 0.5) / grid_size      [normalized y]
```

### 3.4 Sacred Angles System

Using traditional sacred angles for power points:

```python
SACRED_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]

def snap_to_sacred_angle(angle_degrees: float) -> float:
    """Snap angle to nearest sacred angle."""
    return min(SACRED_ANGLES, key=lambda x: abs(x - angle_degrees))

def numbers_to_sacred_angles(numbers: List[int]) -> List[float]:
    """Convert numbers to sacred angle positions."""
    raw_angles = [(num * 360 / 26) for num in numbers]
    return [snap_to_sacred_angle(angle) for angle in raw_angles]
```

---

## 4. Glyph Connection Methods

### 4.1 Sequential Connection

Connects points in the order they were generated:

```python
def connect_points_sequential(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect points in sequence to form continuous line.
    Most common traditional method.
    """
    elements = []
    
    for i in range(len(points) - 1):
        element = SigilElement(
            element_type="line",
            start_point=points[i],
            end_point=points[i + 1],
            control_points=[],
            properties={"weight": 2, "style": "solid"}
        )
        elements.append(element)
    
    return elements
```

#### Properties

- **Simplicity:** Easy to visualize and meditate upon
- **Energy Flow:** Linear, directional energy movement
- **Best For:** Clear, direct intentions

### 4.2 Star Connection (Radial)

Connects all points to center:

```python
def connect_points_star(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect each point to the center.
    Creates radial, explosive energy pattern.
    """
    elements = []
    center = (0.5, 0.5)
    
    for point in points:
        element = SigilElement(
            element_type="line",
            start_point=center,
            end_point=point,
            control_points=[],
            properties={"weight": 1.5, "style": "solid"}
        )
        elements.append(element)
    
    return elements
```

#### Properties

- **Energy Pattern:** Radiating from center
- **Symbolism:** Central power source emanating outward
- **Best For:** Broadcasting intentions, sending energy out

### 4.3 Web Connection (Complete Graph)

Connects every point to every other point:

```python
def connect_points_web(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect each point to every other point.
    Creates complex interconnected pattern.
    """
    elements = []
    
    for i, point1 in enumerate(points):
        for j, point2 in enumerate(points[i + 1:], i + 1):
            element = SigilElement(
                element_type="line",
                start_point=point1,
                end_point=point2,
                control_points=[],
                properties={"weight": 0.5, "style": "solid", "opacity": 0.3}
            )
            elements.append(element)
    
    return elements
```

#### Formula

```
For n points, number of connections = C(n,2) = n(n-1)/2

Example: 5 points → 5×4/2 = 10 connections
```

#### Properties

- **Complexity:** Highest visual complexity
- **Energy Pattern:** Interconnected, networked
- **Best For:** Complex multi-faceted intentions

### 4.4 Organic Connection

Uses curves instead of straight lines:

```python
def connect_points_organic(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect points with smooth curves for organic feel.
    """
    elements = []
    
    for i in range(len(points) - 1):
        start = points[i]
        end = points[i + 1]
        
        # Calculate control point for quadratic Bézier curve
        mid_x = (start[0] + end[0]) / 2
        mid_y = (start[1] + end[1]) / 2
        
        # Perpendicular offset for curve
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        length = math.sqrt(dx*dx + dy*dy)
        
        if length > 0:
            offset = 0.1
            perp_x = -dy / length * offset
            perp_y = dx / length * offset
            control_point = (mid_x + perp_x, mid_y + perp_y)
        else:
            control_point = (mid_x, mid_y)
        
        element = SigilElement(
            element_type="curve",
            start_point=start,
            end_point=end,
            control_points=[control_point],
            properties={"weight": 2, "style": "solid"}
        )
        elements.append(element)
    
    return elements
```

#### Bézier Curve Formula

```
Quadratic Bézier: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂

where:
  P₀ = start point
  P₁ = control point
  P₂ = end point
  t ∈ [0, 1]
```

---

## 5. Sacred Geometry Integration

### 5.1 Triangle Base

```python
def create_triangle_base() -> List[Tuple[float, float]]:
    """
    Create equilateral triangle pointing upward.
    Symbolizes: Fire, masculine energy, ascension
    """
    triangle_points = [
        (0.5, 0.1),   # Top vertex
        (0.1, 0.9),   # Bottom left
        (0.9, 0.9)    # Bottom right
    ]
    return triangle_points
```

#### Properties

- **Element:** Fire
- **Energy:** Active, transformative, ascending
- **Angles:** 60° each (equilateral)
- **Best For:** Dynamic, action-oriented intentions

### 5.2 Square Base

```python
def create_square_base() -> List[Tuple[float, float]]:
    """
    Create square foundation.
    Symbolizes: Earth, stability, manifestation
    """
    square_points = [
        (0.2, 0.2),   # Bottom left
        (0.8, 0.2),   # Bottom right
        (0.8, 0.8),   # Top right
        (0.2, 0.8)    # Top left
    ]
    return square_points
```

#### Properties

- **Element:** Earth
- **Energy:** Stable, grounding, manifesting
- **Angles:** 90° each (right angles)
- **Best For:** Material manifestation, grounding

### 5.3 Pentagon Base

```python
def create_pentagon_base() -> List[Tuple[float, float]]:
    """
    Create regular pentagon.
    Symbolizes: Human (5 points), divine proportion
    """
    pentagon_points = []
    center = (0.5, 0.5)
    radius = 0.4
    
    for i in range(5):
        angle = (i * 72 - 90) * (math.pi / 180)  # Start at top
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        pentagon_points.append((x, y))
    
    return pentagon_points
```

#### Formula

```
For n-sided regular polygon:
  θᵢ = (i × 360/n) × π/180
  xᵢ = x_c + r × cos(θᵢ)
  yᵢ = y_c + r × sin(θᵢ)

Pentagon: n = 5, internal angle = 108°
```

#### Properties

- **Sacred Ratio:** Contains golden ratio φ
- **Symbolism:** Human form, five elements
- **Best For:** Human-centered intentions, healing

### 5.4 Hexagon Base

```python
def create_hexagon_base() -> List[Tuple[float, float]]:
    """
    Create regular hexagon.
    Symbolizes: Balance, harmony, crystalline structure
    """
    hexagon_points = []
    center = (0.5, 0.5)
    radius = 0.4
    
    for i in range(6):
        angle = (i * 60) * (math.pi / 180)
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        hexagon_points.append((x, y))
    
    return hexagon_points
```

#### Properties

- **Geometry:** Most efficient space-filling shape (honeycomb)
- **Angles:** 120° each
- **Symbolism:** Perfect balance, natural structure
- **Best For:** Harmony, balance, natural manifestation

### 5.5 Circle Base

```python
def create_circle_base(segments: int = 12) -> List[Tuple[float, float]]:
    """
    Create circular pattern.
    Symbolizes: Unity, wholeness, infinity
    """
    circle_points = []
    center = (0.5, 0.5)
    radius = 0.4
    
    for i in range(segments):
        angle = (i * 360 / segments) * (math.pi / 180)
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        circle_points.append((x, y))
    
    return circle_points
```

#### Properties

- **Symbolism:** Infinity, wholeness, divine perfection
- **Segments:** Typically 12 (zodiac), 8 (directions), or 360 (degrees)
- **Best For:** Holistic intentions, spiritual work

---

## 6. Intention Encoding Formulas

### 6.1 Intention Hash Generation

Creates unique identifier for each intention:

```python
def generate_intention_hash(intention: str) -> str:
    """
    Generate unique hash for intention.
    Ensures consistency and adds layer of symbolic encoding.
    """
    hash_object = hashlib.md5(intention.encode())
    return hash_object.hexdigest()[:8]
```

### 6.2 Deterministic Randomness

Uses intention hash for consistent "random" variations:

```python
def seed_from_intention(intention: str) -> int:
    """Seed random generator from intention for consistency."""
    intention_hash = hashlib.md5(intention.encode()).hexdigest()
    return int(intention_hash[:8], 16)

def deterministic_variation(intention: str, index: int) -> float:
    """
    Generate deterministic variation based on intention.
    Same intention always produces same variations.
    """
    random.seed(seed_from_intention(intention) + index)
    return random.random()
```

### 6.3 Linguistic Analysis

Analyzes intention for symbolic elements:

```python
def analyze_intention_keywords(intention: str) -> Dict[str, List[str]]:
    """
    Extract symbolic keywords from intention.
    Maps to planetary, elemental, and archetypal themes.
    """
    intention_lower = intention.lower()
    
    keywords = {
        'action_words': [],
        'desire_words': [],
        'temporal_words': [],
        'emotional_words': []
    }
    
    # Action verbs
    action_verbs = ['find', 'create', 'manifest', 'achieve', 'become', 'attract', 'release']
    keywords['action_words'] = [word for word in action_verbs if word in intention_lower]
    
    # Desire words
    desire_words = ['love', 'abundance', 'peace', 'success', 'health', 'wisdom']
    keywords['desire_words'] = [word for word in desire_words if word in intention_lower]
    
    return keywords
```

---

## 7. Charging & Activation Methods

### 7.1 Visualization Charging

```python
VISUALIZATION_METHOD = {
    'name': 'Visualization Charging',
    'description': 'Charge through focused visualization and intent',
    'duration': '10-20 minutes daily until goal achieved',
    'instructions': """
        1. Hold sigil before you
        2. Enter meditative state (4-7-8 breathing)
        3. Visualize intention as already manifested
        4. See energy flowing from heart into sigil
        5. Feel sigil "locking in" the intention
        6. Release attachment to outcome
    """,
    'power_level': 0.7,
    'difficulty': 'beginner'
}
```

### 7.2 Elemental Charging

```python
ELEMENTAL_METHOD = {
    'name': 'Elemental Charging',
    'description': 'Charge using elemental energies',
    'duration': 'One full day/night cycle with chosen element',
    'instructions': {
        'fire': 'Pass sigil through candle flame 3x, or leave near fire',
        'water': 'Submerge in water (if waterproof) or expose to rain',
        'air': 'Burn incense around sigil, or place in wind',
        'earth': 'Bury in soil for 24 hours, or cover with salt'
    },
    'power_level': 0.8,
    'difficulty': 'intermediate'
}
```

### 7.3 Planetary Charging

Uses planetary hours for enhanced charging:

```python
PLANETARY_HOURS = {
    'sun': {
        'day': 'Sunday',
        'hours': [0, 7, 14, 21],  # Simplified hours
        'best_for': ['success', 'leadership', 'vitality']
    },
    'moon': {
        'day': 'Monday',
        'hours': [1, 8, 15, 22],
        'best_for': ['intuition', 'dreams', 'emotions']
    },
    'mars': {
        'day': 'Tuesday',
        'hours': [2, 9, 16, 23],
        'best_for': ['courage', 'action', 'protection']
    },
    'mercury': {
        'day': 'Wednesday',
        'hours': [3, 10, 17, 24],
        'best_for': ['communication', 'learning', 'travel']
    },
    'jupiter': {
        'day': 'Thursday',
        'hours': [4, 11, 18],
        'best_for': ['abundance', 'expansion', 'wisdom']
    },
    'venus': {
        'day': 'Friday',
        'hours': [5, 12, 19],
        'best_for': ['love', 'beauty', 'harmony']
    },
    'saturn': {
        'day': 'Saturday',
        'hours': [6, 13, 20],
        'best_for': ['discipline', 'boundaries', 'banishing']
    }
}
```

### 7.4 Sexual Energy Charging

Traditional chaos magic method (Austin Osman Spare):

```
METHOD: Gnosis through sexual arousal
PROCESS:
1. Enter state of intense arousal
2. Hold sigil in mind at moment of climax
3. Immediately forget intention
4. Destroy or hide sigil

POWER_LEVEL: 1.0 (highest)
DIFFICULTY: Advanced
WARNING: Requires strong will and practice
```

---

## 8. Symbol Combination Rules

### 8.1 Overlay Combination

```python
def combine_overlay(comp1: SigilComposition, comp2: SigilComposition, opacity2: float = 0.5) -> SigilComposition:
    """
    Overlay one sigil on top of another.
    Second sigil becomes semi-transparent.
    """
    elements = comp1.elements.copy()
    
    for element in comp2.elements:
        modified_element = element.copy()
        modified_element.properties['opacity'] = opacity2
        elements.append(modified_element)
    
    return SigilComposition(
        elements=elements,
        center_point=comp1.center_point,
        bounding_box=comp1.bounding_box,
        symmetry_type="hybrid",
        intention_hash=comp1.intention_hash
    )
```

### 8.2 Scaled Nested Combination

```python
def combine_nested(comp1: SigilComposition, comp2: SigilComposition, scale: float = 0.6) -> SigilComposition:
    """
    Nest second sigil inside first at reduced scale.
    """
    scaled_elements = []
    
    offset_x = (1 - scale) / 2
    offset_y = (1 - scale) / 2
    
    for element in comp2.elements:
        start_x = element.start_point[0] * scale + offset_x
        start_y = element.start_point[1] * scale + offset_y
        end_x = element.end_point[0] * scale + offset_x
        end_y = element.end_point[1] * scale + offset_y
        
        scaled_element = SigilElement(
            element_type=element.element_type,
            start_point=(start_x, start_y),
            end_point=(end_x, end_y),
            control_points=[(cp[0] * scale + offset_x, cp[1] * scale + offset_y) 
                          for cp in element.control_points],
            properties={**element.properties, "opacity": 0.7}
        )
        scaled_elements.append(scaled_element)
    
    combined = comp1.elements + scaled_elements
    
    return SigilComposition(
        elements=combined,
        center_point=comp1.center_point,
        bounding_box=comp1.bounding_box,
        symmetry_type="nested",
        intention_hash=comp1.intention_hash
    )
```

### 8.3 Rotation Combination

```python
def combine_rotated(comp1: SigilComposition, comp2: SigilComposition, rotation: float) -> SigilComposition:
    """
    Rotate second sigil and overlay on first.
    rotation in degrees.
    """
    angle_rad = rotation * (math.pi / 180)
    center = (0.5, 0.5)
    
    rotated_elements = []
    
    for element in comp2.elements:
        # Rotate start point
        start_x = element.start_point[0] - center[0]
        start_y = element.start_point[1] - center[1]
        new_start_x = start_x * math.cos(angle_rad) - start_y * math.sin(angle_rad) + center[0]
        new_start_y = start_x * math.sin(angle_rad) + start_y * math.cos(angle_rad) + center[1]
        
        # Rotate end point
        end_x = element.end_point[0] - center[0]
        end_y = element.end_point[1] - center[1]
        new_end_x = end_x * math.cos(angle_rad) - end_y * math.sin(angle_rad) + center[0]
        new_end_y = end_x * math.sin(angle_rad) + end_y * math.cos(angle_rad) + center[1]
        
        rotated_element = SigilElement(
            element_type=element.element_type,
            start_point=(new_start_x, new_start_y),
            end_point=(new_end_x, new_end_y),
            control_points=[],  # Simplified
            properties=element.properties
        )
        rotated_elements.append(rotated_element)
    
    combined = comp1.elements + rotated_elements
    
    return SigilComposition(
        elements=combined,
        center_point=center,
        bounding_box=comp1.bounding_box,
        symmetry_type="rotational",
        intention_hash=comp1.intention_hash
    )
```

#### Rotation Formula

```
Rotation of point (x, y) around center (cx, cy) by angle θ:

x' = (x - cx) × cos(θ) - (y - cy) × sin(θ) + cx
y' = (x - cx) × sin(θ) + (y - cy) × cos(θ) + cy
```

---

## 9. Planetary Correspondence Tables

### 9.1 Complete Planetary Mapping

```python
PLANETARY_CORRESPONDENCES = {
    'sun': {
        'energy': 'vitality, leadership, success, authority',
        'symbols': ['circle', 'dot', 'radial'],
        'colors': ['gold', 'yellow', 'orange'],
        'number': 6,
        'day': 'Sunday',
        'hours': [0, 7, 14, 21],
        'metal': 'gold',
        'best_for': 'confidence, authority, achievement, recognition',
        'keywords': ['success', 'leadership', 'confidence', 'achievement', 'power', 'vitality'],
        'tarot': 'The Sun',
        'chakra': 'Solar Plexus',
        'element': 'fire'
    },
    
    'moon': {
        'energy': 'intuition, emotions, cycles, receptivity',
        'symbols': ['crescent', 'circle', 'curved'],
        'colors': ['silver', 'white', 'pale blue'],
        'number': 9,
        'day': 'Monday',
        'hours': [1, 8, 15, 22],
        'metal': 'silver',
        'best_for': 'psychic work, emotional healing, cycles, dreams',
        'keywords': ['intuition', 'emotion', 'dream', 'psychic', 'cycle', 'feminine'],
        'tarot': 'The Moon',
        'chakra': 'Third Eye',
        'element': 'water'
    },
    
    'mercury': {
        'energy': 'communication, intellect, travel, commerce',
        'symbols': ['lines', 'connections', 'networks'],
        'colors': ['orange', 'light blue', 'mixed'],
        'number': 8,
        'day': 'Wednesday',
        'hours': [3, 10, 17, 24],
        'metal': 'mercury/quicksilver',
        'best_for': 'learning, communication, quick results, travel',
        'keywords': ['communication', 'learning', 'travel', 'quick', 'message', 'intellect'],
        'tarot': 'The Magician',
        'chakra': 'Throat',
        'element': 'air'
    },
    
    'venus': {
        'energy': 'love, beauty, harmony, pleasure',
        'symbols': ['curves', 'hearts', 'spirals'],
        'colors': ['green', 'pink', 'copper'],
        'number': 7,
        'day': 'Friday',
        'hours': [5, 12, 19],
        'metal': 'copper',
        'best_for': 'relationships, artistic work, attraction, pleasure',
        'keywords': ['love', 'beauty', 'relationship', 'harmony', 'art', 'attraction'],
        'tarot': 'The Empress',
        'chakra': 'Heart',
        'element': 'earth'
    },
    
    'mars': {
        'energy': 'action, courage, conflict, passion',
        'symbols': ['arrows', 'angles', 'sharp'],
        'colors': ['red', 'scarlet', 'rust'],
        'number': 5,
        'day': 'Tuesday',
        'hours': [2, 9, 16, 23],
        'metal': 'iron',
        'best_for': 'courage, protection, overcoming obstacles, competition',
        'keywords': ['courage', 'action', 'strength', 'protection', 'overcome', 'energy'],
        'tarot': 'The Tower',
        'chakra': 'Root',
        'element': 'fire'
    },
    
    'jupiter': {
        'energy': 'expansion, wisdom, abundance, growth',
        'symbols': ['large_forms', 'crosses', 'expansion'],
        'colors': ['purple', 'royal blue', 'indigo'],
        'number': 4,
        'day': 'Thursday',
        'hours': [4, 11, 18],
        'metal': 'tin',
        'best_for': 'growth, learning, prosperity, expansion',
        'keywords': ['abundance', 'growth', 'wisdom', 'expansion', 'prosperity', 'luck'],
        'tarot': 'Wheel of Fortune',
        'chakra': 'Crown',
        'element': 'fire'
    },
    
    'saturn': {
        'energy': 'structure, discipline, limitation, time',
        'symbols': ['squares', 'boundaries', 'restriction'],
        'colors': ['black', 'dark blue', 'indigo'],
        'number': 3,
        'day': 'Saturday',
        'hours': [6, 13, 20],
        'metal': 'lead',
        'best_for': 'discipline, long-term goals, banishing, boundaries',
        'keywords': ['discipline', 'structure', 'patience', 'limitation', 'boundary', 'time'],
        'tarot': 'The World',
        'chakra': 'Base',
        'element': 'earth'
    }
}
```

### 9.2 Planetary Hour Calculation

```python
def calculate_planetary_hour(datetime_obj: datetime, latitude: float, longitude: float) -> str:
    """
    Calculate current planetary hour.
    Simplified version - full implementation would use sunrise/sunset calculations.
    """
    day_of_week = datetime_obj.weekday()  # 0=Monday, 6=Sunday
    hour_of_day = datetime_obj.hour
    
    # Simplified planetary ruler by day
    day_rulers = ['moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'sun']
    day_ruler = day_rulers[day_of_week]
    
    # Simplified hour calculation (12-hour division)
    planetary_sequence = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon']
    
    # Find index of day ruler
    start_index = planetary_sequence.index(day_ruler)
    
    # Calculate current hour ruler
    hour_index = (start_index + hour_of_day) % 7
    current_hour_ruler = planetary_sequence[hour_index]
    
    return current_hour_ruler
```

---

## 10. Elemental Attribution System

### 10.1 Complete Elemental Correspondences

```python
ELEMENTAL_SYSTEM = {
    'fire': {
        'shapes': ['triangle', 'angular', 'pointed', 'upward'],
        'energy': 'active, transformative, passionate, willful',
        'colors': ['red', 'orange', 'yellow', 'gold'],
        'direction': 'upward, expanding, radiating',
        'qualities': ['hot', 'dry'],
        'zodiac': ['Aries', 'Leo', 'Sagittarius'],
        'tarot_suit': 'wands',
        'planetary_rulers': ['sun', 'mars', 'jupiter'],
        'best_for': [
            'Transformation',
            'Courage',
            'Passion',
            'Willpower',
            'Destruction of old patterns',
            'Quick manifestation'
        ],
        'charging_method': 'Pass through flame, leave in sunlight',
        'activation_symbol': '△',
        'geomet ric_multiplier': 1.0
    },
    
    'water': {
        'shapes': ['circle', 'curved', 'flowing', 'downward'],
        'energy': 'receptive, emotional, intuitive, cleansing',
        'colors': ['blue', 'silver', 'white', 'sea green'],
        'direction': 'downward, contracting, flowing',
        'qualities': ['cold', 'wet'],
        'zodiac': ['Cancer', 'Scorpio', 'Pisces'],
        'tarot_suit': 'cups',
        'planetary_rulers': ['moon', 'venus'],
        'best_for': [
            'Emotional healing',
            'Intuition',
            'Dreams',
            'Cleansing',
            'Psychic work',
            'Relationships'
        ],
        'charging_method': 'Submerge in water, expose to rain/dew',
        'activation_symbol': '▽',
        'geometric_multiplier': 0.9
    },
    
    'air': {
        'shapes': ['line', 'spiral', 'scattered', 'horizontal'],
        'energy': 'mental, communicative, swift, intellectual',
        'colors': ['yellow', 'white', 'light blue', 'lavender'],
        'direction': 'horizontal, dispersing, circulating',
        'qualities': ['hot', 'wet'],
        'zodiac': ['Gemini', 'Libra', 'Aquarius'],
        'tarot_suit': 'swords',
        'planetary_rulers': ['mercury', 'saturn'],
        'best_for': [
            'Communication',
            'Learning',
            'Travel',
            'Clarity',
            'Ideas',
            'Social connections'
        ],
        'charging_method': 'Burn incense around it, expose to wind',
        'activation_symbol': '△̄',  # Triangle with line through it
        'geometric_multiplier': 1.1
    },
    
    'earth': {
        'shapes': ['square', 'stable', 'grounded', 'flat'],
        'energy': 'stable, practical, nurturing, manifesting',
        'colors': ['green', 'brown', 'black', 'earth tones'],
        'direction': 'centered, solid, grounding',
        'qualities': ['cold', 'dry'],
        'zodiac': ['Taurus', 'Virgo', 'Capricorn'],
        'tarot_suit': 'pentacles',
        'planetary_rulers': ['venus', 'saturn'],
        'best_for': [
            'Material manifestation',
            'Grounding',
            'Prosperity',
            'Health',
            'Practical matters',
            'Long-term goals'
        ],
        'charging_method': 'Bury in earth, cover with salt',
        'activation_symbol': '▽̄',  # Inverted triangle with line
        'geometric_multiplier': 0.8
    },
    
    'spirit': {  # Fifth element - aether/quintessence
        'shapes': ['circle', 'dot', 'spiral', 'point'],
        'energy': 'transcendent, unifying, divine, source',
        'colors': ['white', 'purple', 'rainbow', 'ultraviolet'],
        'direction': 'inward, center, omnidirectional',
        'qualities': ['all', 'none'],
        'zodiac': ['all'],
        'tarot_suit': 'major arcana',
        'planetary_rulers': ['all'],
        'best_for': [
            'Spiritual work',
            'Unity consciousness',
            'Transcendence',
            'Divine connection',
            'Synthesis',
            'Enlightenment'
        ],
        'charging_method': 'Meditation, prayer, divine invocation',
        'activation_symbol': '⊕',  # Circle with dot
        'geometric_multiplier': 1.2
    }
}
```

### 10.2 Elemental Detection Algorithm

```python
def detect_primary_element(composition: SigilComposition, intention: str) -> str:
    """
    Analyze sigil and intention to determine primary elemental resonance.
    """
    scores = {'fire': 0, 'water': 0, 'air': 0, 'earth': 0, 'spirit': 0}
    
    # Analyze shapes
    for element in composition.elements:
        if element.element_type == "line":
            if is_vertical(element):
                scores['fire'] += 1
            elif is_horizontal(element):
                scores['air'] += 1
            else:
                scores['air'] += 0.5
                
        elif element.element_type == "curve":
            scores['water'] += 1
            
        elif element.element_type == "circle":
            scores['water'] += 0.5
            scores['spirit'] += 0.5
    
    # Analyze symmetry
    if composition.symmetry_type == "radial":
        scores['fire'] += 2
    elif composition.symmetry_type == "geometric":
        scores['earth'] += 2
    elif composition.symmetry_type == "spiral":
        scores['water'] += 2
        scores['spirit'] += 1
    
    # Analyze intention keywords
    intention_lower = intention.lower()
    
    fire_keywords = ['transform', 'change', 'power', 'energy', 'passion', 'will']
    water_keywords = ['feel', 'emotion', 'intuition', 'heal', 'flow', 'dream']
    air_keywords = ['think', 'communicate', 'learn', 'idea', 'message', 'travel']
    earth_keywords = ['manifest', 'create', 'build', 'ground', 'practical', 'stable']
    spirit_keywords = ['spiritual', 'divine', 'transcend', 'unity', 'consciousness']
    
    for keyword in fire_keywords:
        if keyword in intention_lower:
            scores['fire'] += 1
    for keyword in water_keywords:
        if keyword in intention_lower:
            scores['water'] += 1
    for keyword in air_keywords:
        if keyword in intention_lower:
            scores['air'] += 1
    for keyword in earth_keywords:
        if keyword in intention_lower:
            scores['earth'] += 1
    for keyword in spirit_keywords:
        if keyword in intention_lower:
            scores['spirit'] += 2
    
    # Return element with highest score
    return max(scores.items(), key=lambda x: x[1])[0]
```

### 10.3 Elemental Balance Calculation

```python
def calculate_elemental_balance(composition: SigilComposition) -> Dict[str, float]:
    """
    Calculate balance of all elements in sigil.
    Returns normalized percentages.
    """
    scores = {'fire': 0.0, 'water': 0.0, 'air': 0.0, 'earth': 0.0}
    
    for element in composition.elements:
        # Lines contribute to fire/air
        if element.element_type == "line":
            angle = calculate_angle(element.start_point, element.end_point)
            if 45 <= angle <= 135 or 225 <= angle <= 315:  # Vertical-ish
                scores['fire'] += 1
            else:  # Horizontal-ish
                scores['air'] += 1
        
        # Curves contribute to water
        elif element.element_type == "curve":
            scores['water'] += 1
        
        # Circles contribute to earth (solid) and spirit (unity)
        elif element.element_type == "circle":
            if element.properties.get('fill', False):
                scores['earth'] += 1
            else:
                scores['water'] += 0.5
    
    # Normalize to percentages
    total = sum(scores.values())
    if total > 0:
        scores = {k: (v / total) * 100 for k, v in scores.items()}
    
    return scores
```

---

## Appendix A: Complete Letter Shape Definitions

```python
LETTER_GEOMETRIC_SHAPES = {
    'A': {
        'points': [(0, 0), (0.5, 1), (1, 0), (0.25, 0.5), (0.75, 0.5)],
        'type': 'triangle_with_bar',
        'energy': 'upward, achieving',
        'primary_line': 'ascension'
    },
    'B': {
        'points': [(0, 0), (0, 1), (0.7, 1), (0.7, 0.5), (0, 0.5), (0.8, 0.5), (0.8, 0), (0, 0)],
        'type': 'double_curve',
        'energy': 'contained, dual',
        'primary_line': 'duality'
    },
    # ... (continuing for all 26 letters)
    'Z': {
        'points': [(0, 1), (1, 1), (0, 0), (1, 0)],
        'type': 'diagonal',
        'energy': 'striking, completion',
        'primary_line': 'finality'
    }
}
```

---

## Appendix B: Aesthetic Optimization Formulas

### Bézier Curve Smoothing

```python
def optimize_curve_smoothness(element: SigilElement, smoothness: float = 0.5) -> SigilElement:
    """
    Apply smoothing to curves for aesthetic appeal.
    
    smoothness ∈ [0, 1]: 0 = sharp, 1 = maximum smooth
    """
    if element.element_type != "curve":
        return element
    
    if not element.control_points:
        return element
    
    # Adjust control point distance from line
    start = element.start_point
    end = element.end_point
    control = element.control_points[0]
    
    # Calculate perpendicular distance
    line_mid_x = (start[0] + end[0]) / 2
    line_mid_y = (start[1] + end[1]) / 2
    
    # Interpolate control point toward/away from line midpoint
    new_control_x = line_mid_x + (control[0] - line_mid_x) * smoothness
    new_control_y = line_mid_y + (control[1] - line_mid_y) * smoothness
    
    return SigilElement(
        element_type="curve",
        start_point=start,
        end_point=end,
        control_points=[(new_control_x, new_control_y)],
        properties=element.properties
    )
```

### Golden Ratio Aesthetic Scoring

```python
def calculate_aesthetic_score(composition: SigilComposition) -> float:
    """
    Calculate aesthetic appeal using golden ratio and balance principles.
    Returns score 0-1, where 1 is most aesthetically pleasing.
    """
    score = 0.0
    
    # Check golden ratio in bounding box
    bbox = composition.bounding_box
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    
    if height > 0:
        ratio = width / height
        golden_diff = abs(ratio - GOLDEN_RATIO)
        golden_score = max(0, 1 - golden_diff)
        score += golden_score * 0.3
    
    # Check element count (Fibonacci numbers are more aesthetic)
    element_count = len(composition.elements)
    fib_numbers = [1, 2, 3, 5, 8, 13, 21, 34]
    fib_score = 1.0 if element_count in fib_numbers else 0.5
    score += fib_score * 0.2
    
    # Check balance around center
    balance_score = calculate_radial_balance(composition)
    score += balance_score * 0.3
    
    # Check spacing (even distribution)
    spacing_score = calculate_spacing_evenness(composition)
    score += spacing_score * 0.2
    
    return score
```

---

## Appendix C: Advanced Combination Formulas

### Multi-Sigil Synthesis

```python
def synthesize_multiple_sigils(compositions: List[SigilComposition], method: str = "weighted_overlay") -> SigilComposition:
    """
    Combine multiple sigils into single master sigil.
    
    Methods:
    - weighted_overlay: Layer with decreasing opacity
    - geometric_average: Average all point positions
    - selective_merge: Keep strongest elements from each
    """
    if not compositions:
        raise ValueError("Need at least one composition")
    
    if len(compositions) == 1:
        return compositions[0]
    
    if method == "weighted_overlay":
        base = compositions[0]
        result_elements = base.elements.copy()
        
        for i, comp in enumerate(compositions[1:], start=1):
            opacity = 1.0 / (i + 1)  # Decreasing opacity
            for element in comp.elements:
                modified = element.copy()
                modified.properties['opacity'] = opacity
                result_elements.append(modified)
        
        return SigilComposition(
            elements=result_elements,
            center_point=base.center_point,
            bounding_box=base.bounding_box,
            symmetry_type="synthesized",
            intention_hash=hashlib.md5("".join(c.intention_hash for c in compositions).encode()).hexdigest()[:8]
        )
    
    # ... other methods
```

---

## Document End

**Total Formulas:** 45+  
**Total Algorithms:** 30+  
**Total Correspondences:** 100+  

This completes the mathematical and symbolic foundations for the Sigil Forge engine.
