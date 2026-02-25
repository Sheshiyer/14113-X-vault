# Tarot Engine - Quick Reference Guide

**For Developers:** Fast lookup of core algorithms, formulas, and implementation patterns

---

## Core Processing Pipeline

```python
def perform_reading(question: str, spread_type: str, include_reversed: bool = True):
    """Complete tarot reading pipeline."""
    
    # 1. Initialize
    deck = create_full_deck()  # 78 cards
    spread = get_spread_layout(spread_type)
    
    # 2. Draw cards
    drawn_cards = draw_cards(deck, spread.card_count, question)
    
    # 3. Process each card
    reading_cards = []
    for i, card in enumerate(drawn_cards):
        position_info = spread.positions[i]
        reversed = determine_reversal(include_reversed)
        interpretation = interpret_card(card, position_info, reversed, question)
        
        reading_cards.append({
            'card': card,
            'position': position_info['position'],
            'position_meaning': position_info['meaning'],
            'reversed': reversed,
            'interpretation': interpretation
        })
    
    # 4. Analyze
    elemental_balance = analyze_elements(reading_cards)
    patterns = identify_patterns(reading_cards)
    theme = generate_theme(reading_cards, question)
    insights = extract_insights(reading_cards)
    
    # 5. Generate guidance
    guidance = create_guidance(theme, patterns)
    actions = suggest_actions(reading_cards)
    meditation = create_meditation_focus(reading_cards)
    
    # 6. Return complete reading
    return {
        'cards': reading_cards,
        'theme': theme,
        'insights': insights,
        'guidance': guidance,
        'elemental_balance': elemental_balance,
        'patterns': patterns,
        'action_steps': actions,
        'meditation_focus': meditation
    }
```

---

## Card Drawing Algorithm

```python
def draw_cards(deck: List[Card], count: int, question: str) -> List[Card]:
    """
    Draw cards using divination calculator for authentic randomness.
    
    Uses question as seed for meaningful synchronicity.
    Ensures no duplicates (cards drawn are removed from deck).
    """
    divination_calc = DivinationCalculator()
    return divination_calc.draw_cards(deck, count, question)
```

### Reversal Determination

```python
def determine_reversal(include_reversed: bool) -> bool:
    """
    30% probability of reversal for mystical balance.
    
    Not too common (loses impact)
    Not too rare (shadow work needs presence)
    """
    if not include_reversed:
        return False
    
    return random() < 0.30  # 30% chance
```

---

## Card Structure

### Major Arcana Card

```python
{
    "name": "The Fool",
    "arcana_type": "major",
    "number": 0,
    "keywords": ["new beginnings", "innocence", "spontaneity", "free spirit"],
    "upright_meaning": "New beginnings, innocence, spontaneity, free spirit, adventure",
    "reversed_meaning": "Recklessness, taken advantage of, inconsideration, foolishness",
    "element": "Air",
    "astrological": "Uranus"
}
```

### Minor Arcana Card

```python
{
    "name": "Three of Cups",
    "arcana_type": "minor",
    "suit": "cups",
    "number": "three",
    "keywords": ["celebration", "friendship", "creativity", "collaborations"],
    "upright_meaning": "Celebration, friendship, creativity, collaborations, community",
    "reversed_meaning": "Independence, alone time, hardcore partying, 'three's a crowd'",
    "element": "Water"  # From suit
}
```

---

## Spread Definitions

### Single Card

```python
{
    "name": "Single Card Draw",
    "positions": [
        {"position": 1, "meaning": "Guidance for your question"}
    ]
}
```

### Three Card (Past-Present-Future)

```python
{
    "name": "Past, Present, Future",
    "positions": [
        {"position": 1, "meaning": "Past influences"},
        {"position": 2, "meaning": "Present situation"},
        {"position": 3, "meaning": "Future outcome"}
    ]
}
```

### Celtic Cross (10 cards)

```python
{
    "name": "Celtic Cross",
    "positions": [
        {"position": 1, "meaning": "Present situation"},
        {"position": 2, "meaning": "Challenge or cross"},
        {"position": 3, "meaning": "Distant past/foundation"},
        {"position": 4, "meaning": "Recent past"},
        {"position": 5, "meaning": "Possible outcome"},
        {"position": 6, "meaning": "Immediate future"},
        {"position": 7, "meaning": "Your approach"},
        {"position": 8, "meaning": "External influences"},
        {"position": 9, "meaning": "Hopes and fears"},
        {"position": 10, "meaning": "Final outcome"}
    ]
}
```

