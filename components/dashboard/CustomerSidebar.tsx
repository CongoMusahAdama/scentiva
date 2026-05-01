"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, ShoppingBag, Heart, Sparkles, 
  Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, Star 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { showConfirm } from "@/lib/swal";

const menuItems = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
  { id: "reviews", label: "Reviews", icon: <Star size={18} /> },
  { id: "assistant", label: "Aura AI", icon: <Sparkles size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function CustomerSidebar({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await showConfirm(
      "Confirm Logout",
      "Are you sure you want to end your session?",
      "Yes, sign out"
    );
    if (result.isConfirmed) {
      logout();
    }
  };

  const LogoArea = () => (
    <div 
      className="flex items-center justify-between px-6 border-b border-[#F0F1F4]"
      style={{ minHeight: "80px" }}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className={`relative ${collapsed ? 'w-10' : 'w-32'} h-10 transition-all`}>
          <Image 
            src="/01_primary_logo_transparent.png" 
            alt="Scentiva Logo" 
            fill 
            priority
            sizes="(max-width: 768px) 100vw, 128px"
            className="object-contain" 
          />
        </div>
      </Link>
      <button 
        onClick={() => setMobileOpen(false)}
        className="lg:hidden p-2 text-gray-400 hover:text-gray-900"
      >
        <X size={20} />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-3 bg-white border border-[#E8E9EC] text-gray-900"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-[55] bg-white border-r border-[#E8E9EC] flex flex-col transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ width: collapsed ? "88px" : "280px" }}
      >
        <LogoArea />

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`group flex items-center gap-4 p-4 transition-all relative ${
                  active 
                    ? "bg-[#D8B34B]/10 text-[#D8B34B]" 
                    : "text-[#9CA3AF] hover:text-[#1A1B23] hover:bg-[#F5F6FA]"
                }`}
                style={{ borderRadius: "0px" }}
              >
                <span className={`${active ? "text-[#D8B34B]" : "text-[#9CA3AF] group-hover:text-[#1A1B23]"}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className={`text-[12px] font-bold uppercase tracking-widest ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {item.label}
                  </span>
                )}
                {active && !collapsed && (
                  <motion.div 
                    layoutId="active-marker"
                    className="absolute left-0 w-1 h-3/5 bg-[#D8B34B]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#F0F1F4] p-2 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-4 w-full p-4 text-[#9CA3AF] hover:text-[#1A1B23] transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Collapse</span>}
          </button>
          
          <button onClick={handleLogout} className="flex items-center gap-4 w-full p-4 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={18} />
            {!collapsed && <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
