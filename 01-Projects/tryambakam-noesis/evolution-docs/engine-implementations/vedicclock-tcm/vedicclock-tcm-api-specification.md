# VedicClock-TCM API Specification

## Overview

RESTful API for real-time consciousness optimization using the VedicClock-TCM Integration Engine.

**Base URL**: `/api/v1/engines/vedicclock-tcm`

**Authentication**: Bearer token

**Response Format**: JSON

---

## Endpoints

### 1. Real-time Optimization Analysis

Calculate current consciousness optimization state.

**Endpoint**: `POST /optimize`

**Request**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata",
  "target_date": "2026-01-27",
  "target_time": "17:30:00",
  "analysis_depth": "detailed",
  "optimization_focus": ["energy", "spiritual"],
  "include_predictions": true,
  "prediction_hours": 24
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "engine_name": "VedicClock-TCM Integration",
  "calculation_time": 0.0847,
  "confidence_score": 0.92,
  
  "vimshottari_context": {
    "mahadasha_lord": "Jupiter",
    "mahadasha_remaining_years": 10.2,
    "antardasha_lord": "Saturn",
    "antardasha_remaining_months": 14.5,
    "pratyantardasha_lord": "Mercury",
    "life_lesson_theme": "Expansion through wisdom and spiritual growth",
    "karmic_focus": "Teaching, mentoring, and sharing wisdom"
  },
  
  "panchanga_state": {
    "tithi": "Ekadashi",
    "vara": "Monday",
    "nakshatra": "Rohini",
    "yoga": "Vishkumbha",
    "karana": "Bava",
    "dominant_element": "Water",
    "energy_quality": "Stable Energy",
    "auspiciousness_score": 0.82
  },
  
  "tcm_organ_state": {
    "primary_organ": "Kidney",
    "secondary_organ": "Bladder",
    "element": "Water",
    "energy_direction": "peak",
    "optimal_activities": [
      "Willpower exercises",
      "Kidney nourishing",
      "Water activities",
      "Essence cultivation"
    ],
    "avoid_activities": [
      "Excessive fear",
      "Kidney stress",
      "Overexertion"
    ]
  },
  
  "elemental_synthesis": {
    "vedic_element": "Water",
    "tcm_element": "Water",
    "harmony_level": 1.0,
    "synthesis_quality": "Perfect Harmony",
    "recommended_practices": [
      "Flow meditation",
      "Water ceremony rituals",
      "Emotional flow practices",
      "Willpower and wisdom cultivation"
    ]
  },
  
  "consciousness_optimization": {
    "primary_focus": "Expansion through wisdom and spiritual growth through Water element mastery",
    "secondary_focuses": [
      "Harmonizing Water-Water energies",
      "Optimizing Kidney function",
      "Integrating cosmic and bodily rhythms"
    ],
    "optimal_practices": [
      "Flow meditation",
      "Water ceremony rituals",
      "Willpower exercises",
      "Kidney nourishing"
    ],
    "timing_guidance": "Best practiced during peak phase of Kidney time",
    "energy_management": "Work with stable energy while supporting Water element",
    "integration_method": "Combine daily practices with moment-by-moment awareness of energy shifts"
  },
  
  "personal_resonance_score": 0.87,
  "optimal_energy_window": true,
  
  "upcoming_windows": [
    {
      "start_time": "2026-01-27T19:00:00+05:30",
      "end_time": "2026-01-27T21:00:00+05:30",
      "opportunity_type": "Fire Element Optimization",
      "energy_quality": "peak - Pericardium",
      "recommended_activities": [
        "Heart protection practices",
        "Gentle circulation",
        "Emotional balance"
      ],
      "potency_score": 0.82
    }
  ],
  
  "daily_curriculum": "Today's Consciousness Curriculum: Expansion through wisdom through Water element mastery. Context: Jupiter Dasha - Expansion through wisdom and spiritual growth.",
  
  "homework_practices": [
    "Flow meditation",
    "Water ceremony rituals",
    "Willpower exercises",
    "Morning energy assessment",
    "Hourly consciousness check-ins",
    "Evening integration reflection"
  ],
  
  "progress_indicators": [
    "Increased awareness of energy shifts throughout the day",
    "Better alignment between activities and optimal timing",
    "Enhanced integration of spiritual practices with daily life",
    "Deeper understanding of Jupiter dasha lessons",
    "Improved harmony between mind, body, and cosmic rhythms"
  ],
  
  "formatted_output": "🕐 VEDICCLOCK-TCM CONSCIOUSNESS OPTIMIZATION REPORT\n\n..."
}
```

---

### 2. Get Current Organ Clock State

Get only TCM organ clock state without full synthesis.

**Endpoint**: `POST /organ-clock`

**Request**:
```json
{
  "datetime": "2026-01-27T17:30:00",
  "timezone": "Asia/Kolkata"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "timestamp": "2026-01-27T17:30:00+05:30",
  
  "current_organ": {
    "primary": "Kidney",
    "secondary": "Bladder",
    "element": "Water",
    "energy_phase": "peak",
    "consciousness_theme": "Cultivating willpower and life essence"
  },
  
  "optimal_activities": [
    "Willpower exercises",
    "Kidney nourishing",
    "Water activities",
    "Essence cultivation"
  ],
  
  "avoid_activities": [
    "Excessive fear",
    "Kidney stress",
    "Overexertion",
    "Essence depletion"
  ],
  
  "next_transition": {
    "time": "2026-01-27T19:00:00+05:30",
    "to_organ": "Pericardium",
    "to_element": "Fire"
  }
}
```

---

### 3. Get Optimization Windows

Retrieve future optimization opportunities.

**Endpoint**: `POST /windows`

**Request**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata",
  "start_datetime": "2026-01-27T18:00:00",
  "hours_ahead": 48,
  "min_potency": 0.7
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "windows": [
    {
      "start_time": "2026-01-28T05:00:00+05:30",
      "end_time": "2026-01-28T07:00:00+05:30",
      "opportunity_type": "Metal Element Optimization",
      "energy_quality": "peak - Lung",
      "organ": "Lung",
      "element": "Metal",
      "recommended_activities": [
        "Breathing exercises",
        "Fresh air activities",
        "Letting go practices",
        "Inspiration work"
      ],
      "potency_score": 0.92,
      "consciousness_theme": "Inspiration and release of what no longer serves"
    }
  ]
}
```

