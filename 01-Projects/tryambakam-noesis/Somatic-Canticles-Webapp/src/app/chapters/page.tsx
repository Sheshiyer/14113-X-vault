"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChapterGrid, MandalaMap, CycleLegend } from "@/components/chapters";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils/cn";
import {
  chapters,
  getProgressStats,
  ChapterData,
} from "@/lib/data/chapters";
import {
  LayoutGrid,
  CircleDot,
  Filter,
  ArrowUpDown,
  BookOpen,
  CheckCircle,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";

type ViewMode = "grid" | "mandala";
type FilterCycle = "all" | "physical" | "emotional" | "intellectual" | "spiritual";
type SortOption = "number" | "unlockDate" | "cycle";

// Transform ChapterData to ChapterCardProps format
const transformToCardProps = (chapter: ChapterData) => ({
  id: chapter.id,
  number: chapter.number,
  title: chapter.title,
  subtitle: chapter.subtitle,
  status: chapter.status,
  cycle: chapter.cycle,
  progress: chapter.progress,
  durationEstimate: chapter.estimatedDuration,
  unlockDate: chapter.unlockDate,
});

// Transform for MandalaMap
const transformToMandalaChapter = (chapter: ChapterData) => ({
  id: chapter.id,
  number: chapter.number,
  title: chapter.title,
  status: chapter.status,
  cycle: chapter.cycle,
  progress: chapter.progress,
});

export default function ChaptersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [filterCycle, setFilterCycle] = React.useState<FilterCycle>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("number");
  const [isAnimating, setIsAnimating] = React.useState(false);

  const stats = getProgressStats();

  // Filter chapters
  const filteredChapters = React.useMemo(() => {
    if (filterCycle === "all") return chapters;
    return chapters.filter((ch) => ch.cycle === filterCycle);
  }, [filterCycle]);

  // Sort chapters
  const sortedChapters = React.useMemo(() => {
    const sorted = [...filteredChapters];
    switch (sortBy) {
      case "number":
        return sorted.sort((a, b) => a.number - b.number);
      case "unlockDate":
        return sorted.sort((a, b) => {
          if (!a.unlockDate && !b.unlockDate) return a.number - b.number;
          if (!a.unlockDate) return 1;
          if (!b.unlockDate) return -1;
          return a.unlockDate.getTime() - b.unlockDate.getTime();
        });
      case "cycle":
        const cycleOrder = ["physical", "emotional", "intellectual", "spiritual"];
        return sorted.sort((a, b) => {
          const cycleDiff = cycleOrder.indexOf(a.cycle) - cycleOrder.indexOf(b.cycle);
          return cycleDiff !== 0 ? cycleDiff : a.number - b.number;
        });
      default:
        return sorted;
    }
  }, [filteredChapters, sortBy]);

  // Handle chapter click
  const handleChapterClick = (id: string) => {
    router.push(`/chapters/${id}`);
  };

  // Cycle color mapping for legend
  const cycleColors = {
    physical: { color: "bg-octave", label: "Physical", desc: "Energy & Vitality" },
    emotional: { color: "bg-transform", label: "Emotional", desc: "Mood & Sensitivity" },
    intellectual: { color: "bg-witness", label: "Intellectual", desc: "Clarity & Logic" },
    spiritual: { color: "bg-unity", label: "Spiritual", desc: "Intuition & Transcendence" },
  };

  return (
    <DashboardLayout
      user={{
        id: "user-1",
        name: "Seeker",
        streak: 7,
      }}
      biorhythm={{
        physical: 76,
        emotional: 44,
        intellectual: 88,
        spiritual: 55,
      }}
      chapterProgress={{
        completed: stats.completed,
        total: stats.total,
        currentChapter: {
          id: "chapter-3",
          title: "The Pulse of Movement",
          cycle: "physical",
        },
      }}
    >
      <div className="space-y-[21px]">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-[13px] pb-[21px] border-b border-surface-elevated/30"
        >
          <div className="flex items-center justify-center gap-[13px]">
            <BookOpen className="w-[28px] h-[28px] text-octave" />
            <h1 className="text-[44px] font-bold text-text leading-tight">
              The 12 Canticles
            </h1>
          </div>
          <p className="text-[19px] text-text-muted max-w-[600px] mx-auto">
            A somatic journey through body, emotion, mind, and spirit
          </p>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-[13px]"
        >
          <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] border border-surface-elevated/30">
            <div className="flex items-center gap-[8px] text-text-muted mb-[8px]">
              <BookOpen className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">Total</span>
            </div>
            <p className="text-[28px] font-bold text-text">{stats.total}</p>
          </div>
          
          <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] border border-surface-elevated/30">
            <div className="flex items-center gap-[8px] text-text-muted mb-[8px]">
              <CheckCircle className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">Completed</span>
            </div>
            <p className="text-[28px] font-bold text-build">{stats.completed}</p>
          </div>
          
          <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] border border-surface-elevated/30">
            <div className="flex items-center gap-[8px] text-text-muted mb-[8px]">
              <Unlock className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">Unlocked</span>
            </div>
            <p className="text-[28px] font-bold text-octave">{stats.unlocked}</p>
          </div>
          
          <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] border border-surface-elevated/30">
            <div className="flex items-center gap-[8px] text-text-muted mb-[8px]">
              <Lock className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">Locked</span>
            </div>
            <p className="text-[28px] font-bold text-text-muted">{stats.locked}</p>
          </div>
        </motion.div>

        {/* Overall Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-surface-elevated/30 rounded-[13px] p-[21px] border border-surface-elevated/30"
        >
          <div className="flex items-center justify-between mb-[13px]">
            <span className="text-[14px] font-medium text-text">Journey Progress</span>
            <span className="text-[14px] text-text-muted">
              {stats.completed} of {stats.total} completed
            </span>
          </div>
          <ProgressBar
            value={(stats.completed / stats.total) * 100}
            size="lg"
            variant="gradient"
            animated
            showValue
          />
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-[13px] py-[13px]"
        >
          {/* View Toggle */}
          <div className="flex items-center gap-[8px] bg-surface-elevated/30 rounded-[8px] p-[4px] w-fit">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-[8px] px-[13px] py-[8px] rounded-[5px] text-[13px] font-medium transition-all duration-200",
                viewMode === "grid"
                  ? "bg-octave text-white"
                  : "text-text-muted hover:text-text"
              )}
            >
              <LayoutGrid className="w-[16px] h-[16px]" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("mandala")}
              className={cn(
                "flex items-center gap-[8px] px-[13px] py-[8px] rounded-[5px] text-[13px] font-medium transition-all duration-200",
                viewMode === "mandala"
                  ? "bg-octave text-white"
                  : "text-text-muted hover:text-text"
              )}
            >
              <CircleDot className="w-[16px] h-[16px]" />
              Mandala Map
            </button>
          </div>

          {/* Filter & Sort */}
          <div className="flex items-center gap-[8px] flex-wrap">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterCycle}
                onChange={(e) => setFilterCycle(e.target.value as FilterCycle)}
                className="appearance-none bg-surface-elevated/50 border border-surface-elevated/50 rounded-[8px] pl-[34px] pr-[34px] py-[8px] text-[13px] font-medium text-text hover:border-octave/30 focus:outline-none focus:ring-2 focus:ring-octave/20 cursor-pointer transition-colors"
                aria-label="Filter by cycle"
              >
                <option value="all">All Cycles</option>
                <option value="physical">Physical Cycle</option>
                <option value="emotional">Emotional Cycle</option>
                <option value="intellectual">Intellectual Cycle</option>
                <option value="spiritual">Spiritual Cycle</option>
              </select>
              <Filter className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-text-muted" />
              <svg
                className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-text-muted pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-surface-elevated/50 border border-surface-elevated/50 rounded-[8px] pl-[34px] pr-[34px] py-[8px] text-[13px] font-medium text-text hover:border-octave/30 focus:outline-none focus:ring-2 focus:ring-octave/20 cursor-pointer transition-colors"
                aria-label="Sort chapters"
              >
                <option value="number">Chapter Order</option>
                <option value="unlockDate">Unlock Date</option>
                <option value="cycle">Cycle Type</option>
              </select>
              <ArrowUpDown className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-text-muted" />
              <svg
                className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-text-muted pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {viewMode === "grid" ? (
            <ChapterGrid
              chapters={sortedChapters.map(transformToCardProps)}
              onChapterClick={handleChapterClick}
              className="py-[21px]"
            />
          ) : (
            <div className="flex flex-col items-center py-[44px] space-y-[44px]">
              <MandalaMap
                chapters={chapters.map(transformToMandalaChapter)}
                biorhythmState={{
                  physical: 76,
                  emotional: 44,
                  intellectual: 88,
                  spiritual: 55,
                }}
                onChapterClick={handleChapterClick}
                size="lg"
              />
              
              {/* Legend */}
              <div className="bg-surface-elevated/30 rounded-[13px] p-[21px] border border-surface-elevated/30 max-w-[600px] w-full">
                <h3 className="text-[16px] font-semibold text-text mb-[13px] flex items-center gap-[8px]">
                  <Sparkles className="w-[16px] h-[16px] text-solar" />
                  Cycle Legend
                </h3>
                <div className="grid grid-cols-2 gap-[13px]">
                  {Object.entries(cycleColors).map(([cycle, config]) => (
                    <div key={cycle} className="flex items-center gap-[13px]">
                      <div className={cn("w-[13px] h-[13px] rounded-full", config.color)} />
                      <div>
                        <p className="text-[14px] font-medium text-text">{config.label}</p>
                        <p className="text-[12px] text-text-muted">{config.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {sortedChapters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-[44px] space-y-[13px]"
          >
            <div className="w-[64px] h-[64px] mx-auto rounded-full bg-surface-elevated flex items-center justify-center">
              <BookOpen className="w-[32px] h-[32px] text-text-muted" />
            </div>
            <p className="text-text-muted">No chapters match the selected filter.</p>
            <Button variant="outline" onClick={() => setFilterCycle("all")}>
              Show All Chapters
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
