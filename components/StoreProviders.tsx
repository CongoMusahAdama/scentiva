"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CartManager from "@/components/CartManager";
import ChatWidget from "@/components/ChatWidget";
import { ReactNode } from "react";

export default function StoreProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname === "/signin" || pathname === "/signup";

  return (
    <ThemeProvider>
      <AuthProvider>
        {isAdmin ? (
          <>{children}</>
        ) : (
          <CartProvider>
            {!isAuth && <CartManager />}
            {children}
            {!isAuth && <ChatWidget />}
          </CartProvider>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}
