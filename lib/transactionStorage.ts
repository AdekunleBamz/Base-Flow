// Transaction history storage using localStorage

import type { TransactionData } from '@/types';

const STORAGE_KEY = 'baseflow_transaction_history';
const MAX_TRANSACTIONS = 50;

/**
 * Get all transactions from storage
 */
export function getTransactionHistory(): TransactionData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const transactions: TransactionData[] = JSON.parse(stored);
    // Sort by timestamp descending (newest first)
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error loading transaction history:', error);
    return [];
  }
}

/**
 * Add a new transaction to history
 */
export function addTransaction(transaction: TransactionData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getTransactionHistory();
    history.unshift(transaction);
    
    // Keep only the most recent transactions
    const trimmed = history.slice(0, MAX_TRANSACTIONS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
}

/**
 * Update transaction status
 */
export function updateTransactionStatus(
  hash: string,
  status: TransactionData['status']
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getTransactionHistory();
    const index = history.findIndex(tx => tx.hash === hash);
    
    if (index !== -1) {
      history[index].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error updating transaction status:', error);
  }
}

/**
 * Clear all transaction history
 */
export function clearTransactionHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing transaction history:', error);
  }
}

/**
 * Get recent transactions (last N)
 */
export function getRecentTransactions(count: number = 10): TransactionData[] {
  return getTransactionHistory().slice(0, count);
}

/**
 * Get pending transactions
 */
export function getPendingTransactions(): TransactionData[] {
  return getTransactionHistory().filter(tx => tx.status === 'pending');
}
