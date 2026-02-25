"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

// Types
export interface SidebarProps {
  user?: {
    id: string;
    name: string;
    avatar?: string;
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
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

// Navigation items with icons
const getNavItems = (): NavItem[] => [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/rhythms",
    label: "Your Rhythms",
    icon: (
      <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/chapters",
    label: "Chapter Map",
    icon: (
      <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9.553 4.553A1 1 0 009 4.118v.002" />
      </svg>
    ),
    badge: 12,
  },
  {
    href: "/library",
    label: "Canticle Library",
    icon: (
      <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    href: "/reflections",
    label: "Reflections",
    icon: (
      <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Cycle colors mapping
const cycleColors = {
  physical: "bg-octave",
  emotional: "bg-transform",
  intellectual: "bg-architect",
  spiritual: "bg-unity",
};

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  biorhythm,
  chapterProgress,
  isOpen = false,
  onClose,
  className,
}) => {
  const navItems = getNavItems();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sidebarContent = (
    <>
      {/* User Profile Summary */}
      {user && (
        <div className="px-[19px] py-[21px] border-b border-surface-elevated/50">
          <div className="flex items-center gap-[13px]">
            {/* Avatar */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-[55px] h-[55px] rounded-full object-cover border-2 border-octave/30"
              />
            ) : (
              <div className="w-[55px] h-[55px] rounded-full bg-gradient-to-br from-octave to-architect flex items-center justify-center text-white text-[19px] font-semibold">
                {getInitials(user.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-semibold text-text truncate">
                {user.name}
              </p>
              {typeof user.streak === "number" && (
                <div className="flex items-center gap-[8px] mt-[4px]">
                  <span className="text-[13px] text-solar font-medium">
                    {user.streak}-day streak
                  </span>
                  <span className="text-solar">🔥</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="px-[13px] py-[21px]">
        <ul className="space-y-[4px]">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href as any}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-[13px] px-[13px] py-[13px] rounded-[8px]",
                  "text-[16px] font-medium text-text-muted",
                  "transition-all duration-8",
                  "hover:text-text hover:bg-surface-elevated/50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transform"
                )}
              >
                <span className="text-transform">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-[8px] py-[2px] text-[13px] font-medium bg-surface-elevated text-text-muted rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Biorhythm Quick View */}
      {biorhythm && (
        <div className="px-[19px] py-[21px] border-t border-surface-elevated/50">
          <h3 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-[13px]">
            Today&apos;s Rhythms
          </h3>
          <div className="space-y-[13px]">
            {/* Physical */}
            <div>
              <div className="flex items-center justify-between mb-[4px]">
                <span className="text-[13px] text-text-muted">Physical</span>
                <span className="text-[13px] font-medium text-octave">
                  {Math.round((biorhythm.physical + 1) * 50)}%
                </span>
              </div>
              <div className="h-[8px] bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-octave rounded-full transition-all duration-13"
                  style={{ width: `${(biorhythm.physical + 1) * 50}%` }}
                />
              </div>
            </div>
            {/* Emotional */}
            <div>
              <div className="flex items-center justify-between mb-[4px]">
                <span className="text-[13px] text-text-muted">Emotional</span>
                <span className="text-[13px] font-medium text-transform">
                  {Math.round((biorhythm.emotional + 1) * 50)}%
                </span>
              </div>
              <div className="h-[8px] bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-transform rounded-full transition-all duration-13"
                  style={{ width: `${(biorhythm.emotional + 1) * 50}%` }}
                />
              </div>
            </div>
            {/* Intellectual */}
            <div>
              <div className="flex items-center justify-between mb-[4px]">
                <span className="text-[13px] text-text-muted">Intellectual</span>
                <span className="text-[13px] font-medium text-architect">
                  {Math.round((biorhythm.intellectual + 1) * 50)}%
                </span>
              </div>
              <div className="h-[8px] bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-architect rounded-full transition-all duration-13"
                  style={{ width: `${(biorhythm.intellectual + 1) * 50}%` }}
                />
              </div>
            </div>
            {/* Spiritual */}
            {typeof biorhythm.spiritual === "number" && (
              <div>
                <div className="flex items-center justify-between mb-[4px]">
                  <span className="text-[13px] text-text-muted">Spiritual</span>
                  <span className="text-[13px] font-medium text-unity">
                    {Math.round((biorhythm.spiritual + 1) * 50)}%
                  </span>
                </div>
                <div className="h-[8px] bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-unity rounded-full transition-all duration-13"
                    style={{ width: `${(biorhythm.spiritual + 1) * 50}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-[13px] text-[13px]"
            asChild
          >
            <Link href={"/rhythms" as any} onClick={onClose}>
              View Details
            </Link>
          </Button>
        </div>
      )}

      {/* Chapter Progress Summary */}
      {chapterProgress && (
        <div className="px-[19px] py-[21px] border-t border-surface-elevated/50">
          <h3 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-[13px]">
            Journey Progress
          </h3>
          <div className="mb-[13px]">
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-[16px] font-medium text-text">
                {chapterProgress.completed} of {chapterProgress.total} chapters
              </span>
              <span className="text-[13px] text-world font-medium">
                {Math.round((chapterProgress.completed / chapterProgress.total) * 100)}%
              </span>
            </div>
            <div className="h-[8px] bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-world to-unity rounded-full transition-all duration-13"
                style={{
                  width: `${(chapterProgress.completed / chapterProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
          {chapterProgress.currentChapter && (
            <div
              className={cn(
                "p-[13px] rounded-[8px] bg-surface-elevated/30 border border-surface-elevated/50",
                "hover:bg-surface-elevated/50 transition-colors"
              )}
            >
              <p className="text-[13px] text-text-muted mb-[4px]">Current Chapter</p>
              <div className="flex items-center gap-[8px]">
                <span
                  className={cn(
                    "w-[8px] h-[8px] rounded-full",
                    cycleColors[chapterProgress.currentChapter.cycle]
                  )}
                />
                <span className="text-[14px] font-medium text-text truncate">
                  {chapterProgress.currentChapter.title}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Link - Bottom */}
      <div className="mt-auto px-[13px] py-[21px] border-t border-surface-elevated/50">
        <Link
          href={"/settings" as any}
          onClick={onClose}
          className={cn(
            "flex items-center gap-[13px] px-[13px] py-[13px] rounded-[8px]",
            "text-[16px] font-medium text-text-muted",
            "transition-all duration-8",
            "hover:text-text hover:bg-surface-elevated/50"
          )}
        >
          <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col",
          "w-[280px] h-[calc(100vh-72px)]", // Width: 280px (close to 286), Height: viewport minus header
          "bg-surface-elevated/50 border-r border-surface-elevated/50",
          "sticky top-[72px]",
          "overflow-y-auto scrollbar-thin",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside
            className={cn(
              "fixed top-0 left-0 z-50 lg:hidden",
              "w-[280px] h-full", // Width: 280px
              "bg-surface-elevated border-r border-surface-elevated/50",
              "flex flex-col overflow-y-auto",
              "animate-in slide-in-from-left duration-8"
            )}
          >
            {/* Mobile Header inside drawer */}
            <div className="flex items-center justify-between px-[19px] py-[21px] border-b border-surface-elevated/50">
              <Link
                href="/"
                className="text-[19px] font-semibold bg-gradient-to-r from-octave to-architect bg-clip-text text-transparent"
                onClick={onClose}
              >
                Somatic Canticles
              </Link>
              <button
                onClick={onClose}
                className="p-[8px] rounded-[8px] hover:bg-surface/50 transition-colors"
              >
                <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

Sidebar.displayName = "Sidebar";
