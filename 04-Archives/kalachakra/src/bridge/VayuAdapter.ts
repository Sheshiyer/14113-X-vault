/**
 * VayuAdapter - Elemental Forces to Work Type Mapping
 * 
 * Maps noesis vayus (elemental life forces) to appropriate work types:
 * - Prana → Creative coding
 * - Vyana → Refactoring  
 * - Udana → Architecture decisions
 * - Samana → Testing/debugging
 * - Apana → Documentation/cleanup
 */

import { Vayu, Kosha } from '../types';
import { NoesisVayus } from './NoesisClient';

export interface WorkType {
  id: string;
  name: string;
  description: string;
  vayu: Vayu;
  kosha: Kosha;
  characteristics: string[];
  indicators: {
    goodTime: string[];
    badTime: string[];
  };
  tasks: string[];
  tools: string[];
  duration: {
    min: number; // minutes
    max: number;
    ideal: number;
  };
  prerequisites: string[];
  deliverables: string[];
  energyProfile: {
    khaloreeMin: number;
    vikaraMax: number;
    cliffordOctaves: number[]; // which octaves this work is best in
  };
}

export interface VayuSuggestion {
  vayu: Vayu;
  currentStrength: number;
  workType: WorkType;
  confidence: number; // 0-1
  reason: string;
  alternatives: WorkType[];
  transitionWarning?: string;
}

export interface DailyVayuFlow {
  current: Vayu;
  next: Vayu;
  estimatedTransition: string;
  suggestedSchedule: Array<{
    vayu: Vayu;
    workType: string;
    startTime: string;
    duration: number;
  }>;
}

