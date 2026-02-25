# Sigil Forge Engine - Complete Documentation

## 🔥 Overview

The **Sigil Forge Synthesizer** is a consciousness programming engine that transforms intentions into symbolic sigils using traditional letter elimination, sacred geometry, and modern algorithmic approaches. It creates personalized symbols for manifestation and consciousness work.

---

## 📚 Documentation Structure

This directory contains the complete technical documentation for the Sigil Forge engine:

### Core Documentation Files

1. **[sigil-forge-calculation-formulas.md](./sigil-forge-calculation-formulas.md)** (~1,600 lines)
   - Letter reduction methods (traditional, Rose Cross, numerical)
   - Glyph generation algorithms (connecting letters, geometric patterns)
   - Intention encoding formulas
   - Charging/activation methods
   - Symbol combination rules
   - Planetary correspondence tables
   - Elemental attribution system

2. **[sigil-forge-implementation-architecture.md](./sigil-forge-implementation-architecture.md)** (~2,100 lines)
   - Multi-method sigil generation pipeline
   - Glyph rendering engine (SVG generation)
   - Intention parser and linguistic processing
   - Style variations (minimal, ornate, geometric, organic, mystical)
   - Data models (Python Pydantic + TypeScript)
   - Analysis and scoring algorithms

3. **[sigil-forge-api-specification.md](./sigil-forge-api-specification.md)** (~1,600 lines)
   - REST endpoints for sigil generation
   - SVG/PNG/PDF export formats
   - Batch generation API
   - Customization parameters
   - Code examples (Python, JavaScript, cURL, TypeScript)
   - Webhook for completion notifications
   - Authentication and rate limiting

4. **[sigil-forge-cross-engine-mappings.md](./sigil-forge-cross-engine-mappings.md)** (~3,200 lines)
   - Integration with Sacred Geometry (geometric foundations)
   - Integration with Numerology (letter-number correspondences)
   - Integration with Tarot (planetary attributions)
   - Integration with Human Design (personalized sigils)
   - Integration with Astrology/Vimshottari (timing optimization)
   - Consciousness intention amplification workflows
   - Multi-engine use cases

---

## 🎯 Quick Start

### Generate Your First Sigil

```python
from sigil_forge import SigilForgeSynthesizer, SigilForgeInput

# Initialize engine
engine = SigilForgeSynthesizer()

# Create input
input_data = SigilForgeInput(
    intention="I will find my true purpose",
    generation_method="traditional",
    style="minimal",
    color_scheme="black_white"
)

# Generate sigil
result = engine.calculate(input_data)

# Access results
print(f"Unique letters: {result.unique_letters}")
print(f"Method used: {result.method_used}")
print(f"Image saved to: {result.image_path}")
print(f"SVG saved to: {result.svg_path}")
```

### REST API Example

```bash
curl -X POST https://api.witnessOS.com/sigil-forge/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "intention": "I attract abundance and prosperity",
    "generation_method": "geometric",
    "sacred_geometry": "pentagon",
    "style": "mystical",
    "color_scheme": "golden"
  }'
```

---

## 🌟 Generation Methods

### 1. Traditional Method
**Based on:** Austin Osman Spare's chaos magic tradition  
**Process:** Letter elimination → Number conversion → Radial placement → Connection  
**Best for:** General intentions, classic sigil work

```python
SigilForgeInput(
    intention="I manifest my dreams",
    generation_method="traditional",
    connection_style="sequential"
)
```

**Visual Example:**
```
Original:  "I MANIFEST MY DREAMS"
Cleaned:   "IMANFESTMYDRE"
Unique:    "IMANFESTDYR"
Numbers:   [9, 13, 1, 14, 6, 5, 19, 20, 4, 25, 18]
Pattern:   Radial → Sequential connections → Decorative circles
```

### 2. Geometric Method
**Based on:** Sacred geometry principles  
**Options:** Triangle (fire), Square (earth), Pentagon (human), Hexagon (balance), Circle (unity)  
**Best for:** Spiritual work, consciousness expansion

```python
SigilForgeInput(
    intention="I awaken to higher consciousness",
    generation_method="geometric",
    sacred_geometry="circle"
)
```

**Visual Example:**
```
Sacred Base: Circle (unity, wholeness)
Structure:   12 radial spokes (zodiac)
Elements:    Letter symbols at each spoke
Pattern:     Radiating from center → Unity consciousness
```

