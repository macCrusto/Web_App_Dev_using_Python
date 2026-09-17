import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { CONFIG } from '@/src/config/env';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => Promise<{ success: boolean; message: string; user?: User }>;
  updateUser: (data: Partial<User>) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('access_token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('access_token')));

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${CONFIG.API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.user) {
          throw new Error(data.message || 'Session validation failed.');
        }
        setUser(data.user as User);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('auth_user');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const role: UserRole = user?.role || 'USER';

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_expiry');
    localStorage.removeItem('refresh_expiry');
  };

  const switchRole = async (newRole: UserRole): Promise<{ success: boolean; message: string; user?: User }> => {
    if (user?.role === 'ADMIN' && (newRole === 'ADMIN' || !user?.last_role_switch)) {
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
      return { success: true, message: `Switched perspective to ${newRole}` };
    }

    const currentToken = token || localStorage.getItem('access_token');
    if (!currentToken) {
      // Local development/mock fallback: enforce 12-hour cooldown
      const COOLDOWN_MS = 12 * 60 * 60 * 1000;
      if (user?.last_role_switch) {
        const elapsed = Date.now() - new Date(user.last_role_switch).getTime();
        if (elapsed < COOLDOWN_MS) {
          const remMs = COOLDOWN_MS - elapsed;
          const remHours = Math.floor(remMs / (3600 * 1000));
          const remMins = Math.floor((remMs % (3600 * 1000)) / (60 * 1000));
          return {
            success: false,
            message: `Role switch is on cooldown. You can switch again in ${remHours}h ${remMins}m.`,
          };
        }
      }
      const updatedUser: User = user
        ? { ...user, role: newRole, last_role_switch: new Date().toISOString() }
        : {
            id: 1,
            fullname: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            role: newRole,
            last_role_switch: new Date().toISOString(),
          };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return { success: true, message: `Role switched to ${newRole}.`, user: updatedUser };
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}/api/auth/switch-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || `Failed to switch role (${response.status})`,
        };
      }

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem('access_token', data.access_token);
      }

      if (data.user) {
        setUser(data.user as User);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      return {
        success: true,
        message: data.message || `Role switched to ${newRole} successfully.`,
        user: data.user,
      };
    } catch {
      // Resilient fallback if backend server is offline in development
      const COOLDOWN_MS = 12 * 60 * 60 * 1000;
      if (user?.last_role_switch) {
        const elapsed = Date.now() - new Date(user.last_role_switch).getTime();
        if (elapsed < COOLDOWN_MS) {
          const remMs = COOLDOWN_MS - elapsed;
          const remHours = Math.floor(remMs / (3600 * 1000));
          const remMins = Math.floor((remMs % (3600 * 1000)) / (60 * 1000));
          return {
            success: false,
            message: `Role switch is on cooldown. You can switch again in ${remHours}h ${remMins}m.`,
          };
        }
      }
      const updatedUser: User = user
        ? { ...user, role: newRole, last_role_switch: new Date().toISOString() }
        : {
            id: 1,
            fullname: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            role: newRole,
            last_role_switch: new Date().toISOString(),
          };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return {
        success: true,
        message: `Role switched to ${newRole}.`,
        user: updatedUser,
      };
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false;
    if (role === 'ADMIN') return true; // Admins have elevated access
    return allowedRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        switchRole,
        updateUser,
        hasRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
