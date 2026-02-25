"use client";

import * as React from "react";
import type { AudioTrack, PlaybackSpeed, RepeatMode } from "@/types/audio";

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: PlaybackSpeed;
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  currentTrackIndex: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  autoplayNext: boolean;
  averageFrequency: number;
}

export interface AudioContextValue extends AudioState {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  selectTrack: (index: number) => void;
  setTracks: (tracks: AudioTrack[]) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setAutoplayNext: (value: boolean) => void;
  formatTime: (time: number) => string;
  downloadCurrentTrack: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
}

const AudioPlayerContext = React.createContext<AudioContextValue | null>(null);

export interface AudioProviderProps {
  children: React.ReactNode;
  initialTracks?: AudioTrack[];
  initialTrackIndex?: number;
}

const isBrowser = typeof window !== "undefined";

// Create refs outside component for SSR safety
const createAudioRefs = () => ({
  audioRef: { current: null as HTMLAudioElement | null },
  // Use any to avoid SSR/Type issues with global AudioContext
  audioContextRef: { current: null as any | null },
  analyserRef: { current: null as AnalyserNode | null },
  sourceRef: { current: null as MediaElementAudioSourceNode | null },
});

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  initialTracks = [],
  initialTrackIndex = 0,
}) => {
  // Use refs that persist across renders
  const refs = React.useRef(createAudioRefs()).current;
  const animationFrameRef = React.useRef<number | null>(null);

  // State
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolumeState] = React.useState(0.8);
  const [isMuted, setIsMuted] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeedState] = React.useState<PlaybackSpeed>(1);
  const [tracks, setTracksState] = React.useState<AudioTrack[]>(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(initialTrackIndex);
  const [isShuffled, setIsShuffled] = React.useState(false);
  const [repeatMode, setRepeatMode] = React.useState<RepeatMode>("none");
  const [autoplayNext, setAutoplayNext] = React.useState(true);
  const [averageFrequency, setAverageFrequency] = React.useState(0);

  const currentTrack = tracks[currentTrackIndex] || null;

  // Actions - defined first so they can be used in effects
  const play = React.useCallback(() => {
    if (refs.audioRef.current && currentTrack) {
      refs.audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [currentTrack, refs.audioRef]);

  const pause = React.useCallback(() => {
    if (refs.audioRef.current) {
      refs.audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [refs.audioRef]);

  const nextTrack = React.useCallback(() => {
    if (tracks.length === 0) return;
    
    if (isShuffled) {
      const nextIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    }
  }, [tracks.length, isShuffled]);

  // Initialize audio element
  React.useEffect(() => {
    if (!isBrowser) return;

    const audio = new Audio();
    audio.preload = "metadata";
    refs.audioRef.current = audio;

    // Initialize Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        refs.audioContextRef.current = new AudioContextClass();
        refs.analyserRef.current = refs.audioContextRef.current.createAnalyser();
        refs.analyserRef.current.fftSize = 256;
        refs.analyserRef.current.smoothingTimeConstant = 0.8;
      }
    } catch (e) {
      console.warn("Web Audio API not supported");
    }

    // Event handlers
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      if (autoplayNext && repeatMode !== "one") {
        // Use setTimeout to avoid circular dependency
        setTimeout(() => {
          if (isShuffled) {
            setCurrentTrackIndex(Math.floor(Math.random() * tracks.length));
          } else {
            setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
          }
        }, 0);
      } else if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audio.volume = volume;
    audio.muted = isMuted;
    audio.playbackRate = playbackSpeed;

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audio.pause();
      audio.src = "";
      refs.audioRef.current = null;
    };
  }, [autoplayNext, repeatMode, isShuffled, tracks.length, volume, isMuted, playbackSpeed]);

  // Connect audio source when track changes
  React.useEffect(() => {
    if (!isBrowser || !refs.audioRef.current || !currentTrack) return;

    const audio = refs.audioRef.current;
    
    // Connect to Web Audio API if not already connected
    if (refs.audioContextRef.current && refs.analyserRef.current && !refs.sourceRef.current) {
      try {
        refs.sourceRef.current = refs.audioContextRef.current.createMediaElementSource(audio);
        refs.sourceRef.current.connect(refs.analyserRef.current);
        refs.analyserRef.current.connect(refs.audioContextRef.current.destination);
      } catch (e) {
        // Already connected or other error
      }
    }

    audio.src = currentTrack.src;
    audio.load();
    
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack?.id, isPlaying]);

  // Update audio settings
  React.useEffect(() => {
    if (refs.audioRef.current) refs.audioRef.current.volume = volume;
  }, [volume]);

  React.useEffect(() => {
    if (refs.audioRef.current) refs.audioRef.current.muted = isMuted;
  }, [isMuted]);

  React.useEffect(() => {
    if (refs.audioRef.current) refs.audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Frequency analysis
  React.useEffect(() => {
    if (!isBrowser || !refs.analyserRef.current || !isPlaying) {
      setAverageFrequency(0);
      return;
    }

    const analyser = refs.analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateFrequency = () => {
      if (!isPlaying) {
        setAverageFrequency(0);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      analyser.getByteFrequencyData(dataArray as any);
      
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength / 255;
      setAverageFrequency(average);

      animationFrameRef.current = requestAnimationFrame(updateFrequency);
    };

    updateFrequency();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, refs.analyserRef]);

  // More actions
  const toggle = React.useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = React.useCallback((time: number) => {
    if (refs.audioRef.current) {
      refs.audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
      setCurrentTime(refs.audioRef.current.currentTime);
    }
  }, [duration, refs.audioRef]);

  const seekRelative = React.useCallback((delta: number) => {
    seek(currentTime + delta);
  }, [currentTime, seek]);

  const setVolume = React.useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const toggleMute = React.useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const setPlaybackSpeed = React.useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeedState(speed);
  }, []);

  const previousTrack = React.useCallback(() => {
    if (tracks.length === 0) return;
    
    if (currentTime > 3) {
      seek(0);
    } else {
      setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
    }
  }, [currentTime, seek, tracks.length]);

  const selectTrack = React.useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
    }
  }, [tracks.length]);

  const setTracks = React.useCallback((newTracks: AudioTrack[]) => {
    setTracksState(newTracks);
    if (newTracks.length > 0 && currentTrackIndex >= newTracks.length) {
      setCurrentTrackIndex(0);
    }
  }, [currentTrackIndex]);

  const toggleShuffle = React.useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const cycleRepeatMode = React.useCallback(() => {
    setRepeatMode(prev => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  }, []);

  const setAutoplayNextState = React.useCallback((value: boolean) => {
    setAutoplayNext(value);
  }, []);

  const formatTime = React.useCallback((time: number) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const downloadCurrentTrack = React.useCallback(() => {
    if (currentTrack?.src) {
      const link = document.createElement("a");
      link.href = currentTrack.src;
      link.download = `${currentTrack.title || 'track'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [currentTrack]);

  const value: AudioContextValue = {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,
    tracks,
    currentTrack,
    currentTrackIndex,
    isShuffled,
    repeatMode,
    autoplayNext,
    averageFrequency,
    play,
    pause,
    toggle,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    nextTrack,
    previousTrack,
    selectTrack,
    setTracks,
    toggleShuffle,
    cycleRepeatMode,
    setAutoplayNext: setAutoplayNextState,
    formatTime,
    downloadCurrentTrack,
    audioRef: refs.audioRef as React.RefObject<HTMLAudioElement | null>,
    analyserRef: refs.analyserRef as React.RefObject<AnalyserNode | null>,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = React.useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};

export default AudioProvider;
