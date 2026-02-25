# Face Reading Cross-Engine Mappings

## Overview

The Face Reading Engine integrates with multiple WitnessOS consciousness systems through shared elemental theories, anatomical correlations, and temporal patterns.

## 1. Vedic Astrology Integration

### Elemental Correlation System

Both Chinese Five Elements and Vedic systems recognize elemental forces, with mappings that enable cross-system insights.

#### Fire Element Mapping

**Chinese Fire (火)**
- Facial Features: Triangular face, pointed chin, bright eyes
- Constitution: Enthusiastic, charismatic, social
- Temperament: Passionate, expressive

**Vedic Fire (Agni)**
- Planets: Sun, Mars
- Signs: Aries, Leo, Sagittarius
- Characteristics: Leadership, courage, spiritual fire
- Body Parts: Head, heart, solar plexus

**Correlation Strength:** 0.85

**Integration Insights:**
```python
FIRE_ELEMENT_CORRELATION = {
    "chinese_indicators": {
        "facial_features": ["triangular_face", "pointed_chin", "bright_eyes"],
        "twelve_houses": ["qi_qie_gong", "ming_gong"]  # Spouse, Life Palaces
    },
    "vedic_indicators": {
        "strong_sun": 0.9,          # Sun placement enhances Fire features
        "strong_mars": 0.85,        # Mars intensifies Fire expression
        "fire_signs_ascendant": 0.95  # Fire sign rising strongly correlates
    },
    "integration_recommendations": [
        "Sun periods enhance Fire constitutional expression",
        "Practice cooling pranayama during Fire planetary periods",
        "Mars transits intensify facial Fire characteristics"
    ]
}
```

#### Earth Element Mapping

**Chinese Earth (土)**
- Facial Features: Square face, full cheeks, stable features
- Constitution: Practical, nurturing, stable
- Temperament: Grounded, reliable

**Vedic Earth (Prithvi)**
- Planets: Mercury, Venus
- Signs: Taurus, Virgo, Capricorn
- Characteristics: Stability, material manifestation
- Body Parts: Stomach, intestines, reproductive organs

**Correlation Strength:** 0.90

**Integration Algorithm:**
```python
def calculate_earth_vedic_correlation(
    earth_percentage: float,
    vedic_chart: Dict
) -> Dict[str, Any]:
    """
    Calculate Earth element correlation between face and Vedic chart.
    """
    correlation_score = 0.0
    
    # Venus placement (beauty, harmony, Earth qualities)
    if vedic_chart.get("venus_house") in [2, 4, 7]:  # Key Earth houses
        correlation_score += earth_percentage * 0.4
    
    # Earth sign emphasis
    earth_sign_count = sum([
        vedic_chart.get("sun_sign") in ["Taurus", "Virgo", "Capricorn"],
        vedic_chart.get("moon_sign") in ["Taurus", "Virgo", "Capricorn"],
        vedic_chart.get("ascendant") in ["Taurus", "Virgo", "Capricorn"]
    ])
    correlation_score += earth_sign_count * (earth_percentage * 0.3)
    
    return {
        "correlation_score": min(correlation_score, 100.0),
        "alignment": "Strong" if correlation_score > 70 else "Moderate",
        "recommendations": _get_earth_vedic_recommendations(correlation_score)
    }
```

#### Air Element Mapping

**Chinese Wood-Metal (木金)**
- Facial Features: Rectangular face, refined features, prominent forehead
- Constitution: Intellectual, communicative
- Temperament: Adaptable, analytical

**Vedic Air (Vayu)**
- Planets: Mercury, Saturn
- Signs: Gemini, Libra, Aquarius
- Characteristics: Communication, intellect, movement
- Body Parts: Lungs, nervous system

**Correlation Strength:** 0.75

#### Water Element Mapping

**Chinese Water (水)**
- Facial Features: Round face, soft features, flowing lines
- Constitution: Intuitive, emotional
- Temperament: Adaptable, reflective

**Vedic Water (Jala)**
- Planets: Moon, Jupiter
- Signs: Cancer, Scorpio, Pisces
- Characteristics: Emotion, intuition, spirituality
- Body Parts: Kidneys, bladder, lymphatic system

