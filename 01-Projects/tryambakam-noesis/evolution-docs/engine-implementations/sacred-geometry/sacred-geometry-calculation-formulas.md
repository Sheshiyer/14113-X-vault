# Sacred Geometry Calculation Formulas

## Golden Ratio (φ - Phi)

### Definition

The golden ratio is a mathematical constant approximately equal to 1.618033988749895...

**Mathematical Formula:**
$$\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618033988749895$$

**Alternative Expression:**
$$\phi^2 = \phi + 1$$

**Reciprocal:**
$$\frac{1}{\phi} = \phi - 1 \approx 0.618033988749895$$

### Golden Rectangle

A rectangle whose side lengths are in the golden ratio.

**Construction:**
```
Given width w, height h:
h/w = φ

If w = 1:
h = φ ≈ 1.618
```

**Iterative Construction:**
```python
def golden_rectangle_spiral(size: float, iterations: int) -> List[Rect]:
    """Generate nested golden rectangles."""
    rectangles = []
    w = size
    
    for i in range(iterations):
        h = w * PHI
        rectangles.append(Rectangle(w, h))
        # Next rectangle's width is previous height divided by phi
        w = h / PHI
    
    return rectangles
```

### Golden Spiral

A logarithmic spiral whose growth factor is φ.

**Polar Equation:**
$$r(\theta) = a \cdot \phi^{\frac{2\theta}{\pi}}$$

where:
- $r$ = radius at angle $\theta$
- $a$ = initial radius
- $\phi$ = golden ratio
- $\theta$ = angle in radians

**Parametric Form:**
$$x(\theta) = r(\theta) \cos(\theta)$$
$$y(\theta) = r(\theta) \sin(\theta)$$

**Implementation:**
```python
def golden_spiral_points(turns: int = 4, points_per_turn: int = 50) -> List[Point]:
    """
    Generate points along a golden spiral.
    
    Args:
        turns: Number of complete rotations
        points_per_turn: Density of points
    
    Returns:
        List of (x, y) coordinates
    """
    PHI = 1.618033988749895
    points = []
    
    total_points = turns * points_per_turn
    
    for i in range(total_points):
        # Angle from 0 to 2π * turns
        theta = (i / points_per_turn) * 2 * math.pi
        
        # Golden spiral radius
        r = PHI ** (2 * theta / math.pi)
        
        # Convert to Cartesian coordinates
        x = r * math.cos(theta)
        y = r * math.sin(theta)
        
        points.append(Point(x, y))
    
    return points
```

## Fibonacci Sequence

### Definition

A sequence where each number is the sum of the two preceding ones.

**Formula:**
$$F_n = F_{n-1} + F_{n-2}$$

where $F_0 = 0$, $F_1 = 1$

**First Terms:**
```
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987...
```

### Binet's Formula

Closed-form expression for the nth Fibonacci number:

$$F_n = \frac{\phi^n - \psi^n}{\sqrt{5}}$$

where:
- $\phi = \frac{1 + \sqrt{5}}{2}$ (golden ratio)
- $\psi = \frac{1 - \sqrt{5}}{2}$ (conjugate)

**Implementation:**
```python
def fibonacci_binet(n: int) -> int:
    """Calculate nth Fibonacci number using Binet's formula."""
    PHI = (1 + math.sqrt(5)) / 2
    PSI = (1 - math.sqrt(5)) / 2
    
    return int((PHI**n - PSI**n) / math.sqrt(5))
```

### Fibonacci to Golden Ratio Convergence

$$\lim_{n \to \infty} \frac{F_{n+1}}{F_n} = \phi$$

**Implementation:**
```python
def fibonacci_ratio_convergence(n: int) -> float:
    """Show convergence to golden ratio."""
    fib = [0, 1]
    
    for i in range(2, n + 1):
        fib.append(fib[i-1] + fib[i-2])
    
    # Ratio of consecutive terms
    ratio = fib[n] / fib[n-1]
    
    return ratio  # Approaches φ as n increases
```

