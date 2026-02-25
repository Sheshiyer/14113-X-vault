import React from 'react';
import { GlassCard } from './GlassCard';
import { Activity } from 'lucide-react';

interface MetricItemProps {
  label: string;
  value: string;
  unit?: string;
}

interface LiveMetricsCardProps {
  metrics?: {
    lqd: number;
    avgIntensity: number;
    innerNoise: number;
    fractalDim: number;
    hurstExp: number;
  };
}

const MetricRow: React.FC<MetricItemProps> = ({ label, value, unit }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
    <span className="text-xs text-pip-text-secondary">{label}</span>
    <div className="flex items-center gap-1">
       <span className="text-sm font-mono font-medium text-white">{value}</span>
       {unit && <span className="text-[10px] text-pip-text-muted">{unit}</span>}
    </div>
  </div>
);

export const LiveMetricsCard: React.FC<LiveMetricsCardProps> = ({ 
  metrics = { lqd: 0.84, avgIntensity: 142, innerNoise: 12.4, fractalDim: 1.62, hurstExp: 0.72 }
}) => {
  return (
    <GlassCard className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
         <Activity className="w-4 h-4 text-pip-accent" />
         <h3 className="text-sm font-semibold text-white">Live Metrics</h3>
      </div>
      
      <div className="flex flex-col">
         <MetricRow label="LQD" value={metrics.lqd.toFixed(2)} />
         <MetricRow label="Avg Intensity" value={Math.round(metrics.avgIntensity).toString()} />
         <MetricRow label="Inner Noise" value={metrics.innerNoise.toFixed(1)} unit="%" />
         <MetricRow label="Fractal Dim" value={metrics.fractalDim.toFixed(2)} />
         <MetricRow label="Hurst Exp" value={metrics.hurstExp.toFixed(2)} />
      </div>
    </GlassCard>
  );
};
