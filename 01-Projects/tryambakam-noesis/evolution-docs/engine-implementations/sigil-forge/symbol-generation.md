# Symbol Generation and Simplification

**Document:** Sigil Forge - Point Connection and Element Composition  
**Purpose:** Complete specification of geometric element creation and sigil assembly

---

## Overview

Symbol generation transforms a set of geometric coordinates into a cohesive visual composition. This involves:

1. **Point Connection** - Linking coordinates to form base structure
2. **Element Creation** - Defining lines, curves, circles, and symbols
3. **Decorative Enhancement** - Adding sacred geometry and visual interest
4. **Aesthetic Optimization** - Smoothing, balancing, and refining
5. **Simplification** - Reducing complexity while maintaining essence

---

## Sigil Element Structure

### Core Data Structure

```python
@dataclass
class SigilElement:
    """Represents a single visual element in the sigil."""
    
    element_type: str  # 'line', 'curve', 'circle', 'symbol'
    start_point: Tuple[float, float]  # (x, y) in 0-1 normalized space
    end_point: Tuple[float, float]
    control_points: List[Tuple[float, float]]  # For curves (Bezier)
    properties: Dict[str, Any]  # Visual properties
```

### Property Dictionary

```python
properties = {
    'weight': float,        # Line thickness (0.5-3.0)
    'style': str,           # 'solid', 'dashed', 'dotted'
    'opacity': float,       # 0.0-1.0 transparency
    'color': str,           # Hex color code
    'fill': bool,           # For closed shapes
    'radius': float         # For circles
}
```

---

## Point Connection Methods

### Method 1: Sequential Connection

**Purpose:** Create continuous path through all points in order

```python
def connect_points_sequential(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect points in sequence to form continuous path.
    Classic sigil method - traces intention through space.
    
    Args:
        points: List of (x, y) coordinate tuples
        
    Returns:
        List of line elements forming connected path
    """
    elements = []
    
    for i in range(len(points) - 1):
        element = SigilElement(
            element_type="line",
            start_point=points[i],
            end_point=points[i + 1],
            control_points=[],
            properties={
                "weight": 2.0,
                "style": "solid",
                "opacity": 1.0
            }
        )
        elements.append(element)
    
    return elements
```

**Characteristics:**
- **Flow:** Creates sense of movement and direction
- **Energy:** Linear progression through intention
- **Symbolism:** Path from current state to goal
- **Visual:** Clean, readable, traditional

**Example:**
```
Points: A → B → C → D
Lines:  A-B, B-C, C-D
Result: Continuous path
```

---

### Method 2: Star Connection (Radial)

**Purpose:** Connect all points to center, creating radiating pattern

```python
def connect_points_star(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect each point to the center.
    Creates radiating star pattern.
    
    Args:
        points: List of (x, y) coordinate tuples
        
    Returns:
        List of line elements radiating from center
    """
    center = (0.5, 0.5)  # Center of normalized space
    elements = []
    
    for point in points:
        element = SigilElement(
            element_type="line",
            start_point=center,
            end_point=point,
            control_points=[],
            properties={
                "weight": 1.5,
                "style": "solid",
                "opacity": 1.0
            }
        )
        elements.append(element)
    
    return elements
```

**Characteristics:**
- **Flow:** Explosive, radiating from core
- **Energy:** Broadcasting, expanding outward
- **Symbolism:** Central self projecting intention
- **Visual:** Dynamic, powerful, symmetrical

**Example:**
```
Center: O
Points: A, B, C, D
Lines:  O-A, O-B, O-C, O-D
Result: Star burst pattern
```

---

### Method 3: Web Connection (Full Network)

**Purpose:** Connect every point to every other point

```python
def connect_points_web(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect each point to every other point.
    Creates complex web pattern.
    
    Args:
        points: List of (x, y) coordinate tuples
        
    Returns:
        List of line elements forming complete graph
    """
    elements = []
    
    for i, point1 in enumerate(points):
        for j, point2 in enumerate(points[i + 1:], i + 1):
            element = SigilElement(
                element_type="line",
                start_point=point1,
                end_point=point2,
                control_points=[],
                properties={
                    "weight": 0.5,
                    "style": "solid",
                    "opacity": 0.3  # Lower opacity to prevent visual overload
                }
            )
            elements.append(element)
    
    return elements
```

**Characteristics:**
- **Flow:** Interconnected, network-like
- **Energy:** Complex, multidirectional
- **Symbolism:** All aspects connected, holistic
- **Visual:** Dense, intricate, mystical

