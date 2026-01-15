// Local storage management utilities

const STORAGE_PREFIX = 'baseflow_';

/**
 * Set item in localStorage with prefix
 */
export function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get item from localStorage with prefix
 */
export function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    const item = localStorage.getItem(prefixedKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAppStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Get storage size in bytes
 */
export function getStorageSize(): number {
  if (typeof window === 'undefined') return 0;
  
  let total = 0;
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => {
      const value = localStorage.getItem(key);
      if (value) total += value.length + key.length;
    });
  
  return total;
}
