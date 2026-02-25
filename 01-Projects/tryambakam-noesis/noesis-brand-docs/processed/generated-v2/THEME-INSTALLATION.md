# Noesis Bioluminescent Theme Suite

Three custom themes implementing the **Noesis V2 "Bioluminescent Architecture"** brand palette across your development environment, optimized for long coding sessions with Obsidianite-inspired aesthetics.

## Color Palette Reference

| Color Name | Hex Code | Usage |
|-----------|----------|-------|
| **Void Teal** | `#0A1628` | Primary backgrounds, deep surfaces |
| **Phosphor Cream** | `#F0EDE3` | Primary text, bright foreground |
| **Solar Bronze** | `#C4873B` | Accents, highlights, interactive elements |
| **Titanium** | `#8A9BA8` | Secondary text, subtle UI, comments |
| **Chlorophyll** | `#4A7C59` | Success states, strings, life indicators |
| **Terracotta** | `#C65D3B` | Error states, warnings, destructive actions |

**Contrast Ratios:**
- Void Teal + Phosphor Cream: **15.5:1 (WCAG AAA)**
- Void Teal + Solar Bronze: **5.9:1 (WCAG AA)**

---

## 1. Ghostty Terminal Theme

### Installation

**Option A: Manual Copy (Recommended)**
```bash
cp ~/.config/ghostty/themes/noesis-bioluminescent ~/.config/ghostty/themes/
```

The theme file has already been created at:
```
~/.config/ghostty/themes/noesis-bioluminescent
```

**Option B: Symlink from this directory**
```bash
ln -s /Volumes/madara/2026/twc-vault/01-Projects/tryambakam-noesis/noesis-brand-docs/prompt-cookbook-images/generated-v2/noesis-bioluminescent ~/.config/ghostty/themes/
```

### Activate Theme

Add to your Ghostty config (`~/.config/ghostty/config`):
```
theme = noesis-bioluminescent
```

Or test it directly:
```bash
ghostty --theme noesis-bioluminescent
```

### Verification

Test the theme with colorful terminal output:
```bash
# Test all 16 colors
ls --color=auto
git log --graph --all --oneline
npm test
```

---

## 2. Raycast Theme

### Installation

**File location:**
```
./noesis-bioluminescent-raycast.json
```

### Activate Theme

1. **Copy JSON to clipboard:**
   ```bash
   cat noesis-bioluminescent-raycast.json | pbcopy
   ```

2. **Import into Raycast:**
   - Open Raycast → Preferences (⌘,)
   - Navigate to **Appearance** → **Themes**
   - Click **Import** (or press ⌘I)
   - The theme will be imported from clipboard

3. **Select the theme:**
   - Theme "Noesis Bioluminescent" will appear in your theme list
   - Click to activate

### Verification

- Test search functionality (⌘Space)
- Navigate through action panels
- Check text readability (primary text should be Phosphor Cream)
- Verify accent color (Solar Bronze) appears on interactive elements

---

## 3. VS Code Theme

### Installation

**File location:**
```
./noesis-bioluminescent-color-theme.json
```

### Activate Theme

**Option A: Quick Install (Development Mode)**

1. **Copy theme to VS Code themes directory:**
   ```bash
   mkdir -p ~/.vscode/extensions/noesis-bioluminescent-theme/themes
   cp noesis-bioluminescent-color-theme.json ~/.vscode/extensions/noesis-bioluminescent-theme/themes/
   ```

2. **Create package.json:**
   ```bash
   cat > ~/.vscode/extensions/noesis-bioluminescent-theme/package.json << 'EOF'
   {
     "name": "noesis-bioluminescent-theme",
     "displayName": "Noesis Bioluminescent",
     "description": "Noesis V2 brand theme - Bioluminescent Architecture",
     "version": "1.0.0",
     "publisher": "tryambakam-noesis",
     "engines": {
       "vscode": "^1.70.0"
     },
     "categories": ["Themes"],
     "contributes": {
       "themes": [
         {
           "label": "Noesis Bioluminescent",
           "uiTheme": "vs-dark",
           "path": "./themes/noesis-bioluminescent-color-theme.json"
         }
       ]
     }
   }
   EOF
   ```

3. **Reload VS Code:**
   - Press ⌘⇧P (Cmd+Shift+P)
   - Type: "Developer: Reload Window"
   - Press Enter

4. **Activate theme:**
   - Press ⌘K ⌘T (Cmd+K, Cmd+T)
   - Select "Noesis Bioluminescent"

**Option B: Full Extension Development**

For a properly packaged extension (shareable, publishable):

1. Install `vsce` (VS Code Extension Manager):
   ```bash
   npm install -g @vscode/vsce
   ```

2. Create extension structure:
   ```bash
   mkdir noesis-bioluminescent-theme
   cd noesis-bioluminescent-theme
   mkdir themes
   cp ../noesis-bioluminescent-color-theme.json themes/
   ```

3. Create `package.json` (same as above)

4. Package the extension:
   ```bash
   vsce package
   ```

5. Install the `.vsix` file:
   - VS Code → Extensions (⌘⇧X)
   - Click "..." → "Install from VSIX"
   - Select `noesis-bioluminescent-theme-1.0.0.vsix`

### Verification

Test syntax highlighting in multiple languages:

- **JavaScript/TypeScript**: Open a `.js` or `.ts` file
  - Keywords (const, let, function) → Solar Bronze (bold)
  - Strings → Chlorophyll green
  - Functions → Bright Solar Bronze
  - Variables → Phosphor Cream
  - Comments → Titanium (italic)

