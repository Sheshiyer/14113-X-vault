import { useMemo, useEffect, useRef, type CSSProperties, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import type { CardEntry } from "../../content/card-catalog";
import { CartographerNote, KeyInsight, PracticePrompt, SeekerQuestion } from "./shared";
import styles from "./unique-layout.module.css";

type BlockKey =
  | "report"
  | "insight"
  | "note"
  | "question"
  | "practice"
  | "features"
  | "specs"
  | "tags";

interface LayoutPreset {
  readonly columns: string;
  readonly imageFirst: boolean;
  readonly imageFit: "cover" | "contain";
  readonly titleMode: "display" | "balanced" | "compact";
  readonly panelTone: "void" | "glass" | "bronze";
  readonly blockOrder: readonly BlockKey[];
}

const BASE_BLOCK_ORDER: readonly BlockKey[] = [
  "insight",
  "report",
  "note",
  "question",
  "practice",
  "features",
  "specs",
  "tags",
];

function rotateBlocks(offset: number): readonly BlockKey[] {
  const length = BASE_BLOCK_ORDER.length;
  const n = ((offset % length) + length) % length;
  return [...BASE_BLOCK_ORDER.slice(n), ...BASE_BLOCK_ORDER.slice(0, n)];
}

const LAYOUT_PRESETS: Record<string, LayoutPreset> = {
  "layout-01": { columns: "1.15fr 0.85fr", imageFirst: false, imageFit: "cover", titleMode: "display", panelTone: "void", blockOrder: rotateBlocks(0) },
  "layout-02": { columns: "0.95fr 1.05fr", imageFirst: true, imageFit: "cover", titleMode: "balanced", panelTone: "glass", blockOrder: rotateBlocks(1) },
  "layout-03": { columns: "1.25fr 0.75fr", imageFirst: false, imageFit: "contain", titleMode: "compact", panelTone: "bronze", blockOrder: rotateBlocks(2) },
  "layout-04": { columns: "0.78fr 1.22fr", imageFirst: true, imageFit: "cover", titleMode: "display", panelTone: "void", blockOrder: rotateBlocks(3) },
  "layout-05": { columns: "1fr 1fr", imageFirst: false, imageFit: "contain", titleMode: "balanced", panelTone: "glass", blockOrder: rotateBlocks(4) },
  "layout-06": { columns: "1.35fr 0.65fr", imageFirst: false, imageFit: "contain", titleMode: "compact", panelTone: "bronze", blockOrder: rotateBlocks(5) },
  "layout-07": { columns: "0.82fr 1.18fr", imageFirst: true, imageFit: "cover", titleMode: "balanced", panelTone: "void", blockOrder: rotateBlocks(6) },
  "layout-08": { columns: "1.08fr 0.92fr", imageFirst: false, imageFit: "contain", titleMode: "display", panelTone: "glass", blockOrder: rotateBlocks(7) },
  "layout-09": { columns: "0.9fr 1.1fr", imageFirst: true, imageFit: "cover", titleMode: "compact", panelTone: "bronze", blockOrder: rotateBlocks(0) },
  "layout-10": { columns: "1.2fr 0.8fr", imageFirst: false, imageFit: "cover", titleMode: "display", panelTone: "void", blockOrder: rotateBlocks(1) },
  "layout-11": { columns: "1fr 1fr", imageFirst: true, imageFit: "contain", titleMode: "balanced", panelTone: "glass", blockOrder: rotateBlocks(2) },
  "layout-12": { columns: "1.3fr 0.7fr", imageFirst: false, imageFit: "contain", titleMode: "compact", panelTone: "bronze", blockOrder: rotateBlocks(3) },
  "layout-13": { columns: "0.85fr 1.15fr", imageFirst: true, imageFit: "cover", titleMode: "balanced", panelTone: "void", blockOrder: rotateBlocks(4) },
  "layout-14": { columns: "1.12fr 0.88fr", imageFirst: false, imageFit: "contain", titleMode: "display", panelTone: "glass", blockOrder: rotateBlocks(5) },
  "layout-15": { columns: "0.76fr 1.24fr", imageFirst: true, imageFit: "cover", titleMode: "compact", panelTone: "bronze", blockOrder: rotateBlocks(6) },
  "layout-16": { columns: "1.28fr 0.72fr", imageFirst: false, imageFit: "contain", titleMode: "display", panelTone: "void", blockOrder: rotateBlocks(7) },
  "layout-17": { columns: "1.04fr 0.96fr", imageFirst: false, imageFit: "contain", titleMode: "compact", panelTone: "glass", blockOrder: rotateBlocks(0) },
  "layout-18": { columns: "0.86fr 1.14fr", imageFirst: true, imageFit: "contain", titleMode: "balanced", panelTone: "bronze", blockOrder: rotateBlocks(1) },
  "layout-19": { columns: "1.18fr 0.82fr", imageFirst: false, imageFit: "cover", titleMode: "display", panelTone: "void", blockOrder: rotateBlocks(2) },
  "layout-20": { columns: "0.92fr 1.08fr", imageFirst: true, imageFit: "contain", titleMode: "compact", panelTone: "glass", blockOrder: rotateBlocks(3) },
  "layout-21": { columns: "1.22fr 0.78fr", imageFirst: false, imageFit: "cover", titleMode: "balanced", panelTone: "bronze", blockOrder: rotateBlocks(4) },
};

interface UniqueLayoutDetailProps {
  readonly card: CardEntry;
}

export default function UniqueLayoutDetail({ card }: UniqueLayoutDetailProps) {
  const navigate = useNavigate();
  const preset = LAYOUT_PRESETS[card.layoutKey] ?? LAYOUT_PRESETS["layout-01"];

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !textPanelRef.current) return;

    // Initial State
    gsap.set(containerRef.current, { opacity: 0 });
    gsap.set(imageRef.current, { scale: 1.05, filter: "brightness(1.5) blur(8px)" });
    gsap.set(textPanelRef.current.children, { opacity: 0, y: 20 });

    const tl = gsap.timeline();
    tl.to(containerRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" })
      .to(imageRef.current, { scale: 1, filter: "brightness(1) blur(0px)", duration: 1.4, ease: "power3.out" }, "-=0.2")
      .to(textPanelRef.current.children, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power2.out" }, "-=1.0");

    return () => { tl.kill(); };
  }, [card.slug]);

  const handleReturn = () => {
    if (!containerRef.current || !imageRef.current || !textPanelRef.current) {
      navigate("/");
      return;
    }

    const tl = gsap.timeline({ onComplete: () => navigate("/") });
    tl.to(textPanelRef.current.children, { opacity: 0, y: -10, duration: 0.4, stagger: 0.04, ease: "power2.in" })
      .to(imageRef.current, { opacity: 0, scale: 1.02, duration: 0.6, ease: "power2.in" }, "-=0.2")
      .to(containerRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, "-=0.4");
  };

  const reportParagraphs = useMemo(
    () => (card.reportContent ? card.reportContent.split("\n\n").filter(Boolean) : []),
    [card.reportContent]
  );

  const blocks: Record<BlockKey, JSX.Element | null> = {
    insight: card.keyInsight ? (
      <KeyInsight insight={card.keyInsight} accentColor={card.accentColor} />
    ) : null,
    report:
      reportParagraphs.length > 0 ? (
        <section className={styles.reportBlock}>
          {reportParagraphs.map((paragraph, index) => (
            <p key={`${card.slug}-report-${index}`} className={styles.reportParagraph}>
              {paragraph}
            </p>
          ))}
        </section>
      ) : null,
    note: card.cartographerNote ? (
      <CartographerNote note={card.cartographerNote} accentColor={card.accentColor} />
    ) : null,
    question: card.seekerQuestion ? <SeekerQuestion question={card.seekerQuestion} /> : null,
    practice: card.practicePrompt ? <PracticePrompt prompt={card.practicePrompt} /> : null,
    features:
      card.features.length > 0 ? (
        <section className={styles.featuresBlock}>
          {card.features.map((feature) => (
            <article key={`${card.slug}-${feature.title}`} className={styles.featureRow}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>
      ) : null,
    specs:
      card.specs.length > 0 ? (
        <section className={styles.specsBlock}>
          {card.specs.map((spec) => (
            <article key={`${card.slug}-${spec.label}`} className={styles.specItem}>
              <span>{spec.label}</span>
              <strong>{spec.value}</strong>
            </article>
          ))}
        </section>
      ) : null,
    tags:
      card.engineTags.length > 0 ? (
        <section className={styles.tagsBlock}>
          {card.engineTags.map((tag) => (
            <span key={`${card.slug}-${tag}`} className={styles.tagPill}>
              {tag}
            </span>
          ))}
        </section>
      ) : null,
  };

  const orderedBlocks = preset.blockOrder
    .map((blockKey) => blocks[blockKey])
    .filter((block): block is JSX.Element => block !== null);

  return (
    <div
      ref={containerRef}
      className={`${styles.page} ${styles[`tone_${preset.panelTone}`]}`}
      style={{ "--layout-accent": card.accentColor } as CSSProperties}
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.sectionCode}>{card.sectionCode}</span>
          <span className={styles.sectionTitle}>{card.subtitle}</span>
        </div>
        <button type="button" className={styles.backButton} onClick={handleReturn}>
          Return to Field
        </button>
      </header>

      <main className={styles.main} style={{ gridTemplateColumns: preset.columns }}>
        <section ref={textPanelRef} className={styles.textPanel} style={{ order: preset.imageFirst ? 2 : 1 }}>
          <p className={styles.hook}>{card.hookLine}</p>
          <h1 className={`${styles.title} ${styles[`title_${preset.titleMode}`]}`}>{card.title}</h1>
          <p className={styles.description}>{card.description}</p>
          <div className={styles.blockStack}>{orderedBlocks}</div>
        </section>

        <aside className={styles.imagePanel} style={{ order: preset.imageFirst ? 1 : 2 }}>
          <div className={styles.imageMetaTop}>
            <span>{card.section}</span>
          </div>
          <img
            ref={imageRef}
            src={card.imageUrl.replace('/brand/', '/brand-optimized/').replace(/\.(png|jpe?g)$/i, '.webp')}
            alt={`${card.title} — ${card.subtitle}`}
            className={styles.image}
            style={{ objectFit: preset.imageFit, willChange: "transform, filter, opacity" }}
            loading="eager"
            fetchPriority="high"
          />
          <div className={styles.imageMetaBottom}>
            <span>
              {card.dimensions.width} × {card.dimensions.height}
            </span>
          </div>
        </aside>
      </main>
    </div>
  );
}
