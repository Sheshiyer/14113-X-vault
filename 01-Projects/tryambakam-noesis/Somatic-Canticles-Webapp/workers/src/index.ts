import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import type { Env } from './types';

// Import routes
import authRoutes from './routes/auth';
import biorhythmRoutes from './routes/biorhythm';
import chaptersRoutes from './routes/chapters';
import progressRoutes from './routes/progress';

// Create main app
const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://somatic-canticles.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('*', logger());
app.use('*', poweredBy());

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT
  });
});

// API version prefix
app.get('/', (c) => {
  return c.json({
    name: 'Somatic Canticles API',
    version: '1.0.0',
    documentation: '/api/v1/docs'
  });
});

// Mount routes
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/biorhythm', biorhythmRoutes);
app.route('/api/v1/chapters', chaptersRoutes);
app.route('/api/v1/progress', progressRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found'
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    success: false,
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'development' ? err.message : 'Something went wrong'
  }, 500);
});

export default app;
