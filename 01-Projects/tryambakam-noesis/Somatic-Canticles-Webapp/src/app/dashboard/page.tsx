"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

// Layout
import {
  DashboardLayout,
  DashboardGrid,
  DashboardSection,
  DashboardCard,
} from "@/components/layout/dashboard-layout";

// Biorhythm Components
import { BiorhythmWheel } from "@/components/biorhythm/wheel";
import { BiorhythmBars } from "@/components/biorhythm/bars";
import { BiorhythmStatusBadge } from "@/components/biorhythm/status-badge";
import { BiorhythmForecastCard } from "@/components/biorhythm/forecast-card";

// Chapter Components
import { ChapterCard } from "@/components/chapters/chapter-card";
import { ChapterGrid } from "@/components/chapters/chapter-grid";
import type { ChapterStatus, BiorhythmCycle } from "@/components/chapters/chapter-card";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";


// Types
import type { BiorhythmCycles, NextPeaks } from "@/lib/biorhythm/types";
import type { UserStats } from "@/types/user";

// Icons
import {
  Sparkles,
  BookOpen,
  Activity,
  Calendar,
  Clock,
  Settings,
  ChevronRight,
  Flame,
  Timer,
  TrendingUp,
  Lock,
  Play,
  CheckCircle,
  BarChart3,
  PenLine,
  Library,
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface DashboardChapter {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  status: ChapterStatus;
  cycle: BiorhythmCycle;
  progress?: number;
  durationEstimate?: number;
  unlockDate?: Date;
  thumbnailUrl?: string;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    avatar?: string;
    birthDate: Date;
    streak: number;
    lastCheckIn?: Date;
  };
  biorhythm: BiorhythmCycles;
  nextPeaks: NextPeaks;
  chapters: DashboardChapter[];
  currentChapter?: DashboardChapter;
  stats: UserStats & {
    nextUnlockEstimate?: Date;
    totalPracticeTime: number;
  };
  dailyPrompt: {
    question: string;
    category: string;
  };
}

// ============================================================================
// Loading Skeletons
// ============================================================================

function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[21px] bg-surface-elevated/50 border border-surface-elevated/50 p-[34px] sm:p-[44px]">
      <div className="flex flex-col lg:flex-row gap-[34px] items-center lg:items-start">
        <div className="flex-1 space-y-[21px] w-full">
          <Skeleton variant="text" width="60%" height={21} />
          <Skeleton variant="text" width="40%" height={44} />
          <div className="flex flex-wrap gap-[13px] pt-[13px]">
            <Skeleton variant="default" width={100} height={34} />
            <Skeleton variant="default" width={120} height={34} />
          </div>
          <Skeleton variant="text" width="50%" height={19} />
          <Skeleton variant="default" width={200} height={55} className="mt-[21px]" />
        </div>
        <Skeleton variant="circle" width={264} height={264} />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[13px] sm:gap-[21px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-[21px] rounded-[13px] bg-surface-elevated/50 border border-surface-elevated/50 space-y-[13px]"
        >
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="80%" height={34} />
          <Skeleton variant="text" width="40%" height={13} />
        </div>
      ))}
    </div>
  );
}

function BiorhythmOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[21px]">
      <div className="space-y-[13px]">
        <Skeleton variant="text" width="40%" height={21} />
        <div className="p-[21px] rounded-[13px] bg-surface-elevated/50 border border-surface-elevated/50 space-y-[21px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-[8px]">
              <Skeleton variant="text" width="30%" height={16} />
              <Skeleton variant="default" height={21} />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-[13px]">
        <Skeleton variant="text" width="40%" height={21} />
        <Skeleton variant="card" height={300} />
      </div>
    </div>
  );
}

function ChapterMapSkeleton() {
  return (
    <div className="space-y-[21px]">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={150} height={21} />
        <Skeleton variant="default" width={200} height={34} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[21px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} hasImage />
        ))}
      </div>
    </div>
  );
}