**Correlation Strength:** 0.88

### Planetary-Facial Correlations

#### Sun Correlations

```python
SUN_FACIAL_CORRELATIONS = {
    "facial_indicators": {
        "landmarks": ["strong_forehead", "bright_eyes", "prominent_features"],
        "chinese_houses": ["ming_gong", "guan_lu_gong"],  # Life, Career Palaces
        "element_boost": "Fire",
        "constitution_modifier": 1.2  # Enhances Fire element by 20%
    },
    "timing_effects": {
        "sun_dasha": "Enhanced Fire expression in facial features",
        "sun_transit": "Temporary brightening of Life Palace region",
        "sun_return": "Annual facial vitality peak"
    },
    "integration_formula": """
    sun_influence = (sun_house_strength * 0.4) + 
                   (sun_sign_fire * 0.3) + 
                   (sun_aspects * 0.3)
    
    face_fire_adjusted = face_fire_percentage * (1 + sun_influence * 0.2)
    """
}
```

#### Moon Correlations

```python
MOON_FACIAL_CORRELATIONS = {
    "facial_indicators": {
        "landmarks": ["round_features", "soft_expression", "emotional_eyes"],
        "chinese_houses": ["nan_nv_gong", "fu_de_gong"],  # Children, Fortune Palaces
        "element_boost": "Water",
        "constitution_modifier": 1.15
    },
    "lunar_phase_effects": {
        "new_moon": "More introspective facial expression",
        "full_moon": "Maximum emotional radiance",
        "waxing": "Increasing Water element visibility",
        "waning": "Decreasing emotional facial expressiveness"
    },
    "timing_integration": """
    Moon phases affect Water constitutional expression:
    - Full Moon: Water percentage appears 10-15% higher
    - New Moon: Water percentage appears 5-10% lower
    - Adjust readings based on current lunar phase
    """
}
```

#### Mars Correlations

```python
MARS_FACIAL_CORRELATIONS = {
    "facial_indicators": {
        "landmarks": ["angular_features", "strong_jawline", "intense_expression"],
        "chinese_houses": ["xiong_di_gong", "ji_e_gong"],  # Siblings, Health Palaces
        "element_boost": "Wood-Fire",
        "constitution_modifier": 1.25
    },
    "mars_periods": {
        "mars_dasha": "Intensified Wood-Fire facial characteristics",
        "mars_transit": "Temporary strengthening of angular features",
        "mars_return": "Peak physical vitality expression"
    }
}
```

### Vedic House-to-Chinese House Mapping

