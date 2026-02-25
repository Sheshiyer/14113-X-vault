/**
 * Noesis Bridge - Integration Layer for Kalachakra
 * 
 * The bridge connects Kalachakra (the fractal time calendar)
 * with Noesis (the temporal engine). Kalachakra READS from Noesis
 * but doesn't duplicate its functionality.
 * 
 * Noesis = the engine
 * Kalachakra = the story told by the engine
 * 
 * @module bridge
 */

// NoesisClient - CLI wrapper for noesis commands
export { 
  NoesisClient, 
  getNoesisClient, 
  resetNoesisClient,
  type NoesisHealth,
  type NoesisClock,
  type NoesisMoon,
  type NoesisVayus,
} from './NoesisClient';

// StateSynchronizer - Real-time sync
export { 
  StateSynchronizer, 
  getStateSynchronizer, 
  resetStateSynchronizer,
  type SyncConfig,
  type YugaTransitionEvent,
  type VikaraAlert,
  type SyncStatus,
} from './StateSynchronizer';

// KhalorēēMonitor - Energy tracking
export { 
  KhalorēēMonitor, 
  getKhalorēēMonitor, 
  resetKhalorēēMonitor,
  type EnergySample,
  type EnergyTrend,
  type KaliPrediction,
  type RestRecommendation,
  type TaskEnergyCorrelation,
  type KhaloreeHistory,
} from './KhalorēēMonitor';

// VayuAdapter - Elemental forces mapping
export { 
  VayuAdapter, 
  getVayuAdapter, 
  resetVayuAdapter,
  type WorkType,
  type VayuSuggestion,
  type DailyVayuFlow,
} from './VayuAdapter';

// Integration class that combines all bridge components
import { NoesisClient } from './NoesisClient';
import { StateSynchronizer, SyncConfig } from './StateSynchronizer';
import { KhalorēēMonitor } from './KhalorēēMonitor';
import { VayuAdapter } from './VayuAdapter';
import { KalachakraState } from '../types';

export interface BridgeConfig {
  noesisPath?: string;
  sync?: Partial<SyncConfig>;
  enablePrediction?: boolean;
}

export interface BridgeSnapshot {
  timestamp: string;
  state: KalachakraState | null;
  suggestion: {
    vayu: string;
    workType: string;
    tasks: string[];
    confidence: number;
    transitionWarning?: string;
  };
  prediction: {
    kaliImminent: boolean;
    estimatedMinutes?: number;
    recommendedAction: string;
  };
  rest: {
    urgency: 'none' | 'soon' | 'now' | 'immediate';
    suggestedDuration: number;
    reason: string;
  };
  optimalTasks: string[];
}

export class NoesisBridge {
  client: NoesisClient;
  synchronizer: StateSynchronizer;
  monitor: KhalorēēMonitor;
  adapter: VayuAdapter;

  constructor(config: BridgeConfig = {}) {
    this.client = new NoesisClient({ noesisPath: config.noesisPath });
    this.synchronizer = new StateSynchronizer(this.client, config.sync);
    this.monitor = new KhalorēēMonitor(this.client);
    this.adapter = new VayuAdapter();
  }

  /**
   * Start all bridge components
   */
  start(): void {
    this.synchronizer.start();
    
    // Connect synchronizer to monitor
    this.synchronizer.on('sync', (state: KalachakraState) => {
      if (state.noesis) {
        this.monitor.recordSample(state.noesis);
      }
    });
  }

  /**
   * Stop all bridge components
   */
  stop(): void {
    this.synchronizer.stop();
  }

