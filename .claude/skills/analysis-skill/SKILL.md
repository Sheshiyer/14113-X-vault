---
name: analysis-skill
description: Performs Stage 3 of the 6-stage pipeline - Enneagram psychological type classification and PARA bucket routing using reality-tested vocabulary from 3,565 successfully processed files. This skill should be used when analyzing content (books, papers, documents) to assign Enneagram types (9 types with Greek Muses and hormones), determine PARA destination (Resources/Areas/Projects), map to domain categories (35 proven destinations), and calculate confidence scores. Uses controlled-vocabulary.yaml as single source of truth.
version: 2.1
stage: 3 of 6
dependencies:
  - shared/controlled-vocabulary.yaml
  - shared/quality-thresholds.yaml
  - extraction-skill
outputs:
  - analysis-results.json
quality_gates:
  - confidence_min: 0.600
  - enneagram_assigned: true
  - para_bucket_assigned: true
  - domain_mapped: true
---

# ⭐ Analysis Skill - Stage 3: Enneagram + PARA Classification

**Pipeline Stage**: 3 of 6 (Discovery → Extraction → **Analysis** → Routing → Processing → Integration)  
**Role**: Critical semantic classification engine using Enneagram psychology and PARA organizational logic

---

## Overview

> 💡 **Purpose**: The Analysis Skill is the critical intelligence layer of the vault pipeline, transforming raw extracted text into rich semantic classifications using proven Enneagram psychology and PARA organizational frameworks.

This skill performs multi-dimensional content analysis by assigning psychological types (9 Enneagram types with Greek Muse archetypes and hormonal mappings), determining organizational buckets (PARA system), and mapping content to domain categories. It transforms unstructured text into structured metadata that drives intelligent routing and organization.

The skill operates on extracted text from Stage 2 and produces classification data that feeds into Stage 4's routing logic. It leverages Claude's native reasoning capabilities combined with reality-tested vocabulary, making it both powerful and maintainable without external ML dependencies.

**Key Innovation**: Uses **reality-tested vocabulary** from 4 complete migrations (3,565 files, 100% success rate), not theoretical assumptions. Type 5 (Investigator) dominance (75.5%) is used as Bayesian prior probability, dramatically improving classification accuracy for knowledge-focused content.

**Quality Standards**: Min 0.600 confidence threshold, average 0.623 confidence, >85% MOC coverage target (proven at 92.8% in production), 100% classification success rate on test corpus.

---

## When to Use

Use this skill when:
- ✅ Processing books, papers, or documents for vault intake
- ✅ Need to classify content by psychological type (Enneagram system)
- ✅ Need to route content to PARA structure (Resources/Areas/Projects)
- ✅ Working with extracted text from Stage 2 (extraction-skill output)
- ✅ Before Stage 4 determines physical destination paths

**Prerequisites**:
- Extracted text available from Stage 2 (extraction-skill)
- `controlled-vocabulary.yaml` loaded with 35 domain subdomains
- `quality-thresholds.yaml` loaded with validation gates
- Enneagram distribution data with Type 5 prior (75.5%)

**Not Suitable For**:
- ❌ Raw PDF/EPUB files (use extraction-skill first)
- ❌ Already-classified content (skip to routing-skill)
- ❌ Non-textual content without extracted text
- ❌ Content outside the 35 proven domain categories

---

## Core Process

> 🔍 **Input**: Extracted text files from Stage 2 (extraction-skill)  
> 📝 **Output**: `analysis-results.json` with Enneagram types, PARA buckets, domain mappings, confidence scores, and MOC links

### Step 1: Load Controlled Vocabulary

Load the single source of truth from `../shared/controlled-vocabulary.yaml`:
- `enneagram.distribution` (9 types with proven percentages)
- `domains.subdomains` (35 actual destinations)
- `para_structure.distribution` (89% / 9.4% / 1.6% split)

