"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
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
      <FinalCTA />
      <Footer />
    </main>
  );
}
