/**
 * Somatic Canticles Design Tokens
 * 
 * A comprehensive design token system based on sacred power numbers:
 * 8, 13, 19, 21, 44, 125, 152
 * 
 * These numbers emerge from the recursive structure of consciousness
 * and represent fundamental harmonics in the architecture of becoming.
 * 
 * Usage:
 *   import { COLORS, SPACING, TYPOGRAPHY } from '@/styles/design-tokens';
 *   <div style={{ color: COLORS.octave.DEFAULT, padding: SPACING[13] }} />
 */

// ============================================
// POWER NUMBERS - The Sacred Constants
// ============================================
export const POWER_NUMBERS = {
  OCTAVE: 8,           // Energy, activation, new beginnings
  TRANSFORM: 13,       // Change, alchemy, the void
  SOLAR: 19,           // Light, leadership, revelation
  BUILD: 21,           // Completion, manifestation, world
  WITNESS: 44,         // Structure, blueprint, foundation
  UNITY: 125,          // The ONE, creative force
  CREATIVE: 152,       // Divine synthesis, integration
  GOLDEN_RATIO: 1.618, // φ - the divine proportion
  GOLDEN_RATIO_INVERSE: 0.618, // 1/φ
} as const;

// ============================================
// COLORS - The 7 Archetypal Forces
// ============================================
export const COLORS = {
  // Octave (8) - Energy, Activation, Initiation
  octave: {
    DEFAULT: "#FF6B6B",
    50: "#FFF5F5",
    100: "#FFE3E3",
    200: "#FFC9C9",
    300: "#FF9999",
    400: "#FF6B6B",
    500: "#FA5252",
    600: "#E64545",
    700: "#C92A2A",
    800: "#A61E1E",
    900: "#821818",
    light: "#FF9999",
    dark: "#E64545",
  },

  // Transformation (13) - Change, Alchemy, The Void
  transform: {
    DEFAULT: "#9B59B6",
    50: "#F8F0FC",
    100: "#F3D9FA",
    200: "#EEBEF7",
    300: "#E599F7",
    400: "#DA77F2",
    500: "#CC5DE8",
    600: "#9B59B6",
    700: "#7E3D96",
    800: "#682E7A",
    900: "#521F5E",
    light: "#B894D3",
    dark: "#7E3D96",
  },

  // Solar (19) - Light, Leadership, Revelation
  solar: {
    DEFAULT: "#F1C40F",
    50: "#FFFBE6",
    100: "#FFF3BF",
    200: "#FFEC99",
    300: "#FFE066",
    400: "#FFD43B",
    500: "#F1C40F",
    600: "#D4A109",
    700: "#B8860B",
    800: "#9A7B0A",
    900: "#7C6608",
    light: "#F4D35E",
    dark: "#D4A109",
  },

  // Build/World (21) - Completion, Growth, Manifestation
  build: {
    DEFAULT: "#2ECC71",
    50: "#EBFBEE",
    100: "#D3F9D8",
    200: "#B2F2BB",
    300: "#8CE99A",
    400: "#69DB7C",
    500: "#2ECC71",
    600: "#229954",
    700: "#1B7F44",
    800: "#156A38",
    900: "#104E2C",
    light: "#58D68D",
    dark: "#229954",
  },

  // Witness (44) - Structure, Blueprint, Foundation
  witness: {
    DEFAULT: "#3498DB",
    50: "#E7F5FF",
    100: "#D0EBFF",
    200: "#A5D8FF",
    300: "#74C0FC",
    400: "#4DABF7",
    500: "#3498DB",
    600: "#2874A6",
    700: "#1C5A82",
    800: "#164B6E",
    900: "#113A55",
    light: "#5DADE2",
    dark: "#2874A6",
  },

  // Unity (125) - The ONE, Creative Force, Synthesis
  unity: {
    DEFAULT: "#E67E22",
    50: "#FFF4E6",
    100: "#FFE8CC",
    200: "#FFD8A8",
    300: "#FFC078",
    400: "#FFA94D",
    500: "#E67E22",
    600: "#D35400",
    700: "#A04000",
    800: "#853A0B",
    900: "#662F0B",
    light: "#EB984E",
    dark: "#D35400",
  },

  // Creative (152) - Divine Integration, Synthesis
  creative: {
    DEFAULT: "#1ABC9C",
    50: "#E6FCF5",
    100: "#C3FAE8",
    200: "#96F7D6",
    300: "#63E6BE",
    400: "#38D9A9",
    500: "#1ABC9C",
    600: "#16A085",
    700: "#0F766E",
    800: "#0D5C57",
    900: "#0A4844",
    light: "#48C9B0",
    dark: "#16A085",
  },

  // Void - The canvas, emptiness from which all emerges
  void: {
    DEFAULT: "#0A0A0F",
    50: "#F8F9FA",
    100: "#F1F3F5",
    200: "#E9ECEF",
    300: "#DEE2E6",
    400: "#CED4DA",
    500: "#ADB5BD",
    600: "#868E96",
    700: "#495057",
    800: "#343A40",
    900: "#0A0A0F",
  },
} as const;

