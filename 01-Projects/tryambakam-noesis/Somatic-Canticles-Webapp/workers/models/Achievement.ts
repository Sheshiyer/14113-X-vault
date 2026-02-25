/**
 * Achievement Model
 * Tracks unlocked achievements and gamification milestones
 */

import type { DatabaseClient } from '../database/client';
import { generateUUID, unixTimestamp } from '../database/client';

export type AchievementType =
  | 'novice_witness' // 7-day streak
  | 'transformation_initiate' // 13-day streak
  | 'world_builder' // 21-day streak
  | 'master_architect' // 44-day streak
  | 'life_cube_master' // 125-day streak
  | 'first_chapter' // Complete first chapter
  | 'physical_master' // Complete all physical cycle chapters
  | 'emotional_master' // Complete all emotional cycle chapters
  | 'intellectual_master' // Complete all intellectual cycle chapters
  | 'spiritual_master' // Complete all spiritual cycle chapters
  | 'complete_all' // Complete all 12 chapters
  | 'morning_warrior' // 8-day morning streak
  | 'flow_walker' // 13-day flow streak
  | 'solar_leader' // 19-day solar streak
  | 'build_champion'; // 44-day build streak

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  unlocked_at: number;
  progress: number;
  metadata: string | null; // JSON for additional data
}

export interface CreateAchievementInput {
  user_id: string;
  achievement_type: AchievementType;
  progress?: number;
  metadata?: Record<string, unknown>;
}

export class AchievementModel {
  constructor(private db: DatabaseClient) {}

