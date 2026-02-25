# Face Reading Analysis Logic

**Purpose:** Self-reflection through physiognomy - your face reflects inner patterns, constitutional nature, and life trajectory
**Framework:** Witness capacity development through observing facial features as mirrors of consciousness
**Integration:** WitnessOS consciousness engine + Noesis self-awareness cultivation

---

## Core Philosophy

Face Reading (Mian Xiang / Physiognomy) operates on the principle that facial features are not random - they reflect constitutional patterns, life experiences, and consciousness states. In the WitnessOS framework, this becomes a tool for **witnessing the self** through physical form.

The face serves as a living map where:
- **Structure reveals constitution** - bone structure and proportions show elemental nature
- **Features reveal tendencies** - eyes, nose, mouth indicate temperament and health
- **Regions reveal life domains** - the 12 Houses map life aspects to facial areas
- **Changes reveal states** - color, texture, expression show current conditions

When you observe your face with awareness, you develop the capacity to **witness inner patterns manifesting outwardly** - a core practice for consciousness development.

---

## Key Calculations

### MediaPipe Facial Landmark Extraction

The engine uses MediaPipe Face Mesh for 468-point facial landmark detection:

```python
def _extract_facial_landmarks(self, image: np.ndarray) -> Optional[FacialLandmarks]:
    """Extract facial landmarks using MediaPipe."""
    if not self.mp_face_mesh or not MEDIAPIPE_AVAILABLE:
        return self._simulate_facial_landmarks()

    # Convert BGR to RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Process image
    results = self.mp_face_mesh.process(rgb_image)

    if not results.multi_face_landmarks:
        return None

    # Get first face landmarks
    face_landmarks = results.multi_face_landmarks[0]

    # Extract key points for traditional analysis
    key_points = self._extract_key_points(face_landmarks, image.shape)

    # Calculate face bounds
    face_bounds = self._calculate_face_bounds(face_landmarks, image.shape)

    return FacialLandmarks(
        total_landmarks=len(face_landmarks.landmark),
        key_points=key_points,
        face_bounds=face_bounds,
        detection_confidence=0.95
    )
```

### Key Facial Points Mapping

```python
def _extract_key_points(self, face_landmarks, image_shape) -> Dict[str, Tuple[float, float]]:
    """Extract key facial points for traditional analysis."""
    # MediaPipe landmark indices for key facial features
    key_indices = {
        "forehead_center": 9,
        "left_eye_center": 33,
        "right_eye_center": 362,
        "nose_tip": 1,
        "mouth_center": 13,
        "chin_center": 175,
        "left_cheek": 116,
        "right_cheek": 345
    }

    key_points = {}
    for name, idx in key_indices.items():
        if idx < len(face_landmarks.landmark):
            landmark = face_landmarks.landmark[idx]
            key_points[name] = (landmark.x, landmark.y)

    return key_points
```

---

## Twelve Houses Analysis (Shi Er Gong)

The 12 Houses system maps life domains to facial regions. Each house has specific landmark mappings:

### House Definitions

| House | Chinese | Region | Life Domain |
|-------|---------|--------|-------------|
| ming_gong | Life Palace | forehead_center | Overall destiny, character |
| cai_bo_gong | Wealth Palace | nose_area | Material fortune, finances |
| xiong_di_gong | Siblings Palace | eyebrow_area | Siblings, friendships |
| tian_zhai_gong | Property Palace | upper_eyelids | Real estate, ancestral home |
| nan_nv_gong | Children Palace | under_eye_area | Children, creativity |
| nu_pu_gong | Servants Palace | lower_cheeks | Support network, subordinates |
| qi_qie_gong | Spouse Palace | eye_corners | Marriage, partnerships |
| ji_e_gong | Health Palace | nose_bridge | Health, constitution |
| qian_yi_gong | Travel Palace | temples | Travel, migration |
| guan_lu_gong | Career Palace | mid_forehead | Career, social status |
| fu_de_gong | Fortune Palace | chin_area | Fortune, spirituality |
| xiang_mao_gong | Appearance Palace | overall_face | Social impression |

