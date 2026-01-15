'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface QuickAmountButtonsProps {
  onSelect: (percentage: number) => void;
  disabled?: boolean;
}

export function QuickAmountButtons({ onSelect, disabled = false }: QuickAmountButtonsProps) {
  const amounts = [25, 50, 75, 100];

  return (
    <div className="flex gap-2">
      {amounts.map(amount => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          disabled={disabled}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {amount === 100 ? <Zap className="w-3 h-3 inline mr-1" /> : null}
          {amount}%
        </button>
      ))}
    </div>
  );
}

export default QuickAmountButtons;
