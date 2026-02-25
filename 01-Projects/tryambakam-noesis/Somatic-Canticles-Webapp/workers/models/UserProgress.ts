/**
 * UserProgress Model
 * Tracks user progress through chapters (unlock, completion, time spent)
 */

import type { DatabaseClient } from '../database/client';
import { generateUUID, unixTimestamp } from '../database/client';

export interface UserProgress {
  id: string;
  user_id: string;
  chapter_id: number;
  unlocked_at: number | null;
  completed_at: number | null;
  time_spent_seconds: number;
  playback_position_seconds: number;
  notes: string | null;
  created_at: number;
  updated_at: number;
}

export interface CreateProgressInput {
  user_id: string;
  chapter_id: number;
  unlocked_at?: number;
}

export interface UpdateProgressInput {
  completed_at?: number;
  time_spent_seconds?: number;
  playback_position_seconds?: number;
  notes?: string;
}

export class UserProgressModel {
  constructor(private db: DatabaseClient) {}

  /**
   * Create new progress record (when chapter is unlocked)
   */
  async create(input: CreateProgressInput): Promise<UserProgress> {
    const id = generateUUID();
    const now = unixTimestamp();

    const sql = `
      INSERT INTO user_progress (id, user_id, chapter_id, unlocked_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const progress = await this.db.queryOne<UserProgress>(sql, [
      id,
      input.user_id,
      input.chapter_id,
      input.unlocked_at || now,
      now,
      now,
    ]);

    if (!progress) throw new Error('Failed to create progress');
    return progress;
  }

  /**
   * Find progress by user and chapter
   */
  async findByUserAndChapter(
    userId: string,
    chapterId: number
  ): Promise<UserProgress | null> {
    const sql = 'SELECT * FROM user_progress WHERE user_id = ? AND chapter_id = ?';
    return await this.db.queryOne<UserProgress>(sql, [userId, chapterId]);
  }

  /**
   * Get all progress for a user
   */
  async findByUserId(userId: string): Promise<UserProgress[]> {
    const sql = `
      SELECT * FROM user_progress 
      WHERE user_id = ? 
      ORDER BY chapter_id
    `;
    return await this.db.query<UserProgress>(sql, [userId]);
  }

  /**
   * Get unlocked chapters for a user
   */
  async findUnlockedByUserId(userId: string): Promise<UserProgress[]> {
    const sql = `
      SELECT * FROM user_progress 
      WHERE user_id = ? AND unlocked_at IS NOT NULL
      ORDER BY unlocked_at DESC
    `;
    return await this.db.query<UserProgress>(sql, [userId]);
  }

  /**
   * Get completed chapters for a user
   */
  async findCompletedByUserId(userId: string): Promise<UserProgress[]> {
    const sql = `
      SELECT * FROM user_progress 
      WHERE user_id = ? AND completed_at IS NOT NULL
      ORDER BY completed_at DESC
    `;
    return await this.db.query<UserProgress>(sql, [userId]);
  }

  /**
   * Update progress
   */
  async update(
    userId: string,
    chapterId: number,
    input: UpdateProgressInput
  ): Promise<UserProgress | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.completed_at !== undefined) {
      fields.push('completed_at = ?');
      values.push(input.completed_at);
    }
    if (input.time_spent_seconds !== undefined) {
      fields.push('time_spent_seconds = ?');
      values.push(input.time_spent_seconds);
    }
    if (input.playback_position_seconds !== undefined) {
      fields.push('playback_position_seconds = ?');
      values.push(input.playback_position_seconds);
    }
    if (input.notes !== undefined) {
      fields.push('notes = ?');
      values.push(input.notes);
    }

    fields.push('updated_at = ?');
    values.push(unixTimestamp());

    values.push(userId, chapterId);

    const sql = `
      UPDATE user_progress SET ${fields.join(', ')}
      WHERE user_id = ? AND chapter_id = ?
      RETURNING *
    `;

    return await this.db.queryOne<UserProgress>(sql, values);
  }

  /**
   * Mark chapter as completed
   */
  async markComplete(userId: string, chapterId: number): Promise<UserProgress | null> {
    return await this.update(userId, chapterId, {
      completed_at: unixTimestamp(),
    });
  }

  /**
   * Update playback position (for audio resume)
   */
  async updatePlaybackPosition(
    userId: string,
    chapterId: number,
    positionSeconds: number,
    timeSpentSeconds?: number
  ): Promise<UserProgress | null> {
    const input: UpdateProgressInput = {
      playback_position_seconds: positionSeconds,
    };

    if (timeSpentSeconds !== undefined) {
      input.time_spent_seconds = timeSpentSeconds;
    }

    return await this.update(userId, chapterId, input);
  }

  /**
   * Get progress statistics for a user
   */
  async getStats(userId: string): Promise<{
    total_chapters: number;
    unlocked_chapters: number;
    completed_chapters: number;
    total_time_seconds: number;
  }> {
    const sql = `
      SELECT 
        COUNT(*) as total_chapters,
        SUM(CASE WHEN unlocked_at IS NOT NULL THEN 1 ELSE 0 END) as unlocked_chapters,
        SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) as completed_chapters,
        SUM(time_spent_seconds) as total_time_seconds
      FROM user_progress
      WHERE user_id = ?
    `;

    const result = await this.db.queryOne<{
      total_chapters: number;
      unlocked_chapters: number;
      completed_chapters: number;
      total_time_seconds: number | null;
    }>(sql, [userId]);

    return {
      total_chapters: result?.total_chapters || 0,
      unlocked_chapters: result?.unlocked_chapters || 0,
      completed_chapters: result?.completed_chapters || 0,
      total_time_seconds: result?.total_time_seconds || 0,
    };
  }

  /**
   * Check if chapter is unlocked for user
   */
  async isUnlocked(userId: string, chapterId: number): Promise<boolean> {
    const progress = await this.findByUserAndChapter(userId, chapterId);
    return progress !== null && progress.unlocked_at !== null;
  }

  /**
   * Check if chapter is completed by user
   */
  async isCompleted(userId: string, chapterId: number): Promise<boolean> {
    const progress = await this.findByUserAndChapter(userId, chapterId);
    return progress !== null && progress.completed_at !== null;
  }

  /**
   * Delete progress record
   */
  async delete(userId: string, chapterId: number): Promise<boolean> {
    const sql = 'DELETE FROM user_progress WHERE user_id = ? AND chapter_id = ?';
    const result = await this.db.execute(sql, [userId, chapterId]);
    return result.success;
  }
}