```python
VEDIC_CHINESE_HOUSE_MAPPING = {
    "first_house": {  # Self, Personality
        "vedic_significance": "Physical appearance, self-expression",
        "chinese_correlation": "ming_gong",  # Life Palace
        "facial_region": "overall_face_forehead",
        "integration": "First house planets directly influence Life Palace expression",
        "calculation": """
        life_palace_strength = base_strength * (1 + first_house_planet_strength * 0.3)
        """
    },
    
    "second_house": {  # Wealth, Speech
        "vedic_significance": "Material wealth, communication",
        "chinese_correlation": "cai_bo_gong",  # Wealth Palace
        "facial_region": "mouth_nose_area",
        "integration": "Second house planets affect Wealth Palace and speech features",
        "calculation": """
        wealth_palace_quality = base_quality * (1 + jupiter_second_house * 0.4)
        """
    },
    
    "third_house": {  # Communication, Siblings
        "vedic_significance": "Short travels, courage, siblings",
        "chinese_correlation": "xiong_di_gong",  # Siblings Palace
        "facial_region": "eyebrow_area",
        "integration": "Third house influences communication and sibling features"
    },
    
    "fourth_house": {  # Home, Mother
        "vedic_significance": "Emotional foundation, property",
        "chinese_correlation": "tian_zhai_gong",  # Property Palace
        "facial_region": "upper_eyelids",
        "integration": "Fourth house planets influence property and emotional security"
    },
    
    "fifth_house": {  # Children, Creativity
        "vedic_significance": "Intelligence, romance, children",
        "chinese_correlation": "nan_nv_gong",  # Children Palace
        "facial_region": "under_eye_area",
        "integration": "Fifth house planets affect children and creativity features"
    },
    
    "sixth_house": {  # Health, Service
        "vedic_significance": "Health, daily work, obstacles",
        "chinese_correlation": "ji_e_gong",  # Health Palace
        "facial_region": "nose_bridge",
        "integration": "Sixth house directly influences health and constitution",
        "health_correlation": """
        health_palace_score = (
            (sixth_house_strength * 0.5) + 
            (benefic_aspects * 0.3) - 
            (malefic_aspects * 0.2)
        ) * 100
        """
    },
    
    "seventh_house": {  # Marriage, Partnerships
        "vedic_significance": "Spouse, business partnerships",
        "chinese_correlation": "qi_qie_gong",  # Spouse Palace
        "facial_region": "eye_corners",
        "integration": "Seventh house planets affect marriage features"
    },
    
    "ninth_house": {  # Higher Learning, Travel
        "vedic_significance": "Spirituality, long travels, dharma",
        "chinese_correlation": "qian_yi_gong",  # Travel Palace
        "facial_region": "temples_upper_forehead",
        "integration": "Ninth house enhances spiritual and travel features"
    },
    
    "tenth_house": {  # Career, Reputation
        "vedic_significance": "Career, public image, authority",
        "chinese_correlation": "guan_lu_gong",  # Career Palace
        "facial_region": "mid_forehead",
        "integration": "Tenth house planets directly influence career features",
        "career_correlation": """
        career_palace_strength = (
            (tenth_house_planet_strength * 0.6) + 
            (sun_influence * 0.4)
        )
        """
    },
    
    "twelfth_house": {  # Spirituality, Loss
        "vedic_significance": "Moksha, foreign lands, spirituality",
        "chinese_correlation": "fu_de_gong",  # Fortune Palace
        "facial_region": "chin_jaw_area",
        "integration": "Twelfth house influences spiritual and transcendental features"
    }
}
```

### Dasha Period Effects on Facial Features

```python
def calculate_dasha_facial_effects(
    current_dasha: Dict,
    five_elements: FiveElementsConstitution
) -> Dict[str, Any]:
    """
    Calculate how current Vedic Dasha period affects facial expression.
    
    Dasha periods can temporarily modify constitutional expression.
    """
    dasha_effects = {
        "Sun": {
            "element_boost": {"Fire": 1.2},
            "facial_changes": "Enhanced Fire features, brighter expression",
            "houses_affected": ["ming_gong", "guan_lu_gong"],
            "duration_awareness": "Leadership qualities more prominent"
        },
        "Moon": {
            "element_boost": {"Water": 1.15},
            "facial_changes": "Softer features, more emotional expression",
            "houses_affected": ["nan_nv_gong", "fu_de_gong"],
            "duration_awareness": "Nurturing appearance enhanced"
        },
        "Mars": {
            "element_boost": {"Wood": 1.15, "Fire": 1.1},
            "facial_changes": "Stronger jawline, more intense expression",
            "houses_affected": ["xiong_di_gong", "ji_e_gong"],
            "duration_awareness": "Dynamic energy more visible"
        },
        "Mercury": {
            "element_boost": {"Metal": 1.2, "Air": 1.15},
            "facial_changes": "More refined features, youthful appearance",
            "houses_affected": ["xiong_di_gong", "qian_yi_gong"],
            "duration_awareness": "Intellectual expression enhanced"
        },
        "Jupiter": {
            "element_boost": {"Water": 1.2, "Earth": 1.1},
            "facial_changes": "Fuller features, wise expression, spiritual glow",
            "houses_affected": ["fu_de_gong", "guan_lu_gong"],
            "duration_awareness": "Wisdom and generosity more apparent"
        },
        "Venus": {
            "element_boost": {"Earth": 1.25, "Water": 1.1},
            "facial_changes": "More harmonious features, enhanced attractiveness",
            "houses_affected": ["qi_qie_gong", "xiang_mao_gong"],
            "duration_awareness": "Beauty and harmony peak period"
        },
        "Saturn": {
            "element_boost": {"Metal": 1.2, "Earth": 1.15},
            "facial_changes": "More structured features, mature expression",
            "houses_affected": ["ji_e_gong", "guan_lu_gong"],
            "duration_awareness": "Disciplined appearance, aging effects"
        }
    }
    
    planet = current_dasha["mahadasha"]
    effect = dasha_effects.get(planet, {})
    
    # Apply element boosts
    adjusted_elements = five_elements.dict()
    for element, boost in effect.get("element_boost", {}).items():
        element_key = f"{element.lower()}_percentage"
        if element_key in adjusted_elements:
            adjusted_elements[element_key] *= boost
    
    # Renormalize to 100%
    total = sum([
        adjusted_elements.get("wood_percentage", 0),
        adjusted_elements.get("fire_percentage", 0),
        adjusted_elements.get("earth_percentage", 0),
        adjusted_elements.get("metal_percentage", 0),
        adjusted_elements.get("water_percentage", 0)
    ])
    
    for key in ["wood_percentage", "fire_percentage", "earth_percentage", 
                "metal_percentage", "water_percentage"]:
        if key in adjusted_elements:
            adjusted_elements[key] = (adjusted_elements[key] / total) * 100
    
    return {
        "dasha_period": planet,
        "adjusted_elements": adjusted_elements,
        "facial_changes": effect.get("facial_changes"),
        "houses_affected": effect.get("houses_affected"),
        "awareness": effect.get("duration_awareness")
    }
```

