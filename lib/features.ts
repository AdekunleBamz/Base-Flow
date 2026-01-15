// Browser feature detection

export const features = {
  hasLocalStorage: typeof window !== 'undefined' && 'localStorage' in window,
  hasSessionStorage: typeof window !== 'undefined' && 'sessionStorage' in window,
  hasWebWorkers: typeof window !== 'undefined' && 'Worker' in window,
  hasServiceWorker: typeof window !== 'undefined' && 'serviceWorker' in navigator,
  hasNotifications: typeof window !== 'undefined' && 'Notification' in window,
  hasGeolocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  hasClipboard: typeof navigator !== 'undefined' && 'clipboard' in navigator,
  hasShareAPI: typeof navigator !== 'undefined' && 'share' in navigator,
  hasWebGL: (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  })(),
};

export function checkFeature(feature: keyof typeof features): boolean {
  return features[feature];
}

export default features;