## Platonic Solids

### Overview

The five regular convex polyhedra.

| Solid | Faces | Vertices | Edges | Face Shape | Element |
|-------|-------|----------|-------|------------|---------|
| Tetrahedron | 4 | 4 | 6 | Triangle | Fire |
| Cube (Hexahedron) | 6 | 8 | 12 | Square | Earth |
| Octahedron | 8 | 6 | 12 | Triangle | Air |
| Dodecahedron | 12 | 20 | 30 | Pentagon | Aether |
| Icosahedron | 20 | 12 | 30 | Triangle | Water |

### Euler's Formula

For any convex polyhedron:

$$V - E + F = 2$$

where:
- $V$ = number of vertices
- $E$ = number of edges
- $F$ = number of faces

### Tetrahedron

**Volume:**
$$V = \frac{a^3}{6\sqrt{2}}$$

**Surface Area:**
$$A = \sqrt{3} \cdot a^2$$

**Edge Length to Circumradius:**
$$R = \frac{a\sqrt{6}}{4}$$

where $a$ = edge length

**Vertex Coordinates (unit tetrahedron centered at origin):**
```python
def tetrahedron_vertices(edge_length: float = 1.0) -> List[Point3D]:
    """Generate vertices of regular tetrahedron."""
    a = edge_length
    vertices = [
        Point3D(1, 1, 1),
        Point3D(1, -1, -1),
        Point3D(-1, 1, -1),
        Point3D(-1, -1, 1)
    ]
    
    # Scale to desired edge length
    scale = a / (2 * math.sqrt(2))
    return [Point3D(v.x * scale, v.y * scale, v.z * scale) for v in vertices]
```

### Cube (Hexahedron)

**Volume:**
$$V = a^3$$

**Surface Area:**
$$A = 6a^2$$

**Face Diagonal:**
$$d_{face} = a\sqrt{2}$$

**Space Diagonal:**
$$d_{space} = a\sqrt{3}$$

**Circumradius:**
$$R = \frac{a\sqrt{3}}{2}$$

### Octahedron

**Volume:**
$$V = \frac{\sqrt{2}}{3} a^3$$

**Surface Area:**
$$A = 2\sqrt{3} \cdot a^2$$

**Circumradius:**
$$R = \frac{a}{\sqrt{2}}$$

**Vertex Coordinates:**
```python
def octahedron_vertices(edge_length: float = 1.0) -> List[Point3D]:
    """Generate vertices of regular octahedron."""
    a = edge_length
    r = a / math.sqrt(2)
    
    return [
        Point3D(r, 0, 0),
        Point3D(-r, 0, 0),
        Point3D(0, r, 0),
        Point3D(0, -r, 0),
        Point3D(0, 0, r),
        Point3D(0, 0, -r)
    ]
```

### Dodecahedron

**Volume:**
$$V = \frac{(15 + 7\sqrt{5})}{4} a^3$$

**Surface Area:**
$$A = 3\sqrt{25 + 10\sqrt{5}} \cdot a^2$$

**Circumradius:**
$$R = \frac{a}{4} \sqrt{3}(\sqrt{5} + 1)$$

**Golden Ratio Relationship:**
The dodecahedron has profound connections to φ:
- Face diagonal / edge = φ
- Contains golden rectangles

