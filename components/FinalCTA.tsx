"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollHeading, ScrollText } from "@/components/ScrollReveal";

const FinalCTA = () => {
  return (
    <section id="cta" className="py-32 bg-surface relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-oud/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <ScrollHeading className="text-4xl md:text-6xl font-serif text-parchment leading-tight text-center">
            Discover your identity <br /> through scent
          </ScrollHeading>
          <ScrollText
            delay={0.25}
            className="text-parchment/50 font-sans text-lg md:text-xl text-center"
          >
            Join the exclusive world of Scentiva Aura and find the fragrance that truly represents who you are.
          </ScrollText>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 text-center"
          >
            <button className="px-14 py-5 bg-gold-oud text-deep-noir font-bold uppercase tracking-[0.2em] text-sm hover:bg-deep-noir hover:text-surface transition-all duration-500 shadow-2xl">
              Shop Now
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
// Fixed syntax mismatch
