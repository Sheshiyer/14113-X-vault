/**
 * Application Constants
 * 
 * Centralized constants for the Somatic Canticles webapp.
 * All power numbers and sacred geometries defined here.
 * 
 * Power numbers: 8, 13, 19, 21, 44, 125, 152
 */

// ============================================
// POWER NUMBERS - The Sacred Constants
// ============================================

/**
 * Power numbers are fundamental frequencies that emerge from
 * the recursive structure of consciousness. They appear throughout
 * the app's design, timing, and architecture.
 */
export const POWER_NUMBERS = {
  /** Octave - Energy, activation, new beginnings */
  OCTAVE: 8,
  /** Transform - Change, alchemy, the void */
  TRANSFORM: 13,
  /** Solar - Light, leadership, revelation */
  SOLAR: 19,
  /** Build - Completion, world, manifestation */
  BUILD: 21,
  /** Witness - Structure, blueprint, foundation */
  WITNESS: 44,
  /** Unity - The ONE, creative force */
  UNITY: 125,
  /** Creative - Divine synthesis, integration */
  CREATIVE: 152,
  /** Golden Ratio - The divine proportion φ */
  GOLDEN_RATIO: 1.618033988749895,
  /** Inverse Golden Ratio - 1/φ */
  GOLDEN_RATIO_INVERSE: 0.618033988749895,
} as const;

// ============================================
// BIORHYTHM CONSTANTS
// ============================================

/**
 * Biorhythm cycle lengths in days
 * Based on research: physical (23), emotional (28), intellectual (33)
 * Spiritual (21) is a custom addition representing the build cycle
 */
export const BIORHYTHM_CYCLES = {
  /** Physical cycle - vitality, strength, coordination (23 days) */
  PHYSICAL: 23,
  /** Emotional cycle - sensitivity, creativity, mood (28 days) */
  EMOTIONAL: 28,
  /** Intellectual cycle - alertness, logic, analysis (33 days) */
  INTELLECTUAL: 33,
  /** Spiritual cycle - intuition, awareness, transcendence (21 days) */
  SPIRITUAL: 21,
} as const;

/**
 * Biorhythm cycle types
 */
export const BIORHYTHM_CYCLE_TYPES = [
  "physical",
  "emotional",
  "intellectual",
  "spiritual",
] as const;

/**
 * Biorhythm value ranges
 */
export const BIORHYTHM = {
  /** Peak threshold - above this is considered "high" */
  PEAK_THRESHOLD: 0.8,
  /** High threshold - above this is favorable */
  HIGH_THRESHOLD: 0.5,
  /** Low threshold - below this is unfavorable */
  LOW_THRESHOLD: -0.5,
  /** Critical threshold - near zero is critical */
  CRITICAL_THRESHOLD: 0.1,
  /** Minimum value (-1.0 = 100% negative) */
  MIN_VALUE: -1,
  /** Maximum value (1.0 = 100% positive) */
  MAX_VALUE: 1,
} as const;

/**
 * Cycle phases based on biorhythm values
 */
export const CYCLE_PHASES = {
  PEAK: "peak",
  HIGH: "high",
  NORMAL: "normal",
  LOW: "low",
  CRITICAL: "critical",
} as const;

// ============================================
// CHAPTER CONSTANTS
// ============================================

/** Total number of chapters in the trilogy */
export const TOTAL_CHAPTERS = 12;

/** Number of books in the trilogy */
export const TOTAL_BOOKS = 3;

/** Chapters per book */
export const CHAPTERS_PER_BOOK = 4;

/** Chapters per biorhythm cycle */
export const CHAPTERS_PER_CYCLE = 3;

/** Number of biorhythm cycles */
export const TOTAL_CYCLES = 4;

/**
 * Book names and themes
 */
export const BOOKS = {
  BOOK_1: {
    id: "book1",
    name: "Genesis",
    theme: "Awakening and Foundation",
    description: "The first four canticles establish the foundation of somatic practice.",
    chapters: [1, 2, 3, 4],
    color: "octave",
  },
  BOOK_2: {
    id: "book2",
    name: "Emergence",
    theme: "Integration and Structure",
    description: "The middle canticles build upon the foundation, weaving complexity.",
    chapters: [5, 6, 7, 8],
    color: "witness",
  },
  BOOK_3: {
    id: "book3",
    name: "Transcendence",
    theme: "Synthesis and Liberation",
    description: "The final canticles culminate in the integration of all dimensions.",
    chapters: [9, 10, 11, 12],
    color: "creative",
  },
} as const;

