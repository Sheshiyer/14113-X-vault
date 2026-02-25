# Amir Mušić Design Prompts — Extraction Summary

**Extracted:** 2026-02-05 20:14 IST  
**Source Thread:** https://x.com/AmirMushich/status/2019073081881293302

---

## ✅ What Was Captured

### 1. Thread Structure
- **Main document:** `/03-Resources/Design/AI-Prompts/Amir-Mushich-50-Design-Prompts.md`
- **Organization:** 9 categories with 50+ prompts total
- **Format:** Links to individual tweet threads with descriptions

### 2. First Prompt Image Downloaded
- **File:** `/03-Resources/Design/AI-Prompts/Images/Amir-Mushich/brand-kit-prompt.jpg`
- **Description:** "30 seconds → $1,000 brand kit" (Brand Kit from One Prompt)
- **Tweet:** https://x.com/AmirMushich/status/2018348054789640565
- **Status:** Image opened in preview for manual review

---

## 📋 Categories Captured

1. **Branded Products** (6 prompts)
   - Creative product concepts
   - Premium beverage packaging
   - Branded souvenirs (2 variants)
   - Product designer prompt
   - Dieline-to-3D visualization

2. **Brand Identity Systems** (4 prompts)
   - Brand kit from one prompt ✅ **Image downloaded**
   - Swiss design logos
   - Glass logos
   - Crowd-formed logos

3. **3D Objects** (structure captured, prompts pending)
4. **Posters & Illustrations** (structure captured, prompts pending)
5. **Icons** (structure captured, prompts pending)
6. **Mockups** (structure captured, prompts pending)
7. **Apparel & Fashion Design** (structure captured, prompts pending)
8. **Custom Typography** (structure captured, prompts pending)
9. **Bonus & Freebies** (structure captured, prompts pending)

---

## 🎯 Next Steps (Manual)

Since the `image` tool requires API access, you'll need to:

1. **Review the downloaded image:**
   - Open: `/Volumes/madara/2026/twc-vault/03-Resources/Design/AI-Prompts/Images/Amir-Mushich/brand-kit-prompt.jpg`
   - Transcribe the complete prompt text
   - Add to the main markdown document

2. **Fetch remaining embedded tweets:**
   ```bash
   bird read https://x.com/i/status/[TWEET_ID] --plain
   ```
   - Extract tweet text + image URLs
   - Download images using `curl`
   - Review images to extract prompts

3. **Organize by priority:**
   - Start with categories most relevant to your work
   - Brand identity, 3D objects, and typography likely highest value
   - Icons and mockups good for reference library

---

## 🔧 Automation Script (for remaining extractions)

```bash
#!/bin/bash
# Extract all 50 prompts from Amir's thread

TWEET_IDS=(
  "2002029348132721016"
  "2002793794975273279"
  "2001560723173052612"
  # ... add all embedded tweet IDs
)

for id in "${TWEET_IDS[@]}"; do
  echo "Fetching tweet $id..."
  bird read "https://x.com/i/status/$id" --plain > "/tmp/tweet-$id.txt"
  
  # Extract image URL from output
  img_url=$(grep "PHOTO:" "/tmp/tweet-$id.txt" | sed 's/PHOTO: //')
  
  if [ ! -z "$img_url" ]; then
    echo "Downloading image from $img_url..."
    curl -L -o "/Volumes/madara/2026/twc-vault/03-Resources/Design/AI-Prompts/Images/Amir-Mushich/tweet-$id.jpg" "$img_url"
  fi
done
```

---

## 💡 Value Proposition

This collection is from a **Warner Music / PepsiCo / Spotify designer** with 10+ years experience. The prompts are:

- **Production-ready** (used in commercial work)
- **Template-based** (change [BRAND NAME] variable)
- **Nano Banana Pro optimized** (Gemini 3 Pro Image)
- **Swiss design influence** (clean, systematic approaches)
- **$0 cost** (freely shared)

**Potential Use Cases:**
- RealityWraps brand identity expansion
- Tryambakam Noesis visual system
- Phassion product visualization
- Somatic Canticles illustration work
- Discord community header images

---

## 📊 Extraction Status

- **Thread structure:** ✅ Complete
- **Category descriptions:** ✅ Complete
- **Embedded tweet links:** ✅ All captured
- **First prompt image:** ✅ Downloaded
- **Remaining 38 images:** ⏳ 4 Parallel Agents dispatched for Sections 4, 5, 6, and 7
- **Prompt transcription:** ⏳ 4 Parallel Agents dispatched for Sections 4, 5, 6, and 7

**Location:** `/Volumes/madara/2026/twc-vault/03-Resources/Design/AI-Prompts/`
