# Biofield API Specification

**Version:** 1.0.0  
**Status:** Production  
**Last Updated:** 2026-01-26  
**Part of:** Biofield Engine Documentation Suite (7 of 7)  
**Base URL:** `https://api.tryambakam-noesis.com/v1/biofield`  
**WebSocket URL:** `wss://api.tryambakam-noesis.com/v1/biofield/ws`

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [REST API Endpoints](#rest-api-endpoints)
4. [WebSocket Protocol](#websocket-protocol)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Code Examples](#code-examples)

---

## API Overview

### Architecture

The Biofield API provides both REST and WebSocket interfaces:

- **REST API** - For single-frame analysis, batch processing, historical data
- **WebSocket API** - For real-time streaming, live metrics, session management

```
┌─────────────────────────────────────────────────────┐
│                   Client Application                 │
│         (Browser, Mobile App, Desktop App)           │
└──────────────┬─────────────────────┬─────────────────┘
               │                     │
        REST API│              WS API│
               │                     │
    ┌──────────▼─────────┐  ┌───────▼────────┐
    │   REST Endpoints   │  │  WebSocket Hub │
    │   /analysis        │  │  /ws/realtime  │
    │   /baseline        │  │  /ws/metrics   │
    │   /capture         │  │                │
    │   /export          │  │                │
    └──────────┬─────────┘  └───────┬────────┘
               │                     │
               └──────────┬──────────┘
                          │
               ┌──────────▼─────────┐
               │   Backend Core     │
               │  - Metrics Engine  │
               │  - Scores Engine   │
               │  - Storage Layer   │
               └────────────────────┘
```

### Technology Stack

| Component | Technology |
|-----------|------------|
| **REST Framework** | FastAPI 0.104+ |
| **WebSocket** | FastAPI WebSockets |
| **Data Validation** | Pydantic v2 |
| **Image Processing** | OpenCV 4.8+, PIL |
| **Serialization** | JSON, Base64 |
| **Authentication** | JWT (Bearer tokens) |

---

## Authentication

### Overview

All API endpoints (except health check) require authentication using JWT Bearer tokens.

### Obtaining a Token

```http
POST /auth/token
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "secure_password",
  "client_id": "your_client_id"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## REST API Endpoints

### Analysis Endpoints

#### POST /api/analysis/capture

Capture and analyze a single frame/image.

**Request:**

```http
POST /api/analysis/capture
Authorization: Bearer {token}
Content-Type: multipart/form-data

image: [binary image file]
mode: "fullBody" | "face" | "segmented"
region: "full" | "face" | "body"
pip_settings: {JSON string} (optional)
```

**cURL Example:**

```bash
curl -X POST "https://api.tryambakam-noesis.com/v1/biofield/api/analysis/capture" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "mode=fullBody" \
  -F "region=full" \
  -F 'pip_settings={"threshold":0.5,"hue_shift":0.15}'
```

**TypeScript Interface:**

```typescript
interface CaptureRequest {
  image: File | Blob;
  mode: "fullBody" | "face" | "segmented";
  region: "full" | "face" | "body";
  pip_settings?: PIPSettings;
}

interface PIPSettings {
  threshold?: number;          // 0-1, default 0.5
  hue_shift?: number;          // -0.5 to 0.5, default 0.15
  saturation_boost?: number;   // 0-2, default 1.2
  blur_kernel?: number;        // Odd number, default 5
  edge_sensitivity?: number;   // 0-1, default 0.3
}
```

**Response:**

```json
{
  "id": "a3f8b2c1",
  "timestamp": "2026-01-26T14:32:18.472Z",
  "mode": "fullBody",
  "metrics": {
    "basic": {
      "avgIntensity": 128.45,
      "stdDeviation": 42.18,
      "lightQuantaDensity": 0.423,
      "innerNoise": 22.67,
      "signalNoiseRatio": 15.83
    },
    "color": {
      "colorEntropy": 4.82,
      "dominantHue": 0.62,
      "saturationMean": 0.58,
      "valueMean": 0.72,
      "redChannel": 145.3,
      "greenChannel": 132.8,
      "blueChannel": 118.2
    },
    "geometric": {
      "imageArea": 921600,
      "centerOfMass": [640, 360],
      "spatialMoment": 2.34e12,
      "eccentricity": 0.42,
      "orientation": 12.5
    },
    "contour": {
      "perimeterLength": 3284.5,
      "largestContourArea": 156720,
      "contourCount": 47,
      "hullArea": 168340,
      "solidity": 0.931,
      "convexityDefects": 12
    },
    "nonlinear": {
      "fractalDimension": 1.68,
      "hurstExponent": 0.72,
      "lyapunovExponent": -0.08,
      "dfaAlpha": 1.12,
      "sampleEntropy": 1.95,
      "correlationDimension": 3.24
    },
    "symmetry": {
      "verticalSymmetry": 0.847,
      "horizontalSymmetry": 0.623,
      "radialSymmetry": 0.729,
      "bilateralScore": 0.835
    }
  },
  "scores": {
    "energy": 68.5,
    "symmetry": 74.2,
    "coherence": 61.8,
    "complexity": 52.4,
    "regulation": 70.3,
    "colorBalance": 78.9
  },
  "images": {
    "original": "data:image/png;base64,iVBORw0KGgoAAAANSUh...",
    "processed": "data:image/png;base64,iVBORw0KGgoAAAANSUh..."
  }
}
```

**TypeScript Response Interface:**

```typescript
interface AnalysisResponse {
  id: string;
  timestamp: string;  // ISO 8601
  mode: string;
  metrics: {
    basic: BasicMetrics;
    color: ColorMetrics;
    geometric: GeometricMetrics;
    contour: ContourMetrics;
    nonlinear: NonlinearMetrics;
    symmetry: SymmetryMetrics;
  };
  scores: CompositeScores;
  images: {
    original: string;  // Base64 data URL
    processed: string; // Base64 data URL
  };
}

interface BasicMetrics {
  avgIntensity: number;       // 0-255
  stdDeviation: number;       // 0-255
  lightQuantaDensity: number; // 0-1
  innerNoise: number;         // 0-100
  signalNoiseRatio: number;   // dB
}

interface ColorMetrics {
  colorEntropy: number;     // bits
  dominantHue: number;      // 0-1
  saturationMean: number;   // 0-1
  valueMean: number;        // 0-1
  redChannel: number;       // 0-255
  greenChannel: number;     // 0-255
  blueChannel: number;      // 0-255
}

interface GeometricMetrics {
  imageArea: number;        // pixels²
  centerOfMass: [number, number];
  spatialMoment: number;
  eccentricity: number;     // 0-1
  orientation: number;      // degrees
}

interface ContourMetrics {
  perimeterLength: number;    // pixels
  largestContourArea: number; // pixels²
  contourCount: number;
  hullArea: number;           // pixels²
  solidity: number;           // 0-1
  convexityDefects: number;
}

interface NonlinearMetrics {
  fractalDimension: number;      // ~1.0-2.0
  hurstExponent: number;         // 0-1
  lyapunovExponent: number;      // negative = stable
  dfaAlpha: number;              // ~0.5-1.5
  sampleEntropy: number;         // bits
  correlationDimension: number;  // dimensions
}

interface SymmetryMetrics {
  verticalSymmetry: number;    // 0-1
  horizontalSymmetry: number;  // 0-1
  radialSymmetry: number;      // 0-1
  bilateralScore: number;      // 0-1
}

interface CompositeScores {
  energy: number;        // 0-100
  symmetry: number;      // 0-100
  coherence: number;     // 0-100
  complexity: number;    // 0-100
  regulation: number;    // 0-100
  colorBalance: number;  // 0-100
}
```

**Error Responses:**

```json
{
  "status_code": 400,
  "detail": "Invalid image format. Supported: JPEG, PNG, BMP",
  "error_code": "INVALID_IMAGE_FORMAT"
}
```

```json
{
  "status_code": 500,
  "detail": "Analysis failed: Face detection error",
  "error_code": "ANALYSIS_FAILED"
}
```

---

#### GET /api/analysis/{analysis_id}

Retrieve a specific analysis by ID.

**Request:**

```http
GET /api/analysis/a3f8b2c1
Authorization: Bearer {token}
```

**Response:**

Returns same structure as capture endpoint response.

**Status Codes:**
- `200` - Success
- `404` - Analysis not found
- `401` - Unauthorized

---

#### GET /api/analysis/history

Get analysis history with pagination and filtering.

**Request:**

```http
GET /api/analysis/history?limit=50&offset=0&start_date=2026-01-01&end_date=2026-01-31
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 50 | Number of results per page (1-100) |
| `offset` | integer | No | 0 | Pagination offset |
| `start_date` | string | No | - | ISO 8601 date filter (inclusive) |
| `end_date` | string | No | - | ISO 8601 date filter (inclusive) |
| `mode` | string | No | - | Filter by analysis mode |
| `min_energy` | number | No | - | Filter by minimum energy score |

**TypeScript Interface:**

```typescript
interface HistoryQuery {
  limit?: number;
  offset?: number;
  start_date?: string;  // ISO 8601
  end_date?: string;    // ISO 8601
  mode?: "fullBody" | "face" | "segmented";
  min_energy?: number;  // 0-100
}
```

**Response:**

```json
{
  "total": 247,
  "limit": 50,
  "offset": 0,
  "items": [
    {
      "id": "a3f8b2c1",
      "timestamp": "2026-01-26T14:32:18.472Z",
      "mode": "fullBody",
      "scores": {
        "energy": 68.5,
        "symmetry": 74.2,
        "coherence": 61.8,
        "complexity": 52.4,
        "regulation": 70.3,
        "colorBalance": 78.9
      },
      "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    }
    // ... 49 more items
  ]
}
```

---

### Baseline Endpoints

#### POST /api/baseline/create

Create a baseline from a session or single analysis.

**Request:**

```http
POST /api/baseline/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "session_id": "session_abc123",
  "name": "Morning Baseline - Week 1",
  "description": "Baseline established after 10 min meditation"
}
```

**TypeScript Interface:**

```typescript
interface BaselineCreateRequest {
  session_id: string;
  name?: string;
  description?: string;
}
```

**Response:**

```json
{
  "id": "baseline_xyz789",
  "name": "Morning Baseline - Week 1",
  "is_active": false,
  "created_at": "2026-01-26T08:15:00Z",
  "metrics": {
    "avgIntensity": 132.5,
    "colorEntropy": 4.65,
    "fractalDimension": 1.72,
    "verticalSymmetry": 0.831
  },
  "scores": {
    "energy": 72.3,
    "symmetry": 78.1,
    "coherence": 68.4,
    "complexity": 54.2,
    "regulation": 73.8,
    "colorBalance": 81.2
  },
  "analysis_count": 120,
  "session_duration": 600
}
```

---

#### GET /api/baseline/current

Get the currently active baseline.

**Request:**

```http
GET /api/baseline/current
Authorization: Bearer {token}
```

**Response:**

```json
{
  "id": "baseline_xyz789",
  "name": "Morning Baseline - Week 1",
  "is_active": true,
  "created_at": "2026-01-26T08:15:00Z",
  "metrics": { /* ... */ },
  "scores": { /* ... */ }
}
```

If no active baseline:

```json
{
  "id": null,
  "message": "No active baseline"
}
```

---

#### PUT /api/baseline/{baseline_id}/activate

Set a specific baseline as the active baseline.

**Request:**

```http
PUT /api/baseline/baseline_xyz789/activate
Authorization: Bearer {token}
```

**Response:**

```json
{
  "status": "activated",
  "baseline_id": "baseline_xyz789",
  "activated_at": "2026-01-26T14:45:00Z"
}
```

---

#### DELETE /api/baseline/{baseline_id}

Delete a baseline.

**Request:**

```http
DELETE /api/baseline/baseline_xyz789
Authorization: Bearer {token}
```

**Response:**

```json
{
  "status": "deleted",
  "baseline_id": "baseline_xyz789"
}
```

---

### Capture Endpoints

#### POST /api/capture/frame

Store a captured frame for later analysis.

**Request:**

```http
POST /api/capture/frame
Authorization: Bearer {token}
Content-Type: multipart/form-data

image: [binary image file]
```

**Response:**

```json
{
  "id": "frame_def456",
  "url": "https://storage.tryambakam-noesis.com/frames/frame_def456.jpg",
  "timestamp": "2026-01-26T14:50:22.134Z",
  "size_bytes": 245680,
  "dimensions": {
    "width": 1920,
    "height": 1080
  }
}
```

---

#### POST /api/capture/batch

Store multiple frames for batch analysis.

**Request:**

```http
POST /api/capture/batch
Authorization: Bearer {token}
Content-Type: multipart/form-data

images: [array of image files, max 10]
```

**Response:**

```json
{
  "batch_id": "batch_ghi789",
  "count": 8,
  "status": "pending",
  "frames": [
    {
      "id": "frame_001",
      "url": "https://storage.../frame_001.jpg",
      "timestamp": "2026-01-26T14:50:22.134Z"
    }
    // ... 7 more
  ],
  "estimated_processing_time": 45
}
```

**Constraints:**
- Maximum 10 images per batch
- Each image must be < 10MB
- Supported formats: JPEG, PNG, BMP

---

### Export Endpoints

#### GET /api/export/session/{session_id}

Export session data in various formats.

**Request:**

```http
GET /api/export/session/session_abc123?format=json
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `format` | string | No | json | `json`, `csv`, `xlsx` |
| `include_images` | boolean | No | false | Include base64 images |
| `include_metrics` | boolean | No | true | Include detailed metrics |

**TypeScript Interface:**

```typescript
interface ExportQuery {
  format?: "json" | "csv" | "xlsx";
  include_images?: boolean;
  include_metrics?: boolean;
}
```

**Response (JSON):**

```json
{
  "session_id": "session_abc123",
  "start_time": "2026-01-26T14:00:00Z",
  "end_time": "2026-01-26T14:10:00Z",
  "duration": 600,
  "analysis_count": 120,
  "mode": "fullBody",
  "analyses": [
    {
      "id": "a3f8b2c1",
      "timestamp": "2026-01-26T14:00:05.123Z",
      "metrics": { /* ... */ },
      "scores": { /* ... */ }
    }
    // ... 119 more
  ],
  "aggregates": {
    "avg_energy": 68.2,
    "std_energy": 5.3,
    "min_energy": 58.1,
    "max_energy": 78.9,
    "trend": "increasing"
  }
}
```

**Response Headers (CSV/XLSX):**

```http
Content-Type: text/csv (or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
Content-Disposition: attachment; filename=session_abc123.csv
```

---

#### GET /api/export/analysis/{analysis_id}

Export single analysis data.

**Request:**

```http
GET /api/export/analysis/a3f8b2c1?format=pdf&include_images=true
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `format` | string | No | json | `json`, `csv`, `pdf` |
| `include_images` | boolean | No | false | Include images |

**Response (PDF):**

Binary PDF file with analysis report.

---

## WebSocket Protocol

### Connection Endpoints

#### /ws/realtime

Primary WebSocket endpoint for real-time analysis.

**Connection URL:**

```
wss://api.tryambakam-noesis.com/v1/biofield/ws/realtime?token=YOUR_JWT_TOKEN
```

**JavaScript Example:**

```javascript
const ws = new WebSocket('wss://api.tryambakam-noesis.com/v1/biofield/ws/realtime?token=YOUR_TOKEN');

ws.onopen = () => {
  console.log('Connected');
  
  // Authenticate (if not using URL token)
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_JWT_TOKEN'
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Message type:', message.type);
  
  if (message.type === 'metrics') {
    updateUI(message.payload);
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected');
};
```

---

### Message Types

#### Client → Server Messages

**1. Authentication**

```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**2. Start Session**

```json
{
  "type": "session_start",
  "settings": {
    "mode": "fullBody",
    "region": "full",
    "fps": 30,
    "baseline_id": "baseline_xyz789",
    "pip_settings": {
      "threshold": 0.5,
      "hue_shift": 0.15
    }
  }
}
```

**TypeScript Interface:**

```typescript
interface SessionStartMessage {
  type: "session_start";
  settings: {
    mode: "fullBody" | "face" | "segmented";
    region: "full" | "face" | "body";
    fps: number;  // 1-60
    baseline_id?: string;
    pip_settings?: PIPSettings;
  };
}
```

**3. Submit Frame**

```json
{
  "type": "frame",
  "payload": {
    "timestamp": 1706280123456,
    "image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "sequence_number": 42
  }
}
```

**4. End Session**

```json
{
  "type": "session_end"
}
```

**5. Ping (Keep-alive)**

```json
{
  "type": "ping"
}
```

---

#### Server → Client Messages

**1. Authentication Success**

```json
{
  "type": "auth_success",
  "client_id": "client_a1b2c3d4",
  "session_id": null
}
```

**2. Session Started**

```json
{
  "type": "session_started",
  "session_id": "session_abc123",
  "settings": {
    "mode": "fullBody",
    "region": "full",
    "fps": 30
  },
  "baseline": {
    "id": "baseline_xyz789",
    "name": "Morning Baseline - Week 1"
  }
}
```

**3. Metrics Update**

```json
{
  "type": "metrics",
  "payload": {
    "timestamp": 1706280123456,
    "sequence_number": 42,
    "frame_id": "frame_42",
    "metrics": {
      "avgIntensity": 128.45,
      "colorEntropy": 4.82,
      "fractalDimension": 1.68,
      "verticalSymmetry": 0.847
    },
    "scores": {
      "energy": 68.5,
      "symmetry": 74.2,
      "coherence": 61.8,
      "complexity": 52.4,
      "regulation": 70.3,
      "colorBalance": 78.9
    },
    "baseline_comparison": {
      "energy_delta": -3.8,
      "symmetry_delta": -3.9,
      "coherence_delta": -6.6,
      "overall_alignment": 0.912
    }
  }
}
```

**TypeScript Interface:**

```typescript
interface MetricsMessage {
  type: "metrics";
  payload: {
    timestamp: number;  // Unix milliseconds
    sequence_number: number;
    frame_id: string;
    metrics: Partial<AllMetrics>;
    scores: CompositeScores;
    baseline_comparison?: {
      energy_delta: number;
      symmetry_delta: number;
      coherence_delta: number;
      complexity_delta: number;
      regulation_delta: number;
      colorBalance_delta: number;
      overall_alignment: number;  // 0-1
    };
  };
}
```

**4. Session Ended**

```json
{
  "type": "session_ended",
  "session_id": "session_abc123",
  "summary": {
    "duration": 600,
    "frame_count": 120,
    "avg_scores": {
      "energy": 68.2,
      "symmetry": 74.5,
      "coherence": 62.1,
      "complexity": 53.8,
      "regulation": 70.1,
      "colorBalance": 79.3
    },
    "trends": {
      "energy": "increasing",
      "coherence": "stable",
      "regulation": "improving"
    }
  }
}
```

**5. Error**

```json
{
  "type": "error",
  "error_code": "PROCESSING_ERROR",
  "message": "Failed to process frame 42: Invalid image data",
  "severity": "warning",
  "recoverable": true
}
```

**6. Pong (Keep-alive response)**

```json
{
  "type": "pong"
}
```

---

#### /ws/metrics

Alternative WebSocket for metrics-only streaming (lighter weight).

**Connection:**

```javascript
const ws = new WebSocket('wss://api.tryambakam-noesis.com/v1/biofield/ws/metrics?token=YOUR_TOKEN');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'metrics') {
    // Only receives computed metrics, not full analysis
    console.log('Fractal Dimension:', message.fractalDimension);
    console.log('Hurst Exponent:', message.hurstExponent);
  }
};
```

**Server Messages:**

```json
{
  "type": "metrics",
  "fractalDimension": 1.68,
  "hurstExponent": 0.72,
  "lyapunovExponent": -0.08,
  "dfaAlpha": 1.12
}
```

---

## Data Models

### Complete TypeScript Definitions

```typescript
// ============================================================
// REQUEST MODELS
// ============================================================

interface AuthRequest {
  username: string;
  password: string;
  client_id: string;
}

interface AnalysisCaptureRequest {
  image: File | Blob;
  mode: "fullBody" | "face" | "segmented";
  region: "full" | "face" | "body";
  pip_settings?: PIPSettings;
}

interface PIPSettings {
  threshold?: number;          // 0-1
  hue_shift?: number;          // -0.5 to 0.5
  saturation_boost?: number;   // 0-2
  blur_kernel?: number;        // Odd number
  edge_sensitivity?: number;   // 0-1
}

interface BaselineCreateRequest {
  session_id: string;
  name?: string;
  description?: string;
}

interface SessionStartRequest {
  type: "session_start";
  settings: SessionSettings;
}

interface SessionSettings {
  mode: "fullBody" | "face" | "segmented";
  region: "full" | "face" | "body";
  fps: number;  // 1-60
  baseline_id?: string;
  pip_settings?: PIPSettings;
}

// ============================================================
// RESPONSE MODELS
// ============================================================

interface AuthResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;  // seconds
  refresh_token: string;
}

