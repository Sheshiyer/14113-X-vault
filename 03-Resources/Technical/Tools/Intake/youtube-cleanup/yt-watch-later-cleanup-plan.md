# 🎬 YouTube Watch Later Cleanup Plan

**Source**: `yt watch later cleanup - Sheet1.csv`  
**Total Videos**: 736 entries  
**Pipeline**: Adapted from 6-stage vault intake skills  
**Created**: 2026-01-26

---

## Overview

Your Watch Later has accumulated 700+ videos across wildly diverse topics. This 2-step plan uses your vault's proven Enneagram+PARA classification system to:

1. **Step 1**: Triage (Keep/Delete/Archive) — Fast pass to eliminate noise
2. **Step 2**: Categorize & Route — Classify keepers using analysis-skill vocabulary

---

## 📊 Initial Analysis

From scanning the CSV, your Watch Later contains roughly:

| Category (Estimated) | % | Examples |
|---------------------|---|----------|
| **Music/DJ Sets/Albums** | ~25% | Four Tet, Autechre, DJ mixes, vaporwave, ambient |
| **AI/Coding/Tech** | ~25% | Claude Code, n8n, DeepSeek, Cursor, MCP |
| **Esoteric/Consciousness** | ~15% | DMT, Jack Kruse, Montalk, Nakshatra, Kabbalah |
| **Learning/Education** | ~10% | Stanford lectures, economics, game theory |
| **Tutorials/How-To** | ~10% | Obsidian, Figma, app building, content creation |
| **Entertainment** | ~10% | Anime, documentaries, misc |
| **Dead/Private** | ~1% | [Private video], [Deleted video] |

**Pattern Match**: Type 5 (Investigator) dominant — matches your vault archetype (75.5% Type 5).

---

## 🔄 Step 1: Triage (Keep/Delete/Archive)

> **Goal**: Reduce 736 → ~200-300 high-value videos  
> **Time**: 30-60 minutes  
> **Method**: Quick pass with simple rules

### Triage Rules

| Decision | Criteria | Action |
|----------|----------|--------|
| **DELETE** 🗑️ | Private/Deleted videos | Remove immediately |
| **DELETE** 🗑️ | Already watched (you know you have) | Remove |
| **DELETE** 🗑️ | Outdated tutorials (2023 AI tools) | Remove |
| **DELETE** 🗑️ | "Saved for later" impulse saves | If no excitement on title, remove |
| **DELETE** 🗑️ | Duplicates (same artist/topic) | Keep best one |
| **ARCHIVE** 📦 | Music to listen eventually | Move to "Music Queue" playlist |
| **ARCHIVE** 📦 | Reference tutorials | Move to "Reference" playlist |
| **KEEP** ✅ | Genuinely want to watch | Keep for Step 2 |

### Quick Triage Categories

**Instant Delete Patterns**:
- `[Private video]` (5 videos)
- `[Deleted video]` (1 video)
- Tutorials for tools you no longer use
- "Top 10" listicles unless genuinely interested

