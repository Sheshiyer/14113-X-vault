# Tarot Calculation Formulas

## Spread Layouts

### 1. Single Card Draw

Simplest spread for quick guidance.

**Structure:**
- 1 card drawn
- Direct answer to question

**Position Meanings:**
1. **Guidance**: Core message for the querent

**Use Cases:**
- Daily guidance
- Yes/no questions (with interpretation)
- Quick check-in
- Card of the day practices

### 2. Three-Card Spread (Past, Present, Future)

Classic three-card progression spread.

**Structure:**
- 3 cards drawn in sequence
- Linear time progression

**Position Meanings:**
1. **Past Influences**: What has led to this situation
2. **Present Situation**: Current state and energies
3. **Future Outcome**: Where things are heading

**Alternative Interpretations:**
- **Situation, Action, Outcome**
- **Mind, Body, Spirit**
- **You, Other Person, Relationship**
- **Thesis, Antithesis, Synthesis**

**Reading Formula:**

```python
def interpret_three_card(cards: List[DrawnCard]) -> str:
    """
    Interpret three-card spread.
    
    Creates narrative flow connecting three positions.
    """
    past_card = cards[0]
    present_card = cards[1]
    future_card = cards[2]
    
    interpretation = f"Looking at your past, {past_card.card.name} shows that "
    interpretation += f"{past_card.interpretation.lower()} "
    interpretation += f"This has brought you to the present where {present_card.card.name} "
    interpretation += f"indicates {present_card.interpretation.lower()} "
    interpretation += f"Moving forward, {future_card.card.name} suggests that "
    interpretation += f"{future_card.interpretation.lower()}"
    
    return interpretation
```

### 3. Celtic Cross (10-Card Spread)

Comprehensive spread for deep analysis.

**Structure:**
- 10 cards in specific layout
- Cross formation with staff

**Layout Diagram:**
```
                [5]
                 |
    [10]        [6]
     |           |
    [9]    [3]-[1]-[4]
     |           |
    [8]         [2]
     |
    [7]
```

**Position Meanings:**

| Position | Name | Meaning |
|----------|------|---------|
| 1 | Present Situation | Core of the matter, current state |
| 2 | Challenge/Cross | Immediate obstacle or opposing force |
| 3 | Distant Past/Foundation | Root cause, deep background |
| 4 | Recent Past | Events leading to present moment |
| 5 | Possible Outcome | Best case scenario, crown of situation |
| 6 | Immediate Future | What's coming next (6-8 weeks) |
| 7 | Your Approach | How querent is handling the situation |
| 8 | External Influences | Environmental factors, other people |
| 9 | Hopes and Fears | Desires and anxieties (often intertwined) |
| 10 | Final Outcome | Ultimate result, synthesis of all factors |

**Reading Algorithm:**

```python
def interpret_celtic_cross(cards: List[DrawnCard]) -> Dict[str, str]:
    """
    Structured Celtic Cross interpretation.
    """
    sections = {
        "core_situation": f"At the heart of the matter, {cards[0].card.name} in position 1 shows {cards[0].interpretation}. However, {cards[1].card.name} crosses this, indicating {cards[1].interpretation}",
        
        "foundation": f"The foundation of this situation lies in {cards[2].card.name} (position 3), which reveals {cards[2].interpretation}. This recently manifested through {cards[3].card.name} (position 4): {cards[3].interpretation}",
        
        "trajectory": f"Looking ahead, the best possible outcome is shown by {cards[4].card.name} (position 5): {cards[4].interpretation}. In the immediate future (position 6), {cards[5].card.name} suggests {cards[5].interpretation}",
        
        "personal_context": f"Your approach to this situation is represented by {cards[6].card.name} (position 7): {cards[6].interpretation}. Meanwhile, external influences (position 8) show {cards[7].card.name}, meaning {cards[7].interpretation}",
        
        "inner_dynamics": f"Your hopes and fears are embodied in {cards[8].card.name} (position 9): {cards[8].interpretation}",
        
        "final_outcome": f"The ultimate outcome (position 10) is {cards[9].card.name}, indicating {cards[9].interpretation}"
    }
    
    return sections
```

## Card Position Meanings

### Position Interpretation Logic

Each position adds context to card meaning:

```python
def contextualize_card(card: TarotCard, position_meaning: str, question: str) -> str:
    """
    Apply positional context to card interpretation.
    
    The same card means different things in different positions.
    """
    base_meaning = card.upright_meaning  # or reversed_meaning
    
    # Position modifiers
    position_templates = {
        "past": f"In your past, {card.name} suggests that {base_meaning}. This background has shaped your current situation.",
        "present": f"Currently, {card.name} indicates that {base_meaning}. This is the energy you're working with right now.",
        "future": f"Looking ahead, {card.name} points toward {base_meaning}. This is the direction you're heading.",
        "challenge": f"The challenge you face is embodied in {card.name}: {base_meaning}. This is what you must navigate.",
        "outcome": f"The outcome indicated by {card.name} is {base_meaning}. This is where things are leading.",
        "approach": f"Your approach, shown by {card.name}, involves {base_meaning}. This is how you're handling things.",
        "external": f"External influences represented by {card.name} bring {base_meaning} into your situation.",
        "internal": f"Internally, {card.name} reveals {base_meaning}. This is your inner state.",
    }
    
    # Match position to template
    for key, template in position_templates.items():
        if key in position_meaning.lower():
            return template
    
    # Default
    return f"In the position of '{position_meaning}', {card.name} indicates: {base_meaning}."
```

