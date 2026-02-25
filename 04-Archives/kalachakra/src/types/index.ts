/**
 * Kalachakra - The Fractal Time Calendar
 * Core Type Definitions
 */

// ============================================================================
// KOSHAS - The Five Sheaths of Being
// ============================================================================

export type Kosha = 
  | 'annamaya'    // Physical - food body
  | 'pranamaya'   // Energy - breath/prana
  | 'manomaya'    // Mental - mind/emotions
  | 'vijnanamaya' // Wisdom - intellect/discernment
  | 'anandamaya'  // Bliss - joy/connection
  | 'all';        // All koshas aligned

export interface KoshaState {
  name: Kosha;
  sanskrit: string;
  meaning: string;
  color: string;
  element: string;
  active: boolean;
}

// ============================================================================
// TAROT - Major Arcana
// ============================================================================

export type TarotCard = {
  number: number;
  name: string;
  sanskritName?: string;
  keywords: string[];
  meaning: {
    upright: string;
    reversed: string;
    shadow: string;
  };
  kosha: Kosha;
  element: string;
  planet?: string;
  zodiac?: string;
  dayOfWeek?: number; // 0 = Sunday
};

export type TarotDraw = {
  card: TarotCard;
  orientation: 'upright' | 'reversed';
  timestamp: string;
  seed: number;
  meaningForContext: string;
};

// ============================================================================
// HERO'S JOURNEY - The 12 Phases
// ============================================================================

export type HeroPhaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface HeroPhase {
  number: HeroPhaseNumber;
  name: string;
  sanskritName: string;
  tarotCard: number; // Major Arcana number
  kosha: Kosha;
  description: string;
  tasks: string[];
  sankalpa: string; // Intention/mantra for this phase
  progressIndicators: {
    starting: string;
    middle: string;
    completing: string;
  };
}

// ============================================================================
// YUGAS - The Four Ages
// ============================================================================

export type Yuga = 'krita' | 'treta' | 'dvapara' | 'kali';

export interface YugaState {
  name: Yuga;
  sanskritName: string;
  color: string;
  duration: { min: number; max: number }; // minutes
  characteristics: string[];
  tarotCards: number[];
  kosha: Kosha;
  exitSignals: string[];
  resetActions: string[];
}

// ============================================================================
// NOESIS INTEGRATION - Temporal State from CLI
// ============================================================================

export interface NoesisTemporalState {
  timestamp: string;
  cliffordOctave: number;      // 0-7 (position in 8-hour cycle)
  khaloree: number;            // 0-100 (metabolic reserve)
  vikara: number;              // 0-100 (pattern drift)
  vayu: Vayu;
  moonPhase?: string;
  dayOfMoonCycle?: number;
}

export type Vayu = 'prana' | 'vyana' | 'udana' | 'samana' | 'apana';

export interface VayuState {
  name: Vayu;
  direction: string;
  domain: string;
  quality: string;
  associatedKosha: Kosha;
}

// ============================================================================
// FRACTAL TIME - Nested Cycles
// ============================================================================

export type CycleLevel = 
  | 'moment' 
  | 'session' 
  | 'day' 
  | 'week' 
  | 'moon' 
  | 'quarter' 
  | 'year';

export interface FractalCycle {
  level: CycleLevel;
  currentPhase: HeroPhaseNumber | Yuga;
  progress: number; // 0-1
  parent?: CycleLevel;
  children?: CycleLevel[];
}

export interface NestedCycles {
  moment: { yuga: Yuga; progress: number };
  session: { yuga: Yuga; heroPhase: HeroPhaseNumber; progress: number };
  day: { tarot: number; heroPhase: HeroPhaseNumber; progress: number };
  week: { heroPhase: HeroPhaseNumber; progress: number };
  moon: { phase: string; progress: number };
  quarter: { heroPhase: HeroPhaseNumber; progress: number };
}

// ============================================================================
// TASKS - Work Items with Mythic Mapping
// ============================================================================

export interface Task {
  id: string;
  name: string;
  description?: string;
  
  // Linear
  createdAt: string;
  estimatedDuration: number; // minutes
  deadline?: string;
  completedAt?: string;
  
  // Cyclical/Fractal
  heroPhase: HeroPhaseNumber;
  yuga: Yuga;
  kosha: Kosha;
  
  // Task management
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  
  // Micro journey within task
  microJourney: {
    ordinaryWorld: string;
    call: string;
    threshold: string;
    ordeal: string;
    reward: string;
  };
  
  // Tarot guidance
  drawnCard?: TarotDraw;
  
