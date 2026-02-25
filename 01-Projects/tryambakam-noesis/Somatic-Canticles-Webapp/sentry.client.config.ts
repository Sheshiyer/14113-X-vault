import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Adjust this value in production, or use tracesSampler for fine-grained control
  tracesSampleRate: 1.0,

  // Set environment
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "chrome-extension://",
    "moz-extension://",
    // Network errors
    "Network request failed",
    "NetworkError",
    "Failed to fetch",
  ],

  // Filter out transactions for health checks and static assets
  beforeSend(event, hint) {
    // Filter out health check requests
    if (event.request?.url?.includes("/health")) {
      return null;
    }
    // Filter out static asset errors
    if (event.request?.url?.includes("/_next/static")) {
      return null;
    }
    return event;
  },
});
