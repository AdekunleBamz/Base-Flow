// App-wide constants

export const APP_NAME = 'Baseflow';
export const APP_DESCRIPTION = 'Seamless token swaps on Base';

// Swap settings
export const DEFAULT_SLIPPAGE = 0.5;
export const MAX_SLIPPAGE = 50;
export const MIN_SLIPPAGE = 0.1;
export const DEFAULT_DEADLINE = 20; // minutes
export const MAX_DEADLINE = 60;
export const MIN_DEADLINE = 1;

// Price update intervals
export const PRICE_UPDATE_INTERVAL = 10000; // 10 seconds
export const BALANCE_UPDATE_INTERVAL = 30000; // 30 seconds
export const QUOTE_DEBOUNCE_DELAY = 500; // 0.5 seconds

// Transaction limits
export const MIN_ETH_FOR_GAS = 0.001; // Keep minimum ETH for gas
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// API endpoints
export const API_ENDPOINTS = {
  quote: '/api/quote',
  swap: '/api/tx',
  frame: '/api/frame',
  image: '/api/image',
  webhook: '/api/webhook',
} as const;

// External links
export const EXTERNAL_LINKS = {
  baseScan: 'https://basescan.org',
  baseOrg: 'https://base.org',
  warpcast: 'https://warpcast.com',
  docs: 'https://docs.baseflow.io',
} as const;

// UI constants
export const ANIMATION_DURATION = 300;
export const TOAST_DURATION = 5000;
export const MAX_RECENT_TRANSACTIONS = 10;
