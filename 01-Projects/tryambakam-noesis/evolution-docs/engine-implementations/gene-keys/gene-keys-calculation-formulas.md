# Gene Keys Calculation Formulas

**Complete Mathematical and Astronomical Reference**  
*Extracted from WitnessOS Source Code*

---

## Table of Contents

1. [Overview](#overview)
2. [Core Constants](#core-constants)
3. [Astronomical Calculations](#astronomical-calculations)
4. [Sequence Calculations](#sequence-calculations)
5. [Programming Partner Formula](#programming-partner-formula)
6. [Frequency Shifting](#frequency-shifting)
7. [Genetic Codon Mapping](#genetic-codon-mapping)
8. [Lookup Tables](#lookup-tables)

---

## Overview

Gene Keys uses the same astronomical foundation as Human Design, but interprets the 64 archetypes through the lens of evolutionary consciousness (Shadow → Gift → Siddhi).

### Calculation Pipeline

```
Birth Data → Swiss Ephemeris → Planetary Positions → Gene Keys → 
Sequences (Activation, Venus, Pearl) → Frequency Analysis → Pathworking Guidance
```

---

## Core Constants

### 64 Gene Keys Structure

```python
TOTAL_GENE_KEYS = 64
FREQUENCIES_PER_KEY = 3  # Shadow, Gift, Siddhi
AMINO_ACIDS = 20  # Mapped from 64 codons
PROGRAMMING_PARTNER_OFFSET = 3  # Hexagram distance
```

### Mathematical Constants

```latex
$\text{Total Gene Keys} = 64$

$\text{Frequencies} = \{\text{Shadow}, \text{Gift}, \text{Siddhi}\}$

$\text{Programming Partner}(n) = ((n + 3 - 1) \mod 64) + 1$

$\text{Codon Ring} = 6 \text{ Gene Keys per amino acid}$
```

---

## Astronomical Calculations

### Shared Foundation with Human Design

Gene Keys uses **identical astronomical calculations** as Human Design:

```python
def calculate_gene_keys_from_astronomy(
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> Dict[str, int]:
    """
    Calculate Gene Key numbers using astronomical positions.
    
    Uses the same I-Ching gate calculation as Human Design:
    - Personality: Birth moment
    - Design: 88° solar arc before birth
    """
    birth_datetime = datetime.combine(birth_date, birth_time)
    lat, lon = birth_location
    
    # Calculate HD astronomical data (Gene Keys use same positions)
    hd_data = astro_calc.calculate_human_design_data(
        birth_datetime, lat, lon, timezone
    )
    
    # Extract Gene Keys from gate positions
    gene_keys = {
        # Activation Sequence (Primary 4)
        'lifes_work': hd_data['personality_gates']['sun'],
        'evolution': hd_data['personality_gates']['earth'],
        'radiance': hd_data['design_gates']['sun'],
        'purpose': hd_data['design_gates']['earth'],
        
        # Venus Sequence
        'attraction': hd_data['personality_gates'].get('venus', 1),
        'magnetism': hd_data['design_gates'].get('venus', 1),
        
        # Pearl Sequence
        'vocation': hd_data['personality_gates'].get('jupiter', 1),
        'culture': hd_data['personality_gates'].get('saturn', 1),
        'brand': hd_data['personality_gates'].get('uranus', 1)
    }
    
    return gene_keys
```

### Formula Summary

```latex
$\text{Gene Key}_{n} = \text{Gate}_{n} = f(\lambda_{\text{planet}})$

\text{where } \lambda_{\text{planet}} = \text{ecliptic longitude of planet}

$\text{Life's Work} = \text{Gene Key}(\lambda_{\odot, \text{birth}})$

$\text{Evolution} = \text{Gene Key}(\lambda_{\oplus, \text{birth}})$

$\text{Radiance} = \text{Gene Key}(\lambda_{\odot, \text{design}})$

$\text{Purpose} = \text{Gene Key}(\lambda_{\oplus, \text{design}})$
```

---

## Sequence Calculations

### 1. Activation Sequence (Core 4)

**The foundational sequence** - calculated from Sun and Earth positions:

```python
def create_activation_sequence(
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> GeneKeysSequence:
    """
    Calculate the Activation Sequence.
    
    Four gates that form your core genetic blueprint:
    1. Life's Work (Personality Sun)
    2. Evolution (Personality Earth)
    3. Radiance (Design Sun)
    4. Purpose (Design Earth)
    """
    gene_keys = calculate_gene_keys_from_astronomy(
        birth_date, birth_time, birth_location, timezone
    )
    
    gates = [
        SequenceGate(
            name="Life's Work",
            description="Core life purpose and creative expression",
            gene_key=get_gene_key_by_number(gene_keys['lifes_work']),
            calculation_method="Sun position at birth"
        ),
        SequenceGate(
            name="Evolution",
            description="Path of personal development",
            gene_key=get_gene_key_by_number(gene_keys['evolution']),
            calculation_method="Earth position at birth"
        ),
        SequenceGate(
            name="Radiance",
            description="Gift to humanity",
            gene_key=get_gene_key_by_number(gene_keys['radiance']),
            calculation_method="Sun position 88 days before birth"
        ),
        SequenceGate(
            name="Purpose",
            description="Deepest spiritual mission",
            gene_key=get_gene_key_by_number(gene_keys['purpose']),
            calculation_method="Earth position 88 days before birth"
        )
    ]
    
    return GeneKeysSequence(
        name="Activation Sequence",
        description="Four primary gates forming core blueprint",
        gates=gates
    )
```

### 2. Venus Sequence (Relationships)

**Pathway of love and relationships**:

```python
def create_venus_sequence(
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> GeneKeysSequence:
    """
    Calculate the Venus Sequence.
    
    Relationship patterns:
    1. Attraction (Personality Venus)
    2. Magnetism (Design Venus)
    """
    gene_keys = calculate_gene_keys_from_astronomy(
        birth_date, birth_time, birth_location, timezone
    )
    
    gates = [
        SequenceGate(
            name="Attraction",
            description="What draws you to others",
            gene_key=get_gene_key_by_number(gene_keys['attraction']),
            calculation_method="Venus position at birth"
        ),
        SequenceGate(
            name="Magnetism",
            description="Your natural charisma",
            gene_key=get_gene_key_by_number(gene_keys['magnetism']),
            calculation_method="Venus position 88 days before birth"
        )
    ]
    
    return GeneKeysSequence(
        name="Venus Sequence",
        description="Pathway of love and relationships",
        gates=gates
    )
```

### 3. Pearl Sequence (Prosperity)

**Material manifestation pathway**:

```python
def create_pearl_sequence(
    birth_date: date, 
    birth_time: time,
    birth_location: tuple, 
    timezone: str
) -> GeneKeysSequence:
    """
    Calculate the Pearl Sequence.
    
    Prosperity path:
    1. Vocation (Jupiter)
    2. Culture (Saturn)
    3. Brand (Uranus)
    """
    gene_keys = calculate_gene_keys_from_astronomy(
        birth_date, birth_time, birth_location, timezone
    )
    
    gates = [
        SequenceGate(
            name="Vocation",
            description="Natural career path",
            gene_key=get_gene_key_by_number(gene_keys['vocation']),
            calculation_method="Jupiter position at birth"
        ),
        SequenceGate(
            name="Culture",
            description="Collective contribution",
            gene_key=get_gene_key_by_number(gene_keys['culture']),
            calculation_method="Saturn position at birth"
        ),
        SequenceGate(
            name="Brand",
            description="Unique signature",
            gene_key=get_gene_key_by_number(gene_keys['brand']),
            calculation_method="Uranus position at birth"
        )
    ]
    
    return GeneKeysSequence(
        name="Pearl Sequence",
        description="Pathway of prosperity and manifestation",
        gates=gates
    )
```

---

## Programming Partner Formula

### Calculation

The **Programming Partner** is the Gene Key that balances and completes yours:

```python
def calculate_programming_partner(gene_key_number: int) -> int:
    """
    Calculate programming partner using hexagram geometry.
    
    Formula: Partner is 3 positions away on I-Ching wheel
    (but accounting for circular structure).
    
    Examples:
    - Gene Key 1 → Partner 2
    - Gene Key 13 → Partner 7
    - Gene Key 64 → Partner 63
    """
    # Offset by 3 in hexagram sequence
    partner = gene_key_number + 3
    
    # Handle wraparound
    if partner > 64:
        partner = partner - 64
    
    return partner
```

### Formula

```latex
$\text{Partner}(n) = \begin{cases}
n + 3 & \text{if } n \leq 61 \\
n + 3 - 64 & \text{if } n > 61
\end{cases}$

\text{Simplified: } \text{Partner}(n) = ((n + 2) \mod 64) + 1
```

### Programming Partner Pairs

```python
PROGRAMMING_PARTNERS = {
    1: 2, 2: 1,    # The Creative ↔ The Receptive
    3: 50, 50: 3,  # Innovation ↔ Values
    4: 49, 49: 4,  # Formulization ↔ Revolution
    5: 35, 35: 5,  # Patience ↔ Adventure
    6: 36, 36: 6,  # Conflict ↔ Crisis
    7: 13, 13: 7,  # Role ↔ Listener
    # ... continues for all 64
}
```

---

## Frequency Shifting

### Three Frequencies Formula

Each Gene Key operates at three frequencies:

```python
def calculate_frequency_state(
    awareness_level: float  # 0.0 to 1.0
) -> str:
    """
    Determine current frequency based on awareness.
    
    Shadow: 0.0 - 0.33 (Victim consciousness)
    Gift:   0.33 - 0.90 (Creative consciousness)
    Siddhi: 0.90 - 1.0  (Divine consciousness)
    """
    if awareness_level < 0.33:
        return "Shadow"
    elif awareness_level < 0.90:
        return "Gift"
    else:
        return "Siddhi"
```

### Frequency Transition Model

```python
class FrequencyTransition:
    """Model frequency shifts over time."""
    
    @staticmethod
    def shadow_to_gift_pathway(gene_key: GeneKey) -> List[str]:
        """
        Generate pathway from Shadow to Gift.
        
        Process:
        1. Awareness of Shadow
        2. Acceptance of Shadow
        3. Contemplation of Gift
        4. Embodiment of Gift
        """
        return [
            f"Notice when you express {gene_key.shadow} (Shadow)",
            f"Accept this is part of your pattern",
            f"Contemplate {gene_key.gift} as alternative",
            f"Practice embodying {gene_key.gift}",
            f"Stabilize in {gene_key.gift} frequency"
        ]
    
    @staticmethod
    def gift_to_siddhi_pathway(gene_key: GeneKey) -> List[str]:
        """
        Generate pathway from Gift to Siddhi.
        
        Process:
        1. Master the Gift
        2. Surrender control
        3. Witness the Siddhi
        4. Merge with Siddhi
        """
        return [
            f"Master the Gift of {gene_key.gift}",
            f"Surrender need to control the Gift",
            f"Witness moments of {gene_key.siddhi}",
            f"Allow {gene_key.siddhi} to emerge naturally",
            f"Rest in {gene_key.siddhi} consciousness"
        ]
```

### Frequency Formulas

```latex
$\text{Consciousness Level} = f(\text{awareness}, \text{embodiment}, \text{time})$

$\text{Shadow} \xrightarrow{\text{awareness}} \text{Gift} \xrightarrow{\text{surrender}} \text{Siddhi}$

$P(\text{Siddhi | Gift}) = \frac{\text{surrender} \times \text{grace}}{\text{attachment}}$
```

---

## Genetic Codon Mapping

### 64 Codons to 20 Amino Acids

Gene Keys map to genetic codons and amino acids:

```python
CODON_MAPPING = {
    1: {"codon": "CTT", "amino_acid": "Leucine", "ring": "Ring of Light"},
    2: {"codon": "TTA", "amino_acid": "Leucine", "ring": "Ring of Light"},
    3: {"codon": "TTG", "amino_acid": "Leucine", "ring": "Ring of Light"},
    4: {"codon": "CTC", "amino_acid": "Leucine", "ring": "Ring of Light"},
    5: {"codon": "CTA", "amino_acid": "Leucine", "ring": "Ring of Light"},
    6: {"codon": "CTG", "amino_acid": "Leucine", "ring": "Ring of Light"},
    # Each amino acid maps to 2-6 Gene Keys (codon ring)
    7: {"codon": "TCT", "amino_acid": "Serine", "ring": "Ring of Seeking"},
    # ... continues for all 64
}
```

### Codon Ring Formula

```python
def get_codon_ring(gene_key_number: int) -> List[int]:
    """
    Get all Gene Keys in the same codon ring.
    
    A codon ring = all Gene Keys mapping to same amino acid.
    """
    amino_acid = CODON_MAPPING[gene_key_number]["amino_acid"]
    
    ring_members = [
        gk for gk, data in CODON_MAPPING.items()
        if data["amino_acid"] == amino_acid
    ]
    
    return ring_members
```

### Chemical Families

```python
AMINO_ACID_FAMILIES = {
    "Ring of Light": {
        "amino_acid": "Leucine",
        "gene_keys": [1, 2, 3, 4, 5, 6],
        "theme": "Returning to unity"
    },
    "Ring of Seeking": {
        "amino_acid": "Serine",
        "gene_keys": [7, 8, 9, 10, 11, 12],
        "theme": "Quest for truth"
    },
    # ... 20 total rings
}
```

---

## Lookup Tables

### Complete Gene Key Archetypes

```python
GENE_KEYS_ARCHETYPES = {
    1: {
        "name": "Entropy",
        "shadow": "Entropy",
        "gift": "Freshness",
        "siddhi": "Beauty",
        "codon": "CTT",
        "amino_acid": "Leucine",
        "programming_partner": 2,
        "physiology": "Pituitary Gland",
        "life_theme": "From chaos to cosmic beauty"
    },
    2: {
        "name": "Orientation",
        "shadow": "Dislocation",
        "gift": "Orientation",
        "siddhi": "Unity",
        "codon": "TTA",
        "amino_acid": "Leucine",
        "programming_partner": 1,
        "physiology": "Pituitary Gland",
        "life_theme": "Finding your place in the cosmos"
    },
    13: {
        "name": "Discord",
        "shadow": "Discord",
        "gift": "Discernment",
        "siddhi": "Empathy",
        "codon": "GCC",
        "amino_acid": "Alanine",
        "programming_partner": 7,
        "physiology": "Heart",
        "life_theme": "Listening with empathy"
    },
    # ... all 64 Gene Keys
}
```

### Sequence Position Meanings

```python
SEQUENCE_MEANINGS = {
    "activation": {
        "lifes_work": {
            "planet": "Personality Sun",
            "theme": "Core life purpose",
            "question": "What am I here to master?"
        },
        "evolution": {
            "planet": "Personality Earth",
            "theme": "Growth path",
            "question": "How do I evolve?"
        },
        "radiance": {
            "planet": "Design Sun",
            "theme": "Gift to world",
            "question": "What do I radiate?"
        },
        "purpose": {
            "planet": "Design Earth",
            "theme": "Spiritual mission",
            "question": "What is my deepest purpose?"
        }
    },
    "venus": {
        "attraction": {
            "planet": "Personality Venus",
            "theme": "Relationship pattern",
            "question": "What attracts me?"
        },
        "magnetism": {
            "planet": "Design Venus",
            "theme": "Unconscious attraction",
            "question": "What draws others to me?"
        }
    },
    "pearl": {
        "vocation": {
            "planet": "Jupiter",
            "theme": "Career path",
            "question": "What is my natural vocation?"
        },
        "culture": {
            "planet": "Saturn",
            "theme": "Collective contribution",
            "question": "How do I serve culture?"
        },
        "brand": {
            "planet": "Uranus",
            "theme": "Unique signature",
            "question": "What is my unique brand?"
        }
    }
}
```

---

## Implementation Notes

### Dependencies

```python
# Same as Human Design
import swisseph as swe
from datetime import datetime, timedelta
import pytz
from typing import Dict, List, Tuple, Any
```

### Precision Requirements

- **Planetary positions**: Same as HD (±0.01°)
- **Gene Key numbers**: 1-64 (integer)
- **Frequency states**: Shadow/Gift/Siddhi (categorical)
- **Design time**: 88° solar arc (identical to HD)

### Validation

```python
def validate_gene_key_number(number: int):
    """Validate Gene Key number is in valid range."""
    if not (1 <= number <= 64):
        raise ValueError(f"Gene Key must be 1-64, got {number}")

def validate_frequency(frequency: str):
    """Validate frequency is valid."""
    valid = ["Shadow", "Gift", "Siddhi"]
    if frequency not in valid:
        raise ValueError(f"Frequency must be in {valid}, got {frequency}")
```

---

## Archetypal Resonance Formula

```python
def calculate_archetypal_resonance(
    gene_key_names: List[str],
    birth_data: Dict
) -> float:
    """
    Calculate archetypal resonance score.
    
    Measures coherence between Gene Keys in profile.
    """
    # Example simplified calculation
    coherence = 0.0
    
    # Check thematic alignment
    themes = [get_theme(name) for name in gene_key_names]
    unique_themes = len(set(themes))
    coherence += (4 - unique_themes) * 0.1  # More unified = higher
    
    # Check codon ring connections
    codon_rings = [get_codon_ring(name) for name in gene_key_names]
    shared_rings = len(set(codon_rings[0]).intersection(*codon_rings[1:]))
    coherence += shared_rings * 0.15
    
    # Check programming partner presence
    if any(has_programming_partner_in_profile(gk, gene_key_names) 
           for gk in gene_key_names):
        coherence += 0.25
    
    return min(1.0, coherence)
```

---

## References

1. Richard Rudd - *The Gene Keys: Unlocking the Higher Purpose Hidden in Your DNA*
2. Richard Rudd - *The Gene Keys Golden Path*
3. WitnessOS Source Code - `gene_keys.py`, `gene_keys_models.py`
4. Genetic Codon Tables - Standard genetic code

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Source**: WitnessOS/docs/engines/gene_keys.py  
**Lines of Code**: 384
