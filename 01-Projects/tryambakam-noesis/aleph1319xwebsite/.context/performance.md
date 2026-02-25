# Performance Budgets

- JS bundle initial route <= 240KB gzip (excluding 3D assets).
- Canvas startup CPU blocking <= 200ms on desktop baseline.
- Target FPS: 50+ desktop, 30+ mid-tier mobile.
- P95 API latency <= 300ms.
- Image/media LCP element <= 2.5s on mobile 4G.

Operational tactics:
- Chunked scene loading and culling.
- Progressive media with placeholders.
- Route prefetch for common overlays.
