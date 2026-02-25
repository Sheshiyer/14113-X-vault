# Noesis Bridge

The integration layer between **Kalachakra** (the fractal time calendar) and **Noesis** (the temporal engine).

> "Kalachakra READS from Noesis but doesn't duplicate. Noesis = the engine. Kalachakra = the story told by the engine."

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NOESIS CLI                               │
│  (temporal, health, clock, moon, vayus)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │ JSON
┌───────────────────────▼─────────────────────────────────────┐
│                  NoesisClient                               │
│  • Spawns noesis commands                                   │
│  • Parses JSON outputs                                      │
│  • Caches results with TTL                                  │
│  • Error handling (fallback when noesis unavailable)        │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌───────────────┐ ┌──────────────┐ ┌──────────────┐
│ StateSync     │ │ Khalorēē     │ │ Vayu         │
│ (real-time    │ │ Monitor      │ │ Adapter      │
│  sync,        │ │ (energy      │ │ (work type   │
│  yuga alerts) │ │  tracking)   │ │  mapping)    │
└───────┬───────┘ └──────┬───────┘ └──────┬───────┘
        │                │                │
        └───────────────┬┘                │
                        ▼                 │
        ┌─────────────────────────────────┘
        ▼
┌─────────────────────────────────────────────────────────────┐
│              Kalachakra State                               │
│  (tarot, heroPhase, yuga, noesis: {khaloree, vikara, vayu}) │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. NoesisClient
CLI wrapper that handles communication with the noesis binary.

```typescript
import { NoesisClient } from './bridge';

const client = new NoesisClient({ ttl: 30000 });

// All commands return typed data or null if noesis unavailable
const temporal = await client.getTemporal();
const health = await client.getHealth();
const clock = await client.getClock();
const moon = await client.getMoon();
const vayus = await client.getVayus();
```

**Features:**
- Automatic caching with configurable TTL
- Retry logic with exponential backoff
- Stale cache fallback when noesis is down
- Error tracking and status reporting

### 2. StateSynchronizer
Polls noesis every 30s and maintains synchronized Kalachakra state.

```typescript
import { StateSynchronizer } from './bridge';

const sync = new StateSynchronizer(client, {
  pollInterval: 30000,
  vikaraThreshold: 75,
  enableAlerts: true,
});

sync.on('yugaTransition', (event) => {
  console.log(`${event.from} → ${event.to}`);
});

sync.on('vikaraAlert', (alert) => {
  // Critical drift detected
  notifyUser(alert.message);
});

sync.start();
```

**Events:**
- `sync` - State updated
- `connected` / `disconnected` - Noesis connectivity
- `yugaTransition` - Yuga changed (krita ↔ treta ↔ dvapara ↔ kali)
- `vikaraAlert` - Drift threshold exceeded

### 3. KhalorēēMonitor
Tracks metabolic reserve over time, predicts Kali Yuga, suggests rest.

```typescript
import { KhalorēēMonitor } from './bridge';

const monitor = new KhalorēēMonitor(client);

// Record samples (automatic via synchronizer)
monitor.recordSample(temporalData);

// Predict when Kali Yuga will hit
const prediction = monitor.predictKaliYuga();
if (prediction.predicted && prediction.estimatedTimeToKali < 15) {
  // Alert: Critical energy approaching
}

// Get rest recommendation
const rest = monitor.getRestRecommendation();
// { urgency: 'now', reason: '...', suggestedDuration: 20, ... }

// Track task correlations
monitor.recordTaskCompletion(taskId, 'creative-coding', 90, true);
const correlation = monitor.getTaskCorrelation('creative-coding');
```

**Features:**
- Energy trend analysis (linear regression)
- Kali Yuga prediction based on trajectory
- Rest recommendations with optimal return time
- Task-energy correlation tracking
- Daily/weekly energy history

### 4. VayuAdapter
Maps elemental forces to appropriate work types.

| Vayu | Direction | Work Type | Best For |
|------|-----------|-----------|----------|
| **Prana** | Inward/Upward | Creative Coding | New features, exploration, greenfield |
| **Vyana** | Outward/Circulating | Refactoring | Restructuring, optimization, integration |
| **Udana** | Upward/Ascending | Architecture | Decisions, planning, strategic thinking |
| **Samana** | Inward/Converging | Testing/Debugging | QA, bug hunting, systematic verification |
| **Apana** | Downward/Grounding | Documentation | Cleanup, completion, organization |

```typescript
import { VayuAdapter } from './bridge';

const adapter = new VayuAdapter();

// Get suggestion based on current vayu
const suggestion = adapter.getSuggestion(vayus, khaloree, vikara);
console.log(suggestion.workType.name); // "Creative Coding"
console.log(suggestion.tasks); // ["Design new features", ...]

// Get task suggestions for current vayu
const tasks = adapter.getTaskSuggestions('prana', 3);

// Check if good time for specific work
const match = adapter.isProfileMatch(workType, khaloree, vikara);

// Get daily flow prediction
const flow = adapter.getDailyFlow('prana');
// { current: 'prana', next: 'vyana', estimatedTransition: '...', ... }
```

