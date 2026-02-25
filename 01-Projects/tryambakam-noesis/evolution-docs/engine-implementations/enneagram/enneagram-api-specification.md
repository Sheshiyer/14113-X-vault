# Enneagram Engine API Specification

## Overview

The Enneagram Resonator Engine provides RESTful API endpoints for personality type assessment, analysis, and growth guidance based on the Enneagram system.

## Base Configuration

**Engine Name:** `enneagram`  
**API Version:** `v1`  
**Base Path:** `/api/v1/engines/enneagram`  
**Authentication:** Required (user_id from CloudflareEngineInput)

## Core Endpoints

### 1. Type Discovery & Assessment

#### POST /analyze

**Description:** Perform Enneagram type analysis using one of three identification methods.

**Request Body:**
```json
{
  "user_id": "user_12345",
  "identification_method": "assessment",
  "assessment_responses": {
    "q1": "5",
    "q2": "5",
    "q3": "7",
    "q4": "5"
  },
  "include_wings": true,
  "include_instincts": true,
  "include_arrows": true,
  "focus_area": "growth"
}
```

**Identification Methods:**

1. **Assessment Method:**
```json
{
  "identification_method": "assessment",
  "assessment_responses": {
    "q1": "5",
    "q2": "5",
    "q3": "7"
  }
}
```

2. **Self-Select Method:**
```json
{
  "identification_method": "self_select",
  "selected_type": 5
}
```

3. **Intuitive Method:**
```json
{
  "identification_method": "intuitive",
  "behavioral_description": "I am analytical, withdrawn, and need time alone to process information. I fear being incompetent or overwhelmed by demands. I conserve my energy and resources carefully."
}
```

**Response:**
```json
{
  "engine_name": "Enneagram Resonator",
  "calculation_time": 0.234,
  "confidence_score": 0.85,
  "timestamp": "2024-01-15T10:30:00Z",
  "raw_data": {
    "profile": {
      "primary_type": {
        "number": 5,
        "name": "The Investigator",
        "alternative_names": ["The Observer", "The Thinker"],
        "center": "Head",
        "core_motivation": "To understand the environment",
        "core_fear": "Being useless, incompetent, or incapable",
        "core_desire": "To be capable and competent",
        "vice": "Avarice",
        "virtue": "Detachment",
        "passion": "Greed",
        "fixation": "Stinginess",
        "holy_idea": "Holy Omniscience",
        "trap": "Observer"
      },
      "wing": {
        "name": "5w4 - The Iconoclast",
        "description": "Combines analytical depth with creative sensitivity",
        "traits": ["Creative", "Introspective", "Sensitive", "Original"]
      },
      "instinctual_variant": {
        "name": "Self-Preservation",
        "description": "Focus on security, comfort, and resource management",
        "traits": ["Cautious", "Prepared", "Resource-conscious"]
      },
      "integration_direction": {
        "direction": 8,
        "name": "Integration to Eight",
        "description": "When healthy, move toward Eight's confidence",
        "traits": ["Confident", "Decisive", "Action-oriented", "Assertive"]
      },
      "disintegration_direction": {
        "direction": 7,
        "name": "Disintegration to Seven",
        "description": "Under stress, adopt Seven's scattered energy",
        "traits": ["Scattered", "Impulsive", "Escapist", "Restless"]
      },
      "center": {
        "name": "Head",
        "types": [5, 6, 7],
        "core_emotion": "Fear/Anxiety",
        "focus": "Security and guidance"
      },
      "assessment_confidence": 0.85
    },
    "identification_method": "assessment",
    "key_insights": [
      "Your core type is 5 - The Investigator",
      "Your core motivation: To understand the environment",
      "Your core fear: Being useless, incompetent, or incapable",
      "You operate from the Head center of intelligence",
      "Your 5w4 wing adds Creative, Introspective qualities"
    ],
    "growth_guidance": [
      "Practice expressing your knowledge and insights to others",
      "Challenge yourself to engage more directly with the physical world",
      "Set aside time for embodied experiences, not just intellectual pursuits"
    ],
    "field_resonance": 0.7234,
    "field_signature": "enneagram_type_5_head"
  },
  "formatted_output": "🎭 Enneagram Resonator Analysis...",
  "recommendations": [
    "Meditate on your core fear and practice courage",
    "Engage your Eight integration by taking decisive action",
    "Balance intellectual pursuits with embodied experiences"
  ],
  "reality_patches": [
    "Install: Five-to-Eight integration pathway",
    "Patch: Observer-to-Participant consciousness upgrade",
    "Enable: Embodied wisdom integration protocol"
  ],
  "archetypal_themes": [
    "The Investigator",
    "The Wise Observer",
    "The Knowledge Keeper"
  ]
}
```

