# Tarot Core Architecture

**Component:** TarotSequenceDecoder Engine  
**Purpose:** System design, data flow, and processing pipeline

---

## System Overview

The Tarot Sequence Decoder is a divination engine that performs card readings using the 78-card Rider-Waite Tarot system. It combines traditional mystical interpretation with modern consciousness development principles.

### Core Philosophy

- **Divination as Self-Observation:** Readings mirror current consciousness state
- **Synchronicity as Signal:** Meaningful coincidence validates self-organizing awareness
- **Symbol as Portal:** Archetypal imagery provides access to unconscious patterns
- **Position as Context:** Location in spread shapes interpretation
- **Reversal as Shadow:** Blocked/internalized expression invites integration

---

## Class Structure

### TarotSequenceDecoder

Primary engine class inheriting from `BaseEngine`.

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
```

**Attributes:**
- `deck_data` - Complete TarotDeck object loaded from JSON
- `divination_calc` - DivinationCalculator instance for authentic randomness
- `logger` - Inherited logging system

**Properties:**
- `engine_name` → "Tarot Sequence Decoder"
- `description` → Engine description string
- `input_model` → TarotInput class
- `output_model` → TarotOutput class

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INPUT                               │
│  question, spread_type, include_reversed, focus_area            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VALIDATE INPUT                               │
│  TarotInput model with Pydantic validation                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                 INITIALIZE COMPONENTS                            │
│  ├─ Load deck data (if not loaded)                              │
│  ├─ Create full 78-card deck                                    │
│  └─ Get spread layout (positions + meanings)                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DRAW CARDS                                   │
│  DivinationCalculator.draw_cards(deck, count, question)         │
│  • Uses question as randomness seed                             │
│  • Ensures no duplicates                                        │
│  • Returns List[TarotCard]                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              PROCESS EACH DRAWN CARD                             │
│  For each card:                                                  │
│    ├─ Determine reversal (30% if enabled)                       │
│    ├─ Get position meaning from spread                          │
│    ├─ Generate contextual interpretation                        │
│    └─ Create DrawnCard object                                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYZE READING                               │
│  ├─ Elemental balance (count Fire/Water/Air/Earth)              │
│  ├─ Archetypal patterns (Major/Minor ratio, courts, aces)       │
│  ├─ Overall theme (transformation, relationship, spiritual)     │
│  └─ Key insights (top 3 most significant)                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  GENERATE GUIDANCE                               │
│  ├─ Guidance summary (action-oriented)                          │
│  ├─ Action steps (3-5 concrete steps)                           │
│  ├─ Meditation focus (contemplation prompt)                     │
│  └─ Synchronicity notes (what to watch for)                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              CALCULATE FIELD RESONANCE                           │
│  DivinationCalculator.calculate_archetypal_resonance()          │
│  • Uses card names and context                                  │
│  • Returns 0.0-1.0 resonance score                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FORMAT OUTPUT                                 │
│  ├─ Create formatted reading with emojis                        │
│  ├─ Structure card-by-card breakdown                            │
│  ├─ Include all analysis sections                               │
│  └─ Return TarotOutput model                                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RETURN TO USER                                 │
│  Complete reading with insights and guidance                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Engine Initialization

### Loading Deck Data

```python
def _load_deck_data(self) -> None:
    """Load tarot deck data from JSON files."""
    try:
        deck_json = load_json_data("tarot", "rider_waite.json")
        self.deck_data = TarotDeck(**deck_json)
        self.logger.info("Loaded Rider-Waite tarot deck data")
    except Exception as e:
        self.logger.error(f"Failed to load tarot deck data: {e}")
        raise
```

**Process:**
1. Call `load_json_data` utility with folder and filename
2. Parse JSON into TarotDeck Pydantic model
3. Store in `self.deck_data`
4. Log success or raise exception

**JSON Structure:**
- `deck_info` - Metadata (name, description, card counts)
- `major_arcana` - Dict of 22 Major Arcana cards (keyed by number)
- `minor_arcana` - Dict containing suits with 14 cards each
- `spreads` - Dict of spread definitions

---

## Deck Creation

### Building the 78-Card Deck

```python
def _create_full_deck(self) -> List[TarotCard]:
    """Create a complete deck of TarotCard objects."""
    cards = []
    
    # Add Major Arcana (22 cards)
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
    
    # Add Minor Arcana (56 cards)
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
    
    return cards  # 78 cards total
