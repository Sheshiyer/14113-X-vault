# I-Ching Quick Reference

**Purpose:** Fast lookup tables, formulas, and essential mappings for I-Ching implementation

---

## Line Value System

| Value | Name | Symbol | Type | Changing? | Transforms To |
|-------|------|--------|------|-----------|---------------|
| 6 | Old Yin | ⚋⚋ | Yin | Yes | 7 (Young Yang) |
| 7 | Young Yang | ⚊ | Yang | No | - |
| 8 | Young Yin | ⚋ | Yin | No | - |
| 9 | Old Yang | ⚊ | Yang | Yes | 8 (Young Yin) |

---

## 8 Trigrams Quick Reference

| Name | Chinese | Binary | Element | Attribute | Family | Direction | Season |
|------|---------|--------|---------|-----------|--------|-----------|--------|
| Heaven | 乾 (Qián) | 111 | Metal | Strong | Father | NW | Late Autumn |
| Earth | 坤 (Kūn) | 000 | Earth | Yielding | Mother | SW | Late Summer |
| Thunder | 震 (Zhèn) | 001 | Wood | Arousing | Eldest Son | E | Spring |
| Water | 坎 (Kǎn) | 010 | Water | Dangerous | Middle Son | N | Winter |
| Mountain | 艮 (Gèn) | 100 | Earth | Still | Youngest Son | NE | Late Winter |
| Wind | 巽 (Xùn) | 011 | Wood | Gentle | Eldest Daughter | SE | Early Summer |
| Fire | 離 (Lí) | 101 | Fire | Clinging | Middle Daughter | S | Summer |
| Lake | 兌 (Duì) | 110 | Metal | Joyous | Youngest Daughter | W | Autumn |

---

## Divination Method Probabilities

### Coins Method (3 Coins)
| Outcome | Coins | Probability | Formula |
|---------|-------|-------------|---------|
| 6 (Old Yin) | TTT | 12.5% | 1/8 |
| 7 (Young Yang) | HTT, THT, TTH | 37.5% | 3/8 |
| 8 (Young Yin) | HHT, HTH, THH | 37.5% | 3/8 |
| 9 (Old Yang) | HHH | 12.5% | 1/8 |

**Coin Values:** Heads = 3, Tails = 2

### Yarrow Method (50 Stalks)
| Outcome | Probability |
|---------|-------------|
| 6 (Old Yin) | 6.25% (1/16) |
| 7 (Young Yang) | 43.75% (7/16) |
| 8 (Young Yin) | 43.75% (7/16) |
| 9 (Old Yang) | 6.25% (1/16) |

---

## Key Formulas

### Line Type Determination
```python
line_type = "yang" if line_value % 2 == 1 else "yin"
```

### Changing Line Detection
```python
is_changing = line_value in [6, 9]
```

### Mutation Transformation
```python
if line_value == 6:  # Old Yin
    new_value = 7     # Young Yang
elif line_value == 9:  # Old Yang
    new_value = 8     # Young Yin
else:
    new_value = line_value  # No change
```

### Binary to Hexagram Number (Simplified)
```python
# Convert lines to binary
binary_lines = [1 if line % 2 == 1 else 0 for line in lines]

# Create binary string (reversed)
binary_string = ''.join(str(bit) for bit in reversed(binary_lines))

# Convert to decimal
decimal = int(binary_string, 2)

# Map to hexagram (1-64)
hexagram_number = (decimal % 64) + 1
```

### Question Seed Generation
```python
seed = abs(hash(question)) % (2**31)
```

---

## Essential Hexagrams (Sample)

| # | Name | Chinese | Trigrams | Keywords |
|---|------|---------|----------|----------|
| 1 | The Creative | 乾 (Qián) | Heaven/Heaven | Creativity, strength, leadership |
| 2 | The Receptive | 坤 (Kūn) | Earth/Earth | Receptivity, yielding, nurturing |
| 11 | Peace | 泰 (Tài) | Earth/Heaven | Harmony, balance, unity |
| 12 | Standstill | 否 (Pǐ) | Heaven/Earth | Stagnation, separation, blockage |
| 63 | After Completion | 既濟 (Jì Jì) | Water/Fire | Success, vigilance, completion |
| 64 | Before Completion | 未濟 (Wèi Jì) | Fire/Water | Nearly complete, careful progress |