export class VayuAdapter {
  // Define work types for each vayu
  private readonly WORK_TYPES: Record<Vayu, WorkType> = {
    prana: {
      id: 'creative-coding',
      name: 'Creative Coding',
      description: 'Building new features, exploring ideas, writing greenfield code',
      vayu: 'prana',
      kosha: 'pranamaya',
      characteristics: [
        'High cognitive load',
        'Requires inspiration',
        'Novel problem solving',
        'Architectural decisions',
        'Learning and exploration',
      ],
      indicators: {
        goodTime: [
          'Feeling inspired',
          'Clear mental space',
          'Excited about possibilities',
          'Energy is rising',
        ],
        badTime: [
          'Mental fog',
          'Feeling forced',
          'Energy declining',
          'Resistance to starting',
        ],
      },
      tasks: [
        'Design new features',
        'Prototype new ideas',
        'Write core algorithms',
        'Create new components',
        'Explore new technologies',
        'Build proof of concepts',
        'Draft initial architecture',
      ],
      tools: [
        'IDE with full feature set',
        'Whiteboarding tools',
        'Note-taking app',
        'Music for focus',
        'Timer for flow sessions',
      ],
      duration: {
        min: 45,
        max: 180,
        ideal: 90,
      },
      prerequisites: [
        'Clear requirements or problem statement',
        'Minimal distractions',
        'Khaloree > 60',
      ],
      deliverables: [
        'Working code',
        'Design decisions documented',
        'Tests for new functionality',
        'Updated documentation',
      ],
      energyProfile: {
        khaloreeMin: 60,
        vikaraMax: 40,
        cliffordOctaves: [0, 1, 2, 3], // First half of cycle
      },
    },

    vyana: {
      id: 'refactoring',
      name: 'Refactoring & Integration',
      description: 'Improving existing code, connecting systems, restructuring',
      vayu: 'vyana',
      kosha: 'pranamaya',
      characteristics: [
        'Transformational work',
        'Connecting disparate parts',
        'Improving flow',
        'Pattern recognition',
        'Integration thinking',
      ],
      indicators: {
        goodTime: [
          'Seeing patterns clearly',
          'Good overview of codebase',
          'Energy is steady',
          'Can hold multiple concepts',
        ],
        badTime: [
          'Lost in details',
          'Can\'t see the big picture',
          'Energy fluctuating wildly',
          'Impatient',
        ],
      },
      tasks: [
        'Refactor existing code',
        'Extract reusable components',
        'Standardize patterns',
        'Improve APIs',
        'Connect modules',
        'Migrate data or code',
        'Optimize performance',
      ],
      tools: [
        'Refactoring tools',
        'Static analysis',
        'Git for safe experimentation',
        'Test suite for validation',
        'Architecture diagrams',
      ],
      duration: {
        min: 30,
        max: 120,
        ideal: 60,
      },
      prerequisites: [
        'Good test coverage',
        'Clear understanding of current code',
        'Safe rollback plan',
      ],
      deliverables: [
        'Cleaner code',
        'Better abstractions',
        'Improved performance',
        'Updated tests',
      ],
      energyProfile: {
        khaloreeMin: 50,
        vikaraMax: 55,
        cliffordOctaves: [1, 2, 3, 4, 5], // Middle of cycle
      },
    },

    udana: {
      id: 'architecture',
      name: 'Architecture Decisions',
      description: 'High-level design, system thinking, strategic planning',
      vayu: 'udana',
      kosha: 'vijnanamaya',
      characteristics: [
        'Elevated perspective',
        'Clarity and discernment',
        'Expression and communication',
        'Growth-oriented',
        'Future-focused',
      ],
      indicators: {
        goodTime: [
          'Mental clarity',
          'Strong discernment',
          'Can articulate complex ideas',
          'Confident in decisions',
          'Seeing future implications',
        ],
        badTime: [
          'Analysis paralysis',
          'Overwhelmed by options',
          'Second-guessing',
          'Can\t find words',
          'Stuck in present constraints',
        ],
      },
      tasks: [
        'Make architectural decisions',
        'Design system boundaries',
        'Choose technologies',
        'Plan migrations',
        'Document decisions (ADRs)',
        'Review and critique designs',
        'Mentor on architecture',
      ],
      tools: [
        'Architecture diagram tools',
        'Decision matrices',
        'Writing tools',
        'Presentation software',
        'Collaborative whiteboards',
      ],
      duration: {
        min: 30,
        max: 90,
        ideal: 45,
      },
      prerequisites: [
        'Deep understanding of domain',
        'Clear decision criteria',
        'Stakeholder input gathered',
        'Khaloree > 55',
        'Vikara < 45',
      ],
      deliverables: [
        'Architecture Decision Records',
        'System diagrams',
        'Implementation roadmap',
        'Risk assessments',
      ],
      energyProfile: {
        khaloreeMin: 55,
        vikaraMax: 45,
        cliffordOctaves: [2, 3, 4], // Peak clarity octaves
      },
    },

    samana: {
      id: 'testing-debugging',
      name: 'Testing & Debugging',
      description: 'Quality assurance, bug hunting, systematic verification',
      vayu: 'samana',
      kosha: 'manomaya',
      characteristics: [
        'Focused attention',
        'Systematic process',
        'Balancing effort',
        'Processing and digestion',
        'Attention to detail',
      ],
      indicators: {
        goodTime: [
          'Focused and methodical',
          'Patient with details',
          'Can hold focus steadily',
          'Not rushed',
          'Clear-headed',
        ],
        badTime: [
          'Rushing through',
          'Skipping steps',
          'Impatient',
          'Distracted',
          'Frustrated easily',
        ],
      },
      tasks: [
        'Write unit tests',
        'Debug issues',
        'Code review',
        'Systematic testing',
        'Fix bugs',
        'Verify fixes',
        'Performance profiling',
        'Security auditing',
      ],
      tools: [
        'Test frameworks',
        'Debuggers',
        'Log analyzers',
        'Profilers',
        'Code review tools',
        'Static analysis',
      ],
      duration: {
        min: 25,
        max: 90,
        ideal: 45,
      },
      prerequisites: [
        'Reproduction steps for bugs',
        'Test environment ready',
        'Logs and context available',
      ],
      deliverables: [
        'Tests passing',
        'Bugs fixed',
        'Issues documented',
        'Coverage improved',
      ],
      energyProfile: {
        khaloreeMin: 40,
        vikaraMax: 60,
        cliffordOctaves: [3, 4, 5, 6], // Mid-to-late cycle focus work
      },
    },

    apana: {
      id: 'documentation-cleanup',
      name: 'Documentation & Cleanup',
      description: 'Completing, organizing, removing, finishing touches',
      vayu: 'apana',
      kosha: 'annamaya',
      characteristics: [
        'Downward and releasing',
        'Grounding work',
        'Completion-oriented',
        'Organizational',
        'Stabilizing',
      ],
      indicators: {
        goodTime: [
          'Satisfied with closure',
          'Methodical and steady',
          'Not seeking novelty',
          'Content with small wins',
          'Energy declining gracefully',
        ],
        badTime: [
          'Resisting closure',
          'Seeking new stimulation',
          'Rushed to finish',
          'Energy crashed',
          'Can\'t focus on details',
        ],
      },
      tasks: [
        'Write documentation',
        'Clean up code',
        'Remove unused code',
        'Update README',
        'Organize files',
        'Write commit messages',
        'Create release notes',
        'Update dependencies',
        'Close tickets',
      ],
      tools: [
        'Documentation generators',
        'Linters',
        'Formatters',
        'Git for cleanup commits',
        'Ticket trackers',
        'Note-taking apps',
      ],
      duration: {
        min: 15,
        max: 60,
        ideal: 30,
      },
      prerequisites: [
        'Work to document is complete',
        'Context still fresh',
        'No urgent deadlines',
      ],
      deliverables: [
        'Updated docs',
        'Clean codebase',
        'Closed tickets',
        'Organized files',
        'Clear commit history',
      ],
      energyProfile: {
        khaloreeMin: 20,
        vikaraMax: 80,
        cliffordOctaves: [5, 6, 7, 0], // Late cycle and transition
      },
    },
  };

