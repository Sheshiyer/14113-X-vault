/**
 * ConstellationMap - Network View of Tasks
 * 
 * Tasks as stars
 * Dependencies as constellation lines
 * Hero phases as regions of sky
 * Tarot influences as zodiacal bands
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, KalachakraState } from '../types/index';
import { HERO_PHASES } from '../engine/HeroJourneyMap';

interface ConstellationMapProps {
  tasks: Task[];
  state: KalachakraState;
  width?: number;
  height?: number;
  onTaskSelect?: (task: Task) => void;
  selectedTaskId?: string;
}

const COLORS = {
  void: '#0a0a0f', cyan: '#00D9C0', gold: '#FFD700', amber: '#F39C12',
  silver: '#C0C0C0', bronze: '#CD7F32', white: '#e4e4e7', starDim: '#4A5568',
};

const KOSHA_COLORS: Record<string, string> = {
  annamaya: '#FF6B6B', pranamaya: '#00D9C0', manomaya: '#9B59B6',
  vijnanamaya: '#3498DB', anandamaya: '#F39C12', all: '#FFD700',
};

interface Star {
  id: string; x: number; y: number; size: number; brightness: number; task: Task; constellation: number;
}

interface ConstellationLineType { from: string; to: string; strength: number; }

const BackgroundStar: React.FC<{ x: number; y: number; size: number; opacity: number; delay: number }> = 
({ x, y, size, opacity, delay }) => (
  <motion.circle cx={x} cy={y} r={size} fill={COLORS.white} opacity={opacity}
    animate={{ opacity: [opacity, opacity * 0.3, opacity] }}
    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const TaskStar: React.FC<{ star: Star; isSelected: boolean; onClick: () => void }> = ({ star, isSelected, onClick }) => {
  const phase = HERO_PHASES.find(p => p.number === star.task.heroPhase);
  const koshaColor = KOSHA_COLORS[phase?.kosha || 'annamaya'];
  const isActive = star.task.status === 'active';
  
  return (
    <motion.g style={{ cursor: 'pointer' }} onClick={onClick} whileHover={{ scale: 1.2 }}>
      <motion.circle cx={star.x} cy={star.y} r={star.size * 3}
        fill={`url(#starGlow-${star.id})`} opacity={isSelected ? 0.6 : isActive ? 0.3 : 0.1}
        animate={isActive ? { r: [star.size * 3, star.size * 4, star.size * 3], opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx={star.x} cy={star.y} r={isSelected ? star.size * 1.5 : star.size}
        fill={koshaColor} stroke={isSelected ? COLORS.white : 'none'} strokeWidth={2}
        animate={isActive ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
      />
      {star.brightness > 0.7 && (
        <>
          <line x1={star.x} y1={star.y - star.size * 2} x2={star.x} y2={star.y + star.size * 2}
            stroke={koshaColor} strokeWidth={0.5} opacity={0.5} />
          <line x1={star.x - star.size * 2} y1={star.y} x2={star.x + star.size * 2} y2={star.y}
            stroke={koshaColor} strokeWidth={0.5} opacity={0.5} />
        </>
      )}
      <AnimatePresence>
        {isSelected && (
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
            <rect x={star.x + 15} y={star.y - 25} width="140" height="50" rx="6"
              fill={`${COLORS.void}E0`} stroke={koshaColor} strokeWidth={1} strokeOpacity={0.5} />
            <text x={star.x + 25} y={star.y - 10} fill={COLORS.white} fontSize="11" fontWeight="500">
              {star.task.name.length > 18 ? star.task.name.slice(0, 18) + '...' : star.task.name}
            </text>
            <text x={star.x + 25} y={star.y + 5} fill={koshaColor} fontSize="9">{phase?.name}</text>
          </motion.g>
        )}
      </AnimatePresence>
    </motion.g>
  );
};

export const ConstellationMap: React.FC<ConstellationMapProps> = ({
  tasks, state, width = 800, height = 800, onTaskSelect, selectedTaskId,
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  
  const backgroundStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({ x: Math.random() * width, y: Math.random() * height,
        size: 0.5 + Math.random() * 1.5, opacity: 0.2 + Math.random() * 0.5, delay: Math.random() * 3 });
    }
    return stars;
  }, [width, height]);
  
  const taskStars = useMemo((): Star[] => tasks.map((task, i) => {
    const angle = (task.heroPhase / 12) * Math.PI * 2 + (i * 0.3);
    const distance = 180 + (task.estimatedDuration / 120) * 150 + Math.sin(i) * 50;
    const jitterX = Math.sin(task.id.charCodeAt(0)) * 30;
    const jitterY = Math.cos(task.id.charCodeAt(0)) * 30;
    return {
      id: task.id, x: centerX + Math.cos(angle) * distance + jitterX,
      y: centerY + Math.sin(angle) * distance + jitterY,
      size: 4 + (task.estimatedDuration > 60 ? 6 : task.estimatedDuration > 30 ? 4 : 2),
      brightness: 0.3 + (task.progress) * 0.7, task, constellation: task.heroPhase,
    };
  }), [tasks, centerX, centerY]);
  
  const constellationLines = useMemo(() => {
    const lines: ConstellationLineType[] = [];
    tasks.forEach(task => {
      task.dependencies?.forEach(depId => {
        const fromStar = taskStars.find(s => s.task.id === depId);
        const toStar = taskStars.find(s => s.task.id === task.id);
        if (fromStar && toStar) lines.push({ from: depId, to: task.id, strength: 0.5 });
      });
    });
    return lines;
  }, [tasks, taskStars]);
  
  const heroPhaseNumber = state.heroPhase?.number || 1;
  const tarotName = state.tarotOfTheDay?.name || 'The Fool';
  const tarotKosha = state.tarotOfTheDay?.kosha || 'annamaya';
  
  return (
    <motion.div className="relative rounded-xl overflow-hidden"
      style={{ width, height, background: `radial-gradient(ellipse at center, #0D2137 0%, ${COLORS.void} 70%)` }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      
      <svg width={width} height={height} className="absolute inset-0">
        <defs>
          {taskStars.map(star => (
            <radialGradient key={star.id} id={`starGlow-${star.id}`}>
              <stop offset="0%" stopColor={KOSHA_COLORS[HERO_PHASES.find(p => p.number === star.task.heroPhase)?.kosha || 'annamaya']} stopOpacity="0.6" />
              <stop offset="100%" stopColor={KOSHA_COLORS[HERO_PHASES.find(p => p.number === star.task.heroPhase)?.kosha || 'annamaya']} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        
        <g opacity={0.6}>
          {backgroundStars.map((star, i) => <BackgroundStar key={i} {...star} />)}
        </g>
        
        {HERO_PHASES.map((phase, i) => {
          const angle = i * 30;
          const rad = (angle - 90) * (Math.PI / 180);
          const r = 120;
          const x = centerX + Math.cos(rad) * r;
          const y = centerY + Math.sin(rad) * r;
          const isActive = heroPhaseNumber === phase.number;
          const koshaColor = KOSHA_COLORS[phase.kosha];
          
          return (
            <motion.g key={phase.number}>
              <motion.circle cx={x} cy={y} r={isActive ? 15 : 8} fill={koshaColor}
                opacity={isActive ? 0.8 : 0.2}
                animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text x={x} y={y} dy="0.35em" textAnchor="middle" fill={COLORS.void}
                fontSize={isActive ? "10" : "7"} fontWeight="bold">{phase.number}</text>
            </motion.g>
          );
        })}
        
        <g opacity={0.5}>
          {constellationLines.map((line, i) => {
            const fromStar = taskStars.find(s => s.id === line.from);
            const toStar = taskStars.find(s => s.id === line.to);
            if (!fromStar || !toStar) return null;
            const isHighlighted = selectedTaskId === line.from || selectedTaskId === line.to;
            return (
              <motion.line key={i} x1={fromStar.x} y1={fromStar.y} x2={toStar.x} y2={toStar.y}
                stroke={COLORS.cyan} strokeWidth={isHighlighted ? 2 : 0.5}
                strokeOpacity={line.strength * (isHighlighted ? 1 : 0.3)}
                strokeDasharray={isHighlighted ? "none" : "3,3"}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
              />
            );
          })}
        </g>
        
        {taskStars.map(star => (
          <TaskStar key={star.id} star={star} isSelected={selectedTaskId === star.id}
            onClick={() => onTaskSelect?.(star.task)} />
        ))}
        
        <motion.g>
          <motion.circle cx={centerX} cy={centerY} r={20}
            fill={`url(#starGlow-center)`}
            animate={{ r: [20, 25, 20], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle cx={centerX} cy={centerY} r={6} fill={COLORS.white} />
        </motion.g>
        
        <radialGradient id="starGlow-center">
          <stop offset="0%" stopColor={KOSHA_COLORS[tarotKosha]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={KOSHA_COLORS[tarotKosha]} stopOpacity="0" />
        </radialGradient>
      </svg>
      
      <motion.div className="absolute bottom-4 left-4 px-4 py-3 rounded-lg backdrop-blur-xl bg-black/60 border border-white/10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Constellation Guide</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-gray-300">Active</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-gray-300">Completed</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400" /><span className="text-gray-300">Pending</span></div>
        </div>
      </motion.div>
      
      <motion.div className="absolute top-4 right-4 px-4 py-3 rounded-lg backdrop-blur-xl bg-black/60 border text-right"
        style={{ borderColor: `${KOSHA_COLORS[tarotKosha]}40` }}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <div className="text-xs uppercase tracking-wider mb-1" style={{ color: KOSHA_COLORS[tarotKosha] }}>{tarotName}</div>
        <div className="text-sm text-white font-medium">Hero Phase {heroPhaseNumber}: {HERO_PHASES.find(p => p.number === heroPhaseNumber)?.name}</div>
        <div className="text-xs text-gray-400 mt-1">{Math.round((state.heroPhase?.progress || 0) * 100)}% complete</div>
      </motion.div>
    </motion.div>
  );
};

export default ConstellationMap;
