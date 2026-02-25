# कालचक्र (Kalachakra)

## The Fractal Time Calendar — Hero's Journey for Code

> *The calendar is not a prison of dates. It is a map of the soul's journey through work.*

Kalachakra integrates with [Noesis](https://github.com/10865xseed/noesis) CLI to provide a mythic, cyclical understanding of time for creative work. It maps Joseph Campbell's Hero's Journey onto project phases, draws daily Tarot guidance, and tracks Yuga cycles within coding sessions.

---

## Architecture

```
Noesis provides:          Kalachakra adds:
─────────────────         ─────────────────
Clifford Clock  →         Hero's Journey stages
8-hour octaves  →         Tarot archetype of the day  
Moon phases     →         Mythic narrative tracking
Vikara (drift)  →         Story tension points
Khalorēē        →         Protagonist energy state
Vayus           →         Elemental forces
```

---

## Components

### 1. TemporalEngine (`src/engine/TemporalEngine.ts`)

Integrates with Noesis CLI to fetch temporal state:

```typescript
// Fetch current temporal state
const state = await temporalEngine.fetchNoesisState();
// { khaloree: 78, vikara: 12, vayu: 'prana', cliffordOctave: 3 }

// Map to Yuga
const yuga = temporalEngine.mapToYuga(state);
// 'krita' | 'treta' | 'dvapara' | 'kali'

// Get temporal weather
const weather = temporalEngine.getTemporalWeather(state);
// { condition: 'clear', description: 'Optimal conditions', ... }
```

### 2. HeroJourneyMap (`src/engine/HeroJourneyMap.ts`)

The 12 phases of the Hero's Journey:

| # | Phase | Tarot | Kosha | Sankalpa |
|---|-------|-------|-------|----------|
| 1 | ORDINARY WORLD | The Fool (0) | annamaya | "We begin not knowing..." |
| 2 | CALL TO ADVENTURE | The Magician (I) | pranamaya | "The tools are ready..." |
| 3 | REFUSAL OF THE CALL | The Hanged Man (XII) | manomaya | "In suspension, we see..." |
| 4 | MEETING THE MENTOR | The Hierophant (V) | vijnanamaya | "The tradition teaches..." |
| 5 | CROSSING THE THRESHOLD | The Chariot (VII) | all | "The threshold is crossed..." |
| 6 | TESTS, ALLIES, ENEMIES | Strength (VIII) | pranamaya | "The lion is embraced..." |
| 7 | APPROACH TO THE INMOST CAVE | The Tower (XVI) | manomaya | "What must fall, falls..." |
| 8 | THE ORDEAL | Death (XIII) | manomaya | "Death is a passage..." |
| 9 | REWARD | The Sun (XIX) | anandamaya | "Joy is simple..." |
| 10 | THE ROAD BACK | The World (XXI) | annamaya | "The return is outward..." |
| 11 | RESURRECTION | Judgement (XX) | all | "The self is revealed..." |
| 12 | RETURN WITH THE ELIXIR | The Star (XVII) | anandamaya | "The well never empties..." |

### 3. TarotOracle (`src/cards/TarotOracle.ts`)

Complete Major Arcana (22 cards) with kosha associations:

```typescript
// Draw a card
draw.drawCard({ context: 'debugging' });

// Get card of the day
tarotOracle.getCardOfTheDay();
// Monday → The Magician, Tuesday → The Tower, etc.
```

### 4. FractalTime (`src/cycles/FractalTime.ts`)

The Four Yugas of a coding session:

| Yuga | Duration | State | Action |
|------|----------|-------|--------|
| **Krita** (Golden) | 90-120 min | Flow | Stay in it |
| **Treta** (Silver) | 60-90 min | Solid progress | Continue |
| **Dvapara** (Bronze) | 30-60 min | Struggling | Take a break |
| **Kali** (Iron) | 0 min | Negative returns | STOP NOW |

Nested cycles:
```
Quarter ⊃ Moon ⊃ Week ⊃ Day ⊃ Session ⊃ Moment
```

---

## Usage

### CLI

```bash
# Initialize state
node dist/cli.js init

# Show current temporal state
node dist/cli.js now

# Draw a tarot card
node dist/cli.js draw "debugging session"

# Show hero's journey phases
node dist/cli.js phase

# Show yuga states
node dist/cli.js yuga

# Show fractal cycles
node dist/cli.js cycles

# Create a task
node dist/cli.js task create "Build component"
```

### JavaScript/TypeScript API

```typescript
import { kalachakra, initKalachakra } from 'kalachakra';

// Initialize
await kalachakra.initialize();

// Get current state
const now = await kalachakra.getNow();
console.log(now.tarot.name);        // "The Magician"
console.log(now.heroPhase.name);    // "ORDINARY WORLD"
console.log(now.yuga.name);         // "krita"

// Create a task
const task = kalachakra.createTask('Build dashboard', 'Create main UI', 120);

// Start working
kalachakra.startTask(task.id);

// Update progress
kalachakra.updateTaskProgress(task.id, 0.5);

// Draw guidance
const guidance = kalachakra.drawCard({ context: 'debugging' });

// Complete task
const result = kalachakra.completeTask({
  taskId: task.id,
  reflection: 'Learned about React hooks',
  energyLevel: 70,
  satisfaction: 85
});
console.log(result.elixir);  // "Knowledge - patterns understood"
```

### React Hooks

```typescript
import { 
  useKalachakra, 
  useNow, 
  useTasks, 
  useTarot,
  useHeroPhase,
  useYuga 
} from 'kalachakra/react';

function Dashboard() {
  const { state, loading } = useKalachakra();
  const { now } = useNow();
  const { createTask, startTask } = useTasks();
  const { drawCard, cardOfTheDay } = useTarot();
  const { currentPhase } = useHeroPhase();
  const { currentYuga, recommendedAction } = useYuga();

  // Render your dashboard
}
```

---

## File Structure

```
kalachakra/
├── src/
│   ├── index.ts                    # Main exports
│   ├── cli.ts                      # CLI entry point
│   ├── KalachakraEngine.ts         # Main orchestrator
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   ├── engine/
│   │   ├── TemporalEngine.ts       # Noesis integration
│   │   └── HeroJourneyMap.ts       # 12 phases
│   ├── cards/
│   │   └── TarotOracle.ts          # Major Arcana
│   ├── cycles/
│   │   └── FractalTime.ts          # Yuga cycles
│   ├── react/
│   │   └── hooks.ts                # React integration
│   └── utils/
│       └── StateManager.ts         # Persistence
├── state/
│   └── state.json                  # Runtime state
├── package.json
└── tsconfig.json
```

---

## State File

The engine persists state to `state/state.json`:

```json
{
  "timestamp": "2026-02-15T19:49:30.262Z",
  "version": "1.0.0",
  "noesis": {
    "khaloree": 78,
    "vikara": 12,
    "vayu": "prana",
    "cliffordOctave": 3
  },
  "tarotOfTheDay": { /* ... */ },
  "heroPhase": { /* ... */ },
  "yugaOfTheMoment": { /* ... */ },
  "cycles": { /* nested fractal cycles */ },
  "sankalpa": "We begin not knowing...",
  "recentDraws": [],
  "completedTasks": []
}
```

---

## Integration with Noesis

When Noesis CLI is available, Kalachakra reads:

```bash
noesis temporal --json
```

Output format:
```json
{
  "timestamp": "2026-02-15T19:49:30Z",
  "khaloree": 78,
  "vikara": 12,
  "vayu": "prana",
  "cliffordOctave": 3,
  "moonPhase": "Waxing Gibbous",
  "dayOfMoonCycle": 12
}
```

When Noesis is unavailable, the engine falls back to mock data based on time of day.

---

## Mantra

> *ॐ कालाय नमः*  
> *(Om Kalaya Namah — Salutations to Time)*

The calendar is not a prison of dates.  
It is a map of the soul's journey through work.  
Each task is a step on the hero's path.  
Each day is a lifetime.  
Each lifetime is a day.

---

## License

MIT
