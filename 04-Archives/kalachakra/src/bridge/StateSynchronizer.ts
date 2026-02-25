/**
 * StateSynchronizer - Real-time synchronization with Noesis
 * 
 * Polls noesis health every 30s, updates Kalachakra state,
 * detects Yuga transitions, and alerts on critical Vikara (drift).
 */

import { EventEmitter } from 'events';
import { NoesisClient, NoesisHealth } from './NoesisClient';
import { KalachakraState, Yuga, YugaState, VayuState, Vayu, HeroPhase, NoesisTemporalState } from '../types';

export interface SyncConfig {
  pollInterval: number;      // milliseconds
  vikaraThreshold: number;   // alert when vikara exceeds this (0-100)
  yugaTransitionDebounce: number; // ms to debounce yuga changes
  enableAlerts: boolean;
}

export interface YugaTransitionEvent {
  from: Yuga;
  to: Yuga;
  timestamp: string;
  reason: 'khaloree_drop' | 'vikara_rise' | 'time_elapsed' | 'manual';
  khaloreeDelta: number;
  vikaraDelta: number;
}

export interface VikaraAlert {
  level: 'warning' | 'critical' | 'emergency';
  vikara: number;
  threshold: number;
  message: string;
  timestamp: string;
  recommendedAction: string;
}

export type SyncStatus = 
  | 'connected'      // Successfully syncing with noesis
  | 'disconnected'   // Noesis unavailable, using fallback
  | 'degraded'       // Connected but with errors
  | 'initializing';  // Starting up

export class StateSynchronizer extends EventEmitter {
  private client: NoesisClient;
  private config: SyncConfig;
  private currentState: KalachakraState | null = null;
  private previousState: KalachakraState | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private status: SyncStatus = 'initializing';
  private lastYuga: Yuga | null = null;
  private yugaTransitionHistory: YugaTransitionEvent[] = [];
  private vikaraAlerts: VikaraAlert[] = [];
  private vikaraCooldown: number = 0;

  // Vayu state mapping
  private readonly VAYU_STATES: Record<Vayu, VayuState> = {
    prana: {
      name: 'prana',
      direction: 'inward/upward',
      domain: 'inspiration, vitality, creation',
      quality: 'ascending, bright, expansive',
      associatedKosha: 'pranamaya',
    },
    vyana: {
      name: 'vyana',
      direction: 'outward/circulating',
      domain: 'distribution, circulation, transformation',
      quality: 'pervasive, integrating, flowing',
      associatedKosha: 'pranamaya',
    },
    udana: {
      name: 'udana',
      direction: 'upward/ascending',
      domain: 'expression, speech, growth',
      quality: 'rising, clarifying, elevating',
      associatedKosha: 'vijnanamaya',
    },
    samana: {
      name: 'samana',
      direction: 'inward/converging',
      domain: 'digestion, assimilation, focus',
      quality: 'centering, balancing, processing',
      associatedKosha: 'manomaya',
    },
    apana: {
      name: 'apana',
      direction: 'downward/grounding',
      domain: 'elimination, release, completion',
      quality: 'descending, stabilizing, finishing',
      associatedKosha: 'annamaya',
    },
  };

