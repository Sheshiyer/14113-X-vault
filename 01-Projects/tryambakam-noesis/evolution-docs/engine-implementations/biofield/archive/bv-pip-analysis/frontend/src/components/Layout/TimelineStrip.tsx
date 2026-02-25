import React, { useState } from 'react';
import { GlassCard } from '../Cards/GlassCard';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export interface TimelineDataPoint {
  time: number;
  energy: number;
  symmetry: number;
  coherence?: number;
}

interface TimelineStripProps {
  data?: TimelineDataPoint[];
  sessionDuration?: number; // in seconds
}

// Format seconds to HH:MM:SS
const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const TimelineStrip: React.FC<TimelineStripProps> = ({ 
  data = [],
  sessionDuration = 0
}) => {
  const [visibleMetrics, setVisibleMetrics] = useState<Set<string>>(new Set(['energy', 'symmetry', 'coherence']));

  const toggleMetric = (metric: string) => {
    setVisibleMetrics(prev => {
      const next = new Set(prev);
      if (next.has(metric)) {
        next.delete(metric);
      } else {
        next.add(metric);
      }
      return next;
    });
  };

  // Use provided data or generate placeholder
  const chartData = data.length > 0 ? data : Array.from({ length: 30 }, (_, i) => ({
    time: i,
    energy: 50,
    symmetry: 50,
    coherence: 50,
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 z-40">
      <GlassCard className="h-20 sm:h-28 lg:h-32 w-full flex items-center gap-2 sm:gap-4 lg:gap-6 !p-2 !rounded-lg sm:!rounded-xl">
        {/* Controls - hidden on mobile */}
        <div className="hidden sm:flex flex-col gap-1 sm:gap-2 min-w-[80px] lg:min-w-[120px] px-2 lg:px-4">
          <span className="text-[10px] lg:text-xs font-semibold text-pip-text-muted uppercase tracking-wider">Timeline</span>
          <div className="flex flex-wrap gap-1 lg:gap-2">
            <button 
              onClick={() => toggleMetric('energy')}
              className={`text-[8px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full border transition-colors ${
                visibleMetrics.has('energy') 
                  ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300' 
                  : 'border-pip-border bg-white/5 text-pip-text-secondary hover:bg-white/10'
              }`}
            >
              Energy
            </button>
            <button 
              onClick={() => toggleMetric('symmetry')}
              className={`text-[8px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full border transition-colors ${
                visibleMetrics.has('symmetry') 
                  ? 'border-green-500/50 bg-green-500/20 text-green-300' 
                  : 'border-pip-border bg-white/5 text-pip-text-secondary hover:bg-white/10'
              }`}
            >
              Symmetry
            </button>
            <button 
              onClick={() => toggleMetric('coherence')}
              className={`text-[8px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full border transition-colors ${
                visibleMetrics.has('coherence') 
                  ? 'border-amber-500/50 bg-amber-500/20 text-amber-300' 
                  : 'border-pip-border bg-white/5 text-pip-text-secondary hover:bg-white/10'
              }`}
            >
              Coherence
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 h-full py-1 sm:py-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis hide domain={[0, 100]} />
              {visibleMetrics.has('energy') && (
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#6366f1" 
                  strokeWidth={1.5} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              )}
              {visibleMetrics.has('symmetry') && (
                <Line 
                  type="monotone" 
                  dataKey="symmetry" 
                  stroke="#22c55e" 
                  strokeWidth={1.5} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              )}
              {visibleMetrics.has('coherence') && (
                <Line 
                  type="monotone" 
                  dataKey="coherence" 
                  stroke="#f59e0b" 
                  strokeWidth={1.5} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Session Time */}
        <div className="min-w-[80px] sm:min-w-[100px] lg:min-w-[150px] border-l border-pip-border pl-2 sm:pl-4 lg:pl-6 h-14 sm:h-16 lg:h-20 flex flex-col justify-center gap-0.5 sm:gap-1 lg:gap-2">
           <div className="text-[10px] sm:text-xs text-pip-text-muted">Session</div>
           <div className="text-sm sm:text-lg lg:text-xl font-mono text-white">
             {formatDuration(sessionDuration)}
           </div>
        </div>
      </GlassCard>
    </div>
  );
};
