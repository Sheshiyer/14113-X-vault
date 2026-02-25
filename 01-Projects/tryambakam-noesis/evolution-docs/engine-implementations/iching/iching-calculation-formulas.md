# I-Ching Calculation Formulas

## Hexagram Generation Methods

### 1. Coin Method (Three-Coin Toss)

The coin method involves tossing three coins six times to generate a hexagram.

#### Line Value Calculation

Each line is determined by the sum of three coin tosses:
- **Heads = 3 points**
- **Tails = 2 points**

**Line Values:**
- **6 (Old Yin)**: 0 heads, 3 tails = 2+2+2 = 6 → Changing line (Yin → Yang)
- **7 (Young Yang)**: 2 heads, 1 tail = 3+3+2 = 8 → Static Yang line  
- **8 (Young Yin)**: 1 head, 2 tails = 3+2+2 = 7 → Static Yin line
- **9 (Old Yang)**: 3 heads, 0 tails = 3+3+3 = 9 → Changing line (Yang → Yin)

#### Implementation Formula

```python
def coin_toss_line() -> int:
    tosses = [random.choice([True, False]) for _ in range(3)]  # True = heads
    heads_count = sum(tosses)
    
    if heads_count == 0:
        return 6  # Old Yin (changing)
    elif heads_count == 1:
        return 8  # Young Yin
    elif heads_count == 2:
        return 7  # Young Yang
    else:  # heads_count == 3
        return 9  # Old Yang (changing)
```

### 2. Yarrow Stalk Method

Traditional method using 50 yarrow stalks with weighted probabilities.

#### Probability Distribution

- **Old Yin (6)**: 1/16 probability (6.25%)
- **Young Yang (7)**: 5/16 probability (31.25%)
- **Young Yin (8)**: 7/16 probability (43.75%)
- **Old Yang (9)**: 3/16 probability (18.75%)

#### Implementation Formula

```python
def yarrow_stalk_method() -> int:
    probabilities = {
        6: 1,   # Old Yin (changing)
        7: 5,   # Young Yang
        8: 7,   # Young Yin  
        9: 3    # Old Yang (changing)
    }
    
    # Create weighted list
    weighted_options = []
    for value, weight in probabilities.items():
        weighted_options.extend([value] * weight)
    
    return random.choice(weighted_options)
```

### 3. Random Method

Equal probability for all line values (simplified modern method).

```python
def random_method() -> int:
    return random.choice([6, 7, 8, 9])
```

## Hexagram Number Calculation

### Binary to Hexagram Conversion

Convert six line values to a hexagram number (1-64).

#### Formula

```python
def lines_to_hexagram_number(lines: List[int]) -> int:
    """
    Convert line values to hexagram number using binary representation.
    
    Args:
        lines: List of 6 line values (position 1 = bottom, position 6 = top)
    
    Returns:
        Hexagram number (1-64)
    """
    # Convert lines to binary (odd = Yang = 1, even = Yin = 0)
    binary_lines = [1 if line % 2 == 1 else 0 for line in lines]
    
    # Create binary string (reverse for standard binary ordering)
    binary_string = ''.join(str(bit) for bit in reversed(binary_lines))
    
    # Convert to decimal
    decimal_value = int(binary_string, 2)
    
    # Map to King Wen sequence (1-64)
    # Simplified: (decimal_value % 64) + 1
    # Full implementation uses King Wen lookup table
    return (decimal_value % 64) + 1
```

### King Wen Sequence Mapping

The traditional King Wen sequence orders the 64 hexagrams in a specific philosophical arrangement. Full implementation requires a lookup table mapping binary values to King Wen numbers.

**Example Mappings:**
- Binary 111111 (63) → Hexagram #1 (☰☰ Heaven/Heaven - The Creative)
- Binary 000000 (0) → Hexagram #2 (☷☷ Earth/Earth - The Receptive)
- Binary 010001 → Hexagram #3 (☵☳ Water/Thunder - Difficulty at Beginning)

## Changing Lines Logic

### Identification

Changing lines occur when line values are 6 (Old Yin) or 9 (Old Yang).

```python
def get_changing_lines(lines: List[int]) -> List[int]:
    """
    Identify positions of changing lines.
    
    Returns:
        List of positions (1-6, bottom to top) that are changing
    """
    changing = []
    for i, line in enumerate(lines):
        if line in [6, 9]:  # Old Yin or Old Yang
            changing.append(i + 1)  # 1-based indexing
    
    return changing
```

### Mutation Hexagram Calculation

When changing lines exist, they transform into their opposite to create the mutation hexagram.

```python
def create_mutation_hexagram(original_lines: List[int]) -> List[int]:
    """
    Transform changing lines to create mutation hexagram.
    
    Transformation rules:
    - Old Yin (6) → Young Yang (7)
    - Old Yang (9) → Young Yin (8)
    - Young lines remain unchanged
    """
    mutated = original_lines.copy()
    
    for i, line in enumerate(mutated):
        if line == 6:  # Old Yin becomes Young Yang
            mutated[i] = 7
        elif line == 9:  # Old Yang becomes Young Yin
            mutated[i] = 8
    
    return mutated
```

## Nuclear Hexagrams

Nuclear hexagrams are derived from the inner lines of the primary hexagram.

### Lower Nuclear Hexagram

Formed from lines 2, 3, 4 (bottom to top becomes lines 1, 2, 3).

