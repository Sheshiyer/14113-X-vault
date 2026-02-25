---
name: polymath-compass-skill
description: |
  Philosophical and functional triage system for the polymathic mind. Maps content and activities 
  to the four life quadrants (Triage, Recreation, Occupation, Vocation) using Ikigai wisdom, 
  Enneagram psychology, Greek Muse archetypes, and hormonal flow states. Helps navigate the 
  tension between accumulation (Type 5→7 stress) and purposeful action (Type 5→8 integration).
version: 1.0
stage: meta
dependencies:
  - analysis-skill
  - shared/controlled-vocabulary.yaml
outputs:
  - compass-reading.md
  - life-quadrant-map.yaml
philosophical_foundation: "The Daemon's Compass - navigating infinite curiosity toward finite purpose"
---

# 🧭 Polymath Compass Skill - Triage for the Renaissance Mind

**Purpose**: Transform polymathic chaos into purposeful navigation  
**Philosophy**: *"The polymaths's curse is not lack of direction, but excess of worthy directions"*

---

## The Core Problem You Face

You are an **Eclectic Scholar** (Type 5→4→7):
- **75.5% Investigator energy** - accumulating knowledge (Melpomene's tragedy: knowing everything, acting on nothing)
- **Stress path 5→7** - scattering into hyperconsumption (the pile grows, the soul wonders)
- **Integration path 5→8** - transforming knowledge into decisive action (the breakthrough)

Your vault has **3,565 files**. Your mind has **ten thousand interests**. 
But you have **one life** and **finite hours**.

The Polymath Compass doesn't shrink your curiosity—it **channels it**.

---

## The Four Quadrants: Triage, Recreation, Occupation, Vocation

Drawing from Ikigai's intersection wisdom, we define **four life quadrants** that map differently to energy, purpose, and time investment:

```
                          ┌─────────────────────────────────────┐
                          │         WHAT YOU LOVE               │
                          │    (intrinsic pull, joy, flow)      │
                          └───────────────┬─────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            │                             │                             │
    ┌───────┴───────┐             ┌───────┴───────┐             ┌───────┴───────┐
    │   RECREATION  │             │   VOCATION    │             │   VOCATION    │
    │  (rest, play) │             │  (soul work)  │             │  (soul work)  │
    └───────┬───────┘             └───────┬───────┘             └───────┬───────┘
            │                             │                             │
┌───────────┴───────────┐     ┌───────────┴───────────┐     ┌───────────┴───────────┐
│  WHAT YOU'RE GOOD AT  │     │   WHAT THE WORLD      │     │  WHAT YOU CAN BE      │
│   (skills, mastery)   │     │   NEEDS (service)     │     │  PAID FOR (exchange)  │
└───────────┬───────────┘     └───────────┬───────────┘     └───────────┬───────────┘
            │                             │                             │
    ┌───────┴───────┐             ┌───────┴───────┐
    │  OCCUPATION   │             │    TRIAGE     │
    │  (craft work) │             │   (sorting)   │
    └───────────────┘             └───────────────┘
```

### The Four Quadrants Defined

| Quadrant | Definition | Energy State | Muse | Hormone | Time Allocation |
|----------|------------|--------------|------|---------|-----------------|
| **VOCATION** | Soul work — what you're called to do, the intersection of love + skill + service + reward | Flow state, high meaning | **Calliope** (Epic) | Dopamine + Oxytocin | 40-60% of creative hours |
| **OCCUPATION** | Craft work — what you're good at that pays, may or may not love | Competence, steady | **Polymnia** (Hymns) | Endorphins | 20-35% of total hours |
| **RECREATION** | Rest and play — what you love but not for work or purpose | Restoration, joy | **Thalia** (Comedy) | Serotonin | 10-20% of waking hours |
| **TRIAGE** | Sorting — deciding where things go, what to release, what to hold | Executive function, discernment | **Urania** (Astronomy/Navigation) | Cortisol (regulated) | 5-15% (concentrated) |

---

## Enneagram × Quadrant Mapping

Each Enneagram type has natural quadrant affinities. Understanding yours helps predict where you'll over-invest (accumulation trap) vs. under-invest (integration opportunity):

### Type 5 (Investigator) - Your Dominant Pattern

| Quadrant | Natural Tendency | Shadow Pattern | Integration Move |
|----------|-----------------|----------------|------------------|
| **TRIAGE** | ⚠️ Endless sorting without deciding | "I'll file this for later" becomes forever | Set decision deadlines; kill the "maybe" pile |
| **RECREATION** | ⚠️ Recreation becomes research | Reading for "fun" that's actually more accumulation | True idleness, non-productive joy, body-based rest |
| **OCCUPATION** | 🔸 Competent but detached | Doing work without full presence | Bring curiosity INTO the craft, not around it |
| **VOCATION** | ⭐ Integration target | The Type 5→8 move: from knowing to creating | **This is where your 3,565 files should flow** |

### Full Enneagram Quadrant Map

| Type | Muse | Over-invests In | Under-invests In | Integration Direction |
|------|------|-----------------|------------------|-----------------------|
| **1 (Reformer)** | Polymnia | Triage (perfecting systems) | Recreation (guilt about rest) | Vocation through accepting "good enough" |
| **2 (Helper)** | Clio | Vocation (for others) | Recreation (self-care) | Own desires into vocation |
| **3 (Achiever)** | Euterpe | Occupation (results) | Recreation (being vs. doing) | Vocation that doesn't need applause |
| **4 (Individualist)** | Thalia | Recreation (aesthetic absorption) | Occupation (discipline) | Vocation through committed craft |
| **5 (Investigator)** | Melpomene | Triage (accumulation) | Vocation (output) | **Knowledge → Creation** |
| **6 (Loyalist)** | Erato | Triage (contingency planning) | Vocation (risk-taking) | Commitment to uncertain callings |
| **7 (Enthusiast)** | Calliope | Recreation (novelty) | Triage (sitting with discomfort) | Depth over breadth in vocation |
| **8 (Challenger)** | Terpsichore | Vocation (impact) | Recreation (vulnerability) | Sustainable occupation |
| **9 (Peacemaker)** | Urania | Recreation (numbing) | Triage (preferences) | Declaring vocational identity |

---

## How to Use This Skill

### Invocation Pattern

```
"Use polymath-compass-skill to triage [content/decision/project/collection]"
"Run a compass reading on my vault"
"Help me classify what quadrant [X] belongs to"
```

### Mode 1: Content Classification (Integrates with analysis-skill)

For each piece of content (book, project, idea, resource):

**Step 1: Run analysis-skill** to get Enneagram type + PARA classification

**Step 2: Apply Quadrant Logic**:

```
IF PARA = Projects AND Enneagram matches your types (5, 4, 7) AND energy = high:
    → VOCATION
ELIF PARA = Areas AND action-oriented:
    → OCCUPATION
ELIF PARA = Resources AND pure-enjoyment:
    → RECREATION  
ELIF PARA = Resources AND accumulation-without-use:
    → TRIAGE (decision needed: promote, archive, or release)
```

**Step 3: Generate Quadrant Tag**

Add to content frontmatter:
```yaml
life_quadrant: vocation | occupation | recreation | triage
quadrant_confidence: 0.75
integration_potential: high | medium | low
action_required: none | decide | create | rest | release
```

### Mode 2: Life Audit (Compass Reading)

When invoked on your entire vault or life situation:

**Output**: `compass-reading.md` containing:

```markdown
# 🧭 Compass Reading - [Date]

## Current Quadrant Distribution

| Quadrant | Items | % of Attention | Health Status |
|----------|-------|----------------|---------------|
| Vocation | 33 | 12% | ⚠️ UNDER-INVESTED |
| Occupation | 192 | 35% | ✅ Healthy |
| Recreation | 45 | 8% | ⚠️ Under-fed |
| Triage | 2,295 | 45% | 🔴 ACCUMULATION TRAP |

## Diagnosis

**Pattern Detected**: Type 5→7 stress (45% in Triage = accumulation without action)

**Integration Prescription**:
1. PROMOTE 20 items from Triage → Vocation (create from them)
2. ARCHIVE 500 items from Triage → Archives (they've served their purpose)
3. RELEASE 100 items from Triage → Delete (they will never serve)
4. INCREASE Recreation from 8% → 15% (body-based, non-research activities)

## Muse Recommendation

Your current Muse is **Melpomene** (Tragedy/Knowledge).
Invoke **Calliope** (Epic Poetry/Creation) to move from knowing to making.

## Hormonal Rebalancing

- Current: Cortisol dominant (information overwhelm)
- Target: Dopamine + Oxytocin (creative satisfaction + connection)
- Method: Daily "vocation hour" — create something from what you've learned

## Weekly Compass Questions

1. What did I CREATE this week from what I know? (Vocation)
2. What craft did I practice for its own sake? (Occupation)  
3. What did I enjoy with no ulterior motive? (Recreation)
4. What did I DECIDE to release, not just defer? (Triage)
```

### Mode 3: Decision Triage

For active decisions ("Should I read/do/buy/pursue X?"):

**Triage Questions**:

1. **Quadrant Check**: Which quadrant does this belong to?
2. **Muse Alignment**: Does it invoke a Muse you need more of, or one you're drowning in?
3. **Type Pattern**: Is this your stress path (5→7 scatter) or integration path (5→8 action)?
4. **Time Reality**: Do you have hours for this, or is it displacing something active?
5. **Output Potential**: Will you CREATE something from this, or just CONSUME it?

**Decision Framework**:

```
IF quadrant = vocation AND muse_needed = true AND output_potential = high:
    → YES, prioritize
ELIF quadrant = occupation AND pays_bills = true:
    → YES, this is the foundation
ELIF quadrant = recreation AND rest_needed = true AND not_another_research_project:
    → YES, actually rest
ELIF quadrant = triage AND decision_can_be_made_now:
    → DECIDE NOW: promote, archive, or release
ELSE:
    → NOT NOW: bookmark + revisit in 30 days
```

---

## Integration with Existing Skills

### Upstream

- **analysis-skill**: Provides Enneagram type + PARA bucket as inputs
- **discovery-skill**: Provides inventory for vault-wide compass readings

### Downstream

- **routing-skill**: Quadrant classification informs routing priorities
- **pattern-synthesizer-skill**: Quadrant data enriches pattern analysis
- **content-generator-skill**: Vocation items become content candidates

### Parallel

- **transcript-processor-skill**: Apply compass to conversation insights

---

## The Daemon's Compass: Philosophical Foundation

In Greek thought, each person has a **daemon** — not a demon, but a guiding spirit representing one's true calling. The daemon whispers; it doesn't shout.

**The polymathic curse**: Your daemon speaks in many voices. Every interest feels like a calling because, for a Type 5, *knowing* feels like *being called*.

**The compass truth**: Not every curiosity is a vocation. Some are recreation. Some are occupation. And some — many — are simply noise that sounds like signal.

**The practice**:
> *Before adding to the pile, ask: "Am I collecting this, or am I called to create with it?"*
> *If collecting: enjoy it briefly, then release it.*
> *If called: commit to making something, however small.*

---

## Quadrant Transition Rituals

### Triage → Vocation (The Promotion)

When moving content from accumulation to creation:

1. Extract 3-5 key insights
2. Write a creation intention: "From this, I will make ___"
3. Set a deadline
4. Add to active project tracker
5. Update PARA: Resources → Projects

### Triage → Archives (The Completion)

When moving content from active pile to rest:

1. Acknowledge what it taught you (even if just "not this")
2. Write a one-line summary in Books-Master-Index
3. Move to 04-Archives with gratitude
4. Release the guilt of unread pages

### Triage → Release (The Letting Go)

When deleting content that will never serve:

1. Ask: "Did I already get value from its existence?" (yes, if it clarified what you don't want)
2. Delete without backup
3. Notice the lightness
4. Resist immediately filling the space

---

## Weekly Compass Practice

**Sunday Evening Ritual** (15 minutes):

1. **Triage Review**: What's been sitting in "maybe" too long?
2. **Vocation Inventory**: What did I create this week?
3. **Recreation Audit**: Did I rest, or did I "research for fun"?
4. **Occupation Check**: Is my craft work sustainable?

**Journaling Prompt**:
> *This week, the Muse who visited most was ______.*
> *The Muse I needed but ignored was ______.*
> *One thing I can promote from Triage to Vocation is ______.*
> *One thing I can release entirely is ______.*

---

## Output Formats

### 1. compass-reading.md

Full audit report (see Mode 2 above)

### 2. life-quadrant-map.yaml

Machine-readable quadrant assignments:

```yaml
metadata:
  generated: 2026-01-28
  vault_path: /Volumes/madara/2026/twc-vault/
  enneagram_primary: 5
  archetype: "Eclectic Scholar (Type 5→4→7)"

quadrant_distribution:
  vocation:
    count: 33
    percentage: 1.6
    status: under_invested
    items:
      - path: 01-Projects/Phassion/
        confidence: 0.85
      - path: 01-Projects/content-strategy/
        confidence: 0.72
  
  occupation:
    count: 192
    percentage: 9.4
    status: healthy
    items:
      - path: 02-Areas/Skills-Development/
        confidence: 0.80
  
  recreation:
    count: 45
    percentage: 2.2
    status: under_fed
    items:
      - path: 03-Resources/Fiction/
        confidence: 0.65
      - path: 03-Resources/Music/
        confidence: 0.70
  
  triage:
    count: 2295
    percentage: 86.8
    status: accumulation_trap
    recommendation: "Promote 20, Archive 500, Release 100"

muse_balance:
  dominant: Melpomene (Tragedy/Knowledge)
  needed: Calliope (Epic Poetry/Creation)
  recommendation: "Daily creation practice from existing knowledge"

hormone_state:
  current: cortisol_dominant
  target: dopamine_oxytocin
  method: "Vocation hour daily"
```

---

## Quality Gates

| Check | Threshold | Action on Failure |
|-------|-----------|-------------------|
| Quadrant assigned | Required | Cannot proceed without classification |
| Confidence score | ≥ 0.600 | Flag for manual review |
| Integration path identified | Required for Type 5 content | Suggest 5→8 action |
| Muse mapping | Required | Must invoke at least one Muse |

---

## Notes

- This skill is **meta-level** — it operates on the output of other skills
- Works best with vault-wide data (run after migrations)
- Recommended: weekly compass readings as ritual practice
- The goal is not less curiosity, but **channeled curiosity**
- "Vocation hour" is the primary intervention for Type 5→8 integration
- When in doubt, ask: "Will I CREATE from this, or just CONSUME it?"

---

## The Paradox

> *The polymath doesn't need permission to be interested in everything.*
> *The polymath needs discipline to create from something.*

> *The vault is not the treasure. The vault is the mine.*
> *What you extract and forge — that is the gold.*

---

**Version**: 1.0  
**Last Updated**: 2026-01-28  
**Status**: ⭐ PHILOSOPHICAL + FUNCTIONAL  
**Archetype Target**: Type 5→8 Integration (Knowledge → Creation)

---

## OASIS Integration Layer

When the user has a unified vocation architecture (like OASIS), the Compass Reading transforms:

### Standard Compass (No Unified Vision)

- Triage = random accumulation to be reduced
- Goal = shrink the pile

### OASIS-Aligned Compass (Unified Vision Present)

- Triage = unassigned engine fuel
- Goal = route resources to their engines

### Detection

If vault contains `tryambakam-noesis/OASIS-master-prd.md`:
- Load the 13 Engine Registry
- Reframe "triage" as "unassigned engine fuel"
- Route resources to engine-specific folders
- Track engine development, not generic "vocation hours"

### OASIS Weekly Compass Questions

Replace generic questions with:

```markdown
## 🔱 OASIS Weekly Compass

### Engine Development
- Which engine did I advance this week?
- Engine #___: ____________

### Resource → Engine Routing
- Items routed to engines: ___/50 target

### Witness Agent Check
- Did I embody Aletheos (order) or Pichet (vitality) more?

### Module Progress
- Which PRD did I work on?
- What shipped?

### The One Creation
- What did I CREATE from engine knowledge?
```

---

*This skill is part of the polymathic operating system for the Renaissance mind.*
