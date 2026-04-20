"use client";

import React from "react";
import { AlertCircle, Target, UserX } from "lucide-react";
import { motion } from "framer-motion";

const ProblemSection = () => {
  const points = [
    {
      icon: <Target className="text-gold-oud" size={32} />,
      title: "Mass Market Mismatch",
      text: "Most people buy based on a 5-second smell or a price tag, ignoring how it lives on their skin.",
    },
    {
      icon: <UserX className="text-gold-oud" size={32} />,
      title: "Impactless Impressions",
      text: "Not every fragrance suits every lifestyle. Wearing a gym scent to a gala feels out of place.",
    },
    {
      icon: <AlertCircle className="text-gold-oud" size={32} />,
      title: "Lost Identity",
      text: "The wrong scent can feel like a costume rather than a second skin. It should represent you.",
    },
  ];

  return (
    <section className="py-24 bg-deep-noir border-y border-parchment/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-sm uppercase tracking-[0.4em] text-gold-oud mb-4">The Challenge</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-3xl md:text-5xl font-serif text-parchment">
              Choosing the wrong scent is common
            </h3>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
          {points.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-6 group"
            >
              <div className="p-6 rounded-full border border-parchment/10 group-hover:border-gold-oud/40 transition-colors duration-500">
                {item.icon}
              </div>
              <h4 className="text-xl font-serif text-parchment">{item.title}</h4>
              <p className="text-parchment/50 font-sans leading-relaxed text-sm">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
