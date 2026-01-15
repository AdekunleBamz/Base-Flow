'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceChangeIndicatorProps {
  change: number;
  period?: '1h' | '24h' | '7d';
  size?: 'sm' | 'md' | 'lg';
}

export function PriceChangeIndicator({ 
  change, 
  period = '24h',
  size = 'md' 
}: PriceChangeIndicatorProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]} ${
      isNeutral ? 'text-slate-400' : isPositive ? 'text-green-400' : 'text-red-400'
    }`}>
      {isNeutral ? (
        <Minus className={iconSizes[size]} />
      ) : isPositive ? (
        <TrendingUp className={iconSizes[size]} />
      ) : (
        <TrendingDown className={iconSizes[size]} />
      )}
      <span className="font-medium">
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
      <span className="text-slate-500">({period})</span>
    </div>
  );
}

export default PriceChangeIndicator;
