/**
 * Progress Types
 *
 * TypeScript type definitions for chapter progress and statistics.
 */

import type { ChapterStatus } from "./chapter";

/** Chapter progress tracking */
export interface ChapterProgress {
  /** Chapter ID */
  chapterId: string;
  /** Current status */
  status: ChapterStatus;
  /** When the chapter was started */
  startedAt: Date | null;
  /** When the chapter was completed */
  completedAt: Date | null;
  /** Progress percentage (0-100) */
  progressPercent: number;
  /** Time spent on chapter (seconds) */
  timeSpent: number;
  /** Number of attempts */
  attempts: number;
  /** Journal entries for this chapter */
  journalEntries: JournalEntry[];
}

/** Journal entry for reflection */
export interface JournalEntry {
  /** Entry ID */
  id: string;
  /** Entry timestamp */
  createdAt: Date;
  /** Prompt that was answered */
  prompt: string;
  /** User's response */
  response: string;
  /** Visibility: private or shareable */
  isPrivate: boolean;
}

/** Progress statistics aggregate */
export interface ProgressStats {
  /** Total time spent across all chapters (seconds) */
  totalTime: number;
  /** Overall completion rate (0-1) */
  completionRate: number;
  /** Number of streak days */
  streakDays: number;
  /** Chapters completed count */
  chaptersCompleted: number;
  /** Total chapters available */
  totalChapters: number;
  /** Current book progress */
  bookProgress: {
    book1: number; // 0-1
    book2: number; // 0-1
    book3: number; // 0-1
  };
  /** Average session duration (seconds) */
  averageSessionDuration: number;
  /** Last activity timestamp */
  lastActivityAt: Date | null;
}

/** Daily activity log */
export interface DailyActivity {
  /** Date of activity */
  date: Date;
  /** Chapters accessed */
  chaptersAccessed: string[];
  /** Time spent (seconds) */
  timeSpent: number;
  /** Whether streak was maintained */
  streakMaintained: boolean;
}

/** Progress update payload */
export interface ProgressUpdate {
  /** Chapter ID */
  chapterId: string;
  /** New status */
  status?: ChapterStatus;
  /** Progress percentage */
  progressPercent?: number;
  /** Additional time spent (seconds) */
  timeSpent?: number;
  /** New journal entry */
  journalEntry?: Omit<JournalEntry, "id" | "createdAt">;
}
