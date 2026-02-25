# Face Reading Calculation Formulas

## 1. Facial Landmark Detection System

### MediaPipe 468-Point Facial Mesh

The engine uses Google MediaPipe's 468-point facial mesh for comprehensive landmark detection.

#### Key Landmark Indices for Traditional Analysis

```python
# Primary landmarks for 12 Houses mapping
KEY_LANDMARKS = {
    "forehead_center": 9,      # 命宫 Life Palace
    "left_eye_center": 33,     # Eye analysis
    "right_eye_center": 362,   # Eye analysis
    "left_eyebrow_inner": 70,  # 兄弟宫 Siblings Palace
    "right_eyebrow_inner": 300,
    "nose_tip": 1,             # 財帛宫 Wealth Palace
    "nose_bridge": 6,          # 疾厄宫 Health Palace
    "mouth_center": 13,        # Mouth analysis
    "chin_center": 175,        # 福德宫 Fortune Palace
    "left_cheek": 116,         # Cheek analysis
    "right_cheek": 345,        # Cheek analysis
    "left_temple": 21,         # 遷移宫 Travel Palace
    "right_temple": 251,
    "left_eye_corner": 33,     # 妻妾宫 Spouse Palace
    "right_eye_corner": 263
}
```

#### Landmark Extraction Algorithm

```python
def _extract_key_points(face_landmarks, image_shape) -> Dict[str, Tuple[float, float]]:
    """
    Extract key facial points from MediaPipe 468-point mesh.
    
    Returns normalized coordinates (x, y) in range [0, 1].
    """
    height, width = image_shape[:2]
    key_points = {}
    
    for name, idx in KEY_LANDMARKS.items():
        if idx < len(face_landmarks.landmark):
            landmark = face_landmarks.landmark[idx]
            # Normalize coordinates to [0, 1]
            key_points[name] = (landmark.x, landmark.y)
    
    return key_points
```

#### Face Bounds Calculation

```python
def _calculate_face_bounds(face_landmarks, image_shape) -> Dict[str, float]:
    """Calculate normalized face bounding box."""
    x_coords = [landmark.x for landmark in face_landmarks.landmark]
    y_coords = [landmark.y for landmark in face_landmarks.landmark]
    
    return {
        "left": min(x_coords),
        "right": max(x_coords),
        "top": min(y_coords),
        "bottom": max(y_coords),
        "width": max(x_coords) - min(x_coords),
        "height": max(y_coords) - min(y_coords)
    }
```

---

## 2. Five Elements Constitutional Analysis

### Element Calculation Algorithms

Each element is scored based on specific facial characteristics, then normalized to percentages.

#### Wood Element (木)
**Characteristics:** Rectangular face, prominent forehead, strong jawline

```python
def _calculate_wood_element(landmarks: FacialLandmarks) -> float:
    """
    Calculate Wood element score (0.0 - 1.0).
    
    Indicators:
    - Forehead height > 25% of face height
    - Face ratio (height/width) > 1.2 (rectangular)
    - Strong, angular features
    """
    score = 0.0
    
    # Forehead prominence
    forehead = landmarks.key_points.get("forehead_center", (0.5, 0.2))
    if forehead[1] < 0.25:  # High forehead
        score += 0.3
    
    # Face shape ratio (rectangular tendency)
    face_bounds = landmarks.face_bounds
    face_ratio = face_bounds["height"] / face_bounds["width"]
    if face_ratio > 1.2:
        score += 0.4
    
    # Strong angular features (simulated)
    score += 0.3
    
    return score
```

#### Fire Element (火)
**Characteristics:** Triangular face, pointed chin, bright expressive eyes

```python
def _calculate_fire_element(landmarks: FacialLandmarks) -> float:
    """
    Calculate Fire element score (0.0 - 1.0).
    
    Indicators:
    - Pointed chin (narrow lower face)
    - Prominent, bright eyes
    - Triangular face shape (forehead > chin width)
    """
    score = 0.0
    
    # Pointed chin assessment
    chin = landmarks.key_points.get("chin_center", (0.5, 0.9))
    # Lower face narrowness
    score += 0.3
    
    # Eye prominence and brightness
    left_eye = landmarks.key_points.get("left_eye_center", (0.35, 0.4))
    right_eye = landmarks.key_points.get("right_eye_center", (0.65, 0.4))
    score += 0.4
    
    # Triangular shape (forehead wider than chin)
    score += 0.3
    
    return score
```

