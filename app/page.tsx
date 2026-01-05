'use client';

import dynamicImport from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Web3Provider } from '@/components/Web3Provider';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamic imports to avoid SSR issues
const SwapCard = dynamicImport(() => import('@/components/SwapCard'), { ssr: false });
const TransactionHistory = dynamicImport(() => import('@/components/TransactionHistory'), { ssr: false });
const MiniAppView = dynamicImport(() => import('@/components/MiniAppView'), { ssr: false });

export default function Home() {
  const [isInFrame, setIsInFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect if we're in a Farcaster frame
    const checkFrame = async () => {
      try {
        // Check for Farcaster SDK
        const sdk = await import('@farcaster/frame-sdk');
        const context = await sdk.default.context;
        setIsInFrame(!!context);
      } catch {
        setIsInFrame(false);
      }
      setIsLoading(false);
    };
    checkFrame();
  }, []);

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d]">
        <div className="text-4xl animate-pulse">🌊</div>
      </div>
    );
  }

  // Render MiniApp view if in Farcaster
  if (isInFrame) {
    return <MiniAppView />;
  }

  // Regular web app
  return (
    <Web3Provider>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0a0b0d] via-[#0f172a] to-[#0a0b0d]">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        </div>
        
        {/* Logo/Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🌊</span>
            <h1 className="text-4xl font-bold text-white">Baseflow</h1>
          </div>
          <p className="text-slate-400">
            Seamless token swaps on Base
          </p>
        </div>
        
        {/* Swap Interface */}
        <div className="relative z-10 w-full max-w-md">
          <SwapCard />
        </div>
        
        {/* Transaction History Button */}
        <TransactionHistory />
        
        {/* Footer */}
        <div className="mt-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <a 
              href="https://basescan.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              BaseScan
            </a>
            <span>•</span>
            <a 
              href="https://base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Base
            </a>
            <span>•</span>
            <a 
              href="https://warpcast.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Warpcast
            </a>
          </div>
        </div>
      </main>
    </Web3Provider>
  );
}