  // Yuga characteristics from types
  private readonly YUGA_CHARACTERISTICS: Record<Yuga, YugaState> = {
    krita: {
      name: 'krita',
      sanskritName: 'Kṛta Yuga',
      color: '#FFD700',
      duration: { min: 30, max: 120 },
      characteristics: [
        'Peak cognitive performance',
        'Effortless flow state',
        'High creative output',
        'Deep focus possible',
        'Complex problem solving',
      ],
      tarotCards: [0, 1, 19, 20, 21], // Fool, Magician, Sun, Judgement, World
      kosha: 'anandamaya',
      exitSignals: [
        'Khaloree drops below 70',
        'Vikara rises above 30',
        'Subjective fatigue appears',
      ],
      resetActions: [
        'Continue deep work',
        'Capture insights',
        'Set markers for return',
      ],
    },
    treta: {
      name: 'treta',
      sanskritName: 'Tretā Yuga',
      color: '#C0C0C0',
      duration: { min: 45, max: 180 },
      characteristics: [
        'Solid productive work',
        'Some resistance present',
        'Good for implementation',
        'Steady progress',
        'Maintainable pace',
      ],
      tarotCards: [2, 3, 4, 7, 10], // High Priestess, Empress, Emperor, Chariot, Wheel
      kosha: 'vijnanamaya',
      exitSignals: [
        'Khaloree drops below 50',
        'Vikara rises above 50',
        'Errors increase',
      ],
      resetActions: [
        'Take short breaks',
        'Switch task types',
        'Hydrate and move',
      ],
    },
    dvapara: {
      name: 'dvapara',
      sanskritName: 'Dvāpara Yuga',
      color: '#CD7F32',
      duration: { min: 20, max: 90 },
      characteristics: [
        'Significant resistance',
        'Forcing required',
        'Error-prone',
        'Mental fog',
        'Shallow work only',
      ],
      tarotCards: [5, 6, 11, 12, 14], // Hierophant, Lovers, Justice, Hanged Man, Temperance
      kosha: 'manomaya',
      exitSignals: [
        'Khaloree drops below 30',
        'Vikara rises above 70',
        'Frustration peaks',
      ],
      resetActions: [
        'Switch to admin tasks',
        'Take a walk',
        'Consider ending session',
      ],
    },
    kali: {
      name: 'kali',
      sanskritName: 'Kali Yuga',
      color: '#4A5568',
      duration: { min: 10, max: 60 },
      characteristics: [
        'Negative returns',
        'Cognitive collapse',
        'High error rate',
        'Irritability',
        'Decision fatigue',
      ],
      tarotCards: [13, 15, 16, 17, 18], // Death, Devil, Tower, Star, Moon
      kosha: 'annamaya',
      exitSignals: [
        'Khaloree drops below 15',
        'Vikara rises above 85',
        'Physical exhaustion',
      ],
      resetActions: [
        'STOP working',
        'Rest completely',
        'Sleep if possible',
        'Resume after recovery',
      ],
    },
  };

  constructor(
    client: NoesisClient = new NoesisClient(),
    config: Partial<SyncConfig> = {}
  ) {
    super();
    this.client = client;
    this.config = {
      pollInterval: 30000,      // 30 seconds
      vikaraThreshold: 75,      // alert at 75% drift
      yugaTransitionDebounce: 60000, // 1 minute debounce
      enableAlerts: true,
      ...config,
    };
  }

  /**
   * Start the synchronizer
   */
  start(): void {
    if (this.syncInterval) {
      console.warn('[StateSynchronizer] Already running');
      return;
    }

    console.log('[StateSynchronizer] Starting...');
    
    // Initial sync
    this.sync();

    // Set up polling
    this.syncInterval = setInterval(() => {
      this.sync();
    }, this.config.pollInterval);

    this.emit('started');
  }

  /**
   * Stop the synchronizer
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.status = 'disconnected';
      console.log('[StateSynchronizer] Stopped');
      this.emit('stopped');
    }
  }

  /**
   * Perform a single sync cycle
   */
  private async sync(): Promise<void> {
    try {
      const temporal = await this.client.getTemporal();
      const health = await this.client.getHealth();

      if (!temporal || !health) {
        this.handleDisconnect();
        return;
      }

      this.handleConnect();
      this.updateState(temporal);
      this.checkVikara(temporal);
      this.detectYugaTransition(temporal);

      this.emit('sync', this.currentState);
    } catch (error) {
      console.error('[StateSynchronizer] Sync error:', error);
      this.status = 'degraded';
      this.emit('error', error);
    }
  }

  /**
   * Handle connection to noesis
   */
  private handleConnect(): void {
    if (this.status !== 'connected') {
      this.status = 'connected';
      console.log('[StateSynchronizer] Connected to Noesis');
      this.emit('connected');
    }
  }

  /**
   * Handle disconnection from noesis
   */
  private handleDisconnect(): void {
    if (this.status !== 'disconnected') {
      this.status = 'disconnected';
      console.warn('[StateSynchronizer] Disconnected from Noesis, using fallback');
      this.emit('disconnected');
    }
  }

