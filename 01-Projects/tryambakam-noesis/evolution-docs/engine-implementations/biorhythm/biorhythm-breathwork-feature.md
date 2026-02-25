# Biorhythm-Based Breathwork Feature Spec
`Version: 1.0.0 | Source: Apple Reminders Ingestion | Date: 2026-01-29`

## Vision

Customize breathwork pause durations based on individual biorhythm cycles, with optional Google Health API integration for enhanced biometric inputs.

## Core Concept

Biorhythms fluctuate in predictable cycles (Physical: 23 days, Emotional: 28 days, Intellectual: 33 days). Breathwork timing can be dynamically adjusted based on:

1. **Current biorhythm phase** → adjust breath holds
2. **Biorhythm peaks** → more intense practices
3. **Biorhythm lows** → gentler, restorative practices
4. **Critical days** → grounding, stabilizing breathwork

## Feature Components

### 1. Biorhythm-Aware Breath Timing

```javascript
breathworkConfig = {
  baseInhale: 4,   // seconds
  baseHold: 4,
  baseExhale: 4,
  
  // Modifiers based on biorhythm percentage
  physicalModifier: calculatePhysicalModifier(biorhythm.physical),
  emotionalModifier: calculateEmotionalModifier(biorhythm.emotional),
  intellectualModifier: calculateIntellectualModifier(biorhythm.intellectual)
}
```

### 2. Google Health API Integration (Optional)

**Data points to incorporate:**
- Heart rate variability (HRV)
- Resting heart rate
- Sleep quality
- Stress indicators

**Integration approach:**
- OAuth2 connection to Google Fit
- Real-time biometric adjustments
- Historical pattern analysis

### 3. User Personalization

- Birth date input for biorhythm calculation
- Optional health API connection
- Breathwork style preferences (Wim Hof, Box, 4-7-8, custom)
- Session duration preferences

## Relation to OASIS

This feature maps to:
- **Engine #3: Biorhythm Synchronizer** (primary)
- **Engine #11: Biofield Metrics** (when combined with biometric data)
- **Engine #7: Vedicclock** (circadian alignment)

## Implementation Notes

1. Use existing biorhythm calculation formulas from `biorhythm-calculation-formulas.md`
2. Breathwork pause logic in client-side app
3. Google Health integration via REST API
4. Consider privacy implications of health data

## Next Steps

1. [ ] Define breathwork protocols to support (Wim Hof, Box, 4-7-8)
2. [ ] Map biorhythm % ranges to breath timing modifiers
3. [ ] Design Google Health OAuth flow
4. [ ] Create prototype with manual biorhythm input

## Tags

`#biorhythm` `#breathwork` `#engine-3` `#google-health` `#oasis` `#product-feature`
