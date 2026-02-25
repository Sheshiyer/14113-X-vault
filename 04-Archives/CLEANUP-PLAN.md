# 🧹 Projects Cleanup Plan — 2026-01-28

**Goal**: Extract value from dormant projects → Archive → Keep Projects area lean

---

## Current State: 25 Projects

| Status | Count | Size |
|--------|-------|------|
| Active (2026) | 8 | ~2.5 GB |
| Dormant (2025) | 17 | ~300 MB |
| **Total** | 25 | ~2.8 GB |

---

## TRIAGE DECISION MATRIX

### 🟢 KEEP ACTIVE (8 projects)

These are your OASIS core — last touched in 2026:

| Project | Size | OASIS Module | Action |
|---------|------|--------------|--------|
| `tryambakam-noesis` | 612M | PRD-07 (13 Engines) | ✅ Keep, enhance |
| `Phassion` | 1.8G | PRD-05 (Financial Oracle) | ✅ Keep, primary R&D |
| `Somatic-Canticles` | 1.9M | PRD-02 (Web App) | ✅ Keep, active writing |
| `Products` | 4K | PRD-08 (Store) | ✅ Keep, expand |
| `Eupheme-Hardware` | 0B | PRD-05 (HRV) | ✅ Keep, awaiting hardware |
| `LIVINGRY-Project` | 0B | Meta-framework | ✅ Keep, conceptual |
| `iOS-Wallpaper-Pack` | 8K | PRD-08 (Store product) | ✅ Keep |
| `Quantum-Numerology-Wallpapers` | 12K | PRD-08 (Store product) | ✅ Keep |

---

### 🟡 MERGE INTO OASIS (7 projects)

These have value but should be absorbed into active projects:

| Project | Size | Merge Into | Extraction Action |
|---------|------|------------|-------------------|
| `PHAS-ION` (old) | 40K | `Phassion` | Merge docs, archive folder |
| `Runtime-Systems` | 516K | `tryambakam-noesis/engines/` | Move Vedic-Runtime, Runtime-of-God concepts |
| `Lunar-Market-Dashboard` | 24K | `tryambakam-noesis/engines/financial/` | Merge PRD into Financial Oracle |
| `Temporal-Raaga` | 12K | `tryambakam-noesis/engines/engine-12-biofield-raga/` | Merge architecture |
| `Truth-Initiate-Database` | 24K | `tryambakam-noesis/treasure-hunt/` | Merge into PRD-04 |
| `QuantumWatchFaces` | 32K | `Products/` or Archive | Evaluate relevance |
| `Core-Framework` | 240K | `tryambakam-noesis/architecture/` | Merge frameworks |

---

### 🔴 ARCHIVE (10 projects)

Dormant since 2025, no clear OASIS alignment:

| Project | Size | Last Modified | Archive Reason |
|---------|------|---------------|----------------|
| `Consciousness-Extension` | 16K | 2025-06-18 | Absorbed into tryambakam |
| `DAKM-Philosophy` | 28K | 2025-11-26 | Merge contemplations → Resources |
| `Magic-Unschool` | 35M | 2025-06-18 | PDFs → Resources, concept absorbed |
| `RealityWraps` | 52K | 2025-06-18 | Empty structure |
| `Regeneration-Framework-Development` | 4K | 2025-06-18 | Stub only |
| `SacredGeometryTarot` | 4K | 2025-06-18 | Move to Engine-08-Tarot |
| `TheWhyChromosome-Brand` | 4.2M | 2025-06-18 | Move to Areas/Content-System |
| `Three-Body-Kingdom` | 191M | 2025-06-29 | Novel project, park in Archives |
| `TimeTurner` | 8K | 2025-06-18 | Empty structure |

---

## EXECUTION PLAN

### Phase 1: Merge (Today)

```bash
# 1. Merge PHAS-ION → Phassion
mv /Volumes/madara/2026/twc-vault/01-Projects/PHAS-ION/* \
   /Volumes/madara/2026/twc-vault/01-Projects/Phassion/legacy/

# 2. Merge Runtime-Systems → tryambakam-noesis
mv /Volumes/madara/2026/twc-vault/01-Projects/Runtime-Systems/* \
   /Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/runtime-systems/

# 3. Merge Lunar-Market-Dashboard → tryambakam-noesis
mv /Volumes/madara/2026/twc-vault/01-Projects/Lunar-Market-Dashboard/* \
   /Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/financial-oracle/

# 4. Merge Temporal-Raaga → tryambakam-noesis
mv /Volumes/madara/2026/twc-vault/01-Projects/Temporal-Raaga/* \
   /Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/engine-12-biofield-raga/

# 5. Merge Truth-Initiate-Database → tryambakam-noesis
mv /Volumes/madara/2026/twc-vault/01-Projects/Truth-Initiate-Database/* \
   /Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/treasure-hunt/

# 6. Merge Core-Framework → tryambakam-noesis
mv /Volumes/madara/2026/twc-vault/01-Projects/Core-Framework/* \
   /Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/architecture/
```

