// Utility functions for formatting and validation
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a token amount with proper decimals
 */
export function formatTokenAmount(amount: string | bigint, decimals: number = 18, maxDecimals: number = 6): string {
  if (!amount) return '0';
  
  try {
    const value = typeof amount === 'bigint' ? amount : BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return integerPart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmed = fractionalStr.slice(0, maxDecimals).replace(/0+$/, '');
    
    return trimmed ? `${integerPart}.${trimmed}` : integerPart.toString();
  } catch {
    return '0';
  }
}

/**
 * Format USD amount with proper formatting
 */
export function formatUSD(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.01) return '<$0.01';
  if (amount < 1) return `$${amount.toFixed(3)}`;
  if (amount < 1000) return `$${amount.toFixed(2)}`;
  if (amount < 1000000) return `$${(amount / 1000).toFixed(2)}K`;
  return `$${(amount / 1000000).toFixed(2)}M`;
}

/**
 * Format percentage with proper sign and decimals
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const formatted = Math.abs(value).toFixed(decimals);
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatted}%`;
}

/**
 * Truncate ethereum address for display
 */
export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validate ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate token amount input
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || amount === '') return false;
  if (amount === '0' || amount === '0.') return false;
  
  // Check if valid number format
  const regex = /^\d*\.?\d*$/;
  return regex.test(amount);
}

/**
 * Parse token amount to bigint
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  if (!amount || amount === '' || amount === '0') return BigInt(0);
  
  try {
    const [integer, decimal = ''] = amount.split('.');
    const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
    const combined = integer + paddedDecimal;
    return BigInt(combined);
  } catch {
    return BigInt(0);
  }
}

/**
 * Calculate price impact
 */
export function calculatePriceImpact(inputAmount: number, outputAmount: number, marketRate: number): number {
  if (inputAmount === 0 || marketRate === 0) return 0;
  const expectedOutput = inputAmount * marketRate;
  return ((expectedOutput - outputAmount) / expectedOutput) * 100;
}

/**
 * Format time ago
 */
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random number in range
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
