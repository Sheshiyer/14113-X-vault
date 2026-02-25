/**
 * Streak Model
 * Tracks user streak continuity across 5 streak types
 */

import type { DatabaseClient } from '../database/client';
import { generateUUID, formatDate, unixTimestamp } from '../database/client';

export type StreakType = 'daily' | 'morning' | 'flow' | 'solar' | 'build';

export interface Streak {
  id: string;
  user_id: string;
  streak_type: StreakType;
  current_count: number;
  longest_count: number;
  last_activity_date: string | null; // ISO 8601: YYYY-MM-DD
  started_at: number;
  updated_at: number;
}

export interface CreateStreakInput {
  user_id: string;
  streak_type: StreakType;
}

export class StreakModel {
  constructor(private db: DatabaseClient) {}

  /**
   * Create a new streak
   */
  async create(input: CreateStreakInput): Promise<Streak> {
    const id = generateUUID();
    const now = unixTimestamp();

    const sql = `
      INSERT INTO streaks (id, user_id, streak_type, started_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `;

    const streak = await this.db.queryOne<Streak>(sql, [
      id,
      input.user_id,
      input.streak_type,
      now,
      now,
    ]);

    if (!streak) throw new Error('Failed to create streak');
    return streak;
  }

  /**
   * Find streak by user and type
   */
  async findByUserAndType(
    userId: string,
    streakType: StreakType
  ): Promise<Streak | null> {
    const sql = 'SELECT * FROM streaks WHERE user_id = ? AND streak_type = ?';
    return await this.db.queryOne<Streak>(sql, [userId, streakType]);
  }

  /**
   * Get or create streak (ensures streak exists)
   */
  async getOrCreate(userId: string, streakType: StreakType): Promise<Streak> {
    const existing = await this.findByUserAndType(userId, streakType);
    if (existing) return existing;

    return await this.create({ user_id: userId, streak_type: streakType });
  }

  /**
   * Get all streaks for a user
   */
  async findByUserId(userId: string): Promise<Streak[]> {
    const sql = 'SELECT * FROM streaks WHERE user_id = ? ORDER BY streak_type';
    return await this.db.query<Streak>(sql, [userId]);
  }

  /**
   * Increment streak (called when user completes daily activity)
   */
  async increment(
    userId: string,
    streakType: StreakType,
    activityDate: Date = new Date()
  ): Promise<Streak> {
    const streak = await this.getOrCreate(userId, streakType);
    const today = formatDate(activityDate);
    const yesterday = formatDate(
      new Date(activityDate.getTime() - 24 * 60 * 60 * 1000)
    );

    let newCount = 1;

    // Check if streak continues from yesterday
    if (streak.last_activity_date === yesterday) {
      newCount = streak.current_count + 1;
    } else if (streak.last_activity_date === today) {
      // Already logged today, no change
      return streak;
    }
    // If last_activity_date is older than yesterday, streak breaks → reset to 1

    const newLongest = Math.max(newCount, streak.longest_count);

    const sql = `
      UPDATE streaks 
      SET current_count = ?,
          longest_count = ?,
          last_activity_date = ?,
          updated_at = ?
      WHERE user_id = ? AND streak_type = ?
      RETURNING *
    `;

    const updated = await this.db.queryOne<Streak>(sql, [
      newCount,
      newLongest,
      today,
      unixTimestamp(),
      userId,
      streakType,
    ]);

    if (!updated) throw new Error('Failed to update streak');
    return updated;
  }

  /**
   * Break streak (reset current_count to 0)
   */
  async breakStreak(userId: string, streakType: StreakType): Promise<Streak> {
    const sql = `
      UPDATE streaks 
      SET current_count = 0,
          updated_at = ?
      WHERE user_id = ? AND streak_type = ?
      RETURNING *
    `;

    const updated = await this.db.queryOne<Streak>(sql, [
      unixTimestamp(),
      userId,
      streakType,
    ]);

    if (!updated) throw new Error('Failed to break streak');
    return updated;
  }

  /**
   * Check if streak is active (logged today or yesterday)
   */
  isActive(streak: Streak): boolean {
    if (!streak.last_activity_date) return false;

    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

    return (
      streak.last_activity_date === today || streak.last_activity_date === yesterday
    );
  }

  /**
   * Get days until streak breaks (0 if logged today, 1 if logged yesterday, -1 if broken)
   */
  daysUntilBreak(streak: Streak): number {
    if (!streak.last_activity_date) return -1;

    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

    if (streak.last_activity_date === today) return 0;
    if (streak.last_activity_date === yesterday) return 1;
    return -1;
  }

  /**
   * Get active streaks for a user (logged today or yesterday)
   */
  async findActiveByUserId(userId: string): Promise<Streak[]> {
    const streaks = await this.findByUserId(userId);
    return streaks.filter((streak) => this.isActive(streak));
  }

  /**
   * Get streak milestones (7, 13, 21, 44, 125 days)
   */
  getMilestone(streak: Streak): {
    current: number;
    next: number | null;
    progress: number;
  } {
    const milestones = [7, 13, 21, 44, 125];
    const current = streak.current_count;

    let achievedMilestone = 0;
    let nextMilestone: number | null = milestones[0];

    for (const milestone of milestones) {
      if (current >= milestone) {
        achievedMilestone = milestone;
        nextMilestone = null;
      } else {
        nextMilestone = milestone;
        break;
      }
    }

    const progress = nextMilestone
      ? (current / nextMilestone) * 100
      : 100;

    return {
      current: achievedMilestone,
      next: nextMilestone,
      progress: Math.min(progress, 100),
    };
  }

  /**
   * Reset all streaks for a user (admin/testing)
   */
  async resetAll(userId: string): Promise<boolean> {
    const sql = `
      UPDATE streaks 
      SET current_count = 0,
          last_activity_date = NULL,
          updated_at = ?
      WHERE user_id = ?
    `;

    const result = await this.db.execute(sql, [unixTimestamp(), userId]);
    return result.success;
  }

  /**
   * Delete streak
   */
  async delete(userId: string, streakType: StreakType): Promise<boolean> {
    const sql = 'DELETE FROM streaks WHERE user_id = ? AND streak_type = ?';
    const result = await this.db.execute(sql, [userId, streakType]);
    return result.success;
  }

  /**
   * Get streak statistics across all users (analytics)
   */
  async getGlobalStats(): Promise<{
    total_active_streaks: number;
    average_current_count: number;
    longest_streak: number;
  }> {
    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

    const sql = `
      SELECT 
        COUNT(*) as total_active_streaks,
        AVG(current_count) as average_current_count,
        MAX(longest_count) as longest_streak
      FROM streaks
      WHERE last_activity_date IN (?, ?)
    `;

    const result = await this.db.queryOne<{
      total_active_streaks: number;
      average_current_count: number;
      longest_streak: number;
    }>(sql, [today, yesterday]);

    return {
      total_active_streaks: result?.total_active_streaks || 0,
      average_current_count: result?.average_current_count || 0,
      longest_streak: result?.longest_streak || 0,
    };
  }
}
