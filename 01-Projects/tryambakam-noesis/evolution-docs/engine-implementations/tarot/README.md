# Tarot Sequence Decoder Engine Documentation

Complete technical documentation for the Tarot Sequence Decoder engine from WitnessOS.

## Overview

Tarot is a 78-card divination system consisting of 22 Major Arcana (archetypal energies) and 56 Minor Arcana (everyday experiences). This engine implements traditional spreads with mystical interpretation and archetypal analysis.

**Key Features:**
- Complete 78-card Rider-Waite deck
- Multiple spread layouts (Single Card, Three-Card, Celtic Cross)
- Reversed card interpretations (30% probability)
- Elemental balance analysis
- Archetypal pattern recognition
- Question-based seeding for reproducible readings
- Integration with Sacred Geometry, Numerology, and Astrology

## Documentation Files

### 1. [Tarot Calculation Formulas](./tarot-calculation-formulas.md)

**Contents:**
- Spread layouts (Single Card, Three-Card, Celtic Cross)
- Card position meanings and interpretation logic
- Reversal logic and probability (30% chance)
- Randomization algorithms (Fisher-Yates shuffle, question-based seeding)
- Elemental balance calculation
- Archetypal pattern recognition formulas
- Complete reading generation algorithm

**Use this document to:**
- Understand spread structures and position meanings
- Implement card drawing and reversal logic
- Calculate elemental distributions
- Identify archetypal patterns in readings
- Generate complete interpretations

### 2. [Tarot Implementation Architecture](./tarot-implementation-architecture.md)

**Contents:**
- Complete data model specifications
- TarotCard, DrawnCard, SpreadLayout structures
- TarotInput, TarotOutput models
- Engine class architecture (TarotSequenceDecoder)
- 78-card deck creation (22 Major + 56 Minor)
- Core methods and calculation pipeline
- JSON data storage format
- Elemental and astrological correspondences
- Court card and numerical patterns

**Use this document to:**
- Understand the data structures
- Implement the engine in your codebase
- Work with deck and spread data
- Integrate with the WitnessOS engine framework
- Access card correspondences

### 3. [Tarot API Specification](./tarot-api-specification.md)

**Contents:**
- REST API endpoints for drawing readings
- Request/response formats
- Spread calculation APIs
- Card retrieval methods (by name, suit, type)
- Batch reading generation
- Pattern analysis endpoints
- WebSocket API for real-time card reveals
- GraphQL schema
- SDK examples (Python, JavaScript/TypeScript, cURL)
- Error handling and caching strategies

**Use this document to:**
- Build client applications
- Integrate Tarot readings into your services
- Implement API endpoints
- Work with the various SDKs
- Query card and spread data

### 4. [Tarot Cross-Engine Mappings](./tarot-cross-engine-mappings.md)

**Contents:**
- Integration with Sacred Geometry (Kabbalistic Tree of Life)
- Major Arcana to Tree of Life paths (22 paths)
- Minor Arcana to Sephiroth correspondences
- Numerological card meanings
- Birth date to personality/soul cards
- Astrological correspondences (zodiac signs, planets)
- Human Design center activations
- I-Ching elemental relationships
- Gene Keys shadow-gift-siddhi mapping
- Multi-system synthesis examples

**Use this document to:**
- Map cards to Kabbalistic paths
- Calculate birth cards from dates
- Work with astrological timing
- Create cross-system readings
- Integrate with other divination engines

## Quick Start

### Generate a Basic Reading

```python
from engines.tarot import TarotSequenceDecoder
from engines.tarot_models import TarotInput

# Initialize engine
engine = TarotSequenceDecoder()

# Create input
input_data = TarotInput(
    question="What energy surrounds my relationship?",
    spread_type="three_card",
    include_reversed=True,
    focus_area="love"
)

# Get reading
output = engine.run(input_data)

# Access results
print(output.formatted_output)
for card in output.raw_data["drawn_cards"]:
    status = "Reversed" if card.reversed else "Upright"
    print(f"Position {card.position}: {card.card.name} ({status})")
```

## The 78-Card Deck

### Major Arcana (22 Cards)

Represent major life themes, spiritual lessons, and archetypal energies:

| # | Card | Element | Keywords |
|---|------|---------|----------|
| 0 | The Fool | Air | New beginnings, innocence, spontaneity |
| 1 | The Magician | Air | Manifestation, resourcefulness, power |
| 2 | The High Priestess | Water | Intuition, sacred knowledge, divine feminine |
| 3 | The Empress | Earth | Femininity, beauty, nature, abundance |
| 4 | The Emperor | Fire | Authority, structure, father figure |
| ... | ... | ... | ... |
| 21 | The World | Earth | Completion, integration, accomplishment |

*See full Major Arcana data in `rider_waite.json`*

### Minor Arcana (56 Cards)

Four suits representing different aspects of life:

#### Wands (Fire)
- **Keywords**: Creativity, passion, energy, career, growth
- **Cards**: Ace through Ten, Page, Knight, Queen, King
- **Themes**: Action, ambition, creative projects, career

#### Cups (Water)
- **Keywords**: Emotions, relationships, spirituality, intuition, love
- **Cards**: Ace through Ten, Page, Knight, Queen, King
- **Themes**: Feelings, connections, romance, spiritual growth

#### Swords (Air)
- **Keywords**: Thoughts, communication, conflict, truth
- **Cards**: Ace through Ten, Page, Knight, Queen, King
- **Themes**: Mental processes, decisions, challenges, clarity

