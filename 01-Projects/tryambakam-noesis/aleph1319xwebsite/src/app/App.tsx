import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageLoader } from "../components/loader/PageLoader";
import TerminalPreview from "../components/terminal/TerminalPreview";
import { InfiniteCanvas } from "../infinite-canvas";
import BRAND_MEDIA, { TERMINAL_EASTER_EGG_INDEX } from "../media/sample-media";
import { SCENES } from "../content/scenes";
import { getSlugByMediaIndex } from "../content/card-catalog";

import CardDetail from "../components/card-detail/CardDetail";

if (typeof window !== "undefined") {
  // Preload large media assets in the background to eliminate perceived load times
  const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  const initPreload = () => {
    BRAND_MEDIA.forEach((m) => preloadImage(m.url));
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(initPreload);
  } else {
    setTimeout(initPreload, 2000);
  }
}
const EASTER_STORAGE_KEY = "aleph1319:easter-v1";
const EASTER_REQUIRED_SCENE_VISITS = 5;

interface EasterEggState {
  readonly visitedSceneIds: readonly string[];
  readonly phraseUnlocked: boolean;
  readonly unlockedAt: string | null;
}

function createDefaultEasterEggState(): EasterEggState {
  return {
    visitedSceneIds: [],
    phraseUnlocked: false,
    unlockedAt: null
  };
}

function parseEasterEggState(raw: string | null): EasterEggState {
  if (raw === null || raw.trim().length === 0) {
    return createDefaultEasterEggState();
  }

  try {
    const parsed = JSON.parse(raw) as {
      visitedSceneIds?: unknown;
      phraseUnlocked?: unknown;
      unlockedAt?: unknown;
    };

    const visitedSceneIds = Array.isArray(parsed.visitedSceneIds)
      ? parsed.visitedSceneIds.filter((item): item is string => typeof item === "string")
      : [];

    return {
      visitedSceneIds: Array.from(new Set(visitedSceneIds)),
      phraseUnlocked: parsed.phraseUnlocked === true,
      unlockedAt: typeof parsed.unlockedAt === "string" ? parsed.unlockedAt : null
    };
  } catch {
    return createDefaultEasterEggState();
  }
}

function useResponsiveModeFlag(): void {
  useEffect(() => {
    const root = document.documentElement;

    const applyMode = () => {
      if (window.innerWidth < 840) {
        root.setAttribute("data-mode", "mobile-compact");
      } else {
        root.removeAttribute("data-mode");
      }
    };

    applyMode();
    window.addEventListener("resize", applyMode);
    return () => {
      window.removeEventListener("resize", applyMode);
    };
  }, []);
}

interface CanvasExperienceProps {
  readonly onSceneVisited: (sceneId: string) => void;
  readonly onMediaClick?: (mediaIndex: number) => void;
}

function CanvasExperience({ onSceneVisited, onMediaClick }: CanvasExperienceProps) {
  const _location = useLocation();
  const _navigate = useNavigate();
  const { slug: _slug } = useParams<{ slug: string }>();
  const [textureProgress, setTextureProgress] = useState(0);

  return (
    <section className="experience-panel experience-panel--canvas">
      <PageLoader progress={textureProgress} />
      <InfiniteCanvas
        media={BRAND_MEDIA}
        onTextureProgress={setTextureProgress}
        onMediaClick={onMediaClick}
        showControls
        backgroundColor="#0A1628"
        fogColor="#0A1628"
      />
    </section>
  );
}

