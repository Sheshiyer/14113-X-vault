# Sigil Forge - Quick Reference Guide

**Purpose:** Fast lookup for key algorithms and parameters  
**For:** Implementation reference and system integration

---

## Core Algorithm Chain

```
RAW INTENTION TEXT
    ↓ [clean_intention()]
NORMALIZED TEXT
    ↓ [eliminate_duplicate_letters()]
UNIQUE LETTERS
    ↓ [letters_to_numbers()]
NUMBER SEQUENCE
    ↓ [numbers_to_geometry(method)]
COORDINATE POINTS
    ↓ [connect_points(connection_method)]
BASE ELEMENTS
    ↓ [add_decorative_elements()]
ENHANCED ELEMENTS
    ↓ [optimize_aesthetics()]
FINAL ELEMENTS
    ↓ [apply_styling()]
STYLED ELEMENTS
    ↓ [render_visual_output()]
SIGIL IMAGE (PNG/SVG)
```

---

## Generation Methods

| Method | Description | Best For | Algorithm |
|--------|-------------|----------|-----------|
| **Traditional** | Letter elimination + radial | General manifestation | `eliminate_duplicates()` → `radial_geometry()` |
| **Geometric** | Sacred geometry base | Spiritual work | `sacred_geometry_template()` + letters |
| **Hybrid** | Traditional + geometric overlay | Complex intentions | `combine_compositions()` |
| **Personal** | Birth data + personal symbols | Individual practice | `traditional()` + `birth_modifiers()` |

---

## Geometry Mapping Methods

### Radial
```python
angle = (letter_position * 360 / 26) * (π / 180)
radius = 0.3 + (sequence_index * 0.1)
x = 0.5 + radius * cos(angle)
y = 0.5 + radius * sin(angle)
```

### Spiral (Golden Ratio)
```python
φ = (1 + √5) / 2
angle = sequence_index * φ * 2π
radius = 0.1 + (sequence_index * 0.05)
x = 0.5 + radius * cos(angle)
y = 0.5 + radius * sin(angle)
```

### Grid
```python
grid_size = ceil(√(letter_count))
row = index // grid_size
col = index % grid_size
x = (col + 0.5) / grid_size
y = (row + 0.5) / grid_size
```

---

## Connection Methods

| Method | Description | Element Count | Complexity |
|--------|-------------|---------------|------------|
| **Sequential** | A→B→C→D | n-1 lines | Low |
| **Star** | All→Center | n lines | Medium |
| **Web** | All→All | n(n-1)/2 lines | High |
| **Organic** | Curved sequential | n-1 curves | Medium |

---

## Visual Styles

| Style | Line Weight | Characteristics | Properties |
|-------|-------------|-----------------|------------|
| **Minimal** | 0.5-1.0 | Thin, sparse, precise | `weight: 1.0` |
| **Ornate** | 2.0-3.0 | Thick, decorated, complex | `weight: 2.5` |
| **Organic** | 1.5-2.0 | Curved, flowing, natural | Convert lines to curves |
| **Geometric** | 1.0-2.0 | Angular, precise, mathematical | Sharp angles preserved |
| **Mystical** | Variable | Symbolic, esoteric, spiritual | Add mystical symbols |

---

## Color Schemes

```python
COLOR_SCHEMES = {
    "black_white": {
        "primary": "#000000",
        "secondary": "#FFFFFF",
        "accent": "#666666",
        "background": "#FFFFFF"
    },
    "golden": {
        "primary": "#FFD700",
        "secondary": "#FFA500",
        "accent": "#FF8C00",
        "background": "#000000"
    },
    "silver": {
        "primary": "#C0C0C0",
        "secondary": "#A9A9A9",
        "accent": "#808080",
        "background": "#000000"
    },
    "red": {
        "primary": "#DC143C",
        "secondary": "#B22222",
        "accent": "#8B0000",
        "background": "#000000"
    },
    "blue": {
        "primary": "#4169E1",
        "secondary": "#0000CD",
        "accent": "#000080",
        "background": "#000000"
    },
    "purple": {
        "primary": "#8A2BE2",
        "secondary": "#9400D3",
        "accent": "#4B0082",
        "background": "#000000"
    }
}
```

---

## Elemental Correspondences

