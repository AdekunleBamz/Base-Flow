// Monitoring and metrics

interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

class Monitor {
  private metrics: Metric[] = [];

  track(name: string, value: number, tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      tags,
    });
    
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  trackTiming(name: string, startTime: number) {
    const duration = Date.now() - startTime;
    this.track(name, duration);
  }

  getMetrics(name?: string): Metric[] {
    if (!name) return this.metrics;
    return this.metrics.filter(m => m.name === name);
  }

  clear() {
    this.metrics = [];
  }
}

export const monitor = new Monitor();
export default Monitor;
