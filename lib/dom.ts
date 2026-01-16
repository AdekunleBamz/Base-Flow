// DOM utility functions
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Partial<HTMLElementTagNameMap[K]>,
  children?: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if (props) {
    Object.assign(element, props);
  }
  
  if (children) {
    children.forEach(child => {
      element.appendChild(
        typeof child === 'string' ? document.createTextNode(child) : child
      );
    });
  }
  
  return element;
}

export function querySelectorSafe<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T | null {
  try {
    return parent.querySelector<T>(selector);
  } catch {
    return null;
  }
}

export function querySelectorAllSafe<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T[] {
  try {
    return Array.from(parent.querySelectorAll<T>(selector));
  } catch {
    return [];
  }
}

export function addClass(element: Element, ...classes: string[]): void {
  element.classList.add(...classes.filter(Boolean));
}

export function removeClass(element: Element, ...classes: string[]): void {
  element.classList.remove(...classes.filter(Boolean));
}

export function toggleClass(element: Element, className: string, force?: boolean): void {
  element.classList.toggle(className, force);
}

export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

export function scrollTo(x: number, y: number, smooth = true): void {
  window.scrollTo({
    left: x,
    top: y,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

export function getElementOffset(element: Element): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  const scroll = getScrollPosition();
  
  return {
    top: rect.top + scroll.y,
    left: rect.left + scroll.x,
  };
}
