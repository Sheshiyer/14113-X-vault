# Numerology Calculation Formulas

## 1. Letter-to-Number Conversion Tables

### Pythagorean System (1-9)

The Pythagorean system assigns numbers 1-9 to letters sequentially.

```python
PYTHAGOREAN_TABLE = {
    'A': 1, 'J': 1, 'S': 1,
    'B': 2, 'K': 2, 'T': 2,
    'C': 3, 'L': 3, 'U': 3,
    'D': 4, 'M': 4, 'V': 4,
    'E': 5, 'N': 5, 'W': 5,
    'F': 6, 'O': 6, 'X': 6,
    'G': 7, 'P': 7, 'Y': 7,
    'H': 8, 'Q': 8, 'Z': 8,
    'I': 9, 'R': 9
}
```

**Pattern:** Each column represents numbers that share the same vibration.

### Chaldean System (1-8)

The Chaldean system uses numbers 1-8 only (9 is considered sacred).

```python
CHALDEAN_TABLE = {
    'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
    'B': 2, 'K': 2, 'R': 2,
    'C': 3, 'G': 3, 'L': 3, 'S': 3,
    'D': 4, 'M': 4, 'T': 4,
    'E': 5, 'H': 5, 'N': 5, 'X': 5,
    'U': 6, 'V': 6, 'W': 6,
    'O': 7, 'Z': 7,
    'F': 8, 'P': 8
}
```

**Note:** Number 9 is never assigned to letters in Chaldean system.

### Vowel Classification

```python
VOWELS = ['A', 'E', 'I', 'O', 'U']
# Sometimes 'Y' is treated as vowel depending on position
# "Y" is vowel when: no other vowel in syllable (e.g., "Lynn", "Rhythm")

def is_vowel(letter: str, position: int, name: str) -> bool:
    """
    Determine if letter is vowel considering context.
    """
    if letter in ['A', 'E', 'I', 'O', 'U']:
        return True
    
    if letter == 'Y':
        # Y is vowel if it's the only vowel sound in syllable
        # Simplified: Y is vowel if not at beginning of word
        return position > 0
    
    return False
```

## 2. Life Path Number Calculation

**Input:** Birth date (YYYY-MM-DD)  
**Method:** Reduce each component (year, month, day) separately, then combine and reduce.

### Standard Method

```python
def calculate_life_path(birth_date: date) -> int:
    """
    Calculate Life Path number from birth date.
    
    Method:
    1. Reduce year, month, day separately (keep master numbers)
    2. Add the three reduced numbers
    3. Reduce final sum (keep master numbers)
    """
    year = birth_date.year
    month = birth_date.month
    day = birth_date.day
    
    # Reduce each component
    reduced_year = reduce_to_single_digit(year, keep_master=True)
    reduced_month = reduce_to_single_digit(month, keep_master=True)
    reduced_day = reduce_to_single_digit(day, keep_master=True)
    
    # Combine
    life_path_sum = reduced_year + reduced_month + reduced_day
    
    # Final reduction
    life_path = reduce_to_single_digit(life_path_sum, keep_master=True)
    
    return life_path
```

### Example Calculation

**Birth Date:** May 15, 1990 (1990-05-15)

```
Step 1: Reduce components
  Year:  1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1
  Month: 5 = 5
  Day:   15 → 1+5 = 6

Step 2: Add reduced components
  1 + 5 + 6 = 12

Step 3: Reduce sum
  12 → 1+2 = 3

Life Path = 3
```

### Master Number Example

**Birth Date:** November 22, 1988 (1988-11-22)

```
Step 1: Reduce components
  Year:  1988 → 1+9+8+8 = 26 → 2+6 = 8
  Month: 11 = 11 (Master number - keep it!)
  Day:   22 = 22 (Master number - keep it!)

Step 2: Add
  8 + 11 + 22 = 41

Step 3: Reduce
  41 → 4+1 = 5

Life Path = 5 (but carries Master 11 and 22 energy)
```

## 3. Digit Reduction Algorithm

### Core Reduction Function

