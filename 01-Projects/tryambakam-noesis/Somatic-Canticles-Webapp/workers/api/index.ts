import { handleLogin } from './auth/login';
import { handleRegister } from './auth/register';
import { handleRefresh } from './auth/refresh';
import { handleLogout } from './auth/logout';

/**
 * Somatic-Canticles API - Cloudflare Workers Entry Point
 * 
 * Handles all backend API requests for biorhythm calculations,
 * chapter unlocks, user progress, and authentication.
 */

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    try {
      // Auth routes
      if (path === '/auth/login' && request.method === 'POST') {
        const response = await handleLogin(request, env);
        return addCorsHeaders(response, cors);
      }

      if (path === '/auth/register' && request.method === 'POST') {
        const response = await handleRegister(request, env);
        return addCorsHeaders(response, cors);
      }

      if (path === '/auth/refresh' && request.method === 'POST') {
        const response = await handleRefresh(request, env);
        return addCorsHeaders(response, cors);
      }

      if (path === '/auth/logout' && request.method === 'POST') {
        const response = await handleLogout(request, env);
        return addCorsHeaders(response, cors);
      }

      if (path.startsWith('/biorhythm/')) {
        // TODO: Import biorhythm handlers
        return new Response('Biorhythm endpoints - Coming soon', { status: 501, headers: cors });
      }

      if (path.startsWith('/chapters/')) {
        // TODO: Import chapter handlers
        return new Response('Chapter endpoints - Coming soon', { status: 501, headers: cors });
      }

      if (path.startsWith('/progress/')) {
        // TODO: Import progress handlers
        return new Response('Progress endpoints - Coming soon', { status: 501, headers: cors });
      }

      // Health check
      if (path === '/health') {
        return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
          headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      // 404 - Not Found
      return new Response('Not Found', { status: 404, headers: cors });
    } catch (error: any) {
      // Error handling
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  },
};

// Helper function to add CORS headers to response
function addCorsHeaders(response: Response, cors: Record<string, string>): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(cors).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
