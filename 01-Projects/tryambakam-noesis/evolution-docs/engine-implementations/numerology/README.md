# Numerology Engine Documentation

## Overview

The Numerology Engine provides comprehensive numerological analysis using both **Pythagorean** and **Chaldean** systems to extract soul-number matrices and vibrational signatures from names and birth dates.

## Systems Supported

- **Pythagorean System** - Standard Western numerology (1-9)
- **Chaldean System** - Ancient Babylonian numerology (1-8)

## Document Index

1. **[numerology-calculation-formulas.md](./numerology-calculation-formulas.md)**
   - Life Path calculation algorithms
   - Expression, Soul Urge, Personality number formulas
   - Master Number handling (11, 22, 33, 44)
   - Pythagorean vs Chaldean letter-to-number tables
   - Reduction methods and validation rules

2. **[numerology-implementation-architecture.md](./numerology-implementation-architecture.md)**
   - NumerologyCalculator class architecture
   - Reduction algorithms implementation
   - Master Number detection logic
   - Unicode/international name handling

3. **[numerology-api-specification.md](./numerology-api-specification.md)**
   - Input/Output data models
   - Simple calculation API
   - Batch analysis endpoints
   - Name variation analysis

4. **[numerology-cross-engine-mappings.md](./numerology-cross-engine-mappings.md)**
   - Universal birth date dependency
   - Life Path correlations with other engines
   - Personal Year temporal synchronization
   - Name vibration consciousness mappings

## Quick Start

```python
from engines.numerology import NumerologyEngine
from engines.numerology_models import NumerologyInput

engine = NumerologyEngine()

numerology_input = NumerologyInput(
    user_id="user123",
    full_name="John Michael Doe",
    birth_date="1990-05-15",
    system="pythagorean",
    current_year=2024
)

result = engine.calculate(numerology_input)

print(f"Life Path: {result.life_path}")
print(f"Expression: {result.expression}")
print(f"Soul Urge: {result.soul_urge}")
print(f"Personal Year: {result.personal_year}")
```

## Core Numbers

### Life Path
Your soul's curriculum for this incarnation. Calculated from birth date.

### Expression Number
How your soul-essence translates into worldly expression. Calculated from full name.

### Soul Urge Number
Your inner compass and deepest motivations. Calculated from vowels in name.

### Personality Number
The energetic mask through which you interface with reality. Calculated from consonants.

### Personal Year
Current year's vibrational theme. Calculated from birth date + current year.

## Key Features

- **Dual System Support** - Pythagorean and Chaldean
- **Master Number Recognition** - 11, 22, 33, 44
- **Karmic Debt Detection** - 13, 14, 16, 19
- **Bridge Numbers** - Life-Expression and Soul-Personality gaps
- **Personal Year Cycles** - 9-year cyclical timing
- **Unicode Support** - International name handling
- **Name Variations** - Analyze preferred names and nicknames

## Privacy Note

Unlike biometric engines, numerology uses only names and birth dates - no sensitive biometric data collection required.
