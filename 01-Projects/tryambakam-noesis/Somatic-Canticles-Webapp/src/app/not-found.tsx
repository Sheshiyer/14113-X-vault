"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Home, BookOpen, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Global 404 Not Found page
 * Displayed when a route doesn't exist
 */
export default function NotFound() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const suggestedLinks = [
    { href: "/" as const, label: "Home", icon: Home, description: "Return to the main page" },
    { href: "/chapters" as const, label: "Chapters", icon: BookOpen, description: "Explore the 12 canticles" },
    { href: "/dashboard" as const, label: "Dashboard", icon: null, description: "View your progress" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="text-[150px] sm:text-[200px] font-bold leading-none bg-gradient-to-b from-text/20 to-transparent bg-clip-text text-transparent select-none">
            44
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl sm:text-8xl font-bold text-text/10">404</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-text mb-4"
        >
          Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-text-muted mb-8 max-w-md mx-auto"
        >
          The canticle you seek cannot be found. Perhaps it awaits a future
          cycle, or the path has shifted.
        </motion.p>

        {/* Search suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="relative max-w-sm mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search for a chapter or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-elevated border border-white/5 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-octave/50 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
            />
          </div>
        </motion.div>

        {/* Suggested links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-4 mb-12"
        >
          {suggestedLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link
                href={link.href}
                className="block p-6 rounded-xl bg-surface-elevated border border-white/5 hover:border-octave/30 transition-all duration-300 group"
              >
                {link.icon && (
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-octave/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <link.icon className="w-6 h-6 text-octave" />
                  </div>
                )}
                <h3 className="font-semibold text-text mb-1">{link.label}</h3>
                <p className="text-sm text-text-muted">{link.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-text-muted hover:text-text"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Power numbers decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 pt-8 border-t border-white/5"
        >
          <p className="text-sm text-text-muted/50 mb-4">
            Even in the void, there is structure
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-octave/50">8</span>
            <span className="text-text-muted/20">·</span>
            <span className="text-transform/50">13</span>
            <span className="text-text-muted/20">·</span>
            <span className="text-solar/50">19</span>
            <span className="text-text-muted/20">·</span>
            <span className="text-build/50">21</span>
            <span className="text-text-muted/20">·</span>
            <span className="text-witness font-semibold">44</span>
            <span className="text-text-muted/20">·</span>
            <span className="text-unity/50">125</span>
            <span className="text-text-muted/20">·</span>
            <span className="text-creative/50">152</span>
          </div>
        </motion.div>

        {/* Hidden message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-xs text-text-muted/30"
        >
          Error Code: WITNESS_44 — The requested resource observes but is not
          observed
        </motion.p>
      </motion.div>
    </div>
  );
}
