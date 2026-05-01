const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Review {
  _id?: string;
  id?: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export const ReviewService = {
  getAllReviews: async (): Promise<Review[]> => {
    const res = await fetch(`${API_URL}/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const data = await res.json();
    return data.map((r: any) => ({ ...r, id: r._id }));
  },

  getCustomerReviews: async (customerName: string): Promise<Review[]> => {
    const res = await fetch(`${API_URL}/reviews?customer=${encodeURIComponent(customerName)}`);
    if (!res.ok) throw new Error("Failed to fetch customer reviews");
    const data = await res.json();
    return data.map((r: any) => ({ ...r, id: r._id }));
  },

  createReview: async (data: Partial<Review>): Promise<Review> => {
    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create review");
    return res.json();
  },

  updateStatus: async (id: string, status: "pending" | "approved" | "rejected"): Promise<Review> => {
    const res = await fetch(`${API_URL}/reviews/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update review status");
    return res.json();
  },

  deleteReview: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/reviews/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete review");
  },
};
