"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductModal from "@/components/ProductModal";
import type { Product } from "@/components/ProductModal";
import { allProducts } from "@/lib/products";

// ─── Filter Config ──────────────────────────────────────────────────────────
const categories = [
  { key: "all",    label: "All Products" },
  { key: "mens",   label: "Men's Perfumes" },
  { key: "womens", label: "Women's Perfumes" },
  { key: "unisex", label: "Unisex Body Sprays" },
  { key: "gift",   label: "Gift Bundles" },
];

const markets = [
  { key: "all",           label: "All Audiences" },
  { key: "students",      label: "Students" },
  { key: "youth",         label: "Youth" },
  { key: "professionals", label: "Young Professionals" },
  { key: "men-women",     label: "Men & Women 18–40" },
  { key: "gift-buyers",   label: "Gift Buyers" },
  { key: "salons",        label: "Salons & Barbers" },
];

const sortOptions = [
  { key: "default",     label: "Featured" },
  { key: "price-asc",  label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name",        label: "Name A–Z" },
];

const categoryBadge: Record<string, string> = {
  mens:   "bg-blue-900/50 text-blue-200 border-blue-700/40",
  womens: "bg-rose-900/50 text-rose-200 border-rose-700/40",
  unisex: "bg-emerald-900/50 text-emerald-200 border-emerald-700/40",
  gift:   "bg-amber-900/50 text-amber-200 border-amber-700/40",
};

// Extend product type to include target for filtering (lib/products doesn't include target market)
const productsWithTarget = allProducts.map((p) => ({
  ...p,
  target: (() => {
    const map: Record<string, string[]> = {
      "SA-001": ["youth","professionals","men-women"],
      "SA-002": ["youth","students","men-women"],
      "SA-003": ["students","youth","men-women"],
      "SA-004": ["professionals","men-women","salons"],
      "SA-005": ["youth","men-women","salons"],
      "SA-006": ["students","youth"],
      "SA-007": ["professionals","men-women"],
      "SA-008": ["youth","men-women","gift-buyers"],
      "SA-009": ["students","youth","salons"],
      "SA-010": ["professionals","men-women"],
      "SA-011": ["students","youth","men-women"],
      "SA-012": ["gift-buyers","professionals"],
      "SA-013": ["students","youth","men-women"],
      "SA-014": ["students","youth","salons"],
      "SA-015": ["gift-buyers","professionals","men-women"],
      "SA-016": ["students","youth"],
    };
    return (map as Record<string, string[]>)[p.id] ?? [];
  })(),
}));

import { useSearchParams } from "next/navigation";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeMarket,   setActiveMarket]   = useState("all");
  const [sortBy,         setSortBy]         = useState("default");
  const [search,         setSearch]         = useState("");
  const [showFilters,    setShowFilters]     = useState(false);
  const [sortOpen,       setSortOpen]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Update category if query param changes
  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...productsWithTarget];
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
    if (activeMarket    !== "all") list = list.filter((p) => p.target.includes(activeMarket));
    if (search.trim())             list = list.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "price-asc")  list.sort((a, b) => a.actual - b.actual);
    if (sortBy === "price-desc") list.sort((a, b) => b.actual - a.actual);
    if (sortBy === "name")       list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, activeMarket, sortBy, search]);

  const clearFilters = () => {
    setActiveCategory("all"); setActiveMarket("all");
    setSearch(""); setSortBy("default");
  };

  const hasActiveFilters = activeCategory !== "all" || activeMarket !== "all" || search.trim() !== "";

  return (
    <main className="min-h-screen bg-deep-noir text-parchment">
      <Navbar />

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-deep-noir z-10" />
        <Image src="/perfume9.jpg" alt="Shop Banner" fill className="object-cover object-center opacity-50" />
        <div className="relative z-20 text-center px-6">
          <p className="text-gold-oud text-xs uppercase tracking-[0.4em] mb-3">Scentiva Aura</p>
          <h1 className="text-4xl md:text-6xl font-serif text-parchment mb-4">The Shop</h1>
          <p className="text-parchment/60 text-sm md:text-base max-w-lg mx-auto">
            Discover fragrances crafted for every personality, occasion, and lifestyle.
          </p>
        </div>
      </section>

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/40" />
            <input
              type="text"
              placeholder="Search fragrances…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-parchment/10 text-parchment placeholder-parchment/30 text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold-oud/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-parchment/15 text-parchment/70 hover:text-gold-oud hover:border-gold-oud/40 px-4 py-3 text-xs uppercase tracking-widest transition-colors md:hidden"
            >
              <SlidersHorizontal size={14} />
              Filters {hasActiveFilters && <span className="bg-gold-oud text-deep-noir text-[9px] font-bold px-1.5 py-0.5 rounded-full">ON</span>}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 border border-parchment/15 text-parchment/70 hover:text-gold-oud hover:border-gold-oud/40 px-4 py-3 text-xs uppercase tracking-widest transition-colors"
              >
                {sortOptions.find(s => s.key === sortBy)?.label}
                <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-[#16161a] border border-parchment/10 w-52 shadow-2xl">
                  {sortOptions.map((opt) => (
                    <button key={opt.key} onClick={() => { setSortBy(opt.key); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-white/5 hover:text-gold-oud transition-colors ${sortBy === opt.key ? "text-gold-oud" : "text-parchment/60"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-parchment/40 text-xs uppercase tracking-widest">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-gold-oud text-xs uppercase tracking-widest hover:text-parchment transition-colors">
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Main Layout: sticky sidebar + scrollable grid ──────────────── */}
        <div className="flex gap-10 items-start pb-20">

          {/* ── Sidebar — fixed position while scrolling on desktop ─────── */}
          <aside className={`
            flex-shrink-0 w-64
            ${showFilters ? "fixed inset-0 z-50 bg-deep-noir p-6 overflow-y-auto no-scrollbar" : "hidden"}
            md:block md:sticky md:top-28 md:self-start md:h-[calc(100vh-8rem)] md:overflow-y-auto no-scrollbar
          `}>
            {/* Mobile close */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <span className="text-sm font-serif text-parchment">Filters</span>
              <button onClick={() => setShowFilters(false)} className="text-parchment/60 hover:text-parchment">
                <X size={20} />
              </button>
            </div>

            {/* Product Type */}
            <div className="mb-8">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold-oud mb-4">Product Type</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button key={cat.key}
                    onClick={() => { setActiveCategory(cat.key); setShowFilters(false); }}
                    className={`text-left text-sm py-2 px-3 border transition-all duration-200 ${
                      activeCategory === cat.key
                        ? "border-gold-oud text-gold-oud bg-gold-oud/5"
                        : "border-parchment/10 text-parchment/50 hover:border-parchment/30 hover:text-parchment/80"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop For */}
            <div className="mb-8">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold-oud mb-4">Shop For</h3>
              <div className="flex flex-col gap-2">
                {markets.map((m) => (
                  <button key={m.key}
                    onClick={() => { setActiveMarket(m.key); setShowFilters(false); }}
                    className={`text-left text-sm py-2 px-3 border transition-all duration-200 ${
                      activeMarket === m.key
                        ? "border-gold-oud text-gold-oud bg-gold-oud/5"
                        : "border-parchment/10 text-parchment/50 hover:border-parchment/30 hover:text-parchment/80"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range info */}
            <div className="border border-parchment/10 p-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold-oud mb-3">Price Range</h3>
              <p className="text-parchment/40 text-xs">GH₵ 215 — GH₵ 520</p>
              <div className="mt-2 text-[9px] text-parchment/25 uppercase tracking-widest">All prices in Ghana Cedis</div>
              <div className="mt-3 h-px bg-gradient-to-r from-gold-oud/60 to-transparent" />
            </div>
          </aside>

          {/* ── Product Grid ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-white/5 border border-parchment/10 rounded-full">
                    <Search size={48} className="text-gold-oud/40" strokeWidth={1} />
                  </div>
                </div>
                <p className="text-parchment/50 text-sm uppercase tracking-widest mb-4">No products match your filters</p>
                <button onClick={clearFilters} className="text-gold-oud text-xs uppercase tracking-widest border border-gold-oud/30 px-6 py-3 hover:bg-gold-oud/10 transition-colors">
                  Reset Filters
                </button>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, index) => {
                    const discount = Math.round(((product.original - product.actual) / product.original) * 100);
                    const fadeIn = {
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0 },
                      transition: { duration: 0.8, ease: "easeOut" as const }
                    };
                    return (
                      <motion.div
                        layout
                        key={product.id}
                        {...fadeIn}
                        exit={{ opacity: 0, scale: 0.9 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ 
                          duration: 0.6, 
                          delay: (index % 4) * 0.1,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        whileHover={{ y: -8 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-4">
                          <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-deep-noir/25 group-hover:bg-deep-noir/5 transition-colors duration-500" />

                          {/* Category badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`px-2 py-1 text-[9px] uppercase tracking-widest border backdrop-blur-sm rounded-sm ${categoryBadge[product.category]}`}>
                              {product.tag}
                            </span>
                          </div>

                          {/* Discount badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-gold-oud text-deep-noir text-[9px] font-bold px-2 py-0.5 rounded-sm">
                              -{discount}%
                            </span>
                          </div>

                          {/* Hover overlay — "Tap to explore" */}
                          <div className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full bg-parchment/95 text-deep-noir py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl">
                              Order via WhatsApp
                            </div>
                            <div className="mt-2 text-[8px] text-white/40 uppercase tracking-[0.2em] font-medium">WhatsApp Orders Only</div>
                          </div>
                        </div>

                        <div className="px-1">
                          <h4 className="text-sm font-serif text-parchment leading-tight mb-1">{product.name}</h4>
                          <p className="text-[10px] text-parchment/40 leading-relaxed line-clamp-2 mb-2">{product.desc}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-gold-oud">GH₵ {product.actual}</span>
                            <span className="text-xs text-parchment/30 line-through">GH₵ {product.original}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Coming Soon ─────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-parchment/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gold-oud text-xs uppercase tracking-[0.4em] mb-4">Coming Soon</p>
          <h2 className="text-3xl font-serif text-parchment mb-4">Jewelry for Him & Her</h2>
          <p className="text-parchment/40 text-sm max-w-md mx-auto mb-8">
            We&apos;re curating a premium collection of jewelry pieces to complement your signature scent. Stay tuned.
          </p>
          <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="Your email for early access"
              className="flex-1 bg-white/5 border border-parchment/10 text-parchment placeholder-parchment/30 text-sm px-4 py-3 focus:outline-none focus:border-gold-oud/50 transition-colors"
            />
            <button className="bg-gold-oud text-deep-noir px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-parchment transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </div>
      </section>

      <div className="text-center py-10">
        <Link href="/" className="text-parchment/40 hover:text-gold-oud text-xs uppercase tracking-widest transition-colors">
          ← Back to Home
        </Link>
      </div>

      {/* ── Product Modal ───────────────────────────────────────────────── */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}
