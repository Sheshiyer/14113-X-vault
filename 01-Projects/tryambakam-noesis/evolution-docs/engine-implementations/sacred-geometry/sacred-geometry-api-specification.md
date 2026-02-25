# Sacred Geometry Engine API Specification

## Overview

The Sacred Geometry Mapper Engine provides RESTful API endpoints for generating consciousness-resonant geometric patterns based on mathematical harmony and sacred proportions.

**Engine Name:** `sacred_geometry_mapper`  
**API Version:** `v1`  
**Base Path:** `/api/v1/engines/sacred-geometry`  
**Authentication:** Required (user_id from CloudflareEngineInput)

## Core Endpoints

### 1. Generate Pattern

#### POST /generate

**Description:** Generate a sacred geometry pattern based on specified parameters.

**Request Body:**
```json
{
  "user_id": "user_12345",
  "pattern_type": "mandala",
  "petal_count": 12,
  "layer_count": 3,
  "color_scheme": "sacred",
  "include_construction_lines": false,
  "intention": "Harmonize my energy field and align with divine order"
}
```

**Pattern Types:**
- `personal` - Personalized based on birth data
- `mandala` - Circular pattern with petals and layers
- `flower_of_life` - Overlapping circles pattern
- `golden_spiral` - Logarithmic spiral using golden ratio
- `sri_yantra` - Sacred tantric diagram
- `platonic_solid` - One of five regular polyhedra
- `vesica_piscis` - Two overlapping circles
- `metatrons_cube` - 13 circles with connecting lines

**Response:**
```json
{
  "engine_name": "sacred_geometry_mapper",
  "calculation_time": 1.234,
  "confidence_score": 1.0,
  "timestamp": "2024-01-15T10:30:00Z",
  "raw_data": {
    "pattern_data": {
      "type": "mandala",
      "center": {"x": 0, "y": 0},
      "radius": 100,
      "geometry": {
        "circles": 3,
        "polygons": 36,
        "lines": 12
      }
    },
    "image_path": "/generated_geometry/sacred_geometry_20240115_103000.png",
    "svg_path": "/generated_geometry/sacred_geometry_20240115_103000.svg",
    "mathematical_properties": {
      "pattern_type": "mandala",
      "center_coordinates": [0, 0],
      "radius": 100,
      "golden_ratio_present": true,
      "symmetry_order": 12,
      "fractal_dimension": 1.5
    },
    "sacred_ratios": {
      "golden_ratio": 1.618033988749895,
      "pi": 3.141592653589793,
      "sqrt_2": 1.4142135623730951,
      "sqrt_3": 1.7320508075688772
    },
    "symmetry_analysis": {
      "type": "rotational",
      "order": 12,
      "reflection_axes": 12,
      "point_group": "D12"
    },
    "meditation_points": [
      [0, 0],
      [61.8, 0],
      [43.7, 43.7],
      [0, 61.8],
      [-43.7, 43.7],
      [-61.8, 0],
      [-43.7, -43.7],
      [0, -61.8],
      [43.7, -43.7]
    ],
    "energy_flow": {
      "flow_type": "radial",
      "direction": "bidirectional",
      "intensity": "balanced",
      "description": "Energy flows from center outward and inward, creating balance"
    },
    "chakra_correspondences": {
      "root": "Grounding and foundation",
      "sacral": "Creative expression",
      "solar_plexus": "Personal power",
      "heart": "Love and connection",
      "throat": "Communication",
      "third_eye": "Intuition and insight",
      "crown": "Spiritual connection"
    }
  },
  "formatted_output": "🔺 SACRED GEOMETRY MANIFESTATION - MANDALA 🔺\n\n...",
  "recommendations": [
    "Meditate daily with your mandala pattern for 10-20 minutes",
    "Focus on the center point first, then expand awareness",
    "Use the pattern as a visual anchor during manifestation work"
  ],
  "reality_patches": [
    "Install: Sacred geometry consciousness interface",
    "Patch: Mandala pattern recognition protocol",
    "Upgrade: Mathematical harmony perception module"
  ],
  "archetypal_themes": [
    "The Sacred Mathematician",
    "The Geometric Mystic",
    "The Mandala Keeper"
  ]
}
```

**Status Codes:**
- `200 OK`: Pattern generated successfully
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Missing or invalid user_id
- `500 Internal Server Error`: Engine processing error

---

### 2. Generate Personal Pattern

#### POST /generate/personal

**Description:** Generate personalized sacred geometry based on birth data.

**Request Body:**
```json
{
  "user_id": "user_12345",
  "birth_date": "1985-05-23T00:00:00Z",
  "color_scheme": "golden",
  "intention": "Connect with my unique geometric signature"
}
```