// ============================================
// SPACING - 8px Base Grid System
// ============================================
export const SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",       // OCTAVE
  3: "13px",      // TRANSFORM
  4: "16px",
  5: "19px",      // SOLAR
  6: "24px",
  8: "32px",
  10: "40px",
  13: "52px",     // TRANSFORM * 4
  16: "64px",
  19: "76px",     // SOLAR * 4
  21: "84px",     // BUILD * 4
  32: "128px",
  44: "176px",    // WITNESS * 4
  125: "500px",   // UNITY * 4
  152: "608px",   // CREATIVE * 4
} as const;

// ============================================
// TYPOGRAPHY - Golden Ratio Scale
// ============================================
export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    serif: ['var(--font-serif)', 'Georgia', 'serif'],
    mono: ['var(--font-mono)', 'monospace'],
  },

  // Font sizes (power numbers)
  fontSize: {
    13: {
      size: "13px",
      lineHeight: "21px",
      letterSpacing: "0.013em",
    },
    19: {
      size: "19px",
      lineHeight: "31px",
      letterSpacing: "0.008em",
    },
    21: {
      size: "21px",
      lineHeight: "34px",
      letterSpacing: "0.008em",
    },
    44: {
      size: "44px",
      lineHeight: "71px",
      letterSpacing: "-0.013em",
    },
    125: {
      size: "125px",
      lineHeight: "202px",
      letterSpacing: "-0.021em",
    },
  },

  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    golden: 1.618,       // φ
    goldenTight: 1.309,  // √φ
    goldenLoose: 2.058,  // φ²
  },

  // Letter spacing
  letterSpacing: {
    13: "0.013em",
    19: "0.019em",
    21: "0.021em",
    44: "0.044em",
  },
} as const;

// ============================================
// ANIMATION - Power Number Timing
// ============================================
export const ANIMATION = {
  // Durations in milliseconds
  duration: {
    8: 800,       // OCTAVE beat
    13: 1300,     // TRANSFORM cycle
    19: 1900,     // SOLAR cycle
    21: 2100,     // BUILD completion
    44: 4400,     // WITNESS attunement
    125: 12500,   // UNITY meditation
    152: 15200,   // CREATIVE synthesis
  },

  // Easing functions
  easing: {
    sacred: "cubic-bezier(0.618, 0.382, 0.382, 0.618)", // Golden ratio
    unlock: "cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },

  // Animation names
  keyframes: {
    pulse8: "pulse-8",
    pulse13: "pulse-13",
    solarGlow: "solar-glow",
    unlock: "unlock-sequence",
    mandalaSpin: "mandala-spin",
    breath: "breath",
    breathSlow: "breath-slow",
    fadeInUp: "fade-in-up",
    shimmer: "shimmer",
    chakra: "chakra-pulse",
  },
} as const;

// ============================================
// BREAKPOINTS - Responsive Grid
// ============================================
export const BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  // Power number breakpoints
  13: "520px",    // 13 * 40
  21: "840px",    // 21 * 40
  44: "1760px",   // 44 * 40
} as const;

