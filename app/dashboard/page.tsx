"use client";

import React, { useState, useEffect } from "react";
import CustomerSidebar from "@/components/dashboard/CustomerSidebar";
import OrdersSection from "@/components/dashboard/OrdersSection";
import WishlistSection from "@/components/dashboard/WishlistSection";
import ReviewsSection from "@/components/dashboard/ReviewsSection";
import ScentAssistant from "@/components/dashboard/ScentAssistant";
import ProfileSection from "@/components/dashboard/profile/ProfileSection";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User } from "lucide-react";
import Image from "next/image";
import ProductModal from "@/components/ProductModal";
import type { Product } from "@/lib/types/product";



import { OrderService } from "@/lib/services/order.service";
import { WishlistService } from "@/lib/services/wishlist.service";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    if (user?.phone) {
      fetchOverviewData();
    }
  }, [user]);

  const fetchOverviewData = async () => {
    try {
      const [orders, wishlist] = await Promise.all([
        OrderService.fetchAll(user?.phone),
        WishlistService.getWishlist()
      ]);
      setStats({
        orders: orders.length,
        wishlist: wishlist.length
      });
    } catch (err) {
      console.error("Overview fetch error:", err);
    }
  };

  const handleViewProduct = (product: any) => setSelectedProduct(product);

  const RenderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent onViewProduct={handleViewProduct} stats={stats} setActiveTab={setActiveTab} />;
      case "orders":
        return <OrdersSection />;
      case "wishlist":
        return <WishlistSection onViewProduct={handleViewProduct} />;
      case "reviews":
        return <ReviewsSection />;
      case "assistant":
        return <ScentAssistant onViewProduct={handleViewProduct} />;
      case "settings":
        return <ProfileSection />;
      default:
        return <OverviewContent onViewProduct={handleViewProduct} stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-900 selection:bg-gold-oud/20">
      {/* Sidebar Navigation */}
      <CustomerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 md:px-10 flex justify-between items-center">
          <div className="flex items-center gap-4 text-gray-400">
             <div className="hidden md:flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 border border-[#E8E9EC]">
                <Search size={14} />
                <input type="text" placeholder="Search orders..." className="bg-transparent border-none outline-none text-[12px] w-48 text-gray-900 placeholder:text-gray-400" />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-gray-900 transition-colors">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-gray-900">{user?.fullName || "Aura Guest"}</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Gold Member</p>
              </div>
              <div className="w-8 h-8 rounded-lg outline outline-2 outline-gold-oud/20 bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                {user?.profileImage ? (
                  <Image src={user.profileImage} alt="Avatar" width={32} height={32} className="object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 md:p-10 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {RenderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}

// --- Sub-components for Overview ---

const OverviewContent = ({ onViewProduct, stats, setActiveTab }: { onViewProduct: (p: any) => void, stats: any, setActiveTab: (tab: string) => void }) => (
  <div className="space-y-10">
    <div className="border-b border-gray-100 pb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-1">Account Overview</h1>
        <p className="text-gray-400 text-sm">Review your activity and recommendations.</p>
    </div>

    {/* Quick Stats (Admin Style) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Recent Orders" value={stats.orders.toString()} subLabel="Live from backend" color="#1A1B23" />
      <StatCard label="Wishlist Items" value={stats.wishlist.toString()} subLabel="Saved fragrances" color="#D8B34B" />
      <StatCard label="Quiz Results" value="1" subLabel="Latest: Oud Noir" color="#A855F7" />
      <StatCard label="Aura Points" value="1,250" subLabel="Gold status" color="#F5F6FA" textColor="#1A1B23" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1B23]">Recent Orders</h3>
                <button className="text-[11px] font-bold text-gold-oud uppercase tracking-wider">View All</button>
            </div>
            <OrdersSection />
        </div>
        <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1B23]">Scent Assistant</h3>
            <div className="bg-white border border-[#E8E9EC] p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#F5F6FA] flex items-center justify-center mb-6">
                    <User size={24} className="text-[#9CA3AF]" />
                </div>
                <h4 className="text-lg font-serif text-gray-900 mb-3">Find Your Signature</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-8">Personalized matching based on your lifestyle and preferences.</p>
                <button 
                  onClick={() => setActiveTab("assistant")}
                  className="w-full bg-[#1A1B23] text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                >
                    Start Assistant
                </button>
            </div>
        </div>
    </div>
  </div>
);

const StatCard = ({ label, value, subLabel, color, textColor = "#FFFFFF" }: any) => (
  <div
    className="p-5 flex flex-col justify-between"
    style={{ background: color, minHeight: "110px", borderRadius: "0px", border: textColor !== "#FFFFFF" ? "1px solid #E8E9EC" : "none" }}
  >
    <p style={{ fontSize: "11px", color: `${textColor}${textColor === "#FFFFFF" ? "cc" : ""}`, fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {label}
    </p>
    <div>
      <p style={{ fontSize: "28px", fontFamily: "var(--font-lora, serif)", color: textColor, fontWeight: 700, lineHeight: 1.1 }}>
        {value}
      </p>
      {subLabel && (
        <p style={{ fontSize: "10px", color: `${textColor}${textColor === "#FFFFFF" ? "99" : ""}`, fontFamily: "var(--font-poppins, sans-serif)", marginTop: "4px", fontWeight: 500 }}>
          {subLabel}
        </p>
      )}
    </div>
  </div>
);

