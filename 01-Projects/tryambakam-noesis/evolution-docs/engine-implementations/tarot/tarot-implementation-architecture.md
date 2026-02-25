# Tarot Implementation Architecture

## Data Model Overview

The Tarot engine uses a comprehensive data structure representing the full 78-card deck with multiple spread layouts.

## Core Data Structures

### TarotCard Model

Represents a single card from the tarot deck.

```python
class TarotCard(BaseModel):
    """Represents a single tarot card."""
    
    name: str                                # Full name (e.g., "The Fool", "Ace of Wands")
    suit: Optional[str]                      # Suit for minor arcana ("wands", "cups", "swords", "pentacles")
    number: Optional[str]                    # Card number or court position ("ace", "two", "page", "queen", etc.)
    arcana_type: Literal["major", "minor"]   # Major or Minor Arcana
    keywords: List[str]                      # Key themes and concepts
    upright_meaning: str                     # Upright interpretation
    reversed_meaning: str                    # Reversed interpretation
    element: Optional[str]                   # Associated element (Fire, Water, Air, Earth)
    astrological: Optional[str]              # Astrological association (zodiac sign or planet)
```

#### Card Organization

**Major Arcana (22 cards):**
- Numbered 0-21
- Represent major life themes and archetypes
- Examples: The Fool (0), The Magician (1), The World (21)

**Minor Arcana (56 cards):**
- Four suits of 14 cards each
- Represent everyday situations and experiences

| Suit | Element | Keywords | Count |
|------|---------|----------|-------|
| Wands | Fire | Creativity, passion, energy, career | 14 |
| Cups | Water | Emotions, relationships, spirituality, intuition | 14 |
| Swords | Air | Thoughts, communication, conflict, truth | 14 |
| Pentacles | Earth | Material, money, career, achievement | 14 |

**Each Suit Contains:**
- Ace through Ten (pip cards)
- Page, Knight, Queen, King (court cards)

### DrawnCard Model

Represents a card as drawn in a specific reading.

```python
class DrawnCard(BaseModel):
    """Represents a card drawn in a reading."""
    
    card: TarotCard          # The tarot card itself
    position: int            # Position number in the spread (1-based)
    position_meaning: str    # Meaning of this position in the spread
    reversed: bool           # Whether card is drawn reversed
    interpretation: str      # Contextual interpretation for this position and question
```

### SpreadLayout Model

Defines the structure of a tarot spread.

```python
class SpreadLayout(BaseModel):
    """Defines a tarot spread layout."""
    
    name: str                                # Name of spread
    description: str                         # Description of spread purpose
    positions: List[Dict[str, Any]]          # Position definitions
    card_count: int                          # Total number of cards in spread
```

**Position Dictionary Structure:**
```python
{
    "position": int,      # Position number (1-based)
    "meaning": str        # What this position represents
}
```

### TarotInput Model

User input for requesting a reading.

```python
class TarotInput(QuestionInput):
    """Input model for Tarot Sequence Decoder."""
    
    spread_type: Literal["single_card", "three_card", "celtic_cross"] = "three_card"
    deck_type: str = "rider_waite"           # Tarot deck to use
    include_reversed: bool = True            # Whether to include reversed cards
    focus_area: Optional[str] = None         # Specific life area (love, career, spiritual)
    
    # Inherited from QuestionInput:
    # question: Optional[str]                # The question being asked
    # user_id: Optional[str]                 # User identifier
```

### TarotOutput Model

Structured output from the engine.

```python
class TarotOutput(BaseEngineOutput):
    """Output model for Tarot Sequence Decoder."""
    
    # Base class provides:
    engine_name: str                         # "Tarot Sequence Decoder"
    calculation_time: float                  # Processing time in seconds
    confidence_score: float                  # Reading quality score (0-1)
    timestamp: datetime                      # When reading was generated
    
    raw_data: Dict[str, Any]                 # Complete reading data including:
                                             # - spread_layout: SpreadLayout
                                             # - drawn_cards: List[DrawnCard]
                                             # - question_asked: str
                                             # - deck_used: str
                                             # - overall_theme: str
                                             # - elemental_balance: Dict
                                             # - archetypal_patterns: List[str]
                                             # - energy_forecast: str
                                             # - action_steps: List[str]
                                             
    formatted_output: str                    # Human-readable interpretation
    recommendations: List[str]               # Key insights and guidance
    field_signature: str                     # "tarot_archetypal_guidance"
    archetypal_themes: List[str]             # Archetypal patterns identified
```

### TarotDeck Model

Complete data structure for a tarot deck.