**Vertex Coordinates (using golden ratio):**
```python
def dodecahedron_vertices(edge_length: float = 1.0) -> List[Point3D]:
    """Generate vertices of regular dodecahedron."""
    PHI = (1 + math.sqrt(5)) / 2
    
    # Scale factor to get desired edge length
    a = edge_length
    
    vertices = []
    
    # Cube vertices (±1, ±1, ±1)
    for i in [-1, 1]:
        for j in [-1, 1]:
            for k in [-1, 1]:
                vertices.append(Point3D(i, j, k))
    
    # Rectangular vertices (0, ±1/φ, ±φ) and cyclic permutations
    for coords in [(0, 1/PHI, PHI), (0, 1/PHI, -PHI), (0, -1/PHI, PHI), (0, -1/PHI, -PHI),
                   (1/PHI, PHI, 0), (1/PHI, -PHI, 0), (-1/PHI, PHI, 0), (-1/PHI, -PHI, 0),
                   (PHI, 0, 1/PHI), (PHI, 0, -1/PHI), (-PHI, 0, 1/PHI), (-PHI, 0, -1/PHI)]:
        vertices.append(Point3D(*coords))
    
    # Scale to desired edge length
    return [Point3D(v.x * a, v.y * a, v.z * a) for v in vertices]
```

### Icosahedron

**Volume:**
$$V = \frac{5(3 + \sqrt{5})}{12} a^3$$

**Surface Area:**
$$A = 5\sqrt{3} \cdot a^2$$

**Circumradius:**
$$R = \frac{a}{2} \sqrt{\phi\sqrt{5}}$$

where $\phi$ = golden ratio

**Vertex Coordinates:**
```python
def icosahedron_vertices(edge_length: float = 1.0) -> List[Point3D]:
    """Generate vertices of regular icosahedron."""
    PHI = (1 + math.sqrt(5)) / 2
    
    # Vertices at (0, ±1, ±φ) and cyclic permutations
    vertices = [
        Point3D(0, 1, PHI),
        Point3D(0, 1, -PHI),
        Point3D(0, -1, PHI),
        Point3D(0, -1, -PHI),
        Point3D(1, PHI, 0),
        Point3D(1, -PHI, 0),
        Point3D(-1, PHI, 0),
        Point3D(-1, -PHI, 0),
        Point3D(PHI, 0, 1),
        Point3D(PHI, 0, -1),
        Point3D(-PHI, 0, 1),
        Point3D(-PHI, 0, -1)
    ]
    
    # Scale to desired edge length
    a = edge_length
    scale = a / 2
    return [Point3D(v.x * scale, v.y * scale, v.z * scale) for v in vertices]
```

## Metatron's Cube

### Definition

A sacred geometric figure containing all five Platonic solids, formed by connecting the centers of 13 circles arranged in the Fruit of Life pattern.

**Construction Steps:**

1. **Create Fruit of Life** (13 circles)
2. **Mark circle centers** (13 points)
3. **Connect all center points** to each other

**13 Circle Centers:**
```python
def metatrons_cube_centers(radius: float = 1.0) -> List[Point]:
    """
    Generate the 13 circle centers for Metatron's Cube.
    
    Arrangement:
    - 1 center circle
    - 6 circles in inner ring (60° apart)
    - 6 circles in outer ring (60° apart, offset 30°)
    """
    centers = [Point(0, 0)]  # Central circle
    
    # Inner ring (6 circles)
    for i in range(6):
        angle = i * (math.pi / 3)  # 60 degrees
        x = radius * math.cos(angle)
        y = radius * math.sin(angle)
        centers.append(Point(x, y))
    
    # Outer ring (6 circles)
    for i in range(6):
        angle = (i * (math.pi / 3)) + (math.pi / 6)  # 60° + 30° offset
        x = 2 * radius * math.cos(angle)
        y = 2 * radius * math.sin(angle)
        centers.append(Point(x, y))
    
    return centers
```

**Total Lines:**
$$\text{Lines} = \binom{13}{2} = \frac{13 \times 12}{2} = 78 \text{ lines}$$

**Line Generation:**
```python
def metatrons_cube_lines(centers: List[Point]) -> List[Line]:
    """Connect all 13 centers to create Metatron's Cube."""
    lines = []
    
    # Connect every point to every other point
    for i in range(len(centers)):
        for j in range(i + 1, len(centers)):
            lines.append(Line(centers[i], centers[j]))
    
    return lines  # Returns 78 lines
```

