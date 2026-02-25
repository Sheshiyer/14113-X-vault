/**
 * TemporalEngine - Integration with Noesis CLI
 * Parses Khalorēē, Vikara, Vayu, Clifford Octave
 * Maps to Yuga cycles and temporal state
 */

import { 
  NoesisTemporalState, 
  Vayu, 
  VayuState, 
  Yuga,
  KalachakraState 
} from '../types/index.js';
import { execSync, spawn } from 'child_process';
import { promisify } from 'util';

// ============================================================================
// VAYU STATES
// ============================================================================

export const VAYU_STATES: Record<Vayu, VayuState> = {
  prana: {
    name: 'prana',
    direction: 'inward/upward',
    domain: 'life force, inspiration',
    quality: 'vitalizing, awakening',
    associatedKosha: 'pranamaya'
  },
  vyana: {
    name: 'vyana',
    direction: 'outward/circulating',
    domain: 'distribution, circulation',
    quality: 'integrating, spreading',
    associatedKosha: 'pranamaya'
  },
  udana: {
    name: 'udana',
    direction: 'upward/outward',
    domain: 'speech, expression, growth',
    quality: 'ascending, expressing',
    associatedKosha: 'vijnanamaya'
  },
  samana: {
    name: 'samana',
    direction: 'inward/centering',
    domain: 'digestion, assimilation',
    quality: 'balancing, focusing',
    associatedKosha: 'annamaya'
  },
  apana: {
    name: 'apana',
    direction: 'downward/outward',
    domain: 'elimination, release',
    quality: 'grounding, completing',
    associatedKosha: 'annamaya'
  }
};

// ============================================================================
// NOESIS CLI INTERFACE
// ============================================================================

interface NoesisRawOutput {
  timestamp?: string;
  khaloree?: number;
  vikara?: number;
  vayu?: string;
  clifford_octave?: number;
  cliffordOctave?: number;
  moon_phase?: string;
  moonPhase?: string;
  day_of_moon_cycle?: number;
  dayOfMoonCycle?: number;
  [key: string]: unknown;
}

// ============================================================================
// TEMPORAL ENGINE CLASS
// ============================================================================

export class TemporalEngine {
  private noesisAvailable: boolean | null = null;
  private lastNoesisState: NoesisTemporalState | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_TTL = 30000; // 30 seconds

  /**
   * Check if Noesis CLI is available
   */
  async isNoesisAvailable(): Promise<boolean> {
    if (this.noesisAvailable !== null) {
      return this.noesisAvailable;
    }

    try {
      execSync('which noesis', { stdio: 'ignore' });
      this.noesisAvailable = true;
    } catch {
      // Try common locations
      const commonPaths = [
        '/usr/local/bin/noesis',
        '/usr/bin/noesis',
        `${process.env.HOME}/.local/bin/noesis`,
        `${process.env.HOME}/bin/noesis`,
        './noesis',
        '../noesis'
      ];
      
      for (const path of commonPaths) {
        try {
          execSync(`test -x ${path}`, { stdio: 'ignore' });
          this.noesisAvailable = true;
          return true;
        } catch {
          continue;
        }
      }
      
      this.noesisAvailable = false;
    }
    
    return this.noesisAvailable;
  }

