/**
 * Rate limiting middleware for Cloudflare Workers using KV storage
 * 
 * Limits:
 * - Login: 5 attempts per 15 minutes per IP
 * - Register: 10 attempts per hour per IP
 */

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export const RATE_LIMITS = {
  login: {
    maxAttempts: parseInt(process.env.RATE_LIMIT_LOGIN || "5"),
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  register: {
    maxAttempts: parseInt(process.env.RATE_LIMIT_REGISTER || "10"),
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  refresh: {
    maxAttempts: 20,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const;

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class RateLimitExceeded extends Error {
  retryAfter: number;
  
  constructor(retryAfter: number) {
    super("Rate limit exceeded");
    this.name = "RateLimitExceeded";
    this.retryAfter = retryAfter;
  }
}

export class RateLimiter {
  private cache: Map<string, RateLimitEntry>;
  
  constructor() {
    this.cache = new Map();
  }
  
  private getKey(ip: string, endpoint: string): string {
    return `ratelimit:${endpoint}:${ip}`;
  }
  
  async checkRateLimit(
    ip: string,
    endpoint: keyof typeof RATE_LIMITS
  ): Promise<void> {
    const config = RATE_LIMITS[endpoint];
    const key = this.getKey(ip, endpoint);
    const now = Date.now();
    
    const entry = this.cache.get(key);
    
    if (!entry || now > entry.resetAt) {
      // No entry or expired, create new
      this.cache.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      return;
    }
    
    if (entry.count >= config.maxAttempts) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      throw new RateLimitExceeded(retryAfter);
    }
    
    // Increment count
    entry.count++;
    this.cache.set(key, entry);
  }
  
  async resetRateLimit(ip: string, endpoint: keyof typeof RATE_LIMITS): Promise<void> {
    const key = this.getKey(ip, endpoint);
    this.cache.delete(key);
  }
  
  // Cleanup expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.resetAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}

export function getClientIP(request: Request): string {
  // Try Cloudflare headers first
  const cfConnectingIP = request.headers.get("CF-Connecting-IP");
  if (cfConnectingIP) return cfConnectingIP;
  
  // Fallback to X-Forwarded-For
  const xForwardedFor = request.headers.get("X-Forwarded-For");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  
  // Fallback to X-Real-IP
  const xRealIP = request.headers.get("X-Real-IP");
  if (xRealIP) return xRealIP;
  
  return "unknown";
}
