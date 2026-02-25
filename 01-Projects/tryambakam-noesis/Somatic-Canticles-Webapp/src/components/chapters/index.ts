/**
 * Chapter Components
 * 
 * A comprehensive set of components for managing and displaying chapters
 * in the Somatic Canticles webapp. All components follow the power-number
 * design system and biorhythm cycle associations.
 * 
 * @example
 * import { 
 *   ChapterCard, 
 *   ChapterGrid, 
 *   UnlockAnimation,
 *   UnlockModal,
 *   ChapterProgressTracker,
 *   CycleBadge,
 *   ChapterNavigation,
 *   MandalaMap 
 * } from '@/components/chapters';
 */

// Chapter Card - Individual chapter display
export {
  ChapterCard,
  type ChapterCardProps,
  type ChapterStatus,
} from './chapter-card';

// Chapter Grid - Grid layout with filtering and sorting
export {
  ChapterGrid,
  type ChapterGridProps,
  type FilterOption,
  type SortOption,
} from './chapter-grid';

// Unlock Animation - 13-second ceremonial unlock sequence
export {
  UnlockAnimation,
  type UnlockAnimationProps,
} from './unlock-animation';

// Unlock Modal - Modal for chapter unlock preview
export {
  UnlockModal,
  type UnlockModalProps,
} from './unlock-modal';

// Progress Tracker - Chapter progress visualization
export {
  ChapterProgressTracker,
  type ChapterProgressTrackerProps,
} from './progress-tracker';

// Cycle Badge - Biorhythm cycle indicator
export {
  CycleBadge,
  PhysicalBadge,
  EmotionalBadge,
  IntellectualBadge,
  SpiritualBadge,
  CycleLegend,
  type CycleBadgeProps,
  type BiorhythmCycle,
} from './cycle-badge';

// Chapter Navigation - Prev/Next navigation
export {
  ChapterNavigation,
  CompactChapterNavigation,
  ChapterBreadcrumb,
  type ChapterNavigationProps,
  type CompactChapterNavigationProps,
  type ChapterBreadcrumbProps,
} from './chapter-navigation';

// Mandala Map - Circular chapter visualization
export {
  MandalaMap,
  type MandalaMapProps,
  type MandalaChapter,
  type BiorhythmCenterState,
} from './mandala-map';
