import dynamicImport from 'next/dynamic';
import { Web3Provider } from '@/components/Web3Provider';

// Force dynamic rendering - required for wagmi/rainbowkit localStorage usage
export const dynamic = 'force-dynamic';

// Dynamic import to avoid SSR issues with wagmi
const SwapCard = dynamicImport(() => import('@/components/SwapCard'), { ssr: false });
const TransactionHistory = dynamicImport(() => import('@/components/TransactionHistory'), { ssr: false });

export default function Home() {
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
