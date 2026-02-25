# Human Design API Specification

**REST API Documentation for Human Design Engine**  
*WitnessOS Integration Reference*

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
4. [Request Schemas](#request-schemas)
5. [Response Schemas](#response-schemas)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)
8. [Rate Limiting](#rate-limiting)

---

## API Overview

### Base URL

```
Production:  https://api.witnessOS.ai/v1/engines
Development: https://dev.witnessOS.ai/v1/engines
Local:       http://localhost:8787/v1/engines
```

### Supported Methods

- `POST /human-design/calculate` - Calculate complete chart
- `GET /human-design/reading/{reading_id}` - Retrieve cached reading
- `POST /human-design/interpret` - Get interpretation only
- `GET /human-design/gates/{gate_number}` - Get gate information

---

## Authentication

### API Key Authentication

```http
POST /v1/engines/human-design/calculate
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Obtaining API Key

```bash
# Register and get API key
curl -X POST https://api.witnessOS.ai/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'

# Response includes API key
{
  "api_key": "wos_live_abc123...",
  "user_id": "usr_xyz789"
}
```

---

## Endpoints

### 1. Calculate Human Design Chart

**Endpoint**: `POST /human-design/calculate`

**Description**: Calculate complete Human Design chart from birth data.

**Request Body**:

```json
{
  "user_id": "usr_xyz789",
  "birth_date": "1990-05-15",
  "birth_time": "14:30",
  "birth_location": [40.7128, -74.0060],
  "timezone": "America/New_York",
  "include_design_calculation": true,
  "detailed_gates": true
}
```

**Response** (200 OK):

```json
{
  "engine_name": "human_design_scanner",
  "calculation_time": 0.2543,
  "confidence_score": 0.98,
  "timestamp": "2026-01-25T10:30:00Z",
  "chart": {
    "type_info": {
      "type_name": "Generator",
      "strategy": "To Respond",
      "authority": "Sacral Authority",
      "signature": "Satisfaction",
      "not_self": "Frustration",
      "percentage": 37.0,
      "description": "Pure builders with sustainable energy",
      "life_purpose": "To master something they love"
    },
    "profile": {
      "personality_line": 1,
      "design_line": 3,
      "profile_name": "1/3 Investigator/Martyr",
      "description": "Foundation through experimentation",
      "life_theme": "Investigator theme with Martyr experimentation",
      "role": "Research and discover through trial"
    },
    "personality_gates": {
      "sun": {
        "number": 13,
        "name": "Gate of the Listener",
        "planet": "sun",
        "line": 1,
        "color": 3,
        "tone": 2,
        "base": 4,
        "keynote": "Fellowship",
        "description": "The ability to listen and synthesize",
        "gift": "Universal perspective",
        "shadow": "Secrecy"
      },
      "earth": {
        "number": 7,
        "name": "Gate of the Role",
        "planet": "earth",
        "line": 1,
        "color": 3,
        "tone": 2,
        "base": 4,
        "keynote": "Interaction",
        "description": "Leadership through interaction",
        "gift": "Guidance",
        "shadow": "Division"
      }
      // ... other planets
    },
    "design_gates": {
      "sun": {
        "number": 25,
        "name": "Gate of Innocence",
        "planet": "sun",
        "line": 4,
        "color": 2,
        "tone": 5,
        "base": 1,
        "keynote": "Universal Love",
        "description": "Spirit of the self",
        "gift": "Acceptance",
        "shadow": "Constriction"
      }
      // ... other planets
    },
    "centers": {
      "Head": {
        "name": "Head",
        "defined": false,
        "gates": [],
        "function": "Inspiration and mental pressure",
        "when_defined": "Consistent mental pressure",
        "when_undefined": "Amplifies others' mental pressure"
      },
      "Sacral": {
        "name": "Sacral",
        "defined": true,
        "gates": [5, 14, 34],
        "function": "Life force and sexuality",
        "when_defined": "Consistent life force energy",
        "when_undefined": "No consistent life force"
      }
      // ... other centers
    },
    "defined_channels": [
      "The Channel of Charisma (20-34)",
      "The Channel of Discovery (29-46)"
    ],
    "definition_type": "Single Definition",
    "incarnation_cross": {
      "name": "Right Angle Cross of the Vessel of Love",
      "type": "Right_Angle",
      "gates": {
        "conscious_sun": 13,
        "conscious_earth": 7,
        "unconscious_sun": 25,
        "unconscious_earth": 46
      },
      "theme": "Love and leadership through listening",
      "description": "Your purpose is to listen and guide..."
    }
  },
  "birth_info": {
    "datetime": "1990-05-15T14:30:00",
    "location": [40.7128, -74.0060],
    "timezone": "America/New_York"
  },
  "design_info": {
    "datetime": "1990-02-16T08:15:00",
    "calculation_method": "88 degrees solar arc",
    "solar_arc_details": {
      "method": "88_degree_solar_arc",
      "days_difference": 88,
      "actual_degrees": 88.03
    }
  },
  "formatted_output": "🌟 HUMAN DESIGN CHART ANALYSIS 🌟\n\n...",
  "recommendations": [
    "Follow your Generator strategy: To Respond",
    "Trust your Sacral Authority when making decisions",
    "Notice when you feel Satisfaction - this indicates alignment"
  ],
  "field_signature": "hd_gen_1_3_13_7_25_46_abc123",
  "reality_patches": [
    "PATCH_HD_TYPE_GENERATOR: Energetic alignment",
    "PATCH_HD_STRATEGY: To Respond protocol"
  ],
  "archetypal_themes": [
    "The Generator Archetype",
    "The 1/3 Investigator/Martyr Journey",
    "The Authentic Self"
  ]
}
```

---

### 2. Retrieve Cached Reading

**Endpoint**: `GET /human-design/reading/{reading_id}`

**Description**: Retrieve previously calculated reading.

**Request**:

```http
GET /v1/engines/human-design/reading/hd_abc123xyz
Authorization: Bearer YOUR_API_KEY
```

**Response** (200 OK):

```json
{
  "reading_id": "hd_abc123xyz",
  "user_id": "usr_xyz789",
  "created_at": "2026-01-25T10:30:00Z",
  "chart": { /* full chart data */ },
  "formatted_output": "...",
  "cached": true
}
```

---

### 3. Get Interpretation Only

**Endpoint**: `POST /human-design/interpret`

**Description**: Generate interpretation from raw chart data.

**Request Body**:

```json
{
  "chart": {
    "type_info": { /* type data */ },
    "profile": { /* profile data */ },
    "centers": { /* centers data */ }
  },
  "interpretation_style": "detailed",
  "focus_areas": ["type", "profile", "centers"]
}
```

**Response** (200 OK):

```json
{
  "interpretation": "🌟 HUMAN DESIGN CHART ANALYSIS...",
  "sections": {
    "type_analysis": "As a Generator, your strategy...",
    "profile_analysis": "Your 1/3 profile combines...",
    "centers_analysis": "With 5 defined centers..."
  }
}
```

---

### 4. Get Gate Information

**Endpoint**: `GET /human-design/gates/{gate_number}`

**Description**: Retrieve detailed information about a specific gate.

**Request**:

```http
GET /v1/engines/human-design/gates/13
Authorization: Bearer YOUR_API_KEY
```

**Response** (200 OK):

```json
{
  "gate_number": 13,
  "name": "Gate of the Listener",
  "keynote": "Fellowship",
  "description": "The ability to listen and synthesize information from others to form a universal perspective.",
  "gift": "Universal perspective and collective memory",
  "shadow": "Secrecy and withholding",
  "center": "G",
  "quarter": "Quarter of Mutation",
  "channel": "13-33: The Channel of the Prodigal",
  "circuit": "Collective - Logic",
  "lines": [
    {
      "line": 1,
      "name": "Empathy",
      "description": "The ability to feel with others"
    },
    {
      "line": 2,
      "name": "Bigotry",
      "description": "Selective listening based on prejudice"
    }
    // ... lines 3-6
  ]
}
```

---

## Request Schemas

### HumanDesignCalculateRequest

```typescript
interface HumanDesignCalculateRequest {
  // User identification
  user_id: string;                    // Required: User ID
  
  // Birth data (all required)
  birth_date: string;                 // Format: YYYY-MM-DD
  birth_time: string;                 // Format: HH:MM (24-hour)
  birth_location: [number, number];   // [latitude, longitude]
  timezone: string;                   // IANA timezone
  
  // Optional parameters
  include_design_calculation?: boolean;  // Default: true
  detailed_gates?: boolean;              // Default: true
  interpretation_style?: "brief" | "detailed" | "comprehensive";
  focus_areas?: Array<"type" | "profile" | "centers" | "gates" | "channels">;
}
```

### Validation Rules

```python
# Birth date
- Format: ISO 8601 date (YYYY-MM-DD)
- Range: 1900-01-01 to present
- Must be valid calendar date

# Birth time
- Format: HH:MM (24-hour)
- Range: 00:00 to 23:59
- Required (no null/empty)

# Birth location
- Latitude: -90 to 90 (decimal degrees)
- Longitude: -180 to 180 (decimal degrees)
- Precision: 4 decimal places recommended

# Timezone
- Format: IANA timezone database
- Examples: "America/New_York", "Europe/London", "Asia/Tokyo"
- Must be valid timezone identifier
```

---

## Response Schemas

### HumanDesignOutput

```typescript
interface HumanDesignOutput {
  // Metadata
  engine_name: string;              // "human_design_scanner"
  calculation_time: number;         // Seconds (e.g., 0.2543)
  confidence_score: number;         // 0.0 to 1.0
  timestamp: string;                // ISO 8601
  
  // Core chart
  chart: HumanDesignChart;
  
  // Calculation details
  birth_info: {
    datetime: string;               // ISO 8601
    location: [number, number];     // [lat, lon]
    timezone: string;
  };
  design_info: {
    datetime: string;               // ISO 8601
    calculation_method: string;     // "88 degrees solar arc"
    solar_arc_details: {
      method: string;
      days_difference: number;
      actual_degrees: number;
    };
  };
  
  // Interpretations
  formatted_output: string;         // Full formatted text
  type_analysis?: string;
  profile_analysis?: string;
  centers_analysis?: string;
  gates_analysis?: string;
  
  // Guidance
  strategy_guidance?: string;
  authority_guidance?: string;
  deconditioning_guidance?: string;
  recommendations: string[];
  
  // WitnessOS integration
  field_signature: string;
  reality_patches: string[];
  archetypal_themes: string[];
  
  // Raw data (optional)
  raw_data?: any;
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid birth date format",
    "details": {
      "field": "birth_date",
      "expected": "YYYY-MM-DD",
      "received": "15-05-1990"
    },
    "timestamp": "2026-01-25T10:30:00Z"
  }
}
```

### Error Codes

```typescript
enum ErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_DATE = "INVALID_DATE",
  INVALID_TIME = "INVALID_TIME",
  INVALID_LOCATION = "INVALID_LOCATION",
  INVALID_TIMEZONE = "INVALID_TIMEZONE",
  
  // Authentication errors (401)
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_API_KEY = "INVALID_API_KEY",
  EXPIRED_API_KEY = "EXPIRED_API_KEY",
  
  // Authorization errors (403)
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_CREDITS = "INSUFFICIENT_CREDITS",
  
  // Not found errors (404)
  NOT_FOUND = "NOT_FOUND",
  READING_NOT_FOUND = "READING_NOT_FOUND",
  
  // Calculation errors (500)
  CALCULATION_ERROR = "CALCULATION_ERROR",
  ASTRONOMICAL_DATA_ERROR = "ASTRONOMICAL_DATA_ERROR",
  
  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}
```

### Example Error Responses

#### Validation Error (400)

```json
{
  "error": {
    "code": "INVALID_LOCATION",
    "message": "Latitude must be between -90 and 90",
    "details": {
      "field": "birth_location[0]",
      "value": 95.0,
      "constraint": "[-90, 90]"
    },
    "timestamp": "2026-01-25T10:30:00Z"
  }
}
```

#### Authentication Error (401)

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid",
    "details": {
      "hint": "Check your API key in the dashboard"
    },
    "timestamp": "2026-01-25T10:30:00Z"
  }
}
```

#### Rate Limit Error (429)

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 100,
      "window": "1h",
      "reset_at": "2026-01-25T11:00:00Z"
    },
    "timestamp": "2026-01-25T10:30:00Z"
  }
}
```

---

## Code Examples

### Python

```python
import requests
from datetime import datetime

