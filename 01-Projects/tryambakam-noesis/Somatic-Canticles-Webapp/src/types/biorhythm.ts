/**
 * Biorhythm Types
 *
 * TypeScript type definitions for biorhythm cycles, readings, and forecasts.
 */

/** Biorhythm cycle types */
export type BiorhythmCycle = "physical" | "emotional" | "intellectual" | "spiritual";

/** Phase of a biorhythm cycle */
export type CyclePhase = "peak" | "high" | "low" | "critical" | "normal";

/** Individual biorhythm cycle value with metadata */
export interface BiorhythmValue {
  /** The cycle type */
  cycle: BiorhythmCycle;
  /** Current value (-1.0 to 1.0) */
  value: number;
  /** Current phase of the cycle */
  phase: CyclePhase;
  /** Days since birth for this reading */
  daysSinceBirth: number;
}

/** Complete biorhythm reading for a specific date */
export interface BiorhythmReading {
  /** Date of the reading */
  date: Date;
  /** All cycle values */
  cycles: BiorhythmValue[];
  /** Dominant cycle (highest value) */
  dominant: BiorhythmCycle;
  /** Cycles currently at peak */
  peaks: BiorhythmCycle[];
}

/** Biorhythm forecast with insights */
export interface BiorhythmForecast {
  /** Array of daily readings */
  readings: BiorhythmReading[];
  /** Generated insights based on the forecast */
  insights: BiorhythmInsight[];
}

/** Insight generated from biorhythm analysis */
export interface BiorhythmInsight {
  /** Type of insight */
  type: "opportunity" | "challenge" | "balance" | "transition";
  /** Date when this insight applies */
  date: Date;
  /** Human-readable description */
  description: string;
  /** Relevant cycles for this insight */
  cycles: BiorhythmCycle[];
}

/** Re-export core biorhythm types from lib for convenience */
export type {
  BiorhythmCycles,
  BiorhythmPeaks,
  BiorhythmState,
  NextPeaks,
  BiorhythmPrediction,
  CyclePeriods,
  BiorhythmConfig,
  UserBiorhythmProfile,
} from "@/lib/biorhythm";
