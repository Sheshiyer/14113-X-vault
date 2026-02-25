export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2;
export type RepeatMode = "none" | "one" | "all";

export interface AudioTrack {
  id: string;
  title: string;
  src: string;
  duration?: number;
  chapterNumber?: number;
}
