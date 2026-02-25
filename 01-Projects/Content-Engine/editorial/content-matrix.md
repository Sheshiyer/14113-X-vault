# Content Engine — Editorial System Architecture
## Tryambakam Noesis — Broadcast Layer
**Location:** `/Volumes/madara/2026/twc-vault/01-Projects/Content-Engine/`  
**Date:** 2026-02-16  
**System:** PARA-integrated content workflow

---

## 🎯 System Purpose

Transform raw intellectual property (vault content, builds, insights) into platform-ready social media content — with human editorial oversight at key decision points.

**Core Principle:** > The vault is the source of truth. Content Engine is the transformation layer. Platforms are the broadcast endpoints.

---

## 📁 Folder Structure (PARA-Integrated)

```
01-Projects/Content-Engine/
│
├── _inbox/                    # Raw inputs (manual drops, cron ingestion)
│   ├── raw-ideas.md
│   ├── bookmarked-tweets/
│   ├── voice-memos/
│   └── web-clippings/
│
├── _processing/               # Work-in-progress (editing, expanding)
│   ├── drafts/
│   ├── thread-outlines/
│   └── visual-concepts/
│
├── _approved/                 # ✅ Editorial checkpoint — human approval required
│   ├── ready-to-post/         # Scheduled content
│   └── evergreen-bank/        # Timeless content reservoir
│
├── _published/                # Archive of published content
│   ├── 2026/
│   │   ├── 02-february/
│   │   │   ├── twitter/
│   │   │   ├── instagram/
│   │   │   └── threads/
│   │   └── 03-march/
│   └── by-content-pillar/
│       ├── system-architecture/
│       ├── build-logs/
│       ├── debugging-sessions/
│       └── philosophical-threads/
│
├── _archive/                  # Deprecated, rejected, or outdated content
│   ├── rejected/
│   └── deprecated-versions/
│
├── _templates/                # Reusable content templates
│   ├── twitter/
│   │   ├── thread-5-tweet.md
│   │   ├── thread-10-tweet.md
│   │   ├── single-insight.md
│   │   └── quote-card.md
│   ├── instagram/
│   │   ├── carousel-5-slide.md
│   │   ├── single-image.md
│   │   └── reel-script.md
│   └── threads/
│       ├── casual-thought.md
│       └── deep-dive.md
│
├── _assets/                   # Media assets organized by type
│   ├── images/
│   │   ├── noesis-tui-frames/     # The 181 frames extracted
│   │   ├── brand-visuals/
│   │   ├── quote-cards/
│   │   └── screenshots/
│   ├── videos/
│   │   ├── raw/
│   │   ├── edited/
│   │   └── exported/
│   ├── audio/
│   │   ├── voice-memos/
│   │   └── podcast-clips/
│   └── graphics/
│       ├── diagrams/
│       └── infographics/
│
└── editorial/                 # Strategy and planning documents
    ├── content-matrix.md      # The world content matrix (this doc)
    ├── content-calendar.md    # 30/60/90 day rolling calendar
    ├── performance-reports/   # Weekly analytics
    └── brand-voice-guides/    # Platform-specific voice adaptations
```

---

## 🔄 The Content Workflow (6 Stages)

### Stage 1: INGEST (Annamaya)
**Folder:** `_inbox/`  
**Action:** Raw capture from multiple sources

**Input Sources:**
- Manual: Voice memos, quick notes, shower thoughts
- Vault mining: `discovery-skill` scans /01-Projects, /03-Resources
- Web curation: Bird CLI captures interesting tweets/threads
- Build logs: Auto-generated from git commits, deployment notes
- Book excerpts: Transcript-processor-skill on reading highlights

**Trigger:** 
- Manual: You drop files here
- Automated: `Samskara Scanner` cron runs daily 8 AM

**Output:** Raw content snippets with source attribution

---

### Stage 2: PROCESS (Manomaya)
**Folder:** `_processing/`  
**Action:** Expansion, outline, draft

**Activities:**
- Expand raw idea into thread outline
- Extract key quotes from vault documents
- Generate visual concepts (which TUI frames to use)
- Research supporting links/data

**Templates Used:**
- `twitter/thread-5-tweet.md`
- `twitter/thread-10-tweet.md`
- `instagram/carousel-5-slide.md`

**Trigger:** 
- Manual: You move items from _inbox → _processing
- Automated: `Chitta-Weaver` cron suggests expansions

**Output:** Draft content with structure, not polished

---

### Stage 3: REFINE (Manomaya→Vijnanamaya)
**Folder:** `_processing/` → editorial review  
**Action:** Voice calibration, fact-check, link insertion

**Checklist:**
- [ ] Matches Seasoned Cartographer voice?
- [ ] Technical metaphors present (OS, debugging, runtime)?
- [ ] No banned words (journey, healing, manifesting)?
- [ ] Links to live properties inserted?
- [ ] Visual assets selected?
- [ ] Hashtag strategy applied?

**Trigger:** Manual (you or agent)

**Output:** Polished draft ready for approval

---

