/**
 * Test Fixtures - Mock Data Structures
 * 
 * This file contains mock data for unit, integration, and e2e tests.
 * All fixtures follow the project's data models for consistency.
 */

import type { UserProfile } from '@/types/user';
import type { Chapter, ChapterProgress } from '@/types/chapter';
import type { BiorhythmReading } from '@/types/biorhythm';

// ============================================
// User Fixtures
// ============================================

export const mockUser: UserProfile = {
  id: 'user-test-001',
  email: 'test@example.com',
  fullName: 'Test User',
  displayName: 'TestUser',
  avatarUrl: null,
  dateOfBirth: '1990-06-15',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-15T12:30:00Z',
  preferences: {
    theme: 'dark',
    notifications: true,
    language: 'en',
  },
};

export const mockUserMinimal: UserProfile = {
  id: 'user-test-002',
  email: 'minimal@example.com',
  fullName: null,
  displayName: null,
  avatarUrl: null,
  dateOfBirth: null,
  createdAt: '2026-02-01T00:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z',
  preferences: {
    theme: 'system',
    notifications: false,
    language: 'en',
  },
};

export const mockUsers: UserProfile[] = [
  mockUser,
  mockUserMinimal,
  {
    id: 'user-test-003',
    email: 'demo@example.com',
    fullName: 'Demo Account',
    displayName: 'DemoUser',
    avatarUrl: 'https://example.com/avatar.jpg',
    dateOfBirth: '1985-12-25',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-20T16:45:00Z',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en',
    },
  },
];

// ============================================
// Chapter Fixtures
// ============================================

