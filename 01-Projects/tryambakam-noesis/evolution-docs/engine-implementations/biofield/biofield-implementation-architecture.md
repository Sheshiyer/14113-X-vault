# Biofield Implementation Architecture

**Version:** 2.0  
**Date:** January 2026  
**Source:** BV-PIP Production System  
**Purpose:** Complete technical architecture specification for biofield analysis system

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Processing Pipeline](#3-processing-pipeline)
4. [Data Models](#4-data-models)
5. [API Architecture](#5-api-architecture)
6. [Segmentation Strategies](#6-segmentation-strategies)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Backend Architecture](#8-backend-architecture)
9. [Performance Optimization](#9-performance-optimization)
10. [Deployment Architecture](#10-deployment-architecture)

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Video Input  │──│ PIP Shader   │──│  Real-Time Metrics       │  │
│  │  (WebRTC)     │  │ (WebGL2)     │  │  Extraction (JS/WASM)    │  │
│  └───────────────┘  └──────────────┘  └───────────┬──────────────┘  │
│                                                    │                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    React UI Dashboard                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │   │
│  │  │ Video Panel │ │ Score Cards │ │ Real-Time Charts        │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ WebSocket / REST API
┌────────────────────────────────┴────────────────────────────────────┐
│                         SERVER (Python)                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  FastAPI Server  │  │  Analysis Engine │  │  Data Storage    │   │
│  │  - REST API      │  │  - OpenCV        │  │  - PostgreSQL    │   │
│  │  - WebSocket     │  │  - NumPy/SciPy   │  │  - Redis Cache   │   │
│  │  │  - Auth          │  │  - scikit-image  │  │  - File Storage  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 System Boundaries

**Frontend Responsibilities:**
- Video capture and streaming
- PIP shader rendering (WebGL2)
- Real-time metric extraction (light metrics)
- Body/face segmentation (MediaPipe/TensorFlow.js)
- UI rendering and state management
- Local caching

**Backend Responsibilities:**
- Deep metric analysis (nonlinear dynamics)
- Composite score calculation
- Historical data storage and retrieval
- Baseline management
- Batch processing
- Export generation
- Authentication and authorization

### 1.3 Design Principles

1. **Progressive Enhancement:** Core features work client-side; server enhances with deep analysis
2. **Offline-First:** Essential functionality available without network
3. **Real-Time Feedback:** <100ms latency for visual feedback
4. **Scalability:** Handle 100+ concurrent users
5. **Privacy-First:** Optional server upload, client-side processing default
6. **Modular Architecture:** Loosely coupled components

---

## 2. Technology Stack

### 2.1 Frontend Stack

**Core Framework:**
```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0"
}
```

**State Management:**
```json
{
  "@reduxjs/toolkit": "^2.0.0",
  "zustand": "^4.4.0"
}
```

**3D/Graphics:**
```json
{
  "three": "^0.160.0",
  "react-three-fiber": "^8.15.0"
}
```

**ML/Segmentation:**
```json
{
  "@mediapipe/selfie_segmentation": "^0.1.0",
  "@mediapipe/face_mesh": "^0.4.0",
  "@tensorflow/tfjs": "^4.15.0"
}
```

**Image Processing:**
```json
{
  "opencv.js": "^4.8.0"
}
```

**Visualization:**
```json
{
  "recharts": "^2.10.0",
  "d3": "^7.8.0"
}
```

**WebWorkers:**
```json
{
  "workerize-loader": "^2.0.0",
  "comlink": "^4.4.0"
}
```

### 2.2 Backend Stack

**Core Framework:**
```python
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
python-multipart==0.0.6
```

**Image Processing:**
```python
opencv-python==4.9.0.80
numpy==1.26.3
scipy==1.12.0
scikit-image==0.22.0
Pillow==10.2.0
```

**ML/Segmentation:**
```python
mediapipe==0.10.9
```

**Nonlinear Dynamics:**
```python
nolds==0.5.2
```

**Database:**
```python
psycopg2-binary==2.9.9
sqlalchemy==2.0.25
alembic==1.13.1
redis==5.0.1
```

**Authentication:**
```python
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

### 2.3 Infrastructure

**Containerization:**
```yaml
docker: "^24.0"
docker-compose: "^2.23"
```

**Reverse Proxy:**
```
nginx: "^1.25"
```

**CI/CD:**
```yaml
github-actions: "workflows"
```

---

## 3. Processing Pipeline

### 3.1 Real-Time Pipeline (Frontend)

```
┌─────────────┐
│ Webcam Feed │
│  (WebRTC)   │
└──────┬──────┘
       │ 30 FPS
       ▼
┌─────────────────┐
│  PIP Shader     │
│  (WebGL2)       │
│  - Simplex noise│
│  - Color mapping│
│  - Blending     │
└──────┬──────────┘
       │ 30 FPS
       ├────────────────────────────────┐
       │                                │
       ▼                                ▼
┌────────────────┐            ┌──────────────────┐
│  Segmentation  │            │  Visual Display  │
│  (MediaPipe)   │            │  (Canvas)        │
│  - Body mask   │            └──────────────────┘
│  - Face mesh   │
└──────┬─────────┘
       │ 10-15 FPS (throttled)
       ▼
┌────────────────────┐
│  Metric Extraction │
│  (Web Worker)      │
│  - Basic metrics   │
│  - Color metrics   │
│  - Geometric       │
└──────┬─────────────┘
       │ 10-15 FPS
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌──────────────┐    ┌────────────────┐
│  UI Update   │    │  Send to       │
│  (React)     │    │  Backend       │
│  - Scores    │    │  (WebSocket)   │
│  - Charts    │    │  [Optional]    │
└──────────────┘    └────────────────┘
```

**Frame Processing Times:**
- PIP Shader: 2-5ms (GPU)
- Segmentation: 15-25ms (MediaPipe)
- Basic Metrics: 3-8ms (CPU)
- Color Metrics: 5-10ms (CPU)
- Total: ~30-50ms → 20-30 FPS achievable

### 3.2 Deep Analysis Pipeline (Backend)

```
┌───────────────┐
│  Captured     │
│  Image Upload │
│  (REST POST)  │
└───────┬───────┘
        │
        ▼
┌─────────────────────┐
│  Image Decoding     │
│  & Validation       │
│  - Format check     │
│  - Resolution check │
└───────┬─────────────┘
        │
        ▼
┌─────────────────────────┐
│  Segmentation           │
│  (MediaPipe Backend)    │
│  - Body segmentation    │
│  - Face detection       │
│  - Zone creation        │
└───────┬─────────────────┘
        │
        ├──────────────┬────────────┬──────────────┐
        │              │            │              │
        ▼              ▼            ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│Basic Metrics│ │  Color   │ │Geometric │ │  Nonlinear   │
│- Intensity  │ │  Metrics │ │ Metrics  │ │  Metrics     │
│- LQD        │ │- Hue     │ │- Contour │ │- Fractal dim │
│- Energy     │ │- Entropy │ │- EC/FC   │ │- Hurst exp   │
│- Area       │ │- Cohere  │ │- Ellipse │ │- Lyapunov    │
└─────┬───────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘
      │              │            │               │
      └──────────────┴────────────┴───────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Symmetry Metrics│
            │ - SSIM          │
            │ - Correlation   │
            │ - Balance       │
            └────────┬────────┘
                     │
                     ▼
            ┌──────────────────┐
            │ Composite Scores │
            │ - Energy         │
            │ - Coherence      │
            │ - Complexity     │
            │ - Regulation     │
            │ - Symmetry       │
            │ - Color Balance  │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │  Store Results   │
            │  - PostgreSQL    │
            │  - Redis cache   │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │  Return JSON     │
            │  Response        │
            └──────────────────┘
```

**Processing Times (640×480 image):**
- Image decode: <5ms
- Segmentation: 50-100ms
- Basic metrics: 5-10ms
- Color metrics: 15-25ms
- Geometric metrics: 20-30ms
- Nonlinear metrics: 200-500ms (bottleneck)
- Symmetry metrics: 30-50ms
- Score calculation: <5ms
- Database write: 10-20ms
- **Total: ~350-750ms**

### 3.3 Batch Processing Pipeline

```
┌──────────────────┐
│  Uploaded Files  │
│  (Multiple imgs) │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│  Task Queue          │
│  (Celery/Redis)      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Parallel Workers    │
│  (N workers)         │
│  Each processes 1 img│
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Aggregate Results   │
│  - Statistics        │
│  - Trends            │
│  - Export CSV/JSON   │
└──────────────────────┘
```

---

## 4. Data Models

### 4.1 Core Data Structures

**Analysis Result (Complete):**
```typescript
interface AnalysisResult {
  id: string;                    // UUID
  userId: string;                // User ID
  timestamp: string;             // ISO 8601
  mode: AnalysisMode;            // "fullBody" | "face" | "segmented"
  
  // Raw Metrics
  metrics: {
    basic: BasicMetrics;
    color: ColorMetrics;
    geometric: GeometricMetrics;
    nonlinear: NonlinearMetrics;
    symmetry: SymmetryMetrics;
    contour: ContourMetrics;
  };
  
  // Composite Scores
  scores: CompositeScores;
  
  // Segmentation Data
  segmentation: {
    bodyMask: string;            // Base64 encoded binary mask
    faceLandmarks?: FaceLandmarks;
    zones?: ZoneData;
    midlineX: number;
  };
  
  // Images
  images: {
    original: string;            // Base64 data URL
    pipProcessed: string;        // Base64 data URL
    segmentationOverlay?: string;
    zonesOverlay?: string;
  };
  
  // Metadata
  metadata: {
    resolution: { width: number; height: number };
    processingTime: number;      // milliseconds
    clientVersion: string;
    serverVersion: string;
    pipSettings?: PIPSettings;
  };
  
  // Optional Baseline Comparison
  baselineComparison?: {
    baselineId: string;
    deviations: Record<string, number>;
  };
}
```

**Basic Metrics:**
```typescript
interface BasicMetrics {
  avgIntensity: number;          // 0-255
  intensityStdDev: number;       // 0-255
  maxIntensity: number;          // 0-255
  minIntensity: number;          // 0-255
  lightQuantaDensity: number;    // 0-1
  normalizedArea: number;        // 0-1
  innerNoise: number;            // 0-255
  innerNoisePercent: number;     // 0-100
  energy: number;                // Absolute value
  pixelCount: number;            // Integer
}
```

**Color Metrics:**
```typescript
interface ColorMetrics {
  dominantHue: number;           // 0-360 degrees
  meanSaturation: number;        // 0-255
  meanValue: number;             // 0-255
  colorEntropy: number;          // 0-15 bits
  colorCoherence: number;        // 0-1
  hueDistribution: number[];     // 30 bins
  saturationDistribution: number[]; // 32 bins
  valueDistribution: number[];   // 32 bins
}
```

**Geometric Metrics:**
```typescript
interface GeometricMetrics {
  area: number;                  // pixels²
  perimeter: number;             // pixels
  innerContourLength: number;    // pixels
  innerContourRadius: number;    // pixels
  ellipseMajor: number;          // pixels
  ellipseMinor: number;          // pixels
  ellipseAngle: number;          // degrees
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  entropyCoefficient: number;    // ≥1.0
  formCoefficient: number;       // ≥1.0
  solidity: number;              // 0-1
  aspectRatio: number;           // width/height
}
```

**Nonlinear Metrics:**
```typescript
interface NonlinearMetrics {
  fractalDimension: number;      // 1.0-2.0
  hurstExponent: number;         // 0-1
  lyapunovExponent: number;      // Typically -0.5 to +0.5
  correlationDimension: number;  // 1.0-10.0
  dfaAlpha: number;              // 0-2.0
  sampleEntropy: number;         // 0-3
}
```

**Symmetry Metrics:**
```typescript
interface SymmetryMetrics {
  bodySymmetry: number;          // 0-1 (composite)
  ssimSymmetry: number;          // 0-1
  correlationSymmetry: number;   // 0-1
  histogramSymmetry: number;     // 0-1
  colorSymmetry: number;         // 0-1
  pixelSymmetry: number;         // 0-1
  contourBalance: number;        // 0-1
  midlineX: number;              // pixels
}
```

**Contour Metrics:**
```typescript
interface ContourMetrics {
  contourArea: number;           // pixels²
  contourPerimeter: number;      // pixels
  innerContourLength: number;    // pixels
  outerContourLength: number;    // pixels
  equivalentRadius: number;      // pixels
  entropyCoefficient: number;    // ≥1.0
  formCoefficient: number;       // ≥1.0
  contourComplexity: number;     // Normalized 0-10
  solidity: number;              // 0-1
  convexity: number;             // 0-1
  ellipseMajorAxis: number;      // pixels
  ellipseMinorAxis: number;      // pixels
  ellipseEccentricity: number;   // 0-1
  ellipseAngle: number;          // degrees
  numContours: number;           // Integer
  numInnerContours: number;      // Integer
}
```

**Composite Scores:**
```typescript
interface CompositeScores {
  energy: number;                // 0-100
  coherence: number;             // 0-100
  complexity: number;            // 0-100
  regulation: number;            // 0-100
  symmetry: number;              // 0-100
  colorBalance: number;          // 0-100
  integration?: number;          // 0-100 (meta-score)
}
```

### 4.2 Database Schema (PostgreSQL)

**Users Table:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**Analyses Table:**
```sql
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT NOW(),
    mode VARCHAR(50) NOT NULL,
    
    -- Metrics (JSONB for flexibility)
    metrics JSONB NOT NULL,
    scores JSONB NOT NULL,
    segmentation JSONB,
    metadata JSONB,
    
    -- Image references (store in file system)
    original_image_path VARCHAR(500),
    pip_image_path VARCHAR(500),
    
    -- Baseline reference
    baseline_id UUID REFERENCES baselines(id),
    
    -- Indexing for fast queries
    energy_score INT,
    coherence_score INT,
    complexity_score INT,
    regulation_score INT,
    symmetry_score INT,
    color_balance_score INT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analyses_user_timestamp ON analyses(user_id, timestamp DESC);
CREATE INDEX idx_analyses_energy ON analyses(energy_score);
CREATE INDEX idx_analyses_baseline ON analyses(baseline_id);
```

**Baselines Table:**
```sql
CREATE TABLE baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Averaged metrics from multiple analyses
    avg_metrics JSONB NOT NULL,
    std_metrics JSONB NOT NULL,
    
    -- Analysis IDs that contributed to baseline
    analysis_ids UUID[] NOT NULL,
    num_analyses INT NOT NULL,
    
    date_range_start TIMESTAMP NOT NULL,
    date_range_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_baselines_user ON baselines(user_id);
```

**Sessions Table (Real-Time Tracking):**
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP DEFAULT NOW(),
    end_time TIMESTAMP,
    duration_seconds INT,
    
    -- Session metadata
    device_info JSONB,
    pip_settings JSONB,
    
    -- Aggregated stats
    avg_scores JSONB,
    score_variability JSONB,
    num_captures INT DEFAULT 0
);

CREATE INDEX idx_sessions_user_time ON sessions(user_id, start_time DESC);
```

### 4.3 Redis Cache Structure

**Real-Time Metrics Cache:**
```
Key: user:{userId}:realtime:metrics
TTL: 300 seconds (5 minutes)
Value: JSON {
  timestamp: number,
  metrics: RealTimeMetrics,
  scores: CompositeScores
}
```

**Active Session Cache:**
```
Key: user:{userId}:session:{sessionId}
TTL: 3600 seconds (1 hour)
Value: JSON {
  sessionId: string,
  startTime: number,
  metricsHistory: Array<{timestamp, metrics, scores}>
}
```

**Baseline Cache:**
```
Key: user:{userId}:baseline:active
TTL: 86400 seconds (24 hours)
Value: JSON BaselineData
```

---

## 5. API Architecture

### 5.1 REST API Endpoints

**Authentication:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

**Analysis:**
```
POST   /api/v1/analysis/capture
       Body: multipart/form-data {image: File, mode: string}
       Response: AnalysisResult

GET    /api/v1/analysis/{id}
       Response: AnalysisResult

GET    /api/v1/analysis/list
       Query: ?userId={id}&from={timestamp}&to={timestamp}&limit=50
       Response: AnalysisResult[]

DELETE /api/v1/analysis/{id}
       Response: {success: boolean}
```

**Baseline:**
```
POST   /api/v1/baseline/create
       Body: {analysisIds: string[], name: string}
       Response: BaselineData

GET    /api/v1/baseline/{id}
       Response: BaselineData

GET    /api/v1/baseline/list
       Query: ?userId={id}
       Response: BaselineData[]

PUT    /api/v1/baseline/{id}
       Body: {name: string, description: string}
       Response: BaselineData

DELETE /api/v1/baseline/{id}
       Response: {success: boolean}
```

**Export:**
```
GET    /api/v1/export/csv
       Query: ?analysisIds={id1,id2,...}&format=csv
       Response: text/csv

GET    /api/v1/export/json
       Query: ?analysisIds={id1,id2,...}
       Response: application/json

GET    /api/v1/export/pdf
       Query: ?analysisId={id}
       Response: application/pdf
```

**Session Management:**
```
POST   /api/v1/session/start
       Body: {deviceInfo: object, pipSettings: object}
       Response: {sessionId: string}

PUT    /api/v1/session/{sessionId}/end
       Response: SessionSummary

GET    /api/v1/session/{sessionId}
       Response: SessionData
```

### 5.2 WebSocket Protocol

**Connection:**
```
ws://localhost:8000/ws/realtime?userId={id}&token={jwt}
```

**Client → Server Messages:**

```typescript
// Start real-time streaming
{
  type: "start",
  settings: PIPSettings
}

// Send frame data for analysis
{
  type: "frame",
  data: {
    image: string,        // Base64 encoded
    timestamp: number,
    segmentationMask?: string
  }
}

// Stop streaming
{
  type: "stop"
}

// Update settings
{
  type: "updateSettings",
  settings: Partial<PIPSettings>
}
```

**Server → Client Messages:**

```typescript
// Metrics update
{
  type: "metrics",
  data: {
    timestamp: number,
    metrics: RealTimeMetrics,
    scores: CompositeScores
  }
}

// Error
{
  type: "error",
  message: string,
  code: string
}

// Connection acknowledged
{
  type: "connected",
  sessionId: string
}
```

### 5.3 API Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-01-15T12:00:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Image resolution must be at least 480x480",
    "details": { ... }
  },
  "timestamp": "2026-01-15T12:00:00Z"
}
```

**Error Codes:**
```
AUTH_REQUIRED          - 401
FORBIDDEN              - 403
NOT_FOUND              - 404
VALIDATION_ERROR       - 400
RATE_LIMIT_EXCEEDED    - 429
INTERNAL_ERROR         - 500
SEGMENTATION_FAILED    - 422
PROCESSING_TIMEOUT     - 504
```

---

## 6. Segmentation Strategies

### 6.1 MediaPipe Body Segmentation

**Model Selection:**
```python
# backend/core/segmentation/body.py
class BodySegmenter:
    def __init__(self, model_selection: int = 1):
        """
        model_selection:
          0: General - faster, less accurate
          1: Landscape - slower, more accurate (RECOMMENDED)
        """
        self.mp_selfie = mp.solutions.selfie_segmentation
        self.segmenter = self.mp_selfie.SelfieSegmentation(
            model_selection=model_selection
        )
```

**Processing Flow:**
```python
def segment(self, image: np.ndarray) -> Dict[str, Any]:
    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process
    results = self.segmenter.process(image_rgb)
    
    # Get mask (0-1 float, threshold for binary)
    mask_float = results.segmentation_mask
    mask_binary = (mask_float > 0.5).astype(np.uint8) * 255
    
    # Calculate bounding box and centroid
    contours, _ = cv2.findContours(
        mask_binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    
    if contours:
        largest = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest)
        bounding_box = {'x': x, 'y': y, 'width': w, 'height': h}
        body_area = cv2.contourArea(largest)
        
        # Centroid
        M = cv2.moments(largest)
        if M['m00'] > 0:
            cx = int(M['m10'] / M['m00'])
            cy = int(M['m01'] / M['m00'])
        else:
            cx, cy = x + w // 2, y + h // 2
    
    return {
        'mask_binary': mask_binary,
        'mask_confidence': mask_float,
        'bounding_box': bounding_box,
        'centroid': {'x': cx, 'y': cy},
        'body_area': body_area,
        'body_detected': len(contours) > 0
    }
```

**Performance:**
- Processing time: 50-100ms per frame (CPU)
- Accuracy: >95% for clear body images
- Works in varied lighting conditions

### 6.2 Face Detection & Landmarks

**MediaPipe Face Mesh:**
```python
# backend/core/segmentation/face.py
class FaceDetector:
    def __init__(self, max_faces: int = 1):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=max_faces,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
    
    def detect(self, image: np.ndarray) -> Dict[str, Any]:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(image_rgb)
        
        if not results.multi_face_landmarks:
            return {'face_detected': False}
        
        landmarks = results.multi_face_landmarks[0]
        
        # Extract key points
        h, w = image.shape[:2]
        points = []
        for lm in landmarks.landmark:
            points.append({
                'x': int(lm.x * w),
                'y': int(lm.y * h),
                'z': lm.z
            })
        
        # Calculate face bounding box
        xs = [p['x'] for p in points]
        ys = [p['y'] for p in points]
        face_bbox = {
            'x': min(xs),
            'y': min(ys),
            'width': max(xs) - min(xs),
            'height': max(ys) - min(ys)
        }
        
        return {
            'face_detected': True,
            'landmarks': points,
            'bounding_box': face_bbox,
            'num_landmarks': len(points)
        }
```

**468 Landmark Points:**
- Contour: 0-16 (oval)
- Eyebrows: 17-26, 27-36
- Eyes: 37-47 (left), 48-59 (right)
- Nose: 60-79
- Mouth: 80-96 (outer), 97-108 (inner)
- Face oval: 109-127

### 6.3 Anatomical Zone Creation

**Zone Definitions (Body):**
```python
# backend/core/segmentation/zones.py
class ZoneCreator:
    BODY_ZONES = {
        'head': (0, 0.15),       # Top 15%
        'chest': (0.15, 0.40),   # 15-40%
        'abdomen': (0.40, 0.60), # 40-60%
        'pelvis': (0.60, 0.75),  # 60-75%
        'legs': (0.75, 1.0)      # 75-100%
    }
    
    def create_zones(self, body_mask: np.ndarray, 
                     body_bbox: Dict) -> Dict[str, np.ndarray]:
        """Create anatomical zone masks."""
        h, w = body_mask.shape
        bbox_top = body_bbox['y']
        bbox_height = body_bbox['height']
        
        zones = {}
        for zone_name, (start_pct, end_pct) in self.BODY_ZONES.items():
            zone_mask = np.zeros_like(body_mask)
            
            y_start = int(bbox_top + start_pct * bbox_height)
            y_end = int(bbox_top + end_pct * bbox_height)
            
            zone_mask[y_start:y_end, :] = body_mask[y_start:y_end, :]
            zones[zone_name] = zone_mask
        
        return zones
```

**Left-Right Zone Splitting:**
```python
def split_left_right(self, mask: np.ndarray, 
                     midline_x: int) -> Tuple[np.ndarray, np.ndarray]:
    """Split mask into left and right halves."""
    left_mask = mask.copy()
    left_mask[:, midline_x:] = 0
    
    right_mask = mask.copy()
    right_mask[:, :midline_x] = 0
    
    return left_mask, right_mask
```

**Chakra Zone Mapping:**
```python
CHAKRA_ZONES = {
    'crown': (0, 0.08),        # Top of head
    'third_eye': (0.08, 0.12), # Forehead
    'throat': (0.12, 0.18),    # Throat
    'heart': (0.25, 0.35),     # Chest center
    'solar_plexus': (0.35, 0.45), # Upper abdomen
    'sacral': (0.50, 0.60),    # Lower abdomen
    'root': (0.65, 0.75)       # Pelvic floor
}
```

---

## 7. Frontend Architecture

### 7.1 Component Structure

```
src/
├── components/
│   ├── Video/
│   │   ├── PIPCanvas.tsx         # WebGL2 shader rendering
│   │   ├── VideoControls.tsx     # Capture, pause, settings
│   │   └── PIPSettings.tsx       # Shader parameter UI
│   ├── Metrics/
│   │   ├── ScoreCard.tsx         # Individual score display
│   │   ├── MetricsDashboard.tsx  # All scores layout
│   │   └── RealtimeChart.tsx     # Time-series visualization
│   ├── Analysis/
│   │   ├── CaptureModal.tsx      # Detailed analysis view
│   │   ├── SegmentationView.tsx  # Overlay visualizations
│   │   └── ZoneAnalysis.tsx      # Per-zone metrics
│   ├── Baseline/
│   │   ├── BaselineManager.tsx   # CRUD operations
│   │   └── BaselineComparison.tsx # Deviation visualization
│   └── Export/
│       ├── ExportDialog.tsx      # Format selection
│       └── ReportGenerator.tsx   # PDF/CSV generation
├── workers/
│   ├── metrics.worker.ts         # Metric calculation worker
│   └── segmentation.worker.ts    # MediaPipe worker
├── services/
│   ├── api.ts                    # REST API client
│   ├── websocket.ts              # WebSocket client
│   └── storage.ts                # IndexedDB wrapper
├── state/
│   ├── videoSlice.ts             # Video state
│   ├── metricsSlice.ts           # Metrics state
│   └── authSlice.ts              # Authentication state
├── shaders/
│   ├── pip.vert.glsl             # Vertex shader
│   └── pip.frag.glsl             # Fragment shader (PIP logic)
└── utils/
    ├── imageProcessing.ts        # OpenCV.js wrappers
    └── calculations.ts           # Metric calculations
```

### 7.2 State Management (Redux Toolkit)

**Video Slice:**
```typescript
// state/videoSlice.ts
interface VideoState {
  stream: MediaStream | null;
  isPlaying: boolean;
  isPaused: boolean;
  resolution: { width: number; height: number };
  pipSettings: PIPSettings;
}

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setStream(state, action: PayloadAction<MediaStream>) {
      state.stream = action.payload;
    },
    togglePause(state) {
      state.isPaused = !state.isPaused;
    },
    updatePIPSettings(state, action: PayloadAction<Partial<PIPSettings>>) {
      state.pipSettings = { ...state.pipSettings, ...action.payload };
    }
  }
});
```

**Metrics Slice:**
```typescript
// state/metricsSlice.ts
interface MetricsState {
  current: RealTimeMetrics | null;
  history: MetricsHistoryEntry[];
  maxHistoryLength: number;
  scores: CompositeScores | null;
}

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    updateMetrics(state, action: PayloadAction<RealTimeMetrics>) {
      state.current = action.payload;
      state.history.push({
        timestamp: Date.now(),
        metrics: action.payload
      });
      if (state.history.length > state.maxHistoryLength) {
        state.history.shift();
      }
    },
    updateScores(state, action: PayloadAction<CompositeScores>) {
      state.scores = action.payload;
    }
  }
});
```

### 7.3 Web Workers Architecture

**Metrics Worker:**
```typescript
// workers/metrics.worker.ts
import * as Comlink from 'comlink';

