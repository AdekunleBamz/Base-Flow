'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, Loader2, Wallet, AlertCircle, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, encodeFunctionData } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TOKENS, CONTRACTS, ERC20_ABI, SWAP_ROUTER_ABI, UNISWAP_ROUTER_ABI } from '@/lib/config';
import TokenModal from './TokenModal';
import SettingsPanel, { SwapSettings } from './SettingsPanel';

// Custom hook for debouncing values
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

type TokenKey = 'ETH' | 'WETH' | 'USDC' | 'DAI' | 'cbETH' | 'USDbC';

interface SwapState {
  fromToken: TokenKey;
  toToken: TokenKey;
  fromAmount: string;
  toAmount: string;
  loading: boolean;
  error: string | null;
}

export default function SwapCard() {
  const { address, isConnected } = useAccount();
  const [swap, setSwap] = useState<SwapState>({
    fromToken: 'ETH',
    toToken: 'USDC',
    fromAmount: '',
    toAmount: '',
    loading: false,
    error: null,
  });
  const [approving, setApproving] = useState(false);
  const [priceImpact, setPriceImpact] = useState<string | null>(null);
  const [quoteFetching, setQuoteFetching] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [livePrice, setLivePrice] = useState<string | null>(null);
  const [tokenModalOpen, setTokenModalOpen] = useState<'from' | 'to' | null>(null);
  const [settings, setSettings] = useState<SwapSettings>({
    slippage: 0.5,
    deadline: 20,
    autoRouter: true,
  });
  
  // Debounce the input amount to avoid too many API calls
  const debouncedAmount = useDebouncedValue(swap.fromAmount, 500);
  
  // ETH Balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // WETH Balance
  const { data: wethBalance } = useReadContract({
    address: TOKENS.WETH.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // USDC Balance
  const { data: usdcBalance } = useReadContract({
    address: TOKENS.USDC.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // DAI Balance
  const { data: daiBalance } = useReadContract({
    address: TOKENS.DAI.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // cbETH Balance
  const { data: cbEthBalance } = useReadContract({
    address: TOKENS.cbETH.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // USDbC Balance
  const { data: usdbcBalance } = useReadContract({
    address: TOKENS.USDbC.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // USDC Allowance (check against Uniswap V3 Router)
  const { data: usdcAllowance, refetch: refetchAllowance } = useReadContract({
    address: TOKENS.USDC.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && CONTRACTS.UNISWAP_V3_ROUTER ? [address, CONTRACTS.UNISWAP_V3_ROUTER] : undefined,
  });

  // WETH Allowance (check against Uniswap V3 Router)
  const { data: wethAllowance, refetch: refetchWethAllowance } = useReadContract({
    address: TOKENS.WETH.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && CONTRACTS.UNISWAP_V3_ROUTER ? [address, CONTRACTS.UNISWAP_V3_ROUTER] : undefined,
  });

  // Write contract hooks
  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract();
  
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Get balance for token
  const getBalance = useCallback((token: TokenKey): string => {
    if (token === 'ETH') {
      return ethBalance ? formatUnits(ethBalance.value, 18) : '0';
    }
    if (token === 'WETH') {
      return wethBalance ? formatUnits(wethBalance as bigint, 18) : '0';
    }
    if (token === 'USDC') {
      return usdcBalance ? formatUnits(usdcBalance as bigint, 6) : '0';
    }
    if (token === 'DAI') {
      return daiBalance ? formatUnits(daiBalance as bigint, 18) : '0';
    }
    if (token === 'cbETH') {
      return cbEthBalance ? formatUnits(cbEthBalance as bigint, 18) : '0';
    }
    if (token === 'USDbC') {
      return usdbcBalance ? formatUnits(usdbcBalance as bigint, 6) : '0';
    }
    return '0';
  }, [ethBalance, wethBalance, usdcBalance, daiBalance, cbEthBalance, usdbcBalance]);

  // Fetch live quote from API
  const fetchQuote = useCallback(async (amount: string, from: TokenKey, to: TokenKey) => {
    if (!amount || parseFloat(amount) === 0) {
      setSwap(prev => ({ ...prev, toAmount: '' }));
      setPriceImpact(null);
      setLivePrice(null);
      return;
    }
    
    // Map ETH to WETH for quote API
    const fromToken = from === 'ETH' ? 'WETH' : from;
    const toToken = to === 'ETH' ? 'WETH' : to;
    
    setQuoteFetching(true);
    setQuoteError(null);
    
    try {
      const response = await fetch(
        `/api/quote?from=${fromToken}&to=${toToken}&amount=${amount}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch quote');
      
      const data = await response.json();
      
      setSwap(prev => ({ ...prev, toAmount: data.amountOut }));
      setPriceImpact(data.priceImpact || '< 0.1%');
      setLivePrice(data.price);
      
      if (data.estimated) {
        setQuoteError('Using estimated price (live quote unavailable)');
      }
    } catch (error) {
      console.error('Quote error:', error);
      setQuoteError('Failed to fetch quote');
      // Fallback to estimated price
      const ETH_PRICE = 3200;
      const inputAmount = parseFloat(amount);
      let output = '';
      
      if ((from === 'ETH' || from === 'WETH') && to === 'USDC') {
        output = (inputAmount * ETH_PRICE * 0.997).toFixed(2);
      } else if (from === 'USDC' && (to === 'ETH' || to === 'WETH')) {
        output = (inputAmount / ETH_PRICE * 0.997).toFixed(6);
      }
      
      setSwap(prev => ({ ...prev, toAmount: output }));
      setPriceImpact('~0.3%');
    } finally {
      setQuoteFetching(false);
    }
  }, []);

  // Update output when debounced input changes
  useEffect(() => {
    fetchQuote(debouncedAmount, swap.fromToken, swap.toToken);
  }, [debouncedAmount, swap.fromToken, swap.toToken, fetchQuote]);
  
  // Function to manually refresh quote
  const refreshQuote = () => {
    if (swap.fromAmount) {
      fetchQuote(swap.fromAmount, swap.fromToken, swap.toToken);
    }
  };

  // Swap tokens direction
  const handleSwapDirection = () => {
    setSwap(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  };

  // Check if approval needed
  const needsApproval = useCallback((): boolean => {
    if (!swap.fromAmount || parseFloat(swap.fromAmount) === 0) return false;
    if (swap.fromToken === 'ETH') return false;
    
    const requiredAmount = parseUnits(
      swap.fromAmount,
      TOKENS[swap.fromToken].decimals
    );
    
    if (swap.fromToken === 'USDC') {
      return !usdcAllowance || (usdcAllowance as bigint) < requiredAmount;
    }
    if (swap.fromToken === 'WETH') {
      return !wethAllowance || (wethAllowance as bigint) < requiredAmount;
    }
    return false;
  }, [swap.fromAmount, swap.fromToken, usdcAllowance, wethAllowance]);

  // Handle approval
  const handleApprove = async () => {
    if (!CONTRACTS.UNISWAP_V3_ROUTER) return;
    if (swap.fromToken === 'ETH') return; // ETH doesn't need approval
    setApproving(true);
    
    try {
      const token = TOKENS[swap.fromToken];
      const amount = parseUnits(swap.fromAmount, token.decimals);
      
      // Approve Uniswap V3 SwapRouter
      // @ts-ignore - wagmi type inference issue with dynamic token addresses
      writeContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.UNISWAP_V3_ROUTER, amount * BigInt(2)], // Approve 2x for safety
      });
    } catch (e) {
      console.error('Approval error:', e);
    } finally {
      setApproving(false);
      refetchAllowance();
      refetchWethAllowance();
    }
  };

  // Handle swap
  const handleSwap = async () => {
    if (!CONTRACTS.SWAP_ROUTER || !swap.fromAmount) return;
    
    // Validate we have a valid output amount
    if (!swap.toAmount || parseFloat(swap.toAmount) <= 0) {
      setSwap(prev => ({ ...prev, error: 'Please wait for price quote' }));
      return;
    }
    
    setSwap(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Use slippage from settings (convert from percentage to decimal)
      const slippageDecimal = settings.slippage / 100;
      const minOutput = parseFloat(swap.toAmount) * (1 - slippageDecimal);
      
      // Extra validation
      if (isNaN(minOutput) || minOutput <= 0) {
        setSwap(prev => ({ ...prev, error: 'Invalid output amount', loading: false }));
        return;
      }

      // Calculate deadline (current time + settings.deadline minutes)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + settings.deadline * 60);
      
      if (swap.fromToken === 'ETH' && swap.toToken === 'USDC') {
        // Swap ETH for USDC using Uniswap SwapRouter02
        const amountIn = parseUnits(swap.fromAmount, 18);
        const amountOutMin = parseUnits(minOutput.toFixed(6), 6);
        
        // Encode the exactInputSingle call (SwapRouter02 doesn't have deadline in struct)
        const swapCalldata = encodeFunctionData({
          abi: UNISWAP_ROUTER_ABI,
          functionName: 'exactInputSingle',
          args: [{
            tokenIn: TOKENS.WETH.address,
            tokenOut: TOKENS.USDC.address,
            fee: 500, // 0.05% fee tier - most liquid on Base
            recipient: address!,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin,
            sqrtPriceLimitX96: BigInt(0),
          }],
        });
        
        // Use multicall with deadline - SwapRouter02 wraps ETH sent with value automatically
        // @ts-ignore - wagmi type inference issue
        writeContract({
          address: CONTRACTS.UNISWAP_V3_ROUTER,
          abi: UNISWAP_ROUTER_ABI,
          functionName: 'multicall',
          args: [deadline, [swapCalldata]],
          value: amountIn,
        });
      } else if (swap.fromToken === 'WETH' && swap.toToken === 'USDC') {
        // Swap WETH for USDC using Uniswap directly
        const amountIn = parseUnits(swap.fromAmount, 18);
        const amountOutMin = parseUnits(minOutput.toFixed(6), 6);
        
        const swapCalldata = encodeFunctionData({
          abi: UNISWAP_ROUTER_ABI,
          functionName: 'exactInputSingle',
          args: [{
            tokenIn: TOKENS.WETH.address,
            tokenOut: TOKENS.USDC.address,
            fee: 500,
            recipient: address!,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin,
            sqrtPriceLimitX96: BigInt(0),
          }],
        });
        
        // @ts-ignore - wagmi type inference issue
        writeContract({
          address: CONTRACTS.UNISWAP_V3_ROUTER,
          abi: UNISWAP_ROUTER_ABI,
          functionName: 'multicall',
          args: [deadline, [swapCalldata]],
        });
      } else if (swap.fromToken === 'USDC' && (swap.toToken === 'WETH' || swap.toToken === 'ETH')) {
        // Swap USDC for WETH using Uniswap directly
        const amountIn = parseUnits(swap.fromAmount, 6);
        const amountOutMin = parseUnits(minOutput.toFixed(18), 18);
        
        const swapCalldata = encodeFunctionData({
          abi: UNISWAP_ROUTER_ABI,
          functionName: 'exactInputSingle',
          args: [{
            tokenIn: TOKENS.USDC.address,
            tokenOut: TOKENS.WETH.address,
            fee: 500,
            recipient: address!,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin,
            sqrtPriceLimitX96: BigInt(0),
          }],
        });
        
        // @ts-ignore - wagmi type inference issue
        writeContract({
          address: CONTRACTS.UNISWAP_V3_ROUTER,
          abi: UNISWAP_ROUTER_ABI,
          functionName: 'multicall',
          args: [deadline, [swapCalldata]],
        });
      }
    } catch (e: any) {
      setSwap(prev => ({ ...prev, error: e.message || 'Swap failed' }));
    } finally {
      setSwap(prev => ({ ...prev, loading: false }));
    }
  };

  // Token selector button - now opens modal
  const TokenButton = ({ token, type }: { token: TokenKey; type: 'from' | 'to' }) => (
    <button
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
      onClick={() => setTokenModalOpen(type)}
    >
      <span className="text-2xl">{TOKENS[token].logo}</span>
      <span className="font-semibold text-white">{TOKENS[token].symbol}</span>
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // Handle token selection from modal
  const handleTokenSelect = (token: TokenKey) => {
    if (tokenModalOpen === 'from') {
      setSwap(prev => ({
        ...prev,
        fromToken: token,
        toToken: token === prev.toToken ? prev.fromToken : prev.toToken,
        fromAmount: '',
        toAmount: '',
      }));
    } else if (tokenModalOpen === 'to') {
      setSwap(prev => ({
        ...prev,
        toToken: token,
        fromToken: token === prev.fromToken ? prev.toToken : prev.fromToken,
        fromAmount: '',
        toAmount: '',
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Swap</h2>
          <div className="flex items-center gap-2">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
            <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
              const connected = mounted && account && chain;
              return (
                <button
                  onClick={connected ? openAccountModal : openConnectModal}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all text-sm font-medium"
                >
                  <Wallet className="w-4 h-4" />
                  {connected ? `${account.displayName}` : 'Connect'}
                </button>
              );
            }}
          </ConnectButton.Custom>
          </div>
        </div>

        {/* From Token */}
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">From</span>
            {isConnected && (
              <button
                onClick={() => setSwap(prev => ({ ...prev, fromAmount: getBalance(prev.fromToken) }))}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Balance: {parseFloat(getBalance(swap.fromToken)).toFixed(4)}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={swap.fromAmount}
              onChange={(e) => setSwap(prev => ({ ...prev, fromAmount: e.target.value }))}
              placeholder="0.0"
              className="flex-1 bg-transparent text-3xl font-semibold text-white outline-none placeholder-slate-500"
            />
            <TokenButton token={swap.fromToken} type="from" />
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSwapDirection}
            className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl border-4 border-slate-900 transition-all"
          >
            <ArrowDownUp className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* To Token */}
        <div className="bg-slate-800/50 rounded-2xl p-4 mt-2 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">To</span>
            {isConnected && (
              <span className="text-xs text-slate-500">
                Balance: {parseFloat(getBalance(swap.toToken)).toFixed(4)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={swap.toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-3xl font-semibold text-white outline-none placeholder-slate-500"
            />
            <TokenButton token={swap.toToken} type="to" />
          </div>
        </div>

        {/* Price Info */}
        {swap.fromAmount && swap.toAmount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-slate-800/30 rounded-xl p-3 mb-4 text-sm"
          >
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-2">
                Rate
                <button 
                  onClick={refreshQuote}
                  className="hover:text-white transition-colors"
                  disabled={quoteFetching}
                >
                  <RefreshCw className={`w-3 h-3 ${quoteFetching ? 'animate-spin' : ''}`} />
                </button>
              </span>
              <span className="flex items-center gap-1">
                {quoteFetching ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>1 {swap.fromToken} ≈ {livePrice || '...'} {swap.toToken}</>
                )}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 mt-1">
              <span>Price Impact</span>
              <span className="text-green-400">{priceImpact}</span>
            </div>
            <div className="flex justify-between text-slate-400 mt-1">
              <span>Fee</span>
              <span>0.3%</span>
            </div>
            <div className="flex justify-between text-slate-400 mt-1">
              <span>Slippage</span>
              <span className={settings.slippage > 1 ? 'text-yellow-400' : ''}>{settings.slippage}%</span>
            </div>
            <div className="flex justify-between text-slate-400 mt-1">
              <span>Min. Received</span>
              <span>
                {(parseFloat(swap.toAmount) * (1 - settings.slippage / 100)).toFixed(
                  swap.toToken === 'USDC' ? 2 : 6
                )} {swap.toToken}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 mt-1">
              <span>Network</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Base
              </span>
            </div>
            {quoteError && (
              <div className="text-yellow-400 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {quoteError}
              </div>
            )}
          </motion.div>
        )}

        {/* Transaction Success */}
        <AnimatePresence>
          {isTxSuccess && txHash && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 mb-4 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm flex-1">Swap successful!</span>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {swap.error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm">{swap.error}</span>
          </div>
        )}

        {/* Action Button */}
        {!isConnected ? (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            )}
          </ConnectButton.Custom>
        ) : !swap.fromAmount || parseFloat(swap.fromAmount) === 0 ? (
          <button
            disabled
            className="w-full bg-slate-700 text-slate-400 font-bold py-4 rounded-2xl cursor-not-allowed"
          >
            Enter Amount
          </button>
        ) : needsApproval() ? (
          <button
            onClick={handleApprove}
            disabled={approving || isWritePending}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {approving || isWritePending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Approving...
              </>
            ) : (
              <>Approve {swap.fromToken}</>
            )}
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={swap.loading || isWritePending || isTxLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {swap.loading || isWritePending || isTxLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isTxLoading ? 'Confirming...' : 'Swapping...'}
              </>
            ) : (
              <>Swap</>
            )}
          </button>
        )}

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Powered by Uniswap V3 • Base Mainnet
        </div>
      </div>

      {/* Token Selection Modal */}
      <TokenModal
        isOpen={tokenModalOpen !== null}
        onClose={() => setTokenModalOpen(null)}
        onSelect={handleTokenSelect}
        selectedToken={tokenModalOpen === 'from' ? swap.fromToken : swap.toToken}
        disabledToken={tokenModalOpen === 'from' ? swap.toToken : swap.fromToken}
        title={tokenModalOpen === 'from' ? 'Swap From' : 'Swap To'}
      />
    </motion.div>
  );
}
