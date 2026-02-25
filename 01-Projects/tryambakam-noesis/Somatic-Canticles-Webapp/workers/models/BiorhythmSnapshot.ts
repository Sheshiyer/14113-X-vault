/**
 * BiorhythmSnapshot Model
 * Cached biorhythm calculations for a user on a specific date
 */

import type { DatabaseClient } from '../database/client';
import { generateUUID, formatDate, unixTimestamp } from '../database/client';

export interface BiorhythmSnapshot {
  id: string;
  user_id: string;
  date: string; // ISO 8601: YYYY-MM-DD
  physical_value: number; // -1.0 to 1.0
  emotional_value: number;
  intellectual_value: number;
  spiritual_value: number;
  physical_peak: number; // 0 or 1 (boolean)
  emotional_peak: number;
  intellectual_peak: number;
  spiritual_peak: number;
  sunrise_time: string | null; // ISO 8601: HH:MM:SS
  sunset_time: string | null;
  calculated_at: number;
}

export interface CreateSnapshotInput {
  user_id: string;
  date: string;
  physical_value: number;
  emotional_value: number;
  intellectual_value: number;
  spiritual_value: number;
  physical_peak?: boolean;
  emotional_peak?: boolean;
  intellectual_peak?: boolean;
  spiritual_peak?: boolean;
  sunrise_time?: string;
  sunset_time?: string;
}

export class BiorhythmSnapshotModel {
  constructor(private db: DatabaseClient) {}

