// Event handling utilities
type EventHandler<T = any> = (data: T) => void;

class EventEmitter {
  private events: Map<string, Set<EventHandler>> = new Map();

  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off<T = any>(event: string, handler: EventHandler<T>): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    }
  }

  emit<T = any>(event: string, data?: T): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  once<T = any>(event: string, handler: EventHandler<T>): () => void {
    const wrappedHandler = (data: T) => {
      handler(data);
      this.off(event, wrappedHandler);
    };
    return this.on(event, wrappedHandler);
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size ?? 0;
  }
}

export const eventBus = new EventEmitter();

export function createEventEmitter(): EventEmitter {
  return new EventEmitter();
}

export function debounceEvent<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function throttleEvent<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): T {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}
