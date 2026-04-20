"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  X, CheckCircle2, AlertCircle, Clock, ShoppingCart, 
  Moon, Heart, Landmark, Sun, GraduationCap, Briefcase, 
  Sunrise, Dumbbell, Backpack, Scissors, PartyPopper, ShoppingBag, Gift, MessageCircle 
} from "lucide-react";
import { useCart } from "@/context/CartContext";

// Add a helper for the icon mapping
const iconMap: Record<string, React.ElementType> = {
  Moon, Heart, Landmark, Sun, GraduationCap, Briefcase, 
  Sunrise, Dumbbell, Backpack, Scissors, PartyPopper, ShoppingBag, Gift
};

export type Product = {
  id: string;
  name: string;
  actual: number;
  original: number;
  tag: string;
  category: string;
  image: string;
  desc: string;
  pros: string[];
  cons: string[];
  whenToApply: { icon: string; label: string; detail: string }[];
  perfectOccasion: string;
};

type Props = {
  product: Product | null;
  onClose: () => void;
};

const categoryColor: Record<string, string> = {
  mens:   "bg-blue-900/50 text-blue-200 border-blue-700/40",
  womens: "bg-rose-900/50 text-rose-200 border-rose-700/40",
  unisex: "bg-emerald-900/50 text-emerald-200 border-emerald-700/40",
  gift:   "bg-amber-900/50 text-amber-200 border-amber-700/40",
};

const ProductModal = ({ product, onClose }: Props) => {
  const { addToCart, showToast } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} added to bag!`);
    onClose();
  };

  const discount = Math.round(((product.original - product.actual) / product.original) * 100);

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* ── Panel ── */}
      <div
        className="
          relative w-full md:max-w-4xl
          bg-[#111114] border-t md:border border-parchment/10
          rounded-t-2xl md:rounded-xl
          max-h-[92vh] overflow-y-auto no-scrollbar
          shadow-2xl
        "
        style={{ animation: "slide-up-modal 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-parchment/20" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-parchment/10 hover:bg-parchment/20 text-parchment p-2 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* ── Left: Image ── */}
          <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-tl-xl rounded-bl-xl"
            />
            {/* Gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent md:bg-gradient-to-r" />
            {/* Discount badge on image */}
            <div className="absolute top-4 left-4">
              <span className="bg-gold-oud text-deep-noir text-[10px] font-bold px-2.5 py-1 rounded-sm">
                -{discount}% OFF
              </span>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 overflow-y-auto no-scrollbar">
            {/* Top: Name + Category + Price */}
            <div>
              <div className="flex items-center gap-3">
                <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest border rounded-sm ${categoryColor[product.category]}`}>
                  {product.tag}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-parchment/30">
                  SKU: {product.id}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-parchment mb-2">{product.name}</h2>
              <p className="text-parchment/50 text-sm leading-relaxed mb-3">{product.desc}</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gold-oud">GH₵ {product.actual}</span>
                <span className="text-sm text-parchment/30 line-through">GH₵ {product.original}</span>
                <span className="text-xs text-emerald-400 font-semibold">Save GH₵ {product.original - product.actual}</span>
              </div>
              {/* Perfect Occasion Badge */}
              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-gold-oud/5 border border-gold-oud/20 rounded-lg w-fit">
                <Sunrise size={14} className="text-gold-oud" />
                <span className="text-[10px] uppercase tracking-widest text-parchment/80">
                  Perfect for: <span className="text-gold-oud font-bold">{product.perfectOccasion}</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-parchment/8" />

            {/* Pros */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold-oud mb-3 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" /> Highlights
              </h3>
              <ul className="flex flex-col gap-2">
                {product.pros.slice(0, 3).map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-parchment/70 leading-relaxed">
                    <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* When to Apply */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold-oud mb-3 flex items-center gap-2">
                <Clock size={12} /> Best Time to Wear
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.whenToApply.map((w, i) => {
                  const IconComp = iconMap[w.icon] || Clock;
                  return (
                    <div key={i} className="bg-white/5 border border-parchment/8 rounded-lg p-3 text-center flex flex-col items-center">
                      <div className="text-gold-oud mb-2">
                        <IconComp size={20} strokeWidth={1.5} />
                      </div>
                      <div className="text-[10px] font-bold text-parchment uppercase tracking-widest leading-tight">{w.label}</div>
                      <div className="text-[9px] text-parchment/40 mt-1 leading-tight">{w.detail}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 mt-4">
              <a 
                href={`https://wa.me/233506626068?text=Hello Scentiva, I would like to order: ${product.name} (SKU: ${product.id})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 rounded-lg group shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle size={18} fill="white" className="animate-pulse" />
                Order via WhatsApp
              </a>
              
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gold-oud text-deep-noir py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-parchment transition-colors duration-300 rounded-sm"
              >
                <ShoppingCart size={15} />
                Add to Bag — GH₵ {product.actual}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
