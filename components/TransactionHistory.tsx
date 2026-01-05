'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ExternalLink, ArrowRight, Loader2, RefreshCw, X } from 'lucide-react';
import { useAccount } from 'wagmi';
import { TOKENS, CONTRACTS } from '@/lib/config';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  functionName: string;
  isError: string; // BaseScan returns '0' or '1' as string
  methodId: string;
}

interface ParsedSwap {
  hash: string;
  type: 'WETH → USDC' | 'USDC → WETH' | 'ETH → USDC' | 'Unknown';
  timestamp: Date;
  status: 'success' | 'failed';
}

export default function TransactionHistory() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<ParsedSwap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTransactions = async () => {
    if (!address || !CONTRACTS.SWAP_ROUTER) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch transactions from BaseScan API
      const response = await fetch(
        `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc`
      );

      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();

      if (data.status === '1' && data.result) {
        // Filter transactions to our swap router
        const swapTxs = data.result
          .filter((tx: Transaction) => 
            tx.to?.toLowerCase() === CONTRACTS.SWAP_ROUTER?.toLowerCase()
          )
          .map((tx: Transaction): ParsedSwap => {
            // Parse method ID to determine swap type
            let type: ParsedSwap['type'] = 'Unknown';
            
            // Method IDs (first 10 chars of input data)
            // These are based on the function signatures
            if (tx.methodId === '0x6cc1ae13') {
              type = 'WETH → USDC';
            } else if (tx.methodId === '0x5b41b908') {
              type = 'USDC → WETH';
            } else if (tx.methodId === '0x2d2c5565') {
              type = 'ETH → USDC';
            }

            return {
              hash: tx.hash,
              type,
              timestamp: new Date(parseInt(tx.timestamp) * 1000),
              status: tx.isError === '0' ? 'success' : 'failed',
            };
          });

        setTransactions(swapTxs);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && isOpen) {
      fetchTransactions();
    }
  }, [address, isConnected, isOpen]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getSwapIcon = (type: string) => {
    if (type.includes('WETH') || type.includes('ETH')) {
      return '⟠';
    }
    return '💵';
  };

  if (!isConnected) return null;

  return (
    <>
      {/* History Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full shadow-lg border border-slate-600 transition-colors z-40"
      >
        <History className="w-6 h-6" />
      </motion.button>

      {/* History Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-l border-slate-700/50 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Transaction History</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchTransactions}
                    disabled={loading}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="h-full overflow-y-auto pb-20">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Loading transactions...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <p className="text-red-400 mb-2">{error}</p>
                    <button
                      onClick={fetchTransactions}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Try again
                    </button>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <History className="w-12 h-12 mb-4 opacity-50" />
                    <p>No swap transactions yet</p>
                    <p className="text-sm mt-2">Your swaps will appear here</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {transactions.map((tx, index) => (
                      <motion.div
                        key={tx.hash}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                              {getSwapIcon(tx.type)}
                            </div>
                            <div>
                              <div className="font-medium text-white flex items-center gap-2">
                                {tx.type}
                                {tx.status === 'failed' && (
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                    Failed
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-slate-400">
                                {formatTime(tx.timestamp)}
                              </div>
                            </div>
                          </div>
                          <a
                            href={`https://basescan.org/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-400 transition-colors p-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
                <a
                  href={`https://basescan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  View all on BaseScan
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