### 3. Hybrid Method
**Combines:** Traditional + Geometric  
**Process:** Layer traditional sigil inside geometric framework  
**Best for:** Complex intentions requiring multiple approaches

```python
SigilForgeInput(
    intention="I transform obstacles into opportunities",
    generation_method="hybrid",
    sacred_geometry="triangle"
)
```

### 4. Personal Method
**Incorporates:** Birth date, personal symbols, numerology  
**Customization:** Life path number, zodiac elements  
**Best for:** Individual practice, personalized work

```python
from datetime import date

SigilForgeInput(
    intention="I align with my authentic self",
    generation_method="personal",
    birth_date=date(1990, 5, 15),
    personal_symbols=["phoenix", "lotus"]
)
```

---

## 🎨 Visual Styles

### Minimal
- Clean, simple lines
- Sparse elements
- Thin line weights
- High clarity
- **Best for:** Meditation focus, daily use

### Ornate
- Rich decoration
- Thick lines
- Decorative elements at nodes
- Complex patterns
- **Best for:** Ceremonial work, altar display

### Organic
- Flowing curves
- Natural forms
- Bézier curves instead of straight lines
- Asymmetric balance
- **Best for:** Emotional healing, relationship work

### Geometric
- Sharp angles
- Precise forms
- Mathematical precision
- Sacred geometry integration
- **Best for:** Logical manifestations, structure

### Mystical
- Esoteric symbols
- Glow effects
- Mystical elements (pentagrams, crosses)
- Spiritual overlay
- **Best for:** Spiritual work, invocations

---

## 🌈 Color Schemes

| Scheme | Primary | Use Case |
|--------|---------|----------|
| **Black & White** | #000000 | Universal, traditional |
| **Golden** | #FFD700 | Solar energy, success, abundance |
| **Silver** | #C0C0C0 | Lunar energy, intuition, dreams |
| **Red** | #DC143C | Mars energy, passion, courage |
| **Blue** | #4169E1 | Mercury energy, communication |
| **Purple** | #8A2BE2 | Jupiter energy, wisdom, expansion |

---

## ⚡ Complete Feature List

### Letter Processing
- [x] Traditional letter elimination
- [x] Rose Cross mapping
- [x] Numerical conversion (A=1, B=2, ..., Z=26)
- [x] Pythagorean reduction
- [x] Gematria values

### Geometric Algorithms
- [x] Radial placement (circle-based)
- [x] Spiral placement (golden ratio)
- [x] Grid placement (structured)
- [x] Sacred angle snapping

### Connection Methods
- [x] Sequential (traditional)
- [x] Star/Radial (center-focused)
- [x] Web/Network (complete graph)
- [x] Organic curves (Bézier)

### Sacred Geometry
- [x] Triangle (fire element)
- [x] Square (earth element)
- [x] Pentagon (human/golden ratio)
- [x] Hexagon (balance/harmony)
- [x] Circle (unity/spirit)

### Style Variations
- [x] Minimal
- [x] Ornate
- [x] Organic
- [x] Geometric
- [x] Mystical

### Export Formats
- [x] PNG (raster, 300 DPI)
- [x] SVG (vector, infinite scaling)
- [x] PDF (print-ready)
- [x] Animated SVG (drawing animation)

### Analysis Features
- [x] Complexity scoring
- [x] Balance calculation
- [x] Symmetry analysis
- [x] Element counting
- [x] Energy flow detection

### Correspondences
- [x] Planetary (7 planets)
- [x] Elemental (5 elements)
- [x] Zodiacal (12 signs)
- [x] Tarot (78 cards)
- [x] Numerological (9 base numbers + master)

### Activation Methods
- [x] Visualization charging
- [x] Elemental charging
- [x] Planetary hour timing
- [x] Personal energy work
- [x] Sexual gnosis (advanced)

---

## 🔗 Cross-Engine Integration

The Sigil Forge engine integrates seamlessly with other WitnessOS engines:

### With Sacred Geometry Engine
```python
# Use sacred geometry calculations for sigil base
from sacred_geometry import calculate_golden_ratio, fibonacci_spiral

sigil_points = calculate_golden_ratio(intention_numbers)
```

### With Numerology Engine
```python
# Incorporate life path number into sigil design
from numerology import calculate_life_path

life_path = calculate_life_path(birth_date)
sigil_modifiers = apply_numerology(life_path)
```

