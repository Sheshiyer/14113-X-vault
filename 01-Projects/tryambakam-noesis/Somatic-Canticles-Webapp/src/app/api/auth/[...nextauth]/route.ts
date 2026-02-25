import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

/**
 * NextAuth.js API route handler
 * Handles all auth requests: /api/auth/signin, /api/auth/signout, /api/auth/session, etc.
 * 
 * Providers configured:
 * - Credentials (email/password) - calls Workers API
 * - Google OAuth
 * - GitHub OAuth
 * 
 * @see {@link ../../../../lib/auth/config.ts} for full configuration
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
