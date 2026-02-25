/**
 * Biorhythm Calculator - Main Module Export
 * 
 * Complete biorhythm calculation engine with 4-cycle support
 * (physical, emotional, intellectual, spiritual).
 * 
 * @module biorhythm
 */

// Core calculator
export {
  calculateCycleValue,
  calculateBiorhythmCycles,
  calculateBiorhythm,
  calculateBiorhythmState,
  isCriticalDay,
  getDominantCycle,
  checkPeaks,
  getBiorhythmStatus,
  getConfigFromEnv,
  DEFAULT_CYCLE_PERIODS,
  DEFAULT_PEAK_THRESHOLD,
  DEFAULT_CRITICAL_THRESHOLD,
  DEFAULT_CONFIG,
} from './calculator';

// Validation
export {
  validateBirthDate,
  validateTimezone,
  validateDateRange,
  validateUserProfile,
  isLeapYear,
  getDaysInMonth,
} from './validation';

// Timezone utilities
export {
  convertToTimezone,
  getStartOfDayInTimezone,
  daysBetween,
  addDays,
  getCurrentDateInTimezone,
  isDST,
  getTimezoneOffset,
  normalizeToUTC,
} from './timezone';

// Peak detection
export {
  isPeak,
  findNextPeak,
  findNextPeaks,
  countPeakCycles,
  isHighEnergyDay,
  calculateAverageCycleValue,
  findHighEnergyDates,
} from './peaks';

// Predictions
export {
  generatePrediction,
  generateWeeklySummary,
  generateCustomPrediction,
  findOptimalDates,
  findChallengingDates,
  calculatePredictionStats,
} from './prediction';

// Sunrise/sunset
export {
  getSunriseSunset,
  isDaytime,
  minutesUntilNextSolarEvent,
  getSolarPosition,
  getSolarNoon,
  getSunriseSunsetForCurrentLocation,
  shouldUnlockChapter1,
} from './sunrise';

// Types from types.ts
export type {
  BiorhythmState,
  NextPeaks,
  BiorhythmPrediction,
  SunriseSunset,
  UserBiorhythmProfile,
  ValidationError,
  SunriseSunsetApiResponse,
} from './types';

// Re-export calculator types (primary source for these)
export type {
  BiorhythmValues,
  BiorhythmCycles,
  BiorhythmPeaks,
  CyclePeriods,
  BiorhythmConfig,
} from './calculator';
