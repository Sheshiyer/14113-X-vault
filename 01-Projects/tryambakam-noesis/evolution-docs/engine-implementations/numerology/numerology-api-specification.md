# Numerology API Specification

## API Overview

The Numerology Engine provides soul-number matrix extraction and vibrational signature analysis through name and birth date numerology.

## Input Data Model

### NumerologyInput

```python
class NumerologyInput(CloudflareEngineInput, BirthDataInput):
    """Input model for Numerology Engine."""
    
    # === REQUIRED FIELDS ===
    
    user_id: str
    # Unique user identifier
    
    full_name: str
    # Full birth name for calculation
    # Example: "John Michael Doe"
    # Must contain at least 2 letters
    
    birth_date: Union[str, date]
    # Format: "YYYY-MM-DD" or date object
    # Required for Life Path and Personal Year calculations
    
    # === OPTIONAL FIELDS ===
    
    preferred_name: Optional[str] = None
    # Preferred or nickname for additional analysis
    # Example: "Mike Doe"
    
    system: Literal["pythagorean", "chaldean"] = "pythagorean"
    # Numerology system to use
    # - "pythagorean": Standard Western (1-9)
    # - "chaldean": Ancient Babylonian (1-8)
    
    current_year: int = Field(default_factory=lambda: date.today().year)
    # Year for Personal Year calculation
    # Defaults to current year
    
    # === ANALYSIS OPTIONS ===
    
    include_master_numbers: bool = True
    # Detect and preserve master numbers (11, 22, 33, 44)
    
    include_karmic_debt: bool = True
    # Detect karmic debt numbers (13, 14, 16, 19)
    
    include_bridge_numbers: bool = True
    # Calculate bridge numbers between aspects
    
    analyze_name_variations: bool = False
    # Analyze multiple name variations if provided
```

## Output Data Model

### NumerologyOutput

```python
class NumerologyOutput(CloudflareEngineOutput):
    """Complete Numerology Engine output."""
    
    # === CORE NUMBERS ===
    
    life_path: int
    # Life Path number (1-9, 11, 22, 33, 44)
    # Soul's curriculum for this incarnation
    
    expression: int
    # Expression number (1-9, 11, 22, 33, 44)
    # Outer manifestation of soul-essence
    
    soul_urge: int
    # Soul Urge number (1-9, 11, 22, 33, 44)
    # Inner compass and deepest motivations
    
    personality: int
    # Personality number (1-9, 11, 22, 33, 44)
    # Social mask and outer persona
    
    # === DERIVED NUMBERS ===
    
    maturity: int
    # Maturity number (Life Path + Expression)
    # Who you become in later life (after age 35)
    
    personal_year: int
    # Personal Year number (1-9, no master numbers)
    # Current year's vibrational theme
    
    # === BRIDGE NUMBERS ===
    
    life_expression_bridge: int
    # Gap between Life Path and Expression (0-9)
    # Shows alignment of purpose and expression
    
    soul_personality_bridge: int
    # Gap between Soul Urge and Personality (0-9)
    # Shows alignment of inner desires and outer presentation
    
    # === SPECIAL NUMBERS ===
    
    master_numbers: List[int]
    # Master numbers detected (11, 22, 33, 44)
    # Indicates heightened spiritual responsibility
    
    karmic_debt: List[int]
    # Karmic debt numbers detected (13, 14, 16, 19)
    # Lessons to be learned from past lives
    
    # === METADATA ===
    
    numerology_system: str
    # System used: "pythagorean" or "chaldean"
    
    calculation_year: int
    # Year used for Personal Year calculation
    
    name_breakdown: Dict[str, Any]
    # Detailed name analysis
    # Contains: letters_only, total_letters, vowel_count, consonant_count
    
    # === INTERPRETATIONS ===
    
    core_meanings: Dict[str, str]
    # Meanings for each core number
    # Keys: "life_path", "expression", "soul_urge", "personality"
    
    yearly_guidance: str
    # Guidance for current Personal Year
    
    life_purpose: str
    # Life purpose description based on Life Path
```

