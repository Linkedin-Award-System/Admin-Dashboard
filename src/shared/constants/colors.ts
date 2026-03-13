/**
 * Color Palette
 * 
 * Centralized color definitions for the dashboard
 * Based on Tailwind CSS color system with custom additions
 */

export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: {
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
  },
  warning: {
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
  },
  error: {
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
  },
  purple: {
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
  },
  orange: {
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
  },
  gray: {
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
  },
} as const;

/**
 * Chart color palette for data visualization
 */
export const chartColors = {
  primary: '#0a66c2', // LinkedIn Blue
  secondary: colors.purple[500],
  tertiary: colors.orange[500],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  
  // Array of colors for multi-series charts - complementary palette
  series: [
    '#0a66c2', // LinkedIn Blue
    colors.success[500], // Green
    colors.purple[500], // Purple
    colors.orange[500], // Orange
    '#3396ff', // Lighter blue
    colors.success[400], // Lighter green
    colors.purple[400], // Lighter purple
    colors.orange[400], // Lighter orange
  ],
  
  // Gradient definitions for charts
  gradients: {
    primary: {
      start: '#3396ff',
      end: '#085299',
    },
    success: {
      start: colors.success[400],
      end: colors.success[600],
    },
    warning: {
      start: colors.warning[400],
      end: colors.warning[600],
    },
    error: {
      start: colors.error[400],
      end: colors.error[600],
    },
    purple: {
      start: colors.purple[400],
      end: colors.purple[600],
    },
  },
} as const;

/**
 * Semantic color mappings
 */
export const semanticColors = {
  completed: colors.success[500],
  pending: colors.warning[500],
  failed: colors.error[500],
  active: colors.primary[500],
  approved: colors.success[500],
  rejected: colors.error[500],
} as const;
