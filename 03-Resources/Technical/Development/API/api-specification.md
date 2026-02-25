# TheWhyChromosome API Specification
`Version 1.0.0 | Unified API Documentation`

## Core Shared Services

### Pattern Recognition API
```javascript
BASE_URL: /api/v1/patterns

// Pattern Identification
GET /patterns/identify
{
  "input": {
    "type": "geometric|temporal|energetic",
    "data": "pattern_data",
    "context": "product_context"
  },
  "response": {
    "pattern_id": "string",
    "confidence": "float",
    "correlations": ["related_patterns"]
  }
}

// Pattern Correlation
GET /patterns/correlate
{
  "input": {
    "pattern_id": "string",
    "products": ["wallpaper", "raaga", "watch"],
    "context": "usage_context"
  },
  "response": {
    "correlations": [{
      "product": "string",
      "pattern_match": "float",
      "implementation": "object"
    }]
  }
}
```

### Energy Flow API
```javascript
BASE_URL: /api/v1/energy

// Current Energy State
GET /energy/state
{
  "input": {
    "location": "coordinates",
    "timestamp": "ISO8601",
    "user_id": "string"
  },
  "response": {
    "organ_system": "current_organ",
    "energy_level": "float",
    "recommendations": {
      "wallpaper": "pattern_id",
      "raaga": "track_id",
      "watch_face": "display_mode"
    }
  }
}
```

## Product-Specific APIs

### Sacred Wallpaper API
```javascript
BASE_URL: /api/v1/wallpaper

// Generate Wallpaper
POST /wallpaper/generate
{
  "input": {
    "pattern_id": "string",
    "energy_state": "object",
    "dimensions": {
      "width": "integer",
      "height": "integer"
    },
    "preferences": {
      "color_scheme": "string",
      "intensity": "float"
    }
  },
  "response": {
    "wallpaper_url": "string",
    "energy_signature": "object",
    "usage_guidelines": "object"
  }
}

// Update Pattern
PUT /wallpaper/update/{id}
{
  "input": {
    "transition_type": "string",
    "new_energy_state": "object"
  }
}
```

### Temporal Raaga API
```javascript
BASE_URL: /api/v1/raaga

// Get Current Raaga
GET /raaga/current
{
  "input": {
    "timestamp": "ISO8601",
    "location": "coordinates"
  },
  "response": {
    "raaga": {
      "id": "string",
      "name": "string",
      "energy_signature": "object",
      "play_url": "string"
    },
    "timing": {
      "optimal_duration": "integer",
      "next_transition": "ISO8601"
    }
  }
}

// Generate Playlist
POST /raaga/playlist
{
  "input": {
    "duration": "integer",
    "energy_flow": "object",
    "transition_points": ["ISO8601"]
  },
  "response": {
    "tracks": [{
      "raaga_id": "string",
      "timing": "object",
      "transition": "object"
    }]
  }
}
```

### Quantum Watch API
```javascript
BASE_URL: /api/v1/watch

// Time Scale Integration
GET /watch/timescales
{
  "input": {
    "timestamp": "ISO8601",
    "location": "coordinates",
    "active_scales": ["string"]
  },
  "response": {
    "scales": [{
      "type": "string",
      "current_value": "object",
      "next_transition": "ISO8601"
    }],
    "correlations": "object"
  }
}

// Oracle Interface
POST /watch/oracle
{
  "input": {
    "query_type": "string",
    "context": "object",
    "energy_state": "object"
  },
  "response": {
    "reading": {
      "card": "object",
      "interpretation": "string",
      "energy_impact": "object"
    }
  }
}
```

## Shared Utility APIs

### User Management
```javascript
BASE_URL: /api/v1/users

// User Preferences
GET /users/{id}/preferences
PUT /users/{id}/preferences

// Pattern History
GET /users/{id}/patterns
```

### Analytics API
```javascript
BASE_URL: /api/v1/analytics

// Usage Tracking
POST /analytics/track
{
  "input": {
    "user_id": "string",
    "product": "string",
    "action": "string",
    "context": "object"
  }
}

// Pattern Effectiveness
GET /analytics/patterns/{pattern_id}/effectiveness
```

## Authentication & Authorization
```javascript
BASE_URL: /api/v1/auth

// Token Generation
POST /auth/token
{
  "input": {
    "user_id": "string",
    "scope": ["string"]
  },
  "response": {
    "access_token": "string",
    "refresh_token": "string",
    "expires_in": "integer"
  }
}
```

## Error Handling
```javascript
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

## Rate Limiting
- Default: 100 requests per minute
- Oracle endpoints: 10 requests per minute
- Generation endpoints: 30 requests per minute

## Caching Strategy
```javascript
cacheControl = {
  patterns: "max-age=3600",
  energy_states: "max-age=300",
  user_preferences: "max-age=86400"
}
```

## Implementation Notes
1. All endpoints require authentication
2. Timestamp format: ISO8601
3. Coordinates format: [latitude, longitude]
4. Energy values: 0.0 to 1.0
5. Pattern IDs: UUID v4