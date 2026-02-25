# Vimshottari Cross-Engine Mappings & Integration

## Overview

This document defines how the Vimshottari Dasha Timeline Mapper integrates with other WitnessOS consciousness engines to create multi-dimensional temporal analysis and cross-system synthesis.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Temporal Synthesis Layer                  │
│         (Multi-Engine Consciousness Timeline)                │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│ Vimshottari  │ │VedicClock  │ │  Human     │
│   Dasha      │ │    TCM     │ │  Design    │
│(Macro Life)  │ │(Daily/Hour)│ │(Blueprint) │
└───────┬──────┘ └─────┬──────┘ └─────┬──────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────▼───────────────┐
        │      Biorhythm Engine         │
        │  (Short-term cycles: days)    │
        └───────────────┬───────────────┘
                        │
        ┌───────────────▼───────────────┐
        │    Face Reading Engine        │
        │  (Physical manifestation)     │
        └───────────────────────────────┘
```

---

## 1. Human Design Integration

### Mapping: Planetary Periods → Gates & Centers

Human Design uses birth data to calculate a bodygraph with 64 gates and 9 centers. Vimshottari Dasha periods can modulate which centers are "active" during specific life phases.

#### Planetary → Center Correspondences

```python
PLANET_TO_HD_CENTER = {
    "Sun": ["G Center", "Solar Plexus"],  # Identity, emotional awareness
    "Moon": ["Solar Plexus", "Sacral"],   # Emotions, life force
    "Mercury": ["Throat", "Ajna"],        # Communication, conceptualization
    "Venus": ["Sacral", "G Center"],      # Creativity, love, identity
    "Mars": ["Root", "Solar Plexus"],     # Drive, pressure, emotions
    "Jupiter": ["Ajna", "Crown"],         # Wisdom, inspiration
    "Saturn": ["Root", "Spleen"],         # Discipline, survival instinct
    "Rahu": ["Head", "Ajna"],            # Mental pressure, innovation
    "Ketu": ["Crown", "Root"]            # Spiritual wisdom, grounding
}
```

#### Integration Function

```python
def integrate_with_human_design(vimshottari_output, hd_bodygraph):
    """
    Synthesize Vimshottari Dasha with Human Design chart.
    
    Returns:
        dict: Cross-engine synthesis containing:
            - active_centers: HD centers emphasized by current Dasha
            - gate_activations: Specific gates resonating with Dasha planet
            - authority_alignment: How current Dasha supports HD authority
            - strategy_guidance: Dasha-informed HD strategy recommendations
    """
    current_mahadasha = vimshottari_output.timeline.current_mahadasha.planet
    current_antardasha = vimshottari_output.timeline.current_antardasha.planet
    
    # Centers emphasized by current periods
    active_centers = []
    active_centers.extend(PLANET_TO_HD_CENTER.get(current_mahadasha, []))
    active_centers.extend(PLANET_TO_HD_CENTER.get(current_antardasha, []))
    
    # Gate-level analysis
    gate_activations = []
    for center in active_centers:
        gates = hd_bodygraph.get_gates_in_center(center)
        for gate in gates:
            if gate.is_defined:
                gate_activations.append({
                    'gate': gate.number,
                    'name': gate.name,
                    'dasha_resonance': calculate_resonance(gate, current_mahadasha),
                    'recommended_focus': get_gate_dasha_guidance(gate, current_mahadasha)
                })
    
    # Authority alignment
    authority_alignment = analyze_authority_dasha_alignment(
        hd_bodygraph.authority,
        current_mahadasha,
        current_antardasha
    )
    
    # Strategy guidance
    strategy_guidance = generate_hd_strategy_for_dasha(
        hd_bodygraph.type,
        hd_bodygraph.strategy,
        current_mahadasha
    )
    
    return {
        'active_centers': list(set(active_centers)),
        'gate_activations': gate_activations,
        'authority_alignment': authority_alignment,
        'strategy_guidance': strategy_guidance,
        'synthesis_quality': calculate_synthesis_quality(active_centers, hd_bodygraph)
    }
```

#### Example Synthesis

**Case**: Jupiter Mahadasha + Manifesting Generator

```yaml
Current Dasha:
  Mahadasha: Jupiter (Expansion, Wisdom)
  Antardasha: Saturn (Discipline, Structure)
  
Human Design:
  Type: Manifesting Generator
  Strategy: Respond, then Inform
  Authority: Sacral

