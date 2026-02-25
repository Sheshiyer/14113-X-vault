# Gene Keys Quick Reference

**Fast lookup for key formulas, mappings, and calculations**

---

## The 9 Gates Formula

### Activation Sequence (4 gates)
```
Life's Work  = Personality Sun    (birth moment)
Evolution    = Personality Earth  (birth moment)
Radiance     = Design Sun         (88 days before birth)
Purpose      = Design Earth       (88 days before birth)
```

### Venus Sequence (2 gates)
```
Attraction = Personality Venus    (birth moment)
Magnetism  = Design Venus         (88 days before birth)
```

### Pearl Sequence (3 gates)
```
Vocation = Jupiter at birth
Culture  = Saturn at birth
Brand    = Uranus at birth
```

---

## Core Calculation

### Input Required
```python
birth_date: date       # Year, month, day
birth_time: time       # Hour, minute, second (exact)
birth_location: tuple  # (latitude, longitude)
timezone: str          # IANA format ("America/New_York")
```

### Astronomical Flow
```
1. Birth datetime + location → Planetary positions (zodiac degrees)
2. Zodiac degrees → Gate numbers (1-64) via I-Ching mapping
3. Gate numbers → Gene Keys (1:1 correspondence)
4. Gene Keys → Shadow-Gift-Siddhi pathways
```

### Design Time Calculation
```python
design_datetime = birth_datetime - timedelta(days=88)
# Calculate all planetary positions at this earlier time
```

---

## Three Frequencies at a Glance

| Frequency | Consciousness | Energy | Self-Consciousness Level |
|-----------|---------------|--------|--------------------------|
| **Shadow** | Victim | Fear-based reactive | Pre-reflective (90% time) |
| **Gift** | Genius | Creative service | Reflective (55% time) |
| **Siddhi** | Divine | Transcendent unity | Radiant (60% time) |

**Transformation Path:** Shadow → Gift → Siddhi  
**Method:** Awareness → Embodiment → Surrender

---

## Programming Partners

### Codon Pairs (Examples)
```
GK 1 ↔ GK 33    (Entropy/Freshness ↔ Forgetting/Mindfulness)
GK 2 ↔ GK 34    (Dislocation/Orientation ↔ Force/Strength)
GK 3 ↔ GK 35    (Chaos/Innovation ↔ Nervous/Adventure)
...and so on through all 64
```

**Purpose:** Dynamic balance, complementary tensions, integration work

---

## Sample Gene Keys

### Gene Key 1: The Creative
```
Shadow:  Entropy → Creative stagnation, stuck patterns
Gift:    Freshness → Spontaneous creativity, new perspectives  
Siddhi:  Beauty → Divine aesthetic perfection
Codon:   CCG (Proline)
Partner: 33
Theme:   Breaking free through creative spontaneity
```

### Gene Key 2: The Orientation
```
Shadow:  Dislocation → Lost, no direction
Gift:    Orientation → Natural guidance, helping others
Siddhi:  Unity → Transcending separation
Codon:   GGC (Glycine)
Partner: 34
Theme:   Finding direction through inner compass
```

### Gene Key 3: The Innovation
```
Shadow:  Chaos → Overwhelming confusion
Gift:    Innovation → Breakthrough solutions
Siddhi:  Innocence → Childlike wonder
Codon:   AAG (Lysine)
Partner: 35
Theme:   Transforming chaos into innovation
```

---

## Gate to Zodiac Mapping

### Basic Formula
```
360° zodiac ÷ 64 gates = 5.625° per gate (approximate)
```

**Note:** Actual boundaries non-uniform due to I-Ching traditional ordering

### Example
```
Sun at 15° Aries
→ Zodiac position: 15° (Aries = 0° start)
→ Gate calculation: maps to Gate 51
→ Gene Key 51: The Awakening
```

---

## I-Ching Correspondence

