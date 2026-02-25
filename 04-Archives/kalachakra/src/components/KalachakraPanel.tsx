/**
 * KalachakraPanel - Dashboard Integration Component
 * 
 * A compact view of Kalachakra that can be embedded in Brahman-Darshanam
 * Shows current temporal state, active tasks, and quick actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  Wind, 
  Target,
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useKalachakraStore } from '../store/kalachakraStore';
import { useKhaloree, useVayu, useCliffordOctave } from '../bridge/NoesisBridge';
import { useTaskJourney } from '../bridge/TaskJourneyMapper';
import { HERO_PHASES, KOSHA_COLORS, YUGA_DATA } from '../types/index';

interface KalachakraPanelProps {
  compact?: boolean;
  onExpand?: () => void;
}

// Mini Mandala - Compact circular view
const MiniMandala: React.FC = () => {
  const { state } = useKalachakraStore();
  const currentPhase = state.heroPhase?.number || 1;
  const yuga = state.yugaOfTheMoment?.name || 'krita';
  
  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={YUGA_DATA[yuga].color}
          strokeWidth="2"
          strokeOpacity="0.5"
        />
        
        {HERO_PHASES.map((phase, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 50 + Math.cos(angle) * 38;
          const y = 50 + Math.sin(angle) * 38;
          const isActive = currentPhase === phase.number;
          
          return (
            <circle
              key={phase.number}
              cx={x}
              cy={y}
              r={isActive ? 4 : 2}
              fill={isActive ? KOSHA_COLORS[phase.kosha] : '#444'}
            />
          );
        })}
        
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill={YUGA_DATA[yuga].color}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </svg>
    </div>
  );
};

// Khalorēē indicator
const KhaloreeIndicator: React.FC = () => {
  const { percentage, status, recommendation } = useKhaloree();
  
  const statusColors = {
    optimal: '#22c55e',
    good: '#00D9C0',
    depleted: '#F59E0B',
    critical: '#ef4444',
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: statusColors[status] }} />
          <span className="text-xs text-gray-400">Khalorēē</span>
        </div>
        <span className="text-sm font-mono font-bold" style={{ color: statusColors[status] }}>
          {percentage}%
        </span>
      </div>
      
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: statusColors[status] }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-[10px] text-gray-500 leading-tight">{recommendation}</p>
    </div>
  );
};

// Current task card
const CurrentTaskCard: React.FC = () => {
  const { suggestNextTask } = useTaskJourney();
  const { setSelectedTask } = useKalachakraStore();
  const task = suggestNextTask();
  
  if (!task) {
    return (
      <div className="glass rounded-lg p-3 text-center">
        <Sparkles className="w-5 h-5 text-gray-500 mx-auto mb-1" />
        <p className="text-xs text-gray-400">No active tasks</p>
        <p className="text-[10px] text-gray-600">Time for reflection</p>
      </div>
    );
  }
  
  const phase = HERO_PHASES[task.heroPhase - 1];
  
  return (
    <motion.div
      className="glass rounded-lg p-3 cursor-pointer hover:bg-white/5 transition-colors"
      onClick={() => setSelectedTask(task)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: `${KOSHA_COLORS[phase?.kosha || 'annamaya']}20`,
            color: KOSHA_COLORS[phase?.kosha || 'annamaya']
          }}
        >
          {task.heroPhase}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{task.name}</p>
          <p className="text-[10px]" style={{ color: KOSHA_COLORS[phase?.kosha || 'annamaya'] }}>
            {phase?.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-white/10 rounded-full">
              <div 
                className="h-full rounded-full bg-accent-cyan"
                style={{ width: `${task.progress * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400">{Math.round(task.progress * 100)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Temporal status card
const TemporalStatus: React.FC = () => {
  const { state } = useKalachakraStore();
  const { name: octaveName } = useCliffordOctave();
  const vayu = useVayu();
  
  const yuga = state.yugaOfTheMoment?.name || 'krita';
  const phase = state.heroPhase;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: YUGA_DATA[yuga].color }}
          />
          <span className="text-xs text-gray-400">Yuga</span>
        </div>
        <span className="text-xs font-medium" style={{ color: YUGA_DATA[yuga].color }}>
          {YUGA_DATA[yuga].name}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">Octave</span>
        </div>
        <span className="text-xs text-white">{octaveName}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wind className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">Vāyu</span>
        </div>
        <span className="text-xs" style={{ color: KOSHA_COLORS[vayu.associatedKosha] }}>
          {vayu.name}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">Phase</span>
        </div>
        <span className="text-xs text-white">
          {phase?.number}. {phase?.name?.slice(0, 12)}...
        </span>
      </div>
    </div>
  );
};

export const KalachakraPanel: React.FC<KalachakraPanelProps> = ({ 
  compact = false,
  onExpand 
}) => {
  const { state } = useKalachakraStore();
  
  if (compact) {
    return (
      <motion.div
        className="glass rounded-xl p-4 w-64 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onExpand}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <MiniMandala />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-accent-cyan" />
              <span className="text-xs text-gray-400">कालचक्र</span>
            </div>
            
            <div className="text-sm font-medium text-white">
              {YUGA_DATA[state.yugaOfTheMoment?.name || 'krita'].name}
            </div>
            
            <div className="text-[10px] text-gray-500">
              Phase {state.heroPhase?.number}
            </div>
          </div>
          
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="glass rounded-xl p-6 max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          
          <div>
            <h2 className="font-bold text-white">कालचक्र</h2>
            <p className="text-xs text-gray-500">Fractal Time Calendar</p>
          </div>
        </div>
        
        <MiniMandala />
      </div>
      
      <div className="mb-6">
        <TemporalStatus />
      </div>
      
      <div className="mb-6">
        <KhaloreeIndicator />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Current Focus</span>
          <span className="text-[10px] text-accent-cyan">{state.tasks.filter(t => t.status === 'in-progress').length} active</span>
        </div>
        <CurrentTaskCard />
      </div>
      
      <div className="flex gap-2 mt-4">
        <button className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-300">
          Mandala
        </button>
        <button className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-300">
          River
        </button>
        <button className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-300">
          Stars
        </button>
      </div>
    </motion.div>
  );
};

export default KalachakraPanel;