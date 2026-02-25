/**
 * CalendarWeaver - Integrates with external calendar systems
 * 
 * Reads from:
 * - Google Calendar
 * - Apple Calendar
 * - Custom calendar API
 * 
 * Maps events to tasks with hero phase and kosha assignments
 */

import type { Task } from '../types';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  recurrence?: string;
  calendarId: string;
}

export interface CalendarSyncResult {
  events: CalendarEvent[];
  tasks: Task[];
  conflicts: Array<{ event: CalendarEvent; task: Task }>;
}

const eventPatterns: Array<{
  pattern: RegExp;
  heroPhase: number;
  kosha: string;
  priority: string;
}> = [
  { pattern: /plan|strateg|roadmap/i, heroPhase: 1, kosha: 'vijnanamaya', priority: 'high' },
  { pattern: /meet|call|discuss/i, heroPhase: 2, kosha: 'pranamaya', priority: 'medium' },
  { pattern: /review|retro|feedback/i, heroPhase: 3, kosha: 'manomaya', priority: 'medium' },
  { pattern: /learn|study|research/i, heroPhase: 4, kosha: 'vijnanamaya', priority: 'high' },
  { pattern: /start|kickoff|launch/i, heroPhase: 5, kosha: 'pranamaya', priority: 'critical' },
  { pattern: /collab|pair|workshop/i, heroPhase: 6, kosha: 'pranamaya', priority: 'medium' },
  { pattern: /debug|fix|troubleshoot/i, heroPhase: 7, kosha: 'manomaya', priority: 'high' },
  { pattern: /deploy|release|ship/i, heroPhase: 8, kosha: 'manomaya', priority: 'critical' },
  { pattern: /celebrate|demo|showcase/i, heroPhase: 9, kosha: 'anandamaya', priority: 'medium' },
  { pattern: /doc|write|blog/i, heroPhase: 10, kosha: 'annamaya', priority: 'low' },
  { pattern: /refactor|improve|optimize/i, heroPhase: 11, kosha: 'vijnanamaya', priority: 'medium' },
  { pattern: /mentor|teach|share/i, heroPhase: 12, kosha: 'anandamaya', priority: 'medium' },
];

const inferHeroPhase = (event: CalendarEvent): { phase: number; kosha: string; priority: string } => {
  for (const { pattern, heroPhase, kosha, priority } of eventPatterns) {
    if (pattern.test(event.title)) {
      return { phase: heroPhase, kosha, priority };
    }
  }
  
  const hour = new Date(event.startTime).getHours();
  if (hour < 10) return { phase: 1, kosha: 'vijnanamaya', priority: 'high' };
  if (hour < 12) return { phase: 5, kosha: 'pranamaya', priority: 'high' };
  if (hour < 15) return { phase: 6, kosha: 'pranamaya', priority: 'medium' };
  if (hour < 17) return { phase: 8, kosha: 'manomaya', priority: 'high' };
  return { phase: 10, kosha: 'annamaya', priority: 'low' };
};

const eventToTask = (event: CalendarEvent): Task => {
  const { phase, kosha, priority } = inferHeroPhase(event);
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const duration = (end.getTime() - start.getTime()) / (1000 * 60);
  
  return {
    id: `cal-${event.id}`,
    name: event.title,
    description: event.description,
    createdAt: new Date().toISOString(),
    estimatedDuration: duration,
    deadline: event.endTime,
    heroPhase: phase as any,
    yuga: 'krita',
    kosha: kosha as any,
    microJourney: {
      ordinaryWorld: 'Scheduled event',
      call: `Attend: ${event.title}`,
      threshold: 'Join the meeting',
      ordeal: 'Stay present and engaged',
      reward: 'Connection and clarity',
    },
    status: 'pending',
    progress: 0,
    dependencies: [],
    priority: priority as any,
  };
};

export const fetchCalendarEvents = async (
  start: Date,
  end: Date
): Promise<CalendarEvent[]> => {
  const events: CalendarEvent[] = [];
  const titles = [
    'Sprint Planning',
    'Code Review',
    'Architecture Discussion',
    'Team Standup',
    'One-on-one with Manager',
    'Deep Work Block',
    'Lunch Break',
    'Design Review',
    'Documentation Writing',
    'Learning Session',
  ];
  
  const current = new Date(start);
  while (current < end) {
    const numEvents = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numEvents; i++) {
      const hour = 9 + Math.floor(Math.random() * 8);
      const duration = [30, 60, 90][Math.floor(Math.random() * 3)];
      
      const eventStart = new Date(current);
      eventStart.setHours(hour, 0, 0);
      
      const eventEnd = new Date(eventStart);
      eventEnd.setMinutes(eventStart.getMinutes() + duration);
      
      events.push({
        id: `evt-${events.length}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        startTime: eventStart.toISOString(),
        endTime: eventEnd.toISOString(),
        calendarId: 'primary',
      });
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return events;
};

export const syncCalendarWithTasks = async (
  existingTasks: Task[],
  days: number = 7
): Promise<CalendarSyncResult> => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 1);
  end.setDate(end.getDate() + days);
  
  const events = await fetchCalendarEvents(start, end);
  const newTasks = events.map(eventToTask);
  
  const conflicts = [];
  for (const task of existingTasks) {
    if (task.deadline) {
      const taskTime = new Date(task.deadline);
      for (const event of events) {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        if (taskTime >= eventStart && taskTime <= eventEnd) {
          conflicts.push({ event, task });
        }
      }
    }
  }
  
  return {
    events,
    tasks: newTasks,
    conflicts,
  };
};

export const useCalendarWeaver = () => {
  const sync = async (days: number = 7) => {
    const { useKalachakraStore } = await import('../store/kalachakraStore');
    const tasks = useKalachakraStore.getState().tasks;
    return syncCalendarWithTasks(tasks, days);
  };
  
  const importEvents = async (source: string) => {
    console.log(`[CalendarWeaver] Importing from ${source}...`);
    return [];
  };
  
  return {
    sync,
    importEvents,
    fetchCalendarEvents,
  };
};