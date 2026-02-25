"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { BiorhythmCycles } from "@/lib/biorhythm/types";

// Hook to ensure consistent rendering between SSR and client
function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

export type WheelSize = "sm" | "md" | "lg";

export interface BiorhythmWheelProps {
  /** Birth date for calculation */
  birthDate: Date;
  /** Target date for calculation (defaults to now) */
  targetDate?: Date;
  /** Size variant */
  size?: WheelSize;
  /** Custom className */
  className?: string;
  /** Show legend with current percentages */
  showLegend?: boolean;
  /** Pre-calculated cycle values (optional - will calculate if not provided) */
  cycles?: BiorhythmCycles;
}

interface CycleConfig {
  name: string;
  period: number;
  color: string;
  radius: number;
  strokeWidth: number;
}

const CYCLE_CONFIGS: CycleConfig[] = [
  {
    name: "Physical",
    period: 23,
    color: "#E74C3C", // Red (life)
    radius: 88,
    strokeWidth: 8,
  },
  {
    name: "Emotional",
    period: 28,
    color: "#9B59B6", // Purple (transform)
    radius: 72,
    strokeWidth: 8,
  },
  {
    name: "Intellectual",
    period: 33,
    color: "#3498DB", // Blue (witness)
    radius: 56,
    strokeWidth: 8,
  },
  {
    name: "Spiritual",
    period: 38,
    color: "#F1C40F", // Gold (solar)
    radius: 40,
    strokeWidth: 8,
  },
];

const SIZE_CONFIGS: Record<WheelSize, { width: number; height: number; viewBox: number }> = {
  sm: { width: 152, height: 152, viewBox: 200 },
  md: { width: 264, height: 264, viewBox: 200 },
  lg: { width: 440, height: 440, viewBox: 200 },
};

/** Calculate cycle value using sine wave formula */
function calculateCycleValue(birthDate: Date, targetDate: Date, period: number): number {
  const diffTime = targetDate.getTime() - birthDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return Math.sin((2 * Math.PI * diffDays) / period);
}

/** Calculate all cycle values */
function calculateAllCycles(birthDate: Date, targetDate: Date): BiorhythmCycles {
  return {
    physical: calculateCycleValue(birthDate, targetDate, 23),
    emotional: calculateCycleValue(birthDate, targetDate, 28),
    intellectual: calculateCycleValue(birthDate, targetDate, 33),
    spiritual: calculateCycleValue(birthDate, targetDate, 38),
  };
}

/** Get rotation angle based on cycle progress (0-360) */
function getCycleRotation(birthDate: Date, targetDate: Date, period: number): number {
  const diffTime = targetDate.getTime() - birthDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const cycleProgress = (diffDays % period) / period;
  return cycleProgress * 360;
}

/** Check if value is at peak (> 0.8) */
function isPeak(value: number, threshold = 0.8): boolean {
  return value >= threshold;
}

