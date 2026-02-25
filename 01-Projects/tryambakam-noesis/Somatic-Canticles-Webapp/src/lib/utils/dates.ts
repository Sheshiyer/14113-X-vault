/**
 * Date Utilities
 * 
 * Comprehensive date handling utilities for the Somatic Canticles webapp.
 * Includes timezone support, relative time formatting, and biorhythm-specific
 * date calculations.
 * 
 * Power numbers: 8, 13, 19, 21, 44, 125, 152
 */

import { POWER_NUMBERS } from "@/styles/design-tokens";

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Format options for date display
 */
export interface DateFormatOptions {
  /** Include time in output */
  includeTime?: boolean;
  /** Use short month names */
  shortMonth?: boolean;
  /** Include year */
  includeYear?: boolean;
  /** Use 24-hour format */
  use24Hour?: boolean;
  /** Locale for formatting */
  locale?: string;
}

/**
 * Format a date to a readable string
 * 
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date()) // "January 13, 2026"
 * formatDate(new Date(), { includeTime: true }) // "January 13, 2026 at 8:44 PM"
 * formatDate(new Date(), { shortMonth: true }) // "Jan 13, 2026"
 */
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const {
    includeTime = false,
    shortMonth = false,
    includeYear = true,
    use24Hour = false,
    locale = "en-US",
  } = options;
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return "Invalid date";
  }
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: shortMonth ? "short" : "long",
    day: "numeric",
    ...(includeYear && { year: "numeric" }),
    ...(includeTime && {
      hour: "numeric",
      minute: "2-digit",
      hour12: !use24Hour,
    }),
  };
  
  return new Intl.DateTimeFormat(locale, formatOptions).format(d);
}

/**
 * Format a date to ISO date string (YYYY-MM-DD)
 * 
 * @param date - Date to format
 * @returns ISO date string
 */
export function formatISODate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date provided");
  }
  return d.toISOString().split("T")[0];
}

/**
 * Format time only
 * 
 * @param date - Date to extract time from
 * @param use24Hour - Use 24-hour format
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | string | number,
  use24Hour: boolean = false
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid time";
  }
  
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: !use24Hour,
  }).format(d);
}

// ============================================
// CALCULATION UTILITIES
// ============================================

/**
 * Calculate days between two dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days (positive if endDate is after startDate)
 * 
 * @example
 * getDaysBetween(new Date('2026-01-01'), new Date('2026-01-13')) // 12
 */
export function getDaysBetween(
  startDate: Date | string | number,
  endDate: Date | string | number
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time components for accurate day calculation
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  
  const diffTime = endUTC - startUTC;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days since a date (from date to now)
 * 
 * @param date - Date to calculate from
 * @returns Number of days
 */
export function getDaysSince(date: Date | string | number): number {
  return getDaysBetween(date, new Date());
}

/**
 * Calculate days until a date (from now to date)
 * 
 * @param date - Date to calculate to
 * @returns Number of days (negative if date is in the past)
 */
export function getDaysUntil(date: Date | string | number): number {
  return getDaysBetween(new Date(), date);
}

/**
 * Add days to a date
 * 
 * @param date - Base date
 * @param days - Number of days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add hours to a date
 * 
 * @param date - Base date
 * @param hours - Number of hours to add
 * @returns New date
 */
export function addHours(date: Date | string | number, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Get the start of day for a date
 * 
 * @param date - Input date
 * @returns Date at start of day (00:00:00)
 */
export function startOfDay(date: Date | string | number): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of day for a date
 * 
 * @param date - Input date
 * @returns Date at end of day (23:59:59)
 */
export function endOfDay(date: Date | string | number): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Check if two dates are the same day
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 */
export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Check if a date is today
 * 
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date | string | number): boolean {
  return isSameDay(date, new Date());
}

// ============================================
// RELATIVE TIME FORMATTING
// ============================================

/**
 * Format relative time ("2 days ago", "in 3 hours")
 * 
 * @param date - Date to format
 * @param locale - Locale for formatting
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000)) // "1 day ago"
 * formatRelativeTime(new Date(Date.now() + 3600000)) // "in 1 hour"
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = "en-US"
): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  
  if (Math.abs(diffSecs) < 60) {
    return rtf.format(diffSecs, "second");
  }
  if (Math.abs(diffMins) < 60) {
    return rtf.format(diffMins, "minute");
  }
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day");
  }
  if (Math.abs(diffDays) < 365) {
    return rtf.format(Math.round(diffDays / 30), "month");
  }
  return rtf.format(Math.round(diffDays / 365), "year");
}

/**
 * Get human-readable duration
 * 
 * @param minutes - Duration in minutes
 * @returns Human-readable string
 * 
 * @example
 * formatDuration(90) // "1 hour 30 minutes"
 * formatDuration(19) // "19 minutes"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  
  return `${hours} hour${hours !== 1 ? "s" : ""} ${mins} minute${mins !== 1 ? "s" : ""}`;
}

// ============================================
// TIMEZONE UTILITIES
// ============================================

/**
 * List of valid IANA timezone identifiers
 * (Common subset for user selection)
 */
export const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
  "Pacific/Honolulu",
] as const;

