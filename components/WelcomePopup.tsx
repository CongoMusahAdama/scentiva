"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeen = sessionStorage.getItem("sva_welcome_seen");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem("sva_welcome_seen", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Popup Content (Inspired by the circular wooden sign) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-[400px] aspect-square rounded-full bg-[#1A1A1D] border-4 border-parchment/5 flex flex-col items-center justify-center text-center shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_60px_rgba(212,175,55,0.05)] overflow-hidden group"
          >
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />
            
            <button 
              onClick={closePopup}
              className="absolute top-10 right-10 text-parchment/30 hover:text-gold-oud transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 space-y-2">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="block text-4xl md:text-5xl font-serif text-parchment italic"
              >
                Hello
              </motion.span>
              
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="block text-xs uppercase tracking-[0.6em] text-gold-oud/60 font-bold"
              >
                WE ARE
              </motion.span>
              
              <motion.span 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="block text-5xl md:text-7xl font-serif text-parchment"
              >
                Open
              </motion.span>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={closePopup}
              className="mt-8 px-8 py-3 bg-gold-oud text-deep-noir text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-parchment transition-all duration-300 shadow-lg"
            >
              Enter Boutique
            </motion.button>

            {/* Decorative Rope (Simulated with div) */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-px h-20 bg-parchment/20" />
            <div className="absolute -top-12 left-1/2 -translate-x-[40px] w-px h-20 bg-parchment/10 rotate-[20deg]" />
            <div className="absolute -top-12 left-1/2 -translate-x-[-40px] w-px h-20 bg-parchment/10 -rotate-[20deg]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
