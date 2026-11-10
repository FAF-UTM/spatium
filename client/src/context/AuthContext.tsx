// Authentication context: holds the current user, exposes login/logout and
// restores the session on load from a stored JWT.
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  request,
  getToken,
  setToken,
  clearToken,
} from '../api/client';
import type { AuthResponse, MeResponse, User } from '../api/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  loginWithToken: (token: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token try to load the current user.
  useEffect(() => {
    let active = true;
    async function restore() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const res = await request<MeResponse>('/auth/me', { auth: true });
        if (active) setUser(res.user);
      } catch {
        clearToken();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { identifier, password },
    });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  // Log in by storing a token directly (e.g. a master/break-glass admin token
  // passed via a ?token= login link) and loading the user it resolves to.
  const loginWithToken = useCallback(async (token: string) => {
    setToken(token);
    try {
      const res = await request<MeResponse>('/auth/me', { auth: true });
      setUser(res.user);
      return res.user;
    } catch (err) {
      clearToken();
      setUser(null);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await request('/auth/logout', { method: 'POST', auth: true });
    } catch {
      // ignore network errors on logout
    }
    clearToken();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
