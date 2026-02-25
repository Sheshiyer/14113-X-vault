"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { BiorhythmCycles } from "@/lib/biorhythm/types";
import { countPeakCycles, isHighEnergyDay } from "@/lib/biorhythm/peaks";
import { Badge } from "@/components/ui/badge";

export interface BiorhythmStatusBadgeProps {
  /** Pre-calculated cycle values */
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
  /** Custom className */
  className?: string;
  /** Badge size */
  size?: "sm" | "md";
  /** Show detailed breakdown */
  detailed?: boolean;
  /** Threshold for peak detection (default: 0.8) */
  peakThreshold?: number;
  /** Threshold for spiritual awakening (default: 0.9) */
  awakeningThreshold?: number;
}

type DominantCycle = "physical" | "emotional" | "intellectual" | "spiritual" | "balanced";
type StatusType = "normal" | "peak" | "flow" | "awakening" | "low" | "critical";

interface StatusConfig {
  label: string;
  variant: "default" | "peak" | "flow" | "high" | "low" | "critical";
  icon: React.ReactNode;
  description: string;
}

const PEAK_THRESHOLD = 0.8;
const AWAKENING_THRESHOLD = 0.9;
const LOW_THRESHOLD = -0.8;

/** Get the dominant cycle */
function getDominantCycle(cycles: BiorhythmCycles): DominantCycle {
  const entries = Object.entries(cycles) as [keyof BiorhythmCycles, number][];
  const max = Math.max(...entries.map(([, v]) => v));
  const min = Math.min(...entries.map(([, v]) => v));
  
  // If range is small, it's balanced
  if (max - min < 0.3) return "balanced";
  
  const dominant = entries.find(([, v]) => v === max);
  return dominant ? dominant[0] : "balanced";
}

/** Get status type based on cycles */
function getStatusType(
  cycles: BiorhythmCycles,
  peakThreshold: number,
  awakeningThreshold: number
): StatusType {
  const peakCount = countPeakCycles(cycles, peakThreshold);
  const highEnergy = isHighEnergyDay(cycles, peakThreshold);
  
  // Check for spiritual awakening (spiritual > 0.9 and at least one other peak)
  const spiritualAwakening =
    cycles.spiritual >= awakeningThreshold && peakCount >= 2;
  if (spiritualAwakening) return "awakening";
  
  // Check for flow state (3+ peaks or high energy)
  if (peakCount >= 3 || highEnergy) return "flow";
  
  // Check for peak (at least one peak)
  if (peakCount >= 1) return "peak";
  
  // Check for critical (all cycles near zero)
  const allNearZero = Object.values(cycles).every((v) => Math.abs(v) < 0.1);
  if (allNearZero) return "critical";
  
  // Check for low (all cycles below threshold)
  const allLow = Object.values(cycles).every((v) => v < LOW_THRESHOLD);
  if (allLow) return "low";
  
  return "normal";
}

/** Get status configuration */
function getStatusConfig(type: StatusType, dominant: DominantCycle): StatusConfig {
  const configs: Record<StatusType, StatusConfig> = {
    normal: {
      label: "Balanced",
      variant: "default",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      description: "Your cycles are in harmony",
    },
    peak: {
      label: `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} Peak`,
      variant: "peak",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      ),
      description: `Your ${dominant} cycle is at its peak`,
    },
    flow: {
      label: "Flow State",
      variant: "flow",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v18" />
          <path d="m6 9 12 6" />
          <path d="m6 15 12-6" />
        </svg>
      ),
      description: "Multiple cycles aligned - optimal performance",
    },
    awakening: {
      label: "Spiritual Awakening",
      variant: "peak",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ),
      description: "Spiritual cycle at its highest - profound insights possible",
    },
    low: {
      label: "Rest Phase",
      variant: "low",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ),
      description: "All cycles in rest phase - conserve energy",
    },
    critical: {
      label: "Critical Day",
      variant: "critical",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
      description: "All cycles crossing zero - take extra care",
    },
  };

  return configs[type];
}

/** Get color for cycle */
function getCycleColor(cycle: DominantCycle): string {
  const colors: Record<DominantCycle, string> = {
    physical: "text-life",
    emotional: "text-transform",
    intellectual: "text-witness",
    spiritual: "text-solar",
    balanced: "text-text-muted",
  };
  return colors[cycle];
}

export const BiorhythmStatusBadge: React.FC<BiorhythmStatusBadgeProps> = ({
  physical,
  emotional,
  intellectual,
  spiritual,
  className,
  size = "md",
  detailed = false,
  peakThreshold = PEAK_THRESHOLD,
  awakeningThreshold = AWAKENING_THRESHOLD,
}) => {
  const cycles: BiorhythmCycles = { physical, emotional, intellectual, spiritual };
  
  const dominant = getDominantCycle(cycles);
  const statusType = getStatusType(cycles, peakThreshold, awakeningThreshold);
  const statusConfig = getStatusConfig(statusType, dominant);
  const peakCount = countPeakCycles(cycles, peakThreshold);

  if (!detailed) {
    return (
      <Badge
        variant={statusConfig.variant}
        size={size}
        className={cn(className)}
      >
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>
    );
  }

  return (
    <div className={cn("space-y-[8px]", className)}>
      {/* Main status badge */}
      <Badge
        variant={statusConfig.variant}
        size={size}
        className="w-full justify-center"
      >
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>

      {/* Description */}
      <p className="text-[13px] text-text-muted text-center">
        {statusConfig.description}
      </p>

      {/* Cycle breakdown */}
      <div className="pt-[8px] border-t border-void-700">
        <div className="grid grid-cols-4 gap-[8px]">
          {Object.entries(cycles).map(([key, value]) => {
            const percentage = Math.round(value * 100);
            const isPeak = value >= peakThreshold;
            const isAwakening = key === "spiritual" && value >= awakeningThreshold;

            return (
              <div key={key} className="text-center">
                <div
                  className={cn(
                    "text-[11px] uppercase tracking-wider",
                    getCycleColor(key as DominantCycle)
                  )}
                >
                  {key.slice(0, 3)}
                </div>
                <div
                  className={cn(
                    "text-[16px] font-medium tabular-nums",
                    value > 0 ? "text-build" : "text-life",
                    (isPeak || isAwakening) && "text-solar"
                  )}
                >
                  {percentage > 0 ? "+" : ""}
                  {percentage}%
                </div>
                {(isPeak || isAwakening) && (
                  <svg
                    className="w-[11px] h-[11px] mx-auto text-solar"
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

        {/* Peak count */}
        {peakCount > 0 && (
          <div className="mt-[8px] text-center">
            <span className="text-[11px] text-solar">
              {peakCount} cycle{peakCount > 1 ? "s" : ""} at peak energy
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiorhythmStatusBadge;