Synthesis:
  Active Centers:
    - Ajna (Jupiter): Enhanced conceptual thinking
    - Crown (Jupiter): Spiritual downloads
    - Root (Saturn): Grounded pressure to act
    - Spleen (Saturn): Heightened intuition
  
  Strategy Guidance:
    "Your Jupiter Mahadasha amplifies your Manifesting Generator speed
     and multi-passionate nature. Saturn sub-period adds disciplined
     structure to your responses. Wait for sacral response, but once
     you get the 'yes', Jupiter gives permission to expand rapidly while
     Saturn ensures you build lasting foundations."
  
  Authority Alignment: 0.87 (High)
    - Sacral authority well-supported by Jupiter's expansive energy
    - Saturn adds patience to wait for correct responses
```

---

## 2. VedicClock-TCM Integration

### Mapping: Macro Dasha Periods → Daily/Hourly Rhythms

VedicClock-TCM operates on daily and hourly cycles. Vimshottari provides the overarching "curriculum theme" that modulates how daily energies manifest.

#### Planetary → TCM Organ Correspondences

```python
PLANET_TO_TCM_ORGAN = {
    "Jupiter": ["Liver", "Spleen"],      # Growth, transformation
    "Saturn": ["Kidney", "Large Intestine"], # Structure, elimination
    "Mercury": ["Lung", "Small Intestine"],  # Communication, discernment
    "Venus": ["Heart", "Kidney"],        # Love, essence
    "Mars": ["Liver", "Heart"],          # Action, circulation
    "Moon": ["Spleen", "Stomach"],       # Nourishment, grounding
    "Sun": ["Heart", "Small Intestine"], # Vitality, clarity
    "Rahu": ["Pericardium", "Gallbladder"], # Innovation, courage
    "Ketu": ["Kidney", "Bladder"]       # Wisdom, release
}
```

#### Planetary → Five Elements

```python
PLANET_TO_FIVE_ELEMENTS = {
    "Jupiter": "Wood",    # Growth, expansion
    "Saturn": "Metal",    # Structure, refinement
    "Mercury": "Metal",   # Clarity, communication
    "Venus": "Water",     # Flow, creativity
    "Mars": "Fire",       # Action, transformation
    "Moon": "Water",      # Emotions, flow
    "Sun": "Fire",        # Vitality, transformation
    "Rahu": "Fire",       # Intensity, change
    "Ketu": "Water"       # Depth, wisdom
}
```

#### Integration Function

```python
def integrate_with_vedicclock_tcm(vimshottari_output, vedicclock_tcm_output):
    """
    Synthesize Vimshottari Dasha with VedicClock-TCM real-time state.
    
    Returns:
        dict: Temporal synthesis containing:
            - element_harmony: How Dasha element aligns with current TCM organ
            - organ_curriculum: Which organs to focus on during Dasha period
            - optimal_practice_times: When to do Dasha-specific practices
            - energy_management: How to work with Dasha energy daily
    """
    current_mahadasha = vimshottari_output.timeline.current_mahadasha.planet
    dasha_element = PLANET_TO_FIVE_ELEMENTS[current_mahadasha]
    
    current_tcm_organ = vedicclock_tcm_output.tcm_organ_state.primary_organ
    current_tcm_element = vedicclock_tcm_output.tcm_organ_state.element
    
    # Calculate elemental harmony
    element_harmony = calculate_five_element_harmony(
        dasha_element, 
        current_tcm_element
    )
    
    # Organ curriculum for Dasha period
    organ_curriculum = PLANET_TO_TCM_ORGAN[current_mahadasha]
    organ_practices = []
    for organ in organ_curriculum:
        organ_practices.append({
            'organ': organ,
            'element': TCM_ORGAN_TO_ELEMENT[organ],
            'dasha_resonance': calculate_organ_dasha_resonance(organ, current_mahadasha),
            'practices': get_organ_practices_for_dasha(organ, current_mahadasha),
            'optimal_hours': get_tcm_organ_hours(organ)
        })
    
    # Find optimal practice windows
    optimal_times = []
    for hour in range(24):
        hour_organ = get_tcm_organ_for_hour(hour)
        if hour_organ in organ_curriculum:
            optimal_times.append({
                'hour_range': f"{hour:02d}:00-{(hour+2)%24:02d}:00",
                'organ': hour_organ,
                'potency': calculate_practice_potency(
                    hour_organ, 
                    dasha_element, 
                    current_mahadasha
                )
            })
    
    return {
        'element_harmony': element_harmony,
        'organ_curriculum': organ_practices,
        'optimal_practice_times': sorted(optimal_times, key=lambda x: x['potency'], reverse=True),
        'energy_management': generate_daily_energy_guidance(
            current_mahadasha,
            dasha_element,
            vedicclock_tcm_output
        )
    }
```

#### Example Synthesis

**Case**: Saturn Mahadasha during Kidney Hour (17:00-19:00)

```yaml
Vimshottari Context:
  Mahadasha: Saturn (Discipline, Structure)
  Element: Metal (Refinement, Letting Go)
  Theme: "Building lasting foundations through discipline"