class MetricsCalculator {
  calculateBasicMetrics(imageData: ImageData, mask?: ImageData): BasicMetrics {
    // OpenCV.js operations
    const src = cv.matFromImageData(imageData);
    
    // ... metric calculations
    
    return metrics;
  }
  
  calculateColorMetrics(imageData: ImageData, mask?: ImageData): ColorMetrics {
    // ...
  }
}

Comlink.expose(new MetricsCalculator());
```

**Usage in Component:**
```typescript
// components/Video/PIPCanvas.tsx
const metricsWorker = new Worker(
  new URL('../workers/metrics.worker.ts', import.meta.url)
);
const metricsCalculator = Comlink.wrap<MetricsCalculator>(metricsWorker);

const processFrame = async (imageData: ImageData) => {
  const metrics = await metricsCalculator.calculateBasicMetrics(imageData);
  dispatch(updateMetrics(metrics));
};
```

---

## 8. Backend Architecture

### 8.1 Project Structure

```
backend/
├── api/
│   ├── __init__.py
│   ├── main.py                   # FastAPI app initialization
│   ├── dependencies.py           # Dependency injection
│   └── routes/
│       ├── __init__.py
│       ├── analysis.py           # Analysis endpoints
│       ├── baseline.py           # Baseline endpoints
│       ├── capture.py            # Image capture endpoints
│       ├── export.py             # Export endpoints
│       └── websocket.py          # WebSocket handlers
├── core/
│   ├── __init__.py
│   ├── metrics/
│   │   ├── __init__.py
│   │   ├── basic.py              # Basic intensity metrics
│   │   ├── color.py              # Color analysis
│   │   ├── geometric.py          # Shape metrics
│   │   ├── nonlinear.py          # Chaos/fractal metrics
│   │   ├── symmetry.py           # Symmetry analysis
│   │   └── contour.py            # Contour metrics
│   ├── scores/
│   │   ├── __init__.py
│   │   ├── energy.py             # Energy score
│   │   ├── coherence.py          # Coherence score
│   │   ├── complexity.py         # Complexity score
│   │   ├── regulation.py         # Regulation score
│   │   ├── symmetry.py           # Symmetry score
│   │   └── color_balance.py      # Color balance score
│   ├── segmentation/
│   │   ├── __init__.py
│   │   ├── body.py               # MediaPipe body segmentation
│   │   ├── face.py               # MediaPipe face detection
│   │   └── zones.py              # Zone creation logic
│   └── entrainment/
│       ├── __init__.py
│       ├── audio_generator.py    # Binaural beats generation
│       └── visual_generator.py   # Visual entrainment patterns
├── db/
│   ├── __init__.py
│   ├── database.py               # Database connection
│   ├── models.py                 # SQLAlchemy models
│   └── schemas.py                # Pydantic schemas
├── services/
│   ├── __init__.py
│   ├── analysis_service.py       # Analysis orchestration
│   ├── baseline_service.py       # Baseline management
│   └── export_service.py         # Export generation
└── utils/
    ├── __init__.py
    ├── image_utils.py            # Image manipulation
    └── validation.py             # Input validation
