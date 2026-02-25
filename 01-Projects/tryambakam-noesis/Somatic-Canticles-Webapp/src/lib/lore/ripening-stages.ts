/**
 * Ripening Stages Module - Somatic Canticles Lore
 *
 * The seven stages of consciousness ripening,
 * from Sleepwalker to Source.
 *
 * @module @/lib/lore/ripening-stages
 */

/**
 * Individual ripening stage definition
 */
export interface RipeningStage {
  /** Stage number (1-7) */
  stage: number;
  /** Stage name (Greek/philosophical) */
  name: string;
  /** Archetype for this stage */
  archetype: string;
  /** State description */
  state: string;
  /** Detailed description of this stage */
  description: string;
  /** Characteristics of someone at this stage */
  characteristics: string[];
  /** Practices appropriate for this stage */
  practices: string[];
}

// ============================================
// THE SEVEN RIPENING STAGES
// ============================================

/**
 * Stage 1: Immanence
 * The Sleepwalker - High entropy, autopilot existence
 */
export const stage1Immanence: RipeningStage = {
  stage: 1,
  name: "Immanence",
  archetype: "The Sleepwalker",
  state: "High Entropy (Autopilot)",
  description:
    "The default state of unconscious existence. The individual operates entirely on conditioned patterns, biological drives, and social programming. No witness capacity is active. Reality is experienced as something that happens *to* the person rather than something they participate in creating.",
  characteristics: [
    "Completely identified with thoughts and emotions",
    "Reactive rather than responsive",
    "No awareness of awareness",
    "Driven by unconscious patterns",
    "Experience of life as victim or passive recipient",
  ],
  practices: [
    "Basic mindfulness introduction",
    "Body awareness exercises",
    "Noticing automatic reactions",
  ],
};

/**
 * Stage 2: Lethe
 * The Forgotten - The Fog, redaction of truth
 */
export const stage2Lethe: RipeningStage = {
  stage: 2,
  name: "Lethe",
  archetype: "The Forgotten",
  state: "The Fog (Redaction)",
  description:
    "The stage of forgetting and obscuration. Named after the river of forgetfulness in Greek mythology. The individual has moments of clarity but they are quickly obscured by the 'fog' of conditioning. The truth is present but redacted—covered over by layers of interpretation and defense.",
  characteristics: [
    "Glimpses of awareness followed by forgetting",
    "Recognition of patterns after the fact",
    "Sense of something missing or forgotten",
    "Difficulty sustaining presence",
    "Confusion between truth and interpretation",
  ],
  practices: [
    "Witness meditation",
    "Journaling to catch patterns",
    "Somatic tracking",
    "Developing the 'pause' between stimulus and response",
  ],
};

/**
 * Stage 3: Noesis
 * The Seeker - Awareness of the Field
 */
export const stage3Noesis: RipeningStage = {
  stage: 3,
  name: "Noesis",
  archetype: "The Seeker",
  state: "Awareness of the Field",
  description:
    "The stage of seeking and participatory awareness. The individual recognizes that they are in a field of consciousness that influences and is influenced by observation. This is the beginning of genuine spiritual practice—the active pursuit of understanding the nature of reality and self.",
  characteristics: [
    "Active seeking of truth",
    "Recognition of the observer effect",
    "Questioning of assumptions",
    "Engagement with teachings and practices",
    "Growing capacity for self-reflection",
  ],
  practices: [
    "Dedicated meditation practice",
    "Study of wisdom traditions",
    "Somatic inquiry",
    "Working with a guide or community",
    "Pattern recognition exercises",
  ],
};

/**
 * Stage 4: Anamnesis
 * The Witness - Recovery of Truth
 */
export const stage4Anamnesis: RipeningStage = {
  stage: 4,
  name: "Anamnesis",
  archetype: "The Witness",
  state: "Recovery of Truth",
  description:
    "The stage of remembrance and unforgetting. From the Greek 'anamnesis'—the recovery of forgotten knowledge. The witness capacity becomes stable and reliable. The individual can observe their own patterns without being swept away by them. Truth becomes recoverable even after moments of forgetfulness.",
  characteristics: [
    "Stable witness capacity",
    "Ability to observe emotions without being consumed",
    "Recovery of truth after distraction",
    "Clear distinction between awareness and content",
    "Growing coherence across the three brains",
  ],
  practices: [
    "Deepening witness practice",
    "Working with trauma and conditioning",
    "Developing coherence",
    "Three-brain integration",
    "Service to others at earlier stages",
  ],
};

/**
 * Stage 5: Aletheia
 * The Architect - Restored Logic
 */
export const stage5Aletheia: RipeningStage = {
  stage: 5,
  name: "Aletheia",
  archetype: "The Architect",
  state: "Restored Logic",
  description:
    "The stage of unconcealment and restored order. From the Greek 'aletheia'—truth as un-concealment. The individual operates from a place of clear seeing and coherent action. Reality is no longer distorted by projection and trauma. The 'logic' of existence is restored—cause and effect are clearly perceived.",
  characteristics: [
    "Clear perception without distortion",
    "Coherent action aligned with truth",
    "Ability to see patterns in others and systems",
    "Authentic expression",
    "Creative authorship of reality",
  ],
  practices: [
    "Reality authorship",
    "Coherence cultivation",
    "Mentoring others",
    "Systemic intervention",
    "Integration of wisdom into action",
  ],
};

/**
 * Stage 6: Severance
 * The Liberator - Breaking the Vine
 */
