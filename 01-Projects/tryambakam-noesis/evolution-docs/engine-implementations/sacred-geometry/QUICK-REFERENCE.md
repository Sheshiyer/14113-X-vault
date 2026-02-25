# Sacred Geometry Quick Reference

## Constants

```python
PHI = 1.618033988749          # Golden Ratio
PI = 3.141592653590           # Pi
TAU = 6.283185307180          # 2 × Pi
SQRT_2 = 1.414213562373       # √2
SQRT_3 = 1.732050807569       # √3
SQRT_5 = 2.236067977500       # √5
```

## Core Algorithms

### Flower of Life
```python
def flower_of_life_circles(center, radius, layers):
    circles = [Circle(center, radius)]
    for layer in range(1, layers + 1):
        circles_in_layer = 6 * layer
        layer_radius = radius * layer * SQRT_3
        for i in range(circles_in_layer):
            angle = (i / circles_in_layer) * TAU
            x = center.x + layer_radius * cos(angle)
            y = center.y + layer_radius * sin(angle)
            circles.append(Circle(Point(x, y), radius))
    return circles
```
**Key**: Hexagonal packing, layer_radius = radius × layer × √3

---

### Golden Spiral
```python
def golden_spiral_points(turns, points_per_turn):
    points = []
    for i in range(turns * points_per_turn):
        theta = (i / points_per_turn) * TAU
        r = exp(theta / (2 * tan(PI / (2 * PHI))))
        x = r * cos(theta)
        y = r * sin(theta)
        points.append(Point(x, y))
    return points
```
**Key**: r = e^(θ / (2 × tan(π / (2φ)))), grows by factor φ per rotation

---

### Mandala Pattern
```python
def mandala_pattern(center, radius, petals, layers):
    # Concentric circles
    for layer in range(1, layers + 1):
        circle_radius = radius * (layer / layers)
        circles.append(Circle(center, circle_radius))
    
    # Radial lines
    for i in range(petals):
        angle = (i / petals) * TAU
        end = Point(center.x + radius * cos(angle),
                    center.y + radius * sin(angle))
        lines.append((center, end))
    
    # Petal polygons
    for i in range(petals):
        angle1 = (i / petals) * TAU
        angle2 = ((i + 1) / petals) * TAU
        # Create triangular petal...
```
**Key**: Radial symmetry, petals = divisions, layers = depth

---

### Platonic Solid Vertices

#### Tetrahedron
```python
vertices = [(1,1,1), (1,-1,-1), (-1,1,-1), (-1,-1,1)]
```

#### Cube
```python
vertices = [(±1, ±1, ±1)]  # All 8 combinations
```

#### Octahedron
```python
vertices = [(±1,0,0), (0,±1,0), (0,0,±1)]
```

#### Dodecahedron
```python
vertices = [
    (±1, ±1, ±1),              # Cube
    (0, ±1/φ, ±φ),             # Golden rect YZ
    (±1/φ, ±φ, 0),             # Golden rect XZ
    (±φ, 0, ±1/φ)              # Golden rect XY
]
```

#### Icosahedron
```python
vertices = [
    (0, ±1, ±φ),
    (±1, ±φ, 0),
    (±φ, 0, ±1)
]
```

---

### Vesica Piscis
```python
def vesica_piscis(center1, center2, radius):
    distance = center1.distance_to(center2)
    a = distance / 2
    h = sqrt(radius**2 - a**2)
    
    mid_x = (center1.x + center2.x) / 2
    mid_y = (center1.y + center2.y) / 2
    
    offset_x = h * (center2.y - center1.y) / distance
    offset_y = h * (center1.x - center2.x) / distance
    
    intersection1 = Point(mid_x + offset_x, mid_y + offset_y)
    intersection2 = Point(mid_x - offset_x, mid_y - offset_y)
    
    return [intersection1, intersection2]
```
**Key**: Two circles, calculate intersection points using perpendicular offset

---

