import * as THREE from "three";
import { hashString, seededRandom } from "../utils";
import { CHUNK_SIZE } from "./constants";
import type { PlaneData } from "./types";

const MAX_PLANE_CACHE = 256;
const planeCache = new Map<string, PlaneData[]>();

const touchPlaneCache = (key: string) => {
  const v = planeCache.get(key);
  if (!v) return;
  planeCache.delete(key);
  planeCache.set(key, v);
};

const evictPlaneCache = () => {
  while (planeCache.size > MAX_PLANE_CACHE) {
    const firstKey = planeCache.keys().next().value as string | undefined;
    if (!firstKey) break;
    planeCache.delete(firstKey);
  }
};

export const getChunkUpdateThrottleMs = (
  isZooming: boolean,
  zoomSpeed: number
): number => {
  if (zoomSpeed > 1.0) return 500;
  if (isZooming) return 400;
  return 100;
};

export const getMediaDimensions = (
  media: HTMLImageElement | undefined
) => {
  const width =
    media instanceof HTMLImageElement
      ? media.naturalWidth || media.width
      : undefined;
  const height =
    media instanceof HTMLImageElement
      ? media.naturalHeight || media.height
      : undefined;
  return { width, height };
};

export const generateChunkPlanes = (
  cx: number,
  cy: number,
  cz: number
): PlaneData[] => {
  const planes: PlaneData[] = [];
  const seed = hashString(`${cx},${cy},${cz}`);
  const placed: Array<{ x: number; y: number; z: number; size: number }> = [];
  const chunkInset = CHUNK_SIZE * 0.15;
  const minCenterDistance = CHUNK_SIZE * 0.35;
  const targetCount = 3;
  const maxAttemptsPerPlane = 20;

  // Controlled sparse placement per chunk with anti-overlap spacing
  for (let index = 0; index < targetCount; index++) {
    const s = seed + index * 1000;
    const r = (n: number) => seededRandom(s + n);

    let selectedPosition: { x: number; y: number; z: number } | null = null;
    let size = 10 + r(4) * 7;

    for (let attempt = 0; attempt < maxAttemptsPerPlane; attempt++) {
      const candidate = {
        x: cx * CHUNK_SIZE + chunkInset + r(attempt + 0) * (CHUNK_SIZE - chunkInset * 2),
        y: cy * CHUNK_SIZE + chunkInset + r(attempt + 1) * (CHUNK_SIZE - chunkInset * 2),
        z: cz * CHUNK_SIZE + chunkInset + r(attempt + 2) * (CHUNK_SIZE - chunkInset * 2),
      };

      const hasCollision = placed.some((existing) => {
        const dx = existing.x - candidate.x;
        const dy = existing.y - candidate.y;
        const dz = existing.z - candidate.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const spacing = minCenterDistance + (existing.size + size) * 0.35;
        return dist < spacing;
      });

      if (!hasCollision) {
        selectedPosition = candidate;
        break;
      }

      size = Math.max(8, size * 0.95);
    }

    if (!selectedPosition) {
      continue;
    }

    placed.push({
      x: selectedPosition.x,
      y: selectedPosition.y,
      z: selectedPosition.z,
      size,
    });

    planes.push({
      id: `${cx}-${cy}-${cz}-${index}`,
      position: new THREE.Vector3(selectedPosition.x, selectedPosition.y, selectedPosition.z),
      scale: new THREE.Vector3(size, size, 1),
      mediaIndex: Math.floor(r(5) * 1_000_000),
    });
  }

  return planes;
};

export const generateChunkPlanesCached = (
  cx: number,
  cy: number,
  cz: number
): PlaneData[] => {
  const key = `${cx},${cy},${cz}`;
  const cached = planeCache.get(key);

  if (cached) {
    touchPlaneCache(key);
    return cached;
  }

  const planes = generateChunkPlanes(cx, cy, cz);
  planeCache.set(key, planes);
  evictPlaneCache();
  return planes;
};

export const shouldThrottleUpdate = (
  lastUpdateTime: number,
  throttleMs: number,
  currentTime: number
): boolean => {
  return currentTime - lastUpdateTime >= throttleMs;
};