---

### 4. Elemental Harmony Check

Check harmony between Vedic and TCM elements.

**Endpoint**: `POST /elemental-harmony`

**Request**:
```json
{
  "vedic_element": "Water",
  "tcm_element": "Water",
  "include_practices": true
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "vedic_element": "Water",
  "tcm_element": "Water",
  "harmony_level": 1.0,
  "synthesis_quality": "Perfect Harmony",
  "description": "Vedic Water and TCM Water create ultimate flow",
  "optimal_times": ["15:00-19:00"],
  "consciousness_theme": "Pure water consciousness - flow, wisdom, and emotional mastery",
  "recommended_practices": [
    "Flow meditation",
    "Water ceremony rituals",
    "Emotional flow practices",
    "Willpower and wisdom cultivation"
  ]
}
```

---

### 5. Daily Consciousness Curriculum

Get personalized daily consciousness practice plan.

**Endpoint**: `POST /daily-curriculum`

**Request**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata",
  "date": "2026-01-27"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "date": "2026-01-27",
  
  "daily_curriculum": {
    "primary_focus": "Expansion through wisdom and spiritual growth",
    "dasha_context": "Jupiter Mahadasha - Saturn Antardasha",
    "life_lesson": "Building lasting foundations through disciplined wisdom",
    "integration_method": "Combine daily practices with moment-by-moment awareness"
  },
  
  "hourly_schedule": [
    {
      "time_range": "05:00-07:00",
      "organ": "Large Intestine",
      "element": "Metal",
      "activities": ["Morning elimination", "Releasing practices", "Decluttering"],
      "consciousness_theme": "Physical and mental elimination of toxins"
    },
    {
      "time_range": "07:00-09:00",
      "organ": "Stomach",
      "element": "Earth",
      "activities": ["Nutritious breakfast", "Grounding exercises"],
      "consciousness_theme": "Nourishing body and mind"
    }
  ],
  
  "homework_practices": [
    "Morning energy assessment",
    "Hourly consciousness check-ins",
    "Evening integration reflection",
    "Flow meditation",
    "Water ceremony"
  ],
  
  "progress_indicators": [
    "Increased awareness of energy shifts",
    "Better timing alignment",
    "Enhanced spiritual integration"
  ]
}
```

---

## Data Models

### VedicClockTCMInput

```typescript
interface VedicClockTCMInput {
  // Required birth data
  birth_date: string;          // ISO 8601: "YYYY-MM-DD"
  birth_time: string;          // "HH:MM:SS"
  birth_location: [number, number];  // [lat, lon]
  timezone: string;            // IANA timezone
  
