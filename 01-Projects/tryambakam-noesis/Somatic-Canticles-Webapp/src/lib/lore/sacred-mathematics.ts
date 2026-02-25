/**
 * Sacred Mathematics Module - Somatic Canticles Lore
 *
 * Golden Ratio, Fibonacci sequences, and geometric mappings
 * that underpin the consciousness development framework.
 *
 * @module @/lib/lore/sacred-mathematics
 */

/**
 * Fibonacci stage definition
 */
export interface FibonacciStage {
  /** Fibonacci number (e.g., 1, 2, 3, 5, 8, 13) */
  value: number;
  /** Fibonacci notation (e.g., "F_1", "F_2") */
  notation: string;
  /** Name of this developmental stage */
  stage: string;
  /** Detailed description */
  description: string;
  /** Which book this stage belongs to */
  book: 1 | 2 | 3;
}

/**
 * Platonic solid mapping to brain systems
 */
export interface PlatonicSolidMapping {
  /** Name of the Platonic solid */
  solid: string;
  /** Classical element correspondence */
  element: string;
  /** Associated brain system */
  brainSystem: string;
  /** Functional description */
  function: string;
}

/**
 * Sacred number meaning
 */
export interface SacredNumber {
  /** The number */
  number: number;
  /** Its significance */
  meaning: string;
  /** Application in the Somatic Canticles framework */
  application: string;
}

// ============================================
// GOLDEN RATIO
// ============================================

/**
 * The Golden Ratio (Phi)
 * Universal consciousness proportion
 */
export const GOLDEN_RATIO = 1.618033988749895;

/**
 * Golden Ratio symbol
 */
export const PHI_SYMBOL = "φ";

/**
 * Golden Ratio description
 */
export const goldenRatioDescription =
  "The Golden Ratio (φ) is the universal consciousness proportion. Found throughout nature, art, and architecture, it represents the optimal balance between unity and diversity. In the Somatic Canticles framework, it governs the scaling of the 13 Lenses and the harmonic relationships between developmental stages.";

// ============================================
// FIBONACCI STAGES BY BOOK
// ============================================

/**
 * Fibonacci stages for Book 1: Individual Sovereignty
 */
export const individualStages: FibonacciStage[] = [
  {
    value: 1,
    notation: "F_1",
    stage: "Initial Awareness",
    description: "Awakening to consciousness",
    book: 1,
  },
  {
    value: 1,
    notation: "F_2",
    stage: "Recognition",
    description: "Noticing three-brain system",
    book: 1,
  },
  {
    value: 2,
    notation: "F_3",
    stage: "Basic Integration",
    description: "First witness practice attempts",
    book: 1,
  },
  {
    value: 5,
    notation: "F_5",
    stage: "Stable Individual",
    description: "Consistent witness awareness",
    book: 1,
  },
  {
    value: 8,
    notation: "F_8",
    stage: "Advanced Mastery",
    description: "Three-brain coordination refined",
    book: 1,
  },
  {
    value: 13,
    notation: "F_13",
    stage: "Perfect Individual",
    description: "Complete personal sovereignty",
    book: 1,
  },
];

/**
 * Fibonacci stages for Book 2: Collective Resonance
 */
export const collectiveStages: FibonacciStage[] = [
  {
    value: 21,
    notation: "F_21",
    stage: "Collective Emergence",
    description: "Team resonance begins",
    book: 2,
  },
  {
    value: 34,
    notation: "F_34",
    stage: "Stable Collective",
    description: "Consistent team coherence",
    book: 2,
  },
  {
    value: 55,
    notation: "F_55",
    stage: "Advanced Collective",
    description: "Collective intelligence unlocked",
    book: 2,
  },
  {
    value: 89,
    notation: "F_89",
    stage: "Perfect Collective",
    description: "Resonant self-consciousness achieved",
    book: 2,
  },
];

/**
 * Fibonacci stages for Book 3: Cosmic Integration
 */
export const cosmicStages: FibonacciStage[] = [
  {
    value: 144,
    notation: "F_144",
    stage: "Cosmic Emergence",
    description: "Planetary consciousness contact",
    book: 3,
  },
  {
    value: 233,
    notation: "F_233",
    stage: "Stable Cosmic",
    description: "Reliable cosmic interface",
    book: 3,
  },
  {
    value: 377,
    notation: "F_377",
    stage: "Advanced Cosmic",
    description: "Reality authorship capability",
    book: 3,
  },
  {
    value: 610,
    notation: "F_610",
    stage: "Perfect Cosmic",
    description: "Complete cosmic integration",
    book: 3,
  },
];

/**
 * All Fibonacci stages across all books
 */
export const allFibonacciStages: FibonacciStage[] = [
  ...individualStages,
  ...collectiveStages,
  ...cosmicStages,
];

// ============================================
// PLATONIC SOLIDS MAPPING
// ============================================

/**
 * Mappings of Platonic solids to brain systems and elements
 */