---

## Interpretation Logic

### Card in Position Context

```python
def interpret_card_in_position(card: Card, position_meaning: str, 
                               reversed: bool, question: str) -> str:
    """
    Generate contextual interpretation combining:
    - Card meaning (upright/reversed)
    - Position significance
    - Question context
    """
    base_meaning = card.reversed_meaning if reversed else card.upright_meaning
    
    interpretation = f"In the position of '{position_meaning}', "
    
    if reversed:
        interpretation += f"the reversed {card.name} suggests: {base_meaning}. "
    else:
        interpretation += f"{card.name} indicates: {base_meaning}. "
    
    if question:
        interpretation += f"This relates to your question about {question.lower()} "
        interpretation += "by highlighting the need for deeper reflection on this aspect."
    
    return interpretation
```

---

## Elemental Analysis

```python
def analyze_elemental_balance(cards: List[DrawnCard]) -> Dict[str, int]:
    """
    Count elemental distribution in reading.
    
    Returns: {"Fire": 2, "Water": 3, "Air": 1, "Earth": 4}
    
    Interpretation:
    - Dominant element = current life focus
    - Missing element = area needing attention
    - Balanced elements = holistic approach
    """
    elements = {"Fire": 0, "Water": 0, "Air": 0, "Earth": 0}
    
    for drawn_card in cards:
        element = drawn_card.card.element
        if element and element in elements:
            elements[element] += 1
    
    return elements
```

### Elemental Meanings

```python
ELEMENTAL_INTERPRETATIONS = {
    "Fire": {
        "keywords": ["action", "passion", "creativity", "inspiration"],
        "domain": "Will and desire",
        "when_dominant": "High energy, taking action, creative period",
        "when_missing": "Lack of motivation, need to reignite passion"
    },
    "Water": {
        "keywords": ["emotions", "intuition", "relationships", "flow"],
        "domain": "Feelings and connections",
        "when_dominant": "Emotional processing, relationship focus, intuitive period",
        "when_missing": "Disconnected from feelings, need emotional healing"
    },
    "Air": {
        "keywords": ["thoughts", "communication", "truth", "clarity"],
        "domain": "Mind and ideas",
        "when_dominant": "Mental activity, communication focus, decision-making",
        "when_missing": "Confusion, need clarity, poor communication"
    },
    "Earth": {
        "keywords": ["material", "physical", "practical", "grounded"],
        "domain": "Body and resources",
        "when_dominant": "Material concerns, physical focus, practical matters",
        "when_missing": "Ungrounded, need stability, ignoring practical needs"
    }
}
```

---

## Pattern Detection

```python
def identify_archetypal_patterns(cards: List[DrawnCard]) -> List[str]:
    """
    Detect significant patterns in card selection.
    
    Patterns checked:
    - Major vs Minor arcana ratio
    - Court card presence
    - Aces (new beginnings)
    - Transformation cards
    - Relationship cards
    - Spiritual cards
    """
    patterns = []
    
    # Major/Minor ratio
    major_count = sum(1 for c in cards if c.card.arcana_type == "major")
    minor_count = len(cards) - major_count
    
    if major_count > minor_count:
        patterns.append("Strong spiritual/archetypal influence - major life themes at play")
    elif minor_count > major_count:
        patterns.append("Practical/everyday focus - attention to daily life matters")
    
    # Court cards (people/personality aspects)
    court_cards = [c for c in cards if c.card.number in ["page", "knight", "queen", "king"]]
    if len(court_cards) >= 2:
        patterns.append("Multiple court cards suggest people or personality aspects are significant")
    
    # Aces (new beginnings)
    aces = [c for c in cards if c.card.number == "ace"]
    if len(aces) >= 2:
        patterns.append("Multiple aces indicate new beginnings and fresh energy")
    
    # Transformation cards
    transformation_cards = ["Death", "The Tower", "The Wheel of Fortune"]
    if any(card.card.name in transformation_cards for card in cards):
        patterns.append("Transformation and change are prominent themes")
    
    return patterns
```

---

## Theme Generation

