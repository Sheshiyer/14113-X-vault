---
type: note
category: Projects
subcategory: Brand
enneagram: Type 5
status: active
---


1. **Primary Font Pairing:**

```typescript
interface FontSystem {
  display: {
    primary: "Roshage", // Logo and main headlines
    secondary: "Monument Extended" // Sub-headlines and feature text
  },
  body: {
    primary: "JetBrains Mono", // Technical content, code snippets
    secondary: "Inter" // Body text and UI elements
  },
  accent: "Syncopate" // Mystical accents and small highlights
}
```

**Usage Breakdown:**

1. **Roshage (Display)**
   - Use for: Main brand headlines, hero text
   - Style with: Aether Gold (#FFCC33)
   - Effects: Subtle glow in Astral Cyan

2. **Monument Extended**
   - For: Secondary headlines, navigation
   - Complements Roshage's unique character
   - Works well with the futuristic aesthetic
   - Style with: Moonlit Silver (#C0C0C0)

3. **JetBrains Mono**
   - Technical content
   - Code displays
   - Perfect for your tech-mysticism blend
   - Style with: Astral Cyan (#00D8FF)

4. **Inter**
   - Body text
   - UI elements
   - Great readability with modern feel
   - Style with: Stellar White (#F5F5F5)

5. **Syncopate**
   - Special accents
   - Button text
   - Mystical symbols
   - Style with: Mystic Violet (#8B5CF6)

Here's how to implement this in Framer:

```typescript
// Font system setup for Framer
const fontSystem = {
  styles: {
    h1: {
      fontFamily: "Roshage",
      fontSize: "64px",
      letterSpacing: "-0.02em",
      background: "linear-gradient(45deg, #FFCC33, #FF9933)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0 0 20px rgba(0, 216, 255, 0.3)"
    },
    h2: {
      fontFamily: "Monument Extended",
      fontSize: "48px",
      letterSpacing: "0.02em",
      color: "#C0C0C0"
    },
    tech: {
      fontFamily: "JetBrains Mono",
      fontSize: "16px",
      letterSpacing: "0",
      color: "#00D8FF"
    },
    body: {
      fontFamily: "Inter",
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#F5F5F5"
    },
    accent: {
      fontFamily: "Syncopate",
      fontSize: "14px",
      letterSpacing: "0.1em",
      color: "#8B5CF6"
    }
  }
}
```

**Special Effects for Roshage:**

```typescript
// Glowing text effect for Roshage headlines
export function RoshageGlow(): Override {
  return {
    animate: {
      textShadow: [
        "0 0 20px rgba(0, 216, 255, 0.2)",
        "0 0 40px rgba(0, 216, 255, 0.4)",
        "0 0 20px rgba(0, 216, 255, 0.2)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
}
```

 