# Tarot API Specification

## Draw API

### Endpoint: Generate Tarot Reading

#### Request Format

**Input Model:** `TarotInput`

```json
{
  "question": "What energies surround my career transition?",
  "spread_type": "celtic_cross",
  "deck_type": "rider_waite",
  "include_reversed": true,
  "focus_area": "career",
  "user_id": "user_12345"
}
```

**Field Specifications:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `question` | string | No | null | The question being asked |
| `spread_type` | enum | No | "three_card" | Spread layout: "single_card", "three_card", or "celtic_cross" |
| `deck_type` | string | No | "rider_waite" | Tarot deck to use |
| `include_reversed` | boolean | No | true | Whether to include reversed cards (30% chance per card) |
| `focus_area` | string | No | null | Specific life area (love, career, spiritual, health, etc.) |
| `user_id` | string | No | null | User identifier for personalization |

**Spread Type Options:**

- **`single_card`**: Quick daily guidance (1 card)
- **`three_card`**: Past-Present-Future or other 3-position spreads (3 cards)
- **`celtic_cross`**: Comprehensive 10-card spread for deep analysis (10 cards)

#### Python SDK Usage

```python
from engines.tarot import TarotSequenceDecoder
from engines.tarot_models import TarotInput

# Initialize engine
engine = TarotSequenceDecoder()

# Create input
input_data = TarotInput(
    question="What energies surround my career transition?",
    spread_type="celtic_cross",
    include_reversed=True,
    focus_area="career"
)

# Get reading
output = engine.run(input_data)

# Access results
print(output.formatted_output)
for card in output.raw_data["drawn_cards"]:
    print(f"{card.position}: {card.card.name} ({'Reversed' if card.reversed else 'Upright'})")
```

#### Response Format

**Output Model:** `TarotOutput`

```json
{
  "engine_name": "Tarot Sequence Decoder",
  "calculation_time": 0.038,
  "confidence_score": 0.88,
  "timestamp": "2026-01-25T15:45:00Z",
  "field_signature": "tarot_archetypal_guidance",
  
  "formatted_output": "🎴 Tarot Reading for: What energies surround...\n\n📋 Spread: Celtic Cross...",
  
  "recommendations": [
    "The Knight of Wands in position 1 emphasizes present situation",
    "The High Priestess in position 2 emphasizes challenge or cross",
    "The Tower in position 3 emphasizes distant past/foundation"
  ],
  
  "archetypal_themes": [
    "Transformation and change",
    "Intuition and inner knowing",
    "Action and momentum"
  ],
  
  "raw_data": {
    "spread_layout": {
      "name": "Celtic Cross",
      "description": "Comprehensive 10-card spread",
      "card_count": 10,
      "positions": [
        {"position": 1, "meaning": "Present situation"},
        {"position": 2, "meaning": "Challenge or cross"},
        ...
      ]
    },
    "drawn_cards": [
      {
        "card": {
          "name": "Knight of Wands",
          "suit": "wands",
          "number": "knight",
          "arcana_type": "minor",
          "keywords": ["energy", "passion", "adventure"],
          "upright_meaning": "Energy, passion, inspired action, adventure, impulsiveness",
          "reversed_meaning": "Passion project, haste, scattered energy, delays, frustration",
          "element": "Fire"
        },
        "position": 1,
        "position_meaning": "Present situation",
        "reversed": false,
        "interpretation": "In the position of 'Present situation', Knight of Wands indicates: Energy, passion, inspired action..."
      },
      ...
    ],
    "question_asked": "What energies surround my career transition?",
    "reading_timestamp": "2026-01-25T15:45:00Z",
    "deck_used": "rider_waite",
    "overall_theme": "This reading centers around transformation and change...",
    "key_insights": [
      "The Knight of Wands in position 1 emphasizes present situation",
      "The High Priestess in position 2 emphasizes challenge or cross",
      "The Tower in position 3 emphasizes distant past/foundation"
    ],
    "guidance_summary": "The cards guide you to focus on...",
    "elemental_balance": {
      "Fire": 3,
      "Water": 2,
      "Air": 3,
      "Earth": 2
    },
    "archetypal_patterns": [
      "Multiple court cards suggest people or personality aspects are significant",
      "Practical/everyday focus - attention to daily life matters"
    ],
    "energy_forecast": "The energy suggests a time of reflection and conscious choice-making.",
    "timing_indicators": ["Present moment awareness", "Seasonal transitions"],
    "action_steps": [
      "Meditate on the card imagery",
      "Journal about the insights received",
      "Take one small aligned action today"
    ],
    "meditation_focus": "Focus on the central card's imagery and let insights arise naturally.",
    "synchronicity_notes": "Notice how these themes appear in your daily life over the next week."
  }
}
```

