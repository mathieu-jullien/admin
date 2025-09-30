import { apiConfig } from '../../config/api';
import { ApiException } from '../../types/api/errors';
import type { RequestConfig } from './types';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
    this.defaultHeaders = apiConfig.headers;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...config,
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
        signal: config.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
        }));

        throw new ApiException({
          message: errorData.message || 'Une erreur est survenue',
          status: response.status,
          code: errorData.code,
          errors: errorData.errors,
        });
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiException) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiException({
          message: 'La requête a expiré',
          status: 408,
          code: 'TIMEOUT',
        });
      }

      throw new ApiException({
        message: 'Erreur réseau',
        status: 0,
        code: 'NETWORK_ERROR',
      });
    }
  }

  async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      signal,
    });
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      signal,
    });
  }

  async put<T>(
    endpoint: string,
    data: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      signal,
    });
  }

  async patch<T>(
    endpoint: string,
    data: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      signal,
    });
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      signal,
    });
  }
}

export const apiClient = new ApiClient();