```

### 8.2 Analysis Service Pattern

```python
# services/analysis_service.py
class AnalysisService:
    def __init__(self):
        self.basic_metrics = BasicMetrics()
        self.color_metrics = ColorMetrics()
        self.geometric_metrics = GeometricMetrics()
        self.contour_metrics = ContourMetrics()
        self.nonlinear_metrics = NonlinearMetrics()
        self.symmetry_metrics = SymmetryMetrics()
        
        self.energy_calc = EnergyScoreCalculator()
        self.coherence_calc = CoherenceScoreCalculator()
        self.complexity_calc = ComplexityScoreCalculator()
        self.regulation_calc = RegulationScoreCalculator()
        self.symmetry_calc = SymmetryScoreCalculator()
        self.color_balance_calc = ColorBalanceScoreCalculator()
        
        self.body_segmenter = BodySegmenter()
        self.zone_creator = ZoneCreator()
    
    async def analyze_image(
        self, 
        image: np.ndarray, 
        mode: str = "fullBody"
    ) -> AnalysisResult:
        """
        Main analysis orchestration.
        """
        # 1. Segmentation
        segmentation = self.body_segmenter.segment(image)
        mask = segmentation['mask_binary']
        
        # 2. Calculate metrics in parallel (using asyncio)
        basic = await asyncio.to_thread(
            self.basic_metrics.calculate_all, image, mask
        )
        color = await asyncio.to_thread(
            self.color_metrics.calculate_all, image, mask
        )
        # ... other metrics
        
        # 3. Calculate scores
        scores = {
            'energy': self.energy_calc.calculate(basic),
            'coherence': self.coherence_calc.calculate(nonlinear),
            # ...
        }
        
        # 4. Package results
        return AnalysisResult(
            id=str(uuid.uuid4()),
            timestamp=datetime.utcnow().isoformat(),
            mode=mode,
            metrics={
                'basic': basic,
                'color': color,
                # ...
            },
            scores=scores,
            segmentation=segmentation
        )