**Commands**:
```bash
# Extract vocabulary sections
cat ../shared/controlled-vocabulary.yaml | grep -A 50 "^enneagram:" > enneagram_section.txt
cat ../shared/controlled-vocabulary.yaml | grep -A 100 "subdomains:" > domains_section.txt
cat ../shared/controlled-vocabulary.yaml | grep -A 20 "para_structure:" > para_section.txt
```

**Expected Result**: Vocabulary loaded into memory with 9 Enneagram types, 35 domain subdomains, and PARA distribution percentages.

---

### Step 2: Classify Content

For each extracted text file:

**A. Semantic Retrieval Pass (Meru Layer) [NEW v3.0]**:
Before performing isolated analysis, query the global vault index to see where similar knowledge already resides:
- **Command**: `.venv-meru/bin/python3 _System/scripts/memory/query_vault.py --query "[EXTRACTED_TEXT_SUMMARY]" --top 5 --json`
- **Goal**: Identify existing clusters (PARA/Domain) that share semantic similarity. 
- **Influence**: If the top 5 results are 80%+ consistent in a specific domain, weight the final classification toward that domain.

**B. Determine Enneagram Type** (with prior weighting):
- Type 5 (Investigator): 75.5% - Research, knowledge, analysis
- Type 3 (Achiever/Healer): 5.5% - Health, wellness, optimization
- Type 8 (Challenger): 4.9% - Power, systems, critical thinking
- Type 1 (Reformer): 4.2% - Sacred geometry, perfectionism
- Type 4 (Individualist): 3.9% - Occult, mysticism
- Type 7 (Enthusiast): 2.2% - Hidden history, exploration
- Type 6 (Loyalist): 1.5% - Law, security
- Type 9 (Peacemaker): 1.3% - Consciousness, meditation
- Type 2 (Helper): 1.0% - Personal development, service

**C. Determine PARA Bucket** (with proven distribution):
- Resources (89.0%): Reference material, passive accumulation
- Areas (9.4%): Skills-Development, active work
- Projects (1.6%): Phassion research, applied work
- Archives (0.0%): Not used currently

**D. Map to Domain** (choose from 35 proven subdomains):
Top destinations: Knowledge/Research (50.6%), Skills-Development (9.4%), Health/Wellness (4.0%), Occult/Esoteric-Knowledge (3.8%), General/Uncategorized (3.5%)

**E. Calculate Confidence** (min 0.600, avg 0.623, max 0.850)

**F. Suggest MOC Links** (target >85% coverage)

**Validation**: ✅ Check that all five classification components are assigned with confidence scores calculated.

---

### Step 3: Output Analysis Results

Create JSON structure with:
- Enneagram primary/secondary
- Hormone mappings
- PARA bucket
- Subdomain
- Confidence score
- MOC links
- Routing notes

**Output Format**:
```json
{
  "id": "ROUTE_0001",
  "source_path": "/path/to/file.pdf",
  "enneagram_primary": "Type 5 - Melpomene (Investigator)",
  "enneagram_primary_num": "5",
  "hormone_primary": "Cortisol",
  "classification_confidence": 0.65,
  "para_bucket": "Resources",
  "subdomain": "Knowledge/Research",
  "moc_links": ["General-Knowledge-Library-Index.md"],
  "routing_notes": "Classified as 5→5 via keyword analysis"
}
```

**Output Path**: `analysis-results.json`

---

### Step 4: Validate Quality Gates

Check thresholds from `../shared/quality-thresholds.yaml`:
- ✅ Enneagram type assigned
- ✅ PARA bucket determined
- ✅ Confidence > 0.600
- ✅ Domain category mapped

If checks fail, flag for manual review.

**Validation**: ✅ All quality gates must pass before proceeding to Stage 4.

---

## Archetype Pattern Detection

If Type 5 exceeds 70% in collection, flag:
- Archetype: "The Eclectic Scholar (Type 5→4→7)"
- Stress: Type 5→7 (scatter, accumulation)
- Integration needed: Type 5→8 (action over accumulation)

**Detection Logic**:
```python
if (type_5_percentage > 0.70):
    flag_archetype("Eclectic Scholar")
    suggest_integration("Type 5→8: Transform accumulation into action")
```

