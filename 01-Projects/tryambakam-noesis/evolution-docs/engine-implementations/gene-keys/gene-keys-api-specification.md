# Gene Keys API Specification

**REST API Documentation for Gene Keys Compass Engine**  
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

- `POST /gene-keys/calculate` - Calculate complete Gene Keys profile
- `GET /gene-keys/reading/{reading_id}` - Retrieve cached reading
- `POST /gene-keys/sequence` - Get specific sequence only
- `GET /gene-keys/gene-key/{number}` - Get Gene Key information
- `POST /gene-keys/pathworking` - Get pathworking guidance

---

## Authentication

### API Key Authentication

```http
POST /v1/engines/gene-keys/calculate
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

### 1. Calculate Complete Gene Keys Profile

**Endpoint**: `POST /gene-keys/calculate`

**Description**: Calculate complete Gene Keys profile with all three sequences.

**Request Body**:

```json
{
  "user_id": "usr_xyz789",
  "birth_date": "1990-05-15",
  "birth_time": "14:30",
  "birth_location": [40.7128, -74.0060],
  "timezone": "America/New_York",
  "focus_sequence": "all",
  "include_programming_partner": true,
  "pathworking_focus": null
}
```

**Response** (200 OK):

```json
{
  "engine_name": "Gene Keys Compass",
  "calculation_time": 0.18,
  "confidence_score": 0.99,
  "timestamp": "2026-01-25T10:30:00Z",
  "profile": {
    "activation_sequence": {
      "name": "Activation Sequence",
      "description": "The four primary gates that form your core genetic blueprint",
      "gates": [
        {
          "name": "Life's Work",
          "description": "Your core life purpose and creative expression",
          "gene_key": {
            "number": 25,
            "name": "The Gene Key of Universal Love",
            "shadow": "Constriction",
            "gift": "Acceptance",
            "siddhi": "Universal Love",
            "codon": "ATG-TCC",
            "amino_acid": "Methionine-Serine",
            "programming_partner": 46,
            "physiology": "Heart",
            "shadow_description": "The Shadow of Constriction manifests as emotional contraction...",
            "gift_description": "The Gift of Acceptance opens the heart to what is...",
            "siddhi_description": "The Siddhi of Universal Love radiates unconditional compassion...",
            "keywords": ["love", "acceptance", "heart", "surrender"],
            "life_theme": "Love and Surrender"
          },
          "calculation_method": "Sun position at birth"
        },
        {
          "name": "Evolution",
          "description": "Your path of personal development and growth",
          "gene_key": {
            "number": 46,
            "name": "The Gene Key of Delight",
            "shadow": "Seriousness",
            "gift": "Delight",
            "siddhi": "Ecstasy",
            "codon": "TCC-ATG",
            "amino_acid": "Serine-Methionine",
            "programming_partner": 25,
            "physiology": "Liver",
            "keywords": ["joy", "playfulness", "embodiment"],
            "life_theme": "Embodied Joy"
          },
          "calculation_method": "Earth position at birth"
        },
        {
          "name": "Radiance",
          "description": "Your gift to humanity and how you shine",
          "gene_key": {
            "number": 13,
            "name": "The Gene Key of Discernment",
            "shadow": "Discord",
            "gift": "Discernment",
            "siddhi": "Empathy"
          },
          "calculation_method": "Sun position 88 days before birth"
        },
        {
          "name": "Purpose",
          "description": "Your deepest calling and spiritual mission",
          "gene_key": {
            "number": 7,
            "name": "The Gene Key of Guidance",
            "shadow": "Division",
            "gift": "Guidance",
            "siddhi": "Virtue"
          },
          "calculation_method": "Earth position 88 days before birth"
        }
      ]
    },
    "venus_sequence": {
      "name": "Venus Sequence",
      "description": "The pathway of love and relationships",
      "gates": [
        {
          "name": "Attraction",
          "description": "What draws you to others and others to you",
          "gene_key": {
            "number": 59,
            "name": "The Gene Key of Intimacy",
            "shadow": "Dishonesty",
            "gift": "Intimacy",
            "siddhi": "Transparency"
          },
          "calculation_method": "Venus position at birth"
        },
        {
          "name": "Magnetism",
          "description": "Your natural charisma and appeal",
          "gene_key": {
            "number": 55,
            "name": "The Gene Key of Freedom",
            "shadow": "Victimization",
            "gift": "Freedom",
            "siddhi": "Freedom"
          },
          "calculation_method": "Venus position 88 days before birth"
        }
      ]
    },
    "pearl_sequence": {
      "name": "Pearl Sequence",
      "description": "The pathway of prosperity and material manifestation",
      "gates": [
        {
          "name": "Vocation",
          "description": "Your natural career path and work style",
          "gene_key": {
            "number": 32,
            "name": "The Gene Key of Preservation",
            "shadow": "Failure",
            "gift": "Preservation",
            "siddhi": "Veneration"
          },
          "calculation_method": "Jupiter position at birth"
        },
        {
          "name": "Culture",
          "description": "Your contribution to collective evolution",
          "gene_key": {
            "number": 50,
            "name": "The Gene Key of Equilibrium",
            "shadow": "Corruption",
            "gift": "Equilibrium",
            "siddhi": "Harmony"
          },
          "calculation_method": "Saturn position at birth"
        },
        {
          "name": "Brand",
          "description": "Your unique signature in the world",
          "gene_key": {
            "number": 3,
            "name": "The Gene Key of Innovation",
            "shadow": "Chaos",
            "gift": "Innovation",
            "siddhi": "Innocence"
          },
          "calculation_method": "Uranus position at birth"
        }
      ]
    },
    "birth_date": "1990-05-15",
    "primary_gene_key": {
      "number": 25,
      "name": "The Gene Key of Universal Love"
    },
    "programming_partner": {
      "number": 46,
      "name": "The Gene Key of Delight"
    }
  },
  "key_insights": [
    "Your Life's Work is Gene Key 25: Universal Love",
    "Transform Constriction (Shadow) into Acceptance (Gift)",
    "Your programming partner Gene Key 46 provides balance and perspective",
    "In relationships, you attract through Gene Key 59: Intimacy",
    "Your vocation aligns with Gene Key 32: Preservation"
  ],
  "pathworking_guidance": [
    "Begin with contemplation of your Life's Work Gene Key 25: The Gene Key of Universal Love",
    "Notice when you operate from the Shadow of Constriction and practice shifting to the Gift of Acceptance",
    "Your programming partner is Gene Key 46, study both keys together for balance",
    "Focus on your Activation Sequence to understand your core life purpose and creative expression",
    "Explore your Venus Sequence to understand your patterns in love and relationships",
    "Work with your Pearl Sequence to align your vocation with your highest purpose",
    "Practice the art of frequency shifting: awareness of Shadow, embodiment of Gift, surrender to Siddhi",
    "Remember that all three frequencies serve the evolution of consciousness"
  ],
  "guidance_summary": "Your Gene Keys reveal Universal Love as your Life's Work, guiding you to transform Constriction into Acceptance.",
  "primary_life_theme": "Love and Surrender",
  "programming_partnership": "Gene Key 25 and 46 work together",
  "field_resonance": 0.87,
  "field_signature": "gene_keys_archetypal_compass",
  "raw_data": {},
  "formatted_output": "🧬 Gene Keys Compass Reading\n\n👤 Birth Date: 1990-05-15..."
}
```

### 2. Calculate Specific Sequence

**Endpoint**: `POST /gene-keys/sequence`

**Description**: Calculate only a specific sequence (Activation, Venus, or Pearl).

**Request Body**:

```json
{
  "user_id": "usr_xyz789",
  "birth_date": "1990-05-15",
  "birth_time": "14:30",
  "birth_location": [40.7128, -74.0060],
  "timezone": "America/New_York",
  "focus_sequence": "activation"
}
```

**Response** (200 OK):

```json
{
  "engine_name": "Gene Keys Compass",
  "sequence_type": "activation",
  "sequence": {
    "name": "Activation Sequence",
    "description": "The four primary gates that form your core genetic blueprint",
    "gates": [
      {
        "name": "Life's Work",
        "gene_key": {
          "number": 25,
          "name": "The Gene Key of Universal Love"
        }
      }
      // ... other gates
    ]
  },
  "primary_gene_key": {
    "number": 25,
    "name": "The Gene Key of Universal Love",
    "shadow": "Constriction",
    "gift": "Acceptance",
    "siddhi": "Universal Love"
  }
}
```

### 3. Get Gene Key Information

**Endpoint**: `GET /gene-keys/gene-key/{number}`

**Description**: Retrieve detailed information about a specific Gene Key.

**Parameters**:
- `number` (path parameter): Gene Key number (1-64)

**Example Request**:

```bash
GET /v1/engines/gene-keys/gene-key/25
Authorization: Bearer YOUR_API_KEY
```

**Response** (200 OK):

```json
{
  "number": 25,
  "name": "The Gene Key of Universal Love",
  "shadow": "Constriction",
  "gift": "Acceptance",
  "siddhi": "Universal Love",
  "codon": "ATG-TCC",
  "amino_acid": "Methionine-Serine",
  "programming_partner": 46,
  "physiology": "Heart",
  "shadow_description": "The Shadow of Constriction manifests as emotional contraction and fear-based withdrawal from life. It creates walls around the heart, limiting your capacity for love and connection. This shadow emerges from a deep fear of vulnerability and emotional pain.",
  "gift_description": "The Gift of Acceptance is the ability to embrace life exactly as it is, without resistance. This gift opens your heart to unconditional love, first for yourself and then radiating outward to all beings. Acceptance transforms struggle into grace.",
  "siddhi_description": "The Siddhi of Universal Love is the ultimate frequency of unconditional compassion. At this level, the personal heart merges with the cosmic heart, and love flows without boundaries or conditions. This is the love that heals all wounds and unites all beings.",
  "keywords": [
    "love",
    "acceptance",
    "heart",
    "surrender",
    "compassion",
    "vulnerability"
  ],
  "life_theme": "Love and Surrender",
  "iching_hexagram": {
    "number": 25,
    "name": "Innocence",
    "binary": "100111"
  },
  "related_keys": {
    "programming_partner": 46,
    "harmonic_gate": 51,
    "physiological_correspondence": "Heart Center"
  }
}
```

### 4. Get Pathworking Guidance

**Endpoint**: `POST /gene-keys/pathworking`

**Description**: Get personalized pathworking guidance for a specific Gene Key or sequence.

**Request Body**:

```json
{
  "user_id": "usr_xyz789",
  "gene_key_number": 25,
  "pathworking_focus": "shadow_to_gift",
  "current_stage": "recognition",
  "include_practices": true
}
```

**Response** (200 OK):

```json
{
  "gene_key": {
    "number": 25,
    "name": "The Gene Key of Universal Love"
  },
  "current_frequency": "shadow",
  "target_frequency": "gift",
  "guidance": {
    "overview": "Your journey from Constriction to Acceptance begins with awareness of when your heart contracts in fear. Notice the patterns without judgment.",
    "contemplation_prompts": [
      "When do you feel Constriction in your heart?",
      "What situations trigger emotional withdrawal?",
      "How does fear limit your capacity to love?"
    ],
    "practices": [
      {
        "name": "Heart Awareness Meditation",
        "description": "Sit quietly and bring attention to your heart center. Notice any areas of tension or constriction without trying to change them.",
        "duration": "10-20 minutes daily",
        "frequency": "Daily"
      },
      {
        "name": "Shadow Journaling",
        "description": "Write about moments when you felt your heart close. Explore the fears beneath the constriction with compassion.",
        "duration": "15 minutes",
        "frequency": "3-4 times per week"
      },
      {
        "name": "Vulnerability Practice",
        "description": "Choose one small way to be more emotionally honest each day. Start with safe relationships.",
        "duration": "Ongoing",
        "frequency": "Daily micro-practices"
      }
    ],
    "programming_partner_work": {
      "partner_key": 46,
      "partner_name": "Delight",
      "integration": "Work with Gene Key 46 (Delight) to balance Acceptance with embodied joy. Seriousness (46 Shadow) often reinforces Constriction (25 Shadow)."
    },
    "stages": {
      "current": "Recognition - Becoming aware of constriction patterns",
      "next": "Embodiment - Practicing acceptance in daily life",
      "ultimate": "Transmission - Radiating Universal Love"
    }
  },
  "estimated_timeframe": "Months to years of consistent practice",
  "related_resources": [
    "The Gene Keys book by Richard Rudd",
    "Gene Keys contemplation app",
    "Online Gene Keys community"
  ]
}
```

### 5. Get Cached Reading

**Endpoint**: `GET /gene-keys/reading/{reading_id}`

**Description**: Retrieve a previously calculated Gene Keys reading.

**Parameters**:
- `reading_id` (path parameter): Unique reading identifier

**Example Request**:

```bash
GET /v1/engines/gene-keys/reading/gk_reading_abc123xyz
Authorization: Bearer YOUR_API_KEY
```

**Response** (200 OK):

```json
{
  "reading_id": "gk_reading_abc123xyz",
  "created_at": "2026-01-25T10:30:00Z",
  "user_id": "usr_xyz789",
  "profile": {
    // ... complete profile data
  },
  "cached": true,
  "cache_age_seconds": 3600
}
```

---

## Request Schemas

### GeneKeysCalculateRequest

```typescript
interface GeneKeysCalculateRequest {
  user_id: string;                    // User identifier
  birth_date: string;                 // YYYY-MM-DD format
  birth_time: string;                 // HH:MM format (24-hour)
  birth_location: [number, number];   // [latitude, longitude]
  timezone: string;                   // IANA timezone (e.g., "America/New_York")
  
