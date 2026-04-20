"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Lock, ArrowRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function SigninPage() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing in with:", formData);
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 md:p-8 font-poppins">
      <div className="w-full max-w-[1000px] h-[600px] bg-white flex shadow-2xl overflow-hidden rounded-none border border-[#1A1B23]/5">
        
        {/* Left Side: Branding & Toggles */}
        <div className="hidden md:flex w-[35%] bg-[#1A1B23] relative flex-col items-center justify-center text-white overflow-hidden">
          {/* Decorative shapes (no images) */}
          <div className="absolute top-0 right-0 w-24 h-full bg-white/5 skew-x-[-15deg] translate-x-12" />
          <div className="absolute top-0 right-0 w-12 h-full bg-gold-oud/20 skew-x-[-15deg] translate-x-6" />
          
          {/* Logo / Brand Name */}
          <div className="z-10 text-center">
            <h2 className="font-lora text-3xl font-bold tracking-[0.2em] mb-1">SCENTIVA</h2>
            <p className="text-gold-oud text-[10px] uppercase tracking-[0.4em] font-medium">AURA</p>
          </div>

          {/* Side Tabs (Inspired by the image) */}
          <div className="absolute bottom-12 right-0 flex flex-col items-end gap-2 w-full pr-6">
            <div className="bg-[#F9F7F2] text-[#1A1B23] px-8 py-3 rounded-l-full font-bold text-xs uppercase tracking-widest shadow-lg translate-x-3">
              Sign In
            </div>
            <Link href="/signup" className="text-white/40 hover:text-white px-8 py-3 font-bold text-xs uppercase tracking-widest transition-colors mr-3">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col p-8 md:p-16 relative">
          <Link href="/" className="absolute top-8 left-8 text-[#1A1B23]/40 hover:text-[#1A1B23] flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors">
            <ChevronLeft size={14} /> Back to Shop
          </Link>

          <div className="mt-auto mb-auto w-full max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Image 
                  src="/01_primary_logo_transparent.png" 
                  alt="Scentiva Aura Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="font-lora text-4xl text-[#1A1B23] font-bold mb-2">Welcome Back</h1>
              <p className="text-[#9CA3AF] text-sm font-medium uppercase tracking-widest">Sign in to your private boutique</p>
            </div>

            <form onSubmit={handleSignin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1A1B23]/40 uppercase tracking-[0.2em] ml-1">WhatsApp Number</label>
                <div className="relative group">
                  <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D8B34B] transition-colors" size={18} />
                  <input 
                    type="tel"
                    placeholder="+233 24 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-[#F0F1F4] focus:border-[#1A1B23] outline-none text-[15px] transition-colors font-medium text-[#1A1B23]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center pr-1">
                  <label className="text-[10px] font-bold text-[#1A1B23]/40 uppercase tracking-[0.2em] ml-1">Password</label>
                  <Link href="#" className="text-[9px] font-bold text-gold-oud uppercase tracking-widest hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D8B34B] transition-colors" size={18} />
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-[#F0F1F4] focus:border-[#1A1B23] outline-none text-[15px] transition-colors font-medium text-[#1A1B23]"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-8 bg-[#1A1B23] text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#2A2B35] transition-all group shadow-xl"
              >
                Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Mobile Toggle */}
            <div className="md:hidden mt-8 text-center pt-8 border-t border-[#F0F1F4]">
               <p className="text-xs text-[#9CA3AF] uppercase tracking-widest">
                 New to the concierge?{" "}
                 <Link href="/signup" className="text-gold-oud font-bold hover:underline ml-1">
                   Create Account
                 </Link>
               </p>
            </div>
          </div>
          
          <div className="mt-auto pt-8 flex items-center justify-center gap-8 border-t border-[#F0F1F4]">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 cursor-pointer">
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1B23]">Google</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 cursor-pointer">
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1B23]">Apple</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