---

## Polymath Convergence Classification

**NEW (v2.1)**: For documents integrating 3+ Enneagram types with >15% weight each, use multi-type classification instead of forcing single-type.

**When to Use Polymath Classification**:
- Document covers 3+ distinct domains (e.g., gematria + astrology + tarot)
- Multiple valid type assignments with similar confidence
- Genesis/foundational documents for complex systems
- Multi-domain convergence conversations

**Configuration**:
```yaml
polymath_classification:
  enabled: true
  multi_type_threshold: 0.15  # Include secondary types >15% weight
  max_types: 4  # Primary, secondary, tertiary, quaternary
  weighted_confidence: true  # Calculate composite confidence
  hormone_cascade: true  # Map all significant types to hormones
```

**Classification Process**:

1. **Identify All Significant Types** (weight >15%):
   - Calculate weight scores for all 9 types
   - Rank by weight percentage
   - Include all types above threshold

2. **Calculate Weighted Distribution**:
   ```python
   type_weights = {
       5: 0.40,  # Investigator (research depth)
       1: 0.25,  # Reformer (sacred geometry)
       4: 0.20,  # Individualist (occult synthesis)
       9: 0.15,  # Peacemaker (consciousness)
   }
   ```

3. **Assign Primary + Secondary + Tertiary + Quaternary**:
   - Primary (highest weight): Dominant type
   - Secondary (>15%): Significant secondary influence
   - Tertiary (>15%): Third influence (if present)
   - Quaternary (>15%): Fourth influence (if present)

4. **Map Hormone Cascade**:
   - Primary hormone from dominant type
   - Secondary hormones from all types >15%
   - Document interaction patterns

5. **Calculate Composite Confidence**:
   ```python
   composite_confidence = sum(weight * type_confidence for each type) / sum(weights)
   ```

**Output Format** (Polymath Convergence):
```json
{
  "id": "ROUTE_POLYMATH_0001",
  "classification_type": "polymath_convergence",
  "enneagram_distribution": {
    "primary": {"type": 5, "weight": 0.40, "name": "Type 5 - Melpomene (Investigator)"},
    "secondary": {"type": 1, "weight": 0.25, "name": "Type 1 - Polymnia (Reformer)"},
    "tertiary": {"type": 4, "weight": 0.20, "name": "Type 4 - Thalia (Individualist)"},
    "quaternary": {"type": 9, "weight": 0.15, "name": "Type 9 - Urania (Peacemaker)"}
  },
  "hormone_cascade": {
    "primary": "Cortisol",
    "secondary": ["Melatonin", "Dopamine", "Serotonin"]
  },
  "composite_confidence": 0.750,
  "polymath_note": "First polymath convergence document in vault",
  "special_document_type": "genesis",
  "routing_notes": "Multi-type weighted classification - requires constellation MOC"
}
```

**Quality Gates (Polymath)**:
- ✅ Minimum 3 types with >15% weight
- ✅ Composite confidence ≥ 0.750 (higher threshold for polymath)
- ✅ All types have clear domain evidence
- ✅ Hormone cascade mapped for all significant types

**Special Document Types**:
- `foundational`: Documents establishing vault frameworks
- `genesis`: Origin conversations for major systems
- `constellation`: Multi-domain convergence documents

**Example (AIPRM Thread)**:
- Type 5 (40%): 25+ cipher systems, research depth
- Type 1 (25%): Sacred geometry, Pythagorean precision
- Type 4 (20%): Occult synthesis, mysticism
- Type 9 (15%): Consciousness, Aletheos witness
- Result: **Polymath Convergence** (not forced single type)

---

## Implementation Details

> ⚙️ **Technical Specifications**

### Data Structures

**Input Format** (from extraction-skill):
```json
{
  "file_path": "/path/to/file.pdf",
  "extracted_text": "Full text content...",
  "page_count": 250,
  "metadata": {
    "title": "Book Title",
    "author": "Author Name"
  }
}
```