## Reversal Logic

### Reversal Probability

**Default Probability:** 30% chance per card

```python
def determine_reversal(include_reversed: bool) -> bool:
    """
    Determine if a card should be reversed.
    
    30% chance maintains mystical balance while keeping most cards upright.
    """
    if not include_reversed:
        return False
    
    return random.random() < 0.3  # 30% probability
```

### Reversal Interpretation

Reversed cards are not simply "negative" - they have nuanced meanings:

**Interpretation Modes:**

1. **Blocked Energy**: Gift of the card is blocked or internalized
2. **Shadow Side**: Challenging aspects come to foreground
3. **Opposite Meaning**: Direct reversal of upright meaning
4. **Internalized**: Energy is internal rather than external
5. **Excessive**: Too much of the card's energy

```python
def interpret_reversed(card: TarotCard, mode: str = "blocked") -> str:
    """
    Interpret reversed card based on mode.
    """
    modes = {
        "blocked": f"The energy of {card.name} is currently blocked or difficult to access. {card.reversed_meaning}",
        "shadow": f"The shadow side of {card.name} is emerging: {card.reversed_meaning}",
        "opposite": f"{card.name} reversed suggests the opposite of its upright meaning: {card.reversed_meaning}",
        "internal": f"{card.name} reversed indicates this energy is working internally rather than externally: {card.reversed_meaning}",
        "excessive": f"There may be too much of {card.name}'s energy present: {card.reversed_meaning}"
    }
    
    return modes.get(mode, card.reversed_meaning)
```

## Randomization Algorithms

### Deck Shuffling

**Question-Based Seeding:**

```python
def shuffle_deck_for_question(deck: List[TarotCard], question: str) -> List[TarotCard]:
    """
    Shuffle deck based on question content.
    
    Allows for reproducible readings when same question asked at same time.
    """
    import hashlib
    from datetime import datetime
    
    # Create seed from question + timestamp
    seed_string = f"{question.strip().lower()}_{datetime.now().isoformat()}"
    hash_object = hashlib.md5(seed_string.encode())
    seed = int(hash_object.hexdigest()[:8], 16)
    
    # Seeded shuffle
    random.seed(seed)
    shuffled = deck.copy()
    random.shuffle(shuffled)
    random.seed()  # Reset to non-deterministic
    
    return shuffled
```

**Fisher-Yates Shuffle Algorithm:**

```python
def fisher_yates_shuffle(deck: List[TarotCard]) -> List[TarotCard]:
    """
    Implement Fisher-Yates shuffle for uniform randomness.
    
    Ensures each card has equal probability of being in any position.
    """
    shuffled = deck.copy()
    n = len(shuffled)
    
    for i in range(n - 1, 0, -1):
        j = random.randint(0, i)
        shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
    
    return shuffled
```

### Card Drawing

```python
def draw_cards(deck: List[TarotCard], count: int, question: str = "") -> List[TarotCard]:
    """
    Draw specified number of cards from deck.
    
    Args:
        deck: Full 78-card deck
        count: Number of cards to draw
        question: Optional question for seeding
    
    Returns:
        List of drawn cards (no duplicates)
    """
    if question:
        shuffled = shuffle_deck_for_question(deck, question)
    else:
        shuffled = fisher_yates_shuffle(deck)
    
    return shuffled[:count]
```

## Elemental Balance Calculation

### Element Counting

```python
def calculate_elemental_balance(cards: List[DrawnCard]) -> Dict[str, int]:
    """
    Calculate elemental distribution in reading.
    
    Elements:
    - Fire: Wands, Aries/Leo/Sagittarius Majors
    - Water: Cups, Cancer/Scorpio/Pisces Majors
    - Air: Swords, Gemini/Libra/Aquarius Majors
    - Earth: Pentacles, Taurus/Virgo/Capricorn Majors
    """
    elements = {"Fire": 0, "Water": 0, "Air": 0, "Earth": 0}
    
    for drawn_card in cards:
        element = drawn_card.card.element
        if element and element in elements:
            elements[element] += 1
    
    return elements
```

### Balance Interpretation

