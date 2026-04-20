"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import ProductModal from "@/components/ProductModal";
import type { Product } from "@/components/ProductModal";
import { allProducts } from "@/lib/products";

// Show only the latest 15
const products = allProducts.slice(0, 15);

const categoryColors: Record<string, string> = {
  mens:   "bg-blue-900/60 text-blue-200 border-blue-700/40",
  womens: "bg-rose-900/60 text-rose-200 border-rose-700/40",
  unisex: "bg-emerald-900/60 text-emerald-200 border-emerald-700/40",
  gift:   "bg-amber-900/60 text-amber-200 border-amber-700/40",
};

const FeaturedProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <section className="py-24 bg-deep-noir" id="shop">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 overflow-hidden">
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-sm uppercase tracking-[0.4em] text-gold-oud mb-2">Curated Selection</h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-4xl font-serif text-parchment">Exquisite Masterpieces</h3>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-parchment/50 text-sm mt-3 max-w-md"
              >
                Our latest 1 arrivals — from bold men&apos;s ouds to soft women&apos;s florals and ready-to-gift bundles.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                href="/shop"
                className="group flex items-center gap-2 text-parchment/60 hover:text-gold-oud transition-colors text-sm uppercase tracking-widest border-b border-parchment/10 hover:border-gold-oud pb-1"
              >
                View All
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map((product, index) => {
              const discount = Math.round(((product.original - product.actual) / product.original) * 100);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: (index % 5) * 0.1,
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-4 group">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-deep-noir/20 group-hover:bg-deep-noir/5 transition-colors duration-500" />

                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest border backdrop-blur-sm rounded-sm ${categoryColors[product.category]}`}>
                        {product.tag}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="bg-gold-oud text-deep-noir text-[9px] font-bold px-2 py-0.5 rounded-sm">
                        -{discount}%
                      </span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full bg-parchment text-deep-noir py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gold-oud transition-colors shadow-xl">
                        Order on WhatsApp
                      </div>
                      <div className="mt-2 text-[8px] text-white/40 uppercase tracking-[0.2em] font-medium">WhatsApp Orders Only</div>
                    </div>
                  </div>

                  <div className="px-1">
                    <h4 className="text-sm font-serif text-parchment mb-0.5 leading-tight">{product.name}</h4>
                    <p className="text-[10px] text-parchment/40 uppercase tracking-widest mb-1.5">{product.tag}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gold-oud">GH₵ {product.actual}</span>
                      <span className="text-xs text-parchment/30 line-through">GH₵ {product.original}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-gold-oud text-deep-noir px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-parchment transition-colors duration-300"
            >
              <ShoppingCart size={16} />
              Explore Full Shop
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Product modal — outside section so it can cover whole page */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
};

export default FeaturedProducts;
