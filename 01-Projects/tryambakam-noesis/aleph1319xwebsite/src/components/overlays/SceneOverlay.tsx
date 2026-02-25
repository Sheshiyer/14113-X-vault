import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { SceneEntry } from "../../content/scenes";

export interface SceneOverlayProps {
  readonly isOpen: boolean;
  readonly scene: SceneEntry | null;
  readonly onClose: () => void;
  readonly reducedMotion?: boolean;
}

type OverlayPhase = "hidden" | "entering" | "open" | "exiting";

const overlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 60,
  display: "grid",
  placeItems: "center",
  pointerEvents: "none"
};

const backdropStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  border: "none",
  background: "rgba(2, 5, 11, 0.78)",
  backdropFilter: "blur(4px)",
  pointerEvents: "auto",
  cursor: "pointer"
};

const panelStyle: CSSProperties = {
  position: "relative",
  width: "min(700px, calc(100% - 2rem))",
  maxHeight: "min(86vh, 860px)",
  overflow: "auto",
  border: "1px solid rgba(110, 205, 255, 0.35)",
  borderRadius: "18px",
  background:
    "linear-gradient(160deg, rgba(6, 14, 26, 0.96), rgba(5, 9, 15, 0.94) 38%, rgba(9, 22, 36, 0.94))",
  boxShadow: "0 30px 70px rgba(0, 0, 0, 0.45)",
  padding: "1.5rem 1.5rem 1.25rem",
  color: "rgba(232, 246, 255, 0.96)",
  pointerEvents: "auto"
};

const metadataRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  marginBottom: "0.9rem",
  fontSize: "0.82rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase"
};

const closeButtonStyle: CSSProperties = {
  border: "1px solid rgba(122, 214, 255, 0.28)",
  borderRadius: "999px",
  background: "rgba(10, 16, 28, 0.84)",
  color: "rgba(225, 246, 255, 0.94)",
  padding: "0.38rem 0.88rem",
  fontSize: "0.74rem",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  cursor: "pointer"
};

const summaryStyle: CSSProperties = {
  margin: "0.9rem 0 1rem",
  lineHeight: 1.65,
  color: "rgba(220, 240, 252, 0.9)"
};

const detailsStyle: CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "0.52rem"
};

const detailRowStyle: CSSProperties = {
  border: "1px solid rgba(120, 186, 255, 0.2)",
  borderRadius: "10px",
  padding: "0.62rem 0.75rem",
  background: "rgba(18, 25, 40, 0.42)",
  fontSize: "0.95rem",
  lineHeight: 1.45
};

const footerStyle: CSSProperties = {
  marginTop: "1.2rem",
  borderTop: "1px solid rgba(118, 186, 252, 0.22)",
  paddingTop: "0.9rem",
  display: "grid",
  gap: "0.7rem"
};

const tagsStyle: CSSProperties = {
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  margin: 0,
  padding: 0
};

const tagStyle: CSSProperties = {
  border: "1px solid rgba(114, 183, 255, 0.24)",
  borderRadius: "999px",
  padding: "0.22rem 0.66rem",
  fontSize: "0.72rem",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "rgba(188, 227, 249, 0.92)",
  background: "rgba(15, 23, 38, 0.7)"
};

const intensityRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "0.78rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "rgba(190, 220, 238, 0.86)"
};

function getIntensityColor(intensity: SceneEntry["intensity"]): string {
  if (intensity === "high") {
    return "#ff799a";
  }

  if (intensity === "medium") {
    return "#ffd778";
  }

  return "#8bedc2";
}

