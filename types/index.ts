// Core type definitions for Baseflow

export type TokenKey = 'ETH' | 'WETH' | 'USDC' | 'DAI' | 'cbETH' | 'USDbC';

export interface Token {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  isNative?: boolean;
}

export interface SwapState {
  fromToken: TokenKey;
  toToken: TokenKey;
  fromAmount: string;
  toAmount: string;
  loading: boolean;
  error: string | null;
}

export interface SwapSettings {
  slippage: number;
  deadline: number;
  autoRouter: boolean;
}

export interface QuoteResponse {
  outputAmount: string;
  priceImpact: string;
  route: string[];
  gasEstimate?: string;
}

export interface TransactionData {
  hash: string;
  timestamp: number;
  fromToken: TokenKey;
  toToken: TokenKey;
  fromAmount: string;
  toAmount: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface PriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
}
