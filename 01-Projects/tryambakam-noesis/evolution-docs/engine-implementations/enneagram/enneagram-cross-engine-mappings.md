# Enneagram Cross-Engine Mappings & Integration

## Overview

This document describes how the Enneagram Resonator Engine correlates with other WitnessOS engines to create a unified personality synthesis and consciousness analysis framework.

## Human Design Integration

### Type-Authority Correlations

**Enneagram → Human Design Type Patterns:**

| Enneagram Type | Common HD Types | HD Authority | Reasoning |
|----------------|-----------------|--------------|-----------|
| Type 1 (Reformer) | Manifestor, Projector | Emotional, Splenic | Driven to correct, perfectionistic energy |
| Type 2 (Helper) | Generator, Manifesting Generator | Emotional, Sacral | Responsive to others' needs, abundant energy for service |
| Type 3 (Achiever) | Manifestor, Manifesting Generator | Ego, Emotional | Goal-oriented, action-driven, identity through achievement |
| Type 4 (Individualist) | Projector, Reflector | Emotional, Lunar | Unique perspective, sensitive to environment |
| Type 5 (Investigator) | Projector | Splenic, Self-Projected | Observer energy, selective engagement |
| Type 6 (Loyalist) | Generator, Projector | Emotional, Splenic | Security-seeking, responsive to guidance |
| Type 7 (Enthusiast) | Manifesting Generator | Sacral, Emotional | Multi-passionate, high energy, quick to respond |
| Type 8 (Challenger) | Manifestor | Emotional, Ego | Direct action, boundary-setting, leadership |
| Type 9 (Peacemaker) | Generator, Reflector | Sacral, Lunar | Harmonizing, responsive, absorbing |

### Center Correspondences

**Enneagram Centers → HD Centers:**

```
Enneagram Body Center (8, 9, 1)
└─→ HD Sacral + Root Centers
    ├─ Gut instinct = Sacral response
    ├─ Physical action = Root pressure
    └─ Autonomy = Sacral authority

Enneagram Heart Center (2, 3, 4)
└─→ HD Solar Plexus + Heart Centers
    ├─ Shame = Solar Plexus waves
    ├─ Identity = G Center direction
    └─ Recognition = Heart willpower

Enneagram Head Center (5, 6, 7)
└─→ HD Ajna + Head Centers
    ├─ Fear/anxiety = Open Head pressure
    ├─ Mental processing = Ajna conceptualization
    └─ Security-seeking = Defined/undefined patterns
```

### Integration Points

**Profile Line Correlation:**
```python
def correlate_enneagram_hd_profile(enneagram_type: int, hd_profile: str) -> Dict:
    """
    Correlate Enneagram type with Human Design profile.
    
    Example: Type 5 (Investigator) + 5/1 Profile
    - Both seek deep knowledge (5th line investigative)
    - Both foundation-oriented (1st line)
    - Reinforcing pattern of depth and expertise
    """
    correlations = {
        (5, "5/1"): {
            "resonance": 0.95,
            "description": "Deep alignment: investigative, knowledge-seeking",
            "synthesis": "The Expert Hermit - profound depth, selective sharing"
        },
        (4, "4/6"): {
            "resonance": 0.90,
            "description": "Emotional depth meets role model",
            "synthesis": "The Authentic Guide - unique wisdom through experience"
        },
        (8, "1/3"): {
            "resonance": 0.88,
            "description": "Direct action meets experimentation",
            "synthesis": "The Maverick Experimentalist - bold innovation"
        }
    }
    
    key = (enneagram_type, hd_profile)
    return correlations.get(key, {"resonance": 0.5, "description": "Neutral correlation"})
```

### Strategy-Instinct Mapping

**Enneagram Instinctual Variants → HD Strategy:**

```
Self-Preservation (SP) + Generator → Respond to personal security needs
Sexual (SX) + Manifestor → Initiate intense connections
Social (SO) + Projector → Wait for recognition in group contexts
```

**Integration Formula:**
```
Combined_Approach = HD_Strategy × Enneagram_Instinct × Type_Core_Motivation

Example: 
- HD: Manifestor (Initiate)
- Enneagram: Type 8 SX (Sexual Eight)
- Result: Initiates intense, powerful connections with direct approach
```

## Gene Keys Integration

### Shadow-Gift-Siddhi Correlation

