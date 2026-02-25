"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "unlock";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-transform focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-octave text-white hover:bg-octave-dark active:bg-octave-dark shadow-[0_2px_8px_rgba(255,107,107,0.3)]",
      secondary:
        "bg-architect text-white hover:bg-architect-dark active:bg-architect-dark shadow-[0_2px_8px_rgba(52,152,219,0.3)]",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900",
      outline:
        "border-2 border-slate-300 bg-transparent text-slate-700 hover:border-octave hover:text-octave",
      unlock:
        "bg-transform text-white hover:bg-transform-dark active:bg-transform-dark shadow-[0_2px_13px_rgba(155,89,182,0.4)] animate-pulse-8",
    };

    const sizes = {
      sm: "h-[34px] px-[13px] text-[13px] rounded-[8px] gap-[8px]",
      md: "h-[44px] px-[19px] text-[19px] rounded-[8px] gap-[8px]",
      lg: "h-[55px] px-[21px] text-[21px] rounded-[13px] gap-[13px]",
    };

    // Handle asChild pattern for composition
    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as Record<string, unknown>;
      const childClassName = childProps.className as string | undefined;
      const childChildren = childProps.children as React.ReactNode;
      
      return React.cloneElement(
        children as React.ReactElement,
        {
          className: cn(
            baseStyles,
            variants[variant],
            sizes[size],
            className,
            childClassName
          ),
          ref,
          disabled: disabled || isLoading,
          ...props,
        } as React.HTMLAttributes<HTMLElement>,
        <>
          {isLoading && (
            <svg
              className="animate-spin h-[16px] w-[16px]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {!isLoading && leftIcon}
          {childChildren}
          {!isLoading && rightIcon}
        </>
      );
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-[16px] w-[16px]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
