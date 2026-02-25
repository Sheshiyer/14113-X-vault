/**
 * API Validation Schemas
 * 
 * Zod schemas for validating API request bodies and query parameters.
 */

import { z } from "zod";

// ============================================================================
// Biorhythm Validations
// ============================================================================

export const calculateBiorhythmSchema = z.object({
  birthDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  targetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const forecastBiorhythmSchema = z.object({
  birthDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  days: z.number().int().min(1).max(90).default(30),
});

// ============================================================================
// Chapter Validations
// ============================================================================

export const listChaptersQuerySchema = z.object({
  filter: z.enum(["all", "unlocked", "locked", "completed", "inProgress"]).optional().default("all"),
  sort: z.enum(["number", "title", "cycle"]).optional().default("number"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const updateChapterProgressSchema = z.object({
  progress: z.number().int().min(0).max(100),
  checkpointId: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export const unlockChapterSchema = z.object({
  birthDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  currentDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

// ============================================================================
// Progress Validations
// ============================================================================

export const updateProgressSchema = z.object({
  chapterId: z.string().min(1),
  progress: z.number().int().min(0).max(100),
  isCompleted: z.boolean().optional(),
  checkpointId: z.string().optional(),
  checkpointCompleted: z.boolean().optional(),
});

// ============================================================================
// User Profile Validations
// ============================================================================

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  birthDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  timezone: z.string().min(1).max(100).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CalculateBiorhythmInput = z.infer<typeof calculateBiorhythmSchema>;
export type ForecastBiorhythmInput = z.infer<typeof forecastBiorhythmSchema>;
export type ListChaptersQueryInput = z.infer<typeof listChaptersQuerySchema>;
export type UpdateChapterProgressInput = z.infer<typeof updateChapterProgressSchema>;
export type UnlockChapterInput = z.infer<typeof unlockChapterSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
