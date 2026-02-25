# I-Ching Cross-Engine Mappings

## Integration with Human Design (64 Gates)

The I-Ching hexagrams directly correspond to the 64 gates in the Human Design system. Each hexagram maps to a gate with the same number.

### Hexagram-to-Gate Mapping

| I-Ching # | Hexagram Name | HD Gate # | Gate Name | Center | Keynote |
|-----------|---------------|-----------|-----------|--------|---------|
| 1 | The Creative | 1 | The Creative | G Center | Self-Expression |
| 2 | The Receptive | 2 | The Receptive | G Center | Direction of the Self |
| 3 | Difficulty at Beginning | 3 | Ordering | Sacral | Innovation |
| 4 | Youthful Folly | 4 | Formulization | Ajna | Understanding |
| 5 | Waiting | 5 | Waiting | Sacral | Fixed Rhythms |
| 6 | Conflict | 6 | Conflict | Solar Plexus | Intimacy |
| ... | ... | ... | ... | ... | ... |
| 64 | Before Completion | 64 | Confusion | Head | Clarity |

### Human Design Centers and I-Ching Trigrams

The nine Human Design centers relate to trigram combinations:

**Energy Centers:**
- **G Center (Identity)**: Gates related to Heaven, Mountain trigrams
- **Sacral Center (Life Force)**: Gates related to Earth, Thunder trigrams
- **Solar Plexus (Emotions)**: Gates related to Water, Fire trigrams
- **Spleen (Intuition)**: Gates related to Lake, Wind trigrams
- **Ego/Heart (Willpower)**: Gates related to Heaven-Earth combinations
- **Throat (Communication)**: Gates related to Heaven-Wind combinations
- **Ajna (Mind)**: Gates related to Water-Mountain combinations
- **Root (Pressure)**: Gates related to Thunder-Earth combinations
- **Head (Inspiration)**: Gates related to Wind-Heaven combinations

### Integration API

```python
def map_hexagram_to_hd_gate(hexagram_number: int) -> Dict[str, Any]:
    """
    Map I-Ching hexagram to Human Design gate.
    
    Args:
        hexagram_number: I-Ching hexagram number (1-64)
    
    Returns:
        Human Design gate information including:
        - gate_number
        - gate_name
        - center
        - keynote
        - gift/shadow/siddhi (Gene Keys)
        - channel_partner
    """
    from engines.human_design import HumanDesignEngine
    
    hd_engine = HumanDesignEngine()
    gate_data = hd_engine.get_gate_by_number(hexagram_number)
    
    return {
        "hexagram_number": hexagram_number,
        "gate_number": gate_data["number"],
        "gate_name": gate_data["name"],
        "center": gate_data["center"],
        "keynote": gate_data["keynote"],
        "gift": gate_data.get("gift"),
        "shadow": gate_data.get("shadow"),
        "siddhi": gate_data.get("siddhi"),
        "channel_partner": gate_data.get("channel_partner"),
        "codon": gate_data.get("codon"),
        "amino_acid": gate_data.get("amino_acid")
    }
```

### Changing Lines to HD Lines

I-Ching changing lines correspond to Human Design line activations:

| I-Ching Line | HD Line | Quality | Theme |
|--------------|---------|---------|-------|
| 1 | 1 | Introspection | Foundation |
| 2 | 2 | Projection | Waiting |
| 3 | 3 | Experience | Trial and Error |
| 4 | 4 | Externalization | Friendship |
| 5 | 5 | Universalization | Heresy |
| 6 | 6 | Transition | Role Model |

**Example Integration:**

```python
def interpret_iching_with_hd(reading: IChingReading) -> Dict[str, Any]:
    """
    Interpret I-Ching reading with Human Design context.
    """
    primary_gate = map_hexagram_to_hd_gate(reading.primary_hexagram.number)
    
    interpretation = {
        "hexagram": reading.primary_hexagram.name,
        "hd_gate": primary_gate["gate_name"],
        "center_activation": primary_gate["center"],
        "keynote": primary_gate["keynote"],
        "changing_lines_hd": []
    }
    
    for line_pos in reading.changing_lines:
        interpretation["changing_lines_hd"].append({
            "line": line_pos,
            "theme": get_hd_line_theme(line_pos),
            "activation": f"Gate {primary_gate['gate_number']}.{line_pos}"
        })
    
    return interpretation
```

