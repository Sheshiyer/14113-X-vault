"use client";

import { useState, useCallback, useRef } from "react";
import type {
  Chapter,
  BiorhythmCycles,
  ChapterStatus,
} from "@/types";

export interface UseUnlockOptions {
  /** User's birth date */
  birthDate?: Date;
  /** Callback when unlock succeeds */
  onUnlock?: (chapterId: string) => void;
  /** Callback when unlock fails */
  onUnlockFailed?: (chapterId: string, reason: string) => void;
}

export interface UnlockCheckResult {
  /** Whether the chapter can be unlocked */
  canUnlock: boolean;
  /** Reason if cannot unlock */
  reason?: string;
  /** Progress toward unlock (0-1) */
  progress: number;
  /** Specific requirements status */
  requirements: {
    biorhythmMet: boolean;
    previousChapterMet: boolean;
    timeRequirementsMet: boolean;
    additionalConditionsMet: boolean;
  };
}

export interface UseUnlockReturn {
  /** Currently unlocking chapter ID */
  unlockingChapterId: string | null;
  /** Whether unlock animation should play */
  showUnlockAnimation: boolean;
  /** Progress of current unlock attempt */
  unlockProgress: number;
  /** Error if unlock failed */
  error: Error | null;
  /** Check if a chapter can be unlocked */
  checkUnlock: (
    chapter: Chapter,
    currentBiorhythm: BiorhythmCycles,
    previousChapterStatus?: ChapterStatus
  ) => UnlockCheckResult;
  /** Attempt to unlock a chapter */
  unlockChapter: (
    chapterId: string,
    currentBiorhythm: BiorhythmCycles,
    previousChapterStatus?: ChapterStatus
  ) => Promise<boolean>;
  /** Trigger unlock animation */
  triggerUnlockAnimation: () => void;
  /** Dismiss unlock animation */
  dismissUnlockAnimation: () => void;
  /** Reset unlock state */
  reset: () => void;
}

/**
 * Hook for managing chapter unlocks
 *
 * Features:
 * - Check if chapter can be unlocked
 * - Trigger unlock animation
 * - Handle unlock API call
 * - Provide detailed unlock requirements status
 */