## API Endpoints

### REST API

#### POST /api/v1/numerology/calculate

Calculate complete numerology profile.

**Request:**

```json
{
  "user_id": "user_123",
  "full_name": "John Michael Doe",
  "birth_date": "1990-05-15",
  "system": "pythagorean",
  "current_year": 2024,
  "preferred_name": "Mike Doe"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "engine_name": "numerology",
  "calculation_time": 0.023,
  "confidence_score": 1.0,
  
  "life_path": 3,
  "expression": 5,
  "soul_urge": 5,
  "personality": 9,
  "maturity": 8,
  "personal_year": 1,
  
  "life_expression_bridge": 2,
  "soul_personality_bridge": 4,
  
  "master_numbers": [],
  "karmic_debt": [],
  
  "numerology_system": "pythagorean",
  "calculation_year": 2024,
  
  "name_breakdown": {
    "letters_only": "JOHNMICHAELDOE",
    "total_letters": 14,
    "vowel_count": 5,
    "consonant_count": 9
  },
  
  "core_meanings": {
    "life_path": "The Creative - Expression, communication, and artistic gifts",
    "expression": "The Explorer - Freedom, adventure, and dynamic change",
    "soul_urge": "The Explorer - Freedom-seeking inner nature",
    "personality": "The Humanitarian - Compassionate outer presentation"
  },
  
  "yearly_guidance": "Personal Year 1: New beginnings, fresh starts, planting seeds for the future",
  
  "life_purpose": "Your soul chose this incarnation to master creative expression and communication",
  
  "formatted_output": "🔢 NUMEROLOGY FIELD EXTRACTION - JOHN MICHAEL DOE 🔢\n\n═══ SOUL-NUMBER MATRIX ═══\n\nLife Path 3: The Creative - Expression, communication, and artistic gifts\n\nYour soul chose this incarnation to master the archetypal frequency of 3. This is not your personality—this is your soul's curriculum for conscious evolution.\n\nExpression 5: Your outer manifestation carries the vibrational signature of 5, indicating how your soul-essence translates into worldly expression.\n\nSoul Urge 5: Your inner compass resonates at frequency 5, revealing what truly motivates your deepest self.\n\nPersonality 9: Others perceive your field signature as 9, the energetic mask through which you interface with consensus reality.\n\n═══ CURRENT FIELD STATE ═══\n\nPersonal Year 1: New beginnings, fresh starts, planting seeds for the future\n\nThis year's vibrational theme optimizes your field for new beginnings and fresh starts.\n\n═══ ARCHETYPAL RESONANCE ═══\n\nHarmonic Resonance: Your purpose and expression support each other\n\n═══ FIELD OPTIMIZATION NOTES ═══\n\nInitiate new projects aligned with your Life Path frequency\nMeditate on your Life Path number 3 during morning breathwork\nNotice how your name affects others' responses to your energy field\n\nRemember: These are not predictions—they are pattern recognitions for conscious navigation of your reality field.",
  
  "recommendations": [
    "Practice creative expression daily",
    "Start that project you've been contemplating",
    "Meditate on your Life Path number 3 during morning breathwork",
    "Notice how your name affects others' responses to your energy field",
    "Experiment with different name variations in different contexts"
  ],
  
  "reality_patches": [
    "Install: Numerological field coherence protocol",
    "Patch: Soul-number matrix optimization",
    "Upgrade: Vibrational signature alignment module",
    "Initialize: New cycle manifestation engine"
  ],
  
  "archetypal_themes": ["Artist", "Communicator", "Entertainer"]
}
```

**Error Responses:**

```json
// 400 Bad Request - Invalid name
{
  "success": false,
  "error": "InvalidName",
  "message": "Name must contain at least 2 letters"
}

// 400 Bad Request - Invalid birth date
{
  "success": false,
  "error": "InvalidBirthDate",
  "message": "Birth date cannot be in the future"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "CalculationError",
  "message": "Numerology calculation failed"
}
```

