/**
 * Design System - Token Exports
 * 
 * Centralized export of all design tokens
 * Import from this file to access any design token
 */

// Color tokens
export * from './colors';

// Typography tokens
export * from './typography';

// Spacing tokens
export * from './spacing';

// Shadow tokens
export * from './shadows';

// Border tokens
export * from './borders';

/**
 * Usage examples:
 * 
 * import { colors, spacing, typography } from '@/shared/design-system/tokens';
 * 
 * // Use in components
 * const buttonStyle = {
 *   backgroundColor: colors.primary[500],
 *   padding: `${spacing.xs}px ${spacing.md}px`,
 *   fontSize: typography.button.fontSize,
 * };
 * 
 * // Use Tailwind classes
 * import { spacingClasses, shadowClasses } from '@/shared/design-system/tokens';
 * <div className={`${spacingClasses.padding.md} ${shadowClasses.md}`}>
 */