```
Gate Number = Hexagram Number = Gene Key Number

Gate 1 = Hexagram 1 = Gene Key 1
Gate 2 = Hexagram 2 = Gene Key 2
...
Gate 64 = Hexagram 64 = Gene Key 64
```

**Direct 1:1 mapping across all three systems**

---

## Sequence Interpretation Quick Guide

### Activation (Identity)
- **Purpose:** Who you are at the core
- **Question:** What is my life purpose?
- **Focus:** Creative expression and spiritual mission
- **Gates:** 4 (Personality + Design, Sun + Earth)

### Venus (Relationships)
- **Purpose:** How you relate and attract
- **Question:** What are my relationship patterns?
- **Focus:** Love, attraction, and connection
- **Gates:** 2 (Personality + Design, Venus only)

### Pearl (Prosperity)
- **Purpose:** How you manifest materially
- **Question:** What is my vocation and contribution?
- **Focus:** Career, culture, and unique brand
- **Gates:** 3 (Jupiter, Saturn, Uranus at birth)

---

## Self-Consciousness Impact

### Pre-Reflective (Shadow Dominant)
```
Frequency Distribution: 90% Shadow, 10% Gift, 0% Siddhi
State: Automatic reactive patterns
Access: Limited awareness, victim narratives
```

### Reflective (Gift Accessible)
```
Frequency Distribution: 40% Shadow, 55% Gift, 5% Siddhi
State: Conscious choice emerging
Access: Observing patterns, service orientation
```

### Radiant (Siddhi Stabilizing)
```
Frequency Distribution: 10% Shadow, 30% Gift, 60% Siddhi
State: Pure witnessing
Access: Non-dual awareness, being as service
```

---

## Pathworking Practices

### Stage 1: Shadow Awareness
```
1. Recognize the pattern
2. Non-judgmental observation
3. Feel the evolutionary pressure
4. Accept its purpose
```

### Stage 2: Gift Embodiment
```
1. Identify the Gift opposite
2. Practice micro-shifts
3. Serve others through Gift
4. Stabilize as baseline
```

### Stage 3: Siddhi Surrender
```
1. Stabilize in Gift first
2. Release all striving
3. Allow grace to descend
4. Rest in pure being
```

---

## Data Structure Cheatsheet

### GeneKey Object
```python
{
  number: int (1-64),
  name: str,
  shadow: str,
  gift: str,
  siddhi: str,
  codon: str,
  amino_acid: str,
  programming_partner: int,
  physiology: str,
  shadow_description: str,
  gift_description: str,
  siddhi_description: str,
  keywords: List[str],
  life_theme: str
}
```

### SequenceGate Object
```python
{
  name: str,              # "Life's Work", "Evolution", etc.
  description: str,       # Purpose of this gate
  gene_key: GeneKey,      # Full Gene Key object
  calculation_method: str # "Sun position at birth", etc.
}
```

### GeneKeysSequence Object
```python
{
  name: str,                    # "Activation Sequence", etc.
  description: str,             # Sequence purpose
  gates: List[SequenceGate]     # 2-4 gates depending on sequence
}
```

### GeneKeysProfile Object
```python
{
  activation_sequence: GeneKeysSequence,
  venus_sequence: GeneKeysSequence,
  pearl_sequence: GeneKeysSequence,
  birth_date: date,
  primary_gene_key: GeneKey,       # Life's Work
  programming_partner: GeneKey
}
```

---

## Error Handling

### Out of Range Gates
```python
if number < 1 or number > 64:
    number = ((number - 1) % 64) + 1  # Wrap to 1-64
```

### Missing Data
```python
gene_key = data.get(str(number), data['1'])  # Fallback to GK 1
planetary_gate = gates.get('venus', 1)       # Fallback to 1
```

---

## Planetary Time Layers

| Layer | Time | Awareness | Gene Keys Role |
|-------|------|-----------|----------------|
| **Personality** | Birth moment | Conscious | What we know about ourselves |
| **Design** | 88 days before | Unconscious | What operates through us |

