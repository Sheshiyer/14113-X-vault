/**
 * Chapter Data Structure
 * 
 * Complete data for all 12 chapters of the Somatic Canticles trilogy.
 * Includes unlock triggers, duration estimates, and organizational structure.
 * 
 * Books: 3 books × 4 chapters each
 * Cycles: 4 biorhythm cycles × 3 chapters each
 * 
 * Power numbers: 8, 13, 19, 21, 44, 125, 152
 */

import { BiorhythmCycle, ChapterStatus, UnlockTrigger } from "@/types";
import { 
  CHAPTER_DURATIONS, 
  CHAPTER_UNLOCK_THRESHOLDS,
  CYCLE_CHAPTERS,
  BOOKS,
} from "@/lib/constants";

// ============================================
// TYPES
// ============================================

/**
 * Chapter checkpoint for progress tracking
 */
export interface ChapterCheckpoint {
  /** Unique checkpoint ID */
  id: string;
  /** Checkpoint title */
  title: string;
  /** Checkpoint description */
  description?: string;
  /** Order within chapter */
  order: number;
}

/**
 * Chapter content sections
 */
export interface ChapterContent {
  /** Introduction text */
  intro: string;
  /** Practice instructions */
  practice: string;
  /** Reflection prompts */
  reflection: string;
}

/**
 * Complete chapter data structure
 */
export interface ChapterData {
  /** Chapter ID (chapter-1 through chapter-12) */
  id: string;
  /** Chapter number (1-12) */
  number: number;
  /** Chapter title */
  title: string;
  /** Chapter subtitle */
  subtitle: string;
  /** Short description */
  description: string;
  /** Associated biorhythm cycle */
  cycle: BiorhythmCycle;
  /** Book assignment */
  book: "book1" | "book2" | "book3";
  /** Position within book (1-4) */
  bookPosition: number;
  /** Current status */
  status: ChapterStatus;
  /** Progress percentage (0-100) */
  progress: number;
  /** Estimated duration in minutes */
  estimatedDuration: number;
  /** Audio file URL */
  audioUrl?: string;
  /** Unlock requirements */
  unlockTrigger: UnlockTrigger;
  /** Optimal cycle peak for this chapter */
  cyclePeak: {
    /** Day of cycle (1-33 depending on cycle) */
    day: number;
    /** Hour of day (0-23) */
    hour: number;
  };
  /** Chapter content */
  content: ChapterContent;
  /** Progress checkpoints */
  checkpoints: ChapterCheckpoint[];
  /** Unlock date (if scheduled) */
  unlockDate?: Date;
  /** Completion date */
  completedAt?: Date;
}

// ============================================
// CHAPTER DEFINITIONS
// ============================================

/**
 * All 12 chapters with complete data
 */
