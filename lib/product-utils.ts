import { allProducts } from "@/lib/products";
import type { Product } from "@/lib/types/product";

export function getProductById(id: string): Product | undefined {
  const decoded = decodeURIComponent(id);
  return allProducts.find(
    (p) => p.id === decoded || p.id.toLowerCase() === decoded.toLowerCase()
  );
}

export function getProductHref(product: Product): string {
  return `/shop/${encodeURIComponent(product.id)}`;
}
