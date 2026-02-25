# Face Reading API Specification

## API Overview

The Face Reading Engine provides a comprehensive API for biometric facial analysis integrated with traditional Chinese physiognomy.

## Input Data Model

### FaceReadingInput

Complete input specification with privacy controls.

```python
class FaceReadingInput(CloudflareEngineInput, BirthDataInput):
    """Input model for Face Reading Engine."""
    
    # === REQUIRED FIELDS ===
    
    user_id: str
    # Unique user identifier
    
    birth_date: Union[str, date]
    # Format: "YYYY-MM-DD" or date object
    # Required for age point mapping
    
    processing_consent: bool = False
    # MUST be True - explicit consent for biometric processing
    # Raises ValueError if False
    
    # === IMAGE/VIDEO DATA ===
    
    image_data: Optional[str] = None
    # Base64 encoded image data
    # Formats: JPEG, PNG, WebP
    # Minimum resolution: 640x480
    # Example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    
    video_data: Optional[str] = None
    # Base64 encoded video data (for video mode)
    # Formats: MP4, WebM
    
    analysis_mode: Literal["photo", "video", "live"] = "photo"
    # Analysis mode selection
    # - "photo": Single image analysis (default)
    # - "video": Video file processing
    # - "live": Real-time camera (implementation-specific)
    
    # === ANALYSIS CONFIGURATION ===
    
    analysis_depth: Literal["basic", "detailed", "comprehensive"] = "detailed"
    # Analysis depth level:
    # - "basic": Landmarks + Five Elements only
    # - "detailed": Adds 12 Houses + Age Points (default)
    # - "comprehensive": Full analysis with all integrations
    
    include_twelve_houses: bool = True
    # Include 12 Houses traditional analysis
    
    include_five_elements: bool = True
    # Include Five Elements constitution
    
    include_age_points: bool = True
    # Include age point temporal mapping
    
    include_health_indicators: bool = True
    # Include TCM health correlations
    
    # === INTEGRATION OPTIONS ===
    
    integrate_with_vedic: bool = True
    # Integrate with Vedic astrology data (if available)
    
    integrate_with_tcm: bool = True
    # Integrate with TCM organ clock
    
    # === PRIVACY SETTINGS ===
    
    store_biometric_data: bool = False
    # Store facial landmarks (privacy consideration)
    
    anonymize_results: bool = True
    # Anonymize analysis results for storage
    
    max_retention_hours: int = 24
    # Maximum data retention period in hours
    
    biometric_config: Optional[BiometricDataConfig] = Field(
        default_factory=BiometricDataConfig
    )
    # Detailed biometric data handling configuration
```

### BiometricDataConfig

```python
class BiometricDataConfig(BaseModel):
    """Configuration for biometric data handling."""
    
    encrypt_at_rest: bool = True
    # Encrypt stored biometric data
    
    anonymize: bool = True
    # Remove identifying information from stored data
    
    allow_analytics: bool = False
    # Allow anonymized data for analytics
    
    retention_hours: int = 24
    # Data retention period
    
    auto_delete: bool = True
    # Automatically delete after retention period
    
    audit_access: bool = True
    # Log all biometric data access
```

## Output Data Model

### FaceReadingOutput

Complete output specification with all analysis results.

```python
class FaceReadingOutput(CloudflareEngineOutput):
    """Complete Face Reading Engine output."""
    
    # === CORE ANALYSIS RESULTS ===
    
    facial_landmarks: FacialLandmarks
    # MediaPipe 468-point facial mesh data
    
    twelve_houses: TwelveHousesAnalysis
    # Traditional 12 Houses analysis
    
    five_elements: FiveElementsConstitution
    # Five Elements constitutional typing
    
    age_points: AgePointMapping
    # Age point temporal insights
    
    biometric_integration: BiometricIntegration
    # Cross-engine integration data
    
    # === INTERPRETATIONS ===
    
    constitutional_summary: str
    # Overall constitutional analysis summary
    
    personality_insights: List[str]
    # Personality insights from facial features
    
    health_recommendations: List[str]
    # Health optimization recommendations
    
    # === TEMPORAL ANALYSIS ===
    
    current_life_phase: str
    # Current life phase based on age points
    
    optimal_timing: List[str]
    # Optimal timing for various activities
    
    # === INTEGRATION INSIGHTS ===
    
    multi_modal_recommendations: List[str]
    # Recommendations combining multiple systems
    
    consciousness_optimization: List[str]
    # Consciousness development recommendations
    
    # === METADATA ===
    
    processing_timestamp: str
    # ISO 8601 timestamp of analysis
    
    privacy_compliance: Dict[str, bool]
    # Privacy compliance indicators
    
    cultural_context: List[str]
    # Cultural context and educational information
```

