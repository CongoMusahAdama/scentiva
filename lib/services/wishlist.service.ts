import { API_URL, getAuthHeaders } from "@/lib/api";

export const WishlistService = {
  async getWishlist() {
    const res = await fetch(`${API_URL}/users/wishlist`, {
      headers: getAuthHeaders(false),
    });
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return res.json();
  },

  async toggleWishlist(productId: string) {
    const res = await fetch(`${API_URL}/users/wishlist/${productId}`, {
      method: "POST",
      headers: getAuthHeaders(false),
    });
    if (!res.ok) throw new Error("Failed to update wishlist");
    return res.json();
  },
};
