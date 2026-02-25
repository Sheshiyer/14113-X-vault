/**
 * Chapters Module - Somatic Canticles Lore
 *
 * Maps the 12 chapters to their corresponding lore elements:
 * books, lenses, protocol phases, characters, galaxies, and Fibonacci stages.
 *
 * @module @/lib/lore/chapters
 */

import type { Book } from "./books";
import type { Lens } from "./lenses";
import type { Character } from "./characters";
import type { GalacticCulture, ChakraType } from "./galactic-cultures";
import type { ProtocolPhase } from "./protocols";
import type { FibonacciStage } from "./sacred-mathematics";

/**
 * Complete chapter mapping with all lore elements
 */
export interface ChapterLoreMapping {
  /** Chapter number (1-12) */
  chapterNumber: number;
  /** Book assignment */
  book: 1 | 2 | 3;
  /** Chapter title */
  title: string;
  /** Associated lens ID */
  lensId: number;
  /** Associated lens name */
  lensName: string;
  /** Protocol phase number */
  phaseNumber: 1 | 2 | 3 | 4;
  /** Protocol phase name */
  phaseName: string;
  /** Primary character(s) */
  character: string;
  /** Associated galaxy/chakra */
  galaxy: ChakraType | "all" | "cosmic";
  /** Fibonacci stage notation */
  fibonacci: string;
  /** Fibonacci value */
  fibonacciValue: number;
  /** Chapter description */
  description: string;
}

// ============================================
// CHAPTER LORE MAPPINGS
// ============================================

/** Chapter 1: The Body Remembers */
export const chapter1: ChapterLoreMapping = {
  chapterNumber: 1,
  book: 1,
  title: "The Body Remembers",
  lensId: 3,
  lensName: "Chakra-Kosha",
  phaseNumber: 1,
  phaseName: "Tryambakaṃ",
  character: "Sona",
  galaxy: "muladhara",
  fibonacci: "F_1",
  fibonacciValue: 1,
  description:
    "Initial awakening to bio-energetic flow. The body holds memory that the mind has forgotten. Through the Chakra-Kosha lens, Sona guides the reader into somatic awareness.",
};

/** Chapter 2: First Breath */
export const chapter2: ChapterLoreMapping = {
  chapterNumber: 2,
  book: 1,
  title: "First Breath",
  lensId: 4,
  lensName: "TCM Organ Clock",
  phaseNumber: 1,
  phaseName: "Tryambakaṃ",
  character: "Gideon",
  galaxy: "muladhara",
  fibonacci: "F_2",
  fibonacciValue: 1,
  description:
    "Recognition of biological periodicity. The breath aligns with the body's innate rhythms. Gideon grounds the practice in the Root sectors, establishing the foundation.",
};

/** Chapter 3: The Architecture of Touch */
export const chapter3: ChapterLoreMapping = {
  chapterNumber: 3,
  book: 1,
  title: "The Architecture of Touch",
  lensId: 11,
  lensName: "HRV Integration",
  phaseNumber: 2,
  phaseName: "Puṣṭivardhanam",
  character: "Sona",
  galaxy: "svadhisthana",
  fibonacci: "F_3",
  fibonacciValue: 2,
  description:
    "Basic integration through heart coherence. Touch becomes a language of resonance. The Water Collective supports the ripening of awareness through embodied connection.",
};

/** Chapter 4: Witnessing the Pattern */
export const chapter4: ChapterLoreMapping = {
  chapterNumber: 4,
  book: 1,
  title: "Witnessing the Pattern",
  lensId: 1,
  lensName: "Vimshottari Dasha",
  phaseNumber: 3,
  phaseName: "Bandhanan",
  character: "Jian",
  galaxy: "manipura",
  fibonacci: "F_5",
  fibonacciValue: 5,
  description:
    "Stable individual awareness meets karmic timing. The pattern of the Vine becomes visible. The Fire Networks illuminate the deterministic bonds to be severed.",
};

/** Chapter 5: The Observer Effect */
export const chapter5: ChapterLoreMapping = {
  chapterNumber: 5,
  book: 1,
  title: "The Observer Effect",
  lensId: 2,
  lensName: "Nakshatra Engine",
  phaseNumber: 3,
  phaseName: "Bandhanan",
  character: "Corvan",
  galaxy: "anahata",
  fibonacci: "F_8",
  fibonacciValue: 8,
  description:
    "Advanced mastery through stellar resonance. Observation itself changes the observed. The Heart Sectors pulse with the recognition that we are part of the field we perceive.",
};