### Nested Data Models

#### FacialLandmarks

```python
class FacialLandmarks(BaseModel):
    """MediaPipe facial landmarks data."""
    
    total_landmarks: int
    # Total number of detected landmarks (typically 468)
    
    key_points: Dict[str, Tuple[float, float]]
    # Key facial points (normalized 0-1)
    # Example: {"forehead_center": (0.5, 0.2), "nose_tip": (0.5, 0.55)}
    
    face_bounds: Dict[str, float]
    # Face bounding box coordinates (normalized 0-1)
    # Keys: "left", "right", "top", "bottom", "width", "height"
    
    detection_confidence: float
    # Face detection confidence score (0-1)
```

#### TwelveHousesAnalysis

```python
class TwelveHousesAnalysis(BaseModel):
    """Traditional Chinese 12 Houses facial analysis."""
    
    # Each house contains:
    # - area: str (facial region)
    # - strength: float (quality score 0-1)
    # - harmony_score: float (balance score 0-1)
    # - interpretation: str (traditional meaning)
    # - indicators: Dict (specific measurements)
    
    ming_gong: Dict[str, Any]              # 命宫 Life Palace
    cai_bo_gong: Dict[str, Any]            # 財帛宫 Wealth Palace
    xiong_di_gong: Dict[str, Any]          # 兄弟宫 Siblings Palace
    tian_zhai_gong: Dict[str, Any]         # 田宅宫 Property Palace
    nan_nv_gong: Dict[str, Any]            # 男女宫 Children Palace
    nu_pu_gong: Dict[str, Any]             # 奴僕宫 Servants Palace
    qi_qie_gong: Dict[str, Any]            # 妻妾宫 Spouse Palace
    ji_e_gong: Dict[str, Any]              # 疾厄宫 Health Palace
    qian_yi_gong: Dict[str, Any]           # 遷移宫 Travel Palace
    guan_lu_gong: Dict[str, Any]           # 官祿宫 Career Palace
    fu_de_gong: Dict[str, Any]             # 福德宫 Fortune Palace
    xiang_mao_gong: Dict[str, Any]         # 相貌宫 Appearance Palace
    
    overall_harmony: float
    # Overall facial harmony score (0-1)
    
    dominant_houses: List[str]
    # Most prominent houses (strength > 0.7)
```

#### FiveElementsConstitution

```python
class FiveElementsConstitution(BaseModel):
    """Five Elements constitutional analysis."""
    
    wood_percentage: float              # 0-100
    fire_percentage: float              # 0-100
    earth_percentage: float             # 0-100
    metal_percentage: float             # 0-100
    water_percentage: float             # 0-100
    # Percentages sum to 100
    
    dominant_element: str
    # Primary constitutional element: "Wood", "Fire", "Earth", "Metal", "Water"
    
    secondary_element: str
    # Secondary constitutional element
    
    constitutional_type: str
    # Traditional classification (e.g., "Wood-Fire Constitution (Dynamic Achiever)")
    
    temperament_indicators: List[str]
    # Personality indicators from facial features
    
    health_tendencies: List[str]
    # Health predispositions based on constitution
```

#### AgePointMapping

```python
class AgePointMapping(BaseModel):
    """Traditional age point mapping on facial features."""
    
    current_age_point: int
    # Current age point location (user's age)
    
    age_point_location: str
    # Facial area of current age point
    # Values: "upper_forehead", "mid_forehead", "eyebrow_eye_region",
    #         "nose_region", "cheek_region", "mouth_region", "chin_jaw_region"
    
    age_point_quality: str
    # Quality assessment of current age point
    # Values: "excellent", "good", "fair", "challenging"
    
    life_phase_indicators: Dict[str, str]
    # Life phase analysis by facial regions
    
    temporal_insights: List[str]
    # Time-based insights from age points
    
    favorable_periods: List[Dict[str, Any]]
    # Upcoming favorable periods
    # Each contains: {"age_range", "location", "insights"}
    
    challenging_periods: List[Dict[str, Any]]
    # Periods requiring attention
```

#### BiometricIntegration

