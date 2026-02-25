import { SignJWT, jwtVerify } from "jose";

export interface TokenPayload {
  userId: string;
  email: string;
  birthdate?: string;
  timezone?: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: TokenPayload, expiresIn: string = "30d"): Promise<string> {
  const secret = JWT_SECRET();
  
  const jwt = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    ...(payload.birthdate && { birthdate: payload.birthdate }),
    ...(payload.timezone && { timezone: payload.timezone }),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);

  return jwt;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const secret = JWT_SECRET();
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      birthdate: payload.birthdate as string | undefined,
      timezone: payload.timezone as string | undefined,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }
  
  return parts[1];
}
