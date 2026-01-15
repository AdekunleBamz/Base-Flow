// URL and query parameter utilities

/**
 * Build URL with query parameters
 */
export function buildUrl(base: string, params: Record<string, any>): string {
  const url = new URL(base, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
}

/**
 * Parse query parameters from URL
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URL(url, window.location.origin).searchParams;
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Get single query parameter
 */
export function getQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Update query parameters without reload
 */
export function updateQueryParams(params: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  });
  
  window.history.pushState({}, '', url.toString());
}

/**
 * Encode object to base64
 */
export function encodeState(state: any): string {
  return btoa(JSON.stringify(state));
}

/**
 * Decode base64 to object
 */
export function decodeState<T>(encoded: string): T | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}