### Platonic Solids Within Metatron's Cube

Each Platonic solid can be found by selecting specific vertices:

**Cube:**
```python
cube_vertices = [centers[0], centers[2], centers[4], centers[6], 
                centers[7], centers[9], centers[11], centers[13]]
```

**Tetrahedron:**
```python
tetrahedron_vertices = [centers[1], centers[3], centers[5], centers[12]]
```

## Flower of Life

### Construction Formula

**Circle Packing Pattern:**

Starting with one circle of radius $r$, subsequent circles are placed such that their centers are distance $r$ from existing circle centers.

**Layer n contains:**
$$C_n = 6n \text{ circles}$$

**Total circles through layer n:**
$$T_n = 1 + 3n(n+1)$$

**Examples:**
- Layer 0: 1 circle (center)
- Layer 1: 6 circles (total: 7)
- Layer 2: 12 circles (total: 19)
- Layer 3: 18 circles (total: 37)

**Circle Center Positions:**
```python
def flower_of_life_circles(center: Point, radius: float, layers: int) -> List[Circle]:
    """
    Generate Flower of Life pattern.
    
    Args:
        center: Center point of the pattern
        radius: Radius of each circle
        layers: Number of layers (0 = center only)
    
    Returns:
        List of Circle objects
    """
    circles = [Circle(center, radius)]  # Central circle
    
    for layer in range(1, layers + 1):
        # Number of circles in this layer
        num_circles = 6 * layer
        
        # Angle between circles
        angle_step = 2 * math.pi / num_circles
        
        # Distance from center
        distance = layer * radius
        
        for i in range(num_circles):
            angle = i * angle_step
            x = center.x + distance * math.cos(angle)
            y = center.y + distance * math.sin(angle)
            circles.append(Circle(Point(x, y), radius))
    
    return circles
```

### Vesica Piscis

**Definition:** The intersection of two circles with same radius, where each circle's center lies on the other's circumference.

**Width-to-Height Ratio:**
$$\frac{w}{h} = \frac{\sqrt{3}}{2} \approx 0.866$$

**Area:**
$$A = 2r^2\left(\frac{\pi}{3} - \frac{\sqrt{3}}{2}\right)$$

where $r$ = radius of each circle

**Construction:**
```python
def vesica_piscis(center1: Point, center2: Point, radius: float) -> Dict:
    """
    Create Vesica Piscis from two circles.
    
    Returns:
        Dictionary with circles and intersection points
    """
    circle1 = Circle(center1, radius)
    circle2 = Circle(center2, radius)
    
    # Calculate intersection points
    d = distance(center1, center2)
    
    if d > 2 * radius or d == 0:
        return {"circles": [circle1, circle2], "intersection_points": []}
    
    # Intersection point calculation
    a = (radius**2 - radius**2 + d**2) / (2 * d)
    h = math.sqrt(radius**2 - a**2)
    
    # Midpoint
    mid_x = center1.x + a * (center2.x - center1.x) / d
    mid_y = center1.y + a * (center2.y - center1.y) / d
    
    # Intersection points
    int1_x = mid_x + h * (center2.y - center1.y) / d
    int1_y = mid_y - h * (center2.x - center1.x) / d
    int2_x = mid_x - h * (center2.y - center1.y) / d
    int2_y = mid_y + h * (center2.x - center1.x) / d
    
    return {
        "circles": [circle1, circle2],
        "intersection_points": [Point(int1_x, int1_y), Point(int2_x, int2_y)],
        "width": 2 * h,
        "height": d,
        "ratio": (2 * h) / d
    }
```

## Fractal Dimension

### Box-Counting Dimension

$$D = \lim_{\epsilon \to 0} \frac{\log N(\epsilon)}{\log(1/\epsilon)}$$

where:
- $N(\epsilon)$ = number of boxes of size $\epsilon$ needed to cover the shape
- $D$ = fractal dimension

