# Monitoring and Observability

- Client errors and performance: Sentry browser SDK.
- Worker/API errors: Sentry server SDK + structured logs.
- Metrics:
- API error rate
- FPS degradation events
- Canvas crash fallback rate
- Conversion funnel drop-off
- Alerting thresholds:
- API 5xx > 2% over 10m
- Canvas fallback rate > 8% per hour
- P95 latency > 500ms over 15m