| Element | Shapes | Energy | Direction | Best For |
|---------|--------|--------|-----------|----------|
| **Fire** | Triangle, angular, pointed | Active, transformative | Upward, expanding | Courage, change, willpower |
| **Water** | Circle, curved, flowing | Receptive, emotional | Downward, contracting | Healing, intuition, dreams |
| **Air** | Line, spiral, scattered | Mental, communicative | Horizontal, dispersing | Learning, communication, ideas |
| **Earth** | Square, stable, grounded | Stable, practical | Centered, solid | Manifestation, health, prosperity |

---

## Planetary Influences

| Planet | Energy | Day | Color | Number | Best For |
|--------|--------|-----|-------|--------|----------|
| **Sun** ☉ | Vitality, leadership | Sunday | Gold | 6 | Success, confidence, authority |
| **Moon** ☽ | Intuition, emotions | Monday | Silver | 9 | Psychic work, dreams, healing |
| **Mercury** ☿ | Communication | Wednesday | Orange | 8 | Learning, business, travel |
| **Venus** ♀ | Love, beauty | Friday | Green | 7 | Relationships, art, harmony |
| **Mars** ♂ | Courage, action | Tuesday | Red | 5 | Strength, protection, courage |
| **Jupiter** ♃ | Expansion, wisdom | Thursday | Blue | 4 | Prosperity, growth, luck |
| **Saturn** ♄ | Structure, discipline | Saturday | Black | 3 | Long-term goals, discipline |

---

## Charging Methods

| Method | Duration | Process | Best For |
|--------|----------|---------|----------|
| **Visualization** | 10-20 min × 7 days | Focus, visualize energy | General use |
| **Elemental** | 24 hours | Physical exposure | Specific intentions |
| **Planetary** | 7+ sessions | Planetary hours | Aligned intentions |
| **Personal** | Variable | Custom ritual | Individual practice |

---

## Sacred Geometry Templates

### Triangle (Fire)
```python
points = [
    (0.5, 0.1),   # Top
    (0.1, 0.9),   # Bottom left
    (0.9, 0.9)    # Bottom right
]
```

### Square (Earth)
```python
points = [
    (0.1, 0.1),   # Bottom left
    (0.9, 0.1),   # Bottom right
    (0.9, 0.9),   # Top right
    (0.1, 0.9)    # Top left
]
```

### Circle (Unity)
```python
center = (0.5, 0.5)
radius = 0.4
# Draw circle element
```

### Pentagon (Spirit)
```python
# 5 points equally spaced around circle
for i in range(5):
    angle = (i * 72) * (π / 180)
    x = 0.5 + 0.4 * cos(angle)
    y = 0.5 + 0.4 * sin(angle)
```

### Hexagon (Harmony)
```python
# 6 points equally spaced around circle
for i in range(6):
    angle = (i * 60) * (π / 180)
    x = 0.5 + 0.4 * cos(angle)
    y = 0.5 + 0.4 * sin(angle)
```

---

## Element Data Structure

```python
@dataclass
class SigilElement:
    element_type: str  # 'line', 'curve', 'circle', 'symbol'
    start_point: Tuple[float, float]  # (x, y) in 0-1 space
    end_point: Tuple[float, float]
    control_points: List[Tuple[float, float]]  # For Bezier curves
    properties: Dict[str, Any]  # {weight, style, opacity, color, fill, radius}
```

---

## Composition Structure

```python
@dataclass
class SigilComposition:
    elements: List[SigilElement]
    center_point: Tuple[float, float]
    bounding_box: Tuple[float, float, float, float]  # (x1, y1, x2, y2)
    symmetry_type: str  # 'radial', 'spiral', 'grid', 'organic', 'personal', 'hybrid'
    intention_hash: str  # MD5 hash first 8 chars
```

---

## Analysis Metrics

```python
@dataclass
class SigilAnalysis:
    complexity_score: float  # 0-1, element_count / 20
    balance_score: float  # 0-1, based on center distance variance
    symmetry_score: float  # 0-1, based on symmetry_type
    element_count: int
    dominant_shapes: List[str]  # Most common element types
    energy_flow: str  # Description of perceived flow pattern
```

---

## Activation Guidance Structure

```python
@dataclass
class ActivationGuidance:
    charging_instructions: str
    meditation_technique: str
    placement_suggestions: List[str]
    timing_recommendations: str
    destruction_guidance: str
```

---

## Key Constants