  /**
   * Create or update a biorhythm snapshot
   */
  async upsert(input: CreateSnapshotInput): Promise<BiorhythmSnapshot> {
    const id = generateUUID();
    const now = unixTimestamp();

    // First, try to find existing snapshot
    const existing = await this.findByUserAndDate(input.user_id, input.date);

    if (existing) {
      // Update existing snapshot
      const sql = `
        UPDATE biorhythm_snapshots 
        SET physical_value = ?,
            emotional_value = ?,
            intellectual_value = ?,
            spiritual_value = ?,
            physical_peak = ?,
            emotional_peak = ?,
            intellectual_peak = ?,
            spiritual_peak = ?,
            sunrise_time = ?,
            sunset_time = ?,
            calculated_at = ?
        WHERE user_id = ? AND date = ?
        RETURNING *
      `;

      const updated = await this.db.queryOne<BiorhythmSnapshot>(sql, [
        input.physical_value,
        input.emotional_value,
        input.intellectual_value,
        input.spiritual_value,
        input.physical_peak ? 1 : 0,
        input.emotional_peak ? 1 : 0,
        input.intellectual_peak ? 1 : 0,
        input.spiritual_peak ? 1 : 0,
        input.sunrise_time || null,
        input.sunset_time || null,
        now,
        input.user_id,
        input.date,
      ]);

      if (!updated) throw new Error('Failed to update snapshot');
      return updated;
    }

    // Create new snapshot
    const sql = `
      INSERT INTO biorhythm_snapshots (
        id, user_id, date, 
        physical_value, emotional_value, intellectual_value, spiritual_value,
        physical_peak, emotional_peak, intellectual_peak, spiritual_peak,
        sunrise_time, sunset_time, calculated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const snapshot = await this.db.queryOne<BiorhythmSnapshot>(sql, [
      id,
      input.user_id,
      input.date,
      input.physical_value,
      input.emotional_value,
      input.intellectual_value,
      input.spiritual_value,
      input.physical_peak ? 1 : 0,
      input.emotional_peak ? 1 : 0,
      input.intellectual_peak ? 1 : 0,
      input.spiritual_peak ? 1 : 0,
      input.sunrise_time || null,
      input.sunset_time || null,
      now,
    ]);

    if (!snapshot) throw new Error('Failed to create snapshot');
    return snapshot;
  }

  /**
   * Find snapshot by user and date
   */
  async findByUserAndDate(
    userId: string,
    date: string
  ): Promise<BiorhythmSnapshot | null> {
    const sql = 'SELECT * FROM biorhythm_snapshots WHERE user_id = ? AND date = ?';
    return await this.db.queryOne<BiorhythmSnapshot>(sql, [userId, date]);
  }

  /**
   * Get snapshots for a date range
   */
  async findByUserAndDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<BiorhythmSnapshot[]> {
    const sql = `
      SELECT * FROM biorhythm_snapshots 
      WHERE user_id = ? AND date >= ? AND date <= ?
      ORDER BY date ASC
    `;
    return await this.db.query<BiorhythmSnapshot>(sql, [userId, startDate, endDate]);
  }

  /**
   * Get recent snapshots (default last 7 days)
   */
  async findRecentByUserId(
    userId: string,
    days = 7
  ): Promise<BiorhythmSnapshot[]> {
    const endDate = formatDate(new Date());
    const startDate = formatDate(
      new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    );

    return await this.findByUserAndDateRange(userId, startDate, endDate);
  }

  /**
   * Find peaks for a specific cycle in date range
   */
  async findPeaksByUserAndCycle(
    userId: string,
    cycle: 'physical' | 'emotional' | 'intellectual' | 'spiritual',
    startDate: string,
    endDate: string
  ): Promise<BiorhythmSnapshot[]> {
    const peakColumn = `${cycle}_peak`;
    const sql = `
      SELECT * FROM biorhythm_snapshots 
      WHERE user_id = ? 
        AND date >= ? 
        AND date <= ?
        AND ${peakColumn} = 1
      ORDER BY date ASC
    `;
    return await this.db.query<BiorhythmSnapshot>(sql, [userId, startDate, endDate]);
  }

  /**
   * Get today's snapshot (or create it if needed via biorhythm engine)
   */
  async getTodaySnapshot(userId: string): Promise<BiorhythmSnapshot | null> {
    const today = formatDate(new Date());
    return await this.findByUserAndDate(userId, today);
  }

  /**
   * Check if any cycle is at peak today
   */
  async hasPeakToday(userId: string): Promise<boolean> {
    const snapshot = await this.getTodaySnapshot(userId);
    if (!snapshot) return false;

    return (
      snapshot.physical_peak === 1 ||
      snapshot.emotional_peak === 1 ||
      snapshot.intellectual_peak === 1 ||
      snapshot.spiritual_peak === 1
    );
  }

  /**
   * Get cycles at peak today
   */
  async getPeakCyclesToday(
    userId: string
  ): Promise<Array<'physical' | 'emotional' | 'intellectual' | 'spiritual'>> {
    const snapshot = await this.getTodaySnapshot(userId);
    if (!snapshot) return [];

    const peaks: Array<'physical' | 'emotional' | 'intellectual' | 'spiritual'> = [];

    if (snapshot.physical_peak === 1) peaks.push('physical');
    if (snapshot.emotional_peak === 1) peaks.push('emotional');
    if (snapshot.intellectual_peak === 1) peaks.push('intellectual');
    if (snapshot.spiritual_peak === 1) peaks.push('spiritual');

    return peaks;
  }

  /**
   * Delete snapshots older than N days (cache cleanup)
   */
  async deleteOlderThan(days: number): Promise<number> {
    const cutoffDate = formatDate(
      new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    );

    const sql = 'DELETE FROM biorhythm_snapshots WHERE date < ?';
    const result = await this.db.execute(sql, [cutoffDate]);

    return result.meta?.rows_written || 0;
  }

  /**
   * Delete all snapshots for a user
   */
  async deleteByUserId(userId: string): Promise<boolean> {
    const sql = 'DELETE FROM biorhythm_snapshots WHERE user_id = ?';
    const result = await this.db.execute(sql, [userId]);
    return result.success;
  }

  /**
   * Get snapshot statistics for a user
   */
  async getStats(userId: string): Promise<{
    total_snapshots: number;
    date_range: { earliest: string | null; latest: string | null };
    peak_counts: {
      physical: number;
      emotional: number;
      intellectual: number;
      spiritual: number;
    };
  }> {
    const countSql = 'SELECT COUNT(*) as count FROM biorhythm_snapshots WHERE user_id = ?';
    const countResult = await this.db.queryOne<{ count: number }>(countSql, [userId]);

    const rangeSql = `
      SELECT MIN(date) as earliest, MAX(date) as latest 
      FROM biorhythm_snapshots 
      WHERE user_id = ?
    `;
    const rangeResult = await this.db.queryOne<{
      earliest: string | null;
      latest: string | null;
    }>(rangeSql, [userId]);

    const peaksSql = `
      SELECT 
        SUM(physical_peak) as physical,
        SUM(emotional_peak) as emotional,
        SUM(intellectual_peak) as intellectual,
        SUM(spiritual_peak) as spiritual
      FROM biorhythm_snapshots
      WHERE user_id = ?
    `;
    const peaksResult = await this.db.queryOne<{
      physical: number;
      emotional: number;
      intellectual: number;
      spiritual: number;
    }>(peaksSql, [userId]);

    return {
      total_snapshots: countResult?.count || 0,
      date_range: {
        earliest: rangeResult?.earliest || null,
        latest: rangeResult?.latest || null,
      },
      peak_counts: {
        physical: peaksResult?.physical || 0,
        emotional: peaksResult?.emotional || 0,
        intellectual: peaksResult?.intellectual || 0,
        spiritual: peaksResult?.spiritual || 0,
      },
    };
  }
}
