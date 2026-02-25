import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { KalachakraState, Task, HeroPhase, YugaState, NoesisTemporalState } from '../types/index';
import { HERO_PHASES, YUGA_DATA } from '../types/index';

const DEFAULT_HERO_PHASE: HeroPhase = {
  number: 1,
  name: 'ORDINARY WORLD',
  sanskritName: 'सामान्य लोक',
  tarotCard: 0,
  kosha: 'annamaya',
  description: 'The hero is in their familiar environment.',
  tasks: ['Establish baseline', 'Recognize comfort zone', 'Sense the call'],
  sankalpa: 'I am open to the journey',
  progressIndicators: {
    starting: 'Feeling comfortable',
    middle: 'Sensing restlessness',
    completing: 'Ready for change',
  },
};

const DEFAULT_YUGA: YugaState = {
  name: 'krita',
  sanskritName: 'कृत',
  color: YUGA_DATA.krita.color,
  duration: { min: 45, max: 90 },
  characteristics: ['Effortless flow', 'High energy', 'Clear thinking', 'Creative peak'],
  tarotCards: [1, 9, 19],
  kosha: 'anandamaya',
  exitSignals: ['First distraction', 'Hunger emerging', 'Restlessness'],
  resetActions: ['Take a walk', 'Hydrate', 'Switch tasks'],
};

const generateSampleTasks = (): Task[] => [
  {
    id: 'task-1',
    name: 'Design system architecture',
    description: 'Create the core architecture for Kalachakra',
    createdAt: new Date().toISOString(),
    estimatedDuration: 120,
    heroPhase: 1,
    yuga: 'krita',
    kosha: 'vijnanamaya',
    priority: 'high',
    dependencies: [],
    microJourney: {
      ordinaryWorld: 'Current system is fragmented',
      call: 'Need unified calendar system',
      threshold: 'Commit to new architecture',
      ordeal: 'Complex integration points',
      reward: 'Seamless time management',
    },
    status: 'in-progress',
    progress: 0.6,
  },
  {
    id: 'task-2',
    name: 'Implement Noesis bridge',
    description: 'Connect to Noesis CLI for temporal state',
    createdAt: new Date().toISOString(),
    estimatedDuration: 60,
    heroPhase: 2,
    yuga: 'treta',
    kosha: 'pranamaya',
    priority: 'high',
    dependencies: ['task-1'],
    microJourney: {
      ordinaryWorld: 'No real-time data',
      call: 'Need live Khalorēē readings',
      threshold: 'Set up WebSocket connection',
      ordeal: 'Handle connection failures',
      reward: 'Live energy awareness',
    },
    status: 'pending',
    progress: 0,
  },
];

const createInitialState = (): KalachakraState => ({
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  noesis: null,
  tarotOfTheDay: {
    number: 0,
    name: 'The Fool',
    sanskritName: 'मूढ़',
    keywords: ['beginning', 'innocence', 'spontaneity'],
    meaning: {
      upright: 'New beginnings, innocence, spontaneity',
      reversed: 'Recklessness, risk-taking, holding back',
      shadow: 'Fear of the unknown',
    },
    kosha: 'annamaya',
    element: 'air',
  },
  heroPhase: DEFAULT_HERO_PHASE,
  yugaOfTheMoment: DEFAULT_YUGA,
  currentVayu: {
    name: 'prana',
    direction: 'inward',
    domain: 'life force',
    quality: 'vitalizing',
    associatedKosha: 'pranamaya',
  },
  cycles: {
    moment: { yuga: 'krita', progress: 0.5 },
    session: { yuga: 'krita', heroPhase: 1, progress: 0.3 },
    day: { tarot: 0, heroPhase: 1, progress: 0.2 },
    week: { heroPhase: 3, progress: 0.4 },
    moon: { phase: 'waxing', progress: 0.6 },
    quarter: { heroPhase: 5, progress: 0.7 },
  },
  sankalpa: 'I move with the flow of time',
  recentDraws: [],
  completedTasks: [],
});

interface KalachakraStore {
  state: KalachakraState;
  tasks: Task[];
  selectedTaskId: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  lastSync: string | null;
  initialize: () => void;
  updateNoesisState: (noesisState: NoesisTemporalState) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, reflection?: string) => void;
  setSelectedTask: (task: Task | null) => void;
}

export const useKalachakraStore = create<KalachakraStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        state: createInitialState(),
        tasks: generateSampleTasks(),
        selectedTaskId: null,
        isInitialized: false,
        isLoading: false,
        lastSync: null,
        
        initialize: () => set((s: any) => ({ ...s, isInitialized: true })),
        
        updateNoesisState: (noesisState) => set((s: any) => {
          const khaloree = noesisState.khaloree;
          const yugaName = khaloree >= 75 ? 'krita' : khaloree >= 50 ? 'treta' : khaloree >= 25 ? 'dvapara' : 'kali';
          return {
            ...s,
            state: {
              ...s.state,
              noesis: noesisState,
              yugaOfTheMoment: { ...DEFAULT_YUGA, name: yugaName },
              currentVayu: { ...s.state.currentVayu, name: noesisState.vayu },
            }
          };
        }),
        
        setTasks: (tasks) => set((s: any) => ({ ...s, tasks })),
        
        addTask: (task) => set((s: any) => ({ ...s, tasks: [...s.tasks, task] })),
        
        updateTask: (taskId, updates) => set((s: any) => ({
          ...s,
          tasks: s.tasks.map((t: Task) => t.id === taskId ? { ...t, ...updates } : t)
        })),
        
        deleteTask: (taskId) => set((s: any) => ({
          ...s,
          tasks: s.tasks.filter((t: Task) => t.id !== taskId),
          selectedTaskId: s.selectedTaskId === taskId ? null : s.selectedTaskId
        })),
        
        completeTask: (taskId) => set((s: any) => {
          const task = s.tasks.find((t: Task) => t.id === taskId);
          if (!task) return s;
          const completedTask = { ...task, status: 'completed', progress: 1, completedAt: new Date().toISOString() };
          return {
            ...s,
            tasks: s.tasks.filter((t: Task) => t.id !== taskId),
            state: { ...s.state, completedTasks: [...s.state.completedTasks, completedTask] }
          };
        }),
        
        setSelectedTask: (task) => set((s: any) => ({ ...s, selectedTaskId: task?.id || null })),
      }),
      {
        name: 'kalachakra-storage',
        partialize: (state: any) => ({ state: state.state, tasks: state.tasks }),
      }
    )
  )
);