/**
 * SankalpaLogger.ts
 * 
 * Intention tracking and reflection system for the Kalachakra Dashboard build.
 * 
 * Sankalpa (संकल्प) = Intention, resolution, will directed toward a goal
 * Vikara (विकार) = Drift, distortion, change from true nature
 * 
 * This system:
 * 1. Logs sankalpa (intention) before each task
 * 2. Logs reflection after completion
 * 3. Recognizes patterns over time
 * 4. Integrates with Noesis vikara (drift detection)
 */

import {
  KalachakraTask,
  Vayu,
  getTaskById
} from './DashboardTasks';

import { JourneyTracker } from './JourneyTracker';
import { DailyDraw, TarotGuide } from './TarotGuide';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Sankalpa {
  id: string;
  taskId: string;
  timestamp: Date;
  intention: string;
  vayuAtStart: Vayu;
  khaloreeAtStart: number; // 0-100
  estimatedDuration: number; // minutes
  tarotCardDrawn?: string;
  focusQuality: 'scattered' | 'moderate' | 'focused' | 'deep';
  distractions: string[];
  supportingConditions: string[];
  obstaclesAnticipated: string[];
}

export interface TaskReflection {
  id: string;
  sankalpaId: string;
  taskId: string;
  timestamp: Date;
  completed: boolean;
  actualDuration: number; // minutes
  vayuAtEnd: Vayu;
  khaloreeAtEnd: number;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  flowExperienced: boolean;
  interruptions: number;
  learnings: string[];
  wouldDoDifferently: string[];
  energyChange: 'depleted' | 'same' | 'energized';
  vikaraDetected?: VikaraSnapshot;
}

export interface VikaraSnapshot {
  timestamp: Date;
  type: 'distraction' | 'perfectionism' | 'confusion' | 'resistance' | 'fatigue' | 'doubt' | 'other';
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  trigger?: string;
  recoveryStrategy: string;
  recovered: boolean;
  recoveryDuration?: number; // minutes
}

export interface TaskSession {
  id: string;
  taskId: string;
  sankalpa: Sankalpa;
  reflection?: TaskReflection;
  vikaraEvents: VikaraSnapshot[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'intended' | 'in_progress' | 'completed' | 'abandoned';
}

export interface SankalpaPattern {
  patternType: 'productive_hours' | 'optimal_vayu' | 'distraction_triggers' | 
               'flow_conditions' | 'energy_drain' | 'completion_predictors';
  description: string;
  confidence: number; // 0-1
  evidence: {
    sampleSize: number;
    supportingExamples: string[];
    contradictoryExamples: string[];
  };
  recommendation: string;
}

export interface DailySankalpaSummary {
  date: string;
  totalIntentions: number;
  completedIntentions: number;
  abandonedIntentions: number;
  averageQuality: number;
  flowStates: number;
  vikaraEvents: number;
  dominantVayu: Vayu;
  energyTrend: 'ascending' | 'stable' | 'descending';
  insights: string[];
}

export interface WeeklyReflection {
  weekStart: Date;
  weekEnd: Date;
  tasksAttempted: number;
  tasksCompleted: number;
  completionRate: number;
  averageQuality: number;
  patternsIdentified: SankalpaPattern[];
  vikaraSummary: Record<VikaraSnapshot['type'], number>;
  energyTrajectory: 'rising' | 'stable' | 'falling';
  lessons: string[];
  nextWeekFocus: string[];
}

// ============================================================================
// SANKALPA LOGGER CLASS
// ============================================================================

export class SankalpaLogger {
  private sessions: Map<string, TaskSession>;
  private sankalpas: Map<string, Sankalpa>;
  private reflections: Map<string, TaskReflection>;
  private vikaraLog: VikaraSnapshot[];
  private journeyTracker: JourneyTracker;
  private tarotGuide?: TarotGuide;

  constructor(journeyTracker: JourneyTracker, tarotGuide?: TarotGuide) {
    this.sessions = new Map();
    this.sankalpas = new Map();
    this.reflections = new Map();
    this.vikaraLog = [];
    this.journeyTracker = journeyTracker;
    this.tarotGuide = tarotGuide;
  }