**Output Format**:
```json
{
  "id": "ROUTE_0001",
  "source_path": "/path/to/file.pdf",
  "enneagram_primary": "Type 5 - Melpomene (Investigator)",
  "enneagram_primary_num": "5",
  "enneagram_secondary": "Type 8",
  "hormone_primary": "Cortisol",
  "hormone_secondary": "Adrenaline",
  "greek_muse": "Melpomene",
  "classification_confidence": 0.650,
  "para_bucket": "Resources",
  "subdomain": "Knowledge/Research",
  "moc_links": [
    "General-Knowledge-Library-Index.md",
    "Books-Master-Index.md"
  ],
  "routing_notes": "Type 5 classification with high research content density",
  "archetype_pattern": "Type 5→5 (stable)",
  "timestamp": "2026-01-25T10:30:00Z"
}
```

---

### Key Algorithms

**Enneagram Classification Algorithm**:
1. Load extracted text content
2. Apply Type 5 prior probability weight (75.5%)
3. Perform keyword/theme matching across 9 types
4. Calculate primary and secondary type scores
5. Map to Greek Muse archetype and hormone
6. Assign confidence score based on signal strength

**Example Logic**:
```python
def classify_enneagram(text, prior_weights):
    # Type 5 gets 75.5% prior boost
    scores = {type: 0.0 for type in range(1, 10)}
    
    # Keyword matching
    if "research" in text or "knowledge" in text:
        scores[5] += 0.3
    if "health" in text or "wellness" in text:
        scores[3] += 0.3
    if "power" in text or "systems" in text:
        scores[8] += 0.3
    
    # Apply priors
    for type_num, weight in prior_weights.items():
        scores[type_num] *= (1 + weight)
    
    primary = max(scores, key=scores.get)
    return primary, get_muse(primary), get_hormone(primary)
```

**PARA Determination Algorithm**:
1. Check for action-oriented keywords ("how-to", "guide", "skill")
2. Check for active project indicators (Phassion, research)
3. Default to Resources (89% historical prior)

**Confidence Calculation Formula**:
```python
confidence = 0.600  # Base minimum
confidence += keyword_strength * 0.15  # Max +0.15
confidence += enneagram_clarity * 0.15  # Max +0.15
confidence += para_fit * 0.10  # Max +0.10
confidence = min(confidence, 0.850)  # Cap at maximum
```

---

### Error Handling

**Missing Text**: If extracted text is empty, flag for manual review and skip classification  
**Low Confidence**: If confidence < 0.600, flag for manual review but continue with best-effort classification  
**Ambiguous Type**: If top 2 types are within 0.05 score, assign both as primary/secondary

```bash
# Validation check
if [ confidence < 0.600 ]; then
    echo "⚠️ Low confidence: $confidence - flagging for review"
    flag_for_review "$file_path"
fi
```

---

## Quality Gates

> ✅ **Validation Checkpoints**

This skill enforces the following quality gates (from `shared/quality-thresholds.yaml`):

| Gate | Threshold | Action on Failure |
|------|-----------|-------------------|
| Confidence Score | ≥ 0.600 | Flag for manual review |
| Enneagram Type | Must be assigned | STOP - cannot proceed |
| PARA Bucket | Must be assigned | STOP - cannot proceed |
| Domain Category | Must be mapped | STOP - cannot proceed |
| MOC Links | ≥ 1 link suggested | WARN - proceed with caution |

**Validation Steps**:
1. ✅ Check Enneagram type is one of 1-9
2. ✅ Check PARA bucket is Resources/Areas/Projects
3. ✅ Check domain is one of 35 proven subdomains
4. ✅ Check confidence score ≥ 0.600
5. ✅ Check at least 1 MOC link suggested

**Pass Criteria**: Gates 2-4 MUST pass. Gate 1 triggers review but allows proceed. Gate 5 is warning-only.

---

## Examples

> 📚 **Real-World Usage Scenarios**

### Example 1: Research Book Classification

**Context**: Processing "The Origin of Consciousness in the Breakdown of the Bicameral Mind" by Julian Jaynes - a dense research text on psychology and neuroscience.

