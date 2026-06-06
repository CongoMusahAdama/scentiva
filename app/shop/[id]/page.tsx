import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getProductById } from "@/lib/product-utils";
import { allProducts } from "@/lib/products";

type Props = {
  params: { id: string };
};

export function generateStaticParams() {
  return allProducts.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: Props) {
  const product = getProductById(params.id);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}
