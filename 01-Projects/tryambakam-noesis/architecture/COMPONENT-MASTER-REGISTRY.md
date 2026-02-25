# COMPONENT-MASTER-REGISTRY: The Antahkarana Interface [v1.0]
## Minute Detail Component Specification (60+ Items)

**Status:** INSCRIBED  
**Theme:** RTS Command & Control (Warcraft-Inspired) × Biofield Transparency  
**Architecture:** Pancha Kosha Layered Density

---

## 🏛️ Layer 1: Annamaya Substrate (The Scaffolding)
*Focus: Solid, structural, opaque, "Heavy" material feel.*

### 1.1 Structural Frames
1.  **`<BaseTerminal />`:** The root window. Dark-wood texture with a high-contrast inner viewport and **CoolShapes** subtle grainy gradient background.
2.  **`<PrimarySidebar />`:** A vertical navigation rail. Solid stone texture, gold-bezel icons.
3.  **`<ActiveProjectRail />`:** A sub-sidebar that slides out showing the currently active PARA project context.
4.  **`<VaultStatusFooter />`:** A persistent thin bar at the bottom showing local disk health and `/Volumes/madara/` mount status.
5.  **`<DraggableWindow />`:** A modal container that uses "heavy" drag physics (high damping).

### 1.2 Input & Command
6.  **`<RTSInput />`:** Text field with a gold-etched frame and `mono` typeface.
7.  **`<HeavyButton />`:** Button with 3D-effect background (.webp) and a tactile "click" sound/animation.
8.  **`<KbdShortcuts />`:** Minimalist kbd tokens for tool shortcuts (e.g., `Cmd+K` for Chitta).
9.  **`<FileSystemBreadcrumbs />`:** Path indicator showing the exact Annamaya location (e.g., `projects > webclaw`).
10. **`<DragDropZone />`:** An area with dashed "wood-burn" borders for importing new PARA resources.

---

## 🌊 Layer 2: Pranamaya Telemetry (The Vital Current)
*Focus: Animated, glowing, flowing, "Living" bio-feedback.*

### 2.1 The Prana-Feed (Finn Evolution)
11. **`<PranaStream />`:** The main vertical container for all activity pulses.
12. **`<ReadPulseCard />`:** Eye-icon card (Blue). Pulsates when `fs.read` is active.
13. **`<WritePulseCard />`:** Pen-icon card (Gold). Glows steadily during artifact generation.
14. **`<ExecPulseCard />`:** Lightning-icon card (Red). High-intensity flicker during shell execution.
15. **`<ThinkPulseCard />`:** Brain-icon card (Purple). Soft breathing glow for "Reasoning" blocks.
16. **`<SubAgentFork />`:** A visual branching line that splits the feed for parallel agents.
17. **`<VitalityConnector />`:** Animated SVG lines connecting the Feed to the Khalorēē Meter.

### 2.2 Gauges & Flows
18. **`<KhaloreeGauge />`:** Circular HSL meter. Needle moves with token/sec velocity.
19. **`<TokenBurnCounter />`:** A small, fast-incrementing digital readout of session costs.
20. **`<GunaIndicator />`:** A color-coded status light (Sattva/Rajas/Tamas).
21. **`<BiofieldPulse />`:** A subtle wave animation synced with heart-rate/HRV data.
22. **`<ActiveToolIndicator />`:** A mini-icon showing the tool currently in the "Manas" buffer.

---

## 🧠 Layer 3: Manomaya Retrieval (The Chitta Memory)
*Focus: Symbolic, semantically rich, informative, "Mental" constructs.*

### 3.1 Chitta Search & Context
23. **`<ChittaCommandBar />`:** Global floating search bar (Cmd+K).
24. **`<SearchSuggestion />`:** Result items with "Tatva Tags" (e.g., `Rupa`, `Tejas`).
25. **`<SamskaraCard />`:** A snippet from `MEMORY.md` surfaced as an "impression."
26. **`<FlashbackCard />`:** A proactive "Never Forget" alert that slides into view.
27. **`<ContextAnchor />`:** A visual summary of the `CONTEXT.md` file for the active project.
28. **`<ProjectGoalWidget />`:** A progress bar showing "Artha" alignment.