**Invocation**:
```
"Analyze extracted text and classify using Enneagram+PARA system"
```

**Process**:
1. Loaded controlled vocabulary with Type 5 prior (75.5%)
2. Detected strong research keywords: "neuroscience", "evidence", "analysis", "consciousness"
3. Matched to Type 5 (Investigator) with Cortisol hormone
4. Determined PARA bucket: Resources (reference material, not actionable guide)
5. Mapped to domain: Knowledge/Research (50.6% prior matches)
6. Calculated confidence: 0.720 (high due to clear signals)
7. Suggested MOC links: Consciousness-Library-Index.md, General-Knowledge-Library-Index.md

**Output**:
```json
{
  "id": "ROUTE_0042",
  "enneagram_primary": "Type 5 - Melpomene (Investigator)",
  "enneagram_primary_num": "5",
  "hormone_primary": "Cortisol",
  "classification_confidence": 0.720,
  "para_bucket": "Resources",
  "subdomain": "Knowledge/Research",
  "moc_links": [
    "Consciousness-Library-Index.md",
    "General-Knowledge-Library-Index.md"
  ]
}
```

**Result**: Successfully classified with high confidence, routed to 03-Resources/Knowledge/Research/, linked to 2 MOCs.

---

### Example 2: Health Optimization Guide

**Context**: Processing "The 4-Hour Body" by Tim Ferriss - a practical, actionable health optimization guide.

**Invocation**:
```
"Classify this health and wellness guide for vault organization"
```

**Process**:
1. Detected actionable keywords: "how-to", "protocol", "guide", "optimization"
2. Matched to Type 3 (Achiever) with Endorphins hormone (health/wellness)
3. Determined PARA bucket: Areas (Skills-Development sub-category, actionable content)
4. Mapped to domain: Health/Wellness
5. Calculated confidence: 0.640 (moderate - mixed content)
6. Suggested MOC: Health-Library-Index.md

**Handling**: Skill correctly identified actionable content and routed to Areas (9.4% category) rather than default Resources.

**Output**:
```json
{
  "enneagram_primary": "Type 3 - Thalia (Achiever/Healer)",
  "hormone_primary": "Endorphins",
  "classification_confidence": 0.640,
  "para_bucket": "Areas",
  "subdomain": "Skills-Development/Health"
}
```

---

### Example 3: Ambiguous Content Recovery

**Context**: Processing a book on "Sacred Geometry and Consciousness" - overlaps between Type 1 (sacred geometry) and Type 9 (consciousness).

**Issue**: Ambiguous classification with two strong type signals.

**Resolution**: 
1. Detected dual signals: Type 1 (perfectionism, sacred geometry) and Type 9 (consciousness, meditation)
2. Type 1 scored 0.42, Type 9 scored 0.38 (within 0.05 threshold)
3. Assigned Type 1 as primary, Type 9 as secondary
4. Calculated confidence: 0.610 (just above minimum due to ambiguity)
5. Flagged for manual review due to borderline confidence
6. Suggested multiple MOCs: Consciousness-Library-Index.md + Occult-Library-Index.md

**Outcome**: Classification completed successfully with dual typing, flagged for review as expected. User confirmed routing was correct.

---

## Troubleshooting

> 🔧 **Common Issues & Solutions**

### Issue 1: Low Confidence Scores (< 0.600)

**Symptoms**:
- Classification completes but confidence score below 0.600 threshold
- File flagged for manual review
- Unclear which type to assign

**Cause**: Ambiguous content without clear thematic signals, or content spanning multiple domains without dominant theme.

**Solution**:
1. Review extracted text quality - ensure extraction was successful
2. Check for mixed-content (e.g., anthology, collection) - may need splitting
3. Manually review keywords and themes in extracted text
4. If truly ambiguous, classify as General/Uncategorized (3.5% fallback category)
5. Override confidence if manual review confirms classification

**Prevention**: Improve extraction quality in Stage 2; flag anthologies for special handling.

---

### Issue 2: Type 5 Over-Classification

