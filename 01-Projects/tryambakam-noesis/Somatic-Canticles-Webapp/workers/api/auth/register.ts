import { hashPassword } from "../../lib/password";
import { signToken } from "../../lib/jwt";
import { validateRegisterRequest, ValidationException, sanitizeEmail } from "../../lib/validation";
import { rateLimiter, getClientIP, RateLimitExceeded } from "../middleware/rateLimit";
import { randomUUID } from "crypto";

export interface RegisterRequest {
  email: string;
  password: string;
  birthdate: string; // ISO 8601 format (YYYY-MM-DD)
  timezone: string; // IANA timezone (e.g., "America/New_York")
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    birthdate: string;
    timezone: string;
  };
}

export async function handleRegister(request: Request, env: any): Promise<Response> {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    await rateLimiter.checkRateLimit(clientIP, "register");
    
    // Parse request body
    const body = await request.json() as RegisterRequest;
    
    // Validate input
    validateRegisterRequest(body.email, body.password, body.birthdate, body.timezone);
    
    const email = sanitizeEmail(body.email);
    
    // Check if user already exists
    const db = env.DB;
    const existingUser = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first();
    
    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "Email already registered",
          code: "AUTH_EMAIL_EXISTS",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(body.password);
    
    // Generate user ID
    const userId = randomUUID();
    
    // Insert user into database
    const now = Math.floor(Date.now() / 1000);
    await db
      .prepare(
        "INSERT INTO users (id, email, password_hash, birthdate, timezone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(userId, email, passwordHash, body.birthdate, body.timezone, now, now)
      .run();
    
    // Reset rate limit on successful registration
    await rateLimiter.resetRateLimit(clientIP, "register");
    
    // Generate JWT token
    const token = await signToken({
      userId,
      email,
      birthdate: body.birthdate,
      timezone: body.timezone,
    });
    
    const response: RegisterResponse = {
      token,
      user: {
        id: userId,
        email,
        birthdate: body.birthdate,
        timezone: body.timezone,
      },
    };
    
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          code: "VAL_INVALID_INPUT",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    if (error instanceof RateLimitExceeded) {
      return new Response(
        JSON.stringify({
          error: "Too many registration attempts",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: error.retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": error.retryAfter.toString(),
          },
        }
      );
    }
    
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
