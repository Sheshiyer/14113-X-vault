/**
 * TaskJourneyMapper - Maps tasks to the Hero's Journey
 * 
 * Each task has a micro-journey within the 12 hero phases
 * This bridge helps track task progression through the journey
 */

import { useCallback } from 'react';
import { useKalachakraStore } from '../store/kalachakraStore';
import { HERO_PHASES, KOSHA_COLORS } from '../types/index';
import type { Task, HeroPhase, HeroPhaseNumber } from '../types/index';

export type JourneyStage = 
  | 'ordinaryWorld' 
  | 'call' 
  | 'threshold' 
  | 'ordeal' 
  | 'reward';

interface JourneyProgress {
  stage: JourneyStage;
  progress: number;
  overallProgress: number;
}

export const mapProgressToJourney = (progress: number): JourneyProgress => {
  if (progress < 0.1) {
    return { stage: 'ordinaryWorld', progress: progress / 0.1, overallProgress: progress };
  } else if (progress < 0.3) {
    return { stage: 'call', progress: (progress - 0.1) / 0.2, overallProgress: progress };
  } else if (progress < 0.5) {
    return { stage: 'threshold', progress: (progress - 0.3) / 0.2, overallProgress: progress };
  } else if (progress < 0.8) {
    return { stage: 'ordeal', progress: (progress - 0.5) / 0.3, overallProgress: progress };
  } else {
    return { stage: 'reward', progress: (progress - 0.8) / 0.2, overallProgress: progress };
  }
};

export const getJourneyGuidance = (stage: JourneyStage, task: Task): string => {
  const guidance = {
    ordinaryWorld: `Acknowledge: "${task.microJourney.ordinaryWorld}" — This is your starting point.`,
    call: `Listen: "${task.microJourney.call}" — The invitation is here.`,
    threshold: `Commit: "${task.microJourney.threshold}" — Cross when ready.`,
    ordeal: `Persist: "${task.microJourney.ordeal}" — This is the work.`,
    reward: `Receive: "${task.microJourney.reward}" — Integration awaits.`,
  };
  return guidance[stage];
};

