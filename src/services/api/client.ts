import { apiConfig } from '../../config/api';
import { ApiException } from '../../types/api/errors';
import type { RequestConfig } from './types';
import { getToken } from '../../utils/token';

class ApiClient {
  private baseURL: string;
  private apiURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.apiURL = apiConfig.apiURL;
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
      // Determine URL based on endpoint
      const url =
        endpoint === '/auth'
          ? `${this.baseURL}${endpoint}`
          : `${this.apiURL}${endpoint}`;

      // Get token and add to headers if available
      const token = getToken();
      const headers: Record<string, string> = {
        ...this.defaultHeaders,
        ...config.headers,
      };

      // Add Authorization header for all requests except /auth (login)
      if (token && endpoint !== '/auth') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...config,
        headers,
        signal: config.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
        }));

        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          // Clear invalid token
          const { deleteToken } = await import('../../utils/token');
          deleteToken();

          // Redirect to login page
          window.location.href = '/auth';

          throw new ApiException({
            message: 'Session expirée. Veuillez vous reconnecter.',
            status: 401,
            code: 'UNAUTHORIZED',
          });
        }

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
