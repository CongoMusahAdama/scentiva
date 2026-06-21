"use client";

import React from "react";
import { CheckCircle2, Clock, CreditCard } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/lib/services/order.service";

const OrdersSection = () => {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user?.phone) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.fetchAll(user?.phone);
      // Map backend status to UI color/icon
      const mappedData = data.map((order: any) => {
        let color = "text-amber-600 bg-amber-50 border-amber-100";
        let icon = <Clock size={12} />;
        
        if (order.status === 'delivered') {
          color = "text-emerald-600 bg-emerald-50 border-emerald-100";
          icon = <CheckCircle2 size={12} />;
        } else if (order.status === 'paid') {
          color = "text-blue-600 bg-blue-50 border-blue-100";
          icon = <CreditCard size={12} />;
        }

        return {
          ...order,
          color,
          icon
        };
      });
      setOrders(mappedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white border border-gray-100 rounded-[0px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#D8B34B" }} className="border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Order ID</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Products</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr>
                 <td colSpan={6} className="px-6 py-10 text-center text-xs text-gray-400 uppercase tracking-widest">
                    Synchronizing Orders...
                 </td>
               </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-xs text-gray-400 uppercase tracking-widest">
                   No orders found
                </td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className="text-[12px] font-bold text-gray-900 font-mono tracking-tighter">{order.id}</span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[13px] text-gray-700 font-medium">{order.products}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[12px] text-gray-400 font-medium">{order.date}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${order.color}`}>
                    {order.icon} {order.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[14px] font-bold text-gray-900">{order.amount}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <a 
                    href={`https://wa.me/233203154307?text=Hello Scentiva, I would like to follow up on my order: ${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-bold text-[#25D366] uppercase tracking-widest hover:underline"
                  >
                    Track via WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default OrdersSection;
