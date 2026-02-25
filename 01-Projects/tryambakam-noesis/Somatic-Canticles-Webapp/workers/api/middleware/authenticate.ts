import { verifyToken, extractTokenFromHeader, type TokenPayload } from "../../lib/jwt";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export class AuthenticationError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = statusCode;
  }
}

export async function authenticate(request: Request): Promise<TokenPayload> {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    throw new AuthenticationError("Missing authorization header", 401);
  }
  
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    throw new AuthenticationError("Invalid authorization header format", 401);
  }
  
  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    throw new AuthenticationError(
      `Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      401
    );
  }
}

export function requireAuth(
  handler: (request: Request, user: TokenPayload) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    try {
      const user = await authenticate(request);
      return await handler(request, user);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return new Response(
          JSON.stringify({
            error: error.message,
            code: "AUTH_UNAUTHORIZED",
          }),
          {
            status: error.statusCode,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      
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
  };
}
