/**
 * HeroJourneyMap - The 12 Phases of the Hero's Journey
 * Maps project progress to mythic narrative structure
 */

import { HeroPhase, HeroPhaseNumber, Task, Kosha } from '../types/index.js';
import { MAJOR_ARCANA } from '../cards/TarotOracle.js';

// ============================================================================
// THE 12 HERO PHASES
// ============================================================================

export const HERO_PHASES: HeroPhase[] = [
  {
    number: 1,
    name: 'ORDINARY WORLD',
    sanskritName: 'सामान्यलोक (Sāmānyaloka)',
    tarotCard: 0, // The Fool
    kosha: 'annamaya',
    description: 'The hero begins in a mundane situation, unaware of the adventure to come. This is the established world before the journey.',
    tasks: [
      'Setup project scaffolding',
      'Install dependencies',
      'Configure development environment',
      'Establish design tokens',
      'Create directory structure'
    ],
    sankalpa: 'We begin not knowing, and that is perfect.',
    progressIndicators: {
      starting: 'Nothing exists yet. Blank canvas.',
      middle: 'Files are being created. Structure emerging.',
      completing: 'Foundation is solid. Ready for activation.'
    }
  },
  {
    number: 2,
    name: 'CALL TO ADVENTURE',
    sanskritName: 'आह्वान (Āhvāna)',
    tarotCard: 1, // The Magician
    kosha: 'pranamaya',
    description: 'Something shakes up the situation, either from external pressures or from something rising up from deep within.',
    tasks: [
      'First features emerge',
      'Initial flow is established',
      'Energy activates in the codebase',
      'Basic functionality working',
      'Proof of concept complete'
    ],
    sankalpa: 'The tools are on the altar. The will is the wand.',
    progressIndicators: {
      starting: 'First lines of real code being written.',
      middle: 'Features taking shape. Momentum building.',
      completing: 'Core functionality demonstrated.'
    }
  },
  {
    number: 3,
    name: 'REFUSAL OF THE CALL',
    sanskritName: 'आह्वानत्याग (Āhvānatyāga)',
    tarotCard: 12, // The Hanged Man
    kosha: 'manomaya',
    description: 'The hero feels the fear of the unknown and tries to turn away from the adventure, however briefly.',
    tasks: [
      'Debugging complex issues',
      'Handling edge cases',
      'Fixing file watcher problems',
      'REST PERIOD - Integration before next push',
      'Dealing with resistance'
    ],
    sankalpa: 'In suspension, we see what rushing obscures.',
    progressIndicators: {
      starting: 'Blockages appear. Frustration rises.',
      middle: 'Stuck. Waiting. Resisting.',
      completing: 'Surrender to the pause. Wisdom emerges.'
    }
  },
  {
    number: 4,
    name: 'MEETING THE MENTOR',
    sanskritName: 'गुरुमिलन (Gurumilana)',
    tarotCard: 5, // The Hierophant
    kosha: 'vijnanamaya',
    description: 'The hero comes across a seasoned traveler of the worlds who gives training or advice for the journey.',
    tasks: [
      'Documentation written',
      'Learning established patterns',
      'Code review and reflection',
      'Research and deep work',
      'Pattern recognition'
    ],
    sankalpa: 'The tradition teaches; we listen.',
    progressIndicators: {
      starting: 'Seeking guidance. Reading docs.',
      middle: 'Patterns emerging. Understanding deepens.',
      completing: 'Wisdom integrated. Ready to proceed.'
    }
  },
  {
    number: 5,
    name: 'CROSSING THE THRESHOLD',
    sanskritName: 'सीमापारगमन (Sīmāpāragamana)',
    tarotCard: 7, // The Chariot
    kosha: 'all',
    description: 'The hero leaves the familiar world and enters the special world, fully committed to the journey.',
    tasks: [
      'All components integrated',
      'Real-time data flowing',
      'Major feature complete',
      'First working demo',
      'Point of no return reached'
    ],
    sankalpa: 'The threshold is crossed. There is no return.',
    progressIndicators: {
      starting: 'Committing to the unknown.',
      middle: 'Integration point. All systems connecting.',
      completing: 'Threshold crossed. New world entered.'
    }
  },
  {
    number: 6,
    name: 'TESTS, ALLIES, ENEMIES',
    sanskritName: 'परीक्षा मित्र शत्रु (Parīkṣā Mitra Śatru)',
    tarotCard: 8, // Strength (or 15 - Devil)
    kosha: 'pranamaya',
    description: 'The hero faces tests, encounters allies, confronts enemies, and learns the rules of the special world.',
    tasks: [
      'Edge case handling',
      'Performance optimization',
      'Bug fixes (enemies appear)',
      'Mobile responsive layout',
      'Stress testing'
    ],
    sankalpa: 'The lion is not conquered; it is embraced.',
    progressIndicators: {
      starting: 'Challenges emerge. Resistance met.',
      middle: 'Allies found. Enemies confronted.',
      completing: 'Strength proven. Rules learned.'
    }
  },
  {
    number: 7,
    name: 'APPROACH TO THE INMOST CAVE',
    sanskritName: 'गुहाप्रवेश (Guhāpraveśa)',
    tarotCard: 16, // The Tower
    kosha: 'manomaya',
    description: 'The hero comes to the edge of a dangerous place, sometimes deep underground, where the object of the quest is hidden.',
    tasks: [
      'Core algorithm implementation',
      'Hardest problem tackled',
      'Pattern recognition algorithm',
      'Network graph visualization',
      'Breaking through complexity'
    ],
    sankalpa: 'What must fall, falls. What remains, is truth.',
    progressIndicators: {
      starting: 'Standing at the edge. Fear acknowledged.',
      middle: 'Structures breaking. Old patterns falling.',
      completing: 'Breakthrough achieved. Truth revealed.'
    }
  },
  {
    number: 8,
    name: 'THE ORDEAL',
    sanskritName: 'कठोरपरीक्षा (Kaṭhoraparīkṣā)',
    tarotCard: 13, // Death
    kosha: 'manomaya',
    description: 'The hero faces the greatest challenge, a life-or-death moment that transforms them. The old self dies.',
    tasks: [
      'Major refactor if needed',
      'State management overhaul',
      'Letting go of features',
      'Old codebase dies; new born',
      'Transformation complete'
    ],
    sankalpa: 'Death is not an end but a passage.',
    progressIndicators: {
      starting: 'Facing the abyss. Everything at stake.',
      middle: 'The struggle. Death and rebirth.',
      completing: 'Transformation. New self emerges.'
    }
  },
  {
    number: 9,
    name: 'REWARD (SEIZING THE SWORD)',
    sanskritName: 'फलप्राप्ति (Phalaprāpti)',
    tarotCard: 19, // The Sun
    kosha: 'anandamaya',
    description: 'The hero takes possession of the treasure, having survived death. They rest and celebrate before the return.',
    tasks: [
      'Feature complete',
      'Working demo with real data',
      'Animations polished',
      'Sound design complete',
      'Celebration and rest'
    ],
    sankalpa: 'The child rides the horse. Joy is simple.',
    progressIndicators: {
      starting: 'Victory in sight. Treasure near.',
      middle: 'Achievement unlocked. Satisfaction.',
      completing: 'Bliss of completion. Sun shines.'
    }
  },
  {
    number: 10,
    name: 'THE ROAD BACK',
    sanskritName: 'पुनरागमनमार्ग (Punarāgamanamārga)',
    tarotCard: 21, // The World
    kosha: 'annamaya',
    description: 'The hero is not done yet. They must return to the ordinary world with the elixir, often pursued by enemies.',
    tasks: [
      'Documentation complete',
      'README with setup instructions',
      'Deployment preparation',
      'Final polish pass',
      'Preparing to share'
    ],
    sankalpa: 'The journey was inward; the return is outward.',
    progressIndicators: {
      starting: 'Turning homeward. The road appears.',
      middle: 'Carrying the treasure. Integration.',
      completing: 'Ready to return. Gifts prepared.'
    }
  },
  {
    number: 11,
    name: 'RESURRECTION',
    sanskritName: 'पुनर्जन्म (Punarjanma)',
    tarotCard: 20, // Judgement
    kosha: 'all',
    description: 'The hero emerges from the special world, transformed, and is purified in a final life-or-death moment.',
    tasks: [
      'Public deployment',
      'Integration with main system',
      'Live demonstration',
      'System sees itself',
      'Rebirth complete'
    ],
    sankalpa: 'The call is answered. The self is revealed.',
    progressIndicators: {
      starting: 'Final test. Purification begins.',
      middle: 'The awakening. Self recognition.',
      completing: 'Resurrected. Transformed. New being.'
    }
  },
  {
    number: 12,
    name: 'RETURN WITH THE ELIXIR',
    sanskritName: 'अमृतप्रदान (Amṛtapradāna)',
    tarotCard: 17, // The Star
    kosha: 'anandamaya',
    description: 'The hero returns with the elixir to transform the ordinary world, completing the cycle and beginning anew.',
    tasks: [
      'Post-launch monitoring',
      'User feedback integration',
      'Next cycle begins',
      'The elixir shared',
      'Service from fullness'
    ],
    sankalpa: 'What was found is shared. The well never empties.',
    progressIndicators: {
      starting: 'Returning home. Elixir in hand.',
      middle: 'Sharing the gift. Service begins.',
      completing: 'Cycle complete. New cycle seeds planted.'
    }
  }
];