#### Pentacles (Earth)
- **Keywords**: Material, money, career, achievement, earth
- **Cards**: Ace through Ten, Page, Knight, Queen, King
- **Themes**: Finance, work, physical reality, manifestation

## Spread Layouts

### Single Card Draw
- **Cards**: 1
- **Use**: Daily guidance, quick answers
- **Position**: Guidance for your question

### Three-Card Spread
- **Cards**: 3
- **Use**: Past-Present-Future, Situation-Action-Outcome
- **Positions**: 
  1. Past influences
  2. Present situation
  3. Future outcome

### Celtic Cross
- **Cards**: 10
- **Use**: Comprehensive analysis of complex situations
- **Positions**:
  1. Present situation
  2. Challenge/cross
  3. Distant past/foundation
  4. Recent past
  5. Possible outcome
  6. Immediate future
  7. Your approach
  8. External influences
  9. Hopes and fears
  10. Final outcome

## Reversed Cards

Cards can appear reversed (upside down), adding depth to interpretation:

- **Probability**: 30% chance per card
- **Meaning**: Not simply "negative" - represents blocked energy, shadow aspects, internalization, or excess
- **Interpretation**: Context-dependent, can indicate challenges or alternative expressions

## Elemental Correspondences

### Major Arcana Elements

| Card | Element | Association |
|------|---------|-------------|
| The Fool | Air | Freedom, intellect |
| The High Priestess | Water | Intuition, subconscious |
| The Empress | Earth | Fertility, nature |
| The Emperor | Fire | Authority, power |
| ... | ... | ... |

### Minor Arcana Elements

| Suit | Element | Quality |
|------|---------|---------|
| Wands | Fire | Active, creative, initiating |
| Cups | Water | Emotional, intuitive, receptive |
| Swords | Air | Mental, analytical, communicative |
| Pentacles | Earth | Material, practical, grounding |

## Astrological Correspondences

Many Major Arcana cards correspond to zodiac signs or planets:

| Card | Astrological Sign/Planet |
|------|--------------------------|
| The Emperor | Aries |
| The Hierophant | Taurus |
| The Lovers | Gemini |
| The Chariot | Cancer |
| Strength | Leo |
| The Hermit | Virgo |
| Justice | Libra |
| Death | Scorpio |
| Temperance | Sagittarius |
| The Devil | Capricorn |
| The Star | Aquarius |
| The Moon | Pisces |

*Planetary correspondences also included - see full list in documentation*

## Pattern Recognition

The engine analyzes readings for:

- **Major Arcana Density**: High percentage indicates significant spiritual lessons
- **Court Cards**: Multiple court cards suggest people/personalities are key
- **Aces**: Multiple aces indicate new beginnings and opportunities
- **Elemental Balance**: Distribution of Fire, Water, Air, Earth energies
- **Numerical Patterns**: Recurring numbers suggest thematic emphasis
- **Suit Concentration**: Dominance of one suit highlights life area focus

## Integration Examples

### With Numerology

```python
# Calculate birth cards
from datetime import datetime

birth_date = datetime(1990, 5, 15)
birth_cards = engine.birth_date_to_major_arcana(birth_date)

print(f"Personality Card: {birth_cards['personality_card']}")
print(f"Soul Card: {birth_cards['soul_card']}")
```

### With Sacred Geometry

```python
# Map card to Tree of Life
card_name = "The High Priestess"
tree_mapping = engine.map_card_to_tree_of_life(card_name)

print(f"Path: {tree_mapping['path_number']}")
print(f"Connects: {tree_mapping['connects']}")
print(f"Hebrew Letter: {tree_mapping['hebrew_letter']}")
```

### With Astrology

```python
# Get astrological timing
card_name = "The Emperor"
astro_data = engine.get_card_astrology(card_name)

print(f"Sign: {astro_data['sign']}")  # "Aries"
print(f"Element: {astro_data['element']}")  # "Fire"
```

## File Structure

```
tarot/
├── README.md (this file)
├── tarot-calculation-formulas.md
├── tarot-implementation-architecture.md
├── tarot-api-specification.md
└── tarot-cross-engine-mappings.md
```

## Source Data

**Location:** `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/api/engines/data/tarot/`

**Files:**
- `rider_waite.json` - Complete 78-card Rider-Waite deck with spreads
- `major_arcana.json` - Major Arcana specific data

**Python Modules:**
- `tarot.py` - Main engine implementation
- `tarot_models.py` - Data models and structures
- `divination.py` - Shared divination calculations

## Deck Information

**Rider-Waite-Smith Tarot:**
- Created by Arthur Edward Waite and illustrated by Pamela Colman Smith
- Published 1909
- Most influential tarot deck in English-speaking world
- Rich symbolism and accessible imagery
- Foundation for many modern tarot decks

## References

- **Rider-Waite Tarot**: Classic deck and imagery
- **Kabbalistic Tree of Life**: Mystical correspondence system
- **Golden Dawn Tradition**: Esoteric tarot interpretations
- **Jungian Archetypes**: Psychological dimension of cards

## Contributing

When updating this documentation:

1. Maintain consistency across all four documents
2. Update code examples when API changes
3. Verify correspondences (elemental, astrological, Kabbalistic)
4. Test integration examples
5. Keep cross-references accurate

## Version History

- **2026-01**: Initial documentation extraction from WitnessOS
- Source: WitnessOS Tarot Sequence Decoder Engine

---

**Related Systems:**
- [I-Ching Engine Documentation](../iching/README.md)
- [Sacred Geometry Engine Documentation](../sacred-geometry/README.md)
- [Numerology Engine Documentation](../numerology/README.md)

*For questions or corrections, refer to the main WitnessOS documentation.*