**Enneagram Passion/Vice → Gene Keys Shadow:**

| Enneagram | Vice/Passion | Gene Keys Shadow Correlation |
|-----------|--------------|------------------------------|
| Type 1 | Anger/Resentment | Shadow: Entropy (GK 3) - Resistance to what is |
| Type 2 | Pride | Shadow: Coercion (GK 7) - Manipulation through giving |
| Type 3 | Deceit/Vanity | Shadow: Duplicity (GK 1) - False presentation |
| Type 4 | Envy | Shadow: Craving (GK 36) - Longing for what's missing |
| Type 5 | Avarice | Shadow: Stagnation (GK 48) - Hoarding wisdom |
| Type 6 | Fear | Shadow: Distraction (GK 57) - Mental anxiety |
| Type 7 | Gluttony | Shadow: Distraction (GK 56) - Experience addiction |
| Type 8 | Lust | Shadow: Oppression (GK 16) - Dominating others |
| Type 9 | Sloth | Shadow: Superficiality (GK 64) - Avoidance through peace |

**Enneagram Virtue → Gene Keys Gift:**

| Enneagram | Virtue | Gene Keys Gift Correlation |
|-----------|--------|----------------------------|
| Type 1 | Serenity | Gift: Freshness (GK 3) - Acceptance |
| Type 2 | Humility | Gift: Equanimity (GK 7) - Balanced giving |
| Type 3 | Authenticity | Gift: Originality (GK 1) - True self-expression |
| Type 4 | Equanimity | Gift: Humanity (GK 36) - Embracing universal experience |
| Type 5 | Non-Attachment | Gift: Resourcefulness (GK 48) - Sharing wisdom |
| Type 6 | Courage | Gift: Intuition (GK 57) - Trusting inner knowing |
| Type 7 | Sobriety | Gift: Enchantment (GK 56) - Present-moment richness |
| Type 8 | Innocence | Gift: Versatility (GK 16) - Flexible strength |
| Type 9 | Right Action | Gift: Transparency (GK 64) - Engaged clarity |

**Enneagram Holy Idea → Gene Keys Siddhi:**

| Enneagram | Holy Idea | Gene Keys Siddhi Correlation |
|-----------|-----------|------------------------------|
| Type 1 | Holy Perfection | Siddhi: Innocence (GK 3) - Perfection in imperfection |
| Type 2 | Holy Will/Freedom | Siddhi: Being (GK 7) - Existence itself |
| Type 3 | Holy Harmony/Hope | Siddhi: Entropy (GK 1) - Perfect unfolding |
| Type 4 | Holy Origin | Siddhi: Compassion (GK 36) - Universal heart |
| Type 5 | Holy Omniscience | Siddhi: Wisdom (GK 48) - Total knowing |
| Type 6 | Holy Faith | Siddhi: Clarity (GK 57) - Absolute trust |
| Type 7 | Holy Wisdom/Plan | Siddhi: Divinity (GK 56) - Sacred play |
| Type 8 | Holy Truth | Siddhi: Mastery (GK 16) - Power as service |
| Type 9 | Holy Love | Siddhi: Illumination (GK 64) - Unity consciousness |

### Synthesis Algorithm

```python
def synthesize_enneagram_gene_keys(
    enneagram_type: int,
    gene_keys_profile: Dict
) -> Dict:
    """
    Create synthesis between Enneagram and Gene Keys.
    
    Maps:
    - Vice/Passion → Primary Shadow
    - Virtue → Gift to develop
    - Holy Idea → Siddhi potential
    - Arrows → Pearl sequence
    """
    
    # Shadow work pathway
    vice_shadow_map = {
        1: "Entropy (GK 3)",
        2: "Coercion (GK 7)",
        3: "Duplicity (GK 1)",
        4: "Craving (GK 36)",
        5: "Stagnation (GK 48)",
        6: "Distraction (GK 57)",
        7: "Distraction (GK 56)",
        8: "Oppression (GK 16)",
        9: "Superficiality (GK 64)"
    }
    
    # Gift development
    virtue_gift_map = {
        1: "Freshness (GK 3)",
        2: "Equanimity (GK 7)",
        3: "Originality (GK 1)",
        4: "Humanity (GK 36)",
        5: "Resourcefulness (GK 48)",
        6: "Intuition (GK 57)",
        7: "Enchantment (GK 56)",
        8: "Versatility (GK 16)",
        9: "Transparency (GK 64)"
    }
    
    return {
        "shadow_work": vice_shadow_map[enneagram_type],
        "gift_development": virtue_gift_map[enneagram_type],
        "pearl_sequence": f"Transform {vice_shadow_map[enneagram_type]} → {virtue_gift_map[enneagram_type]}",
        "synthesis_description": f"Your Enneagram Type {enneagram_type} shadow work aligns with Gene Keys shadow work in {vice_shadow_map[enneagram_type]}"
    }
```