```python
class TarotDeck(BaseModel):
    """Complete tarot deck definition loaded from JSON."""
    
    deck_info: Dict[str, Any]                # Metadata about the deck
    major_arcana: Dict[str, Dict[str, Any]]  # 22 Major Arcana cards (keys: "0" to "21")
    minor_arcana: Dict[str, Any]             # Minor Arcana structure with suits
    spreads: Dict[str, Dict[str, Any]]       # Available spread layouts
```

## Engine Architecture

### TarotSequenceDecoder Class

Main engine class implementing the BaseEngine interface.

```python
class TarotSequenceDecoder(BaseEngine):
    """
    Tarot Sequence Decoder Engine
    
    Performs tarot card readings using traditional spreads and provides
    mystical interpretation with archetypal analysis.
    """
    
    def __init__(self):
        super().__init__()
        self.deck_data: Optional[TarotDeck] = None
        self.divination_calc = DivinationCalculator()
        self._load_deck_data()
    
    @property
    def engine_name(self) -> str
    
    @property
    def description(self) -> str
    
    @property
    def input_model(self) -> Type[BaseEngineInput]
    
    @property
    def output_model(self) -> Type[BaseEngineOutput]
```

### Core Methods

#### Data Loading

```python
def _load_deck_data(self) -> None:
    """Load tarot deck data from JSON files."""
    deck_json = load_json_data("tarot", "rider_waite.json")
    self.deck_data = TarotDeck(**deck_json)
```

#### Deck Creation

```python
def _create_full_deck(self) -> List[TarotCard]:
    """
    Create a complete 78-card deck.
    
    Constructs:
    - 22 Major Arcana cards (numbered 0-21)
    - 56 Minor Arcana cards (4 suits × 14 cards)
    
    Returns:
        List of all 78 TarotCard objects
    """
```

**Major Arcana Construction:**
```python
for number, card_data in self.deck_data.major_arcana.items():
    card = TarotCard(
        name=card_data["name"],
        arcana_type="major",
        number=number,
        keywords=card_data.get("keywords", []),
        upright_meaning=card_data["upright"],
        reversed_meaning=card_data["reversed"],
        element=card_data.get("element"),
        astrological=card_data.get("astrological")
    )
    cards.append(card)
```

**Minor Arcana Construction:**
```python
for suit_name, suit_data in self.deck_data.minor_arcana["suits"].items():
    for card_name, card_data in suit_data["cards"].items():
        card = TarotCard(
            name=card_data["name"],
            suit=suit_name,
            number=card_name,
            arcana_type="minor",
            keywords=suit_data.get("keywords", []),
            upright_meaning=card_data["upright"],
            reversed_meaning=card_data["reversed"],
            element=suit_data.get("element")
        )
        cards.append(card)
```

#### Spread Management

```python
def _get_spread_layout(self, spread_type: str) -> SpreadLayout:
    """
    Get the layout configuration for a specific spread type.
    
    Args:
        spread_type: "single_card", "three_card", or "celtic_cross"
    
    Returns:
        SpreadLayout object with positions and meanings
    """
```

#### Card Drawing

```python
def _draw_cards(self, deck: List[TarotCard], count: int, question: str) -> List[TarotCard]:
    """
    Draw cards from the deck using divination calculator.
    
    Uses question-based seeding if question provided, otherwise pure random.
    Ensures no duplicate cards in a single reading.
    """
```

#### Reversal Determination

```python
def _determine_reversal(self, include_reversed: bool) -> bool:
    """
    Determine if a card should be reversed.
    
    30% probability provides mystical balance:
    - Most cards upright (primary energy available)
    - Some reversed (challenges, blocks, shadows)
    """
```

#### Interpretation

```python
def _interpret_card_in_position(
    self, 
    card: TarotCard, 
    position_meaning: str,
    reversed: bool, 
    question: str
) -> str:
    """
    Interpret a card in its specific position context.
    
    Combines:
    - Card meaning (upright or reversed)
    - Position meaning
    - Question context
    
    Returns contextual interpretation string.
    """
```

#### Pattern Analysis

```python
def _analyze_elemental_balance(self, cards: List[DrawnCard]) -> Dict[str, int]:
    """
    Analyze the elemental balance in the reading.
    
    Counts occurrences of each element:
    - Fire: Wands suit, fire-associated majors
    - Water: Cups suit, water-associated majors
    - Air: Swords suit, air-associated majors
    - Earth: Pentacles suit, earth-associated majors
    """

def _identify_archetypal_patterns(self, cards: List[DrawnCard]) -> List[str]:
    """
    Identify archetypal patterns in card selection.
    
    Detects:
    - Major vs minor arcana ratio
    - Multiple court cards
    - Multiple aces
    - Suit concentrations
    - Number patterns
    """
```

#### Theme Generation

