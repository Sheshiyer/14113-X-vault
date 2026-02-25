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
  SpecsRow,
  BackButton,
} from "../shared";
import {
  PulsingStatusCluster,
  DataRowReveal,
  ScanlineVariant,
} from "../effects";

interface ArchetypeProps {
  card: CardEntry;
}

const PANEL_BORDER = "1px solid rgba(255,255,255,0.15)";
const PANEL_PADDING = 24;

function DashPanel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      data-gsap="dash-panel"
      style={{
        border: PANEL_BORDER,
        padding: PANEL_PADDING,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function DashboardGrid({ card }: ArchetypeProps) {
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

      // 3. Panels fade in with stagger + slight scale
      tl.fromTo(
        "[data-gsap='dash-panel']",
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.08 },
        0.12
      );

      // 4. Bottom content
      tl.fromTo(
        "[data-gsap='dash-bottom']",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.25 },
        0.5
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

      {/* Dashboard header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          fontFamily: "var(--noesis-font-mono, monospace)",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: "#666",
        }}
      >
        <span>
          <span style={{ color: card.accentColor }}>{card.sectionCode}</span>
          <span style={{ margin: "0 12px", color: "#333" }}>|</span>
          <span>DASHBOARD VIEW</span>
        </span>
        <span>{card.version}</span>
        <button
          type="button"
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontFamily: "var(--noesis-font-mono, monospace)",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
            padding: "8px 16px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#666";
          }}
        >
          BACK &larr;
        </button>
      </div>

      {/* 2x2 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100vh - 52px)",
        }}
      >
        {/* Top-left: Image + overlays */}
        <DashPanel
          style={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at center, #111 0%, #000 100%)",
          }}
        >
          <ScanlineVariant direction="diagonal" opacity={0.03} />
          <div className={styles.imageWrapper}>
            <img
              className={styles.cardImage}
              src={card.imageUrl}
              alt={`${card.title} -- ${card.subtitle}`}
              loading="lazy"
            />
          </div>
          {/* Crosshairs */}
          <div className={`${styles.crosshair} ${styles.chTl}`} />
          <div className={`${styles.crosshair} ${styles.chTr}`} />
          <div className={`${styles.crosshair} ${styles.chBl}`} />
          <div className={`${styles.crosshair} ${styles.chBr}`} />
        </DashPanel>

        {/* Top-right: hookLine + title + description */}
        <DashPanel>
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
            {card.hookLine && (
              <p
                style={{
                  fontFamily: "var(--noesis-font-mono, monospace)",
                  fontSize: "12px",
                  color: card.accentColor,
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {card.hookLine}
              </p>
            )}
            <h1
              className={styles.heroTitle}
              style={{
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                marginBottom: 24,
              }}
            >
              {card.title}
            </h1>
            <p className={styles.heroDescription}>{card.description}</p>

            {/* Report content */}
            {reportParagraphs.length > 0 && (
              <div style={{ marginTop: 24 }}>
                {reportParagraphs.slice(0, 2).map((paragraph, index) => (
                  <p key={index} className={styles.reportParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </DashPanel>

        {/* Bottom-left: SpecsRow + engine tags */}
        <DashPanel>
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
            <div>
              <span
                style={{
                  fontFamily: "var(--noesis-font-mono, monospace)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#555",
                  display: "block",
                  marginBottom: 20,
                }}
              >
                SPECIFICATIONS
              </span>
              <SpecsRow specs={card.specs} />

              {/* DataRowReveal for features */}
              {card.features.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <DataRowReveal
                    triggerLabel="Features"
                    rows={card.features.map((f) => ({
                      label: f.title,
                      value: f.description,
                    }))}
                  />
                </div>
              )}
            </div>

            {/* Engine tags as PulsingStatusCluster */}
            {card.engineTags.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <span
                  style={{
                    fontFamily: "var(--noesis-font-mono, monospace)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#555",
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  ENGINE TAGS
                </span>
                <PulsingStatusCluster
                  items={card.engineTags.map((tag) => ({
                    label: tag,
                    color: card.accentColor,
                    active: true,
                  }))}
                />
              </div>
            )}
          </div>
        </DashPanel>

        {/* Bottom-right: CartographerNote + KeyInsight */}
        <DashPanel>
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
            {card.keyInsight && (
              <KeyInsight
                insight={card.keyInsight}
                accentColor={card.accentColor}
              />
            )}

            {card.cartographerNote && (
              <CartographerNote
                note={card.cartographerNote}
                accentColor={card.accentColor}
              />
            )}

            {/* Remaining report paragraphs if any */}
            {reportParagraphs.length > 2 && (
              <div style={{ marginTop: 16 }}>
                {reportParagraphs.slice(2).map((paragraph, index) => (
                  <p key={index} className={styles.reportParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </DashPanel>
      </div>

      {/* Below grid: SeekerQuestion + PracticePrompt (full width) */}
      <div
        data-gsap="dash-bottom"
        style={{
          padding: "40px 24px",
          maxWidth: 800,
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {card.seekerQuestion && (
          <SeekerQuestion question={card.seekerQuestion} />
        )}

        {card.practicePrompt && (
          <PracticePrompt prompt={card.practicePrompt} />
        )}

        {/* Back Button */}
        <BackButton onClick={handleBack} />
      </div>
    </div>
  );
}