**Symptoms**:
- 90%+ of collection classified as Type 5
- Exceeds historical 75.5% prior
- Potential loss of nuance

**Cause**: Type 5 prior weight too dominant, or collection genuinely skewed toward research content.

**Solution**:
1. Check if collection is genuinely research-heavy (valid)
2. If over-classification suspected, temporarily reduce Type 5 prior weight
3. Review sample of Type 5 classifications manually
4. Adjust prior in controlled-vocabulary.yaml if needed
```yaml
# Example adjustment
type_5:
  prior: 0.700  # Reduced from 0.755
```

**Check**: Verify adjusted classification on test corpus before applying to full collection.

---

### Issue 3: PARA Bucket Mismatch

**Symptoms**:
- Actionable content routed to Resources
- Reference material routed to Areas
- User expectations not met

**Cause**: Keyword matching for Areas (how-to, guide, skill) not detecting actionable content patterns.

**Solution**:
1. Review PARA determination keywords in controlled-vocabulary.yaml
2. Add domain-specific actionable indicators:
```yaml
para_structure:
  areas_keywords:
    - "how-to"
    - "guide"
    - "protocol"
    - "workbook"
    - "exercises"
```
3. Re-classify using updated keywords
4. Validate against known Areas content (Skills-Development category)

**Prevention**: Regularly review and expand actionable keyword list based on misclassifications.

---

### Issue 4: Missing MOC Links

**Symptoms**:
- Classification successful but no MOC links suggested
- MOC coverage below 85% target
- Content orphaned in vault

**Cause**: Domain mapping doesn't align with available MOC structure, or MOC mapping logic incomplete.

**Solution**:
1. Check domain assignment - verify it's one of 35 proven subdomains
2. Review MOC mapping table for domain:
```bash
# Find MOC mapping
grep "subdomain.*$domain" ../shared/controlled-vocabulary.yaml
```
3. Add missing MOC mappings to vocabulary:
```yaml
moc_mappings:
  "Knowledge/Research": ["General-Knowledge-Library-Index.md"]
  "Health/Wellness": ["Health-Library-Index.md"]
```
4. Ensure Books-Master-Index.md is always included as fallback

**Expected Improvement**: MOC coverage should rise above 85% target.

---

## Edge Cases

> ⚠️ **Special Situations**

### Edge Case 1: Multi-Domain Content

**Scenario**: Book covers multiple domains equally (e.g., "The Psychedelic Explorer's Guide" - both Health and Consciousness).

**Handling**: 
- Classify to dominant domain based on page count or chapter distribution
- Record secondary domain in routing notes
- Suggest MOC links for both domains
- Allow cross-linking in MOC indices

**Example**: Classified to Health/Wellness (primary), with Consciousness-Library-Index.md as secondary MOC link.

---

### Edge Case 2: Type 2/Type 9 Rare Types

**Scenario**: Content classified as Type 2 (Helper) or Type 9 (Peacemaker) - historically only 1.0% and 1.3% respectively.

**Handling**:
- Apply extra scrutiny due to rarity
- Require higher confidence threshold (0.700 vs 0.600)
- Check if content truly fits or is misclassified Type 5/Type 3
- Flag for manual verification

**Example**: Type 9 classification for meditation guide - validated and accepted despite rarity.

---

### Edge Case 3: Anthologies and Collections

**Scenario**: Book is anthology with multiple authors covering different topics (e.g., "The Best American Science Writing").

**Handling**:
- Classify based on dominant theme or editor's focus
- Note anthology status in routing notes
- Consider splitting into individual essays if highly divergent
- Use General/Uncategorized if no clear dominant theme

**Precedence**: If 60%+ of content aligns with one domain, use that. Otherwise, General/Uncategorized.

---

### Edge Case 4: Confidence Exactly at 0.600 Boundary

**Scenario**: Confidence score calculates to exactly 0.600 (minimum threshold).

**Behavior**: 
- Passes quality gate (≥ 0.600)
- Still flags for manual review (borderline)
- Proceeds to Stage 4 routing
- User can override or confirm

