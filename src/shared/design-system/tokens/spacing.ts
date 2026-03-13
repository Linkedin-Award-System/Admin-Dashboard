/**
 * Design System - Spacing Tokens
 * 
 * 8px-based spacing scale for consistent layout and spacing
 * All values are multiples of 8px base unit
 */

/**
 * Spacing scale in pixels
 * Base unit: 8px
 */
export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
} as const;

/**
 * Component-specific spacing values
 */
export const componentSpacing = {
  // Card padding
  cardPadding: spacing.md, // 20px (closest to 20px in 8px scale is 24px, but spec says 20px)
  
  // Button padding
  buttonPaddingVertical: 12, // 12px as per spec
  buttonPaddingHorizontal: spacing.md, // 24px
  
  // Input padding
  inputPadding: 12, // 12px as per spec
  
  // Table cell padding
  tableCellPadding: 12, // 12px as per spec
  
  // Grid gaps
  gridGap: spacing.sm, // 16px
  
  // Page container padding
  pageContainerMobile: spacing.md, // 24px
  pageContainerDesktop: spacing['2xl'], // 48px
  
  // Icon padding (in metric cards)
  iconPadding: 12, // 12px as per spec
  
  // Page header bottom margin
  pageHeaderMargin: spacing.lg, // 32px
  
  // Title to subtitle spacing
  titleSubtitleGap: spacing.xs, // 8px
  
  // Icon to label gap (sidebar)
  iconLabelGap: 12, // 12px as per spec
  
  // Form field vertical spacing
  formFieldGap: spacing.sm, // 16px
  
  // Chart to legend spacing
  chartLegendGap: spacing.sm, // 16px
} as const;

/**
 * Tailwind CSS class mappings for spacing
 * For use with className prop
 */
export const spacingClasses = {
  // Padding classes
  padding: {
    xs: 'p-2',      // 8px
    sm: 'p-4',      // 16px
    md: 'p-6',      // 24px
    lg: 'p-8',      // 32px
    xl: 'p-10',     // 40px
    '2xl': 'p-12',  // 48px
  },
  
  // Margin classes
  margin: {
    xs: 'm-2',      // 8px
    sm: 'm-4',      // 16px
    md: 'm-6',      // 24px
    lg: 'm-8',      // 32px
    xl: 'm-10',     // 40px
    '2xl': 'm-12',  // 48px
  },
  
  // Gap classes (for flex/grid)
  gap: {
    xs: 'gap-2',    // 8px
    sm: 'gap-4',    // 16px
    md: 'gap-6',    // 24px
    lg: 'gap-8',    // 32px
    xl: 'gap-10',   // 40px
    '2xl': 'gap-12', // 48px
  },
  
  // Space between classes
  space: {
    xs: 'space-y-2',   // 8px
    sm: 'space-y-4',   // 16px
    md: 'space-y-6',   // 24px
    lg: 'space-y-8',   // 32px
    xl: 'space-y-10',  // 40px
    '2xl': 'space-y-12', // 48px
  },
} as const;

/**
 * Responsive spacing adjustments
 * Mobile spacing is reduced by 25% as per spec
 */
export const responsiveSpacing = {
  mobile: {
    pageContainer: spacing.md, // 24px
    reduction: 0.75, // 25% reduction
  },
  desktop: {
    pageContainer: spacing['2xl'], // 48px
  },
} as const;