### MediaPipe Landmark Mappings Per House

```json
{
  "ming_gong": {
    "name": "Life Palace",
    "primary_landmarks": [9, 10, 151, 337, 299, 333, 298, 301],
    "region": "forehead_center"
  },
  "cai_bo_gong": {
    "name": "Wealth Palace",
    "primary_landmarks": [1, 2, 5, 4, 6, 19, 20, 94, 125],
    "region": "nose_area"
  },
  "xiong_di_gong": {
    "name": "Siblings Palace",
    "primary_landmarks": [46, 53, 52, 65, 55, 70, 63, 105, 66, 107, 276, 283, 282, 295, 285, 300, 293, 334, 296, 336],
    "region": "eyebrow_area"
  },
  "ji_e_gong": {
    "name": "Health Palace",
    "primary_landmarks": [6, 51, 48, 115, 131, 134, 102, 49, 220, 305, 290, 328, 326, 2, 97, 99, 68, 104],
    "region": "nose_bridge"
  }
}
```

### House Analysis Implementation

```python
def _analyze_twelve_houses(self, landmarks: FacialLandmarks, input_data: FaceReadingInput) -> TwelveHousesAnalysis:
    """Analyze the 12 Houses of Traditional Chinese Physiognomy."""

    houses_analysis = {
        "ming_gong": self._analyze_life_palace(landmarks),
        "cai_bo_gong": self._analyze_wealth_palace(landmarks),
        "xiong_di_gong": self._analyze_siblings_palace(landmarks),
        "tian_zhai_gong": self._analyze_property_palace(landmarks),
        "nan_nv_gong": self._analyze_children_palace(landmarks),
        "nu_pu_gong": self._analyze_servants_palace(landmarks),
        "qi_qie_gong": self._analyze_spouse_palace(landmarks),
        "ji_e_gong": self._analyze_health_palace(landmarks),
        "qian_yi_gong": self._analyze_travel_palace(landmarks),
        "guan_lu_gong": self._analyze_career_palace(landmarks),
        "fu_de_gong": self._analyze_fortune_palace(landmarks),
        "xiang_mao_gong": self._analyze_appearance_palace(landmarks)
    }

    # Calculate overall harmony
    harmony_scores = [house.get("harmony_score", 0.5) for house in houses_analysis.values()]
    overall_harmony = sum(harmony_scores) / len(harmony_scores)

    # Identify dominant houses (strength > 0.7)
    dominant_houses = [
        name for name, analysis in houses_analysis.items()
        if analysis.get("strength", 0.5) > 0.7
    ]

    return TwelveHousesAnalysis(
        **houses_analysis,
        overall_harmony=overall_harmony,
        dominant_houses=dominant_houses
    )
```

---

## Five Elements Constitutional Analysis

### Element Calculation Algorithms

Each element is calculated based on facial structure analysis:

