# Gene Keys Core Architecture

**Source:** WitnessOS `gene_keys.py` and `gene_keys_models.py`

---

## System Overview

The Gene Keys Compass Engine transforms astronomical birth data into archetypal consciousness mappings through three primary sequences: Activation, Venus, and Pearl. Each sequence reveals specific aspects of an individual's evolutionary blueprint.

```
Birth Data Input
    ↓
Astronomical Calculations (via Human Design logic)
    ↓
Planetary Positions → I-Ching Gates (1-64)
    ↓
Gate Numbers → Gene Keys Archetypes
    ↓
Shadow-Gift-Siddhi Frequencies
    ↓
Hologenetic Profile + Pathworking Guidance
```

---

## Component Structure

### 1. **GeneKeysCompass** (Main Engine Class)

```python
class GeneKeysCompass(BaseEngine):
    """
    Gene Keys Compass Engine
    
    Provides Gene Keys archetypal analysis based on birth data,
    calculating the Activation, Venus, and Pearl sequences.
    """
```

**Key Properties:**
- `engine_name`: "Gene Keys Compass"
- `description`: Archetypal analysis with sequences
- `input_model`: GeneKeysInput
- `output_model`: GeneKeysOutput

**Dependencies:**
- `DivinationCalculator`: Archetypal resonance calculations
- `AstrologyCalculator`: Human Design astronomical data
- `GeneKeysData`: Loaded from JSON (64 keys data)

---

## Core Calculation Flow

### Phase 1: Data Loading

```python
def _load_gene_keys_data(self) -> None:
    """Load Gene Keys data from JSON files."""
    gene_keys_json = load_json_data("gene_keys", "archetypes.json")
    self.gene_keys_data = GeneKeysData(**gene_keys_json)
```

**Loaded Data:**
- 64 Gene Keys with Shadow-Gift-Siddhi
- Programming partner mappings
- Codon and amino acid associations
- Sequence definitions
- Frequency descriptions
- Pathworking methods

---

### Phase 2: Astronomical Gate Calculation

```python
def _calculate_gene_keys_from_astronomy(
    self, birth_date, birth_time, birth_location, timezone
) -> Dict[str, int]:
    """
    Calculate Gene Key numbers using proper astronomical calculations.
    Gene Keys use the same I-Ching gates as Human Design.
    """
```

**Process:**

1. **Combine birth date and time**
   ```python
   birth_datetime = datetime.combine(birth_date, birth_time)
   lat, lon = birth_location
   ```

2. **Calculate Human Design data**
   ```python
   hd_data = self.astro_calc.calculate_human_design_data(
       birth_datetime, lat, lon, timezone
   )
   ```

3. **Extract gate numbers from planetary positions**

   **Activation Sequence Gates:**
   ```python
   activation_gates = {
       'lifes_work': hd_data['personality_gates']['sun'],    # Personality Sun
       'evolution': hd_data['personality_gates']['earth'],   # Personality Earth
       'radiance': hd_data['design_gates']['sun'],           # Design Sun
       'purpose': hd_data['design_gates']['earth']           # Design Earth
   }
   ```

   **Venus Sequence Gates:**
   ```python
   venus_gates = {
       'attraction': hd_data['personality_gates'].get('venus', 1),
       'magnetism': hd_data['design_gates'].get('venus', 1)
   }
   ```

   **Pearl Sequence Gates:**
   ```python
   pearl_gates = {
       'vocation': hd_data['personality_gates'].get('jupiter', 1),
       'culture': hd_data['personality_gates'].get('saturn', 1),
       'brand': hd_data['personality_gates'].get('uranus', 1)
   }
   ```

4. **Return combined gate dictionary**
   ```python
   return {
       **activation_gates,
       **venus_gates,
       **pearl_gates
   }
   ```

---

### Phase 3: Sequence Construction

#### Activation Sequence

```python
def _create_activation_sequence(
    self, birth_date, birth_time, birth_location, timezone
) -> GeneKeysSequence:
    """Create the Activation Sequence using astronomical calculations."""
```

**Four Gates:**

1. **Life's Work**
   - Calculation: Sun position at birth (Personality Sun)
   - Description: Core life purpose and creative expression
   - Primary anchor of the profile

2. **Evolution**
   - Calculation: Earth position at birth (Personality Earth)
   - Description: Path of personal development and growth
   - Complementary to Life's Work

3. **Radiance**
   - Calculation: Sun position 88 days before birth (Design Sun)
   - Description: Gift to humanity and how you shine
   - Unconscious creative expression

