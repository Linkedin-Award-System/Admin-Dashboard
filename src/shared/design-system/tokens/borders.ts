/**
 * Design System - Border Tokens
 * 
 * Border radius values and border styles
 * Defines consistent border treatments across components
 */

/**
 * Border radius scale
 */
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

/**
 * Border width scale
 */
export const borderWidth = {
  none: '0',
  thin: '1px',
  medium: '2px',
  thick: '3px',
  heavy: '4px',
} as const;

/**
 * Border style definitions
 */
export const borderStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  none: 'none',
} as const;

/**
 * Component-specific border radius mappings
 */
export const componentBorderRadius = {
  // Buttons
  button: borderRadius.md, // 8px
  buttonIcon: borderRadius.md, // 8px
  
  // Inputs
  input: borderRadius.md, // 8px
  
  // Cards
  card: borderRadius.md, // 8px
  
  // Badges
  badge: borderRadius.full, // 9999px (fully rounded)
  
  // Metric card icons
  metricIcon: borderRadius.full, // circular
  
  // Charts
  chart: borderRadius.md, // 8px
  
  // Modals
  modal: borderRadius.lg, // 12px
  
  // Skeletons
  skeleton: borderRadius.md, // 8px
  skeletonCircular: borderRadius.full, // circular
  skeletonText: borderRadius.sm, // 4px
} as const;

/**
 * Component-specific border width mappings
 */
export const componentBorderWidth = {
  // Default borders
  default: borderWidth.thin, // 1px
  
  // Input states
  inputDefault: borderWidth.thin, // 1px
  inputFocus: borderWidth.medium, // 2px
  inputError: borderWidth.medium, // 2px
  
  // Button variants
  buttonSecondary: borderWidth.medium, // 2px
  
  // Sidebar active indicator
  sidebarActive: borderWidth.thick, // 3px
  
  // Table borders
  table: borderWidth.thin, // 1px
} as const;

/**
 * Tailwind CSS class mappings for border radius
 * For use with className prop
 */
export const borderRadiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

/**
 * Tailwind CSS class mappings for border width
 * For use with className prop
 */
export const borderWidthClasses = {
  none: 'border-0',
  thin: 'border',
  medium: 'border-2',
  thick: 'border-3',
  heavy: 'border-4',
} as const;

/**
 * CSS custom properties for borders
 * Can be used in styled-components or inline styles
 */
export const borderVariables = {
  '--border-radius-sm': borderRadius.sm,
  '--border-radius-md': borderRadius.md,
  '--border-radius-lg': borderRadius.lg,
  '--border-radius-xl': borderRadius.xl,
  '--border-radius-2xl': borderRadius['2xl'],
  '--border-radius-full': borderRadius.full,
  '--border-width-thin': borderWidth.thin,
  '--border-width-medium': borderWidth.medium,
  '--border-width-thick': borderWidth.thick,
} as const;