```

---

## 9. Performance Optimization

### 9.1 Frontend Optimizations

**Throttling Frame Processing:**
```typescript
const PROCESSING_FPS = 15;  // Process 15 frames per second
let lastProcessTime = 0;

const onFrame = (timestamp: number) => {
  if (timestamp - lastProcessTime >= 1000 / PROCESSING_FPS) {
    processFrame();
    lastProcessTime = timestamp;
  }
  requestAnimationFrame(onFrame);
};
```

**Downsampling for Expensive Operations:**
```typescript
const downsampleForMetrics = (imageData: ImageData) => {
  const targetWidth = 320;
  const targetHeight = 240;
  
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;
  
  ctx.drawImage(imageData, 0, 0, targetWidth, targetHeight);
  return ctx.getImageData(0, 0, targetWidth, targetHeight);
};
```

**Web Worker Pool:**
```typescript
class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{task: Task; resolve: Function}> = [];
  
  constructor(workerCount: number = 4) {
    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker(new URL('./worker.ts', import.meta.url));
      this.workers.push(worker);
    }
  }
  
  async execute(task: Task): Promise<Result> {
    // ... pool management logic
  }
}
```

### 9.2 Backend Optimizations

**Async Processing:**
```python
# Use asyncio for I/O-bound operations
async def process_multiple_images(images: List[np.ndarray]):
    tasks = [analyze_image(img) for img in images]
    results = await asyncio.gather(*tasks)
    return results