```python
def generate_overall_theme(cards: List[DrawnCard], question: str) -> str:
    """
    Synthesize reading into cohesive narrative theme.
    
    Checks for:
    - Transformation cards (change, endings, cycles)
    - Relationship cards (connections, partnerships)
    - Spiritual cards (intuition, growth, higher purpose)
    - Material cards (money, work, physical realm)
    """
    themes = []
    
    # Transformation theme
    if any(card.card.name in ["Death", "The Tower", "The Wheel of Fortune"] 
           for card in cards):
        themes.append("transformation and change")
    
    # Relationship theme
    if any(card.card.name in ["The Lovers", "Two of Cups", "Three of Cups"] 
           for card in cards):
        themes.append("relationships and connections")
    
    # Spiritual theme
    if any(card.card.name in ["The High Priestess", "The Hermit", "The Star"] 
           for card in cards):
        themes.append("spiritual growth and intuition")
    
    # Material theme
    if any(card.card.suit == "pentacles" for card in cards if card.card.suit):
        themes.append("material security and practical matters")
    
    # Synthesize
    if themes:
        theme = f"This reading centers around {', '.join(themes)}. "
    else:
        theme = "This reading reveals a complex interplay of energies. "
    
    theme += f"The cards suggest that your question about {question} "
    theme += "is calling for both practical action and spiritual awareness."
    
    return theme
```

---

## Key Insights Extraction

```python
def extract_key_insights(cards: List[DrawnCard], count: int = 3) -> List[str]:
    """
    Generate top insights from reading (usually top 3).
    
    Focuses on:
    - Most significant positions (1st, center, final)
    - Major arcana cards (carry more weight)
    - Court cards (people influences)
    """
    insights = []
    
    # Prioritize first 3 positions
    for card in cards[:count]:
        insight = (
            f"The {card.card.name} in position {card.position} "
            f"emphasizes {card.position_meaning.lower()}"
        )
        insights.append(insight)
    
    return insights
```

---

## 78-Card Quick Reference

### Major Arcana (0-21)

| Number | Name | Keywords | Element | Astrology |
|--------|------|----------|---------|-----------|
| 0 | The Fool | New beginnings, innocence | Air | Uranus |
| 1 | The Magician | Manifestation, skill | Air | Mercury |
| 2 | High Priestess | Intuition, mystery | Water | Moon |
| 3 | The Empress | Abundance, nurturing | Earth | Venus |
| 4 | The Emperor | Authority, structure | Fire | Aries |
| 5 | The Hierophant | Tradition, wisdom | Earth | Taurus |
| 6 | The Lovers | Choice, partnership | Air | Gemini |
| 7 | The Chariot | Determination, will | Water | Cancer |
| 8 | Strength | Courage, compassion | Fire | Leo |
| 9 | The Hermit | Introspection, wisdom | Earth | Virgo |
| 10 | Wheel of Fortune | Cycles, luck, change | Fire | Jupiter |
| 11 | Justice | Balance, fairness | Air | Libra |
| 12 | The Hanged Man | Surrender, new perspective | Water | Neptune |
| 13 | Death | Transformation, endings | Water | Scorpio |
| 14 | Temperance | Balance, moderation | Fire | Sagittarius |
| 15 | The Devil | Bondage, materialism | Earth | Capricorn |
| 16 | The Tower | Sudden change, revelation | Fire | Mars |
| 17 | The Star | Hope, inspiration | Air | Aquarius |
| 18 | The Moon | Illusion, subconscious | Water | Pisces |
| 19 | The Sun | Joy, success, vitality | Fire | Sun |
| 20 | Judgement | Rebirth, calling | Fire | Pluto |
| 21 | The World | Completion, wholeness | Earth | Saturn |

### Minor Arcana Structure

