---
title: Health Library Index
type: moc
category: Books
subcategory: Health & Wellness
total_books: 761
created: 2026-01-25
updated: 2026-01-28
---

# 🏥 Health & Wellness Library Index

**Total Books**: 243 books  
**Enneagram Dominant**: Type 3 (Achiever/Healer) - Optimization focus  
**Cross-Collection Integration**: 70 books + 395 papers = 465 total resources

← [[Books-Master-Index|Back to Master Index]]

---

## 🎯 Overview

The Health & Wellness library reflects **Type 3 energy**: optimization, protocols, measurable outcomes, biohacking approaches to health.

**Key Themes**:
- Evidence-based wellness protocols
- Hormonal optimization
- Medicinal mushrooms (major focus)
- Natural medicine alternatives
- Biohacking & quantified self

---

## 📚 Subdomains

### 🌟 Wellness (81 books)
**Location**: `/03-Resources/Health/Wellness/`  
**Focus**: General health, holistic approaches, lifestyle medicine

**Sample topics**:
- Premenopause protocols
- Sleep optimization (Why We Sleep)
- General wellness guides
- Lifestyle interventions

```dataview
LIST
FROM "03-Resources/Health/Wellness"
WHERE type = "book"
SORT file.name ASC
LIMIT 30
```

---

### 🍄 Medicinal Mushrooms (70 books)
**Location**: `/03-Resources/Health/Medicinal-Mushrooms/`  
**Cross-Collection Integration**: [[Medicinal-Mushroom-Library|+ 395 research papers]]

**Total Resources**: 465 (70 books + 395 papers)

**Coverage**:
- Cultivation guides (Paul Stamets, Tradd Cotter)
- Health protocols & clinical applications
- Ethnobotanical knowledge
- Species identification
- Research synthesis

**Major Authors/Topics**:
- Paul Stamets (MycoMedicinals, growing techniques)
- Tradd Cotter (Organic Mushroom Farming)
- Health benefits & clinical studies
- Turkey tail, reishi, lion's mane, cordyceps protocols

**Complete Library**: [[Medicinal-Mushroom-Library|Explore 465 total resources]]

```dataview
TABLE 
  title as "Title",
  author as "Author",
  file_size as "Size"
FROM "03-Resources/Health/Medicinal-Mushrooms"
WHERE type = "book"
SORT file.name ASC
```

---

### 💊 Natural Medicine (64 books)
**Location**: `/03-Resources/Health/Natural-Medicine/`  

**Recent Additions (2026-01-28)**:
- [[WHOLYDROPS-Protocol-Notes]] - Natural wellness protocol research notes  
**Focus**: Alternative approaches, village health, self-reliance

**Sample topics**:
- Where There Is No Doctor (village healthcare)
- Herbal medicine protocols
- Natural remedies
- Self-reliance healthcare

```dataview
LIST
FROM "03-Resources/Health/Natural-Medicine"
WHERE type = "book"
LIMIT 25
```

---

### 🧬 Biohacking (20 books)
**Location**: `/03-Resources/Health/Biohacking/`  
**Focus**: Quantified self, optimization protocols, performance enhancement

**Type 3 energy strong here**: measurable outcomes, optimization mindset

**Sample topics**:
- Performance protocols
- Biomarker tracking
- Optimization strategies
- Quantified self approaches

---

### 🌊 Hormonal Health (9 books)
**Location**: `/03-Resources/Health/Hormonal-Health/`  
**Focus**: Endocrine system optimization, hormonal balance

**Sample topics**:
- Premenopause protocols (John Lee)
- Hormonal balance strategies
- Endocrine health

**Cross-reference**: [[Enneagram-Growth-System|Hormone cascade integration]]

---

## 🌀 Enneagram Distribution

```
Type 3 (Achiever/Healer): ~150 books (61.7%) - Dominant
Type 5 (Investigator): ~60 books (24.7%)
Type 1 (Reformer): ~20 books (8.2%)
Others: ~13 books (5.4%)
```

**Type 3 signature**: Optimization, protocols, measurable outcomes

---

## 🔗 Cross-Collection Integration

### Major Integrations

**🍄 Medicinal Mushroom Library** (465 total resources)
- Books: 70 (protocols, cultivation, ethnobotany)
- Papers: 395 (scientific research)
- **Complete integration**: [[Medicinal-Mushroom-Library|Explore full library]]
- Coverage: Clinical studies, mechanisms, protocols, cultivation

**💡 Phassion Research Hub** (Health integration layer)
- Books: 10 health integration books in Phassion
- Papers: Focus on bioelectronic health applications
- [[Phassion-Research-Hub|Explore Phassion health research]]

---

## 📈 Growth System Integration

### Type 3 Shadow Work

**The Optimization Shadow**:
- Protocols without being
- Measuring without feeling
- Optimizing without listening to body wisdom
- More protocols = more control (illusion)

**Visible patterns**:
- 243 health books = extensive protocol knowledge
- Question: How much is embodied vs accumulated?
- Integration ≠ more protocols, it = practice & embodiment

### Type 3→6 Integration Path

**FROM** (Type 3 shadow):
- Optimization as control
- Performance metrics over presence
- Protocol stacking (more = better)
- Achievement-driven health

