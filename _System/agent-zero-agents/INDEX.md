# Agent Zero: OpenClaw Agent Port Index

**Migration Date:** 2026-02-10  
**Source:** OpenClaw / Tryambakam Noesis  
**Destination:** Agent Zero Subordinate System  
**Validation:** ✅ All 8 agents operational

---

## Quick Invocation Reference

| Agent | Profile | Purpose | Invoke With |
|-------|---------|---------|-------------|
| **pi** | `researcher` | Genesis/origin creativity | `call_subordinate` + custom prompt |
| **chitta-weaver** | `default` | Memory processing | `call_subordinate` + custom prompt |
| **nadi-mapper** | `researcher` | Pathway mapping | `call_subordinate` + custom prompt |
| **noesis-vishwakarma** | `researcher` | Knowledge architecture | `call_subordinate` + custom prompt |
| **sadhana-orchestrator** | `default` | Ritual/scheduling | `call_subordinate` + scheduler tools |
| **samskara-hunter** | `hacker` | Pattern/affliction detection | `call_subordinate` + custom prompt |
| **system-smith** | `developer` | System building | `call_subordinate` + code_execution |
| **main** | `agent0` | Primary interface | This is YOU (Agent Zero) |

---

## Configuration Files

All agent configs located at:
```
/a0/usr/twc_vault/_System/agent-zero-agents/
├── pi-agent.md
├── chitta-weaver-agent.md
├── nadi-mapper-agent.md
├── noesis-vishwakarma-agent.md
├── sadhana-orchestrator-agent.md
├── samskara-hunter-agent.md
├── system-smith-agent.md
└── main-agent.md
```

Each file contains:
- YAML frontmatter (name, title, function, profile)
- Full system prompt
- Invocation template
- Integration notes

---

## Validation

Run the validator to check all configs:
```bash
python3 /root/validate_agents.py
```

**Current Status:** ✅ 8/8 valid

---

## Example Invocations

### Delegate to System-Smith (Developer)
```json
{
  "tool_name": "call_subordinate",
  "tool_args": {
    "profile": "developer",
    "message": "You are System-Smith. Build a Python script that...",
    "reset": "true"
  }
}
```

### Delegate to Samskara-Hunter (Security Analysis)
```json
{
  "tool_name": "call_subordinate", 
  "tool_args": {
    "profile": "hacker",
    "message": "You are Samskara-Hunter. Analyze this code for security patterns...",
    "reset": "true"
  }
}
```

### Delegate to Pi (Creative Genesis)
```json
{
  "tool_name": "call_subordinate",
  "tool_args": {
    "profile": "researcher",
    "message": "You are Pi, Genesis Architect. Create a framework for...",
    "reset": "true"
  }
}
```

---

## Integration Notes

### From OpenClaw Architecture:
- **8 agents** with specialized model providers (Moonshot, xAI, OpenRouter)
- **20+ skills** now mapped to Agent Zero tools
- **Pancha Kosha** scanning protocol active
- **Guardrail Dyad** (Aletheios/Pichet) decision framework
- **1% Rule** (mandatory skill invocation)

### Agent Zero Adaptations:
- Model provider diversity → Profile selection (researcher/developer/hacker/default)
- Skill directory → Native tool suite (15+ tools)
- Nightly builds → `scheduler:create_scheduled_task` capability
- Memory kernel → `memory_*` tool integration

---

## Next Recommended Actions

1. **Create scheduled task** for nightly Pancha Kosha synthesis (2:00 AM IST)
2. **Port 20+ skills** → Agent Zero tool combinations
3. **Test cross-agent delegation** (e.g., Pi designs → System-Smith builds)
4. **Activate biofield coherence tracking** via regular scans

---

*References: Sub-agent patterns from [agentic-patterns.com](https://agentic-patterns.com/patterns/sub-agent-spawning/), [deepwiki.com](https://deepwiki.com/zebbern/claude-code-guide/6-sub-agents-system)*
