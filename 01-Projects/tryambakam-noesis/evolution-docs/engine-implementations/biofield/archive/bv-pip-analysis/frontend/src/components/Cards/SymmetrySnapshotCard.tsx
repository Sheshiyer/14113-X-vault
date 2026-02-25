import React from 'react';
import { GlassCard } from './GlassCard';
import { Scaling } from 'lucide-react';

export interface SymmetrySnapshotData {
  innerSymmetry: number; // 0-100
  outerSymmetry: number; // 0-100
}

interface SymmetrySnapshotCardProps {
  data?: SymmetrySnapshotData;
}

// Get color based on symmetry value
const getSymmetryColor = (value: number): string => {
  if (value >= 80) return 'bg-pip-success/80';
  if (value >= 60) return 'bg-yellow-500/80';
  return 'bg-orange-500/80';
};

// Calculate bar widths based on symmetry (higher symmetry = more balanced bars)
const calculateBarWidths = (symmetry: number): { left: number; gap: number; right: number } => {
  // At 100% symmetry, bars are equal (50-0-50)
  // At lower symmetry, gap increases and bars become unequal
  const gapPercent = Math.max(4, (100 - symmetry) * 0.3); // 4-30% gap
  const remainingWidth = 100 - gapPercent;
  
  // Add slight asymmetry for visual interest at lower values
  const asymmetryFactor = (100 - symmetry) / 200; // 0-0.5
  const leftWidth = (remainingWidth / 2) * (1 - asymmetryFactor);
  const rightWidth = (remainingWidth / 2) * (1 + asymmetryFactor);
  
  return {
    left: leftWidth,
    gap: gapPercent,
    right: rightWidth
  };
};

export const SymmetrySnapshotCard: React.FC<SymmetrySnapshotCardProps> = ({ 
  data = { innerSymmetry: 50, outerSymmetry: 50 } 
}) => {
  const innerWidths = calculateBarWidths(data.innerSymmetry);
  const outerWidths = calculateBarWidths(data.outerSymmetry);
  const innerColor = getSymmetryColor(data.innerSymmetry);
  const outerColor = getSymmetryColor(data.outerSymmetry);

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
         <Scaling className="w-4 h-4 text-pip-accent" />
         <h3 className="text-sm font-semibold text-white">Symmetry Snapshot</h3>
      </div>

      <div className="space-y-4">
         {/* Inner Symmetry (Body) */}
         <div>
            <div className="flex justify-between text-xs text-pip-text-secondary mb-1">
               <span>Inner (Body)</span>
               <span className="text-white font-mono">{data.innerSymmetry}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
               <div 
                 className={`h-full ${innerColor} rounded-l-full transition-all duration-500`}
                 style={{ width: `${innerWidths.left}%` }}
               />
               <div 
                 className="h-full bg-transparent relative transition-all duration-500"
                 style={{ width: `${innerWidths.gap}%` }}
               >
                   <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2"></div>
               </div>
               <div 
                 className={`h-full ${innerColor} rounded-r-full transition-all duration-500`}
                 style={{ width: `${innerWidths.right}%` }}
               />
            </div>
         </div>

         {/* Outer Symmetry (Field) */}
         <div>
            <div className="flex justify-between text-xs text-pip-text-secondary mb-1">
               <span>Outer (Field)</span>
               <span className="text-white font-mono">{data.outerSymmetry}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
               <div 
                 className={`h-full ${outerColor} rounded-l-full transition-all duration-500`}
                 style={{ width: `${outerWidths.left}%` }}
               />
               <div 
                 className="h-full bg-transparent relative transition-all duration-500"
                 style={{ width: `${outerWidths.gap}%` }}
               >
                   <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2"></div>
               </div>
               <div 
                 className={`h-full ${outerColor} rounded-r-full transition-all duration-500`}
                 style={{ width: `${outerWidths.right}%` }}
               />
            </div>
         </div>
      </div>
    </GlassCard>
  );
};
