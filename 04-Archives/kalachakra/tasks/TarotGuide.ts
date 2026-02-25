/**
 * TarotGuide.ts
 * 
 * Daily Tarot guidance system for the Kalachakra Dashboard build.
 * Draws cards for the day, interprets them for the current hero phase,
 * and suggests task alignment based on energetic compatibility.
 * 
 * Tarot serves as the bridge between inner state (vayu) and outer work (tasks).
 */

import {
  DASHBOARD_TASKS,
  KalachakraTask,
  HeroPhase,
  Vayu,
  getTasksByPhase,
  getTaskById,
  getPhaseName
} from './DashboardTasks';

import { JourneyTracker, getPhaseColor } from './JourneyTracker';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TarotCard {
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  number?: number;
  keywords: string[];
  meaning: {
    upright: string;
    reversed: string;
  };
  elemental: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
  planetary?: string;
  zodiac?: string;
}

export interface DailyDraw {
  date: string;
  card: TarotCard;
  reversed: boolean;
  phaseAtDraw: HeroPhase;
  vayuAtDraw: Vayu;
  interpretation: CardInterpretation;
  taskRecommendations: TaskRecommendation[];
  warning: string | null;
  meditation: string;
}

export interface CardInterpretation {
  forPhase: string;
  forVayu: string;
  shadow: string;
  light: string;
  action: string;
  avoid: string;
}

export interface TaskRecommendation {
  task: KalachakraTask;
  compatibility: number; // 0-100
  reason: string;
  optimalVayuMatch: boolean;
  phaseAlignment: 'aligned' | 'challenging' | 'neutral';
}

export interface SpreadPosition {
  name: string;
  meaning: string;
  card?: TarotCard;
  reversed?: boolean;
  interpretation?: string;
}

export interface DailySpread {
  date: string;
  positions: SpreadPosition[];
  overallTheme: string;
}

export type SpreadType = 'single' | 'three_card' | 'celtic_cross' | 'hero_journey';

// ============================================================================
// TAROT DECK
// ============================================================================