// ============================================================================
// HERO JOURNEY MAP CLASS
// ============================================================================

export class HeroJourneyMap {
  private phases: Map<HeroPhaseNumber, HeroPhase>;

  constructor() {
    this.phases = new Map(HERO_PHASES.map(p => [p.number, p]));
  }

  /**
   * Get phase by number
   */
  getPhase(number: HeroPhaseNumber): HeroPhase {
    return this.phases.get(number) || HERO_PHASES[0];
  }

  /**
   * Get all phases
   */
  getAllPhases(): HeroPhase[] {
    return [...HERO_PHASES];
  }

  /**
   * Get next phase
   */
  getNextPhase(current: HeroPhaseNumber): HeroPhase | null {
    const next = current + 1;
    if (next > 12) return null;
    return this.phases.get(next as HeroPhaseNumber) || null;
  }

  /**
   * Get previous phase
   */
  getPreviousPhase(current: HeroPhaseNumber): HeroPhase | null {
    const prev = current - 1;
    if (prev < 1) return null;
    return this.phases.get(prev as HeroPhaseNumber) || null;
  }

  /**
   * Calculate current phase based on project progress
   * 
   * Progress calculation considers:
   * - Total tasks
   * - Completed tasks  
   * - Time elapsed
   * - Complexity indicators
   */
  calculateCurrentPhase(
    totalTasks: number,
    completedTasks: number,
    projectDuration: number, // in days
    currentMilestone?: string
  ): HeroPhase {
    // Special case: if no tasks, we're at the beginning
    if (totalTasks === 0) {
      return this.getPhase(1);
    }

    // Calculate completion ratio
    const completionRatio = completedTasks / totalTasks;

    // Map completion to phase
    // Each phase represents roughly 8.33% of the journey
    let phaseNumber: HeroPhaseNumber;

    if (completionRatio < 0.08) phaseNumber = 1;
    else if (completionRatio < 0.17) phaseNumber = 2;
    else if (completionRatio < 0.25) phaseNumber = 3;
    else if (completionRatio < 0.33) phaseNumber = 4;
    else if (completionRatio < 0.42) phaseNumber = 5;
    else if (completionRatio < 0.50) phaseNumber = 6;
    else if (completionRatio < 0.58) phaseNumber = 7;
    else if (completionRatio < 0.67) phaseNumber = 8;
    else if (completionRatio < 0.75) phaseNumber = 9;
    else if (completionRatio < 0.83) phaseNumber = 10;
    else if (completionRatio < 0.92) phaseNumber = 11;
    else phaseNumber = 12;

    // Check for milestone overrides
    if (currentMilestone) {
      const milestonePhase = this.getPhaseFromMilestone(currentMilestone);
      if (milestonePhase) {
        // Use the more "advanced" of the two
        phaseNumber = Math.max(phaseNumber, milestonePhase) as HeroPhaseNumber;
      }
    }

    return this.getPhase(phaseNumber);
  }

