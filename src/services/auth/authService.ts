import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { LoginCredentials, LoginResponse } from '../../types/auth';


export const authService = {

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>(
      endpoints.auth.login(),
      credentials
    );
  },

  /**
   * Optional: Verify token validity with backend
   */
  verifyToken: async (): Promise<{ valid: boolean }> => {
    // Implement if your backend has a token verification endpoint
    // return await apiClient.get('/auth/verify');
    throw new Error('Not implemented');
  },

  /**
   * Optional: Refresh token
   */
  refreshToken: async (): Promise<LoginResponse> => {
    // Implement if your backend supports token refresh
    // return await apiClient.post('/auth/refresh');
    throw new Error('Not implemented');
  },
};
