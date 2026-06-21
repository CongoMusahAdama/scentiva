"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Check, Sparkles } from "lucide-react";
import { ProductService } from "@/lib/services/product.service";
import ProductModal from "./ProductModal";
import { ScrollEyebrow, ScrollHeading, ScrollText } from "@/components/ScrollReveal";

const steps = [
  {
    question: "What best describes your personality?",
    options: ["Calm", "Bold", "Energetic", "Elegant"],
    key: "personality",
  },
  {
    question: "Select your primary usage need:",
    options: ["Work", "Dates", "Daily wear", "Events"],
    key: "need",
  },
  {
    question: "What climate do you naturally gravitate towards?",
    options: ["Warm & Sun-Drenched", "Cool Harmattan Breeze", "Fresh Tropical Rains", "Crisp & Dry"],
    key: "climate",
  },
  {
    question: "What fragrance notes intrigue you the most?",
    options: ["Deep & Woody", "Fresh & Citrusy", "Rich & Spicy", "Soft & Floral"],
    key: "notes",
  },
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

    const scoredProducts = products.map((product) => {
      let score = 0;
      const combinedText = `
        ${product.name} 
        ${product.desc} 
        ${product.tag} 
        ${product.category} 
        ${product.perfectOccasion} 
        ${product.pros?.join(" ")}
      `.toLowerCase();

      Object.values(finalAnswers).forEach((answer) => {
        const keywords = answer.toLowerCase().split(/[ &]/);
        keywords.forEach((keyword) => {
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

  const progress = step < steps.length ? ((step + 1) / steps.length) * 100 : 100;

  return (
    <section id="scent-assistant" className="py-10 md:py-16 bg-surface relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-oud/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Compact header */}
          <div className="text-center mb-5 md:mb-8">
            <ScrollEyebrow className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-oud mb-2">
              Discovery Experience
            </ScrollEyebrow>
            <ScrollHeading
              as="h3"
              className="text-2xl sm:text-3xl md:text-5xl font-serif text-parchment font-bold leading-tight"
            >
              Find Your Signature
            </ScrollHeading>
            <ScrollText
              delay={0.25}
              className="text-parchment/50 text-xs md:text-sm mt-2 max-w-md mx-auto hidden sm:block"
            >
              Answer a few quick questions — we&apos;ll match you with a fragrance for your lifestyle.
            </ScrollText>
          </div>

          {/* Quiz card — shorter on mobile */}
          <div className="border border-parchment/10 bg-elevated p-4 sm:p-6 md:p-8">
            {step < steps.length && (
              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-parchment/40 mb-2">
                  <span>Step {step + 1} of {steps.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 bg-parchment/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold-oud"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step < steps.length ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-sm sm:text-lg md:text-2xl font-serif text-parchment font-medium uppercase tracking-tight text-center mb-4 md:mb-6 leading-snug">
                    {steps[step].question}
                  </h4>

                  {/* 2×2 grid on mobile — much shorter than 4 stacked rows */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xl mx-auto">
                    {steps[step].options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleOption(opt)}
                        disabled={loadingProducts}
                        className="flex items-center justify-center text-center min-h-[52px] sm:min-h-[60px] px-2 py-3 sm:p-4 border border-parchment/15 bg-surface text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-parchment/70 hover:border-gold-oud hover:text-gold-oud hover:bg-gold-oud/5 transition-all leading-tight"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  {result === "no-match" ? (
                    <div className="text-center py-6 md:py-10 px-2">
                      <div className="w-12 h-12 bg-gold-oud/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="text-gold-oud" size={20} />
                      </div>
                      <h4 className="text-lg md:text-2xl font-serif text-parchment mb-2 font-bold uppercase">
                        No Perfect Match Found
                      </h4>
                      <p className="text-parchment/50 text-xs md:text-sm mb-5 max-w-sm mx-auto">
                        Our curators can help you find a bespoke fragrance.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <a
                          href="https://wa.me/233203154307"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 bg-gold-oud text-deep-noir py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-deep-noir hover:text-surface transition-all"
                        >
                          Contact Support
                        </a>
                        <button
                          type="button"
                          onClick={reset}
                          className="px-4 py-2.5 border border-parchment/15 text-parchment/50 hover:text-parchment transition-all"
                          aria-label="Start over"
                        >
                          <RefreshCcw size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="relative w-full sm:w-40 md:w-52 h-40 sm:h-auto sm:min-h-[180px] shrink-0 overflow-hidden">
                        <Image
                          src={result?.image}
                          alt={result?.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 208px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-500 mb-2">
                          <Check size={12} strokeWidth={3} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Match Found</span>
                        </div>
                        <h4 className="text-xl md:text-3xl font-serif text-parchment mb-2 font-bold uppercase leading-tight">
                          {result?.name}
                        </h4>
                        <p className="text-parchment/50 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                          {result?.desc}
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <button
                            type="button"
                            onClick={() => setShowProduct(true)}
                            className="px-6 bg-gold-oud text-deep-noir py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-deep-noir hover:text-surface transition-all"
                          >
                            View Fragrance
                          </button>
                          <button
                            type="button"
                            onClick={reset}
                            className="px-4 py-2.5 border border-parchment/15 text-parchment/50 hover:text-parchment transition-all"
                            aria-label="Start over"
                          >
                            <RefreshCcw size={14} />
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