/** Chapter 6: Sovereignty of Authorship */
export const chapter6: ChapterLoreMapping = {
  chapterNumber: 6,
  book: 1,
  title: "Sovereignty of Authorship",
  lensId: 5,
  lensName: "Human Design",
  phaseNumber: 4,
  phaseName: "Mā'mṛtāt",
  character: "Corvan",
  galaxy: "vishuddha",
  fibonacci: "F_13",
  fibonacciValue: 13,
  description:
    "Perfect individual sovereignty through decision mechanics. The leap into authorship. The Communication Grid carries the new story into manifestation.",
};

/** Chapter 7: The Field Between Us */
export const chapter7: ChapterLoreMapping = {
  chapterNumber: 7,
  book: 2,
  title: "The Field Between Us",
  lensId: 6,
  lensName: "Gene Keys",
  phaseNumber: 1,
  phaseName: "Tryambakaṃ",
  character: "Team",
  galaxy: "anahata",
  fibonacci: "F_21",
  fibonacciValue: 21,
  description:
    "Collective emergence through frequency mutation. The field between becomes as real as the individuals. The Heart Sectors amplify the resonance between sovereign beings.",
};

/** Chapter 8: Resonant Coherence */
export const chapter8: ChapterLoreMapping = {
  chapterNumber: 8,
  book: 2,
  title: "Resonant Coherence",
  lensId: 7,
  lensName: "Enneagram",
  phaseNumber: 2,
  phaseName: "Puṣṭivardhanam",
  character: "Gideon",
  galaxy: "anahata",
  fibonacci: "F_34",
  fibonacciValue: 34,
  description:
    "Stable collective through ego-architecture awareness. The team recognizes how their types create the field. Gideon holds the coherence as the container ripens.",
};

/** Chapter 9: Collective Intelligence */
export const chapter9: ChapterLoreMapping = {
  chapterNumber: 9,
  book: 2,
  title: "Collective Intelligence",
  lensId: 8,
  lensName: "Tarot",
  phaseNumber: 3,
  phaseName: "Bandhanan",
  character: "Jian",
  galaxy: "ajna",
  fibonacci: "F_55",
  fibonacciValue: 55,
  description:
    "Advanced collective through archetypal process. The team's journey follows the hero's path. The Third Eye Sectors illuminate the collective narrative.",
};

/** Chapter 10: Entanglement */
export const chapter10: ChapterLoreMapping = {
  chapterNumber: 10,
  book: 2,
  title: "Entanglement",
  lensId: 9,
  lensName: "Numerology",
  phaseNumber: 4,
  phaseName: "Mā'mṛtāt",
  character: "Sona",
  galaxy: "sahasrara",
  fibonacci: "F_89",
  fibonacciValue: 89,
  description:
    "Perfect collective through geometric resonance. The entanglement of sovereign fields creates new possibilities. The Crown Sectors receive the download of collective wisdom.",
};

/** Chapter 11: Planetary Consciousness */
export const chapter11: ChapterLoreMapping = {
  chapterNumber: 11,
  book: 3,
  title: "Planetary Consciousness",
  lensId: 10,
  lensName: "Biorhythm Engine",
  phaseNumber: 1,
  phaseName: "Tryambakaṃ",
  character: "Team",
  galaxy: "all",
  fibonacci: "F_144",
  fibonacciValue: 144,
  description:
    "Cosmic emergence through bio-physical cycles. The team contacts planetary intelligence. All seven galaxies resonate as one field of consciousness.",
};

/** Chapter 12: The New Beginning */
export const chapter12: ChapterLoreMapping = {
  chapterNumber: 12,
  book: 3,
  title: "The New Beginning",
  lensId: 13,
  lensName: "The New Beginning",
  phaseNumber: 4,
  phaseName: "Severance/Authorship",
  character: "Team",
  galaxy: "cosmic",
  fibonacci: "F_233",
  fibonacciValue: 233,
  description:
    "Stable cosmic through narrative authorship. The 13th Lens reflects the act of creation itself. The cosmic perspective becomes the ground for a new beginning.",
};

/**
 * All 12 chapter lore mappings
 */