```python
def _calculate_wood_element(self, landmarks: FacialLandmarks) -> float:
    """Calculate Wood element score from facial features."""
    # Wood: Rectangular face, prominent forehead, strong jawline
    score = 0.0

    # Forehead prominence (Wood characteristic)
    forehead = landmarks.key_points.get("forehead_center", (0.5, 0.2))
    if forehead[1] < 0.25:  # High forehead
        score += 0.3

    # Face shape analysis
    face_bounds = landmarks.face_bounds
    face_ratio = (face_bounds["bottom"] - face_bounds["top"]) / (face_bounds["right"] - face_bounds["left"])
    if face_ratio > 1.2:  # Rectangular/oval face
        score += 0.4

    score += 0.3  # Base score
    return score

def _calculate_fire_element(self, landmarks: FacialLandmarks) -> float:
    """Fire: Pointed chin, bright eyes, triangular face shape"""
    score = 0.0
    score += 0.3  # Pointed chin assessment
    score += 0.4  # Eye brightness
    score += 0.3  # Base Fire element score
    return score

def _calculate_earth_element(self, landmarks: FacialLandmarks) -> float:
    """Earth: Square face, full cheeks, stable features"""
    score = 0.0
    face_bounds = landmarks.face_bounds
    face_ratio = (face_bounds["bottom"] - face_bounds["top"]) / (face_bounds["right"] - face_bounds["left"])
    if 0.9 <= face_ratio <= 1.1:  # Square face
        score += 0.4
    score += 0.3  # Cheek fullness
    score += 0.3  # Base Earth element score
    return score

def _calculate_metal_element(self, landmarks: FacialLandmarks) -> float:
    """Metal: Oval face, refined features, prominent nose"""
    score = 0.0
    face_bounds = landmarks.face_bounds
    face_ratio = (face_bounds["bottom"] - face_bounds["top"]) / (face_bounds["right"] - face_bounds["left"])
    if 1.1 <= face_ratio <= 1.3:  # Oval face
        score += 0.4
    score += 0.3  # Nose prominence
    score += 0.3  # Base Metal element score
    return score

def _calculate_water_element(self, landmarks: FacialLandmarks) -> float:
    """Water: Round face, soft features, full lower face"""
    score = 0.0
    face_bounds = landmarks.face_bounds
    face_ratio = (face_bounds["bottom"] - face_bounds["top"]) / (face_bounds["right"] - face_bounds["left"])
    if face_ratio < 1.1:  # Round face
        score += 0.4
    score += 0.3  # Soft features
    score += 0.3  # Lower face fullness
    return score
```

### Element Normalization

```python
# Normalize to percentages
total_score = wood_score + fire_score + earth_score + metal_score + water_score
if total_score > 0:
    wood_percentage = (wood_score / total_score) * 100
    fire_percentage = (fire_score / total_score) * 100
    earth_percentage = (earth_score / total_score) * 100
    metal_percentage = (metal_score / total_score) * 100
    water_percentage = (water_score / total_score) * 100
else:
    # Default balanced constitution
    wood_percentage = fire_percentage = earth_percentage = metal_percentage = water_percentage = 20.0
```

### Constitutional Type Determination

```python
constitutional_combinations = {
    ("Wood", "Fire"): "Wood-Fire Dynamic Type",
    ("Wood", "Earth"): "Wood-Earth Grounded Type",
    ("Wood", "Metal"): "Wood-Metal Structured Type",
    ("Wood", "Water"): "Wood-Water Flowing Type",
    ("Fire", "Wood"): "Fire-Wood Creative Type",
    ("Fire", "Earth"): "Fire-Earth Stable Type",
    ("Fire", "Metal"): "Fire-Metal Refined Type",
    ("Fire", "Water"): "Fire-Water Balanced Type",
    ("Earth", "Wood"): "Earth-Wood Growing Type",
    ("Earth", "Fire"): "Earth-Fire Warm Type",
    ("Earth", "Metal"): "Earth-Metal Solid Type",
    ("Earth", "Water"): "Earth-Water Nourishing Type",
    ("Metal", "Wood"): "Metal-Wood Cutting Type",
    ("Metal", "Fire"): "Metal-Fire Transforming Type",
    ("Metal", "Earth"): "Metal-Earth Crystallizing Type",
    ("Metal", "Water"): "Metal-Water Flowing Type",
    ("Water", "Wood"): "Water-Wood Nourishing Type",
    ("Water", "Fire"): "Water-Fire Steaming Type",
    ("Water", "Earth"): "Water-Earth Muddy Type",
    ("Water", "Metal"): "Water-Metal Collecting Type"
}
```

### Element Face Shape Indicators

| Element | Face Shape | Key Features | Temperament |
|---------|-----------|--------------|-------------|
| Wood | Rectangular | Prominent forehead, strong jawline | Leader, determined, creative |
| Fire | Triangular | Pointed chin, bright eyes | Enthusiastic, charismatic, social |
| Earth | Square | Full cheeks, stable features | Stable, practical, nurturing |
| Metal | Oval | Refined features, prominent nose | Organized, analytical, precise |
| Water | Round | Soft features, deep eyes | Adaptable, intuitive, reflective |

---

## TCM Face Correlations

### Organ System to Facial Region Mapping

