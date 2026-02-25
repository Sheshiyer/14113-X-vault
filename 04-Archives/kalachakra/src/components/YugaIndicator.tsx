/**
 * YugaIndicator - Real-time Yuga State Display
 * 
 * Shows current Yuga based on Noesis data
 * Krita (gold) → Treta (silver) → Dvapara (bronze) → Kali (iron)
 * Recommendation based on state
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { KalachakraState } from '../types/index';

interface YugaIndicatorProps {
  state: KalachakraState;
  width?: number;
  compact?: boolean;
}

type YugaName = 'krita' | 'treta' | 'dvapara' | 'kali';

const COLORS = {
  void: '#0a0a0f', cyan: '#00D9C0', gold: '#FFD700', amber: '#F39C12',
  silver: '#C0C0C0', bronze: '#CD7F32', iron: '#4A5568', white: '#e4e4e7',
};

const YUGA_DATA: Record<YugaName, { name: string; sanskrit: string; color: string; metal: string; description: string; recommendation: string }> = {
  krita: {
    name: 'Krita Yuga', sanskrit: 'कृत', color: '#FFD700', metal: 'Gold',
    description: 'The Golden Age — Flow state, effortless creation',
    recommendation: 'Create! This is your peak window. Tackle the hardest problems.',
  },
  treta: {
    name: 'Treta Yuga', sanskrit: 'त्रेता', color: '#C0C0C0', metal: 'Silver',
    description: 'The Silver Age — Solid progress with some friction',
    recommendation: 'Build steadily. Good time for feature development.',
  },
  dvapara: {
    name: 'Dvapara Yuga', sanskrit: 'द्वापर', color: '#CD7F32', metal: 'Bronze',
    description: 'The Bronze Age — The grind, forcing through resistance',
    recommendation: 'Switch to lighter tasks. Take breaks. Consider pairing.',
  },
  kali: {
    name: 'Kali Yuga', sanskrit: 'कलि', color: '#4A5568', metal: 'Iron',
    description: 'The Iron Age — Collapse, negative returns',
    recommendation: 'STOP. Rest, breathe, move. Return after recovery.',
  },
};

const YugaSegment: React.FC<{ yuga: YugaName; isActive: boolean; isPast: boolean; index: number; total: number }> = 
({ yuga, isActive, isPast, index, total }) => {
  const data = YUGA_DATA[yuga];
  const anglePerSegment = 360 / total;
  const startAngle = index * anglePerSegment;
  const endAngle = (index + 1) * anglePerSegment;
  const radius = 60;
  const center = 75;
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);
  const x1 = center + Math.cos(startRad) * radius;
  const y1 = center + Math.sin(startRad) * radius;
  const x2 = center + Math.cos(endRad) * radius;
  const y2 = center + Math.sin(endRad) * radius;
  const largeArcFlag = anglePerSegment > 180 ? 1 : 0;
  const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  
  return (
    <motion.path d={path}
      fill={isActive ? data.color : isPast ? `${data.color}40` : `${data.color}15`}
      stroke={isActive ? data.color : 'transparent'} strokeWidth={isActive ? 2 : 0}
      animate={isActive ? { fillOpacity: [1, 0.8, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

const MetalShimmer: React.FC<{ color: string }> = ({ color }) => (
  <motion.div className="absolute inset-0 rounded-full"
    style={{ background: `linear-gradient(135deg, transparent 0%, ${color}20 25%, ${color}40 50%, ${color}20 75%, transparent 100%)`, backgroundSize: '200% 200%' }}
    animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
  />
);

const KhaloreeBar: React.FC<{ value: number; yugaColor: string }> = ({ value, yugaColor }) => {
  const getBarColor = () => {
    if (value > 70) return '#2ECC71';
    if (value > 40) return yugaColor;
    if (value > 20) return '#FF6B35';
    return '#FF0040';
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">Khalorēē (Energy)</span>
        <motion.span className="font-mono font-bold" style={{ color: getBarColor() }}
          key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
        >{Math.round(value)}%</motion.span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full relative" style={{ backgroundColor: getBarColor() }}
          initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.div className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
            animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
      <div className="flex justify-between text-[10px] mt-1">
        <span className="text-gray-600">Depleted</span>
        <motion.span className="uppercase tracking-wider font-medium" style={{ color: getBarColor() }}
        >{value > 70 ? 'Abundant' : value > 40 ? 'Moderate' : value > 20 ? 'Depleted' : 'Critical'}</motion.span>
        <span className="text-gray-600">Abundant</span>
      </div>
    </div>
  );
};

const VikaraIndicator: React.FC<{ value: number }> = ({ value }) => {
  const isStable = value < 30;
  const isWarning = value >= 30 && value < 70;
  const isCritical = value >= 70;
  const color = isStable ? '#2ECC71' : isWarning ? '#FF6B35' : '#FF0040';
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Vikara (Drift)</span>
          <span className="font-mono" style={{ color }}>{Math.round(value)}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
            initial={{ width: 0 }} animate={{ width: `${value}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>
      <motion.div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}
        animate={isCritical ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}
      >
        <span className="text-sm">{isStable ? '✓' : isWarning ? '!' : '✕'}</span>
      </motion.div>
    </div>
  );
};

const RecommendationCard: React.FC<{ yuga: YugaName; khaloree: number; vikara: number }> = ({ yuga, khaloree, vikara }) => {
  const data = YUGA_DATA[yuga];
  const getRec = () => {
    if (khaloree < 20 || vikara > 80) {
      return { title: 'URGENT: Rest Required', message: 'Your energy reserves are critically low. Step away.', action: 'Take a 20-minute break', icon: '🛑' };
    }
    return {
      title: data.name, message: data.recommendation,
      action: yuga === 'krita' ? 'Create without hesitation' : yuga === 'treta' ? 'Continue with steady rhythm' : yuga === 'dvapara' ? 'Switch to lighter tasks' : 'Stop. Restore. Return renewed.',
      icon: yuga === 'krita' ? '☀️' : yuga === 'treta' ? '🥈' : yuga === 'dvapara' ? '⚙️' : '⚫',
    };
  };
  const rec = getRec();
  
  return (
    <motion.div className="mt-4 p-4 rounded-lg border"
      style={{ backgroundColor: `${data.color}10`, borderColor: `${data.color}30` }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={yuga + khaloree + vikara}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{rec.icon}</span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-1">{rec.title}</h4>
          <p className="text-xs text-gray-300 mb-2">{rec.message}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${data.color}20`, color: data.color }}
          >
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            {rec.action}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CompactYugaIndicator: React.FC<{ state: KalachakraState }> = ({ state }) => {
  const yuga = state.yugaOfTheMoment?.name as YugaName || 'treta';
  const data = YUGA_DATA[yuga];
  const khaloree = state.noesis?.khaloree || 50;
  
  return (
    <motion.div className="flex items-center gap-3 px-3 py-2 rounded-lg backdrop-blur-md bg-black/40 border"
      style={{ borderColor: `${data.color}30` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="relative" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: data.color }} />
        <motion.div className="absolute inset-0 rounded-full" style={{ backgroundColor: data.color }}
          animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white truncate">{data.name}</span>
          <span className="text-xs font-mono" style={{ color: data.color }}>{Math.round(khaloree)}%</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ backgroundColor: data.color }}
            animate={{ width: `${khaloree}%` }} transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const YugaIndicator: React.FC<YugaIndicatorProps> = ({ state, width = 350, compact = false }) => {
  if (compact) return <CompactYugaIndicator state={state} />;
  
  const yugas: YugaName[] = ['krita', 'treta', 'dvapara', 'kali'];
  const currentYuga = state.yugaOfTheMoment?.name as YugaName || 'treta';
  const currentYugaIndex = yugas.indexOf(currentYuga);
  const data = YUGA_DATA[currentYuga];
  const khaloree = state.noesis?.khaloree || 50;
  const vikara = state.noesis?.vikara || 30;
  const vayu = state.currentVayu?.name || 'prana';
  
  return (
    <motion.div className="rounded-xl overflow-hidden"
      style={{ width, background: `linear-gradient(180deg, ${COLORS.void} 0%, #0D1117 100%)` }}
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: `${data.color}20` }}>
        <div className="flex items-center gap-2">
          <motion.div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}
            animate={{ scale: [1, 1.2, 1], boxShadow: [`0 0 0px ${data.color}`, `0 0 10px ${data.color}`, `0 0 0px ${data.color}`] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div>
            <span className="text-sm font-semibold text-white">{data.name}</span>
            <span className="text-xs text-gray-500 ml-2">({data.sanskrit})</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{data.metal} Age</span>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-[150px] h-[150px] flex-shrink-0">
            <svg width="150" height="150" className="transform -rotate-90">
              <circle cx="75" cy="75" r="55" fill="none" stroke="#333" strokeWidth="8" />
              {yugas.map((yuga, i) => (
                <YugaSegment key={yuga} yuga={yuga} isActive={yuga === currentYuga} isPast={i < currentYugaIndex}
                  index={i} total={yugas.length} />
              ))}
              <text x="75" y="70" textAnchor="middle" fill={data.color} fontSize="24" fontWeight="bold" transform="rotate(90, 75, 75)">{Math.round(khaloree)}</text>
              <text x="75" y="88" textAnchor="middle" fill="#666" fontSize="10" transform="rotate(90, 75, 75)">%</text>
            </svg>
            <MetalShimmer color={data.color} />
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-300 mb-2">{data.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Vayu:</span>
              <span className="text-cyan-400 capitalize">{vayu}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <KhaloreeBar value={khaloree} yugaColor={data.color} />
          <VikaraIndicator value={vikara} />
        </div>
        
        <RecommendationCard yuga={currentYuga} khaloree={khaloree} vikara={vikara} />
      </div>
      
      <div className="px-4 py-2 text-center text-[10px] text-gray-500 border-t" style={{ borderColor: `${data.color}10` }}>
        The cycle turns: Krita → Treta → Dvapara → Kali → Krita...
      </div>
    </motion.div>
  );
};

export default YugaIndicator;
