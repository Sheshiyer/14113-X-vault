# Human Design Engine Documentation

Complete implementation reference for the Human Design Scanner engine in WitnessOS.

## 📚 Documentation Files

### 1. [Calculation Formulas](./human-design-calculation-formulas.md)
**~1000 lines** - Complete mathematical reference

- Astronomical calculations (88° solar arc, Swiss Ephemeris)
- Gate/Line/Color/Tone/Base formulas
- Type determination algorithms
- Profile calculation logic
- Center definition rules
- Channel and definition calculations
- Incarnation Cross computation
- All lookup tables and constants

### 2. [Implementation Architecture](./human-design-implementation-architecture.md)
**~1200 lines** - System design and data flow

- Multi-layer architecture (API → Engine → Calculation → Output)
- Python data models (Pydantic)
- TypeScript type definitions
- Processing pipeline details
- Dual calculator system (Swiss Ephemeris + fallback)
- Caching strategy (Cloudflare KV)
- Error handling patterns
- Performance optimization

### 3. [API Specification](./human-design-api-specification.md)
**~800 lines** - REST API reference

- Complete endpoint documentation
- Request/response schemas
- Authentication methods
- Error codes and handling
- Code examples (Python, JavaScript, cURL)
- Rate limiting details
- Webhook integration

### 4. [Cross-Engine Mappings](./human-design-cross-engine-mappings.md)
**~900 lines** - Integration with other engines

- Gene Keys integration (1:1 gate mapping, frequency correlation)
- I-Ching hexagram correspondence
- VedicClock transit tracking
- Biofield energy pattern mapping
- Astrology planetary correlations
- Multi-engine synthesis examples

## 🎯 Quick Start

### Basic Calculation

```python
from witnessOS.engines import HumanDesignScanner

engine = HumanDesignScanner()

chart = engine.calculate({
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "birth_location": [40.7128, -74.0060],
    "timezone": "America/New_York"
})

print(f"Type: {chart.chart.type_info.type_name}")
print(f"Profile: {chart.chart.profile.profile_name}")
print(f"Strategy: {chart.chart.type_info.strategy}")
```

### API Request

```bash
curl -X POST https://api.witnessOS.ai/v1/engines/human-design/calculate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "birth_location": [40.7128, -74.0060],
    "timezone": "America/New_York"
  }'
```

## 🔑 Key Concepts

### Type System
- **Generator** (37%) - To Respond, Sacral Authority
- **Manifesting Generator** (33%) - To Respond then Inform
- **Projector** (20%) - Wait for Invitation
- **Manifestor** (9%) - To Inform
- **Reflector** (1%) - Wait a Lunar Cycle

### Profile Lines
12 unique profiles combining conscious/unconscious lines (1-6)
- 1: Investigator
- 2: Hermit
- 3: Martyr
- 4: Opportunist
- 5: Heretic
- 6: Role Model

### Nine Centers
- Head, Ajna, Throat, G, Heart, Sacral, Solar Plexus, Spleen, Root
- Each can be defined (consistent) or undefined (open)

### 64 Gates
Based on I-Ching hexagrams, mapped to the zodiac wheel
- Each gate: 6 lines, 6 colors, 6 tones, 5 bases

## 📊 Data Flow

```
Birth Data → Astronomical Calculation → Gate Mapping → 
Type/Profile Determination → Center Analysis → Chart Assembly → 
Interpretation Generation → Output
```

## 🛠️ Technical Stack

- **Language**: Python 3.9+
- **Validation**: Pydantic v2
- **Astronomy**: Swiss Ephemeris (primary), Skyfield (fallback)
- **Cache**: Cloudflare KV
- **API**: REST over Cloudflare Workers

## 📖 Source Files

Extracted from:
- `/WitnessOS/docs/engines/human_design.py` (756 lines)
- `/WitnessOS/docs/engines/human_design_models.py` (273 lines)

## 🔗 Related Engines

- **Gene Keys**: 1:1 gate mapping, frequency correlation
- **I-Ching**: Hexagram correspondence
- **VedicClock**: Temporal transit tracking
- **Biofield**: Energy field patterns

## 📝 License

WitnessOS Proprietary - Internal Documentation

## 🤝 Contributing

Contact: engineering@witnessOS.ai

---

**Version**: 1.0  
**Updated**: 2026-01-25  
**Status**: Production Ready
