"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ChapterCard, ChapterCardProps, ChapterStatus, BiorhythmCycle } from "./chapter-card";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown, BookOpen } from "lucide-react";

export type FilterOption = "all" | "locked" | "unlocked" | "completed";
export type SortOption = "number" | "unlockDate" | "cycle";

export interface ChapterGridProps {
  /** Array of chapter data */
  chapters: ChapterCardProps[];
  /** Current filter selection */
  filter?: FilterOption;
  /** Current sort selection */
  sortBy?: SortOption;
  /** Callback when filter changes */
  onFilterChange?: (filter: FilterOption) => void;
  /** Callback when sort changes */
  onSortChange?: (sort: SortOption) => void;
  /** Callback when a chapter is clicked */
  onChapterClick?: (id: string) => void;
  /** Group chapters by book/trilogy */
  groupByBook?: boolean;
  /** Show connection lines between chapters */
  showConnections?: boolean;
  /** Optional additional class names */
  className?: string;
}

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All Chapters" },
  { value: "unlocked", label: "Unlocked" },
  { value: "completed", label: "Completed" },
  { value: "locked", label: "Locked" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "number", label: "Chapter Number" },
  { value: "unlockDate", label: "Unlock Date" },
  { value: "cycle", label: "Biorhythm Cycle" },
];

// Group chapters by biorhythm cycle
const cycleOrder: BiorhythmCycle[] = ["physical", "emotional", "intellectual", "spiritual"];

// Group chapters by book (4 chapters per book)
const getBookNumber = (chapterNumber: number): number => Math.ceil(chapterNumber / 4);

export const ChapterGrid: React.FC<ChapterGridProps> = ({
  chapters,
  filter = "all",
  sortBy = "number",
  onFilterChange,
  onSortChange,
  onChapterClick,
  groupByBook = false,
  showConnections = false,
  className,
}) => {
  // Filter chapters
  const filteredChapters = React.useMemo(() => {
    if (filter === "all") return chapters;
    return chapters.filter((chapter) => chapter.status === filter);
  }, [chapters, filter]);

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
        return sorted.sort((a, b) => {
          const cycleDiff = cycleOrder.indexOf(a.cycle) - cycleOrder.indexOf(b.cycle);
          return cycleDiff !== 0 ? cycleDiff : a.number - b.number;
        });
      default:
        return sorted;
    }
  }, [filteredChapters, sortBy]);

  // Group by book if enabled
  const groupedChapters = React.useMemo(() => {
    if (!groupByBook) return { "All Chapters": sortedChapters };
    
    const groups: Record<string, ChapterCardProps[]> = {
      "Book I: Genesis": [],
      "Book II: Structure": [],
      "Book III: Transcendence": [],
    };
    
    sortedChapters.forEach((chapter) => {
      const bookNum = getBookNumber(chapter.number);
      const bookKey = bookNum === 1 ? "Book I: Genesis" : bookNum === 2 ? "Book II: Structure" : "Book III: Transcendence";
      groups[bookKey].push(chapter);
    });
    
    return groups;
  }, [sortedChapters, groupByBook]);

  // Stats
  const stats = React.useMemo(() => {
    const total = chapters.length;
    const completed = chapters.filter((c) => c.status === "completed").length;
    const unlocked = chapters.filter((c) => c.status === "unlocked" || c.status === "inProgress" || c.status === "completed").length;
    return { total, completed, unlocked };
  }, [chapters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 21 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div className={cn("space-y-[21px]", className)}>
      {/* Header with Stats and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[13px] pb-[13px] border-b border-slate-200">
        <div className="flex items-center gap-[13px]">
          <BookOpen className="w-[21px] h-[21px] text-slate-500" />
          <div>
            <h2 className="text-[21px] font-semibold text-slate-900">Chapter Map</h2>
            <p className="text-[13px] text-slate-500">
              {stats.completed} of {stats.total} completed · {stats.unlocked} unlocked
            </p>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-[8px]">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => onFilterChange?.(e.target.value as FilterOption)}
              className="appearance-none bg-white border border-slate-200 rounded-[8px] pl-[34px] pr-[34px] py-[8px] text-[13px] font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-octave/20 cursor-pointer"
              aria-label="Filter chapters"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-slate-400" />
            <svg
              className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-slate-400 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value as SortOption)}
              className="appearance-none bg-white border border-slate-200 rounded-[8px] pl-[34px] pr-[34px] py-[8px] text-[13px] font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-octave/20 cursor-pointer"
              aria-label="Sort chapters"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-slate-400" />
            <svg
              className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-slate-400 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chapter Grid */}
      <div className="space-y-[44px]">
        {Object.entries(groupedChapters).map(([groupName, groupChapters]) =>
          groupChapters.length > 0 ? (
            <div key={groupName} className="space-y-[13px]">
              {groupByBook && (
                <h3 className="text-[16px] font-semibold text-slate-700 flex items-center gap-[8px]">
                  <span className="w-[34px] h-[2px] bg-slate-300" />
                  {groupName}
                </h3>
              )}

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[21px]"
              >
                {groupChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    variants={itemVariants}
                    className="relative"
                  >
                    <ChapterCard
                      {...chapter}
                      onClick={onChapterClick}
                    />
                    
                    {/* Connection Lines */}
                    {showConnections && index < groupChapters.length - 1 && (
                      <div className="hidden xl:block absolute top-1/2 -right-[21px] w-[21px] h-[2px] bg-slate-200">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-slate-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : null
        )}
      </div>

      {/* Empty State */}
      {sortedChapters.length === 0 && (
        <div className="text-center py-[44px] space-y-[13px]">
          <div className="w-[64px] h-[64px] mx-auto rounded-full bg-slate-100 flex items-center justify-center">
            <BookOpen className="w-[32px] h-[32px] text-slate-400" />
          </div>
          <p className="text-slate-500">No chapters match the selected filter.</p>
          {filter !== "all" && (
            <Button variant="outline" onClick={() => onFilterChange?.("all")}>
              Show All Chapters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

ChapterGrid.displayName = "ChapterGrid";

export default ChapterGrid;
