"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "locked"
    | "unlocked"
    | "completed"
    | "peak"
    | "flow"
    | "high"
    | "low"
    | "critical";
  size?: "sm" | "md";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-8";

    const variants = {
      default: "bg-slate-100 text-slate-800 border border-slate-200",
      locked: "bg-slate-200 text-slate-500 border border-slate-300",
      unlocked: "bg-octave/10 text-octave border border-octave/20",
      completed: "bg-world/10 text-world-dark border border-world/20",
      peak: "bg-solar/20 text-solar-dark border border-solar animate-pulse-8",
      flow: "bg-unity/10 text-unity-dark border border-unity/20",
      high: "bg-octave/10 text-octave-dark border border-octave/20",
      low: "bg-architect/10 text-architect-dark border border-architect/20",
      critical: "bg-life/10 text-life-dark border border-life/20",
    };

    const sizes = {
      sm: "px-[8px] py-[2px] text-[13px] rounded-[13px] gap-[5px]",
      md: "px-[13px] py-[5px] text-[16px] rounded-[21px] gap-[8px]",
    };

    return (
      <span
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

// Pre-built badges for common use cases
export const LockedBadge: React.FC<Omit<BadgeProps, "variant">> = (props) => (
  <Badge variant="locked" {...props}>
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
    Locked
  </Badge>
);

export const UnlockedBadge: React.FC<Omit<BadgeProps, "variant">> = (props) => (
  <Badge variant="unlocked" {...props}>
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
    Unlocked
  </Badge>
);

export const CompletedBadge: React.FC<Omit<BadgeProps, "variant">> = (props) => (
  <Badge variant="completed" {...props}>
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
    Completed
  </Badge>
);

export const PeakBadge: React.FC<Omit<BadgeProps, "variant">> = (props) => (
  <Badge variant="peak" {...props}>
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
    Peak
  </Badge>
);
