"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  BookX,
  ArrowLeft,
  Home,
  Search,
  Compass,
} from "lucide-react";

export default function ChapterNotFound() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-[21px] text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-[44px]"
        >
          {/* Decorative circles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-[155px] h-[155px] -m-[27px]"
          >
            <svg viewBox="0 0 155 155" className="w-full h-full opacity-20">
              <circle
                cx="77.5"
                cy="77.5"
                r="75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="8 8"
                className="text-text"
              />
            </svg>
          </motion.div>

          {/* Icon container */}
          <div className="relative w-[100px] h-[100px] rounded-full bg-surface-elevated border border-surface-elevated/50 flex items-center justify-center">
            <BookX className="w-[44px] h-[44px] text-octave" />
            
            {/* Pulse animation */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-octave/30"
            />
          </div>

          {/* Chapter number indicator */}
          <motion.div
            initial={{ opacity: 0, y: 13 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-[8px] -right-[8px] w-[34px] h-[34px] rounded-full bg-octave flex items-center justify-center"
          >
            <span className="text-white font-bold text-[13px]">?</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[44px] font-bold text-text mb-[13px]"
        >
          Canticle Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[19px] text-text-muted max-w-[500px] mb-[44px]"
        >
          The chapter you&apos;re seeking seems to exist beyond the veil of the known. 
          Perhaps it&apos;s yet to be written, or the path has shifted.
        </motion.p>

        {/* Suggested Chapters */}
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-elevated/30 rounded-[13px] p-[21px] border border-surface-elevated/30 max-w-[400px] w-full mb-[44px]"
        >
          <h3 className="text-[14px] font-semibold text-text mb-[13px] flex items-center gap-[8px]">
            <Compass className="w-[16px] h-[16px] text-octave" />
            Continue Your Journey
          </h3>
          <div className="space-y-[8px]">
            <button
              onClick={() => router.push("/chapters/chapter-1")}
              className="w-full flex items-center gap-[13px] p-[13px] rounded-[8px] bg-surface-elevated/50 hover:bg-surface-elevated transition-colors text-left group"
            >
              <div className="w-[34px] h-[34px] rounded-full bg-octave/10 flex items-center justify-center text-octave font-bold text-[13px]">
                1
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text truncate">
                  The Breath of Awakening
                </p>
                <p className="text-[12px] text-text-muted">Start from the beginning</p>
              </div>
              <ArrowLeft className="w-[16px] h-[16px] text-text-muted group-hover:text-octave transition-colors -rotate-180" />
            </button>
            
            <button
              onClick={() => router.push("/chapters/chapter-3")}
              className="w-full flex items-center gap-[13px] p-[13px] rounded-[8px] bg-surface-elevated/50 hover:bg-surface-elevated transition-colors text-left group"
            >
              <div className="w-[34px] h-[34px] rounded-full bg-solar/10 flex items-center justify-center text-solar font-bold text-[13px]">
                3
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text truncate">
                  The Pulse of Movement
                </p>
                <p className="text-[12px] text-text-muted">Continue your progress</p>
              </div>
              <ArrowLeft className="w-[16px] h-[16px] text-text-muted group-hover:text-solar transition-colors -rotate-180" />
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-[13px]"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Home className="w-[19px] h-[19px]" />}
            onClick={() => router.push("/chapters")}
          >
            View All Canticles
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            leftIcon={<ArrowLeft className="w-[19px] h-[19px]" />}
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-[44px] text-[14px] text-text-muted italic max-w-[400px]"
        >
          &ldquo;Not all who wander are lost. Sometimes the path reveals itself 
          only to those who step into the unknown.&rdquo;
        </motion.blockquote>
      </div>
    </DashboardLayout>
  );
}