```

**Caching:**
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_baseline(baseline_id: str) -> BaselineData:
    # Cache frequently accessed baselines
    return db.query(Baseline).filter(id=baseline_id).first()
```

**Database Query Optimization:**
```python
# Use indexes
session.query(Analysis).filter(
    Analysis.user_id == user_id,
    Analysis.timestamp >= start_date
).order_by(Analysis.timestamp.desc()).limit(100)

# Eager loading with relationships
session.query(Analysis).options(
    joinedload(Analysis.user)
).filter(...)
```

---

## 10. Deployment Architecture

### 10.1 Container Setup

**Docker Compose:**
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/biofield
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=biofield
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  pgdata:
```

### 10.2 Scaling Strategy

**Horizontal Scaling:**
```
                    ┌─── Frontend Instance 1
Load Balancer ──────┼─── Frontend Instance 2
(Nginx)             └─── Frontend Instance 3
    │
    ├── Backend Instance 1 ────┐
    ├── Backend Instance 2 ────┼── PostgreSQL (Primary)
    └── Backend Instance 3 ────┘
```

**Resource Allocation:**
- Frontend: 512MB RAM, 0.5 CPU
- Backend: 2GB RAM, 1 CPU (nonlinear metrics are CPU-intensive)
- Database: 4GB RAM, 2 CPU
- Redis: 512MB RAM, 0.5 CPU

---

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Maintainer:** Tryambakam Noesis Team  
**Production Status:** Deployed

*Complete implementation architecture extracted from BV-PIP production system.*
