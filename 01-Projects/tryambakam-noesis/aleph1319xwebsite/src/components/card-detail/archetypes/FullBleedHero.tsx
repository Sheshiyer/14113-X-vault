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
  BackButton,
} from "../shared";
import {
  GlassmorphismPanel,
  ScanlineVariant,
  MouseSpotlight,
} from "../effects";

interface ArchetypeProps {
  card: CardEntry;
}

export default function FullBleedHero({ card }: ArchetypeProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

      // 3. Image scales from 1.05 to 1
      tl.fromTo(
        imageRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6 },
        0.1
      );

      // 4. Panel slides up from bottom
      tl.fromTo(
        panelRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.4 },
        0.3
      );

      // 5. Text elements stagger in
      tl.fromTo(
        "[data-gsap='hero-text']",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.05 },
        0.45
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

      {/* Full-viewport container */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Full-screen background image */}
        <img
          ref={imageRef}
          src={card.imageUrl}
          alt={`${card.title} -- ${card.subtitle}`}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        />

        {/* Scanline overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          <ScanlineVariant direction="horizontal" opacity={0.04} />
        </div>

        {/* Dark gradient overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)",
            zIndex: 3,
          }}
        />

        {/* Mouse spotlight */}
        <div style={{ position: "absolute", inset: 0, zIndex: 4 }}>
          <MouseSpotlight />
        </div>

        {/* Back button - fixed top-right */}
        <button
          type="button"
          onClick={handleBack}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 10,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#999",
            fontFamily: "var(--noesis-font-mono, monospace)",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
            padding: "10px 18px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#999";
          }}
        >
          BACK &larr;
        </button>

        {/* Floating glassmorphism panel - bottom-left */}
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            zIndex: 5,
            maxWidth: 500,
          }}
        >
          <GlassmorphismPanel>
            <div style={{ padding: "32px" }}>
              {/* Section code */}
              <span
                data-gsap="hero-text"
                style={{
                  fontFamily: "var(--noesis-font-mono, monospace)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: card.accentColor,
                  display: "block",
                  marginBottom: 16,
                }}
              >
                {card.sectionCode}
              </span>

              {/* Hook line */}
              {card.hookLine && (
                <p
                  data-gsap="hero-text"
                  style={{
                    fontFamily: "var(--noesis-font-mono, monospace)",
                    fontSize: "12px",
                    color: "#888",
                    lineHeight: 1.6,
                    margin: "0 0 16px",
                  }}
                >
                  {card.hookLine}
                </p>
              )}

              {/* Title - large */}
              <h1
                data-gsap="hero-text"
                style={{
                  fontFamily: "var(--noesis-font-display, serif)",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  fontWeight: 400,
                  margin: "0 0 24px",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                {card.title}
              </h1>

              {/* Description */}
              <p
                data-gsap="hero-text"
                style={{
                  fontFamily: "var(--noesis-font-mono, monospace)",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "#999",
                  margin: "0 0 24px",
                }}
              >
                {card.description}
              </p>

              {/* Key Insight */}
              {card.keyInsight && (
                <div data-gsap="hero-text">
                  <KeyInsight
                    insight={card.keyInsight}
                    accentColor={card.accentColor}
                  />
                </div>
              )}
            </div>
          </GlassmorphismPanel>
        </div>

        {/* Below-panel content for scroll */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            minHeight: "100vh",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Scrollable content below the hero */}
      <div
        style={{
          padding: "60px 40px",
          maxWidth: 700,
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Report content */}
        {reportParagraphs.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            {reportParagraphs.map((paragraph, index) => (
              <p key={index} className={styles.reportParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Cartographer Note */}
        {card.cartographerNote && (
          <CartographerNote
            note={card.cartographerNote}
            accentColor={card.accentColor}
          />
        )}

        {/* Seeker Question */}
        {card.seekerQuestion && (
          <SeekerQuestion question={card.seekerQuestion} />
        )}

        {/* Practice Prompt */}
        {card.practicePrompt && (
          <PracticePrompt prompt={card.practicePrompt} />
        )}

        {/* Back Button */}
        <BackButton onClick={handleBack} />
      </div>
    </div>
  );
}
