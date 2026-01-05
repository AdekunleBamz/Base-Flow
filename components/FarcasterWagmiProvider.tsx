'use client';

import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { useFarcaster } from './FarcasterProvider';

const queryClient = new QueryClient();

// Create config for Farcaster Frame environment
// Uses injected connector which works with Farcaster's wallet provider
const frameConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
});

export function FarcasterWagmiProvider({ children }: { children: React.ReactNode }) {
  const { isInFrame } = useFarcaster();

  // In frame context, use frame-specific config
  if (isInFrame) {
    return (
      <WagmiProvider config={frameConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  // Outside frame, just render children (will use parent Web3Provider if available)
  return <>{children}</>;
}
