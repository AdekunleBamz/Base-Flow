// Feature flags system

interface FeatureFlags {
  enablePriceChart: boolean;
  enableTransactionHistory: boolean;
  enableFavorites: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  enableAdvancedMode: boolean;
}

const defaultFlags: FeatureFlags = {
  enablePriceChart: true,
  enableTransactionHistory: true,
  enableFavorites: true,
  enableNotifications: true,
  enableAnalytics: true,
  enableAdvancedMode: false,
};

class FeatureFlagManager {
  private flags: FeatureFlags;

  constructor() {
    this.flags = { ...defaultFlags };
    this.loadFromStorage();
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }

  enable(flag: keyof FeatureFlags) {
    this.flags[flag] = true;
    this.saveToStorage();
  }

  disable(flag: keyof FeatureFlags) {
    this.flags[flag] = false;
    this.saveToStorage();
  }

  toggle(flag: keyof FeatureFlags) {
    this.flags[flag] = !this.flags[flag];
    this.saveToStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('feature_flags');
      if (stored) {
        this.flags = { ...defaultFlags, ...JSON.parse(stored) };
      }
    } catch {}
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('feature_flags', JSON.stringify(this.flags));
    } catch {}
  }
}

export const featureFlags = new FeatureFlagManager();
export default FeatureFlagManager;
