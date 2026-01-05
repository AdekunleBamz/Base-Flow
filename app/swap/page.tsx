import dynamicImport from 'next/dynamic';
import { Web3Provider } from '@/components/Web3Provider';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering - required for wagmi/rainbowkit localStorage usage
export const dynamic = 'force-dynamic';

const SwapCard = dynamicImport(() => import('@/components/SwapCard'), { ssr: false });

export default function SwapPage() {
  return (
    <Web3Provider>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0a0b0d] via-[#0f172a] to-[#0a0b0d]">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        </div>

        {/* Back button */}
        <div className="fixed top-4 left-4 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Swap Interface */}
        <div className="relative z-10 w-full max-w-md">
          <SwapCard />
        </div>
      </main>
    </Web3Provider>
  );
}
