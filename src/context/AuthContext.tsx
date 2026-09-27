import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

export interface AdminUser {
  id: number;
  username: string;
  mustChangePassword: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  mustChangePassword: false,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  changePassword: async () => ({ success: false }),
  checkAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.auth.login({ username, password });
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err: any) {
      const msg = err.response?.data?.error || "Invalid username or password";
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore
    } finally {
      setUser(null);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ) => {
    try {
      const res = await api.auth.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (res.data.success) {
        if (user) {
          setUser({ ...user, mustChangePassword: false });
        }
        return { success: true };
      }
      return { success: false, error: "Password update failed" };
    } catch (err: any) {
      const msg = err.response?.data?.error || "Password change failed";
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        mustChangePassword: !!user?.mustChangePassword,
        loading,
        login,
        logout,
        changePassword,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
