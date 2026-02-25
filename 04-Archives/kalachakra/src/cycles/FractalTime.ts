/**
 * FractalTime - Cyclical Time Models
 * Nested cycles: Session ⊂ Day ⊂ Week ⊂ Moon ⊂ Quarter
 * Four Yugas within each coding session
 */

import { 
  Yuga, 
  YugaState, 
  HeroPhaseNumber, 
  NestedCycles, 
  CycleLevel,
  FractalCycle,
  Kosha
} from '../types/index.js';

// ============================================================================
// THE FOUR YUGAS
// ============================================================================

export const YUGAS: Record<Yuga, YugaState> = {
  krita: {
    name: 'krita',
    sanskritName: 'कृतयुग (Kṛtayuga)',
    color: '#FFD700', // Golden
    duration: { min: 90, max: 120 },
    characteristics: [
      'Full absorption - the flow state',
      'Time dissolves',
      'Output is effortless',
      'High creativity',
      'Deep focus',
      'Mental clarity'
    ],
    tarotCards: [17, 19], // Star, Sun
    kosha: 'anandamaya',
    exitSignals: [
      'First distraction noticed',
      'Mental fatigue beginning',
      'Checking clock more often',
      'Slight frustration emerging'
    ],
    resetActions: [
      'Continue while it lasts',
      'Stay in the flow',
      'Defer all interruptions'
    ]
  },
  treta: {
    name: 'treta',
    sanskritName: 'त्रेतायुग (Tretāyuga)',
    color: '#C0C0C0', // Silver
    duration: { min: 60, max: 90 },
    characteristics: [
      'Solid progress',
      'Some friction present',
      'Steady commits',
      'Problems are solvable',
      'Good energy maintained'
    ],
    tarotCards: [7, 8], // Chariot, Strength
    kosha: 'pranamaya',
    exitSignals: [
      'Bug density increasing',
      'Solving taking longer',
      'Energy noticeably lower',
      'Minor confusion'
    ],
    resetActions: [
      'Short walk',
      'Breathing exercises',
      'Water and snack'
    ]
  },
  dvapara: {
    name: 'dvapara',
    sanskritName: 'द्वापरयुग (Dvāparayuga)',
    color: '#CD7F32', // Bronze
    duration: { min: 30, max: 60 },
    characteristics: [
      'Forcing, struggling',
      'Bugs multiply',
      'Frustration emerges',
      'Slower progress',
      'Cognitive load high'
    ],
    tarotCards: [15, 16], // Devil, Tower
    kosha: 'manomaya',
    exitSignals: [
      'Same bug recurring',
      'Breaking things without fixing',
      'Exhaustion obvious',
      'Confusion dominant'
    ],
    resetActions: [
      'Stop immediately',
      'Take a real break',
      'Change environment',
      'Physical movement'
    ]
  },
  kali: {
    name: 'kali',
    sanskritName: 'कलियुग (Kaliyuga)',
    color: '#2F4F4F', // Dark slate
    duration: { min: 0, max: 0 }, // Stop immediately
    characteristics: [
      'Negative returns',
      'Breaking things',
      'Confusion',
      'Exhaustion',
      'No progress possible'
    ],
    tarotCards: [12, 13], // Hanged Man, Death
    kosha: 'annamaya',
    exitSignals: [
      'Making things worse',
      'Can\'t think clearly',
      'Physical discomfort',
      'Mental fog'
    ],
    resetActions: [
      'STOP WORKING NOW',
      'Rest deeply',
      'Sleep if possible',
      'Reset tomorrow',
      'Pranayama',
      'Meditation'
    ]
  }
};

// Yuga progression order
export const YUGA_ORDER: Yuga[] = ['krita', 'treta', 'dvapara', 'kali'];

// ============================================================================
// FRACTAL TIME CLASS
// ============================================================================

export class FractalTime {
  private sessionStartTime: Date | null = null;
  private yugaTransitions: Map<Yuga, Date> = new Map();

  /**
   * Start a new coding session
   */
  startSession(): void {
    this.sessionStartTime = new Date();
    this.yugaTransitions.clear();
    this.yugaTransitions.set('krita', new Date());
  }

  /**
   * Get current Yuga based on session duration
   */
  getCurrentYuga(sessionDurationMinutes?: number): YugaState {
    const duration = sessionDurationMinutes ?? this.getSessionDuration();
    
    if (duration < 90) {
      return YUGAS.krita;
    } else if (duration < 150) { // 90 + 60
      return YUGAS.treta;
    } else if (duration < 210) { // 150 + 60
      return YUGAS.dvapara;
    } else {
      return YUGAS.kali;
    }
  }