## 2. TCM Organ System Integration

### Organ-Facial Region Mapping

Based on complete correlation data from `tcm_face_correlations.json`.

```python
TCM_FACE_INTEGRATION = {
    "liver_gallbladder": {
        "element": "Wood",
        "facial_region": "eyebrow_area",
        "chinese_house": "xiong_di_gong",
        "mediapipe_landmarks": [70, 63, 105, 66, 300, 293, 334, 296],
        
        "health_indicators": {
            "healthy_signs": [
                "well_shaped_eyebrows",
                "good_color",
                "symmetrical",
                "appropriate_thickness"
            ],
            "imbalance_signs": [
                "sparse_eyebrows",
                "uneven_growth",
                "poor_color",
                "excessive_thickness"
            ]
        },
        
        "tcm_correlations": {
            "emotions": ["anger", "frustration", "irritability", "patience"],
            "physical_signs": [
                "eye_health",
                "nail_quality",
                "muscle_flexibility",
                "menstrual_regularity"
            ],
            "optimal_times": ["3am-7am", "spring_season", "wood_hours"]
        },
        
        "calculation_formula": """
        liver_health_score = (
            (wood_percentage * 0.6) + 
            (xiong_di_gong_harmony * 40 * 0.4)
        )
        
        # Adjust for seasonal influence
        if current_season == "spring":
            liver_health_score *= 1.1  # 10% boost in spring
        """
    },
    
    "heart_small_intestine": {
        "element": "Fire",
        "facial_region": "eye_area",
        "chinese_house": "qi_qie_gong",
        "mediapipe_landmarks": [33, 133, 362, 263, 159, 145, 386, 374],
        
        "health_indicators": {
            "healthy_signs": [
                "bright_clear_eyes",
                "good_circulation_color",
                "joyful_expression"
            ],
            "imbalance_signs": [
                "dull_eyes",
                "dark_circles",
                "red_complexion",
                "excessive_lines"
            ]
        },
        
        "tcm_correlations": {
            "emotions": ["joy", "overexcitement", "anxiety", "restlessness"],
            "physical_signs": [
                "circulation",
                "speech_clarity",
                "sleep_quality",
                "mental_clarity"
            ],
            "optimal_times": ["11am-3pm", "summer_season", "fire_hours"]
        },
        
        "calculation_formula": """
        heart_health_score = (
            (fire_percentage * 0.6) + 
            (qi_qie_gong_harmony * 40 * 0.4)
        )
        
        # Peak during summer
        if current_season == "summer":
            heart_health_score *= 1.15
        """
    },
    
    "spleen_stomach": {
        "element": "Earth",
        "facial_region": "cheek_mouth_area",
        "chinese_house": "cai_bo_gong",
        "mediapipe_landmarks": [116, 345, 205, 425, 61, 291],
        
        "health_indicators": {
            "healthy_signs": [
                "full_cheeks",
                "good_lip_color",
                "stable_features"
            ],
            "imbalance_signs": [
                "sunken_cheeks",
                "pale_lips",
                "digestive_lines",
                "weak_jaw"
            ]
        },
        
        "tcm_correlations": {
            "emotions": ["worry", "pensiveness", "overthinking", "stability"],
            "physical_signs": [
                "digestion",
                "appetite",
                "muscle_tone",
                "energy_levels"
            ],
            "optimal_times": ["7am-11am", "late_summer", "earth_hours"]
        },
        
        "calculation_formula": """
        spleen_health_score = (
            (earth_percentage * 0.6) + 
            (cai_bo_gong_harmony * 40 * 0.4)
        )
        
        # Enhanced during late summer (Earth season)
        if current_season == "late_summer":
            spleen_health_score *= 1.12
        """
    },
    
    "lung_large_intestine": {
        "element": "Metal",
        "facial_region": "nose_area",
        "chinese_house": "ji_e_gong",
        "mediapipe_landmarks": [1, 2, 98, 327, 6, 197, 195],
        
        "health_indicators": {
            "healthy_signs": [
                "well_formed_nose",
                "clear_skin",
                "good_proportion"
            ],
            "imbalance_signs": [
                "blocked_nose",
                "skin_issues",
                "pale_complexion",
                "weak_structure"
            ]
        },
        
        "tcm_correlations": {
            "emotions": ["grief", "sadness", "letting_go", "righteousness"],
            "physical_signs": [
                "breathing",
                "skin_health",
                "elimination",
                "immune_function"
            ],
            "optimal_times": ["3pm-7pm", "autumn_season", "metal_hours"]
        },
        
        "calculation_formula": """
        lung_health_score = (
            (metal_percentage * 0.6) + 
            (ji_e_gong_harmony * 40 * 0.4)
        )
        
        # Strengthened in autumn
        if current_season == "autumn":
            lung_health_score *= 1.1
        """
    },
    
    "kidney_bladder": {
        "element": "Water",
        "facial_region": "chin_jaw_area",
        "chinese_house": "fu_de_gong",
        "mediapipe_landmarks": [175, 152, 377, 400, 199],
        
        "health_indicators": {
            "healthy_signs": [
                "strong_chin",
                "good_bone_structure",
                "lustrous_appearance"
            ],
            "imbalance_signs": [
                "weak_chin",
                "poor_bone_density",
                "dark_circles",
                "premature_aging"
            ]
        },
        
        "tcm_correlations": {
            "emotions": ["fear", "fright", "willpower", "wisdom"],
            "physical_signs": [
                "bone_health",
                "reproductive_function",
                "hearing",
                "hair_quality"
            ],
            "optimal_times": ["7pm-11pm", "winter_season", "water_hours"]
        },
        
        "calculation_formula": """
        kidney_health_score = (
            (water_percentage * 0.6) + 
            (fu_de_gong_harmony * 40 * 0.4)
        )
        
        # Peak during winter
        if current_season == "winter":
            kidney_health_score *= 1.15
        """
    }
}
```

