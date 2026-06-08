"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types/product";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartToastData = {
  name: string;
  image: string;
  price: number;
} | null;

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  showCartToast: (product: { name: string; image: string; price: number }) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cartToast, setCartToast] = useState<CartToastData>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const cartToastTimer = useRef<ReturnType<typeof setTimeout>>();
  const animTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const showCartToast = useCallback((product: { name: string; image: string; price: number }) => {
    if (cartToastTimer.current) clearTimeout(cartToastTimer.current);
    setCartToast(product);
    cartToastTimer.current = setTimeout(() => setCartToast(null), 3500);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("scentiva_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("scentiva_cart");
      }
    }
    setIsHydrated(true);

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (cartToastTimer.current) clearTimeout(cartToastTimer.current);
      if (animTimer.current) clearTimeout(animTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("scentiva_cart", JSON.stringify(cart));
  }, [cart, isHydrated]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (animTimer.current) clearTimeout(animTimer.current);
    setIsAnimating(true);
    animTimer.current = setTimeout(() => setIsAnimating(false), 2000);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.actual,
          image: product.image,
          quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );
  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      toast,
      showToast,
      showCartToast,
      totalItems,
      totalPrice,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      toast,
      showToast,
      showCartToast,
      totalItems,
      totalPrice,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{
              opacity: 1,
              scale: 2,
              x: "50vw",
              y: "50vh",
              left: -12,
              top: -12,
            }}
            animate={{
              opacity: [1, 1, 0.8, 0],
              scale: [2, 1.2, 0.6, 0.1],
              x: ["50vw", "75vw", "calc(100vw - 80px)"],
              y: ["50vh", "25vh", "30px"],
            }}
            transition={{
              duration: 1.8,
              times: [0, 0.4, 0.8, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed pointer-events-none z-[500] w-6 h-6 bg-gold-oud rounded-full shadow-[0_0_35px_rgba(212,175,55,1),0_0_10px_rgba(255,255,255,0.5)] border border-parchment/20"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartToast && (
          <motion.div
            key="cart-toast"
            initial={{ opacity: 0, y: 100, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[400] pointer-events-none"
          >
            <div className="relative bg-elevated border border-parchment/15 rounded-2xl p-3.5 shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden flex items-center gap-3.5">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-oud to-transparent" />
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-parchment/10">
                <Image src={cartToast.image} alt={cartToast.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <ShoppingBag size={11} className="text-emerald-400 flex-shrink-0" />
                  <p className="text-[10px] text-emerald-400 uppercase tracking-[0.18em] font-bold">
                    Added to Bag
                  </p>
                </div>
                <p className="text-sm font-serif text-parchment leading-snug truncate">{cartToast.name}</p>
                <p className="text-xs text-gold-oud font-bold mt-0.5">GH₵ {cartToast.price}</p>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.15 }}
                className="flex-shrink-0"
              >
                <CheckCircle2 size={26} className="text-emerald-400" />
              </motion.div>
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.5, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-oud/40 origin-left"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="plain-toast"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-elevated text-parchment px-8 py-3.5 rounded-full flex items-center gap-3 shadow-2xl border border-parchment/10"
          >
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
