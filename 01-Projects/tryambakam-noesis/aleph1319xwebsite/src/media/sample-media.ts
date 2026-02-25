import type { MediaItem } from "../infinite-canvas/types";
import { NOESIS_SECTIONS } from "../content/noesis-sections";

/**
 * 21 brand visual assets (16 core + 5 easter eggs).
 * Served from public/brand/ via Vite static serving.
 */

/** Index into BRAND_MEDIA that hides the terminal Easter egg (section 4 — stained glass). */
export const TERMINAL_EASTER_EGG_INDEX = 3;

const IMPORTANCE_WEIGHTS: Record<number, number> = {
  1: 1.8, 2: 1.3, 3: 1.5, 4: 2.0, 5: 1.0, 6: 1.6, 7: 0.8, 8: 1.4,
  9: 1.7, 10: 1.1, 11: 1.2, 12: 1.0, 13: 1.5, 14: 0.9, 15: 1.9, 16: 1.6,
  17: 0.7, 18: 0.8, 19: 0.6, 20: 0.8, 21: 1.0
};

const BRAND_MEDIA: MediaItem[] = NOESIS_SECTIONS.map((section) => {
  const optimizedUrl = section.imageUrl
    .replace('/brand/', '/brand-optimized/')
    .replace(/\.(png|jpe?g)$/i, '.webp');

  return {
    url: optimizedUrl,
    width: section.imageDimensions.width,
    height: section.imageDimensions.height,
    importance: IMPORTANCE_WEIGHTS[section.id] ?? 1.5,
  };
});

export default BRAND_MEDIA;
