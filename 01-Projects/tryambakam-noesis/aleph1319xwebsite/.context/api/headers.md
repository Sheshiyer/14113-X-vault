# Required API Headers

- `x-request-id`: unique per request
- `x-client-version`: frontend build identifier
- `x-session-id`: anonymous or authenticated session id
- `authorization`: required for protected routes

Optional headers:
- `x-feature-flags`
- `x-device-class`

Missing required headers should return `400` with typed error envelope.
