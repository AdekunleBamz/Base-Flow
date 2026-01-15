'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NetworkBannerProps {
  isOffline?: boolean;
}

export function NetworkBanner({ isOffline = false }: NetworkBannerProps) {
  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-sm border-b border-yellow-600">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm text-yellow-900">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">
            You are currently offline. Some features may not work.
          </span>
        </div>
      </div>
    </div>
  );
}

export default NetworkBanner;