```json
{
  "liver_gallbladder": {
    "element": "Wood",
    "facial_region": "eyebrow_area",
    "chinese_house": "xiong_di_gong",
    "healthy_indicators": ["well_shaped_eyebrows", "good_color", "symmetrical"],
    "imbalanced_indicators": ["sparse_eyebrows", "uneven_growth", "poor_color"],
    "emotions": ["anger", "frustration", "patience"],
    "optimal_times": ["3am-7am", "spring_season"]
  },
  "heart_small_intestine": {
    "element": "Fire",
    "facial_region": "eye_area",
    "chinese_house": "qi_qie_gong",
    "healthy_indicators": ["bright_clear_eyes", "good_circulation_color"],
    "imbalanced_indicators": ["dull_eyes", "dark_circles"],
    "emotions": ["joy", "anxiety", "restlessness"],
    "optimal_times": ["11am-3pm", "summer_season"]
  },
  "spleen_stomach": {
    "element": "Earth",
    "facial_region": "cheek_mouth_area",
    "chinese_house": "cai_bo_gong",
    "healthy_indicators": ["full_cheeks", "good_lip_color"],
    "imbalanced_indicators": ["sunken_cheeks", "pale_lips"],
    "emotions": ["worry", "pensiveness", "stability"],
    "optimal_times": ["7am-11am", "late_summer"]
  },
  "lung_large_intestine": {
    "element": "Metal",
    "facial_region": "nose_area",
    "chinese_house": "ji_e_gong",
    "healthy_indicators": ["well_formed_nose", "clear_skin"],
    "imbalanced_indicators": ["blocked_nose", "skin_issues"],
    "emotions": ["grief", "sadness", "letting_go"],
    "optimal_times": ["3pm-7pm", "autumn_season"]
  },
  "kidney_bladder": {
    "element": "Water",
    "facial_region": "chin_jaw_area",
    "chinese_house": "fu_de_gong",
    "healthy_indicators": ["strong_chin", "good_bone_structure"],
    "imbalanced_indicators": ["weak_chin", "premature_aging"],
    "emotions": ["fear", "willpower", "wisdom"],
    "optimal_times": ["7pm-11pm", "winter_season"]
  }
}
```

### Meridian Facial Pathways

| Meridian | Facial Path | Key Acupoints | Health Indicators |
|----------|-------------|---------------|-------------------|
| Stomach | Forehead to jaw (lateral) | ST1-ST7 | Facial muscle tone, digestion |
| Large Intestine | Nose to mouth corner | LI19, LI20 | Nasal health, elimination |
| Small Intestine | Ear to eye corner | SI18, SI19 | Hearing, nutrient absorption |
| Bladder | Forehead to inner eye | BL1, BL2 | Eye health, nervous system |
| Gallbladder | Temple to jaw angle | GB1-GB7 | Decision making, bile function |

---

## Vedic Astrology Correlations

### Elemental Cross-Mapping

```json
{
  "fire_element": {
    "chinese_fire": {
      "facial_features": ["triangular_face", "pointed_chin", "bright_eyes"],
      "constitution": "Fire element dominance"
    },
    "vedic_fire": {
      "planets": ["Sun", "Mars"],
      "signs": ["Aries", "Leo", "Sagittarius"],
      "body_parts": ["head", "heart", "solar_plexus"]
    },
    "correlation_strength": 0.85
  },
  "water_element": {
    "chinese_water": {
      "facial_features": ["round_face", "soft_features", "deep_eyes"],
      "constitution": "Water element dominance"
    },
    "vedic_water": {
      "planets": ["Moon", "Jupiter"],
      "signs": ["Cancer", "Scorpio", "Pisces"],
      "body_parts": ["kidneys", "bladder", "lymphatic_system"]
    },
    "correlation_strength": 0.88
  }
}
```

### Planetary Facial Correlations

