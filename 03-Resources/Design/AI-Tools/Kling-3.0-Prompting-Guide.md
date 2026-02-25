# Kling 3.0 Prompting Guide

**Source:** [FAL.ai Blog](https://blog.fal.ai/kling-3-0-prompting-guide/) via [@fal](https://x.com/fal/status/2019388645002657941)
**Date Extracted:** 2026-02-06
**Discount Code:** `falkling3` (Free generations on fal.ai)

---

## 🎬 Core Principles

### 1. Think in Shots, Not Clips
Kling 3.0 supports **native multi-shot generation** (up to 6 shots in one output). 
- **Action:** Explicitly describe each shot in a sequence.
- **Cinematic Language:** Use terms like profile shots, macro close-ups, tracking shots, POV, and shot-reverse-shot.

### 2. Anchor Subjects Early
Stronger subject consistency (especially for characters).
- **Action:** Define core subjects clearly at the beginning.
- **Stability:** Establish traits early to lock them in across camera moves and scene evolutions.

### 3. Describe Motion Explicitly
- **Action:** Be specific about camera behavior (tracking, following, freezing, panning) and subject movement.
- **Result:** Smoother pacing and fewer artifacts.

### 4. Native Audio with Dialogue Control
Supports dialogue, ambient sound, and voice tone control.
- **Structure:** `[Character A: Label, tone/voice description]: "Dialogue text"`
- **Linking:** Use words like "Immediately," or "Silence." to control rhythm.

### 5. Image-to-Video: Lock First
- **Action:** Treat the input image as an anchor. Focus prompts on how the scene evolves *from* the image.
- **Preservation:** Excels at maintaining identity, layout, and text/signage from the source.

---

## 🎭 Prompt Examples

### 1. Multi-Shot Sequence (Long Duration)
*Master Prompt:* Joker begins his iconic dance descent down the stairs, arms outstretched, pure chaotic joy.
- **Shot 1:** Man in red suit starts dancing at top of stairs, taking first exaggerated steps down, arms spreading wide, head tilting back in ecstasy, cigarette smoke trailing (Duration: 5s).
- **Shot 2:** Continuing wild dance down concrete steps, spinning and kicking, coat flapping dramatically, pure liberation and madness, reaching the bottom with triumphant pose (Duration: 5s).

### 2. Suspenseful Dialogue (Interrogation)
> A sleek modern interrogation room with cold LED lighting. Muted gray walls, blinking red security cameras. Low atmospheric suspense music. A detective in a navy suit leans forward slowly.
> 
> **[Character A: Lead Detective, controlled serious voice]:** “Let’s stop pretending.”
> 
> Immediately, the suspect shifts in their chair, tense.
> 
> **[Character B: Prime Suspect, sharp defensive voice]:** “I already told you everything.”
> 
> The detective slides a folder across the table. Paper scraping sound.
> 
> **[Lead Detective, calm but threatening tone]:** “Then explain why your fingerprints are here.”

---

## 🎧 Audio Prompting Matrix

| Principle | Guideline | Correct Example |
|-----------|-----------|-----------------|
| **P1. Structured Naming** | Unique and consistent labels. | `[Character A: Black-suited Agent]` |
| **P2. Visual Anchoring** | Action first, then dialogue. | `The agent slams the table. [Agent, angrily]: "Where is the truth?"` |
| **P3. Audio Details** | Unique tone and emotion labels. | `[Agent, raspy, deep voice]: "Don't move."` |
| **P4. Temporal Control** | Clear linking words for rhythm. | `[Agent]: "Why?" Immediately, [Assistant]: "Because."` |

---

## 💡 Notes for Tryambakam Noesis
- Kling 3.0's multi-shot capability is ideal for **Somatic Canticles** worldbuilding / narrative trailers.
- The **Subject Anchoring** principle aligns with our "Living Kernel" architecture—establish the essence (KHA/BHA/LHA) to ensure consistency across manifest actions.
- Use the **Mint Green / Russian Violet** color combo (from Nakul's set) when prompting for technical/clinical environments to maintain system-wide visual coherence.
