// Keyboard shortcuts manager

type KeyHandler = (event: KeyboardEvent) => void;

class KeyboardShortcuts {
  private handlers: Map<string, KeyHandler> = new Map();

  register(key: string, handler: KeyHandler): void {
    this.handlers.set(key, handler);
  }

  unregister(key: string): void {
    this.handlers.delete(key);
  }

  init(): void {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('keydown', this.handleKeyDown);
  }

  destroy(): void {
    if (typeof window === 'undefined') return;
    
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = this.getKeyString(event);
    const handler = this.handlers.get(key);
    
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  };

  private getKeyString(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    parts.push(event.key.toLowerCase());
    
    return parts.join('+');
  }
}

export const keyboard = new KeyboardShortcuts();
export default KeyboardShortcuts;
