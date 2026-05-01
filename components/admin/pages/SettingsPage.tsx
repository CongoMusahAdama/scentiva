"use client";

import { useState } from "react";
import { Save, AlertTriangle, ShieldCheck } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminUI";
import { AdminButton, AdminInput, AdminTextarea } from "@/components/admin/AdminUI";
import { showSuccess, showConfirm, showError } from "@/lib/swal";
import { SettingService } from "@/lib/services/setting.service";
import { useEffect } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    storeName: "Scentiva Aura",
    tagline: "Own your scent.",
    email: "hello@scentivaaura.com",
    whatsapp: "050 915 4727",
    socialHandle: "@scentivaaura",
    address: "Takoradi, Ghana",
    currency: "GHS",
    deliveryNote: "Orders are processed within 24 hours and delivered in 1–3 business days.",
    referralReward: "10",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SettingService.getSettings()
      .then((data) => {
        setForm({
          storeName: data.storeName || "",
          tagline: data.tagline || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          socialHandle: data.socialHandle || "",
          address: data.address || "",
          currency: data.currency || "GHS",
          deliveryNote: data.deliveryNote || "",
          referralReward: data.referralReward || "10",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        showError("Sync Failed", "Could not load settings from backend.");
        setLoading(false);
      });
  }, []);

  const updateField = (k: keyof typeof form, val: string) => {
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSave = async () => {
    try {
      await SettingService.updateSettings(form);
      showSuccess("Settings Saved", "Your store configuration has been updated and synced to the cloud successfully.");
    } catch (err) {
      showError("Save Failed", "Could not sync settings to backend.");
    }
  };

  const handleDangerAction = async (action: string) => {
    const result = await showConfirm(
      "Are you absolutely sure?",
      `This will ${action}. This action is permanent and cannot be undone.`,
      "Yes, proceed"
    );

    if (result.isConfirmed) {
      showSuccess("Action Successful", "The requested operation has been completed.");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500 animate-pulse">Loading settings from secure cloud...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-lora text-3xl font-bold text-[#1A1B23] tracking-tight">Settings</h1>
          <p className="font-poppins text-sm text-[#9CA3AF] mt-1">Configure your store's global parameters and preferences.</p>
        </div>
        <AdminButton variant="primary" icon={<Save size={16} />} onClick={handleSave} className="md:w-auto w-full">
          Save All Changes
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Store Info */}
          <AdminCard title="Store Branding">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AdminInput label="Store Name" value={form.storeName} onChange={(val) => updateField("storeName", val)} />
                <AdminInput label="Tagline" value={form.tagline} onChange={(val) => updateField("tagline", val)} />
              </div>
              <AdminInput label="Currency Symbol" value={form.currency} onChange={(val) => updateField("currency", val)} />
              <AdminTextarea 
                label="Delivery Information (Receipt Note)" 
                value={form.deliveryNote} 
                onChange={(val) => updateField("deliveryNote", val)} 
                rows={3}
              />
            </div>
          </AdminCard>

          {/* Referral Config */}
          <AdminCard title="Referral Program">
            <div className="flex flex-col gap-5">
              <div className="p-4 bg-[#F5F6FA] border-l-4 border-[#D8B34B]">
                <p className="text-[12px] text-[#1A1B23] font-poppins leading-relaxed">
                  Referrers receive credit when their referral link is used for a successful purchase.
                </p>
              </div>
              <AdminInput
                label="Reward Amount (GHS)"
                value={form.referralReward}
                onChange={(val) => updateField("referralReward", val)}
                type="number"
              />
              <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wider">
                Current payout: <span className="text-[#1A1B23] font-bold">GHS {form.referralReward} per lead</span>
              </p>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          {/* Contact Info */}
          <AdminCard title="Communication & Support">
            <div className="flex flex-col gap-5">
              <AdminInput label="Public Support Email" value={form.email} onChange={(val) => updateField("email", val)} type="email" />
              <AdminInput label="Official WhatsApp Number" value={form.whatsapp} onChange={(val) => updateField("whatsapp", val)} placeholder="050 XXX XXXX" />
              <AdminInput label="Social Media Handle (IG, FB, TikTok)" value={form.socialHandle} onChange={(val) => updateField("socialHandle", val)} />
              <AdminTextarea label="Physical Address" value={form.address} onChange={(val) => updateField("address", val)} rows={2} />
            </div>
          </AdminCard>

          {/* Security / Danger zone */}
          <AdminCard title="Account Security & Maintenance" className="border-rose-100">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle size={18} />
                <span className="text-xs font-bold uppercase tracking-widest font-poppins">Sensitive Actions</span>
              </div>
              <p className="text-[12px] text-[#6B7280] font-poppins leading-relaxed">
                Clearing records or resetting data cannot be undone. Use these tools only when necessary.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <AdminButton variant="outline" size="sm" className="border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleDangerAction("clear all order history")}>
                  Clear Orders
                </AdminButton>
                <AdminButton variant="outline" size="sm" className="border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleDangerAction("reset all customer engagement data")}>
                  Reset Analytics
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
      
      <div className="mt-4 p-6 bg-[#1A1B23] text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-[#D8B34B]" size={24} />
          <div>
            <p className="text-sm font-bold tracking-tight">Enterprise Protection</p>
            <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-widest">Scentiva Cloud Security Active</p>
          </div>
        </div>
        <AdminButton variant="primary" onClick={handleSave} className="bg-white text-[#1A1B23] hover:bg-[#F5F6FA]">
          Save Changes
        </AdminButton>
      </div>
    </div>
  );
}
