"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("scentiva_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("scentiva_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    // Trigger flying animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.actual, 
        image: product.image, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      isCartOpen, setIsCartOpen, toast, showToast, totalItems, totalPrice 
    }}>
      {children}

      {/* Flying Item Animation */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ 
              opacity: 1, 
              scale: 2, 
              x: "50vw", 
              y: "50vh",
              left: -12,
              top: -12
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
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="fixed pointer-events-none z-[500] w-6 h-6 bg-gold-oud rounded-full shadow-[0_0_35px_rgba(212,175,55,1),0_0_10px_rgba(255,255,255,0.5)] border border-white/20"
          />
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-[#111114] text-parchment px-8 py-3.5 rounded-full flex items-center gap-3 shadow-2xl border border-parchment/10"
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