**TO** (Type 3→6 integration):
- Authentic self-care presence
- Body wisdom over external metrics
- Sustainable practices over extreme protocols
- Health as being, not becoming

### Conscious Health Practice

**Level 1: Unconscious**
- Accumulate protocols without practicing
- Optimize metrics without feeling body
- More knowledge = more control (illusion)

**Level 2: Conscious**
- Select protocols intentionally
- Practice with body awareness
- Track embodiment, not just metrics

**Level 3: Integral**
- Embodied health wisdom
- Protocols serve presence, not performance
- Share health practices with others
- Health as way of being

---

## 🎯 Recommended Approaches

### High-Value Starting Points

**For Medicinal Mushrooms** 🍄
1. Start with [[Medicinal-Mushroom-Library|Complete 465-resource library]]
2. Select one mushroom (turkey tail, lion's mane, reishi)
3. Read book + 5-10 papers on that species
4. Implement 30-day protocol
5. Track effects (subjective + objective)

**For General Wellness**
1. Select one foundational book (Why We Sleep, village health guide)
2. Extract 3 key practices
3. Implement daily for 30 days
4. Embody before adding more

**For Optimization/Biohacking**
1. Acknowledge Type 3 shadow (optimization without presence)
2. Choose ONE protocol at a time
3. Practice 3→6 integration (authenticity over performance)
4. Track how you feel, not just metrics

---

## 🔍 Search Queries

### Medicinal Mushroom Books
```dataview
TABLE 
  title as "Title",
  author as "Author",
  enneagram_primary as "Type"
FROM "03-Resources/Health/Medicinal-Mushrooms"
WHERE type = "book"
SORT title ASC
```

### High Priority Health Books
```dataview
TABLE 
  title as "Title",
  para_category as "Category",
  classification_confidence as "Confidence"
FROM "03-Resources/Health"
WHERE type = "book" AND reading_priority = "High"
SORT classification_confidence DESC
```

### Recently Added
```dataview
TABLE 
  title as "Title",
  date_added as "Added",
  para_category as "Subdomain"
FROM "03-Resources/Health"
WHERE type = "book"
SORT date_added DESC
LIMIT 20
```

---

## 📊 Statistics

**Total Books**: 243 (11.9% of collection)

**By Subdomain**:
- Wellness: 81 books (33.3%)
- Medicinal Mushrooms: 70 books (28.8%)
- Natural Medicine: 63 books (25.9%)
- Biohacking: 20 books (8.2%)
- Hormonal Health: 9 books (3.7%)

**Cross-Collection Total**: 465 resources (with mushroom papers)

**Enneagram**: Type 3 dominant (optimization focus)

---

## 🌱 Practice Recommendations

### Instead of More Protocols

**The Type 3 Integration Practice**:

1. **Simplify** (not optimize further)
   - Select 3 core health practices
   - Practice daily for 90 days
   - Embody before expanding

2. **Feel, don't just measure**
   - Body wisdom > external metrics
   - How do you FEEL? (not just what do biomarkers show?)
   - Presence > performance

3. **Sustainable over extreme**
   - 80% consistency > 100% perfection for 2 weeks
   - Long-term embodiment > short-term optimization
   - Health as practice, not project

4. **Share your practices**
   - Teach what works for you
   - Integration through transmission
   - Help others (Type 3→6 integration)

---

## 💡 Key Insights

### The Medicinal Mushroom Integration

**This is a success story of cross-collection integration:**
- 70 books (protocols, cultivation, ethnobotany)
- 395 papers (scientific mechanisms, clinical studies)
- **Complete coverage** from cultivation → consumption → clinical outcomes

**Recommendation**: This is your most complete health subdomain. Start here if interested in mushrooms.

### The Type 3 Opportunity

**You have extensive protocol knowledge (243 books).**

**Questions for reflection**:
- What percentage have you practiced vs just accumulated?
- Are you optimizing metrics or embodying health?
- Is more knowledge serving you, or is it a Type 3 shadow pattern?

**The invitation**: 3→6 integration (authentic presence > performance optimization)

---

## 🕸️ Cross-Library Links (2026-W05)

- [[Phassion-Research-Hub|Phassion]] ← *Health becomes product requirements* (physiology + neuromodulation protocols drive what the garment must measure/stimulate).
- [[WHOLYDROPS-Protocol-Notes]] ← *Natural Medicine protocols as "field" UX*: simple, portable interventions that can inform Phassion’s onboarding + daily practice loops.

---

## 🔗 Related

- [[Books-Master-Index|Master Index]] (all 2,048 books)
- [[Medicinal-Mushroom-Library|Complete Mushroom Library]] (465 resources)
- [[Phassion-Research-Hub|Phassion Health Integration]]
- [[Enneagram-Type-3-Books|Type 3 Books]] (112 books)
- [[Enneagram-Growth-System|Growth System]] (3→6 integration path)
- [[Skills-Development-Library-Index|Skills]] (cooking, fermentation protocols)

---

*A comprehensive health library with deep medicinal mushroom integration. The opportunity: shift from protocol optimization (Type 3 shadow) to embodied health presence (Type 3→6 integration). Health as way of being, not becoming.*