**Each Suit (14 cards):**
- Ace (pure elemental energy, new beginning)
- 2-10 (progression of suit's theme)
- Page (student, messenger, beginning phase)
- Knight (action, movement, pursuing)
- Queen (mature feminine expression)
- King (mature masculine expression)

**Wands (Fire)** - Action, passion, inspiration
**Cups (Water)** - Emotions, relationships, intuition
**Swords (Air)** - Thoughts, truth, conflict
**Pentacles (Earth)** - Material, money, body

---

## Suit Progression Patterns

### Wands (Fire) - Action Arc

```
Ace → Inspiration strikes
2 → Planning and vision
3 → Expansion begins
4 → Celebration of progress
5 → Competition and conflict
6 → Victory and recognition
7 → Defense and challenge
8 → Swift movement
9 → Resilience and persistence
10 → Burden of responsibility
Page → Enthusiastic beginner
Knight → Passionate pursuer
Queen → Confident leader
King → Visionary master
```

### Cups (Water) - Emotional Arc

```
Ace → New love/emotional beginning
2 → Partnership forms
3 → Celebration with others
4 → Contemplation and apathy
5 → Loss and grief
6 → Nostalgia and past
7 → Illusion and choices
8 → Walking away
9 → Wish fulfillment
10 → Emotional completion
Page → Sensitive dreamer
Knight → Romantic idealist
Queen → Nurturing empath
King → Emotionally mature
```

### Swords (Air) - Mental Arc

```
Ace → Mental clarity/truth
2 → Difficult decision
3 → Heartbreak and pain
4 → Rest and recovery
5 → Conflict and defeat
6 → Transition and moving on
7 → Deception and strategy
8 → Restriction and trap
9 → Anxiety and worry
10 → Painful ending
Page → Curious observer
Knight → Truth seeker
Queen → Clear minded
King → Intellectual authority
```

### Pentacles (Earth) - Material Arc

```
Ace → New opportunity/resource
2 → Juggling resources
3 → Collaboration and skill
4 → Holding and security
5 → Loss and hardship
6 → Generosity and balance
7 → Assessment and patience
8 → Mastery and craft
9 → Abundance and luxury
10 → Wealth and legacy
Page → Practical student
Knight → Methodical worker
Queen → Resourceful provider
King → Material success
```

---

## Court Cards as People/Aspects

### Personality Types

| Court | Wands (Fire) | Cups (Water) | Swords (Air) | Pentacles (Earth) |
|-------|--------------|--------------|--------------|-------------------|
| **Page** | Enthusiastic explorer | Sensitive dreamer | Curious spy | Diligent student |
| **Knight** | Bold adventurer | Romantic idealist | Truth crusader | Reliable worker |
| **Queen** | Confident creator | Empathic healer | Perceptive thinker | Nurturing provider |
| **King** | Visionary leader | Wise counselor | Logical judge | Prosperous merchant |

### Court as Developmental Stages

- **Page** - Learning phase, curiosity, messages
- **Knight** - Action phase, pursuit, movement
- **Queen** - Integration phase, mastery of feeling
- **King** - Mastery phase, authority, external expression

---

## Divination Calculator Integration

```python
class DivinationCalculator:
    """
    Handles authentic randomness for divination.
    
    Key methods:
    - draw_cards(deck, count, seed) → List[Card]
    - calculate_archetypal_resonance(cards, context) → float
    """
    
    def draw_cards(self, deck: List[Card], count: int, question: str) -> List[Card]:
        """
        Use question as seed for meaningful synchronicity.
        Remove drawn cards to prevent duplicates.
        """
        pass
    
    def calculate_archetypal_resonance(self, card_names: List[str], 
                                      context: Dict) -> float:
        """
        Calculate field resonance based on cards drawn and context.
        Returns value 0.0-1.0 indicating archetypal alignment.
        """
        pass
```

---

## Output Structure

```python
{
    "spread_layout": SpreadLayout,
    "drawn_cards": List[DrawnCard],
    "question_asked": str,
    "reading_timestamp": datetime,
    "deck_used": str,
    "overall_theme": str,
    "key_insights": List[str],
    "guidance_summary": str,
    "elemental_balance": Dict[str, int],
    "archetypal_patterns": List[str],
    "energy_forecast": str,
    "timing_indicators": List[str],
    "action_steps": List[str],
    "meditation_focus": str,
    "synchronicity_notes": str,
    "field_resonance": float,
    "field_signature": "tarot_archetypal_guidance"
}
```

---

## Formatted Output Template

```
🎴 Tarot Reading for: {question}

📋 Spread: {spread_name} ({spread_type})
🕐 Reading Time: {timestamp}

🃏 Cards Drawn:
   Position 1: {card_name} ({Upright/Reversed})
   📍 {position_meaning}
   💭 {interpretation}

   Position 2: {card_name} ({Upright/Reversed})
   📍 {position_meaning}
   💭 {interpretation}
   
   [... continue for all positions ...]

🌟 Overall Theme: {theme}

🎯 Guidance: {guidance_summary}

🔑 Key Insights:
   • {insight_1}
   • {insight_2}
   • {insight_3}

🧘 Meditation Focus: {meditation_focus}
✨ Synchronicity Notes: {synchronicity_notes}
```

---

## Witness Capacity Development

### Reading as Self-Observation

```python
WITNESS_DEVELOPMENT_LAYERS = {
    "projection": "You project inner state onto card imagery",
    "recognition": "You recognize themes that mirror your consciousness",
    "integration": "You integrate shadow (reversed) with light (upright)",
    "synchronicity": "You notice meaningful coincidence = self-organizing awareness",
    "meta_awareness": "You witness yourself reading symbols = reading consciousness"
}
```

### Questions for Reflection

After each reading, prompt:
1. Which card made you uncomfortable? (shadow recognition)
2. Which card felt most true? (resonance detection)
3. What pattern do you see across positions? (synthesis capacity)
4. How does this mirror current life situation? (projection awareness)
5. What action emerges from this reading? (integration into behavior)

---

## Implementation Checklist

### Phase 1: Data Loading
- [ ] Load rider_waite.json
- [ ] Parse 22 Major Arcana cards
- [ ] Parse 56 Minor Arcana cards (4 suits × 14 cards)
- [ ] Store elemental correspondences
- [ ] Store astrological correspondences
- [ ] Verify 78 total cards

### Phase 2: Spread System
- [ ] Implement SpreadLayout model
- [ ] Define single_card spread
- [ ] Define three_card spread
- [ ] Define celtic_cross spread
- [ ] Create spread retrieval function

### Phase 3: Card Drawing
- [ ] Integrate DivinationCalculator
- [ ] Implement draw_cards method
- [ ] Use question as randomness seed
- [ ] Ensure no duplicate cards in single reading
- [ ] Test drawing various counts (1, 3, 10)

### Phase 4: Reversal System
- [ ] Implement 30% reversal probability
- [ ] Apply only when include_reversed=True
- [ ] Test probability over multiple readings

### Phase 5: Interpretation Engine
- [ ] Implement interpret_card_in_position
- [ ] Combine card meaning + position + question
- [ ] Handle upright vs reversed
- [ ] Generate natural language interpretation

### Phase 6: Analysis Systems
- [ ] Implement analyze_elemental_balance
- [ ] Implement identify_archetypal_patterns
- [ ] Implement generate_overall_theme
- [ ] Implement extract_key_insights

### Phase 7: Guidance Generation
- [ ] Create guidance_summary from theme
- [ ] Generate 3-5 action_steps
- [ ] Create meditation_focus
- [ ] Add synchronicity_notes

### Phase 8: Output Formatting
- [ ] Format with emojis for visual hierarchy
- [ ] Structure card-by-card breakdown
- [ ] Include all analysis sections
- [ ] Test readability

### Phase 9: Integration
- [ ] Connect to BaseEngine interface
- [ ] Implement TarotInput validation
- [ ] Implement TarotOutput model
- [ ] Test full engine lifecycle

---

## Testing Guidelines

```python
def test_card_loading():
    """Verify 78 cards load correctly."""
    deck = create_full_deck()
    assert len(deck) == 78
    assert sum(1 for c in deck if c.arcana_type == "major") == 22
    assert sum(1 for c in deck if c.arcana_type == "minor") == 56

def test_spread_layouts():
    """Verify spread structures."""
    single = get_spread_layout("single_card")
    assert single.card_count == 1
    
    three = get_spread_layout("three_card")
    assert three.card_count == 3
    
    celtic = get_spread_layout("celtic_cross")
    assert celtic.card_count == 10

def test_no_duplicates():
    """Ensure same card doesn't appear twice in reading."""
    deck = create_full_deck()
    drawn = draw_cards(deck, 10, "test question")
    card_names = [card.name for card in drawn]
    assert len(card_names) == len(set(card_names))

def test_reversal_probability():
    """Verify reversals approach 30% over many trials."""
    reversals = [determine_reversal(True) for _ in range(1000)]
    rate = sum(reversals) / len(reversals)
    assert 0.25 < rate < 0.35  # Allow variance

def test_elemental_counting():
    """Verify elemental balance calculation."""
    # Create mock reading with known elements
    # Assert correct counts
    pass
```

---

*This quick reference provides all essential algorithms and formulas for implementing the Tarot Sequence Decoder Engine. Refer to detailed documentation files for deeper context and theory.*