  /**
   * Update internal state from noesis temporal data
   */
  private updateState(temporal: NoesisTemporalState): void {
    this.previousState = this.currentState;

    const yuga = this.calculateYuga(temporal);
    const yugaState = this.YUGA_CHARACTERISTICS[yuga];
    const vayuState = this.VAYU_STATES[temporal.vayu as Vayu];

    this.currentState = {
      timestamp: temporal.timestamp,
      version: '1.0.0',
      noesis: temporal,
      tarotOfTheDay: this.getTarotOfTheDay(),
      heroPhase: this.calculateHeroPhase(temporal),
      yugaOfTheMoment: yugaState,
      currentVayu: vayuState,
      cycles: this.calculateCycles(temporal),
      sankalpa: this.generateSankalpa(yuga, temporal.vayu),
      recentDraws: this.previousState?.recentDraws ?? [],
      completedTasks: this.previousState?.completedTasks ?? [],
    };

    this.lastYuga = yuga;
  }

  /**
   * Calculate current Yuga based on noesis metrics
   */
  private calculateYuga(temporal: NoesisTemporalState): Yuga {
    const { khaloree, vikara } = temporal;

    // Krita: High energy, low drift
    if (khaloree >= 70 && vikara <= 30) return 'krita';
    
    // Treta: Medium energy, medium drift
    if (khaloree >= 50 && vikara <= 50) return 'treta';
    
    // Dvapara: Low energy, high drift
    if (khaloree >= 30 && vikara <= 75) return 'dvapara';
    
    // Kali: Critical state
    return 'kali';
  }

  /**
   * Calculate hero's journey phase
   */
  private calculateHeroPhase(temporal: NoesisTemporalState): HeroPhase {
    // Map clifford octave (0-7) + vayu to hero phase
    const octaveProgress = temporal.cliffordOctave / 8;
    const vayuIndex = ['prana', 'vyana', 'udana', 'samana', 'apana'].indexOf(temporal.vayu);
    
    // Calculate phase 1-12 based on combined factors
    const phaseNumber = Math.floor((octaveProgress * 5 + vayuIndex / 5) * 12) + 1;
    const clampedPhase = Math.max(1, Math.min(12, phaseNumber)) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    const phaseData = [
      { number: 1 as const, name: 'ORDINARY WORLD', tarotCard: 0, kosha: 'annamaya' as const },
      { number: 2 as const, name: 'CALL TO ADVENTURE', tarotCard: 1, kosha: 'pranamaya' as const },
      { number: 3 as const, name: 'REFUSAL OF CALL', tarotCard: 11, kosha: 'manomaya' as const },
      { number: 4 as const, name: 'MEETING THE MENTOR', tarotCard: 4, kosha: 'vijnanamaya' as const },
      { number: 5 as const, name: 'CROSSING THRESHOLD', tarotCard: 6, kosha: 'pranamaya' as const },
      { number: 6 as const, name: 'TESTS & ALLIES', tarotCard: 7, kosha: 'pranamaya' as const },
      { number: 7 as const, name: 'APPROACH CAVE', tarotCard: 15, kosha: 'manomaya' as const },
      { number: 8 as const, name: 'THE ORDEAL', tarotCard: 12, kosha: 'manomaya' as const },
      { number: 9 as const, name: 'THE REWARD', tarotCard: 18, kosha: 'anandamaya' as const },
      { number: 10 as const, name: 'THE ROAD BACK', tarotCard: 21, kosha: 'annamaya' as const },
      { number: 11 as const, name: 'RESURRECTION', tarotCard: 19, kosha: 'vijnanamaya' as const },
      { number: 12 as const, name: 'RETURN WITH ELIXIR', tarotCard: 16, kosha: 'anandamaya' as const },
    ][clampedPhase - 1];

    return {
      number: clampedPhase,
      name: phaseData.name,
      sanskritName: this.getSanskritPhaseName(clampedPhase),
      tarotCard: phaseData.tarotCard,
      kosha: phaseData.kosha,
      description: this.getPhaseDescription(clampedPhase),
      tasks: this.getPhaseTasks(clampedPhase),
      sankalpa: this.getPhaseSankalpa(clampedPhase),
      progressIndicators: {
        starting: this.getPhaseIndicator(clampedPhase, 'starting'),
        middle: this.getPhaseIndicator(clampedPhase, 'middle'),
        completing: this.getPhaseIndicator(clampedPhase, 'completing'),
      },
    };
  }

