/**
 * Somatic Canticles Class Name Utility
 * 
 * A utility for merging Tailwind CSS classes with proper precedence handling.
 * Uses clsx for conditional class joining and tailwind-merge for conflict resolution.
 * 
 * Power numbers: 8, 13, 19, 21, 44, 125, 152
 * 
 * @example
 * // Basic usage
 * cn('px-4 py-2', 'bg-red-500')
 * 
 * // Conditional classes
 * cn('px-4', isActive && 'bg-blue-500', !isActive && 'opacity-44')
 * 
 * // Object syntax
 * cn({ 'text-44': isLarge, 'text-21': !isLarge })
 * 
 * // Merging with conflict resolution
 * cn('px-4 py-2', 'px-8') // Results in 'py-2 px-8' (px-8 wins)
 * 
 * // Combining with design tokens
 * import { SPACING, COLORS } from '@/styles/design-tokens';
 * cn('p-[var(--space-13)]', 'text-[var(--color-octave-500)]')
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class name arguments into a single string.
 * Resolves Tailwind CSS conflicts (later classes override earlier ones).
 * 
 * @param inputs - Class values to merge (strings, objects, arrays, conditionals)
 * @returns Merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a memoized class name merger for repetitive use cases.
 * Useful when the same base classes are merged with varying conditional classes.
 * 
 * @param baseClasses - Base classes that remain constant
 * @returns Function that merges base classes with provided variants
 * 
 * @example
 * const buttonClasses = createCn('px-5 py-2 rounded-8 font-medium');
 * 
 * buttonClasses('bg-octave-500', isLoading && 'opacity-44');
 * // Returns: 'px-5 py-2 rounded-8 font-medium bg-octave-500 opacity-44'
 */
export function createCn(...baseClasses: ClassValue[]) {
  const base = cn(...baseClasses);
  
  return (...variants: ClassValue[]) => {
    return cn(base, ...variants);
  };
}

/**
 * Variants helper for creating type-safe component variants.
 * Follows the power number design system structure.
 * 
 * @example
 * const buttonVariants = variants({
 *   base: 'px-5 py-2 rounded-8 font-medium transition-8',
 *   variants: {
 *     color: {
 *       octave: 'bg-octave-500 hover:bg-octave-600',
 *       transform: 'bg-transform-500 hover:bg-transform-600',
 *       witness: 'bg-witness-500 hover:bg-witness-600',
 *     },
 *     size: {
 *       sm: 'text-13',
 *       md: 'text-19',
 *       lg: 'text-21',
 *     },
 *   },
 *   defaultVariants: {
 *     color: 'octave',
 *     size: 'md',
 *   },
 * });
 * 
 * buttonVariants({ color: 'transform', size: 'lg' });
 */
interface VariantsConfig<V extends Record<string, Record<string, ClassValue>>> {
  base?: ClassValue;
  variants: V;
  defaultVariants?: {
    [K in keyof V]?: keyof V[K];
  };
}

export function variants<V extends Record<string, Record<string, ClassValue>>>(
  config: VariantsConfig<V>
) {
  return (props?: {
    [K in keyof V]?: keyof V[K];
  } & { className?: ClassValue }) => {
    const { className, ...variantProps } = props || {};
    
    // Start with base classes
    const classes: ClassValue[] = config.base ? [config.base] : [];
    
    // Add variant classes
    for (const [variantKey, variantValue] of Object.entries(variantProps)) {
      const variantConfig = config.variants[variantKey];
      if (variantConfig && variantValue) {
        classes.push(variantConfig[variantValue as string]);
      }
    }
    
    // Add default variant classes for unspecified variants
    if (config.defaultVariants) {
      for (const [defaultKey, defaultValue] of Object.entries(config.defaultVariants)) {
        if (!(defaultKey in variantProps)) {
          const variantConfig = config.variants[defaultKey];
          if (variantConfig && defaultValue) {
            classes.push(variantConfig[defaultValue as string]);
          }
        }
      }
    }
    
    // Add any explicit className override
    if (className) {
      classes.push(className);
    }
    
    return cn(classes);
  };
}

/**
 * Conditional class builder for complex state-based styling.
 * Provides a fluent API for building class strings.
 * 
 * @example
 * conditionalClasses()
 *   .when(isActive, 'bg-octave-500', 'shadow-octave')
 *   .when(isDisabled, 'opacity-44', 'cursor-not-allowed')
 *   .when(size === 'lg', 'text-44', 'p-13')
 *   .otherwise('text-21', 'p-8')
 *   .build();
 */
export class ConditionalClasses {
  private classes: ClassValue[] = [];
  private otherwiseClasses: ClassValue[] = [];

  when(condition: boolean | undefined | null, ...classes: ClassValue[]): this {
    if (condition) {
      this.classes.push(...classes);
    }
    return this;
  }

  otherwise(...classes: ClassValue[]): this {
    this.otherwiseClasses = classes;
    return this;
  }

  build(): string {
    // Only use otherwise classes if no conditional classes were added
    const result = this.classes.length > 0 
      ? this.classes 
      : this.otherwiseClasses;
    return cn(result);
  }
}

export function conditionalClasses(): ConditionalClasses {
  return new ConditionalClasses();
}

/**
 * Power-number aware spacing utility.
 * Returns the spacing value for a given power number.
 * 
 * @param n - Power number (8, 13, 19, 21, 44, 125, 152)
 * @returns CSS spacing value in pixels
 */
export function spacing(n: 8 | 13 | 19 | 21 | 44 | 125 | 152): string {
  const spacingMap: Record<number, string> = {
    8: '8px',      // 8 * 1
    13: '13px',    // 13 * 1
    19: '19px',    // 19 * 1
    21: '21px',    // 21 * 1
    44: '44px',    // 44 * 1
    125: '125px',  // 125 * 1
    152: '152px',  // 152 * 1
  };
  return spacingMap[n] || `${n}px`;
}

/**
 * Golden ratio calculations for responsive scaling.
 * 
 * @param base - Base value to scale
 * @param power - Number of golden ratio multiplications (default: 1)
 * @returns Scaled value using φ (1.618)
 * 
 * @example
 * golden(16) // 25.888 ≈ 26px
 * golden(16, 2) // 41.888 ≈ 42px (φ²)
 * golden(44, -1) // 27.194 ≈ 27px (1/φ)
 */
export function golden(base: number, power: number = 1): number {
  const phi = 1.618033988749895;
  return Math.round(base * Math.pow(phi, power));
}

// Default export for convenience
export default cn;
