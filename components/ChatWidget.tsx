"use client";

import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "233203154307";
  const phone = "0203154307";

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-7 sm:right-7 z-[1000] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            className="w-[240px] bg-elevated border border-parchment/10 rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(26,27,35,0.12)]"
          >
            <div className="px-[18px] pt-[18px] pb-3 border-b border-parchment/10 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3.5 right-3.5 text-parchment/30 hover:text-parchment flex"
                aria-label="Close support chat"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full bg-gold-oud/10 border border-gold-oud/25 flex items-center justify-center">
                  <MessageCircle size={15} className="text-gold-oud" />
                </div>
                <div>
                  <p className="text-xs font-bold text-parchment leading-tight">Aura Support</p>
                  <p className="text-[10px] text-gold-oud tracking-wide">We reply instantly</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 flex flex-col gap-2">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gold-oud text-deep-noir rounded-[10px] py-2.5 text-[11px] font-bold tracking-wide uppercase no-underline hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={13} fill="currentColor" /> WhatsApp
              </a>
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 bg-parchment/5 text-parchment border border-parchment/10 rounded-[10px] py-2.5 text-[11px] font-semibold tracking-wide uppercase no-underline hover:bg-parchment/10 transition-colors"
              >
                <Phone size={13} /> Call Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        animate={open ? { scale: 1 } : undefined}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full cursor-pointer shadow-lg transition-colors ${
          open
            ? "bg-elevated border border-parchment/15 text-parchment"
            : "bg-gold-oud text-deep-noir shadow-[0_8px_28px_rgba(216,179,75,0.38)]"
        }`}
        aria-label={open ? "Close Aura Support" : "Open Aura Support"}
      >
        {open ? (
          <X size={18} className="text-smoke flex-shrink-0" />
        ) : (
          <MessageCircle size={18} className="flex-shrink-0" fill="currentColor" />
        )}
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
          Aura Support
        </span>
      </motion.button>
    </div>
  );
}
