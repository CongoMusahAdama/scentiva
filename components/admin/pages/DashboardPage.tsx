"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight, Plus, ChevronDown } from "lucide-react";
import { StatCard, AdminCard } from "@/components/admin/AdminCards";
import { Badge, AdminButton } from "@/components/admin/AdminUI";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import { showError } from "@/lib/swal";

const filterLabels: Record<string, string> = { "7d": "Past 7 Days", "30d": "Past 30 Days", "90d": "Past 90 Days" };

function SalesChart({ filter, chartData }: { filter: string, chartData: any }) {
  if (!chartData || !chartData[filter]) return <div className="text-gray-400 text-sm">No data</div>;
  const data = chartData[filter];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const W = 620, H = 220, padL = 48, padB = 32, padT = 16, padR = 16;
  const innerW = W - padL - padR;
  const innerH = H - padB - padT;
  const maxVal = Math.max(...data.map((d: any) => d.value), 100) * 1.15; // fallback 100 max

  const toX = (i: number) => padL + (i / Math.max((data.length - 1), 1)) * innerW;
  const toY = (v: number) => padT + innerH - (v / maxVal) * innerH;

  const polyline = data.map((d: any, i: number) => `${toX(i)},${toY(d.value)}`).join(" ");
  const fill = `${polyline} ${toX(Math.max(data.length - 1, 0))},${H - padB} ${toX(0)},${H - padB}`;

  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const val = Math.round((maxVal / 4) * i);
    return { val, y: toY(val) };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
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
      <polyline points={polyline} fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "all 0.4s ease" }} />

      {/* Interaction Rects (Invisible hotspots) */}
      {data.map((d: any, i: number) => (
        <rect
          key={`hit-${i}`}
          x={toX(i) - 20} y={padT} width="40" height={innerH}
          fill="transparent" cursor="pointer"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      ))}

      {/* Dots + Tooltips */}
      {data.map((d: any, i: number) => {
        const isHovered = hoveredIndex === i;
        return (
          <g key={i}>
            <circle
              cx={toX(i)} cy={toY(d.value)}
              r={isHovered ? 6 : 0}
              fill="#A855F7"
              style={{ transition: "r 0.2s ease" }}
            />
            <circle
              cx={toX(i)} cy={toY(d.value)}
              r={isHovered ? 3.5 : 3.5}
              fill={isHovered ? "#FFFFFF" : "#A855F7"}
              stroke={isHovered ? "#A855F7" : "none"}
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

export default function DashboardPage() {
  const { setActivePage } = useAdmin();
  const { token } = useAuth();
  const [chartFilter, setChartFilter] = useState<"7d" | "30d" | "90d">("30d");
  const [activeTab, setActiveTab] = useState<"performance" | "orders">("performance");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    fetch(`${API_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(payload => {
      setData(payload);
      setLoading(false);
    })
    .catch(err => {
      console.error("Dashboard Sync Error:", err);
      // Silenced intrusive showError to improve UX on refresh
      setLoading(false);
    });
  }, [token]);

  const statColors = ["#4F6EF7", "#10B981", "#F59E0B", "#A855F7"];

  if (loading) {
    return <div className="text-sm font-medium text-gray-500 animate-pulse p-4">Loading real-time admin metrics...</div>;
  }

  return (
    <div className="flex flex-col gap-5" style={{ maxWidth: "1200px" }}>
      {/* Greeting */}
      <div>
        <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h2 style={{ fontFamily: "var(--font-lora, serif)", fontSize: "22px", fontWeight: 700, color: "#1A1B23", marginTop: "4px" }}>
          Welcome back, Admin 👋
        </h2>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Products" value={data?.stats?.totalProducts?.toString() || "0"} subLabel="System database" color={statColors[0]} />
        <StatCard label="Total Orders" value={data?.stats?.totalOrders?.toString() || "0"} subLabel="Cumulative sales" color={statColors[1]} />
        <StatCard label="Revenue" value={`GHS ${data?.stats?.revenue?.toLocaleString() || "0"}`} subLabel="All time" color={statColors[2]} />
        <StatCard label="Net Profit" value={`GHS ${data?.stats?.netProfit?.toLocaleString() || "0"}`} subLabel="Revenue - Costs" color="#10B981" />
        <StatCard label="Active Customers" value={data?.stats?.activeCustomers?.toString() || "0"} subLabel="Registered profiles" color={statColors[3]} />
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
                      Live Backend Sync
                    </p>
                    <div className="h-4 w-px bg-[#E8E9EC]" />
                    <p className="text-[14px] text-[#1A1B23] font-bold">
                       GHS {data?.chartData?.[chartFilter]?.reduce((s:any, d:any) => s + d.value, 0).toLocaleString() || 0} <span className="text-[11px] font-normal text-[#9CA3AF] uppercase tracking-wider ml-1">Total Revenue</span>
                    </p>
                  </div>
                  <div className="h-[280px] w-full">
                    <SalesChart filter={chartFilter} chartData={data?.chartData} />
                  </div>
                </div>
              ) : (
                 <div className="overflow-x-auto -mx-5 px-5">
                    <table className="w-full border-collapse min-w-[500px]">
                      <thead>
                        <tr style={{ backgroundColor: "#D8B34B" }}>
                          {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                            <th key={h} className="text-left text-[10px] font-bold text-white uppercase tracking-widest px-4 py-4">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0F1F4]">
                        {data?.recentOrders?.length > 0 ? (
                          data.recentOrders.map((o: any) => (
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
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-sm text-gray-500">No orders placed yet.</td>
                          </tr>
                        )}
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
              {data?.alerts?.map((s: any) => (
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
