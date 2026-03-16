/**
 * Design System - Color Tokens
 * 
 * Centralized color palette for the LinkedIn Creative Awards Admin Dashboard
 * Includes LinkedIn Blue as primary brand color, semantic colors, and gray scale
 */

/**
 * Color scale type definition
 */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * Primary color palette - LinkedIn Blue
 */
export const primary: ColorScale = {
  50: '#e6f2ff',
  100: '#cce5ff',
  200: '#99cbff',
  300: '#66b0ff',
  400: '#3396ff',
  500: '#0a66c2', // LinkedIn Blue
  600: '#085299',
  700: '#063d73',
  800: '#04294d',
  900: '#021426',
} as const;

/**
 * Success color palette - Green
 */
export const success: ColorScale = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#10b981',
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
} as const;

/**
 * Warning color palette - Yellow/Orange
 */
export const warning: ColorScale = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
} as const;

/**
 * Error color palette - Red
 */
export const error: ColorScale = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
} as const;

/**
 * Info color palette - Blue (uses LinkedIn Blue)
 */
export const info: ColorScale = primary;

/**
 * Gray scale palette
 */
export const gray: ColorScale = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
} as const;

/**
 * Purple color palette - for metric cards and accents
 */
export const purple: ColorScale = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
} as const;

/**
 * Orange color palette - for metric cards and accents
 */
export const orange: ColorScale = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
} as const;

/**
 * Semantic color mappings
 * Direct color values for specific use cases
 */
export const semantic = {
  success: success[500],
  warning: warning[500],
  error: error[500],
  info: primary[500],
} as const;

/**
 * Text colors
 */
export const text = {
  primary: gray[900],
  secondary: gray[500],
  tertiary: gray[400],
  disabled: gray[300],
  inverse: '#ffffff',
} as const;

/**
 * Background colors
 */
export const background = {
  primary: '#ffffff',
  secondary: gray[50],
  tertiary: gray[100],
  hover: gray[50],
  disabled: gray[100],
} as const;

/**
 * Border colors
 */
export const border = {
  default: gray[200],
  hover: gray[300],
  focus: primary[500],
  error: error[500],
} as const;

/**
 * Complete color palette export
 */
export const colors = {
  primary,
  success,
  warning,
  error,
  info,
  gray,
  purple,
  orange,
  semantic,
  text,
  background,
  border,
} as const;
