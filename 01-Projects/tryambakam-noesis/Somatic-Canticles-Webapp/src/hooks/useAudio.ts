"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { AudioTrack, PlaybackSpeed, RepeatMode } from "@/types/audio";

export interface UseAudioOptions {
  src?: string;
  autoPlay?: boolean;
  tracks?: AudioTrack[];
  initialTrackIndex?: number;
}

export type { AudioTrack, PlaybackSpeed, RepeatMode };

export interface UseAudioReturn {
  // Refs

  audioRef: React.RefObject<HTMLAudioElement | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  
  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: PlaybackSpeed;
  
  // Track state
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  currentTrackIndex: number;
  
  // Playlist state
  isShuffled: boolean;
  repeatMode: RepeatMode;
  autoplayNext: boolean;
  
  // Frequency data for visualizations
  frequencyData: Uint8Array | null;
  averageFrequency: number;
  
  // Actions
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  
  // Track navigation
  nextTrack: () => void;
  previousTrack: () => void;
  selectTrack: (index: number) => void;
  setTracks: (tracks: AudioTrack[]) => void;
  
  // Playlist controls
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setAutoplayNext: (value: boolean) => void;
  
  // Utilities
  formatTime: (time: number) => string;
  downloadTrack: () => void;
  downloadCurrentTrack: () => void;
}

export function useAudio({
  src,
  autoPlay = false,
  tracks = [],
  initialTrackIndex = 0,
}: UseAudioOptions = {}): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(1);

  // Track state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // Playlist state
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Frequency data for visualizations
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [averageFrequency, setAverageFrequency] = useState(0);

  // Initialize audio context and analyser
  const initAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      // Initialize frequency data array
      const bufferLength = analyser.frequencyBinCount;
      setFrequencyData(new Uint8Array(bufferLength));
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }, []);

  // Update frequency data
  const updateFrequencyData = useCallback(() => {
    if (!analyserRef.current || !frequencyData) return;

    analyserRef.current.getByteFrequencyData(frequencyData as any);
    
    // Calculate average frequency for background color effects
    const average = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
    setAverageFrequency(average);

    animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
  }, [frequencyData]);

  // Start/stop frequency updates
  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateFrequencyData]);

  // Get current track
  const currentTrack = useMemo(() => {
    if (tracks.length === 0) return null;
    if (isShuffled && shuffledIndices.length > 0) {
      return tracks[shuffledIndices[currentTrackIndex]];
    }
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex, isShuffled, shuffledIndices]);

  // Get current source
  const currentSrc = useMemo(() => {
    return currentTrack?.src || src;
  }, [currentTrack, src]);

  // Initialize shuffled indices
  useEffect(() => {
    if (tracks.length > 0) {
      const indices = Array.from({ length: tracks.length }, (_, i) => i);
      // Fisher-Yates shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    }
  }, [tracks]);

  // Play action
  const play = useCallback(() => {
    if (audioRef.current) {
      // Resume audio context if suspended
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      
      setIsLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch((error) => {
        console.warn("Play failed:", error);
        setIsLoading(false);
      });
    }
  }, []);

  // Pause action
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      const clampedTime = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  }, [duration]);

  // Seek relative to current position
  const seekRelative = useCallback((delta: number) => {
    seek(currentTime + delta);
  }, [currentTime, seek]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  // Set playback speed
  const setPlaybackSpeed = useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  // Navigate to next track
  const nextTrack = useCallback(() => {
    if (tracks.length <= 1) return;
    
    let nextIndex: number;
    if (isShuffled && shuffledIndices.length > 0) {
      const currentShuffledIndex = shuffledIndices.indexOf(currentTrackIndex);
      nextIndex = shuffledIndices[(currentShuffledIndex + 1) % tracks.length];
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    
    // Auto-play next track if enabled
    if (autoplayNext) {
      setTimeout(() => play(), 100);
    } else {
      setIsPlaying(false);
    }
  }, [tracks.length, isShuffled, shuffledIndices, currentTrackIndex, autoplayNext, play]);

  // Navigate to previous track
  const previousTrack = useCallback(() => {
    if (tracks.length <= 1) return;
    
    let prevIndex: number;
    if (isShuffled && shuffledIndices.length > 0) {
      const currentShuffledIndex = shuffledIndices.indexOf(currentTrackIndex);
      prevIndex = shuffledIndices[(currentShuffledIndex - 1 + tracks.length) % tracks.length];
    } else {
      prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    }
    
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    
    if (autoplayNext) {
      setTimeout(() => play(), 100);
    } else {
      setIsPlaying(false);
    }
  }, [tracks.length, isShuffled, shuffledIndices, currentTrackIndex, autoplayNext, play]);

  // Select specific track
  const selectTrack = useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setTimeout(() => play(), 100);
    }
  }, [tracks.length, play]);

  // Set tracks
  const setTracks = useCallback((newTracks: AudioTrack[]) => {
    // In a real implementation, this would update tracks
    // For now, just reset to first track if current is out of bounds
    if (currentTrackIndex >= newTracks.length) {
      setCurrentTrackIndex(0);
    }
  }, [currentTrackIndex]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
  }, []);

  // Cycle repeat modes
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      const modes: RepeatMode[] = ["none", "one", "all"];
      const nextIndex = (modes.indexOf(prev) + 1) % modes.length;
      return modes[nextIndex];
    });
  }, []);

  // Format time as mm:ss
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Download current track
  const downloadTrack = useCallback(() => {
    const downloadSrc = currentTrack?.src || src;
    if (!downloadSrc) return;

    const link = document.createElement("a");
    link.href = downloadSrc;
    link.download = currentTrack?.title || "audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentTrack, src]);

  // Alias for downloadTrack to match AudioContextValue interface
  const downloadCurrentTrack = downloadTrack;

  // Handle track ended
  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        play();
      }
    } else if (currentTrackIndex < tracks.length - 1 || repeatMode === "all") {
      // Play next track
      nextTrack();
    } else {
      // Stop playback
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [repeatMode, currentTrackIndex, tracks.length, nextTrack, play]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Initialize audio context on first interaction
    const handleFirstInteraction = () => {
      initAudioContext();
      document.removeEventListener("click", handleFirstInteraction);
    };
    document.addEventListener("click", handleFirstInteraction);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      document.removeEventListener("click", handleFirstInteraction);
    };
  }, [handleEnded, initAudioContext]);

  // Auto-play when src changes and autoPlay is enabled
  useEffect(() => {
    if (autoPlay && currentSrc) {
      play();
    }
  }, [currentSrc, autoPlay, play]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    audioRef,
    analyserRef,
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
    frequencyData,
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
    setAutoplayNext,
    formatTime,
    downloadTrack,
    downloadCurrentTrack,
  };
}
