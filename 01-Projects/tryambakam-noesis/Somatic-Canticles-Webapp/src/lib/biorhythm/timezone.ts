/**
 * Biorhythm Calculator - Timezone Utilities
 * 
 * Handles timezone conversions and date calculations across timezones.
 */

/**
 * Converts a date to a specific timezone
 * 
 * @param date - Date to convert
 * @param timezone - Target IANA timezone
 * @returns Date object representing the same moment in target timezone
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  // Get the date string in target timezone
  const dateString = date.toLocaleString('en-US', { timeZone: timezone });
  return new Date(dateString);
}

/**
 * Gets the start of day (00:00:00) in a specific timezone
 * 
 * @param date - Date to get start of day for
 * @param timezone - IANA timezone
 * @returns Date object at 00:00:00 in target timezone
 */
export function getStartOfDayInTimezone(date: Date, timezone: string): Date {
  const year = date.toLocaleString('en-US', { 
    timeZone: timezone, 
    year: 'numeric' 
  });
  const month = date.toLocaleString('en-US', { 
    timeZone: timezone, 
    month: '2-digit' 
  });
  const day = date.toLocaleString('en-US', { 
    timeZone: timezone, 
    day: '2-digit' 
  });

  // Create date string in ISO format for the timezone
  const dateString = `${year}-${month}-${day}T00:00:00`;
  
  // Parse in local timezone, then adjust to target timezone
  const localDate = new Date(dateString);
  
  // Get timezone offset difference
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(localDate);
  const tzYear = parts.find(p => p.type === 'year')!.value;
  const tzMonth = parts.find(p => p.type === 'month')!.value;
  const tzDay = parts.find(p => p.type === 'day')!.value;

  return new Date(`${tzYear}-${tzMonth}-${tzDay}T00:00:00`);
}

/**
 * Calculates number of days between two dates (ignoring time)
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of full days between dates
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  // Reset times to midnight for accurate day counting
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Adds days to a date, handling DST transitions
 * 
 * @param date - Starting date
 * @param days - Number of days to add
 * @param timezone - Optional timezone for DST handling
 * @returns New date with days added
 */
export function addDays(date: Date, days: number, timezone?: string): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  
  if (timezone) {
    // Ensure we maintain the same time of day in the target timezone
    const originalHour = date.getHours();
    const resultHour = result.getHours();
    
    // Adjust for DST if hour changed unexpectedly
    if (originalHour !== resultHour) {
      result.setHours(originalHour);
    }
  }
  
  return result;
}

/**
 * Gets the current date in a specific timezone
 * 
 * @param timezone - IANA timezone
 * @returns Current date in target timezone
 */
export function getCurrentDateInTimezone(timezone: string): Date {
  return convertToTimezone(new Date(), timezone);
}

/**
 * Checks if a date falls during DST in a timezone
 * 
 * @param date - Date to check
 * @param timezone - IANA timezone
 * @returns True if date is during DST
 */
export function isDST(date: Date, timezone: string): boolean {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  
  const janOffset = getTimezoneOffset(jan, timezone);
  const julOffset = getTimezoneOffset(jul, timezone);
  const dateOffset = getTimezoneOffset(date, timezone);
  
  return Math.min(janOffset, julOffset) === dateOffset;
}

/**
 * Gets timezone offset in minutes for a date
 * 
 * @param date - Date to check
 * @param timezone - IANA timezone
 * @returns Offset in minutes from UTC
 */
export function getTimezoneOffset(date: Date, timezone: string): number {
  // Format date in both UTC and target timezone
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  
  // Calculate difference in minutes
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
}

/**
 * Normalizes a date to midnight UTC
 * 
 * @param date - Date to normalize
 * @returns Date at 00:00:00 UTC
 */
export function normalizeToUTC(date: Date): Date {
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  ));
}
