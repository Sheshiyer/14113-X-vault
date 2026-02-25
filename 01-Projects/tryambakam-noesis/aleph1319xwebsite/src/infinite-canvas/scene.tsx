import {
  KeyboardControls,
  Stats,
  useKeyboardControls,
  useProgress,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as React from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";
import { clamp, lerp } from "../utils";
import {
  CHUNK_FADE_MARGIN,
  CHUNK_OFFSETS,
  CHUNK_SIZE,
  DEPTH_FADE_END,
  DEPTH_FADE_START,
  INITIAL_CAMERA_Z,
  INVIS_THRESHOLD,
  KEYBOARD_SPEED,
  MAX_VELOCITY,
  RENDER_DISTANCE,
  VELOCITY_DECAY,
  VELOCITY_LERP,
} from "./constants";
import styles from "./style.module.css";
import { HeroTitle } from "./HeroTitle";
import { getTexture } from "./texture-manager";
import type {
  ChunkData,
  InfiniteCanvasProps,
  InteractionPoint,
  MediaItem,
  PlaneData,
} from "./types";
import {
  generateChunkPlanesCached,
  getChunkUpdateThrottleMs,
  shouldThrottleUpdate,
} from "./utils";

/* ── Shared geometry (single allocation) ── */
const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1);

/* ── Keyboard map ── */
const KEYBOARD_MAP = [
  { name: "forward", keys: ["w", "W", "ArrowUp"] },
  { name: "backward", keys: ["s", "S", "ArrowDown"] },
  { name: "left", keys: ["a", "A", "ArrowLeft"] },
  { name: "right", keys: ["d", "D", "ArrowRight"] },
  { name: "up", keys: ["e", "E"] },
  { name: "down", keys: ["q", "Q"] },
];

type KeyboardKeys = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

