# Database Models Quick Reference

## Importing Models

```typescript
import { DatabaseClient, createDatabaseClient } from '../database/client';
import {
  UserModel,
  ChapterModel,
  UserProgressModel,
  BiorhythmSnapshotModel,
  StreakModel,
  AchievementModel,
} from '../models';
import type { User, Chapter, UserProgress, BiorhythmSnapshot, Streak, Achievement } from '../models';
```

## UserModel

```typescript
const users = new UserModel(db);

// Create user
const user = await users.create({
  email: 'user@example.com',
  password_hash: '$argon2id$...',
  birthdate: '1990-01-15',
  timezone: 'America/Los_Angeles',
});

// Find user
const user = await users.findById('uuid');
const user = await users.findByEmail('user@example.com');

// Update user
await users.update('uuid', { timezone: 'America/New_York' });

// Delete user (cascades to all related data)
await users.delete('uuid');

// Calculate days since birth
const days = users.daysSinceBirth('1990-01-15');
```

## ChapterModel

```typescript
const chapters = new ChapterModel(db);

// Create chapter
const chapter = await chapters.create({
  title: 'The Awakening Body',
  cycle: 'physical',
  unlock_trigger: { type: 'peak', cycle: 'physical' },
  canticle_url: '/canticles/morning-octave.mp3',
  duration_minutes: 13,
  chapter_order: 0,
});

// Find chapters
const chapter = await chapters.findById(1);
const allChapters = await chapters.findAll();
const physicalChapters = await chapters.findByCycle('physical');

// Parse JSON fields
const trigger = chapters.parseUnlockTrigger(chapter);
const practices = chapters.parsePractices(chapter);
```

## UserProgressModel

```typescript
const progress = new UserProgressModel(db);

// Create progress (unlock chapter)
const p = await progress.create({
  user_id: 'uuid',
  chapter_id: 1,
  unlocked_at: unixTimestamp(),
});

// Update progress
await progress.update('uuid', 1, {
  time_spent_seconds: 780,
  playback_position_seconds: 350,
});

// Mark complete
await progress.markComplete('uuid', 1);

// Check status
const isUnlocked = await progress.isUnlocked('uuid', 1);
const isCompleted = await progress.isCompleted('uuid', 1);

// Get stats
const stats = await progress.getStats('uuid');
// { total_chapters, unlocked_chapters, completed_chapters, total_time_seconds }
```

## BiorhythmSnapshotModel

```typescript
const snapshots = new BiorhythmSnapshotModel(db);

// Upsert snapshot (create or update)
await snapshots.upsert({
  user_id: 'uuid',
  date: '2026-02-03',
  physical_value: 0.87,
  emotional_value: 0.45,
  intellectual_value: -0.32,
  spiritual_value: 0.65,
  physical_peak: true,
  emotional_peak: false,
  intellectual_peak: false,
  spiritual_peak: false,
  sunrise_time: '06:45:00',
  sunset_time: '18:30:00',
});

// Get snapshot
const snapshot = await snapshots.findByUserAndDate('uuid', '2026-02-03');
const today = await snapshots.getTodaySnapshot('uuid');

// Get date range
const recent = await snapshots.findRecentByUserId('uuid', 7);
const range = await snapshots.findByUserAndDateRange('uuid', '2026-01-01', '2026-02-03');

// Check peaks
const hasPeak = await snapshots.hasPeakToday('uuid');
const peaks = await snapshots.getPeakCyclesToday('uuid');
// ['physical', 'emotional']

// Get stats
const stats = await snapshots.getStats('uuid');
// { total_snapshots, date_range, peak_counts }
```

## StreakModel

```typescript
const streaks = new StreakModel(db);

// Get or create streak
const streak = await streaks.getOrCreate('uuid', 'daily');

// Increment streak (log activity)
await streaks.increment('uuid', 'daily');

// Break streak
await streaks.breakStreak('uuid', 'daily');

// Check if active
const active = streaks.isActive(streak);
const daysUntil = streaks.daysUntilBreak(streak);

// Get milestone progress
const milestone = streaks.getMilestone(streak);
// { current: 7, next: 13, progress: 60.8 }

// Get all streaks
const allStreaks = await streaks.findByUserId('uuid');
const activeStreaks = await streaks.findActiveByUserId('uuid');
```

## AchievementModel