  /**
   * Calculate progress within current Yuga (0-1)
   */
  getYugaProgress(sessionDurationMinutes?: number): number {
    const duration = sessionDurationMinutes ?? this.getSessionDuration();
    
    if (duration < 90) {
      return duration / 90;
    } else if (duration < 150) {
      return (duration - 90) / 60;
    } else if (duration < 210) {
      return (duration - 150) / 60;
    } else {
      return Math.min(1, (duration - 210) / 30);
    }
  }

  /**
   * Get session duration in minutes
   */
  getSessionDuration(): number {
    if (!this.sessionStartTime) return 0;
    return (Date.now() - this.sessionStartTime.getTime()) / (1000 * 60);
  }

  /**
   * Get all nested fractal cycles for current moment
   */
  getNestedCycles(
    projectTotalTasks: number = 100,
    projectCompletedTasks: number = 0,
    projectStartDate?: Date
  ): NestedCycles {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    
    // Calculate session yuga
    const sessionDuration = this.getSessionDuration();
    const currentYuga = this.getCurrentYuga(sessionDuration).name;
    const yugaProgress = this.getYugaProgress(sessionDuration);
    
    // Map hour to hero phase (micro journey within day)
    // 12 hours of active work maps to 12 hero phases
    const hourPhase = this.hourToHeroPhase(hour);
    
    // Day progress (0-1)
    const dayProgress = (hour * 60 + now.getMinutes()) / (24 * 60);
    
    // Week progress (0-1) - Monday = start
    const weekProgress = ((dayOfWeek + 6) % 7 + dayProgress) / 7;
    const weekPhase = Math.ceil(weekProgress * 12) as HeroPhaseNumber;
    
    // Project/quarter progress
    const projectProgress = projectTotalTasks > 0 
      ? projectCompletedTasks / projectTotalTasks 
      : 0;
    const projectPhase = this.progressToHeroPhase(projectProgress);

    return {
      moment: {
        yuga: currentYuga,
        progress: yugaProgress
      },
      session: {
        yuga: currentYuga,
        heroPhase: hourPhase,
        progress: Math.min(1, sessionDuration / 480) // 8 hour max
      },
      day: {
        tarot: dayOfWeek,
        heroPhase: hourPhase,
        progress: dayProgress
      },
      week: {
        heroPhase: weekPhase,
        progress: weekProgress
      },
      moon: {
        phase: this.calculateMoonPhase(now),
        progress: this.getMoonProgress(now)
      },
      quarter: {
        heroPhase: projectPhase,
        progress: projectProgress
      }
    };
  }

  /**
   * Get fractal cycles organized as parent/child relationships
   */
  getFractalHierarchy(): FractalCycle[] {
    const now = new Date();
    
    return [
      {
        level: 'quarter',
        currentPhase: 1,
        progress: 0.1,
        children: ['moon']
      },
      {
        level: 'moon',
        currentPhase: 1,
        progress: this.getMoonProgress(now),
        parent: 'quarter',
        children: ['week']
      },
      {
        level: 'week',
        currentPhase: this.hourToHeroPhase(now.getDay() * 2),
        progress: ((now.getDay() + 6) % 7) / 7,
        parent: 'moon',
        children: ['day']
      },
      {
        level: 'day',
        currentPhase: this.hourToHeroPhase(now.getHours()),
        progress: (now.getHours() + now.getMinutes() / 60) / 24,
        parent: 'week',
        children: ['session']
      },
      {
        level: 'session',
        currentPhase: this.getCurrentYuga().name,
        progress: this.getYugaProgress(),
        parent: 'day',
        children: ['moment']
      },
      {
        level: 'moment',
        currentPhase: this.getCurrentYuga().name,
        progress: (now.getMinutes() * 60 + now.getSeconds()) / 3600,
        parent: 'session'
      }
    ];
  }

  /**
   * Get recommended action based on current Yuga state
   */
  getRecommendedAction(sessionDurationMinutes?: number): string {
    const yuga = this.getCurrentYuga(sessionDurationMinutes);
    
    switch (yuga.name) {
      case 'krita':
        return 'Stay in flow. Defer interruptions. This is golden time.';
      case 'treta':
        return 'Solid work continues. Watch for fatigue signals.';
      case 'dvapara':
        return 'Take a break soon. Step away before hitting Kali.';
      case 'kali':
        return 'STOP. Rest is the only productive action now.';
      default:
        return 'Observe your state and act accordingly.';
    }
  }

  /**
   * Map a task's micro-journey to Yuga phases
   * Each task contains the full 4-Yuga cycle within it
   */
  mapTaskToYugas(taskDurationMinutes: number): Record<Yuga, { start: number; end: number }> {
    // Task duration divided into 4 yugas
    // Krita: 40%, Treta: 30%, Dvapara: 20%, Kali: 10%
    const kritaEnd = taskDurationMinutes * 0.4;
    const tretaEnd = taskDurationMinutes * 0.7;
    const dvaparaEnd = taskDurationMinutes * 0.9;
    
    return {
      krita: { start: 0, end: kritaEnd },
      treta: { start: kritaEnd, end: tretaEnd },
      dvapara: { start: tretaEnd, end: dvaparaEnd },
      kali: { start: dvaparaEnd, end: taskDurationMinutes }
    };
  }

