"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CycleBadge } from "./cycle-badge";
import { Lock, Unlock, Play, CheckCircle, Clock } from "lucide-react";

export type ChapterStatus = "locked" | "unlocked" | "inProgress" | "completed";

export type BiorhythmCycle = "physical" | "emotional" | "intellectual" | "spiritual";

export interface ChapterCardProps {
  /** Unique chapter identifier */
  id: string;
  /** Chapter number (1-12) */
  number: number;
  /** Chapter title */
  title: string;
  /** Chapter subtitle or teaser */
  subtitle?: string;
  /** Current status of the chapter */
  status: ChapterStatus;
  /** Associated biorhythm cycle */
  cycle: BiorhythmCycle;
  /** Progress percentage (0-100) for in-progress chapters */
  progress?: number;
  /** Estimated duration in minutes */
  durationEstimate?: number;
  /** Unlock date for unlocked chapters */
  unlockDate?: Date;
  /** Thumbnail image URL */
  thumbnailUrl?: string;
  /** Click handler for navigation */
  onClick?: (id: string) => void;
  /** Optional additional class names */
  className?: string;
}

const cycleColors: Record<BiorhythmCycle, { border: string; glow: string; bg: string }> = {
  physical: {
    border: "border-octave/30 hover:border-octave",
    glow: "group-hover:shadow-[0_0_21px_rgba(255,107,107,0.3)]",
    bg: "bg-octave/10",
  },
  emotional: {
    border: "border-transform/30 hover:border-transform",
    glow: "group-hover:shadow-[0_0_21px_rgba(155,89,182,0.3)]",
    bg: "bg-transform/10",
  },
  intellectual: {
    border: "border-witness/30 hover:border-witness",
    glow: "group-hover:shadow-[0_0_21px_rgba(52,152,219,0.3)]",
    bg: "bg-witness/10",
  },
  spiritual: {
    border: "border-unity/30 hover:border-unity",
    glow: "group-hover:shadow-[0_0_21px_rgba(230,126,34,0.3)]",
    bg: "bg-unity/10",
  },
};

const statusConfig: Record<ChapterStatus, {
  icon: React.ReactNode;
  badgeText: string;
  badgeVariant: "locked" | "unlocked" | "completed" | "peak";
  opacity: string;
}> = {
  locked: {
    icon: <Lock className="w-[19px] h-[19px]" />,
    badgeText: "Locked",
    badgeVariant: "locked",
    opacity: "opacity-60",
  },
  unlocked: {
    icon: <Unlock className="w-[19px] h-[19px]" />,
    badgeText: "Ready",
    badgeVariant: "unlocked",
    opacity: "opacity-100",
  },
  inProgress: {
    icon: <Play className="w-[19px] h-[19px]" />,
    badgeText: "In Progress",
    badgeVariant: "peak",
    opacity: "opacity-100",
  },
  completed: {
    icon: <CheckCircle className="w-[19px] h-[19px]" />,
    badgeText: "Completed",
    badgeVariant: "completed",
    opacity: "opacity-100",
  },
};

export const ChapterCard = React.forwardRef<HTMLDivElement, ChapterCardProps>(
  (
    {
      id,
      number,
      title,
      subtitle,
      status,
      cycle,
      progress = 0,
      durationEstimate,
      unlockDate,
      thumbnailUrl,
      onClick,
      className,
    },
    ref
  ) => {
    const config = statusConfig[status];
    const colors = cycleColors[cycle];
    const isClickable = status !== "locked";

    const handleClick = () => {
      if (isClickable && onClick) {
        onClick(id);
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative rounded-[13px] border-2 bg-white overflow-hidden transition-all duration-300",
          colors.border,
          colors.glow,
          config.opacity,
          isClickable && "cursor-pointer hover:scale-[1.02]",
          className
        )}
        whileHover={isClickable ? { scale: 1.02 } : undefined}
        whileTap={isClickable ? { scale: 0.98 } : undefined}
        onClick={handleClick}
        role="article"
        aria-label={`Chapter ${number}: ${title}`}
      >
        {/* Thumbnail or Gradient Background */}
        <div className={cn("h-[125px] relative overflow-hidden", colors.bg)}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`Chapter ${number} thumbnail`}
              className={cn(
                "w-full h-full object-cover transition-transform duration-[1300ms]",
                isClickable && "group-hover:scale-105"
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[44px] font-bold text-slate-300/50">
                {number}
              </span>
            </div>
          )}
          
          {/* Status Icon Overlay */}
          <motion.div
            className={cn(
              "absolute top-[13px] right-[13px] w-[34px] h-[34px] rounded-full flex items-center justify-center",
              status === "locked" ? "bg-slate-200 text-slate-500" : "bg-white shadow-md text-slate-700"
            )}
            animate={status === "unlocked" ? {
              scale: [1, 1.1, 1],
            } : undefined}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            {config.icon}
          </motion.div>

          {/* Cycle Badge */}
          <div className="absolute top-[13px] left-[13px]">
            <CycleBadge cycle={cycle} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-[21px] space-y-[13px]">
          {/* Chapter Number & Title */}
          <div className="space-y-[5px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[13px] font-medium text-slate-400">
                Chapter {number}
              </span>
              {status === "locked" && unlockDate && (
                <span className="text-[11px] text-slate-400 flex items-center gap-[4px]">
                  <Clock className="w-[11px] h-[11px]" />
                  Unlocks {unlockDate.toLocaleDateString()}
                </span>
              )}
            </div>
            <h3 className="text-[19px] font-semibold text-slate-900 leading-tight line-clamp-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[14px] text-slate-500 line-clamp-2">{subtitle}</p>
            )}
          </div>

          {/* Progress Bar for In-Progress */}
          {status === "inProgress" && (
            <ProgressBar
              value={progress}
              size="sm"
              variant={cycle === "physical" ? "octave" : cycle === "emotional" ? "transform" : cycle === "intellectual" ? "default" : "gradient"}
              showValue={false}
            />
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-[8px] border-t border-slate-100">
            <span
              className={cn(
                "inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-[13px] text-[13px] font-medium",
                status === "locked" && "bg-slate-100 text-slate-500",
                status === "unlocked" && "bg-octave/10 text-octave-dark",
                status === "inProgress" && "bg-solar/20 text-solar-dark",
                status === "completed" && "bg-build/10 text-build-dark"
              )}
            >
              {config.icon}
              {config.badgeText}
            </span>
            
            {durationEstimate && (
              <span className="text-[13px] text-slate-400 flex items-center gap-[4px]">
                <Clock className="w-[13px] h-[13px]" />
                {durationEstimate} min
              </span>
            )}
          </div>
        </div>

        {/* Locked Overlay */}
        {status === "locked" && (
          <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] pointer-events-none" />
        )}
      </motion.div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
