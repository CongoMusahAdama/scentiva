"use client";

import React from "react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="py-32 bg-[#0A0A0B] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-oud/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-6xl font-serif text-parchment leading-tight">
              Discover your identity <br /> through scent
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-parchment/50 font-sans text-lg md:text-xl"
          >
            Join the exclusive world of Scentiva Aura and find the fragrance that truly represents who you are.
          </motion.p>
          <div className="pt-6">
            <button className="px-14 py-5 bg-gold-oud text-deep-noir font-bold uppercase tracking-[0.2em] text-sm hover:bg-parchment transition-all duration-500 shadow-2xl">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
// Fixed syntax mismatch
