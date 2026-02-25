/**
 * Biorhythm Calculator - Peak Detection
 * 
 * Detects peaks and finds next peak dates for biorhythm cycles.
 * Peak defined as cycle value >= threshold (default 0.8)
 */

import type { BiorhythmCycles, NextPeaks, BiorhythmConfig } from './types';
import { calculateBiorhythmCycles, DEFAULT_CONFIG } from './calculator';
import { addDays } from './timezone';

/**
 * Determines if a cycle value represents a peak
 * 
 * @param cycleValue - Cycle value (-1.0 to 1.0)
 * @param threshold - Peak threshold (default 0.8)
 * @returns True if value is at or above threshold
 */
export function isPeak(cycleValue: number, threshold: number = 0.8): boolean {
  return cycleValue >= threshold;
}

/**
 * Finds the next peak date for a specific cycle
 * Searches up to 2 full cycle periods ahead
 * 
 * @param birthDate - User's birthdate
 * @param startDate - Date to start search from
 * @param cyclePeriod - Length of cycle in days
 * @param cycleType - Type of cycle to check
 * @param config - Optional configuration
 * @returns Date of next peak, or null if none found within search window
 */
export function findNextPeak(
  birthDate: Date,
  startDate: Date,
  cyclePeriod: number,
  cycleType: keyof BiorhythmCycles,
  config: BiorhythmConfig = DEFAULT_CONFIG
): Date | null {
  // Search up to 2 full cycle periods (ensures we find at least one peak)
  const maxDaysToSearch = cyclePeriod * 2;
  
  for (let i = 1; i <= maxDaysToSearch; i++) {
    const checkDate = addDays(startDate, i);
    const cycles = calculateBiorhythmCycles(birthDate, checkDate, config);
    
    if (isPeak(cycles[cycleType], config.peakThreshold)) {
      return checkDate;
    }
  }
  
  return null;
}

/**
 * Finds next peak dates for all biorhythm cycles
 * 
 * @param birthDate - User's birthdate
 * @param startDate - Date to start search from (typically current date)
 * @param config - Optional configuration
 * @returns Next peak dates for all cycles
 */
export function findNextPeaks(
  birthDate: Date,
  startDate: Date,
  config: BiorhythmConfig = DEFAULT_CONFIG
): NextPeaks {
  const physicalPeak = findNextPeak(
    birthDate,
    startDate,
    config.periods.physical,
    'physical',
    config
  );
  
  const emotionalPeak = findNextPeak(
    birthDate,
    startDate,
    config.periods.emotional,
    'emotional',
    config
  );
  
  const intellectualPeak = findNextPeak(
    birthDate,
    startDate,
    config.periods.intellectual,
    'intellectual',
    config
  );
  
  const spiritualPeak = findNextPeak(
    birthDate,
    startDate,
    config.periods.spiritual,
    'spiritual',
    config
  );

  // Fallback to approximate dates if exact peak not found
  return {
    physical: physicalPeak || addDays(startDate, config.periods.physical / 4),
    emotional: emotionalPeak || addDays(startDate, config.periods.emotional / 4),
    intellectual: intellectualPeak || addDays(startDate, config.periods.intellectual / 4),
    spiritual: spiritualPeak || addDays(startDate, config.periods.spiritual / 4),
  };
}

/**
 * Checks if multiple cycles are simultaneously at peak (high synergy day)
 * 
 * @param cycles - Biorhythm cycle values
 * @param threshold - Peak threshold
 * @returns Number of cycles at peak
 */
export function countPeakCycles(
  cycles: BiorhythmCycles,
  threshold: number = 0.8
): number {
  let count = 0;
  
  if (isPeak(cycles.physical, threshold)) count++;
  if (isPeak(cycles.emotional, threshold)) count++;
  if (isPeak(cycles.intellectual, threshold)) count++;
  if (isPeak(cycles.spiritual, threshold)) count++;
  
  return count;
}

/**
 * Determines if it's a high-energy day (3+ cycles at peak)
 * 
 * @param cycles - Biorhythm cycle values
 * @param threshold - Peak threshold
 * @returns True if 3 or more cycles at peak
 */
export function isHighEnergyDay(
  cycles: BiorhythmCycles,
  threshold: number = 0.8
): boolean {
  return countPeakCycles(cycles, threshold) >= 3;
}

/**
 * Calculates average cycle value across all cycles
 * Useful for overall energy level assessment
 * 
 * @param cycles - Biorhythm cycle values
 * @returns Average value (-1.0 to 1.0)
 */
export function calculateAverageCycleValue(cycles: BiorhythmCycles): number {
  return (
    cycles.physical +
    cycles.emotional +
    cycles.intellectual +
    cycles.spiritual
  ) / 4;
}

/**
 * Finds dates with highest overall energy in a given period
 * 
 * @param birthDate - User's birthdate
 * @param startDate - Period start date
 * @param days - Number of days to search
 * @param config - Optional configuration
 * @returns Array of dates sorted by energy level (highest first)
 */
export function findHighEnergyDates(
  birthDate: Date,
  startDate: Date,
  days: number,
  config: BiorhythmConfig = DEFAULT_CONFIG
): Date[] {
  const energyDates: { date: Date; energy: number }[] = [];
  
  for (let i = 0; i < days; i++) {
    const checkDate = addDays(startDate, i);
    const cycles = calculateBiorhythmCycles(birthDate, checkDate, config);
    const energy = calculateAverageCycleValue(cycles);
    
    energyDates.push({ date: checkDate, energy });
  }
  
  // Sort by energy level (highest first)
  energyDates.sort((a, b) => b.energy - a.energy);
  
  return energyDates.map(item => item.date);
}
