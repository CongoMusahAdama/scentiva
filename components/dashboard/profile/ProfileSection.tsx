"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Phone, Mail, Camera, Save, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Cookies from "js-cookie";
import { showSuccess as showSwalSuccess, showError } from "@/lib/swal";

export default function ProfileSection() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: (user as any)?.email || "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const token = Cookies.get("scentiva_token");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      let profileImageUrl = user?.profileImage;

      // 1. Upload image if selected
      if (selectedFile) {
        const formDataObj = new FormData();
        formDataObj.append("file", selectedFile);
        const imgRes = await fetch(`${API_URL}/users/profile-image`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formDataObj,
        });
        if (!imgRes.ok) throw new Error("Image upload failed");
        const imgData = await imgRes.json();
        profileImageUrl = imgData.profileImage;
      }

      // 2. Update profile details
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      updateUser({
        fullName: formData.fullName,
        email: formData.email,
        profileImage: profileImageUrl
      });

      setSuccess(true);
      showSwalSuccess("Profile Updated", "Your changes have been saved successfully.");
      setPreviewImage(null);
      setSelectedFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      showError("Update Failed", "Error updating profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local Preview only (no network request)
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setSelectedFile(file);
  };

  return (
    <div className="space-y-10">
      <div className="border-b border-gray-100 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-1">Profile Settings</h1>
          <p className="text-gray-400 text-sm">Manage your personal information and account details.</p>
        </div>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest pb-2"
          >
            <CheckCircle2 size={16} /> Saved Successfully
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Avatar Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#E8E9EC] p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-xl">
                {loading && (
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 backdrop-blur-[2px]">
                      <Loader2 className="text-white animate-spin" size={24} />
                   </div>
                )}
                {previewImage || user?.profileImage ? (
                  <Image 
                    src={previewImage || user?.profileImage || ""} 
                    alt="Avatar" 
                    fill 
                    sizes="128px"
                    className="object-cover" 
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <User size={48} className="text-gray-300" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-[#1A1B23] text-white rounded-full cursor-pointer shadow-lg hover:bg-black transition-all border-2 border-white">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A1B23]">{formData.fullName}</h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1">Aura Member</p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#E8E9EC] p-8 md:p-10 shadow-sm">
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-oud" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#F9FAFB] border border-[#E8E9EC] pl-10 pr-4 py-3 text-sm focus:border-gold-oud outline-none transition-colors font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-oud" />
                  <input
                    type="tel"
                    value={formData.phone}
                    className="w-full bg-[#F3F4F6] border border-[#E8E9EC] pl-10 pr-4 py-3 text-sm text-gray-500 cursor-not-allowed outline-none font-medium"
                    disabled
                  />
                </div>
              </div>

               <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address (Verification)</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-oud" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F9FAFB] border border-[#E8E9EC] pl-10 pr-4 py-3 text-sm focus:border-gold-oud outline-none transition-colors font-medium"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1A1B23] text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