## Tarot & Archetypal Correspondences

### Major Arcana Mapping

**Enneagram Types → Tarot Cards:**

| Type | Primary Arcana | Secondary Arcana | Reasoning |
|------|---------------|------------------|-----------|
| 1 | VIII - Strength / XI - Justice | The Hierophant | Inner control, moral rectitude, principles |
| 2 | II - High Priestess | The Empress | Nurturing, intuitive giving, emotional wisdom |
| 3 | The Chariot | The Magician | Achievement, willpower, manifestation |
| 4 | The Hermit | The Moon | Deep introspection, emotional complexity |
| 5 | The Hermit | The Hierophant | Knowledge-seeking, withdrawal, expertise |
| 6 | The Lovers | The Devil | Loyalty/doubt duality, trust issues |
| 7 | The Fool | The Sun | Optimism, adventure, boundless energy |
| 8 | The Emperor | Strength | Authority, power, direct action |
| 9 | Temperance | The World | Balance, peace, unity |

### Court Card Correlation

**Wing Combinations → Court Cards:**

```python
def map_enneagram_to_court_cards(type_num: int, wing: Optional[int]) -> List[str]:
    """Map Enneagram type + wing to Court Card archetypes."""
    
    court_map = {
        "1w9": "King of Swords - Principled and peaceful authority",
        "1w2": "Queen of Swords - Helpful perfectionist",
        "2w1": "Queen of Cups - Principled nurturer",
        "2w3": "Knight of Cups - Achieving helper",
        "3w2": "Knight of Pentacles - Helpful achiever",
        "3w4": "King of Pentacles - Unique success",
        "4w3": "Queen of Cups - Achieving artist",
        "4w5": "Knight of Cups - Withdrawn romantic",
        "5w4": "King of Swords - Creative thinker",
        "5w6": "Page of Swords - Loyal analyst",
        "6w5": "Page of Swords - Thoughtful loyalist",
        "6w7": "Knight of Wands - Adventurous loyalist",
        "7w6": "Knight of Wands - Loyal enthusiast",
        "7w8": "King of Wands - Powerful adventurer",
        "8w7": "King of Wands - Enthusiastic leader",
        "8w9": "King of Pentacles - Peaceful power",
        "9w8": "Queen of Pentacles - Grounded peacemaker",
        "9w1": "Queen of Wands - Principled harmonizer"
    }
    
    wing_key = f"{type_num}w{wing}" if wing else None
    return court_map.get(wing_key, "No specific court card mapping")
```

### Suit Correspondences

**Centers → Suits:**
```
Body Center (8, 9, 1) → Pentacles/Earth
- Physical, practical, grounded

Heart Center (2, 3, 4) → Cups/Water
- Emotional, relational, feeling

Head Center (5, 6, 7) → Swords/Air
- Mental, analytical, conceptual

(Wands/Fire spans all - represents passion and action)
```

## Astrology Integration

### Planetary Rulers

**Enneagram Types → Planetary Associations:**

| Type | Planet | Reasoning |
|------|--------|-----------|
| 1 | Saturn | Structure, discipline, perfection |
| 2 | Venus | Love, connection, harmony |
| 3 | Sun | Identity, achievement, recognition |
| 4 | Neptune | Depth, uniqueness, emotional intensity |
| 5 | Mercury | Mind, analysis, communication |
| 6 | Moon | Security, trust, emotional bonds |
| 7 | Jupiter | Expansion, optimism, adventure |
| 8 | Mars | Power, action, directness |
| 9 | Venus/Neptune | Peace, unity, merging |

### Elemental Correlation

**Centers → Elements:**
```
Body Center → Earth
Heart Center → Water
Head Center → Air

(Fire is the motivating force across all types)
```