interface AnalysisResponse {
  id: string;
  timestamp: string;  // ISO 8601
  mode: string;
  metrics: AllMetrics;
  scores: CompositeScores;
  images: {
    original: string;  // Base64 data URL
    processed: string;
  };
}

interface AllMetrics {
  basic: BasicMetrics;
  color: ColorMetrics;
  geometric: GeometricMetrics;
  contour: ContourMetrics;
  nonlinear: NonlinearMetrics;
  symmetry: SymmetryMetrics;
}

interface BasicMetrics {
  avgIntensity: number;       // 0-255
  stdDeviation: number;       // 0-255
  lightQuantaDensity: number; // 0-1
  innerNoise: number;         // 0-100
  signalNoiseRatio: number;   // dB
}

interface ColorMetrics {
  colorEntropy: number;     // bits
  dominantHue: number;      // 0-1
  saturationMean: number;   // 0-1
  valueMean: number;        // 0-1
  redChannel: number;       // 0-255
  greenChannel: number;     // 0-255
  blueChannel: number;      // 0-255
}

interface GeometricMetrics {
  imageArea: number;        // pixels²
  centerOfMass: [number, number];
  spatialMoment: number;
  eccentricity: number;     // 0-1
  orientation: number;      // degrees
}

interface ContourMetrics {
  perimeterLength: number;    // pixels
  largestContourArea: number; // pixels²
  contourCount: number;
  hullArea: number;           // pixels²
  solidity: number;           // 0-1
  convexityDefects: number;
}