/* ── Touch helpers ── */
const getTouchDistance = (touches: Touch[]) => {
  if (touches.length < 2) return 0;
  const [t1, t2] = touches;
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

/* ── Camera grid state ── */
type CameraGridState = {
  cx: number;
  cy: number;
  cz: number;
  camZ: number;
};

/* ─────────────────────────────────────────────
   MediaPlane — single textured quad with
   distance-based opacity / culling
   ───────────────────────────────────────────── */
function MediaPlane({
  planeId,
  position,
  scale,
  media,
  mediaIndex,
  chunkCx,
  chunkCy,
  chunkCz,
  cameraGridRef,
  hoveredPlaneId,
  trailPlaneId,
  trailEnergy,
  interactionEnergy,
  onHoverPlaneChange,
  onInteraction,
  onMediaClick,
}: {
  planeId: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  media: MediaItem;
  mediaIndex: number;
  chunkCx: number;
  chunkCy: number;
  chunkCz: number;
  cameraGridRef: React.RefObject<CameraGridState>;
  hoveredPlaneId: string | null;
  trailPlaneId: string | null;
  trailEnergy: number;
  interactionEnergy: number;
  onHoverPlaneChange: (planeId: string | null) => void;
  onInteraction: (point: InteractionPoint, boost: number) => void;
  onMediaClick?: (mediaIndex: number) => void;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const materialRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const groupRef = React.useRef<THREE.Group>(null);
  const ringMeshRef = React.useRef<THREE.Mesh>(null);
  const ringGeoRef = React.useRef<THREE.RingGeometry>(null);
  const localState = React.useRef({
    opacity: 0,
    frame: 0,
    ready: false,
    hoverAlpha: 0,
    liftAlpha: 0,
  });
  const isHovered = hoveredPlaneId === planeId;
  const isTrailPlane = trailPlaneId === planeId;

  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  const holdState = React.useRef<{
    isDown: boolean;
    progress: number;
    camera: THREE.PerspectiveCamera | null;
    attachPoint: THREE.Vector3 | null;
    downTime: number;
    downPos: { x: number; y: number };
  }>({
    isDown: false,
    progress: 0,
    camera: null,
    attachPoint: null,
    downTime: 0,
    downPos: { x: 0, y: 0 }
  });

  const triggerFocalZoom = React.useCallback((camera: THREE.PerspectiveCamera) => {
    if (onMediaClick) {
      const uiElements = document.querySelectorAll('[class*="hero-title_container"], [class*="experience-panel__overlay"]');
      gsap.to(uiElements, { opacity: 0, duration: 0.4 });

      gsap.to(camera, {
        fov: 15,
        duration: 0.7,
        ease: "power2.in",
        onUpdate: () => camera.updateProjectionMatrix(),
        onComplete: () => {
          onMediaClick(mediaIndex);
          gsap.set(camera, { fov: 75 });
          camera.updateProjectionMatrix();
        }
      });
    }
  }, [onMediaClick, mediaIndex]);

  /* Display scale from media aspect ratio and importance */
  const displayScale = React.useMemo(() => {
    const importance = media.importance ?? 1;
    if (media.width && media.height) {
      const aspect = media.width / media.height;
      if (aspect >= 1) {
        return new THREE.Vector3(scale.x * importance, (scale.x / aspect) * importance, 1);
      }
      return new THREE.Vector3(scale.y * aspect * importance, scale.y * importance, 1);
    }
    return new THREE.Vector3(scale.x * importance, scale.y * importance, scale.z);
  }, [media.width, media.height, scale, media.importance]);

  /* Per-frame opacity / visibility update */
  useFrame((_, delta) => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    const state = localState.current;

    if (!material || !mesh) return;

    state.frame = (state.frame + 1) & 1;

    if (holdState.current.isDown && holdState.current.camera) {
      holdState.current.progress += delta / 4.0; // 4 seconds hold
      (window as any).NOESIS_HOLD_PROGRESS = holdState.current.progress;

      if (holdState.current.progress >= 1.0) {
        holdState.current.isDown = false;
        holdState.current.progress = 0;
        (window as any).NOESIS_HOLD_PROGRESS = 0;
        triggerFocalZoom(holdState.current.camera);
      }
    } else if (holdState.current.progress > 0) {
      holdState.current.progress = Math.max(0, holdState.current.progress - delta * 2.5); // Fast decay
      (window as any).NOESIS_HOLD_PROGRESS = holdState.current.progress;
    }

    if (ringGeoRef.current && ringMeshRef.current) {
      const p = holdState.current.progress;
      if (p > 0.01) {
        if (holdState.current.attachPoint && groupRef.current) {
          ringMeshRef.current.position.copy(holdState.current.attachPoint);
          ringMeshRef.current.position.z = 0.5; // slight offset forward
        }

        // Fixed visible size ring
        const outer = 2.4;
        const inner = 2.1;
        ringGeoRef.current.dispose();
        ringGeoRef.current.copy(new THREE.RingGeometry(inner, outer, 64, 1, Math.PI / 2, p * Math.PI * 2));
        ringMeshRef.current.visible = true;
      } else {
        ringMeshRef.current.visible = false;
      }
    }

    if (state.opacity < INVIS_THRESHOLD && !mesh.visible && state.frame === 0) {
      return;
    }

    const cam = cameraGridRef.current;
    const dist = Math.max(
      Math.abs(chunkCx - cam.cx),
      Math.abs(chunkCy - cam.cy),
      Math.abs(chunkCz - cam.cz)
    );
    const absDepth = Math.abs(position.z - cam.camZ);

    if (absDepth > DEPTH_FADE_END + 50) {
      state.opacity = 0;
      material.opacity = 0;
      material.depthWrite = false;
      mesh.visible = false;
      return;
    }

    const gridFade =
      dist <= RENDER_DISTANCE
        ? 1
        : Math.max(
          0,
          1 -
          (dist - RENDER_DISTANCE) /
          Math.max(CHUNK_FADE_MARGIN, 0.0001)
        );

    const depthFade =
      absDepth <= DEPTH_FADE_START
        ? 1
        : Math.max(
          0,
          1 -
          (absDepth - DEPTH_FADE_START) /
          Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 0.0001)
        );

    const target = Math.min(gridFade, depthFade * depthFade);
    state.hoverAlpha = lerp(state.hoverAlpha, isHovered ? 1 : 0, isHovered ? 0.2 : 0.08);
    state.liftAlpha = lerp(state.liftAlpha, isHovered ? 1 : 0, isHovered ? 0.24 : 0.09);

    const clarityBase = 0.28 + interactionEnergy * 0.72;
    const trailBoost = isTrailPlane ? trailEnergy * 0.2 : 0;
    const hoverBoost = state.hoverAlpha * 0.4 + trailBoost;
    const clarity = clamp(clarityBase + hoverBoost, 0.2, 1.18);

    const globalHold = (window as any).NOESIS_HOLD_PROGRESS || 0;
    const isHeld = holdState.current.isDown || holdState.current.progress > 0;
    const focusMultiplier = isHeld ? 1.0 + globalHold * 0.2 : Math.max(0.01, 1.0 - globalHold * 0.95);
    const revealTarget = target * clarity * focusMultiplier;

    state.opacity =
      target < INVIS_THRESHOLD && state.opacity < INVIS_THRESHOLD && !isHeld
        ? 0
        : lerp(state.opacity, revealTarget, 0.18);

    const minVisibleOpacity = target > 0.035 ? 0.03 : 0;
    const isFullyOpaque = state.opacity > 0.99;
    material.opacity = isFullyOpaque ? 1 : Math.max(minVisibleOpacity, state.opacity);
    material.depthWrite = isFullyOpaque;
    mesh.visible = target > 0.025;

    if (mesh.visible) {
      const trailScaleBoost = isTrailPlane ? trailEnergy * 0.03 : 0;
      const scaleBoost = 1 + interactionEnergy * 0.01 + state.hoverAlpha * 0.07 + trailScaleBoost;
      const holdLift = isHeld ? holdState.current.progress * 14.0 : 0;
      const lift = 2.6 * state.liftAlpha + (isTrailPlane ? trailEnergy * 0.9 : 0) + holdLift;

      if (groupRef.current) {
        groupRef.current.position.set(position.x, position.y, position.z + lift);
      } else {
        mesh.position.set(position.x, position.y, position.z + lift);
      }
      mesh.scale.set(
        displayScale.x * scaleBoost,
        displayScale.y * scaleBoost,
        displayScale.z
      );

      mesh.renderOrder = state.liftAlpha > 0.01 ? 30 : 0;
      material.depthTest = state.liftAlpha < 0.15;
      material.depthWrite = isFullyOpaque && state.liftAlpha < 0.15;
    }
  });

  /* (Display scale moved above useFrame) */

  /* Load texture with onLoad callback */
  React.useEffect(() => {
    const state = localState.current;
    state.ready = false;
    state.opacity = 0;
    setIsReady(false);

    const material = materialRef.current;
    if (material) {
      material.opacity = 0;
      material.depthWrite = false;
      material.map = null;
    }

    const tex = getTexture(media, () => {
      state.ready = true;
      setIsReady(true);
    });

    setTexture(tex);
  }, [media]);

  /* Apply texture when ready */
  React.useEffect(() => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    const state = localState.current;

    if (!material || !mesh || !texture || !isReady || !state.ready) return;

    material.map = texture;
    material.opacity = state.opacity;
    material.depthWrite = state.opacity >= 1;
    mesh.scale.copy(displayScale);
  }, [displayScale, texture, isReady]);

  const handlePointerDown = React.useCallback((e: any) => {
    e.stopPropagation();
    holdState.current.isDown = true;
    holdState.current.camera = e.camera;
    holdState.current.downTime = Date.now();
    holdState.current.downPos = { x: e.clientX, y: e.clientY };

    if (groupRef.current && e.point) {
      // Convert world intersection point to local space inside the group
      holdState.current.attachPoint = groupRef.current.worldToLocal(e.point.clone());
    }
  }, []);

  const handlePointerUp = React.useCallback((e?: any) => {
    if (e) e.stopPropagation();
    if (!holdState.current.isDown) return;
    holdState.current.isDown = false;

    if (e && e.clientX !== undefined) {
      const elapsed = Date.now() - holdState.current.downTime;
      const dx = e.clientX - holdState.current.downPos.x;
      const dy = e.clientY - holdState.current.downPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If it was a quick tap with minimal dragging, register it as a click
      if (elapsed < 400 && dist < 15) {
        onMediaClick?.(mediaIndex);
      }
    }
  }, [onMediaClick, mediaIndex]);

  const emitInteraction = React.useCallback(
    (point: { x: number; y: number }, boost: number) => {
      onInteraction(point, boost);
    },
    [onInteraction]
  );

  if (!texture || !isReady) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={(event) => {
        onHoverPlaneChange(planeId);
        emitInteraction({ x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }, 0.2);
        document.body.style.cursor = "pointer";
      }}
      onPointerMove={(event) => {
        emitInteraction({ x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }, 0.08);
      }}
      onPointerLeave={(event) => {
        onHoverPlaneChange(null);
        handlePointerUp(event);
        document.body.style.cursor = "auto";
      }}
      onPointerDown={(event) => {
        handlePointerDown(event);
        emitInteraction({ x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }, 0.26);
      }}
      onPointerUp={(event) => {
        handlePointerUp(event);
      }}
    >
      <mesh
        ref={meshRef}
        scale={displayScale}
        visible={false}
        geometry={PLANE_GEOMETRY}
      >
        <meshBasicMaterial
          ref={materialRef}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isReady && (
        <mesh ref={ringMeshRef} position={[0, 0, 0.05]} visible={false}>
          <ringGeometry ref={ringGeoRef} args={[0.2, 0.23, 64, 1, Math.PI / 2, 0]} />
          <meshBasicMaterial color="var(--color-layout-accent, #c4873b)" transparent opacity={0.6} depthTest={false} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Chunk — generates planes within a chunk,
   renders MediaPlane for each
   ───────────────────────────────────────────── */
function Chunk({
  cx,
  cy,
  cz,
  media,
  cameraGridRef,
  hoveredPlaneId,
  trailPlaneId,
  trailEnergy,
  interactionEnergy,
  onHoverPlaneChange,
  onInteraction,
  onMediaClick,
}: {
  cx: number;
  cy: number;
  cz: number;
  media: MediaItem[];
  cameraGridRef: React.RefObject<CameraGridState>;
  hoveredPlaneId: string | null;
  trailPlaneId: string | null;
  trailEnergy: number;
  interactionEnergy: number;
  onHoverPlaneChange: (planeId: string | null) => void;
  onInteraction: (point: InteractionPoint, boost: number) => void;
  onMediaClick?: (mediaIndex: number) => void;
}) {
  const [planes, setPlanes] = React.useState<PlaneData[] | null>(null);

  React.useEffect(() => {
    let canceled = false;

    const run = () => {
      if (!canceled) setPlanes(generateChunkPlanesCached(cx, cy, cz));
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(run, { timeout: 100 });
      return () => {
        canceled = true;
        cancelIdleCallback(id);
      };
    }

    const id = setTimeout(run, 0);
    return () => {
      canceled = true;
      clearTimeout(id);
    };
  }, [cx, cy, cz]);

  if (!planes) return null;

  return (
    <group>
      {planes.map((plane) => (
        <MediaPlane
          key={plane.id}
          planeId={plane.id}
          position={plane.position}
          scale={plane.scale}
          media={media[plane.mediaIndex % media.length]}
          mediaIndex={plane.mediaIndex % media.length}
          chunkCx={cx}
          chunkCy={cy}
          chunkCz={cz}
          cameraGridRef={cameraGridRef}
          hoveredPlaneId={hoveredPlaneId}
          trailPlaneId={trailPlaneId}
          trailEnergy={trailEnergy}
          interactionEnergy={interactionEnergy}
          onHoverPlaneChange={onHoverPlaneChange}
          onInteraction={onInteraction}
          onMediaClick={onMediaClick}
        />
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Controller state
   ───────────────────────────────────────────── */
type ControllerState = {
  velocity: { x: number; y: number; z: number };
  targetVel: { x: number; y: number; z: number };
  basePos: { x: number; y: number; z: number };
  drift: { x: number; y: number };
  mouse: { x: number; y: number };
  lastMouse: { x: number; y: number };
  scrollAccum: number;
  isDragging: boolean;
  lastTouches: Touch[];
  lastTouchDist: number;
  lastChunkKey: string;
  lastChunkUpdate: number;
  pendingChunk: { cx: number; cy: number; cz: number } | null;
  pointerDown: boolean;
  pointerDownPos: { x: number; y: number };
};

const createInitialState = (camZ: number): ControllerState => ({
  velocity: { x: 0, y: 0, z: 0 },
  targetVel: { x: 0, y: 0, z: 0 },
  basePos: { x: 0, y: 0, z: camZ },
  drift: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 },
  lastMouse: { x: 0, y: 0 },
  scrollAccum: 0,
  isDragging: false,
  lastTouches: [],
  lastTouchDist: 0,
  lastChunkKey: "",
  lastChunkUpdate: 0,
  pendingChunk: null,
  pointerDown: false,
  pointerDownPos: { x: 0, y: 0 },
});

/* ─────────────────────────────────────────────
   SceneController — manages camera, input,
   chunk lifecycle, and progress
   ───────────────────────────────────────────── */
function SceneController({
  media,
  onTextureProgress,
  onMediaClick,
  hoveredPlaneId,
  trailPlaneId,
  trailEnergy,
  interactionEnergy,
  onHoverPlaneChange,
  onInteraction,
  useCustomCursor,
  onDragStateChange,
}: {
  media: MediaItem[];
  onTextureProgress?: (progress: number) => void;
  onMediaClick?: (mediaIndex: number) => void;
  hoveredPlaneId: string | null;
  trailPlaneId: string | null;
  trailEnergy: number;
  interactionEnergy: number;
  onHoverPlaneChange: (planeId: string | null) => void;
  onInteraction: (point: InteractionPoint, boost: number) => void;
  useCustomCursor: boolean;
  onDragStateChange: (isDragging: boolean) => void;
}) {
  const { camera, gl } = useThree();

  // Reset camera FOV in case we navigated back from a focal zoom
  React.useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 75;
      camera.updateProjectionMatrix();
    }
    // Also reset UI elements that might have been faded
    gsap.set('[class*="hero-title_container"], [class*="experience-panel__overlay"]', { clearProps: "opacity" });
  }, [camera]);
  const isTouchDevice = useIsTouchDevice();
  const [, getKeys] = useKeyboardControls<keyof KeyboardKeys>();

  const state = React.useRef<ControllerState>(
    createInitialState(INITIAL_CAMERA_Z)
  );
  const cameraGridRef = React.useRef<CameraGridState>({
    cx: 0,
    cy: 0,
    cz: 0,
    camZ: camera.position.z,
  });

  const [chunks, setChunks] = React.useState<ChunkData[]>([]);

  const { progress } = useProgress();
  const maxProgress = React.useRef(0);

  /* Track loading progress */
  React.useEffect(() => {
    const rounded = Math.round(progress);
    if (rounded > maxProgress.current) {
      maxProgress.current = rounded;
      onTextureProgress?.(rounded);
    }
  }, [progress, onTextureProgress]);

  /* Attach pointer/touch/wheel listeners */
  React.useEffect(() => {
    const canvas = gl.domElement;
    const s = state.current;
    if (useCustomCursor) {
      canvas.style.cursor = "none";
    } else {
      canvas.style.cursor = "grab";
    }

    const setCursor = (cursor: string) => {
      if (useCustomCursor) return;
      canvas.style.cursor = cursor;
    };

    const onMouseDown = (e: MouseEvent) => {
      s.pointerDown = true;
      s.pointerDownPos = { x: e.clientX, y: e.clientY };
      s.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      s.pointerDown = false;
      s.isDragging = false;
      onDragStateChange(false);
      setCursor("grab");
    };

    const onMouseLeave = () => {
      s.mouse = { x: 0, y: 0 };
      s.pointerDown = false;
      s.isDragging = false;
      onDragStateChange(false);
      setCursor("grab");
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      onInteraction({ x: nx, y: ny }, 0.035);

      s.mouse = {
        x: nx * 2 - 1,
        y: -ny * 2 + 1,
      };

      if (s.isDragging) {
        s.targetVel.x -= (e.clientX - s.lastMouse.x) * 0.025;
        s.targetVel.y += (e.clientY - s.lastMouse.y) * 0.025;
        s.lastMouse = { x: e.clientX, y: e.clientY };
      } else if (s.pointerDown && !hoveredPlaneId) {
        const dx = e.clientX - s.pointerDownPos.x;
        const dy = e.clientY - s.pointerDownPos.y;
        const dragThreshold = 5;
        if (dx * dx + dy * dy > dragThreshold * dragThreshold) {
          s.isDragging = true;
          onDragStateChange(true);
          setCursor("grabbing");
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.scrollAccum += e.deltaY * 0.006;
      onInteraction({ x: 0.5, y: 0.5 }, 0.05);
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (hoveredPlaneId) {
        if (e.touches[0]) {
          onInteraction(
            {
              x: e.touches[0].clientX / window.innerWidth,
              y: e.touches[0].clientY / window.innerHeight,
            },
            0.22
          );
        }
        return;
      }
      const firstTouch = e.touches[0];
      if (firstTouch) {
        s.pointerDown = true;
        s.pointerDownPos = { x: firstTouch.clientX, y: firstTouch.clientY };
      }
      s.lastTouches = Array.from(e.touches) as Touch[];
      s.lastTouchDist = getTouchDistance(s.lastTouches);
      if (s.lastTouches[0]) {
        onInteraction(
          {
            x: s.lastTouches[0].clientX / window.innerWidth,
            y: s.lastTouches[0].clientY / window.innerHeight,
          },
          0.22
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touches = Array.from(e.touches) as Touch[];

      if (touches[0]) {
        onInteraction(
          {
            x: touches[0].clientX / window.innerWidth,
            y: touches[0].clientY / window.innerHeight,
          },
          0.12
        );
      }

      if (touches.length === 1 && s.lastTouches.length >= 1) {
        const [touch] = touches;
        const [last] = s.lastTouches;
        if (touch && last) {
          if (!s.isDragging && s.pointerDown) {
            const dx = touch.clientX - s.pointerDownPos.x;
            const dy = touch.clientY - s.pointerDownPos.y;
            const dragThreshold = 8;
            if (dx * dx + dy * dy > dragThreshold * dragThreshold) {
              s.isDragging = true;
              onDragStateChange(true);
              setCursor("grabbing");
            }
          }

          s.targetVel.x -= (touch.clientX - last.clientX) * 0.02;
          s.targetVel.y += (touch.clientY - last.clientY) * 0.02;
        }
      } else if (touches.length === 2 && s.lastTouchDist > 0) {
        const dist = getTouchDistance(touches);
        s.scrollAccum += (s.lastTouchDist - dist) * 0.006;
        s.lastTouchDist = dist;
      }

      s.lastTouches = touches;
    };

    const onTouchEnd = (e: TouchEvent) => {
      s.pointerDown = false;
      s.isDragging = false;
      s.lastTouches = Array.from(e.touches) as Touch[];
      s.lastTouchDist = getTouchDistance(s.lastTouches);
      onDragStateChange(false);
      setCursor("grab");
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [gl, hoveredPlaneId, onInteraction, onDragStateChange, useCustomCursor]);

  /* Per-frame camera + physics + chunk management */
  useFrame(() => {
    const s = state.current;
    const now = performance.now();

    /* Keyboard input */
    const { forward, backward, left, right, up, down } = getKeys();
    if (forward) s.targetVel.z -= KEYBOARD_SPEED;
    if (backward) s.targetVel.z += KEYBOARD_SPEED;
    if (left) s.targetVel.x -= KEYBOARD_SPEED;
    if (right) s.targetVel.x += KEYBOARD_SPEED;
    if (down) s.targetVel.y -= KEYBOARD_SPEED;
    if (up) s.targetVel.y += KEYBOARD_SPEED;

    const isZooming = Math.abs(s.velocity.z) > 0.05;

    /* Process scroll accumulator → zoom velocity */
    const scrollForce = s.scrollAccum * 0.1;
    s.scrollAccum *= 0.85;
    s.targetVel.z += scrollForce;

    /* Clamp target velocity */
    s.targetVel.x = clamp(s.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY);
    s.targetVel.y = clamp(s.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY);
    s.targetVel.z = clamp(s.targetVel.z, -MAX_VELOCITY, MAX_VELOCITY);

    /* Lerp velocity toward target */
    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP);
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP);
    s.velocity.z = lerp(s.velocity.z, s.targetVel.z, VELOCITY_LERP);

    /* Apply velocity to position — no Z clamp, infinite depth */
    s.basePos.x += s.velocity.x;
    s.basePos.y += s.velocity.y;
    s.basePos.z += s.velocity.z;

    /* Mouse parallax drift */
    const zoomFactor = clamp(s.basePos.z / 50, 0.3, 2.0);
    const driftAmount = 8.0 * zoomFactor;
    const driftLerp = isZooming ? 0.2 : 0.12;

    if (s.isDragging) {
      // Freeze drift during drag — keep it at current value
    } else if (isTouchDevice) {
      s.drift.x = lerp(s.drift.x, 0, driftLerp);
      s.drift.y = lerp(s.drift.y, 0, driftLerp);
    } else {
      s.drift.x = lerp(s.drift.x, s.mouse.x * driftAmount, driftLerp);
      s.drift.y = lerp(s.drift.y, s.mouse.y * driftAmount, driftLerp);
    }

    camera.position.set(
      s.basePos.x + s.drift.x,
      s.basePos.y + s.drift.y,
      s.basePos.z
    );

    /* Velocity decay */
    s.targetVel.x *= VELOCITY_DECAY;
    s.targetVel.y *= VELOCITY_DECAY;
    s.targetVel.z *= VELOCITY_DECAY;

    /* Calculate current chunk grid position */
    const cx = Math.floor(s.basePos.x / CHUNK_SIZE);
    const cy = Math.floor(s.basePos.y / CHUNK_SIZE);
    const cz = Math.floor(s.basePos.z / CHUNK_SIZE);

    cameraGridRef.current = { cx, cy, cz, camZ: s.basePos.z };

    const key = `${cx},${cy},${cz}`;
    if (key !== s.lastChunkKey) {
      s.pendingChunk = { cx, cy, cz };
      s.lastChunkKey = key;
    }

    /* Throttled chunk updates */
    const throttleMs = getChunkUpdateThrottleMs(
      isZooming,
      Math.abs(s.velocity.z)
    );

    if (
      s.pendingChunk &&
      shouldThrottleUpdate(s.lastChunkUpdate, throttleMs, now)
    ) {
      const { cx: ucx, cy: ucy, cz: ucz } = s.pendingChunk;
      s.pendingChunk = null;
      s.lastChunkUpdate = now;

      setChunks(
        CHUNK_OFFSETS.map((o) => ({
          key: `${ucx + o.dx},${ucy + o.dy},${ucz + o.dz}`,
          cx: ucx + o.dx,
          cy: ucy + o.dy,
          cz: ucz + o.dz,
        }))
      );
    }
  });

  /* Initial chunk setup */
  React.useEffect(() => {
    const s = state.current;
    s.basePos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };

    setChunks(
      CHUNK_OFFSETS.map((o) => ({
        key: `${o.dx},${o.dy},${o.dz}`,
        cx: o.dx,
        cy: o.dy,
        cz: o.dz,
      }))
    );
  }, [camera]);

  return (
    <>
      {chunks.map((chunk) => (
        <Chunk
          key={chunk.key}
          cx={chunk.cx}
          cy={chunk.cy}
          cz={chunk.cz}
          media={media}
          cameraGridRef={cameraGridRef}
          hoveredPlaneId={hoveredPlaneId}
          trailPlaneId={trailPlaneId}
          trailEnergy={trailEnergy}
          interactionEnergy={interactionEnergy}
          onHoverPlaneChange={onHoverPlaneChange}
          onInteraction={onInteraction}
          onMediaClick={onMediaClick}
        />
      ))}
    </>
  );
}

function BrandCursor({
  pointer,
  mode,
}: {
  pointer: InteractionPoint;
  mode: "idle" | "focus" | "drag";
}) {
  return (
    <div
      className={`${styles.brandCursor} ${styles[`cursor_${mode}`]}`}
      style={{
        left: `${pointer.x * 100}%`,
        top: `${pointer.y * 100}%`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 72 72" className={styles.cursorSvg}>
        <circle cx="36" cy="36" r="25" className={styles.cursorRing} style={{ opacity: 0.15 }} />
        <circle
          cx="36" cy="36" r="25"
          className={styles.cursorRing}
          style={{ strokeDasharray: "157", strokeDashoffset: "157", stroke: "var(--color-layout-accent, #c4873b)" }}
        />
        <path d="M22 36h28" className={styles.cursorFilament} />
        <path d="M26 28l20 16" className={styles.cursorFilament} />
        <path d="M26 44l20-16" className={styles.cursorFilament} />
        <ellipse cx="36" cy="36" rx="15" ry="10" className={styles.cursorEye} />
        <circle cx="36" cy="36" r="4.2" className={styles.cursorPupil} />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   InfiniteCanvasScene — top-level component
   wrapping R3F Canvas with fog, controls,
   and optional HUD
   ───────────────────────────────────────────── */
export function InfiniteCanvasScene({
  media,
  onTextureProgress,
  onMediaClick,
  showFps = false,
  showControls = false,
  cameraFov = 60,
  cameraNear = 1,
  cameraFar = 500,
  fogNear = 120,
  fogFar = 320,
  backgroundColor = "#ffffff",
  fogColor = "#ffffff",
}: InfiniteCanvasProps) {
  const isTouchDevice = useIsTouchDevice();
  const useCustomCursor = !isTouchDevice;
  const [interactionEnergy, setInteractionEnergy] = React.useState(0);
  const [pointer, setPointer] = React.useState<InteractionPoint>({ x: 0.5, y: 0.5 });
  const [hoveredPlaneId, setHoveredPlaneId] = React.useState<string | null>(null);
  const [trailPlaneId, setTrailPlaneId] = React.useState<string | null>(null);
  const [trailEnergy, setTrailEnergy] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      setInteractionEnergy((previous) => {
        const next = previous * 0.982;
        return next < 0.01 ? 0 : next;
      });
      setTrailEnergy((previous) => {
        const next = previous * 0.9;
        return next < 0.02 ? 0 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleInteraction = React.useCallback((point: InteractionPoint, boost: number) => {
    setPointer(point);
    setInteractionEnergy((previous) => clamp(previous + boost, 0, 1));
  }, []);

  const handleHoverPlaneChange = React.useCallback((nextPlaneId: string | null) => {
    setHoveredPlaneId((previous) => {
      if (previous && previous !== nextPlaneId) {
        setTrailPlaneId(previous);
        setTrailEnergy(1);
      }
      return nextPlaneId;
    });
  }, []);

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    isTouchDevice ? 1.25 : 1.5
  );

  if (!media.length) return null;

  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <div className={`${styles.container} ${useCustomCursor ? styles.customCursorScope : ""}`}>
        <div
          className={styles.atmosphereOverlay}
          style={
            {
              opacity: clamp(0.26, 0.84 - interactionEnergy * 0.56, 0.84),
              "--reveal-x": `${pointer.x * 100}%`,
              "--reveal-y": `${pointer.y * 100}%`,
              "--reveal-radius": `${220 + interactionEnergy * 320}px`,
            } as React.CSSProperties
          }
        />
        <Canvas
          camera={{
            position: [0, 0, INITIAL_CAMERA_Z],
            fov: cameraFov,
            near: cameraNear,
            far: cameraFar,
          }}
          dpr={dpr}
          flat
          gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
          className={styles.canvas}
        >
          <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
          <SceneController
            media={media}
            onTextureProgress={onTextureProgress}
            onMediaClick={onMediaClick}
            hoveredPlaneId={hoveredPlaneId}
            trailPlaneId={trailPlaneId}
            trailEnergy={trailEnergy}
            interactionEnergy={interactionEnergy}
            onHoverPlaneChange={handleHoverPlaneChange}
            onInteraction={handleInteraction}
            useCustomCursor={useCustomCursor}
            onDragStateChange={setIsDragging}
          />
          <EffectComposer multisampling={0}>
            <Noise opacity={0.12} />
            <Vignette eskil={false} offset={0.1} darkness={0.9} />
          </EffectComposer>
          {showFps && <Stats className={styles.stats} />}
        </Canvas>

        <HeroTitle />

        {useCustomCursor && (
          <BrandCursor
            pointer={pointer}
            mode={isDragging ? "drag" : hoveredPlaneId ? "focus" : "idle"}
          />
        )}

        {showControls && (
          <div className={styles.controlsPanel}>
            {isTouchDevice ? (
              <>
                <b>Drag</b> Pan · <b>Pinch</b> Zoom
              </>
            ) : (
              <>
                <b>WASD</b> Move · <b>QE</b> Up/Down · <b>Scroll/Space</b>{" "}
                Zoom
              </>
            )}
          </div>
        )}
      </div>
    </KeyboardControls>
  );
}
