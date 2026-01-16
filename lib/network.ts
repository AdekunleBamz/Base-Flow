// Network utilities
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

export function getConnectionType(): string {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }
  
  const connection = (navigator as any).connection;
  return connection?.effectiveType || 'unknown';
}

export async function checkConnectivity(url = 'https://www.google.com', timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    await fetch(url, {
      mode: 'no-cors',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}

export function getNetworkSpeed(): number | null {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return null;
  }
  
  const connection = (navigator as any).connection;
  return connection?.downlink || null;
}

export function onNetworkChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
