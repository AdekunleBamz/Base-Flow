// Validation utilities for user inputs

/**
 * Validate Ethereum address format
 */
export function validateAddress(address: string): {
  isValid: boolean;
  error?: string;
} {
  if (!address) {
    return { isValid: false, error: 'Address is required' };
  }
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { isValid: false, error: 'Invalid Ethereum address format' };
  }
  
  return { isValid: true };
}

/**
 * Validate amount input
 */
export function validateAmount(amount: string, balance?: string): {
  isValid: boolean;
  error?: string;
} {
  if (!amount || amount === '') {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Invalid number' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (balance && numAmount > parseFloat(balance)) {
    return { isValid: false, error: 'Insufficient balance' };
  }
  
  return { isValid: true };
}

/**
 * Validate slippage tolerance
 */
export function validateSlippage(slippage: number): {
  isValid: boolean;
  error?: string;
  warning?: string;
} {
  if (isNaN(slippage)) {
    return { isValid: false, error: 'Invalid slippage value' };
  }
  
  if (slippage < 0.1) {
    return { isValid: false, error: 'Slippage must be at least 0.1%' };
  }
  
  if (slippage > 50) {
    return { isValid: false, error: 'Slippage cannot exceed 50%' };
  }
  
  if (slippage > 5) {
    return {
      isValid: true,
      warning: 'High slippage tolerance may result in unfavorable trades',
    };
  }
  
  return { isValid: true };
}

/**
 * Validate deadline (in minutes)
 */
export function validateDeadline(deadline: number): {
  isValid: boolean;
  error?: string;
} {
  if (isNaN(deadline)) {
    return { isValid: false, error: 'Invalid deadline value' };
  }
  
  if (deadline < 1) {
    return { isValid: false, error: 'Deadline must be at least 1 minute' };
  }
  
  if (deadline > 60) {
    return { isValid: false, error: 'Deadline cannot exceed 60 minutes' };
  }
  
  return { isValid: true };
}

/**
 * Sanitize number input
 */
export function sanitizeNumberInput(input: string): string {
  // Remove non-numeric characters except decimal point
  let sanitized = input.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    sanitized = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return sanitized;
}

/**
 * Validate transaction hash
 */
export function validateTxHash(hash: string): {
  isValid: boolean;
  error?: string;
} {
  if (!hash) {
    return { isValid: false, error: 'Transaction hash is required' };
  }
  
  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
    return { isValid: false, error: 'Invalid transaction hash format' };
  }
  
  return { isValid: true };
}
