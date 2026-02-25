# Sigil Forge API Specification

**Version:** 1.0.0  
**Last Updated:** 2026-01-25  
**Base URL:** `https://api.witnessnet.io`

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Schemas](#requestresponse-schemas)
6. [Export Formats](#export-formats)
7. [Batch Generation](#batch-generation)
8. [Webhook Integration](#webhook-integration)
9. [Error Handling](#error-handling)
10. [Code Examples](#code-examples)
11. [Customization Parameters](#customization-parameters)

---

## Overview

The Sigil Forge API enables programmatic generation, analysis, and manipulation of symbolic sigils for manifestation work, meditation, and consciousness programming. The API supports multiple generation methods including traditional letter elimination, sacred geometry, hybrid approaches, and personalized sigils.

### Key Features

- **Multiple Generation Methods**: Traditional, geometric, hybrid, and personal
- **Extensive Customization**: Visual styles, color schemes, sizing options
- **Format Support**: SVG, PNG, PDF export formats
- **Batch Processing**: Generate multiple sigils in parallel
- **Analysis Tools**: Complexity scoring, balance analysis, energy flow detection
- **Webhook Support**: Real-time notifications for completion events

### Base URL

All API requests should be made to:
```
https://api.witnessnet.io/api/sigil-forge
```

---

## Authentication

### API Key Authentication

All requests require an API key passed in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
```

### Obtaining an API Key

1. Sign up at https://witnessnet.io/signup
2. Navigate to Dashboard > API Keys
3. Generate a new API key with appropriate scopes

### Scopes

- `sigil:generate` - Generate new sigils
- `sigil:analyze` - Analyze existing sigils
- `sigil:batch` - Batch generation capabilities
- `sigil:webhook` - Register and manage webhooks

### Example Request

```bash
curl -H "Authorization: Bearer sk_live_123456789" \
     https://api.witnessnet.io/api/sigil-forge/methods
```

---

## Rate Limiting

### Limits by Plan

| Plan | Requests/minute | Requests/day | Batch Size |
|------|----------------|--------------|------------|
| Free | 10 | 100 | 5 |
| Starter | 60 | 1,000 | 20 |
| Professional | 300 | 10,000 | 50 |
| Enterprise | Custom | Custom | Custom |

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1643673600
```

### Exceeding Rate Limits

When rate limits are exceeded, the API returns a `429 Too Many Requests` response:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Retry after 60 seconds.",
    "retry_after": 60
  }
}
```

---

## API Endpoints

### 1. Generate Sigil

**POST** `/api/sigil-forge/generate`

Generate a sigil from an intention statement using specified method and styling options.

#### Request Body

```json
{
  "intention": "I manifest abundance and prosperity",
  "generation_method": "traditional",
  "letter_elimination": true,
  "connection_style": "sequential",
  "style": "minimal",
  "size": 512,
  "color_scheme": "black_white",
  "include_border": false,
  "add_activation_symbols": true,
  "optimize_for_meditation": true,
  "export_formats": ["svg", "png"],
  "charging_method": "visualization"
}
```

#### Response (200 OK)

```json
{
  "id": "sig_abc123def456",
  "status": "completed",
  "intention": "I manifest abundance and prosperity",
  "method_used": "traditional",
  "unique_letters": "IMNFESTABDURPCOY",
  "letter_numbers": [9, 13, 14, 6, 5, 19, 20, 1, 2, 4, 21, 18, 16, 3, 15, 25],
  "sigil_composition": {
    "elements": [
      {
        "element_type": "line",
        "start_point": [0.3, 0.4],
        "end_point": [0.7, 0.6],
        "control_points": [],
        "properties": {
          "weight": 2,
          "style": "solid",
          "opacity": 1.0
        }
      }
    ],
    "center_point": [0.5, 0.5],
    "bounding_box": [0.2, 0.2, 0.8, 0.8],
    "symmetry_type": "radial",
    "intention_hash": "a1b2c3d4e5f6"
  },
  "sigil_analysis": {
    "complexity_score": 0.67,
    "balance_score": 0.85,
    "symmetry_score": 0.72,
    "element_count": 12,
    "dominant_shapes": ["line", "curve", "circle"],
    "energy_flow": "upward_expanding"
  },
  "activation_guidance": {
    "charging_instructions": "Hold the sigil while visualizing your intention manifesting with crystal clarity. Feel the energy of abundance flowing into your life.",
    "meditation_technique": "Gaze softly at the center point for 10-15 minutes daily, allowing your mind to absorb the sigil's energy without conscious analysis.",
    "placement_suggestions": [
      "Place in your workspace facing east for new beginnings",
      "Carry in wallet or purse for constant prosperity energy",
      "Display in meditation space for daily charging"
    ],
    "timing_recommendations": "Work with this sigil during Thursday (Jupiter's day) for maximum abundance energy, preferably during the planetary hour of Jupiter.",
    "destruction_guidance": "Once your intention manifests, burn the sigil with gratitude to release the energy. Do not keep charged sigils after manifestation."
  },
  "symbolic_meaning": "This sigil embodies the upward flow of prosperity consciousness, with radiating lines representing abundance expanding into all areas of life.",
  "elemental_correspondences": {
    "primary_element": "earth",
    "secondary_element": "fire",
    "energy_type": "stable_expanding",
    "direction": "centered_upward"
  },
  "planetary_influences": {
    "primary_planet": "jupiter",
    "secondary_planet": "sun",
    "energy_quality": "expansive_confident",
    "best_timing": "thursday_morning"
  },
  "files": {
    "svg": "https://cdn.witnessnet.io/sigils/sig_abc123def456.svg",
    "png": "https://cdn.witnessnet.io/sigils/sig_abc123def456.png"
  },
  "created_at": "2026-01-25T10:30:00Z",
  "expires_at": "2026-02-24T10:30:00Z"
}
```

---

### 2. List Available Methods

**GET** `/api/sigil-forge/methods`

Retrieve all available generation methods with descriptions.

#### Response (200 OK)

```json
{
  "methods": [
    {
      "id": "traditional",
      "name": "Traditional Letter Elimination",
      "description": "Classic method using letter elimination and geometric connection",
      "best_for": "General intentions and manifestation work",
      "options": {
        "connection_styles": ["sequential", "star", "web", "organic"]
      }
    },
    {
      "id": "geometric",
      "name": "Sacred Geometry Base",
      "description": "Uses sacred geometric forms as the foundation",
      "best_for": "Spiritual work and consciousness expansion",
      "options": {
        "sacred_geometries": ["triangle", "square", "pentagon", "hexagon", "circle", "auto"]
      }
    },
    {
      "id": "hybrid",
      "name": "Hybrid Approach",
      "description": "Combines traditional and geometric methods",
      "best_for": "Complex intentions requiring multiple approaches",
      "options": {}
    },
    {
      "id": "personal",
      "name": "Personalized Sigil",
      "description": "Incorporates personal birth data and symbols",
      "best_for": "Individual spiritual practice and personal development",
      "options": {
        "requires": ["birth_date"],
        "optional": ["personal_symbols"]
      }
    }
  ]
}
```

---

### 3. Batch Generation

**POST** `/api/sigil-forge/batch`

Generate multiple sigils in parallel with different parameters.

#### Request Body

```json
{
  "sigils": [
    {
      "intention": "I attract loving relationships",
      "generation_method": "traditional",
      "style": "organic",
      "color_scheme": "purple"
    },
    {
      "intention": "I achieve career success",
      "generation_method": "geometric",
      "sacred_geometry": "hexagon",
      "style": "geometric"
    },
    {
      "intention": "I maintain perfect health",
      "generation_method": "hybrid",
      "style": "mystical",
      "color_scheme": "blue"
    }
  ],
  "export_formats": ["svg", "png"],
  "webhook_url": "https://your-domain.com/webhooks/sigil-batch"
}
```

#### Response (202 Accepted)

```json
{
  "batch_id": "batch_xyz789",
  "status": "processing",
  "total_sigils": 3,
  "estimated_completion": "2026-01-25T10:32:00Z",
  "webhook_registered": true,
  "status_url": "https://api.witnessnet.io/api/sigil-forge/batch/batch_xyz789"
}
```

#### Batch Status Response

**GET** `/api/sigil-forge/batch/{batch_id}`

```json
{
  "batch_id": "batch_xyz789",
  "status": "completed",
  "total_sigils": 3,
  "completed": 3,
  "failed": 0,
  "results": [
    {
      "index": 0,
      "id": "sig_batch001",
      "status": "completed",
      "files": {
        "svg": "https://cdn.witnessnet.io/sigils/sig_batch001.svg",
        "png": "https://cdn.witnessnet.io/sigils/sig_batch001.png"
      }
    },
    {
      "index": 1,
      "id": "sig_batch002",
      "status": "completed",
      "files": {
        "svg": "https://cdn.witnessnet.io/sigils/sig_batch002.svg",
        "png": "https://cdn.witnessnet.io/sigils/sig_batch002.png"
      }
    },
    {
      "index": 2,
      "id": "sig_batch003",
      "status": "completed",
      "files": {
        "svg": "https://cdn.witnessnet.io/sigils/sig_batch003.svg",
        "png": "https://cdn.witnessnet.io/sigils/sig_batch003.png"
      }
    }
  ],
  "created_at": "2026-01-25T10:30:00Z",
  "completed_at": "2026-01-25T10:31:45Z"
}
```

---

### 4. Download Generated Sigil

**GET** `/api/sigil-forge/download/{id}`

Download a previously generated sigil file.

#### Query Parameters

- `format` (required): File format - `svg`, `png`, or `pdf`
- `size` (optional): Size in pixels for raster formats (default: 512, max: 2048)

#### Example Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.witnessnet.io/api/sigil-forge/download/sig_abc123def456?format=png&size=1024" \
     --output sigil.png
```

#### Response

Returns the file with appropriate `Content-Type` header:
- SVG: `image/svg+xml`
- PNG: `image/png`
- PDF: `application/pdf`

---

### 5. Analyze Existing Sigil

**POST** `/api/sigil-forge/analyze`

Analyze an uploaded sigil image to extract properties and provide interpretation.

#### Request Body (multipart/form-data)

```
file: [binary data]
include_correspondences: true
```

#### Response (200 OK)

```json
{
  "analysis": {
    "complexity_score": 0.73,
    "balance_score": 0.81,
    "symmetry_score": 0.65,
    "element_count": 15,
    "dominant_shapes": ["curve", "line", "circle"],
    "energy_flow": "spiral_inward"
  },
  "detected_method": "traditional_with_modifications",
  "elemental_correspondences": {
    "primary_element": "water",
    "secondary_element": "air",
    "energy_type": "flowing_adaptive",
    "direction": "circular_centered"
  },
  "planetary_influences": {
    "primary_planet": "moon",
    "secondary_planet": "mercury",
    "energy_quality": "intuitive_communicative",
    "best_timing": "monday_evening"
  },
  "interpretation": "This sigil demonstrates strong intuitive and communicative qualities with a balanced, harmonious structure. The flowing elements suggest adaptability and emotional intelligence.",
  "recommendations": [
    "Best used for emotional healing and intuitive development",
    "Charge during Monday evening in moonlight",
    "Pair with meditation on inner wisdom and emotional clarity"
  ]
}
```

---

### 6. List Available Styles

**GET** `/api/sigil-forge/styles`

Retrieve all available visual styles and color schemes.

#### Response (200 OK)

```json
{
  "visual_styles": [
    {
      "id": "minimal",
      "name": "Minimal",
      "description": "Clean, simple lines with minimal decoration",
      "characteristics": ["thin_lines", "sparse_elements", "geometric_precision"],
      "preview_url": "https://cdn.witnessnet.io/styles/minimal.png"
    },
    {
      "id": "ornate",
      "name": "Ornate",
      "description": "Rich decoration with elaborate details",
      "characteristics": ["thick_lines", "decorative_elements", "complex_patterns"],
      "preview_url": "https://cdn.witnessnet.io/styles/ornate.png"
    },
    {
      "id": "organic",
      "name": "Organic",
      "description": "Flowing, natural curves and shapes",
      "characteristics": ["curved_lines", "natural_flow", "asymmetric_balance"],
      "preview_url": "https://cdn.witnessnet.io/styles/organic.png"
    },
    {
      "id": "geometric",
      "name": "Geometric",
      "description": "Sharp angles and precise geometric forms",
      "characteristics": ["angular_lines", "geometric_shapes", "mathematical_precision"],
      "preview_url": "https://cdn.witnessnet.io/styles/geometric.png"
    },
    {
      "id": "mystical",
      "name": "Mystical",
      "description": "Esoteric symbols and mystical elements",
      "characteristics": ["symbolic_elements", "mystical_symbols", "spiritual_geometry"],
      "preview_url": "https://cdn.witnessnet.io/styles/mystical.png"
    }
  ],
  "color_schemes": [
    {
      "id": "black_white",
      "name": "Black & White",
      "colors": {
        "primary": "#000000",
        "secondary": "#FFFFFF",
        "accent": "#666666",
        "background": "#FFFFFF"
      }
    },
    {
      "id": "golden",
      "name": "Golden",
      "colors": {
        "primary": "#FFD700",
        "secondary": "#FFA500",
        "accent": "#FF8C00",
        "background": "#000000"
      }
    },
    {
      "id": "silver",
      "name": "Silver",
      "colors": {
        "primary": "#C0C0C0",
        "secondary": "#A9A9A9",
        "accent": "#808080",
        "background": "#000000"
      }
    },
    {
      "id": "red",
      "name": "Red (Fire)",
      "colors": {
        "primary": "#DC143C",
        "secondary": "#B22222",
        "accent": "#8B0000",
        "background": "#000000"
      }
    },
    {
      "id": "blue",
      "name": "Blue (Water)",
      "colors": {
        "primary": "#4169E1",
        "secondary": "#0000CD",
        "accent": "#000080",
        "background": "#000000"
      }
    },
    {
      "id": "purple",
      "name": "Purple (Spirit)",
      "colors": {
        "primary": "#8A2BE2",
        "secondary": "#9400D3",
        "accent": "#4B0082",
        "background": "#000000"
      }
    }
  ]
}
```

---

### 7. Register Webhook

**POST** `/api/sigil-forge/webhook`

Register a webhook URL to receive notifications for sigil generation completion.

#### Request Body

```json
{
  "url": "https://your-domain.com/webhooks/sigil-completed",
  "events": ["generation.completed", "generation.failed", "batch.completed"],
  "secret": "your_webhook_secret"
}
```

#### Response (201 Created)

```json
{
  "webhook_id": "wh_123456",
  "url": "https://your-domain.com/webhooks/sigil-completed",
  "events": ["generation.completed", "generation.failed", "batch.completed"],
  "status": "active",
  "created_at": "2026-01-25T10:30:00Z"
}
```

---

## Request/Response Schemas

### SigilGenerationRequest

```typescript
interface SigilGenerationRequest {
  // Core intention (required)
  intention: string; // 3-500 characters
  
  // Generation method
  generation_method?: "traditional" | "geometric" | "hybrid" | "personal";
  
  // Traditional method options
  letter_elimination?: boolean;
  connection_style?: "sequential" | "star" | "web" | "organic";
  
  // Geometric method options
  sacred_geometry?: "triangle" | "square" | "pentagon" | "hexagon" | "circle" | "auto";
  
  // Personal customization
  birth_date?: string; // ISO 8601 date format
  personal_symbols?: string[];
  
  // Visual styling
  style?: "minimal" | "ornate" | "organic" | "geometric" | "mystical";
  size?: number; // 256-2048 pixels
  color_scheme?: "black_white" | "golden" | "silver" | "red" | "blue" | "purple" | "custom";
  
  // Advanced options
  include_border?: boolean;
  add_activation_symbols?: boolean;
  optimize_for_meditation?: boolean;
  
  // Export options
  export_formats?: ("svg" | "png" | "pdf")[];
  
  // Charging method
  charging_method?: "visualization" | "elemental" | "planetary" | "personal";
}
```

### SigilGenerationResponse

```typescript
interface SigilGenerationResponse {
  id: string;
  status: "completed" | "processing" | "failed";
  intention: string;
  method_used: string;
  unique_letters: string;
  letter_numbers: number[];
  
  sigil_composition: {
    elements: SigilElement[];
    center_point: [number, number];
    bounding_box: [number, number, number, number];
    symmetry_type: string;
    intention_hash: string;
  };
  
  sigil_analysis: {
    complexity_score: number; // 0-1
    balance_score: number; // 0-1
    symmetry_score: number; // 0-1
    element_count: number;
    dominant_shapes: string[];
    energy_flow: string;
  };
  
  activation_guidance: {
    charging_instructions: string;
    meditation_technique: string;
    placement_suggestions: string[];
    timing_recommendations: string;
    destruction_guidance: string;
  };
  
  symbolic_meaning: string;
  elemental_correspondences: Record<string, string>;
  planetary_influences: Record<string, string>;
  
  files: {
    svg?: string;
    png?: string;
    pdf?: string;
  };
  
  created_at: string;
  expires_at: string;
}
```

### SigilElement

```typescript
interface SigilElement {
  element_type: "line" | "curve" | "circle" | "symbol" | "arc";
  start_point: [number, number]; // Normalized 0-1
  end_point: [number, number]; // Normalized 0-1
  control_points: [number, number][]; // For Bezier curves
  properties: {
    weight: number;
    style: "solid" | "dashed" | "dotted";
    opacity: number;
    color?: string;
  };
}
```

---

## Export Formats

### SVG (Scalable Vector Graphics)

**Format**: `.svg`  
**MIME Type**: `image/svg+xml`

**Features**:
- Infinite scalability without quality loss
- Smallest file size
- Editable in vector graphics software
- Web-compatible

**Example SVG Structure**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 1 1">
  <defs>
    <style>
      .sigil-line { stroke: #000000; stroke-width: 0.01; fill: none; }
      .sigil-circle { stroke: #000000; stroke-width: 0.01; fill: none; }
    </style>
  </defs>
  <g id="sigil-composition">
    <line class="sigil-line" x1="0.3" y1="0.4" x2="0.7" y2="0.6"/>
    <path class="sigil-line" d="M0.5,0.2 Q0.6,0.3 0.7,0.4"/>
    <circle class="sigil-circle" cx="0.5" cy="0.5" r="0.3"/>
  </g>
</svg>
```

---

### PNG (Portable Network Graphics)

**Format**: `.png`  
**MIME Type**: `image/png`

**Features**:
- High-quality raster format
- Lossless compression
- Transparency support
- Universal compatibility

**Specifications**:
- Color Depth: 24-bit RGB or 32-bit RGBA
- Compression: PNG compression level 9
- Resolution: 72 DPI (default), 300 DPI (print quality)
- Alpha Channel: Full transparency support

**Size Options**:
- Small: 256x256 pixels
- Medium: 512x512 pixels (default)
- Large: 1024x1024 pixels
- Extra Large: 2048x2048 pixels

---

### PDF (Portable Document Format)

**Format**: `.pdf`  
**MIME Type**: `application/pdf`

**Features**:
- Print-ready format
- Vector-based (scalable)
- Professional presentation
- Metadata embedding

**Specifications**:
- PDF Version: 1.7
- Page Size: A4 (210mm x 297mm) or Letter (8.5" x 11")
- Margins: 20mm all sides
- Embedded Fonts: Yes
- Color Space: sRGB or CMYK

**PDF Metadata**:
```json
{
  "title": "Sigil: {intention_summary}",
  "author": "Sigil Forge Synthesizer",
  "subject": "Generated Sigil for Manifestation Work",
  "keywords": "sigil, manifestation, intention, {method_used}",
  "creator": "WitnessNet Sigil Forge API v1.0",
  "creation_date": "2026-01-25T10:30:00Z"
}
```

---

## Batch Generation

### Parallel Processing

Batch generation processes multiple sigils simultaneously using a distributed worker pool.

**Maximum Batch Sizes**:
- Free: 5 sigils
- Starter: 20 sigils
- Professional: 50 sigils
- Enterprise: Custom (up to 1000)

### Processing Time

Average processing times per sigil:
- Traditional method: 2-3 seconds
- Geometric method: 3-4 seconds
- Hybrid method: 5-7 seconds
- Personal method: 4-6 seconds

**Batch Example** (10 sigils):
- Sequential: ~30-40 seconds
- Parallel: ~8-12 seconds

### Error Handling in Batches

If individual sigils fail in a batch:
- Successful sigils are still returned
- Failed sigils include error information
- Batch status shows partial completion

```json
{
  "batch_id": "batch_xyz789",
  "status": "partial_completion",
  "total_sigils": 10,
  "completed": 9,
  "failed": 1,
  "results": [
    // ... successful results ...
    {
      "index": 5,
      "status": "failed",
      "error": {
        "code": "invalid_intention",
        "message": "Intention too short (minimum 3 characters)"
      }
    }
  ]
}
```

---

## Webhook Integration

### Webhook Events

Available events for webhook subscriptions:

1. **generation.completed** - Single sigil generation completed
2. **generation.failed** - Single sigil generation failed
3. **batch.completed** - Batch generation completed
4. **batch.partial** - Batch completed with some failures
5. **batch.failed** - Entire batch failed

### Webhook Payload

#### generation.completed

```json
{
  "event": "generation.completed",
  "timestamp": "2026-01-25T10:30:00Z",
  "data": {
    "id": "sig_abc123def456",
    "intention": "I manifest abundance",
    "method_used": "traditional",
    "files": {
      "svg": "https://cdn.witnessnet.io/sigils/sig_abc123def456.svg",
      "png": "https://cdn.witnessnet.io/sigils/sig_abc123def456.png"
    },
    "analysis": {
      "complexity_score": 0.67,
      "balance_score": 0.85
    }
  }
}
```

#### batch.completed

```json
{
  "event": "batch.completed",
  "timestamp": "2026-01-25T10:32:00Z",
  "data": {
    "batch_id": "batch_xyz789",
    "total_sigils": 3,
    "completed": 3,
    "failed": 0,
    "download_url": "https://api.witnessnet.io/api/sigil-forge/batch/batch_xyz789/download"
  }
}
```

### Webhook Security

All webhook payloads include an `X-Signature` header for verification:

```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)
```

### Webhook Retry Policy

If webhook delivery fails:
- Retry 1: After 5 seconds
- Retry 2: After 30 seconds
- Retry 3: After 5 minutes
- Retry 4: After 30 minutes
- Retry 5: After 2 hours

After 5 failed attempts, webhook is disabled and requires manual re-activation.

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": "specific_field",
      "issue": "detailed explanation"
    },
    "request_id": "req_abc123",
    "timestamp": "2026-01-25T10:30:00Z"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted for processing |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary service disruption |

### Error Codes

#### Authentication Errors

- `invalid_api_key` - API key is invalid or expired
- `missing_api_key` - No API key provided
- `insufficient_scope` - API key lacks required permissions

#### Validation Errors

- `invalid_intention` - Intention text invalid (too short/long, invalid characters)
- `invalid_method` - Generation method not supported
- `invalid_style` - Visual style not recognized
- `invalid_color_scheme` - Color scheme not available
- `invalid_size` - Size outside allowed range (256-2048)
- `invalid_format` - Export format not supported
- `invalid_date` - Birth date format incorrect

#### Resource Errors

- `sigil_not_found` - Requested sigil ID doesn't exist
- `sigil_expired` - Sigil download period expired (30 days)
- `batch_not_found` - Batch ID doesn't exist

#### Processing Errors

- `generation_failed` - Sigil generation process failed
- `rendering_failed` - Image rendering failed
- `export_failed` - File export failed

#### Rate Limiting Errors

- `rate_limit_exceeded` - Too many requests
- `batch_size_exceeded` - Batch size exceeds plan limit
- `quota_exceeded` - Monthly quota exhausted

### Example Error Responses

#### Invalid Intention

```json
{
  "error": {
    "code": "invalid_intention",
    "message": "Intention must be between 3 and 500 characters",
    "details": {
      "field": "intention",
      "provided_length": 2,
      "min_length": 3,
      "max_length": 500
    },
    "request_id": "req_abc123",
    "timestamp": "2026-01-25T10:30:00Z"
  }
}
```

#### Rate Limit Exceeded

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit of 60 requests per minute exceeded",
    "details": {
      "limit": 60,
      "reset_at": "2026-01-25T10:31:00Z",
      "retry_after": 42
    },
    "request_id": "req_def456",
    "timestamp": "2026-01-25T10:30:18Z"
  }
}
```

---

## Code Examples

### Python (using requests)

```python
import requests
import json

API_KEY = "sk_live_your_api_key"
BASE_URL = "https://api.witnessnet.io/api/sigil-forge"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Generate a sigil
def generate_sigil(intention, method="traditional", style="minimal"):
    payload = {
        "intention": intention,
        "generation_method": method,
        "style": style,
        "color_scheme": "black_white",
        "size": 512,
        "export_formats": ["svg", "png"]
    }
    
    response = requests.post(
        f"{BASE_URL}/generate",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error: {response.status_code} - {response.text}")

# Download sigil file
def download_sigil(sigil_id, format="png", size=1024):
    response = requests.get(
        f"{BASE_URL}/download/{sigil_id}",
        headers=headers,
        params={"format": format, "size": size},
        stream=True
    )
    
    if response.status_code == 200:
        filename = f"sigil_{sigil_id}.{format}"
        with open(filename, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return filename
    else:
        raise Exception(f"Download failed: {response.status_code}")

# Batch generation
def generate_batch(sigil_requests):
    payload = {
        "sigils": sigil_requests,
        "export_formats": ["svg", "png"]
    }
    
    response = requests.post(
        f"{BASE_URL}/batch",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 202:
        batch_data = response.json()
        return batch_data["batch_id"]
    else:
        raise Exception(f"Batch failed: {response.status_code}")

# Check batch status
def check_batch_status(batch_id):
    response = requests.get(
        f"{BASE_URL}/batch/{batch_id}",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Status check failed: {response.status_code}")

# Example usage
if __name__ == "__main__":
    # Generate single sigil
    result = generate_sigil(
        "I manifest abundance and prosperity",
        method="traditional",
        style="minimal"
    )
    print(f"Generated sigil: {result['id']}")
    
    # Download the sigil
    filename = download_sigil(result['id'], format="png", size=1024)
    print(f"Downloaded to: {filename}")
    
    # Batch generation
    batch_requests = [
        {"intention": "I attract love", "style": "organic"},
        {"intention": "I achieve success", "style": "geometric"},
        {"intention": "I maintain health", "style": "mystical"}
    ]
    batch_id = generate_batch(batch_requests)
    print(f"Batch created: {batch_id}")
```

---

### JavaScript (using fetch)

```javascript
const API_KEY = 'sk_live_your_api_key';
const BASE_URL = 'https://api.witnessnet.io/api/sigil-forge';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// Generate a sigil
async function generateSigil(intention, method = 'traditional', style = 'minimal') {
  const payload = {
    intention,
    generation_method: method,
    style,
    color_scheme: 'black_white',
    size: 512,
    export_formats: ['svg', 'png']
  };
  
  const response = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Download sigil file
async function downloadSigil(sigilId, format = 'png', size = 1024) {
  const url = `${BASE_URL}/download/${sigilId}?format=${format}&size=${size}`;
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`Download failed! status: ${response.status}`);
  }
  
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `sigil_${sigilId}.${format}`;
  link.click();
  
  URL.revokeObjectURL(objectUrl);
}

// Batch generation
async function generateBatch(sigilRequests) {
  const payload = {
    sigils: sigilRequests,
    export_formats: ['svg', 'png']
  };
  
  const response = await fetch(`${BASE_URL}/batch`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  
  if (response.status !== 202) {
    throw new Error(`Batch failed! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.batch_id;
}

// Check batch status
async function checkBatchStatus(batchId) {
  const response = await fetch(`${BASE_URL}/batch/${batchId}`, { headers });
  
  if (!response.ok) {
    throw new Error(`Status check failed! status: ${response.status}`);
  }
  
  return await response.json();
}

// Example usage
(async () => {
  try {
    // Generate single sigil
    const result = await generateSigil(
      'I manifest abundance and prosperity',
      'traditional',
      'minimal'
    );
    console.log('Generated sigil:', result.id);
    
    // Download the sigil
    await downloadSigil(result.id, 'png', 1024);
    console.log('Sigil downloaded');
    
    // Batch generation
    const batchRequests = [
      { intention: 'I attract love', style: 'organic' },
      { intention: 'I achieve success', style: 'geometric' },
      { intention: 'I maintain health', style: 'mystical' }
    ];
    const batchId = await generateBatch(batchRequests);
    console.log('Batch created:', batchId);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

---

### cURL Commands

#### Generate Sigil

```bash
curl -X POST https://api.witnessnet.io/api/sigil-forge/generate \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "intention": "I manifest abundance and prosperity",
    "generation_method": "traditional",
    "style": "minimal",
    "color_scheme": "black_white",
    "size": 512,
    "export_formats": ["svg", "png"]
  }'
```

#### List Methods

```bash
curl https://api.witnessnet.io/api/sigil-forge/methods \
  -H "Authorization: Bearer sk_live_your_api_key"
```

#### Download Sigil

```bash
curl -H "Authorization: Bearer sk_live_your_api_key" \
  "https://api.witnessnet.io/api/sigil-forge/download/sig_abc123?format=png&size=1024" \
  -o sigil.png
```

#### Batch Generation

```bash
curl -X POST https://api.witnessnet.io/api/sigil-forge/batch \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "sigils": [
      {"intention": "I attract love", "style": "organic"},
      {"intention": "I achieve success", "style": "geometric"}
    ],
    "export_formats": ["svg", "png"]
  }'
```

#### Check Batch Status

```bash
curl https://api.witnessnet.io/api/sigil-forge/batch/batch_xyz789 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

---

### TypeScript with Types

```typescript
// Type definitions
interface SigilGenerationRequest {
  intention: string;
  generation_method?: 'traditional' | 'geometric' | 'hybrid' | 'personal';
  letter_elimination?: boolean;
  connection_style?: 'sequential' | 'star' | 'web' | 'organic';
  sacred_geometry?: 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'circle' | 'auto';
  birth_date?: string;
  personal_symbols?: string[];
  style?: 'minimal' | 'ornate' | 'organic' | 'geometric' | 'mystical';
  size?: number;
  color_scheme?: 'black_white' | 'golden' | 'silver' | 'red' | 'blue' | 'purple';
  include_border?: boolean;
  add_activation_symbols?: boolean;
  optimize_for_meditation?: boolean;
  export_formats?: ('svg' | 'png' | 'pdf')[];
  charging_method?: 'visualization' | 'elemental' | 'planetary' | 'personal';
}

interface SigilElement {
  element_type: 'line' | 'curve' | 'circle' | 'symbol' | 'arc';
  start_point: [number, number];
  end_point: [number, number];
  control_points: [number, number][];
  properties: {
    weight: number;
    style: 'solid' | 'dashed' | 'dotted';
    opacity: number;
    color?: string;
  };
}

interface SigilAnalysis {
  complexity_score: number;
  balance_score: number;
  symmetry_score: number;
  element_count: number;
  dominant_shapes: string[];
  energy_flow: string;
}

interface SigilGenerationResponse {
  id: string;
  status: 'completed' | 'processing' | 'failed';
  intention: string;
  method_used: string;
  unique_letters: string;
  letter_numbers: number[];
  sigil_composition: {
    elements: SigilElement[];
    center_point: [number, number];
    bounding_box: [number, number, number, number];
    symmetry_type: string;
    intention_hash: string;
  };
  sigil_analysis: SigilAnalysis;
  activation_guidance: {
    charging_instructions: string;
    meditation_technique: string;
    placement_suggestions: string[];
    timing_recommendations: string;
    destruction_guidance: string;
  };
  symbolic_meaning: string;
  elemental_correspondences: Record<string, string>;
  planetary_influences: Record<string, string>;
  files: {
    svg?: string;
    png?: string;
    pdf?: string;
  };
  created_at: string;
  expires_at: string;
}

// API Client class
class SigilForgeClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.witnessnet.io/api/sigil-forge';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private get headers(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async generateSigil(
    request: SigilGenerationRequest
  ): Promise<SigilGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async downloadSigil(
    sigilId: string,
    format: 'svg' | 'png' | 'pdf' = 'png',
    size: number = 1024
  ): Promise<Blob> {
    const url = `${this.baseUrl}/download/${sigilId}?format=${format}&size=${size}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Download failed! status: ${response.status}`);
    }

    return await response.blob();
  }

  async generateBatch(
    sigils: SigilGenerationRequest[],
    webhookUrl?: string
  ): Promise<string> {
    const payload = {
      sigils,
      export_formats: ['svg', 'png'],
      webhook_url: webhookUrl
    };

    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (response.status !== 202) {
      throw new Error(`Batch failed! status: ${response.status}`);
    }

    const data = await response.json();
    return data.batch_id;
  }

  async getBatchStatus(batchId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/batch/${batchId}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Status check failed! status: ${response.status}`);
    }

    return await response.json();
  }
}

// Example usage
const client = new SigilForgeClient('sk_live_your_api_key');

async function example() {
  try {
    const result = await client.generateSigil({
      intention: 'I manifest abundance and prosperity',
      generation_method: 'traditional',
      style: 'minimal',
      size: 512,
      export_formats: ['svg', 'png']
    });

    console.log('Generated sigil:', result.id);
    console.log('Analysis:', result.sigil_analysis);

    const blob = await client.downloadSigil(result.id, 'png', 1024);
    console.log('Downloaded blob size:', blob.size);

  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## Customization Parameters

### Complete Parameter Reference

#### intention (required)
- **Type**: `string`
- **Length**: 3-500 characters
- **Description**: The intention statement to convert into a sigil
- **Example**: `"I manifest abundance and prosperity"`

#### generation_method
- **Type**: `enum`
- **Values**: `traditional`, `geometric`, `hybrid`, `personal`
- **Default**: `traditional`
- **Description**: Method for generating the sigil

#### letter_elimination
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Use traditional letter elimination (removes duplicate letters)

#### connection_style
- **Type**: `enum`
- **Values**: `sequential`, `star`, `web`, `organic`
- **Default**: `sequential`
- **Description**: How to connect letter-derived points in traditional method

#### sacred_geometry
- **Type**: `enum`
- **Values**: `triangle`, `square`, `pentagon`, `hexagon`, `circle`, `auto`
- **Default**: `auto`
- **Description**: Sacred geometry base for geometric method

#### birth_date
- **Type**: `string` (ISO 8601 date)
- **Default**: `null`
- **Example**: `"1990-05-15"`
- **Description**: Birth date for personal sigil customization

#### personal_symbols
- **Type**: `array of strings`
- **Default**: `null`
- **Example**: `["tree", "star", "spiral"]`
- **Description**: Personal symbols to incorporate into sigil

#### style
- **Type**: `enum`
- **Values**: `minimal`, `ornate`, `organic`, `geometric`, `mystical`
- **Default**: `minimal`
- **Description**: Visual style of the sigil

#### size
- **Type**: `integer`
- **Range**: 256-2048
- **Default**: `512`
- **Description**: Output image size in pixels (applies to PNG/PDF)

#### color_scheme
- **Type**: `enum`
- **Values**: `black_white`, `golden`, `silver`, `red`, `blue`, `purple`, `custom`
- **Default**: `black_white`
- **Description**: Color scheme for the sigil

#### include_border
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Include decorative border around sigil

#### add_activation_symbols
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Add traditional activation symbols to the composition

#### optimize_for_meditation
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Optimize design for meditation and focus work

#### export_formats
- **Type**: `array of enums`
- **Values**: `svg`, `png`, `pdf`
- **Default**: `["svg", "png"]`
- **Description**: File formats to generate

#### charging_method
- **Type**: `enum`
- **Values**: `visualization`, `elemental`, `planetary`, `personal`
- **Default**: `null`
- **Description**: Suggested charging method for the sigil

---

## API Versioning

The API uses URL-based versioning. The current version is `v1` (implicit in the base URL).

Future versions will be accessible via:
```
https://api.witnessnet.io/api/v2/sigil-forge/...
```

Version 1 will be supported until at least January 2027.

---

## Support and Resources

### Documentation
- Full API Documentation: https://docs.witnessnet.io/sigil-forge
- Quick Start Guide: https://docs.witnessnet.io/quick-start
- Interactive API Explorer: https://api.witnessnet.io/docs

### Support
- Email: api-support@witnessnet.io
- Discord: https://discord.gg/witnessnet
- GitHub Issues: https://github.com/witnessnet/sigil-forge-api

### SDKs
- Python SDK: `pip install witnessnet-sigilforge`
- Node.js SDK: `npm install @witnessnet/sigil-forge`
- Ruby SDK: `gem install witnessnet-sigilforge`

---

**End of API Specification**

*Last Updated: 2026-01-25*  
*Version: 1.0.0*
