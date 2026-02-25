import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { SCENES, type SceneEntry } from "../../content/scenes";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SceneOverlay } from "../overlays/SceneOverlay";

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.8;
const WHEEL_ZOOM_SENSITIVITY = 0.00135;
const PAN_CLICK_GRACE_MS = 140;
const DRAG_THRESHOLD = 3;
const TAP_MAX_DURATION_MS = 260;
const DOUBLE_TAP_WINDOW_MS = 320;
const DOUBLE_TAP_DISTANCE_THRESHOLD = 24;
const DOUBLE_TAP_SCALE_FACTOR = 1.24;
const SYNTHETIC_CLICK_SUPPRESSION_MS = 360;

type Point = { x: number; y: number };

interface ViewportState {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
}

interface PanState {
  readonly pointerId: number;
  readonly startPoint: Point;
  readonly startViewport: ViewportState;
}

interface PinchState {
  readonly pointerIds: [number, number];
  readonly startDistance: number;
  readonly anchorWorld: Point;
  readonly startViewport: ViewportState;
}

interface TapCandidate {
  readonly pointerId: number;
  readonly sceneId: string;
  readonly startedAtMs: number;
}

interface BackgroundTap {
  readonly atMs: number;
  readonly localPoint: Point;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(from: Point, to: Point): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

function midpoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.trim().replace("#", "");
  const safeAlpha = clamp(alpha, 0, 1);

  if (normalized.length !== 3 && normalized.length !== 6) {
    return `rgba(127, 220, 255, ${safeAlpha})`;
  }

  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => part + part)
          .join("")
      : normalized;

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
}

export interface InfiniteFieldProps {
  readonly className?: string;
  readonly scenes?: readonly SceneEntry[];
  readonly initialSceneId?: string | null;
  readonly onSceneOpen?: (sceneId: string) => void;
  readonly onSceneClose?: () => void;
}