  /**
   * Get a complete snapshot of current state
   */
  async getSnapshot(): Promise<BridgeSnapshot> {
    const state = this.synchronizer.getCurrentState();
    const temporal = await this.client.getTemporal();
    const vayus = await this.client.getVayus();

    if (!state || !temporal || !vayus) {
      return {
        timestamp: new Date().toISOString(),
        state: null,
        suggestion: {
          vayu: 'unknown',
          workType: 'unknown',
          tasks: [],
          confidence: 0,
        },
        prediction: {
          kaliImminent: false,
          recommendedAction: 'Noesis unavailable - using fallback',
        },
        rest: {
          urgency: 'none',
          suggestedDuration: 0,
          reason: 'No data available',
        },
        optimalTasks: [],
      };
    }

    const suggestion = this.adapter.getSuggestion(vayus, temporal.khaloree, temporal.vikara);
    const prediction = this.monitor.predictKaliYuga();
    const rest = this.monitor.getRestRecommendation();
    const optimal = this.monitor.getOptimalTasksForCurrentState();

    return {
      timestamp: new Date().toISOString(),
      state,
      suggestion: {
        vayu: suggestion.vayu,
        workType: suggestion.workType.name,
        tasks: this.adapter.getTaskSuggestions(suggestion.vayu, 3),
        confidence: suggestion.confidence,
        transitionWarning: suggestion.transitionWarning,
      },
      prediction: {
        kaliImminent: prediction.predicted,
        estimatedMinutes: prediction.estimatedTimeToKali || undefined,
        recommendedAction: prediction.recommendedAction,
      },
      rest: {
        urgency: rest.urgency,
        suggestedDuration: rest.suggestedDuration,
        reason: rest.reason,
      },
      optimalTasks: optimal.slice(0, 3).map(t => t.taskType),
    };
  }

  /**
   * Get current vayu and suggested work type
   */
  getCurrentVayuGuidance(): {
    vayu: string;
    workType: string;
    description: string;
    suggestedTasks: string[];
  } | null {
    const state = this.synchronizer.getCurrentState();
    if (!state?.noesis) return null;

    const workType = this.adapter.getWorkType(state.noesis.vayu);
    
    return {
      vayu: state.noesis.vayu,
      workType: workType.name,
      description: workType.description,
      suggestedTasks: this.adapter.getTaskSuggestions(state.noesis.vayu, 3),
    };
  }

  /**
   * Check if it's a good time for a specific work type
   */
  isGoodTimeFor(workTypeId: string): {
    suitable: boolean;
    score: number;
    reason: string;
  } {
    const state = this.synchronizer.getCurrentState();
    if (!state?.noesis) {
      return { suitable: false, score: 0, reason: 'No state available' };
    }

    const allTypes = this.adapter.getAllWorkTypes();
    const targetType = allTypes.find(wt => wt.id === workTypeId);
    
    if (!targetType) {
      return { suitable: false, score: 0, reason: 'Unknown work type' };
    }

    const { khaloree, vikara, cliffordOctave } = state.noesis;
    const match = this.adapter.isProfileMatch(targetType, khaloree, vikara);
    
    // Calculate score
    const khaloreeScore = Math.max(0, (khaloree - targetType.energyProfile.khaloreeMin) / 40 + 0.5);
    const vikaraScore = Math.max(0, (targetType.energyProfile.vikaraMax - vikara) / 40 + 0.5);
    const score = (khaloreeScore + vikaraScore) / 2;

    return {
      suitable: match,
      score,
      reason: match 
        ? `Good alignment: ${Math.round(score * 100)}% energy match`
        : `Low alignment: ${Math.round(score * 100)}% - ${khaloree < targetType.energyProfile.khaloreeMin ? 'khaloree too low' : 'vikara too high'}`,
    };
  }

  /**
   * Record task completion for correlation tracking
   */
  recordTask(taskId: string, taskType: string, duration: number, success: boolean): void {
    this.monitor.recordTaskCompletion(taskId, taskType, duration, success);
  }

  /**
   * Get bridge status
   */
  getStatus(): {
    connected: boolean;
    lastSync: string | null;
    samples: number;
    correlations: number;
  } {
    return {
      connected: this.synchronizer.getStatus() === 'connected',
      lastSync: this.synchronizer.getCurrentState()?.timestamp || null,
      samples: 0, // Would need to expose from monitor
      correlations: 0, // Would need to expose from monitor
    };
  }
}

// Default export
export default NoesisBridge;
