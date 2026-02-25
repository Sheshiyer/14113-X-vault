"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  Chapter,
  ChapterWithProgress,
  ChapterProgress,
  ChapterStatus,
  BiorhythmCycles,
} from "@/types";

export interface UseChaptersOptions {
  /** User's birth date for biorhythm-based unlocks */
  birthDate?: Date;
  /** Current biorhythm cycles */
  currentBiorhythm?: BiorhythmCycles;
  /** Book to filter by (optional) */
  book?: "book1" | "book2" | "book3";
  /** Whether to include locked chapters */
  includeLocked?: boolean;
}

export interface UseChaptersReturn {
  /** All chapters with progress */
  chapters: ChapterWithProgress[];
  /** Currently active/unlocked chapters */
  availableChapters: ChapterWithProgress[];
  /** Current chapter in progress */
  currentChapter: ChapterWithProgress | null;
  /** Completed chapters */
  completedChapters: ChapterWithProgress[];
  /** Total progress across all chapters */
  totalProgress: number;
  /** Loading state */
  isLoading: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Refresh chapters list */
  refetch: () => Promise<void>;
  /** Update chapter progress */
  updateProgress: (chapterId: string, status: ChapterStatus, progressPercent?: number) => Promise<void>;
  /** Get a specific chapter by ID */
  getChapter: (chapterId: string) => ChapterWithProgress | undefined;
}

/**
 * Hook for managing chapters and their progress
 *
 * Features:
 * - Fetch chapters list
 * - Track chapter progress
 * - Handle unlock logic based on biorhythm
 */
export function useChapters({
  birthDate,
  currentBiorhythm,
  book,
  includeLocked = true,
}: UseChaptersOptions = {}): UseChaptersReturn {
  const [chapters, setChapters] = useState<ChapterWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch chapters from API
  const fetchChapters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (book) params.append("book", book);
      if (includeLocked) params.append("includeLocked", "true");

      const response = await fetch(`/api/chapters?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch chapters: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to fetch chapters");
      }

      // Merge with progress data
      const chaptersWithProgress = await enrichWithProgress(data.data);

      // Evaluate unlock status
      const evaluatedChapters = evaluateUnlockStatus(
        chaptersWithProgress,
        currentBiorhythm
      );

      setChapters(evaluatedChapters);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [book, includeLocked, currentBiorhythm]);

  // Initial fetch
  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Re-evaluate unlocks when biorhythm changes
  useEffect(() => {
    if (chapters.length > 0 && currentBiorhythm) {
      setChapters((prev) => evaluateUnlockStatus(prev, currentBiorhythm));
    }
  }, [currentBiorhythm]);

  // Enrich chapters with progress data
  const enrichWithProgress = async (
    chaptersData: Chapter[]
  ): Promise<ChapterWithProgress[]> => {
    try {
      const progressResponse = await fetch("/api/progress");
      const progressData = progressResponse.ok
        ? await progressResponse.json()
        : { data: [] };

      const progressMap = new Map<string, ChapterProgress>();

      if (progressData.success && Array.isArray(progressData.data)) {
        progressData.data.forEach((p: ChapterProgress) => {
          progressMap.set(p.chapterId, p);
        });
      }

      return chaptersData.map((chapter) => ({
        ...chapter,
        progress:
          progressMap.get(chapter.id) || createEmptyProgress(chapter.id),
      }));
    } catch {
      // If progress fetch fails, return chapters with empty progress
      return chaptersData.map((chapter) => ({
        ...chapter,
        progress: createEmptyProgress(chapter.id),
      }));
    }
  };

  // Evaluate unlock status based on biorhythm
  const evaluateUnlockStatus = (
    chaptersWithProgress: ChapterWithProgress[],
    biorhythm?: BiorhythmCycles
  ): ChapterWithProgress[] => {
    if (!biorhythm) return chaptersWithProgress;

    return chaptersWithProgress.map((chapter, index) => {
      // If already completed or in progress, keep status
      if (
        chapter.progress.status === "completed" ||
        chapter.progress.status === "inProgress"
      ) {
        return chapter;
      }

      // Check if previous chapter is completed (for sequential unlocks)
      const prevChapter = chaptersWithProgress[index - 1];
      const prevCompleted =
        !prevChapter || prevChapter.progress.status === "completed";

      // Check biorhythm unlock conditions
      const trigger = chapter.unlockTrigger;
      const cycleValue = biorhythm[trigger.cycle.type];
      const meetsThreshold = cycleValue >= trigger.cycle.threshold;

      // Check additional conditions
      const meetsAdditional = checkAdditionalConditions(
        trigger.additionalConditions,
        biorhythm,
        prevCompleted
      );

      const shouldUnlock = meetsThreshold && meetsAdditional;

      return {
        ...chapter,
        progress: {
          ...chapter.progress,
          status: shouldUnlock ? "unlocked" : "locked",
        },
      };
    });
  };

  // Update chapter progress
  const updateProgress = useCallback(
    async (
      chapterId: string,
      status: ChapterStatus,
      progressPercent?: number
    ) => {
      try {
        const response = await fetch(`/api/progress/${chapterId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            progressPercent,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update progress");
        }

        // Optimistically update local state
        setChapters((prev) =>
          prev.map((chapter) =>
            chapter.id === chapterId
              ? {
                  ...chapter,
                  progress: {
                    ...chapter.progress,
                    status,
                    progressPercent:
                      progressPercent ?? chapter.progress.progressPercent,
                    startedAt:
                      status === "inProgress" && !chapter.progress.startedAt
                        ? new Date()
                        : chapter.progress.startedAt,
                    completedAt: status === "completed" ? new Date() : null,
                  },
                }
              : chapter
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Update failed"));
        throw err;
      }
    },
    []
  );

  // Get a specific chapter
  const getChapter = useCallback(
    (chapterId: string) => {
      return chapters.find((c) => c.id === chapterId);
    },
    [chapters]
  );

  // Derived state
  const availableChapters = useMemo(
    () => chapters.filter((c) => c.progress.status !== "locked"),
    [chapters]
  );

  const currentChapter = useMemo(
    () =>
      chapters.find((c) => c.progress.status === "inProgress") ||
      chapters.find((c) => c.progress.status === "unlocked") ||
      null,
    [chapters]
  );

  const completedChapters = useMemo(
    () => chapters.filter((c) => c.progress.status === "completed"),
    [chapters]
  );

  const totalProgress = useMemo(() => {
    if (chapters.length === 0) return 0;
    const completed = chapters.filter(
      (c) => c.progress.status === "completed"
    ).length;
    return Math.round((completed / chapters.length) * 100);
  }, [chapters]);

  return {
    chapters,
    availableChapters,
    currentChapter,
    completedChapters,
    totalProgress,
    isLoading,
    error,
    refetch: fetchChapters,
    updateProgress,
    getChapter,
  };
}