### TCM Meridian Facial Mapping

```python
MERIDIAN_FACE_MAPPING = {
    "stomach_meridian": {
        "facial_path": "forehead_to_jaw_lateral",
        "mediapipe_points": ["ST1", "ST2", "ST3", "ST4", "ST5", "ST6", "ST7"],
        "approximate_landmarks": [127, 234, 156, 70, 63, 105, 52],
        "correlation": "Overall facial muscle tone and digestive appearance",
        "health_indicators": "Facial muscle strength, jaw function"
    },
    
    "large_intestine_meridian": {
        "facial_path": "nose_to_mouth_corner",
        "mediapipe_points": ["LI19", "LI20"],
        "approximate_landmarks": [98, 327],
        "correlation": "Nose area and elimination function",
        "health_indicators": "Nasal health, skin clarity"
    },
    
    "gallbladder_meridian": {
        "facial_path": "temple_to_jaw_angle",
        "mediapipe_points": ["GB1", "GB2", "GB3", "GB4", "GB5", "GB6", "GB7"],
        "approximate_landmarks": [21, 251, 54, 284, 103, 332],
        "correlation": "Temple and jaw areas",
        "health_indicators": "Decision making, bile function, temporal tension"
    }
}
```

### Constitutional Recommendations Integration

```python
def generate_tcm_recommendations(
    five_elements: FiveElementsConstitution,
    tcm_organ_scores: Dict[str, float],
    current_season: str
) -> List[str]:
    """
    Generate TCM-based recommendations considering:
    - Constitutional type
    - Organ health scores
    - Current season
    """
    recommendations = []
    
    # Dominant element recommendations
    if five_elements.dominant_element == "Wood":
        recommendations.extend([
            "Support liver-gallbladder during spring season",
            "Practice stress management for qi flow",
            "Eye exercises for liver blood nourishment"
        ])
        
        # Check liver health score
        if tcm_organ_scores["liver_gallbladder"] < 65:
            recommendations.append(
                "⚠️ Consider liver-supportive herbs and practices"
            )
    
    elif five_elements.dominant_element == "Fire":
        recommendations.extend([
            "Heart-calming practices during summer",
            "Cooling foods to balance Fire constitution",
            "Sleep regulation for heart health"
        ])
        
        if tcm_organ_scores["heart_small_intestine"] < 70:
            recommendations.append(
                "⚠️ Focus on heart-calming meditation and cooling pranayama"
            )
    
    elif five_elements.dominant_element == "Earth":
        recommendations.extend([
            "Digestive support in late summer",
            "Regular meal times for spleen-stomach stability",
            "Grounding practices for Earth energy"
        ])
        
        if tcm_organ_scores["spleen_stomach"] < 68:
            recommendations.append(
                "⚠️ Strengthen digestive fire with warming foods"
            )
    
    elif five_elements.dominant_element == "Metal":
        recommendations.extend([
            "Lung strengthening in autumn season",
            "Breathing exercises for lung qi",
            "Moistening foods for Metal balance"
        ])
        
        if tcm_organ_scores["lung_large_intestine"] < 65:
            recommendations.append(
                "⚠️ Practice pranayama for respiratory health"
            )
    
    elif five_elements.dominant_element == "Water":
        recommendations.extend([
            "Kidney tonification in winter",
            "Warming foods for kidney yang",
            "Rest and recovery for jing preservation"
        ])
        
        if tcm_organ_scores["kidney_bladder"] < 70:
            recommendations.append(
                "⚠️ Focus on kidney-supporting practices and rest"
            )
    
    # Seasonal optimization
    seasonal_recommendations = {
        "spring": "Emphasize liver-gallbladder support (Wood season)",
        "summer": "Focus on heart-calming practices (Fire season)",
        "late_summer": "Strengthen digestion (Earth season)",
        "autumn": "Support respiratory health (Metal season)",
        "winter": "Tonify kidneys and rest (Water season)"
    }
    
    recommendations.append(seasonal_recommendations.get(current_season, ""))
    
    return recommendations
```

