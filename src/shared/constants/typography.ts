/**
 * Typography Scale
 * 
 * Centralized typography definitions for consistent text styling
 * Uses Tailwind CSS utility classes
 */

export const typography = {
  // Headings
  heading1: 'text-2xl font-semibold',
  heading2: 'text-2xl font-semibold',
  heading3: 'text-lg font-semibold',
  heading4: 'text-base font-semibold',
  
  // Body text
  body: 'text-base',
  bodyLarge: 'text-lg',
  bodySmall: 'text-sm',
  
  // Captions and labels
  caption: 'text-sm text-gray-600',
  label: 'text-sm font-medium',
  
  // Metric displays
  metricValue: 'text-3xl font-semibold',
  metricValueLarge: 'text-3xl font-semibold',
  metricLabel: 'text-xs font-medium uppercase tracking-wider',
  
  // Chart labels
  chartTitle: 'text-lg font-semibold',
  chartLabel: 'text-xs text-gray-600',
  chartValue: 'text-sm font-medium',
  
  // Trend indicators
  trendValue: 'text-sm font-medium',
  
  // Muted text
  muted: 'text-gray-500',
  mutedSmall: 'text-sm text-gray-500',
} as const;

/**
 * Font weights
 */
export const fontWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

/**
 * Font sizes (for programmatic use)
 */
export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
} as const;

/**
 * Line heights
 */
export const lineHeights = {
  tight: 'leading-tight',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
} as const;