### Sri Yantra
```python
def sri_yantra_triangles(center, radius):
    triangles = []
    
    # 4 upward triangles (Shiva)
    for i in range(4):
        scale = 1 - (i * 0.2)
        r = radius * scale
        for j in range(3):
            angle = (j * TAU/3) - (PI/2)  # Start from top
            vertices.append(Point(center.x + r*cos(angle),
                                 center.y + r*sin(angle)))
    
    # 5 downward triangles (Shakti)
    for i in range(5):
        scale = 0.9 - (i * 0.15)
        r = radius * scale
        for j in range(3):
            angle = (j * TAU/3) + (PI/2)  # Start from bottom
            # ...
```
**Key**: 4 up + 5 down = 9 triangles, progressive scaling

---

### Meditation Points (Golden Ratio)
```python
def meditation_points(center, radius):
    golden_radius = radius / PHI  # 61.8% from center
    points = []
    for i in range(8):
        angle = i * PI / 4  # 45° increments
        x = center.x + golden_radius * cos(angle)
        y = center.y + golden_radius * sin(angle)
        points.append((x, y))
    return points
```
**Key**: 8 points at distance = radius/φ, 45° apart

---

### Personal Geometry
```python
def calculate_personal_geometry(birth_date):
    day = birth_date.day
    month = birth_date.month
    year = birth_date.year
    
    petal_count = (day % 12) + 4        # 4-15
    layer_count = (month % 5) + 2       # 2-6
    scale_factor = (year % 100)/100 + 0.5  # 0.5-1.5
    spiral_turns = (day % 6) + 2        # 2-7
    
    solids = ['tetrahedron', 'cube', 'octahedron',
              'dodecahedron', 'icosahedron']
    personal_solid = solids[year % 5]
    
    # Generate patterns with these parameters...
```
**Key**: Birth date → geometric parameters, creates unique signature

---

## Coordinate Transformations

### Polar to Cartesian
```python
x = center_x + radius * cos(angle)
y = center_y + radius * sin(angle)
```

### Radial Distribution
```python
# For n-fold symmetry
for i in range(n):
    angle = (i / n) * TAU
    # Calculate x, y...
```

### Layer Scaling
```python
# Linear
radius_i = outer_radius * (i / total_layers)

# Golden ratio
radius_i = outer_radius / (PHI ** (total_layers - i))
```

---

## Symmetry Groups

| Pattern | Type | Order | Notation |
|---------|------|-------|----------|
| Mandala (n petals) | Dihedral | 2n | Dn |
| Flower of Life | Hexagonal | 12 | D6 |
| Golden Spiral | Continuous | 1 | C1 |
| Platonic Solids | Polyhedral | Varies | Varies |

**Dn**: n rotations + n reflections = 2n symmetries

---

## Pattern Selection Guide

| Intention | Pattern | Why |
|-----------|---------|-----|
| Unity, connection | Flower of Life | Interconnected circles |
| Growth, evolution | Golden Spiral | Exponential expansion |
| Balance, integration | Mandala | Radial symmetry |
| Transformation | Sri Yantra | Union of opposites |
| Elemental work | Platonic Solids | Element correspondences |
| Duality/unity | Vesica Piscis | Two-circle overlap |

---

## Consciousness Integration

### Center Point
- **Function**: Witnessing awareness anchor
- **Training**: Return to center when distracted
- **Effect**: Strengthens self-awareness stability

### Radial Symmetry
- **Function**: Balanced awareness field
- **Training**: Hold center + periphery simultaneously
- **Effect**: Integrates inner/outer awareness

### Golden Ratio Points
- **Function**: Optimal meditation anchors
- **Training**: Cycle through 8 points maintaining center
- **Effect**: Enhances attention flexibility + stability

### Layers
- **Function**: Consciousness depth levels
- **Training**: Navigate from surface to center
- **Effect**: Develops introspective capacity

---

## Quick Formulas

