'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { GetMeDocument } from '@/graphql';
import { getCookie, removeCookie } from '@/lib/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import type { User } from '@/domains/user/contracts';
import { mapUser } from '@/domains/user/mappers/mapUser';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasToken, setHasToken] = useState(() => {
    if (typeof document === 'undefined') return false;
    return !!getCookie(AUTH_COOKIE_NAME);
  });

  const { data, loading, error, refetch } = useQuery(GetMeDocument, {
    skip: !hasToken,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'none',
  });

  const logout = useCallback(() => {
    removeCookie(AUTH_COOKIE_NAME);
    setHasToken(false);
    window.location.href = '/';
  }, []);

  const refetchUser = useCallback(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (token) {
      setHasToken(true);
      refetch();
    }
  }, [refetch]);

  const clearAuthOnError = useCallback(() => {
    if (error) {
      removeCookie(AUTH_COOKIE_NAME);
      setHasToken(false);
    }
  }, [error]);

  // Clear invalid token when error occurs
  if (error && hasToken) {
    // Schedule the cleanup for next tick to avoid render-phase state updates
    queueMicrotask(clearAuthOnError);
  }

  const user: User | null = data?.user ? mapUser(data.user) : null;

  const isAuthenticated = hasToken && !error && !!user;

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading: hasToken && !error && loading,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
