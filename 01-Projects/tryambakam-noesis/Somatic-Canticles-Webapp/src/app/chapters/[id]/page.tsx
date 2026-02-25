"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  CycleBadge,
  ChapterNavigation,
  ChapterProgressTracker,
  UnlockAnimation,
} from "@/components/chapters";
import { AudioPlayer } from "@/components/audio/player";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils/cn";
import {
  getChapterById,
  chapters,
  getChapterByNumber,
  ChapterData,
} from "@/lib/data/chapters";
import {
  Lock,
  Unlock,
  Play,
  CheckCircle,
  Clock,
  Bell,
  ChevronRight,
  Sparkles,
  BookOpen,
  Heart,
  Target,
  Lightbulb,
  FileText,
} from "lucide-react";

// Completion Celebration Component
const CompletionCelebration = ({
  isActive,
  chapterTitle,
  onComplete,
}: {
  isActive: boolean;
  chapterTitle: string;
  onComplete: () => void;
}) => {
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    if (isActive) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-[13px]"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(19)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[8px] h-[8px] rounded-full bg-octave"
            initial={{
              x: "50%",
              y: "50%",
              scale: 0,
            }}
            animate={{
              x: `${50 + Math.cos((i / 19) * Math.PI * 2) * 40}%`,
              y: `${50 + Math.sin((i / 19) * Math.PI * 2) * 40}%`,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.05,
              repeat: 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center space-y-[21px] px-[21px]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="w-[88px] h-[88px] mx-auto rounded-full bg-build flex items-center justify-center"
        >
          <CheckCircle className="w-[44px] h-[44px] text-white" />
        </motion.div>

        <div className="space-y-[8px]">
          <motion.h2
            initial={{ y: 21, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[44px] font-bold text-text"
          >
            Canticle Complete!
          </motion.h2>
          <motion.p
            initial={{ y: 21, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[21px] text-text-muted"
          >
            You have completed <span className="text-build font-semibold">{chapterTitle}</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 21, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-[13px] pt-[21px]"
        >
          <div className="flex items-center gap-[8px] px-[21px] py-[13px] bg-surface-elevated rounded-[13px]">
            <Sparkles className="w-[21px] h-[21px] text-solar" />
            <span className="text-[19px] font-semibold text-text">+125 Wisdom</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[14px] text-text-muted pt-[21px]"
        >
          Next canticle unlocks when your cycle peaks...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Locked State Component
const LockedChapterView = ({
  chapter,
  onNotify,
}: {
  chapter: ChapterData;
  onNotify: () => void;
}) => {
  const cycleColors = {
    physical: "text-octave",
    emotional: "text-transform",
    intellectual: "text-witness",
    spiritual: "text-unity",
  };

  const nextPeak = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="flex flex-col items-center justify-center py-[88px] px-[21px] text-center space-y-[21px]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-[125px] h-[125px] rounded-full bg-surface-elevated flex items-center justify-center border-2 border-surface-elevated/50">
          <Lock className="w-[55px] h-[55px] text-text-muted" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-[8px] -right-[8px] w-[34px] h-[34px] rounded-full bg-octave flex items-center justify-center"
        >
          <span className="text-white font-bold text-[13px]">{chapter.number}</span>
        </motion.div>
      </motion.div>

      <div className="space-y-[8px] max-w-[400px]">
        <h2 className="text-[28px] font-bold text-text">Chapter Locked</h2>
        <p className="text-[16px] text-text-muted">
          This canticle will unlock when your{" "}
          <span className={cn("font-semibold", cycleColors[chapter.cycle])}>
            {chapter.cycle}
          </span>{" "}
          cycle reaches its peak
        </p>
      </div>

      {/* Unlock Requirements */}
      <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] border border-surface-elevated/30 w-full max-w-[400px]">
        <h3 className="text-[14px] font-semibold text-text mb-[13px] flex items-center gap-[8px]">
          <Target className="w-[16px] h-[16px] text-octave" />
          Unlock Requirements
        </h3>
        <ul className="space-y-[8px]">
          <li className="flex items-center gap-[8px] text-[14px] text-text-muted">
            <CheckCircle className="w-[16px] h-[16px] text-build" />
            Complete previous chapter
          </li>
          <li className="flex items-center gap-[8px] text-[14px] text-text-muted">
            <Clock className="w-[16px] h-[16px] text-solar" />
            Wait for {chapter.cycle} cycle peak
          </li>
          <li className="flex items-center gap-[8px] text-[14px] text-text-muted">
            <Sparkles className="w-[16px] h-[16px] text-transform" />
            Maintain daily practice streak
          </li>
        </ul>
      </div>

      {/* Next Peak Prediction */}
      <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] border border-surface-elevated/30 w-full max-w-[400px]">
        <h3 className="text-[14px] font-semibold text-text mb-[13px] flex items-center gap-[8px]">
          <Clock className="w-[16px] h-[16px] text-solar" />
          Next Peak Prediction
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[21px] font-bold text-text">
              {nextPeak.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-[14px] text-text-muted">
              Approx. {chapter.cyclePeak.hour}:00
            </p>
          </div>
          <div className="text-right">
            <p className="text-[28px] font-bold text-octave">2</p>
            <p className="text-[13px] text-text-muted">days remaining</p>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        leftIcon={<Bell className="w-[19px] h-[19px]" />}
        onClick={onNotify}
        className="mt-[13px]"
      >
        Notify Me When Available
      </Button>
    </div>
  );
};

// Main Chapter Content Component
const ChapterContent = ({
  chapter,
  onMarkComplete,
  notes,
  onNotesChange,
}: {
  chapter: ChapterData;
  onMarkComplete: () => void;
  notes: string;
  onNotesChange: (value: string) => void;
}) => {
  const [activeSection, setActiveSection] = React.useState<"intro" | "practice" | "reflection">("intro");

  const sections = {
    intro: {
      icon: <BookOpen className="w-[16px] h-[16px]" />,
      title: "Introduction",
      content: chapter.content.intro,
    },
    practice: {
      icon: <Target className="w-[16px] h-[16px]" />,
      title: "Practice",
      content: chapter.content.practice,
    },
    reflection: {
      icon: <Lightbulb className="w-[16px] h-[16px]" />,
      title: "Reflection",
      content: chapter.content.reflection,
    },
  };

  return (
    <div className="space-y-[21px]">
      {/* Audio Player */}
      {chapter.audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AudioPlayer
            src={chapter.audioUrl}
            title={`Chapter ${chapter.number}: ${chapter.title}`}
            showPlaylist={false}
          />
        </motion.div>
      )}

      {/* Content Sections */}
      <motion.div
        initial={{ opacity: 0, y: 13 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-surface-elevated/30 rounded-[13px] border border-surface-elevated/30 overflow-hidden"
      >
        {/* Section Tabs */}
        <div className="flex border-b border-surface-elevated/30">
          {(Object.keys(sections) as Array<keyof typeof sections>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-[8px] py-[13px] px-[21px] text-[14px] font-medium transition-all duration-200",
                activeSection === key
                  ? "bg-surface-elevated text-text border-b-2 border-octave"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated/50"
              )}
            >
              {sections[key].icon}
              {sections[key].title}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="p-[21px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 13 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -13 }}
              transition={{ duration: 0.2 }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-[16px] leading-[1.8] text-text/90">
                {sections[activeSection].content}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 13 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ChapterProgressTracker
          chapterNumber={chapter.number}
          chapterTitle={chapter.title}
          completionPercentage={chapter.progress}
          checkpoints={chapter.checkpoints.map(cp => ({
            id: cp.id,
            title: cp.title,
            isCompleted: false,
          }))}
          estimatedCompletionMinutes={chapter.estimatedDuration}
          isCompleted={chapter.status === "completed"}
        />
      </motion.div>

      {/* Chapter Notes */}
      <motion.div
        initial={{ opacity: 0, y: 13 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-surface-elevated/30 rounded-[13px] p-[21px] border border-surface-elevated/30"
      >
        <h3 className="text-[16px] font-semibold text-text mb-[13px] flex items-center gap-[8px]">
          <FileText className="w-[16px] h-[16px] text-witness" />
          Chapter Notes & Journal
        </h3>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Record your insights, sensations, and reflections from this canticle..."
          className="w-full h-[125px] bg-surface-elevated/50 border border-surface-elevated/50 rounded-[8px] p-[13px] text-[14px] text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-octave/20 focus:border-octave/30 resize-none transition-all"
        />
        <div className="flex items-center justify-between mt-[13px]">
          <span className="text-[13px] text-text-muted">
            {notes.length} characters
          </span>
          <Button variant="ghost" size="sm">
            Save Notes
          </Button>
        </div>
      </motion.div>

      {/* Mark as Complete Button */}
      {chapter.status !== "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            leftIcon={<CheckCircle className="w-[21px] h-[21px]" />}
            onClick={onMarkComplete}
          >
            Mark as Complete
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// Main Page Component
export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id as string;

  const chapter = React.useMemo(() => getChapterById(chapterId), [chapterId]);
  const [notes, setNotes] = React.useState("");
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = React.useState(false);

  // Handle invalid chapter
  if (!chapter) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-[88px] text-center">
          <BookOpen className="w-[55px] h-[55px] text-text-muted mb-[21px]" />
          <h2 className="text-[28px] font-bold text-text mb-[8px]">
            Chapter Not Found
          </h2>
          <p className="text-[16px] text-text-muted mb-[21px]">
            The canticle you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/chapters")}>
            Return to Chapters
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Get prev/next chapters
  const prevChapter = getChapterByNumber(chapter.number - 1);
  const nextChapter = getChapterByNumber(chapter.number + 1);

  // Handle mark complete
  const handleMarkComplete = () => {
    setShowCelebration(true);
  };

  // Handle notify me
  const handleNotify = () => {
    // TODO: Implement notification logic
    alert("You will be notified when this chapter unlocks!");
  };

  // Cycle color mapping
  const cycleColors = {
    physical: "border-octave/30",
    emotional: "border-transform/30",
    intellectual: "border-witness/30",
    spiritual: "border-unity/30",
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
        completed: chapters.filter((c) => c.status === "completed").length,
        total: chapters.length,
        currentChapter: {
          id: chapter.id,
          title: chapter.title,
          cycle: chapter.cycle,
        },
      }}
    >
      <div className="space-y-[21px]">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: -13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "bg-surface-elevated/30 rounded-[13px] p-[21px] border",
            cycleColors[chapter.cycle]
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[13px]">
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[13px]">
                <span className="text-[13px] font-medium text-text-muted">
                  Chapter {chapter.number}
                </span>
                <CycleBadge cycle={chapter.cycle} size="sm" />
              </div>
              <h1 className="text-[28px] sm:text-[44px] font-bold text-text leading-tight">
                {chapter.title}
              </h1>
              <p className="text-[16px] sm:text-[19px] text-text-muted">
                {chapter.subtitle}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              {chapter.status === "locked" ? (
                <div className="flex items-center gap-[8px] px-[21px] py-[13px] rounded-[13px] bg-surface-elevated text-text-muted">
                  <Lock className="w-[19px] h-[19px]" />
                  <span className="font-medium">Locked</span>
                </div>
              ) : chapter.status === "completed" ? (
                <div className="flex items-center gap-[8px] px-[21px] py-[13px] rounded-[13px] bg-build/10 text-build">
                  <CheckCircle className="w-[19px] h-[19px]" />
                  <span className="font-medium">Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-[8px] px-[21px] py-[13px] rounded-[13px] bg-octave/10 text-octave">
                  <Play className="w-[19px] h-[19px]" />
                  <span className="font-medium">In Progress</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar for In-Progress */}
          {chapter.status === "inProgress" && (
            <div className="mt-[21px] pt-[21px] border-t border-surface-elevated/30">
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[13px] text-text-muted">Progress</span>
                <span className="text-[13px] font-medium text-text">
                  {Math.round(chapter.progress)}%
                </span>
              </div>
              <ProgressBar
                value={chapter.progress}
                size="sm"
                variant="gradient"
                animated
              />
            </div>
          )}
        </motion.div>

        {/* Main Content Area */}
        {chapter.status === "locked" ? (
          <LockedChapterView chapter={chapter} onNotify={handleNotify} />
        ) : (
          <ChapterContent
            chapter={chapter}
            onMarkComplete={handleMarkComplete}
            notes={notes}
            onNotesChange={setNotes}
          />
        )}

        {/* Chapter Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ChapterNavigation
            currentChapter={chapter.number}
            totalChapters={12}
            isPrevLocked={prevChapter?.status === "locked"}
            isNextLocked={nextChapter?.status === "locked"}
            onPrevious={() =>
              prevChapter && router.push(`/chapters/${prevChapter.id}`)
            }
            onNext={() =>
              nextChapter && router.push(`/chapters/${nextChapter.id}`)
            }
            onChapterMap={() => router.push("/chapters")}
            chapterTitles={Object.fromEntries(
              chapters.map((c) => [c.number, c.title])
            )}
          />
        </motion.div>
      </div>

      {/* Completion Celebration */}
      <CompletionCelebration
        isActive={showCelebration}
        chapterTitle={chapter.title}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Unlock Animation (for demonstration) */}
      <UnlockAnimation
        isActive={showUnlockAnimation}
        chapterNumber={chapter.number}
        chapterTitle={chapter.title}
        onComplete={() => setShowUnlockAnimation(false)}
        onSkip={() => setShowUnlockAnimation(false)}
      />
    </DashboardLayout>
  );
}