/**
 * Biorhythm cycle to chapter mapping
 */
export const CYCLE_CHAPTERS = {
  physical: [1, 2, 3],
  emotional: [4, 5, 6],
  intellectual: [7, 8, 9],
  spiritual: [10, 11, 12],
} as const;

/**
 * Chapter unlock thresholds
 * Minimum biorhythm value required to unlock each chapter
 */
export const CHAPTER_UNLOCK_THRESHOLDS: Record<number, number> = {
  1: 0,      // Chapter 1 always unlocked
  2: 0.21,   // Chapter 2: 21% positive
  3: 0.44,   // Chapter 3: 44% positive
  4: 0.21,   // Chapter 4: Emotional cycle begins
  5: 0.44,
  6: 0.44,
  7: 0.21,   // Intellectual cycle begins
  8: 0.44,
  9: 0.44,
  10: 0.21,  // Spiritual cycle begins
  11: 0.44,
  12: 0.8,   // Final chapter requires peak state
} as const;

/**
 * Default chapter duration estimates (minutes)
 */
export const CHAPTER_DURATIONS: Record<number, number> = {
  1: 19,   // Solar number - introduction
  2: 21,   // Build number - grounding
  3: 21,   // Build number - movement
  4: 19,   // Ocean of feeling
  5: 21,   // Heart's resonance
  6: 21,   // Shadow dance
  7: 19,   // Mind's mirror
  8: 21,   // Pattern weaver
  9: 21,   // Wisdom body
  10: 19,  // The threshold
  11: 21,  // Sacred return
  12: 21,  // Eternal canticle
} as const;

// ============================================
// APP METADATA
// ============================================

export const APP = {
  /** Application name */
  NAME: "Somatic Canticles",
  /** Short/tagline name */
  SHORT_NAME: "Canticles",
  /** Application description */
  DESCRIPTION: "A somatic journey through twelve canticles, guided by your body's natural rhythms.",
  /** Application tagline */
  TAGLINE: "Listen to the wisdom of your body",
  /** Current version */
  VERSION: "0.1.0",
  /** Build number */
  BUILD: process.env.CF_PAGES_COMMIT_SHA?.slice(0, 8) || "dev",
  /** Homepage URL */
  URL: process.env.NEXT_PUBLIC_APP_URL || "https://somatic-canticles.com",
  /** Support email */
  SUPPORT_EMAIL: "support@somatic-canticles.com",
  /** Copyright year */
  COPYRIGHT_YEAR: new Date().getFullYear(),
} as const;

/**
 * SEO and social metadata
 */
export const SEO = {
  /** Default page title template */
  TITLE_TEMPLATE: "%s | Somatic Canticles",
  /** Default meta description */
  DEFAULT_DESCRIPTION: APP.DESCRIPTION,
  /** Default Open Graph image */
  OG_IMAGE: "/images/og-default.png",
  /** Twitter handle */
  TWITTER_HANDLE: "@somaticcanticles",
  /** Theme color */
  THEME_COLOR: "#0A0A0F",
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================

/**
 * Keys for localStorage/sessionStorage
 * All prefixed to avoid collisions
 */
export const STORAGE_KEYS = {
  /** Prefix for all app storage */
  PREFIX: "sc:",
  /** User preferences */
  PREFERENCES: "sc:preferences",
  /** Biorhythm birth date (temporary, until saved to account) */
  BIORHYTHM_BIRTH_DATE: "sc:biorhythm:birthDate",
  /** Biorhythm timezone */
  BIORHYTHM_TIMEZONE: "sc:biorhythm:timezone",
  /** Last read biorhythm reading */
  BIORHYTHM_LAST_READING: "sc:biorhythm:lastReading",
  /** Chapter progress (local cache) */
  CHAPTER_PROGRESS: "sc:chapter:progress",
  /** Last visited chapter */
  LAST_CHAPTER: "sc:chapter:last",
  /** Audio player state */
  AUDIO_STATE: "sc:audio:state",
  /** Audio volume preference */
  AUDIO_VOLUME: "sc:audio:volume",
  /** Onboarding completion flag */
  ONBOARDING_COMPLETED: "sc:onboarding:completed",
  /** Theme preference */
  THEME: "sc:theme",
  /** Consent preferences */
  CONSENT: "sc:consent",
  /** Session ID for anonymous users */
  SESSION_ID: "sc:session:id",
  /** Last active timestamp (for streak calculation) */
  LAST_ACTIVE: "sc:session:lastActive",
} as const;

// ============================================
// API ENDPOINTS
// ============================================

/** Base API URL */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  // User
  USER: {
    PROFILE: "/api/user/profile",
    PREFERENCES: "/api/user/preferences",
    DELETE: "/api/user/delete",
  },
  // Biorhythm
  BIORHYTHM: {
    READING: "/api/biorhythm/reading",
    FORECAST: "/api/biorhythm/forecast",
    PROFILE: "/api/biorhythm/profile",
  },
  // Chapters
  CHAPTERS: {
    LIST: "/api/chapters",
    DETAIL: (id: string) => `/api/chapters/${id}`,
    PROGRESS: "/api/chapters/progress",
    UNLOCK: (id: string) => `/api/chapters/${id}/unlock`,
    COMPLETE: (id: string) => `/api/chapters/${id}/complete`,
  },
  // Audio
  AUDIO: {
    STREAM: (chapterId: string) => `/api/audio/${chapterId}/stream`,
    METADATA: (chapterId: string) => `/api/audio/${chapterId}/metadata`,
  },
  // Progress
  PROGRESS: {
    SYNC: "/api/progress/sync",
    STREAK: "/api/progress/streak",
  },
} as const;