```

**Major Arcana Loop:**
- Iterate through numbered keys (0-21)
- Extract card data from JSON
- Create TarotCard object with all attributes
- Add to cards list

**Minor Arcana Loop:**
- Iterate through 4 suits (wands, cups, swords, pentacles)
- For each suit, iterate through 14 cards (ace-ten, page-king)
- Extract card and suit data
- Create TarotCard object
- Add to cards list

---

## Spread Layout System

### Retrieving Spread Configuration

```python
def _get_spread_layout(self, spread_type: str) -> SpreadLayout:
    """Get the layout for a specific spread type."""
    spread_data = self.deck_data.spreads[spread_type]
    
    return SpreadLayout(
        name=spread_data["name"],
        description=spread_data.get("description", ""),
        positions=spread_data["positions"],
        card_count=len(spread_data["positions"])
    )
```

**Supported Spreads:**
- `single_card` - 1 position
- `three_card` - 3 positions (Past, Present, Future)
- `celtic_cross` - 10 positions (comprehensive reading)

**SpreadLayout Structure:**
```python
{
    "name": "Celtic Cross",
    "description": "Comprehensive 10-card spread",
    "positions": [
        {"position": 1, "meaning": "Present situation"},
        {"position": 2, "meaning": "Challenge or cross"},
        # ... 8 more positions
    ],
    "card_count": 10
}
```

---

## Card Drawing System

### Using DivinationCalculator

```python
def _draw_cards(self, deck: List[TarotCard], count: int, question: str) -> List[TarotCard]:
    """Draw cards from the deck using divination calculator."""
    return self.divination_calc.draw_cards(deck, count, question)
```

**DivinationCalculator Responsibilities:**
- Accept full deck, card count, and question
- Use question as seed for meaningful randomness
- Select cards without replacement (no duplicates)
- Return list of drawn TarotCard objects

**Synchronicity Principle:**
The question serves as a seed, creating a resonance field that "attracts" relevant cards. This isn't just pseudorandomness—it's modeling consciousness participation in reality selection.

---

## Reversal Determination

### 30% Probability Logic

```python
def _determine_reversal(self, include_reversed: bool) -> bool:
    """Determine if a card should be reversed."""
    if not include_reversed:
        return False

    # 30% chance of reversal for mystical balance
    return self.divination_calc.random.random_float() < 0.3
```

**Design Rationale:**
- **30% = Balanced Presence**
  - Not too rare (would lose significance)
  - Not too common (would dilute meaning)
  - Mirrors natural resistance in consciousness flow
  
**Reversal Meaning:**
- NOT simply opposite of upright
- Represents blocked, internalized, or shadow expression
- Indicates timing (not yet, already passed, resistance)
- Invites inner work before outer manifestation

---

## Interpretation Pipeline

### Contextual Card Reading

```python
def _interpret_card_in_position(self, card: TarotCard, position_meaning: str, 
                               reversed: bool, question: str) -> str:
    """Interpret a card in its specific position context."""
    base_meaning = card.reversed_meaning if reversed else card.upright_meaning
    
    # Create contextual interpretation
    interpretation = f"In the position of '{position_meaning}', "
    
    if reversed:
        interpretation += f"the reversed {card.name} suggests: {base_meaning}. "
    else:
        interpretation += f"{card.name} indicates: {base_meaning}. "
    
    # Add mystical connection to the question
    if question and len(question.strip()) > 0:
        interpretation += f"This relates to your question about {question.lower()} "
        interpretation += "by highlighting the need for deeper reflection on this aspect."
    
    return interpretation
```

**Interpretation Layers:**
1. **Base Meaning** - Card's inherent upright/reversed meaning
2. **Position Context** - How position shapes interpretation
3. **Question Relevance** - Connection to user's inquiry

**Example Output:**
```
"In the position of 'Present situation', The Lovers indicates: Love, harmony, 
relationships, values alignment, choices. This relates to your question about 
career transitions by highlighting the need for deeper reflection on this aspect."
```

---

## Analysis Systems

### 1. Elemental Balance Analysis

```python
def _analyze_elemental_balance(self, cards: List[DrawnCard]) -> Dict[str, int]:
    """Analyze the elemental balance in the reading."""
    elements = {"Fire": 0, "Water": 0, "Air": 0, "Earth": 0}
    
    for drawn_card in cards:
        element = drawn_card.card.element
        if element and element in elements:
            elements[element] += 1
    
    return elements
