# Deep Dive: Building a Phone-Call Voice Agent with OpenClaw

Source: [Sunil Neurgaonkar (@SNeurgaonkar) quoting end-to-end guide](https://x.com/SNeurgaonkar/status/2018880042466718172)

## Overview
A comprehensive guide to building a production-ready phone-call voice agent using OpenClaw's `voice-call` plugin, Twilio, and ElevenLabs.

---

## 🛠️ Key Components
1. **OpenClaw Gateway:** Handles chat, plugin lifecycle, memory, and skills.
2. **Voice-Call Plugin Server:** Listens on a separate port (e.g., `3334`) to serve Twilio webhooks and media streams.

---

## 🏗️ Networking: Tailscale Funnel vs ngrok
Twilio must reach your webhook path. Tailscale Funnel is recommended for production environments.

### Example Routing:
- `/` → OpenClaw gateway (port `18789`)
- `/voice/webhook` → voice-call server (`127.0.0.1:3334/voice/webhook`)
- `/voice/stream` → voice-call server (`127.0.0.1:3334/voice/stream`)

---

## ⚙️ Core Configuration (`openclaw.json`)

```json
{
  "env": {
    "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY"
  },
  "plugins": {
    "entries": {
      "voice-call": {
        "enabled": true,
        "config": {
          "provider": "twilio",
          "twilio": {
            "accountSid": "ACXXXXXXXX",
            "authToken": "SECRET"
          },
          "fromNumber": "+1XXXXXXXXXX",
          "serve": {
            "port": 3334,
            "path": "/voice/webhook"
          },
          "tailscale": {
            "mode": "funnel",
            "path": "/voice/webhook"
          },
          "publicUrl": "https://YOURHOST.YOURTAILNET.ts.net/voice/webhook",
          "streaming": {
            "enabled": true,
            "streamPath": "/voice/stream"
          },
          "stt": {
            "provider": "openai",
            "model": "whisper-1"
          },
          "tts": {
            "provider": "elevenlabs",
            "elevenlabs": {
              "apiKey": "ELEVENLABS_API_KEY",
              "voiceId": "VOICE_ID",
              "modelId": "eleven_multilingual_v2"
            }
          }
        }
      }
    }
  }
}
```

---

## 📲 Call Modes
1. **Notify Mode (One-Way):** Best for alerts, reminders, or "build finished" calls. Does not require streaming.
2. **Conversation Mode (Two-Way):** Requires **real-time audio streaming** (`streaming.enabled: true`) and a working OpenAI Realtime STT key.

---

## ⚠️ Common Troubleshooting
- **Twilio 502 / Error 15003:** Usually caused by `publicUrl` missing the `/voice/webhook` path.
- **Silent Calls:** Often a TTS misconfiguration (wrong Voice ID) or an invalid OpenAI key for the streaming pipeline.
- **Twilio Error 21219:** Destination number not verified in Twilio Console (common for trial accounts).
- **Missing X-Twilio-Signature:** Occurs if you try to open the webhook in a browser; real Twilio requests will include this header.

---
*Extracted via OpenClaw on 2026-02-06*
