# I-Ching Oracle Engine Documentation

Complete technical documentation for the I-Ching Mutation Oracle engine from WitnessOS.

## Overview

The I-Ching (易經, Book of Changes) is an ancient Chinese divination system based on 64 hexagrams, each composed of six lines that can be either yin (broken) or yang (solid). This engine implements traditional divination methods with modern software architecture.

**Key Features:**
- Traditional divination methods (coins, yarrow stalks, random)
- Changing lines and mutation hexagrams
- 64 complete hexagrams with interpretations
- 8 trigrams (Ba Gua) with elemental correspondences
- Question-based seeding for reproducible readings
- Integration with Human Design and Gene Keys systems

## Documentation Files

### 1. [I-Ching Calculation Formulas](./iching-calculation-formulas.md)

**Contents:**
- Hexagram generation methods (coin toss, yarrow stalks, random)
- Line value calculation (6, 7, 8, 9)
- Binary to hexagram number conversion
- Changing lines logic and mutation hexagram creation
- Nuclear hexagram extraction
- Trigram relationship analysis
- Complete reading algorithm

**Use this document to:**
- Understand the mathematics behind hexagram generation
- Implement divination methods
- Calculate hexagram numbers from line values
- Work with changing lines and mutations

### 2. [I-Ching Implementation Architecture](./iching-implementation-architecture.md)

**Contents:**
- Complete data model specifications
- Trigram and Hexagram structures
- IChingReading, IChingInput, IChingOutput models
- Engine class architecture (IChingMutationOracle)
- Core methods and calculation pipeline
- JSON data storage format
- Integration with DivinationCalculator
- Trigram correspondences (elements, directions, family)

**Use this document to:**
- Understand the data structures
- Implement the engine in your codebase
- Work with hexagram and trigram data
- Integrate with the WitnessOS engine framework

### 3. [I-Ching API Specification](./iching-api-specification.md)

**Contents:**
- REST API endpoints for casting readings
- Request/response formats
- Interpretation retrieval APIs
- Batch reading generation
- WebSocket API for real-time casting
- GraphQL schema
- SDK examples (Python, JavaScript/TypeScript, cURL)
- Error handling and response codes
- Caching strategies

**Use this document to:**
- Build client applications
- Integrate I-Ching readings into your services
- Implement API endpoints
- Work with the various SDKs

### 4. [I-Ching Cross-Engine Mappings](./iching-cross-engine-mappings.md)

**Contents:**
- Integration with Human Design (64 gates)
- Hexagram to HD gate mapping with centers
- Changing lines to HD line activation
- Gene Keys three-level system (Shadow-Gift-Siddhi)
- Numerological correspondences
- Astrological timing and planetary associations
- Sacred geometry connections
- Multi-system synthesis examples

**Use this document to:**
- Integrate I-Ching with other divination systems
- Map hexagrams to Human Design gates
- Work with Gene Keys interpretations
- Create cross-system readings

## Quick Start

### Generate a Basic Reading

```python
from engines.iching import IChingMutationOracle
from engines.iching_models import IChingInput

# Initialize engine
engine = IChingMutationOracle()

# Create input
input_data = IChingInput(
    question="What should I focus on in my career?",
    method="coins",
    include_changing_lines=True
)

# Get reading
output = engine.run(input_data)

# Access results
print(output.formatted_output)
print(f"Primary Hexagram: {output.raw_data['reading'].primary_hexagram.name}")
if output.raw_data['has_mutation']:
    print(f"Mutation Hexagram: {output.raw_data['reading'].mutation_hexagram.name}")
```

## The 64 Hexagrams

The I-Ching consists of 64 hexagrams, each representing a unique situation or state of being:

| # | Name | Chinese | Trigrams | Keywords |
|---|------|---------|----------|----------|
| 1 | The Creative | 乾 Qián | Heaven/Heaven | Creativity, strength, leadership |
| 2 | The Receptive | 坤 Kūn | Earth/Earth | Receptivity, yielding, nurturing |
| 3 | Difficulty at Beginning | 屯 Zhūn | Water/Thunder | Difficulty, birth, perseverance |
| ... | ... | ... | ... | ... |
| 64 | Before Completion | 未濟 Wèi Jì | Fire/Water | Transition, potential, caution |

*See full hexagram data in `hexagrams.json`*

## The Eight Trigrams (Ba Gua)

