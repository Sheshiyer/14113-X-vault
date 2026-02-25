/**
 * Audio Components for Somatic Canticles
 * 
 * A comprehensive audio player system following the power-number design system:
 * - 8-beat animations for play/pause states
 * - 13s transitions for UI changes
 * - 19s/21s cycles for visualizations
 * 
 * All components support keyboard navigation, touch controls, and accessibility.
 */

// Main Player
export {
  AudioPlayer,
  type AudioPlayerProps,
} from "./player";

// Waveform Visualization
export {
  Waveform,
  type WaveformProps,
  type WaveformColorMode,
} from "./waveform";

// Real-time Visualizer
export {
  Visualizer,
  type VisualizerProps,
  type VisualizerMode,
  type ColorScheme,
} from "./visualizer";

// Playlist
export {
  Playlist,
  type PlaylistProps,
} from "./playlist";

// Mini Player (Dashboard)
export {
  MiniPlayer,
  type MiniPlayerProps,
} from "./mini-player";

// Audio Provider (for global state)
export {
  AudioProvider,
  useAudioContext,
  type AudioProviderProps,
  type AudioContextValue,
  type AudioState,
} from "./audio-provider";

// Audio Hook (re-exported for convenience)
export {
  useAudio,
  type UseAudioOptions,
  type UseAudioReturn,
  type AudioTrack,
  type PlaybackSpeed,
  type RepeatMode,
} from "@/hooks/useAudio";