export const chapterLoreMappings: ChapterLoreMapping[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
  chapter11,
  chapter12,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get chapter lore mapping by chapter number
 * @param number - Chapter number (1-12)
 * @returns Chapter lore mapping or undefined if not found
 */
export function getChapterLoreByNumber(
  number: number
): ChapterLoreMapping | undefined {
  return chapterLoreMappings.find((ch) => ch.chapterNumber === number);
}

/**
 * Get chapters by book
 * @param book - Book number (1-3)
 * @returns Array of chapter lore mappings for that book
 */
export function getChaptersByBook(book: 1 | 2 | 3): ChapterLoreMapping[] {
  return chapterLoreMappings.filter((ch) => ch.book === book);
}

/**
 * Get chapters by lens ID
 * @param lensId - Lens ID (1-13)
 * @returns Array of chapter lore mappings using that lens
 */
export function getChaptersByLens(lensId: number): ChapterLoreMapping[] {
  return chapterLoreMappings.filter((ch) => ch.lensId === lensId);
}

/**
 * Get chapters by protocol phase
 * @param phaseNumber - Phase number (1-4)
 * @returns Array of chapter lore mappings in that phase
 */
export function getChaptersByPhase(
  phaseNumber: 1 | 2 | 3 | 4
): ChapterLoreMapping[] {
  return chapterLoreMappings.filter((ch) => ch.phaseNumber === phaseNumber);
}

/**
 * Get chapters by primary character
 * @param character - Character name
 * @returns Array of chapter lore mappings featuring that character
 */
export function getChaptersByCharacter(
  character: string
): ChapterLoreMapping[] {
  return chapterLoreMappings.filter(
    (ch) => ch.character.toLowerCase() === character.toLowerCase()
  );
}

/**
 * Get chapters by galaxy
 * @param galaxy - Galaxy/chakra ID
 * @returns Array of chapter lore mappings set in that galaxy
 */
export function getChaptersByGalaxy(
  galaxy: ChakraType | "all" | "cosmic"
): ChapterLoreMapping[] {
  return chapterLoreMappings.filter((ch) => ch.galaxy === galaxy);
}

/**
 * Get chapter by Fibonacci stage
 * @param fibonacci - Fibonacci notation (e.g., "F_13")
 * @returns Chapter lore mapping or undefined if not found
 */
export function getChapterByFibonacci(
  fibonacci: string
): ChapterLoreMapping | undefined {
  return chapterLoreMappings.find((ch) => ch.fibonacci === fibonacci);
}

/**
 * Get the lens ID for a chapter
 * @param chapterNumber - Chapter number (1-12)
 * @returns Lens ID or undefined if not found
 */
export function getLensIdForChapter(chapterNumber: number): number | undefined {
  return chapterLoreMappings.find((ch) => ch.chapterNumber === chapterNumber)
    ?.lensId;
}

/**
 * Get the character for a chapter
 * @param chapterNumber - Chapter number (1-12)
 * @returns Character name or undefined if not found
 */
export function getCharacterForChapter(
  chapterNumber: number
): string | undefined {
  return chapterLoreMappings.find((ch) => ch.chapterNumber === chapterNumber)
    ?.character;
}

/**
 * Get the Fibonacci stage for a chapter
 * @param chapterNumber - Chapter number (1-12)
 * @returns Fibonacci notation or undefined if not found
 */
export function getFibonacciForChapter(
  chapterNumber: number
): string | undefined {
  return chapterLoreMappings.find((ch) => ch.chapterNumber === chapterNumber)
    ?.fibonacci;
}

/**
 * Get chapters that are team-focused (character === "Team")
 * @returns Array of team-focused chapter lore mappings
 */
export function getTeamChapters(): ChapterLoreMapping[] {
  return chapterLoreMappings.filter((ch) => ch.character === "Team");
}

/**
 * Get the progression of chapters for a specific lens
 * @param lensId - Lens ID
 * @returns Array of chapters sorted by chapter number
 */
export function getLensProgression(lensId: number): ChapterLoreMapping[] {
  return getChaptersByLens(lensId).sort(
    (a, b) => a.chapterNumber - b.chapterNumber
  );
}

/**
 * Get the complete journey of a character through all chapters
 * @param character - Character name
 * @returns Array of chapter lore mappings in order
 */
export function getCharacterJourney(
  character: string
): ChapterLoreMapping[] {
  return getChaptersByCharacter(character).sort(
    (a, b) => a.chapterNumber - b.chapterNumber
  );
}

export default {
  chapterLoreMappings,
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
  chapter11,
  chapter12,
  getChapterLoreByNumber,
  getChaptersByBook,
  getChaptersByLens,
  getChaptersByPhase,
  getChaptersByCharacter,
  getChaptersByGalaxy,
  getChapterByFibonacci,
  getLensIdForChapter,
  getCharacterForChapter,
  getFibonacciForChapter,
  getTeamChapters,
  getLensProgression,
  getCharacterJourney,
};