```python
# Golden ratio
PHI = (1 + sqrt(5)) / 2 = 1.618...

# Golden rectangle
height = width / PHI

# Flower of Life layer radius
layer_radius = base_radius * layer * sqrt(3)

# Flower of Life total circles
total = 1 + 3 * layers * (layers + 1)

# Golden spiral growth per rotation
r(θ + 2π) = r(θ) * PHI

# Meditation point distance
golden_distance = radius / PHI = 0.618 * radius

# Vesica Piscis area
θ = 2 * arccos(distance / (2 * radius))
area = 2 * radius² * (θ - sin(θ)) / 2
```

---

## Color Schemes

```python
COLOR_SCHEMES = {
    "golden": {
        "primary": "#FFD700",    # Gold
        "secondary": "#FFA500",  # Orange
        "accent": "#FF8C00",     # Dark Orange
        "background": "#FFF8DC"  # Cornsilk
    },
    "chakra": {
        "primary": "#8B00FF",    # Crown
        "secondary": "#4B0082",  # Third Eye
        "accent": "#0000FF",     # Throat
        "background": "#F0F8FF"  # Alice Blue
    },
    "monochrome": {
        "primary": "#000000",    # Black
        "secondary": "#666666",  # Gray
        "accent": "#333333",     # Dark Gray
        "background": "#FFFFFF"  # White
    }
}
```

---

## Platonic Solid Properties

| Solid | Vertices | Faces | Edges | Element | Meaning |
|-------|----------|-------|-------|---------|---------|
| Tetrahedron | 4 | 4 (△) | 6 | Fire | Transformation |
| Cube | 8 | 6 (□) | 12 | Earth | Stability |
| Octahedron | 6 | 8 (△) | 12 | Air | Balance |
| Dodecahedron | 20 | 12 (⬠) | 30 | Ether | Consciousness |
| Icosahedron | 12 | 20 (△) | 30 | Water | Flow |

**Euler's formula**: V - E + F = 2 (holds for all)

---

## Energy Flow Types

| Pattern | Flow Type | Direction | Effect |
|---------|-----------|-----------|--------|
| Mandala | Radial | Bidirectional | Integration |
| Golden Spiral | Spiral | Outward-expanding | Growth |
| Vesica Piscis | Circular | Cyclical | Rhythm |
| Platonic Solids | Polyhedral | Multi-axial | Complexity |

---

## Implementation Checklist

- [ ] Import math libraries (math, numpy)
- [ ] Define constants (PHI, PI, TAU)
- [ ] Create Point, Circle, Polygon classes
- [ ] Implement pattern generation functions
- [ ] Add visualization (matplotlib/SVG)
- [ ] Calculate meditation points
- [ ] Analyze symmetry properties
- [ ] Generate consciousness interpretations

---

## Usage Example

```python
from sacred_geometry_calculator import SacredGeometryCalculator

calc = SacredGeometryCalculator()
center = Point(0, 0)

# Generate Flower of Life
fol = calc.flower_of_life_circles(center, radius=50, layers=2)

# Generate Golden Spiral
spiral = calc.golden_spiral_points(turns=4, points_per_turn=50)

# Generate Personal Mandala
mandala = calc.mandala_pattern(center, radius=100, petals=8, layers=3)

# Calculate Meditation Points
med_points = [(center.x + 100/PHI * cos(i*PI/4),
               center.y + 100/PHI * sin(i*PI/4))
              for i in range(8)]
```

---

## References

- Source: WitnessOS Sacred Geometry Engine
- Files: sacred_geometry.py, sacred_geometry_models.py, calculations/sacred_geometry.py
- Extraction Date: January 26, 2025
- Target: Tryambakam Noesis Evolution Docs

For complete details, see:
- `README.md` - Overview and integration
- `EXTRACTION-SUMMARY.md` - Complete extraction documentation
- `sacred-geometry-algorithms.md` - Detailed algorithms
- `consciousness-geometry-interface.md` - Consciousness integration
