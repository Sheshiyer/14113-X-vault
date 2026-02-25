# I-Ching API Specification

## Casting API

### Endpoint: Generate I-Ching Reading

#### Request Format

**Input Model:** `IChingInput`

```json
{
  "question": "What should I focus on in my career this month?",
  "method": "coins",
  "focus_area": "career",
  "include_changing_lines": true,
  "user_id": "user_12345"
}
```

**Field Specifications:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `question` | string | No | null | The question being asked |
| `method` | enum | No | "coins" | Divination method: "coins", "yarrow", or "random" |
| `focus_area` | string | No | null | Specific life area (career, relationships, spiritual, etc.) |
| `include_changing_lines` | boolean | No | true | Whether to include changing line interpretations |
| `user_id` | string | No | null | User identifier for personalization |

**Method Options:**

- **`coins`**: Traditional three-coin toss method (6 tosses)
  - 25% chance of changing lines per position
  - Most commonly used method
  
- **`yarrow`**: Yarrow stalk method with authentic probabilities
  - 6.25% Old Yin, 31.25% Young Yang, 43.75% Young Yin, 18.75% Old Yang
  - More nuanced probability distribution
  
- **`random`**: Pure random selection
  - Equal probability for all line values
  - Fastest computation

#### Python SDK Usage

```python
from engines.iching import IChingMutationOracle
from engines.iching_models import IChingInput

# Initialize engine
engine = IChingMutationOracle()

# Create input
input_data = IChingInput(
    question="What should I focus on in my career this month?",
    method="coins",
    focus_area="career"
)

# Get reading
output = engine.run(input_data)

# Access results
print(output.formatted_output)
print(output.raw_data["reading"])
```

#### Response Format

**Output Model:** `IChingOutput`

```json
{
  "engine_name": "I-Ching Mutation Oracle",
  "calculation_time": 0.045,
  "confidence_score": 0.92,
  "timestamp": "2026-01-25T14:30:00Z",
  "field_signature": "iching_hexagram_guidance",
  
  "formatted_output": "☯️ I-Ching Reading for: What should I focus on...\n\n🔮 Method: Coins divination...",
  
  "recommendations": [
    "The Creative hexagram emphasizes creativity, strength, leadership",
    "Method used: coins divination",
    "Changing lines at positions 2, 5 indicate transformation",
    "Evolution toward The Receptive suggests future development"
  ],
  
  "archetypal_themes": [
    "Leadership and initiative",
    "Transformation through yielding",
    "Balance of masculine and feminine energies"
  ],
  
  "raw_data": {
    "reading": {
      "primary_hexagram": {
        "number": 1,
        "name": "The Creative",
        "chinese": "乾 (Qián)",
        "trigrams": ["Heaven", "Heaven"],
        "binary": "111111",
        "keywords": ["creativity", "strength", "leadership", "initiative"],
        "judgment": "The Creative works sublime success, furthering through perseverance.",
        "image": "The movement of heaven is full of power...",
        "meaning": "Pure creative energy...",
        "divination": "Great success is possible through persistent effort...",
        "changing_lines": {
          "1": "Hidden dragon. Do not act.",
          "2": "Dragon appearing in the field...",
          ...
        }
      },
      "primary_lines": [
        {
          "position": 1,
          "value": 7,
          "type": "yang",
          "changing": false
        },
        {
          "position": 2,
          "value": 9,
          "type": "yang",
          "changing": true
        },
        ...
      ],
      "mutation_hexagram": {
        "number": 2,
        "name": "The Receptive",
        "chinese": "坤 (Kūn)",
        ...
      },
      "mutation_lines": [...],
      "changing_lines": [2, 5],
      "method_used": "coins"
    },
    "question_asked": "What should I focus on in my career this month?",
    "reading_timestamp": "2026-01-25T14:30:00Z",
    "method_used": "coins",
    "overall_interpretation": "Primary Hexagram: The Creative\n\nCore Meaning: Pure creative energy...",
    "key_insights": [
      "The Creative hexagram emphasizes creativity, strength, leadership",
      "Method used: coins divination",
      "Changing lines at positions 2, 5 indicate transformation"
    ],
    "guidance_summary": "The I-Ching reveals The Creative, guiding you to embrace creativity, strength.",
    "changing_line_count": 2,
    "has_mutation": true,
    "trigram_elements": ["Metal", "Metal"],
    "field_resonance": {
      "Warrior": 0.65,
      "Magician": 0.82,
      "Lover": 0.43,
      ...
    }
  }
}
```

### Interpretation Retrieval API

#### Get Hexagram by Number

```python
def get_hexagram_by_number(number: int) -> Hexagram:
    """
    Retrieve hexagram data by its number.
    
    Args:
        number: Hexagram number (1-64)
    
    Returns:
        Hexagram object with complete data
    """
```