interface NonlinearMetrics {
  fractalDimension: number;      // ~1.0-2.0
  hurstExponent: number;         // 0-1
  lyapunovExponent: number;      // negative = stable
  dfaAlpha: number;              // ~0.5-1.5
  sampleEntropy: number;         // bits
  correlationDimension: number;  // dimensions
}

interface SymmetryMetrics {
  verticalSymmetry: number;    // 0-1
  horizontalSymmetry: number;  // 0-1
  radialSymmetry: number;      // 0-1
  bilateralScore: number;      // 0-1
}

interface CompositeScores {
  energy: number;        // 0-100
  symmetry: number;      // 0-100
  coherence: number;     // 0-100
  complexity: number;    // 0-100
  regulation: number;    // 0-100
  colorBalance: number;  // 0-100
}

interface BaselineResponse {
  id: string;
  name: string | null;
  is_active: boolean;
  created_at: string;  // ISO 8601
  metrics: Partial<AllMetrics>;
  scores: CompositeScores;
  analysis_count?: number;
  session_duration?: number;  // seconds
}

interface HistoryResponse {
  total: number;
  limit: number;
  offset: number;
  items: HistoryItem[];
}

interface HistoryItem {
  id: string;
  timestamp: string;  // ISO 8601
  mode: string;
  scores: CompositeScores;
  thumbnail: string;  // Base64 data URL
}

