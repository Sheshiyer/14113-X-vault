/**
 * JourneyTracker.ts
 * 
 * Progress tracking for the Kalachakra Dashboard build.
 * Maps completed tasks to Hero's Journey phases with percentage tracking.
 * 
 * The journey has 12 phases with 4 tasks each (48 total).
 * Progress flows: locked → available → in_progress → completed
 */

import {
  DASHBOARD_TASKS,
  KalachakraTask,
  HeroPhase,
  Kosha,
  getTaskById,
  getTasksByPhase,
  getTasksByKosha,
  getPhaseName,
  TOTAL_TASKS
} from './DashboardTasks';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PhaseProgress {
  phase: HeroPhase;
  phaseName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  availableTasks: number;
  lockedTasks: number;
  percentageComplete: number;
  status: 'locked' | 'active' | 'completed' | 'mastered';
}

export interface KoshaProgress {
  kosha: Kosha;
  koshaName: string;
  totalTasks: number;
  completedTasks: number;
  percentageComplete: number;
  currentPhase: HeroPhase;
  estimatedYugaRemaining: number;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  triggerPhase: HeroPhase;
  triggerCondition: 'phase_start' | 'phase_complete' | 'task_complete';
  triggerTaskId?: string;
  isAchieved: boolean;
  achievedAt?: Date;
  reward: string;
}

export interface JourneySnapshot {
  timestamp: Date;
  overallPercentage: number;
  currentPhase: HeroPhase;
  phaseProgress: PhaseProgress[];
  koshaProgress: KoshaProgress[];
  nextMilestone: Milestone | null;
  recentCompletions: KalachakraTask[];
  blockedTasks: KalachakraTask[];
  velocity: number; // tasks per week
  estimatedCompletionDate: Date | null;
}

export interface RetroactiveEntry {
  taskId: string;
  completedAt: Date;
  retroactivelyAssigned: boolean;
  originalPhase?: HeroPhase;
  assignedPhase: HeroPhase;
  reason: string;
}

// ============================================================================
// KOSHA METADATA
// ============================================================================

const KOSHA_NAMES: Record<Kosha, string> = {
  annamaya: 'Annamaya (Physical)',
  pranamaya: 'Pranamaya (Energy)', 
  manomaya: 'Manomaya (Mental)',
  vijnanamaya: 'Vijnanamaya (Wisdom)',
  anandamaya: 'Anandamaya (Bliss)',
  noesis: 'Noesis (Integration)'
};

const KOSHA_DESCRIPTIONS: Record<Kosha, string> = {
  annamaya: 'Foundation layer - UI components, layout, visual system',
  pranamaya: 'Flow layer - State management, data synchronization',
  manomaya: 'Logic layer - Business rules, calculations, processing',
  vijnanamaya: 'Wisdom layer - AI, predictions, insights',
  anandamaya: 'Experience layer - UX polish, performance, delight',
  noesis: 'Integration layer - Orchestration, meta-learning, consciousness'
};

// ============================================================================
// MILESTONES
// ============================================================================

export const JOURNEY_MILESTONES: Milestone[] = [
  {
    id: 'M-001',
    name: 'The Ordinary World',
    description: 'Foundation established, journey acknowledged',
    triggerPhase: 1,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Design system tokens available across all components'
  },
  {
    id: 'M-002',
    name: 'The Call Answered',
    description: 'UI component library complete',
    triggerPhase: 2,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Component playground (Storybook) live'
  },
  {
    id: 'M-003',
    name: 'Refusal Overcome',
    description: 'State management architecture solid',
    triggerPhase: 3,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Time-travel debugging enabled'
  },
  {
    id: 'M-004',
    name: 'Mentor Found',
    description: 'Data flow patterns established',
    triggerPhase: 4,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Undo/redo works across entire app'
  },
  {
    id: 'M-005',
    name: 'Threshold Crossed',
    description: 'Business logic engine operational',
    triggerPhase: 5,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Calculations correct for all test cases'
  },
  {
    id: 'M-006',
    name: 'Tests Survived',
    description: 'Advanced features implemented',
    triggerPhase: 6,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Report generation and workflows active'
  },
  {
    id: 'M-007',
    name: 'Cave Approached',
    description: 'AI foundation ready',
    triggerPhase: 7,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'First predictions live'
  },
  {
    id: 'M-008',
    name: 'Ordeal Survived',
    description: 'AI systems operational',
    triggerPhase: 8,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Natural language interface active'
  },
  {
    id: 'M-009',
    name: 'Reward Claimed',
    description: 'Experience layer complete',
    triggerPhase: 9,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Dashboard customization live'
  },
  {
    id: 'M-010',
    name: 'Road Traveled',
    description: 'Production hardening complete',
    triggerPhase: 10,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'PWA offline mode active'
  },
  {
    id: 'M-011',
    name: 'Resurrection Achieved',
    description: 'System self-awareness established',
    triggerPhase: 11,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Vikara detection monitoring all systems'
  },
  {
    id: 'M-012',
    name: 'The Elixir',
    description: 'Kalachakra Dashboard v1.0 complete',
    triggerPhase: 12,
    triggerCondition: 'phase_complete',
    isAchieved: false,
    reward: 'Dashboard is alive, aware, and serving users'
  },
  {
    id: 'M-ELIXIR',
    name: 'Final Integration',
    description: 'NOE-008 completed - the journey ends and begins',
    triggerPhase: 12,
    triggerCondition: 'task_complete',
    triggerTaskId: 'NOE-008',
    isAchieved: false,
    reward: 'Team celebration and launch!'
  }
];

