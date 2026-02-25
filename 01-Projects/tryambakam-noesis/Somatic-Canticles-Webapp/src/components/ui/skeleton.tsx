"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circle" | "text" | "card" | "avatar";
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "default",
      width,
      height,
      lines = 1,
      animate = true,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "bg-slate-200",
      animate &&
        "animate-[skeletonPulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
    );

    const variants = {
      default: "rounded-[8px]",
      circle: "rounded-full",
      text: "rounded-[4px]",
      card: "rounded-[13px]",
      avatar: "rounded-full",
    };

    const dimensions = {
      width: width
        ? typeof width === "number"
          ? `${width}px`
          : width
        : undefined,
      height: height
        ? typeof height === "number"
          ? `${height}px`
          : height
        : undefined,
    };

    // Text variant with multiple lines
    if (variant === "text" && lines > 1) {
      return (
        <div className={cn("space-y-[8px]", className)} ref={ref} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseStyles,
                variants.text,
                "h-[16px]",
                i === lines - 1 && "w-[80%]" // Last line shorter
              )}
              style={{
                width: i === lines - 1 ? "80%" : "100%",
              }}
            />
          ))}
        </div>
      );
    }

    // Avatar with default size
    if (variant === "avatar") {
      return (
        <div
          className={cn(baseStyles, variants.avatar, className)}
          style={{
            width: dimensions.width || "44px",
            height: dimensions.height || "44px",
          }}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(baseStyles, variants[variant], className)}
        style={dimensions}
        ref={ref}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Pre-built skeleton patterns for common use cases

export interface CardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hasImage?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  hasImage = true,
  hasHeader = true,
  hasFooter = true,
  lines = 3,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-[13px] border border-slate-200 overflow-hidden",
        className
      )}
      {...props}
    >
      {hasImage && (
        <Skeleton variant="default" height={200} className="rounded-none" />
      )}
      <div className="p-[21px] space-y-[13px]">
        {hasHeader && (
          <div className="flex items-center gap-[13px]">
            <Skeleton variant="avatar" width={44} height={44} />
            <div className="flex-1 space-y-[5px]">
              <Skeleton variant="text" width="60%" height={21} />
              <Skeleton variant="text" width="40%" height={13} />
            </div>
          </div>
        )}
        <Skeleton variant="text" lines={lines} />
        {hasFooter && (
          <div className="flex items-center justify-between pt-[13px]">
            <Skeleton width="30%" height={34} />
            <Skeleton width="44px" height={34} />
          </div>
        )}
      </div>
    </div>
  );
};

export interface ListSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items?: number;
  hasIcon?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  hasIcon = true,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-[8px]", className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-[13px] p-[13px] rounded-[8px] border border-slate-100"
        >
          {hasIcon && <Skeleton variant="circle" width={34} height={34} />}
          <div className="flex-1 space-y-[5px]">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" height={13} />
          </div>
          <Skeleton width="13px" height={21} />
        </div>
      ))}
    </div>
  );
};

export interface DashboardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  statsCount?: number;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  statsCount = 4,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-[21px]", className)} {...props}>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[13px]">
        {Array.from({ length: statsCount }).map((_, i) => (
          <div
            key={i}
            className="p-[21px] rounded-[13px] border border-slate-200 space-y-[13px]"
          >
            <Skeleton variant="text" width="50%" height={13} />
            <Skeleton variant="text" width="80%" height={34} />
            <Skeleton variant="text" width="40%" height={13} />
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[21px]">
        <div className="md:col-span-2 space-y-[13px]">
          <Skeleton variant="text" width="30%" height={21} />
          <CardSkeleton hasImage={false} hasHeader={false} lines={5} />
        </div>
        <div className="space-y-[13px]">
          <Skeleton variant="text" width="50%" height={21} />
          <ListSkeleton items={4} hasIcon={false} />
        </div>
      </div>
    </div>
  );
};

// Add animation keyframes
export const SkeletonStyles = () => (
  <style jsx global>{`
    @keyframes skeletonPulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `}</style>
);
