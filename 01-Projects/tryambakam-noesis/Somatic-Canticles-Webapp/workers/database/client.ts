/**
 * D1 Database Client Wrapper
 * Provides type-safe access to Cloudflare D1 database
 */

import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

/**
 * Database client wrapper with utility methods
 */
export class DatabaseClient {
  constructor(private db: D1Database) {}

  /**
   * Execute a query and return all results
   */
  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.db.prepare(sql).bind(...params).all<T>();
    return result.results || [];
  }

  /**
   * Execute a query and return first result
   */
  async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
    const result = await this.db.prepare(sql).bind(...params).first<T>();
    return result;
  }

  /**
   * Execute a mutation (INSERT, UPDATE, DELETE)
   */
  async execute(sql: string, params: unknown[] = []): Promise<D1Response> {
    const result = await this.db.prepare(sql).bind(...params).run();
    return result;
  }

  /**
   * Execute multiple statements in a batch
   */
  async batch(statements: Array<{ sql: string; params?: unknown[] }>): Promise<D1Response[]> {
    const prepared = statements.map(({ sql, params = [] }) =>
      this.db.prepare(sql).bind(...params)
    );
    return await this.db.batch(prepared);
  }

  /**
   * Get the raw D1 database instance
   */
  get raw(): D1Database {
    return this.db;
  }
}

/**
 * D1 Response type (simplified)
 */
export interface D1Response {
  success: boolean;
  meta?: {
    duration: number;
    rows_read: number;
    rows_written: number;
  };
  error?: string;
}

/**
 * Create a new database client from environment
 */
export function createDatabaseClient(env: Env): DatabaseClient {
  return new DatabaseClient(env.DB);
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Get current Unix timestamp
 */
export function unixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Format date as ISO 8601 (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format time as ISO 8601 (HH:MM:SS)
 */
export function formatTime(date: Date): string {
  return date.toISOString().split('T')[1].split('.')[0];
}

/**
 * Parse ISO 8601 date string to Date object
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}
