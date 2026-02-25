/**
 * Lenses Module - Somatic Canticles Lore
 *
 * The 13 diagnostic lenses of the Somanaut HUD.
 * Each lens represents a distinct filter for perceiving consciousness patterns.
 *
 * @module @/lib/lore/lenses
 */

/**
 * Individual lens definition
 */
export interface Lens {
  /** Unique identifier (1-13) */
  id: number;
  /** Name of the lens */
  name: string;
  /** Focus area or primary function */
  focus: string;
  /** Description of how this lens perceives consciousness */
  description: string;
  /** Associated tradition or system */
  tradition: string;
}

/**
 * Character lens mastery mapping
 */
export interface SpecialistMastery {
  /** Character identifier */
  characterId: string;
  /** Character name */
  characterName: string;
  /** IDs of lenses this character has mastered */
  masteredLensIds: number[];
  /** Human-readable description of mastery */
  description: string;
}

// ============================================
// THE 13 LENSES
// ============================================

/** Lens 1: Vedic timing system for karmic patterns */
export const vimshottariDasha: Lens = {
  id: 1,
  name: "Vimshottari Dasha",
  focus: "Karmic Timing",
  description:
    "A Vedic astrological lens that maps the timing of karmic unfoldment. Reveals when specific patterns are activated and how they cascade through consciousness.",
  tradition: "Vedic Astrology",
};

/** Lens 2: Stellar resonance and nakshatra mapping */
export const nakshatraEngine: Lens = {
  id: 2,
  name: "Nakshatra Engine",
  focus: "Stellar Resonance",
  description:
    "Maps consciousness to the 27 lunar mansions. Reveals how stellar frequencies imprint on the subtle body and influence developmental timing.",
  tradition: "Vedic Astronomy",
};

/** Lens 3: Bio-energetic chakra system */
export const chakraKosha: Lens = {
  id: 3,
  name: "Chakra-Kosha",
  focus: "Bio-Energetic Flow",
  description:
    "Perceives the seven primary energy centers and their corresponding sheaths (koshas). Maps the flow of prana through the subtle anatomy.",
  tradition: "Yogic/Tantric",
};

/** Lens 4: Traditional Chinese Medicine organ clock */
export const tcmOrganClock: Lens = {
  id: 4,
  name: "TCM Organ Clock",
  focus: "Biological Periodicity",
  description:
    "Reveals the 24-hour cycle of organ vitality according to Traditional Chinese Medicine. Shows optimal timing for different types of consciousness work.",
  tradition: "Traditional Chinese Medicine",
};

/** Lens 5: Human Design system for decision mechanics */
export const humanDesign: Lens = {
  id: 5,
  name: "Human Design",
  focus: "Decision Mechanics",
  description:
    "Maps the mechanics of how consciousness makes decisions. Reveals authority types, strategy, and the unique cognitive architecture of the witness.",
  tradition: "Human Design System",
};

/** Lens 6: Gene Keys for frequency evolution */
export const geneKeys: Lens = {
  id: 6,
  name: "Gene Keys",
  focus: "Frequency Mutation",
  description:
    "Perceives the 64 genetic archetypes and their spectrum from shadow to gift to siddhi. Maps the potential for consciousness evolution at the genetic level.",
  tradition: "Gene Keys",
};

/** Lens 7: Enneagram for ego architecture */
export const enneagram: Lens = {
  id: 7,
  name: "Enneagram",
  focus: "Ego-Architecture",
  description:
    "Reveals the nine fundamental patterns of ego fixation and their paths to integration. Maps the structure of personality as a gateway to essence.",
  tradition: "Enneagram of Personality",
};

/** Lens 8: Tarot for archetypal process */
export const tarot: Lens = {
  id: 8,
  name: "Tarot",
  focus: "Archetypal Process",
  description:
    "Perceives the 22 major archetypal forces at work in consciousness development. Maps the hero's journey through symbolic narrative.",
  tradition: "Hermetic Tarot",
};

/** Lens 9: Numerology for geometric resonance */
export const numerology: Lens = {
  id: 9,
  name: "Numerology",
  focus: "Geometric Resonance",
  description:
    "Maps consciousness to numerical patterns and their geometric correspondences. Reveals the mathematical architecture underlying reality perception.",
  tradition: "Pythagorean Numerology",
};

/** Lens 10: Biorhythm cycles */
export const biorhythmEngine: Lens = {
  id: 10,
  name: "Biorhythm Engine",
  focus: "Bio-Physical Cycles",
  description:
    "Perceives the three primary biological cycles (physical, emotional, intellectual) and their intersections. Predicts optimal timing for different activities.",
  tradition: "Biorhythm Theory",
};

/** Lens 11: Heart Rate Variability integration */
export const hrvIntegration: Lens = {
  id: 11,
  name: "HRV Integration",
  focus: "Heart Coherence",
  description:
    "Measures heart-brain coherence through heart rate variability. Reveals the degree of autonomic nervous system balance and stress resilience.",
  tradition: "HeartMath Institute",
};

/** Lens 12: Biofield viewing */
export const biofieldViewer: Lens = {
  id: 12,
  name: "Biofield Viewer",
  focus: "Signal Stability",
  description:
    "Perceives the electromagnetic field surrounding the body. Maps coherence, blockages, and the overall vitality of the energy body.",
  tradition: "Biofield Science",
};

