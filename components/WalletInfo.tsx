'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletInfoProps {
  address: string;
  balance?: string;
  symbol?: string;
}

export function WalletInfo({ address, balance, symbol = 'ETH' }: WalletInfoProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
        <Wallet className="w-5 h-5 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">Connected Wallet</p>
        <p className="text-sm text-white font-mono truncate">{address}</p>
      </div>
      {balance && (
        <div className="text-right">
          <p className="text-xs text-slate-400">Balance</p>
          <p className="text-sm text-white font-medium">{balance} {symbol}</p>
        </div>
      )}
    </div>
  );
}

export default WalletInfo;
