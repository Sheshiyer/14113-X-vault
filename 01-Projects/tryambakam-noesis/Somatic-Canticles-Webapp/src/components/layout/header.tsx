"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export interface HeaderProps {
  user?: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
  } | null;
  onLogout?: () => void;
  className?: string;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chapters", label: "Chapters" },
  { href: "/profile", label: "Profile" },
];

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[72px] w-full", // Height: 72px (44 + 28, close to power numbers)
        "bg-surface/80 backdrop-blur-[13px]", // Blur backdrop with power number
        "border-b border-surface-elevated/50",
        "transition-all duration-8",
        className
      )}
    >
      <div className="h-full max-w-[1440px] mx-auto px-[21px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-[13px] transition-transform duration-8 hover:scale-[1.02]"
        >
          {/* Logo Icon - Biorhythm-inspired symbol */}
          <div className="relative w-[44px] h-[44px] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-octave via-transform to-architect opacity-80" />
            <div className="absolute inset-[4px] rounded-full bg-surface flex items-center justify-center">
              <span className="text-[19px] font-bold bg-gradient-to-r from-octave to-architect bg-clip-text text-transparent">
                SC
              </span>
            </div>
          </div>
          {/* Logo Text */}
          <span className="hidden sm:block text-[21px] font-semibold bg-gradient-to-r from-octave via-transform to-architect bg-clip-text text-transparent">
            Somatic Canticles
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-[8px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href as any}
              className={cn(
                "px-[19px] py-[8px] rounded-[8px]",
                "text-[16px] font-medium text-text-muted",
                "transition-all duration-8",
                "hover:text-text hover:bg-surface-elevated/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transform"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Menu / Auth Actions */}
        <div className="flex items-center gap-[13px]">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              {/* User Menu Trigger */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "flex items-center gap-[13px] px-[13px] py-[8px] rounded-[13px]",
                  "transition-all duration-8",
                  "hover:bg-surface-elevated/50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transform",
                  isUserMenuOpen && "bg-surface-elevated/50"
                )}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                {/* Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-[34px] h-[34px] rounded-full object-cover border-2 border-transparent hover:border-octave transition-colors"
                  />
                ) : (
                  <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-octave to-architect flex items-center justify-center text-white text-[13px] font-semibold">
                    {getInitials(user.name)}
                  </div>
                )}
                {/* User Name - hidden on mobile */}
                <span className="hidden md:block text-[16px] font-medium text-text">
                  {user.name}
                </span>
                {/* Chevron */}
                <svg
                  className={cn(
                    "w-[16px] h-[16px] text-text-muted transition-transform duration-8",
                    isUserMenuOpen && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className={cn(
                    "absolute right-0 mt-[8px] w-[264px]", // Width: 264px (8×33)
                    "bg-surface-elevated border border-surface-elevated/50",
                    "rounded-[13px] shadow-lg",
                    "py-[8px] z-50",
                    "animate-in fade-in slide-in-from-top-2 duration-8"
                  )}
                >
                  {/* User Info */}
                  <div className="px-[19px] py-[13px] border-b border-surface-elevated/50">
                    <p className="text-[16px] font-semibold text-text">
                      {user.name}
                    </p>
                    <p className="text-[13px] text-text-muted truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-[8px]">
                    <Link
                      href={"/profile" as any}
                      className={cn(
                        "flex items-center gap-[13px] px-[19px] py-[8px]",
                        "text-[16px] text-text-muted",
                        "transition-colors hover:text-text hover:bg-surface/50"
                      )}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="w-[19px] h-[19px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      href={"/settings" as any}
                      className={cn(
                        "flex items-center gap-[13px] px-[19px] py-[8px]",
                        "text-[16px] text-text-muted",
                        "transition-colors hover:text-text hover:bg-surface/50"
                      )}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="w-[19px] h-[19px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-surface-elevated/50 pt-[8px]">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout?.();
                      }}
                      className={cn(
                        "w-full flex items-center gap-[13px] px-[19px] py-[8px]",
                        "text-[16px] text-life",
                        "transition-colors hover:bg-life/10"
                      )}
                    >
                      <svg
                        className="w-[19px] h-[19px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-[13px]">
              <Button variant="ghost" size="sm" asChild>
                <Link href={"/login" as any}>Sign In</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href={"/register" as any}>Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-[8px] rounded-[8px]",
              "transition-all duration-8",
              "hover:bg-surface-elevated/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transform",
              isMobileMenuOpen && "bg-surface-elevated/50"
            )}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <div className="w-[24px] h-[19px] relative flex flex-col justify-between">
              <span
                className={cn(
                  "w-full h-[3px] bg-text rounded-full transition-all duration-8",
                  isMobileMenuOpen && "rotate-45 translate-y-[8px]"
                )}
              />
              <span
                className={cn(
                  "w-full h-[3px] bg-text rounded-full transition-all duration-8",
                  isMobileMenuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "w-full h-[3px] bg-text rounded-full transition-all duration-8",
                  isMobileMenuOpen && "-rotate-45 -translate-y-[8px]"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div
            className={cn(
              "fixed top-[72px] left-0 right-0 bg-surface-elevated z-40 lg:hidden",
              "border-b border-surface-elevated/50",
              "animate-in slide-in-from-top duration-8"
            )}
          >
            <nav className="px-[21px] py-[21px] space-y-[8px]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as any}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-[19px] py-[13px] rounded-[8px]",
                    "text-[19px] font-medium text-text",
                    "transition-all duration-8",
                    "hover:bg-surface/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-[13px] border-t border-surface-elevated/50 space-y-[8px]">
                  <Link
                    href={"/login" as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-[19px] py-[13px] rounded-[8px]",
                      "text-[19px] font-medium text-text-muted",
                      "transition-all duration-8",
                      "hover:bg-surface/50"
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    href={"/register" as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-[19px] py-[13px] rounded-[8px]",
                      "text-[19px] font-medium text-center text-white bg-octave",
                      "transition-all duration-8",
                      "hover:bg-octave-dark"
                    )}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

Header.displayName = "Header";