```python
def interpret_elemental_balance(balance: Dict[str, int]) -> str:
    """
    Interpret what elemental distribution means.
    """
    total = sum(balance.values())
    if total == 0:
        return "No clear elemental emphasis."
    
    dominant = max(balance, key=balance.get)
    dominant_count = balance[dominant]
    
    if dominant_count / total > 0.5:
        element_meanings = {
            "Fire": "Strong emphasis on action, passion, and creative energy",
            "Water": "Strong emphasis on emotions, intuition, and relationships",
            "Air": "Strong emphasis on thoughts, communication, and mental processes",
            "Earth": "Strong emphasis on practical matters, material concerns, and physical reality"
        }
        return element_meanings[dominant]
    else:
        return "Balanced elemental energy across multiple areas of life"
```

## Archetypal Pattern Recognition

### Pattern Types

**Major Arcana Density:**

```python
def calculate_major_arcana_density(cards: List[DrawnCard]) -> float:
    """
    Calculate percentage of Major Arcana cards.
    
    High density (>50%) indicates:
    - Significant spiritual lessons
    - Karmic influences
    - Major life themes
    - Less personal control
    
    Low density (<30%) indicates:
    - Everyday matters
    - Personal agency
    - Practical concerns
    - More control over outcomes
    """
    major_count = sum(1 for c in cards if c.card.arcana_type == "major")
    return major_count / len(cards) if cards else 0.0
```

**Court Card Analysis:**

```python
def analyze_court_cards(cards: List[DrawnCard]) -> Dict[str, Any]:
    """
    Identify court card patterns.
    
    Multiple court cards suggest:
    - People are significant in the situation
    - Personality aspects at play
    - Social dynamics important
    """
    court_cards = [c for c in cards if c.card.number in ["page", "knight", "queen", "king"]]
    
    return {
        "count": len(court_cards),
        "cards": [c.card.name for c in court_cards],
        "significance": "high" if len(court_cards) >= 2 else "low",
        "interpretation": "Multiple personalities or people are central to this situation" if len(court_cards) >= 2 else "Individual focus"
    }
```

**Ace Pattern:**

```python
def identify_ace_pattern(cards: List[DrawnCard]) -> Dict[str, Any]:
    """
    Identify Ace cards (new beginnings).
    
    Multiple Aces indicate:
    - New opportunities
    - Fresh starts
    - Seed energies
    - Potential waiting to unfold
    """
    aces = [c for c in cards if c.card.number == "ace"]
    
    if len(aces) >= 2:
        return {
            "pattern": "multiple_new_beginnings",
            "aces": [c.card.name for c in aces],
            "interpretation": "Multiple new beginnings and opportunities are presenting themselves"
        }
    elif len(aces) == 1:
        return {
            "pattern": "single_opportunity",
            "ace": aces[0].card.name,
            "interpretation": f"A new beginning in the realm of {aces[0].card.suit}"
        }
    else:
        return {
            "pattern": "no_aces",
            "interpretation": "Working with established energies rather than new beginnings"
        }
```

## Complete Reading Formula

```python
def generate_complete_reading(
    spread_type: str,
    question: str,
    include_reversed: bool = True
) -> Dict[str, Any]:
    """
    Complete tarot reading generation algorithm.
    
    Flow:
    1. Create full 78-card deck
    2. Select spread layout
    3. Shuffle deck (question-seeded or random)
    4. Draw required number of cards
    5. Determine reversals
    6. Interpret each card in position
    7. Analyze patterns (elements, archetypes, numerology)
    8. Generate overall theme
    9. Provide guidance and action steps
    """
    
    # 1. Create deck (22 Major + 56 Minor = 78 cards)
    deck = create_full_deck()
    
    # 2. Get spread layout
    spread = get_spread_layout(spread_type)
    
    # 3 & 4. Shuffle and draw
    drawn_cards_raw = draw_cards(deck, spread.card_count, question)
    
    # 5 & 6. Apply reversals and interpret
    drawn_cards = []
    for i, card in enumerate(drawn_cards_raw):
        position = spread.positions[i]
        reversed = determine_reversal(include_reversed)
        interpretation = contextualize_card(
            card, 
            position["meaning"], 
            question
        )
        
        drawn_card = DrawnCard(
            card=card,
            position=position["position"],
            position_meaning=position["meaning"],
            reversed=reversed,
            interpretation=interpretation
        )
        drawn_cards.append(drawn_card)
    
    # 7. Analyze patterns
    elemental_balance = calculate_elemental_balance(drawn_cards)
    major_density = calculate_major_arcana_density(drawn_cards)
    court_analysis = analyze_court_cards(drawn_cards)
    ace_pattern = identify_ace_pattern(drawn_cards)
    
    # 8. Generate theme
    overall_theme = generate_overall_theme(drawn_cards, question)
    
    # 9. Guidance
    guidance = synthesize_guidance(
        drawn_cards,
        elemental_balance,
        major_density,
        question
    )
    
    return {
        "spread": spread,
        "cards": drawn_cards,
        "patterns": {
            "elements": elemental_balance,
            "major_arcana_density": major_density,
            "court_cards": court_analysis,
            "aces": ace_pattern
        },
        "theme": overall_theme,
        "guidance": guidance
    }
```

---

*Last Updated: 2026*  
*Source: WitnessOS Tarot Sequence Decoder Engine*