```python
def _generate_overall_theme(self, cards: List[DrawnCard], question: str) -> str:
    """
    Generate overall theme for the reading.
    
    Analyzes cards for:
    - Transformation cards (Death, Tower, Wheel of Fortune)
    - Relationship cards (Lovers, Two of Cups, Three of Cups)
    - Spiritual cards (High Priestess, Hermit, Star)
    - Other thematic patterns
    
    Synthesizes into coherent narrative.
    """
```

#### Main Calculation

```python
def _calculate(self, validated_input: TarotInput) -> Dict[str, Any]:
    """
    Process the tarot reading calculation.
    
    Flow:
    1. Create full 78-card deck
    2. Get spread layout for chosen spread type
    3. Draw required number of cards (question-seeded or random)
    4. For each card:
        a. Determine if reversed
        b. Get position meaning
        c. Generate contextual interpretation
        d. Create DrawnCard object
    5. Analyze elemental balance
    6. Identify archetypal patterns
    7. Generate overall theme
    8. Create guidance and insights
    9. Calculate archetypal resonance
    10. Return complete reading data
    """
```

#### Output Formatting

```python
def _interpret(self, calculation_results: Dict[str, Any], input_data: TarotInput) -> str:
    """
    Format calculation results into human-readable text.
    
    Creates structured output with:
    - Emoji indicators
    - Card listings with positions
    - Individual interpretations
    - Overall theme
    - Key insights
    - Meditation focus
    - Synchronicity notes
    """
```

## Data Storage Structure

### JSON File Format

```json
{
  "deck_info": {
    "name": "Rider-Waite Tarot",
    "description": "The classic Rider-Waite-Smith tarot deck",
    "total_cards": 78,
    "major_arcana": 22,
    "minor_arcana": 56
  },
  "major_arcana": {
    "0": {
      "name": "The Fool",
      "keywords": ["new beginnings", "innocence", "spontaneity"],
      "upright": "New beginnings, innocence, spontaneity...",
      "reversed": "Recklessness, taken advantage of...",
      "element": "Air",
      "astrological": "Uranus"
    },
    ...
  },
  "minor_arcana": {
    "suits": {
      "wands": {
        "element": "Fire",
        "keywords": ["creativity", "passion", "energy"],
        "cards": {
          "ace": {
            "name": "Ace of Wands",
            "upright": "Inspiration, new opportunities...",
            "reversed": "An emerging idea, lack of direction..."
          },
          ...
        }
      },
      ...
    }
  },
  "spreads": {
    "single_card": {
      "name": "Single Card Draw",
      "positions": [
        {"position": 1, "meaning": "Guidance for your question"}
      ]
    },
    "three_card": {
      "name": "Past, Present, Future",
      "positions": [
        {"position": 1, "meaning": "Past influences"},
        {"position": 2, "meaning": "Present situation"},
        {"position": 3, "meaning": "Future outcome"}
      ]
    },
    "celtic_cross": {
      "name": "Celtic Cross",
      "positions": [
        {"position": 1, "meaning": "Present situation"},
        {"position": 2, "meaning": "Challenge or cross"},
        ...
      ]
    }
  }
}
```

## Calculation Pipeline

```
User Input
    ↓
[TarotInput validation]
    ↓
[Select spread type: single/three/celtic_cross]
    ↓
[Create 78-card deck] → [22 Major Arcana] + [56 Minor Arcana]
    ↓
[Get spread layout] → [Position meanings]
    ↓
[Shuffle deck] ←→ [Question seeding (optional)]
    ↓
[Draw N cards] (N = spread card count)
    ↓
[For each drawn card:]
    ├─[Determine reversal (30% chance)]
    ├─[Get position meaning]
    └─[Generate contextual interpretation]
    ↓
[Create DrawnCard objects]
    ↓
[Analyze patterns:]
    ├─[Elemental balance]
    ├─[Major/Minor ratio]
    ├─[Court cards]
    ├─[Aces]
    └─[Thematic patterns]
    ↓
[Generate overall theme]
    ↓
[Create guidance and insights]
    ↓
[Calculate archetypal resonance]
    ↓
[Format output]
    ↓
TarotOutput
```

## Integration Points

### DivinationCalculator

Shared calculation module providing:
- Seeded randomization
- Question-based seed generation
- Deck shuffling algorithms
- Card drawing without replacement
- Archetypal resonance calculation

```python
from shared.calculations.divination import DivinationCalculator

divination_calc = DivinationCalculator(seed=optional_seed)
shuffled_deck = divination_calc.shuffle_deck(deck, question)
drawn_cards = divination_calc.draw_cards(deck, count, question)
```

### BaseEngine Interface

All WitnessOS engines inherit from BaseEngine:

```python
from shared.base.engine_interface import BaseEngine
from shared.base.data_models import BaseEngineInput, BaseEngineOutput

class TarotSequenceDecoder(BaseEngine):
    # Must implement:
    # - engine_name property
    # - description property
    # - input_model property
    # - output_model property
    # - _calculate() method
    # - _interpret() method
```

