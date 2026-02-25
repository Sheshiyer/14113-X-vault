"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "interactive";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white border border-slate-200",
      elevated: "bg-white shadow-[0_4px_21px_rgba(0,0,0,0.08)]",
      outlined: "bg-transparent border-2 border-slate-300",
      interactive:
        "bg-white border border-slate-200 cursor-pointer hover:border-transform hover:shadow-[0_4px_13px_rgba(155,89,182,0.15)] transition-all duration-8",
    };

    return (
      <div
        className={cn(
          "rounded-[13px] overflow-hidden",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, children, ...props }, ref) => (
    <div
      className={cn(
        "flex items-start justify-between p-[21px] pb-[13px] gap-[13px]",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => (
    <Component
      className={cn(
        "text-[21px] font-semibold text-slate-900 leading-tight",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    className={cn("text-[16px] text-slate-500 mt-[5px]", className)}
    ref={ref}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div className={cn("p-[21px] pt-[13px]", className)} ref={ref} {...props} />
  )
);

CardContent.displayName = "CardContent";

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = "start", ...props }, ref) => {
    const alignments = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    };

    return (
      <div
        className={cn(
          "flex items-center gap-[13px] p-[21px] pt-[13px]",
          alignments[align],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

export interface CardImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: "auto" | "video" | "square" | "wide";
  overlay?: React.ReactNode;
}

export const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, aspectRatio = "auto", overlay, ...props }, ref) => {
    const aspectRatios = {
      auto: "",
      video: "aspect-video",
      square: "aspect-square",
      wide: "aspect-[21/9]",
    };

    return (
      <div
        className={cn(
          "relative overflow-hidden",
          aspectRatios[aspectRatio],
          className
        )}
        ref={ref}
      >
        <img
          className="w-full h-full object-cover"
          {...props}
          alt={props.alt || ""}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-[13px]">
            {overlay}
          </div>
        )}
      </div>
    );
  }
);

CardImage.displayName = "CardImage";
