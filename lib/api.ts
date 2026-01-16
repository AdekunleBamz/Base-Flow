// API client utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || '';
    this.headers = options.headers || {};
    this.timeout = options.timeout || 30000;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.headers,
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  patch<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  removeHeader(key: string): void {
    delete this.headers[key];
  }
}

export const apiClient = new ApiClient();
