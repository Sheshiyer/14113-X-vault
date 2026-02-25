import { hashPassword, verifyPassword } from "../../lib/password";
import { signToken } from "../../lib/jwt";
import { validateLoginRequest, ValidationException, sanitizeEmail } from "../../lib/validation";
import { rateLimiter, getClientIP, RateLimitExceeded } from "../middleware/rateLimit";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    birthdate: string;
    timezone: string;
  };
}

export async function handleLogin(request: Request, env: any): Promise<Response> {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    await rateLimiter.checkRateLimit(clientIP, "login");
    
    // Parse request body
    const body = await request.json() as LoginRequest;
    
    // Validate input
    validateLoginRequest(body.email, body.password);
    
    const email = sanitizeEmail(body.email);
    
    // Query user from database
    const db = env.DB;
    const user = await db
      .prepare("SELECT id, email, password_hash, birthdate, timezone FROM users WHERE email = ?")
      .bind(email)
      .first();
    
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "Invalid email or password",
          code: "AUTH_INVALID_CREDENTIALS",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Verify password
    const isValid = await verifyPassword(user.password_hash, body.password);
    
    if (!isValid) {
      return new Response(
        JSON.stringify({
          error: "Invalid email or password",
          code: "AUTH_INVALID_CREDENTIALS",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Reset rate limit on successful login
    await rateLimiter.resetRateLimit(clientIP, "login");
    
    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      birthdate: user.birthdate,
      timezone: user.timezone,
    });
    
    const response: LoginResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        birthdate: user.birthdate,
        timezone: user.timezone,
      },
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
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
          error: "Too many login attempts",
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
    
    console.error("Login error:", error);
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
