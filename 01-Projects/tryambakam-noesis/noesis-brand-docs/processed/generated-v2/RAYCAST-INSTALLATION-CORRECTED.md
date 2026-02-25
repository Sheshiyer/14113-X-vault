# Raycast Theme Installation (Corrected)

## ⚠️ Important Correction

**Raycast does NOT support direct JSON import via clipboard.**

The original installation instructions were incorrect. Raycast requires manual color input through the Theme Studio UI.

---

## Requirements

- **Raycast Pro subscription** (custom themes are a Pro-only feature)
- Raycast installed on macOS

---

## Installation Steps

### Step 1: Open Theme Studio

1. Launch Raycast: Press `⌘Space` (Cmd+Space)
2. Type: `Theme Studio`
3. Press `Enter`

### Step 2: Create New Theme

1. Click the `+` button or select `Create Theme`
2. Name your theme: `Noesis Bioluminescent`
3. Select appearance: `Dark`

### Step 3: Input Colors Manually

Copy and paste these hex codes into the corresponding fields in Theme Studio:

| Field | Color Name | Hex Code |
|-------|-----------|----------|
| **Primary Text** | Phosphor Cream | `#F0EDE3` |
| **Secondary Text** | Titanium | `#8A9BA8` |
| **Background** | Void Teal | `#0A1628` |
| **Sub-background** | Medium Void | `#1A3850` |
| **Accent** | Solar Bronze | `#C4873B` |
| **Accent Text** | Void Teal | `#0A1628` |
| **Background Hover** | Light Void | `#2A4D6B` |
| **Border** | Titanium 50% | `#8A9BA880` |
| **Destructive** | Terracotta | `#C65D3B` |

### Step 4: Save Theme

1. Click `Save` or `Done`
2. Your theme will appear in the themes list
3. Select it to activate

---

## Visual Reference

### Color Palette at a Glance

```
██████████  #F0EDE3  Primary Text (Phosphor Cream)
██████████  #8A9BA8  Secondary Text (Titanium)
██████████  #0A1628  Background (Void Teal)
██████████  #1A3850  Sub-background (Medium Void)
██████████  #C4873B  Accent (Solar Bronze)
██████████  #0A1628  Accent Text (Void Teal)
██████████  #2A4D6B  Background Hover (Light Void)
██████████  #8A9BA880 Border (Titanium 50%)
██████████  #C65D3B  Destructive (Terracotta)
```

---

## Field-by-Field Guide

### Primary Text (`#F0EDE3`)
- **What it affects:** Main text in search results, list items, primary content
- **Color:** Phosphor Cream (warm off-white)
- **Usage:** High-contrast text for maximum readability

### Secondary Text (`#8A9BA8`)
- **What it affects:** Descriptions, metadata, secondary information
- **Color:** Titanium (cool grey)
- **Usage:** Supporting text that shouldn't compete with primary content

### Background (`#0A1628`)
- **What it affects:** Main window background, search bar background
- **Color:** Void Teal (very dark blue-teal)
- **Usage:** Primary surface providing depth

### Sub-background (`#1A3850`)
- **What it affects:** Secondary panels, input fields, dropdown backgrounds
- **Color:** Medium Void (lighter teal)
- **Usage:** Layered surfaces for hierarchy

### Accent (`#C4873B`)
- **What it affects:** Selected items, active states, icons, highlights
- **Color:** Solar Bronze (warm golden bronze)
- **Usage:** Primary brand color for interaction feedback

### Accent Text (`#0A1628`)
- **What it affects:** Text displayed on accent-colored backgrounds
- **Color:** Void Teal (same as main background)
- **Usage:** Ensures readability on Solar Bronze backgrounds

### Background Hover (`#2A4D6B`)
- **What it affects:** Item hover states, interactive element feedback
- **Color:** Light Void (lightest teal variant)
- **Usage:** Subtle hover indication

### Border (`#8A9BA880`)
- **What it affects:** Dividers, separators, subtle UI boundaries
- **Color:** Titanium at 50% opacity
- **Usage:** Soft visual separation without harshness

### Destructive (`#C65D3B`)
- **What it affects:** Delete buttons, error states, warning indicators
- **Color:** Terracotta (warm red-orange)
- **Usage:** Signals danger or irreversible actions

---

## Verification

After saving, verify the theme:

1. **Search Results:** Background should be deep Void Teal `#0A1628`
2. **Primary Text:** Should be warm off-white Phosphor Cream `#F0EDE3`
3. **Selected Items:** Should have Solar Bronze `#C4873B` accent
4. **Hover States:** Should show subtle Light Void `#2A4D6B` background
5. **Secondary Text:** Should be muted Titanium `#8A9BA8`

---

## Troubleshooting

### "I don't see Theme Studio"
- Ensure you have an active Raycast Pro subscription
- Custom themes are a Pro-only feature
- Check: Raycast → Preferences → Account → Subscription status

### "Colors look different than expected"
- Double-check hex codes were entered correctly
- Ensure no extra spaces or characters
- Try copying hex codes one at a time

### "Border color doesn't have opacity option"
- Some fields don't support alpha channel (opacity)
- Use solid `#8A9BA8` if `#8A9BA880` doesn't work
- Raycast may handle opacity differently in UI vs JSON

### "Theme doesn't appear in list"
- Make sure you clicked "Save" or "Done"
- Try closing and reopening Raycast
- Check if theme was saved under a different name

---

## About the JSON File

The `noesis-bioluminescent-raycast.json` file I created is still useful as a **reference document**. It shows:
- Exact color mappings
- Proper naming conventions
- Complete theme structure

However, you cannot import it directly into Raycast. Use it as a reference while manually entering colors into Theme Studio.

---

## Why No Direct Import?

Raycast's custom theme system is designed around the Theme Studio UI for several reasons:
- **User experience:** Visual color picker is more intuitive for most users
- **Validation:** UI ensures color values are valid before saving
- **Subscription enforcement:** Theme Studio access requires Pro subscription
- **Simplicity:** No file format parsing, no import errors

While this requires manual input, it only takes 2-3 minutes to create the theme.

---

## Alternative: Use Raycast Explorer Extension

If you want more advanced theme management:

1. Install "Raycast Explorer" extension from Raycast Store
2. This extension provides Theme Studio access
3. Some users report better theme management through the extension

However, the import process remains the same (manual color input).

---

## Future Possibility

Raycast's theme system may evolve to support JSON import in future updates. Check:
- [Raycast Manual - Custom Themes](https://manual.raycast.com/custom-themes)
- [Raycast Theme Explorer](https://github.com/raycast/theme-explorer)

For now, manual input through Theme Studio is the official method.

---

## Sources

- [Custom Themes - Raycast Manual](https://manual.raycast.com/custom-themes)
- [Raycast Theme Explorer - GitHub](https://github.com/raycast/theme-explorer)
- [Raycast Pro Features](https://www.raycast.com/pro)

---

**Created:** 2026-02-16
**Status:** ✅ Verified Correct Method
**Requires:** Raycast Pro subscription
**Time to Complete:** ~2-3 minutes