  private vayuTransitions: Map<Vayu, { to: Vayu; typicalDuration: number }[]> = new Map([
    ['prana', [{ to: 'vyana', typicalDuration: 90 }, { to: 'samana', typicalDuration: 120 }]],
    ['vyana', [{ to: 'udana', typicalDuration: 60 }, { to: 'prana', typicalDuration: 120 }]],
    ['udana', [{ to: 'samana', typicalDuration: 45 }, { to: 'vyana', typicalDuration: 90 }]],
    ['samana', [{ to: 'apana', typicalDuration: 60 }, { to: 'udana', typicalDuration: 90 }]],
    ['apana', [{ to: 'prana', typicalDuration: 180 }, { to: 'samana', typicalDuration: 60 }]],
  ]);

  /**
   * Get the work type definition for a vayu
   */
  getWorkType(vayu: Vayu): WorkType {
    return this.WORK_TYPES[vayu];
  }

  /**
   * Get all work types
   */
  getAllWorkTypes(): WorkType[] {
    return Object.values(this.WORK_TYPES);
  }

  /**
   * Get current vayu suggestion based on noesis data
   */
  getSuggestion(vayus: NoesisVayus, khaloree: number, vikara: number): VayuSuggestion {
    const currentVayu = vayus.current;
    const currentStrength = vayus.allVayus[currentVayu];
    const workType = this.WORK_TYPES[currentVayu];

    // Calculate confidence based on alignment with energy profile
    const khaloreeFit = Math.max(0, Math.min(1, 
      (khaloree - workType.energyProfile.khaloreeMin) / 40 + 0.5
    ));
    const vikaraFit = Math.max(0, Math.min(1, 
      (workType.energyProfile.vikaraMax - vikara) / 40 + 0.5
    ));
    const strengthFit = currentStrength / 100;
    
    const confidence = (khaloreeFit + vikaraFit + strengthFit) / 3;

    // Generate reason
    let reason = `${currentVayu} is dominant (${currentStrength}%). `;
    if (confidence > 0.8) {
      reason += `Your energy profile aligns perfectly with ${workType.name}.`;
    } else if (confidence > 0.6) {
      reason += `Good time for ${workType.name}, though not ideal.`;
    } else {
      reason += `${workType.name} may be challenging given current energy levels.`;
    }

    // Find alternatives
    const alternatives = this.findAlternatives(currentVayu, khaloree, vikara, vayus.allVayus);

    // Check for transition warning
    let transitionWarning: string | undefined;
    const dominantDuration = vayus.duration;
    const typicalMax = this.getTypicalMaxDuration(currentVayu);
    if (dominantDuration > typicalMax * 0.8) {
      transitionWarning = `${currentVayu} has been dominant for ${Math.round(dominantDuration)} minutes. Transition likely within ${Math.round(typicalMax - dominantDuration)} minutes.`;
    }

    return {
      vayu: currentVayu,
      currentStrength,
      workType,
      confidence,
      reason,
      alternatives,
      transitionWarning,
    };
  }

  /**
   * Get the best work type for current conditions
   */
  getBestWorkType(khaloree: number, vikara: number, cliffordOctave: number): WorkType {
    const candidates = this.getAllWorkTypes();
    
    return candidates
      .map(wt => ({
        workType: wt,
        score: this.calculateWorkTypeScore(wt, khaloree, vikara, cliffordOctave),
      }))
      .sort((a, b) => b.score - a.score)[0]?.workType || this.WORK_TYPES.apana;
  }

