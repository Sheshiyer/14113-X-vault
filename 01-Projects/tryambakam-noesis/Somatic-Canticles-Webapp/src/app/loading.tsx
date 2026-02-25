"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * Global loading state component
 * Displayed automatically by Next.js when routes are loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-8">
        {/* Animated biorhythm wheel loader */}
        <div className="relative w-24 h-24">
          {/* Outer ring - Physical cycle */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-octave/20"
            animate={{ rotate: 360 }}
            transition={{
              duration: 23,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-octave rounded-full" />
          </motion.div>

          {/* Middle ring - Emotional cycle */}
          <motion.div
            className="absolute inset-3 rounded-full border-4 border-transform/20"
            animate={{ rotate: -360 }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-transform rounded-full" />
          </motion.div>

          {/* Inner ring - Intellectual cycle */}
          <motion.div
            className="absolute inset-6 rounded-full border-4 border-witness/20"
            animate={{ rotate: 360 }}
            transition={{
              duration: 33,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-witness rounded-full" />
          </motion.div>

          {/* Center */}
          <div className="absolute inset-9 rounded-full bg-gradient-to-br from-octave via-transform to-witness flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-text mb-2"
          >
            Loading Somatic Canticles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-text-muted"
          >
            Aligning with your rhythm...
          </motion.p>
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-48 h-1 bg-gradient-to-r from-octave via-transform to-witness rounded-full"
        />
      </div>
    </div>
  );
}