# Configuration
API_KEY = "wos_live_abc123..."
BASE_URL = "https://api.witnessOS.ai/v1/engines"

def calculate_human_design(
    birth_date: str,
    birth_time: str,
    latitude: float,
    longitude: float,
    timezone: str,
    user_id: str = "usr_test"
):
    """Calculate Human Design chart."""
    
    url = f"{BASE_URL}/human-design/calculate"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "user_id": user_id,
        "birth_date": birth_date,
        "birth_time": birth_time,
        "birth_location": [latitude, longitude],
        "timezone": timezone,
        "include_design_calculation": True,
        "detailed_gates": True
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        error = response.json()
        raise Exception(f"API Error: {error['error']['message']}")

# Example usage
if __name__ == "__main__":
    try:
        chart = calculate_human_design(
            birth_date="1990-05-15",
            birth_time="14:30",
            latitude=40.7128,
            longitude=-74.0060,
            timezone="America/New_York"
        )
        
        print(f"Type: {chart['chart']['type_info']['type_name']}")
        print(f"Profile: {chart['chart']['profile']['profile_name']}")
        print(f"Strategy: {chart['chart']['type_info']['strategy']}")
        
    except Exception as e:
        print(f"Error: {e}")
```

### JavaScript/TypeScript

```typescript
// types.ts
interface HumanDesignRequest {
  user_id: string;
  birth_date: string;
  birth_time: string;
  birth_location: [number, number];
  timezone: string;
  include_design_calculation?: boolean;
  detailed_gates?: boolean;
}

