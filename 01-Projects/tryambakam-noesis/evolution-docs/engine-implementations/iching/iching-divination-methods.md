# I-Ching Divination Methods

**Document Purpose:** Complete extraction of traditional and digital divination methods (coins, yarrow stalks, random) with probability distributions and algorithms

---

## Overview

The I-Ching supports three primary divination methods to generate hexagrams. Each method has different probability distributions that affect how often changing lines (Old Yin/Old Yang) appear.

**Core Principle:** The method of divination affects the probability of change, reflecting different depths of inquiry.

---

## Line Value System

Before diving into methods, understand the four possible line values:

| Value | Name | Type | Probability (Coins) | Probability (Yarrow) | Changes To |
|-------|------|------|---------------------|----------------------|------------|
| **6** | Old Yin | Yin (broken) | 12.5% | 6.25% | 7 (Young Yang) |
| **7** | Young Yang | Yang (solid) | 37.5% | 43.75% | (Stable) |
| **8** | Young Yin | Yin (broken) | 37.5% | 43.75% | (Stable) |
| **9** | Old Yang | Yang (solid) | 12.5% | 6.25% | 8 (Young Yin) |

**Key Concept:**
- **Young lines (7, 8):** Stable, not changing
- **Old lines (6, 9):** Changing lines, transform in mutation hexagram

---

## Method 1: Three Coins (三錢法)

### Traditional Practice

**Materials:** Three coins (traditionally Chinese coins with square holes)

**Designation:**
- **Heads (陽)** = 3 points
- **Tails (陰)** = 2 points

**Process:**
1. Focus on your question
2. Toss three coins
3. Add up the values
4. Record the line (repeat 6 times, bottom to top)

**Value Calculation:**
```
3 Heads (3+3+3) = 9 = Old Yang (changing)
2 Heads, 1 Tails (3+3+2) = 8 = Young Yin
1 Heads, 2 Tails (3+2+2) = 7 = Young Yang
3 Tails (2+2+2) = 6 = Old Yin (changing)
```

### Probability Distribution

| Outcome | Coins | Probability | Calculation |
|---------|-------|-------------|-------------|
| 6 (Old Yin) | TTT | 1/8 = 12.5% | (1/2)³ = 1/8 |
| 7 (Young Yang) | HTT, THT, TTH | 3/8 = 37.5% | 3 × (1/2)³ = 3/8 |
| 8 (Young Yin) | HHT, HTH, THH | 3/8 = 37.5% | 3 × (1/2)³ = 3/8 |
| 9 (Old Yang) | HHH | 1/8 = 12.5% | (1/2)³ = 1/8 |

**Total:** 8 possible outcomes (2³ combinations)

### Digital Implementation

```python
def generate_coin_toss_line() -> int:
    """Generate single line using three-coin method."""
    
    # Each coin: Heads=3, Tails=2
    coin1 = random.choice([2, 3])
    coin2 = random.choice([2, 3])
    coin3 = random.choice([2, 3])
    
    total = coin1 + coin2 + coin3
    
    # total can be: 6, 7, 8, or 9
    return total

def generate_hexagram_coins() -> List[int]:
    """Generate complete hexagram using coins."""
    return [generate_coin_toss_line() for _ in range(6)]
```

### Example Reading
```
Question: "What is the nature of my current situation?"

Toss 1 (Line 1): HTT = 3+2+2 = 7 (Young Yang)
Toss 2 (Line 2): HHT = 3+3+2 = 8 (Young Yin)
Toss 3 (Line 3): HHH = 3+3+3 = 9 (Old Yang) ← CHANGING
Toss 4 (Line 4): TTH = 2+2+3 = 7 (Young Yang)
Toss 5 (Line 5): TTT = 2+2+2 = 6 (Old Yin) ← CHANGING
Toss 6 (Line 6): HTH = 3+2+3 = 8 (Young Yin)

Result: [7, 8, 9, 7, 6, 8]
Changing lines at positions 3 and 5
```

---

## Method 2: Yarrow Stalks (蓍草法)

### Traditional Practice

**Materials:** 50 yarrow stalks (traditionally dried stems of Achillea millefolium)

**Process (Simplified):**
1. Remove 1 stalk (the "witness" - set aside)
2. Divide remaining 49 stalks into 2 random piles
3. Complex sorting process:
   - Take 1 from right pile, place aside
   - Count out left pile by 4s, remainder aside
   - Count out right pile by 4s, remainder aside
   - Sum remainders (will be 5 or 9)
4. Repeat 2 more times (3 rounds total per line)
5. Results determine line value

**Traditional Significance:**
- More meditative, takes 10-15 minutes per hexagram
- Considered more "sacred" or profound
- Physical manipulation creates contemplative space
- Different probability distribution reflects deeper inquiry

### Probability Distribution

