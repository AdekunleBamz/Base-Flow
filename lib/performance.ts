// Performance monitoring utilities

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();

  startMeasure(name: string): void {
    this.marks.set(name, performance.now());
  }

  endMeasure(name: string): number {
    const start = this.marks.get(name);
    
    if (!start) {
      console.warn(`No start mark found for: ${name}`);
      return 0;
    }
    
    const duration = performance.now() - start;
    
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
    });
    
    this.marks.delete(name);
    
    return duration;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageDuration(name: string): number {
    const relevant = this.metrics.filter(m => m.name === name);
    
    if (relevant.length === 0) return 0;
    
    const total = relevant.reduce((sum, m) => sum + m.duration, 0);
    return total / relevant.length;
  }

  clearMetrics(): void {
    this.metrics = [];
    this.marks.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default PerformanceMonitor;