- **Python**: Open a `.py` file
  - Check docstrings, decorators, keywords

- **HTML/JSX**: Open `.html` or `.jsx` file
  - Tags → Chlorophyll green
  - Attributes → Phosphor Cream
  - Strings → Chlorophyll green

- **CSS**: Open a `.css` file
  - Selectors → Bright Solar Bronze
  - Properties → Phosphor Cream
  - Values → Chlorophyll/Solar Bronze

- **Markdown**: Open a `.md` file
  - Headers → Bright Solar Bronze (bold)
  - Links → Cyan-green variant
  - Code blocks → Chlorophyll

### UI Verification

- **Editor background** → Void Teal `#0A1628`
- **Sidebar background** → Void Teal `#0A1628`
- **Activity bar** → Darker Void Teal `#050A14`
- **Status bar** → Darker Void Teal `#050A14`
- **Line numbers** → Dim Titanium (inactive), Solar Bronze (active line)
- **Selection** → Medium Void Teal `#2A4D6B` with opacity
- **Cursor** → Solar Bronze `#C4873B`

---

## Design Principles Applied

### Obsidianite Aesthetic Principles

1. **Opacity Layering:**
   - 15% for subtle backgrounds (inactive states)
   - 50% for borders and hover states
   - 80-90% for highlighted text
   - Avoiding solid 100% colored backgrounds

2. **Contrast Without Fatigue:**
   - Medium-luminosity Titanium text on very dark Void Teal backgrounds
   - High-contrast Phosphor Cream reserved for active/focused elements
   - Solar Bronze warmth prevents eye strain

3. **Hierarchical Color Distribution:**
   - **Level 1:** Solar Bronze accents (primary focus)
   - **Level 2:** Phosphor Cream text (active content)
   - **Level 3:** Titanium text (secondary info)
   - **Level 4:** Titanium 50% opacity (subtle UI)

4. **Interaction Feedback:**
   - Hover: Extended background, lightened text
   - Focus: Solar Bronze border/outline
   - Disabled: 40-50% opacity
   - Active: Full Phosphor Cream + Solar Bronze

---

## Customization

### Adjusting Brightness

If you find the theme too dark or too bright, you can adjust key colors:

**Brighter background (less contrast):**
- Change `#0A1628` → `#1A3850` (lighter Void Teal)

**Dimmer text (softer on eyes):**
- Change `#F0EDE3` → `#C0BDB5` (medium Phosphor Cream)

**More vibrant accents:**
- Change `#C4873B` → `#DAA05C` (brighter Solar Bronze)

### Adding Custom Colors

For VS Code, you can override specific colors in your `settings.json`:

```json
{
  "workbench.colorCustomizations": {
    "[Noesis Bioluminescent]": {
      "editor.background": "#0A1628",
      "editor.lineHighlightBackground": "#1A3850"
    }
  }
}
```

---

## Accessibility Notes

- **WCAG AAA Compliance:** Primary text (Phosphor Cream on Void Teal) achieves 15.5:1 contrast ratio
- **WCAG AA Compliance:** Accent text (Solar Bronze on Void Teal) achieves 5.9:1 contrast ratio
- **Color Blindness Considerations:**
  - Deuteranopia/Protanopia: Solar Bronze and Chlorophyll have sufficient luminosity differences
  - Tritanopia: Void Teal and Titanium use brightness rather than hue for distinction

---

## Troubleshooting

### Ghostty theme not loading

Check theme file location:
```bash
ls -la ~/.config/ghostty/themes/noesis-bioluminescent
```

Verify config syntax:
```bash
cat ~/.config/ghostty/config | grep theme
```

### Raycast theme colors not appearing

- Ensure JSON is valid: `cat noesis-bioluminescent-raycast.json | jq .`
- Try re-importing: Copy JSON again, reimport in Raycast

### VS Code theme not showing in list

- Check extension directory exists: `ls ~/.vscode/extensions/noesis-bioluminescent-theme/`
- Reload window: ⌘⇧P → "Developer: Reload Window"
- Check for errors: ⌘⇧P → "Developer: Show Logs" → Extension Host

### Colors look different than expected

- **Terminal color interpretation:** Some terminals apply additional color correction
- **Display calibration:** Check your display's color profile (should be sRGB for accurate colors)
- **VS Code semantic highlighting:** Disable if colors seem inconsistent: `"editor.semanticHighlighting.enabled": false`

---

## About This Theme Suite

**Version:** 1.0.0
**Created:** 2026-02-16
**Brand:** Tryambakam Noesis V2 - Bioluminescent Architecture
**Inspired by:** Obsidianite theme for Obsidian
**Optimized for:** Long coding sessions, reduced eye strain, brand consistency

**Design Philosophy:**
Solarpunk meets Art Nouveau meets sci-fi futurism. Bioluminescent organisms in deep-ocean twilight zones, Art Nouveau architecture meeting tech interfaces. Substance over decoration, earned complexity, radiant life in structured depth.

---

## License

These themes are part of the Tryambakam Noesis brand system. Free to use personally. For redistribution or commercial use, please contact the Noesis team.

---

## Feedback & Iteration

After using these themes for a few days, you may want to adjust:
- **Background darkness** (if too dark/light for your environment)
- **Accent brightness** (if Solar Bronze feels too warm/cool)
- **Comment visibility** (if Titanium is too dim/bright)

Save your preferences and we can generate refined versions.
