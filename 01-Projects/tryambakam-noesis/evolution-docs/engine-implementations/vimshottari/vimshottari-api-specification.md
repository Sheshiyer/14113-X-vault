# Vimshottari Dasha API Specification

## Overview

RESTful API for the Vimshottari Dasha Timeline Mapper Engine, providing programmatic access to Vedic Dasha calculations within the WitnessOS ecosystem.

**Base URL**: `/api/v1/engines/vimshottari`

**Authentication**: Bearer token (WitnessOS API key)

**Response Format**: JSON

---

## Endpoints

### 1. Calculate Dasha Timeline

Calculate complete Vimshottari Dasha timeline for a birth chart.

**Endpoint**: `POST /calculate`

**Request Headers**:
```http
Content-Type: application/json
Authorization: Bearer {api_key}
X-WitnessOS-Session: {session_id}  (optional)
```

**Request Body**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata",
  "current_date": "2026-01-27",
  "years_forecast": 10,
  "output_format": "detailed"
}
```

**Request Schema**:
```typescript
interface VimshottariCalculateRequest {
  birth_date: string;          // ISO 8601 date (YYYY-MM-DD)
  birth_time: string;          // ISO 8601 time (HH:MM:SS)
  birth_location: [number, number];  // [latitude, longitude]
  timezone: string;            // IANA timezone (e.g., 'Asia/Kolkata')
  current_date?: string;       // ISO 8601 date (defaults to today)
  years_forecast?: number;     // 1-50 (default: 10)
  output_format?: 'basic' | 'detailed' | 'comprehensive';
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "engine_name": "vimshottari_timeline_mapper",
  "calculation_time": 0.1247,
  "confidence_score": 0.98,
  "field_signature": "VIMSHOTTARI_19900115_1030_28.61_77.21_20260127",
  
  "timeline": {
    "birth_nakshatra": {
      "name": "Rohini",
      "pada": 2,
      "ruling_planet": "Moon",
      "degrees_in_nakshatra": 7.5234,
      "symbol": "Ox Cart",
      "deity": "Brahma",
      "nature": "Fixed",
      "meaning": "The Red One",
      "characteristics": [
        "Creative power",
        "Material prosperity",
        "Sensual beauty"
      ]
    },
    
    "current_mahadasha": {
      "planet": "Jupiter",
      "period_type": "Mahadasha",
      "start_date": "2020-03-12",
      "end_date": "2036-03-12",
      "duration_years": 16.0,
      "general_theme": "Expansion through wisdom and spiritual growth",
      "is_current": true
    },
    
    "current_antardasha": {
      "planet": "Saturn",
      "period_type": "Antardasha",
      "start_date": "2024-09-15",
      "end_date": "2027-03-28",
      "duration_years": 2.533,
      "general_theme": "Discipline, structure, and karmic lessons",
      "is_current": true
    },
    
    "current_pratyantardasha": {
      "planet": "Mercury",
      "period_type": "Pratyantardasha",
      "start_date": "2026-01-10",
      "end_date": "2026-05-22",
      "duration_years": 0.358,
      "general_theme": "Communication, learning, and intellectual development",
      "is_current": true
    },
    
    "all_mahadashas": [
      {
        "planet": "Moon",
        "period_type": "Mahadasha",
        "start_date": "1990-01-15",
        "end_date": "1994-07-23",
        "duration_years": 4.375,
        "general_theme": "Emotional intelligence and intuitive development"
      },
      {
        "planet": "Mars",
        "period_type": "Mahadasha",
        "start_date": "1994-07-23",
        "end_date": "2001-07-23",
        "duration_years": 7.0,
        "general_theme": "Action, courage, and energy mastery"
      }
      // ... additional periods
    ],
    
    "upcoming_periods": [
      {
        "planet": "Saturn",
        "period_type": "Mahadasha",
        "start_date": "2036-03-12",
        "end_date": "2055-03-12",
        "duration_years": 19.0,
        "general_theme": "Discipline, structure, and karmic lessons",
        "is_upcoming": true
      }
    ],
    
    "karmic_themes": [
      "Current karmic focus: Jupiter themes",
      "Sub-theme: Saturn influences",
      "Upcoming: Saturn period beginning 2036-03-12"
    ]
  },
  
  "birth_info": {
    "datetime": "1990-01-15T10:30:00+05:30",
    "location": [28.6139, 77.2090],
    "timezone": "Asia/Kolkata"
  },
  
  "calculation_date": "2026-01-27",
  
  "formatted_output": "🌙 VIMSHOTTARI DASHA TIMELINE ANALYSIS 🌙\n\n...",
  
  "recommendations": [
    "Study your current planetary periods to understand life themes",
    "Prepare for upcoming Dasha changes by understanding planetary energies",
    "Use favorable periods for important initiatives"
  ],
  
  "reality_patches": [
    "PATCH_DASHA_JUPITER: Alignment with Jupiter Mahadasha frequency",
    "PATCH_ANTARDASHA_SATURN: Harmonization with Saturn sub-period",
    "PATCH_KARMIC_TIMING: Synchronization with karmic timeline"
  ],
  
