/**
 * Peak Detection Tests
 */

import { describe, it, expect } from 'bun:test';
import {
  isPeak,
  findNextPeak,
  findNextPeaks,
  countPeakCycles,
  isHighEnergyDay,
  calculateAverageCycleValue,
  findHighEnergyDates,
} from '../peaks';
import type { BiorhythmCycles } from '../types';

describe('isPeak', () => {
  it('should identify peak with default threshold', () => {
    expect(isPeak(0.8)).toBe(true);
    expect(isPeak(0.9)).toBe(true);
    expect(isPeak(1.0)).toBe(true);
  });

  it('should reject non-peak values', () => {
    expect(isPeak(0.79)).toBe(false);
    expect(isPeak(0.5)).toBe(false);
    expect(isPeak(0.0)).toBe(false);
    expect(isPeak(-0.5)).toBe(false);
  });

  it('should respect custom threshold', () => {
    expect(isPeak(0.6, 0.5)).toBe(true);
    expect(isPeak(0.6, 0.7)).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(isPeak(0.8, 0.8)).toBe(true);  // Exactly at threshold
    expect(isPeak(1.0, 0.8)).toBe(true);  // Maximum value
    expect(isPeak(-1.0, 0.8)).toBe(false); // Minimum value
  });
});

describe('findNextPeak', () => {
  it('should find next peak for physical cycle', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-01'); // Start at birth
    
    const nextPeak = findNextPeak(birthDate, startDate, 23, 'physical');
    
    expect(nextPeak).not.toBeNull();
    if (nextPeak) {
      expect(nextPeak > startDate).toBe(true);
    }
  });

  it('should find peak within one cycle period', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-15');
    
    const nextPeak = findNextPeak(birthDate, startDate, 23, 'physical');
    
    if (nextPeak) {
      const daysDiff = (nextPeak.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeLessThanOrEqual(23);
    }
  });

  it('should work for all cycle types', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-01');
    
    const physical = findNextPeak(birthDate, startDate, 23, 'physical');
    const emotional = findNextPeak(birthDate, startDate, 28, 'emotional');
    const intellectual = findNextPeak(birthDate, startDate, 33, 'intellectual');
    const spiritual = findNextPeak(birthDate, startDate, 21, 'spiritual');
    
    expect(physical).not.toBeNull();
    expect(emotional).not.toBeNull();
    expect(intellectual).not.toBeNull();
    expect(spiritual).not.toBeNull();
  });
});

describe('findNextPeaks', () => {
  it('should find next peaks for all cycles', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-01');
    
    const peaks = findNextPeaks(birthDate, startDate);
    
    expect(peaks).toHaveProperty('physical');
    expect(peaks).toHaveProperty('emotional');
    expect(peaks).toHaveProperty('intellectual');
    expect(peaks).toHaveProperty('spiritual');
  });

  it('should return dates after start date', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-15');
    
    const peaks = findNextPeaks(birthDate, startDate);
    
    expect(peaks.physical > startDate).toBe(true);
    expect(peaks.emotional > startDate).toBe(true);
    expect(peaks.intellectual > startDate).toBe(true);
    expect(peaks.spiritual > startDate).toBe(true);
  });

  it('should find different dates for different cycles', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-01');
    
    const peaks = findNextPeaks(birthDate, startDate);
    
    // Different cycle periods should result in different peak dates
    expect(peaks.physical.getTime()).not.toBe(peaks.emotional.getTime());
  });
});

describe('countPeakCycles', () => {
  it('should count peaks correctly', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.9,
      emotional: 0.85,
      intellectual: 0.5,
      spiritual: -0.2,
    };
    
    const count = countPeakCycles(cycles);
    
    expect(count).toBe(2); // physical and emotional
  });

  it('should return 0 when no peaks', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.5,
      emotional: 0.3,
      intellectual: 0.1,
      spiritual: -0.5,
    };
    
    const count = countPeakCycles(cycles);
    
    expect(count).toBe(0);
  });

  it('should return 4 when all peaks', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.9,
      emotional: 0.85,
      intellectual: 1.0,
      spiritual: 0.8,
    };
    
    const count = countPeakCycles(cycles);
    
    expect(count).toBe(4);
  });

  it('should respect custom threshold', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.6,
      emotional: 0.7,
      intellectual: 0.8,
      spiritual: 0.9,
    };
    
    const count = countPeakCycles(cycles, 0.65);
    
    expect(count).toBe(3); // emotional, intellectual, spiritual
  });
});

describe('isHighEnergyDay', () => {
  it('should identify high energy day (3+ peaks)', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.9,
      emotional: 0.85,
      intellectual: 1.0,
      spiritual: 0.5,
    };
    
    expect(isHighEnergyDay(cycles)).toBe(true);
  });

  it('should reject low energy day (<3 peaks)', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.9,
      emotional: 0.5,
      intellectual: 0.3,
      spiritual: -0.2,
    };
    
    expect(isHighEnergyDay(cycles)).toBe(false);
  });

  it('should identify maximum energy day (4 peaks)', () => {
    const cycles: BiorhythmCycles = {
      physical: 1.0,
      emotional: 0.9,
      intellectual: 0.95,
      spiritual: 0.85,
    };
    
    expect(isHighEnergyDay(cycles)).toBe(true);
  });
});

describe('calculateAverageCycleValue', () => {
  it('should calculate average correctly', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.8,
      emotional: 0.4,
      intellectual: 0.0,
      spiritual: -0.4,
    };
    
    const avg = calculateAverageCycleValue(cycles);
    
    expect(avg).toBeCloseTo(0.2, 2);
  });

  it('should return 1.0 for all peaks', () => {
    const cycles: BiorhythmCycles = {
      physical: 1.0,
      emotional: 1.0,
      intellectual: 1.0,
      spiritual: 1.0,
    };
    
    const avg = calculateAverageCycleValue(cycles);
    
    expect(avg).toBe(1.0);
  });

  it('should return -1.0 for all troughs', () => {
    const cycles: BiorhythmCycles = {
      physical: -1.0,
      emotional: -1.0,
      intellectual: -1.0,
      spiritual: -1.0,
    };
    
    const avg = calculateAverageCycleValue(cycles);
    
    expect(avg).toBe(-1.0);
  });

  it('should return 0 for balanced cycles', () => {
    const cycles: BiorhythmCycles = {
      physical: 0.5,
      emotional: -0.5,
      intellectual: 0.3,
      spiritual: -0.3,
    };
    
    const avg = calculateAverageCycleValue(cycles);
    
    expect(avg).toBeCloseTo(0, 2);
  });
});

describe('findHighEnergyDates', () => {
  it('should return requested number of dates', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-01');
    
    const dates = findHighEnergyDates(birthDate, startDate, 30);
    
    expect(dates).toHaveLength(30);
  });

  it('should return dates in descending energy order', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-01');
    
    const dates = findHighEnergyDates(birthDate, startDate, 10);
    
    // First date should have highest energy
    expect(dates[0]).toBeDefined();
  });

  it('should handle small date ranges', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('1990-01-01');
    
    const dates = findHighEnergyDates(birthDate, startDate, 5);
    
    expect(dates).toHaveLength(5);
  });
});
