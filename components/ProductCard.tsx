"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { getProductHref } from "@/lib/product-utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  const discount = Math.round(
    ((product.original - product.actual) / product.original) * 100
  );
  const href = getProductHref(product);

  return (
    <Link href={href} className={`group block uppercase ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-parchment/5 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            product.status === "sold-out" ? "grayscale opacity-70" : ""
          }`}
        />

        {product.status === "sold-out" && (
          <span className="absolute top-2 left-2 bg-rose-600 text-white px-2 py-0.5 z-10">
            Sold Out
          </span>
        )}
        {discount > 0 && product.status !== "sold-out" && (
          <span className="absolute top-2 right-2 bg-gold-oud text-deep-noir px-2 py-0.5 z-10">
            -{discount}%
          </span>
        )}

        {/* Desktop hover — View Details */}
        <div className="absolute inset-0 hidden md:flex items-end justify-center p-4 bg-surface/0 group-hover:bg-surface/30 transition-colors duration-300">
          <span className="w-full text-center bg-elevated text-deep-noir border border-parchment/10 py-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View Details
          </span>
        </div>
      </div>

      <p className="text-parchment/50 mb-1">{product.tag}</p>
      <h3 className="text-parchment leading-tight mb-1">{product.name}</h3>
      <div className="flex items-center gap-2">
        <span className="text-gold-oud">GH₵ {product.actual}</span>
        {product.original > product.actual && (
          <span className="text-parchment/30 line-through">GH₵ {product.original}</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