  /**
   * Assign task to appropriate hero phase
   */
  assignTaskToPhase(
    taskName: string,
    taskDescription?: string,
    currentPhase?: HeroPhaseNumber
  ): HeroPhase {
    // Keywords that map to specific phases
    const phaseKeywords: Record<HeroPhaseNumber, string[]> = {
      1: ['setup', 'scaffold', 'init', 'config', 'install', 'create', 'blank', 'foundation'],
      2: ['first', 'initial', 'basic', 'hello', 'start', 'call', 'activate'],
      3: ['debug', 'fix', 'stuck', 'block', 'wait', 'pause', 'rest', 'refuse'],
      4: ['doc', 'learn', 'read', 'mentor', 'pattern', 'research', 'study'],
      5: ['integrate', 'connect', 'threshold', 'demo', 'cross', 'major'],
      6: ['test', 'edge case', 'optimize', 'performance', 'enemy', 'bug'],
      7: ['algorithm', 'core', 'hardest', 'complex', 'cave', 'deep'],
      8: ['refactor', 'rewrite', 'transform', 'overhaul', 'death', 'change'],
      9: ['complete', 'polish', 'reward', 'feature done', 'celebrate'],
      10: ['deploy', 'return', 'back', 'readme', 'share', 'publish'],
      11: ['launch', 'release', 'public', 'resurrect', 'live', 'awaken'],
      12: ['monitor', 'feedback', 'next', 'elixir', 'gift', 'service']
    };

    const searchText = `${taskName} ${taskDescription || ''}`.toLowerCase();

    // Check for keyword matches
    for (let i = 1; i <= 12; i++) {
      const keywords = phaseKeywords[i as HeroPhaseNumber];
      if (keywords.some(kw => searchText.includes(kw))) {
        return this.getPhase(i as HeroPhaseNumber);
      }
    }

    // Default to current phase or phase 1
    return currentPhase ? this.getPhase(currentPhase) : this.getPhase(1);
  }

