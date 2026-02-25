export type SceneIntensity = "low" | "medium" | "high";

export interface SceneEntry {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly epoch: string;
  readonly summary: string;
  readonly details: readonly string[];
  readonly tags: readonly string[];
  readonly color: string;
  readonly intensity: SceneIntensity;
  readonly position: {
    readonly x: number;
    readonly y: number;
  };
}

export const SCENES = [
  {
    id: "genesis-portal",
    title: "Genesis Portal",
    subtitle: "Cold-start memory basin",
    epoch: "Epoch 00",
    summary: "A quiet origin node where symbolic fragments begin to self-organize.",
    details: [
      "Ambient threads initialize from archived traces.",
      "No deterministic route is enforced.",
      "Focus is on emergence, not resolution."
    ],
    tags: ["origin", "boot", "memory"],
    color: "#52e7ff",
    intensity: "low",
    position: { x: -1480, y: -860 }
  },
  {
    id: "mnemonic-reef",
    title: "Mnemonic Reef",
    subtitle: "Layered recollection mesh",
    epoch: "Epoch 01",
    summary: "Fragment clusters that preserve unstable context before it collapses.",
    details: [
      "Signals are grouped by semantic drift.",
      "Cross-links appear and dissolve continuously.",
      "Snapshots privilege texture over certainty."
    ],
    tags: ["memory", "cluster", "drift"],
    color: "#9bf06a",
    intensity: "medium",
    position: { x: -820, y: -340 }
  },
  {
    id: "echo-altar",
    title: "Echo Altar",
    subtitle: "Resonance tuning chamber",
    epoch: "Epoch 02",
    summary: "Repeating motifs are amplified until latent structures become visible.",
    details: [
      "Every pass alters the dominant harmonics.",
      "Contradictory notes are retained, not deleted.",
      "Noise can become guidance under recursion."
    ],
    tags: ["resonance", "loop", "motif"],
    color: "#ffc24a",
    intensity: "medium",
    position: { x: -150, y: 120 }
  },
  {
    id: "prism-vault",
    title: "Prism Vault",
    subtitle: "Spectral intent archive",
    epoch: "Epoch 03",
    summary: "Intent streams are split into distinct vectors for manual inspection.",
    details: [
      "High-energy pathways remain reversible.",
      "Color bands map to commitment strength.",
      "Edge cases are retained as first-class artifacts."
    ],
    tags: ["intent", "archive", "spectrum"],
    color: "#f388ff",
    intensity: "high",
    position: { x: 540, y: -720 }
  },
  {
    id: "black-sun-garden",
    title: "Black Sun Garden",
    subtitle: "Entropy stabilization ring",
    epoch: "Epoch 04",
    summary: "A paradox zone where decaying structures are repurposed into new pathways.",
    details: [
      "Collapse events are treated as directional hints.",
      "Recovered shards feed adjacent nodes.",
      "Stability is temporary and intentionally porous."
    ],
    tags: ["entropy", "rebuild", "paradox"],
    color: "#ff6f91",
    intensity: "high",
    position: { x: 1180, y: -220 }
  },
  {
    id: "lattice-forge",
    title: "Lattice Forge",
    subtitle: "Constraint weaving station",
    epoch: "Epoch 05",
    summary: "Loose hypotheses are hardened into linked frames without overfitting.",
    details: [
      "Constraint sets are layered incrementally.",
      "Outliers are promoted when they persist.",
      "The forge emits sparse but reliable anchors."
    ],
    tags: ["constraint", "synthesis", "anchor"],
    color: "#6effcc",
    intensity: "medium",
    position: { x: 1760, y: 380 }
  },
  {
    id: "syntax-cathedral",
    title: "Syntax Cathedral",
    subtitle: "Pattern grammar hall",
    epoch: "Epoch 06",
    summary: "A structural sanctuary for mapping narrative syntax across incompatible streams.",
    details: [
      "Pattern columns hold multi-voice transcripts.",
      "Grammar variants are explored in parallel.",
      "Contradiction is preserved as architecture."
    ],
    tags: ["grammar", "pattern", "narrative"],
    color: "#7da7ff",
    intensity: "medium",
    position: { x: 980, y: 1040 }
  },
  {
    id: "quiet-array",
    title: "Quiet Array",
    subtitle: "Low-noise monitor deck",
    epoch: "Epoch 07",
    summary: "Observational arrays track long-form shifts without injecting intervention.",
    details: [
      "Sampling windows are intentionally wide.",
      "Micro-signals gain value through patience.",
      "Interference controls are always active."
    ],
    tags: ["observation", "monitor", "silence"],
    color: "#d3f7ff",
    intensity: "low",
    position: { x: 220, y: 880 }
  },
  {
    id: "tidal-index",
    title: "Tidal Index",
    subtitle: "Rhythm catalog terminal",
    epoch: "Epoch 08",
    summary: "Temporal rhythms are indexed and replayed to expose hidden periodicity.",
    details: [
      "Cycles are tagged by confidence bands.",
      "Asynchronous pulses remain uncoupled.",
      "Index entries prioritize trend memory."
    ],
    tags: ["tempo", "index", "cycle"],
    color: "#4af0d6",
    intensity: "low",
    position: { x: -640, y: 1060 }
  },
  {
    id: "dusk-switchyard",
    title: "Dusk Switchyard",
    subtitle: "Route divergence interchange",
    epoch: "Epoch 09",
    summary: "Decision rails branch into experimental routes before a final lock-in.",
    details: [
      "Intersections are intentionally overprovisioned.",
      "Fallback tracks stay visible at all times.",
      "Late pivots are expected and supported."
    ],
    tags: ["routing", "decision", "branching"],
    color: "#ff9d4a",
    intensity: "high",
    position: { x: -1380, y: 540 }
  },
  {
    id: "auric-auditorium",
    title: "Auric Auditorium",
    subtitle: "Collective signal theater",
    epoch: "Epoch 10",
    summary: "Narrative streams are projected for multi-perspective interpretation.",
    details: [
      "Audience lenses can disagree without conflict.",
      "Priority overlays rotate by time slice.",
      "Consensus remains optional, never mandatory."
    ],
    tags: ["collective", "interpretation", "projection"],
    color: "#ffe173",
    intensity: "medium",
    position: { x: -2040, y: -180 }
  },
  {
    id: "null-terrace",
    title: "Null Terrace",
    subtitle: "Deliberate pause scaffold",
    epoch: "Epoch 11",
    summary: "An intentional stillness zone for holding unresolved signals without collapse.",
    details: [
      "No forced output is produced here.",
      "Pending strands are queued without decay.",
      "Silence is treated as actionable state."
    ],
    tags: ["pause", "holding", "latency"],
    color: "#c6c6ff",
    intensity: "low",
    position: { x: -1960, y: 980 }
  },
  {
    id: "mirror-engine",
    title: "Mirror Engine",
    subtitle: "Reflective contradiction chamber",
    epoch: "Epoch 12",
    summary: "Competing narratives are mirrored back to reveal hidden assumptions.",
    details: [
      "Reflections preserve source asymmetry.",
      "Dual traces are compared in real time.",
      "Inversions surface dependency blind spots."
    ],
    tags: ["reflection", "contradiction", "insight"],
    color: "#ff7ad7",
    intensity: "high",
    position: { x: 1640, y: -1120 }
  },
  {
    id: "pale-observatory",
    title: "Pale Observatory",
    subtitle: "Long-horizon scan deck",
    epoch: "Epoch 13",
    summary: "Far-field scanning of weak futures that are still outside direct reach.",
    details: [
      "Distant signatures are tracked over long intervals.",
      "Uncertain outcomes are ranked by coherence.",
      "The observatory publishes probability sketches."
    ],
    tags: ["forecast", "horizon", "scan"],
    color: "#8fd4ff",
    intensity: "medium",
    position: { x: 40, y: -1240 }
  }
] satisfies readonly SceneEntry[];

export const SCENE_BY_ID: ReadonlyMap<string, SceneEntry> = new Map(
  SCENES.map((scene) => [scene.id, scene])
);

export function getSceneById(id: string): SceneEntry | null {
  return SCENE_BY_ID.get(id) ?? null;
}
