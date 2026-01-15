'use client';

import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceChangeProps {
  value: number;
  showIcon?: boolean;
  showSign?: boolean;
}

export function PriceChange({ value, showIcon = true, showSign = true }: PriceChangeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const color = isNeutral ? 'text-slate-400' : isPositive ? 'text-green-400' : 'text-red-400';
  
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      {showIcon && !isNeutral && (
        isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />
      )}
      {showIcon && isNeutral && <Minus className="w-3 h-3" />}
      {showSign && !isNeutral && (isPositive ? '+' : '')}
      {value.toFixed(2)}%
    </span>
  );
}

export default PriceChange;
