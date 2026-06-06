"use client";

import React from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, MessageSquare } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CartDrawer = ({ isOpen, onClose }: Props) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const handleWhatsAppCheckout = () => {
    const phone = "233506626068";
    let message = "Hello Scentiva Aura, I would like to place an order:%0A%0A";
    
    cart.forEach((item) => {
      message += `• *${item.name}* [${item.id}] (x${item.quantity}) - GH₵ ${item.price * item.quantity}%0A`;
    });
    
    message += `%0A*Total Amount: GH₵ ${totalPrice}*%0A%0ACompany: Scentiva Aura %0AContact me for delivery details.`;
    
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-parchment/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-parchment/10 flex justify-between items-center bg-elevated">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gold-oud" size={20} />
                <h2 className="text-sm uppercase tracking-[0.3em] text-parchment font-bold">Your Bag ({totalItems})</h2>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="text-[10px] uppercase tracking-widest text-parchment/30 hover:text-rose-400 px-3 py-1 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-parchment/10 rounded-full transition-colors text-parchment/50 hover:text-parchment">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="text-sm uppercase tracking-widest font-serif">Your bag is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative w-24 h-28 flex-shrink-0 bg-parchment/5 overflow-hidden rounded-sm">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-serif text-parchment">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-parchment/30 hover:text-rose-400 uppercase tracking-widest">Remove</button>
                          </div>
                          <p className="text-xs text-gold-oud mt-1">GH₵ {item.price}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-parchment/10 rounded-sm">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 hover:bg-parchment/5 text-parchment/60"><Minus size={12} /></button>
                            <span className="text-xs px-2 text-parchment font-medium min-w-[24px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 hover:bg-parchment/5 text-parchment/60"><Plus size={12} /></button>
                          </div>
                          <p className="text-sm font-bold text-parchment">GH₵ {item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-parchment/10 bg-elevated space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-[0.2em] text-parchment/40">Estimated Total</span>
                  <span className="text-2xl font-serif text-gold-oud">GH₵ {totalPrice}</span>
                </div>
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-gold-oud text-deep-noir py-5 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-parchment transition-all duration-500 rounded-sm shadow-xl group"
                >
                  <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                  Order via WhatsApp
                </button>
                <p className="text-[10px] text-center text-parchment/30 uppercase tracking-widest">
                  Secure checkout • Delivery calculated on chat
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