  /**
   * Get micro-journey for a task
   * Maps the 12 phases onto a single task's lifecycle
   */
  getMicroJourney(taskName: string): {
    ordinaryWorld: string;
    call: string;
    threshold: string;
    ordeal: string;
    reward: string;
  } {
    return {
      ordinaryWorld: `Setup for ${taskName}: understanding requirements, preparing environment`,
      call: `The work begins on ${taskName}: first lines written, direction set`,
      threshold: `The hard part of ${taskName}: complexity encountered, focus needed`,
      ordeal: `${taskName} hits the wall: bugs, confusion, breakthrough required`,
      reward: `${taskName} complete: satisfaction, integration, celebration`
    };
  }

  /**
   * Get phase progress (0-1) within current phase
   */
  getPhaseProgress(
    totalTasks: number,
    completedTasks: number,
    currentPhase: HeroPhaseNumber
  ): number {
    const phaseSize = 1 / 12;
    const completionRatio = completedTasks / totalTasks;
    const phaseStart = (currentPhase - 1) * phaseSize;
    const phaseProgress = (completionRatio - phaseStart) / phaseSize;
    
    return Math.max(0, Math.min(1, phaseProgress));
  }

  /**
   * Get tarot card for phase
   */
  getPhaseTarot(phaseNumber: HeroPhaseNumber): typeof MAJOR_ARCANA[0] {
    const phase = this.getPhase(phaseNumber);
    return MAJOR_ARCANA.find(c => c.number === phase.tarotCard) || MAJOR_ARCANA[0];
  }

  /**
   * Generate sankalpa (intention) for current context
   */
  generateSankalpa(phase: HeroPhase, context?: string): string {
    if (!context) return phase.sankalpa;
    
    const contextualSankalpas: Record<string, Record<number, string>> = {
      'coding': {
        1: 'Every great codebase begins with a single file.',
        2: 'The compiler is my ally.',
        3: 'In the bug, I find wisdom.',
        4: 'Documentation is meditation.',
        5: 'Integration reveals the whole.',
        6: 'Tests make me stronger.',
        7: 'The algorithm will reveal itself.',
        8: 'Old code dies so better code lives.',
        9: 'The feature works. I rest.',
        10: 'Documentation carries the gift forward.',
        11: 'Deployment is birth.',
        12: 'The code serves.'
      },
      'writing': {
        1: 'The blank page is freedom.',
        2: 'The first sentence calls me forward.',
        7: 'The hard chapter awaits.',
        9: 'The draft is complete.'
      }
    };

    const contextMap = contextualSankalpas[context];
    return contextMap?.[phase.number] || phase.sankalpa;
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private getPhaseFromMilestone(milestone: string): HeroPhaseNumber | null {
    const milestoneMap: Record<string, HeroPhaseNumber> = {
      'setup': 1,
      'initialization': 1,
      'scaffold': 1,
      'first-feature': 2,
      'prototype': 2,
      'blocked': 3,
      'debug': 3,
      'learning': 4,
      'research': 4,
      'integration': 5,
      'milestone': 5,
      'testing': 6,
      'optimization': 6,
      'core-algorithm': 7,
      'hard-problem': 7,
      'refactor': 8,
      'transform': 8,
      'complete': 9,
      'done': 9,
      'polish': 10,
      'deploy': 10,
      'launch': 11,
      'release': 11,
      'maintain': 12,
      'support': 12
    };

    return milestoneMap[milestone.toLowerCase()] || null;
  }
}

// Singleton instance
export const heroJourneyMap = new HeroJourneyMap();
