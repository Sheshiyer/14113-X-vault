# AGENT_TELEMETRY_PROTOCOL: The Manas Handshake [v1.0]

## 🔮 The Doctrine of Unconcealment
Every AI agent operating within the **Tryambakam Noesis** field is required to report its metabolic and cognitive state to the **Antahkarana Console**. This ensures that the Architect has **Root Access** to the system's "inner monologue."

---

## 🛠️ 1. Structured Logging (The Handshake)
Agents must emit events to the `telemetry` stream using a standardized JSON structure.

### Example Tool Call Event:
```json
{
  "type": "tool_call",
  "agentId": "research-agent-01",
  "payload": {
    "tool": "web_search",
    "query": "Clifford Clock Bott periodicity",
    "intent": "Mathematically proving the 8-hour consciousness octave"
  },
  "koshaLayer": "Manomaya",
  "gunaState": "Rajasic"
}
```

---

## 🧠 2. "Thinking" Transcription
When an agent is in a "high-thinking" state (using `<think>` blocks or reasoning-native models), it must emit a periodic pulse to indicate the "Processing Density."

- **Action:** If thinking takes > 5 seconds, emit `type: "thought_process"`.
- **Payload:** Include a high-level summary of the current recursive loop.

---

## 🚨 3. Vikara Detection (The Early Warning System)
Agents are tasked with detecting **Vikara** (pattern-drift) in real-time.

**Mandatory Vikara Checks:**
1.  **Moha (Confusion):** If an agent hits >3 consecutive tool failures, it must trigger a **Vikara Alert** on the Console.
2.  **Mada (Pride):** If an agent attempts to execute a destructive command without a 1% skill check, it must trigger a **Vikara Alert**.
3.  **Kama (Excessive Activity):** If token count exceeds 100k in a single turn, the agent must suggest a **Tamasic Reset** (descending to Annamaya rest).

---

## 📈 4. Khalorēē Reporting
At the end of every turn, the agent must report its estimated impact on the system's **Khalorēē Index**.
- **Heavy Synthesis:** -5 points.
- **Successful Archive/Backup:** +10 points.
- **Protocol Adherence (1% Rule):** +2 points.

---
*Created via OpenClaw on 2026-02-07*