export function InfiniteField({
  className,
  scenes = SCENES,
  initialSceneId = null,
  onSceneOpen,
  onSceneClose
}: InfiniteFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerPositionsRef = useRef<Map<number, Point>>(new Map());
  const viewportRef = useRef<ViewportState>({ x: 0, y: 0, scale: 1 });
  const panStateRef = useRef<PanState | null>(null);
  const pinchStateRef = useRef<PinchState | null>(null);
  const movedDuringGestureRef = useRef(false);
  const clickBlockUntilRef = useRef(0);
  const hasCenteredRef = useRef(false);
  const tapCandidateRef = useRef<TapCandidate | null>(null);
  const lastBackgroundTapRef = useRef<BackgroundTap | null>(null);
  const suppressNodeClickUntilRef = useRef(0);

  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    scale: 1
  });
  const [activeSceneId, setActiveSceneId] = useState<string | null>(initialSceneId);
  const [isDragging, setIsDragging] = useState(false);

  const reducedMotion = useReducedMotion(false);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  useEffect(() => {
    setActiveSceneId(initialSceneId);
  }, [initialSceneId]);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || hasCenteredRef.current) {
      return;
    }

    let frameId = 0;

    const centerField = () => {
      if (hasCenteredRef.current) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        frameId = window.requestAnimationFrame(centerField);
        return;
      }

      hasCenteredRef.current = true;
      setViewport((previous) => ({
        ...previous,
        x: rect.width / 2,
        y: rect.height / 2
      }));
    };

    centerField();

    return () => {
      if (frameId > 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const sceneById = useMemo(() => new Map(scenes.map((scene) => [scene.id, scene])), [scenes]);

  const activeScene = useMemo(() => {
    if (activeSceneId === null) {
      return null;
    }

    return sceneById.get(activeSceneId) ?? null;
  }, [activeSceneId, sceneById]);

  const sceneLinks = useMemo(() => {
    const links: Array<readonly [SceneEntry, SceneEntry]> = [];

    for (let index = 1; index < scenes.length; index += 1) {
      links.push([scenes[index - 1], scenes[index]]);
    }

    for (let index = 3; index < scenes.length; index += 3) {
      links.push([scenes[index - 3], scenes[index]]);
    }

    return links;
  }, [scenes]);

  const sceneBounds = useMemo(() => {
    if (scenes.length === 0) {
      return {
        minX: -1200,
        minY: -1200,
        width: 2400,
        height: 2400
      };
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const scene of scenes) {
      minX = Math.min(minX, scene.position.x);
      minY = Math.min(minY, scene.position.y);
      maxX = Math.max(maxX, scene.position.x);
      maxY = Math.max(maxY, scene.position.y);
    }

    const padding = 420;

    return {
      minX: minX - padding,
      minY: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2
    };
  }, [scenes]);

  const clientToLocal = useCallback((client: Point): Point => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect === undefined) {
      return client;
    }

    return {
      x: client.x - rect.left,
      y: client.y - rect.top
    };
  }, []);

  const zoomAtPoint = useCallback((anchor: Point, scaleFactor: number) => {
    setViewport((previous) => {
      const nextScale = clamp(previous.scale * scaleFactor, MIN_SCALE, MAX_SCALE);
      if (Math.abs(nextScale - previous.scale) < Number.EPSILON) {
        return previous;
      }

      const anchorWorldX = (anchor.x - previous.x) / previous.scale;
      const anchorWorldY = (anchor.y - previous.y) / previous.scale;

      return {
        x: anchor.x - anchorWorldX * nextScale,
        y: anchor.y - anchorWorldY * nextScale,
        scale: nextScale
      };
    });
  }, []);

  const openScene = useCallback(
    (sceneId: string) => {
      if (Date.now() < clickBlockUntilRef.current) {
        return;
      }

      setActiveSceneId(sceneId);
      onSceneOpen?.(sceneId);
    },
    [onSceneOpen]
  );

  const preparePanState = useCallback((pointerId: number) => {
    const pointer = pointerPositionsRef.current.get(pointerId);
    if (pointer === undefined) {
      panStateRef.current = null;
      return;
    }

    panStateRef.current = {
      pointerId,
      startPoint: pointer,
      startViewport: viewportRef.current
    };
  }, []);

  const preparePinchState = useCallback(() => {
    const pointers = Array.from(pointerPositionsRef.current.entries());
    if (pointers.length < 2) {
      pinchStateRef.current = null;
      return;
    }

    const [firstPointer, secondPointer] = pointers;
    const firstPoint = firstPointer[1];
    const secondPoint = secondPointer[1];
    const startDistance = distance(firstPoint, secondPoint);

    if (startDistance <= 8) {
      pinchStateRef.current = null;
      return;
    }

    const midpointLocal = clientToLocal(midpoint(firstPoint, secondPoint));
    const startViewport = viewportRef.current;

    pinchStateRef.current = {
      pointerIds: [firstPointer[0], secondPointer[0]],
      startDistance,
      startViewport,
      anchorWorld: {
        x: (midpointLocal.x - startViewport.x) / startViewport.scale,
        y: (midpointLocal.y - startViewport.y) / startViewport.scale
      }
    };
  }, [clientToLocal]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);

      pointerPositionsRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      const targetElement = event.target as HTMLElement | null;
      const targetNode = targetElement?.closest("[data-scene-id]");
      const targetSceneId =
        targetNode instanceof HTMLElement ? targetNode.dataset.sceneId ?? null : null;

      if (pointerPositionsRef.current.size === 1) {
        movedDuringGestureRef.current = false;
        preparePanState(event.pointerId);
        pinchStateRef.current = null;
        if (targetSceneId !== null && event.pointerType !== "mouse") {
          tapCandidateRef.current = {
            pointerId: event.pointerId,
            sceneId: targetSceneId,
            startedAtMs: Date.now()
          };
        } else {
          tapCandidateRef.current = null;
        }
      } else if (pointerPositionsRef.current.size >= 2) {
        movedDuringGestureRef.current = true;
        panStateRef.current = null;
        preparePinchState();
        tapCandidateRef.current = null;
        lastBackgroundTapRef.current = null;
      }
    },
    [preparePanState, preparePinchState]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerPositionsRef.current.has(event.pointerId)) {
        return;
      }

      pointerPositionsRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      const pinchState = pinchStateRef.current;
      if (pinchState !== null) {
        const firstPoint = pointerPositionsRef.current.get(pinchState.pointerIds[0]);
        const secondPoint = pointerPositionsRef.current.get(pinchState.pointerIds[1]);

        if (firstPoint === undefined || secondPoint === undefined) {
          preparePinchState();
          return;
        }

        event.preventDefault();

        const currentDistance = distance(firstPoint, secondPoint);
        const currentMidpoint = clientToLocal(midpoint(firstPoint, secondPoint));
        const scaleFactor = currentDistance / pinchState.startDistance;
        const nextScale = clamp(pinchState.startViewport.scale * scaleFactor, MIN_SCALE, MAX_SCALE);

        setViewport({
          x: currentMidpoint.x - pinchState.anchorWorld.x * nextScale,
          y: currentMidpoint.y - pinchState.anchorWorld.y * nextScale,
          scale: nextScale
        });

        movedDuringGestureRef.current = true;
        setIsDragging(true);
        tapCandidateRef.current = null;
        lastBackgroundTapRef.current = null;
        return;
      }

      const panState = panStateRef.current;
      if (panState === null || panState.pointerId !== event.pointerId) {
        return;
      }

      const pointer = pointerPositionsRef.current.get(event.pointerId);
      if (pointer === undefined) {
        return;
      }

      const deltaX = pointer.x - panState.startPoint.x;
      const deltaY = pointer.y - panState.startPoint.y;

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        event.preventDefault();
      }

      if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
        movedDuringGestureRef.current = true;
        setIsDragging(true);
        tapCandidateRef.current = null;
        lastBackgroundTapRef.current = null;
      }

      setViewport({
        x: panState.startViewport.x + deltaX,
        y: panState.startViewport.y + deltaY,
        scale: panState.startViewport.scale
      });
    },
    [clientToLocal, preparePinchState]
  );

  const releasePointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const releasedPoint = pointerPositionsRef.current.get(event.pointerId) ?? {
        x: event.clientX,
        y: event.clientY
      };
      const hadMotion = movedDuringGestureRef.current;
      const tapCandidate = tapCandidateRef.current;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      pointerPositionsRef.current.delete(event.pointerId);

      if (pointerPositionsRef.current.size === 0) {
        const localReleasePoint = clientToLocal(releasedPoint);

        if (
          !hadMotion &&
          tapCandidate !== null &&
          tapCandidate.pointerId === event.pointerId &&
          Date.now() - tapCandidate.startedAtMs <= TAP_MAX_DURATION_MS
        ) {
          suppressNodeClickUntilRef.current = Date.now() + SYNTHETIC_CLICK_SUPPRESSION_MS;
          openScene(tapCandidate.sceneId);
          tapCandidateRef.current = null;
          lastBackgroundTapRef.current = null;
        } else if (!hadMotion && tapCandidate === null && event.pointerType !== "mouse") {
          const now = Date.now();
          const previousTap = lastBackgroundTapRef.current;

          if (
            previousTap !== null &&
            now - previousTap.atMs <= DOUBLE_TAP_WINDOW_MS &&
            distance(previousTap.localPoint, localReleasePoint) <= DOUBLE_TAP_DISTANCE_THRESHOLD
          ) {
            zoomAtPoint(localReleasePoint, DOUBLE_TAP_SCALE_FACTOR);
            lastBackgroundTapRef.current = null;
          } else {
            lastBackgroundTapRef.current = {
              atMs: now,
              localPoint: localReleasePoint
            };
          }
        } else {
          lastBackgroundTapRef.current = null;
        }

        if (hadMotion) {
          clickBlockUntilRef.current = Date.now() + PAN_CLICK_GRACE_MS;
        }

        movedDuringGestureRef.current = false;
        panStateRef.current = null;
        pinchStateRef.current = null;
        tapCandidateRef.current = null;
        setIsDragging(false);
        return;
      }

      if (tapCandidateRef.current?.pointerId === event.pointerId) {
        tapCandidateRef.current = null;
      }

      if (pointerPositionsRef.current.size === 1) {
        const [remainingPointer] = Array.from(pointerPositionsRef.current.entries());
        preparePanState(remainingPointer[0]);
        pinchStateRef.current = null;
        lastBackgroundTapRef.current = null;
        return;
      }

      panStateRef.current = null;
      preparePinchState();
      lastBackgroundTapRef.current = null;
    },
    [clientToLocal, openScene, preparePanState, preparePinchState, zoomAtPoint]
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();

      const localPoint = clientToLocal({
        x: event.clientX,
        y: event.clientY
      });
      const scaleFactor = Math.exp(-event.deltaY * WHEEL_ZOOM_SENSITIVITY);

      zoomAtPoint(localPoint, scaleFactor);
    },
    [clientToLocal, zoomAtPoint]
  );

  const handleSceneClose = useCallback(() => {
    setActiveSceneId(null);
    onSceneClose?.();
  }, [onSceneClose]);

  const rootClassName = [
    className,
    "infinite-field",
    reducedMotion ? "motion-reduced" : "motion-enabled",
    activeScene !== null ? "overlay-open" : null
  ]
    .filter(Boolean)
    .join(" ");

  const minorGrid = Math.max(20, 44 * viewport.scale);
  const majorGrid = minorGrid * 4;
  const minorOffsetX = positiveModulo(viewport.x, minorGrid);
  const minorOffsetY = positiveModulo(viewport.y, minorGrid);
  const majorOffsetX = positiveModulo(viewport.x, majorGrid);
  const majorOffsetY = positiveModulo(viewport.y, majorGrid);

  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "560px",
    overflow: "hidden",
    touchAction: "none",
    userSelect: "none",
    cursor: isDragging ? "grabbing" : "grab",
    backgroundColor: "#050812",
    backgroundImage: [
      "linear-gradient(to right, rgba(126, 183, 255, 0.10) 1px, transparent 1px)",
      "linear-gradient(to bottom, rgba(126, 183, 255, 0.10) 1px, transparent 1px)",
      "linear-gradient(to right, rgba(133, 214, 255, 0.16) 1px, transparent 1px)",
      "linear-gradient(to bottom, rgba(133, 214, 255, 0.16) 1px, transparent 1px)",
      "radial-gradient(circle at 15% 12%, rgba(99, 210, 255, 0.18), transparent 40%)",
      "radial-gradient(circle at 80% 78%, rgba(255, 130, 210, 0.12), transparent 45%)",
      "linear-gradient(140deg, #050812, #04070e 32%, #071221)"
    ].join(","),
    backgroundSize: [
      `${minorGrid}px ${minorGrid}px`,
      `${minorGrid}px ${minorGrid}px`,
      `${majorGrid}px ${majorGrid}px`,
      `${majorGrid}px ${majorGrid}px`,
      "100% 100%",
      "100% 100%",
      "100% 100%"
    ].join(","),
    backgroundPosition: [
      `${minorOffsetX}px ${minorOffsetY}px`,
      `${minorOffsetX}px ${minorOffsetY}px`,
      `${majorOffsetX}px ${majorOffsetY}px`,
      `${majorOffsetX}px ${majorOffsetY}px`,
      "0 0",
      "0 0",
      "0 0"
    ].join(",")
  };

  const worldStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})`,
    transformOrigin: "0 0",
    willChange: "transform"
  };

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      data-gsap="canvas-root"
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-overlay-open={activeScene !== null ? "true" : "false"}
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onWheel={handleWheel}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div
        className="infinite-field__world glitch-space"
        data-gsap="canvas-world"
        data-scene-count={scenes.length}
        style={worldStyle}
      >
        <svg
          className="infinite-field__links glitch-traces"
          data-gsap="scene-links"
          viewBox={`0 0 ${sceneBounds.width} ${sceneBounds.height}`}
          width={sceneBounds.width}
          height={sceneBounds.height}
          style={{
            position: "absolute",
            left: sceneBounds.minX,
            top: sceneBounds.minY,
            pointerEvents: "none",
            overflow: "visible"
          }}
        >
          {sceneLinks.map(([source, target], index) => (
            <line
              key={`${source.id}-${target.id}-${index}`}
              x1={source.position.x - sceneBounds.minX}
              y1={source.position.y - sceneBounds.minY}
              x2={target.position.x - sceneBounds.minX}
              y2={target.position.y - sceneBounds.minY}
              stroke={hexToRgba(source.color, 0.34)}
              strokeWidth={1.4}
              strokeDasharray="10 10"
            />
          ))}
        </svg>

        {scenes.map((scene) => {
          const isActive = activeSceneId === scene.id;

          return (
            <button
              key={scene.id}
              type="button"
              className={`infinite-field__node glitch-node ${isActive ? "is-active" : ""}`}
              data-gsap="scene-node"
              data-scene-id={scene.id}
              data-scene-intensity={scene.intensity}
              onClick={(event) => {
                if (Date.now() < suppressNodeClickUntilRef.current) {
                  event.preventDefault();
                  return;
                }

                openScene(scene.id);
              }}
              style={{
                position: "absolute",
                left: scene.position.x,
                top: scene.position.y,
                transform: "translate(-50%, -50%)",
                width: "210px",
                border: `1px solid ${hexToRgba(scene.color, isActive ? 0.8 : 0.46)}`,
                borderRadius: "14px",
                padding: "0.58rem 0.72rem 0.7rem",
                background:
                  "linear-gradient(150deg, rgba(10, 18, 30, 0.94), rgba(12, 24, 39, 0.88) 38%, rgba(8, 14, 24, 0.9))",
                boxShadow: isActive
                  ? `0 0 0 1px ${hexToRgba(scene.color, 0.45)}, 0 18px 36px ${hexToRgba(scene.color, 0.26)}`
                  : `0 8px 28px ${hexToRgba(scene.color, 0.16)}`,
                color: "rgba(228, 246, 255, 0.96)",
                textAlign: "left",
                transition: reducedMotion ? "none" : "transform 180ms ease, box-shadow 180ms ease",
                cursor: "pointer"
              }}
            >
              <span
                className="infinite-field__node-signal glitch-scanline"
                data-gsap="scene-node-signal"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.38rem",
                  fontSize: "0.69rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: hexToRgba(scene.color, 0.95)
                }}
              >
                <span
                  style={{
                    width: "0.54rem",
                    height: "0.54rem",
                    borderRadius: "999px",
                    backgroundColor: scene.color,
                    boxShadow: `0 0 16px ${hexToRgba(scene.color, 0.85)}`
                  }}
                />
                {scene.epoch}
              </span>

              <strong
                className="infinite-field__node-title glitch-copy"
                style={{
                  display: "block",
                  marginTop: "0.38rem",
                  fontSize: "0.96rem",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2
                }}
              >
                {scene.title}
              </strong>

              <span
                className="infinite-field__node-subtitle"
                style={{
                  display: "block",
                  marginTop: "0.26rem",
                  color: "rgba(169, 212, 235, 0.92)",
                  fontSize: "0.79rem",
                  lineHeight: 1.32
                }}
              >
                {scene.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="infinite-field__hud glitch-hud"
        data-gsap="canvas-hud"
        style={{
          position: "absolute",
          left: "1rem",
          bottom: "1rem",
          border: "1px solid rgba(125, 194, 245, 0.28)",
          borderRadius: "10px",
          background: "rgba(5, 11, 20, 0.72)",
          color: "rgba(208, 235, 251, 0.9)",
          padding: "0.54rem 0.66rem",
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          display: "grid",
          gap: "0.2rem",
          pointerEvents: "none"
        }}
      >
        <span>Scale {viewport.scale.toFixed(2)}x</span>
        <span>
          Offset {Math.round(viewport.x)}, {Math.round(viewport.y)}
        </span>
        <span>Pan drag · pinch zoom · double tap</span>
      </div>

      <SceneOverlay
        isOpen={activeScene !== null}
        scene={activeScene}
        onClose={handleSceneClose}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
