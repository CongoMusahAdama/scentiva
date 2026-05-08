"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { showSuccess, showError } from "@/lib/swal";

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
  login: (phone: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  resendOtp: (phone: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

  useEffect(() => {
    // Try to load from cookies first (better for SSR/Middleware)
    const savedToken = Cookies.get("scentiva_token");
    const savedUser = Cookies.get("scentiva_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    console.log(`[AUTH] Attempting login for: ${phone} at ${API_URL}`);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      console.log(`[AUTH] Response received: ${response.status} ${response.statusText}`);

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log(`[AUTH] Response data:`, data);
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid phone number or password. Please try again.");
        }
        throw new Error(data?.message || "An unexpected error occurred during login.");
      }

      if (data.requiresVerification) {
        if (data.otp) console.log(`[TEST] Verification Code: ${data.otp}`);
        router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}`);
        return;
      }

      setToken(data.access_token);
      setUser(data.user);

      // Save to cookies for Middleware access
      Cookies.set("scentiva_token", data.access_token, { expires: 7 });
      Cookies.set("scentiva_user", JSON.stringify(data.user), { expires: 7 });

      if (data.user.role?.toUpperCase() === "ADMIN") {
        localStorage.setItem("adminToken", data.access_token);
        showSuccess("Welcome Admin", "Successfully logged into the dashboard");
        router.push("/admin");
      } else {
        showSuccess("Welcome Back", "Successfully logged in");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      showError("Login Failed", error.message || "Invalid credentials");
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || "Registration failed. Please try again.");
      }

      if (data.otp) console.log(`[TEST] Verification Code: ${data.otp}`);
      router.push(`/verify-otp?phone=${encodeURIComponent(userData.phone)}`);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || "Verification failed. Please try again.");
      }

      setToken(data.access_token);
      setUser(data.user);

      // Save to cookies for Middleware access
      Cookies.set("scentiva_token", data.access_token, { expires: 7 });
      Cookies.set("scentiva_user", JSON.stringify(data.user), { expires: 7 });

      if (data.user.role?.toUpperCase() === "ADMIN") {
        localStorage.setItem("adminToken", data.access_token);
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    }
  };

  const resendOtp = async (phone: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }
      if (data.otp) console.log(`[TEST] Resent Verification Code: ${data.otp}`);
    } catch (error) {
      console.error("Resend error:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("scentiva_token");
    Cookies.remove("scentiva_user");
    
    showSuccess("Signed Out", "You have been successfully signed out.");
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...userData };
      setUser(newUser);
      Cookies.set("scentiva_user", JSON.stringify(newUser), { expires: 7 });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, verifyOtp, resendOtp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
