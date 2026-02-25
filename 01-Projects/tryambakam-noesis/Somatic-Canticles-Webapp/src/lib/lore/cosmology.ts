/**
 * Cosmology Module - Somatic Canticles Lore
 *
 * The cosmic trinity, sacred geometry, and astrotheological calendar
 * that maps the relationship between celestial and consciousness patterns.
 *
 * @module @/lib/lore/cosmology
 */

/**
 * Level of the cosmic trinity
 */
export interface CosmicTrinityLevel {
  /** Name of this level */
  name: string;
  /** Corresponding brain system */
  brainSystem: string;
  /** Associated celestial body */
  celestialBody: string;
  /** Sacred geometry form */
  sacredGeometry: string;
  /** Seasonal timing significance */
  seasonalTiming: string;
  /** Functional description */
  function: string;
  /** Zodiac signs associated with this level */
  zodiacResonance: string[];
}

/**
 * Moon phase in the astrotheological calendar
 */
export interface MoonPhase {
  /** Phase name */
  phase: string;
  /** Focus or quality of this phase */
  focus: string;
  /** Corresponding brain system */
  brainSystem: string;
  /** Description of consciousness quality */
  description: string;
}

/**
 * Sacred geometry form definition
 */
export interface SacredGeometryForm {
  /** Name of the form */
  name: string;
  /** Geometric description */
  geometry: string;
  /** Associated cosmic trinity level */
  trinityLevel: string;
  /** Symbolic meaning */
  meaning: string;
}

// ============================================
// COSMIC TRINITY LEVELS
// ============================================

/**
 * Earth Consciousness - Reptilian Brain
 * Grounding, survival, material stewardship
 */
export const earthConsciousness: CosmicTrinityLevel = {
  name: "Earth Consciousness",
  brainSystem: "Reptilian Brain",
  celestialBody: "Planeta Gaia (Earth)",
  sacredGeometry: "The Square / The Cube",
  seasonalTiming: "Winter Solstice",
  function:
    "Material stewardship, survival wisdom, gravitational center of identity",
  zodiacResonance: ["Taurus", "Virgo", "Capricorn"],
};

/**
 * Lunar Consciousness - Limbic Brain
 * Emotion, empathy, collective navigation
 */
export const lunarConsciousness: CosmicTrinityLevel = {
  name: "Lunar Consciousness",
  brainSystem: "Limbic Brain",
  celestialBody: "The Moon",
  sacredGeometry: "The Circle / The Spiral",
  seasonalTiming: "Spring Equinox",
  function:
    "Empathic interface, emotional alchemy, collective field navigation",
  zodiacResonance: ["Cancer", "Scorpio", "Pisces"],
};

/**
 * Solar Consciousness - Neocortical Brain
 * Intellect, pattern recognition, innovation
 */
export const solarConsciousness: CosmicTrinityLevel = {
  name: "Solar Consciousness",
  brainSystem: "Neocortical Brain",
  celestialBody: "The Sun",
  sacredGeometry: "The Triangle / The Pyramid",
  seasonalTiming: "Summer Solstice",
  function:
    "Pattern recognition, innovation, strategic wisdom integration",
  zodiacResonance: ["Leo", "Aries", "Sagittarius"],
};

/**
 * Stellar Consciousness - The Witness
 * Meta-awareness, system coordination, evolution
 */
export const stellarConsciousness: CosmicTrinityLevel = {
  name: "Stellar Consciousness",
  brainSystem: "The Witness",
  celestialBody: "The Sky / Fixed Stars",
  sacredGeometry: "The Dodecahedron / Infinity Symbol",
  seasonalTiming: "Autumn Equinox",
  function:
    "Meta-awareness, system coordination, species-wide evolution",
  zodiacResonance: ["Aquarius", "Gemini", "Libra"],
};

/**
 * All cosmic trinity levels in order (Earth → Lunar → Solar → Stellar)
 */
export const cosmicTrinity: CosmicTrinityLevel[] = [
  earthConsciousness,
  lunarConsciousness,
  solarConsciousness,
  stellarConsciousness,
];

// ============================================
// ASTROTHEOLOGICAL CALENDAR
// ============================================

