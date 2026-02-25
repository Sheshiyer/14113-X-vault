# Human Design Cross-Engine Mappings

**Integration Pathways for Multi-System Analysis**  
*WitnessOS Engine Interconnections*

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Gene Keys Integration](#gene-keys-integration)
3. [I-Ching Integration](#i-ching-integration)
4. [VedicClock Integration](#vedicclock-integration)
5. [Biofield Integration](#biofield-integration)
6. [Astrology Integration](#astrology-integration)
7. [Implementation Examples](#implementation-examples)

---

## Integration Overview

### Cross-Engine Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Human Design Engine                       │
│  (64 Gates, 9 Centers, Type/Profile/Authority)             │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├──────────────► Gene Keys (64 Keys, 3 Frequencies)
           │                - HD Gate → Gene Key mapping
           │                - Shadow/Gift/Siddhi correlation
           │
           ├──────────────► I-Ching (64 Hexagrams, 6 Lines)
           │                - HD Gate = I-Ching Hexagram
           │                - Line positions identical
           │
           ├──────────────► VedicClock (Temporal Cycles)
           │                - Planetary transits affect gates
           │                - Current time activations
           │
           ├──────────────► Biofield (Energy Patterns)
           │                - Type → Energy field pattern
           │                - Center definition → Field dynamics
           │
           └──────────────► Astrology (Planetary Positions)
                            - Source astronomical data
                            - Planetary meanings correlate
```

---

## Gene Keys Integration

### Gate to Gene Key Mapping

**Direct 1:1 Correspondence**: Each Human Design gate maps to the same numbered Gene Key.

```python
# Mapping is identical by number
HD_GATE_TO_GENE_KEY = {
    1: 1,    # Gate 1 → Gene Key 1
    2: 2,    # Gate 2 → Gene Key 2
    # ... continues 1:1 through 64
    64: 64
}

def map_hd_gate_to_gene_key(gate_number: int) -> int:
    """Direct mapping: HD gate numbers = Gene Key numbers."""
    return gate_number  # Always 1:1
```

### Shadow/Gift/Siddhi Correlation

Human Design concepts map to Gene Keys frequencies:

```python
HD_TO_GENE_KEYS_FREQUENCY = {
    # Human Design → Gene Keys
    "shadow_frequency": {
        "hd_concept": "Not-Self behavior",
        "gk_frequency": "Shadow",
        "example": {
            "gate_13": {
                "hd_shadow": "Secrecy, withholding",
                "gk_shadow": "Discord",
                "correlation": "Both express separation from collective"
            }
        }
    },
    "gift_frequency": {
        "hd_concept": "Authentic expression",
        "gk_frequency": "Gift",
        "example": {
            "gate_13": {
                "hd_gift": "Universal listening",
                "gk_gift": "Discernment",
                "correlation": "Mature expression of the archetype"
            }
        }
    },
    "siddhi_frequency": {
        "hd_concept": "Transcendent state",
        "gk_frequency": "Siddhi",
        "example": {
            "gate_13": {
                "hd_siddhi": "Unity consciousness",
                "gk_siddhi": "Empathy",
                "correlation": "Divine expression of listening"
            }
        }
    }
}
```

### Integration Implementation

```python
class HumanDesignGeneKeysIntegration:
    """Bridge between HD and Gene Keys engines."""
    
    def __init__(self, hd_engine, gk_engine):
        self.hd_engine = hd_engine
        self.gk_engine = gk_engine
    
    def enrich_hd_with_gene_keys(
        self, 
        hd_chart: HumanDesignChart
    ) -> Dict[str, Any]:
        """
        Enrich HD chart with Gene Keys frequencies.
        
        For each HD gate, add:
        - Gene Key number (same)
        - Shadow frequency
        - Gift frequency
        - Siddhi frequency
        """
        enriched_gates = {}
        
        # Process personality gates
        for planet, hd_gate in hd_chart.personality_gates.items():
            gene_key = self.gk_engine.get_gene_key_by_number(
                hd_gate.number
            )
            
            enriched_gates[planet] = {
                "hd_gate": hd_gate,
                "gene_key": gene_key,
                "frequencies": {
                    "shadow": gene_key.shadow,
                    "gift": gene_key.gift,
                    "siddhi": gene_key.siddhi
                },
                "integration_note": self._generate_integration_note(
                    hd_gate, gene_key
                )
            }
        
        return enriched_gates
    
    def _generate_integration_note(
        self, 
        hd_gate: HumanDesignGate, 
        gene_key: GeneKey
    ) -> str:
        """Generate synthesis of HD and GK perspectives."""
        return f"""
        Gate {hd_gate.number} / Gene Key {gene_key.number}:
        
        HD Perspective: {hd_gate.description}
        - Gift: {hd_gate.gift}
        - Shadow: {hd_gate.shadow}
        
        GK Perspective: {gene_key.name}
        - Gift: {gene_key.gift}
        - Shadow: {gene_key.shadow}
        - Siddhi: {gene_key.siddhi}
        
        Integration: Transform the {hd_gate.shadow} (HD) and 
        {gene_key.shadow} (GK) into {gene_key.gift}, ultimately 
        transcending into {gene_key.siddhi}.
        """
```

### Practical Example

```python
# Example: Gate 13 / Gene Key 13 integration
gate_13_integration = {
    "gate_number": 13,
    "hd_name": "Gate of the Listener",
    "gk_name": "Gene Key of Discernment",
    
    "shadow_synthesis": {
        "hd": "Secrecy - withholding information",
        "gk": "Discord - internal conflict",
        "integrated": "Move from keeping secrets (HD) and internal discord (GK) to open, discerning listening"
    },
    
    "gift_synthesis": {
        "hd": "Universal perspective through listening",
        "gk": "Discernment - wise discrimination",
        "integrated": "Listen universally (HD) with discerning wisdom (GK)"
    },
    
    "siddhi_synthesis": {
        "hd": "Unity through collective listening",
        "gk": "Empathy - divine connection",
        "integrated": "Transcend into empathic unity consciousness"
    },
    
    "pathworking": [
        "Notice when you withhold (HD shadow) or feel discord (GK shadow)",
        "Practice universal listening (HD gift) with discernment (GK gift)",
        "Surrender into empathic unity (GK siddhi)"
    ]
}
```

---

## I-Ching Integration

### Hexagram to Gate Mapping

**Direct Correspondence**: HD gates are I-Ching hexagrams.

```python
# The 64 I-Ching hexagrams = 64 HD gates
ICHING_HEXAGRAM_TO_HD_GATE = {
    1: {
        "hexagram_number": 1,
        "hd_gate": 1,
        "chinese_name": "乾 (Qián)",
        "english_name": "The Creative",
        "hd_name": "Gate of Self-Expression",
        "binary": "111111",  # All yang lines
        "trigrams": {
            "upper": "☰ Heaven",
            "lower": "☰ Heaven"
        }
    },
    2: {
        "hexagram_number": 2,
        "hd_gate": 2,
        "chinese_name": "坤 (Kūn)",
        "english_name": "The Receptive",
        "hd_name": "Gate of Direction",
        "binary": "000000",  # All yin lines
        "trigrams": {
            "upper": "☷ Earth",
            "lower": "☷ Earth"
        }
    }
    # ... continues for all 64
}
```

### Line Position Correlation

```python
def correlate_hd_line_with_iching(hd_gate: HumanDesignGate) -> Dict:
    """
    Map HD line position to I-Ching line meaning.
    
    Lines are numbered bottom to top in both systems.
    """
    line_meanings = {
        1: {
            "iching": "Initial line - Foundation, beginning",
            "hd": "Investigator - Security through investigation",
            "synthesis": "Build foundation through investigation"
        },
        2: {
            "iching": "Second line - Response, inner life",
            "hd": "Hermit - Natural talent, being called",
            "synthesis": "Natural gifts emerge when called"
        },
        3: {
            "iching": "Third line - Transition, difficulty",
            "hd": "Martyr - Trial and error, experimentation",
            "synthesis": "Learn through trials and transitions"
        },
        4: {
            "iching": "Fourth line - Ministers, externalization",
            "hd": "Opportunist - Network, friendship",
            "synthesis": "External relationships bring opportunity"
        },
        5: {
            "iching": "Fifth line - Ruler, influence",
            "hd": "Heretic - Universal solutions, projection",
            "synthesis": "Influence through practical solutions"
        },
        6: {
            "iching": "Sixth line - Sage, transcendence",
            "hd": "Role Model - Wisdom, objectivity",
            "synthesis": "Transcend into wisdom and example"
        }
    }
    
    return {
        "gate": hd_gate.number,
        "line": hd_gate.line,
        "iching_meaning": line_meanings[hd_gate.line]["iching"],
        "hd_meaning": line_meanings[hd_gate.line]["hd"],
        "synthesis": line_meanings[hd_gate.line]["synthesis"]
    }
```

### Integration Example

```python
class IChing_HD_Integration:
    """Integrate I-Ching wisdom with HD mechanics."""
    
    def get_hexagram_guidance(
        self, 
        hd_gate: HumanDesignGate
    ) -> str:
        """Generate guidance combining both systems."""
        
        hexagram = self.get_hexagram(hd_gate.number)
        
        return f"""
        Gate {hd_gate.number} / Hexagram {hexagram.number}
        
        I-Ching Name: {hexagram.chinese_name} - {hexagram.english_name}
        HD Name: {hd_gate.name}
        
        Classical I-Ching Wisdom:
        {hexagram.judgment}
        
        Line {hd_gate.line}:
        {hexagram.lines[hd_gate.line].text}
        
        HD Interpretation:
        {hd_gate.description}
        
        Synthesis:
        The ancient wisdom of {hexagram.english_name} expresses 
        through your {hd_gate.name}. At line {hd_gate.line}, you 
        embody {self.get_line_synthesis(hd_gate.line)}.
        """
```

---

## VedicClock Integration

### Temporal Activation Tracking

```python
class VedicClockHDIntegration:
    """Track current planetary transits activating HD gates."""
    
    def get_current_activations(
        self, 
        current_datetime: datetime,
        location: Tuple[float, float]
    ) -> Dict[str, int]:
        """
        Calculate which gates are currently activated by 
        transiting planets.
        """
        # Calculate current planetary positions
        current_positions = self.astro_calc.calculate_positions(
            current_datetime, 
            location
        )
        
        # Map to gates
        transiting_gates = {}
        for planet, position in current_positions.items():
            gate = self.calculate_gate_from_longitude(
                position['longitude']
            )
            transiting_gates[planet] = gate
        
        return transiting_gates
    
    def analyze_transit_overlay(
        self,
        natal_chart: HumanDesignChart,
        current_datetime: datetime,
        location: Tuple[float, float]
    ) -> Dict[str, Any]:
        """
        Analyze how current transits interact with natal chart.
        """
        transits = self.get_current_activations(
            current_datetime, 
            location
        )
        
        # Find connections
        new_channels = []
        activated_centers = []
        
        # Check if transits complete any channels
        for t_planet, t_gate in transits.items():
            # Check natal gates
            for n_planet, n_gate in natal_chart.personality_gates.items():
                # Find if they form a channel
                channel = self.check_channel_formation(
                    t_gate, 
                    n_gate.number
                )
                if channel:
                    new_channels.append({
                        "channel": channel,
                        "transiting_planet": t_planet,
                        "natal_planet": n_planet,
                        "duration": self.calculate_transit_duration(
                            t_planet, 
                            current_datetime
                        )
                    })
        
        return {
            "transiting_gates": transits,
            "new_channels": new_channels,
            "activated_centers": activated_centers,
            "guidance": self.generate_transit_guidance(new_channels)
        }
```

### Temporal Cycles

```python
PLANETARY_CYCLES = {
    "sun": {
        "orbit_days": 365.25,
        "time_per_gate": 5.69,  # days
        "significance": "Conscious identity shifts"
    },
    "moon": {
        "orbit_days": 27.32,
        "time_per_gate": 0.43,  # ~10 hours
        "significance": "Emotional themes"
    },
    "mercury": {
        "orbit_days": 87.97,
        "time_per_gate": 1.37,  # days
        "significance": "Mental focus"
    },
    # ... other planets
}
```

---

## Biofield Integration

### Type to Energy Pattern Mapping

```python
BIOFIELD_TYPE_PATTERNS = {
    "Generator": {
        "field_type": "Enveloping Aura",
        "range": "~6 feet",
        "quality": "Open, enveloping, magnetic",
        "energy_signature": "Sustainable life force",
        "biofield_color": "Red (sacral energy)",
        "interaction_pattern": "Draws others in to respond"
    },
    "Manifestor": {
        "field_type": "Closed Repelling Aura",
        "range": "~3 feet, penetrating",
        "quality": "Dense, focused, impactful",
        "energy_signature": "Initiation pulses",
        "biofield_color": "White (pure manifestation)",
        "interaction_pattern": "Impacts others, creates space"
    },
    "Projector": {
        "field_type": "Focused Penetrating Aura",
        "range": "Variable, reading others",
        "quality": "Absorbing, focused, penetrating",
        "energy_signature": "Recognition seeking",
        "biofield_color": "Green (guidance)",
        "interaction_pattern": "Reads and guides others' energy"
    },
    "Reflector": {
        "field_type": "Sampling Aura",
        "range": "Resistant, lunar cycle",
        "quality": "Reflective, resistant, lunar",
        "energy_signature": "Environmental mirroring",
        "biofield_color": "Silver (lunar reflection)",
        "interaction_pattern": "Samples and reflects environment"
    }
}
```

### Center Definition to Field Dynamics

```python
def map_centers_to_biofield(centers: Dict[str, HumanDesignCenter]) -> Dict:
    """
    Map HD center definitions to biofield energy patterns.
    """
    biofield_mapping = {
        "Head": {
            "defined": "Strong crown chakra activation",
            "undefined": "Open to mental inspiration from field"
        },
        "Ajna": {
            "defined": "Fixed mental processing pattern",
            "undefined": "Absorbs others' mental energy"
        },
        "Throat": {
            "defined": "Consistent vocal/expression field",
            "undefined": "Variable communication based on environment"
        },
        "G": {
            "defined": "Strong identity/love field",
            "undefined": "Flexible identity, absorbs direction"
        },
        "Heart": {
            "defined": "Consistent willpower field",
            "undefined": "Proves worth through external validation"
        },
        "Sacral": {
            "defined": "Strong life force field (Generator aura)",
            "undefined": "No sustainable energy field"
        },
        "Solar Plexus": {
            "defined": "Emotional wave affects field",
            "undefined": "Absorbs emotions from environment"
        },
        "Spleen": {
            "defined": "Consistent intuitive awareness",
            "undefined": "Absorbs fears and health patterns"
        },
        "Root": {
            "defined": "Consistent pressure/stress field",
            "undefined": "Amplifies environmental pressure"
        }
    }
    
    field_pattern = []
    for center_name, center in centers.items():
        if center.defined:
            field_pattern.append({
                "center": center_name,
                "status": "defined",
                "field_effect": biofield_mapping[center_name]["defined"]
            })
        else:
            field_pattern.append({
                "center": center_name,
                "status": "undefined",
                "field_effect": biofield_mapping[center_name]["undefined"]
            })
    
    return {
        "field_pattern": field_pattern,
        "defined_centers_count": len([c for c in centers.values() if c.defined]),
        "field_density": calculate_field_density(centers)
    }
```

---

## Astrology Integration

### Planetary Meanings Correlation

```python
PLANET_CORRELATION = {
    "sun": {
        "hd": "Conscious identity, life's work",
        "astrology": "Core identity, ego, vitality",
        "synthesis": "Your conscious expression of self"
    },
    "earth": {
        "hd": "Grounding, service, evolution",
        "astrology": "Material grounding (opposite Sun)",
        "synthesis": "How you ground your purpose"
    },
    "moon": {
        "hd": "Emotional driver, needs",
        "astrology": "Emotions, instincts, habits",
        "synthesis": "Emotional navigation system"
    },
    "mercury": {
        "hd": "Communication style",
        "astrology": "Thinking, communication",
        "synthesis": "Mental processing and expression"
    },
    "venus": {
        "hd": "Values, relationships",
        "astrology": "Love, beauty, values",
        "synthesis": "What you value and attract"
    },
    "mars": {
        "hd": "Immaturity, action pattern",
        "astrology": "Action, drive, aggression",
        "synthesis": "How you take action"
    },
    "jupiter": {
        "hd": "Law, justice, expansion",
        "astrology": "Growth, expansion, wisdom",
        "synthesis": "Your path of expansion"
    },
    "saturn": {
        "hd": "Structure, limitation, mastery",
        "astrology": "Discipline, karma, lessons",
        "synthesis": "Life lessons and maturity"
    },
    "uranus": {
        "hd": "Chaos, breakthrough, revolution",
        "astrology": "Innovation, rebellion, sudden change",
        "synthesis": "Your unique revolution"
    },
    "neptune": {
        "hd": "Spirituality, illusion, transcendence",
        "astrology": "Dreams, intuition, dissolution",
        "synthesis": "Spiritual connection and illusion"
    },
    "pluto": {
        "hd": "Truth, transformation, power",
        "astrology": "Transformation, death/rebirth, power",
        "synthesis": "Deep transformation and truth"
    }
}
```

---

## Implementation Examples

### Complete Multi-Engine Query

```python
async def get_complete_evolutionary_profile(
    birth_data: BirthData
) -> Dict[str, Any]:
    """
    Calculate complete profile across all engines.
    """
    # Calculate each engine
    hd_chart = await hd_engine.calculate(birth_data)
    gk_profile = await gk_engine.calculate(birth_data)
    iching_reading = await iching_engine.calculate(birth_data)
    biofield_scan = await biofield_engine.calculate(hd_chart)
    
    # Integrate
    integration = {
        "birth_data": birth_data,
        "human_design": hd_chart,
        "gene_keys": gk_profile,
        "iching": iching_reading,
        "biofield": biofield_scan,
        
        "synthesis": {
            "life_purpose": synthesize_life_purpose(
                hd_chart, gk_profile
            ),
            "evolutionary_path": synthesize_evolutionary_path(
                hd_chart, gk_profile, iching_reading
            ),
            "energy_dynamics": synthesize_energy_dynamics(
                hd_chart, biofield_scan
            ),
            "current_cycle": analyze_current_cycle(
                hd_chart, birth_data, datetime.now()
            )
        }
    }
    
    return integration
```

---

## References

1. Human Design & Gene Keys - Richard Rudd
2. I-Ching & Human Design - Ra Uru Hu
3. Biofield Science - HeartMath Institute
4. WitnessOS Multi-Engine Architecture

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Integration Level**: Full Cross-Reference
