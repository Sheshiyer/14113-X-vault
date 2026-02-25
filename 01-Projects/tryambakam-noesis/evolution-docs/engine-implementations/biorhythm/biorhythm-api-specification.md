# Biorhythm API Specification

> **Complete REST API documentation for WitnessOS Biorhythm Synchronizer Engine**  
> Extracted from: `biorhythm.py` & `biorhythm_models.py`

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Single Biorhythm Endpoint](#single-biorhythm-endpoint)
4. [Dual Biorhythm (Compatibility) Endpoint](#dual-biorhythm-compatibility-endpoint)
5. [Date Range Query Endpoint](#date-range-query-endpoint)
6. [Critical Day Alerts Endpoint](#critical-day-alerts-endpoint)
7. [Error Responses](#error-responses)
8. [Rate Limiting](#rate-limiting)
9. [Webhooks & Notifications](#webhooks--notifications)
10. [Code Examples](#code-examples)

---

## 1. API Overview

### 1.1 Base Information

**Base URL:** `https://api.witnessos.com/v1`

**Protocol:** HTTPS only

**Content-Type:** `application/json`

**Authentication:** Bearer token (JWT)

**API Version:** v1

### 1.2 Endpoint Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/biorhythm/calculate` | POST | Calculate single person biorhythm |
| `/biorhythm/compatibility` | POST | Calculate dual biorhythm compatibility |
| `/biorhythm/forecast` | POST | Get biorhythm forecast for date range |
| `/biorhythm/critical-days` | GET | Get critical days in date range |
| `/biorhythm/alerts/subscribe` | POST | Subscribe to critical day alerts |
| `/biorhythm/alerts/unsubscribe` | DELETE | Unsubscribe from alerts |

### 1.3 Common Headers

**Request Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Request-ID: <unique_request_id>
X-User-Timezone: <IANA_timezone>
```

**Response Headers:**
```http
Content-Type: application/json
X-Request-ID: <unique_request_id>
X-Calculation-Time: <milliseconds>
X-Rate-Limit-Remaining: <count>
X-Rate-Limit-Reset: <unix_timestamp>
```

---

## 2. Authentication & Authorization

### 2.1 JWT Authentication

**Token Format:**
```json
{
  "sub": "user_12345",
  "email": "user@example.com",
  "iat": 1704067200,
  "exp": 1704153600,
  "scope": "biorhythm:read biorhythm:write"
}
```

**Required Scopes:**
- `biorhythm:read` - Read biorhythm calculations
- `biorhythm:write` - Create new calculations
- `biorhythm:alerts` - Manage alert subscriptions

### 2.2 API Key Authentication (Alternative)

**Header:**
```http
X-API-Key: sk_live_1234567890abcdef
```

**Rate Limits by Tier:**
- Free: 100 requests/day
- Pro: 10,000 requests/day
- Enterprise: Unlimited

---

## 3. Single Biorhythm Endpoint

### 3.1 Calculate Biorhythm

**Endpoint:** `POST /biorhythm/calculate`

**Description:** Calculate biorhythm for a single person on a specific date.

#### Request

**Request Body:**
```json
{
  "user_id": "user_12345",
  "birth_date": "1990-05-15",
  "target_date": "2026-01-15",
  "include_extended_cycles": false,
  "forecast_days": 7
}
```

**Parameters:**

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `user_id` | string | Yes | Unique user identifier | Max 100 chars |
| `birth_date` | string | Yes | Birth date (ISO 8601) | YYYY-MM-DD, ≥1900-01-01, ≤today |
| `target_date` | string | No | Target date (defaults to today) | YYYY-MM-DD, ≤1 year in future |
| `include_extended_cycles` | boolean | No | Include intuitive/aesthetic/spiritual | Default: false |
| `forecast_days` | integer | No | Days to forecast | 1-90, Default: 7 |

#### Response

**Success Response (200 OK):**
```json
{
  "engine_name": "biorhythm",
  "calculation_time": 0.0234,
  "confidence_score": 0.95,
  
  "birth_date": "1990-05-15",
  "target_date": "2026-01-15",
  "days_alive": 13024,
  
  "physical_percentage": 45.67,
  "emotional_percentage": -23.45,
  "intellectual_percentage": 78.90,
  
  "physical_phase": "rising",
  "emotional_phase": "falling",
  "intellectual_phase": "peak",
  
  "overall_energy": 33.71,
  "critical_day": false,
  "trend": "mixed",
  
  "cycle_details": {
    "physical": {
      "percentage": 45.67,
      "phase": "rising",
      "days_to_peak": 4,
      "days_to_valley": 15,
      "next_critical": "2026-01-20"
    },
    "emotional": {
      "percentage": -23.45,
      "phase": "falling",
      "days_to_peak": 18,
      "days_to_valley": 8,
      "next_critical": "2026-01-23"
    },
    "intellectual": {
      "percentage": 78.90,
      "phase": "peak",
      "days_to_peak": 0,
      "days_to_valley": 16,
      "next_critical": "2026-01-31"
    }
  },
  
  "critical_days_ahead": [
    "2026-01-18",
    "2026-01-20"
  ],
  
  "forecast_summary": {
    "total_days": 7,
    "critical_days_count": 2,
    "best_days_count": 3,
    "challenging_days_count": 1,
    "average_energy": 28.45
  },
  
  "best_days_ahead": [
    "2026-01-16",
    "2026-01-17",
    "2026-01-19"
  ],
  
  "challenging_days_ahead": [
    "2026-01-18"
  ],
  
  "energy_optimization": {
    "physical": "Moderate physical activities - rising phase",
    "emotional": "Minimize emotional demands - recovery period",
    "intellectual": "Maximize intellectual activities - peak performance window"
  },
  
  "cycle_synchronization": {
    "aligned_cycles": ["physical", "intellectual"],
    "conflicting_cycles": [],
    "synchronization_score": 0.67
  },
  
  "recommendations": [
    "Leverage your intellectual peak for important tasks",
    "Allow emotional recovery and avoid overexertion",
    "High energy day - tackle challenging projects",
    "Energy building - good time to start new initiatives"
  ],
  
  "reality_patches": [
    "Install: Biorhythm synchronization protocol",
    "Patch: Energy field optimization matrix",
    "Upgrade: Cyclical awareness enhancement module"
  ],
  
  "archetypal_themes": [
    "Balance",
    "Equilibrium",
    "Sage"
  ],
  
  "formatted_output": "⚡ BIORHYTHM SYNCHRONIZATION - JANUARY 15, 2026 ⚡\n\n═══ ENERGY FIELD ANALYSIS ═══\n\n...",
  
  "field_signature": "biorhythm_13024_2026-01-15T12:00:00Z_a3f8c2d1"
}
```

**Field Descriptions:**

- **engine_name**: Always "biorhythm"
- **calculation_time**: Computation time in seconds
- **confidence_score**: 0-1 scale, biorhythm is typically 0.9-1.0 (mathematically precise)
- **days_alive**: Total days from birth to target date
- **[cycle]_percentage**: Cycle value from -100 to +100
- **[cycle]_phase**: One of: critical, rising, peak, falling, valley
- **overall_energy**: Average of all cycle percentages
- **critical_day**: Boolean, true if 2+ cycles in critical phase
- **trend**: ascending, descending, mixed, or stable
- **cycle_details**: Detailed information per cycle
- **critical_days_ahead**: List of critical days in forecast period
- **forecast_summary**: Aggregate statistics for forecast
- **best_days_ahead**: High energy days (>50%)
- **challenging_days_ahead**: Low energy days (<-25%)
- **energy_optimization**: Personalized guidance per cycle
- **cycle_synchronization**: Alignment analysis
- **recommendations**: Actionable advice list
- **reality_patches**: WitnessOS-specific consciousness upgrades
- **archetypal_themes**: Symbolic themes based on state
- **formatted_output**: Human-readable mystical interpretation
- **field_signature**: Unique identifier for this calculation

#### cURL Example

```bash
curl -X POST https://api.witnessos.com/v1/biorhythm/calculate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_12345",
    "birth_date": "1990-05-15",
    "target_date": "2026-01-15",
    "include_extended_cycles": false,
    "forecast_days": 7
  }'
```

#### Extended Cycles Response

When `include_extended_cycles: true`:

```json
{
  "intuitive_percentage": 34.56,
  "aesthetic_percentage": -12.34,
  "spiritual_percentage": 67.89,
  
  "cycle_details": {
    "physical": { ... },
    "emotional": { ... },
    "intellectual": { ... },
    "intuitive": {
      "percentage": 34.56,
      "phase": "rising",
      "days_to_peak": 8,
      "days_to_valley": 27,
      "next_critical": "2026-01-24"
    },
    "aesthetic": {
      "percentage": -12.34,
      "phase": "falling",
      "days_to_peak": 32,
      "days_to_valley": 10,
      "next_critical": "2026-01-25"
    },
    "spiritual": {
      "percentage": 67.89,
      "phase": "peak",
      "days_to_peak": 2,
      "days_to_valley": 28,
      "next_critical": "2026-02-12"
    }
  }
}
```

---

## 4. Dual Biorhythm (Compatibility) Endpoint

### 4.1 Calculate Compatibility

**Endpoint:** `POST /biorhythm/compatibility`

**Description:** Calculate biorhythm compatibility between two people.

#### Request

**Request Body:**
```json
{
  "person1_birth_date": "1990-05-15",
  "person2_birth_date": "1992-08-22",
  "target_date": "2026-01-15",
  "relationship_type": "romantic",
  "include_extended_cycles": false
}
```

**Parameters:**

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `person1_birth_date` | string | Yes | First person's birth date | ISO 8601 |
| `person2_birth_date` | string | Yes | Second person's birth date | ISO 8601 |
| `target_date` | string | No | Date to analyze (defaults to today) | ISO 8601 |
| `relationship_type` | string | No | Type of relationship | romantic, friendship, business, family, general (default) |
| `include_extended_cycles` | boolean | No | Include extended cycles | Default: false |

#### Response

**Success Response (200 OK):**
```json
{
  "engine_name": "biorhythm_compatibility",
  "calculation_time": 0.0345,
  "confidence_score": 0.92,
  
  "person1_birth_date": "1990-05-15",
  "person2_birth_date": "1992-08-22",
  "target_date": "2026-01-15",
  "relationship_type": "romantic",
  
  "person1_cycles": {
    "physical": 45.67,
    "emotional": -23.45,
    "intellectual": 78.90
  },
  
  "person2_cycles": {
    "physical": 52.34,
    "emotional": -18.90,
    "intellectual": 34.56
  },
  
  "physical_compatibility": 0.967,
  "emotional_compatibility": 0.977,
  "intellectual_compatibility": 0.778,
  "overall_compatibility": 0.883,
  
  "compatibility_interpretation": "High Compatibility",
  
  "compatibility_strengths": [
    "Exceptional physical synchronization - similar energy levels",
    "Strong emotional alignment - both in recovery phase",
    "Complementary intellectual states - balance of peak and moderate"
  ],
  
  "compatibility_challenges": [
    "Both in emotional valley - may need external support during this time",
    "Intellectual gap may cause temporary communication differences"
  ],
  
  "synchronization_opportunities": [
    "Physical activities together - both in rising phase",
    "Emotional support for each other during low phase",
    "Person 1 can provide intellectual leadership while Person 2 offers stability"
  ],
  
  "best_interaction_times": [
    "2026-01-17 - Peak physical alignment",
    "2026-01-19 - High overall energy for both",
    "2026-01-21 - Emotional cycles rising together"
  ],
  
  "challenging_periods": [
    "2026-01-18 - Person 1 critical day",
    "2026-01-16 - Emotional valley for both"
  ],
  
  "relationship_guidance": "Your biorhythms show strong natural compatibility, especially in physical and emotional domains. The slight intellectual difference creates a healthy dynamic where you can learn from each other. Focus on physical activities together during this period, and provide mutual emotional support as both cycles are in recovery phase.",
  
  "energy_balancing_tips": [
    "Schedule important conversations when both intellectual cycles are positive",
    "Use physical peak days for shared activities and adventures",
    "Provide emotional space during valley periods",
    "Plan romantic gestures during peak emotional phases"
  ],
  
  "formatted_output": "⚡ BIORHYTHM COMPATIBILITY ANALYSIS ⚡\n\nOverall Compatibility: 88.3% (High)\n\n..."
}
```

**Compatibility Score Interpretation:**

| Score Range | Rating | Description |
|-------------|--------|-------------|
| 0.90 - 1.00 | Exceptional | Natural harmony and synchronization |
| 0.75 - 0.89 | High | Strong alignment with minor adjustments |
| 0.60 - 0.74 | Good | Balanced interaction possible |
| 0.45 - 0.59 | Moderate | Requires conscious effort |
| 0.30 - 0.44 | Low | Significant differences to navigate |
| 0.00 - 0.29 | Poor | Opposing rhythms, challenging |

#### cURL Example

```bash
curl -X POST https://api.witnessos.com/v1/biorhythm/compatibility \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "person1_birth_date": "1990-05-15",
    "person2_birth_date": "1992-08-22",
    "target_date": "2026-01-15",
    "relationship_type": "romantic"
  }'
```

---

## 5. Date Range Query Endpoint

### 5.1 Get Forecast Data

**Endpoint:** `POST /biorhythm/forecast`

**Description:** Get detailed biorhythm data for an extended date range with visualization coordinates.

#### Request

**Request Body:**
```json
{
  "user_id": "user_12345",
  "birth_date": "1990-05-15",
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "include_extended_cycles": false,
  "include_chart_data": true
}
```

**Parameters:**

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `user_id` | string | Yes | User identifier | Max 100 chars |
| `birth_date` | string | Yes | Birth date | ISO 8601 |
| `start_date` | string | Yes | Start of date range | ISO 8601 |
| `end_date` | string | Yes | End of date range | ISO 8601, max 90 days from start |
| `include_extended_cycles` | boolean | No | Include extended cycles | Default: false |
| `include_chart_data` | boolean | No | Include visualization coordinates | Default: true |

#### Response

**Success Response (200 OK):**
```json
{
  "engine_name": "biorhythm",
  "birth_date": "1990-05-15",
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "total_days": 31,
  
  "forecast_data": [
    {
      "date": "2026-01-01",
      "days_alive": 13010,
      "physical": 34.56,
      "emotional": -45.67,
      "intellectual": 67.89,
      "overall_energy": 18.93,
      "critical_day": false,
      "trend": "mixed",
      "energy_rating": "Moderate energy"
    },
    {
      "date": "2026-01-02",
      "days_alive": 13011,
      "physical": 42.34,
      "emotional": -40.12,
      "intellectual": 72.45,
      "overall_energy": 24.89,
      "critical_day": false,
      "trend": "ascending",
      "energy_rating": "Moderate energy"
    }
    // ... more days
  ],
  
  "chart_data": {
    "data_points": [
      {
        "date": "2026-01-01",
        "day_index": 0,
        "physical": 34.56,
        "emotional": -45.67,
        "intellectual": 67.89,
        "overall_energy": 18.93,
        "is_critical_day": false,
        "is_best_day": false,
        "is_challenging_day": false
      }
      // ... more points
    ],
    "chart_config": {
      "cycles": {
        "physical": { "color": "#ff0000", "visible": true },
        "emotional": { "color": "#ffaa00", "visible": true },
        "intellectual": { "color": "#0000ff", "visible": true }
      },
      "x_axis": {
        "label": "Days",
        "date_format": "MMM DD"
      },
      "y_axis": {
        "label": "Percentage",
        "min": -100,
        "max": 100,
        "zero_line": true
      },
      "critical_day_markers": true,
      "phase_shading": false
    }
  },
  
  "summary_statistics": {
    "average_physical": 23.45,
    "average_emotional": -12.34,
    "average_intellectual": 45.67,
    "average_overall_energy": 18.93,
    
    "peak_days": {
      "physical": ["2026-01-12", "2026-01-23"],
      "emotional": ["2026-01-08"],
      "intellectual": ["2026-01-15", "2026-01-28"]
    },
    
    "valley_days": {
      "physical": ["2026-01-01", "2026-01-24"],
      "emotional": ["2026-01-22"],
      "intellectual": ["2026-01-02"]
    },
    
    "critical_days": [
      "2026-01-05",
      "2026-01-18",
      "2026-01-20"
    ],
    
    "best_days": [
      "2026-01-15",
      "2026-01-16",
      "2026-01-28",
      "2026-01-29"
    ],
    
    "challenging_days": [
      "2026-01-03",
      "2026-01-18",
      "2026-01-22"
    ]
  },
  
  "recommendations": {
    "optimal_planning": "Schedule important tasks on Jan 15, 16, 28, 29 for peak performance",
    "rest_periods": "Prioritize self-care on Jan 3, 18, 22 during low energy phases",
    "critical_awareness": "Exercise extra caution on Jan 5, 18, 20 during critical transitions"
  }
}
```

#### cURL Example

```bash
curl -X POST https://api.witnessos.com/v1/biorhythm/forecast \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_12345",
    "birth_date": "1990-05-15",
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "include_chart_data": true
  }'
```

---

## 6. Critical Day Alerts Endpoint

### 6.1 Get Critical Days

**Endpoint:** `GET /biorhythm/critical-days`

**Description:** Retrieve all critical days within a specified date range.

#### Request

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `birth_date` | string | Yes | Birth date (ISO 8601) |
| `start_date` | string | Yes | Start of range (ISO 8601) |
| `end_date` | string | Yes | End of range (ISO 8601) |
| `include_details` | boolean | No | Include cycle details for each critical day |

**Example:**
```
GET /biorhythm/critical-days?birth_date=1990-05-15&start_date=2026-01-01&end_date=2026-03-31&include_details=true
```

#### Response

**Success Response (200 OK):**
```json
{
  "birth_date": "1990-05-15",
  "start_date": "2026-01-01",
  "end_date": "2026-03-31",
  "total_critical_days": 8,
  
  "critical_days": [
    {
      "date": "2026-01-05",
      "days_alive": 13014,
      "critical_cycles": ["physical", "emotional"],
      "severity": "moderate",
      "guidance": "Physical and emotional cycles crossing zero - practice mindfulness"
    },
    {
      "date": "2026-01-18",
      "days_alive": 13027,
      "critical_cycles": ["emotional", "intellectual"],
      "severity": "high",
      "guidance": "Double critical day - avoid major decisions, extra care needed"
    },
    {
      "date": "2026-01-20",
      "days_alive": 13029,
      "critical_cycles": ["physical", "intellectual"],
      "severity": "moderate",
      "guidance": "Physical and intellectual transitions - focus on routine tasks"
    }
    // ... more critical days
  ],
  
  "detailed_data": [
    {
      "date": "2026-01-05",
      "physical": 1.23,
      "emotional": -0.89,
      "intellectual": 45.67,
      "overall_energy": 15.34,
      "critical_day": true,
      "trend": "mixed"
    }
    // ... more details if include_details=true
  ],
  
  "next_critical_day": "2026-01-05",
  "days_until_next_critical": 3
}
```

**Critical Day Severity Levels:**

| Severity | Criteria | Description |
|----------|----------|-------------|
| **high** | All 3 cycles critical | Triple critical - maximum sensitivity |
| **moderate** | 2 cycles critical | Double critical - heightened awareness |
| **low** | 2 cycles near-critical | Approaching critical zone |

#### cURL Example

```bash
curl -X GET "https://api.witnessos.com/v1/biorhythm/critical-days?birth_date=1990-05-15&start_date=2026-01-01&end_date=2026-03-31&include_details=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6.2 Subscribe to Critical Day Alerts

**Endpoint:** `POST /biorhythm/alerts/subscribe`

**Description:** Subscribe to receive notifications before critical days.

#### Request

**Request Body:**
```json
{
  "user_id": "user_12345",
  "birth_date": "1990-05-15",
  "notification_channels": ["email", "webhook"],
  "advance_notice_days": 2,
  "email": "user@example.com",
  "webhook_url": "https://myapp.com/webhooks/biorhythm"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | User identifier |
| `birth_date` | string | Yes | Birth date |
| `notification_channels` | array | Yes | ["email", "webhook", "sms"] |
| `advance_notice_days` | integer | No | Days before critical day to notify (1-7, default: 2) |
| `email` | string | Conditional | Required if email channel selected |
| `webhook_url` | string | Conditional | Required if webhook channel selected |

#### Response

**Success Response (201 Created):**
```json
{
  "subscription_id": "sub_abc123xyz",
  "user_id": "user_12345",
  "status": "active",
  "notification_channels": ["email", "webhook"],
  "advance_notice_days": 2,
  "next_critical_day": "2026-01-05",
  "next_notification_date": "2026-01-03",
  "created_at": "2026-01-01T12:00:00Z"
}
```

#### Webhook Payload Example

When a critical day approaches, the webhook will receive:

```json
{
  "event": "critical_day_alert",
  "subscription_id": "sub_abc123xyz",
  "user_id": "user_12345",
  "timestamp": "2026-01-03T08:00:00Z",
  
  "critical_day_info": {
    "date": "2026-01-05",
    "days_until": 2,
    "critical_cycles": ["physical", "emotional"],
    "severity": "moderate",
    "guidance": "Physical and emotional cycles crossing zero - practice mindfulness"
  },
  
  "current_state": {
    "physical": 12.34,
    "emotional": 8.90,
    "intellectual": 45.67,
    "overall_energy": 22.30
  }
}
```

### 6.3 Unsubscribe from Alerts

**Endpoint:** `DELETE /biorhythm/alerts/unsubscribe`

**Request Body:**
```json
{
  "subscription_id": "sub_abc123xyz"
}
```

**Response:**
```json
{
  "message": "Successfully unsubscribed",
  "subscription_id": "sub_abc123xyz",
  "unsubscribed_at": "2026-01-15T10:30:00Z"
}
```

---

## 7. Error Responses

### 7.1 Error Format

**Standard Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Birth date cannot be in the future",
    "details": {
      "field": "birth_date",
      "provided_value": "2027-01-01",
      "constraint": "must be <= today"
    },
    "request_id": "req_abc123xyz",
    "timestamp": "2026-01-15T12:00:00Z"
  }
}
```

### 7.2 Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Input validation failed |
| 400 | `INVALID_DATE_RANGE` | Date range exceeds limits |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Temporary service disruption |

### 7.3 Validation Errors

**Birth Date Validation:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Birth date cannot be in the future",
    "field": "birth_date"
  }
}
```

**Date Range Validation:**
```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Date range cannot exceed 90 days",
    "details": {
      "start_date": "2026-01-01",
      "end_date": "2026-05-01",
      "days_requested": 120,
      "max_allowed": 90
    }
  }
}
```

### 7.4 Rate Limit Error

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded: 100 requests per day",
    "details": {
      "limit": 100,
      "remaining": 0,
      "reset_at": "2026-01-16T00:00:00Z",
      "retry_after": 3600
    }
  }
}
```

---

## 8. Rate Limiting

### 8.1 Rate Limit Headers

**Response Headers:**
```http
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 87
X-Rate-Limit-Reset: 1704067200
X-Rate-Limit-Window: 86400
```

### 8.2 Rate Limits by Tier

| Tier | Requests/Day | Requests/Hour | Burst Limit |
|------|--------------|---------------|-------------|
| Free | 100 | 10 | 5 |
| Pro | 10,000 | 500 | 50 |
| Enterprise | Unlimited | 10,000 | 500 |

### 8.3 Rate Limit Strategy

- **Window:** Rolling 24-hour window
- **Per User:** Limits apply per user_id
- **Burst Protection:** Prevent rapid-fire requests
- **Retry-After:** Included in 429 response

---

## 9. Webhooks & Notifications

### 9.1 Webhook Security

**Request Signature:**

All webhooks include an `X-Webhook-Signature` header:

```
X-Webhook-Signature: sha256=abc123def456...
```

**Verification:**
```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected}", signature)
```

### 9.2 Webhook Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `critical_day_alert` | N days before critical day | Critical day info + current state |
| `energy_peak` | Cycle reaches peak | Cycle details |
| `energy_valley` | Cycle reaches valley | Cycle details |
| `synchronization_high` | All cycles aligned | Synchronization data |

### 9.3 Email Notifications

**Email Template:**

```
Subject: Critical Day Alert - January 5, 2026

Hi there,

Your biorhythm analysis indicates a critical day approaching on January 5, 2026.

Critical Cycles: Physical, Emotional
Severity: Moderate

Guidance: Physical and emotional cycles are crossing zero. Practice extra mindfulness 
and avoid making major decisions on this day.

Current State:
- Physical: 12.3%
- Emotional: 8.9%
- Intellectual: 45.7%
- Overall Energy: 22.3%

View detailed analysis: https://app.witnessos.com/biorhythm/2026-01-05

Stay conscious,
The WitnessOS Team
```

---

## 10. Code Examples

### 10.1 JavaScript/TypeScript

**Single Biorhythm Calculation:**
```typescript
import axios from 'axios';

interface BiorhythmRequest {
  user_id: string;
  birth_date: string;
  target_date?: string;
  include_extended_cycles?: boolean;
  forecast_days?: number;
}

interface BiorhythmResponse {
  physical_percentage: number;
  emotional_percentage: number;
  intellectual_percentage: number;
  overall_energy: number;
  critical_day: boolean;
  // ... more fields
}

async function calculateBiorhythm(
  request: BiorhythmRequest,
  apiKey: string
): Promise<BiorhythmResponse> {
  try {
    const response = await axios.post<BiorhythmResponse>(
      'https://api.witnessos.com/v1/biorhythm/calculate',
      request,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error(error.response?.data?.error?.message || 'API request failed');
    }
    throw error;
  }
}

// Usage
const result = await calculateBiorhythm({
  user_id: 'user_12345',
  birth_date: '1990-05-15',
  target_date: '2026-01-15',
  forecast_days: 7
}, 'YOUR_API_KEY');

console.log(`Overall Energy: ${result.overall_energy}%`);
console.log(`Critical Day: ${result.critical_day}`);
```

### 10.2 Python

**Using requests library:**
```python
import requests
from datetime import date
from typing import Dict, Any

class BiorhythmAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.witnessos.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def calculate_biorhythm(
        self,
        user_id: str,
        birth_date: date,
        target_date: date = None,
        include_extended_cycles: bool = False,
        forecast_days: int = 7
    ) -> Dict[str, Any]:
        """Calculate biorhythm for a single person."""
        payload = {
            "user_id": user_id,
            "birth_date": birth_date.isoformat(),
            "include_extended_cycles": include_extended_cycles,
            "forecast_days": forecast_days
        }
        
        if target_date:
            payload["target_date"] = target_date.isoformat()
        
        response = requests.post(
            f"{self.base_url}/biorhythm/calculate",
            json=payload,
            headers=self.headers
        )
        
        response.raise_for_status()
        return response.json()
    
    def calculate_compatibility(
        self,
        person1_birth: date,
        person2_birth: date,
        relationship_type: str = "general"
    ) -> Dict[str, Any]:
        """Calculate biorhythm compatibility."""
        payload = {
            "person1_birth_date": person1_birth.isoformat(),
            "person2_birth_date": person2_birth.isoformat(),
            "relationship_type": relationship_type
        }
        
        response = requests.post(
            f"{self.base_url}/biorhythm/compatibility",
            json=payload,
            headers=self.headers
        )
        
        response.raise_for_status()
        return response.json()
    
    def get_critical_days(
        self,
        birth_date: date,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """Get critical days in date range."""
        params = {
            "birth_date": birth_date.isoformat(),
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "include_details": True
        }
        
        response = requests.get(
            f"{self.base_url}/biorhythm/critical-days",
            params=params,
            headers=self.headers
        )
        
        response.raise_for_status()
        return response.json()

# Usage
api = BiorhythmAPI("YOUR_API_KEY")

result = api.calculate_biorhythm(
    user_id="user_12345",
    birth_date=date(1990, 5, 15),
    target_date=date(2026, 1, 15)
)

print(f"Overall Energy: {result['overall_energy']:.1f}%")
print(f"Critical Day: {result['critical_day']}")

for recommendation in result['recommendations']:
    print(f"• {recommendation}")
```

### 10.3 cURL with jq

**Calculate and Format:**
```bash
#!/bin/bash

API_KEY="YOUR_API_KEY"
BIRTH_DATE="1990-05-15"
TARGET_DATE="2026-01-15"

# Calculate biorhythm
RESULT=$(curl -s -X POST https://api.witnessos.com/v1/biorhythm/calculate \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"user_12345\",
    \"birth_date\": \"$BIRTH_DATE\",
    \"target_date\": \"$TARGET_DATE\",
    \"forecast_days\": 7
  }")

# Extract and display key metrics
echo "=== BIORHYTHM ANALYSIS ==="
echo "Date: $(echo $RESULT | jq -r '.target_date')"
echo "Days Alive: $(echo $RESULT | jq -r '.days_alive')"
echo ""
echo "Cycles:"
echo "  Physical: $(echo $RESULT | jq -r '.physical_percentage')% ($(echo $RESULT | jq -r '.physical_phase'))"
echo "  Emotional: $(echo $RESULT | jq -r '.emotional_percentage')% ($(echo $RESULT | jq -r '.emotional_phase'))"
echo "  Intellectual: $(echo $RESULT | jq -r '.intellectual_percentage')% ($(echo $RESULT | jq -r '.intellectual_phase'))"
echo ""
echo "Overall Energy: $(echo $RESULT | jq -r '.overall_energy')%"
echo "Critical Day: $(echo $RESULT | jq -r '.critical_day')"
echo "Trend: $(echo $RESULT | jq -r '.trend')"
echo ""
echo "Recommendations:"
echo $RESULT | jq -r '.recommendations[]' | while read line; do
  echo "  • $line"
done
```

---

## Appendix: Status Codes Summary

| Code | Name | Usage |
|------|------|-------|
| 200 | OK | Successful GET/POST request |
| 201 | Created | Resource created (subscription) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid/missing auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Temporary outage |

---

**Document Version:** 1.0  
**Last Updated:** 2026  
**API Version:** v1  
**Source:** WitnessOS Biorhythm Engine