  /**
   * Detect and emit Yuga transitions
   */
  private detectYugaTransition(temporal: NoesisTemporalState): void {
    if (!this.lastYuga) return;

    const currentYuga = this.calculateYuga(temporal);
    
    if (currentYuga !== this.lastYuga) {
      const previousKhaloree = this.previousState?.noesis?.khaloree ?? temporal.khaloree;
      const previousVikara = this.previousState?.noesis?.vikara ?? temporal.vikara;

      let reason: YugaTransitionEvent['reason'] = 'time_elapsed';
      if (temporal.khaloree < previousKhaloree - 10) reason = 'khaloree_drop';
      else if (temporal.vikara > previousVikara + 10) reason = 'vikara_rise';

      const transition: YugaTransitionEvent = {
        from: this.lastYuga,
        to: currentYuga,
        timestamp: temporal.timestamp,
        reason,
        khaloreeDelta: temporal.khaloree - previousKhaloree,
        vikaraDelta: temporal.vikara - previousVikara,
      };

      this.yugaTransitionHistory.push(transition);
      
      // Keep only last 100 transitions
      if (this.yugaTransitionHistory.length > 100) {
        this.yugaTransitionHistory.shift();
      }

      console.log(`[StateSynchronizer] Yuga transition: ${this.lastYuga} → ${currentYuga}`);
      this.emit('yugaTransition', transition);
    }
  }

  /**
   * Check for critical Vikara and emit alerts
   */
  private checkVikara(temporal: NoesisTemporalState): void {
    if (!this.config.enableAlerts) return;

    const { vikara } = temporal;
    const now = Date.now();

    // Cooldown period between alerts (5 minutes)
    if (now < this.vikaraCooldown) return;

    let alert: VikaraAlert | null = null;

    if (vikara >= 90) {
      alert = {
        level: 'emergency',
        vikara,
        threshold: this.config.vikaraThreshold,
        message: 'CRITICAL: Immediate rest required. Cognitive function severely impaired.',
        timestamp: temporal.timestamp,
        recommendedAction: 'STOP all work. Rest for at least 30 minutes.',
      };
      this.vikaraCooldown = now + 300000; // 5 min cooldown
    } else if (vikara >= 75) {
      alert = {
        level: 'critical',
        vikara,
        threshold: this.config.vikaraThreshold,
        message: 'HIGH DRIFT: Pattern deviation critical. Performance degraded.',
        timestamp: temporal.timestamp,
        recommendedAction: 'Switch to light tasks or take a 15-minute break.',
      };
      this.vikaraCooldown = now + 300000;
    } else if (vikara >= 60 && this.previousState?.noesis && this.previousState.noesis.vikara < 60) {
      // Warning only on first crossing
      alert = {
        level: 'warning',
        vikara,
        threshold: this.config.vikaraThreshold,
        message: 'ELEVATED DRIFT: Monitor energy levels.',
        timestamp: temporal.timestamp,
        recommendedAction: 'Consider a short break in the next 10 minutes.',
      };
      this.vikaraCooldown = now + 600000; // 10 min cooldown for warnings
    }

    if (alert) {
      this.vikaraAlerts.push(alert);
      if (this.vikaraAlerts.length > 50) this.vikaraAlerts.shift();
      
      console.log(`[StateSynchronizer] Vikara alert: ${alert.level} - ${alert.message}`);
      this.emit('vikaraAlert', alert);
    }
  }

