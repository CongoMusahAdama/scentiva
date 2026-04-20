"use client";

import { useState } from "react";
import { Users, TrendingUp, Gift, CreditCard, ChevronRight } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCards";
import { Badge, AdminPagination, AdminButton, AdminTable, AdminMobileCard } from "@/components/admin/AdminUI";
import { showSuccess } from "@/lib/swal";

interface Referral {
  id: number;
  code: string;
  owner: string;
  uses: number;
  reward: string;
  status: "active" | "pending" | "paid";
}

const initialReferrals: Referral[] = [
  { id: 1, code: "AMA-SA42", owner: "Ama Asante", uses: 8, reward: "GHS 80", status: "paid" },
  { id: 2, code: "KWA-ME19", owner: "Kwame Mensah", uses: 3, reward: "GHS 30", status: "pending" },
  { id: 3, code: "EFU-BO07", owner: "Efua Boateng", uses: 12, reward: "GHS 120", status: "paid" },
  { id: 4, code: "NAN-YW55", owner: "Nana Yaw", uses: 1, reward: "GHS 10", status: "pending" },
  { id: 5, code: "ABE-SA31", owner: "Abena Sarpong", uses: 5, reward: "GHS 50", status: "active" },
  { id: 6, code: "KOF-DA88", owner: "Kofi Darko", uses: 7, reward: "GHS 70", status: "active" },
  { id: 7, code: "YAA-OW14", owner: "Yaa Owusu", uses: 14, reward: "GHS 140", status: "paid" },
];

export default function ReferralsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const pageSize = 10;

  const triggerPayout = (id: number, name: string) => {
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, status: "paid" } : r)));
    showSuccess("Payout Successful", `A reward payout has been processed for ${name}.`);
  };

  const totalUses = referrals.reduce((s, r) => s + r.uses, 0);
  const totalRewards = referrals.reduce((s, r) => s + parseInt(r.reward.replace(/\D/g, "")), 0);

  const paginatedReferrals = referrals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Referrals" value={referrals.length.toString()} icon={<Users size={20} className="text-blue-500" />} />
        <StatCard label="Total Uses" value={totalUses.toString()} icon={<TrendingUp size={20} className="text-emerald-500" />} />
        <StatCard label="Rewards Issued" value={`GHS ${totalRewards}`} icon={<Gift size={20} className="text-amber-500" />} />
      </div>

      <AdminCard noPadding>
        <AdminTable
          headers={["S/N", "Referral Code", "Owner", "Usage Status", "Reward", "Status", "Actions"]}
          mobileCards={paginatedReferrals.map((r, idx) => (
            <AdminMobileCard 
              key={r.id}
              title={r.code}
              subtitle={r.owner}
              status={<Badge variant={r.status} label={r.status} />}
              details={[
                { label: "Uses", value: r.uses },
                { label: "Reward", value: r.reward },
              ]}
              actions={
                r.status === "pending" && (
                   <AdminButton variant="primary" size="sm" className="w-full" onClick={() => triggerPayout(r.id, r.owner)}>
                    Process Payout
                  </AdminButton>
                )
              }
            />
          ))}
        >
          {paginatedReferrals.map((r, idx) => (
            <tr key={r.id} className="border-t border-[#F0F1F4] hover:bg-[#F8F9FA] transition-colors group">
              <td className="px-6 py-4 font-bold text-[#9CA3AF] text-[11px]">
                {(currentPage - 1) * pageSize + idx + 1}
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-[#D8B34B] text-[13px] tracking-widest">{r.code}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1A1B23]/5 flex items-center justify-center border border-[#1A1B23]/10">
                    <span className="text-[10px] font-bold text-[#1A1B23]">{r.owner.charAt(0)}</span>
                  </div>
                  <span className="text-[13px] text-[#1A1B23] font-medium">{r.owner}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                   <div className="w-full h-1.5 bg-[#F5F6FA] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D8B34B] rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min((r.uses / 15) * 100, 100)}%` }}
                      />
                   </div>
                   <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-tight">{r.uses} / 15 Uses</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-[13px] font-bold text-[#10B981]">{r.reward}</span>
              </td>
              <td className="px-6 py-4">
                <Badge variant={r.status} label={r.status} />
              </td>
              <td className="px-6 py-4">
                {r.status === "pending" && (
                  <button 
                    onClick={() => triggerPayout(r.id, r.owner)}
                    className="flex items-center gap-2 text-[11px] font-bold text-[#059669] px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    <CreditCard size={13} /> PAYOUT
                  </button>
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
        <AdminPagination 
          currentPage={currentPage}
          totalItems={referrals.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </AdminCard>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E8E9EC] p-6 rounded-2xl flex items-center gap-5">
      <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] flex items-center justify-center border border-[#F0F1F4]">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-[#9CA3AF] font-bold uppercase tracking-[0.12em] mb-0.5">{label}</p>
        <h3 className="text-xl font-bold text-[#1A1B23] tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
