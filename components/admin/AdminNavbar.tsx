"use client";

import { useAdmin, AdminPage } from "@/context/AdminContext";
import { Bell, Search, ChevronDown, X, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const pageTitles: Record<AdminPage, string> = {
  dashboard: "Dashboard", products: "Products", orders: "Orders",
  customers: "Customers", reviews: "Reviews", referrals: "Referrals", settings: "Settings",
};
const pageSubtitles: Record<AdminPage, string> = {
  dashboard: "Overview & key metrics",
  products: "Manage your fragrance catalogue",
  orders: "Track and update customer orders",
  customers: "View your customer base",
  reviews: "Approve or reject customer feedback",
  referrals: "Monitor referral activity and rewards",
  settings: "Configure your store settings",
};

export default function AdminNavbar() {
  const { activePage, setMobileSidebarOpen } = useAdmin();
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30"
      style={{ height: "80px", background: "#FFFFFF", borderBottom: "1px solid #F0F1F4", gap: "16px" }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-xl bg-[#F5F6FA] border border-[#E8E9EC] text-[#1A1B23]"
        >
          <Menu size={18} />
        </button>

        {/* Title */}
        <div className="flex flex-col justify-center">
          <h1 className="font-lora font-bold text-[#1A1B23] text-[16px] md:text-[20px] leading-tight capitalize">
            {pageTitles[activePage]}
          </h1>
          <p className="hidden md:block font-poppins text-[11px] text-[#9CA3AF] tracking-wide mt-0.5">
            {pageSubtitles[activePage]}
          </p>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Search - Icon only on mobile */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-[#F5F6FA] border border-[#E8E9EC] w-10 h-10 md:w-auto md:h-auto">
          <Search size={15} className="text-[#9CA3AF] shrink-0" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search…"
            className="bg-transparent outline-none flex-1 min-w-0 hidden md:block font-poppins text-[13px] text-[#1A1B23]"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative flex items-center justify-center rounded-xl transition-all duration-150 w-10 h-10 border border-[#E8E9EC] cursor-pointer ${
              notifOpen ? "bg-[#EFF0F3] text-[#1A1B23]" : "bg-[#F5F6FA] text-[#6B7280] hover:text-[#1A1B23]"
            }`}
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#D8B34B] border-2 border-white" />
          </button>
          
          <AnimatePresence>
            {notifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-72 md:w-80 z-50 bg-[#FFFFFF] border border-[#E8E9EC] rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F1F4]">
                  <p className="text-[13px] font-bold text-[#1A1B23]">Notifications</p>
                  <span className="text-[10px] text-[#D8B34B] bg-[#D8B34B]/10 border border-[#D8B34B]/20 px-2 py-0.5 rounded-full font-bold">3 NEW</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {[
                    { title: "New order received", sub: "Order #SA-1042 · 2 min ago" },
                    { title: "Product low on stock", sub: "Oud Royale — 8 units left" },
                    { title: "New review pending", sub: "Awaiting your approval" },
                  ].map((n, i, arr) => (
                    <div key={i} className={`p-4 cursor-pointer hover:bg-[#F8F9FA] transition-colors flex items-start gap-3 ${i < arr.length - 1 ? "border-b border-[#F0F1F4]" : ""}`}>
                      <div className="w-2 h-2 rounded-full bg-[#D8B34B] mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-medium text-[#1A1B23]">{n.title}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-1">{n.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-[11px] font-bold tracking-widest text-[#D8B34B] hover:bg-[#D8B34B]/5 transition-colors uppercase">
                  View All Activity
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-[#F0F1F4]">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[13px] font-bold text-[#1A1B23]">Admin</span>
            <span className="text-[10px] text-[#D8B34B] font-medium uppercase tracking-[.1em]">Head Curator</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D8B34B]/5 border border-[#E8E9EC] flex items-center justify-center">
            <span className="text-[#D8B34B] font-bold text-[14px]">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