### Channel Formations

When two complementary gates are activated, they form a channel in Human Design:

```python
def check_channel_formation(hexagram1: int, hexagram2: int) -> Optional[str]:
    """
    Check if two hexagrams form a Human Design channel.
    
    Example:
        - Hexagram 1 + Hexagram 8 = Channel of Inspiration (1-8)
        - Hexagram 2 + Hexagram 14 = Channel of the Beat (2-14)
    """
    channels = {
        (1, 8): "Channel of Inspiration",
        (2, 14): "Channel of the Beat",
        (3, 60): "Channel of Mutation",
        (4, 63): "Channel of Logic",
        (5, 15): "Channel of Rhythm",
        # ... all 36 channels
    }
    
    key = tuple(sorted([hexagram1, hexagram2]))
    return channels.get(key)
```

## Integration with Gene Keys (64 Keys)

Gene Keys is a modern interpretation system that maps directly to the 64 I-Ching hexagrams.

### Gene Keys Three-Level System

Each hexagram corresponds to a Gene Key with three frequency levels:

1. **Shadow**: Unconscious, reactive state
2. **Gift**: Conscious, creative state
3. **Siddhi**: Transcendent, enlightened state

**Example Mapping:**

| Hexagram | Gene Key | Shadow | Gift | Siddhi |
|----------|----------|--------|------|--------|
| 1 | GK 1 | Entropy | Freshness | Beauty |
| 2 | GK 2 | Dislocation | Orientation | Unity |
| 3 | GK 3 | Chaos | Innovation | Innocence |
| 4 | GK 4 | Intolerance | Understanding | Forgiveness |
| 5 | GK 5 | Impatience | Patience | Timelessness |
| 6 | GK 6 | Conflict | Diplomacy | Peace |
| ... | ... | ... | ... | ... |

### Gene Keys Integration API

```python
def interpret_hexagram_as_gene_key(hexagram_number: int) -> Dict[str, Any]:
    """
    Interpret I-Ching hexagram through Gene Keys lens.
    
    Returns three-level frequency interpretation.
    """
    from engines.gene_keys import GeneKeysEngine
    
    gk_engine = GeneKeysEngine()
    key_data = gk_engine.get_key_by_number(hexagram_number)
    
    return {
        "hexagram_number": hexagram_number,
        "gene_key": key_data["number"],
        "key_name": key_data["name"],
        "shadow": key_data["shadow"],
        "shadow_description": key_data["shadow_meaning"],
        "gift": key_data["gift"],
        "gift_description": key_data["gift_meaning"],
        "siddhi": key_data["siddhi"],
        "siddhi_description": key_data["siddhi_meaning"],
        "codon": key_data["codon"],
        "amino_acid": key_data["amino_acid"],
        "programming_partner": key_data.get("programming_partner"),
        "physiological_correspondence": key_data.get("physiology")
    }
```

### Reading Enhancement with Gene Keys

```python
def enhance_iching_reading_with_genekeys(reading: IChingReading) -> Dict[str, Any]:
    """
    Add Gene Keys perspective to I-Ching reading.
    """
    primary_gk = interpret_hexagram_as_gene_key(reading.primary_hexagram.number)
    
    enhanced = {
        "iching_interpretation": reading.primary_hexagram.divination,
        "gene_key_perspective": {
            "shadow_pattern": f"{primary_gk['shadow']}: {primary_gk['shadow_description']}",
            "gift_potential": f"{primary_gk['gift']}: {primary_gk['gift_description']}",
            "siddhi_realization": f"{primary_gk['siddhi']}: {primary_gk['siddhi_description']}"
        },
        "transformation_path": f"Transform {primary_gk['shadow']} → {primary_gk['gift']} → {primary_gk['siddhi']}"
    }
    
    # Add mutation Gene Key if present
    if reading.mutation_hexagram:
        mutation_gk = interpret_hexagram_as_gene_key(reading.mutation_hexagram.number)
        enhanced["evolution_direction"] = {
            "from_shadow": primary_gk["shadow"],
            "to_gift": mutation_gk["gift"],
            "path": f"Evolving from {primary_gk['gene_key']} to {mutation_gk['gene_key']}"
        }
    
    return enhanced
```

