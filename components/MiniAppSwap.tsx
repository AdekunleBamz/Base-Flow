'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits, encodeFunctionData } from 'viem';
import { ArrowDownUp, Loader2, CheckCircle, XCircle, Wallet } from 'lucide-react';
import { useFarcaster } from './FarcasterProvider';
import { TOKENS, CONTRACTS } from '@/lib/config';

// Contract ABI for swap functions
const SWAP_ABI = [
  {
    name: 'swapWETHForUSDC',
    type: 'function',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMinimum', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'swapUSDCForWETH',
    type: 'function',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMinimum', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
] as const;

const WETH_PRICE_USD = 3500;
const SLIPPAGE = 0.05;

type SwapDirection = 'WETH_TO_USDC' | 'USDC_TO_WETH';

const PRESET_AMOUNTS = {
  WETH_TO_USDC: ['0.001', '0.005', '0.01', '0.05'],
  USDC_TO_WETH: ['5', '10', '25', '50'],
};

export default function MiniAppSwap() {
  const { user, isInFrame, actions } = useFarcaster();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction, data: txHash, isPending, error: txError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [direction, setDirection] = useState<SwapDirection>('WETH_TO_USDC');
  const [amount, setAmount] = useState('0.001');

  // Auto-connect in Farcaster frame
  useEffect(() => {
    if (isInFrame && !isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [isInFrame, isConnected, connectors, connect]);

  const fromToken = direction === 'WETH_TO_USDC' ? TOKENS.WETH : TOKENS.USDC;
  const toToken = direction === 'WETH_TO_USDC' ? TOKENS.USDC : TOKENS.WETH;

  const calculateExpectedOutput = () => {
    const amountNum = parseFloat(amount) || 0;
    if (direction === 'WETH_TO_USDC') {
      return (amountNum * WETH_PRICE_USD * (1 - SLIPPAGE)).toFixed(2);
    } else {
      return (amountNum / WETH_PRICE_USD * (1 - SLIPPAGE)).toFixed(6);
    }
  };

  const handleSwap = async () => {
    if (!CONTRACTS.SWAP_ROUTER || !address) return;

    try {
      let data: `0x${string}`;
      
      if (direction === 'WETH_TO_USDC') {
        const amountIn = parseEther(amount);
        const expectedUsdc = parseFloat(amount) * WETH_PRICE_USD;
        const amountOutMin = BigInt(Math.floor(expectedUsdc * (1 - SLIPPAGE) * 1e6));
        
        data = encodeFunctionData({
          abi: SWAP_ABI,
          functionName: 'swapWETHForUSDC',
          args: [amountIn, amountOutMin],
        });
      } else {
        const amountIn = parseUnits(amount, 6);
        const expectedWeth = parseFloat(amount) / WETH_PRICE_USD;
        const amountOutMin = parseEther((expectedWeth * (1 - SLIPPAGE)).toFixed(18));
        
        data = encodeFunctionData({
          abi: SWAP_ABI,
          functionName: 'swapUSDCForWETH',
          args: [amountIn, amountOutMin],
        });
      }

      sendTransaction({
        to: CONTRACTS.SWAP_ROUTER,
        data,
        value: 0n,
      });
    } catch (err) {
      console.error('Swap error:', err);
    }
  };

  const toggleDirection = () => {
    setDirection(prev => prev === 'WETH_TO_USDC' ? 'USDC_TO_WETH' : 'WETH_TO_USDC');
    setAmount(PRESET_AMOUNTS[direction === 'WETH_TO_USDC' ? 'USDC_TO_WETH' : 'WETH_TO_USDC'][0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b0d] via-[#0f172a] to-[#0a0b0d] text-white">
      {/* Header with user info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-bold text-lg">Baseflow</span>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              {user.pfpUrl && (
                <img src={user.pfpUrl} alt="" className="w-8 h-8 rounded-full" />
              )}
              <span className="text-sm text-slate-400">@{user.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main swap interface */}
      <div className="p-4 max-w-md mx-auto">
        {/* Connection status */}
        {!isConnected ? (
          <div className="bg-slate-800/50 rounded-2xl p-6 text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <p className="text-slate-400 mb-4">Connect your wallet to swap</p>
            <button
              onClick={() => connectors[0] && connect({ connector: connectors[0] })}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* From Token */}
            <div className="bg-slate-800/50 rounded-2xl p-4 mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">From</span>
                <span className="text-xs text-slate-500">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-xl">
                  <span className="text-xl">{fromToken.logo}</span>
                  <span className="font-medium">{fromToken.symbol}</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-right text-2xl font-bold outline-none"
                  placeholder="0.0"
                />
              </div>
              {/* Preset amounts */}
              <div className="flex gap-2 mt-3">
                {PRESET_AMOUNTS[direction].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      amount === preset
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap direction toggle */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={toggleDirection}
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl border-4 border-[#0a0b0d] transition-colors"
              >
                <ArrowDownUp className="w-5 h-5" />
              </button>
            </div>

            {/* To Token */}
            <div className="bg-slate-800/50 rounded-2xl p-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">To (estimated)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-xl">
                  <span className="text-xl">{toToken.logo}</span>
                  <span className="font-medium">{toToken.symbol}</span>
                </div>
                <span className="flex-1 text-right text-2xl font-bold text-slate-400">
                  ~{calculateExpectedOutput()}
                </span>
              </div>
            </div>

            {/* Swap button */}
            <button
              onClick={handleSwap}
              disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
              className={`w-full mt-4 py-4 rounded-2xl font-bold text-lg transition-all ${
                isPending || isConfirming
                  ? 'bg-slate-600 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
              }`}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Confirm in Wallet...
                </span>
              ) : isConfirming ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Swapping...
                </span>
              ) : (
                `Swap ${fromToken.symbol} → ${toToken.symbol}`
              )}
            </button>

            {/* Transaction status */}
            {isSuccess && txHash && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Swap successful!</span>
                </div>
                <button
                  onClick={() => actions.openUrl(`https://basescan.org/tx/${txHash}`)}
                  className="text-sm text-green-400/70 hover:text-green-400 mt-1"
                >
                  View on BaseScan →
                </button>
              </div>
            )}

            {txError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Swap failed</span>
                </div>
                <p className="text-sm text-red-400/70 mt-1">
                  {txError.message.slice(0, 100)}
                </p>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 p-4 bg-slate-800/30 rounded-xl text-sm text-slate-400">
              <div className="flex justify-between mb-1">
                <span>Network</span>
                <span className="text-white">Base</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Slippage</span>
                <span className="text-white">5%</span>
              </div>
              <div className="flex justify-between">
                <span>DEX</span>
                <span className="text-white">Uniswap V3</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-slate-500">
        Powered by Uniswap V3 on Base
      </div>
    </div>
  );
}
