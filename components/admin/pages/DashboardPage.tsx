"use client";

import { useState } from "react";
import { Package, ShoppingBag, DollarSign, Users, ArrowRight, Plus, ChevronDown } from "lucide-react";
import { StatCard, AdminCard } from "@/components/admin/AdminCards";
import { Badge, AdminButton } from "@/components/admin/AdminUI";
import { useAdmin } from "@/context/AdminContext";

// ─── Sales chart data ─────────────────────────────────────────────────────────

const chartData: Record<string, { label: string; value: number }[]> = {
  "7d": [
    { label: "Mon", value: 820 }, { label: "Tue", value: 1340 }, { label: "Wed", value: 960 },
    { label: "Thu", value: 1780 }, { label: "Fri", value: 2100 }, { label: "Sat", value: 1560 },
    { label: "Sun", value: 940 },
  ],
  "30d": [
    { label: "Apr 1", value: 500 }, { label: "Apr 3", value: 820 }, { label: "Apr 5", value: 680 },
    { label: "Apr 7", value: 1200 }, { label: "Apr 9", value: 950 }, { label: "Apr 11", value: 1800 },
    { label: "Apr 13", value: 760 }, { label: "Apr 15", value: 2100 }, { label: "Apr 17", value: 1300 },
    { label: "Apr 19", value: 1640 }, { label: "Apr 21", value: 980 }, { label: "Apr 23", value: 2200 },
    { label: "Apr 25", value: 1550 }, { label: "Apr 27", value: 1870 }, { label: "Apr 29", value: 2400 },
  ],
  "90d": [
    { label: "Feb", value: 9200 }, { label: "Mar", value: 14800 }, { label: "Apr", value: 22400 },
  ],
};

const filterLabels: Record<string, string> = { "7d": "Past 7 Days", "30d": "Past 30 Days", "90d": "Past 90 Days" };

