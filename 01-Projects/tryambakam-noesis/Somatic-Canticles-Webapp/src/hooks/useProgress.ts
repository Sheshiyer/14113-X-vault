"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  ChapterProgress,
  ProgressStats,
  ProgressUpdate,
  DailyActivity,
  JournalEntry,
} from "@/types";

export interface UseProgressOptions {
  /** User ID (optional, fetched from session if not provided) */
  userId?: string;
  /** Auto-fetch on mount */
  autoFetch?: boolean;
}

export interface UseProgressReturn {
  /** Progress for all chapters */
  chapterProgress: ChapterProgress[];
  /** Aggregate statistics */
  stats: ProgressStats;
  /** Daily activity log */
  activityLog: DailyActivity[];
  /** Loading state */
  isLoading: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Fetch progress data */
  fetchProgress: () => Promise<void>;
  /** Update progress for a chapter */
  updateProgress: (update: ProgressUpdate) => Promise<void>;
  /** Mark chapter as started */
  startChapter: (chapterId: string) => Promise<void>;
  /** Mark chapter as completed */
  completeChapter: (chapterId: string) => Promise<void>;
  /** Add time spent to a chapter */
  addTimeSpent: (chapterId: string, seconds: number) => Promise<void>;
  /** Add journal entry */
  addJournalEntry: (
    chapterId: string,
    entry: Omit<JournalEntry, "id" | "createdAt">
  ) => Promise<void>;
  /** Get progress for a specific chapter */
  getChapterProgress: (chapterId: string) => ChapterProgress | undefined;
  /** Refresh all data */
  refresh: () => Promise<void>;
}

/**
 * Hook for tracking and managing user progress
 *
 * Features:
 * - Track chapter completion
 * - Update progress via API
 * - Calculate statistics
 * - Manage journal entries
 */
export function useProgress({
  userId,
  autoFetch = true,
}: UseProgressOptions = {}): UseProgressReturn {
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [activityLog, setActivityLog] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch progress data
  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch chapter progress
      const progressResponse = await fetch("/api/progress");
      if (!progressResponse.ok) {
        throw new Error("Failed to fetch progress");
      }
      const progressData = await progressResponse.json();

      if (progressData.success) {
        setChapterProgress(progressData.data || []);
      }

      // Fetch activity log
      const activityResponse = await fetch("/api/progress/activity");
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        if (activityData.success) {
          setActivityLog(activityData.data || []);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchProgress();
    }
  }, [autoFetch, fetchProgress]);

  // Calculate statistics
  const stats = useMemo<ProgressStats>(() => {
    const totalChapters = chapterProgress.length || 12; // Default to 12 if no data
    const completed = chapterProgress.filter(
      (p) => p.status === "completed"
    ).length;
    const totalTime = chapterProgress.reduce(
      (sum, p) => sum + p.timeSpent,
      0
    );

    // Calculate book progress
    const bookChapters = {
      book1: chapterProgress.filter((p) => p.chapterId.startsWith("book1")),
      book2: chapterProgress.filter((p) => p.chapterId.startsWith("book2")),
      book3: chapterProgress.filter((p) => p.chapterId.startsWith("book3")),
    };

    const calculateBookProgress = (chapters: ChapterProgress[]) => {
      if (chapters.length === 0) return 0;
      const completedChapters = chapters.filter(
        (p) => p.status === "completed"
      ).length;
      return completedChapters / chapters.length;
    };

    // Calculate streak
    const streakDays = calculateStreak(activityLog);

    // Get last activity
    const lastActivity = chapterProgress
      .filter((p) => p.completedAt)
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
      )[0];

    return {
      totalTime,
      completionRate: totalChapters > 0 ? completed / totalChapters : 0,
      streakDays,
      chaptersCompleted: completed,
      totalChapters,
      bookProgress: {
        book1: calculateBookProgress(bookChapters.book1),
        book2: calculateBookProgress(bookChapters.book2),
        book3: calculateBookProgress(bookChapters.book3),
      },
      averageSessionDuration:
        chapterProgress.length > 0
          ? totalTime / chapterProgress.length
          : 0,
      lastActivityAt: lastActivity?.completedAt || null,
    };
  }, [chapterProgress, activityLog]);

  // Update progress
  const updateProgress = useCallback(async (update: ProgressUpdate) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/progress/${update.chapterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setChapterProgress((prev) =>
          prev.map((p) => (p.chapterId === update.chapterId ? data.data : p))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Update failed"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start a chapter
  const startChapter = useCallback(
    async (chapterId: string) => {
      await updateProgress({
        chapterId,
        status: "inProgress",
        progressPercent: 0,
      });
    },
    [updateProgress]
  );

  // Complete a chapter
  const completeChapter = useCallback(
    async (chapterId: string) => {
      await updateProgress({
        chapterId,
        status: "completed",
        progressPercent: 100,
      });
    },
    [updateProgress]
  );

  // Add time spent
  const addTimeSpent = useCallback(
    async (chapterId: string, seconds: number) => {
      const current = chapterProgress.find((p) => p.chapterId === chapterId);
      if (!current) return;

      await updateProgress({
        chapterId,
        timeSpent: current.timeSpent + seconds,
      });
    },
    [chapterProgress, updateProgress]
  );

  // Add journal entry
  const addJournalEntry = useCallback(
    async (
      chapterId: string,
      entry: Omit<JournalEntry, "id" | "createdAt">
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/progress/${chapterId}/journal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });

        if (!response.ok) {
          throw new Error("Failed to add journal entry");
        }

        const data = await response.json();

        if (data.success) {
          // Update local state with new journal entry
          setChapterProgress((prev) =>
            prev.map((p) =>
              p.chapterId === chapterId
                ? {
                    ...p,
                    journalEntries: [...p.journalEntries, data.data],
                  }
                : p
            )
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Journal update failed"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get progress for a specific chapter
  const getChapterProgress = useCallback(
    (chapterId: string) => {
      return chapterProgress.find((p) => p.chapterId === chapterId);
    },
    [chapterProgress]
  );

  // Refresh all data
  const refresh = useCallback(async () => {
    await fetchProgress();
  }, [fetchProgress]);

  return {
    chapterProgress,
    stats,
    activityLog,
    isLoading,
    error,
    fetchProgress,
    updateProgress,
    startChapter,
    completeChapter,
    addTimeSpent,
    addJournalEntry,
    getChapterProgress,
    refresh,
  };
}

/** Calculate streak from activity log */
function calculateStreak(activityLog: DailyActivity[]): number {
  if (activityLog.length === 0) return 0;

  // Sort by date descending
  const sorted = [...activityLog].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const activityDate = new Date(sorted[i].date);
    activityDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (activityDate.getTime() === expectedDate.getTime()) {
      if (sorted[i].streakMaintained) {
        streak++;
      }
    } else {
      break;
    }
  }

  return streak;
}