**Example:**

```python
engine = IChingMutationOracle()
hexagram = engine._get_hexagram_by_number(1)

print(hexagram.name)       # "The Creative"
print(hexagram.judgment)   # "The Creative works sublime success..."
print(hexagram.keywords)   # ["creativity", "strength", "leadership", "initiative"]
```

#### Get Changing Line Interpretation

```python
def interpret_changing_lines(
    hexagram_number: int, 
    changing_positions: List[int]
) -> List[str]:
    """
    Get interpretations for specific changing lines.
    
    Args:
        hexagram_number: Hexagram number (1-64)
        changing_positions: List of line positions (1-6)
    
    Returns:
        List of interpretation strings
    """
```

**Example:**

```python
hexagram = engine._get_hexagram_by_number(1)
interpretations = engine._interpret_changing_lines(hexagram, [2, 5])

# Returns:
# [
#   "Line 2: Dragon appearing in the field. It furthers one to see the great man.",
#   "Line 5: Flying dragon in the heavens. It furthers one to see the great man."
# ]
```

#### Identify Trigram

```python
def identify_trigram(lines: List[int]) -> str:
    """
    Identify trigram name from three line values.
    
    Args:
        lines: List of 3 line values
    
    Returns:
        Trigram name
    """
```

### Batch Reading API

For generating multiple readings at once:

```python
def generate_batch_readings(
    questions: List[str],
    method: str = "coins"
) -> List[IChingOutput]:
    """
    Generate multiple readings in batch.
    
    Args:
        questions: List of questions to ask
        method: Divination method to use for all readings
    
    Returns:
        List of IChingOutput objects
    """
```

**Example:**

```python
questions = [
    "What energy surrounds my work situation?",
    "How should I approach my relationship?",
    "What is my spiritual focus now?"
]

results = engine.generate_batch_readings(questions, method="yarrow")

for i, output in enumerate(results):
    print(f"\n{questions[i]}")
    print(f"Hexagram: {output.raw_data['reading'].primary_hexagram.name}")
```

## Divination Method Endpoints

### Coin Method Simulation

```python
def simulate_coin_toss() -> List[int]:
    """
    Simulate a complete coin-based I-Ching casting.
    
    Returns:
        List of 6 line values generated by coin method
    """
```

**Process:**
1. Six iterations (one per line)
2. Three coin tosses per iteration
3. Count heads to determine line value
4. Returns list of line values [6, 7, 8, or 9]

### Yarrow Stalk Simulation

```python
def simulate_yarrow_stalk() -> List[int]:
    """
    Simulate a complete yarrow stalk casting.
    
    Returns:
        List of 6 line values with yarrow probabilities
    """
```

**Probability Distribution:**
- More nuanced than coins
- Emphasizes Young Yin (8) at 43.75%
- Old lines (6, 9) less common at 6.25% and 18.75%

### Question-Seeded Generation

```python
def generate_seeded_reading(
    question: str,
    timestamp: datetime,
    method: str = "coins"
) -> IChingOutput:
    """
    Generate a deterministic reading based on question and time.
    
    Args:
        question: The question being asked
        timestamp: Specific time for the reading
        method: Divination method
    
    Returns:
        Reproducible IChingOutput for same inputs
    """
```

**Use Cases:**
- Reproducible readings for testing
- "Question of the day" features
- Historical reading reconstruction
- Synchronicity exploration

## Advanced Features

### Nuclear Hexagram Analysis

```python
def get_nuclear_hexagrams(lines: List[int]) -> Dict[str, Hexagram]:
    """
    Extract nuclear (inner) hexagrams from a reading.
    
    Nuclear hexagrams reveal hidden aspects:
    - Lower nuclear: lines 2, 3, 4
    - Upper nuclear: lines 3, 4, 5
    
    Args:
        lines: The six line values
    
    Returns:
        Dictionary with "lower" and "upper" nuclear hexagrams
    """
```

### Hexagram Relationships

```python
def get_related_hexagrams(hexagram_number: int) -> Dict[str, Hexagram]:
    """
    Get related hexagrams for deeper analysis.
    
    Returns:
        - "inverse": All lines reversed (yin↔yang)
        - "opposite": Hexagram flipped upside down
        - "mutual": Nuclear hexagrams
    """
```

### Trigram Relationship Analysis

```python
def analyze_trigram_relationship(
    lower_trigram: str, 
    upper_trigram: str
) -> Dict[str, Any]:
    """
    Analyze the relationship between upper and lower trigrams.
    
    Returns:
        - Element interaction (Five Elements cycle)
        - Family dynamics
        - Seasonal qualities
        - Directional meanings
    """
```

## Response Codes and Error Handling

### Success Response