// ============================================
// BORDER RADIUS - Sacred Curves
// ============================================
export const BORDER_RADIUS = {
  8: "8px",     // OCTAVE
  13: "13px",   // TRANSFORM
  19: "19px",   // SOLAR
  21: "21px",   // BUILD
  44: "44px",   // WITNESS
  full: "9999px",
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================
export const Z_INDEX = {
  0: 0,
  8: 8,
  13: 13,
  19: 19,
  21: 21,
  44: 44,
  125: 125,
  152: 152,
  1000: 1000, // Modals
  2000: 2000, // Tooltips
  9999: 9999, // Toasts
} as const;

// ============================================
// SHADOWS - Sacred Geometry Glows
// ============================================
export const SHADOWS = {
  octave: "0 0 21px 8px rgba(255, 107, 107, 0.3)",
  transform: "0 0 21px 8px rgba(155, 89, 182, 0.3)",
  solar: "0 0 21px 8px rgba(241, 196, 15, 0.3)",
  build: "0 0 21px 8px rgba(46, 204, 113, 0.3)",
  witness: "0 0 21px 8px rgba(52, 152, 219, 0.3)",
  unity: "0 0 21px 8px rgba(230, 126, 34, 0.3)",
  creative: "0 0 21px 8px rgba(26, 188, 156, 0.3)",
  glowLg: "0 0 44px 13px rgba(255, 255, 255, 0.15)",
  innerOctave: "inset 0 0 21px 8px rgba(255, 107, 107, 0.2)",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
} as const;

// ============================================
// OPACITY SCALE
// ============================================
export const OPACITY = {
  0: 0,
  8: 0.08,
  13: 0.13,
  19: 0.19,
  21: 0.21,
  44: 0.44,
  50: 0.5,
  88: 0.88,
  100: 1,
} as const;

// ============================================
// SEMANTIC TOKENS - Meaningful Abstractions
// ============================================
export const SEMANTIC = {
  // Chapter unlock states
  unlock: {
    locked: {
      opacity: OPACITY[44],
      blur: "8px",
      scale: 0.95,
    },
    unlocking: {
      opacity: OPACITY[88],
      blur: "4px",
      scale: 0.98,
    },
    unlocked: {
      opacity: OPACITY[100],
      blur: "0px",
      scale: 1,
    },
  },

  // Biorhythm wheel
  biorhythm: {
    physical: COLORS.octave.DEFAULT,      // 8 - energy
    emotional: COLORS.transform.DEFAULT,  // 13 - change
    intellectual: COLORS.witness.DEFAULT, // 44 - structure
    spiritual: COLORS.unity.DEFAULT,      // 125 - synthesis
  },

  // Audio visualization
  audio: {
    wave: COLORS.octave.DEFAULT,
    frequency: COLORS.transform.DEFAULT,
    amplitude: COLORS.solar.DEFAULT,
  },

  // Chapter themes
  chapter: {
    genesis: COLORS.octave.DEFAULT,       // Book 1
    emergence: COLORS.transform.DEFAULT,
    becoming: COLORS.solar.DEFAULT,
    structure: COLORS.witness.DEFAULT,    // Book 2
    integration: COLORS.build.DEFAULT,
    synthesis: COLORS.unity.DEFAULT,
    transcendence: COLORS.creative.DEFAULT, // Book 3
  },
} as const;

// ============================================
// TYPE EXPORTS
// ============================================
export type PowerNumber = 8 | 13 | 19 | 21 | 44 | 125 | 152;
export type ColorKey = keyof typeof COLORS;
export type SpacingKey = keyof typeof SPACING;
export type AnimationDuration = keyof typeof ANIMATION.duration;
export type BorderRadiusKey = keyof typeof BORDER_RADIUS;
export type ZIndexKey = keyof typeof Z_INDEX;