export const TAROT_DECK: TarotCard[] = [
  // MAJOR ARCANA
  { name: 'The Fool', arcana: 'major', number: 0, keywords: ['beginnings', 'innocence', 'spontaneity'], meaning: { upright: 'New beginnings, innocence, spontaneity', reversed: 'Recklessness, risk-taking, foolishness' }, elemental: 'air' },
  { name: 'The Magician', arcana: 'major', number: 1, keywords: ['manifestation', 'power', 'action'], meaning: { upright: 'Manifestation, resourcefulness, power', reversed: 'Manipulation, poor planning, untapped talents' }, elemental: 'air', planetary: 'Mercury' },
  { name: 'The High Priestess', arcana: 'major', number: 2, keywords: ['intuition', 'mystery', 'subconscious'], meaning: { upright: 'Intuition, sacred knowledge, divine feminine', reversed: 'Secrets, disconnected from intuition, withdrawal' }, elemental: 'water', planetary: 'Moon' },
  { name: 'The Empress', arcana: 'major', number: 3, keywords: ['fertility', 'nurturing', 'abundance'], meaning: { upright: 'Femininity, beauty, nature, abundance', reversed: 'Creative block, dependence on others' }, elemental: 'earth', planetary: 'Venus' },
  { name: 'The Emperor', arcana: 'major', number: 4, keywords: ['authority', 'structure', 'foundation'], meaning: { upright: 'Authority, establishment, structure', reversed: 'Domination, excessive control, rigidity' }, elemental: 'fire', zodiac: 'Aries' },
  { name: 'The Hierophant', arcana: 'major', number: 5, keywords: ['tradition', 'conformity', 'education'], meaning: { upright: 'Spiritual wisdom, religious beliefs, conformity', reversed: 'Personal beliefs, freedom, challenging tradition' }, elemental: 'earth', zodiac: 'Taurus' },
  { name: 'The Lovers', arcana: 'major', number: 6, keywords: ['love', 'harmony', 'choices'], meaning: { upright: 'Love, harmony, relationships, choices', reversed: 'Self-love, disharmony, imbalance' }, elemental: 'air', zodiac: 'Gemini' },
  { name: 'The Chariot', arcana: 'major', number: 7, keywords: ['control', 'willpower', 'victory'], meaning: { upright: 'Control, willpower, success, action', reversed: 'Self-discipline, opposition, lack of direction' }, elemental: 'water', zodiac: 'Cancer' },
  { name: 'Strength', arcana: 'major', number: 8, keywords: ['courage', 'persuasion', 'influence'], meaning: { upright: 'Strength, courage, patience, control', reversed: 'Self-doubt, weakness, insecurity' }, elemental: 'fire', zodiac: 'Leo' },
  { name: 'The Hermit', arcana: 'major', number: 9, keywords: ['introspection', 'solitude', 'guidance'], meaning: { upright: 'Soul-searching, introspection, being alone', reversed: 'Isolation, loneliness, withdrawal' }, elemental: 'earth', zodiac: 'Virgo' },
  { name: 'Wheel of Fortune', arcana: 'major', number: 10, keywords: ['luck', 'karma', 'cycles'], meaning: { upright: 'Good luck, karma, life cycles, destiny', reversed: 'Bad luck, resistance to change, breaking cycles' }, elemental: 'fire', planetary: 'Jupiter' },
  { name: 'Justice', arcana: 'major', number: 11, keywords: ['fairness', 'truth', 'law'], meaning: { upright: 'Justice, fairness, truth, cause and effect', reversed: 'Unfairness, lack of accountability, dishonesty' }, elemental: 'air', zodiac: 'Libra' },
  { name: 'The Hanged Man', arcana: 'major', number: 12, keywords: ['pause', 'surrender', 'new perspective'], meaning: { upright: 'Pause, surrender, letting go, new perspectives', reversed: 'Delays, resistance, stalling, indecision' }, elemental: 'water', planetary: 'Neptune' },
  { name: 'Death', arcana: 'major', number: 13, keywords: ['endings', 'transformation', 'transition'], meaning: { upright: 'Endings, change, transformation, transition', reversed: 'Resistance to change, inability to move on' }, elemental: 'water', zodiac: 'Scorpio' },
  { name: 'Temperance', arcana: 'major', number: 14, keywords: ['balance', 'moderation', 'patience'], meaning: { upright: 'Balance, moderation, patience, purpose', reversed: 'Imbalance, excess, self-healing, re-alignment' }, elemental: 'fire', zodiac: 'Sagittarius' },
  { name: 'The Devil', arcana: 'major', number: 15, keywords: ['shadow self', 'attachment', 'restriction'], meaning: { upright: 'Shadow self, attachment, addiction, restriction', reversed: 'Releasing limiting beliefs, detachment' }, elemental: 'earth', zodiac: 'Capricorn' },
  { name: 'The Tower', arcana: 'major', number: 16, keywords: ['sudden change', 'upheaval', 'awakening'], meaning: { upright: 'Sudden change, upheaval, chaos, revelation', reversed: 'Personal transformation, fear of change' }, elemental: 'fire', planetary: 'Mars' },
  { name: 'The Star', arcana: 'major', number: 17, keywords: ['hope', 'faith', 'purpose'], meaning: { upright: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Lack of faith, despair, discouragement' }, elemental: 'air', zodiac: 'Aquarius' },
  { name: 'The Moon', arcana: 'major', number: 18, keywords: ['illusion', 'fear', 'anxiety'], meaning: { upright: 'Illusion, fear, anxiety, subconscious, intuition', reversed: 'Release of fear, repressed emotion, confusion' }, elemental: 'water', zodiac: 'Pisces' },
  { name: 'The Sun', arcana: 'major', number: 19, keywords: ['positivity', 'fun', 'warmth'], meaning: { upright: 'Positivity, fun, warmth, success, vitality', reversed: 'Inner child, feeling down, overly optimistic' }, elemental: 'fire', planetary: 'Sun' },
  { name: 'Judgement', arcana: 'major', number: 20, keywords: ['rebirth', 'inner calling', 'absolution'], meaning: { upright: 'Judgement, rebirth, inner calling, absolution', reversed: 'Self-doubt, refusal of self-examination' }, elemental: 'fire', planetary: 'Pluto' },
  { name: 'The World', arcana: 'major', number: 21, keywords: ['completion', 'integration', 'accomplishment'], meaning: { upright: 'Completion, integration, accomplishment, travel', reversed: 'Seeking personal closure, short-cuts, delays' }, elemental: 'earth', planetary: 'Saturn' },

  // MINOR ARCANA - WANDS (Fire, Action, Will)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const meanings = [
      'Creation, willpower, inspiration, desire',
      'Planning, decisions, discovery',
      'Expansion, foresight, overseas opportunities',
      'Celebration, harmony, marriage, home',
      'Conflict, disagreements, competition',
      'Victory, success, public reward',
      'Perseverance, defensive, maintaining control',
      'Speed, action, air travel, movement',
      'Resilience, grit, last stand',
      'Burden, responsibility, hard work',
      'Exploration, excitement, freedom',
      'Action, adventure, fearlessness',
      'Confidence, social butterfly, determination',
      'Vision, entrepreneurship, honor'
    ];
    return {
      name: `${names[i]} of Wands`,
      arcana: 'minor' as const,
      suit: 'wands' as const,
      number: num,
      keywords: [names[i].toLowerCase(), 'action', 'fire'],
      meaning: { upright: meanings[i], reversed: `Reversed: ${meanings[i]}` },
      elemental: 'fire' as const
    };
  }),

  // MINOR ARCANA - CUPS (Water, Emotion, Relationships)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const meanings = [
      'Love, new feelings, emotional awakening',
      'Unity, partnership, mutual attraction',
      'Celebration, friendship, community',
      'Contemplation, apathy, reevaluation',
      'Loss, grief, disappointment',
      'Nostalgia, childhood memories, innocence',
      'Choices, fantasy, illusion, wishful thinking',
      'Walking away, disillusionment, leaving behind',
      'Contentment, satisfaction, emotional stability',
      'Divine love, blissful relationships, harmony',
      'Creative opportunities, curiosity, possibility',
      'Romance, charm, imagination, beauty',
      'Compassion, warmth, intuitive counselor',
      'Emotional balance, diplomacy, mastery'
    ];
    return {
      name: `${names[i]} of Cups`,
      arcana: 'minor' as const,
      suit: 'cups' as const,
      number: num,
      keywords: [names[i].toLowerCase(), 'emotion', 'water'],
      meaning: { upright: meanings[i], reversed: `Reversed: ${meanings[i]}` },
      elemental: 'water' as const
    };
  }),

  // MINOR ARCANA - SWORDS (Air, Intellect, Conflict)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const meanings = [
      'Breakthrough, clarity, sharp mind',
      'Indecision, difficult choices, stalemate',
      'Heartbreak, grief, sorrow',
      'Rest, restoration, contemplation',
      'Conflict, disagreements, competition',
      'Transition, change, rite of passage',
      'Deception, strategy, sneakiness',
      'Negative patterns, imprisonment, victim mentality',
      'Anxiety, worry, fear, nightmares',
      'Painful endings, deep wounds, betrayal',
      'Curiosity, restlessness, mental energy',
      'Action, impulsiveness, defending beliefs',
      'Complexity, perceptiveness, clear boundaries',
      'Mental clarity, intellectual power, authority'
    ];
    return {
      name: `${names[i]} of Swords`,
      arcana: 'minor' as const,
      suit: 'swords' as const,
      number: num,
      keywords: [names[i].toLowerCase(), 'intellect', 'air'],
      meaning: { upright: meanings[i], reversed: `Reversed: ${meanings[i]}` },
      elemental: 'air' as const
    };
  }),

  // MINOR ARCANA - PENTACLES (Earth, Material, Physical)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const meanings = [
      'Manifestation, new financial opportunity, prosperity',
      'Balancing decisions, priorities, time management',
      'Teamwork, collaboration, learning, implementation',
      'Conservation, frugality, security, hoarding',
      'Financial loss, poverty, lack mindset',
      'Generosity, charity, giving, prosperity',
      'Vision, perseverance, diligence, investment',
      'Apprenticeship, repetitive tasks, mastery',
      'Abundance, luxury, self-sufficiency, financial independence',
      'Wealth, financial security, family, long-term success',
      'Manifestation, financial opportunity, skill development',
      'Hard work, productivity, routine, conservatism',
      'Nurturing, practical, providing financially, working parent',
      'Wealth, business, leadership, security, discipline'
    ];
    return {
      name: `${names[i]} of Pentacles`,
      arcana: 'minor' as const,
      suit: 'pentacles' as const,
      number: num,
      keywords: [names[i].toLowerCase(), 'material', 'earth'],
      meaning: { upright: meanings[i], reversed: `Reversed: ${meanings[i]}` },
      elemental: 'earth' as const
    };
  })
];

