# Database Module

Cloudflare D1 database infrastructure for Somatic-Canticles webapp.

## Structure

```
workers/
├── database/
│   ├── client.ts              # D1 database client wrapper
│   ├── seed.ts                # TypeScript seed script
│   ├── seed.sql               # SQL seed script
│   ├── schema-review.md       # Schema analysis and review
│   ├── index.ts               # Module exports
│   └── __tests__/
│       └── migrations.test.ts # Migration test checklist
├── migrations/
│   ├── 0001_initial_schema.sql        # Initial schema
│   ├── 0002_add_chapter_order.sql     # Add chapter ordering
│   └── 0003_add_achievement_progress.sql # Add achievement progress
└── models/
    ├── User.ts                # User model and CRUD
    ├── Chapter.ts             # Chapter model and CRUD
    ├── UserProgress.ts        # User progress tracking
    ├── BiorhythmSnapshot.ts   # Biorhythm cache
    ├── Streak.ts              # Streak mechanics
    ├── Achievement.ts         # Achievement system
    └── index.ts               # Model exports
```

## Tables

### `users`
User accounts with birthdate for biorhythm calculations.

**Columns:**
- `id` (TEXT, PRIMARY KEY) - UUID
- `email` (TEXT, UNIQUE) - User email
- `password_hash` (TEXT) - Argon2id hash
- `birthdate` (TEXT) - ISO 8601 date (YYYY-MM-DD)
- `timezone` (TEXT) - Default 'UTC'
- `created_at` (INTEGER) - Unix timestamp
- `updated_at` (INTEGER) - Unix timestamp

**Indexes:**
- `idx_users_email` (UNIQUE)
- `idx_users_created_at`

### `chapters`
12 chapters organized by biorhythm cycle.

**Columns:**
- `id` (INTEGER, PRIMARY KEY) - Chapter ID (1-12)
- `title` (TEXT) - Chapter title
- `cycle` (TEXT) - 'physical', 'emotional', 'intellectual', 'spiritual'
- `unlock_trigger` (TEXT) - JSON unlock conditions
- `content_url` (TEXT) - Link to chapter content
- `canticle_url` (TEXT) - Link to audio (R2)
- `duration_minutes` (INTEGER) - Canticle duration
- `practices` (TEXT) - JSON array of practices
- `chapter_order` (INTEGER) - Display order (added in 0002)
- `created_at` (INTEGER) - Unix timestamp

**Indexes:**
- `idx_chapters_cycle`
- `idx_chapters_order` (added in 0002)

### `user_progress`
Tracks user progress through chapters.

**Columns:**
- `id` (TEXT, PRIMARY KEY) - UUID
- `user_id` (TEXT, FOREIGN KEY) - References users(id) CASCADE
- `chapter_id` (INTEGER, FOREIGN KEY) - References chapters(id) CASCADE
- `unlocked_at` (INTEGER) - When chapter was unlocked
- `completed_at` (INTEGER) - When chapter was completed
- `time_spent_seconds` (INTEGER) - Total time spent
- `playback_position_seconds` (INTEGER) - Audio resume position
- `notes` (TEXT) - User reflection notes
- `created_at` (INTEGER) - Unix timestamp
- `updated_at` (INTEGER) - Unix timestamp

**Indexes:**
- `idx_progress_user_id`
- `idx_progress_chapter_id`
- `idx_progress_unlocked`
- `idx_progress_user_chapter` (UNIQUE composite: user_id, chapter_id)

### `biorhythm_snapshots`
Cached biorhythm calculations per user per day.

**Columns:**
- `id` (TEXT, PRIMARY KEY) - UUID
- `user_id` (TEXT, FOREIGN KEY) - References users(id) CASCADE
- `date` (TEXT) - ISO 8601 date (YYYY-MM-DD)
- `physical_value` (REAL) - -1.0 to 1.0
- `emotional_value` (REAL) - -1.0 to 1.0
- `intellectual_value` (REAL) - -1.0 to 1.0
- `spiritual_value` (REAL) - -1.0 to 1.0
- `physical_peak` (INTEGER) - 0 or 1 (boolean)
- `emotional_peak` (INTEGER) - 0 or 1
- `intellectual_peak` (INTEGER) - 0 or 1
- `spiritual_peak` (INTEGER) - 0 or 1
- `sunrise_time` (TEXT) - ISO 8601 time (HH:MM:SS)
- `sunset_time` (TEXT) - ISO 8601 time
- `calculated_at` (INTEGER) - Unix timestamp

**Indexes:**
- `idx_biorhythm_user_id`
- `idx_biorhythm_date`
- `idx_biorhythm_user_date` (UNIQUE composite: user_id, date)

### `streaks`
User streak tracking (5 types: daily, morning, flow, solar, build).

