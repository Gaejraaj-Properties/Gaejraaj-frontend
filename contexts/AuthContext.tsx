"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/lib/types";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Ensure cookie is set for middleware (handles existing logged-in sessions)
      const base = `path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
      document.cookie = `auth_token=${storedToken}; ${base}`;
    }
    setLoading(false);
  }, []);

  const cookieBase = `path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;

  const setAuthCookie = (t: string) => {
    document.cookie = `auth_token=${t}; ${cookieBase}`;
  };

  const clearAuthCookie = () => {
    document.cookie = "auth_token=; path=/; max-age=0";
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: t, data } = res.data;
    setToken(t);
    setUser(data.user);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthCookie(t);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await api.post("/auth/register", data);
    const { token: t, data: d } = res.data;
    setToken(t);
    setUser(d.user);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(d.user));
    setAuthCookie(t);
  }, []);

  const loginWithGoogle = useCallback((t: string, googleUser: User) => {
    setToken(t);
    setUser(googleUser);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(googleUser));
    const base = `path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.cookie = `auth_token=${t}; ${base}`;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearAuthCookie();
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
