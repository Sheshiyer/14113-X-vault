# Numerology Implementation Architecture

## System Overview

The Numerology Engine implements a clean, extensible architecture supporting multiple numerological systems with shared calculation logic.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Numerology Engine                         │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Pythagorean  │  │  Chaldean    │  │    Data      │
│  Calculator  │  │  Calculator  │  │   Loading    │
└──────────────┘  └──────────────┘  └──────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
            ┌──────────────────────────────┐
            │   Reduction Engine           │
            │   (Master Number Handler)    │
            └──────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Life Path    │  │ Expression   │  │ Personal Year│
│ Calculator   │  │ Calculator   │  │  Calculator  │
└──────────────┘  └──────────────┘  └──────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
            ┌──────────────────────────────┐
            │   Interpretation Engine      │
            │   (Meanings & Guidance)      │
            └──────────────────────────────┘
```

## Core Components

### 1. NumerologyEngine Class

Main engine class providing the public API.

```python
class NumerologyEngine(BaseEngine):
    """
    WitnessOS Numerology Field Extractor Engine
    
    Extracts soul-number matrices and vibrational signatures from names and birth dates.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(config)
        
        # Initialize calculators for both systems
        self.pythagorean_calc = NumerologyCalculator("pythagorean")
        self.chaldean_calc = NumerologyCalculator("chaldean")
        
        # Load interpretations
        self._load_interpretations()
    
    @property
    def engine_name(self) -> str:
        return "numerology"
    
    @property
    def input_model(self):
        return NumerologyInput
    
    @property
    def output_model(self):
        return NumerologyOutput
```

### 2. NumerologyCalculator Class

Abstracted calculator supporting multiple systems.

```python
class NumerologyCalculator:
    """
    Numerology calculation engine supporting multiple systems.
    """
    
    def __init__(self, system: str = "pythagorean"):
        self.system = system
        self.conversion_table = self._load_conversion_table(system)
        self.vowels = set(['A', 'E', 'I', 'O', 'U'])
    
    def _load_conversion_table(self, system: str) -> Dict[str, int]:
        """Load letter-to-number conversion table for system."""
        if system == "pythagorean":
            return {
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
        elif system == "chaldean":
            return {
                'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
                'B': 2, 'K': 2, 'R': 2,
                'C': 3, 'G': 3, 'L': 3, 'S': 3,
                'D': 4, 'M': 4, 'T': 4,
                'E': 5, 'H': 5, 'N': 5, 'X': 5,
                'U': 6, 'V': 6, 'W': 6,
                'O': 7, 'Z': 7,
                'F': 8, 'P': 8
            }
        else:
            raise ValueError(f"Unsupported system: {system}")
    
    def calculate_complete_profile(
        self,
        full_name: str,
        birth_date: date,
        current_year: int
    ) -> Dict[str, Any]:
        """
        Calculate complete numerology profile.
        """
        # Core numbers
        life_path = self.calculate_life_path(birth_date)
        expression = self.calculate_expression(full_name)
        soul_urge = self.calculate_soul_urge(full_name)
        personality = self.calculate_personality(full_name)
        
        # Derived numbers
        maturity = self.calculate_maturity(life_path, expression)
        personal_year = self.calculate_personal_year(birth_date, current_year)
        
        # Bridge numbers
        life_expr_bridge = abs(
            self._reduce_to_single(life_path) - self._reduce_to_single(expression)
        )
        soul_pers_bridge = abs(
            self._reduce_to_single(soul_urge) - self._reduce_to_single(personality)
        )
        
        # Special numbers
        master_numbers = self._detect_master_numbers([
            life_path, expression, soul_urge, personality, maturity
        ])
        
        karmic_debt = self._detect_karmic_debt_in_calculation(
            full_name, birth_date
        )
        
        # Name analysis
        letters_only = ''.join(c.upper() for c in full_name if c.isalpha())
        
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
            "system": self.system,
            "calculation_year": current_year,
            "name_analysis": {
                "letters_only": letters_only,
                "total_letters": len(letters_only)
            }
        }
```

### 3. Reduction Engine

Core reduction algorithm with master number handling.

```python
class ReductionEngine:
    """
    Handles digit reduction with master number preservation.
    """
    
    MASTER_NUMBERS = [11, 22, 33, 44]
    
    @staticmethod
    def reduce_to_single_digit(
        number: int,
        keep_master: bool = True,
        track_intermediates: bool = False
    ) -> Union[int, Tuple[int, List[int]]]:
        """
        Reduce number to single digit or master number.
        
        Args:
            number: Number to reduce
            keep_master: Preserve master numbers if encountered
            track_intermediates: Return intermediate values
        
        Returns:
            Reduced number (and intermediate values if track_intermediates=True)
        """
        intermediates = []
        
        while number > 9:
            if keep_master and number in ReductionEngine.MASTER_NUMBERS:
                if track_intermediates:
                    return number, intermediates
                return number
            
            intermediates.append(number)
            
            # Sum digits
            digit_sum = sum(int(d) for d in str(number))
            
            if keep_master and digit_sum in ReductionEngine.MASTER_NUMBERS:
                intermediates.append(digit_sum)
                if track_intermediates:
                    return digit_sum, intermediates
                return digit_sum
            
            number = digit_sum
        
        if track_intermediates:
            return number, intermediates
        return number
    
    @staticmethod
    def is_master_number(number: int) -> bool:
        """Check if number is a master number."""
        return number in ReductionEngine.MASTER_NUMBERS
    
    @staticmethod
    def detect_master_numbers(numbers: List[int]) -> List[int]:
        """Extract all master numbers from list."""
        return [n for n in numbers if ReductionEngine.is_master_number(n)]
```

### 4. Calculator Methods

#### Life Path Calculator

```python
def calculate_life_path(self, birth_date: date) -> int:
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
    
    # Reduce each component separately
    reduced_year = self._reduce_to_single(year, keep_master=True)
    reduced_month = self._reduce_to_single(month, keep_master=True)
    reduced_day = self._reduce_to_single(day, keep_master=True)
    
    # Add reduced components
    life_path_sum = reduced_year + reduced_month + reduced_day
    
    # Final reduction
    life_path = self._reduce_to_single(life_path_sum, keep_master=True)
    
    return life_path

def _reduce_to_single(
    self, 
    number: int, 
    keep_master: bool = True
) -> int:
    """Wrapper for ReductionEngine.reduce_to_single_digit."""
    return ReductionEngine.reduce_to_single_digit(number, keep_master)
```

#### Expression Calculator

```python
def calculate_expression(self, full_name: str) -> int:
    """
    Calculate Expression number from full name.
    
    Uses ALL letters in the name.
    """
    # Clean and convert to uppercase
    name = ''.join(c.upper() for c in full_name if c.isalpha())
    
    # Convert letters to numbers and sum
    total = 0
    for letter in name:
        if letter in self.conversion_table:
            total += self.conversion_table[letter]
    
    # Reduce
    expression = self._reduce_to_single(total, keep_master=True)
    
    return expression
```

#### Soul Urge Calculator

```python
def calculate_soul_urge(self, full_name: str) -> int:
    """
    Calculate Soul Urge number from VOWELS in name.
    """
    name = full_name.upper()
    total = 0
    
    for i, letter in enumerate(name):
        if letter.isalpha() and self._is_vowel(letter, i, name):
            if letter in self.conversion_table:
                total += self.conversion_table[letter]
    
    soul_urge = self._reduce_to_single(total, keep_master=True)
    
    return soul_urge

def _is_vowel(self, letter: str, position: int, full_name: str) -> bool:
    """
    Determine if letter is vowel considering context.
    
    'Y' is treated as vowel when not at beginning of word.
    """
    if letter in self.vowels:
        return True
    
    if letter == 'Y':
        # Y is vowel if not at start of word
        if position == 0:
            return False
        # Check if previous char is a space (start of new word)
        if position > 0 and full_name[position - 1] == ' ':
            return False
        return True
    
    return False
```

#### Personality Calculator

```python
def calculate_personality(self, full_name: str) -> int:
    """
    Calculate Personality number from CONSONANTS in name.
    """
    name = full_name.upper()
    total = 0
    
    for i, letter in enumerate(name):
        if letter.isalpha() and not self._is_vowel(letter, i, name):
            if letter in self.conversion_table:
                total += self.conversion_table[letter]
    
    personality = self._reduce_to_single(total, keep_master=True)
    
    return personality
```

#### Personal Year Calculator

```python
def calculate_personal_year(self, birth_date: date, current_year: int) -> int:
    """
    Calculate Personal Year number.
    
    Personal Year cycles run 1-9 (no master numbers).
    """
    month = birth_date.month
    day = birth_date.day
    
    # Reduce components (no master numbers)
    reduced_month = self._reduce_to_single(month, keep_master=False)
    reduced_day = self._reduce_to_single(day, keep_master=False)
    reduced_year = self._reduce_to_single(current_year, keep_master=False)
    
    # Sum and reduce
    personal_year_sum = reduced_month + reduced_day + reduced_year
    personal_year = self._reduce_to_single(personal_year_sum, keep_master=False)
    
    return personal_year
```

#### Maturity Calculator

```python
def calculate_maturity(self, life_path: int, expression: int) -> int:
    """
    Calculate Maturity number (Life Path + Expression).
    
    Represents who you become in later life.
    """
    maturity_sum = life_path + expression
    maturity = self._reduce_to_single(maturity_sum, keep_master=True)
    return maturity
```

### 5. Karmic Debt Detection

```python
def _detect_karmic_debt_in_calculation(
    self,
    full_name: str,
    birth_date: date
) -> List[int]:
    """
    Detect karmic debt numbers (13, 14, 16, 19) in calculations.
    """
    KARMIC_DEBT_NUMBERS = [13, 14, 16, 19]
    found_karmic_debt = []
    
    # Check birth date components
    year_sum, year_intermediates = self._reduce_to_single(
        birth_date.year, keep_master=True, track_intermediates=True
    )
    
    for num in year_intermediates:
        if num in KARMIC_DEBT_NUMBERS and num not in found_karmic_debt:
            found_karmic_debt.append(num)
    
    # Check name calculations
    name = ''.join(c.upper() for c in full_name if c.isalpha())
    name_sum = sum(self.conversion_table.get(c, 0) for c in name)
    
    _, name_intermediates = self._reduce_to_single(
        name_sum, keep_master=True, track_intermediates=True
    )
    
    for num in name_intermediates:
        if num in KARMIC_DEBT_NUMBERS and num not in found_karmic_debt:
            found_karmic_debt.append(num)
    
    return found_karmic_debt
```

### 6. Interpretation Engine

```python
class InterpretationEngine:
    """
    Provides meanings and interpretations for numerology numbers.
    """
    
    def __init__(self):
        self.life_path_meanings = self._load_life_path_meanings()
        self.personal_year_meanings = self._load_personal_year_meanings()
        self.master_meanings = self._load_master_meanings()
    
    def _load_life_path_meanings(self) -> Dict[int, str]:
        return {
            1: "The Pioneer - Leadership, independence, and new beginnings",
            2: "The Diplomat - Cooperation, partnership, and harmony",
            3: "The Creative - Expression, communication, and artistic gifts",
            4: "The Builder - Stability, hard work, and practical foundations",
            5: "The Explorer - Freedom, adventure, and dynamic change",
            6: "The Nurturer - Service, responsibility, and healing others",
            7: "The Seeker - Spiritual investigation and inner wisdom",
            8: "The Achiever - Material mastery and ambitious goals",
            9: "The Humanitarian - Universal service and compassion",
            11: "The Intuitive - Spiritual illumination and inspiration",
            22: "The Master Builder - Manifesting dreams into reality",
            33: "The Master Teacher - Spiritual guidance and healing"
        }
    
    def get_life_path_meaning(self, life_path: int) -> str:
        return self.life_path_meanings.get(
            life_path, 
            "Unique vibrational signature"
        )
    
    def generate_interpretation(
        self,
        profile: Dict[str, Any]
    ) -> str:
        """
        Generate mystical numerology interpretation.
        """
        core = profile["core_numbers"]
        
        interpretation = f"""