  /**
   * Calculate fractal cycles
   */
  private calculateCycles(temporal: NoesisTemporalState): KalachakraState['cycles'] {
    const timestamp = new Date(temporal.timestamp);
    const hour = timestamp.getHours();
    const day = timestamp.getDay();
    
    return {
      moment: {
        yuga: this.calculateYuga(temporal),
        progress: temporal.khaloree / 100,
      },
      session: {
        yuga: this.calculateYuga(temporal),
        heroPhase: this.calculateHeroPhase(temporal).number,
        progress: temporal.cliffordOctave / 8,
      },
      day: {
        tarot: this.getTarotOfTheDay().number,
        heroPhase: ((hour % 12) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
        progress: hour / 24,
      },
      week: {
        heroPhase: ((day % 12) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
        progress: day / 7,
      },
      moon: {
        phase: temporal.moonPhase || 'unknown',
        progress: (temporal.dayOfMoonCycle || 0) / 29.5,
      },
      quarter: {
        heroPhase: 1,
        progress: 0,
      },
    };
  }

  /**
   * Get Tarot card of the day
   */
  private getTarotOfTheDay(): KalachakraState['tarotOfTheDay'] {
    // Fallback tarot - in real implementation, this would be calculated
    // from date + personal seed
    return {
      number: 0,
      name: 'The Fool',
      keywords: ['beginnings', 'innocence', 'spontaneity', 'free spirit'],
      meaning: {
        upright: 'New beginnings, innocence, spontaneity, a free spirit',
        reversed: 'Recklessness, risk-taking, second-guessing',
        shadow: 'Naivety, foolishness, lack of direction',
      },
      kosha: 'annamaya',
      element: 'air',
    };
  }

  /**
   * Generate sankalpa based on yuga and vayu
   */
  private generateSankalpa(yuga: Yuga, vayu: Vayu): string {
    const sankalpas: Record<Yuga, Record<Vayu, string>> = {
      krita: {
        prana: 'I channel pure creative energy into manifestation.',
        vyana: 'I distribute my gifts widely and generously.',
        udana: 'I express truth with clarity and power.',
        samana: 'I integrate all aspects into perfect balance.',
        apana: 'I complete what must be completed with grace.',
      },
      treta: {
        prana: 'I maintain steady inspiration through discipline.',
        vyana: 'I transform gradually, building lasting change.',
        udana: 'I speak with measured wisdom.',
        samana: 'I digest experience into understanding.',
        apana: 'I release what no longer serves with patience.',
      },
      dvapara: {
        prana: 'I accept limited energy and work within it.',
        vyana: 'I simplify and consolidate my efforts.',
        udana: 'I minimize communication and maximize listening.',
        samana: 'I focus on one thing at a time.',
        apana: 'I rest to prepare for renewal.',
      },
      kali: {
        prana: 'I surrender to the cycle of rest.',
        vyana: 'I allow all systems to pause and restore.',
        udana: 'I am silent and receive.',
        samana: 'I let go of all effort.',
        apana: 'I descend into deep restoration.',
      },
    };

    return sankalpas[yuga][vayu];
  }

  // Helper methods for hero phase
  private getSanskritPhaseName(phase: number): string {
    const names = [
      'Ādikāla',      // Ordinary World
      'Āhvāna',       // Call to Adventure
      'Pratiṣedha',   // Refusal
      'Guru',         // Meeting Mentor
      'Pāraṅgama',    // Crossing Threshold
      'Parīkṣā',      // Tests & Allies
      'Gārhapatya',   // Approach Cave
      'Saṃgharṣa',    // The Ordeal
      'Phala',        // The Reward
      'Nivṛtti',      // The Road Back
      'Punarbhava',   // Resurrection
      'Amṛta',        // Return with Elixir
    ];
    return names[phase - 1] || 'Unknown';
  }

  private getPhaseDescription(phase: number): string {
    const descriptions: Record<number, string> = {
      1: 'The starting point, the familiar world before the journey begins.',
      2: 'The catalyst that disrupts the ordinary world and calls to action.',
      3: 'The hesitation, fear, and resistance to leaving the known.',
      4: 'The guide who provides wisdom, tools, and encouragement.',
      5: 'The decisive moment of commitment to the journey.',
      6: 'The challenges that test and the allies who support.',
      7: 'The approach to the central conflict and darkest moment.',
      8: 'The ultimate test, the death and rebirth at the story\'s core.',
      9: 'The achievement, the treasure won through ordeal.',
      10: 'The return journey, integrating the transformation.',
      11: 'The final test, proving the transformation is complete.',
      12: 'The return with gifts to share, the journey\'s completion.',
    };
    return descriptions[phase] || '';
  }

  private getPhaseTasks(phase: number): string[] {
    const tasks: Record<number, string[]> = {
      1: ['Assess current state', 'Gather resources', 'Establish baseline'],
      2: ['Recognize opportunity', 'Feel the call', 'Acknowledge restlessness'],
      3: ['Examine fears', 'List excuses', 'Question the call'],
      4: ['Seek guidance', 'Study examples', 'Find a mentor'],
      5: ['Make commitment', 'Cross the line', 'Leave comfort zone'],
      6: ['Face small challenges', 'Build alliances', 'Learn skills'],
      7: ['Prepare for ordeal', 'Gather courage', 'Approach the threshold'],
      8: ['Face the fear', 'Endure the test', 'Transform through struggle'],
      9: ['Claim the reward', 'Celebrate victory', 'Acknowledge growth'],
      10: ['Begin return', 'Integrate lessons', 'Prepare to share'],
      11: ['Final challenge', 'Prove transformation', 'Demonstrate mastery'],
      12: ['Share the elixir', 'Complete the circle', 'Begin next cycle'],
    };
    return tasks[phase] || [];
  }

  private getPhaseSankalpa(phase: number): string {
    const sankalpas: Record<number, string> = {
      1: 'I am present in the ordinary world, aware and ready.',
      2: 'I hear the call and acknowledge its truth.',
      3: 'I examine my resistance with compassion.',
      4: 'I am open to guidance and wisdom.',
      5: 'I commit fully to this journey.',
      6: 'I grow stronger through every challenge.',
      7: 'I approach the unknown with courage.',
      8: 'I surrender to transformation.',
      9: 'I receive the gifts of my ordeal.',
      10: 'I carry my transformation home.',
      11: 'I embody the change I have undergone.',
      12: 'I share my gifts to benefit all beings.',
    };
    return sankalpas[phase] || '';
  }

  private getPhaseIndicator(phase: number, stage: 'starting' | 'middle' | 'completing'): string {
    const indicators: Record<number, Record<string, string>> = {
      1: { starting: 'Unaware', middle: 'Curious', completing: 'Restless' },
      2: { starting: 'Distracted', middle: 'Intrigued', completing: 'Called' },
      3: { starting: 'Hesitant', middle: 'Conflicted', completing: 'Decided' },
      4: { starting: 'Seeking', middle: 'Learning', completing: 'Equipped' },
      5: { starting: 'Uncertain', middle: 'Committed', completing: 'Crossed' },
      6: { starting: 'Tested', middle: 'Struggling', completing: 'Proven' },
      7: { starting: 'Apprehensive', middle: 'Focused', completing: 'Ready' },
      8: { starting: 'Challenged', middle: 'Suffering', completing: 'Transformed' },
      9: { starting: 'Victorious', middle: 'Receiving', completing: 'Enriched' },
      10: { starting: 'Homeward', middle: 'Integrating', completing: 'Arrived' },
      11: { starting: 'Tested again', middle: 'Proving', completing: 'Mastery' },
      12: { starting: 'Sharing', middle: 'Teaching', completing: 'Complete' },
    };
    return indicators[phase]?.[stage] || '';
  }

  // Public API
  getCurrentState(): KalachakraState | null {
    return this.currentState;
  }

  getPreviousState(): KalachakraState | null {
    return this.previousState;
  }

  getStatus(): SyncStatus {
    return this.status;
  }

  getYugaTransitionHistory(): YugaTransitionEvent[] {
    return [...this.yugaTransitionHistory];
  }

  getVikaraAlerts(): VikaraAlert[] {
    return [...this.vikaraAlerts];
  }

  updateConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart if interval changed
    if (config.pollInterval && this.syncInterval) {
      this.stop();
      this.start();
    }
  }
}

// Singleton instance
let sharedSynchronizer: StateSynchronizer | null = null;

export function getStateSynchronizer(
  client?: NoesisClient,
  config?: Partial<SyncConfig>
): StateSynchronizer {
  if (!sharedSynchronizer) {
    sharedSynchronizer = new StateSynchronizer(client, config);
  }
  return sharedSynchronizer;
}

export function resetStateSynchronizer(): void {
  sharedSynchronizer = null;
}

export default StateSynchronizer;