  // Optional parameters
  focus_sequence?: "activation" | "venus" | "pearl" | "all";  // Default: "activation"
  include_programming_partner?: boolean;                       // Default: true
  pathworking_focus?: string;                                  // Specific area for guidance
}
```

### GeneKeysSequenceRequest

```typescript
interface GeneKeysSequenceRequest {
  user_id: string;
  birth_date: string;
  birth_time: string;
  birth_location: [number, number];
  timezone: string;
  focus_sequence: "activation" | "venus" | "pearl";  // Required, no "all" option
}
```

### PathworkingGuidanceRequest

```typescript
interface PathworkingGuidanceRequest {
  user_id: string;
  gene_key_number: number;                    // 1-64
  pathworking_focus?: "shadow_to_gift" | "gift_to_siddhi" | "complete";
  current_stage?: "recognition" | "embodiment" | "transmission";
  include_practices?: boolean;                // Default: true
}
```

---

## Response Schemas

### GeneKeysOutput

```typescript
interface GeneKeysOutput {
  // Standard engine fields
  engine_name: string;
  calculation_time: number;           // Seconds
  confidence_score: number;           // 0-1
  timestamp: string;                  // ISO 8601
  
  // Gene Keys specific data
  profile: GeneKeysProfile;
  key_insights: string[];
  pathworking_guidance: string[];
  guidance_summary: string;
  primary_life_theme: string;
  programming_partnership: string;
  