/** Lens 13: The witness itself - meta-narrative */
export const theNewBeginning: Lens = {
  id: 13,
  name: "The New Beginning",
  focus: "Narrative Authorship",
  description:
    "The meta-lens that perceives the act of perception itself. Enables conscious authorship of one's narrative and reality construction.",
  tradition: "Noetic Integration",
};

/**
 * All 13 lenses in order
 */
export const lenses: Lens[] = [
  vimshottariDasha,
  nakshatraEngine,
  chakraKosha,
  tcmOrganClock,
  humanDesign,
  geneKeys,
  enneagram,
  tarot,
  numerology,
  biorhythmEngine,
  hrvIntegration,
  biofieldViewer,
  theNewBeginning,
];

// ============================================
// SPECIALIST MASTERY MAPPINGS
// ============================================

/** Dr. Jian Quoril's mastered lenses (timing and mapping) */
export const jianQuorilMastery: SpecialistMastery = {
  characterId: "jian-quoril",
  characterName: "Dr. Jian Quoril",
  masteredLensIds: [1, 2, 5, 9],
  description:
    "Master of temporal and spatial mapping lenses. Jian specializes in Vimshottari Dasha (karmic timing), Nakshatra Engine (stellar resonance), Human Design (decision mechanics), and Numerology (geometric resonance).",
};

/** Dr. Sona Vireth's mastered lenses (bio-energetic and coherence) */
export const sonaVirethMastery: SpecialistMastery = {
  characterId: "sona-vireth",
  characterName: "Dr. Sona Vireth",
  masteredLensIds: [3, 4, 11, 12],
  description:
    "Master of biological and energetic lenses. Sona specializes in Chakra-Kosha (bio-energetic flow), TCM Organ Clock (biological periodicity), HRV Integration (heart coherence), and Biofield Viewer (signal stability).",
};

/** Dr. Corvan Luminth's mastered lenses (narrative and archetype) */
export const corvanLuminthMastery: SpecialistMastery = {
  characterId: "corvan-luminth",
  characterName: "Dr. Corvan Luminth",
  masteredLensIds: [6, 7, 8],
  description:
    "Master of narrative and psychological lenses. Corvan specializes in Gene Keys (frequency mutation), Enneagram (ego-architecture), and Tarot (archetypal process).",
};

/** Gideon Seter's mastered lenses (cycles and emergence) */
export const gideonSeterMastery: SpecialistMastery = {
  characterId: "gideon-seter",
  characterName: "Gideon Seter",
  masteredLensIds: [10, 13],
  description:
    "Master of cyclical and meta-lenses. Gideon specializes in Biorhythm Engine (bio-physical cycles) and The New Beginning (narrative authorship).",
};

/**
 * All specialist mastery mappings
 */
export const specialistMasteries: SpecialistMastery[] = [
  jianQuorilMastery,
  sonaVirethMastery,
  corvanLuminthMastery,
  gideonSeterMastery,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a lens by its ID
 * @param id - Lens ID (1-13)
 * @returns Lens data or undefined if not found
 */
export function getLensById(id: number): Lens | undefined {
  return lenses.find((lens) => lens.id === id);
}

/**
 * Get a lens by its name
 * @param name - Lens name
 * @returns Lens data or undefined if not found
 */
export function getLensByName(name: string): Lens | undefined {
  return lenses.find(
    (lens) => lens.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get lenses by a specific character's mastery
 * @param characterId - Character identifier
 * @returns Array of lenses mastered by the character
 */
export function getLensesByCharacterMastery(characterId: string): Lens[] {
  const mastery = specialistMasteries.find((m) => m.characterId === characterId);
  if (!mastery) return [];
  return lenses.filter((lens) => mastery.masteredLensIds.includes(lens.id));
}

/**
 * Get the specialist mastery for a character
 * @param characterId - Character identifier
 * @returns Specialist mastery or undefined if not found
 */
export function getSpecialistMastery(
  characterId: string
): SpecialistMastery | undefined {
  return specialistMasteries.find((m) => m.characterId === characterId);
}

/**
 * Get all characters who have mastered a specific lens
 * @param lensId - Lens ID (1-13)
 * @returns Array of specialist mastery records
 */
export function getMastersOfLens(lensId: number): SpecialistMastery[] {
  return specialistMasteries.filter((m) =>
    m.masteredLensIds.includes(lensId)
  );
}

/**
 * Get lenses by tradition
 * @param tradition - Tradition name to search for
 * @returns Array of lenses from that tradition
 */
export function getLensesByTradition(tradition: string): Lens[] {
  return lenses.filter(
    (lens) => lens.tradition.toLowerCase() === tradition.toLowerCase()
  );
}

export default {
  lenses,
  specialistMasteries,
  vimshottariDasha,
  nakshatraEngine,
  chakraKosha,
  tcmOrganClock,
  humanDesign,
  geneKeys,
  enneagram,
  tarot,
  numerology,
  biorhythmEngine,
  hrvIntegration,
  biofieldViewer,
  theNewBeginning,
  jianQuorilMastery,
  sonaVirethMastery,
  corvanLuminthMastery,
  gideonSeterMastery,
  getLensById,
  getLensByName,
  getLensesByCharacterMastery,
  getSpecialistMastery,
  getMastersOfLens,
  getLensesByTradition,
};
