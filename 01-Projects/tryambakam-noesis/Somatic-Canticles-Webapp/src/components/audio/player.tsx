"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Download,
  Repeat,
  Repeat1,
  Shuffle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAudio, AudioTrack, PlaybackSpeed, RepeatMode } from "@/hooks/useAudio";

export interface AudioPlayerProps {
  src?: string;
  title?: string;
  tracks?: AudioTrack[];
  initialTrackIndex?: number;
  autoPlay?: boolean;
  className?: string;
  showPlaylist?: boolean;
  onTrackChange?: (track: AudioTrack | null) => void;
}

const speedOptions: PlaybackSpeed[] = [0.5, 1, 1.5, 2];

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  tracks = [],
  initialTrackIndex = 0,
  autoPlay = false,
  className,
  showPlaylist = true,
  onTrackChange,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const {
    audioRef,
    analyserRef,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,
    currentTrack,
    currentTrackIndex,
    isShuffled,
    repeatMode,
    autoplayNext,
    averageFrequency,
    toggle,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    nextTrack,
    previousTrack,
    selectTrack,
    toggleShuffle,
    cycleRepeatMode,
    setAutoplayNext,
    formatTime,
    downloadTrack,
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
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekRelative(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          seekRelative(5);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(volume - 0.1);
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, seekRelative, setVolume, volume, toggleMute]);

  // Calculate background color based on frequency
  const getBackgroundGradient = React.useMemo(() => {
    if (!isPlaying || averageFrequency < 10) {
      return "from-surface/80 to-surface";
    }

    // Map frequency to color intensity
    const intensity = Math.min(averageFrequency / 128, 1);
    
    // Different color zones based on frequency ranges
    if (averageFrequency < 40) {
      // Bass frequencies - Octave (red/coral)
      return `from-octave/${Math.round(intensity * 30)} to-surface`;
    } else if (averageFrequency < 100) {
      // Mid frequencies - Transform (purple)
      return `from-transform/${Math.round(intensity * 30)} to-surface`;
    } else {
      // High frequencies - Solar (gold)
      return `from-solar/${Math.round(intensity * 30)} to-surface`;
    }
  }, [isPlaying, averageFrequency]);

  // Progress bar interaction handlers
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

  // Touch handlers for mobile
  const handleProgressTouch = (e: React.TouchEvent<HTMLDivElement>) => {
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
  const hasTracks = tracks.length > 1;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[13px] transition-all duration-[1300ms] ease-sacred",
        "bg-gradient-to-br",
        getBackgroundGradient,
        "border border-white/[0.08] backdrop-blur-[13px]",
        className
      )}
    >
      {/* Ambient glow effect when playing */}
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

      {/* Main player content */}
      <div className="relative p-[21px] space-y-[13px]">
        {/* Header: Title and expand/collapse */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-[13px]">
            <h3 className="text-[19px] font-medium text-text truncate leading-[31px]">
              {displayTitle}
            </h3>
            {currentTrack?.chapterNumber && (
              <p className="text-[13px] text-text-muted leading-[21px]">
                Chapter {currentTrack.chapterNumber}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="w-[21px] h-[21px]" />
            ) : (
              <ChevronUp className="w-[21px] h-[21px]" />
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
          onTouchStart={handleProgressTouch}
          onTouchMove={handleProgressTouch}
          className="relative h-[8px] bg-void-700/50 rounded-full cursor-pointer group"
          role="slider"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Seek"
        >
          {/* Progress fill */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-8",
              isPlaying ? "bg-gradient-to-r from-octave via-transform to-solar" : "bg-witness",
              isDragging && "transition-none"
            )}
            style={{ width: `${progressPercent}%` }}
          />
          
          {/* Scrub handle */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-[19px] h-[19px] rounded-full bg-white shadow-lg",
              "transition-all duration-8 scale-0 group-hover:scale-100",
              isDragging && "scale-100"
            )}
            style={{ left: `calc(${progressPercent}% - 9.5px)` }}
          />
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between text-[13px] text-text-muted font-medium">
          <span className="tabular-nums">{formatTime(currentTime)}</span>
          <span className="tabular-nums">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-[13px]">
          {/* Playback controls */}
          <div className="flex items-center gap-[8px]">
            {hasTracks && (
              <button
                onClick={previousTrack}
                className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
                aria-label="Previous track"
              >
                <SkipBack className="w-[21px] h-[21px]" />
              </button>
            )}

            {/* Play/Pause button with animated icon */}
            <button
              onClick={toggle}
              disabled={isLoading}
              className={cn(
                "relative w-[55px] h-[55px] rounded-full flex items-center justify-center",
                "bg-octave hover:bg-octave-dark active:bg-octave-dark transition-all duration-8",
                "shadow-[0_2px_13px_rgba(255,107,107,0.3)]",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <div className="w-[21px] h-[21px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <div className="relative w-[21px] h-[21px]">
                  <div className="absolute left-0 top-0 w-[7px] h-full bg-white rounded-[2px] animate-pulse-8" />
                  <div className="absolute right-0 top-0 w-[7px] h-full bg-white rounded-[2px] animate-pulse-8 [animation-delay:100ms]" />
                </div>
              ) : (
                <Play className="w-[21px] h-[21px] text-white ml-[3px]" fill="white" />
              )}
            </button>

            {hasTracks && (
              <button
                onClick={nextTrack}
                className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
                aria-label="Next track"
              >
                <SkipForward className="w-[21px] h-[21px]" />
              </button>
            )}
          </div>

          {/* Secondary controls */}
          <div className="flex items-center gap-[8px]">
            {/* Volume control */}
            <div className="flex items-center gap-[8px] group">
              <button
                onClick={toggleMute}
                className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-[19px] h-[19px]" />
                ) : (
                  <Volume2 className="w-[19px] h-[19px]" />
                )}
              </button>
              <div className="w-0 overflow-hidden group-hover:w-[89px] transition-all duration-[1300ms] ease-sacred">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-[89px] h-[4px] accent-octave cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Playback speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={cn(
                  "px-[13px] py-[8px] rounded-[8px] text-[13px] font-medium transition-all duration-8",
                  playbackSpeed !== 1
                    ? "bg-octave/20 text-octave"
                    : "text-text-muted hover:text-text hover:bg-white/[0.05]"
                )}
              >
                {playbackSpeed}x
              </button>
              
              {showSpeedMenu && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[8px] py-[8px] bg-surface-elevated rounded-[8px] border border-white/[0.08] shadow-lg z-13">
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        setShowSpeedMenu(false);
                      }}
                      className={cn(
                        "w-full px-[19px] py-[8px] text-[13px] text-left transition-colors duration-8",
                        playbackSpeed === speed
                          ? "bg-octave/20 text-octave"
                          : "text-text hover:bg-white/[0.05]"
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Download button */}
            <button
              onClick={downloadTrack}
              className="p-[8px] rounded-[8px] text-text-muted hover:text-text hover:bg-white/[0.05] transition-all duration-8"
              aria-label="Download"
            >
              <Download className="w-[19px] h-[19px]" />
            </button>
          </div>
        </div>

        {/* Expanded controls */}
        {isExpanded && (
          <div className="pt-[13px] border-t border-white/[0.08] animate-fade-in-up">
            <div className="flex items-center justify-between">
              {/* Repeat mode */}
              <button
                onClick={cycleRepeatMode}
                className={cn(
                  "flex items-center gap-[8px] px-[13px] py-[8px] rounded-[8px] text-[13px] transition-all duration-8",
                  repeatMode !== "none"
                    ? "bg-witness/20 text-witness"
                    : "text-text-muted hover:text-text hover:bg-white/[0.05]"
                )}
                aria-label={`Repeat: ${repeatMode}`}
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="w-[16px] h-[16px]" />
                ) : (
                  <Repeat className="w-[16px] h-[16px]" />
                )}
                <span className="capitalize">{repeatMode}</span>
              </button>

              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={cn(
                  "flex items-center gap-[8px] px-[13px] py-[8px] rounded-[8px] text-[13px] transition-all duration-8",
                  isShuffled
                    ? "bg-transform/20 text-transform"
                    : "text-text-muted hover:text-text hover:bg-white/[0.05]"
                )}
                aria-label={`Shuffle: ${isShuffled ? "on" : "off"}`}
              >
                <Shuffle className="w-[16px] h-[16px]" />
                <span>{isShuffled ? "On" : "Off"}</span>
              </button>

              {/* Autoplay next */}
              <button
                onClick={() => setAutoplayNext(!autoplayNext)}
                className={cn(
                  "flex items-center gap-[8px] px-[13px] py-[8px] rounded-[8px] text-[13px] transition-all duration-8",
                  autoplayNext
                    ? "bg-world/20 text-world"
                    : "text-text-muted hover:text-text hover:bg-white/[0.05]"
                )}
              >
                <span>Autoplay</span>
                <span className="capitalize">{autoplayNext ? "On" : "Off"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close speed menu */}
      {showSpeedMenu && (
        <div
          className="fixed inset-0 z-8"
          onClick={() => setShowSpeedMenu(false)}
        />
      )}
    </div>
  );
};

export default AudioPlayer;