## Usage

### Quick Start

```typescript
import { NoesisBridge } from './bridge';

const bridge = new NoesisBridge({
  noesisPath: 'noesis', // optional
  sync: {
    pollInterval: 30000,
    vikaraThreshold: 75,
  },
});

// Start synchronization
bridge.start();

// Get complete snapshot
const snapshot = await bridge.getSnapshot();
// {
//   timestamp: '...',
//   state: { /* KalachakraState */ },
//   suggestion: { vayu: 'prana', workType: 'Creative Coding', tasks: [...] },
//   prediction: { kaliImminent: false, ... },
//   rest: { urgency: 'none', ... },
//   optimalTasks: ['creative-coding', 'refactoring']
// }

// Get current guidance
const guidance = bridge.getCurrentVayuGuidance();
// { vayu: 'prana', workType: 'Creative Coding', ... }

// Check if good time for specific work
const check = bridge.isGoodTimeFor('architecture');
// { suitable: true, score: 0.85, reason: 'Good alignment' }

// Record task completion
bridge.recordTask('task-123', 'creative-coding', 90, true);
```

### React Integration Example

```tsx
import { useEffect, useState } from 'react';
import { NoesisBridge, BridgeSnapshot } from './bridge';

function useNoesisBridge() {
  const [snapshot, setSnapshot] = useState<BridgeSnapshot | null>(null);
  
  useEffect(() => {
    const bridge = new NoesisBridge();
    bridge.start();
    
    // Update every 30 seconds
    const interval = setInterval(async () => {
      setSnapshot(await bridge.getSnapshot());
    }, 30000);
    
    return () => {
      clearInterval(interval);
      bridge.stop();
    };
  }, []);
  
  return snapshot;
}

function VayuGuidance() {
  const snapshot = useNoesisBridge();
  
  if (!snapshot) return <div>Connecting to Noesis...</div>;
  if (!snapshot.state) return <div>Noesis unavailable</div>;
  
  return (
    <div>
      <h2>Current Vayu: {snapshot.suggestion.vayu}</h2>
      <p>Suggested: {snapshot.suggestion.workType}</p>
      <ul>
        {snapshot.suggestion.tasks.map(task => <li key={task}>{task}</li>)}
      </ul>
      {snapshot.prediction.kaliImminent && (
        <div className="alert">
          Kali Yuga in ~{snapshot.prediction.estimatedMinutes}m
        </div>
      )}
    </div>
  );
}
```

## Type Definitions

See `../types/index.ts` for core types:

- `KalachakraState` - Complete system state
- `NoesisTemporalState` - Data from noesis CLI
- `Vayu` - Elemental force type
- `Yuga` - Temporal age (krita/treta/dvapara/kali)
- `HeroPhase` - Journey phase
- `TarotCard` - Daily guidance

## Caching Strategy

| Command | Cache TTL | Reason |
|---------|-----------|--------|
| `temporal` | 5s | Changes gradually |
| `health` | 2s | Health checks need freshness |
| `clock` | 10s | Octave changes slowly |
| `moon` | 1 hour | Moon phase changes slowly |
| `vayus` | 30s | Vayu can shift |

When noesis is unavailable, the bridge uses stale cache data with a warning.

## Error Handling

All bridge methods handle noesis failures gracefully:

1. **Retry**: Transient errors are retried with exponential backoff
2. **Stale Cache**: If retries fail, return cached data with warning
3. **Null Fallback**: If no cache, return null (check before using)
4. **Events**: `disconnected` event fired when noesis unavailable

## Events Reference

### StateSynchronizer Events

| Event | Payload | Description |
|-------|---------|-------------|
| `started` | - | Synchronizer started |
| `stopped` | - | Synchronizer stopped |
| `connected` | - | Connected to noesis |
| `disconnected` | - | Noesis unavailable |
| `sync` | `KalachakraState` | State updated |
| `error` | `Error` | Sync error occurred |
| `yugaTransition` | `YugaTransitionEvent` | Yuga changed |
| `vikaraAlert` | `VikaraAlert` | Drift threshold exceeded |

### KhalorēēMonitor Events

| Event | Payload | Description |
|-------|---------|-------------|
| `sample` | `EnergySample` | New energy sample recorded |
| `suddenDrop` | `{from, to, timestamp}` | Rapid energy decline |
| `recoveryDetected` | `{from, to, timestamp}` | Energy recovering |
| `taskRecorded` | `{taskId, correlation}` | Task completion logged |

## License

MIT