## 3. Biofield Overlay Integration

### Consciousness Alignment Calculation

```python
def calculate_consciousness_alignment(
    five_elements: FiveElementsConstitution,
    twelve_houses: TwelveHousesAnalysis,
    vedic_correlation: Dict,
    tcm_correlation: Dict
) -> float:
    """
    Calculate overall consciousness alignment score (0-1).
    
    Integrates:
    - Facial harmony
    - Elemental balance
    - Vedic-TCM coherence
    """
    # Facial harmony (0-1)
    facial_harmony = twelve_houses.overall_harmony
    
    # Elemental balance (lower variance = more balanced)
    element_percentages = [
        five_elements.wood_percentage,
        five_elements.fire_percentage,
        five_elements.earth_percentage,
        five_elements.metal_percentage,
        five_elements.water_percentage
    ]
    element_variance = np.var(element_percentages)
    element_balance = 1.0 - (element_variance / 400.0)  # Normalize
    
    # Vedic coherence
    vedic_coherence = np.mean(list(vedic_correlation["element_correlations"].values()))
    
    # TCM coherence
    tcm_coherence = np.mean(list(tcm_correlation["organ_health_scores"].values())) / 100.0
    
    # Weighted combination
    consciousness_alignment = (
        (facial_harmony * 0.3) +
        (element_balance * 0.25) +
        (vedic_coherence * 0.25) +
        (tcm_coherence * 0.2)
    )
    
    return min(max(consciousness_alignment, 0.0), 1.0)
```

