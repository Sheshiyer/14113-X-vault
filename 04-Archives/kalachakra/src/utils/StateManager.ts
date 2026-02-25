/**
 * StateManager - Persistence layer for Kalachakra state
 */

import { KalachakraState } from '../types/index.js';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname } from 'path';

export class StateManager {
  private statePath: string;

  constructor(statePath: string = './state.json') {
    this.statePath = statePath;
  }

  /**
   * Save state to disk
   */
  async saveState(state: KalachakraState): Promise<void> {
    try {
      // Ensure directory exists
      const dir = dirname(this.statePath);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      // Serialize state with timestamp
      const stateWithMeta = {
        ...state,
        _savedAt: new Date().toISOString(),
        _version: '1.0.0'
      };

      await writeFile(
        this.statePath,
        JSON.stringify(stateWithMeta, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to save Kalachakra state:', error);
      throw error;
    }
  }

  /**
   * Load state from disk
   */
  async loadState(): Promise<KalachakraState | null> {
    try {
      if (!existsSync(this.statePath)) {
        return null;
      }

      const data = await readFile(this.statePath, 'utf-8');
      const parsed = JSON.parse(data);

      // Remove metadata fields
      delete parsed._savedAt;
      delete parsed._version;

      return parsed as KalachakraState;
    } catch (error) {
      console.warn('Failed to load Kalachakra state:', error);
      return null;
    }
  }

  /**
   * Check if state exists
   */
  async stateExists(): Promise<boolean> {
    return existsSync(this.statePath);
  }

  /**
   * Get state file path
   */
  getPath(): string {
    return this.statePath;
  }
}

/**
 * Simple in-memory cache for state
 */
export class StateCache {
  private cache: Map<string, { value: unknown; expires: number }> = new Map();

  set<T>(key: string, value: T, ttlMs: number = 30000): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