## Card Correspondences

### Elemental Associations

**Major Arcana Elements:**

| Card | Element | Association |
|------|---------|-------------|
| The Fool | Air | Freedom, intellect |
| The Magician | Air | Communication, skill |
| The High Priestess | Water | Intuition, subconscious |
| The Empress | Earth | Fertility, nature |
| The Emperor | Fire | Authority, structure |
| The Hierophant | Earth | Tradition, teaching |
| The Lovers | Air | Choices, union |
| The Chariot | Water | Emotions, determination |
| Strength | Fire | Courage, power |
| The Hermit | Earth | Introspection, wisdom |
| Wheel of Fortune | Fire | Cycles, destiny |
| Justice | Air | Balance, law |
| The Hanged Man | Water | Surrender, perspective |
| Death | Water | Transformation, endings |
| Temperance | Fire | Balance, moderation |
| The Devil | Earth | Materialism, bondage |
| The Tower | Fire | Upheaval, revelation |
| The Star | Air | Hope, inspiration |
| The Moon | Water | Illusion, intuition |
| The Sun | Fire | Joy, success |
| Judgement | Fire | Rebirth, calling |
| The World | Earth | Completion, wholeness |

**Minor Arcana Elements:**

| Suit | Element | Qualities |
|------|---------|-----------|
| Wands | Fire | Active, creative, initiating |
| Cups | Water | Emotional, intuitive, receptive |
| Swords | Air | Mental, analytical, communicative |
| Pentacles | Earth | Material, practical, grounding |

### Astrological Correspondences

**Major Arcana Astrology:**

| Card | Astrological Sign/Planet |
|------|--------------------------|
| The Fool | Uranus (change, rebellion) |
| The Magician | Mercury (communication) |
| The High Priestess | Moon (intuition) |
| The Empress | Venus (love, beauty) |
| The Emperor | Aries (leadership) |
| The Hierophant | Taurus (tradition) |
| The Lovers | Gemini (duality) |
| The Chariot | Cancer (emotion) |
| Strength | Leo (courage) |
| The Hermit | Virgo (analysis) |
| Wheel of Fortune | Jupiter (expansion) |
| Justice | Libra (balance) |
| The Hanged Man | Neptune (illusion) |
| Death | Scorpio (transformation) |
| Temperance | Sagittarius (philosophy) |
| The Devil | Capricorn (materialism) |
| The Tower | Mars (conflict) |
| The Star | Aquarius (innovation) |
| The Moon | Pisces (dreams) |
| The Sun | Sun (vitality) |
| Judgement | Pluto (rebirth) |
| The World | Saturn (completion) |

### Numerical Patterns

**Number Meanings in Minor Arcana:**

| Number | Keyword | Theme |
|--------|---------|-------|
| Ace | Beginning | New opportunities, raw potential |
| Two | Balance | Duality, partnership, choice |
| Three | Growth | Expansion, creativity, groups |
| Four | Stability | Foundation, structure, security |
| Five | Conflict | Challenge, change, instability |
| Six | Harmony | Balance, cooperation, healing |
| Seven | Reflection | Assessment, introspection, challenge |
| Eight | Movement | Action, change, progress |
| Nine | Completion | Fulfillment, attainment, near-end |
| Ten | Culmination | End of cycle, maximum expression |

**Court Card Hierarchy:**

| Court | Level | Energy |
|-------|-------|--------|
| Page | Student | Learning, messages, curiosity |
| Knight | Warrior | Action, movement, quests |
| Queen | Master | Nurturing, mastery, inner power |
| King | Ruler | Authority, mastery, outer power |

## Error Handling

### Fallback Mechanisms

```python
# Invalid spread type handling
valid_spreads = ["single_card", "three_card", "celtic_cross"]
if spread_type not in valid_spreads:
    spread_type = "three_card"  # Default to three-card

# Missing card data
if card_name not in deck_data.major_arcana:
    # Use fallback card or log error
    logger.warning(f"Card {card_name} not found, using The Fool as fallback")
```

### Data Validation

Using Pydantic models ensures:
- Type safety
- Required field validation
- Enum constraint enforcement
- Automatic documentation
- JSON serialization

## Performance Considerations

- **Data Loading**: JSON parsed once at initialization, cached in memory
- **Deck Creation**: 78 cards constructed once per reading session
- **Shuffling**: Fisher-Yates O(n) algorithm, very efficient
- **Drawing**: O(1) list slicing for draws
- **Total Calculation**: < 20ms typical execution time for any spread

---

*Last Updated: 2026*  
*Source: WitnessOS Tarot Sequence Decoder Engine*