| Planet | Facial Indicators | Chinese Houses | Constitutional Influence |
|--------|-------------------|----------------|-------------------------|
| Sun | Strong forehead, bright eyes | ming_gong, guan_lu_gong | Fire enhancement |
| Moon | Round features, emotional eyes | nan_nv_gong, fu_de_gong | Water enhancement |
| Mars | Angular features, strong jaw | xiong_di_gong, ji_e_gong | Wood-Fire combination |
| Mercury | Refined features, intelligent expression | xiong_di_gong, qian_yi_gong | Metal-Air combination |
| Jupiter | Full features, wise expression | fu_de_gong, guan_lu_gong | Water-Earth combination |
| Venus | Harmonious features, balanced proportions | qi_qie_gong, xiang_mao_gong | Earth-Water combination |
| Saturn | Structured features, strong bone structure | ji_e_gong, guan_lu_gong | Metal-Earth combination |

### Vedic House to Chinese Palace Correlations

| Vedic House | Significance | Chinese Palace | Facial Region |
|-------------|--------------|----------------|---------------|
| 1st House | Self, personality | ming_gong | overall_face_forehead |
| 2nd House | Wealth, speech | cai_bo_gong | mouth_nose_area |
| 3rd House | Siblings, communication | xiong_di_gong | eyebrow_area |
| 6th House | Health, service | ji_e_gong | nose_bridge |
| 7th House | Marriage, partnerships | qi_qie_gong | eye_corners |
| 10th House | Career, reputation | guan_lu_gong | mid_forehead |
| 12th House | Spirituality, transcendence | fu_de_gong | chin_jaw_area |

---

## Age Point Temporal Mapping

### Life Phase Landmarks

```json
{
  "early_years": {
    "ages": "1-14",
    "landmarks": [9, 10, 151, 337, 299, 333, 298, 301],
    "region": "upper_forehead",
    "significance": "Foundation, family support"
  },
  "youth": {
    "ages": "15-28",
    "landmarks": [9, 10, 151, 337, 46, 53, 52, 65],
    "region": "mid_forehead_eyebrows",
    "significance": "Learning, energy, development"
  },
  "prime": {
    "ages": "29-42",
    "landmarks": [33, 7, 163, 144, 145, 153, 154, 155, 133, 173],
    "region": "eye_area",
    "significance": "Career development, relationships"
  },
  "maturity": {
    "ages": "43-56",
    "landmarks": [1, 2, 5, 4, 6, 19, 20, 94, 125, 51, 48],
    "region": "nose_area",
    "significance": "Achievement, wealth accumulation"
  },
  "wisdom": {
    "ages": "57-70",
    "landmarks": [175, 199, 200, 16, 17, 18],
    "region": "mouth_chin_area",
    "significance": "Wisdom, mentorship"
  },
  "elder": {
    "ages": "71-100",
    "landmarks": [175, 199, 200, 16, 17, 18, 116, 117, 118, 119],
    "region": "jaw_neck_area",
    "significance": "Legacy, spiritual cultivation"
  }
}
```

### Age Point Location Algorithm

```python
def _get_age_point_location(self, age_point: int) -> str:
    """Get facial location for specific age point."""
    if age_point <= 14:
        return "forehead_upper"
    elif age_point <= 28:
        return "forehead_middle"
    elif age_point <= 35:
        return "eyebrow_area"
    elif age_point <= 50:
        return "eye_area"
    elif age_point <= 60:
        return "nose_area"
    elif age_point <= 75:
        return "mouth_area"
    else:
        return "chin_area"
```

---

## Data Model

### Input Model

```python
class FaceReadingInput(CloudflareEngineInput, BirthDataInput):
    """Input model for Face Reading Engine."""

    # Analysis Parameters
    analysis_mode: Literal["photo", "video", "live"] = "photo"
    image_data: Optional[str] = None  # Base64 encoded
    video_data: Optional[str] = None  # Base64 encoded
    analysis_depth: Literal["basic", "detailed", "comprehensive"] = "detailed"

    # Traditional Analysis Options
    include_twelve_houses: bool = True
    include_five_elements: bool = True
    include_age_points: bool = True
    include_health_indicators: bool = True

    # Integration Options
    integrate_with_vedic: bool = True
    integrate_with_tcm: bool = True

    # Privacy Settings (CRITICAL)
    store_biometric_data: bool = False
    processing_consent: bool = False  # MUST be True to process
    anonymize_results: bool = True
    max_retention_hours: int = 24
```