function SalesChart({ filter }: { filter: string }) {
  const data = chartData[filter];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const W = 620, H = 220, padL = 48, padB = 32, padT = 16, padR = 16;
  const innerW = W - padL - padR;
  const innerH = H - padB - padT;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;

  const toX = (i: number) => padL + (i / (data.length - 1)) * innerW;
  const toY = (v: number) => padT + innerH - (v / maxVal) * innerH;

  const polyline = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(" ");
  const fill = `${polyline} ${toX(data.length - 1)},${H - padB} ${toX(0)},${H - padB}`;

  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const val = Math.round((maxVal / 4) * i);
    return { val, y: toY(val) };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D8B34B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#D8B34B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yLabels.map(({ y }, i) => (
        <line key={i} x1={padL} y1={y} x2={W - padR} y2={y}
          stroke="#F0F1F4" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4 4"} />
      ))}

      {/* Y labels */}
      {yLabels.map(({ val, y }) => (
        <text key={val} x={padL - 10} y={y + 3} textAnchor="end"
          style={{ fontSize: "9px", fill: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 500 }}>
          {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
        </text>
      ))}

      {/* Fill area */}
      <polygon points={fill} fill="url(#salesGrad)" style={{ transition: "all 0.4s ease" }} />

      {/* Hover Line */}
      {hoveredIndex !== null && (
        <line x1={toX(hoveredIndex)} y1={padT} x2={toX(hoveredIndex)} y2={H - padB} stroke="#E8E9EC" strokeWidth="1" strokeDasharray="3 3" />
      )}

      {/* Main Line */}
      <polyline points={polyline} fill="none" stroke="#D8B34B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "all 0.4s ease" }} />

      {/* Interaction Rects (Invisible hotspots) */}
      {data.map((d, i) => (
        <rect
          key={`hit-${i}`}
          x={toX(i) - 20} y={padT} width="40" height={innerH}
          fill="transparent" cursor="pointer"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      ))}

      {/* Dots + Tooltips */}
      {data.map((d, i) => {
        const isHovered = hoveredIndex === i;
        return (
          <g key={i}>
            <circle
              cx={toX(i)} cy={toY(d.value)}
              r={isHovered ? 6 : 0}
              fill="#D8B34B"
              style={{ transition: "r 0.2s ease" }}
            />
            <circle
              cx={toX(i)} cy={toY(d.value)}
              r={isHovered ? 3.5 : 3.5}
              fill={isHovered ? "#FFFFFF" : "#D8B34B"}
              stroke={isHovered ? "#D8B34B" : "none"}
              strokeWidth="1.5"
              style={{ transition: "all 0.2s ease" }}
            />
            {isHovered && (
              <g transform={`translate(${toX(i)},${toY(d.value) - 12})`}>
                <rect x="-24" y="-18" width="48" height="18" rx="4" fill="#1A1B23" />
                <text y="-6" textAnchor="middle" style={{ fontSize: "9px", fill: "#FFFFFF", fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 600 }}>
                  {d.value}
                </text>
              </g>
            )}
            <text x={toX(i)} y={H - padB + 16} textAnchor="middle"
              style={{ fontSize: "9px", fill: isHovered ? "#1A1B23" : "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", fontWeight: isHovered ? 600 : 400, transition: "all 0.2s ease" }}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Recent orders data ────────────────────────────────────────────────────────

const recentOrders = [
  { id: "SA-1042", customer: "Ama Asante", product: "Oud Royale", amount: "GHS 420", status: "paid" as const, date: "Apr 20" },
  { id: "SA-1041", customer: "Kwame Mensah", product: "Velvet Noir", amount: "GHS 360", status: "pending" as const, date: "Apr 20" },
  { id: "SA-1040", customer: "Efua Boateng", product: "Citrus Bloom", amount: "GHS 295", status: "delivered" as const, date: "Apr 19" },
  { id: "SA-1039", customer: "Nana Yaw", product: "Amber Mist", amount: "GHS 310", status: "delivered" as const, date: "Apr 19" },
  { id: "SA-1038", customer: "Abena Sarpong", product: "Oud Royale", amount: "GHS 420", status: "pending" as const, date: "Apr 18" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { setActivePage } = useAdmin();
  const [chartFilter, setChartFilter] = useState<"7d" | "30d" | "90d">("30d");
  const [activeTab, setActiveTab] = useState<"performance" | "orders">("performance");

  const statColors = ["#4F6EF7", "#10B981", "#F59E0B", "#A855F7"];

  return (
    <div className="flex flex-col gap-5" style={{ maxWidth: "1200px" }}>
      {/* Greeting */}
      <div>
        <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
          Sunday, 20 April 2026
        </p>
        <h2 style={{ fontFamily: "var(--font-lora, serif)", fontSize: "22px", fontWeight: 700, color: "#1A1B23", marginTop: "4px" }}>
          Welcome back, Admin 👋
        </h2>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value="24" subLabel="2 added this week" color={statColors[0]} />
        <StatCard label="Total Orders" value="1,042" subLabel="12% this month" color={statColors[1]} />
        <StatCard label="Revenue" value="GHS 48.2K" subLabel="8.4% vs last month" color={statColors[2]} />
        <StatCard label="Active Customers" value="318" subLabel="Since last month" color={statColors[3]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Tabbed Card */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <AdminCard noPadding>
            {/* Header / Tab Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-b border-[#F0F1F4] gap-4">
              <div className="flex items-center gap-6">
                {[
                  { id: "performance", label: "Sales Performance" },
                  { id: "orders", label: "Recent Orders" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`pb-2 text-[13px] font-bold uppercase tracking-widest transition-all ${
                      activeTab === t.id ? "text-[#1A1B23] border-b-2 border-[#D8B34B]" : "text-[#9CA3AF] hover:text-[#1A1B23]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Contextual actions */}
              {activeTab === "performance" ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#9CA3AF] font-bold uppercase tracking-wider">Period:</span>
                  <div className="relative">
                    <select
                      value={chartFilter}
                      onChange={(e) => setChartFilter(e.target.value as any)}
                      className="appearance-none pl-4 pr-10 py-2 bg-[#F5F6FA] border border-[#E8E9EC] text-[11px] font-bold uppercase tracking-wider text-[#1A1B23] outline-none cursor-pointer"
                    >
                      {(["7d", "30d", "90d"] as const).map((f) => (
                        <option key={f} value={f}>{filterLabels[f]}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]" />
                  </div>
                </div>
              ) : (
                <button onClick={() => setActivePage("orders")} className="flex items-center gap-2 text-[#D8B34B] text-[12px] font-bold uppercase tracking-widest hover:underline">
                  View all <ArrowRight size={14} />
                </button>
              )}
            </div>

            <div className="p-5 overflow-hidden">
              {activeTab === "performance" ? (
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <p className="text-[12px] text-[#9CA3AF] font-medium">
                      {chartData[chartFilter].length} data points
                    </p>
                    <div className="h-4 w-px bg-[#E8E9EC]" />
                    <p className="text-[14px] text-[#1A1B23] font-bold">
                       GHS {chartData[chartFilter].reduce((s, d) => s + d.value, 0).toLocaleString()} <span className="text-[11px] font-normal text-[#9CA3AF] uppercase tracking-wider ml-1">Total Revenue</span>
                    </p>
                  </div>
                  <div className="h-[280px] w-full">
                    <SalesChart filter={chartFilter} />
                  </div>
                </div>
              ) : (
                 <div className="overflow-x-auto -mx-5 px-5">
                    <table className="w-full border-collapse min-w-[500px]">
                      <thead>
                        <tr>
                          {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                            <th key={h} className="text-left text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest pb-4">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0F1F4]">
                        {recentOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#F8F9FA] transition-colors">
                            <td className="py-4">
                              <span className="text-[12px] text-[#D8B34B] font-bold uppercase tracking-wider">{o.id}</span>
                            </td>
                            <td className="py-4">
                              <span className="text-[13px] text-[#1A1B23] font-medium">{o.customer}</span>
                            </td>
                            <td className="py-4">
                              <span className="text-[12px] text-[#6B7280]">{o.product}</span>
                            </td>
                            <td className="py-4">
                              <span className="text-[13px] text-[#1A1B23] font-bold">{o.amount}</span>
                            </td>
                            <td className="py-4"><Badge variant={o.status} label={o.status} /></td>
                            <td className="py-4">
                              <span className="text-[11px] text-[#9CA3AF] font-bold uppercase tracking-wider">{o.date}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              )}
            </div>
          </AdminCard>
        </div>

        {/* Right Sidebar: Quick Actions & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <AdminCard title="Quick Actions">
            <div className="flex flex-col gap-3">
              <AdminButton variant="primary" onClick={() => setActivePage("products")} className="w-full">
                <Plus size={16} /> New Product
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => setActivePage("orders")} className="w-full">
                <ShoppingBag size={16} /> Manage Orders
              </AdminButton>
              <AdminButton variant="outline" onClick={() => setActivePage("reviews")} className="w-full border-[#E8E9EC]">
                Check Reviews
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Dashboard Alerts">
            <div className="divide-y divide-[#F0F1F4]">
              {[
                { label: "Reviews pending", value: "3", color: "#F59E0B" },
                { label: "Low stock items", value: "2", color: "#EF4444" },
                { label: "Referrals active", value: "41", color: "#10B981" },
                { label: "New customers", value: "18", color: "#D8B34B" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-4">
                  <span className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">{s.label}</span>
                  <span className="text-[16px] font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
