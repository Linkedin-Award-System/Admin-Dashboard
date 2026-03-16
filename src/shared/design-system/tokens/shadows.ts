/**
 * Design System - Shadow Tokens
 * 
 * Shadow system for creating depth and elevation
 * Includes standard shadows and LinkedIn Blue tinted shadows for primary elements
 */

/**
 * Standard shadow scale
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
} as const;

/**
 * LinkedIn Blue tinted shadows for primary buttons and elements
 */
export const primaryShadows = {
  sm: '0 1px 2px rgba(10, 102, 194, 0.1)',
  md: '0 4px 6px rgba(10, 102, 194, 0.2)',
  lg: '0 10px 15px rgba(10, 102, 194, 0.25)',
  xl: '0 20px 25px rgba(10, 102, 194, 0.3)',
} as const;

/**
 * Component-specific shadow mappings
 */
export const componentShadows = {
  // Buttons and inputs
  button: shadows.sm,
  buttonHover: shadows.md,
  input: shadows.sm,
  inputFocus: shadows.md,
  
  // Primary button with LinkedIn Blue tint
  buttonPrimary: primaryShadows.sm,
  buttonPrimaryHover: primaryShadows.md,
  
  // Cards
  card: shadows.md,
  cardHover: shadows.lg,
  cardElevated: shadows.lg,
  
  // Modals and dropdowns
  modal: shadows.xl,
  dropdown: shadows.lg,
  
  // Premium hover states
  premiumHover: shadows.xl,
  
  // Metric cards
  metricCard: shadows.md,
  metricCardHover: shadows.lg,
} as const;

/**
 * Tailwind CSS class mappings for shadows
 * For use with className prop
 */
export const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
} as const;

/**
 * CSS custom properties for shadows
 * Can be used in styled-components or inline styles
 */
export const shadowVariables = {
  '--shadow-sm': shadows.sm,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,
  '--shadow-2xl': shadows['2xl'],
  '--shadow-primary-sm': primaryShadows.sm,
  '--shadow-primary-md': primaryShadows.md,
  '--shadow-primary-lg': primaryShadows.lg,
  '--shadow-primary-xl': primaryShadows.xl,
} as const;