/** Create empty progress object for a chapter */
function createEmptyProgress(chapterId: string): ChapterProgress {
  return {
    chapterId,
    status: "locked",
    startedAt: null,
    completedAt: null,
    progressPercent: 0,
    timeSpent: 0,
    attempts: 0,
    journalEntries: [],
  };
}

/** Check additional unlock conditions */
function checkAdditionalConditions(
  conditions: Chapter["unlockTrigger"]["additionalConditions"],
  biorhythm: BiorhythmCycles,
  prevCompleted: boolean
): boolean {
  if (!conditions) return true;

  // Check previous chapter requirement
  if (conditions.previousChapterCompleted && !prevCompleted) {
    return false;
  }

  // Check biorhythm requirements
  if (conditions.biorhythmRequirements) {
    const { physical, emotional, intellectual, spiritual } =
      conditions.biorhythmRequirements;

    if (physical && !meetsRequirement(biorhythm.physical, physical))
      return false;
    if (emotional && !meetsRequirement(biorhythm.emotional, emotional))
      return false;
    if (intellectual && !meetsRequirement(biorhythm.intellectual, intellectual))
      return false;
    if (spiritual && !meetsRequirement(biorhythm.spiritual, spiritual))
      return false;
  }

  // Check time requirements
  if (conditions.timeRequirements) {
    const now = new Date();
    const { hourOfDay, dayOfWeek } = conditions.timeRequirements;

    if (hourOfDay) {
      const currentHour = now.getHours();
      if (currentHour < hourOfDay.min || currentHour > hourOfDay.max) {
        return false;
      }
    }

    if (dayOfWeek) {
      if (!dayOfWeek.includes(now.getDay())) {
        return false;
      }
    }
  }

  return true;
}

/** Check if a biorhythm value meets a requirement */
function meetsRequirement(
  value: number,
  requirement: { min?: number; max?: number; phase?: string }
): boolean {
  if (requirement.min !== undefined && value < requirement.min) return false;
  if (requirement.max !== undefined && value > requirement.max) return false;

  if (requirement.phase) {
    const phase = getPhaseFromValue(value);
    if (phase !== requirement.phase) return false;
  }

  return true;
}

/** Get phase from biorhythm value */
function getPhaseFromValue(value: number): string {
  if (value >= 0.8) return "peak";
  if (value >= 0.3) return "high";
  if (value <= -0.8) return "critical";
  if (value <= -0.3) return "low";
  return "normal";
}