```

**Purpose:** Identify which life domains are emphasized or lacking

**Interpretation:**
- **Fire dominant** - Action, passion, creativity phase
- **Water dominant** - Emotional, relational, intuitive focus
- **Air dominant** - Mental, communicative, decision-making period
- **Earth dominant** - Material, practical, grounded concerns
- **Missing element** - Life area needing attention

### 2. Archetypal Pattern Detection

```python
def _identify_archetypal_patterns(self, cards: List[DrawnCard]) -> List[str]:
    """Identify archetypal patterns in the card selection."""
    patterns = []
    
    # Count major vs minor arcana
    major_count = sum(1 for c in cards if c.card.arcana_type == "major")
    minor_count = len(cards) - major_count
    
    if major_count > minor_count:
        patterns.append("Strong spiritual/archetypal influence - major life themes at play")
    elif minor_count > major_count:
        patterns.append("Practical/everyday focus - attention to daily life matters")
    
    # Check for court cards
    court_cards = [c for c in cards if c.card.number in ["page", "knight", "queen", "king"]]
    if len(court_cards) >= 2:
        patterns.append("Multiple court cards suggest people or personality aspects are significant")
    
    # Check for aces
    aces = [c for c in cards if c.card.number == "ace"]
    if len(aces) >= 2:
        patterns.append("Multiple aces indicate new beginnings and fresh energy")
    
    return patterns
```

**Patterns Detected:**
- Major vs Minor ratio (spiritual vs practical)
- Court card presence (people/personality aspects)
- Multiple aces (new beginnings)
- Transformation cards (Death, Tower, Wheel)
- Relationship cards (Lovers, 2 of Cups, etc.)
- Spiritual cards (High Priestess, Hermit, Star)

### 3. Overall Theme Generation

```python
def _generate_overall_theme(self, cards: List[DrawnCard], question: str) -> str:
    """Generate an overall theme for the reading."""
    themes = []
    
    # Check for transformation cards
    transformation_cards = ["Death", "The Tower", "The Wheel of Fortune"]
    if any(card.card.name in transformation_cards for card in cards):
        themes.append("transformation and change")
    
    # Check for relationship cards
    relationship_cards = ["The Lovers", "Two of Cups", "Three of Cups"]
    if any(card.card.name in relationship_cards for card in cards):
        themes.append("relationships and connections")
    
    # Check for spiritual cards
    spiritual_cards = ["The High Priestess", "The Hermit", "The Star"]
    if any(card.card.name in spiritual_cards for card in cards):
        themes.append("spiritual growth and intuition")
    
    if themes:
        theme = f"This reading centers around {', '.join(themes)}. "
    else:
        theme = "This reading reveals a complex interplay of energies. "
    
    theme += f"The cards suggest that your question about {question} "
    theme += "is calling for both practical action and spiritual awareness."
    
    return theme
