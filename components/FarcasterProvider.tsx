'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import sdk from '@farcaster/frame-sdk';

// Define types based on the SDK structure
interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface FarcasterContextType {
  isInFrame: boolean;
  isSDKLoaded: boolean;
  context: any | null;
  user: FarcasterUser | null;
  actions: {
    openUrl: (url: string) => Promise<void>;
    close: () => Promise<void>;
  };
}

const FarcasterContext = createContext<FarcasterContextType>({
  isInFrame: false,
  isSDKLoaded: false,
  context: null,
  user: null,
  actions: {
    openUrl: async () => {},
    close: async () => {},
  },
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Get context from Farcaster
        const ctx = await sdk.context;
        setContext(ctx);
        
        // Signal that the app is ready
        sdk.actions.ready();
        
        setIsSDKLoaded(true);
      } catch (error) {
        console.log('Not in Farcaster frame or SDK init failed:', error);
        setIsSDKLoaded(true);
      }
    };

    initSDK();
  }, []);

  const isInFrame = !!context;

  const user: FarcasterUser | null = context?.user ? {
    fid: context.user.fid,
    username: context.user.username,
    displayName: context.user.displayName,
    pfpUrl: context.user.pfpUrl,
  } : null;

  const actions = {
    openUrl: async (url: string) => {
      if (isInFrame) {
        await sdk.actions.openUrl(url);
      } else {
        window.open(url, '_blank');
      }
    },
    close: async () => {
      if (isInFrame) {
        await sdk.actions.close();
      }
    },
  };

  return (
    <FarcasterContext.Provider value={{ isInFrame, isSDKLoaded, context, user, actions }}>
      {children}
    </FarcasterContext.Provider>
  );
}
