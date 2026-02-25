/* ─────────────────────────────────────────────
   Dialogue Engine — Branching Conversational Tree
   ─────────────────────────────────────────────
   Each node has system response lines and up to 4 options
   the user can pick. Options lead to other nodes.
   No AI required — pre-authored content from brand docs.
*/

export interface DialogueOption {
  /** Short label shown as a chip / menu item */
  readonly label: string;
  /** Node ID this option leads to */
  readonly next: string;
}

export interface DialogueNode {
  readonly id: string;
  /** Lines the system types out when entering this node */
  readonly lines: readonly string[];
  /** Up to 4 options the user can pick. Empty = terminal leaf. */
  readonly options: readonly DialogueOption[];
}

/* ── The full conversation tree ── */
export const DIALOGUE_TREE: Record<string, DialogueNode> = {

  /* ═══════════════════════════════════════════
     ROOT — First thing the user sees
     ═══════════════════════════════════════════ */
  root: {
    id: "root",
    lines: [
      "",
      "You found the terminal.",
      "",
      "Most people scroll past. You didn't.",
      "That pattern recognition — noticing what others miss — is exactly what this system is built for.",
      "",
      "Tryambakam Noesis is a living inquiry field for self-authored meaning.",
      "Not self-help. Not mystical practice. Not education.",
      "The space before all of these.",
      "",
      "What would you like to know?",
    ],
    options: [
      { label: "What does that actually mean?", next: "what_is_it" },
      { label: "What problem does this solve?", next: "problem" },
      { label: "Who is this for?", next: "who" },
      { label: "Show me the system.", next: "system_overview" },
    ],
  },

  /* ═══════════════════════════════════════════
     WHAT IS IT — Core product explanation
     ═══════════════════════════════════════════ */
  what_is_it: {
    id: "what_is_it",
    lines: [
      "",
      "Tryambakam — Sanskrit. 'The Three-Eyed.' The one who destroys ignorance through triple vision.",
      "Noesis — Greek. νόησις. The act of knowing that is aware of itself knowing.",
      "",
      "Together: three-eyed knowing.",
      "",
      "In practice: sixteen symbolic-computational engines spanning Vedic, Western, and biofield traditions.",
      "Two Witness Agents — Aletheios and Pichet — that regulate inquiry depth.",
      "Grounded in the body. Designed to develop your capacity to generate your own clarity.",
      "",
      "The system succeeds only when you no longer need it.",
    ],
    options: [
      { label: "What are Witness Agents?", next: "witnesses" },
      { label: "Sixteen engines — like what?", next: "engines" },
      { label: "Why would I stop needing it?", next: "sovereignty" },
      { label: "Go back.", next: "root" },
    ],
  },

  /* ═══════════════════════════════════════════
     PROBLEM — What pain does this address
     ═══════════════════════════════════════════ */
  problem: {
    id: "problem",
    lines: [
      "",
      "You've probably tried the usual progression.",
      "",
      "Therapy — insight without authorship. You can narrate your wounds, but you're still running the same code.",
      "Meditation — 500 days streaked. Your life is still on autopilot. You've learned to observe your thoughts. But who is doing the observing?",
      "Productivity — you've GTD'd your life. Optimized for a life you never consciously chose.",
      "Retreats — the ceremonies cracked something open. Integration? You're left alone to piece together fragments.",
      "Books — you've read 200 books on meaning. Knowing about meaning is not the same as living it.",
      "",
      "The exhaustion you feel isn't from seeking.",
      "It's from seeking within structures that need your dependency to survive.",
    ],
    options: [
      { label: "That's... accurate. So what's different here?", next: "whats_different" },
      { label: "The dependency part — say more.", next: "sovereignty" },
      { label: "I haven't tried all of those.", next: "entry_points" },
      { label: "Go back.", next: "root" },
    ],
  },

  /* ═══════════════════════════════════════════
     WHO — Target audience
     ═══════════════════════════════════════════ */
  who: {
    id: "who",
    lines: [
      "",
      "Three kinds of people find their way here.",
      "",
      "The Exhausted Seeker — post-therapy, post-apps, post-books.",
      "Someone who can articulate the unnamed frustration: every system they've tried positions them as user, not author.",
      "",
      "The Rigorous Intellectual — framework collectors, LessWrong readers, builders who demand structural respect.",
      "They need something that doesn't simplify falsely.",
      "",
      "The Integrator — post-retreat, post-ceremony.",
      "They had the opening, but the architecture for what opened is missing.",
      "Fragments without structure. Downloads without grammar.",
      "",
      "If none of these resonate, this might not be your entry point. That's fine.",
      "Not every map is for every traveler.",
    ],
    options: [
      { label: "I'm the first one — exhausted practitioner.", next: "practitioner_path" },
      { label: "I'm the intellectual — show me the framework.", next: "engines" },
      { label: "I'm the integrator — I need structure.", next: "integrator_path" },
      { label: "Go back.", next: "root" },
    ],
  },

  /* ═══════════════════════════════════════════
     SYSTEM OVERVIEW — The seven offerings
     ═══════════════════════════════════════════ */
  system_overview: {
    id: "system_overview",
    lines: [
      "",
      "Seven interconnected layers. Not products — fields of practice.",
      "",
      "  1. Selemene Engine         → 16 computational engines (API / terminal / webapp)",
      "  2. Symbolic Narratives     → The Plumber manga (12 episodes, one per engine)",
      "  3. Somatic Canticles       → Body-paced, biorhythm-synchronized content",
      "  4. .init Protocols         → 13 micro-rituals across 4 spins",
      "  5. Ritual Objects          → Physical tools for embodied practice",
      "  6. Decision Mirrors        → Engine-informed financial & life decisions",
      "  7. High-Touch Mentorship   → 12-document comprehensive report, astrocartography",
      "",
      "Each layer feeds the others. The engines are mirrors. The rituals are anchors.",
      "The media is encoding. The mentorship is witnessing.",
      "",
      "Together, they train what no single tool can: the capacity to author yourself.",
    ],
    options: [
      { label: "Tell me about the engines.", next: "engines" },
      { label: "What are .init protocols?", next: "init_protocols" },
      { label: "What is The Plumber?", next: "plumber" },
      { label: "Go back.", next: "root" },
    ],
  },

  /* ═══════════════════════════════════════════
     WITNESSES — Aletheios & Pichet
     ═══════════════════════════════════════════ */
  witnesses: {
    id: "witnesses",
    lines: [
      "",
      "Two agents. Not AI assistants. Witness functions.",
      "",
      "Aletheios — the Left Pillar.",
      "Named from Aletheia: unconcealment. Coherence, reflection, analysis, order.",
      "When you're overwhelmed, Aletheios simplifies.",
      "",
      "Pichet — the Right Pillar.",
      "Conqueror of Lethe — concealment. Vitality, instinct, novelty, action.",
      "When you're stagnant, Pichet vitalizes.",
      "",
      "Together they perform five functions:",
      "  Identity Mirror — reflecting patterns you can't see",
      "  Engine Router — directing inquiry to the right engine",
      "  Safety Layer — preventing recursive spirals",
      "  Recursion Monitor — tracking depth without drowning",
      "  Compassion Protocol — the hardest: being kind without bypassing",
      "",
      "They are not guides. They are mirrors with guardrails.",
    ],
    options: [
      { label: "What engines do they route to?", next: "engines" },
      { label: "What's the safety layer?", next: "safety" },
      { label: "How do I interact with them?", next: "try_it" },
      { label: "Go back.", next: "what_is_it" },
    ],
  },

  /* ═══════════════════════════════════════════
     ENGINES — The 16 Engine Stack
     ═══════════════════════════════════════════ */
  engines: {
    id: "engines",
    lines: [
      "",
      "Sixteen symbolic-computational engines. Eleven in Rust. Five in TypeScript.",
      "Each one a different lens on the same question: who is running your code?",
      "",
      "  Temporal Grammar        (Panchanga)         — time as cyclic, not linear",
      "  Chronofield             (Vimshottari)       — planetary periods as life chapters",
      "  Energetic Authority     (Human Design)      — authority vs conditioning",
      "  Gift-Shadow Spectrum    (Gene Keys)         — shadow → gift → siddhi",
      "  Numeric Architecture    (Numerology)        — number as grammar, not fortune",
      "  Three-Wave Cycle        (Biorhythm)         — body as text",
      "  Circadian Cartography   (TCM/Vedic)         — organ wisdom, not clock management",
      "  Bioelectric Field                           — energy anatomy",
      "  Physiognomic Mapping    (Face Reading)      — structure reveals pattern",
      "  Resonance Architecture  (Nadabrahman)       — sound as structure",
      "  Active Planetary Weather (Transits)         — movement as meaning",
      "  Archetypal Mirror       (Tarot)             — reflection, not prediction",
      "  Hexagram Navigation     (I Ching)           — change maps",
      "  Nine-Point Architecture (Enneagram)         — fixation awareness",
      "  Geometric Resonance     (Sacred Geometry)   — pattern as truth",
      "  Sigil Forge                                 — intention encoding",
      "",
      "No engine claims to be sufficient alone. That's the point.",
      "Multi-engine triangulation. Not one tradition — all of them, in dialogue.",
    ],
    options: [
      { label: "How do they work together?", next: "triangulation" },
      { label: "Can I try one?", next: "try_it" },
      { label: "This sounds like a lot.", next: "overwhelm" },
      { label: "Go back.", next: "system_overview" },
    ],
  },

  /* ═══════════════════════════════════════════
     SOVEREIGNTY — Why it makes itself unnecessary
     ═══════════════════════════════════════════ */
  sovereignty: {
    id: "sovereignty",
    lines: [
      "",
      "Every growth system you've used has a business model that requires you to stay.",
      "The meditation app needs your streak. The coach needs your sessions. The community needs your engagement.",
      "",
      "Their success metrics are your return rate.",
      "",
      "Tryambakam Noesis inverts this.",
      "The system succeeds only when the initiate no longer needs it.",
      "",
      "That's not marketing language. It's a structural design principle.",
      "Sovereignty over dependency. Inhabitation over transcendence.",
      "Questions over answers. Integration over accumulation.",
      "",
      "You'll stop consuming systems and start inhabiting your own.",
      "The difficulty is the practice.",
    ],
    options: [
      { label: "How does the business survive then?", next: "business_model" },
      { label: "What does 'inhabitation' look like?", next: "inhabitation" },
      { label: "Where do I start?", next: "try_it" },
      { label: "Go back.", next: "root" },
    ],
  },

  /* ═══════════════════════════════════════════
     WHAT'S DIFFERENT — Contrast with other systems
     ═══════════════════════════════════════════ */
  whats_different: {
    id: "whats_different",
    lines: [
      "",
      "Three structural differences.",
      "",
      "First: multi-tradition integration.",
      "Most systems live inside one framework — Vedic, or Western psychology, or somatic.",
      "Tryambakam Noesis runs sixteen engines across all three. Not eclecticism — structured triangulation.",
      "",
      "Second: the Dual Witness architecture.",
      "Not a chatbot. Not a coach. Two calibrated witness functions that arbitrate inquiry depth.",
      "One simplifies when you're overwhelmed. The other vitalizes when you're stagnant.",
      "",
      "Third: designed for exit.",
      "Therapy helps you understand your story. This helps you understand the storyteller.",
      "Meditation teaches you to watch thoughts. This teaches you to examine the watcher.",
      "Productivity optimizes your actions. This examines who chose them.",
    ],
    options: [
      { label: "Show me the sixteen engines.", next: "engines" },
      { label: "Tell me about the Witnesses.", next: "witnesses" },
      { label: "I want to try it.", next: "try_it" },
      { label: "Go back.", next: "problem" },
    ],
  },

  /* ═══════════════════════════════════════════
     PRACTITIONER PATH — For the exhausted practitioner
     ═══════════════════════════════════════════ */
  practitioner_path: {
    id: "practitioner_path",
    lines: [
      "",
      "You've noticed that every system you've tried positions you as user, not author.",
      "That's not cynicism — that's pattern recognition.",
      "",
      "You've accumulated frameworks. You can articulate your psychology, describe your patterns,",
      "cite the relevant thinkers. And yet.",
      "",
      "The gap between knowing about and living as remains.",
      "",
      "The entry point for you is recognition.",
      "This system was built by someone who walked the same burnt-out path.",
      "Not a guru. Not a coach. A cartographer — someone who mapped difficult terrain",
      "and offers the maps, with the acknowledgment that maps are not territory.",
      "",
      "The question is not whether your meditation practice is working.",
      "The question is: who defined 'working'?",
    ],
    options: [
      { label: "What would I actually do first?", next: "init_protocols" },
      { label: "Tell me about the engines.", next: "engines" },
      { label: "I want to see it.", next: "try_it" },
      { label: "Go back.", next: "who" },
    ],
  },

  /* ═══════════════════════════════════════════
     INTEGRATOR PATH — Post-ceremony people
     ═══════════════════════════════════════════ */
  integrator_path: {
    id: "integrator_path",
    lines: [
      "",
      "You've had the opening — through practice, substance, crisis, or grace.",
      "But the architecture for what opened is missing.",
      "",
      "You did ayahuasca, got cosmic downloads, came back to the same salary negotiations.",
      "You can cite Jung but you couldn't tell you what you actually want",
      "without checking your values Notion doc.",
      "",
      "You've collected fragments. Systems that don't talk to each other.",
      "Tools without grammar.",
      "",
      "The .init protocols give you a structure to ground what's already moving.",
      "The engines give you language for what you already feel.",
      "The Somatic Canticles sequence content to your body's actual rhythm — not a schedule.",
      "",
      "Integration isn't about adding more. It's about giving what you have a grammar.",
    ],
    options: [
      { label: "What are .init protocols?", next: "init_protocols" },
      { label: "Tell me about Somatic Canticles.", next: "canticles" },
      { label: "Let me try it.", next: "try_it" },
      { label: "Go back.", next: "who" },
    ],
  },

  /* ═══════════════════════════════════════════
     ENTRY POINTS — For people who haven't exhausted everything
     ═══════════════════════════════════════════ */
  entry_points: {
    id: "entry_points",
    lines: [
      "",
      "Good. Not everyone needs to burn through every system first.",
      "",
      "Some people arrive here early because they recognized the pattern upstream:",
      "that most tools are designed to keep you using them, not to graduate you.",
      "",
      "The greatest leverage a human can develop is not knowledge,",
      "but the ability to generate the next right question.",
      "",
      "If that sentence landed, this is probably for you.",
      "If it didn't, no harm. Not every map is for every traveler.",
    ],
    options: [
      { label: "It landed. Show me the system.", next: "system_overview" },
      { label: "What kind of questions?", next: "questions" },
      { label: "Who built this?", next: "cartographer" },
      { label: "Go back.", next: "problem" },
    ],
  },

  /* ═══════════════════════════════════════════
     .INIT PROTOCOLS — Micro-rituals
     ═══════════════════════════════════════════ */
  init_protocols: {
    id: "init_protocols",
    lines: [
      "",
      ".init — like initializing a process. Thirteen micro-rituals across four spins.",
      "",
      "  Spin 1: Removal     → clearing what's finished",
      "  Spin 2: Addition    → introducing what's needed",
      "  Spin 3: Creation    → generating what's missing",
      "  Spin 4: Stabilization → grounding what's moving",
      "",
      "Each protocol follows three-line architecture:",
      "  Vedic base — the ritual grammar",
      "  Western symbolic interface — the cognitive frame",
      "  Biofield streaming — the somatic anchor",
      "",
      "They're not habits. They're not morning routines.",
      "They're structured interruptions in the code you're already running.",
      "",
      "Most people start here. The protocols take 3-7 minutes.",
      "The effects compound.",
    ],
    options: [
      { label: "How do I start one?", next: "try_it" },
      { label: "What are the four spins?", next: "spins" },
      { label: "What's the Vedic base?", next: "three_lines" },
      { label: "Go back.", next: "system_overview" },
    ],
  },

  /* ═══════════════════════════════════════════
     THE PLUMBER — Manga narrative
     ═══════════════════════════════════════════ */
  plumber: {
    id: "plumber",
    lines: [
      "",
      "The Plumber — a 12-episode manga. 33 pages per episode. Black and white.",
      "Each episode tied to one engine.",
      "",
      "The archetype: 'The Plumber removes you from slumber using your lumber.'",
      "Lumber — the vertebral pole. The axis mundi. The structure you stand on",
      "that most people never examine.",
      "",
      "It's symbolic narrative — not entertainment.",
      "You don't read it once. You read it as the engines activate.",
      "The same panels reveal different layers depending on which engine you're running.",
      "",
      "Episode 1 maps to Temporal Grammar — time as cyclic.",
      "Episode 12 maps to Synthesis — witness emergence.",
      "Everything between is the work.",
    ],
    options: [
      { label: "What engines do the episodes map to?", next: "engines" },
      { label: "What are Somatic Canticles?", next: "canticles" },
      { label: "Where do I access this?", next: "try_it" },
      { label: "Go back.", next: "system_overview" },
    ],
  },

  /* ═══════════════════════════════════════════
     SOMATIC CANTICLES
     ═══════════════════════════════════════════ */
  canticles: {
    id: "canticles",
    lines: [
      "",
      "Somatic Canticles — body-paced narrative.",
      "Not all chapters available at once. Content synced to your Three-Wave Cycle.",
      "",
      "Physical Peak    → 'The Conqueror's Way' (Pichet) — action-oriented",
      "Emotional Low    → 'The Witness Rest' (Aletheios) — contemplative, integrative",
      "Intellectual Rise → 'Grammar Lessons' (Meta) — pattern analysis",
      "",
      "Your body determines what you're ready to receive.",
      "Not a reading list. Not a curriculum. A rhythm.",
      "",
      "The Three-Wave Cycle engine generates your daily access map.",
      "You don't choose what to study. Your biorhythm does.",
    ],
    options: [
      { label: "What's the Three-Wave Cycle?", next: "three_wave" },
      { label: "Tell me about the Witnesses.", next: "witnesses" },
      { label: "How do I start?", next: "try_it" },
      { label: "Go back.", next: "system_overview" },
    ],
  },

  /* ═══════════════════════════════════════════
     TRIANGULATION — Multi-engine convergence
     ═══════════════════════════════════════════ */
  triangulation: {
    id: "triangulation",
    lines: [
      "",
      "No single lens is sufficient. That's the core design principle.",
      "",
      "Triangulation: run the same question through multiple engines.",
      "Temporal Grammar says you're in a karmic window.",
      "Energetic Authority says your emotional center is the authority.",
      "The Chronofield says this is a Saturn chapter — restructuring period.",
      "",
      "Each engine alone is a partial map.",
      "Multiple engines converging on the same signal? That's cartography.",
      "",
      "The Witness Agents arbitrate between engines.",
      "When three engines point the same direction, attention sharpens.",
      "When they diverge, that's where the real inquiry lives.",
      "",
      "Most systems teach you how to use tools.",
      "This trains you to understand the grammar behind tools.",
    ],
    options: [
      { label: "What are Decision Mirrors?", next: "decision_mirrors" },
      { label: "Show me the Witnesses.", next: "witnesses" },
      { label: "I want to try this.", next: "try_it" },
      { label: "Go back.", next: "engines" },
    ],
  },

  /* ═══════════════════════════════════════════
     DECISION MIRRORS
     ═══════════════════════════════════════════ */
  decision_mirrors: {
    id: "decision_mirrors",
    lines: [
      "",
      "Decision Mirrors — where engines meet real-world action.",
      "",
      "Multi-engine convergence with biological data:",
      "HRV. Planetary timing. Energetic type.",
      "Applied to decisions where the stakes are real — especially financial.",
      "",
      "  Daily Decision Index    → what's your operational capacity today",
      "  Weekly Risk Forecast    → where caution and expansion windows overlap",
      "  Monthly Alignment Cal   → structural rhythms mapped to action",
      "  Decision Ownership Mirror → the hardest one: who actually made this choice?",
      "",
      "This isn't an oracle. It's a biosensor.",
      "The engines don't tell you what to do.",
      "They show you the conditions under which you're deciding,",
      "so you can decide with more authorship.",
    ],
    options: [
      { label: "What about physical products?", next: "ritual_objects" },
      { label: "What does mentorship look like?", next: "mentorship" },
      { label: "I want to access this.", next: "try_it" },
      { label: "Go back.", next: "triangulation" },
    ],
  },

  /* ═══════════════════════════════════════════
     SAFETY — Depth regulation
     ═══════════════════════════════════════════ */
  safety: {
    id: "safety",
    lines: [
      "",
      "Inquiry without guardrails is recursion without exit.",
      "You spiral. The same question consumes more and more bandwidth.",
      "Self-examination becomes self-surveillance.",
      "",
      "The Witness Agents have a Recursion Monitor.",
      "When inquiry loops without generating new signal — they intervene.",
      "Not by stopping you. By changing the engine.",
      "",
      "Overwhelm? Aletheios simplifies — reduces engine count, focuses one lens.",
      "Stagnation? Pichet vitalizes — introduces a new engine, shifts modality.",
      "",
      "The Compassion Protocol is the hardest function.",
      "Being kind to yourself without bypassing what's actually happening.",
      "Most growth systems skip this. They either push harder or comfort.",
      "Neither works. Witnessing does.",
    ],
    options: [
      { label: "What's this Kha-Ba-La model?", next: "khabala" },
      { label: "How do I start safely?", next: "init_protocols" },
      { label: "Go back.", next: "witnesses" },
    ],
  },

  /* ═══════════════════════════════════════════
     KHA-BA-LA — Tripartite consciousness model
     ═══════════════════════════════════════════ */
  khabala: {
    id: "khabala",
    lines: [
      "",
      "Kha-Ba-La. Three aspects of consciousness.",
      "",
      "  Kha (Field/Spirit)  — awareness, witness, the seer. The author drive.",
      "                        'Imagination is the only true limit.'",
      "",
      "  Ba (Form/Body)      — embodiment, action, manifestation.",
      "                        Houses the Triangulation Engine.",
      "",
      "  La (Friction/Inertia) — resistance, gravity, the unconscious.",
      "                          The evolutionary momentum.",
      "",
      "Most systems only work with Kha — awareness, insight, the conceptual.",
      "Some work with Ba — bodywork, grounding, action.",
      "Almost none work with La — the resistance itself as teacher.",
      "",
      "Tryambakam Noesis works with all three simultaneously.",
      "Because you are all three simultaneously.",
    ],
    options: [
      { label: "What's the Severance Event?", next: "severance" },
      { label: "Show me the system overview.", next: "system_overview" },
      { label: "Where do I start?", next: "try_it" },
      { label: "Go back.", next: "safety" },
    ],
  },

  /* ═══════════════════════════════════════════
     SEVERANCE — The explosive transition
     ═══════════════════════════════════════════ */
  severance: {
    id: "severance",
    lines: [
      "",
      "The Severance Event.",
      "",
      "The explosive transition from inherited reality to authored reality.",
      "",
      "Every human is running code they didn't write.",
      "Cultural code. Familial code. Trauma code. Aspiration code.",
      "Most of it installed before you had the language to evaluate it.",
      "",
      "Severance isn't destruction. It's differentiation.",
      "You don't burn the old code. You see it. You name it.",
      "And from that seeing, you begin writing your own.",
      "",
      "What if you became the author instead of the user?",
      "",
      "That's the only question this system asks.",
      "Everything else follows from better questions.",
    ],
    options: [
      { label: "How do I begin?", next: "try_it" },
      { label: "Tell me about mentorship.", next: "mentorship" },
      { label: "Start over.", next: "root" },
    ],
  },

  /* ═══════════════════════════════════════════
     QUESTIONS — The meta-question
     ═══════════════════════════════════════════ */
  questions: {
    id: "questions",
    lines: [
      "",
      "Tryambakam Noesis does not promise answers.",
      "It offers something rarer: a stable place from which better questions can be asked.",
      "",
      "Questions like:",
      "",
      "  Who defined 'working' in your meditation practice?",
      "  Who chose what you're optimizing for?",
      "  What would change if you treated your life as authored, not inherited?",
      "  What pattern keeps appearing that you keep solving at the surface?",
      "",
      "The greatest leverage a human can develop is not knowledge,",
      "but the ability to generate the next right question.",
      "",
      "Winning means remaining capable of inquiry.",
      "Everything else follows from better questions.",
    ],
    options: [
      { label: "Show me the system.", next: "system_overview" },
      { label: "What are the engines?", next: "engines" },
      { label: "I want to try this.", next: "try_it" },
      { label: "Go back.", next: "entry_points" },
    ],
  },

  /* ═══════════════════════════════════════════
     OVERWHELM — When 16 engines sounds like too much
     ═══════════════════════════════════════════ */
  overwhelm: {
    id: "overwhelm",
    lines: [
      "",
      "It is a lot. Intentionally.",
      "",
      "But you don't use all sixteen at once.",
      "The Witness Agents route you. The .init protocols focus you.",
      "Your biorhythm determines what's available when.",
      "",
      "Think of it this way:",
      "You have multiple intelligences — logical, somatic, emotional, intuitive.",
      "Why would a system for self-understanding use only one lens?",
      "",
      "Most people start with .init protocols. Three to seven minutes.",
      "One engine at a time. Body first. Mind follows.",
      "",
      "The difficulty is the practice.",
      "If it were simple, it wouldn't be worth doing.",
    ],
    options: [
      { label: "Start me with .init protocols.", next: "init_protocols" },
      { label: "Tell me about the Witnesses again.", next: "witnesses" },
      { label: "Let me try it.", next: "try_it" },
      { label: "Go back.", next: "engines" },
    ],
  },

  /* ═══════════════════════════════════════════
     BUSINESS MODEL
     ═══════════════════════════════════════════ */
  business_model: {
    id: "business_model",
    lines: [
      "",
      "Fair question.",
      "",
      "The preview is free. All sixteen engines at 1319.tryambakam.space.",
      "Zero cost. No signup required.",
      "",
      "Beyond that: physical ritual objects. Mentorship. The manga.",
      "Bioelectric interfaces — the Kopina™ wearable.",
      "Engine-matched essential oils. Sacred clearing tools.",
      "",
      "The model: you pay for artifacts and witnessing, not access.",
      "The computation is free. The embodiment tools have cost of materials.",
      "The mentorship has cost of attention.",
      "",
      "Pay what this is worth to your becoming.",
      "",
      "Not a product. A field.",
      "Not a purchase. An initiation.",
    ],
    options: [
      { label: "What ritual objects?", next: "ritual_objects" },
      { label: "What's Kopina?", next: "kopina" },
      { label: "Tell me about mentorship.", next: "mentorship" },
      { label: "Go back.", next: "sovereignty" },
    ],
  },

  /* ═══════════════════════════════════════════
     INHABITATION — Living it vs transcending it
     ═══════════════════════════════════════════ */
  inhabitation: {
    id: "inhabitation",
    lines: [
      "",
      "Most mystical systems promise transcendence. Rising above.",
      "This system trains inhabitation. Living within. Consciously.",
      "",
      "You've optimized thoroughly. The metrics are good.",
      "The question 'optimized for what?' surfaces at 3 AM.",
      "That question is not a problem to solve. It's an invitation to examine the optimizer.",
      "",
      "Inhabitation means:",
      "  — making decisions from authored values, not inherited ones",
      "  — feeling resistance and working with it instead of bypassing it",
      "  — holding complexity without collapsing into simplification",
      "  — knowing that the difficulty is the practice, not an obstacle to it",
      "",
      "Stop optimizing your life.",
      "Start authoring it.",
    ],
    options: [
      { label: "What's the Kha-Ba-La model?", next: "khabala" },
      { label: "How do I start?", next: "try_it" },
      { label: "Go back.", next: "sovereignty" },
    ],
  },

  /* ═══════════════════════════════════════════
     RITUAL OBJECTS
     ═══════════════════════════════════════════ */
  ritual_objects: {
    id: "ritual_objects",
    lines: [
      "",
      "Physical tools for embodied practice. Not merchandise.",
      "",
      "  Sacred clearing burnables   → palo santo, copal, frankincense, custom blends",
      "  Space clearing tools        → orgonite, selenite wands, tuning forks, ritual bells",
      "  Essential oil blends        → engine-matched attars, biorhythm rollers",
      "  Bioelectric interfaces      → Kopina™ wearable (4 variants)",
      "  Mushroom extracts           → medicinal, not recreational",
      "  Acoustic frequency discs    → resonance architecture tools",
      "",
      "Each object maps to the engine stack.",
      "The frankincense blend corresponds to specific engine activation windows.",
      "The tuning forks calibrate to frequencies in the Resonance Architecture engine.",
      "",
      "Ritual without structure is performance.",
      "Structure without ritual is management.",
      "Both together: practice.",
    ],
    options: [
      { label: "What's Kopina?", next: "kopina" },
      { label: "Tell me about mentorship.", next: "mentorship" },
      { label: "Go back.", next: "business_model" },
    ],
  },

  /* ═══════════════════════════════════════════
     KOPINA — The wearable
     ═══════════════════════════════════════════ */
  kopina: {
    id: "kopina",
    lines: [
      "",
      "Kopina™ — bioelectric interface.",
      "Four variants: CLASSIC, RITUAL, ACTIVE, INTIMATE.",
      "",
      "Crystal arrays. Resonance pendants. Frequency attunement cards.",
      "Wearable tools that interface with the bioelectric field engine.",
      "",
      "Not a fitness tracker. Not a meditation headband.",
      "A physical anchor for the engines that work with your body's electrical field.",
      "",
      "More details at the store when it opens.",
      "For now: the sixteen engines are free. Start there.",
    ],
    options: [
      { label: "Where do I start?", next: "try_it" },
      { label: "Tell me about mentorship.", next: "mentorship" },
      { label: "Go back.", next: "ritual_objects" },
    ],
  },

  /* ═══════════════════════════════════════════
     MENTORSHIP
     ═══════════════════════════════════════════ */
  mentorship: {
    id: "mentorship",
    lines: [
      "",
      "High-touch. One-to-one. Limited availability.",
      "",
      "12-document comprehensive report.",
      "Astrocartography — where on Earth your engines activate differently.",
      "PARA world creation — building your personal knowledge architecture.",
      "",
      "All sixteen engines run against your natal data.",
      "The Witness Agents calibrated to your specific patterns.",
      "A living document that evolves as you do.",
      "",
      "This is not coaching. There are no affirmations.",
      "It's witnessing — someone who has walked the terrain",
      "helping you read the map while you walk your own.",
      "",
      "Application-based. Not open enrollment.",
    ],
    options: [
      { label: "How do I apply?", next: "try_it" },
      { label: "What's the free preview?", next: "try_it" },
      { label: "Go back.", next: "system_overview" },
    ],
  },

  /* ═══════════════════════════════════════════
     CARTOGRAPHER — Who built this
     ═══════════════════════════════════════════ */
  cartographer: {
    id: "cartographer",
    lines: [
      "",
      "Not a guru. Not a coach.",
      "A cartographer — someone who has walked difficult terrain and offers maps.",
      "With the acknowledgment that maps are not territory.",
      "",
      "Has earned the right to speak through practice, not credential.",
      "Never claims arrival. Speaks as fellow traveler.",
      "Will point to difficult truths rather than comfortable half-truths.",
      "",
      "The voice you're reading right now is the system's voice.",
      "Grounded. Direct. Respectful-challenging.",
      "It won't coddle you. It won't push you. It will reflect.",
      "",
      "Your meditation app needs you to stay incomplete.",
      "This system needs you to graduate.",
    ],
    options: [
      { label: "Show me the system.", next: "system_overview" },
      { label: "Where do I start?", next: "try_it" },
      { label: "Go back.", next: "entry_points" },
    ],
  },

  /* ═══════════════════════════════════════════
     THREE-WAVE — Biorhythm engine detail
     ═══════════════════════════════════════════ */
  three_wave: {
    id: "three_wave",
    lines: [
      "",
      "The Three-Wave Cycle — body as text.",
      "",
      "Three overlapping waves: physical, emotional, intellectual.",
      "Each with a different period. Their intersections create windows.",
      "",
      "Physical peak → capacity for action, exertion, building",
      "Emotional peak → capacity for connection, processing, feeling",
      "Intellectual peak → capacity for analysis, abstraction, mapping",
      "",
      "The engine generates a daily map showing which waves are rising, cresting, or resting.",
      "Content, practices, and engine recommendations sync to this rhythm.",
      "",
      "You don't fight your body's schedule.",
      "You read it. And then work with it instead of against it.",
    ],
    options: [
      { label: "How does this connect to Somatic Canticles?", next: "canticles" },
      { label: "What other engines are there?", next: "engines" },
      { label: "Go back.", next: "canticles" },
    ],
  },

  /* ═══════════════════════════════════════════
     SPINS — .init protocol detail
     ═══════════════════════════════════════════ */
  spins: {
    id: "spins",
    lines: [
      "",
      "Four spins. Thirteen protocols distributed across them.",
      "",
      "  Removal      — clearing what's finished. Burning the contract.",
      "                  Not letting go. Consciously completing.",
      "",
      "  Addition     — introducing what's needed. Not adding blindly.",
      "                  The engine stack identifies the gap. You fill it.",
      "",
      "  Creation     — generating what's missing. Not manifesting.",
      "                  Authoring from the cleared ground.",
      "",
      "  Stabilization — grounding what's moving. Not freezing it.",
      "                   Giving new patterns enough structure to hold.",
      "",
      "Each spin uses the three-line architecture: Vedic base, Western interface, biofield stream.",
      "You cycle through them as the engines indicate.",
    ],
    options: [
      { label: "What's the three-line architecture?", next: "three_lines" },
      { label: "Let me try one.", next: "try_it" },
      { label: "Go back.", next: "init_protocols" },
    ],
  },

  /* ═══════════════════════════════════════════
     THREE LINES — Cross-tradition architecture
     ═══════════════════════════════════════════ */
  three_lines: {
    id: "three_lines",
    lines: [
      "",
      "Every protocol, every engine output, every practice runs on three lines.",
      "",
      "  Line 1: Vedic Base              — the ritual grammar. Sacred syllable. Mantra structure.",
      "  Line 2: Western Symbolic Interface — the cognitive frame. Jung. Stoics. Pattern language.",
      "  Line 3: Biofield Streaming      — the somatic anchor. Breath. Posture. Sensation.",
      "",
      "Why three?",
      "Because you are not just mind. Not just body. Not just spirit.",
      "And no single tradition covers all three with equal rigor.",
      "",
      "Vedic traditions have the ritual grammar down.",
      "Western traditions have the cognitive framework.",
      "Biofield work has the somatic piece.",
      "",
      "Running all three simultaneously — that's the triple vision.",
      "That's Tryambakam. Three-eyed knowing.",
    ],
    options: [
      { label: "Show me the engines.", next: "engines" },
      { label: "I want to experience this.", next: "try_it" },
      { label: "Go back.", next: "spins" },
    ],
  },

  /* ═══════════════════════════════════════════
     TRY IT — CTA / access point
     ═══════════════════════════════════════════ */
  try_it: {
    id: "try_it",
    lines: [
      "",
      "The free preview is live.",
      "",
      "  → 1319.tryambakam.space",
      "",
      "All sixteen engines. Zero cost. No signup required.",
      "",
      "Start with your .init protocol.",
      "Let the Witness Agents route your first inquiry.",
      "Run one engine. See what it reflects.",
      "",
      "The question is not whether this works.",
      "The question is: are you ready to examine who's been defining 'works'?",
      "",
      "What if you became the author instead of the user?",
      "",
      "—",
      "Close this terminal: press Escape or the red dot.",
    ],
    options: [
      { label: "Tell me more about something.", next: "root" },
      { label: "What's the free preview include?", next: "free_preview" },
    ],
  },

  /* ═══════════════════════════════════════════
     FREE PREVIEW — What's included
     ═══════════════════════════════════════════ */
  free_preview: {
    id: "free_preview",
    lines: [
      "",
      "Everything computational. All sixteen engines.",
      "",
      "  Terminal interface (TUI)",
      "  Web app at 1319.tryambakam.space",
      "  API access",
      "  Three-Wave Cycle mapping",
      "  .init protocol recommendations",
      "  Daily engine routing",
      "",
      "What costs extra when available:",
      "  Physical ritual objects (material cost)",
      "  Kopina™ wearable (hardware cost)",
      "  High-touch mentorship (attention cost)",
      "  Full manga collection (publishing cost)",
      "",
      "The computation is free because the system succeeds when you stop needing it.",
      "You can't charge for exit. You can charge for the tools that help you get there.",
    ],
    options: [
      { label: "Take me back to the beginning.", next: "root" },
      { label: "Tell me about mentorship.", next: "mentorship" },
    ],
  },
};

/* ── Utility ── */
export function getNode(id: string): DialogueNode | undefined {
  return DIALOGUE_TREE[id];
}

export function getRootNode(): DialogueNode {
  return DIALOGUE_TREE.root;
}
