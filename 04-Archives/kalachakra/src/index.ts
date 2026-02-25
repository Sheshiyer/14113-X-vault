/**
 * Kalachakra - The Fractal Time Calendar
 * Main exports
 */

// Types
export * from './types/index.js';

// Core Engine
export { KalachakraEngine, kalachakra } from './KalachakraEngine.js';

// Sub-engines
export { TarotOracle, tarotOracle, MAJOR_ARCANA } from './cards/TarotOracle.js';
export { HeroJourneyMap, heroJourneyMap, HERO_PHASES } from './engine/HeroJourneyMap.js';
export { FractalTime, fractalTime, YUGAS, YUGA_ORDER } from './cycles/FractalTime.js';
export { TemporalEngine, temporalEngine, VAYU_STATES } from './engine/TemporalEngine.js';

// Utils
export { StateManager, StateCache } from './utils/StateManager.js';

// Version
export const VERSION = '1.0.0';
export const KALACHAKRA_MANTRA = 'ॐ कालाय नमः (Om Kalaya Namah)';

/**
 * Quick initialization helper
 */
export async function initKalachakra(statePath?: string): Promise<import('./KalachakraEngine.js').KalachakraEngine> {
  const { KalachakraEngine } = await import('./KalachakraEngine.js');
  const engine = new KalachakraEngine(statePath);
  await engine.initialize();
  return engine;
}