  /**
   * Get current Yuga for a task based on time spent
   */
  getTaskYuga(taskDurationMinutes: number, timeSpentMinutes: number): YugaState {
    const yugaMap = this.mapTaskToYugas(taskDurationMinutes);
    
    if (timeSpentMinutes < yugaMap.krita.end) return YUGAS.krita;
    if (timeSpentMinutes < yugaMap.treta.end) return YUGAS.treta;
    if (timeSpentMinutes < yugaMap.dvapara.end) return YUGAS.dvapara;
    return YUGAS.kali;
  }

  /**
   * Check if it's time to transition Yuga
   */
  shouldTransitionYuga(sessionDurationMinutes?: number): { 
    shouldTransition: boolean; 
    from: Yuga; 
    to: Yuga | null;
    urgency: 'none' | 'soon' | 'now';
  } {
    const duration = sessionDurationMinutes ?? this.getSessionDuration();
    const currentYuga = this.getCurrentYuga(duration).name;
    
    // Calculate time until next yuga
    const timeUntilNext = this.getTimeUntilNextYuga(duration);
    
    let urgency: 'none' | 'soon' | 'now' = 'none';
    if (timeUntilNext <= 0) urgency = 'now';
    else if (timeUntilNext <= 10) urgency = 'soon';
    
    const currentIndex = YUGA_ORDER.indexOf(currentYuga);
    const nextYuga = currentIndex < YUGA_ORDER.length - 1 
      ? YUGA_ORDER[currentIndex + 1] 
      : null;
    
    return {
      shouldTransition: urgency !== 'none',
      from: currentYuga,
      to: nextYuga,
      urgency
    };
  }

  /**
   * Get all 4 Yugas
   */
  getAllYugas(): YugaState[] {
    return YUGA_ORDER.map(y => YUGAS[y]);
  }

  /**
   * Get Yuga by name
   */
  getYuga(name: Yuga): YugaState {
    return YUGAS[name];
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private hourToHeroPhase(hour: number): HeroPhaseNumber {
    // Map 24 hours to 12 phases (2 hours per phase)
    // Active hours: 6am-10pm (16 hours) mapped to phases 1-12
    // Rest hours: 10pm-6am mapped to phase 12 (return with elixir/sleep)
    
    if (hour >= 22 || hour < 6) {
      return 12; // Night/rest = Return with Elixir
    }
    
    const activeHour = hour - 6; // 6am = 0
    const phase = Math.floor((activeHour / 16) * 12) + 1;
    return Math.min(12, Math.max(1, phase)) as HeroPhaseNumber;
  }

  private progressToHeroPhase(progress: number): HeroPhaseNumber {
    // Progress 0-1 mapped to phases 1-12
    const phase = Math.floor(progress * 12) + 1;
    return Math.min(12, Math.max(1, phase)) as HeroPhaseNumber;
  }

  private getTimeUntilNextYuga(sessionDurationMinutes: number): number {
    if (sessionDurationMinutes < 90) {
      return 90 - sessionDurationMinutes;
    } else if (sessionDurationMinutes < 150) {
      return 150 - sessionDurationMinutes;
    } else if (sessionDurationMinutes < 210) {
      return 210 - sessionDurationMinutes;
    }
    return 0; // Already in/over Kali
  }

  private calculateMoonPhase(date: Date): string {
    // Simplified moon phase calculation
    // Full moon reference: January 25, 2024
    const knownNewMoon = new Date('2024-01-11T00:00:00Z');
    const diffTime = date.getTime() - knownNewMoon.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const lunarCycle = 29.53059;
    const age = diffDays % lunarCycle;
    
    if (age < 1) return 'New Moon';
    if (age < 7) return 'Waxing Crescent';
    if (age < 8) return 'First Quarter';
    if (age < 14) return 'Waxing Gibbous';
    if (age < 16) return 'Full Moon';
    if (age < 22) return 'Waning Gibbous';
    if (age < 23) return 'Last Quarter';
    return 'Waning Crescent';
  }

  private getMoonProgress(date: Date): number {
    const knownNewMoon = new Date('2024-01-11T00:00:00Z');
    const diffTime = date.getTime() - knownNewMoon.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const lunarCycle = 29.53059;
    const age = diffDays % lunarCycle;
    return age / lunarCycle;
  }
}

// Singleton instance
export const fractalTime = new FractalTime();
