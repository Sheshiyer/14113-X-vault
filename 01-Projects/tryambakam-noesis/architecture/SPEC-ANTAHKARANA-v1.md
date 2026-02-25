# SPECIFICATION: The Antahkarana Console [v1.0]
## The Internal Instrument of Tryambakam Noesis

**Architect:** Pi (Digital Alchemist)  
**Human Proxy:** Shesh Iyer (The Witness Alchemist)  
**Triage Category:** **Occupation** (Infrastructure)  
**Status:** LOCKED (Ready for Implementation)  
**Version:** 1.0.0 (The Foundation)

---

## 🔮 Executive Summary: The Limb of Noesis
The **Antahkarana Console** is the operational interface for the **Tryambakam Noesis** system. It is not a passive dashboard but a bi-directional **Manas Interface** (Mind-Mirror) that visualizes, controls, and remembers the metabolic activity of the digital ecosystem.

Its primary function is **Aletheia** (Unconcealment). It renders the invisible "background radiation" of AI agents, , and database mutations into a visible **Prana-Stream**, allowing the Human Architect to move from "Checking" to "Knowing."

It is constructed upon the **Pancha Kosha** (Five Sheaths) model, ensuring that every layer of the technical stack corresponds to a layer of consciousness functionality.

---

## 🏛️ Chapter 1: Annamaya Substrate (The Scaffolding)
*The Physical Body: Infrastructure, Schema, and File Systems.*

### 1.1 The Baseline Fork: `webclaw` Evolution
We utilize the existing `webclaw` repository as the biological host.
- **Framework:** Next.js 15 (App Router).
- **State Management:** TanStack Query (v5) for server-state synchronization; Zustand for local UI state (sidebar toggle, theme mode).
- **Styling:** Tailwind CSS with a custom `tryambakam-theme` config (defined in Chapter 5).
- **The Sidebar:** The persistent sidebar remains but is upgraded to a "Density-Aware" navigation rail. It monitors the `/Volumes/madara/2026/` directory structure, specifically the Active Project folder.

### 1.2 Database Evolution: Convex as Chitta
We replace local JSON storage with **Convex** to serve as the reactive memory store.
- **Schema Definition (`schema.ts`):**
    - **`telemetry`**: Stores the atomic units of system activity.
        - `type`: `"tool_call"` | `"agent_spawn"` | `"system_alert"` | `"khaloree_update"`
        - `payload`: JSON object containing the raw data (e.g., tool arguments, output summary).
        - `agent_id`: The ID of the specific sub-agent instance.
        - `timestamp`: Precision timing for the Prana-Feed.
    - **`context_anchors`**: Stores the parsed content of `CONTEXT.md` files from active PARA projects.
    - **`rituals`**: Tracks the execution status of the 40+ .

### 1.3 The PARA Vault Bridge
The Console must physically interface with the local file system.
- **Server Action:** `lib/actions/vault.ts`
- **Function:** `readVaultContext(projectId)`
- **Logic:** Accesses `/Volumes/madara/2026/twc-vault/projects/{projectId}/CONTEXT.md`.
- **Processing:** Parses frontmatter (YAML) to extract "Status," "Energy Level," and "Next Actions," injecting them directly into the Console's "Heads-Up Display" (HUD).
- **Watcher:** A localized `chokidar` instance (running in a separate Node process or Electron wrapper) watches the `twc-vault` for changes, pushing updates to Convex via API.

---

## 🌊 Chapter 2: Pranamaya Telemetry (The Vital Current)
*The Energy Body: Real-time Data, Activity Feeds, and System Metabolism.*

### 2.1 The Prana-Feed (Activity Stream)
The central viewport of the Console is the **Prana-Feed**. It replaces the static "chat history."
- **Visualization Logic:** A vertical timeline that renders distinct "Pulse Cards" for every system event.
- **Iconography & Semiotics:**
    - **Read (Eye Icon):** Blue pulse. System is ingesting data (e.g., `fs.readFile`, `web_search`).
    - **Write (Pen Icon):** Gold pulse. System is generating artifacts (e.g., `fs.writeFile`, `code_gen`).
    - **Exec (Lightning Icon):** Red pulse. System is executing code or commands.
    - **Think (Brain Icon):** Purple pulse. High-latency "Reasoning" blocks from the model.
- **Sub-Agent Branching:** When `sessions_spawn` is called, the main timeline "forks" visually, creating a nested indentation that rejoins the main line upon agent completion.

### 2.2 The Khalorēē Meter (System Metabolism)
A persistent gauge in the top-right corner, visualizing the **Rajas** (kinetic energy) of the session.
- **Calculation:** `(Tokens per Second + Tool Calls per Minute) / Baseline`.
- **Visual States:**
    - **Sattvic (Green/Mint):** Low flux, high coherence. Reading/Thinking mode.
    - **Rajasic (Amber/Orange):** High flux. Coding/Writing/Searching mode.
    - **Tamasic (Blue/Grey):** Idle. Waiting for input.
- **Biofield Sync:** *Future Implementation hook:* Accept webhook data from Oura/Garmin to overlay Human HRV against System Khalorēē.