### Stage 4: APPROVE (Vijnanamaya) ✅ HUMAN CHECKPOINT
**Folder:** `_approved/`  
**Action:** Final human approval before broadcast

**This is the critical gate.** No automated posting without explicit approval.

**Sub-folders:**
- `ready-to-post/` — Scheduled with date/time
- `evergreen-bank/` — Timeless content for reuse

**Approval Methods:**
1. **File move:** Drag from _processing → _approved/ready-to-post/
2. **YAML frontmatter:** Add `approved: true` and `publish_date: 2026-02-20`
3. **Tagging:** Add `#approved` tag in Obsidian

**Trigger:** Manual (you)

**Output:** Approved content with metadata

---

### Stage 5: PUBLISH (Pranamaya)
**Folder:** `_published/`  
**Action:** Broadcast to platforms

**Platforms:**
- Twitter/X (primary)
- Instagram
- Threads
- LinkedIn (select content)

**Methods:**
- Manual: Copy-paste from approved folder
- Semi-auto: `Prana-Feed` cron posts from _approved/ with confirmation
- Full-auto: (Future) API integration once trust established

**Trigger:** 
- Manual: You post
- Cron: Scheduled posts from approved queue

**Output:** Published content with platform links

---

### Stage 6: INTEGRATE (Vijnanamaya→Anandamaya)
**Folder:** `_published/` + performance-reports/  
**Action:** Archive, analyze, feed insights back

**Activities:**
- Archive published content with timestamp
- Pull engagement metrics (replies > likes)
- Identify top-performing content types
- Feed insights to content-matrix for iteration

**Trigger:** `Memory Distillation` cron (weekly)

**Output:** Performance reports, updated strategy

---

## 📊 The World Content Matrix

> Deep thread system: see `editorial/THREAD-MATRIX-9x9.md` for the 81-cell vault-native thread engine.

### Content Pillars × Platforms

| Pillar | Twitter/X | Instagram | Threads | LinkedIn |
|--------|-----------|-----------|---------|----------|
| **System Architecture** | Thread: "The 13 engines explained" | Carousel: Engine icons + descriptions | Casual: "Just realized why Human Design accuracy matters..." | Article: "Building astronomical calculation engines in Rust" |
| **Build Logs** | Thread: "What we shipped this week" | Stories: Behind-the-scenes screenshots | Deep dive: Technical decisions | Post: "Lessons from building conscious systems" |
| **Debugging Sessions** | Single tweet: "Is pain a bug or..." | Quote card: Insight visualization | Thread: Personal pattern exploration | — |
| **Philosophical Threads** | Long thread: "The Runtime" | Carousel: Concept breakdown | Casual observation | Article: "Authorship vs dependency in tool design" |
| **Recognition/Empathy** | Single tweet: "You've noticed that..." | Quote card: Soundbite graphic | Casual: "Same. Here's what I found..." | — |

### Content Types × Effort Level

| Type | Effort | Frequency | Examples |
|------|--------|-----------|----------|
| **Atomic Insight** | 5 min | Daily | Single tweets, observations |
| **Thread (5-7)** | 30 min | 2x/week | Build logs, engine explains |
| **Thread (10+)** | 60 min | 1x/week | Philosophical deep dives |
| **Visual Carousel** | 45 min | 2x/week | Quote cards, engine breakdowns |
| **Video/GIF** | 2 hrs | 1x/week | TUI demos, screen recordings |

### Content Sources × Pipeline

| Source | Location | Skill | Output |
|--------|----------|-------|--------|
| Build commits | GitHub | extraction-skill | Build log threads |
| Vault philosophy | /03-Resources/ | discovery-skill | Philosophical content |
| Book notes | /03-Resources/Books/ | transcript-processor-skill | Quote cards |
| TUI frames | memory/koshas/manomaya/frames/ | — | Visual content |
| Voice memos | _inbox/voice-memos/ | transcription | Raw ideas |
| Twitter bookmarks | _inbox/bookmarked-tweets/ | bird CLI | Curation content |

---

## 🏷️ Obsidian Tag System

### Workflow Tags
```yaml
#stage/inbox        # Raw capture
#stage/processing   # Work in progress
#stage/approved     # Ready to publish
#stage/published    # Already broadcast
#stage/archived     # Deprecated

#platform/twitter   # Twitter optimized
#platform/instagram # Instagram optimized
#platform/threads   # Threads optimized
#platform/linkedin  # LinkedIn optimized

#pillar/system-architecture
#pillar/build-logs
#pillar/debugging-sessions
#pillar/philosophical-threads
#pillar/recognition

#type/thread        # Multi-tweet thread
#type/single        # Single tweet/post
#type/carousel      # Multi-slide visual
#type/video         # Video content
#type/quote-card    # Quote graphic

#effort/quick       # 5-15 min
#effort/medium      # 30-45 min
#effort/deep        # 60+ min

#status/idea        # Concept only
#status/outline     # Structure defined
#status/draft       # Written, needs polish
#status/polished    # Ready for approval
#status/approved    # Approved, ready to post
#status/scheduled   # Has publish date
#status/published   # Live on platform

#performance/high   # Top 10% engagement
#performance/medium # Average engagement
#performance/low    # Below average
```