  // Field data
  field_resonance: number;            // 0-1
  field_signature: string;
  
  // Output formats
  raw_data: Record<string, any>;
  formatted_output: string;           // Human-readable text
}
```

### GeneKeysProfile

```typescript
interface GeneKeysProfile {
  activation_sequence: GeneKeysSequence;
  venus_sequence: GeneKeysSequence;
  pearl_sequence: GeneKeysSequence;
  
  birth_date: string;
  primary_gene_key: GeneKey;
  programming_partner: GeneKey;
}
```

### GeneKeysSequence

```typescript
interface GeneKeysSequence {
  name: string;
  description: string;
  gates: SequenceGate[];
}
```

### SequenceGate

```typescript
interface SequenceGate {
  name: string;
  description: string;
  gene_key: GeneKey;
  calculation_method: string;
}
```

### GeneKey

```typescript
interface GeneKey {
  number: number;                     // 1-64
  name: string;
  
  // Three Frequencies
  shadow: string;
  gift: string;
  siddhi: string;
  
  // Genetic Correlation
  codon: string;
  amino_acid: string;
  
  // Relationships
  programming_partner: number;
  physiology: string;
  
  // Descriptions
  shadow_description: string;
  gift_description: string;
  siddhi_description: string;
  
  // Metadata
  keywords: string[];
  life_theme: string;
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_BIRTH_DATA",
    "message": "Birth time is required for Gene Keys calculations",
    "details": {
      "field": "birth_time",
      "provided": null,
      "expected": "HH:MM format"
    },
    "suggestion": "Provide exact birth time in HH:MM format"
  },
  "timestamp": "2026-01-25T10:30:00Z",
  "request_id": "req_abc123"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_BIRTH_DATA` | 400 | Birth data incomplete or invalid |
| `INVALID_TIMEZONE` | 400 | Timezone format invalid |
| `INVALID_COORDINATES` | 400 | Birth location coordinates out of range |
| `INVALID_SEQUENCE` | 400 | Focus sequence value not recognized |
| `GENE_KEY_NOT_FOUND` | 404 | Requested Gene Key number not found |
| `READING_NOT_FOUND` | 404 | Reading ID does not exist |
| `CALCULATION_FAILED` | 500 | Astronomical calculation error |
| `DATA_LOADING_ERROR` | 500 | Gene Keys archetypal data unavailable |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |

### Error Handling Examples

#### Missing Birth Time

```json
{
  "error": {
    "code": "INVALID_BIRTH_DATA",
    "message": "Birth time is required for Gene Keys calculations",
    "details": {
      "field": "birth_time",
      "provided": null,
      "expected": "HH:MM format"
    }
  }
}
```

#### Invalid Timezone

```json
{
  "error": {
    "code": "INVALID_TIMEZONE",
    "message": "Invalid timezone format",
    "details": {
      "field": "timezone",
      "provided": "EST",
      "expected": "IANA timezone (e.g., 'America/New_York')"
    }
  }
}
```

#### Gene Key Not Found

```json
{
  "error": {
    "code": "GENE_KEY_NOT_FOUND",
    "message": "Gene Key number 65 does not exist",
    "details": {
      "requested": 65,
      "valid_range": "1-64"
    }
  }
}
```

---

## Code Examples

### Python Example

```python
import requests
from datetime import date, time