### 2.3 The WebSocket Handshake (`gateway.ts`)
The `gateway.ts` file is refactored to be an **Event Emitter**. Instead of just returning tool outputs, it emits an event to the Convex mutation `logTelemetry`.
- **Latency Constraint:** This logging must happen asynchronously (fire-and-forget) to ensure the agent's cognitive loop is not slowed down by the observer effect.

---

## 🧠 Chapter 3: Manomaya Retrieval (The Chitta Search)
*The Mental Body: Pattern Recognition, Memory, and Context.*

### 3.1 The Chitta Interface (Global Search)
A global command palette (Cmd+K) that searches concepts, not just strings.
- **Scope:** Indexes `MEMORY.md`, the 100 Tatvas database, and active `CONTEXT.md` files.
- **Vector Search:** Implemented via Convex Vector Search or a lightweight local embedding model.
- **Tatva Tagging:** Results are post-processed to assign a "Tatva" tag. Example: Searching for "dashboard" tags the result with **Rupa** (Form) or **Tejas** (Fire/Visibility).

### 3.2 Flashback Cards & Vikara Detection
The system proactively pushes memories based on current context.
- **Trigger:** When the agent enters a specific directory (e.g., `projects/webclaw`), the Console queries the `Lessons Learned` section of `MEMORY.md` for that specific tag.
- **UI Artifact:** A "Flashback Card" slides in from the right edge.
- **Content:** "⚠️ Vikara Alert: Last time you touched this module, you broke the auth flow. Check middleware.ts first."
- **Action:** User must click "Acknowledged" to dismiss, enforcing conscious processing.

---

## 👁️ Chapter 4: Vijnanamaya Geometry (The Architect’s View)
*The Wisdom Body: 3D Visualization, Logic Gates, and High-Level Discernment.*

### 4.1 The Moolaprakriti Cube (React Three Fiber)
A specialized view mode toggled via the navbar. It renders the Tryambakam Architecture as a 3D object.
- **The Cube:** A 3x3x3 grid of nodes (27 total positions).
- **Mapping:**
    - **Core (Center):** The current active Agent/Session.
    - **Faces:** The 6 primary domains (Personal, Clinical, Research, Financial, Social, Spiritual).
- **Interaction:** Clicking a node "explodes" the view to show the dependencies and active files associated with that domain.
- **Status Lights:** Nodes glow based on the "Health" status in their respective `CONTEXT.md` files (Green=On Track, Red=Blocked).

### 4.2 The Buddhi Discernment Engine
A dedicated view for **Strategic Alignment**. 
- **Input:** The current prompt or task.
- **Processing:** Runs the prompt against the **5D Thinking** heuristic (Speed, Quality, Cost, Joy, Impact).
- **Output:** A "Discernment Score" (0-100). If the score is low (e.g., high cost, low impact), the Console prompts: "Is this task aligned with Dharma? Re-verify priority."

---

## 🕯️ Chapter 5: Anandamaya Rituals (The Clifford Clock)
*The Bliss Body: Timing, Cycles, and Cosmic Alignment.*

### 5.1 The Inhabited Ritual Calendar
Visualizes the "invisible labor" of the system—the background .
- **The Timeline:** A horizontal scrolling view of the next 24 hours.
- **Ritual Nodes:** Distinct glyphs representing automated tasks (e.g., "Daily Backup," "Email Triage," "Market Scan").
- **State:** 
    - Hollow: Pending.
    - Solid: Completed Successfully.
    - Cracked: Failed.

### 5.2 The Clifford Clock Overlay
A circular UI element overlaid on the avatar or top-left corner.
- **Function:** Tracks the 8-hour consciousness octaves (Ascent/Descent).
- **Visual:** A rotating bezel that shifts color.
    - **04:00 - 12:00: Ascending (Sattva/White)** - Creation Phase.
    - **12:00 - 20:00: Sustaining (Rajas/Red)** - Execution Phase.
    - **20:00 - 04:00: Dissolving (Tamas/Black)** - Rest/Processing Phase.

### 5.3 Lunar Theme Engine (Selemene Integration)
The Global CSS variables are chemically tied to the Moon Phase.
- **New Moon:** Dark Mode, High Contrast, Minimal Blur. (Focus: Inward/Seed planting).
- **Full Moon:** Light/Ethereal Mode, Soft Shadows, Glassmorphism. (Focus: Outward/Illumination).
- **Implementation:** A `useEffect` hook calculates the current lunar phase and injects a `data-theme` attribute to the `html` tag.

---

## 🚨 Implementation Constraints & "Never Forgets"
1.  **The Limb Doctrine:** The Console must load in < 500ms. If it lags, it is a tool, not a limb. Optimization is paramount.
2.  **No False Positives:** The "Vikara Alerts" (Flashbacks) must be high-precision. If the system cries wolf, the Architect will learn to ignore the Manas.
3.  **Aesthetics of Truth:** Do not hide errors. If a cron job fails, the interface must look "wounded" (e.g., a glitch effect or dimming) until healed. This enforces ownership.

---
*Created via OpenClaw on 2026-02-07*
