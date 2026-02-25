"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  text?: string;
  textPosition?: "left" | "center" | "right";
  variant?: "default" | "dashed" | "dotted";
  size?: "sm" | "md" | "lg";
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      text,
      textPosition = "center",
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    };

    const sizes = {
      sm: orientation === "horizontal" ? "border-t" : "border-l",
      md: orientation === "horizontal" ? "border-t-2" : "border-l-2",
      lg: orientation === "horizontal" ? "border-t-[3px]" : "border-l-[3px]",
    };

    if (text) {
      const textPositions = {
        left: "before:flex-[0.1] after:flex-1",
        center: "before:flex-1 after:flex-1",
        right: "before:flex-1 after:flex-[0.1]",
      };

      return (
        <div
          className={cn(
            "flex items-center gap-[13px]",
            textPositions[textPosition],
            "before:content-[''] before:border-t-2 before:border-slate-200",
            "after:content-[''] after:border-t-2 after:border-slate-200",
            className
          )}
          ref={ref}
          {...props}
        >
          <span className="text-[13px] text-slate-500 whitespace-nowrap">
            {text}
          </span>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "shrink-0 border-slate-200",
          orientation === "horizontal" ? "w-full h-[1px]" : "h-full w-[1px]",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
      />
    );
  }
);

Separator.displayName = "Separator";

// Vertical separator with text (for sidebar layouts)
export interface VerticalTextSeparatorProps
  extends Omit<SeparatorProps, "orientation" | "text"> {
  text: string;
}

export const VerticalTextSeparator: React.FC<VerticalTextSeparatorProps> = ({
  text,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-[8px] h-full",
        className
      )}
      {...props}
    >
      <div className="flex-1 w-[2px] bg-slate-200" />
      <span
        className="text-[13px] text-slate-500 writing-mode-vertical"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        {text}
      </span>
      <div className="flex-1 w-[2px] bg-slate-200" />
    </div>
  );
};

// Section separator with icon
export interface IconSeparatorProps
  extends Omit<SeparatorProps, "text"> {
  icon: React.ReactNode;
  text?: string;
}

export const IconSeparator: React.FC<IconSeparatorProps> = ({
  icon,
  text,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex items-center gap-[13px]", className)}
      {...props}
    >
      <div className="flex-1 h-[2px] bg-slate-200" />
      <div className="flex items-center gap-[8px] px-[13px] py-[5px] bg-slate-100 rounded-full">
        <span className="text-slate-500">{icon}</span>
        {text && <span className="text-[13px] text-slate-600">{text}</span>}
      </div>
      <div className="flex-1 h-[2px] bg-slate-200" />
    </div>
  );
};