interface ExportSessionResponse {
  session_id: string;
  start_time: string;  // ISO 8601
  end_time: string;    // ISO 8601
  duration: number;    // seconds
  analysis_count: number;
  mode: string;
  analyses: AnalysisResponse[];
  aggregates: SessionAggregates;
}

interface SessionAggregates {
  avg_energy: number;
  std_energy: number;
  min_energy: number;
  max_energy: number;
  avg_coherence: number;
  std_coherence: number;
  trend: "increasing" | "decreasing" | "stable";
}

// ============================================================
// WEBSOCKET MESSAGE MODELS
// ============================================================

type ClientMessage = 
  | AuthMessage
  | SessionStartMessage
  | FrameMessage
  | SessionEndMessage
  | PingMessage;

type ServerMessage = 
  | AuthSuccessMessage
  | SessionStartedMessage
  | MetricsMessage
  | SessionEndedMessage
  | ErrorMessage
  | PongMessage;

interface AuthMessage {
  type: "auth";
  token: string;
}

interface SessionStartMessage {
  type: "session_start";
  settings: SessionSettings;
}

interface FrameMessage {
  type: "frame";
  payload: {
    timestamp: number;  // Unix milliseconds
    image_data: string;  // Base64 data URL
    sequence_number: number;
  };
}

