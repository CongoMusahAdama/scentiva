"use client";

import { useState } from "react";
import { Eye, Search, ChevronDown, Trash2 } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCards";
import { AdminButton, Badge, AdminModal, AdminSelect, AdminInput, AdminPagination, AdminTable, AdminMobileCard } from "@/components/admin/AdminUI";
import { showSuccess, showConfirm } from "@/lib/swal";

type OrderStatus = "pending" | "paid" | "delivered";

interface Order {
  id: string;
  customer: string;
  products: string;
  amount: string;
  status: OrderStatus;
  date: string;
  phone: string;
  address: string;
}

const initialOrders: Order[] = [
  { id: "SA-1042", customer: "Ama Asante", products: "Oud Royale × 1", amount: "GHS 420", status: "paid", date: "Apr 20, 2026", phone: "+233 55 123 4567", address: "Accra, East Legon" },
  { id: "SA-1041", customer: "Kwame Mensah", products: "Velvet Noir × 2", amount: "GHS 720", status: "pending", date: "Apr 20, 2026", phone: "+233 24 987 6543", address: "Kumasi, Adum" },
  { id: "SA-1040", customer: "Efua Boateng", products: "Citrus Bloom × 1", amount: "GHS 295", status: "delivered", date: "Apr 19, 2026", phone: "+233 20 456 7890", address: "Tema, Community 5" },
  { id: "SA-1039", customer: "Nana Yaw", products: "Amber Mist × 1", amount: "GHS 310", status: "delivered", date: "Apr 19, 2026", phone: "+233 50 112 2334", address: "Cape Coast" },
  { id: "SA-1038", customer: "Abena Sarpong", products: "Oud Royale × 1", amount: "GHS 420", status: "pending", date: "Apr 18, 2026", phone: "+233 27 765 4321", address: "Takoradi" },
  { id: "SA-1037", customer: "Kofi Darko", products: "Velvet Noir × 1, Citrus Bloom × 1", amount: "GHS 655", status: "paid", date: "Apr 17, 2026", phone: "+233 54 231 0987", address: "Accra, Cantonments" },
  { id: "SA-1036", customer: "Yaa Owusu", products: "Amber Mist × 2", amount: "GHS 620", status: "delivered", date: "Apr 16, 2026", phone: "+233 26 344 5566", address: "Accra, Osu" },
];

const statusOptions: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "delivered", label: "Delivered" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [detail, setDetail] = useState<Order | null>(null);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = orders.filter((o) => {
    const matchesStatus = filter === "all" || o.status === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(q) || 
      o.customer.toLowerCase().includes(q) || 
      o.products.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (detail?.id === id) setDetail((d) => d ? { ...d, status } : d);
    showSuccess("Status Updated", `Order #${id} is now ${status}.`);
  };

  const deleteOrder = async (id: string) => {
    const result = await showConfirm(
      "Delete Order",
      "Are you sure you want to remove this order from the records?",
      "Delete"
    );
    if (result.isConfirmed) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showSuccess("Deleted", "Order has been removed.");
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl">
      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input
            placeholder="Search orders by ID, name or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "10px 10px 10px 42px", background: "#FFFFFF",
              border: "1px solid #E8E9EC", borderRadius: "10px", fontSize: "13px",
              fontFamily: "var(--font-poppins, sans-serif)", color: "#1A1B23",
              outline: "none", transition: "all 0.2s ease",
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 500 }}>Filter:</span>
          <div style={{ position: "relative" }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={{
                appearance: "none", padding: "8px 36px 8px 16px", background: "#FFFFFF",
                border: "1px solid #E8E9EC", borderRadius: "10px", fontSize: "12px",
                fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 600, color: "#1A1B23",
                cursor: "pointer", outline: "none",
              }}
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="delivered">Delivered</option>
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }} />
          </div>
        </div>
      </div>

      <AdminCard noPadding>
        <AdminTable 
        headers={["S/N", "Order ID", "Customer", "Product(s)", "Amount", "Status", "Date", "Actions"]}
        mobileCards={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((order, idx) => (
           <AdminMobileCard
              key={order.id}
              title={order.id}
              subtitle={order.customer}
              status={<Badge variant={order.status} label={order.status} />}
              details={[
                { label: "Products", value: order.products },
                { label: "Amount", value: order.amount },
                { label: "Date", value: order.date },
              ]}
              actions={
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <AdminSelect
                      options={statusOptions}
                      value={order.status}
                      onChange={(val) => updateStatus(order.id, val as OrderStatus)}
                    />
                  </div>
                  <AdminButton variant="outline" size="sm" onClick={() => setDetail(order)}>
                    <Eye size={14} />
                  </AdminButton>
                </div>
              }
           />
        ))}
      >
        {filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((order, idx) => (
          <tr key={order.id} className="border-t border-[#F0F1F4] hover:bg-[#F8F9FA] transition-colors">
            <td className="px-6 py-4 font-bold text-[#9CA3AF] text-[11px]">
              {(currentPage - 1) * pageSize + idx + 1}
            </td>
            <td className="px-6 py-4">
              <span className="font-bold text-[#D8B34B] text-[13px]">{order.id}</span>
            </td>
            <td className="px-6 py-4">
              <span className="text-[13px] text-[#1A1B23] font-medium">{order.customer}</span>
            </td>
            <td className="px-6 py-4 max-w-[200px]">
              <span className="text-[12px] text-[#6B7280] truncate block">{order.products}</span>
            </td>
            <td className="px-6 py-4 font-bold text-[#1A1B23] text-[13px]">
              {order.amount}
            </td>
            <td className="px-6 py-4">
              <Badge variant={order.status} label={order.status} />
            </td>
            <td className="px-6 py-4 text-[11px] text-[#9CA3AF] font-medium">
              {order.date}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-32">
                  <AdminSelect
                    options={statusOptions}
                    value={order.status}
                    onChange={(val) => updateStatus(order.id, val as OrderStatus)}
                  />
                </div>
                <button onClick={() => setDetail(order)} className="p-2 hover:bg-[#F5F6FA] text-[#9CA3AF] hover:text-[#1A1B23] transition-colors"><Eye size={16} /></button>
                <button onClick={() => deleteOrder(order.id)} className="p-2 hover:bg-[#F5F6FA] text-[#9CA3AF] hover:text-[#EF4444] transition-colors"><Trash2 size={16} /></button>
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
      </AdminCard>

      {/* Order Detail Modal */}
      <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Order ${detail.id}` : "Order Details"} width="480px">
        {detail && (
          <div className="flex flex-col gap-4">
            {[
              ["Customer", detail.customer],
              ["Phone", detail.phone],
              ["Address", detail.address],
              ["Products", detail.products],
              ["Amount", detail.amount],
              ["Date", detail.date],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4" style={{ borderBottom: "1px solid #F0F1F4", paddingBottom: "12px" }}>
                <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: "80px" }}>
                  {label}
                </span>
                <span style={{ fontSize: "13px", color: "#1A1B23", fontFamily: "var(--font-poppins, sans-serif)", textAlign: "right" }}>
                  {value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4">
              <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Status
              </span>
              <AdminSelect
                options={statusOptions}
                value={detail.status}
                onChange={(val) => updateStatus(detail.id, val as OrderStatus)}
                className="w-[160px]"
              />
            </div>
          </div>
        )}
      </AdminModal>
    </div>

  );
}
