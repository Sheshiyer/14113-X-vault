# Meru.org video URL inventory (from `urls_youtube.txt`)

Source: `/Volumes/madara/2026/twc-vault/03-Resources/Websites/meru.org/urls_youtube.txt`

## Summary

- **Total lines in file:** 19
- **Unique raw URLs (exact-string):** 19
- **Unique normalized URLs:** 13
- **Unique video IDs:** 11

## Normalization rules used

- Treat the following as the same video when they share the same **video ID**:
  - `https://youtu.be/<id>`
  - `https://www.youtube.com/watch?v=<id>`
  - `https://www.youtube.com/embed/<id>`
- Strip non-essential query parameters for de-duplication (e.g., `&t=2s`).
- Non-video YouTube pages (e.g., `/channel/...`, `/user/...`) are kept as non-video links.

## Breakdown by host (unique normalized URLs)

- **YouTube:** 13 (11 videos + 2 non-video pages)
- **Vimeo:** 0
- **Other:** 0

## Non-video links found

- https://www.youtube.com/channel/UCLZQUVpbEqct1GYqhNF-kpQ
- https://www.youtube.com/user/filmguy2121

## Unique videos (normalized)

Normalized form: `https://www.youtube.com/watch?v=<id>`

1. https://www.youtube.com/watch?v=1GNUadL_gHU
2. https://www.youtube.com/watch?v=8rwI7kZLepA
3. https://www.youtube.com/watch?v=NnwmiT4VsdM
4. https://www.youtube.com/watch?v=uLbuGu6MWAE
5. https://www.youtube.com/watch?v=yGUzWMqiuzA
6. https://www.youtube.com/watch?v=J6OsDczx5iM
7. https://www.youtube.com/watch?v=OJGW2UANWRE
8. https://www.youtube.com/watch?v=feYsbcU83HE
9. https://www.youtube.com/watch?v=l9yFwGfJIB8
10. https://www.youtube.com/watch?v=vE-ViyPXj4Q
11. https://www.youtube.com/watch?v=zYgP__Ke3SQ

## Suggested batching plan

Goal: process in **batches of 4** (manageable 20–40 min blocks, depending on video length).

### Batch 1 (4 videos)

- https://www.youtube.com/watch?v=1GNUadL_gHU
- https://www.youtube.com/watch?v=8rwI7kZLepA
- https://www.youtube.com/watch?v=NnwmiT4VsdM
- https://www.youtube.com/watch?v=uLbuGu6MWAE

### Batch 2 (4 videos)

- https://www.youtube.com/watch?v=yGUzWMqiuzA
- https://www.youtube.com/watch?v=J6OsDczx5iM
- https://www.youtube.com/watch?v=OJGW2UANWRE
- https://www.youtube.com/watch?v=feYsbcU83HE

### Remaining batches (not listed in full)

- Batch 3: remaining 3 videos (`l9yFwGfJIB8`, `vE-ViyPXj4Q`, `zYgP__Ke3SQ`).
