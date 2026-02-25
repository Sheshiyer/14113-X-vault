"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface FooterProps {
  copyright?: string;
  className?: string;
}

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { href: "/chapters", label: "Chapters" },
      { href: "/rhythms", label: "Biorhythms" },
      { href: "/library", label: "Canticle Library" },
      { href: "/reflections", label: "Reflections" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/guide", label: "Getting Started" },
      { href: "/manuscript", label: "The Manuscript" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/somaticcanticles",
    icon: (
      <svg className="w-[21px] h-[21px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/somaticcanticles",
    icon: (
      <svg className="w-[21px] h-[21px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/somaticcanticles",
    icon: (
      <svg className="w-[21px] h-[21px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/somaticcanticles",
    icon: (
      <svg className="w-[21px] h-[21px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export const Footer: React.FC<FooterProps> = ({
  copyright = "© 2026 Somatic Canticles. All rights reserved.",
  className,
}) => {
  return (
    <footer
      className={cn(
        "w-full bg-surface-elevated/30 border-t border-surface-elevated/50",
        className
      )}
    >
      <div className="max-w-[1440px] mx-auto px-[21px]">
        {/* Main Footer Content */}
        <div className="py-[44px] grid grid-cols-2 md:grid-cols-4 gap-[32px]">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-[13px] mb-[21px]">
              <div className="relative w-[44px] h-[44px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-octave via-transform to-architect opacity-80" />
                <div className="absolute inset-[4px] rounded-full bg-surface flex items-center justify-center">
                  <span className="text-[19px] font-bold bg-gradient-to-r from-octave to-architect bg-clip-text text-transparent">
                    SC
                  </span>
                </div>
              </div>
              <span className="text-[19px] font-semibold bg-gradient-to-r from-octave to-architect bg-clip-text text-transparent">
                Somatic Canticles
              </span>
            </Link>
            <p className="text-[14px] text-text-muted leading-[1.618] max-w-[264px]">
              Your body&apos;s rhythm unlocks chapters. A companion experience to the Somatic Canticles manuscript.
            </p>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider mb-[13px]">
                {section.title}
              </h3>
              <ul className="space-y-[8px]">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as any}
                      className={cn(
                        "text-[14px] text-text-muted",
                        "transition-colors duration-8",
                        "hover:text-text"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-surface-elevated/50" />

        {/* Bottom Bar */}
        <div className="py-[21px] flex flex-col sm:flex-row items-center justify-between gap-[13px]">
          {/* Copyright */}
          <p className="text-[13px] text-text-muted text-center sm:text-left">
            {copyright}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-[13px]">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={cn(
                  "p-[8px] rounded-[8px] text-text-muted",
                  "transition-all duration-8",
                  "hover:text-text hover:bg-surface-elevated/50"
                )}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Power Numbers Decoration */}
        <div className="py-[13px] flex items-center justify-center gap-[13px] text-[13px] text-text-muted/50">
          <span className="hover:text-octave transition-colors cursor-default" title="Octave - Energy">8</span>
          <span>·</span>
          <span className="hover:text-transform transition-colors cursor-default" title="Transform - Change">13</span>
          <span>·</span>
          <span className="hover:text-solar transition-colors cursor-default" title="Solar - Light">19</span>
          <span>·</span>
          <span className="hover:text-world transition-colors cursor-default" title="World - Completion">21</span>
          <span>·</span>
          <span className="hover:text-architect transition-colors cursor-default" title="Architect - Structure">44</span>
          <span>·</span>
          <span className="hover:text-life transition-colors cursor-default" title="Life Cube - Creative Force">125</span>
          <span>·</span>
          <span className="hover:text-unity transition-colors cursor-default" title="Unity Bridge - Connection">152</span>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