  // Analysis parameters
  target_date?: string;        // Defaults to today
  target_time?: string;        // Defaults to now
  analysis_depth?: 'basic' | 'detailed' | 'comprehensive';
  
  // Optimization focus
  optimization_focus?: string[];  // ['energy', 'creativity', 'health', 'spiritual', 'career']
  
  // Predictions
  include_predictions?: boolean;  // Default: true
  prediction_hours?: number;      // 1-168 hours
}
```

### VedicClockTCMOutput

```typescript
interface VedicClockTCMOutput {
  status: string;
  engine_name: string;
  calculation_time: number;
  confidence_score: number;
  
  vimshottari_context: VimshottariContext;
  panchanga_state: PanchangaState;
  tcm_organ_state: TCMOrganState;
  elemental_synthesis: ElementalSynthesis;
  consciousness_optimization: ConsciousnessOptimization;
  
  personal_resonance_score: number;
  optimal_energy_window: boolean;
  
  upcoming_windows?: OptimizationWindow[];
  
  daily_curriculum: string;
  homework_practices: string[];
  progress_indicators: string[];
  
  formatted_output: string;
}
```

---

## Rate Limits

- **Free**: 50 requests/day
- **Basic**: 500 requests/day
- **Pro**: 5,000 requests/day
- **Enterprise**: Unlimited

---

## Webhooks

Subscribe to optimal energy window notifications.

**Event Types**:
- `optimal_window_starting`: 15 minutes before optimal window
- `organ_transition`: Major organ transition (2-hour window change)
- `dasha_transition`: Dasha period change
- `high_resonance_detected`: Personal resonance > 0.8

---

## SDK Examples

### Python

```python
from witnessos import VedicClockTCMClient

client = VedicClockTCMClient(api_key="your_api_key")

result = client.optimize(
    birth_date="1990-01-15",
    birth_time="10:30:00",
    birth_location=(28.6139, 77.2090),
    timezone="Asia/Kolkata"
)

print(f"Current Organ: {result.tcm_organ_state.primary_organ}")
print(f"Resonance: {result.personal_resonance_score:.1%}")
print(f"Optimal Window: {result.optimal_energy_window}")
```

### JavaScript

```javascript
import { VedicClockTCMClient } from '@witnessos/vedicclock-tcm';

const client = new VedicClockTCMClient({ apiKey: 'your_api_key' });

const result = await client.optimize({
  birthDate: '1990-01-15',
  birthTime: '10:30:00',
  birthLocation: [28.6139, 77.2090],
  timezone: 'Asia/Kolkata'
});

console.log(`Current Organ: ${result.tcmOrganState.primaryOrgan}`);
```

---

## Security

- **HTTPS Only**: All endpoints require HTTPS
- **Rate Limiting**: Enforced per API key
- **Data Privacy**: Birth data never stored without consent
- **CORS**: Configurable for web applications

---

## Versioning

- **Current**: v1
- **Stability**: Production-ready
- **Breaking Changes**: Will increment to v2

---

## Support

- **Documentation**: https://docs.witnessos.org/vedicclock-tcm
- **API Status**: https://status.witnessos.org
- **Email**: support@witnessos.org
