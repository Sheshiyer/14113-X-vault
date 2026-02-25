/**
 * Timezone Tests
 */

import { describe, it, expect } from 'bun:test';
import {
  daysBetween,
  addDays,
  normalizeToUTC,
  isLeapYear,
} from '../timezone';

describe('daysBetween', () => {
  it('should calculate days between dates correctly', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(30);
  });

  it('should return 0 for same date', () => {
    const date = new Date('2024-01-01');
    
    const days = daysBetween(date, date);
    
    expect(days).toBe(0);
  });

  it('should handle negative ranges', () => {
    const start = new Date('2024-01-31');
    const end = new Date('2024-01-01');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(-30);
  });

  it('should ignore time components', () => {
    const start = new Date('2024-01-01T10:30:00');
    const end = new Date('2024-01-02T15:45:00');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(1);
  });

  it('should handle dates across years', () => {
    const start = new Date('2023-12-31');
    const end = new Date('2024-01-01');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(1);
  });

  it('should handle leap years correctly', () => {
    const start = new Date('2024-02-28');
    const end = new Date('2024-03-01');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(2); // 2024 is leap year, Feb has 29 days
  });

  it('should handle non-leap years correctly', () => {
    const start = new Date('2023-02-28');
    const end = new Date('2023-03-01');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(1); // 2023 is not leap year
  });
});

describe('addDays', () => {
  it('should add days correctly', () => {
    const date = new Date('2024-01-01');
    const result = addDays(date, 10);
    
    expect(result.getDate()).toBe(11);
    expect(result.getMonth()).toBe(0); // January
  });

  it('should handle month boundaries', () => {
    const date = new Date('2024-01-31');
    const result = addDays(date, 1);
    
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(1); // February
  });

  it('should handle year boundaries', () => {
    const date = new Date('2023-12-31');
    const result = addDays(date, 1);
    
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2024);
  });

  it('should handle negative days', () => {
    const date = new Date('2024-01-15');
    const result = addDays(date, -5);
    
    expect(result.getDate()).toBe(10);
  });

  it('should handle zero days', () => {
    const date = new Date('2024-01-15');
    const result = addDays(date, 0);
    
    expect(result.getDate()).toBe(15);
  });

  it('should not mutate original date', () => {
    const date = new Date('2024-01-01');
    const original = date.getTime();
    
    addDays(date, 10);
    
    expect(date.getTime()).toBe(original);
  });
});

describe('normalizeToUTC', () => {
  it('should normalize date to UTC midnight', () => {
    const date = new Date('2024-01-15T15:30:00');
    const normalized = normalizeToUTC(date);
    
    expect(normalized.getUTCHours()).toBe(0);
    expect(normalized.getUTCMinutes()).toBe(0);
    expect(normalized.getUTCSeconds()).toBe(0);
    expect(normalized.getUTCMilliseconds()).toBe(0);
  });

  it('should preserve date components', () => {
    const date = new Date('2024-03-15T15:30:00');
    const normalized = normalizeToUTC(date);
    
    expect(normalized.getUTCFullYear()).toBe(2024);
    expect(normalized.getUTCMonth()).toBe(2); // March (0-indexed)
    expect(normalized.getUTCDate()).toBe(15);
  });

  it('should handle dates at midnight', () => {
    const date = new Date('2024-01-15T00:00:00');
    const normalized = normalizeToUTC(date);
    
    expect(normalized.getUTCHours()).toBe(0);
  });
});

describe('Edge Cases', () => {
  it('should handle daysBetween with very large date ranges', () => {
    const start = new Date('1990-01-01');
    const end = new Date('2024-01-01');
    
    const days = daysBetween(start, end);
    
    // 34 years, accounting for leap years
    expect(days).toBeGreaterThan(12400);
    expect(days).toBeLessThan(12500);
  });

  it('should handle addDays with large numbers', () => {
    const date = new Date('2024-01-01');
    const result = addDays(date, 365);
    
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(11); // December
    expect(result.getDate()).toBe(31); // 2024 is leap year, so day 366
  });

  it('should handle leap year boundaries in daysBetween', () => {
    const start = new Date('2024-02-28');
    const end = new Date('2024-03-01');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(2); // Includes Feb 29
  });

  it('should handle century boundary (non-leap year)', () => {
    const start = new Date('1900-02-28');
    const end = new Date('1900-03-01');
    
    const days = daysBetween(start, end);
    
    expect(days).toBe(1); // 1900 is not a leap year
  });
});
