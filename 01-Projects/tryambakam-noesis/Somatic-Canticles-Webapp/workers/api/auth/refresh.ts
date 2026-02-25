import { verifyToken, signToken, extractTokenFromHeader } from "../../lib/jwt";
import { rateLimiter, getClientIP, RateLimitExceeded } from "../middleware/rateLimit";

export interface RefreshRequest {
  token?: string;
}

export interface RefreshResponse {
  token: string;
}

export async function handleRefresh(request: Request, env: any): Promise<Response> {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    await rateLimiter.checkRateLimit(clientIP, "refresh");
    
    // Get token from Authorization header or request body
    let token: string | null = null;
    const authHeader = request.headers.get("Authorization");
    
    if (authHeader) {
      token = extractTokenFromHeader(authHeader);
    } else {
      const body = await request.json() as RefreshRequest;
      token = body.token || null;
    }
    
    if (!token) {
      return new Response(
        JSON.stringify({
          error: "Missing token",
          code: "AUTH_MISSING_TOKEN",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Verify existing token
    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid or expired token",
          code: "AUTH_INVALID_TOKEN",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Verify user still exists in database
    const db = env.DB;
    const user = await db
      .prepare("SELECT id, email, birthdate, timezone FROM users WHERE id = ?")
      .bind(payload.userId)
      .first();
    
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found",
          code: "AUTH_USER_NOT_FOUND",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Generate new token
    const newToken = await signToken({
      userId: user.id,
      email: user.email,
      birthdate: user.birthdate,
      timezone: user.timezone,
    });
    
    const response: RefreshResponse = {
      token: newToken,
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof RateLimitExceeded) {
      return new Response(
        JSON.stringify({
          error: "Too many refresh attempts",
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
    
    console.error("Refresh error:", error);
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