**Complexity:** For n points, creates n(n-1)/2 lines
- 5 points → 10 lines
- 10 points → 45 lines
- 16 points → 120 lines (can be overwhelming)

**Example:**
```
Points: A, B, C
Lines:  A-B, A-C, B-C
Result: Triangle (complete graph K3)
```

---

### Method 4: Organic Connection

**Purpose:** Create flowing, natural-looking connections

```python
def connect_points_organic(points: List[Tuple[float, float]]) -> List[SigilElement]:
    """
    Connect points with curved, flowing lines.
    Uses natural curves instead of straight lines.
    
    Args:
        points: List of (x, y) coordinate tuples
        
    Returns:
        List of curve elements with organic flow
    """
    elements = []
    
    for i in range(len(points) - 1):
        start = points[i]
        end = points[i + 1]
        
        # Calculate control point for quadratic Bezier curve
        mid_x = (start[0] + end[0]) / 2
        mid_y = (start[1] + end[1]) / 2
        
        # Offset perpendicular to line for curve
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        length = math.sqrt(dx*dx + dy*dy)
        
        if length > 0:
            # Perpendicular offset (0.05 = slight curve)
            offset = 0.05
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
            properties={
                "weight": 2.0,
                "style": "solid",
                "opacity": 1.0
            }
        )
        elements.append(element)
    
    return elements
```

**Characteristics:**
- **Flow:** Natural, fluid, graceful
- **Energy:** Flowing like water or wind
- **Symbolism:** Adapting path, ease of manifestation
- **Visual:** Smooth, elegant, artistic

---

## Decorative Element Addition

### Purpose
Enhance base structure with additional symbolic elements for:
- Visual appeal and complexity
- Sacred geometry integration
- Energetic "nodes" at key points
- Increased mystical appearance

---

### Circle Addition at Key Points

```python
def add_decorative_circles(
    base_elements: List[SigilElement],
    intention: str
) -> List[SigilElement]:
    """
    Add circles at strategic points for visual interest.
    
    Args:
        base_elements: Existing sigil elements
        intention: Original intention (for consistent decoration)
        
    Returns:
        Enhanced element list with added circles
    """
    elements = base_elements.copy()
    
    # Generate consistent decoration based on intention
    intention_hash = hashlib.md5(intention.encode()).hexdigest()
    random.seed(int(intention_hash[:8], 16))
    
    # Add center circle (focal point)
    center_circle = SigilElement(
        element_type="circle",
        start_point=(0.5, 0.5),
        end_point=(0.5, 0.5),
        control_points=[],
        properties={
            "radius": 0.05,
            "fill": False,
            "weight": 1.0,
            "opacity": 1.0
        }
    )
    elements.append(center_circle)
    
    # Add small circles at some endpoints
    for i, element in enumerate(base_elements[::2]):  # Every other element
        if element.element_type == "line":
            circle = SigilElement(
                element_type="circle",
                start_point=element.end_point,
                end_point=element.end_point,
                control_points=[],
                properties={
                    "radius": 0.02,
                    "fill": True,
                    "weight": 1.0,
                    "opacity": 1.0
                }
            )
            elements.append(circle)
    
    return elements
```

**Rationale:**
- **Center Circle:** Represents self, source of intention
- **Endpoint Circles:** Mark key energetic nodes
- **Filled vs. Unfilled:** Filled = active nodes, Unfilled = containers

---

### Sacred Geometry Integration

```python
def add_sacred_geometry(
    base_elements: List[SigilElement],
    intention: str,
    geometry_type: Optional[str] = None
) -> List[SigilElement]:
    """
    Add sacred geometric shapes based on intention characteristics.
    
    Args:
        base_elements: Existing sigil elements
        intention: Original intention text
        geometry_type: Specific geometry or None for auto-detection
        
    Returns:
        Elements with sacred geometry overlay
    """
    elements = base_elements.copy()
    
    # Auto-detect geometry type if not specified
    if geometry_type is None:
        if len(intention) % 3 == 0:
            geometry_type = "triangle"
        elif len(intention) % 4 == 0:
            geometry_type = "square"
        elif len(intention) % 5 == 0:
            geometry_type = "pentagon"
        else:
            geometry_type = "circle"
    
    if geometry_type == "triangle":
        # Add background triangle (Fire element)
        triangle_points = [
            (0.5, 0.8),   # Top
            (0.3, 0.2),   # Bottom left
            (0.7, 0.2)    # Bottom right
        ]
        
        for i in range(len(triangle_points)):
            next_i = (i + 1) % len(triangle_points)
            line = SigilElement(
                element_type="line",
                start_point=triangle_points[i],
                end_point=triangle_points[next_i],
                control_points=[],
                properties={
                    "weight": 0.5,
                    "style": "dashed",
                    "opacity": 0.5
                }
            )
            elements.append(line)
    
    elif geometry_type == "circle":
        # Add background circle (Unity)
        circle = SigilElement(
            element_type="circle",
            start_point=(0.5, 0.5),
            end_point=(0.5, 0.5),
            control_points=[],
            properties={
                "radius": 0.4,
                "fill": False,
                "weight": 0.5,
                "opacity": 0.5
            }
        )
        elements.append(circle)
    
    # Additional geometries would follow similar pattern
    
    return elements
```