/**
 * New Moon - Reptilian foundation
 */
export const newMoonPhase: MoonPhase = {
  phase: "New Moon",
  focus: "Reptilian foundation / Earth grounding",
  brainSystem: "Reptilian",
  description:
    "The dark moon phase of new beginnings. Time for grounding, setting foundations, and connecting to the Earth body. The seed of intention is planted in darkness.",
};

/**
 * Waxing Moon - Limbic connection
 */
export const waxingMoonPhase: MoonPhase = {
  phase: "Waxing Moon",
  focus: "Limbic connection / Heart resonance",
  brainSystem: "Limbic",
  description:
    "The growing moon phase of building and connecting. Time for emotional cultivation, heart-centered practices, and strengthening relationships. The intention gathers energy.",
};

/**
 * Full Moon - Neocortical illumination
 */
export const fullMoonPhase: MoonPhase = {
  phase: "Full Moon",
  focus: "Neocortical illumination / Mental strategy",
  brainSystem: "Neocortical",
  description:
    "The illuminated moon phase of clarity and peak energy. Time for mental focus, strategic planning, and bringing projects to completion. The intention reaches fullness.",
};

/**
 * Waning Moon - Witness integration
 */
export const waningMoonPhase: MoonPhase = {
  phase: "Waning Moon",
  focus: "Witness integration / Spirit release",
  brainSystem: "Witness",
  description:
    "The diminishing moon phase of release and integration. Time for letting go, witness meditation, and preparing for the new cycle. The intention is released to universal intelligence.",
};

/**
 * All moon phases in order
 */
export const moonPhases: MoonPhase[] = [
  newMoonPhase,
  waxingMoonPhase,
  fullMoonPhase,
  waningMoonPhase,
];

// ============================================
// SACRED GEOMETRY MAPPINGS
// ============================================

/**
 * Sacred geometry forms and their meanings
 */
