"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { BiorhythmCycle } from "./cycle-badge";
import { ChapterStatus } from "./chapter-card";
import { Lock, CheckCircle, Play, Sparkles } from "lucide-react";

export interface MandalaChapter {
  id: string;
  number: number;
  title: string;
  status: ChapterStatus;
  cycle: BiorhythmCycle;
  progress?: number;
}

export interface BiorhythmCenterState {
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual?: number;
}

export interface MandalaMapProps {
  /** Array of 12 chapters */
  chapters: MandalaChapter[];
  /** Current biorhythm state for center display */
  biorhythmState: BiorhythmCenterState;
  /** Callback when a chapter is clicked */
  onChapterClick: (id: string) => void;
  /** Currently animating chapter (for unlock ripple) */
  animatingChapterId?: string | null;
  /** Size of the mandala */
  size?: "sm" | "md" | "lg";
  /** Optional class name */
  className?: string;
}

const cycleColors: Record<BiorhythmCycle, { bg: string; border: string; glow: string; text: string }> = {
  physical: {
    bg: "bg-octave",
    border: "border-octave",
    glow: "shadow-[0_0_21px_rgba(255,107,107,0.5)]",
    text: "text-octave",
  },
  emotional: {
    bg: "bg-transform",
    border: "border-transform",
    glow: "shadow-[0_0_21px_rgba(155,89,182,0.5)]",
    text: "text-transform",
  },
  intellectual: {
    bg: "bg-witness",
    border: "border-witness",
    glow: "shadow-[0_0_21px_rgba(52,152,219,0.5)]",
    text: "text-witness",
  },
  spiritual: {
    bg: "bg-unity",
    border: "border-unity",
    glow: "shadow-[0_0_21px_rgba(230,126,34,0.5)]",
    text: "text-unity",
  },
};

const statusIcons: Record<ChapterStatus, React.ReactNode> = {
  locked: <Lock className="w-[13px] h-[13px]" />,
  unlocked: <Sparkles className="w-[13px] h-[13px]" />,
  inProgress: <Play className="w-[13px] h-[13px]" />,
  completed: <CheckCircle className="w-[13px] h-[13px]" />,
};

