/**
 * Biorhythm Calculator - 30-Day Prediction
 * 
 * Generates biorhythm forecasts for future dates.
 */

import type { BiorhythmPrediction, BiorhythmConfig } from './types';
import { calculateBiorhythmState, DEFAULT_CONFIG } from './calculator';
import { findNextPeaks } from './peaks';
import { addDays } from './timezone';

/**
 * Generates biorhythm predictions for the next N days
 * 
 * @param birthDate - User's birthdate
 * @param startDate - Date to start predictions from (typically current date)
 * @param days - Number of days to predict (default 30)
 * @param config - Optional configuration
 * @returns Biorhythm predictions with next peak dates
 */
export function generatePrediction(
  birthDate: Date,
  startDate: Date,
  days: number = 30,
  config: BiorhythmConfig = DEFAULT_CONFIG
): BiorhythmPrediction {
  const predictions = [];
  
  // Generate daily predictions
  for (let i = 0; i < days; i++) {
    const targetDate = addDays(startDate, i);
    const state = calculateBiorhythmState(birthDate, targetDate, config);
    predictions.push(state);
  }
  
  // Find next peak dates for each cycle
  const nextPeaks = findNextPeaks(birthDate, startDate, config);
  
  return {
    predictions,
    nextPeaks,
  };
}

/**
 * Generates weekly summary predictions (every 7 days)
 * Useful for longer-term planning with reduced data points
 * 
 * @param birthDate - User's birthdate
 * @param startDate - Date to start predictions from
 * @param weeks - Number of weeks to predict
 * @param config - Optional configuration
 * @returns Weekly biorhythm predictions
 */
export function generateWeeklySummary(
  birthDate: Date,
  startDate: Date,
  weeks: number,
  config: BiorhythmConfig = DEFAULT_CONFIG
): BiorhythmPrediction {
  const predictions = [];
  
  // Generate predictions for start of each week
  for (let i = 0; i < weeks; i++) {
    const targetDate = addDays(startDate, i * 7);
    const state = calculateBiorhythmState(birthDate, targetDate, config);
    predictions.push(state);
  }
  
  const nextPeaks = findNextPeaks(birthDate, startDate, config);
  
  return {
    predictions,
    nextPeaks,
  };
}

/**
 * Generates predictions for specific dates
 * Useful for checking biorhythm on specific important dates
 * 
 * @param birthDate - User's birthdate
 * @param dates - Array of dates to generate predictions for
 * @param config - Optional configuration
 * @returns Biorhythm predictions for specified dates
 */
export function generateCustomPrediction(
  birthDate: Date,
  dates: Date[],
  config: BiorhythmConfig = DEFAULT_CONFIG
): BiorhythmPrediction {
  const predictions = dates.map(date => 
    calculateBiorhythmState(birthDate, date, config)
  );
  
  // Use first date as start date for next peaks
  const startDate = dates.length > 0 ? dates[0] : new Date();
  const nextPeaks = findNextPeaks(birthDate, startDate, config);
  
  return {
    predictions,
    nextPeaks,
  };
}

/**
 * Finds optimal dates in prediction window
 * Returns dates where average cycle value is highest
 * 
 * @param prediction - Biorhythm prediction
 * @param count - Number of optimal dates to return
 * @returns Array of optimal dates sorted by energy level
 */
export function findOptimalDates(
  prediction: BiorhythmPrediction,
  count: number = 5
): Date[] {
  // Calculate average cycle value for each prediction
  const datesWithEnergy = prediction.predictions.map(state => ({
    date: state.date,
    energy: (
      state.cycles.physical +
      state.cycles.emotional +
      state.cycles.intellectual +
      state.cycles.spiritual
    ) / 4,
  }));
  
  // Sort by energy level (highest first)
  datesWithEnergy.sort((a, b) => b.energy - a.energy);
  
  // Return top N dates
  return datesWithEnergy.slice(0, count).map(item => item.date);
}

/**
 * Finds challenging dates in prediction window
 * Returns dates where average cycle value is lowest
 * 
 * @param prediction - Biorhythm prediction
 * @param count - Number of challenging dates to return
 * @returns Array of challenging dates sorted by energy level (lowest first)
 */
export function findChallengingDates(
  prediction: BiorhythmPrediction,
  count: number = 5
): Date[] {
  // Calculate average cycle value for each prediction
  const datesWithEnergy = prediction.predictions.map(state => ({
    date: state.date,
    energy: (
      state.cycles.physical +
      state.cycles.emotional +
      state.cycles.intellectual +
      state.cycles.spiritual
    ) / 4,
  }));
  
  // Sort by energy level (lowest first)
  datesWithEnergy.sort((a, b) => a.energy - b.energy);
  
  // Return bottom N dates
  return datesWithEnergy.slice(0, count).map(item => item.date);
}

/**
 * Calculates prediction statistics
 * 
 * @param prediction - Biorhythm prediction
 * @returns Statistical summary of prediction period
 */
export function calculatePredictionStats(prediction: BiorhythmPrediction) {
  const values = {
    physical: prediction.predictions.map(p => p.cycles.physical),
    emotional: prediction.predictions.map(p => p.cycles.emotional),
    intellectual: prediction.predictions.map(p => p.cycles.intellectual),
    spiritual: prediction.predictions.map(p => p.cycles.spiritual),
  };
  
  const calculateStats = (values: number[]) => {
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    return { avg, max, min };
  };
  
  return {
    physical: calculateStats(values.physical),
    emotional: calculateStats(values.emotional),
    intellectual: calculateStats(values.intellectual),
    spiritual: calculateStats(values.spiritual),
    peakDays: prediction.predictions.filter(p => 
      Object.values(p.peaks).some(peak => peak)
    ).length,
    highEnergyDays: prediction.predictions.filter(p => {
      const peakCount = Object.values(p.peaks).filter(peak => peak).length;
      return peakCount >= 3;
    }).length,
  };
}
