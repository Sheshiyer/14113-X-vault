/**
 * Chapter Model
 * Represents a chapter/canticle with unlock trigger logic
 */

import type { DatabaseClient } from '../database/client';

export interface Chapter {
  id: number;
  title: string;
  cycle: 'physical' | 'emotional' | 'intellectual' | 'spiritual';
  unlock_trigger: string; // JSON string
  content_url: string | null;
  canticle_url: string | null;
  duration_minutes: number | null;
  practices: string | null; // JSON array
  chapter_order: number | null;
  created_at: number;
}

export interface UnlockTrigger {
  type: 'peak' | 'high' | 'sequential' | 'time';
  cycle?: 'physical' | 'emotional' | 'intellectual' | 'spiritual';
  conditions?: Record<string, unknown>;
}

export interface CreateChapterInput {
  title: string;
  cycle: Chapter['cycle'];
  unlock_trigger: UnlockTrigger;
  content_url?: string;
  canticle_url?: string;
  duration_minutes?: number;
  practices?: string[];
  chapter_order?: number;
}

export class ChapterModel {
  constructor(private db: DatabaseClient) {}

  /**
   * Create a new chapter
   */
  async create(input: CreateChapterInput): Promise<Chapter> {
    const sql = `
      INSERT INTO chapters (title, cycle, unlock_trigger, content_url, canticle_url, 
                           duration_minutes, practices, chapter_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, unixepoch())
      RETURNING *
    `;

    const chapter = await this.db.queryOne<Chapter>(sql, [
      input.title,
      input.cycle,
      JSON.stringify(input.unlock_trigger),
      input.content_url || null,
      input.canticle_url || null,
      input.duration_minutes || null,
      input.practices ? JSON.stringify(input.practices) : null,
      input.chapter_order || null,
    ]);

    if (!chapter) throw new Error('Failed to create chapter');
    return chapter;
  }

  /**
   * Find chapter by ID
   */
  async findById(id: number): Promise<Chapter | null> {
    const sql = 'SELECT * FROM chapters WHERE id = ?';
    return await this.db.queryOne<Chapter>(sql, [id]);
  }

  /**
   * Find all chapters ordered by chapter_order or id
   */
  async findAll(): Promise<Chapter[]> {
    const sql = `
      SELECT * FROM chapters 
      ORDER BY COALESCE(chapter_order, id)
    `;
    return await this.db.query<Chapter>(sql);
  }

  /**
   * Find chapters by cycle
   */
  async findByCycle(cycle: Chapter['cycle']): Promise<Chapter[]> {
    const sql = `
      SELECT * FROM chapters 
      WHERE cycle = ? 
      ORDER BY COALESCE(chapter_order, id)
    `;
    return await this.db.query<Chapter>(sql, [cycle]);
  }

  /**
   * Get chapter count
   */
  async count(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM chapters';
    const result = await this.db.queryOne<{ count: number }>(sql);
    return result?.count || 0;
  }

  /**
   * Parse unlock trigger JSON
   */
  parseUnlockTrigger(chapter: Chapter): UnlockTrigger {
    try {
      return JSON.parse(chapter.unlock_trigger);
    } catch {
      return { type: 'sequential' };
    }
  }

  /**
   * Parse practices JSON
   */
  parsePractices(chapter: Chapter): string[] {
    if (!chapter.practices) return [];
    try {
      return JSON.parse(chapter.practices);
    } catch {
      return [];
    }
  }

  /**
   * Get chapters for a specific phase (1-12 chapters, 3 per cycle)
   */
  async findByPhase(phase: 1 | 2 | 3): Promise<Chapter[]> {
    const cycleOrder = ['physical', 'emotional', 'intellectual', 'spiritual'];
    const startOrder = (phase - 1) * 4;
    const endOrder = startOrder + 3;

    const sql = `
      SELECT * FROM chapters 
      WHERE chapter_order >= ? AND chapter_order <= ?
      ORDER BY chapter_order
    `;
    return await this.db.query<Chapter>(sql, [startOrder, endOrder]);
  }

  /**
   * Update chapter
   */
  async update(
    id: number,
    input: Partial<CreateChapterInput>
  ): Promise<Chapter | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.title !== undefined) {
      fields.push('title = ?');
      values.push(input.title);
    }
    if (input.cycle !== undefined) {
      fields.push('cycle = ?');
      values.push(input.cycle);
    }
    if (input.unlock_trigger !== undefined) {
      fields.push('unlock_trigger = ?');
      values.push(JSON.stringify(input.unlock_trigger));
    }
    if (input.content_url !== undefined) {
      fields.push('content_url = ?');
      values.push(input.content_url);
    }
    if (input.canticle_url !== undefined) {
      fields.push('canticle_url = ?');
      values.push(input.canticle_url);
    }
    if (input.duration_minutes !== undefined) {
      fields.push('duration_minutes = ?');
      values.push(input.duration_minutes);
    }
    if (input.practices !== undefined) {
      fields.push('practices = ?');
      values.push(JSON.stringify(input.practices));
    }
    if (input.chapter_order !== undefined) {
      fields.push('chapter_order = ?');
      values.push(input.chapter_order);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const sql = `
      UPDATE chapters SET ${fields.join(', ')}
      WHERE id = ?
      RETURNING *
    `;

    return await this.db.queryOne<Chapter>(sql, values);
  }

  /**
   * Delete chapter
   */
  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM chapters WHERE id = ?';
    const result = await this.db.execute(sql, [id]);
    return result.success;
  }
}