export const mockChapter1: Chapter = {
  id: 'chapter-001',
  bookId: 'book-1',
  number: 1,
  title: 'The Awakening',
  subtitle: 'First Steps into Somatic Awareness',
  content: `
# Chapter 1: The Awakening

The body remembers what the mind forgets. In the space between breath and being, 
we discover the first whispers of somatic intelligence.

## The Threshold

Every journey begins with a single breath. Notice the rise and fall of your chest, 
the subtle dance of diaphragm and ribcage. This is the language of the body—
silent, persistent, waiting to be heard.

## Practice: Grounding

1. Feel your feet against the earth
2. Notice the weight of your body
3. Breathe into the spaces that call for attention
  `,
  excerpt: 'The body remembers what the mind forgets. In the space between breath and being...',
  wordCount: 1250,
  estimatedReadTime: 6,
  tags: ['awareness', 'grounding', 'introduction'],
  unlockRequirements: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

export const mockChapter2: Chapter = {
  id: 'chapter-002',
  bookId: 'book-1',
  number: 2,
  title: 'The Breath as Bridge',
  subtitle: 'Connecting Consciousness and Form',
  content: `
# Chapter 2: The Breath as Bridge

Breath is the thread that weaves spirit into matter. Each inhale draws life force; 
each exhale releases what no longer serves.

## The Rhythm of Being

There is a cadence to existence—a pulse that predates thought. To find it is to 
remember something ancient, something true.
  `,
  excerpt: 'Breath is the thread that weaves spirit into matter...',
  wordCount: 980,
  estimatedReadTime: 5,
  tags: ['breathwork', 'embodiment', 'practice'],
  unlockRequirements: {
    chapterId: 'chapter-001',
    completionPercentage: 100,
  },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

export const mockChapterLocked: Chapter = {
  id: 'chapter-003',
  bookId: 'book-1',
  number: 3,
  title: 'Hidden Depths',
  subtitle: 'Advanced Somatic Practices',
  content: '',
  excerpt: 'This chapter remains locked until previous chapters are completed...',
  wordCount: 0,
  estimatedReadTime: 0,
  tags: ['advanced', 'mystery'],
  unlockRequirements: {
    chapterId: 'chapter-002',
    completionPercentage: 75,
  },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

export const mockChapters: Chapter[] = [
  mockChapter1,
  mockChapter2,
  mockChapterLocked,
];

// ============================================
// Chapter Progress Fixtures
// ============================================

export const mockChapterProgress1: ChapterProgress = {
  id: 'progress-001',
  userId: 'user-test-001',
  chapterId: 'chapter-001',
  completionPercentage: 100,
  lastPosition: 1250,
  isCompleted: true,
  completedAt: '2026-01-15T10:30:00Z',
  bookmarks: [
    {
      position: 450,
      note: 'Important insight about grounding',
      createdAt: '2026-01-15T09:15:00Z',
    },
  ],
  highlights: [
    {
      startPosition: 200,
      endPosition: 280,
      text: 'The body remembers what the mind forgets',
      color: 'yellow',
      createdAt: '2026-01-15T09:10:00Z',
    },
  ],
  updatedAt: '2026-01-15T10:30:00Z',
};

export const mockChapterProgress2: ChapterProgress = {
  id: 'progress-002',
  userId: 'user-test-001',
  chapterId: 'chapter-002',
  completionPercentage: 45,
  lastPosition: 441,
  isCompleted: false,
  completedAt: null,
  bookmarks: [],
  highlights: [],
  updatedAt: '2026-01-20T14:20:00Z',
};

export const mockChapterProgressNew: ChapterProgress = {
  id: 'progress-003',
  userId: 'user-test-001',
  chapterId: 'chapter-003',
  completionPercentage: 0,
  lastPosition: 0,
  isCompleted: false,
  completedAt: null,
  bookmarks: [],
  highlights: [],
  updatedAt: '2026-01-20T14:20:00Z',
};

export const mockChapterProgressList: ChapterProgress[] = [
  mockChapterProgress1,
  mockChapterProgress2,
  mockChapterProgressNew,
];

// ============================================
// Biorhythm Fixtures
// ============================================

export const mockBiorhythmReading: BiorhythmReading = {
  id: 'bio-001',
  userId: 'user-test-001',
  calculatedAt: '2026-02-04T00:00:00Z',
  cycles: {
    physical: {
      value: 0.85,
      phase: 'positive',
      daysUntilPeak: 2,
      daysUntilLow: 13,
    },
    emotional: {
      value: -0.32,
      phase: 'negative',
      daysUntilPeak: 8,
      daysUntilLow: 4,
    },
    intellectual: {
      value: 0.67,
      phase: 'positive',
      daysUntilPeak: 4,
      daysUntilLow: 11,
    },
    spiritual: {
      value: 0.12,
      phase: 'transition',
      daysUntilPeak: 6,
      daysUntilLow: 9,
    },
  },
  overall: {
    score: 58,
    interpretation: 'Physical energy is high. Emotional sensitivity calls for gentleness.',
    recommendedPractice: 'Grounding movement with mindful breath awareness',
  },
};

export const mockBiorhythmReadingLow: BiorhythmReading = {
  id: 'bio-002',
  userId: 'user-test-001',
  calculatedAt: '2026-02-04T00:00:00Z',
  cycles: {
    physical: {
      value: -0.78,
      phase: 'negative',
      daysUntilPeak: 12,
      daysUntilLow: 3,
    },
    emotional: {
      value: -0.65,
      phase: 'negative',
      daysUntilPeak: 10,
      daysUntilLow: 5,
    },
    intellectual: {
      value: -0.45,
      phase: 'negative',
      daysUntilPeak: 9,
      daysUntilLow: 6,
    },
    spiritual: {
      value: 0.05,
      phase: 'transition',
      daysUntilPeak: 7,
      daysUntilLow: 8,
    },
  },
  overall: {
    score: 28,
    interpretation: 'A day for rest and integration. All cycles are in low phase.',
    recommendedPractice: 'Gentle restorative poses and extended savasana',
  },
};

// ============================================
// Auth Fixtures
// ============================================

export const mockSession = {
  access_token: 'mock_access_token_xyz123',
  refresh_token: 'mock_refresh_token_abc789',
  expires_at: Date.now() + 3600 * 1000,
  user: {
    id: mockUser.id,
    email: mockUser.email,
    user_metadata: {
      full_name: mockUser.fullName,
    },
  },
};

export const mockAuthError = {
  message: 'Invalid login credentials',
  status: 400,
};

// ============================================
// API Response Fixtures
// ============================================

export const mockApiSuccess = <T>(data: T) => ({
  success: true,
  data,
  error: null,
  meta: {
    timestamp: new Date().toISOString(),
    requestId: `req-${Date.now()}`,
  },
});

export const mockApiError = (message: string, code: string = 'ERROR') => ({
  success: false,
  data: null,
  error: {
    message,
    code,
  },
  meta: {
    timestamp: new Date().toISOString(),
    requestId: `req-${Date.now()}`,
  },
});

// ============================================
// Factory Functions for Dynamic Data
// ============================================

export function createMockUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    ...mockUser,
    id: `user-test-${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    ...overrides,
  };
}

export function createMockChapter(overrides: Partial<Chapter> = {}): Chapter {
  const chapterNumber = overrides.number || 1;
  return {
    ...mockChapter1,
    id: `chapter-${String(chapterNumber).padStart(3, '0')}`,
    number: chapterNumber,
    title: `Chapter ${chapterNumber}`,
    ...overrides,
  };
}

export function createMockProgress(
  userId: string = mockUser.id,
  chapterId: string = mockChapter1.id,
  overrides: Partial<ChapterProgress> = {}
): ChapterProgress {
  return {
    ...mockChapterProgress1,
    id: `progress-${Date.now()}`,
    userId,
    chapterId,
    ...overrides,
  };
}

export function createMockBiorhythm(
  userId: string = mockUser.id,
  overrides: Partial<BiorhythmReading> = {}
): BiorhythmReading {
  return {
    ...mockBiorhythmReading,
    id: `bio-${Date.now()}`,
    userId,
    calculatedAt: new Date().toISOString(),
    ...overrides,
  };
}
