"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="w-full bg-surface uppercase py-5 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Shorter, wider crop — no white box frame */}
        <div className="relative mx-auto w-full max-w-3xl lg:max-w-4xl h-[200px] sm:h-[240px] md:h-[340px] lg:h-[380px] overflow-hidden">
          <Image
            src="/hero-perfume.png"
            alt="Scentiva Aura — premium fragrance"
            fill
            sizes="(max-width: 1024px) 90vw, 896px"
            className="object-cover object-[22%_center] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-surface/70 dark:to-surface/90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

          <div className="absolute bottom-0 left-0 z-10 p-4 sm:p-5 md:p-6 max-w-[90%] sm:max-w-[75%]">
            <h1 className="hero-headline text-white text-xl sm:text-2xl md:text-3xl leading-tight mb-2">
              Premium scents.
              <br />
              Order in 2 taps.
            </h1>
            <p className="text-white/75 text-sm normal-case max-w-sm">
              Browse, pick your fragrance, and confirm on WhatsApp.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl lg:max-w-4xl mt-4 md:mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-gold-oud text-deep-noir px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Browse Shop
          </Link>
          <button
            onClick={() =>
              document.getElementById("scent-assistant")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-parchment/70 hover:text-parchment transition-colors text-sm normal-case"
          >
            Not sure? Find your scent →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
