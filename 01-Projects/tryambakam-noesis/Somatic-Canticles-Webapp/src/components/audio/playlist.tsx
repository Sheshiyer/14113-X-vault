"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Play, Pause, Lock, Check, Volume2, Shuffle, Repeat, Repeat1 } from "lucide-react";
import { AudioTrack, RepeatMode } from "@/hooks/useAudio";

export interface PlaylistProps {
  tracks: AudioTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  autoplayNext: boolean;
  onSelectTrack: (index: number) => void;
  onToggleShuffle: () => void;
  onCycleRepeatMode: () => void;
  onToggleAutoplay: () => void;
  className?: string;
  showChapterNumbers?: boolean;
  completedTracks?: string[];
  lockedTracks?: string[];
}

export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  isShuffled,
  repeatMode,
  autoplayNext,
  onSelectTrack,
  onToggleShuffle,
  onCycleRepeatMode,
  onToggleAutoplay,
  className,
  showChapterNumbers = true,
  completedTracks = [],
  lockedTracks = [],
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Format duration as mm:ss
  const formatDuration = (seconds?: number): string => {
    if (!seconds || isNaN(seconds)) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get track status
  const getTrackStatus = (track: AudioTrack, index: number) => {
    const isCurrentTrack = index === currentTrackIndex;
    const isCompleted = completedTracks.includes(track.id);
    const isLocked = lockedTracks.includes(track.id);
    const isHovered = hoveredIndex === index;

    return {
      isCurrentTrack,
      isCompleted,
      isLocked,
      isHovered,
      isPlaying: isCurrentTrack && isPlaying,
    };
  };

  // Get repeat icon
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case "one":
        return <Repeat1 className="w-[16px] h-[16px]" />;
      case "all":
        return <Repeat className="w-[16px] h-[16px]" />;
      default:
        return <Repeat className="w-[16px] h-[16px] opacity-50" />;
    }
  };

  if (tracks.length === 0) {
    return (
      <div className={cn("p-[21px] text-center text-text-muted", className)}>
        <p className="text-[13px]">No tracks available</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Playlist header with controls */}
      <div className="flex items-center justify-between px-[13px] py-[8px] border-b border-white/[0.08]">
        <span className="text-[13px] font-medium text-text-muted">
          {tracks.length} {tracks.length === 1 ? "Track" : "Tracks"}
        </span>
        
        <div className="flex items-center gap-[8px]">
          {/* Shuffle toggle */}
          <button
            onClick={onToggleShuffle}
            className={cn(
              "p-[8px] rounded-[8px] transition-all duration-8",
              isShuffled
                ? "bg-transform/20 text-transform"
                : "text-text-muted hover:text-text hover:bg-white/[0.05]"
            )}
            title={isShuffled ? "Shuffle on" : "Shuffle off"}
          >
            <Shuffle className="w-[16px] h-[16px]" />
          </button>

          {/* Repeat mode */}
          <button
            onClick={onCycleRepeatMode}
            className={cn(
              "p-[8px] rounded-[8px] transition-all duration-8",
              repeatMode !== "none"
                ? "bg-witness/20 text-witness"
                : "text-text-muted hover:text-text hover:bg-white/[0.05]"
            )}
            title={`Repeat: ${repeatMode}`}
          >
            {getRepeatIcon()}
          </button>

          {/* Autoplay toggle */}
          <button
            onClick={onToggleAutoplay}
            className={cn(
              "px-[13px] py-[8px] rounded-[8px] text-[13px] font-medium transition-all duration-8",
              autoplayNext
                ? "bg-world/20 text-world"
                : "text-text-muted hover:text-text hover:bg-white/[0.05]"
            )}
          >
            Autoplay
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto max-h-[400px] scrollbar-thin">
        {tracks.map((track, index) => {
          const status = getTrackStatus(track, index);
          const canPlay = !status.isLocked;

          return (
            <div
              key={track.id}
              onClick={() => canPlay && onSelectTrack(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "group flex items-center gap-[13px] px-[13px] py-[13px]",
                "transition-all duration-8 cursor-pointer",
                "border-b border-white/[0.04] last:border-b-0",
                status.isCurrentTrack && "bg-white/[0.05]",
                !status.isCurrentTrack && "hover:bg-white/[0.03]",
                !canPlay && "opacity-44 cursor-not-allowed"
              )}
            >
              {/* Track number / status indicator */}
              <div
                className={cn(
                  "flex items-center justify-center w-[34px] h-[34px] rounded-full",
                  "text-[13px] font-medium transition-all duration-8",
                  status.isCurrentTrack
                    ? "bg-octave text-white"
                    : status.isCompleted
                    ? "bg-world/20 text-world"
                    : status.isLocked
                    ? "bg-void-700 text-void-400"
                    : "bg-void-700 text-text-muted group-hover:text-text"
                )}
              >
                {status.isLocked ? (
                  <Lock className="w-[13px] h-[13px]" />
                ) : status.isCurrentTrack && isPlaying ? (
                  <div className="flex items-end gap-[2px] h-[13px]">
                    <span className="w-[2px] h-full bg-white animate-pulse-8" />
                    <span className="w-[2px] h-[60%] bg-white animate-pulse-8 [animation-delay:100ms]" />
                    <span className="w-[2px] h-[80%] bg-white animate-pulse-8 [animation-delay:200ms]" />
                  </div>
                ) : status.isCompleted ? (
                  <Check className="w-[16px] h-[16px]" />
                ) : status.isHovered ? (
                  <Play className="w-[13px] h-[13px] ml-[2px]" fill="currentColor" />
                ) : showChapterNumbers && track.chapterNumber ? (
                  track.chapterNumber
                ) : (
                  index + 1
                )}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-[13px] font-medium truncate transition-colors duration-8",
                    status.isCurrentTrack
                      ? "text-octave"
                      : status.isLocked
                      ? "text-void-500"
                      : "text-text"
                  )}
                >
                  {track.title}
                </p>
                {track.chapterNumber && showChapterNumbers && (
                  <p className="text-[11px] text-text-muted">
                    Chapter {track.chapterNumber}
                  </p>
                )}
              </div>

              {/* Duration / playing indicator */}
              <div className="flex items-center gap-[8px]">
                {status.isCurrentTrack && isPlaying ? (
                  <Volume2 className="w-[13px] h-[13px] text-octave animate-pulse-8" />
                ) : (
                  <span className="text-[13px] text-text-muted tabular-nums">
                    {formatDuration(track.duration)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current track indicator at bottom */}
      {tracks[currentTrackIndex] && (
        <div className="px-[13px] py-[8px] border-t border-white/[0.08] bg-white/[0.02]">
          <p className="text-[11px] text-text-muted">
            Now Playing: <span className="text-text">{tracks[currentTrackIndex].title}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Playlist;
