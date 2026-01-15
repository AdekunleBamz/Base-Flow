'use client';

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface SlippageIndicatorProps {
  slippage: number;
  expectedAmount: string;
  minimumAmount: string;
  tokenSymbol: string;
}

export function SlippageIndicator({
  slippage,
  expectedAmount,
  minimumAmount,
  tokenSymbol,
}: SlippageIndicatorProps) {
  const getWarningLevel = () => {
    if (slippage >= 5) return 'high';
    if (slippage >= 2) return 'medium';
    return 'low';
  };

  const warningLevel = getWarningLevel();

  const styles = {
    low: 'bg-green-500/10 border-green-500/30 text-green-300',
    medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    high: 'bg-red-500/10 border-red-500/30 text-red-300',
  };

  return (
    <div className={`p-3 rounded-lg border ${styles[warningLevel]}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {warningLevel === 'high' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Info className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 text-sm space-y-1">
          <p className="font-medium">
            Slippage tolerance: {slippage}%
          </p>
          <div className="text-xs opacity-90 space-y-0.5">
            <p>Expected: {expectedAmount} {tokenSymbol}</p>
            <p>Minimum received: {minimumAmount} {tokenSymbol}</p>
          </div>
          {warningLevel === 'high' && (
            <p className="text-xs mt-1">
              ⚠️ High slippage may result in significant losses
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlippageIndicator;
