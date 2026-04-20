"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home",    href: "/#" },
  { label: "Shop",    href: "/shop" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About",   href: "/about" },
];

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-deep-noir/90 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/01_primary_logo_transparent.png"
            alt="Scentiva Aura Logo"
            width={140}
            height={50}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm uppercase tracking-widest text-parchment/70 hover:text-gold-oud transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6 text-parchment">
          <button className="hover:text-gold-oud transition-colors">
            <Heart size={20} />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="hover:text-gold-oud transition-colors relative"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-oud text-deep-noir text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <Link href="/signin" className="hover:text-gold-oud transition-colors">
            <User size={20} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-parchment"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-deep-noir border-t border-parchment/10 py-6 px-6 flex flex-col space-y-4 animate-fade-in shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg tracking-widest text-parchment hover:text-gold-oud"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex space-x-6 pt-4 border-t border-parchment/10">
            <Heart size={20} />
            <button 
              onClick={() => {
                setIsCartOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="relative"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-oud text-deep-noir text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
              <User size={20} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