### Phase 2: Archive (Today)

```bash
# Create archived-projects folder
mkdir -p /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

# Move dormant projects
mv /Volumes/madara/2026/twc-vault/01-Projects/Consciousness-Extension \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

mv /Volumes/madara/2026/twc-vault/01-Projects/DAKM-Philosophy \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

mv /Volumes/madara/2026/twc-vault/01-Projects/RealityWraps \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

mv /Volumes/madara/2026/twc-vault/01-Projects/Regeneration-Framework-Development \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

mv /Volumes/madara/2026/twc-vault/01-Projects/SacredGeometryTarot \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

mv /Volumes/madara/2026/twc-vault/01-Projects/TimeTurner \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

mv /Volumes/madara/2026/twc-vault/01-Projects/Three-Body-Kingdom \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/
```

### Phase 3: Special Handling

```bash
# Magic-Unschool: Extract PDFs to Resources, archive rest
mkdir -p /Volumes/madara/2026/twc-vault/03-Resources/Magic-Unschool-PDFs/
mv /Volumes/madara/2026/twc-vault/01-Projects/Magic-Unschool/*.pdf \
   /Volumes/madara/2026/twc-vault/03-Resources/Magic-Unschool-PDFs/
mv /Volumes/madara/2026/twc-vault/01-Projects/Magic-Unschool \
   /Volumes/madara/2026/twc-vault/04-Archives/archived-projects-2026-01/

# TheWhyChromosome-Brand: Move to Areas/Content-System
mv /Volumes/madara/2026/twc-vault/01-Projects/TheWhyChromosome-Brand \
   /Volumes/madara/2026/twc-vault/02-Areas/TheWhyChromosome-Brand/

# QuantumWatchFaces: Merge into Products or Archive
mv /Volumes/madara/2026/twc-vault/01-Projects/QuantumWatchFaces \
   /Volumes/madara/2026/twc-vault/01-Projects/Products/QuantumWatchFaces/
```

### Phase 4: Cleanup Empty Folders

```bash
# Remove now-empty project folders after merging
rmdir /Volumes/madara/2026/twc-vault/01-Projects/PHAS-ION 2>/dev/null
rmdir /Volumes/madara/2026/twc-vault/01-Projects/Runtime-Systems 2>/dev/null
rmdir /Volumes/madara/2026/twc-vault/01-Projects/Lunar-Market-Dashboard 2>/dev/null
rmdir /Volumes/madara/2026/twc-vault/01-Projects/Temporal-Raaga 2>/dev/null
rmdir /Volumes/madara/2026/twc-vault/01-Projects/Truth-Initiate-Database 2>/dev/null
rmdir /Volumes/madara/2026/twc-vault/01-Projects/Core-Framework 2>/dev/null
```

---

## POST-CLEANUP STATE

### Projects Area (Target: 10 projects)

| Project | Purpose |
|---------|---------|
| `tryambakam-noesis` | OASIS Core (absorbed 6 projects) |
| `Phassion` | Hardware R&D + Financial Oracle |
| `Somatic-Canticles` | Book trilogy + web app |
| `Products` | Store items (absorbed QuantumWatchFaces) |
| `Eupheme-Hardware` | HRV hardware |
| `LIVINGRY-Project` | Meta-framework |
| `iOS-Wallpaper-Pack` | Store product |
| `Quantum-Numerology-Wallpapers` | Store product |

### Archived (in 04-Archives/archived-projects-2026-01/)

| Project | Reason |
|---------|--------|
| Consciousness-Extension | Absorbed into tryambakam |
| DAKM-Philosophy | Contemplations archived |
| RealityWraps | Empty |
| Regeneration-Framework-Development | Stub |
| SacredGeometryTarot | Moved to Tarot engine |
| TimeTurner | Empty |
| Three-Body-Kingdom | Novel - parked |
| Magic-Unschool | PDFs extracted |

### Moved to Areas

| Project | New Location |
|---------|--------------|
| TheWhyChromosome-Brand | 02-Areas/TheWhyChromosome-Brand/ |

---

## READY TO EXECUTE?

Say **"execute cleanup"** and I'll run these commands.

Or tell me if you want to adjust any decisions first.
