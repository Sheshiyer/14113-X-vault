/**
 * Biorhythm Calculator
 * 
 * Core calculation engine for biorhythm cycles.
 * Supports 4 cycles: physical (23 days), emotional (28 days), 
 * intellectual (33 days), and spiritual (21 days).
 */

export interface BiorhythmValues {
  physical: number;
  emotional: number;
  intellectual: number;
}

export interface BiorhythmCycles {
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
}

export interface BiorhythmPeaks {
  physical: boolean;
  emotional: boolean;
  intellectual: boolean;
  spiritual: boolean;
}

// Cycle periods in days
export const DEFAULT_CYCLE_PERIODS: CyclePeriods = {
  physical: 23,
  emotional: 28,
  intellectual: 33,
  spiritual: 21,
};

// Peak threshold - cycles above this value are considered "peaks"
export const DEFAULT_PEAK_THRESHOLD = 0.8;

// Critical threshold - cycles near zero are considered "critical"
export const DEFAULT_CRITICAL_THRESHOLD = 0.1;

export interface CyclePeriods {
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
}

export interface BiorhythmConfig {
  periods: CyclePeriods;
  peakThreshold: number;
  criticalThreshold: number;
}

export const DEFAULT_CONFIG: BiorhythmConfig = {
  periods: DEFAULT_CYCLE_PERIODS,
  peakThreshold: DEFAULT_PEAK_THRESHOLD,
  criticalThreshold: DEFAULT_CRITICAL_THRESHOLD,
};

/**
 * Calculate days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return diffTime / (1000 * 60 * 60 * 24);
}

/**
 * Calculate a single cycle value using sine wave formula
 */
export function calculateCycleValue(days: number, period: number): number {
  return Math.sin((2 * Math.PI * days) / period);
}

/**
 * Calculate all 4 biorhythm cycles for a given birth date and target date
 */
export function calculateBiorhythmCycles(
  birthDate: Date,
  targetDate: Date,
  config: Partial<BiorhythmConfig> = {}
): BiorhythmCycles {
  const periods = config.periods || DEFAULT_CYCLE_PERIODS;
  const days = daysBetween(birthDate, targetDate);

  return {
    physical: calculateCycleValue(days, periods.physical),
    emotional: calculateCycleValue(days, periods.emotional),
    intellectual: calculateCycleValue(days, periods.intellectual),
    spiritual: calculateCycleValue(days, periods.spiritual),
  };
}

/**
 * Legacy function for backwards compatibility - calculates 3 cycles
 */
export function calculateBiorhythm(birthDate: Date, targetDate: Date): BiorhythmValues {
  const cycles = calculateBiorhythmCycles(birthDate, targetDate);
  return {
    physical: cycles.physical,
    emotional: cycles.emotional,
    intellectual: cycles.intellectual,
  };
}

/**
 * Get the status category for a cycle value
 */
export function getBiorhythmStatus(value: number): "high" | "low" | "critical" {
  if (value > 0.5) return "high";
  if (value < -0.5) return "low";
  return "critical";
}

/**
 * Determine the dominant cycle (the one with highest absolute value)
 */
export function getDominantCycle(cycles: BiorhythmCycles): string {
  const entries = Object.entries(cycles) as [keyof BiorhythmCycles, number][];
  const dominant = entries.reduce((max, [cycle, value]) => {
    return Math.abs(value) > Math.abs(max.value) ? { cycle, value } : max;
  }, { cycle: entries[0][0], value: entries[0][1] });

  return dominant.cycle;
}

/**
 * Check which cycles are at peak (above threshold)
 */
export function checkPeaks(
  cycles: BiorhythmCycles,
  threshold: number = DEFAULT_PEAK_THRESHOLD
): BiorhythmPeaks {
  return {
    physical: cycles.physical >= threshold,
    emotional: cycles.emotional >= threshold,
    intellectual: cycles.intellectual >= threshold,
    spiritual: cycles.spiritual >= threshold,
  };
}

/**
 * Check if any cycle is in critical zone (near zero crossing)
 */
export function isCriticalDay(
  cycles: BiorhythmCycles,
  threshold: number = DEFAULT_CRITICAL_THRESHOLD
): boolean {
  return (
    Math.abs(cycles.physical) < threshold ||
    Math.abs(cycles.emotional) < threshold ||
    Math.abs(cycles.intellectual) < threshold ||
    Math.abs(cycles.spiritual) < threshold
  );
}

/**
 * Calculate complete biorhythm state for a date
 */
export function calculateBiorhythmState(
  birthDate: Date,
  targetDate: Date,
  config: Partial<BiorhythmConfig> = {}
) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const cycles = calculateBiorhythmCycles(birthDate, targetDate, fullConfig);
  const peaks = checkPeaks(cycles, fullConfig.peakThreshold);
  const dominant = getDominantCycle(cycles);
  const critical = isCriticalDay(cycles, fullConfig.criticalThreshold);
  const days = daysBetween(birthDate, targetDate);

  return {
    date: targetDate,
    cycles,
    peaks,
    dominant,
    isCriticalDay: critical,
    daysSinceBirth: Math.floor(days),
  };
}

/**
 * Get configuration from environment variables
 */
export function getConfigFromEnv(): Partial<BiorhythmConfig> {
  const config: Partial<BiorhythmConfig> = {};

  if (process.env.BIORHYTHM_PEAK_THRESHOLD) {
    config.peakThreshold = parseFloat(process.env.BIORHYTHM_PEAK_THRESHOLD);
  }

  if (process.env.BIORHYTHM_CRITICAL_THRESHOLD) {
    config.criticalThreshold = parseFloat(process.env.BIORHYTHM_CRITICAL_THRESHOLD);
  }

  const periods: Partial<CyclePeriods> = {};
  
  if (process.env.BIORHYTHM_PHYSICAL_PERIOD) {
    periods.physical = parseInt(process.env.BIORHYTHM_PHYSICAL_PERIOD, 10);
  }
  if (process.env.BIORHYTHM_EMOTIONAL_PERIOD) {
    periods.emotional = parseInt(process.env.BIORHYTHM_EMOTIONAL_PERIOD, 10);
  }
  if (process.env.BIORHYTHM_INTELLECTUAL_PERIOD) {
    periods.intellectual = parseInt(process.env.BIORHYTHM_INTELLECTUAL_PERIOD, 10);
  }
  if (process.env.BIORHYTHM_SPIRITUAL_PERIOD) {
    periods.spiritual = parseInt(process.env.BIORHYTHM_SPIRITUAL_PERIOD, 10);
  }

  if (Object.keys(periods).length > 0) {
    config.periods = { ...DEFAULT_CYCLE_PERIODS, ...periods };
  }

  return config;
}