**Response:**
```json
{
  "engine_name": "sacred_geometry_mapper",
  "pattern_data": {
    "type": "personal",
    "birth_code": "23-5-85",
    "parameters": {
      "petal_count": 23,
      "layer_count": 5,
      "spiral_turns": 2
    },
    "birth_influenced": true
  },
  "image_path": "/generated_geometry/personal_23_5_85.png",
  "svg_path": "/generated_geometry/personal_23_5_85.svg",
  "interpretation": "Your personal geometry reflects the 23rd day's vitality...",
  "sacred_ratios": {
    "golden_ratio": 1.618033988749895,
    "personal_ratio": 4.6
  }
}
```

**Birth Date Mapping:**
- Day (1-31) → Petal count
- Month (1-12) → Layer count
- Year → Spiral turns

---

### 3. Get Available Patterns

#### GET /patterns

**Description:** Retrieve list of available sacred geometry patterns with descriptions.

**Response:**
```json
{
  "patterns": [
    {
      "type": "mandala",
      "name": "Mandala",
      "description": "Circular pattern with petals and concentric layers",
      "parameters": {
        "petal_count": {"type": "integer", "min": 3, "max": 36, "default": 8},
        "layer_count": {"type": "integer", "min": 1, "max": 10, "default": 3}
      },
      "sacred_ratios": ["golden_ratio", "sqrt_2", "sqrt_3"],
      "symbolism": "Represents wholeness, unity, and cosmic order",
      "use_cases": ["Meditation", "Centering", "Balance"]
    },
    {
      "type": "flower_of_life",
      "name": "Flower of Life",
      "description": "Pattern of overlapping circles in hexagonal arrangement",
      "parameters": {
        "layer_count": {"type": "integer", "min": 1, "max": 5, "default": 2}
      },
      "sacred_ratios": ["golden_ratio", "pi", "sqrt_3"],
      "symbolism": "Blueprint of creation, interconnectedness",
      "use_cases": ["Unity consciousness", "Creation meditation", "Sacred blueprint"]
    },
    {
      "type": "golden_spiral",
      "name": "Golden Spiral",
      "description": "Logarithmic spiral growing by golden ratio",
      "parameters": {
        "spiral_turns": {"type": "integer", "min": 1, "max": 8, "default": 4}
      },
      "sacred_ratios": ["golden_ratio", "phi_squared"],
      "symbolism": "Natural growth, expansion, evolution",
      "use_cases": ["Growth work", "Expansion", "Evolution"]
    },
    {
      "type": "sri_yantra",
      "name": "Sri Yantra",
      "description": "Nine interlocking triangles around central point",
      "parameters": {},
      "sacred_ratios": ["golden_ratio", "sqrt_3"],
      "symbolism": "Divine union of masculine and feminine",
      "use_cases": ["Tantric meditation", "Divine union", "Manifestation"]
    },
    {
      "type": "platonic_solid",
      "name": "Platonic Solid",
      "description": "One of five regular convex polyhedra",
      "parameters": {
        "solid_type": {
          "type": "enum",
          "values": ["tetrahedron", "cube", "octahedron", "dodecahedron", "icosahedron"],
          "default": "dodecahedron"
        }
      },
      "sacred_ratios": ["golden_ratio", "sqrt_2", "sqrt_3"],
      "symbolism": "Elements, building blocks of reality",
      "use_cases": ["Elemental work", "Structure", "Foundation"]
    },
    {
      "type": "vesica_piscis",
      "name": "Vesica Piscis",
      "description": "Intersection of two circles",
      "parameters": {},
      "sacred_ratios": ["sqrt_3"],
      "symbolism": "Divine feminine, birth, creation",
      "use_cases": ["Feminine energy", "Birth work", "Creation"]
    },
    {
      "type": "metatrons_cube",
      "name": "Metatron's Cube",
      "description": "All Platonic solids contained in 13 circles",
      "parameters": {},
      "sacred_ratios": ["golden_ratio", "pi", "sqrt_2", "sqrt_3"],
      "symbolism": "Universal structure, archangelic protection",
      "use_cases": ["Protection", "Sacred structure", "Universal connection"]
    }
  ]
}
```

---

### 4. Get Sacred Ratios

#### GET /ratios

**Description:** Retrieve information about sacred mathematical ratios.

