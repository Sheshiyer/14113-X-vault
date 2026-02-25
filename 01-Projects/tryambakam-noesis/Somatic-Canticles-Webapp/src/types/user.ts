/**
 * User Types
 *
 * TypeScript type definitions for user data, profiles, and preferences.
 */

/** Audio quality settings */
export type AudioQuality = "low" | "medium" | "high";

/** Theme preference */
export type ThemePreference = "light" | "dark" | "system";

/** Base user interface */
export interface User {
  /** Unique identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  name: string;
  /** User's birth date for biorhythm calculations */
  birthDate: Date;
  /** User's timezone (IANA format) */
  timezone: string;
  /** Account creation timestamp */
  createdAt: Date;
}

/** User streak information */
export interface UserStreak {
  /** Current streak count in days */
  current: number;
  /** Longest streak achieved */
  longest: number;
  /** Last check-in timestamp */
  lastCheckIn: Date | null;
}

/** User notification preferences */
export interface NotificationPreferences {
  /** Enable daily reminders */
  dailyReminder: boolean;
  /** Enable chapter unlock notifications */
  chapterUnlock: boolean;
  /** Enable streak warnings */
  streakWarning: boolean;
  /** Enable weekly insights */
  weeklyInsights: boolean;
  /** Preferred reminder time (24h format, e.g., "09:00") */
  reminderTime: string;
}

/** Audio settings */
export interface AudioSettings {
  /** Audio quality level */
  quality: AudioQuality;
  /** Default volume (0-1) */
  defaultVolume: number;
  /** Enable background sounds */
  backgroundSounds: boolean;
  /** Auto-play next chapter */
  autoPlayNext: boolean;
  /** Enable audio download for offline */
  offlineMode: boolean;
}

/** User preferences */
export interface UserPreferences {
  /** Notification settings */
  notifications: NotificationPreferences;
  /** Theme preference */
  theme: ThemePreference;
  /** Audio settings */
  audioSettings: AudioSettings;
  /** Language code (e.g., "en", "es") */
  language: string;
}

/** Extended user profile with preferences and stats */
export interface UserProfile extends User {
  /** User's avatar URL */
  avatar?: string;
  /** User preferences */
  preferences: UserPreferences;
  /** Streak information */
  streak: UserStreak;
  /** Account last updated */
  updatedAt: Date;
}

/** User session information */
export interface UserSession {
  /** User ID */
  userId: string;
  /** Session token */
  token: string;
  /** Session expiration timestamp */
  expiresAt: Date;
}

/** Legacy user stats for backward compatibility */
export interface UserStats {
  /** Total chapters completed */
  totalChaptersCompleted: number;
  /** Total listening time in seconds */
  totalListeningTime: number;
  /** Current streak */
  currentStreak: number;
  /** Longest streak achieved */
  longestStreak: number;
  /** Last active timestamp */
  lastActiveAt?: Date;
}
