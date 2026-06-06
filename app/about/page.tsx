"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Zap, Heart, ShieldCheck } from "lucide-react";

const AboutPage = () => {
  const maskReveal = {
    initial: { y: "100%" },
    whileInView: { y: 0 },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  return (
    <main className="min-h-screen bg-surface text-parchment overflow-x-hidden">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <Image 
            src="/hero1.jpg" 
            alt="Scentiva Craft" 
            fill 
            className="object-cover opacity-50"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-center">
          <div className="overflow-hidden mb-4">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-serif leading-none text-white"
            >
              The Beginning of <br /> <span className="italic text-shimmer">Scentiva Aura</span>
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-oud font-bold"
          >
            A New Dawn in Fragrance • Launching from Takoradi
          </motion.p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold-oud mb-8 font-bold">The First Chapter</h2>
            <div className="space-y-6 text-parchment/70 font-sans text-lg leading-relaxed">
              <p>
                Scentiva Aura is the start of something meaningful. Born from a simple mission in Takoradi, we are just beginning our journey to redefine how fragrance is experienced.
              </p>
              <p>
                We aren't just launching a product; we are introducing a silent language. As we take our first steps, we set out to bridge the gap between everyday scents and the high-end luxury you deserve—starting with pure, intentional ingredients.
              </p>
              <p className="italic text-gold-oud/80">
                Join us as we write the first pages of our story.
              </p>
            </div>
          </motion.div>
          
          <div className="relative">
            {/* Reduced height aspect ratio */}
            <div className="aspect-[3/2] relative overflow-hidden rounded-sm border border-parchment/10">
              <Image 
                src="/about.jpg" 
                alt="Founder Vision" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            {/* Gold Accent Frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold-oud/20 -z-10" />
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-2xl md:text-4xl font-serif mb-6">Our Foundational Promises</h2>
            <p className="text-parchment/50">As we grow, these core pillars remain the heartbeat of every fragrance we create.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Pure Ingredients", desc: "No compromises. Every drop is sourced for richness and skin-friendly depth." },
              { icon: Zap, title: "Longevity First", desc: "We are perfecting the craft of scents that stay with you through the day." },
              { icon: Heart, title: "Intentional Design", desc: "Crafting bottles and scents that mirror the lifestyle you're building." },
              { icon: ShieldCheck, title: "Growing Excellence", desc: "We are committed to refining our craft with every single bottle we fill." },
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="p-8 border border-parchment/5 hover:border-gold-oud/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-gold-oud/10 flex items-center justify-center rounded-full mb-6 group-hover:bg-gold-oud group-hover:text-deep-noir transition-all">
                  <value.icon size={24} />
                </div>
                <h3 className="text-lg font-serif mb-3 tracking-wide">{value.title}</h3>
                <p className="text-sm text-parchment/40 leading-relaxed font-sans">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual Philosophy ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image 
            src="/hero1.jpg" 
            alt="Atmosphere" 
            fill 
            className="object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl md:text-5xl font-serif italic mb-8 text-shimmer">"Authenticity is the <br /> ultimate fragrance."</h2>
            <div className="w-20 h-px bg-gold-oud mx-auto mb-8" />
            <p className="max-w-xl mx-auto text-parchment/50 leading-relaxed italic">
              From our roots in Takoradi to your daily routine, we are here to help you own your scent from day one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-parchment/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif mb-10 text-parchment/60">Be part of our first collection</h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <a 
              href="/shop" 
              className="px-16 py-6 bg-gold-oud text-deep-noir font-bold uppercase tracking-[0.2em] text-xs hover:bg-deep-noir hover:text-surface transition-all duration-500 shadow-2xl block"
            >
              Explore Launch Collection
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
