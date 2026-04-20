"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// PREMIUM COLORS (LIGHT THEME)
export const COLORS = {
  primary: "#D8B34B", // Gold-Oud
  bg: "#F5F6FA",
  surface: "#FFFFFF",
  text: "#1A1B23",
  textMuted: "#9CA3AF",
  border: "#E8E9EC",
  success: "#10B981",
  error: "#EF4444",
};

// COMMON TRANSITION
const SPRING_TRANSITION = { type: "spring", stiffness: 300, damping: 30 };

// --- CARDS ---
export function AdminCard({ children, title, action, noPadding, className }: { children: ReactNode; title?: string; action?: ReactNode; noPadding?: boolean; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-[#E8E9EC] overflow-hidden ${className || ""}`}
      style={{ borderRadius: "0px" }}
    >
      {(title || action) && (
        <div className="px-5 py-4 md:px-8 md:py-6 border-b border-[#F0F1F4] flex items-center justify-between">
          {title && <h3 className="font-lora font-bold text-[14px] md:text-[16px] text-[#1A1B23] tracking-widest uppercase">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5 md:p-8"}>{children}</div>
    </motion.div>
  );
}

// --- TABLES ---
export function AdminTable({ 
  headers, 
  children,
  mobileCards
}: { 
  headers: string[]; 
  children: ReactNode;
  mobileCards?: ReactNode; // Alternative view for mobile
}) {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className={`${mobileCards ? 'hidden lg:block' : 'block'} overflow-x-auto custom-scrollbar`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#F0F1F4]">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-5 text-left font-poppins text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[.2em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F1F4] font-poppins text-[13px] text-[#374151]">
            {children}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      {mobileCards && (
        <div className="lg:hidden flex flex-col gap-4">
          {mobileCards}
        </div>
      )}
    </div>
  );
}

export function AdminTableRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tr className={`group hover:bg-[#F8F9FA] transition-colors ${className || ""}`}>{children}</tr>
  );
}

export function AdminTableCell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-6 py-5 ${className || ""}`}>
      {children}
    </td>
  );
}

// --- MOBILE CARD ITEM ---
export function AdminMobileCard({ 
  title, 
  subtitle, 
  status, 
  details, 
  actions,
  image
}: { 
  title: string; 
  subtitle?: string; 
  status?: ReactNode; 
  details: { label: string; value: ReactNode }[]; 
  actions?: ReactNode;
  image?: ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E8E9EC] p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {image && <div className="shrink-0">{image}</div>}
          <div>
            <h4 className="font-lora font-bold text-[15px] text-[#1A1B23]">{title}</h4>
            {subtitle && <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5 uppercase tracking-wider">{subtitle}</p>}
          </div>
        </div>
        {status && <div className="shrink-0">{status}</div>}
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b border-[#F0F1F4] py-4">
        {details.map((d, i) => (
          <div key={i}>
            <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-widest">{d.label}</p>
            <div className="text-[12px] font-medium text-[#374151] mt-1">{d.value}</div>
          </div>
        ))}
      </div>

      {actions && (
        <div className="flex items-center gap-2 mt-1">
          {actions}
        </div>
      )}
    </div>
  );
}

// --- BUTTONS ---
export function AdminButton({
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  icon,
  className,
  disabled,
  type = "button"
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const variants = {
    primary: "bg-[#D8B34B] text-white hover:bg-[#B8942A]",
    secondary: "bg-[#1A1B23] text-white hover:bg-black",
    outline: "bg-transparent border border-[#E8E9EC] text-[#374151] hover:bg-[#F5F6FA]",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
    ghost: "bg-transparent text-[#9CA3AF] hover:text-[#1A1B23] hover:bg-[#F5F6FA]",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-[12px]",
    lg: "px-8 py-4 text-[13px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-poppins font-bold tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className || ""}`}
      style={{ borderRadius: "0px" }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// --- INPUTS ---
export function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  className,
  ...props
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      {label && <label className="font-poppins text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[.15em]">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 bg-[#F9FAFB] border ${error ? "border-[#EF4444]" : "border-[#E8E9EC] focus:border-[#D8B34B] focus:bg-white"} outline-none font-poppins text-[13px] text-[#1A1B23] transition-all duration-200 placeholder:text-[#9CA3AF]`}
        style={{ borderRadius: "0px" }}
        {...props}
      />
      {error && <span className="text-[10px] text-[#EF4444] font-medium uppercase tracking-tight">{error}</span>}
    </div>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  className,
  rows = 4,
  ...props
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  rows?: number;
  [key: string]: any;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      {label && <label className="font-poppins text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[.15em]">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3.5 bg-[#F9FAFB] border ${error ? "border-[#EF4444]" : "border-[#E8E9EC] focus:border-[#D8B34B] focus:bg-white"} outline-none font-poppins text-[13px] text-[#1A1B23] transition-all duration-200 placeholder:text-[#9CA3AF] resize-none`}
        style={{ borderRadius: "0px" }}
        {...props}
      />
      {error && <span className="text-[10px] text-[#EF4444] font-medium uppercase tracking-tight">{error}</span>}
    </div>
  );
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  error,
  className,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      {label && <label className="font-poppins text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[.15em]">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3.5 bg-[#F9FAFB] border ${error ? "border-[#EF4444]" : "border-[#E8E9EC] focus:border-[#D8B34B] focus:bg-white"} outline-none font-poppins text-[13px] text-[#1A1B23] transition-all duration-200 appearance-none`}
        style={{ borderRadius: "0px" }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-[10px] text-[#EF4444] font-medium tracking-tight whitespace-nowrap">{error}</span>}
    </div>
  );
}

// --- STATUS BADGE ---
export function Badge({ variant, label }: { variant: string; label: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    delivered: "bg-blue-50 text-blue-600 border-blue-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
    "out-of-stock": "bg-rose-50 text-rose-600 border-rose-100",
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full inline-block ${styles[variant.toLowerCase()] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {label}
    </span>
  );
}

// --- MODAL ---
export function AdminModal({ 
  isOpen, 
  open,
  onClose, 
  title, 
  children,
  width = "670px" 
}: { 
  isOpen?: boolean; 
  open?: boolean;
  onClose: () => void; 
  title: string; 
  children: ReactNode;
  width?: string;
}) {
  const isModalOpen = isOpen || open;
  
  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full shadow-3xl overflow-hidden"
            style={{ borderRadius: "0px", maxWidth: width }}
          >
            <div className="px-6 py-5 md:px-10 md:py-8 border-b border-[#F0F1F4] flex items-center justify-between">
              <h2 className="font-lora font-bold text-[18px] md:text-[22px] text-[#1A1B23] tracking-widest uppercase">{title}</h2>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F6FA] text-[#9CA3AF] hover:text-[#1A1B23] transition-all text-2xl"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-8 md:px-10 md:py-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- PAGINATION ---
export function AdminPagination({ 
  currentPage, 
  totalItems, 
  pageSize, 
  onPageChange 
}: { 
  currentPage: number; 
  totalItems: number; 
  pageSize: number; 
  onPageChange: (page: number) => void; 
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-[#F0F1F4]">
      <p className="font-poppins text-[11px] text-[#9CA3AF] tracking-wide uppercase font-medium">
        Showing <span className="text-[#1A1B23] font-bold">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-[#1A1B23] font-bold">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="text-[#1A1B23] font-bold">{totalItems}</span> results
      </p>
      
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest border border-[#E8E9EC] hover:bg-[#F5F6FA] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        
        <div className="flex items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-10 h-10 text-[11px] font-bold transition-all ${
                        currentPage === p 
                        ? "bg-[#D8B34B] text-white" 
                        : "text-[#9CA3AF] hover:text-[#1A1B23] hover:bg-[#F5F6FA]"
                    }`}
                >
                    {p}
                </button>
            ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest border border-[#E8E9EC] hover:bg-[#F5F6FA] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