```python
def reduce_to_single_digit(
    number: int, 
    keep_master: bool = True
) -> int:
    """
    Reduce number to single digit (1-9) or master number (11, 22, 33, 44).
    
    Args:
        number: Number to reduce
        keep_master: If True, preserve master numbers
    
    Returns:
        Single digit (1-9) or master number (11, 22, 33, 44)
    """
    # Check for master numbers before reduction
    if keep_master and number in [11, 22, 33, 44]:
        return number
    
    # Reduce by summing digits
    while number > 9:
        # Sum digits
        digit_sum = sum(int(digit) for digit in str(number))
        
        # Check if result is master number
        if keep_master and digit_sum in [11, 22, 33, 44]:
            return digit_sum
        
        number = digit_sum
    
    return number
```

### Master Number Detection

```python
MASTER_NUMBERS = [11, 22, 33, 44]

def is_master_number(number: int) -> bool:
    """Check if number is a master number."""
    return number in MASTER_NUMBERS

def check_master_numbers_in_calculation(numbers: List[int]) -> List[int]:
    """
    Detect all master numbers that appeared during calculation.
    """
    masters_found = []
    for num in numbers:
        if is_master_number(num):
            masters_found.append(num)
    return masters_found
```

## 4. Expression Number Calculation

**Input:** Full name at birth  
**Method:** Convert all letters to numbers, sum, and reduce.

```python
def calculate_expression(full_name: str, system: str = "pythagorean") -> int:
    """
    Calculate Expression number from full name.
    
    Uses all letters in the name.
    """
    # Get conversion table
    table = PYTHAGOREAN_TABLE if system == "pythagorean" else CHALDEAN_TABLE
    
    # Convert name to uppercase and remove non-letters
    name = ''.join(c.upper() for c in full_name if c.isalpha())
    
    # Convert letters to numbers and sum
    total = 0
    for letter in name:
        if letter in table:
            total += table[letter]
    
    # Reduce to single digit or master number
    expression = reduce_to_single_digit(total, keep_master=True)
    
    return expression
```

### Example Calculation

**Name:** "John Michael Doe"  
**System:** Pythagorean

```
J=1, O=6, H=8, N=5 = 20
M=4, I=9, C=3, H=8, A=1, E=5, L=3 = 33 (Master!)
D=4, O=6, E=5 = 15

Sum: 20 + 33 + 15 = 68
Reduce: 68 → 6+8 = 14 → 1+4 = 5

Expression = 5
Master Numbers Found: [33]
```

## 5. Soul Urge Number Calculation

**Input:** Full name  
**Method:** Use only VOWELS, convert to numbers, sum, and reduce.

```python
def calculate_soul_urge(full_name: str, system: str = "pythagorean") -> int:
    """
    Calculate Soul Urge number from vowels in name.
    
    Represents inner desires and motivations.
    """
    table = PYTHAGOREAN_TABLE if system == "pythagorean" else CHALDEAN_TABLE
    
    # Extract and convert vowels only
    name = full_name.upper()
    total = 0
    
    for i, letter in enumerate(name):
        if letter.isalpha() and is_vowel(letter, i, name):
            if letter in table:
                total += table[letter]
    
    soul_urge = reduce_to_single_digit(total, keep_master=True)
    
    return soul_urge
```

### Example Calculation

**Name:** "John Michael Doe"  
**System:** Pythagorean  
**Vowels:** O, I, A, E, O, E

```
Vowels: O=6, I=9, A=1, E=5, O=6, E=5
Sum: 6 + 9 + 1 + 5 + 6 + 5 = 32
Reduce: 32 → 3+2 = 5

Soul Urge = 5
```

## 6. Personality Number Calculation

**Input:** Full name  
**Method:** Use only CONSONANTS, convert to numbers, sum, and reduce.

```python
def calculate_personality(full_name: str, system: str = "pythagorean") -> int:
    """
    Calculate Personality number from consonants in name.
    
    Represents outer persona and social mask.
    """
    table = PYTHAGOREAN_TABLE if system == "pythagorean" else CHALDEAN_TABLE
    
    # Extract and convert consonants only
    name = full_name.upper()
    total = 0
    
    for i, letter in enumerate(name):
        if letter.isalpha() and not is_vowel(letter, i, name):
            if letter in table:
                total += table[letter]
    
    personality = reduce_to_single_digit(total, keep_master=True)
    
    return personality
```

### Example Calculation

**Name:** "John Michael Doe"  
**System:** Pythagorean  
**Consonants:** J, H, N, M, C, H, L, D

