# A Traveler's Guide to the Latent Space

**Written by:** [Ethan Smith](https://linktr.ee/ethansmith2000)
**Edited by:** [Juan Lam](https://juanlam.com/)

> **Note:** This guide was originally written for Disco Diffusion (v5.2/5.4) but contains timeless concepts for AI art generation.

## Introduction

We are in a very interesting time right now where the growth of AI is exponential, and its usage is becoming more and more mainstream. The open-source nature of these projects has attracted a lot of great minds and fostered the exchange of knowledge that has let us improve so rapidly.

Greetings fellow adventurer of the Latent Space!

Whether you’re new to AI, or quite experienced with Disco, I think this guide will be of good use to you. This guide was designed as a response to the most frequent questions I’ve been asked by the AI Art community: “What’s the prompt?” “What are the settings?”

I created this guide because I believe that sharing knowledge is important — there’s just too much ground to cover for anybody to figure things out on their own. However, I don’t believe in just copying and pasting the work of others. When we make AI Art, we’re all pulling from the same datasets (unless you’ve curated your own), and the interpretation of what a prompt should look like is ultimately left up to the machine. As such, the only things that separate our work from that of others is our prompts, and our settings.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Getting Started with Disco Diffusion](#getting-started-with-disco-diffusion)
3.  [Chapter 1: Prompt Engineering](#chapter-1-prompt-engineering)
4.  [Chapter 2: Init Images](#chapter-2-init-images)
5.  [Chapter 3: Settings](#chapter-3-settings)
6.  [Chapter 4: Tech Support](#chapter-4-tech-support)
7.  [Chapter 5: Settings – A Deep Dive](#chapter-5-settings--a-deep-dive)

---

## Getting Started with Disco Diffusion

(On Google Colab)

Unless you have some other way of running Disco, you’re probably going to be running it through Google Colab.
[Official DD Notebook](https://colab.research.google.com/github/alembics/disco-diffusion/blob/main/Disco_Diffusion.ipynb)

**Quick Tips:**
*   **Check `google_drive`**: Allows saving outputs to your drive.
*   **Check `save_models_to_google_drive`**: Saves download time for future runs.
*   **N_batches**: Set to 1 initially to avoid getting booted for long runtimes.

---

## Chapter 1: Prompt Engineering

The quintessence of text-to-image AI. This is your place to work your magic.

### A Prompt Template

**General format:** `Subject, by Artist (and artist), modifier 1, modifier 2…`

| Subject / Main Idea | By Artist(s) | Modifiers |
| :--- | :--- | :--- |
| A beautiful photo of a lush landscape | By Thomas Kinkade and Marc Simonetti | 4k resolution, trending on artstation |

**Common Modifiers:**
*   **Artists:** Tyler Edlin, Marc Simonetti, Justin Gerard, Wayne Barlowe, Greg Rutkowski, DaVinci, Picasso, Van Gogh, H.R. Giger, Studio Ghibli, Makoto Shinkai.
*   **Modifiers:** 4k resolution, 8k resolution, Trending on artstation, Unreal engine, Watercolor, Oil painting, Shot on film, 35mm lens.

**Tips:**
*   **Be Specific:** "A school bus with a man in it" vs "A man in a school bus".
*   **Word Connotations:** "Lonely lighthouse" might make the lighthouse itself look sad/anthropomorphized.
*   **Ambiguity:** "Underground subway station" might give you the sandwich shop "Subway".

---

## Chapter 2: Init Images

Using your own images as a starting point.

1.  Upload your picture to Colab.
2.  Copy the path.
3.  Paste into `init_images` field: `0: ["./init_images/Sampleimage.jpg"]`
4.  **Skip_Steps**: Set to ~50% of total steps (e.g., 125 if steps are 250).
    *   Lower skip_steps = more AI influence.
    *   Higher skip_steps = preserves original image more.

---

## Chapter 3: Settings

Settings act as a multiplier to your prompt.

### Diffusion Models
*   **VITL14**: Strongest model, highly recommended if memory permits.
*   **RN50 vs RN101**: RN101 is bigger/stronger, but stylistic preference matters.
*   **Suggested Combo**: VITB32 + VITB16 + VITL14 + (RN50 or RN101).

### Clip Guidance Scale (CGS)
*   Guides how much Disco stays true to the prompt.
*   **Default**: 5000.
*   **Suggested**: 10k-30k.
*   **Too High (>30k)**: Can distort image, "deep fried" look.

### Resolution
*   Must be multiples of 64.
*   **Suggested**: 1280x768 (max for most setups).
*   **Note**: Resolution affects composition.

### Steps
*   **Default**: 250.
*   **Suggested**: 250 or 500. 1000 is diminishing returns.

### Cutn Batches
*   **Default**: 4.
*   **Suggested**: 2-8.

### Clamp_Max
*   Master knob for saturation/contrast/detail.
*   **Default**: 0.05.
*   **Suggested**: 0.05-0.10.

---

## Chapter 4: Tech Support

**Common Errors:**
*   **CUDA out of memory**: Trying to do too much (high res, too many models) for the GPU.
*   **Misaligned address**: Usually VITL14 on a T4 GPU.

**Colab Tiers:**
*   **Free**: Slow, frequent disconnects.
*   **Pro ($10/mo)**: Faster (P100/V100), ~12h runtime.
*   **Pro+ ($50/mo)**: Background execution, 24h runtime.

**Running Locally:**
*   **Visions of Chaos**: Easiest installer for Windows.
*   **ProgRockDiffusion**: Command line version.

---

## Chapter 5: Settings – A Deep Dive

### Understanding CGS
Higher CGS speeds up denoising but can increase instability. It forces the AI to "see" the prompt everywhere, leading to repetition (motifs).

### Cutn Batches vs Steps
*   **Steps**: More depth, better coherence.
*   **Cutn Batches**: Smoother textures, less "choppy", but can add unwanted details (double noses).

### Clamp_Max
A "master volume". Higher values (0.15+) bring out intense detail, lighting, and "wisps", but risk overexposure (bleached colors).

### Perlin Noise
An alternative noise generation method. `Perlin_init` can help provide a structured base, especially useful when using `skip_steps` without an init image.

### Models Part 2
*   **ViT (Vision Transformers)**: Generally outperform ResNets (RN) in performance/memory ratio.
*   **Mixing**: Combining models (e.g., ViT + RN) often yields the best results by covering different "blind spots".

---
*Original Guide by Ethan Smith. Archived for personal reference.*