### 3.2 Documentation & Lore
29. **`<ManifestoRenderer />`:** A specialized MD renderer for high-density philosophical text (Cinzel headers).
30. **`<GlossaryTooltip />`:** Hover-state descriptions for Vedic terms (e.g., "Kha").
31. **`<EngineLoreCard />`:** A detailed card explaining one of the 13 Engines.
32. **`<NadiFascialMap />`:** A schematic diagram showing the bioimpedance pathways.

---

## 👁️ Layer 4: Vijnanamaya Geometry (The Architect’s View)
*Focus: 3D, abstract, structural logic, "Wisdom" mapping.*

### 4.1 The Moolaprakriti Cube
33. **`<CubeCanvas />`:** The Three.js wrapper for the 3D environment.
34. **`<EngineNode />`:** A glowing orb or a specific **CoolShape** (e.g., `Star`, `Circle`) representing a Tryambakam Engine.
35. **`<ConnectionLatice />`:** Floating lines between Engines showing inter-dependencies.
36. **`<PerspectiveToggle />`:** Buttons to switch between "Personal", "Clinical", and "Research" faces.
37. **`<EngineInfoHUD />`:** Floating text labels that appear when a Node is hovered.

### 4.2 Logic & Discernment
38. **`<DiscernmentMeter />`:** A horizontal bar evaluating task alignment (Dharma).
39. **`<VikaraAlertOverlay />`:** A full-screen aesthetic shift (glitch effect) when drift is detected.
40. **`<ANDGateLogicSwitch />`:** A toggle for operating in "Simultaneous" mode (Personal AND Clinical AND Research).

---

## 🕯️ Layer 5: Anandamaya Rituals (The Clifford Clock)
*Focus: Ethereal, timing-focused, light-dominant, "Blissful" alignment.*

### 5.1 Rhythms & Timing
41. **`<CliffordClockBezel />`:** Rotating outer rim tracking the 8-hour consciousness octave.
42. **`<AscentIndicator />`:** Glow effect for the 04:00 - 12:00 "Creation" window.
43. **`<DissolutionIndicator />`:** Muted/Shadow effect for the 20:00 - 04:00 "Rest" window.
44. **`<MoonPhaseSync />`:** A top-right icon showing the current lunar state (Selemene sync).
45. **`<RitualNode />`:** A specialized icon on the timeline for cron jobs.

### 5.2 Atmospheric Effects
46. **`<SattvicOverlay />`:** A glassmorphism filter applied during Full Moon phases.
47. **`<RajasicGlow />`:** An energetic particles effect around the active cursor.
48. **`<TamasicFog />`:** A soft vignette that appears during the mandatory evening reset.

---

## 🚨 Layer 6: Systemic Utilities (The Manas Global UI)
*Focus: Notifications, alerts, messaging, and "Limb" feedback.*

### 6.1 Notifications & Toasts
49. **`<SattvaToast />`:** Success notification (Mint border, soft chime).
50. **`<RajasToast />`:** Action in progress notification (Amber pulse).
51. **`<VikaraToast />`:** Critical error notification (Crimson jitter effect).
52. **`<SubAgentPing />`:** A small, floating notification when a sub-agent completes a task.

### 6.2 Modals & Dialogs
53. **`<DecisionModal />`:** A Warcraft-style "Quest Accept/Decline" frame for external actions.
54. **`<AuthDialog />`:** A minimalist glassmorphism popup for gateway login.
55. **`<SystemAuditModal />`:** A high-density data table showing session statistics.

### 6.3 Messaging Windows
56. **`<PranaChatWindow />`:** The primary interface for current dialogue (Finn style).
57. **`<ThoughtBlock />`:** An expandable section for the agent's internal `<think>` process.
58. **`<ToolCallPreview />`:** A compact, interactive preview of tool arguments (e.g., `write` path).
59. **`<AttachmentTray />`:** A horizontal scroll area for images/PDFs/Videos.
60. **`<TypingIndicator />`:** An animated "Pulse" showing the agent is currently "Inhaling" (processing) or "Exhaling" (generating).

---

## 🎨 Global Aesthetics Summary
- **Typography:** **Cinzel** (Fantasy/Headers) + **Rubik** (Technical/Subheaders) + **Inter** (Data/Body) + **Geist Mono** (Code).
- **Physics:** `framer-motion` spring dynamics (`stiffness: 100`) for all "Annamaya" interactions.
- **Surface:** Mix of **Wood/Stone textures** (Annamaya) and **Glassmorphism** (Anandamaya).

---
*Created via OpenClaw on 2026-02-07*