function SignalPage() {
  const [copied, setCopied] = useState(false);
  const resetCopyTimerRef = useRef<number | null>(null);
  const revealLine = "RITE_03 :: WITNESS / FIELD / RETURN";

  useEffect(
    () => () => {
      if (resetCopyTimerRef.current !== null) {
        window.clearTimeout(resetCopyTimerRef.current);
      }
    },
    []
  );

  return (
    <section className="experience-panel">
      <div className="experience-panel__intro">
        <p className="experience-panel__eyebrow">Signal Chamber</p>
        <h1 className="experience-panel__title">Hidden Route Unlocked</h1>
        <p className="experience-panel__copy">
          The route is local-only by design. Capture the line and feed it into your own ritual trail.
        </p>
      </div>

      <article className="signal-chamber glitch-scanline">
        <p className="signal-chamber__label">Recovered line</p>
        <p className="signal-chamber__line">{revealLine}</p>
        <button
          type="button"
          className="signal-chamber__button"
          onClick={async () => {
            if (!navigator.clipboard) {
              return;
            }

            try {
              await navigator.clipboard.writeText(revealLine);
              setCopied(true);
              if (resetCopyTimerRef.current !== null) {
                window.clearTimeout(resetCopyTimerRef.current);
              }
              resetCopyTimerRef.current = window.setTimeout(() => setCopied(false), 1400);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "Copied" : "Copy line"}
        </button>
      </article>
    </section>
  );
}

export function App() {
  useResponsiveModeFlag();

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [easterEggState, setEasterEggState] = useState<EasterEggState>(() => {
    if (typeof window === "undefined") {
      return createDefaultEasterEggState();
    }
    return parseEasterEggState(window.localStorage.getItem(EASTER_STORAGE_KEY));
  });
  const [showUnlockToast, setShowUnlockToast] = useState(false);
  const unlockedRef = useRef(false);

  const visitedCount = useMemo(() => new Set(easterEggState.visitedSceneIds).size, [easterEggState.visitedSceneIds]);
  const unlockedByCriteria =
    visitedCount >= EASTER_REQUIRED_SCENE_VISITS && easterEggState.phraseUnlocked;
  const easterEggUnlocked = unlockedByCriteria || easterEggState.unlockedAt !== null;

  const navigate = useNavigate();

  /** When a specific brand image is clicked in the canvas */
  const handleMediaClick = useMemo(() => (mediaIndex: number) => {
    if (mediaIndex === TERMINAL_EASTER_EGG_INDEX) {
      setTerminalOpen(true);
      return;
    }
    const slug = getSlugByMediaIndex(mediaIndex);
    if (slug) {
      navigate(`/card/${slug}`);
    }
  }, [navigate]);

  useEffect(() => {
    try {
      window.localStorage.setItem(EASTER_STORAGE_KEY, JSON.stringify(easterEggState));
    } catch {
      // Ignore local storage failures and keep runtime-only state.
    }
  }, [easterEggState]);

  useEffect(() => {
    if (unlockedByCriteria && easterEggState.unlockedAt === null) {
      setEasterEggState((previous) => ({
        ...previous,
        unlockedAt: new Date().toISOString()
      }));
    }
  }, [easterEggState.unlockedAt, unlockedByCriteria]);

  useEffect(() => {
    if (!unlockedRef.current && easterEggUnlocked) {
      setShowUnlockToast(true);
      const timeoutId = window.setTimeout(() => setShowUnlockToast(false), 4200);
      unlockedRef.current = true;
      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    unlockedRef.current = easterEggUnlocked;
    return undefined;
  }, [easterEggUnlocked]);

  const sceneVisitHandler = useMemo(() => (sceneId: string) => {
    setEasterEggState((previous) => {
      if (previous.visitedSceneIds.includes(sceneId)) {
        return previous;
      }
      return {
        ...previous,
        visitedSceneIds: [...previous.visitedSceneIds, sceneId]
      };
    });
  }, []);

  return (
    <div className="app-shell">
      <main className="app-main">
        {showUnlockToast ? (
          <aside className="app-toast glitch-enter-active" role="status" aria-live="polite">
            Signal route unlocked. Open `/signal`.
          </aside>
        ) : null}

        {/* Persistent Background Layer - Never unmounts, preventing 10-second WebGL freezes */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <CanvasExperience
            onSceneVisited={sceneVisitHandler}
            onMediaClick={handleMediaClick}
          />
        </div>

        {/* Route Overlays */}
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%", pointerEvents: "none" }}>
          <Routes>
            <Route path="/" element={null} />
            <Route path="/scene/:slug" element={null} />
            <Route
              path="/card/:slug"
              element={
                <div style={{ pointerEvents: "auto", height: "100%" }}>
                  <CardDetail />
                </div>
              }
            />
            <Route
              path="/signal"
              element={
                easterEggUnlocked ? (
                  <div style={{ pointerEvents: "auto", height: "100%" }}>
                    <SignalPage />
                  </div>
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>

        {/* Terminal overlay — Easter egg triggered by clicking the stained-glass logo */}
        {terminalOpen && (
          <TerminalPreview
            onClose={() => setTerminalOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
