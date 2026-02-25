# Tryambakam Noesis: Technical Integration Guide

**Document Type:** Technical Operations & Onboarding  
**Version:** 1.0  
**Status:** Operational  
**Associated Tools:** Screenpipe, Mixloop, OpenClaw

---

## 1. The Digital Witness (Screenpipe)

### Overview
Screenpipe provides 24/7 local recording and AI-searchable context of the desktop. It operates at **Layer 1 (Annamaya)** to capture the raw physical data of digital life.

### Setup & Command
- **Installation:** `brew install screenpipe` (or via binary)
- **Execution:**
  ```bash
  screenpipe --fps 0.1 --disable-audio --local-ocr --port 3030
  ```
- **Port:** 3030
- **Privacy Mode:** Audio is disabled by default. Local OCR ensures data stays on-machine.

### Integration with Pi
You can query your digital history by asking Pi:
> "What was I working on yesterday afternoon?"
> "Find the URL of the biofield research paper I looked at earlier."

---

## 2. Audio Alchemy (Mixloop)

### Overview
Mixloop is a professional audio sequence mixer used for weaving **Somatic Canticles** and **Vocal Rituals**. It operates at **Layer 2 (Pranamaya)** to modulate vital energy through sound.

### Architecture
- **Backend (Go):** Handles FFmpeg processing, batching, and Dolby Stereo simulation.
- **Frontend (React/Vite):** Provides a modern, responsive UI for sequencing.

### Setup & Execution
- **Backend:**
  ```bash
  cd 01-Projects/mixloop/backend
  go run main.go
  ```
  - **Port:** 8081
- **Frontend:**
  ```bash
  cd 01-Projects/mixloop/frontend
  npm start
  ```
  - **Port:** 3000 (Vite default)

### Key Features
- **Loops:** Seamless crossfades at boundaries.
- **Dolby Simulation:** Spatial widening for immersive rituals.
- **Batch Processing:** Optimized for 100+ files.

---

## 3. OpenClaw Automation (Cron Systems)

### Overview
OpenClaw serves as the **Antahkarana (Internal Instrument)**, coordinating the different "organs" of the system.

### Core Cron Jobs
- **`nightly-builder`:** Runs at 2:00 AM to process the backlog and implement QoL improvements.
- **`twc-content-generator-daily`:** Generates daily transmissions and archives them in `Churned-Content/`.
- **`breathwork-crons`:** 3x daily (07:00, 13:00, 19:00) for Vayu-aligned practice.

### Archival Protocol
All generated alchemical artifacts (audio, images, docs) MUST be stored in:
`01-Projects/Products/Churned-Content/`

---

## 4. Maintenance & Troubleshooting

- **Check Service Status:** `ps aux | grep -E "screenpipe|mixloop"`
- **Restart Services:** Kill existing PIDs and rerun commands from this guide.
- **Logs:** Check `/Volumes/madara/2026/twc-vault/memory/logs/` for daily operational reports.

---

**Next Octave:** Integration of real-time HRV data from Oura Ring into the Mixloop sequencing logic for "Adaptive Somatic Rituals."
