/**
 * KalachakraEngine - Main orchestrator
 * Integrates all components and manages state persistence
 */

import { 
  KalachakraState, 
  Task, 
  HeroPhase, 
  YugaState,
  TarotCard,
  NowResponse,
  CardDrawResponse,
  TaskCompleteResponse,
  TaskCompleteRequest,
  CardDrawRequest
} from './types/index.js';
import { TarotOracle, tarotOracle } from './cards/TarotOracle.js';
import { HeroJourneyMap, heroJourneyMap } from './engine/HeroJourneyMap.js';
import { FractalTime, fractalTime } from './cycles/FractalTime.js';
import { TemporalEngine, temporalEngine } from './engine/TemporalEngine.js';
import { StateManager } from './utils/StateManager.js';

// ============================================================================
// KALACHAKRA ENGINE
// ============================================================================

export class KalachakraEngine {
  private tarot: TarotOracle;
  private heroMap: HeroJourneyMap;
  private fractal: FractalTime;
  private temporal: TemporalEngine;
  private stateManager: StateManager;
  
  // Current runtime state
  private currentState: KalachakraState;
  private activeTask: Task | null = null;
  private tasks: Map<string, Task> = new Map();

  constructor(statePath?: string) {
    this.tarot = tarotOracle;
    this.heroMap = heroJourneyMap;
    this.fractal = fractalTime;
    this.temporal = temporalEngine;
    this.stateManager = new StateManager(statePath);
    
    // Initialize with default state
    this.currentState = this.getDefaultState();
  }

  /**
   * Initialize the engine - load saved state and sync with Noesis
   */
  async initialize(): Promise<void> {
    // Try to load saved state
    const savedState = await this.stateManager.loadState();
    if (savedState) {
      this.currentState = savedState;
    }
    
    // Sync with current temporal state
    await this.syncWithNoesis();
    
    // Start session tracking
    this.fractal.startSession();
    
    // Save initial state
    await this.persistState();
  }

  /**
   * Get current "now" state - the complete temporal snapshot
   */
  async getNow(): Promise<NowResponse> {
    await this.syncWithNoesis();
    
    const cardOfDay = this.tarot.getCardOfTheDay();
    const heroPhase = this.currentState.heroPhase;
    const yuga = this.currentState.yugaOfTheMoment;
    
    return {
      timestamp: new Date().toISOString(),
      tarot: cardOfDay,
      heroPhase,
      yuga,
      noesis: this.currentState.noesis,
      sankalpa: this.currentState.sankalpa
    };
  }

  /**
   * Get complete state
   */
  getState(): KalachakraState {
    return { ...this.currentState };
  }

  /**
   * Draw a card for guidance
   */
  drawCard(request?: CardDrawRequest): CardDrawResponse {
    const draw = this.tarot.drawCard(
      request?.context,
      request?.intentionalSeed
    );
    
    // Add to recent draws
    this.currentState.recentDraws.unshift(draw);
    if (this.currentState.recentDraws.length > 10) {
      this.currentState.recentDraws.pop();
    }
    
    // Generate guidance
    const taskType = this.inferTaskType(request?.context);
    const guidance = this.tarot.interpretForTask(draw.card, taskType);
    
    const suggestedAction = draw.orientation === 'upright'
      ? `Embrace ${draw.card.name}'s energy: ${draw.card.keywords.join(', ')}`
      : `Consider the shadow of ${draw.card.name}: ${draw.card.meaning.reversed}`;
    
    return {
      draw,
      guidance,
      koshaEmphasis: draw.card.kosha,
      suggestedAction
    };
  }

  /**
   * Create a new task with mythic mapping
   */
  createTask(
    name: string,
    description?: string,
    estimatedDuration: number = 60
  ): Task {
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine hero phase based on task characteristics
    const heroPhase = this.heroMap.assignTaskToPhase(
      name,
      description,
      this.currentState.heroPhase.number
    );
    
    // Map to yuga phases
    const yugaPhases = this.fractal.mapTaskToYugas(estimatedDuration);
    
    const task: Task = {
      id,
      name,
      description,
      createdAt: new Date().toISOString(),
      estimatedDuration,
      heroPhase: heroPhase.number,
      yuga: 'krita', // Start in golden age
      kosha: heroPhase.kosha,
      microJourney: this.heroMap.getMicroJourney(name),
      status: 'pending',
      progress: 0
    };
    
    this.tasks.set(id, task);
    return task;
  }