export function useUnlock({
  onUnlock,
  onUnlockFailed,
}: UseUnlockOptions = {}): UseUnlockReturn {
  const [unlockingChapterId, setUnlockingChapterId] = useState<string | null>(
    null
  );
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if chapter can be unlocked
  const checkUnlock = useCallback(
    (
      chapter: Chapter,
      currentBiorhythm: BiorhythmCycles,
      previousChapterStatus?: ChapterStatus
    ): UnlockCheckResult => {
      const trigger = chapter.unlockTrigger;
      const requirements = {
        biorhythmMet: false,
        previousChapterMet: true,
        timeRequirementsMet: true,
        additionalConditionsMet: true,
      };

      // Check primary biorhythm requirement
      const cycleValue = currentBiorhythm[trigger.cycle.type];
      requirements.biorhythmMet = cycleValue >= trigger.cycle.threshold;

      // Check additional conditions
      if (trigger.additionalConditions) {
        const { additionalConditions } = trigger;

        // Check previous chapter requirement
        if (additionalConditions.previousChapterCompleted) {
          requirements.previousChapterMet = previousChapterStatus === "completed";
        }

        // Check biorhythm requirements
        if (additionalConditions.biorhythmRequirements) {
          const { physical, emotional, intellectual, spiritual } =
            additionalConditions.biorhythmRequirements;

          if (physical && !meetsRequirement(currentBiorhythm.physical, physical)) {
            requirements.additionalConditionsMet = false;
          }
          if (
            emotional &&
            !meetsRequirement(currentBiorhythm.emotional, emotional)
          ) {
            requirements.additionalConditionsMet = false;
          }
          if (
            intellectual &&
            !meetsRequirement(currentBiorhythm.intellectual, intellectual)
          ) {
            requirements.additionalConditionsMet = false;
          }
          if (
            spiritual &&
            !meetsRequirement(currentBiorhythm.spiritual, spiritual)
          ) {
            requirements.additionalConditionsMet = false;
          }
        }

        // Check time requirements
        if (additionalConditions.timeRequirements) {
          const now = new Date();
          const { hourOfDay, dayOfWeek } = additionalConditions.timeRequirements;

          if (hourOfDay) {
            const currentHour = now.getHours();
            if (currentHour < hourOfDay.min || currentHour > hourOfDay.max) {
              requirements.timeRequirementsMet = false;
            }
          }

          if (dayOfWeek) {
            if (!dayOfWeek.includes(now.getDay())) {
              requirements.timeRequirementsMet = false;
            }
          }
        }

        // Check days since registration (simplified - would need user data)
        if (additionalConditions.daysSinceRegistration) {
          // This would require access to user registration date
          // For now, assume met
        }
      }

      const canUnlock =
        requirements.biorhythmMet &&
        requirements.previousChapterMet &&
        requirements.timeRequirementsMet &&
        requirements.additionalConditionsMet;

      // Calculate progress toward unlock
      const progress = calculateUnlockProgress(
        currentBiorhythm,
        trigger,
        requirements
      );

      // Generate reason if cannot unlock
      let reason: string | undefined;
      if (!canUnlock) {
        const reasons: string[] = [];
        if (!requirements.biorhythmMet) {
          reasons.push(
            `${trigger.cycle.type} cycle needs to be at ${Math.round(
              trigger.cycle.threshold * 100
            )}% or higher`
          );
        }
        if (!requirements.previousChapterMet) {
          reasons.push("Previous chapter must be completed");
        }
        if (!requirements.timeRequirementsMet) {
          reasons.push("Time requirements not met");
        }
        if (!requirements.additionalConditionsMet) {
          reasons.push("Additional conditions not met");
        }
        reason = reasons.join("; ");
      }

      return {
        canUnlock,
        reason,
        progress,
        requirements,
      };
    },
    []
  );

  // Attempt to unlock a chapter
  const unlockChapter = useCallback(
    async (
      chapterId: string,
      currentBiorhythm: BiorhythmCycles,
      previousChapterStatus?: ChapterStatus
    ): Promise<boolean> => {
      setUnlockingChapterId(chapterId);
      setUnlockProgress(0);
      setError(null);

      try {
        // Simulate progress
        setUnlockProgress(25);

        // Fetch chapter details
        const response = await fetch(`/api/chapters/${chapterId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chapter");
        }

        setUnlockProgress(50);

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error?.message || "Chapter not found");
        }

        const chapter: Chapter = data.data;

        // Check if can unlock
        const checkResult = checkUnlock(
          chapter,
          currentBiorhythm,
          previousChapterStatus
        );

        setUnlockProgress(75);

        if (!checkResult.canUnlock) {
          onUnlockFailed?.(chapterId, checkResult.reason || "Requirements not met");
          setUnlockingChapterId(null);
          return false;
        }

        // Call unlock API
        const unlockResponse = await fetch(`/api/chapters/${chapterId}/unlock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            biorhythmSnapshot: currentBiorhythm,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!unlockResponse.ok) {
          throw new Error("Unlock request failed");
        }

        setUnlockProgress(100);

        // Trigger unlock animation
        triggerUnlockAnimation();

        // Call success callback
        onUnlock?.(chapterId);

        return true;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unlock failed");
        setError(error);
        onUnlockFailed?.(chapterId, error.message);
        return false;
      } finally {
        setUnlockingChapterId(null);
      }
    },
    [checkUnlock, onUnlock, onUnlockFailed]
  );

  // Trigger unlock animation
  const triggerUnlockAnimation = useCallback(() => {
    setShowUnlockAnimation(true);

    // Auto-dismiss after 5 seconds
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setShowUnlockAnimation(false);
    }, 5000);
  }, []);

  // Dismiss unlock animation
  const dismissUnlockAnimation = useCallback(() => {
    setShowUnlockAnimation(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setUnlockingChapterId(null);
    setShowUnlockAnimation(false);
    setUnlockProgress(0);
    setError(null);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  }, []);

  return {
    unlockingChapterId,
    showUnlockAnimation,
    unlockProgress,
    error,
    checkUnlock,
    unlockChapter,
    triggerUnlockAnimation,
    dismissUnlockAnimation,
    reset,
  };
}

/** Check if a biorhythm value meets a requirement */
function meetsRequirement(
  value: number,
  requirement: { min?: number; max?: number; phase?: string }
): boolean {
  if (requirement.min !== undefined && value < requirement.min) return false;
  if (requirement.max !== undefined && value > requirement.max) return false;
  return true;
}

/** Calculate progress toward unlock (0-1) */
function calculateUnlockProgress(
  biorhythm: BiorhythmCycles,
  trigger: Chapter["unlockTrigger"],
  requirements: UnlockCheckResult["requirements"]
): number {
  let score = 0;
  let maxScore = 0;

  // Primary biorhythm requirement
  maxScore += 1;
  const cycleValue = biorhythm[trigger.cycle.type];
  const biorhythmProgress = Math.max(
    0,
    Math.min(1, (cycleValue + 1) / (trigger.cycle.threshold + 1))
  );
  if (requirements.biorhythmMet) score += 1;
  else score += biorhythmProgress * 0.5;

  // Previous chapter
  if (trigger.additionalConditions?.previousChapterCompleted) {
    maxScore += 1;
    if (requirements.previousChapterMet) score += 1;
  }

  // Time requirements
  if (trigger.additionalConditions?.timeRequirements) {
    maxScore += 0.5;
    if (requirements.timeRequirementsMet) score += 0.5;
  }

  // Additional conditions
  if (trigger.additionalConditions?.biorhythmRequirements) {
    maxScore += 0.5;
    if (requirements.additionalConditionsMet) score += 0.5;
  }

  return maxScore > 0 ? score / maxScore : 0;
}
