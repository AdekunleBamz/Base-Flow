'use client';

import React, { useEffect, useState } from 'react';
import { Fuel } from 'lucide-react';
import { formatUnits } from 'viem';

interface GasEstimatorProps {
  gasEstimate?: bigint;
  gasPrice?: bigint;
}

export function GasEstimator({ gasEstimate, gasPrice }: GasEstimatorProps) {
  const [ethPrice, setEthPrice] = useState(3200); // Mock ETH price

  const calculateGasCost = () => {
    if (!gasEstimate || !gasPrice) return { eth: '0', usd: '0' };

    const gasCostWei = gasEstimate * gasPrice;
    const gasCostEth = formatUnits(gasCostWei, 18);
    const gasCostUsd = (parseFloat(gasCostEth) * ethPrice).toFixed(2);

    return {
      eth: parseFloat(gasCostEth).toFixed(6),
      usd: gasCostUsd,
    };
  };

  const gasCost = calculateGasCost();

  if (!gasEstimate || !gasPrice) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg text-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <Fuel className="w-4 h-4" />
        <span>Est. Gas</span>
      </div>
      <div className="text-right">
        <p className="text-white font-medium">{gasCost.eth} ETH</p>
        <p className="text-xs text-slate-500">${gasCost.usd}</p>
      </div>
    </div>
  );
}

export default GasEstimator;