## Spread Calculation API

### Get Available Spreads

```python
def get_available_spreads() -> Dict[str, SpreadLayout]:
    """
    Get all available spread layouts.
    
    Returns:
        Dictionary mapping spread_type to SpreadLayout objects
    """
```

**Example:**

```python
engine = TarotSequenceDecoder()
spreads = engine.get_available_spreads()

for spread_type, layout in spreads.items():
    print(f"{layout.name}: {layout.card_count} cards")
    for pos in layout.positions:
        print(f"  Position {pos['position']}: {pos['meaning']}")
```

### Get Spread Layout

```python
def get_spread_layout(spread_type: str) -> SpreadLayout:
    """
    Get layout for a specific spread type.
    
    Args:
        spread_type: "single_card", "three_card", or "celtic_cross"
    
    Returns:
        SpreadLayout object with positions and meanings
    """
```

## Card Retrieval API

### Get Card by Name

```python
def get_card_by_name(card_name: str) -> TarotCard:
    """
    Retrieve card data by its name.
    
    Args:
        card_name: Full card name (e.g., "The Fool", "Ace of Wands")
    
    Returns:
        TarotCard object
    """
```

**Example:**

```python
engine = TarotSequenceDecoder()
fool = engine.get_card_by_name("The Fool")

print(fool.keywords)  # ["new beginnings", "innocence", "spontaneity"]
print(fool.element)   # "Air"
```

### Get Cards by Suit

```python
def get_cards_by_suit(suit: str) -> List[TarotCard]:
    """
    Get all cards from a specific suit.
    
    Args:
        suit: "wands", "cups", "swords", or "pentacles"
    
    Returns:
        List of 14 cards in the suit
    """
```

### Get Major Arcana

```python
def get_major_arcana() -> List[TarotCard]:
    """
    Get all 22 Major Arcana cards.
    
    Returns:
        List of Major Arcana cards in order (0-21)
    """
```

### Get Court Cards

```python
def get_court_cards() -> List[TarotCard]:
    """
    Get all court cards (Pages, Knights, Queens, Kings).
    
    Returns:
        List of 16 court cards (4 per suit)
    """
```

## Interpretation Retrieval API

### Interpret Card in Context

```python
def interpret_card_in_context(
    card_name: str,
    position_meaning: str,
    reversed: bool = False,
    question: str = ""
) -> str:
    """
    Get contextual interpretation for a card.
    
    Args:
        card_name: Name of the card
        position_meaning: What the position represents
        reversed: Whether card is reversed
        question: Question context
    
    Returns:
        Contextual interpretation string
    """
```

**Example:**

```python
interpretation = engine.interpret_card_in_context(
    card_name="The Tower",
    position_meaning="Challenge or cross",
    reversed=False,
    question="Should I change careers?"
)
# Returns: "In the position of 'Challenge or cross', The Tower indicates:
#           Sudden change, upheaval, chaos, revelation, awakening..."
```

## Batch Reading API

For generating multiple readings at once:

```python
def generate_batch_readings(
    questions: List[str],
    spread_type: str = "three_card",
    include_reversed: bool = True
) -> List[TarotOutput]:
    """
    Generate multiple readings in batch.
    
    Args:
        questions: List of questions to ask
        spread_type: Spread to use for all readings
        include_reversed: Whether to include reversals
    
    Returns:
        List of TarotOutput objects
    """
```

**Example:**

```python
questions = [
    "What energy surrounds my work today?",
    "What do I need to know about my relationship?",
    "What spiritual lesson is present?"
]

results = engine.generate_batch_readings(questions, spread_type="single_card")

for i, output in enumerate(results):
    print(f"\n{questions[i]}")
    card = output.raw_data["drawn_cards"][0]
    print(f"Card: {card.card.name}")
    print(f"Guidance: {output.raw_data['guidance_summary']}")
```