# Configuration
API_BASE_URL = "https://api.witnessOS.ai/v1/engines"
API_KEY = "wos_live_abc123..."

# Request data
payload = {
    "user_id": "usr_xyz789",
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "birth_location": [40.7128, -74.0060],  # New York
    "timezone": "America/New_York",
    "focus_sequence": "all",
    "include_programming_partner": True
}

# Make request
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(
    f"{API_BASE_URL}/gene-keys/calculate",
    json=payload,
    headers=headers
)

# Handle response
if response.status_code == 200:
    data = response.json()
    profile = data['profile']
    
    # Access Activation Sequence
    activation = profile['activation_sequence']
    lifes_work = activation['gates'][0]['gene_key']
    
    print(f"Life's Work: Gene Key {lifes_work['number']}")
    print(f"Name: {lifes_work['name']}")
    print(f"Shadow: {lifes_work['shadow']}")
    print(f"Gift: {lifes_work['gift']}")
    print(f"Siddhi: {lifes_work['siddhi']}")
    
    # Access pathworking guidance
    for guidance in data['pathworking_guidance']:
        print(f"• {guidance}")
else:
    error = response.json()['error']
    print(f"Error: {error['message']}")
```

### JavaScript/TypeScript Example

```typescript
// Configuration
const API_BASE_URL = "https://api.witnessOS.ai/v1/engines";
const API_KEY = "wos_live_abc123...";