interface HumanDesignOutput {
  engine_name: string;
  calculation_time: number;
  confidence_score: number;
  chart: HumanDesignChart;
  formatted_output: string;
  recommendations: string[];
  // ... other fields
}

// client.ts
class HumanDesignClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://api.witnessOS.ai/v1/engines';
  }

  async calculateChart(
    request: HumanDesignRequest
  ): Promise<HumanDesignOutput> {
    const response = await fetch(
      `${this.baseUrl}/human-design/calculate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error.message}`);
    }

    return await response.json();
  }

  async getReading(readingId: string): Promise<HumanDesignOutput> {
    const response = await fetch(
      `${this.baseUrl}/human-design/reading/${readingId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reading not found: ${readingId}`);
    }

    return await response.json();
  }
}

// Example usage
const client = new HumanDesignClient('wos_live_abc123...');

async function example() {
  try {
    const chart = await client.calculateChart({
      user_id: 'usr_test',
      birth_date: '1990-05-15',
      birth_time: '14:30',
      birth_location: [40.7128, -74.0060],
      timezone: 'America/New_York',
      include_design_calculation: true,
      detailed_gates: true,
    });

    console.log('Type:', chart.chart.type_info.type_name);
    console.log('Profile:', chart.chart.profile.profile_name);
    console.log('Strategy:', chart.chart.type_info.strategy);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();
```

### cURL

```bash
#!/bin/bash

# Configuration
API_KEY="wos_live_abc123..."
BASE_URL="https://api.witnessOS.ai/v1/engines"

# Calculate chart
curl -X POST "${BASE_URL}/human-design/calculate" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr_test",
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "birth_location": [40.7128, -74.0060],
    "timezone": "America/New_York",
    "include_design_calculation": true,
    "detailed_gates": true
  }' | jq '.'

# Get cached reading
curl -X GET "${BASE_URL}/human-design/reading/hd_abc123xyz" \
  -H "Authorization: Bearer ${API_KEY}" | jq '.'

# Get gate information
curl -X GET "${BASE_URL}/human-design/gates/13" \
  -H "Authorization: Bearer ${API_KEY}" | jq '.'
```

---

## Rate Limiting

### Rate Limit Tiers

```
Free Tier:       10 calculations/hour
Starter Tier:    100 calculations/hour
Pro Tier:        1,000 calculations/hour
Enterprise:      Unlimited (custom)
```

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706184000
```

### Handling Rate Limits

```python
def calculate_with_retry(request_data):
    """Calculate with automatic retry on rate limit."""
    max_retries = 3
    retry_delay = 60  # seconds
    
    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=request_data)
            
            if response.status_code == 429:
                # Rate limited
                reset_time = int(response.headers.get('X-RateLimit-Reset', 0))
                wait_time = reset_time - time.time()
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time + 1)
                continue
            
            return response.json()
            
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                raise
```

---

## Webhook Support (Optional)

### Register Webhook

```bash
curl -X POST "${BASE_URL}/webhooks" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhooks/human-design",
    "events": ["calculation.completed", "calculation.failed"]
  }'
```

### Webhook Payload

```json
{
  "event": "calculation.completed",
  "timestamp": "2026-01-25T10:30:00Z",
  "data": {
    "reading_id": "hd_abc123xyz",
    "user_id": "usr_xyz789",
    "chart": { /* full chart data */ }
  }
}
```

---

## Testing

### Sandbox Environment

```
Base URL: https://sandbox.witnessOS.ai/v1/engines
API Key: wos_test_sandbox123...
```

### Test Data

```json
{
  "birth_date": "2000-01-01",
  "birth_time": "12:00",
  "birth_location": [0.0, 0.0],
  "timezone": "UTC"
}
```

---

## References

1. WitnessOS API Documentation
2. Human Design Engine Source Code
3. REST API Best Practices
4. OpenAPI/Swagger Specification (coming soon)

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**API Version**: v1  
**Status**: Production Ready
