"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Lock, User, Mail, ArrowRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

function SignupContent() {
  const { signup } = useAuth();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || undefined;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    consent: false
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Passwords do not match',
        confirmButtonColor: '#1A1B23'
      });
      return;
    }

    if (!formData.consent) {
      Swal.fire({
        icon: 'warning',
        title: 'Consent Required',
        text: 'Please agree to the terms to continue',
        confirmButtonColor: '#1A1B23'
      });
      return;
    }

    setLoading(true);
    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        returnTo,
      });
      Swal.fire({
        icon: 'success',
        title: 'Profile Created!',
        text: 'A verification code has been generated and sent to your email/phone.',
        confirmButtonColor: '#1A1B23'
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message || "Registration failed",
        confirmButtonColor: '#1A1B23'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 md:p-8 font-poppins">
      <div className="w-full max-w-[1000px] h-[650px] bg-white flex shadow-2xl overflow-hidden rounded-none border border-[#1A1B23]/5">
        
        {/* Left Side: Branding & Toggles */}
        <div className="hidden md:flex w-[35%] bg-[#1A1B23] relative flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-full bg-white/5 skew-x-[-15deg] translate-x-12" />
          <div className="absolute top-0 right-0 w-12 h-full bg-gold-oud/20 skew-x-[-15deg] translate-x-6" />
          
          <div className="z-10 text-center">
            <h2 className="font-lora text-3xl font-bold tracking-[0.2em] mb-1">SCENTIVA</h2>
            <p className="text-gold-oud text-[10px] uppercase tracking-[0.4em] font-medium">AURA</p>
          </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1A1B23]/40 uppercase tracking-[0.2em] ml-1">Email (For OTP Verification)</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D8B34B]" size={16} />
                  <input 
                    type="email"
                    placeholder="amara@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-[#F0F1F4] focus:border-[#1A1B23] outline-none text-[14px] transition-colors font-medium text-[#1A1B23]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1A1B23]/40 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D8B34B]" size={16} />
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-[#F0F1F4] focus:border-[#1A1B23] outline-none text-[14px] transition-colors font-medium text-[#1A1B23]"
                      required
                    />
                  </div>
                </div>
              </div>

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
                    I agree to be added to the <span className="text-[#1A1B23] font-bold">Scentiva Aura WhatsApp Community</span> for exclusive updates and luxury fragrance tips.
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#1A1B23] text-white py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#2A2B35] disabled:opacity-50 transition-all group shadow-xl"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <>Create Profile <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                )}
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

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}