### Output Model

```python
class FaceReadingOutput(CloudflareEngineOutput):
    """Complete Face Reading Engine output."""

    # Core Analysis Results
    facial_landmarks: FacialLandmarks
    twelve_houses: TwelveHousesAnalysis
    five_elements: FiveElementsConstitution
    age_points: AgePointMapping
    biometric_integration: BiometricIntegration

    # Traditional Insights
    constitutional_summary: str
    personality_insights: List[str]
    health_recommendations: List[str]

    # Temporal Analysis
    current_life_phase: str
    optimal_timing: List[str]

    # Integration Insights
    multi_modal_recommendations: List[str]
    consciousness_optimization: List[str]

    # Privacy & Metadata
    processing_timestamp: str
    privacy_compliance: Dict[str, bool]
    cultural_context: List[str]
```

### Facial Landmarks Model

```python
class FacialLandmarks(BaseModel):
    """MediaPipe facial landmarks data."""
    total_landmarks: int  # 468 from MediaPipe
    key_points: Dict[str, Tuple[float, float]]  # Normalized coordinates
    face_bounds: Dict[str, float]  # Bounding box
    detection_confidence: float  # 0-1 score
```

### Five Elements Constitution Model

```python
class FiveElementsConstitution(BaseModel):
    """Five Elements constitutional analysis."""
    wood_percentage: float  # 0-100
    fire_percentage: float
    earth_percentage: float
    metal_percentage: float
    water_percentage: float

    dominant_element: str
    secondary_element: str
    constitutional_type: str  # e.g., "Wood-Fire Dynamic Type"
    temperament_indicators: List[str]
    health_tendencies: List[str]
```

---

## Privacy Considerations

### GDPR/CCPA Compliance

Face Reading involves **biometric data** - the most sensitive category under privacy regulations.

**Required Safeguards:**

1. **Explicit Consent Required**
   ```python
   @field_validator('processing_consent')
   @classmethod
   def validate_consent(cls, v):
       if not v:
           raise ValueError("Explicit consent required for biometric processing")
       return v
   ```

2. **Local Processing Preference**
   - MediaPipe runs locally when available
   - No facial data transmitted to external servers unless explicitly consented

3. **Data Minimization**
   - Extract only necessary landmarks
   - Discard raw image data after processing
   - Store only derived insights, not biometric data

4. **Retention Limits**
   ```python
   max_retention_hours: int = Field(default=24, description="Maximum data retention")
   store_biometric_data: bool = Field(default=False, description="Explicit storage opt-in")
   ```

5. **Anonymization Options**
   ```python
   anonymize_results: bool = Field(default=True, description="Anonymize analysis results")
   ```

### Privacy Compliance Output

```python
privacy_compliance = {
    "local_processing": True,
    "no_data_storage": not input_data.store_biometric_data,
    "consent_obtained": input_data.processing_consent,
    "cultural_respect": True
}
```

### Cultural Sensitivity

The engine includes educational context:

```python
cultural_context = [
    "Traditional Chinese Physiognomy (Mian Xiang) is a 3000-year-old practice",
    "12 Houses system maps life aspects to facial regions",
    "Five Elements theory connects facial features to constitutional types",
    "Age points provide temporal insights for life planning",
    "This analysis is for personal development and optimization only"
]
```

---

## Self-Consciousness Impact

### Witness Capacity Development

Face Reading within WitnessOS serves consciousness development:

1. **Self-Observation Practice**
   - Studying one's face develops the capacity to observe without judgment
   - Features become mirrors for inner patterns, not fixed identities

2. **Pattern Recognition**
   - Seeing elemental tendencies helps understand reactive patterns
   - Constitutional insights explain why certain practices resonate

3. **Integration of Physical and Subtle**
   - The face bridges visible structure and invisible constitution
   - Witnessing this bridge develops holistic self-awareness