// ============================================================================
// PHASE-CARD AFFINITIES
// ============================================================================

const PHASE_CARD_AFFINITIES: Record<HeroPhase, string[]> = {
  1: ['The Fool', 'The Magician', 'The Empress', 'Ace of Wands', 'Ace of Cups', 'Ace of Pentacles'], // Beginnings
  2: ['The Emperor', 'The Hierophant', 'The Chariot', 'Two of Wands', 'Knight of Wands'], // Structure & Action
  3: ['Strength', 'The Hermit', 'Wheel of Fortune', 'Nine of Wands', 'Four of Swords'], // Inner work
  4: ['Justice', 'The Hanged Man', 'Death', 'Temperance', 'The High Priestess'], // Transformation
  5: ['The Tower', 'The Star', 'The Devil', 'Ten of Wands', 'Eight of Cups'], // Breakthrough
  6: ['The Sun', 'Judgement', 'Six of Wands', 'Three of Pentacles', 'Seven of Wands'], // Success & Testing
  7: ['The Moon', 'The World', 'Page of Cups', 'Four of Wands', 'Knight of Swords'], // Deep work
  8: ['Ten of Swords', 'Five of Pentacles', 'Three of Swords', 'The Tower', 'Nine of Swords'], // Ordeal
  9: ['Nine of Cups', 'Ten of Cups', 'The Sun', 'The World', 'Six of Cups'], // Reward
  10: ['Eight of Wands', 'Six of Swords', 'Eight of Pentacles', 'Three of Wands', 'Page of Pentacles'], // Movement
  11: ['Death', 'Judgement', 'The Star', 'Ace of Swords', 'Queen of Wands'], // Resurrection
  12: ['The World', 'Four of Wands', 'Ten of Pentacles', 'King of Pentacles', 'The Sun'] // Completion
};

