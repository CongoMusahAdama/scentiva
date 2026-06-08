import Cookies from "js-cookie";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export function getAuthToken(): string | undefined {
  return Cookies.get("scentiva_token") || (typeof window !== "undefined" ? localStorage.getItem("adminToken") || undefined : undefined);
}

export function getAuthHeaders(contentType = true): HeadersInit {
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