**Examples:**
- Line: $D = 1$
- Plane: $D = 2$
- Sierpinski Triangle: $D \approx 1.585$
- Koch Snowflake: $D \approx 1.262$

### Self-Similarity Dimension

For exactly self-similar fractals:

$$D = \frac{\log N}{\log r}$$

where:
- $N$ = number of self-similar pieces
- $r$ = scaling factor

**Example - Sierpinski Triangle:**
- $N = 3$ (three copies)
- $r = 2$ (each scaled by 1/2)
- $D = \frac{\log 3}{\log 2} \approx 1.585$

## Sri Yantra

### Construction Formula

Nine interlocking triangles arranged around a central point (bindu).

**Triangle Configuration:**
- 4 upward-pointing triangles (Shiva - masculine)
- 5 downward-pointing triangles (Shakti - feminine)

**Precise Construction Algorithm:**
```python
def sri_yantra_triangles(center: Point, radius: float) -> List[Triangle]:
    """
    Generate Sri Yantra triangles.
    
    Traditional construction uses specific angles and proportions
    based on ancient geometric principles.
    """
    triangles = []
    
    # Upward triangles (Shiva)
    for i in range(4):
        angle_offset = i * (math.pi / 2)
        apex = Point(
            center.x + radius * math.cos(angle_offset + math.pi/2),
            center.y + radius * math.sin(angle_offset + math.pi/2)
        )
        base_angle = angle_offset - math.pi/2
        base_left = Point(
            center.x + radius * 0.8 * math.cos(base_angle - math.pi/6),
            center.y + radius * 0.8 * math.sin(base_angle - math.pi/6)
        )
        base_right = Point(
            center.x + radius * 0.8 * math.cos(base_angle + math.pi/6),
            center.y + radius * 0.8 * math.sin(base_angle + math.pi/6)
        )
        triangles.append(Triangle([apex, base_left, base_right]))
    
    # Downward triangles (Shakti) - similar construction inverted
    for i in range(5):
        angle_offset = i * (2 * math.pi / 5)
        apex = Point(
            center.x + radius * math.cos(angle_offset - math.pi/2),
            center.y + radius * math.sin(angle_offset - math.pi/2)
        )
        base_angle = angle_offset + math.pi/2
        base_left = Point(
            center.x + radius * 0.8 * math.cos(base_angle - math.pi/6),
            center.y + radius * 0.8 * math.sin(base_angle - math.pi/6)
        )
        base_right = Point(
            center.x + radius * 0.8 * math.cos(base_angle + math.pi/6),
            center.y + radius * 0.8 * math.sin(base_angle + math.pi/6)
        )
        triangles.append(Triangle([apex, base_left, base_right]))
    
    return triangles
```

## Sacred Ratios Summary

| Ratio | Value | Formula | Significance |
|-------|-------|---------|--------------|
| Golden Ratio (φ) | 1.618033... | $(1 + \sqrt{5})/2$ | Divine proportion |
| Pi (π) | 3.141592... | $C/d$ | Circle constant |
| √2 | 1.414213... | $\sqrt{2}$ | Diagonal of square |
| √3 | 1.732050... | $\sqrt{3}$ | Height of equilateral triangle |
| √5 | 2.236067... | $\sqrt{5}$ | Diagonal of double square |
| Phi squared (φ²) | 2.618033... | $\phi + 1$ | Golden ratio squared |
| Silver Ratio | 2.414213... | $1 + \sqrt{2}$ | Octagon geometry |

**Constants in Code:**
```python
SACRED_RATIOS = {
    'golden_ratio': 1.618033988749895,
    'pi': 3.141592653589793,
    'sqrt_2': 1.4142135623730951,
    'sqrt_3': 1.7320508075688772,
    'sqrt_5': 2.23606797749979,
    'phi_squared': 2.618033988749895,
    'silver_ratio': 2.414213562373095
}
```