export const stage6Severance: RipeningStage = {
  stage: 6,
  name: "Severance",
  archetype: "The Liberator",
  state: "Breaking the Vine",
  description:
    "The stage of radical liberation. The 'Vine of Determinism'—the binding of consciousness to conditioned patterns—is severed. This is not merely understanding or working with patterns but the actual release from their grip. The individual becomes capable of genuine novelty, free from the determinism of past conditioning.",
  characteristics: [
    "Complete liberation from conditioning",
    "Capacity for genuine novelty",
    "Non-reactive presence",
    "Ability to hold space for transformation",
    "Transmission of liberation to others",
  ],
  practices: [
    "Severance protocol execution",
    "Holding the vectors for others",
    "Radical presence",
    "Coherence transmission",
    "Living as the example",
  ],
};

/**
 * Stage 7: Authorship
 * The Source - The New Beginning
 */
export const stage7Authorship: RipeningStage = {
  stage: 7,
  name: "Authorship",
  archetype: "The Source",
  state: "The New Beginning",
  description:
    "The stage of complete sovereignty and source consciousness. The individual becomes a conscious author of reality, not merely a character within it. This is the culmination of the ripening process—the full embodiment of the 13th Lens. Every moment is a new beginning, fresh and unconditioned.",
  characteristics: [
    "Complete authorship of reality",
    "Every moment a fresh beginning",
    "Full embodiment of the witness",
    "Integration of all previous stages",
    "Service to the evolution of consciousness",
  ],
  practices: [
    "Continuous authorship",
    "Manifestation from source",
    "Teaching and transmission",
    "Evolutionary service",
    "Living as the infinite",
  ],
};

/**
 * All seven ripening stages in order
 */
export const ripeningStages: RipeningStage[] = [
  stage1Immanence,
  stage2Lethe,
  stage3Noesis,
  stage4Anamnesis,
  stage5Aletheia,
  stage6Severance,
  stage7Authorship,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a ripening stage by its number
 * @param stage - Stage number (1-7)
 * @returns Ripening stage or undefined if not found
 */
export function getRipeningStageByNumber(
  stage: number
): RipeningStage | undefined {
  return ripeningStages.find((s) => s.stage === stage);
}

/**
 * Get a ripening stage by its name
 * @param name - Stage name
 * @returns Ripening stage or undefined if not found
 */
export function getRipeningStageByName(
  name: string
): RipeningStage | undefined {
  return ripeningStages.find(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get a ripening stage by its archetype
 * @param archetype - Archetype name
 * @returns Ripening stage or undefined if not found
 */
export function getRipeningStageByArchetype(
  archetype: string
): RipeningStage | undefined {
  return ripeningStages.find(
    (s) => s.archetype.toLowerCase() === archetype.toLowerCase()
  );
}

/**
 * Get the next stage in the sequence
 * @param currentStage - Current stage number
 * @returns Next stage or undefined if at final stage
 */
export function getNextRipeningStage(
  currentStage: number
): RipeningStage | undefined {
  return getRipeningStageByNumber(currentStage + 1);
}

/**
 * Get the previous stage in the sequence
 * @param currentStage - Current stage number
 * @returns Previous stage or undefined if at first stage
 */
export function getPreviousRipeningStage(
  currentStage: number
): RipeningStage | undefined {
  return getRipeningStageByNumber(currentStage - 1);
}

/**
 * Get all stages up to and including a given stage
 * @param stage - Stage number
 * @returns Array of stages from 1 to the given stage
 */
export function getRipeningStagesUpTo(stage: number): RipeningStage[] {
  return ripeningStages.filter((s) => s.stage <= stage);
}

/**
 * Get all archetype names
 * @returns Array of all archetype names
 */
export function getAllArchetypes(): string[] {
  return ripeningStages.map((s) => s.archetype);
}

/**
 * Get all stage names
 * @returns Array of all stage names
 */
export function getAllStageNames(): string[] {
  return ripeningStages.map((s) => s.name);
}

/**
 * Check if a stage number is valid
 * @param stage - Stage number to check
 * @returns True if valid (1-7)
 */
export function isValidRipeningStage(stage: number): boolean {
  return stage >= 1 && stage <= 7;
}

/**
 * Get the characteristics for a stage
 * @param stage - Stage number
 * @returns Array of characteristics or empty array if not found
 */
export function getStageCharacteristics(stage: number): string[] {
  return getRipeningStageByNumber(stage)?.characteristics ?? [];
}

/**
 * Get the practices for a stage
 * @param stage - Stage number
 * @returns Array of practices or empty array if not found
 */
export function getStagePractices(stage: number): string[] {
  return getRipeningStageByNumber(stage)?.practices ?? [];
}

/**
 * Get stages by search term (searches name, archetype, and state)
 * @param term - Search term
 * @returns Array of matching stages
 */
export function searchRipeningStages(term: string): RipeningStage[] {
  const lowerTerm = term.toLowerCase();
  return ripeningStages.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerTerm) ||
      s.archetype.toLowerCase().includes(lowerTerm) ||
      s.state.toLowerCase().includes(lowerTerm)
  );
}

export default {
  ripeningStages,
  stage1Immanence,
  stage2Lethe,
  stage3Noesis,
  stage4Anamnesis,
  stage5Aletheia,
  stage6Severance,
  stage7Authorship,
  getRipeningStageByNumber,
  getRipeningStageByName,
  getRipeningStageByArchetype,
  getNextRipeningStage,
  getPreviousRipeningStage,
  getRipeningStagesUpTo,
  getAllArchetypes,
  getAllStageNames,
  isValidRipeningStage,
  getStageCharacteristics,
  getStagePractices,
  searchRipeningStages,
};
