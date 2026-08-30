import { allProducts } from "@/lib/products";
import { API_URL } from "@/lib/api";
import type { Product } from "@/lib/types/product";

export function getProductById(id: string): Product | undefined {
  const decoded = decodeURIComponent(id);
  return allProducts.find(
    (p) => p.id === decoded || p.id.toLowerCase() === decoded.toLowerCase()
  );
}

/** Fetches the live product from the backend, falling back to the bundled static data if the API is unreachable or the product isn't found there. */
export async function getProductByIdLive(id: string): Promise<Product | undefined> {
  const decoded = decodeURIComponent(id);
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(decoded)}`, {
      cache: "no-store",
    });
    if (res.ok) return await res.json();
  } catch (error) {
    console.error("getProductByIdLive Error:", error);
  }
  return getProductById(decoded);
}

export function getProductHref(product: Product): string {
  return `/shop/${encodeURIComponent(product.id)}`;
}