export const platonicSolidsMapping: PlatonicSolidMapping[] = [
  {
    solid: "Tetrahedron",
    element: "Fire",
    brainSystem: "Reptilian",
    function: "Survival action, primal drive",
  },
  {
    solid: "Cube",
    element: "Earth",
    brainSystem: "Limbic",
    function: "Emotional stability, grounding",
  },
  {
    solid: "Octahedron",
    element: "Air",
    brainSystem: "Neocortex",
    function: "Mental clarity, communication",
  },
  {
    solid: "Dodecahedron",
    element: "Ether",
    brainSystem: "Witness",
    function: "Transcendent coordination",
  },
  {
    solid: "Icosahedron",
    element: "Water",
    brainSystem: "Collective Field",
    function: "Flow, unity, collective intelligence",
  },
];

// ============================================
// SACRED NUMBERS
// ============================================

/**
 * Sacred numbers and their meanings in the framework
 */
export const sacredNumbers: SacredNumber[] = [
  {
    number: 3,
    meaning: "Trinity",
    application: "Reptilian/Limbic/Neocortical systems",
  },
  {
    number: 7,
    meaning: "Completion",
    application: "Seven Galaxies / Seven Chakras / Seven Classical Planets",
  },
  {
    number: 12,
    meaning: "Cosmic Order",
    application: "Twelve Zodiacal archetypes",
  },
  {
    number: 13,
    meaning: "The Witness",
    application: "The 13th Lens unifying the previous twelve",
  },
];

// ============================================
// FIBONACCI SEQUENCE
// ============================================

/**
 * Full Fibonacci sequence up to F_610
 */
export const fibonacciSequence: number[] = [
  0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610,
];

/**
 * Generate Fibonacci sequence up to n terms
 * @param n - Number of terms to generate
 * @returns Array of Fibonacci numbers
 */
export function generateFibonacci(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
}

/**
 * Get the nth Fibonacci number
 * @param n - Index (0-based)
 * @returns The Fibonacci number at index n
 */
export function getFibonacciNumber(n: number): number {
  if (n < 0) return 0;
  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a Fibonacci stage by its value
 * @param value - Fibonacci number value
 * @returns Stage data or undefined if not found
 */
export function getStageByFibonacciValue(
  value: number
): FibonacciStage | undefined {
  return allFibonacciStages.find((stage) => stage.value === value);
}

/**
 * Get a Fibonacci stage by its notation
 * @param notation - Stage notation (e.g., "F_13")
 * @returns Stage data or undefined if not found
 */
export function getStageByNotation(
  notation: string
): FibonacciStage | undefined {
  return allFibonacciStages.find((stage) => stage.notation === notation);
}

/**
 * Get all stages for a specific book
 * @param book - Book number (1-3)
 * @returns Array of stages for that book
 */
export function getStagesByBook(book: 1 | 2 | 3): FibonacciStage[] {
  return allFibonacciStages.filter((stage) => stage.book === book);
}

/**
 * Get the book number for a Fibonacci value
 * @param value - Fibonacci number
 * @returns Book number (1-3) or undefined
 */
export function getBookByFibonacciValue(value: number): 1 | 2 | 3 | undefined {
  const stage = getStageByFibonacciValue(value);
  return stage?.book;
}

/**
 * Get Platonic solid mapping by solid name
 * @param solid - Solid name
 * @returns Mapping or undefined if not found
 */
export function getSolidMapping(
  solid: string
): PlatonicSolidMapping | undefined {
  return platonicSolidsMapping.find(
    (s) => s.solid.toLowerCase() === solid.toLowerCase()
  );
}

/**
 * Get Platonic solid by brain system
 * @param brainSystem - Brain system name
 * @returns Mapping or undefined if not found
 */
export function getSolidByBrainSystem(
  brainSystem: string
): PlatonicSolidMapping | undefined {
  return platonicSolidsMapping.find(
    (s) => s.brainSystem.toLowerCase() === brainSystem.toLowerCase()
  );
}

/**
 * Calculate the Golden Ratio proportion of a value
 * @param value - Base value
 * @returns Value multiplied by Golden Ratio
 */
export function applyGoldenRatio(value: number): number {
  return value * GOLDEN_RATIO;
}

/**
 * Check if a number is in the Fibonacci sequence
 * @param n - Number to check
 * @returns True if the number is a Fibonacci number
 */
export function isFibonacci(n: number): boolean {
  if (n < 0) return false;

  // A number is Fibonacci if one of (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
  const isPerfectSquare = (x: number): boolean => {
    const s = Math.sqrt(x);
    return s * s === x;
  };

  return (
    isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
  );
}

export default {
  GOLDEN_RATIO,
  PHI_SYMBOL,
  goldenRatioDescription,
  fibonacciSequence,
  individualStages,
  collectiveStages,
  cosmicStages,
  allFibonacciStages,
  platonicSolidsMapping,
  sacredNumbers,
  generateFibonacci,
  getFibonacciNumber,
  getStageByFibonacciValue,
  getStageByNotation,
  getStagesByBook,
  getBookByFibonacciValue,
  getSolidMapping,
  getSolidByBrainSystem,
  applyGoldenRatio,
  isFibonacci,
};