### With Tarot Engine
```python
# Use tarot correspondences for planetary timing
from tarot import get_planetary_card

planet = detect_planetary_influence(intention)
tarot_card = get_planetary_card(planet)
charging_guidance = tarot_card.ritual_guidance
```

### With Human Design Engine
```python
# Personalize based on HD type and strategy
from human_design import get_chart

hd_chart = get_chart(birth_time, location)
sigil_activation = customize_for_type(hd_chart.type, hd_chart.authority)
```

### Multi-Engine Workflow Example

```python
from sigil_forge import SigilForgeSynthesizer
from numerology import NumerologyEngine
from human_design import HumanDesignEngine
from tarot import TarotEngine

# User data
user = {
    'intention': 'I find my ideal career',
    'birth_date': date(1990, 5, 15),
    'birth_time': '14:30',
    'location': 'New York, NY'
}

# Calculate across engines
numerology = NumerologyEngine().calculate(user['birth_date'])
hd_chart = HumanDesignEngine().calculate(
    user['birth_date'], 
    user['birth_time'],
    user['location']
)

# Generate personalized sigil
sigil = SigilForgeSynthesizer().calculate(
    SigilForgeInput(
        intention=user['intention'],
        generation_method='personal',
        birth_date=user['birth_date'],
        # Customize based on numerology
        sacred_geometry=get_geometry_for_life_path(numerology.life_path),
        # Customize based on HD type
        style=get_style_for_hd_type(hd_chart.type),
        # Use planetary timing
        charging_method='planetary'
    )
)

# Enhanced activation guidance
activation = synthesize_activation_guidance(
    sigil=sigil,
    numerology=numerology,
    hd_chart=hd_chart
)
```

---

## 📊 Technical Specifications

### Performance
- **Generation Time:** < 2 seconds (traditional)
- **Generation Time:** < 3 seconds (geometric)
- **Generation Time:** < 5 seconds (hybrid)
- **SVG Size:** Typically 5-20 KB
- **PNG Size:** Typically 100-500 KB (300 DPI)

### Limits
- **Intention Length:** 3-500 characters
- **Unique Letters:** No limit (practical max ~26)
- **Elements per Sigil:** Typically 10-50
- **Maximum Complexity:** Adjustable (0-1 scale)

### API Rate Limits
| Tier | Requests/Hour | Batch Size |
|------|---------------|------------|
| Free | 10 | 1 |
| Basic | 100 | 5 |
| Pro | 1000 | 20 |
| Enterprise | Unlimited | 100 |

---

## 🧘 Usage Guidance

### Charging Your Sigil

**Traditional Method (Fire & Forget):**
1. Generate sigil
2. Charge through visualization (10-20 minutes)
3. Put away and consciously forget
4. Let unconscious work

**Active Method (Continuous):**
1. Generate sigil
2. Place where you'll see it regularly
3. Brief daily acknowledgment (30 seconds)
4. Allow natural manifestation

**Elemental Method:**
- **Fire:** Pass through candle flame or leave in sunlight
- **Water:** Submerge (if waterproof) or expose to rain
- **Air:** Burn incense around it or place in wind
- **Earth:** Bury for 24 hours or cover with salt

### Timing Recommendations

**Lunar Phases:**
- **New Moon:** New intentions, beginnings
- **Waxing Moon:** Growth, building
- **Full Moon:** Completion, manifestation
- **Waning Moon:** Release, banishing

**Planetary Hours:**
Use the planetary hour calculator to charge during optimal times:
- **Sunday/Sun:** Success, vitality, leadership
- **Monday/Moon:** Intuition, emotions, dreams
- **Tuesday/Mars:** Courage, action, protection
- **Wednesday/Mercury:** Communication, learning
- **Thursday/Jupiter:** Abundance, wisdom, growth
- **Friday/Venus:** Love, beauty, relationships
- **Saturday/Saturn:** Discipline, structure, boundaries

### Destruction Protocol

**When to Destroy:**
- After intention manifests (traditional approach)
- When you feel complete with the working
- If intention needs to be released/changed

**Methods:**
- **Burning:** Most traditional (fire element)
- **Burying:** Grounding energy (earth element)
- **Water Dissolution:** Flowing energy (water element)
- **Keeping:** For successful sigils as power objects

---

## 📖 Example Use Cases

