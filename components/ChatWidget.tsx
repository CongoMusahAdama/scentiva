"use client";

import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const whatsapp = "233506626068";
  const phone = "0506626068";

  return (
    <div className="fixed bottom-7 right-7 z-[1000] flex flex-col items-end gap-3">
      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            style={{
              width: "240px",
              background: "#0D0D0F",
              border: "1px solid rgba(216,179,75,0.15)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
            }}
          >
            {/* Header */}
            <div style={{ padding: "18px 18px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
              <button
                onClick={() => setOpen(false)}
                style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", display: "flex" }}
              >
                <X size={14} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "rgba(216,179,75,0.1)", border: "1px solid rgba(216,179,75,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MessageCircle size={15} style={{ color: "#D8B34B" }} />
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#FFF4DE", fontFamily: "var(--font-poppins, sans-serif)", lineHeight: 1.2 }}>
                    Aura Support
                  </p>
                  <p style={{ fontSize: "10px", color: "#D8B34B", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.05em" }}>
                    We reply instantly
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: "14px 14px" , display: "flex", flexDirection: "column", gap: "8px" }}>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: "#D8B34B", color: "#0D0D0F",
                  borderRadius: "10px", padding: "11px",
                  fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-poppins, sans-serif)",
                  letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <MessageCircle size={13} fill="#0D0D0F" /> WhatsApp
              </a>
              <a
                href={`tel:${phone}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: "rgba(255,255,255,0.05)", color: "#C4C4C6",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", padding: "11px",
                  fontSize: "11px", fontWeight: 600, fontFamily: "var(--font-poppins, sans-serif)",
                  letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                <Phone size={13} /> Call Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button with pulse + bounce */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        animate={open ? { scale: 1 } : {
          y: [0, -5, 0],
          transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 },
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        style={{
          width: "50px", height: "50px", borderRadius: "50%",
          background: open ? "#1A1A1E" : "#D8B34B",
          border: open ? "1px solid #2A2A2E" : "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "none" : "0 8px 28px rgba(216,179,75,0.38)",
          position: "relative",
        }}
      >
        {/* Pulse ring */}
        {!open && (
          <motion.span
            animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", repeatDelay: 1.5 }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid #D8B34B", pointerEvents: "none",
            }}
          />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={18} style={{ color: "#6B6C72" }} />
            </motion.span>
          ) : (
            <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={20} style={{ color: "#0D0D0F" }} fill="#0D0D0F" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
