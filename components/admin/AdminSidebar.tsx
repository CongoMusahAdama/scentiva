"use client";

import { useAdmin, AdminPage } from "@/context/AdminContext";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Star, Share2, Settings, ChevronLeft, ChevronRight, FileText, X, LogOut
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const menuItems: { id: AdminPage; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { id: "products", label: "Products", icon: <Package size={17} /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag size={17} /> },
  { id: "customers", label: "Customers", icon: <Users size={17} /> },
  { id: "reviews", label: "Reviews", icon: <Star size={17} /> },
  { id: "referrals", label: "Referrals", icon: <Share2 size={17} /> },
  { id: "settings", label: "Settings", icon: <Settings size={17} /> },
  { id: "receipts", label: "Receipts", icon: <FileText size={17} /> },
];

export default function AdminSidebar() {
  const { activePage, setActivePage, sidebarCollapsed, setSidebarCollapsed, setMobileSidebarOpen } = useAdmin();

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 shrink-0 shadow-2xl lg:shadow-none"
      style={{
        width: sidebarCollapsed ? "80px" : "260px",
        background: "#FFFFFF",
        borderRight: "1px solid #E8E9EC",
      }}
    >
      {/* Logo Area */}
      <div
        className="flex items-center justify-between px-6"
        style={{ borderBottom: "1px solid #F0F1F4", minHeight: "80px" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-[#D8B34B]/10 border border-[#D8B34B]/20 flex items-center justify-center">
             <span className="text-[#D8B34B] font-bold text-lg">S</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-lora font-bold text-[#1A1B23] text-[14px] tracking-widest uppercase">Scentiva</span>
              <span className="font-poppins text-[10px] text-[#D8B34B] tracking-[.25em] -mt-1">AURA</span>
            </div>
          )}
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-2 text-[#9CA3AF] hover:text-[#1A1B23]"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`group flex items-center gap-4 rounded-xl transition-all duration-150 relative ${
                active ? "bg-[#D8B34B]/10 text-[#D8B34B]" : "text-[#9CA3AF] hover:text-[#1A1B23] hover:bg-[#F5F6FA]"
              }`}
              style={{
                padding: "12px",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                cursor: "pointer",
                border: "none",
                width: "100%",
              }}
            >
              <span className={`${active ? "text-[#D8B34B]" : "group-hover:text-[#1A1B23]"} transition-colors`}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span className={`font-poppins text-[13px] tracking-wide ${active ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
              )}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-1/2 bg-[#D8B34B] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Collapse Toggle (Desktop only) */}
      <div className="p-4 mt-auto border-t border-[#F0F1F4] hidden lg:block">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full py-2.5 rounded-xl bg-[#F5F6FA] border border-[#E8E9EC] text-[#9CA3AF] hover:text-[#1A1B23] transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!sidebarCollapsed && <span className="ml-2 text-xs font-semibold uppercase tracking-wider">Collapse</span>}
        </button>
      </div>
      
      {/* Logout */}
      <div className="p-4 border-t border-[#F0F1F4] lg:hidden">
         <button className="flex items-center gap-3 w-full p-3 text-[#9CA3AF] hover:text-[#1A1B23] transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
         </button>
      </div>
    </aside>
  );
}
