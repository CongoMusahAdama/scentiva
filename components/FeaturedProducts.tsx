"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/lib/hooks/useProducts";
import { ScrollEyebrow, ScrollHeading, ScrollText } from "@/components/ScrollReveal";

const FeaturedProducts = () => {
  const { products: allProducts } = useProducts();
  const products = allProducts.slice(0, 12);

  return (
    <section className="py-16 md:py-20 bg-surface" id="shop">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <ScrollEyebrow className="text-parchment/50 mb-2 uppercase">Latest drops</ScrollEyebrow>
            <ScrollHeading className="text-parchment text-lg md:text-2xl uppercase">
              Featured Fragrances
            </ScrollHeading>
            <ScrollText
              delay={0.22}
              className="text-parchment/50 mt-2 max-w-md normal-case"
            >
              Designer men&apos;s fragrances, feminine scents, and everyday body sprays.
            </ScrollText>
          </div>
          <Link
            href="/shop"
            className="text-parchment/60 hover:text-gold-oud transition-colors flex items-center gap-1 uppercase"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 5) * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gold-oud text-deep-noir px-8 py-3 uppercase hover:bg-deep-noir hover:text-surface transition-colors"
          >
            <ShoppingCart size={16} />
            Explore Full Shop
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