## Pattern Analysis API

### Analyze Elemental Balance

```python
def analyze_elemental_balance(cards: List[DrawnCard]) -> Dict[str, Any]:
    """
    Analyze elemental distribution in cards.
    
    Returns:
        - element_counts: Dict[str, int]
        - dominant_element: str
        - interpretation: str
    """
```

### Identify Archetypal Patterns

```python
def identify_patterns(cards: List[DrawnCard]) -> Dict[str, Any]:
    """
    Identify archetypal patterns in card selection.
    
    Returns:
        - major_arcana_density: float
        - court_card_analysis: Dict
        - ace_pattern: Dict
        - numerical_patterns: List[str]
        - suit_concentration: Dict[str, int]
    """
```

### Calculate Reading Intensity

```python
def calculate_reading_intensity(cards: List[DrawnCard]) -> Dict[str, Any]:
    """
    Calculate the intensity/urgency of a reading.
    
    Based on:
    - Presence of intense cards (Tower, Death, Devil)
    - Multiple Major Arcana
    - Reversed card count
    - Elemental extremes
    
    Returns:
        - intensity_score: float (0-1)
        - urgency_level: str ("low", "medium", "high")
        - key_indicators: List[str]
    """
```

## Advanced Features

### Card of the Day

```python
def get_card_of_the_day(date: datetime = None, user_id: str = None) -> TarotCard:
    """
    Get a deterministic card for a specific date.
    
    Uses date and optional user_id for seeding, allowing:
    - Same card for same date+user combination
    - Personal card of the day practice
    - Retrospective analysis
    
    Args:
        date: Date for the card (defaults to today)
        user_id: Optional user identifier for personalization
    
    Returns:
        TarotCard object for that day
    """
```

### Reversed Card Analysis

```python
def analyze_reversed_cards(cards: List[DrawnCard]) -> Dict[str, Any]:
    """
    Analyze the reversed cards in a reading.
    
    Returns:
        - reversed_count: int
        - reversed_percentage: float
        - blocked_energies: List[str]
        - shadow_themes: List[str]
        - integration_guidance: str
    """
```

### Suit Journey Analysis

```python
def analyze_suit_journey(cards: List[DrawnCard]) -> Dict[str, Any]:
    """
    Analyze if cards show a journey through a suit.
    
    Sequential cards in same suit indicate progression:
    - Ace through Ten: Complete cycle
    - Court progression: Maturation
    
    Returns:
        - journeys_found: List[Dict]
        - interpretation: str
    """
```

## Response Codes and Error Handling

### Success Response

```json
{
  "status": "success",
  "data": { TarotOutput object }
}
```

### Error Responses

#### Invalid Spread Type

```json
{
  "status": "error",
  "error_code": "INVALID_SPREAD_TYPE",
  "message": "Spread type must be one of: single_card, three_card, celtic_cross",
  "details": {
    "provided_spread": "five_card",
    "valid_spreads": ["single_card", "three_card", "celtic_cross"]
  }
}
```

#### Data Loading Error

```json
{
  "status": "error",
  "error_code": "DATA_LOAD_FAILED",
  "message": "Failed to load tarot deck data",
  "details": {
    "file": "rider_waite.json",
    "error": "File not found or corrupted"
  }
}
```

#### Card Not Found

```json
{
  "status": "error",
  "error_code": "CARD_NOT_FOUND",
  "message": "Card with specified name not found in deck",
  "details": {
    "provided_name": "The Illusionist",
    "suggestion": "Did you mean 'The Magician'?"
  }
}
```

## API Rate Limits

### Free Tier
- 50 readings per day
- No batch requests
- Single deck (Rider-Waite)
- Basic interpretation

### Premium Tier
- Unlimited readings
- Batch requests (up to 10 per call)
- Multiple decks available
- Advanced pattern analysis
- Historical reading storage
- Custom spread creation

## WebSocket API (Real-Time)

For interactive card-by-card reveals:

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://api.witnesos.com/tarot/draw');

// Start reading
ws.send(JSON.stringify({
  action: 'start_reading',
  spread_type: 'celtic_cross',
  question: 'What energies surround my situation?',
  include_reversed: true
}));