export type CommonTimezone = (typeof COMMON_TIMEZONES)[number];

/**
 * Validate a timezone string
 * 
 * @param timezone - Timezone to validate
 * @returns True if valid IANA timezone
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get user's local timezone
 * 
 * @returns IANA timezone string
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convert date to specific timezone
 * 
 * @param date - Date to convert
 * @param timezone - Target timezone
 * @returns Formatted string in target timezone
 */
export function convertToTimezone(
  date: Date | string | number,
  timezone: string
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid date";
  }
  
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

/**
 * Get timezone offset in hours
 * 
 * @param timezone - Timezone to check
 * @returns Offset from UTC in hours
 */
export function getTimezoneOffset(timezone: string): number {
  const now = new Date();
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
}

// ============================================
// BIORHYTHM-SPECIFIC UTILITIES
// ============================================

/**
 * Calculate days since birth for biorhythm
 * 
 * @param birthDate - User's birth date
 * @param targetDate - Date to calculate for (defaults to now)
 * @returns Days since birth
 */
export function getDaysSinceBirth(
  birthDate: Date | string | number,
  targetDate: Date | string | number = new Date()
): number {
  return getDaysBetween(birthDate, targetDate);
}

/**
 * Get the next occurrence of a specific time
 * 
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param timezone - Optional timezone
 * @returns Date of next occurrence
 */
export function getNextOccurrence(
  hour: number,
  minute: number = 0,
  timezone?: string
): Date {
  const now = new Date();
  let next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  
  if (next <= now) {
    next = addDays(next, 1);
  }
  
  return next;
}

/**
 * Get the next occurrence of a specific day of week
 * 
 * @param dayOfWeek - Day of week (0 = Sunday, 6 = Saturday)
 * @returns Date of next occurrence
 */
export function getNextDayOfWeek(dayOfWeek: number): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntil = (dayOfWeek - currentDay + 7) % 7 || 7;
  return addDays(now, daysUntil);
}

/**
 * Check if current time is within a range
 * 
 * @param startHour - Start hour (0-23)
 * @param endHour - End hour (0-23)
 * @returns True if current time is within range
 */
export function isWithinTimeRange(startHour: number, endHour: number): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour < endHour;
  }
  // Handle overnight ranges (e.g., 22:00 - 06:00)
  return currentHour >= startHour || currentHour < endHour;
}

// ============================================
// PARSING UTILITIES
// ============================================

/**
 * Parse a date string safely
 * 
 * @param dateString - String to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Parse a birth date with validation
 * Ensures date is in reasonable range (not future, not too old)
 * 
 * @param dateString - Date string to parse
 * @returns Parsed date or null if invalid
 */
export function parseBirthDate(dateString: string): Date | null {
  const date = parseDate(dateString);
  if (!date) return null;
  
  const now = new Date();
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - 125); // Max 125 years old
  
  if (date > now || date < minDate) {
    return null;
  }
  
  return date;
}

// ============================================
// POWER NUMBER UTILITIES
// ============================================

/**
 * Check if a number of days aligns with power number cycles
 * Useful for biorhythm chapter unlocks
 * 
 * @param days - Number of days
 * @returns Object with power number alignments
 */
export function getPowerNumberAlignments(days: number): {
  octave: boolean;
  transform: boolean;
  solar: boolean;
  build: boolean;
} {
  return {
    octave: days % POWER_NUMBERS.OCTAVE === 0,
    transform: days % POWER_NUMBERS.TRANSFORM === 0,
    solar: days % POWER_NUMBERS.SOLAR === 0,
    build: days % POWER_NUMBERS.BUILD === 0,
  };
}

/**
 * Get next power number milestone
 * 
 * @param currentDay - Current day number
 * @returns Next power number milestone
 */
export function getNextPowerMilestone(currentDay: number): number {
  const milestones = [
    POWER_NUMBERS.OCTAVE,
    POWER_NUMBERS.TRANSFORM,
    POWER_NUMBERS.SOLAR,
    POWER_NUMBERS.BUILD,
    POWER_NUMBERS.WITNESS,
  ];
  
  for (const milestone of milestones) {
    if (currentDay < milestone) {
      return milestone;
    }
  }
  
  // Return next multiple of 44 if past all initial milestones
  return Math.ceil((currentDay + 1) / POWER_NUMBERS.WITNESS) * POWER_NUMBERS.WITNESS;
}

// ============================================
// EXPORTS
// ============================================

export default {
  formatDate,
  formatISODate,
  formatTime,
  formatRelativeTime,
  formatDuration,
  getDaysBetween,
  getDaysSince,
  getDaysUntil,
  addDays,
  addHours,
  startOfDay,
  endOfDay,
  isSameDay,
  isToday,
  isValidTimezone,
  getLocalTimezone,
  convertToTimezone,
  getTimezoneOffset,
  getDaysSinceBirth,
  getNextOccurrence,
  getNextDayOfWeek,
  isWithinTimeRange,
  parseDate,
  parseBirthDate,
  getPowerNumberAlignments,
  getNextPowerMilestone,
};
