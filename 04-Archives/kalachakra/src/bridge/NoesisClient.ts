/**
 * NoesisClient - CLI Wrapper for Noesis Integration
 * 
 * Spawns noesis commands, parses JSON outputs, caches results,
 * and handles errors gracefully when noesis is not running.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { NoesisTemporalState, Vayu } from '../types';

const execAsync = promisify(exec);

// Cache configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface NoesisHealth {
  status: 'healthy' | 'degraded' | 'unavailable';
  version?: string;
  uptime?: number;
  lastError?: string;
  timestamp: string;
}

export interface NoesisClock {
  timestamp: string;
  cliffordOctave: number;
  octaveProgress: number;
  timeUntilNextOctave: number; // minutes
}

export interface NoesisMoon {
  phase: string;
  illumination: number; // 0-1
  dayOfCycle: number; // 0-29.5
  daysUntilFull: number;
  daysUntilNew: number;
  sign?: string;
}

export interface NoesisVayus {
  current: Vayu;
  dominantSince: string;
  duration: number; // minutes
  allVayus: {
    prana: number;
    vyana: number;
    udana: number;
    samana: number;
    apana: number;
  };
}

export class NoesisClient {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number;
  private noesisPath: string;
  private lastError: string | null = null;
  private consecutiveErrors: number = 0;
  private maxRetries: number = 3;

  constructor(options: { ttl?: number; noesisPath?: string } = {}) {
    this.defaultTTL = options.ttl ?? 30_000; // 30 seconds default
    this.noesisPath = options.noesisPath ?? 'noesis';
  }

  /**
   * Execute a noesis command with caching and error handling
   */
  private async execute<T>(
    command: string,
    ttl: number = this.defaultTTL,
    retryCount: number = 0
  ): Promise<T | null> {
    const cacheKey = command;
    const cached = this.cache.get(cacheKey);

    // Return cached if valid
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }

    try {
      const { stdout } = await execAsync(`${this.noesisPath} ${command} --json`, {
        timeout: 10_000, // 10 second timeout
        encoding: 'utf-8',
      });

      const data = JSON.parse(stdout) as T;
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl,
      });

      // Reset error tracking on success
      this.consecutiveErrors = 0;
      this.lastError = null;

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if it's a command not found error
      if (errorMessage.includes('command not found') || errorMessage.includes('ENOENT')) {
        this.lastError = 'Noesis CLI not installed or not in PATH';
        this.consecutiveErrors++;
        
        // Return stale cache if available
        if (cached) {
          console.warn(`[NoesisClient] Using stale cache for ${command}`);
          return cached.data as T;
        }
        
        return null;
      }

      // Retry on transient errors
      if (retryCount < this.maxRetries && this.isRetryableError(errorMessage)) {
        await this.delay(1000 * (retryCount + 1)); // Exponential backoff
        return this.execute<T>(command, ttl, retryCount + 1);
      }

      this.lastError = errorMessage;
      this.consecutiveErrors++;

      // Return stale cache if available
      if (cached) {
        console.warn(`[NoesisClient] Using stale cache for ${command} after error`);
        return cached.data as T;
      }

      return null;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: string): boolean {
    const retryablePatterns = [
      'ETIMEDOUT',
      'ECONNREFUSED',
      'EPIPE',
      'socket hang up',
      'busy',
      'temporarily',
    ];
    return retryablePatterns.some(pattern => error.includes(pattern));
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get temporal state from noesis
   * Uses longer cache (5s) since temporal changes gradually
   */
  async getTemporal(): Promise<NoesisTemporalState | null> {
    return this.execute<NoesisTemporalState>('temporal', 5000);
  }

  /**
   * Get health status from noesis
   * Uses short cache (2s) for health checks
   */
  async getHealth(): Promise<NoesisHealth | null> {
    return this.execute<NoesisHealth>('health', 2000);
  }

  /**
   * Get clock state from noesis
   * Uses medium cache (10s) since octave changes slowly
   */
  async getClock(): Promise<NoesisClock | null> {
    return this.execute<NoesisClock>('clock', 10000);
  }

  /**
   * Get moon phase from noesis
   * Uses long cache (1 hour) since moon changes slowly
   */
  async getMoon(): Promise<NoesisMoon | null> {
    return this.execute<NoesisMoon>('moon', 3600000);
  }

  /**
   * Get vayus (elemental forces) from noesis
   * Uses medium cache (30s)
   */
  async getVayus(): Promise<NoesisVayus | null> {
    return this.execute<NoesisVayus>('vayus', 30000);
  }

  /**
   * Check if noesis is available
   */
  async isAvailable(): Promise<boolean> {
    const health = await this.getHealth();
    return health !== null && health.status === 'healthy';
  }

  /**
   * Get current availability status
   */
  getStatus(): {
    available: boolean;
    lastError: string | null;
    consecutiveErrors: number;
    cacheSize: number;
  } {
    return {
      available: this.consecutiveErrors === 0,
      lastError: this.lastError,
      consecutiveErrors: this.consecutiveErrors,
      cacheSize: this.cache.size,
    };
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Invalidate specific cache entry
   */
  invalidateCache(command: string): void {
    this.cache.delete(command);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    entries: Array<{ key: string; age: number; expired: boolean }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      expired: now - entry.timestamp >= entry.ttl,
    }));

    return {
      size: this.cache.size,
      entries,
    };
  }
}

// Singleton instance for shared use
let sharedClient: NoesisClient | null = null;

export function getNoesisClient(options?: { ttl?: number; noesisPath?: string }): NoesisClient {
  if (!sharedClient) {
    sharedClient = new NoesisClient(options);
  }
  return sharedClient;
}

export function resetNoesisClient(): void {
  sharedClient = null;
}

export default NoesisClient;
