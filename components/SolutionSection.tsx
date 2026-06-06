"use client";

import React from "react";
import { motion } from "framer-motion";

const SolutionSection = () => {
  return (
    <section id="approach" className="py-24 bg-surface">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl text-center space-y-8"
        >
          <h2 className="text-sm uppercase tracking-[0.4em] text-gold-oud">Our Approach</h2>
          <h3 className="text-4xl md:text-6xl font-serif text-parchment leading-tight">
            We help you <span className="italic">choose better</span>
          </h3>
          <p className="text-lg md:text-xl text-parchment/60 font-sans leading-relaxed">
            Every Scentiva Aura fragrance is designed with purpose — based on personality, occasion, and lifestyle. We don't just sell smells; we curate identities.
          </p>
          <div className="pt-8">
            <button className="border-b border-gold-oud pb-1 text-gold-oud uppercase tracking-widest text-xs font-bold hover:text-parchment hover:border-parchment transition-all transition-duration-300">
              Discover Our Method
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
