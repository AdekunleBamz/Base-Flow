// Number formatting utilities

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toFixed(2);
  if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(2)}M`;
  return `${(num / 1000000000).toFixed(2)}B`;
}

/**
 * Format number with commas
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format percentage with color coding
 */
export function formatPercentageWithSign(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Round to significant digits
 */
export function roundToSignificant(num: number, digits: number = 4): string {
  if (num === 0) return '0';
  
  const magnitude = Math.floor(Math.log10(Math.abs(num)));
  const scale = Math.pow(10, digits - magnitude - 1);
  return (Math.round(num * scale) / scale).toString();
}

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map number from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