**Response:**
```json
{
  "ratios": [
    {
      "name": "Golden Ratio",
      "symbol": "φ (phi)",
      "value": 1.618033988749895,
      "formula": "(1 + √5) / 2",
      "significance": "Divine proportion found throughout nature",
      "examples": ["Nautilus shell", "Galaxy spirals", "Human body proportions"],
      "appears_in": ["golden_spiral", "dodecahedron", "flower_of_life"]
    },
    {
      "name": "Pi",
      "symbol": "π",
      "value": 3.141592653589793,
      "formula": "C / d (circumference / diameter)",
      "significance": "Fundamental circle constant",
      "examples": ["Circles", "Spheres", "Waves"],
      "appears_in": ["all_patterns"]
    },
    {
      "name": "Square Root of 2",
      "symbol": "√2",
      "value": 1.4142135623730951,
      "formula": "√2",
      "significance": "Diagonal of unit square",
      "examples": ["Paper sizes (A4)", "Musical intervals"],
      "appears_in": ["mandala", "octahedron", "metatrons_cube"]
    },
    {
      "name": "Square Root of 3",
      "symbol": "√3",
      "value": 1.7320508075688772,
      "formula": "√3",
      "significance": "Height of equilateral triangle",
      "examples": ["Hexagonal structures", "Crystal lattices"],
      "appears_in": ["flower_of_life", "vesica_piscis", "sri_yantra"]
    },
    {
      "name": "Phi Squared",
      "symbol": "φ²",
      "value": 2.618033988749895,
      "formula": "φ + 1",
      "significance": "Golden ratio squared",
      "examples": ["Pentagonal geometry", "Fibonacci ratios"],
      "appears_in": ["golden_spiral", "dodecahedron"]
    }
  ]
}
```

---

### 5. Analyze Pattern

#### POST /analyze

**Description:** Analyze mathematical and energetic properties of a pattern.

**Request Body:**
```json
{
  "pattern_type": "mandala",
  "petal_count": 12,
  "layer_count": 3
}
```

**Response:**
```json
{
  "mathematical_properties": {
    "symmetry": {
      "type": "rotational",
      "order": 12,
      "reflection_axes": 12,
      "point_group": "D12"
    },
    "sacred_ratios_present": ["golden_ratio", "sqrt_2", "sqrt_3"],
    "fractal_dimension": 1.5,
    "total_elements": {
      "circles": 3,
      "lines": 12,
      "polygons": 36
    }
  },
  "energetic_properties": {
    "energy_flow": {
      "type": "radial",
      "direction": "bidirectional",
      "intensity": "balanced"
    },
    "meditation_points": 9,
    "chakra_alignment": {
      "primary": "heart",
      "secondary": ["crown", "third_eye"]
    },
    "elemental_correspondence": "spirit/aether"
  },
  "recommended_uses": [
    "Daily meditation practice",
    "Energy balancing",
    "Manifestation work",
    "Space clearing"
  ]
}
```

---

### 6. Generate Batch Patterns

#### POST /generate/batch

**Description:** Generate multiple patterns in one request.

**Request Body:**
```json
{
  "user_id": "user_12345",
  "patterns": [
    {
      "pattern_type": "mandala",
      "petal_count": 8,
      "color_scheme": "sacred"
    },
    {
      "pattern_type": "golden_spiral",
      "spiral_turns": 4,
      "color_scheme": "golden"
    },
    {
      "pattern_type": "flower_of_life",
      "layer_count": 2,
      "color_scheme": "monochrome"
    }
  ],
  "intention": "Create a complete meditation toolkit"
}
```

**Response:**
```json
{
  "batch_id": "batch_20240115_103045",
  "patterns_generated": 3,
  "patterns": [
    {
      "pattern_type": "mandala",
      "image_path": "/.../mandala_8_petals.png",
      "svg_path": "/.../mandala_8_petals.svg"
    },
    {
      "pattern_type": "golden_spiral",
      "image_path": "/.../golden_spiral_4_turns.png",
      "svg_path": "/.../golden_spiral_4_turns.svg"
    },
    {
      "pattern_type": "flower_of_life",
      "image_path": "/.../flower_of_life_2_layers.png",
      "svg_path": "/.../flower_of_life_2_layers.svg"
    }
  ],
  "zip_download_url": "/downloads/batch_20240115_103045.zip"
}
```

---

### 7. Get Color Schemes

#### GET /color-schemes

**Description:** Retrieve available color schemes for patterns.

