"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CycleBadge, BiorhythmCycle } from "./cycle-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Sparkles,
  Clock,
  BookOpen,
  Bell,
  Share2,
  Play,
  Calendar,
  Activity,
  X,
} from "lucide-react";

export interface UnlockModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Chapter data */
  chapter: {
    id: string;
    number: number;
    title: string;
    subtitle?: string;
    description?: string;
    cycle: BiorhythmCycle;
    durationEstimate?: number;
    unlockRequirements?: {
      physicalMin?: number;
      emotionalMin?: number;
      intellectualMin?: number;
      daysSinceLastChapter?: number;
    };
  } | null;
  /** Current biorhythm values */
  biorhythmState?: {
    physical: number;
    emotional: number;
    intellectual: number;
  };
  /** Callback when user chooses to begin chapter */
  onBeginChapter: () => void;
  /** Callback when user chooses to be reminded later */
  onRemindLater: () => void;
  /** Callback when user shares achievement */
  onShare?: () => void;
  /** Whether the chapter is currently unlockable */
  isUnlockable?: boolean;
}

const cycleDescriptions: Record<BiorhythmCycle, { 
  title: string; 
  description: string;
  trigger: string;
}> = {
  physical: {
    title: "Physical Cycle",
    description: "This chapter resonates with your body's energy rhythms. Best experienced when your physical vitality is high.",
    trigger: "Your physical cycle is at 70% or higher",
  },
  emotional: {
    title: "Emotional Cycle",
    description: "This chapter works with your emotional waves. Opens when your heart is ready to receive.",
    trigger: "Your emotional cycle is at 65% or higher",
  },
  intellectual: {
    title: "Intellectual Cycle",
    description: "This chapter engages your mental clarity. Unlocks when your mind seeks understanding.",
    trigger: "Your intellectual cycle is at 60% or higher",
  },
  spiritual: {
    title: "Spiritual Cycle",
    description: "This chapter speaks to your deeper essence. Reveals itself when soul and body align.",
    trigger: "All three cycles are in harmony",
  },
};

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onClose,
  chapter,
  biorhythmState,
  onBeginChapter,
  onRemindLater,
  onShare,
  isUnlockable = true,
}) => {
  if (!chapter) return null;

  const cycleInfo = cycleDescriptions[chapter.cycle];
  
  // Check requirements
  const requirements = chapter.unlockRequirements;
  const meetsPhysical = !requirements?.physicalMin || (biorhythmState?.physical || 0) >= requirements.physicalMin;
  const meetsEmotional = !requirements?.emotionalMin || (biorhythmState?.emotional || 0) >= requirements.emotionalMin;
  const meetsIntellectual = !requirements?.intellectualMin || (biorhythmState?.intellectual || 0) >= requirements.intellectualMin;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={true}
      className="overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 13 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -13 }}
          transition={{ duration: 0.3 }}
          className="space-y-[21px]"
        >
          {/* Header with Chapter Preview */}
          <div className="space-y-[13px]">
            <div className="flex items-start justify-between">
              <div className="space-y-[8px]">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[13px] font-medium text-slate-400">
                    Chapter {chapter.number}
                  </span>
                  <CycleBadge cycle={chapter.cycle} />
                </div>
                <h2 className="text-[28px] font-bold text-slate-900 leading-tight">
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="text-[16px] text-slate-500">{chapter.subtitle}</p>
                )}
              </div>
              
              {/* Unlock Badge */}
              <motion.div
                className={cn(
                  "flex items-center justify-center w-[64px] h-[64px] rounded-full",
                  isUnlockable
                    ? "bg-gradient-to-br from-octave to-transform text-white"
                    : "bg-slate-100 text-slate-400"
                )}
                animate={isUnlockable ? {
                  boxShadow: [
                    "0 0 0 0 rgba(255, 107, 107, 0)",
                    "0 0 0 13px rgba(255, 107, 107, 0.2)",
                    "0 0 0 0 rgba(255, 107, 107, 0)",
                  ],
                } : undefined}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-[28px] h-[28px]" />
              </motion.div>
            </div>

            {/* Description Teaser */}
            {chapter.description && (
              <p className="text-[16px] text-slate-600 leading-relaxed line-clamp-3">
                {chapter.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-[13px] text-[13px] text-slate-500">
              {chapter.durationEstimate && (
                <span className="flex items-center gap-[5px]">
                  <Clock className="w-[13px] h-[13px]" />
                  {chapter.durationEstimate} minutes
                </span>
              )}
              <span className="flex items-center gap-[5px]">
                <BookOpen className="w-[13px] h-[13px]" />
                Canticle included
              </span>
              <span className="flex items-center gap-[5px]">
                <Activity className="w-[13px] h-[13px]" />
                {cycleInfo.title}
              </span>
            </div>
          </div>

          {/* Biorhythm Trigger Explanation */}
          <div className="bg-slate-50 rounded-[13px] p-[21px] space-y-[13px]">
            <h3 className="text-[16px] font-semibold text-slate-900 flex items-center gap-[8px]">
              <Activity className="w-[16px] h-[16px] text-transform" />
              Biorhythm Trigger
            </h3>
            
            <p className="text-[14px] text-slate-600">{cycleInfo.description}</p>
            
            <div className="bg-white rounded-[8px] p-[13px] border border-slate-200">
              <p className="text-[13px] font-medium text-slate-700 mb-[8px]">
                Unlock Condition: {cycleInfo.trigger}
              </p>
              
              {/* Biorhythm Bars */}
              {biorhythmState && requirements && (
                <div className="space-y-[8px]">
                  {requirements.physicalMin !== undefined && (
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-slate-500">Physical</span>
                        <span className={meetsPhysical ? "text-world-dark" : "text-slate-400"}>
                          {biorhythmState.physical}%
                          {meetsPhysical ? " ✓" : ` / ${requirements.physicalMin}% needed`}
                        </span>
                      </div>
                      <ProgressBar
                        value={biorhythmState.physical}
                        max={100}
                        size="sm"
                        variant={meetsPhysical ? "octave" : "default"}
                        showValue={false}
                      />
                    </div>
                  )}
                  
                  {requirements.emotionalMin !== undefined && (
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-slate-500">Emotional</span>
                        <span className={meetsEmotional ? "text-world-dark" : "text-slate-400"}>
                          {biorhythmState.emotional}%
                          {meetsEmotional ? " ✓" : ` / ${requirements.emotionalMin}% needed`}
                        </span>
                      </div>
                      <ProgressBar
                        value={biorhythmState.emotional}
                        max={100}
                        size="sm"
                        variant={meetsEmotional ? "transform" : "default"}
                        showValue={false}
                      />
                    </div>
                  )}
                  
                  {requirements.intellectualMin !== undefined && (
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-slate-500">Intellectual</span>
                        <span className={meetsIntellectual ? "text-world-dark" : "text-slate-400"}>
                          {biorhythmState.intellectual}%
                          {meetsIntellectual ? " ✓" : ` / ${requirements.intellectualMin}% needed`}
                        </span>
                      </div>
                      <ProgressBar
                        value={biorhythmState.intellectual}
                        max={100}
                        size="sm"
                        variant={meetsIntellectual ? "world" : "default"}
                        showValue={false}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-[13px] pt-[8px]">
            <Button
              variant="unlock"
              size="lg"
              className="w-full"
              onClick={onBeginChapter}
              disabled={!isUnlockable}
              leftIcon={<Play className="w-[19px] h-[19px]" />}
            >
              {isUnlockable ? "Begin Chapter" : "Requirements Not Met"}
            </Button>
            
            <div className="flex items-center justify-center gap-[13px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemindLater}
                leftIcon={<Bell className="w-[13px] h-[13px]" />}
              >
                Remind Me Later
              </Button>
              
              {onShare && isUnlockable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  leftIcon={<Share2 className="w-[13px] h-[13px]" />}
                >
                  Share
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

UnlockModal.displayName = "UnlockModal";

export default UnlockModal;
