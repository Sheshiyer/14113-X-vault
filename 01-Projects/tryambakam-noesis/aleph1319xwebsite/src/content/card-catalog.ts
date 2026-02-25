import { NOESIS_SECTIONS, type NoesisSection } from "./noesis-sections";

export interface CardEntry {
  readonly slug: string;
  readonly mediaIndex: number;
  readonly layoutKey: string;
  readonly title: string;
  readonly subtitle: string;
  readonly section: string;
  readonly sectionCode: string;
  readonly description: string;
  readonly reportContent: string;
  readonly specs: readonly { label: string; value: string }[];
  readonly features: readonly { title: string; description: string }[];
  readonly accentColor: string;
  readonly imageUrl: string;
  readonly dimensions: { width: number; height: number };
  readonly hookLine: string;
  readonly cartographerNote: string;
  readonly seekerQuestion: string;
  readonly keyInsight: string;
  readonly engineTags: readonly string[];
  readonly practicePrompt: string;
  readonly archetypeLabel: "split" | "image" | "hero" | "terminal" | "timeline" | "dashboard";
  readonly importance: number;
}

// Deterministic non-linear weights to create a cinematic, varied landscape
const IMPORTANCE_WEIGHTS: Record<number, number> = {
  1: 1.8, 2: 1.3, 3: 1.5, 4: 2.0, 5: 1.0, 6: 1.6, 7: 0.8, 8: 1.4,
  9: 1.7, 10: 1.1, 11: 1.2, 12: 1.0, 13: 1.5, 14: 0.9, 15: 1.9, 16: 1.6,
  17: 0.7, 18: 0.8, 19: 0.6, 20: 0.8, 21: 1.0
};

function buildCardEntry(section: NoesisSection, mediaIndex: number): CardEntry {
  const { width, height } = section.imageDimensions;
  const totalSections = NOESIS_SECTIONS.length;
  const importance = IMPORTANCE_WEIGHTS[section.id] ?? 1.5;

  return {
    slug: section.slug,
    mediaIndex,
    layoutKey: section.layoutKey,
    title: section.title,
    subtitle: section.subtitle,
    section: `${section.sectionNumber}: ${section.title}`,
    sectionCode: section.sectionNumber,
    description: section.description,
    reportContent: section.reportContent,
    specs: [
      { label: "Section", value: `${section.id} of ${totalSections}` },
    ],
    features: [
      {
        title: section.subtitle,
        description: section.description,
      },
      {
        title: "Part of the NOESIS Report",
        description: `Section ${section.id} of ${totalSections} in the comprehensive NOESIS architecture document.`,
      },
    ],
    accentColor: section.accentColor,
    imageUrl: section.imageUrl,
    dimensions: { width, height },
    hookLine: section.hookLine,
    cartographerNote: section.cartographerNote,
    seekerQuestion: section.seekerQuestion,
    keyInsight: section.keyInsight,
    engineTags: section.engineTags,
    practicePrompt: section.practicePrompt,
    archetypeLabel: section.archetypeLabel,
    importance,
  };
}

const CARD_CATALOG: readonly CardEntry[] = NOESIS_SECTIONS.map(
  (section, index) => buildCardEntry(section, index)
);

// ── Lookup helpers ──

const slugMap = new Map<string, CardEntry>();
const indexMap = new Map<number, string>();

for (const entry of CARD_CATALOG) {
  slugMap.set(entry.slug, entry);
  indexMap.set(entry.mediaIndex, entry.slug);
}

export function getCardBySlug(slug: string): CardEntry | null {
  return slugMap.get(slug) ?? null;
}

export function getSlugByMediaIndex(index: number): string | null {
  return indexMap.get(index) ?? null;
}

export { CARD_CATALOG };
