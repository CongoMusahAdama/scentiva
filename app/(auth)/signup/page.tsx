"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Lock, User, ArrowRight, ChevronLeft, Check } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    consent: false
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing up with:", formData);
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 md:p-8 font-poppins">
      <div className="w-full max-w-[1000px] h-[650px] bg-white flex shadow-2xl overflow-hidden rounded-none border border-[#1A1B23]/5">
        
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
            <Link href="/signin" className="text-white/40 hover:text-white px-8 py-3 font-bold text-xs uppercase tracking-widest transition-colors mr-3">
              Sign In
            </Link>
            <div className="bg-[#F9F7F2] text-[#1A1B23] px-8 py-3 rounded-l-full font-bold text-xs uppercase tracking-widest shadow-lg translate-x-3">
              Sign Up
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col p-8 md:p-12 relative overflow-y-auto custom-scrollbar">
          <Link href="/" className="absolute top-8 left-8 text-[#1A1B23]/40 hover:text-[#1A1B23] flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors">
            <ChevronLeft size={14} /> Back to Shop
          </Link>

          <div className="my-auto w-full max-w-md mx-auto">
            <div className="text-center mb-8 pt-6">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <Image 
                  src="/01_primary_logo_transparent.png" 
                  alt="Scentiva Aura Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="font-lora text-3xl text-[#1A1B23] font-bold mb-2">Create Your Aura</h1>
              <p className="text-[#9CA3AF] text-[10px] font-medium uppercase tracking-[0.2em]">Craft your signature profile</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1A1B23]/40 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D8B34B]" size={16} />
                  <input 
                    type="text"
                    placeholder="Amara Okoro"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-[#F0F1F4] focus:border-[#1A1B23] outline-none text-[14px] transition-colors font-medium text-[#1A1B23]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1A1B23]/40 uppercase tracking-[0.2em] ml-1">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D8B34B]" size={16} />
                  <input 
                    type="tel"
                    placeholder="+233 24 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-[#F0F1F4] focus:border-[#1A1B23] outline-none text-[14px] transition-colors font-medium text-[#1A1B23]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1A1B23]/40 uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D8B34B]" size={16} />
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-[#F0F1F4] focus:border-[#1A1B23] outline-none text-[14px] transition-colors font-medium text-[#1A1B23]"
                    required
                  />
                </div>
              </div>

              {/* Consent Bridge */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className={`mt-0.5 w-4 h-4 border transition-colors flex items-center justify-center shrink-0 ${formData.consent ? "bg-gold-oud border-gold-oud" : "border-[#E8E9EC] bg-[#F9F7F2]"}`}>
                    {formData.consent && <Check size={10} className="text-deep-noir font-bold" />}
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={formData.consent}
                      onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    />
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-medium leading-relaxed font-poppins">
                    I agree to be added to the <span className="text-[#1A1B23] font-bold">Scentiva Aura WhatsApp Community</span> for exclusive updates, private offers, and luxury fragrance tips.
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-[#1A1B23] text-white py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#2A2B35] transition-all group shadow-xl"
              >
                Create Profile <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-[#F0F1F4]">
               <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-medium">
                 Already have an account?{" "}
                 <Link href="/signin" className="text-gold-oud font-bold hover:underline ml-1">
                   Sign In here
                 </Link>
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