### Genetic Codon Correspondences

Each Gene Key (and thus I-Ching hexagram) corresponds to a genetic codon:

```python
HEXAGRAM_TO_CODON = {
    1: {"codon": "CCG", "amino_acid": "Proline"},
    2: {"codon": "GGC", "amino_acid": "Glycine"},
    3: {"codon": "AAG", "amino_acid": "Lysine"},
    4: {"codon": "TGC", "amino_acid": "Cysteine"},
    5: {"codon": "TTG", "amino_acid": "Leucine"},
    # ... all 64
}

def get_codon_correspondence(hexagram_number: int) -> Dict[str, str]:
    """
    Get genetic codon corresponding to hexagram.
    
    Links I-Ching wisdom to biological code.
    """
    return HEXAGRAM_TO_CODON.get(hexagram_number, {})
```

## Integration with Numerology

### Hexagram Number Reduction

Reduce hexagram numbers to single digits for numerological analysis:

```python
def reduce_to_numerology(hexagram_number: int) -> Dict[str, Any]:
    """
    Reduce hexagram number to numerological essence.
    
    Example:
        Hexagram 64 → 6 + 4 = 10 → 1 + 0 = 1
    """
    def digital_root(n: int) -> int:
        while n > 9:
            n = sum(int(digit) for digit in str(n))
        return n
    
    root = digital_root(hexagram_number)
    
    numerology_meanings = {
        1: "Unity, leadership, new beginnings",
        2: "Duality, partnership, balance",
        3: "Creativity, expression, growth",
        4: "Stability, foundation, order",
        5: "Change, freedom, adventure",
        6: "Harmony, responsibility, love",
        7: "Spirituality, introspection, wisdom",
        8: "Power, abundance, karma",
        9: "Completion, humanitarianism, universal love"
    }
    
    return {
        "hexagram_number": hexagram_number,
        "digital_root": root,
        "numerology_meaning": numerology_meanings[root],
        "calculation": f"{hexagram_number} → {root}"
    }
```

### Line Position Numerology

Each of the six line positions has numerological significance:

| Position | Number | Meaning |
|----------|--------|---------|
| 1 | 1 | Beginning, foundation, self |
| 2 | 2 | Relationship, duality, choice |
| 3 | 3 | Expression, transition, catalyst |
| 4 | 4 | Structure, external world, manifestation |
| 5 | 5 | Change, authority, mastery |
| 6 | 6 | Completion, transcendence, wisdom |

## Integration with Astrology

### Hexagram Timing

Map hexagrams to astrological periods:

```python
def get_hexagram_astrological_timing(hexagram_number: int) -> Dict[str, Any]:
    """
    Get astrological correspondences for hexagram.
    
    Based on 64 hexagrams dividing the zodiac:
    360° / 64 = 5.625° per hexagram
    """
    degrees_per_hexagram = 360 / 64
    start_degree = (hexagram_number - 1) * degrees_per_hexagram
    end_degree = start_degree + degrees_per_hexagram
    
    # Determine zodiac sign
    zodiac_signs = [
        "Aries", "Taurus", "Gemini", "Cancer", 
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    
    sign_index = int(start_degree / 30)
    sign = zodiac_signs[sign_index]
    
    return {
        "hexagram": hexagram_number,
        "zodiac_arc": f"{start_degree:.2f}° - {end_degree:.2f}°",
        "zodiac_sign": sign,
        "degree_in_sign": start_degree % 30,
        "timing": f"When Sun transits {start_degree:.1f}° {sign}"
    }
```

### Planetary Correspondences

Trigrams correspond to planetary energies:

