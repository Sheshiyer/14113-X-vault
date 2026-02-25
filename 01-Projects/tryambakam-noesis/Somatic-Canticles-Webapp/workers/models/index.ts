/**
 * Model Index
 * Exports all database models for easy importing
 */

export { UserModel } from './User';
export type { User, CreateUserInput, UpdateUserInput } from './User';

export { ChapterModel } from './Chapter';
export type {
  Chapter,
  UnlockTrigger,
  CreateChapterInput,
} from './Chapter';

export { UserProgressModel } from './UserProgress';
export type {
  UserProgress,
  CreateProgressInput,
  UpdateProgressInput,
} from './UserProgress';

export { BiorhythmSnapshotModel } from './BiorhythmSnapshot';
export type {
  BiorhythmSnapshot,
  CreateSnapshotInput,
} from './BiorhythmSnapshot';

export { StreakModel } from './Streak';
export type { Streak, StreakType, CreateStreakInput } from './Streak';

export { AchievementModel } from './Achievement';
export type {
  Achievement,
  AchievementType,
  CreateAchievementInput,
} from './Achievement';
