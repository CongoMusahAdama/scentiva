"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import CartManager from "@/components/CartManager";
import ChatWidget from "@/components/ChatWidget";
import { ReactNode } from "react";

export default function StoreProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname === "/signin" || pathname === "/signup";

  if (isAdmin) {
    // On admin routes: no cart, no chat widget
    return <>{children}</>;
  }

  return (
    <CartProvider>
      {!isAuth && <CartManager />}
      {children}
      {!isAuth && <ChatWidget />}
    </CartProvider>
  );
}
