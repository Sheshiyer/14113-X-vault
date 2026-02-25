"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  BookOpen,
  List,
} from "lucide-react";

export interface ChapterNavigationProps {
  /** Current chapter number (1-12) */
  currentChapter: number;
  /** Total number of chapters */
  totalChapters: number;
  /** Whether the previous chapter is locked */
  isPrevLocked?: boolean;
  /** Whether the next chapter is locked */
  isNextLocked?: boolean;
  /** Callback when previous is clicked */
  onPrevious: () => void;
  /** Callback when next is clicked */
  onNext: () => void;
  /** Callback when chapter map is clicked */
  onChapterMap?: () => void;
  /** Chapter titles for tooltips */
  chapterTitles?: Record<number, string>;
  /** Optional class name */
  className?: string;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  currentChapter,
  totalChapters,
  isPrevLocked = false,
  isNextLocked = false,
  onPrevious,
  onNext,
  onChapterMap,
  chapterTitles,
  className,
}) => {
  const hasPrevious = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;
  
  const prevChapterNum = hasPrevious ? currentChapter - 1 : null;
  const nextChapterNum = hasNext ? currentChapter + 1 : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-[13px] p-[13px] bg-white rounded-[13px] border border-slate-200",
        className
      )}
    >
      {/* Previous Chapter Button */}
      <div className="flex-1 min-w-0">
        {hasPrevious ? (
          <motion.div
            whileHover={!isPrevLocked ? { x: -4 } : undefined}
            whileTap={!isPrevLocked ? { scale: 0.98 } : undefined}
          >
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={isPrevLocked}
              className="w-full justify-start group"
              leftIcon={
                isPrevLocked ? (
                  <Lock className="w-[16px] h-[16px]" />
                ) : (
                  <ChevronLeft className="w-[16px] h-[16px] transition-transform group-hover:-translate-x-1" />
                )
              }
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] text-slate-400 font-normal">
                  Previous
                </span>
                <span className="text-[13px] font-medium truncate max-w-[120px]">
                  {chapterTitles?.[prevChapterNum!] || `Chapter ${prevChapterNum}`}
                </span>
              </div>
            </Button>
          </motion.div>
        ) : (
          <div className="h-[44px]" /> // Placeholder for alignment
        )}
      </div>

      {/* Chapter Indicator */}
      <div className="flex flex-col items-center">
        {onChapterMap ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onChapterMap}
            className="flex flex-col items-center gap-[4px] h-auto py-[8px] px-[13px]"
          >
            <div className="flex items-center gap-[8px] text-slate-500">
              <List className="w-[13px] h-[13px]" />
              <span className="text-[11px] uppercase tracking-wide font-medium">
                Chapter
              </span>
            </div>
            <div className="flex items-baseline gap-[4px]">
              <span className="text-[28px] font-bold text-slate-900 leading-none">
                {currentChapter}
              </span>
              <span className="text-[14px] text-slate-400">
                / {totalChapters}
              </span>
            </div>
          </Button>
        ) : (
          <div className="flex flex-col items-center py-[8px] px-[13px]">
            <span className="text-[11px] uppercase tracking-wide font-medium text-slate-500">
              Chapter
            </span>
            <div className="flex items-baseline gap-[4px]">
              <span className="text-[28px] font-bold text-slate-900 leading-none">
                {currentChapter}
              </span>
              <span className="text-[14px] text-slate-400">
                / {totalChapters}
              </span>
            </div>
          </div>
        )}

        {/* Progress Dots */}
        <div className="flex items-center gap-[4px] mt-[8px]">
          {Array.from({ length: totalChapters }, (_, i) => i + 1).map((num) => (
            <motion.div
              key={num}
              className={cn(
                "w-[6px] h-[6px] rounded-full transition-colors duration-300",
                num === currentChapter
                  ? "bg-octave"
                  : num < currentChapter
                  ? "bg-slate-300"
                  : "bg-slate-200"
              )}
              animate={num === currentChapter ? { scale: [1, 1.2, 1] } : undefined}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      {/* Next Chapter Button */}
      <div className="flex-1 min-w-0">
        {hasNext ? (
          <motion.div
            whileHover={!isNextLocked ? { x: 4 } : undefined}
            whileTap={!isNextLocked ? { scale: 0.98 } : undefined}
          >
            <Button
              variant="ghost"
              onClick={onNext}
              disabled={isNextLocked}
              className="w-full justify-end group"
              rightIcon={
                isNextLocked ? (
                  <Lock className="w-[16px] h-[16px]" />
                ) : (
                  <ChevronRight className="w-[16px] h-[16px] transition-transform group-hover:translate-x-1" />
                )
              }
            >
              <div className="flex flex-col items-end text-right">
                <span className="text-[11px] text-slate-400 font-normal">
                  Next
                </span>
                <span className="text-[13px] font-medium truncate max-w-[120px]">
                  {chapterTitles?.[nextChapterNum!] || `Chapter ${nextChapterNum}`}
                </span>
              </div>
            </Button>
          </motion.div>
        ) : (
          <div className="h-[44px]" /> // Placeholder for alignment
        )}
      </div>
    </div>
  );
};

// Compact variant for embedded use
export interface CompactChapterNavigationProps {
  currentChapter: number;
  totalChapters: number;
  onPrevious: () => void;
  onNext: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  className?: string;
}

export const CompactChapterNavigation: React.FC<CompactChapterNavigationProps> = ({
  currentChapter,
  totalChapters,
  onPrevious,
  onNext,
  isPrevDisabled,
  isNextDisabled,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-[8px]", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentChapter <= 1 || isPrevDisabled}
        leftIcon={<ChevronLeft className="w-[16px] h-[16px]" />}
        className="px-[13px]"
      >
        Prev
      </Button>
      
      <div className="flex items-center justify-center min-w-[80px] px-[13px] py-[8px] bg-slate-100 rounded-[8px]">
        <span className="text-[14px] font-medium text-slate-700">
          {currentChapter} / {totalChapters}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentChapter >= totalChapters || isNextDisabled}
        rightIcon={<ChevronRight className="w-[16px] h-[16px]" />}
        className="px-[13px]"
      >
        Next
      </Button>
    </div>
  );
};

