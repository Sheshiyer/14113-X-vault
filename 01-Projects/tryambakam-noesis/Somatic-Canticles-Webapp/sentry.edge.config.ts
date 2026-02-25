import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Adjust this value in production
  tracesSampleRate: 1.0,

  // Set environment
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  // Filter out transactions for health checks
  beforeSend(event, hint) {
    // Filter out health check requests
    if (event.request?.url?.includes("/health")) {
      return null;
    }
    return event;
  },
});