  /**
   * Fetch current temporal state from Noesis CLI
   */
  async fetchNoesisState(): Promise<NoesisTemporalState | null> {
    // Check cache
    const now = Date.now();
    if (this.lastNoesisState && (now - this.lastFetchTime) < this.CACHE_TTL) {
      return this.lastNoesisState;
    }

    const available = await this.isNoesisAvailable();
    if (!available) {
      // Return mock state for development
      return this.getMockState();
    }

    try {
      const output = execSync('noesis temporal --json', { 
        encoding: 'utf-8',
        timeout: 5000,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const raw: NoesisRawOutput = JSON.parse(output);
      const parsed = this.parseNoesisOutput(raw);
      
      this.lastNoesisState = parsed;
      this.lastFetchTime = now;
      
      return parsed;
    } catch (error) {
      // Silently fall back to mock state when Noesis is unavailable
      return this.getMockState();
    }
  }

  /**
   * Stream Noesis state updates (for real-time dashboard)
   */
  async *streamNoesisState(): AsyncGenerator<NoesisTemporalState> {
    const available = await this.isNoesisAvailable();
    
    if (!available) {
      // Yield mock states for development
      while (true) {
        yield this.getMockState();
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    try {
      const process = spawn('noesis', ['temporal', '--json', '--watch'], {
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let buffer = '';
      
      for await (const chunk of process.stdout) {
        buffer += chunk.toString();
        
        // Try to parse complete JSON objects
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const raw = JSON.parse(line);
              yield this.parseNoesisOutput(raw);
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      console.error('Noesis stream error:', error);
      // Fall back to polling
      while (true) {
        const state = await this.fetchNoesisState();
        if (state) yield state;
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  /**
   * Parse Noesis CLI output into typed state
   */
  parseNoesisOutput(raw: NoesisRawOutput): NoesisTemporalState {
    return {
      timestamp: raw.timestamp || new Date().toISOString(),
      khaloree: this.clampNumber(raw.khaloree, 0, 100),
      vikara: this.clampNumber(raw.vikara, 0, 100),
      vayu: this.parseVayu(raw.vayu),
      cliffordOctave: this.clampNumber(
        raw.clifford_octave ?? raw.cliffordOctave, 
        0, 
        7
      ),
      moonPhase: raw.moon_phase ?? raw.moonPhase,
      dayOfMoonCycle: raw.day_of_moon_cycle ?? raw.dayOfMoonCycle
    };
  }

  /**
   * Map Noesis state to Yuga
   * 
   * Algorithm:
   * - High Khalorēē + Low Vikara = Krita Yuga (Golden)
   * - Moderate Khalorēē = Treta Yuga (Silver)
   * - Low Khalorēē + Rising Vikara = Dvapara Yuga (Bronze)
   * - Very Low Khalorēē + High Vikara = Kali Yuga (Iron)
   */
  mapToYuga(noesis: NoesisTemporalState): Yuga {
    const { khaloree, vikara } = noesis;
    
    // Krita: High energy, low drift
    if (khaloree >= 70 && vikara <= 30) {
      return 'krita';
    }
    
    // Treta: Moderate energy
    if (khaloree >= 50 && vikara <= 50) {
      return 'treta';
    }
    
    // Dvapara: Declining energy, rising drift
    if (khaloree >= 25 && vikara >= 40) {
      return 'dvapara';
    }
    
    // Kali: Critical state
    return 'kali';
  }

  /**
   * Get Vayu state
   */
  getVayuState(vayu: Vayu): VayuState {
    return VAYU_STATES[vayu];
  }

  /**
   * Get current Clifford position description
   */
  getCliffordDescription(octave: number): string {
    const descriptions: Record<number, string> = {
      0: 'Beginning of cycle - fresh start, setting intentions',
      1: 'Building momentum - early progress, establishing rhythm',
      2: 'Growth phase - expanding, taking on more',
      3: 'Peak activity - maximum output, full engagement',
      4: 'Culmination - completion of major work, harvest',
      5: 'Distribution - sharing results, integrating feedback',
      6: 'Reflection - reviewing, learning, preparing',
      7: 'Restoration - deep rest, renewal, new seeds'
    };
    
    return descriptions[octave] || 'Unknown octave';
  }

  /**
   * Calculate "temporal weather" - overall quality of the moment
   */
  getTemporalWeather(noesis: NoesisTemporalState): {
    condition: 'clear' | 'partly-cloudy' | 'overcast' | 'stormy';
    description: string;
    recommendation: string;
  } {
    const { khaloree, vikara, vayu } = noesis;
    
    // Clear: optimal conditions
    if (khaloree >= 75 && vikara <= 25) {
      return {
        condition: 'clear',
        description: 'Optimal conditions for deep work',
        recommendation: 'Seize this moment for your most important task.'
      };
    }
    
    // Partly cloudy: good with some challenges
    if (khaloree >= 50 && vikara <= 40) {
      return {
        condition: 'partly-cloudy',
        description: 'Good conditions, minor friction expected',
        recommendation: 'Proceed with planned work. Take breaks as needed.'
      };
    }
    
    // Overcast: challenging conditions
    if (khaloree >= 30 && vikara <= 60) {
      return {
        condition: 'overcast',
        description: 'Challenging conditions, energy fluctuating',
        recommendation: 'Focus on lighter tasks. Consider a reset soon.'
      };
    }
    
    // Stormy: poor conditions
    return {
      condition: 'stormy',
      description: 'Difficult conditions, high drift',
      recommendation: 'Rest and recovery is the priority now.'
    };
  }

  /**
   * Get mock state for development without Noesis
   */
  getMockState(): NoesisTemporalState {
    const hour = new Date().getHours();
    
    // Simulate circadian rhythms
    let khaloree = 50;
    if (hour >= 6 && hour <= 10) khaloree = 80; // Morning peak
    else if (hour >= 11 && hour <= 14) khaloree = 70; // Midday
    else if (hour >= 15 && hour <= 18) khaloree = 75; // Afternoon peak
    else if (hour >= 19 && hour <= 22) khaloree = 60; // Evening
    else khaloree = 30; // Night
    
    // Add some randomness
    khaloree += Math.floor(Math.random() * 20) - 10;
    khaloree = Math.max(10, Math.min(100, khaloree));
    
    // Vikara inversely related to khaloree with lag
    const vikara = Math.max(10, Math.min(90, 100 - khaloree + 20));
    
    // Vayu based on time of day
    const vayus: Vayu[] = ['prana', 'samana', 'vyana', 'udana', 'apana'];
    const vayuIndex = Math.floor((hour / 24) * 5) % 5;
    
    return {
      timestamp: new Date().toISOString(),
      khaloree,
      vikara,
      vayu: vayus[vayuIndex],
      cliffordOctave: hour % 8,
      moonPhase: 'Waxing Gibbous',
      dayOfMoonCycle: 12
    };
  }

  /**
   * Generate complete Kalachakra state from Noesis data
   */
  async generateKalachakraState(
    projectTasks: { total: number; completed: number } = { total: 100, completed: 0 }
  ): Promise<Partial<KalachakraState>> {
    const noesis = await this.fetchNoesisState();
    
    if (!noesis) {
      throw new Error('Unable to fetch temporal state');
    }
    
    const yuga = this.mapToYuga(noesis);
    const weather = this.getTemporalWeather(noesis);
    const vayuState = this.getVayuState(noesis.vayu);
    
    return {
      timestamp: noesis.timestamp,
      version: '1.0.0',
      noesis,
      yugaOfTheMoment: {
        name: yuga,
        sanskritName: '',
        color: '',
        duration: { min: 0, max: 0 },
        characteristics: [],
        tarotCards: [],
        kosha: vayuState.associatedKosha,
        exitSignals: [],
        resetActions: []
      },
      currentVayu: vayuState,
      sankalpa: weather.recommendation
    };
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private parseVayu(v: string | undefined): Vayu {
    const validVayus: Vayu[] = ['prana', 'vyana', 'udana', 'samana', 'apana'];
    const normalized = v?.toLowerCase() as Vayu;
    return validVayus.includes(normalized) ? normalized : 'prana';
  }

  private clampNumber(n: number | undefined, min: number, max: number): number {
    if (n === undefined || isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }
}

// Singleton instance
export const temporalEngine = new TemporalEngine();