```python
# Letter-to-number mapping
ALPHABET_POSITIONS = {chr(i): i - ord('A') + 1 for i in range(ord('A'), ord('Z') + 1)}
# A=1, B=2, ..., Z=26

# Mathematical constants
GOLDEN_RATIO = (1 + math.sqrt(5)) / 2  # φ ≈ 1.618
GOLDEN_ANGLE = 2 * math.pi / (GOLDEN_RATIO ** 2)  # ≈ 137.5°

# Sacred angles (degrees)
SACRED_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]

# Coordinate space
NORMALIZED_SPACE = (0, 0, 1, 1)  # All coordinates in 0-1 range
CENTER_POINT = (0.5, 0.5)

# Default parameters
DEFAULT_SIZE = 512  # pixels
DEFAULT_STYLE = "minimal"
DEFAULT_COLOR_SCHEME = "black_white"
DEFAULT_CONNECTION = "sequential"
```

---

## Witness Development Progression

| Phase | Duration | Focus | Skill Developed |
|-------|----------|-------|-----------------|
| **Foundation** | Month 1 | Clear intention | Intentional clarity |
| **Externalization** | Month 2 | Symbol creation | Subject-object differentiation |
| **Depth** | Month 3 | Unconscious patterns | Layer recognition |
| **Release** | Month 4 | Non-attachment | Observer stance |
| **Observation** | Month 5 | Manifestation tracking | Causal awareness |
| **Mastery** | Month 6+ | Full integration | Complete witness |

---

## Implementation Checklist

- [ ] Text cleaning function
- [ ] Letter elimination algorithm
- [ ] Letter-to-number conversion
- [ ] Geometry mapping (all 3 methods)
- [ ] Point connection (all 4 methods)
- [ ] Element creation system
- [ ] Decorative enhancement
- [ ] Aesthetic optimization
- [ ] Style application
- [ ] Color scheme system
- [ ] Visual output (PNG/SVG)
- [ ] Elemental correspondence detection
- [ ] Planetary influence detection
- [ ] Activation guidance generation
- [ ] Analysis calculation
- [ ] Composition assembly
- [ ] Input/output data models

---

## API Example

```python
# Create sigil
input_data = SigilForgeInput(
    intention="I will manifest creative abundance",
    generation_method="traditional",
    connection_style="sequential",
    style="organic",
    size=512,
    color_scheme="golden",
    charging_method="visualization"
)

# Generate
output = sigil_forge_engine.calculate(input_data)

# Access results
sigil = output.sigil_composition
analysis = output.sigil_analysis
guidance = output.activation_guidance
image_path = output.image_path
svg_path = output.svg_path
```

---

## Integration Points

### With Other Engines

**Numerology:**
- Letter-to-number conversion aligns with numerological principles
- Can incorporate life path number into personal sigils

**Gene Keys:**
- Shadow intentions map to Gene Key contemplations
- Sigils for integrating shadow → gift → siddhi

**Biorhythm:**
- Timing guidance correlates with personal cycle highs
- Charge during physical/emotional/intellectual peaks

**VedicClock-TCM:**
- Planetary timing aligns with organ clock
- Elemental correspondences match Five Elements

**Face Reading:**
- Constitutional elements inform sigil element selection
- Facial structure reveals intention alignment

---

## Performance Considerations

**Complexity Management:**
- Web connection: O(n²) - limit to small point sets
- Sequential connection: O(n) - efficient for any size
- Optimization passes: Multiple iterations acceptable

**Output Resolution:**
- 512×512: Fast, good for digital display
- 1024×1024: Balanced quality
- 2048×2048: High quality for printing

**Caching:**
- Cache by intention hash
- Store: composition, analysis, image paths
- Invalidate on parameter changes

---

## Testing Scenarios

1. **Short intention:** "Success" → 6 unique letters
2. **Long intention:** Full sentence → 15-20 letters
3. **Repeated letters:** "Happiness" → 7 unique from 9 total
4. **All methods:** Test all generation methods
5. **Edge cases:** Single letter, all 26 letters
6. **Visual verification:** Manual inspection of output quality
7. **Correspondence accuracy:** Verify elemental/planetary detection

---

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Too complex | Many unique letters + web connection | Use sequential, simplify elements |
| Unbalanced | Points clustered on one side | Adjust geometry method or add balancing |
| Unclear | Too many decorative elements | Reduce decoration, increase contrast |
| Boring | Too simple, minimal style | Add sacred geometry, use ornate style |

---

## Summary

This quick reference provides all essential algorithms, parameters, and constants for implementing the Sigil Forge Engine. Use in conjunction with detailed documentation for complete understanding.

**Core Formula:**
```
Intention → Letters → Numbers → Geometry → Connection → Enhancement → Styling → Output
```

**Key Innovation:** Consciousness programming through symbolic externalization