  /**
   * Start working on a task
   */
  startTask(taskId: string): Task {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    // Complete previous active task if any
    if (this.activeTask) {
      this.activeTask.status = 'paused';
    }
    
    task.status = 'active';
    task.drawnCard = this.tarot.drawCard(`Starting: ${task.name}`);
    
    this.activeTask = task;
    this.currentState.activeTask = task;
    
    return task;
  }

  /**
   * Update task progress
   */
  updateTaskProgress(taskId: string, progress: number): Task {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    task.progress = Math.max(0, Math.min(1, progress));
    
    // Update yuga based on progress
    const timeSpent = task.estimatedDuration * progress;
    const currentYuga = this.fractal.getTaskYuga(task.estimatedDuration, timeSpent);
    task.yuga = currentYuga.name;
    
    return task;
  }

  /**
   * Complete a task
   */
  completeTask(request: TaskCompleteRequest): TaskCompleteResponse {
    const task = this.tasks.get(request.taskId);
    if (!task) {
      throw new Error(`Task ${request.taskId} not found`);
    }
    
    task.status = 'completed';
    task.progress = 1;
    task.completedAt = new Date().toISOString();
    
    // Move to completed
    this.currentState.completedTasks.push(task);
    this.tasks.delete(request.taskId);
    
    // Clear active task if this was it
    if (this.activeTask?.id === task.id) {
      this.activeTask = null;
      this.currentState.activeTask = undefined;
    }
    
    // Calculate next phase suggestion
    const completedCount = this.currentState.completedTasks.length;
    const nextPhase = this.heroMap.calculateCurrentPhase(
      completedCount + 5, // estimated total
      completedCount,
      1 // project duration in days
    );
    
    // Generate lesson and elixir
    const lesson = this.generateLesson(task, request);
    const elixir = this.generateElixir(task);
    
    return {
      task,
      nextPhaseSuggestion: nextPhase,
      lesson,
      elixir
    };
  }

  /**
   * Get tasks for current hero phase
   */
  getTasksForPhase(phaseNumber?: number): Task[] {
    const phase = phaseNumber ?? this.currentState.heroPhase.number;
    return Array.from(this.tasks.values()).filter(
      t => t.heroPhase === phase
    );
  }

  /**
   * Get recommended task based on current temporal state
   */
  getRecommendedTask(): { task: Task | null; reasoning: string } {
    const yuga = this.currentState.yugaOfTheMoment.name;
    const kosha = this.currentState.yugaOfTheMoment.kosha;
    
    // Filter tasks by kosha match in Krita/Treta
    const pendingTasks = Array.from(this.tasks.values())
      .filter(t => t.status === 'pending');
    
    if (pendingTasks.length === 0) {
      return { task: null, reasoning: 'No pending tasks. Create one first.' };
    }
    
    // In Krita Yuga, match kosha for flow
    if (yuga === 'krita') {
      const koshaMatch = pendingTasks.find(t => t.kosha === kosha);
      if (koshaMatch) {
        return {
          task: koshaMatch,
          reasoning: `Krita Yuga favors ${kosha} work. ${koshaMatch.name} aligns with current energy.`
        };
      }
    }
    
    // Default: shortest task first in Dvapara/Kali
    const sorted = yuga === 'krita' || yuga === 'treta'
      ? pendingTasks // Keep order in good yugas
      : pendingTasks.sort((a, b) => a.estimatedDuration - b.estimatedDuration);
    
    const recommended = sorted[0];
    return {
      task: recommended,
      reasoning: yuga === 'krita' 
        ? 'Begin with the first task while energy is golden.'
        : `In ${yuga} yuga, complete ${recommended.name} quickly for a win.`
    };
  }

  /**
   * Get fractal cycles overview
   */
  getFractalOverview() {
    const cycles = this.fractal.getNestedCycles(
      this.tasks.size + this.currentState.completedTasks.length,
      this.currentState.completedTasks.length
    );
    
    return {
      cycles,
      yugaTransition: this.fractal.shouldTransitionYuga(),
      recommendedAction: this.fractal.getRecommendedAction()
    };
  }

