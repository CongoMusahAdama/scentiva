"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/lib/hooks/useProducts";
import { WHATSAPP_NUMBER } from "@/lib/delivery";

const categories = [
  { key: "all", label: "All" },
  { key: "mens", label: "Men" },
  { key: "womens", label: "Women" },
  { key: "unisex", label: "Unisex" },
  { key: "gift", label: "Gifts" },
];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { products: allProducts } = useProducts();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");

  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allProducts, activeCategory, search]);

  const clearFilters = () => {
    setActiveCategory("all");
    setSearch("");
  };

  const hasActiveFilters = activeCategory !== "all" || search.trim() !== "";

  return (
    <main className="min-h-screen bg-surface text-parchment">
      <Navbar />

      {/* Hero */}
      <section className="relative h-48 md:h-56 flex items-end overflow-hidden bg-surface">
        <Image
          src="/perfume9.jpg"
          alt="Shop Banner"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/40 to-black/20 z-10" />
        <div className="relative z-20 container mx-auto px-6 pb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Shop</h1>
          <p className="text-white/80 text-sm max-w-md normal-case">
            Browse → Pick a scent → Order on WhatsApp. Simple.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 pt-8 pb-20">
        {/* Trust strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-parchment/50 text-xs normal-case mb-8 pb-6 border-b border-parchment/10">
          <span>All prices in GH₵</span>
          <span>·</span>
          <span>Pay on delivery or MoMo</span>
          <span>·</span>
          <span>We confirm on WhatsApp</span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#25D366] hover:opacity-80 transition-opacity ml-auto"
          >
            <MessageCircle size={14} />
            Chat with us
          </a>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-shrink-0 px-4 py-2 text-sm normal-case border transition-colors ${
                activeCategory === cat.key
                  ? "bg-gold-oud text-deep-noir border-gold-oud"
                  : "border-parchment/15 text-parchment/60 hover:border-parchment/30 hover:text-parchment"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search + count */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment/40" />
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-parchment/5 border border-parchment/10 text-parchment placeholder-parchment/30 text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-gold-oud/50 transition-colors normal-case"
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-parchment/40 normal-case">
            <span>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-gold-oud hover:text-parchment transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 normal-case">
            <p className="text-parchment/50 text-sm mb-4">No products match your search.</p>
            <button
              onClick={clearFilters}
              className="text-gold-oud text-sm border border-gold-oud/30 px-6 py-2.5 hover:bg-gold-oud/10 transition-colors"
            >
              Show all products
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product, index) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: (index % 4) * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <div className="text-center py-10 border-t border-parchment/5">
        <Link
          href="/"
          className="text-parchment/40 hover:text-gold-oud text-xs uppercase tracking-widest transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
