"use client";

import React from "react";
import { Sun, Moon, Briefcase, Zap } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Daily Wear",
    icon: <Sun size={24} />,
    desc: "Light, fresh, and effortlessly elegant for your everyday routine.",
  },
  {
    title: "Date Night",
    icon: <Moon size={24} />,
    desc: "Seductive tones and mysterious layers for unforgettable evenings.",
  },
  {
    title: "Office",
    icon: <Briefcase size={24} />,
    desc: "Clean, professional scents that command respect without shouting.",
  },
  {
    title: "Bold & Statement",
    icon: <Zap size={24} />,
    desc: "Daring compositions for those who aren't afraid to stand out.",
  },
];

const DiscoverySection = () => {
  return (
    <section className="py-24 bg-[#0F0F12]">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mb-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-sm uppercase tracking-[0.4em] text-gold-oud mb-4">Discovery</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-4xl font-serif text-parchment leading-tight">Find what suits you</h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group p-10 border border-parchment/5 bg-deep-noir hover:bg-[#151518] hover:border-gold-oud/30 transition-all duration-500 cursor-pointer"
            >
              <div className="text-gold-oud mb-8 group-hover:scale-110 transition-transform duration-500">
                {cat.icon}
              </div>
              <h4 className="text-xl font-serif text-parchment mb-4">{cat.title}</h4>
              <p className="text-parchment/40 text-sm font-sans leading-relaxed mb-8">
                {cat.desc}
              </p>
              <div className="w-8 h-[1px] bg-parchment/20 group-hover:w-full group-hover:bg-gold-oud transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverySection;
