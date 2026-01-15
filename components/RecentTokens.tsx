'use client';

import React from 'react';
import { History } from 'lucide-react';
import { useLocalStorage } from '@/hooks';

interface RecentToken {
  symbol: string;
  timestamp: number;
}

interface RecentTokensProps {
  onSelect: (symbol: string) => void;
  exclude?: string[];
}

export function RecentTokens({ onSelect, exclude = [] }: RecentTokensProps) {
  const [recentTokens] = useLocalStorage<RecentToken[]>('recent_tokens', []);

  const filtered = recentTokens
    .filter(token => !exclude.includes(token.symbol))
    .slice(0, 5);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <History className="w-3 h-3" />
        <span>Recent</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {filtered.map(token => (
          <button
            key={token.symbol}
            onClick={() => onSelect(token.symbol)}
            className="px-3 py-1.5 text-sm text-white bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {token.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentTokens;
