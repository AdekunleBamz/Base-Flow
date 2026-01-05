'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check } from 'lucide-react';
import { TOKENS } from '@/lib/config';

type TokenKey = keyof typeof TOKENS;

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: TokenKey) => void;
  selectedToken: TokenKey;
  disabledToken?: TokenKey;
  title?: string;
}

export default function TokenModal({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
  disabledToken,
  title = 'Select Token',
}: TokenModalProps) {
  const [search, setSearch] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<TokenKey[]>(
    Object.keys(TOKENS) as TokenKey[]
  );

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = (Object.keys(TOKENS) as TokenKey[]).filter((key) => {
      const token = TOKENS[key];
      return (
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query)
      );
    });
    setFilteredTokens(filtered);
  }, [search]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSelect = (token: TokenKey) => {
    if (token !== disabledToken) {
      onSelect(token);
      onClose();
      setSearch('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-700/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or symbol..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* Token List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredTokens.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No tokens found
                  </div>
                ) : (
                  filteredTokens.map((tokenKey) => {
                    const token = TOKENS[tokenKey];
                    const isSelected = tokenKey === selectedToken;
                    const isDisabled = tokenKey === disabledToken;

                    return (
                      <button
                        key={tokenKey}
                        onClick={() => handleSelect(tokenKey)}
                        disabled={isDisabled}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isDisabled
                            ? 'opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-600/20 border border-blue-500/50'
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        {/* Token Logo */}
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                          {token.logo}
                        </div>

                        {/* Token Info */}
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-white">
                            {token.symbol}
                          </div>
                          <div className="text-sm text-slate-400">
                            {token.name}
                          </div>
                        </div>

                        {/* Selected Check */}
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-400" />
                        )}

                        {/* Disabled label */}
                        {isDisabled && (
                          <span className="text-xs text-slate-500">
                            Already selected
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                <p className="text-xs text-slate-500 text-center">
                  Tokens available on Base Mainnet
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