export function SceneOverlay({
  isOpen,
  scene,
  onClose,
  reducedMotion = false
}: SceneOverlayProps) {
  const overlayRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const [renderedScene, setRenderedScene] = useState<SceneEntry | null>(scene);
  const [phase, setPhase] = useState<OverlayPhase>(isOpen && scene !== null ? "open" : "hidden");

  useEffect(() => {
    if (isOpen && scene !== null) {
      if (renderedScene?.id !== scene.id || phase === "hidden" || phase === "exiting") {
        setRenderedScene(scene);
        setPhase("entering");
      }
      return;
    }

    if (!isOpen && renderedScene !== null) {
      if (reducedMotion) {
        setRenderedScene(null);
        setPhase("hidden");
      } else if (phase !== "exiting") {
        setPhase("exiting");
      }
    }
  }, [isOpen, phase, reducedMotion, renderedScene, scene]);

  useEffect(() => {
    const isVisible = renderedScene !== null && phase !== "hidden";
    if (!isVisible) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && phase !== "exiting") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, phase, renderedScene]);

  useLayoutEffect(() => {
    if (overlayRef.current === null || renderedScene === null || phase === "hidden") {
      return;
    }

    animationRef.current?.kill();
    animationRef.current = null;

    if (reducedMotion) {
      if (phase === "entering") {
        setPhase("open");
      } else if (phase === "exiting") {
        setRenderedScene(null);
        setPhase("hidden");
      }
      return;
    }

    const context = gsap.context(() => {
      if (phase === "entering") {
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            setPhase("open");
          }
        });

        timeline.fromTo("[data-gsap='scene-backdrop']", { opacity: 0 }, { opacity: 1, duration: 0.24 });
        timeline.fromTo(
          "[data-gsap='scene-panel']",
          { opacity: 0, y: 24, scale: 0.98, filter: "blur(10px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.35 },
          "-=0.12"
        );
        timeline.fromTo(
          ["[data-gsap='scene-title']", "[data-gsap='scene-subtitle']", "[data-gsap='scene-summary']"],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.24, stagger: 0.05 },
          "-=0.2"
        );
        timeline.fromTo(
          "[data-gsap='scene-details'] li",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.18, stagger: 0.04 },
          "-=0.14"
        );
        timeline.fromTo(
          "[data-gsap='scene-glitch']",
          { opacity: 0 },
          { opacity: 0.18, duration: 0.08, repeat: 1, yoyo: true },
          0.04
        );
        animationRef.current = timeline;
        return;
      }

      if (phase === "exiting") {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.in" },
          onComplete: () => {
            setRenderedScene(null);
            setPhase("hidden");
          }
        });

        timeline.to(
          "[data-gsap='scene-panel']",
          { opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)", duration: 0.24 },
          0
        );
        timeline.to("[data-gsap='scene-backdrop']", { opacity: 0, duration: 0.22 }, 0);
        timeline.fromTo(
          "[data-gsap='scene-glitch']",
          { opacity: 0 },
          { opacity: 0.24, duration: 0.08, repeat: 1, yoyo: true },
          0
        );
        animationRef.current = timeline;
      }
    }, overlayRef);

    return () => {
      animationRef.current?.kill();
      animationRef.current = null;
      context.revert();
    };
  }, [phase, reducedMotion, renderedScene]);

  if (renderedScene === null || phase === "hidden") {
    return null;
  }

  const titleId = `scene-overlay-title-${renderedScene.id}`;
  const descriptionId = `scene-overlay-description-${renderedScene.id}`;
  const motionClassName = reducedMotion ? "scene-overlay--reduced-motion" : "scene-overlay--animated";
  const isInteractive = phase !== "exiting";

  return (
    <aside
      ref={overlayRef}
      className={`scene-overlay glitch-layer ${motionClassName} scene-overlay--${phase}`}
      data-gsap="scene-overlay"
      data-scene-id={renderedScene.id}
      data-overlay-phase={phase}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      style={overlayStyle}
    >
      <button
        type="button"
        className="scene-overlay__backdrop glitch-backdrop"
        data-gsap="scene-backdrop"
        onClick={isInteractive ? onClose : undefined}
        aria-label="Close scene details"
        disabled={!isInteractive}
        style={backdropStyle}
      />

      <div className="glitch-transition-layer scene-overlay__glitch" data-gsap="scene-glitch" />

      <section
        className="scene-overlay__panel glitch-panel"
        data-gsap="scene-panel"
        data-glitch-surface="true"
        style={panelStyle}
      >
        <header className="scene-overlay__meta glitch-row" style={metadataRowStyle}>
          <span className="scene-overlay__epoch glitch-scanline" data-gsap="scene-epoch">
            {renderedScene.epoch}
          </span>

          <button
            type="button"
            className="scene-overlay__close glitch-button"
            data-gsap="scene-close"
            onClick={isInteractive ? onClose : undefined}
            disabled={!isInteractive}
            style={closeButtonStyle}
          >
            Close
          </button>
        </header>

        <h2
          id={titleId}
          className="scene-overlay__title glitch-title"
          data-gsap="scene-title"
          data-text={renderedScene.title}
          style={{ margin: 0, fontSize: "clamp(1.35rem, 3.5vw, 2rem)", letterSpacing: "0.01em" }}
        >
          {renderedScene.title}
        </h2>

        <p
          className="scene-overlay__subtitle glitch-subtitle"
          data-gsap="scene-subtitle"
          style={{ margin: "0.34rem 0 0", color: "rgba(165, 212, 238, 0.95)" }}
        >
          {renderedScene.subtitle}
        </p>

        <p
          id={descriptionId}
          className="scene-overlay__summary glitch-copy"
          data-gsap="scene-summary"
          style={summaryStyle}
        >
          {renderedScene.summary}
        </p>

        <ul className="scene-overlay__details glitch-stack" data-gsap="scene-details" style={detailsStyle}>
          {renderedScene.details.map((detail, index) => (
            <li key={`${renderedScene.id}-detail-${index}`} className="scene-overlay__detail glitch-line" style={detailRowStyle}>
              {detail}
            </li>
          ))}
        </ul>

        <footer className="scene-overlay__footer glitch-footer" data-gsap="scene-footer" style={footerStyle}>
          <ul className="scene-overlay__tags glitch-tags" style={tagsStyle}>
            {renderedScene.tags.map((tag) => (
              <li key={`${renderedScene.id}-${tag}`} className="scene-overlay__tag" style={tagStyle}>
                {tag}
              </li>
            ))}
          </ul>

          <div className="scene-overlay__intensity-row glitch-row" style={intensityRowStyle}>
            <span>Signal Intensity</span>
            <strong style={{ color: getIntensityColor(renderedScene.intensity), letterSpacing: "0.08em" }}>
              {renderedScene.intensity}
            </strong>
          </div>
        </footer>
      </section>
    </aside>
  );
}
