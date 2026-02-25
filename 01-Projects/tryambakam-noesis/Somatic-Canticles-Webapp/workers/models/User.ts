/**
 * User Model
 * Represents a user account with birthdate for biorhythm calculations
 */

import type { DatabaseClient } from '../database/client';
import { generateUUID, unixTimestamp } from '../database/client';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  birthdate: string; // ISO 8601: YYYY-MM-DD
  timezone: string;
  created_at: number;
  updated_at: number;
}

export interface CreateUserInput {
  email: string;
  password_hash: string;
  birthdate: string;
  timezone?: string;
}

export interface UpdateUserInput {
  email?: string;
  password_hash?: string;
  birthdate?: string;
  timezone?: string;
}

export class UserModel {
  constructor(private db: DatabaseClient) {}

  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<User> {
    const id = generateUUID();
    const now = unixTimestamp();
    
    const sql = `
      INSERT INTO users (id, email, password_hash, birthdate, timezone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;
    
    const user = await this.db.queryOne<User>(sql, [
      id,
      input.email,
      input.password_hash,
      input.birthdate,
      input.timezone || 'UTC',
      now,
      now,
    ]);
    
    if (!user) throw new Error('Failed to create user');
    return user;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await this.db.queryOne<User>(sql, [id]);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await this.db.queryOne<User>(sql, [email]);
  }

  /**
   * Update user
   */
  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.email !== undefined) {
      fields.push('email = ?');
      values.push(input.email);
    }
    if (input.password_hash !== undefined) {
      fields.push('password_hash = ?');
      values.push(input.password_hash);
    }
    if (input.birthdate !== undefined) {
      fields.push('birthdate = ?');
      values.push(input.birthdate);
    }
    if (input.timezone !== undefined) {
      fields.push('timezone = ?');
      values.push(input.timezone);
    }

    fields.push('updated_at = ?');
    values.push(unixTimestamp());

    if (fields.length === 1) return await this.findById(id); // No changes

    values.push(id);

    const sql = `
      UPDATE users SET ${fields.join(', ')}
      WHERE id = ?
      RETURNING *
    `;

    return await this.db.queryOne<User>(sql, values);
  }

  /**
   * Delete user (cascades to all related data)
   */
  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await this.db.execute(sql, [id]);
    return result.success;
  }

  /**
   * Get all users (for admin/testing)
   */
  async findAll(limit = 100, offset = 0): Promise<User[]> {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.query<User>(sql, [limit, offset]);
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM users';
    const result = await this.db.queryOne<{ count: number }>(sql);
    return result?.count || 0;
  }

  /**
   * Calculate days since birth (for biorhythm calculations)
   */
  daysSinceBirth(birthdate: string, targetDate: Date = new Date()): number {
    const birth = new Date(birthdate);
    const diff = targetDate.getTime() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