```python
def get_lower_nuclear(lines: List[int]) -> List[int]:
    """
    Extract lower nuclear trigram and extend to hexagram.
    
    Lines 2, 3, 4 of original become a trigram,
    then doubled to form hexagram.
    """
    inner_lines = lines[1:4]  # Lines 2, 3, 4 (0-indexed: 1, 2, 3)
    return inner_lines + inner_lines  # Double the trigram
```

### Upper Nuclear Hexagram

Formed from lines 3, 4, 5 (bottom to top becomes lines 1, 2, 3).

```python
def get_upper_nuclear(lines: List[int]) -> List[int]:
    """
    Extract upper nuclear trigram and extend to hexagram.
    
    Lines 3, 4, 5 of original become a trigram,
    then doubled to form hexagram.
    """
    inner_lines = lines[2:5]  # Lines 3, 4, 5 (0-indexed: 2, 3, 4)
    return inner_lines + inner_lines  # Double the trigram
```

## Trigram Relationships

### Trigram Structure

Each hexagram consists of two trigrams (3 lines each):
- **Upper Trigram**: Lines 4, 5, 6
- **Lower Trigram**: Lines 1, 2, 3

```python
def extract_trigrams(lines: List[int]) -> tuple:
    """
    Extract lower and upper trigrams from hexagram.
    
    Returns:
        (lower_trigram, upper_trigram) as line lists
    """
    lower = lines[0:3]  # Lines 1, 2, 3
    upper = lines[3:6]  # Lines 4, 5, 6
    
    return (lower, upper)
```

### Trigram Identification

```python
def identify_trigram(lines: List[int]) -> str:
    """
    Identify trigram name from three lines.
    
    Trigram mappings:
    - 111 (☰): Heaven/Qian - Creative
    - 000 (☷): Earth/Kun - Receptive
    - 001 (☳): Thunder/Zhen - Arousing
    - 010 (☵): Water/Kan - Abysmal
    - 100 (☶): Mountain/Gen - Keeping Still
    - 011 (☴): Wind/Xun - Gentle
    - 101 (☲): Fire/Li - Clinging
    - 110 (☱): Lake/Dui - Joyous
    """
    binary = [1 if line % 2 == 1 else 0 for line in lines]
    trigram_map = {
        (1,1,1): "Heaven",
        (0,0,0): "Earth",
        (0,0,1): "Thunder",
        (0,1,0): "Water",
        (1,0,0): "Mountain",
        (0,1,1): "Wind",
        (1,0,1): "Fire",
        (1,1,0): "Lake"
    }
    
    return trigram_map.get(tuple(binary), "Unknown")
```

## Question-Based Seeding

For reproducible readings based on question content.

```python
def create_question_seed(question: str, timestamp: datetime) -> int:
    """
    Create deterministic seed from question and timestamp.
    
    Allows for mystical reproducibility: same question at same time
    yields same hexagram.
    """
    import hashlib
    
    # Normalize question
    normalized = question.strip().lower()
    
    # Combine with timestamp
    seed_string = f"{normalized}_{timestamp.isoformat()}"
    
    # Create hash and convert to integer
    hash_object = hashlib.md5(seed_string.encode())
    return int(hash_object.hexdigest()[:8], 16)
```

## Line Position Meanings

Line positions have specific meanings in interpretation:

1. **Line 1 (Bottom)**: Initial situation, foundation
2. **Line 2**: Inner development, personal response  
3. **Line 3**: Transition point, threshold
4. **Line 4**: Outer development, external matters
5. **Line 5**: Ruling line, position of authority
6. **Line 6 (Top)**: Ultimate result, culmination

## Complete Reading Algorithm

```python
def generate_iching_reading(question: str, method: str = "coins") -> dict:
    """
    Complete I-Ching reading generation.
    
    Args:
        question: Divination question
        method: "coins", "yarrow", or "random"
    
    Returns:
        Dictionary with hexagrams, changing lines, and metadata
    """
    # 1. Generate six lines
    lines = []
    for _ in range(6):
        if method == "coins":
            line = coin_toss_line()
        elif method == "yarrow":
            line = yarrow_stalk_method()
        else:
            line = random_method()
        lines.append(line)
    
    # 2. Convert to hexagram number
    primary_number = lines_to_hexagram_number(lines)
    
    # 3. Identify changing lines
    changing_lines = get_changing_lines(lines)
    
    # 4. Generate mutation hexagram if needed
    mutation_lines = None
    mutation_number = None
    if changing_lines:
        mutation_lines = create_mutation_hexagram(lines)
        mutation_number = lines_to_hexagram_number(mutation_lines)
    
    # 5. Extract trigrams
    lower_trigram, upper_trigram = extract_trigrams(lines)
    
    return {
        "primary_hexagram": primary_number,
        "primary_lines": lines,
        "changing_lines": changing_lines,
        "mutation_hexagram": mutation_number,
        "mutation_lines": mutation_lines,
        "lower_trigram": identify_trigram(lower_trigram),
        "upper_trigram": identify_trigram(upper_trigram),
        "method_used": method
    }
```

## Mathematical Properties

### Hexagram Symmetries

- **Inverse Hexagram**: All lines reversed (Yin↔Yang)
- **Opposite Hexagram**: Hexagram turned upside down
- **Nuclear Hexagrams**: Hidden inner structure

### Probability Analysis

**Coin Method Probabilities:**
- Changing lines (6 or 9): 25% per line
- Static lines (7 or 8): 75% per line
- At least one changing line per hexagram: ~82%

**Yarrow Method Probabilities:**
- Changing lines (6 or 9): ~25% per line (weighted differently)
- Emphasizes stability with higher Young Yin probability

---

*Last Updated: 2026*  
*Source: WitnessOS I-Ching Mutation Oracle Engine*