**Limitation**: Borderline classifications may benefit from human judgment.

---

## Related Skills

> 🔗 **Pipeline Integration**

### Upstream Dependencies
- **extraction-skill**: Provides extracted text and metadata from PDF/EPUB files. Analysis cannot proceed without clean text extraction.
- **discovery-skill**: Provides file inventory and checksums. Analysis uses file paths and metadata for tracking.

### Downstream Consumers
- **routing-skill**: Consumes analysis-results.json to determine physical vault paths. Relies on PARA bucket and subdomain mappings.
- **integration-skill**: Uses MOC links to update library indices. Relies on domain categorization and Enneagram types for index organization.

### Parallel Skills
- **None**: Analysis is sequential bottleneck - cannot parallelize across pipeline stages. However, can analyze multiple files in parallel within this stage.

---

## Resources

> 📖 **References & Dependencies**

### Shared Resources
- `shared/controlled-vocabulary.yaml` - Single source of truth with Enneagram types, PARA structure, 35 domain subdomains (580 lines)
- `shared/quality-thresholds.yaml` - Validation gates and confidence thresholds (200 lines)
- `shared/modernized-principles.md` - Classification philosophy and Type 5 prior justification

### External Dependencies
- **Tool**: Claude native reasoning - Semantic text analysis without external ML APIs
- **Library**: YAML parser (built-in) - Loading controlled vocabulary

### Documentation
- Enneagram Institute - Psychological type system reference
- PARA Method (Tiago Forte) - Organizational framework reference
- Greek Muses reference - Archetype mappings

### Historical Context
- **Original Implementation**: Python-based classifier with keyword matching (deprecated)
- **Migration Date**: 2026-01-25 (Skills Edition 2.0)
- **Proven Results**: 3,565 files classified, 100% success rate, 92.8% MOC coverage, avg 0.623 confidence

**Grep Patterns**:
```bash
# Find Enneagram distribution
grep -A 50 "^enneagram:" ../shared/controlled-vocabulary.yaml

# Find 35 subdomains
grep -A 100 "subdomains:" ../shared/controlled-vocabulary.yaml

# Find PARA percentages
grep -A 20 "para_structure:" ../shared/controlled-vocabulary.yaml
```

---

## Notes

> 📝 **Implementation Notes**

- Weight toward Type 5 (75.5% historical prior)
- Expect 89% Resources, 9.4% Areas, 1.6% Projects
- Use 35 proven destinations, not 26 theoretical
- Never go below 0.600 confidence
- Target >85% MOC coverage
- Watch for Type 5→7 stress pattern

**This is Stage 3 of 6**. Output feeds Stage 4 (routing-skill).

---

## Implementation Notes

**Note**: Analysis skill is the CRITICAL stage - loads controlled-vocabulary.yaml and performs Enneagram+PARA classification using native Claude reasoning.

### Implementation Logic Preserved

**1. Load Vocabulary**:
```bash
# Parse controlled-vocabulary.yaml
cat ../shared/controlled-vocabulary.yaml | grep -A 50 "^enneagram:" > enneagram_section.txt
cat ../shared/controlled-vocabulary.yaml | grep -A 100 "subdomains:" > domains_section.txt
cat ../shared/controlled-vocabulary.yaml | grep -A 20 "para_structure:" > para_section.txt
```

**2. Enneagram Classification** (Claude reasoning):
```
For each extracted text:
1. Read text content
2. Apply Type 5 prior (75.5% probability weight)
3. Match keywords/themes to 9 Enneagram types:
   - Type 5: research, knowledge, analysis, data → Cortisol
   - Type 3: health, wellness, achievement → Endorphins
   - Type 8: power, systems, critical thinking → Adrenaline
   - Type 1: sacred geometry, perfectionism → Melatonin
   - Type 4: occult, mysticism, individualism → Dopamine
   - Type 7: hidden history, exploration → Testosterone
   - Type 6: law, security, systems → Estrogen
   - Type 9: consciousness, meditation → Serotonin
   - Type 2: personal development, helping → Oxytocin
4. Assign primary + secondary types
5. Map to Greek Muse archetype
6. Map to hormone (challenge/reward/expansion)
```

