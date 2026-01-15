// Analytics event tracking

export type AnalyticsEvent =
  | 'swap_initiated'
  | 'swap_completed'
  | 'swap_failed'
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'token_selected'
  | 'settings_changed'
  | 'quote_fetched'
  | 'transaction_viewed'
  | 'page_view';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  timestamp: number;
}

class Analytics {
  private enabled: boolean = true;
  private events: AnalyticsEventData[] = [];

  /**
   * Track an event
   */
  track(event: AnalyticsEvent, properties?: Record<string, any>) {
    if (!this.enabled) return;

    const eventData: AnalyticsEventData = {
      event,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(eventData);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', event, properties);
    }

    // In production, this would send to analytics service
    this.sendToService(eventData);
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string) {
    this.track('page_view', { path, title });
  }

  /**
   * Track swap initiation
   */
  trackSwapInitiated(fromToken: string, toToken: string, amount: string) {
    this.track('swap_initiated', { fromToken, toToken, amount });
  }

  /**
   * Track swap completion
   */
  trackSwapCompleted(
    fromToken: string,
    toToken: string,
    amount: string,
    txHash: string,
    durationMs: number
  ) {
    this.track('swap_completed', {
      fromToken,
      toToken,
      amount,
      txHash,
      durationMs,
    });
  }

  /**
   * Track swap failure
   */
  trackSwapFailed(fromToken: string, toToken: string, amount: string, error: string) {
    this.track('swap_failed', {
      fromToken,
      toToken,
      amount,
      error,
    });
  }

  /**
   * Enable or disable analytics
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEventData[] {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Send event to analytics service
   */
  private sendToService(event: AnalyticsEventData) {
    // Implementation would send to analytics service
    // Example: Google Analytics, Mixpanel, PostHog, etc.
  }
}

// Export singleton instance
export const analytics = new Analytics();

export default analytics;