**Status Codes:**
- `200 OK`: Analysis completed successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: Missing or invalid user_id
- `500 Internal Server Error`: Engine processing error

---

### 2. Get Assessment Questions

#### GET /questions

**Description:** Retrieve Enneagram assessment questionnaire.

**Query Parameters:**
- `count` (optional): Number of questions to return (default: all)
- `categories` (optional): Filter by question categories

**Request:**
```http
GET /api/v1/engines/enneagram/questions?count=20
```

**Response:**
```json
{
  "total_questions": 45,
  "questions": [
    {
      "id": "q1",
      "category": "core_motivation",
      "text": "What drives you most in life?",
      "responses": [
        {
          "id": "1",
          "text": "Doing things correctly and morally",
          "primary_types": [1]
        },
        {
          "id": "2",
          "text": "Being helpful and needed by others",
          "primary_types": [2]
        },
        {
          "id": "3",
          "text": "Achieving success and recognition",
          "primary_types": [3]
        },
        {
          "id": "4",
          "text": "Being authentic and unique",
          "primary_types": [4]
        },
        {
          "id": "5",
          "text": "Understanding and mastering knowledge",
          "primary_types": [5]
        },
        {
          "id": "6",
          "text": "Finding security and support",
          "primary_types": [6]
        },
        {
          "id": "7",
          "text": "Experiencing joy and avoiding pain",
          "primary_types": [7]
        },
        {
          "id": "8",
          "text": "Being strong and in control",
          "primary_types": [8]
        },
        {
          "id": "9",
          "text": "Maintaining peace and harmony",
          "primary_types": [9]
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Questions retrieved successfully
- `400 Bad Request`: Invalid query parameters

---

### 3. Get Type Information

#### GET /types/{type_number}

**Description:** Retrieve detailed information about a specific Enneagram type.

**Path Parameters:**
- `type_number` (required): Type number (1-9)

**Query Parameters:**
- `include_wings` (optional): Include wing information (default: true)
- `include_arrows` (optional): Include integration/disintegration arrows (default: true)
- `include_variants` (optional): Include instinctual variants (default: true)
- `include_levels` (optional): Include Riso-Hudson levels (default: false)

**Request:**
```http
GET /api/v1/engines/enneagram/types/5?include_levels=true
```

**Response:**
```json
{
  "number": 5,
  "name": "The Investigator",
  "alternative_names": ["The Observer", "The Thinker", "The Specialist"],
  "center": "Head",
  "core_dynamics": {
    "motivation": "To understand the environment and be capable",
    "fear": "Being useless, incompetent, or incapable",
    "desire": "To be capable and competent",
    "basic_proposition": "You are competent if you understand"
  },
  "traditional_elements": {
    "vice": "Avarice",
    "virtue": "Detachment",
    "passion": "Greed",
    "fixation": "Stinginess",
    "holy_idea": "Holy Omniscience",
    "trap": "Observer"
  },
  "wings": {
    "4": {
      "name": "5w4 - The Iconoclast",
      "description": "The more withdrawn, creative, intense variant",
      "traits": ["Creative", "Introspective", "Sensitive", "Original", "Eccentric"]
    },
    "6": {
      "name": "5w6 - The Problem Solver",
      "description": "The more social, loyal, practical variant",
      "traits": ["Loyal", "Cooperative", "Practical", "Systematic", "Dutiful"]
    }
  },
  "arrows": {
    "integration": {
      "direction": 8,
      "name": "Integration to Eight",
      "description": "In growth, Fives access Eight's confidence and assertiveness",
      "traits": ["Confident", "Decisive", "Action-oriented", "Assertive", "Powerful"]
    },
    "disintegration": {
      "direction": 7,
      "name": "Disintegration to Seven",
      "description": "Under stress, Fives become scattered like unhealthy Sevens",
      "traits": ["Scattered", "Impulsive", "Escapist", "Restless", "Unfocused"]
    }
  },
  "instinctual_variants": {
    "self_preservation": {
      "name": "Self-Preservation Five",
      "description": "Focus on creating a secure home base and conserving resources",
      "traits": ["Minimalist", "Reclusive", "Self-sufficient", "Frugal"]
    },
    "sexual": {
      "name": "Sexual Five",
      "description": "Intense one-to-one connections and deep intellectual intimacy",
      "traits": ["Intense", "Searching", "Confident in niche", "Romantic"]
    },
    "social": {
      "name": "Social Five",
      "description": "Focus on specialized knowledge and group contribution",
      "traits": ["Expert", "Specialist", "Totemic", "Knowledgeable"]
    }
  },
  "levels_of_development": {
    "1": "Level 1: Pioneering visionaries and comprehenders",
    "2": "Level 2: Perceptive and incisive observers",
    "3": "Level 3: Focused and innovative specialists",
    "4": "Level 4: Detached and analytical experts",
    "5": "Level 5: Isolated and intense intellectuals",
    "6": "Level 6: Cynical and provocative critics",
    "7": "Level 7: Nihilistic and eccentric recluses",
    "8": "Level 8: Terrified and unstable isolates",
    "9": "Level 9: Self-destructive and delusional"
  },
  "growth_recommendations": [
    "Practice expressing your knowledge and insights to others",
    "Challenge yourself to engage more directly with the physical world",
    "Set aside time for embodied experiences, not just intellectual pursuits",
    "Notice when you're withdrawing and practice staying engaged",
    "Share your inner world with trusted others"
  ],
  "keywords": [
    "Analytical", "Withdrawn", "Intense", "Perceptive", "Innovative",
    "Private", "Independent", "Cerebral", "Observant", "Knowledgeable"
  ]
}
```

**Status Codes:**
- `200 OK`: Type information retrieved
- `404 Not Found`: Invalid type number
- `400 Bad Request`: Invalid query parameters

---

### 4. Get Wing Analysis

#### POST /wings/analyze

**Description:** Analyze wing influence for a given type and assessment data.

**Request Body:**
```json
{
  "user_id": "user_12345",
  "primary_type": 5,
  "assessment_responses": {
    "q1": "5",
    "q2": "4",
    "q3": "5"
  }
}
```

**Response:**
```json
{
  "primary_type": 5,
  "wings": {
    "4": {
      "score": 23,
      "percentage": 0.58,
      "strength": "strong"
    },
    "6": {
      "score": 17,
      "percentage": 0.42,
      "strength": "moderate"
    }
  },
  "dominant_wing": {
    "type": 4,
    "name": "5w4 - The Iconoclast",
    "description": "Combines analytical depth with creative sensitivity",
    "traits": ["Creative", "Introspective", "Sensitive", "Original"],
    "strength": 0.58
  },
  "recommendation": "Your 4 wing adds emotional depth and creativity to your analytical nature. Embrace this by allowing yourself to express your unique perspective artistically."
}
```

**Status Codes:**
- `200 OK`: Wing analysis completed
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing user_id

---

### 5. Get Growth Path

#### POST /growth/path

**Description:** Generate personalized growth path based on type, arrows, and current level.

**Request Body:**
```json
{
  "user_id": "user_12345",
  "primary_type": 5,
  "current_level": 5,
  "focus_area": "relationships",
  "include_integration_practices": true
}
```

**Response:**
```json
{
  "primary_type": 5,
  "current_level": 5,
  "level_description": "Isolated and intense intellectual",
  "health_status": "average",
  "integration_path": {
    "target_type": 8,
    "practices": [
      "Take decisive action without over-analyzing",
      "Express your needs and boundaries clearly",
      "Engage your body through physical activity",
      "Practice assertiveness in daily interactions"
    ]
  },
  "avoid_disintegration": {
    "target_type": 7,
    "warning_signs": [
      "Becoming scattered and unfocused",
      "Seeking constant mental stimulation",
      "Avoiding depth through distraction",
      "Impulsive behavior and poor planning"
    ],
    "countermeasures": [
      "Return to focused, deep work",
      "Practice grounding techniques",
      "Limit information intake",
      "Reconnect with your center"
    ]
  },
  "virtue_cultivation": {
    "virtue": "Detachment",
    "practices": [
      "Practice non-attachment to outcomes",
      "Share your knowledge freely",
      "Let go of hoarding tendencies",
      "Trust in your inherent capability"
    ]
  },
  "vice_awareness": {
    "vice": "Avarice",
    "warning_signs": [
      "Excessive hoarding of time and energy",
      "Refusing to share knowledge or resources",
      "Withdrawing from all engagement",
      "Minimizing needs to an unhealthy degree"
    ]
  },
  "focus_area_guidance": {
    "area": "relationships",
    "recommendations": [
      "Practice expressing your needs directly",
      "Share your inner world with your partner",
      "Notice when you're withdrawing and communicate it",
      "Balance alone time with quality connection time",
      "Trust that engagement won't deplete you"
    ]
  },
  "milestones": [
    {
      "target_level": 4,
      "description": "Become a focused and innovative specialist",
      "timeframe": "3-6 months",
      "key_indicators": [
        "More engagement with the outer world",
        "Sharing expertise more freely",
        "Balanced self-care and contribution"
      ]
    },
    {
      "target_level": 3,
      "description": "Become a perceptive and incisive observer",
      "timeframe": "6-12 months",
      "key_indicators": [
        "Confident self-expression",
        "Healthy boundaries with engagement",
        "Integration of Eight assertiveness"
      ]
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Growth path generated
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing user_id

---

### 6. Get Center Information

#### GET /centers/{center_name}

**Description:** Retrieve information about one of the three centers of intelligence.

**Path Parameters:**
- `center_name` (required): "body", "heart", or "head"

**Request:**
```http
GET /api/v1/engines/enneagram/centers/head
```

**Response:**
```json
{
  "name": "Head",
  "alternative_names": ["Thinking", "Fear"],
  "types": [5, 6, 7],
  "core_emotion": "Fear/Anxiety",
  "focus": "Security, support, and guidance",
  "description": "The Head center processes through thinking and planning. Types in this center deal with fear and anxiety, seeking security and certainty in different ways.",
  "type_variations": {
    "5": "Withdraws from fear - seeks knowledge as security",
    "6": "Confronts fear - seeks external support and alliances",
    "7": "Escapes fear - seeks positive experiences and plans"
  },
  "healthy_expression": "Clear thinking, wisdom, and appropriate planning",
  "unhealthy_expression": "Anxiety, overthinking, and mental paralysis",
  "development_path": "Move from fear-based thinking to wisdom and trust",
  "practices": [
    "Grounding exercises to get out of the head",
    "Body-based practices (yoga, martial arts)",
    "Mindfulness meditation",
    "Action before perfection"
  ]
}
```

**Status Codes:**
- `200 OK`: Center information retrieved
- `404 Not Found`: Invalid center name

---

### 7. Get Instinctual Variants

#### GET /instincts

**Description:** Retrieve information about the three instinctual variants.

**Response:**
```json
{
  "instincts": [
    {
      "name": "Self-Preservation",
      "abbreviation": "SP",
      "symbol": "🛡️",
      "focus": "Physical safety, comfort, security, and resource management",
      "description": "Concerned with personal safety, comfort, and well-being. Focus on home, health, food, and financial security.",
      "primary_concerns": [
        "Physical safety and comfort",
        "Resource management",
        "Health and nutrition",
        "Home and sanctuary"
      ],
      "attention_pattern": "Inward toward personal needs and security"
    },
    {
      "name": "Sexual",
      "alternative_names": ["One-to-One", "Intimate"],
      "abbreviation": "SX",
      "symbol": "⚡",
      "focus": "Intense one-to-one connections, chemistry, and attraction",
      "description": "Concerned with intense connections and experiences. Seeks chemistry, attraction, and deep one-to-one bonds.",
      "primary_concerns": [
        "Intense personal connections",
        "Chemistry and attraction",
        "Deep intimacy",
        "Transmitting and broadcasting"
      ],
      "attention_pattern": "Focused intensely on specific people or experiences"
    },
    {
      "name": "Social",
      "abbreviation": "SO",
      "symbol": "👥",
      "focus": "Group dynamics, belonging, and social contribution",
      "description": "Concerned with group participation and contribution. Aware of social hierarchies and one's place in groups.",
      "primary_concerns": [
        "Group belonging and participation",
        "Social hierarchies and status",
        "Contributing to the collective",
        "Networks and alliances"
      ],
      "attention_pattern": "Outward toward groups and social contexts"
    }
  ],
  "stacking_order": {
    "description": "The three instincts are stacked in order of dominance: primary, secondary, and blind spot (least developed).",
    "combinations": [
      "SP/SX", "SP/SO",
      "SX/SP", "SX/SO",
      "SO/SP", "SO/SX"
    ]
  }
}
```

**Status Codes:**
- `200 OK`: Instinct information retrieved

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "INVALID_TYPE_NUMBER",
    "message": "Type number must be between 1 and 9",
    "details": {
      "provided_value": 12,
      "valid_range": [1, 9]
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TYPE_NUMBER` | 400 | Type number not in range 1-9 |
| `MISSING_REQUIRED_FIELD` | 400 | Required input field missing |
| `INVALID_IDENTIFICATION_METHOD` | 400 | Unknown identification method |
| `ASSESSMENT_RESPONSES_REQUIRED` | 400 | Assessment method requires responses |
| `SELECTED_TYPE_REQUIRED` | 400 | Self-select method requires type number |
| `DESCRIPTION_REQUIRED` | 400 | Intuitive method requires description |
| `UNAUTHORIZED` | 401 | Missing or invalid user_id |
| `ENGINE_ERROR` | 500 | Internal engine processing error |
| `DATA_LOAD_ERROR` | 500 | Failed to load type data |

---

## Rate Limiting

**Limits:**
- **Assessment endpoint**: 10 requests per hour per user
- **Type information**: 100 requests per hour per user
- **Other endpoints**: 50 requests per hour per user

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1642248600
```

---

## Webhooks (Future)

### Assessment Complete

**Event:** `enneagram.assessment.complete`

**Payload:**
```json
{
  "event": "enneagram.assessment.complete",
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "user_12345",
  "data": {
    "type_number": 5,
    "confidence": 0.85,
    "wing": "5w4",
    "instinctual_variant": "sp"
  }
}
```

---

## SDK Examples

### Python

```python
from witnessOS import EnneagramClient

client = EnneagramClient(api_key="your_key")

# Run assessment
result = client.analyze(
    user_id="user_12345",
    identification_method="assessment",
    assessment_responses={
        "q1": "5",
        "q2": "5",
        "q3": "7"
    },
    include_wings=True,
    include_arrows=True
)

print(f"Your type: {result.profile.primary_type.number} - {result.profile.primary_type.name}")
print(f"Confidence: {result.confidence_score}")
```

### JavaScript

```javascript
const { EnneagramClient } = require('witnessOS-sdk');

const client = new EnneagramClient({ apiKey: 'your_key' });

// Run assessment
const result = await client.analyze({
  userId: 'user_12345',
  identificationMethod: 'assessment',
  assessmentResponses: {
    q1: '5',
    q2: '5',
    q3: '7'
  },
  includeWings: true,
  includeArrows: true
});

console.log(`Your type: ${result.profile.primaryType.number} - ${result.profile.primaryType.name}`);
console.log(`Confidence: ${result.confidenceScore}`);
```

---

## Versioning

API follows semantic versioning (v1, v2, etc.). Breaking changes will increment the major version.

Current version: **v1.0.0**

---

## Additional Resources

- [Enneagram Calculation Formulas](./enneagram-calculation-formulas.md)
- [Implementation Architecture](./enneagram-implementation-architecture.md)
- [Cross-Engine Mappings](./enneagram-cross-engine-mappings.md)
