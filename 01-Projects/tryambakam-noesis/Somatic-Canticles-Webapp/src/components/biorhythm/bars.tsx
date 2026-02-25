"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { BiorhythmCycles } from "@/lib/biorhythm/types";

export interface BiorhythmBarsProps {
  /** Pre-calculated cycle values */
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
  /** Custom className */
  className?: string;
  /** Show labels */
  showLabels?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Animation duration in ms (default: 800ms) */
  animationDuration?: number;
}

interface CycleConfig {
  name: string;
  key: keyof BiorhythmCycles;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const PEAK_THRESHOLD = 0.8;
const LOW_THRESHOLD = -0.8;

const CYCLE_CONFIGS: CycleConfig[] = [
  {
    name: "Physical",
    key: "physical",
    color: "bg-life",
    bgColor: "bg-life/20",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 6.5h11" />
        <path d="M6.5 17.5h11" />
        <path d="M6 20v-2a6 6 0 1 1 12 0v2" />
        <path d="M12 12v-2" />
      </svg>
    ),
  },
  {
    name: "Emotional",
    key: "emotional",
    color: "bg-transform",
    bgColor: "bg-transform/20",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    name: "Intellectual",
    key: "intellectual",
    color: "bg-witness",
    bgColor: "bg-witness/20",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        <path d="M12 12v.01" />
        <path d="M12 8v.01" />
        <path d="M12 16v.01" />
      </svg>
    ),
  },
  {
    name: "Spiritual",
    key: "spiritual",
    color: "bg-solar",
    bgColor: "bg-solar/20",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
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
  },
];

export const BiorhythmBars: React.FC<BiorhythmBarsProps> = ({
  physical,
  emotional,
  intellectual,
  spiritual,
  className,
  showLabels = true,
  compact = false,
  animationDuration = 800,
}) => {
  const cycles: BiorhythmCycles = { physical, emotional, intellectual, spiritual };
  const [animatedValues, setAnimatedValues] = React.useState<BiorhythmCycles>({
    physical: 0,
    emotional: 0,
    intellectual: 0,
    spiritual: 0,
  });

  // Animate values on mount and when they change
  React.useEffect(() => {
    const startTime = Date.now();
    const startValues = { ...animatedValues };
    const targetValues = { physical, emotional, intellectual, spiritual };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        physical: startValues.physical + (targetValues.physical - startValues.physical) * easeOut,
        emotional: startValues.emotional + (targetValues.emotional - startValues.emotional) * easeOut,
        intellectual: startValues.intellectual + (targetValues.intellectual - startValues.intellectual) * easeOut,
        spiritual: startValues.spiritual + (targetValues.spiritual - startValues.spiritual) * easeOut,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [physical, emotional, intellectual, spiritual, animationDuration]);

  return (
    <div className={cn("space-y-[13px]", compact && "space-y-[8px]", className)}>
      {CYCLE_CONFIGS.map((config) => {
        const value = cycles[config.key];
        const animatedValue = animatedValues[config.key];
        const percentage = Math.round(value * 100);
        const isPeak = value >= PEAK_THRESHOLD;
        const isLow = value <= LOW_THRESHOLD;
        
        // Calculate bar width (-100% to +100% maps to 0% to 100% width, centered at 50%)
        const barWidth = ((animatedValue + 1) / 2) * 100;
        const centerPosition = 50;

        return (
          <div
            key={config.key}
            className={cn(
              "flex items-center gap-[13px]",
              compact && "gap-[8px]"
            )}
          >
            {/* Icon and Label */}
            {showLabels && (
              <div className={cn(
                "flex items-center gap-[8px] min-w-[100px]",
                compact && "min-w-[80px]"
              )}>
                <span className={cn(
                  "text-text-muted",
                  config.color.replace("bg-", "text-"),
                  compact && "scale-75 origin-left"
                )}>
                  {config.icon}
                </span>
                <span className={cn(
                  "text-[14px] text-text-muted",
                  compact && "text-[13px]"
                )}>
                  {config.name}
                </span>
              </div>
            )}

            {/* Bar container */}
            <div className="flex-1 relative">
              {/* Background track */}
              <div className="h-[21px] bg-void-800 rounded-[8px] overflow-hidden relative">
                {/* Center line (0%) */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-void-600 z-10"
                  style={{ left: `${centerPosition}%`, transform: "translateX(-50%)" }}
                />

                {/* Filled bar */}
                <div
                  className={cn(
                    "h-full rounded-[8px] transition-all duration-8 relative",
                    config.color,
                    isPeak && "shadow-[0_0_21px_8px_rgba(241,196,15,0.4)]",
                    isLow && "opacity-70"
                  )}
                  style={{
                    width: `${Math.abs(barWidth - 50) * 2}%`,
                    marginLeft: barWidth <= 50 ? `${barWidth}%` : "50%",
                    transform: barWidth <= 50 ? "translateX(-100%)" : "none",
                  }}
                />
              </div>

              {/* Value display */}
              <div className="flex justify-between mt-[5px]">
                <span
                  className={cn(
                    "text-[13px] tabular-nums font-medium transition-colors duration-8",
                    value > 0 ? "text-build" : "text-life",
                    isPeak && "text-solar",
                    isLow && "text-octave"
                  )}
                >
                  {percentage > 0 ? "+" : ""}
                  {percentage}%
                </span>
                
                {/* Peak/Low indicators */}
                <div className="flex items-center gap-[5px]">
                  {isPeak && (
                    <span className="flex items-center gap-[3px] text-[11px] text-solar">
                      <svg
                        className="w-[11px] h-[11px]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      Peak
                    </span>
                  )}
                  {isLow && (
                    <span className="flex items-center gap-[3px] text-[11px] text-octave">
                      <svg
                        className="w-[11px] h-[11px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      Low
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BiorhythmBars;
