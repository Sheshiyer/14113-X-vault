"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";

// Types
export interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    streak?: number;
  } | null;
  biorhythm?: {
    physical: number;
    emotional: number;
    intellectual: number;
    spiritual?: number;
  } | null;
  chapterProgress?: {
    completed: number;
    total: number;
    currentChapter?: {
      id: string;
      title: string;
      cycle: "physical" | "emotional" | "intellectual" | "spiritual";
    };
  } | null;
  onLogout?: () => void;
  className?: string;
  showFooter?: boolean;
  showSidebar?: boolean;
  sidebarOpen?: boolean;
  onSidebarClose?: () => void;
  onSidebarToggle?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  biorhythm,
  chapterProgress,
  onLogout,
  className,
  showFooter = true,
  showSidebar = true,
  sidebarOpen = false,
  onSidebarClose,
  onSidebarToggle,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(sidebarOpen);

  // Sync with external state
  React.useEffect(() => {
    setIsSidebarOpen(sidebarOpen);
  }, [sidebarOpen]);

  const handleSidebarClose = React.useCallback(() => {
    setIsSidebarOpen(false);
    onSidebarClose?.();
  }, [onSidebarClose]);

  const handleSidebarToggle = React.useCallback(() => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    onSidebarToggle?.();
  }, [isSidebarOpen, onSidebarToggle]);

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 1024) {
        handleSidebarClose();
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [handleSidebarClose]);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <Header
        user={user}
        onLogout={onLogout}
        className="flex-shrink-0"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar - Desktop: Fixed, Mobile: Drawer */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block flex-shrink-0">
              <Sidebar
                user={user}
                biorhythm={biorhythm}
                chapterProgress={chapterProgress}
                isOpen={false}
                className="h-[calc(100vh-72px)]"
              />
            </div>

            {/* Mobile Sidebar Toggle Button (visible on mobile) */}
            <button
              onClick={handleSidebarToggle}
              className={cn(
                "lg:hidden fixed left-[21px] top-[94px] z-30",
                "w-[44px] h-[44px] rounded-full",
                "bg-surface-elevated border border-surface-elevated/50",
                "flex items-center justify-center",
                "shadow-lg transition-all duration-8",
                "hover:bg-surface-elevated/80 hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transform",
                isSidebarOpen && "opacity-0 pointer-events-none"
              )}
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-[21px] h-[21px] text-text"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Mobile Sidebar Drawer */}
            <div className="lg:hidden">
              <Sidebar
                user={user}
                biorhythm={biorhythm}
                chapterProgress={chapterProgress}
                isOpen={isSidebarOpen}
                onClose={handleSidebarClose}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 min-w-0",
            "transition-all duration-8",
            className
          )}
        >
          <div
            className={cn(
              "min-h-[calc(100vh-72px)]",
              "px-[21px] sm:px-[32px] lg:px-[44px]",
              "py-[32px] sm:py-[44px]"
            )}
          >
            {/* Page Content Container */}
            <div className="max-w-[1200px] mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && (
        <Footer className="flex-shrink-0" />
      )}
    </div>
  );
};

// Grid Components for Dashboard Content
export interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  className,
  columns = 3,
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-[21px] sm:gap-[32px]",
        gridCols[columns],
        className
      )}
    >
      {children}
    </div>
  );
};

DashboardGrid.displayName = "DashboardGrid";

// Section Component for Dashboard
export interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  children,
  className,
  title,
  description,
  action,
}) => {
  return (
    <section className={cn("mb-[44px]", className)}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[13px] mb-[21px]">
          <div>
            {title && (
              <h2 className="text-[21px] font-semibold text-text">{title}</h2>
            )}
            {description && (
              <p className="text-[16px] text-text-muted mt-[4px]">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

DashboardSection.displayName = "DashboardSection";

// Card Component for Dashboard Content
export interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "highlight" | "glass";
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className,
  title,
  icon,
  action,
  footer,
  variant = "default",
}) => {
  const variants = {
    default: cn(
      "bg-surface-elevated/50 border border-surface-elevated/50",
      "hover:border-surface-elevated transition-colors duration-8"
    ),
    highlight: cn(
      "bg-gradient-to-br from-octave/10 to-architect/10",
      "border border-octave/20",
      "hover:border-octave/30 transition-colors duration-8"
    ),
    glass: cn(
      "bg-surface-elevated/30 backdrop-blur-[8px]",
      "border border-surface-elevated/30",
      "hover:bg-surface-elevated/50 transition-colors duration-8"
    ),
  };

  return (
    <div
      className={cn(
        "rounded-[13px] overflow-hidden",
        variants[variant],
        className
      )}
    >
      {(title || icon || action) && (
        <div className="flex items-center justify-between px-[21px] py-[13px] border-b border-surface-elevated/30">
          <div className="flex items-center gap-[13px]">
            {icon && (
              <span className="text-transform">{icon}</span>
            )}
            {title && (
              <h3 className="text-[16px] font-semibold text-text">{title}</h3>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-[21px]">{children}</div>
      {footer && (
        <div className="px-[21px] py-[13px] border-t border-surface-elevated/30">
          {footer}
        </div>
      )}
    </div>
  );
};

DashboardCard.displayName = "DashboardCard";

DashboardLayout.displayName = "DashboardLayout";