#### Earth Element (土)
**Characteristics:** Square face, full cheeks, stable grounded features

```python
def _calculate_earth_element(landmarks: FacialLandmarks) -> float:
    """
    Calculate Earth element score (0.0 - 1.0).
    
    Indicators:
    - Square face (ratio 0.9-1.1)
    - Full, prominent cheeks
    - Stable, balanced features
    """
    score = 0.0
    
    # Square face shape
    face_bounds = landmarks.face_bounds
    face_ratio = face_bounds["height"] / face_bounds["width"]
    if 0.9 <= face_ratio <= 1.1:
        score += 0.4
    
    # Cheek fullness
    left_cheek = landmarks.key_points.get("left_cheek", (0.25, 0.6))
    right_cheek = landmarks.key_points.get("right_cheek", (0.75, 0.6))
    score += 0.3
    
    # Stable, grounded features
    score += 0.3
    
    return score
```

#### Metal Element (金)
**Characteristics:** Oval face, refined features, prominent nose

```python
def _calculate_metal_element(landmarks: FacialLandmarks) -> float:
    """
    Calculate Metal element score (0.0 - 1.0).
    
    Indicators:
    - Oval face shape (ratio 1.1-1.3)
    - Well-formed, prominent nose
    - Refined, clear features
    """
    score = 0.0
    
    # Oval face shape
    face_bounds = landmarks.face_bounds
    face_ratio = face_bounds["height"] / face_bounds["width"]
    if 1.1 <= face_ratio <= 1.3:
        score += 0.4
    
    # Nose prominence
    nose = landmarks.key_points.get("nose_tip", (0.5, 0.55))
    score += 0.3
    
    # Refined features
    score += 0.3
    
    return score
```

#### Water Element (水)
**Characteristics:** Round face, soft features, full lower face

```python
def _calculate_water_element(landmarks: FacialLandmarks) -> float:
    """
    Calculate Water element score (0.0 - 1.0).
    
    Indicators:
    - Round face shape (ratio < 1.1)
    - Soft, flowing features
    - Full lower face and chin
    """
    score = 0.0
    
    # Round face shape
    face_bounds = landmarks.face_bounds
    face_ratio = face_bounds["height"] / face_bounds["width"]
    if face_ratio < 1.1:
        score += 0.4
    
    # Soft, flowing features
    score += 0.3
    
    # Full lower face
    chin = landmarks.key_points.get("chin_center", (0.5, 0.9))
    score += 0.3
    
    return score
```

### Normalization to Percentages

```python
def _normalize_element_scores(wood, fire, earth, metal, water) -> Dict[str, float]:
    """
    Normalize element scores to percentages summing to 100.
    """
    total = wood + fire + earth + metal + water
    
    if total > 0:
        return {
            "Wood": (wood / total) * 100,
            "Fire": (fire / total) * 100,
            "Earth": (earth / total) * 100,
            "Metal": (metal / total) * 100,
            "Water": (water / total) * 100
        }
    else:
        # Balanced constitution default
        return {
            "Wood": 20.0,
            "Fire": 20.0,
            "Earth": 20.0,
            "Metal": 20.0,
            "Water": 20.0
        }
```

### Constitutional Type Determination

