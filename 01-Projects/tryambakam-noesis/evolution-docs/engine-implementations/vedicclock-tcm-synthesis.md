# VedicClock-TCM Synthesis Logic

**Purpose:** Multi-dimensional consciousness optimization through temporal awareness - enabling the witness to recognize and align with both cosmic (Vedic) and somatic (TCM) rhythms for moment-by-moment self-authorship.

**Framework:** The witness capacity develops through recognizing oneself as both observer and participant in interlocking time cycles. The author capacity emerges when one consciously aligns activities, practices, and intentions with optimal energy windows across macro (life curriculum) and micro (daily/hourly) timescales.

**Integration:** WitnessOS provides the calculation engine for multi-dimensional temporal analysis; Noesis provides the self-consciousness interpretation layer that transforms data into actionable witness development guidance.

---

## Core Philosophy

The VedicClock-TCM engine develops witness capacity through **temporal self-awareness** - the recognition that consciousness operates within nested cycles:

1. **Macro-Temporal Witness**: Vimshottari Dasha reveals the "life curriculum" - what lessons your consciousness is being taught across years and decades
2. **Meso-Temporal Witness**: Panchanga reveals daily cosmic energies - the quality of consciousness available in any given day
3. **Micro-Temporal Witness**: TCM Organ Clock reveals hourly bodily rhythms - when specific organs and elements are most active

**The Self-Consciousness Insight**: You are not separate from these cycles - you ARE these cycles becoming aware of themselves. The witness position emerges when you can observe yourself moving through time while simultaneously recognizing time moving through you.

---

## Key Calculations

### 1. Vimshottari Dasha Context (Life Curriculum)

The engine calculates your position within the 120-year Vimshottari cycle based on birth data.

```python
# Source: vedicclock_tcm.py, lines 274-305

def _calculate_vimshottari_context(
    self, input_data: VedicClockTCMInput, target_datetime: datetime
) -> VimshottariContext:
    """Calculate current Vimshottari Dasha context."""
    birth_datetime = datetime.combine(input_data.birth_date, input_data.birth_time)
    age_years = (target_datetime - birth_datetime).days / 365.25

    # Dasha sequence and periods (years)
    dasha_sequence = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
    dasha_periods = [7, 20, 6, 10, 7, 18, 16, 19, 17]  # Total: 120 years

    total_years = 0
    current_dasha = "Jupiter"  # Default
    remaining_years = 8.5

    for i, (planet, period) in enumerate(zip(dasha_sequence, dasha_periods)):
        if age_years <= total_years + period:
            current_dasha = planet
            remaining_years = total_years + period - age_years
            break
        total_years += period

    return VimshottariContext(
        mahadasha_lord=current_dasha,
        mahadasha_remaining_years=remaining_years,
        antardasha_lord="Mercury",  # Sub-period calculation
        antardasha_remaining_months=3.2,
        pratyantardasha_lord="Venus",
        life_lesson_theme=self._get_dasha_theme(current_dasha),
        karmic_focus=self._get_karmic_focus(current_dasha)
    )
```

**Dasha Themes** (lines 307-320):
| Planet | Life Lesson Theme | Karmic Focus |
|--------|-------------------|--------------|
| Jupiter | Expansion through wisdom and spiritual growth | Teaching, mentoring, sharing wisdom |
| Saturn | Discipline, structure, karmic lessons | Building foundations, accepting responsibility |
| Mercury | Communication, learning, intellectual development | Clear communication, intellectual honesty |
| Venus | Love, creativity, material harmony | Harmonious relationships, creative expression |
| Mars | Action, courage, energy mastery | Righteous action, energy management |
| Moon | Emotional intelligence, intuitive development | Emotional healing, nurturing others |
| Sun | Leadership, self-expression, soul purpose | Authentic self-expression, leadership |
| Rahu | Innovation, breaking patterns, material success | Breaking limiting patterns, embracing change |
| Ketu | Spiritual detachment, inner wisdom | Releasing attachments, spiritual surrender |

### 2. Panchanga State (Daily Cosmic Energies)