### Breathwork Optimization

```python
def generate_breathwork_recommendations(
    five_elements: FiveElementsConstitution,
    current_imbalances: List[str]
) -> List[str]:
    """
    Generate constitutional breathwork recommendations.
    """
    recommendations = []
    
    # Dominant element breathwork
    element_breathwork = {
        "Wood": [
            "Dynamic breath of fire for Wood vitality",
            "Alternate nostril breathing for balance",
            "4-7-8 breath for liver calming"
        ],
        "Fire": [
            "Cooling Shitali pranayama",
            "Lunar (left nostril) breathing",
            "Extended exhale for Fire calming"
        ],
        "Earth": [
            "Grounding 4-4-4-4 box breathing",
            "Diaphragmatic breathing for digestion",
            "Slow, steady breath for Earth stability"
        ],
        "Metal": [
            "Full yogic breath for lung capacity",
            "Kapalabhati for lung cleansing",
            "Measured breath for Metal refinement"
        ],
        "Water": [
            "Ocean breath (Ujjayi) for flow",
            "Cooling breath for Water balance",
            "Slow, deep breathing for kidney support"
        ]
    }
    
    recommendations.extend(
        element_breathwork.get(five_elements.dominant_element, [])
    )
    
    return recommendations
```

## 4. VedicClock-TCM Temporal Integration

### Optimal Analysis Timing

```python
def calculate_optimal_reading_time(
    birth_chart: Dict,
    constitution: FiveElementsConstitution
) -> Dict[str, Any]:
    """
    Determine optimal times for face reading analysis.
    
    Considers:
    - TCM organ clock
    - Vedic planetary hours
    - Constitutional element timing
    """
    from datetime import datetime, time
    
    optimal_times = []
    
    # Dominant element optimal times
    element_times = {
        "Wood": [(3, 7), "Liver-Gallbladder hours (3am-7am)"],
        "Fire": [(11, 15), "Heart-Small Intestine hours (11am-3pm)"],
        "Earth": [(7, 11), "Spleen-Stomach hours (7am-11am)"],
        "Metal": [(15, 19), "Lung-Large Intestine hours (3pm-7pm)"],
        "Water": [(19, 23), "Kidney-Bladder hours (7pm-11pm)"]
    }
    
    element = constitution.dominant_element
    time_range, description = element_times.get(element, ((9, 17), "Daytime hours"))
    
    optimal_times.append({
        "time_range": time_range,
        "description": description,
        "reason": f"Constitutional {element} element peak"
    })
    
    # Vedic planetary hours (if beneficial planet strong)
    # Add implementation based on birth chart
    
    return {
        "optimal_windows": optimal_times,
        "seasonal_consideration": _get_seasonal_timing(element),
        "lunar_consideration": _get_lunar_timing(birth_chart)
    }
```

## Summary

The Face Reading Engine integrates with:

1. **Vedic Astrology** - Planetary-facial correlations, elemental mapping, Dasha period effects
2. **TCM** - Organ-facial regions, meridian mapping, seasonal optimization
3. **Biofield** - Consciousness alignment, breathwork recommendations
4. **VedicClock** - Optimal timing for analysis and practices

All integrations use normalized correlation scores and provide actionable, cross-system recommendations for consciousness optimization.
