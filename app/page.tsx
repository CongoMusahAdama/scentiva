"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import ScentAssistantSection from "@/components/ScentAssistantSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ScentAssistantSection />
      <CategoriesSection />
      <FeaturedProducts />
      <ProblemSection />
      <SolutionSection />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