  // State
  status: 'pending' | 'active' | 'paused' | 'completed' | 'abandoned' | 'in-progress';
  progress: number; // 0-1
}

// ============================================================================
// KALACHAKRA STATE - Complete System State
// ============================================================================

export interface KalachakraState {
  timestamp: string;
  version: string;
  
  // From Noesis
  noesis: NoesisTemporalState | null;
  
  // Computed temporal state
  tarotOfTheDay: TarotCard;
  heroPhase: HeroPhase;
  yugaOfTheMoment: YugaState;
  currentVayu: VayuState;
  
  // Fractal cycles
  cycles: NestedCycles;
  
  // Current work
  activeTask?: Task;
  sankalpa: string;
  
  // History
  recentDraws: TarotDraw[];
  completedTasks: Task[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const HERO_PHASES = [
  { number: 1, name: 'ORDINARY WORLD', tarot: 'The Fool', kosha: 'annamaya' as Kosha },
  { number: 2, name: 'CALL TO ADVENTURE', tarot: 'The Magician', kosha: 'pranamaya' as Kosha },
  { number: 3, name: 'REFUSAL OF CALL', tarot: 'The Hanged Man', kosha: 'manomaya' as Kosha },
  { number: 4, name: 'MEETING THE MENTOR', tarot: 'The Hierophant', kosha: 'vijnanamaya' as Kosha },
  { number: 5, name: 'CROSSING THRESHOLD', tarot: 'The Chariot', kosha: 'pranamaya' as Kosha },
  { number: 6, name: 'TESTS & ALLIES', tarot: 'Strength', kosha: 'pranamaya' as Kosha },
  { number: 7, name: 'APPROACH CAVE', tarot: 'The Tower', kosha: 'manomaya' as Kosha },
  { number: 8, name: 'THE ORDEAL', tarot: 'Death', kosha: 'manomaya' as Kosha },
  { number: 9, name: 'THE REWARD', tarot: 'The Sun', kosha: 'anandamaya' as Kosha },
  { number: 10, name: 'THE ROAD BACK', tarot: 'The World', kosha: 'annamaya' as Kosha },
  { number: 11, name: 'RESURRECTION', tarot: 'Judgement', kosha: 'vijnanamaya' as Kosha },
  { number: 12, name: 'RETURN WITH ELIXIR', tarot: 'The Star', kosha: 'anandamaya' as Kosha },
] as const;

export const KOSHA_COLORS: Record<Kosha, string> = {
  annamaya: '#FF6B6B',
  pranamaya: '#00D9C0',
  manomaya: '#9B59B6',
  vijnanamaya: '#3498DB',
  anandamaya: '#F39C12',
  all: '#FFFFFF',
};

export const YUGA_DATA: Record<Yuga, { name: string; color: string; metal: string; description: string; recommendation: string }> = {
  krita: {
    name: 'Krita Yuga',
    color: '#FFD700',
    metal: 'Gold',
    description: 'The Golden Age — Flow state, effortless creation',
    recommendation: 'Create! This is your peak window. Tackle the hardest problems.',
  },
  treta: {
    name: 'Treta Yuga',
    color: '#C0C0C0',
    metal: 'Silver',
    description: 'The Silver Age — Solid progress with some friction',
    recommendation: 'Build steadily. Good time for feature development.',
  },
  dvapara: {
    name: 'Dvapara Yuga',
    color: '#CD7F32',
    metal: 'Bronze',
    description: 'The Bronze Age — The grind, forcing through resistance',
    recommendation: 'Switch to lighter tasks. Take breaks. Consider pairing.',
  },
  kali: {
    name: 'Kali Yuga',
    color: '#4A5568',
    metal: 'Iron',
    description: 'The Iron Age — Collapse, negative returns',
    recommendation: 'STOP. Rest, breathe, move. Return after recovery.',
  },
};
// ============================================================================

export interface NowResponse {
  timestamp: string;
  tarot: TarotCard;
  heroPhase: HeroPhase;
  yuga: YugaState;
  noesis: NoesisTemporalState | null;
  sankalpa: string;
}

export interface CardDrawRequest {
  context?: string;
  taskId?: string;
  intentionalSeed?: number;
}

export interface CardDrawResponse {
  draw: TarotDraw;
  guidance: string;
  koshaEmphasis: Kosha;
  suggestedAction: string;
}

export interface TaskCompleteRequest {
  taskId: string;
  reflection?: string;
  energyLevel: number; // 0-100
  satisfaction: number; // 0-100
}

export interface TaskCompleteResponse {
  task: Task;
  nextPhaseSuggestion: HeroPhase;
  lesson: string;
  elixir: string; // What was gained
}