---

## Trigram Combinations

### Upper Trigram = Outer World
- Shows external conditions
- What others see
- Manifest reality
- Environmental influence

### Lower Trigram = Inner World
- Shows internal state
- Personal foundation
- Hidden dynamics
- Self-condition

---

## Five Element Interactions

### Generating Cycle (Productive)
```
Wood → Fire → Earth → Metal → Water → Wood (循環)
```

### Controlling Cycle (Restraining)
```
Wood → Earth → Water → Fire → Metal → Wood (克制)
```

---

## Changing Line Priority

When interpreting multiple changing lines:

| Changing Lines | Interpretation Focus |
|----------------|---------------------|
| 6 lines | Use judgment of opposite hexagram |
| 5 lines | Focus on the non-changing line |
| 4 lines | Focus on upper non-changing line |
| 3 lines | Use both primary and mutation |
| 2 lines | Focus on upper changing line |
| 1 line | Use that line's specific text |

---

## Line Positions (Bottom to Top)

| Position | Traditional Meaning | Modern Context |
|----------|-------------------|----------------|
| Line 1 | Beginning, foundation | Starting point, roots |
| Line 2 | Inner activity | Personal action, early development |
| Line 3 | Transition point | Moving from inner to outer |
| Line 4 | Outer activity | Public sphere, career |
| Line 5 | Authority, ruler | Leadership, pinnacle |
| Line 6 | Culmination, excess | Completion, going too far |

---

## Gene Keys Correspondence

| I-Ching Hex # | Gene Key # | Human Design Gate # |
|---------------|------------|---------------------|
| 1 | 1 | 1 |
| 2 | 2 | 2 |
| ... | ... | ... |
| 64 | 64 | 64 |

**Direct 1:1 mapping** across all three systems.

---

## Common Patterns

### Pure Yang/Yin
- **Hexagram 1 (Heaven/Heaven):** Pure yang, maximum creativity
- **Hexagram 2 (Earth/Earth):** Pure yin, maximum receptivity

### Complementary Pairs
- **11 (Peace) ↔ 12 (Standstill):** Same trigrams, inverted
- **63 (After Completion) ↔ 64 (Before Completion):** Fire/Water inverted

### Nuclear Hexagrams
- Lines 2-3-4 form lower nuclear trigram
- Lines 3-4-5 form upper nuclear trigram
- Reveal hidden dynamics

---

## Implementation Checklist

### Data Loading
- [ ] Load hexagrams.json (64 hexagrams)
- [ ] Parse trigram data (8 trigrams)
- [ ] Load method probabilities
- [ ] Validate data structure

### Line Generation
- [ ] Implement coin method (12.5%)
- [ ] Implement yarrow method (6.25%)
- [ ] Implement random method
- [ ] Support question-based seeding

### Hexagram Lookup
- [ ] Binary to hexagram number conversion
- [ ] Hexagram number to data lookup
- [ ] Fallback handling (missing data)
- [ ] Trigram extraction

### Changing Lines
- [ ] Detect changing lines (6, 9)
- [ ] Extract line-specific interpretations
- [ ] Transform lines (6→7, 9→8)
- [ ] Generate mutation hexagram

### Interpretation
- [ ] Primary hexagram interpretation
- [ ] Changing line interpretation
- [ ] Mutation hexagram interpretation
- [ ] Overall guidance generation

### Output
- [ ] Human-readable format
- [ ] JSON structure
- [ ] Recommendations list
- [ ] Field resonance calculation

---

## API Quick Reference

### Input Structure
```python
{
    "question": "What is my path?",
    "method": "coins",  # or "yarrow", "random"
    "focus_area": "career",  # optional
    "include_changing_lines": true
}
```

