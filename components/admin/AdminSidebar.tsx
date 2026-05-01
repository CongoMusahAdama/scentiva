"use client";

import { useAdmin, AdminPage } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Star, Share2, Settings, ChevronLeft, ChevronRight, FileText, X, LogOut, ExternalLink
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { showConfirm } from "@/lib/swal";
import Link from "next/link";

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
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await showConfirm(
      "Confirm Logout",
      "Are you sure you want to sign out of the admin panel?",
      "Yes, sign out"
    );
    if (result.isConfirmed) {
      logout();
    }
  };

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
          <div className={`relative ${sidebarCollapsed ? 'w-10' : 'w-32'} h-10 overflow-hidden flex-shrink-0 flex items-center transition-all`}>
            <Image 
              src={sidebarCollapsed ? "/01_primary_logo_transparent.png" : "/01_primary_logo_transparent.png"} 
              alt="Logo" 
              width={128} 
              height={40} 
              className="object-contain" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Sidebar Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2 text-[#9CA3AF] hover:text-[#D8B34B] hover:bg-[#F5F6FA] rounded-lg transition-all"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-2 text-[#9CA3AF] hover:text-[#1A1B23]"
          >
            <X size={20} />
          </button>
        </div>
      </div>


      {/* Navigation */}
      <nav className="flex-1 py-4 px-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
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
                padding: "10px 12px",
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

      <div className="flex flex-col border-t border-[#F0F1F4] mt-auto">
        <div className="px-4 pt-4 pb-1">
          <Link href="/shop" className={`flex items-center gap-4 w-full p-3 rounded-xl transition-colors text-[#9CA3AF] hover:bg-[#F5F6FA] hover:text-[#1A1B23] ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <ExternalLink size={17} />
            {!sidebarCollapsed && <span className="text-[13px] font-medium font-poppins">View Storefront</span>}
          </Link>
        </div>
        {/* Logout (Both Mobile and Desktop) */}
        <div className="px-4 py-2 mb-2">
          <button onClick={handleLogout} className={`flex items-center gap-4 w-full p-3 rounded-xl transition-colors text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut size={17} />
            {!sidebarCollapsed && <span className="text-[13px] font-medium font-poppins">Logout</span>}
          </button>
        </div>
      </div>


    </aside>
  );
}
