# ElevenLabs ConvAI + OpenClaw Phone Integration Guide

Source: [ElevenLabs Developers on X](https://x.com/ElevenLabsDevs/status/2018798792485880209)

## Overview
How to call your OpenClaw bot over the phone using ElevenLabs Agents. ElevenLabs handles the "voice" (turn-taking, TTS, STT, phone integration), while OpenClaw acts as the "brains" (tools, memory, skills).

---

## 🏗️ The Architecture
- **ElevenLabs Agents:**turn taking, speech synthesis/recognition, phone integration.
- **OpenClaw:** Tools, memory, and skills.
- **Protocol:** Standard OpenAI `/v1/chat/completions`.

---

## 📋 Prerequisites
- ElevenLabs account
- OpenClaw installed and running
- `ngrok` installed (for local exposure)
- Twilio account (if you want a real phone number)

---

## 🛠️ Step 1: Set Up OpenClaw
Enable the chat completions endpoint in your `~/.openclaw/openclaw.json`:

```json
{
    "gateway": {
        "http": {
            "endpoints": {
                "chatCompletions": {
                    "enabled": true
                }
            }
        }
    }
}
```

---

## 🌐 Step 2: Expose with ngrok
Start the tunnel to expose your local OpenClaw gateway (default port 18789):

```bash
ngrok http 18789
```
*Note your public URL (e.g., `https://abc-123.ngrok-free.app`).*

---

## 🤖 Step 3: Configure ElevenLabs Agent
You can do this via the ElevenLabs UI or programmatically:

### A) Manual Config (UI)
1. Create a new ElevenLabs Agent.
2. Under **LLM settings**, select **Custom LLM**.
3. Set URL to: `https://YOUR_NGROK_URL.ngrok-free.app/v1/chat/completions`
4. Add your **OpenClaw gateway token** as the authentication header.

### B) Programmatic Config (CLI)
**Step 1: Create the secret**
```bash
curl -X POST https://api.elevenlabs.io/v1/convai/secrets \
-H "xi-api-key: YOUR_ELEVENLABS_API_KEY" \
-H "Content-Type: application/json" \
-d '{
"type": "new",
"name": "openclaw_gateway_token",
"value": "YOUR_OPENCLAW_GATEWAY_TOKEN"
}'
```
*Returns a `secret_id`.*

**Step 2: Create the agent**
```bash
curl -X POST https://api.elevenlabs.io/v1/convai/agents/create \
-H "xi-api-key: YOUR_ELEVENLABS_API_KEY" \
-H "Content-Type: application/json" \
-d '{
"conversation_config": {
"agent": {
"language": "en",
"prompt": {"llm": "custom-llm", "prompt": "You are a helpful assistant.", "custom_llm": {"url": "https://YOUR_NGROK_URL.ngrok-free.app/v1/chat/completions", "api_key": {"secret_id": "RETURNED_SECRET_ID"}}}}}}'
```

---

## 📞 Step 4: Attach a Phone Number
1. In **Twilio**, purchase a phone number.
2. In ElevenLabs agent settings, go to the **Phone** section.
3. Enter Twilio credentials (**Account SID** and **Auth Token**).
4. Connect your Twilio number to the agent.

---
*Extracted via OpenClaw on 2026-02-06*