export const sacredGeometryForms: SacredGeometryForm[] = [
  {
    name: "Square / Cube",
    geometry: "Four equal sides, right angles / Six square faces",
    trinityLevel: "Earth Consciousness",
    meaning:
      "Stability, foundation, material reality. The container of manifestation.",
  },
  {
    name: "Circle / Spiral",
    geometry: "Infinite curve equidistant from center / Self-similar expansion",
    trinityLevel: "Lunar Consciousness",
    meaning:
      "Cycles, flow, emotional movement. The rhythm of becoming.",
  },
  {
    name: "Triangle / Pyramid",
    geometry: "Three sides converging / Four triangular faces to apex",
    trinityLevel: "Solar Consciousness",
    meaning:
      "Direction, aspiration, focused will. The fire of transformation.",
  },
  {
    name: "Dodecahedron / Infinity",
    geometry: "Twelve pentagonal faces / Figure-eight loop",
    trinityLevel: "Stellar Consciousness",
    meaning:
      "Unity beyond duality, eternal recurrence. The witness perspective.",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a cosmic trinity level by name
 * @param name - Level name
 * @returns Trinity level or undefined if not found
 */
export function getTrinityLevelByName(
  name: string
): CosmicTrinityLevel | undefined {
  return cosmicTrinity.find(
    (level) => level.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get a cosmic trinity level by brain system
 * @param brainSystem - Brain system name
 * @returns Trinity level or undefined if not found
 */
export function getTrinityLevelByBrainSystem(
  brainSystem: string
): CosmicTrinityLevel | undefined {
  return cosmicTrinity.find(
    (level) =>
      level.brainSystem.toLowerCase() === brainSystem.toLowerCase()
  );
}

/**
 * Get a cosmic trinity level by celestial body
 * @param body - Celestial body name
 * @returns Trinity level or undefined if not found
 */
export function getTrinityLevelByCelestialBody(
  body: string
): CosmicTrinityLevel | undefined {
  return cosmicTrinity.find((level) =>
    level.celestialBody.toLowerCase().includes(body.toLowerCase())
  );
}

/**
 * Get moon phase by name
 * @param phase - Phase name
 * @returns Moon phase or undefined if not found
 */
export function getMoonPhaseByName(phase: string): MoonPhase | undefined {
  return moonPhases.find(
    (p) => p.phase.toLowerCase() === phase.toLowerCase()
  );
}

/**
 * Get moon phase by brain system
 * @param brainSystem - Brain system name
 * @returns Moon phase or undefined if not found
 */
export function getMoonPhaseByBrainSystem(
  brainSystem: string
): MoonPhase | undefined {
  return moonPhases.find(
    (p) => p.brainSystem.toLowerCase() === brainSystem.toLowerCase()
  );
}

/**
 * Get the next moon phase in the cycle
 * @param currentPhase - Current phase name
 * @returns Next moon phase
 */
export function getNextMoonPhase(currentPhase: string): MoonPhase {
  const currentIndex = moonPhases.findIndex(
    (p) => p.phase.toLowerCase() === currentPhase.toLowerCase()
  );
  const nextIndex = (currentIndex + 1) % moonPhases.length;
  return moonPhases[nextIndex];
}

/**
 * Get sacred geometry by trinity level
 * @param trinityLevel - Trinity level name
 * @returns Sacred geometry form or undefined if not found
 */
export function getSacredGeometryByTrinityLevel(
  trinityLevel: string
): SacredGeometryForm | undefined {
  return sacredGeometryForms.find((form) =>
    form.trinityLevel.toLowerCase().includes(trinityLevel.toLowerCase())
  );
}

/**
 * Get the zodiac signs for a trinity level
 * @param levelName - Trinity level name
 * @returns Array of zodiac signs
 */
export function getZodiacForTrinityLevel(levelName: string): string[] {
  const level = getTrinityLevelByName(levelName);
  return level?.zodiacResonance ?? [];
}

/**
 * Get which trinity level corresponds to a zodiac sign
 * @param sign - Zodiac sign
 * @returns Trinity level or undefined if not found
 */
export function getTrinityLevelForZodiac(
  sign: string
): CosmicTrinityLevel | undefined {
  return cosmicTrinity.find((level) =>
    level.zodiacResonance.some(
      (z) => z.toLowerCase() === sign.toLowerCase()
    )
  );
}

/**
 * Get the seasonal timing for a date
 * @param date - Date to check
 * @returns Current seasonal timing
 */
export function getSeasonalTiming(date: Date = new Date()): string {
  const month = date.getMonth();
  const day = date.getDate();

  // Approximate solstices and equinoxes
  // Winter Solstice: Dec 21 (month 11, day 21)
  // Spring Equinox: Mar 20 (month 2, day 20)
  // Summer Solstice: Jun 21 (month 5, day 21)
  // Autumn Equinox: Sep 22 (month 8, day 22)

  if ((month === 11 && day >= 21) || month === 0 || month === 1 || (month === 2 && day < 20)) {
    return "Winter Solstice";
  }
  if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 21)) {
    return "Spring Equinox";
  }
  if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 22)) {
    return "Summer Solstice";
  }
  return "Autumn Equinox";
}

/**
 * Get the trinity level for the current seasonal timing
 * @param date - Date to check
 * @returns Trinity level
 */
export function getTrinityLevelForSeason(
  date: Date = new Date()
): CosmicTrinityLevel {
  const timing = getSeasonalTiming(date);
  return (
    cosmicTrinity.find((level) => level.seasonalTiming === timing) ??
    earthConsciousness
  );
}

export default {
  cosmicTrinity,
  earthConsciousness,
  lunarConsciousness,
  solarConsciousness,
  stellarConsciousness,
  moonPhases,
  newMoonPhase,
  waxingMoonPhase,
  fullMoonPhase,
  waningMoonPhase,
  sacredGeometryForms,
  getTrinityLevelByName,
  getTrinityLevelByBrainSystem,
  getTrinityLevelByCelestialBody,
  getMoonPhaseByName,
  getMoonPhaseByBrainSystem,
  getNextMoonPhase,
  getSacredGeometryByTrinityLevel,
  getZodiacForTrinityLevel,
  getTrinityLevelForZodiac,
  getSeasonalTiming,
  getTrinityLevelForSeason,
};
