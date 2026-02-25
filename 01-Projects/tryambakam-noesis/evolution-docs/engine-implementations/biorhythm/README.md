# Biorhythm Engine Documentation

> **Complete technical documentation for WitnessOS Biorhythm Synchronizer Engine**  
> Extracted from production source code: `biorhythm.py` & `biorhythm_models.py`

---

## 📚 Documentation Overview

This directory contains comprehensive documentation for the Biorhythm Synchronizer Engine, one of the core consciousness analysis engines in the WitnessOS platform.

### What is Biorhythm?

Biorhythm theory posits that human life follows predictable sine wave patterns from birth. The Biorhythm Engine calculates three primary cycles:

- **Physical Cycle (23 days)** - Strength, stamina, coordination, immune response
- **Emotional Cycle (28 days)** - Mood, creativity, emotional sensitivity, artistic expression
- **Intellectual Cycle (33 days)** - Mental clarity, analytical ability, memory, judgment

Plus three extended cycles:
- **Intuitive Cycle (38 days)** - Sixth sense, unconscious perception
- **Aesthetic Cycle (43 days)** - Artistic appreciation, beauty perception
- **Spiritual Cycle (53 days)** - Spiritual awareness, inner peace, transcendence

### Documentation Structure

This documentation suite consists of four comprehensive documents:

#### 1. [Biorhythm Calculation Formulas](./biorhythm-calculation-formulas.md) (~600-800 lines)
**Complete mathematical specification**

- Core sine wave formulas with LaTeX notation
- Phase classification algorithms (critical/rising/peak/falling/valley)
- Critical day detection logic
- Energy level computation
- Compatibility algorithms (dual biorhythm)
- Forecast generation mathematics
- Extended cycle formulas
- Synchronization scoring
- Trend analysis algorithms

**Key Formulas:**
```
Physical:     P(t) = 100 × sin(2π(t - t₀)/23)
Emotional:    E(t) = 100 × sin(2π(t - t₀)/28)
Intellectual: I(t) = 100 × sin(2π(t - t₀)/33)
```

#### 2. [Biorhythm Implementation Architecture](./biorhythm-implementation-architecture.md) (~700-900 lines)
**Complete architectural specification**

- System architecture overview
- Core components (BiorhythmEngine, BiorhythmCalculator)
- Data flow pipeline
- Calculation engine internals
- Data models & type system (Python + TypeScript interfaces)
- Visualization data structure for charting
- Timeline calculation system (past/present/future)
- Interpretation layer (mystical narrative generation)
- Caching & performance optimization
- Error handling & validation

**Architecture Highlights:**
- Input validation with Pydantic models
- Sine wave generation pipeline
- Phase classification engine
- Critical day detection batch processing
- Chart data output for visualization

#### 3. [Biorhythm API Specification](./biorhythm-api-specification.md) (~500-700 lines)
**Complete REST API documentation**

- Single biorhythm calculation endpoint
- Dual biorhythm (compatibility) endpoint
- Date range query endpoint with chart data
- Critical day alerts API
- Webhook notifications for critical days
- Rate limiting policies
- Error responses & codes
- Code examples (TypeScript, Python, cURL)

**API Endpoints:**
```
POST /biorhythm/calculate         - Single person calculation
POST /biorhythm/compatibility     - Two person compatibility
POST /biorhythm/forecast          - Extended date range with chart data
GET  /biorhythm/critical-days     - Get critical days in range
POST /biorhythm/alerts/subscribe  - Subscribe to critical day alerts
```

#### 4. [Biorhythm Cross-Engine Mappings](./biorhythm-cross-engine-mappings.md) (~600-800 lines)
**Integration with other WitnessOS engines**

- **Vimshottari Dasha Integration**
  - Planetary period × biorhythm cycle correlation
  - Amplification algorithms
  - Dasha transition × critical day synchronization
  - Unified energy scoring

- **VedicClock Temporal Synthesis**
  - Nakshatra-biorhythm correlation matrix
  - Muhurta-biorhythm activity optimization
  - Tithi-phase alignment algorithms