### Career Manifestation
```python
SigilForgeInput(
    intention="I attract my ideal career opportunity",
    generation_method="hybrid",
    sacred_geometry="square",  # Earth element for material manifestation
    style="geometric",
    color_scheme="golden",  # Solar energy for success
    charging_method="planetary"  # Use Jupiter hours
)
```

### Relationship Healing
```python
SigilForgeInput(
    intention="I heal and attract loving relationships",
    generation_method="geometric",
    sacred_geometry="circle",  # Unity and wholeness
    style="organic",  # Flowing emotional energy
    color_scheme="silver",  # Lunar/Venus energy
    charging_method="elemental"  # Water element
)
```

### Spiritual Awakening
```python
SigilForgeInput(
    intention="I awaken to my highest consciousness",
    generation_method="personal",
    birth_date=your_birth_date,
    sacred_geometry="pentagon",  # Human/divine proportion
    style="mystical",
    color_scheme="purple",  # Spiritual energy
    charging_method="personal",  # Meditation-based
    optimize_for_meditation=True
)
```

### Financial Abundance
```python
SigilForgeInput(
    intention="I manifest abundant prosperity now",
    generation_method="traditional",
    connection_style="star",  # Radiating energy
    style="ornate",
    color_scheme="golden",
    charging_method="planetary",  # Jupiter hours
    add_activation_symbols=True
)
```

---

## 🔧 Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/witnessOS/sigil-forge.git
cd sigil-forge

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/

# Generate sample sigils
python examples/generate_samples.py
```

### Running the API Server

```bash
# Start development server
uvicorn api.main:app --reload --port 8000

# API will be available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Docker Deployment

```bash
# Build image
docker build -t sigil-forge:latest .

# Run container
docker run -p 8000:8000 sigil-forge:latest
```

---

## 📁 File Structure

```
sigil-forge/
├── README.md                                    # This file
├── sigil-forge-calculation-formulas.md          # Mathematical foundations
├── sigil-forge-implementation-architecture.md   # Code architecture
├── sigil-forge-api-specification.md             # API documentation
├── sigil-forge-cross-engine-mappings.md         # Integration specs
├── examples/
│   ├── basic_generation.py
│   ├── multi_engine_workflow.py
│   ├── batch_processing.py
│   └── advanced_customization.py
└── generated_sigils/                            # Output directory
    ├── sigil_20260125_143022.png
    ├── sigil_20260125_143022.svg
    └── sigil_20260125_143022_metadata.json
```

---

## 🤝 Contributing

We welcome contributions! See individual documentation files for:
- Algorithm improvements
- New generation methods
- Additional sacred geometry forms
- Style variations
- Cross-engine integrations

---

## 📄 License

Part of the WitnessOS ecosystem. See LICENSE file for details.

---

## 🌐 Resources

### Documentation
- [Calculation Formulas](./sigil-forge-calculation-formulas.md) - Mathematical foundations
- [Implementation Architecture](./sigil-forge-implementation-architecture.md) - Code structure
- [API Specification](./sigil-forge-api-specification.md) - REST API docs
- [Cross-Engine Mappings](./sigil-forge-cross-engine-mappings.md) - Integration guides

### External References
- Austin Osman Spare - "The Book of Pleasure"
- Chaos Magic tradition
- Golden Dawn sigil methods
- Sacred Geometry principles
- Modern chaos magic practitioners

### WitnessOS Engines
- Sacred Geometry Engine
- Numerology Engine
- Tarot Engine
- Human Design Engine
- Astrology/Vimshottari Engine

---

## 💬 Support

For questions, issues, or feature requests:
- GitHub Issues: https://github.com/witnessOS/sigil-forge/issues
- Documentation: Full docs in this directory
- API Support: api-support@witnessOS.com

---

## 🔮 Philosophy

The Sigil Forge engine operates on the principle that **consciousness shapes reality through focused intention**. Sigils serve as bridges between conscious desire and unconscious manifestation, bypassing the logical mind to program reality at a deeper level.

By combining traditional magical practices with modern algorithms and cross-engine integration, we create a powerful tool for consciousness programming that honors both ancient wisdom and contemporary innovation.

**Remember:** The sigil is not the power—you are. The sigil is simply a tool to focus and amplify your intention.

---

**Created:** 2026  
**Engine:** Sigil Forge Synthesizer v1.0  
**Part of:** WitnessOS Consciousness Operating System  
**Documentation Lines:** 7,000+ across 4 files  

🔥 **Transform intention into reality** 🔥
