"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  calculateBiorhythmCycles,
  calculateBiorhythmState,
  findNextPeaks,
  isPeak,
  type BiorhythmCycles,
  type BiorhythmState,
  type NextPeaks,
  type BiorhythmConfig,
  DEFAULT_CONFIG,
  addDays,
} from "@/lib/biorhythm";
import type {
  BiorhythmCycle,
  BiorhythmReading,
  BiorhythmForecast,
  BiorhythmInsight,
} from "@/types";

export interface UseBiorhythmOptions {
  /** User's birth date */
  birthDate: Date;
  /** Target date (defaults to now) */
  targetDate?: Date;
  /** Number of days for forecast */
  forecastDays?: number;
  /** Custom biorhythm configuration */
  config?: BiorhythmConfig;
  /** Enable auto-refresh at midnight */
  autoRefresh?: boolean;
}

export interface UseBiorhythmReturn {
  /** Current biorhythm cycles */
  cycles: BiorhythmCycles;
  /** Current complete biorhythm state */
  currentReading: BiorhythmReading;
  /** Forecast for upcoming days */
  forecast: BiorhythmForecast;
  /** Next peak dates for each cycle */
  nextPeaks: NextPeaks;
  /** Currently peaking cycles */
  peakingCycles: BiorhythmCycle[];
  /** Whether cycles are loading */
  isLoading: boolean;
  /** Error if calculation failed */
  error: Error | null;
  /** Manually recalculate biorhythm */
  recalculate: () => void;
  /** Get reading for a specific date */
  getReadingForDate: (date: Date) => BiorhythmReading;
}

/**
 * Hook for calculating and managing biorhythm cycles
 *
 * Features:
 * - Real-time biorhythm calculation from birth date
 * - 30-day forecast with insights
 * - Peak detection for all cycles
 * - Auto-refresh at midnight
 */