  /**
   * Get task suggestions for current vayu
   */
  getTaskSuggestions(vayu: Vayu, count: number = 3): string[] {
    const workType = this.WORK_TYPES[vayu];
    const shuffled = [...workType.tasks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Check if energy profile matches work type requirements
   */
  isProfileMatch(workType: WorkType, khaloree: number, vikara: number): boolean {
    return khaloree >= workType.energyProfile.khaloreeMin &&
           vikara <= workType.energyProfile.vikaraMax;
  }

  /**
   * Get expected vayu flow for the day
   */
  getDailyFlow(currentVayu: Vayu, startTime: Date = new Date()): DailyVayuFlow {
    const transitions = this.vayuTransitions.get(currentVayu) || [];
    const mostLikely = transitions[0];
    
    if (!mostLikely) {
      return {
        current: currentVayu,
        next: currentVayu,
        estimatedTransition: startTime.toISOString(),
        suggestedSchedule: [],
      };
    }

    const transitionTime = new Date(startTime.getTime() + mostLikely.typicalDuration * 60000);
    
    // Generate suggested schedule
    const schedule: DailyVayuFlow['suggestedSchedule'] = [];
    let currentTime = new Date(startTime);
    let currentV = currentVayu;
    
    for (let i = 0; i < 5 && currentTime.getHours() < 20; i++) {
      const workType = this.WORK_TYPES[currentV];
      const duration = workType.duration.ideal;
      
      schedule.push({
        vayu: currentV,
        workType: workType.name,
        startTime: currentTime.toISOString(),
        duration,
      });

      // Move to next vayu
      const nextTransitions = this.vayuTransitions.get(currentV);
      if (nextTransitions && nextTransitions.length > 0) {
        currentV = nextTransitions[0].to;
        currentTime = new Date(currentTime.getTime() + duration * 60000);
      } else {
        break;
      }
    }

    return {
      current: currentVayu,
      next: mostLikely.to,
      estimatedTransition: transitionTime.toISOString(),
      suggestedSchedule: schedule,
    };
  }

  /**
   * Get kosha associated with vayu
   */
  getKoshaForVayu(vayu: Vayu): Kosha {
    return this.WORK_TYPES[vayu].kosha;
  }

  /**
   * Get transition guidance between work types
   */
  getTransitionGuidance(from: Vayu, to: Vayu): {
    difficulty: 'seamless' | 'easy' | 'moderate' | 'challenging';
    preparation: string[];
    cooldown: number; // minutes
  } {
    const directTransitions = this.vayuTransitions.get(from) || [];
    const isDirect = directTransitions.some(t => t.to === to);
    
    if (isDirect) {
      return {
        difficulty: 'seamless',
        preparation: ['Brief pause to acknowledge shift'],
        cooldown: 2,
      };
    }

    // Check if there's a path through one intermediate
    for (const t1 of directTransitions) {
      const t2Transitions = this.vayuTransitions.get(t1.to) || [];
      if (t2Transitions.some(t2 => t2.to === to)) {
        return {
          difficulty: 'easy',
          preparation: [
            `Brief ${this.WORK_TYPES[t1.to].name} phase (5-10 min)`,
            'Reset workspace',
            'Clear mental cache',
          ],
          cooldown: 10,
        };
      }
    }

    // Longer transition needed
    return {
      difficulty: 'challenging',
      preparation: [
        'Take a proper break (15-20 min)',
        'Physical movement',
        'Complete shift in environment if possible',
        'Review goals for new work type',
      ],
      cooldown: 20,
    };
  }

  // Private helpers

  private findAlternatives(
    current: Vayu,
    khaloree: number,
    vikara: number,
    allVayus: NoesisVayus['allVayus']
  ): WorkType[] {
    const alternatives: { workType: WorkType; score: number }[] = [];

    for (const [vayu, strength] of Object.entries(allVayus)) {
      if (vayu === current) continue;
      
      const workType = this.WORK_TYPES[vayu as Vayu];
      const score = this.calculateWorkTypeScore(workType, khaloree, vikara, 0) * (strength / 100);
      
      alternatives.push({ workType, score });
    }

    return alternatives
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(a => a.workType);
  }

  private calculateWorkTypeScore(
    workType: WorkType,
    khaloree: number,
    vikara: number,
    cliffordOctave: number
  ): number {
    const profile = workType.energyProfile;
    
    // Energy match
    const khaloreeScore = khaloree >= profile.khaloreeMin ? 
      1 : khaloree / profile.khaloreeMin;
    
    // Drift tolerance
    const vikaraScore = vikara <= profile.vikaraMax ? 
      1 : profile.vikaraMax / vikara;
    
    // Octave alignment
    const octaveScore = profile.cliffordOctaves.includes(cliffordOctave) ? 1 : 0.5;
    
    return (khaloreeScore * 0.4 + vikaraScore * 0.4 + octaveScore * 0.2);
  }

  private getTypicalMaxDuration(vayu: Vayu): number {
    const transitions = this.vayuTransitions.get(vayu) || [];
    return Math.max(...transitions.map(t => t.typicalDuration), 120);
  }
}

// Singleton instance
let sharedAdapter: VayuAdapter | null = null;

export function getVayuAdapter(): VayuAdapter {
  if (!sharedAdapter) {
    sharedAdapter = new VayuAdapter();
  }
  return sharedAdapter;
}

export function resetVayuAdapter(): void {
  sharedAdapter = null;
}

export default VayuAdapter;
