/**
 * Galactic Cultures Module - Somatic Canticles Lore
 *
 * The seven galactic cultures corresponding to the seven chakras,
 * each with unique traditions, houses, and vessels.
 *
 * @module @/lib/lore/galactic-cultures
 */

/**
 * Chakra assignment for galactic cultures
 */
export type ChakraType =
  | "muladhara"
  | "svadhisthana"
  | "manipura"
  | "anahata"
  | "vishuddha"
  | "ajna"
  | "sahasrara";

/**
 * Galactic culture definition
 */
export interface GalacticCulture {
  /** Unique identifier */
  id: ChakraType;
  /** Galaxy name */
  name: string;
  /** Sector designation */
  sectors: string;
  /** Primary wisdom tradition */
  tradition: string;
  /** Ruling house (if applicable) */
  house: string | null;
  /** Core philosophical principle */
  principle: string;
  /** Primary focus area */
  focus: string;
  /** Sacred vessel/technology */
  vessel: string;
  /** Associated chakra */
  chakra: ChakraType;
  /** Chakra number (1-7) */
  chakraNumber: number;
  /** Chakra sanskrit name */
  chakraSanskrit: string;
  /** Chakra english name */
  chakraEnglish: string;
}

// ============================================
// THE SEVEN GALACTIC CULTURES
// ============================================

/**
 * Sahasrara Galaxy - Crown Chakra
 * House Quoril - Vedic tradition
 */
export const sahasraraGalaxy: GalacticCulture = {
  id: "sahasrara",
  name: "Sahasrara Galaxy",
  sectors: "The Crown Sectors",
  tradition: "Vedic Systematics",
  house: "House Quoril (The Architects)",
  principle: "Reality is structured and mappable.",
  focus: "Neuro-cartography, systematic mapping, higher-order logic.",
  vessel: "Manas Yantra",
  chakra: "sahasrara",
  chakraNumber: 7,
  chakraSanskrit: "Sahasrara",
  chakraEnglish: "Crown",
};

/**
 * Ajna Galaxy - Third Eye Chakra
 * House Luminth - Daoist tradition
 */
export const ajnaGalaxy: GalacticCulture = {
  id: "ajna",
  name: "Ajna Galaxy",
  sectors: "The Third Eye Sectors",
  tradition: "Daoist Flow Dynamics",
  house: "House Luminth (The Weavers)",
  principle: "The Way flows naturally.",
  focus: "Narrative vision, light-weaving, observation without interference.",
  vessel: "Yìshí Qìxiè",
  chakra: "ajna",
  chakraNumber: 6,
  chakraSanskrit: "Ajna",
  chakraEnglish: "Third Eye",
};

/**
 * Anahata Galaxy - Heart Chakra
 * House Vireth - Sufi tradition
 */
export const anahataGalaxy: GalacticCulture = {
  id: "anahata",
  name: "Anahata Galaxy",
  sectors: "The Heart Sectors",
  tradition: "Sufi Resonance",
  house: "House Vireth (The Alchemists)",
  principle: "Reality is resonant and harmonious.",
  focus: "Emotional attunement, frequency alignment, bio-acoustic engineering.",
  vessel: "Adawat al-Wa'i",
  chakra: "anahata",
  chakraNumber: 4,
  chakraSanskrit: "Anahata",
  chakraEnglish: "Heart",
};

/**
 * Muladhara Galaxy - Root Chakra
 * House Seter - Kabbalistic tradition
 */
export const muladharaGalaxy: GalacticCulture = {
  id: "muladhara",
  name: "Muladhara Galaxy",
  sectors: "The Root Sectors",
  tradition: "Kabbalistic Tzimtzum",
  house: "House Seter (The Guardians)",
  principle: "Reality is structured and must be defended.",
  focus: "Boundary maintenance, defensive shielding, atomic density.",
  vessel: "Klei Toda'ah",
  chakra: "muladhara",
  chakraNumber: 1,
  chakraSanskrit: "Muladhara",
  chakraEnglish: "Root",
};

/**
 * Manipura Galaxy - Solar Plexus Chakra
 * Yogic tradition
 */
export const manipuraGalaxy: GalacticCulture = {
  id: "manipura",
  name: "Manipura Galaxy",
  sectors: "The Fire Networks",
  tradition: "Yogic Transformation",
  house: null,
  principle: "Reality is transformed by Will.",
  focus: "Power dynamics, transformation, rapid evolution.",
  vessel: "Agni Yantra",
  chakra: "manipura",
  chakraNumber: 3,
  chakraSanskrit: "Manipura",
  chakraEnglish: "Solar Plexus",
};

/**
 * Svadhisthana Galaxy - Sacral Chakra
 * Tantric tradition
 */