```

**Theme Categories:**
- Transformation and change
- Relationships and connections
- Spiritual growth and intuition
- Material security and practical matters

---

## Main Calculation Pipeline

```python
def _calculate(self, validated_input: TarotInput) -> Dict[str, Any]:
    """Process the tarot reading calculation."""
    
    # 1. Create full deck
    full_deck = self._create_full_deck()
    
    # 2. Get spread layout
    spread_layout = self._get_spread_layout(validated_input.spread_type)
    
    # 3. Draw cards
    drawn_cards_raw = self._draw_cards(
        full_deck, 
        spread_layout.card_count, 
        validated_input.question or ""
    )
    
    # 4. Create drawn cards with positions and interpretations
    drawn_cards = []
    for i, card in enumerate(drawn_cards_raw):
        position_info = spread_layout.positions[i]
        reversed = self._determine_reversal(validated_input.include_reversed)

        interpretation = self._interpret_card_in_position(
            card,
            position_info["meaning"],
            reversed,
            validated_input.question or ""
        )

        drawn_card = DrawnCard(
            card=card,
            position=position_info["position"],
            position_meaning=position_info["meaning"],
            reversed=reversed,
            interpretation=interpretation
        )
        drawn_cards.append(drawn_card)
    
    # 5. Analyze the reading
    elemental_balance = self._analyze_elemental_balance(drawn_cards)
    archetypal_patterns = self._identify_archetypal_patterns(drawn_cards)
    overall_theme = self._generate_overall_theme(drawn_cards, validated_input.question or "")
    
    # 6. Generate guidance and insights
    key_insights = [
        f"The {card.card.name} in position {card.position} emphasizes {card.position_meaning.lower()}"
        for card in drawn_cards[:3]  # Top 3 insights
    ]
    
    guidance_summary = f"The cards guide you to focus on {overall_theme.lower()} "
    guidance_summary += "Trust your intuition and take aligned action."
    
    # 7. Create field resonance
    card_names = [card.card.name for card in drawn_cards]
    field_resonance = self.divination_calc.calculate_archetypal_resonance(
        card_names,
        {"question": validated_input.question}
    )

    # 8. Return complete data
    return {
        "spread_layout": spread_layout,
        "drawn_cards": drawn_cards,
        "question_asked": validated_input.question or "General guidance",
        "reading_timestamp": datetime.now(),
        "deck_used": validated_input.deck_type,
        "overall_theme": overall_theme,
        "key_insights": key_insights,
        "guidance_summary": guidance_summary,
        "elemental_balance": elemental_balance,
        "archetypal_patterns": archetypal_patterns,
        "energy_forecast": "The energy suggests a time of reflection and conscious choice-making.",
        "timing_indicators": ["Present moment awareness", "Seasonal transitions"],
        "action_steps": [
            "Meditate on the card imagery",
            "Journal about the insights received",
            "Take one small aligned action today"
        ],
        "meditation_focus": "Focus on the central card's imagery and let insights arise naturally.",
        "synchronicity_notes": "Notice how these themes appear in your daily life over the next week.",
        "field_resonance": field_resonance,
        "field_signature": "tarot_archetypal_guidance"
    }
```

---

## Output Formatting

```python
def _interpret(self, calculation_results: Dict[str, Any], input_data: TarotInput) -> str:
    """Interpret calculation results into human-readable format."""

    drawn_cards = calculation_results["drawn_cards"]
    overall_theme = calculation_results["overall_theme"]
    guidance_summary = calculation_results["guidance_summary"]

    interpretation = f"🎴 Tarot Reading for: {calculation_results['question_asked']}\n\n"
    interpretation += f"📋 Spread: {calculation_results['spread_layout'].name} ({input_data.spread_type})\n"
    interpretation += f"🕐 Reading Time: {calculation_results['reading_timestamp'].strftime('%Y-%m-%d %H:%M')}\n\n"

    interpretation += "🃏 Cards Drawn:\n"
    for card in drawn_cards:
        status = "Reversed" if card.reversed else "Upright"
        interpretation += f"   Position {card.position}: {card.card.name} ({status})\n"
        interpretation += f"   📍 {card.position_meaning}\n"
        interpretation += f"   💭 {card.interpretation}\n\n"

    interpretation += f"🌟 Overall Theme: {overall_theme}\n\n"
    interpretation += f"🎯 Guidance: {guidance_summary}\n\n"

    if calculation_results["key_insights"]:
        interpretation += "🔑 Key Insights:\n"
        for insight in calculation_results["key_insights"]:
            interpretation += f"   • {insight}\n"
        interpretation += "\n"

    interpretation += f"🧘 Meditation Focus: {calculation_results['meditation_focus']}\n"
    interpretation += f"✨ Synchronicity Notes: {calculation_results['synchronicity_notes']}\n"

    return interpretation
```

**Visual Hierarchy:**
- 🎴 Reading header
- 📋 Spread information
- 🕐 Timestamp
- 🃏 Card-by-card breakdown
- 🌟 Overall theme
- 🎯 Guidance summary
- 🔑 Key insights
- 🧘 Meditation focus
- ✨ Synchronicity notes

---

## Error Handling

### Deck Loading Errors

```python
try:
    deck_json = load_json_data("tarot", "rider_waite.json")
    self.deck_data = TarotDeck(**deck_json)
    self.logger.info("Loaded Rider-Waite tarot deck data")
except Exception as e:
    self.logger.error(f"Failed to load tarot deck data: {e}")
    raise
