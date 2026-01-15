'use client';

import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenPriceComparisonProps {
  fromToken: string;
  toToken: string;
  rate: number;
  priceChange24h?: number;
}

export function TokenPriceComparison({
  fromToken,
  toToken,
  rate,
  priceChange24h = 0,
}: TokenPriceComparisonProps) {
  const isPositive = priceChange24h >= 0;

  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white font-medium">1 {fromToken}</span>
        <ArrowRight className="w-4 h-4 text-slate-500" />
        <span className="text-white font-medium">
          {rate.toFixed(6)} {toToken}
        </span>
      </div>

      {priceChange24h !== 0 && (
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>
            {isPositive ? '+' : ''}{priceChange24h.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
}

export default TokenPriceComparison;
