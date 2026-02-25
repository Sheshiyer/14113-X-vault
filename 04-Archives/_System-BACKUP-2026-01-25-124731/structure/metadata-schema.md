# Metadata Schema
`Version: 1.0.0 | Runtime: 2026-01-22`

This schema defines the required and optional fields for processing and indexing items moving from `processing-folder` into PARA. It is designed to keep semantic meaning stable even as files move across folders over time.

## Required Fields
- `title`
- `source_path`
- `destination_path`
- `para_bucket` (01-Projects | 02-Areas | 03-Resources | 04-Archives)
- `content_type` (book | paper | presentation | image | audio | video | dataset | software | note | archive | unknown)
- `domain_tags` (from controlled vocabulary)
- `moc_links` (at least 1)
- `processed_at` (YYYY-MM-DD)
- `reviewed_by`

## Muse-Enneagram Fields
- `ennea_type` (1-9)
- `ennea_wing` (optional)
- `instinct` (optional: sp | sx | so)
- `muse_archetype` (Polymnia | Clio | Euterpe | Thalia | Melpomene | Erato | Calliope | Terpsichore | Urania)
- `endocrine_mapping` (Melatonin | Oxytocin | Endorphins | Dopamine | Cortisol | Estrogen | Testosterone | Adrenaline | Serotonin)
- `confidence` (low | med | high)

## Optional Context Fields
- `author`
- `year`
- `publisher`
- `series`
- `topic_cluster`
- `language`
- `rights_status`
- `duplicate_group_id`
- `canonical_version`

## Rules
- Never fabricate metadata; leave unknown fields blank.
- Every processed item must have at least one domain tag, one MOC link, and Muse-Enneagram fields with a confidence value.
- If Enneagram mapping is unclear, set `confidence: low` and flag for later review.