```python
# Source: vedicclock_tcm.py, lines 337-366

def _calculate_panchanga_state(self, target_datetime: datetime) -> PanchangaState:
    """Calculate current Vedic Panchanga state."""
    day_of_year = target_datetime.timetuple().tm_yday

    # Tithi calculation (lunar day - 15 phases)
    tithi_names = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
                  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
                  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"]
    current_tithi = tithi_names[day_of_year % 15]

    # Nakshatra calculation (lunar mansion - 27 divisions)
    nakshatra_names = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
                      "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha"]
    current_nakshatra = nakshatra_names[day_of_year % 10]

    # Element determination based on hour and nakshatra
    elements = ["Fire", "Earth", "Air", "Water", "Ether"]
    dominant_element = elements[target_datetime.hour % 5]

    return PanchangaState(
        tithi=current_tithi,
        vara=target_datetime.strftime("%A"),  # Weekday
        nakshatra=current_nakshatra,
        yoga="Vishkumbha",
        karana="Bava",
        dominant_element=dominant_element,
        energy_quality=self._determine_energy_quality(target_datetime),
        auspiciousness_score=self._calculate_auspiciousness(target_datetime)
    )
```

**Energy Quality Determination** (lines 480-492):
```python
def _determine_energy_quality(self, dt: datetime) -> str:
    """Determine overall energy quality for the time."""
    hour = dt.hour
    if 6 <= hour <= 10:
        return "Rising Energy"
    elif 10 <= hour <= 14:
        return "Peak Energy"
    elif 14 <= hour <= 18:
        return "Stable Energy"
    elif 18 <= hour <= 22:
        return "Descending Energy"
    else:
        return "Rest Energy"
```

### 3. TCM Organ Clock State (Bodily Rhythms)

```python
# Source: vedicclock_tcm.py, lines 368-403

def _calculate_tcm_organ_state(self, target_datetime: datetime) -> TCMOrganState:
    """Calculate current TCM Organ Clock state."""
    hour = target_datetime.hour

    # TCM Organ Clock (24-hour cycle, 2-hour windows)
    organ_schedule = {
        1: ("Liver", "Wood"), 3: ("Liver", "Wood"),
        5: ("Lung", "Metal"), 7: ("Large Intestine", "Metal"),
        9: ("Stomach", "Earth"), 11: ("Spleen", "Earth"),
        13: ("Heart", "Fire"), 15: ("Small Intestine", "Fire"),
        17: ("Bladder", "Water"), 19: ("Kidney", "Water"),
        21: ("Pericardium", "Fire"), 23: ("Triple Heater", "Fire")
    }

    # Find current organ based on hour
    current_hour_key = ((hour - 1) // 2) * 2 + 1
    if current_hour_key not in organ_schedule:
        current_hour_key = 1

    primary_organ, element = organ_schedule[current_hour_key]

    # Determine energy direction within 2-hour window
    hour_in_cycle = hour % 2
    energy_direction = "peak" if hour_in_cycle == 0 else "ascending"

    return TCMOrganState(
        primary_organ=primary_organ,
        secondary_organ=self._get_secondary_organ(primary_organ),
        element=element,
        energy_direction=energy_direction,
        optimal_activities=self._get_optimal_activities(primary_organ, energy_direction),
        avoid_activities=self._get_avoid_activities(primary_organ)
    )
```

### 4. Elemental Synthesis (Vedic-TCM Harmony)

```python
# Source: vedicclock_tcm.py, lines 405-438

def _synthesize_elements(self, panchanga: PanchangaState, tcm: TCMOrganState) -> ElementalSynthesis:
    """Synthesize Vedic and TCM elemental energies."""
    # Element correspondence mapping
    vedic_tcm_harmony = {
        ("Fire", "Fire"): 1.0,    # Perfect resonance
        ("Fire", "Wood"): 0.8,    # Nourishing synergy
        ("Earth", "Earth"): 1.0,  # Perfect grounding
        ("Earth", "Metal"): 0.7,  # Supportive foundation
        ("Air", "Metal"): 0.9,    # Excellent refinement
        ("Water", "Water"): 1.0,  # Perfect flow
        ("Water", "Wood"): 0.8,   # Nourishing growth
        ("Ether", "Fire"): 0.9    # Transcendent joy
    }

    harmony_key = (panchanga.dominant_element, tcm.element)
    harmony_level = vedic_tcm_harmony.get(harmony_key, 0.6)

    synthesis_qualities = {
        1.0: "Perfect Harmony",
        0.9: "Excellent Synergy",
        0.8: "Good Resonance",
        0.7: "Moderate Alignment",
        0.6: "Neutral Balance"
    }

    return ElementalSynthesis(
        vedic_element=panchanga.dominant_element,
        tcm_element=tcm.element,
        harmony_level=harmony_level,
        synthesis_quality=synthesis_qualities.get(harmony_level, "Requires Balancing"),
        recommended_practices=self._get_harmonizing_practices(
            panchanga.dominant_element, tcm.element
        )
    )
```