4. **Purpose**
   - Calculation: Earth position 88 days before birth (Design Earth)
   - Description: Deepest calling and spiritual mission
   - Unconscious foundation

**Gate Structure:**
```python
gates = [
    SequenceGate(
        name="Life's Work",
        description="Your core life purpose and creative expression",
        gene_key=self._get_gene_key_by_number(lifes_work_num),
        calculation_method="Sun position at birth"
    ),
    # ... (3 more gates)
]

return GeneKeysSequence(
    name="Activation Sequence",
    description="The four primary gates that form your core genetic blueprint",
    gates=gates
)
```

---

#### Venus Sequence

```python
def _create_venus_sequence(
    self, birth_date, birth_time, birth_location, timezone
) -> GeneKeysSequence:
    """Create the Venus Sequence using astronomical calculations."""
```

**Two Gates:**

1. **Attraction**
   - Calculation: Venus position at birth
   - Description: What draws you to others and others to you
   - Conscious relationship pattern

2. **Magnetism**
   - Calculation: Venus position 88 days before birth
   - Description: Natural charisma and appeal
   - Unconscious attraction field

---

#### Pearl Sequence

```python
def _create_pearl_sequence(
    self, birth_date, birth_time, birth_location, timezone
) -> GeneKeysSequence:
    """Create the Pearl Sequence using astronomical calculations."""
```

**Three Gates:**

1. **Vocation**
   - Calculation: Jupiter position at birth
   - Description: Natural career path and work style
   - Prosperity through purpose

2. **Culture**
   - Calculation: Saturn position at birth
   - Description: Contribution to collective evolution
   - Social responsibility

3. **Brand**
   - Calculation: Uranus position at birth
   - Description: Unique signature in the world
   - Revolutionary expression

---

### Phase 4: Profile Assembly

```python
# Get primary Gene Key and programming partner
primary_gene_key = activation_sequence.gates[0].gene_key  # Life's Work
programming_partner = self._get_gene_key_by_number(
    primary_gene_key.programming_partner
)

# Create profile
profile = GeneKeysProfile(
    activation_sequence=activation_sequence,
    venus_sequence=venus_sequence,
    pearl_sequence=pearl_sequence,
    birth_date=birth_date,
    primary_gene_key=primary_gene_key,
    programming_partner=programming_partner
)
```

---

### Phase 5: Pathworking Guidance Generation

```python
def _generate_pathworking_guidance(
    self, profile: GeneKeysProfile, focus: Optional[str]
) -> List[str]:
    """Generate pathworking guidance based on the profile."""
```

**Guidance Components:**

1. **Core contemplation**
   - Begin with Life's Work Gene Key
   - Shadow awareness practice
   - Gift embodiment practice

2. **Programming partner study**
   - Balance through complementary key
   - Dynamic tension work

3. **Sequence-specific guidance**
   - Activation: Core purpose
   - Venus: Relationships
   - Pearl: Vocation alignment

4. **Frequency shifting instruction**
   - Awareness → Embodiment → Surrender
   - All frequencies serve evolution

**Example Output:**
```python
guidance = [
    "Begin with contemplation of your Life's Work Gene Key {number}: {name}",
    "Notice when you operate from the Shadow of {shadow} and practice shifting to the Gift of {gift}",
    "Your programming partner is Gene Key {partner_number}, study both keys together for balance",
    "Practice the art of frequency shifting: awareness of Shadow, embodiment of Gift, surrender to Siddhi",
    "Remember that all three frequencies serve the evolution of consciousness"
]
```

---

### Phase 6: Key Insights Generation

```python
key_insights = [
    f"Your Life's Work is Gene Key {primary_gene_key.number}: {primary_gene_key.name}",
    f"Transform {primary_gene_key.shadow} (Shadow) into {primary_gene_key.gift} (Gift)",
    f"Your programming partner Gene Key {programming_partner.number} provides balance and perspective",
]
```

**Conditional insights based on focus:**
- Venus focus: Attraction key insight
- Pearl focus: Vocation key insight

---

### Phase 7: Field Resonance Calculation

```python
gene_key_names = [gate.gene_key.name for gate in activation_sequence.gates]
field_resonance = self.divination_calc.calculate_archetypal_resonance(
    gene_key_names,
    {"birth_date": str(birth_date)}
)
```

Uses divination calculator to assess archetypal field strength and coherence.

---

## Output Structure

