// Swap calculation utilities

/**
 * Calculate minimum received amount with slippage
 */
export function calculateMinimumReceived(
  amount: string,
  slippagePercent: number
): string {
  const amountNum = parseFloat(amount);
  const minReceived = amountNum * (1 - slippagePercent / 100);
  return minReceived.toFixed(6);
}

/**
 * Calculate price impact
 */
export function calculatePriceImpact(
  inputAmount: number,
  outputAmount: number,
  marketRate: number
): number {
  if (inputAmount === 0 || marketRate === 0) return 0;
  
  const expectedOutput = inputAmount * marketRate;
  const impact = ((expectedOutput - outputAmount) / expectedOutput) * 100;
  
  return Math.abs(impact);
}

/**
 * Calculate exchange rate
 */
export function calculateExchangeRate(
  fromAmount: string,
  toAmount: string
): number {
  const from = parseFloat(fromAmount);
  const to = parseFloat(toAmount);
  
  if (from === 0) return 0;
  return to / from;
}

/**
 * Calculate inverse rate
 */
export function calculateInverseRate(rate: number): number {
  if (rate === 0) return 0;
  return 1 / rate;
}

/**
 * Validate swap amounts
 */
export function validateSwapAmounts(
  fromAmount: string,
  toAmount: string
): { isValid: boolean; error?: string } {
  const from = parseFloat(fromAmount);
  const to = parseFloat(toAmount);
  
  if (isNaN(from) || isNaN(to)) {
    return { isValid: false, error: 'Invalid amounts' };
  }
  
  if (from <= 0 || to <= 0) {
    return { isValid: false, error: 'Amounts must be greater than 0' };
  }
  
  return { isValid: true };
}