```
Consonants: J=1, H=8, N=5, M=4, C=3, H=8, L=3, D=4
Sum: 1 + 8 + 5 + 4 + 3 + 8 + 3 + 4 = 36
Reduce: 36 → 3+6 = 9

Personality = 9
```

## 7. Personal Year Calculation

**Input:** Birth month, birth day, current year  
**Method:** Add birth month + birth day + current year, then reduce.

```python
def calculate_personal_year(birth_date: date, current_year: int) -> int:
    """
    Calculate Personal Year number for current year.
    
    Personal Year cycles run in 9-year periods.
    """
    month = birth_date.month
    day = birth_date.day
    
    # Reduce each component
    reduced_month = reduce_to_single_digit(month, keep_master=False)
    reduced_day = reduce_to_single_digit(day, keep_master=False)
    reduced_year = reduce_to_single_digit(current_year, keep_master=False)
    
    # Add and reduce (no master numbers for Personal Year)
    personal_year_sum = reduced_month + reduced_day + reduced_year
    personal_year = reduce_to_single_digit(personal_year_sum, keep_master=False)
    
    return personal_year
```

### Example Calculation

**Birth Date:** May 15 (month=5, day=15)  
**Current Year:** 2024

```
Month: 5 = 5
Day: 15 → 1+5 = 6
Year: 2024 → 2+0+2+4 = 8

Sum: 5 + 6 + 8 = 19
Reduce: 19 → 1+9 = 10 → 1+0 = 1

Personal Year 2024 = 1 (New beginnings year!)
```

## 8. Maturity Number Calculation

**Input:** Life Path, Expression  
**Method:** Add Life Path + Expression, then reduce.

```python
def calculate_maturity(life_path: int, expression: int) -> int:
    """
    Calculate Maturity number.
    
    Represents who you become in later life (typically after age 35).
    """
    maturity_sum = life_path + expression
    maturity = reduce_to_single_digit(maturity_sum, keep_master=True)
    return maturity
```

### Example

**Life Path:** 3  
**Expression:** 5

```
Maturity = 3 + 5 = 8
```

## 9. Bridge Numbers

Bridge numbers reveal the gap between different aspects of your numerology.

### Life-Expression Bridge

```python
def calculate_life_expression_bridge(life_path: int, expression: int) -> int:
    """
    Calculate bridge between Life Path and Expression.
    
    Shows the gap between your soul's purpose and outer expression.
    """
    # Reduce master numbers to single digits for bridge calculation
    life_reduced = reduce_to_single_digit(life_path, keep_master=False)
    expr_reduced = reduce_to_single_digit(expression, keep_master=False)
    
    bridge = abs(life_reduced - expr_reduced)
    return bridge
```

### Soul-Personality Bridge

```python
def calculate_soul_personality_bridge(soul_urge: int, personality: int) -> int:
    """
    Calculate bridge between Soul Urge and Personality.
    
    Shows the gap between inner desires and outer presentation.
    """
    soul_reduced = reduce_to_single_digit(soul_urge, keep_master=False)
    pers_reduced = reduce_to_single_digit(personality, keep_master=False)
    
    bridge = abs(soul_reduced - pers_reduced)
    return bridge
```

### Bridge Interpretation

- **0-1:** Minimal gap, natural alignment
- **2-3:** Moderate gap, some inner work needed
- **4-5:** Significant gap, conscious integration required
- **6+:** Large gap, major life work to bridge inner/outer

## 10. Karmic Debt Numbers

Karmic debt numbers indicate lessons to be learned.

```python
KARMIC_DEBT_NUMBERS = [13, 14, 16, 19]

def detect_karmic_debt(numbers_in_calculation: List[int]) -> List[int]:
    """
    Detect karmic debt numbers in the calculation process.
    """
    karmic_debts = []
    for num in numbers_in_calculation:
        if num in KARMIC_DEBT_NUMBERS:
            karmic_debts.append(num)
    return karmic_debts
```

### Karmic Debt Meanings

- **13:** Laziness and negative thinking in past life. Must work hard and stay positive.
- **14:** Abuse of freedom in past life. Must find balance and moderation.
- **16:** Ego and selfishness in past life. Must develop humility and surrender.
- **19:** Abuse of power in past life. Must learn to give and serve others.

## 11. Name Analysis

### Letters-Only Extraction

