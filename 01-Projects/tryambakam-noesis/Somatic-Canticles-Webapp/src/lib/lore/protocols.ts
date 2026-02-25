/**
 * Protocols Module - Somatic Canticles Lore
 *
 * The Tryambakam Protocol - the 4-phase technical Veda
 * for liberating awareness through the Anamnesis Engine.
 *
 * @module @/lib/lore/protocols
 */

/**
 * Individual protocol phase definition
 */
export interface ProtocolPhase {
  /** Phase number (1-4) */
  number: number;
  /** Sanskrit name of the phase */
  name: string;
  /** Technical/engineering name */
  technicalName: string;
  /** Goal or objective of this phase */
  goal: string;
  /** Detailed description of the phase */
  description: string;
}

/**
 * Vector definition for standard and severance event protocols
 */
export interface ProtocolVector {
  /** Name of the vector */
  name: string;
  /** Definition/purpose of the vector */
  definition: string;
  /** Holder of this vector in severance events (if applicable) */
  holder?: string;
}

/**
 * Amrita protocol elements
 */
export interface AmritaProtocol {
  /** Description of the Amrita Protocol */
  description: string;
  /** Post-Severance practice elements */
  elements: string[];
  /** Detailed descriptions of each element */
  elementDescriptions: Record<string, string>;
}

/**
 * Complete Tryambakam Protocol structure
 */
export interface TryambakamProtocol {
  /** Description of the protocol */
  description: string;
  /** The four phases of the protocol */
  phases: ProtocolPhase[];
  /** Standard protocol vectors */
  standardVectors: ProtocolVector[];
  /** Severance event vectors */
  severanceVectors: ProtocolVector[];
  /** Amrita protocol for post-Severance */
  amritaProtocol: AmritaProtocol;
}

// ============================================
// THE FOUR PHASES
// ============================================

/** Phase 1: Activating the triangulation engine */
export const phase1Tryambakam: ProtocolPhase = {
  number: 1,
  name: "Tryambakaṃ",
  technicalName: "The Three-Eyes",
  goal: "Activating the Triangulation Engine (Psychē/Bios/Hylē).",
  description:
    "The initial phase of protocol activation. Establishes simultaneous awareness across all three domains: Psychē (mind/soul), Bios (life/body), and Hylē (matter/substrate). The three eyes open to witness the full spectrum of consciousness.",
};

/** Phase 2: Ripening awareness through metabolic support */
export const phase2Pustivardhanam: ProtocolPhase = {
  number: 2,
  name: "Puṣṭivardhanam",
  technicalName: "The Ripening",
  goal: "Increasing Awareness Charge via metabolic support.",
  description:
    "The nourishment phase. Metabolic and energetic conditions are optimized to increase the 'charge' of awareness. Like a fruit ripening on the vine, consciousness is brought to optimal readiness for transformation.",
};

/** Phase 3: Identifying deterministic bonding sites */
export const phase3Bandhanan: ProtocolPhase = {
  number: 3,
  name: "Bandhanan",
  technicalName: "The Vine",
  goal: "Identifying the site of Deterministic Bonding (Trauma).",
  description:
    "The diagnostic phase. Maps the exact location where consciousness has become bonded to deterministic patterns—the 'Vine of Determinism' that restricts free authorship. This is the trauma pattern to be severed.",
};

/** Phase 4: Executing the leap into Source */
export const phase4Mamrtat: ProtocolPhase = {
  number: 4,
  name: "Mā'mṛtāt",
  technicalName: "The Severance",
  goal: "Executing the Leap of Authorship into the Source.",
  description:
    "The liberation phase. The actual severance event where bonded awareness is freed from its deterministic constraints. The leap from conditioned response to conscious authorship. The return to immortality/eternal presence.",
};

/**
 * All four phases in order
 */
export const protocolPhases: ProtocolPhase[] = [
  phase1Tryambakam,
  phase2Pustivardhanam,
  phase3Bandhanan,
  phase4Mamrtat,
];

// ============================================
// PROTOCOL VECTORS
// ============================================

/** Standard vectors for regular protocol execution */
export const standardVectors: ProtocolVector[] = [
  {
    name: "Soma Vector",
    definition:
      "The uncorrupted 'God-Code' of the soul. The original blueprint of consciousness before imprinting.",
  },
  {
    name: "Manas Interface",
    definition:
      "The present active witness capacity (Team). The collective awareness field maintained by the Somanaut team.",
  },
  {
    name: "Muladhara Terminus",
    definition:
      "The physical grounding point. The anchor in matter that prevents dissociation during consciousness expansion.",
  },
];