// ============================================================================
// JOURNEY TRACKER CLASS
// ============================================================================

export class JourneyTracker {
  private tasks: KalachakraTask[];
  private retroactiveAssignments: Map<string, RetroactiveEntry>;
  private completionHistory: { taskId: string; completedAt: Date }[];
  private startDate: Date;

  constructor() {
    this.tasks = [...DASHBOARD_TASKS];
    this.retroactiveAssignments = new Map();
    this.completionHistory = [];
    this.startDate = new Date();
  }

  // -------------------------------------------------------------------------
  // TASK STATUS MANAGEMENT
  // -------------------------------------------------------------------------

  updateTaskStatus(taskId: string, status: KalachakraTask['status']): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const oldStatus = task.status;
    task.status = status;

    if (status === 'completed' && oldStatus !== 'completed') {
      task.completedAt = new Date();
      this.completionHistory.push({
        taskId,
        completedAt: task.completedAt
      });
      this.unlockDependentTasks(taskId);
    }

    if (status === 'in_progress' && oldStatus === 'locked') {
      // Auto-update available tasks when started
      task.status = 'in_progress';
    }
  }

  private unlockDependentTasks(completedTaskId: string): void {
    const dependentTasks = this.tasks.filter(t =>
      t.dependencies.some(d => d.taskId === completedTaskId && d.type === 'hard')
    );

    for (const task of dependentTasks) {
      const allHardDepsCompleted = task.dependencies
        .filter(d => d.type === 'hard')
        .every(d => {
          const depTask = this.tasks.find(t => t.id === d.taskId);
          return depTask?.status === 'completed';
        });

      if (allHardDepsCompleted && task.status === 'locked') {
        task.status = 'available';
      }
    }
  }

  // -------------------------------------------------------------------------
  // PHASE PROGRESS CALCULATION
  // -------------------------------------------------------------------------

  getPhaseProgress(phase: HeroPhase): PhaseProgress {
    const phaseTasks = this.tasks.filter(t => t.heroPhase === phase);
    const totalTasks = phaseTasks.length;
    const completedTasks = phaseTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = phaseTasks.filter(t => t.status === 'in_progress').length;
    const availableTasks = phaseTasks.filter(t => t.status === 'available').length;
    const lockedTasks = phaseTasks.filter(t => t.status === 'locked').length;
    const percentageComplete = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    let status: PhaseProgress['status'] = 'locked';
    if (completedTasks === totalTasks) {
      status = 'mastered';
    } else if (completedTasks > 0) {
      status = 'completed';
    } else if (inProgressTasks > 0 || availableTasks > 0) {
      status = 'active';
    }

    return {
      phase,
      phaseName: getPhaseName(phase),
      totalTasks,
      completedTasks,
      inProgressTasks,
      availableTasks,
      lockedTasks,
      percentageComplete,
      status
    };
  }

  getAllPhaseProgress(): PhaseProgress[] {
    return ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HeroPhase[])
      .map(phase => this.getPhaseProgress(phase));
  }

  // -------------------------------------------------------------------------
  // CURRENT PHASE DETECTION
  // -------------------------------------------------------------------------

  getCurrentPhase(): HeroPhase {
    const phaseProgress = this.getAllPhaseProgress();
    
    // Find first active phase
    const activePhase = phaseProgress.find(p => p.status === 'active');
    if (activePhase) {
      return activePhase.phase;
    }

    // If no active, find first not mastered
    const incompletePhase = phaseProgress.find(p => p.status !== 'mastered');
    if (incompletePhase) {
      return incompletePhase.phase;
    }

    // All phases mastered
    return 12;
  }

  getCurrentPhaseProgress(): number {
    const currentPhase = this.getCurrentPhase();
    const progress = this.getPhaseProgress(currentPhase);
    return progress.percentageComplete;
  }

  // -------------------------------------------------------------------------
  // KOSHA PROGRESS
  // -------------------------------------------------------------------------

  getKoshaProgress(kosha: Kosha): KoshaProgress {
    const koshaTasks = this.tasks.filter(t => t.kosha === kosha);
    const totalTasks = koshaTasks.length;
    const completedTasks = koshaTasks.filter(t => t.status === 'completed').length;
    const percentageComplete = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Find current phase for this kosha
    const incompleteTask = koshaTasks.find(t => t.status !== 'completed');
    const currentPhase = incompleteTask?.heroPhase || 12;

    // Calculate remaining yuga
    const remainingTasks = koshaTasks.filter(t => t.status !== 'completed');
    const estimatedYugaRemaining = remainingTasks.reduce((sum, t) => sum + t.estimatedYuga, 0);

    return {
      kosha,
      koshaName: KOSHA_NAMES[kosha],
      totalTasks,
      completedTasks,
      percentageComplete,
      currentPhase,
      estimatedYugaRemaining
    };
  }

  getAllKoshaProgress(): KoshaProgress[] {
    const koshas: Kosha[] = ['annamaya', 'pranamaya', 'manomaya', 'vijnanamaya', 'anandamaya', 'noesis'];
    return koshas.map(k => this.getKoshaProgress(k));
  }

  // -------------------------------------------------------------------------
  // OVERALL PROGRESS
  // -------------------------------------------------------------------------

  getOverallProgress(): number {
    const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    return (completedTasks / TOTAL_TASKS) * 100;
  }

  getCompletedTaskCount(): number {
    return this.tasks.filter(t => t.status === 'completed').length;
  }

  // -------------------------------------------------------------------------
  // RETROACTIVE PHASE ASSIGNMENT
  // -------------------------------------------------------------------------

  /**
   * When tasks are completed without journey tracking,
   * retroactively assign them to appropriate phases.
   */
  assignRetroactively(taskId: string, assignedPhase: HeroPhase, reason: string): RetroactiveEntry {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const entry: RetroactiveEntry = {
      taskId,
      completedAt: task.completedAt || new Date(),
      retroactivelyAssigned: true,
      originalPhase: task.heroPhase,
      assignedPhase,
      reason
    };

    this.retroactiveAssignments.set(taskId, entry);
    
    // Update task phase if different
    if (task.heroPhase !== assignedPhase) {
      // Note: In a real system, we might want to preserve original
      // Here we update for tracking purposes
      (task as any).heroPhase = assignedPhase;
    }

    return entry;
  }

  getRetroactiveAssignments(): RetroactiveEntry[] {
    return Array.from(this.retroactiveAssignments.values());
  }

  // -------------------------------------------------------------------------
  // MILESTONE TRACKING
  // -------------------------------------------------------------------------

  checkMilestones(): Milestone[] {
    const achieved: Milestone[] = [];

    for (const milestone of JOURNEY_MILESTONES) {
      if (milestone.isAchieved) continue;

      let shouldAchieve = false;

      if (milestone.triggerCondition === 'phase_complete') {
        const phaseProgress = this.getPhaseProgress(milestone.triggerPhase);
        shouldAchieve = phaseProgress.status === 'completed' || phaseProgress.status === 'mastered';
      } else if (milestone.triggerCondition === 'phase_start') {
        const currentPhase = this.getCurrentPhase();
        shouldAchieve = currentPhase >= milestone.triggerPhase;
      } else if (milestone.triggerCondition === 'task_complete' && milestone.triggerTaskId) {
        const task = this.tasks.find(t => t.id === milestone.triggerTaskId);
        shouldAchieve = task?.status === 'completed';
      }

      if (shouldAchieve) {
        milestone.isAchieved = true;
        milestone.achievedAt = new Date();
        achieved.push(milestone);
      }
    }

    return achieved;
  }

  getNextMilestone(): Milestone | null {
    return JOURNEY_MILESTONES.find(m => !m.isAchieved) || null;
  }

  getAchievedMilestones(): Milestone[] {
    return JOURNEY_MILESTONES.filter(m => m.isAchieved);
  }

  // -------------------------------------------------------------------------
  // VELOCITY & PREDICTION
  // -------------------------------------------------------------------------

  getVelocity(): number {
    if (this.completionHistory.length < 2) {
      return 0;
    }

    // Sort by completion date
    const sorted = [...this.completionHistory].sort(
      (a, b) => a.completedAt.getTime() - b.completedAt.getTime()
    );

    const firstCompletion = sorted[0].completedAt;
    const lastCompletion = sorted[sorted.length - 1].completedAt;
    const weeksElapsed = (lastCompletion.getTime() - firstCompletion.getTime()) / (1000 * 60 * 60 * 24 * 7);
    
    if (weeksElapsed === 0) {
      return sorted.length; // All completed in same week
    }

    return sorted.length / weeksElapsed;
  }

  getEstimatedCompletionDate(): Date | null {
    const velocity = this.getVelocity();
    if (velocity === 0) {
      return null;
    }

    const remainingTasks = this.tasks.filter(t => t.status !== 'completed').length;
    const weeksRemaining = remainingTasks / velocity;
    
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + (weeksRemaining * 7));
    
    return estimatedDate;
  }

  // -------------------------------------------------------------------------
  // BLOCKED TASKS
  // -------------------------------------------------------------------------

  getBlockedTasks(): KalachakraTask[] {
    return this.tasks.filter(t => {
      if (t.status !== 'locked') return false;
      
      // Task is blocked if it has incomplete hard dependencies
      // but some dependencies are soft-completed
      const hasIncompleteHardDep = t.dependencies
        .filter(d => d.type === 'hard')
        .some(d => {
          const depTask = this.tasks.find(task => task.id === d.taskId);
          return depTask?.status !== 'completed';
        });

      const hasSomeProgress = t.dependencies
        .some(d => {
          const depTask = this.tasks.find(task => task.id === d.taskId);
          return depTask?.status === 'completed' || depTask?.status === 'in_progress';
        });

      return hasIncompleteHardDep && hasSomeProgress;
    });
  }

  // -------------------------------------------------------------------------
  // SNAPSHOT
  // -------------------------------------------------------------------------

  getSnapshot(): JourneySnapshot {
    const recentCompletions = this.tasks
      .filter(t => t.status === 'completed' && t.completedAt)
      .sort((a, b) => (b.completedAt!.getTime() - a.completedAt!.getTime()))
      .slice(0, 5);

    return {
      timestamp: new Date(),
      overallPercentage: this.getOverallProgress(),
      currentPhase: this.getCurrentPhase(),
      phaseProgress: this.getAllPhaseProgress(),
      koshaProgress: this.getAllKoshaProgress(),
      nextMilestone: this.getNextMilestone(),
      recentCompletions,
      blockedTasks: this.getBlockedTasks(),
      velocity: this.getVelocity(),
      estimatedCompletionDate: this.getEstimatedCompletionDate()
    };
  }

  // -------------------------------------------------------------------------
  // EXPORT/IMPORT
  // -------------------------------------------------------------------------

  exportState(): string {
    return JSON.stringify({
      tasks: this.tasks.map(t => ({
        id: t.id,
        status: t.status,
        completedAt: t.completedAt?.toISOString()
      })),
      retroactiveAssignments: Array.from(this.retroactiveAssignments.entries()),
      completionHistory: this.completionHistory,
      startDate: this.startDate.toISOString()
    }, null, 2);
  }

  importState(stateJson: string): void {
    const state = JSON.parse(stateJson);
    
    for (const taskState of state.tasks) {
      const task = this.tasks.find(t => t.id === taskState.id);
      if (task) {
        task.status = taskState.status;
        task.completedAt = taskState.completedAt ? new Date(taskState.completedAt) : undefined;
      }
    }

    this.retroactiveAssignments = new Map(state.retroactiveAssignments);
    this.completionHistory = state.completionHistory.map((h: any) => ({
      ...h,
      completedAt: new Date(h.completedAt)
    }));
    this.startDate = new Date(state.startDate);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatYuga(yuga: number): string {
  if (yuga < 1) {
    return `${Math.round(yuga * 60)} min`;
  }
  return `${yuga.toFixed(1)} hr`;
}

export function getPhaseColor(phase: HeroPhase): string {
  const colors: Record<HeroPhase, string> = {
    1: '#22c55e',  // Green - beginning
    2: '#3b82f6',  // Blue - call
    3: '#f59e0b',  // Amber - refusal
    4: '#8b5cf6',  // Purple - mentor
    5: '#ef4444',  // Red - threshold
    6: '#ec4899',  // Pink - tests
    7: '#14b8a6',  // Teal - approach
    8: '#dc2626',  // Dark red - ordeal
    9: '#fbbf24',  // Gold - reward
    10: '#06b6d4', // Cyan - road back
    11: '#a855f7', // Violet - resurrection
    12: '#10b981'  // Emerald - elixir
  };
  return colors[phase];
}

export function getKoshaColor(kosha: Kosha): string {
  const colors: Record<Kosha, string> = {
    annamaya: '#78350f',    // Brown - earth/physical
    pranamaya: '#dc2626',   // Red - energy/fire
    manomaya: '#2563eb',    // Blue - mind/water
    vijnanamaya: '#7c3aed', // Violet - wisdom/air
    anandamaya: '#fbbf24',  // Gold - bliss/light
    noesis: '#06b6d4'       // Cyan - integration/ether
  };
  return colors[kosha];
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const journeyTracker = new JourneyTracker();

export default journeyTracker;
