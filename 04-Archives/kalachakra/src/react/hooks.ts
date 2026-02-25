"use client";

/**
 * React Hooks for Kalachakra Dashboard Integration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  KalachakraState,
  Task,
  HeroPhase,
  YugaState,
  TarotDraw,
  NowResponse,
  CardDrawResponse
} from '../types/index.js';
import { kalachakra } from '../KalachakraEngine.js';

// ============================================================================
// USE KALACHAKRA - Main state hook
// ============================================================================

interface UseKalachakraReturn {
  state: KalachakraState | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  initialized: boolean;
}

export function useKalachakra(
  pollInterval: number = 30000
): UseKalachakraReturn {
  const [state, setState] = useState<KalachakraState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    try {
      if (!initialized) {
        await kalachakra.initialize();
        setInitialized(true);
      }
      
      const now = await kalachakra.getNow();
      setState(kalachakra.getState());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  useEffect(() => {
    refresh();

    if (pollInterval > 0) {
      intervalRef.current = setInterval(refresh, pollInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, pollInterval]);

  return { state, loading, error, refresh, initialized };
}

// ============================================================================
// USE NOW - Current moment snapshot
// ============================================================================

interface UseNowReturn {
  now: NowResponse | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useNow(pollInterval: number = 30000): UseNowReturn {
  const [now, setNow] = useState<NowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await kalachakra.getNow();
      setNow(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    
    if (pollInterval > 0) {
      const interval = setInterval(refresh, pollInterval);
      return () => clearInterval(interval);
    }
  }, [refresh, pollInterval]);

  return { now, loading, error, refresh };
}

// ============================================================================
// USE TASKS - Task management
// ============================================================================

interface UseTasksReturn {
  tasks: Task[];
  activeTask: Task | null;
  completedTasks: Task[];
  createTask: (name: string, description?: string, duration?: number) => Task;
  startTask: (taskId: string) => void;
  updateProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string, reflection?: string) => void;
  recommendedTask: { task: Task | null; reasoning: string };
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [recommended, setRecommended] = useState<{ task: Task | null; reasoning: string }>({
    task: null,
    reasoning: ''
  });

  const refreshTasks = useCallback(() => {
    const state = kalachakra.getState();
    if (state) {
      setCompletedTasks(state.completedTasks || []);
      setActiveTask(state.activeTask || null);
      setRecommended(kalachakra.getRecommendedTask());
    }
  }, []);

  const createTask = useCallback((
    name: string,
    description?: string,
    duration: number = 60
  ): Task => {
    const task = kalachakra.createTask(name, description, duration);
    setTasks(prev => [...prev, task]);
    return task;
  }, []);

  const startTask = useCallback((taskId: string) => {
    const task = kalachakra.startTask(taskId);
    setActiveTask(task);
    refreshTasks();
  }, [refreshTasks]);

  const updateProgress = useCallback((taskId: string, progress: number) => {
    kalachakra.updateTaskProgress(taskId, progress);
    refreshTasks();
  }, [refreshTasks]);

  const completeTask = useCallback((taskId: string, reflection?: string) => {
    kalachakra.completeTask({
      taskId,
      reflection,
      energyLevel: 50,
      satisfaction: 50
    });
    setActiveTask(null);
    refreshTasks();
  }, [refreshTasks]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  return {
    tasks,
    activeTask,
    completedTasks,
    createTask,
    startTask,
    updateProgress,
    completeTask,
    recommendedTask: recommended
  };
}

// ============================================================================
// USE TAROT - Card drawing
// ============================================================================

interface UseTarotReturn {
  cardOfTheDay: import('../types').TarotCard | null;
  recentDraws: TarotDraw[];
  drawCard: (context?: string) => CardDrawResponse;
  lastDraw: CardDrawResponse | null;
}

export function useTarot(): UseTarotReturn {
  const [cardOfTheDay, setCardOfTheDay] = useState<import('../types').TarotCard | null>(null);
  const [recentDraws, setRecentDraws] = useState<TarotDraw[]>([]);
  const [lastDraw, setLastDraw] = useState<CardDrawResponse | null>(null);

  useEffect(() => {
    const state = kalachakra.getState();
    if (state) {
      setCardOfTheDay(state.tarotOfTheDay);
      setRecentDraws(state.recentDraws || []);
    }
  }, []);

  const drawCard = useCallback((context?: string): CardDrawResponse => {
    const response = kalachakra.drawCard({ context });
    setLastDraw(response);
    setRecentDraws(prev => [response.draw, ...prev].slice(0, 10));
    return response;
  }, []);

  return {
    cardOfTheDay,
    recentDraws,
    drawCard,
    lastDraw
  };
}

// ============================================================================
// USE HERO PHASE - Hero's journey tracking
// ============================================================================

interface UseHeroPhaseReturn {
  currentPhase: HeroPhase | null;
  nextPhase: HeroPhase | null;
  previousPhase: HeroPhase | null;
  allPhases: HeroPhase[];
  phaseProgress: number;
}

export function useHeroPhase(): UseHeroPhaseReturn {
  const [currentPhase, setCurrentPhase] = useState<HeroPhase | null>(null);
  const [phaseProgress, setPhaseProgress] = useState(0);

  useEffect(() => {
    const state = kalachakra.getState();
    if (state) {
      setCurrentPhase(state.heroPhase);
      
      // Calculate phase progress
      const completed = state.completedTasks?.length || 0;
      const total = completed + 10; // Estimate
      const progress = (state.heroPhase.number - 1) / 12 + (completed / total) / 12;
      setPhaseProgress(Math.min(1, progress));
    }
  }, []);

  const allPhases: HeroPhase[] = [];
  const nextPhase = currentPhase 
    ? null
    : null;
  const previousPhase = currentPhase
    ? null
    : null;

  return {
    currentPhase,
    nextPhase,
    previousPhase,
    allPhases,
    phaseProgress
  };
}

// ============================================================================
// USE YUGA - Current Yuga state
// ============================================================================

interface UseYugaReturn {
  currentYuga: YugaState | null;
  yugaProgress: number;
  sessionDuration: number;
  shouldTransition: boolean;
  recommendedAction: string;
}

export function useYuga(pollInterval: number = 60000): UseYugaReturn {
  const [currentYuga, setCurrentYuga] = useState<YugaState | null>(null);
  const [yugaProgress, setYugaProgress] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [shouldTransition, setShouldTransition] = useState(false);
  const [recommendedAction, setRecommendedAction] = useState('');

  const refresh = useCallback(() => {
    const state = kalachakra.getState();
    if (state) {
      setCurrentYuga(state.yugaOfTheMoment);
    }

    const { fractalTime } = require('../cycles/FractalTime');
    setYugaProgress(fractalTime.getYugaProgress());
    setSessionDuration(fractalTime.getSessionDuration());
    
    const transition = fractalTime.shouldTransitionYuga();
    setShouldTransition(transition.shouldTransition);
    
    setRecommendedAction(fractalTime.getRecommendedAction());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollInterval);
    return () => clearInterval(interval);
  }, [refresh, pollInterval]);

  return {
    currentYuga,
    yugaProgress,
    sessionDuration,
    shouldTransition,
    recommendedAction
  };
}

// ============================================================================
// USE FRACTAL CYCLES - All nested cycles
// ============================================================================

interface UseFractalCyclesReturn {
  cycles: import('../types').NestedCycles | null;
  yugaTransition: {
    shouldTransition: boolean;
    from: import('../types').Yuga;
    to: import('../types').Yuga | null;
    urgency: 'none' | 'soon' | 'now';
  };
}

export function useFractalCycles(pollInterval: number = 60000): UseFractalCyclesReturn {
  const [cycles, setCycles] = useState<import('../types').NestedCycles | null>(null);
  const [yugaTransition, setYugaTransition] = useState({
    shouldTransition: false,
    from: 'krita' as import('../types').Yuga,
    to: null as import('../types').Yuga | null,
    urgency: 'none' as 'none' | 'soon' | 'now'
  });

  const refresh = useCallback(() => {
    const overview = kalachakra.getFractalOverview();
    setCycles(overview.cycles);
    setYugaTransition(overview.yugaTransition);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollInterval);
    return () => clearInterval(interval);
  }, [refresh, pollInterval]);

  return { cycles, yugaTransition };
}
