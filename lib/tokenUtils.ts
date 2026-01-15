// Token search and filtering utilities

import { TOKENS } from './config';
import type { TokenKey } from '@/types';

interface TokenInfo {
  key: TokenKey;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
}

/**
 * Get all tokens as array
 */
export function getAllTokens(): TokenInfo[] {
  return Object.entries(TOKENS).map(([key, token]) => ({
    key: key as TokenKey,
    symbol: token.symbol,
    name: token.name,
    address: token.address,
    decimals: token.decimals,
    logo: token.logo,
  }));
}

/**
 * Search tokens by query
 */
export function searchTokens(query: string): TokenInfo[] {
  if (!query) return getAllTokens();

  const lowerQuery = query.toLowerCase();
  return getAllTokens().filter(
    token =>
      token.symbol.toLowerCase().includes(lowerQuery) ||
      token.name.toLowerCase().includes(lowerQuery) ||
      token.address.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get token by symbol
 */
export function getTokenBySymbol(symbol: string): TokenInfo | undefined {
  return getAllTokens().find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
}

/**
 * Get token by address
 */
export function getTokenByAddress(address: string): TokenInfo | undefined {
  return getAllTokens().find(t => t.address.toLowerCase() === address.toLowerCase());
}

/**
 * Filter tokens by criteria
 */
export function filterTokens(criteria: {
  minDecimals?: number;
  maxDecimals?: number;
  exclude?: TokenKey[];
}): TokenInfo[] {
  let tokens = getAllTokens();

  if (criteria.minDecimals !== undefined) {
    tokens = tokens.filter(t => t.decimals >= criteria.minDecimals!);
  }

  if (criteria.maxDecimals !== undefined) {
    tokens = tokens.filter(t => t.decimals <= criteria.maxDecimals!);
  }

  if (criteria.exclude) {
    tokens = tokens.filter(t => !criteria.exclude!.includes(t.key));
  }

  return tokens;
}

/**
 * Sort tokens by various criteria
 */
export function sortTokens(
  tokens: TokenInfo[],
  by: 'symbol' | 'name' | 'decimals' = 'symbol'
): TokenInfo[] {
  return [...tokens].sort((a, b) => {
    if (by === 'decimals') {
      return b.decimals - a.decimals;
    }
    return a[by].localeCompare(b[by]);
  });
}