export const svadhisthanaGalaxy: GalacticCulture = {
  id: "svadhisthana",
  name: "Svadhishthana Galaxy",
  sectors: "The Water Collective",
  tradition: "Tantric Fluidity",
  house: null,
  principle: "Reality is fluid and adaptable.",
  focus: "Creativity, flow states, emotional processing.",
  vessel: "Jala Yantra",
  chakra: "svadhisthana",
  chakraNumber: 2,
  chakraSanskrit: "Svadhisthana",
  chakraEnglish: "Sacral",
};

/**
 * Vishuddha Galaxy - Throat Chakra
 * Hermetic tradition
 */
export const vishuddhaGalaxy: GalacticCulture = {
  id: "vishuddha",
  name: "Vishuddha Galaxy",
  sectors: "The Communication Grid",
  tradition: "Hermetic Expression",
  house: null,
  principle: "Reality is created through Speech.",
  focus: "Communication protocols, truth-telling, code.",
  vessel: "Vak Yantra",
  chakra: "vishuddha",
  chakraNumber: 5,
  chakraSanskrit: "Vishuddha",
  chakraEnglish: "Throat",
};

/**
 * All seven galactic cultures in chakra order (1-7)
 */
export const galacticCultures: GalacticCulture[] = [
  muladharaGalaxy,
  svadhisthanaGalaxy,
  manipuraGalaxy,
  anahataGalaxy,
  vishuddhaGalaxy,
  ajnaGalaxy,
  sahasraraGalaxy,
];

/**
 * Galactic cultures with houses (the four primary houses)
 */
export const primaryHouseCultures: GalacticCulture[] = [
  muladharaGalaxy,
  anahataGalaxy,
  ajnaGalaxy,
  sahasraraGalaxy,
];

/**
 * Galactic cultures without houses (the three elemental galaxies)
 */
export const elementalCultures: GalacticCulture[] = [
  svadhisthanaGalaxy,
  manipuraGalaxy,
  vishuddhaGalaxy,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a galactic culture by its chakra ID
 * @param id - Chakra identifier
 * @returns Galactic culture or undefined if not found
 */
export function getGalacticCultureById(
  id: ChakraType
): GalacticCulture | undefined {
  return galacticCultures.find((culture) => culture.id === id);
}

/**
 * Get a galactic culture by its chakra number (1-7)
 * @param number - Chakra number
 * @returns Galactic culture or undefined if not found
 */
export function getGalacticCultureByNumber(
  number: number
): GalacticCulture | undefined {
  return galacticCultures.find((culture) => culture.chakraNumber === number);
}

/**
 * Get a galactic culture by its name
 * @param name - Galaxy name
 * @returns Galactic culture or undefined if not found
 */
export function getGalacticCultureByName(
  name: string
): GalacticCulture | undefined {
  return galacticCultures.find(
    (culture) => culture.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get galactic culture by house
 * @param house - House name (partial match)
 * @returns Galactic culture or undefined if not found
 */
export function getGalacticCultureByHouse(
  house: string
): GalacticCulture | undefined {
  return galacticCultures.find(
    (culture) =>
      culture.house?.toLowerCase().includes(house.toLowerCase()) ?? false
  );
}

/**
 * Get galactic cultures by tradition
 * @param tradition - Tradition name
 * @returns Array of galactic cultures with that tradition
 */
export function getGalacticCulturesByTradition(
  tradition: string
): GalacticCulture[] {
  return galacticCultures.filter(
    (culture) =>
      culture.tradition.toLowerCase() === tradition.toLowerCase()
  );
}

/**
 * Get the galactic culture associated with a character's house
 * @param houseName - House name (e.g., "House Quoril")
 * @returns Galactic culture or undefined if not found
 */
export function getCultureByCharacterHouse(
  houseName: string
): GalacticCulture | undefined {
  return primaryHouseCultures.find((culture) =>
    culture.house?.toLowerCase().includes(houseName.toLowerCase())
  );
}

/**
 * Get all vessels
 * @returns Array of all sacred vessel names
 */
export function getAllVessels(): string[] {
  return galacticCultures.map((culture) => culture.vessel);
}

/**
 * Get the chakra mapping for a character based on their house
 * @param houseName - House name
 * @returns Chakra type or undefined if not found
 */
export function getChakraByHouse(
  houseName: string
): ChakraType | undefined {
  const culture = getCultureByCharacterHouse(houseName);
  return culture?.chakra;
}

export default {
  galacticCultures,
  primaryHouseCultures,
  elementalCultures,
  sahasraraGalaxy,
  ajnaGalaxy,
  anahataGalaxy,
  muladharaGalaxy,
  manipuraGalaxy,
  svadhisthanaGalaxy,
  vishuddhaGalaxy,
  getGalacticCultureById,
  getGalacticCultureByNumber,
  getGalacticCultureByName,
  getGalacticCultureByHouse,
  getGalacticCulturesByTradition,
  getCultureByCharacterHouse,
  getAllVessels,
  getChakraByHouse,
};