```python
class BiometricIntegration(BaseModel):
    """Integration with other WitnessOS consciousness engines."""
    
    vedic_element_correlation: Dict[str, float]
    # Correlation with Vedic elements (0-1 scale)
    # Keys: "Fire", "Earth", "Air", "Water"
    
    tcm_organ_correlation: Dict[str, float]
    # Correlation with TCM organ systems (0-100 scale)
    # Keys: "liver_gallbladder", "heart_small_intestine", 
    #       "spleen_stomach", "lung_large_intestine", "kidney_bladder"
    
    constitutional_recommendations: List[str]
    # Personalized recommendations
    
    breath_pattern_optimization: List[str]
    # Optimal breathing patterns
    
    meditation_techniques: List[str]
    # Recommended meditation practices
    
    consciousness_alignment_score: float
    # Overall consciousness alignment score (0-1)
```

## API Endpoints

### REST API (HTTP)

#### POST /api/v1/face-reading/analyze

Analyze facial image and return comprehensive results.

**Request:**

```json
{
  "user_id": "user_123",
  "birth_date": "1990-05-15",
  "processing_consent": true,
  "image_data": "data:image/png;base64,iVBORw0KGgoAAAANSUh...",
  "analysis_mode": "photo",
  "analysis_depth": "detailed",
  "include_twelve_houses": true,
  "include_five_elements": true,
  "include_age_points": true,
  "integrate_with_vedic": true,
  "integrate_with_tcm": true,
  "anonymize_results": true,
  "max_retention_hours": 24
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "engine_name": "Face Reading Engine",
  "calculation_time": 1.234,
  "confidence_score": 0.92,
  
  "facial_landmarks": {
    "total_landmarks": 468,
    "key_points": {
      "forehead_center": [0.5, 0.2],
      "nose_tip": [0.5, 0.55],
      "chin_center": [0.5, 0.9]
    },
    "face_bounds": {
      "left": 0.25,
      "right": 0.75,
      "top": 0.1,
      "bottom": 0.95
    },
    "detection_confidence": 0.95
  },
  
  "five_elements": {
    "wood_percentage": 25.0,
    "fire_percentage": 18.0,
    "earth_percentage": 22.0,
    "metal_percentage": 20.0,
    "water_percentage": 15.0,
    "dominant_element": "Wood",
    "secondary_element": "Earth",
    "constitutional_type": "Wood-Earth Constitution (Grounded Pioneer)",
    "temperament_indicators": [
      "Strong leadership qualities",
      "Practical and methodical",
      "Goal-oriented with stability"
    ],
    "health_tendencies": [
      "Liver-gallbladder attention during stress",
      "Digestive system balance important",
      "Benefits from regular physical activity"
    ]
  },
  
  "twelve_houses": {
    "ming_gong": {
      "area": "forehead",
      "strength": 0.75,
      "harmony_score": 0.8,
      "interpretation": "Strong life force and leadership potential"
    },
    "overall_harmony": 0.78,
    "dominant_houses": ["ming_gong", "guan_lu_gong", "cai_bo_gong"]
  },
  
  "age_points": {
    "current_age_point": 33,
    "age_point_location": "nose_region",
    "age_point_quality": "good",
    "temporal_insights": [
      "Prime years for career advancement",
      "Financial foundation building period",
      "Strong professional presence"
    ]
  },
  
  "biometric_integration": {
    "vedic_element_correlation": {
      "Fire": 0.75,
      "Earth": 0.85,
      "Air": 0.6,
      "Water": 0.55
    },
    "tcm_organ_correlation": {
      "liver_gallbladder": 78.5,
      "spleen_stomach": 82.3,
      "heart_small_intestine": 75.0,
      "lung_large_intestine": 70.2,
      "kidney_bladder": 68.5
    },
    "consciousness_alignment_score": 0.82
  },
  
  "constitutional_summary": "Wood-Earth constitution indicating strong leadership combined with practical stability...",
  
  "personality_insights": [
    "Natural leadership abilities",
    "Practical and methodical approach",
    "Values stability and tradition"
  ],
  
  "health_recommendations": [
    "Support liver-gallbladder during spring season",
    "Maintain digestive health through regular meals",
    "Practice grounding exercises for Earth element balance"
  ],
  
  "consciousness_optimization": [
    "Morning meditation for Wood element alignment",
    "Grounding breathwork for Earth stability",
    "Creative expression to balance dynamic energies"
  ],
  
  "processing_timestamp": "2024-01-26T12:34:56.789Z",
  "privacy_compliance": {
    "consent_obtained": true,
    "data_encrypted": true,
    "anonymized": true,
    "retention_policy_applied": true
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - No consent
{
  "success": false,
  "error": "ConsentRequired",
  "message": "Explicit consent required for biometric processing"
}

// 400 Bad Request - No face detected
{
  "success": false,
  "error": "NoFaceDetected",
  "message": "No face detected in provided image"
}

// 400 Bad Request - Invalid image
{
  "success": false,
  "error": "InvalidImage",
  "message": "Image resolution too low (minimum 640x480)"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "ProcessingError",
  "message": "Face analysis processing failed"
}
```