// ============================================================================
// VAYU-CARD AFFINITIES
// ============================================================================

const VAYU_CARD_AFFINITIES: Record<Vayu, string[]> = {
  prana: ['The Magician', 'The Fool', 'Ace of Wands', 'Page of Wands', 'Knight of Swords'], // Inward, planning
  apana: ['The Emperor', 'King of Pentacles', 'Three of Pentacles', 'Eight of Pentacles', 'Seven of Pentacles'], // Downward, implementation
  samana: ['Justice', 'Temperance', 'Two of Pentacles', 'Six of Pentacles', 'Queen of Cups'], // Balancing
  udana: ['The Chariot', 'The Sun', 'Six of Wands', 'Knight of Wands', 'Eight of Wands'], // Upward, elevation
  vyana: ['The World', 'Ten of Cups', 'Ten of Pentacles', 'Three of Cups', 'Ten of Wands'], // Diffusing
  kurma: ['The Hermit', 'Four of Swords', 'The Hanged Man', 'Two of Swords', 'Nine of Pentacles'], // Pausing
  krkara: ['Strength', 'Nine of Wands', 'Seven of Wands', 'Five of Wands', 'Five of Swords'], // Hunger for quality
  devadatta: ['Death', 'The Tower', 'Ten of Swords', 'Five of Cups', 'Eight of Cups'], // Clearing
  dhananjaya: ['The World', 'Judgement', 'King of Wands', 'Queen of Pentacles', 'Ace of Swords'], // Completion
  naga: ['The Devil', 'The Moon', 'Seven of Swords', 'Three of Swords', 'Five of Pentacles'], // Release
  kumar: ['The Fool', 'Page of Cups', 'Page of Wands', 'Page of Swords', 'Page of Pentacles'], // Experimentation
  mukhya: ['The Magician', 'The High Priestess', 'The Emperor', 'The Empress', 'The Hierophant'] // Core
};

// ============================================================================
// TAROT GUIDE CLASS
// ============================================================================

export class TarotGuide {
  private deck: TarotCard[];
  private drawnCards: Map<string, DailyDraw>;
  private currentVayu: Vayu;
  private journeyTracker: JourneyTracker;

  constructor(journeyTracker: JourneyTracker, initialVayu: Vayu = 'prana') {
    this.deck = [...TAROT_DECK];
    this.drawnCards = new Map();
    this.currentVayu = initialVayu;
    this.journeyTracker = journeyTracker;
  }

  // -------------------------------------------------------------------------
  // DAILY DRAW
  // -------------------------------------------------------------------------

  drawDaily(date: Date = new Date()): DailyDraw {
    const dateKey = this.formatDateKey(date);
    
    // Check if already drawn today
    if (this.drawnCards.has(dateKey)) {
      return this.drawnCards.get(dateKey)!;
    }

    // Draw card
    const randomIndex = this.seededRandom(dateKey, this.deck.length);
    const card = this.deck[randomIndex];
    const reversed = this.seededRandom(dateKey + 'rev', 2) === 0;

    const currentPhase = this.journeyTracker.getCurrentPhase();
    
    const draw: DailyDraw = {
      date: dateKey,
      card,
      reversed,
      phaseAtDraw: currentPhase,
      vayuAtDraw: this.currentVayu,
      interpretation: this.interpretCard(card, reversed, currentPhase, this.currentVayu),
      taskRecommendations: this.getTaskRecommendations(card, reversed, currentPhase),
      warning: this.getWarning(card, reversed, currentPhase, this.currentVayu),
      meditation: this.getMeditation(card, reversed)
    };

    this.drawnCards.set(dateKey, draw);
    return draw;
  }

  // -------------------------------------------------------------------------
  // CARD INTERPRETATION
  // -------------------------------------------------------------------------

