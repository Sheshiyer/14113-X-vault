/**
 * The 16 core sections of the NOESIS comprehensive report
 * plus 5 easter-egg sections.
 * Each section maps to one card in the 3D canvas and one detail page.
 */

export interface NoesisSection {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly sectionNumber: string;
  readonly description: string;
  readonly reportContent: string;
  readonly imageUrl: string;
  readonly imageDimensions: { readonly width: number; readonly height: number };
  readonly accentColor: string;
  readonly hookLine: string;
  readonly cartographerNote: string;
  readonly seekerQuestion: string;
  readonly keyInsight: string;
  readonly engineTags: readonly string[];
  readonly practicePrompt: string;
  readonly layoutKey: string;
  readonly archetypeLabel: "split" | "image" | "hero" | "terminal" | "timeline" | "dashboard";
}

export const NOESIS_SECTIONS: readonly NoesisSection[] = [
  // ── 1. Introduction ──
  {
    id: 1,
    slug: "introduction-from-systems-to-seeing",
    title: "From Systems to Seeing",
    subtitle: "Introduction",
    sectionNumber: "SEC.01",
    description: "Where the map meets the territory of consciousness.",
    reportContent:
      "NOESIS begins not as a product, but as a question: what happens when you stop consuming frameworks and start building capacity to author yourself?\n\n" +
      "Most self-knowledge systems ask you to identify with a type, a number, a chart. NOESIS inverts this. It hands you thirteen operational lenses \u2014 Vedic timing cycles, somatic body-maps, archetypal mirrors, biofield resonance patterns \u2014 and trains you to use all of them simultaneously until the pattern recognition becomes autonomous.\n\n" +
      "This is not information accumulation. It is capacity building. The word NOESIS itself comes from the Greek for direct knowing \u2014 perception that bypasses conceptual filtering and arrives as operational clarity. Every engine, every protocol, every artifact in this ecosystem exists to train that capacity.\n\n" +
      "The comprehensive report that follows maps the entire architecture: from the builder\u2019s experiential authority, through the engine stack, into the somatic and narrative layers, and finally to the material extensions that amplify the signal in physical space. Each section is both a standalone chapter and a node in a larger pattern. Read sequentially for the progressive arc, or enter anywhere \u2014 the system is designed to meet you where you are.",
    imageUrl: "/brand/2A-brand-kit-bento-nanobananapro-v1.png",
    imageDimensions: { width: 2752, height: 1536 },
    accentColor: "#00ff41",
    hookLine: "You've optimized everything. Why does clarity still elude you?",
    cartographerNote: "I built this map because I was lost in the same territory. Every productivity system I designed worked \u2014 and none of them mattered. NOESIS began the day I stopped building tools and started training perception.",
    seekerQuestion: "How is this different from another self-improvement framework?",
    keyInsight: "The problem was never insufficient systems \u2014 it was insufficient capacity.",
    engineTags: ["Witness Engine", "Cartographer Engine"],
    practicePrompt: "Name three systems you've built that solved a problem but didn't change how you see.",
    layoutKey: "layout-01",
    archetypeLabel: "hero",
  },

  // ── 2. The Core Problem ──
  {
    id: 2,
    slug: "the-core-problem-noesis-addresses",
    title: "The Core Problem",
    subtitle: "What NOESIS Addresses",
    sectionNumber: "SEC.02",
    description: "The crisis of meaning in an information-saturated age.",
    reportContent:
      "We live in the most information-rich era in human history, yet operational clarity is scarce. The modern practitioner has access to more systems, typologies, and frameworks than any previous generation \u2014 and less integration capacity than ever.\n\n" +
      "The problem is not lack of information. It is fragmentation. A person might know their Enneagram type, their Human Design bodygraph, their Vedic chart, and their Gene Keys profile \u2014 yet hold each as a separate, unconnected fragment. The mind becomes a museum of maps with no navigation protocol.\n\n" +
      "NOESIS addresses this directly. It does not add another framework to the collection. Instead, it provides the integration architecture that trains all frameworks to cross-reference, resolve apparent contradictions, and converge into operational protocols.\n\n" +
      "The practitioner\u2019s inner architecture \u2014 visualized here as luminous data streams flowing through a physiological cross-section \u2014 represents the goal: not more knowledge about patterns, but trained capacity to navigate them. The engines are the instruments. The practice is the training. The clarity is the capacity that emerges.",
    imageUrl: "/brand/8A-seeker-inner-architecture-nanobananapro-v1.png",
    imageDimensions: { width: 1792, height: 2400 },
    accentColor: "#52e7ff",
    hookLine: "More maps than any generation in history. Still no navigation capacity.",
    cartographerNote: "I watched brilliant people collect frameworks like trophies \u2014 Enneagram, Human Design, Gene Keys \u2014 and remain exactly as confused as before. Fragmentation was the problem.",
    seekerQuestion: "I already know my type, my chart, my design. What's missing?",
    keyInsight: "The absence isn't information. It's integration architecture.",
    engineTags: ["Enneagram Engine", "Human Design Engine", "Gene Keys Engine"],
    practicePrompt: "List every self-knowledge system you've studied. Now ask: which ones changed how you actually make decisions?",
    layoutKey: "layout-02",
    archetypeLabel: "split",
  },

  // ── 3. The Builder & Position of Authority ──
  {
    id: 3,
    slug: "the-builder-and-position-of-authority",
    title: "The Builder",
    subtitle: "The Position of Authority",
    sectionNumber: "SEC.03",
    description: "The cartographer who maps consciousness from lived experience.",
    reportContent:
      "Every system carries the signature of its maker. NOESIS is built not by a theorist but by a practitioner \u2014 someone who has personally tested the territories being mapped.\n\n" +
      "The position of authority here is not institutional. It is experiential. The builder has spent years working with each of the thirteen engines individually, testing their operational validity against lived experience, finding the convergence points where multiple systems reveal the same pattern from different angles.\n\n" +
      "This matters because NOESIS is not an aggregator. It is not a Wikipedia of traditions. It is a curated, pressure-tested synthesis created by someone who has used these tools in their own life \u2014 in decision-making, in crisis, in creative work, in daily practice \u2014 and discovered which combinations produce operational clarity versus intellectual entertainment.\n\n" +
      "The Cartographer archetype captured in these editorial portraits represents this position: contemplative yet operational, scholarly yet embodied, mapping the invisible with the precision of a surveyor and the rigor of an engineer. The authority comes not from credentials but from the territory walked.",
    imageUrl: "/brand/7A-cartographer-contact-sheet-nanobananapro-v1.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#f388ff",
    hookLine: "Not a guru. A cartographer who has walked the territory being mapped.",
    cartographerNote: "My authority comes from one place: I've personally run every engine against my own life, in crisis and in calm, for years. Theory didn't build this. Territory did.",
    seekerQuestion: "Why should I trust someone building yet another system?",
    keyInsight: "Authority earned through territory walked, not credentials displayed.",
    engineTags: ["Cartographer Engine", "Witness Engine"],
    practicePrompt: "Consider: whose guidance in your life comes from lived experience versus inherited authority?",
    layoutKey: "layout-03",
    archetypeLabel: "image",
  },

  // ── 4. NOESIS as an Infinite Game ──
  {
    id: 4,
    slug: "noesis-as-an-infinite-game",
    title: "The Infinite Game",
    subtitle: "NOESIS as Endless Practice",
    sectionNumber: "SEC.04",
    description: "A system designed to deepen, not to finish.",
    reportContent:
      "James Carse distinguished between finite games \u2014 played to win \u2014 and infinite games \u2014 played to continue playing. NOESIS is explicitly an infinite game.\n\n" +
      "There is no final state of pattern recognition capacity. There is no certification, no graduation badge, no moment where the system declares you \u2018done.\u2019 Instead, each engine reading reveals new operational questions. Each convergence point opens new territory. The capacity grows as the practice deepens.\n\n" +
      "This is by design. The stained-glass logo \u2014 light passing through colored glass, creating ever-shifting patterns on the floor \u2014 encodes this principle visually. The light (attention) is constant. The glass (the engines) is structured. But the patterns (operational insights) are infinite, changing with the angle of observation, the time of day, the season of life.\n\n" +
      "Practically, this means NOESIS does not optimize for \u2018user retention\u2019 through artificial hooks. It optimizes for depth. A person who uses one engine deeply for a year will build more capacity than someone who samples all thirteen in a week. The infinite game rewards patience, recursion, and the willingness to sit with complexity.",
    imageUrl: "/brand/2C-stained-glass-logo-nanobananapro-v2.png",
    imageDimensions: { width: 2752, height: 1536 },
    accentColor: "#00ff41",
    hookLine: "There is no certification. No graduation. No 'done.'",
    cartographerNote: "Every system I'd used before had an endpoint \u2014 a type assigned, a chart read, a score given. NOESIS was the first architecture where capacity replaced completion as the metric.",
    seekerQuestion: "If there's no endpoint, how do I know it's working?",
    keyInsight: "The infinite game rewards patience, recursion, and sitting with complexity.",
    engineTags: ["All Engines"],
    practicePrompt: "Identify one area of your life where you keep trying to 'finish' what is actually an ongoing practice.",
    layoutKey: "layout-04",
    archetypeLabel: "hero",
  },

  // ── 5. The Witness Dyad ──
  {
    id: 5,
    slug: "the-witness-dyad",
    title: "The Witness Dyad",
    subtitle: "Internal Guardrails",
    sectionNumber: "SEC.05",
    description: "Aletheios and Pichet \u2014 the twin watchers within.",
    reportContent:
      "Every powerful system needs internal regulation. NOESIS embeds two operational modes into its architecture: Aletheios (pattern recognition) and Pichet (integration rest).\n\n" +
      "Aletheios represents the capacity for radical honesty \u2014 the willingness to see what the engines reveal without flinching, even when the pattern is uncomfortable. When three engines converge on the same shadow, Aletheios is the mode that does not look away.\n\n" +
      "Pichet represents the equally important capacity for rest, integration, and strategic patience. Not every pattern demands immediate action. Some readings need to be held lightly, revisited across multiple cycles, allowed to mature before they become operational clarity.\n\n" +
      "The copper seal \u2014 with its patina of age and geometric core \u2014 encodes the Witness Dyad visually. The oxidized surface represents the passage of time required for genuine integration. The geometric center represents the unchanging protocol from which both pattern recognition and integration rest arise. Together, they prevent NOESIS from becoming either a tool of avoidance (all rest, no truth) or compulsive analysis (all truth, no rest).",
    imageUrl: "/brand/2B-copper-seal-flux2pro-v1.png",
    imageDimensions: { width: 1024, height: 1024 },
    accentColor: "#b8860b",
    hookLine: "Two watchers. One sees truth. One knows when to rest.",
    cartographerNote: "I built in the Witness Dyad after I burned out from relentless self-analysis. Aletheios without Pichet is compulsive truth-seeking. Pichet without Aletheios is spiritual bypassing.",
    seekerQuestion: "How do I know when to push deeper versus when to step back?",
    keyInsight: "Every powerful system needs internal regulation \u2014 truth and rest in balance.",
    engineTags: ["Witness Engine", "HRV Engine", "Biorhythm Engine"],
    practicePrompt: "Ask yourself honestly: am I in Aletheios mode (relentless analysis) or Pichet mode (avoidant rest) right now?",
    layoutKey: "layout-05",
    archetypeLabel: "dashboard",
  },

  // ── 6. The Engine Stack ──
  {
    id: 6,
    slug: "the-engine-stack",
    title: "The Engine Stack",
    subtitle: "13 Engines of Self-Knowledge",
    sectionNumber: "SEC.06",
    description: "Thirteen lenses, one integrated field of seeing.",
    reportContent:
      "At the technical core of NOESIS sits the Engine Stack \u2014 thirteen distinct calculation engines, each implementing a different tradition\u2019s approach to pattern recognition.\n\n" +
      "The Vedic Family (3 engines): Vimshottari Dasha maps 120-year planetary period cycles. Nakshatra Engine decodes the 27 lunar mansions\u2019 psycho-emotional patterns. Chakra-Kosha Mapping correlates bioelectric centers with the five physiological sheaths.\n\n" +
      "The Western Family (5 engines): Human Design synthesizes I Ching, Kabbalah, astrology, and bioelectric systems into a personal bodygraph. Gene Keys maps 64 archetypal patterns along Shadow-Gift-Siddhi spectrums. Enneagram reveals core motivations and growth trajectories. Numerology derives operational patterns from birth data and name vibrations. Tarot provides a 78-card archetypal mirror.\n\n" +
      "The Bridge Family (2 engines): Astrocartography maps planetary influence zones geospatially. TCM Organ Clock tracks bioelectric flow through twelve meridians in two-hour cycles.\n\n" +
      "The Biofield Family (3 engines): Biorhythm Engine tracks physical, emotional, and intellectual sine-wave cycles. HRV Engine measures autonomic nervous system coherence. Biofield & Raga correlates Indian classical ragas with bioelectric resonance frequencies.\n\n" +
      "No single engine tells the whole story. The power is in their convergence \u2014 when multiple engines from different traditions illuminate the same pattern, the signal becomes unmistakable.",
    imageUrl: "/brand/5D-1-vedic-engine-icons-recraft-v1.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#c65d3b",
    hookLine: "Thirteen engines. Not metaphors. Operating protocols.",
    cartographerNote: "Each engine was extracted from failure, not theory. The Witness Engine emerged when I realized observation without structure is just dissociation.",
    seekerQuestion: "How is this different from another personality framework with arbitrary categories?",
    keyInsight: "Engines are not types you are \u2014 they are operations you run.",
    engineTags: ["Vimshottari Dasha", "Nakshatra Engine", "Chakra-Kosha", "Human Design", "Gene Keys", "Enneagram", "Numerology", "Tarot", "Astrocartography", "TCM Organ Clock", "Biorhythm", "HRV Engine", "Biofield & Raga"],
    practicePrompt: "Identify which engine you defaulted to in your last difficult conversation. Was it the right one?",
    layoutKey: "layout-06",
    archetypeLabel: "terminal",
  },

  // ── 7. Engine Arbitration & Coherence ──
  {
    id: 7,
    slug: "engine-arbitration-and-coherence",
    title: "Arbitration & Coherence",
    subtitle: "When Engines Disagree",
    sectionNumber: "SEC.07",
    description: "How conflicting readings become richer understanding.",
    reportContent:
      "When thirteen engines analyze the same person, they will not always agree. The Enneagram may suggest withdrawal while Human Design calls for engagement. Biorhythms may signal a physical peak while the Vedic chart indicates a resting period. This is not a bug \u2014 it is the most valuable feature of the system.\n\n" +
      "Engine arbitration is the process of holding multiple, apparently contradictory readings simultaneously and discovering the higher-order pattern they collectively describe. A physical peak combined with a Vedic resting period might mean: this is the time for intense inner work, not external action. The body has energy; direct it inward.\n\n" +
      "NOESIS provides coherence scoring \u2014 a confidence metric that rises when multiple engines converge and flags when they diverge. High convergence means the signal is clear and action can be taken with confidence. High divergence means the situation is genuinely complex and deserves slower, more careful attention.\n\n" +
      "The Enneagram poster shown here represents one node in this arbitration network. Each engine poster in the system is designed not as a standalone reference but as part of a visual language that makes cross-engine patterns legible at a glance.",
    imageUrl: "/brand/9A-07-enneagram-poster-v1.png",
    imageDimensions: { width: 1792, height: 2400 },
    accentColor: "#ffc24a",
    hookLine: "When your chart says go and your body says stop \u2014 that's the signal.",
    cartographerNote: "The most valuable readings I've ever done were the ones where engines contradicted each other. The contradiction was the message.",
    seekerQuestion: "What happens when the systems disagree? Doesn't that prove they're arbitrary?",
    keyInsight: "Divergence between engines reveals complexity deserving slower attention.",
    engineTags: ["All Engines", "Coherence Scoring"],
    practicePrompt: "Think of a recent decision where your head and gut disagreed. What would a third perspective have revealed?",
    layoutKey: "layout-07",
    archetypeLabel: "timeline",
  },

  // ── 8. Somatic Canticles ──
  {
    id: 8,
    slug: "somatic-canticles",
    title: "Somatic Canticles",
    subtitle: "The Body as Instrument",
    sectionNumber: "SEC.08",
    description: "Where engine data meets embodied practice.",
    reportContent:
      "Pattern recognition that stays conceptual is not yet operational. The Somatic Canticles are NOESIS\u2019s answer to the integration gap \u2014 the distance between understanding a pattern intellectually and embodying it physiologically.\n\n" +
      "Each Canticle is a guided protocol \u2014 part breathwork, part body scan, part movement sequence \u2014 that takes a specific engine reading and translates it into somatic practice. If your Chakra-Kosha mapping reveals a constriction in the heart sheath, the corresponding Canticle guides you through breathwork and movement that addresses that specific bioelectric pattern.\n\n" +
      "The Somatic Codex \u2014 visualized here as a premium hardcover volume with gilt-edge pages \u2014 represents the written form of these protocols. Body-map illustrations on each page connect anatomical awareness with bioelectric patterns, creating a physical reference that anchors the digital engine readings in tangible practice.\n\n" +
      "The Canticles are not generic wellness exercises. They are engine-specific, reading-specific, and time-specific \u2014 delivered when the biorhythm and Vedic timing engines indicate the body is most receptive to that particular form of integration. The body\u2019s clock chooses the protocol. The practitioner\u2019s only job is to execute.",
    imageUrl: "/brand/3B-somatic-codex-nanobananapro-v1.png",
    imageDimensions: { width: 1792, height: 2400 },
    accentColor: "#b8860b",
    hookLine: "Pattern recognition that stays conceptual is not yet operational.",
    cartographerNote: "I could recite my entire Enneagram profile from memory and still fall into the same pattern every time stress hit. The body hadn't trained what the mind knew.",
    seekerQuestion: "I already meditate. How is this different from guided meditation?",
    keyInsight: "Canticles are engine-specific, reading-specific, and biorhythm-timed \u2014 not generic.",
    engineTags: ["Chakra-Kosha Engine", "Biorhythm Engine", "HRV Engine", "Somatic Canticles"],
    practicePrompt: "Place your hand on the part of your body that holds tension right now. What would that area say if it could speak?",
    layoutKey: "layout-08",
    archetypeLabel: "image",
  },

  // ── 9. The Plumber ──
  {
    id: 9,
    slug: "the-plumber-manga-narrative",
    title: "The Plumber",
    subtitle: "Manga Narrative Engine",
    sectionNumber: "SEC.09",
    description: "The one who fixes the pipes of consciousness.",
    reportContent:
      "The Plumber is NOESIS\u2019s narrative archetype \u2014 a manga character who makes the invisible visible through the metaphor of infrastructure repair.\n\n" +
      "In the NOESIS framework, physiology has infrastructure. Bioelectric currents flow through channels (nadis), pool in junctions (chakras), and sometimes get blocked, misdirected, or stagnant. The Plumber is the figure who goes into the basement of the system with a wrench (that is also a vajra) and fixes what\u2019s broken.\n\n" +
      "Rendered in Art Nouveau style \u2014 Mucha-inspired flowing lines and floral borders \u2014 The Plumber manga bridges high art and underground culture, technical imagery and blue-collar practicality. This is deliberate. NOESIS rejects the false division between technical and embodied. Fixing a leaky pipe and clearing a blocked bioelectric channel are the same gesture at different scales.\n\n" +
      "Each manga episode is tied to specific engine readings. The narrative unfolds differently depending on the reader\u2019s current biorhythm state and Vedic timing. Certain panels contain hidden API key fragments \u2014 Easter eggs that reward the attentive reader with deeper access to the engine stack. The story is both entertainment and training technology.",
    imageUrl: "/brand/5C-art-nouveau-plumber-recraft-v1.png",
    imageDimensions: { width: 1024, height: 1365 },
    accentColor: "#c65d3b",
    hookLine: "Physiology has infrastructure. Someone has to fix the pipes.",
    cartographerNote: "The Plumber archetype emerged from my own frustration with abstract frameworks that floated above the mess. Real work happens in the basement, with a wrench.",
    seekerQuestion: "A manga character for pattern recognition? Isn't this trivializing the work?",
    keyInsight: "Fixing a leaky pipe and clearing a blocked bioelectric channel are the same gesture.",
    engineTags: ["Chakra-Kosha Engine", "TCM Organ Clock", "Narrative Engine"],
    practicePrompt: "What 'pipe' in your inner architecture has been leaking energy? Name it without spiritualizing it.",
    layoutKey: "layout-09",
    archetypeLabel: "split",
  },

  // ── 10. The Infinite Treasure Hunt ──
  {
    id: 10,
    slug: "the-infinite-treasure-hunt",
    title: "The Infinite Treasure Hunt",
    subtitle: "Commentary & Discovery",
    sectionNumber: "SEC.10",
    description: "Purushartha commentaries with embedded puzzles.",
    reportContent:
      "The Infinite Treasure Hunt is NOESIS\u2019s training layer \u2014 but \u2018training\u2019 undersells it. It is closer to an operational exam wrapped in a scavenger hunt.\n\n" +
      "At its core are the Purushartha commentaries: deep reflections on the four operational vectors of human life \u2014 Dharma (alignment), Artha (resource), Kama (drive), and Moksha (release). Each commentary contains steganographic puzzles that can only be solved by running specific engine calculations.\n\n" +
      "The heritage engraving style \u2014 fine crosshatch lines evoking 18th-century scientific illustration \u2014 encodes this duality visually. The surface is beautiful, traditional, contemplative. Beneath the surface is a puzzle layer that rewards technical fluency and pattern recognition.\n\n" +
      "Solving a treasure hunt puzzle yields API key fragments, unlocked chapters, and access to deeper layers of the system. The difficulty scales: early puzzles require a single engine reading; later puzzles require cross-engine synthesis and convergence detection. The hunt has no endpoint. As new engine capabilities are added, new puzzles emerge. The treasure is not the key \u2014 it is the pattern recognition capacity that the hunt trains.",
    imageUrl: "/brand/5A-heritage-engraving-recraft-v1.png",
    imageDimensions: { width: 1024, height: 1024 },
    accentColor: "#c65d3b",
    hookLine: "The treasure is not the key. It's the pattern recognition capacity.",
    cartographerNote: "I hid the puzzles because the act of solving them is itself engine training. You can't crack a cross-engine puzzle without building the exact capacity NOESIS trains.",
    seekerQuestion: "Training puzzles for pattern recognition \u2014 isn't that manipulative?",
    keyInsight: "Puzzles that require cross-engine synthesis train the capacity they test.",
    engineTags: ["All Engines", "Purushartha Commentary"],
    practicePrompt: "Choose one decision you're currently facing. Run it through two different frameworks. Where do they converge?",
    layoutKey: "layout-10",
    archetypeLabel: "hero",
  },

  // ── 11. Financial & Decision Mirrors ──
  {
    id: 11,
    slug: "financial-and-decision-mirrors",
    title: "Decision Mirrors",
    subtitle: "Financial & Strategic Oracle",
    sectionNumber: "SEC.11",
    description: "Multi-engine synthesis for consequential choices.",
    reportContent:
      "Decision Mirrors are NOESIS\u2019s decision support interface \u2014 a structured protocol to bring multiple engine readings to bear on a specific consequential choice.\n\n" +
      "When facing a consequential decision (\u2018Should I take this job?\u2019 \u2018Is this the right time to move?\u2019 \u2018How should I allocate resources this quarter?\u2019), the Decision Mirror runs a targeted multi-engine analysis. It pulls the relevant Vedic timing, biorhythm state, Human Design strategy, Gene Keys pattern, and numerological cycle \u2014 then synthesizes them into a coherent operational framework.\n\n" +
      "The campaign visual identity grid shown here represents the systematic nature of this synthesis. Multiple panels, multiple angles, multiple data streams \u2014 all converging into a single decision support protocol. The grid format mirrors how Decision Mirrors present information: not as a single answer, but as a structured field of consideration.\n\n" +
      "Critically, Decision Mirrors do not make decisions. They illuminate the field within which decisions happen. They reveal timing patterns (\u2018not yet\u2019 vs \u2018now\u2019), alignment patterns (\u2018this resonates with your configuration\u2019 vs \u2018this conflicts\u2019), and capacity patterns (\u2018you have bandwidth\u2019 vs \u2018you\u2019re depleted\u2019). The decision remains the practitioner\u2019s. The mirror just makes the invisible factors visible.",
    imageUrl: "/brand/5B-campaign-visual-identity-grid-nanobananapro-v1.png",
    imageDimensions: { width: 1792, height: 2400 },
    accentColor: "#c65d3b",
    hookLine: "Your next big decision has invisible variables. Make them visible.",
    cartographerNote: "The first Decision Mirror I ran was on a career move. Three engines said 'not yet' while my ambition screamed 'now.' I waited. The pattern was right.",
    seekerQuestion: "Engine readings for financial decisions? That sounds like pattern matching for stock picks.",
    keyInsight: "Decision Mirrors illuminate the operational field \u2014 they don't make the choice.",
    engineTags: ["Vimshottari Dasha", "Biorhythm Engine", "Human Design", "Numerology", "Gene Keys"],
    practicePrompt: "Name a decision you're currently postponing. What invisible factor might be influencing the delay?",
    layoutKey: "layout-11",
    archetypeLabel: "dashboard",
  },

  // ── 12. Init Protocols & Micro-Rituals ──
  {
    id: 12,
    slug: "init-protocols-and-micro-rituals",
    title: "Init Protocols",
    subtitle: "Micro-Rituals for Daily Practice",
    sectionNumber: "SEC.12",
    description: "Morning and evening sequences that anchor the engines in rhythm.",
    reportContent:
      "The engines are powerful, but power without protocol is chaos. Init Protocols are NOESIS\u2019s daily practice architecture \u2014 structured micro-protocols that weave engine consultation into the natural rhythm of waking and sleeping.\n\n" +
      "The Morning Init is a dawn sequence: breathwork calibrated to current biorhythm state, engine consultation (which readings are most relevant today, based on Vedic timing), journaling prompted by the day\u2019s Gene Keys pattern, and a Somatic Canticle chosen by the body\u2019s current kosha emphasis.\n\n" +
      "The Evening Integration is the complementary dusk protocol: reviewing the day\u2019s engine readings against actual experience, noting convergences and surprises, running a brief HRV check to assess autonomic nervous system coherence, and a closing Canticle that prepares the body for restorative sleep.\n\n" +
      "These are not lengthy ceremonies. The morning sequence takes 15-20 minutes. The evening takes 10-15. Their power is in consistency and specificity \u2014 they are not generic mindfulness but engine-informed, biorhythm-timed protocols that change daily based on the practitioner\u2019s unique configuration. The golden morning light in this visualization captures the quality of attention these protocols cultivate: warm, focused, receptive.",
    imageUrl: "/brand/10A-the-morning-ritual-nanobananapro-v1.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#ff6f91",
    hookLine: "Your morning routine is not a protocol. It's avoidance with better branding.",
    cartographerNote: "The init protocols exist because I noticed the gap between knowing what matters and actually executing it \u2014 every single morning. The gap is where the protocol lives.",
    seekerQuestion: "I already meditate and journal. What does this add?",
    keyInsight: "A protocol is not what you do \u2014 it's what you execute.",
    engineTags: ["Biorhythm Engine", "Vedic Timing", "Gene Keys", "Somatic Canticles"],
    practicePrompt: "Tomorrow morning, before your first habit, sit for 90 seconds and name what you're avoiding. Then begin.",
    layoutKey: "layout-12",
    archetypeLabel: "timeline",
  },

  // ── 13. Material Extensions ──
  {
    id: 13,
    slug: "material-extensions-store-and-nft",
    title: "Material Extensions",
    subtitle: "Store & Digital Artifacts",
    sectionNumber: "SEC.13",
    description: "Physical objects that carry the signal into the tangible world.",
    reportContent:
      "NOESIS is not purely digital. The Material Extensions layer brings the system\u2019s signal into physical form through carefully designed objects and digital collectibles.\n\n" +
      "The Inquiry Kit is the flagship physical product: a premium pattern recognition toolkit containing oracle cards mapped to the thirteen engines, a guided journal with engine-specific prompts, brass instruments (a pendulum, a compass rose) for structured decision-making, and a Somatic Codex volume. The unboxing experience itself is designed as progressive revelation \u2014 each layer revealed in sequence, transforming product opening into mindful ceremony.\n\n" +
      "Digital extensions include engine-specific NFTs that serve as access tokens to advanced capabilities, and a decision mirror archive that preserves the practitioner\u2019s most significant readings as collectible artifacts. These are not speculative assets \u2014 they are functional keys within the ecosystem.\n\n" +
      "The material philosophy is simple: digital systems need physical anchors. A morning protocol performed with brass instruments on a dedicated surface produces a different quality of attention than the same protocol performed on a phone screen. NOESIS meets the practitioner in both worlds.",
    imageUrl: "/brand/3A-inquiry-kit-nanobananapro-v1.png",
    imageDimensions: { width: 2400, height: 1792 },
    accentColor: "#b8860b",
    hookLine: "Digital systems need physical anchors. Here's the mechanism.",
    cartographerNote: "The quality of attention changes when brass instruments replace phone screens. I tested this for two years before designing the Inquiry Kit.",
    seekerQuestion: "Physical products for a digital system? Isn't this just merchandise?",
    keyInsight: "A morning protocol with physical instruments produces different attention quality than a phone screen.",
    engineTags: ["All Engines", "Material Design"],
    practicePrompt: "Find one object near you right now. Hold it with full attention for 30 seconds. Notice what shifts.",
    layoutKey: "layout-13",
    archetypeLabel: "image",
  },

  // ── 14. Consultation & Mentorship ──
  {
    id: 14,
    slug: "consultation-and-mentorship",
    title: "Consultation",
    subtitle: "Mentorship & Guided Practice",
    sectionNumber: "SEC.14",
    description: "The Cartographer as guide through your personal territory.",
    reportContent:
      "While NOESIS is designed for self-directed use, some territory benefits from a guide. The Consultation layer offers one-on-one mentorship with trained Cartographers \u2014 practitioners who have mastered the engine stack and can help others navigate complex readings.\n\n" +
      "A typical consultation begins with a comprehensive multi-engine profile: all thirteen engines run against the practitioner\u2019s birth data and current biofield state. The Cartographer then walks through the convergence patterns \u2014 where multiple engines agree, where they diverge, and what the tensions reveal.\n\n" +
      "The Cartographer does not interpret for the practitioner. They teach the practitioner to interpret for themselves. The goal of every consultation is to increase the practitioner\u2019s autonomous fluency with the engines, not to create dependency on expert interpretation. Think of it as teaching someone to read a map, not reading it for them.\n\n" +
      "This extended contact sheet captures the Cartographer in active exploration \u2014 mapping, writing, navigating with instruments. The close-up frames highlight the hands-on relationship between guide and tools, emphasizing that mentorship in NOESIS is a craft practice, not a passive lecture.",
    imageUrl: "/brand/7A-the-cartographer-contact-sheet-nanobananapro-v1.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#f388ff",
    hookLine: "Teaching you to read the map \u2014 not reading it for you.",
    cartographerNote: "Every consultation ends with the same goal: you need me less. If dependency grows, I've failed.",
    seekerQuestion: "How is this different from paying for a psychic reading?",
    keyInsight: "Mentorship that creates dependency has failed its purpose.",
    engineTags: ["All Engines", "Cartographer Engine"],
    practicePrompt: "Think of your best teacher. Did they give you answers or teach you to find them?",
    layoutKey: "layout-14",
    archetypeLabel: "split",
  },

  // ── 15. Why This Exists ──
  {
    id: 15,
    slug: "why-this-exists",
    title: "Why This Exists",
    subtitle: "The Initiation Imperative",
    sectionNumber: "SEC.15",
    description: "The threshold between knowing about yourself and knowing yourself.",
    reportContent:
      "NOESIS exists because pattern recognition systems have a fatal flaw: they describe patterns without training capacity to navigate them.\n\n" +
      "You can read every book on the Enneagram and still be caught in your type\u2019s pattern. You can memorize your Human Design bodygraph and still make decisions from conditioning. You can track your biorhythms for years and still override the body\u2019s signals with willpower. Knowledge about patterns is not the same as capacity to navigate them.\n\n" +
      "The gap between these two is the training threshold. NOESIS is designed to carry the practitioner across that threshold \u2014 not through more information, but through the systematic integration of information with practice, embodiment, and operational experience.\n\n" +
      "The threshold visualization \u2014 a dramatic crossing with all thirteen engine symbols arranged in an operational arc \u2014 captures this moment. It is the commitment to stop collecting maps and start building navigation capacity. It is the recognition that the engines are not the destination; they are instruments for training. The destination is the operational clarity that emerges when all instruments are used in concert.",
    imageUrl: "/brand/10C-the-initiation-nanobananapro-v1.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#ff6f91",
    hookLine: "You can memorize your entire chart and still be caught in the pattern.",
    cartographerNote: "NOESIS exists because I crossed the threshold myself \u2014 from knowing about patterns to having capacity to navigate them \u2014 and discovered the crossing can be trained.",
    seekerQuestion: "What's the actual moment where this stops being intellectual and becomes operational?",
    keyInsight: "Knowledge about patterns is not the same as capacity to navigate them.",
    engineTags: ["Witness Engine", "All Engines"],
    practicePrompt: "Name one thing you know about yourself that hasn't yet changed your behavior. Sit with that gap.",
    layoutKey: "layout-15",
    archetypeLabel: "hero",
  },

  // ── 16. Conclusion ──
  {
    id: 16,
    slug: "conclusion-noesis-as-living-tapestry",
    title: "A Living Tapestry",
    subtitle: "Conclusion",
    sectionNumber: "SEC.16",
    description: "The system that grows as you grow.",
    reportContent:
      "NOESIS is not a finished product. It is a living architecture \u2014 a system that grows, deepens, and reconfigures as the practitioners who use it bring their own operational data to the system.\n\n" +
      "New engines will be added as traditions are tested and integrated. New Somatic Canticles will emerge from practitioner feedback. New manga episodes will respond to the evolving patterns of the community. New training puzzles will be seeded across the ecosystem. The material objects will iterate based on usage patterns.\n\n" +
      "But the core architecture \u2014 thirteen engines, the Witness Dyad, the convergence scoring, the somatic integration layer \u2014 is stable. It is the framework on which the system is built. The applications change. The pattern deepens. The framework holds.\n\n" +
      "The Evening Integration scene closes this report as it closes each day: in the blue-hour light of contemplation, reviewing what was learned, noting what surprised, and preparing the ground for tomorrow\u2019s protocol. NOESIS does not end. It integrates. And from that integration, something new always emerges \u2014 not as information, but as the quiet, unmistakable operational clarity that the Greeks called noesis.",
    imageUrl: "/brand/10B-the-evening-integration-nanobananapro-v1.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#ff6f91",
    hookLine: "The framework holds. The applications change. The pattern deepens.",
    cartographerNote: "This is not a finished system. It's a living architecture that grows as the practitioners who use it bring their own operational data. I'm not the operator \u2014 I built the framework.",
    seekerQuestion: "If it's never finished, how do I know when I've built sufficient capacity?",
    keyInsight: "NOESIS does not end. It integrates. From integration, operational clarity emerges.",
    engineTags: ["All Engines", "Living Architecture"],
    practicePrompt: "Look back at who you were one year ago. Name one pattern you can now navigate that was invisible then. That's noesis.",
    layoutKey: "layout-16",
    archetypeLabel: "terminal",
  },

  // ── Easter Egg 01 ──
  {
    id: 17,
    slug: "easter-hidden-sigil-resonance",
    title: "Hidden Sigil Resonance",
    subtitle: "Easter Egg · Fiber-Optic Convergence",
    sectionNumber: "EGG.01",
    description: "The first hidden layer where subtle cues map your readiness to proceed.",
    reportContent:
      "This hidden section reveals the V2 sigil logic in operational form: three filaments, one nexus, dynamic resonance based on your current physiological state.\n\n" +
      "Unlike decorative symbol systems, this layer is interactive operationally. The sigil is treated as a calibration interface: attention sharpens, noise falls, and signal starts to separate from narrative overlay.\n\n" +
      "Use this node when you feel scattered. It is intentionally minimal, built to recenter attention before moving deeper into engine complexity.",
    imageUrl: "/brand/3C-essence-vial-nanobananapro-v2.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#C4873B",
    hookLine: "Three filaments. One nexus. Attention becomes architecture.",
    cartographerNote: "The sigil is not mystical decoration. It is a calibration gesture for attention.",
    seekerQuestion: "What changes in my perception when I treat symbols as tools, not beliefs?",
    keyInsight: "Signal appears when storyline quiets.",
    engineTags: ["Witness Engine", "Sigil Layer", "Calibration"],
    practicePrompt: "Breathe for 60 seconds while focusing on one point. Notice what gets quieter.",
    layoutKey: "layout-17",
    archetypeLabel: "hero",
  },

  // ── Easter Egg 02 ──
  {
    id: 18,
    slug: "easter-vial-protocol-index",
    title: "Vial Protocol Index",
    subtitle: "Easter Egg · Ritual Catalog",
    sectionNumber: "EGG.02",
    description: "A hidden index of micro-rituals keyed to nervous-system and timing states.",
    reportContent:
      "The Vial Protocol Index is a compressed lookup table for ritual selection. It bridges morning state checks with immediate action patterns.\n\n" +
      "Instead of asking 'what should I do today?' in abstract, this layer asks: what state am I in, and what protocol matches that state right now?\n\n" +
      "It is intentionally utilitarian: less poetry, more execution. Clarity is operationalized through constraints.",
    imageUrl: "/brand/4A-inquiry-vial-catalog-layout-nanobananapro-v2.png",
    imageDimensions: { width: 1792, height: 2400 },
    accentColor: "#8A9BA8",
    hookLine: "State first. Protocol second. Story later.",
    cartographerNote: "Most failed rituals fail at matching state to method.",
    seekerQuestion: "What if discipline problems are really miscalibrated protocols?",
    keyInsight: "Good rituals are state-aware, not identity-driven.",
    engineTags: ["Init Protocol", "Biorhythm Engine", "Execution"],
    practicePrompt: "Name your current state in three words. Pick one action that truly fits it.",
    layoutKey: "layout-18",
    archetypeLabel: "timeline",
  },

  // ── Easter Egg 03 ──
  {
    id: 19,
    slug: "easter-bio-digital-relics",
    title: "Bio-Digital Relics",
    subtitle: "Easter Egg · Object Memory",
    sectionNumber: "EGG.03",
    description: "A hidden museum of objects designed to hold ritual memory and intent.",
    reportContent:
      "This section tracks how tangible artifacts encode continuity across practice cycles. The object is not a prop; it is a physiological anchor.\n\n" +
      "Bio-digital relics combine material texture with operational indexing. When used consistently, they reduce initiation friction and accelerate return-to-practice behavior.\n\n" +
      "Treat this layer as operational research: which objects deepen attention, and which merely aestheticize the process?",
    imageUrl: "/brand/4B-bio-digital-object-collection-flat-lay-nanobananapro-v2.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#4A7C59",
    hookLine: "Objects can either distract attention or stabilize it.",
    cartographerNote: "If an object does not change behavior, it is decoration.",
    seekerQuestion: "Which object in my space truly changes how I show up?",
    keyInsight: "Material anchors reduce ritual startup cost.",
    engineTags: ["Material Extensions", "Somatic Memory", "Ritual Design"],
    practicePrompt: "Choose one object as your daily anchor and use it for seven consecutive days.",
    layoutKey: "layout-19",
    archetypeLabel: "image",
  },

  // ── Easter Egg 04 ──
  {
    id: 20,
    slug: "easter-western-mesh-overlay",
    title: "Western Mesh Overlay",
    subtitle: "Easter Egg · Cross-System Lens",
    sectionNumber: "EGG.04",
    description: "A hidden comparative layer across Western engines for pattern triangulation.",
    reportContent:
      "The Western Mesh Overlay compresses Human Design, Gene Keys, Enneagram, Numerology, and Tarot into one comparative frame.\n\n" +
      "Its function is not synthesis by force. It highlights where each engine is strongest and where each should defer.\n\n" +
      "Use this to avoid confirmation bias by rotating lenses before committing to an interpretation.",
    imageUrl: "/brand/5D-2-western-engine-icons-recraft-v2.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#F0EDE3",
    hookLine: "Rotate the lens before you trust the conclusion.",
    cartographerNote: "Most misreads happen when one lens is treated as total truth.",
    seekerQuestion: "Where am I over-relying on one framework because it flatters me?",
    keyInsight: "Triangulation beats single-engine certainty.",
    engineTags: ["Human Design", "Gene Keys", "Enneagram", "Numerology", "Tarot"],
    practicePrompt: "Run one question through three engines and note where they differ.",
    layoutKey: "layout-20",
    archetypeLabel: "dashboard",
  },

  // ── Easter Egg 05 ──
  {
    id: 21,
    slug: "easter-biofield-sonic-gate",
    title: "Biofield Sonic Gate",
    subtitle: "Easter Egg · Resonance Threshold",
    sectionNumber: "EGG.05",
    description: "The final hidden layer where rhythm, breath, and frequency converge.",
    reportContent:
      "This gate combines HRV, biorhythm, and raga resonance into a single threshold protocol.\n\n" +
      "The intent is not optimization for productivity, but coherence for perception. When autonomic rhythm stabilizes, interpretive noise drops and choices become cleaner.\n\n" +
      "Enter this section after a full cycle through the main architecture. It closes the loop while opening the next one.",
    imageUrl: "/brand/5D-4-biofield-engine-icons-recraft-v2.png",
    imageDimensions: { width: 2048, height: 2048 },
    accentColor: "#C4873B",
    hookLine: "Coherence is a threshold, not a mood.",
    cartographerNote: "When rhythm is coherent, decisions stop feeling like force.",
    seekerQuestion: "Can I detect coherence in my body before I act?",
    keyInsight: "Stabilize rhythm, then choose.",
    engineTags: ["HRV Engine", "Biorhythm Engine", "Biofield & Raga"],
    practicePrompt: "Take 10 breaths with equal inhale/exhale. Decide only after the cycle.",
    layoutKey: "layout-21",
    archetypeLabel: "terminal",
  },
];

/** Look up a section by slug. */
export function getSectionBySlug(slug: string): NoesisSection | null {
  return NOESIS_SECTIONS.find((s) => s.slug === slug) ?? null;
}

/** Look up a section by 1-based id. */
export function getSectionById(id: number): NoesisSection | null {
  return NOESIS_SECTIONS.find((s) => s.id === id) ?? null;
}
