"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCcw, ChevronRight, Check, Loader2, Sparkles } from "lucide-react";
import { ProductService } from "@/lib/services/product.service";
import ProductModal from "./ProductModal";

const steps = [
  {
    question: "What best describes your personality?",
    options: ["Calm", "Bold", "Energetic", "Elegant"],
    key: "personality"
  },
  {
    question: "Select your primary usage need:",
    options: ["Work", "Dates", "Daily wear", "Events"],
    key: "need"
  },
  {
    question: "What climate do you naturally gravitate towards?",
    options: ["Warm & Sun-Drenched", "Cool Harmattan Breeze", "Fresh Tropical Rains", "Crisp & Dry"],
    key: "climate"
  },
  {
    question: "What fragrance notes intrigue you the most?",
    options: ["Deep & Woody", "Fresh & Citrusy", "Rich & Spicy", "Soft & Floral"],
    key: "notes"
  }
];

export default function ScentAssistantModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showProduct, setShowProduct] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          const data = await ProductService.fetchAll();
          setProducts(data);
        } catch (err) {
          console.error("Failed to fetch products for AI assistant", err);
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  const handleOption = (ans: string) => {
    const newAnswers = { ...answers, [steps[step].key]: ans };
    setAnswers(newAnswers);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      generateRecommendation(newAnswers);
    }
  };

  const generateRecommendation = (finalAnswers: Record<string, string>) => {
    if (products.length === 0) {
      setResult("no-match");
      setStep(steps.length);
      return;
    }

    // Matching Algorithm
    const scoredProducts = products.map(product => {
      let score = 0;
      const combinedText = `
        ${product.name} 
        ${product.desc} 
        ${product.tag} 
        ${product.category} 
        ${product.perfectOccasion} 
      `.toLowerCase();

      Object.values(finalAnswers).forEach(answer => {
        const keywords = answer.toLowerCase().split(/[ &]/);
        keywords.forEach(keyword => {
          if (keyword.length > 2 && combinedText.includes(keyword)) {
            score += 1;
          }
        });
      });

      if (product.perfectOccasion?.toLowerCase().includes(finalAnswers.need?.toLowerCase())) {
        score += 2;
      }

      return { ...product, score };
    });

    const sorted = scoredProducts.sort((a, b) => b.score - a.score);
    
    if (sorted[0] && sorted[0].score > 0) {
      setResult(sorted[0]);
    } else {
      setResult("no-match");
    }
    setStep(steps.length);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0F0F12] border border-white/10 overflow-hidden shadow-3xl"
              style={{ borderRadius: "0px" }}
            >
              {/* Close */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-12 min-h-[450px] flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  {step < steps.length ? (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="w-full text-center"
                    >
                      <div className="mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-oud border-b border-gold-oud pb-1">Discovery Step {step + 1}</span>
                        <h3 className="text-3xl md:text-4xl font-serif text-parchment mt-8 font-bold uppercase tracking-tight leading-tight">
                          {steps[step].question}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {steps[step].options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleOption(opt)}
                            className="group flex items-center justify-between bg-white/5 border border-white/10 p-6 text-[12px] font-bold uppercase tracking-widest text-white/50 hover:border-gold-oud hover:text-gold-oud transition-all"
                          >
                            {opt}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                    >
                      {result === "no-match" ? (
                        <div className="border border-white/10 p-10 text-center flex flex-col items-center bg-white/[0.02]">
                          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Sparkles className="text-gold-oud" size={20} />
                          </div>
                          <h4 className="text-2xl font-serif text-parchment mb-4 font-bold uppercase tracking-tight">No Perfect Match Found</h4>
                          <p className="text-parchment/40 text-xs leading-relaxed mb-8 max-w-md mx-auto">
                            Your preferences are unique! Our Scent Curators can help you find a bespoke fragrance that matches your aura.
                          </p>
                          <div className="flex gap-4">
                            <a 
                              href="https://wa.me/233506626068"
                              target="_blank"
                              className="px-8 bg-gold-oud text-deep-noir py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-parchment transition-all"
                            >
                              Contact Support
                            </a>
                            <button 
                              onClick={reset}
                              className="px-6 border border-white/10 text-white/40 hover:text-white transition-all"
                            >
                              <RefreshCcw size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-stretch text-left border border-white/10 bg-white/[0.02]">
                          <div className="relative w-full md:w-56 h-72 overflow-hidden shrink-0">
                            <Image src={result?.image} alt={result?.name} fill sizes="224px" className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          
                          <div className="p-8 flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-emerald-400 mb-4">
                              <Check size={14} strokeWidth={3} />
                              <span className="text-[9px] font-bold uppercase tracking-widest">Perfect Match Found</span>
                            </div>
                            
                            <h4 className="text-3xl font-serif text-parchment mb-2 font-bold uppercase leading-tight">{result?.name}</h4>
                            <p className="text-parchment/40 text-xs leading-relaxed mb-8">{result?.desc}</p>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setShowProduct(true)}
                                className="flex-1 bg-gold-oud text-deep-noir py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-parchment transition-all shadow-xl shadow-gold-oud/10"
                              >
                                View Details
                              </button>
                              <button 
                                onClick={reset}
                                className="px-6 border border-white/10 text-white/40 hover:text-white transition-all"
                              >
                                <RefreshCcw size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProductModal product={showProduct ? result : null} onClose={() => setShowProduct(false)} />
    </>
  );
}