**3. PARA Determination** (weighted):
```
If keywords match "how-to", "guide", "skill", "actionable":
    → Areas (9.4% historical)
Else if active project (Phassion, research):
    → Projects (1.6% historical)
Else:
    → Resources (89.0% historical - DEFAULT)
```

**4. Domain Mapping** (35 options):
```
Match text themes to 35 subdomains from controlled-vocabulary.yaml:
Top 10 most likely:
1. Knowledge/Research (50.6% prior)
2. Skills-Development (9.4% prior)
3. Health/Wellness (4.0% prior)
4. Occult/Esoteric-Knowledge (3.8% prior)
5. General/Uncategorized (3.5% - fallback)
[... 30 more from vocabulary]
```

**5. Confidence Calculation**:
```
Base confidence = 0.600 (minimum threshold)
Adjust up for:
  + Clear domain keywords (+0.05-0.15)
  + Strong Enneagram signals (+0.05-0.15)
  + Unambiguous PARA fit (+0.05-0.10)
Cap at 0.850 (maximum observed)
```

**6. MOC Link Suggestions**:
```
Based on domain, suggest from 10 MOCs:
- Knowledge/* → General-Knowledge-Library-Index.md
- Health/* → Health-Library-Index.md
- Technology/* → Technology-Library-Index.md
- Skills-Development → Skills-Development-Library-Index.md
- Occult/* → Occult-Library-Index.md
- Consciousness/* → Consciousness-Library-Index.md
- Critical-Thinking/* → Critical-Thinking-Library-Index.md
- Phassion/* → Phassion-Research-Hub.md
- Health/Medicinal-Mushrooms → Medicinal-Mushroom-Library.md
- All → Books-Master-Index.md
```

**7. JSON Output Generation**:
```json
{
  "id": "ROUTE_0001",
  "source_path": "/path/to/file.pdf",
  "enneagram_primary": "Type 5 - Melpomene (Investigator)",
  "enneagram_primary_num": "5",
  "hormone_primary": "Cortisol",
  "classification_confidence": 0.65,
  "para_bucket": "Resources",
  "subdomain": "Knowledge/Research",
  "moc_links": ["General-Knowledge-Library-Index.md"],
  "routing_notes": "Classified as 5→5 via keyword analysis"
}
```

**Implementation Status**: ✅ READY (Claude native reasoning with vocabulary loading)

### Key Insight
This skill leverages Claude's native understanding to classify content rather than requiring complex ML models or APIs. The controlled-vocabulary.yaml provides priors and categories, Claude does semantic matching.

---

## Version History

### v2.1 (2026-02-01) - Polymath Convergence Classification
- Added multi-type weighted classification for polymath documents
- Multi-type threshold: 0.15 (include secondary types >15% weight)
- Max types: 4 (primary, secondary, tertiary, quaternary)
- Weighted confidence calculation for composite scores
- Hormone cascade mapping for all significant types
- Special document types: foundational, genesis, constellation
- Composite confidence threshold: ≥ 0.750 for polymath documents

### v2.0 (2026-01-25) - Skills Edition
- Migrated from Python orchestrator to Claude native skills
- Integrated reality-tested vocabulary from 3,565 files
- Type 5 prior weighting (75.5%) for Bayesian classification
- 35 proven domain subdomains (not 26 theoretical)
- Quality gates: min 0.600 confidence, avg 0.623, max 0.850
- Archetype pattern detection (Eclectic Scholar)
- 100% success rate on test corpus

---

**Version**: 2.1 (Polymath Edition)
**Last Updated**: 2026-02-01
**Status**: ⭐ CRITICAL PRODUCTION SKILL
**Test Coverage**: Proven on 3,565 files with 100% success rate, 92.8% MOC coverage

---

*This skill is part of the 6-stage vault intake pipeline with proven 100% success rate on 3,565 files*