### Output Structure
```python
{
    "engine_name": "I-Ching Mutation Oracle",
    "formatted_output": "☯️ I-Ching Reading...",
    "raw_data": {
        "reading": {
            "primary_hexagram": {...},
            "mutation_hexagram": {...},
            "changing_lines": [2, 5],
            "method_used": "coins"
        },
        "key_insights": [...],
        "guidance_summary": "...",
        "trigram_elements": ["Metal", "Earth"]
    },
    "recommendations": [...]
}
```

---

## Probability Distributions

### Expected Changing Lines per Reading

**Coins Method:**
- 0 changing lines: ~39%
- 1 changing line: ~40%
- 2 changing lines: ~17%
- 3+ changing lines: ~4%

**Yarrow Method:**
- 0 changing lines: ~70%
- 1 changing line: ~26%
- 2+ changing lines: ~4%

---

## Validation Rules

### Hexagram Number
```python
1 <= hexagram_number <= 64
```

### Line Position
```python
1 <= position <= 6
```

### Line Value
```python
value in [6, 7, 8, 9]
```

### Binary String
```python
len(binary) == 6
all(c in '01' for c in binary)
```

### Method
```python
method in ["coins", "yarrow", "random"]
```

---

## Unicode Symbols

### Trigram Symbols
- Heaven: ☰
- Earth: ☷
- Thunder: ☳
- Water: ☵
- Mountain: ☶
- Wind: ☴
- Fire: ☲
- Lake: ☱

### Line Symbols
- Yang line: ⚊ (solid)
- Yin line: ⚋ (broken)
- Old Yang: ⚊ (changing)
- Old Yin: ⚋⚋ (changing)

### Other Symbols
- Yin-Yang: ☯
- Taiji: ☯️

---

## File Paths (Source)

```
/WitnessOS/docs/engines/
├── iching.py (284 lines)
├── iching_models.py (123 lines)
└── data/iching/
    ├── hexagrams.json (1905 lines)
    └── hexagrams_complete.json (extended)
```

---

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Hexagram not found | Invalid number | Wrap to 1-64 range or fallback to 1 |
| Missing changing line text | Incomplete data | Provide generic transformation text |
| Invalid method | Typo in method name | Validate against ["coins", "yarrow", "random"] |
| No mutation when expected | Logic error | Check if changing_lines list is empty |

---

## Performance Targets

| Operation | Target Time |
|-----------|-------------|
| Line generation | < 1ms |
| Hexagram lookup | < 1ms |
| Interpretation | < 10ms |
| Total reading | < 50ms |

---

## Memory Usage

| Component | Size |
|-----------|------|
| Hexagram data | ~2MB |
| Per reading | ~10KB |
| Engine instance | ~2.5MB |

---

## Testing Checklist

- [ ] Generate 1000 readings, verify all hexagram numbers 1-64
- [ ] Verify probability distributions match expected values
- [ ] Test changing line detection accuracy
- [ ] Test mutation hexagram generation correctness
- [ ] Verify same question generates same hexagram
- [ ] Test all three methods (coins, yarrow, random)
- [ ] Verify graceful handling of missing data
- [ ] Test interpretation output formatting
- [ ] Verify JSON serialization/deserialization
- [ ] Test edge cases (all changing, no changing)

---

## Integration Points

### With Gene Keys
```python
gene_key_number = iching_hexagram_number  # Direct 1:1
```

### With Human Design
```python
hd_gate_number = iching_hexagram_number  # Direct 1:1
```

### With Tarot
```python
# No direct mapping - both are divination systems
# Can use archetypal resonance for correlation
```

---

## Summary

This quick reference provides:
- ✅ Essential lookup tables
- ✅ Core formulas
- ✅ Probability distributions
- ✅ Validation rules
- ✅ Implementation checklist
- ✅ API structures
- ✅ Common patterns
- ✅ Error handling
- ✅ Performance targets

Use as a rapid reference during implementation and debugging.

---

**Related:** See full documentation files for detailed explanations and algorithms