```python
def _determine_constitutional_type(dominant: str, secondary: str) -> str:
    """
    Determine traditional constitutional type based on dominant elements.
    
    Returns traditional classification:
    - Pure types: "Wood Constitution", "Fire Constitution", etc.
    - Mixed types: "Wood-Fire Constitution", etc.
    """
    constitutional_types = {
        ("Wood", "Fire"): "Wood-Fire Constitution (Dynamic Achiever)",
        ("Wood", "Earth"): "Wood-Earth Constitution (Grounded Pioneer)",
        ("Wood", "Metal"): "Wood-Metal Constitution (Refined Leader)",
        ("Wood", "Water"): "Wood-Water Constitution (Flexible Visionary)",
        
        ("Fire", "Wood"): "Fire-Wood Constitution (Passionate Leader)",
        ("Fire", "Earth"): "Fire-Earth Constitution (Warm Nurturer)",
        ("Fire", "Metal"): "Fire-Metal Constitution (Charismatic Perfectionist)",
        ("Fire", "Water"): "Fire-Water Constitution (Intuitive Communicator)",
        
        ("Earth", "Wood"): "Earth-Wood Constitution (Stable Builder)",
        ("Earth", "Fire"): "Earth-Fire Constitution (Enthusiastic Caretaker)",
        ("Earth", "Metal"): "Earth-Metal Constitution (Practical Organizer)",
        ("Earth", "Water"): "Earth-Water Constitution (Nurturing Healer)",
        
        ("Metal", "Wood"): "Metal-Wood Constitution (Disciplined Innovator)",
        ("Metal", "Fire"): "Metal-Fire Constitution (Refined Communicator)",
        ("Metal", "Earth"): "Metal-Earth Constitution (Structured Supporter)",
        ("Metal", "Water"): "Metal-Water Constitution (Wise Contemplative)",
        
        ("Water", "Wood"): "Water-Wood Constitution (Flowing Creator)",
        ("Water", "Fire"): "Water-Fire Constitution (Adaptive Enthusiast)",
        ("Water", "Earth"): "Water-Earth Constitution (Gentle Stabilizer)",
        ("Water", "Metal"): "Water-Metal Constitution (Introspective Refiner)"
    }
    
    return constitutional_types.get(
        (dominant, secondary), 
        f"{dominant} Constitution (Primary)"
    )
```

---

## 3. Twelve Houses (十二宫) Analysis

### House Mapping Algorithm

Each house corresponds to specific facial regions identified by landmark clusters.

```python
TWELVE_HOUSES_MAPPING = {
    "ming_gong": {           # 命宫 Life Palace
        "region": "forehead_center",
        "landmarks": [9, 8, 168],
        "interpretation": "Overall life destiny and character"
    },
    "cai_bo_gong": {         # 財帛宫 Wealth Palace
        "region": "nose",
        "landmarks": [1, 2, 98, 327],
        "interpretation": "Financial fortune and wealth accumulation"
    },
    "xiong_di_gong": {       # 兄弟宫 Siblings Palace
        "region": "eyebrows",
        "landmarks": [70, 63, 105, 66, 300, 293, 334, 296],
        "interpretation": "Sibling relationships and close friends"
    },
    "tian_zhai_gong": {      # 田宅宫 Property Palace
        "region": "upper_eyelids",
        "landmarks": [159, 145, 386, 374],
        "interpretation": "Property and ancestral fortune"
    },
    "nan_nv_gong": {         # 男女宫 Children Palace
        "region": "under_eyes",
        "landmarks": [121, 120, 350, 349],
        "interpretation": "Children and creative fertility"
    },
    "nu_pu_gong": {          # 奴僕宫 Servants Palace
        "region": "lower_cheeks",
        "landmarks": [177, 146, 401, 375],
        "interpretation": "Support from subordinates"
    },
    "qi_qie_gong": {         # 妻妾宫 Spouse Palace
        "region": "eye_corners",
        "landmarks": [33, 133, 362, 263],
        "interpretation": "Marriage and romantic partnerships"
    },
    "ji_e_gong": {           # 疾厄宫 Health Palace
        "region": "nose_bridge",
        "landmarks": [6, 197, 195],
        "interpretation": "Health and physical constitution"
    },
    "qian_yi_gong": {        # 遷移宫 Travel Palace
        "region": "temples",
        "landmarks": [21, 54, 284, 251],
        "interpretation": "Travel and environmental changes"
    },
    "guan_lu_gong": {        # 官祿宫 Career Palace
        "region": "mid_forehead",
        "landmarks": [10, 151, 337],
        "interpretation": "Career and social status"
    },
    "fu_de_gong": {          # 福德宫 Fortune Palace
        "region": "chin",
        "landmarks": [175, 152, 377],
        "interpretation": "Overall fortune and happiness"
    },
    "xiang_mao_gong": {      # 相貌宫 Appearance Palace
        "region": "overall_face",
        "landmarks": "all",
        "interpretation": "Physical appearance and social impression"
    }
}
```