VedicClock-TCM Context:
  Current Hour: 17:30
  Primary Organ: Kidney
  Element: Water
  Energy Phase: Peak
  
Synthesis:
  Element Harmony: 0.75 (Metal generates Water - supportive)
  
  Interpretation:
    "Saturn's Metal element generates Water, supporting Kidney function.
     This is an optimal time for Saturn practices:
     - Structured meditation (builds Kidney essence)
     - Willpower training (Kidney governs willpower)
     - Long-term planning (Saturn structure + Kidney wisdom)
     
     The Metal-Water relationship means Saturn's discipline
     flows naturally into Kidney's storage of life essence."
  
  Organ Curriculum:
    Primary: Kidney (directly associated with Saturn)
    - Optimal hours: 17:00-19:00 daily
    - Practices: Stillness meditation, essence conservation
    - Theme: Cultivating willpower through disciplined practice
    
    Secondary: Large Intestine (Saturn association)
    - Optimal hours: 05:00-07:00 daily
    - Practices: Letting go rituals, elimination of old patterns
    - Theme: Releasing what no longer serves structure
```

---

## 3. Biorhythm Engine Integration

### Mapping: Long-term Dasha → Short-term Cycles

Biorhythm engine calculates physical, emotional, and intellectual cycles (23, 28, 33 days respectively). Dasha periods can amplify or dampen these rhythms.

#### Planetary Modulation of Biorhythm Cycles

```python
PLANET_BIORHYTHM_MODULATION = {
    "Sun": {
        "physical": 1.2,      # Amplifies physical energy
        "emotional": 1.0,
        "intellectual": 1.1
    },
    "Moon": {
        "physical": 0.9,
        "emotional": 1.3,     # Amplifies emotional sensitivity
        "intellectual": 0.95
    },
    "Mars": {
        "physical": 1.4,      # Strong physical amplification
        "emotional": 1.2,
        "intellectual": 0.9
    },
    "Saturn": {
        "physical": 0.8,      # Dampens physical energy (adds heaviness)
        "emotional": 0.85,
        "intellectual": 1.15  # Enhances focus
    },
    "Jupiter": {
        "physical": 1.1,
        "emotional": 1.15,
        "intellectual": 1.25  # Strong intellectual amplification
    }
    # ... other planets
}
```

#### Integration Function

```python
def integrate_with_biorhythm(vimshottari_output, biorhythm_state, date):
    """
    Modulate biorhythm cycles based on current Dasha period.
    
    Returns:
        dict: Modulated biorhythm data with Dasha influence
    """
    current_mahadasha = vimshottari_output.timeline.current_mahadasha.planet
    modulation = PLANET_BIORHYTHM_MODULATION[current_mahadasha]
    
    # Apply Dasha modulation to base biorhythms
    modulated_biorhythm = {
        'physical': biorhythm_state.physical * modulation['physical'],
        'emotional': biorhythm_state.emotional * modulation['emotional'],
        'intellectual': biorhythm_state.intellectual * modulation['intellectual']
    }
    
    # Identify critical days (when biorhythm crosses zero during challenging Dasha)
    critical_days = []
    if any(abs(v) < 0.1 for v in modulated_biorhythm.values()):
        if current_mahadasha in ["Saturn", "Ketu", "Rahu"]:  # Challenging periods
            critical_days.append({
                'date': date,
                'warning': f"Critical biorhythm day during {current_mahadasha} Dasha",
                'recommendations': get_critical_day_recommendations(current_mahadasha)
            })
    
    return {
        'base_biorhythm': biorhythm_state,
        'modulated_biorhythm': modulated_biorhythm,
        'dasha_influence': modulation,
        'critical_days': critical_days,
        'optimal_activities': get_optimal_activities(
            modulated_biorhythm, 
            current_mahadasha
        )
    }