### Modality Mapping

**Arrow Patterns → Modalities:**
```
Integration Direction → Mutable (flexibility, growth)
Core Type → Fixed (stability, consistency)
Disintegration Direction → Cardinal (initiation of stress response)
```

## Myers-Briggs Type Indicator (MBTI) Correlation

### Type Clusters

**Enneagram → MBTI Common Patterns:**

| Enneagram | Common MBTI Types | Reasoning |
|-----------|-------------------|-----------|
| Type 1 | ISTJ, ESTJ, INTJ | Structured, principled, judging |
| Type 2 | ESFJ, ENFJ, ISFJ | People-focused, feeling, giving |
| Type 3 | ENTJ, ESTP, ESTJ | Achievement-oriented, efficient |
| Type 4 | INFP, INFJ, ISFP | Individualistic, deep feeling |
| Type 5 | INTP, INTJ, ISTP | Thinking-dominant, withdrawn |
| Type 6 | ISFJ, ISTJ, INFP | Security-seeking, loyal |
| Type 7 | ENFP, ENTP, ESFP | Perceiving, idea-generating, optimistic |
| Type 8 | ENTJ, ESTP, ESTJ | Dominant, action-oriented, direct |
| Type 9 | INFP, ISFP, INFJ | Peace-seeking, adaptive, introverted |

### Function Stack Correlation

**Example: Type 5 + INTP**
```
Dominant Ti (Introverted Thinking) ↔ Enneagram 5 Core (Understanding)
Auxiliary Ne (Extraverted Intuition) ↔ 5's theoretical exploration
Tertiary Si (Introverted Sensing) ↔ 5's resource conservation
Inferior Fe (Extraverted Feeling) ↔ 5's social discomfort
```

## Unified Personality Synthesis

### Multi-Engine Analysis Format

```python
def generate_unified_profile(
    enneagram_result: EnneagramOutput,
    hd_result: HumanDesignOutput,
    gene_keys_result: GeneKeysOutput
) -> Dict:
    """
    Create unified personality synthesis across engines.
    """
    
    synthesis = {
        "core_archetype": {
            "enneagram": enneagram_result.profile.primary_type.name,
            "human_design": f"{hd_result.type} {hd_result.profile}",
            "gene_keys": f"{gene_keys_result.life_work}",
            "synthesis": f"The {enneagram_result.profile.primary_type.name} {hd_result.type}"
        },
        
        "decision_making": {
            "enneagram_center": enneagram_result.profile.center.name,
            "hd_authority": hd_result.authority,
            "synthesis": f"Process through {enneagram_result.profile.center.name} center, decide via {hd_result.authority}"
        },
        
        "growth_path": {
            "enneagram_integration": enneagram_result.raw_data['integration_path'],
            "gene_keys_pearl": gene_keys_result.pearl_sequence,
            "synthesis": "Transform shadow → gift → siddhi while moving toward integration type"
        },
        
        "shadow_work": {
            "enneagram_vice": enneagram_result.profile.primary_type.vice,
            "gene_keys_shadow": gene_keys_result.primary_shadows,
            "focus_area": "Primary shadow work integrating both systems"
        },
        
        "gift_expression": {
            "enneagram_virtue": enneagram_result.profile.primary_type.virtue,
            "gene_keys_gifts": gene_keys_result.primary_gifts,
            "hd_channels": hd_result.defined_channels,
            "synthesis": "Express gifts through defined channels while embodying virtue"
        }
    }
    
    return synthesis
```

### Resonance Score Calculation

```python
def calculate_cross_engine_resonance(
    enneagram_type: int,
    hd_type: str,
    gene_keys_profile: str
) -> float:
    """
    Calculate how well different engine results resonate with each other.
    
    High resonance (> 0.8): Aligned archetypes reinforcing each other
    Medium resonance (0.5-0.8): Complementary but different approaches
    Low resonance (< 0.5): Potential internal conflict requiring integration
    """
    
    # Example alignment patterns
    high_resonance_patterns = [
        (5, "Projector", "5/1"),  # Investigator + Observer + Investigator
        (8, "Manifestor", "1/3"),  # Challenger + Initiator + Pioneer
        (2, "Generator", "6/2"),   # Helper + Responder + Role Model
    ]
    
    # Calculate base resonance from pattern matching
    # Add modifiers for center alignment, strategy-instinct fit
    # Return final resonance score [0.0, 1.0]
    
    return resonance_score
```