**Integration:** Both layers necessary for complete picture

---

## 64 Codon Mapping

```
64 Gene Keys ↔ 64 I-Ching Hexagrams ↔ 64 Genetic Codons

Codons use 4 bases (A, T, G, C)
4³ = 64 possible combinations
Each codon codes for amino acid (20 total)
```

**Example:**
- Gene Key 1 → Codon CCG → Amino Acid: Proline
- Gene Key 2 → Codon GGC → Amino Acid: Glycine

---

## Integration with Other Systems

### Human Design
```
Same: Astronomical calculations, gate numbers
Different: Interpretation (mechanics vs consciousness)
Compatible: Can use same birth data
```

### I-Ching
```
Same: 64-fold system, hexagram structure
Different: Divination vs archetypal mapping
Compatible: Direct gate correspondence
```

### Genetics
```
Same: Codon structure, amino acid mapping
Different: Symbolic vs literal biology
Compatible: Consciousness-matter bridge
```

---

## Common Calculations

### Gate from Sun Position
```python
def sun_to_gate(sun_zodiac_degree: float) -> int:
    # Simplified - actual mapping more complex
    gate = int((sun_zodiac_degree % 360) / 5.625) + 1
    return gate if 1 <= gate <= 64 else 1
```

### Life's Work Gene Key
```python
def get_lifes_work(birth_data) -> GeneKey:
    sun_gate = calculate_sun_position(birth_data)
    return gene_keys_data[str(sun_gate)]
```

### Programming Partner
```python
def get_partner(gene_key: GeneKey) -> GeneKey:
    partner_number = gene_key.programming_partner
    return gene_keys_data[str(partner_number)]
```

---

## Interpretation Template

```
🧬 Gene Keys Compass Reading

👤 Birth: {date} at {time} in {location}
🎯 Focus: {sequence_name}

🌟 Life's Work: GK {number} - {name}
   🌑 Shadow: {shadow}
   🎁 Gift: {gift}
   ✨ Siddhi: {siddhi}
   🧬 Codon: {codon} ({amino_acid})
   
🤝 Programming Partner: GK {partner_number}

🔥 Activation Sequence:
   Life's Work: GK {n}
   Evolution: GK {n}
   Radiance: GK {n}
   Purpose: GK {n}

🛤️ Pathworking Guidance:
   1. Contemplate Life's Work...
   2. Notice Shadow patterns...
   3. Practice Gift expression...
   4. Study programming partner...
   5. Frequency shift: awareness → embodiment → surrender
```

---

## Performance Notes

- **Data Load:** ~1475 lines JSON → ~2MB memory
- **Single Calculation:** <100ms (excluding astronomy)
- **Astronomy:** 200-500ms (cached, reused)
- **Sequences:** All three from single astronomical calculation

---

## Key Insights Summary

1. **Same astronomy as Human Design** - ensures compatibility
2. **Design time = 88 days before birth** - universal constant
3. **9 total gates** - 4 Activation, 2 Venus, 3 Pearl
4. **64 transformation pathways** - Shadow → Gift → Siddhi
5. **Self-consciousness determines frequency access** - witness capacity key
6. **Programming partners create balance** - complementary codon pairs
7. **All frequencies are valid** - Shadow not "bad", serves evolution
8. **Life's Work is anchor** - primary focus for pathworking

---

## Resources

- **Full Documentation:** See other .md files in this directory
- **Source Code:** WitnessOS `/docs/engines/gene_keys.py`
- **Data:** WitnessOS `/docs/api/engines/data/gene_keys/archetypes.json`
- **Gene Keys Book:** Richard Rudd's original transmission

---

**Quick Reference Version:** 2026-01-25  
**For:** Tryambakam Noesis Evolution Docs  
**Status:** Complete extraction ✅