```json
{
  "status": "success",
  "data": { IChingOutput object }
}
```

### Error Responses

#### Invalid Method

```json
{
  "status": "error",
  "error_code": "INVALID_METHOD",
  "message": "Method must be one of: coins, yarrow, random",
  "details": {
    "provided_method": "dice",
    "valid_methods": ["coins", "yarrow", "random"]
  }
}
```

#### Data Loading Error

```json
{
  "status": "error",
  "error_code": "DATA_LOAD_FAILED",
  "message": "Failed to load I-Ching hexagram data",
  "details": {
    "file": "hexagrams.json",
    "error": "File not found"
  }
}
```

#### Invalid Hexagram Number

```json
{
  "status": "error",
  "error_code": "INVALID_HEXAGRAM",
  "message": "Hexagram number must be between 1 and 64",
  "details": {
    "provided": 100,
    "valid_range": [1, 64]
  }
}
```

## API Rate Limits

### Free Tier
- 100 readings per day
- No batch requests
- Standard interpretation only

### Premium Tier
- Unlimited readings
- Batch requests (up to 10 per call)
- Advanced analysis (nuclear hexagrams, relationships)
- Historical reading storage

## WebSocket API (Real-Time)

For interactive casting experiences:

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://api.witnesos.com/iching/cast');

// Start casting
ws.send(JSON.stringify({
  action: 'start_casting',
  method: 'coins',
  question: 'What energy surrounds my day?'
}));

// Receive line-by-line updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'line_cast') {
    console.log(`Line ${data.position}: ${data.value}`);
  }
  
  if (data.type === 'reading_complete') {
    console.log('Final reading:', data.reading);
  }
};
```

**Event Types:**
- `line_cast`: Each line as it's generated
- `hexagram_identified`: Primary hexagram determined
- `mutation_calculated`: Mutation hexagram (if applicable)
- `reading_complete`: Full interpretation ready

## GraphQL Schema

```graphql
type Hexagram {
  number: Int!
  name: String!
  chinese: String!
  trigrams: [String!]!
  binary: String!
  keywords: [String!]!
  judgment: String!
  image: String!
  meaning: String!
  divination: String!
  changingLines: JSON
}

type HexagramLine {
  position: Int!
  value: Int!
  type: LineType!
  changing: Boolean!
  interpretation: String
}

enum LineType {
  YIN
  YANG
}

type IChingReading {
  primaryHexagram: Hexagram!
  primaryLines: [HexagramLine!]!
  mutationHexagram: Hexagram
  mutationLines: [HexagramLine]
  changingLines: [Int!]!
  methodUsed: String!
}

type Query {
  # Get hexagram by number
  hexagram(number: Int!): Hexagram
  
  # Get all hexagrams
  allHexagrams: [Hexagram!]!
  
  # Get reading by ID
  reading(id: ID!): IChingReading
}

type Mutation {
  # Generate new reading
  castReading(
    question: String
    method: CastingMethod = COINS
    focusArea: String
  ): IChingReading!
}

enum CastingMethod {
  COINS
  YARROW
  RANDOM
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { IChingClient } from '@witnesos/iching-sdk';

const client = new IChingClient({ apiKey: 'your-api-key' });

async function getReading() {
  const reading = await client.cast({
    question: "What should I focus on today?",
    method: "coins",
    includeChangingLines: true
  });
  
  console.log(`Hexagram: ${reading.primaryHexagram.name}`);
  console.log(`Guidance: ${reading.guidanceSummary}`);
  
  if (reading.mutationHexagram) {
    console.log(`Evolving toward: ${reading.mutationHexagram.name}`);
  }
}
```

### Python

```python
from witnesos_sdk import IChingClient

client = IChingClient(api_key='your-api-key')

reading = client.cast(
    question="What should I focus on today?",
    method="coins",
    include_changing_lines=True
)

print(f"Hexagram: {reading.primary_hexagram.name}")
print(f"Guidance: {reading.guidance_summary}")

if reading.mutation_hexagram:
    print(f"Evolving toward: {reading.mutation_hexagram.name}")
```

### REST API (cURL)

```bash
curl -X POST https://api.witnesos.com/v1/iching/cast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "question": "What should I focus on today?",
    "method": "coins",
    "include_changing_lines": true
  }'
```

## Caching Strategy

### Reading Cache

Readings with identical question+timestamp are cached for reproducibility:

```python
cache_key = f"iching:{md5(question)}:{timestamp.isoformat()}"
cache_ttl = 86400  # 24 hours
```

### Hexagram Data Cache

Static hexagram data cached indefinitely:

```python
cache_key = f"iching:hexagram:{number}"
cache_ttl = None  # Never expire
```

---

*Last Updated: 2026*  
*Source: WitnessOS I-Ching Mutation Oracle Engine*