---

## Aesthetic Optimization

### Purpose
Refine raw geometric construction into visually pleasing, balanced composition.

---

### Line Smoothing (Curve Conversion)

```python
def optimize_aesthetics(elements: List[SigilElement]) -> List[SigilElement]:
    """
    Optimize sigil for aesthetic appeal.
    Converts harsh straight lines to gentle curves.
    
    Args:
        elements: Raw sigil elements
        
    Returns:
        Optimized elements with smoothed curves
    """
    optimized = []
    
    for element in elements:
        if element.element_type == "line":
            # Convert line to subtle curve
            start_x, start_y = element.start_point
            end_x, end_y = element.end_point
            
            # Calculate midpoint
            mid_x = (start_x + end_x) / 2
            mid_y = (start_y + end_y) / 2
            
            # Calculate perpendicular offset
            dx = end_x - start_x
            dy = end_y - start_y
            length = math.sqrt(dx*dx + dy*dy)
            
            if length > 0:
                # Small perpendicular offset for gentle curve
                offset = 0.02
                perp_x = -dy / length * offset
                perp_y = dx / length * offset
                
                control_point = (mid_x + perp_x, mid_y + perp_y)
                
                # Create curved element
                curved = SigilElement(
                    element_type="curve",
                    start_point=element.start_point,
                    end_point=element.end_point,
                    control_points=[control_point],
                    properties=element.properties
                )
                optimized.append(curved)
            else:
                # Keep as is if zero-length
                optimized.append(element)
        else:
            # Keep non-line elements as is
            optimized.append(element)
    
    return optimized
```

**Effect:**
- **Before:** Angular, geometric, harsh
- **After:** Flowing, organic, softer
- **Psychologically:** More approachable, less aggressive

---

### Balance Analysis

```python
def analyze_balance(elements: List[SigilElement], center: Tuple[float, float] = (0.5, 0.5)) -> float:
    """
    Calculate visual balance score of sigil.
    Measures how evenly elements are distributed around center.
    
    Args:
        elements: Sigil elements
        center: Center point for balance calculation
        
    Returns:
        Balance score 0-1 (1 = perfectly balanced)
    """
    if not elements:
        return 1.0
    
    center_x, center_y = center
    total_distance = 0
    
    for element in elements:
        # Calculate distance from center to element start
        dist = math.sqrt(
            (element.start_point[0] - center_x)**2 + 
            (element.start_point[1] - center_y)**2
        )
        total_distance += dist
    
    # Average distance
    avg_distance = total_distance / len(elements)
    
    # Calculate variance (how much elements deviate from average)
    variance = 0
    for element in elements:
        dist = math.sqrt(
            (element.start_point[0] - center_x)**2 + 
            (element.start_point[1] - center_y)**2
        )
        variance += (dist - avg_distance)**2
    
    variance /= len(elements)
    
    # Convert variance to balance score
    # Lower variance = better balance
    balance_score = max(0, 1 - (variance * 10))
    
    return balance_score
```

---

## Simplification Algorithms

### Purpose
Reduce visual complexity while maintaining symbolic essence.

---

### Element Count Reduction

```python
def simplify_by_count(
    elements: List[SigilElement],
    target_count: int = 12
) -> List[SigilElement]:
    """
    Reduce number of elements to target count.
    Keeps most significant elements.
    
    Args:
        elements: All sigil elements
        target_count: Desired final element count
        
    Returns:
        Simplified element list
    """
    if len(elements) <= target_count:
        return elements
    
    # Calculate significance score for each element
    scored_elements = []
    
    for element in elements:
        score = 0
        
        # Main structural elements (lines, curves) are more significant
        if element.element_type in ["line", "curve"]:
            score += 2
        
        # Center elements are more significant
        dist_from_center = math.sqrt(
            (element.start_point[0] - 0.5)**2 + 
            (element.start_point[1] - 0.5)**2
        )
        score += (1 - dist_from_center)
        
        # Higher weight = more significant
        score += element.properties.get("weight", 1) / 3
        
        # Higher opacity = more significant
        score += element.properties.get("opacity", 1)
        
        scored_elements.append((score, element))
    
    # Sort by score descending
    scored_elements.sort(reverse=True, key=lambda x: x[0])
    
    # Keep top N elements
    return [elem for score, elem in scored_elements[:target_count]]
```

