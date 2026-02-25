/**
 * TarotOracle - Major Arcana System
 * 22 cards with kosha associations, meanings, and daily guidance
 */

import { TarotCard, TarotDraw, Kosha } from '../types/index.js';

// ============================================================================
// THE 22 MAJOR ARCANA
// ============================================================================

export const MAJOR_ARCANA: TarotCard[] = [
  {
    number: 0,
    name: 'The Fool',
    sanskritName: 'मूर्ख (Mūrka)',
    keywords: ['beginnings', 'innocence', 'spontaneity', 'free spirit'],
    meaning: {
      upright: 'Beginnings, innocence, spontaneity, a free spirit. The leap into the unknown.',
      reversed: 'Holding back, recklessness, risk-taking without thought',
      shadow: 'Fear of starting, paralysis by analysis'
    },
    kosha: 'annamaya',
    element: 'Air',
    dayOfWeek: undefined // Can appear any day
  },
  {
    number: 1,
    name: 'The Magician',
    sanskritName: 'मायावी (Māyāvī)',
    keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'],
    meaning: {
      upright: 'Manifestation, resourcefulness, power, inspired action. All tools are present.',
      reversed: 'Manipulation, poor planning, untapped talents',
      shadow: 'Doubt in one\'s own power'
    },
    kosha: 'pranamaya',
    element: 'Air',
    planet: 'Mercury',
    dayOfWeek: 1 // Monday
  },
  {
    number: 2,
    name: 'The High Priestess',
    sanskritName: 'महापुरोहिता (Mahāpurohitā)',
    keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious'],
    meaning: {
      upright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind',
      reversed: 'Secrets, disconnected from intuition, withdrawal',
      shadow: 'Ignoring inner knowing'
    },
    kosha: 'manomaya',
    element: 'Water',
    planet: 'Moon',
    dayOfWeek: 1 // Monday (night)
  },
  {
    number: 3,
    name: 'The Empress',
    sanskritName: 'साम्राज्ञी (Sāmrājñī)',
    keywords: ['femininity', 'beauty', 'nature', 'nurturing', 'abundance'],
    meaning: {
      upright: 'Femininity, beauty, nature, nurturing, abundance, creative birth',
      reversed: 'Creative block, dependence on others, emptiness',
      shadow: 'Resistance to receiving'
    },
    kosha: 'anandamaya',
    element: 'Earth',
    planet: 'Venus',
    zodiac: 'Libra/Taurus'
  },
  {
    number: 4,
    name: 'The Emperor',
    sanskritName: 'सम्राट (Samrāṭ)',
    keywords: ['authority', 'structure', 'father figure', 'solid foundation'],
    meaning: {
      upright: 'Authority, structure, solid foundation, discipline, father figure',
      reversed: 'Tyranny, rigidity, coldness, excessive control',
      shadow: 'Fear of responsibility or chaos'
    },
    kosha: 'vijnanamaya',
    element: 'Fire',
    planet: 'Mars',
    zodiac: 'Aries',
    dayOfWeek: 4 // Thursday (structured)
  },
  {
    number: 5,
    name: 'The Hierophant',
    sanskritName: 'गुरु (Guru)',
    keywords: ['spiritual wisdom', 'religious beliefs', 'conformity', 'tradition'],
    meaning: {
      upright: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions',
      reversed: 'Personal beliefs, freedom, challenging the status quo',
      shadow: 'Blind obedience or rebellion'
    },
    kosha: 'vijnanamaya',
    element: 'Earth',
    zodiac: 'Taurus'
  },
  {
    number: 6,
    name: 'The Lovers',
    sanskritName: 'प्रेमी (Premī)',
    keywords: ['love', 'harmony', 'relationships', 'choices', 'values alignment'],
    meaning: {
      upright: 'Love, harmony, relationships, values alignment, meaningful choices',
      reversed: 'Self-love, disharmony, imbalance, misalignment of values',
      shadow: 'Fear of commitment or intimacy'
    },
    kosha: 'anandamaya',
    element: 'Air',
    planet: 'Mercury',
    zodiac: 'Gemini',
    dayOfWeek: 5 // Friday
  },
  {
    number: 7,
    name: 'The Chariot',
    sanskritName: 'रथ (Ratha)',
    keywords: ['control', 'willpower', 'success', 'action', 'determination'],
    meaning: {
      upright: 'Control, willpower, success, action, determination, victory',
      reversed: 'Self-discipline, opposition, lack of direction',
      shadow: 'Aggression or giving up'
    },
    kosha: 'pranamaya',
    element: 'Water',
    planet: 'Moon',
    zodiac: 'Cancer'
  },
  {
    number: 8,
    name: 'Strength',
    sanskritName: 'शक्ति (Śakti)',
    keywords: ['strength', 'courage', 'persuasion', 'influence', 'compassion'],
    meaning: {
      upright: 'Strength, courage, persuasion, influence, compassion, soft power',
      reversed: 'Inner strength, self-doubt, low energy, raw emotion',
      shadow: 'Force vs. power confusion'
    },
    kosha: 'pranamaya',
    element: 'Fire',
    planet: 'Sun',
    zodiac: 'Leo'
  },
  {
    number: 9,
    name: 'The Hermit',
    sanskritName: 'वानप्रस्थ (Vānaprastha)',
    keywords: ['soul-searching', 'introspection', 'alone', 'inner guidance'],
    meaning: {
      upright: 'Soul-searching, introspection, being alone, inner guidance, withdrawal',
      reversed: 'Isolation, loneliness, withdrawal, rejection',
      shadow: 'Fear of being alone or never retreating'
    },
    kosha: 'all',
    element: 'Earth',
    zodiac: 'Virgo',
    dayOfWeek: 6 // Saturday
  },
  {
    number: 10,
    name: 'Wheel of Fortune',
    sanskritName: 'भाग्यचक्र (Bhāgyacakra)',
    keywords: ['good luck', 'karma', 'life cycles', 'destiny', 'turning point'],
    meaning: {
      upright: 'Good luck, karma, life cycles, destiny, a turning point, cycles',
      reversed: 'Bad luck, resistance to change, breaking cycles',
      shadow: 'Attachment to outcomes'
    },
    kosha: 'vijnanamaya',
    element: 'Fire',
    planet: 'Jupiter',
    zodiac: 'Sagittarius'
  },
  {
    number: 11,
    name: 'Justice',
    sanskritName: 'न्याय (Nyāya)',
    keywords: ['justice', 'fairness', 'truth', 'cause and effect', 'law'],
    meaning: {
      upright: 'Justice, fairness, truth, cause and effect, law, clarity',
      reversed: 'Unfairness, lack of accountability, dishonesty',
      shadow: 'Judgment of self or others'
    },
    kosha: 'vijnanamaya',
    element: 'Air',
    planet: 'Venus',
    zodiac: 'Libra'
  },
  {
    number: 12,
    name: 'The Hanged Man',
    sanskritName: 'व्यष्ट (Vyaṣṭa)',
    keywords: ['pause', 'surrender', 'letting go', 'new perspectives'],
    meaning: {
      upright: 'Pause, surrender, letting go, new perspectives, sacrifice',
      reversed: 'Delays, resistance, stalling, indecision',
      shadow: 'Inability to surrender or perpetual suspension'
    },
    kosha: 'manomaya',
    element: 'Water',
    planet: 'Neptune',
    dayOfWeek: 3 // Wednesday (suspended in middle)
  },
  {
    number: 13,
    name: 'Death',
    sanskritName: 'मृत्यु (Mṛtyu)',
    keywords: ['endings', 'change', 'transformation', 'transition'],
    meaning: {
      upright: 'Endings, change, transformation, transition, letting go, rebirth',
      reversed: 'Resistance to change, inability to move on, stagnation',
      shadow: 'Fear of endings'
    },
    kosha: 'manomaya',
    element: 'Water',
    planet: 'Pluto',
    zodiac: 'Scorpio'
  },
  {
    number: 14,
    name: 'Temperance',
    sanskritName: 'संयम (Saṃyama)',
    keywords: ['balance', 'moderation', 'patience', 'purpose', 'meaning'],
    meaning: {
      upright: 'Balance, moderation, patience, purpose, meaning, alchemy',
      reversed: 'Imbalance, excess, self-healing, re-alignment',
      shadow: 'Extremism or lack of passion'
    },
    kosha: 'all',
    element: 'Fire',
    planet: 'Jupiter',
    zodiac: 'Sagittarius'
  },
  {
    number: 15,
    name: 'The Devil',
    sanskritName: 'असुर (Asura)',
    keywords: ['shadow self', 'attachment', 'addiction', 'restriction', 'materialism'],
    meaning: {
      upright: 'Shadow self, attachment, addiction, restriction, materialism, temptation',
      reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment',
      shadow: 'Unconscious patterns controlling behavior'
    },
    kosha: 'annamaya',
    element: 'Earth',
    planet: 'Saturn',
    zodiac: 'Capricorn'
  },
  {
    number: 16,
    name: 'The Tower',
    sanskritName: 'वज्र (Vajra)',
    keywords: ['sudden change', 'upheaval', 'chaos', 'revelation', 'awakening'],
    meaning: {
      upright: 'Sudden change, upheaval, chaos, revelation, awakening, destruction',
      reversed: 'Personal transformation, fear of change, averting disaster',
      shadow: 'Resistance to necessary collapse'
    },
    kosha: 'pranamaya',
    element: 'Fire',
    planet: 'Mars',
    zodiac: 'Aries',
    dayOfWeek: 2 // Tuesday
  },
  {
    number: 17,
    name: 'The Star',
    sanskritName: 'तारका (Tārakā)',
    keywords: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'],
    meaning: {
      upright: 'Hope, faith, purpose, renewal, spirituality, inspiration, calm',
      reversed: 'Lack of faith, despair, discouragement, insecurity',
      shadow: 'Loss of meaning or direction'
    },
    kosha: 'anandamaya',
    element: 'Air',
    planet: 'Uranus',
    zodiac: 'Aquarius'
  },
  {
    number: 18,
    name: 'The Moon',
    sanskritName: 'चन्द्र (Candra)',
    keywords: ['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'],
    meaning: {
      upright: 'Illusion, fear, anxiety, subconscious, intuition, dreams, uncertainty',
      reversed: 'Release of fear, repressed emotion, inner confusion',
      shadow: 'Being lost in fantasy or paranoia'
    },
    kosha: 'manomaya',
    element: 'Water',
    planet: 'Moon',
    zodiac: 'Pisces'
  },
  {
    number: 19,
    name: 'The Sun',
    sanskritName: 'सूर्य (Sūrya)',
    keywords: ['positivity', 'fun', 'warmth', 'success', 'vitality', 'joy'],
    meaning: {
      upright: 'Positivity, fun, warmth, success, vitality, joy, enlightenment',
      reversed: 'Inner child, feeling down, overly optimistic, temporary depression',
      shadow: 'Fear of success or visibility'
    },
    kosha: 'anandamaya',
    element: 'Fire',
    planet: 'Sun',
    zodiac: 'Leo',
    dayOfWeek: 0 // Sunday
  },
  {
    number: 20,
    name: 'Judgement',
    sanskritName: 'प्रलय (Pralaya)',
    keywords: ['judgement', 'rebirth', 'inner calling', 'absolution', 'awakening'],
    meaning: {
      upright: 'Judgement, rebirth, inner calling, absolution, awakening, evaluation',
      reversed: 'Self-doubt, refusal of self-examination, ignoring the call',
      shadow: 'Harsh judgment of self or others'
    },
    kosha: 'all',
    element: 'Fire',
    planet: 'Pluto',
    zodiac: 'Scorpio'
  },
  {
    number: 21,
    name: 'The World',
    sanskritName: 'विश्व (Viśva)',
    keywords: ['completion', 'integration', 'accomplishment', 'travel', 'unity'],
    meaning: {
      upright: 'Completion, integration, accomplishment, travel, unity, wholeness',
      reversed: 'Seeking personal closure, short-cuts, delays, emptiness',
      shadow: 'Fear of completion or commitment'
    },
    kosha: 'all',
    element: 'Earth',
    planet: 'Saturn',
    zodiac: 'Capricorn'
  }
];

