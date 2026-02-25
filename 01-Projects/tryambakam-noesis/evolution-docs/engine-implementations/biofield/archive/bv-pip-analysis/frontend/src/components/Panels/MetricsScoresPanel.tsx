import React, { useMemo } from 'react';
import { ScoreTile } from '../Cards/ScoreTile';
import { LiveMetricsCard } from '../Cards/LiveMetricsCard';
import { SymmetrySnapshotCard, type SymmetrySnapshotData } from '../Cards/SymmetrySnapshotCard';

export interface Scores {
  energy: number;
  symmetry: number;
  coherence: number;
  complexity: number;
  regulation: number;
  colorBalance: number;
}

export interface Metrics {
  lqd: number;
  avgIntensity: number;
  innerNoise: number;
  fractalDim: number;
  hurstExp: number;
  horizontalSymmetry: number;
  verticalSymmetry: number;
}

interface MetricsScoresPanelProps {
  scores?: Scores;
  metrics?: Metrics;
  isBackendConnected?: boolean;
}

const getLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Moderate';
  if (score >= 50) return 'Fair';
  return 'Low';
};

const getTrend = (score: number): 'up' | 'down' | 'stable' => {
  // Simplified trend based on score value
  if (score >= 75) return 'up';
  if (score <= 55) return 'down';
  return 'stable';
};

export const MetricsScoresPanel: React.FC<MetricsScoresPanelProps> = ({ 
  scores = { energy: 78, symmetry: 85, coherence: 62, complexity: 71, regulation: 76, colorBalance: 92 },
  metrics = { lqd: 0.84, avgIntensity: 142, innerNoise: 12.4, fractalDim: 1.62, hurstExp: 0.72, horizontalSymmetry: 0.5, verticalSymmetry: 0.5 },
  isBackendConnected = false
}) => {
  // Derive symmetry snapshot data from actual computed symmetry metrics
  // Inner (Body) = horizontal symmetry (bilateral symmetry of the person)
  // Outer (Field) = vertical symmetry (top-bottom balance of the field)
  const symmetrySnapshotData: SymmetrySnapshotData = useMemo(() => ({
    innerSymmetry: Math.round(metrics.horizontalSymmetry * 100),
    outerSymmetry: Math.round(metrics.verticalSymmetry * 100),
  }), [metrics.horizontalSymmetry, metrics.verticalSymmetry]);

  return (
    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 sm:gap-4 overflow-visible lg:overflow-y-auto pr-0 lg:pr-1">
      
      {/* Local computation notice */}
      {!isBackendConnected && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-[10px] sm:text-xs text-yellow-300">
          <span className="font-semibold">Local Mode:</span> Scores estimated from video frame analysis. Start backend for accurate nonlinear dynamics.
        </div>
      )}
      
      {/* Composite Scores Grid - 3 cols on mobile, 2 on tablet+ */}
      <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3 min-h-[180px] sm:min-h-[280px] lg:h-[360px]">
         <ScoreTile title="Energy" score={scores.energy} trend={getTrend(scores.energy)} label={getLabel(scores.energy)} />
         <ScoreTile title="Symmetry" score={scores.symmetry} trend={getTrend(scores.symmetry)} label={getLabel(scores.symmetry)} />
         <ScoreTile title="Coherence" score={scores.coherence} trend={getTrend(scores.coherence)} label={getLabel(scores.coherence)} />
         <ScoreTile title="Complexity" score={scores.complexity} trend={getTrend(scores.complexity)} label={getLabel(scores.complexity)} />
         <ScoreTile title="Regulation" score={scores.regulation} trend={getTrend(scores.regulation)} label={getLabel(scores.regulation)} />
         <ScoreTile title="Color Bal" score={scores.colorBalance} trend={getTrend(scores.colorBalance)} label={getLabel(scores.colorBalance)} />
      </div>

      {/* Metrics cards - stacked on all sizes */}
      <div className="flex flex-col gap-3 sm:gap-4">
         <LiveMetricsCard metrics={metrics} />
         <SymmetrySnapshotCard data={symmetrySnapshotData} />
      </div>
    </div>
  );
};
