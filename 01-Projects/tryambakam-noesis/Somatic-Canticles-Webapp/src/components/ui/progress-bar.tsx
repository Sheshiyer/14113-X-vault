"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "octave" | "transform" | "solar" | "world" | "gradient";
  showValue?: boolean;
  valueFormat?: "percentage" | "fraction" | "none";
  animated?: boolean;
  label?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      size = "md",
      variant = "default",
      showValue = true,
      valueFormat = "percentage",
      animated = true,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const isComplete = percentage >= 100;

    const sizes = {
      sm: "h-[8px]",
      md: "h-[13px]",
      lg: "h-[21px]",
    };

    const variants = {
      default: "bg-slate-200",
      octave: "bg-octave/20",
      transform: "bg-transform/20",
      solar: "bg-solar/30",
      world: "bg-world/20",
      gradient: "bg-slate-200",
    };

    const fillVariants = {
      default: "bg-slate-600",
      octave: "bg-octave",
      transform: "bg-transform",
      solar: "bg-solar",
      world: "bg-world",
      gradient: "bg-gradient-to-r from-octave via-transform to-world",
    };

    const formatValue = () => {
      switch (valueFormat) {
        case "percentage":
          return `${Math.round(percentage)}%`;
        case "fraction":
          return `${value}/${max}`;
        default:
          return "";
      }
    };

    return (
      <div className={cn("w-full space-y-[8px]", className)} ref={ref} {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-[13px]">
            {label && (
              <span className="font-medium text-slate-700">{label}</span>
            )}
            {showValue && (
              <span
                className={cn(
                  "font-medium transition-colors duration-8",
                  isComplete ? "text-world-dark" : "text-slate-500"
                )}
              >
                {formatValue()}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            "w-full rounded-full overflow-hidden",
            sizes[size],
            variants[variant]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || "Progress"}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-[1300ms] ease-out",
              fillVariants[variant],
              animated && "animate-[progressPulse_8s_ease-in-out_infinite]"
            )}
            style={{ width: `${percentage}%` }}
          >
            {size === "lg" && (
              <div className="h-full flex items-center justify-center text-[13px] font-medium text-white">
                {formatValue()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export interface MultiProgressBarProps
  extends Omit<ProgressBarProps, "value" | "variant"> {
  segments: {
    value: number;
    color: string;
    label?: string;
  }[];
}

export const MultiProgressBar = React.forwardRef<
  HTMLDivElement,
  MultiProgressBarProps
>(({ segments, className, size = "md", ...props }, ref) => {
  const total = segments.reduce((acc, seg) => acc + seg.value, 0);

  const sizes = {
    sm: "h-[8px]",
    md: "h-[13px]",
    lg: "h-[21px]",
  };

  return (
    <div className={cn("w-full space-y-[8px]", className)} ref={ref} {...props}>
      <div
        className={cn(
          "w-full rounded-full overflow-hidden flex bg-slate-200",
          sizes[size]
        )}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            className="h-full transition-all duration-[1300ms] ease-out first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(segment.value / total) * 100}%`,
              backgroundColor: segment.color,
            }}
            title={segment.label ? `${segment.label}: ${segment.value}` : undefined}
          />
        ))}
      </div>
      {segments.some((s) => s.label) && (
        <div className="flex flex-wrap gap-[13px] text-[13px]">
          {segments.map(
            (segment, index) =>
              segment.label && (
                <div key={index} className="flex items-center gap-[5px]">
                  <div
                    className="w-[8px] h-[8px] rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-slate-600">
                    {segment.label} ({Math.round((segment.value / total) * 100)}%)
                  </span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
});

MultiProgressBar.displayName = "MultiProgressBar";

// Chapter unlock progress bar with power numbers
export interface ChapterProgressProps
  extends Omit<ProgressBarProps, "variant" | "valueFormat"> {
  chapterNumber: number;
  isUnlocked: boolean;
  unlockDate?: Date;
}

export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  chapterNumber,
  isUnlocked,
  unlockDate,
  value,
  ...props
}) => {
  return (
    <div className="space-y-[13px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[13px]">
          <span
            className={cn(
              "flex items-center justify-center w-[34px] h-[34px] rounded-full text-[16px] font-bold",
              isUnlocked
                ? "bg-transform text-white"
                : "bg-slate-200 text-slate-500"
            )}
          >
            {chapterNumber}
          </span>
          <div>
            <p className="font-medium text-slate-900">
              Chapter {chapterNumber}
            </p>
            {unlockDate && (
              <p className="text-[13px] text-slate-500">
                Unlocked {unlockDate.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {isUnlocked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-world"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
      <ProgressBar
        value={value}
        variant={isUnlocked ? "world" : "default"}
        valueFormat="percentage"
        {...props}
      />
    </div>
  );
};