| Outcome | Probability | Note |
|---------|-------------|------|
| 6 (Old Yin) | 1/16 = 6.25% | Half as likely as coins |
| 7 (Young Yang) | 7/16 = 43.75% | More stable |
| 8 (Young Yin) | 7/16 = 43.75% | More stable |
| 9 (Old Yang) | 1/16 = 6.25% | Half as likely as coins |

**Key Difference:** Yarrow method produces fewer changing lines, suggesting more stable situations or requiring deeper change to manifest.

### Digital Simulation

```python
def generate_yarrow_stalk_line() -> int:
    """Simulate yarrow stalk method with correct probabilities."""
    
    # Weighted random selection matching traditional probabilities
    outcomes = [6, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 9]
    return random.choice(outcomes)
    
    # Or using probability weights:
    # return random.choices(
    #     population=[6, 7, 8, 9],
    #     weights=[0.0625, 0.4375, 0.4375, 0.0625],
    #     k=1
    # )[0]

def generate_hexagram_yarrow() -> List[int]:
    """Generate complete hexagram using yarrow method."""
    return [generate_yarrow_stalk_line() for _ in range(6)]
```

### Detailed Yarrow Stalk Algorithm (Traditional)

For those interested in the complete traditional process:

```python
def traditional_yarrow_stalk_line() -> int:
    """Full traditional yarrow stalk process for one line."""
    
    stalks = 49  # Start with 49 (50 minus the witness)
    remainders_sum = 0
    
    for round in range(3):  # Three rounds per line
        # Divide into two piles randomly
        left_pile = random.randint(1, stalks - 1)
        right_pile = stalks - left_pile
        
        # Take 1 from right pile
        right_pile -= 1
        
        # Count by 4s, keep remainders
        left_remainder = left_pile % 4 if left_pile % 4 != 0 else 4
        right_remainder = right_pile % 4 if right_pile % 4 != 0 else 4
        
        # Sum remainders plus the 1 taken (always 5 or 9)
        round_total = 1 + left_remainder + right_remainder
        
        # Remove these from next round
        stalks -= round_total
    
    # Final stalk count determines line value
    if stalks == 24:
        return 9  # Old Yang
    elif stalks == 28:
        return 8  # Young Yin
    elif stalks == 32:
        return 7  # Young Yang
    elif stalks == 36:
        return 6  # Old Yin
    else:
        # Shouldn't happen, but default to Young Yang
        return 7
```

---

## Method 3: Random Digital

### Modern Approach

**Purpose:** 
- Quick readings for modern digital contexts
- No physical materials needed
- Instant results
- Can mimic either coins or yarrow probabilities

### Implementation Options

**Option A: Mimic Coin Method (Default)**
```python
def generate_random_line_coins_style() -> int:
    """Random generation matching coin probabilities."""
    return random.choices(
        population=[6, 7, 8, 9],
        weights=[0.125, 0.375, 0.375, 0.125],
        k=1
    )[0]
```

**Option B: Mimic Yarrow Method**
```python
def generate_random_line_yarrow_style() -> int:
    """Random generation matching yarrow probabilities."""
    return random.choices(
        population=[6, 7, 8, 9],
        weights=[0.0625, 0.4375, 0.4375, 0.0625],
        k=1
    )[0]
```

**Option C: Equal Distribution (Modern)**
```python
def generate_random_line_equal() -> int:
    """Equal probability for all four outcomes."""
    return random.choice([6, 7, 8, 9])
```

### WitnessOS Implementation

The WitnessOS implementation uses the **DivinationCalculator** utility:

```python
class DivinationCalculator:
    def generate_hexagram_lines(self, method: str) -> List[int]:
        """Generate 6 lines using specified method."""
        
        if method == "coins":
            return self._generate_coins()
        elif method == "yarrow":
            return self._generate_yarrow()
        elif method == "random":
            return self._generate_random()
        else:
            # Default to coins
            return self._generate_coins()
    
    def _generate_coins(self) -> List[int]:
        """Three coins method with 12.5% changing."""
        return [self._coin_line() for _ in range(6)]
    
    def _generate_yarrow(self) -> List[int]:
        """Yarrow stalks method with 6.25% changing."""
        return [self._yarrow_line() for _ in range(6)]
    
    def _generate_random(self) -> List[int]:
        """Random method (usually mimics coins)."""
        return [self._random_line() for _ in range(6)]
```

---

## Question-Based Seeding (Reproducibility)

### Purpose
Allow same question to generate same hexagram for consistency

### Implementation

```python
def create_question_seed(question: str) -> int:
    """Create consistent seed from question text."""
    
    # Hash the question to get consistent seed
    hash_value = hash(question)
    
    # Convert to positive integer
    seed = abs(hash_value) % (2**31)
    
    return seed

def generate_hexagram_with_question(question: str, method: str) -> List[int]:
    """Generate hexagram using question-based seed."""
    
    # Create seed from question
    seed = create_question_seed(question)
    
    # Create temporary calculator with seed
    temp_calc = DivinationCalculator(seed)
    
    # Generate lines
    return temp_calc.generate_hexagram_lines(method)
```