// Request data
const payload = {
  user_id: "usr_xyz789",
  birth_date: "1990-05-15",
  birth_time: "14:30",
  birth_location: [40.7128, -74.0060],
  timezone: "America/New_York",
  focus_sequence: "all",
  include_programming_partner: true
};

// Make request
async function calculateGeneKeys() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/gene-keys/calculate`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    const data = await response.json();
    const profile = data.profile;

    // Access Activation Sequence
    const activation = profile.activation_sequence;
    const lifesWork = activation.gates[0].gene_key;

    console.log(`Life's Work: Gene Key ${lifesWork.number}`);
    console.log(`Name: ${lifesWork.name}`);
    console.log(`Shadow: ${lifesWork.shadow}`);
    console.log(`Gift: ${lifesWork.gift}`);
    console.log(`Siddhi: ${lifesWork.siddhi}`);

    // Display pathworking guidance
    console.log("\nPathworking Guidance:");
    data.pathworking_guidance.forEach((guidance: string) => {
      console.log(`• ${guidance}`);
    });

    return data;
  } catch (error) {
    console.error("Error calculating Gene Keys:", error);
    throw error;
  }
}

// Execute
calculateGeneKeys();
```

### cURL Example

```bash
# Complete profile calculation
curl -X POST https://api.witnessOS.ai/v1/engines/gene-keys/calculate \
  -H "Authorization: Bearer wos_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr_xyz789",
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "birth_location": [40.7128, -74.0060],
    "timezone": "America/New_York",
    "focus_sequence": "all",
    "include_programming_partner": true
  }'