// Receive card-by-card updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'card_drawn') {
    console.log(`Position ${data.position}: ${data.card.name} (${data.reversed ? 'Reversed' : 'Upright'})`);
    // Update UI with card reveal animation
  }
  
  if (data.type === 'reading_complete') {
    console.log('Full interpretation:', data.interpretation);
  }
};
```

**Event Types:**
- `card_drawn`: Each card as it's revealed
- `position_explained`: Position meaning
- `card_interpreted`: Contextual interpretation
- `reading_complete`: Full synthesis ready

## GraphQL Schema

```graphql
type TarotCard {
  name: String!
  suit: String
  number: String
  arcanaType: ArcanaType!
  keywords: [String!]!
  uprightMeaning: String!
  reversedMeaning: String!
  element: String
  astrological: String
}

enum ArcanaType {
  MAJOR
  MINOR
}

type DrawnCard {
  card: TarotCard!
  position: Int!
  positionMeaning: String!
  reversed: Boolean!
  interpretation: String!
}

type SpreadLayout {
  name: String!
  description: String!
  cardCount: Int!
  positions: [Position!]!
}

type Position {
  position: Int!
  meaning: String!
}

type TarotReading {
  spreadLayout: SpreadLayout!
  drawnCards: [DrawnCard!]!
  questionAsked: String
  overallTheme: String!
  elementalBalance: JSON!
  archetypePatterns: [String!]!
  guidanceSummary: String!
}

type Query {
  # Get card by name
  card(name: String!): TarotCard
  
  # Get all cards
  allCards: [TarotCard!]!
  
  # Get cards by suit
  cardsBySuit(suit: String!): [TarotCard!]!
  
  # Get spread layout
  spread(type: String!): SpreadLayout
  
  # Get reading by ID
  reading(id: ID!): TarotReading
}

type Mutation {
  # Generate new reading
  drawReading(
    question: String
    spreadType: SpreadType = THREE_CARD
    includeReversed: Boolean = true
    focusArea: String
  ): TarotReading!
}

enum SpreadType {
  SINGLE_CARD
  THREE_CARD
  CELTIC_CROSS
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { TarotClient } from '@witnesos/tarot-sdk';

const client = new TarotClient({ apiKey: 'your-api-key' });

async function getReading() {
  const reading = await client.draw({
    question: "What should I know about my current path?",
    spreadType: "celtic_cross",
    includeReversed: true,
    focusArea: "career"
  });
  
  console.log(`Spread: ${reading.spreadLayout.name}`);
  
  for (const card of reading.drawnCards) {
    console.log(`Position ${card.position}: ${card.card.name} (${card.reversed ? 'R' : 'U'})`);
  }
  
  console.log(`\nGuidance: ${reading.guidanceSummary}`);
}
```

### Python

```python
from witnesos_sdk import TarotClient

client = TarotClient(api_key='your-api-key')

reading = client.draw(
    question="What should I know about my current path?",
    spread_type="celtic_cross",
    include_reversed=True,
    focus_area="career"
)

print(f"Spread: {reading.spread_layout.name}")

for card in reading.drawn_cards:
    status = "Reversed" if card.reversed else "Upright"
    print(f"Position {card.position}: {card.card.name} ({status})")

print(f"\nGuidance: {reading.guidance_summary}")
```

### REST API (cURL)

```bash
curl -X POST https://api.witnesos.com/v1/tarot/draw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "question": "What should I know about my current path?",
    "spread_type": "celtic_cross",
    "include_reversed": true,
    "focus_area": "career"
  }'
```

## Caching Strategy

### Reading Cache

Readings with identical question+timestamp are cached for reproducibility:

```python
cache_key = f"tarot:{md5(question)}:{timestamp.isoformat()}:{spread_type}"
cache_ttl = 86400  # 24 hours
```

### Card Data Cache

Static card data cached indefinitely:

```python
cache_key = f"tarot:card:{card_name}"
cache_ttl = None  # Never expire
```

### Spread Layout Cache

Spread definitions cached indefinitely:

```python
cache_key = f"tarot:spread:{spread_type}"
cache_ttl = None  # Never expire
```

---

*Last Updated: 2026*  
*Source: WitnessOS Tarot Sequence Decoder Engine*