**Response:**
```json
{
  "schemes": {
    "sacred": {
      "name": "Sacred Gold",
      "description": "Traditional sacred geometry colors",
      "colors": {
        "background": "#0A0A0F",
        "primary": "#FFD700",
        "secondary": "#C0C0C0",
        "accent": "#4169E1"
      },
      "use_case": "Traditional spiritual work"
    },
    "chakra": {
      "name": "Chakra Rainbow",
      "description": "Colors aligned with seven chakras",
      "colors": {
        "background": "#1A1A2E",
        "primary": "#9B59B6",
        "secondary": "#3498DB",
        "accent": "#2ECC71"
      },
      "use_case": "Energy healing and chakra work"
    },
    "golden": {
      "name": "Golden Light",
      "description": "Pure gold on white",
      "colors": {
        "background": "#FFFFFF",
        "primary": "#FFD700",
        "secondary": "#FFA500",
        "accent": "#FF8C00"
      },
      "use_case": "Printable, high visibility"
    },
    "monochrome": {
      "name": "Monochrome",
      "description": "Black and white minimalism",
      "colors": {
        "background": "#FFFFFF",
        "primary": "#000000",
        "secondary": "#666666",
        "accent": "#333333"
      },
      "use_case": "Printable coloring pages"
    },
    "elemental": {
      "name": "Elemental",
      "description": "Colors of earth, water, fire, air",
      "colors": {
        "background": "#F5F5DC",
        "primary": "#8B4513",
        "secondary": "#4682B4",
        "accent": "#DC143C"
      },
      "use_case": "Elemental magic and nature work"
    }
  }
}
```

---

### 8. Get Pattern History

#### GET /history

**Description:** Retrieve user's pattern generation history.

**Query Parameters:**
- `user_id` (required): User identifier
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Request:**
```http
GET /api/v1/engines/sacred-geometry/history?user_id=user_12345&limit=5
```

**Response:**
```json
{
  "user_id": "user_12345",
  "total_patterns": 23,
  "patterns": [
    {
      "id": 145,
      "pattern_type": "mandala",
      "parameters": {
        "petal_count": 12,
        "layer_count": 3
      },
      "image_path": "/generated_geometry/sacred_geometry_20240115_103000.png",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 144,
      "pattern_type": "golden_spiral",
      "parameters": {
        "spiral_turns": 4
      },
      "image_path": "/generated_geometry/sacred_geometry_20240114_153000.png",
      "created_at": "2024-01-14T15:30:00Z"
    }
  ]
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "INVALID_PATTERN_TYPE",
    "message": "Pattern type must be one of the supported types",
    "details": {
      "provided": "invalid_pattern",
      "valid_types": ["mandala", "flower_of_life", "golden_spiral", ...]
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_PATTERN_TYPE` | 400 | Unknown pattern type |
| `INVALID_PARAMETER` | 400 | Parameter out of valid range |
| `MISSING_BIRTH_DATE` | 400 | Personal pattern requires birth date |
| `GENERATION_FAILED` | 500 | Pattern generation error |
| `RENDER_FAILED` | 500 | Visual rendering error |
| `FILE_WRITE_ERROR` | 500 | Failed to save output files |

---

## Rate Limiting

**Limits:**
- **Pattern generation**: 20 requests per hour per user
- **Batch generation**: 5 requests per hour per user
- **Other endpoints**: 100 requests per hour per user

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1642248600
```

---

## WebSocket Support (Future)

### Real-time Pattern Generation

**Connection:**
```javascript
ws://api.witnessOS.com/api/v1/engines/sacred-geometry/stream
```

**Message Format:**
```json
{
  "action": "generate",
  "pattern_type": "mandala",
  "parameters": {
    "petal_count": 12
  }
}
```

**Stream Response:**
```json
{
  "status": "progress",
  "percentage": 45,
  "stage": "rendering_circles"
}
```

---

## SDK Examples

### Python

```python
from witnessOS import SacredGeometryClient

client = SacredGeometryClient(api_key="your_key")

# Generate mandala
result = client.generate_pattern(
    user_id="user_12345",
    pattern_type="mandala",
    petal_count=12,
    layer_count=3,
    color_scheme="sacred",
    intention="Harmonize my energy field"
)

print(f"Pattern created: {result.image_path}")
print(f"Sacred ratios present: {result.sacred_ratios}")
```

### JavaScript

```javascript
const { SacredGeometryClient } = require('witnessOS-sdk');

const client = new SacredGeometryClient({ apiKey: 'your_key' });

// Generate golden spiral
const result = await client.generatePattern({
  userId: 'user_12345',
  patternType: 'golden_spiral',
  spiralTurns: 4,
  colorScheme: 'golden',
  intention: 'Growth and expansion'
});

console.log(`Pattern created: ${result.imagePath}`);
console.log(`Meditation points: ${result.meditationPoints.length}`);
```

---

## Additional Resources

- [Sacred Geometry Calculation Formulas](./sacred-geometry-calculation-formulas.md)
- [Implementation Architecture](./sacred-geometry-implementation-architecture.md)
- [Cross-Engine Mappings](./sacred-geometry-cross-engine-mappings.md)

---

**Current API Version:** v1.0.0
