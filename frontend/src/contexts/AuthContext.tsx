'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    if (!initialUser) {
      const initializeAuth = async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const userData = localStorage.getItem('user');

          if (token && userData) {
            const isValid = await authService.validateToken();

            if (isValid) {
              setUser(JSON.parse(userData));
            } else {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        } finally {
          setLoading(false);
        }
      };

      initializeAuth();
    } else {
      setLoading(false);
    }
  }, [initialUser]);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });

      document.cookie = `auth_token=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;

      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await authService.register({ email, password });

      document.cookie = `auth_token=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;

      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    document.cookie =
      'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
