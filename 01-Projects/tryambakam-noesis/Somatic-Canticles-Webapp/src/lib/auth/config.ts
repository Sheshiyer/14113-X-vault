import type { NextAuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

/**
 * NextAuth.js configuration with dual-layer auth strategy (ADR-004)
 * - Frontend: NextAuth handles OAuth and session management
 * - Backend: Workers API uses JWT tokens for authentication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider - calls Workers API for authentication
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Call Workers API /auth/login
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Authentication failed");
          }

          const data = await response.json();

          // Return user object with API token
          return {
            id: data.user.id,
            email: data.user.email,
            birthdate: data.user.birthdate,
            timezone: data.user.timezone,
            apiToken: data.token,
          } as User;
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),

    // Google OAuth provider (P1-S2-22)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // GitHub OAuth provider (P1-S2-23)
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  // JWT session strategy (aligned with Workers API)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks to customize JWT and session
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        
        // For credentials login, we get the API token directly
        if (user.apiToken) {
          token.apiToken = user.apiToken;
          token.birthdate = user.birthdate;
          token.timezone = user.timezone;
        }
        
        // For OAuth, we need to call our API to create/link the user
        if (account?.provider === "google" || account?.provider === "github") {
          try {
            // TODO: Implement OAuth user creation/linking endpoint in Workers API
            // This would be a POST to /auth/oauth endpoint
            const response = await fetch(`${API_URL}/auth/oauth`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                provider: account.provider,
                providerId: account.providerAccountId,
                email: user.email,
                name: user.name,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              token.apiToken = data.token;
              token.userId = data.user.id;
              token.birthdate = data.user.birthdate;
              token.timezone = data.user.timezone;
            }
          } catch (error) {
            console.error("OAuth user creation error:", error);
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.apiToken = token.apiToken as string;
        session.user.birthdate = token.birthdate as string;
        session.user.timezone = token.timezone as string;
      }

      return session;
    },
  },

  // Pages configuration
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    newUser: "/dashboard", // Redirect new users to dashboard
  },

  // Security
  secret: process.env.NEXTAUTH_SECRET,

  // Debug mode (only in development)
  debug: process.env.NODE_ENV === "development",
};