# Get specific Gene Key information
curl -X GET https://api.witnessOS.ai/v1/engines/gene-keys/gene-key/25 \
  -H "Authorization: Bearer wos_live_abc123..."

# Get pathworking guidance
curl -X POST https://api.witnessOS.ai/v1/engines/gene-keys/pathworking \
  -H "Authorization: Bearer wos_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr_xyz789",
    "gene_key_number": 25,
    "pathworking_focus": "shadow_to_gift",
    "current_stage": "recognition",
    "include_practices": true
  }'

# Retrieve cached reading
curl -X GET https://api.witnessOS.ai/v1/engines/gene-keys/reading/gk_reading_abc123xyz \
  -H "Authorization: Bearer wos_live_abc123..."
```

### React Hook Example

```typescript
// useGeneKeys.ts
import { useState, useEffect } from 'react';
import type { GeneKeysOutput, GeneKeysInput } from './types';

export function useGeneKeys(input: GeneKeysInput) {
  const [data, setData] = useState<GeneKeysOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function calculate() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/gene-keys/calculate`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    calculate();
  }, [input]);

  return { data, loading, error };
}

// Usage in component
function GeneKeysProfile({ birthData }) {
  const { data, loading, error } = useGeneKeys(birthData);

  if (loading) return <div>Calculating Gene Keys...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const lifesWork = data.profile.activation_sequence.gates[0].gene_key;

  return (
    <div>
      <h2>Your Life's Work</h2>
      <h3>Gene Key {lifesWork.number}: {lifesWork.name}</h3>
      <p>Shadow: {lifesWork.shadow}</p>
      <p>Gift: {lifesWork.gift}</p>
      <p>Siddhi: {lifesWork.siddhi}</p>
    </div>
  );
}
```

---

## Rate Limiting

### Rate Limit Headers

All API responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706180400
```

### Rate Limit Tiers

| Tier | Requests per Hour | Requests per Day |
|------|-------------------|------------------|
| Free | 10 | 50 |
| Basic | 100 | 1,000 |
| Pro | 1,000 | 10,000 |
| Enterprise | Unlimited | Unlimited |

### Handling Rate Limits

```typescript
async function calculateWithRetry(payload: GeneKeysInput, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${API_URL}/gene-keys/calculate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      // Check rate limit
      if (response.status === 429) {
        const resetTime = parseInt(response.headers.get('X-RateLimit-Reset') || '0');
        const waitTime = (resetTime * 1000) - Date.now();
        
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
    }
  }
}
```

### Batch Processing

For multiple calculations, use batch requests to optimize rate limits:

```python
def calculate_batch_gene_keys(birth_data_list):
    """Calculate multiple Gene Keys profiles efficiently."""
    
    results = []
    
    # Check cache first
    cache_keys = [generate_cache_key(data) for data in birth_data_list]
    cached_results = batch_cache_get(cache_keys)
    
    # Calculate only uncached profiles
    to_calculate = [
        data for i, data in enumerate(birth_data_list)
        if cached_results[i] is None
    ]
    
    # Process in batches to respect rate limits
    batch_size = 10
    for i in range(0, len(to_calculate), batch_size):
        batch = to_calculate[i:i+batch_size]
        
        # Make parallel requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(calculate_single, data)
                for data in batch
            ]
            batch_results = [f.result() for f in futures]
        
        results.extend(batch_results)
        
        # Rate limit pause between batches
        if i + batch_size < len(to_calculate):
            time.sleep(1)  # 1 second pause
    
    return results