  // -------------------------------------------------------------------------
  // SANKALPA CREATION
  // -------------------------------------------------------------------------

  createSankalpa(
    taskId: string,
    intention: string,
    options: {
      vayu?: Vayu;
      khaloree?: number;
      estimatedDuration?: number;
      focusQuality?: Sankalpa['focusQuality'];
      distractions?: string[];
      supportingConditions?: string[];
      obstaclesAnticipated?: string[];
    } = {}
  ): Sankalpa {
    const task = getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const today = new Date().toISOString().split('T')[0];
    const dailyDraw = this.tarotGuide?.getDrawHistory(1)[0];

    const sankalpa: Sankalpa = {
      id: `sank-${Date.now()}`,
      taskId,
      timestamp: new Date(),
      intention,
      vayuAtStart: options.vayu || task.noesis.optimalVayu,
      khaloreeAtStart: options.khaloree ?? 70,
      estimatedDuration: options.estimatedDuration || task.estimatedYuga * 60,
      tarotCardDrawn: dailyDraw?.card.name,
      focusQuality: options.focusQuality || 'focused',
      distractions: options.distractions || [],
      supportingConditions: options.supportingConditions || [],
      obstaclesAnticipated: options.obstaclesAnticipated || []
    };

    this.sankalpas.set(sankalpa.id, sankalpa);

    // Create session
    const session: TaskSession = {
      id: `sess-${Date.now()}`,
      taskId,
      sankalpa,
      vikaraEvents: [],
      startTime: new Date(),
      status: 'intended'
    };

    this.sessions.set(session.id, session);

    return sankalpa;
  }

  startSession(sankalpaId: string): TaskSession {
    const sankalpa = this.sankalpas.get(sankalpaId);
    if (!sankalpa) {
      throw new Error(`Sankalpa ${sankalpaId} not found`);
    }

    const session = Array.from(this.sessions.values())
      .find(s => s.sankalpa.id === sankalpaId);
    
    if (!session) {
      throw new Error(`Session for sankalpa ${sankalpaId} not found`);
    }

    session.status = 'in_progress';
    session.startTime = new Date();

    return session;
  }

  // -------------------------------------------------------------------------
  // VIKARA (DRIFT) DETECTION
  // -------------------------------------------------------------------------

  logVikara(
    sessionId: string,
    vikara: Omit<VikaraSnapshot, 'timestamp' | 'recovered' | 'recoveryDuration'>
  ): VikaraSnapshot {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const snapshot: VikaraSnapshot = {
      ...vikara,
      timestamp: new Date(),
      recovered: false
    };

    session.vikaraEvents.push(snapshot);
    this.vikaraLog.push(snapshot);

    // Alert if severe
    if (vikara.severity === 'severe') {
      console.warn(`⚠️ Severe vikara detected: ${vikara.type} - ${vikara.description}`);
    }

    return snapshot;
  }

  resolveVikara(
    vikaraTimestamp: Date,
    recoveryStrategy: string,
    recoveryDuration: number
  ): void {
    const vikara = this.vikaraLog.find(v => 
      v.timestamp.getTime() === vikaraTimestamp.getTime()
    );
    
    if (vikara) {
      vikara.recovered = true;
      vikara.recoveryDuration = recoveryDuration;
      vikara.recoveryStrategy = recoveryStrategy;
    }
  }

  getVikaraPattern(taskId?: string): Record<VikaraSnapshot['type'], number> {
    const vikaras = taskId 
      ? this.vikaraLog.filter(v => {
          const session = Array.from(this.sessions.values())
            .find(s => s.vikaraEvents.includes(v));
          return session?.taskId === taskId;
        })
      : this.vikaraLog;

    const pattern: Record<VikaraSnapshot['type'], number> = {
      distraction: 0,
      perfectionism: 0,
      confusion: 0,
      resistance: 0,
      fatigue: 0,
      doubt: 0,
      other: 0
    };

    for (const v of vikaras) {
      pattern[v.type]++;
    }

    return pattern;
  }

  // -------------------------------------------------------------------------
  // REFLECTION LOGGING
  // -------------------------------------------------------------------------