interface SessionEndMessage {
  type: "session_end";
}

interface PingMessage {
  type: "ping";
}

interface AuthSuccessMessage {
  type: "auth_success";
  client_id: string;
  session_id: string | null;
}

interface SessionStartedMessage {
  type: "session_started";
  session_id: string;
  settings: SessionSettings;
  baseline?: {
    id: string;
    name: string;
  };
}

interface MetricsMessage {
  type: "metrics";
  payload: {
    timestamp: number;
    sequence_number: number;
    frame_id: string;
    metrics: Partial<AllMetrics>;
    scores: CompositeScores;
    baseline_comparison?: BaselineComparison;
  };
}

interface BaselineComparison {
  energy_delta: number;
  symmetry_delta: number;
  coherence_delta: number;
  complexity_delta: number;
  regulation_delta: number;
  colorBalance_delta: number;
  overall_alignment: number;  // 0-1
}

interface SessionEndedMessage {
  type: "session_ended";
  session_id: string;
  summary: SessionSummary;
}

interface SessionSummary {
  duration: number;  // seconds
  frame_count: number;
  avg_scores: CompositeScores;
  trends: {
    energy: "increasing" | "decreasing" | "stable";
    coherence: "increasing" | "decreasing" | "stable";
    regulation: "increasing" | "decreasing" | "stable";
  };
}

