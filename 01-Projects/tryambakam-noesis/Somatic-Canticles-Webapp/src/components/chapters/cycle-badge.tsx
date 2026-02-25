"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import {
  Activity,
  Heart,
  Brain,
  Sparkles,
} from "lucide-react";

export type BiorhythmCycle = "physical" | "emotional" | "intellectual" | "spiritual";

export interface CycleBadgeProps {
  /** The biorhythm cycle type */
  cycle: BiorhythmCycle;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Optional additional class names */
  className?: string;
}

interface CycleConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  powerNumber: number;
}

const cycleConfig: Record<BiorhythmCycle, CycleConfig> = {
  physical: {
    label: "Physical",
    color: "text-octave-dark",
    bgColor: "bg-octave/10",
    borderColor: "border-octave/20",
    icon: <Activity className="w-full h-full" />,
    description: "Energy, vitality, and physical strength cycle (23 days)",
    powerNumber: 8,
  },
  emotional: {
    label: "Emotional",
    color: "text-transform-dark",
    bgColor: "bg-transform/10",
    borderColor: "border-transform/20",
    icon: <Heart className="w-full h-full" />,
    description: "Mood, sensitivity, and emotional awareness cycle (28 days)",
    powerNumber: 13,
  },
  intellectual: {
    label: "Intellectual",
    color: "text-witness-dark",
    bgColor: "bg-witness/10",
    borderColor: "border-witness/20",
    icon: <Brain className="w-full h-full" />,
    description: "Mental clarity, logic, and cognitive function cycle (33 days)",
    powerNumber: 44,
  },
  spiritual: {
    label: "Spiritual",
    color: "text-unity-dark",
    bgColor: "bg-unity/10",
    borderColor: "border-unity/20",
    icon: <Sparkles className="w-full h-full" />,
    description: "Intuition, transcendence, and deeper awareness cycle (53 days)",
    powerNumber: 125,
  },
};

export const CycleBadge = React.forwardRef<HTMLDivElement, CycleBadgeProps>(
  ({ cycle, size = "md", showTooltip = true, className }, ref) => {
    const config = cycleConfig[cycle];
    const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);

    const sizes = {
      sm: {
        container: "px-[8px] py-[2px] gap-[5px]",
        icon: "w-[13px] h-[13px]",
        text: "text-[11px]",
      },
      md: {
        container: "px-[13px] py-[5px] gap-[8px]",
        icon: "w-[16px] h-[16px]",
        text: "text-[13px]",
      },
      lg: {
        container: "px-[21px] py-[8px] gap-[13px]",
        icon: "w-[21px] h-[21px]",
        text: "text-[16px]",
      },
    };

    const sizeClasses = sizes[size];

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onFocus={() => showTooltip && setIsTooltipVisible(true)}
        onBlur={() => setIsTooltipVisible(false)}
      >
        <motion.div
          className={cn(
            "inline-flex items-center rounded-[21px] border font-medium transition-colors duration-200",
            config.bgColor,
            config.color,
            config.borderColor,
            sizeClasses.container,
            className
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={sizeClasses.icon}>{config.icon}</span>
          <span className={sizeClasses.text}>{config.label}</span>
        </motion.div>

        {/* Tooltip */}
        {showTooltip && (
          <AnimatePresence>
            {isTooltipVisible && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-[8px] w-[240px] pointer-events-none"
              >
                <div className="bg-slate-900 text-white rounded-[8px] p-[13px] shadow-lg">
                  {/* Arrow */}
                  <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-[12px] h-[12px] bg-slate-900 rotate-45" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-[8px] mb-[8px]">
                      <span className={cn("w-[16px] h-[16px]", config.color)}>
                        {config.icon}
                      </span>
                      <span className="font-semibold text-[14px]">
                        {config.label} Cycle
                      </span>
                      <span className="ml-auto text-[11px] text-slate-400">
                        #{config.powerNumber}
                      </span>
                    </div>
                    
                    <p className="text-[13px] text-slate-300 leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }
);

CycleBadge.displayName = "CycleBadge";

// Pre-built cycle badges for convenience
export const PhysicalBadge: React.FC<Omit<CycleBadgeProps, "cycle">> = (props) => (
  <CycleBadge cycle="physical" {...props} />
);

export const EmotionalBadge: React.FC<Omit<CycleBadgeProps, "cycle">> = (props) => (
  <CycleBadge cycle="emotional" {...props} />
);

export const IntellectualBadge: React.FC<Omit<CycleBadgeProps, "cycle">> = (props) => (
  <CycleBadge cycle="intellectual" {...props} />
);

export const SpiritualBadge: React.FC<Omit<CycleBadgeProps, "cycle">> = (props) => (
  <CycleBadge cycle="spiritual" {...props} />
);

// Cycle Legend Component
export interface CycleLegendProps {
  className?: string;
}

export const CycleLegend: React.FC<CycleLegendProps> = ({ className }) => {
  const cycles: BiorhythmCycle[] = ["physical", "emotional", "intellectual", "spiritual"];

  return (
    <div className={cn("flex flex-wrap gap-[13px]", className)}>
      {cycles.map((cycle) => (
        <CycleBadge key={cycle} cycle={cycle} size="sm" showTooltip={true} />
      ))}
    </div>
  );
};

export default CycleBadge;