**Example:**
```python
# First time asking
question = "What is my life's purpose?"
hexagram1 = generate_hexagram_with_question(question, "coins")
# Result: [7, 8, 9, 7, 6, 8]

# Asking same question later
hexagram2 = generate_hexagram_with_question(question, "coins")
# Result: [7, 8, 9, 7, 6, 8] ← SAME!

# Different question
question2 = "What is my life purpose?"  # Slightly different
hexagram3 = generate_hexagram_with_question(question2, "coins")
# Result: [8, 7, 7, 9, 8, 7] ← DIFFERENT!
```

**Benefit:** User can revisit reading by asking exact same question

---

## Comparison of Methods

| Aspect | Coins | Yarrow | Random |
|--------|-------|--------|--------|
| **Time** | 1-2 min | 10-15 min | Instant |
| **Materials** | 3 coins | 50 stalks | None |
| **Changing Lines** | 12.5% each | 6.25% each | Configurable |
| **Tradition** | High | Highest | Low |
| **Meditation** | Moderate | Deep | None |
| **Accessibility** | Easy | Difficult | Easiest |
| **Repeatability** | No | No | Yes (with seed) |

---

## Changing Line Frequency Impact

### High Change Rate (Coins: 12.5%)
- More dynamic readings
- Change is emphasized
- Average: 0-2 changing lines per hexagram
- Reflects active, changing situations

### Low Change Rate (Yarrow: 6.25%)
- More stable readings
- Change is rarer, more significant when it occurs
- Average: 0-1 changing lines per hexagram
- Reflects deeper, slower transformations

### Statistical Expectations

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

## Traditional vs Modern Interpretation

### Traditional View
- **Method matters:** Different methods for different questions
- **Yarrow for life questions:** Deep, significant inquiries
- **Coins for daily questions:** Practical, everyday guidance
- **Ritual creates space:** Physical act opens intuitive channel

### Modern View
- **Method is preference:** Choose what resonates
- **Randomness is oracle:** The Universe speaks through chance
- **Digital is valid:** Consciousness can work through any medium
- **Intention matters most:** Sincerity over technique

---

## WitnessOS Method Selection Logic

```python
class IChingInput(QuestionInput):
    """Input model for I-Ching Mutation Oracle."""
    
    method: Literal["coins", "yarrow", "random"] = Field(
        default="coins",
        description="Divination method to use"
    )
```

**User Selection:**
- User chooses method explicitly
- Default: "coins" (balanced, traditional, accessible)
- Engine respects user's choice
- No "better" method - each valid

---

## Implementation in Engine

### From Core Architecture

```python
def _generate_hexagram_lines(self, method: str, question: str = "") -> List[int]:
    """Generate six lines for a hexagram using the specified method."""
    
    if question:
        # Use question-based seeding for reproducible results
        seed = self.divination_calc.create_question_seed(question)
        temp_calc = DivinationCalculator(seed)
        return temp_calc.generate_hexagram_lines(method)
    else:
        # Use truly random generation
        return self.divination_calc.generate_hexagram_lines(method)
```

**Process:**
1. User provides method ("coins", "yarrow", or "random")
2. User provides optional question
3. If question exists, create seed from it
4. Generate 6 lines using method and seed
5. Return line values [6-9] × 6

---

## Advanced: Custom Probability Distributions

### Creating Custom Method

Want different probabilities? Easy to extend:

```python
"custom_method": {
    "name": "Balanced Method",
    "description": "Equal probability for all outcomes",
    "probabilities": {
        "6": 0.25,  # 25% Old Yin
        "7": 0.25,  # 25% Young Yang
        "8": 0.25,  # 25% Young Yin
        "9": 0.25   # 25% Old Yang
    }
}
```

### High-Change Method
For situations requiring maximum transformation visibility:
```python
"high_change": {
    "name": "High Change Method",
    "probabilities": {
        "6": 0.3,   # 30% Old Yin
        "7": 0.2,   # 20% Young Yang
        "8": 0.2,   # 20% Young Yin
        "9": 0.3    # 30% Old Yang
    }
}
```

---

## Summary

### Three Methods, Same Oracle
- **Coins:** Balanced, traditional, accessible (12.5% change)
- **Yarrow:** Deep, meditative, rare (6.25% change)
- **Random:** Instant, digital, flexible (configurable)

### Key Implementation Points
1. Respect probability distributions
2. Support question-based seeding
3. Generate 6 lines bottom-to-top
4. Return values 6, 7, 8, or 9
5. Let user choose method

### Consciousness Perspective
The method is less important than the **sincerity of inquiry**. The I-Ching responds to genuine questions, not mechanical perfection.

---

**Next:** See `iching-changing-lines.md` for transformation logic (6→7, 9→8) and mutation hexagram generation