---

### Overlap Removal

```python
def remove_overlapping_elements(
    elements: List[SigilElement],
    threshold: float = 0.05
) -> List[SigilElement]:
    """
    Remove elements that are too close together.
    Reduces visual clutter.
    
    Args:
        elements: All sigil elements
        threshold: Minimum distance between elements
        
    Returns:
        Elements with overlaps removed
    """
    cleaned = []
    
    for i, elem1 in enumerate(elements):
        is_unique = True
        
        for j, elem2 in enumerate(elements[:i]):
            # Calculate distance between elements
            dist = math.sqrt(
                (elem1.start_point[0] - elem2.start_point[0])**2 +
                (elem1.start_point[1] - elem2.start_point[1])**2
            )
            
            if dist < threshold:
                is_unique = False
                break
        
        if is_unique:
            cleaned.append(elem1)
    
    return cleaned
```

---

## Complete Composition Assembly

```python
@dataclass
class SigilComposition:
    """Complete sigil composition."""
    elements: List[SigilElement]
    center_point: Tuple[float, float]
    bounding_box: Tuple[float, float, float, float]  # (x1, y1, x2, y2)
    symmetry_type: str  # 'radial', 'spiral', 'grid', 'organic'
    intention_hash: str
```

### Full Assembly Pipeline

```python
def assemble_sigil_composition(
    points: List[Tuple[float, float]],
    intention: str,
    connection_method: str = "sequential",
    optimize: bool = True,
    simplify: bool = False
) -> SigilComposition:
    """
    Complete sigil assembly from points to final composition.
    
    Args:
        points: Geometric coordinate points
        intention: Original intention text
        connection_method: How to connect points
        optimize: Whether to apply aesthetic optimization
        simplify: Whether to simplify result
        
    Returns:
        Complete sigil composition
    """
    # [1] Connect points
    if connection_method == "sequential":
        elements = connect_points_sequential(points)
    elif connection_method == "star":
        elements = connect_points_star(points)
    elif connection_method == "web":
        elements = connect_points_web(points)
    elif connection_method == "organic":
        elements = connect_points_organic(points)
    else:
        elements = connect_points_sequential(points)
    
    # [2] Add decorative elements
    elements = add_decorative_circles(elements, intention)
    elements = add_sacred_geometry(elements, intention)
    
    # [3] Optimize aesthetics (optional)
    if optimize:
        elements = optimize_aesthetics(elements)
    
    # [4] Simplify (optional)
    if simplify:
        elements = simplify_by_count(elements, target_count=12)
        elements = remove_overlapping_elements(elements)
    
    # [5] Calculate bounding box
    all_x = []
    all_y = []
    for element in elements:
        all_x.extend([element.start_point[0], element.end_point[0]])
        all_y.extend([element.start_point[1], element.end_point[1]])
        for cp in element.control_points:
            all_x.extend([cp[0]])
            all_y.extend([cp[1]])
    
    bounding_box = (min(all_x), min(all_y), max(all_x), max(all_y))
    
    # [6] Generate hash
    intention_hash = hashlib.md5(intention.encode()).hexdigest()[:8]
    
    # [7] Assemble composition
    return SigilComposition(
        elements=elements,
        center_point=(0.5, 0.5),
        bounding_box=bounding_box,
        symmetry_type=connection_method,
        intention_hash=intention_hash
    )
```

---

## Summary

Symbol generation transforms geometric coordinates into complete visual sigil through:

1. **Point Connection** - Sequential, star, web, or organic linking
2. **Element Creation** - Lines, curves, circles with properties
3. **Decorative Enhancement** - Sacred geometry and visual nodes
4. **Aesthetic Optimization** - Smoothing and balancing
5. **Simplification** - Reducing complexity while maintaining essence

The result is a **cohesive symbolic representation** that encodes the original intention in visual form, ready for styling and output generation.

**Next Step:** Visual Output Generation → Rendering to PNG/SVG formats