// ============================================
// ROUTES
// ============================================

/**
 * Application routes
 */
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login/",
  SIGNUP: "/signup/",
  FORGOT_PASSWORD: "/forgot-password/",
  RESET_PASSWORD: "/reset-password/",
  ONBOARDING: "/onboarding/",
  
  // Protected
  DASHBOARD: "/dashboard/",
  CHAPTERS: "/chapters/",
  CHAPTER: (id: string | number) => `/chapters/chapter-${id}/`,
  PROFILE: "/profile/",
  SETTINGS: "/settings/",
  
  // Legal
  PRIVACY: "/privacy/",
  TERMS: "/terms/",
} as const;

// ============================================
// ANIMATION TIMING
// ============================================

/**
 * Animation durations in milliseconds
 * Based on power numbers for sacred timing
 */
export const ANIMATION_DURATIONS = {
  /** Octave beat - 800ms */
  OCTAVE: 800,
  /** Transform cycle - 1300ms */
  TRANSFORM: 1300,
  /** Solar cycle - 1900ms */
  SOLAR: 1900,
  /** Build completion - 2100ms */
  BUILD: 2100,
  /** Witness attunement - 4400ms */
  WITNESS: 4400,
  /** Unity meditation - 12500ms */
  UNITY: 12500,
  /** Creative synthesis - 15200ms */
  CREATIVE: 15200,
  /** Quick feedback - 150ms */
  QUICK: 150,
  /** Standard transition - 300ms */
  STANDARD: 300,
  /** Slow transition - 500ms */
  SLOW: 500,
} as const;

/**
 * Animation easing functions
 */
export const EASING = {
  /** Golden ratio bezier - sacred timing */
  SACRED: "cubic-bezier(0.618, 0.382, 0.382, 0.618)",
  /** Unlock sequence easing */
  UNLOCK: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Transform/entrance easing */
  TRANSFORM: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Standard ease */
  EASE: "ease",
  /** Linear */
  LINEAR: "linear",
} as const;

// ============================================
// DEBOUNCE & THROTTLE TIMING
// ============================================

/**
 * Debounce delays in milliseconds
 */
export const DEBOUNCE = {
  /** Quick debounce for rapid inputs */
  QUICK: 150,
  /** Standard debounce for search inputs */
  STANDARD: 300,
  /** Slow debounce for expensive operations */
  SLOW: 500,
  /** Very slow for API calls */
  API: 800,
} as const;

/**
 * Throttle intervals in milliseconds
 */
export const THROTTLE = {
  /** Rapid updates (progress tracking) */
  RAPID: 1000,
  /** Standard updates */
  STANDARD: 5000,
  /** Slow updates (sync) */
  SLOW: 30000,
} as const;

// ============================================
// STREAK & GAMIFICATION
// ============================================

/**
 * Streak calculation constants
 */
export const STREAK = {
  /** Hours within which activity counts for streak */
  WINDOW_HOURS: 48,
  /** Minimum session duration to count (minutes) */
  MIN_SESSION_MINUTES: 5,
  /** Grace period after missing a day (hours) */
  GRACE_PERIOD_HOURS: 24,
} as const;

