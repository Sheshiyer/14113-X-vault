/**
 * Prediction Tests
 */

import { describe, it, expect } from 'bun:test';
import {
  generatePrediction,
  generateWeeklySummary,
  generateCustomPrediction,
  findOptimalDates,
  findChallengingDates,
  calculatePredictionStats,
} from '../prediction';

describe('generatePrediction', () => {
  it('should generate 30-day prediction by default', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate);
    
    expect(prediction.predictions).toHaveLength(30);
  });

  it('should generate custom number of days', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 10);
    
    expect(prediction.predictions).toHaveLength(10);
  });

  it('should include next peaks', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate);
    
    expect(prediction.nextPeaks).toHaveProperty('physical');
    expect(prediction.nextPeaks).toHaveProperty('emotional');
    expect(prediction.nextPeaks).toHaveProperty('intellectual');
    expect(prediction.nextPeaks).toHaveProperty('spiritual');
  });

  it('should have sequential dates', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 5);
    
    for (let i = 1; i < prediction.predictions.length; i++) {
      const prev = prediction.predictions[i - 1].date;
      const curr = prediction.predictions[i].date;
      
      const dayDiff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      expect(dayDiff).toBe(1);
    }
  });

  it('should include complete state for each prediction', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 5);
    
    prediction.predictions.forEach(state => {
      expect(state).toHaveProperty('date');
      expect(state).toHaveProperty('cycles');
      expect(state).toHaveProperty('peaks');
      expect(state).toHaveProperty('daysSinceBirth');
    });
  });
});

describe('generateWeeklySummary', () => {
  it('should generate weekly predictions', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const summary = generateWeeklySummary(birthDate, startDate, 4);
    
    expect(summary.predictions).toHaveLength(4);
  });

  it('should have 7-day gaps between predictions', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const summary = generateWeeklySummary(birthDate, startDate, 3);
    
    for (let i = 1; i < summary.predictions.length; i++) {
      const prev = summary.predictions[i - 1].date;
      const curr = summary.predictions[i].date;
      
      const dayDiff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      expect(dayDiff).toBe(7);
    }
  });

  it('should include next peaks', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const summary = generateWeeklySummary(birthDate, startDate, 4);
    
    expect(summary.nextPeaks).toBeDefined();
  });
});

describe('generateCustomPrediction', () => {
  it('should generate predictions for specified dates', () => {
    const birthDate = new Date('1990-01-01');
    const dates = [
      new Date('2024-01-15'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
    ];
    
    const prediction = generateCustomPrediction(birthDate, dates);
    
    expect(prediction.predictions).toHaveLength(3);
  });

  it('should match specified dates', () => {
    const birthDate = new Date('1990-01-01');
    const dates = [
      new Date('2024-01-15'),
      new Date('2024-02-01'),
    ];
    
    const prediction = generateCustomPrediction(birthDate, dates);
    
    expect(prediction.predictions[0].date.getTime()).toBe(dates[0].getTime());
    expect(prediction.predictions[1].date.getTime()).toBe(dates[1].getTime());
  });

  it('should handle empty date array', () => {
    const birthDate = new Date('1990-01-01');
    const dates: Date[] = [];
    
    const prediction = generateCustomPrediction(birthDate, dates);
    
    expect(prediction.predictions).toHaveLength(0);
  });

  it('should handle non-sequential dates', () => {
    const birthDate = new Date('1990-01-01');
    const dates = [
      new Date('2024-03-01'),
      new Date('2024-01-15'),
      new Date('2024-02-01'),
    ];
    
    const prediction = generateCustomPrediction(birthDate, dates);
    
    expect(prediction.predictions).toHaveLength(3);
  });
});

describe('findOptimalDates', () => {
  it('should return requested number of dates', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const optimal = findOptimalDates(prediction, 5);
    
    expect(optimal).toHaveLength(5);
  });

  it('should return dates from prediction', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 10);
    const optimal = findOptimalDates(prediction, 3);
    
    optimal.forEach(date => {
      const found = prediction.predictions.some(p => 
        p.date.getTime() === date.getTime()
      );
      expect(found).toBe(true);
    });
  });

  it('should handle count larger than predictions', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 5);
    const optimal = findOptimalDates(prediction, 10);
    
    expect(optimal.length).toBeLessThanOrEqual(5);
  });
});

describe('findChallengingDates', () => {
  it('should return requested number of dates', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const challenging = findChallengingDates(prediction, 5);
    
    expect(challenging).toHaveLength(5);
  });

  it('should return dates from prediction', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 10);
    const challenging = findChallengingDates(prediction, 3);
    
    challenging.forEach(date => {
      const found = prediction.predictions.some(p => 
        p.date.getTime() === date.getTime()
      );
      expect(found).toBe(true);
    });
  });

  it('should return different dates than optimal', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const optimal = findOptimalDates(prediction, 5);
    const challenging = findChallengingDates(prediction, 5);
    
    // Should be mostly different dates (unless all energy levels are similar)
    const overlap = optimal.filter(date => 
      challenging.some(d => d.getTime() === date.getTime())
    );
    
    expect(overlap.length).toBeLessThan(5);
  });
});

describe('calculatePredictionStats', () => {
  it('should calculate stats for all cycles', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const stats = calculatePredictionStats(prediction);
    
    expect(stats).toHaveProperty('physical');
    expect(stats).toHaveProperty('emotional');
    expect(stats).toHaveProperty('intellectual');
    expect(stats).toHaveProperty('spiritual');
  });

  it('should include avg, max, min for each cycle', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const stats = calculatePredictionStats(prediction);
    
    expect(stats.physical).toHaveProperty('avg');
    expect(stats.physical).toHaveProperty('max');
    expect(stats.physical).toHaveProperty('min');
  });

  it('should have max >= avg >= min', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const stats = calculatePredictionStats(prediction);
    
    expect(stats.physical.max).toBeGreaterThanOrEqual(stats.physical.avg);
    expect(stats.physical.avg).toBeGreaterThanOrEqual(stats.physical.min);
  });

  it('should count peak days', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const stats = calculatePredictionStats(prediction);
    
    expect(stats.peakDays).toBeGreaterThanOrEqual(0);
    expect(stats.peakDays).toBeLessThanOrEqual(30);
  });

  it('should count high energy days', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const prediction = generatePrediction(birthDate, startDate, 30);
    const stats = calculatePredictionStats(prediction);
    
    expect(stats.highEnergyDays).toBeGreaterThanOrEqual(0);
    expect(stats.highEnergyDays).toBeLessThanOrEqual(stats.peakDays);
  });
});

describe('Performance', () => {
  it('should generate 30-day prediction in <50ms', () => {
    const birthDate = new Date('1990-01-01');
    const startDate = new Date('2024-01-01');
    
    const start = performance.now();
    generatePrediction(birthDate, startDate, 30);
    const elapsed = performance.now() - start;
    
    expect(elapsed).toBeLessThan(50);
  });
});
