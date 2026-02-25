# Architecture Patterns

- Domain modules: `canvas`, `content`, `search`, `access`, `integrations`, `events`, `auth`.
- API-first contracts with typed clients.
- Event-driven analytics pipeline (append-only events).
- Graceful degradation path: WebGL unavailable -> `/index`.
- Read-heavy caching with stale-while-revalidate.
- Integration links to Selemene/TUI/1319 are references only, not embedded compute UIs.
- Edge-safe runtime; avoid Node-only dependencies in workers.
