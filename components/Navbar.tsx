"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { WHATSAPP_NUMBER } from "@/lib/delivery";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Find My Scent", href: "/#scent-assistant" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const accountHref = isAdmin ? "/admin" : user ? "/dashboard" : "/signin";
  const accountLabel = isAdmin ? "Admin" : user ? "Account" : "Sign In";

  const closeMobile = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const utilityLinks = (
    <div className="flex items-center gap-4 sm:gap-5 font-bold text-parchment">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-1.5 text-[#25D366] hover:opacity-80 transition-opacity normal-case text-sm"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={16} />
        WhatsApp
      </a>
      <ThemeToggle className="font-bold" />
      <Link href={accountHref} className="hover:text-gold-oud transition-colors text-sm">
        {accountLabel}
      </Link>
      <button
        onClick={() => setIsCartOpen(true)}
        className="hover:text-gold-oud transition-colors text-sm"
      >
        Cart ({totalItems})
      </button>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center py-3 md:py-4">
            <Link href="/" className="inline-block">
              <Image
                src="/01_primary_logo_transparent.png"
                alt="Scentiva Aura"
                width={360}
                height={120}
                className="object-contain h-12 sm:h-14 md:h-16 w-auto min-w-[180px] sm:min-w-[220px] brightness-0 dark:brightness-100 opacity-90 dark:opacity-100"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 pb-4 font-bold text-parchment uppercase">
            <div aria-hidden="true" />
            <nav className="flex items-center justify-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-gold-oud transition-colors text-sm tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="justify-self-end">{utilityLinks}</div>
          </div>

          <div className="flex md:hidden items-center justify-between pb-3 font-bold text-parchment">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="hover:text-gold-oud transition-colors py-1 text-sm uppercase"
              aria-label="Open menu"
            >
              Menu
            </button>
            {utilityLinks}
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-surface md:hidden flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center px-4 h-12 border-b border-parchment/10 shrink-0">
            <span className="text-parchment/50 text-sm">Menu</span>
            <button
              onClick={closeMobile}
              className="text-parchment flex items-center gap-2 py-2 text-sm"
              aria-label="Close menu"
            >
              Close <X size={16} />
            </button>
          </div>

          <div className="flex-1 px-6 py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="text-lg text-parchment py-3 border-b border-parchment/5 hover:text-gold-oud"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              className="text-lg text-[#25D366] py-3 border-b border-parchment/5 flex items-center gap-2"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
            <Link
              href={accountHref}
              onClick={closeMobile}
              className="text-lg text-parchment py-3 border-b border-parchment/5 hover:text-gold-oud"
            >
              {accountLabel}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
