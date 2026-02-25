import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import type { CardEntry } from "../../../content/card-catalog";
import { CartographerNote, SeekerQuestion, KeyInsight, PracticePrompt } from "../shared";
import styles from "../card-detail.module.css";

interface ArchetypeProps {
  card: CardEntry;
}

export default function SplitHud({ card }: ArchetypeProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!card || !pageRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Page background fades in
      tl.fromTo(
        "[data-gsap='card-page']",
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );

      // 2. HUD header slides down
      tl.fromTo(
        "[data-gsap='card-hud']",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.15 },
        "-=0.05"
      );

      // 3. Hero title + description stagger in
      tl.fromTo(
        ["[data-gsap='card-label']", "[data-gsap='card-title']", "[data-gsap='card-desc']"],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.05 },
        "-=0.08"
      );

      // 4. Report content fades in
      tl.fromTo(
        "[data-gsap='card-report']",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.25 },
        "-=0.1"
      );

      // 5. Specs row items stagger in
      tl.fromTo(
        "[data-gsap='card-spec']",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.18, stagger: 0.04 },
        "-=0.12"
      );

      // 6. CTA fades in
      tl.fromTo(
        "[data-gsap='card-cta']",
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        "-=0.08"
      );

      // 7. Image panel fades in with slight scale
      tl.fromTo(
        "[data-gsap='card-image']",
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" },
        "-=0.2"
      );

      // 8. Glitch flash
      tl.fromTo(
        "[data-gsap='card-glitch']",
        { opacity: 0 },
        { opacity: 0.18, duration: 0.08, repeat: 1, yoyo: true },
        0.04
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

    const tl = gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => { navigate("/"); },
    });
    tl.to(pageRef.current, { opacity: 0, duration: 0.2 });
  };

  /** Split reportContent on double-newlines into paragraphs */
  const reportParagraphs = card.reportContent
    ? card.reportContent.split("\n\n").filter(Boolean)
    : [];

  return (
    <div
      ref={pageRef}
      className={styles.page}
      data-gsap="card-page"
    >
      {/* Glitch flash layer */}
      <div
        ref={glitchRef}
        className={styles.glitchLayer}
        data-gsap="card-glitch"
      />

      <div className={styles.mainGrid}>
        {/* -- Left Column: Content -- */}
        <div className={styles.colLeft}>
          <div
            className={`${styles.crosshair} ${styles.chBr}`}
          />

          {/* HUD Header */}
          <header className={styles.headerHud} data-gsap="card-hud">
            <div className={styles.hudItem}>
              <span>{card.sectionCode}</span>
              <span
                className={styles.statusDot}
                style={{
                  background: card.accentColor,
                  boxShadow: `0 0 10px ${card.accentColor}`,
                }}
              />
            </div>
            <div className={styles.hudItem}>
              <span>{card.version}</span>
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={handleBack}
            >
              BACK &larr;
            </button>
          </header>

          {/* Hero Section */}
          <section className={styles.heroSection}>
            <span className={styles.heroLabel} data-gsap="card-label">
              {card.section}
            </span>
            <h1 className={styles.heroTitle} data-gsap="card-title">
              {card.title}
            </h1>
            <p className={styles.heroDescription} data-gsap="card-desc">
              {card.description}
            </p>
          </section>

          {/* Report Content */}
          {reportParagraphs.length > 0 && (
            <section className={styles.reportSection} data-gsap="card-report">
              {reportParagraphs.map((paragraph, index) => (
                <p key={index} className={styles.reportParagraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          )}

          {/* Voice Blocks */}
          {card.cartographerNote && (
            <CartographerNote note={card.cartographerNote} accentColor={card.accentColor} />
          )}
          {card.keyInsight && (
            <KeyInsight insight={card.keyInsight} accentColor={card.accentColor} />
          )}
          {card.seekerQuestion && (
            <SeekerQuestion question={card.seekerQuestion} />
          )}
          {card.practicePrompt && (
            <PracticePrompt prompt={card.practicePrompt} />
          )}

          {/* Specs Row */}
          <div className={styles.specsContainer}>
            {card.specs.map((spec) => (
              <div
                key={spec.label}
                className={styles.specBox}
                data-gsap="card-spec"
              >
                <span className={styles.specLabel}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            className={styles.ctaContainer}
            onClick={handleBack}
            data-gsap="card-cta"
          >
            <span className={styles.btnText}>Return to Field</span>
            <span className={styles.arrowIcon}>&rarr;</span>
          </button>
        </div>

        {/* -- Right Column: Image -- */}
        <div className={styles.colRight} data-gsap="card-image">
          <div className={styles.scanLines} />

          <div className={styles.imageWrapper}>
            <img
              className={styles.cardImage}
              src={card.imageUrl}
              alt={`${card.title} — ${card.subtitle}`}
              loading="lazy"
            />
          </div>

          <div className={styles.overlayUi}>
            <div className={styles.uiBadge}>{card.section}</div>
            <div className={styles.uiCoords}>
              {card.dimensions.width} x {card.dimensions.height}
            </div>
          </div>

          {/* Crosshair decorators */}
          <div className={`${styles.crosshair} ${styles.chTl}`} />
          <div className={`${styles.crosshair} ${styles.chTr}`} />
          <div className={`${styles.crosshair} ${styles.chBl}`} />
          <div className={`${styles.crosshair} ${styles.chBr}`} />
        </div>
      </div>
    </div>
  );
}