  private interpretCard(
    card: TarotCard,
    reversed: boolean,
    phase: HeroPhase,
    vayu: Vayu
  ): CardInterpretation {
    const phaseName = getPhaseName(phase);
    
    // Phase-specific interpretation
    const phaseInterpretations: Record<HeroPhase, { light: string; shadow: string; action: string; avoid: string }> = {
      1: { 
        light: 'New beginnings are blessed. Start fresh with beginner\'s mind.',
        shadow: 'Fear of starting may mask itself as preparation.',
        action: 'Begin something new today, even if small.',
        avoid: 'Over-planning before taking first step.'
      },
      2: {
        light: 'Your call to action is supported by cosmic forces.',
        shadow: 'Imposter syndrome may whisper doubts.',
        action: 'Commit to the path that calls you.',
        avoid: 'Waiting for perfect conditions.'
      },
      3: {
        light: 'Resistance is part of the process. Honor it, then move through.',
        shadow: 'Self-sabotage dressed as caution.',
        action: 'Acknowledge fears, then act anyway.',
        avoid: 'Using preparation as procrastination.'
      },
      4: {
        light: 'Wisdom surrounds you. Be open to guidance.',
        shadow: 'Pride blocking needed help.',
        action: 'Ask for help or mentorship today.',
        avoid: 'Going it alone when support exists.'
      },
      5: {
        light: 'The threshold is ready for crossing. Courage!',
        shadow: 'Clinging to the familiar out of fear.',
        action: 'Take the decisive step forward.',
        avoid: 'Looking back once you\'ve committed.'
      },
      6: {
        light: 'Tests reveal your strength. Allies appear in unexpected forms.',
        shadow: 'Seeing challenges as obstacles rather than teachers.',
        action: 'Engage with difficulties as opportunities.',
        avoid: 'Avoiding necessary confrontations.'
      },
      7: {
        light: 'The inner cave holds treasures. Prepare for deep work.',
        shadow: 'Distraction as escape from depth.',
        action: 'Focus on the most challenging task.',
        avoid: 'Shallow work when depth is needed.'
      },
      8: {
        light: 'The ordeal transforms. You are stronger than you know.',
        shadow: 'Fear of transformation keeping you small.',
        action: 'Face the difficult thing directly.',
        avoid: 'Half-measures or partial commitment.'
      },
      9: {
        light: 'The reward is yours to claim. Receive it fully.',
        shadow: 'Guilt about success or fear of losing it.',
        action: 'Celebrate and integrate your gains.',
        avoid: 'Immediately rushing to next challenge.'
      },
      10: {
        light: 'The return journey has its own wisdom. Share what you learned.',
        shadow: 'Wanting to stay in the special world forever.',
        action: 'Begin integrating lessons into daily life.',
        avoid: 'Isolation from your community.'
      },
      11: {
        light: 'Final transformation. The old self falls away.',
        shadow: 'Clinging to identity during change.',
        action: 'Surrender to the final transformation.',
        avoid: 'Resisting the necessary death/rebirth.'
      },
      12: {
        light: 'The elixir is ready. Your journey serves others now.',
        shadow: 'Hoarding wisdom instead of sharing.',
        action: 'Share your completed work with the world.',
        avoid: 'Perfectionism preventing release.'
      }
    };

    const phaseInterp = phaseInterpretations[phase];

    // Vayu-specific guidance
    const vayuGuidance: Record<Vayu, string> = {
      prana: 'Inward focus serves you. Plan, design, visualize before acting.',
      apana: 'Ground your energy. Implement, build, make tangible progress.',
      samana: 'Find your center. Balance opposing forces, test thoroughly.',
      udana: 'Rise up. Deploy, announce, elevate your work.',
      vyana: 'Spread outward. Integrate, distribute, connect the parts.',
      kurma: 'Pause and see. Review, reflect, adjust your approach.',
      krkara: 'Refine with hunger. Improve quality, fix what\'s broken.',
      devadatta: 'Clear the air. Debug, release errors, start fresh.',
      dhananjaya: 'Open and close cycles. Polish, finish, complete.',
      naga: 'Let go. Handle errors gracefully, release what doesn\'t serve.',
      kumar: 'Play and experiment. Try new approaches without attachment.',
      mukhya: 'Focus on essence. Work on core architecture, fundamentals.'
    };

    return {
      forPhase: `${phaseName}: ${reversed ? phaseInterp.shadow : phaseInterp.light}`,
      forVayu: vayuGuidance[vayu],
      shadow: reversed ? card.meaning.reversed : `Shadow: ${phaseInterp.shadow}`,
      light: reversed ? phaseInterp.light : card.meaning.upright,
      action: phaseInterp.action,
      avoid: phaseInterp.avoid
    };
  }

