import { API_URL, getAuthHeaders } from "@/lib/api";

export const ProductService = {
  async fetchAll() {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    } catch (error) {
      console.error("ProductService.fetchAll Error:", error);
      return [];
    }
  },

  async create(productData: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return await res.json();
  },

  async update(id: string, productData: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return await res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(false),
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return true;
  },
};