### 5. Personal Resonance Scoring

```python
# Source: vedicclock_tcm.py, lines 440-466

def _calculate_personal_resonance(
    self, input_data: VedicClockTCMInput, vimshottari: VimshottariContext,
    panchanga: PanchangaState, tcm: TCMOrganState
) -> float:
    """Calculate how well current energies align with personal chart."""
    resonance_factors = []

    # Dasha alignment - benefic planets score higher
    if vimshottari.mahadasha_lord in ["Jupiter", "Venus", "Mercury"]:
        resonance_factors.append(0.8)
    else:
        resonance_factors.append(0.6)

    # Time-based resonance - daytime higher
    current_hour = datetime.now().hour
    if 6 <= current_hour <= 18:  # Daytime
        resonance_factors.append(0.7)
    else:
        resonance_factors.append(0.5)

    # Elemental resonance - same elements higher
    if panchanga.dominant_element == tcm.element:
        resonance_factors.append(0.9)
    else:
        resonance_factors.append(0.6)

    return sum(resonance_factors) / len(resonance_factors)
```

### 6. Consciousness Optimization Generation

```python
# Source: vedicclock_tcm.py, lines 555-591

def _generate_consciousness_optimization(
    self, input_data: VedicClockTCMInput, vimshottari: VimshottariContext,
    panchanga: PanchangaState, tcm: TCMOrganState,
    elemental_synthesis: ElementalSynthesis, personal_resonance: float
) -> ConsciousnessOptimization:
    """Generate personalized consciousness optimization recommendations."""

    # Primary focus combines dasha theme with current TCM element
    primary_focus = f"{vimshottari.life_lesson_theme} through {tcm.element} element mastery"

    # Secondary focuses
    secondary_focuses = [
        f"Harmonizing {panchanga.dominant_element}-{tcm.element} energies",
        f"Optimizing {tcm.primary_organ} function",
        "Integrating cosmic and bodily rhythms"
    ]

    # Combine elemental practices with organ-specific activities
    optimal_practices = elemental_synthesis.recommended_practices + tcm.optimal_activities[:2]

    # Timing and energy management guidance
    timing_guidance = f"Best practiced during {tcm.energy_direction} phase of {tcm.primary_organ} time"
    energy_management = f"Work with {panchanga.energy_quality.lower()} while supporting {tcm.element} element"

    return ConsciousnessOptimization(
        primary_focus=primary_focus,
        secondary_focuses=secondary_focuses,
        optimal_practices=optimal_practices,
        timing_guidance=timing_guidance,
        energy_management=energy_management,
        integration_method="Combine daily practices with moment-by-moment awareness of energy shifts"
    )
```

---

## Data Model

### Input Model (vedicclock_tcm_models.py, lines 20-59)

```python
class VedicClockTCMInput(CloudflareEngineInput, BirthDataInput):
    """Input model for VedicClock-TCM Integration Engine."""

    # Required birth data
    birth_time: time = Field(..., description="Birth time is required")
    birth_location: Tuple[float, float] = Field(..., description="Coordinates [lat, lon]")
    timezone: str = Field(..., description="Birth timezone")

    # Analysis parameters
    target_date: Optional[str] = Field(None, description="Date for analysis")
    target_time: Optional[str] = Field(None, description="Time for analysis")
    analysis_depth: Literal["basic", "detailed", "comprehensive"] = "detailed"

    # Optimization focus areas
    optimization_focus: Optional[List[str]] = Field(
        default=None,
        description="Areas: ['energy', 'creativity', 'health', 'spiritual', 'career']"
    )

    # Prediction settings
    include_predictions: bool = True
    prediction_hours: int = Field(default=24, ge=1, le=168)
```