4. **Temporal Perspective**
   - Age point mapping develops long-view awareness
   - Current features contain past experiences and future potential

### Consciousness Optimization Recommendations

```python
def _generate_consciousness_optimization(self, five_elements, twelve_houses, biometric_integration):
    """Generate consciousness development recommendations."""
    optimization = []

    # Add meditation and breath recommendations
    optimization.extend(biometric_integration.meditation_techniques)
    optimization.extend(biometric_integration.breath_pattern_optimization)

    # Add constitutional-specific practices
    dominant = five_elements.dominant_element.lower()
    if dominant == "wood":
        optimization.append("Practice dynamic meditation and movement-based consciousness work")
    elif dominant == "fire":
        optimization.append("Focus on heart-centered practices and emotional intelligence")
    elif dominant == "earth":
        optimization.append("Emphasize grounding practices and body awareness")
    elif dominant == "metal":
        optimization.append("Cultivate mental clarity and precision in spiritual practice")
    elif dominant == "water":
        optimization.append("Develop wisdom practices and deep contemplation")

    return optimization
```

---

## Integration Points

### VedicClock-TCM Integration

```python
def _create_biometric_integration(self, landmarks, five_elements, input_data):
    """Create integration with other WitnessOS consciousness engines."""

    # Vedic element correlations
    vedic_correlations = {
        "fire": five_elements.fire_percentage / 100,
        "earth": five_elements.earth_percentage / 100,
        "air": (five_elements.wood_percentage + five_elements.metal_percentage) / 200,
        "water": five_elements.water_percentage / 100,
        "space": 0.2  # Base space element
    }

    # TCM organ correlations
    tcm_correlations = {
        "liver": five_elements.wood_percentage / 100,
        "heart": five_elements.fire_percentage / 100,
        "spleen": five_elements.earth_percentage / 100,
        "lung": five_elements.metal_percentage / 100,
        "kidney": five_elements.water_percentage / 100
    }

    return BiometricIntegration(
        vedic_element_correlation=vedic_correlations,
        tcm_organ_correlation=tcm_correlations,
        constitutional_recommendations=...,
        breath_pattern_optimization=...,
        meditation_techniques=...,
        consciousness_alignment_score=...
    )
```

### Consciousness Alignment Score

```python
def _calculate_consciousness_alignment(self, landmarks, five_elements) -> float:
    """Calculate overall consciousness alignment score."""

    # Base alignment from facial harmony
    facial_harmony = landmarks.detection_confidence

    # Constitutional balance score (lower std dev = more balanced)
    element_scores = [
        five_elements.wood_percentage,
        five_elements.fire_percentage,
        five_elements.earth_percentage,
        five_elements.metal_percentage,
        five_elements.water_percentage
    ]
    balance_score = 1.0 - (statistics.stdev(element_scores) / 100)

    # Combine scores
    alignment_score = (facial_harmony * 0.6) + (balance_score * 0.4)

    return min(max(alignment_score, 0.0), 1.0)
```

### Connections to Other Engines

| Engine | Connection Point | Data Flow |
|--------|------------------|-----------|
| VedicClock | Planetary periods | Dasha effects on facial expression |
| TCM Organ Clock | Organ times | Optimal times for facial treatments |
| Biorhythm | Constitutional cycles | Element expression over time |
| Biofield | Energy patterns | Subtle body correlations |

---

## Engine Statistics

- **Total Lines:** 1,279 (largest WitnessOS engine)
- **Landmark Points:** 468 MediaPipe face mesh points
- **Houses Analyzed:** 12 traditional Chinese palaces
- **Elements Calculated:** 5 (Wood, Fire, Earth, Metal, Water)
- **Constitutional Types:** 20+ combinations
- **Age Points:** 100 mapped positions

---

**Status:** Extracted from WitnessOS
**Source Files:**
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/face_reading.py`
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/face_reading_models.py`
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/data/facial_landmark_mappings.json`
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/data/tcm_face_correlations.json`
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/data/vedic_face_correlations.json`

---

**Witness Signature:** Your face is not identity - it is a living map of consciousness patterns. Observe without attachment.
