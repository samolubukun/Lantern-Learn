"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { formatFriendlyErrorMessage } from "@/lib/errors";

export interface User {
  id: string;
  name: string;
  email: string;
  imageSrc: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; imageSrc?: string }) => Promise<{ success: boolean; error?: string; message?: string }>;
  updatePassword: (data: { currentPassword: string; newPassword: string }) => Promise<{ success: boolean; error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => ({ success: false }),
  updatePassword: async () => ({ success: false }),
});

const TOKEN_KEY = "lantern_session_token";

const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs = 7000,
  errorMsg = "Database connection timeout. Please ensure Convex is active."
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
    ),
  ]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [queryTimedOut, setQueryTimedOut] = useState(false);
  const router = useRouter();

  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.register);
  const logoutMutation = useMutation(api.auth.logout);
  const updateProfileMutation = useMutation(api.auth.updateProfile);
  const updatePasswordMutation = useMutation(api.auth.updatePassword);

  // Sync token from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (err) {
      console.warn("Could not read session token from localStorage", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Fetch current user from Convex if token is present
  const currentUser = useQuery(
    api.auth.getCurrentUser,
    token ? { token } : "skip"
  );

  // Fallback timeout so UI never hangs in infinite loading if WebSocket is offline
  useEffect(() => {
    if (token && currentUser === undefined) {
      const timer = setTimeout(() => {
        setQueryTimedOut(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setQueryTimedOut(false);
    }
  }, [token, currentUser]);

  // Handle expired/invalid token cleanup
  useEffect(() => {
    if (isHydrated && token && currentUser === null) {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch (err) {
        console.warn("Could not clear session token", err);
      }
      setToken(null);
    }
  }, [isHydrated, token, currentUser]);

  const login = async (email: string, password: string) => {
    try {
      const res: any = await withTimeout(
        loginMutation({ email, password }),
        7000,
        "Connection timed out. Please check your network and try again."
      );

      // Check if structured response with token was returned
      if (res && res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        return { success: true };
      }

      // Check for structured failure without throwing
      if (res && res.success === false && res.error) {
        return { success: false, error: res.error };
      }

      return {
        success: false,
        error: res?.error || "Invalid email or password. Please verify your credentials.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatFriendlyErrorMessage(
          err,
          "Invalid email or password. Please verify your credentials."
        ),
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res: any = await withTimeout(
        registerMutation({ name, email, password }),
        7000,
        "Connection timed out. Please check your network and try again."
      );

      // Check if structured response with token was returned
      if (res && res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        return { success: true };
      }

      // Check for structured failure without throwing
      if (res && res.success === false && res.error) {
        return { success: false, error: res.error };
      }

      return {
        success: false,
        error: res?.error || "Registration failed. Please check your information.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatFriendlyErrorMessage(
          err,
          "Failed to create account. Please try again."
        ),
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await withTimeout(logoutMutation({ token }), 3000).catch(() => {});
      }
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch (e) {}
      setToken(null);
      router.push("/");
    }
  };

  const updateProfile = async (data: { name?: string; imageSrc?: string }) => {
    try {
      const res: any = await withTimeout(
        updateProfileMutation({
          token: token || undefined,
          name: data.name,
          imageSrc: data.imageSrc,
        }),
        7000,
        "Update timed out. Please check your connection."
      );
      if (res && res.success) {
        return { success: true, message: res.message };
      }
      return {
        success: false,
        error: res?.error || "Could not update profile.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatFriendlyErrorMessage(err, "Failed to update profile. Please try again."),
      };
    }
  };

  const updatePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const res: any = await withTimeout(
        updatePasswordMutation({
          token: token || undefined,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        7000,
        "Password update timed out. Please check your connection."
      );
      if (res && res.success) {
        return { success: true, message: res.message };
      }
      return {
        success: false,
        error: res?.error || "Could not update password.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatFriendlyErrorMessage(err, "Failed to update password. Please try again."),
      };
    }
  };

  const isLoading = !isHydrated || (!!token && currentUser === undefined && !queryTimedOut);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser ?? null,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