export const MandalaMap: React.FC<MandalaMapProps> = ({
  chapters,
  biorhythmState,
  onChapterClick,
  animatingChapterId,
  size = "md",
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hoveredChapter, setHoveredChapter] = React.useState<string | null>(null);

  // Mandala dimensions
  const dimensions = {
    sm: { size: 300, chapterSize: 44, centerSize: 80 },
    md: { size: 440, chapterSize: 55, centerSize: 100 },
    lg: { size: 600, chapterSize: 66, centerSize: 120 },
  };

  const { size: mandalaSize, chapterSize, centerSize } = dimensions[size];
  const radius = (mandalaSize - chapterSize) / 2 - 21;
  const center = mandalaSize / 2;

  // Calculate chapter positions (12 chapters in circle)
  const chapterPositions = React.useMemo(() => {
    return chapters.map((chapter, index) => {
      const angle = (index / 12) * 2 * Math.PI - Math.PI / 2;
      return {
        ...chapter,
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        angle,
      };
    });
  }, [chapters, radius, center]);

  // Cycle segments for the outer ring
  const cycleSegments = [
    { cycle: "physical" as BiorhythmCycle, start: 0, count: 3 },
    { cycle: "emotional" as BiorhythmCycle, start: 3, count: 3 },
    { cycle: "intellectual" as BiorhythmCycle, start: 6, count: 3 },
    { cycle: "spiritual" as BiorhythmCycle, start: 9, count: 3 },
  ];

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ width: mandalaSize, height: mandalaSize }}
    >
      <svg
        className="absolute inset-0"
        width={mandalaSize}
        height={mandalaSize}
        viewBox={`0 0 ${mandalaSize} ${mandalaSize}`}
      >
        {/* Outer decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + chapterSize / 2 + 8}
          fill="none"
          stroke="url(#mandalaGradient)"
          strokeWidth="1"
          strokeDasharray="8 8"
          opacity="0.3"
        />

        {/* Connection lines between chapters */}
        {chapterPositions.map((chapter, i) => {
          const nextChapter = chapterPositions[(i + 1) % 12];
          const isActive = chapter.status !== "locked" && nextChapter.status !== "locked";
          return (
            <motion.line
              key={`line-${i}`}
              x1={chapter.x}
              y1={chapter.y}
              x2={nextChapter.x}
              y2={nextChapter.y}
              stroke={isActive ? "url(#mandalaGradient)" : "#e2e8f0"}
              strokeWidth={isActive ? 2 : 1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          );
        })}

        {/* Cycle segment arcs */}
        {cycleSegments.map((segment, i) => (
          <path
            key={segment.cycle}
            d={describeArc(
              center,
              center,
              radius + chapterSize / 2 + 21,
              (segment.start / 12) * 360 - 90,
              ((segment.start + segment.count) / 12) * 360 - 90
            )}
            fill="none"
            stroke={getCycleColor(segment.cycle)}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        ))}

        <defs>
          <linearGradient id="mandalaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="33%" stopColor="#9B59B6" />
            <stop offset="66%" stopColor="#3498DB" />
            <stop offset="100%" stopColor="#E67E22" />
          </linearGradient>
        </defs>
      </svg>

      {/* Chapter Nodes */}
      {chapterPositions.map((chapter, index) => {
        const colors = cycleColors[chapter.cycle];
        const isHovered = hoveredChapter === chapter.id;
        const isAnimating = animatingChapterId === chapter.id;

        return (
          <motion.button
            key={chapter.id}
            className={cn(
              "absolute flex items-center justify-center rounded-full border-2 transition-all duration-300",
              chapter.status === "locked"
                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                : chapter.status === "completed"
                ? `${colors.bg} ${colors.border} text-white`
                : `bg-white ${colors.border} ${colors.text} hover:${colors.glow}`,
              (isHovered || isAnimating) && colors.glow
            )}
            style={{
              width: chapterSize,
              height: chapterSize,
              left: chapter.x - chapterSize / 2,
              top: chapter.y - chapterSize / 2,
            }}
            onClick={() => chapter.status !== "locked" && onChapterClick(chapter.id)}
            onMouseEnter={() => setHoveredChapter(chapter.id)}
            onMouseLeave={() => setHoveredChapter(null)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
            whileHover={chapter.status !== "locked" ? { scale: 1.1 } : undefined}
            whileTap={chapter.status !== "locked" ? { scale: 0.95 } : undefined}
          >
            {/* Chapter Number */}
            <span className="text-[13px] font-bold">{chapter.number}</span>

            {/* Status Icon */}
            <div className="absolute -bottom-1 -right-1 w-[20px] h-[20px] rounded-full bg-white shadow-sm flex items-center justify-center text-[10px]">
              {statusIcons[chapter.status]}
            </div>

            {/* Progress Ring for in-progress */}
            {chapter.status === "inProgress" && chapter.progress && (
              <svg
                className="absolute inset-0 -rotate-90"
                width={chapterSize}
                height={chapterSize}
              >
                <circle
                  cx={chapterSize / 2}
                  cy={chapterSize / 2}
                  r={chapterSize / 2 - 4}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${(chapter.progress / 100) * 2 * Math.PI * (chapterSize / 2 - 4)} ${2 * Math.PI * (chapterSize / 2 - 4)}`}
                  opacity="0.3"
                />
              </svg>
            )}

            {/* Unlock Ripple Animation */}
            {isAnimating && (
              <>
                <motion.div
                  className={cn("absolute inset-0 rounded-full", colors.bg)}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.3, repeat: Infinity }}
                />
                <motion.div
                  className={cn("absolute inset-0 rounded-full", colors.bg)}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.3, repeat: Infinity, delay: 0.4 }}
                />
              </>
            )}
          </motion.button>
        );
      })}

      {/* Center - Biorhythm State */}
      <motion.div
        className="absolute rounded-full bg-white shadow-lg border-2 border-slate-100 flex items-center justify-center overflow-hidden"
        style={{
          width: centerSize,
          height: centerSize,
          left: center - centerSize / 2,
          top: center - centerSize / 2,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        {/* Biorhythm Rings */}
        <svg className="absolute inset-0" viewBox={`0 0 ${centerSize} ${centerSize}`}>
          {/* Physical ring */}
          <circle
            cx={centerSize / 2}
            cy={centerSize / 2}
            r={centerSize / 2 - 8}
            fill="none"
            stroke={COLORS.octave}
            strokeWidth="3"
            strokeDasharray={`${(biorhythmState.physical / 100) * 2 * Math.PI * (centerSize / 2 - 8)} ${2 * Math.PI * (centerSize / 2 - 8)}`}
            transform={`rotate(-90 ${centerSize / 2} ${centerSize / 2})`}
          />
          {/* Emotional ring */}
          <circle
            cx={centerSize / 2}
            cy={centerSize / 2}
            r={centerSize / 2 - 13}
            fill="none"
            stroke={COLORS.transform}
            strokeWidth="3"
            strokeDasharray={`${(biorhythmState.emotional / 100) * 2 * Math.PI * (centerSize / 2 - 13)} ${2 * Math.PI * (centerSize / 2 - 13)}`}
            transform={`rotate(-90 ${centerSize / 2} ${centerSize / 2})`}
          />
          {/* Intellectual ring */}
          <circle
            cx={centerSize / 2}
            cy={centerSize / 2}
            r={centerSize / 2 - 18}
            fill="none"
            stroke={COLORS.witness}
            strokeWidth="3"
            strokeDasharray={`${(biorhythmState.intellectual / 100) * 2 * Math.PI * (centerSize / 2 - 18)} ${2 * Math.PI * (centerSize / 2 - 18)}`}
            transform={`rotate(-90 ${centerSize / 2} ${centerSize / 2})`}
          />
        </svg>

        {/* Center Text */}
        <div className="relative z-10 text-center">
          <Sparkles className="w-[21px] h-[21px] mx-auto text-octave mb-[5px]" />
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Now
          </span>
        </div>
      </motion.div>

      {/* Chapter Info Tooltip */}
      <AnimatePresence>
        {hoveredChapter && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute z-50 bg-slate-900 text-white rounded-[8px] px-[13px] py-[8px] text-[13px] whitespace-nowrap pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {(() => {
              const chapter = chapters.find((c) => c.id === hoveredChapter);
              return chapter ? (
                <div className="text-center">
                  <p className="font-semibold">Chapter {chapter.number}</p>
                  <p className="text-slate-300 text-[11px]">{chapter.title}</p>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to create SVG arc path
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function getCycleColor(cycle: BiorhythmCycle): string {
  const colors = {
    physical: COLORS.octave,
    emotional: COLORS.transform,
    intellectual: COLORS.witness,
    spiritual: COLORS.unity,
  };
  return colors[cycle];
}

// Color constants
const COLORS = {
  octave: "#FF6B6B",
  transform: "#9B59B6",
  witness: "#3498DB",
  unity: "#E67E22",
};

MandalaMap.displayName = "MandalaMap";

export default MandalaMap;
