'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useLocalStorage } from '@/hooks';

interface FavoriteTokensProps {
  onSelect: (symbol: string) => void;
  currentToken?: string;
}

export function FavoriteTokens({ onSelect, currentToken }: FavoriteTokensProps) {
  const [favorites] = useLocalStorage<string[]>('favorite_tokens', []);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span>Favorites</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {favorites.map(symbol => (
          <button
            key={symbol}
            onClick={() => onSelect(symbol)}
            disabled={symbol === currentToken}
            className="px-3 py-1.5 text-sm text-white bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FavoriteTokens;
