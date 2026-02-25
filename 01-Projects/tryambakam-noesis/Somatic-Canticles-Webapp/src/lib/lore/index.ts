/**
 * Somatic Canticles Lore Module
 *
 * Unified exports for all lore-related data and types.
 * This module provides access to the complete mythos, characters,
 * cosmology, and systems of the Somatic Canticles universe.
 *
 * @module @/lib/lore
 *
 * @example
 * ```typescript
 * import {
 *   books,
 *   lenses,
 *   characters,
 *   galacticCultures,
 *   tryambakamProtocol,
 *   cosmicTrinity,
 *   chapterLoreMappings,
 *   ripeningStages,
 * } from "@/lib/lore";
 *
 * // Access the first book
 * const book1 = books[0];
 *
 * // Get a specific lens
 * const chakraLens = getLensById(3);
 *
 * // Get character info
 * const jian = getCharacterById("jian-quoril");
 * ```
 */

// ============================================
// BOOKS
// ============================================

export {
  // Types
  type Book,
  type BookStageDescription,
  // Data
  books,
  book1,
  book2,
  book3,
  // Functions
  getBookById,
  getBookByNumber,
  getBookByFibonacci,
  getAllStageDescriptions,
} from "./books";

// ============================================
// LENSES
// ============================================

export {
  // Types
  type Lens,
  type SpecialistMastery,
  // Data
  lenses,
  specialistMasteries,
  // Individual lenses
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
  // Specialist masteries
  jianQuorilMastery,
  sonaVirethMastery,
  corvanLuminthMastery,
  gideonSeterMastery,
  // Functions
  getLensById,
  getLensByName,
  getLensesByCharacterMastery,
  getSpecialistMastery,
  getMastersOfLens,
  getLensesByTradition,
} from "./lenses";

// ============================================
// CHARACTERS
// ============================================

export {
  // Types
  type Character,
  type CharacterBookArcs,
  // Data
  somanautTeam,
  characters,
  // Individual characters
  jianQuoril,
  gideonSeter,
  sonaVireth,
  corvanLuminth,
  // Functions
  getCharacterById,
  getCharacterByName,
  getCharactersByHouse,
  getCharactersByEnneagramType,
  getCharactersBySpecialty,
  getTeamLead,
  getCharacterArcsForBook,
} from "./characters";

// ============================================
// GALACTIC CULTURES
// ============================================

export {
  // Types
  type ChakraType,
  type GalacticCulture,
  // Data
  galacticCultures,
  primaryHouseCultures,
  elementalCultures,
  // Individual cultures
  sahasraraGalaxy,
  ajnaGalaxy,
  anahataGalaxy,
  muladharaGalaxy,
  manipuraGalaxy,
  svadhisthanaGalaxy,
  vishuddhaGalaxy,
  // Functions
  getGalacticCultureById,
  getGalacticCultureByNumber,
  getGalacticCultureByName,
  getGalacticCultureByHouse,
  getGalacticCulturesByTradition,
  getCultureByCharacterHouse,
  getAllVessels,
  getChakraByHouse,
} from "./galactic-cultures";

// ============================================
// PROTOCOLS
// ============================================

export {
  // Types
  type ProtocolPhase,
  type ProtocolVector,
  type AmritaProtocol,
  type TryambakamProtocol,
  // Data
  tryambakamProtocol,
  protocolPhases,
  standardVectors,
  severanceEventVectors,
  amritaProtocol,
  // Individual phases
  phase1Tryambakam,
  phase2Pustivardhanam,
  phase3Bandhanan,
  phase4Mamrtat,
  // Functions
  getPhaseByNumber,
  getPhaseByName,
  getVectorHolder,
  getVectorsByHolder,
  getAmritaElementDescription,
  getPhaseByProgress,
} from "./protocols";

// ============================================
// SACRED MATHEMATICS
// ============================================

export {
  // Types
  type FibonacciStage,
  type PlatonicSolidMapping,
  type SacredNumber,
  // Constants
  GOLDEN_RATIO,
  PHI_SYMBOL,
  goldenRatioDescription,
  // Data
  fibonacciSequence,
  individualStages,
  collectiveStages,
  cosmicStages,
  allFibonacciStages,
  platonicSolidsMapping,
  sacredNumbers,
  // Functions
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
} from "./sacred-mathematics";

// ============================================
// COSMOLOGY
// ============================================

export {
  // Types
  type CosmicTrinityLevel,
  type MoonPhase,
  type SacredGeometryForm,
  // Data
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
  // Functions
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
} from "./cosmology";

// ============================================
// CHAPTERS
// ============================================

export {
  // Types
  type ChapterLoreMapping,
  // Data
  chapterLoreMappings,
  // Individual chapters
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
  // Functions
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
} from "./chapters";

// ============================================
// RIPENING STAGES
// ============================================

export {
  // Types
  type RipeningStage,
  // Data
  ripeningStages,
  // Individual stages
  stage1Immanence,
  stage2Lethe,
  stage3Noesis,
  stage4Anamnesis,
  stage5Aletheia,
  stage6Severance,
  stage7Authorship,
  // Functions
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
} from "./ripening-stages";
