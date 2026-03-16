/**
 * Chart Configuration
 * 
 * Centralized configuration for Recharts components
 * Provides consistent styling and behavior across all charts
 */

import { colors, chartColors } from '@/shared/constants/colors';

/**
 * Chart color palette
 * LinkedIn Blue as primary with complementary colors for multi-series charts
 */
export const chartColorPalette = {
  primary: '#0a66c2', // LinkedIn Blue
  complementary: [
    '#0a66c2', // Blue (LinkedIn Blue)
    '#10b981', // Green
    '#a855f7', // Purple
    '#f59e0b', // Orange
  ],
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
} as const;

/**
 * Common chart margins
 */
export const chartMargins = {
  default: { top: 10, right: 30, left: 0, bottom: 0 },
  withAxis: { top: 10, right: 30, left: 20, bottom: 20 },
  compact: { top: 5, right: 10, left: 0, bottom: 0 },
} as const;

/**
 * Chart dimensions
 */
export const chartDimensions = {
  height: {
    small: 200,
    medium: 300,
    large: 400,
  },
  width: {
    responsive: '100%',
  },
} as const;

/**
 * Grid configuration
 */
export const gridConfig = {
  strokeDasharray: '3 3',
  stroke: '#f3f4f6', // Light gray
  strokeWidth: 1,
  vertical: false,
  horizontal: true,
} as const;

/**
 * Axis configuration
 */
export const axisConfig = {
  tick: {
    fill: '#6b7280', // Gray
    fontSize: 12,
  },
  axisLine: {
    stroke: colors.gray[300],
  },
  tickLine: {
    stroke: colors.gray[300],
  },
} as const;

/**
 * Tooltip configuration
 */
export const tooltipConfig = {
  contentStyle: {
    backgroundColor: 'white',
    border: `1px solid ${colors.gray[200]}`,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    padding: '12px',
  },
  labelStyle: {
    color: colors.gray[900],
    fontWeight: 600,
    marginBottom: '4px',
  },
  itemStyle: {
    color: colors.gray[700],
    fontSize: '14px',
  },
  cursor: {
    fill: colors.gray[100],
    opacity: 0.5,
  },
} as const;

/**
 * Legend configuration
 */
export const legendConfig = {
  wrapperStyle: {
    paddingTop: '16px', // 16px spacing between chart and legend
  },
  iconType: 'circle' as const,
  iconSize: 10,
} as const;

/**
 * Line chart configuration
 */
export const lineChartConfig = {
  strokeWidth: 2,
  dot: false,
  activeDot: {
    r: 6,
    strokeWidth: 2,
  },
  type: 'monotone' as const, // Smooth curves
} as const;

/**
 * Area chart configuration
 */
export const areaChartConfig = {
  strokeWidth: 2,
  fillOpacity: 0.2,
  type: 'monotone' as const,
} as const;

/**
 * Bar chart configuration
 */
export const barChartConfig = {
  radius: [8, 8, 0, 0] as [number, number, number, number], // Rounded top corners
  maxBarSize: 60,
} as const;

/**
 * Pie/Donut chart configuration
 */
export const pieChartConfig = {
  innerRadius: '60%', // For donut effect
  outerRadius: '80%',
  paddingAngle: 2,
  labelLine: false,
  label: {
    fill: 'white',
    fontSize: 14,
    fontWeight: 600,
  },
} as const;

/**
 * Animation configuration
 */
export const animationConfig = {
  animationDuration: 500,
  animationEasing: 'ease-in-out' as const,
  isAnimationActive: true,
} as const;

/**
 * Gradient definitions for charts
 */
export const chartGradients = {
  primary: {
    id: 'primaryGradient',
    colors: [
      { offset: '0%', color: chartColors.gradients.primary.start, opacity: 0.8 },
      { offset: '100%', color: chartColors.gradients.primary.end, opacity: 0.2 },
    ],
  },
  success: {
    id: 'successGradient',
    colors: [
      { offset: '0%', color: chartColors.gradients.success.start, opacity: 0.8 },
      { offset: '100%', color: chartColors.gradients.success.end, opacity: 0.2 },
    ],
  },
  warning: {
    id: 'warningGradient',
    colors: [
      { offset: '0%', color: chartColors.gradients.warning.start, opacity: 0.8 },
      { offset: '100%', color: chartColors.gradients.warning.end, opacity: 0.2 },
    ],
  },
  error: {
    id: 'errorGradient',
    colors: [
      { offset: '0%', color: chartColors.gradients.error.start, opacity: 0.8 },
      { offset: '100%', color: chartColors.gradients.error.end, opacity: 0.2 },
    ],
  },
  purple: {
    id: 'purpleGradient',
    colors: [
      { offset: '0%', color: chartColors.gradients.purple.start, opacity: 0.8 },
      { offset: '100%', color: chartColors.gradients.purple.end, opacity: 0.2 },
    ],
  },
} as const;

/**
 * Responsive breakpoints for charts
 */
export const chartBreakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
} as const;

/**
 * Helper function to get responsive chart height
 */
export function getResponsiveChartHeight(width: number): number {
  if (width < chartBreakpoints.mobile) {
    return chartDimensions.height.small;
  }
  if (width < chartBreakpoints.tablet) {
    return chartDimensions.height.medium;
  }
  return chartDimensions.height.medium;
}
