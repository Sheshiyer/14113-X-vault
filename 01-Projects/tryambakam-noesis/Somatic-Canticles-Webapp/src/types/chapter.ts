/**
 * Chapter Types
 *
 * TypeScript type definitions for chapters, content, and unlock mechanisms.
 */

/** Chapter status in the user's journey */
export type ChapterStatus = "locked" | "unlocked" | "inProgress" | "completed";

/** Biorhythm cycle requirement for unlocking */
export type BiorhythmCycleRequirement = {
  /** Minimum value required (-1.0 to 1.0) */
  min?: number;
  /** Maximum value allowed (-1.0 to 1.0) */
  max?: number;
  /** Exact phase required */
  phase?: "peak" | "high" | "low" | "critical";
};

/** Conditions required to unlock a chapter */
export interface UnlockTrigger {
  /** Primary biorhythm cycle requirement */
  cycle: {
    type: "physical" | "emotional" | "intellectual" | "spiritual";
    threshold: number;
  };
  /** Additional conditions that must be met */
  additionalConditions?: {
    /** Previous chapter must be completed */
    previousChapterCompleted?: boolean;
    /** Minimum days since registration */
    daysSinceRegistration?: number;
    /** Specific biorhythm requirements */
    biorhythmRequirements?: {
      physical?: BiorhythmCycleRequirement;
      emotional?: BiorhythmCycleRequirement;
      intellectual?: BiorhythmCycleRequirement;
      spiritual?: BiorhythmCycleRequirement;
    };
    /** Time-based requirements */
    timeRequirements?: {
      /** Hour of day (0-23) */
      hourOfDay?: { min: number; max: number };
      /** Day of week (0-6, 0 = Sunday) */
      dayOfWeek?: number[];
    };
  };
}

/** Chapter content structure */
export interface ChapterContent {
  /** Introduction section */
  intro: {
    title: string;
    content: string;
    estimatedTime: number; // minutes
  };
  /** Practice/meditation section */
  practice: {
    title: string;
    instructions: string;
    audioUrl?: string;
    duration: number; // seconds
    breathingPattern?: {
      inhale: number;
      hold: number;
      exhale: number;
      holdEmpty: number;
    };
  };
  /** Reflection section */
  reflection: {
    title: string;
    prompts: string[];
    journalEnabled: boolean;
  };
}

/** Chapter definition */
export interface Chapter {
  /** Unique identifier */
  id: string;
  /** Book identifier (book1, book2, book3) */
  book: "book1" | "book2" | "book3";
  /** Chapter number within the book */
  number: number;
  /** Chapter title */
  title: string;
  /** Chapter subtitle */
  subtitle?: string;
  /** Associated biorhythm cycle */
  cycle: "physical" | "emotional" | "intellectual" | "spiritual";
  /** Unlock requirements */
  unlockTrigger: UnlockTrigger;
  /** Chapter content */
  content: ChapterContent;
  /** Metadata */
  metadata: {
    /** Difficulty level */
    difficulty: "beginner" | "intermediate" | "advanced";
    /** Tags for categorization */
    tags: string[];
    /** Total estimated time (minutes) */
    estimatedTime: number;
  };
}

/** Legacy chapter interface for backward compatibility */
export interface LegacyChapter {
  id: string;
  title: string;
  description: string;
  order: number;
  content?: string;
  audioUrl?: string;
  duration?: number;
  unlockRequirements?: {
    physicalMin?: number;
    emotionalMin?: number;
    intellectualMin?: number;
    previousChapterId?: string;
  };
  metadata?: {
    tags: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedTime: number;
  };
}

/** Re-export ChapterProgress from progress module */
export type { ChapterProgress } from "./progress";

/** Chapter with user progress information */
export interface ChapterWithProgress extends Chapter {
  /** User's progress for this chapter */
  progress: import("./progress").ChapterProgress;
}