// ============================================================================
// DAY-CARD MAPPINGS
// ============================================================================

export const DAY_CARD_MAP: Record<number, number> = {
  0: 19,  // Sunday: The Sun
  1: 1,   // Monday: The Magician
  2: 16,  // Tuesday: The Tower
  3: 2,   // Wednesday: The High Priestess
  4: 4,   // Thursday: The Emperor
  5: 6,   // Friday: The Lovers
  6: 9    // Saturday: The Hermit
};

// ============================================================================
// TAROT ORACLE CLASS
// ============================================================================

export class TarotOracle {
  private cards: Map<number, TarotCard>;

  constructor() {
    this.cards = new Map(MAJOR_ARCANA.map(c => [c.number, c]));
  }

  /**
   * Get card by number
   */
  getCard(number: number): TarotCard | undefined {
    return this.cards.get(number);
  }

  /**
   * Get card by name
   */
  getCardByName(name: string): TarotCard | undefined {
    return MAJOR_ARCANA.find(c => 
      c.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Get the card of the day based on day of week
   */
  getCardOfTheDay(date: Date = new Date()): TarotCard {
    const dayOfWeek = date.getDay();
    const cardNumber = DAY_CARD_MAP[dayOfWeek];
    return this.cards.get(cardNumber) || MAJOR_ARCANA[0];
  }

  /**
   * Get card for a specific kosha
   */
  getCardForKosha(kosha: string): TarotCard[] {
    return MAJOR_ARCANA.filter(c => c.kosha === kosha);
  }

  /**
   * Draw a card with deterministic but seemingly random behavior
   * Uses a seeded PRNG for reproducibility
   */
  drawCard(context?: string, intentionalSeed?: number): TarotDraw {
    const timestamp = new Date().toISOString();
    
    // Create seed from timestamp + context hash
    let seed = intentionalSeed ?? this.hashString(`${timestamp}-${context ?? 'general'}`);
    
    // Use seeded random to select card
    const cardIndex = this.seededRandom(seed, 0, MAJOR_ARCANA.length);
    const card = MAJOR_ARCANA[cardIndex];
    
    // Determine orientation (10% chance of reversed)
    const orientationRoll = this.seededRandom(seed + 1, 0, 100);
    const orientation: 'upright' | 'reversed' = orientationRoll < 90 ? 'upright' : 'reversed';
    
    // Generate contextual meaning
    const meaningForContext = this.generateMeaning(card, orientation, context);
    
    return {
      card,
      orientation,
      timestamp,
      seed,
      meaningForContext
    };
  }

  /**
   * Draw multiple cards (spread)
   */
  drawSpread(positions: string[], context?: string): TarotDraw[] {
    let seedBase = this.hashString(`${Date.now()}-${context ?? 'spread'}`);
    
    return positions.map((position, index) => {
      const draw = this.drawCard(`${context}-${position}`, seedBase + index);
      return {
        ...draw,
        meaningForContext: `${position}: ${draw.meaningForContext}`
      };
    });
  }

  /**
   * Interpret a card for a specific task context
   */
  interpretForTask(card: TarotCard, taskType: string): string {
    const interpretations: Record<string, Record<string, string>> = {
      coding: {
        'The Fool': 'Begin with fresh eyes. Don\'t overthink the architecture.',
        'The Magician': 'You have all the tools you need. Start building.',
        'The High Priestess': 'Trust your intuition on the data structure.',
        'The Empress': 'Nurture the codebase. Focus on readability and beauty.',
        'The Emperor': 'Establish solid patterns and conventions first.',
        'The Hierophant': 'Follow established patterns. Document as you go.',
        'The Lovers': 'Consider the user experience. Make compassionate choices.',
        'The Chariot': 'Push through. This is a momentum phase.',
        'Strength': 'Tackle the difficult refactoring with patience.',
        'The Hermit': 'Step back and review. Time for code review.',
        'Wheel of Fortune': 'A bug will reveal itself. Stay adaptable.',
        'Justice': 'Balance features with technical debt. Be fair to future you.',
        'The Hanged Man': 'Pause. The solution will come from a new angle.',
        'Death': 'A major refactor is needed. Let the old code die.',
        'Temperance': 'Balance new features with stability.',
        'The Devil': 'Watch for technical debt accumulating.',
        'The Tower': 'A breaking change is coming. Prepare for impact.',
        'The Star': 'Have hope. The architecture will work.',
        'The Moon': 'Unclear requirements. Seek clarity before coding.',
        'The Sun': 'Success! The feature works beautifully.',
        'Judgement': 'Time to evaluate. Is this feature still needed?',
        'The World': 'Feature complete. Time to deploy.'
      },
      debugging: {
        'The Fool': 'Start from zero assumptions. What do you actually know?',
        'The Magician': 'You have the tools. Systematically eliminate possibilities.',
        'The High Priestess': 'The answer is in the logs. Listen carefully.',
        'The Tower': 'The bug reveals a deeper architectural flaw. Good.',
        'Death': 'Kill the bug completely. Don\'t just patch it.',
        'The Sun': 'Found it! The solution was simpler than expected.',
        'The Star': 'Have faith. You\'ll find it. Take a break first.',
        'The Moon': 'The bug is hidden in shadows. Check edge cases.'
      },
      planning: {
        'The Emperor': 'Structure the project phases clearly.',
        'The Hierophant': 'Follow proven methodologies. Don\'t reinvent.',
        'The Chariot': 'Set clear milestones and drive toward them.',
        'The World': 'Consider the complete user journey.',
        'Justice': 'Balance scope with timeline realistically.'
      }
    };

    const taskInterpretations = interpretations[taskType] || interpretations.coding;
    return taskInterpretations[card.name] || card.meaning.upright;
  }

  /**
   * Get all cards
   */
  getAllCards(): TarotCard[] {
    return [...MAJOR_ARCANA];
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number, min: number, max: number): number {
    // Simple seeded PRNG (Linear Congruential Generator)
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    const nextSeed = (a * seed + c) % m;
    const random = nextSeed / m;
    return Math.floor(random * (max - min)) + min;
  }

  private generateMeaning(
    card: TarotCard, 
    orientation: 'upright' | 'reversed',
    context?: string
  ): string {
    const baseMeaning = orientation === 'upright' 
      ? card.meaning.upright 
      : card.meaning.reversed;
    
    if (!context) return baseMeaning;
    
    // Add contextual flavor
    const contextualFlavor = this.getContextualFlavor(card.name, context);
    return `${baseMeaning} ${contextualFlavor}`;
  }

  private getContextualFlavor(cardName: string, context: string): string {
    const flavors: Record<string, Record<string, string>> = {
      'morning': {
        'The Sun': 'Start your day with clarity and purpose.',
        'The Magician': 'Morning is your power hour. Begin important work now.',
        'The Hermit': 'A quiet morning of reflection serves you well.'
      },
      'afternoon': {
        'Strength': 'Afternoon energy requires gentle persistence.',
        'The Chariot': 'Push through the afternoon slump with willpower.'
      },
      'evening': {
        'The Star': 'Evening brings hope and renewal. Rest well.',
        'The Moon': 'Dreams tonight may bring insight.',
        'The Hermit': 'Evening is for withdrawal and integration.'
      },
      'beginning': {
        'The Fool': 'Perfect card for new beginnings. Leap!',
        'The Magician': 'You are at the starting line with all you need.'
      },
      'middle': {
        'Temperance': 'The middle path requires balance and patience.',
        'Strength': 'You\'re in the thick of it. Gentle courage now.'
      },
      'ending': {
        'The World': 'A cycle completes. Acknowledge your achievement.',
        'Judgement': 'Evaluate what you\'ve learned from this journey.'
      }
    };

    const contextFlavors = flavors[context.toLowerCase()];
    return contextFlavors?.[cardName] ?? '';
  }
}

// Singleton instance
export const tarotOracle = new TarotOracle();