**Move to Music Queue** (don't clutter Watch Later):
- DJ sets, live performances
- Full albums
- Ambient/study music mixes
- ~50-75 videos → separate playlist

**Move to Reference Archive**:
- Old tutorials you might need someday
- Course lectures you haven't started
- ~20-30 videos → separate playlist

### Triage Script (Manual)

I'll generate a triage CSV you can use:

```
URL,Title,Triage Decision,Notes
...
```

After you make decisions, we filter to KEEP items for Step 2.

---

## 🎯 Step 2: Categorize & Route

> **Goal**: Classify remaining ~200-300 videos using Enneagram+PARA  
> **Time**: 1-2 hours (or batch over days)  
> **Method**: analysis-skill adapted for video content

### Classification Framework

Using your vault's controlled-vocabulary.yaml with video-specific adaptations:

#### Enneagram Types → Watch Modes

| Type | Muse | Content Pattern | Watch Mode |
|------|------|-----------------|------------|
| **Type 5** | Melpomene | Research, lectures, deep dives | 📚 Active Study |
| **Type 3** | Euterpe | Health, optimization, biohacking | 💪 Applied Learning |
| **Type 8** | Terpsichore | Systems, power analysis, critical | 🎯 Critical Viewing |
| **Type 1** | Polymnia | Sacred geometry, precision topics | 🔬 Detailed Study |
| **Type 4** | Thalia | Occult, mysticism, unique paths | 🔮 Contemplative |
| **Type 7** | Calliope | Hidden history, exploration | 🗺️ Discovery |
| **Type 9** | Urania | Consciousness, meditation | 🧘 Contemplative |
| **Type 7** (alt) | — | Entertainment, fun | 🎮 Leisure |

#### PARA Buckets → Playlists

| PARA | % | Video Type | Destination Playlist |
|------|---|------------|---------------------|
| **Resources** | 70% | Reference, background info | "Reference Library" |
| **Areas** | 20% | Skills you're actively building | "Active Learning" |
| **Projects** | 5% | Directly supports current projects | "Project: [Name]" |
| **Archives** | 5% | Finished topics, historical | "Archives" |

#### Domain Categories (Top 15 for Videos)

From your vocabulary, adapted for YouTube:

1. **AI-Coding** — Claude, n8n, Cursor, DeepSeek, MCP tutorials
2. **Music-Discovery** — Full albums, live sets, DJ mixes
3. **Music-Production** — Sound design, synthesis, tutorials
4. **Esoteric-Knowledge** — DMT, consciousness, occult topics
5. **Health-Biohacking** — Jack Kruse, quantum biology, optimization
6. **Science-Research** — Physics, biology, lectures
7. **Philosophy-Consciousness** — Consciousness studies, philosophy
8. **Alternative-History** — Hidden history, mysteries
9. **Tech-Tutorials** — Obsidian, Figma, development tools
10. **Business-Marketing** — Content strategy, SEO, monetization
11. **Astrology-Nakshatra** — Vedic astrology, nakshatras
12. **Entertainment-Anime** — Anime, series, movies
13. **Math-Science** — Mathematics, physics concepts
14. **Personal-Development** — Life optimization, productivity
15. **General-Interest** — Catch-all for misc

### Output Format

After classification, each video gets:

```yaml
- url: https://youtube.com/watch?v=XXX
  title: "Video Title"
  enneagram: Type 5 (Investigator)
  para: Resources
  domain: AI-Coding
  playlist: "Reference Library"
  priority: Medium
  duration_est: 30min
  watch_mode: Active Study
```

### Destination Playlists to Create

1. **🎵 Music Queue** — DJ sets, albums, ambient
2. **📚 Reference Library** — Tutorials, lectures to revisit
3. **🎓 Active Learning** — Skills currently building (AI, coding)
4. **🔮 Contemplative** — Esoteric, consciousness, philosophy
5. **💪 Health & Bio** — Biohacking, Jack Kruse, health
6. **🗺️ Discovery** — Hidden history, alternative science
7. **🎮 Leisure** — Entertainment, anime, fun stuff
8. **📁 Project: [Name]** — Specific project support

---

## 🛠️ Execution Plan

### Phase 1: Generate Triage Sheet (Now)

I'll create a CSV with all 736 videos + suggested triage decisions based on title analysis:

```
triage-decisions.csv
├── URL
├── Title  
├── Suggested_Action (DELETE/ARCHIVE/KEEP)
├── Category_Hint
├── Notes
```

### Phase 2: You Review & Decide (30-60 min)

1. Open `triage-decisions.csv` in spreadsheet
2. Quick scan, adjust Suggested_Action column
3. Filter to KEEP items
4. Export as `keep-list.csv`

### Phase 3: Classification (Batch or Interactive)

**Option A: Batch Classification**
- I run analysis-skill logic on keep-list
- Generate full classifications
- You review and adjust

**Option B: Interactive Sessions**
- We go through 20-30 videos at a time
- You confirm/override classifications
- Build playlists incrementally

### Phase 4: Playlist Creation

- Create destination playlists on YouTube
- Move videos using YouTube's playlist tools
- Clear Watch Later

---

## 🎬 Ready to Start?

**Next Action**: I'll generate the triage-decisions.csv with initial suggestions.

Questions before we begin:
1. Do the 8 playlist categories look right, or want to adjust?
2. Prefer batch classification or interactive sessions?
3. Any specific topics you KNOW you want to delete? (e.g., "all 2023 AI tutorials")

---

## Appendix: Category Signals

### AI-Coding Keywords
`Claude`, `n8n`, `DeepSeek`, `Cursor`, `MCP`, `agent`, `workflow`, `coding`, `API`, `Windsurf`, `Cline`

### Music Keywords
`DJ`, `mix`, `album`, `live`, `set`, `ambient`, `techno`, `HÖR`, `Boiler Room`, `vaporwave`, `downtempo`

### Esoteric Keywords
`DMT`, `consciousness`, `pineal`, `third eye`, `occult`, `Kabbalah`, `tantric`, `siddhis`, `esoteric`

### Health Keywords
`Jack Kruse`, `biohacking`, `quantum biology`, `health`, `bioenergetics`, `mitochondria`

### Astrology Keywords
`Nakshatra`, `astrology`, `Rahu`, `Ketu`, `Vedic`

---

*Plan generated using vault skills framework from `/Volumes/madara/2026/twc-vault/_System/skills/`*