  // -------------------------------------------------------------------------
  // TASK RECOMMENDATIONS
  // -------------------------------------------------------------------------

  private getTaskRecommendations(
    card: TarotCard,
    reversed: boolean,
    currentPhase: HeroPhase
  ): TaskRecommendation[] {
    const availableTasks = DASHBOARD_TASKS.filter(t => 
      t.status === 'available' || t.status === 'in_progress'
    );

    const recommendations: TaskRecommendation[] = availableTasks.map(task => {
      let compatibility = 50; // Base compatibility

      // Phase alignment
      if (task.heroPhase === currentPhase) {
        compatibility += 20;
      } else if (Math.abs(task.heroPhase - currentPhase) === 1) {
        compatibility += 10;
      }

      // Card-phase affinity
      const phaseAffinities = PHASE_CARD_AFFINITIES[task.heroPhase] || [];
      if (phaseAffinities.includes(card.name)) {
        compatibility += 15;
      }

      // Card-vayu affinity
      const vayuAffinities = VAYU_CARD_AFFINITIES[task.noesis.optimalVayu] || [];
      if (vayuAffinities.includes(card.name)) {
        compatibility += 15;
      }

      // Elemental alignment
      const taskElement = this.getKoshaElement(task.kosha);
      if (card.elemental === taskElement) {
        compatibility += 10;
      }

      // Reversed penalty
      if (reversed) {
        compatibility -= 20;
      }

      // Clamp to 0-100
      compatibility = Math.max(0, Math.min(100, compatibility));

      const phaseAlignment: TaskRecommendation['phaseAlignment'] = 
        task.heroPhase === currentPhase ? 'aligned' :
        task.heroPhase < currentPhase ? 'challenging' : 'neutral';

      return {
        task,
        compatibility,
        reason: this.generateRecommendationReason(card, task, compatibility),
        optimalVayuMatch: vayuAffinities.includes(card.name),
        phaseAlignment
      };
    });

    // Sort by compatibility and return top 5
    return recommendations
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 5);
  }

  private getKoshaElement(kosha: KalachakraTask['kosha']): string {
    const elements: Record<typeof kosha, string> = {
      annamaya: 'earth',
      pranamaya: 'fire',
      manomaya: 'air',
      vijnanamaya: 'water',
      anandamaya: 'fire',
      noesis: 'spirit'
    };
    return elements[kosha];
  }

  private generateRecommendationReason(
    card: TarotCard,
    task: KalachakraTask,
    compatibility: number
  ): string {
    if (compatibility >= 80) {
      return `${card.name} strongly supports ${task.name}. Energy is aligned for ${task.noesis.optimalVayu} work.`;
    } else if (compatibility >= 60) {
      return `Favorable conditions for ${task.name}. ${card.keywords[0]} energy will assist.`;
    } else if (compatibility >= 40) {
      return `Moderate alignment. Progress possible with focus on ${task.microJourney.ordeal}.`;
    } else {
      return `Challenging energy today. Consider ${task.noesis.optimalVayu} practices before starting.`;
    }
  }

  // -------------------------------------------------------------------------
  // WARNINGS
  // -------------------------------------------------------------------------

  private getWarning(
    card: TarotCard,
    reversed: boolean,
    phase: HeroPhase,
    vayu: Vayu
  ): string | null {
    // Check for major misalignment
    const phaseAffinities = PHASE_CARD_AFFINITIES[phase] || [];
    const vayuAffinities = VAYU_CARD_AFFINITIES[vayu] || [];
    
    const phaseAligned = phaseAffinities.includes(card.name);
    const vayuAligned = vayuAffinities.includes(card.name);

    if (reversed && !phaseAligned && !vayuAligned) {
      return `⚠️ ${card.name} reversed signals significant energy misalignment. Consider rest or kurma (pausing) practices today. Major decisions deferred.`;
    }

    if (reversed && card.arcana === 'major') {
      return `⚠️ Major Arcana reversed: ${card.meaning.reversed}. Shadow work may be needed before productive coding.`;
    }

    if (!phaseAligned && phase >= 8) {
      return `⚠️ Late-phase work (${getPhaseName(phase)}) may be challenging with ${card.name} energy. Focus on preparation over execution.`;
    }

    return null;
  }

  // -------------------------------------------------------------------------
  // MEDITATION
  // -------------------------------------------------------------------------

  private getMeditation(card: TarotCard, reversed: boolean): string {
    const meditations: Record<string, string> = {
      'The Fool': 'Breathe in possibility. Exhale expectation. Begin again.',
      'The Magician': 'As above, so below. Your tools are ready. Manifest.',
      'The High Priestess': 'Sit in silence. Listen to what is not spoken.',
      'The Empress': 'Nurture your creation as you would a child.',
      'The Emperor': 'Build your foundation stone by stone. Structure serves freedom.',
      'The Hierophant': 'Honor tradition while finding your own path.',
      'The Lovers': 'Choose with your whole heart. Alignment over agreement.',
      'The Chariot': 'Direct your will. Victory comes through focus.',
      'Strength': 'Gentle persistence conquers force. Breathe through resistance.',
      'The Hermit': 'In solitude, find your inner light. Carry it forward.',
      'Wheel of Fortune': 'This too shall pass. Dance with the cycles.',
      'Justice': 'Seek truth, not victory. Balance in all things.',
      'The Hanged Man': 'Surrender to gain perspective. Pause is progress.',
      'Death': 'Let go to grow. Endings are beginnings.',
      'Temperance': 'Blend opposites. Find the middle way.',
      'The Devil': 'Your chains are loose. Notice and release.',
      'The Tower': 'What falls was not built to last. Rebuild on truth.',
      'The Star': 'Hope is not naive. Trust the light ahead.',
      'The Moon': 'Navigate by intuition when clarity is obscured.',
      'The Sun': 'Shine fully. Your light warms others.',
      'Judgement': 'Answer your calling. Rise renewed.',
      'The World': 'Completion and beginning are one. Celebrate the cycle.'
    };

    return meditations[card.name] || 
      `Hold ${card.name} in your awareness. ${card.meaning.upright}`;
  }

  // -------------------------------------------------------------------------
  // SPREADS
  // -------------------------------------------------------------------------

  drawSpread(type: SpreadType, date: Date = new Date()): DailySpread {
    const dateKey = this.formatDateKey(date);
    
    switch (type) {
      case 'three_card':
        return this.drawThreeCardSpread(dateKey);
      case 'celtic_cross':
        return this.drawCelticCrossSpread(dateKey);
      case 'hero_journey':
        return this.drawHeroJourneySpread(dateKey);
      default:
        return this.drawSingleCardSpread(dateKey);
    }
  }

  private drawSingleCardSpread(dateKey: string): DailySpread {
    const card = this.deck[this.seededRandom(dateKey, this.deck.length)];
    const reversed = this.seededRandom(dateKey + 'rev', 2) === 0;
    
    return {
      date: dateKey,
      positions: [{
        name: 'The Day',
        meaning: 'Energy and guidance for today',
        card,
        reversed,
        interpretation: reversed ? card.meaning.reversed : card.meaning.upright
      }],
      overallTheme: reversed ? card.meaning.reversed : card.meaning.upright
    };
  }

  private drawThreeCardSpread(dateKey: string): DailySpread {
    const positions: SpreadPosition[] = [
      { name: 'Past', meaning: 'What brought you here' },
      { name: 'Present', meaning: 'Current energy' },
      { name: 'Future', meaning: 'Where this leads' }
    ];

    const usedIndices = new Set<number>();
    
    for (let i = 0; i < 3; i++) {
      let idx: number;
      do {
        idx = this.seededRandom(`${dateKey}-3-${i}`, this.deck.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);

      const card = this.deck[idx];
      const reversed = this.seededRandom(`${dateKey}-3-${i}-rev`, 2) === 0;
      
      positions[i].card = card;
      positions[i].reversed = reversed;
      positions[i].interpretation = reversed ? card.meaning.reversed : card.meaning.upright;
    }

    return {
      date: dateKey,
      positions,
      overallTheme: `${positions[0].card?.name} → ${positions[1].card?.name} → ${positions[2].card?.name}`
    };
  }

  private drawCelticCrossSpread(dateKey: string): DailySpread {
    const positions: SpreadPosition[] = [
      { name: 'Present', meaning: 'Current situation' },
      { name: 'Challenge', meaning: 'What crosses you' },
      { name: 'Foundation', meaning: 'Root of the matter' },
      { name: 'Past', meaning: 'Recent influence' },
      { name: 'Crown', meaning: 'Best possible outcome' },
      { name: 'Future', meaning: 'Coming influence' },
      { name: 'Self', meaning: 'Your attitude' },
      { name: 'Environment', meaning: 'External influences' },
      { name: 'Hopes/Fears', meaning: 'Deep desires' },
      { name: 'Outcome', meaning: 'Where this leads' }
    ];

    const usedIndices = new Set<number>();
    
    for (let i = 0; i < 10; i++) {
      let idx: number;
      do {
        idx = this.seededRandom(`${dateKey}-cc-${i}`, this.deck.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);

      const card = this.deck[idx];
      const reversed = this.seededRandom(`${dateKey}-cc-${i}-rev`, 2) === 0;
      
      positions[i].card = card;
      positions[i].reversed = reversed;
      positions[i].interpretation = reversed ? card.meaning.reversed : card.meaning.upright;
    }

    return {
      date: dateKey,
      positions,
      overallTheme: `Crossed by ${positions[1].card?.name}, moving toward ${positions[9].card?.name}`
    };
  }

  private drawHeroJourneySpread(dateKey: string): DailySpread {
    const currentPhase = this.journeyTracker.getCurrentPhase();
    const positions: SpreadPosition[] = [
      { name: 'Ordinary World', meaning: 'Your starting point today' },
      { name: 'Call to Adventure', meaning: 'What beckons you' },
      { name: 'Refusal', meaning: 'Your resistance' },
      { name: 'Mentor', meaning: 'Guidance available' },
      { name: 'Crossing Threshold', meaning: 'Commitment required' },
      { name: 'Tests', meaning: 'Challenges ahead' },
      { name: 'Approach', meaning: 'Preparation needed' },
      { name: 'Ordeal', meaning: 'The difficult work' },
      { name: 'Reward', meaning: 'What you gain' },
      { name: 'Road Back', meaning: 'Integration' },
      { name: 'Resurrection', meaning: 'Final transformation' },
      { name: 'Elixir', meaning: 'Gift to the world' }
    ];

    const usedIndices = new Set<number>();
    
    for (let i = 0; i < 12; i++) {
      let idx: number;
      do {
        // Bias toward cards aligned with each phase
        const phaseCards = PHASE_CARD_AFFINITIES[(i + 1) as HeroPhase] || [];
        const randomChoice = this.seededRandom(`${dateKey}-hj-${i}`, 2);
        
        if (randomChoice === 0 && phaseCards.length > 0) {
          const cardName = phaseCards[this.seededRandom(`${dateKey}-hj-p${i}`, phaseCards.length)];
          idx = this.deck.findIndex(c => c.name === cardName);
        } else {
          idx = this.seededRandom(`${dateKey}-hj-r${i}`, this.deck.length);
        }
      } while (usedIndices.has(idx));
      usedIndices.add(idx);

      const card = this.deck[idx];
      const reversed = i + 1 > currentPhase && this.seededRandom(`${dateKey}-hj-${i}-rev`, 2) === 0;
      
      positions[i].card = card;
      positions[i].reversed = reversed;
      positions[i].interpretation = reversed ? card.meaning.reversed : card.meaning.upright;
    }

    return {
      date: dateKey,
      positions,
      overallTheme: `Currently in ${getPhaseName(currentPhase)}. Next major shift: ${positions[currentPhase].card?.name}`
    };
  }

  // -------------------------------------------------------------------------
  // UTILITY
  // -------------------------------------------------------------------------

  private formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private seededRandom(seed: string, max: number): number {
    // Simple string hash for deterministic "random" based on date
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % max;
  }

  setCurrentVayu(vayu: Vayu): void {
    this.currentVayu = vayu;
  }

  getCurrentVayu(): Vayu {
    return this.currentVayu;
  }

  getDrawHistory(days: number = 7): DailyDraw[] {
    const history: DailyDraw[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = this.formatDateKey(date);
      
      if (this.drawnCards.has(dateKey)) {
        history.push(this.drawnCards.get(dateKey)!);
      }
    }
    
    return history;
  }

  // -------------------------------------------------------------------------
  // EXPORT/IMPORT
  // -------------------------------------------------------------------------

  exportDraws(): string {
    return JSON.stringify(
      Array.from(this.drawnCards.entries()),
      null,
      2
    );
  }

  importDraws(json: string): void {
    const entries = JSON.parse(json);
    this.drawnCards = new Map(entries);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    fire: '#ef4444',
    water: '#3b82f6',
    air: '#a78bfa',
    earth: '#22c55e',
    spirit: '#fbbf24'
  };
  return colors[element] || '#6b7280';
}

export function getSuitIcon(suit?: string): string {
  const icons: Record<string, string> = {
    wands: '🔥',
    cups: '💧',
    swords: '⚔️',
    pentacles: '⛰️'
  };
  return icons[suit || ''] || '⭐';
}

// ============================================================================
// SINGLETON INSTANCE (requires JourneyTracker)
// ============================================================================

let tarotGuideInstance: TarotGuide | null = null;

export function initializeTarotGuide(journeyTracker: JourneyTracker, vayu?: Vayu): TarotGuide {
  tarotGuideInstance = new TarotGuide(journeyTracker, vayu);
  return tarotGuideInstance;
}

export function getTarotGuide(): TarotGuide {
  if (!tarotGuideInstance) {
    throw new Error('TarotGuide not initialized. Call initializeTarotGuide first.');
  }
  return tarotGuideInstance;
}

export default TarotGuide;
