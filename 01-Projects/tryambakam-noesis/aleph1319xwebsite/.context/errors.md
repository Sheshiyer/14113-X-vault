# Error Model

- Envelope:
- `code`: stable machine-readable identifier
- `message`: user-safe summary
- `details`: optional structured object
- `request_id`: correlation id

Error prefixes:
- `AUTH_*`
- `GRAPH_*`
- `CONTENT_*`
- `EVENTS_*`
- `RATE_*`
- `SYSTEM_*`

All API failures must return typed envelopes and log with `request_id`.
