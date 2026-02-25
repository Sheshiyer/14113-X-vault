import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import type { CardEntry } from "../../../content/card-catalog";
import styles from "../card-detail.module.css";
import {
  CartographerNote,
  SeekerQuestion,
  KeyInsight,
  PracticePrompt,
  HudHeader,
  SpecsRow,
  BackButton,
} from "../shared";
import { PulsingStatusCluster } from "../effects";

interface ArchetypeProps {
  card: CardEntry;
}

/* Timeline node component */
function TimelineNode({
  number,
  accentColor,
  children,
}: {
  number: number;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-gsap="timeline-node"
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr",
        gap: 0,
        position: "relative",
        minHeight: 80,
      }}
    >
      {/* Vertical line + circle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Vertical line above */}
        <div
          style={{
            width: 1,
            flexGrow: 1,
            background: "rgba(255,255,255,0.15)",
            minHeight: 8,
          }}
        />

        {/* Numbered circle */}
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: `1px solid ${accentColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--noesis-font-mono, monospace)",
            fontSize: "10px",
            color: accentColor,
            flexShrink: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        >
          {number}
        </div>

        {/* Vertical line below */}
        <div
          style={{
            width: 1,
            flexGrow: 1,
            background: "rgba(255,255,255,0.15)",
            minHeight: 8,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "16px 0 16px 20px" }}>{children}</div>
    </div>
  );
}

export default function TimelineFlow({ card }: ArchetypeProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);

  const reportParagraphs = card.reportContent
    ? card.reportContent.split("\n\n").filter(Boolean)
    : [];

  useLayoutEffect(() => {
    if (!card || !pageRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Page fades in
      tl.fromTo(
        "[data-gsap='card-page']",
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );

      // 2. Glitch flash
      tl.fromTo(
        "[data-gsap='card-glitch']",
        { opacity: 0 },
        { opacity: 0.18, duration: 0.08, repeat: 1, yoyo: true },
        0.04
      );

      // 3. Top section
      tl.fromTo(
        "[data-gsap='timeline-top']",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.1
      );

      // 4. Timeline nodes stagger from bottom
      tl.fromTo(
        "[data-gsap='timeline-node']",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.06 },
        0.25
      );
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, [card, reducedMotion]);

  const handleBack = () => {
    if (reducedMotion) {
      navigate("/");
      return;
    }

    gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => { navigate("/"); },
    }).to(pageRef.current, { opacity: 0, duration: 0.2 });
  };

  return (
    <div ref={pageRef} className={styles.page} data-gsap="card-page">
      <div
        ref={glitchRef}
        className={styles.glitchLayer}
        data-gsap="card-glitch"
      />

      {/* Top section: HUD + image */}
      <div data-gsap="timeline-top">
        <HudHeader
          sectionCode={card.sectionCode}
          version={card.version}
          accentColor={card.accentColor}
          onBack={handleBack}
        />

        {/* Half-height full-width image */}
        <div
          style={{
            position: "relative",
            height: "50vh",
            overflow: "hidden",
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <img
            src={card.imageUrl}
            alt={`${card.title} -- ${card.subtitle}`}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div className={styles.scanLines} />

          {/* PulsingStatusCluster overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 24,
              zIndex: 5,
            }}
          >
            <PulsingStatusCluster
              items={card.engineTags.slice(0, 4).map((tag) => ({
                label: tag,
                color: card.accentColor,
                active: true,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Vertical timeline */}
      <div
        style={{
          padding: "40px 24px 40px 32px",
          maxWidth: 800,
        }}
      >
        {/* Node 1: hookLine + title */}
        <TimelineNode number={1} accentColor={card.accentColor}>
          {card.hookLine && (
            <p
              style={{
                fontFamily: "var(--noesis-font-mono, monospace)",
                fontSize: "12px",
                color: "#888",
                lineHeight: 1.6,
                margin: "0 0 12px",
              }}
            >
              {card.hookLine}
            </p>
          )}
          <h1 className={styles.heroTitle} style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            {card.title}
          </h1>
        </TimelineNode>

        {/* Node 2: description + KeyInsight */}
        <TimelineNode number={2} accentColor={card.accentColor}>
          <p className={styles.heroDescription} style={{ marginBottom: 24 }}>
            {card.description}
          </p>
          {card.keyInsight && (
            <KeyInsight
              insight={card.keyInsight}
              accentColor={card.accentColor}
            />
          )}
        </TimelineNode>

        {/* Node 3: reportContent paragraphs as sub-nodes */}
        {reportParagraphs.length > 0 && (
          <TimelineNode number={3} accentColor={card.accentColor}>
            {reportParagraphs.map((paragraph, index) => (
              <p key={index} className={styles.reportParagraph}>
                {paragraph}
              </p>
            ))}
          </TimelineNode>
        )}

        {/* Node 4: CartographerNote */}
        {card.cartographerNote && (
          <TimelineNode number={4} accentColor={card.accentColor}>
            <CartographerNote
              note={card.cartographerNote}
              accentColor={card.accentColor}
            />
          </TimelineNode>
        )}

        {/* Node 5: SeekerQuestion */}
        {card.seekerQuestion && (
          <TimelineNode number={5} accentColor={card.accentColor}>
            <SeekerQuestion question={card.seekerQuestion} />
          </TimelineNode>
        )}

        {/* Node 6: PracticePrompt */}
        {card.practicePrompt && (
          <TimelineNode number={6} accentColor={card.accentColor}>
            <PracticePrompt prompt={card.practicePrompt} />
          </TimelineNode>
        )}

        {/* Node 7: SpecsRow */}
        <TimelineNode number={7} accentColor={card.accentColor}>
          <SpecsRow specs={card.specs} />
        </TimelineNode>
      </div>

      {/* Back Button */}
      <BackButton onClick={handleBack} />
    </div>
  );
}