  "archetypal_themes": [
    "The Karmic Timeline",
    "The Rohini Foundation",
    "The Jupiter Journey",
    "The Saturn Influence",
    "The Cosmic Clock"
  ],
  
  "metadata": {
    "calculation_version": "1.0.0",
    "ephemeris_version": "Swiss Ephemeris 2.10.03",
    "ayanamsa": "Lahiri",
    "calculation_timestamp": "2026-01-27T15:42:33Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "error_code": "INVALID_INPUT",
  "message": "Invalid birth location coordinates",
  "details": {
    "field": "birth_location",
    "value": [91.0, 200.0],
    "constraint": "Latitude must be between -90 and 90, Longitude between -180 and 180"
  }
}
```

**Error Codes**:
- `INVALID_INPUT`: Input validation failed
- `INVALID_COORDINATES`: Invalid latitude/longitude
- `INVALID_TIMEZONE`: Unknown timezone identifier
- `INVALID_DATE_RANGE`: Date out of supported range (3000 BC - 3000 AD)
- `CALCULATION_ERROR`: Internal calculation error
- `EPHEMERIS_ERROR`: Swiss Ephemeris calculation failed

---

### 2. Get Current Period

Get only the current Dasha periods without full timeline calculation.

**Endpoint**: `POST /current-period`

**Request Body**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata",
  "current_date": "2026-01-27"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "calculation_time": 0.0523,
  
  "current_periods": {
    "mahadasha": {
      "planet": "Jupiter",
      "start_date": "2020-03-12",
      "end_date": "2036-03-12",
      "duration_years": 16.0,
      "years_remaining": 10.12,
      "general_theme": "Expansion through wisdom and spiritual growth"
    },
    "antardasha": {
      "planet": "Saturn",
      "start_date": "2024-09-15",
      "end_date": "2027-03-28",
      "duration_years": 2.533,
      "months_remaining": 14.03,
      "general_theme": "Discipline, structure, and karmic lessons"
    },
    "pratyantardasha": {
      "planet": "Mercury",
      "start_date": "2026-01-10",
      "end_date": "2026-05-22",
      "duration_years": 0.358,
      "days_remaining": 115,
      "general_theme": "Communication, learning, and intellectual development"
    }
  },
  
  "birth_nakshatra": {
    "name": "Rohini",
    "pada": 2,
    "ruling_planet": "Moon"
  }
}
```

---

### 3. Get Nakshatra Info

Calculate birth nakshatra without full Dasha calculation.

**Endpoint**: `POST /nakshatra`

**Request Body**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "calculation_time": 0.0234,
  
  "nakshatra": {
    "name": "Rohini",
    "number": 4,
    "pada": 2,
    "ruling_planet": "Moon",
    "moon_longitude": 47.5234,
    "degrees_in_nakshatra": 7.5234,
    "symbol": "Ox Cart",
    "deity": "Brahma",
    "nature": "Fixed",
    "element": "Earth",
    "guna": "Rajas",
    "meaning": "The Red One",
    "characteristics": [
      "Creative power",
      "Material prosperity",
      "Sensual beauty",
      "Nurturing qualities"
    ],
    "favorable_activities": [
      "Starting new ventures",
      "Agriculture and gardening",
      "Creative arts",
      "Romance and relationships"
    ]
  },
  
  "starting_dasha": {
    "planet": "Moon",
    "total_years": 10.0,
    "balance_at_birth": 4.375,
    "completed_fraction": 0.5625
  }
}
```

---

### 4. Get Timeline Range

Get Dasha periods for a specific date range.

**Endpoint**: `POST /timeline-range`

**Request Body**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata",
  "start_date": "2025-01-01",
  "end_date": "2035-12-31",
  "include_antardashas": true
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "calculation_time": 0.0847,
  
  "periods_in_range": [
    {
      "planet": "Jupiter",
      "period_type": "Mahadasha",
      "start_date": "2020-03-12",
      "end_date": "2036-03-12",
      "duration_years": 16.0,
      "antardashas": [
        {
          "planet": "Saturn",
          "start_date": "2024-09-15",
          "end_date": "2027-03-28",
          "duration_years": 2.533
        },
        {
          "planet": "Mercury",
          "start_date": "2027-03-28",
          "end_date": "2029-08-14",
          "duration_years": 2.267
        }
        // ... more antardashas
      ]
    }
  ],
  
  "transitions": [
    {
      "type": "antardasha_change",
      "date": "2027-03-28",
      "from_planet": "Saturn",
      "to_planet": "Mercury",
      "significance": "Major sub-period transition"
    }
  ]
}
```

---

### 5. Export Timeline

Export timeline in various formats.

**Endpoint**: `POST /export`