export const chapters: ChapterData[] = [
  // ==========================================
  // PHYSICAL CYCLE (Chapters 1-3)
  // Book 1: Genesis
  // ==========================================
  {
    id: "chapter-1",
    number: 1,
    title: "The Breath of Awakening",
    subtitle: "Embodying Presence Through Conscious Breathing",
    description: "Begin your journey with the foundational practice of conscious breathing, awakening the body to its own intelligence.",
    cycle: "physical",
    book: "book1",
    bookPosition: 1,
    status: "completed",
    progress: 100,
    estimatedDuration: CHAPTER_DURATIONS[1],
    audioUrl: "/audio/chapter-1-breath.mp3",
    unlockTrigger: {
      cycle: { type: "physical", threshold: 0 },
      additionalConditions: { previousChapterCompleted: false },
    },
    cyclePeak: { day: 12, hour: 14 },
    content: {
      intro: "Welcome to the first canticle of your somatic journey. Here, we begin with the most fundamental act of life: breathing. Not as an unconscious process, but as a gateway to embodied awareness. The breath bridges the voluntary and involuntary, the conscious and unconscious. It is both the most ordinary and the most extraordinary of acts.",
      practice: "Find a comfortable seated position. Close your eyes and bring attention to your natural breath. Notice the rhythm without changing it. Gradually extend the exhale, counting to 8. Feel the wave of relaxation that follows each release. Continue for 19 breath cycles, allowing each exhale to soften the body more deeply.",
      reflection: "What sensations arose during the practice? How does your body feel different now compared to when you began? Notice any resistance or ease in the breath.",
    },
    checkpoints: [
      { id: "c1-1", title: "Establish breathing rhythm", order: 1, description: "Find a natural, comfortable breathing pace" },
      { id: "c1-2", title: "Complete 8 breath cycles", order: 2, description: "Count 19 breaths with extended exhales" },
      { id: "c1-3", title: "Journal initial sensations", order: 3, description: "Record your embodied experience" },
    ],
    completedAt: new Date("2026-01-15"),
  },
  {
    id: "chapter-2",
    number: 2,
    title: "The Grounding Current",
    subtitle: "Rooting Energy Through Body Awareness",
    description: "Establish your connection to earth through grounding practices that anchor consciousness in the physical form.",
    cycle: "physical",
    book: "book1",
    bookPosition: 2,
    status: "completed",
    progress: 100,
    estimatedDuration: CHAPTER_DURATIONS[2],
    audioUrl: "/audio/chapter-2-grounding.mp3",
    unlockTrigger: {
      cycle: { type: "physical", threshold: CHAPTER_UNLOCK_THRESHOLDS[2] },
      additionalConditions: { previousChapterCompleted: true },
    },
    cyclePeak: { day: 13, hour: 16 },
    content: {
      intro: "The body is not merely a vessel for the mind—it is the ground of experience itself. In this canticle, we explore grounding as the foundation of all somatic practice. To be grounded is to be fully present in the body, connected to the earth, stable yet alive.",
      practice: "Stand with feet shoulder-width apart. Feel the weight distributing through your feet. Imagine roots extending downward, connecting you to the earth's core. Hold this awareness for 13 breath cycles. Notice how your center of gravity settles and your breath deepens.",
      reflection: "Where in your body do you feel most grounded? Where do you feel disconnected? What shifts when you intentionally connect to the earth?",
    },
    checkpoints: [
      { id: "c2-1", title: "Assume grounding stance", order: 1, description: "Stand with feet shoulder-width apart" },
      { id: "c2-2", title: "Visualize root connection", order: 2, description: "Feel roots extending into the earth" },
      { id: "c2-3", title: "Complete 13 breath cycles", order: 3, description: "Maintain awareness through 13 breaths" },
    ],
    completedAt: new Date("2026-01-17"),
  },
  {
    id: "chapter-3",
    number: 3,
    title: "The Pulse of Movement",
    subtitle: "Liberating Expression Through Somatic Flow",
    description: "Discover how movement becomes meditation when consciousness inhabits the body's natural rhythms.",
    cycle: "physical",
    book: "book1",
    bookPosition: 3,
    status: "inProgress",
    progress: 44,
    estimatedDuration: CHAPTER_DURATIONS[3],
    audioUrl: "/audio/chapter-3-movement.mp3",
    unlockTrigger: {
      cycle: { type: "physical", threshold: CHAPTER_UNLOCK_THRESHOLDS[3] },
      additionalConditions: { previousChapterCompleted: true },
    },
    cyclePeak: { day: 14, hour: 10 },
    content: {
      intro: "Movement is the language of the body. When we move with awareness, we enter a dialogue between consciousness and form that transcends words. The body knows things that the mind has forgotten, and movement is how it speaks.",
      practice: "Begin with small movements—finger wiggles, toe flexes. Gradually expand to larger gestures. Let each movement arise from internal impulse rather than external instruction. Continue for 21 minutes, allowing the body to express what words cannot capture.",
      reflection: "What did your body want to express? How did the quality of movement change over time? What emerged when you stopped directing and started listening?",
    },
    checkpoints: [
      { id: "c3-1", title: "Begin micro-movements", order: 1, description: "Start with small, subtle movements" },
      { id: "c3-2", title: "Expand to full body expression", order: 2, description: "Allow movement to grow organically" },
      { id: "c3-3", title: "Practice free-form movement", order: 3, description: "Move without structure for 21 minutes" },
    ],
  },

  // ==========================================
  // EMOTIONAL CYCLE (Chapters 4-6)
  // Book 1 & 2: Genesis & Emergence
  // ==========================================
  {
    id: "chapter-4",
    number: 4,
    title: "The Ocean of Feeling",
    subtitle: "Navigating Emotional Waves with Presence",
    description: "Learn to surf the waves of emotion rather than being drowned by them, developing emotional resilience through somatic awareness.",
    cycle: "emotional",
    book: "book1",
    bookPosition: 4,
    status: "unlocked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[4],
    audioUrl: "/audio/chapter-4-emotion.mp3",
    unlockTrigger: {
      cycle: { type: "emotional", threshold: CHAPTER_UNLOCK_THRESHOLDS[4] },
      additionalConditions: { 
        previousChapterCompleted: true,
        daysSinceRegistration: 3,
      },
    },
    cyclePeak: { day: 8, hour: 20 },
    unlockDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    content: {
      intro: "Emotions are not enemies to be conquered, but waves to be surfed. They carry information about our needs, boundaries, and values. In the ocean of feeling, we learn to navigate rather than control, to feel fully without being swept away.",
      practice: "Bring to mind a recent emotional experience. Notice where in your body you feel its echo. Breathe into that space with curiosity rather than judgment. Allow the sensation to shift and change as you maintain present attention.",
      reflection: "What shape did the emotion take in your body? How did it transform with attention? What message might this emotion be carrying?",
    },
    checkpoints: [
      { id: "c4-1", title: "Recall emotional memory", order: 1, description: "Bring a recent emotion to awareness" },
      { id: "c4-2", title: "Locate somatic marker", order: 2, description: "Find where the emotion lives in your body" },
      { id: "c4-3", title: "Practice breathing into sensation", order: 3, description: "Use breath to explore the felt sense" },
    ],
  },
  {
    id: "chapter-5",
    number: 5,
    title: "The Heart's Resonance",
    subtitle: "Cultivating Compassion Through Embodied Connection",
    description: "Open the heart center through practices that weave together self-compassion and connection with others.",
    cycle: "emotional",
    book: "book2",
    bookPosition: 1,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[5],
    unlockTrigger: {
      cycle: { type: "emotional", threshold: CHAPTER_UNLOCK_THRESHOLDS[5] },
      additionalConditions: { previousChapterCompleted: true },
    },
    cyclePeak: { day: 9, hour: 14 },
    content: {
      intro: "The heart is not merely a pump, but a brain of its own, processing information through electromagnetic fields that extend far beyond the body. Heart coherence is the state where mind, body, and emotions align in harmonious rhythm.",
      practice: "Place one hand on your heart. Feel its rhythm. Now bring to mind someone you love. Notice how the heart's quality changes. Extend this feeling to yourself, then to a neutral person, then to someone difficult. Finally, extend to all beings.",
      reflection: "How did your heart space feel different with each focus? What barriers to compassion did you discover? Where did you feel resistance and where flow?",
    },
    checkpoints: [
      { id: "c5-1", title: "Connect with heart rhythm", order: 1, description: "Feel your heartbeat with hand on chest" },
      { id: "c5-2", title: "Practice loving-kindness sequence", order: 2, description: "Extend compassion to loved one, self, neutral, difficult" },
      { id: "c5-3", title: "Notice barriers to compassion", order: 3, description: "Observe where the practice meets resistance" },
    ],
  },
  {
    id: "chapter-6",
    number: 6,
    title: "The Shadow Dance",
    subtitle: "Integrating the Hidden Aspects of Self",
    description: "Embrace the shadow with curiosity, transforming what was repressed into sources of wisdom and vitality.",
    cycle: "emotional",
    book: "book2",
    bookPosition: 2,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[6],
    unlockTrigger: {
      cycle: { type: "emotional", threshold: CHAPTER_UNLOCK_THRESHOLDS[6] },
      additionalConditions: { previousChapterCompleted: true },
    },
    cyclePeak: { day: 10, hour: 18 },
    content: {
      intro: "What we resist persists. The shadow contains not only our darkness but also our unlived potential. Integration begins with acknowledgment, not elimination. The shadow is not an enemy to defeat but a lost part to welcome home.",
      practice: "Identify a quality you judge in others. Where does this quality live in you? Acknowledge it without judgment. What need might this quality be trying to meet? What gift might this shadow aspect offer if integrated consciously?",
      reflection: "What shadow aspect revealed itself? How might embracing it change your life? What would it mean to own this quality rather than project it?",
    },
    checkpoints: [
      { id: "c6-1", title: "Identify projected quality", order: 1, description: "Notice what you judge in others" },
      { id: "c6-2", title: "Locate shadow in self", order: 2, description: "Find where this quality exists in you" },
      { id: "c6-3", title: "Discover hidden gift", order: 3, description: "Uncover the potential within the shadow" },
    ],
  },

  // ==========================================
  // INTELLECTUAL CYCLE (Chapters 7-9)
  // Book 2: Emergence
  // ==========================================
  {
    id: "chapter-7",
    number: 7,
    title: "The Mind's Mirror",
    subtitle: "Witnessing Thought Patterns with Clarity",
    description: "Develop the observer consciousness that can watch thoughts without being swept away by them.",
    cycle: "intellectual",
    book: "book2",
    bookPosition: 3,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[7],
    unlockTrigger: {
      cycle: { type: "intellectual", threshold: CHAPTER_UNLOCK_THRESHOLDS[7] },
      additionalConditions: { 
        previousChapterCompleted: true,
        daysSinceRegistration: 14,
      },
    },
    cyclePeak: { day: 17, hour: 9 },
    content: {
      intro: "The mind generates thoughts like the heart beats blood—automatically, continuously. The art is not to stop thinking but to relate to thoughts differently. Witness consciousness is the capacity to observe without identification, to see without being swept into the stream.",
      practice: "Sit in meditation. Watch thoughts arise and pass like clouds across the sky. Don't engage, don't push away. Simply observe. When you notice you've been swept into a thought, gently return to witnessing. This is the practice—the return, not the sustained observation.",
      reflection: "What patterns did you notice in your thinking? How did the quality of observation change over time? What is the difference between being lost in thought and observing thought?",
    },
    checkpoints: [
      { id: "c7-1", title: "Establish witnessing position", order: 1, description: "Find the observer perspective" },
      { id: "c7-2", title: "Observe thought stream", order: 2, description: "Watch thoughts without engagement" },
      { id: "c7-3", title: "Practice gentle return", order: 3, description: "Notice when lost and return to witness" },
    ],
  },
  {
    id: "chapter-8",
    number: 8,
    title: "The Pattern Weaver",
    subtitle: "Recognizing Somatic Narratives",
    description: "Uncover the stories your body tells and how they shape your experience of reality.",
    cycle: "intellectual",
    book: "book2",
    bookPosition: 4,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[8],
    unlockTrigger: {
      cycle: { type: "intellectual", threshold: CHAPTER_UNLOCK_THRESHOLDS[8] },
      additionalConditions: { previousChapterCompleted: true },
    },
    cyclePeak: { day: 18, hour: 15 },
    content: {
      intro: "We don't experience reality directly but through the filter of our narratives. These stories live not just in our minds but in our muscles, postures, and movement patterns. The body is the first storyteller, encoding experience in tissue long before it becomes conscious memory.",
      practice: "Scan your body for areas of chronic tension. Ask each: 'What story are you telling?' Listen without judgment. Notice how awareness itself begins to shift the narrative. Stay with each area until you sense the story it holds.",
      reflection: "What somatic narratives emerged? How do they relate to your life patterns? What happens to the story when you simply witness it with presence?",
    },
    checkpoints: [
      { id: "c8-1", title: "Scan for tension patterns", order: 1, description: "Map chronic holding in the body" },
      { id: "c8-2", title: "Inquire into somatic stories", order: 2, description: "Ask what each tension pattern communicates" },
      { id: "c8-3", title: "Notice narrative shifts", order: 3, description: "Observe how awareness changes the story" },
    ],
  },
  {
    id: "chapter-9",
    number: 9,
    title: "The Wisdom Body",
    subtitle: "Accessing Intuitive Knowing Through Embodiment",
    description: "Tap into the body's wisdom that transcends linear thinking, accessing knowing that arises from integrated experience.",
    cycle: "intellectual",
    book: "book2",
    bookPosition: 4,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[9],
    unlockTrigger: {
      cycle: { type: "intellectual", threshold: CHAPTER_UNLOCK_THRESHOLDS[9] },
      additionalConditions: { previousChapterCompleted: true },
    },
    cyclePeak: { day: 19, hour: 11 },
    content: {
      intro: "The body knows things the mind has forgotten. Somatic intelligence emerges from the integration of all our experiences, processed below the level of conscious thought. Intuition is not magic—it is the wisdom of the body made available to conscious awareness.",
      practice: "Bring a question or decision to mind. Don't think about it—feel it. Notice bodily sensations as you consider each option. Does one feel more expansive, another constricting? Trust the body's response as valid data. The body often knows before the mind understands.",
      reflection: "What did your body reveal? How does somatic knowing differ from mental analysis? When in your life have you trusted or doubted your body's wisdom?",
    },
    checkpoints: [
      { id: "c9-1", title: "Formulate clear question", order: 1, description: "Define what you're seeking to know" },
      { id: "c9-2", title: "Feel into each option", order: 2, description: "Notice somatic response to possibilities" },
      { id: "c9-3", title: "Integrate somatic data", order: 3, description: "Combine body wisdom with mental analysis" },
    ],
  },

  // ==========================================
  // SPIRITUAL CYCLE (Chapters 10-12)
  // Book 3: Transcendence
  // ==========================================
  {
    id: "chapter-10",
    number: 10,
    title: "The Threshold",
    subtitle: "Meeting the Mystery at the Edge of Known",
    description: "Stand at the boundary between the known and unknown, cultivating comfort with uncertainty as a spiritual practice.",
    cycle: "spiritual",
    book: "book3",
    bookPosition: 1,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[10],
    unlockTrigger: {
      cycle: { type: "spiritual", threshold: CHAPTER_UNLOCK_THRESHOLDS[10] },
      additionalConditions: { 
        previousChapterCompleted: true,
        daysSinceRegistration: 28,
      },
    },
    cyclePeak: { day: 27, hour: 22 },
    content: {
      intro: "Spirituality begins where certainty ends. The threshold is a liminal space where transformation occurs—not through answers but through the willingness to dwell in questions. At the edge of the known, we encounter the mystery that cannot be captured in concepts.",
      practice: "Sit with a question that has no answer. Feel the discomfort of not-knowing. Breathe into it. Let the question itself become a doorway to expanded awareness. Stay with the uncertainty without reaching for resolution. What emerges in the space of not-knowing?",
      reflection: "What emerged in the space of not-knowing? How did your relationship to uncertainty shift? What is the difference between not-knowing and confusion?",
    },
    checkpoints: [
      { id: "c10-1", title: "Identify unanswerable question", order: 1, description: "Find a genuine mystery in your life" },
      { id: "c10-2", title: "Dwell in uncertainty", order: 2, description: "Stay with not-knowing without resolution" },
      { id: "c10-3", title: "Notice what emerges", order: 3, description: "Observe what arises in the open space" },
    ],
  },
  {
    id: "chapter-11",
    number: 11,
    title: "The Sacred Return",
    subtitle: "Cycles of Death and Rebirth in Consciousness",
    description: "Embrace the cyclical nature of spiritual growth, finding peace in the eternal rhythm of dissolution and renewal.",
    cycle: "spiritual",
    book: "book3",
    bookPosition: 2,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[11],
    unlockTrigger: {
      cycle: { type: "spiritual", threshold: CHAPTER_UNLOCK_THRESHOLDS[11] },
      additionalConditions: { previousChapterCompleted: true },
    },
    cyclePeak: { day: 28, hour: 6 },
    content: {
      intro: "Every ending is a beginning in disguise. Spiritual maturity involves learning to die to each moment, releasing the past to meet the present fully. The sacred return is the recognition that we are always arriving, always beginning, always in the middle of becoming.",
      practice: "Review your journey through the canticles. What has died? What has been born? Practice letting go of something you no longer need—a belief, an identity, a pattern. Feel the space that opens. Welcome what wants to emerge in the cleared space.",
      reflection: "What are you ready to release? What new life wants to emerge in the cleared space? How has the journey changed you?",
    },
    checkpoints: [
      { id: "c11-1", title: "Review journey so far", order: 1, description: "Reflect on what has transformed" },
      { id: "c11-2", title: "Practice conscious release", order: 2, description: "Let go of what no longer serves" },
      { id: "c11-3", title: "Welcome new emergence", order: 3, description: "Open to what wants to be born" },
    ],
  },
  {
    id: "chapter-12",
    number: 12,
    title: "The Eternal Canticle",
    subtitle: "Integration and the Ongoing Journey",
    description: "Arrive at completion that is also a beginning, carrying the practices forward into everyday life.",
    cycle: "spiritual",
    book: "book3",
    bookPosition: 3,
    status: "locked",
    progress: 0,
    estimatedDuration: CHAPTER_DURATIONS[12],
    unlockTrigger: {
      cycle: { type: "spiritual", threshold: CHAPTER_UNLOCK_THRESHOLDS[12] },
      additionalConditions: { 
        previousChapterCompleted: true,
        biorhythmRequirements: {
          physical: { min: 0.5 },
          emotional: { min: 0.5 },
          intellectual: { min: 0.5 },
        },
      },
    },
    cyclePeak: { day: 29, hour: 12 },
    content: {
      intro: "The journey never truly ends—it only deepens. The 12th canticle is not a destination but a consolidation, preparing you for the next spiral of growth. Integration is the most important practice: bringing what you've learned into the crucible of daily life.",
      practice: "Create your personal integration practice combining elements from all cycles. Commit to a daily practice that honors all dimensions of your being. Physical grounding, emotional flow, mental clarity, spiritual openness—all woven into a seamless whole.",
      reflection: "What will you carry forward? How has this journey changed you? What is your commitment to ongoing practice? How will you embody these teachings in your relationships, work, and service?",
    },
    checkpoints: [
      { id: "c12-1", title: "Design personal practice", order: 1, description: "Create your unique integration ritual" },
      { id: "c12-2", title: "Commit to daily integration", order: 2, description: "Set intentions for ongoing practice" },
      { id: "c12-3", title: "Set intentions for continuation", order: 3, description: "Define how you'll carry this forward" },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get chapter by ID
 * @param id - Chapter ID (e.g., "chapter-5")
 * @returns Chapter data or undefined if not found
 */
export function getChapterById(id: string): ChapterData | undefined {
  return chapters.find((ch) => ch.id === id);
}

/**
 * Get chapter by number
 * @param number - Chapter number (1-12)
 * @returns Chapter data or undefined if not found
 */
export function getChapterByNumber(number: number): ChapterData | undefined {
  return chapters.find((ch) => ch.number === number);
}

/**
 * Get chapters by biorhythm cycle
 * @param cycle - Biorhythm cycle type
 * @returns Array of chapters for that cycle
 */
export function getChaptersByCycle(cycle: BiorhythmCycle): ChapterData[] {
  return chapters.filter((ch) => ch.cycle === cycle);
}

/**
 * Get chapters by book
 * @param book - Book ID ("book1", "book2", "book3")
 * @returns Array of chapters for that book
 */
export function getChaptersByBook(book: "book1" | "book2" | "book3"): ChapterData[] {
  return chapters.filter((ch) => ch.book === book);
}

/**
 * Get completed chapters
 * @returns Array of completed chapters
 */
export function getCompletedChapters(): ChapterData[] {
  return chapters.filter((ch) => ch.status === "completed");
}

/**
 * Get unlocked chapters (includes in-progress)
 * @returns Array of unlocked chapters
 */
export function getUnlockedChapters(): ChapterData[] {
  return chapters.filter((ch) => ch.status !== "locked");
}

/**
 * Get locked chapters
 * @returns Array of locked chapters
 */
export function getLockedChapters(): ChapterData[] {
  return chapters.filter((ch) => ch.status === "locked");
}

/**
 * Get in-progress chapters
 * @returns Array of in-progress chapters
 */
export function getInProgressChapters(): ChapterData[] {
  return chapters.filter((ch) => ch.status === "inProgress");
}

/**
 * Get next available chapter
 * @returns Next chapter to work on, or undefined if all complete
 */
export function getNextChapter(): ChapterData | undefined {
  // First, check for in-progress chapters
  const inProgress = chapters.find((ch) => ch.status === "inProgress");
  if (inProgress) return inProgress;
  
  // Then, find first unlocked but not started
  return chapters.find((ch) => ch.status === "unlocked");
}

/**
 * Get overall progress statistics
 * @returns Progress statistics object
 */
export function getProgressStats(): {
  total: number;
  completed: number;
  unlocked: number;
  inProgress: number;
  locked: number;
  percentage: number;
} {
  const completed = chapters.filter((ch) => ch.status === "completed").length;
  const inProgress = chapters.filter((ch) => ch.status === "inProgress").length;
  const unlocked = chapters.filter((ch) => ch.status === "unlocked").length;
  const locked = chapters.filter((ch) => ch.status === "locked").length;
  
  return {
    total: chapters.length,
    completed,
    unlocked: completed + unlocked + inProgress,
    inProgress,
    locked,
    percentage: Math.round((completed / chapters.length) * 100),
  };
}

/**
 * Get next unlock date
 * @returns Next scheduled unlock date, or null if none
 */
export function getNextUnlockDate(): Date | null {
  const locked = chapters.filter(
    (ch) => ch.status === "locked" && ch.unlockDate
  );
  
  if (locked.length === 0) return null;
  
  const dates = locked
    .map((ch) => ch.unlockDate)
    .filter((date): date is Date => date !== undefined);
  
  if (dates.length === 0) return null;
  return new Date(Math.min(...dates.map((d) => d.getTime())));
}

/**
 * Get chapter unlock threshold
 * @param chapterNumber - Chapter number (1-12)
 * @returns Biorhythm threshold value
 */
export function getChapterUnlockThreshold(chapterNumber: number): number {
  return CHAPTER_UNLOCK_THRESHOLDS[chapterNumber] ?? 0.5;
}

/**
 * Check if a chapter can be unlocked based on biorhythm values
 * @param chapterNumber - Chapter number to check
 * @param cycleValue - Current biorhythm cycle value
 * @param previousCompleted - Whether previous chapter is completed
 * @returns Whether chapter can be unlocked
 */
export function canUnlockChapter(
  chapterNumber: number,
  cycleValue: number,
  previousCompleted: boolean
): boolean {
  const threshold = getChapterUnlockThreshold(chapterNumber);
  const chapter = getChapterByNumber(chapterNumber);
  
  if (!chapter) return false;
  
  // Chapter 1 is always unlockable
  if (chapterNumber === 1) return true;
  
  // Check threshold and previous completion
  return cycleValue >= threshold && previousCompleted;
}

/**
 * Get cycle theme color for a chapter
 * @param chapterNumber - Chapter number
 * @returns Color key from design system
 */
export function getChapterColor(chapterNumber: number): string {
  if (chapterNumber <= 4) return "octave";
  if (chapterNumber <= 8) return "witness";
  return "creative";
}

/**
 * Get book name for a chapter
 * @param chapterNumber - Chapter number
 * @returns Book name
 */
export function getChapterBookName(chapterNumber: number): string {
  if (chapterNumber <= 4) return BOOKS.BOOK_1.name;
  if (chapterNumber <= 8) return BOOKS.BOOK_2.name;
  return BOOKS.BOOK_3.name;
}

/**
 * Get cycle name for a chapter
 * @param chapterNumber - Chapter number
 * @returns Cycle name
 */
export function getChapterCycleName(chapterNumber: number): string {
  const chapter = getChapterByNumber(chapterNumber);
  if (!chapter) return "";
  
  const cycleNames: Record<BiorhythmCycle, string> = {
    physical: "Physical Awakening",
    emotional: "Emotional Flow",
    intellectual: "Mental Clarity",
    spiritual: "Spiritual Integration",
  };
  
  return cycleNames[chapter.cycle];
}

// ============================================
// EXPORTS
// ============================================

export default {
  chapters,
  getChapterById,
  getChapterByNumber,
  getChaptersByCycle,
  getChaptersByBook,
  getCompletedChapters,
  getUnlockedChapters,
  getLockedChapters,
  getInProgressChapters,
  getNextChapter,
  getProgressStats,
  getNextUnlockDate,
  getChapterUnlockThreshold,
  canUnlockChapter,
  getChapterColor,
  getChapterBookName,
  getChapterCycleName,
};
