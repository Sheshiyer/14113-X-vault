/**
 * DashboardTasks.ts
 * 
 * All 48 Kalachakra dashboard tasks mapped through Hero's Journey + Tarot framework.
 * Each task is a micro-hero's journey within the greater journey.
 * 
 * Hero's Journey Phases (12):
 * 1. Ordinary World      7. Approach to Inmost Cave
 * 2. Call to Adventure   8. Ordeal
 * 3. Refusal             9. Reward
 * 4. Meeting Mentor     10. The Road Back
 * 5. Crossing Threshold 11. Resurrection
 * 6. Tests/Allies/Enemies 12. Return with Elixir
 * 
 * 5 Koshas + Noesis = 6 Layers × 8 Tasks = 48 Tasks
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type HeroPhase = 
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Kosha = 
  | 'annamaya'      // Physical layer - UI/Foundation
  | 'pranamaya'     // Energy layer - Data/State
  | 'manomaya'      // Mental layer - Logic/Processing
  | 'vijnanamaya'   // Wisdom layer - AI/Insights
  | 'anandamaya'    // Bliss layer - Experience/UX
  | 'noesis';       // Integration layer - Synthesis

export type Vayu = 
  | 'prana'      // Inward moving - planning, design
  | 'apana'      // Downward moving - implementation, grounding
  | 'samana'     // Equalizing - testing, balancing
  | 'udana'      // Upward moving - deployment, elevation
  | 'vyana'      // Diffusing - integration, distribution
  | 'kurma'      // Blinking - pausing, reviewing
  | 'krkara'     // Hunger/thirst - refactoring, hunger for quality
  | 'devadatta'  // Yawning - debugging, clearing
  | 'dhananjaya' // Opening/closing - final polish, completion
  | 'naga'       // Burping - error handling, release
  | 'kumar'      // Child state - experimentation
  | 'mukhya';    // Primary - core architecture

export interface MicroJourney {
  ordinaryWorld: string;  // Current state before task
  call: string;          // What triggers the task
  threshold: string;     // The challenge/commitment
  ordeal: string;        // The difficult part
  reward: string;        // Completion benefit
}

export interface NoesisIntegration {
  optimalVayu: Vayu;           // Best energy state for this task
  minKhaloree: number;         // Minimum focus energy required (0-100)
  driftTriggers: string[];     // What causes vikara (drift)
  recoveryStrategy: string;    // How to return to vayu
}

export interface TaskDependency {
  taskId: string;
  type: 'hard' | 'soft';  // Hard = must complete, Soft = recommended
  reason: string;
}

export interface TarotMapping {
  card: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  meaning: string;
  taskRelevance: string;
  reversedWarning?: string;
}

export interface KalachakraTask {
  id: string;
  name: string;
  heroPhase: HeroPhase;
  tarot: TarotMapping;
  kosha: Kosha;
  estimatedYuga: number;       // Estimated hours in kalpa time
  microJourney: MicroJourney;
  dependencies: TaskDependency[];
  noesis: NoesisIntegration;
  agent: string;               // Which of 6 agents owns this
  acceptanceCriteria: string[];
  deliverables: string[];
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'blocked';
  completedAt?: Date;
  sankalpaId?: string;         // Link to intention log
}

// ============================================================================
// HERO'S JOURNEY PHASE MAPPING (48 tasks ÷ 12 phases = 4 tasks per phase)
// ============================================================================

const PHASE_NAMES: Record<HeroPhase, string> = {
  1: 'Ordinary World',
  2: 'Call to Adventure',
  3: 'Refusal of the Call',
  4: 'Meeting the Mentor',
  5: 'Crossing the First Threshold',
  6: 'Tests, Allies, Enemies',
  7: 'Approach to the Inmost Cave',
  8: 'The Ordeal',
  9: 'The Reward',
  10: 'The Road Back',
  11: 'The Resurrection',
  12: 'Return with the Elixir'
};

// ============================================================================
// TAROT CARD ASSIGNMENTS (Major Arcana for milestones, Minor for tasks)
// ============================================================================

const TAROT_DECK: Record<number, TarotMapping> = {
  // Phase 1: Ordinary World - The Fool's beginning
  0:  { card: 'The Fool', arcana: 'major', meaning: 'New beginnings, innocence', taskRelevance: 'Starting fresh with beginner\'s mind' },
  1:  { card: 'The Magician', arcana: 'major', meaning: 'Manifestation, resourcefulness', taskRelevance: 'Having all tools needed' },
  2:  { card: 'The High Priestess', arcana: 'major', meaning: 'Intuition, subconscious', taskRelevance: 'Trusting inner knowing' },
  3:  { card: 'The Empress', arcana: 'major', meaning: 'Abundance, nurturing', taskRelevance: 'Creating fertile ground' },
  
  // Phase 2: Call to Adventure
  4:  { card: 'The Emperor', arcana: 'major', meaning: 'Authority, structure', taskRelevance: 'Establishing foundation' },
  5:  { card: 'The Hierophant', arcana: 'major', meaning: 'Tradition, guidance', taskRelevance: 'Following established patterns' },
  6:  { card: 'The Lovers', arcana: 'major', meaning: 'Choice, union', taskRelevance: 'Making key decisions' },
  7:  { card: 'The Chariot', arcana: 'major', meaning: 'Willpower, determination', taskRelevance: 'Pushing forward' },
  
  // Phase 3: Refusal  
  8:  { card: 'Strength', arcana: 'major', meaning: 'Courage, patience', taskRelevance: 'Inner strength to continue' },
  9:  { card: 'The Hermit', arcana: 'major', meaning: 'Soul-searching, solitude', taskRelevance: 'Retreating to find answers' },
  10: { card: 'Wheel of Fortune', arcana: 'major', meaning: 'Cycles, change', taskRelevance: 'Accepting ups and downs' },
  11: { card: 'Justice', arcana: 'major', meaning: 'Balance, truth', taskRelevance: 'Weighing options fairly' },
  
  // Phase 4: Meeting Mentor
  12: { card: 'The Hanged Man', arcana: 'major', meaning: 'Surrender, perspective', taskRelevance: 'Seeing things differently' },
  13: { card: 'Death', arcana: 'major', meaning: 'Transformation, endings', taskRelevance: 'Letting go of old ways' },
  14: { card: 'Temperance', arcana: 'major', meaning: 'Balance, moderation', taskRelevance: 'Finding middle path' },
  15: { card: 'The Devil', arcana: 'major', meaning: 'Shadow, attachment', taskRelevance: 'Facing limitations' },
  
  // Phase 5: Crossing Threshold
  16: { card: 'The Tower', arcana: 'major', meaning: 'Sudden change, awakening', taskRelevance: 'Breaking through barriers' },
  17: { card: 'The Star', arcana: 'major', meaning: 'Hope, inspiration', taskRelevance: 'Following the light' },
  18: { card: 'The Moon', arcana: 'major', meaning: 'Illusion, intuition', taskRelevance: 'Navigating uncertainty' },
  19: { card: 'The Sun', arcana: 'major', meaning: 'Joy, success', taskRelevance: 'Clarity and warmth' },
  
  // Phase 6: Tests, Allies, Enemies
  20: { card: 'Judgement', arcana: 'major', meaning: 'Rebirth, evaluation', taskRelevance: 'Assessing progress' },
  21: { card: 'The World', arcana: 'major', meaning: 'Completion, integration', taskRelevance: 'Bringing it together' },
  22: { card: 'Ace of Wands', arcana: 'minor', suit: 'wands', meaning: 'Creation, inspiration', taskRelevance: 'New creative spark' },
  23: { card: 'Two of Wands', arcana: 'minor', suit: 'wands', meaning: 'Planning, decisions', taskRelevance: 'Mapping the path' },
  
  // Phase 7: Approach to Inmost Cave
  24: { card: 'Three of Wands', arcana: 'minor', suit: 'wands', meaning: 'Expansion, foresight', taskRelevance: 'Looking ahead' },
  25: { card: 'Four of Wands', arcana: 'minor', suit: 'wands', meaning: 'Celebration, harmony', taskRelevance: 'Milestone achieved' },
  26: { card: 'Five of Wands', arcana: 'minor', suit: 'wands', meaning: 'Conflict, competition', taskRelevance: 'Working through friction' },
  27: { card: 'Six of Wands', arcana: 'minor', suit: 'wands', meaning: 'Victory, recognition', taskRelevance: 'Small wins matter' },
  
  // Phase 8: The Ordeal
  28: { card: 'Seven of Wands', arcana: 'minor', suit: 'wands', meaning: 'Defense, perseverance', taskRelevance: 'Standing ground' },
  29: { card: 'Eight of Wands', arcana: 'minor', suit: 'wands', meaning: 'Speed, movement', taskRelevance: 'Rapid progress' },
  30: { card: 'Nine of Wands', arcana: 'minor', suit: 'wands', meaning: 'Resilience, stamina', taskRelevance: 'Almost there' },
  31: { card: 'Ten of Wands', arcana: 'minor', suit: 'wands', meaning: 'Burden, responsibility', taskRelevance: 'Carrying the load' },
  
  // Phase 9: The Reward
  32: { card: 'Page of Wands', arcana: 'minor', suit: 'wands', meaning: 'Exploration, discovery', taskRelevance: 'New territory' },
  33: { card: 'Knight of Wands', arcana: 'minor', suit: 'wands', meaning: 'Action, adventure', taskRelevance: 'Bold moves' },
  34: { card: 'Queen of Wands', arcana: 'minor', suit: 'wands', meaning: 'Confidence, determination', taskRelevance: 'Leading with passion' },
  35: { card: 'King of Wands', arcana: 'minor', suit: 'wands', meaning: 'Vision, leadership', taskRelevance: 'Inspiring others' },
  
  // Phase 10: The Road Back
  36: { card: 'Ace of Cups', arcana: 'minor', suit: 'cups', meaning: 'Love, new feelings', taskRelevance: 'Emotional renewal' },
  37: { card: 'Two of Cups', arcana: 'minor', suit: 'cups', meaning: 'Partnership, unity', taskRelevance: 'Collaboration' },
  38: { card: 'Three of Cups', arcana: 'minor', suit: 'cups', meaning: 'Celebration, community', taskRelevance: 'Sharing success' },
  39: { card: 'Four of Cups', arcana: 'minor', suit: 'cups', meaning: 'Contemplation, apathy', taskRelevance: 'Avoiding complacency' },
  
  // Phase 11: The Resurrection
  40: { card: 'Five of Cups', arcana: 'minor', suit: 'cups', meaning: 'Loss, grief', taskRelevance: 'Learning from failure' },
  41: { card: 'Six of Cups', arcana: 'minor', suit: 'cups', meaning: 'Nostalgia, innocence', taskRelevance: 'Remembering why' },
  42: { card: 'Seven of Cups', arcana: 'minor', suit: 'cups', meaning: 'Choices, dreams', taskRelevance: 'Many possibilities' },
  43: { card: 'Eight of Cups', arcana: 'minor', suit: 'cups', meaning: 'Walking away', taskRelevance: 'Leaving behind' },
  
  // Phase 12: Return with Elixir
  44: { card: 'Nine of Cups', arcana: 'minor', suit: 'cups', meaning: 'Satisfaction, wishes', taskRelevance: 'Contentment' },
  45: { card: 'Ten of Cups', arcana: 'minor', suit: 'cups', meaning: 'Fulfillment, joy', taskRelevance: 'Complete happiness' },
  46: { card: 'Page of Cups', arcana: 'minor', suit: 'cups', meaning: 'Creativity, intuition', taskRelevance: 'New inspiration' },
  47: { card: 'Knight of Cups', arcana: 'minor', suit: 'cups', meaning: 'Romance, charm', taskRelevance: 'Following heart' }
};

// ============================================================================
// THE 48 KALACHAKRA TASKS
// ============================================================================

export const DASHBOARD_TASKS: KalachakraTask[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // LAYER 1: ANNAMAYA (Physical) - UI Components & Foundation
  // Agent: Annamaya - Builder of forms, structures, containers
  // ═══════════════════════════════════════════════════════════════════════
  
  // Phase 1: Ordinary World
  {
    id: 'ANN-001',
    name: 'Design System Foundation',
    heroPhase: 1,
    tarot: TAROT_DECK[0],
    kosha: 'annamaya',
    estimatedYuga: 4,
    microJourney: {
      ordinaryWorld: 'Scattered UI components, inconsistent styles',
      call: 'Need for visual coherence across dashboard',
      threshold: 'Commit to a design language',
      ordeal: 'Choosing between flexibility and consistency',
      reward: 'Living style guide that breeds confidence'
    },
    dependencies: [],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 60,
      driftTriggers: ['perfectionism', 'option paralysis'],
      recoveryStrategy: 'Set timer for 30min decisions, embrace "good enough"'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      'Color palette defined with semantic tokens',
      'Typography scale established',
      'Spacing system (4px grid) implemented',
      'Component naming convention documented'
    ],
    deliverables: ['design-tokens.json', 'style-guide.md'],
    status: 'available'
  },
  {
    id: 'ANN-002', 
    name: 'Layout Grid Architecture',
    heroPhase: 1,
    tarot: TAROT_DECK[1],
    kosha: 'annamaya',
    estimatedYuga: 3,
    microJourney: {
      ordinaryWorld: 'Ad-hoc layouts breaking on different screens',
      call: 'Responsive design is non-negotiable',
      threshold: 'Define breakpoint strategy',
      ordeal: 'Balancing flexibility with structure',
      reward: 'Layouts that breathe on any device'
    },
    dependencies: [{ taskId: 'ANN-001', type: 'hard', reason: 'Needs spacing tokens' }],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 50,
      driftTriggers: ['over-engineering', 'edge case obsession'],
      recoveryStrategy: 'Test on 3 real devices only, move on'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      '12-column grid system implemented',
      'Breakpoints: mobile, tablet, desktop, wide',
      'Container queries for component-level responsiveness',
      'CSS Grid + Flexbox hybrid approach'
    ],
    deliverables: ['grid-system.css', 'layout-examples.tsx'],
    status: 'locked'
  },
  {
    id: 'ANN-003',
    name: 'Navigation Shell',
    heroPhase: 1,
    tarot: TAROT_DECK[2],
    kosha: 'annamaya',
    estimatedYuga: 5,
    microJourney: {
      ordinaryWorld: 'Users lost in the interface, no clear wayfinding',
      call: 'Intuitive navigation is the skeleton',
      threshold: 'Information architecture decisions',
      ordeal: 'Too many vs too few navigation items',
      reward: 'Invisible navigation - users always know where they are'
    },
    dependencies: [{ taskId: 'ANN-002', type: 'hard', reason: 'Needs layout structure' }],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 65,
      driftTriggers: ['feature creep in nav', 'hierarchy debates'],
      recoveryStrategy: 'Card sort with 3 users, decide in 1 session'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      'Primary navigation with collapsible sections',
      'Breadcrumb integration',
      'Mobile hamburger menu with gesture support',
      'Keyboard navigation (a11y)'
    ],
    deliverables: ['Navigation.tsx', 'NavItem.tsx', 'MobileNav.tsx'],
    status: 'locked'
  },
  {
    id: 'ANN-004',
    name: 'Card Component Library',
    heroPhase: 1,
    tarot: TAROT_DECK[3],
    kosha: 'annamaya',
    estimatedYuga: 6,
    microJourney: {
      ordinaryWorld: 'Inconsistent content containers everywhere',
      call: 'Cards are the primary content vessel',
      threshold: 'Flexible but consistent card API',
      ordeal: 'Balancing customization with consistency',
      reward: 'Card system that handles 90% of use cases'
    },
    dependencies: [{ taskId: 'ANN-001', type: 'hard', reason: 'Needs tokens' }],
    noesis: {
      optimalVayu: 'apana',
      minKhaloree: 55,
      driftTriggers: ['prop explosion', 'variant hell'],
      recoveryStrategy: 'Composition pattern: slots over props'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      'Base Card with header, content, footer slots',
      'Variants: default, outlined, elevated',
      'Loading skeleton state',
      'Hover/focus states defined'
    ],
    deliverables: ['Card.tsx', 'CardHeader.tsx', 'CardFooter.tsx'],
    status: 'locked'
  },
  
  // Phase 2: Call to Adventure
  {
    id: 'ANN-005',
    name: 'Button & Action System',
    heroPhase: 2,
    tarot: TAROT_DECK[4],
    kosha: 'annamaya',
    estimatedYuga: 4,
    microJourney: {
      ordinaryWorld: 'Buttons look different everywhere',
      call: 'Actions are the primary user interaction',
      threshold: 'Unified button taxonomy',
      ordeal: 'Visual hierarchy vs accessibility contrast',
      reward: 'Buttons that guide user action intuitively'
    },
    dependencies: [{ taskId: 'ANN-001', type: 'hard', reason: 'Needs color tokens' }],
    noesis: {
      optimalVayu: 'apana',
      minKhaloree: 50,
      driftTriggers: ['animation obsession', 'size proliferation'],
      recoveryStrategy: '3 sizes, 3 variants, 3 colors max'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      'Button variants: primary, secondary, tertiary, danger',
      'Sizes: sm, md, lg',
      'Loading state with spinner',
      'Icon + text combinations'
    ],
    deliverables: ['Button.tsx', 'IconButton.tsx', 'ButtonGroup.tsx'],
    status: 'locked'
  },
  {
    id: 'ANN-006',
    name: 'Form Input Foundation',
    heroPhase: 2,
    tarot: TAROT_DECK[5],
    kosha: 'annamaya',
    estimatedYuga: 6,
    microJourney: {
      ordinaryWorld: 'Forms are painful, validation is afterthought',
      call: 'Input is where user meets system',
      threshold: 'Unified form component architecture',
      ordeal: 'Flexibility vs built-in validation complexity',
      reward: 'Forms that feel like conversation'
    },
    dependencies: [{ taskId: 'ANN-001', type: 'hard', reason: 'Needs design tokens' }],
    noesis: {
      optimalVayu: 'apana',
      minKhaloree: 60,
      driftTriggers: ['validation rabbit hole', 'mask complexity'],
      recoveryStrategy: 'Start with uncontrolled, add validation layer separately'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      'Input, Select, Textarea, Checkbox, Radio base components',
      'Label + helper text + error message pattern',
      'Focus ring accessibility',
      'Form context for state management'
    ],
    deliverables: ['Input.tsx', 'Select.tsx', 'FormField.tsx', 'useFormContext.ts'],
    status: 'locked'
  },
  {
    id: 'ANN-007',
    name: 'Data Table Architecture',
    heroPhase: 2,
    tarot: TAROT_DECK[6],
    kosha: 'annamaya',
    estimatedYuga: 8,
    microJourney: {
      ordinaryWorld: 'Tables are slow, ugly, and hard to use',
      call: 'Data density requires powerful table UI',
      threshold: 'Complex table features vs performance',
      ordeal: 'Virtualization, sorting, filtering intersection',
      reward: 'Tables that handle 10k rows smoothly'
    },
    dependencies: [{ taskId: 'ANN-004', type: 'soft', reason: 'May use Card styling' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 70,
      driftTriggers: ['feature overwhelm', 'premature optimization'],
      recoveryStrategy: 'Start simple, add features as needed'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      'Virtualized scrolling for large datasets',
      'Sortable columns with indicators',
      'Row selection (single/multi)',
      'Expandable row details'
    ],
    deliverables: ['DataTable.tsx', 'useVirtualization.ts', 'TablePagination.tsx'],
    status: 'locked'
  },
  {
    id: 'ANN-008',
    name: 'Modal & Overlay System',
    heroPhase: 2,
    tarot: TAROT_DECK[7],
    kosha: 'annamaya',
    estimatedYuga: 5,
    microJourney: {
      ordinaryWorld: 'Modals stack incorrectly, focus traps broken',
      call: 'Overlays need orchestration layer',
      threshold: 'Z-index management and focus control',
      ordeal: 'Nested modals, drawer vs modal decisions',
      reward: 'Overlay system that just works'
    },
    dependencies: [{ taskId: 'ANN-005', type: 'soft', reason: 'May contain buttons' }],
    noesis: {
      optimalVayu: 'apana',
      minKhaloree: 60,
      driftTriggers: ['z-index wars', 'animation complexity'],
      recoveryStrategy: 'Portal-based, single source of truth for overlays'
    },
    agent: 'Annamaya',
    acceptanceCriteria: [
      'Modal, Drawer, Dialog components',
      'Focus trap and escape key handling',
      'Stack management for nested overlays',
      'Backdrop blur + click-outside close'
    ],
    deliverables: ['Modal.tsx', 'Drawer.tsx', 'OverlayContext.tsx'],
    status: 'locked'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // LAYER 2: PRANAMAYA (Energy) - State Management & Data Flow
  // Agent: Pranamaya - Keeper of currents, flows, and rhythms
  // ═══════════════════════════════════════════════════════════════════════
  
  // Phase 3: Refusal
  {
    id: 'PRN-001',
    name: 'Global State Architecture',
    heroPhase: 3,
    tarot: TAROT_DECK[8],
    kosha: 'pranamaya',
    estimatedYuga: 6,
    microJourney: {
      ordinaryWorld: 'Props drilling, state scattered everywhere',
      call: 'Unified state management needed',
      threshold: 'Choosing state strategy (Zustand/Redux/Context)',
      ordeal: 'Over-engineering vs under-engineering',
      reward: 'State flows like breath through the app'
    },
    dependencies: [],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 75,
      driftTriggers: ['store granularity debates', ' premature splitting'],
      recoveryStrategy: 'Start with one store, split by domain when pain arises'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'State store with slices pattern',
      'DevTools integration',
      'Persist middleware for localStorage',
      'Derived state with selectors'
    ],
    deliverables: ['store.ts', 'slices/', 'middleware/'],
    status: 'locked'
  },
  {
    id: 'PRN-002',
    name: 'Server State Layer',
    heroPhase: 3,
    tarot: TAROT_DECK[9],
    kosha: 'pranamaya',
    estimatedYuga: 8,
    microJourney: {
      ordinaryWorld: 'API calls scattered, caching inconsistent',
      call: 'Server state is different from client state',
      threshold: 'Adopting TanStack Query or similar',
      ordeal: 'Cache invalidation strategy complexity',
      reward: 'Server state that feels instantaneous'
    },
    dependencies: [{ taskId: 'PRN-001', type: 'soft', reason: 'May integrate with global state' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 70,
      driftTriggers: ['cache policy perfectionism', 'stale time tuning'],
      recoveryStrategy: 'Default configs first, optimize when metrics show need'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'TanStack Query setup with default options',
      'Query key factory pattern',
      'Mutation with optimistic updates',
      'Error boundary integration'
    ],
    deliverables: ['queryClient.ts', 'hooks/useDashboardData.ts', 'api/'],
    status: 'locked'
  },
  {
    id: 'PRN-003',
    name: 'Real-time Sync Engine',
    heroPhase: 3,
    tarot: TAROT_DECK[10],
    kosha: 'pranamaya',
    estimatedYuga: 10,
    microJourney: {
      ordinaryWorld: 'Data stale, users refresh to see updates',
      call: 'Live data is expected in modern apps',
      threshold: 'WebSocket vs SSE vs polling decisions',
      ordeal: 'Connection resilience and reconnection logic',
      reward: 'Data that breathes and updates in real-time'
    },
    dependencies: [{ taskId: 'PRN-002', type: 'hard', reason: 'Builds on server state' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 80,
      driftTriggers: ['reconnection obsession', 'event storming'],
      recoveryStrategy: 'Exponential backoff, circuit breaker pattern'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'WebSocket connection manager',
      'Automatic reconnection with backoff',
      'Message queue for offline periods',
      'Heartbeat/ping-pong health checks'
    ],
    deliverables: ['SyncEngine.ts', 'useRealtime.ts', 'ConnectionStatus.tsx'],
    status: 'locked'
  },
  {
    id: 'PRN-004',
    name: 'Form State Management',
    heroPhase: 3,
    tarot: TAROT_DECK[11],
    kosha: 'pranamaya',
    estimatedYuga: 6,
    microJourney: {
      ordinaryWorld: 'Form state messy, validation scattered',
      call: 'Forms need their own state discipline',
      threshold: 'React Hook Form vs Formik decision',
      ordeal: 'Complex form field dependencies',
      reward: 'Forms that validate and submit flawlessly'
    },
    dependencies: [{ taskId: 'PRN-001', type: 'soft', reason: 'May sync with global state' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 65,
      driftTriggers: ['validation schema bloat', 'field array complexity'],
      recoveryStrategy: 'Field-level validation first, schema for final submit'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'React Hook Form integration',
      'Zod schema validation',
      'Field arrays for dynamic forms',
      'Auto-save draft functionality'
    ],
    deliverables: ['useForm.ts', 'validators/', 'FormProvider.tsx'],
    status: 'locked'
  },
  
  // Phase 4: Meeting Mentor
  {
    id: 'PRN-005',
    name: 'URL State Persistence',
    heroPhase: 4,
    tarot: TAROT_DECK[12],
    kosha: 'pranamaya',
    estimatedYuga: 5,
    microJourney: {
      ordinaryWorld: 'Filters lost on refresh, share links broken',
      call: 'URL is the source of truth for UI state',
      threshold: 'Query param serialization strategy',
      ordeal: 'Complex nested state in URL',
      reward: 'Shareable URLs that restore exact UI state'
    },
    dependencies: [{ taskId: 'PRN-001', type: 'soft', reason: 'Syncs with global state' }],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 60,
      driftTriggers: ['URL length obsession', 'encoding edge cases'],
      recoveryStrategy: 'Only serialize what user would want to share'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'URL param hook for filters/sorting',
      'History.replace vs push strategy',
      'Deep link restoration on load',
      'Array param serialization'
    ],
    deliverables: ['useUrlState.ts', 'urlSerializer.ts'],
    status: 'locked'
  },
  {
    id: 'PRN-006',
    name: 'Undo/Redo System',
    heroPhase: 4,
    tarot: TAROT_DECK[13],
    kosha: 'pranamaya',
    estimatedYuga: 7,
    microJourney: {
      ordinaryWorld: 'Accidental deletes are permanent',
      call: 'Users need safety net for destructive actions',
      threshold: 'Command pattern implementation',
      ordeal: 'Memory management for history stack',
      reward: 'Fearless editing with full history control'
    },
    dependencies: [{ taskId: 'PRN-001', type: 'hard', reason: 'Needs state architecture' }],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 70,
      driftTriggers: ['infinite history storage', 'undo scope creep'],
      recoveryStrategy: '50 action limit, clear on navigation'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'Command pattern with execute/undo',
      'Keyboard shortcuts (Ctrl+Z/Ctrl+Y)',
      'Visual undo toast notifications',
      'History stack with memory limits'
    ],
    deliverables: ['useUndoRedo.ts', 'CommandHistory.ts', 'UndoToast.tsx'],
    status: 'locked'
  },
  {
    id: 'PRN-007',
    name: 'Optimistic Updates',
    heroPhase: 4,
    tarot: TAROT_DECK[14],
    kosha: 'pranamaya',
    estimatedYuga: 6,
    microJourney: {
      ordinaryWorld: 'UI waits for server, feels sluggish',
      call: 'Immediate feedback is perceived performance',
      threshold: 'Rollback strategy for failed ops',
      ordeal: 'Race conditions and conflict resolution',
      reward: 'UI that feels instant, even on slow networks'
    },
    dependencies: [{ taskId: 'PRN-002', type: 'hard', reason: 'Builds on server state' }],
    noesis: {
      optimalVayu: 'udana',
      minKhaloree: 65,
      driftTriggers: ['rollback perfectionism', 'conflict UX debates'],
      recoveryStrategy: 'Toast on conflict, manual resolution'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'Optimistic mutation pattern',
      'Automatic rollback on error',
      'Conflict detection and resolution UI',
      'Pending state indicators'
    ],
    deliverables: ['useOptimistic.ts', 'OptimisticContext.tsx'],
    status: 'locked'
  },
  {
    id: 'PRN-008',
    name: 'State Hydration Guard',
    heroPhase: 4,
    tarot: TAROT_DECK[15],
    kosha: 'pranamaya',
    estimatedYuga: 5,
    microJourney: {
      ordinaryWorld: 'Hydration mismatches, flickering UI',
      call: 'SSR/CSR state must reconcile perfectly',
      threshold: 'Isomorphic state handling',
      ordeal: 'Timing issues and serialization constraints',
      reward: 'Seamless server-to-client handoff'
    },
    dependencies: [{ taskId: 'PRN-001', type: 'hard', reason: 'Guards state layer' }],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 75,
      driftTriggers: ['serialization edge cases', 'hydration debugging'],
      recoveryStrategy: 'Serialize only serializable, hydrate after mount'
    },
    agent: 'Pranamaya',
    acceptanceCriteria: [
      'Server state serialization',
      'Hydration mismatch detection',
      'Loading states during hydration',
      'Rehydration from localStorage'
    ],
    deliverables: ['HydrationGuard.tsx', 'serializeState.ts'],
    status: 'locked'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // LAYER 3: MANOMAYA (Mental) - Business Logic & Processing
  // Agent: Manomaya - Weaver of logic, calculator of paths
  // ═══════════════════════════════════════════════════════════════════════
  
  // Phase 5: Crossing First Threshold
  {
    id: 'MAN-001',
    name: 'Dashboard Calculator Engine',
    heroPhase: 5,
    tarot: TAROT_DECK[16],
    kosha: 'manomaya',
    estimatedYuga: 8,
    microJourney: {
      ordinaryWorld: 'Metrics calculated ad-hoc, inconsistently',
      call: 'Business logic needs centralized engine',
      threshold: 'Pure function calculator architecture',
      ordeal: 'Complex formula dependencies and caching',
      reward: 'Metrics that are always correct and fast'
    },
    dependencies: [{ taskId: 'PRN-001', type: 'soft', reason: 'Consumes state' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 70,
      driftTriggers: ['formula perfectionism', 'edge case rabbit hole'],
      recoveryStrategy: 'Unit test every formula, freeze when green'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Pure function calculator utilities',
      'Memoized derived values',
      'Formula composition system',
      'Unit test coverage >90%'
    ],
    deliverables: ['calculators/', 'useCalculator.ts', 'formulaRegistry.ts'],
    status: 'locked'
  },
  {
    id: 'MAN-002',
    name: 'Filter & Query Builder',
    heroPhase: 5,
    tarot: TAROT_DECK[17],
    kosha: 'manomaya',
    estimatedYuga: 10,
    microJourney: {
      ordinaryWorld: 'Filtering is basic, users need power',
      call: 'Complex query construction needed',
      threshold: 'AST-based query representation',
      ordeal: 'UI complexity for nested conditions',
      reward: 'Query builder that handles any user need'
    },
    dependencies: [{ taskId: 'MAN-001', type: 'soft', reason: 'May use calculators' }],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 80,
      driftTriggers: ['UI perfectionism', 'edge case query types'],
      recoveryStrategy: '80/20 rule: common ops easy, rare ops possible'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Visual query builder UI',
      'AND/OR nested conditions',
      'Filter presets and saved views',
      'Query serialization to URL'
    ],
    deliverables: ['QueryBuilder.tsx', 'ast/', 'useQueryBuilder.ts'],
    status: 'locked'
  },
  {
    id: 'MAN-003',
    name: 'Data Transformation Pipeline',
    heroPhase: 5,
    tarot: TAROT_DECK[18],
    kosha: 'manomaya',
    estimatedYuga: 8,
    microJourney: {
      ordinaryWorld: 'Data shape mismatches between layers',
      call: 'Transformations need composable pipeline',
      threshold: 'Functional pipeline architecture',
      ordeal: 'Error handling in transformation chain',
      reward: 'Data flows through clean transformation stages'
    },
    dependencies: [{ taskId: 'PRN-002', type: 'soft', reason: 'Transforms server data' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 70,
      driftTriggers: ['transformation reusability obsession', 'type complexity'],
      recoveryStrategy: 'Pipe functions, explicit types, test each stage'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Composable transform functions',
      'Pipeline error handling',
      'Type-safe transformations',
      'Transform caching by input hash'
    ],
    deliverables: ['transforms/', 'pipeline.ts', 'useDataTransform.ts'],
    status: 'locked'
  },
  {
    id: 'MAN-004',
    name: 'Permission Engine',
    heroPhase: 5,
    tarot: TAROT_DECK[19],
    kosha: 'manomaya',
    estimatedYuga: 9,
    microJourney: {
      ordinaryWorld: 'Auth checks scattered, inconsistent',
      call: 'Authorization needs systematic approach',
      threshold: 'RBAC + ABAC hybrid model',
      ordeal: 'Permission cache invalidation',
      reward: 'Security that\'s both strict and flexible'
    },
    dependencies: [{ taskId: 'PRN-001', type: 'soft', reason: 'Reads user state' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 85,
      driftTriggers: ['permission granularity debates', 'role explosion'],
      recoveryStrategy: 'Resource-based permissions, inherited roles'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Permission definition DSL',
      'Role hierarchy with inheritance',
      'Permission checking hooks',
      'UI component-level permission gating'
    ],
    deliverables: ['permissions/', 'usePermission.ts', 'PermissionGuard.tsx'],
    status: 'locked'
  },
  
  // Phase 6: Tests, Allies, Enemies
  {
    id: 'MAN-005',
    name: 'Report Generator',
    heroPhase: 6,
    tarot: TAROT_DECK[20],
    kosha: 'manomaya',
    estimatedYuga: 12,
    microJourney: {
      ordinaryWorld: 'Reports are manual, repetitive',
      call: 'Automated report generation needed',
      threshold: 'Template-based report system',
      ordeal: 'PDF/Excel/CSV multi-format output',
      reward: 'One-click professional reports'
    },
    dependencies: [
      { taskId: 'MAN-001', type: 'hard', reason: 'Uses calculators' },
      { taskId: 'MAN-002', type: 'soft', reason: 'May use query builder' }
    ],
    noesis: {
      optimalVayu: 'apana',
      minKhaloree: 75,
      driftTriggers: ['template perfectionism', 'format coverage creep'],
      recoveryStrategy: 'PDF first, other formats on demand'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Report template system',
      'PDF generation with pagination',
      'Scheduled report delivery',
      'Report caching for performance'
    ],
    deliverables: ['reports/', 'ReportGenerator.ts', 'templates/'],
    status: 'locked'
  },
  {
    id: 'MAN-006',
    name: 'Workflow Engine',
    heroPhase: 6,
    tarot: TAROT_DECK[21],
    kosha: 'manomaya',
    estimatedYuga: 15,
    microJourney: {
      ordinaryWorld: 'Business processes hardcoded, rigid',
      call: 'User-defined workflows needed',
      threshold: 'State machine + visual editor',
      ordeal: 'Complex branching and async operations',
      reward: 'Workflows that users can design themselves'
    },
    dependencies: [{ taskId: 'MAN-001', type: 'soft', reason: 'May trigger calculations' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 90,
      driftTriggers: ['workflow complexity', 'edge case handling'],
      recoveryStrategy: 'Start with linear workflows, add branches later'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Visual workflow designer',
      'State machine execution',
      'Workflow persistence and versioning',
      'Trigger system (time, event, manual)'
    ],
    deliverables: ['workflow/', 'WorkflowEngine.ts', 'WorkflowDesigner.tsx'],
    status: 'locked'
  },
  {
    id: 'MAN-007',
    name: 'Validation Framework',
    heroPhase: 6,
    tarot: TAROT_DECK[22],
    kosha: 'manomaya',
    estimatedYuga: 7,
    microJourney: {
      ordinaryWorld: 'Validation rules scattered, duplicated',
      call: 'Unified validation layer needed',
      threshold: 'Schema-first validation approach',
      ordeal: 'Cross-field validation dependencies',
      reward: 'Validation that\'s declarative and reusable'
    },
    dependencies: [{ taskId: 'PRN-004', type: 'soft', reason: 'Form validation uses this' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 65,
      driftTriggers: ['validation rule explosion', 'async validation timing'],
      recoveryStrategy: 'Sync validation first, async as enhancement'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Zod schema library',
      'Custom validation rule registration',
      'Cross-field validation support',
      'Error message internationalization'
    ],
    deliverables: ['validation/', 'schemas/', 'useValidation.ts'],
    status: 'locked'
  },
  {
    id: 'MAN-008',
    name: 'Analytics Tracker',
    heroPhase: 6,
    tarot: TAROT_DECK[23],
    kosha: 'manomaya',
    estimatedYuga: 6,
    microJourney: {
      ordinaryWorld: 'User behavior is invisible',
      call: 'Need visibility into user journeys',
      threshold: 'Privacy-first analytics',
      ordeal: 'Performance impact of tracking',
      reward: 'Insights without compromising user trust'
    },
    dependencies: [],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 60,
      driftTriggers: ['tracking comprehensiveness', 'privacy paranoia'],
      recoveryStrategy: 'Track only what informs product decisions'
    },
    agent: 'Manomaya',
    acceptanceCriteria: [
      'Event tracking system',
      'User journey funnel analysis',
      'Privacy-compliant (GDPR/CCPA)',
      'Batch sending for performance'
    ],
    deliverables: ['analytics/', 'useAnalytics.ts', 'EventTracker.ts'],
    status: 'locked'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // LAYER 4: VIJNANAMAYA (Wisdom) - AI & Insights
  // Agent: Vijnanamaya - Seer of patterns, predictor of paths
  // ═══════════════════════════════════════════════════════════════════════
  
  // Phase 7: Approach to Inmost Cave
  {
    id: 'VIJ-001',
    name: 'Predictive Analytics Engine',
    heroPhase: 7,
    tarot: TAROT_DECK[24],
    kosha: 'vijnanamaya',
    estimatedYuga: 16,
    microJourney: {
      ordinaryWorld: 'Decisions based on hindsight only',
      call: 'Forecasts enable proactive action',
      threshold: 'Time series prediction models',
      ordeal: 'Model accuracy vs interpretability',
      reward: 'Dashboard that shows future, not just past'
    },
    dependencies: [{ taskId: 'MAN-001', type: 'hard', reason: 'Uses historical data' }],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 85,
      driftTriggers: ['model accuracy obsession', 'feature engineering rabbit hole'],
      recoveryStrategy: '80% accurate model now beats 95% model next quarter'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'Trend forecasting with confidence intervals',
      'Seasonal pattern detection',
      'Anomaly detection for outliers',
      'Model performance monitoring'
    ],
    deliverables: ['ml/', 'PredictionEngine.ts', 'ForecastChart.tsx'],
    status: 'locked'
  },
  {
    id: 'VIJ-002',
    name: 'Natural Language Interface',
    heroPhase: 7,
    tarot: TAROT_DECK[25],
    kosha: 'vijnanamaya',
    estimatedYuga: 14,
    microJourney: {
      ordinaryWorld: 'Complex queries require technical skill',
      call: 'Natural language unlocks data for all',
      threshold: 'NL-to-query translation',
      ordeal: 'Query ambiguity resolution',
      reward: 'Ask questions, get answers, no SQL needed'
    },
    dependencies: [
      { taskId: 'VIJ-001', type: 'soft', reason: 'May reference predictions' },
      { taskId: 'MAN-002', type: 'soft', reason: 'Generates queries' }
    ],
    noesis: {
      optimalVayu: 'udana',
      minKhaloree: 90,
      driftTriggers: ['NL understanding perfectionism', 'edge case queries'],
      recoveryStrategy: 'Start with 10 common queries, expand based on usage'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'NL query input component',
      'Intent classification system',
      'Query generation from intent',
      'Clarification dialog for ambiguous queries'
    ],
    deliverables: ['nlp/', 'NLInterface.tsx', 'QueryTranslator.ts'],
    status: 'locked'
  },
  {
    id: 'VIJ-003',
    name: 'Smart Recommendations',
    heroPhase: 7,
    tarot: TAROT_DECK[26],
    kosha: 'vijnanamaya',
    estimatedYuga: 12,
    microJourney: {
      ordinaryWorld: 'Users don\'t know what to look at',
      call: 'Proactive insights based on context',
      threshold: 'Recommendation system architecture',
      ordeal: 'Cold start and relevance balancing',
      reward: 'Dashboard that guides attention intelligently'
    },
    dependencies: [{ taskId: 'VIJ-001', type: 'soft', reason: 'May use predictions' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 80,
      driftTriggers: ['relevance perfectionism', 'recommendation diversity debates'],
      recoveryStrategy: 'Start with rule-based, ML enhancement later'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'Context-aware recommendations',
      'Explanation for why recommended',
      'Feedback loop (thumbs up/down)',
      'A/B testing framework for recommendations'
    ],
    deliverables: ['recommendations/', 'RecommendationEngine.ts', 'InsightCard.tsx'],
    status: 'locked'
  },
  {
    id: 'VIJ-004',
    name: 'Anomaly Detection System',
    heroPhase: 7,
    tarot: TAROT_DECK[27],
    kosha: 'vijnanamaya',
    estimatedYuga: 10,
    microJourney: {
      ordinaryWorld: 'Problems discovered too late',
      call: 'Automatic detection of unusual patterns',
      threshold: 'Statistical anomaly detection',
      ordeal: 'False positive rate management',
      reward: 'Issues surfaced before they become critical'
    },
    dependencies: [{ taskId: 'VIJ-001', type: 'soft', reason: 'Shares prediction infra' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 85,
      driftTriggers: ['false negative fear', 'alert fatigue prevention'],
      recoveryStrategy: 'Tune for recall first, precision second'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'Real-time anomaly detection',
      'Severity classification',
      'Root cause suggestion',
      'Alert routing and escalation'
    ],
    deliverables: ['anomaly/', 'AnomalyDetector.ts', 'AlertPanel.tsx'],
    status: 'locked'
  },
  
  // Phase 8: The Ordeal
  {
    id: 'VIJ-005',
    name: 'Causal Inference Engine',
    heroPhase: 8,
    tarot: TAROT_DECK[28],
    kosha: 'vijnanamaya',
    estimatedYuga: 20,
    microJourney: {
      ordinaryWorld: 'Correlation confused with causation',
      call: 'True causal relationships needed',
      threshold: 'Causal graph construction',
      ordeal: 'Confounding variable control',
      reward: 'Actions linked to outcomes with confidence'
    },
    dependencies: [{ taskId: 'VIJ-001', type: 'hard', reason: 'Builds on analytics' }],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 95,
      driftTriggers: ['causal graph perfectionism', 'methodology debates'],
      recoveryStrategy: 'Start with simple DAGs, iterate with domain experts'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'Causal graph visualization',
      'Intervention effect estimation',
      'A/B test result analysis',
      'Counterfactual reasoning'
    ],
    deliverables: ['causal/', 'CausalEngine.ts', 'CausalGraph.tsx'],
    status: 'locked'
  },
  {
    id: 'VIJ-006',
    name: 'AutoML Integration',
    heroPhase: 8,
    tarot: TAROT_DECK[29],
    kosha: 'vijnanamaya',
    estimatedYuga: 18,
    microJourney: {
      ordinaryWorld: 'ML requires specialized expertise',
      call: 'Automated model training for all',
      threshold: 'No-code ML pipeline',
      ordeal: 'Model selection and hyperparameter tuning',
      reward: 'Custom models without data science team'
    },
    dependencies: [{ taskId: 'VIJ-001', type: 'hard', reason: 'Core ML infrastructure' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 90,
      driftTriggers: ['model complexity creep', 'autoML black box fear'],
      recoveryStrategy: 'Transparent models first, black box if necessary'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'Dataset upload and profiling',
      'Automated feature engineering',
      'Model comparison and selection',
      'Deployment with monitoring'
    ],
    deliverables: ['automl/', 'AutoMLPipeline.ts', 'ModelStudio.tsx'],
    status: 'locked'
  },
  {
    id: 'VIJ-007',
    name: 'Explainable AI Layer',
    heroPhase: 8,
    tarot: TAROT_DECK[30],
    kosha: 'vijnanamaya',
    estimatedYuga: 14,
    microJourney: {
      ordinaryWorld: 'AI decisions are black boxes',
      call: 'Transparency builds trust',
      threshold: 'Model interpretability techniques',
      ordeal: 'Complexity of explaining deep models',
      reward: 'Every AI decision is explainable'
    },
    dependencies: [
      { taskId: 'VIJ-001', type: 'soft', reason: 'Explains predictions' },
      { taskId: 'VIJ-006', type: 'soft', reason: 'Explains autoML models' }
    ],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 85,
      driftTriggers: ['explanation completeness', 'explanation accuracy debates'],
      recoveryStrategy: 'LIME/SHAP for local, feature importance for global'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'Feature importance visualization',
      'Individual prediction explanations',
      'What-if scenario analysis',
      'Model decision audit trail'
    ],
    deliverables: ['xai/', 'ExplanationEngine.ts', 'ExplanationPanel.tsx'],
    status: 'locked'
  },
  {
    id: 'VIJ-008',
    name: 'Knowledge Graph Builder',
    heroPhase: 8,
    tarot: TAROT_DECK[31],
    kosha: 'vijnanamaya',
    estimatedYuga: 16,
    microJourney: {
      ordinaryWorld: 'Data silos obscure relationships',
      call: 'Connected data reveals hidden insights',
      threshold: 'Entity extraction and relationship mapping',
      ordeal: 'Graph scale and query performance',
      reward: 'Navigate data through relationships'
    },
    dependencies: [{ taskId: 'VIJ-002', type: 'soft', reason: 'Uses entity understanding' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 90,
      driftTriggers: ['entity extraction accuracy', 'relationship completeness'],
      recoveryStrategy: 'Start with structured data, add NLP extraction later'
    },
    agent: 'Vijnanamaya',
    acceptanceCriteria: [
      'Entity and relationship extraction',
      'Graph visualization interface',
      'Graph query language (Cypher/GQL)',
      'Incremental graph updates'
    ],
    deliverables: ['knowledge/', 'KnowledgeGraph.ts', 'GraphExplorer.tsx'],
    status: 'locked'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // LAYER 5: ANANDAMAYA (Bliss) - Experience & Polish
  // Agent: Anandamaya - Crafter of joy, designer of delight
  // ═══════════════════════════════════════════════════════════════════════
  
  // Phase 9: The Reward
  {
    id: 'ANA-001',
    name: 'Micro-interaction Library',
    heroPhase: 9,
    tarot: TAROT_DECK[32],
    kosha: 'anandamaya',
    estimatedYuga: 8,
    microJourney: {
      ordinaryWorld: 'UI is functional but lifeless',
      call: 'Motion communicates meaning',
      threshold: 'Purposeful animation system',
      ordeal: 'Performance vs visual richness',
      reward: 'Interface that feels alive and responsive'
    },
    dependencies: [{ taskId: 'ANN-001', type: 'soft', reason: 'Uses design tokens' }],
    noesis: {
      optimalVayu: 'udana',
      minKhaloree: 70,
      driftTriggers: ['animation indulgence', 'easing perfectionism'],
      recoveryStrategy: '60fps minimum, meaning over decoration'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'Button press feedback animations',
      'Loading state transitions',
      'Success/error micro-interactions',
      'Reduced motion accessibility support'
    ],
    deliverables: ['motion/', 'micro-interactions.css', 'useMicroInteraction.ts'],
    status: 'locked'
  },
  {
    id: 'ANA-002',
    name: 'Onboarding Experience',
    heroPhase: 9,
    tarot: TAROT_DECK[33],
    kosha: 'anandamaya',
    estimatedYuga: 10,
    microJourney: {
      ordinaryWorld: 'New users are lost and overwhelmed',
      call: 'First impression determines retention',
      threshold: 'Progressive disclosure journey',
      ordeal: 'Balancing guidance with discovery',
      reward: 'Users who feel confident from day one'
    },
    dependencies: [
      { taskId: 'ANA-001', type: 'soft', reason: 'Uses animations' },
      { taskId: 'VIJ-003', type: 'soft', reason: 'May personalize' }
    ],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 75,
      driftTriggers: ['onboarding length debates', 'feature showcase vs task focus'],
      recoveryStrategy: 'Goal-based onboarding, skip for power users'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'Contextual tooltip tour',
      'Interactive walkthrough for key features',
      'Progress indication and celebration',
      'Skip and resume functionality'
    ],
    deliverables: ['onboarding/', 'OnboardingFlow.tsx', 'TooltipTour.tsx'],
    status: 'locked'
  },
  {
    id: 'ANA-003',
    name: 'Theme Personalization',
    heroPhase: 9,
    tarot: TAROT_DECK[34],
    kosha: 'anandamaya',
    estimatedYuga: 8,
    microJourney: {
      ordinaryWorld: 'One size fits all feels impersonal',
      call: 'Users want their dashboard their way',
      threshold: 'Comprehensive theming system',
      ordeal: 'Customization vs consistency tension',
      reward: 'Dashboard that feels like home'
    },
    dependencies: [{ taskId: 'ANN-001', type: 'hard', reason: 'Builds on design tokens' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 65,
      driftTriggers: ['theme variant explosion', 'accessibility in custom themes'],
      recoveryStrategy: 'Curated palettes, not full color picker'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'Light/dark/system theme modes',
      'Accent color selection',
      'Density settings (compact/comfortable)',
      'Theme preview before apply'
    ],
    deliverables: ['themes/', 'ThemeProvider.tsx', 'ThemeSettings.tsx'],
    status: 'locked'
  },
  {
    id: 'ANA-004',
    name: 'Dashboard Customization',
    heroPhase: 9,
    tarot: TAROT_DECK[35],
    kosha: 'anandamaya',
    estimatedYuga: 12,
    microJourney: {
      ordinaryWorld: 'Fixed layout frustrates power users',
      call: 'Configurable layout empowers users',
      threshold: 'Drag-and-drop dashboard builder',
      ordeal: 'Layout persistence and responsive behavior',
      reward: 'Every user has their perfect dashboard'
    },
    dependencies: [
      { taskId: 'ANN-004', type: 'soft', reason: 'Cards as widgets' },
      { taskId: 'PRN-001', type: 'soft', reason: 'Persists layout state' }
    ],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 70,
      driftTriggers: ['layout complexity', 'widget API design debates'],
      recoveryStrategy: 'Grid-based first, freeform if requested'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'Drag-and-drop widget arrangement',
      'Widget size configuration',
      'Layout save and share',
      'Template layouts for quick start'
    ],
    deliverables: ['customization/', 'DashboardBuilder.tsx', 'WidgetGrid.tsx'],
    status: 'locked'
  },
  
  // Phase 10: The Road Back
  {
    id: 'ANA-005',
    name: 'Accessibility Excellence',
    heroPhase: 10,
    tarot: TAROT_DECK[36],
    kosha: 'anandamaya',
    estimatedYuga: 10,
    microJourney: {
      ordinaryWorld: 'Accessibility is checklist item',
      call: 'True inclusion is seamless experience',
      threshold: 'WCAG 2.1 AA compliance',
      ordeal: 'Complex interactive component a11y',
      reward: 'Dashboard usable by everyone'
    },
    dependencies: [{ taskId: 'ANN-001', type: 'soft', reason: 'Color contrast, etc' }],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 80,
      driftTriggers: ['screen reader perfectionism', 'a11y testing scope'],
      recoveryStrategy: 'Automated testing + screen reader manual testing'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'WCAG 2.1 AA compliance audit',
      'Keyboard navigation complete',
      'Screen reader optimized',
      'Focus management and announcements'
    ],
    deliverables: ['a11y/', 'A11yAudit.md', 'useA11y.ts'],
    status: 'locked'
  },
  {
    id: 'ANA-006',
    name: 'Performance Optimization',
    heroPhase: 10,
    tarot: TAROT_DECK[37],
    kosha: 'anandamaya',
    estimatedYuga: 12,
    microJourney: {
      ordinaryWorld: 'Slow load times, janky interactions',
      call: 'Speed is a feature',
      threshold: 'Core Web Vitals targets',
      ordeal: 'Optimization without feature sacrifice',
      reward: 'Dashboard that feels instantaneous'
    },
    dependencies: [],
    noesis: {
      optimalVayu: 'apana',
      minKhaloree: 75,
      driftTriggers: ['premature optimization', 'metric gaming'],
      recoveryStrategy: 'Measure first, optimize bottlenecks only'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'LCP < 2.5s, FID < 100ms, CLS < 0.1',
      'Bundle size budget enforced',
      'Code splitting and lazy loading',
      'Performance monitoring in production'
    ],
    deliverables: ['perf/', 'performance-budget.json', 'PerfMonitor.ts'],
    status: 'locked'
  },
  {
    id: 'ANA-007',
    name: 'Offline Capability',
    heroPhase: 10,
    tarot: TAROT_DECK[38],
    kosha: 'anandamaya',
    estimatedYuga: 14,
    microJourney: {
      ordinaryWorld: 'No connection = no dashboard',
      call: 'Work continues even offline',
      threshold: 'Service Worker + sync strategy',
      ordeal: 'Conflict resolution for offline edits',
      reward: 'Truly ubiquitous dashboard access'
    },
    dependencies: [{ taskId: 'PRN-003', type: 'soft', reason: 'Sync infrastructure' }],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 80,
      driftTriggers: ['sync complexity', 'offline scope creep'],
      recoveryStrategy: 'Read-only offline first, edit sync later'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'Service Worker for asset caching',
      'Data caching with expiration',
      'Offline indicator and queue',
      'Background sync when reconnected'
    ],
    deliverables: ['pwa/', 'service-worker.ts', 'OfflineBanner.tsx'],
    status: 'locked'
  },
  {
    id: 'ANA-008',
    name: 'Error Recovery Experience',
    heroPhase: 10,
    tarot: TAROT_DECK[39],
    kosha: 'anandamaya',
    estimatedYuga: 8,
    microJourney: {
      ordinaryWorld: 'Errors are cryptic and blocking',
      call: 'Errors can be handled gracefully',
      threshold: 'Error boundary + recovery system',
      ordeal: 'Meaningful error messages for all cases',
      reward: 'Users never feel stuck or abandoned'
    },
    dependencies: [],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 70,
      driftTriggers: ['error case completeness', 'recovery flow complexity'],
      recoveryStrategy: 'Generic recovery first, specific flows as needed'
    },
    agent: 'Anandamaya',
    acceptanceCriteria: [
      'Error boundaries for all routes',
      'Graceful degradation UI',
      'Retry mechanisms with backoff',
      'User-friendly error messages'
    ],
    deliverables: ['errors/', 'ErrorBoundary.tsx', 'ErrorRecovery.ts'],
    status: 'locked'
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // LAYER 6: NOESIS (Integration) - Synthesis & Orchestration
  // Agent: Noesis - The coordinator, the meta-observer
  // ═══════════════════════════════════════════════════════════════════════
  
  // Phase 11: The Resurrection
  {
    id: 'NOE-001',
    name: 'Cross-Agent Orchestrator',
    heroPhase: 11,
    tarot: TAROT_DECK[40],
    kosha: 'noesis',
    estimatedYuga: 10,
    microJourney: {
      ordinaryWorld: 'Agents work in isolation',
      call: 'Coordinated intelligence emerges',
      threshold: 'Inter-agent communication protocol',
      ordeal: 'Resolving conflicting agent recommendations',
      reward: 'Agents that amplify each other'
    },
    dependencies: [
      { taskId: 'PRN-003', type: 'hard', reason: 'Real-time sync needed' },
      { taskId: 'MAN-006', type: 'soft', reason: 'Workflow orchestration' }
    ],
    noesis: {
      optimalVayu: 'vyana',
      minKhaloree: 85,
      driftTriggers: ['orchestration complexity', 'agent priority debates'],
      recoveryStrategy: 'Priority queue with human override'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'Agent message bus architecture',
      'Priority-based conflict resolution',
      'Human-in-the-loop for critical decisions',
      'Agent performance monitoring'
    ],
    deliverables: ['orchestrator/', 'AgentBus.ts', 'Orchestrator.ts'],
    status: 'locked'
  },
  {
    id: 'NOE-002',
    name: 'Meta-Learning System',
    heroPhase: 11,
    tarot: TAROT_DECK[41],
    kosha: 'noesis',
    estimatedYuga: 18,
    microJourney: {
      ordinaryWorld: 'System behavior is static',
      call: 'Dashboard learns from all users',
      threshold: 'Federated learning implementation',
      ordeal: 'Privacy-preserving model updates',
      reward: 'Collective wisdom without centralization'
    },
    dependencies: [
      { taskId: 'VIJ-006', type: 'hard', reason: 'AutoML foundation' },
      { taskId: 'MAN-008', type: 'soft', reason: 'Learning from analytics' }
    ],
    noesis: {
      optimalVayu: 'prana',
      minKhaloree: 95,
      driftTriggers: ['privacy perfectionism', 'model convergence obsession'],
      recoveryStrategy: 'Differential privacy from day one'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'Federated learning coordinator',
      'Differential privacy guarantees',
      'Model version management',
      'A/B testing for model updates'
    ],
    deliverables: ['metalearn/', 'FederatedCoordinator.ts', 'PrivacyLayer.ts'],
    status: 'locked'
  },
  {
    id: 'NOE-003',
    name: 'Vikara Detection Engine',
    heroPhase: 11,
    tarot: TAROT_DECK[42],
    kosha: 'noesis',
    estimatedYuga: 12,
    microJourney: {
      ordinaryWorld: 'System drift goes unnoticed',
      call: 'Detect degradation before users do',
      threshold: 'Multi-dimensional drift detection',
      ordeal: 'Distinguishing drift from evolution',
      reward: 'Self-aware system that maintains quality'
    },
    dependencies: [
      { taskId: 'VIJ-004', type: 'hard', reason: 'Anomaly detection base' },
      { taskId: 'NOE-001', type: 'soft', reason: 'Agent health monitoring' }
    ],
    noesis: {
      optimalVayu: 'samana',
      minKhaloree: 90,
      driftTriggers: ['drift threshold tuning', 'alert fatigue'],
      recoveryStrategy: 'Adaptive thresholds based on historical variance'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'Data drift detection',
      'Concept drift monitoring',
      'Performance regression alerts',
      'Automatic rollback triggers'
    ],
    deliverables: ['vikara/', 'DriftDetector.ts', 'VikaraDashboard.tsx'],
    status: 'locked'
  },
  {
    id: 'NOE-004',
    name: 'Consciousness Dashboard',
    heroPhase: 11,
    tarot: TAROT_DECK[43],
    kosha: 'noesis',
    estimatedYuga: 14,
    microJourney: {
      ordinaryWorld: 'System internals are opaque',
      call: 'Visibility into collective intelligence',
      threshold: 'Real-time system consciousness UI',
      ordeal: 'Meaningful abstraction of complexity',
      reward: 'Dashboard that shows its own thinking'
    },
    dependencies: [
      { taskId: 'NOE-001', type: 'hard', reason: 'Agent state needed' },
      { taskId: 'NOE-003', type: 'hard', reason: 'Vikara data needed' }
    ],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 85,
      driftTriggers: ['information density', 'visual complexity'],
      recoveryStrategy: 'Layered views: summary → detail → raw'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'Real-time agent state visualization',
      'Decision audit trail',
      'System health overview',
      'Interactive exploration of internals'
    ],
    deliverables: ['consciousness/', 'SystemConsciousness.tsx', 'AgentMonitor.tsx'],
    status: 'locked'
  },
  
  // Phase 12: Return with Elixir
  {
    id: 'NOE-005',
    name: 'Deployment Pipeline',
    heroPhase: 12,
    tarot: TAROT_DECK[44],
    kosha: 'noesis',
    estimatedYuga: 10,
    microJourney: {
      ordinaryWorld: 'Deployments are manual and risky',
      call: 'Shipping should be boring',
      threshold: 'Fully automated CI/CD',
      ordeal: 'Rollback strategy for failed releases',
      reward: 'Deploy anytime with confidence'
    },
    dependencies: [
      { taskId: 'ANA-006', type: 'soft', reason: 'Perf budgets in CI' },
      { taskId: 'NOE-003', type: 'soft', reason: 'Drift detection' }
    ],
    noesis: {
      optimalVayu: 'udana',
      minKhaloree: 75,
      driftTriggers: ['deployment perfectionism', 'rollback testing scope'],
      recoveryStrategy: 'Canary first, full rollout after validation'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'Automated test → build → deploy pipeline',
      'Blue-green deployment strategy',
      'Automatic rollback on error spike',
      'Deployment notifications and logs'
    ],
    deliverables: ['deploy/', 'pipeline.yml', 'deploy-scripts/'],
    status: 'locked'
  },
  {
    id: 'NOE-006',
    name: 'Monitoring & Observability',
    heroPhase: 12,
    tarot: TAROT_DECK[45],
    kosha: 'noesis',
    estimatedYuga: 12,
    microJourney: {
      ordinaryWorld: 'Issues discovered by users',
      call: 'Know before they know',
      threshold: 'Comprehensive telemetry',
      ordeal: 'Signal vs noise in alerts',
      reward: 'Complete visibility into production'
    },
    dependencies: [{ taskId: 'NOE-005', type: 'soft', reason: 'Deploy monitoring' }],
    noesis: {
      optimalVayu: 'kurma',
      minKhaloree: 70,
      driftTriggers: ['alert fatigue', 'dashboard overload'],
      recoveryStrategy: 'SLO-based alerting, actionable alerts only'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'Distributed tracing integration',
      'Error tracking and aggregation',
      'Performance monitoring dashboards',
      'Log aggregation and search'
    ],
    deliverables: ['observability/', 'tracing.ts', 'monitoring-dashboard.json'],
    status: 'locked'
  },
  {
    id: 'NOE-007',
    name: 'Documentation & Knowledge Base',
    heroPhase: 12,
    tarot: TAROT_DECK[46],
    kosha: 'noesis',
    estimatedYuga: 15,
    microJourney: {
      ordinaryWorld: 'Knowledge trapped in minds',
      call: 'Wisdom must be accessible',
      threshold: 'Living documentation system',
      ordeal: 'Keeping docs synchronized with code',
      reward: 'Onboarding measured in hours not weeks'
    },
    dependencies: [],
    noesis: {
      optimalVayu: 'apana',
      minKhaloree: 65,
      driftTriggers: ['documentation completeness', 'format debates'],
      recoveryStrategy: 'Docs as code, automated generation where possible'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'Architecture Decision Records (ADRs)',
      'Auto-generated API documentation',
      'Interactive component storybook',
      'Runbook for common operations'
    ],
    deliverables: ['docs/', 'storybook/', 'adr/'],
    status: 'locked'
  },
  {
    id: 'NOE-008',
    name: 'The Elixir - Integration Complete',
    heroPhase: 12,
    tarot: TAROT_DECK[47],
    kosha: 'noesis',
    estimatedYuga: 20,
    microJourney: {
      ordinaryWorld: '48 separate tasks, disconnected',
      call: 'The whole is greater than parts',
      threshold: 'Final integration and blessing',
      ordeal: 'End-to-end testing complexity',
      reward: 'Kalachakra Dashboard - alive and aware'
    },
    dependencies: [
      { taskId: 'ANN-008', type: 'hard', reason: 'UI complete' },
      { taskId: 'PRN-008', type: 'hard', reason: 'State complete' },
      { taskId: 'MAN-008', type: 'hard', reason: 'Logic complete' },
      { taskId: 'VIJ-008', type: 'hard', reason: 'AI complete' },
      { taskId: 'ANA-008', type: 'hard', reason: 'UX complete' },
      { taskId: 'NOE-007', type: 'hard', reason: 'Docs complete' }
    ],
    noesis: {
      optimalVayu: 'mukhya',
      minKhaloree: 100,
      driftTriggers: ['final polish obsession', 'scope creep'],
      recoveryStrategy: 'Ship when all acceptance criteria met, polish in iterations'
    },
    agent: 'Noesis',
    acceptanceCriteria: [
      'All 48 tasks completed',
      'End-to-end test suite passing',
      'Performance budgets met',
      'Documentation complete',
      'Security audit passed',
      'User acceptance testing passed'
    ],
    deliverables: ['Kalachakra Dashboard v1.0', 'Launch announcement', 'Team celebration'],
    status: 'locked'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getTasksByPhase(phase: HeroPhase): KalachakraTask[] {
  return DASHBOARD_TASKS.filter(t => t.heroPhase === phase);
}

export function getTasksByKosha(kosha: Kosha): KalachakraTask[] {
  return DASHBOARD_TASKS.filter(t => t.kosha === kosha);
}

export function getTasksByAgent(agent: string): KalachakraTask[] {
  return DASHBOARD_TASKS.filter(t => t.agent === agent);
}

export function getTaskById(id: string): KalachakraTask | undefined {
  return DASHBOARD_TASKS.find(t => t.id === id);
}

export function getDependencies(taskId: string): TaskDependency[] {
  const task = getTaskById(taskId);
  return task?.dependencies || [];
}

export function getDependentTasks(taskId: string): KalachakraTask[] {
  return DASHBOARD_TASKS.filter(t => 
    t.dependencies.some(d => d.taskId === taskId)
  );
}

export function getAvailableTasks(): KalachakraTask[] {
  return DASHBOARD_TASKS.filter(t => {
    if (t.status !== 'locked') return false;
    // Task is available if all hard dependencies are completed
    return t.dependencies
      .filter(d => d.type === 'hard')
      .every(d => {
        const depTask = getTaskById(d.taskId);
        return depTask?.status === 'completed';
      });
  });
}

export function getTotalEstimatedYuga(): number {
  return DASHBOARD_TASKS.reduce((sum, t) => sum + t.estimatedYuga, 0);
}

export function getPhaseName(phase: HeroPhase): string {
  return PHASE_NAMES[phase];
}

export const TOTAL_TASKS = DASHBOARD_TASKS.length;
export const TASKS_PER_PHASE = 4;
export const TASKS_PER_KOSHA = 8;