interface ErrorMessage {
  type: "error";
  error_code: string;
  message: string;
  severity: "info" | "warning" | "error" | "critical";
  recoverable: boolean;
}

interface PongMessage {
  type: "pong";
}
```

---

## Error Handling

### Error Response Format

All errors follow a consistent structure:

```json
{
  "status_code": 400,
  "detail": "Human-readable error message",
  "error_code": "MACHINE_READABLE_CODE",
  "timestamp": "2026-01-26T15:23:45.123Z",
  "request_id": "req_abc123"
}
```

### HTTP Status Codes

| Code | Meaning | Common Scenarios |
|------|---------|------------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid parameters, malformed request |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but lacks permission |
| `404` | Not Found | Resource doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side processing error |
| `503` | Service Unavailable | Server overloaded or maintenance |

### Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| `AUTH_REQUIRED` | No authentication provided | Provide Bearer token |
| `AUTH_INVALID` | Invalid or expired token | Refresh or re-authenticate |
| `INVALID_IMAGE_FORMAT` | Unsupported image format | Use JPEG, PNG, or BMP |
| `IMAGE_TOO_LARGE` | Image exceeds size limit | Resize to < 10MB |
| `ANALYSIS_FAILED` | Processing error occurred | Check image quality, retry |
| `BASELINE_NOT_FOUND` | Baseline ID doesn't exist | Verify ID or create new baseline |
| `SESSION_NOT_FOUND` | Session ID doesn't exist | Check session ID |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry after delay |
| `VALIDATION_ERROR` | Request validation failed | Check request format |
| `WEBSOCKET_ERROR` | WebSocket connection issue | Check connection, reconnect |

### Example Error Handling

**JavaScript/TypeScript:**

```typescript
async function analyzeImage(imageFile: File) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('mode', 'fullBody');
    formData.append('region', 'full');
    
    const response = await fetch('https://api.tryambakam-noesis.com/v1/biofield/api/analysis/capture', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      switch (error.error_code) {
        case 'AUTH_INVALID':
          await refreshToken();
          return analyzeImage(imageFile);  // Retry
        
        case 'RATE_LIMIT_EXCEEDED':
          await delay(5000);  // Wait 5 seconds
          return analyzeImage(imageFile);  // Retry
        
        case 'INVALID_IMAGE_FORMAT':
          throw new Error('Please use JPEG, PNG, or BMP format');
        
        default:
          throw new Error(error.detail);
      }
    }
    
    const result: AnalysisResponse = await response.json();
    return result;
    
  } catch (err) {
    console.error('Analysis failed:', err);
    throw err;
  }
}
```

**Python:**

```python
import requests
from typing import Optional

class BiofieldAPI:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.token = token
    
    def analyze_image(self, image_path: str, mode: str = "fullBody") -> dict:
        url = f"{self.base_url}/api/analysis/capture"
        headers = {"Authorization": f"Bearer {self.token}"}
        
        with open(image_path, 'rb') as f:
            files = {'image': f}
            data = {'mode': mode, 'region': 'full'}
            
            try:
                response = requests.post(url, headers=headers, files=files, data=data)
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.HTTPError as err:
                error_data = err.response.json()
                error_code = error_data.get('error_code')
                
                if error_code == 'AUTH_INVALID':
                    self.refresh_token()
                    return self.analyze_image(image_path, mode)  # Retry
                
                elif error_code == 'RATE_LIMIT_EXCEEDED':
                    time.sleep(5)
                    return self.analyze_image(image_path, mode)  # Retry
                
                else:
                    raise Exception(f"API Error: {error_data['detail']}")
```

---

## Rate Limiting

### Limits by Tier

| Tier | REST Requests/min | WS Connections | Frame Rate (fps) | Burst Allowance |
|------|-------------------|----------------|------------------|-----------------|
| **Free** | 30 | 1 | 10 | 50 |
| **Basic** | 120 | 2 | 30 | 200 |
| **Pro** | 600 | 5 | 60 | 1000 |
| **Enterprise** | Unlimited | Unlimited | Unlimited | N/A |

### Rate Limit Headers

Every response includes rate limit information:

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1706280300
```

### Handling Rate Limits

When rate limit is exceeded:

```json
{
  "status_code": 429,
  "detail": "Rate limit exceeded. Try again in 42 seconds.",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 42
}
```

**Best Practices:**

