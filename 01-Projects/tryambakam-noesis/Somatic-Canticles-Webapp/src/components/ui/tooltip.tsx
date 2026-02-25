"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  delay = 800, // 800ms power number delay
  className,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-[8px]",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-[8px]",
    left: "right-full top-1/2 -translate-y-1/2 mr-[8px]",
    right: "left-full top-1/2 -translate-y-1/2 ml-[8px]",
  };

  const arrows = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-[13px] py-[8px] bg-slate-800 text-white text-[13px] rounded-[8px] whitespace-nowrap",
            "animate-[tooltipFade_800ms_ease-out]",
            positions[position],
            className
          )}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0 border-[5px] border-transparent",
              arrows[position]
            )}
          />
        </div>
      )}
      <style jsx global>{`
        @keyframes tooltipFade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Info icon with tooltip for inline help
export interface InfoTooltipProps
  extends Omit<TooltipProps, "children" | "content"> {
  text: string;
  iconSize?: number;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  iconSize = 16,
  ...props
}) => {
  return (
    <Tooltip content={text} {...props}>
      <button
        type="button"
        className="inline-flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors duration-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-transform rounded-full"
        aria-label="More information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={iconSize}
          height={iconSize}
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
      </button>
    </Tooltip>
  );
};

// Label with tooltip for form fields
export interface LabelWithTooltipProps {
  label: string;
  tooltip: string;
  required?: boolean;
  htmlFor?: string;
}

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({
  label,
  tooltip,
  required,
  htmlFor,
}) => {
  return (
    <div className="flex items-center gap-[8px]">
      <label
        htmlFor={htmlFor}
        className="block text-[16px] font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-life ml-[2px]">*</span>}
      </label>
      <InfoTooltip text={tooltip} />
    </div>
  );
};
