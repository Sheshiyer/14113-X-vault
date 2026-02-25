/**
 * Biorhythm Calculator - Input Validation
 * 
 * Validates birthdate, timezone, and date range inputs for biorhythm calculations.
 */

import type { ValidationError } from './types';

/**
 * Minimum valid birthdate (1900-01-01)
 */
const MIN_BIRTH_YEAR = 1900;

/**
 * Gets maximum valid birthdate (current date)
 * Using function to ensure we get current date at validation time, not module load time
 */
const getMaxBirthDate = () => new Date();

/**
 * Validates birthdate input
 * 
 * @param birthDate - Date to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateBirthDate(birthDate: Date): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if date is valid
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    errors.push({
      field: 'birthDate',
      message: 'Invalid date format',
    });
    return errors;
  }

  // Check if date is in future (allow today)
  const maxDate = getMaxBirthDate();
  maxDate.setHours(23, 59, 59, 999); // End of today
  if (birthDate > maxDate) {
    errors.push({
      field: 'birthDate',
      message: 'Birthdate cannot be in the future',
    });
  }

  // Check if date is too old (before 1900)
  if (birthDate.getFullYear() < MIN_BIRTH_YEAR) {
    errors.push({
      field: 'birthDate',
      message: `Birthdate must be after ${MIN_BIRTH_YEAR}`,
    });
  }

  return errors;
}

/**
 * List of valid IANA timezone strings (common timezones)
 * For complete validation, use Intl.supportedValuesOf('timeZone') in Node 18+
 */
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

/**
 * Validates IANA timezone string
 * 
 * @param timezone - Timezone string to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateTimezone(timezone: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!timezone || typeof timezone !== 'string') {
    errors.push({
      field: 'timezone',
      message: 'Timezone is required',
    });
    return errors;
  }

  // Try to use the timezone with Intl.DateTimeFormat
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
  } catch (e) {
    errors.push({
      field: 'timezone',
      message: `Invalid timezone: ${timezone}`,
    });
  }

  return errors;
}

/**
 * Validates date range for predictions
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of validation errors (empty if valid)
 */
export function validateDateRange(
  startDate: Date,
  endDate: Date
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate start date
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    errors.push({
      field: 'startDate',
      message: 'Invalid start date format',
    });
    return errors;
  }

  // Validate end date
  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    errors.push({
      field: 'endDate',
      message: 'Invalid end date format',
    });
    return errors;
  }

  // Check if end date is after start date
  if (endDate <= startDate) {
    errors.push({
      field: 'dateRange',
      message: 'End date must be after start date',
    });
  }

  return errors;
}

/**
 * Validates complete user biorhythm profile
 * 
 * @param birthDate - User's birthdate
 * @param timezone - User's timezone
 * @returns Array of validation errors (empty if valid)
 */
export function validateUserProfile(
  birthDate: Date,
  timezone: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  errors.push(...validateBirthDate(birthDate));
  errors.push(...validateTimezone(timezone));

  return errors;
}

/**
 * Checks if date is a leap year
 * 
 * @param year - Year to check
 * @returns True if leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets number of days in a month, accounting for leap years
 * 
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Number of days in month
 */
export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 1 && isLeapYear(year)) {
    return 29;
  }

  return daysInMonth[month];
}
