import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export const WishlistService = {
  getWishlist: async () => {
    const token = Cookies.get("scentiva_token");
    const res = await fetch(`${API_URL}/users/wishlist`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return res.json();
  },

  toggleWishlist: async (productId: string) => {
    const token = Cookies.get("scentiva_token");
    const res = await fetch(`${API_URL}/users/wishlist/${productId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to toggle wishlist");
    return res.json();
  }
};