### Output Models (vedicclock_tcm_models.py, lines 63-157)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `VimshottariContext` | Life curriculum context | mahadasha_lord, life_lesson_theme, karmic_focus |
| `PanchangaState` | Daily cosmic energies | tithi, nakshatra, dominant_element, energy_quality |
| `TCMOrganState` | Bodily rhythms | primary_organ, element, energy_direction, optimal_activities |
| `ElementalSynthesis` | Vedic-TCM harmony | harmony_level, synthesis_quality, recommended_practices |
| `ConsciousnessOptimization` | Personalized guidance | primary_focus, optimal_practices, timing_guidance |
| `OptimizationWindow` | Future opportunities | start_time, opportunity_type, potency_score |

### Data Container (vedicclock_tcm_models.py, lines 161-179)

```python
class VedicClockTCMData(BaseModel):
    """Data container for VedicClock-TCM engine."""

    # Vimshottari Data
    dasha_periods: Dict[str, Any]
    planetary_qualities: Dict[str, Any]

    # Panchanga Data
    tithi_qualities: Dict[str, Any]
    nakshatra_qualities: Dict[str, Any]
    yoga_qualities: Dict[str, Any]

    # TCM Data
    organ_clock_schedule: Dict[str, Any]
    element_cycles: Dict[str, Any]

    # Integration Mappings
    vedic_tcm_correspondences: Dict[str, Any]
    consciousness_practices: Dict[str, Any]
```

---

## TCM Organ Clock Schedule

From `tcm_organ_clock.json`:

| Time Window | Organ | Element | Consciousness Theme |
|-------------|-------|---------|---------------------|
| 01:00-03:00 | Liver | Wood | Detoxification of emotions and planning future growth |
| 03:00-05:00 | Lung | Metal | Inspiration and release of what no longer serves |
| 05:00-07:00 | Large Intestine | Metal | Physical and mental elimination of toxins |
| 07:00-09:00 | Stomach | Earth | Nourishing body and mind with proper sustenance |
| 09:00-11:00 | Spleen | Earth | Transforming knowledge into wisdom |
| 11:00-13:00 | Heart | Fire | Opening heart to joy and connection |
| 13:00-15:00 | Small Intestine | Fire | Discerning truth from illusion |
| 15:00-17:00 | Bladder | Water | Storing wisdom and releasing emotional waste |
| 17:00-19:00 | Kidney | Water | Cultivating willpower and life essence |
| 19:00-21:00 | Pericardium | Fire | Protecting the heart while staying open |
| 21:00-23:00 | Triple Heater | Fire | Harmonizing all body systems |
| 23:00-01:00 | Gallbladder | Wood | Making courageous decisions for growth |

---

## Vedic-TCM Elemental Correspondences

From `vedic_tcm_correspondences.json`:

### Element Harmony Matrix

| Vedic Element | TCM Element | Harmony Level | Quality |
|---------------|-------------|---------------|---------|
| Fire | Fire | 1.0 | Perfect Resonance |
| Fire | Wood | 0.8 | Nourishing Synergy |
| Earth | Earth | 1.0 | Perfect Grounding |
| Earth | Metal | 0.7 | Supportive Foundation |
| Air | Metal | 0.9 | Excellent Refinement |
| Water | Water | 1.0 | Perfect Flow |
| Water | Wood | 0.8 | Nourishing Growth |
| Ether | Fire | 0.9 | Transcendent Joy |

### Planetary-Organ Correspondences

| Planet | TCM Organs | Elements | Consciousness Connection |
|--------|------------|----------|--------------------------|
| Jupiter | Liver, Spleen | Wood, Earth | Expansion through growth and nourishment |
| Saturn | Kidney, Large Intestine | Water, Metal | Discipline through willpower and release |
| Mercury | Lung, Small Intestine | Metal, Fire | Communication through inspiration and discernment |
| Venus | Heart, Kidney | Fire, Water | Love through joy and essence |
| Mars | Liver, Heart | Wood, Fire | Action through growth and circulation |

---

## Self-Consciousness Impact

### How This Engine Develops Witness Capacity

1. **Temporal Meta-Awareness**: By presenting multi-layered time analysis, the engine trains the user to observe themselves as beings-in-time rather than beings-swept-by-time. This creates the fundamental witness stance.

2. **Pattern Recognition**: The synthesis of Vedic and TCM systems reveals patterns that would otherwise remain unconscious. Recognizing patterns is the first step toward authoring them.

