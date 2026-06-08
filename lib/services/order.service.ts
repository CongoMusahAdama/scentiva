import { API_URL, getAuthHeaders } from "@/lib/api";

export const OrderService = {
  async fetchAll(phone?: string) {
    try {
      const params = new URLSearchParams();
      if (phone) params.set("phone", phone);
      const query = params.toString();
      const url = `${API_URL}/orders${query ? `?${query}` : ""}`;
      const res = await fetch(url, { headers: getAuthHeaders(false) });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return await res.json();
    } catch (error) {
      console.error("OrderService.fetchAll Error:", error);
      return [];
    }
  },

  async create(orderData: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return await res.json();
  },

  async updateStatus(id: string, status: string) {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status");
    return await res.json();
  },

  async deleteOrder(id: string) {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(false),
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return true;
  },
};
