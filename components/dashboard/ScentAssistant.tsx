"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCcw, ChevronRight, Check, Sparkles, Loader2 } from "lucide-react";
import { ProductService } from "@/lib/services/product.service";

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

const ScentAssistant = ({ onViewProduct }: { onViewProduct: (product: any) => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
    if (products.length === 0) return;

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

      // Check each answer against product details
      Object.values(finalAnswers).forEach(answer => {
        const keywords = answer.toLowerCase().split(/[ &]/);
        keywords.forEach(keyword => {
          if (keyword.length > 2 && combinedText.includes(keyword)) {
            score += 1;
          }
        });
      });

      // Boost score if perfectOccasion matches 'need' exactly
      if (product.perfectOccasion?.toLowerCase().includes(finalAnswers.need?.toLowerCase())) {
        score += 2;
      }

      return { ...product, score };
    });

    // Sort by score descending
    const sorted = scoredProducts.sort((a, b) => b.score - a.score);
    
    // Pick the best match if score > 0
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
    <div className="bg-white border border-[#E8E9EC] p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
      {loadingProducts && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
          <Loader2 className="text-[#D8B34B] animate-spin mb-4" size={40} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1B23]">Initializing Aura AI...</p>
        </div>
      )}
      <div className="max-w-2xl w-full text-center">
        <AnimatePresence mode="wait">
          {step < steps.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D8B34B] border-b border-[#D8B34B] pb-1">Selection {step + 1} of {steps.length}</span>
                <h3 className="text-2xl md:text-3xl font-serif text-[#1A1B23] mt-8 font-bold uppercase tracking-tight">{steps[step].question}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps[step].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="group flex items-center justify-between bg-white border border-[#E8E9EC] p-6 text-[12px] font-bold uppercase tracking-widest text-[#9CA3AF] hover:border-[#1A1B23] hover:text-[#1A1B23] transition-all"
                  >
                    {opt}
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              {result === "no-match" ? (
                <div className="border border-[#E8E9EC] p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#F5F6FA] rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="text-[#9CA3AF]" size={24} />
                  </div>
                  <h4 className="text-2xl font-serif text-[#1A1B23] mb-4 font-bold uppercase">No Perfect Match Found</h4>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8 max-w-md">
                    Your preferences are unique! Our Scent Curators can help you find a bespoke fragrance that matches your aura.
                  </p>
                  <div className="flex gap-4">
                    <a 
                      href="https://wa.me/233506626068"
                      target="_blank"
                      className="px-10 bg-[#1A1B23] text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                    >
                      Contact Support
                    </a>
                    <button 
                      onClick={reset}
                      className="px-6 border border-[#E8E9EC] text-[#9CA3AF] hover:text-[#1A1B23] transition-all"
                    >
                      <RefreshCcw size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-[#E8E9EC] flex flex-col md:flex-row items-stretch text-left">
                  <div className="relative w-full md:w-64 h-80 overflow-hidden bg-[#F5F6FA] shrink-0 border-r border-[#E8E9EC]">
                    <Image src={result?.image} alt={result?.name} fill sizes="256px" className="object-cover" />
                  </div>
                  
                  <div className="p-10 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-emerald-600 mb-4">
                      <Check size={14} strokeWidth={3} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Recommended Match</span>
                    </div>
                    
                    <h4 className="text-3xl font-serif text-[#1A1B23] mb-3 font-bold uppercase">{result?.name}</h4>
                    <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8">{result?.desc}</p>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onViewProduct(result)}
                        className="flex-1 bg-[#1A1B23] text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                      >
                        View Product
                      </button>
                      <button 
                        onClick={reset}
                        className="px-6 border border-[#E8E9EC] text-[#9CA3AF] hover:text-[#1A1B23] transition-all"
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
  );
};


export default ScentAssistant;
