/**
 * MandalaCalendar - Circular View of Fractal Time
 * 
 * Center: Brahman (current moment)
 * Concentric rings: Hours → Days → Weeks → Moon phases
 * 12 spokes: Hero's Journey phases
 * Tasks as nodes on the rings
 * Pulsing with Khalorēē from Noesis
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Task, KalachakraState } from '../types/index';
import { HERO_PHASES } from '../engine/HeroJourneyMap';

interface MandalaCalendarProps {
  tasks: Task[];
  state: KalachakraState;
  width?: number;
  height?: number;
  onTaskSelect?: (task: Task) => void;
  selectedTaskId?: string;
}

// Local constants
const COLORS = {
  void: '#0a0a0f',
  cyan: '#00D9C0',
  gold: '#FFD700',
  amber: '#F39C12',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  iron: '#4A5568',
  white: '#e4e4e7',
};

const KOSHA_COLORS: Record<string, string> = {
  annamaya: '#FF6B6B',
  pranamaya: '#00D9C0',
  manomaya: '#9B59B6',
  vijnanamaya: '#3498DB',
  anandamaya: '#F39C12',
  all: '#FFD700',
};

const YUGA_DATA: Record<string, { name: string; color: string; metal: string; description: string; recommendation: string }> = {
  krita: {
    name: 'Krita Yuga',
    color: '#FFD700',
    metal: 'Gold',
    description: 'The Golden Age — Flow state, effortless creation',
    recommendation: 'Create! This is your peak window.',
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
    recommendation: 'Switch to lighter tasks. Take breaks.',
  },
  kali: {
    name: 'Kali Yuga',
    color: '#4A5568',
    metal: 'Iron',
    description: 'The Iron Age — Collapse, negative returns',
    recommendation: 'STOP. Rest, breathe, move.',
  },
};

interface TimeRing {
  level: 'moment' | 'hour' | 'day' | 'week' | 'moon';
  radius: number;
  tasks: Task[];
  color: string;
}

// Brahman center node
const BrahmanCenter: React.FC<{ khaloree: number; yuga: string; pulsePhase: number }> = ({ 
  khaloree, yuga, pulsePhase 
}) => {
  const yugaColor = YUGA_DATA[yuga]?.color || COLORS.gold;
  const pulseScale = 1 + (khaloree / 100) * 0.3 * pulsePhase;
  
  return (
    <motion.g>
      {[...Array(4)].map((_, i) => (
        <motion.circle
          key={i}
          r={30 + i * 15}
          fill="none"
          stroke={yugaColor}
          strokeWidth={1}
          strokeOpacity={0.3 - i * 0.05}
          animate={{
            r: [30 + i * 15, 35 + i * 15, 30 + i * 15],
            strokeOpacity: [0.3 - i * 0.05, 0.5 - i * 0.05, 0.3 - i * 0.05],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      
      <motion.circle r={25} fill={`url(#brahmanGradient)`}
        animate={{ scale: [1, pulseScale, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.circle r={8} fill={COLORS.white}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <text y={55} textAnchor="middle" fill={COLORS.cyan} fontSize="10" fontFamily="JetBrains Mono, monospace">
        {Math.round(khaloree)}%
      </text>
    </motion.g>
  );
};

// Hero's Journey spoke
const HeroSpoke: React.FC<{
  phase: typeof HERO_PHASES[number];
  angle: number;
  maxRadius: number;
  isActive: boolean;
}> = ({ phase, angle, maxRadius, isActive }) => {
  const radians = (angle - 90) * (Math.PI / 180);
  const x2 = Math.cos(radians) * maxRadius;
  const y2 = Math.sin(radians) * maxRadius;
  const koshaColor = KOSHA_COLORS[phase.kosha] || COLORS.cyan;
  
  const labelRadius = maxRadius + 20;
  const labelX = Math.cos(radians) * labelRadius;
  const labelY = Math.sin(radians) * labelRadius;
  
  return (
    <motion.g>
      <motion.line x1={0} y1={0} x2={x2} y2={y2}
        stroke={koshaColor}
        strokeWidth={isActive ? 2 : 0.5}
        strokeOpacity={isActive ? 0.8 : 0.2}
        animate={isActive ? { strokeOpacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <circle cx={x2 * 0.15} cy={y2 * 0.15} r={isActive ? 8 : 5}
        fill={koshaColor} opacity={isActive ? 1 : 0.3}
      />
      <text x={x2 * 0.15} y={y2 * 0.15} dy="0.35em" textAnchor="middle"
        fill={COLORS.void} fontSize={isActive ? "8" : "6"} fontWeight="bold">
        {phase.number}
      </text>
      
      <text x={labelX} y={labelY} dy="0.35em"
        textAnchor={labelX > 0 ? "start" : "end"}
        fill={isActive ? koshaColor : COLORS.white}
        fontSize="9" fontFamily="Inter, sans-serif" opacity={isActive ? 1 : 0.4}>
        {phase.name}
      </text>
    </motion.g>
  );
};

// Time ring component
const TimeRingComponent: React.FC<{
  ring: TimeRing;
  tasks: Task[];
  onTaskSelect?: (task: Task) => void;
  selectedTaskId?: string;
}> = ({ ring, tasks, onTaskSelect, selectedTaskId }) => {
  const ringTasks = tasks.filter(t => {
    if (ring.level === 'hour') return t.estimatedDuration <= 60;
    if (ring.level === 'day') return t.estimatedDuration <= 480;
    if (ring.level === 'week') return t.estimatedDuration <= 2400;
    return true;
  });
  
  return (
    <motion.g>
      <motion.circle r={ring.radius} fill="none" stroke={ring.color}
        strokeWidth={1} strokeOpacity={0.3}
        strokeDasharray={ring.level === 'moon' ? "5,5" : "none"}
        animate={{ strokeOpacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <text x={ring.radius} y={-5} fill={ring.color}
        fontSize="8" fontFamily="JetBrains Mono, monospace" opacity={0.6}>
        {ring.level.toUpperCase()}
      </text>
      
      {ringTasks.map((task, i) => {
        const angle = (i / Math.max(ringTasks.length, 1)) * 360;
        const radians = (angle - 90) * (Math.PI / 180);
        const jitter = Math.sin(task.id.charCodeAt(0)) * 10;
        const x = Math.cos(radians) * (ring.radius + jitter);
        const y = Math.sin(radians) * (ring.radius + jitter);
        const isSelected = selectedTaskId === task.id;
        const phase = HERO_PHASES.find(p => p.number === task.heroPhase);
        const taskColor = KOSHA_COLORS[phase?.kosha || 'annamaya'];
        const isActive = task.status === 'active';
        
        return (
          <motion.g key={task.id} style={{ cursor: 'pointer' }} onClick={() => onTaskSelect?.(task)}
            whileHover={{ scale: 1.2 }}>
            {isSelected && (
              <motion.circle cx={x} cy={y} r={12} fill={taskColor} opacity={0.3}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <motion.circle cx={x} cy={y}
              r={isSelected ? 8 : 5}
              fill={taskColor}
              stroke={isSelected ? COLORS.white : 'none'}
              strokeWidth={2}
              opacity={task.status === 'completed' ? 0.3 : 0.9}
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.g>
        );
      })}
    </motion.g>
  );
};

// Main MandalaCalendar component
export const MandalaCalendar: React.FC<MandalaCalendarProps> = ({
  tasks, state, width = 600, height = 600, onTaskSelect, selectedTaskId,
}) => {
  const [pulsePhase, setPulsePhase] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => setPulsePhase(p => (p + 0.1) % (2 * Math.PI)), 100);
    return () => clearInterval(interval);
  }, []);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 80;
  
  const timeRings: TimeRing[] = useMemo(() => [
    { level: 'hour', radius: maxRadius * 0.25, tasks: [], color: COLORS.cyan },
    { level: 'day', radius: maxRadius * 0.5, tasks: [], color: COLORS.amber },
    { level: 'week', radius: maxRadius * 0.75, tasks: [], color: COLORS.gold },
    { level: 'moon', radius: maxRadius, tasks: [], color: COLORS.silver },
  ], [maxRadius]);
  
  const khaloree = state.noesis?.khaloree || 50;
  const yuga = state.yugaOfTheMoment?.name || 'treta';
  const heroPhaseNumber = state.heroPhase?.number || 1;
  
  return (
    <motion.div className="relative rounded-xl overflow-hidden"
      style={{ width, height, background: `radial-gradient(circle at center, ${COLORS.void} 0%, #0D1117 100%)` }}
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
      
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `radial-gradient(circle at center, ${COLORS.cyan} 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
      />
      
      <svg width={width} height={height} className="absolute inset-0">
        <defs>
          <radialGradient id="brahmanGradient">
            <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.8" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.4" />
            <stop offset="100%" stopColor={COLORS.void} stopOpacity="0" />
          </radialGradient>
          <filter id="mandalaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        
        <g transform={`translate(${centerX}, ${centerY})`} filter="url(#mandalaGlow)">
          {timeRings.map(ring => (
            <TimeRingComponent key={ring.level} ring={ring} tasks={tasks}
              onTaskSelect={onTaskSelect} selectedTaskId={selectedTaskId} />
          ))}
          
          {HERO_PHASES.map((phase, i) => (
            <HeroSpoke key={phase.number} phase={phase} angle={i * 30}
              maxRadius={maxRadius} isActive={heroPhaseNumber === phase.number} />
          ))}
          
          <BrahmanCenter khaloree={khaloree} yuga={yuga} pulsePhase={Math.sin(pulsePhase)} />
        </g>
      </svg>
      
      <motion.div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg backdrop-blur-md bg-black/40 border border-white/10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: YUGA_DATA[yuga]?.color }} />
          <span className="text-xs uppercase tracking-wider" style={{ color: YUGA_DATA[yuga]?.color }}>
            {YUGA_DATA[yuga]?.name}
          </span>
        </div>
        <div className="text-sm text-white font-medium">{state.tarotOfTheDay?.name}</div>
        <div className="text-xs opacity-60">{state.tarotOfTheDay?.meaning?.upright?.slice(0, 50)}...</div>
      </motion.div>
      
      <motion.div className="absolute bottom-4 right-4 px-3 py-2 rounded-lg backdrop-blur-md bg-black/40 border border-white/10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="text-xs text-gray-400 mb-1">Tasks</div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-cyan-400">
              {tasks.filter(t => t.status === 'active').length}
            </div>
            <div className="text-[10px] text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-amber-400">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-[10px] text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-green-400">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-[10px] text-gray-500">Done</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MandalaCalendar;