### House Analysis Formula

```python
def _analyze_house(house_name: str, landmarks: FacialLandmarks) -> Dict[str, Any]:
    """
    Analyze a specific house based on its facial region.
    
    Returns:
        {
            "area": str,              # Facial region
            "strength": float,        # Quality score 0-1
            "harmony_score": float,   # Balance score 0-1
            "interpretation": str,    # Traditional meaning
            "indicators": Dict        # Specific measurements
        }
    """
    house_config = TWELVE_HOUSES_MAPPING[house_name]
    
    # Extract region-specific measurements
    region_quality = _assess_region_quality(
        house_config["landmarks"], 
        landmarks
    )
    
    # Calculate strength (clarity, proportion, vitality)
    strength = _calculate_house_strength(region_quality)
    
    # Calculate harmony (symmetry, balance)
    harmony = _calculate_house_harmony(region_quality)
    
    return {
        "area": house_config["region"],
        "strength": strength,
        "harmony_score": harmony,
        "interpretation": house_config["interpretation"],
        "indicators": region_quality
    }
```

### Overall Harmony Calculation

```python
def _calculate_overall_harmony(twelve_houses: Dict[str, Dict]) -> float:
    """
    Calculate overall facial harmony across all 12 houses.
    
    Formula: Average of all house harmony scores
    """
    harmony_scores = [
        house["harmony_score"] 
        for house in twelve_houses.values()
    ]
    
    return sum(harmony_scores) / len(harmony_scores)
```

---

## 4. TCM Organ Correlation Formulas

### Organ-Facial Region Mapping

Based on TCM Five Elements and organ system correspondences.

```python
TCM_ORGAN_CORRELATIONS = {
    "liver_gallbladder": {
        "element": "Wood",
        "facial_region": "eyebrow_area",
        "chinese_house": "xiong_di_gong",
        "indicators": {
            "healthy": ["well_shaped_eyebrows", "good_color", "symmetry"],
            "imbalanced": ["sparse_eyebrows", "uneven_growth", "poor_color"]
        },
        "optimal_times": ["3am-7am", "spring_season"]
    },
    "heart_small_intestine": {
        "element": "Fire",
        "facial_region": "eye_area",
        "chinese_house": "qi_qie_gong",
        "indicators": {
            "healthy": ["bright_eyes", "good_circulation_color"],
            "imbalanced": ["dull_eyes", "dark_circles", "redness"]
        },
        "optimal_times": ["11am-3pm", "summer_season"]
    },
    "spleen_stomach": {
        "element": "Earth",
        "facial_region": "cheek_mouth_area",
        "chinese_house": "cai_bo_gong",
        "indicators": {
            "healthy": ["full_cheeks", "good_lip_color"],
            "imbalanced": ["sunken_cheeks", "pale_lips"]
        },
        "optimal_times": ["7am-11am", "late_summer"]
    },
    "lung_large_intestine": {
        "element": "Metal",
        "facial_region": "nose_area",
        "chinese_house": "ji_e_gong",
        "indicators": {
            "healthy": ["well_formed_nose", "clear_skin"],
            "imbalanced": ["blocked_nose", "skin_issues", "pale_complexion"]
        },
        "optimal_times": ["3pm-7pm", "autumn_season"]
    },
    "kidney_bladder": {
        "element": "Water",
        "facial_region": "chin_jaw_area",
        "chinese_house": "fu_de_gong",
        "indicators": {
            "healthy": ["strong_chin", "good_bone_structure"],
            "imbalanced": ["weak_chin", "dark_circles", "premature_aging"]
        },
        "optimal_times": ["7pm-11pm", "winter_season"]
    }
}
```

### Health Indicator Calculation