```python
return {
    "profile": profile,                              # Complete Gene Keys profile
    "birth_date": birth_date,                        # Birth data used
    "calculation_timestamp": datetime.now(),          # When calculated
    "focus_sequence": validated_input.focus_sequence, # Which sequence focused
    "key_insights": key_insights,                    # Summary insights
    "pathworking_guidance": pathworking_guidance,    # Practice guidance
    "guidance_summary": f"Your Gene Keys reveal...", # One-line summary
    "primary_life_theme": primary_gene_key.life_theme,
    "programming_partnership": f"Gene Key {x} and {y} work together",
    "field_resonance": field_resonance,              # Archetypal strength
    "field_signature": "gene_keys_archetypal_compass"
}
```

---

## Interpretation Generation

```python
def _interpret(
    self, calculation_results: Dict[str, Any], input_data: GeneKeysInput
) -> str:
    """Interpret calculation results into human-readable format."""
```

**Output Format:**

```
🧬 Gene Keys Compass Reading

👤 Birth Date: {date}
🎯 Focus: {sequence} Sequence
🕐 Reading Time: {timestamp}

🌟 Life's Work: Gene Key {number} - {name}
🌑 Shadow: {shadow}
🎁 Gift: {gift}
✨ Siddhi: {siddhi}
🧬 Codon: {codon} ({amino_acid})
🎭 Life Theme: {life_theme}

🤝 Programming Partner: Gene Key {number} - {name}
   Shadow: {shadow} | Gift: {gift} | Siddhi: {siddhi}

🔥 Activation Sequence:
   Life's Work: Gene Key {number} - {name}
   Evolution: Gene Key {number} - {name}
   Radiance: Gene Key {number} - {name}
   Purpose: Gene Key {number} - {name}

💕 Venus Sequence: [if focused]
💎 Pearl Sequence: [if focused]

🎯 Core Guidance: {guidance_summary}

🛤️ Pathworking Steps:
   1. {guidance_1}
   2. {guidance_2}
   ...
```

---

## Key Design Decisions

### 1. Astronomical Foundation
- **Uses Human Design calculations** for gate positions
- Ensures compatibility with HD system
- 88-day design time is universal constant

### 2. Sequence Priority
- **Activation is primary** - always calculated
- Venus and Pearl are optional based on focus
- Reduces complexity for basic readings

### 3. Programming Partners
- **Always included** in profile
- Provides balance and integration
- Essential for pathworking

### 4. Frequency Presentation
- **All three frequencies** presented equally
- No hierarchy - Shadow is not "bad"
- Evolutionary perspective emphasized

### 5. Pathworking Guidance
- **Adaptive to focus area** (sequence-specific)
- Contemplation-oriented (not prescriptive)
- Frequency-shifting framework emphasized

---

## Integration Points

### With Human Design Engine
- Shares astronomical calculation logic
- Same gate numbers (1-64)
- Different interpretation frameworks

### With I-Ching Engine
- Direct hexagram correspondence
- Gate number = Hexagram number
- Different wisdom traditions

### With Divination Calculator
- Archetypal resonance assessment
- Field coherence measurement
- Cross-system validation

---

## Error Handling

### Gene Key Lookup Safety
```python
def _get_gene_key_by_number(self, number: int) -> GeneKey:
    """Get Gene Key by its number."""
    # Ensure number is within valid range
    if number < 1 or number > 64:
        number = ((number - 1) % 64) + 1
    
    # If Gene Key doesn't exist in data, use fallback
    if str(number) not in self.gene_keys_data.gene_keys:
        number = 1  # Use Gene Key 1 as fallback
    
    key_data = self.gene_keys_data.gene_keys[str(number)]
    return GeneKey(**key_data)
```

**Safety Features:**
- Modulo operation keeps numbers in range
- Fallback to Gene Key 1 if missing
- Prevents crashes from bad data

---

## Performance Considerations

1. **Data Loading**
   - JSON loaded once at initialization
   - Cached in memory for all calculations
   - ~1475 lines parsed into structured models

2. **Calculation Reuse**
   - Single astronomical calculation for all sequences
   - Gate dictionary reused across sequence creation
   - Minimizes redundant astrology calls

3. **Lazy Evaluation**
   - Programming partner only loaded if needed
   - Sequences only created if focused
   - Interpretation only generated on request

---

## Summary

The Gene Keys Core Architecture demonstrates:
- **Clean separation of concerns** (calculation vs interpretation)
- **Astronomical accuracy** (via Human Design integration)
- **Flexible focus** (sequence selection)
- **Safety and robustness** (error handling)
- **Efficient data flow** (minimal redundancy)

This architecture supports both simple readings (Activation only) and comprehensive analysis (all sequences) with the same underlying calculation engine.