function CheckInSkeleton() {
  return (
    <div className="p-[21px] rounded-[13px] bg-surface-elevated/50 border border-surface-elevated/50 space-y-[21px]">
      <Skeleton variant="text" width="70%" height={21} />
      <Skeleton variant="text" lines={2} />
      <div className="flex gap-[13px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="circle" width={44} height={44} />
        ))}
      </div>
      <Skeleton variant="default" width="100%" height={44} />
    </div>
  );
}

function CurrentChapterSkeleton() {
  return <CardSkeleton hasImage />;
}

function QuickLinksSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[13px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="card" height={89} />
      ))}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatDuration(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  return `${Math.floor(days / 30)} months`;
}

function getDaysUntil(date: Date): number {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getNextPeakDate(peaks: NextPeaks): { cycle: string; date: Date; days: number } {
  const entries = Object.entries(peaks) as [keyof NextPeaks, Date][];
  const sorted = entries.sort((a, b) => a[1].getTime() - b[1].getTime());
  const [cycle, date] = sorted[0];
  const cycleName = cycle as string;
  return {
    cycle: cycleName.charAt(0).toUpperCase() + cycleName.slice(1),
    date,
    days: getDaysUntil(date),
  };
}

// ============================================================================
// Section Components
// ============================================================================

interface TodayUnlockHeroProps {
  user: DashboardData["user"];
  biorhythm: BiorhythmCycles;
  nextPeaks: NextPeaks;
  onCheckUnlock: () => void;
  isLoading?: boolean;
}

function TodayUnlockHero({
  user,
  biorhythm,
  nextPeaks,
  onCheckUnlock,
  isLoading,
}: TodayUnlockHeroProps) {
  const nextPeak = getNextPeakDate(nextPeaks);

  return (
    <motion.div
      initial={{ opacity: 0, y: 21 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[21px] bg-gradient-to-br from-surface-elevated/80 to-surface-elevated/40 border border-surface-elevated/50 p-[34px] sm:p-[44px]"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[440px] h-[440px] bg-octave/5 rounded-full blur-[125px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[264px] h-[264px] bg-transform/5 rounded-full blur-[89px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex flex-col lg:flex-row gap-[34px] items-center lg:items-start">
        {/* Left: Text Content */}
        <div className="flex-1 space-y-[21px] text-center lg:text-left">
          {/* Date & Greeting */}
          <div className="space-y-[8px]">
            <p className="text-[16px] text-text-muted uppercase tracking-wider">
              {formatDate(new Date())}
            </p>
            <h1 className="text-[34px] sm:text-[44px] font-bold text-text leading-tight">
              {getGreeting()}, <span className="text-octave">{user.name}</span>
            </h1>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-[13px] justify-center lg:justify-start pt-[8px]">
            <BiorhythmStatusBadge
              physical={biorhythm.physical}
              emotional={biorhythm.emotional}
              intellectual={biorhythm.intellectual}
              spiritual={biorhythm.spiritual}
              size="md"
            />
            {biorhythm.spiritual > 0.8 && (
              <Badge variant="peak" size="md">
                <Sparkles className="w-[13px] h-[13px]" />
                High Spiritual Energy
              </Badge>
            )}
          </div>

          {/* Next Peak Countdown */}
          <div className="flex items-center gap-[13px] justify-center lg:justify-start text-[16px] text-text-muted">
            <Clock className="w-[19px] h-[19px] text-solar" />
            <span>
              Next {nextPeak.cycle} peak in{" "}
              <span className="text-solar font-semibold">
                {formatDuration(nextPeak.days)}
              </span>
            </span>
          </div>

          {/* CTA Button */}
          <div className="pt-[13px]">
            <Button
              variant="unlock"
              size="lg"
              onClick={onCheckUnlock}
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-[21px] h-[21px]" />}
            >
              Check for New Chapter
            </Button>
          </div>
        </div>

        {/* Right: Biorhythm Wheel */}
        <div className="flex-shrink-0">
          <BiorhythmWheel
            birthDate={user.birthDate}
            cycles={biorhythm}
            size="md"
            showLegend
          />
        </div>
      </div>
    </motion.div>
  );
}

interface BiorhythmOverviewProps {
  biorhythm: BiorhythmCycles;
  birthDate: Date;
  isLoading?: boolean;
}

function BiorhythmOverview({ biorhythm, birthDate, isLoading }: BiorhythmOverviewProps) {
  const router = useRouter();

  if (isLoading) {
    return <BiorhythmOverviewSkeleton />;
  }

  return (
    <DashboardSection
      title="Today's Biorhythm"
      description="Your energy levels across all four cycles"
      action={
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ChevronRight className="w-[16px] h-[16px]" />}
          onClick={() => router.push("/biorhythm" as any)}
        >
          View Full Forecast
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[21px]">
        {/* Biorhythm Bars */}
        <DashboardCard variant="default">
          <BiorhythmBars
            physical={biorhythm.physical}
            emotional={biorhythm.emotional}
            intellectual={biorhythm.intellectual}
            spiritual={biorhythm.spiritual}
            showLabels
          />
        </DashboardCard>

        {/* 7-Day Mini Forecast */}
        <DashboardCard variant="default" title="7-Day Outlook">
          <div className="space-y-[13px]">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
              const dayNum = date.getDate();

              // Simulate forecast values (in real app, calculate actual values)
              const avgEnergy = Math.sin((Date.now() / 86400000 + i) * 0.5) * 0.5 + 0.5;
              const isHigh = avgEnergy > 0.7;
              const isLow = avgEnergy < 0.3;

              return (
                <div
                  key={i}
                  className="flex items-center gap-[13px] p-[8px] rounded-[8px] hover:bg-surface-elevated/50 transition-colors"
                >
                  <div className="w-[44px] text-center">
                    <p className="text-[13px] text-text-muted">{dayName}</p>
                    <p className="text-[19px] font-semibold text-text">{dayNum}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-[8px] bg-void-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-8",
                          isHigh && "bg-solar",
                          isLow && "bg-life",
                          !isHigh && !isLow && "bg-architect"
                        )}
                        style={{ width: `${avgEnergy * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-[55px] text-right">
                    {isHigh ? (
                      <Badge variant="peak" size="sm">
                        <Sparkles className="w-[11px] h-[11px]" />
                      </Badge>
                    ) : isLow ? (
                      <Badge variant="low" size="sm">
                        <Activity className="w-[11px] h-[11px]" />
                      </Badge>
                    ) : (
                      <span className="text-[13px] text-text-muted">
                        {Math.round(avgEnergy * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>
    </DashboardSection>
  );
}

interface ChapterMapProps {
  chapters: DashboardChapter[];
  isLoading?: boolean;
}

function ChapterMap({ chapters, isLoading }: ChapterMapProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"all" | "unlocked" | "inProgress" | "completed">("all");

  if (isLoading) {
    return <ChapterMapSkeleton />;
  }

  const filteredChapters = chapters.filter((chapter) => {
    if (filter === "all") return true;
    return chapter.status === filter;
  });

  const completedCount = chapters.filter((c) => c.status === "completed").length;

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "unlocked", label: "Unlocked" },
    { id: "inProgress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <DashboardSection
      title="Chapter Map"
      description={`${completedCount} of ${chapters.length} chapters completed`}
      action={
        <div className="flex items-center gap-[8px] bg-surface-elevated/50 p-[5px] rounded-[13px]">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={cn(
                "px-[13px] py-[5px] text-[13px] font-medium rounded-[8px] transition-all duration-8",
                filter === tab.id
                  ? "bg-octave text-white"
                  : "text-text-muted hover:text-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[21px]">
        {filteredChapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 21 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <ChapterCard
              {...chapter}
              onClick={() => router.push(`/chapters/${chapter.id}` as any)}
            />
          </motion.div>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-[44px] space-y-[13px]">
          <div className="w-[64px] h-[64px] mx-auto rounded-full bg-surface-elevated flex items-center justify-center">
            <BookOpen className="w-[32px] h-[32px] text-text-muted" />
          </div>
          <p className="text-text-muted">No chapters match the selected filter.</p>
          <Button variant="outline" onClick={() => setFilter("all")}>
            Show All Chapters
          </Button>
        </div>
      )}
    </DashboardSection>
  );
}

interface DailyCheckInProps {
  prompt: { question: string; category: string };
  streak: number;
  lastCheckIn?: Date;
  onCheckIn: (rating: number) => void;
  isLoading?: boolean;
}

function DailyCheckIn({ prompt, streak, lastCheckIn, onCheckIn, isLoading }: DailyCheckInProps) {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  if (isLoading) {
    return <CheckInSkeleton />;
  }

  const hasCheckedInToday = lastCheckIn && getDaysUntil(lastCheckIn) <= 0;

  return (
    <DashboardCard
      variant="highlight"
      title="Daily Check-in"
      icon={<PenLine className="w-[19px] h-[19px]" />}
    >
      <div className="space-y-[21px]">
        {/* Prompt */}
        <div className="space-y-[8px]">
          <Badge variant="default" size="sm">
            {prompt.category}
          </Badge>
          <p className="text-[19px] font-medium text-text leading-relaxed">
            &ldquo;{prompt.question}&rdquo;
          </p>
        </div>

        {/* Mood Rating */}
        {!hasCheckedInToday ? (
          <div className="space-y-[13px]">
            <p className="text-[14px] text-text-muted">How are you feeling today?</p>
            <div className="flex gap-[13px]">
              {[
                { emoji: "😔", label: "Low" },
                { emoji: "😕", label: "Okay" },
                { emoji: "😐", label: "Neutral" },
                { emoji: "🙂", label: "Good" },
                { emoji: "✨", label: "Great" },
              ].map((mood, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedRating(index + 1);
                    onCheckIn(index + 1);
                  }}
                  className={cn(
                    "w-[44px] h-[44px] rounded-full flex items-center justify-center text-[21px]",
                    "bg-surface-elevated border-2 transition-all duration-8",
                    "hover:scale-110 hover:shadow-lg",
                    selectedRating === index + 1
                      ? "border-octave bg-octave/10"
                      : "border-surface-elevated/50 hover:border-octave/50"
                  )}
                  title={mood.label}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-[13px] rounded-[8px] bg-build/10 border border-build/20">
            <p className="text-[14px] text-build flex items-center gap-[8px]">
              <CheckCircle className="w-[16px] h-[16px]" />
              You&apos;ve checked in today. Come back tomorrow!
            </p>
          </div>
        )}

        {/* Streak Display */}
        <div className="flex items-center justify-between pt-[13px] border-t border-surface-elevated/30">
          <div className="flex items-center gap-[13px]">
            <div className="w-[44px] h-[44px] rounded-full bg-solar/20 flex items-center justify-center">
              <Flame className="w-[21px] h-[21px] text-solar" />
            </div>
            <div>
              <p className="text-[24px] font-bold text-text">{streak}</p>
              <p className="text-[13px] text-text-muted">Day Streak</p>
            </div>
          </div>
          {lastCheckIn && (
            <div className="text-right">
              <p className="text-[13px] text-text-muted">Last check-in</p>
              <p className="text-[14px] text-text">
                {lastCheckIn.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}

interface CurrentChapterProps {
  chapter?: DashboardChapter;
  isLoading?: boolean;
}

function CurrentChapter({ chapter, isLoading }: CurrentChapterProps) {
  const router = useRouter();

  if (isLoading) {
    return <CurrentChapterSkeleton />;
  }

  if (!chapter) {
    return (
      <DashboardCard
        variant="default"
        title="Current Chapter"
        icon={<BookOpen className="w-[19px] h-[19px]" />}
      >
        <div className="text-center py-[34px] space-y-[13px]">
          <div className="w-[64px] h-[64px] mx-auto rounded-full bg-surface-elevated flex items-center justify-center">
            <Play className="w-[32px] h-[32px] text-text-muted" />
          </div>
          <p className="text-text-muted">No chapter in progress</p>
          <Button variant="outline" onClick={() => router.push("/chapters")}>
            Browse Chapters
          </Button>
        </div>
      </DashboardCard>
    );
  }

  const remainingTime = chapter.durationEstimate
    ? Math.round((chapter.durationEstimate * (100 - (chapter.progress || 0))) / 100)
    : 0;

  return (
    <DashboardCard
      variant="default"
      title="Continue Reading"
      icon={<BookOpen className="w-[19px] h-[19px]" />}
    >
      <div className="space-y-[21px]">
        {/* Chapter Info */}
        <div className="space-y-[8px]">
          <div className="flex items-center gap-[8px]">
            <Badge variant={chapter.status === "completed" ? "completed" : "peak"} size="sm">
              Chapter {chapter.number}
            </Badge>
            <span className="text-[13px] text-text-muted capitalize">{chapter.cycle} Cycle</span>
          </div>
          <h3 className="text-[21px] font-semibold text-text leading-tight">{chapter.title}</h3>
          {chapter.subtitle && (
            <p className="text-[14px] text-text-muted line-clamp-2">{chapter.subtitle}</p>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-[8px]">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-text-muted">Progress</span>
            <span className="font-medium text-text">{chapter.progress || 0}%</span>
          </div>
          <ProgressBar
            value={chapter.progress || 0}
            size="md"
            variant={
              chapter.cycle === "physical"
                ? "octave"
                : chapter.cycle === "emotional"
                ? "transform"
                : chapter.cycle === "intellectual"
                ? "default"
                : "gradient"
            }
            showValue={false}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-[13px] border-t border-surface-elevated/30">
          {remainingTime > 0 && (
            <div className="flex items-center gap-[8px] text-[14px] text-text-muted">
              <Clock className="w-[16px] h-[16px]" />
              <span>~{formatTimeRemaining(remainingTime)} remaining</span>
            </div>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/chapters/${chapter.id}`)}
            rightIcon={<ChevronRight className="w-[16px] h-[16px]" />}
          >
            Continue
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}

interface StatsRowProps {
  stats: DashboardData["stats"];
  isLoading?: boolean;
}

function StatsRow({ stats, isLoading }: StatsRowProps) {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  const statItems = [
    {
      icon: CheckCircle,
      value: stats.totalChaptersCompleted,
      label: "Chapters Completed",
      color: "text-build",
      bgColor: "bg-build/10",
    },
    {
      icon: Flame,
      value: stats.currentStreak,
      label: "Day Streak",
      suffix: " days",
      color: "text-solar",
      bgColor: "bg-solar/10",
    },
    {
      icon: Timer,
      value: formatTimeRemaining(stats.totalPracticeTime),
      label: "Total Practice Time",
      color: "text-architect",
      bgColor: "bg-architect/10",
      isTextValue: true,
    },
    {
      icon: Calendar,
      value: stats.nextUnlockEstimate
        ? formatDuration(getDaysUntil(stats.nextUnlockEstimate))
        : "Unknown",
      label: "Next Unlock Estimate",
      color: "text-transform",
      bgColor: "bg-transform/10",
      isTextValue: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[13px] sm:gap-[21px]">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="p-[21px] rounded-[13px] bg-surface-elevated/50 border border-surface-elevated/50 hover:border-surface-elevated transition-colors"
        >
          <div className="flex items-start gap-[13px]">
            <div className={cn("w-[44px] h-[44px] rounded-[13px] flex items-center justify-center", stat.bgColor)}>
              <stat.icon className={cn("w-[21px] h-[21px]", stat.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[24px] sm:text-[28px] font-bold text-text truncate">
                {typeof stat.value === "number" && !stat.isTextValue
                  ? stat.value.toLocaleString()
                  : stat.value}
                {stat.suffix && <span className="text-[16px] text-text-muted">{stat.suffix}</span>}
              </p>
              <p className="text-[13px] text-text-muted">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface QuickLinksProps {
  isLoading?: boolean;
}

function QuickLinks({ isLoading }: QuickLinksProps) {
  const router = useRouter();

  if (isLoading) {
    return <QuickLinksSkeleton />;
  }

  const links = [
    {
      icon: Library,
      label: "Chapter Library",
      description: "Browse all chapters",
      href: "/chapters",
      color: "text-octave",
      bgColor: "bg-octave/10",
    },
    {
      icon: Activity,
      label: "Biorhythm Details",
      description: "Deep dive analysis",
      href: "/biorhythm",
      color: "text-transform",
      bgColor: "bg-transform/10",
    },
    {
      icon: PenLine,
      label: "Reflections Journal",
      description: "Your insights & notes",
      href: "/journal",
      color: "text-witness",
      bgColor: "bg-witness/10",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Preferences & account",
      href: "/settings",
      color: "text-solar",
      bgColor: "bg-solar/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[13px]">
      {links.map((link, index) => (
        <motion.button
          key={link.label}
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          onClick={() => router.push(link.href as any)}
          className="p-[21px] rounded-[13px] bg-surface-elevated/50 border border-surface-elevated/50 hover:border-surface-elevated hover:bg-surface-elevated transition-all duration-8 text-left group"
        >
          <div className={cn("w-[44px] h-[44px] rounded-[13px] flex items-center justify-center mb-[13px]", link.bgColor)}>
            <link.icon className={cn("w-[21px] h-[21px]", link.color)} />
          </div>
          <p className="text-[16px] font-semibold text-text group-hover:text-octave transition-colors">
            {link.label}
          </p>
          <p className="text-[13px] text-text-muted">{link.description}</p>
        </motion.button>
      ))}
    </div>
  );
}

// ============================================================================
// Mock Data (for development)
// ============================================================================

const mockDashboardData: DashboardData = {
  user: {
    id: "user-1",
    name: "Seeker",
    birthDate: new Date("1990-01-01"),
    streak: 12,
    lastCheckIn: new Date(Date.now() - 86400000), // Yesterday
  },
  biorhythm: {
    physical: 0.65,
    emotional: -0.3,
    intellectual: 0.85,
    spiritual: 0.92,
  },
  nextPeaks: {
    physical: new Date(Date.now() + 86400000 * 3),
    emotional: new Date(Date.now() + 86400000 * 7),
    intellectual: new Date(Date.now() + 86400000 * 2),
    spiritual: new Date(Date.now() + 86400000 * 5),
  },
  chapters: [
    {
      id: "ch-1",
      number: 1,
      title: "The First Somatic Breath",
      subtitle: "Awakening the body consciousness",
      status: "completed",
      cycle: "physical",
      progress: 100,
      durationEstimate: 15,
    },
    {
      id: "ch-2",
      number: 2,
      title: "The Architecture of Attention",
      subtitle: "Building the witness state",
      status: "completed",
      cycle: "intellectual",
      progress: 100,
      durationEstimate: 20,
    },
    {
      id: "ch-3",
      number: 3,
      title: "Emotional Alchemy",
      subtitle: "Transforming feeling into wisdom",
      status: "inProgress",
      cycle: "emotional",
      progress: 65,
      durationEstimate: 25,
    },
    {
      id: "ch-4",
      number: 4,
      title: "The Solar Gateway",
      subtitle: "Accessing higher consciousness",
      status: "unlocked",
      cycle: "spiritual",
      progress: 0,
      durationEstimate: 30,
    },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `ch-${i + 5}`,
      number: i + 5,
      title: `Chapter ${i + 5}: The Unfolding Path`,
      subtitle: "Awaiting your journey",
      status: "locked" as ChapterStatus,
      cycle: ["physical", "emotional", "intellectual", "spiritual"][i % 4] as BiorhythmCycle,
      progress: 0,
      durationEstimate: 20 + (i % 3) * 5,
      unlockDate: new Date(Date.now() + 86400000 * (i + 1) * 7),
    })),
  ],
  currentChapter: {
    id: "ch-3",
    number: 3,
    title: "Emotional Alchemy",
    subtitle: "Transforming feeling into wisdom",
    status: "inProgress",
    cycle: "emotional",
    progress: 65,
    durationEstimate: 25,
  },
  stats: {
    totalChaptersCompleted: 2,
    totalListeningTime: 180,
    currentStreak: 12,
    longestStreak: 15,
    lastActiveAt: new Date(Date.now() - 86400000),
    totalPracticeTime: 340,
    nextUnlockEstimate: new Date(Date.now() + 86400000 * 3),
  },
  dailyPrompt: {
    question: "What sensation in your body right now is asking for attention?",
    category: "Body Awareness",
  },
};

// ============================================================================
// Main Dashboard Page
// ============================================================================

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isCheckingUnlock, setIsCheckingUnlock] = React.useState(false);
  const router = useRouter();

  // Simulate data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockDashboardData);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckUnlock = async () => {
    setIsCheckingUnlock(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCheckingUnlock(false);
    // Show toast or modal with result
    alert("No new chapters available yet. Check back when your cycles align!");
  };

  const handleCheckIn = (rating: number) => {
    console.log("Check-in rating:", rating);
    // Update streak and last check-in
    if (data) {
      setData({
        ...data,
        user: {
          ...data.user,
          lastCheckIn: new Date(),
          streak: data.user.streak + 1,
        },
      });
    }
  };

  return (
    <DashboardLayout
      user={
        data
          ? {
              id: data.user.id,
              name: data.user.name,
              avatar: data.user.avatar,
              streak: data.user.streak,
            }
          : undefined
      }
      biorhythm={
        data
          ? {
              physical: data.biorhythm.physical,
              emotional: data.biorhythm.emotional,
              intellectual: data.biorhythm.intellectual,
              spiritual: data.biorhythm.spiritual,
            }
          : undefined
      }
      chapterProgress={
        data
          ? {
              completed: data.stats.totalChaptersCompleted,
              total: data.chapters.length,
              currentChapter: data.currentChapter
                ? {
                    id: data.currentChapter.id,
                    title: data.currentChapter.title,
                    cycle: data.currentChapter.cycle,
                  }
                : undefined,
            }
          : undefined
      }
    >
      <div className="space-y-[44px]">
        {/* Today's Unlock Hero Section */}
        {isLoading ? (
          <HeroSkeleton />
        ) : data ? (
          <TodayUnlockHero
            user={data.user}
            biorhythm={data.biorhythm}
            nextPeaks={data.nextPeaks}
            onCheckUnlock={handleCheckUnlock}
            isLoading={isCheckingUnlock}
          />
        ) : null}

        {/* Stats Row */}
        <StatsRow stats={data?.stats || ({} as DashboardData["stats"])} isLoading={isLoading} />

        {/* Two Column Layout for Check-in and Current Chapter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[21px]">
          {/* Daily Check-in Card */}
          <DailyCheckIn
            prompt={data?.dailyPrompt || { question: "", category: "" }}
            streak={data?.user.streak || 0}
            lastCheckIn={data?.user.lastCheckIn}
            onCheckIn={handleCheckIn}
            isLoading={isLoading}
          />

          {/* Current Chapter Card */}
          <CurrentChapter chapter={data?.currentChapter} isLoading={isLoading} />
        </div>

        {/* Biorhythm Overview Section */}
        <BiorhythmOverview
          biorhythm={data?.biorhythm || ({ physical: 0, emotional: 0, intellectual: 0, spiritual: 0 } as BiorhythmCycles)}
          birthDate={data?.user.birthDate || new Date()}
          isLoading={isLoading}
        />

        {/* Chapter Map Section */}
        <ChapterMap chapters={data?.chapters || []} isLoading={isLoading} />

        {/* Quick Links */}
        <DashboardSection title="Quick Links">
          <QuickLinks isLoading={isLoading} />
        </DashboardSection>
      </div>
    </DashboardLayout>
  );
}
