"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, ChevronRight, Check, Loader2, Sparkles } from "lucide-react";
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

export default function ScentAssistantSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showProduct, setShowProduct] = useState(false);

  React.useEffect(() => {
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
  }, []);

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
        ${product.pros?.join(" ")}
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
    <section id="scent-assistant" className="py-16 bg-deep-noir overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-oud/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-3/4 bg-gold-oud/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold-oud mb-4">Discovery Experience</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-parchment font-bold leading-tight">Find Your Signature</h3>
            <p className="text-parchment/40 text-sm mt-4 max-w-lg mx-auto">Answer a few questions and our AI will match you with a fragrance that fits your lifestyle.</p>
          </div>

          <div className="relative min-h-[380px] flex items-center justify-center bg-white/[0.02] border border-white/5 p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step < steps.length ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <div className="text-center mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-oud/60">Stage {step + 1} of {steps.length}</span>
                    <h4 className="text-2xl md:text-3xl font-serif text-parchment mt-6 font-medium uppercase tracking-tight">{steps[step].question}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {steps[step].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOption(opt)}
                        className="group flex items-center justify-between bg-white/[0.03] border border-white/10 p-6 text-[12px] font-bold uppercase tracking-widest text-white/50 hover:border-gold-oud hover:text-gold-oud hover:bg-gold-oud/5 transition-all"
                      >
                        {opt}
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  {result === "no-match" ? (
                    <div className="border border-white/10 p-12 text-center flex flex-col items-center bg-white/[0.02]">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="text-gold-oud" size={24} />
                      </div>
                      <h4 className="text-2xl font-serif text-parchment mb-4 font-bold uppercase tracking-tight">No Perfect Match Found</h4>
                      <p className="text-parchment/40 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                        Your preferences are unique! Our Scent Curators can help you find a bespoke fragrance that matches your aura perfectly.
                      </p>
                      <div className="flex gap-4">
                        <a 
                          href="https://wa.me/233506626068"
                          target="_blank"
                          className="px-10 bg-gold-oud text-deep-noir py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-parchment transition-all"
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
                    <div className="flex flex-col md:flex-row items-stretch bg-white/[0.03] border border-white/10">
                      <div className="relative w-full md:w-72 h-80 overflow-hidden shrink-0">
                        <Image src={result?.image} alt={result?.name} fill sizes="288px" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-noir/80 to-transparent" />
                      </div>
                      
                      <div className="p-10 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-emerald-400 mb-4">
                          <Check size={14} strokeWidth={3} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Match Discovered</span>
                        </div>
                        
                        <h4 className="text-3xl md:text-4xl font-serif text-parchment mb-3 font-bold uppercase leading-tight">{result?.name}</h4>
                        <p className="text-parchment/40 text-sm leading-relaxed mb-10">{result?.desc}</p>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => setShowProduct(true)}
                            className="flex-1 bg-gold-oud text-deep-noir py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-parchment transition-all shadow-xl shadow-gold-oud/10"
                          >
                            View Fragrance
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
        </div>
      </div>

      <ProductModal product={showProduct ? result : null} onClose={() => setShowProduct(false)} />
    </section>
  );
}
