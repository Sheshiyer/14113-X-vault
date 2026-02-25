"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export interface UnlockAnimationProps {
  /** Whether the animation is active */
  isActive: boolean;
  /** Chapter number being unlocked */
  chapterNumber: number;
  /** Chapter title */
  chapterTitle: string;
  /** Callback when animation completes */
  onComplete: () => void;
  /** Callback when skip is pressed */
  onSkip?: () => void;
}

type AnimationPhase = "pulse" | "geometric" | "soundwave" | "reveal" | "complete";

// Generate 19-point mandala coordinates
const generateMandalaPoints = (count: number = 19, radius: number = 150) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle,
    };
  });
};

// Sound wave bars
const generateWaveBars = (count: number = 44) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    height: Math.random() * 80 + 20,
    delay: i * 0.02,
  }));
};

export const UnlockAnimation: React.FC<UnlockAnimationProps> = ({
  isActive,
  chapterNumber,
  chapterTitle,
  onComplete,
  onSkip,
}) => {
  const [phase, setPhase] = React.useState<AnimationPhase>("pulse");
  const [showSkip, setShowSkip] = React.useState(false);
  const [soundWaves] = React.useState(generateWaveBars);
  const [mandalaPoints] = React.useState(() => generateMandalaPoints(19, 120));

  // Animation timing (13 seconds total)
  React.useEffect(() => {
    if (!isActive) {
      setPhase("pulse");
      setShowSkip(false);
      return;
    }

    // Phase 1: Pulse (0-3s)
    const pulseTimer = setTimeout(() => setPhase("geometric"), 3000);
    
    // Phase 2: Geometric (3-6s)
    const geometricTimer = setTimeout(() => setPhase("soundwave"), 6000);
    
    // Phase 3: Sound Wave (6-10s)
    const soundwaveTimer = setTimeout(() => setPhase("reveal"), 10000);
    
    // Phase 4: Reveal (10-13s)
    const revealTimer = setTimeout(() => setPhase("complete"), 13000);
    
    // Complete
    const completeTimer = setTimeout(() => onComplete(), 13500);

    // Show skip after 5s
    const skipTimer = setTimeout(() => setShowSkip(true), 5000);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(geometricTimer);
      clearTimeout(soundwaveTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
      clearTimeout(skipTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Phase 1: Pulse Effect */}
        {phase === "pulse" && (
          <motion.div
            className="absolute inset-0 bg-octave/20"
            animate={{
              background: [
                "rgba(255, 107, 107, 0.2)",
                "rgba(155, 89, 182, 0.3)",
                "rgba(241, 196, 15, 0.2)",
                "rgba(255, 107, 107, 0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Pulse Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-octave/30"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: [0, 200, 400, 600, 800, 1000, 1200, 1400],
                height: [0, 200, 400, 600, 800, 1000, 1200, 1400],
                opacity: [0, 0.8, 0.6, 0.4, 0.2, 0.1, 0, 0],
              }}
              transition={{
                duration: 3,
                repeat: phase === "pulse" ? Infinity : 0,
                delay: i * 0.375,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Phase 2: Geometric Expansion (19-point Mandala) */}
        {(phase === "geometric" || phase === "soundwave" || phase === "reveal" || phase === "complete") && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Central Orb */}
            <motion.div
              className="absolute w-[88px] h-[88px] rounded-full bg-gradient-to-br from-octave via-transform to-solar"
              animate={{
                boxShadow: [
                  "0 0 44px 13px rgba(255, 107, 107, 0.5)",
                  "0 0 88px 21px rgba(155, 89, 182, 0.6)",
                  "0 0 44px 13px rgba(241, 196, 15, 0.5)",
                ],
                rotate: 360,
              }}
              transition={{
                boxShadow: { duration: 4, repeat: Infinity },
                rotate: { duration: 13, repeat: Infinity, ease: "linear" },
              }}
            />

            {/* 19-Point Mandala */}
            <svg className="absolute w-[400px] h-[400px]" viewBox="-200 -200 400 400">
              {/* Outer ring */}
              <motion.circle
                cx="0"
                cy="0"
                r="120"
                fill="none"
                stroke="url(#mandalaGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />
              
              {/* Inner ring */}
              <motion.circle
                cx="0"
                cy="0"
                r="60"
                fill="none"
                stroke="url(#mandalaGradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Connection lines from center to points */}
              {mandalaPoints.map((point, i) => (
                <motion.line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={point.x}
                  y2={point.y}
                  stroke="url(#mandalaGradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              ))}

              {/* Points */}
              {mandalaPoints.map((point, i) => (
                <motion.circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="#F1C40F"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                />
              ))}

              {/* Interconnections between points */}
              {mandalaPoints.map((point, i) => {
                const nextPoint = mandalaPoints[(i + 1) % mandalaPoints.length];
                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={point.x}
                    y1={point.y}
                    x2={nextPoint.x}
                    y2={nextPoint.y}
                    stroke="rgba(155, 89, 182, 0.3)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.03 }}
                  />
                );
              })}

              <defs>
                <linearGradient id="mandalaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="50%" stopColor="#9B59B6" />
                  <stop offset="100%" stopColor="#F1C40F" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}

        {/* Phase 3: Sound Wave Visualization */}
        {(phase === "soundwave" || phase === "reveal" || phase === "complete") && (
          <motion.div
            className="absolute inset-x-0 bottom-[150px] h-[200px] flex items-center justify-center gap-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {soundWaves.map((bar) => (
              <motion.div
                key={bar.id}
                className="w-[4px] rounded-full bg-gradient-to-t from-octave via-transform to-solar"
                animate={{
                  height: [20, bar.height, 20, bar.height * 0.6, 20],
                  opacity: [0.5, 1, 0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  delay: bar.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Phase 4: Chapter Reveal */}
        {(phase === "reveal" || phase === "complete") && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-[21px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="space-y-[13px]"
              initial={{ y: 21 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="inline-block px-[21px] py-[8px] rounded-[21px] bg-octave/10 text-octave-dark text-[16px] font-medium"
                initial={{ opacity: 0, y: -13 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Chapter {chapterNumber} Unlocked
              </motion.span>
              
              <motion.h2
                className="text-[44px] font-bold text-white drop-shadow-[0_2px_13px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0, y: 21 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {chapterTitle}
              </motion.h2>
              
              <motion.p
                className="text-[21px] text-white/80 max-w-[500px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your journey continues. The path reveals itself to those who listen.
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Skip Button */}
        <AnimatePresence>
          {showSkip && phase !== "complete" && (
            <motion.div
              className="absolute bottom-[34px] right-[34px]"
              initial={{ opacity: 0, y: 13 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={onSkip}
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              >
                Skip
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="absolute bottom-[34px] left-[34px] flex items-center gap-[8px]">
          {["pulse", "geometric", "soundwave", "reveal"].map((p, i) => (
            <motion.div
              key={p}
              className={cn(
                "w-[8px] h-[8px] rounded-full transition-colors duration-300",
                phase === p || (["soundwave", "reveal", "complete"].includes(phase) && i < 2) || (phase === "complete")
                  ? "bg-white"
                  : "bg-white/30"
              )}
              animate={phase === p ? { scale: [1, 1.3, 1] } : undefined}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-void/95 via-void/90 to-void/95 -z-10" />
      </motion.div>
    </AnimatePresence>
  );
};

UnlockAnimation.displayName = "UnlockAnimation";

export default UnlockAnimation;