  /**
   * Unlock an achievement for a user
   */
  async unlock(input: CreateAchievementInput): Promise<Achievement> {
    const id = generateUUID();
    const now = unixTimestamp();

    const sql = `
      INSERT INTO achievements (id, user_id, achievement_type, unlocked_at, progress, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const achievement = await this.db.queryOne<Achievement>(sql, [
      id,
      input.user_id,
      input.achievement_type,
      now,
      input.progress || 100,
      input.metadata ? JSON.stringify(input.metadata) : null,
    ]);

    if (!achievement) throw new Error('Failed to unlock achievement');
    return achievement;
  }

  /**
   * Find achievement by user and type
   */
  async findByUserAndType(
    userId: string,
    achievementType: AchievementType
  ): Promise<Achievement | null> {
    const sql = 'SELECT * FROM achievements WHERE user_id = ? AND achievement_type = ?';
    return await this.db.queryOne<Achievement>(sql, [userId, achievementType]);
  }

  /**
   * Check if user has unlocked an achievement
   */
  async isUnlocked(userId: string, achievementType: AchievementType): Promise<boolean> {
    const achievement = await this.findByUserAndType(userId, achievementType);
    return achievement !== null;
  }

  /**
   * Get all achievements for a user
   */
  async findByUserId(userId: string): Promise<Achievement[]> {
    const sql = `
      SELECT * FROM achievements 
      WHERE user_id = ? 
      ORDER BY unlocked_at DESC
    `;
    return await this.db.query<Achievement>(sql, [userId]);
  }

  /**
   * Get recent achievements (last N unlocked)
   */
  async findRecentByUserId(userId: string, limit = 10): Promise<Achievement[]> {
    const sql = `
      SELECT * FROM achievements 
      WHERE user_id = ? 
      ORDER BY unlocked_at DESC
      LIMIT ?
    `;
    return await this.db.query<Achievement>(sql, [userId, limit]);
  }

  /**
   * Update achievement progress (for incremental achievements)
   */
  async updateProgress(
    userId: string,
    achievementType: AchievementType,
    progress: number,
    metadata?: Record<string, unknown>
  ): Promise<Achievement | null> {
    const existing = await this.findByUserAndType(userId, achievementType);

    if (!existing) {
      // Create with progress if doesn't exist
      return await this.unlock({
        user_id: userId,
        achievement_type: achievementType,
        progress,
        metadata,
      });
    }

    // Update existing achievement progress
    const sql = `
      UPDATE achievements 
      SET progress = ?,
          metadata = ?
      WHERE user_id = ? AND achievement_type = ?
      RETURNING *
    `;

    return await this.db.queryOne<Achievement>(sql, [
      progress,
      metadata ? JSON.stringify(metadata) : existing.metadata,
      userId,
      achievementType,
    ]);
  }

  /**
   * Parse achievement metadata
   */
  parseMetadata(achievement: Achievement): Record<string, unknown> {
    if (!achievement.metadata) return {};
    try {
      return JSON.parse(achievement.metadata);
    } catch {
      return {};
    }
  }

  /**
   * Get achievement count for a user
   */
  async count(userId: string): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM achievements WHERE user_id = ?';
    const result = await this.db.queryOne<{ count: number }>(sql, [userId]);
    return result?.count || 0;
  }

  /**
   * Get achievement statistics
   */
  async getStats(userId: string): Promise<{
    total_unlocked: number;
    streak_achievements: number;
    chapter_achievements: number;
    latest_unlock: Achievement | null;
  }> {
    const totalSql = 'SELECT COUNT(*) as count FROM achievements WHERE user_id = ?';
    const totalResult = await this.db.queryOne<{ count: number }>(totalSql, [userId]);

    const streakSql = `
      SELECT COUNT(*) as count FROM achievements 
      WHERE user_id = ? 
      AND achievement_type IN (
        'novice_witness', 'transformation_initiate', 'world_builder', 
        'master_architect', 'life_cube_master', 'morning_warrior', 
        'flow_walker', 'solar_leader', 'build_champion'
      )
    `;
    const streakResult = await this.db.queryOne<{ count: number }>(streakSql, [
      userId,
    ]);

    const chapterSql = `
      SELECT COUNT(*) as count FROM achievements 
      WHERE user_id = ? 
      AND achievement_type IN (
        'first_chapter', 'physical_master', 'emotional_master', 
        'intellectual_master', 'spiritual_master', 'complete_all'
      )
    `;
    const chapterResult = await this.db.queryOne<{ count: number }>(chapterSql, [
      userId,
    ]);

    const latestSql = `
      SELECT * FROM achievements 
      WHERE user_id = ? 
      ORDER BY unlocked_at DESC 
      LIMIT 1
    `;
    const latestResult = await this.db.queryOne<Achievement>(latestSql, [userId]);

    return {
      total_unlocked: totalResult?.count || 0,
      streak_achievements: streakResult?.count || 0,
      chapter_achievements: chapterResult?.count || 0,
      latest_unlock: latestResult || null,
    };
  }

  /**
   * Check and unlock streak-based achievements
   */
  async checkStreakAchievements(
    userId: string,
    streakCount: number
  ): Promise<Achievement[]> {
    const unlocked: Achievement[] = [];

    const streakMilestones: Array<[number, AchievementType]> = [
      [7, 'novice_witness'],
      [13, 'transformation_initiate'],
      [21, 'world_builder'],
      [44, 'master_architect'],
      [125, 'life_cube_master'],
    ];

    for (const [days, type] of streakMilestones) {
      if (streakCount >= days) {
        const hasUnlocked = await this.isUnlocked(userId, type);
        if (!hasUnlocked) {
          const achievement = await this.unlock({
            user_id: userId,
            achievement_type: type,
            metadata: { streak_count: streakCount },
          });
          unlocked.push(achievement);
        }
      }
    }

    return unlocked;
  }

  /**
   * Delete achievement
   */
  async delete(userId: string, achievementType: AchievementType): Promise<boolean> {
    const sql = 'DELETE FROM achievements WHERE user_id = ? AND achievement_type = ?';
    const result = await this.db.execute(sql, [userId, achievementType]);
    return result.success;
  }

  /**
   * Delete all achievements for a user (admin/testing)
   */
  async deleteAll(userId: string): Promise<boolean> {
    const sql = 'DELETE FROM achievements WHERE user_id = ?';
    const result = await this.db.execute(sql, [userId]);
    return result.success;
  }

  /**
   * Get global achievement statistics (analytics)
   */
  async getGlobalStats(): Promise<{
    total_achievements: number;
    unique_users: number;
    most_common: AchievementType | null;
    rarest: AchievementType | null;
  }> {
    const totalSql = 'SELECT COUNT(*) as count FROM achievements';
    const totalResult = await this.db.queryOne<{ count: number }>(totalSql);

    const usersSql = 'SELECT COUNT(DISTINCT user_id) as count FROM achievements';
    const usersResult = await this.db.queryOne<{ count: number }>(usersSql);

    const commonSql = `
      SELECT achievement_type, COUNT(*) as count 
      FROM achievements 
      GROUP BY achievement_type 
      ORDER BY count DESC 
      LIMIT 1
    `;
    const commonResult = await this.db.queryOne<{
      achievement_type: AchievementType;
      count: number;
    }>(commonSql);

    const rareSql = `
      SELECT achievement_type, COUNT(*) as count 
      FROM achievements 
      GROUP BY achievement_type 
      ORDER BY count ASC 
      LIMIT 1
    `;
    const rareResult = await this.db.queryOne<{
      achievement_type: AchievementType;
      count: number;
    }>(rareSql);

    return {
      total_achievements: totalResult?.count || 0,
      unique_users: usersResult?.count || 0,
      most_common: commonResult?.achievement_type || null,
      rarest: rareResult?.achievement_type || null,
    };
  }
}
