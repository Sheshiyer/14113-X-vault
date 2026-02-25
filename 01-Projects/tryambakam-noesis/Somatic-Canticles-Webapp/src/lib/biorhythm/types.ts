/**
 * Biorhythm Calculator - Type Definitions
 * 
 * TypeScript interfaces for biorhythm calculations, predictions, and related data structures.
 */

/**
 * Individual biorhythm cycle values (-1.0 to 1.0)
 * Represents current state of each cycle as sine wave value
 */
export interface BiorhythmCycles {
  physical: number;      // Physical cycle (23-day period)
  emotional: number;     // Emotional cycle (28-day period)
  intellectual: number;  // Intellectual cycle (33-day period)
  spiritual: number;     // Spiritual cycle (21-day period, custom)
}

/**
 * Peak status for each biorhythm cycle
 * Peak defined as cycle value >= threshold (default 0.8)
 */
export interface BiorhythmPeaks {
  physical: boolean;
  emotional: boolean;
  intellectual: boolean;
  spiritual: boolean;
}

/**
 * Complete biorhythm state for a specific date
 */
export interface BiorhythmState {
  date: Date;
  cycles: BiorhythmCycles;
  peaks: BiorhythmPeaks;
  daysSinceBirth: number;
}

/**
 * Next predicted peak dates for each cycle
 */
export interface NextPeaks {
  physical: Date;
  emotional: Date;
  intellectual: Date;
  spiritual: Date;
}

/**
 * 30-day biorhythm forecast
 */
export interface BiorhythmPrediction {
  predictions: BiorhythmState[];
  nextPeaks: NextPeaks;
}

/**
 * Sunrise and sunset times for a location and date
 */
export interface SunriseSunset {
  sunrise: Date;
  sunset: Date;
  dayLength: number; // hours
}

/**
 * Cycle periods in days (configurable via environment)
 * @deprecated Use CyclePeriods from calculator instead
 */
export interface CyclePeriods {
  physical: number;      // Default: 23 days
  emotional: number;     // Default: 28 days
  intellectual: number;  // Default: 33 days
  spiritual: number;     // Default: 21 days
}

/**
 * Biorhythm calculator configuration
 */
export interface BiorhythmConfig {
  periods: CyclePeriods;
  peakThreshold: number; // Default: 0.8
}

/**
 * User profile for biorhythm calculations
 */
export interface UserBiorhythmProfile {
  birthDate: Date;
  timezone: string; // IANA timezone string
}

/**
 * Validation error for birthdate input
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Sunrise/Sunset API response (sunrise-sunset.org)
 */
export interface SunriseSunsetApiResponse {
  results: {
    sunrise: string;      // ISO 8601 format
    sunset: string;       // ISO 8601 format
    solar_noon: string;
    day_length: string;   // seconds as string
  };
  status: 'OK' | 'INVALID_REQUEST' | 'INVALID_DATE' | 'UNKNOWN_ERROR';
}
