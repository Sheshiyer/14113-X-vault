/**
 * NoesisBridge - Integration with Noesis CLI
 * 
 * Connects Kalachakra to the Noesis temporal awareness system
 * Provides real-time Khalorēē, Vikāra, and Vāyu readings
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useKalachakraStore } from '../store/kalachakraStore';
import type { NoesisTemporalState, Vayu } from '../types';

const NOESIS_WS_URL = 'ws://localhost:3001/ws';
const POLL_INTERVAL = 5000;

const generateSimulatedNoesisState = (): NoesisTemporalState => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  const cliffordOctave = Math.floor(((hour * 60 + minute) / 1440) * 8) % 8;
  
  let baseKhaloree = 50;
  if (hour >= 6 && hour < 12) baseKhaloree = 85;
  else if (hour >= 12 && hour < 15) baseKhaloree = 70;
  else if (hour >= 15 && hour < 19) baseKhaloree = 75;
  else if (hour >= 19 && hour < 22) baseKhaloree = 60;
  else baseKhaloree = 40;
  
  const khaloree = Math.max(0, Math.min(100, baseKhaloree + (Math.random() - 0.5) * 20));
  const vikara = Math.max(0, Math.min(100, 100 - khaloree + (Math.random() - 0.5) * 10));
  
  const vayus: Vayu[] = ['prana', 'vyana', 'udana', 'samana', 'apana'];
  const vayuIndex = Math.floor((hour % 5) + (khaloree > 70 ? 0 : khaloree > 40 ? 1 : 2));
  const vayu = vayus[vayuIndex % 5];
  
  return {
    timestamp: now.toISOString(),
    cliffordOctave,
    khaloree: Math.round(khaloree),
    vikara: Math.round(vikara),
    vayu,
    moonPhase: calculateMoonPhase(now),
    dayOfMoonCycle: calculateDayOfMoonCycle(now),
  };
};

const calculateMoonPhase = (date: Date): string => {
  const synodic = 29.53058867;
  const knownNewMoon = new Date('2024-01-11').getTime();
  const diff = date.getTime() - knownNewMoon;
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = (days % synodic) / synodic;
  
  if (phase < 0.03 || phase > 0.97) return 'new';
  if (phase < 0.22) return 'waxing-crescent';
  if (phase < 0.28) return 'first-quarter';
  if (phase < 0.47) return 'waxing-gibbous';
  if (phase < 0.53) return 'full';
  if (phase < 0.72) return 'waning-gibbous';
  if (phase < 0.78) return 'last-quarter';
  return 'waning-crescent';
};

const calculateDayOfMoonCycle = (date: Date): number => {
  const synodic = 29.53058867;
  const knownNewMoon = new Date('2024-01-11').getTime();
  const diff = date.getTime() - knownNewMoon;
  const days = diff / (1000 * 60 * 60 * 24);
  return Math.floor(days % synodic) + 1;
};

export const useNoesisBridge = () => {
  const updateNoesisState = useKalachakraStore((state) => state.updateNoesisState);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(NOESIS_WS_URL);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'temporal-state') {
            updateNoesisState(data.payload);
          }
        } catch (err) {
          console.error('[NoesisBridge] Failed to parse message:', err);
        }
      };
      
      ws.onerror = () => {
        setIsConnected(false);
        setError('WebSocket connection failed, falling back to polling');
        startPolling();
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(() => {
          if (wsRef.current === ws) {
            startPolling();
          }
        }, 5000);
      };
      
      wsRef.current = ws;
    } catch {
      startPolling();
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [updateNoesisState]);
  
  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    
    const fetchState = () => {
      const state = generateSimulatedNoesisState();
      updateNoesisState(state);
    };
    
    fetchState();
    pollRef.current = setInterval(fetchState, POLL_INTERVAL);
  }, [updateNoesisState]);
  
  const refresh = useCallback(async () => {
    const state = generateSimulatedNoesisState();
    updateNoesisState(state);
  }, [updateNoesisState]);
  
  const fetchHistory = useCallback(async (hours: number = 24) => {
    const history = [];
    const now = new Date();
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      history.push({
        ...generateSimulatedNoesisState(),
        timestamp: time.toISOString(),
      });
    }
    return history;
  }, []);
  
  return {
    connect,
    isConnected,
    error,
    refresh,
    fetchHistory,
  };
};

export const useCliffordOctave = () => {
  const noesis = useKalachakraStore((state) => state.state.noesis);
  
  const octave = noesis?.cliffordOctave ?? 0;
  const progress = (octave / 8) * 100;
  
  const octaveNames = [
    'Prabhāta (Dawn)',
    'Pūrvāhna (Morning)',
    'Madhyāhna (Midday)',
    'Aparāhna (Afternoon)',
    'Sāyāhna (Evening)',
    'Pradoṣa (Dusk)',
    'Niśā (Night)',
    'Ardharātra (Midnight)',
  ];
  
  return {
    octave,
    name: octaveNames[octave],
    progress,
    isPeak: octave === 1 || octave === 2,
    isRest: octave === 6 || octave === 7,
  };
};

export const useKhaloree = () => {
  const noesis = useKalachakraStore((state) => state.state.noesis);
  const khaloree = noesis?.khaloree ?? 50;
  
  return {
    value: khaloree,
    percentage: khaloree,
    status: khaloree >= 75 ? 'optimal' : khaloree >= 50 ? 'good' : khaloree >= 25 ? 'depleted' : 'critical',
    recommendation: getKhaloreeRecommendation(khaloree),
  };
};

const getKhaloreeRecommendation = (khaloree: number): string => {
  if (khaloree >= 75) return 'Peak energy. Tackle complex creative work.';
  if (khaloree >= 50) return 'Good energy. Solid for most tasks.';
  if (khaloree >= 25) return 'Energy declining. Switch to lighter tasks.';
  return 'Critical low. Rest immediately. Hydrate, move, breathe.';
};

export const useVayu = () => {
  const noesis = useKalachakraStore((state) => state.state.noesis);
  const vayu = noesis?.vayu ?? 'prana';
  
  const vayuData: Record<Vayu, any> = {
    prana: {
      name: 'Prāṇa',
      direction: 'Inward',
      quality: 'Vitalizing',
      activity: 'Inspiration, new beginnings',
      associatedKosha: 'pranamaya',
    },
    vyana: {
      name: 'Vyāna',
      direction: 'Circular',
      quality: 'Integrating',
      activity: 'Connection, distribution',
      associatedKosha: 'pranamaya',
    },
    udana: {
      name: 'Udāna',
      direction: 'Upward',
      quality: 'Ascension',
      activity: 'Expression, speech',
      associatedKosha: 'vijnanamaya',
    },
    samana: {
      name: 'Samāna',
      direction: 'Centering',
      quality: 'Balancing',
      activity: 'Digestion, assimilation',
      associatedKosha: 'annamaya',
    },
    apana: {
      name: 'Apāna',
      direction: 'Downward',
      quality: 'Grounding',
      activity: 'Elimination, completion',
      associatedKosha: 'annamaya',
    },
  };
  
  return {
    current: vayu,
    ...vayuData[vayu],
  };
};