**Columns:**
- `id` (TEXT, PRIMARY KEY) - UUID
- `user_id` (TEXT, FOREIGN KEY) - References users(id) CASCADE
- `streak_type` (TEXT) - 'daily', 'morning', 'flow', 'solar', 'build'
- `current_count` (INTEGER) - Current streak count
- `longest_count` (INTEGER) - Longest streak achieved
- `last_activity_date` (TEXT) - ISO 8601 date
- `started_at` (INTEGER) - Unix timestamp
- `updated_at` (INTEGER) - Unix timestamp

**Indexes:**
- `idx_streaks_user_id`
- `idx_streaks_user_type` (UNIQUE composite: user_id, streak_type)

### `achievements`
Unlocked achievements and gamification milestones.

**Columns:**
- `id` (TEXT, PRIMARY KEY) - UUID
- `user_id` (TEXT, FOREIGN KEY) - References users(id) CASCADE
- `achievement_type` (TEXT) - Achievement identifier
- `unlocked_at` (INTEGER) - Unix timestamp
- `progress` (INTEGER) - 0-100 (added in 0003)
- `metadata` (TEXT) - JSON additional data (added in 0003)

**Indexes:**
- `idx_achievements_user_id`
- `idx_achievements_user_type` (UNIQUE composite: user_id, achievement_type)

## Usage

### Initialize Database Client

```typescript
import { createDatabaseClient } from './database/client';
import type { Env } from './database/client';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = createDatabaseClient(env);
    // Use db...
  }
};
```

### Use Models

```typescript
import { UserModel, ChapterModel } from './models';

const users = new UserModel(db);
const chapters = new ChapterModel(db);

// Create user
const user = await users.create({
  email: 'user@example.com',
  password_hash: '...',
  birthdate: '1990-01-15',
});

// Find chapters by cycle
const physicalChapters = await chapters.findByCycle('physical');
```

## Migration Commands

### Apply Migrations Locally

```bash
cd workers
wrangler d1 migrations apply somatic-canticles-db --local
```

### Apply Migrations to Production

```bash
wrangler d1 migrations apply somatic-canticles-db --remote
```

### Seed Database

```bash
# Local
wrangler d1 execute somatic-canticles-db --local --file=database/seed.sql

# Remote
wrangler d1 execute somatic-canticles-db --remote --file=database/seed.sql
```

### Query Database

```bash
# List tables
wrangler d1 execute somatic-canticles-db --local \
  --command="SELECT name FROM sqlite_master WHERE type='table'"

# Count users
wrangler d1 execute somatic-canticles-db --local \
  --command="SELECT COUNT(*) FROM users"

# View chapters
wrangler d1 execute somatic-canticles-db --local \
  --command="SELECT id, title, cycle FROM chapters ORDER BY chapter_order"
```

## Testing

See `database/__tests__/migrations.test.ts` for migration test checklist.

### Manual Testing Steps

1. Apply migrations locally
2. Seed database
3. Test foreign key cascades
4. Test unique constraints
5. Verify indexes are used (EXPLAIN QUERY PLAN)
6. Test rollback procedures

## Performance

All critical queries use indexes:

| Query Type | Index Used | Performance |
|------------|-----------|-------------|
| User by email | `idx_users_email` | O(log n) |
| Chapter by cycle | `idx_chapters_cycle` | O(log n) |
| Progress by user + chapter | `idx_progress_user_chapter` | O(log n) |
| Snapshot by user + date | `idx_biorhythm_user_date` | O(log n) |
| Streak by user + type | `idx_streaks_user_type` | O(log n) |
| Achievement by user + type | `idx_achievements_user_type` | O(log n) |

Expected query times: < 10ms for indexed queries on datasets up to 10,000 records.

## Rollback Procedures

### Rollback Migration 0003

```sql
ALTER TABLE achievements DROP COLUMN progress;
ALTER TABLE achievements DROP COLUMN metadata;
```

### Rollback Migration 0002

```sql
ALTER TABLE chapters DROP COLUMN chapter_order;
DROP INDEX idx_chapters_order;
```

**Note:** D1 migrations are automatically versioned. Create new migration files rather than modifying existing ones.

## Security

- **Password Storage:** Argon2id hashes only (via `@node-rs/argon2`)
- **Foreign Key Cascades:** Enabled for GDPR compliance (user deletion removes all related data)
- **Sensitive Data:** Birthdate is required for biorhythm calculations (disclosed in privacy policy)

## Data Types

D1 uses SQLite types:

- `TEXT` - Strings, UUIDs, ISO 8601 dates
- `INTEGER` - Numbers, unix timestamps, booleans (0/1)
- `REAL` - Floating point numbers (biorhythm sine values)

**Note:** No native UUID or TIMESTAMPTZ types. Use TEXT for UUIDs and INTEGER for timestamps.

## See Also

- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Schema Review](./schema-review.md)
- [Migration Tests](./database/__tests__/migrations.test.ts)