// ============================================
// AUDIO CONSTANTS
// ============================================

/**
 * Audio playback constants
 */
export const AUDIO = {
  /** Default volume (0-1) */
  DEFAULT_VOLUME: 0.8,
  /** Minimum volume */
  MIN_VOLUME: 0,
  /** Maximum volume */
  MAX_VOLUME: 1,
  /** Volume step for adjustments */
  VOLUME_STEP: 0.1,
  /** Default playback rate */
  DEFAULT_RATE: 1,
  /** Minimum playback rate */
  MIN_RATE: 0.5,
  /** Maximum playback rate */
  MAX_RATE: 2,
  /** Progress save interval (seconds) */
  SAVE_INTERVAL: 10,
  /** Preload buffer (seconds) */
  PRELOAD_BUFFER: 30,
} as const;

// ============================================
// UI CONSTANTS
// ============================================

/**
 * Breakpoint values in pixels
 */
export const BREAKPOINTS = {
  /** Extra small */
  XS: 320,
  /** Small */
  SM: 640,
  /** Medium */
  MD: 768,
  /** Large */
  LG: 1024,
  /** Extra large */
  XL: 1280,
  /** 2X large */
  XXL: 1536,
} as const;

/**
 * Z-index scale
 */
export const Z_INDEX = {
  /** Base */
  BASE: 0,
  /** Dropdowns */
  DROPDOWN: 8,
  /** Sticky elements */
  STICKY: 13,
  /** Fixed elements */
  FIXED: 19,
  /** Modal backdrop */
  MODAL_BACKDROP: 21,
  /** Modal */
  MODAL: 44,
  /** Popover */
  POPOVER: 44,
  /** Tooltip */
  TOOLTIP: 125,
  /** Toast notifications */
  TOAST: 152,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

/**
 * Standard error messages
 */
export const ERROR_MESSAGES = {
  /** Generic error */
  GENERIC: "Something went wrong. Please try again.",
  /** Network error */
  NETWORK: "Connection lost. Please check your internet connection.",
  /** Unauthorized */
  UNAUTHORIZED: "Please sign in to continue.",
  /** Forbidden */
  FORBIDDEN: "You don't have permission to access this.",
  /** Not found */
  NOT_FOUND: "The requested content was not found.",
  /** Validation error */
  VALIDATION: "Please check your input and try again.",
  /** Server error */
  SERVER: "Server error. Please try again later.",
  /** Timeout */
  TIMEOUT: "Request timed out. Please try again.",
  /** Rate limited */
  RATE_LIMITED: "Too many requests. Please wait a moment.",
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

/**
 * Standard success messages
 */
export const SUCCESS_MESSAGES = {
  /** Chapter unlocked */
  CHAPTER_UNLOCKED: "A new canticle awaits your discovery.",
  /** Chapter completed */
  CHAPTER_COMPLETED: "You have integrated this canticle's wisdom.",
  /** Progress saved */
  PROGRESS_SAVED: "Your journey has been recorded.",
  /** Settings updated */
  SETTINGS_UPDATED: "Your preferences have been saved.",
  /** Profile updated */
  PROFILE_UPDATED: "Your profile has been updated.",
  /** Password reset sent */
  PASSWORD_RESET_SENT: "Check your email for reset instructions.",
  /** Password changed */
  PASSWORD_CHANGED: "Your password has been updated.",
  /** Account created */
  ACCOUNT_CREATED: "Welcome to the journey. Your account is ready.",
} as const;

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  POWER_NUMBERS,
  BIORHYTHM_CYCLES,
  BIORHYTHM_CYCLE_TYPES,
  BIORHYTHM,
  CYCLE_PHASES,
  TOTAL_CHAPTERS,
  TOTAL_BOOKS,
  CHAPTERS_PER_BOOK,
  CHAPTERS_PER_CYCLE,
  TOTAL_CYCLES,
  BOOKS,
  CYCLE_CHAPTERS,
  CHAPTER_UNLOCK_THRESHOLDS,
  CHAPTER_DURATIONS,
  APP,
  SEO,
  STORAGE_KEYS,
  API_BASE_URL,
  API_ENDPOINTS,
  ROUTES,
  ANIMATION_DURATIONS,
  EASING,
  DEBOUNCE,
  THROTTLE,
  STREAK,
  AUDIO,
  BREAKPOINTS,
  Z_INDEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
