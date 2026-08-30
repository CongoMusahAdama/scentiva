import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getProductByIdLive } from "@/lib/product-utils";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default async function ProductPage({ params }: Props) {
  const product = await getProductByIdLive(params.id);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}
