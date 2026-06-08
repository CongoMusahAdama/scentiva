"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  Heart,
  Clock,
  CheckCircle2,
  User,
  Package,
  Sunrise,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeliveryDetailsForm from "@/components/DeliveryDetailsForm";
import type { Product } from "@/lib/types/product";
import { productIconMap } from "@/lib/product-icons";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { WishlistService } from "@/lib/services/wishlist.service";
import { showSuccess, showError } from "@/lib/swal";
import { useWhatsAppCheckout } from "@/hooks/useWhatsAppCheckout";
import {
  defaultDeliveryDetails,
  loadDeliveryDetails,
  type DeliveryDetails,
} from "@/lib/delivery";

type Props = {
  product: Product;
};

const ProductDetailView = ({ product }: Props) => {
  const router = useRouter();
  const { addToCart, showCartToast } = useCart();
  const { user } = useAuth();
  const checkoutWhatsApp = useWhatsAppCheckout();
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryDetails>(defaultDeliveryDetails);

  const returnTo = `/shop/${product.id}`;

  useEffect(() => {
    const saved = loadDeliveryDetails();
    setDelivery({
      ...saved,
      fullName: saved.fullName || user?.fullName || "",
      phone: saved.phone || user?.phone || "",
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    WishlistService.getWishlist()
      .then((wishlist) => {
        const inWishlist = wishlist.some((item: string | { id: string }) =>
          typeof item === "string" ? item === product.id : item.id === product.id
        );
        setIsWishlisted(inWishlist);
      })
      .catch(() => {});
  }, [user, product.id]);

  const handleWhatsAppCheckout = () => {
    checkoutWhatsApp(
      [{
        name: product.name,
        id: product.id,
        quantity: qty,
        price: product.actual,
        image: product.image,
      }],
      product.actual * qty,
      delivery
    );
  };

  const handleAddToCart = () => {
    if (!user) {
      showError("Sign In Required", "Create an account or sign in to add items to your cart.");
      router.push(`/signin?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    addToCart(product, qty);
    showCartToast({ name: product.name, image: product.image, price: product.actual * qty });
    showSuccess("Added to Cart", `${product.name} is ready for checkout.`);
  };

  const handleWishlist = async () => {
    if (!user) {
      showError("Sign In Required", "Please sign in to save fragrances.");
      router.push(`/signin?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    try {
      await WishlistService.toggleWishlist(product.id);
      setIsWishlisted(!isWishlisted);
    } catch (err: unknown) {
      showError("Error", err instanceof Error ? err.message : "Failed to update wishlist.");
    }
  };

  return (
    <main className="min-h-screen bg-surface text-parchment uppercase">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 max-w-6xl">
        <Link
          href="/shop"
          className="inline-block mb-4 sm:mb-6 text-parchment/50 hover:text-parchment transition-colors text-sm"
        >
          ← Back to Shop
        </Link>

        {/* Purchase zone — image + price + actions visible first */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] gap-5 lg:gap-10 items-start">
          {/* Image */}
          <div className="flex items-start gap-4 lg:block">
            <div className="relative flex-shrink-0 w-[110px] h-[130px] sm:w-[140px] sm:h-[165px] lg:w-full lg:h-[220px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 140px, 280px"
                className={`object-contain ${product.status === "sold-out" ? "grayscale opacity-80" : ""}`}
                priority
              />
              <button
                type="button"
                onClick={handleWishlist}
                className="absolute -top-1 -right-1 lg:top-0 lg:right-0 w-8 h-8 bg-elevated text-deep-noir flex items-center justify-center hover:bg-deep-noir hover:text-surface transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Mobile-only quick header beside image */}
            <div className="flex-1 min-w-0 lg:hidden">
              <p className="text-parchment/50 text-[10px] mb-1">{product.tag}</p>
              <h1 className="text-base sm:text-lg text-parchment leading-tight mb-2 line-clamp-2">
                {product.name}
              </h1>
              <p className="text-gold-oud text-base font-bold">
                GH₵ {product.actual}
                {product.original > product.actual && (
                  <span className="text-parchment/30 line-through ml-2 text-xs font-normal">
                    GH₵ {product.original}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Purchase panel */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="hidden lg:block">
              <p className="text-parchment/50 text-xs mb-1">{product.tag}</p>
              <h1 className="text-2xl xl:text-3xl text-parchment leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-gold-oud text-xl mb-1">
                GH₵ {product.actual}
                {product.original > product.actual && (
                  <span className="text-parchment/30 line-through ml-2 text-sm">
                    GH₵ {product.original}
                  </span>
                )}
              </p>
              <p className="text-parchment/40 normal-case text-xs">
                From GH₵ {product.actual} — up to GH₵ {product.original} depending on size &amp; availability
              </p>
            </div>

            {/* Qty + actions — side by side on tablet+ */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-shrink-0">
                <p className="mb-1.5 text-parchment/60 text-[10px]">Qty</p>
                <div className="inline-flex items-center border border-parchment/20">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 hover:bg-parchment/5 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2.5 min-w-[2.5rem] text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2.5 hover:bg-parchment/5 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.status !== "sold-out" && (
                  user ? (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="inline-flex items-center justify-center gap-2 border border-parchment/20 text-parchment px-4 py-2.5 hover:bg-parchment/5 transition-colors text-xs"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart — GH₵ {product.actual * qty}
                    </button>
                  ) : (
                    <Link
                      href={`/signin?returnTo=${encodeURIComponent(returnTo)}`}
                      className="inline-flex items-center justify-center gap-2 border border-parchment/20 text-parchment px-4 py-2.5 hover:bg-parchment/5 transition-colors text-xs"
                    >
                      <User size={14} />
                      Sign In to Add to Cart
                    </Link>
                  )
                )}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 hover:opacity-90 transition-opacity text-xs"
                >
                  <MessageCircle size={14} />
                  Checkout on WhatsApp
                </button>
              </div>
            </div>

            <DeliveryDetailsForm value={delivery} onChange={setDelivery} />

            {/* Account strip — compact */}
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 border border-gold-oud/30 bg-gold-oud/5 px-3 py-2.5 hover:bg-gold-oud/10 transition-colors normal-case w-fit"
              >
                <Package size={14} className="text-gold-oud flex-shrink-0" />
                <span className="text-xs text-parchment/80">
                  Track orders in your <span className="text-gold-oud font-bold">dashboard</span>
                </span>
              </Link>
            ) : (
              <div className="normal-case w-fit max-w-full">
                <p className="text-xs text-parchment/65 leading-relaxed mb-2.5">
                  WhatsApp checkout — no account needed. Sign up to add to cart &amp; track orders.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
                    className="inline-flex items-center justify-center bg-gold-oud text-deep-noir px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Create Account
                  </Link>
                  <Link
                    href={`/signin?returnTo=${encodeURIComponent(returnTo)}`}
                    className="inline-flex items-center justify-center border border-parchment/25 text-parchment px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-parchment/5 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product story */}
        <section className="mt-8 lg:mt-10 pt-8 border-t border-parchment/10 normal-case">
          <h2 className="font-poppins text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-oud mb-4">
            About this scent
          </h2>

          <p className="font-lora text-[17px] sm:text-[19px] text-parchment leading-[1.65] max-w-2xl">
            {product.desc}
          </p>

          <p className="mt-4 font-poppins text-[13px] text-parchment/70 leading-relaxed max-w-2xl">
            <span className="text-parchment font-semibold">Perfect for</span>
            <span className="text-parchment/40 mx-2">·</span>
            {product.perfectOccasion}
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {product.whenToApply?.length > 0 && (
              <div className="lg:col-span-3">
                <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.18em] text-parchment/50 mb-3 flex items-center gap-2">
                  <Clock size={12} className="text-gold-oud" />
                  When to wear it
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {product.whenToApply.map((w, i) => {
                    const IconComp = productIconMap[w.icon] || Clock;
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center text-center border border-parchment/12 bg-elevated px-2 py-4 sm:px-3 sm:py-5"
                      >
                        <IconComp size={18} className="text-gold-oud mb-2" strokeWidth={1.5} />
                        <span className="font-poppins text-[11px] font-semibold text-parchment leading-tight">
                          {w.label}
                        </span>
                        <span className="font-poppins text-[10px] text-parchment/50 mt-1 leading-snug">
                          {w.detail}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {product.pros?.length > 0 && (
              <div className={product.whenToApply?.length ? "lg:col-span-2" : "lg:col-span-5"}>
                <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.18em] text-parchment/50 mb-3">
                  Highlights
                </p>
                <ul className="space-y-2.5 border border-parchment/12 bg-elevated px-4 py-4 sm:px-5 sm:py-5">
                  {product.pros.slice(0, 4).map((pro) => (
                    <li key={pro} className="flex items-start gap-2.5 font-poppins text-[13px] text-parchment/75 leading-relaxed">
                      <CheckCircle2 size={14} className="text-gold-oud flex-shrink-0 mt-0.5" strokeWidth={2} />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Delivery — always visible, one line */}
        <p className="mt-5 pt-4 border-t border-parchment/10 text-parchment/45 normal-case text-xs leading-relaxed">
          Delivery in Takoradi &amp; nationwide on request · Studio pickup: Takoradi, Ghana · WhatsApp 0506626068
        </p>
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetailView;
