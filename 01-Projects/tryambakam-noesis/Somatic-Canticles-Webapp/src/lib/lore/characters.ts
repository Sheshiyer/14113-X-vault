/**
 * Characters Module - Somatic Canticles Lore
 *
 * The four members of the Somanaut team, each representing
 * a unique approach to consciousness exploration.
 *
 * @module @/lib/lore/characters
 */

/**
 * Character arc progression through the three books
 */
export interface CharacterBookArcs {
  /** Arc in Book 1: Individual Sovereignty */
  book1: string;
  /** Arc in Book 2: Collective Resonance */
  book2: string;
  /** Arc in Book 3: Cosmic Integration */
  book3: string;
}

/**
 * Somanaut team member definition
 */
export interface Character {
  /** Unique identifier */
  id: string;
  /** Full name */
  name: string;
  /** Primary role/title */
  role: string;
  /** Galactic house affiliation */
  house: string;
  /** Enneagram type */
  enneagram: string;
  /** Area of expertise */
  specialty: string;
  /** Psychological profile */
  psychology: string;
  /** Overall character arc summary */
  arcSummary: string;
  /** Arc progression through each book */
  bookArcs: CharacterBookArcs;
}

// ============================================
// THE SOMANAUT TEAM
// ============================================

/**
 * Dr. Jian Quoril - The Neuro-Cartographer
 * House Quoril, Type 5 Investigator, Sahasrara/Crown chakra
 */
export const jianQuoril: Character = {
  id: "jian-quoril",
  name: "Dr. Jian Quoril",
  role: "The Neuro-Cartographer",
  house: "House Quoril (The Architects)",
  enneagram: "Type 5 - The Investigator",
  specialty: "Somatic Datascape Mapping & Resonance Topology",
  psychology:
    "Finds security in knowledge; views emotion as unreliable data. Operates from a place of observation and analysis, seeking to understand the underlying structure of consciousness.",
  arcSummary: "From Rigid Logic to Integrated Wisdom",
  bookArcs: {
    book1:
      "Grudgingly accepts limits of logic; integrates qualitative data. Begins to recognize that not all truth is quantifiable.",
    book2:
      "Evolves 'system' definition to include paradox; maps emotional topology. Discovers that feeling is itself a form of knowing.",
    book3:
      "Refuses 'Certainty'; chooses 'Aliveness'. Holds Manas Interface as moving constellation rather than fixed map.",
  },
};

/**
 * Gideon Seter - The Systems Immunologist
 * House Seter, Type 8 Challenger, Muladhara/Root chakra
 */
export const gideonSeter: Character = {
  id: "gideon-seter",
  name: "Gideon Seter",
  role: "The Systems Immunologist",
  house: "House Seter (The Guardians)",
  enneagram: "Type 8 - The Challenger",
  specialty: "Bio-Threat Assessment & Tzimtzum Compression Shielding",
  psychology:
    "Decisive, grounded, protective. Binary worldview: threat/non-threat. Uses strength as a defensive mechanism against vulnerability.",
  arcSummary: "From Protector to Guardian",
  bookArcs: {
    book1:
      "Learns to use strength as container (space-holding) rather than shield. Discovers the power of presence without action.",
    book2:
      "Learns discerning vulnerability for internal healing. Recognizes that true protection includes allowing others to face their own challenges.",
    book3:
      "Refuses 'Safety'; chooses 'Growth'. Holds Coherence Vector as the team's grounding presence.",
  },
};

/**
 * Dr. Sona Vireth - The Bio-Acoustic Engineer
 * House Vireth, Type 4 Individualist, Anahata/Heart chakra
 */
export const sonaVireth: Character = {
  id: "sona-vireth",
  name: "Dr. Sona Vireth",
  role: "The Bio-Acoustic Engineer",
  house: "House Vireth (The Alchemists)",
  enneagram: "Type 4 - The Individualist",
  specialty: "Metabolic Emergence & Emotional Frequency Analysis",
  psychology:
    "Deeply empathetic, intuitive, creative. Feels everything. Often struggles with the weight of emotional information.",
  arcSummary: "From Emotional Container to Resonant Channel",
  bookArcs: {
    book1:
      "Differentiates empathy from identification. Validates intuitive data as legitimate input. Learns to feel without being consumed.",
    book2:
      "Masters Coherence Cultivation; becomes active lighthouse rather than passive receiver.",
    book3:
      "Refuses 'Peace' (Anesthesia); chooses 'Depth'. Holds Note Vector (Pure Joy) as the team's emotional anchor.",
  },
};

