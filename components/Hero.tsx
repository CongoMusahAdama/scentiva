"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-deep-noir">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 text-amber-50">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-noir/40 via-transparent to-deep-noir/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-noir/60 via-transparent to-deep-noir/20 z-10" />
        <Image
          src="/image.png"
          alt="Scentiva Aura Hero"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 15%' }}
          priority
        />
      </div>

      <div className="container mx-auto px-6 relative z-20 md:pt-0 pt-64">
        <div className="max-w-2xl md:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Mask Reveal for Headline */}
            <div className="overflow-hidden mb-6">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-parchment leading-tight tracking-tight"
              >
                Own Your <br />
                <span className="italic text-shimmer">Scent</span>
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-parchment/60 font-sans max-w-md mb-10 leading-relaxed"
            >
              Not every fragrance fits every lifestyle. Discover scents made for you, 
              designed with purpose and high-quality in every drop.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex flex-row gap-4 pt-10">
                <button className="px-8 py-4 bg-gold-oud text-deep-noir text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-parchment transition-all duration-500 shadow-2xl">
                  Shop Now
                </button>
                <button 
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-transparent border border-parchment/20 text-parchment text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-parchment/5 hover:border-parchment/40 transition-all duration-500"
                >
                  Products
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold-oud/60 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