```typescript
const achievements = new AchievementModel(db);

// Unlock achievement
await achievements.unlock({
  user_id: 'uuid',
  achievement_type: 'novice_witness',
  metadata: { streak_count: 7 },
});

// Check if unlocked
const unlocked = await achievements.isUnlocked('uuid', 'novice_witness');

// Update progress
await achievements.updateProgress('uuid', 'first_chapter', 50, {
  chapters_completed: 6,
  chapters_total: 12,
});

// Get all achievements
const all = await achievements.findByUserId('uuid');
const recent = await achievements.findRecentByUserId('uuid', 5);

// Get stats
const stats = await achievements.getStats('uuid');
// { total_unlocked, streak_achievements, chapter_achievements, latest_unlock }

// Auto-check streak achievements
const newAchievements = await achievements.checkStreakAchievements('uuid', 13);
// Returns newly unlocked achievements
```

## Common Patterns

### Worker Entry Point

```typescript
import { createDatabaseClient, type Env } from './database/client';
import { UserModel, ChapterModel } from './models';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = createDatabaseClient(env);
    const users = new UserModel(db);
    
    // Your logic here
    
    return new Response('OK');
  },
};
```

### Batch Operations

```typescript
const statements = [
  { sql: 'INSERT INTO users ...', params: [...] },
  { sql: 'INSERT INTO streaks ...', params: [...] },
];

const results = await db.batch(statements);
```

### Transactions (D1 limitation)

**Note**: D1 does not support explicit transactions. Use batch operations for atomic writes:

```typescript
await db.batch([
  { sql: 'UPDATE users SET ...', params: [...] },
  { sql: 'INSERT INTO achievements ...', params: [...] },
]);
```

All statements in a batch succeed or fail together.

## Type Definitions

```typescript
// User
interface User {
  id: string;
  email: string;
  password_hash: string;
  birthdate: string; // ISO 8601: YYYY-MM-DD
  timezone: string;
  created_at: number; // Unix timestamp
  updated_at: number;
}

// Chapter
interface Chapter {
  id: number;
  title: string;
  cycle: 'physical' | 'emotional' | 'intellectual' | 'spiritual';
  unlock_trigger: string; // JSON
  content_url: string | null;
  canticle_url: string | null;
  duration_minutes: number | null;
  practices: string | null; // JSON array
  chapter_order: number | null;
  created_at: number;
}

// UserProgress
interface UserProgress {
  id: string;
  user_id: string;
  chapter_id: number;
  unlocked_at: number | null;
  completed_at: number | null;
  time_spent_seconds: number;
  playback_position_seconds: number;
  notes: string | null;
  created_at: number;
  updated_at: number;
}

// BiorhythmSnapshot
interface BiorhythmSnapshot {
  id: string;
  user_id: string;
  date: string; // ISO 8601: YYYY-MM-DD
  physical_value: number; // -1.0 to 1.0
  emotional_value: number;
  intellectual_value: number;
  spiritual_value: number;
  physical_peak: number; // 0 or 1
  emotional_peak: number;
  intellectual_peak: number;
  spiritual_peak: number;
  sunrise_time: string | null; // ISO 8601: HH:MM:SS
  sunset_time: string | null;
  calculated_at: number;
}

// Streak
interface Streak {
  id: string;
  user_id: string;
  streak_type: 'daily' | 'morning' | 'flow' | 'solar' | 'build';
  current_count: number;
  longest_count: number;
  last_activity_date: string | null; // ISO 8601: YYYY-MM-DD
  started_at: number;
  updated_at: number;
}

// Achievement
interface Achievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  unlocked_at: number;
  progress: number; // 0-100
  metadata: string | null; // JSON
}

type AchievementType =
  | 'novice_witness'
  | 'transformation_initiate'
  | 'world_builder'
  | 'master_architect'
  | 'life_cube_master'
  | 'first_chapter'
  | 'physical_master'
  | 'emotional_master'
  | 'intellectual_master'
  | 'spiritual_master'
  | 'complete_all'
  | 'morning_warrior'
  | 'flow_walker'
  | 'solar_leader'
  | 'build_champion';
```

## Error Handling

All model methods throw errors on failure. Use try-catch:

```typescript
try {
  const user = await users.create({ ... });
} catch (error) {
  console.error('Failed to create user:', error);
  return new Response('Error', { status: 500 });
}
```

## Helper Functions

```typescript
import {
  generateUUID,
  unixTimestamp,
  formatDate,
  formatTime,
  parseDate,
} from './database/client';

const id = generateUUID(); // crypto.randomUUID()
const now = unixTimestamp(); // Math.floor(Date.now() / 1000)
const today = formatDate(new Date()); // '2026-02-03'
const time = formatTime(new Date()); // '14:35:22'
const date = parseDate('2026-02-03'); // Date object
```

## See Also

- [Database README](./database/README.md)
- [Schema Review](./database/schema-review.md)
- [Migration Tests](./database/__tests__/migrations.test.ts)
