import { createContext, useState, useEffect, type ReactNode } from 'react';
import type {
  AuthContextValue,
  LoginCredentials,
  User,
} from '../types/auth';
import {
  getToken,
  saveToken,
  deleteToken,
  decodeToken,
  isTokenValid,
} from '../utils/token';
import { apiClient } from '../services/api/client';
import { endpoints } from '../services/api/endpoints';
import type { LoginResponse } from '../types/auth';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedToken = getToken();

    if (storedToken && isTokenValid()) {
      setToken(storedToken);
      setIsAuthenticated(true);

      // Decode token to get user info
      const decoded = decodeToken();
      if (decoded && decoded.payload && typeof decoded.payload === 'object') {
        const payload = decoded.payload as Record<string, unknown>;
        setUser({
          id: payload.id as number,
          username: payload.username as string,
          email: payload.email as string | undefined,
          role: payload.role as string | undefined,
        });
      }
    } else {
      // Token invalid or expired, clean up
      deleteToken();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        endpoints.auth.login(),
        credentials
      );

      const { token: newToken, user: userData } = response;

      // Save token
      saveToken(newToken);
      setToken(newToken);
      setIsAuthenticated(true);

      // Set user from response or decode from token
      if (userData) {
        setUser(userData);
      } else {
        const decoded = decodeToken();
        if (decoded && decoded.payload && typeof decoded.payload === 'object') {
          const payload = decoded.payload as Record<string, unknown>;
          setUser({
            id: payload.id as number,
            username: payload.username as string,
            email: payload.email as string | undefined,
            role: payload.role as string | undefined,
          });
        }
      }
    } catch (error) {
      deleteToken();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    deleteToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
