"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  CheckCircle,
  Clock,
  Calendar,
  Target,
  Timer,
  TrendingUp,
  Award,
} from "lucide-react";

export interface ChapterProgressTrackerProps {
  /** Chapter number */
  chapterNumber: number;
  /** Chapter title */
  chapterTitle: string;
  /** Completion percentage (0-100) */
  completionPercentage: number;
  /** Array of checkpoints/milestones */
  checkpoints?: {
    id: string;
    title: string;
    isCompleted: boolean;
    completedAt?: Date;
  }[];
  /** Time spent in minutes */
  timeSpentMinutes?: number;
  /** Last accessed date */
  lastAccessedAt?: Date;
  /** Estimated completion time in minutes */
  estimatedCompletionMinutes?: number;
  /** Current streak days */
  streakDays?: number;
  /** Total sessions completed */
  totalSessions?: number;
  /** Whether the chapter is completed */
  isCompleted?: boolean;
  /** Completion date */
  completedAt?: Date;
  /** Optional class name */
  className?: string;
}

export const ChapterProgressTracker: React.FC<ChapterProgressTrackerProps> = ({
  chapterNumber,
  chapterTitle,
  completionPercentage,
  checkpoints = [],
  timeSpentMinutes,
  lastAccessedAt,
  estimatedCompletionMinutes,
  streakDays,
  totalSessions,
  isCompleted,
  completedAt,
  className,
}) => {
  // Format time display
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Format date display
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins < 1 ? "Just now" : `${diffMins} min ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Calculate estimated remaining time
  const estimatedRemaining = React.useMemo(() => {
    if (!estimatedCompletionMinutes || completionPercentage >= 100) return 0;
    const remaining = (estimatedCompletionMinutes * (100 - completionPercentage)) / 100;
    return Math.round(remaining);
  }, [estimatedCompletionMinutes, completionPercentage]);

  const completedCheckpoints = checkpoints.filter((c) => c.isCompleted).length;
  const checkpointProgress = checkpoints.length > 0
    ? (completedCheckpoints / checkpoints.length) * 100
    : 0;

  return (
    <div
      className={cn(
        "bg-white rounded-[13px] border border-slate-200 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-[21px] border-b border-slate-100">
        <div className="flex items-start justify-between gap-[13px]">
          <div>
            <span className="text-[13px] font-medium text-slate-400">
              Chapter {chapterNumber}
            </span>
            <h3 className="text-[19px] font-semibold text-slate-900 leading-tight">
              {chapterTitle}
            </h3>
          </div>
          
          {isCompleted ? (
            <motion.div
              className="flex items-center gap-[5px] px-[13px] py-[5px] rounded-[21px] bg-world/10 text-world-dark"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <CheckCircle className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">Completed</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-[5px] px-[13px] py-[5px] rounded-[21px] bg-octave/10 text-octave-dark">
              <TrendingUp className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">{Math.round(completionPercentage)}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-[21px] space-y-[21px]">
        {/* Main Progress Bar */}
        <div className="space-y-[8px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-700">
              Overall Progress
            </span>
            <span className="text-[13px] text-slate-500">
              {Math.round(completionPercentage)}% complete
            </span>
          </div>
          <ProgressBar
            value={completionPercentage}
            max={100}
            size="md"
            variant={isCompleted ? "world" : "gradient"}
            animated={!isCompleted}
            showValue={false}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[13px]">
          {/* Time Spent */}
          {timeSpentMinutes !== undefined && (
            <div className="bg-slate-50 rounded-[8px] p-[13px] space-y-[5px]">
              <div className="flex items-center gap-[5px] text-slate-500">
                <Timer className="w-[13px] h-[13px]" />
                <span className="text-[12px] font-medium uppercase tracking-wide">Time Spent</span>
              </div>
              <p className="text-[19px] font-semibold text-slate-900">
                {formatTime(timeSpentMinutes)}
              </p>
            </div>
          )}

          {/* Estimated Remaining */}
          {estimatedRemaining > 0 && (
            <div className="bg-slate-50 rounded-[8px] p-[13px] space-y-[5px]">
              <div className="flex items-center gap-[5px] text-slate-500">
                <Clock className="w-[13px] h-[13px]" />
                <span className="text-[12px] font-medium uppercase tracking-wide">Est. Remaining</span>
              </div>
              <p className="text-[19px] font-semibold text-slate-900">
                {formatTime(estimatedRemaining)}
              </p>
            </div>
          )}

          {/* Last Accessed */}
          {lastAccessedAt && (
            <div className="bg-slate-50 rounded-[8px] p-[13px] space-y-[5px]">
              <div className="flex items-center gap-[5px] text-slate-500">
                <Calendar className="w-[13px] h-[13px]" />
                <span className="text-[12px] font-medium uppercase tracking-wide">Last Active</span>
              </div>
              <p className="text-[16px] font-semibold text-slate-900">
                {formatDate(lastAccessedAt)}
              </p>
            </div>
          )}

          {/* Completion Date */}
          {completedAt && (
            <div className="bg-slate-50 rounded-[8px] p-[13px] space-y-[5px]">
              <div className="flex items-center gap-[5px] text-slate-500">
                <Award className="w-[13px] h-[13px]" />
                <span className="text-[12px] font-medium uppercase tracking-wide">Completed</span>
              </div>
              <p className="text-[16px] font-semibold text-slate-900">
                {completedAt.toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Streak */}
          {streakDays !== undefined && streakDays > 0 && (
            <div className="bg-solar/10 rounded-[8px] p-[13px] space-y-[5px]">
              <div className="flex items-center gap-[5px] text-solar-dark">
                <TrendingUp className="w-[13px] h-[13px]" />
                <span className="text-[12px] font-medium uppercase tracking-wide">Streak</span>
              </div>
              <p className="text-[19px] font-semibold text-slate-900">
                {streakDays} day{streakDays > 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Total Sessions */}
          {totalSessions !== undefined && (
            <div className="bg-slate-50 rounded-[8px] p-[13px] space-y-[5px]">
              <div className="flex items-center gap-[5px] text-slate-500">
                <Target className="w-[13px] h-[13px]" />
                <span className="text-[12px] font-medium uppercase tracking-wide">Sessions</span>
              </div>
              <p className="text-[19px] font-semibold text-slate-900">
                {totalSessions}
              </p>
            </div>
          )}
        </div>

        {/* Checkpoints / Milestones */}
        {checkpoints.length > 0 && (
          <div className="space-y-[13px]">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-semibold text-slate-900">
                Milestones
              </h4>
              <span className="text-[13px] text-slate-500">
                {completedCheckpoints} of {checkpoints.length}
              </span>
            </div>
            
            <div className="space-y-[8px]">
              {checkpoints.map((checkpoint, index) => (
                <motion.div
                  key={checkpoint.id}
                  initial={{ opacity: 0, x: -13 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-[13px] p-[13px] rounded-[8px] border transition-colors",
                    checkpoint.isCompleted
                      ? "bg-world/5 border-world/20"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div
                    className={cn(
                      "w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0",
                      checkpoint.isCompleted
                        ? "bg-world text-white"
                        : "bg-slate-200 text-slate-400"
                    )}
                  >
                    {checkpoint.isCompleted ? (
                      <CheckCircle className="w-[14px] h-[14px]" />
                    ) : (
                      <span className="text-[11px] font-medium">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-[14px] font-medium",
                        checkpoint.isCompleted ? "text-slate-900" : "text-slate-600"
                      )}
                    >
                      {checkpoint.title}
                    </p>
                    {checkpoint.completedAt && (
                      <p className="text-[12px] text-slate-400">
                        Completed {formatDate(checkpoint.completedAt)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Checkpoint Progress */}
            <ProgressBar
              value={checkpointProgress}
              max={100}
              size="sm"
              variant="world"
              showValue={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

ChapterProgressTracker.displayName = "ChapterProgressTracker";

export default ChapterProgressTracker;
