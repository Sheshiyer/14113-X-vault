import type { Env } from '../types';

// Database helper functions for D1

export async function executeQuery<T = unknown>(
  db: D1Database,
  query: string,
  params?: unknown[]
): Promise<T[]> {
  const stmt = db.prepare(query);
  const result = params ? stmt.bind(...params) : stmt;
  const { results } = await result.all<T>();
  return results || [];
}

export async function executeRun(
  db: D1Database,
  query: string,
  params?: unknown[]
): Promise<D1Result> {
  const stmt = db.prepare(query);
  const result = params ? stmt.bind(...params) : stmt;
  return await result.run();
}

export async function executeFirst<T = unknown>(
  db: D1Database,
  query: string,
  params?: unknown[]
): Promise<T | null> {
  const stmt = db.prepare(query);
  const result = params ? stmt.bind(...params) : stmt;
  return await result.first<T>();
}

// Batch operations helper
export async function executeBatch(
  db: D1Database,
  statements: D1PreparedStatement[]
): Promise<D1Result[]> {
  return await db.batch(statements);
}

// Transaction helper (D1 doesn't support true transactions yet, but we can batch)
export async function withTransaction<T>(
  env: Env,
  callback: (db: D1Database) => Promise<T>
): Promise<T> {
  // Note: D1 has limited transaction support
  // For complex transactions, consider using batch operations
  return await callback(env.DB);
}
