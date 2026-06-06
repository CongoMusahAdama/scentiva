"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ScrollEyebrow, ScrollHeading } from "@/components/ScrollReveal";

const categories = [
  {
    id: "mens",
    name: "Men's Perfumes",
    tag: "Bold & Masculine",
    image: "/men.png",
  },
  {
    id: "womens",
    name: "Women's Perfumes",
    tag: "Elegant & Floral",
    image: "/women.png",
  },
  {
    id: "unisex",
    name: "Unisex Body Sprays",
    tag: "Fresh & Versatile",
    image: "/unisex.png",
  },
  {
    id: "gift",
    name: "Gift Bundles",
    tag: "Curated Sets",
    image: "/gift.png",
  }
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <ScrollEyebrow className="text-sm uppercase tracking-[0.4em] text-gold-oud mb-4">
              Our Collections
            </ScrollEyebrow>
            <ScrollHeading
              as="h3"
              delay={0.12}
              className="text-4xl md:text-5xl font-serif text-parchment leading-tight"
            >
              Curated for every identity
            </ScrollHeading>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group relative h-[500px] overflow-hidden bg-elevated border border-parchment/5 cursor-pointer"
            >
              <Link href={`/shop?category=${cat.id}`} className="absolute inset-0 z-10" aria-label={`View ${cat.name}`} />
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-oud mb-2">
                  {cat.tag}
                </p>
                <h4 className="text-2xl font-serif text-white mb-6">{cat.name}</h4>
                
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-gold-oud group-hover:border-gold-oud group-hover:text-deep-noir transition-all duration-500">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
