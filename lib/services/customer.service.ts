import { API_URL, getAuthHeaders } from "@/lib/api";

const CUSTOMERS_URL = `${API_URL}/customers`;

export const CustomerService = {
  async getAll() {
    const res = await fetch(CUSTOMERS_URL, { headers: getAuthHeaders(false) });
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  },

  async create(data: Record<string, unknown>) {
    const res = await fetch(CUSTOMERS_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create customer");
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${CUSTOMERS_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(false),
    });
    if (!res.ok) throw new Error("Failed to delete customer");
    return res.json();
  },
};
