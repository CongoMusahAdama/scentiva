"use client";

import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { AdminCard, AdminButton, AdminPagination, AdminTable, AdminMobileCard, Badge } from "@/components/admin/AdminUI";
import { showSuccess, showConfirm, showError } from "@/lib/swal";
import { CustomerService } from "@/lib/services/customer.service";
import { useEffect } from "react";

interface Customer {
  _id?: string;
  id?: number;
  name: string;
  phone: string;
  orders: number;
  referralCode: string;
  joined: string;
  totalSpent: string;
}

const initialCustomers: Customer[] = [
  { id: 1, name: "Ama Asante", phone: "+233 55 123 4567", orders: 6, referralCode: "AMA-SA42", joined: "Jan 2026", totalSpent: "GHS 2,520" },
  { id: 2, name: "Kwame Mensah", phone: "+233 24 987 6543", orders: 3, referralCode: "KWA-ME19", joined: "Feb 2026", totalSpent: "GHS 1,155" },
  { id: 3, name: "Efua Boateng", phone: "+233 20 456 7890", orders: 8, referralCode: "EFU-BO07", joined: "Nov 2025", totalSpent: "GHS 3,290" },
  { id: 4, name: "Nana Yaw", phone: "+233 50 112 2334", orders: 2, referralCode: "NAN-YW55", joined: "Mar 2026", totalSpent: "GHS 620" },
  { id: 5, name: "Abena Sarpong", phone: "+233 27 765 4321", orders: 4, referralCode: "ABE-SA31", joined: "Dec 2025", totalSpent: "GHS 1,680" },
  { id: 6, name: "Kofi Darko", phone: "+233 54 231 0987", orders: 5, referralCode: "KOF-DA88", joined: "Jan 2026", totalSpent: "GHS 2,100" },
  { id: 7, name: "Yaa Owusu", phone: "+233 26 344 5566", orders: 9, referralCode: "YAA-OW14", joined: "Oct 2025", totalSpent: "GHS 4,050" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    CustomerService.getAll()
      .then((data) => {
        if (data.length > 0) {
          setCustomers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch live customers:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number | string, name: string) => {
    const result = await showConfirm(
      "Remove Customer",
      `Are you sure you want to remove ${name} from the database?`,
      "Remove"
    );
    if (result.isConfirmed) {
      try {
        const targetId = typeof id === 'number' ? id.toString() : id;
        
        // If it's a mock data ID (length < 10 typically), just remove it locally
        if (targetId.length < 10) {
           setCustomers((prev) => prev.filter((c) => c.id !== id && c._id !== id));
           showSuccess("Customer Removed", "The customer record has been deleted.");
           return;
        }

        await CustomerService.delete(targetId);
        setCustomers((prev) => prev.filter((c) => c._id !== targetId));
        showSuccess("Customer Removed", "The customer record has been deleted from the database.");
      } catch (err) {
        showError("Delete Failed", "Could not remove customer from backend.");
      }
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.referralCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 w-72"
        style={{ background: "#F5F6FA", border: "1px solid #E8E9EC" }}
      >
        <Search size={14} style={{ color: "#9CA3AF" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="bg-transparent outline-none flex-1"
          style={{ fontSize: "12px", color: "#1A1B23", fontFamily: "var(--font-poppins, sans-serif)" }}
        />
      </div>

      <AdminCard>
      <AdminTable 
        headers={["S/N", "Customer", "Phone", "Orders", "Total Spent", "Referral Code", "Joined", "Actions"]}
        mobileCards={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((c, idx) => (
           <AdminMobileCard
              key={c._id || c.id}
              title={c.name}
              subtitle={c.phone}
              image={
                <div className="w-10 h-10 rounded-full bg-[#D8B34B]/10 border border-[#D8B34B]/20 flex items-center justify-center">
                  <span className="text-[#D8B34B] font-bold text-[14px]">{c.name.charAt(0)}</span>
                </div>
              }
              details={[
                { label: "Orders", value: c.orders },
                { label: "Spent", value: c.totalSpent },
                { label: "Code", value: c.referralCode },
                { label: "Joined", value: c.joined },
              ]}
              actions={
                <div className="flex items-center gap-2 w-full">
                  <AdminButton variant="outline" size="sm" className="flex-1">View Details</AdminButton>
                  <AdminButton variant="danger" size="sm" onClick={() => handleDelete(c._id || c.id || '', c.name)}><Trash2 size={14} /></AdminButton>
                </div>
              }
           />
        ))}
      >
        {filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((c, idx) => (
          <tr key={c._id || c.id} className="border-t border-[#F0F1F4] hover:bg-[#F8F9FA] transition-colors">
            <td className="px-6 py-4 font-bold text-[#9CA3AF] text-[11px]">
              {(currentPage - 1) * pageSize + idx + 1}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D8B34B]/10 border border-[#D8B34B]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#D8B34B] font-bold text-[12px]">{c.name.charAt(0)}</span>
                </div>
                <span className="font-bold text-[#1A1B23] text-[13px]">{c.name}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-[12px] text-[#6B7280]">{c.phone}</span>
            </td>
            <td className="px-6 py-4 font-bold text-[#1A1B23] text-[14px]">
              {c.orders}
            </td>
            <td className="px-6 py-4 font-bold text-emerald-500 text-[13px]">
              {c.totalSpent}
            </td>
            <td className="px-6 py-4">
              <span className="bg-[#D8B34B]/5 text-[#D8B34B] border border-[#D8B34B]/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                {c.referralCode}
              </span>
            </td>
            <td className="px-6 py-4 text-[11px] text-[#9CA3AF] font-medium uppercase">
              {c.joined}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(c._id || c.id || '', c.name)} className="p-2 hover:bg-rose-50 text-[#9CA3AF] hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
      <AdminPagination 
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)" }}>
              No customers found.
            </p>
          </div>
        )}
      </AdminCard>
    </div>

  );
}
