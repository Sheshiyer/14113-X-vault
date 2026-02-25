/**
 * Database Seed Script (TypeScript)
 * Creates test users, chapters, and sample data programmatically
 * 
 * Usage: 
 * - Run via Worker: Call `seedDatabase(env.DB)` in development
 * - Or use seed.sql directly with wrangler
 */

import { DatabaseClient } from './client';
import {
  UserModel,
  ChapterModel,
  UserProgressModel,
  BiorhythmSnapshotModel,
  StreakModel,
  AchievementModel,
} from '../models';

export async function seedDatabase(db: DatabaseClient): Promise<void> {
  console.log('🌱 Seeding database...');

  // Create models
  const users = new UserModel(db);
  const chapters = new ChapterModel(db);
  const progress = new UserProgressModel(db);
  const snapshots = new BiorhythmSnapshotModel(db);
  const streaks = new StreakModel(db);
  const achievements = new AchievementModel(db);

  // ==========================================
  // 1. Create Test Users
  // ==========================================
  console.log('Creating test users...');

  const user1 = await users.create({
    email: 'alice@somatic-canticles.com',
    password_hash: '$argon2id$v=19$m=65536,t=3,p=4$placeholder',
    birthdate: '1990-01-15',
    timezone: 'America/Los_Angeles',
  });

  const user2 = await users.create({
    email: 'bob@somatic-canticles.com',
    password_hash: '$argon2id$v=19$m=65536,t=3,p=4$placeholder',
    birthdate: '1985-06-22',
    timezone: 'America/New_York',
  });

  const user3 = await users.create({
    email: 'carol@somatic-canticles.com',
    password_hash: '$argon2id$v=19$m=65536,t=3,p=4$placeholder',
    birthdate: '1992-11-03',
    timezone: 'Europe/London',
  });

  console.log(`✅ Created ${[user1, user2, user3].length} users`);

  // ==========================================
  // 2. Create 12 Chapters
  // ==========================================
  console.log('Creating chapters...');

  const chapterData = [
    // Physical Cycle
    {
      title: 'The Awakening Body',
      cycle: 'physical' as const,
      unlock_trigger: {
        type: 'peak' as const,
        cycle: 'physical' as const,
        conditions: { time: 'sunrise' },
      },
      content_url: '/content/chapter-1',
      canticle_url: '/canticles/morning-octave.mp3',
      duration_minutes: 13,
      practices: ['8-breath activation', 'Morning movement', 'Body scan'],
      chapter_order: 0,
    },
    {
      title: 'The Rhythmic Self',
      cycle: 'physical' as const,
      unlock_trigger: {
        type: 'high' as const,
        cycle: 'physical' as const,
        conditions: { sustained: true },
      },
      content_url: '/content/chapter-2',
      canticle_url: '/canticles/terpsichore-dance.mp3',
      duration_minutes: 21,
      practices: ['Movement meditation', 'Rhythmic breathing', 'Flow state practice'],
      chapter_order: 1,
    },
    {
      title: 'The Grounded Form',
      cycle: 'physical' as const,
      unlock_trigger: { type: 'peak' as const, cycle: 'physical' as const },
      content_url: '/content/chapter-3',
      canticle_url: '/canticles/earth-resonance.mp3',
      duration_minutes: 19,
      practices: ['Somatic integration', 'Grounding practice', 'Body wisdom'],
      chapter_order: 2,
    },
    // Emotional Cycle
    {
      title: 'The Feeling Tone',
      cycle: 'emotional' as const,
      unlock_trigger: { type: 'high' as const, cycle: 'emotional' as const },
      content_url: '/content/chapter-4',
      canticle_url: '/canticles/heart-harmonics.mp3',
      duration_minutes: 13,
      practices: ['Sound healing', 'Emotional awareness', 'Heart coherence'],
      chapter_order: 3,
    },
    {
      title: 'The Wave Rider',
      cycle: 'emotional' as const,
      unlock_trigger: {
        type: 'high' as const,
        cycle: 'emotional' as const,
        conditions: { flow: true },
      },
      content_url: '/content/chapter-5',
      canticle_url: '/canticles/melpomene-lament.mp3',
      duration_minutes: 21,
      practices: ['Breath + sound', 'Emotional flow', 'Wave riding'],
      chapter_order: 4,
    },
    {
      title: 'The Resonant Heart',
      cycle: 'emotional' as const,
      unlock_trigger: { type: 'peak' as const, cycle: 'emotional' as const },
      content_url: '/content/chapter-6',
      canticle_url: '/canticles/solar-plexus-song.mp3',
      duration_minutes: 19,
      practices: ['Frequency attunement', 'Heart activation', 'Emotional mastery'],
      chapter_order: 5,
    },
    // Intellectual Cycle
    {
      title: 'The Pattern Mind',
      cycle: 'intellectual' as const,
      unlock_trigger: { type: 'high' as const, cycle: 'intellectual' as const },
      content_url: '/content/chapter-7',
      canticle_url: '/canticles/architect-code.mp3',
      duration_minutes: 13,
      practices: ['Gene Keys integration', 'Pattern recognition', 'Mental clarity'],
      chapter_order: 6,
    },
    {
      title: 'The Clear Seeing',
      cycle: 'intellectual' as const,
      unlock_trigger: {
        type: 'high' as const,
        cycle: 'intellectual' as const,
        conditions: { clarity: true },
      },
      content_url: '/content/chapter-8',
      canticle_url: '/canticles/urania-navigation.mp3',
      duration_minutes: 21,
      practices: ['WitnessOS framework', 'Clear seeing', 'Mental structure'],
      chapter_order: 7,
    },
    {
      title: 'The Master Builder',
      cycle: 'intellectual' as const,
      unlock_trigger: { type: 'peak' as const, cycle: 'intellectual' as const },
      content_url: '/content/chapter-9',
      canticle_url: '/canticles/44-sequence.mp3',
      duration_minutes: 44,
      practices: ['System design', 'Architect practice', 'Blueprint creation'],
      chapter_order: 8,
    },
    // Spiritual Cycle
    {
      title: 'The Witness Awakens',
      cycle: 'spiritual' as const,
      unlock_trigger: {
        type: 'high' as const,
        cycle: 'spiritual' as const,
        conditions: { opening: true },
      },
      content_url: '/content/chapter-10',
      canticle_url: '/canticles/calliope-epic.mp3',
      duration_minutes: 13,
      practices: ['Meditation', 'Witness practice', 'Spiritual opening'],
      chapter_order: 9,
    },
    {
      title: 'The Unity Bridge',
      cycle: 'spiritual' as const,
      unlock_trigger: {
        type: 'high' as const,
        cycle: 'spiritual' as const,
        conditions: { transcendent: true },
      },
      content_url: '/content/chapter-11',
      canticle_url: '/canticles/152-harmonic.mp3',
      duration_minutes: 21,
      practices: ['Unity consciousness', 'Bridge practice', 'Transcendence'],
      chapter_order: 10,
    },
    {
      title: 'The Infinite Return',
      cycle: 'spiritual' as const,
      unlock_trigger: { type: 'peak' as const, cycle: 'spiritual' as const },
      content_url: '/content/chapter-12',
      canticle_url: '/canticles/world-completion.mp3',
      duration_minutes: 125,
      practices: ['Integration', 'Infinite return', 'World completion'],
      chapter_order: 11,
    },
  ];

  const createdChapters = [];
  for (const data of chapterData) {
    const chapter = await chapters.create(data);
    createdChapters.push(chapter);
  }

  console.log(`✅ Created ${createdChapters.length} chapters`);

  // ==========================================
  // 3. Create Sample Progress for User 1
  // ==========================================
  console.log('Creating sample progress...');

  const now = Date.now();
  const weekAgo = Math.floor((now - 7 * 24 * 60 * 60 * 1000) / 1000);
  const fiveDaysAgo = Math.floor((now - 5 * 24 * 60 * 60 * 1000) / 1000);
  const twoDaysAgo = Math.floor((now - 2 * 24 * 60 * 60 * 1000) / 1000);

  await progress.create({
    user_id: user1.id,
    chapter_id: 1,
    unlocked_at: weekAgo,
  });
  await progress.update(user1.id, 1, {
    completed_at: fiveDaysAgo,
    time_spent_seconds: 780,
  });

  await progress.create({
    user_id: user1.id,
    chapter_id: 2,
    unlocked_at: fiveDaysAgo,
  });
  await progress.update(user1.id, 2, {
    completed_at: twoDaysAgo,
    time_spent_seconds: 1260,
  });

  await progress.create({
    user_id: user1.id,
    chapter_id: 3,
    unlocked_at: twoDaysAgo,
  });

  console.log(`✅ Created 3 progress records`);

  // ==========================================
  // 4. Create Biorhythm Snapshots (Last 7 days for User 1)
  // ==========================================
  console.log('Creating biorhythm snapshots...');

  const today = new Date();
  const snapshotData = [
    { days: 0, physical: 0.87, emotional: 0.45, intellectual: -0.32, spiritual: 0.65, peaks: [true, false, false, false] },
    { days: 1, physical: 0.76, emotional: 0.62, intellectual: -0.15, spiritual: 0.48, peaks: [false, false, false, false] },
    { days: 2, physical: 0.55, emotional: 0.81, intellectual: 0.02, spiritual: 0.29, peaks: [false, false, false, false] },
    { days: 3, physical: 0.28, emotional: 0.94, intellectual: 0.21, spiritual: 0.08, peaks: [false, true, false, false] },
    { days: 4, physical: -0.02, emotional: 0.98, intellectual: 0.42, spiritual: -0.13, peaks: [false, true, false, false] },
    { days: 5, physical: -0.31, emotional: 0.89, intellectual: 0.63, spiritual: -0.32, peaks: [false, false, false, false] },
    { days: 6, physical: -0.58, emotional: 0.72, intellectual: 0.82, spiritual: -0.49, peaks: [false, false, false, false] },
  ];

  for (const data of snapshotData) {
    const date = new Date(today);
    date.setDate(date.getDate() - data.days);
    const dateStr = date.toISOString().split('T')[0];

    await snapshots.upsert({
      user_id: user1.id,
      date: dateStr,
      physical_value: data.physical,
      emotional_value: data.emotional,
      intellectual_value: data.intellectual,
      spiritual_value: data.spiritual,
      physical_peak: data.peaks[0],
      emotional_peak: data.peaks[1],
      intellectual_peak: data.peaks[2],
      spiritual_peak: data.peaks[3],
      sunrise_time: '06:45:00',
      sunset_time: '18:30:00',
    });
  }

  console.log(`✅ Created ${snapshotData.length} biorhythm snapshots`);

  // ==========================================
  // 5. Create Streaks for User 1
  // ==========================================
  console.log('Creating streaks...');

  await streaks.create({ user_id: user1.id, streak_type: 'daily' });
  await streaks.increment(user1.id, 'daily');

  await streaks.create({ user_id: user1.id, streak_type: 'morning' });
  await streaks.increment(user1.id, 'morning');

  await streaks.create({ user_id: user1.id, streak_type: 'flow' });

  console.log(`✅ Created 3 streaks`);

  // ==========================================
  // 6. Create Achievements for User 1
  // ==========================================
  console.log('Creating achievements...');

  await achievements.unlock({
    user_id: user1.id,
    achievement_type: 'novice_witness',
    metadata: { streak_count: 7 },
  });

  await achievements.unlock({
    user_id: user1.id,
    achievement_type: 'first_chapter',
    metadata: { chapter_id: 1 },
  });

  console.log(`✅ Created 2 achievements`);

  console.log('🎉 Database seeded successfully!');
}

/**
 * Summary of seeded data
 */
export function getSeedSummary() {
  return {
    users: 3,
    chapters: 12,
    progress_records: 3,
    biorhythm_snapshots: 7,
    streaks: 3,
    achievements: 2,
  };
}