| Trigram | Chinese | Symbol | Element | Attribute |
|---------|---------|--------|---------|-----------|
| Heaven | 乾 Qián | ☰ | Metal | Creative, Strong |
| Earth | 坤 Kūn | ☷ | Earth | Receptive, Devoted |
| Thunder | 震 Zhèn | ☳ | Wood | Arousing, Movement |
| Water | 坎 Kǎn | ☵ | Water | Abysmal, Danger |
| Mountain | 艮 Gèn | ☶ | Earth | Keeping Still |
| Wind | 巽 Xùn | ☴ | Wood | Gentle, Penetrating |
| Fire | 離 Lí | ☲ | Fire | Clinging, Clarity |
| Lake | 兌 Duì | ☱ | Metal | Joyous, Pleasure |

## Divination Methods

### 1. Coin Method (Three-Coin Toss)
- Most common modern method
- Toss three coins six times
- Heads = 3, Tails = 2
- Line values: 6 (Old Yin), 7 (Young Yang), 8 (Young Yin), 9 (Old Yang)
- 25% chance of changing lines per position

### 2. Yarrow Stalk Method
- Traditional method using 50 yarrow stalks
- More nuanced probability distribution
- Emphasizes Young Yin (43.75% probability)
- Old lines less common (6.25% and 18.75%)

### 3. Random Method
- Equal probability for all line values
- Fastest computation
- Modern simplified approach

## Line Values

- **6 (Old Yin)**: Changing line, transforms to Yang (⚋ → ⚊)
- **7 (Young Yang)**: Static Yang line (⚊)
- **8 (Young Yin)**: Static Yin line (⚋)
- **9 (Old Yang)**: Changing line, transforms to Yin (⚊ → ⚋)

## Changing Lines and Mutation

When a reading contains changing lines (Old Yin or Old Yang), these lines transform into their opposite to create a mutation hexagram:

```
Primary Hexagram    Changing Lines    Mutation Hexagram
      ⚊                              →        ⚋
      ⚊                              →        ⚊
      ⚋                              →        ⚋
      ⚊               Line 4 (9)     →        ⚋
      ⚋                              →        ⚋
      ⚋               Line 1 (6)     →        ⚊
```

The mutation hexagram represents the future tendency or evolution of the situation.

## Integration Examples

### With Human Design

```python
from engines.human_design import HumanDesignEngine

# Map hexagram to HD gate
hexagram_number = 1
hd_engine = HumanDesignEngine()
gate_data = hd_engine.get_gate_by_number(hexagram_number)

print(f"Hexagram {hexagram_number} = Gate {gate_data['number']}")
print(f"Center: {gate_data['center']}")
print(f"Keynote: {gate_data['keynote']}")
```

### With Gene Keys

```python
from engines.gene_keys import GeneKeysEngine

# Get Gene Key perspective
gk_engine = GeneKeysEngine()
key_data = gk_engine.get_key_by_number(hexagram_number)

print(f"Shadow: {key_data['shadow']}")
print(f"Gift: {key_data['gift']}")
print(f"Siddhi: {key_data['siddhi']}")
```

## File Structure

```
iching/
├── README.md (this file)
├── iching-calculation-formulas.md
├── iching-implementation-architecture.md
├── iching-api-specification.md
└── iching-cross-engine-mappings.md
```

## Source Data

**Location:** `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/api/engines/data/iching/`

**Files:**
- `hexagrams.json` - Complete data for all 64 hexagrams
- `hexagrams_complete.json` - Extended hexagram data

**Python Modules:**
- `iching.py` - Main engine implementation
- `iching_models.py` - Data models and structures
- `divination.py` - Shared divination calculations

## References

- **Wilhelm/Baynes Translation**: The classic Western I-Ching translation
- **King Wen Sequence**: Traditional ordering of the 64 hexagrams
- **Fu Xi (Earlier Heaven) Arrangement**: Original trigram arrangement
- **Wen Wang (Later Heaven) Arrangement**: Applied trigram arrangement (Feng Shui)

## Contributing

When updating this documentation:

1. Maintain consistency across all four documents
2. Update code examples when API changes
3. Verify formulas match implementation
4. Test integration examples
5. Keep cross-references accurate

## Version History

- **2026-01**: Initial documentation extraction from WitnessOS
- Source: WitnessOS I-Ching Mutation Oracle Engine

---

**Related Systems:**
- [Tarot Engine Documentation](../tarot/README.md)
- [Human Design Engine Documentation](../human-design/README.md)
- [Gene Keys Engine Documentation](../gene-keys/README.md)

*For questions or corrections, refer to the main WitnessOS documentation.*
