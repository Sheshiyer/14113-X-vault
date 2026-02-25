/**
 * Hooks Index
 *
 * Central export point for all custom React hooks.
 */

// Biorhythm hook
export { useBiorhythm } from "./useBiorhythm";
export type {
  UseBiorhythmOptions,
  UseBiorhythmReturn,
} from "./useBiorhythm";

// Chapters hook
export { useChapters } from "./useChapters";
export type {
  UseChaptersOptions,
  UseChaptersReturn,
} from "./useChapters";

// Progress hook
export { useProgress } from "./useProgress";
export type {
  UseProgressOptions,
  UseProgressReturn,
} from "./useProgress";

// Unlock hook
export { useUnlock } from "./useUnlock";
export type {
  UseUnlockOptions,
  UseUnlockReturn,
  UnlockCheckResult,
} from "./useUnlock";

// Auth hook
export { useAuth, useRequireAuth, getServerSession } from "./useAuth";
export type {
  LoginCredentials,
  RegisterData,
  AuthError,
  UseAuthReturn,
} from "./useAuth";
