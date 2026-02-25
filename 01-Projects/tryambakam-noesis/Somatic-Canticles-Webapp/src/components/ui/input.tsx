"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isLoading,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-[8px]">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[16px] font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-[13px] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex w-full rounded-[8px] border bg-white px-[13px] py-[8px] text-[16px] text-slate-900",
              "transition-all duration-8",
              "placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-transform focus:ring-offset-1 focus:border-transform",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              error
                ? "border-life focus:ring-life/50 focus:border-life"
                : "border-slate-300 hover:border-slate-400",
              leftIcon && "pl-[44px]",
              rightIcon && "pr-[44px]",
              className
            )}
            ref={ref}
            disabled={disabled || isLoading}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-[13px] top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
          {isLoading && (
            <div className="absolute right-[13px] top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-[16px] w-[16px] text-slate-400"
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
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[13px] text-life flex items-center gap-[5px]"
          >
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
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-[13px] text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
