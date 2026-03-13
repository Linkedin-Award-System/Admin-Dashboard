/**
 * Design System - Responsive Utilities
 * 
 * Helper functions and hooks for responsive behavior
 * Provides utilities for breakpoint detection, responsive values, and viewport-based logic
 */

/**
 * Breakpoint definitions matching Tailwind config
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Check if current viewport matches a breakpoint
 * 
 * @param breakpoint - Breakpoint name (sm, md, lg, xl, 2xl)
 * @param type - 'min' for min-width, 'max' for max-width
 * @returns Boolean indicating if breakpoint matches
 * 
 * @example
 * ```tsx
 * if (matchesBreakpoint('lg', 'min')) {
 *   // Desktop layout
 * }
 * ```
 */
export function matchesBreakpoint(
  breakpoint: Breakpoint,
  type: 'min' | 'max' = 'min'
): boolean {
  if (typeof window === 'undefined') return false;
  
  const width = breakpoints[breakpoint];
  const query = type === 'min' 
    ? `(min-width: ${width}px)` 
    : `(max-width: ${width - 1}px)`;
  
  return window.matchMedia(query).matches;
}

/**
 * Check if viewport is mobile (< 640px)
 * 
 * @returns Boolean indicating if viewport is mobile
 * 
 * @example
 * ```tsx
 * if (isMobile()) {
 *   // Mobile-specific logic
 * }
 * ```
 */
export function isMobile(): boolean {
  return matchesBreakpoint('sm', 'max');
}

/**
 * Check if viewport is tablet (640px - 1024px)
 * 
 * @returns Boolean indicating if viewport is tablet
 * 
 * @example
 * ```tsx
 * if (isTablet()) {
 *   // Tablet-specific logic
 * }
 * ```
 */
export function isTablet(): boolean {
  return matchesBreakpoint('sm', 'min') && matchesBreakpoint('lg', 'max');
}

/**
 * Check if viewport is desktop (>= 1024px)
 * 
 * @returns Boolean indicating if viewport is desktop
 * 
 * @example
 * ```tsx
 * if (isDesktop()) {
 *   // Desktop-specific logic
 * }
 * ```
 */
export function isDesktop(): boolean {
  return matchesBreakpoint('lg', 'min');
}

/**
 * Get current viewport category
 * 
 * @returns 'mobile', 'tablet', or 'desktop'
 * 
 * @example
 * ```tsx
 * const viewport = getViewportCategory();
 * if (viewport === 'mobile') {
 *   // Mobile layout
 * }
 * ```
 */
export function getViewportCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
}

/**
 * Get responsive value based on current viewport
 * 
 * @param values - Object with values for each breakpoint
 * @returns Value for current viewport
 * 
 * @example
 * ```tsx
 * const columns = getResponsiveValue({
 *   mobile: 1,
 *   tablet: 2,
 *   desktop: 4,
 * });
 * ```
 */
export function getResponsiveValue<T>(values: {
  mobile: T;
  tablet?: T;
  desktop?: T;
}): T {
  const viewport = getViewportCategory();
  
  if (viewport === 'mobile') return values.mobile;
  if (viewport === 'tablet') return values.tablet ?? values.mobile;
  return values.desktop ?? values.tablet ?? values.mobile;
}

/**
 * Apply responsive spacing adjustment
 * Mobile spacing is reduced by 25% as per design spec
 * 
 * @param baseValue - Base spacing value in pixels
 * @returns Adjusted spacing value for current viewport
 * 
 * @example
 * ```tsx
 * const padding = getResponsiveSpacing(24); // 24px on desktop, 18px on mobile
 * ```
 */
export function getResponsiveSpacing(baseValue: number): number {
  if (isMobile()) {
    return Math.round(baseValue * 0.75); // 25% reduction
  }
  return baseValue;
}

/**
 * Apply responsive typography adjustment
 * Mobile typography is reduced by 10% as per design spec
 * 
 * @param baseSize - Base font size in pixels
 * @returns Adjusted font size for current viewport
 * 
 * @example
 * ```tsx
 * const fontSize = getResponsiveFontSize(16); // 16px on desktop, ~14px on mobile
 * ```
 */
export function getResponsiveFontSize(baseSize: number): number {
  if (isMobile()) {
    return Math.round(baseSize * 0.9); // 10% reduction
  }
  return baseSize;
}

/**
 * Generate responsive class names based on viewport
 * 
 * @param classes - Object with class names for each breakpoint
 * @returns Space-separated class names with responsive prefixes
 * 
 * @example
 * ```tsx
 * const className = getResponsiveClasses({
 *   base: 'grid gap-4',
 *   sm: 'grid-cols-2',
 *   lg: 'grid-cols-4',
 * });
 * // => 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4'
 * ```
 */
export function getResponsiveClasses(classes: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  const classArray: string[] = [];
  
  if (classes.base) classArray.push(classes.base);
  if (classes.sm) classArray.push(`sm:${classes.sm}`);
  if (classes.md) classArray.push(`md:${classes.md}`);
  if (classes.lg) classArray.push(`lg:${classes.lg}`);
  if (classes.xl) classArray.push(`xl:${classes.xl}`);
  if (classes['2xl']) classArray.push(`2xl:${classes['2xl']}`);
  
  return classArray.join(' ');
}

/**
 * Get page container padding based on viewport
 * Mobile: 24px, Desktop: 48px as per design spec
 * 
 * @returns Padding value in pixels
 * 
 * @example
 * ```tsx
 * const padding = getPageContainerPadding(); // 24 on mobile, 48 on desktop
 * ```
 */
export function getPageContainerPadding(): number {
  return isMobile() ? 24 : 48;
}

/**
 * Check if touch device
 * Useful for ensuring touch-friendly button sizes (min 44px)
 * 
 * @returns Boolean indicating if device supports touch
 * 
 * @example
 * ```tsx
 * if (isTouchDevice()) {
 *   // Ensure minimum 44px touch targets
 * }
 * ```
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Media query strings for use in CSS-in-JS or styled-components
 */
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.sm - 1}px)`,
  tablet: `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
} as const;

/**
 * Hook-like function to listen for breakpoint changes
 * Returns a cleanup function to remove the listener
 * 
 * @param breakpoint - Breakpoint to watch
 * @param callback - Function to call when breakpoint matches/unmatches
 * @param type - 'min' for min-width, 'max' for max-width
 * @returns Cleanup function
 * 
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = watchBreakpoint('lg', (matches) => {
 *     console.log('Desktop:', matches);
 *   });
 *   return cleanup;
 * }, []);
 * ```
 */
export function watchBreakpoint(
  breakpoint: Breakpoint,
  callback: (matches: boolean) => void,
  type: 'min' | 'max' = 'min'
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const width = breakpoints[breakpoint];
  const query = type === 'min' 
    ? `(min-width: ${width}px)` 
    : `(max-width: ${width - 1}px)`;
  
  const mediaQuery = window.matchMedia(query);
  
  // Call immediately with current state
  callback(mediaQuery.matches);
  
  // Listen for changes
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener('change', handler);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
}
