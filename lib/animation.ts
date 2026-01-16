// Animation utilities
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeIn(t: number): number {
  return t * t;
}

export function easeOut(t: number): number {
  return t * (2 - t);
}

export function linear(t: number): number {
  return t;
}

export type EasingFunction = (t: number) => number;

export function animate(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  easing: EasingFunction = easeInOut
): () => void {
  const startTime = Date.now();
  const difference = to - from;
  let cancelled = false;

  function step() {
    if (cancelled) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = from + difference * easedProgress;

    onUpdate(currentValue);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);

  return () => {
    cancelled = true;
  };
}

export function fadeIn(
  element: HTMLElement,
  duration = 300,
  easing: EasingFunction = easeInOut
): Promise<void> {
  return new Promise(resolve => {
    element.style.opacity = '0';
    element.style.display = 'block';

    animate(0, 1, duration, value => {
      element.style.opacity = value.toString();
    }, easing);

    setTimeout(resolve, duration);
  });
}

export function fadeOut(
  element: HTMLElement,
  duration = 300,
  easing: EasingFunction = easeInOut
): Promise<void> {
  return new Promise(resolve => {
    animate(1, 0, duration, value => {
      element.style.opacity = value.toString();
    }, easing);

    setTimeout(() => {
      element.style.display = 'none';
      resolve();
    }, duration);
  });
}

export function slideDown(
  element: HTMLElement,
  duration = 300,
  easing: EasingFunction = easeInOut
): Promise<void> {
  return new Promise(resolve => {
    const height = element.scrollHeight;
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.display = 'block';

    animate(0, height, duration, value => {
      element.style.height = `${value}px`;
    }, easing);

    setTimeout(() => {
      element.style.height = '';
      element.style.overflow = '';
      resolve();
    }, duration);
  });
}

export function slideUp(
  element: HTMLElement,
  duration = 300,
  easing: EasingFunction = easeInOut
): Promise<void> {
  return new Promise(resolve => {
    const height = element.scrollHeight;
    element.style.height = `${height}px`;
    element.style.overflow = 'hidden';

    animate(height, 0, duration, value => {
      element.style.height = `${value}px`;
    }, easing);

    setTimeout(() => {
      element.style.display = 'none';
      element.style.height = '';
      element.style.overflow = '';
      resolve();
    }, duration);
  });
}