```

---

## Best Practices

### Caching Recommendations

1. **Cache complete profiles** - Birth data doesn't change, cache for 1 year
2. **Cache Gene Key info** - Static data, cache indefinitely with version tag
3. **Cache pathworking guidance** - Dynamic content, cache for 30 days
4. **Use ETags** - Check for data updates with conditional requests

```python
# Example caching strategy
CACHE_TTL = {
    'profile': 31536000,      # 1 year
    'gene_key': -1,           # Indefinite (with version)
    'pathworking': 2592000,   # 30 days
    'sequence': 31536000      # 1 year
}
```

### Error Recovery

```typescript
// Implement exponential backoff for retries
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // Don't retry client errors (except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;
    }
    
    // Exponential backoff
    const delay = Math.pow(2, i) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  throw lastError!;
}
```

### Validation Before Submission

```typescript
function validateGeneKeysInput(input: GeneKeysInput): string[] {
  const errors: string[] = [];
  
  // Validate birth date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(input.birth_date)) {
    errors.push("Birth date must be in YYYY-MM-DD format");
  }
  
  // Validate birth time
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(input.birth_time)) {
    errors.push("Birth time must be in HH:MM format");
  }
  
  // Validate coordinates
  const [lat, lon] = input.birth_location;
  if (lat < -90 || lat > 90) {
    errors.push("Latitude must be between -90 and 90");
  }
  if (lon < -180 || lon > 180) {
    errors.push("Longitude must be between -180 and 180");
  }
  
  // Validate focus sequence
  const validSequences = ["activation", "venus", "pearl", "all"];
  if (input.focus_sequence && !validSequences.includes(input.focus_sequence)) {
    errors.push(`Focus sequence must be one of: ${validSequences.join(", ")}`);
  }
  
  return errors;
}
```

---

## Related Documentation

- [Gene Keys Implementation Architecture](./gene-keys-implementation-architecture.md)
- [Gene Keys Cross-Engine Mappings](./gene-keys-cross-engine-mappings.md)
- [Gene Keys Calculation Formulas](./gene-keys-calculation-formulas.md)
- [Human Design API Specification](../human-design/human-design-api-specification.md)

---

*Document Version: 1.0*  
*Last Updated: 2026-01-25*  
*Source: WitnessOS Gene Keys Compass Engine*
