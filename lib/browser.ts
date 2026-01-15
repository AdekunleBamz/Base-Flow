// Browser detection utilities

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function isChrome(): boolean {
  if (!isBrowser()) return false;
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

export function isFirefox(): boolean {
  if (!isBrowser()) return false;
  return /Firefox/.test(navigator.userAgent);
}

export function isSafari(): boolean {
  if (!isBrowser()) return false;
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}

export function isMobile(): boolean {
  if (!isBrowser()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  if (!isBrowser()) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (!isBrowser()) return false;
  return /Android/.test(navigator.userAgent);
}

export function supportsWebP(): boolean {
  if (!isBrowser()) return false;
  const elem = document.createElement('canvas');
  return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

export function getBrowserInfo() {
  if (!isBrowser()) return null;
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    vendor: navigator.vendor,
    isChrome: isChrome(),
    isFirefox: isFirefox(),
    isSafari: isSafari(),
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
  };
}