  completeSession(
    sessionId: string,
    reflection: Omit<TaskReflection, 'id' | 'sankalpaId' | 'taskId' | 'timestamp'>
  ): TaskReflection {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - session.startTime.getTime()) / 60000);

    const fullReflection: TaskReflection = {
      id: `refl-${Date.now()}`,
      sankalpaId: session.sankalpa.id,
      taskId: session.taskId,
      timestamp: endTime,
      ...reflection
    };

    this.reflections.set(fullReflection.id, fullReflection);

    session.reflection = fullReflection;
    session.endTime = endTime;
    session.duration = duration;
    session.status = reflection.completed ? 'completed' : 'abandoned';

    // Update journey tracker
    if (reflection.completed) {
      this.journeyTracker.updateTaskStatus(session.taskId, 'completed');
    }

    return fullReflection;
  }

  // -------------------------------------------------------------------------
  // PATTERN RECOGNITION
  // -------------------------------------------------------------------------

  analyzePatterns(): SankalpaPattern[] {
    const patterns: SankalpaPattern[] = [];
    const sessions = Array.from(this.sessions.values());
    const completedSessions = sessions.filter(s => s.reflection?.completed);

    if (completedSessions.length < 3) {
      return []; // Need more data
    }

    // Pattern 1: Productive Hours
    const hourSuccess = new Map<number, { success: number; total: number }>();
    for (const s of completedSessions) {
      const hour = s.startTime.getHours();
      const current = hourSuccess.get(hour) || { success: 0, total: 0 };
      current.total++;
      if (s.reflection?.completed) current.success++;
      hourSuccess.set(hour, current);
    }

    const bestHours = Array.from(hourSuccess.entries())
      .filter(([, data]) => data.total >= 2)
      .sort((a, b) => (b[1].success / b[1].total) - (a[1].success / a[1].total))
      .slice(0, 3)
      .map(([hour]) => hour);

    if (bestHours.length > 0) {
      patterns.push({
        patternType: 'productive_hours',
        description: `Peak productivity observed at ${bestHours.map(h => `${h}:00`).join(', ')}`,
        confidence: 0.7,
        evidence: {
          sampleSize: completedSessions.length,
          supportingExamples: bestHours.map(h => `Hour ${h}:00 shows high completion rate`),
          contradictoryExamples: []
        },
        recommendation: `Schedule important tasks during ${bestHours[0]}:00-${bestHours[0] + 2}:00 for optimal results.`
      });
    }

    // Pattern 2: Optimal Vayu
    const vayuSuccess = new Map<Vayu, { success: number; total: number }>();
    for (const s of completedSessions) {
      const vayu = s.sankalpa.vayuAtStart;
      const current = vayuSuccess.get(vayu) || { success: 0, total: 0 };
      current.total++;
      if (s.reflection?.completed && s.reflection.qualityRating >= 4) {
        current.success++;
      }
      vayuSuccess.set(vayu, current);
    }

    const bestVayu = Array.from(vayuSuccess.entries())
      .filter(([, data]) => data.total >= 2)
      .sort((a, b) => (b[1].success / b[1].total) - (a[1].success / a[1].total))[0];

    if (bestVayu) {
      patterns.push({
        patternType: 'optimal_vayu',
        description: `${bestVayu[0]} vayu produces highest quality work`,
        confidence: bestVayu[1].success / bestVayu[1].total,
        evidence: {
          sampleSize: bestVayu[1].total,
          supportingExamples: [`${bestVayu[1].success}/${bestVayu[1].total} high-quality sessions in ${bestVayu[0]} vayu`],
          contradictoryExamples: []
        },
        recommendation: `Enter ${bestVayu[0]} state before demanding tasks. Use associated practices.`
      });
    }

    // Pattern 3: Flow Conditions
    const flowSessions = completedSessions.filter(s => s.reflection?.flowExperienced);
    if (flowSessions.length >= 3) {
      const commonConditions = this.findCommonElements(
        flowSessions.map(s => s.sankalpa.supportingConditions)
      );

      patterns.push({
        patternType: 'flow_conditions',
        description: `Flow states occur with: ${commonConditions.join(', ')}`,
        confidence: flowSessions.length / completedSessions.length,
        evidence: {
          sampleSize: flowSessions.length,
          supportingExamples: flowSessions.map(s => 
            `Flow on ${s.startTime.toDateString()} with ${s.sankalpa.supportingConditions.join(', ')}`
          ),
          contradictoryExamples: []
        },
        recommendation: `Recreate these conditions when seeking flow: ${commonConditions.slice(0, 3).join(', ')}`
      });
    }

    // Pattern 4: Distraction Triggers
    const vikaraPattern = this.getVikaraPattern();
    const topVikara = Object.entries(vikaraPattern)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topVikara && topVikara[1] >= 3) {
      patterns.push({
        patternType: 'distraction_triggers',
        description: `${topVikara[0]} is the primary drift pattern (${topVikara[1]} occurrences)`,
        confidence: Math.min(0.9, topVikara[1] / 10),
        evidence: {
          sampleSize: Object.values(vikaraPattern).reduce((a, b) => a + b, 0),
          supportingExamples: this.vikaraLog
            .filter(v => v.type === topVikara[0])
            .map(v => v.description)
            .slice(0, 3),
          contradictoryExamples: []
        },
        recommendation: `Watch for ${topVikara[0]} signals. Use early intervention: ${this.getVikaraIntervention(topVikara[0] as VikaraSnapshot['type'])}`
      });
    }

    // Pattern 5: Completion Predictors
    const highQualitySessions = completedSessions.filter(s => 
      s.reflection?.qualityRating >= 4
    );
    
    if (highQualitySessions.length >= 3) {
      const avgKhaloree = highQualitySessions.reduce((sum, s) => 
        sum + s.sankalpa.khaloreeAtStart, 0
      ) / highQualitySessions.length;

      patterns.push({
        patternType: 'completion_predictors',
        description: `High-quality work correlates with ${avgKhaloree.toFixed(0)}+ Khalorēē`,
        confidence: 0.75,
        evidence: {
          sampleSize: highQualitySessions.length,
          supportingExamples: highQualitySessions.map(s => 
            `Quality ${s.reflection?.qualityRating} at Khalorēē ${s.sankalpa.khaloreeAtStart}`
          ),
          contradictoryExamples: []
        },
        recommendation: `Ensure Khalorēē level is ${Math.round(avgKhaloree - 10)}+ before starting important tasks.`
      });
    }

    return patterns;
  }

  private findCommonElements(arrays: string[][]): string[] {
    const frequency = new Map<string, number>();
    
    for (const arr of arrays) {
      const seen = new Set<string>();
      for (const item of arr) {
        if (!seen.has(item)) {
          seen.add(item);
          frequency.set(item, (frequency.get(item) || 0) + 1);
        }
      }
    }

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .filter(([, count]) => count >= 2)
      .map(([item]) => item);
  }

  private getVikaraInterruption(type: VikaraSnapshot['type']): string {
    const interventions: Record<VikaraSnapshot['type'], string> = {
      distraction: '5-minute focused breathing, close all non-essential tabs',
      perfectionism: 'Set timer for "good enough", ship when it rings',
      confusion: 'Write down specific question, take 10min walk, return',
      resistance: '5-minute "just start" commitment, reassess after',
      fatigue: '20-minute nap or switch to low-energy task',
      doubt: 'Review past wins, talk to mentor/peer',
      other: 'Pause, breathe, identify what you need'
    };
    return interventions[type];
  }

  // -------------------------------------------------------------------------
  // SUMMARIES
  // -------------------------------------------------------------------------

  getDailySummary(date: Date = new Date()): DailySankalpaSummary {
    const dateKey = date.toISOString().split('T')[0];
    const daySessions = Array.from(this.sessions.values()).filter(s =>
      s.startTime.toISOString().startsWith(dateKey)
    );

    const completed = daySessions.filter(s => s.reflection?.completed);
    const abandoned = daySessions.filter(s => s.status === 'abandoned');
    
    const vayuCount = new Map<Vayu, number>();
    for (const s of daySessions) {
      vayuCount.set(s.sankalpa.vayuAtStart, (vayuCount.get(s.sankalpa.vayuAtStart) || 0) + 1);
    }
    const dominantVayu = Array.from(vayuCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'prana';

    const avgQuality = completed.length > 0 
      ? completed.reduce((sum, s) => sum + (s.reflection?.qualityRating || 3), 0) / completed.length
      : 0;

    const vikaraCount = daySessions.reduce((sum, s) => sum + s.vikaraEvents.length, 0);

    const flowCount = completed.filter(s => s.reflection?.flowExperienced).length;

    // Generate insights
    const insights: string[] = [];
    if (completed.length > abandoned.length) {
      insights.push('Completion momentum is strong today.');
    } else if (abandoned.length > 0) {
      insights.push('Consider shorter sankalpas or higher Khalorēē thresholds.');
    }
    
    if (flowCount >= 2) {
      insights.push('Multiple flow states - optimal conditions identified.');
    }

    if (vikaraCount > 3) {
      insights.push('High drift detected - rest and recalibration advised.');
    }

    return {
      date: dateKey,
      totalIntentions: daySessions.length,
      completedIntentions: completed.length,
      abandonedIntentions: abandoned.length,
      averageQuality: avgQuality,
      flowStates: flowCount,
      vikaraEvents: vikaraCount,
      dominantVayu,
      energyTrend: this.calculateEnergyTrend(daySessions),
      insights
    };
  }

  private calculateEnergyTrend(sessions: TaskSession[]): 'ascending' | 'stable' | 'descending' {
    if (sessions.length < 2) return 'stable';

    const sorted = [...sessions].sort((a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    const startEnergy = sorted[0].sankalpa.khaloreeAtStart;
    const endEnergy = sorted[sorted.length - 1].reflection?.khaloreeAtEnd || startEnergy;

    const change = endEnergy - startEnergy;
    if (change > 15) return 'ascending';
    if (change < -15) return 'descending';
    return 'stable';
  }

  getWeeklyReflection(weekStart: Date): WeeklyReflection {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekSessions = Array.from(this.sessions.values()).filter(s =>
      s.startTime >= weekStart && s.startTime < weekEnd
    );

    const completed = weekSessions.filter(s => s.reflection?.completed);
    const patterns = this.analyzePatterns();
    const vikaraSummary = this.getVikaraPattern();

    const avgQuality = completed.length > 0
      ? completed.reduce((sum, s) => sum + (s.reflection?.qualityRating || 3), 0) / completed.length
      : 0;

    // Lessons learned
    const lessons: string[] = [];
    for (const s of weekSessions) {
      if (s.reflection?.learnings) {
        lessons.push(...s.reflection.learnings);
      }
    }

    // Next week focus
    const nextWeekFocus: string[] = [];
    if (patterns.length > 0) {
      nextWeekFocus.push(...patterns.slice(0, 2).map(p => p.recommendation));
    }

    // Energy trajectory
    const dailySummaries = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      dailySummaries.push(this.getDailySummary(day));
    }

    const ascendingDays = dailySummaries.filter(d => d.energyTrend === 'ascending').length;
    const descendingDays = dailySummaries.filter(d => d.energyTrend === 'descending').length;

    let energyTrajectory: WeeklyReflection['energyTrajectory'] = 'stable';
    if (ascendingDays > descendingDays + 1) energyTrajectory = 'rising';
    if (descendingDays > ascendingDays + 1) energyTrajectory = 'falling';

    return {
      weekStart,
      weekEnd,
      tasksAttempted: weekSessions.length,
      tasksCompleted: completed.length,
      completionRate: weekSessions.length > 0 ? completed.length / weekSessions.length : 0,
      averageQuality: avgQuality,
      patternsIdentified: patterns,
      vikaraSummary,
      energyTrajectory,
      lessons: [...new Set(lessons)].slice(0, 5),
      nextWeekFocus
    };
  }

  // -------------------------------------------------------------------------
  // NOESIS INTEGRATION
  // -------------------------------------------------------------------------

  /**
   * Export data for Noesis vikara detection engine
   */
  exportForNoesis(): {
    vikaraLog: VikaraSnapshot[];
    patterns: SankalpaPattern[];
    sessionCount: number;
    completionRate: number;
    driftScore: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const completed = sessions.filter(s => s.reflection?.completed);
    
    // Calculate drift score (0-100, higher = more drift)
    const totalVikara = this.vikaraLog.length;
    const severeVikara = this.vikaraLog.filter(v => v.severity === 'severe').length;
    const unrecoveredVikara = this.vikaraLog.filter(v => !v.recovered).length;
    
    const driftScore = Math.min(100, 
      (totalVikara * 5) + 
      (severeVikara * 15) + 
      (unrecoveredVikara * 20)
    );

    return {
      vikaraLog: this.vikaraLog,
      patterns: this.analyzePatterns(),
      sessionCount: sessions.length,
      completionRate: sessions.length > 0 ? completed.length / sessions.length : 0,
      driftScore
    };
  }

  /**
   * Import vikara alerts from Noesis system
   */
  importNoesisAlert(alert: {
    type: VikaraSnapshot['type'];
    severity: VikaraSnapshot['severity'];
    description: string;
    recommendedAction: string;
  }): void {
    // Create system-level vikara entry
    const systemVikara: VikaraSnapshot = {
      timestamp: new Date(),
      type: alert.type,
      severity: alert.severity,
      description: `[Noesis] ${alert.description}`,
      recoveryStrategy: alert.recommendedAction,
      recovered: false
    };

    this.vikaraLog.push(systemVikara);

    console.warn(`🌀 Noesis Vikara Alert: ${alert.description}`);
    console.log(`   Recommended: ${alert.recommendedAction}`);
  }

  // -------------------------------------------------------------------------
  // EXPORT/IMPORT
  // -------------------------------------------------------------------------

  exportAll(): string {
    return JSON.stringify({
      sankalpas: Array.from(this.sankalpas.values()),
      reflections: Array.from(this.reflections.values()),
      sessions: Array.from(this.sessions.values()).map(s => ({
        ...s,
        sankalpa: s.sankalpa.id,
        reflection: s.reflection?.id
      })),
      vikaraLog: this.vikaraLog
    }, null, 2);
  }

  importAll(json: string): void {
    const data = JSON.parse(json);
    
    this.sankalpas = new Map(data.sankalpas.map((s: Sankalpa) => [s.id, s]));
    this.reflections = new Map(data.reflections.map((r: TaskReflection) => [r.id, r]));
    this.vikaraLog = data.vikaraLog;
    
    // Reconstruct sessions
    this.sessions = new Map();
    for (const s of data.sessions) {
      const session: TaskSession = {
        ...s,
        sankalpa: this.sankalpas.get(s.sankalpa)!,
        reflection: s.reflection ? this.reflections.get(s.reflection) : undefined,
        vikaraEvents: []
      };
      this.sessions.set(s.id, session);
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getQualityEmoji(rating: number): string {
  const emojis = ['💀', '😞', '😐', '🙂', '✨'];
  return emojis[rating - 1] || '😐';
}

export function getVikaraEmoji(type: VikaraSnapshot['type']): string {
  const emojis: Record<VikaraSnapshot['type'], string> = {
    distraction: '📱',
    perfectionism: '💎',
    confusion: '🌫️',
    resistance: '🛑',
    fatigue: '🔋',
    doubt: '❓',
    other: '⚠️'
  };
  return emojis[type];
}

export function getVayuEmoji(vayu: Vayu): string {
  const emojis: Record<Vayu, string> = {
    prana: '👃',
    apana: '⬇️',
    samana: '⚖️',
    udana: '⬆️',
    vyana: '🌐',
    kurma: '👁️',
    krkara: '🍽️',
    devadatta: '🥱',
    dhananjaya: '💝',
    naga: '🐍',
    kumar: '👶',
    mukhya: '👑'
  };
  return emojis[vayu];
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let sankalpaLoggerInstance: SankalpaLogger | null = null;

export function initializeSankalpaLogger(
  journeyTracker: JourneyTracker,
  tarotGuide?: TarotGuide
): SankalpaLogger {
  sankalpaLoggerInstance = new SankalpaLogger(journeyTracker, tarotGuide);
  return sankalpaLoggerInstance;
}

export function getSankalpaLogger(): SankalpaLogger {
  if (!sankalpaLoggerInstance) {
    throw new Error('SankalpaLogger not initialized. Call initializeSankalpaLogger first.');
  }
  return sankalpaLoggerInstance;
}

export default SankalpaLogger;
