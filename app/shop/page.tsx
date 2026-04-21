import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep-noir" />}>
      <ShopContent />
    </Suspense>
  );
}