#### POST /api/v1/numerology/batch

Calculate numerology for multiple names.

**Request:**

```json
{
  "user_id": "user_123",
  "birth_date": "1990-05-15",
  "names": [
    "John Michael Doe",
    "Mike Doe",
    "J. Michael Doe"
  ],
  "system": "pythagorean",
  "current_year": 2024
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "results": [
    {
      "name": "John Michael Doe",
      "life_path": 3,
      "expression": 5,
      "soul_urge": 5,
      "personality": 9
    },
    {
      "name": "Mike Doe",
      "life_path": 3,
      "expression": 8,
      "soul_urge": 6,
      "personality": 2
    },
    {
      "name": "J. Michael Doe",
      "life_path": 3,
      "expression": 3,
      "soul_urge": 5,
      "personality": 7
    }
  ],
  "comparison": {
    "consistent_numbers": ["life_path", "soul_urge"],
    "variations": ["expression", "personality"],
    "recommendation": "Birth name (John Michael Doe) carries original soul vibration. Consider using preferred name (Mike Doe) professionally for Expression 8 (achievement) energy."
  }
}
```

#### POST /api/v1/numerology/compare-systems

Compare Pythagorean and Chaldean systems.

**Request:**

```json
{
  "user_id": "user_123",
  "full_name": "John Michael Doe",
  "birth_date": "1990-05-15"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "pythagorean": {
    "life_path": 3,
    "expression": 5,
    "soul_urge": 5,
    "personality": 9
  },
  "chaldean": {
    "life_path": 3,
    "expression": 7,
    "soul_urge": 6,
    "personality": 1
  },
  "comparison": {
    "same_numbers": ["life_path"],
    "different_numbers": ["expression", "soul_urge", "personality"],
    "recommendation": "Life Path is identical in both systems (3 - The Creative). Expression varies: Pythagorean emphasizes freedom (5), Chaldean emphasizes spirituality (7)."
  }
}
```

#### GET /api/v1/numerology/personal-year/{user_id}/{year}

Get Personal Year for specific year.

**Response (200 OK):**

```json
{
  "success": true,
  "user_id": "user_123",
  "year": 2025,
  "personal_year": 2,
  "meaning": "Cooperation, patience, developing relationships and partnerships",
  "guidance": "Focus on collaboration and building partnerships this year",
  "optimal_activities": [
    "Develop partnerships",
    "Practice patience",
    "Focus on relationships",
    "Diplomacy and mediation"
  ]
}
```

#### POST /api/v1/numerology/life-path-only

Quick Life Path calculation (no name required).

**Request:**

```json
{
  "birth_date": "1990-05-15"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "life_path": 3,
  "meaning": "The Creative - Expression, communication, and artistic gifts",
  "calculation_breakdown": {
    "year": 1990,
    "year_reduced": 1,
    "month": 5,
    "day": 15,
    "day_reduced": 6,
    "sum": 12,
    "final": 3
  }
}
```

## SDK Examples

### Python SDK

```python
from witnessos import NumerologyClient

client = NumerologyClient(api_key="your_api_key")

# Complete profile
result = client.calculate(
    user_id="user_123",
    full_name="John Michael Doe",
    birth_date="1990-05-15",
    system="pythagorean"
)

print(f"Life Path: {result.life_path}")
print(f"Expression: {result.expression}")
print(f"Personal Year: {result.personal_year}")

# Batch name analysis
batch_result = client.batch_analyze(
    user_id="user_123",
    birth_date="1990-05-15",
    names=["John Michael Doe", "Mike Doe", "J.M. Doe"]
)

# Compare systems
comparison = client.compare_systems(
    user_id="user_123",
    full_name="John Michael Doe",
    birth_date="1990-05-15"
)

print(f"Pythagorean Expression: {comparison.pythagorean.expression}")
print(f"Chaldean Expression: {comparison.chaldean.expression}")

# Personal Year forecast
personal_years = client.get_personal_year_forecast(
    user_id="user_123",
    birth_date="1990-05-15",
    years=[2024, 2025, 2026]
)

for year_data in personal_years:
    print(f"{year_data.year}: Personal Year {year_data.personal_year}")
```

