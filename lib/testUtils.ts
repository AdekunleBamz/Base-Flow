// Test utilities for testing components

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
) {
  return render(ui, { ...options });
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
}

/**
 * Mock fetch
 */
export function mockFetch(data: any) {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      ok: true,
    })
  );
}

/**
 * Wait for async updates
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));
