"use client";

import { useEffect, useState } from "react";
import { ProductService } from "@/lib/services/product.service";
import { allProducts } from "@/lib/products";
import type { Product } from "@/lib/types/product";

/** Live product data from the backend, falling back to the bundled static list while loading or if the API is unreachable. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ProductService.fetchAll().then((data: Product[]) => {
      if (cancelled) return;
      if (Array.isArray(data) && data.length > 0) setProducts(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