### JavaScript SDK

```javascript
import { NumerologyClient } from '@witnessos/sdk';

const client = new NumerologyClient({ apiKey: 'your_api_key' });

// Complete profile
const result = await client.calculate({
  userId: 'user_123',
  fullName: 'John Michael Doe',
  birthDate: '1990-05-15',
  system: 'pythagorean'
});

console.log('Life Path:', result.lifePath);
console.log('Expression:', result.expression);
console.log('Personal Year:', result.personalYear);

// Name variation analysis
const variations = await client.batchAnalyze({
  userId: 'user_123',
  birthDate: '1990-05-15',
  names: ['John Michael Doe', 'Mike Doe', 'J.M. Doe']
});

// Compare systems
const comparison = await client.compareSystems({
  userId: 'user_123',
  fullName: 'John Michael Doe',
  birthDate: '1990-05-15'
});
```

## Rate Limits

```
Free Tier:    50 calculations/day
Basic Tier:   500 calculations/day
Pro Tier:     5000 calculations/day
Enterprise:   Unlimited (custom SLA)
```

## Data Model Details

### Name Breakdown

```python
{
  "letters_only": "JOHNMICHAELDOE",    # All letters, uppercase
  "total_letters": 14,                 # Letter count
  "vowel_count": 5,                    # Number of vowels
  "consonant_count": 9,                # Number of consonants
  "length_vibration": 5,               # Reduced number from length
  "first_letter": "J",                 # First letter
  "first_letter_value": 1,             # First letter numerology value
  "last_letter": "E",                  # Last letter
  "last_letter_value": 5               # Last letter numerology value
}
```

### Master Numbers

```python
{
  11: "The Intuitive - Spiritual illumination and inspiration",
  22: "The Master Builder - Manifesting dreams into reality",
  33: "The Master Teacher - Spiritual guidance and healing",
  44: "The Master Organizer - Creating stable systems for humanity"
}
```

### Karmic Debt Numbers

```python
{
  13: "Laziness in past life - Must work hard and stay positive",
  14: "Abuse of freedom in past life - Must find balance",
  16: "Ego and selfishness in past life - Must develop humility",
  19: "Abuse of power in past life - Must learn to serve"
}
```

## Webhooks

### numerology.calculation.completed

Triggered when numerology calculation completes.

**Payload:**

```json
{
  "event": "numerology.calculation.completed",
  "timestamp": "2024-01-26T12:34:56.789Z",
  "user_id": "user_123",
  "data": {
    "life_path": 3,
    "expression": 5,
    "personal_year": 1,
    "system": "pythagorean"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_NAME` | Name validation failed |
| `INVALID_BIRTH_DATE` | Birth date validation failed |
| `INVALID_SYSTEM` | Unsupported numerology system |
| `CALCULATION_ERROR` | Internal calculation error |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |

## Best Practices

1. **Use Full Birth Name** - Always use the full name as it appears on birth certificate for accuracy
2. **Cache Results** - Numerology calculations are deterministic, cache results by name + birth date
3. **Batch Processing** - Use batch endpoints for multiple name variations
4. **System Comparison** - Compare both systems for comprehensive insights
5. **Personal Year Tracking** - Calculate Personal Year at start of each calendar year

## Summary

The Numerology API provides:

- **Complete Profile Calculation** - All core and derived numbers
- **Dual System Support** - Pythagorean and Chaldean
- **Batch Processing** - Multiple name analysis
- **System Comparison** - Side-by-side comparison
- **Personal Year Forecasting** - Multi-year planning
- **Simple Integration** - RESTful API with SDKs