```

**Potential Issues:**
- File not found
- Invalid JSON structure
- Pydantic validation failure
- Missing required fields

### Input Validation Errors

Handled by Pydantic in TarotInput model:
- Invalid spread_type
- Invalid deck_type
- Type mismatches

### Runtime Errors

- Empty deck (shouldn't occur)
- Invalid spread key
- Missing card data

---

## Dependencies

### Required Imports

```python
from datetime import datetime
from typing import Dict, List, Any, Type, Optional

from shared.base.engine_interface import BaseEngine
from shared.base.data_models import BaseEngineInput, BaseEngineOutput
from shared.base.utils import load_json_data
from shared.calculations.divination import DivinationCalculator
from .tarot_models import (
    TarotInput, TarotOutput, TarotCard, DrawnCard, SpreadLayout, TarotDeck
)
```

### External Dependencies

- **BaseEngine** - Engine interface contract
- **Data models** - Base input/output structures
- **load_json_data** - JSON file loader utility
- **DivinationCalculator** - Authentic randomness and resonance
- **Pydantic** - Data validation and modeling
- **datetime** - Timestamp generation

---

## Performance Considerations

### Deck Loading
- Loaded once during `__init__`
- Cached in `self.deck_data`
- Reused for all readings

### Card Drawing
- O(n) complexity for n cards
- No duplicates checking via divination calc
- Question hashing for seed generation

### Interpretation Generation
- Linear processing of drawn cards
- String concatenation (relatively fast)
- Pattern detection O(n) where n = cards drawn

**Typical Timing:**
- Single card: <50ms
- Three card: <100ms
- Celtic Cross (10 cards): <200ms

---

## Extension Points

### Adding New Spreads

```python
# In rider_waite.json:
"spreads": {
    "tree_of_life": {
        "name": "Tree of Life",
        "description": "10-card Kabbalistic spread",
        "positions": [
            {"position": 1, "meaning": "Keter - Crown"},
            {"position": 2, "meaning": "Chokmah - Wisdom"},
            # ... 8 more positions
        ]
    }
}
```

### Adding New Decks

1. Create `thoth.json` in data/tarot/
2. Follow same structure as rider_waite.json
3. Update TarotInput validation to include new deck
4. Update deck loading logic if needed

### Enhancing Interpretation

Current: Template-based interpretation  
Future: AI-enhanced contextual reading using GPT-4

```python
def _interpret_card_with_ai(self, card, position, reversed, question, context):
    """Use LLM for deeper, more nuanced interpretation."""
    prompt = f"Interpret {card.name} ({'reversed' if reversed else 'upright'}) 
                in position '{position}' for question: {question}"
    return call_llm(prompt, context)
```

---

## Testing Strategy

### Unit Tests

```python
def test_deck_creation():
    engine = TarotSequenceDecoder()
    deck = engine._create_full_deck()
    assert len(deck) == 78
    assert sum(1 for c in deck if c.arcana_type == "major") == 22
    assert sum(1 for c in deck if c.arcana_type == "minor") == 56

def test_spread_layouts():
    engine = TarotSequenceDecoder()
    single = engine._get_spread_layout("single_card")
    assert single.card_count == 1
    celtic = engine._get_spread_layout("celtic_cross")
    assert celtic.card_count == 10

def test_reversal_probability():
    engine = TarotSequenceDecoder()
    reversals = [engine._determine_reversal(True) for _ in range(1000)]
    rate = sum(reversals) / len(reversals)
    assert 0.25 < rate < 0.35

def test_no_duplicate_cards():
    engine = TarotSequenceDecoder()
    deck = engine._create_full_deck()
    drawn = engine._draw_cards(deck, 10, "test")
    names = [c.name for c in drawn]
    assert len(names) == len(set(names))
```

### Integration Tests

```python
def test_full_reading_pipeline():
    engine = TarotSequenceDecoder()
    input_data = TarotInput(
        question="What do I need to know?",
        spread_type="three_card",
        include_reversed=True
    )
    output = engine.process(input_data)
    assert output.engine_name == "Tarot Sequence Decoder"
    assert len(output.raw_data["drawn_cards"]) == 3
    assert "overall_theme" in output.raw_data
```

---

*This architecture document provides complete system design for implementing the Tarot Sequence Decoder Engine with full fidelity to WitnessOS original.*