export const BiorhythmWheel: React.FC<BiorhythmWheelProps> = ({
  birthDate,
  targetDate: propTargetDate,
  size = "md",
  className,
  showLegend = true,
  cycles: propCycles,
}) => {
  const mounted = useMounted();
  // Use a consistent date for SSR, then switch to actual date on client
  const targetDate = mounted ? (propTargetDate || new Date()) : new Date("2024-01-01T00:00:00Z");
  const cycles = propCycles || calculateAllCycles(birthDate, targetDate);
  const sizeConfig = SIZE_CONFIGS[size];
  const center = sizeConfig.viewBox / 2;

  const cycleValues = [
    cycles.physical,
    cycles.emotional,
    cycles.intellectual,
    cycles.spiritual,
  ];

  return (
    <div className={cn("flex flex-col items-center gap-[13px]", className)}>
      <div
        className="relative"
        style={{ width: sizeConfig.width, height: sizeConfig.height }}
      >
        <svg
          viewBox={`0 0 ${sizeConfig.viewBox} ${sizeConfig.viewBox}`}
          className="w-full h-full"
          role="img"
          aria-label="Biorhythm wheel showing four cycles: Physical, Emotional, Intellectual, and Spiritual"
        >
          <defs>
            {/* Glow filter for peaks */}
            <filter id="peak-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Gradient definitions */}
            {CYCLE_CONFIGS.map((config, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={config.color} stopOpacity="0.3" />
                <stop offset="50%" stopColor={config.color} stopOpacity="1" />
                <stop offset="100%" stopColor={config.color} stopOpacity="0.3" />
              </linearGradient>
            ))}
          </defs>

          {/* Background circles */}
          {CYCLE_CONFIGS.map((config, index) => (
            <circle
              key={`bg-${index}`}
              cx={center}
              cy={center}
              r={config.radius}
              fill="none"
              stroke={config.color}
              strokeWidth={config.strokeWidth}
              opacity={0.13}
            />
          ))}

          {/* Animated progress rings */}
          {CYCLE_CONFIGS.map((config, index) => {
            const rotation = getCycleRotation(birthDate, targetDate, config.period);
            const value = cycleValues[index];
            const atPeak = isPeak(value);
            const circumference = 2 * Math.PI * config.radius;
            // Dash offset based on cycle value (-1 to 1 mapped to arc length)
            const arcLength = ((value + 1) / 2) * circumference;

            return (
              <g key={`ring-${index}`}>
                {/* Rotating indicator */}
                <g
                  transform={`rotate(${rotation}, ${center}, ${center})`}
                  className="transition-transform duration-[800ms] ease-out"
                >
                  <circle
                    cx={center}
                    cy={center - config.radius}
                    r={config.strokeWidth}
                    fill={config.color}
                    filter={atPeak ? "url(#peak-glow)" : undefined}
                    className={cn(
                      "transition-all duration-8",
                      atPeak && "animate-pulse-8"
                    )}
                  />
                </g>

                {/* Active arc showing current value */}
                <circle
                  cx={center}
                  cy={center}
                  r={config.radius}
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth={config.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeDashoffset={-circumference * 0.25}
                  transform={`rotate(-90, ${center}, ${center})`}
                  className="transition-all duration-8"
                  opacity={0.88}
                />

                {/* Peak indicator star */}
                {atPeak && (
                  <g
                    transform={`rotate(${rotation}, ${center}, ${center})`}
                    className="animate-pulse-8"
                  >
                    <polygon
                      points={`${center},${center - config.radius - 13} 
                               ${center + 4},${center - config.radius - 4} 
                               ${center + 13},${center - config.radius} 
                               ${center + 4},${center - config.radius + 4} 
                               ${center},${center - config.radius + 13} 
                               ${center - 4},${center - config.radius + 4} 
                               ${center - 13},${center - config.radius} 
                               ${center - 4},${center - config.radius - 4}`}
                      fill={config.color}
                      opacity={0.88}
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Center indicator */}
          <circle
            cx={center}
            cy={center}
            r={19}
            fill="#0A0A0F"
            stroke="#495057"
            strokeWidth={2}
          />
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#f5f5f7"
            fontSize="13"
            fontWeight="500"
          >
            ☉
          </text>
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-x-[21px] gap-y-[8px]">
          {CYCLE_CONFIGS.map((config, index) => {
            const value = cycleValues[index];
            const percentage = Math.round(value * 100);
            const atPeak = isPeak(value);

            return (
              <div
                key={`legend-${index}`}
                className={cn(
                  "flex items-center gap-[8px] text-[13px]",
                  atPeak && "font-medium"
                )}
              >
                <span
                  className="w-[8px] h-[8px] rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-text-muted">{config.name}:</span>
                <span
                  className={cn(
                    "tabular-nums",
                    value > 0 ? "text-build" : "text-life"
                  )}
                >
                  {percentage > 0 ? "+" : ""}
                  {percentage}%
                </span>
                {atPeak && (
                  <svg
                    className="w-[13px] h-[13px] text-solar"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

BiorhythmWheel.displayName = "BiorhythmWheel";

export default BiorhythmWheel;