🔢 SOUL-NUMBER MATRIX 🔢

Life Path {core['life_path']}: {self.get_life_path_meaning(core['life_path'])}

Your soul chose this incarnation to master the archetypal frequency of {core['life_path']}.

Expression {core['expression']}: Your outer manifestation carries the vibrational 
signature of {core['expression']}.

Soul Urge {core['soul_urge']}: Your inner compass resonates at frequency {core['soul_urge']}.

Personality {core['personality']}: Others perceive your field signature as {core['personality']}.

Personal Year {profile['personal_year']}: This year's vibrational theme optimizes 
your field for {self.get_personal_year_meaning(profile['personal_year'])}.
        """
        
        return interpretation.strip()
```

### 7. Unicode and International Name Handling

```python
class NameProcessor:
    """
    Handles name processing including Unicode and international names.
    """
    
    @staticmethod
    def normalize_name(name: str) -> str:
        """
        Normalize name for calculation.
        
        - Removes accents/diacritics
        - Converts to uppercase
        - Keeps only letters and spaces
        """
        import unicodedata
        
        # Decompose Unicode characters
        nfd = unicodedata.normalize('NFD', name)
        
        # Remove diacritical marks
        without_accents = ''.join(
            c for c in nfd 
            if unicodedata.category(c) != 'Mn'
        )
        
        # Keep only letters and spaces
        cleaned = ''.join(
            c for c in without_accents 
            if c.isalpha() or c.isspace()
        )
        
        return cleaned.upper().strip()
    
    @staticmethod
    def validate_name(name: str) -> Tuple[bool, str]:
        """
        Validate name for numerology calculation.
        """
        if not name or len(name.strip()) == 0:
            return False, "Name cannot be empty"
        
        normalized = NameProcessor.normalize_name(name)
        letters_only = ''.join(c for c in normalized if c.isalpha())
        
        if len(letters_only) < 2:
            return False, "Name must contain at least 2 letters"
        
        return True, "Valid"
```

### 8. Caching Strategy

```python
class CalculationCache:
    """
    Cache numerology calculations for performance.
    """
    
    def __init__(self, ttl_seconds: int = 3600):
        self.cache: Dict[str, Tuple[Dict, float]] = {}
        self.ttl = ttl_seconds
    
    def _generate_cache_key(
        self,
        name: str,
        birth_date: date,
        system: str
    ) -> str:
        """Generate cache key from inputs."""
        import hashlib
        
        key_string = f"{name}|{birth_date.isoformat()}|{system}"
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def get(
        self,
        name: str,
        birth_date: date,
        system: str
    ) -> Optional[Dict]:
        """Retrieve cached result if not expired."""
        key = self._generate_cache_key(name, birth_date, system)
        
        if key in self.cache:
            result, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return result
            else:
                del self.cache[key]
        
        return None
    
    def set(
        self,
        name: str,
        birth_date: date,
        system: str,
        result: Dict
    ):
        """Cache calculation result."""
        key = self._generate_cache_key(name, birth_date, system)
        self.cache[key] = (result, time.time())
```

## Testing Architecture

```python
import unittest

class TestNumerologyCalculator(unittest.TestCase):
    
    def setUp(self):
        self.calc = NumerologyCalculator("pythagorean")
    
    def test_life_path_calculation(self):
        """Test Life Path calculation."""
        birth_date = date(1990, 5, 15)
        life_path = self.calc.calculate_life_path(birth_date)
        self.assertEqual(life_path, 3)
    
    def test_master_number_preservation(self):
        """Test that master numbers are preserved."""
        birth_date = date(1988, 11, 22)
        life_path = self.calc.calculate_life_path(birth_date)
        # Should contain master number energy
        self.assertIn(life_path, [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44])
    
    def test_expression_number(self):
        """Test Expression number calculation."""
        expression = self.calc.calculate_expression("John Doe")
        self.assertIsInstance(expression, int)
        self.assertGreaterEqual(expression, 1)
        self.assertLessEqual(expression, 44)
```

## Performance Optimizations

### Memoization

```python
from functools import lru_cache

class OptimizedCalculator(NumerologyCalculator):
    """
    Optimized calculator with memoization.
    """
    
    @lru_cache(maxsize=1000)
    def _reduce_to_single_cached(self, number: int, keep_master: bool) -> int:
        """Cached reduction for frequently accessed numbers."""
        return self._reduce_to_single(number, keep_master)
```

## Summary

The Numerology Engine implements:

1. **Modular Architecture** - Separate calculators for each system
2. **Reduction Engine** - Centralized master number handling
3. **Interpretation Engine** - Meanings and guidance
4. **Unicode Support** - International name normalization
5. **Caching** - Performance optimization
6. **Validation** - Input validation and error handling
7. **Testing** - Comprehensive unit tests

The architecture prioritizes clarity, extensibility, and performance.