/** Severance Event vectors - held by team members during critical liberation */
export const severanceEventVectors: ProtocolVector[] = [
  {
    name: "Pure Joy (The Note)",
    holder: "Dr. Sona Vireth",
    definition:
      "Unconditional joy as substrate. The emotional frequency that makes severance possible—joy as the ground of liberation.",
  },
  {
    name: "Catalyst Clarity (The Bell)",
    holder: "Dr. Corvan Luminth",
    definition:
      "Witnessing the trauma without interpretation. The clear seeing that allows what is to be seen without distortion.",
  },
  {
    name: "Present Coherence",
    holder: "Gideon Seter",
    definition:
      "Complete team unity preventing fragmentation. The grounded presence that holds the field together.",
  },
];

// ============================================
// AMRITA PROTOCOL
// ============================================

/** Amrita Protocol for post-Severance reality architecture */
export const amritaProtocol: AmritaProtocol = {
  description:
    "Post-Severance reality architecture practice. The ongoing discipline for those who have achieved liberation, ensuring they remain authors of their reality rather than falling back into conditioned patterns.",
  elements: ["Tone", "Boundary", "Map", "Story"],
  elementDescriptions: {
    Tone:
      "Maintaining the vibrational frequency established during severance. The ongoing resonance of liberated awareness.",
    Boundary:
      "Defining and maintaining the container of one's authorship. What is within one's sphere of creation vs. external conditions.",
    Map:
      "The cognitive framework for navigating reality. Keeping the conceptual tools sharp for ongoing sense-making.",
    Story:
      "The narrative thread of one's life. Conscious authorship of the meaning-making that shapes experience.",
  },
};

// ============================================
// COMPLETE PROTOCOL
// ============================================

/**
 * The complete Tryambakam Protocol
 */
export const tryambakamProtocol: TryambakamProtocol = {
  description:
    "The Technical Veda; schematic for the Anamnesis Engine to liberate awareness. The systematic protocol for moving from conditioned consciousness to sovereign authorship.",
  phases: protocolPhases,
  standardVectors,
  severanceVectors: severanceEventVectors,
  amritaProtocol,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a phase by its number
 * @param number - Phase number (1-4)
 * @returns Phase data or undefined if not found
 */
export function getPhaseByNumber(number: number): ProtocolPhase | undefined {
  return protocolPhases.find((phase) => phase.number === number);
}

/**
 * Get a phase by its name (Sanskrit or technical)
 * @param name - Phase name
 * @returns Phase data or undefined if not found
 */
export function getPhaseByName(name: string): ProtocolPhase | undefined {
  const lowerName = name.toLowerCase();
  return protocolPhases.find(
    (phase) =>
      phase.name.toLowerCase() === lowerName ||
      phase.technicalName.toLowerCase() === lowerName
  );
}

/**
 * Get vector holder for a severance event vector
 * @param vectorName - Name of the vector
 * @returns Character name who holds this vector, or undefined
 */
export function getVectorHolder(vectorName: string): string | undefined {
  const vector = severanceEventVectors.find(
    (v) => v.name.toLowerCase() === vectorName.toLowerCase()
  );
  return vector?.holder;
}

/**
 * Get vectors held by a specific character
 * @param characterName - Character name
 * @returns Array of vectors held by the character
 */
export function getVectorsByHolder(characterName: string): ProtocolVector[] {
  return severanceEventVectors.filter(
    (v) => v.holder?.toLowerCase() === characterName.toLowerCase()
  );
}

/**
 * Get Amrita protocol element description
 * @param element - Element name
 * @returns Description or undefined if not found
 */
export function getAmritaElementDescription(
  element: string
): string | undefined {
  return amritaProtocol.elementDescriptions[element];
}

/**
 * Get the current phase based on progress (0-100)
 * @param progress - Progress percentage
 * @returns Current phase
 */
export function getPhaseByProgress(progress: number): ProtocolPhase {
  if (progress < 25) return phase1Tryambakam;
  if (progress < 50) return phase2Pustivardhanam;
  if (progress < 75) return phase3Bandhanan;
  return phase4Mamrtat;
}

export default {
  tryambakamProtocol,
  protocolPhases,
  standardVectors,
  severanceEventVectors,
  amritaProtocol,
  phase1Tryambakam,
  phase2Pustivardhanam,
  phase3Bandhanan,
  phase4Mamrtat,
  getPhaseByNumber,
  getPhaseByName,
  getVectorHolder,
  getVectorsByHolder,
  getAmritaElementDescription,
  getPhaseByProgress,
};
