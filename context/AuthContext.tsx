"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { showSuccess, showError } from "@/lib/swal";
import { API_URL } from "@/lib/api";

interface User {
  id: string;
  phone: string;
  fullName: string;
  role: "ADMIN" | "CUSTOMER";
  profileImage?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password: string, returnTo?: string) => Promise<void>;
  signup: (userData: Record<string, unknown>) => Promise<void>;
  verifyOtp: (phone: string, otp: string, returnTo?: string) => Promise<void>;
  resendOtp: (phone: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const safeReturnTo = (path?: string | null) =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : null;

function persistAuthSession(accessToken: string, authUser: User) {
  Cookies.set("scentiva_token", accessToken, { expires: 7, sameSite: "lax" });
  Cookies.set("scentiva_user", JSON.stringify(authUser), { expires: 7, sameSite: "lax" });
  if (authUser.role?.toUpperCase() === "ADMIN") {
    localStorage.setItem("adminToken", accessToken);
  }
}

function redirectAfterAuth(router: ReturnType<typeof useRouter>, user: User, returnTo?: string) {
  if (user.role?.toUpperCase() === "ADMIN") {
    if (typeof window !== "undefined") {
      window.location.href = "/admin";
    } else {
      router.push("/admin");
    }
    return;
  }
  const dest = safeReturnTo(returnTo) || "/dashboard";
  if (typeof window !== "undefined") {
    window.location.href = dest;
  } else {
    router.push(dest);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = Cookies.get("scentiva_token");
    const savedUser = Cookies.get("scentiva_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        Cookies.remove("scentiva_token");
        Cookies.remove("scentiva_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (phone: string, password: string, returnTo?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = response.ok ? await response.json() : null;

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid phone number or password. Please try again.");
        }
        throw new Error(data?.message || "An unexpected error occurred during login.");
      }

      setToken(data.access_token);
      setUser(data.user);
      persistAuthSession(data.access_token, data.user);

      if (data.user.role?.toUpperCase() === "ADMIN") {
        showSuccess("Welcome Admin", "Successfully logged into the dashboard");
      } else {
        showSuccess("Welcome Back", "Successfully logged in");
      }
      redirectAfterAuth(router, data.user, returnTo);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Invalid credentials";
      showError("Login Failed", message);
      throw error;
    }
  }, [router]);

  const signup = useCallback(async (userData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = response.ok ? await response.json() : null;
      if (!response.ok) {
        throw new Error(data?.message || "Registration failed. Please try again.");
      }

      setToken(data.access_token);
      setUser(data.user);
      persistAuthSession(data.access_token, data.user);

      showSuccess("Welcome", "Your account is ready.");
      redirectAfterAuth(router, data.user, userData.returnTo as string | undefined);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      showError("Signup Failed", message);
      throw error;
    }
  }, [router]);

  const verifyOtp = useCallback(async (phone: string, otp: string, returnTo?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = response.ok ? await response.json() : null;
      if (!response.ok) {
        throw new Error(data?.message || "Verification failed. Please try again.");
      }

      setToken(data.access_token);
      setUser(data.user);
      persistAuthSession(data.access_token, data.user);
      redirectAfterAuth(router, data.user, returnTo);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Verification failed";
      showError("Verification Failed", message);
      throw error;
    }
  }, [router]);

  const resendOtp = useCallback(async (phone: string) => {
    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to resend OTP");
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    Cookies.remove("scentiva_token");
    Cookies.remove("scentiva_user");
    localStorage.removeItem("adminToken");

    showSuccess("Signed Out", "You have been successfully signed out.");
    setTimeout(() => router.push("/"), 1500);
  }, [router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...userData };
      Cookies.set("scentiva_user", JSON.stringify(next), { expires: 7, sameSite: "lax" });
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      signup,
      verifyOtp,
      resendOtp,
      logout,
      updateUser,
    }),
    [user, token, isLoading, login, signup, verifyOtp, resendOtp, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