// Breadcrumb Navigation
export interface ChapterBreadcrumbProps {
  chapters: { number: number; title: string; isActive: boolean; isLocked?: boolean }[];
  onChapterClick: (number: number) => void;
  className?: string;
}

export const ChapterBreadcrumb: React.FC<ChapterBreadcrumbProps> = ({
  chapters,
  onChapterClick,
  className,
}) => {
  return (
    <nav className={cn("flex items-center gap-[8px] flex-wrap", className)}>
      <BookOpen className="w-[16px] h-[16px] text-slate-400" />
      
      {chapters.map((chapter, index) => (
        <React.Fragment key={chapter.number}>
          {index > 0 && (
            <ChevronRight className="w-[13px] h-[13px] text-slate-300" />
          )}
          
          <button
            onClick={() => !chapter.isLocked && onChapterClick(chapter.number)}
            disabled={chapter.isLocked}
            className={cn(
              "flex items-center gap-[5px] px-[8px] py-[4px] rounded-[5px] text-[13px] transition-colors",
              chapter.isActive
                ? "bg-octave/10 text-octave-dark font-medium"
                : chapter.isLocked
                ? "text-slate-400 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {chapter.isLocked && <Lock className="w-[11px] h-[11px]" />}
            <span>{chapter.number}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

ChapterNavigation.displayName = "ChapterNavigation";
CompactChapterNavigation.displayName = "CompactChapterNavigation";
ChapterBreadcrumb.displayName = "ChapterBreadcrumb";

export default ChapterNavigation;
