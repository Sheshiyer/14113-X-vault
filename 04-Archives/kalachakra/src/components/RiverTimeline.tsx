/**
 * RiverTimeline - Flowing View of Time
 * 
 * Prana-Vahini style flowing river
 * Tasks as stones/eddies in the flow
 * Current position indicator
 * Upstream (past) / Downstream (future)
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, KalachakraState } from '../types/index';
import { HERO_PHASES } from '../engine/HeroJourneyMap';

interface RiverTimelineProps {
  tasks: Task[];
  state: KalachakraState;
  width?: number;
  height?: number;
  onTaskSelect?: (task: Task) => void;
  selectedTaskId?: string;
}

const COLORS = {
  void: '#0a0a0f',
  cyan: '#00D9C0',
  gold: '#FFD700',
  amber: '#F39C12',
  riverDeep: '#0A1929',
  riverSurface: '#00D9C020',
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

const YUGA_DATA: Record<string, { color: string }> = {
  krita: { color: '#FFD700' },
  treta: { color: '#C0C0C0' },
  dvapara: { color: '#CD7F32' },
  kali: { color: '#4A5568' },
};

// Flow particle
const FlowParticle: React.FC<{ delay: number; y: number; speed: number }> = ({ delay, y, speed }) => (
  <motion.div className="absolute w-1.5 h-1.5 rounded-full"
    style={{ backgroundColor: COLORS.cyan, boxShadow: `0 0 6px ${COLORS.cyan}`, top: y }}
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
    transition={{ duration: speed, repeat: Infinity, delay, ease: "linear" }}
  />
);

// Eddy around task
const Eddy: React.FC<{ x: number; y: number; size: number; color: string; intensity: number }> = 
({ x, y, size, color, intensity }) => (
  <motion.div className="absolute pointer-events-none"
    style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }}>
    {[...Array(3)].map((_, i) => (
      <motion.div key={i} className="absolute rounded-full border"
        style={{ width: size - i * 10, height: size - i * 10, left: i * 5, top: i * 5, borderColor: color, borderWidth: 1 }}
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1], opacity: [0.3 * intensity, 0.6 * intensity, 0.3 * intensity] }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </motion.div>
);

// Task stone
const TaskStone: React.FC<{ task: Task; x: number; y: number; isSelected: boolean; onClick: () => void }> = 
({ task, x, y, isSelected, onClick }) => {
  const phase = HERO_PHASES.find(p => p.number === task.heroPhase);
  const koshaColor = KOSHA_COLORS[phase?.kosha || 'annamaya'];
  const size = 20 + (task.estimatedDuration > 60 ? 10 : task.estimatedDuration > 30 ? 5 : 0);
  const isActive = task.status === 'active';
  
  const statusColors: Record<string, string> = {
    pending: '#888888', active: COLORS.cyan, completed: '#2ECC71', paused: '#FF6B35', abandoned: '#FF0040',
  };
  
  return (
    <motion.div className="absolute cursor-pointer" style={{ left: x - size / 2, top: y - size / 2 }}
      onClick={onClick} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
      {isSelected && (
        <motion.div className="absolute rounded-full"
          style={{ width: size * 2, height: size * 2, left: -size / 2, top: -size / 2,
            background: `radial-gradient(circle, ${koshaColor}40 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <motion.div className="relative rounded-full flex items-center justify-center"
        style={{ width: size, height: size,
          background: `linear-gradient(135deg, ${koshaColor}80 0%, ${koshaColor}30 100%)`,
          boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.5), inset 2px 2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.3)`,
          border: `1px solid ${koshaColor}60`,
        }}
        animate={isActive ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <motion.div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
          style={{ backgroundColor: statusColors[task.status], borderColor: COLORS.void }}
          animate={isActive ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-xs font-bold" style={{ color: COLORS.white }}>{task.heroPhase}</span>
      </motion.div>
      
      <Eddy x={size / 2} y={size / 2} size={size * 2.5} color={koshaColor} intensity={isActive ? 1 : 0.5} />
      
      <AnimatePresence>
        {isSelected && (
          <motion.div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-10"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <div className="px-3 py-2 rounded-lg backdrop-blur-xl bg-black/80 border whitespace-nowrap" style={{ borderColor: `${koshaColor}40` }}>
              <p className="text-sm font-medium text-white">{task.name}</p>
              <p className="text-xs" style={{ color: koshaColor }}>{phase?.name} • {task.estimatedDuration}min</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Current moment indicator
const CurrentMomentIndicator: React.FC<{ x: number; khaloree: number; yuga: string }> = ({ x, khaloree, yuga }) => {
  const yugaColor = YUGA_DATA[yuga]?.color || COLORS.gold;
  
  return (
    <motion.div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: x }}>
      <motion.div className="absolute top-0 bottom-0 w-px"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${yugaColor} 20%, ${yugaColor} 80%, transparent 100%)`, left: 0 }}
        animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: yugaColor, boxShadow: `0 0 20px ${yugaColor}60` }}>
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
        <motion.div className="absolute inset-0 rounded-full" style={{ backgroundColor: yugaColor }}
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      <motion.div className="absolute top-4 -translate-x-1/2 px-2 py-1 rounded text-xs font-mono uppercase tracking-wider"
        style={{ backgroundColor: `${yugaColor}20`, color: yugaColor, border: `1px solid ${yugaColor}40` }}>
        NOW
      </motion.div>
    </motion.div>
  );
};

// Main RiverTimeline component
export const RiverTimeline: React.FC<RiverTimelineProps> = ({
  tasks, state, width = 1000, height = 400, onTaskSelect, selectedTaskId,
}) => {
  const flowParticles = useMemo(() => {
    const particles = [];
    const riverHeight = height * 0.6;
    const riverTop = (height - riverHeight) / 2;
    for (let i = 0; i < 30; i++) {
      particles.push(<FlowParticle key={i} delay={i * 0.2} y={riverTop + Math.random() * riverHeight} speed={8 + Math.random() * 4} />);
    }
    return particles;
  }, [height]);
  
  const positionedTasks = useMemo(() => {
    const riverHeight = height * 0.6;
    return tasks.map((task, i) => {
      const baseX = ((i + 1) / (tasks.length + 1)) * width * 0.8 + width * 0.1;
      const jitterX = Math.sin(task.id.charCodeAt(0)) * 30;
      const x = baseX + jitterX;
      const phaseOffset = (task.heroPhase - 6.5) / 6;
      const y = height / 2 + phaseOffset * (riverHeight * 0.35);
      return { task, x, y };
    });
  }, [tasks, width, height]);
  
  const currentX = width * 0.3;
  const khaloree = state.noesis?.khaloree || 50;
  const yuga = state.yugaOfTheMoment?.name || 'treta';
  const vayu = state.currentVayu?.name || 'prana';
  
  return (
    <motion.div className="relative rounded-xl overflow-hidden"
      style={{ width, height, background: `linear-gradient(180deg, ${COLORS.void} 0%, ${COLORS.riverDeep} 50%, ${COLORS.void} 100%)` }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `linear-gradient(90deg, ${COLORS.cyan}20 1px, transparent 1px), linear-gradient(${COLORS.cyan}20 1px, transparent 1px)`, backgroundSize: '50px 40px' }}
      />
      
      <div className="absolute left-0 right-0 rounded-full"
        style={{ top: height * 0.2, height: height * 0.6,
          background: `linear-gradient(180deg, transparent 0%, ${COLORS.riverSurface} 10%, ${COLORS.riverSurface} 50%, ${COLORS.riverSurface} 90%, transparent 100%)`,
        }}>
        {flowParticles}
      </div>
      
      <CurrentMomentIndicator x={currentX} khaloree={khaloree} yuga={yuga} />
      
      {positionedTasks.map(({ task, x, y }) => (
        <TaskStone key={task.id} task={task} x={x} y={y}
          isSelected={selectedTaskId === task.id} onClick={() => onTaskSelect?.(task)} />
      ))}
      
      {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => (
        <motion.div key={i} className="absolute bottom-4 flex flex-col items-center"
          style={{ left: `${pos * 100}%`, transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
          <div className="w-px h-3 bg-white/20 mb-1" />
          <span className="text-xs text-gray-500 font-mono">{pos === 0 ? '-2h' : pos === 0.25 ? '-1h' : pos === 0.5 ? 'Now' : pos === 0.75 ? '+1h' : '+2h'}</span>
        </motion.div>
      ))}
      
      <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md bg-black/40 border border-white/10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.cyan }}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
        />
        <span className="text-xs text-cyan-400 uppercase tracking-wider">Prana-Vahini Flow</span>
        <span className="text-xs text-gray-400 capitalize">{vayu}</span>
      </motion.div>
    </motion.div>
  );
};

export default RiverTimeline;
