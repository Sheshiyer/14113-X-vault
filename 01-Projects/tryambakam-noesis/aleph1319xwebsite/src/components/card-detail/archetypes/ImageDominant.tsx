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

interface ArchetypeProps {
  card: CardEntry;
}

export default function ImageDominant({ card }: ArchetypeProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

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

      // 3. Image slides in from left
      tl.fromTo(
        imageColRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.4 },
        0.1
      );

      // 4. Text elements stagger in from right
      tl.fromTo(
        "[data-gsap='imgdom-text']",
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 },
        0.2
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

      {/* Reversed 60/40 grid: image 60% left, text 40% right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60% 40%",
          minHeight: "100vh",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {/* -- Left Column: Image (60%) -- */}
        <div
          ref={imageColRef}
          style={{
            position: "relative",
            background: "radial-gradient(circle at center, #111 0%, #000 100%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div className={styles.scanLines} />
          <div className={styles.imageWrapper}>
            <img
              className={styles.cardImage}
              src={card.imageUrl}
              alt={`${card.title} -- ${card.subtitle}`}
              loading="lazy"
            />
          </div>
          <div className={styles.overlayUi}>
            <div className={styles.uiBadge}>{card.section}</div>
            <div className={styles.uiCoords}>
              {card.dimensions.width} x {card.dimensions.height}
            </div>
          </div>
          <div className={`${styles.crosshair} ${styles.chTl}`} />
          <div className={`${styles.crosshair} ${styles.chTr}`} />
          <div className={`${styles.crosshair} ${styles.chBl}`} />
          <div className={`${styles.crosshair} ${styles.chBr}`} />
        </div>

        {/* -- Right Column: Compact Text (40%) -- */}
        <div
          ref={textColRef}
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflowY: "auto",
          }}
        >
          {/* HUD Header */}
          <div data-gsap="imgdom-text">
            <HudHeader
              sectionCode={card.sectionCode}
              version={card.version}
              accentColor={card.accentColor}
              onBack={handleBack}
            />
          </div>

          {/* Content area */}
          <div style={{ padding: "4vh 28px", flexGrow: 1 }}>
            {/* Hook line as serif quote */}
            {card.hookLine && (
              <blockquote
                data-gsap="imgdom-text"
                style={{
                  fontFamily: "var(--noesis-font-display, serif)",
                  fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)",
                  lineHeight: 1.35,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#fff",
                  margin: "0 0 32px",
                  padding: 0,
                  borderLeft: `3px solid ${card.accentColor}`,
                  paddingLeft: "20px",
                }}
              >
                {card.hookLine}
              </blockquote>
            )}

            {/* Description */}
            <p
              className={styles.heroDescription}
              data-gsap="imgdom-text"
              style={{ marginBottom: 24 }}
            >
              {card.description}
            </p>

            {/* Report paragraphs */}
            {reportParagraphs.length > 0 && (
              <div data-gsap="imgdom-text" style={{ marginBottom: 24 }}>
                {reportParagraphs.map((paragraph, index) => (
                  <p key={index} className={styles.reportParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Key Insight */}
            {card.keyInsight && (
              <div data-gsap="imgdom-text">
                <KeyInsight
                  insight={card.keyInsight}
                  accentColor={card.accentColor}
                />
              </div>
            )}

            {/* Cartographer Note */}
            {card.cartographerNote && (
              <div data-gsap="imgdom-text">
                <CartographerNote
                  note={card.cartographerNote}
                  accentColor={card.accentColor}
                />
              </div>
            )}

            {/* Seeker Question */}
            {card.seekerQuestion && (
              <div data-gsap="imgdom-text">
                <SeekerQuestion question={card.seekerQuestion} />
              </div>
            )}

            {/* Practice Prompt */}
            {card.practicePrompt && (
              <div data-gsap="imgdom-text">
                <PracticePrompt prompt={card.practicePrompt} />
              </div>
            )}
          </div>

          {/* Specs Row */}
          <div data-gsap="imgdom-text">
            <SpecsRow specs={card.specs} />
          </div>

          {/* Back Button */}
          <div data-gsap="imgdom-text">
            <BackButton onClick={handleBack} />
          </div>
        </div>
      </div>
    </div>
  );
}