1. **Monitor headers** - Check `X-RateLimit-Remaining`
2. **Implement backoff** - Exponential backoff on 429 responses
3. **Batch requests** - Use batch endpoints when possible
4. **Cache results** - Don't re-analyze identical frames
5. **Upgrade tier** - If consistently hitting limits

---

## Code Examples

### Complete React Integration

```typescript
import React, { useState, useEffect, useRef } from 'react';

interface BiofieldScores {
  energy: number;
  symmetry: number;
  coherence: number;
  complexity: number;
  regulation: number;
  colorBalance: number;
}

const BiofieldDashboard: React.FC = () => {
  const [scores, setScores] = useState<BiofieldScores | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize WebSocket
  useEffect(() => {
    const token = localStorage.getItem('biofield_token');
    const ws = new WebSocket(`wss://api.tryambakam-noesis.com/v1/biofield/ws/realtime?token=${token}`);
    wsRef.current = ws;
    
    ws.onopen = () => {
      setConnected(true);
      
      // Start session
      ws.send(JSON.stringify({
        type: 'session_start',
        settings: {
          mode: 'fullBody',
          region: 'full',
          fps: 30
        }
      }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'metrics') {
        setScores(message.payload.scores);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };
    
    ws.onclose = () => {
      setConnected(false);
    };
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'session_end' }));
      }
      ws.close();
    };
  }, []);
  
  // Start video capture
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Start sending frames
        startFrameCapture();
      } catch (err) {
        console.error('Failed to start video:', err);
      }
    };
    
    startVideo();
  }, []);
  
  const startFrameCapture = () => {
    const captureFrame = () => {
      if (!videoRef.current || !canvasRef.current || !wsRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Draw video frame to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Send to WebSocket
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'frame',
          payload: {
            timestamp: Date.now(),
            image_data: imageData,
            sequence_number: Math.floor(Date.now() / 33)  // ~30fps
          }
        }));
      }
    };
    
    // Capture at 30fps
    setInterval(captureFrame, 33);
  };
  
  return (
    <div className="biofield-dashboard">
      <h1>Biofield Live Analysis</h1>
      
      <div className="connection-status">
        Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      {scores && (
        <div className="scores-grid">
          <div className="score-card">
            <h3>Energy</h3>
            <div className="score-value">{scores.energy.toFixed(1)}</div>
          </div>
          <div className="score-card">
            <h3>Symmetry</h3>
            <div className="score-value">{scores.symmetry.toFixed(1)}</div>
          </div>
          <div className="score-card">
            <h3>Coherence</h3>
            <div className="score-value">{scores.coherence.toFixed(1)}</div>
          </div>
          <div className="score-card">
            <h3>Complexity</h3>
            <div className="score-value">{scores.complexity.toFixed(1)}</div>
          </div>
          <div className="score-card">
            <h3>Regulation</h3>
            <div className="score-value">{scores.regulation.toFixed(1)}</div>
          </div>
          <div className="score-card">
            <h3>Color Balance</h3>
            <div className="score-value">{scores.colorBalance.toFixed(1)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiofieldDashboard;
```

### Python SDK Example

```python
import asyncio
import json
import base64
from typing import Optional, Callable
from pathlib import Path

import websockets
import requests
from PIL import Image
import io

class BiofieldClient:
    """
    Python SDK for Biofield API.
    """
    
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}'
        })
    
    # ========== REST API Methods ==========
    
    def analyze_image(
        self,
        image_path: str,
        mode: str = "fullBody",
        region: str = "full",
        pip_settings: Optional[dict] = None
    ) -> dict:
        """
        Analyze a single image.
        """
        url = f"{self.base_url}/api/analysis/capture"
        
        with open(image_path, 'rb') as f:
            files = {'image': f}
            data = {
                'mode': mode,
                'region': region
            }
            
            if pip_settings:
                data['pip_settings'] = json.dumps(pip_settings)
            
            response = self.session.post(url, files=files, data=data)
            response.raise_for_status()
            return response.json()
    
    def get_analysis(self, analysis_id: str) -> dict:
        """
        Retrieve a specific analysis.
        """
        url = f"{self.base_url}/api/analysis/{analysis_id}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def get_history(
        self,
        limit: int = 50,
        offset: int = 0,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> dict:
        """
        Get analysis history.
        """
        url = f"{self.base_url}/api/analysis/history"
        params = {
            'limit': limit,
            'offset': offset
        }
        
        if start_date:
            params['start_date'] = start_date
        if end_date:
            params['end_date'] = end_date
        
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    def create_baseline(
        self,
        session_id: str,
        name: Optional[str] = None
    ) -> dict:
        """
        Create a baseline from a session.
        """
        url = f"{self.base_url}/api/baseline/create"
        data = {'session_id': session_id}
        
        if name:
            data['name'] = name
        
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.json()
    
    def get_current_baseline(self) -> dict:
        """
        Get the current active baseline.
        """
        url = f"{self.base_url}/api/baseline/current"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def export_session(
        self,
        session_id: str,
        format: str = "json",
        output_path: Optional[str] = None
    ):
        """
        Export session data.
        """
        url = f"{self.base_url}/api/export/session/{session_id}"
        params = {'format': format}
        
        response = self.session.get(url, params=params, stream=True)
        response.raise_for_status()
        
        if output_path:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
        else:
            return response.json()
    
    # ========== WebSocket Methods ==========
    
    async def stream_analysis(
        self,
        video_source,
        on_metrics: Callable[[dict], None],
        mode: str = "fullBody",
        fps: int = 30
    ):
        """
        Stream real-time analysis via WebSocket.
        
        Args:
            video_source: Video capture source (OpenCV VideoCapture, etc.)
            on_metrics: Callback function for metrics updates
            mode: Analysis mode
            fps: Frame rate
        """
        ws_url = f"{self.base_url.replace('https', 'wss').replace('http', 'ws')}/ws/realtime"
        ws_url += f"?token={self.api_key}"
        
        async with websockets.connect(ws_url) as websocket:
            # Start session
            await websocket.send(json.dumps({
                'type': 'session_start',
                'settings': {
                    'mode': mode,
                    'region': 'full',
                    'fps': fps
                }
            }))
            
            # Wait for session started
            response = await websocket.recv()
            message = json.loads(response)
            
            if message['type'] != 'session_started':
                raise Exception(f"Failed to start session: {message}")
            
            session_id = message['session_id']
            print(f"Session started: {session_id}")
            
            frame_number = 0
            
            # Start capture loop
            try:
                while True:
                    # Capture frame from video source
                    ret, frame = video_source.read()
                    if not ret:
                        break
                    
                    # Convert to JPEG base64
                    pil_image = Image.fromarray(frame)
                    buffer = io.BytesIO()
                    pil_image.save(buffer, format='JPEG', quality=85)
                    image_base64 = base64.b64encode(buffer.getvalue()).decode()
                    
                    # Send frame
                    await websocket.send(json.dumps({
                        'type': 'frame',
                        'payload': {
                            'timestamp': int(asyncio.get_event_loop().time() * 1000),
                            'image_data': f'data:image/jpeg;base64,{image_base64}',
                            'sequence_number': frame_number
                        }
                    }))
                    
                    frame_number += 1
                    
                    # Receive metrics (non-blocking)
                    try:
                        response = await asyncio.wait_for(
                            websocket.recv(),
                            timeout=0.01
                        )
                        message = json.loads(response)
                        
                        if message['type'] == 'metrics':
                            on_metrics(message['payload'])
                    
                    except asyncio.TimeoutError:
                        pass  # No message yet, continue
                    
                    # Control frame rate
                    await asyncio.sleep(1.0 / fps)
            
            finally:
                # End session
                await websocket.send(json.dumps({'type': 'session_end'}))
                response = await websocket.recv()
                message = json.loads(response)
                
                if message['type'] == 'session_ended':
                    print(f"Session ended. Summary: {message['summary']}")


# ========== Usage Example ==========

async def main():
    client = BiofieldClient(
        base_url='https://api.tryambakam-noesis.com/v1/biofield',
        api_key='your_api_key_here'
    )
    
    # REST API: Analyze single image
    result = client.analyze_image(
        image_path='test_image.jpg',
        mode='fullBody',
        pip_settings={'threshold': 0.5}
    )
    
    print(f"Energy Score: {result['scores']['energy']}")
    print(f"Coherence Score: {result['scores']['coherence']}")
    
    # WebSocket: Stream real-time analysis
    import cv2
    
    video = cv2.VideoCapture(0)  # Webcam
    
    def handle_metrics(metrics):
        print(f"Frame {metrics['sequence_number']}: Energy={metrics['scores']['energy']:.1f}")
    
    await client.stream_analysis(
        video_source=video,
        on_metrics=handle_metrics,
        fps=30
    )
    
    video.release()


if __name__ == '__main__':
    asyncio.run(main())
```

---

## Caching Strategy

### Client-Side Caching

Recommended caching for common operations:

```typescript
class BiofieldAPIClient {
  private cache = new Map<string, { data: any; expires: number }>();
  private CACHE_TTL = 5 * 60 * 1000;  // 5 minutes
  
  async getAnalysis(analysisId: string): Promise<AnalysisResponse> {
    const cacheKey = `analysis:${analysisId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }
    
    const data = await this.fetchAnalysis(analysisId);
    
    this.cache.set(cacheKey, {
      data,
      expires: Date.now() + this.CACHE_TTL
    });
    
    return data;
  }
}
```

### Server-Side Caching

The API implements intelligent caching:

- **Baseline data**: Cached for 1 hour
- **Historical analysis**: Cached for 15 minutes
- **Real-time metrics**: No caching (always fresh)

---

## Conclusion

This API specification provides comprehensive access to the Biofield Engine's capabilities via both REST and WebSocket interfaces. The design prioritizes:

1. **Real-time performance** - WebSocket streaming for live analysis
2. **Ease of integration** - Clear TypeScript/Python interfaces
3. **Reliability** - Comprehensive error handling and rate limiting
4. **Flexibility** - Multiple analysis modes and export formats

**Related Documents:**
- `biofield-core-architecture.md` - Core system design
- `biofield-cross-engine-mappings.md` - Integration patterns
- `biofield-metrics-complete-reference.md` - Metrics catalog

---

*Tryambakam Noesis Biofield API*  
*Quantifying the Human Energy Field*