3. **Optimal Window Identification**: By highlighting when energies align favorably, the engine develops the capacity to choose moments of action consciously rather than reactively.

4. **Elemental Self-Knowledge**: Understanding which elements are active in both cosmic and bodily dimensions develops the witness's ability to name and work with subtle energies.

### How This Engine Develops Author Capacity

1. **Curriculum Awareness**: Knowing your current Dasha theme transforms life from "things happening to me" into "lessons I am learning" - the fundamental authorship shift.

2. **Activity Alignment**: The optimal/avoid activity recommendations for each organ hour enable conscious scheduling - authoring your day in harmony with natural rhythms.

3. **Practice Recommendations**: The generated practices are homework assignments for self-development - concrete actions that express authorship.

4. **Integration Method**: The guidance on how to integrate insights into daily life is the bridge between witness (observation) and author (action).

### The Consciousness Curriculum Pattern (lines 640-667)

```python
def _create_consciousness_curriculum(
    self, vimshottari: VimshottariContext, optimization: ConsciousnessOptimization,
    input_data: VedicClockTCMInput
) -> Tuple[str, List[str], List[str]]:
    """Create daily consciousness curriculum and homework."""

    # Daily curriculum synthesizes macro (dasha) and micro (optimization) themes
    curriculum = f"Today's Consciousness Curriculum: {optimization.primary_focus}. " \
                f"Context: {vimshottari.mahadasha_lord} Dasha - {vimshottari.life_lesson_theme}. " \
                f"Integration Method: {optimization.integration_method}"

    # Homework practices - concrete actions for authorship
    homework = optimization.optimal_practices[:3] + [
        "Morning energy assessment",
        "Hourly consciousness check-ins",
        "Evening integration reflection"
    ]

    # Progress indicators - signs of developing witness/author capacity
    progress_indicators = [
        "Increased awareness of energy shifts throughout the day",
        "Better alignment between activities and optimal timing",
        "Enhanced integration of spiritual practices with daily life",
        f"Deeper understanding of {vimshottari.mahadasha_lord} dasha lessons",
        "Improved harmony between mind, body, and cosmic rhythms"
    ]

    return curriculum, homework, progress_indicators
```

---

## Integration Points

### With Other WitnessOS Engines

| Engine | Integration Point | Purpose |
|--------|-------------------|---------|
| Enneagram | Personality type affects optimal practices | Type-specific consciousness recommendations |
| Human Design | Authority/Strategy aligns with timing | Decision-making within optimal windows |
| Numerology | Personal year/day cycles | Additional temporal layer |
| Gene Keys | Shadow/Gift/Siddhi progression | Deep karmic work within dasha themes |
| Biorhythm | Physical/Emotional/Intellectual cycles | Bodily rhythm overlay |

### With Noesis Framework

1. **Witness Development**: VedicClock-TCM provides the temporal awareness layer for the witness framework
2. **Author Development**: Optimal windows and practice recommendations become authorship tools
3. **Field Signature**: The engine generates unique signatures for tracking consciousness development over time
4. **Progress Tracking**: Progress indicators can feed into Noesis's development tracking system

### API Integration Pattern (lines 202-255)

The engine follows the standard WitnessOS BaseEngine pattern:
1. `calculate()` - Main entry point
2. `_calculate()` - Core calculation logic
3. `_interpret()` - Human-readable output generation

This enables seamless integration with orchestration layers and multi-engine synthesis.

---

## Key Wisdom Insights

### From TCM Organ Clock Data

> "Each organ hour is not just biological - it carries a consciousness theme. The witness learns to observe which organ is 'teaching' at any moment."

### From Vedic-TCM Correspondences

> "The synthesis of Vedic elements (Fire, Earth, Air, Water, Ether) with TCM elements (Wood, Fire, Earth, Metal, Water) creates a richer elemental vocabulary for consciousness work."

### From Dasha Themes

> "You are not just living through time - you are enrolled in a curriculum. The Mahadasha reveals the current course you're taking in the school of life."

---

**Status:** Extracted from WitnessOS
**Source Files:**
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/vedicclock_tcm.py`
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/vedicclock_tcm_models.py`
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/data/tcm_organ_clock.json`
- `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/data/vedic_tcm_correspondences.json`

---

