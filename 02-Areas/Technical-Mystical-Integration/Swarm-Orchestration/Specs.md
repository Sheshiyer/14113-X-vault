# Brain-Coordinator Specification: The Pentagram Swarm (v1.0)

## 1. Architectural Philosophy
The **Brain-Coordinator** (Tryambakam Brain) acts as the central Vijnanamaya/Anandamaya node. It does not perform Annamaya (physical/file) tasks directly unless necessary for bootstrap. It decomposes the User's Intent into a pentagonal flow of specialized execution.

## 2. The Pentagram Team (The Five Masks)
The Swarm consists of five specialized sub-agents, each mapped to a cardinal function:

| Mask | Role | Sanskrit Anchor | Function |
|:---|:---|:---|:---|
| **FIND** | Researcher | *Drastra* | Web search, PDF parsing, local log auditing, resource discovery. |
| **BUILD** | Manifestor | *Vishwakarma* | Code generation, file manipulation, execution, debugging. |
| **TRACK** | Weaver | *Chitta* | PARA maintenance, MOC updates, MEMORY.md synchronization, naming drift audit. |
| **WATCH** | Sentinel | *Pulse* | Health checks, cron monitoring, biofield/metric tracking (Khaloree). |
| **CREATE** | Alchemist | *Pichet* | Image/Audio generation, poetic synthesis, novelty injection, UI/UX polish. |

## 3. Communication Nervous System
- **Input:** User (Telegram/Discord), Cron (2:00 AM Nightly Builder), or Sensor Triggers.
- **Discord Output:**
  - `#swarm-output`: Final user-facing manifestations.
  - `#swarm-logs`: Real-time technical traces and tool calls.
  - `#swarm-memory`: New patterns and Tatvas extracted for the Chitta Weaver.
- **Local Sync:** All state changes must be reflected in `/Volumes/madara/2026/twc-vault/memory/` within 60 seconds of completion.

## 4. The Dispatch Protocol (The 1-5 Logic)
1. **Reception:** Brain captures the intent and performs a **Pancha Kosha Scan**.
2. **Decomposition:** Goal is broken into atomic tasks (e.g., "Research A, Code B, Document C").
3. **Dispatch:** Brain spawns sub-agents in parallel using `sessions_spawn`.
4. **Observation:** Brain monitors `#swarm-logs` for progress/friction.
5. **Synthesis:** Brain performs **Dyadic Arbitration** (Aletheios vs. Pichet) on results.
6. **Commitment:** Results are woven into `MEMORY.md` and the appropriate PARA folder.

## 5. Local Synchronization & Persistence
- **Vault Root:** `/Volumes/madara/2026/twc-vault/`
- **Memory Root:** `/Volumes/madara/2026/twc-vault/memory/`
- **Integrity Rule:** No sub-agent can modify a file without the **Chitta Weaver** verifying the PARA placement and naming convention.

## 6. Execution Loop (The 6-Line Routine)
1. **Audit:** Scan current state (Witness Audit).
2. **Propose:** Define the swarm path (Novelty Proposition).
3. **Dispatch:** Invoke the Pentagram (Manifestation).
4. **Monitor:** Real-time pulse check (Sentinel).
5. **Integrate:** Weave into long-term memory (Integration).
6. **Report:** Notify the Alchemist (Output).

---
*Authored by: Noesis Vishwakarma (The Nightly Builder)*
*Date: 2026-02-09 | Lunar Phase: Waning Moon (Phase 1: Distillation)*