#### POST /api/v1/face-reading/analyze-video

Analyze video file with multi-frame processing.

**Request:**

```json
{
  "user_id": "user_123",
  "birth_date": "1990-05-15",
  "processing_consent": true,
  "video_data": "data:video/mp4;base64,AAAAIGZ0eXBpc29t...",
  "analysis_mode": "video",
  "analysis_depth": "detailed",
  "frame_interval_ms": 500
}
```

**Response:** Same as `/analyze` endpoint

#### GET /api/v1/face-reading/cached/{user_id}

Retrieve cached analysis results (within retention period).

**Response (200 OK):**

```json
{
  "success": true,
  "cached": true,
  "cache_timestamp": "2024-01-26T12:00:00.000Z",
  "expires_at": "2024-01-27T12:00:00.000Z",
  "data": { /* FaceReadingOutput */ }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "CacheExpired",
  "message": "No cached data available or retention period expired"
}
```

#### DELETE /api/v1/face-reading/data/{user_id}

Delete all stored biometric data (GDPR right to deletion).

**Response (200 OK):**

```json
{
  "success": true,
  "message": "All biometric data deleted for user",
  "deleted_items": ["landmarks", "analysis", "cache"]
}
```

## WebSocket API (Real-time)

### WS /ws/face-reading/live

Real-time camera feed analysis.

**Connect:**

```javascript
const ws = new WebSocket('wss://api.witnessos.com/ws/face-reading/live');

ws.onopen = () => {
  // Send initial configuration
  ws.send(JSON.stringify({
    type: 'config',
    user_id: 'user_123',
    birth_date: '1990-05-15',
    processing_consent: true,
    analysis_depth: 'basic',
    frame_rate: 10  // frames per second
  }));
};
```

**Send Frame:**

```javascript
// Send video frames
ws.send(JSON.stringify({
  type: 'frame',
  timestamp: Date.now(),
  image_data: 'data:image/jpeg;base64,...'
}));
```

**Receive Analysis:**

```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'analysis') {
    // Real-time analysis results
    console.log('Landmarks:', data.facial_landmarks);
    console.log('Elements:', data.five_elements);
  }
};
```

## SDK Examples

### Python SDK

```python
from witnessos import FaceReadingClient

# Initialize client
client = FaceReadingClient(api_key="your_api_key")

# Analyze photo
with open("photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

result = client.analyze(
    user_id="user_123",
    birth_date="1990-05-15",
    image_data=image_data,
    processing_consent=True,
    analysis_depth="detailed"
)

print(f"Constitutional Type: {result.five_elements.constitutional_type}")
print(f"Dominant Element: {result.five_elements.dominant_element}")
print(f"Overall Harmony: {result.twelve_houses.overall_harmony}")
```

### JavaScript SDK

```javascript
import { FaceReadingClient } from '@witnessos/sdk';

const client = new FaceReadingClient({ apiKey: 'your_api_key' });

// Analyze photo
const result = await client.analyze({
  userId: 'user_123',
  birthDate: '1990-05-15',
  imageData: 'data:image/png;base64,...',
  processingConsent: true,
  analysisDepth: 'detailed'
});

console.log('Constitutional Type:', result.fiveElements.constitutionalType);
console.log('Dominant Element:', result.fiveElements.dominantElement);
```

## Rate Limits

```
Free Tier:    10 analyses/day
Basic Tier:   100 analyses/day
Pro Tier:     1000 analyses/day
Enterprise:   Unlimited (custom SLA)
```

## Privacy & Compliance

### GDPR Compliance

- ✅ Explicit consent required
- ✅ Right to access data
- ✅ Right to deletion
- ✅ Data portability
- ✅ Configurable retention periods
- ✅ Encryption at rest and in transit

### Data Retention

```
Default:      24 hours
Configurable: 1 hour - 7 days
User Control: Can be deleted at any time
Auto-Delete:  Enabled by default
```

## Summary

The Face Reading API provides comprehensive biometric facial analysis with:

- **Privacy-First Design** - Explicit consent and data control
- **Flexible Depth** - Basic to comprehensive analysis modes
- **Multi-Modal** - Photo, video, and real-time analysis
- **Cross-Engine Integration** - Vedic and TCM correlations
- **RESTful & WebSocket** - Synchronous and real-time APIs
- **Compliance Ready** - GDPR/CCPA compliant implementation