export function useBiorhythm({
  birthDate,
  targetDate: initialTargetDate,
  forecastDays = 30,
  config = DEFAULT_CONFIG,
  autoRefresh = true,
}: UseBiorhythmOptions): UseBiorhythmReturn {
  const [targetDate, setTargetDate] = useState<Date>(initialTargetDate || new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const midnightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current biorhythm cycles
  const cycles = useMemo(() => {
    try {
      return calculateBiorhythmCycles(birthDate, targetDate, config);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to calculate biorhythm"));
      return {
        physical: 0,
        emotional: 0,
        intellectual: 0,
        spiritual: 0,
      };
    }
  }, [birthDate, targetDate, config]);

  // Calculate current complete state
  const currentState = useMemo<BiorhythmState>(() => {
    try {
      return calculateBiorhythmState(birthDate, targetDate, config);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to calculate biorhythm state"));
      return {
        date: targetDate,
        cycles,
        peaks: {
          physical: false,
          emotional: false,
          intellectual: false,
          spiritual: false,
        },
        daysSinceBirth: 0,
      };
    }
  }, [birthDate, targetDate, config, cycles]);

  // Find next peaks
  const nextPeaks = useMemo(() => {
    try {
      return findNextPeaks(birthDate, targetDate, config);
    } catch (err) {
      return {
        physical: addDays(targetDate, 6),
        emotional: addDays(targetDate, 7),
        intellectual: addDays(targetDate, 8),
        spiritual: addDays(targetDate, 5),
      };
    }
  }, [birthDate, targetDate, config]);

  // Calculate peaking cycles
  const peakingCycles = useMemo<BiorhythmCycle[]>(() => {
    const peaks: BiorhythmCycle[] = [];
    if (isPeak(cycles.physical, config.peakThreshold)) peaks.push("physical");
    if (isPeak(cycles.emotional, config.peakThreshold)) peaks.push("emotional");
    if (isPeak(cycles.intellectual, config.peakThreshold)) peaks.push("intellectual");
    if (isPeak(cycles.spiritual, config.peakThreshold)) peaks.push("spiritual");
    return peaks;
  }, [cycles, config.peakThreshold]);

  // Build current reading
  const currentReading: BiorhythmReading = useMemo(() => {
    const cycleValues = [
      {
        cycle: "physical" as BiorhythmCycle,
        value: cycles.physical,
        phase: getPhase(cycles.physical),
        daysSinceBirth: currentState.daysSinceBirth,
      },
      {
        cycle: "emotional" as BiorhythmCycle,
        value: cycles.emotional,
        phase: getPhase(cycles.emotional),
        daysSinceBirth: currentState.daysSinceBirth,
      },
      {
        cycle: "intellectual" as BiorhythmCycle,
        value: cycles.intellectual,
        phase: getPhase(cycles.intellectual),
        daysSinceBirth: currentState.daysSinceBirth,
      },
      {
        cycle: "spiritual" as BiorhythmCycle,
        value: cycles.spiritual,
        phase: getPhase(cycles.spiritual),
        daysSinceBirth: currentState.daysSinceBirth,
      },
    ];

    const dominant = cycleValues.reduce((max, curr) =>
      curr.value > max.value ? curr : max
    ).cycle;

    return {
      date: targetDate,
      cycles: cycleValues,
      dominant,
      peaks: peakingCycles,
    };
  }, [cycles, currentState.daysSinceBirth, peakingCycles, targetDate]);

  // Generate forecast
  const forecast = useMemo<BiorhythmForecast>(() => {
    const readings: BiorhythmReading[] = [];
    const insights: BiorhythmInsight[] = [];

    for (let i = 0; i < forecastDays; i++) {
      const date = addDays(targetDate, i);
      const state = calculateBiorhythmState(birthDate, date, config);

      const cycleValues = [
        {
          cycle: "physical" as BiorhythmCycle,
          value: state.cycles.physical,
          phase: getPhase(state.cycles.physical),
          daysSinceBirth: state.daysSinceBirth,
        },
        {
          cycle: "emotional" as BiorhythmCycle,
          value: state.cycles.emotional,
          phase: getPhase(state.cycles.emotional),
          daysSinceBirth: state.daysSinceBirth,
        },
        {
          cycle: "intellectual" as BiorhythmCycle,
          value: state.cycles.intellectual,
          phase: getPhase(state.cycles.intellectual),
          daysSinceBirth: state.daysSinceBirth,
        },
        {
          cycle: "spiritual" as BiorhythmCycle,
          value: state.cycles.spiritual,
          phase: getPhase(state.cycles.spiritual),
          daysSinceBirth: state.daysSinceBirth,
        },
      ];

      const dominant = cycleValues.reduce((max, curr) =>
        curr.value > max.value ? curr : max
      ).cycle;

      const peaks: BiorhythmCycle[] = [];
      if (state.peaks.physical) peaks.push("physical");
      if (state.peaks.emotional) peaks.push("emotional");
      if (state.peaks.intellectual) peaks.push("intellectual");
      if (state.peaks.spiritual) peaks.push("spiritual");

      readings.push({
        date,
        cycles: cycleValues,
        dominant,
        peaks,
      });

      // Generate insights for significant days
      const peakCount = peaks.length;
      if (peakCount >= 3) {
        insights.push({
          type: "opportunity",
          date,
          description: `High-energy day with ${peakCount} cycles at peak. Ideal for deep practice.`,
          cycles: peaks,
        });
      } else if (peakCount === 0) {
        const avgEnergy =
          (state.cycles.physical +
            state.cycles.emotional +
            state.cycles.intellectual +
            state.cycles.spiritual) /
          4;
        if (avgEnergy < -0.3) {
          insights.push({
            type: "challenge",
            date,
            description: "Low energy day. Consider gentle practice and rest.",
            cycles: ["physical", "emotional", "intellectual", "spiritual"],
          });
        }
      }
    }

    return { readings, insights };
  }, [birthDate, targetDate, forecastDays, config]);

  // Get reading for a specific date
  const getReadingForDate = useCallback(
    (date: Date): BiorhythmReading => {
      const state = calculateBiorhythmState(birthDate, date, config);

      const cycleValues = [
        {
          cycle: "physical" as BiorhythmCycle,
          value: state.cycles.physical,
          phase: getPhase(state.cycles.physical),
          daysSinceBirth: state.daysSinceBirth,
        },
        {
          cycle: "emotional" as BiorhythmCycle,
          value: state.cycles.emotional,
          phase: getPhase(state.cycles.emotional),
          daysSinceBirth: state.daysSinceBirth,
        },
        {
          cycle: "intellectual" as BiorhythmCycle,
          value: state.cycles.intellectual,
          phase: getPhase(state.cycles.intellectual),
          daysSinceBirth: state.daysSinceBirth,
        },
        {
          cycle: "spiritual" as BiorhythmCycle,
          value: state.cycles.spiritual,
          phase: getPhase(state.cycles.spiritual),
          daysSinceBirth: state.daysSinceBirth,
        },
      ];

      const dominant = cycleValues.reduce((max, curr) =>
        curr.value > max.value ? curr : max
      ).cycle;

      const peaks: BiorhythmCycle[] = [];
      if (state.peaks.physical) peaks.push("physical");
      if (state.peaks.emotional) peaks.push("emotional");
      if (state.peaks.intellectual) peaks.push("intellectual");
      if (state.peaks.spiritual) peaks.push("spiritual");

      return {
        date,
        cycles: cycleValues,
        dominant,
        peaks,
      };
    },
    [birthDate, config]
  );

  // Recalculate function
  const recalculate = useCallback(() => {
    setIsLoading(true);
    setTargetDate(new Date());
    setIsLoading(false);
  }, []);

  // Auto-refresh at midnight
  useEffect(() => {
    if (!autoRefresh) return;

    const scheduleMidnightRefresh = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      midnightTimeoutRef.current = setTimeout(() => {
        recalculate();
        scheduleMidnightRefresh(); // Schedule next refresh
      }, msUntilMidnight);
    };

    scheduleMidnightRefresh();

    return () => {
      if (midnightTimeoutRef.current) {
        clearTimeout(midnightTimeoutRef.current);
      }
    };
  }, [autoRefresh, recalculate]);

  return {
    cycles,
    currentReading,
    forecast,
    nextPeaks,
    peakingCycles,
    isLoading,
    error,
    recalculate,
    getReadingForDate,
  };
}

/** Helper function to determine phase from cycle value */
function getPhase(value: number): "peak" | "high" | "low" | "critical" | "normal" {
  if (value >= 0.8) return "peak";
  if (value >= 0.3) return "high";
  if (value <= -0.8) return "critical";
  if (value <= -0.3) return "low";
  return "normal";
}