- **Biofield Energetic Correlation**
  - Chakra-biorhythm mapping
  - Energy field coherence calculation
  - Subtle body integration

- **Multi-Engine Synthesis Protocol**
  - Unified consciousness state calculation
  - Cross-engine correlation scoring
  - Optimal timing window identification
  - Unified dashboard specification

---

## 🎯 Quick Start

### For Developers

**Understanding the Mathematics:**
Start with [Calculation Formulas](./biorhythm-calculation-formulas.md) to understand the mathematical foundation.

**Implementing the Engine:**
Read [Implementation Architecture](./biorhythm-implementation-architecture.md) to understand system design and data models.

**Integrating the API:**
Use [API Specification](./biorhythm-api-specification.md) for REST endpoint integration with code examples.

**Cross-Engine Integration:**
Study [Cross-Engine Mappings](./biorhythm-cross-engine-mappings.md) to integrate with other consciousness engines.

### For Researchers

The documentation provides complete mathematical specifications, correlation matrices, and integration algorithms suitable for:
- Academic research on biorhythm theory
- Multi-modal consciousness analysis
- Temporal alignment systems
- Energy field mapping

---

## 📊 Key Concepts

### Critical Days

A **critical day** occurs when two or more cycles cross the zero point simultaneously. These represent heightened sensitivity and potential instability.

**Detection:** `|cycle_percentage| ≤ 2%` for at least 2 cycles

### Phase Classification

Each cycle is classified into five phases:

| Phase | Range | Description |
|-------|-------|-------------|
| **Critical** | -2% to +2% | Zero-crossing transition |
| **Rising** | +2% to +85% | Ascending energy |
| **Peak** | +85% to +100% | Maximum potential |
| **Falling** | +2% to -85% | Descending energy |
| **Valley** | -85% to -100% | Minimum energy |

### Compatibility Score

For two people, compatibility is calculated as:

$$
C_i = 1 - \frac{|R_{1,i}(t) - R_{2,i}(t)|}{200}
$$

Where:
- Score = 1.0 when cycles are identical
- Score = 0.0 when cycles are opposite extremes

---

## 🔗 Integration Points

### Data Models

**Input:**
```typescript
interface BiorhythmInput {
  user_id: string;
  birth_date: string;  // ISO 8601: "YYYY-MM-DD"
  target_date?: string;
  include_extended_cycles?: boolean;
  forecast_days?: number;  // 1-90
}
```

**Output:**
```typescript
interface BiorhythmOutput {
  physical_percentage: number;  // -100 to +100
  emotional_percentage: number;
  intellectual_percentage: number;
  
  physical_phase: "critical" | "rising" | "peak" | "falling" | "valley";
  emotional_phase: PhaseType;
  intellectual_phase: PhaseType;
  
  overall_energy: number;
  critical_day: boolean;
  trend: "ascending" | "descending" | "mixed" | "stable";
  
  critical_days_ahead: string[];
  best_days_ahead: string[];
  challenging_days_ahead: string[];
  
  // ... extensive additional fields
}
```

### Visualization Data

The engine provides chart-ready data:

```typescript
interface BiorhythmChartData {
  data_points: Array<{
    date: string;
    day_index: number;
    physical: number;
    emotional: number;
    intellectual: number;
    overall_energy: number;
    is_critical_day: boolean;
  }>;
  
  chart_config: {
    cycles: { [key: string]: { color: string; visible: boolean } };
    // ... more config
  };
}
```

---

## 🧬 Source Code Reference

These documents were extracted from:

**Primary Source Files:**
- `/01-Projects/WitnessOS/docs/engines/biorhythm.py` (546 lines)
- `/01-Projects/WitnessOS/docs/engines/biorhythm_models.py` (230 lines)

**Related Modules:**
- `shared.base.engine_interface.BaseEngine`
- `shared.calculations.biorhythm.BiorhythmCalculator`
- `shared.base.data_models` (Pydantic models)