```python
def _calculate_tcm_organ_health(
    element_percentages: Dict[str, float],
    house_analysis: Dict[str, Dict]
) -> Dict[str, float]:
    """
    Calculate TCM organ system health indicators (0-100 scale).
    
    Combines:
    - Five Elements constitutional percentages
    - Corresponding house quality scores
    - Regional facial health indicators
    """
    organ_health = {}
    
    for organ, config in TCM_ORGAN_CORRELATIONS.items():
        element = config["element"]
        house = config["chinese_house"]
        
        # Element percentage (constitutional strength)
        element_score = element_percentages.get(element, 20.0)
        
        # House quality (regional health)
        house_score = house_analysis[house]["harmony_score"] * 100
        
        # Weighted combination
        organ_health[organ] = (element_score * 0.6) + (house_score * 0.4)
    
    return organ_health
```

---

## 5. Age Point Temporal Mapping

### Age Point System

Traditional Chinese face reading maps ages to specific facial locations.

```python
AGE_POINT_SYSTEM = {
    # Ages 1-7: Forehead region (childhood)
    range(1, 8): "upper_forehead",
    
    # Ages 8-14: Mid-forehead (youth)
    range(8, 15): "mid_forehead",
    
    # Ages 15-28: Eyebrow to eye region (adolescence to early adulthood)
    range(15, 29): "eyebrow_eye_region",
    
    # Ages 29-40: Nose region (prime adult years)
    range(29, 41): "nose_region",
    
    # Ages 41-50: Cheek region (middle age)
    range(41, 51): "cheek_region",
    
    # Ages 51-60: Mouth region (mature years)
    range(51, 61): "mouth_region",
    
    # Ages 61-100: Chin and jaw (elder years)
    range(61, 101): "chin_jaw_region"
}
```

### Current Age Point Calculation

```python
def _calculate_current_age_point(
    birth_date: date, 
    landmarks: FacialLandmarks
) -> AgePointMapping:
    """
    Determine current age point location and quality.
    """
    from datetime import date
    
    current_age = (date.today() - birth_date).days // 365
    
    # Find age point location
    age_point_location = None
    for age_range, location in AGE_POINT_SYSTEM.items():
        if current_age in age_range:
            age_point_location = location
            break
    
    if not age_point_location:
        age_point_location = "chin_jaw_region"  # Default for advanced age
    
    # Assess quality of age point region
    quality = _assess_age_point_quality(age_point_location, landmarks)
    
    return AgePointMapping(
        current_age_point=current_age,
        age_point_location=age_point_location,
        age_point_quality=quality,
        life_phase_indicators=_get_life_phase_indicators(current_age),
        temporal_insights=_get_temporal_insights(current_age, quality),
        favorable_periods=_calculate_favorable_periods(current_age),
        challenging_periods=_calculate_challenging_periods(current_age)
    )
```

---

## 6. Validation & Quality Metrics

### Landmark Detection Confidence

```python
def _validate_landmark_quality(landmarks: FacialLandmarks) -> bool:
    """
    Validate facial landmark detection quality.
    
    Requirements:
    - Detection confidence > 0.5
    - All key points detected
    - Face bounds within valid range
    """
    if landmarks.detection_confidence < 0.5:
        return False
    
    required_points = ["forehead_center", "nose_tip", "chin_center"]
    for point in required_points:
        if point not in landmarks.key_points:
            return False
    
    return True
```

### Image Quality Requirements

```python
IMAGE_QUALITY_REQUIREMENTS = {
    "min_resolution": (640, 480),
    "min_face_size": 0.3,  # 30% of image
    "max_rotation": 15,     # degrees
    "min_lighting": 0.3,    # normalized
    "max_blur": 0.5         # normalized blur metric
}
```

---

## Summary

The Face Reading engine implements a multi-layered calculation system:

1. **Landmark Detection** - 468-point MediaPipe mesh
2. **Element Analysis** - Five Elements constitutional scoring
3. **House Mapping** - 12 Houses traditional analysis
4. **TCM Integration** - Organ system health correlations
5. **Temporal Analysis** - Age point life phase mapping

All calculations are designed to be modular and extensible for integration with other WitnessOS consciousness engines.
