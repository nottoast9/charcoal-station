/**
 * Currency formatting utility for Sri Lankan Rupee (LKR)
 */

/**
 * Format a number as Sri Lankan Rupee
 * @param value - The number to format
 * @returns Formatted string with Rs. prefix
 */
export function formatCurrency(value: number): string {
  return `Rs. ${value.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a number as compact currency (for charts and summaries)
 * @param value - The number to format
 * @returns Formatted string with Rs. prefix (compact)
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1000000) {
    return `Rs. ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `Rs. ${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

/**
 * Currency symbol for display
 */
export const CURRENCY_SYMBOL = 'Rs.';
export const CURRENCY_CODE = 'LKR';
export const CURRENCY_NAME = 'Sri Lankan Rupee';
