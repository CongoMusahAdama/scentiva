"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type AdminPage =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "reviews"
  | "referrals"
  | "settings"
  | "receipts";

interface AdminContextType {
  activePage: AdminPage;
  setActivePage: (page: AdminPage) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        activePage,
        setActivePage,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