## Practical Integration Examples

### Example 1: The Analytical Hermit

**Profile:**
- Enneagram: Type 5w4 (The Iconoclast)
- Human Design: Projector 5/1
- Gene Keys: Life Work in GK 48 (Wisdom)

**Synthesis:**
```
Archetype: "The Wisdom Keeper"

Decision Process:
- Wait for recognition (HD Projector)
- Process through Head center (Enneagram)
- Trust splenic intuition (HD Authority)

Shadow Work:
- Transform avarice (Enneagram) and stagnation (GK 48)
- Share knowledge rather than hoard
- Balance withdrawal with appropriate engagement

Growth Path:
- Move toward Type 8 confidence (Enneagram integration)
- Develop resourcefulness gift (Gene Keys)
- Wait for correct invitations to share wisdom (HD Strategy)

Gift Expression:
- Deep insight and original thinking (5w4)
- Penetrating perspective (5/1 profile)
- Transformative wisdom (GK 48 Siddhi)
```

### Example 2: The Empowered Helper

**Profile:**
- Enneagram: Type 2w1 (Servant)
- Human Design: Manifesting Generator 6/2
- Gene Keys: Life Work in GK 7 (Being)

**Synthesis:**
```
Archetype: "The Sacred Servant"

Decision Process:
- Respond to what lights up (HD Sacral)
- Process through Heart center (Enneagram)
- Integrate principled standards (1 wing)

Shadow Work:
- Transform pride (Enneagram) and coercion (GK 7)
- Give from fullness, not neediness
- Honor personal boundaries

Growth Path:
- Move toward Type 4 authenticity (Enneagram integration)
- Develop equanimity gift (Gene Keys)
- Multi-passionate service through correct responses (HD)

Gift Expression:
- Principled generosity (2w1)
- Role model through life phases (6/2)
- Being as service (GK 7 Siddhi)
```

## API Integration Points

### Cross-Engine Query Endpoint

```python
@app.route('/api/v1/synthesis/unified', methods=['POST'])
def unified_synthesis():
    """
    Generate unified personality synthesis across multiple engines.
    
    Request body:
    {
        "user_id": "user_12345",
        "engines": ["enneagram", "human_design", "gene_keys"],
        "synthesis_depth": "full"  # "basic", "standard", "full"
    }
    """
    
    # Run each engine
    enneagram = EnneagramResonator().process(user_data)
    human_design = HumanDesignEngine().process(user_data)
    gene_keys = GeneKeysEngine().process(user_data)
    
    # Generate synthesis
    synthesis = generate_unified_profile(enneagram, human_design, gene_keys)
    
    # Calculate resonance
    resonance = calculate_cross_engine_resonance(
        enneagram.profile.primary_type.number,
        human_design.type,
        gene_keys.profile
    )
    
    return {
        "synthesis": synthesis,
        "resonance_score": resonance,
        "integration_recommendations": generate_integration_recommendations(synthesis)
    }
```

### Shared Data Models

```python
class UnifiedArchetype(BaseModel):
    """Unified archetype across all engines."""
    
    primary_name: str
    enneagram_type: int
    hd_type: str
    gene_keys_profile: str
    archetype_description: str
    core_patterns: List[str]
    
class CrossEngineResonance(BaseModel):
    """Measures alignment across engines."""
    
    overall_score: float
    enneagram_hd_alignment: float
    enneagram_gk_alignment: float
    hd_gk_alignment: float
    conflict_areas: List[str]
    integration_opportunities: List[str]
```

## Future Integration Possibilities

### Biofield Engine
- Map Enneagram types to energetic signatures
- Center-chakra correlations
- Vice/virtue frequency patterns

### Sigil Forge
- Generate type-specific sigils
- Sacred geometry based on type number
- Wing integration through geometric forms

### Astrology Engine
- Natal chart + Enneagram synthesis
- Transits affecting type expression
- Progressed chart + development levels

### I Ching
- Type-specific hexagram correlations
- Growth path through I Ching sequences
- Shadow work via trigram patterns

---

*This mapping system enables deep personality synthesis and provides multiple lenses for understanding consciousness patterns across the WitnessOS ecosystem.*
