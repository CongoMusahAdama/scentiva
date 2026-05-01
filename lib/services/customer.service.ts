const API_URL = "http://localhost:3001/customers";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
});

export const CustomerService = {
  async getAll() {
    const res = await fetch(API_URL, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  },

  async create(data: any) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create customer");
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete customer");
    return res.json();
  }
};