---

## 📖 Document Statistics

| Document | Lines | Topics Covered |
|----------|-------|----------------|
| Calculation Formulas | ~750 | 10 major topics, complete mathematical specification |
| Implementation Architecture | ~900 | 10 architectural layers, data models, visualization |
| API Specification | ~650 | 6 REST endpoints, webhooks, code examples |
| Cross-Engine Mappings | ~800 | 4 engine integrations, synthesis protocols |
| **Total** | **~3,100 lines** | **Comprehensive system documentation** |

---

## 🎨 Use Cases

### Personal Energy Management
Track daily energy patterns for optimal task scheduling:
- Schedule demanding work during intellectual peaks
- Plan physical activities during physical peaks
- Allow emotional recovery during valley phases

### Relationship Compatibility
Analyze biorhythm compatibility between partners:
- Physical compatibility for physical activities
- Emotional compatibility for relationship depth
- Intellectual compatibility for communication

### Optimal Timing
Identify best days for important activities:
- High energy days (overall energy > 50%)
- Challenging days (energy < -25%)
- Critical days requiring extra mindfulness

### Multi-Modal Consciousness Analysis
Integrate with other engines for unified insights:
- Biorhythm + Vimshottari Dasha = karmic timing alignment
- Biorhythm + VedicClock = optimal muhurta selection
- Biorhythm + Biofield = chakra energy correlation

---

## 🚀 Performance Characteristics

**Calculation Speed:**
- Single day calculation: < 5ms
- 7-day forecast: 10-50ms
- 30-day forecast: 30-100ms
- 90-day forecast: 80-200ms

**Accuracy:**
- Mathematical precision: 100% (deterministic sine waves)
- Confidence score: 0.9-1.0 (highly confident)

**Scalability:**
- Stateless calculations (no database required for computation)
- Cacheable results (24-hour TTL)
- Batch processing optimized with vectorization

---

## 🔐 Security & Privacy

**Data Handling:**
- Birth date is sensitive personal information
- Calculations are ephemeral (no storage requirement)
- Results can be cached with user consent
- API requires authentication (JWT/API key)

**Rate Limiting:**
- Free tier: 100 requests/day
- Pro tier: 10,000 requests/day
- Enterprise: Unlimited

---

## 📝 Contributing

This documentation was generated from production source code. To update:

1. Modify source files in `/01-Projects/WitnessOS/docs/engines/`
2. Extract new documentation using extraction protocols
3. Validate mathematical formulas and code examples
4. Update version numbers and timestamps

---

## 📄 License

This documentation is part of the WitnessOS platform.

**Proprietary Notice:** The biorhythm engine implementation and this documentation are proprietary to the WitnessOS project. The mathematical formulas are based on public domain biorhythm theory.

---

## 📞 Support

For questions about this documentation or the biorhythm engine:

- **Technical Issues:** Review API Specification error codes
- **Integration Help:** See Cross-Engine Mappings for examples
- **Mathematical Questions:** Refer to Calculation Formulas with proofs

---

## 🗓️ Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01 | Initial comprehensive documentation extracted from source |

---

## 🔮 Future Enhancements

**Planned Features:**
- Machine learning for personalized cycle periods
- Historical accuracy validation against user logs
- Additional extended cycles (mastery, awareness, perception)
- Real-time critical day push notifications
- Advanced compatibility beyond two-person analysis

---

**Document Suite Version:** 1.0  
**Extraction Date:** January 2026  
**Total Documentation:** ~3,100 lines across 4 comprehensive documents  
**Source:** WitnessOS Biorhythm Synchronizer Engine

---

## Quick Navigation

- [📊 Calculation Formulas →](./biorhythm-calculation-formulas.md)
- [🏗️ Implementation Architecture →](./biorhythm-implementation-architecture.md)
- [🔌 API Specification →](./biorhythm-api-specification.md)
- [🔗 Cross-Engine Mappings →](./biorhythm-cross-engine-mappings.md)