```

---

## 4. Cross-Engine Synthesis Endpoint

### Unified Temporal Analysis API

```python
def synthesize_temporal_systems(
    birth_data: dict,
    current_datetime: datetime,
    engines: List[str] = ["vimshottari", "human_design", "vedicclock_tcm", "biorhythm"]
) -> dict:
    """
    Generate unified multi-engine temporal analysis.
    
    Args:
        birth_data: Birth date, time, location, timezone
        current_datetime: Analysis timestamp
        engines: List of engines to include in synthesis
    
    Returns:
        Comprehensive cross-engine synthesis
    """
    results = {}
    
    # Calculate each engine
    if "vimshottari" in engines:
        results['vimshottari'] = vimshottari_engine.calculate(birth_data)
    
    if "human_design" in engines:
        results['human_design'] = human_design_engine.calculate(birth_data)
    
    if "vedicclock_tcm" in engines:
        results['vedicclock_tcm'] = vedicclock_tcm_engine.calculate({
            **birth_data,
            'target_datetime': current_datetime
        })
    
    if "biorhythm" in engines:
        results['biorhythm'] = biorhythm_engine.calculate({
            **birth_data,
            'current_date': current_datetime
        })
    
    # Cross-engine synthesis
    synthesis = {
        'timestamp': current_datetime.isoformat(),
        'engines_included': engines,
        'individual_results': results,
        'cross_engine_mappings': {}
    }
    
    # Generate all possible integrations
    if "vimshottari" in results and "human_design" in results:
        synthesis['cross_engine_mappings']['vimshottari_x_human_design'] = \
            integrate_with_human_design(results['vimshottari'], results['human_design'])
    
    if "vimshottari" in results and "vedicclock_tcm" in results:
        synthesis['cross_engine_mappings']['vimshottari_x_vedicclock_tcm'] = \
            integrate_with_vedicclock_tcm(results['vimshottari'], results['vedicclock_tcm'])
    
    if "vimshottari" in results and "biorhythm" in results:
        synthesis['cross_engine_mappings']['vimshottari_x_biorhythm'] = \
            integrate_with_biorhythm(
                results['vimshottari'], 
                results['biorhythm'],
                current_datetime.date()
            )
    
    # Generate unified interpretation
    synthesis['unified_interpretation'] = generate_unified_interpretation(synthesis)
    
    # Generate consolidated recommendations
    synthesis['consolidated_recommendations'] = consolidate_recommendations(
        [results[engine].recommendations for engine in engines if engine in results]
    )
    
    # Calculate overall consciousness optimization score
    synthesis['consciousness_optimization_score'] = calculate_overall_optimization(synthesis)
    
    return synthesis
```

### Example Unified Analysis Output

```json
{
  "timestamp": "2026-01-27T17:30:00+05:30",
  "engines_included": ["vimshottari", "human_design", "vedicclock_tcm", "biorhythm"],
  
  "individual_results": {
    "vimshottari": { "..." },
    "human_design": { "..." },
    "vedicclock_tcm": { "..." },
    "biorhythm": { "..." }
  },
  
  "cross_engine_mappings": {
    "vimshottari_x_human_design": {
      "active_centers": ["Ajna", "Crown", "Root", "Spleen"],
      "authority_alignment": 0.87,
      "synthesis_quality": "High resonance between Jupiter Dasha and Generator energy"
    },
    
    "vimshottari_x_vedicclock_tcm": {
      "element_harmony": 0.75,
      "organ_curriculum": [
        {
          "organ": "Kidney",
          "optimal_hours": "17:00-19:00",
          "dasha_resonance": 0.92,
          "practices": ["Willpower meditation", "Essence conservation"]
        }
      ]
    },
    
    "vimshottari_x_biorhythm": {
      "modulated_biorhythm": {
        "physical": 0.72,
        "emotional": 0.84,
        "intellectual": 1.03
      },
      "dasha_influence": "Saturn dampens physical, enhances intellectual focus"
    }
  },
  
  "unified_interpretation": "You are in a Jupiter-Saturn period with high intellectual and spiritual focus. Your Human Design Generator strategy aligns well with current energies. TCM Kidney hour (17:30) is optimal for structured spiritual practices. Physical energy is slightly dampened by Saturn, but mental clarity is enhanced.",
  
  "consolidated_recommendations": [
    "Practice structured meditation during Kidney hours (17:00-19:00)",
    "Use Generator strategy: respond to opportunities, don't initiate",
    "Focus on intellectual/spiritual work over physical activity today",
    "Build long-term foundations through disciplined daily practices"
  ],
  
  "consciousness_optimization_score": 0.82
}
```

---

## Integration Best Practices

1. **Temporal Hierarchy**: Vimshottari provides macro context (years), VedicClock-TCM provides micro context (hours/days)

2. **Elemental Synthesis**: Always calculate five-element harmony when integrating Vedic and TCM systems

3. **Authority Alignment**: Human Design authority should be primary decision-making tool, with Dasha providing thematic context

4. **Biorhythm Modulation**: Use Dasha to understand amplitude of biorhythm cycles, not replace them

5. **Resonance Calculation**: Weight cross-engine mappings by resonance scores to prioritize highest-value integrations

6. **Temporal Windows**: Identify moments when multiple systems align (e.g., Jupiter Dasha + Heart hour + positive biorhythm) for peak consciousness work

---

## Future Integrations

- **Face Reading Engine**: Map Dasha periods to facial feature emphasis
- **Biofield Engine**: Correlate Dasha transitions with aura color shifts
- **I Ching Engine**: Synthesize hexagram guidance with planetary periods
- **Tarot Timeline**: Map Dasha periods to Major Arcana themes
