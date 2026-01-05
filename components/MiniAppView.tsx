'use client';

import { FarcasterProvider } from './FarcasterProvider';
import { FarcasterWagmiProvider } from './FarcasterWagmiProvider';
import MiniAppSwap from './MiniAppSwap';

export default function MiniAppView() {
  return (
    <FarcasterProvider>
      <FarcasterWagmiProvider>
        <MiniAppSwap />
      </FarcasterWagmiProvider>
    </FarcasterProvider>
  );
}
