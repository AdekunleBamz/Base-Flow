// Token price service for fetching live prices

import { TokenKey } from '@/types';

interface PriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
}

interface CachedPrice {
  data: PriceData;
  timestamp: number;
}

const CACHE_DURATION = 30000; // 30 seconds
const priceCache = new Map<TokenKey, CachedPrice>();

/**
 * Get token price from Uniswap V3 pools
 */
export async function getTokenPrice(tokenSymbol: TokenKey): Promise<PriceData | null> {
  // Check cache first
  const cached = priceCache.get(tokenSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // In production, this would call a real price API
    // For now, return mock data based on token type
    const mockPrices: Record<TokenKey, PriceData> = {
      ETH: {
        price: 2450.32,
        priceChange24h: 3.45,
        volume24h: 15420000000,
        liquidity: 3200000000,
      },
      WETH: {
        price: 2450.32,
        priceChange24h: 3.45,
        volume24h: 15420000000,
        liquidity: 3200000000,
      },
      USDC: {
        price: 1.00,
        priceChange24h: 0.01,
        volume24h: 8500000000,
        liquidity: 5100000000,
      },
      DAI: {
        price: 0.9998,
        priceChange24h: -0.02,
        volume24h: 2100000000,
        liquidity: 1800000000,
      },
      cbETH: {
        price: 2520.15,
        priceChange24h: 3.67,
        volume24h: 450000000,
        liquidity: 280000000,
      },
      USDbC: {
        price: 1.00,
        priceChange24h: 0.00,
        volume24h: 320000000,
        liquidity: 180000000,
      },
    };

    const data = mockPrices[tokenSymbol];
    
    // Cache the result
    priceCache.set(tokenSymbol, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}

/**
 * Get price for a token pair
 */
export async function getTokenPairPrice(
  fromToken: TokenKey,
  toToken: TokenKey
): Promise<number | null> {
  try {
    const [fromPrice, toPrice] = await Promise.all([
      getTokenPrice(fromToken),
      getTokenPrice(toToken),
    ]);

    if (!fromPrice || !toPrice) return null;

    return fromPrice.price / toPrice.price;
  } catch (error) {
    console.error('Error fetching token pair price:', error);
    return null;
  }
}

/**
 * Clear price cache
 */
export function clearPriceCache() {
  priceCache.clear();
}

/**
 * Get all cached prices
 */
export function getCachedPrices(): Map<TokenKey, CachedPrice> {
  return new Map(priceCache);
}
