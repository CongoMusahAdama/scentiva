"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Elena Rossi",
    role: "Lifestyle Curator",
    text: "Oud Noir is transformative. It's the first time a fragrance felt like it was actually made for my personality, not just a trend.",
  },
  {
    name: "Marcus Thorne",
    role: "Creative Director",
    text: "Minimalist, premium, and lasting. Scentiva Aura understands the power of subtlety. The 'Office' collection is my daily staple.",
  },
  {
    name: "Sophia Chen",
    role: "Fashion Designer",
    text: "The packaging, the scent, the philosophy — everything is perfect. A truly premium experience from start to finish.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-surface border-t border-parchment/5" id="reviews">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-sm uppercase tracking-[0.4em] text-gold-oud mb-4">Voices</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-4xl font-serif text-parchment">The Aura Experience</h3>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col space-y-6"
            >
              <div className="flex text-gold-oud">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-parchment/70 font-serif italic text-lg leading-relaxed">
                "{review.text}"
              </p>
              <div>
                <h4 className="text-parchment font-bold text-sm tracking-widest uppercase">{review.name}</h4>
                <p className="text-gold-oud/60 text-xs uppercase tracking-widest mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
