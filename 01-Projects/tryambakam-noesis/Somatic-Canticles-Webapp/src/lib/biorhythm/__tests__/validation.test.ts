/**
 * Validation Tests
 */

import { describe, it, expect } from 'bun:test';
import {
  validateBirthDate,
  validateTimezone,
  validateDateRange,
  validateUserProfile,
  isLeapYear,
  getDaysInMonth,
} from '../validation';

describe('validateBirthDate', () => {
  it('should accept valid birthdate', () => {
    const birthDate = new Date('1990-01-01');
    const errors = validateBirthDate(birthDate);
    
    expect(errors).toHaveLength(0);
  });

  it('should reject future dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    const errors = validateBirthDate(futureDate);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('future');
  });

  it('should reject dates before 1900', () => {
    const oldDate = new Date('1899-12-31');
    const errors = validateBirthDate(oldDate);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('1900');
  });

  it('should reject invalid date objects', () => {
    const invalidDate = new Date('invalid');
    const errors = validateBirthDate(invalidDate);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('Invalid');
  });

  it('should accept date exactly on January 1, 1900', () => {
    const borderDate = new Date('1900-01-01');
    const errors = validateBirthDate(borderDate);
    
    expect(errors).toHaveLength(0);
  });

  it('should accept today as birthdate', () => {
    const today = new Date();
    const errors = validateBirthDate(today);
    
    expect(errors).toHaveLength(0);
  });
});

describe('validateTimezone', () => {
  it('should accept valid IANA timezones', () => {
    const validTimezones = [
      'UTC',
      'America/New_York',
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];
    
    validTimezones.forEach(tz => {
      const errors = validateTimezone(tz);
      expect(errors).toHaveLength(0);
    });
  });

  it('should reject invalid timezone strings', () => {
    const errors = validateTimezone('Invalid/Timezone');
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('Invalid');
  });

  it('should reject empty timezone', () => {
    const errors = validateTimezone('');
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('required');
  });

  it('should reject non-string timezone', () => {
    const errors = validateTimezone(null as any);
    
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateDateRange', () => {
  it('should accept valid date range', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    const errors = validateDateRange(startDate, endDate);
    
    expect(errors).toHaveLength(0);
  });

  it('should reject end date before start date', () => {
    const startDate = new Date('2024-01-31');
    const endDate = new Date('2024-01-01');
    
    const errors = validateDateRange(startDate, endDate);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('after');
  });

  it('should reject equal start and end dates', () => {
    const date = new Date('2024-01-01');
    
    const errors = validateDateRange(date, date);
    
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should reject invalid start date', () => {
    const invalidDate = new Date('invalid');
    const endDate = new Date('2024-01-31');
    
    const errors = validateDateRange(invalidDate, endDate);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('start date');
  });

  it('should reject invalid end date', () => {
    const startDate = new Date('2024-01-01');
    const invalidDate = new Date('invalid');
    
    const errors = validateDateRange(startDate, invalidDate);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('end date');
  });
});

describe('validateUserProfile', () => {
  it('should accept valid profile', () => {
    const birthDate = new Date('1990-01-01');
    const timezone = 'America/New_York';
    
    const errors = validateUserProfile(birthDate, timezone);
    
    expect(errors).toHaveLength(0);
  });

  it('should combine validation errors', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const invalidTimezone = 'Invalid/Zone';
    
    const errors = validateUserProfile(futureDate, invalidTimezone);
    
    expect(errors.length).toBeGreaterThan(1); // Multiple errors
  });

  it('should validate birthdate', () => {
    const invalidDate = new Date('invalid');
    const timezone = 'UTC';
    
    const errors = validateUserProfile(invalidDate, timezone);
    
    expect(errors.some(e => e.field === 'birthDate')).toBe(true);
  });

  it('should validate timezone', () => {
    const birthDate = new Date('1990-01-01');
    const invalidTimezone = '';
    
    const errors = validateUserProfile(birthDate, invalidTimezone);
    
    expect(errors.some(e => e.field === 'timezone')).toBe(true);
  });
});

describe('isLeapYear', () => {
  it('should identify leap years correctly', () => {
    expect(isLeapYear(2000)).toBe(true); // Divisible by 400
    expect(isLeapYear(2004)).toBe(true); // Divisible by 4
    expect(isLeapYear(2020)).toBe(true); // Divisible by 4
    expect(isLeapYear(2024)).toBe(true); // Divisible by 4
  });

  it('should identify non-leap years correctly', () => {
    expect(isLeapYear(1900)).toBe(false); // Divisible by 100 but not 400
    expect(isLeapYear(2001)).toBe(false); // Not divisible by 4
    expect(isLeapYear(2100)).toBe(false); // Divisible by 100 but not 400
  });

  it('should handle edge cases', () => {
    expect(isLeapYear(1600)).toBe(true);  // Divisible by 400
    expect(isLeapYear(1700)).toBe(false); // Divisible by 100 but not 400
    expect(isLeapYear(1800)).toBe(false); // Divisible by 100 but not 400
  });
});

describe('getDaysInMonth', () => {
  it('should return correct days for each month', () => {
    expect(getDaysInMonth(2024, 0)).toBe(31);  // January
    expect(getDaysInMonth(2024, 1)).toBe(29);  // February (leap year)
    expect(getDaysInMonth(2024, 2)).toBe(31);  // March
    expect(getDaysInMonth(2024, 3)).toBe(30);  // April
    expect(getDaysInMonth(2024, 4)).toBe(31);  // May
    expect(getDaysInMonth(2024, 5)).toBe(30);  // June
    expect(getDaysInMonth(2024, 6)).toBe(31);  // July
    expect(getDaysInMonth(2024, 7)).toBe(31);  // August
    expect(getDaysInMonth(2024, 8)).toBe(30);  // September
    expect(getDaysInMonth(2024, 9)).toBe(31);  // October
    expect(getDaysInMonth(2024, 10)).toBe(30); // November
    expect(getDaysInMonth(2024, 11)).toBe(31); // December
  });

  it('should handle February in leap years', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29); // Leap year
    expect(getDaysInMonth(2000, 1)).toBe(29); // Leap year
  });

  it('should handle February in non-leap years', () => {
    expect(getDaysInMonth(2023, 1)).toBe(28); // Non-leap year
    expect(getDaysInMonth(1900, 1)).toBe(28); // Non-leap year
  });
});
