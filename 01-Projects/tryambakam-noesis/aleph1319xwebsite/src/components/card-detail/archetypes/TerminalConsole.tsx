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
import { ScanlineVariant, TraversingGlitch } from "../effects";

interface ArchetypeProps {
  card: CardEntry;
}

/* Shared inline style fragments for terminal aesthetic */
const MONO: React.CSSProperties = {
  fontFamily: "var(--noesis-font-mono, monospace)",
};

const TERMINAL_BG = "#0a0a0f";
const TERMINAL_GREEN = "#00ff88";
const TERMINAL_DIM = "#555";
const TERMINAL_TEXT = "#aaa";

export default function TerminalConsole({ card }: ArchetypeProps) {
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
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Page fades in
      tl.fromTo(
        "[data-gsap='card-page']",
        { opacity: 0 },
        { opacity: 1, duration: 0.15 }
      );

      // 2. Glitch flash
      tl.fromTo(
        "[data-gsap='card-glitch']",
        { opacity: 0 },
        { opacity: 0.15, duration: 0.06, repeat: 2, yoyo: true },
        0.02
      );

      // 3. Terminal lines stagger in with typing feel
      tl.fromTo(
        "[data-gsap='term-line']",
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.12, stagger: 0.03 },
        0.1
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

      {/* Full-width dark terminal background */}
      <div
        style={{
          background: TERMINAL_BG,
          minHeight: "100vh",
          position: "relative",
          ...MONO,
        }}
      >
        {/* Vertical scanlines */}
        <ScanlineVariant direction="vertical" opacity={0.025} />

        {/* Traversing glitch bar */}
        <TraversingGlitch speed={12} color="rgba(0,255,136,0.04)" height={1} />

        {/* Top bar */}
        <div
          data-gsap="term-line"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
          }}
        >
          <span style={{ color: TERMINAL_GREEN }}>{card.sectionCode}</span>
          <span style={{ color: TERMINAL_DIM }}>
            NOESIS TERMINAL v{card.version}
          </span>
          <button
            type="button"
            onClick={handleBack}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              color: TERMINAL_DIM,
              ...MONO,
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              padding: "6px 14px",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.color = TERMINAL_GREEN;
              btn.style.borderColor = TERMINAL_GREEN;
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.color = TERMINAL_DIM;
              btn.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            [ESC] BACK
          </button>
        </div>

        {/* Content area */}
        <div style={{ padding: "32px 24px", maxWidth: 900 }}>
          {/* Hook line as command */}
          {card.hookLine && (
            <div
              data-gsap="term-line"
              style={{
                fontSize: "13px",
                color: TERMINAL_GREEN,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: TERMINAL_DIM, marginRight: 8 }}>&gt;</span>
              {card.hookLine}
            </div>
          )}

          {/* Title in large monospace */}
          <h1
            data-gsap="term-line"
            style={{
              ...MONO,
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              lineHeight: 0.95,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: "0 0 8px",
            }}
          >
            {card.title}
          </h1>

          {/* Subtitle */}
          <p
            data-gsap="term-line"
            style={{
              fontSize: "12px",
              color: TERMINAL_DIM,
              margin: "0 0 32px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {card.subtitle}
          </p>

          {/* Description */}
          <p
            data-gsap="term-line"
            style={{
              fontSize: "13px",
              color: TERMINAL_TEXT,
              lineHeight: 1.7,
              margin: "0 0 32px",
              maxWidth: 640,
            }}
          >
            {card.description}
          </p>

          {/* Divider */}
          <div
            data-gsap="term-line"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              margin: "0 0 24px",
            }}
          />

          {/* Report content as terminal output */}
          {reportParagraphs.map((paragraph, index) => (
            <div
              key={index}
              data-gsap="term-line"
              style={{
                fontSize: "12px",
                color: TERMINAL_TEXT,
                lineHeight: 1.75,
                marginBottom: 16,
                maxWidth: 640,
                paddingLeft: 20,
              }}
            >
              <span
                style={{
                  color: TERMINAL_DIM,
                  marginLeft: -20,
                  marginRight: 8,
                  userSelect: "none",
                }}
              >
                //
              </span>
              {paragraph}
            </div>
          ))}

          {/* Specs as horizontal data bar */}
          <div data-gsap="term-line" style={{ margin: "32px 0" }}>
            <SpecsRow specs={card.specs} />
          </div>

          {/* Engine tags as [TAG] badges */}
          {card.engineTags.length > 0 && (
            <div
              data-gsap="term-line"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 32,
              }}
            >
              {card.engineTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    ...MONO,
                    fontSize: "10px",
                    color: TERMINAL_GREEN,
                    border: `1px solid ${TERMINAL_GREEN}44`,
                    padding: "4px 10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  [{tag}]
                </span>
              ))}
            </div>
          )}

          {/* CartographerNote as NOTE: block */}
          {card.cartographerNote && (
            <div
              data-gsap="term-line"
              style={{
                borderLeft: `2px solid ${card.accentColor}`,
                paddingLeft: 16,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: card.accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                NOTE:
              </span>
              <p
                style={{
                  fontSize: "12px",
                  color: TERMINAL_TEXT,
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                {card.cartographerNote}
              </p>
            </div>
          )}

          {/* KeyInsight as INSIGHT: highlighted block */}
          {card.keyInsight && (
            <div
              data-gsap="term-line"
              style={{
                background: "rgba(0,255,136,0.04)",
                border: "1px solid rgba(0,255,136,0.12)",
                padding: 20,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: TERMINAL_GREEN,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                INSIGHT:
              </span>
              <p
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  lineHeight: 1.5,
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                {card.keyInsight}
              </p>
            </div>
          )}

          {/* PracticePrompt as > PRACTICE: command block */}
          {card.practicePrompt && (
            <div
              data-gsap="term-line"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: 20,
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: TERMINAL_DIM,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: TERMINAL_GREEN, marginRight: 6 }}>
                  &gt;
                </span>
                PRACTICE:
              </span>
              <p
                style={{
                  fontSize: "12px",
                  color: TERMINAL_TEXT,
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                {card.practicePrompt}
              </p>
            </div>
          )}

          {/* Seeker Question */}
          {card.seekerQuestion && (
            <div data-gsap="term-line">
              <SeekerQuestion question={card.seekerQuestion} />
            </div>
          )}

          {/* Back Button */}
          <div data-gsap="term-line">
            <BackButton onClick={handleBack} label="[EXIT] Return to Field" />
          </div>
        </div>
      </div>
    </div>
  );
}
