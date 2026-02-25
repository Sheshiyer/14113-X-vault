"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Play, Pause, Maximize2, SkipBack, SkipForward } from "lucide-react";
import { useAudio, AudioTrack } from "@/hooks/useAudio";

export interface MiniPlayerProps {
  src?: string;
  title?: string;
  chapterTitle?: string;
  tracks?: AudioTrack[];
  initialTrackIndex?: number;
  autoPlay?: boolean;
  className?: string;
  sticky?: boolean;
  onExpand?: () => void;
  onTrackChange?: (track: AudioTrack | null) => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  src,
  title,
  chapterTitle,
  tracks = [],
  initialTrackIndex = 0,
  autoPlay = false,
  className,
  sticky = false,
  onExpand,
  onTrackChange,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const hasTracks = tracks.length > 1;

  const {
    audioRef,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    currentTrack,
    currentTrackIndex,
    averageFrequency,
    toggle,
    seek,
    nextTrack,
    previousTrack,
    formatTime,
  } = useAudio({
    src,
    autoPlay,
    tracks,
    initialTrackIndex,
  });

  // Notify parent of track changes
  React.useEffect(() => {
    onTrackChange?.(currentTrack);
  }, [currentTrack, onTrackChange]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  // Calculate background color based on frequency
  const getBackgroundStyles = React.useMemo(() => {
    if (!isPlaying || averageFrequency < 10) {
      return "bg-surface/95";
    }

    const intensity = Math.min(averageFrequency / 128, 1);
    
    if (averageFrequency < 40) {
      return `bg-gradient-to-r from-octave/${Math.round(intensity * 20)} to-surface/95`;
    } else if (averageFrequency < 100) {
      return `bg-gradient-to-r from-transform/${Math.round(intensity * 20)} to-surface/95`;
    }
    return `bg-gradient-to-r from-solar/${Math.round(intensity * 20)} to-surface/95`;
  }, [isPlaying, averageFrequency]);

  // Progress bar interaction
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !progressRef.current || duration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(percent * duration);
    },
    [isDragging, duration, seek]
  );

  const handleProgressMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    seek(percent * duration);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleProgressMouseMove);
      window.addEventListener("mouseup", handleProgressMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleProgressMouseMove);
      window.removeEventListener("mouseup", handleProgressMouseUp);
    };
  }, [isDragging, handleProgressMouseMove, handleProgressMouseUp]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayTitle = currentTrack?.title || title || "Untitled";
  const displayChapter = chapterTitle || (currentTrack?.chapterNumber ? `Chapter ${currentTrack.chapterNumber}` : "");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[13px] transition-all duration-[1300ms] ease-sacred",
        getBackgroundStyles,
        "border border-white/[0.08] backdrop-blur-[13px]",
        sticky && "fixed bottom-[21px] left-[21px] right-[21px] z-44 shadow-lg",
        className
      )}
    >
      {/* Ambient glow when playing */}
      {isPlaying && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 animate-pulse-13 pointer-events-none",
            averageFrequency < 40 && "bg-octave/5",
            averageFrequency >= 40 && averageFrequency < 100 && "bg-transform/5",
            averageFrequency >= 100 && "bg-solar/5"
          )}
        />
      )}

      <audio ref={audioRef} src={currentTrack?.src || src} preload="metadata" />

      <div className="relative flex items-center gap-[13px] p-[13px]">
        {/* Play/Pause button */}
        <button
          onClick={toggle}
          disabled={isLoading}
          className={cn(
            "flex-shrink-0 w-[44px] h-[44px] rounded-full flex items-center justify-center",
            "bg-octave hover:bg-octave-dark active:bg-octave-dark transition-all duration-8",
            "shadow-[0_2px_13px_rgba(255,107,107,0.3)]",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <div className="w-[19px] h-[19px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isPlaying ? (
            <div className="relative w-[19px] h-[19px]">
              <div className="absolute left-0 top-0 w-[6px] h-full bg-white rounded-[2px] animate-pulse-8" />
              <div className="absolute right-0 top-0 w-[6px] h-full bg-white rounded-[2px] animate-pulse-8 [animation-delay:100ms]" />
            </div>
          ) : (
            <Play className="w-[19px] h-[19px] text-white ml-[2px]" fill="white" />
          )}
        </button>

        {/* Track info and progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[8px] mb-[5px]">
            <h4 className="text-[13px] font-medium text-text truncate leading-[21px]">
              {displayTitle}
            </h4>
            {displayChapter && (
              <span className="text-[11px] text-text-muted whitespace-nowrap">
                · {displayChapter}
              </span>
            )}
          </div>

          {/* Mini progress bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
            onTouchStart={handleTouch}
            onTouchMove={handleTouch}
            className="relative h-[4px] bg-void-700/50 rounded-full cursor-pointer group"
            role="slider"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Seek"
          >
            <div
              className={cn(
                "absolute left-0 top-0 h-full rounded-full transition-all duration-8",
                isPlaying ? "bg-octave" : "bg-witness",
                isDragging && "transition-none"
              )}
              style={{ width: `${progressPercent}%` }}
            />
            
            {/* Hover indicator */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-[13px] h-[13px] rounded-full bg-white",
                "transition-all duration-8 scale-0 group-hover:scale-100",
                isDragging && "scale-100"
              )}
              style={{ left: `calc(${progressPercent}% - 6.5px)` }}
            />
          </div>

          {/* Time display */}
          <div className="flex items-center justify-between mt-[5px]">
            <span className="text-[11px] text-text-muted tabular-nums">
              {formatTime(currentTime)}
            </span>
            <span className="text-[11px] text-text-muted tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Track navigation (if multiple tracks) */}
        {hasTracks && (
          <div className="flex items-center gap-[5px]">
            <button
              onClick={previousTrack}
              className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
              aria-label="Previous track"
            >
              <SkipBack className="w-[16px] h-[16px]" />
            </button>
            <button
              onClick={nextTrack}
              className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
              aria-label="Next track"
            >
              <SkipForward className="w-[16px] h-[16px]" />
            </button>
          </div>
        )}

        {/* Expand button */}
        {onExpand && (
          <button
            onClick={onExpand}
            className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
            aria-label="Expand player"
          >
            <Maximize2 className="w-[19px] h-[19px]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MiniPlayer;