  /**
   * Set sankalpa (intention) for current session
   */
  setSankalpa(sankalpa: string): void {
    this.currentState.sankalpa = sankalpa;
  }

  /**
   * Persist current state to disk
   */
  async persistState(): Promise<void> {
    await this.stateManager.saveState(this.currentState);
  }

  /**
   * Cleanup and save state
   */
  async shutdown(): Promise<void> {
    await this.persistState();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async syncWithNoesis(): Promise<void> {
    const noesisState = await this.temporal.fetchNoesisState();
    
    if (noesisState) {
      this.currentState.noesis = noesisState;
      
      // Update yuga
      const yugaName = this.temporal.mapToYuga(noesisState);
      const yugaState = this.fractal.getYuga(yugaName);
      this.currentState.yugaOfTheMoment = yugaState;
      
      // Update vayu
      this.currentState.currentVayu = this.temporal.getVayuState(noesisState.vayu);
      
      // Update cycles
      this.currentState.cycles = this.fractal.getNestedCycles();
      
      // Update hero phase based on completed tasks
      const totalTasks = this.tasks.size + this.currentState.completedTasks.length;
      const heroPhase = this.heroMap.calculateCurrentPhase(
        totalTasks || 12,
        this.currentState.completedTasks.length,
        1 // project duration in days
      );
      this.currentState.heroPhase = heroPhase;
      
      // Update tarot of the day
      this.currentState.tarotOfTheDay = this.tarot.getCardOfTheDay();
      
      // Generate sankalpa if not set
      if (!this.currentState.sankalpa) {
        this.currentState.sankalpa = heroPhase.sankalpa;
      }
    }
  }

  private getDefaultState(): KalachakraState {
    return {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      noesis: null,
      tarotOfTheDay: this.tarot.getCardOfTheDay(),
      heroPhase: this.heroMap.getPhase(1),
      yugaOfTheMoment: this.fractal.getYuga('krita'),
      currentVayu: {
        name: 'prana',
        direction: 'inward/upward',
        domain: 'life force',
        quality: 'vitalizing',
        associatedKosha: 'pranamaya'
      },
      cycles: this.fractal.getNestedCycles(),
      sankalpa: this.heroMap.getPhase(1).sankalpa,
      recentDraws: [],
      completedTasks: []
    };
  }

  private inferTaskType(context?: string): string {
    if (!context) return 'coding';
    
    const contextLower = context.toLowerCase();
    if (contextLower.includes('debug')) return 'debugging';
    if (contextLower.includes('plan')) return 'planning';
    if (contextLower.includes('write')) return 'writing';
    if (contextLower.includes('design')) return 'designing';
    
    return 'coding';
  }

  private generateLesson(task: Task, request: TaskCompleteRequest): string {
    const phase = this.heroMap.getPhase(task.heroPhase);
    
    if (request.energyLevel < 30) {
      return `${phase.name} taught that rest is part of the work.`;
    }
    
    if (request.satisfaction > 80) {
      return `${phase.name} showed that alignment creates flow.`;
    }
    
    return `From ${phase.name}: ${phase.sankalpa}`;
  }

  private generateElixir(task: Task): string {
    const elixirs: Record<number, string> = {
      1: 'Foundation - the ability to begin',
      2: 'Activation - the spark of creation',
      3: 'Surrender - wisdom in waiting',
      4: 'Knowledge - patterns understood',
      5: 'Commitment - the threshold crossed',
      6: 'Strength - resilience forged',
      7: 'Breakthrough - truth revealed',
      8: 'Transformation - death and rebirth',
      9: 'Joy - the fruit of effort',
      10: 'Integration - the journey inward complete',
      11: 'Awakening - self revealed',
      12: 'Service - the gift shared'
    };
    
    return elixirs[task.heroPhase] || 'Wisdom gained';
  }
}

// Singleton instance with default path
export const kalachakra = new KalachakraEngine(
  '/Users/sheshnarayaniyer/.openclaw/workspace/kalachakra/state/state.json'
);