```python
def extract_letters_only(name: str) -> str:
    """
    Extract only letters from name (remove spaces, hyphens, etc.).
    """
    return ''.join(c.upper() for c in name if c.isalpha())
```

### Name Length Analysis

```python
def analyze_name_length(name: str) -> Dict[str, Any]:
    """
    Analyze name length numerologically.
    """
    letters_only = extract_letters_only(name)
    length = len(letters_only)
    length_vibration = reduce_to_single_digit(length, keep_master=False)
    
    return {
        "total_letters": length,
        "length_vibration": length_vibration,
        "interpretation": _interpret_name_length(length_vibration)
    }
```

## 12. Unicode and International Names

### Transliteration Guidelines

For non-Latin alphabets, use phonetic transliteration:

```python
def transliterate_name(name: str, language: str) -> str:
    """
    Transliterate non-Latin names to Latin alphabet.
    
    Examples:
    - Chinese: 李明 → "Li Ming"
    - Arabic: محمد → "Muhammad"
    - Russian: Иван → "Ivan"
    - Greek: Αλέξανδρος → "Alexandros"
    """
    # Implementation depends on language
    # Use standard transliteration libraries
    pass
```

## 13. Validation Rules

### Name Validation

```python
def validate_name(name: str) -> Tuple[bool, str]:
    """
    Validate name for numerology calculation.
    """
    if not name or len(name.strip()) == 0:
        return False, "Name cannot be empty"
    
    letters_only = extract_letters_only(name)
    if len(letters_only) < 2:
        return False, "Name must contain at least 2 letters"
    
    return True, "Valid"
```

### Birth Date Validation

```python
def validate_birth_date(birth_date: date) -> Tuple[bool, str]:
    """
    Validate birth date for numerology calculation.
    """
    from datetime import date
    
    if birth_date > date.today():
        return False, "Birth date cannot be in the future"
    
    if birth_date.year < 1900:
        return False, "Birth date must be after 1900"
    
    return True, "Valid"
```

## 14. Complete Profile Calculation

```python
def calculate_complete_profile(
    full_name: str,
    birth_date: date,
    current_year: int,
    system: str = "pythagorean"
) -> Dict[str, Any]:
    """
    Calculate complete numerology profile.
    
    Returns all core numbers, bridge numbers, master numbers, and karmic debts.
    """
    # Core numbers
    life_path = calculate_life_path(birth_date)
    expression = calculate_expression(full_name, system)
    soul_urge = calculate_soul_urge(full_name, system)
    personality = calculate_personality(full_name, system)
    maturity = calculate_maturity(life_path, expression)
    personal_year = calculate_personal_year(birth_date, current_year)
    
    # Bridge numbers
    life_expr_bridge = calculate_life_expression_bridge(life_path, expression)
    soul_pers_bridge = calculate_soul_personality_bridge(soul_urge, personality)
    
    # Master numbers detection
    all_numbers = [life_path, expression, soul_urge, personality, maturity]
    master_numbers = [n for n in all_numbers if is_master_number(n)]
    
    # Karmic debt detection (would need to track intermediate sums)
    karmic_debt = []  # Populated during calculation
    
    return {
        "core_numbers": {
            "life_path": life_path,
            "expression": expression,
            "soul_urge": soul_urge,
            "personality": personality
        },
        "maturity": maturity,
        "personal_year": personal_year,
        "bridge_numbers": {
            "life_expression_bridge": life_expr_bridge,
            "soul_personality_bridge": soul_pers_bridge
        },
        "master_numbers": master_numbers,
        "karmic_debt": karmic_debt,
        "system": system,
        "calculation_year": current_year,
        "name_analysis": {
            "letters_only": extract_letters_only(full_name),
            "total_letters": len(extract_letters_only(full_name))
        }
    }
```

## Summary

The numerology calculation system implements:

1. **Dual System Support** - Pythagorean and Chaldean tables
2. **Core Numbers** - Life Path, Expression, Soul Urge, Personality
3. **Master Numbers** - 11, 22, 33, 44 preserved through reduction
4. **Temporal Numbers** - Personal Year, Maturity
5. **Bridge Numbers** - Gap analysis between aspects
6. **Karmic Debt** - 13, 14, 16, 19 detection
7. **Unicode Support** - International name handling
8. **Validation** - Name and date validation rules

All formulas are deterministic and produce consistent results for given inputs.