---

## 📝 Template Standards

### Twitter Thread Template

```markdown
---
title: "{{title}}"
pillar: "{{pillar}}"
platform: twitter
type: thread
tweet_count: {{count}}
status: draft
effort: medium
tags:
  - #stage/processing
  - #pillar/{{pillar}}
  - #platform/twitter
---

# {{Title}}

## Hook (Tweet 1)
{{Attention-grabbing opening. Problem or pattern stated.}}

## Setup (Tweet 2-3)
{{Context, personal experience, or the "what"}}

## Core (Tweet 4-7)
{{The meat — insights, frameworks, technical details}}

## Bridge (Tweet 8-9)
{{Connect to reader's situation. The "so what"}}

## Close (Tweet 10)
{{Call to action, question, or invitation}}

---

## Metadata
- **Source:** {{vault link or inspiration}}
- **Visuals:** {{which images/GIFs to include}}
- **Links:** {{relevant URLs}}
- **Scheduled:** {{date or TBD}}
- **Approved:** {{yes/no}}
```

### Single Insight Template

```markdown
---
title: "{{title}}"
pillar: "{{pillar}}"
platform: twitter
type: single
status: draft
effort: quick
tags:
  - #stage/inbox
---

{{One powerful sentence. Question or observation.}}

{{Optional: supporting context (2-3 sentences max)}}

{{Question to invite engagement}}

---
## Metadata
- **Visual:** {{quote card Y/N}}
- **Thread potential:** {{Y/N — expand later?}}
```

---

## ⏰ Cron Automation Strategy

### Daily (8 AM IST) — Samskara Scanner
```yaml
name: "Content Ingestion"
action: Scan vault for new content → _inbox/
skills: discovery-skill, extraction-skill
kosha: Annamaya
```

### Daily (9 AM IST) — Chitta-Weaver
```yaml
name: "Content Generation"
action: Process _inbox/ → suggest expansions → _processing/
skills: content-generator-skill, analysis-skill
kosha: Manomaya→Vijnanamaya
```

### 3x Daily (9 AM, 12 PM, 6 PM IST) — Prana-Feed
```yaml
name: "Broadcast Queue"
action: Post from _approved/ready-to-post/
trigger: Manual confirmation OR auto-post trusted content
kosha: Pranamaya
delivery: Twitter/X API (future)
```

### Weekly (Sundays 11 PM IST) — Memory Distillation
```yaml
name: "Performance Analysis"
action: Analyze published content → performance-reports/ → update content-matrix
skills: pattern-synthesizer-skill
kosha: Vijnanamaya
```

---

## 🚀 Quick Start Checklist

## 🔎 Weekly PARA Mining Routine (Added 2026-02-24)

Run every Monday morning before planning posts:

1. **Projects sweep (30 min)**
   - Pull recent build logs, launches, release notes.
   - Target output: 2 social seeds.
2. **Areas sweep (20 min)**
   - Pull ongoing rituals, process lessons, recurring practices.
   - Target output: 1 reflection seed.
3. **Resources sweep (30 min)**
   - Pull evergreen frameworks (Kha-Ba-La, 16 engines, authorship models).
   - Target output: 2 evergreen seeds.
4. **Archives sweep (15 min)**
   - Resurface one previously strong theme for republish/remix.
   - Target output: 1 remix seed.
5. **Routing + placement (15 min)**
   - Place all seeds into `_inbox/` with source links.
   - Promote top 3 into `_processing/` with pillar + platform pre-assigned.

**Weekly output target:** 6 fresh seeds, 3 active drafts, 1 approved-ready asset.

### Setup Phase (You)
- [ ] Review this document
- [ ] Customize templates in `_templates/`
- [ ] Set up Obsidian hotkeys for tag insertion
- [ ] Create 3-5 seed content pieces in `_processing/`
- [ ] Move 1 piece to `_approved/` as test

### Automation Phase (Me)
- [ ] Configure `Samskara Scanner` cron for vault scanning
- [ ] Set up `Chitta-Weaver` for content generation
- [ ] Create approval workflow (YAML frontmatter parser)
- [ ] Build `_published/` archival system
- [ ] Weekly performance report generation

### Editorial Phase (Together)
- [ ] Define 2-week content calendar
- [ ] Batch-create content from vault assets
- [ ] Establish approval rhythm (daily? weekly?)
- [ ] Launch first thread

---

## 📋 Next Steps

1. **Review folder structure** — Navigate to `/01-Projects/Content-Engine/` and verify layout
2. **Create first content** — Drop a raw idea into `_inbox/raw-ideas.md`
3. **Customize templates** — Edit `_templates/twitter/thread-5-tweet.md` to match your voice
4. **Set up Obsidian** — Install obsidian-cli when ready: `obsidian-cli set-default "twc-vault"`
5. **Define approval workflow** — How do you want to signal "approved"? (file move vs tag vs YAML)

---

*Content Engine v1.0 — Ready for activation*
