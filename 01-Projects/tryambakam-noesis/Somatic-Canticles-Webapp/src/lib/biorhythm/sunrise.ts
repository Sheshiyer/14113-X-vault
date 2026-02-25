/**
 * Biorhythm Calculator - Sunrise/Sunset API Integration
 * 
 * Fetches sunrise and sunset times for location and date.
 * Uses sunrise-sunset.org API (free, no API key required).
 * For Chapter 1 unlock timing based on solar cycles.
 */

import type { SunriseSunset, SunriseSunsetApiResponse } from './types';

/**
 * Default API URL for sunrise-sunset.org
 */
const DEFAULT_API_URL = 'https://api.sunrise-sunset.org/json';

/**
 * Fetches sunrise and sunset times for a location and date
 * 
 * @param latitude - Latitude (-90 to 90)
 * @param longitude - Longitude (-180 to 180)
 * @param date - Date to get sunrise/sunset for
 * @param timezone - IANA timezone for result conversion
 * @returns Sunrise/sunset times and day length
 * @throws Error if API request fails
 */
export async function getSunriseSunset(
  latitude: number,
  longitude: number,
  date: Date,
  timezone: string = 'UTC'
): Promise<SunriseSunset> {
  // Validate coordinates
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  // Format date as YYYY-MM-DD
  const dateString = date.toISOString().split('T')[0];

  // Get API URL from environment or use default
  const apiUrl = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUNRISE_API_URL
    ? process.env.NEXT_PUBLIC_SUNRISE_API_URL
    : DEFAULT_API_URL;

  // Build request URL
  const url = `${apiUrl}?lat=${latitude}&lng=${longitude}&date=${dateString}&formatted=0`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SunriseSunsetApiResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`API error: ${data.status}`);
    }

    // Parse ISO 8601 times
    const sunrise = new Date(data.results.sunrise);
    const sunset = new Date(data.results.sunset);

    // Calculate day length in hours
    const dayLengthMs = sunset.getTime() - sunrise.getTime();
    const dayLength = dayLengthMs / (1000 * 60 * 60);

    // Convert times to user's timezone if needed
    const formatInTimezone = (date: Date): Date => {
      if (timezone === 'UTC') return date;
      
      const formatted = date.toLocaleString('en-US', { timeZone: timezone });
      return new Date(formatted);
    };

    return {
      sunrise: formatInTimezone(sunrise),
      sunset: formatInTimezone(sunset),
      dayLength,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch sunrise/sunset data: ${error.message}`);
    }
    throw new Error('Failed to fetch sunrise/sunset data: Unknown error');
  }
}

/**
 * Checks if current time is between sunrise and sunset (daytime)
 * 
 * @param sunriseSunset - Sunrise/sunset data
 * @param currentTime - Current time to check (defaults to now)
 * @returns True if currently daytime
 */
export function isDaytime(
  sunriseSunset: SunriseSunset,
  currentTime: Date = new Date()
): boolean {
  return (
    currentTime >= sunriseSunset.sunrise &&
    currentTime <= sunriseSunset.sunset
  );
}

/**
 * Calculates time until next sunrise or sunset
 * 
 * @param sunriseSunset - Sunrise/sunset data
 * @param currentTime - Current time (defaults to now)
 * @returns Minutes until next solar event
 */
export function minutesUntilNextSolarEvent(
  sunriseSunset: SunriseSunset,
  currentTime: Date = new Date()
): number {
  const now = currentTime.getTime();
  const sunrise = sunriseSunset.sunrise.getTime();
  const sunset = sunriseSunset.sunset.getTime();

  let nextEvent: number;

  if (now < sunrise) {
    nextEvent = sunrise;
  } else if (now < sunset) {
    nextEvent = sunset;
  } else {
    // After sunset, calculate next sunrise (tomorrow)
    // Approximate: add 24 hours to sunrise time
    nextEvent = sunrise + (24 * 60 * 60 * 1000);
  }

  const diffMs = nextEvent - now;
  return Math.floor(diffMs / (1000 * 60));
}

/**
 * Gets solar position (percentage of day completed)
 * 0.0 = sunrise, 0.5 = noon, 1.0 = sunset
 * 
 * @param sunriseSunset - Sunrise/sunset data
 * @param currentTime - Current time (defaults to now)
 * @returns Solar position (0.0 to 1.0), or -1 if nighttime
 */
export function getSolarPosition(
  sunriseSunset: SunriseSunset,
  currentTime: Date = new Date()
): number {
  if (!isDaytime(sunriseSunset, currentTime)) {
    return -1;
  }

  const now = currentTime.getTime();
  const sunrise = sunriseSunset.sunrise.getTime();
  const sunset = sunriseSunset.sunset.getTime();

  const dayLength = sunset - sunrise;
  const timeSinceSunrise = now - sunrise;

  return timeSinceSunrise / dayLength;
}

/**
 * Calculates solar noon (midpoint between sunrise and sunset)
 * 
 * @param sunriseSunset - Sunrise/sunset data
 * @returns Solar noon time
 */
export function getSolarNoon(sunriseSunset: SunriseSunset): Date {
  const sunrise = sunriseSunset.sunrise.getTime();
  const sunset = sunriseSunset.sunset.getTime();
  const noon = (sunrise + sunset) / 2;

  return new Date(noon);
}

/**
 * Gets sunrise/sunset for current location using browser geolocation
 * Browser-only function
 * 
 * @param date - Date to get sunrise/sunset for
 * @param timezone - IANA timezone
 * @returns Promise with sunrise/sunset data
 */
export async function getSunriseSunsetForCurrentLocation(
  date: Date,
  timezone: string = 'UTC'
): Promise<SunriseSunset> {
  // Check if running in browser with geolocation support
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Geolocation not supported');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await getSunriseSunset(
            position.coords.latitude,
            position.coords.longitude,
            date,
            timezone
          );
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      }
    );
  });
}

/**
 * Determines if Chapter 1 should be unlocked based on sunrise
 * Chapter 1 unlocks at sunrise
 * 
 * @param sunriseSunset - Sunrise/sunset data
 * @param currentTime - Current time (defaults to now)
 * @returns True if Chapter 1 should be unlocked
 */
export function shouldUnlockChapter1(
  sunriseSunset: SunriseSunset,
  currentTime: Date = new Date()
): boolean {
  return currentTime >= sunriseSunset.sunrise;
}
