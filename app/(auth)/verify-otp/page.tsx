"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function VerifyOtpContent() {
  const { verifyOtp, resendOtp } = useAuth();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Code',
        text: 'Please enter the full 6-digit code',
        confirmButtonColor: '#1A1B23'
      });
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(phone, otpString);
      Swal.fire({
        icon: 'success',
        title: 'Identity Verified',
        text: 'Welcome back to your aura.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: err.message || "Invalid code. Please try again.",
        confirmButtonColor: '#1A1B23'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendOtp(phone);
      setTimer(60);
      setCanResend(false);
      Swal.fire({
        icon: 'success',
        title: 'Code Sent',
        text: 'A new verification code has been sent.',
        confirmButtonColor: '#1A1B23'
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Resend Failed',
        text: err.message || "Failed to resend code",
        confirmButtonColor: '#1A1B23'
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 md:p-8 font-poppins text-deep-noir">
      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl border border-[#1A1B23]/5">
        <Link href="/signup" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1B23]/40 hover:text-[#1A1B23] transition-colors mb-12">
          <ChevronLeft size={14} /> Back
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#F9F7F2] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-gold-oud" size={32} />
          </div>
          <h1 className="font-lora text-3xl font-bold mb-2">Verify Your Aura</h1>
          <p className="text-[#9CA3AF] text-[10px] font-medium uppercase tracking-widest">
            We sent a code to <span className="text-[#1A1B23] font-bold">{phone}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-16 text-center text-2xl font-bold border-b-2 border-[#F0F1F4] focus:border-gold-oud outline-none transition-all bg-transparent"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1B23] text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#2A2B35] disabled:opacity-50 transition-all group shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Verify Identity"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-medium mb-2">
            Didn't receive the code?
          </p>
          {canResend ? (
            <button 
              onClick={handleResend}
              className="text-gold-oud font-bold text-[10px] uppercase tracking-widest hover:underline"
            >
              Resend Code Now
            </button>
          ) : (
            <p className="text-[#1A1B23] font-bold text-[10px] uppercase tracking-widest">
              Resend in {timer}s
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold-oud" size={32} />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
