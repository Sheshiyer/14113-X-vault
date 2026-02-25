/**
 * Kalachakra Task Journey Mapper
 * 
 * Central export module for all journey tracking systems.
 * 
 * Usage:
 * ```typescript
 * import { 
 *   DashboardTasks, 
 *   JourneyTracker, 
 *   TarotGuide, 
 *   SankalpaLogger 
 * } from './tasks';
 * 
 * // Initialize
 * const tracker = new JourneyTracker();
 * const tarot = initializeTarotGuide(tracker, 'prana');
 * const logger = initializeSankalpaLogger(tracker, tarot);
 * 
 * // Daily workflow
 * const dailyCard = tarot.drawDaily();
 * const sankalpa = logger.createSankalpa('ANN-001', 'Complete design tokens');
 * logger.startSession(sankalpa.id);
 * 
 * // During work
 * logger.logVikara(sessionId, {
 *   type: 'distraction',
 *   severity: 'moderate',
 *   description: 'Slack notifications'
 * });
 * 
 * // Complete
 * logger.completeSession(sessionId, {
 *   completed: true,
 *   qualityRating: 5,
 *   flowExperienced: true,
 *   // ...
 * });
 * ```
 */

// ============================================================================
// EXPORTS FROM DashboardTasks.ts
// ============================================================================

export {
  DASHBOARD_TASKS,
  TOTAL_TASKS,
  TASKS_PER_PHASE,
  TASKS_PER_KOSHA,
  getTasksByPhase,
  getTasksByKosha,
  getTasksByAgent,
  getTaskById,
  getDependencies,
  getDependentTasks,
  getAvailableTasks,
  getTotalEstimatedYuga,
  getPhaseName
} from './DashboardTasks';

export type {
  HeroPhase,
  Kosha,
  Vayu,
  MicroJourney,
  NoesisIntegration,
  TaskDependency,
  TarotMapping,
  KalachakraTask
} from './DashboardTasks';

// ============================================================================
// EXPORTS FROM JourneyTracker.ts
// ============================================================================

export {
  JourneyTracker,
  JOURNEY_MILESTONES,
  journeyTracker,
  formatPercentage,
  formatYuga,
  getPhaseColor,
  getKoshaColor
} from './JourneyTracker';

export type {
  PhaseProgress,
  KoshaProgress,
  Milestone,
  JourneySnapshot,
  RetroactiveEntry
} from './JourneyTracker';

// ============================================================================
// EXPORTS FROM TarotGuide.ts
// ============================================================================

export {
  TarotGuide,
  TAROT_DECK,
  initializeTarotGuide,
  getTarotGuide,
  getElementColor,
  getSuitIcon
} from './TarotGuide';

export type {
  TarotCard,
  DailyDraw,
  CardInterpretation,
  TaskRecommendation,
  SpreadPosition,
  DailySpread,
  SpreadType
} from './TarotGuide';

// ============================================================================
// EXPORTS FROM SankalpaLogger.ts
// ============================================================================

export {
  SankalpaLogger,
  initializeSankalpaLogger,
  getSankalpaLogger,
  formatDuration,
  getQualityEmoji,
  getVikaraEmoji,
  getVayuEmoji
} from './SankalpaLogger';

export type {
  Sankalpa,
  TaskReflection,
  VikaraSnapshot,
  TaskSession,
  SankalpaPattern,
  DailySankalpaSummary,
  WeeklyReflection
} from './SankalpaLogger';

// ============================================================================
// INITIALIZATION HELPERS
// ============================================================================

import { JourneyTracker } from './JourneyTracker';
import { initializeTarotGuide } from './TarotGuide';
import { initializeSankalpaLogger } from './SankalpaLogger';

export interface KalachakraSystem {
  journey: JourneyTracker;
  tarot: ReturnType<typeof initializeTarotGuide>;
  logger: ReturnType<typeof initializeSankalpaLogger>;
}

/**
 * Initialize the complete Kalachakra task journey system
 */
export function initializeKalachakra(initialVayu?: import('./DashboardTasks').Vayu): KalachakraSystem {
  const journey = new JourneyTracker();
  const tarot = initializeTarotGuide(journey, initialVayu);
  const logger = initializeSankalpaLogger(journey, tarot);

  return { journey, tarot, logger };
}

// ============================================================================
// VERSION
// ============================================================================

export const KALACHAKRA_TASKS_VERSION = '1.0.0';
export const KALACHAKRA_TASKS_BUILD_DATE = '2026-02-16';