/**
 * Dr. Corvan Luminth - The Psycho-Pathologist & Team Lead
 * House Luminth, Type 9 Peacemaker, Ajna/Third Eye chakra
 */
export const corvanLuminth: Character = {
  id: "corvan-luminth",
  name: "Dr. Corvan Luminth",
  role: "The Psycho-Pathologist & Team Lead",
  house: "House Luminth (The Weavers)",
  enneagram: "Type 9 - The Peacemaker",
  specialty: "Aletheia Mapping & Narrative Diagnostics",
  psychology:
    "Calm, patient, holistic thinker. Seeks harmony. Tendency to merge with others' perspectives at cost of own clarity.",
  arcSummary: "From Passive Witness to Active Alchemist",
  bookArcs: {
    book1:
      "Accepts burden of authorship; edits rather than just interpreting. Steps into active leadership.",
    book2:
      "Masters holding space for conflict; understands reality as dialogue rather than monologue.",
    book3:
      "Refuses 'Perfect Meaning'; chooses 'Reality'. Holds Bell Vector (Catalyst Clarity) as the team's witness anchor.",
  },
};

/**
 * All four Somanaut team members
 */
export const somanautTeam: Character[] = [
  jianQuoril,
  gideonSeter,
  sonaVireth,
  corvanLuminth,
];

/**
 * All characters (alias for somanautTeam)
 */
export const characters = somanautTeam;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a character by their ID
 * @param id - Character identifier
 * @returns Character data or undefined if not found
 */
export function getCharacterById(id: string): Character | undefined {
  return somanautTeam.find((char) => char.id === id);
}

/**
 * Get a character by their name
 * @param name - Character name
 * @returns Character data or undefined if not found
 */
export function getCharacterByName(name: string): Character | undefined {
  return somanautTeam.find(
    (char) => char.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get characters by house
 * @param house - House name (partial match)
 * @returns Array of characters from that house
 */
export function getCharactersByHouse(house: string): Character[] {
  return somanautTeam.filter((char) =>
    char.house.toLowerCase().includes(house.toLowerCase())
  );
}

/**
 * Get characters by Enneagram type
 * @param type - Enneagram type number or name
 * @returns Array of characters of that type
 */
export function getCharactersByEnneagramType(type: string | number): Character[] {
  const typeStr = type.toString().toLowerCase();
  return somanautTeam.filter((char) =>
    char.enneagram.toLowerCase().includes(typeStr)
  );
}

/**
 * Get characters by specialty area
 * @param specialty - Specialty keyword
 * @returns Array of characters with matching specialty
 */
export function getCharactersBySpecialty(specialty: string): Character[] {
  return somanautTeam.filter((char) =>
    char.specialty.toLowerCase().includes(specialty.toLowerCase())
  );
}

/**
 * Get team lead
 * @returns The team lead character
 */
export function getTeamLead(): Character {
  return corvanLuminth;
}

/**
 * Get characters for a specific book's arc
 * @param bookNumber - Book number (1-3)
 * @returns Array of characters with their arcs for that book
 */
export function getCharacterArcsForBook(
  bookNumber: 1 | 2 | 3
): Array<Character & { bookArc: string }> {
  const bookKey = `book${bookNumber}` as keyof CharacterBookArcs;
  return somanautTeam.map((char) => ({
    ...char,
    bookArc: char.bookArcs[bookKey],
  }));
}

export default {
  somanautTeam,
  characters,
  jianQuoril,
  gideonSeter,
  sonaVireth,
  corvanLuminth,
  getCharacterById,
  getCharacterByName,
  getCharactersByHouse,
  getCharactersByEnneagramType,
  getCharactersBySpecialty,
  getTeamLead,
  getCharacterArcsForBook,
};