**Request Body**:
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "10:30:00",
  "birth_location": [28.6139, 77.2090],
  "timezone": "Asia/Kolkata",
  "format": "ics",
  "include_antardashas": true,
  "years_forward": 25
}
```

**Supported Formats**:
- `json`: Structured JSON
- `csv`: CSV spreadsheet
- `ics`: iCalendar format for calendar apps
- `pdf`: Formatted PDF report
- `markdown`: Markdown documentation

**Response** (200 OK):
```json
{
  "status": "success",
  "format": "ics",
  "download_url": "https://api.witnessos.org/exports/vimshottari_19900115_20260127.ics",
  "expires_at": "2026-01-28T15:42:33Z",
  "file_size_bytes": 15234
}
```

---

## Data Models

### DashaPeriod

```typescript
interface DashaPeriod {
  planet: Planet;
  period_type: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha';
  start_date: string;          // ISO 8601 date
  end_date: string;            // ISO 8601 date
  duration_years: number;
  general_theme: string;
  is_current?: boolean;
  is_upcoming?: boolean;
  years_remaining?: number;
  months_remaining?: number;
  days_remaining?: number;
}
```

### Planet

```typescript
type Planet = 
  | 'Ketu' 
  | 'Venus' 
  | 'Sun' 
  | 'Moon' 
  | 'Mars' 
  | 'Rahu' 
  | 'Jupiter' 
  | 'Saturn' 
  | 'Mercury';
```

### NakshatraInfo

```typescript
interface NakshatraInfo {
  name: string;
  number: number;              // 1-27
  pada: number;                // 1-4
  ruling_planet: Planet;
  moon_longitude: number;      // Sidereal longitude (0-360)
  degrees_in_nakshatra: number; // 0-13.333...
  symbol: string;
  deity: string;
  nature: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  guna: 'Sattva' | 'Rajas' | 'Tamas';
  meaning: string;
  characteristics: string[];
  favorable_activities: string[];
}
```

### DashaTimeline

```typescript
interface DashaTimeline {
  birth_nakshatra: NakshatraInfo;
  current_mahadasha: DashaPeriod | null;
  current_antardasha: DashaPeriod | null;
  current_pratyantardasha: DashaPeriod | null;
  all_mahadashas: DashaPeriod[];
  upcoming_periods: DashaPeriod[];
  karmic_themes: string[];
}
```

---

## Rate Limits

- **Tier 1 (Free)**: 100 requests/day
- **Tier 2 (Basic)**: 1,000 requests/day
- **Tier 3 (Pro)**: 10,000 requests/day
- **Tier 4 (Enterprise)**: Unlimited

Rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1706371200
```

---

## Webhooks

Subscribe to Dasha transition events.

**Webhook Endpoint**: Configure in dashboard

**Webhook Payload**:
```json
{
  "event_type": "dasha_transition",
  "event_id": "evt_abc123",
  "timestamp": "2027-03-28T00:00:00Z",
  "user_id": "usr_xyz789",
  
  "transition": {
    "type": "antardasha_change",
    "from_planet": "Saturn",
    "to_planet": "Mercury",
    "mahadasha_planet": "Jupiter"
  },
  
  "chart_info": {
    "birth_date": "1990-01-15",
    "birth_nakshatra": "Rohini"
  }
}
```

**Event Types**:
- `dasha_transition`: Mahadasha change
- `antardasha_transition`: Antardasha change
- `pratyantardasha_transition`: Pratyantardasha change

---

## SDK Examples

### Python

```python
from witnessos import VimshottariClient

client = VimshottariClient(api_key="your_api_key")

# Calculate timeline
result = client.calculate_timeline(
    birth_date="1990-01-15",
    birth_time="10:30:00",
    birth_location=(28.6139, 77.2090),
    timezone="Asia/Kolkata",
    years_forecast=10
)

print(f"Current Mahadasha: {result.timeline.current_mahadasha.planet}")
print(f"Theme: {result.timeline.current_mahadasha.general_theme}")
```

### JavaScript

```javascript
import { VimshottariClient } from '@witnessos/vimshottari';

const client = new VimshottariClient({ apiKey: 'your_api_key' });

// Calculate timeline
const result = await client.calculateTimeline({
  birthDate: '1990-01-15',
  birthTime: '10:30:00',
  birthLocation: [28.6139, 77.2090],
  timezone: 'Asia/Kolkata',
  yearsForecast: 10
});

console.log(`Current Mahadasha: ${result.timeline.currentMahadasha.planet}`);
```

### cURL

```bash
curl -X POST https://api.witnessos.org/api/v1/engines/vimshottari/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "birth_date": "1990-01-15",
    "birth_time": "10:30:00",
    "birth_location": [28.6139, 77.2090],
    "timezone": "Asia/Kolkata",
    "years_forecast": 10
  }'
```

---

## Security

- **HTTPS Only**: All endpoints require HTTPS
- **API Key Authentication**: Bearer token in Authorization header
- **Input Sanitization**: All inputs validated and sanitized
- **Rate Limiting**: Enforced per API key
- **Data Privacy**: Birth data never logged or stored without explicit consent

---

## Versioning

API version specified in URL path: `/api/v1/engines/vimshottari`

Breaking changes will increment major version: `/api/v2/engines/vimshottari`

Non-breaking changes (new fields, new endpoints) maintain backward compatibility.
