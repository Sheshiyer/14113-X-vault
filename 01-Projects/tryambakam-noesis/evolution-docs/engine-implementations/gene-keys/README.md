# Gene Keys Engine Documentation

Complete implementation reference for the Gene Keys Compass engine in WitnessOS.

## 📚 Documentation Files (4,700+ lines total)

### 1. [Calculation Formulas](./gene-keys-calculation-formulas.md) - ~1000 lines
### 2. [Implementation Architecture](./gene-keys-implementation-architecture.md) - ~1400 lines  
### 3. [API Specification](./gene-keys-api-specification.md) - ~1200 lines
### 4. [Cross-Engine Mappings](./gene-keys-cross-engine-mappings.md) - ~1100 lines

## 🎯 Quick Start

```python
from witnessOS.engines import GeneKeysCompass

profile = engine.calculate({
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "birth_location": [40.7128, -74.0060],
    "timezone": "America/New_York"
})
```

## 🔑 Key Concepts

**Three Frequencies**: Shadow → Gift → Siddhi  
**Three Sequences**: Activation, Venus, Pearl  
**Programming Partners**: Balance through complementary keys  
**Codon Rings**: 64 keys map to 20 amino acids

## 📖 Source
- gene_keys.py (384 lines)
- gene_keys_models.py (144 lines)

---
**Version**: 1.0 | **Updated**: 2026-01-25