| Trigram | Planet | Quality |
|---------|--------|---------|
| Heaven ☰ | Sun | Creative force, vitality |
| Earth ☷ | Earth/Moon | Receptive, nurturing |
| Thunder ☳ | Jupiter | Expansion, movement |
| Water ☵ | Mercury | Flow, communication |
| Mountain ☶ | Saturn | Stillness, boundaries |
| Wind ☴ | Venus | Gentle influence, harmony |
| Fire ☲ | Mars | Action, passion |
| Lake ☱ | Neptune | Joy, dissolution |

## Integration with Sacred Geometry

### Hexagram as Geometric Pattern

Each hexagram can be visualized as a geometric structure:

```python
def generate_hexagram_geometry(lines: List[int]) -> Dict[str, Any]:
    """
    Generate sacred geometric representation of hexagram.
    
    Uses line positions to create:
    - Hexagonal structure
    - Yin-Yang flow pattern
    - Golden ratio proportions
    """
    yin_count = sum(1 for line in lines if line % 2 == 0)
    yang_count = 6 - yin_count
    
    balance_ratio = yin_count / yang_count if yang_count > 0 else float('inf')
    golden_ratio = 1.618
    
    return {
        "yin_lines": yin_count,
        "yang_lines": yang_count,
        "balance_ratio": balance_ratio,
        "proximity_to_golden_ratio": abs(balance_ratio - golden_ratio),
        "geometric_interpretation": "Balanced" if abs(balance_ratio - 1.0) < 0.5 else "Dynamic"
    }
```

### Bagua Compass Mapping

The eight trigrams form the Bagua compass used in Feng Shui:

```
     South (Fire ☲)
           |
 SE        |        SW
(Wind ☴)   |   (Earth ☷)
           |
    East --|-- West
(Thunder ☳)|  (Lake ☱)
           |
 NE        |        NW
(Mountain ☶)  (Heaven ☰)
           |
     North (Water ☵)
```

## Cross-System Reading Example

```python
def generate_multisystem_reading(question: str) -> Dict[str, Any]:
    """
    Generate reading across multiple systems.
    """
    # 1. Generate I-Ching reading
    iching = IChingMutationOracle()
    reading = iching.run(IChingInput(question=question, method="coins"))
    
    # 2. Add Human Design context
    hd_gate = map_hexagram_to_hd_gate(reading.raw_data["reading"].primary_hexagram.number)
    
    # 3. Add Gene Keys perspective
    gk_data = interpret_hexagram_as_gene_key(reading.raw_data["reading"].primary_hexagram.number)
    
    # 4. Add numerology
    numerology = reduce_to_numerology(reading.raw_data["reading"].primary_hexagram.number)
    
    # 5. Add astrological timing
    astro_timing = get_hexagram_astrological_timing(reading.raw_data["reading"].primary_hexagram.number)
    
    return {
        "question": question,
        "iching": {
            "hexagram": reading.raw_data["reading"].primary_hexagram.name,
            "guidance": reading.raw_data["guidance_summary"]
        },
        "human_design": {
            "gate": f"Gate {hd_gate['gate_number']}: {hd_gate['gate_name']}",
            "center": hd_gate["center"],
            "keynote": hd_gate["keynote"]
        },
        "gene_keys": {
            "key": f"GK {gk_data['gene_key']}",
            "transformation": f"{gk_data['shadow']} → {gk_data['gift']} → {gk_data['siddhi']}"
        },
        "numerology": {
            "essence": numerology["digital_root"],
            "meaning": numerology["numerology_meaning"]
        },
        "astrology": {
            "timing": astro_timing["timing"],
            "sign": astro_timing["zodiac_sign"]
        }
    }
```

## Synthesis Patterns

### Pattern: Shadow to Siddhi Transformation

When mutation hexagram exists, track transformation path:

```
Primary Hexagram Shadow → Mutation Hexagram Gift → Ultimate Siddhi
```

### Pattern: Channel Activation

When reading involves complementary hexagrams, identify potential channel formation in Human Design system.

### Pattern: Trigram Element Cycle

Analyze Five Element relationships between upper and lower trigrams:
- **Generating Cycle**: Wood→Fire→Earth→Metal→Water→Wood
- **Controlling Cycle**: Wood→Earth→Water→Fire→Metal→Wood

---

*Last Updated: 2026*  
*Source: WitnessOS Multi-Engine Integration System*
