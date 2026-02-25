/**
 * Next.js Middleware
 * 
 * Handles route protection, authentication, and user flow redirection.
 * Runs on the edge for optimal performance.
 * 
 * Power numbers: 8, 13, 19, 21, 44, 125, 152
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { JWT } from "next-auth/jwt";

// ============================================
// ROUTE CONFIGURATION
// ============================================

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
  "/api/auth",
  "/_next",
  "/images",
  "/audio",
  "/favicon.ico",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
];

/**
 * Auth routes (redirect to dashboard if already authenticated)
 */
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
];

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/chapters",
  "/profile",
  "/settings",
];

/**
 * Routes that require completed onboarding
 */
const ONBOARDING_REQUIRED_ROUTES = [
  "/dashboard",
  "/chapters",
];

/**
 * Onboarding route
 */
const ONBOARDING_ROUTE = "/onboarding";

/**
 * Post-login redirect route
 */
const DEFAULT_REDIRECT = "/dashboard";

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a path is in the public routes list
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if a path is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if a path requires protection
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if a path requires completed onboarding
 */
function requiresOnboarding(pathname: string): boolean {
  return ONBOARDING_REQUIRED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Create a redirect response with cache headers
 */
function redirect(url: string, request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(url, request.url));
  
  // Prevent caching of redirect responses
  response.headers.set("Cache-Control", "no-store, max-age=0");
  
  return response;
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  return response;
}

// ============================================
// MAIN MIDDLEWARE
// ============================================

/**
 * Main middleware function
 * Handles routing logic, auth checks, and redirects
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
  // Get session token from cookies
  const sessionToken = request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  
  const isAuthenticated = !!sessionToken;
  
  // Check for onboarding completion flag in cookies
  const onboardingCompleted = request.cookies.get("sc:onboarding:completed")?.value === "true";
  
  // Check for biorhythm data presence
  const hasBiorhythmData = request.cookies.get("sc:biorhythm:birthDate")?.value ||
    request.cookies.has("sc:biorhythm:profile");
  
  // ==========================================
  // 1. PUBLIC ASSETS - Always allow
  // ==========================================
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/audio/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|json|xml|txt)$/)
  ) {
    return addSecurityHeaders(NextResponse.next());
  }
  
  // ==========================================
  // 2. AUTHENTICATED USER REDIRECTS
  // ==========================================
  if (isAuthenticated) {
    // Redirect auth routes to dashboard
    if (isAuthRoute(pathname)) {
      return redirect(DEFAULT_REDIRECT, request);
    }
    
    // Check onboarding requirement
    if (requiresOnboarding(pathname) && !onboardingCompleted) {
      // Allow access to onboarding page itself
      if (pathname === ONBOARDING_ROUTE || pathname.startsWith(`${ONBOARDING_ROUTE}/`)) {
        return addSecurityHeaders(NextResponse.next());
      }
      // Redirect to onboarding
      return redirect(ONBOARDING_ROUTE, request);
    }
    
    // If on onboarding but already completed, redirect to dashboard
    if (pathname === ONBOARDING_ROUTE && onboardingCompleted) {
      return redirect(DEFAULT_REDIRECT, request);
    }
  }
  
  // ==========================================
  // 3. UNAUTHENTICATED USER PROTECTION
  // ==========================================
  if (!isAuthenticated) {
    // Allow public routes
    if (isPublicRoute(pathname)) {
      return addSecurityHeaders(NextResponse.next());
    }
    
    // Redirect protected routes to login
    if (isProtectedRoute(pathname)) {
      const loginUrl = new URL("/login", request.url);
      // Add redirect callback
      loginUrl.searchParams.set("callbackUrl", pathname);
      return redirect(loginUrl.toString(), request);
    }
    
    // Allow access to all other routes (will be handled by page-level auth)
    return addSecurityHeaders(NextResponse.next());
  }
  
  // ==========================================
  // 4. BIORHYTHM DATA CHECK (optional)
  // ==========================================
  // For dashboard and chapters, check if user has biorhythm data
  // This is a soft check - we don't redirect, just add a header
  // that the client can use to show a reminder
  if ((pathname === "/dashboard" || pathname.startsWith("/chapters/")) && !hasBiorhythmData) {
    const response = addSecurityHeaders(NextResponse.next());
    response.headers.set("X-Biorhythm-Data-Missing", "true");
    return response;
  }
  
  // ==========================================
  // 5. ALLOW REQUEST
  // ==========================================
  return addSecurityHeaders(NextResponse.next());
}

// ============================================
// NEXT-AUTH MIDDLEWARE (for API routes)
// ============================================

/**
 * Enhanced auth middleware for API routes
 * Provides JWT verification and token refresh
 */
export const authMiddleware = withAuth(
  async function onSuccess(req) {
    // Token is valid, proceed
    const token = req.nextauth.token as JWT;
    
    // Add user info to headers for API routes
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", token.sub || "");
      requestHeaders.set("x-user-email", token.email || "");
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

// ============================================
// CONFIG
// ============================================

/**
 * Middleware matcher configuration
 * Defines which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

// ============================================
// EXPORTS
// ============================================

export default middleware;
