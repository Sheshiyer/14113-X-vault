/**
 * Books Module - Somatic Canticles Lore
 *
 * Defines the three books of the Somatic Canticles trilogy,
 * mapping consciousness development stages through Fibonacci sequences.
 *
 * @module @/lib/lore/books
 */

/**
 * Stage description for a book's developmental progression
 */
export interface BookStageDescription {
  /** Fibonacci step identifier (e.g., "F_1", "F_21") */
  step: string;
  /** Developmental stage name */
  stage: string;
  /** Detailed description of this stage */
  description: string;
}

/**
 * Book structure representing a major arc of consciousness development
 */
export interface Book {
  /** Unique identifier for the book */
  id: "book1" | "book2" | "book3";
  /** Book number in the trilogy (1-3) */
  number: number;
  /** Primary title of the book */
  title: string;
  /** Subtitle describing the book's focus */
  subtitle: string;
  /** Starting Fibonacci number in the sequence */
  fibonacciStart: number;
  /** Ending Fibonacci number in the sequence */
  fibonacciEnd: number;
  /** Overall description of the book's arc */
  description: string;
  /** Detailed stage descriptions for each Fibonacci step */
  stageDescriptions: BookStageDescription[];
}

/**
 * Book 1: Individual Sovereignty
 * Focuses on personal consciousness awakening and mastery (F1-F13)
 */
export const book1: Book = {
  id: "book1",
  number: 1,
  title: "Individual Sovereignty",
  subtitle: "The Architecture of Personal Consciousness",
  fibonacciStart: 1,
  fibonacciEnd: 13,
  description:
    "The foundational journey of personal consciousness development. From initial awakening through the perfecting of individual witness awareness, establishing sovereignty over one's own three-brain system.",
  stageDescriptions: [
    {
      step: "F_1 = 1",
      stage: "Initial Awareness",
      description: "Awakening to consciousness. The first recognition that one is more than the autopilot of conditioned responses.",
    },
    {
      step: "F_2 = 1",
      stage: "Recognition",
      description: "Noticing the three-brain system. Understanding the distinct functions of reptilian, limbic, and neocortical processing.",
    },
    {
      step: "F_3 = 2",
      stage: "Basic Integration",
      description: "First witness practice attempts. Learning to observe without immediate reaction or identification.",
    },
    {
      step: "F_5 = 5",
      stage: "Stable Individual",
      description: "Consistent witness awareness. The witness capacity becomes reliable and available under normal conditions.",
    },
    {
      step: "F_8 = 8",
      stage: "Advanced Mastery",
      description: "Three-brain coordination refined. The systems work in harmony rather than conflict.",
    },
    {
      step: "F_13 = 13",
      stage: "Perfect Individual",
      description: "Complete personal sovereignty. Full authorship over one's internal state and responses.",
    },
  ],
};

/**
 * Book 2: Collective Resonance
 * Focuses on team coherence and collective intelligence (F21-F89)
 */
export const book2: Book = {
  id: "book2",
  number: 2,
  title: "Collective Resonance",
  subtitle: "The Field Between Us",
  fibonacciStart: 21,
  fibonacciEnd: 89,
  description:
    "The expansion from individual to collective consciousness. Exploring how multiple sovereign individuals can create coherent fields of shared awareness, unlocking collective intelligence beyond individual capacity.",
  stageDescriptions: [
    {
      step: "F_21 = 21",
      stage: "Collective Emergence",
      description: "Team resonance begins. The recognition that the group has its own consciousness distinct from individual members.",
    },
    {
      step: "F_34 = 34",
      stage: "Stable Collective",
      description: "Consistent team coherence. The collective field becomes reliable and can be intentionally entered.",
    },
    {
      step: "F_55 = 55",
      stage: "Advanced Collective",
      description: "Collective intelligence unlocked. The team can access knowing and creativity unavailable to individuals alone.",
    },
    {
      step: "F_89 = 89",
      stage: "Perfect Collective",
      description: "Resonant self-consciousness achieved. The collective becomes self-aware, capable of self-direction and evolution.",
    },
  ],
};

/**
 * Book 3: Cosmic Integration
 * Focuses on planetary and cosmic consciousness contact (F144-F610)
 */
export const book3: Book = {
  id: "book3",
  number: 3,
  title: "Cosmic Integration",
  subtitle: "The New Beginning",
  fibonacciStart: 144,
  fibonacciEnd: 610,
  description:
    "The ultimate expansion to cosmic scale consciousness. Contacting planetary and stellar intelligences, achieving the capacity for reality authorship at the highest levels of integration.",
  stageDescriptions: [
    {
      step: "F_144 = 144",
      stage: "Cosmic Emergence",
      description: "Planetary consciousness contact. First direct experience of intelligence beyond the human collective.",
    },
    {
      step: "F_233 = 233",
      stage: "Stable Cosmic",
      description: "Reliable cosmic interface. The connection to greater intelligences becomes consistent and navigable.",
    },
    {
      step: "F_377 = 377",
      stage: "Advanced Cosmic",
      description: "Reality authorship capability. The ability to consciously participate in shaping reality at cosmic scales.",
    },
    {
      step: "F_610 = 610",
      stage: "Perfect Cosmic",
      description: "Complete cosmic integration. Full embodiment of the cosmic perspective while maintaining individual uniqueness.",
    },
  ],
};

/**
 * All three books of the Somatic Canticles trilogy
 */
export const books: Book[] = [book1, book2, book3];

/**
 * Get a book by its ID
 * @param id - Book identifier ("book1", "book2", "book3")
 * @returns Book data or undefined if not found
 */
export function getBookById(id: Book["id"]): Book | undefined {
  return books.find((book) => book.id === id);
}

/**
 * Get a book by its number
 * @param number - Book number (1-3)
 * @returns Book data or undefined if not found
 */
export function getBookByNumber(number: number): Book | undefined {
  return books.find((book) => book.number === number);
}

/**
 * Get the book that contains a specific Fibonacci number
 * @param fibonacciNumber - The Fibonacci number to look up
 * @returns Book data or undefined if not in range
 */
export function getBookByFibonacci(fibonacciNumber: number): Book | undefined {
  return books.find(
    (book) =>
      fibonacciNumber >= book.fibonacciStart &&
      fibonacciNumber <= book.fibonacciEnd
  );
}

/**
 * Get all stage descriptions across all books
 * @returns Array of all stage descriptions
 */
export function getAllStageDescriptions(): BookStageDescription[] {
  return books.flatMap((book) => book.stageDescriptions);
}

export default {
  books,
  book1,
  book2,
  book3,
  getBookById,
  getBookByNumber,
  getBookByFibonacci,
  getAllStageDescriptions,
};
