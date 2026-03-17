/**
 * Formatting Utilities
 * 
 * Helper functions for formatting numbers, currency, dates, and percentages
 */

/**
 * Format a number with commas for thousands
 * @example formatNumber(1234567) => "1,234,567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a number as currency
 * @example formatCurrency(1234.56) => "ETB 1,234.56"
 */
export function formatCurrency(value: number, currency: string = 'ETB'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return currency + ' ' + formatted;
}

/**
 * Format a number as a compact currency (e.g., ETB 1.2K, ETB 3.4M)
 * @example formatCompactCurrency(1234) => "ETB 1.2K"
 */
export function formatCompactCurrency(value: number, currency: string = 'ETB'): string {
  let formattedValue = '';
  if (value >= 1000000000) {
    formattedValue = (value / 1000000000).toFixed(1) + 'B';
  } else if (value >= 1000000) {
    formattedValue = (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    formattedValue = (value / 1000).toFixed(1) + 'K';
  } else {
    return formatCurrency(value, currency);
  }
  return currency + ' ' + formattedValue;
}

/**
 * Format a number as a percentage
 * @example formatPercentage(0.1234) => "12.34%"
 * @example formatPercentage(12.34, false) => "12.34%"
 */
export function formatPercentage(value: number, isDecimal: boolean = true): string {
  const percentage = isDecimal ? value * 100 : value;
  return percentage.toFixed(2) + '%';
}

/**
 * Format a number as a compact percentage (no decimals)
 * @example formatCompactPercentage(0.1234) => "12%"
 */
export function formatCompactPercentage(value: number, isDecimal: boolean = true): string {
  const percentage = isDecimal ? value * 100 : value;
  return Math.round(percentage) + '%';
}

/**
 * Format a date as a short string
 * @example formatDate(new Date('2024-01-15')) => "Jan 15"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format a date as a full string
 * @example formatFullDate(new Date('2024-01-15')) => "January 15, 2024"
 */
export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format a date and time
 * @example formatDateTime(new Date('2024-01-15T14:30:00')) => "Jan 15, 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format a relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes + ' ' + (diffInMinutes === 1 ? 'minute' : 'minutes') + ' ago';
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours + ' ' + (diffInHours === 1 ? 'hour' : 'hours') + ' ago';
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays + ' ' + (diffInDays === 1 ? 'day' : 'days') + ' ago';
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths + ' ' + (diffInMonths === 1 ? 'month' : 'months') + ' ago';
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears + ' ' + (diffInYears === 1 ? 'year' : 'years') + ' ago';
}

/**
 * Format a trend value with sign
 * @example formatTrend(12.5, true) => "+12.5%"
 * @example formatTrend(-5.3, true) => "-5.3%"
 */
export function formatTrend(value: number, isPositive: boolean): string {
  const sign = isPositive ? '+' : '';
  return sign + value.toFixed(1) + '%';
}

/**
 * Abbreviate large numbers (e.g., 1.2K, 3.4M, 5.6B)
 * @example abbreviateNumber(1234) => "1.2K"
 * @example abbreviateNumber(1234567) => "1.2M"
 */
export function abbreviateNumber(value: number): string {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}