export const useTaskJourney = () => {
  const tasks = useKalachakraStore((state) => state.tasks);
  const updateTask = useKalachakraStore((state) => state.updateTask);
  const completeTask = useKalachakraStore((state) => state.completeTask);
  
  const getTasksByPhase = useCallback((phase: HeroPhaseNumber) => {
    return tasks.filter(t => t.heroPhase === phase);
  }, [tasks]);
  
  const getTasksByStage = useCallback((stage: JourneyStage) => {
    return tasks.filter(t => {
      const journey = mapProgressToJourney(t.progress);
      return journey.stage === stage;
    });
  }, [tasks]);
  
  const advanceJourney = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const journey = mapProgressToJourney(task.progress);
    let newProgress = task.progress;
    
    switch (journey.stage) {
      case 'ordinaryWorld':
        newProgress = 0.15;
        break;
      case 'call':
        newProgress = 0.35;
        break;
      case 'threshold':
        newProgress = 0.55;
        break;
      case 'ordeal':
        newProgress = 0.85;
        break;
      case 'reward':
        newProgress = 1;
        completeTask(taskId);
        return;
    }
    
    updateTask(taskId, { 
      progress: newProgress,
      status: newProgress >= 1 ? 'completed' : newProgress > 0 ? 'active' : 'pending'
    });
  }, [tasks, updateTask, completeTask]);
  
  const syncTasks = useCallback(async () => {
    console.log('[TaskJourneyMapper] Syncing tasks...');
    await new Promise(resolve => setTimeout(resolve, 100));
    return tasks;
  }, [tasks]);
  
  const importTasks = useCallback(async (source: string) => {
    console.log(`[TaskJourneyMapper] Importing tasks from ${source}...`);
    return [];
  }, []);
  
  const exportTasks = useCallback(async (target: string) => {
    console.log(`[TaskJourneyMapper] Exporting tasks to ${target}...`);
    return tasks;
  }, [tasks]);
  
  const getJourneyStats = useCallback(() => {
    const stats = {
      total: tasks.length,
      byStage: {
        ordinaryWorld: 0,
        call: 0,
        threshold: 0,
        ordeal: 0,
        reward: 0,
      },
      byPhase: Array(12).fill(0).map((_, i) => ({
        phase: i + 1,
        count: 0,
        tasks: [] as Task[],
      })),
      completionRate: 0,
    };
    
    tasks.forEach(task => {
      const journey = mapProgressToJourney(task.progress);
      stats.byStage[journey.stage]++;
      stats.byPhase[task.heroPhase - 1].count++;
      stats.byPhase[task.heroPhase - 1].tasks.push(task);
    });
    
    const completed = tasks.filter(t => t.status === 'completed').length;
    stats.completionRate = tasks.length > 0 ? completed / tasks.length : 0;
    
    return stats;
  }, [tasks]);
  
  const suggestNextTask = useCallback((currentPhase?: number) => {
    let candidates = currentPhase 
      ? tasks.filter(t => t.heroPhase === currentPhase)
      : tasks;
    
    const inProgress = candidates.filter(t => t.status === 'in-progress' || t.status === 'active');
    if (inProgress.length > 0) {
      return inProgress.sort((a, b) => b.priority.localeCompare(a.priority))[0];
    }
    
    const highPriority = candidates.filter(t => 
      t.status === 'pending' && (t.priority === 'critical' || t.priority === 'high')
    );
    if (highPriority.length > 0) {
      return highPriority[0];
    }
    
    const pending = candidates.filter(t => t.status === 'pending');
    if (pending.length > 0) {
      return pending[0];
    }
    
    return null;
  }, [tasks]);
  
  return {
    tasks,
    getTasksByPhase,
    getTasksByStage,
    advanceJourney,
    syncTasks,
    importTasks,
    exportTasks,
    getJourneyStats,
    suggestNextTask,
    mapProgressToJourney,
    getJourneyGuidance,
  };
};

export const useTaskJourneyProgress = (taskId: string) => {
  const task = useKalachakraStore(
    (state) => state.tasks.find(t => t.id === taskId)
  );
  
  if (!task) {
    return {
      journey: null,
      guidance: '',
      nextAction: '',
    };
  }
  
  const journey = mapProgressToJourney(task.progress);
  const guidance = getJourneyGuidance(journey.stage, task);
  
  const nextActions = {
    ordinaryWorld: 'Recognize the current state',
    call: 'Acknowledge the invitation',
    threshold: 'Make the commitment',
    ordeal: 'Push through resistance',
    reward: 'Integrate the learning',
  };
  
  return {
    journey,
    guidance,
    nextAction: nextActions[journey.stage],
    isComplete: journey.stage === 'reward' && journey.progress >= 1,
  };
};

export const getJourneyVisualization = (task: Task) => {
  const journey = mapProgressToJourney(task.progress);
  const phase = HERO_PHASES[task.heroPhase - 1];
  
  return {
    currentStage: journey.stage,
    stageProgress: journey.progress,
    overallProgress: journey.overallProgress,
    heroPhase: phase,
    koshaColor: KOSHA_COLORS[phase?.kosha || 'annamaya'],
    milestones: [
      { stage: 'ordinaryWorld', label: 'Start', completed: journey.overallProgress >= 0.1 },
      { stage: 'call', label: 'Call', completed: journey.overallProgress >= 0.3 },
      { stage: 'threshold', label: 'Commit', completed: journey.overallProgress >= 0.5 },
      { stage: 'ordeal', label: 'Work', completed: journey.overallProgress >= 0.8 },
      { stage: 'reward', label: 'Complete', completed: journey.overallProgress >= 1 },
    ],
  };
};